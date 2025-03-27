import { produce } from 'immer'
import { useEffect } from 'react'
import { create } from 'zustand'
import { Minute } from '~/consts'
import { Heartbeat } from '~/hooks/useInterceptHeartbeats'

const TTL = Minute

interface Probe {
    updatedAt: number
    reachable: boolean
    pending: boolean
}

const useOperatorReachabilityStore = create<{
    probes: Record<string, Probe | undefined>
    nodes: Record<string, string | undefined>
    probe: (nodeId: string, heartbeat: Heartbeat) => Promise<void>
}>((set, get) => {
    function updateProbe(url: string, fn: (probe: Probe) => Probe | void) {
        set((store) =>
            produce(store, ({ probes }) => {
                const updatedAt = Date.now()

                probes[url] = produce(
                    Object.assign(probes[url] || { reachable: false, pending: false }, {
                        updatedAt,
                    }),
                    fn,
                )
            }),
        )
    }

    return {
        nodes: {},

        probes: {},

        async probe(nodeId, heartbeat) {
            const { host, port, tls = false } = heartbeat.websocket || {}

            const url = host && port ? `${tls ? 'wss:' : 'ws:'}//${host}:${port}` : ''

            set((store) =>
                produce(store, (draft) => {
                    /**
                     * Heartbeats for a single node can carry different WebSocket URLs
                     * over time, cause c'est la vie.
                     */
                    draft.nodes[nodeId] = url
                }),
            )

            const { updatedAt = 0, pending = false } = get().probes[url] || {}

            if (pending || updatedAt + TTL >= Date.now()) {
                /**
                 * Ignore cache hits and pending probes. Note that we probe based
                 * on WebSocket URLs not on node addresses. We support the unlikely
                 * but technically possible scenario where nodes share a URL.
                 */
                return
            }

            updateProbe(url, (draft) => {
                draft.pending = true
            })

            let reachable = false

            let ws: WebSocket | undefined

            try {
                reachable = await new Promise<boolean>((resolve) => {
                    /**
                     * @todo Attempt the wss connections to the declared endpoints
                     * for verification.
                     */
                    resolve(tls && !!port && !!host && !isIPAddress(host))
                })
            } finally {
                ws?.close()

                ws = undefined

                updateProbe(url, (draft) => {
                    Object.assign(draft, {
                        pending: false,
                        reachable,
                    })
                })
            }
        },
    }
})

export type Reachability = 'probing' | [number, number]

export function useOperatorReachability(
    heartbeats: Record<string, Heartbeat | undefined>,
): Reachability {
    const { probe, nodes, probes } = useOperatorReachabilityStore()

    useEffect(() => {
        Object.entries(heartbeats).forEach(([nodeId, heartbeat]) => {
            if (!heartbeat) {
                return
            }

            void (async () => {
                try {
                    await probe(nodeId, heartbeat)
                } catch (e) {
                    console.warn(
                        `Failed to probe WebSocket URL for node "${nodeId}"`,
                        heartbeat,
                        e,
                    )
                }
            })()
        })
    }, [heartbeats, probe])

    const nodeIds = Object.keys(heartbeats)

    let numOfReachableNodes = 0

    for (const nodeId of nodeIds) {
        const { reachable = false, pending = false } = probes[nodes[nodeId] || ''] || {}

        if (pending) {
            /**
             * At least one node is being probbed and that's all we can tell
             * about the collective.
             */
            return 'probing'
        }

        if (reachable) {
            numOfReachableNodes += 1
        }
    }

    return [numOfReachableNodes, nodeIds.length]
}

export function useIsNodeIdReachable(nodeId: string) {
    const { nodes, probes } = useOperatorReachabilityStore()

    const { reachable = false, pending = false } = probes[nodes[nodeId] || ''] || {}

    return pending ? 'pending' : reachable
}

const IPv4RegExp =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/

const IPv6RegExp =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4}:){1,7}:|:([0-9a-fA-F]{1,4}:){1,7}|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$/

function isIPAddress(value: string): boolean {
    return IPv4RegExp.test(value) || IPv6RegExp.test(value)
}
