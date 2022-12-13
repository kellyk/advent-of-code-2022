// What is the fewest steps required to move from your current position to the location that should get the best signal?
const fs = require('fs');

// Letters a through z have heights 0 through 25
// charCodeAt of 'a' is 97, but we want it to be 0, so subtract 97
const OFFSET =	97;

const dir = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];

// Convert input to matrix of heights so we don't recalculate during traversal
function processData(dataArr) {
  let start = { height: 0 };
  let end = { height: 25 };

  const matrix = dataArr.map((row, i) => {
    return row.split('').map((c, j) => {
      if (c === 'S') {
        start.x = i;
        start.y = j;
      }
      if (c === 'E') {
        end.x = i;
        end.y = j;
      }
      return c === 'S' ? 0 : c === 'E' ? 25 : c.charCodeAt(0) - 97
    });
  });

  return { matrix, start, end };
}

function generateCells(matrix) {
  let cells = [];
  for (let i = 0; i < matrix.length; i++) {
    cells[i] = [];
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 'S') {
        cells[i][j] = { x: i, y: j, height: 0, dist:0, prev: null }
      } else if (matrix[i][j] != 'S') {
        cells[i][j] = { x: i, y: j, height:matrix[i][j], dist: Number.MAX_VALUE, prev: null };
      }
    }
  }
  return cells;
}

function visit(cells, queue, nextCoords, prev, end) {
  // off grid
  if (nextCoords.x < 0 || nextCoords.x >= cells.length ||
    nextCoords.y < 0 || nextCoords.y >= cells[0].length ||
    cells[nextCoords.x][nextCoords.y] == null) {
      return;
  }

  const next = cells[nextCoords.x][nextCoords.y];
  const dist = prev.dist + 1;

  // cannot visit because height difference is greater than 1
  if (Math.abs(next.height - prev.height) > 1) {
    return;
  }

  // update distance, and previous cell
  if (dist < next.dist) {
    next.dist = dist;
    next.prev = prev;
    queue.push(next);
  }
}

function breadthFirstSearch(matrix, start, end) {
  const cells = generateCells(matrix);
  const queue = [{ ...start, dist: 0 }];
  let dest;

  while ((curr = queue.shift()) != null) {
    // if 'E' we are at the end
    if (curr.x == end.x && curr.y == end.y) {
      dest = curr;
      break;
    }

    for (let i = 0; i < dir.length; i++) {
      const [x, y] = dir[i];
      if (curr.x +x == end.x && curr.y+y == end.y) {
        console.log('end should be enqueued', curr.height)
      }
      console.log({h:curr.height, enqueue: { x: curr.x + x, y: curr.y + y }})
      visit(cells, queue, { x: curr.x + x, y: curr.y + y }, curr, end)
    }
  }
  console.log('End reached!', {dest})
  return dest?.dist;
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.trim().split('\n');
  const { matrix, start, end} = processData(dataArr);
  const steps = breadthFirstSearch(matrix, start, end) || 'error';

  console.log({start, end, steps})
  return 0;
});
