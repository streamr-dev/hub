import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import LightModal from '~/modals/LightModal'
import SvgIcon from '~/shared/components/SvgIcon'
import { DESKTOP, TABLET } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'
import { Route as R } from '~/utils/routes'

export const DisclaimerBar = () => {
    const { pathname } = useLocation()

    // Show disclaimer only for Overview, Sponsorships, Sponsorship, Operators, Operator pages
    if (!pathname.includes(R.network())) {
        return null
    }

    return (
        <Root>
            <SvgIcon name="infoBadge" />
            <div>
                Smart contracts enable sponsorship, staking, and delegation — your capital
                is at risk.{' '}
                <a
                    href={R.docs('/guides/how-to-stake-and-earn')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={async (e) => {
                        e.preventDefault()

                        try {
                            await toaster(LightModal, Layer.Modal).pop({
                                title: 'Disclaimer',
                                children: (
                                    <p>
                                        Streamr’s operator, sponsorship, staking, and
                                        delegation smart contracts carry inherent risks.
                                        Do your own research and participate at your own
                                        risk — funds may be irreversibly lost. Always stay
                                        cautious and never share your private key. There
                                        is no support desk, so beware of scammers
                                        pretending to offer help or asking you to use apps
                                        that could drain your wallet.{' '}
                                        <a
                                            href={R.docs('/guides/how-to-stake-and-earn')}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Learn more
                                        </a>
                                        .
                                    </p>
                                ),
                            })
                        } catch (_) {}
                    }}
                >
                    Learn more
                </a>
                .
            </div>
        </Root>
    )
}

const Root = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
    padding: 12px 72px 12px 40px;
    align-items: center;
    justify-content: left;
    color: white;
    background: #323232;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;

    padding: 12px 72px 12px 24px;

    @media (${TABLET}) {
        padding: 12px 72px 12px 24px;
    }

    @media (${DESKTOP}) {
        padding: 12px 72px 12px 40px;
    }

    // Make it stick to top
    position: sticky;
    top: 0;
    z-index: 1000;

    & > svg {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        & circle {
            fill: #525252;
        }
    }

    & a {
        color: inherit !important;
        text-decoration: underline !important;
    }
`
