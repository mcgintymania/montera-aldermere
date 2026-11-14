'use strict';
/* =====================================================================
   MONSTER DATA — types, moves, species, encounters, trainers
   ===================================================================== */
DATA.types = ['normal', 'fire', 'water', 'grass', 'electric', 'earth', 'air', 'rock', 'ice', 'fighting', 'poison', 'psychic', 'ghost', 'dark', 'steel', 'light'];
DATA.typeColors = {
  normal: '#a8a290', fire: '#e8603a', water: '#3f8fe0', grass: '#5cb848', electric: '#e8c020', earth: '#b88a4a', air: '#8ab0e8', rock: '#9a8a62',
  ice: '#7ad0e0', fighting: '#c0442e', poison: '#9a50b0', psychic: '#e8588a', ghost: '#6a5aa0', dark: '#4a4050', steel: '#9aa4b4', light: '#f0d870',
};
DATA.chart = {
  normal: { se: [], nv: ['rock', 'steel'], im: ['ghost'] },
  fire: { se: ['grass', 'ice', 'steel'], nv: ['fire', 'water', 'rock'], im: [] },
  water: { se: ['fire', 'earth', 'rock'], nv: ['water', 'grass'], im: [] },
  grass: { se: ['water', 'earth', 'rock'], nv: ['fire', 'grass', 'poison', 'air', 'steel'], im: [] },
  electric: { se: ['water', 'air'], nv: ['electric', 'grass'], im: ['earth'] },
  earth: { se: ['fire', 'electric', 'poison', 'rock', 'steel'], nv: ['grass'], im: ['air'] },
  air: { se: ['grass', 'fighting'], nv: ['electric', 'rock', 'steel'], im: [] },
  rock: { se: ['fire', 'ice', 'air'], nv: ['fighting', 'earth', 'steel'], im: [] },
  ice: { se: ['grass', 'earth', 'air'], nv: ['fire', 'water', 'ice', 'steel'], im: [] },
  fighting: { se: ['normal', 'rock', 'ice', 'steel', 'dark'], nv: ['poison', 'air', 'psychic', 'light'], im: ['ghost'] },
  poison: { se: ['grass', 'light'], nv: ['poison', 'earth', 'rock', 'ghost'], im: ['steel'] },
  psychic: { se: ['fighting', 'poison'], nv: ['psychic', 'steel'], im: ['dark'] },
  ghost: { se: ['psychic', 'ghost'], nv: ['dark', 'light'], im: ['normal'] },
  dark: { se: ['psychic', 'ghost', 'light'], nv: ['fighting', 'dark'], im: [] },
  steel: { se: ['ice', 'rock', 'light'], nv: ['fire', 'water', 'electric', 'steel'], im: [] },
  light: { se: ['dark', 'ghost'], nv: ['fire', 'steel', 'light'], im: [] },
};
DATA.typeMult = function (atk, defTypes) {
  let m = 1; const c = DATA.chart[atk];
  for (const d of defTypes) { if (c.im.includes(d)) m *= 0; else if (c.se.includes(d)) m *= 2; else if (c.nv.includes(d)) m *= 0.5; }
  return m;
};

DATA.statNames = { hp: 'HP', atk: 'Attack', def: 'Defence', spa: 'Spirit', spd: 'Resolve', spe: 'Speed' };
DATA.statKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
DATA.temperaments = [
  ['Fierce', 'atk', 'spe'], ['Steadfast', 'def', 'atk'], ['Studious', 'spa', 'atk'], ['Serene', 'spd', 'atk'], ['Skittish', 'spe', 'atk'],
  ['Reckless', 'atk', 'def'], ['Dreamy', 'spa', 'def'], ['Tender', 'spd', 'def'], ['Restless', 'spe', 'def'], ['Stubborn', 'atk', 'spa'],
  ['Sturdy', 'def', 'spa'], ['Wary', 'spd', 'spa'], ['Cheerful', 'spe', 'spa'], ['Rowdy', 'atk', 'spd'], ['Easygoing', 'def', 'spd'],
  ['Hotheaded', 'spa', 'spd'], ['Curious', 'spe', 'spd'], ['Lazy', 'def', 'spe'], ['Pensive', 'spa', 'spe'], ['Proud', 'spd', 'spe'],
  ['Even', null, null], ['Placid', null, null], ['Quirky', null, null], ['Earnest', null, null],
];
DATA.statusNames = { psn: 'Venom', brn: 'Seared', par: 'Jolted', slp: 'Dozing', frz: 'Frozen' };
DATA.marks = ['stars', 'spots', 'stripes', 'heart', 'swirl'];
DATA.rarityEssence = { common: 2, uncommon: 3, rare: 5, veryrare: 8, legendary: 0 };
DATA.masteryRanks = [
  [50, 'Familiar', '+5% catch rate for this line'],
  [150, 'Practised', '+1 Essence for every catch'],
  [400, 'Expert', '+2% to all stats for this line; Lustre odds x1.5'],
  [900, 'Veteran', 'Evolving grants +1 Potential to a random stat'],
  [2000, 'Master', "Unlocks the line's Mastery Trait"],
];

/* ---------- Moves ----------
   cat: phys | spec | status.  eff: effect keyword handled by the battle engine. */
