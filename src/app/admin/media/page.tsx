"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Image as ImageIcon, Folder, Grid, List, Download, Copy, Eye, Calendar, HardDrive } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface UploadedImage {
  publicId: string
  secureUrl: string
  width: number
  height: number
  format: string
  bytes: number
}

interface MediaFile {
  id: string
  name: string
  url: string
  type: "image" | "video"
  size: number
  width: number
  height: number
  format: string
  folder: string
  createdAt: string
}

const mediaFiles: MediaFile[] = []

const folders: any[] = []

export default function AdminMediaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [folderFilter, setFolderFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch = 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.folder.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = folderFilter === "all" || file.folder.startsWith(folderFilter)
    return matchesSearch && matchesFolder
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
            <p className="text-muted-foreground mt-1">
              Manage all your store images and media files
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Sync Cloudinary
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mediaFiles.length}</div>
              <p className="text-xs text-muted-foreground">all media files</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(mediaFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(1)} MB
              </div>
              <p className="text-xs text-muted-foreground">used storage</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Folders</CardTitle>
              <Folder className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{folders.length}</div>
              <p className="text-xs text-muted-foreground">organized folders</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mediaFiles.filter(f => f.type === "image").length}
              </div>
              <p className="text-xs text-muted-foreground">image files</p>
            </CardContent>
          </Card>
        </div>

        {/* Folders */}
        <Card className="mb-6 border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button
                variant={folderFilter === "all" ? "default" : "outline"}
                onClick={() => setFolderFilter("all")}
                className="gap-2"
              >
                <Folder className="h-4 w-4" />
                All Files ({mediaFiles.length})
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.name}
                  variant={folderFilter === folder.name ? "default" : "outline"}
                  onClick={() => setFolderFilter(folder.name)}
                  className="gap-2"
                >
                  <Folder className="h-4 w-4" />
                  {folder.name} ({folder.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files by name or folder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Media Grid */}
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm overflow-hidden group">
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                  <ImageIcon className="absolute inset-0 m-auto h-12 w-12 text-muted-foreground" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="font-medium text-sm truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{file.folder}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {file.width}x{file.height} • {formatFileSize(file.size)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">File</th>
                    <th className="text-left p-4 font-medium">Folder</th>
                    <th className="text-left p-4 font-medium">Size</th>
                    <th className="text-left p-4 font-medium">Dimensions</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{file.folder}</td>
                      <td className="p-4 text-sm">{formatFileSize(file.size)}</td>
                      <td className="p-4 text-sm">{file.width}x{file.height}</td>
                      <td className="p-4">
                        <Badge variant="outline">{file.format.toUpperCase()}</Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>

  )
}
