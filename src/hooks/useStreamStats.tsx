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
                    // Take the maximum latency among all streams
                    latency: Math.max(
                        acc.latency ?? -Infinity,
                        curr.latency ?? -Infinity
                    ) === -Infinity ? undefined : Math.max(
                        acc.latency ?? -Infinity,
                        curr.latency ?? -Infinity
                    ),
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
