import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import { SponsorshipDecimals } from '~/components/Decimals'
import Spinner from '~/components/Spinner'
import { FundedUntilCell, StreamIdCell } from '~/components/Table'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { useCollectEarnings } from '~/hooks/operators'
import { useEditSponsorshipFunding } from '~/hooks/sponsorships'
import { Operator } from '~/parsers/Operator'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import SvgIcon from '~/shared/components/SvgIcon'
import {
    useCanCollectEarningsCallback,
    useUncollectedEarnings,
} from '~/shared/stores/uncollectedEarnings'
import { useCurrentChainId, useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

export function SponsorshipTable({
    operator,
    isController,
}: {
    operator: Operator
    isController: boolean
}) {
    const canCollect = useCanCollectEarningsCallback()

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const collectEarnings = useCollectEarnings()

    const currentChainId = useCurrentChainId()

    const chainName = useCurrentChainKey()

    const allSponsorshipIds = operator.stakes.map(({ sponsorshipId }) => sponsorshipId)

    const canCollectAllEarnings = allSponsorshipIds.every((sponsorshipId) =>
        canCollect(operator.id, sponsorshipId),
    )

    return (
        <ScrollTable
            elements={operator.stakes}
            columns={[
                {
                    displayName: 'Stream ID',
                    valueMapper: ({ streamId }) => <StreamIdCell streamId={streamId} />,
                    align: 'start',
                    isSticky: true,
                    key: 'streamId',
                },
                {
                    displayName: 'Staked',
                    valueMapper: (element) => {
                        const minimumStakeReachTime = moment(
                            element.joinedAt.getTime() +
                                element.minimumStakingPeriodSeconds * 1000,
                        )

                        return (
                            <>
                                <SponsorshipDecimals abbr amount={element.amountWei} />
                                {minimumStakeReachTime.isAfter(Date.now()) && (
                                    <Tooltip
                                        content={
                                            <>
                                                Minimum stake period:{' '}
                                                {minimumStakeReachTime.fromNow(true)} left
                                            </>
                                        }
                                    >
                                        <TooltipIconWrap
                                            className="ml-1"
                                            $color="#ADADAD"
                                            $svgSize={{
                                                width: '18px',
                                                height: '18px',
                                            }}
                                        >
                                            <SvgIcon name="lockClosed" />
                                        </TooltipIconWrap>
                                    </Tooltip>
                                )}
                            </>
                        )
                    },
                    align: 'start',
                    isSticky: false,
                    key: 'staked',
                },
                {
                    displayName: 'APY',
                    valueMapper: (element) =>
                        `${element.spotAPY.multipliedBy(100).toFixed(0)}%`,
                    align: 'start',
                    isSticky: false,
                    key: 'apy',
                },
                {
                    displayName: 'Funded until',
                    valueMapper: (element) => (
                        <FundedUntilCell
                            projectedInsolvencyAt={element.projectedInsolvencyAt}
                            remainingBalance={element.remainingWei}
                        />
                    ),
                    align: 'start',
                    isSticky: false,
                    key: 'fundedUntil',
                },
                {
                    displayName: 'Uncollected earnings',
                    valueMapper: (element) => (
                        <UncollectedEarnings
                            operatorId={operator.id}
                            sponsorshipId={element.sponsorshipId}
                        />
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'earnings',
                },
            ]}
            linkMapper={({ sponsorshipId: id }) =>
                R.sponsorship(id, routeOptions(chainName))
            }
            actions={[
                (element) => ({
                    displayName: 'Edit',
                    disabled: !isController,
                    async callback() {
                        if (!operator) {
                            return
                        }

                        editSponsorshipFunding({
                            chainId: currentChainId,
                            sponsorshipOrSponsorshipId: element.sponsorshipId,
                            operator,
                        })
                    },
                }),
                (element) => ({
                    displayName: 'Collect earnings',
                    callback() {
                        if (!operator.id) {
                            return
                        }

                        collectEarnings({
                            chainId: currentChainId,
                            operatorId: operator.id,
                            sponsorshipIds: [element.sponsorshipId],
                        })
                    },
                    disabled: !canCollect(operator.id, element.sponsorshipId),
                }),
            ]}
            footerComponent={
                allSponsorshipIds.length > 0 &&
                canCollectAllEarnings && (
                    <Footer>
                        <Button
                            kind="secondary"
                            onClick={async () => {
                                collectEarnings({
                                    chainId: currentChainId,
                                    operatorId: operator.id,
                                    sponsorshipIds: allSponsorshipIds,
                                })
                            }}
                        >
                            Collect all
                        </Button>
                    </Footer>
                )
            }
        />
    )
}

const Footer = styled.div`
    display: flex;
    justify-content: right;
    padding: 32px;
    gap: 10px;
`

function UncollectedEarnings({
    operatorId,
    sponsorshipId,
}: {
    operatorId: string | undefined
    sponsorshipId: string
}) {
    const value = useUncollectedEarnings(operatorId, sponsorshipId)

    return typeof value !== 'undefined' ? (
        <SponsorshipDecimals abbr amount={value?.uncollectedEarnings || 0n} />
    ) : (
        <Spinner color="blue" />
    )
}
