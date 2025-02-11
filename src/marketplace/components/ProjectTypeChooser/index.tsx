import { useQuery } from '@tanstack/react-query'
import React, { FunctionComponent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import openDataImage from '~/marketplace/assets/open-data.png'
import openDataImage2x from '~/marketplace/assets/open-data@2x.png'
import paidDataImage from '~/marketplace/assets/paid-data.png'
import paidDataImage2x from '~/marketplace/assets/paid-data@2x.png'
import dataUnionImage from '~/marketplace/assets/product_dataunion.png'
import dataUnionImage2x from '~/marketplace/assets/product_dataunion@2x.png'
import { getPagedStreams } from '~/services/streams'
import { Radio } from '~/shared/components/Radio'
import SvgIcon from '~/shared/components/SvgIcon'
import { useWalletAccount } from '~/shared/stores/wallet'
import { ProjectType } from '~/shared/types'
import { COLORS, DESKTOP, REGULAR } from '~/shared/utils/styled'
import { useCurrentChainId, useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

const Root = styled.div`
    color: #323232;
    background-color: white;
    padding: 60px;
`

const PageTitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const PageTitle = styled.div`
    font-size: 24px;
    letter-spacing: 0;
    line-height: 24px;
`

const ProductChoices = styled.div`
    margin-top: 6.25em;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-row-gap: 24px;
    min-width: 600px;
    @media (${DESKTOP}) {
        grid-template-columns: 308px 308px 308px;
        grid-template-rows: auto;
        grid-column-gap: 24px;
    }
`
const Product = styled.button`
    display: grid;
    grid-row-gap: 1px;
    box-shadow: 0 0 10px 0 #00000026;
    cursor: pointer;
    border: none;
    background-color: transparent;
    border-radius: 8px;
    grid-template-columns: 20px auto 50px;
    grid-template-rows: auto;
    padding: 10px 20px;
    align-items: center;
    @media (${DESKTOP}) {
        padding: 0;
        grid-template-columns: auto;
        grid-template-rows: auto auto auto;
    }

    &:disabled {
        opacity: 0.6;
        cursor: default;
    }
`
const ProductTitle = styled.div`
    line-height: 16px;
    font-size: 18px;
    letter-spacing: 0;
    font-weight: ${REGULAR};
    color: ${COLORS.primary};
    margin: 24px 0 20px 20px;
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 1;
    text-align: left;
    @media (${DESKTOP}) {
        margin: 30px 0 40px;
        text-align: center;
        grid-column-start: 1;
        grid-column-end: 1;
        height: 40px;
        align-items: center;
        display: flex;
        justify-content: center;
    }
`
const ProductImage = styled.div`
    height: 50px;
    grid-column-start: 3;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 1;
    @media (${DESKTOP}) {
        height: 160px;
        margin: 27px 0;
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row-start: 2;
        grid-row-end: 2;
    }

    > img {
        margin: 0 auto;
        height: 50px;
        width: auto;
        @media (${DESKTOP}) {
            height: 140px;
        }
    }
`

const RadioWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px auto;
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 1;
    grid-row-end: 1;
    @media (${DESKTOP}) {
        grid-row-start: 3;
        grid-row-end: 3;
        margin: 40px auto;
    }
`

const CloseButton = styled.button`
    color: ${COLORS.close};
    line-height: 14px;
    cursor: pointer;
    padding: 0.5rem;
    margin: 0;
    background: none;
    outline: none;
    border: none;

    &:disabled {
        opacity: 0.2;
        cursor: not-allowed;
    }

    & > svg {
        width: 14px;
        height: 14px;
    }
`

const NoStreamsWarningBox = styled.div`
    background-color: ${COLORS.warning};
    padding: 12px;
    color: ${COLORS.primaryLight};
    margin-top: 24px;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 40px;
`

export const ProjectTypeChooser: FunctionComponent<{
    className?: string
    onClose: () => void
}> = ({ className, onClose }) => {
    const [selectedProductType, setSelectedProductType] = useState<ProjectType>()

    const chainName = useCurrentChainKey()

    const link = useMemo<string | null>(() => {
        if (!selectedProductType) {
            return null
        }

        return R.project('new', routeOptions(chainName, { type: selectedProductType }))
    }, [selectedProductType, chainName])

    const gotAnyStreams = useGotAnyStreams()

    return (
        <Root className={className}>
            <PageTitleContainer>
                <PageTitle>Choose your project type</PageTitle>
                <CloseButton type="button" onClick={onClose}>
                    <SvgIcon name="crossMedium" />
                </CloseButton>
            </PageTitleContainer>
            <ProductChoices>
                <Product onClick={() => setSelectedProductType(ProjectType.OpenData)}>
                    <ProductTitle>Open data</ProductTitle>
                    <ProductImage>
                        <img
                            src={openDataImage}
                            srcSet={`${openDataImage2x} 2x`}
                            alt="Open Data"
                        />
                    </ProductImage>
                    <RadioWrap>
                        <Radio
                            id={'openData'}
                            name={'productType'}
                            size={'large'}
                            label={''}
                            value={ProjectType.OpenData}
                            onChange={setSelectedProductType}
                            checked={selectedProductType === ProjectType.OpenData}
                        />
                    </RadioWrap>
                </Product>
                <Product onClick={() => setSelectedProductType(ProjectType.PaidData)}>
                    <ProductTitle>Paid data</ProductTitle>
                    <ProductImage>
                        <img
                            src={paidDataImage}
                            srcSet={`${paidDataImage2x} 2x`}
                            alt="Paid Data"
                        />
                    </ProductImage>
                    <RadioWrap>
                        <Radio
                            id={'paidData'}
                            name={'productType'}
                            size={'large'}
                            label={''}
                            value={ProjectType.PaidData}
                            onChange={setSelectedProductType}
                            checked={selectedProductType === ProjectType.PaidData}
                        />
                    </RadioWrap>
                </Product>
                <Product
                    disabled
                    onClick={() => setSelectedProductType(ProjectType.DataUnion)}
                    title={'Data Union'}
                >
                    <ProductTitle>Data Union</ProductTitle>
                    <ProductImage>
                        <img
                            src={dataUnionImage}
                            srcSet={`${dataUnionImage2x} 2x`}
                            alt="Data Union"
                        />
                    </ProductImage>
                    <RadioWrap>
                        <Radio
                            id={'dataUnion'}
                            name={'productType'}
                            size={'large'}
                            label={''}
                            value={ProjectType.DataUnion}
                            onChange={setSelectedProductType}
                            checked={selectedProductType === ProjectType.DataUnion}
                        />
                    </RadioWrap>
                </Product>
            </ProductChoices>
            {gotAnyStreams === false && (
                <NoStreamsWarningBox>
                    You have not created any streams yet. Please{' '}
                    <Link onClick={onClose} to={R.stream('new', routeOptions(chainName))}>
                        create a stream
                    </Link>{' '}
                    to get started. For help creating streams, see the{' '}
                    <a href={R.docs()}>docs</a>.
                </NoStreamsWarningBox>
            )}
            <ButtonContainer>
                {gotAnyStreams === false || !link ? (
                    <Button disabled={true}>Start building</Button>
                ) : (
                    <Button as={Link} to={link} onClick={onClose}>
                        Start building
                    </Button>
                )}
            </ButtonContainer>
        </Root>
    )
}

function useGotAnyStreams() {
    const wallet = useWalletAccount() || ''
    const currentChainId = useCurrentChainId()

    const { data: result = false, isLoading } = useQuery({
        queryKey: ['useGotAnyStreams', currentChainId, wallet],
        async queryFn() {
            if (!wallet) {
                return false
            }

            try {
                return (
                    (
                        await getPagedStreams(
                            currentChainId,
                            1,
                            undefined,
                            wallet,
                            undefined,
                            undefined,
                            undefined,
                            { force: true },
                        )
                    ).streams.length > 0
                )
            } catch (_) {}

            return false
        },
    })

    return isLoading ? void 0 : result
}
