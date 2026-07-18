"use client"

import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function OrdersPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    const authState = localStorage.getItem('demo-auth')
    setIsLoggedIn(authState === 'true')
  }, [])

  if (!mounted) {
    return <div className="container py-16 min-h-[70vh]" />
  }

  if (!isLoggedIn) {
    return (
      <div className="container py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{t("pleaseSignIn" as any)}</h1>
        <p className="text-muted-foreground mb-8">{t("mustBeLoggedInToViewOrders" as any)}</p>
        <Button asChild>
          <Link href="/login">{t("signIn" as any)}</Link>
        </Button>
      </div>
    )
  }

  const mockOrders: any[] = []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-500 hover:bg-green-600">{t("delivered" as any)}</Badge>
      case "processing":
        return <Badge variant="secondary">{t("processing" as any)}</Badge>
      case "shipped":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{t("shipped" as any)}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container py-10 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t("ordersTitle" as any)}</h1>
      
      <div className="space-y-4">
        {mockOrders.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">{t("noOrders" as any)}</h3>
            <Button asChild variant="link" className="mt-2">
              <Link href="/products">{t("continueShopping" as any)}</Link>
            </Button>
          </div>
        ) : (
          mockOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{t("order" as any)} {order.id}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("date" as any)}: {order.date} • {order.items} {t("items" as any)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">{t("amount" as any)}</p>
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0" title={t("viewOrder" as any)}>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
