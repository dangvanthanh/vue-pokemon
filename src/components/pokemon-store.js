export default {
  local: 'v1::local::pokemon',

  getPokemon () {
    return localStorage.getItem(this.local)
  },

  setPokemon (pokemon) {
    localStorage.setItem(this.local, pokemon)
  }
}
