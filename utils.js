export function checkIfVisible(object, currentDate) {
  return currentDate > object.visibleFrom && currentDate < object.visibleUntil;
}

export function radecToXYZ(ra, dec, r) {
  // Convert degrees to radians
  let raRad = (Math.PI / 180) * ra;
  let decRad = (Math.PI / 180) * dec;

  let x = r * Math.cos(decRad) * Math.cos(raRad);
  let y = r * Math.cos(decRad) * Math.sin(raRad);
  let z = r * Math.sin(decRad);

  return [x, y, z];
} 