DATA.moves = {
  tackle: { name: 'Barge', type: 'normal', cat: 'phys', pow: 40, acc: 100, pp: 35, desc: 'A full-body charge.' },
  scratch: { name: 'Claw Swipe', type: 'normal', cat: 'phys', pow: 40, acc: 100, pp: 35, desc: 'Rakes the target with sharp claws.' },
  quick_attack: { name: 'Dart Rush', type: 'normal', cat: 'phys', pow: 40, acc: 100, pp: 30, pri: 1, desc: 'A lightning-fast strike that always goes first.' },
  headbutt: { name: 'Brow Ram', type: 'normal', cat: 'phys', pow: 70, acc: 100, pp: 15, eff: 'flinch', ch: 30, desc: 'A hard headbutt. May make the target flinch.' },
  body_slam: { name: 'Belly Flop', type: 'normal', cat: 'phys', pow: 85, acc: 100, pp: 15, eff: 'par', ch: 30, desc: 'Drops its full weight. May cause paralysis.' },
  growl: { name: 'Grumble', type: 'normal', cat: 'status', acc: 100, pp: 40, eff: 'foe', st: { atk: -1 }, desc: "A cute growl that lowers the foe's Attack." },
  tail_whip: { name: 'Tail Wag', type: 'normal', cat: 'status', acc: 100, pp: 30, eff: 'foe', st: { def: -1 }, desc: "Wags its tail to lower the foe's Defence." },
  harden: { name: 'Brace Up', type: 'normal', cat: 'status', acc: null, pp: 30, eff: 'self', st: { def: 1 }, desc: 'Stiffens its body to raise Defence.' },
  lullaby: { name: 'Lullaby', type: 'normal', cat: 'status', acc: 55, pp: 15, eff: 'slp', ch: 100, desc: 'A soothing song that may send the foe to sleep.' },
  ember: { name: 'Cinder', type: 'fire', cat: 'spec', pow: 40, acc: 100, pp: 25, eff: 'brn', ch: 10, desc: 'Small flames. May cause a burn.' },
  fire_fang: { name: 'Scorch Bite', type: 'fire', cat: 'phys', pow: 65, acc: 95, pp: 15, eff: 'brn', ch: 10, desc: 'Bites with flame-wreathed fangs. May burn.' },
  flame_burst: { name: 'Flare Pop', type: 'fire', cat: 'spec', pow: 70, acc: 100, pp: 15, desc: 'A burst of searing flame.' },
  ashen_pounce: { name: 'Ashen Pounce', type: 'fire', cat: 'phys', pow: 75, acc: 95, pp: 15, crit: 1, eff: 'brn', ch: 10, desc: 'A smouldering leap. Often lands a clean strike; may burn.' },
  will_o: { name: 'Wisp Glow', type: 'fire', cat: 'status', acc: 85, pp: 15, eff: 'brn', ch: 100, desc: 'An eerie flame that burns the foe.' },
  bubble: { name: 'Froth', type: 'water', cat: 'spec', pow: 40, acc: 100, pp: 30, eff: 'foe', st: { spe: -1 }, ch: 10, desc: 'A spray of bubbles. May lower Speed.' },
  water_gun: { name: 'Squirt', type: 'water', cat: 'spec', pow: 40, acc: 100, pp: 25, desc: 'Squirts water at the foe.' },
  aqua_jet: { name: 'Surge Dash', type: 'water', cat: 'phys', pow: 40, acc: 100, pp: 20, pri: 1, desc: 'A rushing jet of water that always strikes first.' },
  brine_bite: { name: 'Brine Bite', type: 'water', cat: 'phys', pow: 65, acc: 95, pp: 15, eff: 'flinch', ch: 20, desc: 'Salt-crusted jaws. May make the foe flinch.' },
  bubble_beam: { name: 'Froth Stream', type: 'water', cat: 'spec', pow: 65, acc: 100, pp: 20, eff: 'foe', st: { spe: -1 }, ch: 10, desc: 'A torrent of bubbles. May lower Speed.' },
  tide_rally: { name: 'Tide Rally', type: 'water', cat: 'status', acc: null, pp: 20, eff: 'self', st: { atk: 1, spe: 1 }, desc: 'Rides a surging wave of spirit. Raises Attack and Speed.' },
  vine_whip: { name: 'Creeper Lash', type: 'grass', cat: 'phys', pow: 45, acc: 100, pp: 25, desc: 'Strikes with slender vines.' },
  absorb: { name: 'Sap', type: 'grass', cat: 'spec', pow: 25, acc: 100, pp: 25, eff: 'drain', desc: 'Drains energy. Restores half the damage dealt.' },
  mega_drain: { name: 'Deep Sap', type: 'grass', cat: 'spec', pow: 45, acc: 100, pp: 15, eff: 'drain', desc: 'A stronger drain. Restores half the damage dealt.' },
  razor_leaf: { name: 'Leaf Flurry', type: 'grass', cat: 'phys', pow: 55, acc: 95, pp: 25, crit: 1, desc: 'Sharp leaves. Often lands a clean strike.' },
  sleep_powder: { name: 'Drowse Dust', type: 'grass', cat: 'status', acc: 75, pp: 15, eff: 'slp', ch: 100, desc: 'A cloud of spores that causes sleep.' },
  stun_spore: { name: 'Numb Spores', type: 'grass', cat: 'status', acc: 75, pp: 30, eff: 'par', ch: 100, desc: 'Scatters spores that paralyse.' },
  rootwall: { name: 'Rootwall', type: 'grass', cat: 'status', acc: null, pp: 15, eff: 'self', st: { def: 1, spd: 1 }, regen: 3, desc: 'Roots down. Raises Defence and Resolve and restores HP for 3 turns.' },
  thundershock: { name: 'Jolt', type: 'electric', cat: 'spec', pow: 40, acc: 100, pp: 30, eff: 'par', ch: 10, desc: 'A jolt of electricity. May paralyse.' },
  spark: { name: 'Zap', type: 'electric', cat: 'phys', pow: 65, acc: 100, pp: 20, eff: 'par', ch: 30, desc: 'An electrified tackle. May paralyse.' },
  thunder_wave: { name: 'Numb Pulse', type: 'electric', cat: 'status', acc: 90, pp: 20, eff: 'par', ch: 100, desc: 'A weak current that paralyses.' },
  mud_slap: { name: 'Mud Fling', type: 'earth', cat: 'spec', pow: 20, acc: 100, pp: 10, eff: 'foe', st: { acc: -1 }, ch: 100, desc: 'Flings mud in the face. Lowers accuracy.' },
  mud_shot: { name: 'Mud Volley', type: 'earth', cat: 'spec', pow: 55, acc: 95, pp: 15, eff: 'foe', st: { spe: -1 }, ch: 100, desc: 'Hurls mud. Lowers Speed.' },
  dig_claw: { name: 'Dig Claw', type: 'earth', cat: 'phys', pow: 70, acc: 100, pp: 15, desc: 'Tears up the ground under the foe.' },
  peck: { name: 'Beak Jab', type: 'air', cat: 'phys', pow: 35, acc: 100, pp: 35, desc: 'Jabs with a beak.' },
  gust: { name: 'Gale Puff', type: 'air', cat: 'spec', pow: 40, acc: 100, pp: 35, desc: 'Whips up a gust of wind.' },
  wing_attack: { name: 'Wing Clip', type: 'air', cat: 'phys', pow: 60, acc: 100, pp: 35, desc: 'Strikes with wide wings.' },
  rock_throw: { name: 'Stone Toss', type: 'rock', cat: 'phys', pow: 50, acc: 90, pp: 15, desc: 'Lobs a small rock.' },
  rock_tomb: { name: 'Rubble Trap', type: 'rock', cat: 'phys', pow: 60, acc: 95, pp: 15, eff: 'foe', st: { spe: -1 }, ch: 100, desc: 'Boulders that lower Speed.' },
  powder_snow: { name: 'Snow Flurry', type: 'ice', cat: 'spec', pow: 40, acc: 100, pp: 25, eff: 'frz', ch: 10, desc: 'A chilly flurry. May freeze.' },
  ice_fang: { name: 'Rime Fang', type: 'ice', cat: 'phys', pow: 65, acc: 95, pp: 15, eff: 'frz', ch: 10, desc: 'Frozen fangs. May freeze.' },
  low_kick: { name: 'Sweep Kick', type: 'fighting', cat: 'phys', pow: 50, acc: 100, pp: 20, desc: 'A sweeping kick to the legs.' },
  rock_smash: { name: 'Stone Breaker', type: 'fighting', cat: 'phys', pow: 40, acc: 100, pp: 15, eff: 'foe', st: { def: -1 }, ch: 50, desc: 'A rock-breaking punch. May lower Defence.' },
  bulk_up: { name: 'Pump Up', type: 'fighting', cat: 'status', acc: null, pp: 20, eff: 'self', st: { atk: 1, def: 1 }, desc: 'Tenses its muscles. Raises Attack and Defence.' },
  poison_sting: { name: 'Venom Barb', type: 'poison', cat: 'phys', pow: 15, acc: 100, pp: 35, eff: 'psn', ch: 30, desc: 'A toxic barb. May poison.' },
  acid: { name: 'Caustic Spit', type: 'poison', cat: 'spec', pow: 40, acc: 100, pp: 30, eff: 'foe', st: { spd: -1 }, ch: 10, desc: 'A spray of acid. May lower Resolve.' },
  smog: { name: 'Fume', type: 'poison', cat: 'spec', pow: 30, acc: 70, pp: 20, eff: 'psn', ch: 40, desc: 'Noxious fumes. May poison.' },
  confusion: { name: 'Mind Jolt', type: 'psychic', cat: 'spec', pow: 50, acc: 100, pp: 25, eff: 'conf', ch: 10, desc: 'A telekinetic blow. May confuse.' },
  hypnosis: { name: 'Trance', type: 'psychic', cat: 'status', acc: 60, pp: 20, eff: 'slp', ch: 100, desc: 'A swaying gaze that causes sleep.' },
  lick: { name: 'Chill Lick', type: 'ghost', cat: 'phys', pow: 30, acc: 100, pp: 30, eff: 'par', ch: 30, desc: 'A cold, ghostly lick. May paralyse.' },
  night_shade: { name: 'Night Terror', type: 'ghost', cat: 'spec', pow: 1, acc: 100, pp: 15, eff: 'level', desc: "Deals damage equal to the user's level." },
  confuse_ray: { name: 'Daze Light', type: 'ghost', cat: 'status', acc: 100, pp: 10, eff: 'conf', ch: 100, desc: 'A sinister ray that confuses the foe.' },
  bite: { name: 'Chomp', type: 'dark', cat: 'phys', pow: 60, acc: 100, pp: 25, eff: 'flinch', ch: 30, desc: 'Bites hard. May make the foe flinch.' },
  shadow_swipe: { name: 'Shadow Swipe', type: 'dark', cat: 'phys', pow: 60, acc: null, pp: 20, desc: 'A strike from the shadows that never misses.' },
  metal_claw: { name: 'Steel Talon', type: 'steel', cat: 'phys', pow: 50, acc: 95, pp: 35, eff: 'self', st: { atk: 1 }, ch: 10, desc: 'Steel claws. May raise Attack.' },
  iron_defense: { name: 'Iron Guard', type: 'steel', cat: 'status', acc: null, pp: 15, eff: 'self', st: { def: 2 }, desc: 'Hardens like iron. Sharply raises Defence.' },
  glimmer: { name: 'Glimmer', type: 'light', cat: 'spec', pow: 40, acc: 100, pp: 30, desc: 'A pulse of soft light.' },
  dazzle: { name: 'Dazzle', type: 'light', cat: 'status', acc: 100, pp: 20, eff: 'foe', st: { acc: -1 }, desc: "A bright flash that lowers the foe's accuracy." },
  radiant_pulse: { name: 'Radiant Pulse', type: 'light', cat: 'spec', pow: 65, acc: 100, pp: 15, eff: 'conf', ch: 10, desc: 'A wave of radiant light. May confuse.' },
  splash: { name: 'Flounder', type: 'water', cat: 'status', acc: null, pp: 40, eff: 'nothing', desc: 'Flops about. Nothing happens... at all.' },
};

