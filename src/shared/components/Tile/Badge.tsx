import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import Link from '~/shared/components/Link'
import { useMultipleStreamStatsQuery } from '~/hooks/useStreamStats'

const SingleBadge = styled.div`
    display: flex;
    align-items: center;
    font-size: 10px;
    height: 15px;
    line-height: 12px;
    padding: 0 4px;
    background-color: #0324ff;
    background-color: ${({ theme }) => theme.backgroundColor};
    color: white !important;

    a,
    a:link,
    a:active,
    a:focus,
    a:hover,
    a:visited {
        color: white !important;
    }

    > * + * {
        margin-left: 8px;
    }
`

type BadgeContainerProps = {
    children: ReactNode
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
}

const BadgeContainer = styled.div<BadgeContainerProps>`
    align-items: center;
    color: white !important;
    display: flex;
    cursor: default;
    pointer-events: none;
    user-select: none;
    margin: 0.5em;

    a& {
        cursor: pointer;
        pointer-events: auto;
        text-decoration: none !important;
    }

    ${({ top, left, right, bottom }) =>
        !!(top || left || right || bottom) &&
        css`
            position: absolute;
        `}

    ${({ bottom, top }) =>
        !!bottom &&
        !top &&
        css`
            bottom: 0;
        `}

    ${({ left }) =>
        !!left &&
        css`
            left: 0;
        `}

    ${({ right, left }) =>
        !!right &&
        !left &&
        css`
            right: 0;
        `}

    ${({ top }) =>
        !!top &&
        css`
            top: 0;
        `}

    > ${SingleBadge} {
        margin-left: 1px;
    }

    ${SingleBadge}:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    ${SingleBadge}:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    ${SingleBadge}:only-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
`

interface DataUnionBadgeProps extends Omit<BadgeContainerProps, 'children'> {
    memberCount?: number
    linkTo?: string
    linkHref?: string
}

const DataUnionBadge = ({
    memberCount,
    linkTo,
    linkHref,
    ...props
}: DataUnionBadgeProps) => (
    <BadgeContainer {...props}>
        <SingleBadge>Data Union</SingleBadge>
        {memberCount != null && (
            <SingleBadge>
                <BadgeLink to={linkTo} href={linkHref}>
                    {memberCount}
                </BadgeLink>
                &nbsp; members
            </SingleBadge>
        )}
    </BadgeContainer>
)

const BadgeLink = ({ ...props }) => <Link {...props} />

const StatsBadge = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 8px;
    gap: 10px;
    background: rgba(245, 245, 247, 0.6);
    backdrop-filter: blur(13.3871px);
    border-radius: 8px;

    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #323232;

    a,
    a:link,
    a:active,
    a:focus,
    a:hover,
    a:visited {
        color: white !important;
    }

    > * + * {
        margin-left: 8px;
    }
`

interface StreamStatsBadgeProps extends Omit<BadgeContainerProps, 'children'> {
    streamIds: string[]
}

const StreamStatsBadge = ({ streamIds, ...props }: StreamStatsBadgeProps) => {
    const { data: stats, isLoading, error } = useMultipleStreamStatsQuery(streamIds)

    if (error || isLoading) {
        return null
    }

    const messagesPerSecond = stats?.messagesPerSecond
    const formattedMsgRate =
        typeof messagesPerSecond === 'number' ? messagesPerSecond.toFixed(1) : 'N/A'

    return (
        <BadgeContainer {...props}>
            <StatsBadge>
                <span>
                    {streamIds.length} {streamIds.length === 1 ? 'Stream' : 'Streams'}
                </span>
                <span>{formattedMsgRate} Msg/s</span>
            </StatsBadge>
        </BadgeContainer>
    )
}

export { DataUnionBadge, StreamStatsBadge }
