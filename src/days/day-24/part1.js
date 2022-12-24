// What is the fewest number of minutes required to avoid the blizzards and reach the goal?
const fs = require('fs');

const DIRECTIONS = ['<', '>', '^', 'v'];
function processData(data) {
  let blizzards = [];
  const grid =  data.trim().split('\n').map((row, y) => {
    height = row.length;
    return row.split('').map((col, x) => {
      if (DIRECTIONS.indexOf(col) >= 0) {
        blizzards.push({ x, y , direction: col });
      }
      return col;
    });
  });

  const start = grid[0].indexOf('.');
  const end = grid[grid.length-1].indexOf('.');
  return { blizzards, start, end, grid };
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const { blizzards, start, end, grid } = processData(data);
  console.log(blizzards, start, end);;
});
