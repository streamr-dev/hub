import React, { FunctionComponent, useMemo } from 'react'
import styled from 'styled-components'
import { truncate } from '~/shared/utils/text'
import { BlackTooltip } from '~/shared/components/Tooltip/Tooltip'
import Button from '~/shared/components/Button'
import useCopy from '~/shared/hooks/useCopy'
import SvgIcon from '~/shared/components/SvgIcon'
import useOperatorLiveNodes from '~/hooks/useOperatorLiveNodes'
import routes from '~/routes'
import { OperatorElement } from '~/types/operator'
import { calculateOperatorSpotAPY } from '~/utils/apy'
import { getDelegationAmountForAddress } from '~/utils/delegation'
import { fromAtto } from '~/marketplace/utils/math'
import { useWalletAccount } from '~/shared/stores/wallet'
import { BN } from '~/utils/bn'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { SimpleDropdown } from '~/components/SimpleDropdown'
import Spinner from '~/shared/components/Spinner'
import { getBlockExplorerUrl } from '~/getters/getBlockExplorerUrl'
import useTokenInfo from '~/hooks/useTokenInfo'
import { defaultChainConfig } from '~/getters/getChainConfig'
import getCoreConfig from '~/getters/getCoreConfig'
import { useDelegateAndUndelegateFunds } from '~/hooks/useDelegateAndUndelegateFunds'
import { Separator } from '~/components/Separator'
import StatGrid, { StatCell } from '~/components/StatGrid'
import { TABLET } from '~/shared/utils/styled'
import {
    NetworkActionBarBackButtonAndTitle,
    NetworkActionBarBackButtonIcon,
    NetworkActionBarBackLink,
    NetworkActionBarCaret,
    NetworkActionBarCTAs,
    NetworkActionBarInfoButton,
    NetworkActionBarInfoButtons,
    NetworkActionBarStatsTitle,
    NetworkActionBarTitle,
    SingleElementPageActionBar,
    SingleElementPageActionBarContainer,
    SingleElementPageActionBarTopPart,
} from './NetworkActionBar.styles'

