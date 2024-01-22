// this is scrapDSN-2 now

// Station coordinates
const stationCoordinates = {
  'Goldstone': { lat: 35.425, lon: -116.889 },
  'Canberra': { lat: -35.402, lon: 148.981 },
  'Madrid': { lat: 40.427, lon: -4.249 }
};

export async function fetchDetailedSignalsFromDSN() {
  try {
    const response = await axios.get('https://eyes.nasa.gov/dsn/data/dsn.xml');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");

    if (!xmlDoc || !xmlDoc.documentElement || xmlDoc.getElementsByTagName('parsererror').length) {
      throw new Error("Invalid XML data received.");
    }

    return extractSignals(xmlDoc);
  } catch (error) {
    console.error('Error fetching detailed DSN signal data:', error);
    return [];
  }
}

function extractSignals(xmlDoc) {
  const signals = [];
  const dishes = xmlDoc.getElementsByTagName("dish");

  Array.from(dishes).forEach(dish => {
    const dishData = extractDishData(dish);
    signals.push(...dishData);
  });
  console.log('signal', signals);

  return signals;
}

function findStationNode(dish) {
  let node = dish;
  while (node != null) {
    if (node.nodeName.toLowerCase() === 'station') {
      return node;
    }
    node = node.parentNode;
  }
  return null; // Return null if the station node is not found
}
function extractDishData(dish) {
  // The station node is a preceding sibling of the dish node
  let stationNode = dish.previousElementSibling;
  while (stationNode && stationNode.nodeName.toLowerCase() !== "station") {
    stationNode = stationNode.previousElementSibling;
  }

  if (!stationNode) {
    console.error("No station node found for dish: " + dish.getAttribute("name"));
    return []; // Return an empty array if no station node is found
  }

  // Extract attributes from the found station node
  const stationName = stationNode.getAttribute('friendlyName') || stationNode.getAttribute('name');
  const timeUTC = stationNode.getAttribute('timeUTC');
  const timeZoneOffset = stationNode.getAttribute('timeZoneOffset');

  // Extract azimuth and elevation directly from the dish element
  const azimuthAngle = dish.getAttribute('azimuthAngle');
  const elevationAngle = dish.getAttribute('elevationAngle');

  const signals = [];

  // Process 'upSignal' and 'downSignal' for each 'dish'
  ['downSignal', 'upSignal'].forEach(signalType => {
    const signalNodes = dish.getElementsByTagName(signalType);
    for (let signalNode of signalNodes) {
      // We only process signals related to a spacecraft (ignore 'TEST' signals)
      const spacecraft = signalNode.getAttribute("spacecraft");
      if (spacecraft && spacecraft !== "TEST") {
        const targetNode = Array.from(signalNode.parentNode.getElementsByTagName("target"))
          .find(target => target.getAttribute("name") === spacecraft);
        signals.push({
          signalType,
          dishName: dish.getAttribute('name'),
          stationName,
          timeUTC,
          timeZoneOffset,
          azimuthAngle, // Include azimuth angle
          elevationAngle, // Include elevation angle
          ...extractAttributes(signalNode),
          ...(targetNode ? extractAttributes(targetNode) : {})
        });
      }
    }
  });

  return signals;
}


function extractAttributes(node) {
  const attributes = {};
  for (let attr of node.attributes) {
    attributes[attr.name] = attr.value;
  }
  return attributes;
}


function constructSignalData(signalNode, targetNode, baseData) {
  return {
    ...baseData,
    ...extractAttributes(signalNode),
    ...extractAttributes(targetNode)
  };
}


// Function to convert km to astronomical units (AU)
function kmToAU(km) {
  return km / 1.496e+8;
}