/* ---------- Species ----------
   base: [hp, atk, def, spa, spd, spe]
   art: parameters for the procedural sprite generator */
const SP = (o) => o;
DATA.species = {
  mossling: SP({ n: 1, name: 'Mossling', types: ['grass'], base: [50, 48, 62, 42, 62, 54], growth: 'mslow', catch: 45, exp: 64, rarity: 'rare', line: 'mossling',
    evo: [{ to: 'thornback', lv: 16 }], moves: [[1, 'tackle'], [1, 'growl'], [7, 'absorb'], [10, 'vine_whip'], [13, 'rootwall'], [17, 'stun_spore'], [21, 'mega_drain'], [26, 'razor_leaf']],
    habitat: "Professor Thorne's lab", desc: 'A tortoise cub that naps in sunbeams. The sapling on its shell grows a little each time it wins a battle.' }),
  thornback: SP({ n: 2, name: 'Thornback', types: ['grass'], base: [65, 62, 80, 52, 78, 68], growth: 'mslow', catch: 45, exp: 142, rarity: 'rare', line: 'mossling',
    evo: [{ to: 'bastionoak', lv: 36 }], moves: [[1, 'tackle'], [1, 'growl'], [7, 'absorb'], [10, 'vine_whip'], [13, 'rootwall'], [18, 'stun_spore'], [22, 'mega_drain'], [28, 'razor_leaf'], [33, 'rock_tomb']],
    habitat: 'Evolves from Mossling', desc: 'Its shell has sprouted a thicket of thorns. It shelters smaller Wildmon among the brambles.' }),
  bastionoak: SP({ n: 3, name: 'Bastionoak', types: ['grass', 'rock'], base: [90, 82, 110, 68, 100, 80], growth: 'mslow', catch: 45, exp: 236, rarity: 'rare', line: 'mossling',
    evo: [], moves: [[1, 'tackle'], [1, 'rootwall'], [10, 'vine_whip'], [22, 'mega_drain'], [28, 'razor_leaf'], [33, 'rock_tomb'], [36, 'iron_defense'], [44, 'body_slam']],
    habitat: 'Evolves from Thornback', desc: 'An ancient oak grows from its stone shell. Villages once built their halls beside sleeping Bastionoak.' }),
  firecub: SP({ n: 4, name: 'Firecub', types: ['fire'], base: [42, 58, 40, 55, 44, 70], growth: 'mslow', catch: 45, exp: 62, rarity: 'rare', line: 'firecub',
    evo: [{ to: 'cinderclaw', lv: 16 }], moves: [[1, 'scratch'], [1, 'growl'], [7, 'ember'], [10, 'quick_attack'], [13, 'ashen_pounce'], [17, 'bite'], [21, 'fire_fang'], [26, 'flame_burst']],
    habitat: "Professor Thorne's lab", desc: 'A bobcat kit with an ember for a tail. When it is happy, the ember crackles like a tiny campfire.' }),
  cinderclaw: SP({ n: 5, name: 'Cinderclaw', types: ['fire'], base: [58, 82, 52, 68, 55, 90], growth: 'mslow', catch: 45, exp: 142, rarity: 'rare', line: 'firecub',
    evo: [{ to: 'infernyx', lv: 36 }], moves: [[1, 'scratch'], [1, 'ember'], [10, 'quick_attack'], [13, 'ashen_pounce'], [18, 'bite'], [22, 'fire_fang'], [28, 'flame_burst'], [34, 'shadow_swipe']],
    habitat: 'Evolves from Firecub', desc: 'A lean lynx trailing smoke. It stalks through dry grass without leaving a single scorch mark.' }),
  infernyx: SP({ n: 6, name: 'Infernyx', types: ['fire', 'dark'], base: [76, 110, 68, 90, 70, 120], growth: 'mslow', catch: 45, exp: 240, rarity: 'rare', line: 'firecub',
    evo: [], moves: [[1, 'ashen_pounce'], [1, 'shadow_swipe'], [18, 'bite'], [22, 'fire_fang'], [28, 'flame_burst'], [36, 'will_o'], [42, 'body_slam']],
    habitat: 'Evolves from Cinderclaw', desc: 'A black panther whose flames burn dark at the core. Its roar can be heard across the Glasswater Sound.' }),
  puddlepup: SP({ n: 7, name: 'Puddlepup', types: ['water'], base: [52, 56, 52, 48, 50, 56], growth: 'mslow', catch: 45, exp: 63, rarity: 'rare', line: 'puddlepup',
    evo: [{ to: 'brinehound', lv: 16 }], moves: [[1, 'tackle'], [1, 'tail_whip'], [7, 'water_gun'], [10, 'bubble'], [13, 'tide_rally'], [17, 'aqua_jet'], [21, 'brine_bite'], [26, 'bubble_beam']],
    habitat: "Professor Thorne's lab", desc: 'An otter-hound pup that slaps puddles to make friends. It shakes itself dry right next to you.' }),
  brinehound: SP({ n: 8, name: 'Brinehound', types: ['water'], base: [70, 74, 66, 60, 62, 73], growth: 'mslow', catch: 45, exp: 142, rarity: 'rare', line: 'puddlepup',
    evo: [{ to: 'abyssmaul', lv: 36 }], moves: [[1, 'tackle'], [1, 'water_gun'], [13, 'tide_rally'], [18, 'aqua_jet'], [22, 'brine_bite'], [28, 'bubble_beam'], [32, 'rock_smash'], [36, 'headbutt']],
    habitat: 'Evolves from Puddlepup', desc: 'A barrel-chested sea dog. Fishing crews keep one aboard to warn of storms.' }),
  abyssmaul: SP({ n: 9, name: 'Abyssmaul', types: ['water', 'fighting'], base: [95, 108, 85, 72, 80, 90], growth: 'mslow', catch: 45, exp: 239, rarity: 'rare', line: 'puddlepup',
    evo: [], moves: [[1, 'tide_rally'], [1, 'rock_smash'], [22, 'brine_bite'], [28, 'bubble_beam'], [36, 'bulk_up'], [40, 'low_kick'], [44, 'body_slam']],
    habitat: 'Evolves from Brinehound', desc: 'A deep-sea brawler with barnacle knuckles. It trains by punching waves until they break.' }),
  burrowbit: SP({ n: 10, name: 'Burrowbit', types: ['normal'], base: [38, 44, 36, 28, 34, 62], growth: 'medium', catch: 255, exp: 50, rarity: 'common', line: 'burrowbit',
    evo: [{ to: 'warrenbuck', lv: 18 }], moves: [[1, 'tackle'], [1, 'tail_whip'], [5, 'quick_attack'], [9, 'mud_slap'], [13, 'headbutt'], [17, 'dig_claw']],
    habitat: 'Route 1 tall grass', desc: 'A round little rabbit that digs a new burrow every night. It is never far from a clover patch.' }),
  warrenbuck: SP({ n: 11, name: 'Warrenbuck', types: ['normal'], base: [68, 78, 58, 44, 58, 94], growth: 'medium', catch: 120, exp: 145, rarity: 'uncommon', line: 'burrowbit',
    evo: [], moves: [[1, 'quick_attack'], [1, 'mud_slap'], [13, 'headbutt'], [18, 'dig_claw'], [24, 'bite'], [30, 'body_slam']],
    habitat: 'Evolves from Burrowbit', desc: 'The warden of a whole warren. Its stamping feet can be heard a field away.' }),
  twigwing: SP({ n: 12, name: 'Twigwing', types: ['air', 'normal'], base: [40, 45, 38, 32, 34, 58], growth: 'mslow', catch: 255, exp: 50, rarity: 'common', line: 'twigwing',
    evo: [{ to: 'gustfinch', lv: 17 }], moves: [[1, 'peck'], [1, 'growl'], [5, 'gust'], [9, 'quick_attack'], [14, 'wing_attack']],
    habitat: 'Route 1 tall grass', desc: 'A sparrow that builds nests from twigs it steals off garden fences.' }),
  gustfinch: SP({ n: 13, name: 'Gustfinch', types: ['air', 'normal'], base: [60, 62, 55, 45, 50, 78], growth: 'mslow', catch: 120, exp: 122, rarity: 'uncommon', line: 'twigwing',
    evo: [{ to: 'tempestral', lv: 36 }], moves: [[1, 'peck'], [1, 'gust'], [9, 'quick_attack'], [14, 'wing_attack'], [21, 'headbutt']],
    habitat: 'Evolves from Twigwing', desc: 'It rides the sea breeze for hours without flapping once.' }),
  tempestral: SP({ n: 14, name: 'Tempestral', types: ['air'], base: [80, 90, 72, 60, 68, 104], growth: 'mslow', catch: 45, exp: 216, rarity: 'rare', line: 'twigwing',
    evo: [], moves: [[1, 'wing_attack'], [1, 'quick_attack'], [21, 'headbutt'], [36, 'body_slam']],
    habitat: 'Evolves from Gustfinch', desc: 'A storm-hawk that dives through lightning. Sailors take its cry as a sign to turn for home.' }),
  grubble: SP({ n: 15, name: 'Grubble', types: ['grass'], base: [42, 30, 38, 22, 26, 40], growth: 'fast', catch: 255, exp: 39, rarity: 'common', line: 'grubble',
    evo: [{ to: 'silkcase', lv: 7 }], moves: [[1, 'tackle'], [1, 'harden']],
    habitat: 'Route 1 tall grass', desc: 'A plump caterpillar that eats twice its weight in clover each day.' }),
  silkcase: SP({ n: 16, name: 'Silkcase', types: ['grass'], base: [48, 22, 62, 26, 40, 22], growth: 'fast', catch: 120, exp: 72, rarity: 'common', line: 'grubble',
    evo: [{ to: 'lumoth', lv: 10 }], moves: [[1, 'harden'], [7, 'harden']],
    habitat: 'Evolves from Grubble', desc: 'Wrapped in glowing silk, it waits. If you listen closely, you can hear it humming.' }),
  lumoth: SP({ n: 17, name: 'Lumoth', types: ['light', 'air'], base: [62, 40, 52, 85, 76, 80], growth: 'fast', catch: 45, exp: 178, rarity: 'uncommon', line: 'grubble',
    evo: [], moves: [[1, 'gust'], [1, 'glimmer'], [10, 'stun_spore'], [13, 'sleep_powder'], [16, 'dazzle'], [20, 'confusion'], [26, 'radiant_pulse']],
    habitat: 'Evolves from Silkcase', desc: 'A moth whose wings glow like lantern glass. Swarms of them were once mistaken for falling stars.' }),
  zappik: SP({ n: 18, name: 'Zappik', types: ['electric'], base: [38, 42, 34, 58, 42, 76], growth: 'medium', catch: 150, exp: 60, rarity: 'uncommon', line: 'zappik',
    evo: [{ to: 'joltfox', item: 'thunder_shard' }], moves: [[1, 'thundershock'], [1, 'growl'], [6, 'quick_attack'], [10, 'thunder_wave'], [15, 'spark'], [20, 'bite']],
    habitat: 'Route 1 tall grass (uncommon)', desc: 'A fox kit whose fur crackles with static. It loves to sneak up and give you a tiny shock.' }),
  joltfox: SP({ n: 19, name: 'Joltfox', types: ['electric'], base: [60, 65, 52, 95, 68, 110], growth: 'medium', catch: 75, exp: 170, rarity: 'rare', line: 'zappik',
    evo: [], moves: [[1, 'thundershock'], [1, 'spark'], [10, 'thunder_wave'], [20, 'bite']],
    habitat: 'Evolves from Zappik with a Thunder Shard', desc: 'Its three tails store lightning. On stormy nights it races the thunder across the moors.' }),
  pebblin: SP({ n: 20, name: 'Pebblin', types: ['rock'], base: [42, 62, 78, 26, 36, 22], growth: 'mslow', catch: 200, exp: 60, rarity: 'common', line: 'pebblin',
    evo: [{ to: 'bouldrum', lv: 25 }], moves: [[1, 'tackle'], [1, 'harden'], [6, 'rock_throw'], [11, 'mud_slap'], [16, 'rock_tomb']],
    habitat: 'Hollowpeak Cave', desc: 'A pebble that rolled away from home and never stopped. It is quite proud of how round it is.' }),
  bouldrum: SP({ n: 21, name: 'Bouldrum', types: ['rock'], base: [62, 88, 105, 36, 50, 34], growth: 'mslow', catch: 120, exp: 137, rarity: 'uncommon', line: 'pebblin',
    evo: [{ to: 'cragmaw', rite: true }], moves: [[1, 'rock_throw'], [1, 'harden'], [16, 'rock_tomb'], [25, 'rock_smash'], [30, 'body_slam']],
    habitat: 'Evolves from Pebblin', desc: 'It drums on its own chest to echo through the caves and find its friends.' }),
  cragmaw: SP({ n: 22, name: 'Cragmaw', types: ['rock', 'earth'], base: [84, 120, 130, 50, 66, 40], growth: 'mslow', catch: 45, exp: 223, rarity: 'rare', line: 'pebblin',
    evo: [], moves: [[1, 'rock_tomb'], [1, 'dig_claw'], [30, 'body_slam'], [36, 'iron_defense']],
    habitat: 'Evolves from Bouldrum by Rite of Passage', desc: 'A walking cliff with a cavernous jaw. It chews gravel to keep its teeth sharp.' }),
  murkle: SP({ n: 23, name: 'Murkle', types: ['poison', 'water'], base: [55, 42, 46, 52, 52, 33], growth: 'medium', catch: 190, exp: 65, rarity: 'common', line: 'murkle',
    evo: [{ to: 'bogmire', lv: 30 }], moves: [[1, 'poison_sting'], [1, 'bubble'], [8, 'smog'], [12, 'acid'], [18, 'mud_shot'], [24, 'bubble_beam']],
    habitat: 'Ponds (fishing)', desc: 'A slimy pond-blob that soaks up muck. Ponds with Murkle in them are always crystal clear.' }),
  bogmire: SP({ n: 24, name: 'Bogmire', types: ['poison', 'water'], base: [88, 70, 74, 82, 80, 46], growth: 'medium', catch: 75, exp: 160, rarity: 'uncommon', line: 'murkle',
    evo: [], moves: [[1, 'smog'], [1, 'acid'], [18, 'mud_shot'], [24, 'bubble_beam'], [30, 'body_slam']],
    habitat: 'Evolves from Murkle', desc: 'A heaving marsh-spirit. Lost travellers in Saltmere swear it has led them home.' }),
  wispet: SP({ n: 25, name: 'Wispet', types: ['ghost'], base: [36, 34, 32, 62, 48, 58], growth: 'mslow', catch: 120, exp: 62, rarity: 'uncommon', line: 'wispet',
    evo: [{ to: 'lanternwisp', lv: 28 }], moves: [[1, 'lick'], [1, 'confuse_ray'], [8, 'night_shade'], [14, 'hypnosis'], [20, 'shadow_swipe']],
    habitat: 'Route 1 at night', desc: 'A drifting wisp that follows lights it likes. It is harmless, just very curious.' }),
  lanternwisp: SP({ n: 26, name: 'Lanternwisp', types: ['ghost', 'light'], base: [52, 44, 46, 88, 70, 80], growth: 'mslow', catch: 45, exp: 150, rarity: 'rare', line: 'wispet',
    evo: [{ to: 'gloamshade', item: 'dusk_shard' }], moves: [[1, 'night_shade'], [1, 'glimmer'], [14, 'hypnosis'], [20, 'shadow_swipe'], [28, 'radiant_pulse']],
    habitat: 'Evolves from Wispet', desc: 'It carries a flame inside its body like a lantern. Old sailors called them harbour-ghosts.' }),
  gloamshade: SP({ n: 27, name: 'Gloamshade', types: ['ghost', 'light'], base: [66, 60, 60, 115, 90, 99], growth: 'mslow', catch: 45, exp: 225, rarity: 'rare', line: 'wispet',
    evo: [], moves: [[1, 'radiant_pulse'], [1, 'confuse_ray'], [20, 'shadow_swipe'], [30, 'hypnosis']],
    habitat: 'Evolves from Lanternwisp with a Dusk Shard', desc: 'A tall shade cloaked in twilight. Its lantern-heart burns brightest when its trainer is afraid.' }),
  fawnlight: SP({ n: 28, name: 'Fawnlight', types: ['light'], base: [48, 46, 42, 50, 50, 64], growth: 'medium', catch: 45, exp: 70, rarity: 'veryrare', line: 'fawnlight',
    evo: [{ to: 'solstag', item: 'sun_shard' }, { to: 'noxstag', bond: 220, time: 'night' }], moves: [[1, 'tackle'], [1, 'glimmer'], [6, 'quick_attack'], [11, 'dazzle'], [16, 'headbutt'], [22, 'radiant_pulse']],
    habitat: 'Route 1 tall grass (very rare)', desc: 'A fawn with dapples that glow at dusk. What it grows into depends on the life it leads.' }),
  solstag: SP({ n: 29, name: 'Solstag', types: ['light', 'fire'], base: [78, 90, 70, 95, 75, 92], growth: 'medium', catch: 45, exp: 184, rarity: 'veryrare', line: 'fawnlight',
    evo: [], moves: [[1, 'glimmer'], [1, 'ember'], [16, 'headbutt'], [22, 'radiant_pulse'], [28, 'flame_burst']],
    habitat: 'Evolves from Fawnlight with a Sun Shard', desc: 'Its antlers hold the noon sun. Fields it walks through ripen a week early.' }),
  noxstag: SP({ n: 30, name: 'Noxstag', types: ['dark'], base: [78, 98, 72, 82, 80, 90], growth: 'medium', catch: 45, exp: 184, rarity: 'veryrare', line: 'fawnlight',
    evo: [], moves: [[1, 'bite'], [1, 'dazzle'], [16, 'headbutt'], [22, 'shadow_swipe'], [28, 'confuse_ray']],
    habitat: 'Evolves from Fawnlight with deep trust, at night', desc: 'A midnight stag crowned with a silver crescent. It guards those who are kind to it.' }),
  shellsnip: SP({ n: 31, name: 'Shellsnip', types: ['water', 'rock'], base: [40, 64, 68, 30, 36, 42], growth: 'medium', catch: 190, exp: 62, rarity: 'common', line: 'shellsnip',
    evo: [{ to: 'reefclamp', lv: 33 }], moves: [[1, 'scratch'], [1, 'harden'], [6, 'bubble'], [11, 'rock_throw'], [16, 'metal_claw'], [22, 'brine_bite']],
    habitat: 'Emberlow sea (fishing)', desc: 'A beach crab that snips at anything shiny. It hoards Sea Glass in its burrow.' }),
  reefclamp: SP({ n: 32, name: 'Reefclamp', types: ['water', 'rock'], base: [62, 98, 108, 52, 62, 58], growth: 'medium', catch: 75, exp: 165, rarity: 'uncommon', line: 'shellsnip',
    evo: [], moves: [[1, 'brine_bite'], [1, 'metal_claw'], [22, 'rock_tomb'], [33, 'iron_defense']],
    habitat: 'Evolves from Shellsnip', desc: 'Its claws can crack ship timbers. Divers leave it alone and it leaves them alone.' }),
  molekin: SP({ n: 33, name: 'Molekin', types: ['earth'], base: [50, 58, 46, 26, 38, 40], growth: 'medium', catch: 190, exp: 58, rarity: 'common', line: 'molekin',
    evo: [{ to: 'tunnelord', lv: 34 }], moves: [[1, 'scratch'], [1, 'mud_slap'], [8, 'dig_claw'], [14, 'rock_smash'], [20, 'mud_shot']],
    habitat: 'Hollowpeak Cave', desc: 'A velvet mole with shovel paws. It surfaces to sniff the air, then vanishes again.' }),
  tunnelord: SP({ n: 34, name: 'Tunnelord', types: ['earth', 'steel'], base: [80, 98, 78, 42, 60, 62], growth: 'medium', catch: 75, exp: 166, rarity: 'uncommon', line: 'molekin',
    evo: [], moves: [[1, 'dig_claw'], [1, 'metal_claw'], [20, 'mud_shot'], [34, 'iron_defense']],
    habitat: 'Evolves from Molekin', desc: 'Its steel snout bores through bedrock. Miners follow its tunnels to find new seams.' }),
  shadepaw: SP({ n: 35, name: 'Shadepaw', types: ['dark'], base: [42, 58, 40, 38, 40, 72], growth: 'medium', catch: 150, exp: 62, rarity: 'uncommon', line: 'shadepaw',
    evo: [{ to: 'nightprowl', lv: 30, time: 'night' }], moves: [[1, 'scratch'], [1, 'growl'], [6, 'bite'], [11, 'quick_attack'], [17, 'shadow_swipe'], [23, 'confuse_ray']],
    habitat: 'Route 1 at night', desc: 'A cat that prowls only after dark. Its eyes are the last thing you notice.' }),
  nightprowl: SP({ n: 36, name: 'Nightprowl', types: ['dark'], base: [68, 94, 62, 58, 62, 106], growth: 'medium', catch: 75, exp: 168, rarity: 'rare', line: 'shadepaw',
    evo: [], moves: [[1, 'bite'], [1, 'shadow_swipe'], [23, 'confuse_ray'], [30, 'body_slam']],
    habitat: 'Evolves from Shadepaw at night', desc: 'A silent hunter of the moors. It walks in the shadows of other people\'s lanterns.' }),
  flopfin: SP({ n: 37, name: 'Flopfin', types: ['water'], base: [30, 26, 34, 20, 30, 62], growth: 'slow', catch: 255, exp: 30, rarity: 'common', line: 'flopfin',
    evo: [{ to: 'gyrefin', lv: 20 }], moves: [[1, 'splash'], [10, 'tackle'], [15, 'aqua_jet']],
    habitat: 'Any water (fishing)', desc: 'Famously useless. Yet every Gyrefin that ever crossed the Sound started out as one.' }),
  gyrefin: SP({ n: 38, name: 'Gyrefin', types: ['water', 'air'], base: [70, 84, 66, 60, 70, 92], growth: 'slow', catch: 45, exp: 170, rarity: 'uncommon', line: 'flopfin',
    evo: [], moves: [[1, 'aqua_jet'], [1, 'wing_attack'], [20, 'bite'], [25, 'brine_bite'], [32, 'bubble_beam']],
    habitat: 'Evolves from Flopfin', desc: 'It skims across the waves on wing-fins and leaps clean over fishing boats.' }),
  lumifin: SP({ n: 39, name: 'Lumifin', types: ['water', 'light'], base: [70, 40, 62, 88, 90, 70], growth: 'slow', catch: 25, exp: 190, rarity: 'veryrare', line: 'lumifin',
    evo: [], moves: [[1, 'water_gun'], [1, 'glimmer'], [10, 'dazzle'], [16, 'bubble_beam'], [22, 'radiant_pulse']],
    habitat: 'Any water at night (very rare)', desc: 'A deep-water fish with a lantern lure. Fishermen say seeing one means a calm sea for a year.' }),
  kindlit: SP({ n: 40, name: 'Candlit', types: ['fire', 'light'], base: [48, 40, 44, 80, 66, 72], growth: 'mslow', catch: 30, exp: 150, rarity: 'veryrare', line: 'kindlit',
    evo: [], moves: [[1, 'ember'], [1, 'glimmer'], [9, 'will_o'], [14, 'dazzle'], [20, 'flame_burst'], [26, 'radiant_pulse']],
    habitat: 'Route 1 at night (very rare)', desc: 'A tiny flame spirit that sleeps in old lanterns. Legend says it is a spark of the first Beacon.' }),
};
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
DATA.dexSize = 180;

