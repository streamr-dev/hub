import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { NoData } from '~/shared/components/NoData'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { COLORS, LAPTOP } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { SponsorshipActionBar } from '~/components/ActionBars/SponsorshipActionBar'
import { useSponsorshipFundingHistoryQuery } from '~/hooks/useSponsorshipFundingHistoryQuery'
import { ChartPeriod } from '~/types'
import NetworkPageSegment, { SegmentGrid, Pad } from '~/components/NetworkPageSegment'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import {
    useSponsorshipByIdQuery,
    useSponsorshipDailyBucketsQuery,
    useSponsorshipTokenInfo,
} from '~/hooks/sponsorships'
import { OperatorIdCell } from '~/components/Table'
import routes from '~/routes'
import { abbr } from '~/utils'

export const SingleSponsorshipPage = () => {
    const sponsorshipId = useParams().id || ''

    const sponsorshipQuery = useSponsorshipByIdQuery(sponsorshipId)

    const sponsorship = sponsorshipQuery.data || null

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const [selectedDataSource, setSelectedDataSource] = useState<
        'amountStaked' | 'numberOfOperators' | 'apy'
    >('amountStaked')

    const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(
        ChartPeriod.SevenDays,
    )

    const chartQuery = useSponsorshipDailyBucketsQuery({
        sponsorshipId,
        period: selectedPeriod,
        dataSource: selectedDataSource,
    })

    const { data: chartData = [] } = chartQuery

    const tooltipPrefix = useMemo(() => {
        switch (selectedDataSource) {
            case 'amountStaked':
                return 'Amount Staked'
            case 'numberOfOperators':
                return 'Number of Operators'
            case 'apy':
                return 'APY'
            default:
                return ''
        }
    }, [selectedDataSource])

    const formatTooltipValue = useCallback(
        (value: number) => {
            switch (selectedDataSource) {
                case 'amountStaked':
                    return `${abbr(value)} ${tokenSymbol}`
                case 'numberOfOperators':
                    return value.toString()
                case 'apy':
                    return `${value.toFixed(2)}%`
                default:
                    return ''
            }
        },
        [selectedDataSource, tokenSymbol],
    )

    const formatYAxisValue = useCallback(
        (value: number) => {
            switch (selectedDataSource) {
                case 'amountStaked':
                    return abbr(value)
                case 'numberOfOperators':
                    return value.toString()
                case 'apy':
                    return `${value.toFixed(2)}%`
                default:
                    return ''
            }
        },
        [selectedDataSource],
    )

    const fundingEventsQuery = useSponsorshipFundingHistoryQuery(sponsorshipId)

    return (
        <Layout>
            <NetworkHelmet title="Sponsorship" />
            <LoadingIndicator
                loading={sponsorshipQuery.isLoading || sponsorshipQuery.isFetching}
            />
            {!!sponsorship && <SponsorshipActionBar sponsorship={sponsorship} />}
            <LayoutColumn>
                {sponsorship == null ? (
                    <>
                        {!(sponsorshipQuery.isLoading || sponsorshipQuery.isFetching) && (
                            <NoData firstLine={'Sponsorship not found.'} />
                        )}
                    </>
                ) : (
                    <>
                        <SegmentGrid>
                            <ChartGrid>
                                <NetworkPageSegment title="Overview charts">
                                    <Pad>
                                        <NetworkChartDisplay
                                            periodTabs={
                                                <ChartPeriodTabs
                                                    value={selectedPeriod}
                                                    onChange={setSelectedPeriod}
                                                />
                                            }
                                            sourceTabs={
                                                <Tabs
                                                    selection={selectedDataSource}
                                                    onSelectionChange={(dataSource) => {
                                                        if (
                                                            dataSource !==
                                                                'amountStaked' &&
                                                            dataSource !==
                                                                'numberOfOperators' &&
                                                            dataSource !== 'apy'
                                                        ) {
                                                            return
                                                        }

                                                        setSelectedDataSource(dataSource)
                                                    }}
                                                >
                                                    <Tab id="amountStaked">
                                                        Amount Staked
                                                    </Tab>
                                                    <Tab id="numberOfOperators">
                                                        Number of Operators
                                                    </Tab>
                                                    <Tab id="apy">APY</Tab>
                                                </Tabs>
                                            }
                                        >
                                            <NetworkChart
                                                isLoading={
                                                    chartQuery.isLoading ||
                                                    chartQuery.isFetching
                                                }
                                                tooltipValuePrefix={tooltipPrefix}
                                                graphData={chartData}
                                                xAxisDisplayFormatter={formatShortDate}
                                                yAxisAxisDisplayFormatter={
                                                    formatYAxisValue
                                                }
                                                tooltipLabelFormatter={formatLongDate}
                                                tooltipValueFormatter={formatTooltipValue}
                                            />
                                        </NetworkChartDisplay>
                                    </Pad>
                                </NetworkPageSegment>
                                <NetworkPageSegment title="Operators" foot>
                                    <OperatorListWrap>
                                        <OperatorList>
                                            <OperatorListHeader>
                                                <div>
                                                    <strong>Operator</strong>
                                                </div>
                                                <div>
                                                    <strong>Staked</strong>
                                                </div>
                                            </OperatorListHeader>
                                            {sponsorship.stakes.map((stake) => (
                                                <OperatorListItem key={stake.operatorId}>
                                                    <Link
                                                        to={routes.network.operator({
                                                            id: stake.operatorId,
                                                        })}
                                                    >
                                                        <div>
                                                            <OperatorIdCell
                                                                truncate
                                                                operatorId={
                                                                    stake.operatorId
                                                                }
                                                                imageUrl={
                                                                    stake.metadata
                                                                        .imageUrl
                                                                }
                                                                operatorName={
                                                                    stake.metadata.name
                                                                }
                                                            />
                                                        </div>
                                                        {abbr(stake.amount)}
                                                    </Link>
                                                </OperatorListItem>
                                            ))}
                                        </OperatorList>
                                    </OperatorListWrap>
                                </NetworkPageSegment>
                            </ChartGrid>
                            <NetworkPageSegment foot title="Funding history">
                                <ScrollTable
                                    hasMoreResults={fundingEventsQuery.hasNextPage}
                                    onLoadMore={() => fundingEventsQuery.fetchNextPage()}
                                    elements={
                                        fundingEventsQuery.data?.pages
                                            .map((page) => page.events)
                                            .flat() || []
                                    }
                                    isLoading={
                                        fundingEventsQuery.isLoading ||
                                        fundingEventsQuery.isFetching
                                    }
                                    columns={[
                                        {
                                            displayName: 'Date',
                                            valueMapper: (element: any) => element.date,
                                            align: 'start',
                                            isSticky: true,
                                            key: 'date',
                                        },
                                        {
                                            displayName: 'Amount',
                                            valueMapper: (element: any) => (
                                                <>
                                                    {abbr(element.amount)} {tokenSymbol}
                                                </>
                                            ),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'amount',
                                        },
                                        {
                                            displayName: 'Sponsor',
                                            valueMapper: (element: any) =>
                                                truncate(element.sponsor),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'sponsor',
                                        },
                                    ]}
                                />
                            </NetworkPageSegment>
                        </SegmentGrid>
                    </>
                )}
            </LayoutColumn>
        </Layout>
    )
}

const ChartGrid = styled(SegmentGrid)`
    grid-template-columns: minmax(0, 1fr);

    @media ${LAPTOP} {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
`

const OperatorList = styled.ul`
    list-style: none;
    line-height: 1.5em;
    margin: 0;
    padding: 0;

    li {
        background: #ffffff;
    }

    li + li {
        border-top: 1px solid ${COLORS.separator};
    }
`

const OperatorListHeader = styled.li`
    display: flex;
    padding: 24px 40px;
    position: sticky;
    font-size: 14px;
    top: 0;
    z-index: 1;
    box-shadow: 0 1px 0 ${COLORS.separator};

    > div:first-child {
        flex-grow: 1;
    }
`

const OperatorListItem = styled.li`
    > a {
        align-items: center;
        color: inherit !important;
        display: flex;
        padding: 24px 40px;
    }

    > a:hover {
        background-color: ${COLORS.secondaryLight};
    }

    > a > div:first-child {
        flex-grow: 1;
        margin-right: 12px;
        min-width: 0;
    }
`

const OperatorListWrap = styled.div`
    max-height: 538px;
    overflow: auto;
`
