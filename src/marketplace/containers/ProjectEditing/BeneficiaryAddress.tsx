import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '~/shared/utils/styled'
import WithInputActions from '~/components/WithInputActions'
import PopoverItem from '~/shared/components/Popover/PopoverItem'
import Text from '~/shared/components/Ui/Text'
import useCopy from '~/shared/hooks/useCopy'
import { truncate } from '~/shared/utils/text'
import { isEthereumAddress } from '~/marketplace/utils/validate'
import useValidation from '~/marketplace/containers/ProductController/useValidation'
import { SeverityLevel } from '~/marketplace/containers/ProductController/ValidationContextProvider'
import { Address } from '~/shared/types/web3-types'
import { useWalletAccount } from '~/shared/stores/wallet'

const Heading = styled.p`
    font-size: 20px;
    color: black;
    margin-top: 30px;
`

const DescriptionText = styled.p`
    color: black;
    margin-bottom: 15px;
    margin-right: 55px;
    flex-shrink: 0;
`

const Container = styled.div`
    background-color: ${COLORS.inputBackground};
    padding: 12px 24px;
    max-width: ${MAX_CONTENT_WIDTH};

    .beneficiary-address-input {
        margin: 0;
        input:disabled {
            background-color: white;
            opacity: 1;
        }
    }
`

type AddressItemProps = {
    address?: string | null | undefined
    className?: string | null | undefined
    name: string
}

const UnstyledAddressItem = ({ className, name, address }: AddressItemProps) => (
    <div className={className}>
        <div>{`Fill ${name}`}</div>
        {!!address && <div className="address">{truncate(address)}</div>}
    </div>
)

const AddressItem = styled(UnstyledAddressItem)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    & > .address {
        color: #adadad;
        font-size: 10px;
        margin-top: -14px;
    }
`
type BeneficiaryAddressProps = {
    disabled?: boolean
    beneficiaryAddress?: Address
    onChange: (address: Address) => void
    chainName: string
}

export const BeneficiaryAddress: FunctionComponent<BeneficiaryAddressProps> = ({
    disabled,
    beneficiaryAddress,
    onChange,
    chainName,
}) => {
    const { copy } = useCopy()
    const accountAddress = useWalletAccount()
    const { setStatus, clearStatus, isValid } = useValidation(
        `salePoints.${chainName}.beneficiaryAddress`,
    )
    const [defaultValueWasSet, setDefaultValueWasSet] = useState(false)
    const inputRef = useRef<HTMLInputElement>()
    const onCopy = useCallback(() => {
        if (!beneficiaryAddress) {
            return
        }

        copy(beneficiaryAddress, {
            toastMessage: 'Copied',
        })
    }, [copy, beneficiaryAddress])

    useEffect(() => {
        if (!defaultValueWasSet && !beneficiaryAddress && !!accountAddress) {
            onChange(accountAddress)
            setDefaultValueWasSet(true)
        }
    }, [accountAddress, beneficiaryAddress, onChange, defaultValueWasSet])

    const handleUpdate = (value: string): void => {
        onChange(value.toLowerCase())
        const isValid = isEthereumAddress(value)
        if (isValid) {
            clearStatus()
        } else {
            setStatus(SeverityLevel.ERROR, 'Provided wallet address is invalid')
        }
    }

    return (
        <>
            <Heading>Set beneficiary</Heading>
            <DescriptionText>
                This wallet address receives the payments for this product on {chainName}{' '}
                chain.
            </DescriptionText>
            <Container>
                <WithInputActions
                    disabled={disabled}
                    className={'beneficiary-address-input'}
                    actions={[
                        <PopoverItem
                            key="useCurrent"
                            onClick={() => {
                                if (!accountAddress) {
                                    return
                                }

                                handleUpdate(accountAddress)

                                if (inputRef.current) {
                                    inputRef.current.value = accountAddress
                                }
                            }}
                            disabled={!accountAddress}
                        >
                            <AddressItem
                                name="wallet address"
                                address={accountAddress || 'Wallet locked'}
                            />
                        </PopoverItem>,
                        <PopoverItem
                            key="copy"
                            disabled={!beneficiaryAddress}
                            onClick={onCopy}
                        >
                            Copy
                        </PopoverItem>,
                    ]}
                >
                    <Text
                        ref={(input: HTMLInputElement) => (inputRef.current = input)}
                        id="beneficiaryAddress"
                        autoComplete="off"
                        defaultValue={beneficiaryAddress || ''}
                        onCommit={(value) => {
                            handleUpdate(value)
                        }}
                        placeholder={'i.e. 0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1'}
                        disabled={disabled}
                        invalid={!isValid}
                        selectAllOnFocus
                    />
                </WithInputActions>
            </Container>
        </>
    )
}
