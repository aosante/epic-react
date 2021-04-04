// useCallback: custom hooks
// 💯 use useCallback to empower the user to customize memoization
// http://localhost:3000/isolated/final/02.extra-1.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

/* 
    This one's a bit tricky, and I'm going to be intentionally vague here to give
    you a bit of a challenge, but consider the scenario where we fetch a pokemon,
    and before the request finishes, we change our mind and navigate to a different
    page (or uncheck the mount checkbox). In that case, the component would get
    removed from the page ("unmounted") and when the request finally does complete,
    it will call `dispatch`, but because the component has been removed from the
    page, we'll get a warning from react.
  */

/*
    The best solution for this problem would be to cancel the request
    but even then, we'd have to handle the error and prevent the `dispatch` from
    being called for the rejected promise. This is the problem that this next custoom hook solves for us.
  */
function useSafeDisptach(dispatch) {
  /*
    Note that useRef() is useful for more than the ref attribute. 
    It’s handy for keeping any mutable value around similar to how you’d use instance fields in classes.
    I this case, we are using it to determine if the component has unmounted or not.
  */
  const mountedRef = React.useRef(false)

  /* 
    In this case, useLayoutEffect allows us to not have to wait for the browser
    to paint the screen. So the function is called as soon as the component is mounted without waiting for painting.
    And the cleanup function is also executed when unmounted without waiting foor anything either.
  */
  React.useLayoutEffect(() => {
    mountedRef.current = true
    return () => (mountedRef.current = false)
  }, [])

  return React.useCallback(
    (...args) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

function asyncReducer(_, action) {
  const {data, type, error} = action
  switch (type) {
    case 'pending': {
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      return {status: 'resolved', data: data, error: null}
    }
    case 'rejected': {
      return {status: 'rejected', data: null, error: error}
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`)
    }
  }
}

function useAsync(initialState) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  })

  const dispatch = useSafeDisptach(unsafeDispatch)

  /*
   With this run function being part of (and returned by) the useAsync custom hook
   the user of the hook does not have to worry about memoizing the async fetch function themselves
   */
  const run = React.useCallback(
    promise => {
      dispatch({type: 'pending'})
      promise.then(
        data => {
          dispatch({type: 'resolved', data})
        },
        error => {
          dispatch({type: 'rejected', error})
        },
      )
      /*
      There are no dependencies needed here, as the run function itself will be passed in 
      as a dependency to the useEffect called inside the component that uses this useAsync hook
      making sure that it runs if the memoized callback ever changes, OR if the other dependencies passed in
      to the useEffect change too.
      */
    },
    [dispatch],
  )

  return {
    ...state,
    run,
  }
}

function PokemonInfo({pokemonName}) {
  const state = useAsync({status: pokemonName ? 'pending' : 'idle'})

  const {data: pokemon, status, error, run} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
