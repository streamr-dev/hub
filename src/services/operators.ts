import { Contract, parseEther } from 'ethers'
import { ERC677, Operator, OperatorFactory } from 'network-contracts-ethers6'
import { DefaultGasLimitMultiplier } from '~/consts'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { postImage } from '~/services/images'
import { getSigner } from '~/shared/stores/wallet'
import { Operation } from '~/shared/toasts/TransactionListToast'
import { toBN, toBigInt } from '~/utils/bn'
import { getContractAbi, getContractAddress } from '~/utils/contracts'
import networkPreflight from '~/utils/networkPreflight'
import { getPublicProvider } from '~/utils/providers'
import { toastedOperation, toastedOperations } from '~/utils/toastedOperation'

export async function createOperator(
    chainId: number,
    params: {
        cut: number
        description: string
        imageToUpload?: File | undefined
        name: string
        redundancyFactor: number
    },
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    const { cut, name, redundancyFactor, description, imageToUpload } = params

    await networkPreflight(chainId)

    const signer = await getSigner()

    const walletAddress = await signer.getAddress()

    const imageIpfsCid = imageToUpload
        ? await postImage(chainId, imageToUpload)
        : undefined

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
        const tx = await factory.deployOperator(
            operatorsCutFraction,
            poolTokenName,
            operatorMetadata,
            policies,
            policyParams,
        )

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await options.onBlockNumber?.(receipt.blockNumber)
        }
    })
}

export async function updateOperator(
    chainId: number,
    operator: ParsedOperator,
    mods: {
        name: string
        redundancyFactor: number
        description: string
        imageToUpload?: File
        cut: number
    },
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
) {
    const { name, redundancyFactor, description = '', imageToUpload, cut } = mods

    const { metadata } = operator

    const operations: Operation[] = []

    const hasUpdateCutOperation = !operator.stakes.length && operator.operatorsCut !== cut

    const hasUpdateMetadataOperation =
        !!imageToUpload ||
        name !== metadata.name ||
        description !== metadata.description ||
        redundancyFactor !== metadata.redundancyFactor

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
            ) as unknown as Operator

            const tx = await operatorContract.updateOperatorsCutFraction(
                parseEther(toBN(cut).toString()) / 100n,
            )

            const receipt = await tx.wait()

            if (receipt?.blockNumber) {
                blockNumbers.push(receipt.blockNumber)

                if (!hasUpdateMetadataOperation) {
                    await options.onBlockNumber?.(receipt.blockNumber)
                }
            }

            next()
        }

        if (hasUpdateMetadataOperation) {
            await networkPreflight(chainId)

            const operatorContract = new Contract(
                operator.id,
                getContractAbi('operator'),
                await getSigner(),
            ) as unknown as Operator

            const imageIpfsCid = imageToUpload
                ? await postImage(chainId, imageToUpload)
                : operator.metadata.imageIpfsCid

            const tx = await operatorContract.updateMetadata(
                JSON.stringify({
                    name: name || undefined,
                    description: description || undefined,
                    redundancyFactor,
                    imageIpfsCid,
                }),
            )

            const receipt = await tx.wait()

            if (receipt?.blockNumber) {
                await options.onBlockNumber?.(receipt.blockNumber)
                blockNumbers.push(receipt.blockNumber)
            }
        }
    })
}

interface DelegateToOperatorOptions {
    onBlockNumber?: (blockNumber: number) => void | Promise<void>
}

export async function delegateToOperator(
    chainId: number,
    operatorId: string,
    amount: bigint,
    options: DelegateToOperatorOptions = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const contract = new Contract(
        getContractAddress('data', chainId),
        getContractAbi('erc677'),
        signer,
    ) as unknown as ERC677

    await toastedOperation('Delegate to operator', async () => {
        const tx = await contract.transferAndCall(operatorId, amount, '0x')

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await options.onBlockNumber?.(receipt.blockNumber)
        }
    })
}

