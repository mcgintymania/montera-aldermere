'use strict';
/* =====================================================================
   ACT I MAPS + STORY
   Fernwick → Bramblewood → Mossgate (Bloom Hall) → Route 2 →
   Port Calder → Sunken Lighthouse → Tide Hall
   ===================================================================== */

const a1 = () => (G.quests.act1 ? (G.quests.act1.done ? 99 : G.quests.act1.stage) : -1);

/* Battle a trainer from a script (no line-of-sight walk). */
async function trainerBattle(s, tid, opt = {}) {
  const T = DATA.trainers[tid];
  const team = T.team.map(([sp, lv, item]) => Mon.create(sp, lv, { lustre: false, mark: null, pot: evenPot(), item: item || null, ti: 0 }));
  const res = await s.battle({ kind: 'trainer', trainer: T, enemy: team, music: T.music, noWhiteout: opt.noWhiteout });
  if (res === 'win') { s.set('beat_' + tid); s.achieve('first_win'); }
  return res;
}
/* Kit's Route 2 team depends on the starter you picked. */
Object.defineProperty(DATA.trainers.kit2, 'team', {
  get() {
    const pick = RIVAL_PICK[G && G.flags.starter] || 'firecub';
    return [['twigwing', 12], ['zappik', 13], [pick, 15, 'bramble_berry']];
  },
});
Object.defineProperty(DATA.trainers.kit2, 'intro', { get() { return ['Hey, {player}! I heard you got a Badge already.', "So did I. Bloom Badge, first try. Obviously.", "Let's see whose team grew more!"]; } });

/* ---------- Edits to existing maps ---------- */
DATA.maps.fernwick.connections.north = { map: 'bramblewood', dx: 0 };
DATA.maps.fernwick.props = DATA.maps.fernwick.props.map((p) => (p.type === 'barrier' ? Object.assign({}, p, { cond: (g) => !g.flags.bramble_open }) : p));
DATA.maps.fernwick.npcs = DATA.maps.fernwick.npcs.map((n) => (n.id === 'holt' ? Object.assign({}, n, { script: 'holt', cond: (g) => !g.flags.bramble_open }) : n));
DATA.maps.fernwick.npcs.push({ id: 'holt2', x: 12, y: 3, dir: 'right', look: 'ranger', name: 'Ranger Holt', cond: (g) => !!g.flags.bramble_open,
  talk: ['Bramblewood is open again. Stick to the path if you can.', 'Those grey-coated folk went in a while back. Hollow Order, they call themselves. Keep your eyes open.'] });
{
  const ash = DATA.maps.fern_house.npcs.find((n) => n.id === 'mrsash');
  delete ash.talk; ash.script = 'mrsAsh';
}
DATA.maps.emberlow.rows[11] = '__' + DATA.maps.emberlow.rows[11].slice(2);
DATA.maps.emberlow.connections.west = { map: 'route2', dy: -3 };
DATA.maps.emberlow.npcs.push({ id: 'seawall', x: 2, y: 11, dir: 'right', look: 'hiker', name: 'Builder', script: 'seawall', cond: (g) => !g.flags.route2_open });
DATA.maps.emberlow.props.push({ type: 'sign', x: 2, y: 13, text: 'ROUTE 2\nWest to Port Calder along the coast.' });

/* ---------- BRAMBLEWOOD ---------- */
DATA.maps.bramblewood = {
  name: 'Bramblewood', region: 'bramblewood', music: 'forest', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTT__TTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTT__TTTTTTTTTTTTTT',
    'TTTTTTTTT,,,,.__.,,,,TTTTTTTTT',
    'TT...TTT,,,,,.__.,,,,,TTT...TT',
    'TT.f..TT,,TT,.__.,TT,,TT..f.TT',
    'TT....b,,,TT..__..TT,,,b....TT',
    'TT.f..TT,,,,..__..,,,,TT....TT',
    'TTTTTTTT,,,,..__..,,,,TTTTTTTT',
    'TTTTTTTTTTT...__...TTTTTTTTTTT',
    'TT,,,,,TTTT...__...TTTTT,,,TTT',
    'TT,,,,,,......__........,,,,TT',
    'TT,,TT,,,.....__.....TT,,,,,TT',
    'TT,,TT,,TTTT..__..TTTTT,,TTTTT',
    'TTTTTTTTTTTT..__..TTTTTTTTTTTT',
    'TTTTTTTTTTT..f__f..TTTTTTTTTTT',
    'TTTTTTTTTT..ff__ff..TTTTTTTTTT',
    'TTTTTTTTT..f..__..f..TTTTTTTTT',
    'TTTTTTTTT.....__.....TTTTTTTTT',
    'TTTTTTTTT............TTTTTTTTT',
    'TTTTTTTTT..f......f..TTTTTTTTT',
    'TTTTTTTTTT..ff..ff..TTTTTTTTTT',
    'TTTTTTTTTTT...__...TTTTTTTTTTT',
    'TT,,,,TTTTTTT.__.TTTTTTTTTTTTT',
    'TT,,,,,,TTTTT.__.TTTTT~~~~TTTT',
    'TT,,TT,,,,....__....T~~~~~~.TT',
    'TT,,TT,,,,....__......~~~~..TT',
    'TT....TT,,TT..__..TT...~~...TT',
    'TT.f..TT,,TT..__..TT........TT',
    'TTTTTTTT,,TT..__..TT,,,,TTTTTT',
    'TT,,,,,,,,....__....,,,,,,,,TT',
    'TT,,,,,,,,....__....,,,,,,,,TT',
    'TT,,TTTTTT....__....TTTTTT,,TT',
    'TT,,TTTTTTT...__...TTTTTTT,,TT',
    'TT....TTTTTT..__..TTTTTT....TT',
    'TTTT..TTTTTT..__..TTTTTT..TTTT',
    'TTTT..........__..........TTTT',
    'TTTT..,,,,,...__.......,,,TTTT',
    'TTTTT.,,,,,...__....,,,,,,TTTT',
    'TTTTTT,,,,,TT.__.,,,,,TTTTTTTT',
    'TTTTTTTTTTTTT.__.TTTTTTTTTTTTT',
    'TTTTTTTTTTTTT.__.TTTTTTTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTTTT',
  ],
  connections: { south: { map: 'fernwick', dx: 0 }, north: { map: 'mossgate', dx: 0 } },
  props: [
    { type: 'sign', x: 16, y: 40, text: 'BRAMBLEWOOD\nNorth: Mossgate   South: Fernwick' },
    { type: 'sign', x: 13, y: 2, text: 'BRAMBLEWOOD\nSouth: Fernwick   North: Mossgate' },
    { type: 'wildmon', sp: 'fawnlight', grey: true, x: 18, y: 15, script: 'greyFawn', cond: (g) => !g.flags.grey_done },
    { type: 'herb', x: 26, y: 27, script: 'glowcap', id: 'gc1', cond: (g) => !g.flags.glowcap_gc1 },
    { type: 'herb', x: 3, y: 9, script: 'glowcap', id: 'gc2', cond: (g) => !g.flags.glowcap_gc2 },
    { type: 'herb', x: 2, y: 26, script: 'glowcap', id: 'gc3', cond: (g) => !g.flags.glowcap_gc3 },
  ],
  items: [
    { id: 'sunshard', x: 3, y: 3, item: 'sun_shard' },
    { id: 'pjab', x: 26, y: 3, item: 'scroll_poisonjab' },
    { id: 'pat', x: 4, y: 6, item: 'patience_lantern', qty: 2 },
    { id: 'anti', x: 27, y: 33, item: 'antidote' },
    { id: 'glant', x: 2, y: 33, item: 'great_lantern' },
    { id: 'hpot', x: 20, y: 18, item: 'super_potion', hidden: true },
    { id: 'pouch', x: 25, y: 11, money: 500, hidden: true },
  ],
  triggers: [{ x: 13, y: 21, w: 4, h: 1, script: 'gladeEvent', cond: (g) => !g.flags.glade_done }],
  npcs: [
    { id: 'wes', x: 12, y: 35, dir: 'right', look: 'bugkid', trainer: 'wes', sight: 4, name: 'Bug Catcher Wes' },
    { id: 'lou', x: 17, y: 30, dir: 'left', look: 'girl', trainer: 'lou', sight: 4, name: 'Picnicker Lou' },
    { id: 'ned', x: 12, y: 10, dir: 'right', look: 'boy', trainer: 'ned', sight: 4, name: 'Camper Ned' },
    { id: 'tamsin', x: 27, y: 26, dir: 'left', look: 'ranger', trainer: 'tamsin', sight: 3, name: 'Ranger Tamsin' },
    { id: 'poacher', x: 26, y: 10, dir: 'down', look: 'grunt2', script: 'poacher', noTurn: false, cond: (g) => !g.flags.poacher_gone },
    { id: 'wren_g', x: 12, y: 17, dir: 'right', look: 'wren', name: 'Wren', talk: ['Help!'], cond: (g) => !g.flags.glade_done },
    { id: 'grunt_g', x: 17, y: 17, dir: 'left', look: 'grunt', name: 'Order Grunt', talk: ['Get lost, kid!'], cond: (g) => !g.flags.glade_done },
  ],
};

