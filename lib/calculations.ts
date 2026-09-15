/**
 * Pure, dependency-free financial models.
 * Every function is synchronous so results can be derived inside useMemo
 * and repaint on the same frame as the input change.
 */

/* ------------------------------------------------------------------ */
/* Creator revenue                                                     */
/* ------------------------------------------------------------------ */

export type ProgramId = 'yt-long' | 'yt-shorts' | 'tiktok' | 'reels' | 'pinterest'
export type TierId = 'tier1' | 'tier2' | 'tier3' | 'tier4'
export type NicheId = 'finance' | 'business' | 'gaming' | 'vlogs' | 'entertainment'

type ProgramModel = {
  /** Gross advertiser/brand spend per 1,000 units, at Tier 1 baseline. */
  baseCpm: number
  /** Share of gross the platform or agency retains. */
  platformShare: number
  /** Whether the primary input is followers instead of views. */
  unit: 'views' | 'followers'
  /** How strongly engagement rate moves the payout. */
  engagementWeight: number
  /** Whether the >1min / <1min toggle applies. */
  durationSensitive: boolean
}

export const PROGRAMS: Record<ProgramId, ProgramModel> = {
  'yt-long': {
    baseCpm: 14,
    platformShare: 0.45,
    unit: 'views',
    engagementWeight: 0.35,
    durationSensitive: true,
  },
  'yt-shorts': {
    baseCpm: 1.6,
    platformShare: 0.55,
    unit: 'views',
    engagementWeight: 0.25,
    durationSensitive: false,
  },
  tiktok: {
    baseCpm: 1.1,
    platformShare: 0.1,
    unit: 'views',
    engagementWeight: 0.45,
    durationSensitive: true,
  },
  reels: {
    baseCpm: 32,
    platformShare: 0.15,
    unit: 'followers',
    engagementWeight: 0.9,
    durationSensitive: false,
  },
  pinterest: {
    baseCpm: 2.4,
    platformShare: 0.0,
    unit: 'views',
    engagementWeight: 0.6,
    durationSensitive: false,
  },
}

export const TIERS: Record<TierId, { multiplier: number; withholding: number }> = {
  tier1: { multiplier: 1, withholding: 0.15 },
  tier2: { multiplier: 0.62, withholding: 0.05 },
  tier3: { multiplier: 0.28, withholding: 0.1 },
  tier4: { multiplier: 0.17, withholding: 0.1 },
}

export const NICHES: Record<NicheId, number> = {
  finance: 1.85,
  business: 1.45,
  gaming: 0.82,
  vlogs: 0.95,
  entertainment: 0.7,
}

export type CreatorInput = {
  program: ProgramId
  units: number
  tier: TierId
  niche: NicheId
  /** Percentage, 1 – 15. */
  engagement: number
  /** true when the video runs longer than one minute. */
  overOneMinute: boolean
}

export type CreatorResult = {
  unit: 'views' | 'followers'
  grossRpm: number
  netRpm: number
  gross: number
  platformCut: number
  taxCut: number
  totalCuts: number
  net: number
  keepRatio: number
  annual: number
  perMillion: number
}

export function calcCreator(input: CreatorInput): CreatorResult {
  const model = PROGRAMS[input.program]
  const tier = TIERS[input.tier]
  const units = Math.max(0, input.units)

  // Engagement of 5% is treated as the neutral baseline.
  const engagementFactor = 1 + ((input.engagement - 5) / 10) * model.engagementWeight
  const durationFactor = model.durationSensitive ? (input.overOneMinute ? 1 : 0.42) : 1

  const grossRpm =
    model.baseCpm *
    tier.multiplier *
    NICHES[input.niche] *
    Math.max(0.15, engagementFactor) *
    durationFactor

  const gross = (units / 1000) * grossRpm
  const platformCut = gross * model.platformShare
  const taxCut = (gross - platformCut) * tier.withholding
  const totalCuts = platformCut + taxCut
  const net = gross - totalCuts

  return {
    unit: model.unit,
    grossRpm,
    netRpm: units > 0 ? (net / units) * 1000 : 0,
    gross,
    platformCut,
    taxCut,
    totalCuts,
    net,
    keepRatio: gross > 0 ? net / gross : 0,
    annual: net * 12,
    perMillion: (1_000_000 / 1000) * grossRpm * (gross > 0 ? net / gross : 1),
  }
}

/* ------------------------------------------------------------------ */
/* Transfer fees                                                       */
/* ------------------------------------------------------------------ */

export type ProviderId = 'paypal' | 'wise' | 'payoneer' | 'swift'
export type TxTypeId = 'services' | 'friends' | 'withdrawal' | 'card'

export const PROVIDER_TYPES: Record<ProviderId, TxTypeId[]> = {
  paypal: ['services', 'friends', 'withdrawal'],
  wise: ['services', 'friends', 'withdrawal'],
  payoneer: ['services', 'card', 'withdrawal'],
  swift: ['withdrawal', 'services'],
}

