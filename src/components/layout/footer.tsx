"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/lib/i18n"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo width={48} height={48} className="text-primary" />
              <span className="font-bold text-2xl" style={{ fontFamily: 'var(--font-libre-baskerville)' }}>Clove's</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("footerDesc" as any)}
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center rounded-md bg-primary/10 px-4 py-2 text-base font-semibold text-primary ring-1 ring-inset ring-primary/20">v1.0.1</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("shop" as any)}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("allProducts" as any)}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("categories" as any)}
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("dealsAndOffers" as any)}
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("newArrivals" as any)}
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("brands" as any)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("support" as any)}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("helpCenter" as any)}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("shippingInfo" as any)}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("returns" as any)}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("contactUs" as any)}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("faq" as any)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("newsletter" as any)}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("newsletterDesc" as any)}
            </p>
            <div className="flex gap-2">
              <Input placeholder={t("enterEmail" as any)} className="flex-1" />
              <Button>{t("subscribe" as any)}</Button>
            </div>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>beratnevcanoglu@outlook.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>---</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <p>&copy; 2026 Clove's. {t("allRightsReserved" as any) || "Tüm hakları saklıdır."}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("privacyPolicy" as any)}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("termsOfService" as any)}
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">
              {t("cookiePolicy" as any)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
