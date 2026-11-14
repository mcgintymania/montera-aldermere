'use strict';
/* =====================================================================
   ACT III MAPS + STORY — Route 5 → Glasswater City → Morrow Lumen Tower
   → Sound ferry → Saltmere → Route 7 → Ashgrave (Veil Hall)
   Plus the Lantern Warehouse in Port Calder.
   ===================================================================== */
const a3 = () => (G.quests.act3 ? (G.quests.act3.done ? 99 : G.quests.act3.stage) : -1);

/* ---------- Voltara: open the north road ---------- */
for (const y of [0, 1]) { const r = DATA.maps.voltara.rows[y]; DATA.maps.voltara.rows[y] = r.slice(0, 4) + '_' + r.slice(5); }
DATA.maps.voltara.connections.north = { map: 'route5', dx: 0 };
DATA.maps.voltara.npcs.push({ id: 'r5gate', x: 4, y: 2, dir: 'down', look: 'engineer', name: 'Lineman', cond: (g) => !(g.quests.act2 && g.quests.act2.done),
  talk: ['Route 5 is closed while we restring the power lines to Glasswater City.', 'Should be done by the time you have four Badges!'] });
DATA.maps.voltara.props.push({ type: 'sign', x: 5, y: 3, text: 'ROUTE 5\nNorth to Glasswater City.' });

/* ---------- Lantern Warehouse (Port Calder) ---------- */
DATA.maps.port_calder.buildings.push({ kind: 'warehouse', x: 28, y: 9, w: 4, h: 4, door: 1, to: { map: 'lantern_warehouse', x: 5, y: 7, dir: 'up' } });
DATA.maps.port_calder.props.push({ type: 'sign', x: 27, y: 14, text: 'LANTERN WAREHOUSE\nStorage for every Hearthhouse in Aldermere.' });
DATA.maps.lantern_warehouse = {
  name: 'Lantern Warehouse', region: 'port_calder', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWWWW',
    'WttttWWttttW',
    'FFFFFFFFFFFF',
    'FttFFttFFttF',
    'FFFFFFFFFFFF',
    'FttFFttFFttF',
    'FFFFFFFFFFFF',
    'FFFFFFFFFFFF',
    'FFFFFmmFFFFF',
  ],
  warps: [{ x: 5, y: 8, to: { map: 'port_calder', x: 29, y: 13, dir: 'down' } }, { x: 6, y: 8, to: { map: 'port_calder', x: 29, y: 13, dir: 'down' } }],
  npcs: [
    { id: 'lumley', x: 5, y: 2, dir: 'down', look: 'clerk', script: 'warehouseKeeper' },
    { id: 'porter', x: 9, y: 6, dir: 'left', look: 'hiker', move: 'wander', name: 'Porter', talk: ['Every Lantern you put on a Hearthhouse shelf comes here by courier. Hundreds a day!', 'Upgrades give you more racks. Biggest one is the Bunker under the docks.'] },
  ],
};

/* ---------- ROUTE 5 ---------- */
DATA.maps.route5 = {
  name: 'Route 5', region: 'route5', music: 'route', outdoor: true, border: 'T', rows: ROWS3.route5,
  connections: { south: { map: 'voltara', dx: 0 }, north: { map: 'glasswater', dx: 0 } },
  props: [{ type: 'sign', x: 5, y: 35, text: 'ROUTE 5\nNorth: Glasswater City   South: Voltara' }, { type: 'sign', x: 14, y: 2, text: 'GLASSWATER CITY\nJust ahead!' }],
  items: [{ id: 'hp', x: 22, y: 9, item: 'hyper_potion' }, { id: 'fh', x: 2, y: 22, item: 'full_heal', qty: 2 }, { id: 'rc', x: 22, y: 36, item: 'rare_candy', hidden: true }],
  npcs: [
    { id: 'alfred', x: 9, y: 30, dir: 'down', look: 'gentleman', trainer: 'r5a', sight: 1, name: 'Gentleman Alfred' },
    { id: 'lune', x: 14, y: 24, dir: 'left', look: 'medium', trainer: 'r5b', sight: 1, name: 'Psychic Lune' },
    { id: 'bryn', x: 7, y: 15, dir: 'left', look: 'hiker', trainer: 'r5c', sight: 1, name: 'Hiker Bryn' },
  ],
};

