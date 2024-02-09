import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import {
    Navigate,
    Outlet,
    Route,
    Routes,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import { getProjectByIdQuery } from '~/hooks/projects'
import NotFoundPage from '~/pages/NotFoundPage'
import { getEmptyParsedProject } from '~/parsers/ProjectParser'
import routes from '~/routes'
import { useCurrentChainId } from '~/shared/stores/chain'
import { ProjectType } from '~/shared/types'
import {
    ProjectDraftContext,
    preselectSalePoint,
    useInitProjectDraft,
} from '~/stores/projectDraft'
import { isProjectType } from '~/utils'
import ProjectEditorPage from './ProjectEditorPage'
import TabbedPage from './TabbedPage'

function ProjectIndexRedirect() {
    const { id = '' } = useParams<{ id: string }>()

    return (
        <Navigate
            to={routes.projects.overview({
                id: encodeURIComponent(id),
            })}
            replace
        />
    )
}

export default function ProjectPage() {
    return (
        <Routes>
            <Route path="/new" element={<NewProjectPage />} />
            <Route path="/:id" element={<ExistingProjectPageWrap />}>
                <Route index element={<ProjectIndexRedirect />} />
                <Route path="edit" element={<ProjectEditorPage />} />
                <Route path="overview" element={<TabbedPage tab="overview" />} />
                <Route path="connect" element={<TabbedPage tab="connect" />} />
                <Route path="live-data" element={<TabbedPage tab="live-data" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

function NewProjectPage() {
    const type = useSearchParams()[0].get('type')

    const projectType = isProjectType(type) ? type : ProjectType.OpenData

    const project = useMemo(() => {
        const project = getEmptyParsedProject({
            type: projectType,
        })

        preselectSalePoint(project)

        return project
    }, [projectType])

    const draftId = useInitProjectDraft(project)

    return (
        <ProjectDraftContext.Provider value={draftId}>
            <ProjectEditorPage />
        </ProjectDraftContext.Provider>
    )
}

function ExistingProjectPageWrap() {
    const { id: projectId } = useParams<{ id: string }>()

    const chainId = useCurrentChainId()

    const query = useQuery({
        queryKey: ['ExistingProjectPageWrap.query', chainId, projectId?.toLowerCase()],
        queryFn: () =>
            projectId ? getProjectByIdQuery(chainId, projectId) : Promise.resolve(null),
        staleTime: Infinity,
        cacheTime: 0,
    })

    const { data: project = null } = query

    const isLoading = !project && (query.isLoading || query.isFetching)

    const draftId = useInitProjectDraft(isLoading ? undefined : project)

    return (
        <ProjectDraftContext.Provider value={draftId}>
            {query.isError ? <NotFoundPage /> : <Outlet />}
        </ProjectDraftContext.Provider>
    )
}
