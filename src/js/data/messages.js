// This is thre file messages.js

// NE PAS OUBLIER LE "] export default allStars " à la fin
//id, suivie de luminosité, position spheric coordinates, speed spheric coordinates, faciles à extraire de gaia. 
// Scales SPACEKIT: UA 
// Scales imports GAIA: pc. Conversions in script.js pc to UA 1 pc = 206264.806 au
// angles degrés
// https://docs.google.com/document/d/1yTf3pZyt0oHXOcD2GHqih9vMRM2k535-KLniOF_a_PA/edit INFOS GAIA

//extract: https://docs.google.com/spreadsheets/d/1JZJq8M9Yg2gfahe1NwU_fI7p-xS1J8Eub3L0Z_LCZgg/edit#gid=2136432496
function addDefaultParams(messages) {
    const idTracker = {};
  
    return messages.map(message => {
        const originalId = message.id;
  
        // If the ID already exists, append "-X" to it
        if (idTracker[originalId]) {
            idTracker[originalId]++;
            message.id = `${originalId}-${idTracker[originalId]}`;
        } else {
            idTracker[originalId] = 1; // Initialize counter for the ID
        }
  
        // If dateSent in the message is just a year, convert it to a full date string
        const dateSent = new Date(`${message.dateSent}-01-01`);
        const epoch = dateSent;
  
        return {
            r: 1,
            ra: 258,
            dec: 12,
            vra: 0,
            vdec: 0,
            dateSent: new Date("1977-09-05"), // Default value
            vr: 300000,
            epoch: "2024-01-01",
            nameSet: message.nameSet || "DefaultName", // Default value if not provided
            textSet: message.textSet || "DefaultText", // Default value if not provided
            ...message, // Spread the existing message properties
            dateSent, // Override the default value with the new Date object
            epoch // Override the default epoch value
        };
    });
  }
  

export const allMessages = [

    { id: 'RuBisCo Stars', dist: 16.8, ra: 3.745, dec: -9.773, dateSent: 2009 },
    { id: 'Sonar Caling 2', dist: 12.36, ra: 12.36, dec: 111.852, dateSent: 2018 },
    { id: 'Cosmic Call2', dist: 20, ra: 15.6919, dec: 0.7155, dateSent: 2003 },
    { id: 'Across the Universe', dist: 20, ra: 37.9523, dec: 89.2641, dateSent: 2008 },
    { id: 'A Simple Response to an Elemental Message', dist: 20, ra: 37.9523, dec: 89.2641, dateSent: 2016 },
    { id: 'Cosmic Call2', dist: 42.21, ra: 40.0507, dec: -17.9378, dateSent: 2003 },
    { id: 'Teen Age Message', dist: 159, ra: 130.8217, dec: -5.7886, dateSent: 2001 },
    { id: 'Wow! Reply', dist: 159, ra: 130.8217, dec: -5.7886, dateSent: 2012 },
    { id: 'RuBisCo Stars', dist: 20.3, ra: 178.042, dec: 22.493, dateSent: 2009 },
    { id: 'NASDACosmic-College', dist: 250, ra: 201.2983, dec: -11.1614, dateSent: 1997 },
    { id: 'A Message From Earth', dist: 17.56, ra: 209.408, dec: 6.675, dateSent: 2008 },
    { id: 'Lone Signal', dist: 17.56, ra: 209.408, dec: 6.675, dateSent: 2013 },
    { id: 'Teen Age Message', dist: 116, ra: 219.9208, dec: 26.5272, dateSent: 2001 },
    { id: 'Teen Age Message', dist: 54.2, ra: 220.182, dec: -8.6621, dateSent: 2001 },
    { id: 'Arecibo Message', dist: 25100, ra: 250.4235, dec: 36.4613, dateSent: 1974 },
    { id: 'Hommage à Stephen Hawking', dist: 25640, ra: 266.4168, dec: -29.0078, dateSent: 2018 },
    { id: 'Teen Age Message', dist: 27.14, ra: 277.2077, dec: 27.8783, dateSent: 2001 },
    { id: 'Cosmic Call2', dist: 27.14, ra: 277.2077, dec: 27.8783, dateSent: 2003 },
    { id: 'Cosmic Call1', dist: 20, ra: 285.7625, dec: 42.3222, dateSent: 1999 },
    { id: 'Cosmic Call1', dist: 69, ra: 292.1761, dec: 50.5175, dateSent: 1999 },
    { id: 'Teen Age Message', dist: 69, ra: 292.1761, dec: 50.5175, dateSent: 2001 },
    { id: 'Cosmic Call1', dist: 165, ra: 292.6803, dec: 45.2803, dateSent: 1999 },
    { id: 'Altair (Morimoto - Hirabayashi) Message[20]', dist: 16.73, ra: 297.6958, dec: 8.8683, dateSent: 1983 },
    { id: 'Cosmic Call1', dist: 50.12, ra: 300.2615, dec: -1.0097, dateSent: 1999 },
    { id: 'Teen Age Message', dist: 99, ra: 305.2529, dec: 44.4564, dateSent: 2001 },
    { id: 'Cosmic Call2', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2003 },
    { id: 'Wow! Reply', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2012 },
    { id: 'JAXA Space Camp (UDSC-1)', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2013 },
    { id: 'JAXA Space Camp (UDSC-2)', dist: 50.45, ra: 344.3668, dec: 20.7687, dateSent: 2014 },
    { id: 'Sónar Calling GJ273b', dist: 12.36, ra: 111.852, dec: 5.22578930555556, dateSent: 2017 },

]

export const updatedMessages = addDefaultParams(allMessages);
