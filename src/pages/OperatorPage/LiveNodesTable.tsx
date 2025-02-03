import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle'
import JiraFailedBuildStatusIcon from '@atlaskit/icon/glyph/jira/failed-build-status'
import { ScrollTable } from '~/shared/components/ScrollTable/ScrollTable'
import { Heartbeat } from '~/hooks/useInterceptHeartbeats'
import { truncateNodeId } from '~/shared/utils/text'
import { useIsNodeIdReachable } from '~/shared/stores/operatorReachability'
import Spinner from '~/components/Spinner'

export interface OperatorNode {
    address: string
    enabled: boolean
    persisted: boolean
}

export function LiveNodesTable({
    heartbeats,
}: {
    heartbeats: Record<string, Heartbeat | undefined>
}) {
    const values = Object.values(heartbeats) as Heartbeat[]

    return (
        <ScrollTable
            elements={values}
            columns={[
                {
                    align: 'start',
                    displayName: 'Node ID',
                    isSticky: true,
                    key: 'id',
                    valueMapper: ({ nodeId }) => truncateNodeId(nodeId),
                },
                {
                    align: 'start',
                    displayName: 'Connectivity',
                    isSticky: false,
                    key: 'connectivity',
                    valueMapper: ({ nodeId }) => <Connectivity nodeId={nodeId} />,
                },
                {
                    align: 'start',
                    displayName: 'Last seen',
                    isSticky: false,
                    key: 'lastSeen',
                    valueMapper: ({ timestamp }) =>
                        moment(timestamp).format('YYYY-MM-DD HH:mm'),
                },
                {
                    align: 'start',
                    displayName: 'Version',
                    isSticky: false,
                    key: 'version',
                    valueMapper: ({ applicationVersion }) => applicationVersion || 'N/A',
                },
                {
                    align: 'start',
                    displayName: 'Host',
                    isSticky: false,
                    key: 'host',
                    valueMapper: ({ websocket }) => websocket?.host || 'N/A',
                },
                {
                    align: 'start',
                    displayName: 'Port',
                    isSticky: false,
                    key: 'port',
                    valueMapper: ({ websocket }) =>
                        typeof websocket?.port === 'undefined' ? 'N/A' : websocket.port,
                },
                {
                    align: 'start',
                    displayName: 'TLS',
                    isSticky: false,
                    key: 'tls',
                    valueMapper: ({ websocket }) =>
                        typeof websocket?.tls === 'undefined'
                            ? 'N/A'
                            : websocket.tls
                            ? 'Yes'
                            : 'No',
                },
            ]}
        />
    )
}

function Connectivity({ nodeId }: { nodeId: string }) {
    const reachable = useIsNodeIdReachable(nodeId)

    return reachable === 'pending' ? (
        <Spinner color="blue" />
    ) : reachable ? (
        <IconWrap $color="#0EAC1B">
            <CheckCircleIcon label="Ok" size="medium" />
        </IconWrap>
    ) : (
        <IconWrap $color="#FF5C00">
            <JiraFailedBuildStatusIcon label="Error" size="medium" />
        </IconWrap>
    )
}

const IconWrap = styled.div<{ $color?: string }>`
    align-items: center;
    color: ${({ $color = 'inherit' }) => $color};
    display: flex;
    height: 24px;
    justify-content: center;
    position: relative;
    width: 24px;
`
