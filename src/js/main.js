//BELOW: The file main.js
// need to fix the issue with zoom out

// IMPORTS
import { updateVisibility, checkIfVisible, radecToXYZ, isDesktop, toggleFullscreen, updateInfoBox,isMobile } from "./service/utils.js";
import { distToCam } from './service/simCalc.js'; 

import allObjects from "./data/spatial-objects.js";
import modifiedStars100LY3K45K from "./data/stars100LY3K45K.js";
import stars100LY45K6K from "./data/stars100LY45K6K.js";
import stars100LY6Kmore from "./data/stars100LY6Kmore.js";
import {updatedMessages, allMessages} from "./data/messages.js";
import allVoyagers from "./data/voyagers.js";
import {navInfo} from './textContents.js';

// Get the Spacekit version of THREE.js.
const THREE = Spacekit.THREE;


// CONSTANTS
const LY_TO_AU = 63241.16; 
let autoAdjustSpeed = true;
let manIcon = document.getElementById("man-icon");


document.addEventListener("DOMContentLoaded", function() {

//INIT SIM
const viz = new Spacekit.Simulation(document.getElementById("main-container"), {
  basePath: "https://typpo.github.io/spacekit/src",
  startDate: Date.now(),
  unitsPerAu: 1.0,
  startPaused: false,
  renderOnlyInViewport: true,
  maxNumParticles: 2**16,
  camera: {
    enableDrift: false,
    initialPosition: [2, -2, 1],
  },
});

// Initialization of simulation controls and refernces
const skybox = viz.createSkybox(Spacekit.SkyboxPresets.ESO_GIGAGALAXY);
const camera = viz.getViewer().get3jsCamera();
const scene = viz.getScene();
const renderer = viz.getRenderer();
//const viewer = viz.getViewer();

// Simulation settings
viz.setJdPerSecond(30);
viz.renderOnlyInViewport();
// THIS SETS THE MAX ZOOMIN and prevents render of planets render when too low.
camera.near = 0.00001; //  good setting: 0.00001
// THIS SETS THE MAX ZOOMOUT
camera.far = 10000000; // Example value
camera.updateProjectionMatrix(); //needed after update of camera near:far

// Camera settings
camera.addEventListener('change', function() {
    autoAdjustSpeed = true;
});

/**
 * @param {number} angle - Angle is half the angular resolution, specified in arcminutes.
 * @param {Object} origin - Coordinates {x, y, z} of the tip of the cone.
 * @param {Object} end - Coordinates {x, y, z} of the center of the base of the cone.
 * @param {number} transparency - Transparency percentage: 0 (opaque) to 100 (fully transparent).
 * @param {number} color - Color of the cone.
 */
function createCone(angle, origin, end, transparency, color) {
  // Convert angle from arcminutes to radians
  const angleInRadians = (angle / 60) * (Math.PI / 180);
  
  // Calculate the height (length) of the cone based on origin and end positions
  const direction = new THREE.Vector3(
      end.x - origin.x,
      end.y - origin.y,
      end.z - origin.z
  );
  const length = direction.length();

  // Calculate the radius of the base using the angle and length
  const radius = length * Math.tan(angleInRadians / 2);
  
  const geometry = new THREE.ConeGeometry(radius, length, 32);
  const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1 - transparency / 100  // Convert percentage to a value between 0 and 1
  });
  
  const cone = new THREE.Mesh(geometry, material);
  
  // Set position of the cone
  cone.position.set(
      (origin.x + end.x) / 2,
      (origin.y + end.y) / 2,
      (origin.z + end.z) / 2
  );

  // Rotate cone to correct orientation with its tip at the origin and base at the end
  const up = new THREE.Vector3(0, -1, 0);
  cone.quaternion.setFromUnitVectors(up, direction.normalize());
  
  return cone;
}

// Example Usage:
// const cone = createCone(300, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 10}, 50, 0xff0000); // Color set to red
// scene.add(cone);


// FUNCTION: Draw a line
function drawLine(viz, start, end, color = 0xff0000) {
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...start), new THREE.Vector3(...end)]);
  const material = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geometry, material);
  viz.getScene().add(line);
  return line;
}

// USAGE EXAMPLE
const start = [0, 0, 0];
const end = [0, 0, LY_TO_AU*1000];
// drawLine(viz, start, end);


const raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 0.05; // 5px threshold for Points
const mouse = new THREE.Vector2();

const pixelToSize = (pixelWidth, distanceToCamera) => {
  const vFOV = viz.getViewer().get3jsCamera().fov * (Math.PI / 180);
  const height = 2 * Math.tan(vFOV / 2) * distanceToCamera;
  const heightPerPixel = height / window.innerHeight;
  return pixelWidth * heightPerPixel;
}

document.addEventListener('click', function(event) {
  console.log("raycaster used");
  
  // Convert mouse position to NDC
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  const averageDistance = 6000000; // Adjust based on your scene's scale
  raycaster.params.Points.threshold = pixelToSize(15, averageDistance);
  raycaster.setFromCamera(mouse, viz.getViewer().get3jsCamera());

  const objectsToCheck = viz.getScene().children.filter(obj => obj.userData && (obj.userData.nameSet || obj.userData.textSet));
  const intersects = raycaster.intersectObjects(viz.getScene().children);

  for (let intersect of intersects) {
      let displayText = "";
      
      if (intersect.object.userData.nameSet && intersect.object.userData.nameSet !== "DefaultName") {
          displayText += "Name Set: " + intersect.object.userData.nameSet + "\n";
      }

      if (intersect.object.userData.textSet && intersect.object.userData.textSet !== "DefaultText") {
          displayText += "Text Set: " + intersect.object.userData.textSet;
      }

      if (displayText) {
          infoBox.textContent = displayText;
          infoBox.appendChild(closeBtn);
          infoBox.style.display = 'block';
      }
  }
});




// // Initialization - run this once when your application loads.
function initObjectForDataset(dataset, scene, type, params, isStatic = false, date = null) {
  dataset.forEach(obj => {
      let object;

      switch (type) {
          case 'sphere':
              const sphereGeometry = new THREE.SphereGeometry(params.radius);
              const sphereMaterial = new THREE.MeshBasicMaterial({ color: params.color });
              object = new THREE.Mesh(sphereGeometry, sphereMaterial);
              break;

          case 'cube':
              const cubeGeometry = new THREE.BoxGeometry(params.size, params.size, params.size);
              const cubeMaterial = new THREE.MeshBasicMaterial({ color: params.color });
              object = new THREE.Mesh(cubeGeometry, cubeMaterial);
              break;

          case 'point': 
              object = new THREE.Points(
                  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0)]),
                  new THREE.PointsMaterial({ 
                      color: params.color, 
                      size: params.size,
                      sizeAttenuation: false  
                  })
              );
              break;
          default:
              break;
      }

      // Storing the nameSet and textSet values in the userData of the object
      object.userData.nameSet = obj.nameSet;
      object.userData.textSet = obj.textSet;

      
      object.visible = false;
      scene.add(object);
      obj.graphicalObject = object;

      // Log to ensure the graphical object contains the nameSet and textSet properties
      console.log(`Object for ID: ${obj.id}`);
      console.log("nameSet:", obj.graphicalObject.userData.nameSet);
      console.log("textSet:", obj.graphicalObject.userData.textSet);

      if (isStatic && date) {
          const position = calculatePosition(obj, date.getTime());

          console.log("Position for object:", obj, "is:", position); // Debugging line

          if (position) {
              obj.graphicalObject.position.set(...position);
              obj.graphicalObject.visible = true;
          } else {
              obj.graphicalObject.visible = false;
          }
      }
  });
}



const staticDate = new Date("2024-01-01")
;

if (isMobile()) {
// Initialisations pour low performance devices (STATIC) - no need to update ontick.
  initObjectForDataset(modifiedStars100LY3K45K, scene, 'point', {color: 'white', size: 1}, true, staticDate);
  initObjectForDataset(stars100LY45K6K, scene, 'point', {color: 'white', size: 2}, true, staticDate);
  initObjectForDataset(stars100LY6Kmore, scene, 'point', {color: 'white', size: 3}, true, staticDate);
} else {
  // Initialisations for high performance devices (Dynamic) - update ontick.(ADD LINE ONTICK)
initObjectForDataset(modifiedStars100LY3K45K, scene, 'point', {color: 'white', size: 1});
initObjectForDataset(stars100LY45K6K, scene, 'point', {color: 'white', size: 2});
initObjectForDataset(stars100LY6Kmore, scene, 'point', {color: 'white', size: 3});
}
// Initialisations pour tous supports (ADD LINE ONTICK if moving)
initObjectForDataset(allVoyagers, scene, 'point', {color: 'red', size: 3});
initObjectForDataset(updatedMessages, scene, 'point', {color: 'red', size: 3});



