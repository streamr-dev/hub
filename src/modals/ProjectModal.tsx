import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'
import { Reason, useDiscardableEffect } from 'toasterhea'
import { COLORS } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { RejectionReason } from '~/utils/exceptions'

export function isAbandonment(e: unknown) {
    return (
        e === RejectionReason.BackButton ||
        e === RejectionReason.Backdrop ||
        e === RejectionReason.CancelButton ||
        e === RejectionReason.CloseButton ||
        e === RejectionReason.EscapeKey ||
        e === Reason.Host ||
        e === Reason.Unmount ||
        e === Reason.Update
    )
}

const Root = styled.div`
    background: #f5f5f5;
    color: #323232;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const Column = styled.div`
    margin: 0 auto;
    max-width: 528px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const ScrollableContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;
    
    @media (min-width: 768px) {
        padding: 0;
    }
`

const Nav = styled.div`
    box-sizing: content-box;
    height: 64px;
    padding: 48px 16px;
    
    @media (min-width: 768px) {
        padding: 48px 0;
    }

    button {
        appearance: none;
        background: none;
        border: 0;
        padding: 0;
        width: 64px;
        height: 100%;
        display: flex;
        align-items: center;
        transform: translateX(-31%);
    }

    button svg {
        display: block;
        margin: 0 auto;
    }

    & + h2 {
        font-size: 24px;
        font-weight: 400;
        line-height: normal;
        margin: 0 0 20px;
        padding: 0 16px;
        
        @media (min-width: 768px) {
            padding: 0;
        }
    }
`

const BackButtonIcon = styled(SvgIcon)`
    color: ${COLORS.primaryLight};
`

export const Actions = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    margin-top: 32px;
    gap: 16px;
    padding: 0 16px 16px;
    background: #f5f5f5;
    
    @media (min-width: 768px) {
        padding: 0 0 16px;
    }

    @media (max-width: 767px) {
        flex-direction: column-reverse;
        align-items: stretch;
        
        button {
            width: 100%;
        }
    }

    button {
        min-width: 120px;
    }
`

interface Props {
    title?: string
    children?: ReactNode
    onReject?: (reason?: unknown) => void
    backable?: boolean
    closeOnEscape?: boolean
}

export default function ProjectModal({
    backable = false,
    children,
    closeOnEscape = false,
    onReject,
    title,
}: Props) {
    useDiscardableEffect((discard) => void setTimeout(discard))

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape' && closeOnEscape) {
                onReject?.(RejectionReason.EscapeKey)
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onReject, closeOnEscape])

    return (
        <Root>
            <Column>
                <Nav>
                    {backable && (
                        <button
                            type="button"
                            onClick={() => void onReject?.(RejectionReason.BackButton)}
                        >
                            <BackButtonIcon name="backArrow" />
                        </button>
                    )}
                </Nav>
                {!!title && <h2>&zwnj;{title}</h2>}
                <ScrollableContent>{children}</ScrollableContent>
                <Actions />
            </Column>
        </Root>
    )
}
