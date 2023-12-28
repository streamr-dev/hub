import React, { HTMLAttributes, ReactNode, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Anchor, useBoundingClientRect } from './Anchor'

interface Props {
    children: ReactNode
    content: ReactNode
}

export function Tooltip({ children, content }: Props) {
    const [isOpen, toggle] = useState(false)

    return (
        <Anchor
            onMouseEnter={() => void toggle(true)}
            onMouseLeave={() => void toggle(false)}
            translate={(r) => (r ? [r.x + r.width / 2, r.y + window.scrollY] : [0, 0])}
            component={TooltipComponent}
            componentProps={{
                children: content,
                visible: isOpen,
            }}
        >
            {children}
        </Anchor>
    )
}

interface TooltipComponentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'x' | 'y'> {
    x: number
    y: number
    visible?: boolean
}

function TooltipComponent({
    x,
    y,
    visible = false,
    children,
    ...props
}: TooltipComponentProps) {
    const ref = useRef<HTMLDivElement>(null)

    const dx = useBoundingClientRect(ref, (rect) => {
        if (!rect) {
            return 0
        }

        return Math.min(0, document.documentElement.clientWidth - x - rect.width / 2 - 8)
    })

    return (
        <TooltipRoot
            {...props}
            $visible={visible}
            ref={ref}
            style={{
                transform: `translate(${x | 0}px, ${
                    y | 0
                }px) translate(-50%, -100%) translateY(-10px) translateX(${dx | 0}px)`,
            }}
        >
            <TooltipBody>
                <Indicator
                    style={{
                        transform: `translate(-50%, -50%) translateY(-2px)  translateX(${
                            -dx | 0
                        }px) rotate(45deg)`,
                    }}
                />
                <TooltipContent>{children}</TooltipContent>
            </TooltipBody>
        </TooltipRoot>
    )
}

const TooltipBody = styled.div`
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(4px);
    transition: 350ms transform;
    white-space: normal;
`

const TooltipRoot = styled.div<{ $visible?: boolean }>`
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    transition: 350ms;
    transition-delay: 350ms, 0s;
    transition-property: visibility, opacity;
    visibility: hidden;
    z-index: 9999;

    ${({ $visible = false }) =>
        $visible &&
        css`
            opacity: 1;
            pointer-events: auto;
            transition-delay: 0s;
            visibility: visible;

            ${TooltipBody} {
                transform: translateY(0);
            }
        `}
`

const TooltipContent = styled.div`
    background: white;
    border-radius: 8px;
    color: #525252;
    font-size: 12px;
    line-height: 1.5em;
    max-width: 240px;
    padding: 8px 12px;
    position: relative;
    width: max-content;

    > ul,
    > p {
        margin: 0;
    }

    > p + ul,
    > ul + p,
    > p + p {
        margin-top: 0.5em;
    }

    > ul li + li {
        margin-top: 0.25em;
    }

    > ul {
        list-style: none;
        padding: 0 0 0 12px;
        position: relative;
    }

    > ul li::before {
        content: '•';
        display: block;
        position: absolute;
        left: 0;
    }
`

const Indicator = styled.div`
    background: white;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05),
        0 5px 15px rgba(0, 0, 0, 0.1);
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    left: 50%;
    top: 100%;
`

export const TooltipIconWrap = styled.div<{
    $color?: string
    $svgSize?: { width: string; height: string }
}>`
    color: ${({ $color = 'inherit' }) => $color};

    span[role='img'],
    svg {
        display: block;
        ${({ $svgSize }) => {
            if ($svgSize) {
                return css`
                    width: ${$svgSize.width};
                    height: ${$svgSize.height};
                `
            }
        }}
`