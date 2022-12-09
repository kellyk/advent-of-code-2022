// How many positions does the tail of the rope visit at least once?
const fs = require('fs');

const isTouching = (a, b) => Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1;

// instruction = 'U 3'
function parseMovement(instruction) {
  const [direction, count] = instruction.split(' ');
  return { direction, count: parseInt(count) };
}

function move(head, tail, direction, path) {
  const prevHead = { ...head };

  switch(direction) {
    case 'U': {
      head.y = head.y+1;
      break;
    }
    case 'D': {
      head.y = head.y-1;
      break;
    }
    case 'R': {
      head.x = head.x+1;
      break;
    }
    case 'L': {
      head.x = head.x-1;
      break;
    }
  }

  if (!isTouching(head, tail)) {
    tail = prevHead; // move tail to where the head was
    const key = '' + tail.y + '-' + tail.x;
    path[key] = true;
  }
  return { head, tail };
}


fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.trim().split('\n');

  let head = { x: 0, y: 0 };
  let tail = { x: 0, y: 0 };
  let path = { '0-0': true };

  for (let i = 0; i < dataArr.length; i++) {
    let { direction, count } = parseMovement(dataArr[i]);

    for (let j = 0; j < count; j++) {
      const result = move(head, tail, direction, path);
      head = {...result.head}
      tail = {...result.tail}
    }
  };

  const numPositions = Object.keys(path).length;
  console.log({numPositions}); // 6337
  return numPositions;
});