/* ---------- MOSSGATE ---------- */
DATA.maps.mossgate = {
  name: 'Mossgate', region: 'mossgate', music: 'fernwick', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTT__TTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTT__TTTT',
    'TTffffff................rr..TT',
    'TT..........................TT',
    'TT..........................TT',
    'TT..........................TT',
    'TT..........................TT',
    'TT..........................TT',
    'TT...____________________...TT',
    'TT..._........__........_...TT',
    'TT............__............TT',
    'TT........fff.__.fff........TT',
    'TT........fff.__.fff........TT',
    'TT........fff.__.fff........TT',
    'TT............__............TT',
    'TT............__............TT',
    'TT....___________________...TT',
    'TT............__............TT',
    'TT.~~~~.......__............TT',
    'TT~~~~~.......__......fffff.TT',
    'TT.~~~~.......__......fffff.TT',
    'TT............__............TT',
    'TTTTTTTTTTTTTT__TTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTT__TTTTTTTTTTTTTT',
  ],
  connections: { south: { map: 'bramblewood', dx: 0 } },
  buildings: [
    { kind: 'hall', theme: 'bloom', x: 11, y: 2, w: 8, h: 6, door: 3, to: { map: 'moss_hall', x: 7, y: 16, dir: 'up' } },
    { kind: 'house', x: 3, y: 3, w: 5, h: 4, door: 2, to: { map: 'moss_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'home', x: 20, y: 3, w: 5, h: 4, door: 2, to: { map: 'moss_house2', x: 4, y: 6, dir: 'up' } },
    { kind: 'hearth', x: 3, y: 12, w: 6, h: 4, door: 3, to: { map: 'moss_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 21, y: 12, w: 5, h: 4, door: 2, to: { map: 'moss_mart', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 16, y: 21, text: 'MOSSGATE\nThe town in bloom.' },
    { type: 'sign', x: 19, y: 7, text: 'BLOOM HALL\nHall Master: Hazel\n"Patience grows the strongest roots."' },
    { type: 'sign', x: 26, y: 2, text: 'ROUTE 3 TO IRONMOUTH\nCLOSED: ROCKSLIDE. Crews are working on it.' },
    { type: 'lamp', x: 13, y: 9 }, { type: 'lamp', x: 16, y: 15 },
  ],
  items: [{ id: 'inc', x: 27, y: 21, item: 'calm_incense', hidden: true }],
  npcs: [
    { id: 'mv1', x: 9, y: 10, dir: 'down', look: 'villager', move: 'wander', name: 'Gardener',
      talk: ['Everyone in Mossgate grows something. Even the Hall Master!', "Hazel's Wildmon love sleep and poison powders. An Antivenom or a Wake Bell might save your skin."] },
    { id: 'mv2', x: 8, y: 18, dir: 'left', look: 'old', move: 'turn', name: 'Old Tobin',
      talk: ['The pond here is older than the town.', 'They say the Bloom Hall tower was a Beacon once. Ancient history. Nowadays it is just the finest Hall in the east.'] },
    { id: 'mv3', x: 20, y: 9, dir: 'down', look: 'student', move: 'wander', name: 'Girl',
      talk: ['I watched a trainer from Fernwick get stuck in the Hall for an hour.', 'The hedges move when you step on the red switches!'] },
  ],
};
DATA.maps.moss_hearth = {
  name: 'Mossgate Hearthhouse', region: 'mossgate', music: 'indoor', outdoor: false, rest: 'mossgate',
  rows: DATA.maps.fern_hearth.rows.slice(),
  warps: [{ x: 5, y: 7, to: { map: 'mossgate', x: 6, y: 16, dir: 'down' } }, { x: 6, y: 7, to: { map: 'mossgate', x: 6, y: 16, dir: 'down' } }],
  tileScripts: { '10,3': 'storagePc' },
  npcs: [
    { id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', name: 'Nurse Bryony', script: 'nurse' },
    { id: 'mh1', x: 8, y: 5, dir: 'left', look: 'hiker', move: 'wander', name: 'Hiker',
      talk: ['I was heading north to Ironmouth, but a rockslide has closed Route 9.', 'They say it won\'t be cleared until... well, nobody knows. Strange times.'] },
  ],
};
DATA.maps.moss_mart = {
  name: 'Mossgate Mart', region: 'mossgate', music: 'indoor', outdoor: false,
  rows: DATA.maps.fern_mart.rows.slice(),
  warps: [{ x: 4, y: 7, to: { map: 'mossgate', x: 23, y: 16, dir: 'down' } }, { x: 5, y: 7, to: { map: 'mossgate', x: 23, y: 16, dir: 'down' } }],
  npcs: [
    { id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', name: 'Clerk', script: 'shop5', shop: 'mossgate' },
    { id: 'mm1', x: 7, y: 4, dir: 'up', look: 'villager2', move: 'wander', name: 'Shopper',
      talk: ['Great Lanterns catch Wildmon more easily. Pricey, but worth it for a rare one!', 'Calm Incense keeps wild Wildmon away. Lovely for a walk in the woods.'] },
  ],
};
DATA.maps.moss_house = {
  name: 'Mossgate House', region: 'mossgate', music: 'indoor', outdoor: false,
  rows: DATA.maps.fern_house.rows.slice(),
  warps: [{ x: 4, y: 7, to: { map: 'mossgate', x: 5, y: 7, dir: 'down' } }, { x: 5, y: 7, to: { map: 'mossgate', x: 5, y: 7, dir: 'down' } }],
  tileText: { '1,1': 'Seed catalogues and gardening almanacs.' },
  npcs: [{ id: 'gran', x: 7, y: 4, dir: 'left', look: 'old', script: 'mossGran' }],
};
DATA.maps.moss_house2 = {
  name: 'Mossgate House', region: 'mossgate', music: 'indoor', outdoor: false,
  rows: DATA.maps.fern_house.rows.slice(),
  warps: [{ x: 4, y: 7, to: { map: 'mossgate', x: 22, y: 7, dir: 'down' } }, { x: 5, y: 7, to: { map: 'mossgate', x: 22, y: 7, dir: 'down' } }],
  tileText: { '1,1': 'A shelf of jars. Each one holds a glowing worm drawing.' },
  npcs: [{ id: 'glimkid', x: 2, y: 4, dir: 'right', look: 'boy', script: 'glimKid' }],
};
DATA.maps.moss_hall = {
  name: 'Bloom Hall', region: 'mossgate', music: 'hall', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWW',
    'WJWWWWWWWWWWWJW',
    'yOOOOOOOOOOOOOy',
    'yOOOOOOOOOOOOOy',
    'yyyyyyGyyyyyyyy',
    'yOOOOOOOOOOoOOy',
    'yOOOOOOOOOOOOOy',
    'yyygyyyyyyyyGyy',
    'yOOOOOOOOOOOOOy',
    'yOOoOOOOOOOOOOy',
    'yyyyyyyyyygyyyy',
    'yOOOOOOOOOOOOOy',
    'yOOOoOOOOOOOOOy',
    'yOOOOOOOOOOOOOy',
    'yyyyyyyOyyyyyyy',
    'yOOOOOOOOOOOOOy',
    'yOOOOOOOOOOOOOy',
    'yyyyyymmmyyyyyy',
  ],
  warps: [6, 7, 8].map((x) => ({ x, y: 17, to: { map: 'mossgate', x: 14, y: 8, dir: 'down' } })),
  npcs: [
    { id: 'hazel', x: 7, y: 2, dir: 'down', look: 'hazel', script: 'hazel' },
    { id: 'pell', x: 11, y: 12, dir: 'left', look: 'gardener', trainer: 'pell', sight: 4, name: 'Gardener Pell' },
    { id: 'ivo', x: 2, y: 6, dir: 'right', look: 'gardener', trainer: 'ivo', sight: 4, name: 'Gardener Ivo' },
    { id: 'guide', x: 9, y: 16, dir: 'left', look: 'clerk', script: 'hallGuide' },
  ],
};

/* ---------- ROUTE 2 ---------- */
DATA.maps.route2 = {
  name: 'Route 2', region: 'route2', music: 'route', outdoor: true, border: 'T', weather: ['clear', 'clear', 'rain', 'clear'],
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'T..........TT...,,,,,,,,,...................TTTT',
    'T..........TT...,,,,,,,,,._____________........T',
    '_______________.,,,,,,,,,._..,,,,,,,,._.,,,,,,.T',
    'T..,,,,,,,,,,._..........._..,,,,,,,,._.,,,,,,.T',
    'T..,,,,,,,,,,._____________..........._.,,,,,,.T',
    'T..,,,,,,,,,,.......TTTT....rr....TTT.__________',
    'Tvvvvvv.TTT....vvvv.TTTT..........TTT..........T',
    'rsss~~sssssssssssssssssssssssss~~~sssssssssssssr',
    'rssssssssssssssssssssssssssssss~~~sssssssssssssr',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~w~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~w~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~w~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],
  connections: { east: { map: 'emberlow', dy: 3 }, west: { map: 'port_calder', dy: 2 } },
  props: [
    { type: 'sign', x: 46, y: 9, text: 'ROUTE 2\nWest: Port Calder   East: Emberlow' },
    { type: 'sign', x: 1, y: 4, text: 'ROUTE 2\nWest: Port Calder   East: Emberlow' },
  ],
  items: [
    { id: 'pot', x: 43, y: 3, item: 'potion' },
    { id: 'sp', x: 13, y: 3, item: 'super_potion' },
    { id: 'gl', x: 3, y: 11, item: 'great_lantern', hidden: true },
    { id: 'sg', x: 32, y: 9, item: 'sea_glass', hidden: true },
    { id: 'kin', x: 46, y: 6, item: 'kin_lantern', qty: 3 },
  ],
  triggers: [{ x: 21, y: 3, w: 1, h: 7, script: 'kit2', cond: (g) => !g.flags.beat_kit2 && !!g.flags.route2_open }],
  npcs: [
    { id: 'kit', x: 19, y: 7, dir: 'right', look: 'kit', script: 'kit2', cond: (g) => !g.flags.beat_kit2 && !!g.flags.route2_open },
    { id: 'mia', x: 30, y: 3, dir: 'down', look: 'lass', trainer: 'mia', sight: 1, name: 'Lass Mia' },
    { id: 'gus', x: 8, y: 4, dir: 'down', look: 'hiker', trainer: 'gus', sight: 1, name: 'Hiker Gus' },
    { id: 'joss', x: 24, y: 10, dir: 'left', look: 'sailor', trainer: 'joss', sight: 5, name: 'Sailor Joss' },
    { id: 'hal', x: 41, y: 14, dir: 'down', look: 'fisher', trainer: 'hal', noSight: true, name: 'Fisher Hal' },
  ],
};

/* ---------- PORT CALDER ---------- */
DATA.maps.port_calder = {
  name: 'Port Calder', region: 'port_calder', music: 'port', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTTT.........................TTTTT',
    'TTT..........................TTTTT',
    'TT...........................TTTTT',
    'TT...........................TTTTT',
    'TT..............................TT',
    'TT..______________________________',
    'TT.._...........__..............TT',
    'TT.._...........__..............TT',
    'TT.._.......fff.__..........ffffTT',
    'TT.._.......fff.__..........ffffTT',
    'TT.._...........__..............TT',
    'TT.._...........__..............TT',
    'TT..__________________________..TT',
    'TT..............................TT',
    'TTssssssssssssssssssssssssssssssTT',
    'TTssssssssssssssssssssssssssssssTT',
    '~~~~~~w~~~~~~w~~~~~~~~~~~~w~~~~~~~',
    '~~~~~~w~~~~~~w~~~~~~~~~~~~w~~~~~~~',
    '~~~~~~w~~~~~~w~~~~~~~~~~~~w~~~~~~~',
    '~~~~~~wwww~~~~~~~~~~~~~~~~www~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~ssssss~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~ssssss~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~ssssss~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],
  connections: { east: { map: 'route2', dy: -2 } },
  buildings: [
    { kind: 'hearth', x: 5, y: 3, w: 6, h: 4, door: 3, to: { map: 'calder_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 12, y: 3, w: 5, h: 4, door: 2, to: { map: 'calder_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'hall', theme: 'tide', x: 20, y: 1, w: 8, h: 6, door: 3, to: { map: 'tide_hall', x: 7, y: 16, dir: 'up' } },
    { kind: 'house', x: 6, y: 9, w: 5, h: 4, door: 2, to: { map: 'calder_house', x: 4, y: 6, dir: 'up' } },
    { kind: 'kit', x: 20, y: 9, w: 6, h: 4, door: 3, to: { map: 'ferry_office', x: 4, y: 6, dir: 'up' } },
    { kind: 'sunken', x: 29, y: 19, w: 2, h: 4, door: 0, to: { map: 'sunken_1', x: 7, y: 12, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 30, y: 8, text: 'PORT CALDER\nGateway to the Sound.' },
    { type: 'sign', x: 19, y: 6, text: 'TIDE HALL\nHall Master: Coral\n"Ride the current, or it rides you."' },
    { type: 'sign', x: 14, y: 16, text: 'FERRY TO GLASSWATER CITY\nSERVICE SUSPENDED UNTIL FURTHER NOTICE.' },
    { type: 'sign', x: 26, y: 15, text: 'DANGER: SUNKEN LIGHTHOUSE\nUnsafe structure. Keep off the pier.' },
    { type: 'lamp', x: 11, y: 8 }, { type: 'lamp', x: 27, y: 13 }, { type: 'lamp', x: 3, y: 15 },
  ],
  items: [
    { id: 'gl', x: 31, y: 23, item: 'great_lantern' },
    { id: 'sg', x: 3, y: 16, item: 'sea_glass', hidden: true },
  ],
  npcs: [
    { id: 'tideguard', x: 23, y: 7, dir: 'down', look: 'swimmer2', script: 'tideDoor', cond: (g) => !g.flags.coral_back },
    { id: 'pier1', x: 26, y: 17, dir: 'down', look: 'sailor', script: 'pierSailor', cond: (g) => !g.flags.pier_open },
    { id: 'pier2', x: 25, y: 17, dir: 'right', look: 'sailor', script: 'pierSailor', cond: (g) => !!g.flags.pier_open },
    { id: 'pc1', x: 9, y: 21, dir: 'down', look: 'fisher', name: 'Fisherman',
      talk: ['Glintstar bite best when the light is low.', 'Something strange has been washing ashore, though. Wildmon with no colour at all. Poor things.'] },
    { id: 'pc2', x: 12, y: 10, dir: 'down', look: 'boy', move: 'wander', name: 'Boy',
      talk: ['A big ship with grey sails was in the harbour last week.', 'Mum says not to go near those grey-coat people.'] },
    { id: 'pc3', x: 28, y: 4, dir: 'left', look: 'villager2', move: 'wander', name: 'Dockworker',
      talk: ['Coral runs the Tide Hall and the harbour patrol. Nobody messes with Port Calder while she is around.'] },
  ],
};
DATA.maps.calder_hearth = {
  name: 'Port Calder Hearthhouse', region: 'port_calder', music: 'indoor', outdoor: false, rest: 'port_calder',
  rows: DATA.maps.fern_hearth.rows.slice(),
  warps: [{ x: 5, y: 7, to: { map: 'port_calder', x: 8, y: 7, dir: 'down' } }, { x: 6, y: 7, to: { map: 'port_calder', x: 8, y: 7, dir: 'down' } }],
  tileScripts: { '10,3': 'storagePc' },
  npcs: [
    { id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', name: 'Nurse Lena', script: 'nurse' },
    { id: 'ch1', x: 9, y: 5, dir: 'left', look: 'sailor', move: 'wander', name: 'Sailor',
      talk: ['The Hollow Order says it is a clean-energy company. Morrow Lumen Industries, they call it.', 'Clean energy, my foot. Since they showed up, every lantern in the harbour has been flickering.'] },
  ],
};
DATA.maps.calder_mart = {
  name: 'Port Calder Mart', region: 'port_calder', music: 'indoor', outdoor: false,
  rows: DATA.maps.fern_mart.rows.slice(),
  warps: [{ x: 4, y: 7, to: { map: 'port_calder', x: 14, y: 7, dir: 'down' } }, { x: 5, y: 7, to: { map: 'port_calder', x: 14, y: 7, dir: 'down' } }],
  npcs: [
    { id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', name: 'Clerk', script: 'shop5', shop: 'port_calder' },
    { id: 'cm1', x: 7, y: 4, dir: 'up', look: 'lass', move: 'wander', name: 'Shopper', talk: ['Thaw Tea! In a seaside town! Who buys that?', '...Oh. Me. I bought three.'] },
  ],
};
DATA.maps.calder_house = {
  name: 'Harbour Cottage', region: 'port_calder', music: 'indoor', outdoor: false,
  rows: DATA.maps.fern_house.rows.slice(),
  warps: [{ x: 4, y: 7, to: { map: 'port_calder', x: 8, y: 13, dir: 'down' } }, { x: 5, y: 7, to: { map: 'port_calder', x: 8, y: 13, dir: 'down' } }],
  tileText: { '1,1': 'Old ship logs, warped by sea air.' },
  npcs: [{ id: 'salt', x: 7, y: 4, dir: 'left', look: 'old', script: 'oldSalt' }],
};
DATA.maps.ferry_office = {
  name: 'Ferry Office', region: 'port_calder', music: 'indoor', outdoor: false,
  rows: DATA.maps.fern_house.rows.slice(),
  warps: [{ x: 4, y: 7, to: { map: 'port_calder', x: 23, y: 13, dir: 'down' } }, { x: 5, y: 7, to: { map: 'port_calder', x: 23, y: 13, dir: 'down' } }],
  tileText: { '1,1': 'Timetables for ferries to Glasswater City and Lantern Isle. Every one is crossed out.' },
  npcs: [{ id: 'ferry', x: 7, y: 4, dir: 'left', look: 'sailor', script: 'ferryClerk' }],
};
DATA.maps.tide_hall = {
  name: 'Tide Hall', region: 'port_calder', music: 'hall', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWW',
    '~JYYYYYYYYYYYJ~',
    '~YYYYYYYYYYYYY~',
    '~~~~~~~Y~~~~~~~',
    '~666666Y444444~',
    '~~~8~~~26666Y~~',
    '~~~Y44~2Y444~~~',
    '~~~8~~~22~~8~~~',
    '~~~8~~~22~~8~~~',
    '~~Y86~~2244Y~~~',
    '~~8~~~~22~~8~~~',
    '~~8~~~~22~~8~~~',
    '~YYYYYYYYYYYYY~',
    '~YYYYYYYYYYYYY~',
    '~YYYYYYYYYYYYY~',
    '~YYYYYYYYYYYYY~',
    'WWWWWWWmWWWWWWW',
  ],
  warps: [{ x: 7, y: 17, to: { map: 'port_calder', x: 23, y: 7, dir: 'down' } }],
  npcs: [
    { id: 'coral', x: 7, y: 2, dir: 'down', look: 'coral', script: 'coral', cond: (g) => !!g.flags.coral_back },
    { id: 'rae', x: 3, y: 14, dir: 'right', look: 'swimmer', trainer: 'rae', sight: 4, name: 'Swimmer Rae' },
    { id: 'dex', x: 12, y: 13, dir: 'left', look: 'swimmer2', trainer: 'dex', sight: 4, name: 'Swimmer Dex' },
    { id: 'guide', x: 9, y: 16, dir: 'left', look: 'clerk', script: 'hallGuide' },
  ],
};

/* ---------- SUNKEN LIGHTHOUSE ---------- */
DATA.maps.sunken_1 = {
  name: 'Sunken Lighthouse', region: 'port_calder', music: 'order', outdoor: false, dim: 0.6, caveEnc: true,
  rows: [
    'EEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEE',
    'ESeeeeeEEeeeeexE',
    'Eeeeeeee~~eeeeeE',
    'Eexeee~~~~~eeeeE',
    'Eeeee~~~~~~~eeeE',
    'Eeee~~~~~~~~eexE',
    'EeeewwwwwwwweeeE',
    'Eeee~~~~~~~~eeeE',
    'Exee~~~~~~~eeeeE',
    'Eeeee~~~~~eeexeE',
    'EeeeeeeeeeeeeeeE',
    'EeeeeeeeeeeeeeeE',
    'EEEEEEEeeEEEEEEE',
  ],
  warps: [
    { x: 7, y: 13, to: { map: 'port_calder', x: 29, y: 23, dir: 'down' } }, { x: 8, y: 13, to: { map: 'port_calder', x: 29, y: 23, dir: 'down' } },
    { x: 1, y: 2, to: { map: 'sunken_2', x: 2, y: 10, dir: 'right' } },
  ],
  items: [{ id: 'sp', x: 14, y: 3, item: 'super_potion' }, { id: 'gl', x: 2, y: 12, item: 'great_lantern', hidden: true }],
  tileText: { '2,4': 'A crate of Siphon Lantern parts. None of them light up.', '14,6': 'Crates stamped MORROW LUMEN INDUSTRIES.' },
  npcs: [
    { id: 'wren', x: 9, y: 12, dir: 'up', look: 'wren', script: 'wrenSunken', cond: (g) => a1() >= 3 && !g.flags.beat_rook },
    { id: 'g3', x: 12, y: 9, dir: 'left', look: 'grunt', trainer: 'grunt3', sight: 4, name: 'Order Grunt' },
  ],
};
DATA.maps.sunken_2 = {
  name: 'Sunken Lighthouse', region: 'port_calder', music: 'order', outdoor: false, dim: 0.62, caveEnc: true,
  rows: [
    'EEEEEEEEEEEEEEEE',
    'EEEEEEEEEEEEEEEE',
    'EeeeexeeeeeexxSE',
    'EeexeeexeeeeeeeE',
    'EeeeeeeexxxeeeeE',
    'ExxxeeeeeeeeeeeE',
    'EeeeeexxeexxxeeE',
    'EexeeeeeeeeeeeeE',
    'EeeexxxeeeexeexE',
    'EeeeeeeeeeeeeeeE',
    'ESeeeeeeexeeeeeE',
    'EEEEEEEEEEEEEEEE',
  ],
  warps: [
    { x: 1, y: 10, to: { map: 'sunken_1', x: 2, y: 2, dir: 'right' } },
    { x: 14, y: 2, to: { map: 'sunken_3', x: 2, y: 7, dir: 'right' } },
  ],
  items: [{ id: 'sp', x: 2, y: 3, item: 'super_potion' }, { id: 'inc', x: 10, y: 9, item: 'calm_incense', hidden: true }, { id: 'bl', x: 3, y: 7, item: 'bright_lantern', qty: 2 }],
  npcs: [
    { id: 'g4', x: 6, y: 7, dir: 'right', look: 'grunt2', trainer: 'grunt4', sight: 5, name: 'Order Grunt' },
    { id: 'g5', x: 12, y: 3, dir: 'down', look: 'grunt', trainer: 'grunt5', sight: 3, name: 'Order Grunt' },
    { id: 'g6', x: 14, y: 4, dir: 'up', look: 'grunt2', trainer: 'grunt6', sight: 1, name: 'Order Grunt' },
  ],
};
DATA.maps.sunken_3 = {
  name: 'Lamp Room', region: 'port_calder', music: 'order', outdoor: false, dim: 0.45,
  rows: [
    'EEEEEEEEEEEE',
    'EEEEEMMEEEEE',
    'EeeeeeeeeeeE',
    'EeeeeeeeeeeE',
    'EeeeeeeeeeeE',
    'EeeeeeeeeeeE',
    'EeeeeeeeeeeE',
    'ESeeeeeeeeeE',
    'EeeeeeeeeeeE',
    'EEEEEEEEEEEE',
  ],
  warps: [{ x: 1, y: 7, to: { map: 'sunken_2', x: 14, y: 3, dir: 'down' } }],
  tileText: { '5,1': 'A Siphon machine, humming with stolen light. Its cage is empty now.', '6,1': 'A Siphon machine, humming with stolen light. Its cage is empty now.' },
  triggers: [{ x: 1, y: 5, w: 10, h: 1, script: 'rookEvent', cond: (g) => !g.flags.beat_rook }],
  npcs: [
    { id: 'rook', x: 6, y: 3, dir: 'down', look: 'rook', name: 'Captain Rook', talk: ['...'], cond: (g) => !g.flags.beat_rook },
    { id: 'coral', x: 9, y: 2, dir: 'left', look: 'coral', name: 'Coral', talk: ['Watch yourself. Rook fights dirty.'], cond: (g) => !g.flags.beat_rook },
  ],
};

/* ---------- Map enter hooks ---------- */
DATA.mapEnter = {
  async mossgate(s) { if (a1() === 0) await s.setStage('act1', 1); },
  async sunken_1(s) { if (a1() === 3) await s.setStage('act1', 4); },
};

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async holt(s, npc) {
    const o = { name: 'Ranger Holt' };
    if (!G.party.length) return s.say(["Bramblewood's just past here, and it's thick with Wildmon this season.", "I can't let anyone through without a partner Wildmon. Rules are rules!"], o);
    const tq = s.quest('trainer');
    if (!tq || !tq.done) return s.say(['A partner Wildmon! Good for you.', 'Professor Thorne asked me to keep new trainers out of the forest until they can catch a Wildmon of their own.', 'Catch one on Route 1 and show the Professor. Then come back!'], o);
    await s.say(['The Professor says you are ready. Good!', 'The forest path is clear now. My crew cleared the last of the storm damage this morning.',
      "One thing, though. Some odd folk in grey coats went in at dawn. Called themselves the Hollow Order.", 'If they bother you, come straight back. Off you go!'], o);
    s.set('bramble_open');
    await s.walk(npc.id, 'L');
    s.face(npc.id, 'right');
    s.remove(npc.id); s.spawn(DATA.maps.fernwick.npcs.find((n) => n.id === 'holt2'));
    World.props = World.props.filter((p) => p.type !== 'barrier');
    await s.startQuest('act1'); G.tracked = 'act1';
  },
  async mrsAsh(s) {
    const o = { name: 'Mrs Ashdown' };
    if (s.flag('glade_done')) return s.say(['You met Wren? Oh, I am glad. She writes such long letters about the forest.', 'If you see her again, tell her to eat something. And to come home for tea!'], o);
    return s.say(['Oh! Are you a new trainer? My daughter Wren is about your age.', "She's off studying Wildmon in Bramblewood. She says it's perfectly safe. I do worry, though."], o);
  },
  async seawall(s) {
    const o = { name: 'Builder' };
    return s.say(['Sorry, the coast road to Port Calder is shut. The storm smashed the sea wall.', "We'll have it fixed soon. Go and see the sights up north in the meantime!"], o);
  },
  async gladeEvent(s) {
    const p = s.player(); p.walking = false;
    await s.emote('wren_g', '!');
    await s.say(['Hey! You there! Help me!', 'These Hollow Order creeps are draining the forest\'s Wildmon!'], { name: 'Wren' });
    await s.say(['Another kid? Get lost! The Captain wants every bit of light in this wood.'], { name: 'Order Grunt' });
    const res = await trainerBattle(s, 'grunt1');
    if (res !== 'win') return;
    await s.say(["Tch! The Captain won't like this. I'm out of here!"], { name: 'Order Grunt' });
    await s.walk('grunt_g', 'UUUUU', 1.6); s.remove('grunt_g');
    s.face('wren_g', 'down');
    await s.say(['Phew! Thank you. I am Wren Ashdown, from Fernwick. I am training to be a Ranger.',
      'The Hollow Order has been sneaking around Bramblewood with grey Lanterns. Any Wildmon they catch with one loses its colour.',
      'Look, there is one in the flowers over there. A Fawnlight, gone completely grey. Please look after it if you can.',
      'I am going to follow those grunts north to Mossgate. Here, take these. Ranger supplies.'], { name: 'Wren' });
    await s.give('great_lantern', 3);
    await s.say(['If you are heading to Mossgate, take on Hazel at the Bloom Hall. She is tough, but fair. See you there!'], { name: 'Wren' });
    await s.walk('wren_g', 'UUUUU', 1.6); s.remove('wren_g');
    s.set('glade_done'); Game.dirty = true;
  },
  async greyFawn(s, pr) {
    const q = s.quest('grey');
    const look = { name: 'Fawnlight' };
    if (!q) {
      await s.say(['A Fawnlight lies curled up among the flowers. Its coat has lost all of its colour.', 'It is barely glowing at all, and it is shivering.']);
      await s.say('Fawn...', look);
      await s.startQuest('grey');
      if (s.count('glowcap') >= 3) await s.setStage('grey', 1);
      return s.say(['Glowcaps, the glowing forest mushrooms, are said to comfort tired Wildmon.', 'Maybe there are some growing in Bramblewood?']);
    }
    if (q.stage === 0) return s.say([`The grey Fawnlight is still shivering. (Glowcaps: ${s.count('glowcap')}/3)`]);
    if (q.stage === 1) {
      await s.say(['You hold out the Glowcaps. The Fawnlight sniffs them, then nibbles one... two... three.']);
      s.take('glowcap', 3);
      await s.say(['A faint light flickers in its eyes! But it fades again, as if something is pulling it away.', 'The Fawnlight turns its head to the north-east and whimpers.']);
      return s.setStage('grey', 2);
    }
    if (q.stage === 2) return s.say(['The Fawnlight stares towards the north-east of the forest. Something there is still draining its light.']);
    if (q.stage === 3) {
      await s.say(['With the Siphon Lantern broken, colour floods back into the Fawnlight\'s coat!', 'It springs to its feet, glowing brighter than ever.']);
      await s.say('Fawn! Fawn!', look);
      await s.say(['The Fawnlight nuzzles your hand. It wants to come with you!']);
      const m = Mon.create('fawnlight', 12, { lustre: false, mark: null, bond: 140, potFloor: 11, met: { map: 'Bramblewood', lv: 12, at: Date.now() } });
      m.pot.hp = Math.max(m.pot.hp, 13); m.pot.spa = Math.max(m.pot.spa, 13); m.hp = Mon.maxHp(m);
      const d = G.dex.fawnlight || (G.dex.fawnlight = {}); d.seen = 1; d.caught = 1;
      if (G.party.length < 6) { G.party.push(m); await s.say(`Fawnlight joined your team!`, { sfx: 'caught' }); } else { G.box.push(m); await s.say(`Fawnlight was sent to storage.`, { sfx: 'caught' }); }
      s.set('grey_done'); World.props = World.props.filter((x) => x !== pr);
      await s.completeQuest('grey'); s.achieve('green_thumb'); s.rep(10);
    }
  },
  async glowcap(s, pr) {
    s.set('glowcap_' + pr.id); World.props = World.props.filter((x) => x !== pr);
    s.addItem('glowcap');
    await s.say(`${G.name} picked a Glowcap! It glows softly in your hand.`, { sfx: 'item' });
    const q = s.quest('grey');
    if (q && q.stage === 0 && s.count('glowcap') >= 3) await s.setStage('grey', 1);
  },
  async poacher(s, npc) {
    const o = { name: 'Order Grunt' };
    const q = s.quest('grey');
    if (!q || q.stage < 2) return s.say(['Scram, kid. Nothing to see here. Just... picking mushrooms.'], o);
    if (q.stage > 2) return s.say('...', o);
    await s.say(DATA.trainers.grunt2.intro, o);
    const res = await trainerBattle(s, 'grunt2');
    if (res !== 'win') return;
    await s.say(['My Siphon Lantern! You cracked it!', 'Fine. Keep your glowing deer. I am going back to the ship.'], o);
    await s.give('siphon_lantern');
    await s.setStage('grey', 3);
    await s.walk(npc.id, 'LLLL', 1.6); s.remove(npc.id); s.set('poacher_gone');
  },
  async hallGuide(s) {
    const o = { name: 'Hall Guide' };
    const bloom = World.id === 'moss_hall';
    if (bloom && !s.flag('beat_hazel')) return s.say(['Welcome, challenger! Hazel is waiting at the top of the Bloom Hall.', 'Step on a red switch to swap which hedges are open. Every switch flips them all!', 'Hazel uses Grass and Poison types. Fire, Air and Poison moves will serve you well.'], o);
    if (!bloom && !s.flag('beat_coral')) return s.say(['Welcome to the Tide Hall! The currents carry you until something stops you.', 'Watch the arrows and plan your route. Coral is at the far end.', 'Coral uses Water types. Electric and Grass moves will help you most.'], o);
    return s.say(['What a battle! You are a credit to the Hall.'], o);
  },
  async hazel(s, npc) {
    const o = { name: 'Hazel' };
    if (s.flag('beat_hazel')) return s.say(['The Brush Hook cuts thorny bushes. Bramblewood has a few hidden groves worth exploring.', 'Grow steadily, {player}. Roots first, then branches.'], o);
    await s.say(['Welcome to the Bloom Hall! I am Hazel, the Hall Master.', 'You got through my hedges, so you can plan ahead. Good.',
      'In a garden, nothing worth growing grows quickly. Let\'s see how deep your roots go!'], o);
    if (a1() === 0) await s.setStage('act1', 1);
    const res = await bossBattle(s, 'hazel');
    if (res !== 'win') return;
    s.achieve('puzzler');
    await s.say(['Well grown, truly well grown. You have earned this.'], o);
    await s.badge('bloom');
    await s.say(['And take this Brush Hook. It cuts through thorny bushes, so you can reach places other trainers miss.'], o);
    await s.give('brush_hook');
    await s.say(['One more thing: a Move Scroll for Deep Sap. It heals your Wildmon while it hits.'], o);
    await s.give('scroll_drain');
    await s.wait(300); Sound.sfx('door');
    const w = s.spawn({ id: 'wren_h', x: 8, y: 3, dir: 'left', look: 'wren', name: 'Wren' });
    await s.emote('wren_h', '!');
    await s.say(['{player}! Hazel! Sorry to barge in!', 'The grunts from Bramblewood did not stay in Mossgate. They headed for the coast, to Port Calder.',
      'Coral, the Tide Hall Master there, has been chasing the Order all week. She thinks their ship is hiding near the old Sunken Lighthouse.',
      'And good news: the coast road from Emberlow, Route 2, has just reopened!'], { name: 'Wren' });
    await s.say(['Go, both of you. Coral could use the help, and Port Calder has a Badge waiting.'], o);
    await s.say(['I will go ahead and keep an eye on things. Meet me in Port Calder!'], { name: 'Wren' });
    s.remove(w.id);
    s.set('route2_open'); await s.setStage('act1', 2);
    s.achieve('puzzler');
  },
  async shop5(s, npc) {
    const id = npc.def.shop;
    return UI.shop(DATA.shops[id], s.flag('greet_' + id) ? 'Welcome back! What can I get you?' : (s.set('greet_' + id), 'Welcome! We have Great Lanterns and Calm Incense in stock.'));
  },
  async mossGran(s) {
    const o = { name: 'Granny Fern' };
    if (!s.flag('gift_incense')) {
      s.set('gift_incense');
      await s.say(['A young trainer! Off through the woods, are you?', 'Take some of my Calm Incense. One whiff and wild Wildmon leave you be for a good long walk.'], o);
      return s.give('calm_incense', 3);
    }
    return s.say(['My late husband trained at the Bloom Hall, back when Hazel was a little girl.', 'She used to hide in the hedges and jump out at challengers. Some things never change!'], o);
  },
  async glimKid(s) {
    const o = { name: 'Toby' };
    if (s.flag('glim_done')) return s.say(['Glimwig glows even brighter than in my drawings! Thanks again!'], o);
    if (G.party.some((m) => m.sp === 'glimwig' || m.sp === 'beamwyrm')) {
      s.set('glim_done');
      await s.say(['Is that... a real Glimwig?! It is glowing! It is so pretty!', 'You have to have this. It is my best thing ever.'], o);
      return s.give('great_lantern', 5);
    }
    return s.say(['I draw Glimwig every day, but I have never seen a real one.', 'They only come out at night in Bramblewood. Could you show me one? Please?'], o);
  },
  async kit2(s) {
    const o = { name: 'Kit' };
    if (s.flag('beat_kit2')) return;
    const p = s.player(); p.walking = false;
    await s.emote('kit', '!');
    const k = s.ent('kit'); if (k) { const steps = Math.max(0, p.x - k.x - 1); if (steps && p.y === k.y) await s.walk('kit', 'R'.repeat(steps)); s.facePlayer(k); }
    await s.say(DATA.trainers.kit2.intro, o);
    const res = await trainerBattle(s, 'kit2', { noWhiteout: true });
    if (res !== 'win') { s.set('beat_kit2'); await s.say(['Ha! See? Told you.', 'Better luck next time, {player}. I am off to Port Calder for Badge number two!'], o); }
    else await s.say(['Okay, okay. You are good. Annoyingly good.', 'The Professor says the Hollow Order is up to something in Port Calder. Not that I care.', 'I am just going there for the Badge. Obviously. See ya!'], o);
    s.set('beat_kit2');
    await s.walk('kit', 'LLLLLL', 1.8); s.remove('kit');
  },
  async tideDoor(s) {
    const o = { name: 'Hall Guide' };
    if (a1() < 3) {
      await s.say(['Sorry, the Tide Hall is closed today.', 'Hall Master Coral went out to the Sunken Lighthouse at dawn. She thinks the Hollow Order is hiding there.',
        'She went alone... and she has not come back yet. I am getting worried.'], o);
      if (a1() === 2) { await s.setStage('act1', 3); s.set('pier_open'); s.remove('pier1'); s.spawn(DATA.maps.port_calder.npcs.find((n) => n.id === 'pier2')); }
      return;
    }
    return s.say(['Coral is still out at the Sunken Lighthouse. The pier is on the east side of the beach.'], o);
  },
  async pierSailor(s) {
    const o = { name: 'Sailor' };
    if (!s.flag('pier_open')) return s.say(['Sorry, nobody goes out on the pier. That old lighthouse could fall down any day.', 'Besides, I have seen grey-coat folk going in and out at night. Nope. Not going near it.'], o);
    return s.say(['Coral went out there alone. If you are going after her, be careful!', 'The lighthouse is just across the pier.'], o);
  },
  async wrenSunken(s) {
    const o = { name: 'Wren' };
    if (!s.flag('wren_sunk')) { s.set('wren_sunk'); await s.say(['{player}! You made it. The Order\'s ship must be moored on the far side.', 'I am going to stay here and guard the way out. Come back to me if your team needs patching up.'], o); }
    else await s.say(['Let me patch up your team. Ranger training comes in handy!'], o);
    await Game.fadeOut(250); await s.healParty(); await s.wait(400); await Game.fadeIn(250);
    await s.say(['All better! Go and find Coral!'], o);
  },
  async rookEvent(s) {
    const p = s.player(); p.walking = false;
    const o = { name: 'Captain Rook' };
    s.face('rook', 'down'); await s.emote('rook', '!');
    await s.say(['Well, well. The brat who has been knocking over my crew all over Aldermere.', 'I am Captain Rook of the Hollow Order.',
      'Coral thought she could stop us alone. Now her precious Wildmon are fuelling my Siphon. Their light belongs to the Order now.'], o);
    await s.say(['{player}, careful! He beat me with dirty tricks. Do not let him do the same to you!'], { name: 'Coral' });
    await s.say(['Enough talk. Let me show you why they call me Captain!'], o);
    const res = await bossBattle(s, 'rook');
    if (res !== 'win') return;
    await s.say(['Bah! Beaten by a child with a Badge...', 'Fine. Keep your rusty tower. We already have what we came for.', 'The Order will light the whole Sound soon enough. Ha!'], o);
    await s.say('Captain Rook threw down a smoke bomb!'); Sound.sfx('flee');
    await Game.fadeOut(200); s.remove('rook'); await Game.fadeIn(300);
    await s.say('He dropped something as he ran!');
    await s.give('sea_chart');
    s.achieve('order_foiled');
    s.face('coral', 'left');
    await s.say(['Hah! Look at him run!', 'Thank you, {player}. My crew was in that cage. They are free, thanks to you.',
      'That chart he dropped has one island circled in red... I will need time to work out what it means.',
      'But first, you came to Port Calder for a Badge, did you not? Meet me at the Tide Hall. And do not expect me to go easy on you!'], { name: 'Coral' });
    await Game.fadeOut(300); s.remove('coral'); s.set('coral_back'); await Game.fadeIn(300);
    await s.setStage('act1', 5);
  },
  async coral(s) {
    const o = { name: 'Coral' };
    if (s.flag('beat_coral')) return s.say(['The ferries will run again once the harbour patrol has swept the Sound.', 'I am studying Rook\'s chart. When I know where the Order is going, you will be the first to hear.'], o);
    await s.say(['Ahoy, {player}! You found your way through my currents. Not bad at all.', 'I am Coral, Hall Master of the Tide Hall.',
      'The sea does not care how strong you are. It only cares whether you can read it. Let\'s see if you can read me!'], o);
    const res = await bossBattle(s, 'coral');
    if (res !== 'win') return;
    s.achieve('puzzler');
    await s.say(['Hah! You sailed right through my fleet.', 'Here, the Tide Badge. You have more than earned it.'], o);
    await s.badge('tide');
    await s.say(['And a Move Scroll for Froth Stream. Water moves that slow foes down are a sailor\'s best friend.'], o);
    await s.give('scroll_bubble');
    await s.say(['One last thing. Thank you for what you did at the lighthouse.', 'Professor Thorne should hear about all this. And Wren too.'], o);
    if (!s.quest('act1').done) {
      await s.completeQuest('act1');
      await s.give('super_potion', 3); await s.give('scroll_tideslam');
      await s.say(['Act I of your journey is complete!', 'Route 3, west of Port Calder, leads to Voltara. Onward!'], { sign: true });
    }
  },
  async oldSalt(s) {
    const o = { name: 'Old Salt' };
    if (!s.flag('salt_gift')) {
      s.set('salt_gift');
      await s.say(['Fifty years I sailed the Sound. Never seen it this quiet.', 'Here, take these. A sailor always shares his Lanterns with a friend in need.'], o);
      return s.give('great_lantern', 2);
    }
    return s.say(['The Sunken Lighthouse went under in the big storm when I was a lad.', 'Folk say the Beacons and lighthouses were built to keep something asleep out there. Just old sailors\' tales, mind.'], o);
  },
  async ferryClerk(s) {
    const o = { name: 'Ferry Clerk' };
    if (s.flag('beat_coral')) return s.say(['The harbour patrol is sweeping the Sound for Order ships.', 'Once it is safe, ferries will run to Glasswater City again. Check back soon!'], o);
    return s.say(['Sorry, all ferries are cancelled.', 'A ship with grey sails has been seen out in the Sound. Until the Tide Hall says it is safe, nobody sails.'], o);
  },
});
{ const peb = DATA.maps.route1.items.find((i) => i.id === 'pebble'); if (peb) delete peb.locked; }
