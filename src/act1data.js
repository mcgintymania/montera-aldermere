'use strict';
/* =====================================================================
   ACT I DATA — Wildmon, moves, items, trainers,
   encounters and music for Bramblewood, Mossgate, Route 2, Port Calder
   and the Sunken Lighthouse.
   ===================================================================== */

/* ---------- Tiles ---------- */
Object.assign(DATA.tiles, {
  'g': { t: 'gate', solid: true, dyn: true, text: 'A wall of woven hedge. Somewhere, a switch must open it.' },
  'G': { t: 'gate', solid: true, dyn: true, text: 'A wall of woven hedge. Somewhere, a switch must open it.' },
  'q': { t: 'gateopen' },
  'o': { t: 'plate', plate: true },
  '0': { t: 'plateon', plate: true },
  '8': { t: 'cur_u', slide: 'up' },
  '2': { t: 'cur_d', slide: 'down' },
  '4': { t: 'cur_l', slide: 'left' },
  '6': { t: 'cur_r', slide: 'right' },
  'S': { t: 'stairs' },
  'e': { t: 'cavefloor' },
  'E': { t: 'cavewall', solid: true },
  'O': { t: 'hallgreen' },
  'Y': { t: 'hallblue' },
  'J': { t: 'statue', solid: true, text: 'A stone statue of a Wildmon. The plaque lists every trainer who has beaten this Hall.' },
  'x': { t: 'crate', solid: true, text: 'Crates stamped with a grey lantern. They smell of damp and engine oil.' },
});
DATA.tiles.b = Object.assign({}, DATA.tiles.b, { cut: true });
DATA.tiles.y = { t: 'gate', solid: true, text: 'A thick, neatly trimmed hedge.' };


/* ---------- Moves ---------- */
Object.assign(DATA.moves, {
  poison_jab: { name: 'Venom Jab', type: 'poison', cat: 'phys', pow: 80, acc: 100, pp: 20, eff: 'psn', ch: 30, desc: 'Stabs with a toxic barb. May poison.' },
  thorn_lash: { name: 'Thorn Lash', type: 'grass', cat: 'phys', pow: 75, acc: 95, pp: 15, crit: 1, desc: 'Whips the foe with a thorny vine. Often lands a clean strike.' },
  gull_dive: { name: 'Gull Dive', type: 'air', cat: 'phys', pow: 80, acc: 95, pp: 15, desc: 'Folds its wings and drops on the foe from above.' },
  hex_wave: { name: 'Hex Wave', type: 'ghost', cat: 'spec', pow: 65, acc: 100, pp: 15, eff: 'conf', ch: 20, desc: 'A cold, eerie wave. May confuse.' },
  bramble_jab: { name: 'Bramble Jab', type: 'fighting', cat: 'phys', pow: 65, acc: 100, pp: 20, crit: 1, desc: 'A quick jab with a thorn-wrapped fist. Often lands a clean strike.' },
  tide_slam: { name: 'Tide Slam', type: 'water', cat: 'phys', pow: 80, acc: 100, pp: 15, eff: 'flinch', ch: 20, desc: 'Crashes into the foe like a breaking wave. May make it flinch.' },
  leer: { name: 'Glower', type: 'normal', cat: 'status', acc: 100, pp: 30, eff: 'foe', st: { def: -1 }, desc: "A hard stare that lowers the foe's Defence." },
});

