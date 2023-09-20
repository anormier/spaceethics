export async function fetchDetailedSignalsFromDSN() {
    try {
        const response = await axios.get('https://eyes.nasa.gov/dsn/data/dsn.xml');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        // Debugging output
        console.log('XML Data:', xmlDoc);

        if (!xmlDoc || !xmlDoc.documentElement || xmlDoc.getElementsByTagName('parsererror').length) {
            throw new Error("Invalid XML data received.");
        }

        const dishes = Array.from(xmlDoc.getElementsByTagName("dish"));

        if (!dishes.length) {
            throw new Error("No dishes found in XML data.");
        }

        const signals = [];

        dishes.forEach((dish) => {
            const dishName = dish.getAttribute("name");
            const upSignals = Array.from(dish.getElementsByTagName("upSignal"));
            const downSignals = Array.from(dish.getElementsByTagName("downSignal"));

            upSignals.forEach((upSignal) => {
                signals.push({
                    signalType: "upSignal",
                    dishName: dishName,
                    active: upSignal.getAttribute("active") === "true",
                    type: upSignal.getAttribute("signalType"),
                    dataRate: upSignal.getAttribute("dataRate"),
                    frequency: upSignal.getAttribute("frequency"),
                    band: upSignal.getAttribute("band"),
                    power: upSignal.getAttribute("power"),
                    spacecraft: upSignal.getAttribute("spacecraft"),
                    spacecraftID: upSignal.getAttribute("spacecraftID"),
                });
            });

            downSignals.forEach((downSignal) => {
                signals.push({
                    signalType: "downSignal",
                    dishName: dishName,
                    active: downSignal.getAttribute("active") === "true",
                    type: downSignal.getAttribute("signalType"),
                    dataRate: downSignal.getAttribute("dataRate"),
                    frequency: downSignal.getAttribute("frequency"),
                    band: downSignal.getAttribute("band"),
                    power: downSignal.getAttribute("power"),
                    spacecraft: downSignal.getAttribute("spacecraft"),
                    spacecraftID: downSignal.getAttribute("spacecraftID"),
                });
            });
        });

        return signals;
    } catch (error) {
        console.error('Error fetching detailed DSN signal data:', error);
        throw error;
    }
}
