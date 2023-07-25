import React, { FunctionComponent, useMemo } from 'react'
import { toaster } from 'toasterhea'
import { SponsorshipElement } from '~/network/types/sponsorship'
import { StatsBox } from '~/shared/components/StatsBox/StatsBox'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { truncateNumber } from '~/shared/utils/truncateNumber'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import FundSponsorshipModal from '~/modals/FundSponsorshipModal'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import { WhiteBoxSeparator } from '~/shared/components/WhiteBox'
import { Layer } from '~/utils/Layer'
import { toBN } from '~/utils/bn'
import routes from '~/routes'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButton,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from './NetworkActionBar.styles'

const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)
const fundSponsorshipModal = toaster(FundSponsorshipModal, Layer.Modal)

export const SponsorshipActionBar: FunctionComponent<{
    sponsorship: SponsorshipElement
}> = ({ sponsorship }) => {
    const { copy } = useCopy()

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink to={routes.network.sponsorships()}>
                                <NetworkActionBarBackButtonIcon
                                    name={'backArrow'}
                                ></NetworkActionBarBackButtonIcon>
                            </NetworkActionBarBackLink>
                            <NetworkActionBarTitle>
                                {truncateStreamName(sponsorship.streamId, 30)}
                            </NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            <NetworkActionBarInfoButton
                                className={sponsorship.active ? 'active ' : 'inactive'}
                            >
                                Active
                            </NetworkActionBarInfoButton>
                            <NetworkActionBarInfoButton>
                                <SvgIcon name="page" />
                                About Sponsorships
                            </NetworkActionBarInfoButton>
                            <NetworkActionBarInfoButton>
                                <span>
                                    Funded until:{' '}
                                    <strong>{sponsorship.fundedUntil}</strong>
                                </span>
                            </NetworkActionBarInfoButton>

                            <NetworkActionBarInfoButton>
                                <span>
                                    Contract <strong>{truncate(sponsorship.id)}</strong>
                                </span>
                                <span>
                                    <SvgIcon
                                        name="copy"
                                        className="icon"
                                        data-tooltip-id="copy-sponsorship-address"
                                        onClick={() =>
                                            copy(sponsorship.id, {
                                                toastMessage: 'Copied!',
                                            })
                                        }
                                    />
                                    <BlackTooltip
                                        id="copy-sponsorship-address"
                                        openOnClick={false}
                                    >
                                        Copy address
                                    </BlackTooltip>
                                </span>
                                <a
                                    href={
                                        'https://polygonscan.com/address/' +
                                        sponsorship.id
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <SvgIcon name="externalLink" />
                                </a>
                            </NetworkActionBarInfoButton>
                        </NetworkActionBarInfoButtons>
                    </div>
                    <NetworkActionBarCTAs>
                        <Button
                            onClick={async () => {
                                try {
                                    await fundSponsorshipModal.pop()
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                        >
                            Sponsor
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    await joinSponsorshipModal.pop({
                                        streamId: sponsorship.streamId,
                                    })
                                } catch (e) {
                                    // Ignore for now.
                                }
                            }}
                        >
                            Join as operator
                        </Button>
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>
                    Sponsorship summary
                </NetworkActionBarStatsTitle>
                <WhiteBoxSeparator />
                <StatsBox
                    stats={[
                        {
                            label: 'Payout rate',
                            value:
                                toBN(sponsorship.DATAPerDay).toFormat(18) + ' DATA/day',
                        },
                        {
                            label: 'Operators',
                            value: String(sponsorship.operators),
                        },
                        {
                            label: 'Total staked',
                            value: truncateNumber(
                                Number(sponsorship.totalStake),
                                'thousands',
                            ),
                        },
                        {
                            label: 'APY',
                            value: sponsorship.apy + '%',
                        },
                        {
                            label: 'Cumulative sponsored',
                            value: 'NO DATA IN GRAPH',
                        },
                        {
                            label: 'Minimum stake',
                            value: 'NO DATA IN GRAPH',
                        },
                    ]}
                    columns={3}
                />
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

const SponsorshipStatBox: FunctionComponent<{ sponsorship: SponsorshipElement }> = ({
    sponsorship,
}) => {
    return (
        <StatsBox
            stats={[
                {
                    label: 'Payout',
                    value: 'NO DATA',
                },
                {
                    label: 'Operators',
                    value: String(sponsorship.operators),
                },
                {
                    label: 'Total staked',
                    value: truncateNumber(Number(sponsorship.totalStake), 'thousands'),
                },
                {
                    label: 'APY',
                    value: 'NO DATA',
                },
                {
                    label: 'Cumulative sponsored',
                    value: 'NO DATA',
                },
                {
                    label: 'Minimum stake',
                    value: 'NO DATA',
                },
            ]}
            columns={3}
        />
    )
}