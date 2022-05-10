const isBetweenQuotes = (str, index) => {
  let singleQuote = false;
  let doubleQuote = false;
  let singleClosed = true;
  let doubleClosed = true;
  let indexPassed = false;


  for (let i = 0; i < str.length; i++) {
    let char = str[i]
    if (char === '"') {
      if (singleQuote)
        continue;
      doubleClosed = !doubleClosed;
      if (!indexPassed)
        doubleQuote = !doubleQuote;

    }

    if (char === '\'') {
      if (doubleQuote)
        continue;
      singleClosed = !singleClosed;
      if (!indexPassed)
        singleQuote = !singleQuote;
    }

    if (i === index) {
      indexPassed = true;
    }

    if (indexPassed && (doubleClosed && doubleQuote) || (singleClosed && singleQuote))
      return true;

  }
  return false;
}

module.exports = isBetweenQuotes
