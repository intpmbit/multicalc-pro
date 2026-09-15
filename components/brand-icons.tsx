import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true,
} as const

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8Z"
        fill="currentColor"
      />
      <path d="M10.2 15V9l5.2 3-5.2 3Z" fill="var(--background, #0B0F17)" />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M14.2 3h2.6a5.2 5.2 0 0 0 4.2 4.3v2.6a7.8 7.8 0 0 1-4.2-1.4v6.3a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.7a3.2 3.2 0 1 0 2.4 3.1V3Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M10.6 17.6c.4-1.6.9-3.6 1.1-4.5-.2-.4-.3-.9-.3-1.5 0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2.1-1.4-3.6-3.9-3.6-2.8 0-4.6 2.1-4.6 4.4 0 .8.2 1.4.6 1.8.2.2.2.3.1.5l-.2.7c0 .2-.2.3-.4.2-1.2-.5-1.7-1.8-1.7-3.3 0-2.5 2.1-5.4 6.3-5.4 3.3 0 5.5 2.4 5.5 5 0 3.4-1.9 6-4.7 6-.9 0-1.8-.5-2.1-1.1l-.6 2.3c-.2.7-.6 1.5-1 2"
        fill="currentColor"
      />
    </svg>
  )
}

export function PayPalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M7.4 3.5h6c3 0 4.7 1.5 4.3 4.2-.4 2.7-2.5 4.3-5.4 4.3H10l-.9 5.2H5.7l1.7-13.7Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M9.9 7h5.4c2.8 0 4.4 1.5 4 4.2-.4 2.8-2.6 4.4-5.6 4.4h-2.1l-.8 4.9H7.3L9.9 7Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function WiseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4 4.2 9.6 12 4 19.8h8.1l1.4-2.6H8.9l3.2-4.6-2.4-3.4h4.4l1.5-2.6L13.8 4.2H4Z"
        fill="currentColor"
      />
      <path d="M15.2 8.6h5.3l-1.3 2.4h-5.3l1.3-2.4Z" fill="currentColor" opacity="0.6" />
      <path d="M13.3 13h5.3L17.3 15.4H12l1.3-2.4Z" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function PayoneerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M3.5 18.2c3.9-3.6 8.6-6.2 13.8-7.6l-2.6 7.6h2.6l3.2-9.3c-6.3 1-12 3.9-17 9.3Z"
        fill="currentColor"
      />
      <circle cx="18.6" cy="5.8" r="2.1" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

export function BinanceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <g fill="currentColor">
        <path d="m12 2.6 3 3-3 3-3-3 3-3Z" />
        <path d="m5.6 9 3 3-3 3-3-3 3-3Z" />
        <path d="m18.4 9 3 3-3 3-3-3 3-3Z" />
        <path d="m12 15.4 3 3-3 3-3-3 3-3Z" />
        <path d="m12 9 3 3-3 3-3-3 3-3Z" opacity="0.6" />
      </g>
    </svg>
  )
}

export function BankIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 3 21 7.5V9H3V7.5L12 3Zm-6 8h2.4v6H6v-6Zm4.8 0h2.4v6h-2.4v-6Zm4.8 0H18v6h-2.4v-6ZM3 19h18v2H3v-2Z"
        fill="currentColor"
      />
    </svg>
  )
}
