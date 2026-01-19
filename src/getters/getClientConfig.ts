import { StreamrClientConfig } from '@streamr/sdk'
import { getChainConfig } from '~/utils/chains'
import { getContractAddress } from '~/utils/contracts'
import { getGraphUrl } from './getGraphClient'

export default function getClientConfig(
    chainId: number,
    mods: any = {},
): StreamrClientConfig {
    const chainConfig = getChainConfig(chainId)

    const config: StreamrClientConfig = {
        metrics: false,
    }

    // Set network entrypoints if provided
    if (chainConfig.entryPoints && chainConfig.entryPoints.length > 0) {
        config.network = {
            controlLayer: {
                entryPoints: [...chainConfig.entryPoints],
            },
        }
    }

    config.contracts = {
        ethereumNetwork: {
            chainId,
        },
        rpcs: chainConfig.rpcEndpoints.map(rpc => ({ url: rpc.url })),
        streamRegistryChainAddress: getContractAddress('streamRegistry', chainId),
        streamStorageRegistryChainAddress: getContractAddress('streamStorage', chainId),
        theGraphUrl: getGraphUrl(chainId),
    }

    return {
        ...config,
        ...mods,
    }
}
