import React from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { Button } from '~/components/Button'
import { address0 } from '~/consts'
import NewStreamPermissionsModal from '~/modals/NewStreamPermissionsModal'
import { isAbandonment } from '~/modals/ProjectModal'
import { StreamDraft } from '~/stores/streamDraft'
import { Layer } from '~/utils/Layer'
import { PermissionItem } from './PermissionItem'

export function PermissionList({ disabled = false }) {
    const { permissions = {} } = StreamDraft.useEntity({ hot: true }) || {}

    const permissionList = Object.entries(permissions)

    const count = permissionList.length - (address0 in permissions ? 1 : 0)

    const update = StreamDraft.useUpdateEntity()

    return (
        <Container>
            {permissionList.map(
                ([key, bits]) =>
                    key !== address0 && (
                        <PermissionItem
                            key={key}
                            publicKey={key}
                            permissionBits={bits || 0}
                            disabled={disabled}
                        />
                    ),
            )}
            <Footer>
                <span>
                    {count} Public Key{count === 1 ? '' : 's'}
                </span>
                <Button
                    kind="primary"
                    type="button"
                    disabled={disabled}
                    outline
                    onClick={async () => {
                        try {
                            const { publicKey, bits } = await toaster(
                                NewStreamPermissionsModal,
                                Layer.Modal,
                            ).pop({
                                onBeforeSubmit(payload) {
                                    if (permissions[payload.publicKey] != null) {
                                        throw new Error(
                                            'Permissions for this public key already exist',
                                        )
                                    }
                                },
                            })

                            update((hot, cold) => {
                                if (cold.permissions[publicKey] == null) {
                                    cold.permissions[publicKey] = 0
                                }

                                hot.permissions[publicKey] = bits
                            })
                        } catch (e) {
                            if (isAbandonment(e)) {
                                return
                            }

                            console.warn('Could not add permissions for a new public key', e)
                        }
                    }}
                >
                    Add Public Key
                </Button>
            </Footer>
        </Container>
    )
}

const Container = styled.div`
    background: #f1f1f1;
    border-radius: 4px;
    display: grid;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1.5em;
    margin-top: 16px;
`

const Footer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 8px;
    align-items: center;
`
