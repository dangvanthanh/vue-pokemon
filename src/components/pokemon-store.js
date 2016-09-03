const store = window.localStorage
const pokemonStoreLocal = 'v1::local::pokemon'

let PokemonStore = {
  getPokemon () {
    return store.getItem(pokemonStoreLocal)
  },
  setPokemon (pokemon) {
    store.setItem(pokemonStoreLocal, pokemon)
  }
}

export default PokemonStore
