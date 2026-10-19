import {
    GetProjectsByTextDocument,
    GetProjectsByTextQuery,
    GetProjectsByTextQueryVariables,
    GetProjectsDocument,
    GetProjectsQuery,
    GetProjectsQueryVariables,
    Project_Filter,
} from '~/generated/gql/network'
import { getProjectRegistryContract } from '~/getters'
import { getGraphClient } from '~/getters/getGraphClient'
import { deployDataUnion } from '~/marketplace/modules/dataUnion/services'
import { ParsedProject } from '~/parsers/ProjectParser'
import { getSigner, getWalletAccount } from '~/shared/stores/wallet'
import { ProjectType, TheGraph } from '~/shared/types'
import { truncate } from '~/shared/utils/text'
import { timeUnits } from '~/shared/utils/timeUnit'
import { WritablePaymentDetail } from '~/types'
import { PublishableProjectPayload } from '~/types/projects'
import { toBN } from '~/utils/bn'
import { isMessagedObject } from '~/utils/exceptions'
import networkPreflight from '~/utils/networkPreflight'
import { convertPrice } from '~/utils/price'
import { errorToast } from '~/utils/toast'
import { call } from '~/utils/tx'
import { postImage } from './images'

/**
 * @deprecated Use the `ParsedProject` (see `ProjectParser`) instead.
 */
export type TheGraphProject = {
    id: string
    paymentDetails: (WritablePaymentDetail<string> & {
        domainId: string
    })[]
    minimumSubscriptionSeconds: string
    metadata: {
        name: string
        description: string
        imageIpfsCid: string | null | undefined
        creator: string
        termsOfUse:
            | {
                  commercialUse: boolean
                  redistribution: boolean
                  reselling: boolean
                  storage: boolean
                  termsName: string | null | undefined
                  termsUrl: string | null | undefined
              }
            | undefined
        contactDetails:
            | {
                  url?: string | null | undefined
                  email?: string | null | undefined
                  twitter?: string | null | undefined
                  telegram?: string | null | undefined
                  reddit?: string | null | undefined
                  linkedIn?: string | null | undefined
              }
            | undefined
        isDataUnion?: boolean
    }
    version: number | null
    streams: string[]
    permissions: {
        canBuy: boolean
        canDelete: boolean
        canEdit: boolean
        canGrant: boolean
        userAddress: string
    }[]
    createdAt: string
    updatedAt: string
    purchases: {
        subscriber: string
        subscriptionSeconds: string
        price: string
        fee: string
    }[]
    purchasesCount: number
    isDataUnion: boolean
}

const mapProject = (project: any): TheGraphProject => {
    let metadata = {}

    try {
        metadata = JSON.parse(project.metadata)
    } catch (e) {
        console.warn('Could not parse metadata for project', project.id, e)
    }

    return {
        ...project,
        metadata,
    }
}

const prepareProjectResult = (
    results: TheGraphProject[],
    pageSize: number,
): ProjectsResult => {
    let hasNextPage = false

    const projects: TheGraphProject[] = results.map((p) => mapProject(p))
    if (projects.length > pageSize) {
        hasNextPage = true
        // Remove last item
        projects.splice(pageSize, 1)
    }

    return {
        projects,
        hasNextPage,
        lastId: projects.length === 0 ? null : projects[projects.length - 1].id,
    }
}

export type ProjectsResult = {
    projects: TheGraphProject[]
    hasNextPage: boolean
    lastId: string | null
}

function getProjectFilter(
    params: Pick<GetProjectsParams, 'owner' | 'streamId' | 'projectType'>,
): Project_Filter {
    const { owner, projectType, streamId } = params

    const filter: Project_Filter = {}

    if (projectType === TheGraph.ProjectType.Open) {
        filter.paymentDetails_ = {
            pricePerSecond: 0,
        }
    }

    if (projectType === TheGraph.ProjectType.Paid) {
        filter.paymentDetails_ = {
            pricePerSecond_gt: 0,
        }
    }

    if (projectType === TheGraph.ProjectType.DataUnion) {
        filter.isDataUnion = true
    }

    if (owner) {
        filter.permissions_ = {
            userAddress: owner,
            canGrant: true,
        }
    }

    if (streamId) {
        filter.streams_contains = [streamId]
    }

    return filter
}

interface GetProjectsParams {
    chainId: number
    first?: number
    owner?: string | undefined
    projectType?: TheGraph.ProjectType | undefined
    skip?: number
    /**
     * `streamId` use used to search projects which contain this stream.
     */
    streamId?: string | undefined
}

/**
 * @todo Refactor to use `ProjectParser` and `useInfiniteQuery`.
 */
