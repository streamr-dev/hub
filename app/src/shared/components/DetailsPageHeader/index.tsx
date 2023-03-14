import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

import {COLORS, DESKTOP, LAPTOP, MAX_BODY_WIDTH, TABLET} from '$shared/utils/styled'
import SvgIcon from '$shared/components/SvgIcon'
import LinkTabs, { LinkTabOptionProps } from '$shared/components/LinkTabs'

export type DetailsPageHeaderProps = {
    backButtonLink?: string
    pageTitle?: ReactNode
    linkTabs: LinkTabOptionProps[]
}

export const DetailsPageHeader: FunctionComponent<DetailsPageHeaderProps> = ({ backButtonLink, pageTitle, linkTabs }) => {
    const location = useLocation()
    return (
        <DetailsPageHeaderBackground>
            <DetailsPageHeaderContainer>
                <DetailsPageHeaderBar>
                    <LeftSideContainer>
                        {!!backButtonLink && (
                            <BackLink to={backButtonLink}>
                                <BackButtonIcon name={'backArrow'}></BackButtonIcon>
                            </BackLink>
                        )}
                        {!!pageTitle && <PageTitleContainer>{pageTitle}</PageTitleContainer>}
                    </LeftSideContainer>
                    <RightSideContainer>
                        {(linkTabs?.length > 0) ?
                            <LinkTabs selectedOptionHref={location.pathname} options={linkTabs} fullWidth={'mobileAndTablet'}/>
                            : ''
                        }
                    </RightSideContainer>
                </DetailsPageHeaderBar>
            </DetailsPageHeaderContainer>
        </DetailsPageHeaderBackground>
    )
}

const DetailsPageHeaderBackground = styled.div`
    background-color: white;
    padding: 45px 0 22px;

    @media (${DESKTOP}) {
        padding: 130px 0 30px;
    }
`

const DetailsPageHeaderContainer = styled.div`
  max-width: ${MAX_BODY_WIDTH}px;
  margin: 0 auto;
  padding: 0 24px;

  & & {
    padding: 0 24px;
  }

  @media (${TABLET}) {
    padding: 0 40px;

    & & {
      padding: 0;
    }
  }

  @media (${DESKTOP}) {
    padding: 0;
  }
`

const DetailsPageHeaderBar = styled.div`
    display: block;
    @media (${LAPTOP}) {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`

const LeftSideContainer = styled.div`
    display: flex;
    align-items: center;
`

const RightSideContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 50px;
    @media (${LAPTOP}) {
        margin-top: 0;
    }
`

const BackLink = styled(Link)`
    padding: 10px;
    line-height: 30px;
    margin-right: 14px;
`
const BackButtonIcon = styled(SvgIcon)`
    color: ${COLORS.primaryLight};
`

const PageTitleContainer = styled.div`
    padding-left: 10px;
    margin-top: 3px;
    color: ${COLORS.primary};
    font-size: 16px;
    line-height: 30px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
