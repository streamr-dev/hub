import { getIndexerClient } from '~/getters/getGraphClient'
import {
    GetStreamsDocument,
    GetStreamsQuery,
    GetStreamsQueryVariables,
} from '../generated/gql/indexer'

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

    return {
        latency: undefined as undefined | number,
        messagesPerSecond,
        peerCount,
    }
}
