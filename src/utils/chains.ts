import { Chain, Config, config as configs } from '@streamr/config'
import { produce } from 'immer'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ethereumNetworks } from '~/shared/utils/constants'
import {
    ChainConfigExtension,
    fallbackChainConfigExtension,
    parsedChainConfigExtension,
} from '~/utils/chainConfigExtension'
import formatConfigUrl from './formatConfigUrl'

function getPreferredChainName(chainName: string) {
    if (/amoy/i.test(chainName)) {
        return 'amoy'
    }

    return chainName.toLowerCase()
}

function getChainConfigWithFallback(chainName: string): Chain {
    try {
        return getChainConfig(chainName)
    } catch (_) {}

    return getChainConfig('polygon')
}

export function getCurrentChain() {
    return getChainConfigWithFallback(
        new URLSearchParams(window.location.search).get('chain') || 'polygon',
    )
}

export function getCurrentChainId() {
    return getCurrentChain().id
}

export function useCurrentChain() {
    const chainName = useSearchParams()[0].get('chain') || 'polygon'

    return useMemo(() => getChainConfigWithFallback(chainName), [chainName])
}

export function useCurrentChainId() {
    return useCurrentChain().id
}

/**
 * @todo rename to `useCurrentSymbolicChainName`
 */
export function useCurrentChainSymbolicName() {
    return getSymbolicChainName(useCurrentChainId())
}

/**
 * @todo rename to `useCurrentFullChainName`.
 */
export function useCurrentChainFullName() {
    return getChainConfig(useCurrentChainId()).name
}

interface ChainEntry {
    config: Chain
    configExtension: ChainConfigExtension
    symbolicName: string
}

const chainEntriesByIdOrName: Partial<Record<string | number, ChainEntry | null>> = {}

function getChainEntry(chainIdOrName: string | number) {
    const key =
        typeof chainIdOrName === 'string'
            ? getPreferredChainName(chainIdOrName)
            : chainIdOrName

    let entry = chainEntriesByIdOrName[key]

    if (typeof entry === 'undefined') {
        entry = (() => {
            const source = Object.entries<Chain>(configs).find(([symbolicName, config]) =>
                typeof chainIdOrName === 'string'
                    ? getPreferredChainName(chainIdOrName) ===
                      getPreferredChainName(symbolicName)
                    : chainIdOrName === config.id,
            )

            if (!source) {
                return null
            }

            const [rawSymbolicName, config] = source

            const symbolicName = getPreferredChainName(rawSymbolicName)

            const configExtension =
                parsedChainConfigExtension[symbolicName] || fallbackChainConfigExtension

            const { dockerHost } = configExtension

            const sanitizedConfig = produce(config, (draft) => {
                draft.name = ethereumNetworks[config.id] || config.name

                for (const rpc of draft.rpcEndpoints) {
                    rpc.url = formatConfigUrl(rpc.url, {
                        dockerHost,
                    })
                }

                if (draft.entryPoints) {
                    for (const entrypoint of draft.entryPoints) {
                        entrypoint.websocket.host = formatConfigUrl(
                            entrypoint.websocket.host,
                            {
                                dockerHost,
                            },
                        )
                    }
                }

                if (draft.theGraphUrl) {
                    draft.theGraphUrl = formatConfigUrl(draft.theGraphUrl, { dockerHost })
                }
            })

            return {
                symbolicName,
                config: sanitizedConfig,
                configExtension,
            }
        })()

        chainEntriesByIdOrName[key] = entry
    }

    if (!entry) {
        throw new Error(
            `Could not find config for "${chainIdOrName}" (${
                typeof chainIdOrName === 'string' ? 'chain name' : 'chain id'
            })`,
        )
    }

    return entry
}

export function getChainConfig(chainIdOrSymbolicName: string | number): Chain {
    return getChainEntry(chainIdOrSymbolicName).config
}

export function getSymbolicChainName(chainId: number) {
    return getChainEntry(chainId).symbolicName
}

export function getChainConfigExtension(chainId: number) {
    return getChainEntry(chainId).configExtension
}
