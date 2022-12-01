// How many calories are being carried by the Elf carrying the most calories
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.split('\n');
  let max = 0;
  let currentElfCalories = 0

  for (i = 0; i < dataArr.length; i++) {
    if (dataArr[i].length) {
      currentElfCalories += parseInt(dataArr[i]);
    } else {
      // We have hit an empty entry in the array, which begins a new elf!
      if (currentElfCalories > max) {
        max = currentElfCalories;
      }
      currentElfCalories = 0;
    }
  }

  console.log(max)
  return max;
});
