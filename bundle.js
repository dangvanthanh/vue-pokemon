var PokemonService = function PokemonService () {};

PokemonService.prototype.getPokemon = function getPokemon (offset, limit) {
  var baseUrl = 'https://pokeapi.co/api/v2/pokemon/'
  var baseSpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

  return fetch((baseUrl + "?offset=" + offset + "&limit=" + limit))
    .then(function (response) { return response.json(); })
			.then(function (response) { return response.results; })
    .then(function (items) { return items.map(function (item, idx) {
      var id = idx + offset + 1

      return {
        id: id,
        name: item.name,
        sprite: ("" + baseSpriteUrl + id + ".png")
      }
    }); })
  };

Vue.filter('capitalize', function (value) {
  return value.charAt(0).toUpperCase() + value.substr(1)
})

Vue.filter('zeros', function (number) {
	return ('00' + number).slice(-3)
})

var Pokemon = { template: "<div class=pokemons><div class=search><input type=text name=name class=search__textfield placeholder=\"Search by name or number\" v-model=pokemonTerm v-on:keyup=searchPokemon></div><div class=pokemon v-for=\"p in pokemon\"><figure class=pokemon__sprite v-bind:style=\"{ backgroundColor: p.swatches }\"><img v-bind:src=p.sprite></figure><div class=pokemon__content><p class=pokemon__id>{{ p.id | zeros }}<h2 class=pokemon__name>{{ p.name | capitalize }}</h2></div></div></div>",
  data: function data () {
    return {
			pokemon: [],
			pokemonTemp: [],
			pokemonTerm: ''
    }
  },
	ready: function ready () {
		var self = this

		if (!!localStorage.getItem('v1::local::pokemon')) {
			var pokemon = JSON.parse(localStorage.getItem('v1::local::pokemon'))
			self.pokemon = pokemon
			self.pokemonTemp = pokemon
		} else {
			self.getAllPokemon()
		}
	},
  methods: {
		getAllPokemon: function getAllPokemon () {
			var self = this
			var pokemonService = new PokemonService()
			var currentPokemon = 721

			pokemonService
				.getPokemon(0, currentPokemon)
				.then(self.getSwatches)
				.then(self.updatePokemonSwatches)
		},
		updatePokemonSwatches: function updatePokemonSwatches (pokemon) {
			this.pokemon = pokemon
			this.pokemonTemp = pokemon
			localStorage.setItem('v1::local::pokemon', JSON.stringify(pokemon))
		},
		getSwatches: function getSwatches (pokemon) {
			var self = this

			return new Promise(function (resolve, reject) {
				var swatchesList = [];
				var pokemonData = pokemon
				var pokemonDataLength = pokemonData.length

				pokemonData.map(function (p, i) {
					var img = new Image()

					img.onload = function () {
						var vibrant = new Vibrant(img)
						var swatches = vibrant.swatches()

						for (var swatch in swatches) {
							if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
								pokemonData[i].swatches = swatches[swatch].getHex()
								break;
							}
						}

						pokemonData[i].sprite = self.getDataUriImage(img)

						pokemonDataLength--

						if (!pokemonDataLength) {
							resolve(pokemonData);
						}
					}

					img.crossOrigin = ''
					img.src = p.sprite
				})
			})
		},
		searchPokemon: function searchPokemon () {
			var self = this
			var pokemonSearchTerm = self.pokemonTerm.trim()

			if (pokemonSearchTerm === '') {
				self.pokemon = self.pokemonTemp
			} else {
				self.pokemon = self.pokemonTemp.filter(function (p) {
					return p.name.toLowerCase().indexOf(pokemonSearchTerm) > -1 || p.id.toString().indexOf(pokemonSearchTerm) > -1 || p.id == pokemonSearchTerm
				})
			}
		},
		getDataUriImage: function getDataUriImage (img) {
			var canvas = document.createElement('canvas')
			var ctx = canvas.getContext('2d')

			canvas.width = img.width
			canvas.height = img.height

			ctx.drawImage(img, 0, 0, img.width, img.height)

			return canvas.toDataURL()
		}
	}
}

var app = new Vue({
  el: 'body',
  components: {
    Pokemon: Pokemon
  }
})