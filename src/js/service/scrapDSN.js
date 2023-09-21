export async function fetchDetailedSignalsFromDSN() {
    try {
      const response = await axios.get('https://eyes.nasa.gov/dsn/data/dsn.xml');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
  
      // Validate the XML data
      if (!xmlDoc || !xmlDoc.documentElement || xmlDoc.getElementsByTagName('parsererror').length) {
        throw new Error("Invalid XML data received.");
      }
  
      const signals = [];
  
      // Loop through each dish
      Array.from(xmlDoc.getElementsByTagName("dish")).forEach((dish) => {
        const dishAttributes = Array.from(dish.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {});
        const stationNode = dish.parentNode;
        const stationAttributes = Array.from(stationNode.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {});
  
        // Loop through both downSignal and upSignal
        ['downSignal', 'upSignal'].forEach(signalType => {
          Array.from(dish.getElementsByTagName(signalType)).forEach((signalNode) => {
            const signalAttributes = Array.from(signalNode.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {});
  
            const spacecraft = signalNode.getAttribute("spacecraft");
  
            // Exclude spacecraft named "TEST"
            if (spacecraft !== "TEST") {
              // Find targets with matching spacecraft names
              const targetNodes = Array.from(dish.getElementsByTagName("target")).filter(targetNode => targetNode.getAttribute("name") === spacecraft);
              
              targetNodes.forEach(targetNode => {
                const targetAttributes = Array.from(targetNode.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {});
  
                signals.push({
                  signalType,
                  ...signalAttributes,
                  ...targetAttributes,
                  ...dishAttributes,
                  ...stationAttributes // includes timeUTC and timeZoneOffset
                });
              });
            }
          });
        });
      });
  
      return signals;
    } catch (error) {
      console.error('Error fetching detailed DSN signal data:', error);
      return null;
    }
  }
  
// Function to convert from horizontal to equatorial coordinates
function horizontalToEquatorial(azimuth, elevation, observerLat, observerLon, date) {
    const LST = calculateLST(date, observerLon);
    
    const azimuthRad = azimuth * Math.PI / 180;
    const elevationRad = elevation * Math.PI / 180;
    const observerLatRad = observerLat * Math.PI / 180;
    
    const dec = Math.asin(Math.sin(observerLatRad) * Math.sin(elevationRad) + Math.cos(observerLatRad) * Math.cos(elevationRad) * Math.cos(azimuthRad));
    const HA = Math.acos((Math.sin(elevationRad) - Math.sin(dec) * Math.sin(observerLatRad)) / (Math.cos(dec) * Math.cos(observerLatRad)));
    const RA = LST - HA * 180 / Math.PI;
    
    const decDeg = dec * 180 / Math.PI;
    
    return {
      ra: RA,
      dec: decDeg
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
  export async function augmentAndExportSignals() {
    try {
      const fetchedSignals = await fetchDetailedSignalsFromDSN();
  
      if (!fetchedSignals) {
        console.error("Failed to fetch signals");
        return null;
      }
  
      const augmentedSignals = fetchedSignals.map(signal => {
        const {
          azimuthAngle,
          elevationAngle,
          timeUTC,
          lat,
          lon,
          uplegRange,
          spacecraft,
          timeZoneOffset
        } = signal;
  
        // Initialize ra and dec to null
        let ra = null;
        let dec = null;
  
        // Only calculate ra and dec if all required attributes are present
        if (
          azimuthAngle !== undefined &&
          elevationAngle !== undefined &&
          lat !== undefined &&
          lon !== undefined &&
          timeUTC !== undefined
        ) {
          const date = new Date(parseInt(timeUTC) + parseInt(timeZoneOffset)); // Adjusting for timezone
          const equatorialCoords = horizontalToEquatorial(
            parseFloat(azimuthAngle),
            parseFloat(elevationAngle),
            parseFloat(lat),
            parseFloat(lon),
            date
          );
  
          ra = equatorialCoords.ra;
          dec = equatorialCoords.dec;
        }
  
        return {
          ...signal,
          r: uplegRange !== undefined ? kmToAU(parseFloat(uplegRange)) : null,
          ra,
          dec,
          vra: 0,
          vdec: 0,
          dateSent: new Date().toUTCString(),
          vr: 300000,
          epoch: new Date().toUTCString(),
          nameSet: `Upload to/Download from ${spacecraft}`,
          textSet: `Information about ${spacecraft}, Transmission Power: XX dBm`
        };
      });
  
      // Now augmentedSignals contains the augmented data
      // You can export it as needed, e.g., to a file, database, etc.
      console.log(augmentedSignals); // For demonstration, logging it to the console
      return augmentedSignals;
    } catch (error) {
      console.error('Error in augmenting DSN signal data:', error);
      return null;
    }
  }
  