import { Trans } from '@lingui/macro'
import { Currency, Percent, TradeType } from '@phuphamdeltalabs/sdkcore'
import Column, { AutoColumn } from 'components/Column'
import { useLocalCurrencyPrice } from 'hooks/useLocalCurrencyPrice'
import { InterfaceTrade } from 'state/routing/types'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'
import { Divider, ThemedText } from 'theme'

import { SwapModalHeaderAmount } from './SwapModalHeaderAmount'

const Rule = styled(Divider)`
  margin: 16px 2px 24px 2px;
`

const HeaderContainer = styled(AutoColumn)`
  margin-top: 16px;
`

export default function SwapModalHeader({
  trade,
  inputCurrency,
  allowedSlippage,
}: {
  trade: InterfaceTrade
  inputCurrency?: Currency
  allowedSlippage: Percent
}) {
  const fiatValueInput = useLocalCurrencyPrice(trade.inputAmount)
  const fiatValueOutput = useLocalCurrencyPrice(trade.postTaxOutputAmount)

  return (
    <HeaderContainer gap="sm">
      <Column gap="lg">
        <SwapModalHeaderAmount
          field={Field.INPUT}
          label={<Trans>You pay</Trans>}
          amount={trade.inputAmount}
          currency={inputCurrency ?? trade.inputAmount.currency}
          usdAmount={fiatValueInput.data}
        />
        <SwapModalHeaderAmount
          field={Field.OUTPUT}
          label={<Trans>You receive</Trans>}
          amount={trade.postTaxOutputAmount}
          currency={trade.outputAmount.currency}
          usdAmount={fiatValueOutput.data}
          tooltipText={
            trade.tradeType === TradeType.EXACT_INPUT ? (
              <ThemedText.BodySmall>
                <Trans>
                  Output is estimated. You will receive at least{' '}
                  <b>
                    {trade.minimumAmountOut(allowedSlippage).toSignificant(6)} {trade.outputAmount.currency.symbol}
                  </b>{' '}
                  or the transaction will revert.
                </Trans>
              </ThemedText.BodySmall>
            ) : (
              <ThemedText.BodySmall>
                <Trans>
                  Input is estimated. You will sell at most{' '}
                  <b>
                    {trade.maximumAmountIn(allowedSlippage).toSignificant(6)} {trade.inputAmount.currency.symbol}
                  </b>{' '}
                  or the transaction will revert.
                </Trans>
              </ThemedText.BodySmall>
            )
          }
        />
      </Column>
      <Rule />
    </HeaderContainer>
  )
}
