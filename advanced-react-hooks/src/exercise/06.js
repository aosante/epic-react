// useDebugValue: useMedia
// http://localhost:3000/isolated/exercise/06.js

// useDebugValue can be used to display a label for custom hooks in React DevTools.
// It accepts a formatting function as an optional second parameter.
// e.g. -> useDebugValue(date, date => date.toDateString());

import * as React from 'react'

// const formatDebugValue = ({query, state}) => `\`${query}\` => ${state}`

function useMedia(query, initialState = false) {
  const [state, setState] = React.useState(initialState)
  // 🐨 call React.useDebugValue here.
  // 💰 here's the formatted label I use: `\`${query}\` => ${state}`
  React.useDebugValue(`\`${query}\` => ${state}`)
  // React.useDebugValue({query, state}, formatDebugValue)

  React.useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    function onChange() {
      if (!mounted) {
        return
      }
      setState(Boolean(mql.matches))
    }

    mql.addEventListener('change', () => onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeEventListener(onChange)
    }
  }, [query])

  return state
}

function Box() {
  const isBig = useMedia('(min-width: 1000px)')
  const isMedium = useMedia('(max-width: 999px) and (min-width: 700px)')
  const isSmall = useMedia('(max-width: 699px)')
  const color = isBig ? 'green' : isMedium ? 'yellow' : isSmall ? 'red' : null

  return <div style={{width: 200, height: 200, backgroundColor: color}} />
}

function App() {
  return <Box />
}

export default App
