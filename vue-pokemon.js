var app = new Vue({
    el: '#app',
    data: {
        pokemon: 'pikachu'
    },
    computed: {
        pokemonImg: function() {
            return 'http://img.pokemondb.net/artwork/' + this.pokemon.toLowerCase() + '.jpg';
        }
    }
});