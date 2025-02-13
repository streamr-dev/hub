import { QueryClient } from '@tanstack/react-query'
import React from 'react'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { StreamGptApiUrl } from '~/consts'
import { ParseError } from '~/errors'
import { getProjectRegistryContract } from '~/getters'
import {
    invalidateActiveOperatorByIdQueries,
    invalidateAllOperatorsQueries,
    invalidateDelegationsForWalletQueries,
} from '~/hooks/operators'
import { operatorModal } from '~/modals/OperatorModal'
import { Operator } from '~/parsers/Operator'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import Toast, { ToastType } from '~/shared/toasts/Toast'
import { ProjectType } from '~/shared/types'
import getNativeTokenName from '~/shared/utils/nativeToken'
import { requirePositiveBalance } from '~/shared/utils/requirePositiveBalance'
import { Layer } from '~/utils/Layer'
import { onIndexedBlock } from '~/utils/blocks'
import { BNish, toBN } from '~/utils/bn'
import { getPublicProvider } from '~/utils/providers'

/**
 * Gas money checker.
 * @param chainId Chain id.
 * @param account Account address.
 * @param options.recover If `true`, the function will pop up a "try
 * again" toast on failure. Default: `false`.
 * @throws `InsufficientFundsError` if the balance turns out to be 0.
 */
export async function ensureGasMonies(
    chainId: number,
    account: string,
    { recover = false }: { recover?: boolean } = {},
) {
    while (true) {
        try {
            await requirePositiveBalance(chainId, account)

            break
        } catch (e) {
            if (recover && e instanceof InsufficientFundsError) {
                const tokenName = getNativeTokenName(chainId)

                try {
                    await toaster(Toast, Layer.Toast).pop({
                        title: 'Not enough tokens',
                        type: ToastType.Warning,
                        desc: (
                            <p>
                                You need {tokenName} for gas. Get some
                                <br />
                                and try again.
                            </p>
                        ),
                        okLabel: 'Try again',
                        cancelLabel: 'Cancel',
                    })

                    continue
                } catch (_) {
                    throw e
                }
            }

            throw e
        }
    }
}

/**
 * Scouts for the `Subscribed` event associated with the Project Registry contract
 * and explodes if it can't find one after given number of tries.
 * @param chainId The chain id related to the purchase.
 * @param projectId Project id.
 * @param account Account who made the purchase.
 * @param options.attempts Number of tries (with 3s delay between each).
 * @returns Nothing important. Watch for 'splosions tho.
 */
export async function waitForPurchasePropagation(
    chainId: number,
    projectId: string,
    account: string,
    { attempts = 30 }: { attempts?: number } = {},
) {
    const provider = await getPublicProvider(chainId)

    const contract = getProjectRegistryContract({ chainId, provider })

    // Take a couple of blocks back to be sure.
    const fromBlock = (await provider.getBlockNumber()) - 10

    for (let i = 0; i < attempts; i++) {
        const events = await contract.queryFilter(
            contract.filters.Subscribed(projectId, account),
            fromBlock,
            'latest',
        )

        if (events.length) {
            return
        }

        await sleep(3000)
    }

    throw new Error('Finding `Subscribed` event timed out')
}

export function isProjectOwnedBy<
    T extends { userAddress: unknown; canGrant?: boolean | null | undefined }[],
>(permissions: T, address: string) {
    const { canGrant = false } =
        permissions.find(
            ({ userAddress }) =>
                typeof userAddress === 'string' &&
                userAddress.toLowerCase() === address.toLowerCase(),
        ) || {}

    return !!canGrant
}

/**
 * Returns a promise that resolves after a given number
 * of milliseconds. Uses `setTimeout` internally.
 */
export async function sleep(millis: number) {
    await new Promise((resolve) => void setTimeout(resolve, millis))
}

/**
 * Takes the user back in history, but only if they've already navigated
 * somewhere within the app.
 * @param options.onBeforeNavigate Optional callback triggered right before
 * the actual step back. It does not get triggered if we can't take
 * the step.
 */
