import { getIndexerClient } from '~/getters/getGraphClient'
import {
    GetStreamsDocument,
    GetStreamsQuery,
    GetStreamsQueryVariables,
} from '../generated/gql/indexer'
import { getNeighbors } from './getNeighbors'

export const defaultStreamStats = {
    latency: undefined,
    messagesPerSecond: undefined,
    peerCount: undefined,
}

export const getStreamStats = async (streamId: string) => {
    const client = getIndexerClient(137)

    if (!client) {
        return defaultStreamStats
    }

    const {
        data: { streams },
    } = await client.query<GetStreamsQuery, GetStreamsQueryVariables>({
        query: GetStreamsDocument,
        variables: {
            streamIds: [streamId],
            first: 1,
        },
    })

    const [stream = undefined] = streams.items

    if (!stream) {
        return null
    }

    const { messagesPerSecond, peerCount } = stream

    const latency = await calculateLatencyForStream(streamId, 137)

    return {
        latency,
        messagesPerSecond,
        peerCount,
    }
}

export async function calculateLatencyForStream(streamId: string, chainId: number) {
    const neighbors = await getNeighbors({
        streamId,
        chainId,
    })

    const validRTTs = neighbors
        .map((n) => n.rtt)
        .filter((rtt): rtt is number => typeof rtt === 'number' && rtt > 0)

    // Calculate average one-way latency from neighbors with valid RTT.
    // Latency is the average RTT of neighbors in the stream, divided by 2.
    const latency =
        validRTTs.length > 0
            ? validRTTs.reduce((sum, rtt) => sum + rtt, 0) / validRTTs.length / 2
            : undefined

    return latency
}
