"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Layers, Calendar, TrendingUp } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface UploadedImage {
  publicId: string
  secureUrl: string
  width: number
  height: number
  format: string
  bytes: number
}

interface Collection {
  id: string
  name: string
  slug: string
  type: "manual" | "automated" | "smart"
  description: string
  image: string | null
  productCount: number
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

const collections: Collection[] = []

export default function AdminCollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || collection.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground mt-1">
              Organize your products into curated collections
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Collection</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Collection Name</label>
                    <Input placeholder="Enter collection name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <Input placeholder="collection-slug" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Enter collection description"
                    />
                  </div>
                </div>

                {/* Collection Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Collection Type</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual - Select products manually</SelectItem>
                        <SelectItem value="automated">Automated - Based on conditions</SelectItem>
                        <SelectItem value="smart">Smart - AI-powered recommendations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Collection Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Collection Image</h3>
                  <ImageUpload
                    images={uploadedImages}
                    onImagesChange={setUploadedImages}
                    maxImages={1}
                    folder="ai-shop/collections"
                  />
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="published" defaultChecked />
                      <label htmlFor="published" className="text-sm">Published</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="featured" />
                      <label htmlFor="featured" className="text-sm">Featured Collection</label>
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">SEO</h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Title</label>
                    <Input placeholder="Collection Meta Title" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meta Description</label>
                    <textarea 
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Collection meta description"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                    Create Collection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automated">Automated</SelectItem>
                  <SelectItem value="smart">Smart</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Layers className="h-4 w-4 mr-2" />
                Featured Only
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Collections Table */}
        <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {collection.image ? (
                          <div className="h-12 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Layers className="h-6 w-6 text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Layers className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {collection.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          collection.type === "manual" ? "default" :
                          collection.type === "automated" ? "secondary" : "outline"
                        }
                        className="capitalize"
                      >
                        {collection.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{collection.productCount}</TableCell>
                    <TableCell>
                      <Badge variant={collection.published ? "default" : "secondary"}>
                        {collection.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {collection.featured ? (
                        <Badge variant="outline">Yes</Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Layers className="h-4 w-4 mr-2" />
                            Manage Products
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
