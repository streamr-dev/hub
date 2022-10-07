import * as all from '$mp/modules/contractProduct/services'
import * as utils from '$mp/utils/smartContract'
describe('Product services', () => {
    beforeEach(() => {})
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    describe('getProductFromContract', () => {
        it('must throw error if owner is 0', async (done) => {
            const getProductStub = jest.fn(() => ({
                call: () =>
                    Promise.resolve({
                        owner: '0x000',
                        pricePerSecond: '0',
                    }),
            }))
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    getProduct: getProductStub,
                },
            }))

            try {
                await all.getProductFromContract('1234abcdef', false, 8995)
            } catch (e) {
                expect(e.message).toMatch(/No product found/)
                done()
            }
        })
    })
    describe('createContractProduct', () => {
        let exampleProduct
        beforeEach(() => {
            exampleProduct = {
                id: '1234abcdef',
                name: 'Awesome Granite Sausages',
                description:
                    'Minus dolores reprehenderit velit. Suscipit excepturi iure ea asperiores nam dolores nemo. Et repellat inventore.',
                category: 'dfd',
                streams: [],
                previewStream: null,
                dateCreated: '2018-03-27T08:51:37.261Z',
                lastUpdated: '2018-03-27T08:51:37.261Z',
                ownerAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                beneficiaryAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                pricePerSecond: '63',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: 0,
                imageUrl: null,
                chainId: 8995,
                pricingTokenAddress: '0x8f693ca8D21b157107184d29D398A8D082b38b76', // DATA
            }
        })
        it('must fail if no id', (done) => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))

            try {
                all.createContractProduct({ ...exampleProduct, id: null })
            } catch (e) {
                expect(e.message).toMatch(/not a valid hex/)
                done()
            }
        })
        it('must fail if price is 0', (done) => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))

            try {
                all.createContractProduct({
                    ...exampleProduct,
                    pricePerSecond: '0',
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must fail if price is negative', (done) => {
            const createContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))

            try {
                all.createContractProduct({
                    ...exampleProduct,
                    pricePerSecond: -3,
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must call send with correct object', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a) => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: () => 'test',
                },
            }))
            all.createContractProduct(exampleProduct)
        })
        it('must return the result of send', () => {
            jest.spyOn(utils, 'send').mockImplementation(() => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: () => {},
                },
            }))
            expect(all.createContractProduct(exampleProduct)).toBe('test')
        })
        it('must call createProduct with correct params', () => {
            const createProductSpy = jest.fn()
            jest.spyOn(utils, 'send').mockImplementation(jest.fn())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    createProduct: createProductSpy,
                },
            }))
            all.createContractProduct({
                ...exampleProduct,
                pricingTokenAddress: '0x1337',
            })
            expect(createProductSpy).toBeCalled()
            expect(createProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63',
                '0x1337',
                0,
            )
        })
    })
    describe('updateContractProduct', () => {
        let exampleProduct
        beforeEach(() => {
            exampleProduct = {
                id: '1234abcdef',
                name: 'Awesome Granite Sausages',
                description:
                    'Minus dolores reprehenderit velit. Suscipit excepturi iure ea asperiores nam dolores nemo. Et repellat inventore.',
                category: 'dfd',
                streams: [],
                previewStream: null,
                dateCreated: '2018-03-27T08:51:37.261Z',
                lastUpdated: '2018-03-27T08:51:37.261Z',
                ownerAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                beneficiaryAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                pricePerSecond: '63',
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: 0,
                imageUrl: null,
                chainId: 8995,
                pricingTokenAddress: '0x123',
            }
        })
        it('must fail if no id', (done) => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))

            try {
                all.updateContractProduct({ ...exampleProduct, id: null })
            } catch (e) {
                expect(e.message).toMatch(/not a valid hex/)
                done()
            }
        })
        it('must fail if price is 0', (done) => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))

            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    pricePerSecond: 0,
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must fail if price is negative', (done) => {
            const updateContractProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))

            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    pricePerSecond: -3,
                })
            } catch (e) {
                expect(e.message).toMatch(/product price/i)
                done()
            }
        })
        it('must call send with correct object', (done) => {
            jest.spyOn(utils, 'send').mockImplementation((a) => {
                expect(a).toBe('test')
                done()
            })
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: () => 'test',
                },
            }))
            all.updateContractProduct(exampleProduct)
        })
        it('must return the result of send', () => {
            jest.spyOn(utils, 'send').mockImplementation(() => 'test')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: () => {},
                },
            }))
            expect(all.updateContractProduct(exampleProduct)).toBe('test')
        })
        it('must call updateProduct with correct params (when DATA)', () => {
            const updateProductSpy = jest.fn()
            jest.spyOn(utils, 'send')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateProductSpy,
                },
            }))
            all.updateContractProduct(exampleProduct)
            expect(updateProductSpy).toHaveBeenCalledTimes(1)
            expect(updateProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63',
                '0x123',
                0,
                false,
            )
        })
        it('must call updateProductSpy with correct params (when USD)', () => {
            const updateProductSpy = jest.fn()
            jest.spyOn(utils, 'send')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateProductSpy,
                },
            }))
            all.updateContractProduct({ ...exampleProduct })
            expect(updateProductSpy).toHaveBeenCalledTimes(1)
            expect(updateProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63',
                '0x123',
                0,
                false,
            )
        })
        it('must call updateProductSpy with correct params redeploying', () => {
            const updateProductSpy = jest.fn()
            jest.spyOn(utils, 'send')
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    updateProduct: updateProductSpy,
                },
            }))
            all.updateContractProduct({ ...exampleProduct }, true)
            expect(updateProductSpy).toHaveBeenCalledTimes(1)
            expect(updateProductSpy).toBeCalledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63',
                '0x123',
                0,
                true,
            )
        })
    })
    describe('deleteProduct', () => {
        it('calls deleteProduct contract method', async () => {
            const deleteProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    deleteProduct: deleteProductStub,
                },
            }))
            await all.deleteProduct('1', 8995)
            expect(deleteProductStub).toBeCalledWith('0x1')
            expect(deleteProductStub).toHaveBeenCalledTimes(1)
        })
    })
    describe('redeployProduct', () => {
        it('calls redeployProduct contract method', async () => {
            const redeployProductStub = jest.fn(() => ({
                send: () => 'test',
            }))
            jest.spyOn(utils, 'send').mockImplementation((method) => method.send())
            jest.spyOn(utils, 'getContract').mockImplementation(() => ({
                methods: {
                    redeployProduct: redeployProductStub,
                },
            }))
            await all.redeployProduct('1', 8995)
            expect(redeployProductStub).toBeCalledWith('0x1')
            expect(redeployProductStub).toHaveBeenCalledTimes(1)
        })
    })
})