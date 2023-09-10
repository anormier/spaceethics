// NE PAS OUBLIER LE " export default allStars " à la fin
//id, suivie de luminosité, position spheric coordinates, speed spheric coordinates, faciles à extraire de gaia. 
// Scales SPACEKIT: UA 
// Scales imports GAIA: pc. Conversions in script.js pc to UA 1 pc = 206264.806 au
// angles degrés
// https://docs.google.com/document/d/1yTf3pZyt0oHXOcD2GHqih9vMRM2k535-KLniOF_a_PA/edit INFOS GAIA

//extract:https://docs.google.com/spreadsheets/d/1hZo6eu1g3FPvoZPskweIHQq5itv72DfXonmT4gzmylo/edit#gid=910194357
// request: 
// SELECT 
//     source_id,
//     parallax_over_error,
//     teff_gspphot,
//     distance_gspphot,
//     ra,
//     radial_velocity,
//     dec,
//     pmra,
//     pmdec
// FROM 
//     external.gaiaedr3_distance 
// JOIN 
//     gaiadr3.gaia_source USING (source_id) 
// WHERE 
//     teff_gspphot > 3000 
//     AND teff_gspphot IS NOT NULL 
// AND  radial_velocity IS NOT NULL 
//     AND distance_gspphot IS NOT NULL 
//     AND parallax_over_error > 100 
//     AND distance_gspphot < 61

function modifyArrayWithMapping(arr) {
    const keyMapping = {
        rmed: 'r',
        vrmed: 'vr',
        eopch: 'epoch'
    };

    return arr.map(entry => {
        let modifiedEntry = { ...entry };
        for (let oldKey in keyMapping) {
            if (oldKey in modifiedEntry) {
                // If the key is 'rmed', multiply its value by 206,265
                if (oldKey === 'rmed') {
                    modifiedEntry[keyMapping[oldKey]] = 206265 * modifiedEntry[oldKey];
                } else {
                    modifiedEntry[keyMapping[oldKey]] = modifiedEntry[oldKey];
                }
                delete modifiedEntry[oldKey];
            }
        }
        return modifiedEntry;
    });
}



