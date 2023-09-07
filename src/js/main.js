//BELOW: The file main.js

// IMPORTS
import { updateVisibility, checkIfVisible, radecToXYZ, isDesktop, toggleFullscreen, updateInfoBox,isMobile } from "./service/utils.js";
import { distToCam } from './service/simCalc.js'; 

import allObjects from "./data/spatial-objects.js";
import stars100LY3K45K from "./data/stars100LY3K45K.js";
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

const skybox = viz.createSkybox(Spacekit.SkyboxPresets.ESO_GIGAGALAXY);
viz.setJdPerSecond(30);
viz.renderOnlyInViewport();
const camera = viz.getViewer().get3jsCamera();
camera.addEventListener('change', function() {
    autoAdjustSpeed = true;
});

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
  // Update stars if on a desktop
  if (isDesktop()) { 
    unifiedPlaceStars(stars100LY3K45K, dateInMilliseconds, 8, 'white', 'stars1');
    unifiedPlaceStars(stars100LY45K6K, dateInMilliseconds, 10, 'white', 'stars2');
  }
  unifiedPlaceStars(stars100LY6Kmore, dateInMilliseconds, 15, 'white', 'stars3');

  // Update visibility of spatial objects based on distance limits
  const distVisFrom = 1;  // Lower limit in AU
  const distVisTo = 300;  // Upper limit in AU
  allObjects.forEach((point) => {
    updateVisibility(point, dateInMilliseconds, distanceToSunInAU, distVisFrom, distVisTo, viz);
  });

  if (!manIcon.classList.contains("active")) {
    if (distanceToSunInAU < 500) {
      placeObjectsUnified(allVoyagers, dateInMilliseconds, './assets/symbols/Red_Circle_full.png');
    } else {
      placeObjectsUnified(updatedMessages, dateInMilliseconds, './assets/symbols/Red_Circle_full.png');
    }
  } else {
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
  { name: "pluto", label: "Pluto" }

];

planetData.forEach((planet) => {
  const object = createSpaceObject(planet.name, planet.label);
  planetObjects.push(object);
}); 

const moon = createSpaceObject("moon", "moon");
const earth = createSpaceObject("earth", "Earth");


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
    occludeLabels: true
  });
}

const earthV = createCelestialSphere("earthV", {
  textureUrl: "https://raw.githubusercontent.com/typpo/spacekit/master/examples/planet/eso_earth.jpg",
  radius: 6371,
  ephem: "EARTH",
  rotationSpeed: 0.3,
  atmosphere:'true'
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
  } else if (distanceToSunInAU < 600) {
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
  } else if (distanceToSunInAU < 600) {
      boundaryDate = new Date('2030-01-01');
      resetDate = new Date('1970-01-01');
  } else {
      boundaryDate = new Date('2030-01-01');
      resetDate = new Date('1974-01-01');
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
        
        if (obj2 && params2 && zoom2) {
            setTimeout(() => {
                viewer.followObject(obj2, params2);
                viz.zoomToFit(obj2, zoom2);
            }, 20);
        }
    };
}

// Assign actions to buttons
setupButton("btn-Messages", sun, [1, 2, 1], 1000000);
setupButton("btn-far", sun, [2, 2, 2], 100);
setupButton("btn-system", sun, [2, 2, 2], 2);
setupButton("btn-earth", sun, [-0.75, -0.75, 0.5], 10000, earthV, [2, 0, 0], 0.00003);
setupButton("btn-mars", sun, [-0.75, -0.75, 0.5], 10000, marsV, [2, 0, 0], 0.00001);
setupButton("btn-moon", sun, [-0.75, -0.75, 0.5], 10000, moonV, [2, 0, 0], 0.003);

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

// UI ELEMENTS III
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



// MOVING DATASETS: THREE FUNCTIONS: messages, stars, labeled obj (not working ok)

const updateStars = () => {
  placeStars(stars100LY3K45K);
};

// // FUNCTION: PLACE MESSAGES
// const mxDotPositions = [];
// // Function to calculate and push positions using radecToXYZ
// function calculatePositions(mx, multiplier) {
//   let count;
//   if (isDesktop()) {
//       count = 1000;
//   } else {
//       count = 10;
//   }
//   for (let i = 1; i < count; i++) {
//     const r = i * (LY_TO_AU * mx.dist) / (count * multiplier);
//     const position = radecToXYZ(mx.ra + ra, mx.dec + dec, r);
//     mxDotPositions.push(position);
//   }
// }
// allMessages.forEach(mx => {
//   calculatePositions(mx, 1);
// // calculatePositions(mx, 100);
// // calculatePositions(mx, 1000);
// });
// viz.createStaticParticles('mx', mxDotPositions, {
//    defaultColor: 'red',
//    size: 5,
// });

// //messages destinations

//  const mxPositions = [];

// allMessages.forEach((mx) => {  
//   mxPositions.push(radecToXYZ(mx.ra + ra,mx.dec + dec,63241.16 * mx.dist))
// });

// viz.createStaticParticles('mx', mxPositions, {
//    defaultColor: 'red',
//    size: 20,
//  });


// FUNCTION: PLACE MOVING STARS (or PARTICULES)
let starParticleObjects = {};

