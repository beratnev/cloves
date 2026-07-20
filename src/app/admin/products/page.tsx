"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Sparkles, Filter, Copy, Archive, Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ImageUpload } from "@/components/admin/image-upload"
import { departmentFilters } from "@/lib/config/filters"
import { useToast } from "@/hooks/use-toast"

interface UploadedImage {
  publicId: string
  secureUrl: string
  width: number
  height: number
  format: string
  bytes: number
}

interface Product {
  id: string
  name: string
  description?: string
  sku: string
  category: string
  department: string
  price: number
  comparePrice: number | null
  stock: number
  lowStockAlert?: number
  status: "active" | "draft" | "archived"
  featured: boolean
  images: UploadedImage[]
  attributes?: Record<string, string>
  aiAdvice?: {
    keyBenefits: string[];
    usageTips: string[];
  }
}

const departmentCategories: Record<string, string[]> = {
  "NEW": [
    "New Arrivals",
    "Best Sellers",
    "Limited Edition",
    "Trending"
  ],
  "FRAGRANCE": [
    "Perfume",
    "Eau de Parfum",
    "Eau de Toilette",
    "Body Mist",
    "Hair Mist",
    "Travel Size"
  ],
  "BODY CARE": [
    "Body Lotion",
    "Body Cream",
    "Body Butter",
    "Body Oil",
    "Body Scrub",
    "Hand Cream",
    "Foot Care",
    "Lip Care"
  ],
  "BATH & SHOWER": [
    "Shower Gel",
    "Body Wash",
    "Soap",
    "Bath Bombs",
    "Bath Salts",
    "Bubble Bath"
  ],
  "SKINCARE": [
    "Cleansers",
    "Toners",
    "Serums",
    "Moisturizers",
    "Eye Care",
    "Face Masks",
    "Sunscreen",
    "Peeling"
  ],
  "HAIR CARE": [
    "Shampoo",
    "Conditioner",
    "Hair Mask",
    "Hair Oil",
    "Scalp Care",
    "Styling"
  ],
  "HOME FRAGRANCE": [
    "Candles",
    "Reed Diffusers",
    "Room Sprays",
    "Essential Oils"
  ],
  "SALE": [
    "Sale",
    "Bundle Deals",
    "Last Chance",
    "Clearance"
  ]
}

