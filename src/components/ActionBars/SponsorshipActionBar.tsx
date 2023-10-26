import React, { useMemo } from 'react'
import moment from 'moment'
import { truncateStreamName } from '~/shared/utils/text'
import { abbreviateNumber } from '~/shared/utils/abbreviateNumber'
import Button from '~/shared/components/Button'
import SvgIcon from '~/shared/components/SvgIcon'
import routes from '~/routes'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import { waitForGraphSync } from '~/getters/waitForGraphSync'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { Pad } from '~/components/ActionBars/OperatorActionBar'
import { useOperatorForWallet } from '~/hooks/operators'
import { useWalletAccount } from '~/shared/stores/wallet'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from '~/components/ActionBars/NetworkActionBar.styles'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import {
    useEditSponsorshipFunding,
    useFundSponsorship,
    useIsEditingSponsorshipFunding,
    useIsFundingSponsorship,
    useIsJoiningSponsorshipAsOperator,
    useJoinSponsorshipAsOperator,
} from '~/hooks/sponsorships'
import { isRejectionReason } from '~/modals/BaseModal'
import { COLORS } from '~/shared/utils/styled'
import { goBack } from '~/utils'
import {
    ActionBarButton,
    ActionBarButtonBody,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { AboutSponsorship } from '~/components/ActionBars/AboutSponsorship'

export function SponsorshipActionBar({
    sponsorship,
    onChange,
}: {
    sponsorship: ParsedSponsorship
    onChange: () => void
}) {
    const wallet = useWalletAccount()

    const operator = useOperatorForWallet(wallet)

    const canEditStake = isSponsorshipFundedByOperator(sponsorship, operator)

    const { projectedInsolvencyAt, active } = sponsorship

    const fundedUntil = useMemo(
        () => moment(projectedInsolvencyAt * 1000).format('D MMM YYYY'),
        [projectedInsolvencyAt],
    )

    const fundSponsorship = useFundSponsorship()

    const isFundingSponsorship = useIsFundingSponsorship(sponsorship.id, wallet)

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const isJoiningSponsorshipAsOperator = useIsJoiningSponsorshipAsOperator(
        sponsorship.id,
        operator?.id,
        sponsorship.streamId,
    )

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const isEditingSponsorshipFunding = useIsEditingSponsorshipFunding(
        sponsorship.id,
        operator?.id,
    )

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink
                                to={routes.network.sponsorships()}
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
                                {truncateStreamName(sponsorship.streamId, 30)}
                            </NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            <ActionBarButtonBody
                                $background={
                                    active ? COLORS.activeBackground : COLORS.radioBorder
                                }
                                $color={active ? COLORS.active : COLORS.primary}
                            >
                                <strong>{active ? 'Active' : 'Inactive'}</strong>
                            </ActionBarButtonBody>
                            <SimpleDropdown
                                menu={<AboutSponsorship sponsorship={sponsorship} />}
                            >
                                {(toggle, isOpen) => (
                                    <ActionBarButton
                                        active={isOpen}
                                        onClick={() => void toggle((c) => !c)}
                                    >
                                        <ActionBarButtonInnerBody>
                                            <SvgIcon name="page" />
                                            <strong>About Sponsorship</strong>
                                        </ActionBarButtonInnerBody>
                                        <ActionBarButtonCaret $invert={isOpen} />
                                    </ActionBarButton>
                                )}
                            </SimpleDropdown>
                            <ActionBarButtonBody>
                                <div>
                                    Funded until: <strong>{fundedUntil}</strong>
                                </div>
                            </ActionBarButtonBody>
                            <ActionBarWalletDisplay
                                address={sponsorship.id}
                                label="Contract"
                            />
                        </NetworkActionBarInfoButtons>
                    </div>
                    <NetworkActionBarCTAs>
                        <Button
                            waiting={isFundingSponsorship}
                            onClick={async () => {
                                if (!wallet) {
                                    return
                                }

                                try {
                                    await fundSponsorship({
                                        sponsorship,
                                        wallet,
                                    })

                                    await waitForGraphSync()

                                    onChange()
                                } catch (e) {
                                    if (isRejectionReason(e)) {
                                        return
                                    }

                                    console.warn('Could not fund a Sponsorship', e)
                                }
                            }}
                        >
                            Sponsor
                        </Button>
                        {canEditStake ? (
                            <Button
                                disabled={!operator}
                                waiting={isEditingSponsorshipFunding}
                                onClick={async () => {
                                    if (!operator) {
                                        return
                                    }

                                    try {
                                        await editSponsorshipFunding({
                                            sponsorship,
                                            operator,
                                        })

                                        await waitForGraphSync()

                                        onChange()
                                    } catch (e) {
                                        if (isRejectionReason(e)) {
                                            return
                                        }

                                        console.warn('Could not edit a Sponsorship', e)
                                    }
                                }}
                            >
                                Edit stake
                            </Button>
                        ) : (
                            <Button
                                disabled={!operator}
                                waiting={isJoiningSponsorshipAsOperator}
                                onClick={async () => {
                                    if (!operator) {
                                        return
                                    }

                                    try {
                                        await joinSponsorshipAsOperator({
                                            sponsorship,
                                            operator,
                                        })

                                        await waitForGraphSync()

                                        onChange()
                                    } catch (e) {
                                        if (isRejectionReason(e)) {
                                            return
                                        }

                                        console.warn(
                                            'Could not join a Sponsorship as an Operator',
                                            e,
                                        )
                                    }
                                }}
                            >
                                Join as operator
                            </Button>
                        )}
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>
                    Sponsorship summary
                </NetworkActionBarStatsTitle>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="Payout rate">
                            {abbreviateNumber(sponsorship.payoutPerDay.toNumber())}{' '}
                            <SponsorshipPaymentTokenName />
                            /day
                        </StatCell>
                        <StatCell label="Operators">{sponsorship.operatorCount}</StatCell>
                        <StatCell label="Total staked">
                            {abbreviateNumber(sponsorship.totalStake.toNumber())}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                    </StatGrid>
                </Pad>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="APY">
                            {(sponsorship.apy * 100).toFixed(0)}%
                        </StatCell>
                        <StatCell label="Cumulative sponsored">
                            {abbreviateNumber(
                                sponsorship.cumulativeSponsoring.toNumber(),
                            )}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                        <StatCell label="Minimum stake">
                            {abbreviateNumber(sponsorship.minimumStake.toNumber())}{' '}
                            <SponsorshipPaymentTokenName />
                        </StatCell>
                    </StatGrid>
                </Pad>
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}
