import { getIndexerClient } from '~/getters/getGraphClient'
import {
    GetNeighborsDocument,
    GetNeighborsQuery,
    GetNeighborsQueryVariables,
} from '../generated/gql/indexer'

interface GetNeighborsParams {
    node?: string
    streamId?: string
    streamPartitionId?: string
    chainId: number
}

interface Neighbour {
    nodeId0: string
    nodeId1: string
    streamPartitionId: string
    rtt?: number
}

export async function getNeighbors(params: GetNeighborsParams): Promise<Neighbour[]> {
    const pageSize = 1000

    const { node, streamId, streamPartitionId, chainId } = params

    const items: Neighbour[] = []

    const uniquenessGate: Record<string, true> = {}

    let cursor = '0'

    for (;;) {
        const client = getIndexerClient(chainId)

        if (!client) {
            console.error('Could not get indexer client for chainId', chainId)
            break
        }

        const {
            data: { neighbors },
        } = await client.query<GetNeighborsQuery, GetNeighborsQueryVariables>({
            fetchPolicy: 'network-only',
            query: GetNeighborsDocument,
            variables: {
                cursor,
                node,
                pageSize,
                streamId,
                streamPart: streamPartitionId,
            },
        })

        for (const {
            nodeId1: a,
            nodeId2: b,
            streamPartId: finalStreamPartitionId,
            rtt,
        } of neighbors.items) {
            const pair = [a, b].sort() as [string, string]

            const key = pair.join('-')

            if (uniquenessGate[key]) {
                continue
            }

            uniquenessGate[key] = true

            const [nodeId0, nodeId1] = pair

            items.push({
                nodeId0,
                nodeId1,
                streamPartitionId: finalStreamPartitionId,
                rtt: rtt ?? undefined,
            })
        }

        if (!neighbors.cursor || neighbors.cursor === cursor) {
            break
        }

        cursor = neighbors.cursor
    }

    return items
}
