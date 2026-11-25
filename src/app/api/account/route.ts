import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { authNameSchema, emailSchema } from "@/lib/validation";
import { z } from "zod";

const updateAccountSchema = z.object({
  name: authNameSchema,
  email: emailSchema.optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ code: "UNAUTHORIZED", message: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ code: "INVALID_JSON", message: "Invalid request body" }, { status: 400 });
    }

    const parsed = updateAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;
    const dataToUpdate: { name: string; email?: string } = { name };

    if (email) {
      const existing = await prisma.user.findFirst({
        where: {
          email: { equals: email, mode: "insensitive" },
          NOT: { id: session.user.id },
        },
        select: { id: true },
      });

      if (existing) {
        return NextResponse.json(
          { code: "EMAIL_ALREADY_EXISTS", message: "An account with this email already exists." },
          { status: 409 }
        );
      }
      dataToUpdate.email = email;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Account update error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Failed to update account" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ code: "UNAUTHORIZED", message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existingUser) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", message: "Failed to delete account" },
      { status: 500 }
    );
  }
}
