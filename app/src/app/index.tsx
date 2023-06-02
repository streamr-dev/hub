import React, { FunctionComponent, ReactNode } from 'react'
import { Container } from 'toasterhea'
import styled from 'styled-components'
import { Router, Route as RouterRoute, Switch, Redirect } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'
import '$utils/setupSnippets'
import StreamrClientProvider from '$shared/components/StreamrClientProvider'
import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '$shared/contexts/ModalApi'
import NotFoundPage from '$shared/components/NotFoundPage'
import AnalyticsTracker from '$shared/components/AnalyticsTracker'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ErrorPage from '$shared/components/ErrorPage'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import Analytics from '$shared/utils/Analytics'
import GlobalInfoWatcher from '$mp/containers/GlobalInfoWatcher'
import NewStreamListingPage from '$app/src/pages/NewStreamListingPage'
import StreamPage from '$app/src/pages/StreamPage'
import ProjectPage from '$app/src/pages/ProjectPage'
import ProjectsPage from '$mp/containers/Projects'
import NewProjectPage from '$mp/containers/ProjectEditing/NewProjectPage'
import EditProjectPage from '$mp/containers/ProjectEditing/EditProjectPage'
import Globals from '$shared/components/Globals'
import { Layer } from '$utils/Layer'
import history from '$app/src/history'
import routes from '$routes'
import '../analytics'

// Wrap authenticated components here instead of render() method
// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const MiscRouter = () => [
    <Redirect from={routes.root()} to={routes.projects.index()} key="RootRedirect" />, // edge case for localhost
    <Redirect from={routes.hub()} to={routes.projects.index()} key="HubRedirect" />,
    <Route exact path="/error" component={GenericErrorPage} key="GenericErrorPage" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
]

const ProjectsRouter = (): ReactNode => [
    <Route exact path={routes.projects.index()} component={ProjectsPage} key="Projects" />,
    <Route exact path={routes.projects.new()} component={NewProjectPage} key="NewProjectPage" />,
    <Route exact path={routes.projects.edit()} component={EditProjectPage} key="EditProjectPage" />,
    <Route path={routes.projects.show()} component={ProjectPage} key="Tabbed" />,
]

const StreamsRouter = () => [
    <Route exact path={routes.streams.index()} component={NewStreamListingPage} key="NewStreamListingPage" />,
    <Route path={routes.streams.show()} component={StreamPage} key="StreamPage" />,
]

// Create client for 'react-query'
const queryClient = new QueryClient()

const App = () => (
    <Router history={history}>
        <QueryClientProvider client={queryClient}>
            <StreamrClientProvider>
                <ModalPortalProvider>
                    <ModalProvider>
                        <Analytics />
                        <Globals />
                        <Switch>
                            {ProjectsRouter()}
                            {StreamsRouter()}
                            {MiscRouter()}
                        </Switch>
                        <Container id={Layer.Modal} />
                        <ToastContainer id={Layer.Toast} />
                        <AnalyticsTracker />
                    </ModalProvider>
                </ModalPortalProvider>
            </StreamrClientProvider>
        </QueryClientProvider>
    </Router>
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