// SIM LOOP
viz.onTick = function () {
  // Get current date and update UI
  const currentDate = viz.getDate();
  dateElt.innerHTML = currentDate.toLocaleDateString();

  // Calculate the fractional year
  const fractionalYear = currentDate.getFullYear() 
                          + (currentDate.getMonth() / 12) 
                          + (currentDate.getDate() / 365.25);
  yearSlider.value = fractionalYear;


  // Convert current date to time for other calculations
  const dateInMilliseconds = currentDate.getTime();
 
  // Get camera and sun positions
  const cameraPosition = viz.getViewer().get3jsCamera().position;
  const sunPosition = [0, 0, 0];

  // Calculate distance to sun in AU
  const distanceToSunInAU = distToCam(cameraPosition, sunPosition);
  

  const { boundaryDate, resetDate } = getDateBoundariesBasedOnDistance(distanceToSunInAU);
  // Check for date boundary and reset if needed
  if (currentDate >= boundaryDate) {
      viz.setDate(resetDate);
      return;
  }

// Update distance display in AU or LY
let distanceDisplay = document.getElementById("sunDistanceDisplay");

if (distanceToSunInAU < 7000) {  // Threshold set to 7000 AU
  distanceDisplay.innerHTML = `Distance from Sun: ${distanceToSunInAU.toFixed(1)} AU`;
} else {
  const distanceToSunInLY = distanceToSunInAU / 63241.1;  // Convert AU to LY directly
  distanceDisplay.innerHTML = `Distance from Sun: ${distanceToSunInLY.toFixed(1)} LY`;
}

if (autoAdjustSpeed) {
  const desiredSpeed = getSpeedBasedOnDistance(distanceToSunInAU); // Assuming you have this function as per the previous code
  viz.setJdPerSecond(desiredSpeed);
  const speedFactor = desiredSpeed / initialSpeed;
  speedSlider.value = Math.log10(speedFactor);
  updateSpeedDisplay(desiredSpeed); // New function to handle updating the speed display text
}

 // DATASET UPDATES ONTICK


// Tick Update - run this during each simulation tick.
function updateSpheresForDataset(dataset, dateInMilliseconds) {
  dataset.forEach(obj => {
    const position = calculatePosition(obj, dateInMilliseconds);
    if (position) {
      obj.graphicalObject.position.set(...position);
      obj.graphicalObject.visible = true;      
    } else {
      obj.graphicalObject.visible = false;
    }
  });
}
  // Update visibility of spatial objects based on distance limits
  const distVisFrom = 1;  // Lower limit in AU
  const distVisTo = 300;  // Upper limit in AU

//UPDATE STAR POSITIONS
  if (!isMobile()){
    updateSpheresForDataset(modifiedStars100LY3K45K, dateInMilliseconds);
    updateSpheresForDataset(stars100LY45K6K, dateInMilliseconds);
    updateSpheresForDataset(stars100LY6Kmore, dateInMilliseconds);
  }

//UPDATE HUMAN IMPACT

  if (!manIcon.classList.contains("active")) {
    // Update visibility of messages based on distance limits

    // Do not update this on mobile (heavy computations)
    if (!isMobile()){  }


    if (distanceToSunInAU < 1*LY_TO_AU) {
      setPlanetLabelsVisible(true);  //solar system planets labels
      unloadAllObjects(); // unload all objects
     placeObjectsUnified(allVoyagers, dateInMilliseconds, './assets/symbols/Red_Circle_full.png');
     placeObjectsUnified(updatedMessages, dateInMilliseconds, './assets/symbols/Red_Circle_full.png', false);
     updateSpheresForDataset(allVoyagers, dateInMilliseconds);//Update Voyagers POINTS

     allObjects.forEach((point) => {
      updateVisibility(point, dateInMilliseconds, distanceToSunInAU, distVisFrom, distVisTo, viz);
      });

    } else if (distanceToSunInAU > 1*LY_TO_AU && distanceToSunInAU < 300*LY_TO_AU) {
      setPlanetLabelsVisible(false);  
      unloadAllObjects();
      //Lalbels
      placeObjectsUnified(allVoyagers, dateInMilliseconds, './assets/symbols/Red_Circle_full.png', false);
      placeObjectsUnified(updatedMessages, dateInMilliseconds, './assets/symbols/Red_Circle_full.png');
      //points
      updateSpheresForDataset(allVoyagers, dateInMilliseconds);//Update Voyagers POINTS
      updateSpheresForDataset(updatedMessages, dateInMilliseconds); //Update MessagerPOINTS
    } else {

        unloadAllObjects();
        setPlanetLabelsVisible(false);  
    }

  } else {
    
    allObjects.forEach((point) => {
      point.visible = false;
      viz.removeObject(point.newObject);
      });
    unloadAllObjects();
  }




};

