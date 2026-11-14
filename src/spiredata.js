'use strict';
/* =====================================================================
   DROWNED SPIRE DATA — the Drowned Spire, Morrow's last stand, Nocthra,
   Route 9 and Ironmouth's Iron Hall.
   ===================================================================== */

/* ---------- Moves ---------- */
Object.assign(DATA.moves, {
  gyro_slam: { name: 'Gyro Slam', type: 'steel', cat: 'phys', pow: 90, acc: 90, pp: 10, desc: 'Spins like a flywheel and slams into the foe.' },
  abyssal_pull: { name: 'Abyssal Pull', type: 'dark', cat: 'spec', pow: 80, acc: 100, pp: 15, eff: 'foe', st: { spd: -1 }, ch: 20, desc: 'Drags the foe toward the dark deep. May lower Resolve.' },
  magnet_pulse: { name: 'Magnet Pulse', type: 'electric', cat: 'spec', pow: 75, acc: 100, pp: 15, eff: 'par', ch: 20, desc: 'A pulse of magnetic force. May paralyse.' },
  plate_shield: { name: 'Plate Shield', type: 'steel', cat: 'status', acc: null, pp: 15, eff: 'self', st: { def: 1, spd: 1 }, desc: 'Raises a wall of riveted plates. Raises Defence and Resolve.' },
});

