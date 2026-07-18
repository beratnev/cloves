"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/lib/store/cart"
import { useTranslation } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function CartPage() {
  const { t } = useTranslation()
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Ensure hydration matches since we are using localStorage persistence
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container py-16 min-h-[70vh]" />
  }

  const subtotal = getSubtotal()
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal >= 20 ? 0 : (subtotal > 0 ? 10 : 0)
  const total = subtotal + tax + shipping

  if (items.length === 0) {
    return (
      <div className="container py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto space-y-6"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{t("cartEmpty" as any)}</h1>
          </div>
          <div className="pt-4 flex justify-center">
            <Button asChild size="lg">
              <Link href="/products">{t("continueShopping" as any)}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t("cartTitle" as any)}</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="flex flex-col sm:flex-row overflow-hidden">
              <div className="relative w-full sm:w-48 aspect-square sm:aspect-auto bg-muted shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-1 p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                    <p className="text-muted-foreground font-medium mt-1">
                      ${(item.discountPrice || item.price).toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="w-10 text-center text-sm font-medium pt-1">
                      {item.quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{t("total" as any)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("subtotal" as any)}</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("tax" as any)}</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("shipping" as any)}</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total" as any)}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">{t("checkout" as any)}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
