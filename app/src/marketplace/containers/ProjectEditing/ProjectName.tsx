import React, { useContext, useCallback, ChangeEvent } from 'react'
import styled from 'styled-components'
import { ProjectHeroTitleStyles } from '$mp/containers/ProjectPage/Hero/ProjectHero2.styles'
import EnhancedText from '$ui/Text'
import { COLORS } from '$shared/utils/styled'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
type Props = {
    disabled?: boolean
}

const ProjectNameInputContainer = styled.div`
    ${ProjectHeroTitleStyles};
`

const ProjectNameInput = styled(EnhancedText)`
    padding: 0;
    border: none;
    line-height: 44px;
    font-size: 34px;

    &:not(:disabled):focus {
        border: none;
    }

    ::placeholder {
        color: ${COLORS.primaryDisabled};
    }
`

const ProjectName = ({ disabled }: Props) => {
    const { state: product } = useContext(ProjectStateContext)
    const { updateName } = useEditableProjectActions()
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            updateName(e.target.value)
            e.preventDefault()
        },
        [updateName],
    )
    return (
        <ProjectNameInputContainer>
            <ProjectNameInput
                name={'projectName'}
                disabled={disabled}
                placeholder={'Project name'}
                value={product.name || ''}
                onChange={onChange}
                autoFocus
            />
        </ProjectNameInputContainer>
    )
}

export default ProjectName
