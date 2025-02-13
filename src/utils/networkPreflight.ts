import { toaster } from 'toasterhea'
import SwitchNetworkModal from '~/modals/SwitchNetworkModal'
import { getWalletProvider } from '~/shared/stores/wallet'
import { Layer } from '~/utils/Layer'
import { getChainConfig, getChainDisplayName } from '~/utils/chains'
import getChainId from '~/utils/web3/getChainId'

/**
 *
 * @param expectedChainId Expected network/chain ID, e.g. 137 for Polygon.
 * @returns `true` if the utility changed the network, and `false` if it did nothing (we're already on the correct network).
 */
export default async function networkPreflight(expectedChainId: number) {
    const provider = await getWalletProvider()

    try {
        const actualChainId = await getChainId()

        if (actualChainId === expectedChainId) {
            return false
        }

        await toaster(SwitchNetworkModal, Layer.Modal).pop({
            expectedChainId,
            actualChainId,
        })

        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: `0x${expectedChainId.toString(16)}`,
                },
            ],
        })
    } catch (e: any) {
        if (e?.code !== 4902) {
            throw e
        }

        const chainConfig = getChainConfig(expectedChainId)

        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: `0x${chainConfig.id.toString(16)}`,
                    chainName: getChainDisplayName(chainConfig.id),
                    rpcUrls: chainConfig.rpcEndpoints.map(({ url }) => url),
                    nativeCurrency: chainConfig.nativeCurrency,
                    blockExplorerUrls: [chainConfig.blockExplorerUrl].filter(
                        Boolean,
                    ) as string[],
                },
            ],
        })
    }

    return true
}
