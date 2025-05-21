import { StreamPermission } from '@streamr/sdk'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import Surround from '~/shared/components/Surround'
import Label from '~/shared/components/Ui/Label'
import Text from '~/shared/components/Ui/Text'
import { useCurrentChainId } from '~/utils/chains'
import { useCurrentStreamAbility } from '~/shared/stores/streamAbilities'
import { StreamDraft, getEmptyStreamEntity } from '~/stores/streamDraft'
import Section from '../Section'
import { ENS_DOMAINS_URL, EditableStreamId, ReadonlyStreamId } from './StreamId'

export function InfoSection({ disabled: disabledProp = false }) {
    const { id: streamId, metadata } =
        StreamDraft.useEntity({ hot: true }) || getEmptyStreamEntity()

    const { description } = metadata

    const canEdit = useCurrentStreamAbility(streamId, StreamPermission.EDIT)

    const disabled = disabledProp || !canEdit

    const update = StreamDraft.useUpdateEntity()

    const selectedChainId = useCurrentChainId()

    useEffect(
        function applySelectedChainIdToNewStream() {
            if (!streamId) {
                /**
                 * Only allow the global chain selector changes to update
                 * chain id of *new* streams.
                 */

                update((hot, cold) => {
                    hot.chainId = selectedChainId

                    cold.chainId = selectedChainId
                })
            }
        },
        [update, streamId, selectedChainId],
    )

    return (
        <Section title="Details">
            <Description>
                All streams have a unique id in the format{' '}
                <strong>domain/pathname</strong>.
                <Surround head=" " tail=" ">
                    The domain part can be your Ethereum address or an ENS name you own.
                </Surround>
                <Surround>
                    <a
                        href={ENS_DOMAINS_URL}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                    >
                        Need an ENS name?
                    </a>
                </Surround>
            </Description>
            <Row>
                {streamId ? (
                    <ReadonlyStreamId streamId={streamId} />
                ) : (
                    <EditableStreamId disabled={disabled} />
                )}
            </Row>
            <Row>
                <Label htmlFor="streamDescription">Description</Label>
                <Text
                    type="text"
                    id="streamDescription"
                    name="description"
                    placeholder="Add a brief description"
                    value={description}
                    onChange={({ target }) => {
                        update((draft) => {
                            draft.metadata.description = target.value
                        })
                    }}
                    disabled={disabled}
                    autoComplete="off"
                />
            </Row>
        </Section>
    )
}

const Row = styled.div`
    & + & {
        margin-top: 2rem;
    }

    input[disabled] {
        background-color: #efefef;
        color: #525252;
        opacity: 1;
    }
`

const Description = styled.p`
    margin-bottom: 3rem;
`