// EPOCH AS BEEN FORCED TO '2016-01-01' epoch for gaia DR3
const rawstars100LY6Kmore = [
 
    //// source_id | parallax_over_error | teff_gspphot (K) | distance_gspphot (pc) | ra (deg) | radial_velocity (km.s**-1) | dec (deg) | pmra (mas.yr**-1) | pmdec (mas.yr**-1)

    { id:3796442680948579328, lum:6000.8833, rmed:39022, ra:177.67712091756832, dec:1.763518531662046, vrmed:4.3812613, vra:740.7463388207854 , vdec:-270.92722745007603,eopch: '2016-01-01' },
    { id:4570293086432167168, lum:6000.989, rmed:29.7578, ra:260.6155553820912, dec:24.878641471394456, vrmed:34.25423, vra:74.25800981087886 , vdec:-176.61795659157005,eopch: '2016-01-01' },
    { id:6163964031871884672, lum:6002.626, rmed:29.98, ra:207.22654259480674, dec:-35.70499090650605, vrmed:3.3575354, vra:-529.0809641697749 , vdec:-182.36909175798098,eopch: '2016-01-01' },
    { id:4745373133284418816, lum:6006.4995, rmed:17.3537, ra:40.64179116281783, dec:-50.7993179041391, vrmed:16.935308, vra:333.7156354272668 , vdec:219.42328991689652,eopch: '2016-01-01' },
    { id:4912580642524184960, lum:6011.649, rmed:17.3436, ra:25.62339159017506, dec:-53.74129984828599, vrmed:27.639664, vra:166.04054972266235 , vdec:-105.4958102197813,eopch: '2016-01-01' },
    { id:4421455530273900032, lum:6015.64, rmed:25.426, ra:229.82997775153595, dec:1.763125183445368, vrmed:54.374958, vra:372.21640655243027 , vdec:-513.4827696911725,eopch: '2016-01-01' },
    { id:3482326708703712896, lum:6019.2974, rmed:28.2543, ra:173.0682516830418, dec:-29.260378098702937, vrmed:5.61569, vra:-19.695849319426088 , vdec:144.90735661740385,eopch: '2016-01-01' },
    { id:4303294039306246656, lum:6019.515, rmed:19.4711, ra:297.75794101185363, dec:10.41511259772722, vrmed:-0.08292573, vra:241.71285307318405 , vdec:-136.6945085973383,eopch: '2016-01-01' },
    { id:5663558453071724288, lum:6030.947, rmed:14.9462, ra:145.55812521272944, dec:-23.914401382944526, vrmed:34.69791, vra:-399.4967505319404 , vdec:262.3193092074325,eopch: '2016-01-01' },
    { id:1645425614893967744, lum:6037.433, rmed:25.2677, ra:228.6623049416036, dec:67.34497640770853, vrmed:-48.08172, vra:221.77688612974174 , vdec:-392.7226423724149,eopch: '2016-01-01' },
    { id:1412260533408744832, lum:6038.3213, rmed:29.2764, ra:250.6168075939831, dec:49.9359565740811, vrmed:-13.1412735, vra:133.66124878522623 , vdec:-108.59382358159064,eopch: '2016-01-01' },
    { id:4763906879239461632, lum:6038.381, rmed:1816293, ra:76.3774682786158, dec:-57.47218051585344, vrmed:-1.4497199, vra:-31.90284638111717 , vdec:117.94036172750553,eopch: '2016-01-01' },
    { id:3900151160301345152, lum:6039.1367, rmed:29.9253, ra:185.6327413844966, dec:5.305215979629643, vrmed:4.9223337, vra:-168.0577355981464 , vdec:-51.896488616436756,eopch: '2016-01-01' },
    { id:2023112497641814528, lum:6040.0454, rmed:28.2917, ra:291.35645874334966, dec:24.909971274770594, vrmed:-2.1398625, vra:-176.7365791237489 , vdec:-630.8468691921154,eopch: '2016-01-01' },
    { id:3585098090614578688, lum:6042.4165, rmed:26.9145, ra:174.6671612971082, dec:-13.201382200818335, vrmed:-22.451454, vra:91.84906265374369 , vdec:125.33518456271754,eopch: '2016-01-01' },
    { id:6270906415441316224, lum:6044.928, rmed:17.9841, ra:214.75195942793653, dec:-25.81380529238654, vrmed:-22.284346, vra:-359.0368172376034 , vdec:364.426103312269,eopch: '2016-01-01' },
    { id:187247281185703296, lum:6045.8574, rmed:26.3671, ra:78.32188893184393, dec:37.336703453881604, vrmed:-1.7538819, vra:-144.92237498352853 , vdec:-136.77190703403556,eopch: '2016-01-01' },
    { id:3482326708703712640, lum:6047.773, rmed:28.2021, ra:173.06672103365204, dec:-29.262681479002637, vrmed:7.38057, vra:-22.005703228415747 , vdec:140.41286451718764,eopch: '2016-01-01' },
    { id:6472858766996632704, lum:6047.9023, rmed:24.0776, ra:301.89635259789105, dec:-55.01585673615903, vrmed:12.555019, vra:18.2833513597835 , vdec:35.30973558716803,eopch: '2016-01-01' },
    { id:1995681125599758592, lum:6050.104, rmed:20.5962, ra:349.17709948419514, dec:53.2124234941761, vrmed:-27.219107, vra:112.46137752821828 , vdec:-236.5536757171971,eopch: '2016-01-01' },
    { id:1623289903206300928, lum:6051.014, rmed:21.3807, ra:240.46954398425984, dec:58.56673458360329, vrmed:-3.678585, vra:-319.9683697379936 , vdec:333.90381725946156,eopch: '2016-01-01' },
    { id:2831490694929214464, lum:6052.802, rmed:29.3151, ra:346.63421156748313, dec:19.91087587516367, vrmed:-0.91676986, vra:286.8902678365608 , vdec:5.056834699215168,eopch: '2016-01-01' },
    { id:1558718059209082752, lum:6055.2246, rmed:25.5037, ra:205.09592273572648, dec:50.51967594400644, vrmed:-12.485817, vra:-125.55882106600545 , vdec:58.70790009817415,eopch: '2016-01-01' },
    { id:2899947933845777920, lum:6057.2026, rmed:29.3766, ra:96.79649729040557, dec:-25.857460600679648, vrmed:35.778324, vra:-173.20856749933145 , vdec:-216.59928045349696,eopch: '2016-01-01' },
    { id:3400292798990117888, lum:6065.778, rmed:14.5681, ra:81.10726354597193, dec:17.38350331190306, vrmed:37.700523, vra:250.48290468501668 , vdec:-7.156277817184632,eopch: '2016-01-01' },
    { id:853819947756949120, lum:6066.204, rmed:2747325, ra:157.65517382143014, dec:55.980393770343866, vrmed:8.574124, vra:-177.04479764181383 , vdec:-32.633709910609426,eopch: '2016-01-01' },
    { id:6770313530317154560, lum:6067.7993, rmed:27.5073, ra:288.8890362583546, dec:-24.179808123405238, vrmed:-24.695957, vra:118.5673340061573 , vdec:-102.36351827799524,eopch: '2016-01-01' },
    { id:1230894097540611968, lum:6074.6255, rmed:24.4776, ra:208.95697391276858, dec:14.056540877084931, vrmed:-10.267005, vra:-290.87925072651205 , vdec:8.702870053713218,eopch: '2016-01-01' },
    { id:5059348952161258624, lum:6080.855, rmed:14.0039, ra:48.020701120552644, dec:-28.98487006133274, vrmed:-16.970135, vra:359.56470853011956 , vdec:619.1858578778375,eopch: '2016-01-01' },
    { id:6395705074002990592, lum:6085.5635, rmed:30.1622, ra:331.97312566875837, dec:-70.28565539773999, vrmed:-12.751867, vra:74.20268704386612 , vdec:11.384893161024975,eopch: '2016-01-01' },
    { id:5493209501673364736, lum:6089.3066, rmed:30.034, ra:116.05133455123536, dec:-50.456088282909235, vrmed:8.49006, vra:-114.34423196074778 , vdec:143.56570615352388,eopch: '2016-01-01' },
    { id:6401464693867773568, lum:6092.6636, rmed:201494, ra:321.61171581249374, dec:-65.3626399731515, vrmed:-29.779509, vra:80.81524728416929 , vdec:800.5726893856181,eopch: '2016-01-01' },
    { id:348020482735930112, lum:6096.4243, rmed:13.5205, ra:24.198321215249642, dec:41.4037617615712, vrmed:-28.74587, vra:-171.89184082707104 , vdec:-381.8151588992299,eopch: '2016-01-01' },
    { id:5357075947709011456, lum:6096.4644, rmed:22.1021, ra:157.8377665452764, dec:-53.71455177900993, vrmed:21.188463, vra:-419.934543069276 , vdec:209.67075270384635,eopch: '2016-01-01' },
    { id:1610729219809525888, lum:6099.685, rmed:29.3302, ra:218.56818077875246, dec:57.06422127308439, vrmed:-21.312485, vra:218.3411300621506 , vdec:-233.0856253786666,eopch: '2016-01-01' },
    { id:5567900121118276736, lum:6100.422, rmed:27.1282, ra:91.11797968025996, dec:-45.03550909781477, vrmed:27.551954, vra:-82.26211356340089 , vdec:246.245830355144,eopch: '2016-01-01' },
    { id:1896891139712235008, lum:6100.8906, rmed:29.2462, ra:329.66827482875885, dec:29.810909714223325, vrmed:9.202195, vra:-362.8697268961974 , vdec:-386.72752905225923,eopch: '2016-01-01' },
    { id:1141280704422528128, lum:6105.6284, rmed:18.1976, ra:101.55652486903517, dec:79.56212608725718, vrmed:15.295912, vra:-99.16304484778603 , vdec:-604.042255390708,eopch: '2016-01-01' },
    { id:5848156426657892480, lum:6109.058, rmed:27.7421, ra:219.43862180151382, dec:-67.93325837056041, vrmed:-30.564247, vra:-347.85978165235576 , vdec:-280.8074039955553,eopch: '2016-01-01' },
    { id:2473608009504466688, lum:6112.7383, rmed:15.9155, ra:12.530589460777726, dec:-10.645349194018035, vrmed:8.212956, vra:-228.03114929883466 , vdec:-229.57749769142683,eopch: '2016-01-01' },
    { id:2416611663182821120, lum:6115.5513, rmed:18.8917, ra:2.8156932027646513, dec:-15.469175920957877, vrmed:14.945747, vra:-82.82753394668673 , vdec:-269.54931904691836,eopch: '2016-01-01' },
    { id:1291886309636988416, lum:6116.552, rmed:29.9066, ra:226.64608491843208, dec:36.45625390907102, vrmed:-5.7382307, vra:-64.01985977891863 , vdec:42.40571298372659,eopch: '2016-01-01' },
    { id:594989348593414016, lum:6126.3613, rmed:26.1934, ra:128.9618235438334, dec:6.61962210473276, vrmed:19.99037, vra:-130.30841350309237 , vdec:-133.1188264833495,eopch: '2016-01-01' },
    { id:336538454607430016, lum:6128.881, rmed:30.3078, ra:43.56004532742988, dec:42.588420745450975, vrmed:25.260845, vra:207.61576522939527 , vdec:-81.99210219584415,eopch: '2016-01-01' },
    { id:716109930305855360, lum:6130.977, rmed:27.35, ra:132.63392508684714, dec:33.28468307227289, vrmed:4.221977, vra:-63.320437825862314 , vdec:-83.55226679771539,eopch: '2016-01-01' },
    { id:6489909443564308224, lum:6132.6636, rmed:20.4408, ra:349.2420354292303, dec:-62.00131377033478, vrmed:0.63290673, vra:176.49173473906038 , vdec:-26.091789892367963,eopch: '2016-01-01' },
    { id:1604859511344724864, lum:6135.789, rmed:14.502, ra:216.2974561533579, dec:51.84896726025888, vrmed:-10.912974, vra:-235.96991928915273 , vdec:-399.6956968159237,eopch: '2016-01-01' },
    { id:2756363608023588864, lum:6149.203, rmed:13.8409, ra:354.9893506001899, dec:5.6243516012277475, vrmed:5.529699, vra:376.4966061507007 , vdec:-436.7597624667563,eopch: '2016-01-01' },
    { id:2964000159821218432, lum:6149.223, rmed:2637630, ra:86.11439122579156, dec:-22.45002336420253, vrmed:-8.989398, vra:-291.75677673534847 , vdec:-368.5208157670237,eopch: '2016-01-01' },
    { id:1592338513445876608, lum:6151.607, rmed:25.143, ra:224.0967635077348, dec:49.62744567978032, vrmed:-15.514576, vra:111.03890645611278 , vdec:-225.956401079542,eopch: '2016-01-01' },
    { id:225668203191521280, lum:6156.2456, rmed:21.1774, ra:62.153501663283706, dec:38.03884341956174, vrmed:26.34361, vra:164.82945356198124 , vdec:-201.40276887018763,eopch: '2016-01-01' },
    { id:3256786534197166208, lum:6158.534, rmed:18.6935, ra:60.65376793828089, dec:-0.27004039273291525, vrmed:17.615149, vra:150.02720734285322 , vdec:-251.58943536828917,eopch: '2016-01-01' },
    { id:4937183864463433216, lum:6169.6743, rmed:26.6928, ra:29.252439835818727, dec:-51.765140916391516, vrmed:3.9472847, vra:348.5887155734522 , vdec:248.61642022313202,eopch: '2016-01-01' },
    { id:1635375460142367104, lum:6169.928, rmed:15.5205, ra:254.0095535449022, dec:65.13502280368243, vrmed:-20.669493, vra:237.18542448644493 , vdec:49.07700315474167,eopch: '2016-01-01' },
    { id:4976894960284258048, lum:6170.423, rmed:26.1689, ra:1.5837990651942728, dec:-49.075368186630975, vrmed:5.7567415, vra:575.0993084165844 , vdec:-40.8740956886412,eopch: '2016-01-01' },
    { id:2717930312217660928, lum:6174.282, rmed:27.4074, ra:343.1026626685172, dec:9.835859682863124, vrmed:12.002857, vra:521.5134519786967 , vdec:43.775711261276484,eopch: '2016-01-01' },
    { id:6802426038708609536, lum:6179.209, rmed:21.0787, ra:314.19768133427806, dec:-26.296669316774295, vrmed:-16.08618, vra:94.01306591720657 , vdec:-65.57632186904392,eopch: '2016-01-01' },
    { id:1193030490492925824, lum:6182.6055, rmed:11.167, ra:239.11469743534354, dec:15.655912590196278, vrmed:6.506411, vra:311.18254717012934 , vdec:-1282.7670369101927,eopch: '2016-01-01' },
    { id:1805044913356835328, lum:6187.4033, rmed:26.0341, ra:305.71856783031404, dec:14.55106583597575, vrmed:4.7137027, vra:78.99722408628381 , vdec:-7.142676183964748,eopch: '2016-01-01' },
    { id:5584019442620181760, lum:6190.495, rmed:23.9246, ra:101.34444954450602, dec:-31.79505826654203, vrmed:28.686024, vra:-217.1382944216086 , vdec:-317.2832055253967,eopch: '2016-01-01' },
    { id:6477114289313395328, lum:6194.935, rmed:27.4353, ra:315.08889460132485, dec:-51.264726458819, vrmed:-22.387444, vra:-86.96035583134426 , vdec:132.06561023633813,eopch: '2016-01-01' },
    { id:683184784030475520, lum:6195.425, rmed:18.2117, ra:125.01599916401489, dec:27.21602917222347, vrmed:32.857037, vra:-17.475402055327848 , vdec:-377.0719170606808,eopch: '2016-01-01' },
    { id:4532560355640612608, lum:6199.4194, rmed:29.3822, ra:282.06846728802026, dec:23.514716532286258, vrmed:3.3526938, vra:25.348909745947985 , vdec:-7.143635208801668,eopch: '2016-01-01' },
    { id:2498460442625153536, lum:6208.489, rmed:22.2889, ra:40.30930839090126, dec:-0.6962055847301062, vrmed:7.9355035, vra:220.02154488466715 , vdec:-124.6614106405939,eopch: '2016-01-01' },
    { id:6062166950467100032, lum:6210.112, rmed:18.195, ra:198.5609508085928, dec:-59.10391799181995, vrmed:-63.565937, vra:-248.67816613618473 , vdec:-153.17614681185552,eopch: '2016-01-01' },
    { id:482846859145086208, lum:6212.7236, rmed:28.0848, ra:75.71091651817629, dec:66.82148082175372, vrmed:15.6368065, vra:67.02848159112631 , vdec:-335.6804443164605,eopch: '2016-01-01' },
    { id:5725122999630404096, lum:6216.3945, rmed:22.5273, ra:122.6647915359159, dec:-13.798947414957585, vrmed:33.232998, vra:-250.9473204757801 , vdec:58.20174107561441,eopch: '2016-01-01' },
    { id:6698960688866464768, lum:6223.4424, rmed:22.1346, ra:300.08506043759076, dec:-33.70473731804371, vrmed:-7.848643, vra:128.79449713303143 , vdec:-289.36029516227507,eopch: '2016-01-01' },
    { id:3066710282611675776, lum:6226.6924, rmed:27.0255, ra:126.14494794137273, dec:-3.7513579180676873, vrmed:97.622246, vra:-212.04420762858138 , vdec:-25.969175965084105,eopch: '2016-01-01' },
    { id:5923907314622859520, lum:6227.9023, rmed:26.8017, ra:255.78630690246376, dec:-53.23757508910149, vrmed:13.357774, vra:-22.40938645495512 , vdec:-143.79304907184536,eopch: '2016-01-01' },
    { id:2136027771930903808, lum:6233.2827, rmed:25.4186, ra:293.5826716299279, dec:51.235780633647444, vrmed:0.9790055, vra:30.472306875887156 , vdec:-188.57044053085562,eopch: '2016-01-01' },
    { id:1068982214258617216, lum:6235.699, rmed:20.5509, ra:137.59826115667667, dec:67.13362657576307, vrmed:-3.1775482, vra:13.118896132255593 , vdec:-87.8814638931786,eopch: '2016-01-01' },
    { id:6879764552737781888, lum:6248.776, rmed:28.2184, ra:303.1086735704209, dec:-12.618367150928863, vrmed:27.201628, vra:193.1113440824864 , vdec:-195.66182778153407,eopch: '2016-01-01' },
    { id:5129338021224785408, lum:6255.476, rmed:14.263, ra:41.277321981998256, dec:-18.572408740298428, vrmed:29.086166, vra:318.56773976043957 , vdec:48.17070857421047,eopch: '2016-01-01' },
    { id:976893923544104576, lum:6266.647, rmed:20.4236, ra:112.4839174979886, dec:49.672091036241135, vrmed:-27.074326, vra:111.04697948837028 , vdec:-82.8842809292091,eopch: '2016-01-01' },
    { id:553480551264062848, lum:6270.167, rmed:20.8123, ra:80.6378397862045, dec:79.23187117015195, vrmed:-11.085717, vra:-78.66075047072465 , vdec:162.09818613213187,eopch: '2016-01-01' },
    { id:2035035223783462400, lum:6271.1895, rmed:20.9738, ra:296.60678841603806, dec:33.72560570838146, vrmed:4.429934, vra:22.7449245797429 , vdec:-448.31148005324894,eopch: '2016-01-01' },
    { id:4117290138348536064, lum:6274.9985, rmed:17.2313, ra:265.85700792887656, dec:-21.683392427381285, vrmed:10.360545, vra:-97.25257596448583 , vdec:-44.61396749521905,eopch: '2016-01-01' },
    { id:984918228123275776, lum:6279.799, rmed:29.9711, ra:117.77349659827298, dec:54.12948075949114, vrmed:1.5310788, vra:-39.537841268457484 , vdec:53.8940468533593,eopch: '2016-01-01' },
    { id:5567901976544151168, lum:6279.8643, rmed:27.8729, ra:91.16657974589586, dec:-45.07779707750548, vrmed:25.845097, vra:-80.83053585207358 , vdec:251.61725298958268,eopch: '2016-01-01' },
    { id:3212075924646082176, lum:6280.416, rmed:24.9889, ra:77.18231993661391, dec:-4.456136052979699, vrmed:10.306102, vra:54.27815536927694 , vdec:16.252363020034437,eopch: '2016-01-01' },
    { id:6612242034982766848, lum:6281.1714, rmed:18.3452, ra:332.53884519084073, dec:-32.54834854643202, vrmed:-16.343624, vra:428.8323874753169 , vdec:13.47523121061188,eopch: '2016-01-01' },
    { id:438829629114680704, lum:6281.219, rmed:-188158, ra:41.05222216366374, dec:49.22805187168278, vrmed:24.550722, vra:334.70816467359896 , vdec:-89.25073359566134,eopch: '2016-01-01' },
    { id:4925088171405735680, lum:6286.5425, rmed:25.7576, ra:8.617616679574523, dec:-52.372923420749004, vrmed:36.65829, vra:226.880242500261 , vdec:37.82348347822385,eopch: '2016-01-01' },
    { id:5317114850417299584, lum:6289.0312, rmed:24.3452, ra:133.79928015793473, dec:-54.96617494635676, vrmed:-6.2892346, vra:24.398212954927402 , vdec:-91.36268997181108,eopch: '2016-01-01' },
    { id:1931708859034495488, lum:6305.054, rmed:28.608, ra:347.61220703892667, dec:43.54339487364322, vrmed:-32.22039, vra:-211.68913791329368 , vdec:-144.5354509771659,eopch: '2016-01-01' },
    { id:5557816190743628416, lum:6306.3867, rmed:25.1989, ra:102.47756207116845, dec:-46.612900315158655, vrmed:20.831383, vra:-0.9318060137511992 , vdec:373.786419814021,eopch: '2016-01-01' },
    { id:4530744134231683840, lum:6313.346, rmed:19.8054, ra:281.4154805359527, dec:20.544817390173186, vrmed:23.169113, vra:-9.0864737300157 , vdec:-335.65510379164584,eopch: '2016-01-01' },
    { id:1891598193816300544, lum:6316.102, rmed:2729399, ra:331.7542260532072, dec:25.34522096646813, vrmed:-6.9413967, vra:295.4762646451181 , vdec:27.441697940510274,eopch: '2016-01-01' },
    { id:1244571953471006720, lum:6319.2407, rmed:15.6162, ra:206.8133909945028, dec:17.457173637726076, vrmed:-16.750475, vra:-468.9225601068748 , vdec:63.46858141462215,eopch: '2016-01-01' },
    { id:2161275788716592256, lum:6340.9185, rmed:23.0831, ra:273.47793312479706, dec:64.3974430759749, vrmed:-36.069424, vra:352.9180535417044 , vdec:35.57224637159496,eopch: '2016-01-01' },
    { id:2475331528340199936, lum:6346.4976, rmed:24.0768, ra:18.600727000304673, dec:-7.921590239401472, vrmed:21.815023, vra:124.22535432185029 , vdec:278.006566358978,eopch: '2016-01-01' },
    { id:1896396703077703936, lum:6346.832, rmed:26.9608, ra:328.12435326523473, dec:28.793268062528412, vrmed:19.173674, vra:-59.168627603862106 , vdec:-61.60277745767016,eopch: '2016-01-01' },
    { id:3837697972130323456, lum:6353.532, rmed:17.776, ra:142.28773185495155, dec:-2.7690784103141683, vrmed:9.92633, vra:116.37442188133139 , vdec:-31.264758127632703,eopch: '2016-01-01' },
    { id:624684408880100992, lum:6358.3823, rmed:21.3211, ra:154.932943049452, dec:19.469961355767943, vrmed:6.4598227, vra:-230.58855862256326 , vdec:-214.06858993367928,eopch: '2016-01-01' },
    { id:466417441010173568, lum:6359.0244, rmed:26.7602, ra:43.98852509731438, dec:61.52127542822864, vrmed:29.14368, vra:145.36445638313378 , vdec:31.06251651358064,eopch: '2016-01-01' },
    { id:1760960887992601984, lum:6374.5786, rmed:30.2509, ra:312.4076040668981, dec:12.545558669458336, vrmed:4.5451794, vra:52.776432845180295 , vdec:97.02046980729772,eopch: '2016-01-01' },
    { id:2309813109479463040, lum:6386.1406, rmed:21.6819, ra:2.9343520768768716, dec:-35.132557218922194, vrmed:-1.1540409, vra:171.2981178818337 , vdec:125.4361281617478,eopch: '2016-01-01' },
    { id:1019361632454363904, lum:6400.1514, rmed:29.1728, ra:140.18208798822297, dec:51.26670357695748, vrmed:-7.8950043, vra:-35.156279712026326 , vdec:143.91776945927575,eopch: '2016-01-01' },
    { id:5593584059914156800, lum:6421.102, rmed:18.3141, ra:118.06419139640802, dec:-34.70437853685907, vrmed:28.032436, vra:-198.09607031167099 , vdec:238.81180023957108,eopch: '2016-01-01' },
    { id:3374052988354372992, lum:6454.238, rmed:21.8258, ra:93.71152551193154, dec:19.155636998390975, vrmed:34.54803, vra:-97.6083565897556 , vdec:-182.44758058610475,eopch: '2016-01-01' },
    { id:3331979901042416512, lum:6455.563, rmed:19.5807, ra:94.11128944061781, dec:12.272992041846027, vrmed:9.396341, vra:82.77514649355062 , vdec:186.48042272707457,eopch: '2016-01-01' },
    { id:1264630412816366720, lum:6456.2046, rmed:19.5272, ra:226.82617958714343, dec:24.86846415306875, vrmed:-9.28775, vra:184.7140536323467 , vdec:-164.27907154680298,eopch: '2016-01-01' },
    { id:6628926642897745664, lum:6461.2324, rmed:23.0335, ra:338.6745333817373, dec:-20.708869546615368, vrmed:-2.2012024, vra:221.18479846169237 , vdec:-147.09019898435704,eopch: '2016-01-01' },
    { id:4626843786944938880, lum:6480.9736, rmed:29.1945, ra:48.99258744969143, dec:-77.38817680148803, vrmed:14.156246, vra:113.65756344328061 , vdec:62.37521534545705,eopch: '2016-01-01' },
    { id:5087043657197267200, lum:6483.9487, rmed:17.9003, ra:56.71125691970994, dec:-23.252076788991744, vrmed:7.828097, vra:-159.91989296143683 , vdec:-529.6464279832751,eopch: '2016-01-01' },
    { id:397372371388455424, lum:6485.3086, rmed:28.8077, ra:21.916349868710668, dec:45.4061957177476, vrmed:14.100414, vra:357.5637750861475 , vdec:-110.03930027805396,eopch: '2016-01-01' },
    { id:5946685759563224960, lum:6494.879, rmed:21.1053, ra:265.0999815874886, dec:-49.416365160249036, vrmed:3.4034708, vra:103.68534600810366 , vdec:-175.95641378737966,eopch: '2016-01-01' },
    { id:4785713458992582272, lum:6513.1924, rmed:26.2553, ra:75.70255975133574, dec:-49.15128404372467, vrmed:21.16242, vra:-43.98480046587578 , vdec:27.51858595708385,eopch: '2016-01-01' },
    { id:3113219383954556416, lum:6524.2827, rmed:29.8156, ra:102.70772041649637, dec:-0.5417075404341039, vrmed:-12.462509, vra:20.551575274761728 , vdec:-186.22943723851486,eopch: '2016-01-01' },
    { id:6148648281576023424, lum:6527.023, rmed:24.836, ra:180.91680334429074, dec:-42.434552329476595, vrmed:39.475822, vra:318.5543138854704 , vdec:-111.11961917965675,eopch: '2016-01-01' },
    { id:5210240327318434304, lum:6532.6333, rmed:19.5077, ra:124.63363893110254, dec:-76.9192479593938, vrmed:-12.595566, vra:110.51480172689814 , vdec:107.12500961635023,eopch: '2016-01-01' },
    { id:6830187710876927616, lum:6537.821, rmed:27.5001, ra:323.7125579564056, dec:-20.084125831253843, vrmed:4.772284, vra:-33.742153333093384 , vdec:30.369288893255565,eopch: '2016-01-01' },
    { id:1380421150568828800, lum:6572.2017, rmed:26.9654, ra:244.97902101147605, dec:39.708562338574204, vrmed:-26.996635, vra:-127.77574629361075 , vdec:-4.7512236354982775,eopch: '2016-01-01' },
    { id:2135110401277424384, lum:6578.421, rmed:18.4115, ra:294.1105137988449, dec:50.22227321404957, vrmed:-27.18602, vra:-5.854439709270821 , vdec:263.6604096992894,eopch: '2016-01-01' },
    { id:4674061076849768832, lum:6579.7573, rmed:21.8073, ra:52.34822619825845, dec:-62.93586859425676, vrmed:12.958689, vra:382.537613650981 , vdec:373.58875235215316,eopch: '2016-01-01' },
    { id:5303126622967647488, lum:6589.991, rmed:26.268, ra:134.84923965459402, dec:-59.08245809600036, vrmed:12.99474, vra:-175.40523753459865 , vdec:282.0795339522612,eopch: '2016-01-01' },
    { id:1226844321337777536, lum:6595.145, rmed:26.089, ra:214.81831214728047, dec:13.004162152629776, vrmed:-1.2019982, vra:105.22647578709258 , vdec:-31.259573529936144,eopch: '2016-01-01' },
    { id:5989102478619519616, lum:6596.695, rmed:17.4436, ra:235.2963466961976, dec:-44.6623899936602, vrmed:-3.9631126, vra:-169.10565112984054 , vdec:-266.39145844308257,eopch: '2016-01-01' },
    { id:2786203082290674048, lum:6658.891, rmed:25.3766, ra:21.56347190197723, dec:19.17239753857376, vrmed:-3.7263188, vra:-25.803372118812554 , vdec:11.282766954846155,eopch: '2016-01-01' },
    { id:4866371879660471808, lum:6665.7456, rmed:28.8906, ra:70.514746883652, dec:-37.143384868775584, vrmed:27.467043, vra:42.56064406258216 , vdec:212.7051037058528,eopch: '2016-01-01' },
    { id:4190374813602603392, lum:6686.339, rmed:27.4388, ra:297.6947837173009, dec:-10.763365503216729, vrmed:12.498825, vra:-32.90366214433082 , vdec:32.352773537461545,eopch: '2016-01-01' },
    { id:1576850723937017216, lum:6694.75, rmed:25.2531, ra:195.183114888134, dec:56.366353759527094, vrmed:-3.4519448, vra:140.08193742190883 , vdec:-0.05850076217214359,eopch: '2016-01-01' },
    { id:3526420114274019456, lum:6746.5283, rmed:18.3298, ra:188.0156449228337, dec:-16.196264029437497, vrmed:-1.1636719, vra:-424.596782433152 , vdec:-58.2411313459339,eopch: '2016-01-01' },
    { id:1704062466923822336, lum:6763.9507, rmed:30.2127, ra:244.37472356719266, dec:75.75643519854079, vrmed:-10.7307005, vra:-77.64703535197518 , vdec:245.7261135172886,eopch: '2016-01-01' },
    { id:5175014311223513984, lum:6790.8174, rmed:29.948, ra:35.507075429878995, dec:-10.77789995273945, vrmed:12.794739, vra:153.24900167620882 , vdec:-82.01341975002126,eopch: '2016-01-01' },
    { id:5509770796785820416, lum:6843.7666, rmed:21.4153, ra:108.13922367542023, dec:-46.758827129126175, vrmed:0.19814944, vra:-135.80612317341138 , vdec:107.43332716701347,eopch: '2016-01-01' },
    { id:164262059326729088, lum:6855.559, rmed:27.7565, ra:61.7514381847838, dec:29.00134411387584, vrmed:8.596618, vra:-91.66088401067995 , vdec:8.095730702510371,eopch: '2016-01-01' },
    { id:6053245135154609280, lum:6863.083, rmed:19.6966, ra:181.72076420594314, dec:-64.61389471172151, vrmed:13.127231, vra:34.27029065373058 , vdec:-36.90243212526111,eopch: '2016-01-01' },
    { id:2995725777563537792, lum:6887.405, rmed:14.8215, ra:89.10103276512667, dec:-14.16708077541103, vrmed:-1.8705802, vra:-41.4740727699853 , vdec:139.22152520681215,eopch: '2016-01-01' },
    { id:2349940954566607488, lum:6898.924, rmed:27.3045, ra:11.184668731777494, dec:-22.005769628203897, vrmed:11.6031275, vra:-65.73654048146709 , vdec:81.84129384667315,eopch: '2016-01-01' },
    { id:854734436486835840, lum:6908.111, rmed:26.8633, ra:158.7909340238363, dec:57.08280045492562, vrmed:-12.316851, vra:66.44928179514501 , vdec:37.14489964223927,eopch: '2016-01-01' },
    { id:265722999474087424, lum:6923.977, rmed:26.9669, ra:76.66908986187244, dec:51.59695829274448, vrmed:-0.4701222, vra:-28.55662871212375 , vdec:-171.8215934348077,eopch: '2016-01-01' },
    { id:4815660547961306112, lum:6978.425, rmed:20.4143, ra:70.13963424554842, dec:-41.86408761019901, vrmed:0.6507744, vra:-139.84317633357577 , vdec:-75.67725038342462,eopch: '2016-01-01' },
    { id:892160231749198848, lum:7002.8057, rmed:17.8343, ra:112.27878982917893, dec:31.785435445699783, vrmed:-2.673891, vra:137.99727516179132 , vdec:129.0353821378184,eopch: '2016-01-01' },
    { id:2292498687560557056, lum:7044.5723, rmed:27.4613, ra:287.29217458985556, dec:76.55997286807307, vrmed:-3.76512, vra:52.39022129187438 , vdec:-119.46885379510789,eopch: '2016-01-01' },
    { id:6554537293934842496, lum:7073.6367, rmed:29.113, ra:345.8746296234163, dec:-34.74904030453063, vrmed:-14.409368, vra:73.68032610794052 , vdec:84.40214526234901,eopch: '2016-01-01' },
    { id:4781833626056162688, lum:7150.176, rmed:20.4509, ra:64.00732824955732, dec:-51.485829399691184, vrmed:25.252098, vra:100.50178325844524 , vdec:184.18020871545048,eopch: '2016-01-01' },
    { id:6454999399628150016, lum:7178.785, rmed:28.3768, ra:308.89584121149846, dec:-60.58257517423834, vrmed:-17.585524, vra:69.91185300956079 , vdec:-185.86115044133652,eopch: '2016-01-01' },
    { id:1990723839987250176, lum:7228.844, rmed:24.9555, ra:348.1381289460739, dec:49.40663255425639, vrmed:11.032851, vra:89.93876239284411 , vdec:95.70388278681992,eopch: '2016-01-01' },
    { id:4111251723554095104, lum:7271.484, rmed:25.209, ra:261.5925594346209, dec:-24.175828848401494, vrmed:-34.804585, vra:-1.947103476914461 , vdec:-117.42825173713753,eopch: '2016-01-01' },
    { id:6471630024096107008, lum:7365.161, rmed:24.6492, ra:311.01085387228005, dec:-51.921213220706434, vrmed:-3.9316726, vra:156.66287256356512 , vdec:-54.64446797688421,eopch: '2016-01-01' },
    { id:49298394834276608, lum:7460.598, rmed:28.6899, ra:64.31506301993932, dec:20.578332998961216, vrmed:13.233951, vra:-40.374722938049395 , vdec:-59.485643178719705,eopch: '2016-01-01' },
    { id:1014058103758571520, lum:7498.3286, rmed:14.7754, ra:134.7989643318015, dec:48.040871471105525, vrmed:13.000446, vra:-439.83552453066625 , vdec:-214.0709500414631,eopch: '2016-01-01' },
    { id:5541379935031012608, lum:7570.1772, rmed:28.992, ra:124.63819225374212, dec:-36.658842804982086, vrmed:4.339558, vra:-110.48132725605865 , vdec:100.4429691628914,eopch: '2016-01-01' },
    { id:1565090003967879424, lum:7910.655, rmed:25.2161, ra:201.30730577290853, dec:54.987845339784336, vrmed:-6.9174094, vra:113.36969394609814 , vdec:-29.497532865986326,eopch: '2016-01-01' },
    { id:4792774797545800832, lum:7938.053, rmed:19.8294, ra:86.82123452009108, dec:-51.066136257823345, vrmed:16.84059, vra:5.160196860824648 , vdec:84.0405295978282,eopch: '2016-01-01' },
    { id:3662636823132300032, lum:8066.827, rmed:23.2578, ra:203.67206658148982, dec:-0.5956181019830046, vrmed:-5.7275577, vra:-276.9029992866074 , vdec:44.62071265610922,eopch: '2016-01-01' },
    { id:4482432246132106496, lum:8113.18, rmed:27.7235, ra:271.837158305769, dec:9.564197857391276, vrmed:-21.419231, vra:-61.8043368111011 , vdec:79.00439389953141,eopch: '2016-01-01' },
    { id:4426032591025363200, lum:8196.269, rmed:21.586, ra:237.7045892801561, dec:4.478006603862712, vrmed:-9.904642, vra:127.25727237021401 , vdec:62.01738031154802,eopch: '2016-01-01' },
    { id:1575287046603605888, lum:8298.355, rmed:24.8566, ra:183.85734834773095, dec:57.03265316489124, vrmed:-12.387454, vra:103.94679584135581 , vdec:8.141463801370662,eopch: '2016-01-01' },
    { id:4512265810537057664, lum:8369.756, rmed:27.9523, ra:281.7556053210387, dec:18.182027709302517, vrmed:-44.109154, vra:98.83509154388179 , vdec:115.12046908681071,eopch: '2016-01-01' },
    
]
const stars100LY6Kmore = modifyArrayWithMapping(rawstars100LY6Kmore);
export default stars100LY6Kmore;

