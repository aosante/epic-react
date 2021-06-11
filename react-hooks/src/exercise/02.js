// useEffect: persistent state
// 💯 flexible localStorage hook
// http://localhost:3000/isolated/final/02.extra-4.js

import React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  // passing in a function to useState makes it so that it runs only the first time it's rendered.
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) return deserialize(valueInLocalStorage)

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  // this is used to get an object that can be mutated without triggering re renders
  // in order to remove from local storage in case the key name used for LS has changed
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    // ----
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    // ----
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
