// simCalc.js

export function distToCam(cameraPosition, objectPosition) {
    const dx = cameraPosition.x - objectPosition[0];
    const dy = cameraPosition.y - objectPosition[1];
    const dz = cameraPosition.z - objectPosition[2];
    
    return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
  }
  
// Getting the position of the object obj (example: asteroid)
// const objectPosition = obj.getOrbit().getPositionAtTime(viz.getJd());
  