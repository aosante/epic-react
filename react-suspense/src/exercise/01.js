// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
// 🐨 you'll also need to get the fetchPokemon function from ../pokemon:
import {
  fetchPokemon,
  PokemonDataView,
  PokemonErrorBoundary,
  PokemonInfoFallback,
} from '../pokemon'
import {createResource} from '../utils'
// 💰 use it like this: fetchPokemon(pokemonName).then(handleSuccess, handleFailure)

// const createResource = promise => {
//   let status = 'pending'
//   let result = promise.then(
//     resolved => {
//       status = 'success'
//       result = resolved
//     },
//     rejected => {
//       status = 'error'
//       result = rejected
//     },
//   )
//   return {
//     read() {
//       if (status === 'pending') throw result
//       if (status === 'error') throw result
//       if (status === 'success') return result
//       throw new Error('This should be impossible')
//     },
//   }
// }

// 🐨 create a variable called "pokemon" (using let)
// let pokemon, error

// 💣 delete this now...
// const pokemon = {
//   name: 'TODO',
//   number: 'TODO',
//   attacks: {
//     special: [{name: 'TODO', type: 'TODO', damage: 'TODO'}],
//   },
//   fetchedAt: 'TODO',
// }

// We don't need the app to be mounted to know that we want to fetch the pokemon
// named "pikachu" so we can go ahead and do that right here.
// 🐨 assign a pokemonPromise variable to a call to fetchPokemon('pikachu')
// const pokemonPromise = fetchPokemon('pikachu')
//   .then(result => (pokemon = result))
//   .catch(err => (error = err))

let pokemonResource = createResource(fetchPokemon('pikachu'))

function PokemonInfo() {
  // if (error) throw error
  // if (!pokemon) throw pokemonPromise
  const pokemon = pokemonResource.read()

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
  // if the code gets it this far, then the pokemon variable is defined and
  // rendering can continue!
}

function App() {
  return (
    <div className="pokemon-info-app">
      <div className="pokemon-info">
        <PokemonErrorBoundary>
          <React.Suspense fallback={<PokemonInfoFallback name="Pikachu" />}>
            <PokemonInfo />
          </React.Suspense>
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
