import React, { ComponentProps, ReactNode } from 'react'
import styled from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM, TABLET } from '~/shared/utils/styled'

export default function StatGrid({ children }) {
    return (
        <StatGridRoot $count={React.Children.count(children)}>
            {React.Children.map(children, (child, index) => (
                <>
                    {index ? <Separator /> : null}
                    {child}
                </>
            ))}
        </StatGridRoot>
    )
}

const Separator = styled.div`
    background: #efefef;
    height: 1px;
    margin: 20px 0;

    @media ${TABLET} {
        height: auto;
        margin: 0;
        min-height: 88px;
        width: 1px;
    }
`

function template({ $count }: { $count: number }) {
    return [...Array($count)].map(() => '1fr').join(' auto ')
}

const StatGridRoot = styled.div<{ $count: number }>`
    @media ${TABLET} {
        align-items: center;
        gap: 24px;
        display: grid;
        grid-template-columns: ${template};
    }
`

export function StatCell({
    children,
    label = 'Label',
    tip,
}: {
    children?: ReactNode
    label?: string
    tip?: ReactNode
}) {
    return (
        <StatCellRoot>
            <StatCellLabel>
                <div>{label}</div>
                {tip ? <Tip>{tip}</Tip> : <></>}
            </StatCellLabel>
            <StatCellBody>{children}</StatCellBody>
        </StatCellRoot>
    )
}

const StatCellLabel = styled.div`
    align-items: center;
    color: #868686;
    display: flex;
    font-size: 14px;
    line-height: 24px;

    @media ${TABLET} {
        margin-bottom: 10px;
    }
`

const StatCellBody = styled.div`
    color: ${COLORS.primary};
    font-size: 18px;
    font-weight: ${MEDIUM};
    letter-spacing: -0.05em;
    line-height: 24px;
    margin: 0;

    @media ${TABLET} {
        font-size: 20px;
    }
`

const StatCellRoot = styled.div`
    align-items: center;
    display: flex;

    ${StatCellLabel} {
        flex-grow: 1;
    }

    @media ${TABLET} {
        display: block;
    }
`

function getTooltipIconAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'outlineQuestionMark',
    }
}

const TooltipIcon = styled(SvgIcon).attrs(getTooltipIconAttrs)`
    color: ${COLORS.primaryDisabled};
    height: 24px;
    padding: 6px;
    width: 24px;
`

function Tip({ children }: { children?: ReactNode }) {
    return (
        <TipRoot>
            <TooltipIcon />
            <TipBody>
                <TipEffects />
                <TipContent>{children}</TipContent>
            </TipBody>
        </TipRoot>
    )
}

const TipBody = styled.div`
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    left: 50%;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    transform: translateY(-100%) translateX(-50%);
    transition: 350ms;
    transition-property: visibility, opacity, transform;
    transition-delay: 350ms, 0s, 0s;
    visibility: hidden;
`

const TipContent = styled.div`
    color: #525252;
    font-size: 12px;
    line-height: 1.5em;
    min-width: 240px;
    padding: 8px 12px;
    position: relative;
`

const TipEffects = styled.div`
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    ::after {
        background: #ffffff;
        border-radius: 8px;
        content: '';
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    ::before {
        background: #ffffff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
            0 5px 15px rgba(0, 0, 0, 0.1);
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        left: 50%;
        top: 100%;
        transform: translate(-50%, -50%) translateY(-4px) rotate(45deg);
    }
`

const TipRoot = styled.div`
    height: 24px;
    position: relative;
    width: 24px;

    :hover ${TipBody} {
        opacity: 1;
        visibility: visible;
        transition-delay: 0s;
        transform: translateY(-100%) translateY(-6px) translateX(-50%);
    }
`