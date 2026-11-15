'use strict';
/* =====================================================================
   ACT III DATA — Route 5, Glasswater City and the Morrow Lumen Tower,
   the Sound ferry, Saltmere, Route 7, Ashgrave and the Veil Hall.
   ===================================================================== */

Object.assign(DATA.tiles, {
  '9': { t: 'pad' },
  'I': { t: 'glass', solid: true, text: 'A huge window looking out over the Sound.' },
  'U': { t: 'marsh' },
  '%': { t: 'grave', solid: true, text: 'An old gravestone. The name has worn away.' },
  't': { t: 'lshelf', solid: true, text: 'A Lantern Shelf. Wildmon rest inside the glowing Lanterns.' },
  '!': { t: 'candle', solid: true, text: 'A tall candle stand. Its flame never seems to flicker.' },
});

/* ---------- Moves ---------- */
Object.assign(DATA.moves, {
  psy_cutter: { name: 'Mind Cleaver', type: 'psychic', cat: 'phys', pow: 70, acc: 100, pp: 20, crit: 1, desc: 'Slashes with blades of psychic force. Often lands a clean strike.' },
  shadow_claw: { name: 'Shade Talon', type: 'ghost', cat: 'phys', pow: 70, acc: 100, pp: 15, crit: 1, desc: 'Rakes with a claw of shadow. Often lands a clean strike.' },
  mud_bomb: { name: 'Mud Burst', type: 'earth', cat: 'spec', pow: 65, acc: 85, pp: 10, eff: 'foe', st: { acc: -1 }, ch: 30, desc: 'Hurls a ball of mud. May lower accuracy.' },
  venom_fang: { name: 'Venom Fang', type: 'poison', cat: 'phys', pow: 65, acc: 100, pp: 20, eff: 'psn', ch: 40, desc: 'Bites with toxic fangs. Often poisons.' },
  eel_shock: { name: 'Eel Shock', type: 'electric', cat: 'spec', pow: 70, acc: 100, pp: 15, eff: 'par', ch: 20, desc: 'Discharges a jolt through the water. May paralyse.' },
  hex_gaze: { name: 'Hex Gaze', type: 'dark', cat: 'status', acc: 90, pp: 15, eff: 'foe', st: { spd: -2 }, desc: 'A cursed stare that harshly lowers Speed.' },
  dive_bomb: { name: 'Dive Bomb', type: 'air', cat: 'phys', pow: 90, acc: 90, pp: 10, desc: 'Plummets onto the foe from a great height.' },
});

