import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import {
    AddressItem,
    AddressTable,
    AddressType,
    useSubmitControllerAddressesCallback,
    useSubmitNodeAddressesCallback,
} from '~/components/AddressTable'
import { BehindBlockErrorDisplay } from '~/components/BehindBlockErrorDisplay'
import { ChartPeriodTabs } from '~/components/ChartPeriodTabs'
import { SponsorshipDecimals } from '~/components/Decimals'
import { NetworkHelmet } from '~/components/Helmet'
import { Hint } from '~/components/Hint'
import Layout, { LayoutColumn } from '~/components/Layout'
import NetworkChartDisplay from '~/components/NetworkChartDisplay'
import NetworkPageSegment, {
    Pad,
    SegmentGrid,
    TitleBar,
} from '~/components/NetworkPageSegment'
import { Separator } from '~/components/Separator'
import { StatCellContent, StatCellLabel } from '~/components/StatGrid'
import { StreamIdCell } from '~/components/Table'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { getDelegatedAmountForWallet, getDelegationFractionForWallet } from '~/getters'
import { getOperatorStats } from '~/getters/getOperatorStats'
import {
    useConfigValueFromChain,
    useInitialBehindIndexError,
    useLatestBehindBlockError,
    useRefetchQueryBehindIndexEffect,
} from '~/hooks'
import {
    invalidateActiveOperatorByIdQueries,
    useOperatorByIdQuery,
} from '~/hooks/operators'
import { useSponsorshipTokenInfo } from '~/hooks/sponsorships'
import { useInterceptHeartbeats } from '~/hooks/useInterceptHeartbeats'
import { LiveNodesTable } from '~/pages/OperatorPage/LiveNodesTable'
import { OperatorActionBar } from '~/pages/OperatorPage/OperatorActionBar'
import { OperatorChecklist } from '~/pages/OperatorPage/OperatorChecklist'
import { OperatorDetails } from '~/pages/OperatorPage/OperatorDetails'
import { OperatorSummary } from '~/pages/OperatorPage/OperatorSummary'
import { SponsorshipTable } from '~/pages/OperatorPage/SponsorshipTable'
import { UndelegationQueue } from '~/pages/OperatorPage/UndelegationQueue'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import { NoData } from '~/shared/components/NoData'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import SvgIcon from '~/shared/components/SvgIcon'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { NetworkChart } from '~/shared/components/TimeSeriesGraph'
import {
    formatLongDate,
    formatShortDate,
} from '~/shared/components/TimeSeriesGraph/chartUtils'
import { useWalletAccount } from '~/shared/stores/wallet'
import { LAPTOP, MAX_BODY_WIDTH, TABLET } from '~/shared/utils/styled'
import { useSetBlockDependency } from '~/stores/blockNumberDependencies'
import { ChartPeriod } from '~/types'
import { abbr } from '~/utils'
import { onIndexedBlock } from '~/utils/blocks'
import { toBN, toBigInt, toFloat } from '~/utils/bn'
import {
    useCurrentChainFullName,
    useCurrentChainId,
    useCurrentChainKey,
} from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { errorToast } from '~/utils/toast'

const defaultChartData = []

const defaultPersistedNodes = []

const defaultPersistedControllers = []

