"use client"

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ArrowRight, Star, Truck, Shield, ShoppingBag, Heart, Shirt, Search, User, Menu, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { translateDbString } from "@/lib/i18n/db-translations";

interface AdminProduct {
  id: string
  name: string
  slug: string
  sku: string
  category: string
  brand: string
  department: string
  price: number
  comparePrice: number | null
  discountPrice?: number | null
  stock: number
  status: "active" | "draft" | "archived"
  featured: boolean
  images: any[]; attributes?: Record<string, string>
}

interface HomePageProps {
  initialProducts: AdminProduct[];
  initialBanners: any[];
}

export default function Home({ initialProducts, initialBanners }: HomePageProps) {
  const { t, language } = useTranslation();
  const toUpper = (str: string) => str ? str.toLocaleUpperCase(language === "TR" ? "tr-TR" : "en-US") : "";
  const [mounted, setMounted] = useState(false);
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [currentHero, setCurrentHero] = useState(0);
  const [dbBanners, setDbBanners] = useState<any[]>(initialBanners);

  const fallbackBanners = [
    {
      title: t("newSeasonCollection" as any),
      subtitle: t("discoverLatestTrends" as any),
      cta: t("shopNow" as any),
      color: "from-rose-500/20 to-purple-500/20",
      image: "/banners/1.png",
      link: "/products",
    },
    {
      title: t("summerEssentials" as any),
      subtitle: t("lightFabrics" as any),
      cta: t("explore" as any),
      color: "from-blue-500/20 to-cyan-500/20",
      image: "/banners/2.png",
      link: "/products?search=curly",
    },
    {
      title: t("quietLuxury" as any),
      subtitle: t("understatedElegance" as any),
      cta: t("viewCollection" as any),
      color: "from-amber-500/20 to-orange-500/20",
      image: "/banners/3.png",
      link: "/categories/bath-shower?productType=Shower%20Gel",
    },
  ]

  const displayBanners = dbBanners.length > 0 ? dbBanners.map(b => ({
    ...b,
    title: b.title ? t(b.title as any) : '',
    subtitle: b.subtitle ? t(b.subtitle as any) : '',
    cta: b.cta ? t(b.cta as any) : '',
  })) : fallbackBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % displayBanners.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [displayBanners.length]);

  const categories = [
    { name: t("fragrance" as any, "Fragrance"), department: "FRAGRANCE", slug: "fragrance", icon: "/icons/icon-6.png" },
    { name: t("bodyCare" as any, "Body Care"), department: "BODY CARE", slug: "body-care", icon: "/icons/body-care-icon.png" },
    { name: t("bathShower" as any, "Bath & Shower"), department: "BATH & SHOWER", slug: "bath-shower", icon: "/icons/icon-7.png" },
    { name: t("personalCare" as any, "Personal Care"), department: "SKINCARE", slug: "skincare", icon: "/icons/icon-3.png" },
    { name: t("hairCare" as any, "Hair Care"), department: "HAIR CARE", slug: "hair-care", icon: "/icons/hair-care-icon.png", customClass: "scale-[0.8]" },
    { name: t("homeFragrance" as any, "Home Fragrance"), department: "HOME FRAGRANCE", slug: "home-fragrance", icon: "/icons/icon-2.png" },
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



  useEffect(() => {
    setMounted(true)
  }, [])

  const getCategoryCount = (departmentName: string) => {
    return adminProducts.filter(p => p.status === 'active' && p.department === departmentName).length
  }

  const convertProduct = (p: AdminProduct) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    discountPrice: p.comparePrice || p.discountPrice || undefined,
    images: p.images.length > 0 ? p.images.map((img: any) => img.secureUrl) : ["/placeholder-product.jpg"],
    category: p.category,
    rating: 4.5,
    reviewCount: 10,
    featured: p.featured,
  })

  const newArrivalsList = adminProducts
    .filter(p => p.status === 'active')
    .slice(0, 5)
    .map(convertProduct)
    .map(p => ({ ...p, isNew: true }))

  const featuredList = adminProducts
    .filter(p => p.status === 'active' && p.featured)
    .map(convertProduct)

  const bestSellersList = featuredList.slice(0, 5)

  return (
    <div className="flex flex-col">
      {/* Hero Banner Carousel */}
      <section className="relative overflow-hidden py-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-start justify-start gap-6 lg:gap-8">
            {/* Left: Hero Banner Carousel */}
            <div className="w-full lg:w-[63%] xl:w-[57%] rounded-xl overflow-hidden aspect-[16/9] relative shadow-lg shrink-0 lg:ml-12">
              {displayBanners.map((banner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentHero === index ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer ${currentHero === index ? 'z-10 pointer-events-auto' : 'z-0 pointer-events-none'}`}
                  onClick={() => window.location.href = banner.link}
                >
                  <div className="absolute inset-0 z-0">
                    <Image src={banner.image} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" alt={banner.title} priority={index === 0} />
                  </div>
                </motion.div>
              ))}
              
              {/* Hero Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {displayBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHero(index)}
                    className={`h-[18px] rounded-full transition-all ${currentHero === index ? 'bg-white w-12 shadow-md' : 'w-[18px] bg-white/50 hover:bg-white/80 shadow-sm'}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Featured Section */}
            <div className="flex flex-col border rounded-xl p-4 pb-2 bg-card shadow-sm w-full lg:w-[350px] xl:w-[380px] shrink-0 h-fit max-h-[428px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold font-serif tracking-tight">{t("featured" as any, "Featured")}</h3>
                <Link href="/products?featured=true" className="text-xs text-primary hover:underline font-medium">
                  {t("viewAll" as any, "View All")}
                </Link>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar max-h-[348px]">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-3 p-2 items-center">
                      <div className="w-16 h-16 bg-muted animate-pulse rounded-md shrink-0"></div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                        <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                        <div className="h-4 bg-muted animate-pulse rounded w-1/4 mt-auto"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  featuredList.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group items-center">
                      <div className="relative w-16 h-16 bg-white dark:bg-zinc-900 rounded-md overflow-hidden shrink-0 border flex items-center justify-center p-1">
                        <Image src={product.images[0]} fill sizes="64px" alt={product.name} className="object-contain p-1 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex flex-col py-0.5 overflow-hidden flex-1">
                        <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{product.name}</h4>
                        <div className="text-[10px] text-muted-foreground mb-1">{toUpper(translateDbString(product.category, language))}</div>
                        <div className="flex items-center gap-1.5 mt-auto">
                          {product.discountPrice ? (
                            <>
                              <Price amount={product.discountPrice} className="font-bold text-red-500 text-sm" />
                              <Price amount={product.price} className="text-[10px] text-muted-foreground line-through" />
                            </>
                          ) : (
                            <Price amount={product.price} className="font-bold text-sm" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="pt-4 pb-8 border-b">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`} className="group">
                <div className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform flex items-center justify-center">
                    {category.icon.startsWith('/') ? (
                      <div className={`relative w-12 h-12 ${(category as any).customClass || ""}`}>
                        <Image src={category.icon} alt={category.name} fill sizes="80px" className="object-contain dark:invert" />
                      </div>
                    ) : (
                      category.icon
                    )}
                  </div>
                  <div className="font-semibold group-hover:text-primary transition-colors uppercase">{category.name}</div>
                  <div className="text-xs text-muted-foreground">{getCategoryCount(category.department)} {t("items" as any)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* New Arrivals */}
      <section className="pt-8 pb-16">
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-[3/4] bg-muted animate-pulse rounded-xl"></div>
                  <div className="h-5 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                </div>
              ))
            ) : (
              newArrivalsList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-[3/4] bg-muted animate-pulse rounded-xl"></div>
                  <div className="h-5 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                </div>
              ))
            ) : (
              bestSellersList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
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
                    <Sparkles className="h-6 w-6 text-primary" />
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