/* ---------- Species #44–63 ---------- */
Object.assign(DATA.species, {
  sprigrat: { n: 44, name: 'Sprigrat', types: ['grass', 'normal'], base: [44, 52, 40, 36, 40, 66], growth: 'medium', catch: 255, exp: 58, rarity: 'common', line: 'sprigrat',
    evo: [{ to: 'thicketrat', lv: 20 }], moves: [[1, 'tackle'], [1, 'growl'], [5, 'vine_whip'], [9, 'quick_attack'], [14, 'razor_leaf'], [18, 'bite'], [23, 'seed_leech'], [28, 'thorn_lash']], traits: ['run_away', 'pickup'],
    habitat: 'Bramblewood', desc: 'A rat whose ears are two curled leaves. It hoards acorns in hollow logs and forgets where most of them are.' },
  thicketrat: { n: 45, name: 'Thicketrat', types: ['grass', 'normal'], base: [68, 82, 62, 50, 60, 92], growth: 'medium', catch: 90, exp: 145, rarity: 'common', line: 'sprigrat',
    evo: [], moves: [[1, 'tackle'], [1, 'growl'], [5, 'vine_whip'], [9, 'quick_attack'], [14, 'razor_leaf'], [18, 'bite'], [20, 'thorn_lash'], [25, 'seed_leech'], [32, 'crunch'], [38, 'swift_step']], traits: ['run_away', 'glare'],
    habitat: 'Evolves from Sprigrat', desc: 'Its back is a hedge of tough leaves. A family of Thicketrat can strip a berry bush bare in one night.' },
  sporelet: { n: 46, name: 'Sporelet', types: ['grass', 'poison'], base: [50, 40, 50, 58, 60, 30], growth: 'medium', catch: 190, exp: 60, rarity: 'common', line: 'sporelet',
    evo: [{ to: 'fungrove', lv: 24 }], moves: [[1, 'absorb'], [1, 'poison_sting'], [6, 'stun_spore'], [10, 'acid'], [15, 'mega_drain'], [19, 'sleep_powder'], [25, 'sludge'], [31, 'rootwall']], traits: ['toxic_touch', 'shed_skin'],
    habitat: 'Bramblewood', desc: 'A mushroom that waddles about on stubby feet. When startled it puffs out a cloud of sleepy spores.' },
  fungrove: { n: 47, name: 'Fungrove', types: ['grass', 'poison'], base: [82, 70, 80, 92, 92, 40], growth: 'medium', catch: 75, exp: 170, rarity: 'common', line: 'sporelet',
    evo: [], moves: [[1, 'absorb'], [1, 'poison_sting'], [6, 'stun_spore'], [10, 'acid'], [15, 'mega_drain'], [19, 'sleep_powder'], [24, 'sludge'], [30, 'rootwall'], [36, 'solar_leaf']], traits: ['toxic_touch', 'sturdy'],
    habitat: 'Evolves from Sporelet', desc: 'A walking ring of mushrooms. Old foresters say a Fungrove sleeping in a clearing means good soil for a hundred years.' },
  stinglet: { n: 48, name: 'Stinglet', types: ['poison', 'air'], base: [40, 50, 35, 30, 35, 70], growth: 'fast', catch: 200, exp: 54, rarity: 'common', line: 'stinglet',
    evo: [{ to: 'waspire', lv: 22 }], moves: [[1, 'poison_sting'], [1, 'gust'], [7, 'quick_attack'], [11, 'acid'], [16, 'wing_attack'], [20, 'poison_jab']], traits: ['keen_eye', 'toxic_touch'],
    habitat: 'Bramblewood', desc: 'A striped flier that buzzes loudly to warn others away. It only stings when its nest is in danger.' },
  waspire: { n: 49, name: 'Waspire', types: ['poison', 'air'], base: [65, 92, 55, 45, 60, 102], growth: 'fast', catch: 60, exp: 160, rarity: 'common', line: 'stinglet',
    evo: [], moves: [[1, 'poison_sting'], [1, 'gust'], [7, 'quick_attack'], [11, 'acid'], [16, 'wing_attack'], [22, 'poison_jab'], [28, 'swift_step'], [34, 'air_slash']], traits: ['keen_eye', 'toxic_touch'],
    habitat: 'Evolves from Stinglet', desc: 'The queen of a Stinglet swarm. Its humming wings can be heard right across a valley.' },
  glimwig: { n: 50, name: 'Glimwig', types: ['light'], base: [42, 30, 42, 56, 50, 45], growth: 'mslow', catch: 150, exp: 60, rarity: 'uncommon', line: 'glimwig',
    evo: [{ to: 'beamwyrm', lv: 25 }], moves: [[1, 'glimmer'], [1, 'tackle'], [6, 'dazzle'], [10, 'mud_slap'], [14, 'harden'], [18, 'radiant_pulse'], [24, 'mend']], traits: ['radiance', 'shed_skin'],
    habitat: 'Bramblewood and Route 2 at night', desc: 'A glow-worm the length of your arm. Lost travellers follow the trails of light Glimwig leave on the forest floor.' },
  beamwyrm: { n: 51, name: 'Beacontail', types: ['light', 'earth'], base: [72, 62, 78, 96, 86, 66], growth: 'mslow', catch: 45, exp: 175, rarity: 'uncommon', line: 'glimwig',
    evo: [], moves: [[1, 'glimmer'], [1, 'tackle'], [6, 'dazzle'], [10, 'mud_slap'], [14, 'harden'], [18, 'radiant_pulse'], [25, 'mud_shot'], [30, 'mend'], [36, 'dazzling_ray'], [42, 'tremor']], traits: ['radiance', 'sturdy'],
    habitat: 'Evolves from Glimwig', desc: 'It burrows through hillsides, lighting the tunnels it leaves behind. Miners count a Beacontail sighting as good luck.' },
  bramblimp: { n: 52, name: 'Bramblimp', types: ['grass', 'fighting'], base: [48, 66, 44, 30, 40, 62], growth: 'medium', catch: 75, exp: 70, rarity: 'rare', line: 'bramblimp',
    evo: [{ to: 'briarbrawl', lv: 26 }], moves: [[1, 'vine_whip'], [1, 'low_kick'], [8, 'bulk_up'], [12, 'rock_smash'], [16, 'razor_leaf'], [21, 'bramble_jab'], [30, 'focus_strike']], traits: ['grit', 'overgrowth'],
    habitat: 'Bramblewood (rare)', desc: 'A scrappy little imp that practises punches on tree trunks. It wraps its fists in bramble vines for extra sting.' },
  briarbrawl: { n: 53, name: 'Briarbrawl', types: ['grass', 'fighting'], base: [78, 110, 70, 45, 62, 85], growth: 'medium', catch: 45, exp: 180, rarity: 'rare', line: 'bramblimp',
    evo: [], moves: [[1, 'vine_whip'], [1, 'low_kick'], [8, 'bulk_up'], [12, 'rock_smash'], [16, 'razor_leaf'], [21, 'bramble_jab'], [26, 'thorn_lash'], [32, 'focus_strike'], [40, 'war_cry']], traits: ['grit', 'overgrowth'],
    habitat: 'Evolves from Bramblimp', desc: 'It guards the oldest trees in the forest and will box anything that tries to fell them, people included.' },
  gullet: { n: 54, name: 'Gullet', types: ['water', 'air'], base: [42, 46, 40, 46, 40, 62], growth: 'mslow', catch: 190, exp: 60, rarity: 'common', line: 'gullet',
    evo: [{ to: 'squallgull', lv: 22 }], moves: [[1, 'peck'], [1, 'water_gun'], [5, 'gust'], [9, 'quick_attack'], [14, 'wing_attack'], [19, 'bubble_beam']], traits: ['keen_eye', 'riptide_dash'],
    habitat: 'Route 2 and Port Calder', desc: 'A noisy seabird that steals chips from harbour stalls. It can float on the waves for days.' },
  squallgull: { n: 55, name: 'Squallgull', types: ['water', 'air'], base: [68, 76, 60, 82, 66, 96], growth: 'mslow', catch: 60, exp: 165, rarity: 'common', line: 'gullet',
    evo: [], moves: [[1, 'peck'], [1, 'water_gun'], [5, 'gust'], [9, 'quick_attack'], [14, 'wing_attack'], [19, 'bubble_beam'], [22, 'gull_dive'], [30, 'air_slash'], [38, 'hydro_pulse']], traits: ['keen_eye', 'riptide_dash'],
    habitat: 'Evolves from Gullet', desc: 'It rides storm winds far out to sea. Sailors watch for Squallgull flocks heading for shore: a gale is coming.' },
  sandkit: { n: 56, name: 'Sandkit', types: ['earth'], base: [40, 54, 42, 36, 42, 64], growth: 'medium', catch: 190, exp: 60, rarity: 'common', line: 'sandkit',
    evo: [{ to: 'dunefox', lv: 24 }], moves: [[1, 'scratch'], [1, 'mud_slap'], [6, 'quick_attack'], [11, 'bite'], [15, 'dig_claw'], [19, 'mud_shot']], traits: ['run_away', 'thick_fur'],
    habitat: 'Route 2', desc: 'A big-eared fox kit that sleeps buried in warm sand. Only the tips of its ears poke out.' },
  dunefox: { n: 57, name: 'Dunefox', types: ['earth', 'fire'], base: [70, 92, 62, 70, 62, 98], growth: 'medium', catch: 60, exp: 172, rarity: 'common', line: 'sandkit',
    evo: [], moves: [[1, 'scratch'], [1, 'mud_slap'], [6, 'quick_attack'], [11, 'bite'], [15, 'dig_claw'], [19, 'mud_shot'], [24, 'fire_fang'], [30, 'ashen_pounce'], [36, 'tremor']], traits: ['thick_fur', 'sunsoak'],
    habitat: 'Evolves from Sandkit', desc: 'Its tail tip smoulders like a coal. On hot days the sand around a resting Dunefox turns to glass.' },
  driftveil: { n: 58, name: 'Driftveil', types: ['ghost', 'water'], base: [46, 30, 42, 62, 60, 48], growth: 'medium', catch: 120, exp: 66, rarity: 'uncommon', line: 'driftveil',
    evo: [{ to: 'wraithtide', lv: 28 }], moves: [[1, 'lick'], [1, 'water_gun'], [7, 'confuse_ray'], [12, 'night_shade'], [17, 'bubble_beam'], [22, 'hex_wave']], traits: ['floating', 'shed_skin'],
    habitat: 'Sunken Lighthouse; Port Calder at night', desc: 'A drifting veil of sea mist with two lamp-like eyes. It haunts wrecks and murmurs in the voices of drowned bells.' },
  wraithtide: { n: 59, name: 'Wraithtide', types: ['ghost', 'water'], base: [72, 50, 66, 102, 98, 72], growth: 'medium', catch: 45, exp: 175, rarity: 'uncommon', line: 'driftveil',
    evo: [], moves: [[1, 'lick'], [1, 'water_gun'], [7, 'confuse_ray'], [12, 'night_shade'], [17, 'bubble_beam'], [22, 'hex_wave'], [28, 'shade_orb'], [34, 'rain_dance'], [40, 'hydro_pulse']], traits: ['floating', 'night_eyes'],
    habitat: 'Evolves from Driftveil', desc: 'A towering wave of fog. Ships caught in it hear the tide calling their names.' },
  glintstar: { n: 60, name: 'Glintstar', types: ['water', 'light'], base: [42, 36, 46, 62, 50, 72], growth: 'medium', catch: 150, exp: 64, rarity: 'uncommon', line: 'glintstar',
    evo: [{ to: 'prismstar', item: 'sun_shard' }], moves: [[1, 'tackle'], [1, 'water_gun'], [6, 'glimmer'], [10, 'harden'], [15, 'bubble_beam'], [20, 'radiant_pulse'], [28, 'mend'], [34, 'hydro_pulse']], traits: ['radiance', 'sturdy'],
    habitat: 'Fishing on Route 2 and in Port Calder', desc: 'A sea star whose core glows at night. Children in Port Calder make wishes on the ones that wash ashore.' },
  prismstar: { n: 61, name: 'Prismstar', types: ['water', 'light'], base: [66, 56, 76, 102, 86, 106], growth: 'medium', catch: 45, exp: 180, rarity: 'uncommon', line: 'glintstar',
    evo: [], moves: [[1, 'water_gun'], [1, 'glimmer'], [1, 'radiant_pulse'], [1, 'bubble_beam'], [28, 'mend'], [34, 'hydro_pulse'], [40, 'dazzling_ray']], traits: ['radiance', 'sturdy'],
    habitat: 'Evolves from Glintstar with a Sun Shard', desc: 'Its crystal body splits sunlight into rainbows. On a clear day it can be seen from miles out to sea.' },
  rookling: { n: 62, name: 'Rookling', types: ['dark', 'air'], base: [40, 56, 36, 40, 36, 62], growth: 'mslow', catch: 150, exp: 60, rarity: 'uncommon', line: 'rookling',
    evo: [{ to: 'corvane', lv: 24 }], moves: [[1, 'peck'], [1, 'leer'], [7, 'bite'], [11, 'shadow_swipe'], [15, 'wing_attack'], [20, 'confuse_ray']], traits: ['night_eyes', 'keen_eye'],
    habitat: 'Route 2; often kept by the Hollow Order', desc: 'A clever crow chick that steals shiny things. The Hollow Order trains them to snatch Lanterns right out of people\'s hands.' },
  corvane: { n: 63, name: 'Corvidus', types: ['dark', 'air'], base: [70, 96, 62, 66, 62, 92], growth: 'mslow', catch: 45, exp: 172, rarity: 'uncommon', line: 'rookling',
    evo: [], moves: [[1, 'peck'], [1, 'leer'], [7, 'bite'], [11, 'shadow_swipe'], [15, 'wing_attack'], [20, 'confuse_ray'], [24, 'gull_dive'], [30, 'crunch'], [36, 'air_slash']], traits: ['night_eyes', 'glare'],
    habitat: 'Evolves from Rookling', desc: 'A long-tailed crow with a bright red throat. Flocks of Corvidus gather wherever something has gone wrong.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { sprigrat: 'thick_fur', sporelet: 'sturdy', stinglet: 'toxic_touch', glimwig: 'radiance', bramblimp: 'grit', gullet: 'riptide_dash', sandkit: 'sunsoak', driftveil: 'night_eyes', glintstar: 'radiance', rookling: 'glare' });
DATA.species.fawnlight.habitat = 'Route 1 and Bramblewood (rare)';

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  great_lantern: { name: 'Great Lantern', pocket: 'lanterns', battle: 'catch', ball: 1.5, price: 600, sell: 300, desc: 'A Lantern with a brighter wick. Catches Wildmon more easily than a standard Lantern.' },
  calm_incense: { name: 'Calm Incense', pocket: 'items', use: 'repel', price: 350, sell: 175, desc: 'A soothing scent that keeps wild Wildmon away for 100 steps.' },
  glowcap: { name: 'Glowcap', pocket: 'key', desc: 'A mushroom that gives off a soft, warm light. Wildmon find it very comforting.' },
  siphon_lantern: { name: 'Siphon Lantern', pocket: 'key', desc: 'A grey Lantern that gives off no light at all. The Hollow Order uses these to drain Wildmon.' },
  sea_chart: { name: 'Sea Chart', pocket: 'collect', desc: "An old chart of the Sound, marked with Captain Rook's notes. One island is circled in red." },
});
DATA.shops.mossgate = ['lantern', 'great_lantern', 'potion', 'super_potion', 'calm_incense', 'bramble_berry', 'antidote', 'unknot', 'burn_salve', 'wake_bell'];
DATA.shops.port_calder = ['lantern', 'great_lantern', 'potion', 'super_potion', 'calm_incense', 'cure_berry', 'antidote', 'unknot', 'burn_salve', 'wake_bell', 'thaw_tea'];

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  grunt: { hair: '#4a4a52', skin: '#e0b088', shirt: '#7a7a84', pants: '#3a3a44', shoes: '#2a2a2a', hat: '#5a5a64' },
  grunt2: { hair: '#8a3a2a', skin: '#f2c8a0', shirt: '#7a7a84', pants: '#3a3a44', shoes: '#2a2a2a', hat: '#5a5a64' },
  rook: { hair: '#1e1e28', skin: '#d8a070', shirt: '#3a3a4a', pants: '#2a2a32', shoes: '#1a1a1a', hat: '#a83a4a' },
  wren: { hair: '#2a1a14', skin: '#c08a60', shirt: '#e8a030', pants: '#4a5a3a', shoes: '#5a3a1a', hat: '#4a7a3a' },
  hazel: { hair: '#7a4a2a', skin: '#f0c49a', shirt: '#5aa048', pants: '#6a4a2a', shoes: '#3a2a1a' },
  coral: { hair: '#e86a5a', skin: '#e8b890', shirt: '#3a8ad0', pants: '#f4f0e8', shoes: '#3a3a4a' },
  bugkid: { hair: '#3a2a1a', skin: '#f2c8a0', shirt: '#a8c838', pants: '#5a4a3a', shoes: '#ffffff', hat: '#e8c838' },
  sailor: { hair: '#5a3a1a', skin: '#d8a070', shirt: '#f4f4f0', pants: '#2a3a6a', shoes: '#2a2a2a', hat: '#f4f4f0' },
  swimmer: { hair: '#e8b830', skin: '#e8b890', shirt: '#e85a8a', pants: '#e85a8a', shoes: '#e8b890' },
  swimmer2: { hair: '#2a2a2a', skin: '#c08a60', shirt: '#3ab0c0', pants: '#3ab0c0', shoes: '#c08a60' },
  gardener: { hair: '#a86a3a', skin: '#f0c49a', shirt: '#8ac060', pants: '#5a4a2a', shoes: '#3a2a1a', hat: '#e8d070' },
  fisher: { hair: '#6a6a6a', skin: '#d8a070', shirt: '#5a7a4a', pants: '#3a3a2a', shoes: '#2a2a1a', hat: '#4a5a3a' },
  lass: { hair: '#c84a6a', skin: '#f2c8a0', shirt: '#f4e070', pants: '#4a6ab0', shoes: '#ffffff' },
});

