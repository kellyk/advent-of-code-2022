// Consult the report from the sensors you just deployed.
// In the row where y=2000000, how many positions cannot contain a beacon?**

const fs = require('fs');

function mark(strArr, coord, c, xOffset, yOffset) {
  const x = coord.x + xOffset;
  const y = coord.y + yOffset;
  const str = strArr[y];

  if (str?.charAt(x) === '.') {
    const first = str.slice(0, x);
    const second = str.slice(x + 1);
    strArr[y] = first + c + second;
  }
}

fs.readFile('data/sample.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }


  let xMin = yMin = Number.MAX_VALUE;
  let xMax = yMax = 0;

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

    //Sensor at x=2, y=0: closest beacon is at x=2, y=10
    // delta is 10 (x2 -x1 + y2 - y1)

    // Lowest is Sensor at x=17, y=20: closest beacon is at x=21, y=22
    // 17 - 21 = 4, 20 - 22 = 2, total delta = 6. Lowest height should be 26
    const delta = Math.abs(coords.sensor.x - coords.beacon.x) + Math.abs(coords.sensor.y - coords.beacon.y);
    xMin = Math.min(xMin, coords.sensor.x - delta, coords.beacon.x);
    xMax = Math.max(xMax, coords.sensor.x + delta, coords.beacon.x);
    yMin = Math.min(yMin, coords.sensor.y - delta, coords.beacon.y);
    yMax = Math.max(yMax, coords.sensor.y + delta, coords.beacon.y);
    console.log({xMax, yMax, delta})
    return coords;
  });
  const xOffset = 0 - Math.min(0, xMin);
  const yOffset = 0 - Math.min(0, yMin);
  xMax += 1;
  yMax += 1;
  const columns = new Array(yMax + yOffset).fill('.'.repeat(xMax + xOffset));

  coordinates.forEach((coord, idx) => {
    // 1. Mark the sensor and beacon in the matrix
    // 2. Find the x and y difference between the sensor and the beacon
    // 3. Mark the no-beacon-possible symbol for sensor += x and y

    //Sensor at x=13, y=2: closest beacon is at x=15, y=3

    const { beacon, sensor } = coord;

    mark(columns, sensor, 'S', xOffset, yOffset);
    mark(columns, beacon, 'B', xOffset, yOffset);

    const deltaX = sensor.x - beacon.x;
    const deltaY = sensor.y - beacon.y;
    const dist = (Math.abs(deltaX) + Math.abs(deltaY));

    // if (idx === 8) {
      for (let y = sensor.y - dist-1; y < sensor.y + dist+1; y++) {
        for (let x = sensor.x - dist-1; x < sensor.x + dist+1; x++) {
          const dx = Math.abs(sensor.x-x)
          const dy = Math.abs(sensor.y-y);
          if (dx+dy <= dist) {
            mark(columns, {x, y}, '#', xOffset, yOffset);
          }
        }
      // }
    }
  })

  console.log({xMin, xMax, xOffset, yMin, yMax, yOffset})

  let tenStr = '    '
  let digitStr = '    ';
  for (let i = 0-xOffset; i < xMax; i++) {
    if (i >= 0) {
      digitStr += i%10
    } else {
      digitStr += ' '
    }

    if (i >= 10 ) {
      tenStr += Math.floor( i / 10);
    } else {
      tenStr+=' '
    }
  }
  console.log(tenStr)
  console.log(digitStr)
  columns.forEach((col, i) =>{
    console.log(`${i-yOffset}`.padStart(3, ' '), columns[i])
  })

  return 0;
});