/* ---------- Species #144–163 ---------- */
Object.assign(DATA.species, {
  rivetling: { n: 144, name: 'Rivetling', types: ['steel'], base: [50, 56, 64, 30, 40, 36], growth: 'slow', catch: 150, exp: 62, rarity: 'common', line: 'rivetling',
    evo: [{ to: 'bolthulk', lv: 30 }], moves: [[1, 'tackle'], [1, 'harden'], [9, 'metal_claw'], [15, 'headbutt'], [21, 'iron_defense'], [27, 'iron_head']], traits: ['sturdy', 'iron_hide'],
    habitat: 'Route 9; Ironmouth', desc: 'A little bundle of rivets and bolts. It rattles when it runs, so it never sneaks up on anyone.' },
  bolthulk: { n: 145, name: 'Bolthulk', types: ['steel'], base: [72, 84, 92, 40, 56, 44], growth: 'slow', catch: 70, exp: 150, rarity: 'common', line: 'rivetling',
    evo: [{ to: 'ironclast', lv: 44 }], moves: [[1, 'tackle'], [1, 'harden'], [9, 'metal_claw'], [15, 'headbutt'], [21, 'iron_defense'], [27, 'iron_head'], [30, 'gyro_slam'], [36, 'plate_shield']], traits: ['sturdy', 'iron_hide'],
    habitat: 'Evolves from Rivetling', desc: 'It bolts loose scrap onto its own body. The Ironmouth foundries leave their offcuts out for it.' },
  ironclast: { n: 146, name: 'Ironclast', types: ['steel', 'fighting'], base: [96, 122, 128, 50, 80, 54], growth: 'slow', catch: 30, exp: 230, rarity: 'common', line: 'rivetling',
    evo: [], moves: [[1, 'tackle'], [1, 'harden'], [9, 'metal_claw'], [15, 'headbutt'], [21, 'iron_defense'], [27, 'iron_head'], [30, 'gyro_slam'], [36, 'plate_shield'], [44, 'focus_strike'], [52, 'reckless_charge']], traits: ['sturdy', 'grit'],
    habitat: 'Evolves from Bolthulk', desc: 'A towering iron knight. Ironmouth\'s first foundry was built around a sleeping Ironclast so that it would keep the walls standing.' },
  smeltmite: { n: 147, name: 'Smeltbug', types: ['steel', 'fire'], base: [46, 54, 58, 50, 44, 40], growth: 'mslow', catch: 140, exp: 64, rarity: 'common', line: 'smeltmite',
    evo: [{ to: 'crucibeast', lv: 38 }], moves: [[1, 'ember'], [1, 'harden'], [9, 'metal_claw'], [15, 'fire_fang'], [21, 'flame_burst'], [27, 'iron_head'], [33, 'magma_slam']], traits: ['kindling', 'sturdy'],
    habitat: 'Ironmouth foundries', desc: 'It lives in furnace ash and eats slag. Foundry workers say a Smeltbug in the bellows means good luck.' },
  crucibeast: { n: 148, name: 'Crucibeast', types: ['steel', 'fire'], base: [82, 96, 98, 88, 72, 56], growth: 'mslow', catch: 45, exp: 200, rarity: 'common', line: 'smeltmite',
    evo: [], moves: [[1, 'ember'], [1, 'harden'], [9, 'metal_claw'], [15, 'fire_fang'], [21, 'flame_burst'], [27, 'iron_head'], [33, 'magma_slam'], [38, 'flamethrower'], [46, 'gyro_slam']], traits: ['kindling', 'iron_hide'],
    habitat: 'Evolves from Smeltbug', desc: 'Molten metal sloshes inside its iron shell. Smiths borrow a Crucibeast when the big furnace goes out.' },
  abyssling: { n: 149, name: 'Deepling', types: ['water', 'dark'], base: [50, 62, 44, 56, 44, 64], growth: 'slow', catch: 100, exp: 66, rarity: 'uncommon', line: 'abyssling',
    evo: [{ to: 'leviathorn', lv: 40 }], moves: [[1, 'water_gun'], [1, 'leer'], [9, 'bite'], [15, 'brine_bite'], [21, 'shadow_swipe'], [27, 'abyssal_pull'], [33, 'crunch']], traits: ['night_eyes', 'riptide'],
    habitat: 'Drowned Spire', desc: 'It came up with the Spire from somewhere very deep. Light makes it squint and sulk.' },
  leviathorn: { n: 150, name: 'Leviathorn', types: ['water', 'dark'], base: [98, 116, 82, 90, 78, 86], growth: 'slow', catch: 25, exp: 230, rarity: 'uncommon', line: 'abyssling',
    evo: [], moves: [[1, 'water_gun'], [1, 'leer'], [9, 'bite'], [15, 'brine_bite'], [21, 'shadow_swipe'], [27, 'abyssal_pull'], [33, 'crunch'], [40, 'tide_slam'], [48, 'maelstrom']], traits: ['night_eyes', 'glare'],
    habitat: 'Evolves from Deepling', desc: 'A sea serpent bristling with black spines. Sailors who see one turn their ship around without a word.' },
  barnaclad: { n: 151, name: 'Barnaclad', types: ['water', 'steel'], base: [60, 54, 76, 36, 54, 26], growth: 'mslow', catch: 140, exp: 64, rarity: 'common', line: 'barnaclad',
    evo: [{ to: 'hullgaunt', lv: 36 }], moves: [[1, 'tackle'], [1, 'harden'], [9, 'water_gun'], [15, 'metal_claw'], [21, 'brine_bite'], [27, 'iron_defense'], [33, 'iron_head']], traits: ['shell_armor', 'sturdy'],
    habitat: 'Drowned Spire; Ironmouth docks', desc: 'It clings to ship hulls and sunken iron. Scrape one off and it simply clings to you instead.' },
  hullgaunt: { n: 152, name: 'Hullgaunt', types: ['water', 'steel'], base: [92, 90, 116, 54, 84, 34], growth: 'mslow', catch: 45, exp: 196, rarity: 'common', line: 'barnaclad',
    evo: [], moves: [[1, 'tackle'], [1, 'harden'], [9, 'water_gun'], [15, 'metal_claw'], [21, 'brine_bite'], [27, 'iron_defense'], [33, 'iron_head'], [36, 'tide_slam'], [44, 'gyro_slam']], traits: ['shell_armor', 'iron_hide'],
    habitat: 'Evolves from Barnaclad', desc: 'A hulking mass of rusted plate and barnacles. It drags itself along the sea floor like a sunken ship that refuses to stay put.' },
  gloomray: { n: 153, name: 'Inkray', types: ['dark', 'water'], base: [52, 48, 50, 62, 56, 70], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'gloomray',
    evo: [{ to: 'abyssray', lv: 38 }], moves: [[1, 'water_gun'], [1, 'leer'], [9, 'shadow_swipe'], [15, 'bubble_beam'], [21, 'hex_gaze'], [27, 'abyssal_pull'], [33, 'hydro_pulse']], traits: ['night_eyes', 'floating'],
    habitat: 'Drowned Spire', desc: 'It glides through the flooded halls of the Spire like a scrap of night that came loose.' },
  abyssray: { n: 154, name: 'Umbracloak', types: ['dark', 'water'], base: [80, 70, 76, 104, 90, 104], growth: 'mslow', catch: 40, exp: 200, rarity: 'uncommon', line: 'gloomray',
    evo: [], moves: [[1, 'water_gun'], [1, 'leer'], [9, 'shadow_swipe'], [15, 'bubble_beam'], [21, 'hex_gaze'], [27, 'abyssal_pull'], [33, 'hydro_pulse'], [38, 'eclipse_pulse']], traits: ['night_eyes', 'floating'],
    habitat: 'Evolves from Inkray', desc: 'Its wings span the width of a ship. When it passes overhead, the water goes dark and cold.' },
  cogmouse: { n: 155, name: 'Wiremouse', types: ['steel', 'electric'], base: [42, 48, 44, 52, 40, 76], growth: 'mfast', catch: 170, exp: 58, rarity: 'common', line: 'cogmouse',
    evo: [{ to: 'dynamaus', lv: 32 }], moves: [[1, 'thundershock'], [1, 'tail_whip'], [7, 'quick_attack'], [13, 'metal_claw'], [19, 'spark'], [25, 'magnet_pulse'], [30, 'gear_grind']], traits: ['static', 'pickup'],
    habitat: 'Route 9; Ironmouth', desc: 'It runs a little cog in its chest by spinning in circles. Ironmouth\'s clocks keep stopping because it steals their gears.' },
  dynamaus: { n: 156, name: 'Dynamaus', types: ['steel', 'electric'], base: [68, 82, 72, 84, 66, 108], growth: 'mfast', catch: 50, exp: 180, rarity: 'common', line: 'cogmouse',
    evo: [], moves: [[1, 'thundershock'], [1, 'tail_whip'], [7, 'quick_attack'], [13, 'metal_claw'], [19, 'spark'], [25, 'magnet_pulse'], [30, 'gear_grind'], [32, 'thunderbolt'], [40, 'gyro_slam']], traits: ['static', 'keen_eye'],
    habitat: 'Evolves from Wiremouse', desc: 'Its whirring heart could power a house. It races along Ironmouth\'s rail lines faster than the trains.' },
  slaglet: { n: 157, name: 'Slagbit', types: ['fire', 'rock'], base: [56, 52, 66, 50, 46, 30], growth: 'mslow', catch: 150, exp: 62, rarity: 'common', line: 'slaglet',
    evo: [{ to: 'slagolem', lv: 38 }], moves: [[1, 'ember'], [1, 'harden'], [9, 'rock_throw'], [15, 'flame_burst'], [21, 'rock_tomb'], [27, 'magma_slam'], [33, 'rock_slide']], traits: ['kindling', 'sturdy'],
    habitat: 'Route 9 slag heaps', desc: 'A glowing lump from the bottom of a foundry bucket. It cools down at night and sulks until morning.' },
  slagolem: { n: 158, name: 'Slagolem', types: ['fire', 'steel'], base: [90, 100, 104, 70, 72, 40], growth: 'mslow', catch: 45, exp: 200, rarity: 'common', line: 'slaglet',
    evo: [], moves: [[1, 'ember'], [1, 'harden'], [9, 'rock_throw'], [15, 'flame_burst'], [21, 'rock_tomb'], [27, 'magma_slam'], [33, 'rock_slide'], [38, 'iron_head'], [46, 'solar_flare']], traits: ['kindling', 'iron_hide'],
    habitat: 'Evolves from Slagbit', desc: 'A giant of cooled slag and hot iron. It wades into furnaces to stir them, then wanders off to cool in the river.' },
  lumenkoi: { n: 159, name: 'Glowkoi', types: ['water', 'light'], base: [80, 60, 76, 96, 104, 84], growth: 'slow', catch: 20, exp: 210, rarity: 'rare', line: 'lumenkoi',
    evo: [], moves: [[1, 'water_gun'], [1, 'glimmer'], [12, 'bubble_beam'], [20, 'radiant_pulse'], [28, 'mend'], [36, 'hydro_pulse'], [44, 'dazzling_ray'], [52, 'dawnbreak']], traits: ['radiance', 'riptide'],
    habitat: 'Drowned Spire (rare)', desc: 'A golden fish that glows in the darkest water. Old sailors believed a Glowkoi was a Beacon\'s light that had learned to swim.' },
  spirewing: { n: 160, name: 'Spiretalon', types: ['dark', 'air'], base: [76, 96, 64, 70, 64, 110], growth: 'slow', catch: 30, exp: 200, rarity: 'rare', line: 'spirewing',
    evo: [], moves: [[1, 'peck'], [1, 'leer'], [12, 'shadow_swipe'], [20, 'wing_attack'], [28, 'air_slash'], [36, 'crunch'], [44, 'dive_bomb'], [52, 'eclipse_pulse']], traits: ['night_eyes', 'keen_eye'],
    habitat: 'Drowned Spire (rare)', desc: 'It roosts at the very top of the Spire and screams at anything that climbs too high.' },
  knightling: { n: 161, name: 'Knightling', types: ['steel', 'fighting'], base: [54, 66, 62, 30, 44, 50], growth: 'slow', catch: 90, exp: 66, rarity: 'uncommon', line: 'knightling',
    evo: [{ to: 'paladross', lv: 40 }], moves: [[1, 'tackle'], [1, 'leer'], [9, 'metal_claw'], [15, 'low_kick'], [21, 'iron_defense'], [27, 'bramble_jab'], [33, 'iron_head']], traits: ['grit', 'sturdy'],
    habitat: 'Ironmouth (night)', desc: 'It wears a helmet far too big for it. It takes it very, very seriously.' },
  paladross: { n: 162, name: 'Paladross', types: ['steel', 'light'], base: [88, 112, 98, 74, 86, 72], growth: 'slow', catch: 30, exp: 220, rarity: 'uncommon', line: 'knightling',
    evo: [], moves: [[1, 'tackle'], [1, 'leer'], [9, 'metal_claw'], [15, 'low_kick'], [21, 'iron_defense'], [27, 'bramble_jab'], [33, 'iron_head'], [40, 'first_light'], [48, 'gyro_slam']], traits: ['grit', 'radiance'],
    habitat: 'Evolves from Knightling', desc: 'A knight in shining armour, quite literally. It glows brighter the more danger its trainer is in.' },
  hollowshell: { n: 163, name: 'Hollowshell', types: ['ghost', 'steel'], base: [70, 84, 110, 60, 90, 36], growth: 'slow', catch: 30, exp: 200, rarity: 'rare', line: 'hollowshell',
    evo: [], moves: [[1, 'lick'], [1, 'harden'], [12, 'metal_claw'], [20, 'hex_wave'], [28, 'iron_defense'], [36, 'shadow_claw'], [44, 'iron_head'], [52, 'shade_orb']], traits: ['shell_armor', 'floating'],
    habitat: 'Drowned Spire (rare)', desc: 'An empty suit of old diving armour with a cold light inside. Nobody knows who wore it last.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { rivetling: 'thick_fur', smeltmite: 'grit', abyssling: 'grit', barnaclad: 'grit', gloomray: 'glare', cogmouse: 'grit', slaglet: 'thick_fur', lumenkoi: 'floating', spirewing: 'glare', knightling: 'iron_hide', hollowshell: 'night_eyes' });

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  league_pass: { name: 'Lantern Road Pass', pocket: 'key', desc: 'Signed by Director Vance. Proof that you hold all eight Badges. It opens the gate to Lantern Road and the Lantern League.' },
  scroll_gyroslam: { name: 'Scroll: Gyro Slam', pocket: 'items', scroll: 'gyro_slam', sell: 2200, desc: 'A Move Scroll. Teaches Gyro Slam to a Wildmon that can use Steel moves.' },
  scroll_magnetpulse: { name: 'Scroll: Magnet Pulse', pocket: 'items', scroll: 'magnet_pulse', price: 5000, sell: 1800, desc: 'A Move Scroll. Teaches Magnet Pulse to a Wildmon that can use Electric moves.' },
});
Object.assign(DATA.scrolls, { scroll_gyroslam: 'gyro_slam', scroll_magnetpulse: 'magnet_pulse' });
DATA.shops.ironmouth = ['great_lantern', 'bright_lantern', 'swift_lantern', 'patience_lantern', 'hyper_potion', 'max_potion', 'full_heal', 'hot_cocoa', 'calm_incense', 'scroll_magnetpulse'];

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  vance: { hair: '#3a3a3a', skin: '#d8b090', shirt: '#2a2a32', pants: '#2a2a32', shoes: '#0a0a0a' },
  worker: { hair: '#5a3a1a', skin: '#c89070', shirt: '#e8a030', pants: '#3a4a6a', shoes: '#2a1a0a', hat: '#e8c040' },
});

