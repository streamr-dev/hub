import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import { toaster } from 'toasterhea'
import { isAddress } from 'web3-validator'
import { Minute } from '~/consts'
import {
    Operator as GraphOperator,
    Operator_OrderBy,
    OrderDirection,
} from '~/generated/gql/network'
import {
    getAllOperators,
    getOperatorById,
    getOperatorsByDelegation,
    getOperatorsByDelegationAndId,
    getOperatorsByDelegationAndMetadata,
    getParsedOperators,
    getParsedOperatorsByOwnerOrControllerAddress,
    searchOperatorsByMetadata,
} from '~/getters'
import { confirm } from '~/getters/confirm'
import { getSponsorshipTokenInfo } from '~/getters/getSponsorshipTokenInfo'
import { useRequestedBlockNumber } from '~/hooks'
import { invalidateSponsorshipQueries } from '~/hooks/sponsorships'
import DelegateFundsModal from '~/modals/DelegateFundsModal'
import { forceUndelegateModal } from '~/modals/ForceUndelegateModal'
import { undelegateFundsModal } from '~/modals/UndelegateFundsModal'
import { Operator } from '~/parsers/Operator'
import {
    getOperatorDelegationAmount,
    processOperatorUndelegationQueue,
} from '~/services/operators'
import { collectEarnings } from '~/services/sponsorships'
import { flagKey, useFlagger, useIsFlagged } from '~/shared/stores/flags'
import { useUncollectedEarningsStore } from '~/shared/stores/uncollectedEarnings'
import { getSigner } from '~/shared/stores/wallet'
import { truncate } from '~/shared/utils/text'
import { DelegationsStats } from '~/types'
import { getQueryClient, waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import { getBalance } from '~/utils/balance'
import { useCurrentChainId } from '~/utils/chains'
import { getContractAddress } from '~/utils/contracts'
import { Break, FlagBusy } from '~/utils/errors'
import { isRejectionReason, isTransactionRejection } from '~/utils/exceptions'
import { successToast } from '~/utils/toast'

export function useOperatorForWalletQuery(address = '') {
    const currentChainId = useCurrentChainId()

    return useQuery({
        queryKey: ['useOperatorForWalletQuery', currentChainId, address.toLowerCase()],
        queryFn: async () => {
            const allOperators = await getParsedOperatorsByOwnerOrControllerAddress(
                currentChainId,
                address,
                {
                    force: true,
                },
            )

            if (allOperators.length > 0) {
                return allOperators[0]
            }

            return null
        },
    })
}

export function useAllOperatorsForWalletQuery(address = '') {
    const currentChainId = useCurrentChainId()

    return useQuery({
        queryKey: [
            'useAllOperatorsForWalletQuery',
            currentChainId,
            address.toLowerCase(),
        ],
        queryFn: () =>
            getParsedOperatorsByOwnerOrControllerAddress(currentChainId, address, {
                force: true,
            }),
    })
}

export function useOperatorByIdQuery(operatorId = '') {
    const currentChainId = useCurrentChainId()

    const minBlockNumber = useRequestedBlockNumber()

    return useQuery({
        queryKey: ['operatorByIdQueryKey', currentChainId, operatorId, minBlockNumber],
        async queryFn() {
            if (!operatorId) {
                return null
            }

            const operator = await getOperatorById(currentChainId, operatorId, {
                force: true,
                minBlockNumber,
            })

            if (operator) {
                return Operator.parse(operator, currentChainId)
            }

            return null
        },
        placeholderData: keepPreviousData,
        retry: false,
        staleTime: Minute,
    })
}

export function invalidateActiveOperatorByIdQueries(
    chainId: number,
    operatorId: string | undefined,
) {
    if (operatorId) {
        return getQueryClient().invalidateQueries({
            queryKey: ['operatorByIdQueryKey', chainId, operatorId],
            exact: false,
            refetchType: 'active',
        })
    }

    return getQueryClient().invalidateQueries({
        queryKey: ['operatorByIdQueryKey', chainId],
        exact: false,
        refetchType: 'active',
    })
}

export function useOperatorStatsForWallet(address = '') {
    const { data: operator = null } = useOperatorForWalletQuery(address)

    if (!operator) {
        return operator
    }

    const {
        delegatorCount: numOfDelegators,
        valueWithoutEarnings: value,
        stakes,
    } = operator

    return {
        numOfDelegators,
        numOfSponsorships: stakes.length,
        value,
    }
}

/**
 * @todo Refactor using `useQuery`.
 */
export function useDelegationsStats(address = '') {
    const [stats, setStats] = useState<DelegationsStats | undefined | null>()

    const addr = address.toLowerCase()

    const chainId = useCurrentChainId()

    useEffect(() => {
        /**
         * @todo Refactor using useQuery. #refactor
         */

        let mounted = true

        if (!addr) {
            setStats(null)

            return () => {}
        }

        setStats(undefined)

        setTimeout(async () => {
            const operators = await getParsedOperators(
                () =>
                    getOperatorsByDelegation({
                        chainId,
                        first: 1000,
                        address: addr,
                    }) as Promise<GraphOperator[]>,
                {
                    chainId,
                },
            )

            if (!mounted) {
                return
            }

            if (!operators.length) {
                return void setStats({
                    value: 0n,
                    minApy: 0,
                    maxApy: 0,
                    numOfOperators: 0,
                })
            }

            let minApy = Number.POSITIVE_INFINITY

            let maxApy = Number.NEGATIVE_INFINITY

            operators.forEach(({ apy }) => {
                minApy = Math.min(minApy, apy)

                maxApy = Math.max(maxApy, apy)
            })

            const value = operators.reduce(
                (sum, operator) => sum + operator.share(addr),
                0n,
            )

            setStats({
                value,
                minApy,
                maxApy,
                numOfOperators: operators.length,
            })
        })

        return () => {
            mounted = false
        }
    }, [addr, chainId])

    return stats
}

export function invalidateDelegationsForWalletQueries(chainId: number) {
    getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useDelegationsForWalletQuery', chainId],
        refetchType: 'active',
    })
}

