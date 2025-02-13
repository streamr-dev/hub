import CopyIcon from '@atlaskit/icon/glyph/copy'
import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { Alert } from '~/components/Alert'
import { SponsorshipDecimals } from '~/components/Decimals'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { getSelfDelegationFraction } from '~/getters'
import { useConfigValueFromChain, useMediaQuery } from '~/hooks'
import { useAllOperatorsForWalletQuery } from '~/hooks/operators'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { Heartbeat, useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import { SelectField2 } from '~/marketplace/components/SelectField2'
import FormModal, {
    CopyButtonWrapAppendix,
    ErrorLabel,
    FieldWrap,
    FormModalProps,
    MaxButton,
    Prop,
    PropList,
    PropValue,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import { Operator } from '~/parsers/Operator'
import { Sponsorship } from '~/parsers/Sponsorship'
import { stakeOnSponsorship } from '~/services/sponsorships'
import SvgIcon from '~/shared/components/SvgIcon'
import Label from '~/shared/components/Ui/Label'
import useCopy from '~/shared/hooks/useCopy'
import { useWalletAccount } from '~/shared/stores/wallet'
import Toast from '~/shared/toasts/Toast'
import { isNodeVersionGreaterThanOrEqualTo } from '~/shared/utils/nodeVersion'
import { COLORS } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import { humanize } from '~/shared/utils/time'
import { waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import { toBN, toBigInt, toFloat } from '~/utils/bn'
import { RejectionReason, isMessagedObject } from '~/utils/exceptions'
import { Route as R } from '~/utils/routes'
import { errorToast } from '~/utils/toast'

interface Props extends Pick<FormModalProps, 'onReject'> {
    amount?: string
    chainId: number
    onResolve?: () => void
    preselectedOperator: Operator
    sponsorship: Sponsorship
}

const limitErrorToaster = toaster(Toast, Layer.Toast)

const requiredNodeVersion = '102.0.0'

function JoinSponsorshipModal({
    chainId,
    onResolve,
    preselectedOperator,
    sponsorship,
    ...props
}: Props) {
    const { decimals = 18n } = useSponsorshipTokenInfo() || {}

    const wallet = useWalletAccount()

    const { data: operatorChoices = null } = useAllOperatorsForWalletQuery(wallet)

    const [operator, setSelectedOperator] = useState(preselectedOperator)

    const { id: operatorId, dataTokenBalanceWei: operatorBalance, metadata } = operator

    const hasUndelegationQueue = operator.queueEntries.length > 0

    const { streamId } = sponsorship

    const [busy, setBusy] = useState(false)

    const [rawAmount, setRawAmount] = useState('')

    const amount = ((a: bigint) => (a > 0n ? a : 0n))(toBigInt(rawAmount || 0, decimals))

    const heartbeats = useInterceptHeartbeats(operatorId)

    const { count: liveNodesCount, isLoading: liveNodesCountLoading } =
        useOperatorLiveNodes(heartbeats)

    const liveNodesOk =
        (!liveNodesCountLoading && liveNodesCount > 0) ||
        /**
         * Relax live node checking for broken operators (v1) as they cannot join the recovery
         * sponsorship otherwise.
         */
        operator.contractVersion === 1

    const insufficientFunds = amount > operatorBalance

    const minimumSelfDelegationFraction =
        useConfigValueFromChain('minimumSelfDelegationFraction', (value) =>
            toFloat(value, decimals),
        ) || toBN(0)

    const minimumSelfDelegationAmount = toBigInt(
        toBN(operator.valueWithoutEarnings).multipliedBy(minimumSelfDelegationFraction),
    )

    const earlyLeaverPenaltyWei = useConfigValueFromChain('earlyLeaverPenaltyWei') || 0n

    const ownerDelegationPercentage = useMemo(
        () => getSelfDelegationFraction(operator),
        [operator],
    )

    const currentSelfDelegationAmount = toBigInt(
        toBN(operator.valueWithoutEarnings).multipliedBy(ownerDelegationPercentage),
    )

    const isBelowSelfFundingLimit = ownerDelegationPercentage.isLessThan(
        minimumSelfDelegationFraction,
    )

    const minimumStakeWei = useConfigValueFromChain('minimumStakeWei')

    const isAboveMinimumStake = minimumStakeWei != null && amount >= minimumStakeWei

    const canSubmit =
        amount > 0n &&
        !insufficientFunds &&
        liveNodesOk &&
        isAboveMinimumStake &&
        !hasUndelegationQueue &&
        !isBelowSelfFundingLimit

    const { copy } = useCopy()

    const limitedSpace = useMediaQuery('screen and (max-width: 460px)')

    const clean = amount === 0n

    return (
        <FormModal
            {...props}
            title="Join Sponsorship as Operator"
            canSubmit={canSubmit && !busy}
            submitLabel="Join"
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (clean || reason !== RejectionReason.Backdrop)
            }
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    await stakeOnSponsorship(
                        chainId,
                        sponsorship.id,
                        amount,
                        operator.id,
                        {
                            onReceipt: ({ blockNumber }) =>
                                waitForIndexedBlock(chainId, blockNumber),
                        },
                    )

                    onResolve?.()
                } catch (e) {
                    if (isMessagedObject(e) && /error_tooManyOperators/.test(e.message)) {
                        return void errorToast(
                            {
                                title: 'Limit reached',
                                desc: 'All operator slots are taken.',
                            },
                            limitErrorToaster,
                        )
                    }

                    throw e
                } finally {
                    setBusy(false)
                }
            }}
        >
            <SectionHeadline>
                Please set the amount of <SponsorshipPaymentTokenName /> to stake on the
                selected Sponsorship
            </SectionHeadline>
            <Section>
                <Label $wrap>Sponsorship Stream ID</Label>
                <FieldWrap $grayedOut>
                    <TextInput defaultValue={streamId} readOnly />
                    {!!streamId && (
                        <CopyButtonWrapAppendix>
                            <button type="button" onClick={() => void copy(streamId)}>
                                <CopyIcon label="Copy" size="small" />
                            </button>
                        </CopyButtonWrapAppendix>
                    )}
                </FieldWrap>
                <StyledLabelWrap>
                    <Label $wrap>Amount to stake</Label>
                    {rawAmount !== '' && !isAboveMinimumStake && (
                        <ErrorLabel>
                            Minimum value is{' '}
                            <SponsorshipDecimals amount={minimumStakeWei || 0n} />
                        </ErrorLabel>
                    )}
                </StyledLabelWrap>
                <FieldWrap $invalid={rawAmount !== '' && !isAboveMinimumStake}>
                    <TextInput
                        autoFocus
                        name="amount"
                        onChange={({ target }) => void setRawAmount(target.value)}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        step="any"
                        value={rawAmount}
                    />
                    <MaxButton
                        onClick={() => {
                            setRawAmount(toFloat(operatorBalance, decimals).toString())
                        }}
                    />
                    <TextAppendix>
                        <SponsorshipPaymentTokenName />
                    </TextAppendix>
                </FieldWrap>
                <PropList>
                    <li>
                        <Prop>Minimum stake duration</Prop>
                        <PropValue>
                            {humanize(sponsorship.minimumStakingPeriodSeconds)}
                        </PropValue>
                    </li>
                    <li>
                        <Prop $invalid={insufficientFunds}>
                            {insufficientFunds ? (
                                <>Not enough balance in Operator</>
                            ) : (
                                <>Available balance in Operator</>
                            )}
                        </Prop>
                        <PropValue>
                            <SponsorshipDecimals
                                abbr={limitedSpace}
                                amount={operatorBalance}
                                tooltip={limitedSpace}
                            />
                        </PropValue>
                    </li>
                    <li>
                        <Prop>Operator</Prop>
                        <PropValue>
                            {operatorChoices?.length === 1 ? (
                                <>
                                    {metadata.name != null
                                        ? `${metadata.name} (${truncate(operatorId)})`
                                        : operatorId}
                                </>
                            ) : (
                                <>
                                    <SelectField2
                                        placeholder="Operator"
                                        options={
                                            operatorChoices?.map((o) => ({
                                                value: o.id,
                                                label: `${o.metadata.name} (${truncate(
                                                    o.id,
                                                )})`,
                                            })) ?? []
                                        }
                                        value={operator.id}
                                        onChange={(id) => {
                                            const selectedOp = operatorChoices?.find(
                                                (o) => o.id === id,
                                            )

                                            if (selectedOp) {
                                                setSelectedOperator(selectedOp)
                                            }
                                        }}
                                        whiteVariant
                                        isClearable={false}
                                    />
                                </>
                            )}
                        </PropValue>
                    </li>
                </PropList>
            </Section>
            {isBelowSelfFundingLimit && (
                <StyledAlert type="error" title="Low self-funding">
                    You cannot stake on Sponsorships because your Operator is below the
                    self-funding requirement of{' '}
                    {minimumSelfDelegationFraction.multipliedBy(100).toFixed(0)}%.
                    Increase your Operator stake by at least{' '}
                    <SponsorshipDecimals
                        amount={minimumSelfDelegationAmount - currentSelfDelegationAmount}
                    />{' '}
                    to continue.
                </StyledAlert>
            )}
            {hasUndelegationQueue && (
                <StyledAlert type="error" title="Warning!">
                    Cannot stake on sponsorship while delegators are awaiting undelegation
                </StyledAlert>
            )}
            {!isBelowSelfFundingLimit && !hasUndelegationQueue && (
                <LiveNodesAndVersionCheck
                    liveNodesCountLoading={liveNodesCountLoading}
                    liveNodesCount={liveNodesCount}
                    heartbeats={heartbeats}
                />
            )}
            {sponsorship.minimumStakingPeriodSeconds > 0 && (
                <StyledAlert
                    type="error"
                    title={
                        <>
                            This Sponsorship has a minimum staking period of{' '}
                            {humanize(sponsorship.minimumStakingPeriodSeconds)}. If you
                            unstake or get voted out during this period, you will lose{' '}
                            <SponsorshipDecimals amount={earlyLeaverPenaltyWei} /> in
                            addition to the normal slashing penalty.
                        </>
                    }
                />
            )}
        </FormModal>
    )
}

