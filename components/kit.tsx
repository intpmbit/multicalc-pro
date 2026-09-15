'use client'

import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useApp } from './app-provider'

/* ---------------------------------- Card --------------------------------- */

export function GlassCard({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'mint' | 'violet' | 'danger'
}) {
  return (
    <div
      className={cn(
        'glass relative overflow-hidden rounded-2xl',
        tone === 'mint' && 'border-mint/25',
        tone === 'violet' && 'border-primary/35',
        tone === 'danger' && 'border-destructive/30',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      {icon ? (
        <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-pretty text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

/* --------------------------------- Fields -------------------------------- */

export function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  children: ReactNode
  htmlFor?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
        {hint ? <span className="text-xs font-medium text-mint">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

export function SelectField<T extends string>({
  id,
  value,
  onChange,
  options,
}: {
  id?: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-xl border border-border bg-surface-2/70 px-4 py-3 pe-10 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface text-foreground">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

export function NumberField({
  id,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  id?: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div className="flex items-center rounded-xl border border-border bg-surface-2/70 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40 hover:border-border-strong">
      {prefix ? (
        <span className="ps-4 text-sm font-semibold text-muted-foreground">{prefix}</span>
      ) : null}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const next = e.target.valueAsNumber
          onChange(Number.isNaN(next) ? 0 : next)
        }}
        className="num w-full bg-transparent px-4 py-3 text-lg font-semibold outline-none"
      />
      {suffix ? (
        <span className="pe-4 text-sm font-semibold text-muted-foreground">{suffix}</span>
      ) : null}
    </div>
  )
}

export function RangeField({
  value,
  onChange,
  min,
  max,
  step,
  label,
}: {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  label: string
}) {
  const { dir } = useApp()
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  return (
    <input
      type="range"
      className="fx-range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      dir={dir}
      onChange={(e) => onChange(e.target.valueAsNumber)}
      style={
        {
          '--fx-pct': `${pct}%`,
          '--fx-dir': dir === 'rtl' ? 'left' : 'right',
        } as React.CSSProperties
      }
    />
  )
}

/* -------------------------------- Segmented ------------------------------- */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  groupId,
  scroll = false,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string; icon?: ReactNode }[]
  groupId: string
  scroll?: boolean
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-1 rounded-xl border border-border bg-surface-2/50 p-1',
        scroll ? 'no-scrollbar overflow-x-auto' : 'flex-wrap',
      )}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-white' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${groupId}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-violet shadow-[0_8px_24px_-10px_var(--primary)]"
              />
            )}
            <span className="relative flex items-center gap-2">
              {o.icon}
              {o.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------- Result card ------------------------------ */

export function ResultCard({
  label,
  sublabel,
  value,
  tone = 'default',
  icon,
  large = false,
}: {
  label: string
  sublabel?: string
  value: string
  tone?: 'default' | 'mint' | 'danger' | 'violet'
  icon?: ReactNode
  large?: boolean
}) {
  const toneClasses = {
    default: 'text-foreground',
    mint: 'text-mint',
    danger: 'text-destructive',
    violet: 'text-violet',
  }[tone]

  return (
    <GlassCard
      tone={tone === 'default' ? 'default' : tone}
      className={cn('p-5', tone === 'mint' && large && 'glow-mint')}
    >
      {tone === 'mint' ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -end-8 -top-10 size-28 rounded-full bg-mint/20 blur-3xl"
        />
      ) : null}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              'num mt-2 font-semibold tabular-nums',
              large ? 'text-3xl sm:text-4xl' : 'text-2xl',
              toneClasses,
            )}
          >
            {value}
          </p>
          {sublabel ? <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p> : null}
        </div>
        {icon ? (
          <span
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-2/60',
              toneClasses,
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
    </GlassCard>
  )
}

/* --------------------------------- Buttons -------------------------------- */

export function PrimaryButton({
  children,
  onClick,
  className,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-violet px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_-16px_var(--primary)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2/60 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ---------------------------------- Bars ---------------------------------- */

export function SplitBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[]
}) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1
  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full border border-border bg-surface-2">
        {segments.map((s) => (
          <motion.div
            key={s.label}
            className="h-full"
            style={{ background: s.color }}
            animate={{ width: `${(Math.max(0, s.value) / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ background: s.color }}
            />
            <span>{s.label}</span>
            <span className="num font-semibold text-foreground">
              {((Math.max(0, s.value) / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
