import StreamrClient, {
    PermissionAssignment,
    Stream,
    StreamPermission,
} from '@streamr/sdk'
import { useQuery } from '@tanstack/react-query'
import isEqual from 'lodash/isEqual'
import uniqueId from 'lodash/uniqueId'
import React, { useCallback } from 'react'
import { Link, useMatch, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { toaster } from 'toasterhea'
import { z } from 'zod'
import { address0 } from '~/consts'
import { DraftValidationError, ValidationError } from '~/errors'
import { getStreamrClientInstance } from '~/getters/getStreamrClient'
import GetCryptoModal from '~/modals/GetCryptoModal'
import { Bits, ParsedStream, matchBits, parseStream } from '~/parsers/StreamParser'
import InsufficientFundsError from '~/shared/errors/InsufficientFundsError'
import StreamNotFoundError from '~/shared/errors/StreamNotFoundError'
import { Operation } from '~/shared/toasts/TransactionListToast'
import getNativeTokenName from '~/shared/utils/nativeToken'
import { requirePositiveBalance } from '~/shared/utils/requirePositiveBalance'
import { Layer } from '~/utils/Layer'
import {
    getCurrentChainId,
    useCurrentChainId,
    useCurrentChainSymbolicName,
} from '~/utils/chains'
import { createDraftStore, getEmptyDraft } from '~/utils/draft'
import {
    isMessagedObject,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'
import { Route as R, routeOptions } from '~/utils/routes'
import { validationErrorToast } from '~/utils/toast'
import { toastedOperations } from '~/utils/toastedOperation'
import getChainId from '~/utils/web3/getChainId'

export const StreamDraft = createDraftStore<ParsedStream>({
    getEmptyDraft: () => getEmptyDraft<ParsedStream>(undefined),

    prefix: 'StreamDraft-',
})

interface GetEmptyStreamEntityOptions {
    chainId?: number
}

export function getEmptyStreamEntity(
    options: GetEmptyStreamEntityOptions = {},
): ParsedStream {
    const { chainId } = options

    return {
        chainId: chainId ?? getCurrentChainId(),
        domain: '',
        id: undefined,
        pathname: '',
        permissions: {},
        storage: {},
        metadata: {
            description: '',
            inactivityThresholdHours: '',
            partitions: '1',
            storageDays: '',
        },
    }
}

export function useStreamEntityQuery() {
    const { id: streamId } = useParams<{ id: string }>()

    const chainId = useCurrentChainId()

    const draft = StreamDraft.useBoundDraft(streamId)

    return useQuery({
        queryKey: ['useStreamEntityQuery', chainId, streamId],
        queryFn: async () => {
            if (draft?.entity) {
                return draft.entity.cold
            }

            if (!streamId) {
                return getEmptyStreamEntity()
            }

            try {
                const client = await getStreamrClientInstance(chainId)

                const stream = await client.getStream(streamId)

                if (!stream) {
                    throw new StreamNotFoundError(streamId)
                }

                const metadata = await stream.getMetadata()

                let storageNodes: string[] | undefined

                try {
                    storageNodes = await client.getStorageNodes(streamId)
                } catch (e) {
                    console.warn(`Failed to load storage nodes for stream ${streamId}`, e)
                }

                let permissionAssignments: PermissionAssignment[] | undefined

                try {
                    permissionAssignments = await client.getPermissions(streamId)
                } catch (e) {
                    console.warn(`Failed to load permissions for stream ${streamId}`, e)
                }

                return parseStream(stream, {
                    chainId,
                    metadata,
                    permissionAssignments,
                    storageNodes,
                })
            } catch (e) {
                if (isMessagedObject(e) && /not.found/i.test(e.message)) {
                    throw new StreamNotFoundError(streamId)
                }

                throw e
            }
        },
        staleTime: Infinity,
        gcTime: 0,
    })
}

interface UsePersistStreamDraftOptions {
    onCreate?: (
        chainId: number,
        streamId: string,
        options: { abortSignal?: AbortSignal },
    ) => void
    onPermissionsChange?: (
        streamId: string,
        assignments: PermissionAssignment[],
        options: { abortSignal?: AbortSignal },
    ) => void
}

export function usePersistStreamDraft(options: UsePersistStreamDraftOptions = {}) {
    const persist = StreamDraft.usePersist(
        async (draft, { abortSignal, bind, update }) => {
            const { entity } = draft

            if (!entity) {
                return
            }

            const { hot, cold } = entity

            const { id: streamId, domain, pathname, chainId } = hot

            let client: StreamrClient | undefined

            let stream: Stream | undefined

            const updateOperation: Operation = {
                id: uniqueId('operation-'),
                label: streamId ? 'Update stream' : 'Create stream',
            }

            const permissionsOperation: Operation = {
                id: uniqueId('operation-'),
                label: 'Update access settings',
            }

            const storageOperation: Operation = {
                id: uniqueId('operation-'),
                label: '',
            }

            const operations: Operation[] = []

            const metadataChanged = !isEqual(hot.metadata, cold.metadata)

            const shouldUpdateMetadata = !streamId || metadataChanged

            if (shouldUpdateMetadata) {
                operations.push(updateOperation)
            }

            const permissionAssignments: PermissionAssignment[] = []

            for (const account in hot.permissions) {
                const hotBits = hot.permissions[account] || 0

                const coldBits = cold.permissions[account] || 0

                if (hotBits === coldBits) {
                    continue
                }

                const permissions: StreamPermission[] = !hotBits
                    ? []
                    : (Object.keys(Bits).filter((perm) =>
                          matchBits(Bits[perm], hotBits),
                      ) as StreamPermission[])

                if (account === address0) {
                    permissionAssignments.push({
                        public: true,
                        permissions,
                    })

                    continue
                }

                permissionAssignments.push({
                    userId: account,
                    permissions,
                })
            }

            const shouldUpdatePermissions = permissionAssignments.length > 0

            if (shouldUpdatePermissions) {
                operations.push(permissionsOperation)
            }

            const storageNodeChanges: [string, boolean][] = []

            for (const address in hot.storage) {
                const hotEnabled = hot.storage[address] || false

                const coldEnabled = cold.storage[address] || false

                if (hotEnabled !== coldEnabled) {
                    storageNodeChanges.push([address, hotEnabled])
                }
            }

            storageOperation.label = formatStorageOperationLabel(
                0,
                storageNodeChanges.length,
            )

            const shouldUpdateStorage = storageNodeChanges.length > 0

            if (shouldUpdateStorage) {
                operations.push(storageOperation)
            }

            if (!operations.length) {
                return
            }

            async function checkBalance(c: StreamrClient) {
                await requirePositiveBalance(chainId, await c.getAddress())
            }

            await toastedOperations(operations, async (next, refresh) => {
                let transientStreamId: string | undefined

                if (!streamId) {
                    if (!domain) {
                        throw new DraftValidationError('domain', 'Domain is required')
                    }

                    if (!pathname) {
                        throw new DraftValidationError('pathname', 'Pathname is required')
                    }

                    transientStreamId = `${domain}/${pathname}`
                }

                if (streamId) {
                    /**
                     * Assign a draft to a stream id for later re-use. Based
                     * on this information we can recycle drafts that haven't
                     * been abandoned.
                     */

                    bind(streamId)
                }

                if (shouldUpdateMetadata && streamId) {
                    updateOperation.action = getOpenStreamLink(streamId)

                    refresh()
                }

                if (transientStreamId) {
                    client = await getStreamrClientInstance(chainId)

                    try {
                        if (await client.getStream(transientStreamId)) {
                            throw new DraftValidationError(
                                'id',
                                'Your stream id already exists. Please try a different one.',
                            )
                        }
                    } catch (e) {
                        if (e instanceof DraftValidationError) {
                            throw e
                        }

                        if (
                            !isMessagedObject(e) ||
                            !/stream not found/i.test(e.message)
                        ) {
                            throw new DraftValidationError(
                                'streamId',
                                'Failed to verify the uniqueness of your stream id.',
                            )
                        }

                        /**
                         * At this point we know that the error thrown above tells us that
                         * the stream with the given id hasn't been found. Good, onwards!
                         */
                    }
                }

                stream = await (async () => {
                    /**
                     * Whatever happens in here we end up fetching a stream instance. Conditions
                     * dictate if it's a new stream or an existing stream (optionally updated).
                     */

                    const {
                        description,
                        inactivityThresholdHours,
                        partitions,
                        storageDays,
                        ...otherMetadata
                    } = hot.metadata

                    const metadata = z
                        .object({
                            description: z
                                .string()
                                .transform((value) => value.trim() || undefined),
                            partitions: z.union([
                                z.literal('').transform(() => undefined),
                                z.coerce
                                    .number()
                                    .min(1)
                                    .max(99)
                                    .refine(
                                        (value) => Number.isInteger(value),
                                        'is not an integer value',
                                    ),
                            ]),
                            storageDays: z.union([
                                z.literal('').transform(() => undefined),
                                z.coerce
                                    .number()
                                    .refine(
                                        (value) => Number.isInteger(value),
                                        'is not an integer value',
                                    ),
                            ]),
                            inactivityThresholdHours: z.union([
                                z.literal('').transform(() => undefined),
                                z.coerce
                                    .number()
                                    .refine(
                                        (value) => Number.isInteger(value),
                                        'is not an integer value',
                                    ),
                            ]),
                        })
                        .parse({
                            description,
                            inactivityThresholdHours,
                            partitions,
                            storageDays,
                        })

                    const finalMetadata = {
                        ...JSON.parse(JSON.stringify(metadata)),
                        ...otherMetadata,
                    }

                    if (transientStreamId) {
                        client = await getStreamrClientInstance(chainId, {
                            transactional: true,
                        })

                        await checkBalance(client)

                        try {
                            return await client.createStream({
                                ...finalMetadata,
                                id: transientStreamId,
                            })
                        } catch (e) {
                            if (
                                isMessagedObject(e) &&
                                /not in namespace of authenticated user/.test(e.message)
                            ) {
                                throw new DraftValidationError(
                                    'domain',
                                    'Domain belongs to someone else',
                                )
                            }

                            throw e
                        }
                    }

                    if (!streamId) {
                        throw new DraftValidationError('streamId', 'Stream id is invalid')
                    }

                    if (metadataChanged) {
                        client = await getStreamrClientInstance(chainId, {
                            transactional: true,
                        })

                        await checkBalance(client)

                        await client.setStreamMetadata(streamId, {
                            ...finalMetadata,
                        })

                        return client.getStream(streamId)
                    }

                    client = await getStreamrClientInstance(chainId)

                    return client.getStream(streamId)
                })()

                const currentStreamId = stream.id
                const currentMetadata = await stream.getMetadata()

                const newMetadata = parseStream(stream, {
                    chainId,
                    metadata: currentMetadata,
                }).metadata

                update((hot, cold) => {
                    hot.metadata = newMetadata

                    cold.metadata = newMetadata
                })

                if (transientStreamId) {
                    /**
                     * Again, associate the current draft with the (new) stream
                     * id for later recycling purposes.
                     */

                    bind(currentStreamId)

                    update((hot, cold) => {
                        hot.id = currentStreamId

                        cold.id = hot.id

                        cold.domain = hot.domain

                        cold.pathname = hot.pathname
                    })

                    options.onCreate?.(chainId, currentStreamId, { abortSignal })
                }

                if (shouldUpdateMetadata) {
                    updateOperation.action = getOpenStreamLink(currentStreamId)

                    /**
                     * We've either created a stream or updated one that exists. Onwards!
                     */
                    next()
                }

                if (shouldUpdatePermissions) {
                    client = await getStreamrClientInstance(chainId, {
                        transactional: true,
                    })

                    await checkBalance(client)

                    await client.setPermissions({
                        streamId: currentStreamId,
                        assignments: permissionAssignments,
                    })

                    options.onPermissionsChange?.(
                        currentStreamId,
                        permissionAssignments,
                        {
                            abortSignal,
                        },
                    )

                    update((hot, cold) => {
                        cold.permissions = hot.permissions
                    })

                    next()
                }

                for (let i = 0; i < storageNodeChanges.length; i++) {
                    const [address, enabled] = storageNodeChanges[i]

                    storageOperation.label = formatStorageOperationLabel(
                        i + 1,
                        storageNodeChanges.length,
                    )

                    if (i !== 0) {
                        // Already notifying above.
                        refresh()
                    }

                    client = await getStreamrClientInstance(chainId, {
                        transactional: true,
                    })

                    await checkBalance(client)

                    if (enabled) {
                        await client.addStreamToStorageNode(stream.id, address)
                    } else {
                        await client.removeStreamFromStorageNode(stream.id, address)
                    }

                    update((hot, cold) => {
                        cold.storage[address] = enabled

                        hot.storage[address] = enabled
                    })
                }
            })
        },
    )

    return useCallback(() => {
        void (async () => {
            try {
                await persist()
            } catch (e) {
                if (e instanceof InsufficientFundsError) {
                    void (async () => {
                        try {
                            const chainId = await getChainId()

                            await getCryptoModal.pop({
                                tokenName: getNativeTokenName(chainId),
                            })
                        } catch (_) {
                            // Do nothing.
                        }
                    })()

                    return
                }

                if (e instanceof ValidationError) {
                    validationErrorToast({ title: 'Failed to save', error: e })

                    return
                }

                if (isTransactionRejection(e)) {
                    return
                }

                if (isRejectionReason(e)) {
                    return
                }

                throw e
            }
        })()
    }, [persist])
}

function formatStorageOperationLabel(current = 0, total = 0) {
    if (total <= 1) {
        return 'Update storage nodes'
    }

    return `Update storage nodes (${current} of ${total})`
}

const NewStreamLink = styled(Link)`
    display: block;
    font-size: 14px;

    :hover {
        text-decoration: underline;
    }
`

function getOpenStreamLink(streamId: string) {
    return function OpenStreamLink() {
        const chainName = useCurrentChainSymbolicName()

        const id: string = decodeURIComponent(
            useMatch(R.streamOverview(':id'))?.params['id'] || '',
        )

        if (!streamId || id === streamId) {
            return <></>
        }

        return (
            <NewStreamLink to={R.streamOverview(streamId, routeOptions(chainName))}>
                Open
            </NewStreamLink>
        )
    }
}

const getCryptoModal = toaster(GetCryptoModal, Layer.Modal)
