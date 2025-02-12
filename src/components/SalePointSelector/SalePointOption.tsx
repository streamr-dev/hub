import { produce } from 'immer'
import React, { ComponentProps, ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { z } from 'zod'
import { getDataUnion, getDataUnionsOwnedByInChain } from '~/getters/du'
import { SelectField2 } from '~/marketplace/components/SelectField2'
import { Tick as PrestyledTick } from '~/shared/components/Checkbox'
import NetworkIcon from '~/shared/components/NetworkIcon'
import SvgIcon from '~/shared/components/SvgIcon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { SalePoint } from '~/shared/types'
import { COLORS } from '~/shared/utils/styled'
import { getChainDisplayName } from '~/utils/chains'
import { Root as SalePointTokenSelectorRoot } from './SalePointTokenSelector'

export interface OptionProps {
    onSalePointChange?: (value: SalePoint) => void
    salePoint: SalePoint
}

interface SalePointOptionProps extends OptionProps {
    children: ReactNode
    multiSelect?: boolean
}

export default function SalePointOption({
    onSalePointChange,
    salePoint,
    children,
    multiSelect = false,
}: SalePointOptionProps) {
    const { chainId, enabled, readOnly } = salePoint

    return (
        <DropdownWrap $open={enabled}>
            <DropdownToggle
                onClick={() => {
                    onSalePointChange?.({
                        ...salePoint,
                        /**
                         * In multi select mode we don't allow to toggle. It's a click-2-enable,
                         * always. We let the parent component decide what to do with the value.
                         */
                        enabled: multiSelect ? !salePoint.enabled : true,
                    })
                }}
            >
                {multiSelect ? (
                    <Tick $checked={enabled} $disabled={readOnly} />
                ) : (
                    <RadioCircle $checked={enabled} $disabled={readOnly} />
                )}
                <ChainIcon chainId={chainId} />
                <ToggleText>{getChainDisplayName(chainId)}</ToggleText>
                {multiSelect && <PlusSymbol />}
            </DropdownToggle>
            <DropdownOuter>
                <DropdownInner>{children}</DropdownInner>
            </DropdownOuter>
        </DropdownWrap>
    )
}

export const RadioCircle = styled.div<{ $checked?: boolean; $disabled?: boolean }>`
    border-radius: 50%;
    border: 2px solid ${COLORS.radioBorder};
    height: 15px;
    transition: 0.5s border-color;
    width: 15px;

    ::before {
        background: ${COLORS.link};
        border-radius: 50%;
        content: '';
        display: block;
        height: 7px;
        opacity: 0;
        transform: translate(2px, 2px) scale(0.5);
        transition: 0.5s;
        transition-property: transform, opacity;
        width: 7px;
    }

    ${({ $disabled = false }) =>
        $disabled &&
        css`
            opacity: 0.5;
        `}

    ${({ $checked }) =>
        $checked &&
        css`
            border-color: ${COLORS.link};
            transition-duration: 0.1s;

            ::before {
                opacity: 1;
                transform: translate(2px, 2px) scale(1);
                transition-duration: 0.1s;
            }
        `}
`

const DropdownToggle = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
    padding: 24px;

    :hover {
        background-color: ${COLORS.secondary};
    }

    > ${RadioCircle} {
        margin-right: 20px;
    }
`

const DropdownInner = styled.div`
    padding: 8px 24px 64px;
    transition: margin-bottom 0.5s ease-in-out;
    margin-bottom: -350%;

    h4 {
        font-weight: 400;
        font-size: 20px;
        margin: 0;
    }

    h4 + p {
        font-size: 16px;
        margin: 16px 0 28px;
        line-height: 1.5em;
    }

    ${SalePointTokenSelectorRoot} {
        margin-bottom: 48px;
    }
`

const ToggleText = styled.div`
    flex-grow: 1;
`

function getPlusSymbolAttrs(): ComponentProps<typeof SvgIcon> {
    return {
        name: 'plus',
    }
}

const PlusSymbol = styled(SvgIcon).attrs(getPlusSymbolAttrs)`
    margin-left: auto;
    transition: transform 0.3s ease-in-out;
    width: 14px;
`

const DropdownWrap = styled.div<{ $open?: boolean }>`
    overflow: hidden;
    box-shadow: 0 1px 2px 0 #00000026, 0 0 1px 0 #00000040;
    border-radius: 4px;
    color: ${COLORS.primary};

    & + & {
        margin-top: 24px;
    }

    ${({ $open = false }) =>
        $open &&
        css`
            ${DropdownInner} {
                margin-bottom: 0;
            }

            ${DropdownToggle}:hover {
                background-color: inherit;
            }

            ${PlusSymbol} {
                transform: rotate(45deg);
            }
        `}
`

const DropdownOuter = styled.div`
    overflow: hidden;
`

const Tick = styled(PrestyledTick)<{ $disabled?: boolean }>`
    margin: 0 20px 0 0;

    ${({ $disabled = false }) =>
        $disabled &&
        css`
            opacity: 0.3;
        `}
`

const ChainIcon = styled(NetworkIcon)`
    width: 32px;
    height: 32px;
    margin-right: 12px;
`

const NamedMetadata = z.object({
    name: z.string(),
})

type NamedMetadata = z.infer<typeof NamedMetadata>

function isNamedMetadata(metadata: unknown): metadata is NamedMetadata {
    return NamedMetadata.safeParse(metadata).success
}

export function DataUnionOption({ salePoint, onSalePointChange }: OptionProps) {
    const [dataUnionId, setDataUnionId] = useState<string>('')

    const { chainId } = salePoint

    const [deployNew, setDeployNew] = useState(true)

    const [dataUnions, setDataUnions] = useState<{ label: string; value: string }[]>()

    const isLoadingDataUnions = typeof dataUnions === 'undefined'

    const canUseExisting = !!dataUnions?.length

    const account = useWalletAccount()

    function updateSalePoint(updater: (draft: SalePoint) => void) {
        onSalePointChange?.(produce(salePoint, updater))
    }

    const updateSalePointRef = useRef(updateSalePoint)

    updateSalePointRef.current = updateSalePoint

    useEffect(() => {
        let mounted = true

        if (!account) {
            return () => {}
        }

        /**
         * Tell the app we're loading the Unions. See `isLoadingDataUnions`.
         */
        setDataUnions(undefined)

        /**
         * Reset the new/existing selection because it's impossible to select
         * exisitng id from `undefined` set above.
         */
        setDeployNew(true)

        updateSalePointRef.current((draft) => {
            draft.beneficiaryAddress = ''
        })

        setTimeout(async () => {
            const result: NonNullable<typeof dataUnions> = []

            try {
                const foundDataUnions = await getDataUnionsOwnedByInChain(
                    account,
                    chainId,
                )

                if (!mounted) {
                    return
                }

                for (const { id } of foundDataUnions) {
                    try {
                        const dataUnion = await getDataUnion(id, chainId)

                        if (!mounted) {
                            // There's no need to carry on. The result is gonna get discarded.
                            break
                        }

                        const metadata = await dataUnion.getMetadata()

                        if (!mounted) {
                            // Again, there's no need to carry on. See above.
                            break
                        }

                        result.push({
                            value: id,
                            label: isNamedMetadata(metadata) ? metadata.name : id,
                        })
                    } catch (e) {
                        console.warn(`Failed to load a Data Union: ${id}`, e)
                    }
                }
            } catch (e) {
                console.warn('Failed to load Data Unions', e)
            } finally {
                if (mounted) {
                    setDataUnions(result)
                }
            }
        })

        return () => {
            mounted = false
        }
    }, [chainId, account])

    return (
        <>
            <h4>Deployment</h4>
            <p>
                You can deploy a new Data Union smart contract, or connect an existing
                one.
            </p>
            <DeployList>
                <li>
                    <button
                        type="button"
                        onClick={() => {
                            setDeployNew(true)

                            updateSalePoint((draft) => {
                                draft.beneficiaryAddress = ''
                            })
                        }}
                    >
                        <RadioCircle $checked={deployNew} />
                        <p>Deploy a new Data Union</p>
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        disabled={!canUseExisting}
                        onClick={() => {
                            if (!canUseExisting) {
                                return
                            }

                            setDeployNew(false)

                            updateSalePoint((draft) => {
                                draft.beneficiaryAddress = dataUnionId
                            })
                        }}
                    >
                        <RadioCircle $checked={!deployNew} $disabled={!canUseExisting} />
                        <p>Connect an existing Data Union</p>
                    </button>
                    <SelectWrap>
                        <SelectField2
                            placeholder={
                                isLoadingDataUnions
                                    ? 'Loading…'
                                    : canUseExisting
                                    ? 'Select a Data Union'
                                    : "You don't have any deployed Data Unions"
                            }
                            options={dataUnions || []}
                            disabled={deployNew}
                            fullWidth={true}
                            value={dataUnionId || undefined}
                            isClearable={false}
                            onChange={(newDataUnionId) => {
                                setDataUnionId(newDataUnionId)

                                updateSalePoint((draft) => {
                                    draft.beneficiaryAddress = newDataUnionId
                                })
                            }}
                        />
                    </SelectWrap>
                </li>
            </DeployList>
        </>
    )
}

const DeployList = styled.ul`
    background-color: ${COLORS.inputBackground};
    border-radius: 4px;
    list-style: none;
    margin: 0;
    padding: 24px;

    li {
        background: #ffffff;
        border-radius: 4px;
    }

    li > button {
        align-items: center;
        appearance: none;
        background: none;
        border: 0;
        display: flex;
        padding: 24px;
        text-align: left;
        width: 100%;
    }

    li + li {
        margin-top: 16px;
    }

    p {
        flex-grow: 1;
        font-size: 14px;
        margin: 0;
    }

    ${RadioCircle} {
        margin-right: 12px;
    }
`

const SelectWrap = styled.div`
    padding: 0 24px 24px;
`
