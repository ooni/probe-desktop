import React, { useCallback, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import { Flex, Box, Button } from 'ooni-components'
import { ipcRenderer } from 'electron'

import { inputFileRequest, inputFileResponse } from '../../../main/ipcBindings'
import URL from './URL'
import AddUrlButton from './AddUrlButton'

const MzAddUrlButton = React.memo(AddUrlButton)

const listReducer = (list, { type, value }) => {
  switch (type) {
  case 'add':
    return [...list, value]
  case 'remove':
    return list.filter((i, idx) => idx !== value)
  case 'update':
    var updatedList = [...list]
    updatedList[value.idx] = value.url
    return updatedList
  default:
    return list
  }
}

const UrlList = ({ incomingList }) => {
  const router = useRouter()
  const [testList, dispatch] = useReducer(listReducer, incomingList)

  const runTest = useCallback(() => {
    // generate file
    ipcRenderer.send(inputFileRequest, testList.join('\n'))
    // send file to ooniprobe run websites --input-file <file-name>
  }, [testList])

  useEffect(() => {
    ipcRenderer.on(inputFileResponse, (event, args) => {
      router.push(
        {
          pathname: '/dashboard/running',
          query: {
            runningTestGroupName: 'websites',
            inputFile: args.filename
          },
        },
        '/dashboard/running',
        {
          shallow: true
        }
      )
    })
    // return () => {
    //   ipcRenderer.removeAllListeners
    // }
  }, [router])

  const onUpdateUrl = useCallback((idx, url) => {
    dispatch({type: 'update', value: { idx, url }})
  }, [dispatch])

  const onAddUrl = useCallback((idx, url) => {
    dispatch({type: 'add', value: url })
  }, [dispatch])

  const onRemoveUrl = useCallback((idx) => {
    dispatch({type: 'remove', value: idx })
  }, [dispatch])

  return (
    <Flex flexDirection='column'>
      <Box>
        {testList.map((url, idx) => (
          <URL
            key={idx} idx={idx} url={url}
            onUpdate={onUpdateUrl}
            onRemove={onRemoveUrl}
          />
        ))}
      </Box>
      <Box my={4}>
        <MzAddUrlButton onClick={onAddUrl} />
      </Box>
      <Box my={4}>
        <Button onClick={() => runTest()}>Run Test</Button>
      </Box>
      <Flex>
        {testList.map((u) => <Box fontSize='12px' mx={1} key={u}> {u} </Box>)}
      </Flex>
    </Flex>
  )
}

export default UrlList
