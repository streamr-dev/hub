import React from 'react'
import { MemoryRouter, Switch } from 'react-router-dom'
import { mount } from 'enzyme'
import UserpagesRouter from '$mp/../app/Userpages'

/* eslint-disable react/prop-types */
jest.mock('$app/src/pages/StreamEditPage', () => ({
    __esModule: true,
    default: ({ match }) => `Stream ${match.params.id} view/edit page`,
}))
jest.mock('$app/src/pages/StreamListPage', () => ({
    __esModule: true,
    default: () => 'Stream list',
}))
jest.mock('$app/src/pages/StreamCreatePage', () => ({
    __esModule: true,
    default: () => 'New stream page',
}))
jest.mock('$userpages/components/TransactionPage/List', () => ({
    __esModule: true,
    default: () => 'Transaction list',
}))
jest.mock('$userpages/components/ProfilePage', () => ({
    __esModule: true,
    default: () => 'Profile page',
}))
jest.mock('$userpages/components/PurchasesPage', () => ({
    __esModule: true,
    default: () => 'Subscriptions',
}))
jest.mock('$userpages/components/ProductsPage', () => ({
    __esModule: true,
    default: () => 'Products list',
}))
jest.mock('$auth/utils/userAuthenticated', () => ({
    __esModule: true,
    UserIsAuthenticatedRoute: ({children}) => <>{children}</>,
}))

/* eslint-enable react/prop-types */
describe('Userpages Routes', () => {
    it('shows the new stream page', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/streams/new']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('New stream page')
    })
    it('shows stream details', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/streams/steamid123']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Stream steamid123 view/edit page')
    })
    it('shows transactions list', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/transactions']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Transaction list')
    })
    it('shows subscriptions list', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/subscriptions']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Subscriptions')
    })
    it('shows products list', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/products']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Products list')
    })
    /*
    it('redirects to stream list on bad route', () => {
        const el = mount(
            <MemoryRouter initialEntries={['/core/some/route']}>
                <Switch>{UserpagesRouter()}</Switch>
            </MemoryRouter>,
        )
        expect(el.text()).toBe('Stream list')
    })
    */
})
