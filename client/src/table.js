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

const Table = ({ columns, data }) => (
  <Wrapper>
    <Head>
      {columns.map(col => (
        <HeadCell css={{ flex: col.flex || '1 0 0%' }}>{col.header}</HeadCell>
      ))}
    </Head>
    {data.map(rowData => (
      <Row>
        {columns.map(col => (
          <RowCell css={{ flex: col.flex || '1 0 0%' }}>
            {col.renderCell(rowData)}
          </RowCell>
        ))}
      </Row>
    ))}
  </Wrapper>
)

export default Table
