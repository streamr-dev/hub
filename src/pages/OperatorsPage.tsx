import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { NetworkActionBar } from '~/components/ActionBars/NetworkActionBar'
import { Button } from '~/components/Button'
import { SponsorshipDecimals } from '~/components/Decimals'
import { NetworkHelmet } from '~/components/Helmet'
import Layout, { LayoutColumn } from '~/components/Layout'
import { LoadMoreButton } from '~/components/LoadMore'
import NetworkPageSegment, { SegmentGrid } from '~/components/NetworkPageSegment'
import { OperatorIdCell } from '~/components/Table'
import { getSpotApy } from '~/getters'
import {
    useAllOperatorsQuery,
    useDelegationsForWalletQuery,
    useOperatorForWalletQuery,
} from '~/hooks/operators'
import { useTableOrder } from '~/hooks/useTableOrder'
import { useUrlParams } from '~/hooks/useUrlParams'
import { Operator } from '~/parsers/Operator'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { useIsWalletLoading, useWalletAccount } from '~/shared/stores/wallet'
import { OrderDirection } from '~/types'
import { saveOperator } from '~/utils'
import {
    useCurrentChainFullName,
    useCurrentChainId,
    useCurrentChainKey,
} from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

enum TabOption {
    AllOperators = 'all',
    MyDelegations = 'my',
}

const PAGE_SIZE = 20
const DEFAULT_ORDER_BY = 'totalValue'
const DEFAULT_ORDER_DIRECTION = 'desc'
const DEFAULT_TAB = TabOption.AllOperators

function isTabOption(value: unknown): value is TabOption {
    return value === TabOption.AllOperators || value === TabOption.MyDelegations
}

export const OperatorsPage = () => {
    const wallet = useWalletAccount()
    const isWalletLoading = useIsWalletLoading()

    const [params] = useSearchParams()
    const tab = params.get('tab')
    const selectedTab = isTabOption(tab) ? tab : DEFAULT_TAB
    const [searchQuery, setSearchQuery] = useState(params.get('search') || '')

    const { orderBy, orderDirection, setOrder } = useTableOrder<string>({
        orderBy: params.get('orderBy') || DEFAULT_ORDER_BY,
        orderDirection:
            (params.get('orderDir') as OrderDirection) || DEFAULT_ORDER_DIRECTION,
    })

    useUrlParams([
        {
            param: 'tab',
            value: selectedTab,
            defaultValue: DEFAULT_TAB,
        },
        {
            param: 'orderBy',
            value: orderBy,
            defaultValue: DEFAULT_ORDER_BY,
        },
        {
            param: 'orderDir',
            value: orderDirection,
            defaultValue: DEFAULT_ORDER_DIRECTION,
        },
        {
            param: 'search',
            value: searchQuery,
            defaultValue: '',
        },
    ])

    const allOperatorsQuery = useAllOperatorsQuery({
        batchSize: PAGE_SIZE,
        searchQuery,
        orderBy,
        orderDirection,
    })

    const myDelegationsQuery = useDelegationsForWalletQuery({
        address: wallet,
        pageSize: PAGE_SIZE,
        searchQuery,
    })

    const chainId = useCurrentChainId()

    const chainKey = useCurrentChainKey()

    const operatorQuery = useOperatorForWalletQuery(wallet)

    const { data: operator = null } = operatorQuery

    const currentQuery =
        selectedTab === TabOption.AllOperators ? allOperatorsQuery : myDelegationsQuery

    const navigate = useNavigate()

    useEffect(() => {
        if (!wallet && !isWalletLoading) {
            navigate(
                R.operators(
                    routeOptions(chainKey, {
                        tab: TabOption.AllOperators,
                    }),
                ),
            )
        }
    }, [wallet, isWalletLoading, navigate, chainKey])

    return (
        <Layout>
            <NetworkHelmet title="Operators" />
            <NetworkActionBar
                searchEnabled={true}
                searchValue={searchQuery}
                onSearch={setSearchQuery}
                leftSideContent={
                    <Tabs
                        onSelectionChange={(value) => {
                            navigate(R.operators(routeOptions(chainKey, { tab: value })))
                        }}
                        selection={selectedTab}
                        fullWidthOnMobile={true}
                    >
                        <Tab id={TabOption.AllOperators}>All Operators</Tab>
                        <Tab id={TabOption.MyDelegations} disabled={!wallet}>
                            My Delegations
                        </Tab>
                    </Tabs>
                }
                rightSideContent={
                    operator ? (
                        <Button
                            as={Link}
                            to={R.operator(operator.id, routeOptions(chainKey))}
                        >
                            View my Operator
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                saveOperator(chainId, undefined, {
                                    onDone(id, blockNumber) {
                                        navigate(
                                            R.operator(
                                                id,
                                                routeOptions(chainId, {
                                                    b: blockNumber,
                                                }),
                                            ),
                                        )
                                    },
                                })
                            }}
                            disabled={!wallet || !!operator || operatorQuery.isFetching}
                        >
                            Become an Operator
                        </Button>
                    )
                }
            />
            <LayoutColumn>
                <SegmentGrid>
                    <NetworkPageSegment
                        foot
                        title={
                            <h2>
                                {selectedTab === TabOption.AllOperators ? (
                                    <>All Operators</>
                                ) : (
                                    <>My Delegations</>
                                )}
                            </h2>
                        }
                    >
                        {selectedTab === TabOption.AllOperators ? (
                            <OperatorsTable
                                query={allOperatorsQuery}
                                orderBy={orderBy}
                                orderDirection={orderDirection}
                                onOrderChange={setOrder}
                            />
                        ) : (
                            <DelegationsTable query={myDelegationsQuery} />
                        )}
                        {currentQuery.hasNextPage && (
                            <LoadMoreButton
                                disabled={
                                    currentQuery.isLoading || currentQuery.isFetching
                                }
                                onClick={() => void currentQuery.fetchNextPage()}
                                kind="primary2"
                            >
                                Load more
                            </LoadMoreButton>
                        )}
                    </NetworkPageSegment>
                </SegmentGrid>
            </LayoutColumn>
        </Layout>
    )
}

