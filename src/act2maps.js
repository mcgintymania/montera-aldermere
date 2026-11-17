'use strict';
/* =====================================================================
   ACT II MAPS + STORY — Route 3 → Hollowpeak Cave → Voltara (Dynamo Works,
   Spark Hall) → Route 4 (sea) → Cinderhollow (Forge Hall) → Emberforge
   ===================================================================== */
const a2 = () => (G.quests.act2 ? (G.quests.act2.done ? 99 : G.quests.act2.stage) : -1);

/* ---------- Port Calder: open the west road ---------- */
DATA.maps.port_calder.rows[7] = '__' + DATA.maps.port_calder.rows[7].slice(2);
DATA.maps.port_calder.connections.west = { map: 'route3', dy: 1 };
DATA.maps.port_calder.npcs.push({ id: 'rockfall', x: 2, y: 7, dir: 'right', look: 'hiker', name: 'Road Worker', cond: (g) => !g.flags.beat_coral,
  talk: ['Route 3 is closed. A rockfall came down in the storm.', 'Coral\'s harbour patrol is helping us clear it. Should be open by the time you have her Badge!'] });
DATA.maps.port_calder.props.push({ type: 'sign', x: 3, y: 9, text: 'ROUTE 3\nWest to Hollowpeak Cave and Voltara.' });
DATA.maps.mossgate.props = DATA.maps.mossgate.props.map((p) => (p.text && p.text.startsWith('ROUTE 3 TO') ? Object.assign({}, p, { text: 'ROUTE 9 TO IRONMOUTH\nCLOSED: ROCKSLIDE. Crews are working on it.' }) : p));

