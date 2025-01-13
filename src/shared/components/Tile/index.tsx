import React from 'react'
import styled, { css } from 'styled-components'
import { Img } from 'react-image'
import Logo from '~/shared/components/Logo'
import Skeleton from '~/shared/components/Skeleton'
import Rect from '~/shared/components/Rect'
import Link from '~/shared/components/Link'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'
import { TheGraphProject } from '~/services/projects'
import { getProjectImageUrl } from '~/getters'
import { useCurrentChainId } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { useCurrentChainSymbolicName } from '~/utils/chains'
import Summary from './Summary'
import { DataUnionBadge, StreamStatsBadge } from './Badge'

const Image = styled(Img)`
    img& {
        display: block;
        object-fit: cover;
    }
`
const Placeholder = styled.div`
    background-image: linear-gradient(135deg, #0045ff 0%, #7200ee 100%);

    ${Logo} {
        height: auto;
        left: 50%;
        max-width: 32%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
    }
`

type ThumbnailProps = {
    src?: string | null | undefined
    skeletonize?: boolean
    alt?: string | null | undefined
}

const UnstyledThumbnail = ({ src, skeletonize, alt, ...props }: ThumbnailProps) =>
    !!src &&
    (skeletonize ? (
        <Image {...props} as={Skeleton} block />
    ) : (
        <Image
            {...props}
            alt={alt || undefined}
            src={src}
            loader={<Image {...props} as={Skeleton} block />}
            unloader={
                <Image {...props} as={Placeholder}>
                    <Logo color="black" opacity="0.15" />
                </Image>
            }
        />
    ))

const TileThumbnail = styled(UnstyledThumbnail)<ThumbnailProps>`
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
`

type TileProps = {
    suppressHover?: boolean
}

const Tile = styled.div<TileProps>`
    position: relative;

    ${({ suppressHover }) =>
        !suppressHover &&
        css`
            ${TileThumbnail} {
                filter: brightness(100%);
                transition: 240ms ease-out filter;
            }

            :hover ${TileThumbnail} {
                filter: brightness(70%);
                transition-duration: 40ms;
            }
        `}
`

type UnstyledTileImageContainerProps = {
    children?: any
    height?: string
    autoSize?: any
    className?: string
}

const EditButton = styled(Link)`
    border: none;
    border-radius: 100%;
    background-color: white;
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    svg {
        color: ${COLORS.primary};
    }
`

const UnstyledTileImageContainer = ({
    children,
    height,
    autoSize: autoSizeProp,
    ...props
}: UnstyledTileImageContainerProps) => {
    const autoSize = autoSizeProp === true || height != null
    return (
        <div {...props}>
            {children}
            {!!autoSize && <Rect height={height} />}
        </div>
    )
}

const TileImageContainer = styled(
    UnstyledTileImageContainer,
)<UnstyledTileImageContainerProps>`
    border-radius: 16px;
    overflow: hidden;
    position: relative;

    & & {
        border-radius: 0;
        overflow: visible;
    }

    &.no-border-radius {
        border-radius: 0;
    }

    &:hover {
        ${EditButton} {
            opacity: 1;
        }
    }
`

type ImageTileProps = {
    alt?: string | null | undefined
    height?: any
    showDataUnionBadge?: boolean
    src?: string | null | undefined
    noBorderRadius?: boolean
}

const ImageTile = ({
    alt,
    height,
    showDataUnionBadge,
    src,
    noBorderRadius,
    ...props
}: ImageTileProps) => (
    <Tile {...props} suppressHover>
        <TileImageContainer
            autoSize
            height={height}
            className={noBorderRadius ? 'no-border-radius' : ''}
        >
            <TileThumbnail alt={alt || ''} src={src || ''} />
            {!!showDataUnionBadge && <DataUnionBadge top left />}
        </TileImageContainer>
    </Tile>
)

type MarketplaceProductTileProps = {
    product: TheGraphProject
    showDataUnionBadge?: boolean
    showEditButton: boolean
}

function MarketplaceProductTile({
    product,
    showDataUnionBadge,
    showEditButton,
    ...props
}: MarketplaceProductTileProps) {
    const chainId = useCurrentChainId()

    const chainName = useCurrentChainSymbolicName()

    return (
        <Tile {...props}>
            <TileImageContainer>
                <Link to={R.projectOverview(product.id, routeOptions(chainName))}>
                    <TileImageContainer autoSize>
                        <TileThumbnail
                            src={
                                getProjectImageUrl(chainId, {
                                    ...product.metadata,
                                    imageIpfsCid:
                                        product.metadata.imageIpfsCid || undefined,
                                }) || ''
                            }
                        />
                    </TileImageContainer>
                </Link>
                <StreamStatsBadge top left streamIds={product.streams} />
                {!!showDataUnionBadge && (
                    <DataUnionBadge
                        top
                        right
                        linkTo={R.projectOverview(
                            product.id,
                            routeOptions(chainName, undefined, 'stats'),
                        )}
                    />
                )}
                {showEditButton && (
                    <EditButton to={R.projectEdit(product.id, routeOptions(chainName))}>
                        <SvgIcon name={'pencilFull'} />
                    </EditButton>
                )}
            </TileImageContainer>
            <Link to={R.projectOverview(product.id, routeOptions(chainName))}>
                <Summary
                    name={
                        (product.metadata && product.metadata.name) || 'Untitled project'
                    }
                    description={(product.metadata && product.metadata.creator) || ''}
                />
            </Link>
        </Tile>
    )
}

export { ImageTile, MarketplaceProductTile }
