"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/ui/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCartStore } from "@/lib/store/cart"
import { useTheme } from "@/components/theme-provider"
import { useTranslation, useLanguageStore } from "@/lib/i18n"
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
      name: t("fragrance" as any, "Fragrance"),
      slug: "fragrance",
      categories: ["Perfume", "Eau de Parfum", "Eau de Toilette", "Body Mist", "Hair Mist"]
    },
    {
      name: t("bodyCare" as any, "Body Care"),
      slug: "body-care",
      categories: ["Body Lotion", "Body Cream", "Body Butter", "Body Oil", "Body Scrub", "Hand Cream", "Foot Care"]
    },
    {
      name: t("bathShower" as any, "Bath & Shower"),
      slug: "bath-shower",
      categories: ["Shower Gel", "Body Wash", "Soap", "Bath Bombs", "Bath Salts", "Bubble Bath"]
    },
    {
      name: t("personalCare" as any, "Personal Care"),
      slug: "skincare",
      categories: ["Cleansers", "Toners", "Serums", "Moisturizers", "Eye Care", "Face Masks", "Sunscreen", "Peeling"]
    },
    {
      name: t("hairCare" as any, "Hair Care"),
      slug: "hair-care",
      categories: ["Shampoo", "Conditioner", "Hair Mask", "Hair Oil", "Scalp Care", "Styling"]
    },
    {
      name: t("homeFragrance" as any, "Home Fragrance"),
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
            <Link href="/" className="flex items-center">
              <Logo width={48} height={48} className="text-primary -mt-1" />
              <span className="hidden sm:inline-block text-2xl font-bold tracking-tight text-foreground -ml-2" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>Clove's</span>
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
                            <img src={product.images[0].secureUrl || product.images[0].url || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-secondary" />
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium truncate">{product.name}</span>
                          <span className="text-xs text-muted-foreground">${product.price}</span>
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

            <div className="flex items-center gap-2 text-sm font-semibold shrink-0">
              <button 
                onClick={() => setLanguage("EN")}
                className={`transition-colors ${language === "EN" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
              <span className="text-muted-foreground/30">|</span>
              <button 
                onClick={() => setLanguage("TR")}
                className={`transition-colors ${language === "TR" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                TR
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">



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
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t("profile" as any)}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t("orders" as any)}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">{t("wishlist" as any)}</Link>
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
          <Link href="/products?sort=newest" className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap uppercase tracking-wide">
            {t("newArrivals" as any, "New")}
          </Link>

          {navCategories.map((dept) => (
            <div key={dept.slug} className="group relative">
              <Link href={`/categories/${dept.slug}`} className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap uppercase tracking-wide">
                {dept.name}
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-3 before:absolute before:top-[-10px] before:left-0 before:w-full before:h-[10px]">
                <div className="grid grid-cols-2 gap-2">
                  {dept.categories.map((cat) => (
                    <Link 
                      key={cat} 
                      href={`/categories/${dept.slug}?productType=${encodeURIComponent(cat)}`} 
                      className="text-sm px-2 py-2 rounded-sm hover:bg-muted transition-colors text-muted-foreground hover:text-foreground truncate"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link href="/products?sale=true" className="text-sm font-medium text-red-500 transition-colors hover:text-red-400 whitespace-nowrap uppercase tracking-wide">
            {t("nav_sale" as any, "Sale")}
          </Link>
        </nav>
      </div>
    </header>
  )
}
