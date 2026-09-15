import type { Metadata } from 'next'
import { TransfersPage } from '@/components/pages/transfers-page'

export const metadata: Metadata = {
  title: 'Transfer & E-Wallet Fee Calculator',
  description:
    'Compare PayPal, Wise, Payoneer and SWIFT bank transfer fees, FX spreads and the net amount that actually lands in your account.',
}

export default function Page() {
  return <TransfersPage />
}
