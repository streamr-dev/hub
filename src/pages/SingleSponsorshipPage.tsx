import React, { useCallback, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { SponsorshipActionBar } from '~/components/ActionBars/SponsorshipActionBar'
import { BehindBlockErrorDisplay } from '~/components/BehindBlockErrorDisplay'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import { Decimals, SponsorshipDecimals } from '~/components/Decimals'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import NetworkPageSegment, {
    Pad,
    SegmentGrid,
    TitleBar,
} from '~/components/NetworkPageSegment'
import Spinner from '~/components/Spinner'
import { OperatorIdCell } from '~/components/Table'
import {
    useInitialBehindIndexError,
    useLatestBehindBlockError,
    useRefetchQueryBehindIndexEffect,
} from '~/hooks'
import {
    useSponsorshipByIdQuery,
    useSponsorshipDailyBucketsQuery,
    useSponsorshipTokenInfo,
} from '~/hooks/sponsorships'
import { useSponsorshipFundingHistoryQuery } from '~/hooks/useSponsorshipFundingHistoryQuery'
import { SponsorshipSummary } from '~/pages/SponsorshipPage/SponsorshipSummary'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { NoData } from '~/shared/components/NoData'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { NoDataWrap } from '~/shared/components/ScrollTable/ScrollTable.styles'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { COLORS, LAPTOP, TABLET } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import { ChartPeriod } from '~/types'
import { abbr } from '~/utils'
import { useCurrentChainFullName, useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

const EmptyArray = []

export const SingleSponsorshipPage = () => {
    const sponsorshipId = useParams().id || ''

    const sponsorshipQuery = useSponsorshipByIdQuery(sponsorshipId)

    const initialBehindBlockError = useInitialBehindIndexError(sponsorshipQuery, [
        sponsorshipId,
    ])

    useRefetchQueryBehindIndexEffect(sponsorshipQuery)

    const behindBlockError = useLatestBehindBlockError(sponsorshipQuery)

    const isFetching =
        sponsorshipQuery.isFetching || sponsorshipQuery.isLoading || !!behindBlockError

    const sponsorship = sponsorshipQuery.data || null

    const { symbol: tokenSymbol = 'DATA', decimals = 18n } =
        useSponsorshipTokenInfo() || {}

    const [selectedDataSource, setSelectedDataSource] = useState<
        'amountStaked' | 'numberOfOperators' | 'apy'
    >('amountStaked')

    const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(
        ChartPeriod.ThreeMonths,
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

    const { operatorCount = 0, minOperators } = sponsorship || {}

    const operational = minOperators == null || operatorCount >= minOperators

    const fullChainName = useCurrentChainFullName()

    const placeholder = behindBlockError ? (
        <BehindBlockErrorDisplay
            latest={behindBlockError}
            initial={initialBehindBlockError || undefined}
        />
    ) : !isFetching ? (
        <NoData firstLine={`Sponsorship not found on the ${fullChainName} chain.`} />
    ) : null

    const chainName = useCurrentChainKey()

    const rawFundingEvents = fundingEventsQuery.data?.pages || EmptyArray

    const fundingEvents = useMemo(
        () => rawFundingEvents.map((page) => page.events).flat() || EmptyArray,
        [rawFundingEvents],
    )

    return (
        <Layout>
            <NetworkHelmet title="Sponsorship" />
            <LoadingIndicator loading={isFetching} />
            {!!sponsorship && (
                <>
                    <SponsorshipActionBar sponsorship={sponsorship} />
                    <SponsorshipSummary sponsorship={sponsorship} />
                </>
            )}
            <LayoutColumn>
                {sponsorship == null ? (
                    placeholder
                ) : (
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
                                                        dataSource !== 'amountStaked' &&
                                                        dataSource !==
                                                            'numberOfOperators' &&
                                                        dataSource !== 'apy'
                                                    ) {
                                                        return
                                                    }

                                                    setSelectedDataSource(dataSource)
                                                }}
                                            >
                                                <Tab id="amountStaked">Amount Staked</Tab>
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
                                            yAxisAxisDisplayFormatter={formatYAxisValue}
                                            tooltipLabelFormatter={formatLongDate}
                                            tooltipValueFormatter={formatTooltipValue}
                                        />
                                    </NetworkChartDisplay>
                                </Pad>
                            </NetworkPageSegment>
                            <NetworkPageSegment
                                title={
                                    <TitleBar
                                        aux={
                                            operational ? undefined : (
                                                <MinOperatorCountNotReached>
                                                    {sponsorship.operatorCount}/
                                                    {sponsorship.minOperators}
                                                    <OperatorSpinner
                                                        color="green"
                                                        strokeWidth={3}
                                                        size={20}
                                                        fixed
                                                        coverage={Math.max(
                                                            0.01,
                                                            sponsorship.operatorCount /
                                                                sponsorship.minOperators,
                                                        )}
                                                    />
                                                </MinOperatorCountNotReached>
                                            )
                                        }
                                        label={
                                            operational
                                                ? sponsorship.operatorCount
                                                : undefined
                                        }
                                    >
                                        Operators
                                    </TitleBar>
                                }
                                foot
                            >
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
                                                    to={R.operator(
                                                        stake.operatorId,
                                                        routeOptions(chainName),
                                                    )}
                                                >
                                                    <div>
                                                        <OperatorIdCell
                                                            truncate
                                                            operatorId={stake.operatorId}
                                                            imageUrl={
                                                                stake.metadata.imageUrl
                                                            }
                                                            operatorName={
                                                                stake.metadata.name
                                                            }
                                                        />
                                                    </div>
                                                    <strong>
                                                        <Decimals
                                                            abbr
                                                            amount={stake.amountWei}
                                                            decimals={decimals}
                                                        />
                                                    </strong>
                                                </Link>
                                            </OperatorListItem>
                                        ))}
                                        {!sponsorship.stakes.length && (
                                            <li>
                                                <NoDataWrap>
                                                    <NoData
                                                        firstLine="No operators"
                                                        compact
                                                    />
                                                </NoDataWrap>
                                            </li>
                                        )}
                                    </OperatorList>
                                </OperatorListWrap>
                            </NetworkPageSegment>
                        </ChartGrid>
                        <NetworkPageSegment foot title="Funding history">
                            <ScrollTable
                                hasMoreResults={fundingEventsQuery.hasNextPage}
                                onLoadMore={() => fundingEventsQuery.fetchNextPage()}
                                elements={fundingEvents}
                                isLoading={
                                    fundingEventsQuery.isLoading ||
                                    fundingEventsQuery.isFetching
                                }
                                columns={[
                                    {
                                        displayName: 'Date',
                                        valueMapper: (element) => element.date,
                                        align: 'start',
                                        isSticky: true,
                                        key: 'date',
                                    },
                                    {
                                        displayName: 'Amount',
                                        valueMapper: (element) => (
                                            <SponsorshipDecimals
                                                abbr
                                                amount={element.amount}
                                            />
                                        ),
                                        align: 'start',
                                        isSticky: false,
                                        key: 'amount',
                                    },
                                    {
                                        displayName: 'Sponsor',
                                        valueMapper: (element) =>
                                            truncate(element.sponsor),
                                        align: 'start',
                                        isSticky: false,
                                        key: 'sponsor',
                                    },
                                ]}
                            />
                        </NetworkPageSegment>
                    </SegmentGrid>
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
    font-size: 14px;
    list-style: none;
    line-height: 1.5em;
    margin: 0;
    padding: 0;

    li {
        background: #ffffff;
    }

    li + li {
        border-top: 1px solid ${COLORS.Border};
    }
`

const OperatorListHeader = styled.li`
    background: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(8px);
    box-shadow: 0 1px 0 ${COLORS.Border};
    display: flex;
    padding: 16px 24px;
    position: sticky;
    top: 0;
    z-index: 1;

    > div:first-child {
        flex-grow: 1;
    }

    @media ${TABLET} {
        padding: 24px 40px;
    }
`

const OperatorListItem = styled.li`
    > a {
        align-items: center;
        color: inherit !important;
        display: flex;
        padding: 16px 24px;
    }

    > a:hover {
        background-color: ${COLORS.secondaryLight};
    }

    > a > div:first-child {
        flex-grow: 1;
        margin-right: 12px;
        min-width: 0;
    }

    @media ${TABLET} {
        > a {
            padding: 24px 40px;
        }
    }
`

const OperatorListWrap = styled.div`
    max-height: 538px;
    overflow: auto;
`

const MinOperatorCountNotReached = styled.div`
    align-items: center;
    display: flex;
    color: #525252;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 30px;
    letter-spacing: 0.14px;
    justify-self: right;
`

const OperatorSpinner = styled(Spinner)`
    margin-left: 8px;
`
