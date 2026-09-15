import type { Metadata } from 'next'
import { CryptoPage } from '@/components/pages/crypto-page'

export const metadata: Metadata = {
  title: 'Binance P2P Arbitrage Calculator',
  description:
    'Calculate USDT P2P spread, processor fees, net profit, ROI and break-even sell rate for crypto merchant arbitrage.',
}

export default function Page() {
  return <CryptoPage />
}
