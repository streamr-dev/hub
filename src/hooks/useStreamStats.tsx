import { useQuery } from '@tanstack/react-query'
import { getStreamStats } from '~/getters/getStreamStats'

type StreamStats = {
    latency: number | undefined
    messagesPerSecond: number
    peerCount: number
}

export function useStreamStatsQuery(streamId: string) {
    return useQuery({
        queryKey: ['useStreamStatsQuery', streamId],
        queryFn: async () => {
            return getStreamStats(streamId)
        },
    })
}

export function useMultipleStreamStatsQuery(streamIds: string[]) {
    return useQuery({
        queryKey: ['useMultipleStreamStatsQuery', streamIds],
        queryFn: async () => {
            const stats = (await Promise.all(
                streamIds.map(getStreamStats),
            )) as StreamStats[]
            return stats.reduce(
                (acc: StreamStats, curr: StreamStats) => ({
                    // For latency, we can take the average of non-undefined values
                    latency:
                        acc.latency === undefined && curr.latency === undefined
                            ? undefined
                            : ((acc.latency || 0) + (curr.latency || 0)) /
                              (acc.latency !== undefined && curr.latency !== undefined
                                  ? 2
                                  : 1),
                    messagesPerSecond: acc.messagesPerSecond + curr.messagesPerSecond,
                    peerCount: acc.peerCount + curr.peerCount,
                }),
                {
                    latency: undefined,
                    messagesPerSecond: 0,
                    peerCount: 0,
                },
            )
        },
    })
}
