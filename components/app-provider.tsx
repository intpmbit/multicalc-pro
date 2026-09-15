'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Dictionary, type Locale } from '@/lib/dictionaries'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED' | 'EGP' | 'MAD'

export const CURRENCIES: Record<
  CurrencyCode,
  { rate: number; symbol: string; en: string; ar: string; decimals: number }
> = {
  USD: { rate: 1, symbol: '$', en: 'US Dollar', ar: 'دولار أمريكي', decimals: 2 },
  EUR: { rate: 0.92, symbol: '€', en: 'Euro', ar: 'يورو', decimals: 2 },
  GBP: { rate: 0.79, symbol: '£', en: 'British Pound', ar: 'جنيه إسترليني', decimals: 2 },
  SAR: { rate: 3.75, symbol: 'SAR', en: 'Saudi Riyal', ar: 'ريال سعودي', decimals: 2 },
  AED: { rate: 3.67, symbol: 'AED', en: 'UAE Dirham', ar: 'درهم إماراتي', decimals: 2 },
  EGP: { rate: 48.5, symbol: 'EGP', en: 'Egyptian Pound', ar: 'جنيه مصري', decimals: 0 },
  MAD: { rate: 9.85, symbol: 'MAD', en: 'Moroccan Dirham', ar: 'درهم مغربي', decimals: 0 },
}

type AppContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  toggleLocale: () => void
  dir: 'rtl' | 'ltr'
  t: Dictionary
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  /** Formats a USD amount into the active display currency. */
  fx: (usd: number, opts?: { decimals?: number; compact?: boolean }) => string
  /** Formats a plain number with locale digits. */
  nf: (value: number, decimals?: number) => string
  isPro: boolean
  setPro: (v: boolean) => void
  pricingOpen: boolean
  openPricing: () => void
  closePricing: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const LOCALE_KEY = 'mcp.locale'
const CURRENCY_KEY = 'mcp.currency'

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')
  const [isPro, setPro] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)

  // Restore persisted preference, otherwise detect from the browser.
  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_KEY) as Locale | null
    const storedCurrency = window.localStorage.getItem(CURRENCY_KEY) as CurrencyCode | null
    if (stored === 'ar' || stored === 'en') {
      setLocaleState(stored)
    } else if (navigator.language?.toLowerCase().startsWith('ar')) {
      setLocaleState('ar')
    }
    if (storedCurrency && storedCurrency in CURRENCIES) setCurrencyState(storedCurrency)
  }, [])

  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  // Flip the document direction/lang live, with no reload.
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    window.localStorage.setItem(LOCALE_KEY, l)
  }, [])

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c)
    window.localStorage.setItem(CURRENCY_KEY, c)
  }, [])

  const toggleLocale = useCallback(
    () => setLocale(locale === 'en' ? 'ar' : 'en'),
    [locale, setLocale],
  )

  // Latin digits in both locales: financial figures stay scannable and aligned.
  const intlLocale = locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'

  const nf = useCallback(
    (value: number, decimals = 0) =>
      new Intl.NumberFormat(intlLocale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(Number.isFinite(value) ? value : 0),
    [intlLocale],
  )

  const fx = useCallback(
    (usd: number, opts?: { decimals?: number; compact?: boolean }) => {
      const meta = CURRENCIES[currency]
      const value = (Number.isFinite(usd) ? usd : 0) * meta.rate
      const decimals = opts?.decimals ?? (Math.abs(value) >= 1000 ? 0 : meta.decimals)
      const formatted = new Intl.NumberFormat(intlLocale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        notation: opts?.compact && Math.abs(value) >= 1_000_000 ? 'compact' : 'standard',
      }).format(value)
      return currency === 'USD' || currency === 'EUR' || currency === 'GBP'
        ? `${meta.symbol}${formatted}`
        : `${formatted} ${meta.symbol}`
    },
    [currency, intlLocale],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      dir,
      t: dictionaries[locale] as Dictionary,
      currency,
      setCurrency,
      fx,
      nf,
      isPro,
      setPro,
      pricingOpen,
      openPricing: () => setPricingOpen(true),
      closePricing: () => setPricingOpen(false),
    }),
    [locale, setLocale, toggleLocale, dir, currency, setCurrency, fx, nf, isPro, pricingOpen],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
