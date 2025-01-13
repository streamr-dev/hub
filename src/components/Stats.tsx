import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { defaultStreamStats } from '~/getters/getStreamStats'
import { useStreamStatsQuery } from '~/hooks/useStreamStats'

type StatProps = {
    id: string
    label: ReactNode
    value?: ReactNode
    unit?: ReactNode
}

function Stat({ label, value, unit, ...props }: StatProps) {
    return (
        <StatRoot type="button" {...props}>
            <StatName>{label}</StatName>
            <StatValue>
                {value !== undefined && value}
                {value === undefined && <Dimm>&infin;</Dimm>}
                {value !== undefined && unit}
            </StatValue>
        </StatRoot>
    )
}

const StatName = styled.div`
    font-size: 10px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0.05em;
    color: #adadad;
    text-transform: uppercase;
`

const StatValue = styled.div`
    font-size: 16px;
    line-height: normal;
    margin-top: 0.25em;
    color: #323232;

    svg {
        width: 13px;
        height: 13px;
        color: #adadad;
    }
`

const Dimm = styled.span`
    color: #adadad;
`

export const StatRoot = styled.button`
    background: transparent;
    border: 0;
    appearance: none;
    text-align: center;
    user-select: none;
    position: relative;
    font-family: inherit;
    outline: none;

    &:focus {
        outline: none;
    }

    ${StatName} {
        transition: color 300ms ease-in-out;
    }
`

const ButtonGrid = styled.div`
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
    display: flex;
    flex-direction: row;
    padding: 16px 0;
    pointer-events: auto;

    > ${StatRoot} {
        flex-grow: 1;
        flex-basis: 0;
    }
`

interface StreamStatsProps {
    streamId: string
}

export function StreamStats({ streamId }: StreamStatsProps) {
    const { data: stats } = useStreamStatsQuery(streamId)

    const { messagesPerSecond, peerCount, latency } = stats || defaultStreamStats

    return (
        <StreamStatsRoot>
            <ButtonGrid>
                <Stat
                    id="streamMessagesPerSecond"
                    label="Msgs / sec"
                    value={messagesPerSecond}
                />
                <Stat id="peerCount" label="Peers" value={peerCount} />
                <Stat
                    id="latency"
                    label="Latency ms"
                    value={latency == null ? undefined : latency.toFixed(2)}
                />
            </ButtonGrid>
        </StreamStatsRoot>
    )
}

const StreamStatsRoot = styled.div`
    max-width: 480px;
    padding: 24px;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
`
