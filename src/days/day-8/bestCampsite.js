// Consider each tree on your map. What is the highest scenic score possible for any tree?
const fs = require('fs');

function getScore(arr, currentTreeHeight) {
  let visibleTrees = 0, highestSoFar = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= highestSoFar) {
      visibleTrees += 1;
      highestSoFar = arr[i];
      if (highestSoFar >= currentTreeHeight) { break; }
    } else { break; }
  }
  return visibleTrees;
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.trim().split('\n');
  const matrix = dataArr.map(row => row.split('').map(num => parseInt(num)));
  const transposed = matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  const rows = new Array(matrix.length).fill(0);
  const visMatrix = rows.map(row => new Array(matrix[0].length).fill(0));

  function numTreesVisible(rowIndex, colIndex) {
    const currentTreeHeight = matrix[rowIndex][colIndex];
    const row = matrix[rowIndex];
    const col = transposed[colIndex];
    const left = row.slice(0, colIndex);
    const right = row.slice(colIndex+1)
    const up = col.slice(0, rowIndex);
    const down = col.slice(rowIndex+1)

    const visRight = getScore(right, currentTreeHeight);
    const visLeft = getScore(left.reverse(), currentTreeHeight);
    const visUp = getScore(up.reverse(), currentTreeHeight);
    const visDown = getScore(down, currentTreeHeight);

    return visUp * visRight * visDown * visLeft;
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j <  matrix[i].length; j++) {
      const result = numTreesVisible(i, j);
      visMatrix[i][j] = result;
    }
  }

  const highestScore = visMatrix.reduce((acc, row) => {
    const rowCopy = [...row]; // do not mutate visMatrix
    const highestInRow = rowCopy.sort((a, b) => a-b)[rowCopy.length-1]
    return Math.max(acc, highestInRow);
  }, 0)

  console.log({highestScore})
  return highestScore;
});