export function useDelegationsForWalletQuery({
    address: addressProp = '',
    pageSize = 10,
    searchQuery: searchQueryProp = '',
    orderBy,
    orderDirection,
}: {
    address?: string
    pageSize?: number
    searchQuery?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    const currentChainId = useCurrentChainId()

    const address = addressProp.toLowerCase()

    const searchQuery = searchQueryProp.toLowerCase()

    return useInfiniteQuery({
        queryKey: [
            'useDelegationsForWalletQuery',
            currentChainId,
            address,
            searchQuery,
            pageSize,
        ],
        async queryFn({ pageParam: skip }) {
            const elements = await getParsedOperators(
                () => {
                    const params = {
                        chainId: currentChainId,
                        first: pageSize,
                        skip,
                        address,
                        orderBy: mapOperatorOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                    }

                    if (!searchQuery) {
                        /**
                         * Empty search = look for all operators.
                         */
                        return getOperatorsByDelegation(params) as Promise<
                            GraphOperator[]
                        >
                    }

                    if (isAddress(searchQuery)) {
                        /**
                         * Look for a delegation for a given operator id.
                         */
                        return getOperatorsByDelegationAndId({
                            ...params,
                            operatorId: searchQuery,
                        }) as Promise<GraphOperator[]>
                    }

                    return getOperatorsByDelegationAndMetadata({
                        ...params,
                        searchQuery,
                    }) as Promise<GraphOperator[]>
                },
                {
                    chainId: currentChainId,
                },
            )

            return {
                skip,
                elements,
            }
        },
        initialPageParam: 0,
        getNextPageParam: ({ skip, elements }) => {
            return elements.length === pageSize ? skip + pageSize : null
        },
        staleTime: Minute,
        placeholderData: keepPreviousData,
    })
}

export function invalidateAllOperatorsQueries(chainId: number) {
    getQueryClient().invalidateQueries({
        exact: false,
        queryKey: ['useAllOperatorsQuery', chainId],
        refetchType: 'active',
    })
}

export function useAllOperatorsQuery({
    batchSize = 10,
    searchQuery: searchQueryProp = '',
    orderBy,
    orderDirection,
}: {
    batchSize?: number
    searchQuery?: string
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}) {
    const searchQuery = searchQueryProp.toLowerCase()
    const currentChainId = useCurrentChainId()

    return useInfiniteQuery({
        queryKey: [
            'useAllOperatorsQuery',
            currentChainId,
            searchQuery,
            batchSize,
            orderBy,
            orderDirection,
        ],
        async queryFn({ pageParam: skip }) {
            const elements = await getParsedOperators(
                () => {
                    const params = {
                        chainId: currentChainId,
                        first: batchSize,
                        skip,
                        orderBy: mapOperatorOrder(orderBy),
                        orderDirection: orderDirection as OrderDirection,
                        force: true,
                    }

                    if (!searchQuery) {
                        return getAllOperators(params) as Promise<GraphOperator[]>
                    }

                    return searchOperatorsByMetadata({
                        ...params,
                        searchQuery,
                    }) as Promise<GraphOperator[]>
                },
                {
                    chainId: currentChainId,
                },
            )

            return {
                skip,
                elements,
            }
        },
        initialPageParam: 0,
        getNextPageParam: ({ skip, elements }) => {
            return elements.length === batchSize ? skip + batchSize : null
        },
        staleTime: Minute,
        placeholderData: keepPreviousData,
    })
}

export function useIsDelegatingFundsToOperator(
    operatorId: string | undefined,
    wallet: string | undefined,
) {
    return useIsFlagged(flagKey('isDelegatingFunds', operatorId || '', wallet || ''))
}

const delegateFundsModal = toaster(DelegateFundsModal, Layer.Modal)

/**
 * Triggers funds delegation and raises an associated flag for the
 * duration of the process.
 */
export function useDelegateFunds() {
    const withFlag = useFlagger()

    return useCallback(
        ({
            chainId,
            onDone,
            operator,
            wallet,
        }: {
            chainId: number
            onDone?: () => void
            operator: Operator
            wallet: string | undefined
        }) => {
            if (!wallet) {
                return
            }

            void (async () => {
                try {
                    try {
                        await withFlag(
                            flagKey('isDelegatingFunds', operator.id, wallet),
                            async () => {
                                const balance = await getBalance({
                                    chainId,
                                    tokenAddress: getContractAddress(
                                        'sponsorshipPaymentToken',
                                        chainId,
                                    ),
                                    walletAddress: wallet,
                                })

                                const delegatedTotal = await getOperatorDelegationAmount(
                                    chainId,
                                    operator.id,
                                    wallet,
                                )

                                await delegateFundsModal.pop({
                                    operator,
                                    balance,
                                    delegatedTotal,
                                    chainId,
                                })

                                invalidateActiveOperatorByIdQueries(chainId, operator.id)
                            },
                        )
                    } catch (e) {
                        if (e === FlagBusy) {
                            return
                        }

                        if (isRejectionReason(e)) {
                            return
                        }

                        throw e
                    }

                    onDone?.()
                } catch (e) {
                    console.warn('Could not delegate funds', e)
                }
            })()
        },
        [withFlag],
    )
}

export function useIsUndelegatingFundsToOperator(
    operatorId: string | undefined,
    wallet: string | undefined,
) {
    return useIsFlagged(flagKey('isUndelegatingFunds', operatorId || '', wallet || ''))
}

/**
 * Triggers funds undelegation and raises an associated flag for the
 * duration of the process.
 */
export function useUndelegateFunds() {
    const withFlag = useFlagger()

    return useCallback(
        ({
            chainId,
            onDone,
            operator,
            wallet,
        }: {
            chainId: number
            onDone?: () => void
            operator: Operator
            wallet: string | undefined
        }) => {
            if (!wallet) {
                return
            }

            void (async () => {
                try {
                    try {
                        await withFlag(
                            flagKey('isUndelegatingFunds', operator.id, wallet),
                            async () => {
                                const balance = await getBalance({
                                    chainId,
                                    tokenAddress: getContractAddress(
                                        'sponsorshipPaymentToken',
                                        chainId,
                                    ),
                                    walletAddress: wallet,
                                })

                                const delegatedTotal = await getOperatorDelegationAmount(
                                    chainId,
                                    operator.id,
                                    wallet,
                                )

                                await undelegateFundsModal.pop({
                                    chainId,
                                    operator,
                                    balance,
                                    delegatedTotal,
                                })

                                invalidateActiveOperatorByIdQueries(chainId, operator.id)
                            },
                        )
                    } catch (e) {
                        if (e === FlagBusy) {
                            return
                        }

                        if (isRejectionReason(e)) {
                            return
                        }

                        throw e
                    }

                    onDone?.()
                } catch (e) {
                    console.warn('Could not undelegate funds', e)
                }
            })()
        },
        [withFlag],
    )
}

const mapOperatorOrder = (orderBy: string | undefined): Operator_OrderBy => {
    switch (orderBy) {
        case 'totalValue':
            return Operator_OrderBy.ValueWithoutEarnings
        case 'deployed':
            return Operator_OrderBy.TotalStakeInSponsorshipsWei
        case 'operatorCut':
            return Operator_OrderBy.OperatorsCutFraction
        default:
            return Operator_OrderBy.Id
    }
}

/**
 * Returns a callback that takes the user through the process of collecting
 * earnings for given operator/sponsorship pair.
 */
export function useCollectEarnings() {
    const { fetch: fetchUncollectedEarnings } = useUncollectedEarningsStore()

    return useCallback(
        (params: { chainId: number; sponsorshipIds: string[]; operatorId: string }) => {
            const { chainId, sponsorshipIds, operatorId } = params

            void (async () => {
                try {
                    if (
                        !(await confirm({
                            cancelLabel: 'Cancel',
                            proceedLabel: 'Proceed',
                            title: 'Confirm',
                            description: (
                                <>
                                    This action transfers uncollected earnings to the
                                    Operator contract ({truncate(operatorId)}).
                                </>
                            ),
                        }))
                    ) {
                        return
                    }

                    await collectEarnings(chainId, sponsorshipIds, operatorId, {
                        onReceipt: ({ blockNumber }) =>
                            waitForIndexedBlock(chainId, blockNumber),
                    })

                    await fetchUncollectedEarnings(chainId, operatorId)

                    /**
                     * Let's refresh the operator page to incl. now-collected earnings
                     * in the overview section.
                     */
                    invalidateActiveOperatorByIdQueries(chainId, operatorId)

                    successToast({
                        title: 'Earnings collected!',
                        autoCloseAfter: 5,
                        desc: (
                            <p>
                                Earnings have been successfully collected and are now
                                available in the Operator&nbsp;balance.
                            </p>
                        ),
                    })
                } catch (e) {
                    if (e === Break) {
                        return
                    }

                    if (isTransactionRejection(e)) {
                        return
                    }

                    console.error('Could not collect earnings', e)
                }
            })()
        },
        [fetchUncollectedEarnings],
    )
}

/**
 * Returns a callback that takes the user through force-undelegation process.
 */
export function useForceUndelegate() {
    return useCallback((chainId: number, operator: Operator, amount: bigint) => {
        void (async () => {
            try {
                const wallet = await (await getSigner()).getAddress()

                await getSponsorshipTokenInfo(chainId)

                const sponsorshipId = await forceUndelegateModal.pop({
                    chainId,
                    operator,
                    amount,
                })

                invalidateSponsorshipQueries(chainId, wallet, sponsorshipId)
            } catch (e) {
                if (e === Break) {
                    return
                }

                if (isRejectionReason(e)) {
                    return
                }

                console.error('Could not force undelegate', e)
            }
        })()
    }, [])
}

/**
 * Returns a callback that takes the user through undelegation queue processing.
 */
export function useProcessUndelegationQueue() {
    return useCallback((chainId: number, operatorId: string) => {
        void (async () => {
            try {
                await processOperatorUndelegationQueue(chainId, operatorId, {
                    onReceipt: () => {
                        // Refresh operator to update queue entries
                        invalidateActiveOperatorByIdQueries(chainId, operatorId)
                    },
                })
            } catch (e) {
                if (e === Break) {
                    return
                }

                if (isRejectionReason(e)) {
                    return
                }

                console.error('Could not process undelegation queue', e)
            }
        })()
    }, [])
}
