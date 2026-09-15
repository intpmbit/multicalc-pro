'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import {
  ArrowLeftRight,
  Calculator,
  Coins,
  Crown,
  Globe,
  LayoutDashboard,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CURRENCIES, useApp, type CurrencyCode } from './app-provider'

export const NAV = [
  { href: '/', key: 'home', Icon: LayoutDashboard },
  { href: '/creator', key: 'creator', Icon: Play },
  { href: '/transfers', key: 'transfers', Icon: ArrowLeftRight },
  { href: '/crypto', key: 'crypto', Icon: Coins },
] as const

export function SiteHeader() {
  const { t, locale, toggleLocale, currency, setCurrency, openPricing, isPro } = useApp()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label={t.brand}>
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet shadow-[0_10px_26px_-12px_var(--primary)]">
              <Calculator className="size-5 text-white" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-sm font-semibold tracking-tight">{t.brand}</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">{t.tagline}</span>
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map(({ href, key, Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                    active ? 'text-white' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-lg border border-primary/40 bg-primary/15"
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="size-4" />
                    {t.nav[key]}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <label className="sr-only" htmlFor="currency-switcher">
              {t.common.currency}
            </label>
            <select
              id="currency-switcher"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="rounded-lg border border-border bg-surface-2/70 px-2.5 py-2 text-xs font-semibold outline-none transition-colors hover:border-border-strong focus-visible:border-primary"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                <option key={c} value={c} className="bg-surface">
                  {c}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2/70 px-2.5 py-2 text-xs font-semibold transition-colors hover:border-border-strong"
              aria-label={t.common.language}
            >
              <Globe className="size-3.5 text-primary" />
              {locale === 'en' ? 'العربية' : 'EN'}
            </button>

            {!isPro && (
              <button
                type="button"
                onClick={openPricing}
                className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-br from-primary to-violet px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_26px_-14px_var(--primary)] transition-transform hover:scale-[1.03] sm:flex"
              >
                <Crown className="size-3.5" />
                {t.common.upgrade}
              </button>
            )}
            {isPro && (
              <span className="flex items-center gap-1.5 rounded-lg border border-mint/40 bg-mint/10 px-3 py-2 text-xs font-semibold text-mint">
                <Crown className="size-3.5" />
                {t.common.pro}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export function MobileTabBar() {
  const { t } = useApp()
  const pathname = usePathname()

  return (
    <nav
      aria-label="Tools"
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="glass-strong border-x-0 border-b-0">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {NAV.map(({ href, key, Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex flex-col items-center gap-1 px-1 pb-2.5 pt-3 text-[11px] font-medium transition-colors',
                    active ? 'text-mint' : 'text-muted-foreground',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-indicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-mint"
                    />
                  )}
                  <Icon className="size-5" />
                  <span className="truncate">{t.nav[key]}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export function SiteFooter() {
  const { t } = useApp()
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-32 pt-12 lg:pb-16">
      <div className="glass rounded-2xl p-6">
        <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
          {t.footer.disclaimer}
        </p>
        <p className="mt-3 text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