export type FeeLine = { key: string; label: string; amount: number; note?: string }

export type TransferResult = {
  amount: number
  lines: FeeLine[]
  totalFees: number
  net: number
  lossPct: number
}

export type TransferInput = {
  provider: ProviderId
  amount: number
  type: TxTypeId
  /** Adds the FX conversion spread when the payout currency differs from USD. */
  converts: boolean
}

export function calcTransfer(input: TransferInput): TransferResult {
  const amount = Math.max(0, input.amount)
  const lines: FeeLine[] = []

  switch (input.provider) {
    case 'paypal': {
      if (input.type === 'services') {
        lines.push({ key: 'feeBase', label: '4.4%', amount: amount * 0.044 })
        lines.push({ key: 'feeFixed', label: '$0.30', amount: amount > 0 ? 0.3 : 0 })
      } else if (input.type === 'friends') {
        lines.push({ key: 'feeBase', label: '0.0%', amount: 0 })
      } else {
        lines.push({ key: 'feeBase', label: '2.0%', amount: amount * 0.02 })
      }
      if (input.converts) {
        lines.push({ key: 'feeFx', label: '2.5%', amount: amount * 0.025 })
      }
      break
    }
    case 'wise': {
      lines.push({ key: 'feeBase', label: '0.43%', amount: amount * 0.0043 })
      lines.push({ key: 'feeFixed', label: '$0.60', amount: amount > 0 ? 0.6 : 0 })
      break
    }
    case 'payoneer': {
      if (input.type === 'card') {
        lines.push({ key: 'feeBase', label: '3.0%', amount: amount * 0.03 })
      } else if (input.type === 'services') {
        lines.push({ key: 'feeBase', label: '1.0%', amount: amount * 0.01 })
      } else {
        lines.push({ key: 'feeFixed', label: '$1.50', amount: amount > 0 ? 1.5 : 0 })
      }
      if (input.converts) {
        lines.push({ key: 'feeFx', label: '2.0%', amount: amount * 0.02 })
      }
      break
    }
    case 'swift': {
      lines.push({ key: 'feeIntermediary', label: '$20.00', amount: amount > 0 ? 20 : 0 })
      lines.push({ key: 'feeReceiving', label: '$15.00', amount: amount > 0 ? 15 : 0 })
      if (input.converts) {
        lines.push({ key: 'feeFx', label: '1.8%', amount: amount * 0.018 })
      }
      break
    }
  }

  const totalFees = Math.min(
    amount,
    lines.reduce((sum, l) => sum + l.amount, 0),
  )
  const net = amount - totalFees

  return {
    amount,
    lines,
    totalFees,
    net,
    lossPct: amount > 0 ? (totalFees / amount) * 100 : 0,
  }
}

export function compareProviders(amount: number, converts: boolean) {
  return (Object.keys(PROVIDER_TYPES) as ProviderId[]).map((provider) => {
    const type = PROVIDER_TYPES[provider][0]
    return { provider, ...calcTransfer({ provider, amount, type, converts }) }
  })
}

/* ------------------------------------------------------------------ */
/* P2P arbitrage                                                       */
/* ------------------------------------------------------------------ */

export type ArbitrageInput = {
  buyRate: number
  sellRate: number
  /** Percentage, e.g. 0.5 for 0.5%. */
  processorFee: number
  /** USDT volume. */
  volume: number
}

export type ArbitrageResult = {
  capitalLocal: number
  grossReturnLocal: number
  feesLocal: number
  netProfitLocal: number
  netProfitUsd: number
  roi: number
  spreadPct: number
  breakEvenRate: number
  monthly: number
  risk: 'low' | 'medium' | 'high'
}

export function calcArbitrage(input: ArbitrageInput): ArbitrageResult {
  const volume = Math.max(0, input.volume)
  const capitalLocal = volume * input.buyRate
  const grossReturnLocal = volume * input.sellRate
  const feesLocal = grossReturnLocal * (Math.max(0, input.processorFee) / 100)
  const netProfitLocal = grossReturnLocal - feesLocal - capitalLocal
  const roi = capitalLocal > 0 ? (netProfitLocal / capitalLocal) * 100 : 0
  const spreadPct =
    input.buyRate > 0 ? ((input.sellRate - input.buyRate) / input.buyRate) * 100 : 0
  const feeRate = Math.max(0, input.processorFee) / 100
  const breakEvenRate = input.buyRate / Math.max(0.0001, 1 - feeRate)

  const risk: ArbitrageResult['risk'] = roi >= 1.5 ? 'low' : roi > 0 ? 'medium' : 'high'

  return {
    capitalLocal,
    grossReturnLocal,
    feesLocal,
    netProfitLocal,
    netProfitUsd: input.sellRate > 0 ? netProfitLocal / input.sellRate : 0,
    roi,
    spreadPct,
    breakEvenRate,
    monthly: netProfitLocal * 20,
    risk,
  }
}
