import React from 'react'
import * as yup from 'yup'
import { fireEvent, render, waitFor, act } from '@testing-library/react'
import NetworkIcon from '~/shared/components/NetworkIcon'
import { DetailEditor } from '~/shared/components/DetailEditor'
import Mock = jest.Mock

describe('DetailEditor', () => {
    let onChangeSpy: Mock

    beforeEach(() => {
        onChangeSpy = jest.fn()
    })

    it('should render an working chain selector', () => {
        const chainOptions = [
            {
                label: (
                    <div data-testid={'chain0'}>
                        <NetworkIcon chainId={137} />
                        <span>Polygon</span>
                    </div>
                ),
                value: 'polygon',
            },
            {
                label: (
                    <div data-testid={'chain1'}>
                        <NetworkIcon chainId={1} />
                        <span>Ethereum</span>
                    </div>
                ),
                value: 'ethereum',
            },
            {
                label: (
                    <div data-testid={'chain2'}>
                        <NetworkIcon chainId={100} />
                        <span>Gnosis Chain (xDai)</span>
                    </div>
                ),
                value: 'xdai',
            },
        ]

        const instructionText = 'Please select the chain'

        const TestComponent = () => {
            return (
                <DetailEditor
                    instructionText={instructionText}
                    onChange={onChangeSpy}
                    selectOptions={chainOptions}
                />
            )
        }

        const element = render(<TestComponent />)
        act(() => {
            fireEvent.click(element.queryByTestId('detailEditorToggle'))
        })
        act(() => {
            fireEvent.keyDown(element.container.querySelector('[class$="-control"]'), {
                key: 'ArrowDown',
            })
        })
        expect(element.queryByTestId('chain0')).toBeTruthy()
        expect(element.queryByTestId('chain1')).toBeTruthy()
        expect(element.queryByTestId('chain2')).toBeTruthy()
        act(() => {
            element.queryByTestId('chain1').click()
        })
        expect(onChangeSpy).toHaveBeenCalledWith('ethereum')
        expect(element.queryByTestId('detailEditorInstructionText').textContent).toEqual(
            instructionText,
        )
        expect(element.queryByTestId('detailEditorOptional').textContent).toBeFalsy()
    })

    it("should render an optional text input for the email which should validate the input data and output it if it's valid", async () => {
        const instructionText = 'Please provide an email'
        const placeholder = 'Your email address'
        const cta = 'email'
        const invalidEmailMessage = 'Not a valid email!'

        const TestComponent = () => {
            return (
                <DetailEditor
                    instructionText={instructionText}
                    onChange={onChangeSpy}
                    optional={true}
                    placeholder={placeholder}
                    ctaButtonText={cta}
                    validation={[
                        {
                            validator: (value) => {
                                const schema = yup.string().trim().email()
                                return !!schema.isValidSync(value)
                            },
                            message: invalidEmailMessage,
                        },
                    ]}
                />
            )
        }
        const element = render(<TestComponent />)

        act(() => {
            fireEvent.click(element.queryByTestId('detailEditorToggle'))
        })

        const inputElement = await waitFor(() => {
            return element.queryByTestId('detailEditorInput')
        })
        expect(inputElement.getAttribute('placeholder')).toEqual(placeholder)
        expect(inputElement).toBeTruthy()
        expect(element.queryByTestId('detailEditorOptional').textContent).toEqual(
            'Optional',
        )
        expect(element.queryByTestId('detailEditorInstructionText').textContent).toEqual(
            instructionText,
        )
        // Provide invalid value
        act(() => {
            fireEvent.change(inputElement, { target: { value: 'invalidValue' } })
        })
        expect(element.queryByTestId('detailEditorValidationError').textContent).toEqual(
            invalidEmailMessage,
        )
        expect(element.queryByTestId('detailEditorAddCTA')).toBeFalsy()
        // Provide a proper value
        act(() => {
            fireEvent.change(inputElement, { target: { value: 'john.doe@example.com' } })
        })
        expect(element.queryByTestId('detailEditorValidationError')).toBeFalsy()
        expect(element.queryByTestId('detailEditorAddCTA').lastChild.textContent).toEqual(
            `Add ${cta}`,
        )
        // submit by clicking the CTA button
        act(() => {
            element.queryByTestId('detailEditorAddCTA').click()
        })
        expect(onChangeSpy).toHaveBeenCalledWith('john.doe@example.com')
    })
})