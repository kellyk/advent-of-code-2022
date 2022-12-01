// Find the top three Elves carrying the most calories. How many calories are those Elves carrying in total?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.split('\n');
  const caloriesPerElfArr = [];
  let currentElfCalories = 0;

  for (i = 0; i < dataArr.length; i++) {
    if (dataArr[i].length) {
      currentElfCalories += parseInt(dataArr[i]);
    } else {
      // We have hit an empty entry in the array, which begins a new elf!
      caloriesPerElfArr.push(currentElfCalories);
      currentElfCalories = 0;
    }
  }

  const sortedCalories = caloriesPerElfArr.sort();
  const top3Arr = caloriesPerElfArr.slice(sortedCalories.length - 3);
  const top3calories = top3Arr.reduce((prev, curr) => prev + curr);

  console.log(top3calories);

  return top3calories;
});
