// scrapDSN.js


/**
 * Fetch DSN (Deep Space Network) signal data.
 */
export async function fetchDetailedSignalsFromDSN() {
    try {
        const response = await axios.get('https://eyes.nasa.gov/dsn/data/dsn.xml');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        let stations = Array.from(xmlDoc.getElementsByTagName("station"));

        const result = stations.map(station => {
            let dishes = Array.from(station.getElementsByTagName("dish"));

            const dishData = dishes.map(dish => {
                let downSignals = Array.from(dish.getElementsByTagName('downSignal'));
                let upSignals = Array.from(dish.getElementsByTagName('upSignal'));

                const downSignalData = downSignals.map(signal => ({
                    signalType: 'downSignal',
                    dishName: dish.getAttribute("name"),
                    active: signal.getAttribute("active") === "true",
                    type: signal.getAttribute("signalType"),
                    dataRate: signal.getAttribute("dataRate"),
                    frequency: signal.getAttribute("frequency"),
                    band: signal.getAttribute('band'),
                    power: signal.getAttribute('power'),
                    spacecraft: signal.getAttribute('spacecraft'),
                    spacecraftID: signal.getAttribute("spacecraftID")
                }));

                const upSignalData = upSignals.map(signal => ({
                    signalType: 'upSignal',
                    dishName: dish.getAttribute("name"),
                    active: signal.getAttribute("active") === "true",
                    type: signal.getAttribute("signalType"),
                    dataRate: signal.getAttribute("dataRate"),
                    frequency: signal.getAttribute("frequency"),
                    band: signal.getAttribute('band'),
                    power: signal.getAttribute('power'),
                    spacecraft: signal.getAttribute('spacecraft'),
                    spacecraftID: signal.getAttribute("spacecraftID")
                }));

                return {
                    name: dish.getAttribute('name'),
                    azimuthAngle: dish.getAttribute('azimuthAngle'),
                    elevationAngle: dish.getAttribute('elevationAngle'),
                    signals: [...downSignalData, ...upSignalData]
                };
            });

            // Convert the timeUTC to JavaScript Date format.
            const timeUTC = new Date(station.getAttribute('timeUTC'));

            return {
                name: station.getAttribute('name'),
                friendlyName: station.getAttribute('friendlyName'),
                timeUTC: timeUTC,
                timeZoneOffset: station.getAttribute('timeZoneOffset'),
                dishes: dishData
            };
        });

        return result;

    } catch (error) {
        console.error('Error fetching detailed DSN signal data:', error);
        throw error;
    }
}
