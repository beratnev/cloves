"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, User, Menu, Heart, ShoppingBag, X, Sparkles, Wand2, Globe, ShoppingCart } from "lucide-react"
import { Price } from "@/components/ui/price"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/ui/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCartStore } from "@/lib/store/cart"
import { useTheme } from "@/components/theme-provider"
import { useTranslation, useLanguageStore } from "@/lib/i18n"
import { translateDbString } from "@/lib/i18n/db-translations"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated"
  
  const { t, language } = useTranslation()
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/admin/products?search=${encodeURIComponent(searchQuery)}&limit=3`)
        const data = await res.json()
        setSearchResults(data.products || [])
      } catch (error) {
        console.error(error)
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    window.location.href = '/'
  }

  const navCategories = [
    {
      name: t("nav_fragrance" as any, "Fragrance"),
      slug: "fragrance",
      categories: ["Perfume", "Eau de Parfum", "Eau de Toilette", "Body Mist", "Hair Mist"]
    },
    {
      name: t("nav_bodyCare" as any, "Body Care"),
      slug: "body-care",
      categories: ["Body Lotion", "Body Cream", "Body Butter", "Body Oil", "Body Scrub", "Hand Cream", "Foot Care"]
    },
    {
      name: t("nav_bathShower" as any, "Bath & Shower"),
      slug: "bath-shower",
      categories: ["Shower Gel", "Body Wash", "Soap", "Bath Bombs", "Bath Salts", "Bubble Bath"]
    },
    {
      name: t("nav_skincare" as any, "Personal Care"),
      slug: "skincare",
      categories: ["Cleansers", "Toners", "Serums", "Moisturizers", "Eye Care", "Face Masks", "Sunscreen", "Peeling"]
    },
    {
      name: t("nav_hairCare" as any, "Hair Care"),
      slug: "hair-care",
      categories: ["Shampoo", "Conditioner", "Hair Mask", "Hair Oil", "Scalp Care", "Styling"]
    },
    {
      name: t("nav_homeFragrance" as any, "Home Fragrance"),
      slug: "home-fragrance",
      categories: ["Candles", "Reed Diffusers", "Room Sprays", "Essential Oils"]
    }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#f9fbfe]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f9fbfe]/60">
      <div className="container flex flex-col">
        {/* Top Tier */}
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mt-5">
              <Image 
                src="/logo-cloves.png" 
                alt="Clove's" 
                width={168} 
                height={48} 
                priority 
                className="h-12 w-auto object-contain dark:invert scale-[3] origin-left" 
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center gap-8 relative">

            <div className="w-full max-w-md relative">
              <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("search" as any)}
                className="w-full pl-10 h-10 bg-muted/30 border-2 rounded-full focus-visible:ring-primary/50 transition-all duration-300 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {searchQuery.trim() && (
              <div className="absolute top-full mt-2 w-full right-0 bg-background border rounded-md shadow-lg z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map(product => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.id}`}
                        onClick={() => setSearchQuery("")}
                        className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0].secureUrl || product.images[0].url || product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full bg-secondary" />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden flex-1">
                          <span className="text-sm font-medium truncate">{product.name}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {product.discountPrice ? (
                            <>
                              <Price amount={product.discountPrice} className="text-sm font-bold text-red-500" />
                              <Price amount={product.price} className="text-xs text-muted-foreground line-through" />
                            </>
                          ) : (
                            <Price amount={product.price} className="text-sm font-bold" />
                          )}
                        </div>
                      </Link>
                    ))}
                    <Link 
                      href={`/products?search=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => setSearchQuery("")}
                      className="p-2 text-center text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      View all results
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No results found.</div>
                )}
              </div>
            )}
            </div>

          </div>

          <div className="flex items-center gap-2">

            <div className="flex items-center gap-2 text-sm font-semibold shrink-0 mr-2">
              <button 
                onClick={() => setLanguage("TR")}
                className={`transition-all hover:scale-110 ${language === "TR" ? "opacity-100 grayscale-0" : "opacity-60 grayscale hover:grayscale-0"}`}
                title="Türkçe"
              >
                <span className="flex items-center justify-center w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                    <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#d12d24" />
                    <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15" />
                    <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2" />
                    <path fill="#fff" d="M19.807 16L21 14.358 19.069 14.985 17.876 13.342 17.876 15.373 15.945 16 17.876 16.627 17.876 18.658 19.069 17.015 21 17.642 19.807 16z" />
                    <path d="M15.953,19.325c-1.837,1.65-4.663,1.5-6.314-.337s-1.5-4.663,.337-6.314c1.837-1.65,4.663-1.5,6.314,.337-.442-.699-1.035-1.292-1.734-1.734-2.608-1.65-6.06-.874-7.711,1.734-1.65,2.608-.874,6.06,1.734,7.711,2.608,1.65,6.06,.874,7.711-1.734-.106,.118-.219,.231-.337,.337Z" fill="#fff" />
                  </svg>
                </span>
              </button>
              <button 
                onClick={() => setLanguage("EN")}
                className={`transition-all hover:scale-110 ${language === "EN" ? "opacity-100 grayscale-0" : "opacity-60 grayscale hover:grayscale-0"}`}
                title="English"
              >
                <span className="flex items-center justify-center w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
                    <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect>
                    <path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path>
                    <path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path>
                    <path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path>
                    <path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path>
                    <rect x="13" y="4" width="6" height="24" fill="#fff"></rect>
                    <rect x="1" y="13" width="30" height="6" fill="#fff"></rect>
                    <rect x="14" y="4" width="4" height="24" fill="#b92932"></rect>
                    <rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect>
                    <path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path>
                    <path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path>
                    <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path>
                    <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path>
                  </svg>
                </span>
              </button>
            </div>

          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {mounted && (
            isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t("profile" as any)}</Link>
                  </DropdownMenuItem>
                  {(session?.user as any)?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t("orders" as any)}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">{t("settings" as any)}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>{t("signOut" as any)}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/login">{t("signIn" as any, "Sign In")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login?tab=register">{t("signUp" as any, "Sign Up")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/products?sort=newest" className="text-sm font-medium transition-colors hover:text-primary">
                    {t("newArrivals" as any, "New")}
                  </Link>
                  <Link href="/categories/fragrance" className="text-sm font-medium transition-colors hover:text-primary">
                    {t("fragrance" as any, "Fragrance")}
                  </Link>
                  <Link href="/categories/body-care" className="text-sm font-medium transition-colors hover:text-primary">
                    {t("bodyCare" as any, "Body Care")}
                  </Link>
                  <Link href="/categories/bath-shower" className="text-sm font-medium transition-colors hover:text-primary">
                    {t("bathShower" as any, "Bath & Shower")}
                  </Link>
                  <Link href="/categories/skincare" className="text-sm font-medium transition-colors hover:text-primary">
                    {t("personalCare" as any, "Personal Care")}
                  </Link>
                  <Link href="/categories/hair-care" className="text-sm font-medium transition-colors hover:text-primary">
                    {t("hairCare" as any, "Hair Care")}
                  </Link>
                  <Link href="/categories/home-fragrance" className="text-sm font-medium transition-colors hover:text-primary">
                    {t("homeFragrance" as any, "Home Fragrance")}
                  </Link>
                  <Link href="/products?sale=true" className="text-sm font-medium text-red-500 transition-colors hover:text-red-400">
                    {t("nav_sale" as any, "Sale")}
                  </Link>
                  
                  <div className="pt-4 border-t">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder={t("search" as any)}
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </form>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Bottom Tier: Categories */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-3 border-t">
          <Link href="/products?sort=newest" className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap tracking-wide">
            {t("newArrivals" as any, "New").toLocaleUpperCase(language === "TR" ? "tr-TR" : "en-US")}
          </Link>

          {navCategories.map((dept) => (
            <div key={dept.slug} className="group relative">
              <Link href={`/categories/${dept.slug}`} className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap tracking-wide">
                {dept.name.toLocaleUpperCase(language === "TR" ? "tr-TR" : "en-US")}
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-3 before:absolute before:top-[-10px] before:left-0 before:w-full before:h-[10px]">
                <div className="grid grid-cols-2 gap-2">
                  {dept.categories.map((cat) => (
                    <Link 
                      key={cat} 
                      href={`/categories/${dept.slug}?productType=${encodeURIComponent(cat)}`} 
                      className="text-sm px-2 py-2 rounded-sm hover:bg-black/50 hover:text-white dark:hover:bg-white/50 dark:hover:text-black transition-colors text-muted-foreground truncate"
                    >
                      {translateDbString(cat, language)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link href="/products?sale=true" className="text-sm font-medium text-red-500 transition-colors hover:text-red-400 whitespace-nowrap tracking-wide">
            {t("nav_sale" as any, "Sale").toLocaleUpperCase(language === "TR" ? "tr-TR" : "en-US")}
          </Link>
        </nav>
      </div>
    </header>
  )
}