/* ---------- Encounters ----------
   [species, weight, minLv, maxLv]; 'night' table used 19:30–06:00 */
DATA.encounters = {
  route1: {
    grass: {
      day: [['burrowbit', 34, 2, 4], ['twigwing', 30, 2, 4], ['grubble', 26, 2, 4], ['zappik', 8, 3, 5], ['fawnlight', 2, 4, 5]],
      night: [['shadepaw', 30, 3, 5], ['burrowbit', 22, 2, 4], ['wispet', 22, 3, 5], ['grubble', 16, 2, 4], ['zappik', 7, 3, 5], ['kindlit', 3, 4, 5]],
    },
    fish: { day: [['flopfin', 72, 3, 6], ['murkle', 28, 4, 6]], night: [['flopfin', 62, 3, 6], ['murkle', 32, 4, 6], ['lumifin', 6, 6, 8]] },
  },
  emberlow: { fish: { day: [['flopfin', 60, 3, 6], ['shellsnip', 40, 4, 7]], night: [['flopfin', 55, 3, 6], ['shellsnip', 39, 4, 7], ['lumifin', 6, 6, 8]] } },
  fernwick: { fish: { day: [['flopfin', 62, 4, 7], ['murkle', 38, 5, 7]], night: [['flopfin', 56, 4, 7], ['murkle', 38, 5, 7], ['lumifin', 6, 6, 8]] } },
};

