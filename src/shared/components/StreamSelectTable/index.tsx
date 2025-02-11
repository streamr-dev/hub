import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import LoadMore from '~/marketplace/components/LoadMore'
import { IndexerStream, TheGraphStream } from '~/services/streams'
import Checkbox from '~/shared/components/Checkbox'
import { COLORS, DESKTOP, MEDIUM, REGULAR, TABLET } from '~/shared/utils/styled'
import { truncateStreamName } from '~/shared/utils/text'
import { useCurrentChainKey } from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'

const ROW_HEIGHT = 88

const Row = styled.div`
    align-items: center;
    padding-left: 24px;
`

const TableGrid = styled(Row)`
    display: grid;
    gap: 8px;
    grid-template-columns: minmax(0, 1fr) 18px;

    @media ${TABLET} {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 18px;
    }

    @media ${DESKTOP} {
        grid-template-columns: minmax(0, 3fr) repeat(5, minmax(0, 1fr)) 18px;
    }
`

const Table = styled.div`
    overflow: auto;
`

const TableHeader = styled(TableGrid)`
    font-weight: ${MEDIUM};
    height: ${ROW_HEIGHT}px;
    font-size: 15px;
    line-height: 26px;
    color: ${COLORS.primaryLight};
    border-bottom: 1px solid #f8f8f8;
    position: sticky;
    top: 0;
    z-index: 1;
`

type TableRowsProps = {
    rowCount: number
}

const TableRows = styled.div<TableRowsProps>`
    height: ${({ rowCount }) => Math.max(rowCount, 1) * (ROW_HEIGHT + 1)}px;
`

const TableRow = styled(TableGrid)`
    font-size: 16px;
    line-height: 26px;
    height: ${ROW_HEIGHT}px;
    max-height: ${ROW_HEIGHT}px;
    box-sizing: content-box;
    color: ${COLORS.primaryLight};

    &:not(:last-child) {
        border-bottom: 1px solid #f8f8f8;
    }
`

type GridCellProps = {
    onlyDesktop?: boolean
    onlyTablet?: boolean
    notOnTablet?: boolean
    flex?: boolean
}

const GridCell = styled.span<GridCellProps>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    ${({ onlyDesktop }) =>
        onlyDesktop &&
        css`
            display: none;

            @media ${DESKTOP} {
                display: block;
            }
        `}

    ${({ onlyTablet }) =>
        onlyTablet &&
        css`
            display: none;

            @media ${TABLET} {
                display: block;
            }

            @media ${DESKTOP} {
                display: none;
            }
        `}

  ${({ notOnTablet }) =>
        notOnTablet &&
        css`
            display: block;

            @media ${TABLET} {
                display: none;
            }

            @media ${DESKTOP} {
                display: block;
            }
        `}

  ${({ flex }) =>
        flex
            ? css`
                  display: flex;
              `
            : ''}
`

const NoStreams = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    line-height: 18px;
    color: ${COLORS.primaryLight};
`

const StreamDetails = styled(Link)`
    font-size: 16px;
    line-height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;

    &:active,
    &:link,
    &:visited,
    &:hover {
        color: ${COLORS.primaryLight};
    }
`

const StreamId = styled(GridCell)`
    font-weight: ${MEDIUM};
`

const StreamDescription = styled(GridCell)`
    font-weight: ${REGULAR};
`

type Props = {
    streams: Array<TheGraphStream>
    streamStats: Record<string, IndexerStream>
    loadMore?: () => void | Promise<void>
    hasMoreResults?: boolean
    onSelectionChange: (selectedStreams: string[]) => void
    selected: string[]
    disabled?: boolean
}

