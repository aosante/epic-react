// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import Login from '../../components/login'

const buildLoginForm = () => ({ password: faker.internet.password(), username: faker.internet.userName() })

test('submitting the form calls onSubmit with username and password', async () => {
  // const getRandomPassword = () => faker.internet.password()
  // const getRandomUsername = () => faker.internet.userName()
  
  // const password = getRandomPassword()
  // const username = getRandomUsername()

  const { username, password } = buildLoginForm()

  // 🐨 create a variable called "submittedData" and a handleSubmit function that
  // accepts the data and assigns submittedData to the data that was submitted
  // let submittedData
  // const handleSubmit = data => (submittedData = data)

  // Extra credit-1
  const handleSubmit = jest.fn()
  //
  // 🐨 render the login with your handleSubmit function as the onSubmit prop
  render(<Login onSubmit={handleSubmit} />)
  // 🐨 get the username and password fields via `getByLabelText`
  const usernameField = screen.getByLabelText(/username/i)
  const passwordField = screen.getByLabelText(/password/i)
  // 🐨 use `await userEvent.type...` to change the username and password fields to
  //    whatever you want
  await userEvent.type(usernameField, username)
  await userEvent.type(passwordField, password)
  // 🐨 click on the button with the text "Submit"
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  // assert that submittedData is correct
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue
  // expect(submittedData).toEqual({
  //   username,
  //   password,
  // })
  expect(handleSubmit).toHaveBeenCalledWith({ username, password })
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
