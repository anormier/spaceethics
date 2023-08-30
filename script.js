//BELOW: The file script.JS
import allObjects from "./spatial-objects.js";
import { checkIfVisible, radecToXYZ, isDesktop } from "./utils.js";
import stars100LY3K45K from "./stars100LY3K45K.js";
import stars100LY45K6K from "./stars100LY45K6K.js";
import stars100LY6Kmore from "./stars100LY6Kmore.js";
import allMessages from "./messages.js";
import allVoyagers from "./voyagers.js";

const LY_TO_AU = 63241.16; 
const debugAxesCheckbox = document.getElementById('debugAxesCheckbox');
debugAxesCheckbox.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    viz.setDebugOptions({
        showAxes: isChecked
    });
});
let debugAxesInitialStatus = debugAxesCheckbox.checked;


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
  debug: {
    showAxes: debugAxesInitialStatus,
    showGrid: debugAxesInitialStatus,
    showStats: debugAxesInitialStatus,
  },
});

const skybox = viz.createSkybox(Spacekit.SkyboxPresets.ESO_GIGAGALAXY);
viz.setJdDelta(viz.getJdDelta() * 0.02);

viz.onTick = function () {
  const d = viz.getDate();
  dateElt.innerHTML = d.toLocaleDateString();

 // Calculate the current year fractionally
  const fractionalYear = d.getFullYear() + (d.getMonth() / 12) + (d.getDate() / 365.25);
  yearSlider.value = fractionalYear;

  // Check if date has reached 1st January 2030
  if (d >= new Date('2030-01-01')) {
    viz.setDate(new Date('1950-01-01')); // Reset to 1950
    return;  // Return here to skip further operations for this tick
  }
  const date = d.getTime();

  // Update stars
if (isDesktop()) { 
  unifiedPlaceStars(stars100LY3K45K, date, 8, 'white', 'stars1');
  unifiedPlaceStars(stars100LY45K6K, date, 10, 'white', 'stars2');
  unifiedPlaceStars(stars100LY6Kmore, date, 15, 'white', 'stars3');
} 



  
  // Update voyagers
  placeObjects(allVoyagers, date, './assets/Red_Circle_full.png');

  // Update other spatial objects
  allObjects.forEach((point) => {
    const pointShouldAppear = checkIfVisible(point, date);

    if (!pointShouldAppear) {
      point.visible = false;
      viz.removeObject(point.newObject);
      return;
    }
    if (!point.visible) {
      point.visible = true;
      point.newObject = viz.createObject(point.name, point.characteristics);
    }
  });
};

const dateElt = document.getElementById("current-date");
const speedDisplay = document.getElementById('speed-display');
const speedSlider = document.getElementById('speed-slider');
const initialSpeed = viz.getJdDelta();

speedSlider.addEventListener("input", function(event) {
    const logValue = parseFloat(event.target.value);
    const speedFactor = Math.pow(10, logValue);
    viz.setJdDelta(initialSpeed * speedFactor);
    speedDisplay.textContent = `Speed: ${speedFactor.toFixed(3)}x`;
});

const yearSlider = document.getElementById("year-slider");
yearSlider.addEventListener("input", (event) => {
  const selectedYear = parseInt(event.target.value);
  viz.setDate(new Date(`${selectedYear}-01-01`));
});

const decSlider = document.getElementById("DECSLIDER");
const raSlider = document.getElementById("RASLIDER");
let dec = 0
let ra = 0
let starPositions = [];
// Dès que le slider DEC est modifié, on actualise la variable dec et on repositionne les étoiles
decSlider.addEventListener("input", (event) => {
  dec = parseInt(event.target.value);
  placeStars(stars100LY3K45K)
});
// Dès que le slider RA est modifié, on actualise la variable dec et on repositionne les étoiles
raSlider.addEventListener("input", (event) => {
  ra = parseInt(event.target.value);
  placeStars(stars100LY3K45K)
});



// NATURAL OBJECTS
const sun = viz.createObject("sun", Spacekit.SpaceObjectPresets.SUN);
viz.createAmbientLight();
viz.createLight([0, 0, 0]);

