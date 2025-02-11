import { useQuery } from '@tanstack/react-query'
import React from 'react'
import styled from 'styled-components'
import {
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarTitle,
} from '~/components/ActionBars/NetworkActionBar.styles'
import { OperatorAvatar } from '~/components/avatars'
import { Button } from '~/components/Button'
import { LayoutColumn } from '~/components/Layout'
import {
    useDelegateFunds,
    useIsDelegatingFundsToOperator,
    useIsUndelegatingFundsToOperator,
    useUndelegateFunds,
} from '~/hooks/operators'
import { Operator } from '~/parsers/Operator'
import { getOperatorDelegationAmount } from '~/services/operators'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS, DESKTOP, TABLET } from '~/shared/utils/styled'
import { goBack } from '~/utils'
import { useCurrentChainId, useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

interface OperatorActionBarProps {
    operator: Operator
}

export function OperatorActionBar({ operator }: OperatorActionBarProps) {
    const walletAddress = useWalletAccount()

    const isDelegatingFunds = useIsDelegatingFundsToOperator(operator.id, walletAddress)

    const delegateFunds = useDelegateFunds()

    const isUndelegatingFunds = useIsUndelegatingFundsToOperator(
        operator.id,
        walletAddress,
    )

    const undelegateFunds = useUndelegateFunds()

    const currentChainId = useCurrentChainId()

    const chainName = useCurrentChainKey()

    const canUndelegateQuery = useQuery({
        queryKey: [
            'operatorActionBar',
            currentChainId,
            operator.id,
            walletAddress?.toLowerCase(),
        ],
        async queryFn() {
            try {
                if (!operator.id || !walletAddress) {
                    return false
                }

                return (
                    (await getOperatorDelegationAmount(
                        currentChainId,
                        operator.id,
                        walletAddress,
                    )) > 0n
                )
            } catch (e) {
                console.warn(
                    'Failed to load delegation amount',
                    operator.id,
                    walletAddress,
                    e,
                )
            }

            return null
        },
    })

    const canUndelegate = !!canUndelegateQuery.data

    const { metadata } = operator

    const [delegateLabel, undelegateLabel] =
        walletAddress?.toLowerCase() === operator.owner
            ? ['Fund', 'Withdraw']
            : ['Delegate', 'Undelegate']

    return (
        <OperatorActionBarRoot>
            {/* @todo Wrap it with LayoutColumn at a host level. */}
            <LayoutColumn>
                <OuterWrap>
                    <Wrap0>
                        <NetworkActionBarBackLink
                            to={R.operators(routeOptions(chainName))}
                            onClick={(e) => {
                                goBack({
                                    onBeforeNavigate() {
                                        e.preventDefault()
                                    },
                                })
                            }}
                        >
                            <NetworkActionBarBackButtonIcon name="backArrow" />
                        </NetworkActionBarBackLink>
                        <NetworkActionBarTitle>
                            <OperatorAvatar
                                imageUrl={metadata.imageUrl}
                                operatorId={operator.id}
                            />
                            <span>{metadata.name || operator.id}</span>
                        </NetworkActionBarTitle>
                    </Wrap0>
                    <Wrap1>
                        <Button
                            onClick={() => {
                                delegateFunds({
                                    chainId: currentChainId,
                                    operator,
                                    wallet: walletAddress,
                                    onDone: () => {
                                        canUndelegateQuery.refetch()
                                    },
                                })
                            }}
                            // Operator contract v1 has a bug so we need to disable delegation
                            disabled={!walletAddress || operator.contractVersion === 1}
                            waiting={isDelegatingFunds}
                        >
                            {delegateLabel}
                        </Button>
                        <Button
                            onClick={() => {
                                undelegateFunds({
                                    chainId: currentChainId,
                                    operator,
                                    wallet: walletAddress,
                                })
                            }}
                            disabled={!canUndelegate}
                            waiting={isUndelegatingFunds}
                        >
                            {undelegateLabel}
                        </Button>
                    </Wrap1>
                </OuterWrap>
            </LayoutColumn>
        </OperatorActionBarRoot>
    )
}

const OperatorActionBarRoot = styled.div`
    background: ${COLORS.Background};
    padding-top: 32px;

    @media ${TABLET} {
        padding-top: 40px;
    }

    @media ${DESKTOP} {
        padding-top: 72px;
    }
`

const Wrap0 = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
`

const Wrap1 = styled.div`
    gap: 8px;
`

const OuterWrap = styled.div`
    ${Wrap1} {
        align-items: center;
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-top: 20px;
    }

    @media ${TABLET} {
        align-items: center;
        display: flex;

        ${Wrap1} {
            display: flex;
            margin-top: 0;
        }
    }
`
