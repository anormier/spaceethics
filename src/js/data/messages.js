// This is thre file messages.js please read, and just acknoledge with -I've read, up to line XXX (being the last line you've read)-, I will then pass you further documents to read, or questions


// NE PAS OUBLIER LE "] export default allStars " à la fin
//id, suivie de luminosité, position spheric coordinates, speed spheric coordinates, faciles à extraire de gaia. 
// Scales SPACEKIT: UA 
// Scales imports GAIA: pc. Conversions in script.js pc to UA 1 pc = 206264.806 au
// angles degrés
// https://docs.google.com/document/d/1yTf3pZyt0oHXOcD2GHqih9vMRM2k535-KLniOF_a_PA/edit INFOS GAIA

//extract: https://docs.google.com/spreadsheets/d/1JZJq8M9Yg2gfahe1NwU_fI7p-xS1J8Eub3L0Z_LCZgg/edit#gid=2136432496
function addDefaultParams(messages) {
    const idTracker = {};
    const raSet = new Set();
    const decSet = new Set();

    function getRandomOffset() {
        // Generates a random value between 1 and 2, can be positive or negative
        return (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1);
    }

    function toFixedPrecision(value) {
        // Convert the floating point number to string with fixed 4 decimal places
        return parseFloat(value.toFixed(4));
    }

    return messages.map(message => {
        const originalId = message.id;
  
        // Handle duplicate IDs
        if (idTracker[originalId]) {
            idTracker[originalId]++;
            message.id = `${originalId}-${idTracker[originalId]}`;
        } else {
            idTracker[originalId] = 1; // Initialize counter for the ID
        }

        // Check and adjust RA if needed
        message.ra = toFixedPrecision(message.ra);
        while (raSet.has(message.ra)) {
            message.ra = toFixedPrecision(message.ra + 3*getRandomOffset());
        }
        raSet.add(message.ra);

        // Check and adjust DEC if needed
        message.dec = toFixedPrecision(message.dec);
        while (decSet.has(message.dec)) {
            message.dec = toFixedPrecision(message.dec + getRandomOffset());
        }
        decSet.add(message.dec);

        // Handle dateSent and epoch
        const dateSent = new Date(`${message.dateSent}-01-01`);
        const epoch = dateSent;
  
        return {
            ...message, // Spread the existing message properties first
            r: 1,
            vra: 0,
            vdec: 0,
            vr: 300000,
            nameSet: message.nameSet || "DefaultName", // Default value if not provided
            textSet: message.textSet || "DefaultText", // Default value if not provided
            dateSent, // Override the value with the new Date object
            epoch // Use dateSent as epoch
        };
    });
}


