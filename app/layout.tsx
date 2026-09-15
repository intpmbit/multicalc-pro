import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Tajawal } from 'next/font/google'
import { AppProvider } from '@/components/app-provider'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://multicalc-pro.vercel.app'),
  title: {
    default: 'MultiCalc Pro — Creator Revenue, Transfer Fees & P2P Arbitrage Calculators',
    template: '%s · MultiCalc Pro',
  },
  description:
    'Realistic financial analytics for creators and digital workers. Estimate YouTube, TikTok, Reels and Pinterest earnings, PayPal/Wise/Payoneer/SWIFT transfer fees, and Binance P2P arbitrage ROI — free, instant, bilingual (EN/AR).',
  keywords: [
    'YouTube money calculator',
    'RPM calculator',
    'TikTok creator rewards',
    'PayPal fee calculator',
    'Wise transfer fees',
    'Payoneer withdrawal fees',
    'Binance P2P profit',
    'حاسبة أرباح يوتيوب',
  ],
  applicationName: 'MultiCalc Pro',
  generator: 'v0.app',
  openGraph: {
    type: 'website',
    siteName: 'MultiCalc Pro',
    title: 'MultiCalc Pro — Financial Analytics for Creators & Digital Workers',
    description:
      'Model creator payouts, cross-border transfer fees, and P2P arbitrage spreads with transparent math.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MultiCalc Pro',
    description: 'Realistic financial analytics for creators and digital workers.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0B0F17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${tajawal.variable}`}>
      {/*
        Google AdSense loader — replace the client id and uncomment to go live.
        <Script
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        />
      */}
      <body className="antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
