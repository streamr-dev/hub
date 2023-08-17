import React, { FunctionComponent } from 'react'
import { toaster } from 'toasterhea'
import styled from 'styled-components'
import { SponsorshipElement } from '~/types/sponsorship'
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
import routes from '~/routes'
import { SimpleDropdown } from '~/components/SimpleDropdown'
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

    // TODO when Mariusz will merge his hook & getter for fetching Token information - use it here to display the proper token symbol

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
                                className={
                                    (sponsorship.active ? 'active ' : 'inactive') +
                                    ' bold'
                                }
                            >
                                {sponsorship.active ? 'Active' : 'Inactive'}
                            </NetworkActionBarInfoButton>

                            <SimpleDropdown
                                toggleElement={
                                    <NetworkActionBarInfoButton className="pointer bold">
                                        <SvgIcon name="page" />
                                        About Sponsorships
                                    </NetworkActionBarInfoButton>
                                }
                                dropdownContent={
                                    <AboutSponsorshipsContent>
                                        Sponsorships pay out tokens to staked operators
                                        for doing work in the network, i.e. relaying data
                                        in the associated stream. Sponsorships can be
                                        funded by anyone. Learn more{' '}
                                        <a
                                            href="https://docs.streamr.network/streamr-network/network-incentives"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            here
                                        </a>
                                        .
                                    </AboutSponsorshipsContent>
                                }
                            />
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
                            value: sponsorship.payoutPerDay + ' DATA/day',
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
                            value: `${sponsorship.cumulativeSponsoring} DATA`,
                        },
                        {
                            label: 'Minimum stake',
                            value: sponsorship.minimumStake + ' DATA',
                        },
                    ]}
                    columns={3}
                />
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

const AboutSponsorshipsContent = styled.div`
    margin: 0;
    min-width: 250px;
`