export const allMessages = [

    {  nameSet: 'RuBisCo Stars',
    textSet: 'The RuBisCO Stars message was a transmission to nearby star systems detailing the structure of a basic enzyme responsible for photosynthesis on Earth.',
    refURL: 'https://en.wikipedia.org/wiki/RuBisCo_Stars',id: 'RuBisCo Stars', dist: 16.8, ra: 3.745, dec: -9.773, dateSent: 2009 },
    { nameSet: 'Sonar Calling',
        textSet: 'Sent as part of the Sónar Music Festival to the exoplanet GJ 273b. Its a blend of music and basic mathematical concepts to potentially communicate with extraterrestrial life.',
        refURL: 'https://sonarcalling.com/en/'
    , id: 'Sonar Caling 2', dist: 12.36, ra: 12.36, dec: 111.852, dateSent: 2018 },
    {  nameSet: 'Cosmic Call 2',
    textSet: 'A series of interstellar radio messages sent from the Evpatoria Planetary Radar. It was the second of its kind, aiming to communicate with extraterrestrial civilizations.',
    refURL: 'https://en.wikipedia.org/wiki/Cosmic_Call'
, id: 'Cosmic Call2', dist: 20, ra: 15.6919, dec: 0.7155, dateSent: 2003 },
    {     nameSet: 'Across the Universe',
    textSet: 'The song "Across the Universe" by The Beatles was beamed into space by NASA towards the North Star. It was meant more as a symbolic gesture of peace than an actual attempt to communicate with ETs.',
    refURL: 'https://www.nasa.gov/topics/universe/features/across_universe.html'
,id: 'Across the Universe', dist: 20, ra: 37.9523, dec: 89.2641, dateSent: 2008 },
    {  nameSet: 'A Simple Response to an Elemental Message',
    textSet: 'An interstellar radio message inspired by the Arecibo Message. The content includes mathematical and physical data, chemical formulas, and information about humans and the solar system.',
    refURL: 'https://www.centauri-dreams.org/2016/11/18/a-simple-response-to-an-elemental-message/'
, id: 'A Simple Response to an Elemental Message', dist: 20, ra: 37.9523, dec: 89.2641, dateSent: 2016 },
    { id: 'Cosmic Call2', dist: 42.21, ra: 40.0507, dec: -17.9378, dateSent: 2003 },
    {  nameSet: 'Teen Age Message',
    textSet: 'An attempt to send a series of interstellar radio messages from Earth. Unlike its predecessors, this was more of a musical approach to cosmic communication.',
    refURL: 'https://en.wikipedia.org/wiki/Teen_Age_Message'
,id: 'Teen Age Message', dist: 159, ra: 130.8217, dec: -5.7886, dateSent: 2001 },
    {     nameSet: 'Wow! Reply',
    textSet: 'A response to the famous Wow! signal received in 1977. It comprised tweets and video messages from people across the world.',
    refURL: 'https://en.wikipedia.org/wiki/Wow!_signal#Responses'
,id: 'Wow! Reply', dist: 159, ra: 130.8217, dec: -5.7886, dateSent: 2012 },
    { id: 'RuBisCo Stars', dist: 20.3, ra: 178.042, dec: 22.493, dateSent: 2009 },
    { id: 'NASDACosmic-College', dist: 250, ra: 201.2983, dec: -11.1614, dateSent: 1997 },
    {    nameSet: 'A Message From Earth',
    textSet: 'A digital time capsule sent to the exoplanet Gliese 581c. The content was chosen by the public and contains text messages, images, and music.',
    refURL: 'https://en.wikipedia.org/wiki/A_Message_from_Earth'
,id: 'A Message From Earth', dist: 17.56, ra: 209.408, dec: 6.675, dateSent: 2008 },
    {  nameSet: 'Lone Signal',
    textSet: 'Lone Signal was a crowd-sourced interstellar messaging project. Users could send text and photo messages to extraterrestrials via the Jamesburg Earth Station.',
    refURL: 'https://en.wikipedia.org/wiki/Lone_Signal'
,id: 'Lone Signal', dist: 17.56, ra: 209.408, dec: 6.675, dateSent: 2013 },
    { id: 'Teen Age Message', dist: 116, ra: 219.9208, dec: 26.5272, dateSent: 2001 },
    { id: 'Teen Age Message', dist: 54.2, ra: 220.182, dec: -8.6621, dateSent: 2001 },
    {     nameSet: 'Arecibo Message',
    textSet: 'The Arecibo Message was a brief interstellar radio message sent to space to demonstrate the capabilities of the Arecibo telescope. It contains information about humans, DNA, and our Solar System.',
    refURL: 'https://en.wikipedia.org/wiki/Arecibo_message'
,id: 'Arecibo Message', dist: 25100, ra: 250.4235, dec: 36.4613, dateSent: 1974 },
    {     nameSet: 'Hommage à Stephen Hawking',
    textSet: 'A tribute to the renowned physicist, Stephen Hawking, this interstellar message was sent towards the nearest black hole. It was symbolic, celebrating his contributions to understanding the universe.',
    refURL: 'https://www.centauri-dreams.org/2018/06/18/stephen-hawking-a-tribute/'
,id: 'Hommage à Stephen Hawking', dist: 25640, ra: 266.4168, dec: -29.0078, dateSent: 2018 },
    { id: 'Teen Age Message', dist: 27.14, ra: 277.2077, dec: 27.8783, dateSent: 2001 },
    { nameSet: 'Cosmic Call 2',
    textSet: 'A series of interstellar radio messages sent from the Evpatoria Planetary Radar. It was the second of its kind, aiming to communicate with extraterrestrial civilizations.',
    refURL: 'https://en.wikipedia.org/wiki/Cosmic_Call'
, id: 'Cosmic Call2', dist: 27.14, ra: 277.2077, dec: 27.8783, dateSent: 2003 },
    { id: 'Cosmic Call1', dist: 20, ra: 285.7625, dec: 42.3222, dateSent: 1999 },
    { id: 'Cosmic Call1', dist: 69, ra: 292.1761, dec: 50.5175, dateSent: 1999 },
    { nameSet: 'Teen Age Message',
    textSet: 'An attempt to send a series of interstellar radio messages from Earth. Unlike its predecessors, this was more of a musical approach to cosmic communication.',
    refURL: 'https://en.wikipedia.org/wiki/Teen_Age_Message'
,id: 'Teen Age Message', dist: 69, ra: 292.1761, dec: 50.5175, dateSent: 2001 },
    { id: 'Cosmic Call1', dist: 165, ra: 292.6803, dec: 45.2803, dateSent: 1999 },
    {  nameSet: 'Altair (Morimoto - Hirabayashi) Message',
    textSet: 'This was an early attempt at sending a message to extraterrestrial civilizations. Directed at the star Altair, it included binary representations of various concepts.',
    refURL: 'https://en.wikipedia.org/wiki/List_of_interstellar_radio_messages'
,id: 'Altair (Morimoto - Hirabayashi) Message[20]', dist: 16.73, ra: 297.6958, dec: 8.8683, dateSent: 1983 },
    {  nameSet: 'Cosmic Call 2',
    textSet: 'A series of interstellar radio messages sent from the Evpatoria Planetary Radar. It was the second of its kind, aiming to communicate with extraterrestrial civilizations.',
    refURL: 'https://en.wikipedia.org/wiki/Cosmic_Call'
,id: 'Cosmic Call1', dist: 50.12, ra: 300.2615, dec: -1.0097, dateSent: 1999 },
    { id: 'Teen Age Message', dist: 99, ra: 305.2529, dec: 44.4564, dateSent: 2001 },
    {  nameSet: 'Cosmic Call 2',
    textSet: 'A series of interstellar radio messages sent from the Evpatoria Planetary Radar. It was the second of its kind, aiming to communicate with extraterrestrial civilizations.',
    refURL: 'https://en.wikipedia.org/wiki/Cosmic_Call'
,id: 'Cosmic Call2', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2003 },
    { nameSet: 'Wow! Reply',
    textSet: 'A response to the famous Wow! signal received in 1977. It comprised tweets and video messages from people across the world.',
    refURL: 'https://en.wikipedia.org/wiki/Wow!_signal#Responses'
,id: 'Wow! Reply', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2012 },
    {  nameSet: 'JAXA Space Camp (UDSC-1 & UDSC-2)',
    textSet: 'Messages sent by JAXA, possibly as part of an educational program or initiative. Details about the specific content of these messages are not readily available.',
    refURL: 'https://www.jaxa.jp/',id: 'JAXA Space Camp (UDSC-1)', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2013 },
    {  nameSet: 'JAXA Space Camp (UDSC-1 & UDSC-2)',
    textSet: 'Messages sent by JAXA, possibly as part of an educational program or initiative. Details about the specific content of these messages are not readily available.',
    refURL: 'https://www.jaxa.jp/',id: 'JAXA Space Camp (UDSC-2)', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2014 },
    {     nameSet: 'Sónar Calling GJ273b',
    textSet: 'Sent by the Sónar Music Festival to the exoplanet GJ 273b. This was a mix of music and information with the hopes of making contact with extraterrestrial civilizations.',
    refURL: 'https://sonarcalling.com/en/'
,id: 'Sónar Calling GJ273b', dist: 12.36, ra: 111.852, dec: 5.22578930555556, dateSent: 2017 },

]

export const updatedMessages = addDefaultParams(allMessages);
