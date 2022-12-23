// Follow the path given in the monkeys' notes. What is the final password?
const fs = require('fs');

// Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^)
const DIRECTIONS = {
  UP: { symbol: '^', val: 3 },
  RIGHT: { symbol: '>', val: 0 },
  DOWN: { symbol: 'v', val: 1 },
  LEFT: { symbol: '<', val: 2 },
}

const parseInput = (dataArr) => {
  const directions = dataArr.splice(dataArr.length-2)[1].split(/([LR])/g).map(dir => {
    return dir === 'L' || dir === 'R' ? dir : parseInt(dir, 10);
  });

  const maxLength = dataArr.reduce((acc, curr) => curr.length > acc ? curr.length : acc, 0);

  // Make all rows the same length
  const grid = dataArr.map((chars) => {
    let row = chars.split('').map(c => c === ' ' ? '@' : c);
    if (row.length < maxLength) {
      row = row.concat(Array(maxLength - row.length).fill('@'));
    }
    return row;
  });

  return { grid, directions };
}

function turn(direction, currentDirection) {
  if (direction === 'L') {
    switch (currentDirection) {
      case DIRECTIONS.UP:
        return DIRECTIONS.LEFT;
      case DIRECTIONS.LEFT:
        return DIRECTIONS.DOWN;
      case DIRECTIONS.DOWN:
        return DIRECTIONS.RIGHT;
      case DIRECTIONS.RIGHT:
        return DIRECTIONS.UP;
    }
  } else if (direction === 'R') {
    switch (currentDirection) {
      case DIRECTIONS.UP:
        return DIRECTIONS.RIGHT;
      case DIRECTIONS.RIGHT:
        return DIRECTIONS.DOWN;
      case DIRECTIONS.DOWN:
        return DIRECTIONS.LEFT;
      case DIRECTIONS.LEFT:
        return DIRECTIONS.UP;
    }
  }
}

function getNextPosition(position, direction) {
  let { y, x } = position;
  switch (direction) {
    case DIRECTIONS.UP:
      y--;
      break;
    case DIRECTIONS.RIGHT:
      x++;
      break;
    case DIRECTIONS.DOWN:
      y++;
      break;
    case DIRECTIONS.LEFT:
      x--;
      break;
  }
  return { y, x };
}

function wrapAround(position, direction, grid, gridTransposed) {
  let { y, x } = position;
  switch (direction) {
    case DIRECTIONS.UP:
      if (gridTransposed[x].lastIndexOf('.') > gridTransposed[x].lastIndexOf('#')) {
        y = gridTransposed[x].lastIndexOf('.');
      } else {
        return { y: -1, x: -1}
      }
      break;
    case DIRECTIONS.RIGHT:
      if (grid[y].indexOf('.') < grid[y].indexOf('#')) {
        x = grid[y].indexOf('.');
      } else {
        return { y: -1, x: -1}
      }
      break;
    case DIRECTIONS.DOWN:
      if (gridTransposed[x].indexOf('.') < gridTransposed[x].indexOf('#')) {
        y = gridTransposed[x].indexOf('.');
      } else {
        return { y: -1, x: -1}
      }
      break;
    case DIRECTIONS.LEFT:
      if (grid[y].lastIndexOf('.') > grid[y].lastIndexOf('#')) {
        x = grid[y].lastIndexOf('.');
      } else {
        return { y: -1, x: -1}
      }
      break;
  }

  return { y, x };
}

function move(position, direction, amount, grid, gridTransposed) {
  let { y, x } = position;

  // Move the specified amount of spaces, or until we hit a wall
  for (let i = 0; i < amount; i++) {
    let prevPosition = { y, x };
    ({ y, x } = getNextPosition({ y, x }, direction));

    // Check if we need to wrap around (outside the grid or hitting an edge)
    if (y > grid.length - 1 || y < 0 || x < 0 || x > grid[0].length - 1 || grid[y][x] === '@') {

      // Attempt to wrap around
      ({ y, x} = wrapAround({ y, x}, direction, grid, gridTransposed));

      // If wrap returns invalid position, we're done with this instruction
      if (x === -1 || y === -1) {
        return prevPosition;
      }
    } else if (grid[y][x] === '#') {
      // We hit a wall, so we're done with this instruction
      return prevPosition;
    }
  }
  return { y, x };
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Create a transposed copy of the grid so we can easily find the first/last '.' in each column
  const { grid, directions } = parseInput(data.trim().split('\n'));
  const gridTransposed = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));

  // Begin at leftmost '.' in the top row and face right
  let currentPosition = { y: 0, x: grid[0].indexOf('.') -1};
  let currentDirection = DIRECTIONS.RIGHT;

  for (let i = 0; i < directions.length; i++) {
    if (directions[i] === 'L' || directions[i] === 'R') {
      currentDirection = turn(directions[i], currentDirection);
    } else {
      const amount = directions[i];
      currentPosition = move(currentPosition, currentDirection, amount, grid, gridTransposed);
    }
  }

  const result = 1000 * (currentPosition.y+1) + 4 * (currentPosition.x + 1) + currentDirection.val;
  // Draw the grid with the path we took
  grid.forEach(row => {
    console.log(row.join(''));
  })

  // Print result
  console.log({ x: currentPosition.x + 1, y: currentPosition.y + 1, currentDirection, result }); //8442, 120010 and 120358 too low
  // 196146, 132186, 134176 are wrong, not sure if high or low
});
