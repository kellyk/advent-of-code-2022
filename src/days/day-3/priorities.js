// Find the item type that appears in both compartments of each rucksack.
// What is the sum of the priorities of those item types?
const fs = require('fs');

// Lowercase item types a through z have priorities 1 through 26.
// charCodeAt of 'a' is 97, but we want it to be 1, so subtract 96
const LOWERCASE_OFFSET =	96;

// Uppercase item types A through Z have priorities 27 through 52.
// charCodeAt of 'A' is 65, but we want it to be 27, so subtract 39
const UPPERCASE_OFFSET = 38;

const isCapital = (str) => str.charAt(0) === str.charAt(0).toUpperCase();
const halvsies = (str) => [str.substring(0, Math.floor(str.length/2)), str.substring(Math.floor(str.length/2))];

function findDuplicateChar(str) {
  const [a, b] = halvsies(str);
  const dictionary = {};

  for (let i = 0; i < a.length; i++) {
    dictionary[a[i]] = true;
  }

  for (let i = 0; i < b.length; i++) {
    if (dictionary[b[i]]) {
      return b[i];
    }
  }

  return null;
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.split('\n');

  const total = dataArr.reduce((acc, str) => {
    const duplicate = findDuplicateChar(str)
    let duplicateCharacterValue = 0;

    if (duplicate) {
      const char = duplicate.charCodeAt(0);
      duplicateCharacterValue = isCapital(duplicate) ? char - UPPERCASE_OFFSET : char - LOWERCASE_OFFSET;
    }

    return acc + duplicateCharacterValue;
  }, 0)

  console.log(total)
  return total;
});
