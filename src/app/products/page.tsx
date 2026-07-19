"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Price } from "@/components/ui/price"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X, Grid, List, Search } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { departmentFilters } from "@/lib/config/filters"

interface AdminProduct {
  id: string
  name: string
  slug?: string
  sku: string
  category: string
  brand: string
  department: string
  price: number
  comparePrice: number | null
  stock: number
  status: "active" | "draft" | "archived"
  featured: boolean
  images: any[]
  attributes?: Record<string, string>
}

const categories = [
  "All",
  "NEW",
  "FRAGRANCE",
  "BODY CARE",
  "BATH & SHOWER",
  "SKINCARE",
  "HAIR CARE",
  "HOME FRAGRANCE",
  "SALE"
]

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
]

function ProductsPageContent() {
  const { t } = useTranslation()
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()

  const getCategoryTranslation = (category: string) => {
    const keyMap: Record<string, string> = {
      "All": "nav_all",
      "NEW": "nav_new",
      "FRAGRANCE": "nav_fragrance",
      "BODY CARE": "nav_bodyCare",
      "BATH & SHOWER": "nav_bathShower",
      "SKINCARE": "nav_skincare",
      "HAIR CARE": "nav_hairCare",
      "HOME FRAGRANCE": "nav_homeFragrance",
      "GIFTS": "nav_gifts",
      "SALE": "nav_sale"
    };
    const key = keyMap[category];
    return key ? t(key as any, category) : category;
  }

  // Dynamic filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const departmentName = selectedCategory !== "All" ? selectedCategory : ""
  const currentFiltersConfig = departmentName ? departmentFilters[departmentName] || [] : []

  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/admin/products?limit=50')
        const data = await res.json()
        if (data.products) {
          setAdminProducts(data.products)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const sortParam = params.get('sort')
      if (sortParam) setSortBy(sortParam)
      
      const categoryParam = params.get('category')
      if (categoryParam) {
        const categoryMatch = categories.find(c => c.toLowerCase() === categoryParam.toLowerCase())
        if (categoryMatch) setSelectedCategory(categoryMatch)
      }

      const saleParam = params.get('sale')
      if (saleParam === 'true') {
        setSelectedCategory('SALE')
      }
    }
  }, [])

  // React to URL parameter changes (like search, sort, category)
  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get('search')
      if (search !== null) {
        setSearchQuery(search)
      }
      
      const sort = searchParams.get('sort')
      if (sort) {
        setSortBy(sort)
      }

      const categoryParam = searchParams.get('category')
      if (categoryParam) {
        const categoryMatch = categories.find(c => c.toLowerCase() === categoryParam.toLowerCase())
        if (categoryMatch) setSelectedCategory(categoryMatch)
      }

      const saleParam = searchParams.get('sale')
      if (saleParam === 'true') {
        setSelectedCategory('SALE')
      }
    }
  }, [searchParams])

  // Reset dynamic filters when category changes
  useEffect(() => {
    setActiveFilters({})
  }, [selectedCategory])

  // Convert admin products to display format
  const products = adminProducts
    .filter(p => p.status === 'active')
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
      price: p.price,
      discountPrice: p.comparePrice || undefined,
      images: p.images.length > 0 ? p.images.map((img: any) => img.secureUrl) : ["/placeholder-product.jpg"],
      category: p.category,
      department: p.department,
      rating: 4.5,
      reviewCount: 10,
      featured: p.featured,
      brand: p.brand,
      attributes: p.attributes || {}
    }))

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "SALE") {
      matchesCategory = !!product.discountPrice && product.discountPrice < product.price;
    } else if (selectedCategory === "NEW") {
      matchesCategory = true;
    } else {
      matchesCategory = product.department === selectedCategory || product.category === selectedCategory;
    }
    const effectivePrice = product.discountPrice || product.price
    const matchesPrice = effectivePrice >= priceRange[0] && (priceRange[1] >= 500 ? true : effectivePrice <= priceRange[1])
    
    let matchesDynamic = true
    if (departmentName) {
      for (const [filterId, selectedValue] of Object.entries(activeFilters)) {
        if (selectedValue && selectedValue !== "All") {
          if (filterId === "brand") {
            if (product.brand !== selectedValue) matchesDynamic = false;
          } else if (filterId === "productType" || filterId === "category") {
            if (product.category !== selectedValue) matchesDynamic = false;
          } else {
            // Check dynamic attributes
            if (product.attributes[filterId] !== selectedValue) {
               matchesDynamic = false;
            }
          }
        }
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice && matchesDynamic
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price)
      case "price-high":
        return (b.discountPrice || b.price) - (a.discountPrice || a.price)
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "newest":
        return b.id.localeCompare(a.id)
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setActiveFilters({})
    setPriceRange([0, 500])
  }

  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterId]: value }))
  }

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const next = { ...prev }
      delete next[filterId]
      return next
    })
  }

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== "All") || priceRange[0] > 0 || priceRange[1] < 500

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">{t("categoryLabel" as any) || "Department"}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryTranslation(category)}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">{t("priceRange" as any) || "Price Range"}</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            step={10}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <Price amount={priceRange[0]} />
            <Price amount={priceRange[1]} />
          </div>
        </div>
      </div>

      {/* Dynamic Filters for Active Department */}
      {currentFiltersConfig.filter(f => f.id !== "price").map(filter => (
        <div key={filter.id}>
          <h3 className="text-sm font-semibold mb-3">{t(`filterLabel_${filter.id}` as any, filter.label)}</h3>
          <Select 
            value={activeFilters[filter.id] || "All"} 
            onValueChange={(val) => handleFilterChange(filter.id, val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(opt => (
                <SelectItem key={opt} value={opt}>{t(`filterOpt_${opt.replace(/\s+/g, "")}` as any, opt)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )

  const renderActiveBadges = () => {
    if (!hasActiveFilters) return null;
    
    return (
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{t("activeFilters" as any) || "Active Filters"}</h3>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            {t("clearFilters" as any) || "Clear all"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">

          {Object.entries(activeFilters).map(([filterId, value]) => {
            if (!value || value === "All") return null;
            return (
              <Badge key={filterId} variant="secondary" className="gap-1">
                {t(`filterOpt_${value.replace(/\s+/g, "")}` as any, value)}
                <X className="h-3 w-3 cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFilter(filterId); }} />
              </Badge>
            )
          })}
          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <Badge variant="secondary" className="gap-1">
              ${priceRange[0]} - ${priceRange[1]}
              <X className="h-3 w-3 cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPriceRange([0, 500]); }} />
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">{t("products" as any) || "Products"} ({filteredProducts.length})</h1>
        <p className="text-muted-foreground text-lg">
          {filteredProducts.length} {t("items" as any) || "items"}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder" as any) || "Search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              {t("filterBy" as any) || "Filter by"}
              {hasActiveFilters && <Badge className="ml-2 h-5 px-1.5">{t("active" as any) || "Active"}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t("filterBy" as any) || "Filter by"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {renderFilters()}
            </div>
          </SheetContent>
        </Sheet>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("sortBy" as any) || "Sort by"} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(("sort_" + option.value) as any) || option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden md:flex gap-2">
          <Button
            variant="default"
            size="icon"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              {renderFilters()}
              {renderActiveBadges()}
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded-lg h-[400px]" />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4 text-lg">{t("noProductsFound" as any) || "No products found"}</p>
                <Button variant="outline" onClick={clearAllFilters}>
                  {t("clearFilters" as any) || "Clear all filters"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-4"
              }
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading products...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
