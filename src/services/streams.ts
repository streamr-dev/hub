import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { address0 } from '~/consts'
import {
    GetPagedStreamsDocument,
    GetPagedStreamsQuery,
    GetPagedStreamsQueryVariables,
    GetStreamByIdDocument,
    GetStreamByIdQuery,
    GetStreamByIdQueryVariables,
    OrderDirection as GraphOrderDirection,
    Stream,
    Stream_Filter,
    Stream_OrderBy,
    StreamPermission,
} from '~/generated/gql/network'
import { getGraphClient } from '~/getters/getGraphClient'
import { OrderDirection } from '~/types'

export type TheGraphStreamPermission = {
    userId: string
    canEdit: boolean
    canGrant: boolean
    canDelete: boolean
    subscribeExpiration: number
    publishExpiration: number
}

export type TheGraphStreamMetadata = {
    description?: string
}

export type TheGraphStream = {
    id: string
    metadata?: TheGraphStreamMetadata
    subscriberCount: number | null | undefined
    publisherCount: number | null | undefined
    permissions: TheGraphStreamPermission[]
}

export type TheGraphStreamResult = {
    streams: Array<TheGraphStream>
    hasNextPage: boolean
    lastId: string | null
}

const calculatePubSubCount = (permissions: StreamPermission[]) => {
    let publisherCount: number | null = 0
    let subscriberCount: number | null = 0

    permissions.forEach((perm) => {
        // If stream has public permissions (zero address), return null for counts which means that anyone can
        // publish or subscribe
        if (perm.userId === address0) {
            if (perm.subscribeExpiration >= Math.round(Date.now() / 1000)) {
                subscriberCount = null
            }
            if (perm.publishExpiration >= Math.round(Date.now() / 1000)) {
                publisherCount = null
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
        publisherCount,
        subscriberCount,
    }
}

const mapStream = (stream: Stream): TheGraphStream => {
    const result: TheGraphStream = {
        id: stream.id,
        publisherCount: 0,
        subscriberCount: 0,
        permissions: stream.permissions as TheGraphStreamPermission[],
    }

    // Get publisher and subscriber counts
    const counts = calculatePubSubCount(stream.permissions || [])
    result.publisherCount = counts.publisherCount
    result.subscriberCount = counts.subscriberCount

    // Try to parse metadata JSON
    if (stream.metadata != null) {
        try {
            result.metadata = JSON.parse(stream.metadata as string)
        } catch (e) {
            console.error(`Could not parse metadata for stream ${stream.id}`, e)
            result.metadata = {}
        }
    }

    return result
}

const prepareStreamResult = (
    result: Stream[],
    pageSize: number,
): TheGraphStreamResult => {
    let hasNextPage = false

    const streams: TheGraphStream[] = result.map((p) => mapStream(p))
    if (streams.length > pageSize) {
        hasNextPage = true
        // Remove last item
        streams.splice(pageSize, 1)
    }

    return {
        streams,
        hasNextPage,
        lastId: streams[streams.length - 1]?.id,
    }
}

export const getPagedStreams = async (
    chainId: number,
    first: number,
    lastId?: string,
    owner?: string,
    search?: string,
    orderBy = Stream_OrderBy.Id,
    orderDirection: OrderDirection = 'asc',
    { force = false } = {},
): Promise<TheGraphStreamResult> => {
    const orderOperator = orderDirection === 'asc' ? 'gt' : 'lt'

    const graphOrderDirection =
        orderDirection === 'asc' ? GraphOrderDirection.Asc : GraphOrderDirection.Desc

    let where: Stream_Filter = {
        permissions_: {
            stream_contains_nocase: search,
            userId: owner,
        },
        [`id_${orderOperator}`]: lastId,
    }

    where.permissions_ = omitBy(where.permissions_, isEmpty)
    where = omitBy(where, isEmpty)

    const {
        data: { streams },
    } = await getGraphClient(chainId).query<
        GetPagedStreamsQuery,
        GetPagedStreamsQueryVariables
    >({
        query: GetPagedStreamsDocument,
        variables: {
            first: first + 1,
            orderBy,
            orderDirection: graphOrderDirection,
            where,
        },
        fetchPolicy: force ? 'network-only' : void 0,
    })

    if (streams && streams.length > 0) {
        return prepareStreamResult(
            streams.map((s) => ({
                ...s,
                permissions: s.permissions?.map((p) => ({
                    ...p,
                    userAddress: p.userId, // We need to add this deprecated field for now
                })),
            })),
            first,
        )
    }

    return {
        streams: [],
        hasNextPage: false,
        lastId: null,
    }
}

export type IndexerStream = {
    id: string
    description: string | null | undefined
    peerCount: number | null | undefined
    messagesPerSecond: number | null | undefined
    subscriberCount: number | null | undefined
    publisherCount: number | null | undefined
}

export type IndexerResult = {
    streams: Array<IndexerStream>
    cursor: string | null | undefined
    hasNextPage: boolean
}

export const getStreamsOwnedBy = async (
    chainId: number,
    owner?: string,
    search?: string,
    onlyPublic?: boolean,
    { force = false } = {},
): Promise<TheGraphStream[]> => {
    const allOwnedStreams = await getPagedStreams(
        chainId,
        999,
        undefined,
        owner,
        search,
        Stream_OrderBy.Id,
        'asc',
        { force },
    )

    let result = allOwnedStreams.streams

    if (onlyPublic) {
        result = result.filter(
            (s) =>
                s.permissions.find(
                    (p) => p.userId.toLowerCase() === address0.toLowerCase(),
                ) != null,
        )
    }

    return result
}

export const checkIfStreamExists = async (
    chainId: number,
    potentialStreamId: string,
): Promise<boolean> => {
    const {
        data: { stream },
    } = await getGraphClient(chainId).query<
        GetStreamByIdQuery,
        GetStreamByIdQueryVariables
    >({
        query: GetStreamByIdDocument,
        variables: {
            streamId: potentialStreamId,
        },
        fetchPolicy: 'network-only',
    })
    return !!stream
}