// Function to calculate Local Sidereal Time (LST)
function calculateLST(date, longitude) {
  const JD = (date - new Date(Date.UTC(2000, 0, 1, 12, 0, 0))) / (1000 * 60 * 60 * 24) + 2451545.0;
  const T = (JD - 2451545.0) / 36525.0;
  
  let GST = 280.46061837 + 360.98564736629 * (JD - 2451545) + T * T * (0.000387933 - T / 38710000);
  GST = GST % 360;
  
  if (GST < 0) {
    GST += 360;
  }
  
  const LST = (GST + longitude) % 360;
  
  return LST;
}
// Mapping for station names to their friendly names
const stationNameMap = {
  'gdscc': 'Goldstone',
  'mdscc': 'Madrid',
  'cdscc': 'Canberra'
};
export async function augmentAndExportSignals() {
  try {
    const fetchedSignals = await fetchDetailedSignalsFromDSN();

    if (!fetchedSignals.length) {
      console.error("Failed to fetch signals");
      return null;
    }

    const augmentedSignals = fetchedSignals.map(signal => {
      // Map the station name to its friendly name
      const friendlyStationName = stationNameMap[signal.stationName] || signal.stationName;

      const stationCoord = stationCoordinates[friendlyStationName];
      if (!stationCoord) {
        console.error("Coordinates not found for station:", friendlyStationName);
        return null;
      }

      // Proceed with calculations if all required data is available
      const { azimuthAngle, elevationAngle, timeUTC, uplegRange, timeZoneOffset } = signal;
      let lambda = null, beta = null;
      if (azimuthAngle && elevationAngle && timeUTC) {
        const date = new Date(parseInt(timeUTC) + parseInt(timeZoneOffset)); // Adjusting for timezone
        const equatorialCoords = horizontalToEquatorial(
          parseFloat(azimuthAngle),
          parseFloat(elevationAngle),
          stationCoord.lat,
          stationCoord.lon,
          date
        );
        const eclipticCoords = equatorialToEcliptic(equatorialCoords.ra, equatorialCoords.dec);
        lambda = eclipticCoords.lambda; // Ecliptic longitude
        beta = eclipticCoords.beta;     // Ecliptic latitude
      }

      return {
        ...signal,
        stationName: friendlyStationName, // Use the friendly name
        r: uplegRange ? kmToAU(parseFloat(uplegRange)) : null,
        lambda,
        beta,
        vra: 0,
        vdec: 0,
        dateSent: new Date().toUTCString(),
        vr: 300000, // Assuming this is a constant for velocity
        epoch: new Date().toUTCString(), // Assuming current date for epoch
        nameSet: `Upload to/Download from ${signal.spacecraft}`,
        textSet: `Information about ${signal.spacecraft}, Transmission Power: XX dBm`
      };
    }).filter(signal => signal && signal.lambda !== null && signal.beta !== null);

    console.log(augmentedSignals); // For demonstration
    return augmentedSignals;
  } catch (error) {
    console.error('Error in augmenting DSN signal data:', error);
    return null;
  }
}

// Function to convert from equatorial to ecliptic coordinates
function equatorialToEcliptic(ra, dec) {
  // Constants for the obliquity of the ecliptic
  const epsilon = 23.439281; // This value might change slightly over time
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  const epsilonRad = (epsilon * Math.PI) / 180;

  // Calculate ecliptic longitude (lambda) and latitude (beta)
  const sinBeta = Math.sin(decRad) * Math.cos(epsilonRad) - Math.cos(decRad) * Math.sin(epsilonRad) * Math.sin(raRad);
  const beta = Math.asin(sinBeta);

  const y = Math.sin(raRad) * Math.cos(epsilonRad) + Math.tan(decRad) * Math.sin(epsilonRad);
  const x = Math.cos(raRad);
  const lambda = Math.atan2(y, x);

  // Convert to degrees and normalize
  const lambdaDeg = (lambda * 180 / Math.PI + 360) % 360;
  const betaDeg = beta * 180 / Math.PI;

  return { lambda: lambdaDeg, beta: betaDeg };
}

// Function to convert from horizontal to equatorial coordinates
function horizontalToEquatorial(azimuth, elevation, observerLat, observerLon, date) {
  // Convert angles to radians
  const azimuthRad = (azimuth * Math.PI) / 180;
  const elevationRad = (elevation * Math.PI) / 180;
  const latRad = (observerLat * Math.PI) / 180;

  // Calculate declination (dec)
  const sinDec = Math.sin(latRad) * Math.sin(elevationRad) +
                 Math.cos(latRad) * Math.cos(elevationRad) * Math.cos(azimuthRad);
  const dec = Math.asin(sinDec);

  // Calculate hour angle (HA)
  const cosH = (Math.sin(elevationRad) - Math.sin(dec) * Math.sin(latRad)) /
               (Math.cos(dec) * Math.cos(latRad));
  // Make sure the value is in the range -1 to 1 before calling acos
  const HA = Math.acos(Math.min(Math.max(cosH, -1), 1));

  // Calculate right ascension (RA)
  const LST = calculateLST(date, observerLon);
  let RA = LST - (HA * 180) / Math.PI;
  RA = (RA + 360) % 360; // Ensure RA is within the range 0 to 360

  // Convert declination from radians to degrees
  const decDeg = (dec * 180) / Math.PI;

  return { ra: RA, dec: decDeg };
}
/**
 * Processes DSN signal data to extract and format data for spacecraft positioning in ecliptic coordinates.
 * @param {Array} signals - Array of signal data objects.
 * @returns {Array} Array of objects containing spacecraft name, radial distance, ecliptic longitude, and ecliptic latitude.
 */
export function processSpacecraftPositionData(signals) {
  return signals.map(signal => {
    // Extract the necessary attributes for each spacecraft.
    const { spacecraft, r, lambda, beta } = signal;
    
    // Return a new object with just the required attributes.
    // r is the radial distance, lambda is ecliptic longitude, and beta is ecliptic latitude.
    console.log(spacecraft, r, lambda, beta); // For demonstration

    return {
      spacecraft,
      r: r ? parseFloat(r) : null,       // Radial distance in astronomical units
      lambda: lambda ? parseFloat(lambda) : null, // Ecliptic longitude
      beta: beta ? parseFloat(beta) : null,       // Ecliptic latitude
    };
  });
}


