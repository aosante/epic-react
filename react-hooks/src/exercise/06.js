// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

// class ErrorBoundary extends Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   render() {
//     const {error} = this.state, {FallbackComponent, children} = this.props;
//     if(error) return <FallbackComponent error={error} />

//     return children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({status: 'resolved', pokemon})
      },
      error => {
        setState({status: 'rejected', error})
      },
    )
  }, [pokemonName])
  // 🐨 before calling `fetchPokemon`, make sure to update the loading state
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemon name: 'Submit a pokemon'
  //   2. pokemon name but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  switch (status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      return 'Oh oh! Somehting went very wrong'
  }
}
// https://github.com/bvaughn/react-error-boundary#error-recovery

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
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
        {/* onReset gives us an opportunity to re-initialize our state into a good place before attempting to re-render the children. */}
        {/* resetKeys is an array of elements to check each render (if there's currently an error state) */}
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