function DelegationsTable({
    query,
}: {
    query: UseInfiniteQueryResult<InfiniteData<{ skip: number; elements: Operator[] }>>
}) {
    // We want to hide delegations to broken operator contract version 1
    // as we cannot get rid of them otherwise
    const elements =
        query.data?.pages
            .flatMap((page) => page.elements)
            .filter((d) => d.contractVersion !== 1) || []

    const chainKey = useCurrentChainKey()

    const chainFullName = useCurrentChainFullName()

    const wallet = useWalletAccount()

    return (
        <ScrollTableCore
            elements={elements}
            isLoading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            columns={[
                {
                    displayName: 'Operator',
                    valueMapper: ({ id, metadata: { name, imageUrl } }) => (
                        <OperatorIdCell
                            operatorId={id}
                            operatorName={name}
                            imageUrl={imageUrl}
                        />
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'operatorId',
                },
                {
                    displayName: 'My delegation',
                    valueMapper: (element) => (
                        <SponsorshipDecimals
                            abbr
                            amount={wallet ? element.share(wallet) : 0n}
                        />
                    ),
                    align: 'start',
                    isSticky: false,
                    key: 'myShare',
                },
                {
                    displayName: 'Total stake',
                    valueMapper: (element) => (
                        <SponsorshipDecimals abbr amount={element.valueWithoutEarnings} />
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'totalStake',
                },
                {
                    displayName: "Owner's cut",
                    valueMapper: (element) => `${element.operatorsCut}%`,
                    align: 'end',
                    isSticky: false,
                    key: 'operatorsCut',
                },
                {
                    displayName: 'APY',
                    valueMapper: (element) => `${(element.apy * 100).toFixed(0)}%`,
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
            noDataFirstLine={`You have not delegated to any operator on the ${chainFullName} chain.`}
            linkMapper={(element) => R.operator(element.id, routeOptions(chainKey))}
        />
    )
}

function OperatorsTable({
    query,
    orderBy,
    orderDirection,
    onOrderChange,
}: {
    query: UseInfiniteQueryResult<InfiniteData<{ skip: number; elements: Operator[] }>>
    orderBy?: string
    orderDirection?: OrderDirection
    onOrderChange: (columnKey: string) => void
}) {
    const elements = query.data?.pages.flatMap((page) => page.elements) || []

    const chainKey = useCurrentChainKey()

    const chainFullName = useCurrentChainFullName()

    return (
        <ScrollTableCore
            elements={elements}
            isLoading={query.isLoading || query.isFetching || query.isFetchingNextPage}
            orderDirection={orderDirection}
            orderBy={orderBy}
            onOrderChange={onOrderChange}
            columns={[
                {
                    displayName: 'Operator',
                    valueMapper: ({ id, metadata: { name, imageUrl } }) => (
                        <OperatorIdCell
                            operatorId={id}
                            operatorName={name}
                            imageUrl={imageUrl}
                            truncate={!!name}
                        />
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'operatorId',
                },
                {
                    displayName: 'Total stake',
                    valueMapper: (element) => (
                        <SponsorshipDecimals abbr amount={element.valueWithoutEarnings} />
                    ),
                    align: 'start',
                    isSticky: false,
                    key: 'totalValue',
                    sortable: true,
                },
                {
                    displayName: 'Deployed stake',
                    valueMapper: (element) => (
                        <SponsorshipDecimals
                            abbr
                            amount={element.totalStakeInSponsorshipsWei}
                        />
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'deployed',
                    sortable: true,
                },
                {
                    displayName: "Owner's cut",
                    valueMapper: (element) => `${element.operatorsCut}%`,
                    align: 'end',
                    isSticky: false,
                    key: 'operatorCut',
                    sortable: true,
                },
                {
                    displayName: 'APY',
                    valueMapper: (element) =>
                        `${(getSpotApy(element) * 100).toFixed(0)}%`,
                    align: 'end',
                    isSticky: false,
                    key: 'apy',
                },
                {
                    displayName: 'Sponsorships',
                    valueMapper: (element) => element.stakes.length,
                    align: 'end',
                    isSticky: false,
                    key: 'sponsorshipCount',
                },
            ]}
            noDataFirstLine={`No operators found on the ${chainFullName} chain.`}
            linkMapper={(element) => R.operator(element.id, routeOptions(chainKey))}
        />
    )
}
