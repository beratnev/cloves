"use client";

import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Loading() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground font-medium tracking-tight animate-pulse">
        {t("loading" as any) || "Loading..."}
      </p>
    </div>
  );
}
