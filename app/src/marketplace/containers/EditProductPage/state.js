// @flow

import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { isDataUnionProduct } from '$mp/utils/product'
import { productStates } from '$shared/utils/constants'
import type { Product, PendingChanges } from '$mp/flowtype/product-types'

export const PENDING_CHANGE_FIELDS = [
    'name',
    'description',
    'imageUrl',
    'thumbnailUrl',
    'category',
    'streams',
    'previewStream',
    'beneficiaryAddress',
    'pricePerSecond',
    'priceCurrency',
    'adminFee',
    'timeUnit',
    'price',
    'termsOfUse',
    'contact.url',
    'contact.email',
    'contact.social1',
    'contact.social2',
    'contact.social3',
    'contact.social4',
    'requiresWhitelist',
    'pricingTokenAddress',
]

export function isPublished(product: Product) {
    const { state } = product || {}

    return !!(state === productStates.DEPLOYED || state === productStates.DEPLOYING)
}

export const getPendingObject = (product: Product | PendingChanges): Object => {
    let pendingObj = pick(product, PENDING_CHANGE_FIELDS)
    pendingObj = pickBy(pendingObj, (value) => value !== undefined)
    return pendingObj
}

export const getChangeObject = (original: Product, next: Product): Object => (
    Object.fromEntries(Object.entries(getPendingObject(next)).filter(([key, value]) => !isEqual(value, original[key])))
)

export function getPendingChanges(product: Product): Object {
    const isPublic = isPublished(product)
    const isDataUnion = isDataUnionProduct(product)

    if (isPublic || isDataUnion) {
        const { adminFee, ...otherPendingChanges } = getPendingObject(product.pendingChanges || {})

        if (isPublic) {
            // $FlowFixMe: Computing object literal [1] may lead to an exponentially large number of cases
            return {
                ...otherPendingChanges,
                ...(adminFee ? {
                    adminFee,
                } : {}),
            }
        } else if (isDataUnion && adminFee) {
            return {
                adminFee,
            }
        }
    }

    return {}
}

export function hasPendingChange(product: Product, field: string) {
    const pendingChanges = getPendingChanges(product)

    return get(pendingChanges, field) !== undefined
}

export function update(product: Product, fn: Function) {
    const result = fn(product)
    const { adminFee, ...otherChanges } = result
    const isPublic = isPublished(product)

    if (isPublic) {
        return {
            ...product,
            pendingChanges: {
                ...getChangeObject(product, result),
            },
        }
    } else if (isDataUnionProduct(product)) {
        return {
            ...otherChanges,
            pendingChanges: {
                adminFee,
            },
        }
    }

    return {
        ...otherChanges,
    }
}

export function withPendingChanges(product: Product) {
    if (product && (isPublished(product) || isDataUnionProduct(product))) {
        return {
            ...product,
            ...getPendingChanges(product),
        }
    }

    return product
}
