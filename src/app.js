import Pokemon from './components/Pokemon.vue'
import { capitalize, zeros } from './filters'

Vue.filter('capitalize', capitalize)
Vue.filter('zeros', zeros)

const app = new Vue({
  el: 'body',
  components: {
    Pokemon
  }
})
