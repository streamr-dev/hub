// @flow

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { I18n } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import Toggle from '$shared/components/Toggle'
import Popover from '$shared/components/Popover'
import useModal from '$shared/hooks/useModal'
import useCopy from '$shared/hooks/useCopy'
import StatusIcon from '$shared/components/StatusIcon'
import type { WhitelistItem } from '$mp/modules/contractProduct/types'
import useWhitelist from '$mp/modules/contractProduct/hooks/useWhitelist'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import type { Address } from '$shared/flowtype/web3-types'

import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import useEditableProduct from '$mp/containers/ProductController/useEditableProduct'
import useEditableProductActions from '$mp/containers/ProductController/useEditableProductActions'

const MIN_ROWS = 5

const Container = styled.div`
    background: #fdfdfd;
    border-radius: 4px;
    border: 1px solid #ebebeb;
    font-size: 14px;
`

const Rows = styled.div`
    height: ${(props) => (((props.rowCount + 1) * 56) - 1)}px; /* +1 for header, -1 for bottom border */
    overflow: auto;
`

const TableRow = styled.span`
    display: grid;
    grid-template-columns: 1fr 90px 90px;
    height: 56px;
    opacity: ${(props) => (props.pending ? '0.5' : '1.0')};
    background: #fdfdfd;

    &:not(:last-child) {
        border-bottom: 1px solid #ebebeb;
    }
`

const TableHeaderRow = styled(TableRow)`
    position: sticky;
    top: 0;
`

const TableColumnBase = styled.span`
    display: flex;
    justify-content: ${(props) => (props.center ? 'center' : 'unset')};
    align-items: center;
    padding: 0 24px;
    color: ${(props) => (props.disabled ? 'rgba(82, 82, 82, 0.5)' : 'rgba(82, 82, 82)')};

    &:not(:last-child) {
        border-right: 1px solid #ebebeb;
    }
`

const TableHeaderColumn = styled(TableColumnBase)`
    font-weight: 500;
    letter-spacing: 0px;
`

const TableColumn = styled(TableColumnBase)`
    ${TableRow}:hover & {
        background-color: ${(props) => (props.disabled ? '#fdfdfd' : '#f8f8f8')};
    }
`

const StyledPopover = styled(Popover)`
    visibility: hidden;

    ${TableRow}:hover & {
        visibility: ${(props) => (props.disabled ? 'hidden' : 'visible')};
    }
`

const Controls = styled.div`
    height: 72px;
    padding: 0 16px 0 24px;
    border-top: 1px solid #ebebeb;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 16px;
    align-items: center;
`

const StyledToggle = styled(Toggle)`
    display: flex;
    align-items: center;

    * {
        margin-bottom: 0;
    }
`

const Label = styled.label`
    margin-bottom: 0;
`

type Props = {
    className?: string,
    enabled: boolean,
    items: Array<WhitelistItem>,
    onEnableChanged: (boolean) => void,
    onAdd: () => Promise<void>,
    onRemove: (Address) => Promise<void>,
    onCopy: (string) => void,
    actionsEnabled: boolean,
}

const padWithEmptyRows = (rows: Array<WhitelistItem>) => {
    if (rows.length < MIN_ROWS) {
        const empties = new Array(MIN_ROWS - rows.length).fill(null)
        return empties.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TableRow key={index} disabled>
                <TableColumn disabled />
                <TableColumn disabled center />
                <TableColumn disabled center />
            </TableRow>
        ))
    }

    return null
}

const statusIconTheme = (disabled, status) => {
    if (disabled) {
        return StatusIcon.INACTIVE
    } else if (status === 'added') {
        return StatusIcon.PENDING
    } else if (status === 'removed') {
        return StatusIcon.REMOVED
    }
    return StatusIcon.OK
}

