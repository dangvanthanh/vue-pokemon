<template>
	<div class="pokemons" v-if="isLoadingPokeball">
		<div class="pokemon__search">
			<input type="text" name="name" class="pokemon__search-textfield" placeholder="Search by name or number" v-model="pokemonTerm" v-on:keyup="searchPokemon">
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
	<div class="pokemons-loading" v-if="!isLoadingPokeball">
		<div class="pokeball">
			<div class="pokeball__button"></div>
		</div>
	</div>
</template>

<script>
import PokemonService from './pokemon-service'
import PokemonStore from './pokemon-store'

export default {
  data () {
    return {
			pokemon: [],
			pokemonTemp: [],
			pokemonTerm: ''
    }
  },
	computed: {
		isLoadingPokeball () {
			return this.pokemonTemp.length > 0
		}
	},
	ready () {
		var self = this

		if (!!PokemonStore.getPokemon()) {
			let pokemon = JSON.parse(PokemonStore.getPokemon())
			self.pokemon = pokemon
			self.pokemonTemp = pokemon
		} else {
			self.getAllPokemon()
		}
	},
  methods: {
		getAllPokemon () {
			let self = this
			let currentPokemon = 721

			PokemonService
				.getPokemon(0, currentPokemon)
				.then(self.getSwatches)
				.then(self.updatePokemonSwatches)
		},
		updatePokemonSwatches (pokemon) {
			this.pokemon = pokemon
			this.pokemonTemp = pokemon
			PokemonStore.setPokemon(JSON.stringify(pokemon))
		},
		getSwatches (pokemon) {
			var self = this

			return new Promise(function (resolve, reject) {
				let swatchesList = [];
				let pokemonData = pokemon
				let pokemonDataLength = pokemonData.length

				pokemonData.map(function (p, i) {
					let img = new Image()

					img.onload = function () {
						pokemonData[i].swatches = self.getDataSwatchImage(img)
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
		},
		getDataUriImage (img) {
			let canvas = document.createElement('canvas')
			let ctx = canvas.getContext('2d')

			canvas.width = img.width
			canvas.height = img.height

			ctx.drawImage(img, 0, 0, img.width, img.height)

			return canvas.toDataURL()
		},
		getDataSwatchImage (img) {
			let swatchColor = ''
			let vibrant = new Vibrant(img)
			let swatches = vibrant.swatches()

			for (var swatch in swatches) {
				if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
					swatchColor = swatches[swatch].getHex()
					break;
				}
			}

			return swatchColor
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
	margin: 0;
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

.pokemons-loading {
	background: rgba(0, 0, 0, .9);
	position: absolute;
	width: 100%;
	height: 100%;
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

.pokemon__search {
	margin: 1.5625% 0.78125%;
}

.pokemon__search-textfield {
	padding: 0.78125% 1.5625%;
	border-radius: 5px;
	background: #c8d2d9;
	font-size: 14px;
	border: 1px solid transparent;
	width: 100%;
}

.pokemon__search-textfield:hover,
.pokemon__search-textfield:focus {
	outline: 0;
}

.pokeball,
.pokeball__button {
	border-radius: 50%;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
}

.pokeball {
	background-image: linear-gradient(to bottom, tomato 50%, #333 50%, #333 55%, #eee 55%);
	display: inline-block;
	border: 1px solid #ccc;
	width: 150px;
	height: 150px;
	animation: 1s rotate infinite linear;
	-webkit-animation: 1s rotate infinite linear;
	margin-left: -75px;
	margin-top: -75px;
}

.pokeball__button {
	background: #ccc;
	border: 1px solid #ddd;
	width: 20px;
	height: 20px;
	box-shadow: 0 0 0 5px #eee, 0 0 0 15px #333;
}

@media screen and (max-width: 768px) {
	.pokemon {
		width: 48.4375%;
	}
}

@-webkit-keyframes rotate {
  from, to {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

	to {
		-webkit-transform: rotate(360deg);
    transform: rotate(360deg);
	}
}

@keyframes rotate {
	from, to {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

	to {
		-webkit-transform: rotate(360deg);
    transform: rotate(360deg);
	}
}
</style>
