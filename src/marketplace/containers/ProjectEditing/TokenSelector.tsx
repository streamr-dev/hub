import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import styled from 'styled-components'
import capitalize from 'lodash/capitalize'
import { useDebouncedCallback } from 'use-debounce'
import { Chain } from '@streamr/config'
import SvgIcon from '~/shared/components/SvgIcon'
import { getDataAddress, getTokenInformation } from '~/marketplace/utils/web3'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { COLORS, MAX_CONTENT_WIDTH, MEDIUM, REGULAR } from '~/shared/utils/styled'
import { Radio } from '~/shared/components/Radio'
import Text from '~/shared/components/Ui//Text'
import Button from '~/shared/components/Button'
import SelectField2 from '~/marketplace/components/SelectField2'
import { contractCurrencies } from '~/shared/utils/constants'
import { ContractCurrency } from '~/shared/types/common-types'
import useValidation from '~/marketplace/containers/ProductController/useValidation'
import { SeverityLevel } from '~/marketplace/containers/ProductController/ValidationContextProvider'
import { Address } from '~/shared/types/web3-types'
import { PricingData, Project } from '~/marketplace/types/project-types'
import { pricePerSecondFromTimeUnit } from '~/marketplace/utils/price'
import { TimeUnit, timeUnits } from '~/shared/utils/timeUnit'
import { ObjectPaths } from '~/utils/objectPaths'
import { errorToast } from '~/utils/toast'
import { toBN } from '~/utils/bn'

const Container = styled.div`
    color: ${COLORS.primary};
    max-width: ${MAX_CONTENT_WIDTH};
`

const Heading = styled.p`
    color: black;
    font-weight: ${REGULAR};
    font-size: 20px;
    margin-bottom: 22px;
`

const Description = styled.p`
    font-size: 16px;
    margin-bottom: 32px;
`

const Form = styled.div`
    border-radius: 4px;
    background-color: ${COLORS.inputBackground};
    padding: 24px;
    margin-bottom: 32px;
`

const RadioContainer = styled.div`
    background-color: white;
    border-radius: 4px;

    .radio {
        padding: 24px 20px;
        width: 100%;
    }

    &.data-token-radio-container {
        margin-bottom: 16px;
    }
`

const RadioLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    .data-icon {
        width: 24px;
        height: 24px;
    }
`

const CustomTokenAddressInputContainer = styled.div`
    padding: 0 20px 24px;
    label {
        font-weight: ${MEDIUM};
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 9px;
    }
`

const SetTokenContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
`

const PriceContainer = styled.div`
    display: flex;
    margin-top: 16px;
`

const PriceInputWrap = styled.div`
    position: relative;
    flex: 1;
    margin-right: 16px;
    .price-input {
        padding-right: 60px;
        &:disabled {
            background-color: white;
            opacity: 1;
        }
    }
    .token-symbol {
        position: absolute;
        right: 12px;
        top: 0;
        height: 100%;
        font-size: 14px;
        border-left: 1px solid ${COLORS.separator};
        padding-left: 12px;
        color: ${COLORS.primaryLight};
        display: flex;
        align-items: center;
    }
`

const SelectContainer = styled.div`
    [class*='-control'] {
        min-height: 40px;
        border: none;
        &:hover {
            border: none;
        }
    }
`

const options = Object.values(timeUnits).map((unit: TimeUnit) => ({
    label: `Per ${unit}`,
    value: unit,
}))

type Props = {
    disabled?: boolean
    chain?: Chain
    onChange: (pricing: PricingData) => void
    value?: PricingData | undefined
    validationFieldName: ObjectPaths<Project>
    tokenChangeDisabled: boolean
}

