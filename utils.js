export function checkIfVisible(object, currentDate) {
  return currentDate > object.visibleFrom && currentDate < object.visibleUntil;
}
