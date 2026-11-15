'use strict';
/* =====================================================================
   ACT II DATA — Route 3, Hollowpeak Cave, Voltara (Spark Hall, Power
   Plant), Route 4 and the sea crossing, Cinderhollow (Forge Hall),
   Emberforge Volcano.
   ===================================================================== */

Object.assign(DATA.tiles, {
  'z': { t: 'laser', solid: true, dyn: true, text: 'A crackling laser fence. A switch somewhere must turn it off.' },
  'Z': { t: 'laser', solid: true, dyn: true, text: 'A crackling laser fence. A switch somewhere must turn it off.' },
  'c': { t: 'laseroff' },
  'N': { t: 'metal' },
  '1': { t: 'belt_u', slide: 'up' }, '3': { t: 'belt_d', slide: 'down' }, '5': { t: 'belt_l', slide: 'left' }, '7': { t: 'belt_r', slide: 'right' },
  'i': { t: 'pit', solid: true, dyn: true, text: 'A pit of bubbling lava. A big enough boulder might fill it.' },
  'j': { t: 'pitfill' },
  'a': { t: 'ash' },
  'l': { t: 'lava', solid: true, text: 'Molten lava. Definitely not for swimming.' },
  'X': { t: 'basalt', solid: true },
});

/* ---------- Moves ---------- */
Object.assign(DATA.moves, {
  magma_slam: { name: 'Magma Slam', type: 'fire', cat: 'phys', pow: 85, acc: 95, pp: 10, eff: 'brn', ch: 20, desc: 'Slams into the foe with a molten body. May burn.' },
  drill_peck: { name: 'Spiral Peck', type: 'air', cat: 'phys', pow: 80, acc: 100, pp: 20, desc: 'A spinning, corkscrew peck.' },
  jab_rush: { name: 'Jab Rush', type: 'fighting', cat: 'phys', pow: 40, acc: 100, pp: 30, pri: 1, desc: 'A lightning-quick jab that always strikes first.' },
  arc_bolt: { name: 'Arc Bolt', type: 'electric', cat: 'phys', pow: 80, acc: 100, pp: 15, eff: 'par', ch: 20, desc: 'Charges in wrapped in electricity. May paralyse.' },
  gear_grind: { name: 'Gear Grind', type: 'steel', cat: 'phys', pow: 70, acc: 95, pp: 15, eff: 'foe', st: { def: -1 }, ch: 30, desc: 'Grinds the foe between steel gears. May lower Defence.' },
  ember_storm: { name: 'Ember Storm', type: 'fire', cat: 'spec', pow: 75, acc: 100, pp: 15, eff: 'brn', ch: 10, desc: 'A swirl of glowing embers. May burn.' },
  crystal_beam: { name: 'Crystal Beam', type: 'rock', cat: 'spec', pow: 75, acc: 95, pp: 15, eff: 'conf', ch: 10, desc: 'Fires light through a crystal. May confuse.' },
  wraith_flame: { name: 'Wraith Flame', type: 'ghost', cat: 'spec', pow: 70, acc: 100, pp: 15, eff: 'brn', ch: 20, desc: 'A cold blue flame. May burn.' },
});

