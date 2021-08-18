import {
  hardReset,
  listMeasurements,
  listResults,
  showMeasurement,
} from '../actions'
import log from 'electron-log'
import Sentry from '@sentry/electron'
import { Ooniprobe } from '../utils/ooni/ooniprobe'
import { Readable } from 'stream'
import { resolve } from 'path'

jest.mock('electron-util', () => ({
  is: {
    development: true,
    macos: false,
    linux: true,
    windows: false,
  },
}))

log.debug = jest.fn()
log.info = jest.fn()
log.verbose = jest.fn()
log.error = jest.fn()

Sentry.addBreadcrumb = jest.fn()

jest.mock('../utils/ooni/ooniprobe', () => ({
  Ooniprobe: jest.fn(),
}))

// jest.mock('child_process', () => ({
//   spawn: jest.fn(() => ({
//     stdin: {
//       end: jest.fn(),
//     },
//     on: jest.fn(),
//     stderr: {
//       on: jest.fn(),
//     },
//     stdout: {
//       pipe: jest.fn(() => ({
//         on: jest.fn(),
//       })),
//     },
//   })),
// }))

// jest.mock('../utils/paths', () => ({
//   getHomeDir: jest.fn(() => '/home/user/probe-desktop/ooni_home'),
//   getBinaryPath: jest.fn(() => 'build/probe-cli/linux_amd64'),
// }))

describe('Mocked Ooniprobe', () => {
  test('randomm ooniprobe', async () => {
    const line = {
      fields: {
        total_data_usage_down: 729963.47265625,
        total_data_usage_up: 41480.248046875,
        total_networks: 1,
        total_tests: 13,
        type: 'measurement_item',
      },
      level: 'info',
      timestamp: '2021-08-10T16:43:23.463179849+05:30',
      message: 'result summary',
    }

    Ooniprobe.mockImplementation(() => ({
      on: jest.fn((event, callback) => {
        callback(line)
        return
      }),
      call: jest.fn(() => (new Promise((resolve) => {
        resolve()
      }))),
    }))
    const k = await listMeasurements('11')
    expect(2).toBe(2)
  })
})

// describe('Hard reset', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   test('Hard resetting spawns a child_process with expected args', async () => {
//     const cmdArgs = [
//       '--batch',
//       '--software-name=ooniprobe-desktop',
//       '--software-version=3.5.2',
//       'reset',
//       '--force',
//     ]
//     hardReset()

//     expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
//   })
// })

// describe('List measurements', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   test('Listing measurements spawns a child_process with expected args', async () => {
//     const cmdArgs = [
//       '--batch',
//       '--software-name=ooniprobe-desktop',
//       '--software-version=3.5.2',
//       'list',
//       '11',
//     ]
//     listMeasurements('11')

//     expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
//   })

//   test('Listing measurements', async () => {
//     // const mockOoniInstance = new Ooniprobe()
//     const line = {
//       fields: {
//         total_data_usage_down: 729963.47265625,
//         total_data_usage_up: 41480.248046875,
//         total_networks: 1,
//         total_tests: 13,
//         type: 'measurement_item',
//       },
//       level: 'info',
//       timestamp: '2021-08-10T16:43:23.463179849+05:30',
//       message: 'result summary',
//     }

//     const stringifiedLine = JSON.stringify(line)
//     let mockCount = 0
//     childProcess.spawn.mockImplementationOnce(() => ({
//       stdin: {
//         end: jest.fn(),
//       },
//       on (event, callback) {
//         console.log('event: ', event)
//         if (event === 'exit') {
//           this.once('exit', () => {
//             console.log('exit1 called')
//             callback(null)
//           })
//         }
//       },
//       stderr: {
//         on: jest.fn(),
//       },
//       stdout: new Readable({
//         read() {
//           this.push(stringifiedLine)
//           this.push(null)

//           this.on('exit1', () => {
//             console.log('inside exit1 block')
//             this.emit('exit')
//           })
//         },
//       }),
//     }))

//     // mockOoniInstance.emit('data', {'grr': 'grr'})
//     const k = await listMeasurements('11')

//     console.log('k: ', k)
//     expect(2).toBe(2)
//     // expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
//   })
// })

// describe('List Results', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   test('listResults spawns a child_process with expected args', async () => {
//     const cmdArgs = [
//       '--batch',
//       '--software-name=ooniprobe-desktop',
//       '--software-version=3.5.2',
//       'list',
//     ]
//     listResults('list')

//     expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
//   })
// })

// describe('Show measurements', () => {
//   beforeEach(() => {
//     jest.clearAllMocks()
//   })

//   test('showMeasurements spawns a child_process with expected args', async () => {
//     const cmdArgs = [
//       '--batch',
//       '--software-name=ooniprobe-desktop',
//       '--software-version=3.5.2',
//       'show',
//       'FKS 43',
//     ]
//     showMeasurement('FKS 43')

//     expect(childProcess.spawn.mock.calls[0][1]).toEqual(cmdArgs)
//   })
// })
