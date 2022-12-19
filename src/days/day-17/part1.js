// How many units tall will the tower of rocks be after 2022 rocks have stopped falling?
const fs = require('fs');

const minus = [['#', '#', '#', '#']];
const plus =  [
  ['.', '#', '.'],
  ['#', '#', '#'],
  ['.', '#', '.'],
];
const el =  [
  ['.', '.', '#'],
  ['.', '.', '#'],
  ['#', '#', '#'],
];
const pipe =  [
  ['#'],
  ['#'],
  ['#'],
  ['#'],
];
const square = [
  ['#', '#'],
  ['#', '#',],
];

const START_POSITION = { x: 2, y: 0 };
const PIECES = [minus, plus, el, pipe, square];

function getNextPiece(pieceCount) {
  if (pieceCount% 5 === 0) {
    console.log('\nPlacing next piece:', '-')
  }  if (pieceCount% 5 === 1) {
    console.log('\nPlacing next piece:', '+')
  }  if (pieceCount% 5 === 2) {
    console.log('\nPlacing next piece:', 'L')
  } if (pieceCount% 5 === 3) {
    console.log('\nPlacing next piece:', '|')
  } if (pieceCount% 5 === 4) {
    console.log('\nPlacing next piece:', 'square')
  }
  return PIECES[pieceCount%5];
}

function getTowerHeight(grid) {
  let indexOfRowWithPiece = 0;
  for (let i = grid.length - 1 ; i >= 0; i--) {
    let row = grid[i];
    if (row.indexOf('#') >= 0) {
      indexOfRowWithPiece = i;
    }
  }
  return grid.length - indexOfRowWithPiece - 1;
}

function moveHorizontally(grid, piece, direction, start) {
  const xStart = direction === '>' ? start.x + 1 : start.x - 1;
  if ( direction === '>' ) {
    console.log('move right', {xStart})
  } else {
    console.log('move left', {xStart})
  }
  const xEnd = xStart + piece[0].length

  // Can't move off grid
  if (xStart < 0 || xEnd > grid[0].length) {
    console.log('off grid')
    return { ...start }
  }

   for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[0].length; j++) {
      let cell = piece[i][j];
      if (cell === '#') {
        let row = start.y + i;
        let col = xStart + j;
        if (grid[row][col] === '#') {
          console.log('collision')
          // collision: we cannot move here
          return {...start};
        }
      }
    }
  }

  return { ...start, x: xStart };
}

function moveDown(grid, piece, start) {
  const yStart = start.y + 1;
  console.log('move down', {yStart})
  const yEnd = yStart + piece.length

  // Can't move off grid
  if (yStart < 0 || yEnd > grid.length) {
    return { ...start }
  }

   for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[0].length; j++) {
      let cell = piece[i][j];
      if (cell === '#') {
        let row = yStart + i;
        let col = start.x + j;
        if (grid[row][col] === '#') {
          // collision: we cannot move here
          return {...start};
        }
      }
    }
  }

  return { ...start, y: yStart };
}

function addPieceToGrid(grid, piece, start) {
  console.log('\nNumber of rows', grid.length)
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[0].length; j++) {
      let cell = piece[i][j];
      if (cell === '#') {
        let row = start.y + i;
        let col = start.x + j;
        // console.log('placing', {row, col})
        grid[row][col] = cell
      }
    }
  }
}

// Increase height to highest item + new piece height + 3
function increaseGridHeight(grid, piece) {
  const gridHeight = grid.length;
  const neededHeight = getTowerHeight(grid) + piece.length + 3;
  grid.forEach(row=> {
        console.log(row.join(''))
      })
  console.log('highest item is at ',  getTowerHeight(grid))
  console.log('needed height ', neededHeight)


  if (gridHeight < neededHeight) {
    for (let i = gridHeight; i < neededHeight; i++) {
      grid.unshift(['.', '.', '.', '.', '.', '.', '.']);
    }
  }
  // } else {
    // grid.shift(neededHeight - gridHeight)
  // }
}

fs.readFile('data/sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const moves = data.trim().split('');

  let grid = [
    ['.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.'],
    // ['.', '.', '.', '.', '.', '.', '.']
  ];

  let pieceCount = 0;
  let nextPiece = getNextPiece(pieceCount);
  let position = { ...START_POSITION };

  // Iterate through arrows
  for (let i = 0; i < moves.length; i++) {
    // Move item in direction of arrow
    position = moveHorizontally(grid, nextPiece, moves[i], position);
    // Move down one if possible
    let newPosition = moveDown(grid, nextPiece, position)

    // if (i === 7) {
    //   addPieceToGrid(grid, nextPiece, position);
    //   break
    // }
    /*
     *  When item can no longer move vertically:
     *  - Place piece in grid permanently
     *  - Get a new piece, resetting start position
     *  - Increase grid height to accommodate new item
     **/
    // Bug here because we should try to move horizontally even when we couldn't move down any more
    if (position.y === newPosition.y) {
      // i++
      // position = moveHorizontally(grid, nextPiece, moves[i], newPosition);
      addPieceToGrid(grid, nextPiece, position);
      console.log('new piece after ', i, nextPiece, moves.slice(0, i+1))
      pieceCount++;
      nextPiece = getNextPiece(pieceCount);
      increaseGridHeight(grid, nextPiece);
      position = { ...START_POSITION };
    } else {
      position = newPosition
    }
  }
      grid.forEach(row=> {
        console.log(row.join(''))
      })
  return 0;
});
