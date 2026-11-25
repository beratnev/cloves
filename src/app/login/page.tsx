"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { AlertCircle, Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import {
  authNameSchema,
  emailSchema,
  evaluatePasswordRules,
  passwordSchema,
} from "@/lib/validation"

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function LoginForm() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")
  const [isSignUp, setIsSignUp] = useState(tab === "register")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setIsSignUp(tab === "register")
    setError(null)
    setFieldErrors({})
  }, [tab])

  const switchMode = (nextIsSignUp: boolean) => {
    setIsSignUp(nextIsSignUp)
    setError(null)
    setFieldErrors({})
    setPassword("")
    setConfirmPassword("")
    router.replace(nextIsSignUp ? "/login?tab=register" : "/login", { scroll: false })
  }

  const passwordRules = evaluatePasswordRules(password)
  const passedRuleCount = Object.values(passwordRules).filter(Boolean).length

  const strengthMeta = (() => {
    if (passedRuleCount <= 2) return { label: t("strengthWeak" as any), barClass: "bg-red-500", textClass: "text-red-500" }
    if (passedRuleCount === 3) return { label: t("strengthFair" as any), barClass: "bg-amber-500", textClass: "text-amber-600" }
    if (passedRuleCount === 4) return { label: t("strengthGood" as any), barClass: "bg-blue-500", textClass: "text-blue-600" }
    return { label: t("strengthStrong" as any), barClass: "bg-emerald-500", textClass: "text-emerald-600" }
  })()

  const validateForm = (): boolean => {
    const errors: FieldErrors = {}

    if (isSignUp) {
      const nameCheck = authNameSchema.safeParse(name)
      if (!nameCheck.success) {
        errors.name = t("invalidName" as any)
      }
    }

    const emailCheck = emailSchema.safeParse(email)
    if (!emailCheck.success) {
      errors.email = t("invalidEmail" as any)
    }

    if (isSignUp) {
      const passwordCheck = passwordSchema.safeParse(password)
      if (!passwordCheck.success) {
        errors.password = t("passwordRulesNotMet" as any)
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = t("passwordsDoNotMatch" as any)
      }
    } else {
      if (!password) {
        errors.password = t("passwordRequired" as any)
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()

    try {
      if (isSignUp) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            email: normalizedEmail,
            password,
          }),
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          if (data.code === "EMAIL_ALREADY_EXISTS") {
            setFieldErrors((prev) => ({ ...prev, email: t("emailAlreadyExists" as any) }))
            setError(t("emailAlreadyExists" as any))
          } else if (data.code === "RATE_LIMITED") {
            setError(t("tooManyAttempts" as any))
          } else if (data.code === "VALIDATION_ERROR") {
            setError(data.message || t("registrationError" as any))
          } else {
            setError(t("registrationError" as any))
          }
          setIsLoading(false)
          return
        }
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
      })

      if (!result || result.error || !result.ok || !result.url) {
        setError(t("invalidCredentials" as any))
        setIsLoading(false)
        return
      }

      const session = await getSession()
      if (!session?.user) {
        setError(t("invalidCredentials" as any))
        setIsLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      console.error(err)
      setError(t("invalidCredentials" as any))
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-luxury bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-4">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => switchMode(false)}
                disabled={isLoading}
                className={`rounded-md py-2 text-sm font-medium transition-all ${
                  !isSignUp
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("signIn" as any)}
              </button>
              <button
                type="button"
                onClick={() => switchMode(true)}
                disabled={isLoading}
                className={`rounded-md py-2 text-sm font-medium transition-all ${
                  isSignUp
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("signUp" as any)}
              </button>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {isSignUp ? t("createAccount" as any) : t("welcomeBack" as any)}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? t("enterDetailsToCreate" as any)
                  : t("enterEmailToSignIn" as any)}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="name">
                    {t("fullName" as any)}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={t("fullNamePlaceholder" as any)}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }))
                      }}
                      className={`pl-9 ${fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      disabled={isLoading}
                      aria-invalid={!!fieldErrors.name}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs text-destructive">{fieldErrors.name}</p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="email">
                  {t("emailAddress" as any)}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
                      if (error) setError(null)
                    }}
                    className={`pl-9 ${fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    disabled={isLoading}
                    aria-invalid={!!fieldErrors.email}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-destructive">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor="password">
                    {t("password" as any)}
                  </label>
                  {!isSignUp && (
                    <Link href="/contact" className="text-xs text-primary hover:underline">
                      {t("forgotPassword" as any)}
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
                      if (error) setError(null)
                    }}
                    className={`pl-9 pr-10 ${fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    disabled={isLoading}
                    aria-invalid={!!fieldErrors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? t("hidePassword" as any) : t("showPassword" as any)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-destructive">{fieldErrors.password}</p>
                )}

                {isSignUp && (
                  <div className="mt-2 space-y-2 rounded-lg border bg-muted/40 p-3">
                    {password.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{t("passwordStrength" as any)}</span>
                          <span className={`font-medium ${strengthMeta.textClass}`}>{strengthMeta.label}</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 rounded-full transition-colors ${
                                passedRuleCount >= level ? strengthMeta.barClass : "bg-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <ul className="space-y-1 text-xs">
                      {[
                        { ok: passwordRules.minLength, label: t("passwordRuleLength" as any) },
                        { ok: passwordRules.hasUppercase, label: t("passwordRuleUpper" as any) },
                        { ok: passwordRules.hasLowercase, label: t("passwordRuleLower" as any) },
                        { ok: passwordRules.hasNumber, label: t("passwordRuleNumber" as any) },
                        { ok: passwordRules.hasSpecial, label: t("passwordRuleSpecial" as any) },
                      ].map((rule) => (
                        <li
                          key={rule.label}
                          className={`flex items-center gap-1.5 transition-colors ${
                            rule.ok ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                          }`}
                        >
                          {rule.ok ? (
                            <Check className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <X className="h-3.5 w-3.5 shrink-0 opacity-60" />
                          )}
                          <span>{rule.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="confirmPassword">
                    {t("confirmPassword" as any)}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (fieldErrors.confirmPassword) {
                          setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                        }
                      }}
                      className={`pl-9 pr-10 ${fieldErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      disabled={isLoading}
                      aria-invalid={!!fieldErrors.confirmPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirmPassword ? t("hidePassword" as any) : t("showPassword" as any)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("pleaseWait" as any)
                  : isSignUp
                    ? t("signUp" as any)
                    : t("signIn" as any)}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 text-center pt-2">
            <div className="text-sm text-muted-foreground">
              {isSignUp ? t("alreadyHaveAccount" as any) : t("dontHaveAccount" as any)}
              <button
                onClick={() => switchMode(!isSignUp)}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container flex items-center justify-center min-h-[80vh] py-12" />}>
      <LoginForm />
    </Suspense>
  )
}
