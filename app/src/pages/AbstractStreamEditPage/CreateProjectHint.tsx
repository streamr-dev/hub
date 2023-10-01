import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DESKTOP, TABLET, LAPTOP } from '$shared/utils/styled'
import dataUnionImage2x from '$mp/assets/product_dataunion@2x.png'
import { TheGraphProject, getProjects } from '$app/src/services/projects'
import Button from '$shared/components/Button'
import useModal from '$shared/hooks/useModal'
import CreateProjectModal from '$mp/containers/CreateProjectModal'

const Container = styled.div`
    padding: 76px 32px;
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: unset;
    gap: 40px;

    @media (${LAPTOP}) {
        padding: 60px 116px;
        grid-template-rows: unset;
        grid-template-columns: auto auto;
    }

    @media (${DESKTOP}) {
        padding: 165px 125px;
        grid-template-rows: unset;
        grid-template-columns: auto auto;
    }
`

const TextContainer = styled.div`
    margin-left: 0;
    display: grid;
    grid-template-rows: auto auto;
    gap: 40px;
    align-content: center;

    @media (${DESKTOP}) {
        margin-left: 112px;
    }
`

const Text = styled.div`
    display: flex;
    font-size: 24px;
    line-height: 150%;
    text-align: center;
    justify-self: center;

    @media (${TABLET}) {
        font-size: 34px;
    }

    @media (${DESKTOP}) {
        text-align: left;
        justify-self: left;
    }
`

const Image = styled.img`
    width: 261px;
    justify-self: center;

    @media (${TABLET}) {
        width: 364px;
    }
`

const CreateButton = styled(Button)`
    width: fit-content;
    justify-self: center;

    @media (${DESKTOP}) {
        justify-self: left;
    }
`

type Props = {
    streamId?: string
}

export default function CreateProjectHint({ streamId }: Props) {
    const [projects, setProjects] = useState<TheGraphProject[]>([])
    const { api: createProductModal } = useModal('marketplace.createProduct')

    useEffect(() => {
        let mounted = true

        const loadProjects = async () => {
            const result = await getProjects(undefined, 4, 0, undefined, streamId)

            if (mounted) {
                setProjects(result.projects)
            }
        }

        if (streamId) {
            loadProjects()
        }

        return () => {
            mounted = false
        }
    }, [streamId])

    // If the stream already has a project, show nothing
    if (projects.length > 0) {
        return null
    }

    return (
        <Container>
            <Image src={dataUnionImage2x} alt="Create a project" />
            <TextContainer>
                <Text>Make your stream more discoverable by creating a project.</Text>
                <CreateButton onClick={() => createProductModal.open()}>
                    Create a project
                </CreateButton>
            </TextContainer>
            <CreateProjectModal />
        </Container>
    )
}