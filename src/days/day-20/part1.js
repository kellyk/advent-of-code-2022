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

  for (let i = 0; i < staticNumbers.length; i++) {
    const current = staticNumbers[i];
    const startingPosition = numbers.indexOf(current);
    let newPosition = startingPosition + current.val;

    if (newPosition < 0) {
      newPosition = numbers.length - Math.abs(newPosition) - 1;
    } else if (newPosition === 0) {
      newPosition = numbers.length - 1;
    } else if (newPosition >= numbers.length) {
      newPosition = Math.abs(newPosition - numbers.length) + 1;
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

    console.log('zero', arr.indexOf(zero), zero)
    console.log('val',arr[index].val)


    return arr[index].val;
  }

  const first = getValAtPosition(numbers, 1000);
  const second = getValAtPosition(numbers, 2000);
  const third = getValAtPosition(numbers, 3000);

  // console.log(numbers)
  console.log({ result: first + second + third }); // 5381 too low
});
