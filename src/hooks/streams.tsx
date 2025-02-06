import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import uniqueId from 'lodash/uniqueId'
import { Minute, address0 } from '~/consts'
import {
    GetGlobalStreamsStatsDocument,
    GetGlobalStreamsStatsQuery,
    GetGlobalStreamsStatsQueryVariables,
    GetStreamsDocument as GetIndexerStreamsDocument,
    GetStreamsQuery as GetIndexerStreamsQuery,
    GetStreamsQueryVariables as GetIndexerStreamsQueryVariables,
    StreamOrderBy as IndexerOrderBy,
    OrderDirection as IndexerOrderDirection,
} from '~/generated/gql/indexer'
import {
    GetPagedStreamsDocument,
    GetPagedStreamsQuery,
    GetPagedStreamsQueryVariables,
    OrderDirection as GraphOrderDirection,
    StreamPermission,
    Stream_Filter,
    Stream_OrderBy,
} from '~/generated/gql/network'
import { getDescription } from '~/getters'
import { getGraphClient, getIndexerClient } from '~/getters/getGraphClient'
import { useWalletAccount } from '~/shared/stores/wallet'
import { OrderDirection } from '~/types'
import { getChainConfigExtension, useCurrentChainId } from '~/utils/chains'

export enum StreamsTabOption {
    All = 'all',
    Your = 'your',
}

export function isStreamsTabOption(value: unknown): value is StreamsTabOption {
    return value === StreamsTabOption.All || value === StreamsTabOption.Your
}

export type StreamsOrderBy = 'id' | 'mps' | 'peerCount' | 'bps'

export interface UseStreamsQueryOptions {
    orderBy: StreamsOrderBy
    orderDirection: OrderDirection
    pageSize?: number
    search?: string
    streamIds?: string[]
    tab?: StreamsTabOption
}

interface GetStreamsOptions {
    pageParam?: string
    force?: boolean
    orderBy?: StreamsOrderBy
    orderDirection?: OrderDirection
    owner?: string
    pageSize?: number
    search?: string
    streamIds?: string[]
}

export interface StreamStats {
    bytesPerSecond: number | undefined
    messagesPerSecond: number | undefined
    peerCount: number | undefined
}

export interface GetStreamsResult {
    hasNextPage: boolean
    nextPageParam: string | null
    streams: (StreamStats & {
        description: string
        id: string
        publisherCount: number | undefined
        subscriberCount: number | undefined
    })[]
    pageId: string
    source: 'indexer' | 'graph'
}

