import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import Layout from '$shared/components/Layout'
import SearchBar from '$shared/components/SearchBar'
import Tabs from '$shared/components/Tabs'
import {
    IndexerOrderBy,
    IndexerOrderDirection,
    IndexerResult,
    TheGraphOrderBy,
    TheGraphOrderDirection,
    TheGraphStreamResult,
    getPagedStreams,
    getPagedStreamsFromIndexer,
    getStreams,
    getStreamsFromIndexer,
} from '$app/src/services/streams'
import { useIsAuthenticated } from '$auth/hooks/useIsAuthenticated'
import { ActionBarContainer, FiltersBar, FiltersWrap, SearchBarWrap } from '$mp/components/ActionBar/actionBar.styles'
import { PageWrap } from '$shared/components/PageWrap'
import styles from '$shared/components/Layout/layout.pcss'
import StreamTable, { OrderBy, OrderDirection } from '$shared/components/StreamTable'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import { useAuthController } from '$auth/hooks/useAuthController'
import routes from '$routes'

enum StreamSelection {
    All = "All",
    Your = "Your",
}

const streamSelectionOptions = (isUserAuthenticated: boolean) => [
    {
        label: 'All streams',
        value: StreamSelection.All.toString(),
    },
    {
        label: 'Your streams',
        value: StreamSelection.Your.toString(),
        disabled: !isUserAuthenticated,
        disabledReason: 'Connect your wallet to view your streams',
    },
]

const PAGE_SIZE = 10
const DEFAULT_ORDER_BY = OrderBy.MessagesPerSecond
const DEFAULT_ORDER_DIRECTION = OrderDirection.Desc

const mapOrderByToIndexer = (orderBy: OrderBy): IndexerOrderBy => {
    switch (orderBy) {
        case OrderBy.Id: {
            return IndexerOrderBy.Id
        }
        case OrderBy.MessagesPerSecond: {
            return IndexerOrderBy.MsgPerSecond
        }
        case OrderBy.PeerCount: {
            return IndexerOrderBy.PeerCount
        }
        default:
            return IndexerOrderBy.MsgPerSecond
    }
}

const mapOrderDirectionToIndexer = (orderDirection: OrderDirection): IndexerOrderDirection => {
    switch (orderDirection) {
        case OrderDirection.Desc: {
            return IndexerOrderDirection.Desc
        }
        case OrderDirection.Asc: {
            return IndexerOrderDirection.Asc
        }
        default:
            return IndexerOrderDirection.Asc
    }
}

const mapOrderByToGraph = (orderBy: OrderBy): TheGraphOrderBy => {
    switch (orderBy) {
        case OrderBy.Id: {
            return TheGraphOrderBy.Id
        }
        default:
            return TheGraphOrderBy.Id
    }
}

const mapOrderDirectionToGraph = (orderDirection: OrderDirection): TheGraphOrderDirection => {
    switch (orderDirection) {
        case OrderDirection.Desc: {
            return TheGraphOrderDirection.Desc
        }
        case OrderDirection.Asc: {
            return TheGraphOrderDirection.Asc
        }
        default:
            return TheGraphOrderDirection.Asc
    }
}

const shouldUseIndexer = (orderBy: OrderBy) => {
    if (orderBy === OrderBy.MessagesPerSecond || orderBy === OrderBy.PeerCount) {
        return true
    }

    return false
}

const Container = styled.div`
    background-color: ${COLORS.secondary};

    padding: 24px 24px 80px 24px;

    @media ${TABLET} {
        padding: 45px 40px 90px 40px;
    }

    @media ${DESKTOP} {
        padding: 60px 0 130px;
    }
`

const TableContainer = styled.div`
    border-radius: 16px;
    background-color: white;
`

