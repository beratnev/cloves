"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Check, X, Award, TrendingUp, Star } from "lucide-react"
import { motion } from "framer-motion"

const products = [
  {
    id: "1",
    name: "MacBook Pro 14\" M3 Max",
    slug: "macbook-pro-14-m3-max",
    price: 1999,
    discountPrice: 1799,
    images: ["/placeholder-product.jpg"],
    category: "Laptops",
    rating: 4.9,
    reviewCount: 245,
    specs: {
      "Processor": "Apple M3 Max (12-core CPU, 40-core GPU)",
      "Memory": "36GB Unified Memory",
      "Storage": "1TB SSD",
      "Display": "14.2\" Liquid Retina XDR",
      "Battery": "Up to 22 hours",
      "Weight": "3.5 pounds",
    },
  },
  {
    id: "2",
    name: "Dell XPS 15",
    slug: "dell-xps-15",
    price: 1599,
    images: ["/placeholder-product.jpg"],
    category: "Laptops",
    rating: 4.6,
    reviewCount: 156,
    specs: {
      "Processor": "Intel Core i9-13900H",
      "Memory": "32GB DDR5",
      "Storage": "1TB SSD",
      "Display": "15.6\" OLED 3.5K",
      "Battery": "Up to 12 hours",
      "Weight": "4.2 pounds",
    },
  },
  {
    id: "3",
    name: "ASUS ROG Strix G16",
    slug: "asus-rog-strix-g16",
    price: 1899,
    discountPrice: 1699,
    images: ["/placeholder-product.jpg"],
    category: "Gaming",
    rating: 4.5,
    reviewCount: 89,
    specs: {
      "Processor": "Intel Core i9-13980HX",
      "Memory": "32GB DDR5",
      "Storage": "1TB SSD",
      "Display": "16\" Nebula HDR 240Hz",
      "Battery": "Up to 8 hours",
      "Weight": "5.3 pounds",
    },
  },
]

const aiComparison = {
  winner: "MacBook Pro 14\" M3 Max",
  winnerReason: "Best overall performance, battery life, and display quality for professionals",
  summary: "The MacBook Pro M3 Max offers the best balance of performance, battery life, and display quality, making it ideal for creative professionals and developers. The Dell XPS 15 is a strong Windows alternative with excellent OLED display, while the ASUS ROG is best for gaming enthusiasts.",
  ratings: {
    "MacBook Pro 14\" M3 Max": { performance: 9.5, battery: 10, display: 9.5, value: 8.5 },
    "Dell XPS 15": { performance: 8.5, battery: 7, display: 9, value: 9 },
    "ASUS ROG Strix G16": { performance: 9, battery: 6, display: 8.5, value: 8 },
  } as Record<string, { performance: number; battery: number; display: number; value: number }>,
}

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["1", "2"])

  const toggleProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const comparedProducts = products.filter((p) => selectedProducts.includes(p.id))

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Product Comparison</h1>
        <p className="text-muted-foreground">
          Select up to 3 products to compare with AI-powered analysis
        </p>
      </div>

      {/* Product Selection */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Select Products to Compare</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedProducts.includes(product.id)
                      ? "border-2 border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleProduct(product.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${product.discountPrice || product.price}
                        </p>
                      </div>
                      {selectedProducts.includes(product.id) && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {comparedProducts.length >= 2 && (
        <>
          {/* AI Comparison Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">AI Analysis</h3>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Winner: {aiComparison.winner}</p>
                    <p className="text-sm text-muted-foreground">{aiComparison.winnerReason}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{aiComparison.summary}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comparison Table */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-6">Specifications Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Feature</th>
                      {comparedProducts.map((product) => (
                        <th key={product.id} className="text-left py-3 px-4 font-medium">
                          {product.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(comparedProducts[0].specs).map((spec) => (
                      <tr key={spec} className="border-b">
                        <td className="py-3 px-4 font-medium">{spec}</td>
                        {comparedProducts.map((product) => (
                          <td key={product.id} className="py-3 px-4">
                            {product.specs[spec as keyof typeof product.specs]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Ratings Comparison */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-6">AI Ratings</h3>
              <div className="space-y-6">
                {["performance", "battery", "display", "value"].map((category) => (
                  <div key={category}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <div className="space-y-2">
                      {comparedProducts.map((product) => {
                        const ratings = aiComparison.ratings[product.name]
                        const rating = ratings?.[category as keyof typeof ratings] || 0
                        return (
                          <div key={product.id} className="flex items-center gap-3">
                            <span className="text-sm w-48 truncate">{product.name}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${rating * 10}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-primary"
                              />
                            </div>
                            <span className="text-sm font-medium w-8">{rating}/10</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {comparedProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Pros</h4>
                      <ul className="space-y-1">
                        <li className="text-sm flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Excellent performance</span>
                        </li>
                        <li className="text-sm flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Great display quality</span>
                        </li>
                        <li className="text-sm flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>Premium build</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-destructive">Cons</h4>
                      <ul className="space-y-1">
                        <li className="text-sm flex items-start gap-2">
                          <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span>Premium price</span>
                        </li>
                        <li className="text-sm flex items-start gap-2">
                          <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span>Limited upgrade options</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Ready to Make a Decision?</h3>
              <p className="mb-6 opacity-90">
                Choose the product that best fits your needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {comparedProducts.map((product) => (
                  <Button
                    key={product.id}
                    size="lg"
                    variant="secondary"
                    className="flex-1 max-w-xs"
                  >
                    Buy {product.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
