// Consult the report from the sensors you just deployed.
// In the row where y=2000000, how many positions cannot contain a beacon?**
const fs = require('fs');

function processData(data) {
  let xMin = yMin = Number.MAX_VALUE, xMax = yMax = 0;

  const coordinates = data.trim().split('\n').map(item => {
    const sensorStartIdx = 'Sensor at x='.length;
    const sensorEndIdx = item.indexOf(':');
    const beaconIdx = item.indexOf('is at x=') + 'is at x='.length;

    const [ sensorX, sensorY ] = item.slice(sensorStartIdx, sensorEndIdx).split(', y=');
    const [ beaconX, beaconY ] = item.slice(beaconIdx).split(', y=');

    const deltaX = parseInt(sensorX) - parseInt(beaconX);
    const deltaY = parseInt(sensorY) - parseInt(beaconY);

    const coords = {
      dist: (Math.abs(deltaX) + Math.abs(deltaY)) + 1,
      beacon: {
        x: parseInt(beaconX),
        y: parseInt(beaconY)
      },
      sensor: {
        x: parseInt(sensorX),
        y: parseInt(sensorY)
      }
    }

    xMin = Math.min(xMin, coords.sensor.x - coords.dist);
    xMax = Math.max(xMax, coords.sensor.x + coords.dist);
    yMin = Math.min(yMin, coords.sensor.y - coords.dist);
    yMax = Math.max(yMax, coords.sensor.y + coords.dist);
    return coords;
  });

  return {
    coordinates,
    xMax,
    yMax,
    xOffset: 0 - Math.min(0, xMin),
    yOffset: 0 - Math.min(0, yMin)
  };
}

function mark(chart, coord, c, xOffset) {
  const x = coord.x + xOffset;
  const colKey = `col-${x}`;

  if (!chart[colKey]) {
    chart[colKey] = c;
  }
}

fs.readFile('data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const {  coordinates, xMax, yMax, xOffset, yOffset } = processData(data)

  const chart = {};
  const ROW = 2000000;
  const start = new Date();

  coordinates.forEach((coord, idx) => {
    const { beacon, sensor, dist } = coord;

    // Mark sensor and beacon
    if (sensor.y === ROW) {
      mark(chart, sensor, 'S', xOffset);
    } else if (beacon.y === ROW) {
      mark(chart, beacon, 'B', xOffset);
    }

    // Mark places we know there is no beacon
    for (let y = sensor.y - dist; y < sensor.y + dist; y++) {
      if (y === ROW) {
        for (let x = sensor.x - dist; x < sensor.x + dist; x++) {
          const dx = Math.abs(sensor.x-x)
          const dy = Math.abs(sensor.y-y);
          if (dx+dy < dist) {
            mark(chart, {x, y}, '#', xOffset);
          }
        }
      }
    }
  });

  let hashCount = 0;
  for (key in chart) {
    if (chart[key] === '#') {
      hashCount++
    }
  }

  const end = new Date();

  console.log({hashCount, runtime: (end - start) / 1000 });
  return hashCount;
});
