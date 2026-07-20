import { auth } from "@/lib/auth/config"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session || !session.user || session.user.email !== "admin@cloves.com") {
    redirect("/")
  }

  return <AdminLayout>{children}</AdminLayout>
}
