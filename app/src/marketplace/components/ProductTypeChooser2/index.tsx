import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { projectTypes } from '$mp/utils/constants'
import openDataImage from '$mp/assets/open-data.png'
import openDataImage2x from '$mp/assets/open-data@2x.png'
import paidDataImage from '$mp/assets/paid-data.png'
import paidDataImage2x from '$mp/assets/paid-data@2x.png'
import dataUnionImage from '$mp/assets/product_dataunion.png'
import dataUnionImage2x from '$mp/assets/product_dataunion@2x.png'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS, DESKTOP, MEDIUM } from '$shared/utils/styled'
import { Radio } from '$shared/components/Radio'
import useFetchStreams from '$shared/hooks/useFetchStreams'
import docsLinks from '$app/src/docsLinks'
import Button from '$shared/components/Button'
import routes from '$routes'

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
  @media(${DESKTOP}) {
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
  grid-template-columns: 15px auto 50px;
  grid-template-rows: auto;
  padding: 10px 20px;
  @media(${DESKTOP}) {
    padding: 0;
    grid-template-columns: auto;
    grid-template-rows: auto auto auto;
  }
`
const ProductTitle = styled.div`
  line-height: 16px;
  font-size: 20px;
  letter-spacing: 0;
  font-weight: ${MEDIUM};
  margin: 20px 0 20px 20px;
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;
  text-align: left;
  @media(${DESKTOP}) {
    margin: 20px 0;
    text-align: center;
    grid-column-start: 1;
    grid-column-end: 1;
  }
`
const ProductImage = styled.div`
  height: 50px;
  grid-column-start: 3;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
  @media(${DESKTOP}) {
    height: 160px;
    margin: 27px 0;
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 2;
    grid-row-end: 2;
  }

  > img {
    height: 50px;
    width: auto;
    @media(${DESKTOP}) {
      height: 160px;
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
  @media(${DESKTOP}) {
    grid-row-start: 3;
    grid-row-end: 3;
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

enum ProjectTypesEnum {
    openData = 'openData',
    paidData = 'paidData',
    dataUnion = 'dataUnion'
}

export const ProductTypeChooser2: FunctionComponent<{className?: string, onClose: () => void}> = ({className, onClose}) => {

    // todo check if user has streams and disable if doesn't
    const fetchStreams = useFetchStreams()
    const [streamsCount, setStreamsCount] = useState<number>()

    const [selectedProductType, setSelectedProductType] = useState<ProjectTypesEnum>()

    const link = useMemo<string>(() => {
        if (!selectedProductType) {
            return null
        }
        let params: {type: string, paid?: boolean}
        switch (selectedProductType) {
            case ProjectTypesEnum.dataUnion:
                params = {
                    type: projectTypes.DATAUNION,
                }
                break
            case ProjectTypesEnum.openData:
                params = {
                    type: projectTypes.NORMAL,
                    paid: false
                }
                break
            case ProjectTypesEnum.paidData:
                params = {
                    type: projectTypes.NORMAL,
                    paid: true
                }
                break
        }
        console.log('link update', selectedProductType, params, routes.products.new(params))
        return routes.products.new(params)
    }, [selectedProductType])

    useEffect(() => {
        fetchStreams('', {batchSize: 1}).then((response) => {
            setStreamsCount(response[0].length)
        })
    }, [])

    return <Root className={className}>
        <PageTitleContainer>
            <PageTitle>Choose your product type</PageTitle>
            <CloseButton type="button" onClick={onClose}>
                <SvgIcon name="crossMedium" />
            </CloseButton>
        </PageTitleContainer>
        <ProductChoices>
            <Product onClick={() => setSelectedProductType(ProjectTypesEnum.openData)}>
                <ProductTitle>Open Data</ProductTitle>
                <ProductImage>
                    <img src={openDataImage} srcSet={`${openDataImage2x} 2x`} alt="Open Data"/>
                </ProductImage>
                <RadioWrap>
                    <Radio id={'openData'}
                        name={'productType'}
                        label={''}
                        value={ProjectTypesEnum.openData}
                        onChange={setSelectedProductType}
                        checked={selectedProductType === ProjectTypesEnum.openData}/>
                </RadioWrap>
            </Product>
            <Product onClick={() => setSelectedProductType(ProjectTypesEnum.paidData)}>
                <ProductTitle>Paid Data</ProductTitle>
                <ProductImage>
                    <img src={paidDataImage} srcSet={`${paidDataImage2x} 2x`} alt="Paid Data"/>
                </ProductImage>
                <RadioWrap>
                    <Radio id={'paidData'}
                        name={'productType'}
                        label={''}
                        value={ProjectTypesEnum.paidData}
                        onChange={setSelectedProductType}
                        checked={selectedProductType === ProjectTypesEnum.paidData}/>
                </RadioWrap>
            </Product>
            <Product onClick={() => setSelectedProductType(ProjectTypesEnum.dataUnion)}>
                <ProductTitle>Data Union</ProductTitle>
                <ProductImage>
                    <img src={dataUnionImage} srcSet={`${dataUnionImage2x} 2x`} alt="Data Union"/>
                </ProductImage>
                <RadioWrap>
                    <Radio id={'dataUnion'}
                        name={'productType'}
                        label={''}
                        value={ProjectTypesEnum.dataUnion}
                        onChange={setSelectedProductType}
                        checked={selectedProductType === ProjectTypesEnum.dataUnion}/>
                </RadioWrap>
            </Product>
        </ProductChoices>
        {streamsCount < 1 && <NoStreamsWarningBox>
            You have not create any stream yet.
            Please <Link to={routes.streams.new()}>create a stream</Link> to get started.
            For help creating streams, see the <Link to={docsLinks.docs}>docs</Link>.
        </NoStreamsWarningBox>}
        <ButtonContainer>
            {(streamsCount < 1 || !link)
                ? <Button disabled={true}>Start building</Button>
                : <Button tag={Link} to={link}>Start building</Button>
            }

        </ButtonContainer>
    </Root>
}
