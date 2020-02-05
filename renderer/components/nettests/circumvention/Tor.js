import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, theme } from 'ooni-components'
import { Text } from 'rebass'
import { Cross, Tick, NettestTor } from 'ooni-components/dist/icons'
import { useTable, useSortBy } from 'react-table'
import styled from 'styled-components'
import { useClipboard } from 'use-clipboard-copy'
import { FaClipboardCheck } from 'react-icons/fa'

import colorMap from '../../colorMap'
import StatusBox from '../../measurement/StatusBox'

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

const StyledNameCell = styled.div`
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
`

const ClipboardIcon = styled.div`
  position: absolute;
  right: -3px;
  top: -5px;
`

const ClipboardCopiedToast = styled.span`
  background-color: ${props => props.theme.colors.black};
  color: white;
  padding: 3px;
  font-size: 8px;
`

const NameCell = ({ children }) => {
  const clipboard = useClipboard({ copiedTimeout: 1500 })

  return (
    <React.Fragment>
      <StyledNameCell
        title={`${children} (Click to copy)`}
        onClick={() => clipboard.copy(children)}
      >
        {children}
        <ClipboardIcon>
          {clipboard.copied && <FaClipboardCheck size={10} color={theme.colors.green7} />}
          {/* {clipboard.copied && <ClipboardCopiedToast>Copied</ClipboardCopiedToast>} */}
        </ClipboardIcon>
      </StyledNameCell>

    </React.Fragment>
  )
}

NameCell.propTypes = {
  children: PropTypes.element.isRequired
}

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    flatColumns,
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
            <React.Fragment>
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            </React.Fragment>
          )}
        )}
      </tbody>
    </table>
    /* eslint-enable react/js-key */

  )
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
    targets = {}
  } = testKeys
  const heroTitle = isAnomaly ? (
    <FormattedMessage id='TestResults.Details.Circumvention.Tor.Blocked.Hero.Title' />
  ) : (
    <FormattedMessage id='TestResults.Details.Circumvention.Tor.Reachable.Hero.Title' />
  )

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
      Header: <FormattedMessage id='TestResults.Details.Circumvention.Tor.Table.Header.Connect' />,
      accessor: 'connect',
      collapse: true,
      Cell: ({ cell: { value }, row: { values: { connectFailure } } }) => { // eslint-disable-line react/display-name,react/prop-types
        const statusIcon = value ? <Tick color={theme.colors.green7} /> : <Cross color={theme.colors.red7} />
        return (
          <React.Fragment>
            {statusIcon} {value || connectFailure}
          </React.Fragment>
        )
      }
    },
    {
      Header: <FormattedMessage id='TestResults.Details.Circumvention.Tor.Table.Header.Handshake' />,
      accessor: 'handshake',
      collapse: true,
      Cell: ({ cell: { value }, row: { values: { connectFailure } } }) => { // eslint-disable-line react/display-name,react/prop-types
        const statusIcon = !value ? <Tick color={theme.colors.green7} /> : <Cross color={theme.colors.red7} />
        return (
          <React.Fragment>
            {statusIcon} {'ssl_invalid_certificate'}
          </React.Fragment>
        )
      }
    },
    {
      accessor: 'connectFailure',
    }
  ], [])

  const data = useMemo(() => (
    Object.keys(targets).map(target => {
      const connectStatus = targets[target].tcp_connect[0].status.success
      const connectFailure = targets[target].tcp_connect[0].status.failure
      // TODO: Use the right values for the handshake column. Placeholder now.
      const handshakeStatus = <Cross color={theme.colors.red7} />

      return {
        name: targets[target].target_name || target,
        address: targets[target].target_address,
        type: targets[target].target_protocol,
        connect: connectStatus,
        connectFailure: connectFailure,
        handshake: handshakeStatus
      }
    })
  ), [targets])

  const TorDetails = () => (
    <Box width={1}>
      <Flex my={4}>
        <Text>
          {isAnomaly ? (
            <FormattedMessage id='TestResults.Details.Circumvention.Tor.Blocked.Content.Paragraph' />
          ) : (
            <FormattedMessage id='TestResults.Details.Circumvention.Tor.Reachable.Content.Paragraph' />
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
