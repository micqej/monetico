import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type ServiceIconName = 'mail' | 'seo' | 'copy' | 'social' | 'email' | 'web'

function BaseIcon({ size = 24, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </BaseIcon>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </BaseIcon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 12 4.2 4.2L19 7.5" />
    </BaseIcon>
  )
}

export function SparkIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
      <path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </BaseIcon>
  )
}

export function ServiceIcon({ name, size = 24, ...props }: IconProps & { name: ServiceIconName }) {
  const icons: Record<ServiceIconName, ReactNode> = {
    mail: (
      <>
        <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
        <path d="m5 8 7 5 7-5" />
      </>
    ),
    seo: (
      <>
        <path d="M5 18h14" />
        <path d="M7.5 15.5V12" />
        <path d="M12 15.5V8.5" />
        <path d="M16.5 15.5V5.5" />
        <path d="m6 8 3-3 3 2 5-4" />
      </>
    ),
    copy: (
      <>
        <path d="M8 6.5h8" />
        <path d="M8 10h6" />
        <path d="M8 13.5h5" />
        <path d="M6.5 4.5h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
        <path d="m15.5 14.5 3-3 1.5 1.5-3 3-2 .5.5-2Z" />
      </>
    ),
    social: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M11 5h2" />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    email: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2.5" />
        <path d="m6 8 6 4 6-4" />
        <path d="M8 14h8" />
      </>
    ),
    web: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17" />
        <path d="M12 3.5a13 13 0 0 1 0 17" />
        <path d="M12 3.5a13 13 0 0 0 0 17" />
      </>
    ),
  }

  return <BaseIcon size={size} {...props}>{icons[name]}</BaseIcon>
}
