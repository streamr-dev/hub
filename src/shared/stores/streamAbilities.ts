import { StreamrClient, StreamPermission, Stream } from '@streamr/sdk'
import { useClient } from 'streamr-client-react'
import { useEffect } from 'react'
import { produce } from 'immer'
import { create } from 'zustand'
import StreamNotFoundError from '~/shared/errors/StreamNotFoundError'
import { isMessagedObject } from '~/utils/exceptions'
import { address0 } from '~/consts'
import { useWalletAccount } from './wallet'

type PermissionManifest = Partial<
    Record<
        StreamPermission,
        {
            cache: number | undefined
            value: boolean | undefined
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

            let result = false

            try {
                toggleFetching(streamId, account, permission, true)

                let stream: Stream | null | undefined

                try {
                    stream = await streamrClient.getStream(streamId)
                } catch (e) {
                    if (isMessagedObject(e) && /not_found/i.test(e.message)) {
                        throw new StreamNotFoundError(streamId)
                    }

                    throw e
                }

                result = await stream.hasPermission(
                    account === address0
                        ? {
                              permission,
                              public: true,
                          }
                        : {
                              userId: account,
                              permission,
                              allowPublic: true,
                          },
                )
            } finally {
                set((state) =>
                    produce(state, (draft) => {
                        const key = accountKey(streamId, account)

                        const group: PermissionManifest = draft.permissions[key] || {}

                        const { cache } = group[permission] || {}

                        group[permission] = {
                            cache,
                            value: result,
                        }

                        draft.permissions[key] = group
                    }),
                )

                toggleFetching(streamId, account, permission, false)
            }
        },

        invalidate(streamId, account) {
            set((store) =>
                produce(store, (draft) => {
                    const permissions =
                        draft.permissions[accountKey(streamId, account)] || {}

                    const permissionKeys = Object.keys(permissions) as StreamPermission[]

                    permissionKeys.forEach((permission) => {
                        const { value, cache = 0 } = permissions[permission] || {}

                        permissions[permission] = {
                            value,
                            cache: cache + 1,
                        }
                    })
                }),
            )
        },
    }
})

export function useStreamAbility(
    streamId: string | undefined,
    account: string | undefined,
    permission: StreamPermission,
) {
    const client = useClient()

    const { fetchPermission } = useStreamAbilitiesStore()

    const { value, cache = 0 } =
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

export function useCurrentStreamAbility(
    streamId: string | undefined,
    permission: StreamPermission,
) {
    const account = useWalletAccount()

    const hasPermission = useStreamAbility(streamId, account, permission)

    if (!streamId) {
        return (
            permission === StreamPermission.EDIT || permission === StreamPermission.GRANT
        )
    }

    return hasPermission
}

export function useInvalidateStreamAbilities() {
    return useStreamAbilitiesStore(({ invalidate }) => invalidate)
}