// NATURAL OBJECTS
const sun = viz.createObject("sun", Spacekit.SpaceObjectPresets.SUN);
viz.createAmbientLight();
viz.createLight([0, 0, 0]);


let planetObjects = [];

function createSpaceObject(name, label) {
  const object = viz.createObject(name, {
    labelText: label,
    ephem: Spacekit.EphemPresets[name.toUpperCase()]
  });
  return object;
}

const planetData = [
  { name: "mercury", label: "Mercury" },
  { name: "venus", label: "Venus" },
  { name: "mars", label: "Mars" },
  { name: "uranus", label: "Uranus" },
  { name: "saturn", label: "Saturn" },
  { name: "neptune", label: "Neptune" },
  { name: "jupiter", label: "Jupiter" },
  { name: "pluto", label: "Pluto" },
  

];

planetData.forEach((planet) => {
  const object = createSpaceObject(planet.name, planet.label);
  planetObjects.push(object);
}); 

const moon = createSpaceObject("moon");
const earth = createSpaceObject("earth", "Earth");
// earth.setLabelVisibility(false);

moon.orbitAround(earth);

function createCelestialSphere(id, options) {
  return viz.createSphere(id, {
    textureUrl: options.textureUrl,
    radius: options.radius / 149598000,
    ephem: Spacekit.EphemPresets[options.ephem],
    levelsOfDetail: [
      { radii: 0, segments: 64 },
      { radii: 30, segments: 16 },
      { radii: 60, segments: 8 },
    ],
    atmosphere: {
      enable: options.atmosphere,
      color: 0xc7c1a8,
    },
    rotation: {
      enable: true,
      speed: options.rotationSpeed,
    },
    occludeLabels: true,
  });
}

const earthV = createCelestialSphere("earthV", {
  textureUrl: "https://raw.githubusercontent.com/typpo/spacekit/master/examples/planet/eso_earth.jpg",
  radius: 6371,
  ephem: "EARTH",
  rotationSpeed: 0.3,
  atmosphere:'true',
});

const earthLightsV = createCelestialSphere("earthLightsV", {
  textureUrl: "./assets/maps/lightsred.png",
  radius: 6380,
  ephem: "EARTH",
  rotationSpeed: 0.3,
  atmosphere:'false'
});

const marsV = createCelestialSphere("marsV", {
  textureUrl: "./assets/maps/Mars.png",
  radius: 3389,
  ephem: "MARS",
  rotationSpeed: 0.1,
  atmosphere:'true'
});

const moonV = createCelestialSphere("moonV", {
  textureUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Moon_map_grid_showing_artificial_objects_on_moon.PNG/1280px-Moon_map_grid_showing_artificial_objects_on_moon.PNG",
  radius: 1737,
  ephem: "MOON",
  rotationSpeed: 0.01,
  atmosphere: false
});
moonV.orbitAround(earthV);

const jupiter3 = createCelestialSphere("jupiter3", {
  textureUrl: "https://raw.githubusercontent.com/typpo/spacekit/master/examples/jupiter_in_the_solar_system/jupiter2_4k.jpg",
  radius: 71492,
  ephem: "JUPITER",
  rotationSpeed: 2,
  atmosphere:'true'
});




// UI HTML
function toggleManColor() {
  var manIcon = document.getElementById("man-icon");
  if (manIcon.classList.contains("active")) {
      manIcon.classList.remove("active");
  } else {
      manIcon.classList.add("active");
  }
}
document.getElementById("human-icon-btn").addEventListener("click", toggleManColor);