/* ---------- GLASSWATER CITY ---------- */
DATA.maps.glasswater = {
  name: 'Glasswater City', region: 'glasswater', music: 'glasswater', outdoor: true, border: 'T', rows: ROWS3.glasswater,
  connections: { south: { map: 'route5', dx: 0 } },
  buildings: [
    { kind: 'tower', x: 16, y: 2, w: 6, h: 8, door: 3, to: { map: 'ml_tower_1', x: 9, y: 10, dir: 'up' } },
    { kind: 'hearth', x: 4, y: 5, w: 6, h: 4, door: 3, to: { map: 'glass_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 23, y: 4, w: 6, h: 5, door: 3, to: { map: 'glass_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', x: 4, y: 12, w: 5, h: 4, door: 2, to: { map: 'glass_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'kit', x: 16, y: 21, w: 5, h: 4, door: 2, to: { map: 'glass_house2', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 14, y: 27, text: 'GLASSWATER CITY\nThe jewel of the Sound.' },
    { type: 'sign', x: 15, y: 9, text: 'MORROW LUMEN INDUSTRIES\n"Clean light for a brighter Aldermere."' },
    { type: 'sign', x: 29, y: 13, text: 'SOUND FERRY\nGlasswater · Saltmere · Port Calder' },
    { type: 'lamp', x: 11, y: 11 }, { type: 'lamp', x: 27, y: 19 }, { type: 'lamp', x: 15, y: 19 }, { type: 'lamp', x: 3, y: 19 },
  ],
  items: [{ id: 'mp', x: 2, y: 27, item: 'max_potion', hidden: true }],
  npcs: [
    { id: 'ferry', x: 35, y: 17, dir: 'up', look: 'sailor', script: 'ferryGlass' },
    { id: 'kit', x: 20, y: 18, dir: 'left', look: 'kit', trainer: 'kit4', sight: 4, name: 'Kit', cond: (g) => !!g.flags.beat_morrow && !g.flags.beat_kit4 },
    { id: 'gw1', x: 8, y: 18, dir: 'down', look: 'gentleman', move: 'wander', name: 'Gentleman', script: 'gwGent' },
    { id: 'gw2', x: 24, y: 12, dir: 'down', look: 'lass', move: 'wander', name: 'Shopper', talk: ['The Glasswater Mart has every kind of Lantern there is. I could spend all day in there!'] },
    { id: 'gw3', x: 32, y: 24, dir: 'right', look: 'fisher', name: 'Fisherman', talk: ['Lampreel come up under the pier at night. Their lures look like little lanterns.'] },
    { id: 'tguard', x: 17, y: 10, dir: 'down', look: 'grunt', name: 'Security', cond: (g) => !g.flags.beat_morrow, talk: ['Morrow Lumen Industries welcomes visitors to the lobby.', 'The upper floors are staff only. Not that you could get up there anyway.'] },
  ],
};
DATA.maps.glass_hearth = HEARTH('Glasswater Hearthhouse', 'glasswater', 'glasswater', { map: 'glasswater', x: 7, y: 9, dir: 'down' }, 'Nurse Opal',
  [{ id: 'gh1', x: 9, y: 5, dir: 'left', look: 'scientist', move: 'wander', name: 'Researcher', script: 'gwScientist' }]);
DATA.maps.glass_mart = MART('Glasswater Mart', 'glasswater', { map: 'glasswater', x: 26, y: 9, dir: 'down' }, 'glasswater',
  [{ id: 'gm1', x: 7, y: 4, dir: 'up', look: 'gentleman', move: 'wander', name: 'Collector', talk: ['A Kin Lantern for duplicates, a Dusk Lantern for night, a Swift Lantern to open with...', 'Choosing the right Lantern is half the fun of catching!'] }]);
DATA.maps.glass_house = HOUSE('Glasswater House', 'glasswater', { map: 'glasswater', x: 6, y: 16, dir: 'down' },
  [{ id: 'candy', x: 7, y: 4, dir: 'left', look: 'old', script: 'candyGran' }], { '1,1': 'Recipe books, most of them about sweets.' });
DATA.maps.glass_house2 = HOUSE('Glasswater Flat', 'glasswater', { map: 'glasswater', x: 18, y: 25, dir: 'down' },
  [{ id: 'exworker', x: 2, y: 4, dir: 'right', look: 'scientist', script: 'exWorker' }], { '1,1': 'A Morrow Lumen staff handbook, torn in half.' });

/* ---------- MORROW LUMEN TOWER ---------- */
const PADW = (x, y, to) => ({ x, y, to });
DATA.maps.ml_tower_1 = {
  name: 'Morrow Lumen Tower', region: 'glasswater', music: 'tower', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWWWWWWW',
    'WIIIIIIIIIIIIIIIIIIW',
    'WKKKKKKKKKKKKKKKK9KW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKCCCCCKKKKKKKKKKKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKpKKKKKKKKKKKKKKpKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKpKKKKKKKKKKKKKKpKW',
    'WKKKKKKKKmmKKKKKKKKW',
  ],
  warps: [
    { x: 9, y: 11, to: { map: 'glasswater', x: 19, y: 10, dir: 'down' } }, { x: 10, y: 11, to: { map: 'glasswater', x: 19, y: 10, dir: 'down' } },
    PADW(17, 2, { map: 'ml_tower_2', x: 2, y: 11, dir: 'up' }),
  ],
  npcs: [
    { id: 'recep', x: 3, y: 3, dir: 'down', look: 'clerk', script: 'mlReception' },
    { id: 'tg1', x: 14, y: 5, dir: 'left', look: 'grunt', trainer: 'tg1', sight: 4, name: 'Order Grunt' },
  ],
};
DATA.maps.ml_tower_2 = {
  name: 'Morrow Lumen Tower 2F', region: 'glasswater', music: 'tower', outdoor: false, caveEnc: false,
  rows: [
    'WWWWWWWWWWWWWWWWWWWW',
    'WIIIIIIIIWIIIIIIIIIW',
    'WKKKKKKKKWKKKKKKK9KW',
    'WKKKKKKKKWKKKKKKKKKW',
    'WKKKKK9KKWKKKKKKKKKW',
    'WKKKKKKKKWK9KKKKKKKW',
    'WKKKKKKKKWKKKKKKKKKW',
    'WKKKKKKKKWWWWWWWWWWW',
    'WKKKKKKKKWK9KKKKKKKW',
    'WKKKKKKKKWKKKKKKKKKW',
    'WKKKKKKKKWKKKKKKKKKW',
    'WKKKKKKKKWKKKKKKK9KW',
    'W9KKKKKKKWKKKKKKKKKW',
    'WWWWWWWWWWWWWWWWWWWW',
  ],
  warps: [
    PADW(6, 4, { map: 'ml_tower_2', x: 13, y: 10, dir: 'down' }),
    PADW(11, 8, { map: 'ml_tower_2', x: 3, y: 9, dir: 'down' }),
    PADW(17, 11, { map: 'ml_tower_2', x: 12, y: 3, dir: 'down' }),
    PADW(11, 5, { map: 'ml_tower_2', x: 3, y: 3, dir: 'down' }),
    PADW(17, 2, { map: 'ml_tower_3', x: 2, y: 11, dir: 'up' }),
    PADW(1, 12, { map: 'ml_tower_1', x: 16, y: 3, dir: 'down' }),
  ],
  items: [{ id: 'mp', x: 18, y: 9, item: 'max_potion' }, { id: 'rc', x: 1, y: 2, item: 'rare_candy' }],
  npcs: [
    { id: 'tg2', x: 15, y: 4, dir: 'left', look: 'scientist', trainer: 'tg2', sight: 3, name: 'Scientist' },
    { id: 'tg3', x: 14, y: 9, dir: 'down', look: 'grunt2', trainer: 'tg3', sight: 2, name: 'Order Grunt' },
  ],
};
DATA.maps.ml_tower_3 = {
  name: 'Morrow Lumen Tower 3F', region: 'glasswater', music: 'tower', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWWWWWWW',
    'WIIIIIIIIIIIIIIIIIIW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKKMMKKKKKKKKKKKKKKW',
    'WKKMMKKKKKKKKKKMMKKW',
    'WKKKKKKKKKKKKKKMMKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKKKKKMMMMMMKKKKKKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKKMMKKKKKKKKKKMMKKW',
    'WKKMMKKKKKKKKKKMMKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'W9KKKKKKKKKKKKKKKKKW',
    'WWWWWWWWWWWWWWWWWWWW',
  ],
  warps: [PADW(1, 12, { map: 'ml_tower_2', x: 16, y: 3, dir: 'down' })],
  props: [{ type: 'lift', x: 18, y: 2, script: 'towerLift' }],
  tileText: { '6,7': 'A Siphon prototype. The label reads PROJECT ECLIPSE.', '8,7': 'Charts of stolen power, sorted by town. Voltara is crossed out.' },
  triggers: [{ x: 13, y: 2, w: 4, h: 4, script: 'corvinEvent', cond: (g) => !g.flags.beat_corvin }],
  npcs: [
    { id: 'tg4', x: 9, y: 9, dir: 'down', look: 'scientist', trainer: 'tg4', sight: 3, name: 'Scientist' },
    { id: 'corvin', x: 17, y: 3, dir: 'left', look: 'corvin', name: 'Admin Corvin', talk: ['...'], cond: (g) => !g.flags.beat_corvin },
  ],
};
DATA.maps.ml_tower_4 = {
  name: 'Director\'s Office', region: 'glasswater', music: 'tower', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWWW',
    'WIIIIIIIIIIIIIIW',
    'WKKKKKKKKKKKKKKW',
    'WKKKKKLLLKKKKKKW',
    'WKKKKKKKKKKKKKKW',
    'WRRRRRRRRRRRRRRW',
    'WKKKKKKKKKKKKKKW',
    'WpKKKKKKKKKKKKpW',
    'WKKKKKKKKKKKKKKW',
    'WWWWWWWWWWWWWWWW',
  ],
  props: [{ type: 'lift', x: 7, y: 8, script: 'towerLiftDown' }],
  tileText: { '6,3': 'Morrow\'s desk. A photo of a man with a Wildmon, the Wildmon\'s face scratched out.', '7,3': 'A model of a great spire rising out of the sea.', '8,3': 'Papers stamped PROJECT ECLIPSE. Most of the pages are blank.' },
  triggers: [{ x: 1, y: 5, w: 14, h: 1, script: 'morrowEvent', cond: (g) => !g.flags.beat_morrow }],
  npcs: [{ id: 'morrow', x: 7, y: 2, dir: 'down', look: 'morrow', name: 'Morrow', talk: ['...'], cond: (g) => !g.flags.beat_morrow }],
};