/* ---------- Species #84–103 ---------- */
Object.assign(DATA.species, {
  rooftik: { n: 84, name: 'Rooftik', types: ['normal', 'air'], base: [46, 52, 42, 34, 40, 66], growth: 'mslow', catch: 255, exp: 58, rarity: 'common', line: 'rooftik',
    evo: [{ to: 'roofhawk', lv: 30 }], moves: [[1, 'peck'], [1, 'growl'], [8, 'quick_attack'], [14, 'wing_attack'], [20, 'headbutt'], [26, 'drill_peck']], traits: ['keen_eye', 'pickup'],
    habitat: 'Route 5; Glasswater City', desc: 'A city pigeon with a cheeky strut. It steals chips from café tables and has never once said sorry.' },
  roofhawk: { n: 85, name: 'Gablejay', types: ['normal', 'air'], base: [72, 88, 66, 50, 62, 98], growth: 'mslow', catch: 60, exp: 172, rarity: 'common', line: 'rooftik',
    evo: [], moves: [[1, 'peck'], [1, 'growl'], [8, 'quick_attack'], [14, 'wing_attack'], [20, 'headbutt'], [26, 'drill_peck'], [30, 'dive_bomb'], [38, 'reckless_charge']], traits: ['keen_eye', 'glare'],
    habitat: 'Evolves from Rooftik', desc: 'It patrols the rooftops of Glasswater City and keeps the Rooftik flocks in line.' },
  psylet: { n: 86, name: 'Psylet', types: ['psychic'], base: [44, 30, 40, 66, 58, 56], growth: 'mslow', catch: 150, exp: 64, rarity: 'uncommon', line: 'psylet',
    evo: [{ to: 'psyren', lv: 32 }], moves: [[1, 'confusion'], [1, 'growl'], [9, 'hypnosis'], [14, 'dazzle'], [20, 'psybeam'], [27, 'focus_mind']], traits: ['radiance', 'keen_eye'],
    habitat: 'Route 5; Glasswater City (night)', desc: 'A floating Wildmon that hums a tune nobody can quite remember afterwards.' },
  psyren: { n: 87, name: 'Psyren', types: ['psychic'], base: [70, 50, 64, 108, 92, 86], growth: 'mslow', catch: 45, exp: 180, rarity: 'uncommon', line: 'psylet',
    evo: [], moves: [[1, 'confusion'], [1, 'growl'], [9, 'hypnosis'], [14, 'dazzle'], [20, 'psybeam'], [27, 'focus_mind'], [32, 'psy_storm'], [40, 'mend']], traits: ['radiance', 'keen_eye'],
    habitat: 'Evolves from Psylet', desc: 'Its song can lull a whole harbour to sleep. Sailors plug their ears when they hear it.' },
  rustrat: { n: 88, name: 'Rustnib', types: ['steel', 'normal'], base: [48, 56, 64, 30, 42, 52], growth: 'medium', catch: 190, exp: 60, rarity: 'common', line: 'rustrat',
    evo: [{ to: 'scraprat', lv: 28 }], moves: [[1, 'scratch'], [1, 'tail_whip'], [7, 'bite'], [12, 'metal_claw'], [18, 'headbutt'], [23, 'gear_grind']], traits: ['pickup', 'thick_fur'],
    habitat: 'Glasswater City back alleys', desc: 'A rat that builds nests out of bottle caps and bent spoons. It chews through padlocks for fun.' },
  scraprat: { n: 89, name: 'Scrapjaw', types: ['steel', 'normal'], base: [74, 90, 96, 40, 62, 74], growth: 'medium', catch: 60, exp: 168, rarity: 'common', line: 'rustrat',
    evo: [], moves: [[1, 'scratch'], [1, 'tail_whip'], [7, 'bite'], [12, 'metal_claw'], [18, 'headbutt'], [23, 'gear_grind'], [28, 'iron_head'], [34, 'crunch']], traits: ['pickup', 'iron_hide'],
    habitat: 'Evolves from Rustnib', desc: 'Its fur is mixed with scraps of iron. The Order uses Scrapjaw to guard their warehouses.' },
  bogling: { n: 90, name: 'Bogling', types: ['water', 'earth'], base: [60, 50, 50, 40, 44, 34], growth: 'medium', catch: 190, exp: 62, rarity: 'common', line: 'bogling',
    evo: [{ to: 'mudmaw', lv: 30 }], moves: [[1, 'water_gun'], [1, 'mud_slap'], [8, 'bubble'], [14, 'mud_shot'], [20, 'mud_bomb'], [26, 'brine_bite']], traits: ['thick_fur', 'torrent'],
    habitat: 'Saltmere; Route 7', desc: 'A round little mud dweller. It blows bubbles of bog water at anyone who steps on its pond.' },
  mudmaw: { n: 91, name: 'Mudmaw', types: ['water', 'earth'], base: [100, 85, 80, 62, 70, 40], growth: 'medium', catch: 60, exp: 175, rarity: 'common', line: 'bogling',
    evo: [], moves: [[1, 'water_gun'], [1, 'mud_slap'], [8, 'bubble'], [14, 'mud_shot'], [20, 'mud_bomb'], [26, 'brine_bite'], [30, 'tremor'], [38, 'hydro_pulse']], traits: ['thick_fur', 'sturdy'],
    habitat: 'Evolves from Bogling', desc: 'It lies in the marsh with only its huge mouth showing, waiting for something to wander in.' },
  fenwisp: { n: 92, name: 'Marshglow', types: ['ghost', 'grass'], base: [44, 36, 46, 62, 62, 52], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'fenwisp',
    evo: [{ to: 'willowraith', lv: 32 }], moves: [[1, 'lick'], [1, 'absorb'], [8, 'confuse_ray'], [13, 'mega_drain'], [19, 'hex_wave'], [25, 'seed_leech']], traits: ['floating', 'overgrowth'],
    habitat: 'Route 7 at night', desc: 'A will-o\'-the-wisp of marsh gas and willow leaves. It leads travellers in circles, giggling.' },
  willowraith: { n: 93, name: 'Willowmourn', types: ['ghost', 'grass'], base: [76, 60, 72, 102, 96, 64], growth: 'mslow', catch: 45, exp: 182, rarity: 'uncommon', line: 'fenwisp',
    evo: [], moves: [[1, 'lick'], [1, 'absorb'], [8, 'confuse_ray'], [13, 'mega_drain'], [19, 'hex_wave'], [25, 'seed_leech'], [32, 'shade_orb'], [40, 'solar_leaf']], traits: ['floating', 'overgrowth'],
    habitat: 'Evolves from Marshglow', desc: 'A weeping willow that walks at night. Its trailing leaves brush faces in the dark.' },
  croaklet: { n: 94, name: 'Croaklet', types: ['water', 'poison'], base: [46, 54, 40, 50, 40, 62], growth: 'medium', catch: 190, exp: 62, rarity: 'common', line: 'croaklet',
    evo: [{ to: 'venomcroak', lv: 28 }], moves: [[1, 'water_gun'], [1, 'poison_sting'], [7, 'bubble'], [12, 'acid'], [17, 'venom_fang'], [23, 'bubble_beam']], traits: ['toxic_touch', 'riptide_dash'],
    habitat: 'Saltmere; Route 7', desc: 'A bright frog whose colours mean "do not lick". Children in Saltmere learn that lesson early.' },
  venomcroak: { n: 95, name: 'Venomcroak', types: ['water', 'poison'], base: [72, 88, 62, 80, 62, 92], growth: 'medium', catch: 60, exp: 172, rarity: 'common', line: 'croaklet',
    evo: [], moves: [[1, 'water_gun'], [1, 'poison_sting'], [7, 'bubble'], [12, 'acid'], [17, 'venom_fang'], [23, 'bubble_beam'], [28, 'poison_jab'], [34, 'hydro_pulse']], traits: ['toxic_touch', 'riptide_dash'],
    habitat: 'Evolves from Croaklet', desc: 'Its croak echoes over the marsh at dusk. One sip of its toxin can drop a Mudmaw.' },
  gravemoth: { n: 96, name: 'Shroudfly', types: ['ghost', 'air'], base: [46, 40, 44, 60, 56, 70], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'gravemoth',
    evo: [{ to: 'tombwing', lv: 31 }], moves: [[1, 'gust'], [1, 'lick'], [8, 'confuse_ray'], [13, 'night_shade'], [19, 'wing_attack'], [25, 'hex_wave']], traits: ['floating', 'shed_skin'],
    habitat: 'Ashgrave graveyard', desc: 'A pale moth drawn to grave candles. It is said to carry messages for the departed.' },
  tombwing: { n: 97, name: 'Sepulchra', types: ['ghost', 'air'], base: [70, 60, 66, 96, 84, 102], growth: 'mslow', catch: 45, exp: 180, rarity: 'uncommon', line: 'gravemoth',
    evo: [], moves: [[1, 'gust'], [1, 'lick'], [8, 'confuse_ray'], [13, 'night_shade'], [19, 'wing_attack'], [25, 'hex_wave'], [31, 'air_slash'], [38, 'shade_orb']], traits: ['floating', 'night_eyes'],
    habitat: 'Evolves from Shroudfly', desc: 'Its wing scales glow like candle flames. It circles Ashgrave\'s bell tower every midnight.' },
  hexcat: { n: 98, name: 'Hexcat', types: ['dark', 'psychic'], base: [48, 56, 42, 58, 46, 72], growth: 'medium', catch: 120, exp: 66, rarity: 'uncommon', line: 'hexcat',
    evo: [{ to: 'hexpanther', lv: 30 }], moves: [[1, 'scratch'], [1, 'confusion'], [8, 'bite'], [13, 'hex_gaze'], [18, 'shadow_swipe'], [24, 'psy_cutter']], traits: ['night_eyes', 'keen_eye'],
    habitat: 'Glasswater City (night); Ashgrave', desc: 'A black cat with violet eyes. Crossing its path is said to be very lucky, or very unlucky.' },
  hexpanther: { n: 99, name: 'Hexpanther', types: ['dark', 'psychic'], base: [74, 92, 64, 88, 68, 104], growth: 'medium', catch: 45, exp: 180, rarity: 'uncommon', line: 'hexcat',
    evo: [], moves: [[1, 'scratch'], [1, 'confusion'], [8, 'bite'], [13, 'hex_gaze'], [18, 'shadow_swipe'], [24, 'psy_cutter'], [30, 'crunch'], [36, 'psybeam'], [42, 'swift_step']], traits: ['night_eyes', 'glare'],
    habitat: 'Evolves from Hexcat', desc: 'A sleek panther that hunts in the shadows of tall buildings. Morrow himself keeps one.' },
  bonepup: { n: 100, name: 'Bonewhelp', types: ['ghost'], base: [52, 58, 50, 40, 46, 56], growth: 'medium', catch: 150, exp: 64, rarity: 'uncommon', line: 'bonepup',
    evo: [{ to: 'cryptound', lv: 30 }], moves: [[1, 'lick'], [1, 'growl'], [7, 'bite'], [12, 'night_shade'], [18, 'shadow_claw'], [24, 'crunch']], traits: ['grit', 'run_away'],
    habitat: 'Ashgrave graveyard', desc: 'A loyal ghost puppy that still fetches sticks for its owner, who passed away long ago.' },
  cryptound: { n: 101, name: 'Barghest', types: ['ghost', 'dark'], base: [80, 98, 72, 56, 66, 90], growth: 'medium', catch: 45, exp: 178, rarity: 'uncommon', line: 'bonepup',
    evo: [], moves: [[1, 'lick'], [1, 'growl'], [7, 'bite'], [12, 'night_shade'], [18, 'shadow_claw'], [24, 'crunch'], [30, 'shade_orb'], [36, 'war_cry']], traits: ['grit', 'glare'],
    habitat: 'Evolves from Bonewhelp', desc: 'A great grey hound that guards the crypts. Its howl can be heard all the way to Saltmere.' },
  lampreel: { n: 102, name: 'Lampreel', types: ['water', 'electric'], base: [50, 46, 44, 64, 50, 62], growth: 'slow', catch: 120, exp: 66, rarity: 'uncommon', line: 'lampreel',
    evo: [{ to: 'voltreel', lv: 33 }], moves: [[1, 'water_gun'], [1, 'thundershock'], [9, 'thunder_wave'], [14, 'bubble_beam'], [20, 'eel_shock'], [27, 'spark']], traits: ['static', 'torrent'],
    habitat: 'Fishing in Saltmere and Glasswater', desc: 'An eel with a glowing lure on its head. Lost fishing boats follow its light home.' },
  voltreel: { n: 103, name: 'Shockreel', types: ['water', 'electric'], base: [80, 72, 70, 104, 80, 84], growth: 'slow', catch: 45, exp: 184, rarity: 'uncommon', line: 'lampreel',
    evo: [], moves: [[1, 'water_gun'], [1, 'thundershock'], [9, 'thunder_wave'], [14, 'bubble_beam'], [20, 'eel_shock'], [27, 'spark'], [33, 'thunderbolt'], [40, 'hydro_pulse']], traits: ['static', 'torrent'],
    habitat: 'Evolves from Lampreel', desc: 'A huge eel that crackles with power. Glasswater\'s old lighthouse keepers called it the sea\'s own lamp.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { rooftik: 'grit', psylet: 'shed_skin', rustrat: 'sturdy', bogling: 'old_growth', fenwisp: 'shed_skin', croaklet: 'grit', gravemoth: 'keen_eye', hexcat: 'glare', bonepup: 'thick_fur', lampreel: 'sturdy' });

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  ferry_ticket: { name: 'Sound Ferry Pass', pocket: 'key', desc: 'A season pass for the ferries that cross the Sound between Glasswater City, Saltmere and Port Calder.' },
  tower_key: { name: 'Tower Lift Key', pocket: 'key', desc: 'A Morrow Lumen keycard. It opens the private lift to the top floor of the tower.' },
  climbing_gear: { name: 'Climbing Gear', pocket: 'key', desc: 'Ropes, pitons and a good pair of boots from Hall Master Vesper. Lets you climb certain rocky slopes.' },
  scroll_shadowclaw: { name: 'Scroll: Shade Talon', pocket: 'scrolls', scroll: 'shadow_claw', sell: 1000, desc: `Teaches Shade Talon (ghost). Can be used again and again. ${DATA.moves.shadow_claw.desc}` },
  scroll_psycutter: { name: 'Scroll: Mind Cleaver', pocket: 'scrolls', scroll: 'psy_cutter', price: 2500, sell: 1250, desc: `Teaches Mind Cleaver (psychic). Can be used again and again. ${DATA.moves.psy_cutter.desc}` },
  scroll_divebomb: { name: 'Scroll: Dive Bomb', pocket: 'scrolls', scroll: 'dive_bomb', price: 3000, sell: 1500, desc: `Teaches Dive Bomb (air). Can be used again and again. ${DATA.moves.dive_bomb.desc}` },
  rare_candy: { name: 'Starseed Honey', pocket: 'items', field: true, levelup: true, sell: 1200, desc: 'A sweet, glowing candy. Raises a Wildmon by one level.' },
  max_potion: { name: 'Vital Draught', pocket: 'items', battle: 'heal', field: true, heal: 999, price: 2500, sell: 1250, desc: 'Fully restores one Wildmon\'s HP.' },
  full_heal: { name: 'Cure-All', pocket: 'items', battle: 'cure', field: true, cure: 'all', cureText: 'cured', price: 600, sell: 300, desc: 'Cures any status condition.' },
});
Object.assign(DATA.scrolls, { scroll_shadowclaw: 'shadow_claw', scroll_psycutter: 'psy_cutter', scroll_divebomb: 'dive_bomb' });
DATA.shops.glasswater = ['lantern', 'great_lantern', 'bright_lantern', 'kin_lantern', 'patience_lantern', 'dusk_lantern', 'tide_lantern', 'heal_lantern', 'friend_lantern', 'swift_lantern',
  'super_potion', 'hyper_potion', 'max_potion', 'full_heal', 'calm_incense', 'thunder_shard', 'sun_shard', 'dusk_shard', 'scroll_psycutter', 'scroll_divebomb'];
DATA.shops.saltmere = ['great_lantern', 'bright_lantern', 'tide_lantern', 'dusk_lantern', 'hyper_potion', 'full_heal', 'calm_incense', 'antidote'];
DATA.shops.ashgrave = ['bright_lantern', 'dusk_lantern', 'heal_lantern', 'hyper_potion', 'max_potion', 'full_heal', 'calm_incense', 'dusk_shard'];

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  corvin: { hair: '#2a2a2a', skin: '#c08a60', shirt: '#4a4a5a', pants: '#2a2a32', shoes: '#1a1a1a', hat: '#3a6a8a' },
  morrow: { hair: '#c8c8d0', skin: '#e8c8a0', shirt: '#e8e8f0', pants: '#3a3a4a', shoes: '#1a1a1a' },
  vesper: { hair: '#e8e8f0', skin: '#e8d0c0', shirt: '#3a2a4a', pants: '#3a2a4a', shoes: '#1a1a1a', hat: '#2a1a3a' },
  scientist: { hair: '#5a4a3a', skin: '#e8b890', shirt: '#f4f4f0', pants: '#4a4a5a', shoes: '#2a2a2a' },
  medium: { hair: '#6a3a6a', skin: '#e8c8b0', shirt: '#4a2a5a', pants: '#4a2a5a', shoes: '#1a1a1a', hat: '#6a3a6a' },
  gentleman: { hair: '#8a8a8a', skin: '#e8c8a0', shirt: '#3a3a4a', pants: '#2a2a32', shoes: '#1a1a1a', hat: '#2a2a32' },
});

