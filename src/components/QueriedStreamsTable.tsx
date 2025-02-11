import { InfiniteData, UseInfiniteQueryResult, useQuery } from '@tanstack/react-query'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { LoadMoreButton } from '~/components/LoadMore'
import { StreamIdCell } from '~/components/Table'
import { Minute } from '~/consts'
import {
    GetStreamsResult,
    StreamStats,
    StreamsOrderBy,
    getStreamsFromIndexer,
    isIndexerColumn,
} from '~/hooks/streams'
import { ScrollTableCore } from '~/shared/components/ScrollTable/ScrollTable'
import { OrderDirection } from '~/types'
import { useCurrentChainId, useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

interface Props {
    noDataFirstLine?: ReactNode
    noDataSecondLine?: ReactNode
    onOrderChange?: (orderBy: StreamsOrderBy, orderDirection?: OrderDirection) => void
    orderBy?: StreamsOrderBy
    orderDirection?: OrderDirection
    query: UseInfiniteQueryResult<InfiniteData<GetStreamsResult>>
}

export function QueriedStreamsTable({
    noDataFirstLine,
    noDataSecondLine,
    onOrderChange,
    orderBy = 'mps',
    orderDirection,
    query,
}: Props) {
    const pages = query.data?.pages || []

    const streams = pages.flatMap((d) => d.streams) || []

    const [streamStats, setStreamStats] = useState<
        Record<string, StreamStats | undefined>
    >({})

    const chainId = useCurrentChainId()

    const chainName = useCurrentChainKey()

    const indexerQueryErrored = query.isError && isIndexerColumn(chainId, orderBy)

    const onOrderChangeRef = useRef(onOrderChange)

    if (onOrderChangeRef.current !== onOrderChange) {
        onOrderChangeRef.current = onOrderChange
    }

    useEffect(
        function fallbackToGraphOnIndexerError() {
            if (!indexerQueryErrored) {
                return
            }

            onOrderChangeRef.current?.('id', 'asc')
        },
        [indexerQueryErrored],
    )

    return (
        <>
            {pages.map((page) => (
                <StreamStatsLoader
                    key={page.pageId}
                    page={page}
                    onStats={(stats) => {
                        setStreamStats((current) => ({
                            ...current,
                            ...stats,
                        }))
                    }}
                />
            ))}
            <ScrollTableCore
                noDataFirstLine={noDataFirstLine}
                noDataSecondLine={noDataSecondLine}
                elements={streams}
                orderBy={orderBy}
                orderDirection={orderDirection}
                onOrderChange={(orderBy) => {
                    onOrderChange?.(orderBy as StreamsOrderBy)
                }}
                isLoading={
                    query.isLoading || query.isFetching || query.isFetchingNextPage
                }
                columns={[
                    {
                        key: 'id',
                        displayName: 'Stream ID',
                        isSticky: true,
                        sortable: true,
                        valueMapper: ({ id, description }) => (
                            <StreamIdCell streamId={id} description={description || ''} />
                        ),
                    },
                    {
                        key: 'peerCount',
                        displayName: 'Nodes',
                        sortable: true,
                        valueMapper: ({ id, peerCount = streamStats[id]?.peerCount }) =>
                            peerCount ?? '-',
                    },
                    {
                        key: 'mps',
                        displayName: 'Msg/s',
                        sortable: true,
                        valueMapper: ({
                            id,
                            messagesPerSecond: mps = streamStats[id]?.messagesPerSecond,
                        }) => mps ?? '-',
                    },
                    {
                        key: 'bps',
                        displayName: 'KB/s',
                        sortable: true,
                        valueMapper: ({
                            id,
                            bytesPerSecond: bps = streamStats[id]?.bytesPerSecond,
                        }) => (bps == null ? '-' : (bps / 1024).toFixed(2)),
                    },
                    {
                        key: 'access',
                        displayName: 'Access',
                        valueMapper: ({ subscriberCount }) =>
                            subscriberCount == null ? 'Public' : 'Private',
                    },
                    {
                        key: 'publishers',
                        displayName: 'Publishers',
                        valueMapper: ({ publisherCount = '∞' }) => publisherCount,
                    },
                    {
                        key: 'subscribers',
                        displayName: 'Subscribers',
                        valueMapper: ({ subscriberCount = '∞' }) => subscriberCount,
                    },
                ]}
                linkMapper={(element) => R.stream(element.id, routeOptions(chainName))}
            />
            {query.hasNextPage && (
                <LoadMoreButton
                    disabled={query.isLoading || query.isFetching}
                    onClick={() => {
                        query.fetchNextPage()
                    }}
                    kind="primary2"
                >
                    Load more
                </LoadMoreButton>
            )}
        </>
    )
}

interface StreamStatsLoaderProps {
    page: GetStreamsResult
    onStats?(stats: Partial<Record<string, StreamStats>>): void
}

function StreamStatsLoader({ onStats, page }: StreamStatsLoaderProps) {
    const chainId = useCurrentChainId()

    const streamIdsRef = useRef(page.streams.map(({ id }) => id))

    const { data: result } = useQuery({
        queryKey: ['StreamStatsLoader.statsQuery', chainId, page.pageId, page.source],
        queryFn: async (): Promise<Partial<Record<string, StreamStats>>> => {
            if (page.source === 'indexer') {
                return {}
            }

            try {
                const { streams } = await getStreamsFromIndexer(chainId, {
                    force: true,
                    pageSize: Math.min(1000, streamIdsRef.current.length),
                    streamIds: streamIdsRef.current,
                })

                const stats: Partial<Record<string, StreamStats>> = {}

                for (const {
                    bytesPerSecond,
                    id,
                    messagesPerSecond,
                    peerCount,
                } of streams) {
                    stats[id] = {
                        bytesPerSecond,
                        messagesPerSecond,
                        peerCount,
                    }
                }

                return stats
            } catch (_) {
                // ¯\_(ツ)_/¯
            }

            return {}
        },
        staleTime: 5 * Minute,
    })

    const onStatsRef = useRef(onStats)

    if (onStatsRef.current !== onStats) {
        onStatsRef.current = onStats
    }

    useEffect(
        function triggerOnStatsOnNonFalsyResult() {
            if (result) {
                onStatsRef.current?.(result)
            }
        },
        [result],
    )

    return <></>
}
