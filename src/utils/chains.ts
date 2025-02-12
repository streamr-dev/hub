import { Chain, ChainKey, config as configs } from '@streamr/config'
import { produce } from 'immer'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { defaultChainKey } from '~/consts'
import {
    ChainConfigExtension,
    fallbackChainConfigExtension,
    parsedChainConfigExtension,
} from '~/utils/chainConfigExtension'
import formatConfigUrl from './formatConfigUrl'

const lowerCasedChainKeyToChainKeyMap: Record<string, ChainKey | null | undefined> = {}

interface GetChainKeyOptions {
    failOnNotFound?: boolean
}

/**
 * @param candidate Chain key or chain slug (from config extension) or chain number. Defaults
 * to the default chain key (currently 'polygon').
 */
export function getChainKey(
    candidate: string | number,
    { failOnNotFound = false }: GetChainKeyOptions = {},
): ChainKey {
    const key = typeof candidate === 'number' ? candidate : candidate.toLowerCase()

    if (lowerCasedChainKeyToChainKeyMap[key] === null) {
        if (failOnNotFound) {
            throw new Error('ChainKey not found')
        }

        return defaultChainKey
    }

    if (lowerCasedChainKeyToChainKeyMap[key]) {
        return lowerCasedChainKeyToChainKeyMap[key]
    }

    for (const chainKey in configs) {
        if (!isChainKey(chainKey)) {
            continue
        }

        if (typeof key === 'number') {
            if (configs[chainKey].id === key) {
                lowerCasedChainKeyToChainKeyMap[key] = chainKey

                return chainKey
            }

            continue
        }

        if (chainKey.toLowerCase() === key) {
            lowerCasedChainKeyToChainKeyMap[key] = chainKey

            return chainKey
        }

        const slug = parsedChainConfigExtension[chainKey]?.slug?.toLowerCase()

        if (key === slug) {
            lowerCasedChainKeyToChainKeyMap[key] = chainKey

            return chainKey
        }
    }

    console.warn(
        `Could not find a proper chain key for "${candidate}". Using default key (${defaultChainKey}).`,
    )

    lowerCasedChainKeyToChainKeyMap[key] = null

    if (failOnNotFound) {
        throw new Error('ChainKey not found')
    }

    return defaultChainKey
}

export function getCurrentChain(): Chain {
    return getChainConfig(
        new URLSearchParams(window.location.search).get('chain') || defaultChainKey,
    )
}

export function getCurrentChainId(): number {
    return getCurrentChain().id
}

export function useCurrentChain(): Chain {
    const chainName = useSearchParams()[0].get('chain') || defaultChainKey

    return useMemo(() => getChainConfig(chainName), [chainName])
}

export function useCurrentChainId(): number {
    return useCurrentChain().id
}

export function useCurrentChainKey(): ChainKey {
    return getChainKey(useCurrentChainId())
}

/**
 * @todo rename to `useCurrentFullChainName`.
 */
export function useCurrentChainFullName(): string {
    return getChainDisplayName(useCurrentChainId())
}

interface ChainEntry {
    config: Chain
    configExtension: ChainConfigExtension
    chainKey: ChainKey
}

const chainKeyToChainEntryMap: Partial<Record<ChainKey, ChainEntry | null>> = {}

function getChainEntry(chainKey: ChainKey): ChainEntry {
    if (chainKeyToChainEntryMap[chainKey]) {
        return chainKeyToChainEntryMap[chainKey]
    }

    const config: Chain = configs[chainKey]

    const configExtension =
        parsedChainConfigExtension[chainKey] || fallbackChainConfigExtension

    const { dockerHost } = configExtension

    const sanitizedConfig = produce(config, (draft) => {
        for (const rpc of draft.rpcEndpoints) {
            rpc.url = formatConfigUrl(rpc.url, {
                dockerHost,
            })
        }

        if (draft.entryPoints) {
            for (const entrypoint of draft.entryPoints) {
                entrypoint.websocket.host = formatConfigUrl(entrypoint.websocket.host, {
                    dockerHost,
                })
            }
        }

        if (draft.theGraphUrl) {
            draft.theGraphUrl = formatConfigUrl(draft.theGraphUrl, { dockerHost })
        }
    })

    const entry: ChainEntry = {
        chainKey,
        config: sanitizedConfig,
        configExtension,
    }

    chainKeyToChainEntryMap[chainKey] = entry

    return entry
}

export function getChainConfig(chainIdOrChainKey: string | number): Chain {
    return getChainEntry(getChainKey(chainIdOrChainKey)).config
}

export function getChainConfigExtension(chainId: number): ChainConfigExtension {
    return getChainEntry(getChainKey(chainId)).configExtension
}

export function getChainSlug(chainIdOrChainKey: ChainKey | number): string {
    const chainEntry = getChainEntry(getChainKey(chainIdOrChainKey))

    return chainEntry.configExtension.slug || chainEntry.chainKey
}

/**
 * Checks if a given string is a `ChainKey`.
 * @param candidate Any string.
 * @returns `true` if the given string is config's own key.
 */
export function isChainKey(candidate: string): candidate is ChainKey {
    return Object.prototype.hasOwnProperty.call(configs, candidate)
}

export function getChainDisplayName(chainIdOrChainKey: ChainKey | number): string {
    const { config, configExtension } = getChainEntry(getChainKey(chainIdOrChainKey))

    return configExtension.displayName || config.name
}

export function getMarketplaceChainConfigs(
    chainIdOrChainKey: ChainKey | number,
): Chain[] {
    const marketplaceChainKeys = getChainEntry(getChainKey(chainIdOrChainKey))
        .configExtension.marketplaceChains

    const result: Chain[] = []

    for (const key of marketplaceChainKeys) {
        if (isChainKey(key)) {
            result.push(getChainConfig(key))
        }
    }

    return result
}

export function getCoingecoNetworkId(chainIdOrChainKey: ChainKey | number) {
    const { config, configExtension } = getChainEntry(getChainKey(chainIdOrChainKey))

    return configExtension.coingeckoNetworkId || config.name
}
