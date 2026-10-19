import { Contract, parseEther } from 'ethers'
import {
    ERC677,
    Operator as OperatorContract,
    OperatorFactory,
} from 'network-contracts-ethers6'
import { Operator } from '~/parsers/Operator'
import { postImage } from '~/services/images'
import { getSigner } from '~/shared/stores/wallet'
import { Operation } from '~/shared/toasts/TransactionListToast'
import { toBN } from '~/utils/bn'
import { getContractAbi, getContractAddress } from '~/utils/contracts'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicProvider } from '~/utils/providers'
import { toastedOperation, toastedOperations } from '~/utils/toastedOperation'
import { call, CallableOptions } from '~/utils/tx'

export async function createOperator(
    chainId: number,
    params: {
        cut: number
        description: string
        imageToUpload?: File | undefined
        name: string
        redundancyFactor: number
        url: string
        email: string
        twitter: string
        x: string
        telegram: string
        reddit: string
        linkedIn: string
    },
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    const {
        cut,
        name,
        redundancyFactor,
        description,
        imageToUpload,
        url,
        email,
        twitter,
        x,
        telegram,
        reddit,
        linkedIn,
    } = params

    await networkPreflight(chainId)

    const signer = await getSigner()

    const walletAddress = await signer.getAddress()

    const imageIpfsCid = imageToUpload ? await postImage(imageToUpload) : undefined

    const factory = new Contract(
        getContractAddress('operatorFactory', chainId),
        getContractAbi('operatorFactory'),
        signer,
    ) as unknown as OperatorFactory

    const metadata = {
        name,
        description,
        redundancyFactor,
        imageIpfsCid,
        url: url || undefined,
        email: email || undefined,
        twitter: twitter || undefined,
        x: x || undefined,
        telegram: telegram || undefined,
        reddit: reddit || undefined,
        linkedIn: linkedIn || undefined,
    }

    const poolTokenName = `StreamrOperator-${walletAddress.slice(-5)}`

    const operatorMetadata = JSON.stringify(metadata)

    const policies: [string, string, string] = [
        getContractAddress('operatorDefaultDelegationPolicy', chainId),
        getContractAddress('operatorDefaultExchangeRatePolicy', chainId),
        getContractAddress('operatorDefaultUndelegationPolicy', chainId),
    ]

    const operatorsCutFraction = parseEther(cut.toString()) / 100n

    const policyParams: [number, number, number] = [0, 0, 0]

    await toastedOperation('Operator deployment', async () => {
        await call(factory, 'deployOperator', {
            args: [
                operatorsCutFraction,
                poolTokenName,
                operatorMetadata,
                policies,
                policyParams,
            ],
            onReceipt,
        })
    })
}

