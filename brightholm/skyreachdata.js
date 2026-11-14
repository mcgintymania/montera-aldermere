'use strict';
/* =====================================================================
   SKYREACH DATA — the Gullwind Cliffs, Skyreach, the Skyreach Beacon,
   the Gale Hall and the Signal Tower mirror puzzle.
   ===================================================================== */

Object.assign(DATA.tiles, {
  'u': { t: 'cliff', solid: true, dyn: true, climb: true, text: 'A sheer rock face. With the right gear, you could climb it.' },
  '*': { t: 'sky', solid: true, text: 'Nothing but sky. A long, long way down.' },
  '^': { t: 'wind_u', slide: 'up' },
  ':': { t: 'wind_d', slide: 'down' },
  '<': { t: 'wind_l', slide: 'left' },
  '>': { t: 'wind_r', slide: 'right' },
  '$': { t: 'cliffwall', solid: true, text: 'A sheer wall of rock. There are no handholds here.' },
  '+': { t: 'snow' },
  '=': { t: 'stonefloor' },
});

/* ---------- Moves ---------- */
Object.assign(DATA.moves, {
  gale_burst: { name: 'Gale Burst', type: 'air', cat: 'spec', pow: 85, acc: 95, pp: 10, desc: 'Hurls a howling blast of wind at the foe.' },
  updraft: { name: 'Updraft', type: 'air', cat: 'status', acc: null, pp: 15, eff: 'self', st: { atk: 1, spe: 1 }, desc: 'Rides a rising wind. Raises Attack and Speed.' },
  crag_charge: { name: 'Crag Charge', type: 'rock', cat: 'phys', pow: 85, acc: 90, pp: 10, desc: 'Charges headlong like a falling boulder.' },
  thunder_fang: { name: 'Volt Fang', type: 'electric', cat: 'phys', pow: 65, acc: 95, pp: 15, eff: 'par', ch: 10, desc: 'Bites with crackling fangs. May paralyse.' },
  frost_breath: { name: 'Chill Breath', type: 'ice', cat: 'spec', pow: 60, acc: 95, pp: 15, crit: 1, desc: 'Breathes a freezing mist. Often lands a clean strike.' },
  cloud_veil: { name: 'Cloud Veil', type: 'light', cat: 'status', acc: null, pp: 15, eff: 'self', st: { def: 1, spd: 1 }, desc: 'Wraps itself in soft cloud. Raises Defence and Resolve.' },
});