/* ---------- Species #64–83 ---------- */
Object.assign(DATA.species, {
  fizzbat: { n: 64, name: 'Fizzbat', types: ['electric', 'air'], base: [42, 44, 38, 58, 44, 74], growth: 'medium', catch: 190, exp: 62, rarity: 'common', line: 'fizzbat',
    evo: [{ to: 'thunderwing', lv: 25 }], moves: [[1, 'thundershock'], [1, 'gust'], [8, 'quick_attack'], [13, 'confuse_ray'], [18, 'wing_attack'], [22, 'spark']], traits: ['static', 'night_eyes'],
    habitat: 'Hollowpeak Cave; Voltara Dynamo Works', desc: 'A bat that sleeps hanging from power lines. Its fur crackles when it is excited.' },
  thunderwing: { n: 65, name: 'Fulgurbat', types: ['electric', 'air'], base: [68, 70, 60, 92, 66, 104], growth: 'medium', catch: 60, exp: 168, rarity: 'common', line: 'fizzbat',
    evo: [], moves: [[1, 'thundershock'], [1, 'gust'], [8, 'quick_attack'], [13, 'confuse_ray'], [18, 'wing_attack'], [22, 'spark'], [25, 'air_slash'], [32, 'thunderbolt']], traits: ['static', 'night_eyes'],
    habitat: 'Evolves from Fizzbat', desc: 'A great bat whose wings spark with every beat. Storms seem to follow it home.' },
  coilbug: { n: 66, name: 'Coilbug', types: ['electric', 'steel'], base: [48, 50, 66, 52, 50, 40], growth: 'medium', catch: 150, exp: 64, rarity: 'uncommon', line: 'coilbug',
    evo: [{ to: 'dynacoil', lv: 27 }], moves: [[1, 'tackle'], [1, 'thundershock'], [7, 'harden'], [12, 'metal_claw'], [17, 'spark'], [23, 'thunder_wave']], traits: ['static', 'sturdy'],
    habitat: 'Voltara Dynamo Works', desc: 'A beetle with a copper-coil shell. Engineers find them nesting inside warm transformers.' },
  dynacoil: { n: 67, name: 'Teslacoil', types: ['electric', 'steel'], base: [70, 82, 100, 80, 72, 56], growth: 'medium', catch: 45, exp: 172, rarity: 'uncommon', line: 'coilbug',
    evo: [], moves: [[1, 'tackle'], [1, 'thundershock'], [7, 'harden'], [12, 'metal_claw'], [17, 'spark'], [23, 'thunder_wave'], [27, 'arc_bolt'], [33, 'iron_head'], [40, 'thunderbolt']], traits: ['static', 'sturdy'],
    habitat: 'Evolves from Coilbug', desc: 'Its coiled shell works like a dynamo. A single Teslacoil can light a farmhouse for a night.' },
  gearling: { n: 68, name: 'Gearling', types: ['steel'], base: [46, 58, 70, 30, 46, 40], growth: 'mslow', catch: 150, exp: 64, rarity: 'uncommon', line: 'gearling',
    evo: [{ to: 'cogmaul', lv: 28 }], moves: [[1, 'tackle'], [1, 'harden'], [8, 'metal_claw'], [13, 'rock_throw'], [18, 'iron_defense'], [23, 'gear_grind']], traits: ['sturdy', 'iron_hide'],
    habitat: 'Hollowpeak Cave', desc: 'A little round Wildmon with a gear for a back. It rolls downhill whenever it gets the chance.' },
  cogmaul: { n: 69, name: 'Cogtitan', types: ['steel', 'fighting'], base: [78, 108, 100, 40, 70, 54], growth: 'mslow', catch: 45, exp: 175, rarity: 'uncommon', line: 'gearling',
    evo: [], moves: [[1, 'tackle'], [1, 'harden'], [8, 'metal_claw'], [13, 'rock_throw'], [18, 'iron_defense'], [23, 'gear_grind'], [28, 'focus_strike'], [34, 'iron_head'], [40, 'bulk_up']], traits: ['sturdy', 'grit'],
    habitat: 'Evolves from Gearling', desc: 'A hulking brawler with gears for fists. It works the mines at night, just for fun.' },
  magmite: { n: 70, name: 'Magmite', types: ['fire', 'rock'], base: [46, 58, 62, 50, 42, 38], growth: 'mslow', catch: 150, exp: 64, rarity: 'common', line: 'magmite',
    evo: [{ to: 'volcarn', lv: 30 }], moves: [[1, 'ember'], [1, 'rock_throw'], [9, 'harden'], [14, 'fire_fang'], [19, 'rock_tomb'], [25, 'magma_slam']], traits: ['sturdy', 'blaze'],
    habitat: 'Emberforge Volcano; Cinderhollow', desc: 'A lump of cooling lava with eyes. It warms its paws in the vents on cold mornings.' },
  volcarn: { n: 71, name: 'Volcarn', types: ['fire', 'rock'], base: [80, 100, 100, 70, 62, 48], growth: 'mslow', catch: 45, exp: 178, rarity: 'common', line: 'magmite',
    evo: [], moves: [[1, 'ember'], [1, 'rock_throw'], [9, 'harden'], [14, 'fire_fang'], [19, 'rock_tomb'], [25, 'magma_slam'], [30, 'rock_slide'], [38, 'flamethrower'], [44, 'tremor']], traits: ['sturdy', 'blaze'],
    habitat: 'Evolves from Magmite', desc: 'A walking volcano. When it is angry, smoke pours from the crater on its back.' },
  cindertoad: { n: 72, name: 'Scorchtoad', types: ['fire', 'poison'], base: [52, 44, 46, 62, 52, 48], growth: 'medium', catch: 150, exp: 64, rarity: 'common', line: 'cindertoad',
    evo: [{ to: 'ashtoad', lv: 26 }], moves: [[1, 'ember'], [1, 'smog'], [8, 'acid'], [13, 'will_o'], [18, 'flame_burst'], [22, 'sludge']], traits: ['toxic_touch', 'blaze'],
    habitat: 'Cinderhollow; Route 4', desc: 'A toad that bathes in hot springs. Its croak smells faintly of sulphur.' },
  ashtoad: { n: 73, name: 'Ashtoad', types: ['fire', 'poison'], base: [84, 62, 72, 94, 78, 60], growth: 'medium', catch: 45, exp: 172, rarity: 'common', line: 'cindertoad',
    evo: [], moves: [[1, 'ember'], [1, 'smog'], [8, 'acid'], [13, 'will_o'], [18, 'flame_burst'], [22, 'sludge'], [26, 'ember_storm'], [34, 'flamethrower'], [40, 'mend']], traits: ['toxic_touch', 'thick_fur'],
    habitat: 'Evolves from Scorchtoad', desc: 'It puffs out clouds of hot ash to hide. Hot spring keepers say it brings good luck.' },
  pummelo: { n: 74, name: 'Pummelo', types: ['fighting'], base: [56, 70, 44, 30, 40, 60], growth: 'mslow', catch: 150, exp: 66, rarity: 'uncommon', line: 'pummelo',
    evo: [{ to: 'gauntlord', lv: 28 }], moves: [[1, 'low_kick'], [1, 'growl'], [7, 'jab_rush'], [12, 'rock_smash'], [17, 'bulk_up'], [23, 'focus_strike']], traits: ['grit', 'keen_eye'],
    habitat: 'Route 3; Route 4', desc: 'A round little boxer that trains by punching falling leaves. It has never caught one.' },
  gauntlord: { n: 75, name: 'Haymaker', types: ['fighting'], base: [86, 112, 70, 40, 64, 88], growth: 'mslow', catch: 45, exp: 178, rarity: 'uncommon', line: 'pummelo',
    evo: [], moves: [[1, 'low_kick'], [1, 'growl'], [7, 'jab_rush'], [12, 'rock_smash'], [17, 'bulk_up'], [23, 'focus_strike'], [28, 'war_cry'], [36, 'reckless_charge']], traits: ['grit', 'glare'],
    habitat: 'Evolves from Pummelo', desc: 'Its great red gauntlets are actually its fists. Champions of old trained with Haymaker sparring partners.' },
  quartzling: { n: 76, name: 'Quartzling', types: ['rock', 'psychic'], base: [48, 40, 64, 64, 60, 44], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'quartzling',
    evo: [{ to: 'geodrake', lv: 30 }], moves: [[1, 'confusion'], [1, 'harden'], [8, 'rock_throw'], [13, 'dazzle'], [18, 'psybeam'], [24, 'crystal_beam']], traits: ['sturdy', 'radiance'],
    habitat: 'Hollowpeak Cave (deep)', desc: 'A cluster of crystal that hums when you hold it. Each crystal grows a little every full moon.' },
  geodrake: { n: 77, name: 'Geodragon', types: ['rock', 'psychic'], base: [72, 66, 100, 96, 90, 56], growth: 'mslow', catch: 45, exp: 180, rarity: 'uncommon', line: 'quartzling',
    evo: [], moves: [[1, 'confusion'], [1, 'harden'], [8, 'rock_throw'], [13, 'dazzle'], [18, 'psybeam'], [24, 'crystal_beam'], [30, 'focus_mind'], [36, 'rock_slide'], [42, 'psy_storm']], traits: ['sturdy', 'radiance'],
    habitat: 'Evolves from Quartzling', desc: 'A crystal lizard that stores sunlight in its spines and glows all night long.' },
  drillbeak: { n: 78, name: 'Drillbeak', types: ['earth', 'air'], base: [44, 60, 40, 30, 38, 66], growth: 'medium', catch: 190, exp: 62, rarity: 'common', line: 'drillbeak',
    evo: [{ to: 'augerhawk', lv: 26 }], moves: [[1, 'peck'], [1, 'mud_slap'], [7, 'quick_attack'], [12, 'dig_claw'], [17, 'wing_attack'], [22, 'drill_peck']], traits: ['keen_eye', 'run_away'],
    habitat: 'Route 3; Route 4', desc: 'A bird that nests in burrows. It twirls its beak like a drill to dig.' },
  augerhawk: { n: 79, name: 'Augerhawk', types: ['earth', 'air'], base: [70, 94, 64, 46, 60, 96], growth: 'medium', catch: 60, exp: 170, rarity: 'common', line: 'drillbeak',
    evo: [], moves: [[1, 'peck'], [1, 'mud_slap'], [7, 'quick_attack'], [12, 'dig_claw'], [17, 'wing_attack'], [22, 'drill_peck'], [26, 'tremor'], [34, 'air_slash']], traits: ['keen_eye', 'glare'],
    habitat: 'Evolves from Drillbeak', desc: 'It dives from the sky beak-first and bores straight into the ground.' },
  smoulder: { n: 80, name: 'Smoulder', types: ['ghost', 'fire'], base: [44, 34, 40, 66, 56, 60], growth: 'mslow', catch: 120, exp: 68, rarity: 'uncommon', line: 'smoulder',
    evo: [{ to: 'pyrewraith', lv: 30 }], moves: [[1, 'ember'], [1, 'lick'], [8, 'will_o'], [13, 'night_shade'], [18, 'confuse_ray'], [24, 'wraith_flame']], traits: ['floating', 'blaze'],
    habitat: 'Emberforge Volcano', desc: 'A wisp of smoke that drifts from old forges. It loves the smell of hot iron.' },
  pyrewraith: { n: 81, name: 'Pyrewraith', types: ['ghost', 'fire'], base: [66, 54, 62, 104, 86, 92], growth: 'mslow', catch: 45, exp: 182, rarity: 'uncommon', line: 'smoulder',
    evo: [], moves: [[1, 'ember'], [1, 'lick'], [8, 'will_o'], [13, 'night_shade'], [18, 'confuse_ray'], [24, 'wraith_flame'], [30, 'shade_orb'], [36, 'flamethrower']], traits: ['floating', 'night_eyes'],
    habitat: 'Evolves from Smoulder', desc: 'A tall ghost of blue fire. Smiths leave a lantern burning so it will not take their forge flames.' },
  mantaglide: { n: 82, name: 'Mantaglide', types: ['water', 'air'], base: [56, 44, 50, 62, 70, 66], growth: 'slow', catch: 120, exp: 68, rarity: 'uncommon', line: 'mantaglide',
    evo: [{ to: 'skymanta', lv: 30 }], moves: [[1, 'water_gun'], [1, 'gust'], [8, 'bubble'], [13, 'wing_attack'], [18, 'bubble_beam'], [24, 'air_slash']], traits: ['floating', 'riptide_dash'],
    habitat: 'Surfing on Route 4', desc: 'A ray that leaps from the waves and glides for hundreds of metres.' },
  skymanta: { n: 83, name: 'Skymanta', types: ['water', 'air'], base: [86, 64, 76, 92, 104, 88], growth: 'slow', catch: 45, exp: 182, rarity: 'uncommon', line: 'mantaglide',
    evo: [], moves: [[1, 'water_gun'], [1, 'gust'], [8, 'bubble'], [13, 'wing_attack'], [18, 'bubble_beam'], [24, 'air_slash'], [30, 'hydro_pulse'], [36, 'mend']], traits: ['floating', 'riptide_dash'],
    habitat: 'Evolves from Mantaglide', desc: 'A huge ray that rides the sea winds between islands. Ferrymen follow it to find calm water.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { fizzbat: 'static', coilbug: 'iron_hide', gearling: 'grit', magmite: 'thick_fur', cindertoad: 'shed_skin', pummelo: 'sturdy', quartzling: 'iron_hide', drillbeak: 'grit', smoulder: 'kindling', mantaglide: 'sturdy' });

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  plant_pass: { name: 'Dynamo Keycard', pocket: 'key', desc: 'An engineer\'s keycard for the Voltara Dynamo Works.' },
  ember_glass: { name: 'Ember Glass', pocket: 'collect', desc: 'Volcanic glass from Emberforge, still faintly warm.' },
  scroll_arcbolt: { name: 'Scroll: Arc Bolt', pocket: 'scrolls', scroll: 'arc_bolt', sell: 1000, desc: `Teaches Arc Bolt (electric). Can be used again and again. ${DATA.moves.arc_bolt.desc}` },
  scroll_magma: { name: 'Scroll: Magma Slam', pocket: 'scrolls', scroll: 'magma_slam', sell: 1000, desc: `Teaches Magma Slam (fire). Can be used again and again. ${DATA.moves.magma_slam.desc}` },
  scroll_drill: { name: 'Scroll: Spiral Peck', pocket: 'scrolls', scroll: 'drill_peck', price: 2200, sell: 1100, desc: `Teaches Spiral Peck (air). Can be used again and again. ${DATA.moves.drill_peck.desc}` },
});
Object.assign(DATA.scrolls, { scroll_arcbolt: 'arc_bolt', scroll_magma: 'magma_slam', scroll_drill: 'drill_peck' });
DATA.shops.voltara = ['lantern', 'great_lantern', 'bright_lantern', 'kin_lantern', 'patience_lantern', 'potion', 'super_potion', 'calm_incense', 'antidote', 'unknot', 'burn_salve', 'wake_bell', 'thaw_tea', 'thunder_shard', 'scroll_drill'];
DATA.shops.cinderhollow = ['great_lantern', 'bright_lantern', 'dusk_lantern', 'swift_lantern', 'super_potion', 'calm_incense', 'burn_salve', 'cure_berry', 'sun_shard', 'dusk_shard'];
DATA.items.hyper_potion = { name: 'Grand Tonic', pocket: 'items', battle: 'heal', field: true, heal: 120, price: 1200, sell: 600, desc: 'A powerful spray that restores 120 HP to one Wildmon.' };
DATA.shops.voltara.splice(6, 0, 'hyper_potion'); DATA.shops.cinderhollow.splice(4, 0, 'hyper_potion');

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  sable: { hair: '#e8e8f0', skin: '#e8b890', shirt: '#5a5a6a', pants: '#2a2a32', shoes: '#1a1a1a', hat: '#8a3a8a' },
  rhea: { hair: '#f0d040', skin: '#f0c49a', shirt: '#3a3a4a', pants: '#e8c030', shoes: '#2a2a2a' },
  brann: { hair: '#c84a2a', skin: '#c08a60', shirt: '#6a4a3a', pants: '#3a2a20', shoes: '#1a1a1a' },
  engineer: { hair: '#4a3a2a', skin: '#e8b890', shirt: '#e8a030', pants: '#3a4a6a', shoes: '#2a2a2a', hat: '#f0d040' },
  miner: { hair: '#3a2a1a', skin: '#d8a070', shirt: '#8a6a4a', pants: '#4a4a3a', shoes: '#2a2a1a', hat: '#e8c030' },
  smith: { hair: '#2a2a2a', skin: '#c08a60', shirt: '#4a3a34', pants: '#2a2420', shoes: '#1a1a1a' },
  blackbelt: { hair: '#1a1a1a', skin: '#e0b088', shirt: '#f4f4f0', pants: '#f4f4f0', shoes: '#e0b088', hat: '#1a1a1a' },
});

