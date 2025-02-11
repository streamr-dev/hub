import React from 'react'
import { Link, useRouteError } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import { EmptyState } from '~/components/EmptyState'
import Layout from '~/components/Layout'
import { ParseError } from '~/errors'
import appCrashedImage from '~/shared/assets/images/app_crashed.png'
import appCrashedImage2x from '~/shared/assets/images/app_crashed@2x.png'
import { useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

export default function GenericErrorPage() {
    const error = useRouteError()

    if (error instanceof ParseError) {
        return <ParseErrorPage />
    }

    return (
        <Layout rootBackgroundColor="#EFEFEF">
            <GenericErrorPageContent />
        </Layout>
    )
}

function ParseErrorPage() {
    return (
        <Layout rootBackgroundColor="#EFEFEF">
            <Root>
                <EmptyState
                    image={
                        <img
                            src={appCrashedImage}
                            srcSet={`${appCrashedImage2x} 2x`}
                            alt="App crashed"
                        />
                    }
                    link={
                        <Button
                            kind="special"
                            as={Link}
                            to="https://streamr.network/"
                            className="d-none d-md-flex"
                        >
                            Go to public site
                        </Button>
                    }
                    linkOnMobile
                >
                    <p>The Hub is temporarily unavailable.</p>
                    <SecondaryP>
                        Our connection to the Subgraph indexing the Streamr Smart
                        Contracts
                        <br />
                        is currently unavailable. Please try again in a few minutes.
                    </SecondaryP>
                </EmptyState>
            </Root>
        </Layout>
    )
}

export function GenericErrorPageContent() {
    const chainName = useCurrentChainKey()
    return (
        <Root>
            <EmptyState
                image={
                    <img
                        src={appCrashedImage}
                        srcSet={`${appCrashedImage2x} 2x`}
                        alt="App crashed"
                    />
                }
                link={
                    <Button
                        kind="special"
                        as={Link}
                        to={R.projects(routeOptions(chainName))}
                        className="d-none d-md-flex"
                    >
                        Projects
                    </Button>
                }
                linkOnMobile
            >
                <p>
                    Oops. Something has broken down here.
                    <br />
                    Please try one of the links below
                    <br />
                    to get things back on track.
                </p>
            </EmptyState>
        </Root>
    )
}

const SecondaryP = styled.p`
    font-size: 0.8em;
    margin-top: 1em;
`

const Root = styled.div`
    text-align: center;
    width: 100%;

    img {
        margin-bottom: -0.75em;
        max-width: 180px;
    }

    @media (min-width: 376px) {
        img {
            max-width: 200px;
        }
    }

    @media (min-width: 745px) {
        img {
            max-width: 40%;
        }
    }

    @media (min-width: 1441px) {
        img {
            max-width: 50%;
        }
    }
`