export async function undelegateFromOperator(
    chainId: number,
    operatorId: string,
    amount: bigint,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
): Promise<void> {
    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Undelegate from operator', async () => {
        const tx = await operatorContract.undelegate(amount)

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await options.onBlockNumber?.(receipt.blockNumber)
        }
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
    ) as unknown as Operator

    return operatorContract.balanceInData(address)
}

interface SetOperatorNodeAddressesOptions {
    gasLimitMultiplier?: number
    onBlockNumber?: (blockNumber: number) => void | Promise<void>
}

export async function setOperatorNodeAddresses(
    chainId: number,
    operatorId: string,
    addresses: string[],
    options: SetOperatorNodeAddressesOptions = {},
) {
    const { onBlockNumber, gasLimitMultiplier = DefaultGasLimitMultiplier } = options

    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Save node addresses', async () => {
        const estimatedGasLimit = await operatorContract.setNodeAddresses.estimateGas(
            addresses,
        )

        const gasLimit = toBigInt(
            toBN(estimatedGasLimit).multipliedBy(gasLimitMultiplier),
        )

        const tx = await operatorContract.setNodeAddresses(addresses, { gasLimit })

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await onBlockNumber?.(receipt.blockNumber)
        }
    })
}

interface AddOperatorControllerAddressOptions {
    gasLimitMultiplier?: number
    onBlockNumber?: (blockNumber: number) => void | Promise<void>
}

export async function addOperatorControllerAddress(
    chainId: number,
    operatorId: string,
    address: string,
    options: AddOperatorControllerAddressOptions = {},
) {
    const { onBlockNumber, gasLimitMultiplier = DefaultGasLimitMultiplier } = options

    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Authorise staking agent', async () => {
        const controllerRoleId = await operatorContract.CONTROLLER_ROLE()

        const estimatedGasLimit = await operatorContract.grantRole.estimateGas(
            controllerRoleId,
            address,
        )

        const gasLimit = toBigInt(
            toBN(estimatedGasLimit).multipliedBy(gasLimitMultiplier),
        )

        const tx = await operatorContract.grantRole(controllerRoleId, address, {
            gasLimit,
        })

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await onBlockNumber?.(receipt.blockNumber)
        }
    })
}

interface RemoveOperatorControllerAddressOptions {
    gasLimitMultiplier?: number
    onBlockNumber?: (blockNumber: number) => void | Promise<void>
}

export async function removeOperatorControllerAddress(
    chainId: number,
    operatorId: string,
    address: string,
    options: RemoveOperatorControllerAddressOptions = {},
) {
    const { onBlockNumber, gasLimitMultiplier = DefaultGasLimitMultiplier } = options

    await networkPreflight(chainId)

    const signer = await getSigner()

    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Revoke staking agent', async () => {
        const controllerRoleId = await operatorContract.CONTROLLER_ROLE()

        const estimatedGasLimit = await operatorContract.revokeRole.estimateGas(
            controllerRoleId,
            address,
        )

        const gasLimit = toBigInt(
            toBN(estimatedGasLimit).multipliedBy(gasLimitMultiplier),
        )

        const tx = await operatorContract.revokeRole(controllerRoleId, address, {
            gasLimit,
        })

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await onBlockNumber?.(receipt.blockNumber)
        }
    })
}

export async function processOperatorUndelegationQueue(
    chainId: number,
    operatorId: string,
    options: { onBlockNumber?: (blockNumber: number) => void | Promise<void> } = {},
) {
    await networkPreflight(chainId)

    const signer = await getSigner()
    const operatorContract = new Contract(
        operatorId,
        getContractAbi('operator'),
        signer,
    ) as unknown as Operator

    await toastedOperation('Process undelegation queue', async () => {
        const tx = await operatorContract.payOutQueue(0)

        const receipt = await tx.wait()

        if (receipt?.blockNumber) {
            await options.onBlockNumber?.(receipt.blockNumber)
        }
    })
}
