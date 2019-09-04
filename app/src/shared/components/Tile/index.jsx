// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import useHover from '$shared/hooks/useHover'
import FallbackImage from '$shared/components/FallbackImage'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'

import * as subcomponents from './subcomponents'
import styles from './tile.pcss'

type Props = {
    children: Node,
    image?: ?Node,
    imageUrl?: string,
    dropdownActions?: Array<typeof DropdownActions.Item> | Node,
    onMenuToggle?: (boolean) => void,
    className?: string,
}

const Tile = ({
    imageUrl,
    image,
    children,
    dropdownActions,
    onMenuToggle,
    className,
}: Props) => {
    const [hoveredRef, isHovered] = useHover()

    return (
        <div className={cx(styles.tile, className)} ref={hoveredRef}>
            {isHovered && dropdownActions &&
                <DropdownActions
                    className={styles.menu}
                    title={<Meatball alt="Select" white />}
                    direction="down"
                    noCaret
                    onMenuToggle={onMenuToggle}
                    menuProps={{
                        modifiers: {
                            offset: {
                                // Make menu aligned to the right.
                                // See https://popper.js.org/popper-documentation.html#modifiers..offset
                                offset: '-100%p + 100%',
                            },
                        },
                    }}
                >
                    {dropdownActions}
                </DropdownActions>
            }
            {image || (
                <FallbackImage src={imageUrl || ''} alt="Tile" className={styles.image} />
            )}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}

// Add subcomonents as static properties
Object.assign(Tile, {
    ...subcomponents,
})

export default Tile
