"use client"

import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

export default function WishlistPage() {
  const { t } = useTranslation()

  return (
    <div className="container py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto space-y-6"
      >
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("wishlistEmpty" as any)}</h1>
          <p className="text-muted-foreground">
            {t("wishlistEmptyDesc" as any)}
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t("continueShopping" as any)}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
