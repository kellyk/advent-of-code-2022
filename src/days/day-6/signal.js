// How many characters need to be processed before the first start-of-packet marker is detected?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let chars = data.trim().split('');
  let index, count = 3;

  do {
    let mySet = new Set(chars.slice(0, 4));
    count++;
    if (mySet.size === 4) {
      index = count;
    } else {
      chars.shift();
    }
  } while (!index || chars.length < 4)


  console.log(count)
  return count;
});
