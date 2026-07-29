import React, { FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { Menu as UnstyledMenu, NavDropdown } from '@streamr/streamr-layout'
import SvgIcon from '~/shared/components/SvgIcon'
import AvatarImage from '~/shared/components/AvatarImage'
import { COLORS, DESKTOP, MEDIUM, REGULAR } from '~/shared/utils/styled'
import { Avatarless, Name, Username } from './User'

export const MOBILE_LG = 576
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
export const Menu = styled(UnstyledMenu)``

export const TextMenuItem = styled(Menu.Item)`
    align-items: center;
    cursor: pointer;
    display: flex;
    padding: 12px 16px !important;

    > span:first-child {
        display: block;
        flex-grow: 1;
    }

    :disabled,
    &[disabled] {
        cursor: default;
        opacity: 0.5;
    }
`

export const UserInfoMenuItem = styled(Menu.Item)`
    padding: 0 16px !important;
`

export const MenuDivider = styled(Menu.Divider)`
    margin: 0;
`

export const WalletAddress = styled.div`
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
export const SignedInUserMenu = styled(NavDropdown)`
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
    gap: 16px;
`
export const MenuGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto 1fr;
    justify-content: center;
    align-items: center;
`
export const NavLink = styled.a``
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
    children: any
}
const UnstyledNavbarLink: FunctionComponent<UnstyledNavbarLinkProps> = ({
    children,
    ...props
}) => {
    return <LinkWrapper {...props}>{children}</LinkWrapper>
}

export const NavbarLinkDesktop = styled(UnstyledNavbarLink)<{ highlight?: boolean }>`
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

    &:hover:after {
        transition: width 0.2s ease-in;
        width: 20px;
    }

    ${({ highlight = false }) =>
        highlight &&
        css`
            &:after {
                width: 20px;
            }

            ${NavLink} {
                color: ${COLORS.primary};
            }
        `}
`

export const NavbarLinkMobile = styled(UnstyledNavbarLink)<{
    highlight?: boolean
    $bottomBorder?: boolean
}>`
    position: relative;

    ${({ $bottomBorder = true }) =>
        $bottomBorder &&
        css`
            border-bottom: 1px solid #efefef;
        `}

    ${NavLink} {
        font-size: 18px;
        line-height: 100px;
        color: ${COLORS.primary};
    }

    ${({ highlight = false }) =>
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
export const NavbarItemAccount = styled.div`
    margin: 0;
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

    @media (${DESKTOP}) {
        width: 40px;
    }
`
export const Avatar = styled(AvatarImage)`
    width: 32px;
    height: 32px;
    border: 1px solid #f3f3f3;
    border-radius: 50%;
    background-color: white;

    @media (${DESKTOP}) {
        width: 40px;
        height: 40px;
    }
`
export const MenuItemAvatarContainer = styled.div`
    background-color: ${COLORS.secondaryLight};
    padding: 16px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 16px 0;
`
export const UserInfoMobile = styled.div`
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
