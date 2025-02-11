import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { randomHex } from 'web3-utils'
import { ValidationError } from '~/errors'
import { getDataUnion } from '~/getters/du'
import { ParsedProject } from '~/parsers/ProjectParser'
import {
    createProject,
    deployDataUnionContract,
    getPublishableProjectProperties,
    updateProject,
} from '~/services/projects'
import { useHasActiveProjectSubscription } from '~/shared/stores/purchases'
import { useWalletAccount } from '~/shared/stores/wallet'
import { Operation } from '~/shared/toasts/TransactionListToast'
import { ProjectType } from '~/shared/types'
import { isProjectOwnedBy } from '~/utils'
import { toBN } from '~/utils/bn'
import { useCurrentChainKey } from '~/utils/chains'
import { createDraftStore, getEmptyDraft } from '~/utils/draft'
import networkPreflight from '~/utils/networkPreflight'
import { Route as R, routeOptions } from '~/utils/routes'
import { validationErrorToast } from '~/utils/toast'
import { toastedOperations } from '~/utils/toastedOperation'

export const ProjectDraft = createDraftStore<ParsedProject>({
    async persist({ entity }) {
        const operations: Operation[] = []

        if (!entity) {
            return
        }

        const { cold, hot: project } = entity

        const { chainId } = cold

        if (project.id) {
            const projectId = project.id

            const shouldUpdateAdminFee = requiresAdminFeeUpdate(project, cold)

            const shouldUpdateMatadata = !eq(cold, project)

            if (shouldUpdateAdminFee) {
                operations.push({
                    id: uniqueId('operation-'),
                    label: 'Update admin fee',
                })
            }

            if (shouldUpdateMatadata) {
                operations.push({
                    id: uniqueId('operation-'),
                    label: 'Update project',
                })
            }

            return void (await toastedOperations(operations, async (next) => {
                const { domainIds, paymentDetails, adminFee, streams, metadata } =
                    await getPublishableProjectProperties(project)

                if (shouldUpdateAdminFee) {
                    const [domainId] = domainIds

                    const [paymentDetail] = paymentDetails

                    if (!domainId) {
                        throw new Error('No chain id')
                    }

                    if (typeof adminFee === 'undefined') {
                        throw new Error('No admin fee')
                    }

                    if (!paymentDetail) {
                        throw new Error('No payment details')
                    }

                    const { beneficiary: dataUnionId } = paymentDetail

                    if (!dataUnionId) {
                        /**
                         * Something broke above. We can update a Data Union only when
                         * we know its deployment address.
                         */
                        throw new Error('No Data Union id')
                    }

                    const dataUnion = await getDataUnion(dataUnionId, domainId)

                    await dataUnion.setAdminFee(adminFee)

                    next()
                }

                if (shouldUpdateMatadata) {
                    await updateProject(chainId, projectId, {
                        domainIds,
                        metadata,
                        paymentDetails,
                        streams,
                    })
                }
            }))
        }

        const shouldDeployDataUnion = requiresDataUnionDeployment(project)

        if (shouldDeployDataUnion) {
            operations.push({
                id: uniqueId('operation-'),
                label: 'Deploy Data Union contract',
            })
        }

        operations.push({
            id: uniqueId('operation-'),
            label: 'Create project',
        })

        await toastedOperations(operations, async (next) => {
            const projectId = randomHex(32)

            const { domainIds, paymentDetails, adminFee, streams, metadata } =
                await getPublishableProjectProperties(project)

            if (shouldDeployDataUnion) {
                const [domainId] = domainIds

                const [paymentDetail] = paymentDetails

                if (!domainId) {
                    throw new Error('No chain id')
                }

                if (typeof adminFee === 'undefined') {
                    throw new Error('No admin fee')
                }

                if (!paymentDetail) {
                    throw new Error('No payment details')
                }

                if (paymentDetail.beneficiary) {
                    /**
                     * Something broke above. See `requiresDataUnionDeployment` for details.
                     * We only deploy a new Data Union if the `beneficiary` is empty.
                     */
                    throw new Error('Unexpected beneficiary')
                }

                await networkPreflight(chainId)

                const dataUnionId = await deployDataUnionContract(
                    domainId,
                    projectId,
                    adminFee,
                )

                /**
                 * We assing the newly deployed Data Union to the project
                 * we're currently persisting.
                 */
                paymentDetail.beneficiary = dataUnionId

                next()
            }

            await createProject(chainId, projectId, {
                domainIds,
                isPublicPurchasable: project.type !== ProjectType.OpenData,
                metadata,
                paymentDetails,
                streams,
            })
        })
    },

    getEmptyDraft() {
        return getEmptyDraft<ParsedProject>(undefined)
    },

    isEqual: eq,

    prefix: 'ProjectDraft-',
})

function eq(cold: ParsedProject, hot: ParsedProject) {
    /**
     * Admin fee is not metadata. We have to skip it in the
     * below payload comparison.
     */
    return isEqual({ ...hot, adminFee: '' }, { ...cold, adminFee: '' })
}

export function preselectSalePoint(project: ParsedProject) {
    if (project.type === ProjectType.OpenData) {
        return
    }

    const values = Object.values(project.salePoints)

    if (values.some((salePoint) => salePoint?.enabled)) {
        /**
         * Project has at least one sale point selected already. We have to skip.
         */
        return
    }

    const [salePoint] = values

    if (!salePoint) {
        /**
         * Nothing to enable, eh?
         */
        return
    }

    salePoint.enabled = true
}

function requiresDataUnionDeployment(project: ParsedProject) {
    return (
        project.type === ProjectType.DataUnion &&
        !Object.values(project.salePoints).find((salePoint) => salePoint?.enabled)
            ?.beneficiaryAddress
    )
}

function requiresAdminFeeUpdate(hot: ParsedProject, cold: ParsedProject) {
    return (
        hot.type === ProjectType.DataUnion &&
        !toBN(hot.adminFee || '0').isEqualTo(toBN(cold.adminFee || '0'))
    )
}

/**
 * Checks if the current wallet can access project's streams right away.
 * @returns `undefined` if it's undetermined (= fetching). A `boolean` otherwise.
 */
export function useIsAccessibleByCurrentWallet() {
    const wallet = useWalletAccount()

    const draft = ProjectDraft.useDraft()

    const fetching = !!draft?.fetching

    const project = draft?.entity?.cold

    const hasActiveProjectSubscription = useHasActiveProjectSubscription(
        project?.id,
        wallet,
    )

    if (fetching) {
        return
    }

    if (project?.type === ProjectType.OpenData) {
        return true
    }

    if (!wallet) {
        return false
    }

    return (
        isProjectOwnedBy(project?.permissions || [], wallet) ||
        hasActiveProjectSubscription
    )
}

export function usePersistProjectCallback() {
    const persist = ProjectDraft.usePersistCallback()

    const navigate = useNavigate()

    const chainName = useCurrentChainKey()

    return useCallback(() => {
        persist({
            onDone(mounted) {
                if (!mounted) {
                    return
                }

                navigate(R.projects(routeOptions(chainName)))
            },

            onError(e) {
                if (e instanceof ValidationError) {
                    validationErrorToast({ title: 'Failed to publish', error: e })
                }

                console.warn('Failed to publish', e)
            },
        })
    }, [persist, navigate, chainName])
}
