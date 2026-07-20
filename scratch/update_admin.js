const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin@cloves.com already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@cloves.com" }
    });
    
    if (existingAdmin) {
      console.log("admin@cloves.com already exists:", existingAdmin.id);
    } else {
      // Find the old admin
      const oldAdmin = await prisma.user.findUnique({
        where: { email: "beratnevcanoglu@outlook.com" }
      });
      
      if (oldAdmin) {
        console.log("Found old admin. Updating email...");
        const updated = await prisma.user.update({
          where: { id: oldAdmin.id },
          data: { email: "admin@cloves.com", role: "ADMIN" }
        });
        console.log("Successfully updated to:", updated.email);
      } else {
        console.log("Could not find beratnevcanoglu@outlook.com. Let's look for any ADMIN.");
        const anyAdmin = await prisma.user.findFirst({
          where: { role: "ADMIN" }
        });
        if (anyAdmin) {
            console.log("Found another admin:", anyAdmin.email);
            const updated = await prisma.user.update({
                where: { id: anyAdmin.id },
                data: { email: "admin@cloves.com" }
            });
            console.log("Successfully updated to:", updated.email);
        } else {
            console.log("No admins found in DB at all!");
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
