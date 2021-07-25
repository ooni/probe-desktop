import React, { useCallback, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Flex, Box, Button } from 'ooni-components'
import { ipcRenderer } from 'electron'
import { FormattedMessage } from 'react-intl'
// import debounce from 'lodash.debounce'

const inputFileRequest = 'fs.write.request'
const inputFileResponse = 'fs.write.response'

import URL from './URL'
import AddUrlButton from './AddUrlButton'

const MzAddUrlButton = React.memo(AddUrlButton)

const listReducer = (list, { type, value }) => {
  switch (type) {
  case 'add':
    return [...list, { url: value.url }]
  case 'remove':
    return list.filter((i, idx) => idx !== value)
  case 'update':
    var updatedList = [...list]
    var update = {...updatedList[value.idx]}
    if (value.hasError === undefined) {
      update.url = value.url
    } else {
      update.hasError = value.hasError
      update.error = value.error
    }
    updatedList[value.idx] = update
    return updatedList
  default:
    return list
  }
}

const init = (incomingList) => {
  if (incomingList && Array.isArray(incomingList) && incomingList.length > 0) {
    return incomingList
  }
  return [{ url: ''}]
}

const UrlList = ({ incomingList = [] }) => {
  const router = useRouter()
  const [testList, dispatch] = useReducer(listReducer, incomingList, init)

  const runTest = useCallback(() => {
    // generate file
    ipcRenderer.send(inputFileRequest, testList.map(x => x.url).join('\n'))
    // send file to ooniprobe run websites --input-file <file-name>
  }, [testList])

  useEffect(() => {
    // TODO: on(inputFileError)
    ipcRenderer.on(inputFileResponse, (event, args) => {
      router.push(
        {
          pathname: '/dashboard/running',
          query: {
            runningTestGroupName: 'websites',
            inputFile: args.filename
          },
        }
      )
    })
    return () => {
      ipcRenderer.removeAllListeners(inputFileResponse)
    }
  }, [router])

  // const debouncedValidator = useMemo(
  //   () => debounce((idx, value) => {
  //     const error = value === 'alright' ? null : 'invalid url'
  //     setErrors(errors => {
  //       const updatedErrors = {...errors}
  //       updatedErrors[`${idx}`] = error
  //       return updatedErrors
  //     })
  //   }, 500),
  //   []
  // )

  const onUpdateUrl = useCallback((idx, url, hasError, error) => {
    dispatch({type: 'update', value: { idx, url, hasError, error }})
  }, [dispatch])

  const onAddUrl = useCallback((idx, url) => {
    dispatch({type: 'add', value: { url } })
  }, [dispatch])

  const onRemoveUrl = useCallback((idx) => {
    dispatch({type: 'remove', value: idx })
  }, [dispatch])

  const onKeyEnter = useCallback((idx) => {
    // if pressed in the last entry, then add a new entry
    if (idx === testList.length - 1) {
      dispatch({ type: 'add', value: '' })
    }
    // else send focus to the next one
    // .focus() needs refs which aren't passed down well by ooni-components@0.3.x
  }, [testList.length])

  const notReady = testList[0]?.url.length === 0 || testList.reduce((acc, { hasError }) => {
    return acc || (typeof hasError !== 'undefined' ? hasError : true)
  }, false)

  return (
    <Flex flexDirection='column'>
      <Box>
        {testList.map(({ url, error }, idx) => (
          <URL
            key={idx} idx={idx} url={url}
            onUpdate={onUpdateUrl}
            onRemove={testList.length > 1 ? onRemoveUrl : null}
            onKeyEnter={onKeyEnter}
            error={error}
          />
        ))}
      </Box>
      <Box my={4}>
        <MzAddUrlButton onClick={onAddUrl} />
      </Box>
      <Box my={4}>
        <Button onClick={runTest} disabled={notReady} data-testid='button-run-custom-test'>
          <FormattedMessage id='Settings.Websites.CustomURL.Run' />
        </Button>
      </Box>
    </Flex>
  )
}

UrlList.propTypes = {
  incomingList: PropTypes.arrayOf(PropTypes.string)
}

export default UrlList
