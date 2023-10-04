import React from 'react'
import { toaster } from 'toasterhea'
import moment from 'moment'
import { Sponsorship, sponsorshipABI } from '@streamr/network-contracts'
import { config } from '@streamr/config'
import { Contract } from 'ethers'
import getSponsorshipTokenInfo from '~/getters/getSponsorshipTokenInfo'
import FundSponsorshipModal from '~/modals/FundSponsorshipModal'
import { ParsedOperator } from '~/parsers/OperatorParser'
import { ParsedSponsorship } from '~/parsers/SponsorshipParser'
import { Layer } from '~/utils/Layer'
import {
    forceUnstakeFromSponsorship,
    fundSponsorship as fundSponsorshipService,
    reduceStakeOnSponsorship,
    stakeOnSponsorship,
} from '~/services/sponsorships'
import { isRejectionReason } from '~/modals/BaseModal'
import EditStakeModal from '~/modals/EditStakeModal'
import { toBN } from '~/utils/bn'
import { confirm } from '~/getters/confirm'
import { fromDecimals } from '~/marketplace/utils/math'
import { getPublicWeb3Provider } from '~/shared/stores/wallet'
import getCoreConfig from '~/getters/getCoreConfig'
import JoinSponsorshipModal from '~/modals/JoinSponsorshipModal'
import CreateSponsorshipModal from '~/modals/CreateSponsorshipModal'
import { createSponsorship as createSponsorshipService } from '~/services/sponsorships'
import { getCustomTokenBalance } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'

/**
 * Scouts for Operator's funding share.
 */
function getSponsorshipStakeForOperator(
    sponsorship: ParsedSponsorship,
    operatorId: string,
) {
    return sponsorship.stakes.find(
        (stake) => stake.operatorId === operatorId && stake.amount.isGreaterThan(0),
    )
}

/**
 * Checks if a given Operator funds a given Sponsorship.
 */
export function isSponsorshipFundedByOperator(
    sponsorship: ParsedSponsorship,
    operator: ParsedOperator | null,
): boolean {
    return !!operator && !!getSponsorshipStakeForOperator(sponsorship, operator.id)
}

const fundSponsorshipModal = toaster(FundSponsorshipModal, Layer.Modal)

/**
 * Takes the user through the process of funding a Sponsorship (with
 * the modal and input validation).
 */
export async function fundSponsorship(
    sponsorshipId: string,
    payoutPerDay: string,
    wallet: string,
) {
    const { decimals, symbol: tokenSymbol } = await getSponsorshipTokenInfo()

    const balance = (await getBalanceForSponsorship(wallet)).toString()

    try {
        await fundSponsorshipModal.pop({
            decimals,
            tokenSymbol,
            balance,
            payoutPerDay,
            async onSubmit(value) {
                await fundSponsorshipService(sponsorshipId, value)
            },
        })
    } catch (e) {
        if (!isRejectionReason(e)) {
            throw e
        }
    }
}

const editStakeModal = toaster(EditStakeModal, Layer.Modal)

/**
 * Takes the user through the process of modifying their Sponsorship
 * funding stake.
 */
export async function editSponsorshipFunding(
    sponsorship: ParsedSponsorship,
    operator: ParsedOperator,
) {
    const stake = getSponsorshipStakeForOperator(sponsorship, operator.id)

    if (!stake) {
        throw new Error('No fund to edit')
    }

    const { decimals, symbol: tokenSymbol } = await getSponsorshipTokenInfo()

    const leavePenaltyWei = await getSponsorshipLeavePenalty(sponsorship.id, operator.id)

    const joinDate = moment(stake.joinDate, 'X')

    const minLeaveDate = joinDate
        .add(sponsorship.minimumStakingPeriodSeconds, 'seconds')
        .format('YYYY-MM-DD HH:mm')

    try {
        await editStakeModal.pop({
            currentStake: stake.amount.toString(),
            operatorBalance: operator.dataTokenBalanceWei.toString(),
            tokenSymbol,
            decimals,
            leavePenalty: leavePenaltyWei.toString(),
            minLeaveDate,
            hasUndelegationQueue: operator.queueEntries.length > 0,
            async onSubmit(amount, difference, forceUnstake = false) {
                const differenceBN = toBN(difference)

                if (differenceBN.isGreaterThanOrEqualTo(0)) {
                    return void (await stakeOnSponsorship(
                        sponsorship.id,
                        difference,
                        operator.id,
                        'Increase stake on sponsorship',
                    ))
                }

                if (!forceUnstake) {
                    return void (await reduceStakeOnSponsorship(
                        sponsorship.id,
                        amount,
                        operator.id,
                        amount === '0'
                            ? 'Unstake from sponsorship'
                            : 'Reduce stake on sponsorship',
                    ))
                }

                if (
                    await confirm({
                        title: 'Your stake will be slashed',
                        description: (
                            <>
                                Your minimum staking period is still ongoing and ends on
                                {minLeaveDate}. If you unstake now, you will lose
                                {fromDecimals(leavePenaltyWei, decimals).toString()}
                                {tokenSymbol}
                            </>
                        ),
                        proceedLabel: 'Proceed anyway',
                        cancelLabel: 'Cancel',
                    })
                ) {
                    return void (await forceUnstakeFromSponsorship(
                        sponsorship.id,
                        operator.id,
                    ))
                }
            },
        })
    } catch (e) {
        if (!isRejectionReason(e)) {
            throw e
        }
    }
}

/**
 * Gets the current Sponsorship leave penalty for a given Operator.
 */
async function getSponsorshipLeavePenalty(sponsorshipId: string, operatorId: string) {
    const { id: chainId } = config[getCoreConfig().defaultChain || 'polygon']

    const contract = new Contract(
        sponsorshipId,
        sponsorshipABI,
        getPublicWeb3Provider(chainId),
    ) as Sponsorship

    return toBN(await contract.getLeavePenalty(operatorId))
}

const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)

/**
 * Takes the user through the process of joining a Sponsorship as an Operator.
 */
export async function joinSponsorshipAsOperator(
    sponsorshipId: string,
    operator: ParsedOperator,
    streamId: string,
) {
    const { symbol: tokenSymbol, decimals } = await getSponsorshipTokenInfo()

    try {
        await joinSponsorshipModal.pop({
            streamId,
            operatorId: operator.id,
            hasUndelegationQueue: operator.queueEntries.length > 0,
            operatorBalance: operator.dataTokenBalanceWei.toString(),
            tokenSymbol,
            decimals,
            async onSubmit(amount) {
                await stakeOnSponsorship(sponsorshipId, amount, operator.id)
            },
        })
    } catch (e) {
        if (!isRejectionReason(e)) {
            throw e
        }
    }
}

const createSponsorshipModal = toaster(CreateSponsorshipModal, Layer.Modal)

/**
 * Takes the user through the process of creating a Sponsorship.
 */
export async function createSponsorship(wallet: string) {
    const { symbol: tokenSymbol, decimals: tokenDecimals } =
        await getSponsorshipTokenInfo()

    const balance = (await getBalanceForSponsorship(wallet)).toString()

    await createSponsorshipModal.pop({
        balance,
        tokenSymbol,
        tokenDecimals,
        async onSubmit(formData) {
            await createSponsorshipService(formData, {
                balance,
                tokenDecimals,
                tokenSymbol,
            })
        },
    })
}

/**
 * Fetches wallet's balance of the Sponsorship-native token
 * on the default chain.
 */
async function getBalanceForSponsorship(wallet: string) {
    return getCustomTokenBalance(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        wallet,
        defaultChainConfig.id,
    )
}