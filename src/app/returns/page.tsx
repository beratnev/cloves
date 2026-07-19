import { RefreshCw, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const eligible = [
  "Unopened products in original packaging",
  "Items returned within 30 days of delivery",
  "Products purchased directly from Clove's",
  "Damaged or defective items (any time)",
]

const ineligible = [
  "Opened or used products (unless defective)",
  "Items returned after 30 days",
  "Gift cards or promotional items",
  "Products purchased from third-party retailers",
]

const steps = [
  { num: "01", title: "Contact Us", desc: "Email support@cloves.demo or visit our Help Center to initiate a return." },
  { num: "02", title: "Get Your Label", desc: "We'll email you a prepaid return shipping label within 1 business day." },
  { num: "03", title: "Ship It Back", desc: "Pack securely and drop it at any carrier location." },
  { num: "04", title: "Get Refunded", desc: "Refund processed within 5–7 business days to your original payment method." },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <RefreshCw className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
            Returns & Refunds
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Not happy with your purchase? We make returns simple. 30 days, no questions asked.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* How to Return */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How to Return</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step) => (
              <Card key={step.num}>
                <CardContent className="p-6">
                  <div className="text-3xl font-black text-primary/30 mb-3">{step.num}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-bold mb-6">What Can Be Returned?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4 text-emerald-600">
                  <CheckCircle className="h-5 w-5" /> Eligible for Return
                </h3>
                <ul className="space-y-2">
                  {eligible.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="p-6">
                <h3 className="font-semibold flex items-center gap-2 mb-4 text-red-600">
                  <XCircle className="h-5 w-5" /> Not Eligible
                </h3>
                <ul className="space-y-2">
                  {ineligible.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-muted/40 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-primary mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Ready to start a return?</h3>
              <p className="text-sm text-muted-foreground">Contact our team and we'll handle everything.</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/contact">Contact Support <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
