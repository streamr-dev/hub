import React, { FunctionComponent, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBoxSeparator } from '$shared/components/WhiteBox'
import { useWalletAccount } from '$shared/stores/wallet'
import { NoNetworkStats } from '$app/src/network/components/NoNetworkStats'
import { StatsBox } from '$shared/components/StatsBox/StatsBox'
import { ChartPeriod, NetworkChart } from '$shared/components/NetworkChart/NetworkChart'
import useIsMounted from '$shared/hooks/useIsMounted'
import routes from '$routes'
import { OperatorChartData, OperatorStats } from '../types/operator'
import { NetworkSectionTitle } from './NetworkSectionTitle'
import {
    growingValuesGenerator,
    NetworkChartWrap,
    SummaryContainer,
    WalletNotConnectedOverlay,
} from './SummaryUtils'
import { truncateNumber } from '$shared/utils/truncateNumber'

const hardcodedOperatorStats: OperatorStats = {
    delegators: 124,
    sponsorships: 2,
    totalStake: 24040218,
}

const maxDayStats = 10

const hardcodedOperatorChartData: OperatorChartData = {
    totalStake: growingValuesGenerator(maxDayStats, hardcodedOperatorStats.totalStake),
    cumulativeEarnings: growingValuesGenerator(maxDayStats, 2000000),
}
export const MyOperatorSummary: FunctionComponent = () => {
    const isMounted = useIsMounted()
    const walletConnected = !!useWalletAccount()
    const hasOperator = true
    const myOperatorStats: OperatorStats = hardcodedOperatorStats // todo fetch from state
    const myOperatorChartData: OperatorChartData = hardcodedOperatorChartData // todo fetch from state

    const statsObject = walletConnected ? myOperatorStats : hardcodedOperatorStats
    const mappedStats = [
        {
            label: 'Total stake',
            value: truncateNumber(statsObject.totalStake, 'millions') + ' DATA',
            hoverValue: statsObject.totalStake + ' DATA',
            tooltipText: 'Lorem ipsum dolor sit amet',
        },
        { label: 'Delegators', value: statsObject.delegators.toString() },
        {
            label: 'Sponsorships',
            value: statsObject.sponsorships.toString(),
            tooltipText: 'This is info tooltip about sponsorships',
        },
    ]
    const chartData = walletConnected ? myOperatorChartData : hardcodedOperatorChartData

    const [selectedDataSource, setSelectedDataSource] = useState<string>('totalStake')

    const [selectedChartPeriod, setSelectedChartPeriod] = useState<ChartPeriod>(
        ChartPeriod['7D'],
    )

    const handleChartDataSourceChange = useCallback(
        async (dataSource: string) => {
            setSelectedDataSource(dataSource)
            // todo fetch data
            // simulate awaiting data
            await new Promise((resolve) => setTimeout(resolve, 1000))
        },
        [setSelectedChartPeriod, setSelectedDataSource],
    )

    const handleChartPeriodChange = useCallback(
        async (period: ChartPeriod) => {
            setSelectedChartPeriod(period)
            // todo fetch data
            // simulate awaiting data
            await new Promise((resolve) => setTimeout(resolve, 1000))
        },
        [setSelectedChartPeriod, selectedChartPeriod],
    )

    return (
        <SummaryContainer>
            <div className="title">
                <NetworkSectionTitle>My operator summary</NetworkSectionTitle>
            </div>
            <WhiteBoxSeparator />
            {hasOperator || !walletConnected ? (
                <>
                    <div
                        className={
                            'summary-container ' +
                            (isMounted() && !walletConnected ? 'blur' : '')
                        }
                    >
                        <StatsBox stats={mappedStats} columns={3} />
                        <WhiteBoxSeparator />
                        <NetworkChartWrap>
                            <NetworkChart
                                dataSources={[
                                    { label: 'Total stake', value: 'totalStake' },
                                    {
                                        label: 'Cumulative earnings',
                                        value: 'cumulativeEarnings',
                                    },
                                ]}
                                stats={
                                    selectedDataSource === 'totalStake'
                                        ? chartData.totalStake
                                        : chartData.cumulativeEarnings
                                }
                                onDataSourceChange={handleChartDataSourceChange}
                                onPeriodChange={handleChartPeriodChange}
                                selectedDataSource={selectedDataSource}
                                selectedPeriod={selectedChartPeriod}
                            />
                        </NetworkChartWrap>
                    </div>
                    {isMounted() && !walletConnected && (
                        <WalletNotConnectedOverlay summaryTitle="operator summary" />
                    )}
                </>
            ) : (
                <NoNetworkStats
                    firstLine="You don't have any operator yet."
                    secondLine={
                        <span>
                            <Link to={routes.network.createOperator()}>
                                Create a operator
                            </Link>{' '}
                            now.
                        </span>
                    }
                />
            )}
        </SummaryContainer>
    )
}
