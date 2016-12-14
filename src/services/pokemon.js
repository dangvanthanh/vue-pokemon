export default {
  getPokemon (offset, limit) {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/'
    const baseSpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

    return fetch(`${baseUrl}?offset=${offset}&limit=${limit}`)
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
  },

  filterByNameOrId (lists, term) {
    return lists.filter((item) => {
      return item.name.toLowerCase().indexOf(term) > -1 || item.id.toString().indexOf(term) > -1 || item.id === term
    })
  }
}
