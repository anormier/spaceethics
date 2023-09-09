Here is the project structure: 
IT is BUILT ON SPACEKIT.JS (THANKS AND BRAVO)
SPACEKIT IS BUILT ON THREE. below some info how it is connected

main.js: Will contain the main logic and initialization of the application.
init.js: Will handle the initial setup of the simulation and sliders.
constants.js: Will contain all the constant values like LY_TO_AU.
UIelements.js: Will manage the DOM manipulations and event handlers for UI elements.
celestialObjects.js: Will include the creation and manipulation of celestial objects like planets, moons, etc.
starsAndMessages.js: Will include the calculations and placements of stars and messages.
fullscreen.js: Will contain the fullscreen functionality.
controls.js: Will contain button and control setups.
textcontent.js: Will contain all the text to be displayed in navigation information and other UI elements.



Sources: 
Earth lit at night: https://climate.nasa.gov/climate_resources/86/night-lights-big-cities/

To update tree: 
open terminal: 
adri@Air-de-Normier spaceethics % cd /Users/adri/Desktop/spaceethics
adri@Air-de-Normier spaceethics % find . > directory_tree.txt






spaceethics-main/              (Project Root)
├── assets/                    (Global assets like images)
├── src/                       (Source code)
│   ├── test/                  (Test scripts, if any)
│   ├── lib/                   (External libraries)
│   ├── html/                  (HTML components or templates)
│   ├── css/                   (CSS files)
│   │   └── style.css          (Main stylesheet)
│   ├── components/            (Reusable UI components)
│   ├── js/                    (JavaScript source code)
│   │   ├── main.js            (Main JavaScript file)
│   │   ├── service/           (Service utilities)
│   │   │   └── utils.js       (Utility functions)
│   │   ├── data/              (Data tables)
│   │   │   ├── voyagers.js
│   │   │   ├── stars100LY3K45K.js
│   │   │   ├── stars100LY6Kmore.js
│   │   │   ├── stars100LY45K6K.js
│   │   │   └── messages.js    (Message data)
│   │   └── components/        (Reusable JS components)
├── index.html                 (Main HTML file)
└── README.md                  (Project documentation)

From the code you provided at the end of simulation.ts, the Simulation class has several methods that are publicly exposed. These methods provide access to various internal properties of the Simulation class, specifically to objects related to the THREE.js library and other properties of the Simulation.

Here's a breakdown:

getSimulationElement():

Return Type: HTMLCanvasElement
Description: Returns the HTML canvas element that contains the simulation.
getViewer():

Return Type: Camera
Description: Provides access to the Camera wrapper object, which is likely a higher-level representation of the camera in the simulation, possibly including controls or other properties related to viewing the simulation.
getScene():

Return Type: THREE.Scene
Description: Provides direct access to the THREE.js scene object. This is very useful if you want to directly manipulate or query the scene, such as adding or removing objects.
getRenderer():

Return Type: THREE.WebGL1Renderer
Description: Gives access to the THREE.js WebGL renderer. This could be useful for custom rendering or post-processing tasks.
setCameraDrift(driftOn: boolean):

.get3jsObjects()
returns and array of THREE.js objects, and the first item is a valid THREE.js object!


Parameters: A boolean (driftOn) that specifies whether the camera should drift or float around.
Description: Enables or disables the camera drift feature. This probably allows the camera to have a slight movement, giving a more dynamic feel to the simulation when enabled.
Finally, the last line export default Simulation; indicates that the Simulation class itself is the default export from the simulation.ts module. This means that when you import from this module without specifying a named export, you will be importing the Simulation class.

If you're aiming to access or manipulate THREE.js objects within the context of Spacekit, these methods are your gateways. They allow you to tap into the underlying THREE.js implementations that Spacekit uses internally, giving you a lot of power and flexibility.


----
Adrien Normier
+33 (0) 7 67 27 63 15
anormier@gmail.com