/* ---------- Species #104–123 ---------- */
Object.assign(DATA.species, {
  pebwing: { n: 104, name: 'Gravlark', types: ['rock', 'air'], base: [50, 62, 66, 30, 40, 52], growth: 'mslow', catch: 160, exp: 66, rarity: 'common', line: 'pebwing',
    evo: [{ to: 'cragrook', lv: 34 }], moves: [[1, 'peck'], [1, 'harden'], [10, 'rock_throw'], [16, 'wing_attack'], [22, 'rock_tomb'], [28, 'rock_slide'], [32, 'drill_peck']], traits: ['sturdy', 'keen_eye'],
    habitat: 'Gullwind Cliffs', desc: 'Its wings are crusted with grit from the cliff face. It drops stones on anything that comes too near its nest.' },
  cragrook: { n: 105, name: 'Stonecrow', types: ['rock', 'air'], base: [76, 98, 96, 44, 60, 78], growth: 'mslow', catch: 60, exp: 178, rarity: 'common', line: 'pebwing',
    evo: [], moves: [[1, 'peck'], [1, 'harden'], [10, 'rock_throw'], [16, 'wing_attack'], [22, 'rock_tomb'], [28, 'rock_slide'], [32, 'drill_peck'], [34, 'crag_charge'], [42, 'dive_bomb']], traits: ['sturdy', 'grit'],
    habitat: 'Evolves from Gravlark', desc: 'Its feathers are as hard as slate. A Stonecrow can sit through a storm on the bare cliff without blinking.' },
  puffwhirl: { n: 106, name: 'Puffwhirl', types: ['air'], base: [48, 36, 40, 60, 50, 70], growth: 'mfast', catch: 170, exp: 62, rarity: 'common', line: 'puffwhirl',
    evo: [{ to: 'cyclonix', lv: 36 }], moves: [[1, 'gust'], [1, 'growl'], [9, 'swift_step'], [15, 'wing_attack'], [21, 'air_slash'], [28, 'updraft'], [33, 'gale_burst']], traits: ['floating', 'keen_eye'],
    habitat: 'Gullwind Cliffs; Skyreach', desc: 'A little spinning knot of wind. It rides the updrafts all day and naps inside clouds.' },
  cyclonix: { n: 107, name: 'Cyclonix', types: ['air'], base: [72, 60, 64, 102, 76, 106], growth: 'mfast', catch: 50, exp: 182, rarity: 'uncommon', line: 'puffwhirl',
    evo: [], moves: [[1, 'gust'], [1, 'growl'], [9, 'swift_step'], [15, 'wing_attack'], [21, 'air_slash'], [28, 'updraft'], [33, 'gale_burst'], [44, 'thunderhead']], traits: ['floating', 'static'],
    habitat: 'Evolves from Puffwhirl', desc: 'A towering whirlwind with a calm eye at its centre. Pilots read its spin to forecast the weather.' },
  frostkit: { n: 108, name: 'Icekit', types: ['ice'], base: [46, 52, 42, 50, 46, 62], growth: 'mslow', catch: 120, exp: 64, rarity: 'uncommon', line: 'frostkit',
    evo: [{ to: 'rimefox', lv: 34 }], moves: [[1, 'scratch'], [1, 'tail_whip'], [8, 'powder_snow'], [14, 'bite'], [20, 'ice_fang'], [26, 'frost_breath'], [32, 'hailstorm']], traits: ['thick_fur', 'run_away'],
    habitat: 'Gullwind Cliffs (summit)', desc: 'It came down from the frozen peaks to the north. Its breath leaves little curls of frost in the air.' },
  rimefox: { n: 109, name: 'Rimevixen', types: ['ice'], base: [70, 82, 64, 86, 72, 96], growth: 'mslow', catch: 45, exp: 180, rarity: 'uncommon', line: 'frostkit',
    evo: [], moves: [[1, 'scratch'], [1, 'tail_whip'], [8, 'powder_snow'], [14, 'bite'], [20, 'ice_fang'], [26, 'frost_breath'], [32, 'hailstorm'], [34, 'frost_beam'], [42, 'crunch']], traits: ['thick_fur', 'keen_eye'],
    habitat: 'Evolves from Icekit', desc: 'A sleek white fox wrapped in a mantle of ice crystals. Its tails trail snow wherever it runs.' },
  goatlet: { n: 110, name: 'Kidram', types: ['rock', 'fighting'], base: [56, 66, 62, 26, 40, 50], growth: 'mslow', catch: 160, exp: 64, rarity: 'common', line: 'goatlet',
    evo: [{ to: 'crestram', lv: 33 }], moves: [[1, 'tackle'], [1, 'leer'], [9, 'rock_smash'], [15, 'headbutt'], [21, 'rock_tomb'], [27, 'bulk_up'], [31, 'rock_slide']], traits: ['sturdy', 'grit'],
    habitat: 'Gullwind Cliffs', desc: 'It hops up ledges no wider than a coin. Climbers follow Kidram trails to find the safest way up.' },
  crestram: { n: 111, name: 'Crestram', types: ['rock', 'fighting'], base: [86, 104, 94, 40, 60, 72], growth: 'mslow', catch: 55, exp: 182, rarity: 'common', line: 'goatlet',
    evo: [], moves: [[1, 'tackle'], [1, 'leer'], [9, 'rock_smash'], [15, 'headbutt'], [21, 'rock_tomb'], [27, 'bulk_up'], [31, 'rock_slide'], [33, 'crag_charge'], [40, 'focus_strike']], traits: ['sturdy', 'glare'],
    habitat: 'Evolves from Kidram', desc: 'Two Crestram clashing horns on the clifftop sounds like a thunderclap. The winner gets the best ledge.' },
  lichenlo: { n: 112, name: 'Lichenlo', types: ['grass', 'rock'], base: [60, 40, 70, 46, 64, 22], growth: 'mslow', catch: 170, exp: 62, rarity: 'common', line: 'lichenlo',
    evo: [{ to: 'mossgaunt', lv: 32 }], moves: [[1, 'absorb'], [1, 'harden'], [8, 'rock_throw'], [14, 'mega_drain'], [20, 'rootwall'], [26, 'rock_tomb'], [30, 'solar_leaf']], traits: ['old_growth', 'sturdy'],
    habitat: 'Gullwind Cliffs', desc: 'A pebble wearing a coat of lichen. It can sit so still for so long that birds build nests on it.' },
  mossgaunt: { n: 113, name: 'Lichenhold', types: ['grass', 'rock'], base: [90, 70, 104, 66, 92, 34], growth: 'mslow', catch: 50, exp: 176, rarity: 'common', line: 'lichenlo',
    evo: [], moves: [[1, 'absorb'], [1, 'harden'], [8, 'rock_throw'], [14, 'mega_drain'], [20, 'rootwall'], [26, 'rock_tomb'], [30, 'solar_leaf'], [32, 'rock_slide'], [40, 'body_slam']], traits: ['old_growth', 'iron_hide'],
    habitat: 'Evolves from Lichenlo', desc: 'A walking boulder garden. Small flowers bloom on its back every spring, whether it likes it or not.' },
  stormpup: { n: 114, name: 'Stormkin', types: ['electric'], base: [48, 58, 40, 52, 40, 72], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'stormpup',
    evo: [{ to: 'thundermane', lv: 36 }], moves: [[1, 'tackle'], [1, 'thundershock'], [9, 'quick_attack'], [15, 'spark'], [21, 'bite'], [27, 'thunder_fang'], [33, 'thunder_wave']], traits: ['static', 'run_away'],
    habitat: 'Gullwind Cliffs (in storms)', desc: 'It howls at thunderclouds and chases lightning across the clifftops. Its fur stands on end before a storm.' },
  thundermane: { n: 115, name: 'Thundermane', types: ['electric', 'air'], base: [80, 96, 66, 88, 66, 108], growth: 'mslow', catch: 40, exp: 190, rarity: 'uncommon', line: 'stormpup',
    evo: [], moves: [[1, 'tackle'], [1, 'thundershock'], [9, 'quick_attack'], [15, 'spark'], [21, 'bite'], [27, 'thunder_fang'], [33, 'thunder_wave'], [36, 'gull_dive'], [44, 'thunderbolt']], traits: ['static', 'keen_eye'],
    habitat: 'Evolves from Stormkin', desc: 'It runs on the wind itself, mane crackling. Old pilots say a Thundermane sighting means a storm within the hour.' },
  hootlet: { n: 116, name: 'Hootlet', types: ['dark', 'air'], base: [52, 48, 44, 58, 54, 56], growth: 'mslow', catch: 150, exp: 64, rarity: 'common', line: 'hootlet',
    evo: [{ to: 'gloomowl', lv: 34 }], moves: [[1, 'peck'], [1, 'hypnosis'], [9, 'gust'], [15, 'shadow_swipe'], [21, 'wing_attack'], [27, 'hex_gaze'], [32, 'air_slash']], traits: ['night_eyes', 'keen_eye'],
    habitat: 'Gullwind Cliffs; Skyreach (night)', desc: 'It sleeps in cliff hollows by day. At dusk its huge eyes open and it glides out without a sound.' },
  gloomowl: { n: 117, name: 'Gloomowl', types: ['dark', 'air'], base: [84, 72, 70, 92, 84, 82], growth: 'mslow', catch: 45, exp: 182, rarity: 'common', line: 'hootlet',
    evo: [], moves: [[1, 'peck'], [1, 'hypnosis'], [9, 'gust'], [15, 'shadow_swipe'], [21, 'wing_attack'], [27, 'hex_gaze'], [32, 'air_slash'], [34, 'crunch'], [44, 'eclipse_pulse']], traits: ['night_eyes', 'glare'],
    habitat: 'Evolves from Hootlet', desc: 'Its feathers soak up moonlight. A Gloomowl watching from the dark is said to know every secret on the mountain.' },
  cloudmallow: { n: 118, name: 'Cloudmallow', types: ['light', 'air'], base: [70, 30, 56, 56, 70, 38], growth: 'fast', catch: 150, exp: 64, rarity: 'uncommon', line: 'cloudmallow',
    evo: [{ to: 'nimbusoft', lv: 35 }], moves: [[1, 'glimmer'], [1, 'mend'], [9, 'gust'], [15, 'dazzle'], [21, 'radiant_pulse'], [27, 'cloud_veil'], [33, 'air_slash']], traits: ['floating', 'radiance'],
    habitat: 'Skyreach; Gullwind Cliffs', desc: 'A soft little cloud that drifts down to Skyreach on calm mornings. It smells faintly of rain.' },
  nimbusoft: { n: 119, name: 'Nimbusoft', types: ['light', 'air'], base: [104, 48, 86, 84, 104, 54], growth: 'fast', catch: 45, exp: 176, rarity: 'uncommon', line: 'cloudmallow',
    evo: [], moves: [[1, 'glimmer'], [1, 'mend'], [9, 'gust'], [15, 'dazzle'], [21, 'radiant_pulse'], [27, 'cloud_veil'], [33, 'air_slash'], [35, 'dazzling_ray'], [44, 'gale_burst']], traits: ['floating', 'radiance'],
    habitat: 'Evolves from Cloudmallow', desc: 'A great rolling thundercloud with a gentle heart. It shades tired travellers on hot days.' },
  kindrake: { n: 120, name: 'Kindrake', types: ['fire', 'air'], base: [52, 62, 46, 58, 44, 64], growth: 'slow', catch: 45, exp: 70, rarity: 'rare', line: 'kindrake',
    evo: [{ to: 'pyrowyrm', lv: 38 }], moves: [[1, 'ember'], [1, 'leer'], [9, 'gust'], [15, 'fire_fang'], [21, 'wing_attack'], [27, 'flame_burst'], [33, 'air_slash']], traits: ['kindling', 'keen_eye'],
    habitat: 'Gullwind Cliffs (rare)', desc: 'A young drake that nests in warm vents high on the cliffs. It practises flying by leaping off ledges and hoping.' },
  pyrowyrm: { n: 121, name: 'Pyrowyrm', types: ['fire', 'air'], base: [82, 104, 74, 96, 72, 94], growth: 'slow', catch: 25, exp: 210, rarity: 'rare', line: 'kindrake',
    evo: [], moves: [[1, 'ember'], [1, 'leer'], [9, 'gust'], [15, 'fire_fang'], [21, 'wing_attack'], [27, 'flame_burst'], [33, 'air_slash'], [38, 'flamethrower'], [46, 'dive_bomb']], traits: ['kindling', 'glare'],
    habitat: 'Evolves from Kindrake', desc: 'It circles the peaks on wings of hot air. A Pyrowyrm\'s roar can be heard across three valleys.' },
  echolith: { n: 122, name: 'Resonite', types: ['rock', 'psychic'], base: [80, 50, 100, 90, 100, 40], growth: 'slow', catch: 30, exp: 180, rarity: 'rare', line: 'echolith',
    evo: [], moves: [[1, 'confusion'], [1, 'harden'], [12, 'rock_throw'], [20, 'psybeam'], [28, 'rock_tomb'], [34, 'focus_mind'], [40, 'crystal_beam'], [48, 'psy_storm']], traits: ['sturdy', 'radiance'],
    habitat: 'Skyreach standing stones', desc: 'A standing stone that hums when the wind blows through it. Shout at one and it answers in your own voice, a moment late.' },
  snowpip: { n: 123, name: 'Snowpip', types: ['ice', 'air'], base: [50, 44, 46, 64, 56, 80], growth: 'mfast', catch: 90, exp: 140, rarity: 'rare', line: 'snowpip',
    evo: [], moves: [[1, 'peck'], [1, 'powder_snow'], [10, 'gust'], [18, 'ice_fang'], [26, 'frost_breath'], [34, 'air_slash'], [42, 'frost_beam']], traits: ['thick_fur', 'keen_eye'],
    habitat: 'Gullwind Cliffs (summit)', desc: 'A round little snowbird that only comes south in the coldest weeks. Seeing one is meant to bring good luck.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { pebwing: 'iron_hide', puffwhirl: 'static', frostkit: 'keen_eye', goatlet: 'iron_hide', lichenlo: 'thick_fur', stormpup: 'grit', hootlet: 'glare', cloudmallow: 'old_growth', kindrake: 'grit', echolith: 'iron_hide', snowpip: 'floating' });

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  gale_glider: { name: 'Gale Glider', pocket: 'key', use: 'glider', desc: 'A folding glider from Hall Master Aerin. Use it outdoors to fly to any town with a Hearthhouse that you have already visited.' },
  beacon_core: { name: 'Beacon Core', pocket: 'key', desc: 'Not yours to keep.' },
  scroll_galeburst: { name: 'Scroll: Gale Burst', pocket: 'items', scroll: 'gale_burst', price: 6000, sell: 2000, desc: 'A Move Scroll. Teaches Gale Burst to a Wildmon that can use Air moves.' },
  scroll_dazzlingray: { name: 'Scroll: Dazzling Ray', pocket: 'items', scroll: 'dazzling_ray', sell: 2000, desc: 'A Move Scroll. Teaches Dazzling Ray to a Wildmon that can use Light moves.' },
  scroll_cragcharge: { name: 'Scroll: Crag Charge', pocket: 'items', scroll: 'crag_charge', price: 5000, sell: 1800, desc: 'A Move Scroll. Teaches Crag Charge to a Wildmon that can use Rock moves.' },
});
Object.assign(DATA.scrolls, { scroll_galeburst: 'gale_burst', scroll_dazzlingray: 'dazzling_ray', scroll_cragcharge: 'crag_charge' });

/* ---------- Shops ---------- */
DATA.shops.skyreach = ['great_lantern', 'bright_lantern', 'swift_lantern', 'dusk_lantern', 'hyper_potion', 'max_potion', 'full_heal', 'calm_incense', 'scroll_galeburst', 'scroll_cragcharge'];

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  aerin: { hair: '#e8a040', skin: '#e8c0a0', shirt: '#3a8ad0', pants: '#e8e4d8', shoes: '#5a3a20', hat: '#c84a3a' },
  climber: { hair: '#6a4a2a', skin: '#e8b890', shirt: '#d86a2a', pants: '#4a5a3a', shoes: '#3a2a1a', hat: '#e8c040' },
  birder: { hair: '#3a2a1a', skin: '#c89070', shirt: '#6a8a4a', pants: '#8a7a5a', shoes: '#3a2a1a', hat: '#5a6a3a' },
  pilot: { hair: '#2a2a2a', skin: '#e8c0a0', shirt: '#4a7ab8', pants: '#3a3a4a', shoes: '#1a1a1a', hat: '#8a5a2a' },
  keeper: { hair: '#c8c8c8', skin: '#e0b090', shirt: '#2a4a7a', pants: '#2a2a3a', shoes: '#1a1a1a', hat: '#2a4a7a' },
});

