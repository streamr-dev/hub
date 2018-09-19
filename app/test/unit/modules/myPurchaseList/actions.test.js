import assert from 'assert-diff'
import { normalize } from 'normalizr'

import sinon from 'sinon'
import mockStore from '../../../test-utils/mockStoreProvider'
import * as actions from '../../../../src/marketplace/modules/myPurchaseList/actions'
import * as constants from '../../../../src/marketplace/modules/myPurchaseList/constants'
import * as entityConstants from '../../../../src/marketplace/modules/entities/constants'
import * as services from '../../../../src/marketplace/modules/myPurchaseList/services'
import { subscriptionsSchema } from '../../../../src/marketplace/modules/entities/schema'

describe('myPurchaseList - actions', () => {
    let sandbox

    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('getMyPurchases', () => {
        it('gets my purchases', async () => {
            const productId = '1234abc'
            const product = {
                id: productId,
                name: 'Test product',
            }
            const subscriptions = [
                {
                    user: 'test-user-1',
                    endsAt: '2010-10-10T10:10:10Z',
                    product,
                },
            ]
            const { result, entities } = normalize(subscriptions, subscriptionsSchema)

            sandbox.stub(services, 'getMyPurchases').callsFake(() => Promise.resolve(subscriptions))

            const store = mockStore({
                entities: {
                    products: {
                        [productId]: product,
                    },
                },
            })

            await store.dispatch(actions.getMyPurchases())

            const expectedActions = [
                {
                    type: constants.GET_MY_PURCHASES_REQUEST,
                },
                {
                    type: entityConstants.UPDATE_ENTITIES,
                    payload: {
                        entities,
                    },
                },
                {
                    type: constants.GET_MY_PURCHASES_SUCCESS,
                    payload: {
                        products: result,
                    },
                },
            ]
            const resultActions = store.getActions()
            assert.deepStrictEqual(resultActions, expectedActions)
        })
    })
})
