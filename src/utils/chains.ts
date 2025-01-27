import { config as configs } from '@streamr/config'
import { produce } from 'immer'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    ChainConfigExtension,
    fallbackChainConfigExtension,
    parsedChainConfigExtension,
} from '~/utils/chainConfigExtension'
import { Chain } from '~/types'
import { ethereumNetworkDisplayName, defaultEthereumNetwork } from '~/shared/utils/constants'
import formatConfigUrl from './formatConfigUrl'

/**
 * @param chainNameOrId Chain name from displayNames or config (if string), or chainId (if number)
 * @returns Chain name as enumerated in @streamr/config, or default ("polygon" as of 2024) if not found
 */
function parseChainName(chainNameOrId: string | number): string {
    if (typeof chainNameOrId === 'string') {
        const nameFromConfig = Object.keys(configs).find(configChainName =>
            chainNameOrId.toLowerCase() === configChainName.toLowerCase()
        )
        const [chainIdString, _] = Object.entries(ethereumNetworkDisplayName).find(([_, displayName]) =>
            chainNameOrId.toLowerCase() == displayName.toLowerCase()
        ) ?? []
        const nameFromDisplayNames = Object.keys(configs).find(configChainName =>
            configs[configChainName].id.toString() === chainIdString
        )
        return nameFromConfig ?? nameFromDisplayNames ?? defaultEthereumNetwork
    } else {
        return Object.keys(configs).find(configChainName =>
            configs[configChainName].id === chainNameOrId
        ) ?? defaultEthereumNetwork
    }
}

function getChainConfigWithFallback(chainName: string): Chain {
    try {
        return getChainConfig(chainName)
    } catch (_) {}

    return getChainConfig(defaultEthereumNetwork)
}

export function getCurrentChain() {
    return getChainConfigWithFallback(
        new URLSearchParams(window.location.search).get('chain') || defaultEthereumNetwork,
    )
}

export function getCurrentChainId() {
    return getCurrentChain().id
}

export function useCurrentChain() {
    const chainName = useSearchParams()[0].get('chain') || defaultEthereumNetwork

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
    name: string
    config: Chain
    configExtension: ChainConfigExtension
}

const chainEntries: Record<string, ChainEntry | null> = {}

function getChainEntry(chainIdOrName: string | number): ChainEntry {
    const chainName = parseChainName(chainIdOrName)

    if (!(chainName in chainEntries)) {
        const config = configs[chainName]

        const configExtension =
            parsedChainConfigExtension[chainName] || fallbackChainConfigExtension

        const { dockerHost } = configExtension

        const sanitizedConfig = produce(config, (draft) => {
            draft.name = ethereumNetworkDisplayName[config.id] || config.name

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

        chainEntries[chainName] = {
            name: chainName,
            config: sanitizedConfig,
            configExtension,
        }
    }

    return chainEntries[chainName]!
}

export function getChainConfig(chainIdOrSymbolicName: string | number): Chain {
    return getChainEntry(chainIdOrSymbolicName).config
}

export function getSymbolicChainName(chainId: number) {
    return getChainEntry(chainId).name
}

export function getChainConfigExtension(chainId: number) {
    return getChainEntry(chainId).configExtension
}