/* ---------- Trainers ---------- */
Object.assign(DATA.trainers, {
  sp1: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['abyssling', 44], ['scraprat', 44], ['tombwing', 44]], prize: 46, ai: 'tactical', music: 'order',
    intro: 'The Spire is rising! Nothing can stop it now!', lose: 'Something can stop it, apparently.', after: 'Do you feel that? The whole tower is humming.' },
  sp2: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['gloomray', 44], ['hexpanther', 44]], prize: 46, ai: 'tactical', music: 'order',
    intro: 'The Director said nobody comes up. NOBODY.', lose: 'I\'m nobody...', after: 'I didn\'t sign up for a black sun. I signed up for clean energy.' },
  sp3: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['barnaclad', 45], ['dynacoil', 45], ['gloomowl', 45]], prize: 47, ai: 'tactical', music: 'order',
    intro: 'Last line of defence! Well, nearly last.', lose: 'Not much of a line.', after: 'Admin Corvin is up the stairs. He never loses an argument.' },
  corvin4: { cls: 'Admin', name: 'Corvin', look: 'corvin', team: [['scraprat', 46], ['tombwing', 46], ['hexpanther', 47]], prize: 110, ai: 'expert', pot: 8, music: 'battle_master', intro: 'Corvin', lose: 'I... cannot calculate this.', after: '' },
  sp4: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['leviathorn', 46], ['dynacoil', 45]], prize: 47, ai: 'tactical', music: 'order', intro: 'Grunt', lose: '...', after: '' },
  morrow2: { cls: 'Director', name: 'Morrow', look: 'morrow', team: [['hexpanther', 47], ['pyrewraith', 47], ['abyssray', 47], ['ironclast', 47], ['leviathorn', 48], ['noxstag', 50, 'lucky_ribbon']], prize: 200, ai: 'expert', items: { max_potion: 1 }, pot: 6, music: 'battle_master',
    intro: 'Morrow', lose: 'So this is how it ends. Not with a Lantern, but with a trainer.', after: '' },
  r9a: { cls: 'Foundry Worker', name: 'Gus', look: 'worker', team: [['rivetling', 44], ['slaglet', 44], ['smeltmite', 44]], prize: 46, ai: 'tactical',
    intro: 'Route 9\'s finally open! First battle on it is mine!', lose: 'Back to the furnace for me.', after: 'Ironmouth was hit hard by the eclipse. The furnaces wouldn\'t light.' },
  r9b: { cls: 'Engineer', name: 'Petra', look: 'engineer', team: [['cogmouse', 44], ['dynacoil', 45]], prize: 47, ai: 'tactical',
    intro: 'Let me test your battle circuits!', lose: 'Short circuit!', after: 'Director Vance designed half the machines in Aldermere.' },
  r9c: { cls: 'Hiker', name: 'Cormac', look: 'hiker', team: [['bouldrum', 45], ['crestram', 45], ['slagolem', 46]], prize: 48, ai: 'tactical',
    intro: 'I cleared this rockslide with my bare hands! Well, my Wildmon did.', lose: 'Rocks fall, I fall.', after: 'Ironmouth is just ahead. The Iron Hall is the big black building.' },
  ih1: { cls: 'Engineer', name: 'Otto', look: 'engineer', team: [['cogmouse', 45], ['rimeshell', 45], ['bolthulk', 46]], prize: 48, ai: 'tactical',
    intro: 'The conveyors only go one way. Plan carefully, or you\'ll ride in circles!', lose: 'Derailed!', after: 'Vance built every one of these belts himself.' },
  ih2: { cls: 'Foundry Worker', name: 'Brita', look: 'worker', team: [['smeltmite', 46], ['knightling', 46]], prize: 48, ai: 'tactical',
    intro: 'You won\'t reach the Director that easily!', lose: 'Well, maybe you will.', after: 'Steel types shrug off most hits. Fire, Fighting and Earth moves cut through.' },
  ih3: { cls: 'Engineer', name: 'Lars', look: 'engineer', team: [['dynamaus', 46], ['crucibeast', 47]], prize: 49, ai: 'tactical',
    intro: 'Final checkpoint! Show me your clearance!', lose: 'Clearance granted.', after: 'The Director doesn\'t talk much. He\'s been quiet ever since the eclipse.' },
  vance: { cls: 'Hall Master', name: 'Vance', look: 'vance', team: [['dynamaus', 48], ['tunnelord', 48], ['hullgaunt', 49], ['crucibeast', 49], ['cogmaul', 49], ['ironclast', 51, 'cure_berry']], prize: 160, ai: 'expert', items: { max_potion: 2 }, pot: 10, music: 'battle_master',
    intro: 'Vance', lose: 'Steel bends. Who knew.', after: '' },
});

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  spire_1: {
    cave: { day: [['barnaclad', 36, 43, 46], ['driftveil', 30, 43, 45], ['hollowshell', 20, 44, 46], ['wraithtide', 14, 44, 46]] },
    surf: { day: [['abyssling', 34, 43, 46], ['gloomray', 34, 43, 46], ['barnaclad', 26, 43, 46], ['lumenkoi', 6, 45, 46]] },
    fish: { day: [['abyssling', 40, 43, 46], ['gloomray', 40, 43, 46], ['lumenkoi', 20, 45, 46]] },
  },
  spire_2: { cave: { day: [['barnaclad', 30, 44, 47], ['hollowshell', 24, 45, 47], ['wraithtide', 20, 44, 46], ['driftveil', 14, 44, 46], ['spirewing', 12, 45, 47]] } },
  route9: {
    grass: {
      day: [['rivetling', 22, 43, 46], ['cogmouse', 22, 43, 46], ['slaglet', 20, 43, 46], ['smeltmite', 16, 43, 46], ['crestram', 12, 43, 46], ['knightling', 4, 44, 46], ['pebwing', 4, 43, 45]],
      night: [['knightling', 16, 44, 46], ['cogmouse', 20, 43, 46], ['hootlet', 18, 43, 46], ['rivetling', 18, 43, 46], ['slaglet', 18, 43, 46], ['gloomowl', 10, 44, 46]],
    },
  },
  ironmouth: {
    fish: { day: [['barnaclad', 30, 44, 47], ['abyssling', 16, 44, 47], ['lampreel', 30, 44, 47], ['gyrefin', 24, 44, 47]] },
    surf: { day: [['barnaclad', 34, 44, 47], ['hullgaunt', 10, 45, 47], ['mantaglide', 30, 44, 47], ['gloomray', 26, 44, 47]] },
  },
});
for (const t of Object.values(DATA.encounters)) for (const k of Object.keys(t)) if (!t[k].night) t[k].night = t[k].day;

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  spire: { bpm: 88, lead: 'square', tr: -2, chords: ['Dm', 'Bb', 'C', 'A', 'Dm', 'Bb', 'Gm', 'A'],
    melody: 'D5:4 F5:2 A5:2 Bb5:4 A5:4 G5:2 F5:2 E5:4 C#5:4 D5:4 F5:2 A5:2 D6:4 C6:4 Bb5:2 A5:2 G5:4 E5:2 C#5:2 A4:8' },
  ironmouth: { bpm: 112, lead: 'square', tr: -1, chords: ['Em', 'Em', 'C', 'D', 'Em', 'Em', 'Am', 'B'],
    melody: 'E5:2 E5:2 G5:2 E5:2 B5:4 A5:2 G5:2 E5:4 G5:2 A5:2 B5:4 D6:2 B5:2 A5:4 G5:2 E5:2 C5:4 E5:2 A5:2 F#5:4 D#5:8 E5:4' },
  nocthra: { bpm: 140, lead: 'sawtooth', tr: -2, chords: ['Cm', 'Cm', 'Ab', 'Bb', 'Cm', 'Cm', 'Ab', 'G'],
    melody: 'C5:2 Eb5:2 G5:2 C6:2 Bb5:2 G5:2 Eb5:4 Ab5:2 G5:2 F5:2 Eb5:2 D5:4 Bb4:4 C5:2 Eb5:2 G5:2 C6:2 D6:2 Eb6:2 D6:4 C6:2 Bb5:2 Ab5:2 G5:2 B5:8' },
});