/* ---------- Trainers ---------- */
DATA.trainers = {
  kit1: { cls: 'Rival', name: 'Kit', look: 'kit', team: [], prize: 80, ai: 'basic',
    lose: "What?! Beginner's luck. That's all it was!", win: "Ha! Told you I picked the strongest one!" },
  tom: { cls: 'Youngster', name: 'Tom', look: 'boy', team: [['burrowbit', 4]], prize: 16, ai: 'basic',
    intro: "You've got a Wildmon now? Me too! Remember what I promised? Let's battle!", lose: 'Aww, my Burrowbit tried its best!', after: "I'm going to train in the tall grass every day until I beat you." },
  bram: { cls: 'Hiker', name: 'Bram', look: 'hiker', team: [['pebblin', 5], ['molekin', 4]], prize: 24, ai: 'basic',
    intro: "Ho! A new trainer! Let's see if you've got the legs for the long road!", lose: 'Solid as a rock, you are!', after: 'Ledges, rocks and caves. That\'s a hiker\'s life. You\'ll find Pebblin in Hollowpeak Cave one day.' },
  ivy: { cls: 'Picnicker', name: 'Ivy', look: 'girl', team: [['flopfin', 5], ['grubble', 4]], prize: 20, ai: 'basic',
    intro: "You scared it away! Right, you'll have to battle me instead!", lose: 'Even my Flopfin tried. Sort of.', after: 'Try fishing in this pond at night. Something glows down there!' },
  stud1: { cls: 'Student', name: 'Ada', look: 'student', team: [['twigwing', 5], ['burrowbit', 5]], prize: 20, ai: 'basic',
    intro: "A practice battle? Yes please! I've been reading all week!", lose: 'Oh! I should have read chapter two.', after: 'Status moves like Grumble look weak, but they really add up!' },
  stud2: { cls: 'Student', name: 'Ben', look: 'student2', team: [['zappik', 6]], prize: 24, ai: 'basic',
    intro: "My Zappik is the fastest in class. Want to see?", lose: 'Fast is not the same as strong, huh.', after: "Speed decides who moves first. Paralysis halves it, though!" },
  hollis: { cls: 'Teacher', name: 'Ms Hollis', look: 'teacher', team: [['shellsnip', 7], ['twigwing', 7], ['murkle', 8]], prize: 40, ai: 'basic', repeat: true,
    intro: 'Pencils down! This is your practice exam. Show me what you have learned!', lose: 'Excellent work! Top marks!', after: 'Come back for another practice exam whenever you like. Repetition builds strong Wildmon.' },
};