export function goBack(options: { onBeforeNavigate?: () => void } = {}) {
    const backable = z
        .object({ idx: z.number().min(1) })
        .safeParse(window.history.state).success

    if (!backable) {
        return
    }

    options.onBeforeNavigate?.()

    window.history.back()
}

let queryClient: QueryClient | undefined

/**
 * Returns the global QueryClient.
 */
export function getQueryClient() {
    if (!queryClient) {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    throwOnError: (error) => error instanceof ParseError,
                },
            },
        })
    }

    return queryClient
}

const SiSymbol = ['', 'k', 'M', 'G', 'T', 'P']

function defaultFractionLength(integral: string): number {
    return integral.length < 7 ? 2 : 3
}

interface AbbrOptions {
    stripFractionalZeros?: boolean
    fractionalLength?: number | ((integral: string) => number)
}

/**
 * Abbreviates BigNumberish value.
 */
export function abbr(value: BNish, options: AbbrOptions = {}) {
    const { fractionalLength = defaultFractionLength, stripFractionalZeros = true } =
        options

    const v = toBN(value).dp(
        typeof fractionalLength === 'number' ? Math.max(0, fractionalLength) + 1 : 10,
    )

    if (!v.isFinite()) {
        console.warn('Invalid value', v.toString())

        throw new Error('Invalid value')
    }

    const sign = v.isLessThan(0) ? '-' : ''

    let [integral, fractional = ''] = v.abs().toString().split('.')

    const fracLength = Math.max(
        0,
        typeof fractionalLength === 'function'
            ? fractionalLength(integral)
            : fractionalLength,
    )

    fractional = `${fractional}${[...Array(fracLength)].map(() => '0').join('')}`

    let size = 0

    /**
     * Rebalance the dot and determine what suffix to use by moving digits from
     * integral part to fractional part.
     */
    while (integral.length > 3 && size < SiSymbol.length - 1) {
        fractional = `${integral.substring(integral.length - 3)}${fractional}`

        integral = integral.substring(0, integral.length - 3)

        size++
    }

    let frac = fractional.substring(0, fracLength)

    if (stripFractionalZeros) {
        frac = frac.replace(/0+$/, '')
    }

    return `${sign}${integral}${frac && `.${frac}`}${SiSymbol[size]}`
}

/**
 * A function that takes the user through the process of creating
 * an operator or updating an existing operator.
 */
export function saveOperator(
    chainId: number,
    operator: Operator | undefined,
    options: {
        onDone?: (operatorId: string, blockNumber: number) => void
        onError?: (error: unknown) => void
    } = {},
) {
    void (async () => {
        try {
            const { operatorId, blockNumber } = await operatorModal.pop({
                chainId,
                operator,
            })

            invalidateActiveOperatorByIdQueries(chainId, operatorId)

            invalidateAllOperatorsQueries(chainId)

            invalidateDelegationsForWalletQueries(chainId)

            options.onDone?.(operatorId, blockNumber)
        } catch (e) {
            if (options.onError) {
                options.onError(e)
            } else {
                console.warn('Failed to save an operator', e)
            }
        }
    })()
}

/**
 * Returns a promise that resolves when the Graph indexes all blocks
 * to a given block height.
 */
export function waitForIndexedBlock(chainId: number, blockNumber: number) {
    return new Promise<void>((resolve) => {
        onIndexedBlock(chainId, blockNumber, resolve)
    })
}

/**
 * Determines if a given argument is a project type.
 */
export function isProjectType(arg: unknown): arg is ProjectType {
    return (
        arg === ProjectType.DataUnion ||
        arg === ProjectType.OpenData ||
        arg === ProjectType.PaidData
    )
}

/**
 * Returns URL of the StreamGPT for the given path.
 */
export function getStreamGptApiUrl(path: string) {
    return `${StreamGptApiUrl}${path}`
}
