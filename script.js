
import allObjects from "./spatial-objects.js";
import { checkIfVisible } from "./utils.js";
import allStars from "./galaxy.js";
import allMessages from "./messages.js";


const viz = new Spacekit.Simulation(document.getElementById("main-container"), {
  basePath: "https://typpo.github.io/spacekit/src",
  startDate: Date.now(),
  unitsPerAu: 1.0,
  camera: {
    enableDrift: false,
    initialPosition: [2, -2, 1],
  },
});


function drawline() {
  return [
    getAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 0, 0), 0xff0000),
  ];
};



// Create a background
 const skybox = viz.createSkybox(Spacekit.SkyboxPresets.ESO_GIGAGALAXY);

// Set simulation speed
viz.setJdDelta(viz.getJdDelta() * 0.02);

// Set Controls
// document.getElementById('btn-start').onclick = function () {
//   viz.start();
// };
// document.getElementById('btn-stop').onclick = function () {
//   viz.stop();
//};
//document.getElementById('btn-set-time').onclick = function () {
//viz.setDate(new Date(prompt('Enter a date (YYYY-mm-dd)')));
//};

//show date
const dateElt = document.getElementById("current-date");

viz.onTick = function () {
  var d = viz.getDate();
  dateElt.innerHTML = d.toLocaleDateString();

  const date = d.getTime();

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

document.getElementById("btn-faster").onclick = function () {
  viz.setJdDelta(viz.getJdDelta() * 1.5);
};

document.getElementById("btn-slower").onclick = function () {
  viz.setJdDelta(viz.getJdDelta() * 0.5);
};

// document.getElementById("1950").onclick = function () {
//   viz.setDate(new Date("1950-01-01"));
// };

// document.getElementById("1960").onclick = function () {
//   viz.setDate(new Date("1960-01-01"));
// };

// document.getElementById("1970").onclick = function () {
//   viz.setDate(new Date("1970-01-01"));
// };

// document.getElementById("1980").onclick = function () {
//   viz.setDate(new Date("1980-01-01"));
// };


// document.getElementById("1990").onclick = function () {
//   viz.setDate(new Date("1990-01-01"));
// };

// document.getElementById("2000").onclick = function () {
//   viz.setDate(new Date("2000-01-01"));
// };

// document.getElementById("2010").onclick = function () {
//   viz.setDate(new Date("2010-01-01"));
// };

// document.getElementById("Today").onclick = function () {
//   viz.setDate(Date.now());
// };


// CHAT GPT HERE
const yearSlider = document.getElementById("year-slider");

yearSlider.addEventListener("input", (event) => {
  const selectedYear = parseInt(event.target.value);
  viz.setDate(new Date(`${selectedYear}-01-01`));
});

const decSlider = document.getElementById("DECSLIDER");

const dec = 0
const ra = 0

decSlider.addEventListener("input", (event) => {
   dec = parseInt(event.target.value);
});

// NATURAL OBJECTS
const sun = viz.createObject("sun", Spacekit.SpaceObjectPresets.SUN);
viz.createAmbientLight();
viz.createLight([0, 0, 0]);





// planets.forEach(planet => {
//   viz.createObject(planet.name, planet);
// })
// // Then add some planets
viz.createObject("mercury", {
  labelText: "Mercury",
  ephem: Spacekit.EphemPresets.MERCURY,
});
viz.createObject("venus", {
  labelText: "Venus",
  ephem: Spacekit.EphemPresets.VENUS,
});
viz.createObject("mars", {
  labelText: "Mars",
  ephem: Spacekit.EphemPresets.MARS,
});
viz.createObject("uranus", {
  labelText: "Uranus",
  ephem: Spacekit.EphemPresets.URANUS,
});
viz.createObject("saturn", {
  labelText: "Saturn",
  ephem: Spacekit.EphemPresets.SATURN,
});
viz.createObject("naptune", {
  labelText: "Neptune",
  ephem: Spacekit.EphemPresets.NEPTUNE,
});
viz.createObject("jupiter", {
  labelText: "Jupiter",
  ephem: Spacekit.EphemPresets.JUPITER,
});

const moon = viz.createObject("moon", {
  labelText: "moon",
  ephem: Spacekit.EphemPresets.MOON,
});

const earth = viz.createObject("earth", {
  labelText: "Earth",
  ephem: Spacekit.EphemPresets.EARTH,
});

moon.orbitAround(earth);

const earthV = viz.createSphere("earthV", {
  textureUrl:
    "https://raw.githubusercontent.com/typpo/spacekit/master/examples/planet/eso_earth.jpg",
  radius: 6371 / 149598000,
  ephem: Spacekit.EphemPresets.EARTH,
  levelsOfDetail: [
    { radii: 0, segments: 64 },
    { radii: 30, segments: 16 },
    { radii: 60, segments: 8 },
  ],
  atmosphere: {
    enable: true,
    color: 0xc7c1a8,
  },
  rotation: {
    enable: true,
    speed: 0.3,
  },
});

const marsV = viz.createSphere("marsV", {
  textureUrl:
    "./maps/Mars.png",
  radius: 3389 / 149598000,
  ephem: Spacekit.EphemPresets.MARS,
  levelsOfDetail: [
    { radii: 0, segments: 64 },
    { radii: 30, segments: 16 },
    { radii: 60, segments: 8 },
  ],
  atmosphere: {
    enable: true,
    color: 0xc7c1a8,
  },
  rotation: {
    enable: true,
    speed: 0.1,
  },
});

const moonV = viz.createSphere("moonV", {
  textureUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Moon_map_grid_showing_artificial_objects_on_moon.PNG/1280px-Moon_map_grid_showing_artificial_objects_on_moon.PNG",
  radius: 1737 / 149598000,
  ephem: Spacekit.EphemPresets.MOON,
  levelsOfDetail: [
    { radii: 0, segments: 64 },
    { radii: 30, segments: 16 },
    { radii: 60, segments: 8 },
  ],
  atmosphere: {
    enable: true,
    color: 0xc7c1a8,
  },
  rotation: {
    enable: true,
    speed: 0.01,
  },
});
moonV.orbitAround(earth);

//JUPITER
const jupiter3 = viz.createSphere("jupiter3", {
  textureUrl:
    "https://raw.githubusercontent.com/typpo/spacekit/master/examples/jupiter_in_the_solar_system/jupiter2_4k.jpg",
  radius: 71492 / 149598000, // radius in AU, so jupiter is shown to scale
  // radius: 0.1, // Exxagerate Jupiter's size
  ephem: Spacekit.EphemPresets.JUPITER,
  levelsOfDetail: [
    { radii: 0, segments: 64 },
    { radii: 30, segments: 16 },
    { radii: 60, segments: 8 },
  ],
  atmosphere: {
    enable: true,
    color: 0xc7c1a8,
  },
  rotation: {
    enable: true,
    speed: 2,
  },
});

// ARTIFICIAL OBJECTS


document.getElementById("btn-system").onclick = function () {
  viz.getViewer().followObject(sun, [2, 2, 2]);
  viz.zoomToFit(sun, 2);
};


document.getElementById("btn-earth").onclick = function () {
  viz.getViewer().followObject(sun, [-0.75, -0.75, 0.5]);
  viz.zoomToFit(sun, 10000);
  setTimeout(() => {
    {
      viz.getViewer().followObject(earthV, [2, 0, 0]);
      viz.zoomToFit(earth, 0.00003);
    }
  }, 20);
}

document.getElementById("btn-mars").onclick = function () {
  viz.getViewer().followObject(sun, [-0.75, -0.75, 0.5]);
  viz.zoomToFit(sun, 10000);
  setTimeout(() => {
    {
      viz.getViewer().followObject(marsV, [2, 0, 0]);
      viz.zoomToFit(marsV, 0.00001);
    }
  }, 20);
}

document.getElementById("btn-moon").onclick = function () {
  viz.getViewer().followObject(sun, [-0.75, -0.75, 0.5]);
  viz.zoomToFit(sun, 10000);
  setTimeout(() => {
    {
      viz.getViewer().followObject(moonV, [2, 0, 0]);
      viz.zoomToFit(moonV, 0.003);
    }
  }, 20);
}


// //  BOUNDARIES CHECk
// // the observable universe is more than 46 billion light-years = 2.909086e+15UA in any direction from Earth
// // fillParticles(farParticlesCount, 2.909086e+15, 2.909086e+15, farPositions);

// const surfacePositions = [];
// const nearPositions = [];
// const farPositions = [];
// const surfaceParticlesCount = 1e4;
// const nearParticlesCount = 100;
// const farParticlesCount = 100;
// const particleSize = 5;

// // 1= 1UA unité astronomique. NASA estimates the galaxy at 100,000 light-years across. 
// // 1 ly = 63241,1LY largeur galaxy en UA: 6,32411e+9 bilan les échelles vont au bout.
// //fillParticles(surfaceParticlesCount, 0, 6.32411e+9, surfacePositions);
// fillParticles(surfaceParticlesCount, 6.32411e+8, 6.32412e+9, surfacePositions);

// // Laniakea est le superamas  dont fait partie la Voie lactée, et donc la Terre.r= 250 e6ly =1.581025e+13AU
// // fillParticles(nearParticlesCount, 1.581025e+13, 1.581025e+13, nearPositions);
// fillParticles(nearParticlesCount, 1.581025e+13, 1.581026e+13, nearPositions);

// // the observable universe is more than 46 billion light-years = 2.909086e+15UA in any direction from Earth
// // fillParticles(farParticlesCount, 2.909086e+15, 2.909086e+15, farPositions);

// fillParticles(farParticlesCount, 2.909086e+15, 2.909087e+15, farPositions);
// viz.createStaticParticles('surface', surfacePositions, {
//   defaultColor: 'white',
//   size: particleSize,
// });
// viz.createStaticParticles('near', nearPositions, {
//   defaultColor: 'white',
//   size: particleSize,
// });
// viz.createStaticParticles('far', farPositions, {
//   defaultColor: 'white',
//   size: particleSize,
// });


// function fillParticles(count, minRange, maxRange, particles) {
//   for (let i = 0; i < count; i++) {
//     const newParticle = randomPosition(minRange, maxRange);
//     particles.push(newParticle);
//   }
// }

// function randomPosition(minRange, maxRange) {
//   const delta = maxRange - minRange;
//   let mag = 1;

//   if (delta > 0) {
//     mag = delta * Math.random() + minRange;
//   }

//   const ra = randomAngle(0, 2 * Math.PI);
//   const dec = randomAngle(-Math.PI / 2, Math.PI / 2);
//   const z = mag * Math.sin(dec);
//   const x = 5 * mag * Math.cos(dec) * Math.cos(ra) ;
//   const y = 5 * mag * Math.cos(dec) * Math.sin(ra);

//   return [x, y, z];
// }

// function randomAngle(min, max) {
//   const delta = max - min;
//   return min + Math.random() * delta;
// }


// GALAXY 

// STAR CHECK REACTIVER POUR AVOIR LES ETOILES PRECONF
// viz.createStars();

// -----------------------------------------------------------
// -----------------------------------------------------------
// PROJET: 
// IMPORTER LES ETOILES de la galaxie avec les coordonnées X,Y,Z, et la luminosité, puis les déplacer en fonciotn de leux vecteurs vitesse.

const starPositions = [];

// Scales imports GAIA: pc. Conversions in script.js pc to UA 1 pc = 206264.806 au
// Conversion DEG TO RAD REQUIRED ?????

allStars.forEach((star) => {
  const x = 206264.806 * star.rmed * Math.cos((star.dec + dec) * Math.PI/180) * Math.cos((star.ra + 10) * Math.PI/180);
  const y = 206264.806 * star.rmed * Math.cos((star.dec + dec) * Math.PI/180) * Math.sin((star.ra + 10) * Math.PI/180);
  const z = -206264.806 * star.rmed * Math.sin((star.dec + dec) * Math.PI/180);
  starPositions.push([x, y, z])
});

viz.createStaticParticles('stars', starPositions, {
   defaultColor: 'white',
   size: 5,
 });



//messages doted lines
const mxDotPositions = [];
// Scales imports messages: pc. Conversions in script.js Ly to UA 1 ly = 63241.16 au

allMessages.forEach((mx) => {
  const count=1000
  for (let i = 1; i < count; i++) {
    const x = i * (63241.16 * mx.dist)/count  * Math.cos((mx.dec + dec) * Math.PI/180) * Math.cos((mx.ra + ra) * Math.PI/180);
    const y = i * (63241.16 * mx.dist)/count  * Math.cos((mx.dec + dec) * Math.PI/180) * Math.sin((mx.ra + ra) * Math.PI/180);
    const z = -i * (63241.16 * mx.dist)/count  * Math.sin((mx.dec + dec) * Math.PI/180);
    mxDotPositions.push([x, y, z])
  }
});

allMessages.forEach((mx) => {
  const count=1000
  for (let i = 1; i < count; i++) {
    const x = i * (63241.16 * mx.dist)/(100 * count)  * Math.cos((mx.dec + dec) * Math.PI/180) * Math.cos((mx.ra + ra) * Math.PI/180);
    const y = i * (63241.16 * mx.dist)/(100 * count)   * Math.cos((mx.dec + dec) * Math.PI/180) * Math.sin((mx.ra + ra) * Math.PI/180);
    const z = -i * (63241.16 * mx.dist)/(100 * count)   * Math.sin((mx.dec + dec) * Math.PI/180);
    mxDotPositions.push([x, y, z])
  }
});

allMessages.forEach((mx) => {
  const count=1000
  for (let i = 1; i < count; i++) {
    const x = i * (63241.16 * mx.dist)/(1000 * count)  * Math.cos((mx.dec + dec) * Math.PI/180) * Math.cos((mx.ra + ra) * Math.PI/180);
    const y = i * (63241.16 * mx.dist)/(1000 * count)   * Math.cos((mx.dec + dec) * Math.PI/180) * Math.sin((mx.ra + ra) * Math.PI/180);
    const z = -i * (63241.16 * mx.dist)/(1000 * count)   * Math.sin((mx.dec + dec) * Math.PI/180);
    mxDotPositions.push([x, y, z])
  }
});

viz.createStaticParticles('mx', mxDotPositions, {
   defaultColor: 'red',
   size: 5,
 });


//messages destinations

 const mxPositions = [];

allMessages.forEach((mx) => {
  const x = 63241.16 * mx.dist * Math.cos((mx.dec + dec) * Math.PI/180) * Math.cos((mx.ra + ra) * Math.PI/180);
  const y = 63241.16 * mx.dist * Math.cos((mx.dec + dec) * Math.PI/180) * Math.sin((mx.ra + ra) * Math.PI/180);
  const z = -63241.16 * mx.dist * Math.sin((mx.dec + dec) * Math.PI/180);
  mxPositions.push([x, y, z])
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

