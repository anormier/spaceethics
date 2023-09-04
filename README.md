Here is the project structure: 


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