export const OperatorPage = () => {
    const operatorId = useParams().id

    const operatorQuery = useOperatorByIdQuery(operatorId)

    const operator = operatorQuery.data || null

    const initialBehindBlockError = useInitialBehindIndexError(operatorQuery, [
        operatorId,
    ])

    useRefetchQueryBehindIndexEffect(operatorQuery)

    const behindBlockError = useLatestBehindBlockError(operatorQuery)

    const isFetching =
        operatorQuery.isLoading || operatorQuery.isFetching || !!behindBlockError

    const walletAddress = useWalletAccount()

    const slashingFraction =
        useConfigValueFromChain('slashingFraction', (value) => toFloat(value, 18n)) ??
        null

    const minimumStakeWei = useConfigValueFromChain('minimumStakeWei')

    const isOwner =
        walletAddress != null &&
        operator != null &&
        walletAddress.toLowerCase() === operator.owner.toLowerCase()

    const isController =
        walletAddress != null &&
        operator != null &&
        operator.controllers.some(
            (c) => c.address.toLowerCase() === walletAddress.toLowerCase(),
        )

    const { symbol: tokenSymbol = 'DATA' } = useSponsorshipTokenInfo() || {}

    const [selectedDataSource, setSelectedDataSource] = useState<
        'totalValue' | 'cumulativeEarnings'
    >('cumulativeEarnings')

    const currentChainId = useCurrentChainId()

    const chainName = useCurrentChainKey()

    const earliestUndelegationTimestamp = operator?.delegations.find(
        (d) => d.delegator.toLowerCase() === walletAddress?.toLowerCase(),
    )?.earliestUndelegationTimestamp

    const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>(
        ChartPeriod.ThreeMonths,
    )

    const chartQuery = useQuery({
        queryKey: [
            'operatorChartQuery',
            currentChainId,
            operatorId,
            selectedPeriod,
            selectedDataSource,
        ],
        queryFn: async () => {
            try {
                if (!operatorId) {
                    return []
                }

                return await getOperatorStats(
                    currentChainId,
                    operatorId,
                    selectedPeriod,
                    selectedDataSource,
                    { force: true, ignoreToday: false },
                )
            } catch (_) {
                errorToast({ title: 'Could not load operator chart data' })
                return []
            }
        },
    })

    const { data: chartData = defaultChartData } = chartQuery

    const myDelegationAmount = useMemo(() => {
        if (!walletAddress || !operator) {
            return 0n
        }

        return getDelegatedAmountForWallet(walletAddress, operator)
    }, [operator, walletAddress])

    const myDelegationPercentage = useMemo(() => {
        if (!walletAddress || !operator) {
            return toBN(0)
        }

        return getDelegationFractionForWallet(walletAddress, operator).multipliedBy(100)
    }, [walletAddress, operator])

    const chartLabel =
        selectedDataSource === 'cumulativeEarnings'
            ? 'Cumulative earnings'
            : 'Total stake'

    const { nodes: persistedNodes = defaultPersistedNodes } = operator || {}

    const [nodes, setNodes] = useState(persistedNodes)

    useEffect(() => void setNodes(persistedNodes), [persistedNodes])

    const [saveNodeAddresses, isSavingNodeAddresses] = useSubmitNodeAddressesCallback()

    const { controllers: persistedControllers = defaultPersistedControllers } =
        operator || {}

    const [controllers, setControllers] = useState(persistedControllers)

    useEffect(() => void setControllers(persistedControllers), [persistedControllers])

    const [saveControllers, isSavingControllerAddresses] =
        useSubmitControllerAddressesCallback()

    const setBlockDependency = useSetBlockDependency()

    const heartbeats = useInterceptHeartbeats(operator?.id)

    const saveNodeAddressesCb = useCallback(
        async (addresses: string[]) => {
            if (!operatorId) {
                return
            }

            const chainId = currentChainId

            try {
                await saveNodeAddresses(chainId, operatorId, addresses, {
                    onSuccess(blockNumber) {
                        setNodes((current) => {
                            const newAddresses: AddressItem[] = []

                            current.forEach((node) => {
                                if (node.enabled) {
                                    newAddresses.push({
                                        ...node,
                                        persisted: true,
                                    })
                                }
                            })

                            return newAddresses
                        })

                        setBlockDependency(chainId, blockNumber, [
                            'operatorNodes',
                            operatorId,
                        ])

                        onIndexedBlock(chainId, blockNumber, () => {
                            invalidateActiveOperatorByIdQueries(chainId, operatorId)
                        })
                    },
                    onReject() {
                        // Undo changes
                        setNodes((current) =>
                            current
                                .filter((val) => val.persisted === true)
                                .map((n) => ({
                                    ...n,
                                    enabled: true,
                                })),
                        )
                    },
                    onError() {
                        errorToast({
                            title: 'Failed to save the new node addresses',
                        })
                    },
                })
            } catch (_) {}
        },
        [currentChainId, operatorId, saveNodeAddresses, setBlockDependency],
    )

    const saveControllerAddressesCb = useCallback(
        async (address: string, isNew: boolean) => {
            if (!operatorId) {
                return
            }

            const chainId = currentChainId

            try {
                await saveControllers(chainId, operatorId, address, isNew, {
                    onSuccess(blockNumber) {
                        setControllers((current) => {
                            const newAddresses: AddressItem[] = []

                            current.forEach((node) => {
                                if (node.enabled) {
                                    newAddresses.push({
                                        ...node,
                                        persisted: true,
                                    })
                                }
                            })

                            return newAddresses
                        })

                        setBlockDependency(chainId, blockNumber, [
                            'operatorNodes',
                            operatorId,
                        ])

                        onIndexedBlock(chainId, blockNumber, () => {
                            invalidateActiveOperatorByIdQueries(chainId, operatorId)
                        })
                    },
                    onReject() {
                        // Undo changes
                        setControllers((current) =>
                            current
                                .filter((val) => val.persisted === true)
                                .map((n) => ({
                                    ...n,
                                    enabled: true,
                                })),
                        )
                    },
                    onError() {
                        errorToast({
                            title: 'Failed to save the new controllers',
                        })
                    },
                })
            } catch (_) {}
        },
        [currentChainId, operatorId, saveControllers, setBlockDependency],
    )

    const fullChainName = useCurrentChainFullName()

    const placeholder = behindBlockError ? (
        <BehindBlockErrorDisplay
            latest={behindBlockError}
            initial={initialBehindBlockError || undefined}
        />
    ) : !isFetching ? (
        <NoData firstLine={`Operator not found on the ${fullChainName} chain.`} />
    ) : null

    return (
        <Layout>
            <NetworkHelmet title="Operator" />
            <LoadingIndicator loading={isFetching} />
            {!!operator && (
                <>
                    <OperatorActionBar operator={operator} />
                    <OperatorDetails operator={operator} />
                    <OperatorSummary operator={operator} />
                    {isOwner && (
                        <OperatorVersionNotice version={operator.contractVersion} />
                    )}
                </>
            )}
            <LayoutColumn>
                {operator == null ? (
                    placeholder
                ) : (
                    <SegmentGrid>
                        <ChartGrid>
                            <NetworkPageSegment title="Overview charts">
                                <Pad>
                                    <NetworkChartDisplay
                                        periodTabs={
                                            <ChartPeriodTabs
                                                value={selectedPeriod}
                                                onChange={setSelectedPeriod}
                                            />
                                        }
                                        sourceTabs={
                                            <Tabs
                                                selection={selectedDataSource}
                                                onSelectionChange={(dataSource) => {
                                                    if (
                                                        dataSource !== 'totalValue' &&
                                                        dataSource !==
                                                            'cumulativeEarnings'
                                                    ) {
                                                        return
                                                    }

                                                    setSelectedDataSource(dataSource)
                                                }}
                                            >
                                                <Tab id="cumulativeEarnings">
                                                    Cumulative earnings
                                                </Tab>
                                                <Tab id="totalValue">Total stake</Tab>
                                            </Tabs>
                                        }
                                    >
                                        <NetworkChart
                                            isLoading={
                                                chartQuery.isLoading ||
                                                chartQuery.isFetching
                                            }
                                            tooltipValuePrefix={chartLabel}
                                            graphData={chartData}
                                            xAxisDisplayFormatter={formatShortDate}
                                            yAxisAxisDisplayFormatter={abbr}
                                            tooltipLabelFormatter={formatLongDate}
                                            tooltipValueFormatter={(value) =>
                                                tooltipValueFormatter(value, tokenSymbol)
                                            }
                                        />
                                    </NetworkChartDisplay>
                                </Pad>
                            </NetworkPageSegment>
                            <div>
                                <SegmentGrid>
                                    <NetworkPageSegment
                                        title={isOwner ? 'My stake' : 'My delegation'}
                                    >
                                        {walletAddress ? (
                                            <>
                                                <DelegationCell>
                                                    <Pad>
                                                        <StatCellLabel>
                                                            Current stake
                                                            {operator.contractVersion >
                                                                0 &&
                                                                earliestUndelegationTimestamp !=
                                                                    null &&
                                                                earliestUndelegationTimestamp *
                                                                    1000 >
                                                                    Date.now() && (
                                                                    <Tooltip
                                                                        content={
                                                                            <>
                                                                                You can
                                                                                not
                                                                                undelegate
                                                                                because
                                                                                your
                                                                                minimum
                                                                                delegation
                                                                                period is
                                                                                still
                                                                                active. It
                                                                                will
                                                                                expire on{' '}
                                                                                {moment(
                                                                                    earliestUndelegationTimestamp *
                                                                                        1000,
                                                                                ).format(
                                                                                    'YYYY-MM-DD HH:mm',
                                                                                )}
                                                                                .
                                                                            </>
                                                                        }
                                                                    >
                                                                        <TooltipIconWrap
                                                                            className="ml-1"
                                                                            $color="#ADADAD"
                                                                            $svgSize={{
                                                                                width: '18px',
                                                                                height: '18px',
                                                                            }}
                                                                        >
                                                                            <SvgIcon name="lockClosed" />
                                                                        </TooltipIconWrap>
                                                                    </Tooltip>
                                                                )}
                                                        </StatCellLabel>
                                                        <StatCellContent>
                                                            <SponsorshipDecimals
                                                                abbr
                                                                amount={
                                                                    myDelegationAmount
                                                                }
                                                            />
                                                        </StatCellContent>
                                                    </Pad>
                                                </DelegationCell>
                                                <Separator />
                                                <DelegationCell>
                                                    <Pad>
                                                        <StatCellLabel>
                                                            Share of Operator&apos;s total
                                                            stake
                                                        </StatCellLabel>
                                                        <StatCellContent>
                                                            {myDelegationPercentage.toFixed(
                                                                0,
                                                            )}
                                                            %
                                                        </StatCellContent>
                                                    </Pad>
                                                </DelegationCell>
                                            </>
                                        ) : (
                                            <Pad>
                                                Connect your wallet to show your
                                                delegation.
                                            </Pad>
                                        )}
                                    </NetworkPageSegment>
                                    <NetworkPageSegment title="Operator status">
                                        <OperatorChecklist operatorId={operatorId} />
                                    </NetworkPageSegment>
                                </SegmentGrid>
                            </div>
                        </ChartGrid>
                        <NetworkPageSegment
                            foot
                            title={
                                <TitleBar label={operator.stakes.length}>
                                    Sponsorships
                                </TitleBar>
                            }
                        >
                            <SponsorshipTable
                                operator={operator}
                                isController={isController}
                            />
                        </NetworkPageSegment>
                        <NetworkPageSegment title="Undelegation queue">
                            <UndelegationQueue operatorId={operatorId} />
                        </NetworkPageSegment>
                        <NetworkPageSegment foot title="Slashing history">
                            <SlashingHistoryTableContainer>
                                <ScrollTable
                                    elements={operator.slashingEvents.sort(
                                        (a, b) => b.date - a.date,
                                    )}
                                    columns={[
                                        {
                                            displayName: 'Stream ID',
                                            valueMapper: ({ streamId }) => (
                                                <StreamIdCell streamId={streamId} />
                                            ),
                                            align: 'start',
                                            isSticky: true,
                                            key: 'id',
                                        },
                                        {
                                            displayName: 'Date',
                                            valueMapper: (element) =>
                                                moment(element.date * 1000).format(
                                                    'YYYY-MM-DD HH:mm',
                                                ),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'date',
                                        },
                                        {
                                            displayName: 'Slashed',
                                            valueMapper: (element) => (
                                                <SponsorshipDecimals
                                                    abbr
                                                    amount={element.amount}
                                                />
                                            ),
                                            align: 'start',
                                            isSticky: false,
                                            key: 'slashed',
                                        },
                                        {
                                            displayName: 'Reason',
                                            valueMapper: (element) => {
                                                if (
                                                    slashingFraction == null ||
                                                    minimumStakeWei == null
                                                ) {
                                                    return ''
                                                }

                                                if (
                                                    element.amount <
                                                    toBigInt(
                                                        slashingFraction.multipliedBy(
                                                            toBN(minimumStakeWei),
                                                        ),
                                                    )
                                                ) {
                                                    return 'False flag'
                                                }

                                                return 'Normal slashing'
                                            },
                                            align: 'start',
                                            isSticky: false,
                                            key: 'reason',
                                        },
                                    ]}
                                    linkMapper={({ sponsorshipId: id }) =>
                                        R.sponsorship(id, routeOptions(chainName))
                                    }
                                />
                            </SlashingHistoryTableContainer>
                        </NetworkPageSegment>
                        {isController && (
                            <NetworkPageSegment
                                title={
                                    <NodeAddressHeader>
                                        <span>Operator&apos;s node addresses</span>{' '}
                                        <div>
                                            <Hint>
                                                <p>
                                                    Your nodes need wallets for smart
                                                    contract interactions. Generate
                                                    Ethereum wallets using your tool of
                                                    choice, add the private key to your
                                                    node&apos;s config file, and add the
                                                    corresponding address here. You can
                                                    run multiple nodes with the same
                                                    address/private&nbsp;key.
                                                </p>
                                                <p>
                                                    Each node address should be supplied
                                                    with some POL on Polygon chain
                                                    for&nbsp;gas.
                                                </p>
                                            </Hint>
                                        </div>
                                    </NodeAddressHeader>
                                }
                            >
                                <AddressTable
                                    type={AddressType.Node}
                                    busy={isSavingNodeAddresses}
                                    value={nodes}
                                    onChange={setNodes}
                                    onAddAddress={async (address) => {
                                        const addresses = [
                                            ...nodes.map((n) => n.address),
                                            address,
                                        ]

                                        await saveNodeAddressesCb(addresses)
                                    }}
                                    onRemoveAddress={async (address) => {
                                        const addresses = nodes
                                            .filter((n) => n.address !== address)
                                            .map((n) => n.address)

                                        await saveNodeAddressesCb(addresses)
                                    }}
                                />
                            </NetworkPageSegment>
                        )}
                        {isController && (
                            <NetworkPageSegment
                                title={
                                    <NodeAddressHeader>
                                        <span>Staking agents</span>{' '}
                                        <div>
                                            <Hint>
                                                <p>
                                                    You can authorize certain addresses to
                                                    stake and unstake your Operator. These
                                                    addresses are not allowed to withdraw
                                                    funds out of the Operator. Such
                                                    addresses are useful for automation or
                                                    for using a &apos;hotter&apos; wallet
                                                    for convenience when managing your
                                                    day-to-day staking operations.
                                                </p>
                                            </Hint>
                                        </div>
                                    </NodeAddressHeader>
                                }
                            >
                                <AddressTable
                                    type={AddressType.Automation}
                                    busy={isSavingControllerAddresses}
                                    disableEditing={!isOwner}
                                    value={controllers.filter(
                                        (c) =>
                                            c.address.toLowerCase() !==
                                            operator.owner.toLowerCase(),
                                    )}
                                    onChange={setControllers}
                                    onAddAddress={(address) => {
                                        saveControllerAddressesCb(address, true)
                                    }}
                                    onRemoveAddress={(address) => {
                                        saveControllerAddressesCb(address, false)
                                    }}
                                />
                            </NetworkPageSegment>
                        )}
                        {isController && (
                            <NetworkPageSegment
                                title={
                                    <TitleBar label={Object.keys(heartbeats).length}>
                                        Live nodes
                                    </TitleBar>
                                }
                            >
                                <LiveNodesTable heartbeats={heartbeats} />
                            </NetworkPageSegment>
                        )}
                    </SegmentGrid>
                )}
            </LayoutColumn>
        </Layout>
    )
}

