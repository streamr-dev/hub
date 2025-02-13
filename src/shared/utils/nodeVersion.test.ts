import { isNodeVersionGreaterThanOrEqualTo } from './nodeVersion'

describe('nodeVersion utils', () => {
    describe('isNodeVersionGreaterThanOrEqualTo', () => {
        it('returns true when version is greater than required version', () => {
            expect(isNodeVersionGreaterThanOrEqualTo('14.0.0', '12.0.0')).toBe(true)
            expect(isNodeVersionGreaterThanOrEqualTo('14.2.0', '14.1.0')).toBe(true)
            expect(isNodeVersionGreaterThanOrEqualTo('14.2.3', '14.2.2')).toBe(true)
        })

        it('returns true when version equals required version', () => {
            expect(isNodeVersionGreaterThanOrEqualTo('14.0.0', '14.0.0')).toBe(true)
            expect(isNodeVersionGreaterThanOrEqualTo('14.2.1', '14.2.1')).toBe(true)
        })

        it('returns false when version is less than required version', () => {
            expect(isNodeVersionGreaterThanOrEqualTo('12.0.0', '14.0.0')).toBe(false)
            expect(isNodeVersionGreaterThanOrEqualTo('14.1.0', '14.2.0')).toBe(false)
            expect(isNodeVersionGreaterThanOrEqualTo('14.2.1', '14.2.2')).toBe(false)
        })

        it('handles partial version numbers correctly', () => {
            expect(isNodeVersionGreaterThanOrEqualTo('14', '12')).toBe(true)
            expect(isNodeVersionGreaterThanOrEqualTo('14.2', '14.1')).toBe(true)
            expect(isNodeVersionGreaterThanOrEqualTo('14.2', '14.2')).toBe(true)
        })

        it('handles invalid version numbers', () => {
            expect(isNodeVersionGreaterThanOrEqualTo('invalid', '14.0.0')).toBe(false)
            expect(isNodeVersionGreaterThanOrEqualTo('14.0.0', 'invalid')).toBe(false)
            expect(isNodeVersionGreaterThanOrEqualTo('', '')).toBe(false)
        })

        it('handles versions with different number of parts', () => {
            // Current version has more parts than required
            expect(isNodeVersionGreaterThanOrEqualTo('14.0.0', '14.0')).toBe(true)
            expect(isNodeVersionGreaterThanOrEqualTo('14.0.1', '14')).toBe(true)

            // Required version has more parts than current
            expect(isNodeVersionGreaterThanOrEqualTo('14.0', '14.0.1')).toBe(false)
            expect(isNodeVersionGreaterThanOrEqualTo('14', '14.0.1')).toBe(false)
        })

        it('handles leading zeros in version parts', () => {
            expect(isNodeVersionGreaterThanOrEqualTo('014.0.0', '14.0.0')).toBe(true)
            expect(isNodeVersionGreaterThanOrEqualTo('14.02', '14.2')).toBe(true)
        })
    })
})