export const StreamSelectTable: FunctionComponent<Props> = ({
    streams,
    streamStats,
    loadMore,
    hasMoreResults,
    onSelectionChange,
    selected,
    disabled = false,
}: Props) => {
    const [selectedStreams, setSelectedStreams] = useState<Record<string, boolean>>({})
    const [allSelected, setAllSelected] = useState<boolean>(false)

    const emitSelectedStreamsChange = useCallback(
        (streams: Record<string, boolean>) => {
            if (onSelectionChange) {
                const selectedStreamsArray = Object.entries(streams)
                    .filter(([, isSelected]) => isSelected)
                    .map(([streamId]) => streamId)
                onSelectionChange(selectedStreamsArray)
            }
        },
        [onSelectionChange],
    )

    const handleSelectChange = useCallback(
        (streamId: string) => {
            const newSelectedStreams = {
                ...selectedStreams,
                [streamId]: !selectedStreams[streamId],
            }
            setSelectedStreams(newSelectedStreams)
            emitSelectedStreamsChange(newSelectedStreams)
        },
        [selectedStreams, emitSelectedStreamsChange],
    )

    const handleSelectAllChange = useCallback(() => {
        const shouldAllBeChecked = !allSelected
        const newSelectedStreams: Record<string, boolean> = {}
        streams.forEach((stream) => {
            newSelectedStreams[stream.id] = shouldAllBeChecked
        })
        setSelectedStreams(newSelectedStreams)
        setAllSelected(shouldAllBeChecked)
        emitSelectedStreamsChange(newSelectedStreams)
    }, [allSelected, streams, emitSelectedStreamsChange])

    useEffect(() => {
        const selectedStreamsArray = Object.entries(selectedStreams)
            .filter(([, isSelected]) => isSelected)
            .map(([streamId]) => streamId)
        if (
            streams.length > 0 &&
            selectedStreamsArray.length === streams.length &&
            !allSelected
        ) {
            setAllSelected(true)
        }
        if (selectedStreamsArray.length !== streams.length && allSelected) {
            setAllSelected(false)
        }
    }, [selectedStreams, streams, allSelected])

    useEffect(() => {
        if (selected && selected.length) {
            const newSelectedStreams: Record<string, boolean> = {}
            selected.forEach((streamId) => {
                newSelectedStreams[streamId] = true
            })
            setSelectedStreams(newSelectedStreams)
        }
    }, [selected])

    const chainKey = useCurrentChainKey()

    return (
        <div>
            <Table>
                <TableHeader>
                    <GridCell>Stream ID</GridCell>
                    <GridCell onlyTablet>Description</GridCell>
                    <GridCell onlyDesktop>Live peers</GridCell>
                    <GridCell onlyDesktop>Msg/s</GridCell>
                    <GridCell onlyDesktop>Access</GridCell>
                    <GridCell onlyDesktop>Publishers</GridCell>
                    <GridCell onlyDesktop>Subscribers</GridCell>
                    <GridCell flex={true}>
                        <Checkbox
                            value={allSelected}
                            onChange={handleSelectAllChange}
                            disabled={disabled}
                        />
                    </GridCell>
                </TableHeader>
                <TableRows rowCount={streams.length}>
                    {streams.map((s) => {
                        const stats = streamStats ? streamStats[s.id] : null
                        return (
                            <TableRow key={s.id}>
                                <StreamDetails
                                    to={R.stream(s.id, routeOptions(chainKey))}
                                >
                                    <StreamId title={s.id}>
                                        {truncateStreamName(s.id, 40)}
                                    </StreamId>
                                    {'\n'}
                                    <StreamDescription notOnTablet>
                                        {s.metadata?.description ?? ''}
                                    </StreamDescription>
                                </StreamDetails>
                                <GridCell onlyTablet>
                                    {s.metadata?.description ?? ''}
                                </GridCell>
                                <GridCell onlyDesktop>{stats?.peerCount ?? '-'}</GridCell>
                                <GridCell onlyDesktop>
                                    {stats?.messagesPerSecond ?? '-'}
                                </GridCell>
                                <GridCell onlyDesktop>
                                    {stats == null
                                        ? '-'
                                        : stats.subscriberCount == null
                                        ? 'Public'
                                        : 'Private'}
                                </GridCell>
                                <GridCell onlyDesktop>
                                    {stats == null
                                        ? '-'
                                        : stats.publisherCount == null
                                        ? '∞'
                                        : stats.publisherCount}
                                </GridCell>
                                <GridCell onlyDesktop>
                                    {stats == null
                                        ? '-'
                                        : stats.subscriberCount == null
                                        ? '∞'
                                        : stats.subscriberCount}
                                </GridCell>
                                <GridCell flex={true}>
                                    <Checkbox
                                        value={selectedStreams[s.id]}
                                        onChange={() => {
                                            handleSelectChange(s.id)
                                        }}
                                        disabled={disabled}
                                    />
                                </GridCell>
                            </TableRow>
                        )
                    })}
                    {streams.length === 0 && (
                        <NoStreams>No streams that match your query</NoStreams>
                    )}
                </TableRows>
            </Table>
            {loadMore != null && (
                <LoadMore
                    hasMoreSearchResults={!!hasMoreResults}
                    onClick={loadMore}
                    preserveSpace={false}
                />
            )}
        </div>
    )
}
