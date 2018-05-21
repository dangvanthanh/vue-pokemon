export function capitalizes(value) {
  return value.charAt(0).toUpperCase() + value.substr(1);
}

export function zeros(number) {
  return ('00' + number).slice(-3);
}
