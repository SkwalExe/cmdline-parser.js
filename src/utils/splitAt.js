const splitAt = (indexes, string) => {
  let result = []
  let currentPartIndex = 0

  indexes.forEach(index => {
    result.push(string.substring(currentPartIndex, index))
    currentPartIndex = index + 1;
  })

  result.push(string.substring(currentPartIndex))

  return result

}

module.exports = splitAt