export const OperatorActionBar: FunctionComponent<{
    operator: OperatorElement
    handleEdit: (operator: OperatorElement) => void
    onDelegationChange: () => void
}> = ({ operator, handleEdit, onDelegationChange }) => {
    const { copy } = useCopy()
    const { count: liveNodeCount, isLoading: liveNodeCountIsLoading } =
        useOperatorLiveNodes(operator.id)
    const walletAddress = useWalletAccount()
    const canEdit = !!walletAddress && walletAddress == operator.owner

    const ownerDelegationPercentage = useMemo(() => {
        const stake = getDelegationAmountForAddress(operator.owner, operator)
        if (stake.isEqualTo(BN(0)) || operator.valueWithoutEarnings.isEqualTo(BN(0))) {
            return BN(0)
        }
        return stake.dividedBy(operator.valueWithoutEarnings).multipliedBy(100)
    }, [operator])

    const { delegateFunds, undelegateFunds } = useDelegateAndUndelegateFunds()

    const tokenInfo = useTokenInfo(
        defaultChainConfig.contracts[getCoreConfig().sponsorshipPaymentToken],
        defaultChainConfig.id,
    )
    const tokenSymbol = tokenInfo?.symbol || 'DATA'

    return (
        <SingleElementPageActionBar>
            <SingleElementPageActionBarContainer>
                <SingleElementPageActionBarTopPart>
                    <div>
                        <NetworkActionBarBackButtonAndTitle>
                            <NetworkActionBarBackLink to={routes.network.operators()}>
                                <NetworkActionBarBackButtonIcon
                                    name={'backArrow'}
                                ></NetworkActionBarBackButtonIcon>
                            </NetworkActionBarBackLink>
                            <NetworkActionBarTitle>
                                {operator.metadata?.imageUrl ? (
                                    <HubImageAvatar
                                        src={operator.metadata.imageUrl}
                                        alt={operator.metadata.name || operator.id}
                                    />
                                ) : (
                                    <HubAvatar id={operator.id} />
                                )}
                                <span>{operator.metadata?.name || operator.id}</span>
                            </NetworkActionBarTitle>
                        </NetworkActionBarBackButtonAndTitle>
                        <NetworkActionBarInfoButtons>
                            {canEdit && (
                                <NetworkActionBarInfoButton
                                    className="pointer bold"
                                    onClick={() => handleEdit(operator)}
                                >
                                    <span>Edit Operator</span>
                                    <SvgIcon name={'pencil'} />
                                </NetworkActionBarInfoButton>
                            )}
                            <SimpleDropdown
                                toggleElement={
                                    <NetworkActionBarInfoButton className="pointer bold">
                                        <SvgIcon name="page" />
                                        About Operators
                                        <NetworkActionBarCaret name="caretDown" />
                                    </NetworkActionBarInfoButton>
                                }
                                dropdownContent={
                                    <AboutOperatorsContent>
                                        {operator.metadata?.description && (
                                            <p>{operator.metadata.description}</p>
                                        )}
                                        Operators secure and stabilize the Streamr Network
                                        by running nodes and contributing bandwidth. In
                                        exchange, they earn {tokenSymbol} tokens from
                                        sponsorships they stake on. The stake guarantees
                                        that the operators do the work, otherwise they get
                                        slashed. Learn more{' '}
                                        <a
                                            href="https://docs.streamr.network/streamr-network/network-incentives"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                        >
                                            here
                                        </a>
                                        .
                                    </AboutOperatorsContent>
                                }
                            />
                            <NetworkActionBarInfoButton>
                                <span>
                                    Owner: <strong>{truncate(operator.owner)}</strong>
                                </span>
                                <span>
                                    <SvgIcon
                                        name="copy"
                                        className="icon"
                                        data-tooltip-id="copy-sponsorship-address"
                                        onClick={() =>
                                            copy(operator.owner, {
                                                toastMessage: 'Copied!',
                                            })
                                        }
                                    />
                                    <BlackTooltip
                                        id="copy-sponsorship-address"
                                        openOnClick={false}
                                    >
                                        Copy address
                                    </BlackTooltip>
                                </span>
                                <a
                                    href={`${getBlockExplorerUrl()}/address/${
                                        operator.owner
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <SvgIcon name="externalLink" />
                                </a>
                            </NetworkActionBarInfoButton>

                            <NetworkActionBarInfoButton>
                                <span>
                                    Contract <strong>{truncate(operator.id)}</strong>
                                </span>
                                <span>
                                    <SvgIcon
                                        name="copy"
                                        className="icon"
                                        data-tooltip-id="copy-sponsorship-address"
                                        onClick={() =>
                                            copy(operator.id, {
                                                toastMessage: 'Copied!',
                                            })
                                        }
                                    />
                                    <BlackTooltip
                                        id="copy-sponsorship-address"
                                        openOnClick={false}
                                    >
                                        Copy address
                                    </BlackTooltip>
                                </span>
                                <a
                                    href={`${getBlockExplorerUrl()}/address/${
                                        operator.id
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <SvgIcon name="externalLink" />
                                </a>
                            </NetworkActionBarInfoButton>
                        </NetworkActionBarInfoButtons>
                    </div>
                    <NetworkActionBarCTAs>
                        <Button
                            onClick={async () => {
                                try {
                                    await delegateFunds(operator)
                                    onDelegationChange()
                                } catch (e) {
                                    console.warn(e)
                                }
                            }}
                            disabled={walletAddress == null}
                        >
                            Delegate
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    await undelegateFunds(operator)
                                    onDelegationChange()
                                } catch (e) {
                                    console.warn(e)
                                }
                            }}
                            disabled={walletAddress == null}
                        >
                            Undelegate
                        </Button>
                    </NetworkActionBarCTAs>
                </SingleElementPageActionBarTopPart>
                <NetworkActionBarStatsTitle>Operator summary</NetworkActionBarStatsTitle>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="Total value">
                            {fromAtto(operator.valueWithoutEarnings).toString()}
                        </StatCell>
                        <StatCell label="Deployed stake">
                            {fromAtto(operator.totalStakeInSponsorshipsWei).toString()}
                        </StatCell>
                        <StatCell label="Owner's delegation">
                            {ownerDelegationPercentage.toFixed(0)}%
                        </StatCell>
                        <StatCell label="Redundancy factor">
                            {operator.metadata?.redundancyFactor?.toString() || '1'}
                        </StatCell>
                    </StatGrid>
                </Pad>
                <Separator />
                <Pad>
                    <StatGrid>
                        <StatCell label="Operator's cut">
                            {operator.operatorsCutFraction.toString()}%
                        </StatCell>
                        <StatCell label="Spot APY">
                            {calculateOperatorSpotAPY(operator).toFixed(0)}%
                        </StatCell>
                        <StatCell label="Cumulative earnings">
                            {fromAtto(
                                operator.cumulativeProfitsWei.plus(
                                    operator.cumulativeOperatorsCutWei,
                                ),
                            ).toString()}
                        </StatCell>
                        <StatCell label="Live nodes">
                            <>
                                {liveNodeCountIsLoading ? (
                                    <Spinner color="blue" />
                                ) : (
                                    liveNodeCount.toString()
                                )}
                            </>
                        </StatCell>
                    </StatGrid>
                </Pad>
            </SingleElementPageActionBarContainer>
        </SingleElementPageActionBar>
    )
}

const AboutOperatorsContent = styled.div`
    margin: 0;
    min-width: 250px;
`

export const Pad = styled.div`
    padding: 20px 0;

    @media ${TABLET} {
        padding: 32px 40px;
    }
`
