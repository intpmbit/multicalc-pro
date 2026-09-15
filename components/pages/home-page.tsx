'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Crown,
  Globe2,
  Layers,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { CountUp } from '@/components/count-up'
import { InFeedAd } from '@/components/ad-slots'
import {
  BinanceIcon,
  InstagramIcon,
  PayPalIcon,
  PayoneerIcon,
  PinterestIcon,
  TikTokIcon,
  WiseIcon,
  YouTubeIcon,
} from '@/components/brand-icons'
import { GlassCard, PrimaryButton, GhostButton } from '@/components/kit'
import { cn } from '@/lib/utils'

const PLATFORMS = [
  { key: 'youtube', href: '/creator', Icon: YouTubeIcon, accent: '#FF3B30' },
  { key: 'tiktok', href: '/creator', Icon: TikTokIcon, accent: '#00F2EA' },
  { key: 'instagram', href: '/creator', Icon: InstagramIcon, accent: '#E1306C' },
  { key: 'pinterest', href: '/creator', Icon: PinterestIcon, accent: '#E60023' },
  { key: 'paypal', href: '/transfers', Icon: PayPalIcon, accent: '#0070E0' },
  { key: 'wise', href: '/transfers', Icon: WiseIcon, accent: '#9FE870' },
  { key: 'payoneer', href: '/transfers', Icon: PayoneerIcon, accent: '#FF4800' },
  { key: 'binance', href: '/crypto', Icon: BinanceIcon, accent: '#F0B90B' },
] as const

export function HomePage() {
  const { t, openPricing } = useApp()

  const compareRows: { key: keyof typeof t.pricing.f; free: boolean }[] = [
    { key: 'calculators', free: true },
    { key: 'platforms', free: true },
    { key: 'adFree', free: false },
    { key: 'pdf', free: false },
    { key: 'tracker', free: false },
    { key: 'multiCurrency', free: false },
    { key: 'support', free: false },
  ]

  return (
    <div className="space-y-12">
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface/50 px-5 py-10 backdrop-blur-xl sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -start-20 -top-24 size-72 rounded-full bg-primary/25 blur-[90px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -end-16 size-72 rounded-full bg-mint/12 blur-[90px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1.5 text-xs font-semibold text-mint">
            <BadgeCheck className="size-3.5" />
            {t.home.badge}
          </span>

          <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
            <span className="text-gradient">{t.home.heroTitle}</span>
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.home.heroSub}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/creator">
              <PrimaryButton>
                {t.home.ctaPrimary}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </PrimaryButton>
            </Link>
            <GhostButton onClick={openPricing}>
              <Crown className="size-4 text-primary" />
              {t.home.ctaSecondary}
            </GhostButton>
          </div>
        </motion.div>

        <div className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: 25480, suffix: '+', label: t.home.statCalcs, tone: 'mint' },
            { value: 100, suffix: '%', label: t.home.statFree, tone: 'violet' },
            { value: 8, suffix: '', label: t.home.statPlatforms, tone: 'default' },
            { value: 7, suffix: '', label: t.home.statCurrencies, tone: 'default' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              className="glass rounded-2xl p-4"
            >
              <p
                className={cn(
                  'text-2xl font-bold sm:text-3xl',
                  s.tone === 'mint' && 'text-mint',
                  s.tone === 'violet' && 'text-violet',
                )}
              >
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------- Platforms --------------------------- */}
      <section aria-labelledby="tools-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="tools-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t.home.toolsTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.home.toolsSub}</p>
          </div>
          <Layers className="hidden size-6 text-muted-foreground sm:block" />
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {PLATFORMS.map(({ key, href, Icon, accent }, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Link
                href={href}
                className="group glass relative block h-full overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -end-6 -top-8 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: accent }}
                />
                <span
                  className="relative grid size-11 place-items-center rounded-xl border border-border bg-surface-2/70 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: accent }}
                >
                  <Icon className="size-5" />
                </span>
                <p className="relative mt-3 text-sm font-semibold">
                  {t.platforms[key as keyof typeof t.platforms]}
                </p>
                <p className="relative mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t.platforms[`${key}Desc` as keyof typeof t.platforms]}
                </p>
                <ArrowRight className="relative mt-3 size-4 text-muted-foreground transition-all duration-300 group-hover:text-mint ltr:group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <InFeedAd slotId="home-in-feed" />

      {/* ----------------------------- Compare ---------------------------- */}
      <section aria-labelledby="compare-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="compare-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t.home.compareTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.home.compareSub}</p>
          </div>
          <TrendingUp className="hidden size-6 text-muted-foreground sm:block" />
        </div>

        <GlassCard className="mt-5">
          <table className="w-full text-sm">
            <caption className="sr-only">{t.home.compareTitle}</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="px-4 py-3.5 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.home.feature}
                </th>
                <th scope="col" className="w-24 px-2 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.pricing.freeName}
                </th>
                <th scope="col" className="w-24 px-2 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-primary">
                  {t.pricing.proName}
                </th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.key} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="px-4 py-3.5 text-start font-medium">
                    {t.pricing.f[row.key]}
                  </th>
                  <td className="px-2 py-3.5 text-center">
                    {row.free ? (
                      <Check className="mx-auto size-4 text-mint" aria-label="Included" />
                    ) : (
                      <X className="mx-auto size-4 text-muted-foreground/40" aria-label="Not included" />
                    )}
                  </td>
                  <td className="bg-primary/5 px-2 py-3.5 text-center">
                    <Check className="mx-auto size-4 text-mint" aria-label="Included" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe2 className="size-4 text-mint" />
              {t.pricing.guarantee}
            </p>
            <PrimaryButton onClick={openPricing} className="px-4 py-2.5">
              <Sparkles className="size-4" />
              {t.common.upgrade}
            </PrimaryButton>
          </div>
        </GlassCard>
      </section>
    </div>
  )
}
