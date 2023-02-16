import React, {FunctionComponent} from 'react'
import { Route as RouterRoute, Redirect } from 'react-router-dom'
import {UserIsAuthenticatedRoute} from '$auth/utils/userAuthenticated'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorPage from '$shared/components/ErrorPage'
// Userpages
import StreamInspectorPage from '$app/src/pages/StreamInspectorPage'
import StreamCreatePage from '$app/src/pages/StreamCreatePage'
import StreamListView from '$app/src/pages/StreamListPage'
import StreamEditPage from '$app/src/pages/StreamEditPage'
import TransactionList from '$userpages/components/TransactionPage/List'
import PurchasesPage from '$userpages/components/PurchasesPage'
import ProductsPage from '$userpages/components/ProductsPage'
import DataUnionPage from '$userpages/components/DataUnionPage'
import EditProductPage from '$mp/containers/EditProductPage'
import routes from '$routes'
const Route = withErrorBoundary(ErrorPage)(RouterRoute)
// Userpages Auth
const StreamListViewAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <StreamListView {...props}/>
</UserIsAuthenticatedRoute>
const TransactionListAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <TransactionList {...props}/>
</UserIsAuthenticatedRoute>
const PurchasesPageAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <PurchasesPage {...props}/>
</UserIsAuthenticatedRoute>
const ProductsPageAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <ProductsPage {...props}/>
</UserIsAuthenticatedRoute>
const DataUnionPageAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <DataUnionPage {...props}/>
</UserIsAuthenticatedRoute>
const EditProductAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <EditProductPage {...props}/>
</UserIsAuthenticatedRoute>
const StreamCreatePageAuth: FunctionComponent = (props) => <UserIsAuthenticatedRoute>
    <StreamCreatePage {...props}/>
</UserIsAuthenticatedRoute>

const UserpagesRouter = () => [
    <Route exact path={routes.streams.new()} component={StreamCreatePageAuth} key="StreamCreatePage" />,
    <Route exact path={routes.streams.show()} component={StreamEditPage} key="streamEditPage" />,
    <Redirect exact from={routes.streams.public.show()} to={routes.streams.show()} key="publicStreamPageRedir" />,
    <Redirect
        exact
        from={routes.streams.public.preview()}
        to={routes.streams.preview()}
        key="publicStreamPreviewPageRedir"
    />,
    <Route exact path={routes.streams.preview()} component={StreamInspectorPage} key="streamPreviewPage" />,
    // <Route exact path={routes.streams.index()} component={StreamListViewAuth} key="StreamListView" />,
    <Route exact path={routes.transactions()} component={TransactionListAuth} key="TransactionList" />,
    <Route exact path={routes.subscriptions()} component={PurchasesPageAuth} key="PurchasesPage" />,
    <Route exact path={routes.products.index()} component={ProductsPageAuth} key="ProductsPage" />,
    <Route exact path={routes.dataunions.index()} component={DataUnionPageAuth} key="DataUnionPage" />,
    <Route exact path={routes.products.edit()} component={EditProductAuth} key="EditProduct" />,
]

export default UserpagesRouter
