import React, { FunctionComponent, ReactNode } from 'react'
import { Router, Route as RouterRoute, Switch, Redirect, useParams } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Container } from 'toasterhea'
import '$shared/assets/stylesheets'
import '@ibm/plex/css/ibm-plex.css'
import '$utils/setupSnippets'

import StreamrClientProvider from '$shared/components/StreamrClientProvider'
import LoginPage from '$app/src/pages/LoginPage'
import LogoutPage from '$app/src/pages/LogoutPage'
import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import { Provider as ModalProvider } from '$shared/contexts/ModalApi'
import Notifications from '$shared/components/Notifications'
import ActivityResourceProvider from '$shared/components/ActivityList/ActivityResourceProvider'
import NotFoundPage from '$shared/components/NotFoundPage'
import AnalyticsTracker from '$shared/components/AnalyticsTracker'
import GenericErrorPage from '$shared/components/GenericErrorPage'
import ErrorPage from '$shared/components/ErrorPage'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import Analytics from '$shared/utils/Analytics'
import GlobalInfoWatcher from '$mp/containers/GlobalInfoWatcher'
import NewStreamListingPage from '$app/src/pages/NewStreamListingPage'
import StreamLiveDataPage from '$app/src/pages/StreamLiveDataPage'
import StreamConnectPage from '$app/src/pages/StreamConnectPage'
import StreamEditPage from '$app/src/pages/StreamEditPage'
import StreamCreatePage from '$app/src/pages/StreamCreatePage'
import ProjectPage from '$mp/containers/ProjectPage'
import ProjectsPage from '$mp/containers/Projects'
import ProjectConnectPage from '$mp/containers/ProjectPage/ProjectConnectPage'
import ProjectLiveDataPage from '$mp/containers/ProjectPage/ProjectLiveDataPage'
import NewProjectPage from '$mp/containers/ProjectEditing/NewProjectPage'
import EditProjectPage from '$mp/containers/ProjectEditing/EditProjectPage'
import { AuthenticationControllerContextProvider } from '$auth/authenticationController'
import { UserIsAuthenticatedRoute } from '$auth/utils/userAuthenticated'

import routes from '$routes'
import history from '../history'
import '../analytics'
import { Layer } from '../utils/Layer'

// Wrap authenticated components here instead of render() method
// Wrap each Route to an ErrorBoundary
const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const AuthenticationRouter = () => [
    <Route exact path={routes.auth.login()} component={LoginPage} key="LoginPage" />,
    <Route exact path={routes.auth.logout()} component={LogoutPage} key="LogoutPage" />,
    // Redirect old paths to login
    <Redirect from="/login/auth" to={routes.auth.login()} key="LoginRedirect" />,
    <Redirect from="/signup" to={routes.auth.login()} key="SignUpRedirect" />,
    <Redirect from="/forgotPassword" to={routes.auth.login()} key="ForgotPasswordRedirect" />,
    <Redirect from="/resetPassword" to={routes.auth.login()} key="ResetPasswordRedirect" />,
    <Redirect from="/register" to={routes.auth.login()} key="RegisterRedirect" />,
    <Redirect from="/register/register" to={routes.auth.login()} key="LegacyRegisterRedirect" />,
    <Redirect from="/register/resetPassword" to={routes.auth.login()} key="LegacyResetPasswordRedirect" />,
    <Redirect from="/register/forgotPassword" to={routes.auth.login()} key="LegacyForgotPasswordRedirect" />,
]

const MiscRouter = () => [
    <Redirect from={routes.root()} to={routes.projects.index()} key="RootRedirect" />, // edge case for localhost
    <Redirect from={routes.hub()} to={routes.projects.index()} key="HubRedirect" />,
    <Route exact path="/error" component={GenericErrorPage} key="GenericErrorPage" />,
    <Route component={NotFoundPage} key="NotFoundPage" />,
]

const NewProjectPageAuth = (props) => {
    return <UserIsAuthenticatedRoute>
        <NewProjectPage {...props} />
    </UserIsAuthenticatedRoute>
}

const ProjectRedirect: FunctionComponent = () => {
    const { id } = useParams<{id: string}>()
    return <Redirect to={routes.projects.overview({id})}/>
}

const ProjectsRouter = (): ReactNode => [
    <Route exact path={routes.projects.index()} component={ProjectsPage} key="Projects" />,
    <Route exact path={routes.projects.new()} component={NewProjectPageAuth} key="NewProjectPage" />,
    <Route exact path={routes.projects.show()} component={ProjectRedirect} key="ProjectRedirect"/>,
    <Route exact path={routes.projects.edit()} component={EditProjectPage} key="EditProjectPage" />,
    <Route exact path={routes.projects.overview()} component={ProjectPage} key="ProjectDetailsOverviewPage" />,
    <Route exact path={routes.projects.connect()} component={ProjectConnectPage} key="ProjectDetailsConnectPage" />,
    <Route exact path={routes.projects.liveData()} component={ProjectLiveDataPage} key="ProjectDetailsLiveDataPage" />,
]

const StreamRedirect: FunctionComponent = () => {
    const { id } = useParams<{id: string}>()
    return <Redirect to={routes.streams.overview({id})}/>
}

const StreamsRouter = () => [
    <Route exact path={routes.streams.index()} component={NewStreamListingPage} key="NewStreamListingPage" />,
    <Route exact path={routes.streams.new()} component={StreamCreatePage} key="StreamCreatePage" />,
    <Route exact path={routes.streams.show()} component={StreamRedirect} key="StreamRedirect" />,
    <Route exact path={routes.streams.overview()} component={StreamEditPage} key="StreamDetailsOverviewPage" />,
    <Route exact path={routes.streams.connect()} component={StreamConnectPage} key="StreamDetailsConnectPage" />,
    <Route exact path={routes.streams.liveData()} component={StreamLiveDataPage} key="StreamDetailsLiveDataPage" />,
]

// Create client for 'react-query'
const queryClient = new QueryClient()

const App = () => (
    <Router history={history}>
        <QueryClientProvider client={queryClient}>
            <AuthenticationControllerContextProvider>
                <StreamrClientProvider>
                    <ModalPortalProvider>
                        <ModalProvider>
                            <GlobalInfoWatcher>
                                <ActivityResourceProvider>
                                    <Analytics />
                                    <Switch>
                                        {AuthenticationRouter()}
                                        {ProjectsRouter()}
                                        {StreamsRouter()}
                                        {MiscRouter()}
                                    </Switch>
                                    <Notifications />
                                    <Container id={Layer.Modal} />
                                </ActivityResourceProvider>
                                <AnalyticsTracker />
                            </GlobalInfoWatcher>
                        </ModalProvider>
                    </ModalPortalProvider>
                </StreamrClientProvider>
            </AuthenticationControllerContextProvider>
        </QueryClientProvider>
    </Router>
)

export default App