function unifiedPlaceStars(stars, date, size, color, particleName) {
  let starPositions = [];

  if (starParticleObjects[particleName]) {
    viz.removeObject(starParticleObjects[particleName]);
  }

  const placeStar = (star) => {
    const timeDifference = date - new Date(star.eopch).getTime();
    const adjustedRA = star.ra + ra + star.vra * timeDifference * 8.78e-15;
    const adjustedDec = star.dec + dec + star.vdec * timeDifference * 8.78e-15;
    const adjustedRmed = 206265*star.rmed + (6.68459e-9* star.vrmed) * timeDifference/1000;

    starPositions.push(radecToXYZ(adjustedRA, adjustedDec, adjustedRmed));
  };

  stars.forEach(star => placeStar(star));

  starParticleObjects[particleName] = viz.createStaticParticles(particleName, starPositions, {
    defaultColor: color,
    size: size,
  });
};


// FUNCTION: PLACE OBJECTS WITH LABELS - (NOT WORKING PROPERLY)
// A list to keep track of previously added objects.
let previouslyAddedObjects = [];

function placeObjects(objects, date, textureUrl) {
  // Remove previously added objects and clear the list.
  previouslyAddedObjects.forEach(obj => {
    viz.removeObject(obj)
  });
  previouslyAddedObjects = [];
  
  objects.forEach(obj => {
    // Check if the 'dateSent' parameter exists
    if ('dateSent' in obj) {
      if (date < new Date(obj.dateSent).getTime()) {
        return; // skip this iteration
      }
    }
  
    // Check if the 'endDate' parameter exists
    if ('endDate' in obj) {
      if (date > new Date(obj.endDate).getTime()) {
        return; // skip this iteration
      }
    }
  
   

    // Calculate time difference
    const timeDifference = date - new Date(obj.epoch).getTime();
  
    // Calculate adjusted RA, Dec, and R
    const adjustedRA = obj.ra + obj.vra * timeDifference * 8.78e-15;
    const adjustedDec = obj.dec + obj.vdec * timeDifference * 8.78e-15;
    const adjustedR = obj.r + (6.68459e-9 * obj.vr) * timeDifference / 1000;
  
    // Convert RA and Dec to XYZ coordinates
    const position = radecToXYZ(adjustedRA, adjustedDec, adjustedR);
  
      if (adjustedR < 0) {
        return; // skip this iteration
      }

    // Debugging: Log position if object ID is 'New Horizon'
    if (obj.id === "New Horizon") {
      console.log(adjustedR);
    }
  
    // Create and add object to visualization
    const singleObject = viz.createObject(obj.id, {
      position: position,
      scale: [1, 1, 1],
      particleSize: 5,
      labelText: obj.id,
      textureUrl: textureUrl
    });
  
    // Add to array of previously added objects
    previouslyAddedObjects.push(singleObject);
  });
  
}


// FUNCTION: PLACE OBJECTS WITH LABELS - (NOT WORKING PROPERLY)
// Global storage for object groups
let objectGroups = {};

// Function to generate a hash based on object IDs
function hashObjectArray(objects) {
  let ids = objects.map(obj => obj.id).sort().join(',');
  return ids;
}

// Main function to place objects
function placeObjectsUnified(objects, date, textureUrl) {
  const groupName = hashObjectArray(objects);  // Generate unique groupName

  // Remove previously added objects for this group
  if (objectGroups[groupName]) {
    objectGroups[groupName].forEach(obj => {
      viz.removeObject(obj);
    });
  }

  // Initialize or clear the array for this group
  objectGroups[groupName] = [];

  objects.forEach(obj => {
    // Check if the 'dateSent' parameter exists
    if ('dateSent' in obj) {
      if (date < new Date(obj.dateSent).getTime()) {
        return; // skip this iteration
      }
    }

    // Check if the 'endDate' parameter exists
    if ('endDate' in obj) {
      if (date > new Date(obj.endDate).getTime()) {
        return; // skip this iteration
      }
    }

    // Calculate time difference
    const timeDifference = date - new Date(obj.epoch).getTime();

    // Calculate adjusted RA, Dec, and R
    const adjustedRA = obj.ra + obj.vra * timeDifference * 8.78e-15;
    const adjustedDec = obj.dec + obj.vdec * timeDifference * 8.78e-15;
    const adjustedR = obj.r + (6.68459e-9 * obj.vr) * timeDifference / 1000;

    // Convert RA and Dec to XYZ coordinates
    const position = radecToXYZ(adjustedRA, adjustedDec, adjustedR);

    if (adjustedR < 0) {
      return; // skip this iteration
    }

    // Debugging: Log position if object ID is 'New Horizon'
    if (obj.id === "New Horizon") {
      console.log(adjustedR);
    }

    // Create and add object to visualization
    const singleObject = viz.createObject(obj.id, {
      position: position,
      scale: [1, 1, 1],
      particleSize: 5,
      labelText: obj.id,
      textureUrl: textureUrl
    });

    // Add to array of previously added objects for this group
    objectGroups[groupName].push(singleObject);
  });
}

function unloadAllObjects() {
  // Loop through all object groups
  for (let group in objectGroups) {
    // Remove each object from the visualization
    objectGroups[group].forEach(obj => {
      viz.removeObject(obj);
    });

    // Clear the array for this group
    objectGroups[group] = [];
  }
}

});