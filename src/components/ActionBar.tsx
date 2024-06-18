import React from 'react'
import styled from 'styled-components'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchBar, { SearchBarWrap } from '~/shared/components/SearchBar'
import { SelectField2 } from '~/marketplace/components/SelectField2'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { TheGraph } from '~/shared/types'
import { ProjectFilter } from '~/types'
import { useWalletAccount } from '~/shared/stores/wallet'
import { Button } from '~/components/Button'
import Faders from '~/assets/Faders.svg'
import {
    ActionBarContainer,
    CreateProjectButton,
    DropdownFilters,
    FiltersBar,
    FiltersWrap,
    MobileFilterText,
    MobileFilterWrap,
    SelectFieldWrap,
} from '~/components/ActionBar.styles'
import { projectTypeFilterModal } from '~/modals/ProjectTypeFilter'
import { RouteOptions, route } from '~/routes'

enum TabOption {
    Any = 'all',
    Owned = 'my',
}

export function isOwnedTabOption(value: unknown) {
    return value === TabOption.Owned
}

function isTabOption(value: unknown): value is TabOption {
    return value === TabOption.Any || value === TabOption.Owned
}

export type Props = {
    filter: ProjectFilter
    onFilterChange?: (filter: ProjectFilter) => void
    onCreateProject: () => void
}

const productTypeOptions = [
    {
        value: TheGraph.ProjectType.Open,
        label: 'Open data',
    },
    {
        value: TheGraph.ProjectType.Paid,
        label: 'Paid data',
    },
    {
        value: TheGraph.ProjectType.DataUnion,
        label: 'Data union',
    },
]

const UnstyledActionBar = ({
    filter,
    onCreateProject,
    onFilterChange,
    ...props
}: Props) => {
    const [params] = useSearchParams()

    const tab = params.get('tab')

    const scope = isTabOption(tab) ? tab : TabOption.Any

    const walletAccount = useWalletAccount()

    const navigate = useNavigate()

    return (
        <ActionBarContainer {...props}>
            <SearchBarWrap>
                <SearchBar
                    value={filter.search}
                    onChange={(search) => {
                        onFilterChange?.({
                            ...filter,
                            search,
                        })
                    }}
                />
            </SearchBarWrap>
            <FiltersBar>
                <FiltersWrap>
                    <Tabs
                        selection={scope}
                        onSelectionChange={(id) => {
                            navigate(
                                route(
                                    'projects',
                                    RouteOptions.from({
                                        tag: id,
                                    }),
                                ),
                            )
                        }}
                    >
                        <Tab id={TabOption.Any}>All projects</Tab>
                        <Tab
                            id={TabOption.Owned}
                            disabled={!walletAccount}
                            title={
                                walletAccount
                                    ? undefined
                                    : 'You need to be connected in to view your projects'
                            }
                        >
                            Your projects
                        </Tab>
                    </Tabs>
                    <DropdownFilters>
                        <span>Filter by</span>
                        <SelectFieldWrap>
                            <SelectField2
                                placeholder="Project type"
                                options={productTypeOptions}
                                value={filter.type}
                                onChange={(type) => {
                                    onFilterChange?.({
                                        ...filter,
                                        type:
                                            type === null
                                                ? undefined
                                                : (type as typeof filter.type),
                                    })
                                }}
                            />
                        </SelectFieldWrap>
                    </DropdownFilters>
                    <MobileFilterWrap>
                        <MobileFilterTrigger
                            onClick={async () => {
                                try {
                                    const type = await projectTypeFilterModal.pop({
                                        value: filter.type,
                                    })

                                    onFilterChange?.({
                                        ...filter,
                                        type,
                                    })
                                } catch (e) {}
                            }}
                            kind="secondary"
                        >
                            <MobileFilterText>
                                Filter{filter.type != null && '*'}
                            </MobileFilterText>
                            <img src={Faders} />
                        </MobileFilterTrigger>
                    </MobileFilterWrap>
                </FiltersWrap>
                <CreateProjectButton
                    kind="primary"
                    type="button"
                    onClick={onCreateProject}
                >
                    Create project
                </CreateProjectButton>
            </FiltersBar>
        </ActionBarContainer>
    )
}

const ActionBar = styled(UnstyledActionBar)``

export default ActionBar

const MobileFilterTrigger = styled(Button)`
    padding: 0 10px !important;
`
