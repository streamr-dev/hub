import React, { useState, useEffect, FunctionComponent } from 'react'
import styled from 'styled-components'
import DaysPopover from '$shared/components/DaysPopover'
import TimeSeriesGraph from '$shared/components/TimeSeriesGraph'
import { getChainIdFromApiString } from '$shared/utils/chains'
import MembersGraph from '$mp/containers/ProductPage/MembersGraph'
import SubscriberGraph from '$mp/containers/ProductPage/SubscriberGraph'
import ProductController, { useController } from '$mp/containers/ProductController'
import { MEDIUM } from '$shared/utils/styled'
import ManageMembers from './ManageMembers'
const Container = styled.div`
    display: grid;
    padding: 16px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 16px;
    border-top: 1px solid #efefef;
`
const Box = styled.div`
    background: #fdfdfd;
    border: 1px solid #efefef;
    border-radius: 4px;
    width: 100%;
    padding: 32px 24px 16px 24px;
`
const Heading = styled.div`
    font-weight: ${MEDIUM};
    font-size: 14px;
    line-height: 18px;
    display: flex;
    align-items: center;
    color: #323232;
`
const StyledManageMembers = styled(ManageMembers)`
    grid-column: 1 / 3;
    grid-row: 1;
`
const GraphHeader = styled.div`
    margin-bottom: 32px;
`
const StyledDaysPopover = styled(DaysPopover)`
    width: 100%;
    justify-content: flex-end;
`
type Props = {
    product: any
    dataUnion: any
    stats: any
    className?: string
}

const Management = ({ product, dataUnion, stats, className }: Props) => {
    const [days, setDays] = useState(7)
    const [subsDays, setSubsDays] = useState(7)
    const { loadDataUnion } = useController()
    const memberCount = (stats && stats.memberCount) || 0
    const { beneficiaryAddress } = product
    const dataUnionId = beneficiaryAddress
    const chainId = getChainIdFromApiString(product.chain)
    useEffect(() => {
        if (beneficiaryAddress) {
            loadDataUnion(beneficiaryAddress, chainId)
        }

        return () => {}
    }, [beneficiaryAddress, loadDataUnion, chainId])
    return (
        <Container className={className}>
            <StyledManageMembers dataUnionId={dataUnionId} dataUnion={dataUnion} chainId={chainId} />
            <Box>
                <GraphHeader>
                    <TimeSeriesGraph.Header>
                        <Heading>Subscribers</Heading>
                        <StyledDaysPopover onChange={setSubsDays} selectedItem={`${subsDays}`} />
                    </TimeSeriesGraph.Header>
                </GraphHeader>
                {dataUnionId && <SubscriberGraph productId={product.id} shownDays={subsDays} chainId={chainId} />}
            </Box>
            <Box>
                <GraphHeader>
                    <TimeSeriesGraph.Header>
                        <Heading>Members</Heading>
                        <StyledDaysPopover onChange={setDays} selectedItem={`${days}`} />
                    </TimeSeriesGraph.Header>
                </GraphHeader>
                {dataUnionId && (
                    <MembersGraph
                        dataUnionAddress={dataUnionId}
                        memberCount={(memberCount && memberCount.total) || 0}
                        shownDays={days}
                        chainId={chainId}
                    />
                )}
            </Box>
        </Container>
    )
}

const WrappedManagement: FunctionComponent = (props: Props) => (
    <ProductController>
        <Management {...props} />
    </ProductController>
)

export default WrappedManagement
