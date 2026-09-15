import type { Metadata } from 'next'
import { CreatorPage } from '@/components/pages/creator-page'

export const metadata: Metadata = {
  title: 'Creator Revenue Calculator',
  description:
    'Estimate YouTube long-form, Shorts, TikTok Creator Rewards, Instagram Reels and Pinterest affiliate earnings by country tier, niche and engagement rate.',
}

export default function Page() {
  return <CreatorPage />
}
