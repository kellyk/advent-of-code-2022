// Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const OUTCOME = {
    X: 0, // Lose
    Y: 3, // Draw
    Z: 6, // Win
  };

  // Rock:1, Paper:2, Scissors:3
  const POINTS_FOR_CHOICE = {
    'A X': 3, // Rock beats Scissors
    'A Y': 1, // Rock vs Rock
    'A Z': 2, // Rock loses to Paper
    'B X': 1, // Paper beats Rock
    'B Y': 2, // Paper vs Paper
    'B Z': 3, // Paper loses to Scissors
    'C X': 2, // Scissors beats Paper
    'C Y': 3, // Scissors vs Scissors
    'C Z': 1, // Scissors loses to Rock
  }

  const dataArr = data.split('\n');

  const total = dataArr.reduce((acc, round, index, arr) => {
    let score = 0;

    if (round) {
      // Calculate points for game outcome
      const [opponent, , me] = round;
      score += OUTCOME[me];

      // Calculate points for choice of rock, paper or scissors
      score += POINTS_FOR_CHOICE[round];
    }
    return acc + score;
  }, 0)

  console.log(total)
  return total;
});
