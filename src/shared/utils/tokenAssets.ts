import { getCoingeckoNetworkId } from '~/utils/chains'

const BASE_URL = 'https://streamr-public.s3.amazonaws.com/truswallet-assets/blockchains'

export const getTokenLogoUrl = (
    tokenContractAddress: string,
    chainId: number,
): string => {
    const networkId = getCoingeckoNetworkId(chainId)

    /**
     * For more details see:
     * https://api.coingecko.com/api/v3/asset_platforms
     */
    return `${BASE_URL}/${networkId}/assets/${tokenContractAddress}/logo.png`
}
