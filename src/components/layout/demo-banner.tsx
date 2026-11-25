"use client"

import { Info } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function DemoBanner() {
  const { t } = useTranslation()

  return (
    <div
      role="note"
      aria-label="Demo notice"
      className="w-full rounded-none bg-demo-gradient text-orange-950 border-b border-orange-300/60 px-4 py-2"
    >
      <div className="container mx-auto flex items-center justify-center gap-2 text-center text-xs sm:text-[13px] leading-snug">
        <Info className="h-3.5 w-3.5 shrink-0 text-orange-800" aria-hidden="true" />
        <p className="font-medium tracking-wide text-orange-950">
          <span className="inline-block rounded-sm bg-orange-950/10 border border-orange-950/15 px-1.5 py-0.5 text-[11px] font-bold tracking-wider text-orange-950 mr-2">
            {t("demoBannerLabel" as any, "DEMO")}
          </span>
          {t(
            "demoBannerText" as any,
            "This website is for demonstration purposes only and does not represent a real brand, business, or commercial project."
          )}
        </p>
      </div>
    </div>
  )
}
