
// RAYCASTING
// GOAL: FETCH o NAME ON CLICK // maybe use get .get3jsObjects()
// (returns and array of THREE.js objects, and the first item is a valid THREE.js object!)
const raycaster = new THREE.Raycaster();
const selectedObjects = []; // Array to store selected objects

const mouse = new THREE.Vector2();
const objectNameDiv = document.getElementById('objectNameDiv'); // Get the div element
// ... (previous code)

// Click event listener
document.addEventListener('click', function(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, viz.getViewer().get3jsCamera());
  const intersects = raycaster.intersectObjects(viz.getScene().children, true);

  // Get the first intersected object
  const firstIntersectedObject = intersects[0];

  if (firstIntersectedObject) {
    const objectName = firstIntersectedObject.object.name;
    objectNameDiv.textContent = `Clicked on object: ${objectName}`; // Update the div content
    changeObjectColor(firstIntersectedObject.object);
  } else {
    objectNameDiv.textContent = 'Click on an object to see its name here.'; // Reset the div content if no object is clicked
  }
});


// Function to change the color of an object
function changeObjectColor(object) {
  // Example: Change the object's color to blue
  const originalColor = object.material.color.clone(); // Store the original color
  object.material.color.set('blue'); // Set the new color (red in this example)

  // Reset color on a timeout (you can adjust the timeout as needed)
  setTimeout(() => {
    object.material.color.copy(originalColor); // Reset to original color
  }, 1000); // 1000 milliseconds (1 second) in this example
}


// OBJECTS FROM THREE.JS
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Cube of 0.1 AU side length
const material = new THREE.MeshBasicMaterial({color: 0x00ff00}); // Green color
const cube = new THREE.Mesh(geometry, material);
viz.getScene().add(cube); 

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5), 
  new THREE.MeshBasicMaterial({ color: 'yellow' })
);
scene.add(sphere);

const geometry = new THREE.ConeGeometry(0.5, 1, 32); 
// Parameters: radius, height, radialSegments
const material = new THREE.MeshBasicMaterial({color: 0x00ff00}); // Green color
const cone = new THREE.Mesh(geometry, material);
viz.getScene().add(cone); 



//OUMAOUMA function:
window.THREE = Spacekit.THREE;

viz.createObject("'Oumuamua", {
  ephem: new Spacekit.Ephem(
    {
      epoch: 2458080.5,
      a: -1.27234500742808,
      e: 1.201133796102373,
      q: 0.2559115812959116,
      n: 0.6867469493413392,
      i: 122.7417062847286,
      om: 24.59690955523242,
      w: 241.8105360304898,
      ma: 51.1576197938249,
      tp: 2458006.01,
    },
    'deg',
  ),
  theme: {
    orbitColor: 0xff00ff,
  },
  labelText: "'Oumuamua",


  // RAYCASTER RETURNING INFO ON CUBE OBJECTS ONLY

// Cube creation and setup
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.2  // Make it very transparent to start
});
const cube = new THREE.Mesh(geometry, material);

cube.name = "MyCube";  // Assign a unique name
cube.userData.textInfo = "This is some information about the cube.";  // Store text information

viz.getScene().add(cube);

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('click', function(event) {
    // Calculate normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, viz.getViewer().get3jsCamera());

    // Find intersected objects
    const intersects = raycaster.intersectObjects(viz.getScene().children);

    for (let intersect of intersects) {
        // Check if geometry is of type BoxGeometry (cube)
        if (intersect.object.geometry instanceof THREE.BoxGeometry) {
            console.log("Object Name: " + intersect.object.name);
            console.log("Stored Text: " + intersect.object.userData.textInfo);
            
            // Make the cube less transparent upon click
            intersect.object.material.opacity = 0.8; 
        }
    }
});
