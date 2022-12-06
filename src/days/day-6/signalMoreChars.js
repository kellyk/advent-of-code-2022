// How many characters need to be processed before the first start-of-message marker is detected?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let chars = data.trim().split('');
  let index, count = 13;

  do {
    let mySet = new Set(chars.slice(0, 14));
    count++;
    if (mySet.size === 14) {
      index = count;
    } else {
      chars.shift();
    }
  } while (!index || chars.length < 14)


  console.log(count)
  return count;
});
