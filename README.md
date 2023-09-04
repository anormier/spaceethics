Here is the project structure: 

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