function tooltipValueFormatter(value: number, tokenSymbol: string) {
    return `${abbr(value)} ${tokenSymbol}`
}

const ChartGrid = styled(SegmentGrid)`
    grid-template-columns: minmax(0, 1fr);

    @media ${LAPTOP} {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }
`

const DelegationCell = styled.div`
    ${Pad} {
        padding-bottom: 12px;
        padding-top: 12px;
    }

    @media ${TABLET} {
        ${StatCellContent} {
            font-size: 24px;
            line-height: 40px;
        }
    }
`

const NodeAddressHeader = styled.h2`
    display: flex;
    align-items: center;
`

const NoticeBar = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    background: #fff4ee;
    font-size: 14px;
    line-height: 20px;
    color: #323232;
    padding: 8px 0;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.025);
`

const NoticeWrap = styled.div`
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 8px;
    align-items: center;
    margin: 0 auto;
    max-width: ${MAX_BODY_WIDTH}px;
    padding: 0 24px;
    width: 100%;

    @media (min-width: ${MAX_BODY_WIDTH + 48}px) {
        padding: 0;
    }
`

const SlashingHistoryTableContainer = styled.div`
    max-height: none;

    @media ${LAPTOP} {
        max-height: 575px;
    }
`

interface OperatorVersionNoticeProps {
    version: number
}

function OperatorVersionNotice(params: OperatorVersionNoticeProps) {
    const { version } = params

    let notice: ReactNode | undefined

    if (version === 0) {
        notice = (
            <>
                Your Operator smart contract is outdated.{' '}
                <a
                    href={R.docs(
                        '/help/operator-faq#migrating-from-streamr-10-testnet-to-streamr-10',
                    )}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Click here
                </a>{' '}
                to learn how to migrate to the latest version.
            </>
        )
    }

    if (version === 1) {
        notice = (
            <>
                You have a version of the Operator smart contract where withdrawals and
                undelegations are broken.
                <br />
                The tokens within the Operator can be recovered. Please see{' '}
                <a
                    href="https://discord.com/channels/801574432350928907/1169745015363338300/1214980272123019264"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    these instructions
                </a>{' '}
                or get in touch with the team.
            </>
        )
    }

    if (!notice) {
        return null
    }

    return (
        <NoticeBar>
            <NoticeWrap>
                <TooltipIconWrap $color="#ff5c00">
                    <JiraFailedBuildStatusIcon label="Error" />
                </TooltipIconWrap>
                <div>{notice}</div>
            </NoticeWrap>
        </NoticeBar>
    )
}
