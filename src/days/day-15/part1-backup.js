// Consult the report from the sensors you just deployed.
// In the row where y=2000000, how many positions cannot contain a beacon?**

const fs = require('fs');

function mark(strArr, {x, y}, character) {
  const str = strArr[y];
  if (strArr[y]?.charAt(x) === '.') {
    const first = str.slice(0, x);
    const second = str.slice(x + 1);
    strArr[y] = first + character + second;
  }
}

fs.readFile('data/sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }


let xMin = yMin = Number.MAX_VALUE;
let xMax = yMax = 0;
//Sensor at x=20, y=1: closest beacon is at x=15, y=3
  const coordinates = data.trim().split('\n').map(item => {
    const sensorStartIdx = 'Sensor at x='.length;
    const sensorEndIdx = item.indexOf(':');
    const beaconIdx = item.indexOf('is at x=') + 'is at x='.length;

    const [ sensorX, sensorY ] = item.slice(sensorStartIdx, sensorEndIdx).split(', y=');
    const [ beaconX, beaconY ] = item.slice(beaconIdx).split(', y=');

    const coords = {
      beacon: {
        x: parseInt(beaconX),
        y: parseInt(beaconY)
      },
      sensor: {
        x: parseInt(sensorX),
        y: parseInt(sensorY)
      }
    }

    xMin = Math.min(xMin, coords.sensor.x - coords.beacon.x, coords.beacon.x);
    xMax = Math.max(xMax, coords.sensor.x + coords.beacon.x, coords.beacon.x);
    yMin = Math.min(yMin, coords.sensor.y - coords.beacon.y, coords.beacon.y);
    yMax = Math.max(yMax, coords.sensor.y - coords.beacon.y, coords.beacon.y);
    // console.log({coordinates})
    return coords;
  });

  const columns = new Array(yMax-yMin).fill('.'.repeat(xMax-xMin))
  // const offsetX = 0 - Math.min(0, xMin);
  // const offsetY = 0 - Math.min(0, yMin);
  coordinates.forEach((coord, idx) => {
    // 1. Mark the sensor and beacon in the matrix
    // 2. Find the x and y difference between the sensor and the beacon
    // 3. Mark the no-beacon-possible symbol for sensor += x and y

    //Sensor at x=13, y=2: closest beacon is at x=15, y=3
  console.log({coord})
    const { beacon, sensor } = coord;

    mark(columns, sensor, 'S');
    mark(columns, beacon, 'B');

    const deltaX = sensor.x - beacon.x;
    const deltaY = sensor.y - beacon.y;
    const dist = (Math.abs(deltaX) + Math.abs(deltaY));

    // if (idx === 6) {
      for (let y = sensor.y - dist-1; y < sensor.y + dist+1; y++) {
        for (let x = sensor.x - dist-1; x < sensor.x + dist+1; x++) {
          const dx = Math.abs(sensor.x-x)
          const dy = Math.abs(sensor.y-y);
          console.log({dist, x, y, dx, dy, total: dx+dy})
          if (dx+dy <= dist) {
            // console.log({sensor, x, y, dist})
            mark(columns, {x, y}, '#');
          }
        }
      // }
    }
  })

  console.log({xRange: xMax - xMin, yRange: yMax-yMin, xMin, xMax, yMin, yMax, columns})

  return 0;
});
