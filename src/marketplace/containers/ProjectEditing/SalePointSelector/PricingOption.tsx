import React, {
    ChangeEvent,
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from 'react'
import styled from 'styled-components'
import { COLORS } from '~/shared/utils/styled'
import Checkbox from '~/shared/components/Checkbox'
import SvgIcon from '~/shared/components/SvgIcon'
import NetworkIcon from '~/shared/components/NetworkIcon'
import { PricingData, SalePoint } from '~/marketplace/types/project-types'
import TokenSelector from '~/marketplace/containers/ProjectEditing/TokenSelector'
import { BeneficiaryAddress } from '~/marketplace/containers/ProjectEditing/BeneficiaryAddress'
import { Address, Chain } from '~/shared/types/web3-types'
import { formatChainName } from '~/shared/utils/chains'

export const PricingOption: FunctionComponent<{
    onToggle?: (chainName: string, salePoint: SalePoint) => void
    chain: Chain
    pricingData?: PricingData
    onChange: (chainName: string, pricingData: SalePoint | null) => void
    editingSelectionAndTokenDisabled?: boolean
}> = ({
    onToggle,
    chain,
    pricingData,
    onChange,
    editingSelectionAndTokenDisabled = false,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const [isSelected, setIsSelected] = useState<boolean>(!!pricingData)
    const [pricing, setPricing] = useState<PricingData>(
        pricingData || ({} as PricingData),
    )
    const [beneficiaryAddress, setBeneficiaryAddress] = useState<Address>(
        pricingData?.beneficiaryAddress,
    )

    const handleToggleClick = useCallback(() => {
        setIsDropdownOpen((isOpen) => !isOpen)
        // this might seem a bit silly, but it's needed for the use case when we are toggling the first Option
        // while having none selected, then it will be marked as selected
        if (onToggle) {
            onToggle(chain.name, {
                chainId: chain.id,
                pricePerSecond: pricing?.pricePerSecond,
                timeUnit: pricing.timeUnit,
                price: pricing?.price,
                pricingTokenAddress: pricing.tokenAddress,
                beneficiaryAddress: beneficiaryAddress,
            })
        }
    }, [
        onToggle,
        chain,
        pricing.pricePerSecond,
        pricing.timeUnit,
        pricing.price,
        pricing.tokenAddress,
        beneficiaryAddress,
    ])

    const handlePricingChange = useCallback(
        (newPricing: PricingData) => {
            const output = isSelected
                ? {
                      chainId: chain.id,
                      pricePerSecond: newPricing?.pricePerSecond,
                      timeUnit: newPricing.timeUnit,
                      price: newPricing?.price,
                      pricingTokenAddress: newPricing.tokenAddress,
                      beneficiaryAddress: beneficiaryAddress,
                  }
                : null
            setPricing(newPricing)
            onChange(chain.name, output)
        },
        [onChange, isSelected, beneficiaryAddress, chain, setPricing],
    )

    const handleCheckboxToggle = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const selected = event.target.checked
            const output = selected
                ? {
                      chainId: chain.id,
                      pricePerSecond: pricing?.pricePerSecond,
                      timeUnit: pricing.timeUnit,
                      price: pricing?.price,
                      pricingTokenAddress: pricing.tokenAddress,
                      beneficiaryAddress: beneficiaryAddress,
                  }
                : null
            setIsSelected(selected)
            onChange(chain.name, output)
        },
        [onChange, pricing, beneficiaryAddress, chain, setIsSelected],
    )

    useEffect(() => {
        if (!!pricingData) {
            setIsSelected(true)
        }
    }, [pricingData])

    return (
        <DropdownWrap className={isDropdownOpen ? 'is-open' : ''}>
            <DropdownToggle
                onClick={handleToggleClick}
                className={isDropdownOpen ? 'is-open' : ''}
            >
                <label>
                    <StyledCheckbox
                        value={isSelected}
                        disabled={editingSelectionAndTokenDisabled}
                        onClick={(event) => event.stopPropagation()}
                        onChange={handleCheckboxToggle}
                    />
                </label>
                <ChainIcon chainId={chain.id} />
                <span>{formatChainName(chain.name)}</span>
                <PlusSymbol name={'plus'} className={isDropdownOpen ? 'is-open' : ''} />
            </DropdownToggle>
            <DropdownOuter className={isDropdownOpen ? 'is-open' : ''}>
                <DropdownInner className={isDropdownOpen ? 'is-open' : ''}>
                    <TokenSelector
                        disabled={!isSelected}
                        chain={chain}
                        onChange={handlePricingChange}
                        validationFieldName={`salePoints.${chain.name}`}
                        value={
                            pricingData
                                ? {
                                      tokenAddress: pricingData.tokenAddress,
                                      price: pricingData.price,
                                      timeUnit: pricingData.timeUnit,
                                      pricePerSecond: pricingData.pricePerSecond,
                                  }
                                : undefined
                        }
                        tokenChangeDisabled={editingSelectionAndTokenDisabled}
                    />
                    <BeneficiaryAddress
                        beneficiaryAddress={pricingData?.beneficiaryAddress}
                        onChange={setBeneficiaryAddress}
                        chainName={chain.name}
                    />
                </DropdownInner>
            </DropdownOuter>
        </DropdownWrap>
    )
}

const DropdownWrap = styled.div`
    overflow: hidden;
    box-shadow: 0 1px 2px 0 #00000026, 0 0 1px 0 #00000040;
    border-radius: 4px;
    margin-bottom: 24px;
    color: ${COLORS.primary};

    &:last-of-type {
        margin-bottom: 0;
    }
`
const DropdownOuter = styled.div`
    overflow: hidden;
`
const DropdownInner = styled.div`
    padding: 24px 24px 75px;
    transition: margin-bottom 0.5s ease-in-out;
    margin-bottom: -200%;

    &.is-open {
        margin-bottom: 0;
    }
`
const DropdownToggle = styled.div`
    padding: 24px 24px 24px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &:hover {
        background-color: ${COLORS.secondary};
    }
    &.is-open:hover {
        background-color: inherit;
    }

    label {
        display: flex;
        padding: 12px;
        align-items: center;
        justify-content: center;
        margin: 0;
        cursor: pointer;
    }
`

const StyledCheckbox = styled(Checkbox)`
    cursor: pointer;
    &:disabled {
        opacity: 0.3;
    }
`

const PlusSymbol = styled(SvgIcon)`
    width: 14px;
    margin-left: auto;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    &.is-open {
        transform: rotate(45deg);
    }
`

const ChainIcon = styled(NetworkIcon)`
    width: 32px;
    height: 32px;
    margin-right: 12px;
`