/* ---------- Quests ---------- */
DATA.quests.act4.stages[3] = 'The Drowned Spire has risen in the Sound. Take a ferry from Port Calder, Glasswater City or Saltmere to reach it.';
DATA.quests.act4.stages.push(
  'Climb the Drowned Spire and stop Morrow before Nocthra wakes.',
  'The sun has returned! Route 9 north of Mossgate has reopened. Head for Ironmouth.',
  'Earn the eighth Badge from Hall Master Vance at the Iron Hall in Ironmouth.',
);
DATA.quests.act4.reward = 'Vital Draught x5, Starseed Honey x3';

/* ---------- Region ---------- */
DATA.region.push({ id: 'drowned_spire', name: 'Drowned Spire', x: 132, y: 92, desc: 'An ancient tower that rose out of the Sound when the sun went dark.' });
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'ironmouth'), 0, { id: 'route9', name: 'Route 9', x: 196, y: 50, desc: 'A rocky road of slag heaps and rail lines between Mossgate and Ironmouth.' });
Object.assign(DATA.region.find((r) => r.id === 'ironmouth') || {}, { desc: 'A smoky foundry city of iron bridges and rail yards, home of the Iron Hall.' });
DATA.regionRoutes = DATA.regionRoutes.filter(([a, b]) => !(a === 'ironmouth' && b === 'mossgate')).concat([['mossgate', 'route9'], ['route9', 'ironmouth'], ['glasswater', 'drowned_spire']]);
