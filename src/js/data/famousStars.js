// file FamousStars.js:
const famousStars = [
    {
    id: "Proxima Centauri",
    r: 268770,  // Distance in  UA (Astronomical Units), it's approximately 268,770,000,000 UA.
    ra: 217.4289,  // Right Ascension in degrees
    dec: -62.6794,  // Declination in degrees
    vra: -3.85,  // Proper motion in right ascension in milliarcseconds/year
    vdec: 0.78,  // Proper motion in declination in milliarcseconds/year
    vr: -21.7,  // Radial velocity in km/s (towards Earth)
    epoch: "2000-01-01",  // Reference epoch for these coordinates; commonly J2000.0
    nameSet: "Proxima",
    textSet: "Proxima Centauri is the closest star to the Sun.\nIt's part of the Alpha Centauri star system.\nDespite its proximity, it's faint and not visible to the naked eye.",
    refURL: "https://en.wikipedia.org/wiki/Proxima_Centauri"
},
{
    id: "Altair",
    r: 1058340,  // Distance in  UA (Astronomical Units)
    ra: 297.695,  // Right Ascension in degrees
    dec: 8.8683,  // Declination in degrees
    vra: 536.23,  // Proper motion in right ascension in milliarcseconds/year
    vdec: 385.29,  // Proper motion in declination in milliarcseconds/year
    vr: -26.1,  // Radial velocity in km/s (towards Earth)
    epoch: "2000-01-01",  // Reference epoch for these coordinates; commonly J2000.0
    nameSet: "Altair",
    textSet: "Altair is the brightest star in the constellation Aquila and one of the vertices of the Summer Triangle.\nIt's known for its fast rotation, causing it to be oblate in shape.",
    refURL: "https://en.wikipedia.org/wiki/Altair"
},
{
    id: "Vega",
    r: 1602000 ,  // Approximately 25.3 LY
    ra: 279.2347,
    dec: 38.7837,
    vra: 200.94,
    vdec: 286.23,
    vr: -20.6,
    epoch: "2000-01-01",
    nameSet: "Vega",
    textSet: "Vega is the brightest star in the constellation Lyra and was once the northern pole star around 12,000 BC.",
    refURL: "https://en.wikipedia.org/wiki/Vega"
},
{
    id: "Deneb",
    r: 89762362,  // Approximately 1420 LY
    ra: 310.3570,
    dec: 45.2803,
    vra: 1.99,
    vdec: 1.95,
    vr: -4.0,
    epoch: "2000-01-01",
    nameSet: "Deneb",
    textSet: "Deneb is the brightest star in the constellation Cygnus and is one of the farthest stars visible to the naked eye.",
    refURL: "https://en.wikipedia.org/wiki/Deneb"
}
,{
    id: "Alshain",
    r: 2828979,  // Approximately 44.7 LY
    ra: 298.8152,
    dec: 6.4062,
    vra: -107.40,
    vdec: -156.60,
    vr: -13.6,
    epoch: "2000-01-01",
    nameSet: "Alshain",
    textSet: "Alshain is the Beta star of the Aquila constellation, not far from Altair.",
    refURL: "https://en.wikipedia.org/wiki/Beta_Aquilae"
},
{
    id: "Sirius",
    r: 543146,  // Approximately 8.6 LY
    ra: 101.2872,
    dec: -16.7161,
    vra: -546.05,
    vdec: -1223.14,
    vr: -5.5,
    epoch: "2000-01-01",
    nameSet: "Sirius",
    textSet: "Sirius is the brightest star in the night sky. It's often referred to as the 'Dog Star' as it's part of the Canis Major constellation.",
    refURL: "https://en.wikipedia.org/wiki/Sirius"
},
{
    id: "Aldebaran",
    r: 4116994.1,  // Approximately 65.1 LY
    ra: 68.9802,
    dec: 16.5093,
    vra: 63.09,
    vdec: -188.94,
    vr: 54.3,
    epoch: "2000-01-01",
    nameSet: "Aldebaran",
    textSet: "Aldebaran is an orange giant star located in the constellation of Taurus. It's often seen as the bull's eye in the Taurus constellation.",
    refURL: "https://en.wikipedia.org/wiki/Aldebaran"
},
{
    id: "Betelgeuse",
    r: 37941000,  // Approximately 642.5 LY (Distance to Betelgeuse is still a subject of debate and this is an approximation)
    ra: 88.7929,
    dec: 7.4071,
    vra: 26.36,
    vdec: 10.86,
    vr: 21.9,
    epoch: "2000-01-01",
    nameSet: "Betelgeuse",
    textSet: "Betelgeuse is a massive red supergiant located in the Orion constellation. It's known for its variability in brightness and its large size.",
    refURL: "https://en.wikipedia.org/wiki/Betelgeuse"
},
{
    id: "Pollux",
    r: 2103090,  // Approximately 33.7 LY
    ra: 116.3289,
    dec: 28.0262,
    vra: 625.65,
    vdec: -45.72,
    vr: 2.9,
    epoch: "2000-01-01",
    nameSet: "Pollux",
    textSet: "Pollux is the brightest star in the constellation Gemini and is known to have at least one exoplanet. It is also the name of most fluffy cat in the world",
    refURL: "https://en.wikipedia.org/wiki/Pollux_(star)"
},
{
    id: "Fomalhaut",
    r: 1588742.93,  // Approximately 37.5 LY
    ra: 344.4127,
    dec: -29.6222,
    vra: 328.95,
    vdec: -164.67,
    vr: 6.8,
    epoch: "2000-01-01",
    nameSet: "Fomalhaut",
    textSet: "Fomalhaut is a bright star in the constellation Piscis Austrinus and is surrounded by a debris disk where an exoplanet was discovered.",
    refURL: "https://en.wikipedia.org/wiki/Fomalhaut"
},
{
    id: "Arcturus",
    r: 2318936.7,  // Approximately 36.7 LY
    ra: 213.9153,
    dec: 19.1822,
    vra: -1093.45,
    vdec: -1999.40,
    vr: -5.2,
    epoch: "2000-01-01",
    nameSet: "Arcturus",
    textSet: "Arcturus is the brightest star in the Boötes constellation and the fourth-brightest star in the night sky.",
    refURL: "https://en.wikipedia.org/wiki/Arcturus"
},
{
    id: "Regulus",
    r: 4869567.7 ,  // Approximately 77 LY (Approximate)
    ra: 152.0929,
    dec: 11.9672,
    vra: -248.73,
    vdec: 5.62,
    vr: 3.7,
    epoch: "2000-01-01",
    nameSet: "Regulus",
    textSet: "Regulus is the brightest star in the Leo constellation and is known as the 'Heart of the Lion'.",
    refURL: "https://en.wikipedia.org/wiki/Regulus"
},
{
    id: "Algenib",
    r: 21058865.3 ,  // Approximately 91 LY
    ra: 0.2206,
    dec: 15.1836,
    vra: 2.91,
    vdec: -6.99,
    vr: -9.0,
    epoch: "2000-01-01",
    nameSet: "Algenib",
    textSet: "Algenib is a prominent star in the constellation Pegasus, marking the southeastern point of the 'Great Square of Pegasus'.",
    refURL: "https://en.wikipedia.org/wiki/Gamma_Pegasi"
},
{
    id: "Barnard's Star",
    r: 182300,  // Distance in UA (Astronomical Units). As of my last training data (2022), the distance is approximately 5.958 light-years, which is about 182,300,000,000 UA.
    ra: 269.4540,  // Right Ascension in degrees
    dec: 4.6683,  // Declination in degrees
    vra: -798.58,  // Proper motion in right ascension in milliarcseconds/year
    vdec: 10328.12,  // Proper motion in declination in milliarcseconds/year
    vr: -110.6,  // Radial velocity in km/s (towards Earth)
    epoch: "2000-01-01",  // Reference epoch for these coordinates; commonly J2000.0
    nameSet: "Barnard",
    textSet: "Barnard's Star is a red dwarf about six light-years away from Earth in the constellation of Ophiuchus.\nIt has the largest proper motion of any known star relative to the Sun.\nIt's named after the American astronomer E. E. Barnard.",
    refURL: "https://en.wikipedia.org/wiki/Barnard%27s_Star"
}










];


export default famousStars;