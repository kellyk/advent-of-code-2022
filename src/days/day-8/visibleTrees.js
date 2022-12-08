// Consider your map; how many trees are visible from outside the grid?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const matrix =  data.trim().split('\n').map(row => row.split('').map(num => parseInt(num)));
  const transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  const visMatrix = new Array(matrix.length).fill(false).map(() => new Array(matrix[0].length).fill(false));

  function isVisible(rowIndex, colIndex) {
    // return true for edges
    if (rowIndex === 0 || rowIndex === matrix[0].length - 1 ||
      colIndex === 0 || colIndex === transposed[0].length - 1) {
      return true;
    }

    let visible = false;
    const currentTreeHeight = matrix[rowIndex][colIndex];
    const row = matrix[rowIndex];
    const col = transposed[colIndex];
    const left = row.slice(0, colIndex);
    const right = row.slice(colIndex+1)
    const top = col.slice(0, rowIndex);
    const bottom = col.slice(rowIndex+1)

    if ((Math.max(...left) < currentTreeHeight) ||
        (Math.max(...right) < currentTreeHeight) ||
        (Math.max(...top) < currentTreeHeight) ||
        (Math.max(...bottom) < currentTreeHeight)) {
      visible = true;
    }

    return visible;
  }

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      if (!visMatrix[i][j]) {
        visMatrix[i][j] = isVisible(i, j);
      }
    }
  }

  const total = visMatrix.reduce((acc, row) => {
    return acc += row.filter(bool => !!bool).length
  }, 0)

  console.log({total})
  return total;
});
