class PokemonService {

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
  }
}

Vue.filter('capitalize', function (value) {
  return value.charAt(0).toUpperCase() + value.substr(1)
})

var Pokemon = { template: "<div class=pokedex><div class=pokemon v-for=\"p in pokemon\"><img v-bind:src=p.sprite><h2>{{p.name | capitalize}}</h2></div></div><div class=u-text-center><button v-on:click=loadMorePokemon()>Load More Pokemon</button></div>",
	data: function data() {
		return {
			pokemon: []
		};
	},
	ready: function ready() {
		this.loadMorePokemon();
	},

	methods: {
		loadMorePokemon: function loadMorePokemon() {
			var self = this;
			var pokemonService = new PokemonService();

			pokemonService.getPokemon(this.pokemon.length, 12).then(function (pokemon) {
				self.pokemon = self.pokemon.concat(pokemon);
			});
		}
	}
};

const app = new Vue({
  el: 'body',
  components: {
    Pokemon
  }
})