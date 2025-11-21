import CheckIcon from '@atlaskit/icon/glyph/check'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React from 'react'
import styled, { css } from 'styled-components'
import { z } from 'zod'
import { StreamDescription } from '~/components/StreamDescription'
import { Tooltip, TooltipIconWrap } from '~/components/Tooltip'
import { Sponsorship } from '~/parsers/Sponsorship'
import { HubAvatar, HubImageAvatar } from '~/shared/components/AvatarImage'
import { COLORS, MEDIUM } from '~/shared/utils/styled'
import { truncate, truncateStreamName } from '~/shared/utils/text'
import { getStreamGptApiUrl } from '~/utils'
import { getChainConfigExtension } from '~/utils/chains'
import { getSponsorshipStakeForOperator } from '~/utils/sponsorships'
import Spinner from './Spinner'
import { OperatorAvatar } from './avatars'

/**
 * Operator name and avatar formatter.
 */
export function OperatorIdCell({
    operatorId,
    imageUrl,
    operatorName,
    truncate: truncateProp = false,
}: {
    operatorId: string
    imageUrl?: string
    operatorName?: string
    truncate?: boolean
}) {
    return (
        <OperatorIdCellRoot>
            <OperatorAvatarWrap>
                <OperatorAvatar operatorId={operatorId} imageUrl={imageUrl} />
            </OperatorAvatarWrap>
            <OperatorName $truncate={truncateProp}>
                {operatorName || truncate(operatorId)}
            </OperatorName>
        </OperatorIdCellRoot>
    )
}

const OperatorAvatarWrap = styled.div`
    height: 32px;
    width: 32px;
`

const OperatorName = styled.div<{ $truncate?: boolean }>`
    ${({ $truncate = false }) =>
        $truncate &&
        css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 12rem;
        `}
`

const OperatorIdCellRoot = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
    gap: 12px;
`

/**
 * Deleted stream id formatter.
 */
function DeletedStreamIdCell() {
    return (
        <StreamInfoCell>
            <StreamAvatarWrap />
            <StreamInfoCellOuter>
                <StreamIdWrap as="em">(deleted stream)</StreamIdWrap>
            </StreamInfoCellOuter>
        </StreamInfoCell>
    )
}

/**
 * Stream id and description formatter.
 */
export function StreamIdCell({
    streamId = '',
    description,
}: {
    streamId?: string
    description?: string
}) {
    const imageUrlQuery = useStreamImageUrlQuery(streamId)

    if (!streamId) {
        return <DeletedStreamIdCell />
    }

    return (
        <StreamInfoCell>
            <StreamAvatarWrap>
                <HubImageAvatar
                    src={imageUrlQuery.data || ''}
                    alt=""
                    placeholder={
                        imageUrlQuery.isFetching ? (
                            <SpinnerWrap>
                                <Spinner color="blue" size={10} />
                            </SpinnerWrap>
                        ) : (
                            <HubAvatar id={streamId} />
                        )
                    }
                />
            </StreamAvatarWrap>
            <StreamInfoCellOuter>
                <StreamIdWrap>{truncateStreamName(streamId)}</StreamIdWrap>
                <StreamDescriptionWrap>
                    {description == null ? (
                        <StreamDescription streamId={streamId} />
                    ) : (
                        description
                    )}
                </StreamDescriptionWrap>
            </StreamInfoCellOuter>
        </StreamInfoCell>
    )
}

function useStreamImageUrlQuery(streamId: string | undefined) {
    return useQuery({
        queryKey: ['useStreamImageUrlQuery', streamId || ''],
        queryFn: async () => {
            if (!streamId) {
                return null
            }

            const resp = await fetch(
                getStreamGptApiUrl(`streams/${encodeURIComponent(streamId)}`),
            )

            if (resp.status !== 200) {
                return null
            }

            /**
             * The GPT only processes streams on the Polygon network (137).
             */
            const { ipfsGatewayUrl } = getChainConfigExtension(137).ipfs

            return z
                .object({
                    imageHash: z.string(),
                })
                .transform(({ imageHash }) =>
                    imageHash ? `${ipfsGatewayUrl}${imageHash}` : null,
                )
                .parse(await resp.json())
        },
        staleTime: Infinity,
    })
}

const SpinnerWrap = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`

const StreamAvatarWrap = styled.div`
    background: #f0f0f0;
    border-radius: 50%;

    &,
    ${SpinnerWrap}, ${HubImageAvatar}, ${HubAvatar} {
        width: 40px;
        height: 40px;
    }
`

const StreamInfoCellOuter = styled.div``

const StreamInfoCell = styled.div`
    align-items: center;
    display: flex;
    gap: 12px;
    line-height: 26px;
`

const StreamIdWrap = styled.div`
    display: block;
    font-weight: ${MEDIUM};
    color: ${COLORS.primary};
`

const StreamDescriptionWrap = styled.div`
    font-size: 14px;
    max-width: 208px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :empty {
        display: none;
    }
`

/**
 * Sponsorship's projected insolvency timestamp formatter.
 */
export function FundedUntilCell({
    projectedInsolvencyAt,
    remainingBalance,
}: {
    projectedInsolvencyAt: Date | null
    remainingBalance: bigint
}) {
    const value = projectedInsolvencyAt == null ? null : moment(projectedInsolvencyAt)

    return (
        <Iconized>
            {value == null || !value.isValid() ? (
                <>N/A</>
            ) : (
                <Tooltip content={value.format('YYYY-MM-DD, HH:mm')}>
                    {value.format('YYYY-MM-DD')}
                </Tooltip>
            )}
            {remainingBalance <= 0n && (
                <Tooltip content="Sponsorship expired">
                    <TooltipIconWrap
                        $color="#ff5c00"
                        $svgSize={{
                            width: '18px',
                            height: '18px',
                        }}
                    >
                        <JiraFailedBuildStatusIcon label="Error" />
                    </TooltipIconWrap>
                </Tooltip>
            )}
        </Iconized>
    )
}

const Iconized = styled.div`
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;
    line-height: normal;

    ${TooltipIconWrap} svg {
        width: 18px;
        height: 18px;
    }
`

export function SponsorshipApyCell({
    spotAPY,
    isRunning,
}: {
    spotAPY: number
    isRunning: boolean
}) {
    return (
        <Iconized>
            {`${(spotAPY * 100).toFixed(0)}%`}
            {!isRunning && (
                <Tooltip content="Sponsorship not runnning">
                    <TooltipIconWrap
                        $color="#ff5c00"
                        $svgSize={{
                            width: '18px',
                            height: '18px',
                        }}
                    >
                        <JiraFailedBuildStatusIcon label="Error" />
                    </TooltipIconWrap>
                </Tooltip>
            )}
        </Iconized>
    )
}

export function NumberOfOperatorsCell({
    sponsorship,
    currentOperatorId,
}: {
    sponsorship: Sponsorship
    currentOperatorId: string | undefined
}) {
    const joinedByCurrentOperator =
        !!currentOperatorId &&
        !!getSponsorshipStakeForOperator(sponsorship, currentOperatorId)

    return (
        <Iconized>
            {sponsorship.operatorCount}
            {joinedByCurrentOperator && (
                <Tooltip content="Already joined as Operator.">
                    <TooltipIconWrap $color="currentColor">
                        <CheckIcon label="Already joined as Operator." />
                    </TooltipIconWrap>
                </Tooltip>
            )}
        </Iconized>
    )
}