/* ---------- Trainers ---------- */
Object.assign(DATA.trainers, {
  wes: { cls: 'Bug Catcher', name: 'Wes', look: 'bugkid', team: [['grubble', 7], ['stinglet', 8]], prize: 14, ai: 'basic',
    intro: 'Bzzzz! My net caught YOU! Time for a battle!', lose: 'My bugs got squished...', after: 'Stinglet only sting when you poke their nests. I learned that the hard way.' },
  lou: { cls: 'Picnicker', name: 'Lou', look: 'girl', team: [['sprigrat', 8], ['fawnlight', 8]], prize: 18, ai: 'basic',
    intro: 'Oh! You walked right through my picnic! You owe me a battle.', lose: 'Fine, fine. Have a sandwich.', after: 'Fawnlight love this forest. Lately, though, some of them look... pale.' },
  ned: { cls: 'Camper', name: 'Ned', look: 'boy', team: [['sporelet', 9], ['burrowbit', 9]], prize: 18, ai: 'basic',
    intro: "I've been camping out here all week! I'm basically a forest expert now.", lose: "Okay, maybe I'm not an expert yet.", after: "Sporelet spores make you sleepy. Don't breathe in! ...Zzz... oh! Sorry." },
  tamsin: { cls: 'Ranger', name: 'Tamsin', look: 'ranger', team: [['glimwig', 10], ['sprigrat', 10], ['stinglet', 11]], prize: 30, ai: 'tactical',
    intro: 'A trainer heading for Mossgate? Then show me you can handle the forest.', lose: 'You will do just fine at the Bloom Hall.', after: 'Hazel, the Bloom Hall Master, loves status moves. Pack an Antivenom or two.' },
  grunt1: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['rookling', 9], ['shadepaw', 9]], prize: 20, ai: 'basic', music: 'order',
    intro: "A kid? Out of the way! We've got orders from the Captain.", lose: "Tch! The Captain won't like this.", after: 'Hmph.' },
  grunt2: { cls: 'Order Grunt', name: 'Poacher', look: 'grunt2', team: [['sporelet', 10], ['rookling', 11]], prize: 24, ai: 'tactical', music: 'order',
    intro: ["Shh! I'm busy. That grey Fawnlight still has a bit of light left in it.", "What? You want it to keep its light? Then you'll have to beat me for it!"], lose: 'No! My Siphon Lantern!', after: 'I was only following orders...' },
  pell: { cls: 'Gardener', name: 'Pell', look: 'gardener', team: [['sprigrat', 11], ['sporelet', 11]], prize: 22, ai: 'basic',
    intro: 'Welcome to the Bloom Hall! The hedges are trimmed and so are my Wildmon!', lose: 'You cut right through us!', after: 'The red switches move the hedges. Watch which ones open and close.' },
  ivo: { cls: 'Gardener', name: 'Ivo', look: 'gardener', team: [['glimwig', 11], ['stinglet', 12]], prize: 24, ai: 'tactical',
    intro: "You won't reach Hazel without getting past me first!", lose: 'Withered...', after: 'Hazel is waiting at the top of the Hall. Good luck!' },
  hazel: { cls: 'Hall Master', name: 'Hazel', look: 'hazel', team: [['sporelet', 11], ['sprigrat', 11], ['thornback', 13, 'bramble_berry']], prize: 70, ai: 'tactical', items: { potion: 1 }, pot: 8,
    intro: 'Welcome!', lose: 'Well grown, truly well grown.', after: '' },
  hal: { cls: 'Fisher', name: 'Hal', look: 'fisher', team: [['flopfin', 11], ['flopfin', 11], ['gullet', 12]], prize: 18, ai: 'basic',
    intro: 'Hey, you made me lose a bite! Battle me while I wait for another.', lose: 'The big one got away again...', after: 'Fish near rocks at dusk. Glintstar come up when the light gets low.' },
  mia: { cls: 'Lass', name: 'Mia', look: 'lass', team: [['sandkit', 12], ['fawnlight', 12]], prize: 20, ai: 'basic',
    intro: "Isn't the coast lovely? Let's have a lovely battle!", lose: 'That was not lovely at all!', after: 'Sandkit sleep under the sand. Watch where you step!' },
  gus: { cls: 'Hiker', name: 'Gus', look: 'hiker', team: [['pebblin', 13], ['molekin', 13]], prize: 26, ai: 'tactical',
    intro: 'Hah! Nothing like a sea breeze and a hard battle!', lose: 'Ground down to gravel!', after: 'The tide pools east of Port Calder are full of Shellsnip.' },
  joss: { cls: 'Sailor', name: 'Joss', look: 'sailor', team: [['gullet', 13], ['shellsnip', 13], ['murkle', 14]], prize: 28, ai: 'tactical',
    intro: 'Ahoy! A sailor never turns down a scrap!', lose: 'Sunk!', after: "Port Calder's Hall Master Coral was a sailor too. Best captain in the Sound." },
  kit2: { cls: 'Rival', name: 'Kit', look: 'kit', team: [], prize: 60, ai: 'tactical', items: { potion: 1 },
    lose: 'No way... I trained every single day!', win: "Ha! I'm going to be Champion, and you're my warm-up!" },
  rae: { cls: 'Swimmer', name: 'Rae', look: 'swimmer', team: [['flopfin', 14], ['shellsnip', 15]], prize: 20, ai: 'basic',
    intro: 'The currents in here are wild! Can you keep up?', lose: 'Swept away!', after: 'Each current carries you until something stops you. Plan your route!' },
  dex: { cls: 'Swimmer', name: 'Dex', look: 'swimmer2', team: [['murkle', 15], ['driftveil', 15]], prize: 22, ai: 'tactical',
    intro: "Coral's the toughest Hall Master on the coast. You'll need to beat me first!", lose: 'Washed out!', after: 'Coral loves Water types that hit hard. Electric and Grass moves will help.' },
  coral: { cls: 'Hall Master', name: 'Coral', look: 'coral', team: [['gullet', 15], ['glintstar', 16], ['reefclamp', 18, 'tide_charm']], prize: 90, ai: 'expert', items: { potion: 2 }, pot: 8,
    intro: 'Welcome!', lose: 'Hah! You sailed right through my fleet.', after: '' },
  grunt3: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['shadepaw', 14], ['rookling', 14]], prize: 24, ai: 'basic', music: 'order',
    intro: 'Intruder! The Captain said no visitors!', lose: 'Ugh, I need a better Wildmon...', after: 'The Captain is upstairs. Not that you will get that far.' },
  grunt4: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['stinglet', 15], ['murkle', 15]], prize: 24, ai: 'tactical', music: 'order',
    intro: 'Every Wildmon in that cage is going to the Siphons. Want to join them?', lose: "You're tougher than you look.", after: "The Order pays well. Doesn't mean I have to like it." },
  grunt5: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['driftveil', 15], ['sporelet', 16]], prize: 26, ai: 'tactical', music: 'order',
    intro: "The fog in here is thick. Shame you won't make it out!", lose: 'Lost in my own fog...', after: 'Rook will flatten you.' },
  grunt6: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['rookling', 15], ['shadepaw', 16], ['stinglet', 15]], prize: 26, ai: 'tactical', music: 'order',
    intro: 'Last line of defence! The Captain is right behind me!', lose: 'Captain, I tried!', after: '...' },
  rook: { cls: 'Captain', name: 'Rook', look: 'rook', team: [['shadepaw', 14], ['murkle', 15, 'bramble_berry'], ['corvane', 16]], prize: 60, ai: 'tactical', items: { potion: 1 }, pot: 8, music: 'battle_master',
    intro: 'Rook', lose: 'Bah! Beaten by a child with a Badge...', after: '' },
});

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  bramblewood: {
    grass: {
      day: [['sprigrat', 28, 6, 9], ['stinglet', 20, 6, 9], ['sporelet', 15, 7, 9], ['grubble', 12, 6, 8], ['silkcase', 7, 7, 9], ['burrowbit', 8, 6, 8], ['fawnlight', 6, 8, 10], ['bramblimp', 4, 9, 10]],
      night: [['sporelet', 20, 7, 9], ['glimwig', 20, 7, 9], ['shadepaw', 16, 7, 9], ['wispet', 12, 7, 9], ['sprigrat', 12, 6, 9], ['stinglet', 10, 6, 9], ['fawnlight', 6, 8, 10], ['bramblimp', 4, 9, 10]],
    },
    fish: { day: [['flopfin', 50, 6, 9], ['murkle', 50, 7, 9]], night: [['flopfin', 42, 6, 9], ['murkle', 48, 7, 9], ['lumifin', 10, 9, 11]] },
  },
  route2: {
    grass: {
      day: [['gullet', 28, 11, 14], ['sandkit', 24, 11, 14], ['twigwing', 14, 11, 13], ['rookling', 10, 12, 14], ['zappik', 10, 12, 14], ['burrowbit', 8, 11, 13], ['fawnlight', 6, 12, 14]],
      night: [['rookling', 20, 12, 14], ['shadepaw', 18, 12, 14], ['sandkit', 16, 11, 14], ['glimwig', 16, 11, 14], ['wispet', 14, 12, 14], ['gullet', 16, 11, 14]],
    },
    fish: { day: [['flopfin', 42, 10, 14], ['shellsnip', 26, 12, 15], ['glintstar', 20, 12, 15], ['murkle', 12, 12, 14]], night: [['flopfin', 36, 10, 14], ['glintstar', 28, 12, 15], ['shellsnip', 20, 12, 15], ['lumifin', 8, 13, 15], ['murkle', 8, 12, 14]] },
  },
  port_calder: { fish: { day: [['flopfin', 40, 12, 16], ['shellsnip', 30, 13, 16], ['glintstar', 25, 13, 16], ['gyrefin', 5, 18, 20]], night: [['flopfin', 30, 12, 16], ['glintstar', 30, 13, 16], ['shellsnip', 22, 13, 16], ['driftveil', 13, 14, 16], ['gyrefin', 5, 18, 20]] } },
  sunken_1: { cave: { day: [['driftveil', 30, 13, 16], ['murkle', 22, 13, 15], ['wispet', 18, 13, 15], ['shellsnip', 16, 13, 16], ['rookling', 14, 13, 15]] }, fish: { day: [['flopfin', 50, 12, 15], ['shellsnip', 30, 13, 16], ['driftveil', 20, 14, 16]] } },
  sunken_2: { cave: { day: [['driftveil', 34, 14, 17], ['murkle', 20, 14, 16], ['wispet', 22, 14, 16], ['rookling', 14, 14, 16], ['shellsnip', 10, 14, 16]] } },
});
for (const k of ['sunken_1', 'sunken_2']) DATA.encounters[k].cave.night = DATA.encounters[k].cave.day;
DATA.encounters.sunken_1.fish.night = DATA.encounters.sunken_1.fish.day;

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  forest: { bpm: 100, lead: 'triangle', chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'D', 'Em'],
    melody: 'E5:2 G5:2 B5:4 A5:2 G5:2 E5:4 D5:2 E5:2 G5:4 F#5:4 D5:4 E5:2 G5:2 B5:3 C6:1 B5:2 A5:2 G5:4 F#5:2 G5:2 A5:2 F#5:2 E5:8' },
  hall: { bpm: 120, lead: 'square', chords: ['Dm', 'Bb', 'C', 'A', 'Dm', 'Bb', 'C', 'Dm'],
    melody: 'D5:2 F5:2 A5:4 G5:2 F5:2 E5:4 D5:2 D5:1 E5:1 F5:4 G5:4 A5:4 A5:2 C6:2 D6:4 C6:2 Bb5:2 A5:4 G5:2 A5:2 E5:4 D5:8' },
  order: { bpm: 112, lead: 'square', tr: -2, chords: ['Cm', 'Cm', 'Ab', 'G', 'Cm', 'Cm', 'Ab', 'G'],
    melody: 'C5:2 Eb5:2 G5:2 Eb5:2 C5:2 D5:2 Eb5:4 C5:2 Eb5:2 G5:2 Ab5:2 G5:4 -:4 Ab5:2 G5:2 F5:2 Eb5:2 D5:4 G4:4 C5:2 Eb5:2 G5:2 C6:2 B5:4 G5:4' },
  battle_master: { bpm: 168, lead: 'square', chords: ['Em', 'C', 'D', 'B', 'Em', 'C', 'D', 'Em'],
    melody: 'E5:1 G5:1 B5:1 E6:1 D6:2 B5:2 C6:1 B5:1 A5:1 G5:1 A5:2 B5:2 E5:1 G5:1 B5:1 E6:1 F#6:2 G6:2 F#6:1 E6:1 D#6:1 F#6:1 E6:4 B5:1 B5:1 C6:1 D6:1 E6:2 D6:2 C6:1 C6:1 B5:1 A5:1 B5:4 G5:1 A5:1 B5:1 C6:1 D6:2 C6:2 B5:2 A5:2 B5:4' },
  port: { bpm: 100, lead: 'square', chords: ['F', 'Dm', 'Bb', 'C', 'F', 'Dm', 'Bb', 'C'],
    melody: 'C5:2 F5:2 A5:2 G5:2 F5:4 C5:4 D5:2 F5:2 Bb5:4 A5:2 G5:2 C5:4 C5:2 F5:2 A5:2 C6:2 Bb5:2 A5:2 G5:4 A5:2 G5:2 F5:2 E5:2 F5:8' },
});

