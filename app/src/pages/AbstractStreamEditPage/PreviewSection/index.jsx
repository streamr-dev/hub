import React, { useReducer, useState } from 'react'
import styled from 'styled-components'
import { useClient } from 'streamr-client-react'
import { Link } from 'react-router-dom'
import TOCPage from '$shared/components/TOCPage'
import useStreamId from '$shared/hooks/useStreamId'
import Button from '$shared/components/Button'
import useIsMounted from '$shared/hooks/useIsMounted'
import useIsSessionTokenReady from '$shared/hooks/useIsSessionTokenReady'
import useStreamData from '$shared/hooks/useStreamData'
import routes from '$routes'
import PreviewTable from './PreviewTable'
import docsLinks from '$shared/../docsLinks'

function DefaultDescription() {
    return (
        <Description>
            Live data in this stream is displayed below. For a more detailed view, you can open the Inspector.
            {' '}
            If you need help pushing data to your stream, see the
            {' '}
            <Link to={docsLinks.gettingStarted}>docs</Link>.
        </Description>
    )
}

function UnstyledPreviewSection({ className, subscribe = true, disabled, desc = <DefaultDescription /> }) {
    const streamId = useStreamId()

    const [isRunning, toggleIsRunning] = useReducer((current) => !current, true)

    const [dataError, setDataError] = useState(false)

    const hasLoaded = useIsSessionTokenReady()

    const client = useClient()

    const isMounted = useIsMounted()

    const streamData = useStreamData(streamId, {
        activeFn: () => streamId && subscribe && isRunning,
        onError: () => {
            if (isMounted()) {
                setDataError(true)
            }
        },
        tail: 10,
    })

    return (
        <TOCPage.Section
            id="preview"
            title="Preview"
            disabled={disabled}
        >
            {desc}
            <div className={className}>
                <PreviewTable streamData={streamData} />
                <Controls>
                    <ErrorNotice>
                        {hasLoaded && !client && (
                            <p>
                                Error: Unable to process the stream data.
                            </p>
                        )}
                        {dataError && (
                            <p>
                                Error: Some messages in the stream have invalid content and are not shown.
                            </p>
                        )}
                    </ErrorNotice>
                    <Button
                        kind="secondary"
                        onClick={toggleIsRunning}
                        disabled={streamData.length === 0}
                    >
                        {!isRunning ? 'Start' : 'Stop'}
                    </Button>
                    {streamId ? (
                        <Button
                            tag={Link}
                            kind="secondary"
                            to={routes.streams.preview({
                                id: streamId,
                            })}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Inspect data
                        </Button>
                    ) : (
                        <Button
                            kind="secondary"
                            type="button"
                            disabled
                        >
                            Inspect data
                        </Button>
                    )}
                </Controls>

            </div>
        </TOCPage.Section>
    )
}

const Controls = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    padding: 1rem;

    > * + * {
        margin-left: 1rem;
    }
`

const ErrorNotice = styled.div`
    flex: 1;
    font-size: 12px;
    color: #808080;

    p {
        margin: 0;
        line-height: 1.5rem;
    }
`

const Description = styled.p`
    margin-bottom: 3.125rem;
    max-width: 660px;
`

const PreviewSection = styled(UnstyledPreviewSection)`
    background-color: #fdfdfd;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 1fr 72px;
    position: relative;
`

export default PreviewSection