// UI ELEMENTS
document.getElementById('parameters-btn').addEventListener('click', function() {
  const menu = document.getElementById('parameters-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('show-planet-labels').addEventListener('change', function(event) {
  const showLabels = event.target.checked;
  // Your code to toggle planet labels on/off
});

// init Mobile:
if (isMobile()) {
  document.getElementById('fullscreen-btn').style.display = 'none';
}
const dateElt = document.getElementById("current-date");
const speedDisplay = document.getElementById('speed-display');
const speedSlider = document.getElementById('speed-slider');
const initialSpeed = viz.getJdPerSecond();

speedSlider.addEventListener("input", (event) => {
  autoAdjustSpeed = false; // set to false because user is manually adjusting
  const speedFactor = Math.pow(10, parseFloat(event.target.value));
  const daysPerSecond = initialSpeed * speedFactor; 
  viz.setJdPerSecond(daysPerSecond);
  updateSpeedDisplay(daysPerSecond);
});

function getSpeedBasedOnDistance(distanceToSunInAU) {
  let speed;
  if (distanceToSunInAU < 100) {
    speed = 10;  // Whatever value you want
  } else if (distanceToSunInAU < 200) {
    speed = 500; // Adjust values as needed
  } else {
    speed = 600; // Adjust values as needed
  }
  return speed;
}

function getDateBoundariesBasedOnDistance(distanceToSunInAU) {
  let boundaryDate, resetDate;

  if (distanceToSunInAU < 100) {
      boundaryDate = new Date('2030-01-01');
      resetDate = new Date('1950-01-01');
  } else if (distanceToSunInAU < 200) {
      boundaryDate = new Date('2030-01-01');
      resetDate = new Date('1990-01-01');
  } else {
      boundaryDate = new Date('2030-01-01');
      resetDate = new Date('2000-01-01');
  }

  return { boundaryDate, resetDate };
}

function updateSpeedDisplay(daysPerSecond) {
  let speedText;
  if (daysPerSecond < 30) {
      speedText = `Speed: ${daysPerSecond.toFixed(1)} day/sec`;
  } else if (daysPerSecond < 365.25) {
      const monthsPerSecond = daysPerSecond / 30.44;
      speedText = `Speed: ${monthsPerSecond.toFixed(1)} month/sec`;
  } else {
      const yearsPerSecond = daysPerSecond / 365.25;
      speedText = `Speed: ${yearsPerSecond.toFixed(1)} year/sec`;
  }

  speedDisplay.textContent = speedText;
}

const yearSlider = document.getElementById("year-slider");
yearSlider.addEventListener("input", (event) => {
    viz.setDate(new Date(`${parseInt(event.target.value)}-01-01`));
});

const decSlider = document.getElementById("DECSLIDER");
const raSlider = document.getElementById("RASLIDER");
let dec = 0, ra = 0, starPositions = [];


decSlider.addEventListener("input", (event) => {
    dec = parseInt(event.target.value);
    updateStars();
});

raSlider.addEventListener("input", (event) => {
    ra = parseInt(event.target.value);
    updateStars();
});

// UI ELEMENTS II
// Setup navigation buttons

function setupButton(id, obj1, params1, zoom1, obj2, params2, zoom2) {
  document.getElementById(id).onclick = function () {
      const viewer = viz.getViewer();
      viewer.followObject(obj1, params1);
      viz.zoomToFit(obj1, zoom1);
      unloadAllObjects();
      if (obj2 && params2 && zoom2) {
          setTimeout(() => {
              viewer.followObject(obj2, params2);
              viz.zoomToFit(obj2, zoom2);
              unloadAllObjects();
          }, 20);
      }
  };
}

// Assign actions to buttons
setupButton("btn-Messages", sun, [1, 2, 1], 3000000);
setupButton("btn-far", sun, [2, 2, 2], 150);
setupButton("btn-system",sun, [2, 2, 2], 2);
setupButton("btn-earth", sun, [-0.75, -0.75, 0.5], 300000000, earthV, [2, 0, 0], 0.00003);
setupButton("btn-mars", sun, [-0.75, -0.75, 0.5], 300000000, marsV, [2, 0, 0], 0.00001);
setupButton("btn-moon", sun, [-0.75, -0.75, 0.5], 300000000, moonV, [2, 0, 0], 0.003);

let isPaused = false;
const startStopButton = document.getElementById('start-stop-btn');
const startIcon = document.getElementById('start-icon');
const pauseIcon = document.getElementById('pause-icon');

startStopButton.onclick = function () {
    autoAdjustSpeed = true;  
    isPaused ? viz.start() : viz.stop();
    startIcon.style.display = isPaused ? "inline-block" : "none";
    pauseIcon.style.display = isPaused ? "none" : "inline-block";
    isPaused = !isPaused;
};

// UI ELEMENTS III info Box, nav buttons
const infoBox = document.getElementById('info-box');
const closeBtn = document.getElementById('close-btn');

const showInfoOnClick = (event) => {
    if (navInfo[event.target.id]) {
        infoBox.textContent = navInfo[event.target.id] + " ";
        infoBox.appendChild(closeBtn);
        infoBox.style.display = 'block';
    }
};

const closeInfoBox = () => {
    infoBox.style.display = 'none';
};

// Attach event listeners to nav buttons
for (let key in navInfo) {
    const btn = document.getElementById(key);
    if (btn) {
        btn.addEventListener('click', showInfoOnClick);
    }
}

// Close info box on close button click
closeBtn.addEventListener('click', closeInfoBox);

// Fullscreen mode
document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);



