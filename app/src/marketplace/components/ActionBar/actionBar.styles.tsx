import styled from 'styled-components'
import { COLORS, DESKTOP, LG, MEDIUM, TABLET } from '$shared/utils/styled'
import Button from '$shared/components/Button'

export const SearchBarWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 60px 0 80px;
  > * {
    max-width: 770px;
    margin: 0 24px;
    @media(${TABLET}) {
      margin: 0 72px;
    }
    @media(${DESKTOP}) {
      margin: 0;
    }
  }
`

export const FiltersBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  margin-bottom: 30px;

  @media (${DESKTOP}) {
    padding: 0 5em;
  }
`

export const FiltersWrap = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  @media(${TABLET}) {
    width: auto;
    align-items: unset;
  }
`

export const DropdownFilters = styled.div`
  display: none;
  align-items: center;
  margin-left: 40px;
  span {
    color: ${COLORS.primary};
    font-weight: ${MEDIUM};
    margin-right: 15px;
    font-size: 14px;
  }
  
  @media(${DESKTOP}) {
    display: flex;
  }
  
`

export const SelectFieldWrap = styled.div`
    margin-right: 10px;
`

export const MobileFilterWrap = styled.div`
  display: block;
  color: ${COLORS.primary};
  margin-left: 20px;
  
  @media(${DESKTOP}) {
    display: none;
  }
`

export const MobileFilterText = styled.span`
  margin-right: 15px;
  display: none;
  @media(${TABLET}) {
    display: inline;
  }
`

export const CreateProjectButton = styled(Button)`
  display: none !important;
  @media(${TABLET}) {
    display: inherit !important;
  }
`