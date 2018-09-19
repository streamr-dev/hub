import * as constants from '../../../../src/marketplace/modules/global/constants'

describe('global - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/global\//))
        })
    })
})
