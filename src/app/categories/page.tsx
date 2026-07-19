import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { name: "Fragrance", slug: "fragrance", desc: "Eau de parfum, cologne & room scents", emoji: "🌸", color: "from-rose-500/20 to-pink-500/20" },
  { name: "Body Care", slug: "body-care", desc: "Lotions, oils, and butters for soft skin", emoji: "✨", color: "from-amber-500/20 to-orange-500/20" },
  { name: "Bath & Shower", slug: "bath-shower", desc: "Shower gels, soaps, and bath salts", emoji: "🛁", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Skincare", slug: "skincare", desc: "Cleansers, moisturizers, masks & more", emoji: "🌿", color: "from-emerald-500/20 to-teal-500/20" },
  { name: "Hair Care", slug: "hair-care", desc: "Shampoos, conditioners, and treatments", emoji: "💆", color: "from-purple-500/20 to-violet-500/20" },
  { name: "Home Fragrance", slug: "home-fragrance", desc: "Reed diffusers and candles for every room", emoji: "🕯️", color: "from-indigo-500/20 to-blue-500/20" },
  { name: "Gifts", slug: "gifts", desc: "Curated sets for every occasion", emoji: "🎁", color: "from-fuchsia-500/20 to-pink-500/20" },
  { name: "Sale", slug: "sale", desc: "Great products at even better prices", emoji: "🏷️", color: "from-red-500/20 to-rose-500/20" },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 to-rose-500/10 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
            Shop by Category
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Explore our full range of premium beauty and personal care products.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group h-full cursor-pointer">
                <div className={`h-28 bg-gradient-to-br ${cat.color} flex items-center justify-center text-5xl`}>
                  {cat.emoji}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{cat.desc}</p>
                  <div className="flex items-center text-sm text-primary font-medium">
                    Shop Now <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
