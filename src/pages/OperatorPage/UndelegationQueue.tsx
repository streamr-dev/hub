import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import { SponsorshipDecimals } from '~/components/Decimals'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { calculateUndelegationQueueSize, getDelegatedAmountForWallet } from '~/getters'
import { useConfigValueFromChain } from '~/hooks'
import {
    useForceUndelegate,
    useOperatorByIdQuery,
    useProcessUndelegationQueue,
} from '~/hooks/operators'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import { useCurrentChainId } from '~/utils/chains'

function getUndelegationExpirationDate(
    queuedAt: Date,
    maxUndelegationQueueSeconds: number | undefined = 0,
) {
    return moment(queuedAt.getTime() + maxUndelegationQueueSeconds * 1000)
}

interface Props {
    operatorId: string | undefined
}

export function UndelegationQueue({ operatorId }: Props) {
    const currentChainId = useCurrentChainId()

    const operatorQuery = useOperatorByIdQuery(operatorId)

    const operator = operatorQuery.data || null

    const walletAddress = useWalletAccount()

    const maxUndelegationQueueSeconds = useConfigValueFromChain('maxQueueSeconds', Number)

    const forceUndelegate = useForceUndelegate()

    const processUndelegationQueue = useProcessUndelegationQueue()

    const freeFunds = operator?.dataTokenBalanceWei

    const undelegationQueueSize =
        operator != null ? calculateUndelegationQueueSize(operator) : undefined

    const isProcessButtonDisabled =
        freeFunds != null &&
        undelegationQueueSize != null &&
        freeFunds < undelegationQueueSize

    const ProcessQueueButton = () => (
        <Button
            kind="secondary"
            disabled={isProcessButtonDisabled}
            onClick={() => {
                if (operatorId == null) {
                    return
                }

                processUndelegationQueue(currentChainId, operatorId)
            }}
        >
            Process queue
        </Button>
    )

    if (operator == null) {
        return null
    }

    return (
        <ScrollTable
            elements={operator.queueEntries}
            columns={[
                {
                    displayName: 'Delegator address',
                    valueMapper: (element) => (
                        <>
                            {truncate(element.delegator)}
                            {element.delegator === walletAddress?.toLowerCase() && (
                                <Badge>You</Badge>
                            )}
                        </>
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'id',
                },
                {
                    displayName: 'Amount',
                    valueMapper: (element) => (
                        <SponsorshipDecimals
                            abbr
                            amount={((a: bigint, b: bigint) => (a < b ? a : b))(
                                getDelegatedAmountForWallet(element.delegator, operator),
                                element.amount,
                            )}
                        />
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'amount',
                },
                {
                    displayName: 'Expiration date',
                    valueMapper: (element) => {
                        const expirationDate = getUndelegationExpirationDate(
                            element.queuedAt,
                            maxUndelegationQueueSeconds,
                        )
                        return (
                            <WarningCell>
                                {expirationDate.format('YYYY-MM-DD')}
                                {expirationDate.isBefore(Date.now()) && (
                                    <Tooltip
                                        content={
                                            <p>
                                                Payout time exceeded. You can force
                                                unstake now.
                                            </p>
                                        }
                                    >
                                        <TooltipIconWrap $color="#ff5c00">
                                            <JiraFailedBuildStatusIcon label="Error" />
                                        </TooltipIconWrap>
                                    </Tooltip>
                                )}
                            </WarningCell>
                        )
                    },
                    align: 'start',
                    isSticky: false,
                    key: 'date',
                },
                {
                    displayName: 'Request date',
                    valueMapper: (element) => (
                        <>{moment(element.queuedAt).format('YYYY-MM-DD')}</>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'requestDate',
                },
                {
                    displayName: 'Request time',
                    valueMapper: (element) => (
                        <>{moment(element.queuedAt).format('HH:mm')}</>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'requestTime',
                },
                {
                    displayName: '',
                    valueMapper: (element) => (
                        <>
                            {getUndelegationExpirationDate(
                                element.queuedAt,
                                maxUndelegationQueueSeconds,
                            ).isBefore(Date.now()) && (
                                <Button
                                    type="button"
                                    kind="secondary"
                                    onClick={() => {
                                        forceUndelegate(
                                            currentChainId,
                                            operator,
                                            element.amount,
                                        )
                                    }}
                                >
                                    Force unstake
                                </Button>
                            )}
                        </>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'actions',
                },
            ]}
            footerComponent={
                operator.queueEntries.length > 0 ? (
                    <Footer>
                        {isProcessButtonDisabled ? (
                            <Tooltip content="The Operator needs to unstake to free up funds to pay out the queue">
                                <ProcessQueueButton />
                            </Tooltip>
                        ) : (
                            <ProcessQueueButton />
                        )}
                    </Footer>
                ) : null
            }
        />
    )
}

const Badge = styled.div`
    border-radius: 8px;
    background: ${COLORS.secondary};
    color: ${COLORS.primaryLight};
    font-size: 14px;
    font-weight: ${MEDIUM};
    line-height: 30px;
    letter-spacing: 0.14px;
    padding: 0px 10px;
    margin-left: 12px;
`

const WarningCell = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;

    ${TooltipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`

const Footer = styled.div`
    display: flex;
    justify-content: right;
    padding: 32px;
    gap: 10px;
`
