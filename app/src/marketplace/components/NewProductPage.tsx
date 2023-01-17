import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import BN from 'bignumber.js'
import type { Location } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import qs from 'query-string'
import type { ProjectType } from '$mp/types/project-types'
import '$mp/types/project-types'
import useIsMounted from '$shared/hooks/useIsMounted'
import { projectTypes } from '$mp/utils/constants'
import useFailure from '$shared/hooks/useFailure'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { DetailsPageHeader } from '$shared/components/DetailsPageHeader'
import { EditorNav2 } from '$mp/containers/EditProductPage/EditorNav2'
import { ProjectStateContext, ProjectStateContextProvider } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import {
    ValidationContext2,
    ValidationContext2Provider
} from '$mp/containers/ProductController/ValidationContextProvider2'
import { ProjectEditor } from '$mp/containers/EditProductPage/ProjectEditor'
import styles from '$shared/components/Layout/layout.pcss'
import usePreventNavigatingAway from '$shared/hooks/usePreventNavigatingAway'
import { selectUserData } from '$shared/modules/user/selectors'
import useNewProductMode from '../containers/ProductController/useNewProductMode'

type Props = {
    className?: string | null | undefined
    location: Location
}

const sanitizedType = (type: string | null | undefined): ProjectType => projectTypes[(type || '').toUpperCase()] || projectTypes.NORMAL

const UnstyledNewProductPage = ({ className, location: { search } }: Props) => {
    const history = useHistory()
    const isMounted = useIsMounted()
    const fail = useFailure()
    const location = useLocation()
    const {state: project} = useContext(ProjectStateContext)
    const { dataUnionAddress, chainId } = useNewProductMode() // TODO check if it's still needed
    const currentUser = useSelector(selectUserData)
    const { type, isFree } = qs.parse(search)
    const typeString = (type != null && typeof type === "string") ? type : type[0]
    const sanitized = sanitizedType(typeString)
    const {updateType, updateIsFree} = useEditableProjectActions()
    const { isAnyTouched, resetTouched, status } = useContext(ValidationContext2)
    usePreventNavigatingAway('You have unsaved changes', isAnyTouched)
    useEffect(() => {
        if (!!sanitized) {
            updateType(sanitized)
        }
    }, [sanitized])

    useEffect(() => {
        const isFreeProject = sanitized !== projectTypes.DATAUNION && isFree === 'true'
        updateIsFree(isFreeProject, new BN(10))
    }, [isFree, sanitized])

    useEffect(() => {
        resetTouched()
    }, [])

    const pageTitle = useMemo<ReactNode>(() => {
        if (project.type === projectTypes.DATAUNION) {
            return <>Data Union by <strong>{currentUser.name || currentUser.username}</strong></>
        }
        if (project.isFree) {
            return <>Open Data by <strong>{currentUser.name || currentUser.username}</strong></>
        }
        return <>Paid Data by <strong>{currentUser.name || currentUser.username}</strong></>
    }, [project, currentUser])

    const linkTabs = useMemo(() => [
        {
            label: 'Project Overview',
            href: location.pathname,
            disabled: false,
        }, {
            label: 'Connect',
            href: '',
            disabled: true,
        }, {
            label: 'Live Data',
            href: '',
            disabled: true,
        }], [location])

    return <Layout nav={<EditorNav2/>} innerClassName={styles.greyInner}>
        <MarketplaceHelmet title={'Create a new project'}/>
        <DetailsPageHeader
            pageTitle={pageTitle}
            linkTabs={linkTabs}
        />
        <ProjectEditor/>
    </Layout>
}

const StyledNewProductPage = styled(UnstyledNewProductPage)`
    position: absolute;
    top: 0;
    height: 2px;
`

const NewProjectPageContainer = (props: Props) => {
    return <ValidationContext2Provider>
        <ProjectStateContextProvider>
            <StyledNewProductPage {...props}/>
        </ProjectStateContextProvider>
    </ValidationContext2Provider>
}
export default NewProjectPageContainer
