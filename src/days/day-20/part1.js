// What is the surface area of your scanned lava droplet?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // We rely on numbers array holding references not values
  let staticNumbers = data.trim().split('\n').map(n => ({ val: parseInt(n) }));
  let numbers = [...staticNumbers];
  const lastIndex = staticNumbers.length - 1;

  for (let i = 0; i <= lastIndex; i++) {
    const current = staticNumbers[i];
    const startingPosition = numbers.indexOf(current);
    let newPosition = startingPosition + current.val;

    if (newPosition <= 0) {
      newPosition = (lastIndex - Math.abs(newPosition)) % numbers.length;
    } else if (newPosition > lastIndex) {
      newPosition = (Math.abs(newPosition - lastIndex)) % numbers.length;
    }

    // Remove item
    numbers.splice(startingPosition, 1);
    // Add item
    numbers.splice(newPosition, 0, current);
  }

  function getValAtPosition(arr, position) {
    const zero = arr.filter(item => item.val === 0)[0];
    const remainderAfterWrapping = position % arr.length;
    let index = arr.indexOf(zero) + remainderAfterWrapping;
    if (index >= arr.length) {
      index = Math.abs(index - arr.length);
    }

    return arr[index].val;
  }

  const first = getValAtPosition(numbers, 1000);
  const second = getValAtPosition(numbers, 2000);
  const third = getValAtPosition(numbers, 3000);

  console.log(numbers)
  console.log({ result: first + second + third }); // 8764
});
