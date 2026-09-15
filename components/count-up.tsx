'use client'

import { useEffect, useRef, useState } from 'react'
import { useApp } from './app-provider'

/** Eases a number from 0 to `value` once the element is visible. */
export function CountUp({
  value,
  duration = 1600,
  suffix = '',
  decimals = 0,
}: {
  value: number
  duration?: number
  suffix?: string
  decimals?: number
}) {
  const { nf } = useApp()
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let frame = 0
    let start = 0

    const run = () => {
      const tick = (now: number) => {
        if (!start) start = now
        const progress = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(value * eased)
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="num tabular-nums">
      {nf(display, decimals)}
      {suffix}
    </span>
  )
}
