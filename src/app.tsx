import React, { ReactNode } from 'react'
import { Container } from 'toasterhea'
import styled from 'styled-components'
import { Navigate, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { NavProvider } from '@streamr/streamr-layout'
import '~/shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'
import '~/utils/setupSnippets'
import StreamrClientProvider from '~/shared/components/StreamrClientProvider'
import { Provider as ModalPortalProvider } from '~/shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '~/shared/contexts/ModalApi'
import NotFoundPage from '~/pages/NotFoundPage'
import GenericErrorPage from '~/pages/GenericErrorPage'
import Analytics from '~/shared/utils/Analytics'
import StreamListingPage from '~/pages/StreamListingPage'
import StreamPage from '~/pages/StreamPage'
import {
    ExistingProjectPageWrap,
    NewProjectPage,
    ProjectConnectPage,
    ProjectIndexRedirect,
    ProjectLiveDataPage,
    ProjectOverviewPage,
    ProjectTabbedPage,
} from '~/pages/ProjectPage'
import ProjectListingPage from '~/pages/ProjectListingPage'
import { NetworkOverviewPage } from '~/pages/NetworkOverviewPage'
import { SponsorshipsPage } from '~/pages/SponsorshipsPage'
import { SingleSponsorshipPage } from '~/pages/SingleSponsorshipPage'
import { OperatorsPage } from '~/pages/OperatorsPage'
import { SingleOperatorPage } from '~/pages/SingleOperatorPage'
import Globals from '~/shared/components/Globals'
import { Layer } from '~/utils/Layer'
import routes from '~/routes'
import { HubRouter } from '~/consts'
import { getQueryClient } from '~/utils'
import '~/analytics'
import ProjectEditorPage from './pages/ProjectPage/ProjectEditorPage'

const MiscRouter = () => [
    <Route
        errorElement={<GenericErrorPage />}
        path={routes.root()}
        element={<Navigate to={routes.projects.index()} replace />}
        key="RootRedirect"
    />,
    <Route
        errorElement={<GenericErrorPage />}
        path={routes.hub()}
        element={<Navigate to={routes.projects.index()} replace />}
        key="HubRedirect"
    />,
    <Route
        errorElement={<GenericErrorPage />}
        path="/error"
        element={<GenericErrorPage />}
        key="GenericErrorPage"
    />,
    <Route
        errorElement={<GenericErrorPage />}
        path="*"
        element={<NotFoundPage />}
        key="NotFoundPage"
    />,
]

const App = () => (
    <Root>
        <Analytics />
        <Globals />
        <Routes>
            <Route path="/hub/projects" errorElement={<GenericErrorPage />}>
                <Route index element={<ProjectListingPage />} />
                <Route path="new" element={<NewProjectPage />} />
                <Route path=":id" element={<ExistingProjectPageWrap />}>
                    <Route index element={<ProjectIndexRedirect />} />
                    <Route path="edit" element={<ProjectEditorPage />} />
                    <Route element={<ProjectTabbedPage />}>
                        <Route path="overview" element={<ProjectOverviewPage />} />
                        <Route path="connect" element={<ProjectConnectPage />} />
                        <Route path="live-data" element={<ProjectLiveDataPage />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/hub/streams/*" errorElement={<GenericErrorPage />}>
                <Route index element={<StreamListingPage />} />
                <Route path=":id/*" element={<StreamPage />} />
            </Route>
            <Route path="/hub/network/*" errorElement={<GenericErrorPage />}>
                <Route
                    index
                    element={<Navigate to={routes.network.sponsorships()} replace />}
                />
                <Route path="operators/*" errorElement={<GenericErrorPage />}>
                    <Route index element={<OperatorsPage />} />
                    <Route path=":id" element={<SingleOperatorPage />} />
                </Route>
                <Route path="sponsorships/*" errorElement={<GenericErrorPage />}>
                    <Route index element={<SponsorshipsPage />} />
                    <Route path=":id" element={<SingleSponsorshipPage />} />
                </Route>
                <Route path="overview" element={<NetworkOverviewPage />} />
            </Route>
            {MiscRouter()}
        </Routes>
        <Container id={Layer.Modal} />
        <ToastContainer id={Layer.Toast} />
    </Root>
)

export default App

const ToastContainer = styled(Container)`
    bottom: 0;
    left: 0;
    max-width: 100%;
    padding-bottom: 24px;
    padding-right: 24px;
    position: fixed;
    z-index: 10;
`

function Root({ children }: { children: ReactNode }) {
    return (
        <HubRouter>
            <QueryClientProvider client={getQueryClient()}>
                <NavProvider>
                    <StreamrClientProvider>
                        <ModalPortalProvider>
                            <ModalProvider>{children}</ModalProvider>
                        </ModalPortalProvider>
                    </StreamrClientProvider>
                </NavProvider>
            </QueryClientProvider>
        </HubRouter>
    )
}
