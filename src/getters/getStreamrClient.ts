import getClientConfig from '~/getters/getClientConfig'
import { getWalletProvider } from '~/shared/stores/wallet'
import networkPreflight from '~/utils/networkPreflight'

interface GetClientOptions {
    transactional?: boolean
}

export async function getStreamrClientInstance(
    chainId: number,
    options: GetClientOptions = {},
) {
    const StreamrClient = await getStreamrClient()

    const { transactional = false } = options

    if (!transactional) {
        return new StreamrClient(getClientConfig(chainId))
    }

    const ethereum = (await getWalletProvider()) as any

    await networkPreflight(chainId)

    return new StreamrClient(
        getClientConfig(chainId, {
            auth: {
                ethereum,
            },
        }),
    )
}

/**
 * Returns StreamrClient class.
 */
async function getStreamrClient() {
    const { StreamrClient } = await import('@streamr/sdk')
    return StreamrClient
}

// Load the client library proactively so that we don't have to wait later.
void (async () => {
    try {
        await getStreamrClient()
    } catch (_) {
        // Do nothing.
    }
})
