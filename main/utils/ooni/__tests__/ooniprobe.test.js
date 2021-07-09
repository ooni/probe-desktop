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
