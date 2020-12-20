// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from 'react'
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

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (!pokemonName) return
    setPokemon(null)
    setError(null)
    fetchPokemon(pokemonName).then(
      pokemon => setPokemon(pokemon),
      error => setError(error),
    )
  }, [pokemonName])
  // 🐨 before calling `fetchPokemon`, make sure to update the loading state
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemon name: 'Submit a pokemon'
  //   2. pokemon name but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  if (error) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (!pokemonName) {
    return 'Submit a pokemon'
  } else if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
