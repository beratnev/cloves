"use client"

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Truck, Shield, ShoppingBag, Heart, Shirt, Search, User, Menu, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

interface AdminProduct {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  department: string
  price: number
  comparePrice: number | null
  stock: number
  status: "active" | "draft" | "archived"
  featured: boolean
  images: any[]; attributes?: Record<string, string>
}

export default function Home() {
  const { t } = useTranslation();
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([])
  const [currentHero, setCurrentHero] = useState(0);

  const heroBanners = [
    {
      title: t("newSeasonCollection" as any),
      subtitle: t("discoverLatestTrends" as any),
      cta: t("shopNow" as any),
      color: "from-rose-500/20 to-purple-500/20",
      image: "/hero-1.jpg",
    },
    {
      title: t("summerEssentials" as any),
      subtitle: t("lightFabrics" as any),
      cta: t("explore" as any),
      color: "from-blue-500/20 to-cyan-500/20",
      image: "/hero-2.jpg",
    },
    {
      title: t("quietLuxury" as any),
      subtitle: t("understatedElegance" as any),
      cta: t("viewCollection" as any),
      color: "from-amber-500/20 to-orange-500/20",
      image: "/hero-3.jpg",
    },
  ]

  const categories = [
    { name: "BODY CARE", department: "BODY CARE", slug: "body-care", icon: "/icons/icon-5.png" },
    { name: "SKINCARE", department: "SKINCARE", slug: "skincare", icon: "/icons/icon-3.png" },
    { name: "FRAGRANCE", department: "FRAGRANCE", slug: "fragrance", icon: "/icons/icon-6.png" },
    { name: "BATH & SHOWER", department: "BATH & SHOWER", slug: "bath-shower", icon: "/icons/icon-7.png" },
    { name: "HAIR CARE", department: "HAIR CARE", slug: "hair-care", icon: "/icons/icon-1.png" },
    { name: "HOME FRAGRANCE", department: "HOME FRAGRANCE", slug: "home-fragrance", icon: "/icons/icon-2.png" },
  ]

  const promotions = [
    {
      title: t("summerSale" as any),
      subtitle: t("summerSaleDesc" as any),
      code: "SUMMER50",
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
    },
    {
      title: t("freeShipping" as any),
      subtitle: t("freeShippingDesc" as any),
      code: "FREESHIP",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
  ]

  const editorialSections = [
    {
      title: t("theArtOfLayering" as any),
      subtitle: t("masterLayering" as any),
      image: "/editorial-1.jpg",
      category: t("styleGuide" as any),
    },
    {
      title: t("summerWardrobe" as any),
      subtitle: t("mustHavePieces" as any),
      image: "/editorial-2.jpg",
      category: t("trends" as any),
    },
  ]



  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products?limit=50', { cache: 'no-store' })
        const data = await res.json()
        if (data.products) {
          setAdminProducts(data.products)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchProducts()
  }, [])

  const getCategoryCount = (departmentName: string) => {
    return adminProducts.filter(p => p.status === 'active' && p.department === departmentName).length
  }

  // Convert admin products to display format
  const convertProduct = (p: AdminProduct) => ({
    id: p.id,
    name: p.name,
    slug: p.name.toLowerCase().replace(/\s+/g, '-'),
    price: p.price,
    discountPrice: p.comparePrice || undefined,
    images: p.images.length > 0 ? p.images.map((img: any) => img.secureUrl) : ["/placeholder-product.jpg"],
    category: p.category,
    rating: 4.5,
    reviewCount: 10,
    featured: p.featured,
  })

  const newArrivalsList = adminProducts
    .filter(p => p.status === 'active')
    .slice(0, 4)
    .map(convertProduct)
    .map(p => ({ ...p, isNew: true }))

  const bestSellersList = adminProducts
    .filter(p => p.status === 'active' && p.featured)
    .slice(0, 4)
    .map(convertProduct)

  return (
    <div className="flex flex-col">
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden py-6">
        <div className="w-3/5 mx-auto rounded-xl overflow-hidden aspect-[7/2] md:aspect-[3/1] relative shadow-lg">
          {heroBanners.map((banner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: currentHero === index ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-br ${banner.color} flex items-center justify-center`}
            >
              <div className="container text-center">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Badge className="mb-4 bg-background/50 backdrop-blur-sm">{t("newCollection" as any)}</Badge>
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{banner.title}</h1>
                  <p className="text-xl md:text-2xl text-muted-foreground mb-8">{banner.subtitle}</p>
                  <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90" asChild>
                    <Link href="/products">{banner.cta}</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          {/* Hero Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentHero === index ? 'bg-foreground w-8' : 'bg-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`} className="group">
                <div className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform flex items-center justify-center">
                    {category.icon.startsWith('/') ? (
                      <div className="relative w-12 h-12">
                        <Image src={category.icon} alt={category.name} fill className="object-contain dark:invert" />
                      </div>
                    ) : (
                      category.icon
                    )}
                  </div>
                  <div className="font-semibold group-hover:text-primary transition-colors">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{getCategoryCount(category.department)} {t("items" as any)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {promotions.map((promo, index) => (
              <Card key={index} className={`border-0 overflow-hidden ${promo.color} text-white`}>
                <CardContent className="p-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                    <p className="opacity-90 mb-4">{promo.subtitle}</p>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {promo.code}
                    </Badge>
                  </div>
                  <Button size="lg" variant="secondary" className="bg-white text-foreground hover:bg-white/90" asChild>
                    <Link href="/products">{t("shopNow" as any)}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">{t("newArrivals" as any)}</h2>
              <p className="text-muted-foreground">{t("freshStyles" as any)}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products?sort=newest">{t("viewAll" as any)} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivalsList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">{t("bestSellers" as any)}</h2>
              <p className="text-muted-foreground">{t("mostLoved" as any)}</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products?sort=bestsellers">{t("viewAll" as any)} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellersList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>





      {/* Need Help Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">{t("needHelp" as any)}</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("aiAssistantDesc" as any)}
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shirt className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("styleAdvice" as any)}</h3>
                  <p className="text-sm text-muted-foreground">{t("styleAdviceDesc" as any)}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("outfitIdeas" as any)}</h3>
                  <p className="text-sm text-muted-foreground">{t("outfitIdeasDesc" as any)}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{t("instantHelp" as any)}</h3>
                  <p className="text-sm text-muted-foreground">{t("instantHelpDesc" as any)}</p>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Sparkles className="h-4 w-4 mr-2" />
              {t("tryAiAssistant" as any)}
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">{t("stayInStyle" as any)}</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("subscribeDesc" as any)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t("enterEmail" as any)}
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background"
                />
                <Button className="bg-foreground text-background hover:bg-foreground/90">{t("subscribe" as any)}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("freeShipping" as any)}</h3>
                <p className="text-sm text-muted-foreground">{t("freeShippingDesc" as any)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("securePayment" as any)}</h3>
                <p className="text-sm text-muted-foreground">{t("securePaymentDesc" as any)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("easyReturns" as any)}</h3>
                <p className="text-sm text-muted-foreground">{t("easyReturnsDesc" as any)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("premiumQuality" as any)}</h3>
                <p className="text-sm text-muted-foreground">{t("premiumQualityDesc" as any)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
