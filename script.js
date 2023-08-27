//BELOW: The file script.JS
import allObjects from "./spatial-objects.js";
import { checkIfVisible, radecToXYZ, isDesktop, toggleFullScreen } from "./utils.js";
import stars100LY3K45K from "./stars100LY3K45K.js";
import stars100LY45K6K from "./stars100LY45K6K.js";
import stars100LY6Kmore from "./stars100LY6Kmore.js";
import allMessages from "./messages.js";
import allVoyagers from "./voyagers.js";


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
    showAxes: false,
    showGrid: false,
    showStats: false,
  },
});


const skybox = viz.createSkybox(Spacekit.SkyboxPresets.ESO_GIGAGALAXY);
viz.setJdDelta(viz.getJdDelta() * 0.02);

viz.onTick = function () {
  const d = viz.getDate();
  dateElt.innerHTML = d.toLocaleDateString();
  // Check if date has reached 1st January 2030
  if (d >= new Date('2030-01-01')) {
    viz.setDate(new Date('1950-01-01')); // Reset to 1950
    return;  // Return here to skip further operations for this tick
  }
  const date = d.getTime();

  // Update stars
  if (isDesktop()) { 
  placeStars3(stars100LY3K45K, date,8,'white');
  placeStars(stars100LY45K6K, date,10,'white');
  } 
  placeStars2(stars100LY6Kmore, date,15,'white');



  
  
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
  const speedFactor = parseFloat(event.target.value);
  viz.setJdDelta(initialSpeed * speedFactor);
  speedDisplay.textContent = `Speed: ${speedFactor}x`;
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
    mxDotPositions.push(radecToXYZ(mx.ra + ra,mx.dec + dec,63241.16 * mx.dist)/(1000 * count))
  }
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

let staticParticles = undefined;

function placeStars(stars,date,size,color) {
// // Anything that has r(PC),ra(deg),dec(deg),epoch,vr(km/s),vra(deg.s-1),vdec(deg.s-1)
  starPositions = []

  if (staticParticles) { viz.removeObject(staticParticles)}
    // source_id | parallax_over_error | teff_gspphot (K) | distance_gspphot (pc) | ra (deg) | radial_velocity (km.s**-1) | dec (deg) | pmra (mas.yr**-1) | pmdec (mas.yr**-1)

  const placeStar = (star) => {
    const timeDifference = date - new Date(star.eopch).getTime();
    const adjustedRA = star.ra + ra + star.vra * timeDifference * 8.78e-15;
    const adjustedDec = star.dec + dec + star.vdec * timeDifference * 8.78e-15;
    const adjustedRmed = 206265*star.rmed + (6.68459e-9* star.vrmed) * timeDifference/1000;
//
    starPositions.push(radecToXYZ(adjustedRA, adjustedDec, adjustedRmed));
}
//
  stars.forEach(star => placeStar(star));

  staticParticles = viz.createStaticParticles('stars', starPositions, {
    defaultColor: color,
    size: size,
  });
};

let staticParticles2 = undefined;

function placeStars2(stars,date,size,color) {
// // Anything that has r(PC),ra(deg),dec(deg),epoch,vr(km/s),vra(deg.s-1),vdec(deg.s-1)
  starPositions = []

  if (staticParticles2) { viz.removeObject(staticParticles2)}
    // source_id | parallax_over_error | teff_gspphot (K) | distance_gspphot (pc) | ra (deg) | radial_velocity (km.s**-1) | dec (deg) | pmra (mas.yr**-1) | pmdec (mas.yr**-1)

  const placeStar = (star) => {
    const timeDifference = date - new Date(star.eopch).getTime();
    const adjustedRA = star.ra + ra + star.vra * timeDifference * 8.78e-15;
    const adjustedDec = star.dec + dec + star.vdec * timeDifference * 8.78e-15;
    const adjustedRmed = 206265*star.rmed + (6.68459e-9* star.vrmed) * timeDifference/1000;
//
    starPositions.push(radecToXYZ(adjustedRA, adjustedDec, adjustedRmed));
}
//
  stars.forEach(star => placeStar(star));

  staticParticles2 = viz.createStaticParticles('stars', starPositions, {
    defaultColor: color,
    size: size,
  });
};

let staticParticles3 = undefined;

function placeStars3(stars,date,size,color) {
// // Anything that has r(PC),ra(deg),dec(deg),epoch,vr(km/s),vra(deg.s-1),vdec(deg.s-1)
  starPositions = []

  if (staticParticles3) { viz.removeObject(staticParticles3)}
    // source_id | parallax_over_error | teff_gspphot (K) | distance_gspphot (pc) | ra (deg) | radial_velocity (km.s**-1) | dec (deg) | pmra (mas.yr**-1) | pmdec (mas.yr**-1)

  const placeStar = (star) => {
    const timeDifference = date - new Date(star.eopch).getTime();
    const adjustedRA = star.ra + ra + star.vra * timeDifference * 8.78e-15;
    const adjustedDec = star.dec + dec + star.vdec * timeDifference * 8.78e-15;
    const adjustedRmed = 206265*star.rmed + (6.68459e-9* star.vrmed) * timeDifference/1000;
//
    starPositions.push(radecToXYZ(adjustedRA, adjustedDec, adjustedRmed));
}
//
  stars.forEach(star => placeStar(star));

  staticParticles3 = viz.createStaticParticles('stars', starPositions, {
    defaultColor: color,
    size: size,
  });
};


// // ESSAI
// let objs = undefined;
// function placeDynamic(objs,date) {
// // anything that has r(UA),ra(deg),dec(deg),epoch,vr(km/s),vra(deg.s-1),vdec(deg.s-1)

//   objsPositions = []

//   if (objs) { viz.removeObject(objs)}

//   const placeObj = (obj) => {
//     objPositions.push(radecToXYZ(obj.ra + ra, obj.dec + dec, obj.r + vr*T(date - epoch)/1e3));
//   }
//   objs.forEach(obj => placeStar(obj));

//   staticParticles = viz.createStaticParticles('stars', objPositions, {
//     defaultColor: 'white',
//     size: 5,
//   });
// };

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


