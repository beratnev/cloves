"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Truck, Shield, CreditCard, MapPin, User, Phone, Mail, Check, ArrowRight, ArrowLeft, Lock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/lib/store/cart"
import { useTranslation } from "@/lib/i18n"

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { items, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [isGuest, setIsGuest] = useState(false)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = subtotal >= 20 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const steps = [
    { id: 1, title: t("accountInformation" as any), icon: User },
    { id: 2, title: t("shippingInformation" as any), icon: MapPin },
    { id: 3, title: t("paymentMethod" as any), icon: CreditCard },
    { id: 4, title: t("reviewOrder" as any), icon: Check },
  ]

  const handlePlaceOrder = () => {
    clearCart()
    alert(t("orderPlaced" as any))
  }

  const nextStep = () => setStep(Math.min(step + 1, 4))
  const prevStep = () => setStep(Math.max(step - 1, 1))

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">{t("cartEmpty" as any)}</p>
            <Button onClick={() => window.location.href = "/products"}>
              {t("continueShopping" as any)}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">{t("checkoutTitle" as any)}</h1>
        <p className="text-muted-foreground">
          {t("completePurchaseIn" as any)} {steps.length} {t("simpleSteps" as any)}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    step >= s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-background"
                  }`}
                >
                  {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                </div>
                <span className={`text-sm mt-2 ${step >= s.id ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${step > s.id ? "bg-primary" : "bg-muted-foreground/30"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t("accountInformation" as any)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="guest" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="guest" onClick={() => setIsGuest(true)}>
                          {t("createAccount" as any) || "Hesap Oluştur"}
                        </TabsTrigger>
                        <TabsTrigger value="account" onClick={() => setIsGuest(false)}>
                          {t("signIn" as any)}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="guest">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            {t("createAccountDesc" as any) || "Alışverişi tamamlamak için lütfen yeni bir hesap oluşturun."}
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{t("firstName" as any)}</label>
                              <Input placeholder="John" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{t("lastName" as any)}</label>
                              <Input placeholder="Doe" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("emailAddress" as any)}</label>
                            <Input type="email" placeholder="john@example.com" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("phone" as any)}</label>
                            <Input type="tel" placeholder="+1 (555) 123-4567" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("password" as any)}</label>
                            <Input type="password" placeholder="••••••••" />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            <span>Your information is secure</span>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="account">
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground mb-4">
                            {t("signInToAccess" as any)}
                          </p>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("emailAddress" as any)}</label>
                            <Input type="email" placeholder="john@example.com" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("password" as any)}</label>
                            <Input type="password" placeholder="••••••••" />
                          </div>
                          <Button variant="link" className="px-0">
                            {t("forgotPassword" as any)}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {t("shippingInformation" as any)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("addressLine1" as any)}</label>
                      <Input placeholder="123 Main Street" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("addressLine2" as any)}</label>
                      <Input placeholder="Apt, Suite, etc." />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("city" as any)}</label>
                        <Input placeholder="San Francisco" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("stateProvince" as any)}</label>
                        <Input placeholder="CA" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("zipCode" as any)}</label>
                        <Input placeholder="94102" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("country" as any)}</label>
                        <Input placeholder="United States" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("deliveryInstructions" as any)}</label>
                      <Input placeholder="Gate code, building instructions, etc." />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {t("paymentMethod" as any)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("cardNumber" as any)}</label>
                      <Input placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("expiryDate" as any)}</label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("cvv" as any)}</label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("nameOnCard" as any)}</label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>{t("paymentSecure" as any)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>{t("sslEncryption" as any)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      {t("reviewOrder" as any)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">{t("shippingAddress" as any)}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>John Doe</p>
                        <p>123 Main Street</p>
                        <p>San Francisco, CA 94102</p>
                        <p>United States</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">{t("paymentMethod" as any)}</h3>
                      <div className="text-sm text-muted-foreground">
                        <p>•••• 4242</p>
                        <p>Expires 12/25</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">{t("items" as any)}</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span>{item.name} × {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className={step === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back" as any)}
            </Button>
            <Button onClick={step === 4 ? handlePlaceOrder : nextStep}>
              {step === 4 ? (
                <>
                  {t("placeOrder" as any)} - ${total.toFixed(2)}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  {t("continueBtn" as any)}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>{t("orderSummary" as any)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("subtotal" as any)}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("shipping" as any)}</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("tax" as any)}</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>{t("total" as any)}</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">{t("freeShippingDesc" as any)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">{t("easyReturnsDesc" as any)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Secure checkout</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">
                {t("termsOfServiceCheck" as any)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
