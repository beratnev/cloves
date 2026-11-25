"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { authNameSchema, emailSchema } from "@/lib/validation"

export default function SettingsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [status, session, router])

  const handleSaveChanges = async () => {
    setSaveMessage(null)

    const nameCheck = authNameSchema.safeParse(name)
    if (!nameCheck.success) {
      setSaveMessage({ type: "error", text: t("invalidName" as any) })
      return
    }

    const emailCheck = emailSchema.safeParse(email)
    if (!emailCheck.success) {
      setSaveMessage({ type: "error", text: t("invalidEmail" as any) })
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameCheck.data, email: emailCheck.data }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setSaveMessage({
          type: "error",
          text: data.code === "EMAIL_ALREADY_EXISTS"
            ? t("emailAlreadyExists" as any)
            : data.message || "Failed to save changes.",
        })
        return
      }

      await update({ name: data.user.name, email: data.user.email })
      setSaveMessage({ type: "success", text: t("saveChanges" as any) + " ✓" })
    } catch (err) {
      console.error(err)
      setSaveMessage({ type: "error", text: "Failed to save changes." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    if (!window.confirm(t("deleteAccountConfirm" as any))) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch("/api/account", { method: "DELETE" })
      if (!res.ok && res.status !== 401) {
        const data = await res.json().catch(() => ({}))
        setDeleteError(data.message || "Failed to delete account.")
        setIsDeleting(false)
        return
      }

      localStorage.removeItem("demo-auth")
      localStorage.removeItem("demo-email")

      await signOut({ redirect: false })
      window.location.href = "/"
    } catch (err) {
      console.error(err)
      setDeleteError("Failed to delete account.")
      setIsDeleting(false)
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return null
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
              <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isSaving} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("emailAddress" as any)}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSaving} />
            </div>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.type === "error" ? "text-destructive" : "text-emerald-600"}`}>
                {saveMessage.text}
              </p>
            )}
            <Button className="mt-4" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? t("pleaseWait" as any) : t("saveChanges" as any)}
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
          <CardContent className="space-y-3">
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? t("pleaseWait" as any) : t("deleteAccount" as any)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
