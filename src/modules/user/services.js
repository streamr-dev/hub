// @flow

import { get } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { IntegrationKey, LoginKey } from '../../flowtype/user-types'

export const getMyKeys = (): ApiResult<Array<LoginKey>> => get(formatUrl('users', 'me', 'keys'))

export const getIntegrationKeys = (): ApiResult<Array<IntegrationKey>> => get(formatUrl('integration_keys'))

// TODO: These won't be needed in the production version, this just sets the login status in the mock api
export const login = (): ApiResult<void> => get(formatUrl('users', 'login'))
export const logout = (): ApiResult<void> => get(formatUrl('users', 'logout'))
