"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    const savedEmail = localStorage.getItem('demo-email')
    if (savedEmail) {
      setEmail(savedEmail)
      const usersStr = localStorage.getItem('demo-users')
      if (usersStr) {
        const users = JSON.parse(usersStr)
        const user = users.find((u: any) => u.email === savedEmail)
        if (user && user.name) {
          setName(user.name)
        }
      }
    }
  }, [])

  const handleSaveChanges = () => {
    localStorage.setItem('demo-email', email)
    const usersStr = localStorage.getItem('demo-users')
    if (usersStr) {
      const users = JSON.parse(usersStr)
      const currentUserIndex = users.findIndex((u: any) => u.email === localStorage.getItem('demo-email') || u.email === email)
      if (currentUserIndex !== -1) {
        users[currentUserIndex].name = name
        users[currentUserIndex].email = email
        localStorage.setItem('demo-users', JSON.stringify(users))
      }
    }
    alert("Changes saved successfully." as any)
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      localStorage.removeItem('demo-auth')
      localStorage.removeItem('demo-email')
      window.location.href = '/'
    }
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">{t("settingsTitle" as any)}</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("accountInformation" as any)}</CardTitle>
            <CardDescription>{t("accountInfoDesc" as any)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("fullName" as any)}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("emailAddress" as any)}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="mt-4" onClick={handleSaveChanges}>
              {t("saveChanges" as any)}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("notifications" as any)}</CardTitle>
            <CardDescription>{t("notificationsDesc" as any)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("emailNewsletter" as any)}</p>
                <p className="text-sm text-muted-foreground">{t("emailNewsletterDesc" as any)}</p>
              </div>
              <Button variant="outline" size="sm">{t("subscribed" as any)}</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t("orderUpdates" as any)}</p>
                <p className="text-sm text-muted-foreground">{t("orderUpdatesDesc" as any)}</p>
              </div>
              <Button variant="outline" size="sm">{t("enabled" as any)}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">{t("dangerZone" as any)}</CardTitle>
            <CardDescription>{t("dangerZoneDesc" as any)}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDeleteAccount}>{t("deleteAccount" as any)}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
