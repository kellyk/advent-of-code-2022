// In how many assignment pairs do the ranges overlap??
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
  const matrix = [];

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
    const move = parseInt(str[str.indexOf('move ') + 'move '.length]);
    const from = parseInt(str[str.indexOf('from ') + 'from '.length]);
    const to = parseInt(str[str.indexOf('to ') + 'to '.length]);
    return { move, from, to };
  });

  console.log({matrix, instructions})

  // Execute instructions
  instructions.forEach(({ move, from, to }) => {
    for (let i = 0; i < move; i++) {
      matrix[to - 1].push(matrix[from - 1].pop());
    }
  });

  // Return first letter from each column
  const result = matrix.reduce((acc, col) => {
    const char = col.length ? col.pop() : '';
    return acc + char;
  }, '')

  console.log({result})

  return result;
});
