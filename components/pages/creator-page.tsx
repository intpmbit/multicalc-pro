'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  CalendarRange,
  Check,
  Copy,
  FileDown,
  Gauge,
  Landmark,
  Play,
  Receipt,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { InFeedAd } from '@/components/ad-slots'
import {
  InstagramIcon,
  PinterestIcon,
  TikTokIcon,
  YouTubeIcon,
} from '@/components/brand-icons'
import {
  Field,
  GhostButton,
  GlassCard,
  NumberField,
  RangeField,
  ResultCard,
  SectionHeading,
  Segmented,
  SelectField,
  SplitBar,
} from '@/components/kit'
import {
  PROGRAMS,
  calcCreator,
  type NicheId,
  type ProgramId,
  type TierId,
} from '@/lib/calculations'
import { cn } from '@/lib/utils'

const MAX_UNITS = 10_000_000

export function CreatorPage() {
  const { t, fx, nf, isPro, openPricing, locale } = useApp()

  const [program, setProgram] = useState<ProgramId>('yt-long')
  const [units, setUnits] = useState(250_000)
  const [tier, setTier] = useState<TierId>('tier1')
  const [niche, setNiche] = useState<NicheId>('finance')
  const [engagement, setEngagement] = useState(5)
  const [overOneMinute, setOverOneMinute] = useState(true)
  const [copied, setCopied] = useState(false)

  const model = PROGRAMS[program]

  const result = useMemo(
    () => calcCreator({ program, units, tier, niche, engagement, overOneMinute }),
    [program, units, tier, niche, engagement, overOneMinute],
  )

  const programOptions = [
    { value: 'yt-long' as const, label: t.creator.ytLong, icon: <YouTubeIcon className="size-4" /> },
    { value: 'yt-shorts' as const, label: t.creator.ytShorts, icon: <Play className="size-4" /> },
    { value: 'tiktok' as const, label: t.creator.ttRewards, icon: <TikTokIcon className="size-4" /> },
    { value: 'reels' as const, label: t.creator.igReels, icon: <InstagramIcon className="size-4" /> },
    {
      value: 'pinterest' as const,
      label: t.creator.pinAffiliate,
      icon: <PinterestIcon className="size-4" />,
    },
  ]

  const tierHints: Record<TierId, string> = {
    tier1: t.creator.tier1Hint,
    tier2: t.creator.tier2Hint,
    tier3: t.creator.tier3Hint,
    tier4: t.creator.tier4Hint,
  }

  const unitLabel = model.unit === 'followers' ? t.creator.followers : t.creator.views

  const copyReport = async () => {
    const lines = [
      t.creator.reportTitle,
      '='.repeat(44),
      `${t.creator.platform}: ${programOptions.find((p) => p.value === program)?.label}`,
      `${unitLabel}: ${nf(units)}`,
      `${t.creator.tier}: ${t.creator[tier]}`,
      `${t.creator.niche}: ${t.creator[niche]}`,
      `${t.creator.engagement}: ${nf(engagement, 1)}%`,
      '-'.repeat(44),
      `${t.creator.rpm}: ${fx(result.grossRpm, { decimals: 2 })}`,
      `${t.creator.gross}: ${fx(result.gross, { decimals: 2 })}`,
      `${t.creator.platformCut}: -${fx(result.platformCut, { decimals: 2 })}`,
      `${t.creator.taxCut}: -${fx(result.taxCut, { decimals: 2 })}`,
      `${t.creator.net}: ${fx(result.net, { decimals: 2 })}`,
      `${t.creator.annual}: ${fx(result.annual, { decimals: 0 })}`,
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t.creator.title}
        subtitle={t.creator.subtitle}
        icon={<Play className="size-5" />}
      />

      <Segmented
        groupId="creator-program"
        value={program}
        onChange={setProgram}
        options={programOptions}
        scroll
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* ------------------------------ Inputs ----------------------------- */}
        <GlassCard className="h-fit space-y-6 p-5 sm:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t.common.inputs}
          </h2>

          <Field label={unitLabel} htmlFor="units">
            <NumberField
              id="units"
              value={units}
              onChange={(v) => setUnits(Math.min(MAX_UNITS, Math.max(0, v)))}
              min={0}
              max={MAX_UNITS}
              step={1000}
            />
            <RangeField
              label={unitLabel}
              value={Math.min(units, MAX_UNITS)}
              onChange={setUnits}
              min={0}
              max={MAX_UNITS}
              step={1000}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span>{nf(MAX_UNITS)}</span>
            </div>
          </Field>

          <Field label={t.creator.tier} hint={tierHints[tier]} htmlFor="tier">
            <SelectField
              id="tier"
              value={tier}
              onChange={setTier}
              options={[
                { value: 'tier1', label: t.creator.tier1 },
                { value: 'tier2', label: t.creator.tier2 },
                { value: 'tier3', label: t.creator.tier3 },
                { value: 'tier4', label: t.creator.tier4 },
              ]}
            />
          </Field>

          <Field
            label={t.creator.niche}
            hint={niche === 'finance' ? t.creator.nicheHintTop : undefined}
            htmlFor="niche"
          >
            <SelectField
              id="niche"
              value={niche}
              onChange={setNiche}
              options={[
                { value: 'finance', label: t.creator.finance },
                { value: 'business', label: t.creator.business },
                { value: 'gaming', label: t.creator.gaming },
                { value: 'vlogs', label: t.creator.vlogs },
                { value: 'entertainment', label: t.creator.entertainment },
              ]}
            />
          </Field>

          <Field label={t.creator.engagement} hint={`${nf(engagement, 1)}%`}>
            <RangeField
              label={t.creator.engagement}
              value={engagement}
              onChange={setEngagement}
              min={1}
              max={15}
              step={0.1}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>1%</span>
              <span>15%</span>
            </div>
          </Field>

          {model.durationSensitive && (
            <Field label={t.creator.duration}>
              <Segmented
                groupId="creator-duration"
                value={overOneMinute ? 'long' : 'short'}
                onChange={(v) => setOverOneMinute(v === 'long')}
                options={[
                  { value: 'long', label: t.creator.overOneMin },
                  { value: 'short', label: t.creator.underOneMin },
                ]}
              />
            </Field>
          )}
        </GlassCard>

        {/* ----------------------------- Results ----------------------------- */}
        <div className="space-y-4">
          <motion.div layout className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label={t.creator.rpm}
              sublabel={t.creator.rpmSub}
              value={fx(result.grossRpm, { decimals: 2 })}
              icon={<Gauge className="size-4" />}
              tone="violet"
            />
            <ResultCard
              label={t.creator.gross}
              sublabel={t.creator.grossSub}
              value={fx(result.gross, { decimals: 2 })}
              icon={<TrendingUp className="size-4" />}
            />
            <ResultCard
              label={t.creator.cuts}
              sublabel={t.creator.cutsSub}
              value={`−${fx(result.totalCuts, { decimals: 2 })}`}
              icon={<Receipt className="size-4" />}
              tone="danger"
            />
            <ResultCard
              label={t.creator.net}
              sublabel={t.creator.netSub}
              value={fx(result.net, { decimals: 2 })}
              icon={<Wallet className="size-4" />}
              tone="mint"
            />
          </motion.div>

          <GlassCard className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{t.creator.split}</h3>
              <span className="flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-xs font-semibold text-mint">
                {t.creator.youKeep}
                <span className="num">{nf(result.keepRatio * 100, 1)}%</span>
              </span>
            </div>
            <SplitBar
              segments={[
                { label: t.creator.youKeep, value: result.net, color: 'var(--mint)' },
                { label: t.creator.platformCut, value: result.platformCut, color: 'var(--violet)' },
                { label: t.creator.taxCut, value: result.taxCut, color: 'var(--destructive)' },
              ]}
            />
            <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div className="rounded-xl border border-border bg-surface-2/40 p-3">
                <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <CalendarRange className="size-3.5" />
                  {t.creator.annual}
                </dt>
                <dd className="num mt-1.5 text-lg font-semibold text-mint">
                  {fx(result.annual, { decimals: 0, compact: true })}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-surface-2/40 p-3">
                <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <Landmark className="size-3.5" />
                  {t.creator.perVideo}
                </dt>
                <dd className="num mt-1.5 text-lg font-semibold">
                  {fx(result.perMillion, { decimals: 0, compact: true })}
                </dd>
              </div>
            </dl>
          </GlassCard>

          <InFeedAd slotId="creator-in-feed" />

          <div className="flex flex-wrap gap-3">
            <GhostButton onClick={copyReport} className="flex-1">
              {copied ? (
                <>
                  <Check className="size-4 text-mint" />
                  {t.common.copied}
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  {t.common.copyReport}
                </>
              )}
            </GhostButton>
            <GhostButton
              onClick={() => (isPro ? window.print() : openPricing())}
              className={cn('flex-1', !isPro && 'border-primary/40 text-primary')}
            >
              <FileDown className="size-4" />
              {t.common.exportPdf}
              {!isPro && (
                <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                  {t.common.pro}
                </span>
              )}
            </GhostButton>
          </div>

          <p className="text-[11px] leading-relaxed text-muted-foreground/70" lang={locale}>
            {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