const TokenSelector: FunctionComponent<Props> = ({
    disabled,
    onChange,
    chain,
    validationFieldName,
    value,
    tokenChangeDisabled,
}) => {
    const chainId = chain?.id
    const dataAddress = useMemo(
        () => (chainId ? getDataAddress(chainId).toLowerCase() : ''),
        [chainId],
    )
    const isMounted = useIsMounted()
    const [selection, setSelection] = useState<ContractCurrency>(
        (value?.tokenAddress && value?.tokenAddress === dataAddress) ||
            value?.tokenAddress == null
            ? contractCurrencies.DATA
            : contractCurrencies.PRODUCT_DEFINED,
    )
    const [customTokenAddress, setCustomTokenAddress] = useState<Address>(
        value?.tokenAddress && value?.tokenAddress !== dataAddress
            ? value.tokenAddress
            : '',
    )
    const [selectedTokenAddress, setSelectedTokenAddress] = useState<Address | undefined>(
        value?.tokenAddress?.toLowerCase(),
    )
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)
    const [price, setPrice] = useState<string | undefined>(value?.price?.toString())
    const [timeUnit, setTimeUnit] = useState<TimeUnit>(value?.timeUnit || timeUnits.day)
    const [tokenDecimals, setTokenDecimals] = useState<number | null>(18)
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const { setStatus, clearStatus, isValid } = useValidation(validationFieldName)
    const pricingTokenAddress = value?.tokenAddress?.toLowerCase()

    const debouncedOnChange = useDebouncedCallback(onChange, 50)

    useEffect(() => {
        clearStatus()
    }, [chain, clearStatus])

    useEffect(() => {
        if (pricingTokenAddress && chainId) {
            let loading = true

            const check = async () => {
                if (pricingTokenAddress === dataAddress) {
                    setSelection(contractCurrencies.DATA)
                } else if (pricingTokenAddress != null) {
                    setSelection(contractCurrencies.PRODUCT_DEFINED)
                    setCustomTokenAddress(pricingTokenAddress)
                }

                const info = await getTokenInformation(pricingTokenAddress, chainId)
                if (!isMounted()) {
                    return
                }

                if (!loading) {
                    return
                }

                if (info) {
                    clearStatus()
                    setTokenSymbol(info.symbol)
                    setTokenDecimals(toBN(info.decimals).toNumber())
                } else {
                    errorToast({
                        title: 'Invalid token contract address',
                        desc: 'This is not an ERC-20 token contract',
                    })
                    setStatus(SeverityLevel.ERROR, 'This is not an ERC-20 token contract')
                    setTokenSymbol(null)
                    setTokenDecimals(null)
                }
            }

            check()

            // Allow only latest load operation
            return () => {
                loading = false
            }
        }
    }, [pricingTokenAddress, isMounted, clearStatus, setStatus, chainId, dataAddress])

    useEffect(() => {
        if (!selection || !chainId) {
            return
        }
        if (selection === contractCurrencies.DATA) {
            setCustomTokenAddress('')
            setSelectedTokenAddress(getDataAddress(chainId))
            setIsEditable(false)
            setTokenSymbol(null)
        } else if (selection === contractCurrencies.PRODUCT_DEFINED) {
            setSelectedTokenAddress(undefined)
            setIsEditable(customTokenAddress.length === 0)
            setTokenSymbol(null)
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selection, chainId])

    const handleChange = useCallback(
        (changes: Partial<PricingData>) => {
            const outputPrice = changes.price || price
            const outputTimeUnit = changes.timeUnit || timeUnit
            const output: PricingData = {
                price: outputPrice ? toBN(outputPrice) : undefined,
                timeUnit: outputTimeUnit,
                tokenAddress: selectedTokenAddress?.toLowerCase(),
                pricePerSecond:
                    outputPrice && outputTimeUnit && tokenDecimals
                        ? pricePerSecondFromTimeUnit(
                              outputPrice,
                              outputTimeUnit,
                              tokenDecimals,
                          )
                        : undefined,
            }
            debouncedOnChange(output)
        },
        [price, selectedTokenAddress, timeUnit, tokenDecimals, debouncedOnChange],
    )

    useEffect(() => {
        if (selection === contractCurrencies.PRODUCT_DEFINED && !selectedTokenAddress) {
            return
        }
        if (selectedTokenAddress?.toUpperCase() !== value?.tokenAddress?.toUpperCase()) {
            handleChange({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTokenAddress, value, selection])

    return (
        <Container>
            <Heading>
                Set the payment token and price on the{' '}
                {chain != null ? capitalize(chain.name) : 'selected'} chain
            </Heading>
            <Description>
                You can set a price for others to access the streams in your project. The
                price can be set in DATA or any other ERC-20 token.
            </Description>
            <Form>
                <RadioContainer className={'data-token-radio-container'}>
                    <Radio
                        id={'data-token'}
                        name={'token-selector-' + chain?.name}
                        label={
                            <RadioLabel>
                                <span>DATA Token</span>
                                <SvgIcon name={'DATAColor'} className={'data-icon'} />
                            </RadioLabel>
                        }
                        value={contractCurrencies.DATA}
                        disabled={disabled || tokenChangeDisabled}
                        disabledReason={'You need to select the chain first!'}
                        onChange={setSelection}
                        className={'radio'}
                        checked={selection === contractCurrencies.DATA}
                    />
                </RadioContainer>
                <RadioContainer>
                    <Radio
                        id={'custom-token'}
                        name={'token-selector-' + chain?.name}
                        label={
                            <RadioLabel>
                                <span>Custom Token</span>
                            </RadioLabel>
                        }
                        value={contractCurrencies.PRODUCT_DEFINED}
                        disabled={disabled || tokenChangeDisabled}
                        disabledReason={'You need to select the chain first!'}
                        onChange={setSelection}
                        className={'radio'}
                        checked={selection === contractCurrencies.PRODUCT_DEFINED}
                    />
                    <CustomTokenAddressInputContainer className={'custom-'}>
                        <label>Token contract address</label>
                        <Text
                            autoComplete="off"
                            disabled={
                                selection !== contractCurrencies.PRODUCT_DEFINED ||
                                disabled ||
                                !isEditable ||
                                tokenChangeDisabled
                            }
                            placeholder={'e.g 0xdac17f958d2ee523a2206206994597c13d831ec7'}
                            value={customTokenAddress}
                            onChange={(e) => setCustomTokenAddress(e.target.value)}
                            selectAllOnFocus
                            smartCommit
                            invalid={!isValid}
                        />
                        <SetTokenContainer>
                            <Button
                                onClick={() => {
                                    setSelectedTokenAddress(customTokenAddress)
                                }}
                                disabled={disabled}
                            >
                                Set Custom Token
                            </Button>
                        </SetTokenContainer>
                    </CustomTokenAddressInputContainer>
                </RadioContainer>
                <PriceContainer>
                    <PriceInputWrap>
                        <Text
                            className={'price-input'}
                            placeholder={'Set your price'}
                            onChange={(event) => {
                                handleChange({ price: event.target.value })
                                setPrice(event.target.value)
                            }}
                            defaultValue={
                                value?.price ? value.price.toString() : undefined
                            }
                            disabled={disabled}
                        />
                        {tokenSymbol && (
                            <span className={'token-symbol'}>{tokenSymbol}</span>
                        )}
                    </PriceInputWrap>
                    <SelectContainer>
                        <SelectField2
                            whiteVariant={true}
                            placeholder={'Unit'}
                            options={options}
                            isClearable={false}
                            value={timeUnit}
                            onChange={(selected) => {
                                handleChange({ timeUnit: selected })
                                setTimeUnit(selected as TimeUnit)
                            }}
                            disabled={disabled}
                        />
                    </SelectContainer>
                </PriceContainer>
            </Form>
        </Container>
    )
}

export default TokenSelector