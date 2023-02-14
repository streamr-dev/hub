import getCoreConfig from '$app/src/getters/getCoreConfig'
import { post } from '$shared/utils/api'

export type IndexerStream = {
    id: string,
    description: string,
    peerCount: number,
    messagesPerSecond: number,
    subscriberCount: number | null,
    publisherCount: number | null,
}

export type IndexerResult = {
    items: Array<IndexerStream>,
    cursor: string,
}

export const getStreamsFromIndexer = async (first: number, cursor?: string, owner?: string, search?: string): Promise<IndexerResult> => {
    const { streamIndexerUrl } = getCoreConfig()

    const ownerFilter = owner != null ? `owner: "${owner}"` : null
    const searchFilter = search != null ? `searchTerm: "${search}"` : null
    const cursorFilter = cursor != null ? `cursor: "${cursor}"` : null
    const allFilters = [ownerFilter, searchFilter, cursorFilter].join(',')

    const result = await post({
        url: streamIndexerUrl,
        data: {
            query: `
                {
                    streams(
                        pageSize: ${first},
                        ${allFilters},
                    ) {
                        items {
                          id
                          description
                          peerCount
                          messagesPerSecond
                          subscriberCount
                          publisherCount
                        }
                        cursor
                    }
                }
            `,
        },
        useAuthorization: false,
    })

    return result.data.streams
}

export type GlobalStreamStats = {
    streamCount: number,
    messagesPerSecond: number,
}

export const getGlobalStatsFromIndexer = async (): Promise<GlobalStreamStats> => {
    const { streamIndexerUrl } = getCoreConfig()

    const result = await post({
        url: streamIndexerUrl,
        data: {
            query: `
                {
                    summary {
                        streamCount
                        messagesPerSecond
                    }
                }
            `,
        },
        useAuthorization: false,
    })

    return result.data.summary
}
