import { useI18n } from '@/app/i18n/use-i18n'

interface SpinnerProps {
  /** @default 'Loading...' */
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
  id?: string
}

export function Spinner(props: SpinnerProps): JSX.Element {
  const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, className, id } = props

  const { t } = useI18n<'common'>()

  const size = 32
  const center = size / 2
  const strokeWidth = 4
  const r = center - strokeWidth
  const c = 2 * r * Math.PI
  const offset = c - (1 / 4) * c

  return (
    <svg
      aria-label={ariaLabel ?? t(['common', 'loading'])}
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={0}
      aria-valuemax={100}
      className={className}
      fill="none"
      height={size}
      id={id}
      role="progressbar"
      strokeWidth={strokeWidth}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
    >
      <circle
        cx={center}
        cy={center}
        opacity={0.25}
        r={r}
        role="presentation"
        stroke="currentColor"
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        role="presentation"
        stroke="currentColor"
        strokeDasharray={c}
        strokeDashoffset={offset}
      >
        <animateTransform
          attributeName="transform"
          begin="0s"
          dur="1s"
          from={`0 ${center} ${center}`}
          repeatCount="indefinite"
          to={`360 ${center} ${center}`}
          type="rotate"
        />
      </circle>
    </svg>
  )
}
