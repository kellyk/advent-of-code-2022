// Determine which pairs of packets are already in the right order.
// What is the sum of the indices of those pairs?
const fs = require('fs');

const MOVES = {
  down: { x: 0, y: 1 },
  downLeft: { x: -1, y: 1 },
  downRight: { x: 1, y: 1 },
}

function getNewPositionIfValid(grid, oldPosition, move) {
  let newPosition = { x: oldPosition.x + move.x, y: oldPosition.y + move.y };
  let isValidPosition = false;

  if (newPosition.y >= 0 && newPosition.y < grid.length &&
      newPosition.x >= 0 && newPosition.x < grid[0].length) {
    let currentValue = grid[newPosition.y][newPosition.x];

    if (currentValue !== 'o' && currentValue !== '#') {
      isValidPosition = true
    }
  }

  return isValidPosition ? newPosition : null
}

function dropSand(grid, start) {
  let canMove = true;
  let pos = { ...start };
  do {
    const downPos = getNewPositionIfValid(grid, pos, MOVES.down);
    const downLeftPos = getNewPositionIfValid(grid, pos, MOVES.downLeft);
    const downRightPos = getNewPositionIfValid(grid, pos, MOVES.downRight);
    if (downPos) {
      pos = downPos;
    } else if (downLeftPos) {
      pos = downLeftPos;
    } else if (downRightPos) {
      pos = downRightPos;
    } else {
      canMove = false
    }
  } while (canMove)

  if (pos.x === start.x && pos.y === start.y) {
    return null;
  } else {
    grid[pos.y][pos.x] = 'o';
    return pos;
  }
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let xMin = 500, yMin = 0, xMax = yMax = -1;

  // Find x,y ranges since center of data is 500 but we don't want to render that wide
  const dataArr = data.trim().split('\n').map(pair => pair.split('->').map(i => {
    const [x, y] = i.split(',');
    const coordinate = { x: parseInt(x), y: parseInt(y) };
    xMin = Math.min(coordinate.x, xMin);
    yMin = Math.min(coordinate.y, yMin);
    xMax = Math.max(coordinate.x+1, xMax);
    yMax = Math.max(coordinate.y+1, yMax)
    return coordinate
  }));

  // Normalize rock coordinates based on ranges
  const rockCoordinates = dataArr.map(coords => coords.map(c => ({ x: c.x - xMin, y: c.y - yMin })));
  const grid = new Array(yMax-yMin).fill('.').map(r => new Array(xMax-xMin).fill('.'))

  // Add rocks to grid
  rockCoordinates.forEach(coords => {
    let prev = coords[0];
    for (let i = 1; i < coords.length; i++) {
      const curr = coords[i];
      if (prev.x !== curr.x) { // Fill row between points
        let [smaller, larger] = [prev.x, curr.x].sort();
        while (smaller <= larger) {
          grid[curr.y][smaller] = '#'
          smaller++;
        }
      } else if (prev.y !== curr.y) { // Fill col between points
        let [smaller, larger] = [prev.y, curr.y].sort();
        while (smaller <= larger) {
          grid[smaller][curr.x] = '#'
          smaller++;
        }
      }
      prev = curr;
    }
  })

  const sandStart = { x: 500 - xMin, y: 0 };
  let newPosition, count = 0;

  do {
    newPosition = dropSand(grid, sandStart);
    count++;
  } while (newPosition)

  // Print result
  for (let i = 0; i < grid.length; i++) {
    console.log(grid[i].join(''))
  }

  console.log({count})
  return 0;
});
