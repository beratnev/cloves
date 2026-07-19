"use client"

import { LifeBuoy, Search, ChevronRight, BookOpen, Truck, RefreshCw, CreditCard, User, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

const topics = [
  { icon: Truck, title: "Shipping & Delivery", description: "Track orders, delivery times, and shipping zones.", href: "/shipping", color: "text-blue-500" },
  { icon: RefreshCw, title: "Returns & Refunds", description: "Easy 30-day returns, no questions asked.", href: "/returns", color: "text-emerald-500" },
  { icon: CreditCard, title: "Payment & Billing", description: "Accepted payment methods and invoices.", href: "/faq#payment", color: "text-purple-500" },
  { icon: User, title: "My Account", description: "Manage your profile, orders, and preferences.", href: "/profile", color: "text-amber-500" },
  { icon: BookOpen, title: "FAQ", description: "Quick answers to our most common questions.", href: "/faq", color: "text-rose-500" },
  { icon: MessageCircle, title: "Contact Us", description: "Reach out to our support team directly.", href: "/contact", color: "text-teal-500" },
]

const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 3–5 business days. Express options are available at checkout." },
  { q: "Can I return a product?", a: "Yes! We accept returns within 30 days of purchase for unused, unopened items." },
  { q: "Do you ship internationally?", a: "Currently we ship within the US. International shipping is coming soon." },
  { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard SSL encryption and never store card details." },
  { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking link via email. You can also check your Orders page." },
]

export default function HelpPage() {
  const [search, setSearch] = useState("")
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <LifeBuoy className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground mb-8">How can we help you today?</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for answers..."
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Topic Cards */}
        <h2 className="text-2xl font-bold mb-6">Browse by Topic</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {topics.map((topic) => (
            <Link key={topic.href} href={topic.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <topic.icon className={`h-6 w-6 mb-3 ${topic.color}`} />
                  <h3 className="font-semibold mb-1">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                  <div className="flex items-center text-primary text-sm mt-3">
                    Learn more <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick FAQs */}
        <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
        <div className="space-y-3 max-w-2xl">
          {filtered.map((faq, i) => (
            <details key={i} className="border rounded-lg group">
              <summary className="p-4 font-medium cursor-pointer flex items-center justify-between list-none hover:bg-muted/50 transition-colors rounded-lg">
                {faq.q}
                <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
              </summary>
              <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
