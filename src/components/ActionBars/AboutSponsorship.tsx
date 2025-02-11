import InfoIcon from '@atlaskit/icon/glyph/info'
import React from 'react'
import { Link as PrestyledLink } from 'react-router-dom'
import styled from 'styled-components'
import {
    Address,
    AddressContent,
    AddressLabel,
    Banner,
    IconWrap,
} from '~/components/ActionBars/AboutEntity'
import { DefaultSimpleDropdownMenu } from '~/components/SimpleDropdown'
import { SponsorshipPaymentTokenName } from '~/components/SponsorshipPaymentTokenName'
import { ExternalLinkIcon } from '~/icons'
import { Sponsorship } from '~/parsers/Sponsorship'
import { truncateStreamName } from '~/shared/utils/text'
import { useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

interface AboutSponsorshipProps {
    sponsorship: Sponsorship
}

export function AboutSponsorship({ sponsorship }: AboutSponsorshipProps) {
    const { streamId } = sponsorship

    const chainName = useCurrentChainKey()

    return (
        <DefaultSimpleDropdownMenu>
            {streamId && (
                <Address>
                    <AddressLabel>Sponsored stream:</AddressLabel>
                    <AddressContent>
                        <strong>{truncateStreamName(streamId)}</strong>
                        <div>
                            <Link
                                to={R.stream(streamId, routeOptions(chainName))}
                                target="_blank"
                            >
                                <ExternalLinkIcon />
                            </Link>
                        </div>
                    </AddressContent>
                </Address>
            )}
            <Banner>
                <IconWrap>
                    <InfoIcon label="Info" />
                </IconWrap>
                <div>
                    <p>
                        Sponsorships payout <SponsorshipPaymentTokenName /> tokens to
                        staked Operators that relay data in the sponsored stream. Anyone
                        can fund or extend a Sponsorship.
                    </p>
                    <p>
                        <a
                            href={R.docs('/streamr-network/network-incentives')}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            Learn more
                        </a>
                    </p>
                </div>
            </Banner>
        </DefaultSimpleDropdownMenu>
    )
}

const Link = styled(PrestyledLink)`
    display: block;

    :active {
        transform: translateY(1px);
    }
`
