import React, { useState } from 'react'
import styled from 'styled-components'
import SearchBar from '~/shared/components/SearchBar'
import SelectField2 from '~/marketplace/components/SelectField2'
import MobileFilter from '~/shared/components/MobileFilter'
import Tabs, { Tab } from '~/shared/components/Tabs'
import { TheGraph } from '~/shared/types'
import { ProjectFilter } from '~/types'
import { useWalletAccount } from '~/shared/stores/wallet'
import {
    ActionBarContainer,
    CreateProjectButton,
    DropdownFilters,
    FiltersBar,
    FiltersWrap,
    MobileFilterText,
    MobileFilterWrap,
    SearchBarWrap,
    SelectFieldWrap,
} from './ActionBar.styles'

enum ProjectsScope {
    Any = 'any',
    Owned = 'owned',
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
    const [scope, setScope] = useState<ProjectsScope>(ProjectsScope.Any)

    const walletAccount = useWalletAccount()

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
                            onFilterChange?.({
                                ...filter,
                                owner:
                                    id === ProjectsScope.Owned
                                        ? walletAccount || undefined
                                        : undefined,
                            })

                            setScope(id as ProjectsScope)
                        }}
                    >
                        <Tab id={ProjectsScope.Any}>All projects</Tab>
                        <Tab
                            id={ProjectsScope.Owned}
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
                                placeholder={'Project type'}
                                options={productTypeOptions}
                                value={filter.type}
                                onChange={(type) => {
                                    onFilterChange?.({
                                        ...filter,
                                        type: type as typeof filter.type,
                                    })
                                }}
                            />
                        </SelectFieldWrap>
                    </DropdownFilters>
                    <MobileFilterWrap>
                        <MobileFilter
                            filters={[
                                {
                                    label: 'Project type',
                                    value: 'type',
                                    options: productTypeOptions,
                                },
                            ]}
                            onChange={({ type }) => {
                                onFilterChange?.({
                                    ...filter,
                                    type: type as typeof filter.type,
                                })
                            }}
                            selectedFilters={{ type: filter.type || '' }}
                        >
                            <MobileFilterText>Filter</MobileFilterText>
                        </MobileFilter>
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