const HEARTH = (name, region, rest, back, nurse, extra = []) => ({
  name, region, music: 'indoor', outdoor: false, rest, rows: DATA.maps.fern_hearth.rows.slice(),
  warps: [{ x: 5, y: 7, to: back }, { x: 6, y: 7, to: back }], tileScripts: { '10,3': 'storagePc' },
  npcs: [{ id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', name: nurse, script: 'nurse' }].concat(extra),
});
const MART = (name, region, back, shop, extra = []) => ({
  name, region, music: 'indoor', outdoor: false, rows: DATA.maps.fern_mart.rows.slice(),
  warps: [{ x: 4, y: 7, to: back }, { x: 5, y: 7, to: back }],
  npcs: [{ id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', name: 'Clerk', script: 'shop5', shop }].concat(extra),
});
const HOUSE = (name, region, back, npcs, tileText) => ({
  name, region, music: 'indoor', outdoor: false, rows: DATA.maps.fern_house.rows.slice(),
  warps: [{ x: 4, y: 7, to: back }, { x: 5, y: 7, to: back }], tileText: tileText || {}, npcs,
});

/* ---------- ROUTE 3 ---------- */
DATA.maps.route3 = {
  name: 'Route 3', region: 'route3', music: 'route', outdoor: true, border: 'r',
  rows: [
    'rrTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'rrTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'rrrrrr..rrrr..................,,,,,,...T',
    'rrrrrr..rrrr..................,,,,,,...T',
    'rrrrrr..rrrr.._______________.......rrrT',
    'rr............_............._.......rrrT',
    'rr............_..,,,,,,,,,.._.......rrrT',
    'rr.._........._..,,,,,,,,,.._..........T',
    'rr.._........._..,,,,,,,,,..____________',
    'rr.._........._...............vvvvvv...T',
    'rr..___________.vvvvv.rrrrr...,,,,,,,,.T',
    'rr...,,,,,,,,......rr.rrrrr...,,,,,,,,.T',
    'rr...,,,,,,,,......rr.rrrrr...,,,,,,,,.T',
    'rr.....................................T',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrT',
    'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrT',
  ],
  connections: { east: { map: 'port_calder', dy: -1 } },
  buildings: [{ kind: 'cavemouth', x: 4, y: 4, w: 3, h: 3, door: 1, to: { map: 'hollowpeak', x: 19, y: 16, dir: 'up' } }],
  props: [{ type: 'sign', x: 37, y: 9, text: 'ROUTE 3\nWest: Hollowpeak Cave   East: Port Calder' }, { type: 'sign', x: 7, y: 7, text: 'HOLLOWPEAK CAVE\nThrough to Voltara. Mind your head!' }],
  items: [{ id: 'hp', x: 35, y: 3, item: 'super_potion' }, { id: 'gl', x: 3, y: 13, item: 'great_lantern', qty: 3 }, { id: 'th', x: 24, y: 9, item: 'thunder_shard', hidden: true }],
  npcs: [
    { id: 'cora', x: 22, y: 4, dir: 'down', look: 'hiker', trainer: 'cora', sight: 1, name: 'Hiker Cora' },
    { id: 'juno', x: 14, y: 9, dir: 'right', look: 'lass', trainer: 'pip3', sight: 1, name: 'Lass Juno' },
    { id: 'kai', x: 29, y: 13, dir: 'up', look: 'blackbelt', trainer: 'kai3', sight: 3, name: 'Black Belt Kai' },
  ],
};

/* ---------- HOLLOWPEAK CAVE ---------- */
DATA.maps.hollowpeak = {
  name: 'Hollowpeak Cave', region: 'hollowpeak', music: 'cave', outdoor: false, dim: 0.55, caveEnc: true,
  rows: [
    'EEEEEEEEEEEEEEEEEEEEEEEE',
    'EEeeeEEEEEEEEEEEEEEEEEEE',
    'EeeeeeeeeeEEEEeeeeeeeeEE',
    'EEEeeeeeeeeEEEeeeeeeeeEE',
    'EEEEEEEEeeeeeeeeeeEEeeEE',
    'EeeeeeEEeeeeeeeeeeEEeeEE',
    'EeeeeeeeeeEEEEEeeeeeeeEE',
    'EeeEEEEeeeEEEEEeeeeEEEEE',
    'EeeEEEEeeeeeeeeeeeeEEEEE',
    'EeeeeeEEEEEEEEeeeeeeeeEE',
    'EEEEeeeeeeeeeeeeeeeeeeEE',
    'EEEEeeeeEEEEEEEEEEEeeeEE',
    'EeeeeeeeEEEeeeeeeeeeeeEE',
    'EeSeeeeeEEEeeeeeeeeeeeEE',
    'EeeeeEEEEEEeeeEEEEEeeeEE',
    'EEEEEEEEEEEeeeEEEEEeeeEE',
    'EEEEEEEEEEEEEEEEEEEeeeEE',
    'EEEEEEEEEEEEEEEEEEEeeEEE',
  ],
  warps: [
    { x: 19, y: 17, to: { map: 'route3', x: 5, y: 7, dir: 'down' } }, { x: 20, y: 17, to: { map: 'route3', x: 5, y: 7, dir: 'down' } },
    { x: 3, y: 1, to: { map: 'voltara', x: 30, y: 12, dir: 'down' } },
    { x: 2, y: 13, to: { map: 'hollowpeak_2', x: 2, y: 3, dir: 'down' } },
  ],
  items: [{ id: 'ep', x: 21, y: 2, item: 'super_potion' }, { id: 'dl', x: 1, y: 5, item: 'dusk_lantern', qty: 2 }, { id: 'hx', x: 12, y: 12, item: 'calm_incense', hidden: true }],
  npcs: [
    { id: 'dougal', x: 16, y: 8, dir: 'left', look: 'miner', trainer: 'dig1', sight: 4, name: 'Miner Dougal' },
    { id: 'hester', x: 5, y: 10, dir: 'right', look: 'miner', trainer: 'dig2', sight: 3, name: 'Miner Hester' },
  ],
};
DATA.maps.hollowpeak_2 = {
  name: 'Hollowpeak Depths', region: 'hollowpeak', music: 'cave', outdoor: false, dim: 0.7, caveEnc: true,
  rows: [
    'EEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEE',
    'ESeeeeEEEeeeeeeE',
    'EeeeeeeeeeeEEeeE',
    'EEEEeeeEEeeeeeeE',
    'EeeeeeeEEeeEEEeE',
    'EeEEEeeeeeeeeeeE',
    'EeeeeeEEEeeeEEeE',
    'EEEeeeeeeeeeEeeE',
    'EeeeeEEEEeeeeeeE',
    'EeeeeeeeeeeEEEeE',
    'EEEEEEEEEEEEEEEE',
  ],
  warps: [{ x: 1, y: 2, to: { map: 'hollowpeak', x: 3, y: 13, dir: 'right' } }],
  items: [{ id: 'sp', x: 14, y: 2, item: 'spark_prism' }, { id: 'ts', x: 1, y: 10, item: 'thunder_shard' }, { id: 'bl', x: 9, y: 6, item: 'bright_lantern', qty: 2, hidden: true }],
};

/* ---------- VOLTARA ---------- */
DATA.maps.voltara = {
  name: 'Voltara', region: 'voltara', music: 'voltara', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TT..............................TT',
    'TT..............................TT',
    'TT..............................TT',
    'TT..............................TT',
    'TT..............................TT',
    'TT..............................TT',
    'TT..__________________________..TT',
    'TT.._...........__..........._..TT',
    'TT.._...........__..........._..TT',
    'TT.._...........__..........._..TT',
    'TT.._...........__...........___TT',
    'TT.._...........__..........._..TT',
    'TT.._...........__..........._..TT',
    'TT.._...........__..........._..TT',
    'TT.._...........__..........._..TT',
    'TT.._...........__..........._..TT',
    'TT..__________________________..TT',
    'TT..............__..............TT',
    'TT..............__..............TT',
    'TT....ffffff....__..ffffff......TT',
    'TT....ffffff....__..ffffff......TT',
    'TT....ffffff....__..ffffff......TT',
    'TT..............__..............TT',
    'TT..............__..............TT',
    'TTTTTTTTTTTTTTTT__TTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTT__TTTTTTTTTTTTTTTT',
  ],
  connections: { south: { map: 'route4', dx: 0 } },
  buildings: [
    { kind: 'cavemouth', x: 30, y: 9, w: 2, h: 3, door: 0, to: { map: 'hollowpeak', x: 3, y: 2, dir: 'down' } },
    { kind: 'hearth', x: 6, y: 3, w: 6, h: 4, door: 3, to: { map: 'volt_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 13, y: 3, w: 5, h: 4, door: 2, to: { map: 'volt_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'hall', theme: 'spark', x: 20, y: 2, w: 8, h: 6, door: 3, to: { map: 'spark_hall', x: 7, y: 16, dir: 'up' } },
    { kind: 'plant', x: 6, y: 10, w: 9, h: 6, door: 4, to: { map: 'volt_plant', x: 9, y: 14, dir: 'up' } },
    { kind: 'house', x: 19, y: 10, w: 5, h: 4, door: 2, to: { map: 'volt_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'kit', x: 22, y: 14, w: 5, h: 4, door: 2, to: { map: 'volt_house2', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 18, y: 25, text: 'VOLTARA\nThe city of lights.' },
    { type: 'sign', x: 19, y: 7, text: 'SPARK HALL\nHall Master: Rhea\n"Every circuit has a weak point."' },
    { type: 'sign', x: 5, y: 16, text: 'VOLTARA POWER PLANT\nAuthorised staff only.' },
    { type: 'lamp', x: 13, y: 9 }, { type: 'lamp', x: 20, y: 17 }, { type: 'lamp', x: 3, y: 19 },
  ],
  items: [{ id: 'hp', x: 31, y: 24, item: 'hyper_potion', hidden: true }],
  npcs: [
    { id: 'g7', x: 10, y: 16, dir: 'down', look: 'grunt', name: 'Order Grunt', talk: ['The Works is closed. Morrow Lumen Industries is doing "maintenance". Get lost.'], cond: (g) => !g.flags.plant_open },
    { id: 'g8', x: 11, y: 16, dir: 'down', look: 'grunt2', name: 'Order Grunt', talk: ['You heard him. Scram!'], cond: (g) => !g.flags.plant_open },
    { id: 'wren', x: 13, y: 17, dir: 'left', look: 'wren', script: 'wrenPlant', cond: (g) => !!g.quests.act2 && !g.flags.plant_open },
    { id: 'chief', x: 7, y: 17, dir: 'right', look: 'engineer', script: 'chiefEng' },
    { id: 'vk1', x: 25, y: 20, dir: 'down', look: 'student2', move: 'wander', name: 'Boy', talk: ['The lights went out three days ago!', 'My Zappik has been my night light ever since.'] },
    { id: 'vk2', x: 9, y: 22, dir: 'right', look: 'villager2', move: 'wander', name: 'Woman', script: 'voltWoman' },
  ],
};
DATA.maps.volt_hearth = HEARTH('Voltara Hearthhouse', 'voltara', 'voltara', { map: 'voltara', x: 9, y: 7, dir: 'down' }, 'Hearthkeeper Joule',
  [{ id: 'vh1', x: 9, y: 5, dir: 'left', look: 'engineer', move: 'wander', name: 'Engineer', talk: ['Even the Hearthhouse is running on a backup generator.', 'Hearthhouses always get power first. Wildmon health comes before everything.'] }]);
DATA.maps.volt_mart = MART('Voltara Mart', 'voltara', { map: 'voltara', x: 15, y: 7, dir: 'down' }, 'voltara',
  [{ id: 'vm1', x: 7, y: 4, dir: 'up', look: 'lass', move: 'wander', name: 'Shopper', talk: ['Bright Lanterns are the best you can buy in a shop. Worth every Credit for a rare catch.'] }]);
DATA.maps.volt_house = HOUSE('Engineer\'s House', 'voltara', { map: 'voltara', x: 21, y: 14, dir: 'down' },
  [{ id: 'volt_gran', x: 7, y: 4, dir: 'left', look: 'old', script: 'voltGran' }], { '1,1': 'Circuit diagrams, pinned up like family photos.' });
DATA.maps.volt_house2 = HOUSE('Voltara House', 'voltara', { map: 'voltara', x: 24, y: 18, dir: 'down' },
  [{ id: 'vtrade', x: 2, y: 4, dir: 'right', look: 'student', script: 'fizzKid' }], { '1,1': 'A shelf of model aeroplanes.' });
DATA.maps.spark_hall = {
  name: 'Spark Hall', region: 'voltara', music: 'hall', outdoor: false, powerFlag: 'plant_fixed',
  rows: [
    'WWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWW',
    'WNNNNNNNNNNNNNW',
    'WNNNNNNNNNNNNNW',
    'WWWWWWWZWWWWWWW',
    'WNoNNNNNNNNNNNW',
    'WNNNNNNNNNNNNNW',
    'WWWWWWWzWWWWWWW',
    'WNNNNNNNNNNNNNW',
    'WNNNNNNNNNNNNNW',
    'W77777777777oNW',
    'WNNNNNNNNNNNNNW',
    'WWWZWWWWWWWzWWW',
    'WNNNNNNNNNNNNNW',
    'WNNNNNNNNNNNNNW',
    'WNNNNNNNNNNNNNW',
    'WNNNNNNNNNNNNNW',
    'WWWWWWWmWWWWWWW',
  ],
  warps: [{ x: 7, y: 17, to: { map: 'voltara', x: 23, y: 8, dir: 'down' } }],
  npcs: [
    { id: 'rhea', x: 7, y: 2, dir: 'down', look: 'rhea', script: 'rhea' },
    { id: 'watt', x: 12, y: 14, dir: 'left', look: 'engineer', trainer: 'eng1', sight: 4, name: 'Engineer Watt' },
    { id: 'volta', x: 11, y: 6, dir: 'left', look: 'engineer', trainer: 'eng2', sight: 3, name: 'Engineer Volta' },
    { id: 'guide', x: 9, y: 16, dir: 'left', look: 'clerk', script: 'hallGuide2' },
  ],
};
DATA.maps.volt_plant = {
  name: 'Voltara Dynamo Works', region: 'voltara', music: 'order', outdoor: false, caveEnc: true, battleBg: 'plant', dim: 0.35,
  rows: [
    'WWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWMMMMWWWWWWWW',
    'WNNNNNNNNNNNNNNNNNNW',
    'WNNNNNNNNNNNNNNNNNNW',
    'WWWWWWWWW1WWNWWWWWWW',
    'WNNNNNN771NNNNNMMNNW',
    'WNMMNNNNNN3NNNNNNNNW',
    'WNMMNNNNNN3NNNNNNNNW',
    'WNNNN5555NNNNN1NNNNW',
    'WNNNNNNNNNNNNN1NNMMW',
    'WMMNNNNNNNNNNN1NNMMW',
    'WNNNN7777777NNNNNNNW',
    'WNNNNNNNNNNNNNNNNNNW',
    'WNNMMNNNNNNNNNNMMNNW',
    'WNNNNNNNNNNNNNNNNNNW',
    'WWWWWWWWWmmWWWWWWWWW',
  ],
  warps: [{ x: 9, y: 15, to: { map: 'voltara', x: 10, y: 16, dir: 'down' } }, { x: 10, y: 15, to: { map: 'voltara', x: 10, y: 16, dir: 'down' } }],
  tileText: { '8,1': 'The plant\'s main core. Its gauges read zero.', '9,1': 'The plant\'s main core. A grey Siphon cable runs out of it.', '11,1': 'The plant\'s main core.' },
  items: [{ id: 'hp', x: 18, y: 2, item: 'hyper_potion' }, { id: 'bl', x: 1, y: 12, item: 'bright_lantern', qty: 2 }],
  triggers: [{ x: 1, y: 3, w: 18, h: 1, script: 'sableEvent', cond: (g) => !g.flags.beat_sable }],
  npcs: [
    { id: 'g9', x: 16, y: 12, dir: 'left', look: 'grunt', trainer: 'grunt9', sight: 5, name: 'Order Grunt' },
    { id: 'g10', x: 4, y: 6, dir: 'right', look: 'grunt2', trainer: 'grunt10', sight: 4, name: 'Order Grunt' },
    { id: 'sable', x: 10, y: 2, dir: 'down', look: 'sable', name: 'Admin Sable', talk: ['...'], cond: (g) => !g.flags.beat_sable },
  ],
};

/* ---------- ROUTE 4 (land + sea) ---------- */
DATA.maps.route4 = {
  name: 'Route 4', region: 'route4', music: 'route', outdoor: true, border: 'T', weather: ['clear', 'clear', 'clear', 'rain'],
  rows: [
    'TTTTTTTTTTTTTTTT__TTTTTTTTTT',
    'TT..............__........TT',
    'TT..............__........TT',
    'TT......,,,,,,..__........TT',
    'TT......,,,,,,..__........TT',
    'TT......,,,,,,..__..,,,,,.TT',
    'TT......,,,,,,..__..,,,,,.TT',
    'TT......,,,,,,..__..,,,,,.TT',
    'TT..............__..,,,,,.TT',
    'TT..............__........TT',
    'TT....____________........TT',
    'TT...._...................TT',
    'TT...._..,,,,,,,,....rrrr.TT',
    'TT,,,._..,,,,,,,,....rrrr.TT',
    'TT,,,._..,,,,,,,,....rrrr.TT',
    'TT,,,._..,,,,,,,,....rrrr.TT',
    'TT,,,._...................TT',
    'TT....______________......TT',
    'TT................._......TT',
    'TT................._......TT',
    'rrssssssssssssssssssssssssrr',
    'rrssssssssssssssssssssssssrr',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~rrr~~~~~~~~~~~~~',
    '~~~~~~~~~~~~rrr~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~rrr~~~~~',
    '~~~~~~~~~~~~~~~~~~~~rrr~~~~~',
    '~~~~rr~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~rr~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],
  connections: { north: { map: 'voltara', dx: 0 }, south: { map: 'cinderhollow', dx: 1, surf: true } },
  props: [{ type: 'sign', x: 18, y: 2, text: 'ROUTE 4\nNorth: Voltara   South: the sea, and Cinderhollow beyond.' }, { type: 'sign', x: 13, y: 19, text: 'NO FERRY SERVICE\nCinderhollow is reachable by boat or board only.' }],
  items: [{ id: 'hp', x: 24, y: 9, item: 'hyper_potion' }, { id: 'sl', x: 3, y: 18, item: 'swift_lantern', qty: 2 }, { id: 'tl', x: 25, y: 21, item: 'tide_lantern', qty: 2, hidden: true }],
  npcs: [
    { id: 'ryo', x: 10, y: 18, dir: 'right', look: 'blackbelt', trainer: 'kai4', sight: 4, name: 'Black Belt Ryo' },
    { id: 'marlo', x: 8, y: 26, dir: 'right', look: 'swimmer2', trainer: 'swim3', sight: 4, name: 'Swimmer Marlo', onWater: true },
    { id: 'nell', x: 18, y: 36, dir: 'left', look: 'swimmer', trainer: 'swim4', sight: 4, name: 'Swimmer Nell', onWater: true },
    { id: 'r4fish', x: 22, y: 21, dir: 'down', look: 'fisher', name: 'Fisherman', talk: ['The sea between here and Cinderhollow is warm from the volcano.', 'Mantaglide leap out of the waves round here. Beautiful things.'] },
  ],
};

/* ---------- CINDERHOLLOW ---------- */
DATA.maps.cinderhollow = {
  name: 'Cinderhollow', region: 'cinderhollow', music: 'cinder', outdoor: true, border: 'X',
  rows: [
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'ssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssss',
    'XXaaaaaaaaaaaa__aaaaaaaaaaaaXX',
    'XXaaaaaaaaaaaa__aaaaaaaaaaaaXX',
    'XXaaaaaaaaaaaa__aaaaaaaaaaaaXX',
    'XXaaaaaaaaaaaa__aaaaaaaaaaaaXX',
    'XXaaaaaaaaaaaa__aaaaaaaaaaaaXX',
    'XXaa______________________aaXX',
    'XXaa_aaaaaaaaa__aaaaaaaaa_aaXX',
    'XXaa_aaaaaaaaa__aaaaaaaaa_..XX',
    'XXaa_aaaaaaaaa__aaaaaaaaa_..XX',
    'XXaa_aaaaaaaaa__aaaaaaaaa_..XX',
    'XXaa_aaaaaaaaa__aaaaaaaaa_..XX',
    'XXaa_aaaaaaaaa__aaaaaaaaa_aaXX',
    'XXaa_aaaaaaaaa__aaaaaaaaa_aaXX',
    'XXaa______________________aaXX',
    'XXaaaaaaaaaaaa__aaaaaaaaaaaaXX',
    'XXllllaaaaaaaa__aaaaaalllllaXX',
    'XXllllaaaaaaaa__aaaaaalllllaXX',
    'XXllllaaaaaaaaaaaaaaaaaaaaaaXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  ],
  connections: { north: { map: 'route4', dx: -1, surf: true } },
  buildings: [
    { kind: 'hearth', x: 5, y: 9, w: 6, h: 4, door: 3, to: { map: 'cinder_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 17, y: 9, w: 5, h: 4, door: 2, to: { map: 'cinder_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'hall', theme: 'forge', x: 6, y: 15, w: 8, h: 6, door: 3, to: { map: 'forge_hall', x: 7, y: 14, dir: 'up' } },
    { kind: 'house', x: 17, y: 15, w: 5, h: 4, door: 2, to: { map: 'cinder_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'cavemouth', volcanic: true, x: 26, y: 15, w: 2, h: 3, door: 0, to: { map: 'emberforge', x: 7, y: 16, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 16, y: 8, text: 'CINDERHOLLOW\nHot springs, hot forges, hot tempers.' },
    { type: 'sign', x: 14, y: 20, text: 'FORGE HALL\nHall Master: Brann\n"Strong steel is made in the fire."' },
    { type: 'sign', x: 27, y: 19, text: 'EMBERFORGE VOLCANO\nForge Badge holders only.' },
  ],
  items: [{ id: 'eg', x: 3, y: 9, item: 'ember_glass' }, { id: 'hp', x: 27, y: 25, item: 'hyper_potion', hidden: true }],
  triggers: [{ x: 2, y: 7, w: 26, h: 1, script: 'kit3', cond: (g) => !g.flags.beat_kit3 }],
  npcs: [
    { id: 'kit', x: 15, y: 9, dir: 'up', look: 'kit', script: 'kit3', cond: (g) => !g.flags.beat_kit3 },
    { id: 'eguard', x: 26, y: 18, dir: 'left', look: 'smith', name: 'Lookout', cond: (g) => !g.flags.beat_brann, talk: ['The volcano trail is only for Forge Badge holders. It gets very hot up there.', 'Win the Badge from Brann and I will let you through.'] },
    { id: 'c1', x: 21, y: 22, dir: 'left', look: 'old', move: 'turn', name: 'Old Smith', talk: ['My grandfather swore he saw a great bird of white fire above Emberforge once.', 'Just the steam playing tricks, I expect. Still... the forges burn brighter some mornings.'] },
    { id: 'c2', x: 10, y: 22, dir: 'down', look: 'villager', move: 'wander', name: 'Bather', talk: ['Ahh, the hot springs. Nothing better after a long swim.', 'Did you come over on a board? Brave!'] },
  ],
};
DATA.maps.cinder_hearth = HEARTH('Cinderhollow Hearthhouse', 'cinderhollow', 'cinderhollow', { map: 'cinderhollow', x: 8, y: 13, dir: 'down' }, 'Hearthkeeper Ember',
  [{ id: 'ch1', x: 9, y: 5, dir: 'left', look: 'swimmer', move: 'wander', name: 'Swimmer', talk: ['I swam all the way from Route 4! Never again.'] }]);
DATA.maps.cinder_mart = MART('Cinderhollow Mart', 'cinderhollow', { map: 'cinderhollow', x: 19, y: 13, dir: 'down' }, 'cinderhollow');
DATA.maps.cinder_house = HOUSE('Smith\'s Cottage', 'cinderhollow', { map: 'cinderhollow', x: 19, y: 19, dir: 'down' },
  [{ id: 'csmith', x: 7, y: 4, dir: 'left', look: 'smith', script: 'cinderSmith' }], { '1,1': 'Hammers of every size hang on the wall.' });
DATA.maps.forge_hall = {
  name: 'Forge Hall', region: 'cinderhollow', music: 'hall', outdoor: false,
  rows: [
    'XXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XllllllillllllX',
    'XllllllillllllX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XeeeeeeeeeeeeeX',
    'XXXXXXXmXXXXXXX',
  ],
  warps: [{ x: 7, y: 15, to: { map: 'cinderhollow', x: 9, y: 21, dir: 'down' } }],
  props: [
    { type: 'boulder', id: 'b1', x: 7, y: 9 }, { type: 'boulder', id: 'b2', x: 4, y: 11 }, { type: 'boulder', id: 'b3', x: 10, y: 8 },
  ],
  npcs: [
    { id: 'brann', x: 7, y: 2, dir: 'down', look: 'brann', script: 'brann' },
    { id: 'anvil', x: 2, y: 7, dir: 'right', look: 'smith', trainer: 'smith1', sight: 3, name: 'Smith Anvil' },
    { id: 'bellows', x: 12, y: 12, dir: 'left', look: 'smith', trainer: 'smith2', sight: 3, name: 'Smith Bellows' },
    { id: 'guide', x: 10, y: 14, dir: 'left', look: 'clerk', script: 'forgeGuide' },
  ],
};
DATA.maps.emberforge = {
  name: 'Emberforge Volcano', region: 'emberforge', music: 'cave', outdoor: false, caveEnc: true, battleBg: 'volcano', dim: 0.3,
  rows: [
    'XXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXX',
    'XXXXeeeeeeeeXXXX',
    'XXXeeeeeeeeeeXXX',
    'XXXeeelllleeeXXX',
    'XXeeeellleeeeeXX',
    'XXeeeeeeeeeeeeXX',
    'XlleeeeeXXXeeeXX',
    'XlleeeeXXXXXeeeX',
    'XeeeeXXXXlllXeeX',
    'XeeeXXXllllleeeX',
    'XeeeeeeeeeeeeeeX',
    'XXeeelllleeeeXXX',
    'XXeeeeeeeeeeeXXX',
    'XXXlleeeeeellXXX',
    'XXXlleeeeeellXXX',
    'XXXXXXeeeeXXXXXX',
    'XXXXXXXeeXXXXXXX',
  ],
  warps: [{ x: 7, y: 17, to: { map: 'cinderhollow', x: 26, y: 18, dir: 'down' } }, { x: 8, y: 17, to: { map: 'cinderhollow', x: 26, y: 18, dir: 'down' } }],
  props: [{ type: 'wildmon', sp: 'solvane', x: 7, y: 2, script: 'solvaneSight', cond: (g) => !g.flags.solvane_seen }],
  items: [{ id: 'eg', x: 12, y: 6, item: 'ember_glass' }, { id: 'sun', x: 2, y: 9, item: 'sun_shard' }, { id: 'hp', x: 13, y: 13, item: 'hyper_potion', hidden: true }],
};

/* ---------- Map enter hooks ---------- */
Object.assign(DATA.mapEnter, {
  async port_calder(s) { if (s.quest('act1') && s.quest('act1').done && !s.quest('act2')) { await s.startQuest('act2'); G.tracked = 'act2'; } },
  async route3(s) { if (s.quest('act1') && s.quest('act1').done && !s.quest('act2')) { await s.startQuest('act2'); G.tracked = 'act2'; } },
  async voltara(s) {
    if (a2() === 0) await s.setStage('act2', 1);
    if (s.flag('beat_rhea') && !s.flag('got_board')) Script.run((ss) => DATA.scripts.wrenBoard(ss));
  },
  async cinderhollow(s) { if (a2() === 5) await s.setStage('act2', 6); },
});

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async chiefEng(s) {
    const o = { name: 'Chief Engineer Ohm' };
    if (s.flag('plant_fixed')) return s.say(['The power is back! The Siphon cable is gone and the core is humming again.', 'Voltara owes you one, kid. And that Ranger friend of yours.'], o);
    await s.say(['Three days ago Morrow Lumen Industries turned up with a contract, a lot of grey coats and a very big cable.', 'Next thing we know, the plant is locked, the power is out and they are draining the core into Lanterns!',
      'My crew cannot get past those guards. If only somebody could...'], o);
    if (a2() === 1) await s.setStage('act2', 2);
  },
  async wrenPlant(s) {
    const o = { name: 'Wren' };
    if (a2() === 1) await s.setStage('act2', 2);
    await s.say(['{player}! I followed the Order all the way from Port Calder. They are draining the Works\' core with a giant Siphon.',
      'Two guards on the door. Two of us. Want to team up?'], o);
    const yes = await s.ask('Team up with Wren for a double battle?', ['Let\'s go!', 'Not yet']);
    if (yes !== 0) return s.say('Okay. Heal up first if you need to. I will be right here.', o);
    await s.say(['Hey! Grey coats! You are coming with us... or rather, we are going in!'], o);
    await s.say(['Two kids? Fine. Two against two!'], { name: 'Order Grunt' });
    const res = await s.double({ foes: ['grunt7', 'grunt8'], ally: 'wren', music: 'order' });
    if (res !== 'win') return;
    await s.say(['Ugh! Fall back! Tell Sable!'], { name: 'Order Grunt' });
    await Game.fadeOut(250); s.remove('g7'); s.remove('g8'); s.set('plant_open'); await Game.fadeIn(250);
    await s.say(['We did it! Nice teamwork. Here, let me patch your team up first.'], o);
    await Game.fadeOut(250); await s.healParty(); await s.wait(300); await Game.fadeIn(250);
    await s.say(['I will stay out here and keep the Chief Engineer\'s crew safe. You go in and find whoever is in charge!'], o);
    s.remove('wren');
    await s.setStage('act2', 3); Game.achieve('double_win');
  },
  async sableEvent(s) {
    const o = { name: 'Admin Sable' };
    s.player().walking = false;
    await s.emote('sable', '!');
    await s.say(['So you are the child who embarrassed Captain Rook. I am Sable, an Admin of the Hollow Order.',
      'Do you know what this is? A Siphon. It pulls the light out of anything: a power core, a Lantern, a Wildmon.',
      'Morrow says that light is wasted on Lanterns and pets. We put it to better use.', 'I would like to see how much light your team has.'], o);
    const res = await bossBattle(s, 'sable');
    if (res !== 'win') return;
    await s.say(['Interesting. Very interesting. Your Wildmon fight as though they trust you.', 'No matter. The core is already drained. The Siphon has what we need.',
      'We will meet again in Glasswater City, I think. Goodbye.'], o);
    Sound.sfx('flee'); await Game.fadeOut(250); s.remove('sable'); s.set('plant_fixed'); await Game.fadeIn(250);
    Sound.sfx('heal'); await s.say(['With the Siphon gone, the core flickers... and roars back to life!', 'Lights flicker on all through the Works.']);
    await s.setStage('act2', 4); s.achieve('order_foiled');
  },
  async hallGuide2(s) {
    const o = { name: 'Hall Guide' };
    const spark = World.id === 'spark_hall';
    if (spark && !s.flag('plant_fixed')) return s.say(['Sorry, challenger! With the power out, every laser fence in the Hall is stuck on.', 'Until the Dynamo Works is fixed, nobody can reach Rhea.'], o);
    if (spark && !s.flag('beat_rhea')) return s.say(['Welcome to the Spark Hall! Red switches flip the laser fences. Conveyor belts carry you along.', 'Rhea uses Electric types. Earth moves will ground them, but watch out for her flying ones!'], o);
    return s.say(['What a battle! You are a credit to the Hall.'], o);
  },
  async rhea(s) {
    const o = { name: 'Rhea' };
    if (s.flag('beat_rhea')) return s.say(['Arc Bolt hits hard and can paralyse. Perfect for a fast team.', 'Go and find Wren. She was looking for you.'], o);
    if (!s.flag('plant_fixed')) return s.say(['How did you get up here in the dark? Never mind. Come back when the power is on and we will battle properly!'], o);
    await s.say(['You fixed my city\'s power AND solved my Hall? I like you already.', 'I am Rhea, Hall Master of the Spark Hall. Every circuit has a weak point.', 'Let\'s find yours!'], o);
    const res = await bossBattle(s, 'rhea');
    if (res !== 'win') return;
    s.achieve('puzzler');
    await s.say(['Ha! What a jolt! You found my weak point, all right.'], o);
    await s.badge('spark');
    await s.say(['And this Move Scroll: Arc Bolt. A physical Electric move. Charge right in!'], o);
    await s.give('scroll_arcbolt');
  },
  async wrenBoard(s) {
    const o = { name: 'Wren' };
    if (s.flag('got_board')) return;
    s.set('got_board');
    const w = s.spawn({ id: 'wren_b', x: 24, y: 9, dir: 'left', look: 'wren', name: 'Wren' });
    await s.emote('wren_b', '!');
    await s.say(['{player}! You got the Spark Badge? Amazing!', 'The Order\'s ship was spotted near Cinderhollow, the volcano island south of here.',
      'There is no ferry, so I brought this from the Ranger station. A Tide Board!'], o);
    await s.give('tide_board');
    await s.say(['Face open water and press A to paddle out. Step back onto land to get off.', 'Head down Route 4 to the sea, then paddle south. I will catch up with you!'], o);
    s.remove(w.id);
    await s.setStage('act2', 5);
  },
  async voltWoman(s) {
    const o = { name: 'Woman' };
    if (s.flag('plant_fixed')) return s.say(['The power is back! Voltara is the city of lights again!'], o);
    return s.say(['No power, no lights, no hot water...', 'Morrow Lumen Industries said they would fix the Works. Instead they locked everyone out.'], o);
  },
  async voltGran(s) {
    const o = { name: 'Granny Ampere' };
    if (!s.flag('volt_gift')) { s.set('volt_gift'); await s.say(['Forty years I worked at that plant. Forty! And they lock it in three days.', 'Here, take these. Patience Lanterns. Like me, they get better with time.'], o); return s.give('patience_lantern', 3); }
    return s.say(['The plant was built on the old Beacon tower\'s foundations. Same as the Hall. Funny, the things people forget.'], o);
  },
  async fizzKid(s) {
    const o = { name: 'Lennie' };
    if (s.flag('fizz_done')) return s.say(['Thanks again! My Fizzbat poster is up on the wall.'], o);
    if (G.party.some((m) => m.sp === 'thunderwing')) {
      s.set('fizz_done'); await s.say(['A real Fulgurbat!? That is the coolest thing I have ever seen!', 'Here, take my Spark Prism. I found it in the cave. You deserve it.'], o);
      return s.give('spark_prism');
    }
    return s.say(['Fizzbat turn into Fulgurbat when they get strong. I have only ever seen pictures.', 'If you ever have one, come and show me!'], o);
  },
  async kit3(s) {
    const o = { name: 'Kit' };
    if (s.flag('beat_kit3')) return;
    s.player().walking = false;
    await s.emote('kit', '!');
    await s.say(['{player}! You paddled here on a BOARD? I came on a fishing boat like a normal person.', 'I have two Badges and a brand new trick. Ever had a double battle?', 'Two of mine against two of yours. Let\'s go!'], o);
    const res = await s.double({ foes: ['kit3'], noWhiteout: true, bg: 'grass' });
    s.set('beat_kit3');
    if (res === 'win') await s.say(['Two at once and you STILL won?! How?!', 'Fine. I am going to beat Brann first, then you. See ya!'], o);
    else await s.say(['Double the Wildmon, double the win! Ha!', 'Better practise, {player}. See you at the Forge Hall!'], o);
    await Game.fadeOut(200); s.remove('kit'); await Game.fadeIn(200);
  },
  async forgeGuide(s) {
    const o = { name: 'Hall Guide' };
    if (!s.flag('beat_brann')) {
      await s.say(['Welcome to the Forge Hall! Push boulders into the lava pits to build your way across.', 'Pushed one into a corner? I can put them all back where they started.'], o);
      const c = await s.ask('Reset the boulders?', ['Yes', 'No'], o);
      if (c === 0) { delete G.flags['bould_forge_hall']; delete G.flags['pits_forge_hall']; await Game.fadeOut(200); World.load('forge_hall'); await Game.fadeIn(200); await s.say('The boulders were reset!', o); }
      return;
    }
    return s.say(['What a battle! You are a credit to the Hall.'], o);
  },
  async brann(s) {
    const o = { name: 'Brann' };
    if (s.flag('beat_brann')) return s.say(['Those Power Gloves will move any boulder in Aldermere. Use them well.', 'And go and see the volcano. Something up there has been restless lately.'], o);
    await s.say(['You built a bridge over my lava. Good. That takes strength AND thought.', 'I am Brann, Hall Master of the Forge Hall. Steel is made in the fire.', 'Let\'s see what your team is made of!'], o);
    const res = await bossBattle(s, 'brann');
    if (res !== 'win') return;
    s.achieve('puzzler');
    await s.say(['Hah! Forged in fire, that team of yours.'], o);
    await s.badge('forge');
    await s.say(['Take these Power Gloves too. With them you can push big boulders wherever you find them.'], o);
    await s.give('power_gloves');
    await s.say(['And a Move Scroll: Magma Slam. It hits like a falling forge hammer.'], o);
    await s.give('scroll_magma');
    if (!s.quest('act2').done) {
      await s.completeQuest('act2');
      await s.give('hyper_potion', 3); await s.give('bright_lantern', 5);
      await s.say(['Act II of your journey is complete!', 'The Hollow Order\'s ship was last seen heading for Glasswater City. Route 5, north of Voltara, is open.'], { sign: true });
    }
  },
  async cinderSmith(s) {
    const o = { name: 'Master Smith Hilde' };
    if (!s.flag('smith_gift')) { s.set('smith_gift'); await s.say(['A trainer from the mainland! Here, I made too many of these.', 'Heal Lanterns. Gentle on whatever you catch.'], o); return s.give('heal_lantern', 5); }
    return s.say(['Brann was my apprentice once. Now he runs the Hall and I make Lanterns. Funny old world.'], o);
  },
  async solvaneSight(s, pr) {
    await s.say(['A great bird made of white fire is perched on the crater\'s edge!']);
    Sound.sfx('lustre'); await s.wait(400);
    await s.say('SOLVAAAANE!', { name: 'Solvane' });
    const d = G.dex.solvane || (G.dex.solvane = {}); d.seen = 1;
    await s.say(['It spreads its wings... and with a blast of heat it soars out through the crater and away to the west.', 'The sun Warden, Solvane! Some day you may meet it again...']);
    Sound.sfx('flee'); World.props = World.props.filter((p) => p !== pr); s.set('solvane_seen'); s.achieve('legend_sight');
  },
});
DATA.achievements.legend_sight = { name: 'Living Legend', desc: 'See a legendary Wildmon with your own eyes.' };

/* ---------- Coral starts Act II once Act I is done ---------- */
{
  const coral0 = DATA.scripts.coral;
  DATA.scripts.coral = async function (s, npc) {
    await coral0(s, npc);
    if (s.quest('act1') && s.quest('act1').done && !s.quest('act2')) {
      await s.say(['Oh, one more thing. My patrol spotted the Order\'s ship sailing west, towards the mountains.', 'Route 3 has just reopened. It runs west of town, through Hollowpeak Cave to Voltara.'], { name: 'Coral' });
      await s.startQuest('act2'); G.tracked = 'act2';
    }
  };
}