/* ---------- Trainers ---------- */
Object.assign(DATA.trainers, {
  r5a: { cls: 'Gentleman', name: 'Alfred', look: 'gentleman', team: [['rooftik', 29], ['hexcat', 29]], prize: 60, ai: 'tactical',
    intro: 'A trainer! How splendid. Let us have a civilised battle.', lose: 'Quite right, quite right.', after: 'Glasswater City is the jewel of the Sound. Do mind the tower, though.' },
  r5b: { cls: 'Psychic', name: 'Lune', look: 'medium', team: [['psylet', 29], ['psylet', 30]], prize: 34, ai: 'tactical',
    intro: 'I knew you would come this way. I saw it in a dream.', lose: 'I did not see that coming...', after: 'Dark types are a Psychic\'s worst nightmare.' },
  r5c: { cls: 'Hiker', name: 'Bryn', look: 'hiker', team: [['bouldrum', 29], ['augerhawk', 30]], prize: 34, ai: 'tactical',
    intro: 'The road to Glasswater is long and steep. Let me test your legs!', lose: 'Steady on!', after: 'Glasswater has a mart with every kind of Lantern there is.' },
  tg1: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['scraprat', 30], ['rookling', 30]], prize: 34, ai: 'tactical', music: 'order',
    intro: 'Visitors are not allowed past the lobby!', lose: 'Security breach!', after: 'The pads are the only way up. The lifts need a key.' },
  tg2: { cls: 'Scientist', name: 'Dr Pell', look: 'scientist', team: [['coilbug', 30], ['psylet', 31]], prize: 40, ai: 'tactical', music: 'order',
    intro: 'Do you know how hard it is to fit a Siphon into a Lantern? Very hard. And you are interrupting!', lose: 'My calculations...!', after: 'The Siphons only work because Lanterns hold light. Morrow hates that.' },
  tg3: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt2', team: [['corvane', 31], ['venomcroak', 30]], prize: 36, ai: 'tactical', music: 'order',
    intro: 'Teleport pads make my head spin. Battling you will not!', lose: 'Dizzy...', after: 'Third floor is Admin Corvin\'s. Good luck with that.' },
  tg4: { cls: 'Scientist', name: 'Dr Wen', look: 'scientist', team: [['dynacoil', 31], ['hexcat', 31]], prize: 42, ai: 'expert', music: 'order',
    intro: 'Project Eclipse is classified. And so are you, now.', lose: 'Unthinkable!', after: '...Project Eclipse? I never said that.' },
  corvin: { cls: 'Admin', name: 'Corvin', look: 'corvin', team: [['scraprat', 31], ['tombwing', 32], ['corvane', 33, 'bramble_berry']], prize: 90, ai: 'expert', items: { hyper_potion: 1 }, pot: 8, music: 'battle_master',
    intro: 'Corvin', lose: 'The numbers did not add up.', after: '' },
  morrow: { cls: 'Director', name: 'Morrow', look: 'morrow', team: [['hexpanther', 30], ['pyrewraith', 30], ['dynacoil', 31], ['noxstag', 33, 'lucky_ribbon']], prize: 120, ai: 'expert', items: { super_potion: 1 }, pot: 6, music: 'battle_master',
    intro: 'Morrow', lose: 'So this is what a bond looks like from the other side.', after: '' },
  kit4: { cls: 'Rival', name: 'Kit', look: 'kit', team: [], prize: 80, ai: 'expert', items: { hyper_potion: 1 }, pot: 9,
    lose: 'Argh! Again?!', win: 'Finally! I KNEW I could beat you!' },
  s7a: { cls: 'Fisher', name: 'Moss', look: 'fisher', team: [['lampreel', 31], ['croaklet', 31], ['bogling', 31]], prize: 30, ai: 'tactical',
    intro: 'Shh! You will scare the eels! ...Too late. Battle!', lose: 'Snagged!', after: 'Lampreel bite at night in Saltmere. Bring a Tide Lantern.' },
  s7b: { cls: 'Medium', name: 'Orla', look: 'medium', team: [['fenwisp', 32], ['gravemoth', 32]], prize: 36, ai: 'tactical',
    intro: 'The spirits of the moor want to battle you...', lose: 'The spirits are pleased.', after: 'Sister Vesper speaks with the spirits too. They like her.' },
  s7c: { cls: 'Black Belt', name: 'Tor', look: 'blackbelt', team: [['gauntlord', 32], ['cogmaul', 32]], prize: 40, ai: 'tactical',
    intro: 'I train on the moors where it is cold and miserable. Builds character!', lose: 'Character built.', after: 'Ghost types laugh off Fighting moves. Bring something else to Ashgrave.' },
  vh1: { cls: 'Medium', name: 'Hesper', look: 'medium', team: [['wispet', 32], ['bonepup', 33]], prize: 38, ai: 'tactical',
    intro: 'Can you see in the dark? The ghosts can.', lose: 'Into the light...', after: 'Follow the candles. They never lie.' },
  vh2: { cls: 'Medium', name: 'Morwen', look: 'medium', team: [['fenwisp', 33], ['lanternwisp', 33]], prize: 40, ai: 'expert',
    intro: 'Sister Vesper is near. But you must pass me first...', lose: 'Gone like smoke...', after: 'Dark and Ghost moves hit ghosts hardest. Normal moves pass right through them.' },
  vesper: { cls: 'Hall Master', name: 'Vesper', look: 'vesper', team: [['tombwing', 33], ['cryptound', 33], ['willowraith', 34], ['gloamshade', 36, 'cure_berry']], prize: 120, ai: 'expert', items: { hyper_potion: 2 }, pot: 9,
    intro: 'Vesper', lose: 'The spirits sing for you tonight.', after: '' },
});
Object.defineProperty(DATA.trainers.kit4, 'team', {
  get() {
    const evo = { mossling: 'thornback', firecub: 'cinderclaw', puddlepup: 'brinehound' };
    const pick = RIVAL_PICK[G && G.flags.starter] || 'firecub';
    return [['gustfinch', 31], ['joltfox', 31], ['thicketrat', 30], ['psylet', 30], [evo[pick], 34, 'hearth_ember']];
  },
});
Object.defineProperty(DATA.trainers.kit4, 'intro', { get() { return ['{player}! I saw you go into that tower. Are you mad?!', 'The Professor is worried sick. So am I. A bit. Not really.', 'Anyway, I have been training. Battle me!']; } });

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  route5: {
    grass: {
      day: [['rooftik', 26, 27, 30], ['psylet', 12, 27, 30], ['drillbeak', 16, 27, 30], ['pummelo', 12, 27, 30], ['sprigrat', 14, 27, 29], ['zappik', 10, 27, 30], ['hexcat', 10, 28, 30], ['mossling', 5, 27, 29]],
      night: [['hexcat', 22, 28, 30], ['psylet', 20, 27, 30], ['rooftik', 18, 27, 30], ['fizzbat', 20, 27, 30], ['shadepaw', 20, 27, 30], ['mossling', 5, 27, 29]],
    },
  },
  glasswater: {
    fish: { day: [['flopfin', 30, 28, 32], ['lampreel', 26, 29, 32], ['glintstar', 24, 29, 32], ['gyrefin', 20, 30, 33]] },
    surf: { day: [['gullet', 30, 28, 32], ['mantaglide', 26, 29, 32], ['squallgull', 14, 30, 33], ['glintstar', 30, 29, 32]] },
  },
  saltmere: {
    fish: { day: [['croaklet', 30, 29, 32], ['bogling', 30, 29, 32], ['lampreel', 30, 29, 32], ['murkle', 10, 30, 32]] },
    surf: { day: [['bogling', 36, 29, 32], ['croaklet', 34, 29, 32], ['bogmire', 12, 31, 33], ['lampreel', 18, 30, 32]] },
  },
  route7: {
    grass: {
      day: [['bogling', 26, 30, 33], ['croaklet', 24, 30, 33], ['sporelet', 14, 30, 32], ['hexcat', 12, 30, 33], ['fawnlight', 8, 30, 33], ['cindertoad', 16, 30, 32]],
      night: [['fenwisp', 26, 30, 33], ['gravemoth', 22, 30, 33], ['bonepup', 18, 30, 33], ['croaklet', 18, 30, 33], ['shadepaw', 16, 30, 33]],
    },
    surf: { day: [['bogling', 40, 30, 33], ['croaklet', 40, 30, 33], ['bogmire', 20, 31, 34]] },
  },
  ashgrave: {
    grass: {
      day: [['bonepup', 30, 31, 34], ['gravemoth', 28, 31, 34], ['wispet', 22, 31, 34], ['hexcat', 20, 31, 34]],
      night: [['bonepup', 26, 31, 34], ['gravemoth', 26, 31, 34], ['lanternwisp', 14, 32, 34], ['fenwisp', 20, 31, 34], ['kindlit', 4, 32, 34], ['hexcat', 10, 31, 34]],
    },
  },
  ml_tower_2: { cave: { day: [['rustrat', 40, 29, 32], ['coilbug', 30, 29, 32], ['psylet', 30, 29, 32]] } },
});
for (const t of Object.values(DATA.encounters)) for (const k of Object.keys(t)) if (!t[k].night) t[k].night = t[k].day;

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  glasswater: { bpm: 112, lead: 'square', chords: ['G', 'Em', 'C', 'D', 'G', 'Em', 'Am', 'D'],
    melody: 'B5:2 D6:2 G6:2 D6:2 E6:4 D6:4 C6:2 B5:2 A5:2 B5:2 C6:4 D6:4 B5:2 D6:2 G6:2 A6:2 B6:4 A6:4 G6:2 E6:2 C6:2 A5:2 D6:8' },
  tower: { bpm: 124, lead: 'square', tr: -2, chords: ['Dm', 'Dm', 'Bb', 'A', 'Dm', 'Dm', 'Gm', 'A'],
    melody: 'D5:1 F5:1 A5:2 D6:2 C6:2 A5:2 F5:2 G5:4 A5:2 Bb5:2 A5:2 G5:2 F5:2 E5:2 C#5:4 D5:1 F5:1 A5:2 D6:2 E6:2 F6:2 E6:2 D6:4 Bb5:2 G5:2 A5:2 G5:2 E5:4 D5:4' },
  marsh: { bpm: 84, lead: 'triangle', tr: -2, chords: ['Am', 'G', 'F', 'E', 'Am', 'G', 'F', 'E'],
    melody: 'E5:4 A5:2 G5:2 E5:4 D5:4 C5:4 D5:2 E5:2 B4:8 E5:4 A5:2 B5:2 C6:4 B5:4 A5:4 G5:2 F5:2 E5:8' },
  ashgrave: { bpm: 76, lead: 'triangle', tr: -5, chords: ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'Gm', 'A'],
    melody: 'A4:4 D5:2 F5:2 E5:4 D5:4 Bb4:4 D5:2 C5:2 C#5:8 A4:4 D5:2 F5:2 A5:4 G5:4 F5:4 E5:2 D5:2 E5:8' },
});

