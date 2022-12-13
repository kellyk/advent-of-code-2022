// Determine which pairs of packets are already in the right order.
// What is the sum of the indices of those pairs?
const fs = require('fs');

function compare(left, right) {
  const isLeftArr = Array.isArray(left);
  const isRightArr = Array.isArray(right);

  // Base case: 0 = continue, positive = true, negative = false
  if (typeof left === 'number' && typeof right === 'number') {
    return right - left;
  }

  if (isLeftArr && !isRightArr) {
    return compare(left, [right]);
  }

  if (isRightArr && !isLeftArr) {
    return compare([left], right);
  }

  if (isLeftArr && isRightArr) {
    const minL = Math.min(left.length, right.length);

    for (let i = 0; i < minL; i++) {
      const result = compare(left[i], right[i])
      if (result !== 0) {
        return result;
      }
    }

    return compare(left.length, right.length)
  }

  return true;
}


fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const pairs = data.trim().split('\n\n').map(pair => pair.split('\n').map(item => JSON.parse(item)));
  correctIndices = [];
  const correctAnswers = [1, 2, 4, 6]

  pairs.forEach((pair, i) => {
    const [ left, right ] = pair;
    if (compare(left, right) > 0) {
      correctIndices.push(i +1);
    }
  })

  const total = correctIndices.reduce((acc, index) => {
    return acc += index
  }, 0)

  console.log({ total })
  return 0;
});