/* ---------- Trainers ---------- */
Object.assign(DATA.trainers, {
  gc1: { cls: 'Climber', name: 'Tamsin', look: 'climber', team: [['goatlet', 33], ['pebwing', 34]], prize: 36, ai: 'tactical',
    intro: 'Nobody gets past this ledge without a battle. Climber\'s rules!', lose: 'Rope burn!', after: 'Use the Climbing Gear on the rock faces. Look for the scuffed stone.' },
  gc2: { cls: 'Bird Keeper', name: 'Ossian', look: 'birder', team: [['roofhawk', 34], ['puffwhirl', 34], ['gustfinch', 34]], prize: 36, ai: 'tactical',
    intro: 'My birds rule these cliffs. Let\'s see yours fly!', lose: 'Grounded...', after: 'The updrafts here are perfect. My birds never want to land.' },
  gc3: { cls: 'Climber', name: 'Hob', look: 'climber', team: [['lichenlo', 34], ['goatlet', 35]], prize: 37, ai: 'tactical',
    intro: 'Halfway up! Take a breather... with a battle!', lose: 'Should have stuck to walking.', after: 'Skyreach is right at the top. Best view in Aldermere.' },
  gc4: { cls: 'Birdwatcher', name: 'Wynne', look: 'birder', team: [['hootlet', 34], ['cloudmallow', 35]], prize: 37, ai: 'tactical',
    intro: 'Shh! You will scare the... oh, too late. Battle!', lose: 'Well, they have all flown off now.', after: 'Some people say a storm bird lives above the cliffs. I have only ever heard its thunder.' },
  og1: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['scraprat', 34], ['corvane', 34]], prize: 36, ai: 'tactical', music: 'order',
    intro: 'The cliff path is closed. Order business.', lose: 'Two of them?! Not fair!', after: 'The Admins are up at the Beacon. You will never get past them.' },
  og2: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['tombwing', 34], ['hexcat', 33]], prize: 36, ai: 'tactical', music: 'order',
    intro: 'Hah! Two kids? We will blow you right off the cliff!', lose: 'We got blown off the cliff...', after: 'This wind is awful. I hate Skyreach.' },
  og3: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['dynacoil', 35], ['hexcat', 35]], prize: 38, ai: 'tactical', music: 'order',
    intro: 'Nobody goes up the Beacon while the Admins are working!', lose: 'Ugh. Go on, then. They will finish you off.', after: 'The Director wants that Core. And he always gets what he wants.' },
  og4: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['scraprat', 35], ['tombwing', 35]], prize: 38, ai: 'tactical', music: 'order',
    intro: 'Stop right there! The Beacon is Order property now.', lose: 'Property dispute lost.', after: '...' },
  sable2: { cls: 'Admin', name: 'Sable', look: 'sable', team: [['wraithtide', 36], ['nightprowl', 37], ['corvane', 36]], prize: 90, ai: 'expert', pot: 7, music: 'battle_master',
    intro: 'Sable', lose: 'Again?!', after: '' },
  corvin2: { cls: 'Admin', name: 'Corvin', look: 'corvin', team: [['scraprat', 36], ['tombwing', 37], ['dynacoil', 36]], prize: 90, ai: 'expert', pot: 7, music: 'battle_master',
    intro: 'Corvin', lose: 'The numbers lied.', after: '' },
  gh1: { cls: 'Skydiver', name: 'Nell', look: 'pilot', team: [['puffwhirl', 35], ['gustfinch', 35]], prize: 38, ai: 'tactical',
    intro: 'Caught you on the updraft! Battle time!', lose: 'Freefall!', after: 'The winds only blow one way. Think before you jump on!' },
  gh2: { cls: 'Skydiver', name: 'Rafe', look: 'pilot', team: [['pebwing', 35], ['roofhawk', 36]], prize: 39, ai: 'tactical',
    intro: 'You made it this far? Not bad. But no further!', lose: 'Wind\'s changed...', after: 'The left side of the Hall is a dead end. Ask me how I know.' },
  gh3: { cls: 'Skydiver', name: 'Isla', look: 'pilot', team: [['hootlet', 36], ['squallgull', 36], ['cloudmallow', 36]], prize: 40, ai: 'tactical',
    intro: 'Last one before Aerin! Make it count!', lose: 'Go get her!', after: 'Aerin\'s Wildmon are FAST. Slow them down or hit them hard first.' },
  aerin: { cls: 'Hall Master', name: 'Aerin', look: 'aerin', team: [['cyclonix', 37], ['thunderwing', 36], ['skymanta', 37], ['tempestral', 39, 'swift_feather']], prize: 130, ai: 'expert', items: { hyper_potion: 2 }, pot: 8, music: 'battle_master',
    intro: 'Aerin', lose: 'What a ride! I haven\'t been knocked out of the sky like that in years!', after: '' },
});

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  gullwind: {
    grass: {
      day: [['pebwing', 24, 33, 36], ['goatlet', 20, 33, 36], ['puffwhirl', 18, 33, 36], ['lichenlo', 14, 33, 35], ['cloudmallow', 8, 34, 36], ['stormpup', 8, 34, 36], ['kindrake', 4, 34, 36], ['rooftik', 4, 33, 35]],
      night: [['hootlet', 26, 33, 36], ['pebwing', 18, 33, 36], ['goatlet', 16, 33, 36], ['puffwhirl', 14, 33, 36], ['stormpup', 12, 34, 36], ['frostkit', 10, 34, 36], ['kindrake', 4, 34, 36]],
    },
  },
  gullwind_top: {
    grass: {
      day: [['frostkit', 22, 35, 37], ['goatlet', 18, 35, 37], ['puffwhirl', 18, 35, 37], ['cloudmallow', 14, 35, 37], ['stormpup', 12, 35, 37], ['snowpip', 8, 35, 37], ['kindrake', 8, 35, 37]],
      night: [['hootlet', 24, 35, 37], ['frostkit', 22, 35, 37], ['stormpup', 18, 35, 37], ['snowpip', 14, 35, 37], ['goatlet', 14, 35, 37], ['kindrake', 8, 35, 37]],
    },
  },
  skyreach: {
    grass: {
      day: [['cloudmallow', 30, 35, 38], ['puffwhirl', 26, 35, 38], ['echolith', 6, 36, 38], ['rooftik', 22, 35, 37], ['pebwing', 16, 35, 37]],
      night: [['hootlet', 34, 35, 38], ['cloudmallow', 24, 35, 38], ['echolith', 8, 36, 38], ['puffwhirl', 20, 35, 38], ['stormpup', 14, 35, 38]],
    },
  },
});

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  cliffs: { bpm: 132, lead: 'square', tr: 0, chords: ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A'],
    melody: 'D5:2 F#5:2 A5:4 A5:2 B5:2 C#6:4 B5:2 A5:2 F#5:4 G5:2 A5:2 B5:4 A5:2 F#5:2 D5:4 E5:2 F#5:2 A5:4 G5:2 E5:2 C#5:4 E5:8' },
  skyreach: { bpm: 104, lead: 'triangle', tr: 0, chords: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G'],
    melody: 'E5:4 G5:2 C6:2 B5:4 G5:4 A5:2 C6:2 E6:4 C6:4 A5:2 G5:2 F5:4 E5:2 D5:2 C5:4 E5:2 G5:2 D5:4 B4:2 D5:2 G5:8' },
});

