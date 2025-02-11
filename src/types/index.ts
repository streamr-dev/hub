import { MessageID } from '@streamr/sdk'
import { TheGraph } from '~/shared/types'

export interface ProjectFilter {
    search: string
    type?: TheGraph.ProjectType | undefined
}

export interface DelegationsStats {
    value: bigint
    minApy: number
    maxApy: number
    numOfOperators: number
}

export enum ChartPeriod {
    SevenDays = '7d',
    OneMonth = '1m',
    ThreeMonths = '3m',
    OneYear = '1y',
    YearToDate = 'ytd',
    All = 'all',
}

export function isChartPeriod(value: string): value is ChartPeriod {
    return Object.values<string>(ChartPeriod).includes(value)
}

export interface XY {
    x: number
    y: number
}

export type ChainConfigKey =
    | 'maxPenaltyPeriodSeconds'
    | 'minimumStakeWei'
    | 'minimumSelfDelegationFraction'
    | 'maxQueueSeconds'
    | 'slashingFraction'
    | 'minimumDelegationSeconds'
    | 'minimumDelegationWei'
    | 'earlyLeaverPenaltyWei'

export type OrderDirection = 'asc' | 'desc'

export interface DataPoint {
    data: unknown
    metadata: {
        messageId: MessageID
        timestamp: number
    }
}

export interface WritablePaymentDetail<P = bigint> {
    beneficiary: string
    pricingTokenAddress: string
    pricePerSecond: P
}

export type FundingEvent = {
    id: string
    amount: bigint
    sponsor: string
    date: string
}

export type Values<T> = T extends Record<string, infer R> ? R : never
