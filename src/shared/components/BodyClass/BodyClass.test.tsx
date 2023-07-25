import React from 'react'
import { render } from '@testing-library/react'
import uniqueId from 'lodash/uniqueId'
import BodyClass from './index'
describe('BodyClass', () => {
    it('sets/unsets class on mount/unmount', () => {
        const className = uniqueId('bodyclass')
        const { unmount } = render(<BodyClass className={className} />)
        expect(document.body.classList.contains(className)).toBe(true)
        unmount()
        expect(document.body.classList.contains(className)).toBe(false)
    })
    it('can update class via prop', () => {
        const className1 = uniqueId('bodyclass')
        const className2 = uniqueId('bodyclass')
        const { rerender, unmount } = render(<BodyClass className={className1} />)
        rerender(<BodyClass className={className2} />)
        expect(document.body.classList.contains(className1)).toBe(false)
        expect(document.body.classList.contains(className2)).toBe(true)
        unmount()
        expect(document.body.classList.contains(className1)).toBe(false)
        expect(document.body.classList.contains(className2)).toBe(false)
    })
    it('does not clobber itself', () => {
        const className1 = uniqueId('bodyclass')
        const className2 = uniqueId('bodyclass')
        const className3 = uniqueId('bodyclass')
        const { unmount: unmount1 } = render(<BodyClass className={className1} />)
        const { unmount: unmount2 } = render(
            <BodyClass className={`${className1} ${className2}`} />,
        )
        const { unmount: unmount3 } = render(
            <BodyClass className={`${className2} ${className3}`} />,
        )
        expect(document.body.classList.contains(className1)).toBe(true)
        expect(document.body.classList.contains(className2)).toBe(true)
        expect(document.body.classList.contains(className3)).toBe(true)
        unmount3()
        expect(document.body.classList.contains(className1)).toBe(true)
        expect(document.body.classList.contains(className2)).toBe(true)
        expect(document.body.classList.contains(className3)).toBe(false)
        unmount2()
        expect(document.body.classList.contains(className1)).toBe(true)
        expect(document.body.classList.contains(className2)).toBe(false)
        expect(document.body.classList.contains(className3)).toBe(false)
        unmount1()
        expect(document.body.classList.contains(className1)).toBe(false)
        expect(document.body.classList.contains(className2)).toBe(false)
        expect(document.body.classList.contains(className3)).toBe(false)
    })
})