function createSpaceObject(name, label) {
  return viz.createObject(name, {
    labelText: label,
    ephem: Spacekit.EphemPresets[name.toUpperCase()]
  });
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

planetData.forEach(planet => createSpaceObject(planet.name, planet.label));

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

const marsV = createCelestialSphere("marsV", {
  textureUrl: "./maps/Mars.png",
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
  }
}

// Assigning actions to the buttons
setupButton("btn-Messages", sun, [1, 2, 1], 1000000);
setupButton("btn-local", sun, [2, 2, 2], 2);
setupButton("btn-system", sun, [2, 2, 2], 2);
setupButton("btn-earth", sun, [-0.75, -0.75, 0.5], 10000, earthV, [2, 0, 0], 0.00003);
setupButton("btn-mars", sun, [-0.75, -0.75, 0.5], 10000, marsV, [2, 0, 0], 0.00001);
setupButton("btn-moon", sun, [-0.75, -0.75, 0.5], 10000, moonV, [2, 0, 0], 0.003);


let isPaused = false; 

const startStopButton = document.getElementById('start-stop-btn');
const startIcon = document.getElementById('start-icon');
const pauseIcon = document.getElementById('pause-icon');

startStopButton.onclick = function () {
    isPaused ? viz.start() : viz.stop();
    startIcon.style.display = isPaused ? "inline-block" : "none";
    pauseIcon.style.display = isPaused ? "none" : "inline-block";
    isPaused = !isPaused;
};


const mxDotPositions = [];
// Function to calculate and push positions using radecToXYZ
function calculatePositions(mx, multiplier) {
  let count;
  if (isDesktop()) {
      count = 1000;
  } else {
      count = 100;
  }
  for (let i = 1; i < count; i++) {
    const r = i * (LY_TO_AU * mx.dist) / (count * multiplier);
    const position = radecToXYZ(mx.ra + ra, mx.dec + dec, r);
    mxDotPositions.push(position);
  }
}
allMessages.forEach(mx => {
  calculatePositions(mx, 1);
// calculatePositions(mx, 100);
// calculatePositions(mx, 1000);
});
viz.createStaticParticles('mx', mxDotPositions, {
   defaultColor: 'red',
   size: 5,
});

//messages destinations

 const mxPositions = [];

allMessages.forEach((mx) => {  
  mxPositions.push(radecToXYZ(mx.ra + ra,mx.dec + dec,63241.16 * mx.dist))
});

viz.createStaticParticles('mx', mxPositions, {
   defaultColor: 'red',
   size: 20,
 });

///SEPARATor///SEPARATor///SEPARATor///SEPARATor///SEPARATor///SEPARATor

 document.getElementById("btn-local").onclick = function () {
  viz.getViewer().followObject(sun, [1e2, 1e2, 1e2]);
  viz.zoomToFit(sun, 1e2);
};

////


document.getElementById('fullscreen-btn').addEventListener('click', function() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      // If not in fullscreen mode, enter it
      if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
      }
  } else {
      // If in fullscreen mode, exit it
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
      }
  }
});

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




//////////////
// A list to keep track of previously added objects.
let previouslyAddedObjects = [];

function placeObjects(objects, date, textureUrl) {
  // Remove previously added objects and clear the list.
  previouslyAddedObjects.forEach(viz.removeObject);
  previouslyAddedObjects = [];
  
  objects.forEach(obj => {
    const timeDifference = date - new Date(obj.epoch).getTime();
    const adjustedRA = obj.ra + obj.vra * timeDifference * 8.78e-15;
    const adjustedDec = obj.dec + obj.vdec * timeDifference * 8.78e-15;
    const adjustedR =  obj.r + (6.68459e-9 * obj.vr) * timeDifference / 1000;
    const position = radecToXYZ(adjustedRA, adjustedDec, adjustedR);

    const singleObject = viz.createObject(obj.id, {
      position: position,
      scale: [1, 1, 1],
      particleSize: 5,
      labelText: obj.id,
      textureUrl:textureUrl
    });

    previouslyAddedObjects.push(singleObject);
  });
}

const infoBox = document.getElementById('info-box');
const closeBtn = document.getElementById('close-btn');

const navInfo = {
  'btn-earth': 'Human impact is evident on Earth. Our Species is to propagating this impact beyond earth. Through space technologies. Here we will display <span style="color:red;">launch bases</span>,  and facilities such as <span style="color:red;">radar astronomy telescopes</span> , being used for sending messages to space. We'll also display <span style="color:red;">satellites</span> around earth',
  
  'btn-moon': 'The Moon, Earth’s natural satellite, bears the scars of our exploration. There are artificial impact craters, remnants of landers, rovers, and artificial satellites left behind by various missions.',
  
  'btn-mars': 'Mars, the Red Planet, has also felt our touch. We have sent landers, rovers, and artificial satellites, all aiming to understand this intriguing world better.',
  
  'btn-system': 'Throughout the Solar System, our presence is felt. There are probes exploring distant worlds, debris left behind by missions, and byproducts like despin weights that have been jettisoned.',
  
  'btn-local': 'Far Probes cover missions that have traveled great distances, like the Voyager probes. These ambassadors carry our message into the interstellar void.',
  
  'btn-Messages': 'Messages sent to the stars trace our hopes and dreams. These signals, beamed into space, travel lightyears away, aiming to communicate with potential extraterrestrial civilizations.'
};

// Function to show info on click
function showInfoOnClick(event) {
    if (navInfo[event.target.id]) {
        infoBox.textContent = navInfo[event.target.id] + " ";
        infoBox.appendChild(closeBtn); // Ensure the close button remains
        infoBox.style.display = 'block';
    }
}

// Function to close the info box
function closeInfoBox() {
    infoBox.style.display = 'none';
}

// Attach event listeners to nav buttons
for (let key in navInfo) {
    const btn = document.getElementById(key);
    if (btn) {
        btn.addEventListener('click', showInfoOnClick);
    }
}

// Close the info box when the close button is clicked
closeBtn.addEventListener('click', closeInfoBox);
