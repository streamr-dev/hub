import { Chain } from '@streamr/config'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { SimpleDropdown, SimpleListDropdownMenu } from '~/components/SimpleDropdown'
import { defaultChainKey } from '~/consts'
import { getEnvironmentConfig } from '~/getters/getEnvironmentConfig'
import UnstyledNetworkIcon from '~/shared/components/NetworkIcon'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS, LAPTOP } from '~/shared/utils/styled'
import { StreamDraft } from '~/stores/streamDraft'
import { getChainSlug, useCurrentChain } from '~/utils/chains'

type MenuItemProps = {
    chain: Chain
    isSelected: boolean
    onClick: () => void
}

const MenuItem = ({ chain, isSelected, onClick }: MenuItemProps) => (
    <MenuItemContainer onClick={onClick}>
        <NetworkIcon chainId={chain.id} />
        <div>{chain.name}</div>
        {isSelected ? <SvgIcon name="tick" /> : <div />}
    </MenuItemContainer>
)

type MenuProps = {
    chains: Chain[]
    selectedChain: Chain
    toggle: (value: boolean) => void
}

const Menu = ({ chains, selectedChain, toggle }: MenuProps) => {
    const [, setSearchParams] = useSearchParams()

    return (
        <MenuContainer>
            <ChainGrid>
                {chains.map((c) => (
                    <MenuItem
                        key={c.id}
                        chain={c}
                        isSelected={c.id === selectedChain.id}
                        onClick={() => {
                            toggle(false)

                            const slug = getChainSlug(c.id)

                            setSearchParams((prev) => {
                                const { chain: _, ...rest } = Object.fromEntries(prev)

                                return slug === getChainSlug(defaultChainKey)
                                    ? rest
                                    : { ...rest, chain: slug }
                            })
                        }}
                    />
                ))}
            </ChainGrid>
        </MenuContainer>
    )
}

interface Props {
    menuAlignment: 'left' | 'right'
}

export const ChainSelector = ({ menuAlignment = 'left', ...props }: Props) => {
    const availableChains = getEnvironmentConfig().availableChains

    const selectedChain = useCurrentChain()

    const isAnyDraftBeingPersisted = StreamDraft.useIsAnyDraftBeingPersisted()

    return (
        <SimpleDropdown
            {...props}
            disabled={isAnyDraftBeingPersisted}
            menu={(toggle) => (
                <Menu
                    chains={availableChains}
                    selectedChain={selectedChain}
                    toggle={toggle}
                />
            )}
            align={menuAlignment}
        >
            {(toggle, isOpen) => (
                <Toggle $isOpen={isOpen} onClick={() => toggle((v) => !v)}>
                    <NetworkIcon chainId={selectedChain.id} />
                    <div>{selectedChain.name}</div>
                    <Caret name="caretUp" $isOpen={isOpen} />
                </Toggle>
            )}
        </SimpleDropdown>
    )
}

const MenuContainer = styled(SimpleListDropdownMenu)`
    color: ${COLORS.primaryLight};
    max-width: 100%;
`

const ChainGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    grid-auto-rows: 52px;
    gap: 0px 8px;
`

const MenuItemContainer = styled.div`
    display: grid;
    grid-template-columns: subgrid;
    grid-column: span 3;
    appearance: none;
    background: none;
    border: 0;
    border-bottom: 1px solid ${COLORS.secondary};

    :last-child {
        border-bottom: none;
    }

    transition: 250ms background-color;
    align-items: center;
    padding: 8px 24px;
    cursor: pointer;

    font-size: 16px;
    line-height: 26px;
    font-weight: 500;
    text-align: left;
    white-space: nowrap;
    color: ${COLORS.primaryLight};

    :focus,
    :hover {
        background: ${COLORS.secondary};
        transition-duration: 50ms;
    }

    &[disabled] {
        background: none;
    }

    svg {
        color: ${COLORS.primaryLight};
        height: 13px;
        width: 13px;
    }
`

const NetworkIcon = styled(UnstyledNetworkIcon)`
    display: flex;
    width: 24px;
    height: 24px;
`

const Toggle = styled.div<{ $isOpen: boolean }>`
    display: grid;
    grid-template-columns: 24px auto auto;
    line-height: 24px;
    align-items: center;
    border: 1px solid #f3f3f3;
    border-radius: 8px;
    background: ${({ $isOpen }) => ($isOpen ? COLORS.dialogBorder : '#fff')};
    cursor: pointer;
    gap: 0px;
    height: 32px;
    padding: 4px 8px;
    align-items: center;
    width: fit-content;
    color: ${COLORS.primary};
    font-size: 14px;
    font-weight: 500;

    img {
        width: 20px;
        height: 20px;
    }

    div:nth-child(2) {
        display: none;
    }

    :focus,
    :hover {
        background: ${COLORS.dialogBorder};
        transition-duration: 50ms;
    }

    @media ${LAPTOP} {
        height: 40px;
        padding: 8px 12px;
        gap: 8px;

        img {
            width: 24px;
            height: 24px;
        }

        div:nth-child(2) {
            display: initial;
        }
    }
`

const Caret = styled(SvgIcon)<{ $isOpen: boolean }>`
    width: 10px !important;
    transition: transform 200ms ease-in-out;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};
`
