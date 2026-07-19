"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Check, Sparkles, Plus, Minus, ShoppingCart, X, Ruler, Shirt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Price } from "@/components/ui/price"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/shop/product-card"
import { motion } from "framer-motion"
import { useCartStore } from "@/lib/store/cart"
import { useTranslation } from "@/lib/i18n"
import { translateDbString } from "@/lib/i18n/db-translations"
import { useParams } from "next/navigation"
import { useEffect } from "react"


export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { t, language } = useTranslation()
  const [product, setProduct] = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch(`/api/admin/products/${slug}`)
        const data = await res.json()
        const found = data.product
        
        if (found) {
          const parsedColors = found.attributes?.Color ? found.attributes.Color.split(',').map((c: string) => c.trim()) : [];
          const parsedSizes = found.attributes?.Size ? found.attributes.Size.split(',').map((s: string) => s.trim()) : 
                              (found.attributes?.Volume ? found.attributes.Volume.split(',').map((v: string) => v.trim()) : []);

          setProduct({
            id: found.id,
            name: found.name,
            slug: found.slug || found.name.toLowerCase().replace(/\s+/g, '-'),
            price: found.price,
            discountPrice: found.comparePrice || undefined,
            images: found.images && found.images.length > 0 
              ? found.images.map((img: any) => img.secureUrl) 
              : ["/placeholder-product.jpg"],
            category: found.category || "Uncategorized",
            department: found.department || "",
            description: found.description || "No description available for this product.",
            inStock: found.stock > 0,
            brand: found.attributes?.Brand || "Clove's",
            material: found.attributes?.Material || "-",
            colors: parsedColors,
            sizes: parsedSizes,
            careInstructions: found.attributes?.Care || "Check product label for care instructions.",
            aiAdvice: found.aiAdvice,
            attributes: found.attributes,
            sku: found.sku,
            barcode: found.barcode,
            weight: found.weight,
            dimensions: found.dimensions,
            ingredients: found.ingredients,
            howToUse: found.howToUse,
          })
          
          if (parsedColors.length > 0) setSelectedColor(parsedColors[0])
          if (parsedSizes.length > 0) setSelectedSize(parsedSizes[0])

          // Fetch similar products (category-based, limited to 4)
          try {
            const similarRes = await fetch(`/api/admin/products?limit=4&category=${found.category}`)
            const similarData = await similarRes.json()
            const similar = (similarData.products || [])
              .filter((p: any) => p.id !== found.id)
              .slice(0, 4)
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
                price: p.price,
                discountPrice: p.comparePrice,
                images: p.images && p.images.length > 0 ? p.images.map((i: any) => i.secureUrl) : ["/placeholder-product.jpg"],
                category: p.category,
                featured: p.featured,
              }))
            
            setSimilarProducts(similar)
          } catch (e) {
            console.error("Failed to fetch similar products", e)
          }
        }
      } catch (e) {
        console.error("Failed to fetch product", e)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProductDetails()
  }, [slug])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("Black")
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0],
    })
  }

  if (loading) {
    return <div className="container py-8 flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  if (!product) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>{translateDbString("Home", language)}</span>
        <span>/</span>
        <span>{product.department ? translateDbString(product.department, language) : translateDbString("Department", language)}</span>
        <span>/</span>
        <span>{translateDbString(product.category, language)}</span>
        <span>/</span>
        <span className="text-foreground">{translateDbString(product.name, language)}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto w-full"
        >
          <div className="relative aspect-square rounded-lg overflow-hidden bg-transparent mb-4 border shadow-sm">
            {product.images && product.images[selectedImage] ? (
              <Image 
                src={product.images[selectedImage]} 
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <span className="text-muted-foreground">Product Image</span>
              </div>
            )}
            {product.discountPrice && (
              <Badge className="absolute top-4 left-4 bg-destructive">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </Badge>
            )}
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-background/50 backdrop-blur" onClick={() => setIsWishlisted(!isWishlisted)}>
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-md overflow-hidden bg-transparent border-2 transition-all ${
                  selectedImage === index ? "border-primary" : "border-transparent hover:border-primary/50"
                }`}
              >
                {img ? (
                  <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-contain p-2" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <Badge variant="outline" className="mb-2">
              {product.brand}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">{translateDbString(product.name, language)}</h1>

            <div className="flex items-baseline gap-3">
              {product.discountPrice ? (
                <>
                  <Price amount={product.discountPrice} className="text-2xl font-bold" />
                  <Price amount={product.price} className="text-lg text-muted-foreground line-through" />
                </>
              ) : (
                <Price amount={product.price} className="text-2xl font-bold" />
              )}
            </div>
          </div>

          <Separator />

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">{t("color" as any)}: <span className="text-muted-foreground font-normal">{selectedColor}</span></h3>
              <div className="flex gap-3">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                    style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, '') }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{t("size" as any)}: <span className="text-muted-foreground font-normal">{selectedSize}</span></h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                      selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">{t("inStockReady" as any)}</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{t("outOfStock" as any)}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" className="flex-1 h-12" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t("addToCart" as any)}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsWishlisted(!isWishlisted)}>
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>{t("freeShipping" as any)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>{t("authentic" as any)}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <span>{t("thirtyDayReturns" as any)}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">{t("description" as any)}</h3>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              {translateDbString(product.description, language).split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, index: number) => (
                <p key={index} className="indent-4 text-justify">{paragraph}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Product Advice */}
      {product.aiAdvice && (product.aiAdvice.keyBenefits?.length > 0 || product.aiAdvice.usageTips?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">{t("aiProductAdvice" as any) || "AI Product Advice"}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {product.aiAdvice.keyBenefits && product.aiAdvice.keyBenefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {t("keyBenefits" as any) || "Key Benefits"}
                    </h4>
                    <ul className="space-y-2">
                      {product.aiAdvice.keyBenefits.map((benefit: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {translateDbString(benefit, language)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.aiAdvice.usageTips && product.aiAdvice.usageTips.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      {t("usageTips" as any) || "Usage Tips"}
                    </h4>
                    <ul className="space-y-2">
                      {product.aiAdvice.usageTips.map((tip: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {translateDbString(tip, language)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}



      {/* Product Details Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">{t("details" as any)}</TabsTrigger>
            <TabsTrigger value="shipping">{t("shipping" as any)}</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {product.brand && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t("brandLabel" as any) || "Brand"}</span>
                      <span className="font-medium text-right">{translateDbString(product.brand, language)}</span>
                    </div>
                  )}
                  {product.department && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t("departmentLabel" as any) || "Department"}</span>
                      <span className="font-medium text-right">{translateDbString(product.department, language)}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t("categoryLabel" as any) || "Category"}</span>
                      <span className="font-medium text-right">{translateDbString(product.category, language)}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t("skuLabel" as any) || "SKU"}</span>
                      <span className="font-medium text-right">{product.sku}</span>
                    </div>
                  )}
                  {product.barcode && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t("barcodeLabel" as any) || "Barcode"}</span>
                      <span className="font-medium text-right">{product.barcode}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t("weightLabel" as any) || "Weight (g)"}</span>
                      <span className="font-medium text-right">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">{t("dimensionsLabel" as any) || "Dimensions"}</span>
                      <span className="font-medium text-right">{product.dimensions}</span>
                    </div>
                  )}
                  {product.ingredients && (
                    <div className="flex flex-col py-3 border-b">
                      <span className="text-muted-foreground mb-1">{t("ingredientsLabel" as any) || "Ingredients"}</span>
                      <span className="text-sm">{product.ingredients}</span>
                    </div>
                  )}
                  {product.howToUse && (
                    <div className="flex flex-col py-3 border-b last:border-0">
                      <span className="text-muted-foreground mb-1">{t("howToUseLabel" as any) || "How to Use"}</span>
                      <span className="text-sm">{translateDbString(product.howToUse, language)}</span>
                    </div>
                  )}
                  {product.attributes && Object.entries(product.attributes).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex flex-col sm:flex-row justify-between py-3 border-b last:border-0 gap-2">
                        <span className="text-muted-foreground min-w-[150px]">{translateDbString(key, language)}</span>
                        <span className="font-medium text-sm sm:text-base text-right">{translateDbString(String(value), language)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{t("freeShipping" as any)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("freeShippingDesc" as any)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{t("thirtyDayReturns" as any)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("easyReturnsDesc" as any)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{t("authenticityGuarantee" as any)}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t("authenticDesc" as any)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {similarProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">{t("similarProducts" as any) || "Similar Products"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
