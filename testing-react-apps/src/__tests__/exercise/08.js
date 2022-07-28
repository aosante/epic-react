// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

// 🐨 create a simple function component that uses the useCounter hook
// and then exposes some UI that our test can interact with to test the
// capabilities of this hook
const UseCounterHookComponent = () => {
  const {count, increment, decrement} = useCounter()
  return (
    <div>
      <div>
        <div>Current count: {count}</div>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
      </div>
    </div>
  )
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
  render(<UseCounterHookComponent />)
  // 🐨 get the elements you need using screen
  const increment = screen.getByRole('button', {name: /increment/i})
  const decrement = screen.getByRole('button', {name: /decrement/i})
  const message = screen.getByText(/current count/i)
  // 🐨 assert on the initial state of the hook
  expect(message).toHaveTextContent('Current count: 0')
  // 🐨 interact with the UI using userEvent and assert on the changes in the UI
  await userEvent.click(increment) // userEvent fires all the events that really happen when the user interacts with the button (not just the click event)
  expect(message).toHaveTextContent('Current count: 1')
  await userEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})

/* eslint no-unused-vars:0 */
