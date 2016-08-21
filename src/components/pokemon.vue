<template>
	<div class="pokedex">
		<div class="pokemon" v-for="p in pokemon">
			<img v-bind:src="p.sprite">
			<h2>{{p.name | capitalize}}</h2>
		</div>
	</div>
	<div class="u-text-center">
			<button v-on:click="loadMorePokemon()">Load More Pokemon</button>
	</div>
</template>

<script>
import PokemonService from './pokemon.service'
import VueFilter from './pokemon.filter'

export default {
  data () {
    return {
			pokemon: []
    }
  },
	ready () {
		this.loadMorePokemon()
	},
  methods: {
		loadMorePokemon () {
			let self = this
			let pokemonService = new PokemonService()

			pokemonService.getPokemon(this.pokemon.length, 12)
				.then((pokemon) => {
					self.pokemon = self.pokemon.concat(pokemon);
				})
		}
	}
}
</script>
