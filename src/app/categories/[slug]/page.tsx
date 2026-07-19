"use client"

import { useState, useEffect, use } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X, Grid, List, Search, Loader2 } from "lucide-react"
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

// Map the URL slug to the Department string used in config
const slugToDepartment: Record<string, string> = {
  "fragrance": "FRAGRANCE",
  "body-care": "BODY CARE",
  "bath-shower": "BATH & SHOWER",
  "skincare": "SKINCARE",
  "hair-care": "HAIR CARE",
  "home-fragrance": "HOME FRAGRANCE",
  "gifts": "GIFTS",
  "sale": "SALE",
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
]

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t } = useTranslation()

  // For title and description
  const departmentName = slugToDepartment[slug] || slug.toUpperCase()
  const info = { title: t(("catInfo_" + departmentName.replace(/ /g, "").replace(/&/g, "")) as any, departmentName), description: "" }
  
  const searchParams = useSearchParams()
  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Dynamic filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const currentFiltersConfig = departmentFilters[departmentName] || []

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

    // Extract filters from URL query params
    const initialFilters: Record<string, string> = {}
    if (searchParams) {
      searchParams.forEach((value, key) => {
        if (key !== "sort" && key !== "search") {
          initialFilters[key] = value
        }
      })
    }
    setActiveFilters(initialFilters)
    setPriceRange([0, 500])
  }, [slug, searchParams])

  // Convert admin products to display format
  const products = adminProducts
    .filter(p => p.status === 'active' && p.department === departmentName)
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
      price: p.price,
      discountPrice: p.comparePrice || undefined,
      images: p.images.length > 0 ? p.images.map((img: any) => img.secureUrl) : ["/placeholder-product.jpg"],
      category: p.category,
      rating: 4.5, // Mock
      reviewCount: 10,
      featured: p.featured,
      brand: p.brand,
      attributes: p.attributes || {}
    }))

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const effectivePrice = product.discountPrice || product.price
    const matchesPrice = effectivePrice >= priceRange[0] && (priceRange[1] >= 500 ? true : effectivePrice <= priceRange[1])
    
    let matchesDynamic = true
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
    
    return matchesSearch && matchesPrice && matchesDynamic
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
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

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
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filterId)} />
              </Badge>
            )
          })}
          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <Badge variant="secondary" className="gap-1">
              ${priceRange[0]} - ${priceRange[1]}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 500])} />
            </Badge>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium tracking-tight animate-pulse">
          {t("loading" as any) || "Loading..."}
        </p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">{info.title} ({filteredProducts.length})</h1>
        <p className="text-muted-foreground text-lg mb-4">{info.description}</p>
        <p className="text-muted-foreground">
          {filteredProducts.length} {t("productsFound" as any) || "products found"}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-8">
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
          {sortedProducts.length === 0 ? (
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
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
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
