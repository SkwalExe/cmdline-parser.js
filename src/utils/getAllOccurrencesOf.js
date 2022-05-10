const getAllOccurrencesOf = (string, inside) => {
  let indexes = [];

  for (let i = 0; i < inside.length; i++) {
    if (inside.substring(i, i + string.length) === string) {
      indexes.push(i);
    }
  }
  return indexes
}

module.exports = getAllOccurrencesOf
