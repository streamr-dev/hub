import React from 'react'
import styled from 'styled-components'
import { Buttons } from '~/components/Buttons'
import PngIcon from '~/shared/components/PngIcon'
import { getChainDisplayName, getChainKey, isKnownChainId } from '~/utils/chains'
import { RejectionReason } from '~/utils/exceptions'
import { Footer } from './BaseModal'
import Modal, { ModalProps } from './Modal'

interface Props extends Pick<ModalProps, 'onReject' | 'darkBackdrop'> {
    expectedChainId: number
    actualChainId: number
    onResolve?: () => void
}

function getChainName(chainId: number) {
    return isKnownChainId(chainId)
        ? getChainDisplayName(getChainKey(chainId))
        : `#${chainId}`
}

export default function SwitchNetworkModal({
    expectedChainId,
    actualChainId,
    onReject,
    onResolve,
    ...props
}: Props) {
    return (
        <Modal
            {...props}
            onReject={onReject}
            title="Switch network"
            onBeforeAbort={(reason) => {
                /**
                 * Clicking on the backdrop should not accidentally discard the modal
                 * in this case. Enforce intentional cancellation via the Cancel button
                 * or the Escape key.
                 */
                return reason !== RejectionReason.Backdrop
            }}
        >
            <Content>
                <IconWrap>
                    <PngIcon name="wallet" alt="Switch network" />
                </IconWrap>
                <P>
                    Please switch to the <em>{getChainName(expectedChainId)}</em> network
                    in your Ethereum wallet. It&apos;s currently in{' '}
                    <em>{getChainName(actualChainId)}</em>
                    &nbsp;network.
                </P>
            </Content>
            <Footer>
                <Buttons
                    actions={{
                        cancel: {
                            title: 'Cancel',
                            onClick: () => void onReject?.(RejectionReason.CancelButton),
                            kind: 'link',
                        },
                        add: {
                            title: 'Switch',
                            kind: 'primary',
                            onClick: () => void onResolve?.(),
                        },
                    }}
                />
            </Footer>
        </Modal>
    )
}

const P = styled.p`
    margin: 0;
    text-align: center;
`

const IconWrap = styled.div`
    width: 98px;
    height: 67px;
    position: relative;
    margin: 0 auto 24px;

    img {
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) translateY(-6%);
    }
`

const Content = styled.div`
    padding: 64px 48px 40px;

    em {
        font-style: normal;
        font-weight: 500;
    }
`