export async function getProjects(params: GetProjectsParams): Promise<ProjectsResult> {
    const { chainId, first = 20, owner, projectType, skip = 0, streamId } = params

    const {
        data: { projects = [] },
    } = await getGraphClient(chainId).query<GetProjectsQuery, GetProjectsQueryVariables>({
        query: GetProjectsDocument,
        variables: {
            skip,
            first: first + 1,
            where: getProjectFilter({
                owner,
                projectType,
                streamId,
            }),
        },
        fetchPolicy: 'network-only',
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

/**
 * @todo Refactor to use `ProjectParser`.
 */
export async function getProjectsByText(text: string, params: GetProjectsParams) {
    const { chainId, first = 20, owner, projectType, skip = 0, streamId } = params

    const {
        data: { projectSearch: projects = [] },
    } = await getGraphClient(chainId).query<
        GetProjectsByTextQuery,
        GetProjectsByTextQueryVariables
    >({
        query: GetProjectsByTextDocument,
        variables: {
            first,
            skip,
            text,
            where: getProjectFilter({
                owner,
                projectType,
                streamId,
            }),
        },
        fetchPolicy: 'network-only',
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

async function formatMetadata({
    contact: contactDetails,
    creator,
    description,
    imageIpfsCid: existingImageIpfsCid,
    newImageToUpload,
    name,
    termsOfUse,
    type,
}: PublishableProjectPayload) {
    const imageIpfsCid = newImageToUpload
        ? await postImage(newImageToUpload)
        : existingImageIpfsCid

    return JSON.stringify({
        name,
        description,
        imageIpfsCid,
        creator,
        contactDetails,
        termsOfUse,
        isDataUnion: type === ProjectType.DataUnion,
    })
}

export async function getPublishableProjectProperties(project: ParsedProject) {
    const payload = PublishableProjectPayload.parse(project)

    const salePoints = Object.values(payload.salePoints)

    const domainIds: number[] = []

    const paymentDetails: WritablePaymentDetail[] = []

    const wallet = (await getWalletAccount()) || ''

    for (let i = 0; i < salePoints.length; i++) {
        const {
            beneficiaryAddress,
            chainId: domainId,
            enabled,
            price,
            pricePerSecond: currentPricePerSecond,
            pricingTokenAddress,
            timeUnit,
        } = salePoints[i]

        if (!enabled) {
            continue
        }

        /**
         * Use current wallet's address as the default beneficiary for *paid* projects
         * that carry no beneficiary address information. The placeholder for the
         * beneficiary address input field reflects it, too.
         */
        const beneficiary =
            beneficiaryAddress || (payload.type === ProjectType.PaidData ? wallet : '')

        const pricePerSecond = await (async () => {
            if (currentPricePerSecond != null) {
                /**
                 * In the current implementation we disallow price changes, so
                 * if initial `pricePerSecond` is defined we reuse it.
                 */

                return currentPricePerSecond
            }

            if (!price) {
                /**
                 * 0 (or undefined amount of) tokens per time unit constitues 0 per
                 * second. No need to fetch decimals.
                 */
                return 0n
            }

            return convertPrice([price, timeUnit], timeUnits.second)
        })()

        domainIds.push(domainId)

        paymentDetails.push({
            beneficiary,
            pricePerSecond,
            pricingTokenAddress,
        })
    }

    const metadata = await formatMetadata(payload)

    return {
        adminFee:
            'adminFee' in payload
                ? toBN(payload.adminFee).dividedBy(100).toNumber()
                : void 0,
        domainIds,
        metadata,
        paymentDetails,
        streams: payload.streams,
    }
}

interface CreateProjectOptions {
    domainIds: number[]
    isPublicPurchasable: boolean
    metadata: string
    minimumSubscriptionSeconds?: number
    paymentDetails: WritablePaymentDetail[]
    streams: string[]
}

export async function createProject(
    chainId: number,
    projectId: string,
    options: CreateProjectOptions,
) {
    const {
        domainIds,
        isPublicPurchasable,
        metadata,
        minimumSubscriptionSeconds = 0,
        paymentDetails,
        streams,
    } = options

    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = getProjectRegistryContract({
        chainId,
        provider: signer,
    })

    await call(contract, 'createProject', {
        args: [
            projectId,
            domainIds,
            paymentDetails,
            streams,
            minimumSubscriptionSeconds,
            isPublicPurchasable,
            metadata,
        ],
    })
}

interface UpdateProjectOptions {
    domainIds: number[]
    metadata: string
    minimumSubscriptionSeconds?: number
    paymentDetails: WritablePaymentDetail[]
    streams: string[]
}

export async function updateProject(
    chainId: number,
    projectId: string,
    options: UpdateProjectOptions,
) {
    const {
        domainIds,
        metadata,
        minimumSubscriptionSeconds = 0,
        paymentDetails,
        streams,
    } = options

    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = getProjectRegistryContract({ chainId, provider: signer })

    await call(contract, 'updateProject', {
        args: [
            projectId,
            domainIds,
            paymentDetails,
            streams,
            minimumSubscriptionSeconds,
            metadata,
        ],
    })
}

export async function deleteProject(chainId: number, projectId: string) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = getProjectRegistryContract({
        chainId,
        provider: signer,
    })

    try {
        await call(contract, 'deleteProject', {
            args: [projectId],
        })
    } catch (e) {
        if (isMessagedObject(e) && /error_projectDoesNotExist/.test(e.message)) {
            errorToast({
                title: 'No such project',
                desc: `Project ${truncate(projectId)} does not exist.`,
            })
        }

        throw e
    }
}

export async function deployDataUnionContract(
    chainId: number,
    projectId: string,
    adminFee: number,
) {
    await networkPreflight(chainId)

    return new Promise<string>((resolve, reject) =>
        deployDataUnion({
            productId: projectId,
            chainId,
            adminFee,
        })
            .onTransactionComplete(({ contractAddress }) => {
                if (contractAddress == null) {
                    reject(new Error('DU contract deploy did not return an address!'))
                } else {
                    resolve(contractAddress)
                }
            })
            .onError((e) => {
                console.error(e)
                reject(e)
            }),
    )
}
