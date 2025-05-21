import React, { useState } from 'react'
import styled from 'styled-components'
import { Bits, matchBits, setBits, unsetBits } from '~/parsers/StreamParser'
import SvgIcon from '~/shared/components/SvgIcon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS } from '~/shared/utils/styled'
import { truncate } from '~/shared/utils/text'
import { StreamDraft } from '~/stores/streamDraft'
import UnstyledPermissionEditor from './PermissionEditor'

type Props = {
    disabled?: boolean
    publicKey: string
    permissionBits: number
}

export function PermissionItem(props: Props) {
    const { disabled = false, publicKey, permissionBits } = props

    const [isOpen, setIsOpen] = useState(false)

    const account = useWalletAccount()

    const operations = Object.keys(Bits).filter((permission) =>
        matchBits(Bits[permission], permissionBits),
    )

    const update = StreamDraft.useUpdateEntity()

    return (
        <Container>
            <Title
                $isOpen={isOpen}
                onClick={() => {
                    setIsOpen((prev) => !prev)
                }}
            >
                {isOpen ? truncate(publicKey, 50, 20, 20) : truncate(publicKey)}
                {isOpen ? (
                    <div />
                ) : (
                    <Labels>
                        {account?.toLowerCase() === publicKey.toLowerCase() && (
                            <YouLabel>You</YouLabel>
                        )}
                        {operations.map((op) => (
                            <Label key={op}>
                                {op.replace(/^\w/, (s) => s.toUpperCase())}
                            </Label>
                        ))}
                    </Labels>
                )}
                <DropdownCaret name="caretDown" $isOpen={isOpen} />
            </Title>
            {isOpen && (
                <PermissionEditor
                    publicKey={publicKey}
                    permissionBits={permissionBits}
                    disabled={disabled}
                    onChange={(permission, enabled) => {
                        update((hot, cold) => {
                            if (cold.permissions[publicKey] == null) {
                                cold.permissions[publicKey] = 0
                            }

                            hot.permissions[publicKey] = (enabled ? setBits : unsetBits)(
                                permissionBits,
                                Bits[permission],
                            )
                        })
                    }}
                />
            )}
        </Container>
    )
}

const Container = styled.div`
    background: #ffffff;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 1fr auto auto;
    align-items: center;
    transition: all 180ms ease-in-out;
`

const Title = styled.div<{ $isOpen: boolean }>`
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 8px;
    align-items: center;
    border-bottom: ${({ $isOpen }) => ($isOpen ? '1px' : '0px')} solid ${COLORS.Border};
    height: 72px;
    padding: 21px;

    &:hover {
        cursor: pointer;
    }
`

const Labels = styled.div`
    display: flex;
    overflow: hidden;
`

const Label = styled.div`
    color: ${COLORS.primary};
    background-color: ${COLORS.secondary};
    border-radius: 4px;
    font-size: 12px;
    line-height: 16px;
    padding: 4px 8px;
    margin-right: 8px;
`

const YouLabel = styled(Label)`
    color: white;
    background-color: ${COLORS.primaryLight};
`

const PermissionEditor = styled(UnstyledPermissionEditor)`
    padding: 21px;
`

const DropdownCaret = styled(SvgIcon)<{ $isOpen: boolean }>`
    display: block;
    color: ${COLORS.primaryLight};
    width: 12px;
    height: 12px;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 180ms ease-in-out;
`
