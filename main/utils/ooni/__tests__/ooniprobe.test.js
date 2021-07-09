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

log.debug = jest.fn((arg1, arg2) => {
  console.log('arg1: ', arg1, ' arg2: ', arg2)
})

describe('Tests Ooniprobe', () => {
  test('testing', async () => {
    const ooni = new Ooniprobe()
    expect(2).toBe(2)
  })
})
