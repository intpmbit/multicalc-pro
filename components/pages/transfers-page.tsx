'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeftRight,
  Check,
  Copy,
  FileDown,
  Percent,
  Repeat,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { useApp } from '@/components/app-provider'
import { InFeedAd } from '@/components/ad-slots'
import { BankIcon, PayPalIcon, PayoneerIcon, WiseIcon } from '@/components/brand-icons'
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
  PROVIDER_TYPES,
  calcTransfer,
  compareProviders,
  type ProviderId,
  type TxTypeId,
} from '@/lib/calculations'
import { cn } from '@/lib/utils'

const MAX_AMOUNT = 100_000

export function TransfersPage() {
  const { t, fx, nf, isPro, openPricing } = useApp()

  const [provider, setProvider] = useState<ProviderId>('paypal')
  const [amount, setAmount] = useState(2500)
  const [type, setType] = useState<TxTypeId>('services')
  const [converts, setConverts] = useState(true)
  const [copied, setCopied] = useState(false)

  // Keep the transaction type valid whenever the provider changes.
  useEffect(() => {
    if (!PROVIDER_TYPES[provider].includes(type)) setType(PROVIDER_TYPES[provider][0])
  }, [provider, type])

  const result = useMemo(
    () => calcTransfer({ provider, amount, type, converts }),
    [provider, amount, type, converts],
  )

  const comparison = useMemo(() => compareProviders(amount, converts), [amount, converts])
  const bestProvider = useMemo(
    () => comparison.reduce((a, b) => (b.net > a.net ? b : a)).provider,
    [comparison],
  )

  const providerOptions = [
    { value: 'paypal' as const, label: t.transfers.paypal, icon: <PayPalIcon className="size-4" /> },
    { value: 'wise' as const, label: t.transfers.wise, icon: <WiseIcon className="size-4" /> },
    {
      value: 'payoneer' as const,
      label: t.transfers.payoneer,
      icon: <PayoneerIcon className="size-4" />,
    },
    { value: 'swift' as const, label: t.transfers.swift, icon: <BankIcon className="size-4" /> },
  ]

  const typeLabel: Record<TxTypeId, string> = {
    services: t.transfers.services,
    friends: t.transfers.friends,
    withdrawal: t.transfers.withdrawal,
    card: t.transfers.card,
  }

  const lineLabel: Record<string, string> = {
    feeBase: t.transfers.feeBase,
    feeFixed: t.transfers.feeFixed,
    feeFx: t.transfers.feeFx,
    feeIntermediary: t.transfers.feeIntermediary,
    feeReceiving: t.transfers.feeReceiving,
  }

  const copyReport = async () => {
    const lines = [
      t.transfers.reportTitle,
      '='.repeat(44),
      `${t.transfers.provider}: ${providerOptions.find((p) => p.value === provider)?.label}`,
      `${t.transfers.amount}: ${fx(amount, { decimals: 2 })}`,
      `${t.transfers.type}: ${typeLabel[type]}`,
      '-'.repeat(44),
      ...result.lines.map(
        (l) => `${lineLabel[l.key]} (${l.label}): -${fx(l.amount, { decimals: 2 })}`,
      ),
      `${t.transfers.totalFees}: -${fx(result.totalFees, { decimals: 2 })}`,
      `${t.transfers.netArriving}: ${fx(result.net, { decimals: 2 })}`,
      `${t.transfers.lossPct}: ${nf(result.lossPct, 2)}%`,
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
        title={t.transfers.title}
        subtitle={t.transfers.subtitle}
        icon={<ArrowLeftRight className="size-5" />}
      />

      <Segmented
        groupId="transfer-provider"
        value={provider}
        onChange={setProvider}
        options={providerOptions}
        scroll
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Inputs */}
        <GlassCard className="h-fit space-y-6 p-5 sm:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t.common.inputs}
          </h2>

          <Field label={t.transfers.amount} htmlFor="amount">
            <NumberField
              id="amount"
              value={amount}
              onChange={(v) => setAmount(Math.min(MAX_AMOUNT, Math.max(0, v)))}
              min={0}
              max={MAX_AMOUNT}
              step={50}
              prefix="$"
            />
            <RangeField
              label={t.transfers.amount}
              value={Math.min(amount, MAX_AMOUNT)}
              onChange={setAmount}
              min={0}
              max={MAX_AMOUNT}
              step={50}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>$0</span>
              <span>${nf(MAX_AMOUNT)}</span>
            </div>
          </Field>

          <Field label={t.transfers.type} htmlFor="tx-type">
            <SelectField
              id="tx-type"
              value={type}
              onChange={setType}
              options={PROVIDER_TYPES[provider].map((v) => ({ value: v, label: typeLabel[v] }))}
            />
          </Field>

          <Field label={t.transfers.feeFx}>
            <button
              type="button"
              role="switch"
              aria-checked={converts}
              onClick={() => setConverts((v) => !v)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface-2/70 px-4 py-3 text-sm font-medium transition-colors hover:border-border-strong"
            >
              <span className="flex items-center gap-2">
                <Repeat className="size-4 text-primary" />
                USD → {t.common.currency}
              </span>
              <span
                className={cn(
                  'relative h-6 w-11 rounded-full transition-colors',
                  converts ? 'bg-gradient-to-r from-primary to-violet' : 'bg-surface-2',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 size-5 rounded-full bg-white transition-all',
                    converts ? 'start-[1.375rem]' : 'start-0.5',
                  )}
                />
              </span>
            </button>
          </Field>
        </GlassCard>

        {/* Results */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultCard
              label={t.transfers.totalFees}
              value={`−${fx(result.totalFees, { decimals: 2 })}`}
              icon={<TriangleAlert className="size-4" />}
              tone="danger"
            />
            <ResultCard
              label={t.transfers.lossPct}
              value={`${nf(result.lossPct, 2)}%`}
              icon={<Percent className="size-4" />}
              tone="violet"
            />
          </div>

          <ResultCard
            label={t.transfers.netArriving}
            sublabel={`${t.transfers.amount}: ${fx(result.amount, { decimals: 2 })}`}
            value={fx(result.net, { decimals: 2 })}
            icon={<Wallet className="size-4" />}
            tone="mint"
            large
          />

          <GlassCard className="space-y-4 p-5">
            <h3 className="text-sm font-semibold">{t.transfers.breakdown}</h3>
            <ul className="space-y-2.5">
              {result.lines.map((l) => (
                <li
                  key={l.key}
                  className="flex items-center justify-between gap-3 text-sm text-muted-foreground"
                >
                  <span className="flex items-center gap-2">
                    {lineLabel[l.key]}
                    <span className="num rounded-md border border-border bg-surface-2/60 px-1.5 py-0.5 text-[11px] font-semibold text-foreground">
                      {l.label}
                    </span>
                  </span>
                  <span className="num font-semibold text-destructive">
                    −{fx(l.amount, { decimals: 2 })}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4">
              <SplitBar
                segments={[
                  { label: t.transfers.netArriving, value: result.net, color: 'var(--mint)' },
                  {
                    label: t.transfers.totalFees,
                    value: result.totalFees,
                    color: 'var(--destructive)',
                  },
                ]}
              />
            </div>
          </GlassCard>

          <InFeedAd slotId="transfers-in-feed" />

          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">{t.transfers.compare}</h3>
            <ul className="mt-4 space-y-2">
              {comparison.map((c) => {
                const best = c.provider === bestProvider
                const option = providerOptions.find((p) => p.value === c.provider)
                return (
                  <li
                    key={c.provider}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-colors',
                      best
                        ? 'border-mint/35 bg-mint/[0.07]'
                        : 'border-border bg-surface-2/40',
                    )}
                  >
                    <span className="flex items-center gap-2.5 text-sm font-medium">
                      <span className={best ? 'text-mint' : 'text-muted-foreground'}>
                        {option?.icon}
                      </span>
                      {option?.label}
                      {best && (
                        <span className="rounded-md bg-mint/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mint">
                          {t.transfers.best}
                        </span>
                      )}
                    </span>
                    <span className="text-end">
                      <span
                        className={cn(
                          'num block text-sm font-semibold',
                          best ? 'text-mint' : 'text-foreground',
                        )}
                      >
                        {fx(c.net, { decimals: 2 })}
                      </span>
                      <span className="num block text-[11px] text-muted-foreground">
                        −{nf(c.lossPct, 2)}%
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </GlassCard>

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
