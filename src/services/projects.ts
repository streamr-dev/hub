import getCoreConfig from '~/getters/getCoreConfig'
import { Address } from '~/shared/types/web3-types'
import { getConfigForChainByName } from '~/shared/web3/config'
import { getSigner } from '~/shared/stores/wallet'
import { getProjectRegistryContract } from '~/getters'
import networkPreflight from '~/utils/networkPreflight'
import { deployDataUnion } from '~/marketplace/modules/dataUnion/services'
import { BN } from '~/utils/bn'
import {
    getRawGraphProject,
    getRawGraphProjects,
    getRawGraphProjectsByText,
} from '~/getters/hub'
import { TheGraph } from '~/shared/types'

const getProjectRegistryChainId = () => {
    const { projectsChain } = getCoreConfig()
    const config = getConfigForChainByName(projectsChain)
    return config.id
}

export type TheGraphPaymentDetails = {
    domainId: string
    beneficiary: string
    pricingTokenAddress: string
    pricePerSecond: string
}

export type TheGraphSubscription = {
    userAddress: string
    endTimestamp: string
}

export type ProjectPermissions = {
    canBuy: boolean
    canDelete: boolean
    canEdit: boolean
    canGrant: boolean
}

export type TheGraphPermission = ProjectPermissions & {
    userAddress: string
}

export type TheGraphPurchase = {
    subscriber: string
    subscriptionSeconds: string
    price: string
    fee: string
}

export type TheGraphProject = {
    id: string
    paymentDetails: TheGraphPaymentDetails[]
    minimumSubscriptionSeconds: string
    subscriptions: TheGraphSubscription[]
    metadata: SmartContractProjectMetadata
    version: number | null
    streams: string[]
    permissions: TheGraphPermission[]
    createdAt: string
    updatedAt: string
    purchases: TheGraphPurchase[]
    purchasesCount: number
    isDataUnion: boolean
}

export type PaymentDetails = {
    chainId: number
    beneficiaryAddress: Address
    pricePerSecond: BN
    pricingTokenAddress: Address
}

export type SmartContractProjectMetadata = {
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

export type SmartContractProject = {
    id: string
    paymentDetails: PaymentDetails[]
    minimumSubscriptionInSeconds: number
    metadata: string
    chainId: number
    streams: string[]
}

export interface SmartContractProjectCreate extends SmartContractProject {
    isPublicPurchasable: boolean
}

type SmartContractPaymentDetails = {
    beneficiary: string
    pricePerSecond: string
    pricingTokenAddress: string
}

const mapProject = (project: any): TheGraphProject => {
    try {
        const metadata = JSON.parse(project.metadata)
        project.metadata = metadata
    } catch (e) {
        console.error(`Could not parse metadata for project ${project.id}`, e)
        project.metadata = {}
    }

    return project as TheGraphProject
}

export const getProject = async (id: string): Promise<TheGraphProject | null> => {
    const project = await getRawGraphProject(id)

    if (project) {
        return mapProject(project)
    }

    return null
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

export const getProjects = async (
    owner?: string | undefined,
    first = 20,
    skip = 0,
    projectType?: TheGraph.ProjectType | undefined,
    streamId?: string, // used to search projects which contain this stream
): Promise<ProjectsResult> => {
    const projects = await getRawGraphProjects({
        owner,
        first: first + 1,
        skip,
        projectType,
        streamId,
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

export const searchProjects = async (
    search: string,
    first = 20,
    skip = 0,
): Promise<ProjectsResult> => {
    const projects = await getRawGraphProjectsByText(search, {
        first: first + 1,
        skip,
    })

    return prepareProjectResult(projects as unknown as TheGraphProject[], first)
}

const getDomainIds = (paymentDetails: PaymentDetails[]): number[] => {
    return paymentDetails.map((p) => p.chainId)
}

const getPaymentDetails = (
    paymentDetails: PaymentDetails[],
): SmartContractPaymentDetails[] => {
    return paymentDetails.map((d) => ({
        beneficiary: d.beneficiaryAddress,
        pricingTokenAddress: d.pricingTokenAddress,
        pricePerSecond: d.pricePerSecond.toString(),
    }))
}

export async function createProject(project: SmartContractProjectCreate) {
    const chainId = getProjectRegistryChainId()

    const {
        id,
        paymentDetails,
        streams,
        minimumSubscriptionInSeconds,
        isPublicPurchasable,
        metadata,
    } = project

    await networkPreflight(chainId)

    const signer = await getSigner()

    const tx = await getProjectRegistryContract({
        chainId,
        signer,
    }).createProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        streams,
        minimumSubscriptionInSeconds,
        isPublicPurchasable,
        metadata,
    )

    await tx.wait()
}

export async function updateProject(project: SmartContractProject) {
    const chainId = getProjectRegistryChainId()

    const { id, paymentDetails, streams, minimumSubscriptionInSeconds, metadata } =
        project

    await networkPreflight(chainId)

    const signer = await getSigner()

    const tx = await getProjectRegistryContract({ chainId, signer }).updateProject(
        id,
        getDomainIds(paymentDetails),
        getPaymentDetails(paymentDetails),
        streams,
        minimumSubscriptionInSeconds,
        metadata,
    )

    await tx.wait()
}

export async function deleteProject(projectId: string | undefined) {
    if (!projectId) {
        throw new Error('No project')
    }

    const chainId = getProjectRegistryChainId()

    await networkPreflight(chainId)

    const signer = await getSigner()

    const tx = await getProjectRegistryContract({
        chainId,
        signer,
    }).deleteProject(projectId)

    await tx.wait()
}

export async function deployDataUnionContract(
    projectId: string,
    adminFee: string,
    chainId: number,
) {
    await networkPreflight(chainId)

    return new Promise<string>((resolve, reject) =>
        deployDataUnion({
            productId: projectId,
            chainId,
            adminFee,
        })
            .onTransactionHash((contractAddress) => {
                // deployDataUnion() returns the calculated contract address as the tx hash
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