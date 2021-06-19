/**
 * @jest-environment jsdom
 */

import React from 'react'
import { cleanup } from '@testing-library/react'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import renderer from 'react-test-renderer'

import Stepper from '../Stepper'

describe('Tests from Stepper component', () => {
  afterEach(() => {
    cleanup()
  })
  test('With active index 0', async () => {
    const component = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Stepper activeIdx={0} />
        </ThemeProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  test('With active index 1', async () => {
    const component = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Stepper activeIdx={1} />
        </ThemeProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  test('With active index 2', async () => {
    const component = renderer
      .create(
        <ThemeProvider theme={theme}>
          <Stepper activeIdx={2} />
        </ThemeProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })
})
