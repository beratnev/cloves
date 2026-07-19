import { Truck, Clock, MapPin, Package, Globe, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const zones = [
  { zone: "Continental US", time: "3–5 business days", cost: "Free over $20 / $4.99" },
  { zone: "Alaska & Hawaii", time: "5–8 business days", cost: "$9.99" },
  { zone: "Express (US)", time: "1–2 business days", cost: "$12.99" },
  { zone: "International", time: "Coming soon", cost: "—" },
]

const steps = [
  { icon: Package, title: "Order Placed", desc: "You'll receive a confirmation email immediately." },
  { icon: ShieldCheck, title: "Order Processed", desc: "We prepare and pack your order within 24 hours." },
  { icon: Truck, title: "Shipped", desc: "A tracking number is emailed to you once dispatched." },
  { icon: MapPin, title: "Delivered", desc: "Your order arrives at your door." },
]

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>
            Shipping Info
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Fast, reliable delivery straight to your door. Free shipping on orders over $20.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Shipping Zones */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Shipping Rates & Times</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Zone</th>
                  <th className="text-left p-4 font-semibold">Estimated Delivery</th>
                  <th className="text-left p-4 font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z, i) => (
                  <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{z.zone}</td>
                    <td className="p-4 text-muted-foreground">{z.time}</td>
                    <td className="p-4">{z.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How Your Order Gets to You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-muted-foreground mb-1">STEP {i + 1}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="bg-muted/40 rounded-2xl p-8 space-y-3">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Globe className="h-5 w-5" /> Important Notes</h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Orders placed after 2 PM EST are processed the following business day.</li>
            <li>We do not ship on weekends or federal holidays.</li>
            <li>Tracking information may take up to 12 hours to update after dispatch.</li>
            <li>Clove's is not responsible for delays caused by customs or carrier issues.</li>
            <li>Perishable or temperature-sensitive products may require express shipping.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
