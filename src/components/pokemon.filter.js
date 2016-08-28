Vue.filter('capitalize', function (value) {
  return value.charAt(0).toUpperCase() + value.substr(1)
})

Vue.filter('zeros', function (number) {
	return ('00' + number).slice(-3)
})
