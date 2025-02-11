import React, { ComponentProps, useReducer } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, MEDIUM, REGULAR } from '~/shared/utils/styled'
import { useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { NavLink, NavbarLinkMobile } from './Nav.styles'
import { NetworkNavItems, isNetworkTabActive } from './NetworkDropdown'

export function NetworkAccordion() {
    const { pathname } = useLocation()

    const [isOpen, toggle] = useReducer((x) => !x, false)

    const chainName = useCurrentChainKey()

    return (
        <>
            <NavbarLinkMobile
                highlight={isNetworkTabActive(pathname)}
                $bottomBorder={!isOpen}
            >
                <NavLink
                    as={Link}
                    to={R.networkOverview(routeOptions(chainName))}
                    onClick={(e) => {
                        e.preventDefault()

                        e.stopPropagation()

                        toggle()
                    }}
                >
                    <Wings>
                        <div>Network</div>
                        <div>
                            <CaretDownIcon $flipped={isOpen} />
                        </div>
                    </Wings>
                </NavLink>
            </NavbarLinkMobile>
            {isOpen && (
                <Menu>
                    {NetworkNavItems.map((networkNavElement) => {
                        const { title, subtitle, linkFn, ...rest } = networkNavElement
                        return (
                            <NetworkMobileLink
                                {...rest}
                                to={linkFn(routeOptions(chainName))}
                                key={title}
                            >
                                <NetworkNavElement>
                                    <Title>{title}</Title>
                                    <Subtitle>{subtitle}</Subtitle>
                                </NetworkNavElement>
                            </NetworkMobileLink>
                        )
                    })}
                </Menu>
            )}
        </>
    )
}

const NetworkNavElement = styled.div`
    display: flex;
    flex-direction: column;
    text-transform: none;
    line-height: 24px;
`

const Title = styled.p`
    font-size: 16px;
    font-weight: ${MEDIUM};
    color: ${COLORS.black};
    margin: 0;
    letter-spacing: initial;
`

const Subtitle = styled.p`
    font-size: 16px;
    font-weight: ${REGULAR};
    color: ${COLORS.primaryLight};
    margin: 0;
    max-width: 350px;
    white-space: pre-line;
    letter-spacing: initial;
`

const NetworkMobileLink = styled(Link)`
    padding: 20px 0;
    display: block;
`

const Menu = styled.div`
    margin-top: -20px;
`

function getCaretDownIconAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'caretDown',
    }
}

const CaretDownIcon = styled(SvgIcon).attrs(getCaretDownIconAttrs)<{
    $flipped?: boolean
}>`
    transform: rotate(0deg) translateY(-2%);
    transition: 300ms transform;
    width: 18px;

    ${({ $flipped = false }) =>
        $flipped &&
        css`
            transform: rotate(-180deg) translateY(-2%);
        `}
`

const Wings = styled.div`
    display: flex;
    align-items: center;

    > div:first-child {
        flex-grow: 1;
    }
`