export async function getStreamsFromIndexer(
    chainId: number,
    options: GetStreamsOptions = {},
): Promise<GetStreamsResult> {
    const {
        force = false,
        orderBy,
        orderDirection,
        owner,
        pageParam: cursor,
        pageSize,
        search,
        streamIds: streamIdsOption,
    } = options

    const client = getIndexerClient(chainId)

    if (!client) {
        return {
            hasNextPage: false,
            nextPageParam: null,
            pageId: uniqueId('StreamsPage-'),
            source: 'indexer',
            streams: [],
        }
    }

    const streamIds =
        !owner || owner === address0
            ? streamIdsOption
            : await (async () => {
                  /**
                   * Indexer keeps track of stream owners but have no information on secondary
                   * permissions. Here we ask the regular graph for stream ids for the current
                   * address and use them to query the indexer. Hacky.
                   */

                  try {
                      const where: Stream_Filter = {
                          permissions_: {
                              stream_contains_nocase: search,
                              userId: owner,
                          },
                      }

                      if (!where.permissions_?.stream_contains_nocase) {
                          delete where.permissions_?.stream_contains_nocase
                      }

                      const {
                          data: { streams: result },
                      } = await getGraphClient(chainId).query<
                          GetPagedStreamsQuery,
                          GetPagedStreamsQueryVariables
                      >({
                          query: GetPagedStreamsDocument,
                          variables: {
                              first: 1000,
                              where,
                          },
                          fetchPolicy: 'network-only',
                      })

                      return result.map(({ id }) => id)
                  } catch (_) {
                      return []
                  }
              })()

    const {
        data: { streams: result },
    } = await client.query<GetIndexerStreamsQuery, GetIndexerStreamsQueryVariables>({
        fetchPolicy: force ? 'network-only' : undefined,
        query: GetIndexerStreamsDocument,
        variables: {
            streamIds,
            first: pageSize,
            orderBy:
                orderBy === 'mps'
                    ? IndexerOrderBy.MessagesPerSecond
                    : orderBy === 'peerCount'
                    ? IndexerOrderBy.PeerCount
                    : orderBy === 'bps'
                    ? IndexerOrderBy.BytesPerSecond
                    : undefined,
            orderDirection:
                orderDirection === 'asc'
                    ? IndexerOrderDirection.Asc
                    : orderDirection === 'desc'
                    ? IndexerOrderDirection.Desc
                    : undefined,
            search,
            owner: undefined,
            cursor,
        },
    })

    const streams = result.items.map(
        ({ id, bytesPerSecond, messagesPerSecond, peerCount, ...s }) => ({
            bytesPerSecond,
            description: s.description || '',
            id,
            messagesPerSecond,
            peerCount,
            publisherCount: s.publisherCount || undefined,
            subscriberCount: s.subscriberCount || undefined,
        }),
    )

    return {
        hasNextPage: result.cursor != null,
        nextPageParam: result.cursor || null,
        pageId: uniqueId('StreamsPage-'),
        source: 'indexer',
        streams,
    }
}

