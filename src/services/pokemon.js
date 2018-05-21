import { zeros } from '../filters';

export default {
  getPokemon(offset, limit) {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const baseSpriteUrl =
      'https://raw.githubusercontent.com/dangvanthanh/vue-pokemon/master/static/images/';

    return fetch(`${baseUrl}?offset=${offset}&limit=${limit}`)
      .then(response => response.json())
      .then(response => response.results)
      .then(items =>
        items.map((item, idx) => {
          let id = idx + offset + 1;

          if (id < 100) {
            id = zeros(id);
          }

          return {
            id: id,
            name: item.name,
            sprite: `${baseSpriteUrl}/${id}.png`
          };
        })
      );
  },

  filterByNameOrId(lists, term) {
    return lists.filter(item => {
      return (
        item.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
        item.id.toString().indexOf(term.toLowerCase()) > -1 ||
        item.id === term
      );
    });
  }
};
