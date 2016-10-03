import Vue from 'vue'
import Pokemon from './components/Pokemon.vue'

const app = new Vue({
  el: '#app',
  render: h => h(Pokemon)
})
