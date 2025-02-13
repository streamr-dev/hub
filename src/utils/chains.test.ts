import { config } from '@streamr/config'
import { defaultChainKey } from '../consts'
import { parsedChainConfigExtension } from './chainConfigExtension'
import {
    getChainDisplayName,
    getChainKey,
    getMarketplaceChainConfigs,
    isChainKey,
} from './chains'

describe('getChainKey', () => {
    it('defaults to the default chain key', () => {
        expect(getChainKey('whatever')).toEqual(defaultChainKey)

        expect(getChainKey(0)).toEqual(defaultChainKey)
    })

    it('extracts chain key by slug', () => {
        expect(getChainKey('amoy')).toEqual('polygonAmoy')
    })

    it('is case insensitive', () => {
        expect(getChainKey('AMOY')).toEqual('polygonAmoy')

        expect(getChainKey('POlyGON')).toEqual('polygon')

        expect(getChainKey('polygonamoy')).toEqual('polygonAmoy')
    })

    it('resolves a number to a chain key', () => {
        expect(getChainKey(137)).toEqual('polygon')

        expect(getChainKey(100)).toEqual('gnosis')
    })
})

describe('isChainKey', () => {
    it('correctly identifies chain keys', () => {
        expect(isChainKey('whatever')).toBe(false)

        expect(isChainKey('polygon')).toBe(true)

        expect(isChainKey('gnosis')).toBe(true)
    })
})

describe('getChainDisplayName', () => {
    it('used custom naming for chains that we provide it for', () => {
        // Local config extension provides a custom value
        expect(parsedChainConfigExtension['polygonAmoy']?.displayName).toEqual('Amoy')

        // Config provides a diffrent value
        expect(config.polygonAmoy.name).not.toEqual('Amoy')

        // Ultimately local name counts
        expect(getChainDisplayName('polygonAmoy')).toEqual('Amoy')
    })
})

describe('getMarketplaceChainConfigs', () => {
    it('gives a list of configs for given keys', () => {
        const [config0, config1, config2] = getMarketplaceChainConfigs('polygon')

        expect(config0.id).toEqual(config.gnosis.id)

        expect(config1.id).toEqual(config.polygon.id)

        expect(config2).toBeUndefined()
    })

    it('gives an empty list of configs if there are no marketplace chain keys provided', () => {
        expect(getMarketplaceChainConfigs('ethereum').length).toEqual(0)
    })
})