/* ---------- Quests ---------- */
DATA.quests.gale = {
  name: 'Storm over Skyreach', kind: 'main', giver: 'Vesper',
  stages: [
    'Morrow headed north towards Skyreach. Climb the Gullwind Cliffs above Ashgrave with the Climbing Gear.',
    'Climb to the top of the Gullwind Cliffs and reach Skyreach.',
    'The Hollow Order has seized the Skyreach Beacon. Get inside and stop them.',
    'Earn the Gale Badge from Hall Master Aerin at the Gale Hall.',
  ],
  reward: 'Cure-All x3, Starseed Honey',
};
DATA.quests.mirror = {
  name: 'The Sealed Signal Tower', kind: 'side', giver: 'Keeper Ivo',
  stages: [
    'The Signal Tower in Skyreach has been sealed for years. Turn the mirrors inside so the light reaches the seal.',
  ],
  reward: 'Spark Prism, Scroll: Dazzling Ray',
};

/* ---------- Region ---------- */
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'skyreach'), 0, { id: 'gullwind', name: 'Gullwind Cliffs', x: 40, y: 88, desc: 'Sheer cliffs above Ashgrave, full of nesting birds and climbing routes.' });
Object.assign(DATA.region.find((r) => r.id === 'skyreach') || {}, { desc: 'A windswept town on top of the cliffs, home of the Gale Hall and the Skyreach Beacon.' });
DATA.regionRoutes = DATA.regionRoutes.filter(([a, b]) => !(a === 'ashgrave' && b === 'skyreach')).concat([['ashgrave', 'gullwind'], ['gullwind', 'skyreach']]);
