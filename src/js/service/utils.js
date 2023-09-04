//This is: The file utils.JS

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

export function isDesktop() {
  // Check for touch events which are typically available on phones and tablets
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  // Check for screen width, considering that many tablets have widths above 800 pixels
  const minWidth = 1024;

  // If there are no touch events and the screen width is above the threshold, it's probably a desktop
  return !hasTouch && window.innerWidth >= minWidth;
}