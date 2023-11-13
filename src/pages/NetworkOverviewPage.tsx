import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import Layout from '~/components/Layout'
import { NetworkHelmet } from '~/components/Helmet'
import NetworkPageSegment, { Pad, SegmentGrid } from '~/components/NetworkPageSegment'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import WalletPass from '~/components/WalletPass'
import { NoData } from '~/shared/components/NoData'
import routes from '~/routes'
import { useWalletAccount } from '~/shared/stores/wallet'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { fromAtto, fromDecimals } from '~/marketplace/utils/math'
import {
    useSponsorshipsForCreatorQuery,
    useSponsorshipTokenInfo,
} from '~/hooks/sponsorships'
import { BNish, toBN } from '~/utils/bn'
import {
    useDelegationsForWalletQuery,
    useDelegationsStats,
    useOperatorForWalletQuery,
    useOperatorStatsForWallet,
} from '~/hooks/operators'
import { ChartPeriod, XY } from '~/types'
import { errorToast } from '~/utils/toast'
import { getOperatorDailyBuckets, getTimestampForChartPeriod } from '~/getters'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import { OperatorDailyBucket } from '~/generated/gql/network'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { LoadMoreButton } from '~/components/LoadMore'
import { Separator } from '~/components/Separator'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import { abbr } from '~/utils'
import { OperatorIdCell } from '~/components/Table'
import Button from '~/shared/components/Button'
import { getDelegationStats } from '~/getters/getDelegationStats'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'

export function NetworkOverviewPage() {
    return (
        <Layout columnize>
            <NetworkHelmet title="Network Overview" />
            <SegmentGrid>
                <MyOperatorSummary />
                <MyDelegationsSummary />
                <MyDelegations />
                <MySponsorships />
            </SegmentGrid>
        </Layout>
    )
}