/* ---------- SALTMERE ---------- */
DATA.maps.saltmere = {
  name: 'Saltmere', region: 'saltmere', music: 'marsh', outdoor: true, border: 'T', rows: ROWS3.saltmere,
  connections: { north: { map: 'route7', dx: 0 } },
  buildings: [
    { kind: 'hearth', x: 4, y: 10, w: 6, h: 4, door: 3, to: { map: 'salt_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'house', x: 10, y: 10, w: 4, h: 4, door: 1, to: { map: 'salt_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'mart', x: 16, y: 10, w: 5, h: 4, door: 2, to: { map: 'salt_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'home', x: 21, y: 10, w: 4, h: 4, door: 1, to: { map: 'salt_house2', x: 4, y: 6, dir: 'up' } },
  ],
  props: [{ type: 'sign', x: 13, y: 15, text: 'SALTMERE\nThe town on stilts.' }, { type: 'sign', x: 16, y: 15, text: 'ROUTE 7\nNorth to Ashgrave.' }],
  items: [{ id: 'tl', x: 3, y: 20, item: 'tide_lantern', qty: 3 }, { id: 'rc', x: 26, y: 15, item: 'rare_candy', hidden: true }],
  npcs: [
    { id: 'sferry', x: 23, y: 24, dir: 'up', look: 'sailor', script: 'ferrySalt' },
    { id: 'sm1', x: 8, y: 15, dir: 'down', look: 'fisher', move: 'wander', name: 'Fisher', talk: ['A grey-sailed boat tied up here at dawn. A tall silver-haired man stepped off and walked north.', 'Towards Ashgrave, I reckon. Funny place to go.'] },
    { id: 'sm2', x: 20, y: 20, dir: 'left', look: 'villager2', move: 'turn', name: 'Netmender', talk: ['Mind the marsh grass. The Wildmon in it are slippery little things.'] },
  ],
};
DATA.maps.salt_hearth = HEARTH('Saltmere Hearthhouse', 'saltmere', 'saltmere', { map: 'saltmere', x: 7, y: 14, dir: 'down' }, 'Nurse Brine');
DATA.maps.salt_mart = MART('Saltmere Mart', 'saltmere', { map: 'saltmere', x: 18, y: 14, dir: 'down' }, 'saltmere');
DATA.maps.salt_house = HOUSE('Stilt House', 'saltmere', { map: 'saltmere', x: 11, y: 14, dir: 'down' },
  [{ id: 'sgran', x: 7, y: 4, dir: 'left', look: 'old', script: 'saltGran' }], { '1,1': 'Jars of pickled samphire.' });
DATA.maps.salt_house2 = HOUSE('Stilt House', 'saltmere', { map: 'saltmere', x: 22, y: 14, dir: 'down' },
  [{ id: 'skid', x: 2, y: 4, dir: 'right', look: 'boy', name: 'Finch', talk: ['My big sister battles at the Veil Hall in Ashgrave. She says it is SO dark in there.', 'Just follow the candles, she says. Easy for her!'] }]);

/* ---------- ROUTE 7 ---------- */
DATA.maps.route7 = {
  name: 'Route 7', region: 'route7', music: 'marsh', outdoor: true, border: 'T', rows: ROWS3.route7, weather: ['rain', 'clear', 'rain', 'clear'],
  connections: { south: { map: 'saltmere', dx: 0 }, north: { map: 'ashgrave', dx: 0 } },
  props: [{ type: 'sign', x: 16, y: 37, text: 'ROUTE 7\nNorth: Ashgrave   South: Saltmere' }],
  items: [{ id: 'hp', x: 3, y: 20, item: 'hyper_potion' }, { id: 'dl', x: 22, y: 25, item: 'dusk_lantern', qty: 3 }, { id: 'sc', x: 3, y: 2, item: 'scroll_shadowclaw', hidden: true }],
  npcs: [
    { id: 'moss', x: 13, y: 34, dir: 'left', look: 'fisher', trainer: 's7a', sight: 2, name: 'Fisher Moss' },
    { id: 'orla', x: 9, y: 25, dir: 'down', look: 'medium', trainer: 's7b', sight: 3, name: 'Medium Orla' },
    { id: 'tor', x: 18, y: 12, dir: 'left', look: 'blackbelt', trainer: 's7c', sight: 1, name: 'Black Belt Tor' },
  ],
};

/* ---------- ASHGRAVE ---------- */
DATA.maps.ashgrave = {
  name: 'Ashgrave', region: 'ashgrave', music: 'ashgrave', outdoor: true, border: 'T', rows: ROWS3.ashgrave,
  connections: { south: { map: 'route7', dx: 0 } },
  buildings: [
    { kind: 'hearth', x: 4, y: 4, w: 6, h: 4, door: 3, to: { map: 'ash_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 10, y: 4, w: 5, h: 4, door: 2, to: { map: 'ash_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'hall', theme: 'veil', x: 4, y: 11, w: 8, h: 6, door: 3, to: { map: 'veil_hall', x: 7, y: 16, dir: 'up' } },
    { kind: 'house', x: 16, y: 11, w: 5, h: 4, door: 2, to: { map: 'ash_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'kit', x: 21, y: 11, w: 5, h: 4, door: 2, to: { map: 'ash_house2', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 14, y: 23, text: 'ASHGRAVE\nRest well, travellers.' },
    { type: 'sign', x: 3, y: 16, text: 'VEIL HALL\nHall Master: Vesper\n"Light is only light because of the dark."' },
    { type: 'sign', x: 15, y: 7, text: 'ASHGRAVE CHURCHYARD\nPlease respect the resting.' },
    { type: 'lamp', x: 11, y: 18 }, { type: 'lamp', x: 25, y: 8 },
  ],
  items: [{ id: 'rc', x: 26, y: 2, item: 'rare_candy' }, { id: 'mp', x: 2, y: 22, item: 'max_potion', hidden: true }],
  npcs: [
    { id: 'ag1', x: 20, y: 8, dir: 'down', look: 'old', move: 'turn', name: 'Gravedigger', talk: ['A tall man with silver hair came through yesterday. Stood by the old graves for an hour.', 'Said he was visiting his partner. Funny, there\'s no person buried with that name. Only a Wildmon.'] },
    { id: 'ag2', x: 8, y: 20, dir: 'right', look: 'medium', move: 'wander', name: 'Mourner', talk: ['Shroudfly carry messages to those who have passed. I send one every spring.'] },
  ],
};
DATA.maps.ash_hearth = HEARTH('Ashgrave Hearthhouse', 'ashgrave', 'ashgrave', { map: 'ashgrave', x: 7, y: 8, dir: 'down' }, 'Nurse Vale');
DATA.maps.ash_mart = MART('Ashgrave Mart', 'ashgrave', { map: 'ashgrave', x: 12, y: 8, dir: 'down' }, 'ashgrave');
DATA.maps.ash_house = HOUSE('Ashgrave Cottage', 'ashgrave', { map: 'ashgrave', x: 18, y: 15, dir: 'down' },
  [{ id: 'agran', x: 7, y: 4, dir: 'left', look: 'old', script: 'ashGran' }], { '1,1': 'Pressed flowers in old books.' });
DATA.maps.ash_house2 = HOUSE('Sexton\'s House', 'ashgrave', { map: 'ashgrave', x: 23, y: 15, dir: 'down' },
  [{ id: 'sexton', x: 2, y: 4, dir: 'right', look: 'gentleman', script: 'sexton' }], { '1,1': 'A ledger of every grave in Ashgrave.' });
DATA.maps.veil_hall = {
  name: 'Veil Hall', region: 'ashgrave', music: 'hall', outdoor: false, dim: 0.93, rows: ROWS3.veil_hall,
  warps: [{ x: 7, y: 17, to: { map: 'ashgrave', x: 7, y: 17, dir: 'down' } }],
  npcs: [
    { id: 'vesper', x: 7, y: 2, dir: 'down', look: 'vesper', script: 'vesper' },
    { id: 'vh1', x: 11, y: 9, dir: 'right', look: 'medium', trainer: 'vh1', sight: 2, name: 'Medium Hesper' },
    { id: 'vh2', x: 12, y: 5, dir: 'left', look: 'medium', trainer: 'vh2', sight: 3, name: 'Medium Morwen' },
    { id: 'guide', x: 6, y: 15, dir: 'right', look: 'clerk', script: 'hallGuide3' },
  ],
};

/* ---------- Map enter hooks ---------- */
Object.assign(DATA.mapEnter, {
  async route5(s) { if (s.quest('act2') && s.quest('act2').done && !s.quest('act3')) { await s.startQuest('act3'); G.tracked = 'act3'; } },
  async glasswater(s) { if (a3() === 0) await s.setStage('act3', 1); },
  async ml_tower_1(s) { if (a3() === 1) await s.setStage('act3', 2); },
  async saltmere(s) { if (a3() === 3) await s.setStage('act3', 4); },
  async ashgrave(s) { if (a3() === 4) await s.setStage('act3', 5); },
});

/* ---------- Scripts ---------- */
const FERRY = {
  glasswater: { name: 'Glasswater City', to: { map: 'glasswater', x: 35, y: 16, dir: 'down' } },
  saltmere: { name: 'Saltmere', to: { map: 'saltmere', x: 23, y: 23, dir: 'down' } },
  port_calder: { name: 'Port Calder', to: { map: 'port_calder', x: 23, y: 13, dir: 'down' } },
};
async function ferryRide(s, from, o) {
  if (!s.has('ferry_ticket')) return s.say(['The ferries are suspended until the Order\'s ships are cleared from the Sound.', 'Coral\'s patrol is working on it. Sorry!'], o);
  const dests = Object.keys(FERRY).filter((k) => k !== from && (!FERRY[k].cond || FERRY[k].cond()));
  const c = await s.ask('Where would you like to sail?', dests.map((k) => FERRY[k].name).concat(['Cancel']), o);
  if (c < 0 || c >= dests.length) return s.say('Safe travels!', o);
  await s.say(['All aboard!'], o);
  await Game.warpTo(FERRY[dests[c]].to, 'door');
  await s.say(`The ferry docked at ${FERRY[dests[c]].name}.`);
}
Object.assign(DATA.scripts, {
  async ferryGlass(s) { return ferryRide(s, 'glasswater', { name: 'Ferry Captain' }); },
  async ferrySalt(s) { return ferryRide(s, 'saltmere', { name: 'Ferry Captain' }); },
  async gwGent(s) {
    const o = { name: 'Gentleman' };
    if (s.flag('beat_morrow')) return s.say(['Morrow Lumen\'s tower is empty! The whole city is talking about it.', 'I always thought "clean light" sounded too good to be true.'], o);
    return s.say(['Morrow Lumen Industries built that tower in a single year. Remarkable!', 'They say Director Morrow never leaves the top floor.'], o);
  },
  async gwScientist(s) {
    const o = { name: 'Researcher' };
    return s.say(['A Lantern holds a Wildmon\'s light. A Siphon takes it out again. Same science, opposite ends.', 'Morrow Lumen hired every Lantern-maker in the city. I said no. Glad I did.'], o);
  },
  async candyGran(s) {
    const o = { name: 'Granny Toffee' };
    if (!s.flag('candy_gift')) { s.set('candy_gift'); await s.say(['Oh, a young trainer! You look peaky. Have a sweetie.', 'My special recipe. One of these and a Wildmon grows up quicker than you can say "toffee".'], o); return s.give('rare_candy', 2); }
    return s.say(['Starseed Honey raises a Wildmon by one whole level. Don\'t give them all to the same one, mind!'], o);
  },
  async exWorker(s) {
    const o = { name: 'Former Employee' };
    if (s.flag('beat_morrow')) return s.say(['You actually beat Morrow? Then maybe it is safe to tell you.', 'Project Eclipse was about making a Wildmon out of pure Siphon light. A Wildmon that would never need a Lantern.', 'I don\'t know if they finished it. I hope they didn\'t.'], o);
    return s.say(['I used to work in that tower. I quit when I saw what the Siphons did to Wildmon.', 'The lifts are locked. Staff use the teleport pads. They are a maze, though.'], o);
  },
  async mlReception(s) {
    const o = { name: 'Receptionist' };
    if (s.flag('beat_morrow')) return s.say(['Everyone has gone. I don\'t think I work here any more.'], o);
    return s.say(['Welcome to Morrow Lumen Industries! Clean light for a brighter Aldermere!', '...You are not on the visitor list. Security!'], o);
  },
  async towerLift(s) {
    if (!s.has('tower_key')) return s.say('A private lift to the top floor. It needs a keycard.');
    const c = await s.ask('Take the lift to the top floor?', ['Yes', 'No']); if (c !== 0) return;
    Sound.sfx('door'); await Game.warpTo({ map: 'ml_tower_4', x: 7, y: 7, dir: 'up' });
  },
  async towerLiftDown(s) {
    const c = await s.ask('Take the lift down to the lobby?', ['Yes', 'No']); if (c !== 0) return;
    Sound.sfx('door'); await Game.warpTo({ map: 'ml_tower_1', x: 16, y: 3, dir: 'down' });
  },
  async corvinEvent(s) {
    const o = { name: 'Admin Corvin' };
    s.player().walking = false;
    s.face('corvin', 'left'); await s.emote('corvin', '!');
    await s.say(['You must be the one Sable keeps writing reports about. I am Corvin. I run the numbers for the Hollow Order.',
      'Do you know how much light a single Lantern wastes? Enough to power a house for a week. Every trainer in Aldermere is carrying a fortune in their bag.',
      'Morrow wants all of it. And what Morrow wants, the numbers deliver.'], o);
    const res = await bossBattle(s, 'corvin');
    if (res !== 'win') return;
    await s.say(['The numbers did not add up. Your Wildmon fought harder than they should.', 'Fine. Take the lift key. The Director wants to meet you anyway. He finds you... interesting.'], o);
    await s.give('tower_key');
    await Game.fadeOut(200); s.remove('corvin'); await Game.fadeIn(200);
  },
  async morrowEvent(s) {
    const o = { name: 'Morrow' };
    s.player().walking = false;
    await s.emote('morrow', '!');
    await s.say(['So. The trainer from Emberlow.', 'I am Morrow. I founded Morrow Lumen Industries. Some call us the Hollow Order. I don\'t mind the name.',
      'I had a partner once. A Wildmon. I kept it in a Lantern, as everyone does. And one day the light in that Lantern simply... went out.',
      'Lanterns don\'t protect Wildmon. They keep them. I mean to free every one of them, and use their light for something that lasts.',
      'Show me your bond, then. Show me it is worth what you think it is.'], o);
    const res = await bossBattle(s, 'morrow');
    if (res !== 'win') return;
    await s.say(['So this is what a bond looks like from the other side.', 'It changes nothing. Project Eclipse is nearly ready, and the Spire will rise whether you believe in it or not.',
      'Sable. The boat.'], o);
    await s.say('Yes, Director. The boat is ready at the west dock.', { name: 'Sable' });
    Sound.sfx('flee'); await Game.fadeOut(300); s.remove('morrow'); await Game.fadeIn(300);
    s.set('beat_morrow'); s.achieve('order_foiled');
    const w = s.spawn({ id: 'wren_t', x: 8, y: 7, dir: 'up', look: 'wren', name: 'Wren' });
    await s.say(['{player}! Was that Morrow?! I saw a grey boat pull away from the tower dock, heading west across the Sound!',
      'Coral says the Sound is clear of Order ships now, so the ferries are running again. She sent you this.'], { name: 'Wren' });
    await s.give('ferry_ticket');
    await s.say(['The boat was headed for Saltmere. Take the ferry from the dock on the east side of the city. I\'ll tell Coral and catch you up!'], { name: 'Wren' });
    s.remove(w.id);
    await s.setStage('act3', 3);
  },
  async saltGran(s) {
    const o = { name: 'Old Marsh Wife' };
    if (!s.flag('salt_gift')) { s.set('salt_gift'); await s.say(['You came on the ferry? Then you will want to go out on the marsh.', 'Take these. Tide Lanterns work a treat on marsh Wildmon.'], o); return s.give('tide_lantern', 3); }
    return s.say(['The fog rolls in off the moor every evening. That is when the Marshglow come out to play.'], o);
  },
  async ashGran(s) {
    const o = { name: 'Old Widow' };
    if (!s.flag('ash_gift')) { s.set('ash_gift'); await s.say(['Sister Vesper is a kind soul. But her Hall is dark as a moonless night.', 'Here. Dusk Lanterns. They glow brightest in the dark, like her ghosts.'], o); return s.give('dusk_lantern', 3); }
    return s.say(['Every candle in the Veil Hall marks the right path. Vesper lights them herself each evening.'], o);
  },
  async sexton(s) {
    const o = { name: 'Sexton Abernethy' };
    if (s.flag('beat_morrow')) return s.say(['The silver-haired man? He stood by the grave of a Wildmon. A Lanternwisp, buried thirty years ago.', 'The stone says only "Forgive me." Strange words for a gravestone.'], o);
    return s.say(['I keep the records for every grave in Ashgrave. People and Wildmon alike.'], o);
  },
  async hallGuide3(s) {
    const o = { name: 'Hall Guide' };
    if (!s.flag('beat_vesper')) return s.say(['Welcome to the Veil Hall. It is very dark in here, so follow the candles.', 'Vesper uses Ghost types. Dark and Ghost moves hit them hard. Normal and Fighting moves pass straight through!'], o);
    return s.say(['What a battle! You are a credit to the Hall.'], o);
  },
  async vesper(s) {
    const o = { name: 'Vesper' };
    if (s.flag('beat_vesper')) return s.say(['The Climbing Gear will take you up the slopes north of town, towards Skyreach.', 'Morrow went that way too. I lit a candle for him. I think he needs it more than he knows.'], o);
    await s.say(['You found your way through the dark. The candles guided you, didn\'t they?', 'I am Vesper, Hall Master of the Veil Hall. The spirits here are gentle, but they do not lose easily.',
      'A man came through Ashgrave yesterday. He stood by a grave and wept. Then he went north, towards Skyreach.', 'But first... let us see your light.'], o);
    const res = await bossBattle(s, 'vesper');
    if (res !== 'win') return;
    s.achieve('puzzler');
    await s.say(['The spirits sing for you tonight. Here is the Veil Badge.'], o);
    await s.badge('veil');
    await s.say(['And this Climbing Gear. There are rocky slopes north of here that no one can cross without it.', 'Take this Scroll too: Shade Talon.'], o);
    await s.give('climbing_gear'); await s.give('scroll_shadowclaw');
    if (!s.quest('act3').done) {
      await s.completeQuest('act3');
      await s.give('max_potion', 3); await s.give('rare_candy', 2);
      await s.say(['Act III of your journey is complete!', 'Morrow has headed north towards Skyreach. Climb the Gullwind Cliffs above Ashgrave to follow him.'], { sign: true });
    }
  },
});
DATA.trainers.kit4.after = 'Next time I am beating you. For real this time. The Professor says hi, by the way.';

/* Port Calder ferry office joins the network once the ferries run */
{
  const fc0 = DATA.scripts.ferryClerk;
  DATA.scripts.ferryClerk = async function (s, npc) { if (s.has('ferry_ticket')) return ferryRide(s, 'port_calder', { name: 'Ferry Clerk' }); return fc0(s, npc); };
}
