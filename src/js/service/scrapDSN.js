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
                                ...stationAttributes
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
