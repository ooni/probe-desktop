import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Text, theme } from 'ooni-components'
import { Cross, Tick, NettestTor } from 'ooni-components/dist/icons'
import { useTable, useSortBy } from 'react-table'
import styled from 'styled-components'
import { useClipboard } from 'use-clipboard-copy'

import colorMap from '../../colorMap'
import StatusBox from '../../measurement/StatusBox'
import FormattedMarkdownMessage from '../../FormattedMarkdownMessage'
import { useRawData } from '../../useRawData'

// TODO Should check if it helps to convert these into styled components and
// render them instead of the native <table> <td> <tr> elements
const Styles = styled.div`
  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      text-align: center;

      :last-child {
        border-right: 0;
      }
    }

    th {
      border-right: 1px solid black;
    }
  }
`

const StyledNameCell = styled(Flex)`
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
`

const ClipboardCopiedToast = styled.span`
  width: 100%;
  background-color: ${props => props.theme.colors.black};
  color: white;
  padding: 2px;
  font-size: 12px;
`

// Custom render of cells in the Name column. Copies name to clipboard upon
// click. Shows the message (toast) "Copied!" for 1.5 seconds
const NameCell = ({ children }) => {
  const clipboard = useClipboard({ copiedTimeout: 1500 })

  return (
    <React.Fragment>
      <StyledNameCell
        title={`${children} (Click to copy)`}
        onClick={() => clipboard.copy(children)}
      >
        {!clipboard.copied && children}
        {clipboard.copied && <ClipboardCopiedToast>Copied</ClipboardCopiedToast>}
      </StyledNameCell>

    </React.Fragment>
  )
}

NameCell.propTypes = {
  children: PropTypes.string.isRequired
}

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: ['connectFailure']
      }
    },
    useSortBy
  )

  return (
    /* eslint-disable react/jsx-key */
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {/* Sort order indicator */}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )}
        )}
      </tbody>
    </table>
  )
}

const StyledConnectionStatusCell = styled.div`
  word-break: break-word;
`

const ConnectionStatusCell = ({ cell: { value} }) => {
  let statusIcon = null
  if (value === false) {
    statusIcon = <Text fontWeight='bold' fontSize={1} color={theme.colors.gray7}>N/A</Text>
  } else {
    statusIcon = value === null ? <Tick color={theme.colors.green7} /> : <Cross color={theme.colors.red7} />
  }
  return (
    <StyledConnectionStatusCell>
      {statusIcon} {value}
    </StyledConnectionStatusCell>
  )
}

ConnectionStatusCell.propTypes = {
  cell: PropTypes.object
}

const Tor = ({measurement, isAnomaly, render}) => {
  const testKeys = JSON.parse(measurement.test_keys)

  const {
    or_port_accessible,
    or_port_total,
    or_port_dirauth_accessible,
    or_port_dirauth_total,
    obfs4_accessible,
    obfs4_total,
    dir_port_accessible,
    dir_port_total,
  } = testKeys

  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Circumvention.Tor.Blocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Circumvention.Tor.Reachable.Hero.Title' />
  )

  const statusColumnSort = (rowA, rowB, desc) => {
    const sortMap = {
      na: 0,
      nullValue: 1,
      notNullValue: 2
    }

    const mappedA = rowA.original.handshake === false ? sortMap.na : (
      rowA.original.handshake === null ? sortMap.nullValue : sortMap.notNullValue
    )
    const mappedB = rowB.original.handshake === false ? sortMap.na : (
      rowB.original.handshake === null ? sortMap.nullValue : sortMap.notNullValue
    )

    if (desc) {
      return mappedA - mappedB
    } else {
      return mappedB - mappedA
    }
  }

  const columns = useMemo(() => [
    {
      Header: <FormattedMessage id='TestResults.Details.Circumvention.Tor.Table.Header.Name' />,
      accessor: 'name',
      Cell: ({ cell: { value } }) => ( // eslint-disable-line react/display-name,react/prop-types
        <NameCell>{value}</NameCell>
      )
    },
    {
      Header: <FormattedMessage id='TestResults.Details.Circumvention.Tor.Table.Header.Address' />,
      accessor: 'address'
    },
    {
      Header: <FormattedMessage id='TestResults.Details.Circumvention.Tor.Table.Header.Type' />,
      accessor: 'type'
    },
    {
      Header: <FormattedMessage id='TestResults.Details.Circumvention.Tor.Table.Header.Accessible' />,
      accessor: 'failure',
      collapse: true,
      Cell: ConnectionStatusCell,
      sortType: statusColumnSort
    },
    {
      accessor: 'connectFailure',
    }
  ], [])

  // Targets data is available only in the raw measurement data JSON
  const { rawData } = useRawData()

  const data = useMemo(() => {
    const targets = rawData ? rawData.test_keys.targets : {}
    return (
      Object.keys(targets).map(target => {
        return {
          name: targets[target].target_name || target,
          address: targets[target].target_address,
          type: targets[target].target_protocol,
          failure: targets[target].failure,
        }
      })
    )
  }, [rawData])

  const TorDetails = () => (
    <Box width={1}>
      <Flex my={4}>
        <Text>
          {isAnomaly ? (
            <FormattedMarkdownMessage id='TestResults.Details.Circumvention.Tor.Blocked.Content.Paragraph' />
          ) : (
            <FormattedMarkdownMessage id='TestResults.Details.Circumvention.Tor.Reachable.Content.Paragraph' />
          )}
        </Text>
      </Flex>
      <Flex justifyContent='flex-start' alignItems='center' my={4}>
        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Circumvention.Tor.BrowserBridges.Label.Title' />}
            value={
              <FormattedMessage
                defaultMessage='{bridgesAccessible}/{bridgesTotal} OK'
                id='TestResults.Details.Circumvention.Tor.BrowserBridges.Label.OK'
                values={{
                  bridgesAccessible: obfs4_accessible,
                  bridgesTotal: obfs4_total
                }}
              />
            }
            color='blue5'
          />
        </Box>

        <Box width={1/3}>
          <StatusBox
            label={<FormattedMessage id='TestResults.Details.Circumvention.Tor.DirectoryAuthorities.Label.Title' />}
            value={
              <FormattedMessage
                defaultMessage='{dirAuthAccessible}/{dirAuthTotal} OK'
                id='TestResults.Details.Circumvention.Tor.DirectoryAuthorities.Label.OK'
                values={{
                  dirAuthAccessible: or_port_dirauth_accessible,
                  dirAuthTotal: or_port_dirauth_total
                }}
              />
            }
            color='blue5'
          />
        </Box>
      </Flex>
      <Styles>
        <Table
          columns={columns}
          data={data}
        />
      </Styles>
    </Box>
  )

  return (
    <div>
      {render({
        heroTitle: heroTitle,
        heroBG: isAnomaly ? colorMap.blocked : colorMap.reachable,
        details: <TorDetails />
      })}
    </div>
  )
}

Tor.propTypes = {
  measurement: PropTypes.object,
  isAnomaly: PropTypes.bool,
  render: PropTypes.func
}

export { Tor }

// Metadata for the nettest
export default {
  name: <FormattedMessage id='Test.Tor.Fullname' />,
  icon: <NettestTor />,
  methodology: 'https://ooni.org/nettest/tor'
}
