// What is the surface area of your scanned lava droplet?
const fs = require('fs');

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const blueprints = data.trim().split('\n').map(blueprint => {
    const robots = blueprint.slice(blueprint.indexOf(':'));
    [ore, clay, obsidian, geode] = robots.split('.').map(robot => {
      return robot.slice(robot.indexOf('costs') + 6)
    })

    return {
      oreBot: {
        ore: parseInt(ore.split(' ')[0])
      },
      clayBot: {
        ore: parseInt(clay.split(' ')[0])
      },
      obsidianBot: {
        ore: parseInt(obsidian.split(' ')[0]),
        clay: parseInt(obsidian.split(' ')[3])
      },
      geodeBot: {
        ore: parseInt(geode.split(' ')[0]),
        clay: parseInt(geode.split(' ')[3])
      }
    }
  });

  console.log(blueprints)
});
