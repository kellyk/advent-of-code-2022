// Find the item type that corresponds to the badges of each three-Elf group.
// What is the sum of the priorities of those item types?
const fs = require('fs');

// Lowercase item types a through z have priorities 1 through 26.
// charCodeAt of 'a' is 97, but we want it to be 1, so subtract 96
const LOWERCASE_OFFSET =	96;

// Uppercase item types A through Z have priorities 27 through 52.
// charCodeAt of 'A' is 65, but we want it to be 27, so subtract 39
const UPPERCASE_OFFSET = 38;

const isCapital = (str) => str.charAt(0) === str.charAt(0).toUpperCase();

function findDuplicateChar(a, b, c) {
  if (!a || !b || !c) {
    return null;
  }

  // Put strings into array of length 3 so we can sort and iterate through the shortest
  const arr = [a, b, c];
  arr.sort((a, b) => a.length - b.length);
  const [shortest, second, third] = arr;

  for (let i = 0; i < shortest.length; i++) {
    const char = shortest[i];
    if (second.indexOf(char) >= 0 && third.indexOf(char) >= 0) {
      return char;
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
  let total = 0;

  for (let i = 0; i < dataArr.length; i+= 3) {
    const [a, b, c] = dataArr.slice(i, i+3);
    const duplicate = findDuplicateChar(a, b, c);

    if (duplicate) {
      const char = duplicate.charCodeAt(0);
      duplicateCharacterValue = isCapital(duplicate) ? char - UPPERCASE_OFFSET : char - LOWERCASE_OFFSET;
    } else {
      duplicateCharacterValue = 0;
    }

    total += duplicateCharacterValue;
  }

  console.log(total)
  return total;
});
