export function checkIfVisible(object, currentDate) {
    return currentDate > object.visibleFrom && currentDate < object.visibleUntil;
  }
  
  export function getTransformObjects(objects) {
    return objects.map((point) => {
      let newObject;
      return { ...point, newObject };
    });
  }