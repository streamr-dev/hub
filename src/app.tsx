import '@ibm/plex/css/ibm-plex.css'
import { NavProvider } from '@streamr/streamr-layout'
import { QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import {
    createBrowserRouter,
    Navigate,
    Route,
    RouterProvider,
    Routes,
} from 'react-router-dom'
import styled from 'styled-components'
import { Container } from 'toasterhea'
import '~/analytics'
import GenericErrorPage from '~/pages/GenericErrorPage'
import { NetworkOverviewPage } from '~/pages/NetworkOverviewPage'
import NotFoundPage from '~/pages/NotFoundPage'
import { OperatorPage } from '~/pages/OperatorPage'
import { OperatorsPage } from '~/pages/OperatorsPage'
import ProjectListingPage from '~/pages/ProjectListingPage'
import {
    ExistingProjectPageWrap,
    NewProjectPage,
    ProjectConnectPage,
    ProjectDraftPage,
    ProjectIndexRedirect,
    ProjectLiveDataPage,
    ProjectOverviewPage,
    ProjectTabbedPage,
} from '~/pages/ProjectPage'
import { SingleSponsorshipPage } from '~/pages/SingleSponsorshipPage'
import { SponsorshipsPage } from '~/pages/SponsorshipsPage'
import {
    StreamConnectPage,
    StreamDraftPage,
    StreamEditPage,
    StreamIndexRedirect,
    StreamLiveDataPage,
    StreamTabbedPage,
} from '~/pages/StreamPage'
import { StreamsPage } from '~/pages/StreamsPage'
import '~/shared/assets/stylesheets'
import Globals from '~/shared/components/Globals'
import StreamrClientProvider from '~/shared/components/StreamrClientProvider'
import { Provider as ModalProvider } from '~/shared/contexts/ModalApi'
import { Provider as ModalPortalProvider } from '~/shared/contexts/ModalPortal'
import { getQueryClient } from '~/utils'
import { Layer } from '~/utils/Layer'
import { Route as R } from '~/utils/routes'
import '~/utils/setupSnippets'
import ProjectEditorPage from './pages/ProjectPage/ProjectEditorPage'

const Root = () => (
    <Providers>
        <Globals />
        <Routes>
            <Route errorElement={<GenericErrorPage />}>
                <Route path="/hub/projects">
                    <Route index element={<ProjectListingPage />} />
                    <Route element={<ProjectDraftPage />}>
                        <Route path="new" element={<NewProjectPage />} />
                        <Route path=":id" element={<ExistingProjectPageWrap />}>
                            <Route index element={<ProjectIndexRedirect />} />
                            <Route path="edit" element={<ProjectEditorPage />} />
                            <Route element={<ProjectTabbedPage />}>
                                <Route
                                    path="overview"
                                    element={<ProjectOverviewPage />}
                                />
                                <Route path="connect" element={<ProjectConnectPage />} />
                                <Route
                                    path="live-data"
                                    element={<ProjectLiveDataPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="/hub/streams">
                    <Route index element={<StreamsPage />} />
                    <Route element={<StreamDraftPage />}>
                        <Route
                            path="new"
                            element={
                                <StreamTabbedPage stickySubmit>
                                    {(attach, ready) =>
                                        ready ? (
                                            <StreamEditPage saveButtonRef={attach} />
                                        ) : null
                                    }
                                </StreamTabbedPage>
                            }
                        />
                        <Route path=":id">
                            <Route index element={<StreamIndexRedirect />} />
                            <Route
                                path="overview"
                                element={
                                    <StreamTabbedPage stickySubmit>
                                        {(attach, ready) =>
                                            ready ? (
                                                <StreamEditPage saveButtonRef={attach} />
                                            ) : null
                                        }
                                    </StreamTabbedPage>
                                }
                            />
                            <Route element={<StreamTabbedPage />}>
                                <Route path="connect" element={<StreamConnectPage />} />
                                <Route
                                    path="live-data"
                                    element={<StreamLiveDataPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="/hub/network">
                    <Route
                        index
                        element={
                            <Navigate
                                to={{
                                    pathname: R.sponsorships(),
                                    search: window.location.search,
                                }}
                                replace
                            />
                        }
                    />
                    <Route path="operators">
                        <Route index element={<OperatorsPage />} />
                        <Route path=":id" element={<OperatorPage />} />
                    </Route>
                    <Route path="sponsorships">
                        <Route index element={<SponsorshipsPage />} />
                        <Route path=":id" element={<SingleSponsorshipPage />} />
                    </Route>
                    <Route path="overview" element={<NetworkOverviewPage />} />
                </Route>
                <Route path="/" element={<Navigate to={R.operators()} replace />} />
                <Route
                    path="/hub"
                    element={
                        <Navigate
                            to={{
                                pathname: R.operators(),
                                search: window.location.search,
                            }}
                            replace
                        />
                    }
                />
                <Route path="/error" element={<GenericErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />,
            </Route>
        </Routes>
        <ModalContainer id={Layer.Modal} />
        <ToastContainer id={Layer.Toast} />
    </Providers>
)

export default App

const ModalContainer = styled(Container)`
    position: relative;
    z-index: 11;
`

const ToastContainer = styled(Container)`
    bottom: 0;
    left: 0;
    max-width: 100%;
    padding-bottom: 24px;
    padding-right: 24px;
    position: fixed;
    z-index: 12;
`

function Providers({ children }: { children: ReactNode }) {
    return (
        <NavProvider>
            <StreamrClientProvider>
                <ModalPortalProvider>
                    <ModalProvider>{children}</ModalProvider>
                </ModalPortalProvider>
            </StreamrClientProvider>
        </NavProvider>
    )
}

const router = createBrowserRouter([
    { path: '*', element: <Root />, errorElement: <GenericErrorPage /> },
])

function App() {
    return (
        <QueryClientProvider client={getQueryClient()}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}