/* ---------- Quests ---------- */
DATA.quests.act3 = {
  name: 'The Glass Tower', kind: 'main', giver: 'Brann',
  stages: [
    'The Hollow Order\'s ship was heading for Glasswater City. Take Route 5 north from Voltara.',
    'Morrow Lumen Industries has its headquarters in Glasswater City. Get inside the tower and find out what they are planning.',
    'Climb the Morrow Lumen Tower. The teleport pads are the only way up.',
    'Morrow has fled to the Sound. Take the ferry from Glasswater City to Saltmere.',
    'Head north from Saltmere along Route 7 to Ashgrave.',
    'Earn the Veil Badge from Hall Master Vesper in Ashgrave.',
  ],
  reward: 'Vital Draught x3, Starseed Honey x2',
};
Object.assign(DATA.region.find((r) => r.id === 'glasswater') || {}, { desc: 'The glittering capital of the Sound, home of the Morrow Lumen Tower and the ferry docks.' });
Object.assign(DATA.region.find((r) => r.id === 'saltmere') || {}, { desc: 'A misty fishing town on stilts at the edge of the western marshes.' });
Object.assign(DATA.region.find((r) => r.id === 'ashgrave') || {}, { desc: 'A quiet town of old stone and older graves, home of the Veil Hall.' });
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'glasswater'), 0, { id: 'route5', name: 'Route 5', x: 134, y: 120, desc: 'A hill road north of Voltara, climbing to Glasswater City.' });
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'ashgrave'), 0, { id: 'route7', name: 'Route 7', x: 56, y: 120, desc: 'A boggy moorland path between Saltmere and Ashgrave. Foggy, and haunted after dark.' });
DATA.regionRoutes = DATA.regionRoutes.filter(([a, b]) => !(a === 'voltara' && b === 'glasswater') && !(a === 'saltmere' && b === 'ashgrave'))
  .concat([['voltara', 'route5'], ['route5', 'glasswater'], ['saltmere', 'route7'], ['route7', 'ashgrave']]);
