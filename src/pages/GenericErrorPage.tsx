import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap'
import styled from 'styled-components'
import { EmptyState } from '~/components/EmptyState'
import Layout from '~/components/Layout'
import appCrashedImage from '~/shared/assets/images/app_crashed.png'
import appCrashedImage2x from '~/shared/assets/images/app_crashed@2x.png'
import { Button } from '~/components/Button'
import routes from '~/routes'

export default function GenericErrorPage() {
    return (
        <Layout rootBackgroundColor="#EFEFEF">
            <GenericErrorPageContent />
        </Layout>
    )
}

export function GenericErrorPageContent() {
    return (
        <Root>
            <Container>
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
                            to={routes.projects.index()}
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
            </Container>
        </Root>
    )
}

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
