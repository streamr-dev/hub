import { ParsedOperator } from '~/parsers/OperatorParser'
import { TheGraph } from '~/shared/types'
import { BN } from '~/utils/bn'

export interface ProjectFilter {
    search: string
    type?: TheGraph.ProjectType | undefined
    owner?: string | undefined
}

/**
 * `ParsedOperator` enhanced with `apy` and `myShare`. It is *not* Delegation
 * structure coming from the Graph directly in any way.
 */
export interface Delegation extends ParsedOperator {
    apy: number
    myShare: BN
}

export interface DelegationsStats {
    value: BN
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