/* =====================================================================
   MONSTER LOGIC (pure)
   ===================================================================== */
const Mon = {
  expAt(growth, lv) {
    const n = lv;
    if (lv <= 1) return 0;
    switch (growth) {
      case 'fast': return Math.floor(4 * n ** 3 / 5);
      case 'medium': return n ** 3;
      case 'slow': return Math.floor(5 * n ** 3 / 4);
      default: return Math.max(0, Math.floor(6 / 5 * n ** 3 - 15 * n ** 2 + 100 * n - 140));
    }
  },
  sp(m) { return DATA.species[m.sp]; },
  name(m) { return m.nick || DATA.species[m.sp].name; },
  trait(m) { const t = DATA.species[m.sp].traits; return t && t.length ? t[(m.ti || 0) % t.length] : null; },
  masteryRank(line, mastery) { const pts = (mastery || {})[line] || 0; let r = 0; for (const [n] of DATA.masteryRanks) if (pts >= n) r++; return r; },
  stats(m, mastery) {
    const s = DATA.species[m.sp]; const t = DATA.temperaments[m.temp];
    const rank = Mon.masteryRank(s.line, mastery !== undefined ? mastery : (typeof G !== 'undefined' && G ? G.mastery : null));
    const bonus = (1 + (m.att || 0) / 100) * (rank >= 3 ? 1.02 : 1);
    const out = {};
    DATA.statKeys.forEach((k, i) => {
      const core = Math.floor((2 * s.base[i] + 2 * m.pot[k]) * m.lv / 100) + Math.floor(((m.train && m.train[k]) || 0) * m.lv / 100);
      if (k === 'hp') out.hp = Math.floor((core + m.lv + 10) * bonus);
      else { let v = core + 5; if (t[1] === k) v *= 1.1; if (t[2] === k) v *= 0.9; out[k] = Math.floor(v * bonus); }
    });
    return out;
  },
  maxHp(m) { return Mon.stats(m).hp; },
  movesAt(sp, lv) {
    const learn = DATA.species[sp].moves.filter(([l]) => l <= lv).map(([, id]) => id);
    const uniq = []; for (const id of learn) { const i = uniq.indexOf(id); if (i >= 0) uniq.splice(i, 1); uniq.push(id); }
    return uniq.slice(-4).map((id) => ({ id, pp: DATA.moves[id].pp }));
  },
  newMovesAt(sp, lv) { return DATA.species[sp].moves.filter(([l]) => l === lv).map(([, id]) => id); },
  potentialTotal(m) { return DATA.statKeys.reduce((a, k) => a + m.pot[k], 0); },
  grade(m) { const t = Mon.potentialTotal(m); return t >= 85 ? 'S' : t >= 70 ? 'A' : t >= 55 ? 'B' : t >= 40 ? 'C' : t >= 25 ? 'D' : 'F'; },
  create(sp, lv, opt = {}) {
    const R = opt.rng || Math.random;
    const s = DATA.species[sp];
    const lustreOdds = opt.lustreOdds || 1 / 1024;
    const lustre = opt.lustre != null ? opt.lustre : R() < lustreOdds;
    const mark = opt.mark !== undefined ? opt.mark : (R() < 1 / 256 ? DATA.marks[Math.floor(R() * DATA.marks.length)] : null);
    const floor = opt.potFloor || (mark ? 6 : 0);
    const pot = {}; DATA.statKeys.forEach((k) => { pot[k] = floor + Math.floor(R() * (16 - floor)); });
    if (opt.pot) Object.assign(pot, opt.pot);
    const m = {
      uid: opt.uid || (Date.now().toString(36) + Math.floor(R() * 1e9).toString(36)),
      sp, nick: null, lv, exp: Mon.expAt(s.growth, lv), pot, temp: opt.temp != null ? opt.temp : Math.floor(R() * DATA.temperaments.length),
      moves: opt.moves ? opt.moves.map((id) => ({ id, pp: DATA.moves[id].pp })) : Mon.movesAt(sp, lv),
      hp: 0, status: null, bond: opt.bond != null ? opt.bond : 70, lustre: !!lustre, mark: mark || null, att: 0, appraised: false,
      met: opt.met || null, ti: opt.ti != null ? opt.ti : Math.floor(R() * 2), item: opt.item || null,
    };
    m.hp = Mon.stats(m, opt.mastery || {}).hp;
    return m;
  },
  heal(m) { m.hp = Mon.maxHp(m); m.status = null; m.moves.forEach((mv) => { mv.pp = DATA.moves[mv.id].pp; }); },
  evolution(m, ctx = {}) {
    if (m.item === 'stillstone') return null;
    for (const e of DATA.species[m.sp].evo || []) {
      if (!DATA.species[e.to]) continue;
      if (e.lv && m.lv >= e.lv && (!e.time || e.time === ctx.time)) return e.to;
      if (e.bond && m.bond >= e.bond && (!e.time || e.time === ctx.time) && ctx.levelUp) return e.to;
    }
    return null;
  },
  evoText(e) {
    const t = DATA.species[e.to] ? DATA.species[e.to].name : '???';
    if (e.lv) return `${t} at Lv ${e.lv}${e.time ? ` (${e.time})` : ''}`;
    if (e.item) return `${t} with a ${e.item.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`;
    if (e.bond) return `${t} with high Bond${e.time ? ` at ${e.time}` : ''}`;
    if (e.rite) return `${t} by Rite of Passage`;
    return t;
  },
};

/* =====================================================================
   MONSTER SPRITES — procedural pixel art, 48x48
   ===================================================================== */
function hueShift(hex, deg) {
  let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  h = (h + deg / 360 + 1) % 1;
  const f = (p, q, t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  let rr, gg, bb; if (!s) rr = gg = bb = l; else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; rr = f(p, q, h + 1 / 3); gg = f(p, q, h); bb = f(p, q, h - 1 / 3); }
  return '#' + [rr, gg, bb].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}

const MonArt = {
  cache: new Map(),
  get(sp, opt = {}) {
    const key = `${sp}|${opt.back ? 1 : 0}|${opt.blink ? 1 : 0}|${opt.lustre ? 1 : 0}|${opt.mark || ''}|${opt.sil ? 1 : 0}`;
    let c = this.cache.get(key); if (c) return c;
    c = this.render(DATA.species[sp], opt); this.cache.set(key, c); return c;
  },
};
