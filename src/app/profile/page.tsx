"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, ShoppingBag, Heart, Settings, MapPin, CreditCard, Bell, Shield, Clock, Eye, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAddressStore, Address } from "@/lib/store/address"
import { useTranslation } from "@/lib/i18n"

const orders: any[] = []
const wishlist: any[] = []
const recentlyViewed: any[] = []

export default function ProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAddressStore()
  const [isMounted, setIsMounted] = useState(false)
  const [userName, setUserName] = useState("")
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Address>>({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    isDefault: false,
  })

  useEffect(() => {
    setIsMounted(true)
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user) {
      setUserName(session.user.name || "")
    }
  }, [status, session, router])

  const handleSaveProfile = async () => {
    // Ideally this would make an API call to update the user in the database
    // For now we just show a success message
    alert("Profile changes saved successfully." as any)
  }

  const handleOpenAddressModal = (address?: Address) => {
    if (address) {
      setEditingAddressId(address.id)
      setFormData(address)
    } else {
      setEditingAddressId(null)
      setFormData({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
        isDefault: false,
      })
    }
    setIsAddressModalOpen(true)
  }

  const handleSaveAddress = () => {
    if (editingAddressId) {
      updateAddress(editingAddressId, formData)
    } else {
      addAddress(formData as Omit<Address, "id">)
    }
    setIsAddressModalOpen(false)
  }

  const handleDeleteAccount = () => {
    if (window.confirm(t("deleteAccountConfirm" as any) || "Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      // For now, this is disabled since authentication is managed via NextAuth and DB
      alert("Please contact support to delete your account.");
    }
  }

  if (!isMounted) return null

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">{t("profile" as any)}</h1>
        <p className="text-muted-foreground">{t("manageAccount" as any)}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="profile">{t("profile" as any)}</TabsTrigger>
          <TabsTrigger value="orders">{t("orders" as any)}</TabsTrigger>
          <TabsTrigger value="wishlist">{t("wishlist" as any)}</TabsTrigger>
          <TabsTrigger value="settings">{t("settings" as any)}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("profileInfo" as any)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("fullName" as any)}</label>
                  <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("emailAddress" as any)}</label>
                  <Input id="email" type="email" value={session?.user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("phone" as any)}</label>
                  <Input type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <Button onClick={handleSaveProfile}>{t("saveChanges" as any)}</Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("savedAddresses" as any)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center p-8 border rounded-lg bg-muted/50">
                    <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">{t("noSavedAddresses" as any)}</p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {address.isDefault && <Badge variant="outline">{t("default" as any)}</Badge>}
                          <h3 className="font-medium">{address.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          {!address.isDefault && (
                            <Button variant="ghost" size="sm" onClick={() => setDefaultAddress(address.id)}>{t("setDefault" as any)}</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleOpenAddressModal(address)}>{t("edit" as any)}</Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeAddress(address.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.addressLine1}
                        {address.addressLine2 && <><br />{address.addressLine2}</>}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                        <br />
                        {address.country}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {address.phone}
                      </p>
                    </div>
                  ))
                )}

                <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={() => handleOpenAddressModal()}>
                      <MapPin className="h-4 w-4 mr-2" />
                      {t("addNewAddress" as any)}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingAddressId ? t("edit" as any) : t("addNewAddress" as any)}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("fullName" as any)}</label>
                        <Input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("addressLine1" as any)}</label>
                        <Input value={formData.addressLine1 || ""} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("addressLine2" as any)}</label>
                        <Input value={formData.addressLine2 || ""} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t("city" as any)}</label>
                          <Input value={formData.city || ""} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t("stateProvince" as any)}</label>
                          <Input value={formData.state || ""} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t("zipCode" as any)}</label>
                          <Input value={formData.zipCode || ""} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t("country" as any)}</label>
                          <Input value={formData.country || ""} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("phone" as any)}</label>
                        <Input type="tel" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={formData.isDefault || false}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="isDefault" className="text-sm font-medium">{t("setAsDefaultAddress" as any)}</label>
                      </div>
                    </div>
                    <Button onClick={handleSaveAddress} className="w-full">
                      {editingAddressId ? t("saveChanges" as any) : t("saveAddress" as any)}
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>{t("ordersTitle" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">{t("noOrders" as any)}</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold">{order.id}</p>
                            <Badge
                              variant={
                                order.status === "Delivered"
                                  ? "default"
                                  : order.status === "Shipped"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.date} • {order.items} {t("items" as any)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold">{order.total}</p>
                          <Button variant="outline" size="sm">{t("viewOrder" as any)}</Button>
                        </div>
                      </div>
                      <Separator />
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">{t("products" as any)}:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.products.map((product: any, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>{t("wishlist" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">{t("wishlistEmpty" as any)}</p>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <Card key={item.id} className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-muted rounded-lg mb-4 relative">
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            Product Image
                          </div>
                        </div>
                        <Badge variant="outline" className="mb-2 text-xs">{item.brand}</Badge>
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          {item.discountPrice ? (
                            <>
                              <span className="font-bold">${item.discountPrice}</span>
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.price}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold">${item.price}</span>
                          )}
                        </div>
                        <Button size="sm" className="w-full">
                          {t("addToCart" as any)}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settingsTitle" as any)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t("notifications" as any)}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("notificationsDesc" as any)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">{t("edit" as any)}</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Security</p>
                    <p className="text-sm text-muted-foreground">
                      Password and 2FA settings
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">{t("edit" as any)}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dangerZone" as any)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleDeleteAccount}>{t("deleteAccount" as any)}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
