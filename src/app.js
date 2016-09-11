import Vue from 'vue'
import VueResoure from 'vue-resource'
import Pokemon from './components/Pokemon.vue'

window.Vue = Vue
Vue.use(VueResoure)

const app = new Vue({
  el: 'body',
  components: {
    Pokemon
  }
})
