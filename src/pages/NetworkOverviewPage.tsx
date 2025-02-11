import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '~/components/Button'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import { SponsorshipDecimals } from '~/components/Decimals'
import { NetworkHelmet } from '~/components/Helmet'
import Layout from '~/components/Layout'
import { LoadMoreButton } from '~/components/LoadMore'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import NetworkPageSegment, {
    Pad,
    SegmentGrid,
    TitleBar,
} from '~/components/NetworkPageSegment'
import { QueriedSponsorshipsTable } from '~/components/QueriedSponsorshipsTable'
import { Separator } from '~/components/Separator'
import { StatCell, StatGrid } from '~/components/StatGrid'
import { OperatorIdCell } from '~/components/Table'
import WalletPass from '~/components/WalletPass'
import {
    GetStreamsDocument as GetIndexerStreamsDocument,
    GetStreamsQuery as GetIndexerStreamsQuery,
    GetStreamsQueryVariables as GetIndexerStreamsQueryVariables,
    StreamOrderBy as IndexerOrderBy,
    OrderDirection as IndexerOrderDirection,
} from '~/generated/gql/indexer'
import { OperatorDailyBucket } from '~/generated/gql/network'
import {
    getNetworkStats,
    getOperatorDailyBuckets,
    getTimestampForChartPeriod,
} from '~/getters'
import { getDelegationStats } from '~/getters/getDelegationStats'
import { getIndexerClient } from '~/getters/getGraphClient'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import {
    useDelegationsForWalletQuery,
    useDelegationsStats,
    useOperatorForWalletQuery,
    useOperatorStatsForWallet,
} from '~/hooks/operators'
import {
    useSponsorshipTokenInfo,
    useSponsorshipsForCreatorQuery,
} from '~/hooks/sponsorships'
import { NoData } from '~/shared/components/NoData'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { useWalletAccount } from '~/shared/stores/wallet'
import { ChartPeriod, XY } from '~/types'
import { abbr } from '~/utils'
import { toBigInt, toFloat } from '~/utils/bn'
import { useCurrentChainId, useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { errorToast } from '~/utils/toast'

export function NetworkOverviewPage() {
    return (
        <Layout columnize>
            <NetworkHelmet title="Network Overview" />
            <SegmentGrid>
                <NetworkStats />
                <MyOperatorSummary />
                <MyDelegationsSummary />
                <MyDelegations />
                <MySponsorships />
            </SegmentGrid>
        </Layout>
    )
}

function NetworkStats() {
    const currentChainId = useCurrentChainId()

    const statsQuery = useQuery({
        queryKey: ['networkStats', currentChainId],
        async queryFn() {
            return getNetworkStats(currentChainId)
        },
    })

    const operatorCountQuery = useActiveOperatorCountQuery()

    return (
        <NetworkPageSegment title="Network stats">
            <Pad>
                <StatGrid>
                    <StatCell label="Total stake">
                        {statsQuery.isLoading ? (
                            <>&zwnj;</>
                        ) : (
                            <>
                                {statsQuery.data ? (
                                    <SponsorshipDecimals
                                        abbr
                                        amount={statsQuery.data.totalStake}
                                        tooltip
                                    />
                                ) : (
                                    <>N/A</>
                                )}
                            </>
                        )}
                    </StatCell>
                    <StatCell label="Sponsorships">
                        {statsQuery.isLoading ? (
                            <>&zwnj;</>
                        ) : (
                            statsQuery.data?.sponsorshipsCount ?? <>N/A</>
                        )}
                    </StatCell>
                    <StatCell label="Active Operators">
                        {operatorCountQuery.isLoading ? (
                            <>&zwnj;</>
                        ) : (
                            operatorCountQuery.data ?? <>N/A</>
                        )}
                    </StatCell>
                </StatGrid>
            </Pad>
        </NetworkPageSegment>
    )
}

function useActiveOperatorCountQuery() {
    const chainId = useCurrentChainId()

    return useQuery({
        queryKey: ['useActiveOperatorCountQuery', chainId],
        queryFn: async () => {
            let cursor = '0'

            const uniquenessGate: Record<string, true | undefined> = {}

            let count = 0

            const client = getIndexerClient(chainId)

            if (!client) {
                return 0
            }

            for (;;) {
                const {
                    data: { streams },
                } = await client.query<
                    GetIndexerStreamsQuery,
                    GetIndexerStreamsQueryVariables
                >({
                    fetchPolicy: 'network-only',
                    query: GetIndexerStreamsDocument,
                    variables: {
                        first: 500,
                        orderBy: IndexerOrderBy.MessagesPerSecond,
                        orderDirection: IndexerOrderDirection.Desc,
                        cursor,
                    },
                })

                const breakEarly = (() => {
                    for (const item of streams.items) {
                        if (!item.messagesPerSecond) {
                            /**
                             * Make the whole stream fetching skip streams that have no
                             * data flowing through them.
                             */
                            return true
                        }

                        if (!uniquenessGate[item.id]) {
                            if (/^[^/]+\/operator\/coordination$/.test(item.id)) {
                                count += 1
                            }
                        }

                        uniquenessGate[item.id] = true
                    }

                    return false
                })()

                if (!streams.cursor || breakEarly) {
                    break
                }

                cursor = streams.cursor
            }

            return count
        },
    })
}

function MyOperatorSummary() {
    const wallet = useWalletAccount()

    const { symbol: tokenSymbol = 'DATA' } = useSponsorshipTokenInfo() || {}

    const stats = useOperatorStatsForWallet(wallet)

    const { value = 0n, numOfDelegators = 0, numOfSponsorships = 0 } = stats || {}

    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>(ChartPeriod.ThreeMonths)

    const [chartId, setChartId] = useState<'stake' | 'earnings'>('earnings')

    const { data: operator = null } = useOperatorForWalletQuery(wallet)

    const currentChainId = useCurrentChainId()

    const { data: chartData = [] } = useQuery<XY[]>({
        queryKey: [
            'operatorSummaryChartQuery',
            currentChainId,
            chartId,
            chartPeriod,
            operator?.id,
        ],
        async queryFn() {
            if (!operator) {
                return []
            }

            try {
                const end = moment().utc().subtract(1, 'day').endOf('day')

                const buckets = await getOperatorDailyBuckets(
                    currentChainId,
                    operator.id,
                    {
                        dateGreaterEqualThan: getTimestampForChartPeriod(
                            chartPeriod,
                            end,
                        ).unix(),
                        dateLowerThan: end.unix(),
                        force: true,
                    },
                )

                const { decimals } = await getSponsorshipTokenInfo(currentChainId)

                const toValue: (bucket: OperatorDailyBucket) => bigint =
                    chartId === 'stake'
                        ? ({ valueWithoutEarnings }) => toBigInt(valueWithoutEarnings)
                        : ({ cumulativeEarningsWei }) => toBigInt(cumulativeEarningsWei)

                return buckets.map((bucket) => ({
                    x: Number(bucket.date) * 1000,
                    y: toFloat(
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

    const chainKey = useCurrentChainKey()

    return (
        <NetworkPageSegment
            title={
                <TitleBar
                    aux={
                        operator && (
                            <Button
                                kind="secondary"
                                as={Link}
                                to={R.operator(operator.id, routeOptions(chainKey))}
                            >
                                View Operator
                            </Button>
                        )
                    }
                >
                    My operator summary
                </TitleBar>
            }
        >
            <WalletPass resourceName="operator summary" roundBorders>
                {!wallet || stats !== null ? (
                    <>
                        <Pad>
                            <StatGrid>
                                <StatCell label="Total stake">
                                    <SponsorshipDecimals abbr amount={value} />
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
                                        <Tab id="earnings">Cumulative earnings</Tab>
                                        <Tab id="stake">Total stake</Tab>
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
                                        <Link to={R.operators(routeOptions(chainKey))}>
                                            Operators
                                        </Link>{' '}
                                        page.
                                    </>
                                }
                                compact
                            />
                        </Pad>
                    </>
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MyDelegationsSummary() {
    const wallet = useWalletAccount()

    const currentChainId = useCurrentChainId()

    const stats = useDelegationsStats(wallet)

    const { symbol: tokenSymbol = 'DATA' } = useSponsorshipTokenInfo() || {}

    const { value = 0n, numOfOperators = 0, minApy = 0, maxApy = 0 } = stats || {}

    const apy = minApy === maxApy ? [minApy] : [minApy, maxApy]

    const [chartPeriod, setChartPeriod] = useState<ChartPeriod>(ChartPeriod.ThreeMonths)

    const [chartDataSource, setChartDataSource] = useState<
        'currentValue' | 'cumulativeEarnings'
    >('cumulativeEarnings')

    const dailyDelegationChartQuery = useQuery({
        queryKey: [
            'dailyDelegationChartQuery',
            currentChainId,
            wallet,
            chartPeriod,
            chartDataSource,
        ],
        queryFn: async () => {
            try {
                if (!wallet) {
                    return []
                }

                return await getDelegationStats(
                    currentChainId,
                    wallet,
                    chartPeriod,
                    chartDataSource,
                    {
                        force: true,
                        ignoreToday: false,
                    },
                )
            } catch (_) {
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
                            <SponsorshipDecimals abbr amount={value} />
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
                                <Tab id="cumulativeEarnings">Cumulative earnings</Tab>
                                <Tab id="currentValue">Current value</Tab>
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

    // We want to hide delegations to broken operator contract version 1
    // as we cannot get rid of them otherwise
    const delegations =
        query.data?.pages
            .flatMap((page) => page.elements)
            .filter((d) => d.contractVersion !== 1) || []

    const chainKey = useCurrentChainKey()

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
                                    valueMapper: (sponsorship) => (
                                        <SponsorshipDecimals
                                            abbr
                                            amount={
                                                wallet ? sponsorship.share(wallet) : 0n
                                            }
                                        />
                                    ),
                                    align: 'start',
                                    isSticky: false,
                                    key: 'myShare',
                                },
                                {
                                    displayName: 'Total stake',
                                    valueMapper: ({ valueWithoutEarnings }) => (
                                        <SponsorshipDecimals
                                            abbr
                                            amount={valueWithoutEarnings}
                                        />
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
                            linkMapper={({ id }) =>
                                R.operator(id, routeOptions(chainKey))
                            }
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
                                <Link to={R.operators(routeOptions(chainKey))}>
                                    operators
                                </Link>{' '}
                                to start delegating.
                            </>
                        }
                        compact
                    />
                )}
            </WalletPass>
        </NetworkPageSegment>
    )
}

function MySponsorships() {
    const query = useSponsorshipsForCreatorQuery(useWalletAccount())

    const chainKey = useCurrentChainKey()

    return (
        <NetworkPageSegment title="My sponsorships" foot>
            <WalletPass resourceName="sponsorships">
                <QueriedSponsorshipsTable
                    query={query}
                    noDataFirstLine="You don't have any sponsorships yet."
                    noDataSecondLine={
                        <>
                            You can{' '}
                            <Link to={R.sponsorships(routeOptions(chainKey))}>
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
