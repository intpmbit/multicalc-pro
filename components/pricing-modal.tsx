'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Crown, ShieldCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from './app-provider'

export function PricingModal() {
  const { pricingOpen, closePricing, t, setPro, isPro, dir } = useApp()

  useEffect(() => {
    if (!pricingOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePricing()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [pricingOpen, closePricing])

  const rows: { key: keyof typeof t.pricing.f; free: boolean }[] = [
    { key: 'calculators', free: true },
    { key: 'platforms', free: true },
    { key: 'adFree', free: false },
    { key: 'pdf', free: false },
    { key: 'tracker', free: false },
    { key: 'multiCurrency', free: false },
    { key: 'support', free: false },
  ]

  return (
    <AnimatePresence>
      {pricingOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pricing-title"
          dir={dir}
        >
          <motion.button
            type="button"
            aria-label={t.common.close}
            onClick={closePricing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="glass-strong relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl p-6 sm:rounded-3xl sm:p-8"
          >
            <button
              type="button"
              onClick={closePricing}
              aria-label={t.common.close}
              className="absolute end-4 top-4 grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            <div className="max-w-md">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Crown className="size-3.5" />
                {t.common.pro}
              </span>
              <h2 id="pricing-title" className="mt-3 text-balance text-2xl font-semibold sm:text-3xl">
                {t.pricing.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.pricing.subtitle}</p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Free */}
              <div className="rounded-2xl border border-border bg-surface-2/40 p-5">
                <p className="text-sm font-semibold text-muted-foreground">{t.pricing.freeName}</p>
                <p className="num mt-2 text-3xl font-semibold">
                  $0
                  <span className="text-base font-medium text-muted-foreground">
                    {t.common.perMonth}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t.pricing.freeDesc}</p>
                <ul className="mt-5 space-y-2.5">
                  {rows.map((r) => (
                    <li
                      key={r.key}
                      className={cn(
                        'flex items-center gap-2.5 text-sm',
                        r.free ? 'text-foreground' : 'text-muted-foreground/45 line-through',
                      )}
                    >
                      {r.free ? (
                        <Check className="size-4 shrink-0 text-mint" />
                      ) : (
                        <X className="size-4 shrink-0" />
                      )}
                      {t.pricing.f[r.key]}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl border border-border py-2.5 text-center text-sm font-semibold text-muted-foreground">
                  {t.pricing.currentPlan}
                </div>
              </div>

              {/* Pro */}
              <div className="glow-violet relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/12 to-transparent p-5">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-10 -top-12 size-36 rounded-full bg-violet/25 blur-3xl"
                />
                <p className="relative text-sm font-semibold text-primary">{t.pricing.proName}</p>
                <p className="num relative mt-2 text-3xl font-semibold">
                  $9.99
                  <span className="text-base font-medium text-muted-foreground">
                    {t.common.perMonth}
                  </span>
                </p>
                <p className="relative mt-1 text-xs text-muted-foreground">{t.pricing.proDesc}</p>
                <ul className="relative mt-5 space-y-2.5">
                  {rows.map((r) => (
                    <li key={r.key} className="flex items-center gap-2.5 text-sm">
                      <Check className="size-4 shrink-0 text-mint" />
                      {t.pricing.f[r.key]}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setPro(true)
                    closePricing()
                  }}
                  disabled={isPro}
                  className="relative mt-5 w-full rounded-xl bg-gradient-to-br from-primary to-violet py-3 text-sm font-semibold text-white shadow-[0_14px_36px_-16px_var(--primary)] transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {isPro ? t.pricing.currentPlan : t.pricing.getPro}
                </button>
              </div>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-mint" />
              {t.pricing.guarantee}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
