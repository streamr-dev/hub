import React, { useMemo } from 'react'
import { StreamPermission } from '@streamr/sdk'
import styled from 'styled-components'
import { address0 } from '~/consts'
import { Bits } from '~/parsers/StreamParser'
import { MEDIUM } from '~/shared/utils/styled'
import { StreamDraft } from '~/stores/streamDraft'

enum StreamType {
    PublicSubscribe = 'publicSubscribe',
    Private = 'private',
    PublicPubSub = 'publicPubSub',
}

type Props = {
    disabled?: boolean
}

export function StreamTypeSelector({ disabled }: Props) {
    const update = StreamDraft.useUpdateEntity()

    const bits = StreamDraft.useEntity({ hot: true })?.permissions[address0] ?? null

    const streamType = useMemo(() => {
        if (!bits) {
            return StreamType.Private
        }

        switch (bits) {
            case Bits[StreamPermission.SUBSCRIBE]:
                return StreamType.PublicSubscribe
            case Bits[StreamPermission.SUBSCRIBE] | Bits[StreamPermission.PUBLISH]:
                return StreamType.PublicPubSub
            default:
                return StreamType.Private
        }
    }, [bits])

    return (
        <Container>
            <Item>
                <RadioContainer htmlFor="publicSubscribe">
                    <Radio
                        id="publicSubscribe"
                        type="radio"
                        name="streamType"
                        checked={streamType === StreamType.PublicSubscribe}
                        onChange={() => {
                            update((entity) => {
                                entity.permissions[address0] =
                                    Bits[StreamPermission.SUBSCRIBE]
                            })
                        }}
                        disabled={disabled}
                    />
                    <div>
                        <Title>Public subscribe</Title>
                        <Description>Anyone can read/subscribe to the stream</Description>
                    </div>
                </RadioContainer>
            </Item>
            <Item>
                <RadioContainer htmlFor="private">
                    <Radio
                        id="private"
                        type="radio"
                        name="streamType"
                        checked={streamType === StreamType.Private}
                        onChange={() => {
                            update((hot, cold) => {
                                if (cold.permissions[address0] == null) {
                                    cold.permissions[address0] = 0
                                }

                                hot.permissions[address0] = 0
                            })
                        }}
                        disabled={disabled}
                    />
                    <div>
                        <Title>Private subscribe</Title>
                        <Description>
                            Only the keys listed below can read/subscribe to the
                            stream.
                        </Description>
                    </div>
                </RadioContainer>
            </Item>
            <Item>
                <RadioContainer htmlFor="publicPubSub">
                    <Radio
                        id="publicPubSub"
                        type="radio"
                        name="streamType"
                        checked={streamType === StreamType.PublicPubSub}
                        onChange={() => {
                            update((entity) => {
                                entity.permissions[address0] =
                                    Bits[StreamPermission.SUBSCRIBE] |
                                    Bits[StreamPermission.PUBLISH]
                            })
                        }}
                        disabled={disabled}
                    />
                    <div>
                        <Title>Public publish & subscribe</Title>
                        <Description>Anyone can write/publish to the stream</Description>
                    </div>
                </RadioContainer>
            </Item>
        </Container>
    )
}

const Container = styled.div`
    background: #f1f1f1;
    border-radius: 4px;
    display: grid;
    grid-template-rows: auto;
    grid-gap: 1em;
    padding: 1.5em;
`

const Item = styled.div`
    background: #ffffff;
    border-radius: 4px;
    height: 100px;
    display: flex;
    align-items: center;
`

const Radio = styled.input`
    width: 16px;
    justify-self: center;
    align-self: center;
`

const RadioContainer = styled.label`
    width: 100%;
    margin: 0;
    display: grid;
    grid-template-columns: 48px auto 48px;
`

const Title = styled.div`
    font-weight: ${MEDIUM};
    font-size: 16px;
    line-height: 20px;
`

const Description = styled.div`
    font-size: 14px;
    line-height: 24px;
`
