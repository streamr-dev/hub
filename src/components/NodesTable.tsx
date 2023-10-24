import React, {
    ButtonHTMLAttributes,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import AddNodeAddressModal from '~/modals/AddNodeAddressModal'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { Layer } from '~/utils/Layer'
import Button from '~/shared/components/Button'
import Spinner from '~/shared/components/Spinner'
import { COLORS } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { isRejectionReason } from '~/modals/BaseModal'
import { getNativeTokenBalance } from '~/marketplace/utils/web3'
import { defaultChainConfig } from '~/getters/getChainConfig'
import { fromDecimals } from '~/marketplace/utils/math'
import { errorToast } from '~/utils/toast'
import { setOperatorNodeAddresses } from '~/services/operators'
import { isMessagedObject } from '~/utils'
import { Separator } from './Separator'

export interface OperatorNode {
    address: string
    enabled: boolean
    persisted: boolean
}

export function NodesTable({
    busy = false,
    onChange,
    onSaveClick,
    value = [],
}: {
    busy?: boolean
    onChange?: (value: OperatorNode[]) => void
    onSaveClick?: (addresses: string[]) => void
    value?: OperatorNode[]
}) {
    function toggle(element: OperatorNode) {
        if (element.persisted) {
            return void onChange?.(
                value.map((node) =>
                    node !== element ? node : { ...node, enabled: !node.enabled },
                ),
            )
        }

        onChange?.(value.filter((node) => node !== element))
    }

    const changed = value.some((node) => node.persisted !== node.enabled)

    return (
        <ScrollTable
            elements={value}
            columns={[
                {
                    displayName: 'Address',
                    valueMapper: (element) => (
                        <NodeAddress $new={element.enabled && !element.persisted}>
                            {element.address}
                        </NodeAddress>
                    ),
                    align: 'start',
                    isSticky: true,
                    key: 'id',
                },
                {
                    displayName: 'MATIC balance',
                    valueMapper: (element) => <MaticBalance address={element.address} />,
                    align: 'start',
                    isSticky: false,
                    key: 'balance',
                },
                {
                    displayName: '',
                    valueMapper: (element) => (
                        <>
                            {element.persisted !== element.enabled ? (
                                <PendingIndicator
                                    disabled={busy}
                                    onClick={() => void toggle(element)}
                                >
                                    Pending {element.enabled ? 'addition' : 'deletion'}
                                </PendingIndicator>
                            ) : (
                                <Button
                                    disabled={busy}
                                    kind="secondary"
                                    onClick={() => void toggle(element)}
                                >
                                    Delete
                                </Button>
                            )}
                        </>
                    ),
                    align: 'end',
                    isSticky: false,
                    key: 'actions',
                },
            ]}
            footerComponent={
                <NodeAddressesFooter>
                    <Button
                        kind="secondary"
                        disabled={busy}
                        onClick={async () => {
                            try {
                                await addNodeAddressModal.pop({
                                    async onSubmit(newAddress) {
                                        const address = `0x${newAddress.replace(
                                            /^0x/i,
                                            '',
                                        )}`.toLowerCase()

                                        const exists = value.some(
                                            (node) =>
                                                node.address.toLowerCase() === address,
                                        )

                                        if (!exists) {
                                            return void onChange?.([
                                                ...value,
                                                {
                                                    address,
                                                    persisted: false,
                                                    enabled: true,
                                                },
                                            ])
                                        }

                                        errorToast({
                                            title: 'Node address already declared',
                                        })
                                    },
                                })
                            } catch (e) {
                                if (isRejectionReason(e)) {
                                    return
                                }

                                console.warn('Failed to add a node address', e)
                            }
                        }}
                    >
                        Add node address
                    </Button>
                    <Button
                        kind="primary"
                        onClick={() => {
                            onSaveClick?.(
                                value
                                    .filter((node) => node.enabled)
                                    .map(({ address }) => address),
                            )
                        }}
                        disabled={!changed}
                        waiting={busy}
                    >
                        Save
                    </Button>
                </NodeAddressesFooter>
            }
        />
    )
}

const NodeAddress = styled.div<{ $new?: boolean }>`
    color: ${({ $new = false }) => ($new ? '#a3a3a3' : '#525252')};
`

const addNodeAddressModal = toaster(AddNodeAddressModal, Layer.Modal)

const NodeAddressesFooter = styled.div`
    display: flex;
    justify-content: right;
    padding: 32px;
    gap: 10px;
`

function MaticBalance({ address }: { address: string }) {
    const [balance, setBalance] = useState<string>()

    useEffect(() => {
        let mounted = true

        void (async () => {
            try {
                const newBalance = await getNativeTokenBalance(
                    address,
                    defaultChainConfig.id,
                )

                if (mounted) {
                    setBalance(fromDecimals(newBalance, 18).toFixed(2))
                }
            } catch (e) {
                console.warn(`Failed to get balance for "${address}"`, e)
            }
        })()

        return () => {
            mounted = false
        }
    }, [address])

    return balance || <Spinner color="blue" />
}

function PendingIndicator({
    children,
    ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>) {
    return (
        <PendingIndicatorRoot {...props} type="button">
            <div>{children}</div>
            <Separator />
            <div>
                <SvgIcon name="crossMedium" />
            </div>
        </PendingIndicatorRoot>
    )
}

const PendingIndicatorRoot = styled.button`
    align-items: center;
    appearance: none;
    background: #deebff;
    border-radius: 4px;
    border: 0;
    color: ${COLORS.primary};
    display: grid;
    font-size: 12px;
    font-weight: 500;
    grid-template-columns: auto 1px 24px;
    height: 32px;
    line-height: 20px;
    padding: 0;

    :disabled {
        opacity: 0.5;
    }

    ${Separator} {
        background: #d1dfff;
        height: 100%;
    }

    > div:first-child {
        padding: 0 8px;
    }

    svg {
        color: ${COLORS.close};
        display: block;
        height: 8px;
        margin: 0 auto;
        width: 8px;
    }
`

type SubmitNodeAddressesCallback = (
    operatorId: string,
    addresses: string[],
    options?: { onSuccess?: () => void; onError?: (e: unknown) => void },
) => Promise<void>

export function useSubmitNodeAddressesCallback(): [SubmitNodeAddressesCallback, boolean] {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const abortControllerRef = useRef<AbortController>()

    useEffect(() => {
        const { current: abortController } = abortControllerRef

        return () => {
            abortController?.abort()
        }
    }, [])

    const cb: SubmitNodeAddressesCallback = useCallback(
        async (operatorId, addresses, { onSuccess, onError } = {}) => {
            abortControllerRef.current?.abort()

            const abortController = new AbortController()

            abortControllerRef.current = abortController

            setIsSubmitting(true)

            const { signal } = abortController

            try {
                await setOperatorNodeAddresses(operatorId, addresses)

                if (!signal.aborted) {
                    onSuccess?.()
                }
            } catch (e) {
                if (isMessagedObject(e) && /user\srejected/i.test(e.message)) {
                    /**
                     * User rejected the transaction. Let's move on like
                     * nothing happened.
                     */
                    return
                }

                console.warn('Faild to save the new node addresses', e)

                if (!signal.aborted) {
                    onError?.(e)
                }
            } finally {
                if (!signal.aborted) {
                    setIsSubmitting(false)
                }
            }
        },
        [],
    )

    return [cb, isSubmitting]
}