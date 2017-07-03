import React from 'react'
import glamorous, { Div } from 'glamorous'

const Wrapper = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
})

const rowStyle = { display: 'flex' }
const Head = glamorous.div(rowStyle)
const Row = glamorous.div(rowStyle)

const cellStyle = { height: '30px' }
const HeadCell = glamorous.div(cellStyle, { fontWeight: 'bold' })
const RowCell = glamorous.div(cellStyle)

const getValue = ({ col, rowData }) => {
  if (col.key) {
    return rowData[col.key]
  }
  if (typeof col.getValue === 'function') {
    return col.getValue(rowData)
  }

  throw new Error('Must define either `key` or `getValue` for each column')
}

const Table = ({ columns, data }) => {
  return (
    <Wrapper>
      <Head>
        {columns.map(col => (
          <HeadCell css={{ flex: col.flex || '1 0 0%' }} key={col.header}>
            {col.header}
          </HeadCell>
        ))}
      </Head>
      {data.map((rowData, rowIdx) => (
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

export default Table
