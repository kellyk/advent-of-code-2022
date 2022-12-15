// Organize all of the packets into the correct order.
// What is the decoder key for the distress signal?
const fs = require('fs');

function compare(left, right) {
  const isLeftArr = Array.isArray(left);
  const isRightArr = Array.isArray(right);

  // Base case: 0 = continue, positive = false, negative = true
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
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

  return 0;
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const FIRST = [[2]];
  const SECOND = [[6]]
  const all = [FIRST, SECOND]

  const pairs = data.trim().split('\n\n').map(pair => pair.split('\n').map(item => JSON.parse(item)));
  pairs.forEach(pair => all.push(...pair));
  all.sort(compare);

  const firstDivider = all.indexOf(FIRST) + 1;
  const secondDivider = all.indexOf(SECOND) + 1;
  const total = firstDivider * secondDivider;

  console.log({total})
  return 0;
});
