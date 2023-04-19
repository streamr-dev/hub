import { type StreamrClient, StreamPermission, Stream } from 'streamr-client'
import { create } from 'zustand'
import { useClient } from 'streamr-client-react'
import { useEffect } from 'react'
import produce from 'immer'
import { useAuthController } from '$auth/hooks/useAuthController'
import address0 from '$utils/address0'
import { useCurrentDraft } from './streamEditor'

type PermissionManifest = Partial<
    Record<
        StreamPermission,
        {
            cache: number
            value: boolean
        }
    >
>

interface Store {
    fetchPermission: (
        streamId: string,
        account: string,
        permission: StreamPermission,
        streamrClient: StreamrClient,
    ) => Promise<void>
    invalidate: (streamId: string, account: string) => void
    fetching: Partial<
        Record<
            string, // [streamrId, account, permission]
            boolean
        >
    >
    permissions: Partial<
        Record<
            string, // [streamId, account]
            PermissionManifest
        >
    >
}

function accountKey(streamId: string, account: string) {
    return JSON.stringify([streamId, account.toLowerCase()])
}

function permissionKey(streamId: string, account: string, permission: StreamPermission) {
    return JSON.stringify([streamId, account.toLowerCase(), permission])
}

const useStreamAbilitiesStore = create<Store>((set, get) => {
    function toggleFetching(
        streamId: string,
        account: string,
        permission: StreamPermission,
        newValue: boolean,
    ) {
        set((store) =>
            produce(store, (draft) => {
                if (!newValue) {
                    return void delete draft.fetching[
                        permissionKey(streamId, account, permission)
                    ]
                }

                draft.fetching[permissionKey(streamId, account, permission)] = true
            }),
        )
    }

    return {
        permissions: {},

        fetching: {},

        async fetchPermission(streamId, account, permission, streamrClient) {
            const pkey = permissionKey(streamId, account, permission)

            if (get().fetching[pkey]) {
                // Already fetching, skip.
                return
            }

            try {
                toggleFetching(streamId, account, permission, true)

                let stream: Stream | undefined

                try {
                    stream = await streamrClient.getStream(streamId)
                } catch (e) {
                    // Do nothing here.
                }

                if (!stream) {
                    throw new Error('Stream not found')
                }

                const value = await stream.hasPermission(account === address0 ? {
                    permission,
                    public: true,
                } : {
                    user: account,
                    permission,
                    allowPublic: true,
                })

                set((state) =>
                    produce(state, (draft) => {
                        const key = accountKey(streamId, account)

                        const group: PermissionManifest = draft.permissions[key] || {}

                        const cache = group[permission] || {
                            cache: 0,
                            value: false,
                        }

                        cache.value = value

                        group[permission] = cache

                        draft.permissions[key] = group
                    }),
                )
            } finally {
                toggleFetching(streamId, account, permission, false)
            }
        },

        invalidate(streamId, account) {
            set((store) =>
                produce(store, (draft) => {
                    delete draft.permissions[accountKey(streamId, account)]
                }),
            )
        },
    }
})

function useStreamAbility(
    streamId: string | undefined,
    account: string | undefined,
    permission: StreamPermission,
) {
    const client = useClient()

    const fetchPermission = useStreamAbilitiesStore(
        ({ fetchPermission }) => fetchPermission,
    )

    const { value, cache } =
        useStreamAbilitiesStore(({ permissions }) =>
            streamId
                ? permissions[accountKey(streamId, account || address0)]?.[permission]
                : undefined,
        ) || {}

    useEffect(() => {
        async function fetch() {
            if (!client || !streamId) {
                return
            }

            try {
                await fetchPermission(streamId, account || address0, permission, client)
            } catch (e) {
                console.warn(e)
            }
        }

        fetch()
    }, [cache, fetchPermission, streamId, account, permission, client])

    return value
}

export function useCurrentStreamAbility(permission: StreamPermission) {
    const { streamId } = useCurrentDraft()

    const { address } = useAuthController().currentAuthSession

    const hasPermission = useStreamAbility(streamId, address || undefined, permission)

    if (!streamId) {
        return (permission === StreamPermission.EDIT ||
            permission === StreamPermission.GRANT)
    }

    return hasPermission
}

export function useInvalidateStreamAbilities() {
    return useStreamAbilitiesStore(({ invalidate }) => invalidate)
}