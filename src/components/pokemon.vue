<template>
	<div class="app">
		<header class="header" role="banner">
			<div class="header__inner">
				<div class="header__section">
					<div class="header__logo">
						<h1>Pokemon</h1>
					</div>
					<div class="pokemon__search">
						<input type="text" name="name" class="pokemon__search-textfield" placeholder="Search by name or number" v-model="pokemonTerm" v-on:keyup="searchPokemon">
					</div>
				</div>
			</div>
		</header>
		<main class="main" role="main">
			<div class="pokemons-loading" v-if="!isLoadingPokeball">
				<div class="pokeball">
					<div class="pokeball__button"></div>
				</div>
			</div>
			<div class="container" v-if="isLoadingPokeball">
				<div class="pokemons">
					<div class="shadow relative h-48 overflow-hidden" v-for="(p, i) in pokemon" :key="i">
						<figure class="pokemon__sprite">
								<img v-bind:src="p.sprite">
						</figure>
						<div class="pokemon__content">
							<h2 class="pokemon__name" v-bind:style="{ color: p.swatches }">{{ p.name | capitalizes }}</h2>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
import PokemonService from '../services/pokemon';
import PokemonStore from '../store/pokemon';
import { capitalizes, zeros } from '../filters';

export default {
  data() {
    return {
      pokemon: [],
      pokemonTemp: [],
      pokemonTerm: ''
    }
  },
  filters: {
    capitalizes,
    zeros
  },
  computed: {
    isLoadingPokeball() {
      return this.pokemonTemp.length > 0;
    }
  },
  mounted() {
    var self = this;

    if (!!PokemonStore.getPokemon()) {
      let pokemon = JSON.parse(PokemonStore.getPokemon());
      self.pokemon = pokemon;
      self.pokemonTemp = pokemon;
    } else {
      self.getAllPokemon();
    }
  },
  methods: {
    getAllPokemon() {
      let self = this;
      let currentPokemon = 6;

      PokemonService.getPokemon(0, currentPokemon)
        .then(self.getSwatches)
        .then(self.updatePokemonSwatches);
    },
    updatePokemonSwatches(pokemon) {
      this.pokemon = pokemon;
      this.pokemonTemp = pokemon;
      PokemonStore.setPokemon(JSON.stringify(pokemon));
    },
    getSwatches(pokemon) {
      var self = this;

      return new Promise(function(resolve, reject) {
        let swatchesList = [];
        let pokemonData = pokemon;
        let pokemonDataLength = pokemonData.length;

        pokemonData.map(function(p, i) {
          let img = new Image();

          img.onload = function() {
            pokemonData[i].swatches = self.getDataSwatchImage(img);
            pokemonData[i].sprite = self.getDataUriImage(img);

            pokemonDataLength--;

            if (!pokemonDataLength) {
              resolve(pokemonData);
            }
          };

          img.crossOrigin = '';
          img.src = p.sprite;
        });
      });
    },
    searchPokemon() {
      let self = this;
      let pokemonSearchTerm = self.pokemonTerm.trim();

      if (pokemonSearchTerm === '') {
        self.pokemon = self.pokemonTemp;
      } else {
        self.pokemon = PokemonService.filterByNameOrId(
          self.pokemonTemp,
          pokemonSearchTerm
        );
      }
    },
    getDataUriImage(img) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      return canvas.toDataURL('image/png');
    },
    getDataSwatchImage(img) {
      let swatchColor = '';
      let vibrant = new Vibrant(img);
      let swatches = vibrant.swatches();

      for (var swatch in swatches) {
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
          swatchColor = swatches[swatch].getHex();
          break;
        }
      }

      return swatchColor;
    }
  }
};
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
  background-color: #f5f7f7;
  color: #444;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

html,
body {
  height: 100%;
}

.header {
  background: #fff;
}

.header__inner {
  display: flex;
  justify-content: space-between;
  width: 65em;
  margin: 0 auto;
}

.header__section {
  display: flex;
  align-items: center;
  width: 100%;
}

.header__logo h1 {
  font-size: 21px;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  margin: 10px 0;
  text-transform: uppercase;
}

.container {
  max-width: 65em;
  margin: 0 auto;
}

.container:after,
.pokemons:after {
  content: '';
  display: table;
  clear: both;
}

.pokemons {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1.5em;
}

@media (min-width: 768px) {
  .pokemons {
    grid-template-columns: 1fr 1fr;
  }
}

.main {
  margin-top: 25px;
}

.pokemon {
  background-color: #fff;
  box-shadow: 1px 1px #efecec, -1px -1px #efecec;
  border-radius: 4px;
  display: flex;
  position: relative;
  min-height: 180px;
  overflow: hidden;
}

.pokemon__sprite {
  margin: 0;
  position: absolute;
  right: 15px;
  bottom: -15px;
  max-width: 180px;
}

.pokemon__sprite img {
  vertical-align: middle;
  width: 100%;
  height: auto;
}

.pokemon__content {
  margin: 10px 0;
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
  font-size: 3em;
  text-indent: .5em;
}

.pokemon__search {
  padding-left: 1em;
  width: 100%;
}

.pokemon__search-textfield {
  padding: 7px 10px;
  background: #f5f7f7;
  border-radius: 3px;
  font-size: 14px;
  border: 1px solid #efecec;
  width: 100%;
}

.pokemon__search-textfield:hover,
.pokemon__search-textfield:focus {
  outline: 0;
}

.pokemons-loading {
  text-align: center;
  margin: 150px 0;
}

.pokeball {
  background-color: #e62e34;
  display: inline-block;
  border-radius: 50%;
  border: 8px solid #343434;
  width: 150px;
  height: 150px;
  animation: 1.5s shake infinite ease-in-out;
  -webkit-animation: 1.5s shake infinite ease-in-out;
  margin-left: -75px;
  margin-top: -75px;
  box-shadow: inset 0 -97px 0 -40px #fff, inset 0 -102px 0 -35px #343434;
  transform: none;
  -webkit-transform: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}

.pokeball__button {
  background: #cecece;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  box-shadow: 0 0 0 8px #eee, 0 0 0 16px #343434;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
}

@-webkit-keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-20px, 0, 0);
    transform: translate3d(-20px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(20px, 0, 0);
    transform: translate3d(20px, 0, 0);
  }
}

@keyframes shake {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  20%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-20px, 0, 0);
    transform: translate3d(-20px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(20px, 0, 0);
    transform: translate3d(20px, 0, 0);
  }
}
</style>
