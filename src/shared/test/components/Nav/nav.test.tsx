import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render, RenderResult, screen } from '@testing-library/react'
import Nav from '~/components/Nav'
import { useWalletAccount, useEns } from '~/shared/stores/wallet'

jest.mock('~/shared/stores/wallet', () => ({
    __esModule: true,
    useWalletAccount: jest.fn(),
    useEns: jest.fn(),
}))

jest.mock('~/utils', () => ({
    __esModule: true,
    saveOperator: jest.fn(),
}))

jest.mock('~/modals/ConnectModal', () => ({
    __esModule: true,
    default: () => <></>,
}))

jest.mock('~/modals/OperatorModal', () => ({
    __esModule: true,
}))

jest.mock('~/hooks/operators', () => {
    return {
        __esModule: true,
        useOperatorForWalletQuery() {
            return {
                isFetching: false,
            }
        },
    }
})

function mountNav(): RenderResult {
    return render(
        <MemoryRouter>
            <Nav />
        </MemoryRouter>,
    )
}

/* eslint-disable object-curly-newline */
describe('Nav.Wide', () => {
    it('renders logo', () => {
        mountNav()
        expect(screen.getByTestId('logo')).toBeTruthy()
    })

    it('renders the menu links', () => {
        mountNav()
        expect(screen.getAllByText('Streams').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Projects').length).toBeGreaterThan(0)
    })

    it('renders the Connect button', () => {
        mountNav()
        expect(screen.getAllByText('Connect').length).toBeGreaterThan(0)
    })

    describe('When the user is signed in', () => {
        beforeEach(() => {
            ;(useWalletAccount as any).mockImplementation(() => '0xADDR')
            ;(useEns as any).mockImplementation(() => '')
        })

        it('does not render the Connect button', () => {
            mountNav()
            expect(screen.queryAllByText('Connect').length).toEqual(0)
        })

        it('renders the Disconnect button', () => {
            mountNav()
            expect(screen.getAllByText('Disconnect').length).toBeGreaterThan(0)
        })

        it('renders the user avatar', () => {
            mountNav()
            expect(screen.queryByTestId('avatarless')).toBeTruthy()
        })
    })
})