/* ---------- Aldermere Map ---------- */
DATA.region = DATA.region.map((r) => Object.assign({}, r, ({
  bramblewood: { desc: 'An old, tangled forest between Fernwick and Mossgate. Thorny bushes hide its quieter corners.' },
  mossgate: { desc: 'A green town built around the Bloom Hall, home of Hall Master Hazel.' },
  port_calder: { name: 'Port Calder', desc: 'A busy harbour town on the south coast, home of the Tide Hall. The old lighthouse offshore sank years ago.' },
})[r.id] || {}));
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'port_calder'), 0, { id: 'route2', name: 'Route 2', x: 171, y: 156, desc: 'A breezy coastal road between Emberlow and Port Calder, with tide pools and sandy coves.' });
DATA.regionRoutes = DATA.regionRoutes.filter(([a, b]) => !(a === 'emberlow' && b === 'port_calder')).concat([['emberlow', 'route2'], ['route2', 'port_calder']]);

/* ---------- Quests ---------- */
Object.assign(DATA.quests, {
  act1: {
    name: 'Strange Lights', kind: 'main', giver: 'Ranger Holt',
    stages: [
      'The Bramblewood path is open. Head north through the forest to the town of Mossgate.',
      "Earn the Bloom Badge from Hall Master Hazel at Mossgate's Bloom Hall.",
      'Wren says the Hollow Order is heading for Port Calder. Go back to Emberlow and take Route 2 west.',
      'The Tide Hall is closed. Hall Master Coral went after the Order at the Sunken Lighthouse, east of the harbour.',
      'Climb the Sunken Lighthouse and stop Captain Rook.',
      'Coral is back at the Tide Hall. Challenge her for the Tide Badge!',
    ],
    reward: 'Strong Tonic x3, Scroll: Tide Slam',
  },
  grey: {
    name: 'The Grey Wildmon', kind: 'side', giver: 'A grey Fawnlight',
    stages: [
      'A Fawnlight in the Bramblewood glade has lost all its colour. Find three Glowcaps in the forest to comfort it. ({glowcap}/3)',
      'Give the Glowcaps to the grey Fawnlight in the glade.',
      'Something is still draining its light. Find the Hollow Order poacher hiding in the north of Bramblewood.',
      'The Siphon Lantern is broken. Go back to the Fawnlight in the glade.',
    ],
    reward: 'A grade-A Fawnlight partner',
  },
});
DATA.items.scroll_tideslam = { name: 'Scroll: Tide Slam', pocket: 'scrolls', scroll: 'tide_slam', sell: 1000, desc: `Teaches Tide Slam (water). Can be used again and again. ${DATA.moves.tide_slam.desc}` };
DATA.scrolls.scroll_tideslam = 'tide_slam';
DATA.items.scroll_poisonjab = { name: 'Scroll: Venom Jab', pocket: 'scrolls', scroll: 'poison_jab', price: 2000, sell: 1000, desc: `Teaches Venom Jab (poison). Can be used again and again. ${DATA.moves.poison_jab.desc}` };
DATA.scrolls.scroll_poisonjab = 'poison_jab';
DATA.shops.fernwick_scrolls.push('scroll_poisonjab');
DATA.trainerGifts.tamsin = 'calm_incense';
DATA.trainerGifts.joss = 'great_lantern';

