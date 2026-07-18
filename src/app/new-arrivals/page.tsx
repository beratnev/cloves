import { redirect } from "next/navigation"

export default function NewArrivals() {
  redirect("/products?sort=newest" as any)
}