/* ---------- Trainers ---------- */
Object.assign(DATA.trainers, {
  cora: { cls: 'Hiker', name: 'Cora', look: 'hiker', team: [['pebblin', 19], ['drillbeak', 19], ['gearling', 20]], prize: 26, ai: 'tactical',
    intro: 'The road to Voltara goes straight through the mountain! Ready to climb?', lose: 'You rock!', after: 'Hollowpeak Cave is dark and twisty. Keep your Lanterns close.' },
  pip3: { cls: 'Lass', name: 'Juno', look: 'lass', team: [['sandkit', 19], ['fizzbat', 20]], prize: 22, ai: 'basic',
    intro: "I'm on my way to see the Spark Hall! Battle me first!", lose: 'Zapped!', after: 'Voltara is the city of lights. Well, it used to be...' },
  kai3: { cls: 'Black Belt', name: 'Kai', look: 'blackbelt', team: [['pummelo', 20], ['pummelo', 21]], prize: 30, ai: 'tactical',
    intro: 'Hyah! My fists are faster than your Lanterns!', lose: 'My training continues...', after: 'Punch a thousand leaves every morning. That is the way.' },
  dig1: { cls: 'Miner', name: 'Dougal', look: 'miner', team: [['molekin', 21], ['gearling', 21], ['pebblin', 22]], prize: 30, ai: 'tactical',
    intro: 'Oi! This is my seam! Find your own!', lose: 'Struck out!', after: 'Quartzling hide in the deepest part of the cave. Shine a light and they shine right back.' },
  dig2: { cls: 'Miner', name: 'Hester', look: 'miner', team: [['quartzling', 22], ['fizzbat', 21]], prize: 30, ai: 'tactical',
    intro: 'Ever seen a crystal glow? Watch this!', lose: 'Shattered!', after: 'The Order came through here last week with carts full of something heavy.' },
  eng1: { cls: 'Engineer', name: 'Watt', look: 'engineer', team: [['coilbug', 23], ['zappik', 23]], prize: 30, ai: 'tactical',
    intro: 'The Spark Hall runs on pure voltage! Let me show you!', lose: 'Short-circuited!', after: 'The red switches flip the lasers. It is all one big circuit, really.' },
  eng2: { cls: 'Engineer', name: 'Volta', look: 'engineer', team: [['fizzbat', 23], ['gearling', 23], ['coilbug', 24]], prize: 32, ai: 'tactical',
    intro: "Rhea built half this Hall herself. You won't find a smarter Hall Master.", lose: 'Overloaded!', after: 'Earth moves do nothing to flying Wildmon, and Electric moves do nothing to Earth ones. Plan around both.' },
  rhea: { cls: 'Hall Master', name: 'Rhea', look: 'rhea', team: [['fizzbat', 24], ['coilbug', 25], ['joltfox', 27, 'swift_feather']], prize: 100, ai: 'expert', items: { super_potion: 1 }, pot: 8,
    intro: 'Rhea', lose: 'Ha! What a jolt!', after: '' },
  grunt7: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['rookling', 22], ['fizzbat', 22]], prize: 28, ai: 'tactical', music: 'order',
    intro: 'Nobody gets into the Works!', lose: 'Ugh...', after: '...' },
  grunt8: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['shadepaw', 22], ['coilbug', 22]], prize: 28, ai: 'tactical', music: 'order',
    intro: 'Two against two? Fine by us!', lose: 'Lights out for us...', after: '...' },
  grunt9: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['driftveil', 23], ['gearling', 23], ['rookling', 24]], prize: 30, ai: 'tactical', music: 'order',
    intro: 'The conveyors will take you right back out!', lose: 'Derailed!', after: 'Admin Sable is at the core. You will regret going there.' },
  grunt10: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['stinglet', 23], ['murkle', 24]], prize: 30, ai: 'tactical', music: 'order',
    intro: 'Stop right there! This plant belongs to Morrow Lumen now!', lose: 'Power down...', after: '...' },
  sable: { cls: 'Admin', name: 'Sable', look: 'sable', team: [['driftveil', 23], ['corvane', 23], ['nightprowl', 25, 'bramble_berry']], prize: 80, ai: 'tactical', items: { super_potion: 1 }, pot: 8, music: 'battle_master',
    intro: 'Sable', lose: 'Interesting. Very interesting.', after: '' },
  swim3: { cls: 'Swimmer', name: 'Marlo', look: 'swimmer2', team: [['gullet', 25], ['mantaglide', 25]], prize: 22, ai: 'tactical',
    intro: 'Out here on a board? Brave! Let\'s battle!', lose: 'Wiped out!', after: 'Cinderhollow is just south. Watch out for the steam vents.' },
  swim4: { cls: 'Swimmer', name: 'Nell', look: 'swimmer', team: [['glintstar', 25], ['puddlepup', 25], ['shellsnip', 26]], prize: 24, ai: 'tactical',
    intro: 'The water here is warm from the volcano! Perfect for a battle!', lose: 'Sunk!', after: 'Try fishing near the island. Something big lives down there.' },
  kai4: { cls: 'Black Belt', name: 'Ryo', look: 'blackbelt', team: [['pummelo', 25], ['gauntlord', 27]], prize: 34, ai: 'tactical',
    intro: 'I train on this beach every day. Show me your strength!', lose: 'You are strong. Very strong.', after: 'Brann of the Forge Hall was a Black Belt once. Then he found the forge.' },
  smith1: { cls: 'Smith', name: 'Anvil', look: 'smith', team: [['magmite', 27], ['gearling', 27]], prize: 32, ai: 'tactical',
    intro: 'Heat and pressure make the best steel. Let\'s add some pressure!', lose: 'Quenched!', after: 'Push the boulders into the lava. That is how we built every bridge in here.' },
  smith2: { cls: 'Smith', name: 'Bellows', look: 'smith', team: [['cindertoad', 27], ['smoulder', 28]], prize: 34, ai: 'tactical',
    intro: 'Brann is at the hottest part of the Hall. Think you can stand the heat?', lose: 'Cooled off!', after: 'Water and Rock moves will douse Brann\'s team. Earth works too!' },
  brann: { cls: 'Hall Master', name: 'Brann', look: 'brann', team: [['magmite', 27], ['ashtoad', 28], ['volcarn', 30, 'ember_charm']], prize: 110, ai: 'expert', items: { super_potion: 1 }, pot: 8,
    intro: 'Brann', lose: 'Hah! Forged in fire, that team of yours.', after: '' },
  kit3: { cls: 'Rival', name: 'Kit', look: 'kit', team: [], prize: 70, ai: 'tactical', items: { super_potion: 1 }, pot: 8,
    lose: 'Two at once and you STILL won?!', win: 'Double the Wildmon, double the win!' },
});
Object.defineProperty(DATA.trainers.kit3, 'team', {
  get() {
    const evo = { mossling: 'thornback', firecub: 'cinderclaw', puddlepup: 'brinehound' };
    const pick = RIVAL_PICK[G && G.flags.starter] || 'firecub';
    return [['gustfinch', 26], ['joltfox', 26], ['thicketrat', 26], [evo[pick], 29, 'bramble_berry']];
  },
});

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  route3: {
    grass: {
      day: [['drillbeak', 26, 18, 21], ['pummelo', 14, 18, 21], ['sandkit', 16, 18, 21], ['zappik', 14, 18, 21], ['fizzbat', 10, 18, 21], ['twigwing', 12, 18, 20], ['gearling', 8, 19, 21]],
      night: [['fizzbat', 26, 18, 21], ['shadepaw', 18, 18, 21], ['rookling', 16, 18, 21], ['drillbeak', 14, 18, 21], ['glimwig', 14, 18, 21], ['wispet', 12, 18, 21]],
    },
  },
  hollowpeak: { cave: { day: [['fizzbat', 26, 19, 23], ['gearling', 22, 19, 23], ['pebblin', 18, 19, 23], ['molekin', 18, 19, 23], ['zappik', 10, 20, 23], ['quartzling', 6, 21, 23]] } },
  hollowpeak_2: { cave: { day: [['fizzbat', 22, 20, 24], ['gearling', 20, 20, 24], ['quartzling', 18, 21, 24], ['bouldrum', 10, 22, 24], ['molekin', 16, 20, 24], ['cragmaw', 2, 24, 25], ['tunnelord', 12, 22, 24]] } },
  volt_plant: { cave: { day: [['coilbug', 34, 21, 24], ['fizzbat', 30, 21, 24], ['zappik', 20, 21, 24], ['gearling', 16, 21, 24]] } },
  route4: {
    grass: {
      day: [['drillbeak', 22, 23, 26], ['pummelo', 16, 23, 26], ['cindertoad', 18, 23, 26], ['sandkit', 18, 23, 26], ['gullet', 16, 23, 26], ['fawnlight', 10, 24, 26], ['firecub', 5, 23, 25]],
      night: [['fizzbat', 22, 23, 26], ['cindertoad', 20, 23, 26], ['shadepaw', 18, 23, 26], ['glimwig', 20, 23, 26], ['driftveil', 20, 23, 26], ['firecub', 5, 23, 25]],
    },
    surf: { day: [['gullet', 34, 24, 27], ['mantaglide', 24, 24, 27], ['flopfin', 22, 22, 26], ['glintstar', 20, 24, 27]] },
    fish: { day: [['flopfin', 40, 22, 26], ['shellsnip', 26, 24, 27], ['glintstar', 20, 24, 27], ['gyrefin', 14, 26, 28]] },
  },
  cinderhollow: {
    surf: { day: [['gullet', 30, 25, 28], ['mantaglide', 30, 25, 28], ['glintstar', 20, 25, 28], ['puddlepup', 20, 25, 27]] },
    fish: { day: [['flopfin', 30, 24, 27], ['shellsnip', 30, 25, 28], ['gyrefin', 20, 26, 29], ['puddlepup', 20, 25, 27]] },
  },
  emberforge: { cave: { day: [['magmite', 30, 27, 30], ['smoulder', 22, 27, 30], ['cindertoad', 20, 27, 30], ['kindlit', 4, 28, 30], ['pebblin', 14, 27, 30], ['volcarn', 10, 30, 31]] } },
});
for (const t of Object.values(DATA.encounters)) for (const k of Object.keys(t)) if (!t[k].night) t[k].night = t[k].day;

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  cave: { bpm: 88, lead: 'triangle', tr: -5, chords: ['Am', 'Am', 'F', 'E', 'Am', 'Am', 'Dm', 'E'],
    melody: 'A4:4 C5:2 E5:2 D5:4 C5:4 A4:4 C5:2 B4:2 G#4:8 A4:4 C5:2 E5:2 F5:4 E5:4 D5:4 C5:2 B4:2 E5:8' },
  voltara: { bpm: 126, lead: 'square', chords: ['D', 'Bm', 'G', 'A', 'D', 'Bm', 'G', 'A'],
    melody: 'F#5:2 A5:2 D6:2 A5:2 B5:4 A5:4 G5:2 F#5:2 E5:2 F#5:2 G5:4 A5:4 F#5:2 A5:2 D6:2 E6:2 F#6:4 E6:4 D6:2 C#6:2 B5:2 C#6:2 D6:8' },
  cinder: { bpm: 108, lead: 'square', tr: -3, chords: ['Em', 'Em', 'C', 'B', 'Em', 'Em', 'C', 'D'],
    melody: 'E5:2 G5:2 B5:2 G5:2 A5:4 G5:4 E5:2 F#5:2 G5:2 A5:2 B5:4 F#5:4 E5:2 G5:2 B5:2 E6:2 D6:4 C6:4 B5:2 A5:2 G5:2 F#5:2 G5:4 A5:4' },
});

