import { Stream } from '@streamr/sdk'
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useClient } from 'streamr-client-react'
import styled, { css } from 'styled-components'
import { EmptyState } from '~/components/EmptyState'
import emptyStateIcon from '~/shared/assets/images/empty_state_icon.png'
import emptyStateIcon2x from '~/shared/assets/images/empty_state_icon@2x.png'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import SvgIcon from '~/shared/components/SvgIcon'
import Errors from '~/shared/components/Ui/Errors'
import useStreamData from '~/shared/hooks/useStreamData'
import { COLORS } from '~/shared/utils/styled'

import Feed from './Feed'
import Foot from './Foot'
import IconButton from './IconButton'
import Selector from './Selector'

type InspectorButtonProps = {
    active: boolean
}

const InspectorButton = styled(IconButton)<InspectorButtonProps>`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;
    color: #cdcdcd;

    &:hover,
    &:active,
    &:focus {
        background-color: #efefef;
        color: #525252;
    }

    ${({ active }) =>
        !!active &&
        css`
            background-color: #efefef;
            color: #525252;
        `}
`
type StreamPreviewPros = {
    streamsList: string[]
    activePartition?: number
    className?: string
    preselectedStreamId?: string
    previewDisabled?: boolean
}

const UnstyledStreamPreview: FunctionComponent<StreamPreviewPros> = ({
    streamsList,
    activePartition = 0,
    className,
    preselectedStreamId,
    previewDisabled = false,
}) => {
    const client = useClient()
    const [inspectorFocused, setInspectorFocused] = useState<boolean>(false)
    const [selectedStreamId, setSelectedStreamId] = useState<string>(
        !!preselectedStreamId && streamsList.includes(preselectedStreamId)
            ? preselectedStreamId
            : streamsList[0],
    )
    const [partition, setPartition] = useState<number>(activePartition)
    const [loading, setIsLoading] = useState<boolean>()
    const [_, setStream] = useState<Stream>()
    const [partitions, setPartitions] = useState<number>()
    const streamData = useStreamData(selectedStreamId, {
        tail: 20,
        partition,
    })

    useEffect(() => {
        const loadStreamData = async () => {
            if (client) {
                setIsLoading(true)
                try {
                    const result = await client.getStream(selectedStreamId)
                    setStream(result)
                    const metadata = await result.getMetadata()
                    const partitionCount = metadata.partitions as number
                    setPartitions(partitionCount)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        loadStreamData()
    }, [selectedStreamId, client])

    const partitionOptions = useMemo(
        () =>
            partitions ? [...new Array(partitions)].map((_, index) => index) : undefined,
        [partitions],
    )

    return (
        <>
            <LoadingIndicator loading={loading} />
            {previewDisabled && (
                <EmptyState
                    image={
                        <img
                            src={emptyStateIcon}
                            srcSet={`${emptyStateIcon2x} 2x`}
                            alt="No permission to subscribe"
                        />
                    }
                >
                    <p>
                        <span>
                            You do not have permission to
                            <br />
                            subscribe to the stream.
                        </span>
                    </p>
                </EmptyState>
            )}
            {!loading && (
                <>
                    {!previewDisabled && (
                        <Feed
                            className={className}
                            inspectorFocused={inspectorFocused}
                            streamData={streamData}
                            streamLoaded={!loading}
                            // errorComponent={
                            //     <Fragment>
                            //         {!!dataError && <Errors>{dataError}</Errors>}
                            //     </Fragment>
                            // }
                            onPartitionChange={setPartition}
                            onSettingsButtonClick={undefined}
                            onStreamChange={setSelectedStreamId}
                            partition={partition}
                            partitions={partitionOptions || []}
                            streamId={selectedStreamId}
                            streamIds={streamsList}
                        />
                    )}
                    <Foot>
                        <div>
                            <InspectorButton
                                active={!inspectorFocused}
                                onClick={() => setInspectorFocused(false)}
                                type="button"
                            >
                                <SvgIcon name="list" />
                            </InspectorButton>
                        </div>
                        <div>
                            <InspectorButton
                                active={!!inspectorFocused}
                                onClick={() => setInspectorFocused(true)}
                                type="button"
                            >
                                <SvgIcon name="listInspect" />
                            </InspectorButton>
                        </div>
                        {!inspectorFocused && !loading && (
                            <div>
                                <Selector
                                    title="Partitions"
                                    options={partitionOptions || []}
                                    active={partition}
                                    onChange={setPartition}
                                />
                            </div>
                        )}
                    </Foot>
                </>
            )}
        </>
    )
}

export const StreamPreview = styled(UnstyledStreamPreview)`
    background: #ffffff;
    color: #323232;
    font-size: 14px;
    border-top: 1px solid ${COLORS.Border};
    height: 100%;

    ${Errors} {
        margin: 20px 40px 0;
    }

    ${Errors} + ${Errors} {
        margin-top: 1em;
    }

    ${Errors}:last-child {
        padding-bottom: 20px;
    }
`
