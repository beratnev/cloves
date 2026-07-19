"use client"

import { useEffect, useState } from "react"
import { useLanguageStore } from "@/lib/i18n"

let cachedRate: number | null = null;
let isFetching = false;
const fetchSubscribers: ((rate: number) => void)[] = [];

export function Price({ 
  amount, 
  className = "", 
  showCurrency = true 
}: { 
  amount: number
  className?: string
  showCurrency?: boolean
}) {
  const { language } = useLanguageStore()
  const [exchangeRate, setExchangeRate] = useState<number>(cachedRate || 33.5)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (cachedRate) {
      setExchangeRate(cachedRate)
      return
    }

    if (!isFetching) {
      isFetching = true
      fetch('/api/exchange-rate')
        .then(res => res.json())
        .then(data => {
          cachedRate = data.rate
          setExchangeRate(data.rate)
          fetchSubscribers.forEach(cb => cb(data.rate))
          fetchSubscribers.length = 0
        })
        .catch(err => {
          console.error("Failed to fetch exchange rate", err)
          isFetching = false
        })
    } else {
      fetchSubscribers.push((rate) => setExchangeRate(rate))
    }
  }, [])

  if (!mounted) {
    const roundedUSD = Math.floor(amount * 10) / 10
    return <span className={`whitespace-nowrap ${className}`}>{showCurrency ? "$" : ""}{roundedUSD.toFixed(2)}</span>
  }

  if (language === "TR") {
    const converted = Math.round(amount * exchangeRate)
    return <span className={`whitespace-nowrap ${className}`}>{converted}{showCurrency ? "\u00A0TL" : ""}</span>
  }

  const roundedUSD = Math.floor(amount * 10) / 10
  return <span className={`whitespace-nowrap ${className}`}>{showCurrency ? "$" : ""}{roundedUSD.toFixed(2)}</span>
}