/* ---------- Quest ---------- */
DATA.quests.act2 = {
  name: 'The Power Thieves', kind: 'main', giver: 'Coral',
  stages: [
    "The Order's ship sailed west. Take Route 3 west from Port Calder, through Hollowpeak Cave, to Voltara.",
    'Voltara has lost all its power! Find out what is going on at the Dynamo Works in the north of the city.',
    'Wren is waiting outside the Dynamo Works. Team up with her and get inside.',
    'Stop Admin Sable at the heart of the Dynamo Works.',
    'The power is back on. Challenge Hall Master Rhea at the Spark Hall.',
    "Wren's Tide Board lets you paddle across water. Head south down Route 4 and cross the sea to Cinderhollow.",
    'Earn the Forge Badge from Hall Master Brann at the Forge Hall in Cinderhollow.',
  ],
  reward: 'Grand Tonic x3, Bright Lantern x5',
};

DATA.region = DATA.region.map((r) => Object.assign({}, r, ({
  voltara: { desc: 'The city of lights in the central highlands, powered by its great Dynamo Works. Home of the Spark Hall.' },
  cinderhollow: { desc: 'A smoky town on a volcanic isle, famous for its hot springs and the Forge Hall.' },
})[r.id] || {}));
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'voltara'), 0,
  { id: 'route3', name: 'Route 3', x: 140, y: 150, desc: 'A rocky mountain road west of Port Calder, leading into Hollowpeak Cave.' },
  { id: 'hollowpeak', name: 'Hollowpeak Cave', x: 130, y: 144, desc: 'An old mine tunnelling through the mountain to Voltara.' },
  { id: 'route4', name: 'Route 4', x: 112, y: 152, desc: 'A coastal path south of Voltara that ends at the sea. Cinderhollow lies across the water.' });
DATA.region.push({ id: 'emberforge', name: 'Emberforge Volcano', x: 92, y: 172, desc: 'The smoking volcano above Cinderhollow.' });
DATA.regionRoutes = DATA.regionRoutes.filter(([a, b]) => !(a === 'port_calder' && b === 'voltara') && !(a === 'voltara' && b === 'cinderhollow'))
  .concat([['port_calder', 'route3'], ['route3', 'hollowpeak'], ['hollowpeak', 'voltara'], ['voltara', 'route4'], ['route4', 'cinderhollow'], ['cinderhollow', 'emberforge']]);
