import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import electron from 'electron'
import Raven from 'raven-js'
const debug = require('debug')('ooniprobe-desktop.renderer.pages.raw')

import { Container, Flex } from 'ooni-components'

import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import LoadingOverlay from '../../components/LoadingOverlay'
import JsonViewer from '../../components/rawData/JsonViewer'

const RawMeasurementData = () => {
  const router = useRouter()
  const { msmtID } = router.query
  const [rawData, setRawData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const remote = electron.remote
    const { showMeasurement } = remote.require('./actions')

    showMeasurement(msmtID).then(measurement => {
      setRawData(measurement)
      setLoading(false)
    }).catch(err => {
      Raven.captureException(err, {extra: {scope: 'renderer.showMeasurement'}})
      debug('error triggered', err)
      setLoading(false)
      setError(error)
    })
  }, [msmtID])

  return (
    <Layout>
      {loading && <LoadingOverlay loading={loading} />}

      {rawData && (
        <Container>
          <Flex my={3}>
            <JsonViewer src={rawData} />
          </Flex>
        </Container>
      )}
    </Layout>
  )
}

// export const getServerSideProps = async ({ query }) => {
//   const electron = require('electron')
//   console.log(electron)
//   return {
//     props: { rawData: null }
//   }
//   const { showMeasurement } = require('electron').remote.require('./actions')
//   const { msmtID } = query
//   try {
//     const rawData = await showMeasurement(msmtID)
//     console.log(`rawData in getServerSideProps:`)
//     console.log(rawData)
//     return {
//       props: { rawData }
//     }
//   } catch (err) {
//     Raven.captureException(err, {extra: {scope: 'renderer.showMeasurement'}})
//     debug('error triggered', err)
//     return {
//       props: {
//         error: err
//       }
//     }
//   }
// }

export default RawMeasurementData
