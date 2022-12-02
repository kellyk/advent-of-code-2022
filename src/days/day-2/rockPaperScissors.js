// What would your total score be if everything goes exactly according to your strategy guide?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const POINTS = {
    X: 1, // Rock
    Y: 2, // Paper
    Z: 3, // Scissors
  };

  const OUTCOMES = {
    'A X': 3, // Rock vs Rock
    'A Y': 6, // Rock vs Paper
    'A Z': 0, // Rock vs Scissors
    'B X': 0, // Paper vs Rock
    'B Y': 3, // Paper vs Paper
    'B Z': 6, // Paper vs Scissors
    'C X': 6, // Scissors vs Rock
    'C Y': 0, // Scissors vs Paper
    'C Z': 3, // Scissors vs Scissors
  }

  const dataArr = data.split('\n');

  const total = dataArr.reduce((acc, round, index, arr) => {
    let score = 0;

    // Calculate points for choice of rock, paper or scissors
    if (round) {
      const [opponent, , me] = round;
      score += POINTS[me];

      // Calculate points for game outcome
      score += OUTCOMES[round];
    }
    return acc + score;
  }, 0)

  console.log(total)
  return total;
});
