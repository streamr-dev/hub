import { z } from 'zod'
import config from '~/config/environments.toml'
import { defaultChainKey } from '~/consts'
import { getChainConfig } from '~/utils/chains'

const EnvironmentConfig = z
    .object({
        availableChains: z.array(z.string()).min(1),
        defaultChain: z.string().optional(),
        platformOriginUrl: z.string().optional().default('https://streamr.network'),
        streamrUrl: z.string().optional().default('https://streamr.network'),
    })
    .refine(
        ({ defaultChain, availableChains }) =>
            !defaultChain || availableChains.includes(defaultChain),
        'Default chain is not listed in the collection of available chains',
    )
    .transform(
        ({
            availableChains: symbolicChainNames,
            defaultChain: defaultSymbolicChainName,
            ...rest
        }) => {
            const availableChains = symbolicChainNames.map(getChainConfig)

            const defaultChain = defaultSymbolicChainName
                ? getChainConfig(defaultSymbolicChainName)
                : availableChains[0]

            return {
                ...rest,
                availableChains,
                defaultChain,
            }
        },
    )

type EnvironmentConfig = z.infer<typeof EnvironmentConfig>

const fallbackEnvironmentConfig: EnvironmentConfig = EnvironmentConfig.parse({
    availableChains: [defaultChainKey],
})

const parsedConfig = z
    .record(z.string(), z.union([EnvironmentConfig, z.undefined()]))
    .parse(config)

const { NODE_ENV: actualEnvironment = 'production' } = process.env as {
    NODE_ENV: string | undefined
}

export function getEnvironmentConfig() {
    const env =
        process.env.HUB_CONFIG_ENV ||
        (actualEnvironment === 'test' ? 'development' : actualEnvironment)

    const environmentConfig = parsedConfig[env]

    if (!environmentConfig) {
        return fallbackEnvironmentConfig
    }

    return environmentConfig
}
