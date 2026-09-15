'use client'

import type { ReactNode } from 'react'
import { LeaderboardAd, StickyFooterAd } from './ad-slots'
import { PricingModal } from './pricing-modal'
import { MobileTabBar, SiteFooter, SiteHeader } from './site-header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <LeaderboardAd />
      <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6">{children}</main>
      <SiteFooter />
      <StickyFooterAd />
      <MobileTabBar />
      <PricingModal />
    </div>
  )
}
