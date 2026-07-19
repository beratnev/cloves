"use client"

import { useState } from "react"
import { HelpCircle, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const faqData = [
  {
    category: "Orders & Shipping",
    faqs: [
      { q: "How long does shipping take?", a: "Standard shipping within the US takes 3–5 business days. Express shipping (1–2 business days) is available at checkout. Orders over $20 ship free." },
      { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, they enter processing and cannot be changed. Contact us immediately if needed." },
      { q: "Do you offer international shipping?", a: "Not yet! We currently ship within the United States only. International shipping is on our roadmap and coming soon." },
      { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with a tracking number. You can also view order status from your account's Orders page." },
    ],
  },
  {
    category: "Products & Ingredients",
    faqs: [
      { q: "Are Clove's products cruelty-free?", a: "Yes! All Clove's products are cruelty-free. We never test on animals and our supplier agreements reflect this commitment." },
      { q: "Are products suitable for sensitive skin?", a: "Many of our products are formulated for sensitive skin. Each product page lists skin type compatibility. When in doubt, do a patch test first." },
      { q: "Do you use natural ingredients?", a: "We prioritize natural and sustainably sourced ingredients across our range. Products are free from parabens, SLS, and artificial dyes where possible." },
      { q: "Where are the products made?", a: "Clove's products are developed and manufactured in certified EU and US facilities under strict quality control standards." },
    ],
  },
  {
    category: "Returns & Refunds",
    faqs: [
      { q: "What is your return policy?", a: "We accept returns of unopened, unused products within 30 days of delivery. Damaged or defective items can be returned at any time." },
      { q: "How long do refunds take?", a: "Once we receive your return, refunds are processed within 5–7 business days to your original payment method." },
      { q: "Do I have to pay return shipping?", a: "No! We provide a prepaid return label for all eligible returns. Simply contact our support team to get yours." },
    ],
  },
  {
    category: "Account & Payments",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay." },
      { q: "Is my payment information secure?", a: "Absolutely. We use SSL encryption and never store your full card details. Payments are processed by certified PCI-DSS compliant providers." },
      { q: "Can I shop without an account?", a: "Yes, guest checkout is available. However, creating an account lets you track orders, save addresses, and access exclusive member deals." },
    ],
  },
]

export default function FAQPage() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState<string | null>(null)

  const filtered = faqData.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.faqs.length > 0)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Find answers to the most common questions about Clove's products and services.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No results found for "{search}"</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((cat) => (
              <section key={cat.category}>
                <h2 className="text-xl font-bold mb-4 text-primary">{cat.category}</h2>
                <div className="space-y-2">
                  {cat.faqs.map((faq) => {
                    const key = `${cat.category}-${faq.q}`
                    return (
                      <div key={key} className="border rounded-lg overflow-hidden">
                        <button
                          className="w-full text-left p-4 font-medium flex items-center justify-between hover:bg-muted/50 transition-colors"
                          onClick={() => setOpen(open === key ? null : key)}
                        >
                          <span>{faq.q}</span>
                          <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open === key ? 'rotate-90' : ''}`} />
                        </button>
                        {open === key && (
                          <div className="px-4 pb-4 text-sm text-muted-foreground border-t pt-3 bg-muted/20">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
