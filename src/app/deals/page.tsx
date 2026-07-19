"use client"

import { Tag, Percent, Clock, Star, ArrowRight, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const deals = [
  {
    id: 1,
    title: "50% OFF Shower Gels",
    description: "Refresh your daily routine with our award-winning shower gel collection.",
    discount: "50% OFF",
    category: "Bath & Shower",
    link: "/categories/bath-shower",
    color: "from-blue-500/20 to-cyan-500/20",
    badge: "Flash Sale",
    badgeColor: "bg-red-500",
    endsIn: "2 days",
  },
  {
    id: 2,
    title: "Buy 2 Get 1 Free – Fragrances",
    description: "Stock up on your favorite scents. Mix and match from our entire fragrance line.",
    discount: "B2G1",
    category: "Fragrance",
    link: "/categories/fragrance",
    color: "from-purple-500/20 to-rose-500/20",
    badge: "Best Value",
    badgeColor: "bg-purple-500",
    endsIn: "5 days",
  },
  {
    id: 3,
    title: "30% OFF Skincare Routine",
    description: "Complete your skincare ritual with premium day creams, masks, and peels.",
    discount: "30% OFF",
    category: "Skincare",
    link: "/categories/skincare",
    color: "from-emerald-500/20 to-teal-500/20",
    badge: "Popular",
    badgeColor: "bg-emerald-500",
    endsIn: "7 days",
  },
  {
    id: 4,
    title: "Free Shipping on Orders Over $20",
    description: "Shop your favorites and get free delivery anywhere in the US.",
    discount: "Free Ship",
    category: "All Products",
    link: "/products",
    color: "from-amber-500/20 to-orange-500/20",
    badge: "Always On",
    badgeColor: "bg-amber-500",
    endsIn: "Ongoing",
  },
  {
    id: 5,
    title: "Hair Care Bundle – Save $15",
    description: "Shampoo, conditioner, mask and styling cream. Everything your hair needs.",
    discount: "$15 OFF",
    category: "Hair Care",
    link: "/categories/hair-care",
    color: "from-rose-500/20 to-pink-500/20",
    badge: "Bundle Deal",
    badgeColor: "bg-rose-500",
    endsIn: "3 days",
  },
  {
    id: 6,
    title: "New Arrivals – 20% Off First Week",
    description: "Be the first to try our newest launches at a special introductory price.",
    discount: "20% OFF",
    category: "New Arrivals",
    link: "/new-arrivals",
    color: "from-indigo-500/20 to-blue-500/20",
    badge: "New",
    badgeColor: "bg-indigo-500",
    endsIn: "1 week",
  },
]

export default function DealsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Flame className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
            Deals & Offers
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Limited-time promotions on your favorite Clove's products. Don't miss out!
          </p>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className={`h-32 bg-gradient-to-br ${deal.color} relative flex items-center justify-center`}>
                <span className="text-4xl font-black text-foreground/80">{deal.discount}</span>
                <Badge className={`absolute top-3 right-3 text-white ${deal.badgeColor}`}>
                  {deal.badge}
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg leading-tight">{deal.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Ends in {deal.endsIn}</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link href={deal.link}>
                      Shop Now <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 text-center bg-muted/50 rounded-2xl p-12">
          <Star className="h-8 w-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Never Miss a Deal</h2>
          <p className="text-muted-foreground mb-6">Subscribe to our newsletter and get exclusive offers delivered to your inbox.</p>
          <Button asChild size="lg">
            <Link href="/#newsletter">Subscribe Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
