Vue.filter('capitalize', function (value) {
  return value.charAt(0).toUpperCase() + value.substr(1)
})
