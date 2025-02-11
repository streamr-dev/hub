import moment from 'moment'
import React, { useMemo } from 'react'
import { AboutSponsorship } from '~/components/ActionBars/AboutSponsorship'
import {
    ActionBarButton,
    ActionBarButtonBody,
    ActionBarButtonCaret,
    ActionBarButtonInnerBody,
    ActionBarWalletDisplay,
} from '~/components/ActionBars/ActionBarButton'
import { Button } from '~/components/Button'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import { Tooltip } from '~/components/Tooltip'
import { useOperatorForWalletQuery } from '~/hooks/operators'
import {
    useEditSponsorshipFunding,
    useFundSponsorshipCallback,
    useIsEditingSponsorshipFunding,
    useIsFundingSponsorship,
    useIsJoiningSponsorshipAsOperator,
    useJoinSponsorshipAsOperator,
} from '~/hooks/sponsorships'
import { Operator } from '~/parsers/Operator'
import { Sponsorship } from '~/parsers/Sponsorship'
import SvgIcon from '~/shared/components/SvgIcon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS } from '~/shared/utils/styled'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { useCurrentChainId, useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { isSponsorshipFundedByOperator } from '~/utils/sponsorships'
import { AbstractActionBar } from './AbstractActionBar'

interface SponsorshipActionBarProps {
    sponsorship: Sponsorship
}

export function SponsorshipActionBar({ sponsorship }: SponsorshipActionBarProps) {
    const wallet = useWalletAccount()

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    const canEditStake = isSponsorshipFundedByOperator(sponsorship, operator)

    const { projectedInsolvencyAt, isRunning } = sponsorship

    const isPaying =
        isRunning && sponsorship.timeCorrectedRemainingBalanceWeiAt(Date.now()) > 0n

    const [fundedUntil, detailedFundedUntil] = useMemo(
        () =>
            projectedInsolvencyAt == null
                ? [null, null]
                : [
                      moment(projectedInsolvencyAt).format('D MMM YYYY'),
                      moment(projectedInsolvencyAt).format('D MMM YYYY, HH:mm'),
                  ],
        [projectedInsolvencyAt],
    )

    const fundSponsorship = useFundSponsorshipCallback()

    const isFundingSponsorship = useIsFundingSponsorship(sponsorship.id, wallet)

    const editSponsorshipFunding = useEditSponsorshipFunding()

    const isEditingSponsorshipFunding = useIsEditingSponsorshipFunding(
        sponsorship.id,
        operator?.id,
    )

    const { streamId } = sponsorship

    const chainId = useCurrentChainId()

    const chainName = useCurrentChainKey()

    return (
        <AbstractActionBar
            fallbackBackButtonUrl={R.sponsorships(routeOptions(chainName))}
            title={
                streamId ? (
                    truncateStreamName(streamId, 30)
                ) : (
                    <>Sponsorship {truncate(sponsorship.id)}</>
                )
            }
            buttons={
                <>
                    <ActionBarButtonBody
                        $background={
                            isPaying ? COLORS.activeBackground : COLORS.radioBorder
                        }
                        $color={isPaying ? COLORS.active : COLORS.primary}
                    >
                        <strong>{isPaying ? 'Paying' : 'Inactive'}</strong>
                    </ActionBarButtonBody>
                    <SimpleDropdown menu={<AboutSponsorship sponsorship={sponsorship} />}>
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
                    {fundedUntil && (
                        <ActionBarButtonBody>
                            <div>
                                Funded until:{' '}
                                <strong>
                                    <Tooltip
                                        anchorDisplay="inline"
                                        content={detailedFundedUntil || ''}
                                    >
                                        {fundedUntil}
                                    </Tooltip>
                                </strong>
                            </div>
                        </ActionBarButtonBody>
                    )}
                    <ActionBarWalletDisplay address={sponsorship.id} label="Contract" />
                </>
            }
            ctas={
                <>
                    {canEditStake ? (
                        <Button
                            disabled={!operator}
                            waiting={isEditingSponsorshipFunding}
                            onClick={async () => {
                                if (!operator) {
                                    return
                                }

                                editSponsorshipFunding({
                                    chainId,
                                    sponsorshipOrSponsorshipId: sponsorship,
                                    operator,
                                })
                            }}
                        >
                            Edit stake
                        </Button>
                    ) : (
                        <JoinAsOperatorButton
                            sponsorship={sponsorship}
                            operator={operator}
                        />
                    )}
                    <Button
                        // We decided to disable sponsoring for now as users don't know what it does.
                        // https://streamr-team.slack.com/archives/C9QB9RJ48/p1701774490263629
                        disabled={!streamId || true}
                        kind="secondary"
                        waiting={isFundingSponsorship}
                        onClick={() => {
                            fundSponsorship(chainId, sponsorship)
                        }}
                    >
                        Sponsor
                    </Button>
                </>
            }
        />
    )
}

interface JoinAsOperatorButtonProps {
    sponsorship: Sponsorship
    operator: Operator | null
}

function JoinAsOperatorButton({ sponsorship, operator }: JoinAsOperatorButtonProps) {
    const walletLocked = !useWalletAccount()

    const { streamId, operatorCount, maxOperators } = sponsorship

    const isJoiningSponsorshipAsOperator = useIsJoiningSponsorshipAsOperator(
        sponsorship.id,
        operator?.id,
    )

    const chainId = useCurrentChainId()

    const joinSponsorshipAsOperator = useJoinSponsorshipAsOperator()

    const maxOperatorsReached = operatorCount >= maxOperators

    const tip = walletLocked ? (
        'Unlock your wallet first'
    ) : !operator ? (
        'You need an Operator to join a Sponsorship'
    ) : !streamId ? (
        'Sponsored stream does not exist'
    ) : maxOperatorsReached ? (
        <>This Sponsorship does not allow more&nbsp;Operators</>
    ) : undefined

    if (tip) {
        return (
            <Tooltip content={tip}>
                <Button disabled>Join as operator</Button>
            </Tooltip>
        )
    }

    return (
        <Button
            waiting={isJoiningSponsorshipAsOperator}
            onClick={() => {
                if (!operator) {
                    return
                }

                joinSponsorshipAsOperator({
                    chainId,
                    sponsorship,
                    operator,
                })
            }}
        >
            Join as operator
        </Button>
    )
}
