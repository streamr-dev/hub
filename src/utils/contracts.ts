import { Interface, InterfaceAbi } from 'ethers'
import {
    ERC677ABI as erc677ABI,
    operatorABI,
    operatorFactoryABI,
    sponsorshipABI,
    streamrConfigABI,
} from 'network-contracts-ethers6'
import { MarketplaceV4__factory, ProjectRegistryV1__factory } from '~/generated/types/hub'
import { Token__factory } from '~/generated/types/local'
import { getChainConfig, getChainConfigExtension } from '~/utils/chains'

type ContractKey =
    | 'projectRegistry'
    | 'erc20'
    | 'config'
    | 'marketplace'
    | 'sponsorship'
    | 'operatorFactory'
    | 'operator'
    | 'erc677'

export function getContractAbi(contractKey: ContractKey): Interface | InterfaceAbi {
    switch (contractKey) {
        case 'config':
            return streamrConfigABI
        case 'projectRegistry':
            return ProjectRegistryV1__factory.abi
        case 'erc20':
            return Token__factory.abi
        case 'marketplace':
            return MarketplaceV4__factory.abi
        case 'sponsorship':
            return sponsorshipABI
        case 'operatorFactory':
            return operatorFactoryABI
        case 'operator':
            return operatorABI
        case 'erc677':
            return erc677ABI
    }
}

type ContractAddressKey =
    | Exclude<ContractKey, 'erc20' | 'operator' | 'sponsorship' | 'erc677'>
    | 'data'
    | 'operatorDefaultDelegationPolicy'
    | 'operatorDefaultExchangeRatePolicy'
    | 'operatorDefaultUndelegationPolicy'
    | 'sponsorshipDefaultLeavePolicy'
    | 'sponsorshipFactory'
    | 'sponsorshipMaxOperatorsJoinPolicy'
    | 'sponsorshipStakeWeightedAllocationPolicy'
    | 'sponsorshipVoteKickPolicy'
    | 'sponsorshipPaymentToken'
    | 'streamRegistry'
    | 'streamStorage'
    | 'dataUnionFactory'

export function getContractAddress(
    addressKey: ContractAddressKey,
    chainId: number,
): string {
    const { contracts } = getChainConfig(chainId)

    const address = (() => {
        switch (addressKey) {
            case 'config':
                return contracts.StreamrConfig
            case 'marketplace':
                return (
                    contracts.MarketplaceV4 ||
                    contracts.RemoteMarketplaceV1 ||
                    contracts.MarketplaceV3
                )
            case 'operatorFactory':
                return contracts.OperatorFactory
            case 'projectRegistry':
                return contracts.ProjectRegistryV1
            case 'data':
                return contracts.DATA
            case 'operatorDefaultDelegationPolicy':
                return contracts.OperatorDefaultDelegationPolicy
            case 'operatorDefaultExchangeRatePolicy':
                return contracts.OperatorDefaultExchangeRatePolicy
            case 'operatorDefaultUndelegationPolicy':
                return contracts.OperatorDefaultUndelegationPolicy
            case 'sponsorshipPaymentToken':
                return contracts[getChainConfigExtension(chainId).sponsorshipPaymentToken]
            case 'sponsorshipDefaultLeavePolicy':
                return contracts.SponsorshipDefaultLeavePolicy
            case 'sponsorshipFactory':
                return contracts.SponsorshipFactory
            case 'sponsorshipMaxOperatorsJoinPolicy':
                return contracts.SponsorshipMaxOperatorsJoinPolicy
            case 'sponsorshipStakeWeightedAllocationPolicy':
                return contracts.SponsorshipStakeWeightedAllocationPolicy
            case 'sponsorshipVoteKickPolicy':
                return contracts.SponsorshipVoteKickPolicy
            case 'streamRegistry':
                return contracts.StreamRegistry
            case 'streamStorage':
                return contracts.StreamStorageRegistry
            case 'dataUnionFactory':
                return contracts.DataUnionFactory
        }
    })()

    if (!address) {
        throw new Error(`No "${addressKey}" contract address found for chain ${chainId}`)
    }

    return address
}
