"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Github, Mail } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function LoginPage() {
  const { t } = useTranslation()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const form = e.target as HTMLFormElement
    const emailInput = form.elements.namedItem('email') as HTMLInputElement
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement
    const nameInput = form.elements.namedItem('name') as HTMLInputElement
    const email = emailInput ? emailInput.value : ''
    const password = passwordInput ? passwordInput.value : ''
    const name = nameInput ? nameInput.value : ''

    if (!email.includes('@')) {
      setError(t("invalidEmail" as any))
      setIsLoading(false)
      return
    }

    // Use NextAuth signIn
    try {
      if (isSignUp) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || t("invalidCredentials" as any) || 'Kayıt sırasında bir hata oluştu.');
          setIsLoading(false);
          return;
        }

        // If signup is successful, we can sign them in automatically or show a success message
        // Let's just fall through to the signIn below!
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Error
        setError(t("invalidCredentials" as any) || 'Hatalı e-posta veya şifre. Lütfen tekrar deneyin.');
        setIsLoading(false);
      } else if (result?.ok) {
        // Success
        router.push('/');
        router.refresh();
      }
    } catch (e: any) {
      console.error(e);
      setError(t("invalidCredentials" as any) || 'Hatalı e-posta veya şifre. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-luxury bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isSignUp ? t("createAccount" as any) : t("welcomeBack" as any)}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? t("enterDetailsToCreate" as any) 
                : t("enterEmailToSignIn" as any)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">{t("fullName" as any)}</label>
                  <Input id="name" name="name" required disabled={isLoading} />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">{t("emailAddress" as any)}</label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor="password">{t("password" as any)}</label>
                  {!isSignUp && (
                    <Link href="#" className="text-xs text-primary hover:underline">
                      {t("forgotPassword" as any)}
                    </Link>
                  )}
                </div>
                <Input id="password" name="password" type="password" required disabled={isLoading} />
              </div>
              
              
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("pleaseWait" as any) : (isSignUp ? t("signUp" as any) : t("signIn" as any))}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <div className="text-sm text-muted-foreground">
              {isSignUp ? t("alreadyHaveAccount" as any) : t("dontHaveAccount" as any)}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                }}
                className="font-medium text-primary hover:underline"
                type="button"
                disabled={isLoading}
              >
                {isSignUp ? t("signIn" as any) : t("signUp" as any)}
              </button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
