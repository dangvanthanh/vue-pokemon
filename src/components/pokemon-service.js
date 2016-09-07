let PokemonService = {
  getPokemon(offset, limit) {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/'
    const baseSpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

    return Vue.http.get(`${baseUrl}?offset=${offset}&limit=${limit}`)
      .then(response => response.json())
      .then(response => response.results)
      .then(items => items.map((item, idx) => {
        const id = idx + offset + 1

        return {
          id: id,
          name: item.name,
          sprite: `${baseSpriteUrl}${id}.png`
        }
      }))
  }
}

export default PokemonService