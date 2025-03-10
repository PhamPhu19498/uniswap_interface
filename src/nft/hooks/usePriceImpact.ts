import { Percent } from '@phuphamdeltalabs/sdkcore'
import { useMemo } from 'react'
import { ClassicTrade } from 'state/routing/types'
import { useTheme } from 'styled-components'
import { computeRealizedPriceImpact, getPriceImpactWarning } from 'utils/prices'

export interface PriceImpact {
  priceImpactSeverity: PriceImpactSeverity
  displayPercentage(): string
}

interface PriceImpactSeverity {
  type: 'warning' | 'error'
  color: string
}

export function usePriceImpact(trade?: ClassicTrade): PriceImpact | undefined {
  const theme = useTheme()

  return useMemo(() => {
    const marketPriceImpact = trade ? computeRealizedPriceImpact(trade) : undefined
    const priceImpactWarning = marketPriceImpact ? getPriceImpactWarning(marketPriceImpact) : undefined
    const warningColor =
      priceImpactWarning === 'error'
        ? theme.critical
        : priceImpactWarning === 'warning'
        ? theme.deprecated_accentWarning
        : undefined

    return marketPriceImpact && priceImpactWarning && warningColor
      ? {
          priceImpactSeverity: {
            type: priceImpactWarning,
            color: warningColor,
          },
          displayPercentage: () => toHumanReadablePercent(marketPriceImpact),
        }
      : undefined
  }, [theme.critical, theme.deprecated_accentWarning, trade])
}

function toHumanReadablePercent(priceImpact: Percent): string {
  const sign = priceImpact.lessThan(0) ? '+' : ''
  const exactFloat = (Number(priceImpact.numerator) / Number(priceImpact.denominator)) * 100
  if (exactFloat < 0.005) {
    return '0.00%'
  }
  const number = parseFloat(priceImpact.multiply(-1)?.toFixed(2))
  return `${sign}${number}%`
}
