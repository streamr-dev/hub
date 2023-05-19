import React from 'react'
import styled from 'styled-components'
import Buttons from '$shared/components/Buttons'
import PrestyledLoadingIndicator from '$shared/components/LoadingIndicator'
import { COLORS } from '$shared/utils/styled'
import Modal from './Modal'
import { Footer } from './BaseModal'

const Content = styled.div`
    margin: 0 auto;
    padding: 48px 0 56px;
    width: 448px;

    p {
        margin: 0 0 16px;
    }
`

const LoadingIndicator = styled(PrestyledLoadingIndicator)`
    height: 8px;
    border-radius: 8px;

    ::before,
    ::after {
        border-radius: 8px;
    }

    ::before {
        background-color: ${COLORS.secondaryHover};
    }
`

export default function AccessingProjectModal() {
    return (
        <Modal title="Accessing project" onBeforeAbort={() => false} darkBackdrop>
            <Content>
                <p>Accessing…</p>
                <LoadingIndicator loading />
            </Content>
            <Footer>
                <Buttons
                    actions={{
                        ok: {
                            title: 'Waiting',
                            kind: 'primary',
                            spinner: true,
                        },
                    }}
                />
            </Footer>
        </Modal>
    )
}
