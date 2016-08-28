<template>
	<div class="pokemons">
		<div class="search">
			<input type="text" name="name" class="search__textfield" placeholder="Search by name or number" v-model="pokemonTerm" v-on:keyup="searchPokemon">
		</div>
		<div class="pokemon" v-for="p in pokemon">
			<figure class="pokemon__sprite" v-bind:style="{ backgroundColor: p.swatches }">
					<img v-bind:src="p.sprite">
			</figure>
			<div class="pokemon__content">
				<p class="pokemon__id">{{ p.id | zeros }}</p>
				<h2 class="pokemon__name">{{ p.name | capitalize }}</h2>
			</div>
		</div>
	</div>
</template>

<script>
import PokemonService from './pokemon.service'
import VueFilter from './pokemon.filter'

export default {
  data () {
    return {
			pokemon: [],
			pokemonTemp: [],
			pokemonTerm: ''
    }
  },
	ready () {
		var self = this

		if (!!localStorage.getItem('pokemon')) {
			let pokemon = JSON.parse(localStorage.getItem('pokemon'))
			self.pokemon = pokemon
			self.pokemonTemp = pokemon
		} else {
			self.getAllPokemon()
		}
	},
  methods: {
		getAllPokemon () {
			let self = this
			let pokemonService = new PokemonService()
			let currentPokemon = 721

			pokemonService
				.getPokemon(0, currentPokemon)
				.then(self.getSwatches)
				.then(self.updatePokemonSwatches)
		},
		updatePokemonSwatches (pokemon) {
			this.pokemon = pokemon
			this.pokemonTemp = pokemon
			localStorage.setItem('pokemon', JSON.stringify(pokemon))
		},
		getSwatches (pokemon) {
			return new Promise(function (resolve, reject) {
				let swatchesList = [];
				let pokemonData = pokemon
				let pokemonDataLength = pokemonData.length

				pokemonData.map(function (p, i) {
					let img = new Image()

					img.onload = function () {
						var vibrant = new Vibrant(img)
						var swatches = vibrant.swatches()

						for (var swatch in swatches) {
							if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
								pokemonData[i].swatches = swatches[swatch].getHex()
								break;
							}
						}

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
		searchPokemon () {
			let self = this
			let pokemonSearchTerm = self.pokemonTerm.trim()

			if (pokemonSearchTerm === '') {
				self.pokemon = self.pokemonTemp
			} else {
				self.pokemon = self.pokemonTemp.filter((p) => {
					return p.name.toLowerCase().indexOf(pokemonSearchTerm) > -1 || p.id.toString().indexOf(pokemonSearchTerm) > -1 || p.id == pokemonSearchTerm
				})
			}
		}
	}
}
</script>

<style>
*,
*:before,
*:after {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}

body {
	background-color: #edf3f7;
	color: #444;
	font-family: 'Roboto', sans-serif;
	font-size: 16px;
	line-height: 1.5;
}

.pokemons {
	max-width: 65em;
	margin: 0 auto;
}

.pokemons:after {
	content: "";
	display: table;
	clear: both;
}

.pokemon {
	background-color: #fff;
	border: 1px solid #e7edf1;
	border-radius: 5px;
	display: block;
	float: left;
	position: relative;
	margin: 0 0.78125% 1.5625%;
	width: 23.4375%;
	text-align: center;
	overflow: hidden;
}

.pokemon__sprite {
	margin: 0;
	padding: 25px 0;
}

.pokemon__sprite img {
	vertical-align: middle;
}

.pokemon__content {
	margin: 25px 0;
}

.pokemon__id,
.pokemon__name {
	margin: 0;
}

.pokemon__id {
	color: #c2c2c2;
	font-size: 14px;
}

.pokemon__name {
	color: #2a3c4b;
	font-size: 16px;
}

.search {
	margin: 1.5625% 0.78125%;
}

.search__textfield {
	padding: 0.78125% 1.5625%;
	border-radius: 5px;
	background: #c8d2d9;
	font-size: 14px;
	border: 1px solid transparent;
	width: 100%;
}

.search__textfield:hover,
.search__textfield:focus {
	outline: 0;
}

@media screen and (max-width: 768px) {
	.pokemon {
		width: 48.4375%;
	}
}
</style>
