import React, { ComponentProps, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { NavLink, NavbarLinkDesktop } from '~/components/Nav/Nav.styles'
import { DefaultSimpleDropdownMenu, SimpleDropdown } from '~/components/SimpleDropdown'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'
import { useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

export function Dropdown() {
    const [isOpen, setIsOpen] = useState(false)

    const { pathname } = useLocation()

    const timeoutRef = useRef<number | undefined>()

    function clear() {
        if (timeoutRef.current != null) {
            clearTimeout(timeoutRef.current)
        }
    }

    function show(toggle: (value: boolean) => void) {
        clear()

        toggle(true)
    }

    function hide(toggle: (value: boolean) => void, { immediately = false } = {}) {
        clear()

        if (immediately) {
            return void toggle(false)
        }

        timeoutRef.current = window.setTimeout(() => {
            toggle(false)
        }, 250)
    }

    const chainKey = useCurrentChainKey()

    return (
        <NavbarLinkDesktop highlight={isOpen || isNetworkTabActive(pathname)}>
            <SimpleDropdown
                onToggle={setIsOpen}
                menu={(toggle) => (
                    <Menu
                        onMouseEnter={() => void show(toggle)}
                        onMouseLeave={() => void hide(toggle)}
                    >
                        {NetworkNavItems.map((i) => (
                            <DropdownItem
                                $active={pathname.startsWith(i.linkFn())}
                                key={i.title}
                                to={i.linkFn(routeOptions(chainKey))}
                                onFocus={() => void show(toggle)}
                                onClick={() => void hide(toggle, { immediately: true })}
                            >
                                <strong>{i.title}</strong>
                                <Subtitle>{i.subtitle}</Subtitle>
                            </DropdownItem>
                        ))}
                    </Menu>
                )}
            >
                {(toggle) => (
                    <NavLink
                        as={Link}
                        to={R.networkOverview(routeOptions(chainKey))}
                        onFocus={() => void show(toggle)}
                        onBlur={() => void hide(toggle)}
                        onMouseEnter={() => void show(toggle)}
                        onMouseLeave={() => void hide(toggle)}
                        onClick={(e) => void e.preventDefault()}
                    >
                        Network
                    </NavLink>
                )}
            </SimpleDropdown>
        </NavbarLinkDesktop>
    )
}

const networkLinks = [R.networkOverview(), R.sponsorships(), R.operators()]

export const isNetworkTabActive = (path: string): boolean =>
    networkLinks.some((addr) => path.startsWith(addr))

const Menu = styled(DefaultSimpleDropdownMenu)`
    padding-left: 0;
    padding-right: 0;
`

export const NetworkNavItems: {
    title: string
    subtitle: string
    linkFn: typeof R.networkOverview | typeof R.sponsorships | typeof R.operators
    rel?: string
    target?: string
}[] = [
    {
        title: 'Overview',
        subtitle: 'Your activity on one glance',
        linkFn: R.networkOverview,
    },
    {
        title: 'Sponsorships',
        subtitle: 'Explore, create and join Sponsorships',
        linkFn: R.sponsorships,
    },
    {
        title: 'Operators',
        subtitle: 'Explore Operators and delegate',
        linkFn: R.operators,
    },
]

const Subtitle = styled.div`
    color: ${COLORS.primaryLight};
`

function getTickIconAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'tick',
    }
}

const TickIcon = styled(SvgIcon).attrs(getTickIconAttrs)`
    width: 10px;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 24px;
`

function getDropdownItemAttrs(props: any): ComponentProps<typeof Link> {
    return {
        ...props,
        children: (
            <>
                <div>{props.children}</div>
                {props.$active && <TickIcon />}
            </>
        ),
    }
}

const DropdownItem = styled(Link).attrs(getDropdownItemAttrs)<{ $active?: boolean }>`
    align-items: center;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    line-height: 28px;
    padding: 12px 32px;
    position: relative;

    &,
    :hover,
    :visited,
    :link {
        color: #000000;
    }

    :focus,
    :hover {
        background-color: #e9ecef;
    }

    &[disabled] {
        color: #adadad;
    }

    :focus {
        outline: none;
        box-shadow: inset 0 0 0 1.5px var(--focus-border-color);
    }

    :active {
        background-color: ${COLORS.primary};
        color: #ffffff;
    }

    :active ${Subtitle} {
        color: ${COLORS.radioBorder};
    }
`
