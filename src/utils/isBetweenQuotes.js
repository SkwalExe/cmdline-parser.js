const isBetweenQuotes = (str, index) => {
  let singleQuote = false;
  let doubleQuote = false;
  let singleClosed = true;
  let doubleClosed = true;
  let quoted = false;
  let indexPassed = false;


  for (let i = 0; i < str.length; i++) {
    let char = str[i]
    if (char === '"') {
      if (!singleQuote) {
        doubleClosed = !doubleClosed;
        doubleQuote = !doubleQuote;
      }
    }

    if (char === '\'') {
      if (!doubleQuote) {

        singleClosed = !singleClosed;
        singleQuote = !singleQuote;
      }
    }

    if (i === index) {
      indexPassed = true;
      if (doubleQuote || singleQuote)
        quoted = true;
    }

    console.log('char: ' + char + ' Quoted : ' + quoted + ' Doublequote: ' + doubleQuote + ' SingleQuote: ' + singleQuote + ' SingleClosed: ' + singleClosed + ' DoubleClosed: ' + doubleClosed + ' Quoted: ' + quoted + ' IndexPassed: ' + indexPassed)

    if (indexPassed && quoted && doubleClosed && singleClosed)
      return true;

  }
  return false;
}

module.exports = isBetweenQuotes
