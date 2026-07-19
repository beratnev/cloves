"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Price } from "@/components/ui/price"
import { motion } from "framer-motion"
import { useState } from "react"
import { useCartStore } from "@/lib/store/cart"
import { useTranslation } from "@/lib/i18n"
import { translateDbString } from "@/lib/i18n/db-translations"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    discountPrice?: number
    images: string[]
    category: string
    rating?: number
    reviewCount?: number
    featured?: boolean
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useTranslation()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()
  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      discountPrice: product.discountPrice,
      image: product.images[0],
    })
  }

  const optimizeCloudinaryUrl = (url: string) => {
    if (!url || !url.startsWith('https://res.cloudinary.com/')) return url;
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_500/');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <CardContent className="p-0 flex flex-col h-full">
          <Link href={`/products/${product.slug}`}>
            <div className="relative aspect-square overflow-hidden bg-transparent">
              <Image
                src={product.images[0] ? optimizeCloudinaryUrl(product.images[0]) : "/placeholder-product.jpg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
              {discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-destructive">
                  -{discount}%
                </Badge>
              )}
              {product.featured && (
                <Badge className="absolute top-3 right-3 bg-primary">
                  {t("featured" as any)}
                </Badge>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          </Link>

          <div className="p-4 flex flex-col flex-1 justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{translateDbString(product.category, language)}</p>
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-[15px] font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {translateDbString(product.name, language)}
                </h3>
              </Link>
            </div>


            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                {product.discountPrice ? (
                  <>
                    <Price amount={product.discountPrice} className="font-bold text-lg" />
                    <Price amount={product.price} className="text-sm text-muted-foreground line-through" />
                  </>
                ) : (
                  <Price amount={product.price} className="font-bold text-lg" />
                )}
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isWishlisted ? "fill-destructive text-destructive" : ""
                    }`}
                  />
                </Button>
                <Button size="icon" className="h-8 w-8" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
