import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Button } from '~/components/Button'
import { ParsedPaymentDetail } from '~/parsers/ProjectParser'
import NetworkIcon from '~/shared/components/NetworkIcon'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { getUsdRate } from '~/shared/utils/coingecko'
import { MEDIUM } from '~/shared/utils/styled'
import { getBalance } from '~/utils/balance'
import { getChainDisplayName } from '~/utils/chains'
import { RejectionReason } from '~/utils/exceptions'
import networkPreflight from '~/utils/networkPreflight'
import { getTokenInfo } from '~/utils/tokens'
import { connectModal } from './ConnectModal'
import ProjectModal, { Actions } from './ProjectModal'

const ChainIcon = styled(NetworkIcon)`
    width: 40px;
    height: 40px;
`

const ChainName = styled.span`
    font-size: 18px;
    line-height: normal;
    font-weight: ${MEDIUM};
`

const Form = styled.form`
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
`

const Item = styled.label<{ $selected?: boolean }>`
    align-items: center;
    background: #ffffff;
    border: 2px solid #ffffff;
    border-radius: 8px;
    display: grid;
    gap: 12px;
    grid-template-columns: auto 1fr auto;
    padding: 20px;
    width: 100%;
    cursor: pointer;
    transition: 200ms border-color;
    user-select: none;

    ${({ $selected = false }) =>
        $selected &&
        css`
            border-color: #b3d4ff;
        `}
`

const Radio = styled.div<{ $selected?: boolean }>`
    width: 20px;
    height: 20px;
    border: 2px solid #cdcdcd;
    border-radius: 100%;
    transition: 200ms ease-in-out border-color;

    ::before {
        background: #0324ff;
        border-radius: 100%;
        content: '';
        display: block;
        height: 12px;
        opacity: 0;
        margin: 2px 0 0 2px;
        transform: translateZ(0) scale(0.5);
        transition: 200ms ease-in-out;
        transition-property: transform, opacity;
        width: 12px;
    }

    ${({ $selected = false }) =>
        $selected &&
        css`
            border-color: #0324ff;

            ::before {
                opacity: 1;
                transform: translateZ(0) scale(1);
            }
        `}
`

const Placeholder = styled.div`
    align-items: center;
    border-radius: 8px;
    display: flex;
    height: 88px;
    justify-content: center;
    width: 100%;
`

export interface ChainSelectorResult {
    account: string
    balance: bigint
    chainId: number
    pricePerSecond: bigint
    tokenAddress: string
    tokenDecimals: bigint
    tokenSymbol: string
    usdRate: number
}

export async function getPurchasePreconditions({
    chainId,
    paymentDetails,
}: {
    chainId: number
    paymentDetails: ParsedPaymentDetail[]
}): Promise<ChainSelectorResult> {
    await networkPreflight(chainId)

    const paymentDetail = paymentDetails.find(({ domainId }) => domainId === chainId)

    if (!paymentDetail) {
        throw new Error('No matching payment detail')
    }

    const { pricingTokenAddress: tokenAddress, pricePerSecond } = paymentDetail

    const tokenInfo = await getTokenInfo(tokenAddress, chainId)

    const account = await connectModal.pop()

    if (!account) {
        throw new Error('No account')
    }

    const balance = await getBalance({
        chainId,
        tokenAddress,
        walletAddress: account,
    })

    const usdRate = await getUsdRate(tokenAddress, chainId)

    return {
        account,
        balance,
        chainId,
        pricePerSecond,
        tokenAddress,
        tokenDecimals: tokenInfo.decimals,
        tokenSymbol: tokenInfo.symbol,
        usdRate,
    }
}

interface Props {
    projectId?: string
    onResolve?: (result: ChainSelectorResult) => void
    onReject?: (reason?: unknown) => void
    chainIds?: number[]
    selectedChainId?: number
    paymentDetails?: ParsedPaymentDetail[]
}

export default function ChainSelectorModal({
    projectId,
    chainIds = [],
    selectedChainId: selectedChainIdProp,
    paymentDetails = [],
    onReject,
    onResolve,
}: Props) {
    const [selectedChainId, selectChainId] = useState<number | undefined>(
        selectedChainIdProp,
    )

    useEffect(() => {
        selectChainId(selectedChainIdProp)
    }, [selectedChainIdProp])

    const [isSubmitting, setIsSubmitting] = useState(false)

    const disabled = !Number.isSafeInteger(selectedChainId) || isSubmitting

    /**
     * It's safe to use `useIsMounted` here because even if we rerender the component
     * for a different purchase it'll be disabled if there's one already being processed.
     */
    const isMounted = useIsMounted()

    return (
        <ProjectModal
            closeOnEscape
            onReject={onReject}
            title="Select chain for payment token"
        >
            <Form
                onSubmit={async (e) => {
                    e.preventDefault()

                    if (disabled) {
                        return
                    }

                    try {
                        setIsSubmitting(true)

                        if (typeof selectedChainId !== 'number') {
                            throw new Error('No selected chain id')
                        }

                        if (!projectId) {
                            throw new Error('No project id')
                        }

                        const preconditions = await getPurchasePreconditions({
                            chainId: selectedChainId,
                            paymentDetails,
                        })

                        onResolve?.(preconditions)
                    } catch (e) {
                        onReject?.(e)
                    } finally {
                        if (isMounted()) {
                            setIsSubmitting(false)
                        }
                    }
                }}
            >
                {chainIds.length ? (
                    <ul>
                        {chainIds.map((chainId) => (
                            <li key={chainId}>
                                <Item
                                    $selected={selectedChainId === chainId}
                                    onClick={() =>
                                        void selectChainId((current) =>
                                            current === chainId ? undefined : chainId,
                                        )
                                    }
                                >
                                    <ChainIcon chainId={chainId} />
                                    <ChainName>{getChainDisplayName(chainId)}</ChainName>
                                    <Radio $selected={selectedChainId === chainId} />
                                </Item>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Placeholder>No available chains.</Placeholder>
                )}
                <Actions>
                    <Button
                        kind="link"
                        type="button"
                        onClick={() => void onReject?.(RejectionReason.CancelButton)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={disabled} waiting={isSubmitting}>
                        Next
                    </Button>
                </Actions>
            </Form>
        </ProjectModal>
    )
}