async function getStreamsFromGraph(
    chainId: number,
    options: GetStreamsOptions = {},
): Promise<GetStreamsResult> {
    const {
        force = false,
        orderBy,
        orderDirection: orderDirectionParam,
        owner,
        pageParam: lastId,
        pageSize = 10,
        search,
        streamIds,
    } = options

    const orderOperator = orderDirectionParam === 'asc' ? 'gt' : 'lt'

    const orderDirection =
        orderDirectionParam === 'asc'
            ? GraphOrderDirection.Asc
            : orderDirectionParam === 'desc'
            ? GraphOrderDirection.Desc
            : undefined

    const where: Stream_Filter = {
        permissions_: {
            stream_contains_nocase: search,
            userId: owner,
        },
        [`id_${orderOperator}`]: lastId,
        id_in: streamIds,
    }

    if (!where.permissions_?.stream_contains_nocase) {
        delete where.permissions_?.stream_contains_nocase
    }

    if (!where.permissions_?.userId) {
        delete where.permissions_?.userId
    }

    if (Object.keys(where.permissions_ || {}).length === 0) {
        delete where.permissions_
    }

    if (where[`id_${orderOperator}`] == null) {
        delete where[`id_${orderOperator}`]
    }

    if (where.id_lt === '0') {
        delete where.id_lt
    }

    if (!where.id_in) {
        delete where.id_in
    }

    const {
        data: { streams: result },
    } = await getGraphClient(chainId).query<
        GetPagedStreamsQuery,
        GetPagedStreamsQueryVariables
    >({
        query: GetPagedStreamsDocument,
        variables: {
            first: pageSize + 1,
            orderBy: orderBy === 'id' ? Stream_OrderBy.Id : undefined,
            orderDirection,
            where,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    const streams = result.map((s) => {
        const { publisherCount, subscriberCount } = getStatsFromPermissions(
            s.permissions?.map((p) => ({
                ...p,
                userAddress: p.userId, // We need to add this deprecated field for now
            })) || [],
        )

        return {
            bytesPerSecond: undefined,
            description: getDescription(s),
            id: s.id,
            messagesPerSecond: undefined,
            peerCount: undefined,
            publisherCount,
            subscriberCount,
        }
    })

    return {
        hasNextPage: streams.length > pageSize,
        nextPageParam: streams.length ? streams[streams.length - 1].id : null,
        pageId: uniqueId('StreamsPage-'),
        source: 'graph',
        streams,
    }
}

export function useStreamsQuery(options: UseStreamsQueryOptions) {
    const { orderBy, orderDirection, pageSize = 10, search, tab, streamIds } = options

    const account = useWalletAccount()

    const chainId = useCurrentChainId()

    return useInfiniteQuery({
        queryKey: [
            'useStreamsQuery',
            chainId,
            account,
            orderBy,
            orderDirection,
            pageSize,
            search,
            tab,
            ...(streamIds || []),
        ],
        queryFn: async ({ pageParam }) => {
            const owner = tab === StreamsTabOption.Your ? account || address0 : undefined

            const getter = isIndexerColumn(chainId, orderBy)
                ? getStreamsFromIndexer
                : getStreamsFromGraph

            const { streams, nextPageParam, hasNextPage, source, pageId } = await getter(
                chainId,
                {
                    force: true,
                    orderBy,
                    orderDirection,
                    owner: owner?.toLowerCase(),
                    pageParam,
                    pageSize,
                    search: search?.toLowerCase() || undefined,
                    streamIds,
                },
            )

            return {
                hasNextPage,
                nextPageParam,
                pageId,
                source,
                streams,
            }
        },
        initialPageParam: '0',
        getNextPageParam: ({ hasNextPage, nextPageParam }) =>
            hasNextPage ? nextPageParam : null,
        staleTime: Minute,
        placeholderData: keepPreviousData,
    })
}

export function isIndexerColumn(chainId: number, orderBy: StreamsOrderBy) {
    if (!getChainConfigExtension(chainId).streamIndexerUrl) {
        return false
    }

    return orderBy === 'mps' || orderBy === 'peerCount' || orderBy === 'bps'
}

interface GetStatsFromPermissionsResult {
    subscriberCount: number | undefined
    publisherCount: number | undefined
}

function getStatsFromPermissions(
    permissions: StreamPermission[],
): GetStatsFromPermissionsResult {
    let subscriberCount: number | undefined = 0

    let publisherCount: number | undefined = 0

    permissions.forEach((perm) => {
        if (perm.userId === address0) {
            /**
             * If stream has public permissions (zero address), return `undefined`
             * for counts. It means anyone can publish and subscribe.
             */

            if (perm.subscribeExpiration >= Math.round(Date.now() / 1000)) {
                subscriberCount = undefined
            }

            if (perm.publishExpiration >= Math.round(Date.now() / 1000)) {
                publisherCount = undefined
            }
        }

        if (
            perm.subscribeExpiration >= Math.round(Date.now() / 1000) &&
            subscriberCount != null
        ) {
            subscriberCount += 1
        }

        if (
            perm.publishExpiration >= Math.round(Date.now() / 1000) &&
            publisherCount != null
        ) {
            publisherCount += 1
        }
    })

    return {
        subscriberCount,
        publisherCount,
    }
}

export function useGlobalStreamStatsQuery() {
    const chainId = useCurrentChainId()

    return useQuery({
        queryKey: ['useGlobalStreamStatsQuery', chainId],
        queryFn: async () => {
            const client = getIndexerClient(chainId)

            if (!client) {
                return null
            }

            try {
                const result = await client.query<
                    GetGlobalStreamsStatsQuery,
                    GetGlobalStreamsStatsQueryVariables
                >({
                    query: GetGlobalStreamsStatsDocument,
                })

                const { bytesPerSecond, messagesPerSecond, streamCount } =
                    result.data.summary

                return {
                    bytesPerSecond,
                    messagesPerSecond,
                    streamCount,
                }
            } catch (e) {
                console.warn('Fetching global streams stats failed', e)
            }

            return null
        },
    })
}
