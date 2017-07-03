import _ from 'lodash'
import React from 'react'
import { withState } from 'recompose'
import glamorous, { Div } from 'glamorous'

const Wrapper = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
})

const rowStyle = { display: 'flex' }
const Head = glamorous.div(rowStyle)
const Row = glamorous.div(rowStyle)

const cellStyle = { height: '30px' }
const HeadCell = glamorous.div(cellStyle, {
  fontWeight: 'bold',
  cursor: 'pointer',
})
const RowCell = glamorous.div(cellStyle)

const SortDir = {
  ASC: 1,
  DESC: -1,
}

const getValue = ({ col, rowData }) => {
  if (col.key) {
    return rowData[col.key]
  }
  if (typeof col.getValue === 'function') {
    return col.getValue(rowData)
  }

  throw new Error('Must define either `key` or `getValue` for each column')
}

const Table = ({
  columns,
  data,
  sortColIdx,
  sortDir,
  setSortColIdx,
  setSortDir,
}) => {
  const sortCol = columns[sortColIdx]
  let sortedRows = _.sortBy(data, rowData => {
    let value = getValue({ col: sortCol, rowData })
    if (typeof value === 'string') {
      value = value.toLowerCase()
    }
    return value
  })
  if (sortDir === SortDir.DESC) {
    sortedRows = _.reverse(sortedRows)
  }

  return (
    <Wrapper>
      <Head>
        {columns.map((col, idx) => {
          const sortIndicator = sortDir === SortDir.ASC
            ? <span> ⇣</span>
            : <span> ⇡</span>
          return (
            <HeadCell
              css={{ flex: col.flex || '1 0 0%' }}
              key={col.header}
              onClick={() => {
                if (idx !== sortColIdx) {
                  setSortColIdx(idx)
                } else {
                  setSortDir(
                    sortDir === SortDir.ASC ? SortDir.DESC : SortDir.ASC
                  )
                }
              }}
            >
              {col.header}{idx === sortColIdx ? sortIndicator : ''}
            </HeadCell>
          )
        })}
      </Head>
      {sortedRows.map((rowData, rowIdx) => (
        <Row key={rowIdx}>
          {columns.map(col => {
            const value = getValue({ col, rowData })
            return (
              <RowCell css={{ flex: col.flex || '1 0 0%' }} key={col.header}>
                {col.renderCell ? col.renderCell(value, rowData) : value}
              </RowCell>
            )
          })}
        </Row>
      ))}
    </Wrapper>
  )
}

export default _.flowRight(
  withState('sortColIdx', 'setSortColIdx', 0),
  withState('sortDir', 'setSortDir', SortDir.ASC)
)(Table)
