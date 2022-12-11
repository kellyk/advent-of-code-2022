// What is the level of monkey business after 20 rounds of stuff-slinging simian shenanigans?
const fs = require('fs');

function processData(dataArr) {
  return dataArr.map(monkey => {
    const info = monkey.split('\n')
    const [operator, operand] = info[2].slice(info[2].indexOf('old') + 4).split(' ');
    return {
      items: info[1].slice(info[1].indexOf(':') + 2).split(',').map(n => parseInt(n.trim())),
      operation: { operator, operand },
      test: {
        divisibleBy: parseInt(info[3].slice(info[3].indexOf('by ') + 3)),
        ifYes: info[4].slice(info[4].indexOf('monkey ') + 7),
        ifNo: info[5].slice(info[5].indexOf('monkey ') + 7)
      }
    };
  })
}

function getNewItem(item, { operator, operand }) {
  let newOperand = operand === 'old' ? item : parseInt(operand);
  const newItem = (operator === '*') ? item * newOperand: item + newOperand;
  return Math.floor(newItem / 3);
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const dataArr = data.trim().split('\n\n');
  const monkeys = processData(dataArr);
  const inspectionsPerMonkey = new Array(monkeys.length).fill(0);

  // evaluate monkeys after 20 rounds
  for (let i = 0; i < 20; i++) {
    monkeys.map((monkey , i) => {
      const { items, operation, test } = monkey;

      for (let j = 0; j < items.length; j++) {
        let item = getNewItem(items[j], operation);
        inspectionsPerMonkey[i]++
        if (item % test.divisibleBy === 0) {
          monkeys[test.ifYes].items.push(item)
        } else {
          monkeys[test.ifNo].items.push(item)
        }
      }
      monkey.items = [];
    })
  }

  const sorted = inspectionsPerMonkey.sort((a, b) => a-b);
  const total = sorted.pop() * sorted.pop();
  console.log({total})
  return total;
});
