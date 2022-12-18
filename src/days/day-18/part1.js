// What is the surface area of your scanned lava droplet?
const fs = require('fs');

fs.readFile('data/sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let coordinateMap = {};

  const coordinates = data.trim().split('\n').map(point => {
    const [x, y, z] = point.split(',');
    coordinateMap[`${x}-${y}-${z}`] = true;
    return { x: parseInt(x), y: parseInt(y), z: parseInt(z)};
  });

  let sidesNotTouching = 6 * coordinates.length;
  coordinates.forEach(({x, y, z}) => {
    if (coordinateMap[`${x+1}-${y}-${z}`]) sidesNotTouching--;
    if (coordinateMap[`${x-1}-${y}-${z}`]) sidesNotTouching--;
    if (coordinateMap[`${x}-${y+1}-${z}`]) sidesNotTouching--;
    if (coordinateMap[`${x}-${y-1}-${z}`]) sidesNotTouching--;
    if (coordinateMap[`${x}-${y}-${z+1}`]) sidesNotTouching--;
    if (coordinateMap[`${x}-${y}-${z-1}`]) sidesNotTouching--;
  });

  console.log({ sidesNotTouching }); // 4320
});
