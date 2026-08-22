export const theme = {
  colors: {
    primary: 'var(--color-primary)',
    surface: 'var(--color-surface)',
    surfaceMuted: 'var(--color-surface-muted)',
    accent: 'var(--color-accent)',
    warningModerate: 'var(--color-warning-moderate)',
    warningHigh: 'var(--color-warning-high)',
    critical: 'var(--color-critical)',
  },
  riskColors: {
    low: 'text-accent bg-accent/10 border-accent/30',
    moderate: 'text-warning-moderate bg-amber-50 border-amber-200',
    high: 'text-warning-high bg-orange-50 border-orange-200',
    critical: 'text-critical bg-red-50 border-red-200',
  },
} as const