export const WhitelistEditorComponent = ({
    className,
    enabled,
    items,
    onEnableChanged,
    onAdd,
    onRemove,
    onCopy,
    actionsEnabled,
}: Props) => (
    <Container className={className}>
        <Rows rowCount={MIN_ROWS}>
            <TableHeaderRow>
                <TableHeaderColumn>{I18n.t('editProductPage.whitelist.header.address')}</TableHeaderColumn>
                <TableHeaderColumn>{I18n.t('editProductPage.whitelist.header.status')}</TableHeaderColumn>
                <TableHeaderColumn />
            </TableHeaderRow>
            {items.map((item) => {
                const disabled = !enabled || item.isPending

                return (
                    <TableRow key={item.address}>
                        <TableColumn disabled={disabled}>
                            <span>{item.address}</span>
                        </TableColumn>
                        <TableColumn disabled={disabled} center>
                            <StatusIcon
                                status={statusIconTheme(disabled, item.status)}
                                tooltip={!disabled && I18n.t(`editProductPage.whitelist.status.${item.status}`)}
                            />
                        </TableColumn>
                        <TableColumn disabled={disabled} center>
                            <StyledPopover
                                title="Select"
                                type="meatball"
                                noCaret
                            >
                                <Popover.Item onClick={() => onCopy(item.address)}>
                                    {I18n.t('editProductPage.whitelist.copy')}
                                </Popover.Item>
                                {item.status !== 'removed' && actionsEnabled && !item.isPending && (
                                    <Popover.Item onClick={() => onRemove(item.address)}>
                                        {I18n.t('editProductPage.whitelist.remove')}
                                    </Popover.Item>
                                )}
                            </StyledPopover>
                        </TableColumn>
                    </TableRow>
                )
            })}
            {padWithEmptyRows(items)}
        </Rows>
        <Controls>
            <Label htmlFor="whitelist">{I18n.t('editProductPage.whitelist.enable')}</Label>
            <StyledToggle
                id="whitelist"
                value={enabled}
                onChange={onEnableChanged}
            />
            <Button
                kind="secondary"
                size="normal"
                disabled={!enabled || !actionsEnabled}
                onClick={() => onAdd()}
            >
                {I18n.t('editProductPage.whitelistEdit.add')}
            </Button>
        </Controls>
    </Container>
)

export const WhitelistEditor = () => {
    const product = useEditableProduct()
    const contractProduct = useContractProduct()
    const { items } = useWhitelist()
    const { updateRequiresWhitelist } = useEditableProductActions()
    const isEnabled = !!product.requiresWhitelist
    const actionsEnabled = !!contractProduct && isEnabled

    const { api: whitelistEditDialog } = useModal('whitelistEdit')
    const { copy } = useCopy()

    const onCopy = useCallback((address: string) => {
        copy(address)

        Notification.push({
            title: I18n.t('general.copied'),
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    const productId = product.id

    const onAdd = useCallback(async () => {
        const { didEnableWhitelist } = await whitelistEditDialog.open({
            productId,
        })

        // reset white list enabled marker in nav if it was updated to contract
        if (didEnableWhitelist) {
            updateRequiresWhitelist(true, false)
        }
    }, [productId, whitelistEditDialog, updateRequiresWhitelist])

    const onRemove = useCallback(async (removedAddress: Address) => {
        const { didEnableWhitelist } = await whitelistEditDialog.open({
            productId,
            removedAddress,
        })

        // reset white list enabled marker in nav if it was updated to contract
        if (didEnableWhitelist) {
            updateRequiresWhitelist(true, false)
        }
    }, [productId, whitelistEditDialog, updateRequiresWhitelist])

    // TODO: Email address must be provided when we enable whitelist!
    // Add this validation when we have contact email for products.

    return (
        <WhitelistEditorComponent
            items={items}
            enabled={isEnabled}
            onEnableChanged={(value) => updateRequiresWhitelist(value)}
            onAdd={onAdd}
            onRemove={onRemove}
            onCopy={onCopy}
            actionsEnabled={actionsEnabled}
        />
    )
}

export default WhitelistEditor