function MyOperatorSummary() {
    const wallet = useWalletAccount()

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const stats = useOperatorStatsForWallet(wallet)

    const { value = toBN(0), numOfDelegators = 0, numOfSponsorships = 0 } = stats || {}

    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>(ChartPeriod.SevenDays)

    const [chartId, setChartId] = useState<'stake' | 'earnings'>('stake')

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    const { data: chartData = [] } = useQuery<XY[]>({
        queryKey: ['operatorSummaryChartQuery', chartId, chartPeriod, operator?.id],
        async queryFn() {
            if (!operator) {
                return []
            }

            try {
                const end = moment().utc().subtract(1, 'day').endOf('day')

                const buckets = await getOperatorDailyBuckets(operator.id, {
                    dateGreaterEqualThan: getTimestampForChartPeriod(
                        chartPeriod,
                        end,
                    ).unix(),
                    dateLowerThan: end.unix(),
                    force: true,
                })

                const { decimals } = await getSponsorshipTokenInfo()

                const toValue: (bucket: OperatorDailyBucket) => BNish =
                    chartId === 'stake'
                        ? ({ valueWithoutEarnings }) => valueWithoutEarnings
                        : ({ cumulativeEarningsWei }) => cumulativeEarningsWei

                return buckets.map((bucket) => ({
                    x: Number(bucket.date) * 1000,
                    y: fromDecimals(
                        toValue(bucket as OperatorDailyBucket),
                        decimals,
                    ).toNumber(),
                }))
            } catch (e) {
                errorToast({ title: 'Could not load operator chart data' })

                console.warn('Could not load operator chart data', e)
            }

            return []
        },
    })

    const chartLabel = chartId === 'stake' ? 'Total stake' : 'Cumulative earnings'

    return (
        <NetworkPageSegment
            title={
                <MyOperatorSummaryTitle>
                    <h2>My operator summary</h2>
                    <div>
                        {operator && (
                            <Button
                                kind="secondary"
                                tag={Link}
                                to={routes.network.operator({ id: operator.id })}
                            >
                                View Operator
                            </Button>
                        )}
                    </div>
                </MyOperatorSummaryTitle>
            }
        >
            <WalletPass resourceName="operator summary" roundBorders>
                {!wallet || stats !== null ? (
                    <>
                        <Pad>
                            <StatGrid>
                                <StatCell label="Total stake">
                                    {abbr(fromAtto(value))} {tokenSymbol}
                                </StatCell>
                                <StatCell label="Delegators">{numOfDelegators}</StatCell>
                                <StatCell label="Sponsorships">
                                    {numOfSponsorships}
                                </StatCell>
                            </StatGrid>
                        </Pad>
                        <Separator />
                        <Pad>
                            <NetworkChartDisplay
                                periodTabs={
                                    <ChartPeriodTabs
                                        value={chartPeriod}
                                        onChange={setChartPeriod}
                                    />
                                }
                                sourceTabs={
                                    <Tabs
                                        selection={chartId}
                                        onSelectionChange={(newChartId) => {
                                            if (
                                                newChartId !== 'stake' &&
                                                newChartId !== 'earnings'
                                            ) {
                                                return
                                            }

                                            setChartId(newChartId)
                                        }}
                                    >
                                        <Tab id="stake">Total stake</Tab>
                                        <Tab id="earnings">Cumulative earnings</Tab>
                                    </Tabs>
                                }
                            >
                                <NetworkChart
                                    tooltipValuePrefix={chartLabel}
                                    graphData={chartData}
                                    xAxisDisplayFormatter={formatShortDate}
                                    yAxisAxisDisplayFormatter={(value) => abbr(value)}
                                    tooltipLabelFormatter={formatLongDate}
                                    tooltipValueFormatter={(value) =>
                                        `${abbr(value)} ${tokenSymbol}`
                                    }
                                />
                            </NetworkChartDisplay>
                        </Pad>
                    </>
                ) : (
                    <>
                        <Pad>
                            <NoData
                                firstLine="You haven't initialized your operator."
                                secondLine={
                                    <>
                                        You can become an operator on the{' '}
                                        <Link to={routes.network.operators()}>
                                            Operators
                                        </Link>{' '}
                                        page.
                                    </>
                                }
                            />
                        </Pad>
                    </>
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

const MyOperatorSummaryTitle = styled.div`
    align-items: center;
    display: flex;
    height: 30px;

    h2 {
        flex-grow: 1;
        margin: 0 8px 0 0;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`

function MyDelegationsSummary() {
    const wallet = useWalletAccount()

    const stats = useDelegationsStats(wallet)

    const tokenSymbol = useSponsorshipTokenInfo()?.symbol || 'DATA'

    const { value = toBN(0), numOfOperators = 0, minApy = 0, maxApy = 0 } = stats || {}

    const apy = minApy === maxApy ? [minApy] : [minApy, maxApy]

    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>(ChartPeriod.SevenDays)
    const [chartDataSource, setChartDataSource] = useState<
        'currentValue' | 'cumulativeEarnings'
    >('currentValue')

    const dailyDelegationChartQuery = useQuery({
        queryKey: ['dailyDelegationChartQuery', wallet, chartPeriod, chartDataSource],
        queryFn: async () => {
            try {
                if (!wallet) {
                    return []
                }

                return await getDelegationStats(wallet, chartPeriod, chartDataSource, {
                    force: true,
                    ignoreToday: false,
                })
            } catch (e) {
                errorToast({ title: 'Could not load my delegations chart data' })
                return []
            }
        },
    })

    const chartLabel =
        chartDataSource === 'currentValue' ? 'Current value' : 'Cumulative earnings'

    return (
        <NetworkPageSegment title="My delegations summary">
            <WalletPass resourceName="delegations summary" roundBorders>
                <Pad>
                    <StatGrid>
                        <StatCell label="Current value">
                            {abbr(fromAtto(value))} {tokenSymbol}
                        </StatCell>
                        <StatCell label="Operators">{numOfOperators}</StatCell>
                        <StatCell label="APY">
                            {apy.map((v) => (v * 100).toFixed(0)).join('-')}%
                        </StatCell>
                    </StatGrid>
                </Pad>
                <Separator />
                <Pad>
                    <NetworkChartDisplay
                        periodTabs={
                            <ChartPeriodTabs
                                value={chartPeriod}
                                onChange={setChartPeriod}
                            />
                        }
                        sourceTabs={
                            <Tabs
                                selection={chartDataSource}
                                onSelectionChange={(newChartId) => {
                                    if (
                                        newChartId !== 'currentValue' &&
                                        newChartId !== 'cumulativeEarnings'
                                    ) {
                                        return
                                    }

                                    setChartDataSource(newChartId)
                                }}
                            >
                                <Tab id="currentValue">Current value</Tab>
                                <Tab id="cumulativeEarnings">Cumulative earnings</Tab>
                            </Tabs>
                        }
                    >
                        <NetworkChart
                            tooltipValuePrefix={chartLabel}
                            graphData={dailyDelegationChartQuery.data || []}
                            xAxisDisplayFormatter={formatShortDate}
                            yAxisAxisDisplayFormatter={(value) => abbr(value)}
                            isLoading={dailyDelegationChartQuery.isLoading}
                            tooltipLabelFormatter={formatLongDate}
                            tooltipValueFormatter={(value) =>
                                `${abbr(value)} ${tokenSymbol}`
                            }
                        />
                    </NetworkChartDisplay>
                </Pad>
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MyDelegations() {
    const wallet = useWalletAccount()

    const query = useDelegationsForWalletQuery({ address: wallet })

    const isLoading = query.isLoading || query.isFetching

    const delegations = query.data?.pages.flatMap((page) => page.elements) || []

    return (
        <NetworkPageSegment title="My delegations" foot>
            <WalletPass resourceName="delegations">
                {!wallet || delegations.length || isLoading ? (
                    <>
                        <ScrollTableCore
                            isLoading={isLoading}
                            elements={delegations}
                            columns={[
                                {
                                    displayName: 'Operator',
                                    valueMapper: ({
                                        id,
                                        metadata: { imageUrl, name },
                                    }) => (
                                        <OperatorIdCell
                                            operatorId={id}
                                            imageUrl={imageUrl}
                                            operatorName={name}
                                        />
                                    ),
                                    align: 'start',
                                    isSticky: true,
                                    key: 'operatorId',
                                },
                                {
                                    displayName: 'My delegation',
                                    valueMapper: ({ myShare }) => (
                                        <>
                                            {abbr(fromAtto(myShare))}{' '}
                                            <SponsorshipPaymentTokenName />
                                        </>
                                    ),
                                    align: 'start',
                                    isSticky: false,
                                    key: 'myShare',
                                },
                                {
                                    displayName: 'Total stake',
                                    valueMapper: ({ valueWithoutEarnings }) => (
                                        <>
                                            {abbr(fromAtto(valueWithoutEarnings))}{' '}
                                            <SponsorshipPaymentTokenName />
                                        </>
                                    ),
                                    align: 'end',
                                    isSticky: false,
                                    key: 'totalStake',
                                },
                                {
                                    displayName: "Owner's cut",
                                    valueMapper: ({ operatorsCut }) => `${operatorsCut}%`,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'operatorsCut',
                                },
                                {
                                    displayName: 'APY',
                                    valueMapper: ({ apy }) =>
                                        `${(apy * 100).toFixed(0)}%`,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'apy',
                                },
                                {
                                    displayName: 'Sponsorships',
                                    valueMapper: (element) => element.stakes.length,
                                    align: 'end',
                                    isSticky: false,
                                    key: 'sponsorships',
                                },
                            ]}
                            linkMapper={({ id }) => routes.network.operator({ id })}
                        />
                        {query.hasNextPage ? (
                            <LoadMoreButton
                                disabled={isLoading}
                                onClick={() => void query.fetchNextPage()}
                                kind="primary2"
                            >
                                Load more
                            </LoadMoreButton>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <NoData
                        firstLine="You haven't delegated to anyone yet."
                        secondLine={
                            <>
                                You can browse{' '}
                                <Link to={routes.network.operators()}>operators</Link> to
                                start delegating.
                            </>
                        }
                    />
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MySponsorships() {
    const query = useSponsorshipsForCreatorQuery(useWalletAccount())

    return (
        <NetworkPageSegment title="My sponsorships" foot>
            <WalletPass resourceName="sponsorships">
                <QueriedSponsorshipsTable
                    query={query}
                    noDataFirstLine="You don't have any sponsorships yet."
                    noDataSecondLine={
                        <>
                            You can{' '}
                            <Link to={routes.network.sponsorships()}>
                                start a sponsorship
                            </Link>{' '}
                            here
                        </>
                    }
                />
            </WalletPass>
        </NetworkPageSegment>
    )
}
