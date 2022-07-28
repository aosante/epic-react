// testing with context and a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
import {render as rtlRender, screen} from '@testing-library/react'
// import { render } from '../../test/test-utils'
import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'

// Can also be imported from test/test-utils
const render = (ui, {theme = 'light', ...options}) => {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme={theme} children={children} />
  )
  return rtlRender(ui, {wrapper: Wrapper, ...options})
}

test('renders with the light styles for the light theme', () => {
  render(<EasyButton>Easy</EasyButton>, {theme: 'light'})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('renders with the dark styles for the dark theme', () => {
  render(<EasyButton>Easy</EasyButton>, {theme: 'dark'})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})
