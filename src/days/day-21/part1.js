// What number will the monkey named root yell?
const fs = require('fs');

function resolve(map, monkey) {
  if (typeof map[monkey.a] === 'number' && typeof map[monkey.b] === 'number') {
    return eval(`${map[monkey.a]} ${monkey.operator} ${map[monkey.b]}`);
  } else {
    return monkey;
  }
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let map = {};
  data.trim().split('\n').forEach(monkey => {
    const [n, a, operator, b] = monkey.split(' ');
    const name = n.slice(0, n.length - 1);
    map[name] = operator ? { name, a, b, operator } : parseInt(a);
  });

  while (typeof map.root !== 'number') {
    for (let monkey in map) {
      if (typeof map[monkey] !== 'number') {
        map[monkey] = resolve(map, map[monkey]);
      }
    }
  }

  console.log({root: map.root}) // 223971851179174
});
