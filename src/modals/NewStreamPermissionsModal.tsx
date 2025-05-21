import React, { useState } from 'react'
import styled from 'styled-components'
import PermissionEditor from '~/pages/AbstractStreamEditPage/AccessControlSection/PermissionEditor'
import { Bits, matchBits, setBits, unsetBits } from '~/parsers/StreamParser'
import UnstyledErrors, { MarketplaceTheme } from '~/shared/components/Ui/Errors'
import UnstyledLabel from '~/shared/components/Ui/Label'
import Text from '~/shared/components/Ui/Text'
import { COLORS, TABLET } from '~/shared/utils/styled'
import { RejectionReason, isMessagedObject } from '~/utils/exceptions'
import FormModal, { FormModalProps } from './FormModal'
import { StreamPermission } from '@streamr/sdk'

const Separator = styled.div`
    border-bottom: 1px solid ${COLORS.Border};
    margin: 24px 0;

    @media ${TABLET} {
        border: 0;
        margin: 40px 0 0;
    }
`

const Label = styled(UnstyledLabel)`
    display: flex;
`

const Errors = styled(UnstyledErrors)`
    display: flex;
`

interface PermissionBits {
    publicKey: string
    bits: number
}

interface NewStreamPermissionsModalProps extends FormModalProps {
    onResolve?: (payload: PermissionBits) => void
    onBeforeSubmit?: (payload: PermissionBits) => void
}

const ethereumAddressRegex = /^0x[0-9a-fA-F]{40}$/
const hexStringRegex = /^0x([0-9a-fA-F]{2})+$/
const zeroAddressRegex = /^(0x)?0+$/

export default function NewStreamPermissionsModal({
    onReject,
    onResolve,
    onBeforeSubmit,
    ...props
}: NewStreamPermissionsModalProps) {
    const [permissionBits, setPermissionBits] = useState(0)

    const [publicKey, setPublicKey] = useState('')

    const [error, setError] = useState('')

    const cancelLabel = publicKey || permissionBits !== 0 ? 'Cancel' : undefined

    return (
        <FormModal
            {...props}
            title="Authorize Public Key"
            onReject={onReject}
            onBeforeAbort={(reason) => {
                return (
                    (permissionBits === 0 && publicKey === '') ||
                    reason !== RejectionReason.Backdrop
                )
            }}
            onSubmit={() => {
                const normalizedPublicKey = `${publicKey.startsWith('0x') ? '' : '0x'}${publicKey.toLowerCase()}`

                if (zeroAddressRegex.test(normalizedPublicKey)) {
                    return void setError('Invalid key - cannot assign to zero key')
                }

                if (!hexStringRegex.test(normalizedPublicKey)) {
                    return void setError('Invalid key - must be a hex string')
                }

                if (permissionBits === 0) {
                    return void setError('Please select some of the permissions')
                }

                if (!ethereumAddressRegex.test(normalizedPublicKey) && (
                    matchBits(Bits[StreamPermission.GRANT], permissionBits) ||
                    matchBits(Bits[StreamPermission.DELETE], permissionBits) ||
                    matchBits(Bits[StreamPermission.EDIT], permissionBits)
                )) {
                    return void setError('Only Ethereum addresses can have Grant, Edit, or Delete permission')
                }

                const result = {
                    publicKey: normalizedPublicKey,
                    bits: permissionBits,
                }

                try {
                    onBeforeSubmit?.(result)
                } catch (e: unknown) {
                    if (isMessagedObject(e)) {
                        return void setError(e.message)
                    }

                    return void setError('Something bad happened')
                }

                onResolve?.(result)
            }}
            canSubmit={!!publicKey}
            submitLabel="Authorize Public Key"
            cancelLabel={cancelLabel}
        >
            <div>
                <Label>Public Key</Label>
                <Text
                    onCommit={(value) => {
                        setPublicKey(value)
                        setError('')
                    }}
                    placeholder="Public key or Ethereum address"
                />
                {!!error && (
                    <Errors theme={MarketplaceTheme} overlap>
                        {error}
                    </Errors>
                )}
            </div>
            <Separator />
            <PermissionEditor
                publicKey={publicKey}
                permissionBits={permissionBits}
                onChange={(permission, enabled) => {
                    setPermissionBits(
                        (enabled ? setBits : unsetBits)(permissionBits, Bits[permission]),
                    )
                }}
            />
        </FormModal>
    )
}
