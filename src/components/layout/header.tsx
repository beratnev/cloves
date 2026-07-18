"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, Heart, Sun, Moon, Sparkles } from "lucide-react"
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

export function Header() {
  const { theme, setTheme } = useTheme()
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const { t, language } = useTranslation()
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  useEffect(() => {
    setMounted(true)
    const authState = localStorage.getItem('demo-auth')
    if (authState === null) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(authState === 'true')
    }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSignOut = () => {
    localStorage.setItem('demo-auth', 'false')
    setIsLoggedIn(false)
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
      name: t("skincare" as any, "Skincare"),
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo width={48} height={48} className="text-primary" />
            <span className="hidden sm:inline-block text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>Clove's</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/products?sort=newest" className="text-sm font-medium transition-colors hover:text-primary">
              {t("newArrivals" as any, "New")}
            </Link>

            {navCategories.map((dept) => (
              <div key={dept.slug} className="group relative py-6 -my-6">
                <Link href={`/categories/${dept.slug}`} className="text-sm font-medium transition-colors hover:text-primary">
                  {dept.name}
                </Link>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-3">
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


            <Link href="/products?sale=true" className="text-sm font-medium text-red-500 transition-colors hover:text-red-400">
              {t("nav_sale" as any, "Sale")}
            </Link>
            
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2 text-sm font-semibold">
            <button 
              onClick={() => setLanguage("EN")}
              className={`transition-colors ${language === "EN" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              EN
            </button>
            <span className="text-muted-foreground/50">|</span>
            <button 
              onClick={() => setLanguage("TR")}
              className={`transition-colors ${language === "TR" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              TR
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("search" as any)}
                className="w-48 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

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
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" className="ml-2 hidden md:flex" asChild>
                <Link href="/login">{t("signIn" as any)}</Link>
              </Button>
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
              {t("skincare" as any, "Skincare")}
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
    </header>
  )
}