interface LiveNodesCheckProps {
    liveNodesCountLoading: boolean
    liveNodesCount: number
    heartbeats: Record<string, Heartbeat | undefined>
}

function LiveNodesAndVersionCheck({
    liveNodesCountLoading,
    liveNodesCount,
    heartbeats,
}: LiveNodesCheckProps) {
    const [hasWaitedForHeartbeats, setHasWaitedForHeartbeats] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasWaitedForHeartbeats(true)
        }, 6000) // Wait for 6 seconds to ensure heartbeats are available from ~all nodes

        return () => clearTimeout(timer)
    }, [])

    if (!hasWaitedForHeartbeats || liveNodesCountLoading) {
        return (
            <StyledAlert type="loading" title="Checking Streamr nodes">
                <span>
                    In order to continue, you need to have, 1 or more Streamr nodes
                    running, and have them all be correctly configured. All of your nodes
                    must be running version {requiredNodeVersion} or higher. You are
                    vulnerable to slashing if you stake with misconfigured nodes.
                </span>
            </StyledAlert>
        )
    }

    const nodeVersions = Object.values(heartbeats).map(
        (heartbeat) => heartbeat?.applicationVersion,
    )
    const areAllNodesRunningRequiredVersion = nodeVersions.every((version) => {
        // If version is undefined (old node) or null, treat it as not meeting the requirement
        if (!version) {
            return false
        }
        return isNodeVersionGreaterThanOrEqualTo(version, requiredNodeVersion)
    })
    if (!areAllNodesRunningRequiredVersion) {
        return (
            <StyledAlert type="error" title="Streamr nodes are outdated">
                <p>
                    The minimum required version for all of your Streamr nodes is{' '}
                    {requiredNodeVersion} or higher. Please update your nodes.
                </p>
                <a
                    href={R.docs('/guides/how-to-update-your-streamr-node/')}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    How to upgrade a Streamr node <LinkIcon name="externalLink" />
                </a>
            </StyledAlert>
        )
    }

    if (liveNodesCount > 0) {
        return (
            <StyledAlert type="success" title="Streamr nodes detected">
                <span>
                    Once you stake, your nodes will start working on the stream. Please
                    ensure your nodes have enough resources available to handle the
                    traffic in the stream.
                </span>
            </StyledAlert>
        )
    }

    return (
        <StyledAlert type="error" title="Streamr nodes not detected">
            <p>
                In order to continue, you need to have one or more Streamr nodes running
                and correctly configured. You will be slashed if you stake without your
                nodes contributing resources to the stream.
            </p>
            <a
                href={R.docs('/node-runners/run-a-node')}
                target="_blank"
                rel="noreferrer noopener"
            >
                How to run a Streamr node <LinkIcon name="externalLink" />
            </a>
        </StyledAlert>
    )
}

const StyledAlert = styled(Alert)`
    margin-top: 16px;

    a {
        color: ${COLORS.link};
        display: flex;
        align-items: center;
    }
`

const LinkIcon = styled(SvgIcon)`
    width: 24px;
`

const StyledLabelWrap = styled(WingedLabelWrap)`
    margin-top: 10px;
`

export const joinSponsorshipModal = toaster(JoinSponsorshipModal, Layer.Modal)
