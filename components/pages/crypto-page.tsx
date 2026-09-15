'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Coins,
  Copy,
  FileDown,
  Percent,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Target,
} from 'lucide-react'
import { useApp, CURRENCIES } from '@/components/app-provider'
import { InFeedAd } from '@/components/ad-slots'
import {
  Field,
  GhostButton,
  GlassCard,
  NumberField,
  RangeField,
  ResultCard,
  SectionHeading,
  SplitBar,
} from '@/components/kit'
import { calcArbitrage } from '@/lib/calculations'
import { cn } from '@/lib/utils'

export function CryptoPage() {
  const { t, nf, currency, locale, isPro, openPricing } = useApp()

  const meta = CURRENCIES[currency]
  const defaultRate = meta.rate

  const [buyRate, setBuyRate] = useState(defaultRate * 1.0)
  const [sellRate, setSellRate] = useState(defaultRate * 1.032)
  const [processorFee, setProcessorFee] = useState(0.5)
  const [volume, setVolume] = useState(5000)
  const [copied, setCopied] = useState(false)

  const result = useMemo(
    () => calcArbitrage({ buyRate, sellRate, processorFee, volume }),
    [buyRate, sellRate, processorFee, volume],
  )

  const localFmt = (v: number, decimals = meta.decimals) =>
    `${new Intl.NumberFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Number.isFinite(v) ? v : 0)} ${meta.symbol}`

  const riskMeta = {
    low: {
      label: t.crypto.riskLow,
      desc: t.crypto.riskLowDesc,
      Icon: ShieldCheck,
      classes: 'border-mint/35 bg-mint/10 text-mint',
    },
    medium: {
      label: t.crypto.riskMedium,
      desc: t.crypto.riskMediumDesc,
      Icon: ShieldQuestion,
      classes: 'border-amber-400/35 bg-amber-400/10 text-amber-300',
    },
    high: {
      label: t.crypto.riskHigh,
      desc: t.crypto.riskHighDesc,
      Icon: ShieldAlert,
      classes: 'border-destructive/40 bg-destructive/10 text-destructive',
    },
  }[result.risk]

  const profitable = result.netProfitLocal >= 0

  const copyReport = async () => {
    const lines = [
      t.crypto.reportTitle,
      '='.repeat(44),
      `${t.crypto.buyRate}: ${localFmt(buyRate, 4)}`,
      `${t.crypto.sellRate}: ${localFmt(sellRate, 4)}`,
      `${t.crypto.processorFee}: ${nf(processorFee, 2)}%`,
      `${t.crypto.volume}: ${nf(volume)} USDT`,
      '-'.repeat(44),
      `${t.crypto.cycleCost}: ${localFmt(result.capitalLocal)}`,
      `${t.crypto.cycleReturn}: ${localFmt(result.grossReturnLocal)}`,
      `${t.crypto.feesPaid}: -${localFmt(result.feesLocal)}`,
      `${t.crypto.netProfit}: ${localFmt(result.netProfitLocal)} (${nf(result.netProfitUsd, 2)} USDT)`,
      `${t.crypto.roi}: ${nf(result.roi, 2)}%`,
      `${t.crypto.risk}: ${riskMeta.label}`,
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
        title={t.crypto.title}
        subtitle={t.crypto.subtitle}
        icon={<Coins className="size-5" />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Inputs */}
        <GlassCard className="h-fit space-y-6 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t.common.inputs}
            </h2>
            <span className="rounded-lg border border-border bg-surface-2/60 px-2.5 py-1 text-xs font-semibold">
              {t.crypto.localCurrency}: {currency}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.crypto.buyRate} htmlFor="buy-rate">
              <NumberField
                id="buy-rate"
                value={buyRate}
                onChange={setBuyRate}
                min={0}
                step={0.0001}
                suffix={meta.symbol}
              />
            </Field>
            <Field label={t.crypto.sellRate} htmlFor="sell-rate">
              <NumberField
                id="sell-rate"
                value={sellRate}
                onChange={setSellRate}
                min={0}
                step={0.0001}
                suffix={meta.symbol}
              />
            </Field>
          </div>

          <Field label={t.crypto.volume} htmlFor="volume">
            <NumberField
              id="volume"
              value={volume}
              onChange={(v) => setVolume(Math.max(0, v))}
              min={0}
              max={1_000_000}
              step={100}
              suffix="USDT"
            />
            <RangeField
              label={t.crypto.volume}
              value={Math.min(volume, 1_000_000)}
              onChange={setVolume}
              min={0}
              max={1_000_000}
              step={100}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span>{nf(1_000_000)}</span>
            </div>
          </Field>

          <Field label={t.crypto.processorFee} hint={`${nf(processorFee, 2)}%`}>
            <RangeField
              label={t.crypto.processorFee}
              value={processorFee}
              onChange={setProcessorFee}
              min={0}
              max={5}
              step={0.05}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0%</span>
              <span>5%</span>
            </div>
          </Field>

          <div className={cn('flex items-start gap-3 rounded-xl border p-3.5', riskMeta.classes)}>
            <riskMeta.Icon className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">
                {t.crypto.risk}: {riskMeta.label}
              </p>
              <p className="mt-0.5 text-xs opacity-80">{riskMeta.desc}</p>
            </div>
          </div>
        </GlassCard>

        {/* Results */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label={t.crypto.spread}
              value={`${nf(result.spreadPct, 2)}%`}
              icon={
                result.spreadPct >= 0 ? (
                  <ArrowUpRight className="size-4" />
                ) : (
                  <ArrowDownRight className="size-4" />
                )
              }
              tone={result.spreadPct >= 0 ? 'violet' : 'danger'}
            />
            <ResultCard
              label={t.crypto.roi}
              value={`${nf(result.roi, 2)}%`}
              icon={<Percent className="size-4" />}
              tone={profitable ? 'mint' : 'danger'}
            />
          </div>

          <ResultCard
            label={t.crypto.netProfit}
            sublabel={`${nf(result.netProfitUsd, 2)} USDT`}
            value={localFmt(result.netProfitLocal)}
            icon={<Coins className="size-4" />}
            tone={profitable ? 'mint' : 'danger'}
            large
          />

          <GlassCard className="space-y-4 p-5">
            <h3 className="text-sm font-semibold">{t.common.results}</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{t.crypto.cycleCost}</dt>
                <dd className="num font-semibold">{localFmt(result.capitalLocal)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{t.crypto.cycleReturn}</dt>
                <dd className="num font-semibold">{localFmt(result.grossReturnLocal)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{t.crypto.feesPaid}</dt>
                <dd className="num font-semibold text-destructive">
                  −{localFmt(result.feesLocal)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
                <dt className="flex items-center gap-1.5 text-muted-foreground">
                  <Target className="size-3.5" />
                  {t.crypto.breakeven}
                </dt>
                <dd className="num font-semibold text-violet">
                  {localFmt(result.breakEvenRate, 4)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">{t.crypto.monthly}</dt>
                <dd className={cn('num font-semibold', profitable ? 'text-mint' : 'text-destructive')}>
                  {localFmt(result.monthly)}
                </dd>
              </div>
            </dl>
            <div className="border-t border-border pt-4">
              <SplitBar
                segments={[
                  { label: t.crypto.cycleCost, value: result.capitalLocal, color: 'var(--violet)' },
                  {
                    label: t.crypto.feesPaid,
                    value: result.feesLocal,
                    color: 'var(--destructive)',
                  },
                  {
                    label: t.crypto.netProfit,
                    value: Math.max(0, result.netProfitLocal),
                    color: 'var(--mint)',
                  },
                ]}
              />
            </div>
          </GlassCard>

          <InFeedAd slotId="crypto-in-feed" />

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
        </div>
      </div>
    </div>
  )
}