// FUNCTION: PLACE OBJECTS
// Global storage for object groups
let objectGroups = {};

// Function to generate a hash based on object IDs
function hashObjectArray(objects) {
  return objects.map(obj => obj.id).sort().join(',');
}

// Main function to place objects
function placeObjectsUnified(objects, date, textureUrl, labelVisible = true) {
  const groupName = hashObjectArray(objects);  // Generate a unique groupName

  // Remove previously added objects for this group
  if (objectGroups[groupName]) {
    objectGroups[groupName].forEach(objData => {
      viz.removeObject(objData.object);
    });
  }

  // Initialize or clear the array for this group
  objectGroups[groupName] = [];

  objects.forEach(obj => {
    // Filtering based on 'dateSent' and 'endDate'
    if ('dateSent' in obj && date < new Date(obj.dateSent).getTime()) return;
    if ('endDate' in obj && date > new Date(obj.endDate).getTime()) return;

    // Calculate time difference
    const timeDifference = date - new Date(obj.epoch).getTime();

    // Adjusted RA, Dec, and R
    const adjustedRA = obj.ra + obj.vra * timeDifference * 8.78e-15;
    const adjustedDec = obj.dec + obj.vdec * timeDifference * 8.78e-15;
    const adjustedR = obj.r + (6.68459e-9 * obj.vr) * timeDifference / 1000;

    const position = radecToXYZ(adjustedRA, adjustedDec, adjustedR);

    if (adjustedR < 0) return;

    // Create and add object to visualization
    const singleObject = viz.createObject(obj.id, {
      position: position,
      scale: [0.0001, 0.0001, 0.0001],
      particleSize: 1,
      labelText: obj.id,
      textureUrl: textureUrl
    });

    singleObject.setLabelVisibility(labelVisible);

    // Store in the global object group with both object and its position
    objectGroups[groupName].push({
      object: singleObject,
      position: position
    });
  });
}

function unloadAllObjects() {
  const scene = viz.getScene();

  for (let group in objectGroups) {
    objectGroups[group].forEach(objData => {
      viz.removeObject(objData.object);
      if (objData.attachedSphere) {
        scene.remove(objData.attachedSphere);
      }
    });

    objectGroups[group] = [];
  }
}


//LABEL VISIBILITY
// argument: true or false
function setPlanetLabelsVisible(isVisible) {
  planetObjects.forEach((planetObject) => {
    planetObject.setLabelVisibility(isVisible);
  });
}


function calculatePosition(obj, date) {
  // Filtering based on 'dateSent' and 'endDate'
  if ('dateSent' in obj && date < new Date(obj.dateSent).getTime()) return false;
  if ('endDate' in obj && date > new Date(obj.endDate).getTime()) return false;

  // Calculate time difference
  const timeDifference = date - new Date(obj.epoch).getTime();

  // Adjusted RA, Dec, and R
  const adjustedRA = obj.ra + obj.vra * timeDifference * 8.78e-15;
  const adjustedDec = obj.dec + obj.vdec * timeDifference * 8.78e-15;
  const adjustedR = obj.r + (6.68459e-9 * obj.vr) * timeDifference / 1000;

  if (adjustedR < 0) return false;

  return radecToXYZ(adjustedRA, adjustedDec, adjustedR);
}


});
