import { zeros } from '../filters';

export default {
  getPokemon(offset, limit) {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
    let baseId = 1891758;
    const baseSpriteUrl =
      'https://static.giantbomb.com/uploads/scale_small/13/135472/';

    return fetch(`${baseUrl}?offset=${offset}&limit=${limit}`)
      .then(response => response.json())
      .then(response => response.results)
      .then(items =>
        items.map((item, idx) => {
          let id = idx + offset + 1;

          baseId += idx;

          if (id < 100) {
            id = zeros(id);
          }

          return {
            id: id,
            name: item.name,
            sprite: `${baseSpriteUrl}${baseId}-${id}${item.name}.png`
          };
        })
      );
  },

  filterByNameOrId(lists, term) {
    return lists.filter(item => {
      return (
        item.name.toLowerCase().indexOf(term) > -1 ||
        item.id.toString().indexOf(term) > -1 ||
        item.id === term
      );
    });
  }
};
