
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

        const signals = [];

        Array.from(xmlDoc.getElementsByTagName("dish")).forEach((dish) => {
            const dishName = dish.getAttribute("name");
            const azimuthAngle = dish.getAttribute("azimuthAngle");
            const elevationAngle = dish.getAttribute("elevationAngle");

            const stationNode = dish.parentNode;
            const stationName = stationNode.getAttribute("name");
            const stationFriendlyName = stationNode.getAttribute("friendlyName");
            const stationTime = stationNode.getAttribute("timeUTC");

            Array.from(dish.getElementsByTagName("downSignal")).forEach((downSignal) => {
                const signalType = downSignal.getAttribute("signalType");
                const active = downSignal.getAttribute("active") === "true";
                const dataRate = downSignal.getAttribute("dataRate");
                const frequency = downSignal.getAttribute("frequency");
                const band = downSignal.getAttribute("band");
                const power = downSignal.getAttribute("power");
                const spacecraft = downSignal.getAttribute("spacecraft");
                const spacecraftID = downSignal.getAttribute("spacecraftID");

                const targetNodes = Array.from(dish.getElementsByTagName("target"));

                // Filter out spacecraft with the name "TEST"
                if (spacecraft !== "TEST") {
                    // Filter out messages with no target
                    const messagesWithTarget = targetNodes.filter((targetNode) => {
                        return targetNode.getAttribute("name") === spacecraft;
                    });

                    messagesWithTarget.forEach((targetNode) => {
                        const uplegRange = targetNode.getAttribute("uplegRange");

                        signals.push({
                            signalType: signalType,
                            dishName: dishName,
                            azimuthAngle: azimuthAngle,
                            elevationAngle: elevationAngle,
                            stationName: stationName,
                            stationFriendlyName: stationFriendlyName,
                            stationTime: stationTime,
                            active: active,
                            dataRate: dataRate,
                            frequency: frequency,
                            band: band,
                            power: power,
                            spacecraft: spacecraft,
                            spacecraftID: spacecraftID,
                            uplegRange: uplegRange,
                        });
                    });
                }
            });
        });

        return signals;
    } catch (error) {
        console.error('Error fetching detailed DSN signal data:', error);
        throw error;
    }
}
