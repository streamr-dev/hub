import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import { address0 } from '~/consts'
import { getAllowance } from '~/getters'
import { SelectField2 } from '~/marketplace/components/SelectField2'
import NetworkIcon from '~/shared/components/NetworkIcon'
import TokenLogo from '~/shared/components/TokenLogo'
import Text from '~/shared/components/Ui/Text'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { COLORS, LIGHT, MEDIUM } from '~/shared/utils/styled'
import { TimeUnit, timeUnits } from '~/shared/utils/timeUnit'
import { toFloat } from '~/utils/bn'
import { getChainDisplayName } from '~/utils/chains'
import { RejectionReason } from '~/utils/exceptions'
import { convertPrice } from '~/utils/price'
import ProjectModal, { Actions } from './ProjectModal'

const options = [timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map(
    (unit: TimeUnit) => ({
        label: `${unit.charAt(0).toUpperCase()}${unit.slice(1)}s`, // Uppercase first letter and pluralize
        value: unit,
    }),
)

const PeriodContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #ffffff;
    border-radius: 8px;
    gap: 16px;
    padding: 32px 24px;
    position: relative;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`

const DetailsContainer = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    margin-top: 12px;
`

const Chain = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    background: ${COLORS.secondary};
    border-radius: 8px;
    padding: 18px 16px;
    gap: 8px;
    align-items: center;
`

const ChainIcon = styled(NetworkIcon)`
    width: 32px;
    height: 32px;
`

const ChainName = styled.div`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
`

const Amount = styled.span`
    font-size: 44px;
    font-weight: ${LIGHT};
`

const AmountBoxInner = styled.div`
    padding: 0 16px;
    width: max-content;
`

const AmountBox = styled.div`
    background: #f5f5f5;
    border-radius: 8px;
    position: relative;
    margin-top: 12px;
    line-height: normal;
`

const AmountScrollable = styled.div`
    max-width: 100%;
    overflow: auto;
    padding: 44px 0;
`

const AmountBarInner = styled.div`
    padding: 0 16px;

    > div {
        height: 19px;
        display: flex;
        align-items: center;
    }

    > div > div {
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    > div > * + div {
        margin-left: 12px;
    }

    > div > span {
        flex-grow: 1;
    }
`

const AmountBar = styled.div`
    letter-spacing: 0.05em;
    font-size: 12px;
    white-space: nowrap;
    width: 100%;
    color: #525252;
    text-transform: uppercase;
    position: absolute;
    padding: 18px 0;
    pointer-events: none;

    * + & {
        color: #a3a3a3;
        top: 90px;
    }

    em {
        background: white;
        padding: 2px 4px;
        border-radius: 2px;
        font-style: normal;
        margin-right: 0.25em;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const Currency = styled.span`
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 24px;
    margin-left: 8px;
`

export interface AccessPeriod {
    quantity: number
    unit: TimeUnit
    exceedsAllowance: boolean
}

interface Props {
    account?: string
    backable?: boolean
    balance?: bigint
    chainId?: number
    onReject?: (reason?: unknown) => void
    onResolve?: (result: AccessPeriod) => void
    pricePerSecond?: bigint
    quantity?: number
    tokenAddress?: string
    tokenDecimals?: bigint
    tokenSymbol?: string
    unit?: TimeUnit
    usdRate?: number
}

export default function AccessPeriodModal({
    account = address0,
    backable = false,
    balance = 0n,
    chainId = 137,
    onReject,
    onResolve,
    pricePerSecond = 0n,
    quantity = 1,
    tokenAddress = address0,
    tokenDecimals = 18n,
    tokenSymbol = 'DATA',
    unit = timeUnits.hour,
    usdRate = 1,
}: Props) {
    const [rawLength, setRawLength] = useState(`${quantity}`)

    useEffect(
        function updateRawLength() {
            setRawLength(`${quantity}`)
        },
        [quantity],
    )

    const length = Math.max(0, Number(rawLength) || 0)

    const [selectedUnit, setSelectedUnit] = useState(unit)

    useEffect(() => {
        setSelectedUnit(unit)
    }, [unit])

    const total = ((a: bigint) => (a > 0n ? a : 0n))(
        convertPrice(pricePerSecond, [length, selectedUnit]),
    )

    const disabled = total === 0n

    const totalInUSD = toFloat(total, tokenDecimals).multipliedBy(usdRate)

    const [isSubmitting, setIsSubmitting] = useState(false)

    /**
     * It's safe to use `useIsMounted` here because even if we rerender the component
     * for a different purchase it'll be disabled if there's one already being processed.
     */
    const isMounted = useIsMounted()

    return (
        <ProjectModal
            backable={backable}
            closeOnEscape
            onReject={onReject}
            title="Choose access period"
        >
            <form
                onSubmit={async (e) => {
                    e.preventDefault()

                    if (disabled || isSubmitting) {
                        return
                    }

                    try {
                        setIsSubmitting(true)

                        if (!length) {
                            throw new Error('Invalid quantity')
                        }

                        const allowance = await getAllowance(
                            chainId,
                            tokenAddress,
                            account,
                            {
                                recover: true,
                            },
                        )

                        onResolve?.({
                            quantity: length,
                            unit: selectedUnit,
                            exceedsAllowance: allowance < total,
                        })
                    } catch (e) {
                        onReject?.(e)
                    } finally {
                        if (isMounted()) {
                            setIsSubmitting(false)
                        }
                    }
                }}
            >
                <PeriodContainer>
                    <Text
                        value={rawLength}
                        onChange={(e: any) => {
                            setRawLength(e.target.value)
                        }}
                        onCommit={setRawLength}
                        autoFocus
                        name="quantity"
                        disabled={isSubmitting}
                    />
                    <SelectField2
                        placeholder="Select a time unit"
                        options={options}
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        isClearable={false}
                        fullWidth
                        disabled={isSubmitting}
                    />
                </PeriodContainer>
                <DetailsContainer>
                    <Chain>
                        <ChainIcon chainId={chainId} />
                        <ChainName>{getChainDisplayName(chainId)}</ChainName>
                    </Chain>
                    <AmountBox>
                        <AmountBar>
                            <AmountBarInner>
                                <div>
                                    <em>{toFloat(balance, tokenDecimals).toFixed(3)}</em>{' '}
                                    <span>Balance</span>
                                    <div>
                                        <TokenLogo
                                            chainId={chainId}
                                            contractAddress={tokenAddress}
                                            symbol={tokenSymbol}
                                        />
                                    </div>
                                </div>
                            </AmountBarInner>
                        </AmountBar>
                        <AmountScrollable>
                            <AmountBoxInner>
                                <Amount>
                                    {toFloat(total, tokenDecimals).toFixed(3)}
                                </Amount>
                                <Currency>{tokenSymbol}</Currency>
                            </AmountBoxInner>
                        </AmountScrollable>
                        <AmountBar>
                            <AmountBarInner>
                                <div>
                                    <div>Approx {totalInUSD.toFixed(2)} USD</div>
                                </div>
                            </AmountBarInner>
                        </AmountBar>
                    </AmountBox>
                </DetailsContainer>
                <Actions>
                    {!backable && (
                        <Button
                            kind="link"
                            type="button"
                            onClick={() => {
                                onReject?.(RejectionReason.CancelButton)
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={disabled || isSubmitting}
                        waiting={isSubmitting}
                    >
                        Pay now
                    </Button>
                </Actions>
            </form>
        </ProjectModal>
    )
}
