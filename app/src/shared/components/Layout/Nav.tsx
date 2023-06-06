import React, { Fragment, FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { toaster } from 'toasterhea'
import { useLocation } from 'react-router-dom'
import {
    Button,
    HamburgerButton,
    Logo,
    Menu as UnstyledMenu,
    NavDropdown,
    NavOverlay,
} from '@streamr/streamr-layout'
import {
    MD as TABLET,
    LG as DESKTOP,
    COLORS,
    REGULAR,
    MEDIUM,
} from '$shared/utils/styled'
import Link from '$shared/components/Link'
import SvgIcon from '$shared/components/SvgIcon'
import AvatarImage from '$shared/components/AvatarImage'
import { truncate } from '$shared/utils/text'
import ConnectModal from '$app/src/modals/ConnectModal'
import { Layer } from '$app/src/utils/Layer'
import { useEns, useWalletAccount } from '$shared/stores/wallet'
import toast from '$app/src/utils/toast'
import routes from '$routes'
import { Avatarless, Name, Username } from './User'

const MOBILE_LG = 576

const CaretDownIcon = styled(SvgIcon)`
    opacity: 1;
`
const CaretUpIcon = styled(SvgIcon)`
    opacity: 0;
`
const DropdownToggle = styled.div`
    background: #f8f8f8;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    position: relative;
    margin-top: 1px;

    svg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        transition: 200ms opacity;
    }
`
const Menu = styled(UnstyledMenu)``
const MenuItem = styled(Menu.Item)`
    &.user-info {
        padding: 0 16px !important;
    }
    &.disconnect {
        padding: 0 !important;
        .disconnect-text {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
`

const MenuDivider = styled(Menu.Divider)`
    margin: 0;
`

const WalletAddress = styled.div`
    margin-left: 13px;
    display: flex;
    flex-direction: column;
    span {
        font-size: 14px;
        line-height: 18px;
        user-select: none;
        color: ${COLORS.primary};
        font-weight: 400;
        &.ens-name {
            font-weight: 500;
        }
    }
`

const SignedInUserMenu = styled(NavDropdown)`
    ${Menu} {
        width: 260px;
        padding: 0;

        ${Menu.Item}:first-child {
            padding: 0 4px;
            margin-bottom: 10px;
        }

        ${Avatarless} {
        }

        ${Name},
        ${Username} {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    :hover ${DropdownToggle} {
        ${CaretDownIcon} {
            opacity: 0;
        }

        ${CaretUpIcon} {
            opacity: 1;
        }
    }
`
export const Navbar = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
`
const MenuGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    justify-content: center;
    align-items: center;
`
const NavLink = styled.a``
export const NavbarItem = styled.div`
    ${MenuGrid} & + & {
        margin-left: 16px;
    }
`
const LinkWrapper = styled.div`
    ${NavLink} {
        display: block;
        color: ${COLORS.primaryLight};
        text-transform: uppercase;
        font-weight: ${MEDIUM};
        letter-spacing: 2px;
        white-space: nowrap;
        text-decoration: none !important;
    }

    &:hover {
        ${NavLink} {
            color: ${COLORS.primary};
        }
    }
`

type UnstyledNavbarLinkProps = {
    highlight?: boolean
    children: any
}

const UnstyledNavbarLink: FunctionComponent<UnstyledNavbarLinkProps> = ({
    highlight,
    children,
    ...props
}) => {
    return <LinkWrapper {...props}>{children}</LinkWrapper>
}

const NavbarLinkDesktop = styled(UnstyledNavbarLink)<{ highlight: boolean }>`
    position: relative;

    ${NavLink} {
        font-size: 12px;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
    }

    &:after {
        display: block;
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        transition: width 0.2s ease-out;
        width: 0;
        height: 2px;
        background-color: ${COLORS.primary};
        transform: translateX(-50%);
    }

    &:hover {
        &:after {
            transition: width 0.2s ease-in;
            width: 20px;
        }
    }

    ${({ highlight }) =>
        highlight &&
        css`
            &:after {
                left: 50%;
                width: 20px;
            }

            ${NavLink} {
                color: ${COLORS.primary};
            }
        `}
`

const NavbarLinkMobile = styled(UnstyledNavbarLink)<{ highlight: boolean }>`
    position: relative;
    border-bottom: 1px solid #efefef;

    ${NavLink} {
        font-size: 18px;
        line-height: 100px;
    }

    ${({ highlight }) =>
        highlight &&
        css`
            &:after {
                display: block;
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: -24px;
                width: 3px;
                height: 32px;
                background-color: ${COLORS.primary};
            }

            ${NavLink} {
                color: ${COLORS.primary};
            }

            @media (min-width: ${MOBILE_LG}px) {
                &:after {
                    left: -64px;
                }
            }
        `}
`

const NavbarItemAccount = styled.div`
    margin-left: auto;
    margin-right: 15px;

    @media (min-width: ${TABLET}px) {
        margin-right: 0;
    }
`

const UnstyledLogoLink: FunctionComponent<{ children?: any; href: string }> = ({
    children,
    ...props
}) => {
    return <a {...props}>{children}</a>
}

export const LogoLink = styled(UnstyledLogoLink)`
    color: #f65f0a !important;
    display: block;
    max-width: 64px;
    width: 32px;

    @media (min-width: ${DESKTOP}px) {
        width: 40px;
    }
`

const Avatar = styled(AvatarImage)`
    width: 32px;
    height: 32px;
    border: 1px solid #f3f3f3;
    border-radius: 50%;
    background-color: white;

    @media (min-width: ${DESKTOP}px) {
        width: 40px;
        height: 40px;
    }
`

const MenuItemAvatarContainer = styled.div`
    background-color: ${COLORS.secondaryLight};
    padding: 16px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 16px 0;
`

const UserInfoMobile = styled.div`
    background-color: #f8f8f8;
    padding: 8px;
    display: flex;
    justify-content: flex-start;
    border-radius: 4px;

    ${Avatar} {
        width: 45px;
        height: 45px;
        background-color: #fff;
        margin-right: 8px;
    }

    ${Avatarless} {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        ${Name} {
            font-size: 14px;
            font-weight: ${REGULAR};
            line-height: 1.25em;
        }
        ${Username} {
            padding: 3px;
            font-size: 12px;
            font-weight: ${MEDIUM};
            background-color: #fff;
            color: #848484;
            margin: 3px 0;
        }
    }
`

const UnstyledDesktopNav: FunctionComponent = (props) => {
    const { pathname } = useLocation()

    const account = useWalletAccount()

    const ensName = useEns(account)

    return (
        <div {...props} data-testid={'desktop-nav'}>
            <Navbar>
                <NavbarItem>
                    <LogoLink href={routes.root()}>
                        <Logo data-testid={'logo'} />
                    </LogoLink>
                </NavbarItem>
                <MenuGrid data-desktop-only>
                    <NavbarItem>
                        <NavbarLinkDesktop
                            highlight={pathname.startsWith(routes.projects.index())}
                        >
                            <NavLink as={Link} to={routes.projects.index()}>
                                Projects
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                    <NavbarItem>
                        <NavbarLinkDesktop
                            highlight={pathname.startsWith(routes.streams.index())}
                        >
                            <NavLink as={Link} to={routes.streams.index()}>
                                Streams
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                    <NavbarItem>
                        <NavbarLinkDesktop highlight={false}>
                            <NavLink
                                as={Link}
                                href={routes.networkExplorer()}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Network
                            </NavLink>
                        </NavbarLinkDesktop>
                    </NavbarItem>
                </MenuGrid>
                {!account && (
                    <Fragment>
                        <NavbarItemAccount>
                            <Button
                                kind="primary"
                                size="mini"
                                outline
                                type="button"
                                onClick={async () => {
                                    try {
                                        await toaster(ConnectModal, Layer.Modal).pop()
                                    } catch (e) {
                                        console.warn('Wallet connecting failed', e)
                                    }
                                }}
                            >
                                Connect
                            </Button>
                        </NavbarItemAccount>
                    </Fragment>
                )}
                {!!account && (
                    <Fragment>
                        <NavbarItemAccount>
                            <SignedInUserMenu
                                edge
                                alignMenu="right"
                                nodeco
                                toggle={<Avatar username={account} />}
                                menu={
                                    <Menu>
                                        <MenuItem className={'user-info'}>
                                            <MenuItemAvatarContainer>
                                                <Avatar username={account} />
                                                <WalletAddress>
                                                    {!!ensName && (
                                                        <span className={'ens-name'}>
                                                            {truncate(ensName)}
                                                        </span>
                                                    )}
                                                    <span>{truncate(account)}</span>
                                                </WalletAddress>
                                            </MenuItemAvatarContainer>
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem
                                            className="disconnect"
                                            onClick={() => {
                                                toast({
                                                    title: 'Use the "Lock" button in your wallet.',
                                                })
                                            }}
                                        >
                                            <div className={'disconnect-text'}>
                                                <span>Disconnect</span>
                                                <SvgIcon name={'disconnect'} />
                                            </div>
                                        </MenuItem>
                                    </Menu>
                                }
                            />
                        </NavbarItemAccount>
                    </Fragment>
                )}
                <HamburgerButton idle />
            </Navbar>
        </div>
    )
}

const UnstyledMobileNav: FunctionComponent<{ className?: string }> = ({ className }) => {
    const account = useWalletAccount()

    const { pathname } = useLocation()

    return (
        <NavOverlay className={className}>
            <NavOverlay.Head>
                <Navbar>
                    <NavbarItem>
                        <LogoLink href={routes.root()}>
                            <Logo />
                        </LogoLink>
                    </NavbarItem>
                    <NavbarItem>
                        <HamburgerButton />
                    </NavbarItem>
                </Navbar>
            </NavOverlay.Head>
            <NavOverlay.Body>
                {!!account && (
                    <UserInfoMobile>
                        <Avatar username={account} />
                        <Avatarless data-testid={'avatarless'} source={account} />
                    </UserInfoMobile>
                )}
                <NavbarLinkMobile
                    highlight={pathname.startsWith(routes.projects.index())}
                >
                    <NavLink as={Link} to={routes.projects.index()}>
                        Projects
                    </NavLink>
                </NavbarLinkMobile>
                <NavbarLinkMobile highlight={pathname.startsWith(routes.streams.index())}>
                    <NavLink as={Link} to={routes.streams.index()}>
                        Streams
                    </NavLink>
                </NavbarLinkMobile>
                <NavbarLinkMobile highlight={false}>
                    <NavLink
                        as={Link}
                        href={routes.networkExplorer()}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Network
                    </NavLink>
                </NavbarLinkMobile>
            </NavOverlay.Body>
            <NavOverlay.Footer>
                {!!account ? (
                    <Button
                        kind="secondary"
                        size="normal"
                        type="button"
                        onClick={() => {
                            toast({
                                title: 'Use the "Lock" button in your wallet.',
                            })
                        }}
                    >
                        Disconnect
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={async () => {
                            try {
                                await toaster(ConnectModal, Layer.Modal).pop()
                            } catch (e) {
                                console.warn('Wallet connecting failed', e)
                            }
                        }}
                        kind="primary"
                        size="normal"
                    >
                        Connect Wallet
                    </Button>
                )}
            </NavOverlay.Footer>
        </NavOverlay>
    )
}

const DesktopNav = styled(UnstyledDesktopNav)`
    position: relative;

    ${Navbar} {
        > ${NavbarItem}:first-child {
            flex-grow: initial;
        }

        > ${NavbarItem}:nth-child(2) {
            flex-grow: 1;
        }
    }

    @media (min-width: ${DESKTOP}px) {
        ${Navbar} > ${NavbarItem}:first-child {
            flex-grow: 1;
        }
    }

    &[data-shadow='true'] {
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.02);
    }

    ${Avatarless} {
        line-height: 20px;
        padding: 4px 0 8px;
    }

    ${Name} {
        font-size: 14px;
        margin-bottom: 4px;
    }

    ${Username} {
        font-size: 12px;
    }
`

const MobileNav = styled(UnstyledMobileNav)`
    ${NavLink}:not([href]) {
        color: #cdcdcd;
    }

    ${HamburgerButton} {
        margin-left: auto;
    }

    ${NavOverlay.Body} {
        padding: 36px 24px 0 24px;

        ${UserInfoMobile} {
            margin-bottom: 24px;
        }

        ${NavbarLinkMobile} {
            border-top: 1px solid #efefef;

            + ${NavbarLinkMobile} {
                border-top: none;
            }
        }

        > :first-child {
            border-top: none;
        }
    }

    ${NavOverlay.Footer} {
        background-color: #ffffff;
        padding: 24px;

        ${Button} {
            width: 100%;
        }
    }

    @media (min-width: ${MOBILE_LG}px) {
        ${NavOverlay.Body} {
            padding: 36px 64px 0 64px;

            ${UserInfoMobile} {
                margin-bottom: 64px;
            }
        }

        ${NavOverlay.Footer} {
            padding: 64px;

            ${Button} {
                width: auto;
            }
        }
    }
`

const UnstyledContainer: FunctionComponent = (props) => <div {...props} />

export const NavContainer = styled(UnstyledContainer)`
    background-color: #ffffff;
    color: #323232;

    ${HamburgerButton} {
        background-color: #f8f8f8;
    }

    ${Navbar} {
        padding: 20px 24px;

        @media (min-width: ${TABLET}px) {
            padding: 20px 24px;
        }

        @media (min-width: ${DESKTOP}px) {
            padding: 20px 40px;
        }

        > ${HamburgerButton} {
            display: flex;
        }

        ${NavbarItem}:empty {
            display: none;
        }

        > [data-desktop-only='true'] {
            display: none;
        }
    }

    ${Button} {
        padding: 0 16px;
    }

    > [data-mobile-only='true'] {
        display: block;
    }

    @media (min-width: ${TABLET}px) {
        ${Navbar} > [data-desktop-only='true'] {
            display: grid;
        }

        ${Navbar} > ${HamburgerButton} {
            display: none;
        }

        > [data-mobile-only='true'] {
            display: none;
        }
    }
`

const N: FunctionComponent<{ children?: any; shadow?: any }> = ({
    children,
    shadow,
    ...props
}) => (
    <NavContainer {...props}>
        <DesktopNav data-shadow={!!shadow} />
        <MobileNav />
    </NavContainer>
)

Object.assign(N, {
    Container: NavContainer,
})

export default N
