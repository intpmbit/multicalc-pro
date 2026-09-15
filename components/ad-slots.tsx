'use client'

import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from './app-provider'

/**
 * AdSense integration
 * ------------------------------------------------------------------
 * 1. Add your publisher script once in `app/layout.tsx`:
 *
 *    <Script
 *      async
 *      strategy="afterInteractive"
 *      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 *      crossOrigin="anonymous"
 *    />
 *
 * 2. Replace the placeholder <div> inside `AdFrame` with:
 *
 *    <ins
 *      className="adsbygoogle"
 *      style={{ display: 'block' }}
 *      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *      data-ad-slot={slotId}
 *      data-ad-format="auto"
 *      data-full-width-responsive="true"
 *    />
 *
 * 3. Push the slot after mount:
 *    useEffect(() => { (window.adsbygoogle = window.adsbygoogle || []).push({}) }, [])
 * ------------------------------------------------------------------
 */

function AdLabel() {
  const { t } = useApp()
  return (
    <span className="absolute start-2 top-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
      {t.common.advertisement}
    </span>
  )
}

function AdFrame({
  slotId,
  className,
  children,
}: {
  slotId: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      data-ad-slot={slotId}
      className={cn(
        'relative grid place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-surface/40 backdrop-blur-sm',
        className,
      )}
    >
      <AdLabel />
      {children ?? (
        <span className="text-xs text-muted-foreground/60">{`Google AdSense — ${slotId}`}</span>
      )}
    </div>
  )
}

/** 728x90 desktop / 320x50 mobile leaderboard, directly under the sticky header. */
export function LeaderboardAd() {
  const { isPro } = useApp()
  if (isPro) return null
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-3">
      <AdFrame slotId="header-leaderboard" className="h-[62px] w-full sm:h-[104px]" />
    </div>
  )
}

/** Native in-feed unit rendered inside result stacks for maximum viewability. */
export function InFeedAd({ slotId = 'in-feed-native' }: { slotId?: string }) {
  const { isPro, openPricing } = useApp()
  if (isPro) return null
  return (
    <AdFrame slotId={slotId} className="min-h-[124px] w-full p-5 pt-7">
      <button
        type="button"
        onClick={openPricing}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-mint"
      >
        <Sparkles className="size-3.5" />
        Remove ads with Pro
      </button>
    </AdFrame>
  )
}

/** Mobile-only sticky footer anchor with a dismiss control. */
export function StickyFooterAd() {
  const { isPro, t } = useApp()
  const [dismissed, setDismissed] = useState(false)
  if (isPro || dismissed) return null
  return (
    <div className="fixed inset-x-0 bottom-[68px] z-40 px-3 lg:hidden">
      <div className="glass-strong relative flex h-[58px] items-center justify-center rounded-xl">
        <AdLabel />
        <span className="text-xs text-muted-foreground/60">Google AdSense — sticky-footer</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t.common.close}
          className="absolute end-1.5 top-1.5 grid size-6 place-items-center rounded-md border border-border bg-surface-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

/** Tall sidebar unit for wide viewports. */
export function SidebarAd() {
  const { isPro } = useApp()
  if (isPro) return null
  return <AdFrame slotId="sidebar-rect" className="hidden h-[280px] w-full pt-7 xl:grid" />
}