const NewStreamListingPage: React.FC = () => {
    const [search, setSearch] = useState<string>('')
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
    const [orderDirection, setOrderDirection] = useState(DEFAULT_ORDER_DIRECTION)
    const [streamsSelection, setStreamsSelection] = useState<StreamSelection>(StreamSelection.All)
    const isUserAuthenticated = useIsAuthenticated()
    const { currentAuthSession } = useAuthController()

    const streamsQuery = useInfiniteQuery({
        queryKey: ["streams", search, streamsSelection, currentAuthSession.address, orderBy, orderDirection],
        queryFn: async (ctx) => {
            const owner = streamsSelection === StreamSelection.Your ? currentAuthSession.address : undefined

            let result: TheGraphStreamResult | IndexerResult
            if (shouldUseIndexer(orderBy)) {
                result = await getPagedStreamsFromIndexer(
                    PAGE_SIZE,
                    ctx.pageParam,
                    owner,
                    search,
                    mapOrderByToIndexer(orderBy),
                    mapOrderDirectionToIndexer(orderDirection),
                )
            } else {
                result = await getPagedStreams(
                    PAGE_SIZE,
                    ctx.pageParam,
                    owner,
                    search,
                    mapOrderByToGraph(orderBy),
                    mapOrderDirectionToGraph(orderDirection),
                )
            }

            // Fetch stats
            statsQuery.fetchNextPage({
                pageParam: {
                    streamIds: result.streams.map((s) => s.id),
                    useIndexer: !shouldUseIndexer(orderBy),
                }
            })

            return result
        },
        getNextPageParam: (lastPage) => {
            const theGraphResult = (lastPage as TheGraphStreamResult)
            if (theGraphResult.lastId) {
                return theGraphResult.hasNextPage ? theGraphResult.lastId : null
            }

            const indexerResult = (lastPage as IndexerResult)
            if (indexerResult.cursor) {
                return indexerResult.hasNextPage ? indexerResult.cursor : null
            }

            return null
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    const statsQuery = useInfiniteQuery({
        queryKey: ["streamStats"],
        queryFn: async (ctx) => {
            if (ctx.pageParam == null) {
                return
            }

            if (ctx.pageParam.useIndexer) {
                const indexerStats = await getStreamsFromIndexer(ctx.pageParam.streamIds)
                return indexerStats
            }

            const indexerStats = await getStreams(ctx.pageParam.streamIds)
            return indexerStats
        },
        staleTime: 60 * 1000, // 1 minute
        keepPreviousData: true,
    })

    // If indexer errors fall back to using The Graph
    useEffect(() => {
        if (streamsQuery.isError && shouldUseIndexer(orderBy)) {
            setOrderBy(OrderBy.Id)
            setOrderDirection(OrderDirection.Asc)
        }
    }, [streamsQuery.isError, orderBy])

    return (
        <Layout innerClassName={styles.greyInner}>
            <MarketplaceHelmet title="Streams" />
            <ActionBarContainer>
                <SearchBarWrap>
                    <SearchBar
                        value={search}
                        onChange={(value) => {
                            setSearch(value)
                        }}
                    />
                </SearchBarWrap>
                <FiltersBar>
                    <FiltersWrap>
                        <Tabs
                            options={streamSelectionOptions(isUserAuthenticated)}
                            onChange={(newValue) => setStreamsSelection(StreamSelection[newValue])}
                            selectedOptionValue={streamsSelection}
                        />
                    </FiltersWrap>
                    <Button tag={Link} to={routes.streams.new()}>
                        Create stream
                    </Button>
                </FiltersBar>
            </ActionBarContainer>
            <LoadingIndicator loading={streamsQuery.isLoading}/>
            <PageWrap>
                <Container>
                    <TableContainer>
                        <StreamTable
                            title={`${streamsSelection === StreamSelection.All ? 'All' : 'Your'} Streams`}
                            streams={streamsQuery.data?.pages.flatMap((d) => d.streams) ?? []}
                            streamStats={Object.fromEntries(
                                (statsQuery.data?.pages ?? [])
                                    .filter((p) => p != null)
                                    .flatMap((p) => p)
                                    .map((s) => [s.id, s]),
                            )}
                            loadMore={() => streamsQuery.fetchNextPage()}
                            hasMoreResults={streamsQuery.hasNextPage ?? false}
                            showGlobalStats={streamsSelection === StreamSelection.All}
                            orderBy={orderBy}
                            orderDirection={orderDirection}
                            onSortChange={(orderBy, orderDirection) => {
                                setOrderBy(orderBy)
                                setOrderDirection(orderDirection)
                            }}
                        />
                    </TableContainer>
                </Container>
            </PageWrap>
        </Layout>
    )
}

export default NewStreamListingPage
