// Consult the report from the sensors you just deployed.
// In the row where y=2000000, how many positions cannot contain a beacon?**

const fs = require('fs');
/*
 {
  row-1: {
    col-1: '#',
    col-2: 'B',
  }
 }
*/

function mark(chart, coord, c, xOffset, yOffset) {
  const x = coord.x + xOffset;
  const y = coord.y + yOffset;
  // const str = strArr[y];
  const rowKey = `row-${y}`;
  const colKey = `col-${x}`;

  if (!chart[rowKey]) {
    chart[rowKey] = {}
  }

  if (!chart[rowKey][colKey]) {
    chart[rowKey][colKey] = c;
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

    const delta = Math.abs(coords.sensor.x - coords.beacon.x) + Math.abs(coords.sensor.y - coords.beacon.y);
    xMin = Math.min(xMin, coords.sensor.x - delta, coords.beacon.x);
    xMax = Math.max(xMax, coords.sensor.x + delta, coords.beacon.x);
    yMin = Math.min(yMin, coords.sensor.y - delta, coords.beacon.y);
    yMax = Math.max(yMax, coords.sensor.y + delta, coords.beacon.y);

    return coords;
  });

  const xOffset = 0 - Math.min(0, xMin);
  const yOffset = 0 - Math.min(0, yMin);
  xMax += 1;
  yMax += 1;
  const chart = {};
  const columns = new Array(yMax + yOffset).fill('.'.repeat(xMax + xOffset));

  coordinates.forEach((coord, idx) => {
    const { beacon, sensor } = coord;

    // Mark sensor and beacon
    mark(chart, sensor, 'S', xOffset, yOffset);
    mark(chart, beacon, 'B', xOffset, yOffset);

    const deltaX = sensor.x - beacon.x;
    const deltaY = sensor.y - beacon.y;
    const dist = (Math.abs(deltaX) + Math.abs(deltaY));

    // Mark places we know there is no beacon
    for (let y = sensor.y - dist-1; y < sensor.y + dist+1; y++) {
      for (let x = sensor.x - dist-1; x < sensor.x + dist+1; x++) {
        const dx = Math.abs(sensor.x-x)
        const dy = Math.abs(sensor.y-y);
        if (dx+dy <= dist) {
          mark(chart, {x, y}, '#', xOffset, yOffset);
        }
      }
    }
  })

  console.log({xMin, xMax, xOffset, yMin, yMax, yOffset})
  console.log(chart)
  // let tenStr = '    '
  // let digitStr = '    ';
  // for (let i = 0-xOffset; i < xMax; i++) {
  //   if (i >= 0) {
  //     digitStr += i%10
  //   } else {
  //     digitStr += ' '
  //   }

  //   if (i >= 10 ) {
  //     tenStr += Math.floor( i / 10);
  //   } else {
  //     tenStr+=' '
  //   }
  // }
  // console.log(tenStr)
  // console.log(digitStr)
  // columns.forEach((col, i) =>{
  //   console.log(`${i-yOffset}`.padStart(3, ' '), columns[i])
  // })

  const lookup = `row-${10 + yOffset}`;
  const row = chart[lookup];
  console.log('row we care about', row)
  let count = 0;
  for (key in row) {
    if (row[key] === '#') {
      count++
    }
  }
  console.log('# count', count)

  return 0;
});