const initialProducts: Product[] = []

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    lowStockAlert: '',
    category: '',
    department: '',
    status: 'active' as "active" | "draft" | "archived",
    featured: false,
    attributes: {} as Record<string, string>,
    aiAdvice: { keyBenefits: [] as string[], usageTips: [] as string[] }
  })

  const { toast } = useToast()
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const aiFileInputRef = useRef<HTMLInputElement>(null)

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products?limit=1000', { cache: 'no-store' })
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoaded(true)
    }
  }

  // Load products from API on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in required fields')
      return
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          images: uploadedImages,
        })
      });
      if (res.ok) {
        fetchProducts()
        setNewProduct({
          name: '', sku: '', description: '', price: '', comparePrice: '', stock: '', lowStockAlert: '',
          category: '', department: '', status: 'active', featured: false, attributes: {}, aiAdvice: { keyBenefits: [], usageTips: [] }
        })
        setUploadedImages([])
        setIsAddDialogOpen(false)
        toast({ title: "Başarılı!", description: "Ürün eklendi." })
      } else {
        toast({ title: "Hata", description: "Ürün eklenemedi.", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Hata", description: "Sunucu hatası.", variant: "destructive" })
    }
  }

  const handleAIAccelerate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsAIProcessing(true)
    toast({
      title: "AI Analiz Ediyor...",
      description: "Lütfen bekleyin, fotoğraf(lar) işleniyor ve ürün bilgileri çıkarılıyor.",
    })

    try {
      // 1. Upload images to Cloudinary
      const uploadFormData = new FormData()
      files.forEach(file => {
        uploadFormData.append('files', file)
      })
      uploadFormData.append('folder', 'ai-shop/products')

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })
      if (!uploadRes.ok) throw new Error("Görsel yüklenemedi")
      const uploadData = await uploadRes.json()
      const uploadedImages = uploadData.images

      // 2. Extract info with Gemini
      const aiFormData = new FormData()
      files.forEach(file => {
        aiFormData.append('image', file)
      })

      const aiRes = await fetch('/api/ai/parse-product', {
        method: 'POST',
        body: aiFormData
      })
      if (!aiRes.ok) {
        let errMessage = "Yapay zeka analizi başarısız oldu"
        try {
          const errData = await aiRes.json()
          if (errData.error) errMessage = errData.error
        } catch (e) {}
        throw new Error(errMessage)
      }
      const aiData = await aiRes.json()
      const parsed = aiData.product

      // 3. Create Product via API
      const aiProductPayload = {
        name: parsed.name || "AI Ürün",
        description: parsed.description || "",
        sku: `${parsed.sku || 'AI'}-${Math.floor(10000 + Math.random() * 90000)}`,
        category: parsed.category || "Uncategorized",
        department: parsed.department || "FRAGRANCE",
        price: parsed.price || 0,
        comparePrice: parsed.comparePrice || null,
        stock: Math.floor(Math.random() * 50) + 5,
        status: "active",
        featured: parsed.featured === true,
        images: uploadedImages,
        attributes: parsed.attributes || {},
        aiAdvice: parsed.aiAdvice || { keyBenefits: [], usageTips: [] }
      }

      const createRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiProductPayload)
      })

      if (createRes.ok) {
        fetchProducts()
        toast({ title: "Başarılı!", description: `${aiProductPayload.name} yapay zeka ile eklendi.` })
      } else {
        throw new Error("Ürün veritabanına kaydedilemedi")
      }
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Hata",
        description: err.message || "Bir şeyler ters gitti.",
        variant: "destructive"
      })
    } finally {
      setIsAIProcessing(false)
      if (aiFileInputRef.current) aiFileInputRef.current.value = ''
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct || !newProduct.name || !newProduct.price) {
      alert('Please fill in required fields')
      return
    }

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, images: uploadedImages })
      })
      if (res.ok) {
        fetchProducts()
        setNewProduct({
          name: '', sku: '', description: '', price: '', comparePrice: '', stock: '', lowStockAlert: '',
          category: '', department: '', status: 'active', featured: false, attributes: {}, aiAdvice: { keyBenefits: [], usageTips: [] }
        })
        setUploadedImages([])
        setEditingProduct(null)
        setIsEditDialogOpen(false)
        toast({ title: "Başarılı", description: "Ürün güncellendi." })
      } else {
        toast({ title: "Hata", description: "Ürün güncellenemedi.", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Hata", description: "Sunucu hatası.", variant: "destructive" })
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const res = await fetch(`/api/admin/products/${productToDelete.id}`, { method: 'DELETE' })
        if (res.ok) {
          fetchProducts()
          setDeleteDialogOpen(false)
          setProductToDelete(null)
          toast({ title: "Başarılı", description: "Ürün silindi." })
        } else {
          toast({ title: "Hata", description: "Ürün silinemedi.", variant: "destructive" })
        }
      } catch (e) {
        toast({ title: "Hata", description: "Sunucu hatası.", variant: "destructive" })
      }
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      stock: product.stock.toString(),
      lowStockAlert: product.lowStockAlert?.toString() || '',
      category: product.category,
      department: product.department,
      status: product.status as "active" | "draft" | "archived",
      featured: product.featured,
      attributes: product.attributes || {},
      aiAdvice: product.aiAdvice || { keyBenefits: [], usageTips: [] }
    })
    setUploadedImages(product.images)
    setIsEditDialogOpen(true)
  }

  const handleDuplicate = async (product: Product) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          name: `${product.name} (Copy)`,
          sku: `${product.sku}-COPY`,
        })
      })
      if (res.ok) {
        fetchProducts()
        toast({ title: "Başarılı", description: "Ürün kopyalandı." })
      }
    } catch (e) {}
  }

  const handleToggleFeatured = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !product.featured })
      })
      if (res.ok) fetchProducts()
    } catch (e) {}
  }

  const handleArchive = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: product.status === 'archived' ? 'active' : 'archived' })
      })
      if (res.ok) fetchProducts()
    } catch (e) {}
  }

  return (
    <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products ({products.length})</h1>
            <p className="text-muted-foreground mt-1">
              Manage your fashion product inventory
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            if (open) {
              setEditingProduct(null);
              setNewProduct({
                name: '',
                sku: '',
                description: '',
                price: '',
                comparePrice: '',
                stock: '',
                lowStockAlert: '',
                category: '',
                department: '',
                status: 'active',
                featured: false,
                attributes: {},
                aiAdvice: { keyBenefits: [], usageTips: [] }
              });
              setUploadedImages([]);
            }
            setIsAddDialogOpen(open);
          }}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={aiFileInputRef}
              onChange={handleAIAccelerate}
              multiple
            />
            <Button
              onClick={() => aiFileInputRef.current?.click()}
              disabled={isAIProcessing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white mr-2"
            >
              {isAIProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {isAIProcessing ? "İşleniyor..." : "AI ile Ekle"}
            </Button>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name</label>
                      <Input 
                        placeholder="Enter product name" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SKU</label>
                      <Input 
                        placeholder="PROD-001" 
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Enter product description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Images</h3>
                  <ImageUpload
                    images={uploadedImages}
                    onImagesChange={setUploadedImages}
                    maxImages={10}
                    folder="ai-shop/products"
                  />
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Compare at Price</label>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={newProduct.comparePrice}
                        onChange={(e) => setNewProduct({...newProduct, comparePrice: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inventory</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock Quantity</label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Low Stock Alert</label>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        value={newProduct.lowStockAlert}
                        onChange={(e) => setNewProduct({...newProduct, lowStockAlert: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Organization</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <Select value={newProduct.department} onValueChange={(value) => setNewProduct({...newProduct, department: value, category: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(departmentCategories).map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {(departmentCategories[newProduct.department] || []).map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                </div>

                {/* Product Attributes */}
                {newProduct.department && departmentFilters[newProduct.department] && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Attributes</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {departmentFilters[newProduct.department]
                        .filter(f => f.id !== 'price' && f.id !== 'rating' && (!f.categories || f.categories.includes(newProduct.category)))
                        .map((filter) => (
                          <div key={filter.id} className="space-y-2">
                            <label className="text-sm font-medium">{filter.label}</label>
                            <Select 
                              value={newProduct.attributes?.[filter.id] || ''} 
                              onValueChange={(value) => setNewProduct({
                                ...newProduct, 
                                attributes: { ...(newProduct.attributes || {}), [filter.id]: value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {filter.options?.filter(opt => opt !== "All").map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="active" 
                        name="status" 
                        value="active" 
                        checked={newProduct.status === 'active'}
                        onChange={(e) => setNewProduct({...newProduct, status: e.target.value as "active" | "draft" | "archived"})}
                      />
                      <label htmlFor="active" className="text-sm">Active</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="draft" 
                        name="status" 
                        value="draft"
                        checked={newProduct.status === 'draft'}
                        onChange={(e) => setNewProduct({...newProduct, status: e.target.value as "active" | "draft" | "archived"})}
                      />
                      <label htmlFor="draft" className="text-sm">Draft</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="archived" 
                        name="status" 
                        value="archived"
                        checked={newProduct.status === 'archived'}
                        onChange={(e) => setNewProduct({...newProduct, status: e.target.value as "active" | "draft" | "archived"})}
                      />
                      <label htmlFor="archived" className="text-sm">Archived</label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="featured" 
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                    />
                    <label htmlFor="featured" className="text-sm">Featured Product</label>
                  </div>
                </div>

                <div className=" justify-end gap-4 flex">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={handleCreateProduct}
                  >
                    Create Product
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name</label>
                      <Input 
                        placeholder="Enter product name" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SKU</label>
                      <Input 
                        placeholder="PROD-001" 
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Enter product description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Images</h3>
                  <ImageUpload
                    images={uploadedImages}
                    onImagesChange={setUploadedImages}
                    maxImages={10}
                    folder="ai-shop/products"
                  />
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Compare at Price</label>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={newProduct.comparePrice}
                        onChange={(e) => setNewProduct({...newProduct, comparePrice: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inventory</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock Quantity</label>
                      <Input 
                        type="number" 
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Low Stock Alert</label>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        value={newProduct.lowStockAlert}
                        onChange={(e) => setNewProduct({...newProduct, lowStockAlert: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Organization</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Department</label>
                      <Select value={newProduct.department} onValueChange={(value) => setNewProduct({...newProduct, department: value, category: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(departmentCategories).map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {(departmentCategories[newProduct.department] || []).map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                </div>

                {/* Product Attributes */}
                {newProduct.department && departmentFilters[newProduct.department] && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Attributes</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {departmentFilters[newProduct.department]
                        .filter(f => f.id !== 'price' && f.id !== 'rating' && (!f.categories || f.categories.includes(newProduct.category)))
                        .map((filter) => (
                          <div key={filter.id} className="space-y-2">
                            <label className="text-sm font-medium">{filter.label}</label>
                            <Select 
                              value={newProduct.attributes?.[filter.id] || ''} 
                              onValueChange={(value) => setNewProduct({
                                ...newProduct, 
                                attributes: { ...(newProduct.attributes || {}), [filter.id]: value }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {filter.options?.filter(opt => opt !== "All").map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="edit-active" 
                        name="edit-status" 
                        value="active" 
                        checked={newProduct.status === 'active'}
                        onChange={(e) => setNewProduct({...newProduct, status: e.target.value as "active" | "draft" | "archived"})}
                      />
                      <label htmlFor="edit-active" className="text-sm">Active</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="edit-draft" 
                        name="edit-status" 
                        value="draft"
                        checked={newProduct.status === 'draft'}
                        onChange={(e) => setNewProduct({...newProduct, status: e.target.value as "active" | "draft" | "archived"})}
                      />
                      <label htmlFor="edit-draft" className="text-sm">Draft</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="edit-archived" 
                        name="edit-status" 
                        value="archived"
                        checked={newProduct.status === 'archived'}
                        onChange={(e) => setNewProduct({...newProduct, status: e.target.value as "active" | "draft" | "archived"})}
                      />
                      <label htmlFor="edit-archived" className="text-sm">Archived</label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="edit-featured" 
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                    />
                    <label htmlFor="edit-featured" className="text-sm">Featured Product</label>
                  </div>
                </div>

                <div className=" justify-end gap-4 flex">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={handleUpdateProduct}
                  >
                    Update Product
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Products Table */}
        <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                          <Image 
                            src={product.images && product.images.length > 0 ? (product.images[0].secureUrl.startsWith('https://res.cloudinary.com/') ? product.images[0].secureUrl.replace('/upload/', '/upload/q_auto,f_auto,w_100/') : product.images[0].secureUrl) : "/placeholder-product.jpg"} 
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {product.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                        {product.comparePrice && (
                          <span className="text-muted-foreground text-sm line-through ml-2">
                            ${product.comparePrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock < 50 ? "destructive" : "secondary"}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "active" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                          <Eye className="h-3 w-3 mr-1" />
                          Yes
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          <EyeOff className="h-3 w-3 mr-1 inline" />
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleToggleFeatured(product)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {product.featured ? 'Unfeature' : 'Feature'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchive(product)}>
                            <Archive className="h-4 w-4 mr-2" />
                            {product.status === 'archived' ? 'Unarchive' : 'Archive'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

  )
}
