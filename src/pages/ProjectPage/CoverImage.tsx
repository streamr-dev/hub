import React from 'react'
import styled from 'styled-components'
import ImageFilePicker from '~/components/ImageFilePicker'
import { COLORS, DESKTOP } from '~/shared/utils/styled'
import PngIcon from '~/shared/components/PngIcon'
import { getImageCrossOrigin } from '~/utils/ipfs'

const Radius = 16

export const Wide = 1100

export default function CoverImage({
    disabled = false,
    onChange,
    src,
}: {
    disabled?: boolean
    onChange?: (file: File) => void
    src?: string
}) {
    return (
        <Root>
            <ImageFilePicker disabled={disabled} onDrop={onChange}>
                <Dropzone>
                    <Placeholder>
                        <PngIcon name="imageUpload" alt="" />
                        <Mobile>Tap to take a photo or browse for one</Mobile>
                        <Desktop>
                            {src ? (
                                <>
                                    Drag &amp; drop to replace your cover image
                                    or&nbsp;click to browse for one
                                </>
                            ) : (
                                <>
                                    Drag &amp; drop to upload a cover image or&nbsp;click
                                    to browse for one
                                </>
                            )}
                        </Desktop>
                    </Placeholder>
                    {src && (
                        <>
                            <Preview as="div" />
                            <Preview
                                src={src}
                                alt="New image"
                                crossOrigin={getImageCrossOrigin(src)}
                            />
                        </>
                    )}
                </Dropzone>
            </ImageFilePicker>
        </Root>
    )
}

const Mobile = styled.p`
    @media ${DESKTOP} {
        display: none;
    }
`

const Desktop = styled.p`
    display: none;

    @media ${DESKTOP} {
        display: block;
    }
`

export const Root = styled.div`
    max-width: 100%;
    position: relative;

    @media (min-width: ${Wide}px) {
        width: 400px;
    }
`

const Preview = styled.img`
    display: block;
    background: white;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    visibility: visible;
    opacity: 1;
    transition: 0.5s;
    transition-property: visibility, opacity;

    & + & {
        border-radius: ${Radius}px;
    }
`

const Dropzone = styled.div`
    align-items: center;
    aspect-ratio: 1 / 1;
    background-color: ${COLORS.primaryLight};
    border-radius: ${Radius}px;
    color: #a3a3a3;
    display: flex;
    flex-direction: row;
    font-weight: 500;
    justify-content: center;
    padding: 0 3em;
    text-align: center;
    width: 100%;

    :hover ${Preview} {
        opacity: 0;
        transition-delay: 0.05s, 0s;
        transition-duration: 0.05s;
        visibility: hidden;
    }
`

const Placeholder = styled.div`
    transform: translateY(3%);

    > img {
        margin: 0 auto;
    }

    p {
        line-height: 1.75em;
        margin: 2em 0 0;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
`
