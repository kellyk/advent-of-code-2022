// In how many assignment pairs does one range fully contain the other?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.trim().split('\n');

  const total = dataArr.reduce((acc, str) => {
    const [a, b] = str.split(',');
    const [a1, a2] = a.split('-');
    const [b1, b2] = b.split('-');

    const aStart = parseInt(a1);
    const aEnd = parseInt(a2);
    const bStart = parseInt(b1);
    const bEnd = parseInt(b2);

    // If either fully contains the other, increment
    if ((aEnd >= bEnd && aStart <= bStart) || (bEnd >= aEnd && bStart <= aStart)) {
      return acc + 1;
    }

    return acc;
  }, 0)

  console.log(total)
  return 0;
});
