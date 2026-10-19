import { useQuery } from '@tanstack/react-query'
import React, { ReactNode, useMemo } from 'react'
import Markdown from 'react-markdown'
import styled, { css } from 'styled-components'
import { z } from 'zod'
import { COLORS, TABLET } from '~/shared/utils/styled'
import { getStreamGptApiUrl } from '~/utils'
import { getImageCrossOrigin, getIpfsGatewayUrl } from '~/utils/ipfs'
import { LayoutColumn } from './Layout'
import { StreamStats } from './Stats'

interface StreamSummaryProps {
    streamId: string
}

export function StreamSummary(props: StreamSummaryProps) {
    const { streamId } = props

    const streamSummaryQuery = useStreamSummaryQuery(streamId)

    const { data: summary } = streamSummaryQuery

    const info = useMemo(() => {
        const {
            about = '',
            usage = '',
            imageUrl = null,
            schema = {},
            tags = [],
        } = summary || {}

        if (
            !about &&
            !usage &&
            !imageUrl &&
            !Object.keys(schema).length &&
            !tags.length
        ) {
            return null
        }

        return {
            about,
            usage,
            imageUrl,
            schema: Object.entries(schema),
            tags,
        }
    }, [summary])

    if (!info) {
        return null
    }

    return (
        <StreamSummaryRoot>
            <LayoutColumn>
                <OuterWings>
                    <Grid>
                        {!!(info.about || info.imageUrl || info.tags.length) && (
                            <StreamSummarySection title="About Stream" ai>
                                <AboutWrap>
                                    {info.imageUrl && (
                                        <div>
                                            {info.imageUrl && (
                                                <StreamImage
                                                    src={info.imageUrl}
                                                    crossOrigin={getImageCrossOrigin(
                                                        info.imageUrl,
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )}
                                    <AboutWrapInner>
                                        {info.about ? (
                                            <div>
                                                <Markdown>{info.about}</Markdown>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        {info.tags.length > 0 && (
                                            <Tags>
                                                {info.tags.map((tag) => (
                                                    <Tag key={tag}>#{tag}</Tag>
                                                ))}
                                            </Tags>
                                        )}
                                    </AboutWrapInner>
                                </AboutWrap>
                            </StreamSummarySection>
                        )}
                        <InnerWings>
                            {info.schema.length > 0 && (
                                <div>
                                    <StreamSummarySection
                                        title="Schema"
                                        ai
                                        scrollMode="always"
                                    >
                                        <Schema>
                                            {info.schema.map(([key, desc]) => (
                                                <SchemaPair key={key}>
                                                    <SchemaKey>{key}</SchemaKey>
                                                    {desc}
                                                </SchemaPair>
                                            ))}
                                        </Schema>
                                    </StreamSummarySection>
                                </div>
                            )}
                            {info.usage && (
                                <div>
                                    <StreamSummarySection title="Stream usage" ai>
                                        <Markdown>{info.usage}</Markdown>
                                    </StreamSummarySection>
                                </div>
                            )}
                        </InnerWings>
                    </Grid>
                    <IFrameWrap>
                        <iframe
                            src={`https://streamr.network/network-explorer/streams/${encodeURIComponent(
                                streamId,
                            )}?hud=467`}
                        />
                        <StreamStats streamId={streamId} />
                    </IFrameWrap>
                </OuterWings>
            </LayoutColumn>
        </StreamSummaryRoot>
    )
}

function useStreamSummaryQuery(streamId: string) {
    return useQuery({
        queryKey: ['useStreamSummaryQuery', streamId],
        queryFn: async () => {
            const resp = await fetch(
                getStreamGptApiUrl(`streams/${encodeURIComponent(streamId)}`),
            )

            return z
                .object({
                    about: z.string(),
                    id: z.string(),
                    imageHash: z.string(),
                    rank: z.number(),
                    schema: z.record(z.string(), z.string()),
                    streamId: z.string(),
                    tags: z
                        .string()
                        .transform((value) => value.split(/\s*,\s*/).filter(Boolean)),
                    usage: z.string(),
                })
                .transform(({ imageHash, ...rest }) => ({
                    imageUrl: imageHash ? getIpfsGatewayUrl(imageHash) : null,
                    ...rest,
                }))
                .parse(await resp.json())
        },
    })
}

type ScrollMode = 'desktopOnly' | 'always'

interface StreamSummarySectionProps {
    ai?: boolean
    children?: ReactNode
    scrollMode?: 'desktopOnly' | 'always'
    title: string
}

function StreamSummarySection(props: StreamSummarySectionProps) {
    const { ai = false, children, title, scrollMode = 'desktopOnly' } = props

    return (
        <StreamSummarySectionRoot>
            <StreamSummarySectionInner $scrollMode={scrollMode}>
                <StreamSummarySectionHeader>
                    <h5>{title}</h5>
                    {ai && <AiGenerated />}
                </StreamSummarySectionHeader>
                <StreamSummarySectionBody>{children}</StreamSummarySectionBody>
            </StreamSummarySectionInner>
        </StreamSummarySectionRoot>
    )
}

function AiGenerated() {
    return (
        <AiGeneratedRoot>
            <div>
                <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        // eslint-disable-next-line max-len
                        d="M5.06321 0.326186C4.88824 0.794011 4.51917 1.16308 4.05134 1.33805C3.99274 1.35954 3.95367 1.41619 3.95367 1.4787C3.95367 1.54121 3.99274 1.59786 4.05134 1.61934C4.51917 1.79431 4.88824 2.16339 5.06321 2.63121C5.0847 2.68981 5.14135 2.72888 5.20386 2.72888C5.26637 2.72888 5.32302 2.68981 5.3445 2.63121C5.51947 2.16339 5.88855 1.79431 6.35637 1.61934C6.41497 1.59786 6.45404 1.54121 6.45404 1.4787C6.45404 1.41619 6.41497 1.35954 6.35637 1.33805C5.88855 1.16308 5.51947 0.794011 5.3445 0.326186C5.32302 0.267584 5.26637 0.228516 5.20386 0.228516C5.14135 0.228516 5.0847 0.267584 5.06321 0.326186ZM1.10365 7.9523C0.73836 8.31759 0.73836 8.91143 1.10365 9.27867L1.77953 9.95455C2.14482 10.3198 2.73865 10.3198 3.10589 9.95455L10.5543 2.50424C10.9195 2.13895 10.9195 1.54511 10.5543 1.17787L9.87837 0.503947C9.51308 0.138659 8.91925 0.138659 8.552 0.503947L1.10365 7.9523ZM9.44178 1.61446C9.56747 1.74015 9.56747 1.94392 9.44178 2.06961L7.84585 3.66554C7.72016 3.79123 7.51639 3.79123 7.3907 3.66554C7.26502 3.53986 7.26502 3.33608 7.3907 3.2104L8.98664 1.61446C9.11232 1.48878 9.3161 1.48878 9.44178 1.61446ZM0.349631 2.51791C0.261727 2.55112 0.203125 2.63512 0.203125 2.72888C0.203125 2.82265 0.261727 2.90664 0.349631 2.93985C1.05093 3.20299 1.60429 3.75636 1.86743 4.45765C1.90064 4.54555 1.98464 4.60416 2.0784 4.60416C2.17216 4.60416 2.25616 4.54555 2.28937 4.45765C2.55251 3.75636 3.10587 3.20299 3.80717 2.93985C3.89507 2.90664 3.95367 2.82265 3.95367 2.72888C3.95367 2.63512 3.89507 2.55112 3.80717 2.51791C3.10587 2.25477 2.55251 1.70141 2.28937 1.00011C2.25616 0.91221 2.17216 0.853607 2.0784 0.853607C1.98464 0.853607 1.90064 0.91221 1.86743 1.00011C1.60429 1.70141 1.05093 2.25477 0.349631 2.51791ZM7.22564 7.51865C7.13773 7.55185 7.07913 7.63585 7.07913 7.72961C7.07913 7.82338 7.13773 7.90737 7.22564 7.94058C7.92693 8.20372 8.4803 8.75709 8.74344 9.45838C8.77665 9.54629 8.86064 9.60489 8.95441 9.60489C9.04817 9.60489 9.13217 9.54629 9.16537 9.45838C9.42852 8.75709 9.98188 8.20372 10.6832 7.94058C10.7711 7.90737 10.8297 7.82338 10.8297 7.72961C10.8297 7.63585 10.7711 7.55185 10.6832 7.51865C9.98188 7.25551 9.42852 6.70214 9.16537 6.00085C9.13217 5.91294 9.04817 5.85434 8.95441 5.85434C8.86064 5.85434 8.77665 5.91294 8.74344 6.00085C8.4803 6.70214 7.92693 7.25551 7.22564 7.51865Z"
                        fill="url(#paint0_linear_6944_9126)"
                    />
                    <defs>
                        <linearGradient
                            id="paint0_linear_6944_9126"
                            x1="0.203125"
                            y1="5.22852"
                            x2="18.4602"
                            y2="5.22852"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stopColor="#9747FF" />
                            <stop offset="1" stopColor="#0065FF" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <strong>AI Generated</strong>
        </AiGeneratedRoot>
    )
}

const AiGeneratedRoot = styled.div`
    align-items: center;
    background: #faf8ff;
    border-radius: 4px;
    display: flex;
    font-size: 12px;
    gap: 6px;
    height: 24px;
    line-height: normal;
    padding: 0 8px;
    text-wrap: nowrap;

    strong {
        background: linear-gradient(90deg, #9747ff 0%, #0065ff 171.81%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`

const Schema = styled.ul`
    list-style: none;
    line-height: 1.5em;
`

const SchemaKey = styled.span`
    background: ${COLORS.secondary};
    border-radius: 4px;
    padding: 3px 4px;
    font-size: 14px;
    font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    margin-right: 8px;
`

const SchemaPair = styled.li`
    & + & {
        margin-top: 4px;
    }
`

const Tags = styled.div`
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    * + & {
        margin-top: 16px;
    }
`

const Tag = styled.div`
    background: ${COLORS.Border};
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    min-width: 0;
    overflow: hidden;
    padding: 2px 8px;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    flex-shrink: 1;
`

const PictureOnSideMedia = `(min-width: 420px)`

const StreamImage = styled.img`
    border-radius: 16px;
    display: block;
    max-width: 100%;

    @media ${PictureOnSideMedia} {
        max-width: 192px;
        min-width: 64px;
        width: 20vw;
    }
`

const Grid = styled.div`
    display: grid;
    gap: 20px;
`

const MapToSideMedia = `(min-width: 1200px)`

const OuterWings = styled(Grid)`
    grid-template-columns: 1fr;

    @media ${MapToSideMedia} {
        grid-template-columns: 2fr 1fr;
    }
`

const StreamSummaryRoot = styled.div`
    background-color: white;
    padding-bottom: 56px;
`

const IFrameWrap = styled.div`
    position: relative;

    iframe {
        border-radius: 16px;
        border: 0;
        display: block;
        height: 320px;
        width: 100%;
    }

    @media ${TABLET} {
        display: block;
    }

    @media ${MapToSideMedia} {
        iframe {
            height: 604px;
        }
    }
`

const StreamSummarySectionRoot = styled.div`
    border: 1px solid ${COLORS.Border};
    border-radius: 16px;
    color: ${COLORS.primaryLight};
    overflow: hidden;

    h5 {
        font-size: 14px;
        font-weight: 500;
        line-height: 26px;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        text-wrap: nowrap;
    }

    p {
        font-size: 16px;
        line-height: 1.5em;
    }
`

const InnerWings = styled(Grid)`
    grid-template-columns: 1fr;

    &:empty {
        display: none;
    }

    @media ${MapToSideMedia} {
        grid-template-columns: 1fr 1fr;
    }
`

const AboutWrap = styled(Grid)`
    grid-template-columns: 1fr;
    gap: 32px;

    @media ${PictureOnSideMedia} {
        grid-template-columns: auto 1fr;
    }
`

const AboutWrapInner = styled.div`
    min-width: 0;
`

const StreamSummarySectionHeader = styled.div`
    align-items: center;
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    gap: 12px;
    height: 74px;
    padding: 0 24px;
    position: sticky;
    top: 0;
`

const StreamSummarySectionInner = styled.div<{ $scrollMode?: ScrollMode }>`
    height: auto;
    overflow: auto;

    ${({ $scrollMode }) =>
        $scrollMode === 'always' &&
        css`
            max-height: 290px;
        `}

    @media ${MapToSideMedia} {
        height: 290px;
    }
`

const StreamSummarySectionBody = styled.div`
    padding: 0 24px 24px;
    word-wrap: break-word;
`
