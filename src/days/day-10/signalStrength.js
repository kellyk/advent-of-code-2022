// Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles. What is the sum of these six signal strengths?
const fs = require('fs');

// Consider the signal strength (the cycle number multiplied by the value of the X register)
// during the 20th cycle and every 40 cycles after that
function getSignalStrength(arr) {
  let i = 20, len = arr.length, strength = 0;
  while (i < len) {
    strength += (i*arr[i]);
    i+=40;
  }
  return strength;
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.trim().split('\n');

  const registerX = [];
  const queue = [0, 0, 0];
  let current = 1;

  for (let i = 0; i < dataArr.length; i++) {
    const [instruction, amount] = dataArr[i].split(' ');
    const num = dataArr[i].indexOf('add') >= 0 ? parseInt(amount) : 0;

    queue.push(num);

    // Push an extra zero when we have an add instruction (ignore noop)
    if (dataArr[i].indexOf('add') >= 0) {
      queue.push(0);
    }
  }

  console.log({queue})

  let q = queue.length
  for (let i = 0; i < q; i++) {
    current += queue.shift();
    registerX.push(current);
  }

  const strength = getSignalStrength(registerX);
  console.log({ strength })
  return strength;
});
