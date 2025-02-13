import { produce } from 'immer'
import { isAddress } from 'web3-validator'
import { z } from 'zod'
import config from '~/config/chains.toml'
import formatConfigUrl from '~/utils/formatConfigUrl'

const ChainConfigExtension = z.object({
    coingeckoNetworkId: z.string().optional(),
    dataUnionJoinServerUrl: z.string().optional(),
    dataunionGraphNames: z
        .array(
            z.object({
                chainId: z.number(),
                name: z.string(),
            }),
        )
        .optional()
        .default([]),
    displayName: z.string().optional(),
    dockerHost: z.string().optional(),
    ipfs: z
        .object({
            apiSecretKey: z.string(),
            ipfsGatewayUrl: z.string(),
            ipfsUploadEndpoint: z.string(),
            projectId: z.string(),
        })
        .optional()
        .default({
            apiSecretKey: 'c39492773b28820c8b3654178bf26946',
            ipfsGatewayUrl: 'https://streamr-hub.infura-ipfs.io/ipfs/',
            ipfsUploadEndpoint: 'https://ipfs.infura.io:5001/api/v0/add',
            projectId: '2KjYUpR265h6R5M5njkSue5RGm7',
        }),
    marketplaceChains: z.array(z.string()).optional().default([]),
    networkSubgraphUrl: z.string().optional(),
    slug: z.string().optional(),
    sponsorshipPaymentToken: z.string().optional().default('DATA'),
    storageNodes: z
        .array(
            z.object({
                name: z.string(),
                address: z.string().refine(isAddress, 'Invalid storage node address'),
                thirdPartyUrl: z.string().optional(),
            }),
        )
        .optional()
        .default([]),
    streamIndexerUrl: z.string().optional(),
})

export type ChainConfigExtension = z.infer<typeof ChainConfigExtension>

export const fallbackChainConfigExtension: ChainConfigExtension =
    ChainConfigExtension.parse({})

export const parsedChainConfigExtension = z
    .record(z.string(), z.union([ChainConfigExtension, z.undefined()]))
    .transform((value) =>
        produce(value, (draft) => {
            Object.values(draft).forEach(function dockerizeUrls(extension) {
                if (!extension) {
                    return
                }

                const {
                    dataUnionJoinServerUrl,
                    dockerHost,
                    networkSubgraphUrl,
                    streamIndexerUrl,
                } = extension

                if (networkSubgraphUrl) {
                    extension.networkSubgraphUrl = formatConfigUrl(networkSubgraphUrl, {
                        dockerHost,
                    })
                }

                if (typeof dataUnionJoinServerUrl === 'string') {
                    extension.dataUnionJoinServerUrl = formatConfigUrl(
                        dataUnionJoinServerUrl,
                        {
                            dockerHost,
                        },
                    )
                }

                if (typeof streamIndexerUrl === 'string') {
                    extension.streamIndexerUrl = formatConfigUrl(streamIndexerUrl, {
                        dockerHost,
                    })
                }
            })
        }),
    )
    .parse(config)
