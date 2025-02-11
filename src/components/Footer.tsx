import {
    FooterColumn,
    SocialChannels,
    FooterColumns as UnstyledFooterColumns,
    Footer as UnstyledLayoutFooter,
    MadeBy as UnstyledMadeBy,
} from '@streamr/streamr-layout'
import React from 'react'
import styled from 'styled-components'
import { COLORS } from '~/shared/utils/styled'
import { useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

const MadeBy = styled(UnstyledMadeBy)`
    padding: 0 0 32px;
    text-align: center;

    @media (min-width: 1200px) {
        padding: 32px 0;
        text-align: left;
    }
`

const LayoutFooter = styled(UnstyledLayoutFooter)`
    background-color: ${COLORS.secondary};
`

const FooterColumns = styled(UnstyledFooterColumns)`
    border-top: ${({ separate = false }) => (separate ? '1px' : '0')} solid #d8d8d8;
`

const Footer = ({ topBorder = false }) => {
    const chainKey = useCurrentChainKey()

    return (
        <LayoutFooter>
            <FooterColumns separate={topBorder}>
                <FooterColumn title="Discover">
                    <a href={R.root()}>Top</a>
                    <a href={R.siteDataToken()}>DATA Token</a>
                    <a href={R.siteDataUnions()}>Data Unions</a>
                    <a href={R.siteMarketplace()}>Marketplace</a>
                    <a href={R.siteNetwork()}>Network</a>
                </FooterColumn>
                <FooterColumn title="Project">
                    <a href={R.siteAbout()}>About</a>
                    <a href={R.siteRoadmap()}>Roadmap</a>
                    <a href={R.siteEcosystem()}>Ecosystem</a>
                    <a href={R.sitePapers()}>Papers</a>
                    <a href={R.blog()}>Blog</a>
                </FooterColumn>
                <FooterColumn title="Developers">
                    <a href={R.docs()}>Docs</a>
                    <a href={R.siteFund()}>Data Fund</a>
                    <a href={R.siteDesign()}>Design Assets</a>
                </FooterColumn>
                <FooterColumn title="Apps">
                    <a href={R.networkExplorer()}>Network Explorer</a>
                    <a href={R.hub(routeOptions(chainKey))}>Hub</a>
                </FooterColumn>
                <FooterColumn title="Contact">
                    <a href={R.contactGeneral()}>General</a>
                    <a href={R.contactMedia()}>Media</a>
                    <a href={R.contactJobs()}>Jobs</a>
                    <a href={R.contactLabs()}>Business</a>
                </FooterColumn>
                <FooterColumn title="Legal">
                    <a href={R.tos()}>Terms &amp; Conditions</a>
                    <a href={R.privacyPolicy()}>Privacy</a>
                </FooterColumn>
            </FooterColumns>
            <SocialChannels />
            <MadeBy />
        </LayoutFooter>
    )
}

export default Footer
