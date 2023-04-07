import React, { useEffect } from 'react'
import { useClient } from 'streamr-client-react'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import { useCurrentDraft, useDraftId, useStreamEditorStore } from '$shared/stores/streamEditor'
import useModal from '$shared/hooks/useModal'
import address0 from '$utils/address0'
import PermissionItem from './PermissionItem'
import AddAccountDialog from './AddAccountDialog'

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

type Props = {
    disabled?: boolean,
}

const PermissionList: React.FunctionComponent<Props> = ({ disabled }) => {
    const { api: addModal } = useModal('accesscontrol.addaccount')

    const permissions = useCurrentDraft().permissions

    const permissionList = Object.entries(permissions)

    const count = permissionList.length - (permissions[address0] ? 1 : 0)

    return (
        <Container>
            {permissionList.map(([key, { bits = null } = {}]) => key !== address0 && (
                <PermissionItem
                    key={key}
                    address={key}
                    permissionBits={bits || 0}
                    disabled={disabled}
                />
            ))}
            <Footer>
                <span>
                    {count} Ethereum account{count === 1 ? '' : 's'}
                </span>
                <Button
                    kind="primary"
                    type="button"
                    disabled={disabled}
                    outline
                    onClick={() => addModal.open()}
                >
                    Add a new account
                </Button>
            </Footer>
            <AddAccountDialog />
        </Container>
    )
}

export default PermissionList
