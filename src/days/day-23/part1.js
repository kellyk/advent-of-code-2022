// How many empty ground tiles does that rectangle contain?
const fs = require('fs');

const MOVE_PRIORITIES = ['N', 'S', 'W', 'E'];

function processData(data) {
  let elves = [];
  data.trim().split('\n').forEach((row, y) => {
    row.split('').forEach((col, x) => {
      if (col === '#') {
        elves.push({ current: { x, y }, next: null });
      }
    });
  });
  return elves;
}

function getAdjacentElves(elf, elves) {
  let { x, y } = elf.current;
  return elves.filter(e => {
    let { x: ex, y: ey } = e.current;
    let isTouching = (Math.abs(x - ex) + Math.abs(y - ey)) === 1;
    let isDiagonal = (Math.abs(x - ex) === 1 && Math.abs(y - ey) === 1);
    return isTouching || isDiagonal;
  });
}

const moves = {
  N: (elf, adjacentElves) => {
    let { x, y } = elf.current;
    if (adjacentElves.length < 1) {
      return { x, y };
    } else if (!adjacentElves.find(e => e.current.y === y - 1)) {
      return { x, y: y - 1 };
    } else {
      return null
    }
  },
  S: (elf, adjacentElves) => {
    let { x, y } = elf.current;
    if (adjacentElves.length < 1) {
      return { x, y };
    } else if (!adjacentElves.find(e => e.current.y === y + 1)) {
      return { x, y: y + 1 };
    } else {
      return null
    }
  },
  W: (elf, adjacentElves) => {
    let { x, y } = elf.current;
    if (adjacentElves.length < 1) {
      return { x, y };
    } else if (!adjacentElves.find(e => e.current.x === x - 1)) {
      return { x: x - 1, y };
    } else {
      return null
    }
  },
  E: (elf, adjacentElves) => {
    let { x, y } = elf.current;
    if (adjacentElves.length < 1) {
      return { x, y };
    } else if (!adjacentElves.find(e => e.current.x === x + 1)) {
      return { x: x + 1, y };
    } else {
      return null
    }
  },
};
function getProposedCoordinates(elf, dir, elves) {
  let { x, y } = elf.current;
  const adjacentElves = getAdjacentElves(elf, elves);

  let northCoords = moves.N(elf, adjacentElves);
  let southCoords = moves.S(elf, adjacentElves);
  let westCoords = moves.W(elf, adjacentElves);
  let eastCoords = moves.E(elf, adjacentElves);

  if (dir === 'N') return northCoords || southCoords || westCoords || eastCoords ||  { x: -1, y: -1};
  if (dir === 'S') return southCoords || westCoords || eastCoords || northCoords || { x: -1, y: -1};
  if (dir === 'W') return westCoords || eastCoords || northCoords || southCoords || { x: -1, y: -1};
  if (dir === 'E') return eastCoords || northCoords || southCoords || westCoords || { x: -1, y: -1 };
  return { x: -1, y: -1 };
};

function move(elves, dir) {
  let proposedCoordinates = {};

  // Propose new positions
  let newElves = elves.map((elf, i) => {
    let { x, y } = getProposedCoordinates(elf, dir, elves);
    let key = `${x},${y}`;
    if (!proposedCoordinates[key]) {
      proposedCoordinates[key] = [];
    }
    proposedCoordinates[key].push(i)

    return { ...elf, next: { x, y } };
  });

  // Move to new positions
  return newElves.map((elf, i) => {
    let { x, y } = elf.next;
    if (proposedCoordinates[`${x},${y}`].length < 2) {
      return { current: { x, y }, next: null };
    };

    return { ...elf, next: null };
  });
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {  return; }

  const elves = processData(data);
  console.log('old elves')
  elves.forEach(elf => console.log(elf))
  let newElves = [...elves];

  for (let i = 0; i < 10; i++) {
    console.log('Round', i+1, MOVE_PRIORITIES[i % 4]);
    newElves = move(newElves, MOVE_PRIORITIES[i % 4]);
    newElves.forEach(elf => console.log(elf))
  }

  // draw new elves
  let maxX = Math.max(...newElves.map(elf => elf.current.x));
  let minX = Math.min(...newElves.map(elf => elf.current.x));
  let maxY = Math.max(...newElves.map(elf => elf.current.y));
  let minY = Math.min(...newElves.map(elf => elf.current.y));
  let numberEmptyCells = 0;
  for (let y = minY; y <= maxY; y++) {
    let row = '';
    for (let x = minX; x <= maxX; x++) {
      if (newElves.find(e => e.current.x === x && e.current.y === y)) {
        row += '#';
      } else {
        numberEmptyCells++;
        row += '.';
      }
    }
    console.log(row);
  }
  console.log({numberEmptyCells})
});