export async function updateOperator(
    chainId: number,
    operator: Operator,
    mods: {
        name: string
        redundancyFactor: number
        description: string
        imageToUpload?: File
        cut: number
        url: string
        email: string
        twitter: string
        x: string
        telegram: string
        reddit: string
        linkedIn: string
    },
    { onReceipt }: CallableOptions = {},
) {
    const {
        name,
        redundancyFactor,
        description = '',
        imageToUpload,
        cut,
        url,
        email,
        twitter,
        x,
        telegram,
        reddit,
        linkedIn,
    } = mods

    const { metadata } = operator

    const operations: Operation[] = []

    const hasUpdateCutOperation = !operator.stakes.length && operator.operatorsCut !== cut

    const hasUpdateMetadataOperation =
        !!imageToUpload ||
        name !== metadata.name ||
        description !== metadata.description ||
        redundancyFactor !== metadata.redundancyFactor ||
        url !== metadata.url ||
        email !== metadata.email ||
        twitter !== metadata.twitter ||
        x !== metadata.x ||
        telegram !== metadata.telegram ||
        reddit !== metadata.reddit ||
        linkedIn !== metadata.linkedIn

    if (hasUpdateCutOperation) {
        operations.push({
            id: 'updateCutOperation',
            label: "Update the owner's cut value",
        })
    }

    if (hasUpdateMetadataOperation) {
        operations.push({
            id: 'updateMetadataOperation',
            label: "Update the operator's metadata",
        })
    }

    if (!operations.length) {
        return
    }

    const blockNumbers: number[] = []

    await toastedOperations(operations, async (next) => {
        if (hasUpdateCutOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                getContractAbi('operator'),
                await getSigner(),
            ) as unknown as OperatorContract

            await call(operatorContract, 'updateOperatorsCutFraction', {
                args: [parseEther(toBN(cut).toString()) / 100n],
                onReceipt: async (receipt) => {
                    blockNumbers.push(receipt.blockNumber)

                    if (!hasUpdateMetadataOperation) {
                        await onReceipt?.(receipt)
                    }
                },
            })

            next()
        }

        if (hasUpdateMetadataOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                getContractAbi('operator'),
                await getSigner(),
            ) as unknown as OperatorContract

            const imageIpfsCid = imageToUpload
                ? await postImage(imageToUpload)
                : operator.metadata.imageIpfsCid

            await call(operatorContract, 'updateMetadata', {
                args: [
                    JSON.stringify({
                        name: name || undefined,
                        description: description || undefined,
                        redundancyFactor,
                        imageIpfsCid,
                        url: url || undefined,
                        email: email || undefined,
                        twitter: twitter || undefined,
                        x: x || undefined,
                        telegram: telegram || undefined,
                        reddit: reddit || undefined,
                        linkedIn: linkedIn || undefined,
                    }),
                ],
                onReceipt: async (receipt) => {
                    blockNumbers.push(receipt.blockNumber)

                    await onReceipt?.(receipt)
                },
            })
        }
    })
}

export async function delegateToOperator(
    chainId: number,
    operatorId: string,
    amount: bigint,
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(
        getContractAddress('data', chainId),
        getContractAbi('erc677'),
        signer,
    ) as unknown as ERC677

    await toastedOperation('Delegate to operator', async () => {
        await call(contract, 'transferAndCall', {
            args: [operatorId, amount, '0x'],
            onReceipt,
        })
    })
}

export async function undelegateFromOperator(
    chainId: number,
    operatorId: string,
    amount: bigint,
    { onReceipt }: CallableOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as OperatorContract

    await toastedOperation('Undelegate from operator', async () => {
        await call(operatorContract, 'undelegate', {
            args: [amount],
            onReceipt,
        })
    })
}

export async function getOperatorDelegationAmount(
    chainId: number,
    operatorId: string,
    address: string,
) {
    const provider = await getPublicProvider(chainId)

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        provider,
    ) as unknown as OperatorContract

    return operatorContract.balanceInData(address)
}

export async function setOperatorNodeAddresses(
    chainId: number,
    operatorId: string,
    addresses: string[],
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as OperatorContract

    await toastedOperation('Save node addresses', async () => {
        await call(operatorContract, 'setNodeAddresses', {
            args: [addresses],
            onReceipt,
        })
    })
}

export async function addOperatorControllerAddress(
    chainId: number,
    operatorId: string,
    address: string,
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as OperatorContract

    await toastedOperation('Authorise staking agent', async () => {
        await call(operatorContract, 'grantRole', {
            args: [await operatorContract.CONTROLLER_ROLE(), address],
            onReceipt,
        })
    })
}

export async function removeOperatorControllerAddress(
    chainId: number,
    operatorId: string,
    address: string,
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as OperatorContract

    await toastedOperation('Revoke staking agent', async () => {
        await call(operatorContract, 'revokeRole', {
            args: [await operatorContract.CONTROLLER_ROLE(), address],
            onReceipt,
        })
    })
}

export async function processOperatorUndelegationQueue(
    chainId: number,
    operatorId: string,
    { onReceipt }: CallableOptions = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as OperatorContract

    await toastedOperation('Process undelegation queue', async () => {
        await call(operatorContract, 'payOutQueue', {
            args: [0],
            onReceipt,
        })
    })
}
