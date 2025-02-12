import React, { useEffect, useMemo } from 'react'
import { Link, Navigate, Outlet, useParams, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { BehindBlockErrorDisplay } from '~/components/BehindBlockErrorDisplay'
import { Button } from '~/components/Button'
import ColoredBox from '~/components/ColoredBox'
import Layout, { LayoutColumn } from '~/components/Layout'
import NetworkPageSegment, { Pad, SegmentGrid } from '~/components/NetworkPageSegment'
import { QueriedStreamsTable } from '~/components/QueriedStreamsTable'
import { TermsOfUse } from '~/components/TermsOfUse'
import {
    useInitialBehindIndexError,
    useLatestBehindBlockError,
    useRefetchQueryBehindIndexEffect,
} from '~/hooks'
import { useProjectByIdQuery } from '~/hooks/projects'
import { StreamsOrderBy, useStreamsQuery } from '~/hooks/streams'
import { useTableOrder } from '~/hooks/useTableOrder'
import ProjectHero from '~/marketplace/containers/ProjectPage/Hero/ProjectHero2'
import NotFoundPage from '~/pages/NotFoundPage'
import { getEmptyParsedProject } from '~/parsers/ProjectParser'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import Segment from '~/shared/components/Segment'
import { StreamConnect } from '~/shared/components/StreamConnect'
import { StreamPreview } from '~/shared/components/StreamPreview'
import SvgIcon from '~/shared/components/SvgIcon'
import {
    ProjectPermission,
    useCurrentProjectAbility,
} from '~/shared/stores/projectAbilities'
import { ProjectType, SalePoint } from '~/shared/types'
import {
    ProjectDraft,
    preselectSalePoint,
    useIsAccessibleByCurrentWallet,
} from '~/stores/projectDraft'
import { isProjectType } from '~/utils'
import { useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { AccessManifest } from './AccessManifest'
import GetAccess from './GetAccess'
import ProjectEditorPage from './ProjectEditorPage'
import ProjectLinkTabs from './ProjectLinkTabs'

export function ProjectDraftPage() {
    const { id: projectId } = useParams<{ id: string }>()

    const draftId = ProjectDraft.useInitDraft(projectId)

    return (
        <ProjectDraft.DraftContext.Provider value={draftId}>
            <Outlet />
        </ProjectDraft.DraftContext.Provider>
    )
}

export function NewProjectPage() {
    const type = useSearchParams()[0].get('type')

    const projectType = isProjectType(type) ? type : ProjectType.OpenData

    const project = useMemo(() => {
        const project = getEmptyParsedProject({
            type: projectType,
        })

        preselectSalePoint(project)

        return project
    }, [projectType])

    const draftId = ProjectDraft.useDraftId()

    const { assign } = ProjectDraft.useDraftStore()

    const initialized = ProjectDraft.useDraft()?.initialized || false

    useEffect(
        function assignProjectToDraft() {
            if (initialized) {
                assign(draftId, project)
            }
        },
        [assign, draftId, initialized, project],
    )

    return <ProjectEditorPage />
}

export function ExistingProjectPageWrap() {
    const { id: projectId } = useParams<{ id: string }>()

    const projectQuery = useProjectByIdQuery(projectId)

    const initialBehindBlockError = useInitialBehindIndexError(projectQuery, [projectId])

    useRefetchQueryBehindIndexEffect(projectQuery)

    const behindBlockError = useLatestBehindBlockError(projectQuery)

    const { data: project = null } = projectQuery

    const isFetching =
        projectQuery.isLoading || projectQuery.isFetching || !!behindBlockError

    const draftId = ProjectDraft.useDraftId()

    const { assign } = ProjectDraft.useDraftStore()

    const initialized = ProjectDraft.useDraft()?.initialized || false

    useEffect(
        function assignProjectToDraft() {
            if (initialized) {
                assign(draftId, project)
            }
        },
        [assign, draftId, initialized, project],
    )

    const placeholder = behindBlockError ? (
        <Layout>
            <LayoutColumn>
                <BehindBlockErrorDisplay
                    latest={behindBlockError}
                    initial={initialBehindBlockError || undefined}
                />
            </LayoutColumn>
        </Layout>
    ) : isFetching ? (
        <Layout>
            <LoadingIndicator loading />
        </Layout>
    ) : (
        <NotFoundPage />
    )

    if (!project) {
        return placeholder
    }

    return <Outlet />
}

export function ProjectOverviewPage() {
    const project = ProjectDraft.useEntity()

    if (!project) {
        return null
    }

    const {
        id,
        name,
        description,
        termsOfUse,
        imageUrl,
        streams,
        type,
        contact,
        salePoints,
    } = project

    if (!id) {
        return null
    }

    const [firstSalePoint = undefined, ...otherSalePoints] = Object.values(
        salePoints,
    ).filter((salePoint) => salePoint?.enabled) as SalePoint[]

    return (
        <LayoutColumn>
            <SegmentGrid>
                <Segment>
                    <ProjectHero
                        contact={contact}
                        description={description}
                        imageUrl={imageUrl || undefined}
                        name={name}
                    />
                </Segment>
                {firstSalePoint && (
                    <Segment>
                        <ColoredBox>
                            <Pad>
                                <AccessManifest
                                    projectId={id}
                                    projectType={type}
                                    firstSalePoint={firstSalePoint}
                                    otherSalePoints={otherSalePoints}
                                />
                            </Pad>
                        </ColoredBox>
                    </Segment>
                )}
                <NetworkPageSegment title="Streams">
                    <StreamTable streamIds={streams} />
                </NetworkPageSegment>
                <NetworkPageSegment title="Terms and conditions">
                    <Pad>
                        <TermsOfUse {...termsOfUse} />
                    </Pad>
                </NetworkPageSegment>
            </SegmentGrid>
        </LayoutColumn>
    )
}

export function ProjectConnectPage() {
    const hasAccess = useIsAccessibleByCurrentWallet()

    const project = ProjectDraft.useEntity()

    if (!project) {
        return null
    }

    const { id, name, type, streams, salePoints } = project

    if (!id) {
        return null
    }

    return (
        <LayoutColumn>
            <SegmentGrid>
                <Segment>
                    {hasAccess ? (
                        <ColoredBox>
                            <Pad>
                                <StreamConnect streams={streams} />
                            </Pad>
                        </ColoredBox>
                    ) : (
                        <GetAccess
                            projectId={id}
                            projectName={name}
                            projectType={type}
                            salePoints={
                                Object.values(salePoints).filter(
                                    (salePoint) => salePoint?.enabled,
                                ) as SalePoint[]
                            }
                        />
                    )}
                </Segment>
            </SegmentGrid>
        </LayoutColumn>
    )
}

export function ProjectLiveDataPage() {
    const hasAccess = useIsAccessibleByCurrentWallet()

    const project = ProjectDraft.useEntity()

    if (!project) {
        return null
    }

    const { id, name, type, streams, salePoints } = project

    if (!id) {
        return null
    }

    return hasAccess ? (
        <StreamPreview streamsList={streams} />
    ) : (
        <LayoutColumn>
            <SegmentGrid>
                <Segment>
                    <GetAccess
                        projectId={id}
                        projectName={name}
                        projectType={type}
                        salePoints={
                            Object.values(salePoints).filter(
                                (salePoint) => salePoint?.enabled,
                            ) as SalePoint[]
                        }
                    />
                </Segment>
            </SegmentGrid>
        </LayoutColumn>
    )
}

export function ProjectTabbedPage() {
    const { id = '', name = '', creator = '' } = ProjectDraft.useEntity() || {}

    const busy = ProjectDraft.useIsDraftBusy()

    const canEdit = useCurrentProjectAbility(ProjectPermission.Edit)

    const chainKey = useCurrentChainKey()

    return (
        <Layout pageTitle={name}>
            <DetailsPageHeader
                backButtonLink={R.projects(routeOptions(chainKey))}
                pageTitle={
                    <PageTitleContainer>
                        <ProjectTitle>
                            {name}
                            {!!creator && (
                                <>
                                    <Separator> by </Separator>
                                    <strong>{creator}</strong>
                                </>
                            )}
                        </ProjectTitle>
                        {canEdit && (
                            <EditButton
                                as={Link}
                                to={R.projectEdit(id, routeOptions(chainKey))}
                                kind="secondary"
                                size="mini"
                            >
                                <SvgIcon name="pencilFull" />
                            </EditButton>
                        )}
                    </PageTitleContainer>
                }
                rightComponent={<ProjectLinkTabs projectId={id} />}
            />
            <LoadingIndicator loading={busy} />
            <Outlet />
        </Layout>
    )
}

/**
 * @todo Taken care of in `app`, no? Double-check & remove.
 */
export function ProjectIndexRedirect() {
    const { id = '' } = useParams<{ id: string }>()

    return (
        <Navigate
            to={{
                pathname: R.project(id),
                search: window.location.search,
            }}
            replace
        />
    )
}

function StreamTable({ streamIds }: { streamIds: string[] }) {
    const {
        orderBy = 'mps',
        orderDirection = 'desc',
        setOrder,
    } = useTableOrder<StreamsOrderBy>()

    const streamsQuery = useStreamsQuery({
        orderBy,
        orderDirection,
        streamIds,
    })

    return (
        <QueriedStreamsTable
            onOrderChange={setOrder}
            orderBy={orderBy}
            orderDirection={orderDirection}
            query={streamsQuery}
        />
    )
}

const PageTitleContainer = styled.div`
    align-items: center;
    display: flex;
`

const EditButton = styled(Button)`
    border-radius: 100%;
    height: 32px;
    margin-left: 10px;
    width: 32px;
`

const ProjectTitle = styled.span`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

const Separator = styled.span`
    white-space: pre-wrap;
`
