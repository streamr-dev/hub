import React from 'react'
import styled from 'styled-components'
import { Button } from '~/components/Button'
import FormattedPaymentRate from '~/components/FormattedPaymentRate'
import { getProjectTypeName } from '~/getters'
import { isAbandonment } from '~/modals/ProjectModal'
import ProjectPng from '~/shared/assets/images/project.png'
import {
    useIsProjectBeingPurchased,
    usePurchaseCallback,
} from '~/shared/stores/purchases'
import { ProjectType, SalePoint } from '~/shared/types'
import { MEDIUM } from '~/shared/utils/styled'
import { timeUnits } from '~/shared/utils/timeUnit'
import { getChainDisplayName, useCurrentChainId } from '~/utils/chains'
import { errorToast } from '~/utils/toast'

const GetAccessContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 488px;
    margin: 0 auto;
    padding: 15px 0 100px;

    img {
        display: block;
    }

    h1 {
        font-weight: ${MEDIUM};
        font-size: 34px;
        line-height: 44px;
        margin-bottom: 19px;
        text-align: center;
    }

    p {
        font-size: 18px;
        line-height: 30px;
        margin-bottom: 50px;
        text-align: center;
    }
`

interface Props {
    projectId: string
    projectType: ProjectType
    projectName: string
    salePoints: SalePoint[]
}

export default function GetAccess({
    projectId,
    projectName,
    projectType,
    salePoints,
}: Props) {
    const [firstSalePoint, ...otherSalePoints] = salePoints

    const count = otherSalePoints.length

    const purchase = usePurchaseCallback()

    const projectChainId = useCurrentChainId()

    const isBeingPurchased = useIsProjectBeingPurchased(projectId)

    if (!firstSalePoint) {
        return null
    }

    const { pricePerSecond, chainId, pricingTokenAddress } = firstSalePoint

    return (
        <>
            <GetAccessContainer>
                <img src={ProjectPng} alt="Get access" width="290" height="265" />
                <h1>Get access to {projectName}</h1>
                <p>
                    The streams in this {getProjectTypeName(projectType)} can be accessed
                    for
                    <br />
                    <strong>
                        <FormattedPaymentRate
                            amount={pricePerSecond}
                            chainId={chainId}
                            pricingTokenAddress={pricingTokenAddress}
                            timeUnit={timeUnits.hour}
                        />
                    </strong>{' '}
                    on <strong>{getChainDisplayName(chainId)}</strong>
                    {count > 0 && (
                        <>
                            and on {count} other chain{count > 1 && 's'}
                        </>
                    )}
                </p>
                <Button
                    type="button"
                    waiting={isBeingPurchased}
                    onClick={async () => {
                        try {
                            await purchase(projectChainId, projectId)
                        } catch (e) {
                            if (isAbandonment(e)) {
                                return
                            }

                            console.warn('Purchase failed', e)

                            errorToast({
                                title: 'Purchase failed',
                            })
                        }
                    }}
                >
                    Get access
                </Button>
            </GetAccessContainer>
        </>
    )
}
