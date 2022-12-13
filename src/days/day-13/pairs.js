// Determine which pairs of packets are already in the right order.
// What is the sum of the indices of those pairs?
const fs = require('fs');

function isRightLarger(pair) {
  const [left, right] = pair;
  console.log({left, right})

  return true;
}

fs.readFile('data/sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const pairs = data.trim().split('\n\n').map(pair => pair.split('\n').map(item => JSON.parse(item)));
  correctIndices = [];

  pairs.forEach((pair, i) => {
    if (isRightLarger(pair)) {
      correctIndices.push(i);
    }
  })

  console.log({ correctIndices })
  return 0;
});