/* ---------- Lantern family ----------
   mult: base catch multiplier. Special rules live in LANTERN_RULES (field.js). */
Object.assign(DATA.items, {
  bright_lantern: { name: 'Bright Lantern', pocket: 'lanterns', battle: 'catch', ball: 2, price: 1200, sell: 600, lcol: ['#e8e8f0', '#fff8c0'], desc: 'A Lantern with a blazing wick. Much better at catching Wildmon than a Great Lantern.' },
  tide_lantern: { name: 'Tide Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 800, sell: 400, lcol: ['#2a9ab0', '#a0f0ff'], desc: 'Made in Port Calder. Works very well on Water types and on Wildmon hooked while fishing.' },
  moss_lantern: { name: 'Moss Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 800, sell: 400, lcol: ['#4a9a3a', '#d8ffb0'], desc: 'Made in Mossgate. Works very well on Grass and Poison types.' },
  dusk_lantern: { name: 'Dusk Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 1000, sell: 500, lcol: ['#5a3a8a', '#c0a0ff'], desc: 'Glows brightest in the dark. Works very well at night and in caves.' },
  swift_lantern: { name: 'Swift Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 1000, sell: 500, lcol: ['#e8a020', '#ffd080'], desc: 'Throw it straight away! Works very well on the first turn of a battle.' },
  patience_lantern: { name: 'Patience Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 1000, sell: 500, lcol: ['#8a6a4a', '#ffe0a0'], desc: 'Its wick slowly brightens. The longer the battle has gone on, the better it works.' },
  kin_lantern: { name: 'Kin Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 1000, sell: 500, lcol: ['#c84a6a', '#ffc0d0'], desc: 'Works very well on species you have already caught. Handy for gathering Essence.' },
  heal_lantern: { name: 'Heal Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 300, sell: 150, lcol: ['#e86a8a', '#fff0f4'], desc: 'A gentle Lantern that fully heals the Wildmon it catches.' },
  friend_lantern: { name: 'Friend Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 300, sell: 150, lcol: ['#5ab060', '#fff0a0'], desc: 'A cosy Lantern. Wildmon caught in it start with a strong Bond.' },
  sovereign_lantern: { name: 'Sovereign Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, master: true, sell: 0, lcol: ['#8a2ab0', '#ffffff'], desc: 'The finest Lantern ever made. It never fails. Only one exists, so choose its Wildmon wisely.' },
});
DATA.items.lantern.lcol = ['#c8a040', '#ffe8a0'];
DATA.items.great_lantern.lcol = ['#3a7ad0', '#c8e8ff'];
DATA.shops.mossgate.splice(2, 0, 'moss_lantern', 'swift_lantern', 'friend_lantern');
DATA.shops.port_calder.splice(2, 0, 'tide_lantern', 'dusk_lantern', 'heal_lantern');

/* ---------- Legendary and mythical Wildmon (#174–180) ----------
   Where each one appears is set up alongside its map. */
Object.assign(DATA.moves, {
  solar_flare: { name: 'Solar Flare', type: 'fire', cat: 'spec', pow: 110, acc: 90, pp: 5, eff: 'brn', ch: 30, desc: 'A blast of sunfire. May burn.' },
  maelstrom: { name: 'Maelstrom', type: 'water', cat: 'spec', pow: 110, acc: 90, pp: 5, eff: 'conf', ch: 20, desc: 'A whirling torrent. May confuse.' },
  thunderhead: { name: 'Thunderhead', type: 'electric', cat: 'spec', pow: 110, acc: 85, pp: 5, eff: 'par', ch: 30, desc: 'A crashing storm cloud. May paralyse.' },
  eclipse_pulse: { name: 'Eclipse Pulse', type: 'dark', cat: 'spec', pow: 120, acc: 90, pp: 5, eff: 'foe', st: { acc: -1 }, ch: 30, desc: 'Swallows the light around the foe. May lower accuracy.' },
  dawnbreak: { name: 'Dawnbreak', type: 'light', cat: 'spec', pow: 120, acc: 90, pp: 5, eff: 'conf', ch: 20, desc: 'The first light of morning, all at once. May confuse.' },
  psy_storm: { name: 'Psy Storm', type: 'psychic', cat: 'spec', pow: 120, acc: 95, pp: 5, desc: 'A storm of raw mental force.' },
  first_light: { name: 'First Light', type: 'light', cat: 'spec', pow: 80, acc: 100, pp: 10, eff: 'drain', desc: 'An ancient glow. Restores half the damage dealt.' },
});
Object.assign(DATA.species, {
  solvane: { n: 174, name: 'Solvane', types: ['fire', 'light'], base: [90, 100, 90, 125, 85, 90], growth: 'slow', catch: 3, exp: 260, rarity: 'legendary', line: 'solvane', legend: true,
    evo: [], moves: [[1, 'ember'], [1, 'glimmer'], [20, 'flame_burst'], [30, 'radiant_pulse'], [40, 'flamethrower'], [50, 'dazzling_ray'], [60, 'solar_flare'], [70, 'mend']], traits: ['blaze', 'radiance'],
    habitat: 'Emberforge Volcano', desc: 'The sun Warden. A great bird of white fire that is said to rise with the sun over Emberforge.' },
  tidevane: { n: 175, name: 'Tidevane', types: ['water', 'psychic'], base: [100, 85, 100, 110, 110, 75], growth: 'slow', catch: 3, exp: 260, rarity: 'legendary', line: 'tidevane', legend: true,
    evo: [], moves: [[1, 'water_gun'], [1, 'confusion'], [20, 'bubble_beam'], [30, 'psybeam'], [40, 'hydro_pulse'], [50, 'rain_dance'], [60, 'maelstrom'], [70, 'mend']], traits: ['torrent', 'floating'],
    habitat: 'Deepreach, beneath the Sound', desc: 'The tide Warden. It sleeps in the deepest trench of the Sound, and the tides follow its breathing.' },
  galevane: { n: 176, name: 'Galevane', types: ['electric', 'air'], base: [90, 90, 85, 115, 90, 110], growth: 'slow', catch: 3, exp: 260, rarity: 'legendary', line: 'galevane', legend: true,
    evo: [], moves: [[1, 'thundershock'], [1, 'gust'], [20, 'spark'], [30, 'air_slash'], [40, 'thunderbolt'], [50, 'swift_step'], [60, 'thunderhead'], [70, 'mend']], traits: ['static', 'keen_eye'],
    habitat: 'Gullwind Cliffs, in storms', desc: 'The storm Warden. Its wingbeats are the thunder that rolls over Skyreach.' },
  nocthra: { n: 177, name: 'Nocthra', types: ['dark', 'ghost'], base: [110, 120, 100, 130, 110, 110], growth: 'slow', catch: 3, exp: 300, rarity: 'legendary', line: 'nocthra', legend: true,
    evo: [], moves: [[1, 'bite'], [1, 'night_shade'], [30, 'shadow_swipe'], [40, 'shade_orb'], [50, 'crunch'], [60, 'eclipse_pulse'], [70, 'hex_wave'], [80, 'mend']], traits: ['night_eyes', 'floating'],
    habitat: 'The Drowned Spire', desc: 'An eclipse serpent from the old stories. When it opens its jaws, the sky goes dark at noon.' },
  aurelion: { n: 178, name: 'Aurelion', types: ['light', 'psychic'], base: [105, 110, 100, 135, 120, 110], growth: 'slow', catch: 3, exp: 300, rarity: 'legendary', line: 'aurelion', legend: true,
    evo: [], moves: [[1, 'glimmer'], [1, 'confusion'], [30, 'radiant_pulse'], [40, 'psybeam'], [50, 'dazzling_ray'], [60, 'dawnbreak'], [70, 'focus_mind'], [80, 'mend']], traits: ['radiance', 'sturdy'],
    habitat: 'The Starfall Isles', desc: 'A golden lion of dawn. Sailors who have seen it say the sun rose twice that morning.' },
  eclipsar: { n: 179, name: 'Eclipsar', types: ['psychic', 'dark'], base: [106, 110, 90, 154, 90, 130], growth: 'slow', catch: 3, exp: 320, rarity: 'legendary', line: 'eclipsar', legend: true,
    evo: [], moves: [[1, 'confusion'], [1, 'night_shade'], [40, 'psybeam'], [50, 'shade_orb'], [60, 'focus_mind'], [65, 'eclipse_pulse'], [70, 'psy_storm'], [80, 'mend']], traits: ['iron_hide', 'night_eyes'],
    habitat: 'Unknown', desc: 'A Wildmon made, not born. The Hollow Order built it from stolen light, and it has hated every Lantern since.' },
  aldra: { n: 180, name: 'Aldra', types: ['light'], base: [100, 100, 100, 100, 100, 100], growth: 'mslow', catch: 45, exp: 270, rarity: 'legendary', line: 'aldra', legend: true, mythical: true,
    evo: [], moves: [[1, 'glimmer'], [1, 'tackle'], [10, 'mend'], [20, 'radiant_pulse'], [30, 'psybeam'], [40, 'first_light'], [50, 'dazzling_ray'], [60, 'hydro_pulse'], [70, 'flamethrower'], [80, 'thunderbolt']], traits: ['radiance', 'shed_skin'],
    habitat: 'Mythical', desc: 'Some say every Wildmon descends from Aldra, and that the first Lantern was lit from its glow. Almost nobody has seen one.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
