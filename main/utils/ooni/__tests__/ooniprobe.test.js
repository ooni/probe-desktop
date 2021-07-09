import { Ooniprobe } from '../ooniprobe'
import log from 'electron-log'

jest.mock('electron-util', () => ({
  is: {
    development: true,
    macos: false,
    linux: true,
    windows: false,
  },
}))

log.debug = jest.fn()

describe('Test the initialization of Ooniprobe instances', () => {
  test('Ooniprobe instances are initialized in an expected way', async () => {
    const ooniInstance = new Ooniprobe()
    expect(ooniInstance._binaryPath).toBeTruthy()
    expect(ooniInstance._binaryPath).toMatch(/amd64/i)
    expect(ooniInstance.ooni).toBeNull()

    // Checking if the kill and call functions are
    // defined in the initialized Ooniprobe instance
    expect(ooniInstance.kill).toBeTruthy()
    expect(ooniInstance.call).toBeTruthy()
  })
})

describe('Tests if killing Ooniprobe instances work as expected', () => {
  test('Killing Ooniprobe instance with .ooni property calls this.ooni.stdin.end function', async () => {
    const ooniInstance = new Ooniprobe()
    ooniInstance.ooni = {
      stdin: {
        end: jest.fn()
      }
    }
    ooniInstance.kill()
    expect(ooniInstance.ooni.stdin.end).toHaveBeenCalledTimes(1)
  })

  test('Killing Ooniprobe instance with .ooni as null throws error', async () => {
    const ooniInstance = new Ooniprobe()
    const errorFunc = () => {
      try {
        ooniInstance.kill()
      } catch(err) {
        throw Error(err)
      }
    }
    expect(errorFunc).toThrow('cannot kill an unstarted process')
  })
})
