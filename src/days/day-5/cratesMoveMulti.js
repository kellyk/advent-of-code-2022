// After the rearrangement procedure completes, what crate ends up on top of each stack?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const indexOfLastCrate = data.lastIndexOf(']');
  const indexOfInstructions = data.indexOf('move');

  // Build matrix
  const rows = data.substring(0, indexOfLastCrate).split('\n');
  let matrix = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (let col = 0, j = 1; j < row.length; col++, j+=4) {
      // Each crate letter is four characters apart, eg '[A] [B]', so we move j by 4 each time
      const myChar = row[j];

      if (!matrix[col]) {
        matrix[col] = [];
      }

      matrix[col].unshift(myChar)
    }
  }

  // Parse instructions, format is "move 8 from 3 to 2"
  const instructions = data.substring(indexOfInstructions).trim().split('\n').map(str => {
    const [, move, , from, , to] = str.split(" ");
    return { move: parseInt(move), from: parseInt(from), to: parseInt(to) };
  });

  matrix = matrix.map(val => val.filter(char => char !== " "));

  // Execute instructions
  instructions.forEach(({ move, from, to }) => {
    const startingArr = matrix[from - 1];
    const itemsToMove = startingArr.splice(startingArr.length - move, move);
    matrix[to - 1].push(...itemsToMove);
  });

  // Return first letter from each column
  const result = matrix.reduce((acc, col) => {
    const char = col.length ? col.pop() : '';
    return acc + char;
  }, '')

  console.log({result})

  return result;
});
