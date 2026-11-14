'use strict';
/* =====================================================================
   FROSTHAVEN DATA — Frostspine Pass, Frosthaven, the Frost Hall and the
   Glacier Beacon, where the Order takes the last Cores and the sun goes out.
   ===================================================================== */

Object.assign(DATA.tiles, {
  '@': { t: 'ice', ice: true },
  '&': { t: 'iceblock', solid: true, text: 'A block of solid blue ice. It won\'t budge.' },
  '?': { t: 'snowpine', solid: true, text: 'A pine tree heavy with snow.' },
});

/* ---------- Moves ---------- */
Object.assign(DATA.moves, {
  avalanche: { name: 'Icefall', type: 'ice', cat: 'phys', pow: 80, acc: 100, pp: 10, desc: 'Brings a wall of snow and ice crashing down on the foe.' },
  blizzard: { name: 'Snow Squall', type: 'ice', cat: 'spec', pow: 110, acc: 70, pp: 5, eff: 'frz', ch: 10, desc: 'A howling blizzard. Hard to aim, but may freeze.' },
  ice_shard: { name: 'Rime Dart', type: 'ice', cat: 'phys', pow: 40, acc: 100, pp: 30, pri: 1, desc: 'Flings a chunk of ice. Always goes first.' },
  frost_armor: { name: 'Frost Armour', type: 'ice', cat: 'status', acc: null, pp: 15, eff: 'self', st: { def: 2 }, desc: 'Coats itself in thick ice. Sharply raises Defence.' },
  aurora_beam: { name: 'Polar Ray', type: 'ice', cat: 'spec', pow: 65, acc: 100, pp: 20, eff: 'foe', st: { atk: -1 }, ch: 10, desc: 'A shimmering rainbow beam. May lower Attack.' },
});

/* ---------- Species #124–143 ---------- */
Object.assign(DATA.species, {
  pengling: { n: 124, name: 'Pengling', types: ['water', 'ice'], base: [52, 50, 48, 54, 54, 40], growth: 'mslow', catch: 140, exp: 64, rarity: 'common', line: 'pengling',
    evo: [{ to: 'floemperor', lv: 36 }], moves: [[1, 'peck'], [1, 'growl'], [8, 'bubble'], [14, 'powder_snow'], [20, 'brine_bite'], [26, 'aurora_beam'], [32, 'bubble_beam']], traits: ['torrent', 'thick_fur'],
    habitat: 'Frosthaven harbour; Frostspine Pass', desc: 'It toboggans down snowy slopes on its belly and never once looks where it is going.' },
  floemperor: { n: 125, name: 'Floemperor', types: ['water', 'ice'], base: [94, 76, 78, 92, 90, 60], growth: 'mslow', catch: 45, exp: 188, rarity: 'common', line: 'pengling',
    evo: [], moves: [[1, 'peck'], [1, 'growl'], [8, 'bubble'], [14, 'powder_snow'], [20, 'brine_bite'], [26, 'aurora_beam'], [32, 'bubble_beam'], [36, 'hydro_pulse'], [44, 'blizzard']], traits: ['torrent', 'glare'],
    habitat: 'Evolves from Pengling', desc: 'It rules the ice floes with great dignity. Every Pengling in the harbour bows as it waddles past.' },
  frostbun: { n: 126, name: 'Flurrybun', types: ['ice', 'normal'], base: [48, 50, 40, 36, 44, 70], growth: 'fast', catch: 190, exp: 58, rarity: 'common', line: 'frostbun',
    evo: [{ to: 'blizzhare', lv: 33 }], moves: [[1, 'tackle'], [1, 'tail_whip'], [7, 'powder_snow'], [13, 'quick_attack'], [19, 'ice_shard'], [25, 'headbutt'], [31, 'ice_fang']], traits: ['run_away', 'thick_fur'],
    habitat: 'Frostspine Pass', desc: 'Its white coat makes it invisible in snow. You usually only spot one when it sneezes.' },
  blizzhare: { n: 127, name: 'Blizzhare', types: ['ice'], base: [72, 84, 62, 50, 64, 108], growth: 'fast', catch: 60, exp: 170, rarity: 'common', line: 'frostbun',
    evo: [], moves: [[1, 'tackle'], [1, 'tail_whip'], [7, 'powder_snow'], [13, 'quick_attack'], [19, 'ice_shard'], [25, 'headbutt'], [31, 'ice_fang'], [33, 'avalanche'], [40, 'reckless_charge']], traits: ['run_away', 'keen_eye'],
    habitat: 'Evolves from Flurrybun', desc: 'It bounds across snowfields faster than a sled. A single kick from its back legs can start an avalanche.' },
  yetling: { n: 128, name: 'Yetling', types: ['ice', 'fighting'], base: [62, 70, 54, 30, 44, 42], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'yetling',
    evo: [{ to: 'yetimaul', lv: 38 }], moves: [[1, 'scratch'], [1, 'leer'], [9, 'powder_snow'], [15, 'low_kick'], [21, 'ice_fang'], [27, 'bulk_up'], [33, 'focus_strike']], traits: ['thick_fur', 'grit'],
    habitat: 'Frostspine Pass (caves and drifts)', desc: 'A shaggy little brawler that wrestles snowballs bigger than itself. It always wins.' },
  yetimaul: { n: 129, name: 'Yetibrute', types: ['ice', 'fighting'], base: [104, 118, 86, 44, 66, 62], growth: 'mslow', catch: 35, exp: 196, rarity: 'uncommon', line: 'yetling',
    evo: [], moves: [[1, 'scratch'], [1, 'leer'], [9, 'powder_snow'], [15, 'low_kick'], [21, 'ice_fang'], [27, 'bulk_up'], [33, 'focus_strike'], [38, 'avalanche'], [46, 'reckless_charge']], traits: ['thick_fur', 'grit'],
    habitat: 'Evolves from Yetling', desc: 'Its footprints are a metre long. Mountain guides treat a Yetibrute trail as a warning to turn back.' },
  icicub: { n: 130, name: 'Icicub', types: ['ice'], base: [60, 58, 64, 40, 50, 38], growth: 'slow', catch: 90, exp: 68, rarity: 'uncommon', line: 'icicub',
    evo: [{ to: 'glacieryx', lv: 40 }], moves: [[1, 'tackle'], [1, 'harden'], [9, 'powder_snow'], [15, 'bite'], [21, 'ice_fang'], [27, 'frost_armor'], [33, 'avalanche']], traits: ['thick_fur', 'sturdy'],
    habitat: 'Frosthaven glacier', desc: 'A bear cub with ice crystals growing along its back. It sucks on icicles the way other cubs suck their paws.' },
  glacieryx: { n: 131, name: 'Glacieryx', types: ['ice', 'rock'], base: [100, 112, 122, 54, 76, 46], growth: 'slow', catch: 25, exp: 210, rarity: 'uncommon', line: 'icicub',
    evo: [], moves: [[1, 'tackle'], [1, 'harden'], [9, 'powder_snow'], [15, 'bite'], [21, 'ice_fang'], [27, 'frost_armor'], [33, 'avalanche'], [40, 'rock_slide'], [48, 'crag_charge']], traits: ['thick_fur', 'iron_hide'],
    habitat: 'Evolves from Icicub', desc: 'A walking glacier. Its armour of ancient ice has never once melted, not even in summer.' },
  shardling: { n: 132, name: 'Shardling', types: ['ice', 'psychic'], base: [44, 30, 56, 66, 62, 52], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'shardling',
    evo: [{ to: 'prismafrost', lv: 36 }], moves: [[1, 'confusion'], [1, 'harden'], [9, 'powder_snow'], [15, 'psybeam'], [21, 'aurora_beam'], [27, 'focus_mind'], [33, 'frost_beam']], traits: ['radiance', 'sturdy'],
    habitat: 'Frosthaven glacier', desc: 'A floating ice crystal that hums faintly. It splits sunlight into rainbows across the snow.' },
  prismafrost: { n: 133, name: 'Facetfrost', types: ['ice', 'psychic'], base: [70, 46, 86, 112, 96, 80], growth: 'mslow', catch: 40, exp: 190, rarity: 'uncommon', line: 'shardling',
    evo: [], moves: [[1, 'confusion'], [1, 'harden'], [9, 'powder_snow'], [15, 'psybeam'], [21, 'aurora_beam'], [27, 'focus_mind'], [33, 'frost_beam'], [36, 'psy_storm'], [44, 'blizzard']], traits: ['radiance', 'iron_hide'],
    habitat: 'Evolves from Shardling', desc: 'A great floating chandelier of ice. On clear nights it hangs over the glacier like a second moon.' },
  mammote: { n: 134, name: 'Mammote', types: ['ice', 'earth'], base: [70, 66, 58, 30, 40, 36], growth: 'slow', catch: 120, exp: 66, rarity: 'common', line: 'mammote',
    evo: [{ to: 'mammaul', lv: 38 }], moves: [[1, 'tackle'], [1, 'growl'], [9, 'mud_slap'], [15, 'powder_snow'], [21, 'dig_claw'], [27, 'ice_fang'], [33, 'avalanche']], traits: ['thick_fur', 'sturdy'],
    habitat: 'Frostspine Pass', desc: 'It snuffles under the snow for roots with its stubby trunk. A Mammote herd sounds like a brass band warming up.' },
  mammaul: { n: 135, name: 'Mastodor', types: ['ice', 'earth'], base: [118, 114, 86, 46, 62, 56], growth: 'slow', catch: 35, exp: 200, rarity: 'common', line: 'mammote',
    evo: [], moves: [[1, 'tackle'], [1, 'growl'], [9, 'mud_slap'], [15, 'powder_snow'], [21, 'dig_claw'], [27, 'ice_fang'], [33, 'avalanche'], [38, 'tremor'], [46, 'body_slam']], traits: ['thick_fur', 'grit'],
    habitat: 'Evolves from Mammote', desc: 'Its great curled tusks can clear a snowed-in road in an afternoon. Frosthaven keeps three on the town payroll.' },
  auroraith: { n: 136, name: 'Wintergeist', types: ['ghost', 'ice'], base: [70, 50, 70, 98, 92, 90], growth: 'slow', catch: 30, exp: 190, rarity: 'rare', line: 'auroraith',
    evo: [], moves: [[1, 'lick'], [1, 'powder_snow'], [12, 'confuse_ray'], [20, 'aurora_beam'], [28, 'hex_wave'], [36, 'shade_orb'], [44, 'blizzard']], traits: ['floating', 'radiance'],
    habitat: 'Frosthaven glacier (night)', desc: 'It drifts over the glacier on the darkest nights, trailing green and violet light. Some say it is the northern lights themselves.' },
  huskpup: { n: 137, name: 'Mushling', types: ['normal', 'ice'], base: [56, 62, 46, 30, 42, 64], growth: 'mfast', catch: 150, exp: 62, rarity: 'common', line: 'huskpup',
    evo: [{ to: 'sledhound', lv: 32 }], moves: [[1, 'tackle'], [1, 'growl'], [8, 'bite'], [14, 'powder_snow'], [20, 'headbutt'], [26, 'ice_fang'], [30, 'war_cry']], traits: ['thick_fur', 'pickup'],
    habitat: 'Frosthaven', desc: 'It howls at dawn to wake the town. Frosthaven children grow up with a Mushling asleep at the foot of the bed.' },
  sledhound: { n: 138, name: 'Sledgard', types: ['normal', 'ice'], base: [84, 98, 72, 44, 62, 96], growth: 'mfast', catch: 50, exp: 176, rarity: 'common', line: 'huskpup',
    evo: [], moves: [[1, 'tackle'], [1, 'growl'], [8, 'bite'], [14, 'powder_snow'], [20, 'headbutt'], [26, 'ice_fang'], [30, 'war_cry'], [32, 'avalanche'], [40, 'body_slam']], traits: ['thick_fur', 'glare'],
    habitat: 'Evolves from Mushling', desc: 'A team of six can pull a laden sled up Frostspine Pass in a blizzard. They argue about who leads.' },
  frostmoth: { n: 139, name: 'Hoarflit', types: ['ice', 'air'], base: [46, 34, 44, 60, 56, 62], growth: 'mfast', catch: 150, exp: 62, rarity: 'common', line: 'frostmoth',
    evo: [{ to: 'aurmoth', lv: 34 }], moves: [[1, 'gust'], [1, 'powder_snow'], [9, 'glimmer'], [15, 'aurora_beam'], [21, 'air_slash'], [27, 'dazzle'], [32, 'frost_beam']], traits: ['floating', 'keen_eye'],
    habitat: 'Frostspine Pass', desc: 'Its wings are made of frost. Warm hands make them melt, so it hates being held.' },
  aurmoth: { n: 140, name: 'Borealis', types: ['ice', 'light'], base: [72, 50, 66, 102, 90, 92], growth: 'mfast', catch: 45, exp: 182, rarity: 'common', line: 'frostmoth',
    evo: [], moves: [[1, 'gust'], [1, 'powder_snow'], [9, 'glimmer'], [15, 'aurora_beam'], [21, 'air_slash'], [27, 'dazzle'], [32, 'frost_beam'], [34, 'dazzling_ray'], [42, 'blizzard']], traits: ['floating', 'radiance'],
    habitat: 'Evolves from Hoarflit', desc: 'Its wings shimmer with every colour of the aurora. A swarm over Frosthaven is a sight people travel for.' },
  rimeshell: { n: 141, name: 'Hailclam', types: ['ice', 'steel'], base: [56, 52, 84, 34, 56, 18], growth: 'slow', catch: 120, exp: 66, rarity: 'uncommon', line: 'rimeshell',
    evo: [{ to: 'ironfrost', lv: 35 }], moves: [[1, 'tackle'], [1, 'harden'], [9, 'powder_snow'], [15, 'metal_claw'], [21, 'ice_shard'], [27, 'iron_defense'], [33, 'iron_head']], traits: ['shell_armor', 'sturdy'],
    habitat: 'Frosthaven harbour', desc: 'A snail with a shell of frozen iron. It takes a whole winter to cross the harbour wall.' },
  ironfrost: { n: 142, name: 'Bergbastion', types: ['ice', 'steel'], base: [86, 88, 130, 52, 86, 28], growth: 'slow', catch: 40, exp: 190, rarity: 'uncommon', line: 'rimeshell',
    evo: [], moves: [[1, 'tackle'], [1, 'harden'], [9, 'powder_snow'], [15, 'metal_claw'], [21, 'ice_shard'], [27, 'iron_defense'], [33, 'iron_head'], [35, 'avalanche'], [44, 'gear_grind']], traits: ['shell_armor', 'iron_hide'],
    habitat: 'Evolves from Hailclam', desc: 'Its shell rings like a bell when struck. Old ships used Bergbastion as fog horns.' },
  snowdrift: { n: 143, name: 'Whiteout', types: ['ice', 'dark'], base: [70, 96, 60, 70, 60, 110], growth: 'slow', catch: 30, exp: 196, rarity: 'rare', line: 'snowdrift',
    evo: [], moves: [[1, 'scratch'], [1, 'leer'], [10, 'ice_shard'], [18, 'shadow_swipe'], [26, 'ice_fang'], [34, 'crunch'], [42, 'avalanche'], [50, 'eclipse_pulse']], traits: ['night_eyes', 'keen_eye'],
    habitat: 'Frostspine Pass (night, rare)', desc: 'A white lynx that hunts in blizzards. When the wind dies, its tracks vanish as if it was never there.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { pengling: 'grit', frostbun: 'keen_eye', yetling: 'sturdy', icicub: 'grit', shardling: 'floating', mammote: 'iron_hide', auroraith: 'night_eyes', huskpup: 'grit', frostmoth: 'radiance', rimeshell: 'grit', snowdrift: 'glare' });

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  scroll_avalanche: { name: 'Scroll: Icefall', pocket: 'items', scroll: 'avalanche', sell: 2000, desc: 'A Move Scroll. Teaches Icefall to a Wildmon that can use Ice moves.' },
  scroll_auroabeam: { name: 'Scroll: Polar Ray', pocket: 'items', scroll: 'aurora_beam', price: 4000, sell: 1500, desc: 'A Move Scroll. Teaches Polar Ray to a Wildmon that can use Ice moves.' },
  scroll_iceshard: { name: 'Scroll: Rime Dart', pocket: 'items', scroll: 'ice_shard', price: 3000, sell: 1200, desc: 'A Move Scroll. Teaches Rime Dart to a Wildmon that can use Ice moves.' },
  hot_cocoa: { name: 'Hot Cocoa', pocket: 'items', battle: 'heal', field: true, heal: 120, price: 900, sell: 450, desc: 'A Frosthaven favourite. Restores 120 HP to one Wildmon.' },
});
Object.assign(DATA.scrolls, { scroll_avalanche: 'avalanche', scroll_auroabeam: 'aurora_beam', scroll_iceshard: 'ice_shard' });
DATA.shops.frosthaven = ['great_lantern', 'bright_lantern', 'dusk_lantern', 'patience_lantern', 'hot_cocoa', 'hyper_potion', 'max_potion', 'full_heal', 'calm_incense', 'scroll_auroabeam', 'scroll_iceshard'];

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  torvald: { hair: '#e8e8e8', skin: '#d8a888', shirt: '#4a6a8a', pants: '#3a3a4a', shoes: '#3a2a1a', hat: '#8a2a2a' },
  skier: { hair: '#e8c040', skin: '#f0c8a8', shirt: '#e84a6a', pants: '#2a3a6a', shoes: '#1a1a1a', hat: '#f8f8f8' },
  guide: { hair: '#4a3a2a', skin: '#d0a080', shirt: '#6a8a5a', pants: '#4a3a2a', shoes: '#2a1a0a', hat: '#c86a2a' },
});

/* ---------- Trainers ---------- */
Object.assign(DATA.trainers, {
  fp1: { cls: 'Skier', name: 'Lotte', look: 'skier', team: [['frostbun', 38], ['pengling', 38]], prize: 40, ai: 'tactical',
    intro: 'Mind the ice! Once you start sliding, you don\'t stop until you hit something!', lose: 'Wipeout!', after: 'Plan your slide before you step onto the ice. Rocks are your friends.' },
  fp2: { cls: 'Mountain Guide', name: 'Sten', look: 'guide', team: [['mammote', 38], ['yetling', 39]], prize: 41, ai: 'tactical',
    intro: 'Nobody crosses my pass without proving they can handle the cold!', lose: 'You\'ll do.', after: 'Frosthaven is just over the ridge. Watch out for the Order. They came through yesterday.' },
  fp3: { cls: 'Skier', name: 'Bram', look: 'skier', team: [['frostmoth', 38], ['huskpup', 38], ['blizzhare', 39]], prize: 41, ai: 'tactical',
    intro: 'Race you to the bottom! Loser buys cocoa!', lose: 'I\'ll get the cocoa...', after: 'Hot Cocoa from the Frosthaven Mart heals better than a Grand Tonic. Tastes better too.' },
  og5: { cls: 'Order Grunt', name: 'Grunt', look: 'grunt', team: [['scraprat', 38], ['hexcat', 38], ['tombwing', 38]], prize: 40, ai: 'tactical', music: 'order',
    intro: 'Brr! You\'re not supposed to be up here! The Director said nobody follows us!', lose: 'Too cold to fight properly...', after: 'The Director is up at the Glacier Beacon. Bet you can\'t even find it.' },
  kit5: { cls: 'Rival', name: 'Kit', look: 'kit', team: [], prize: 90, ai: 'expert', items: { hyper_potion: 2 }, pot: 9 },
  fh1: { cls: 'Skier', name: 'Ylva', look: 'skier', team: [['frostbun', 40], ['shardling', 40]], prize: 42, ai: 'tactical',
    intro: 'The Frost Hall is one big ice rink. Fall over and you\'re out!', lose: 'Slipped up...', after: 'Look for the ice blocks. You can only stop when you hit one.' },
  fh2: { cls: 'Mountain Guide', name: 'Ake', look: 'guide', team: [['rimeshell', 40], ['icicub', 41]], prize: 43, ai: 'tactical',
    intro: 'Torvald trained me himself. Let\'s see your footing!', lose: 'Steady hands, you have.', after: 'Torvald\'s Wildmon set up hail and hide behind their armour. Hit them before they settle in.' },
  fh3: { cls: 'Skier', name: 'Saga', look: 'skier', team: [['frostmoth', 40], ['pengling', 40], ['yetling', 41]], prize: 43, ai: 'tactical',
    intro: 'You made it across? Then let\'s see if you can beat me!', lose: 'Fine, fine, go see the old man.', after: 'Fire, Fighting, Rock and Steel moves crack ice. Remember that.' },
  torvald: { cls: 'Hall Master', name: 'Torvald', look: 'torvald', team: [['blizzhare', 41], ['prismafrost', 42], ['floemperor', 42], ['yetimaul', 43], ['glacieryx', 44, 'cure_berry']], prize: 140, ai: 'expert', items: { hyper_potion: 2 }, pot: 9, music: 'battle_master',
    intro: 'Torvald', lose: 'Ha! Warmed these old bones right up, that did.', after: '' },
  corvin3: { cls: 'Admin', name: 'Corvin', look: 'corvin', team: [['scraprat', 41], ['dynacoil', 41], ['tombwing', 42], ['hexpanther', 42]], prize: 100, ai: 'expert', items: { hyper_potion: 1 }, pot: 7, music: 'battle_master',
    intro: 'Corvin', lose: 'I have run the numbers a thousand times. They always say you lose.', after: '' },
  sable3: { cls: 'Admin', name: 'Sable', look: 'sable', team: [['wraithtide', 41], ['corvane', 41], ['gloomowl', 42], ['nightprowl', 43, 'bramble_berry']], prize: 100, ai: 'expert', items: { hyper_potion: 1 }, pot: 7, music: 'battle_master',
    intro: 'Sable', lose: 'Go on, then. It\'s already too late.', after: '' },
});
Object.defineProperty(DATA.trainers.kit5, 'team', {
  get() {
    const evo = { mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' };
    const pick = RIVAL_PICK[G && G.flags.starter] || 'firecub';
    return [['tempestral', 40], ['joltfox', 40], ['psyren', 40], ['thicketrat', 39], [evo[pick], 43, 'hearth_ember']];
  },
});
Object.defineProperty(DATA.trainers.kit5, 'intro', { get() { return ['{player}! Told you, didn\'t I? Next time it\'s you and me.', 'I came all the way up this frozen mountain just to beat you. So you\'d better not hold back!']; } });
DATA.trainers.kit5.lose = 'Again?! How do you keep DOING that?';
DATA.trainers.kit5.after = 'Fine. Go and stop Morrow. But I\'m coming too.';

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  frostspine: {
    grass: {
      day: [['frostbun', 24, 37, 40], ['mammote', 18, 37, 40], ['frostmoth', 18, 37, 40], ['pengling', 14, 37, 40], ['yetling', 10, 38, 40], ['huskpup', 10, 37, 40], ['snowpip', 6, 38, 40]],
      night: [['frostmoth', 22, 37, 40], ['yetling', 18, 38, 40], ['frostbun', 18, 37, 40], ['hootlet', 16, 37, 40], ['mammote', 12, 37, 40], ['snowdrift', 4, 39, 41], ['frostkit', 10, 38, 40]],
    },
  },
  frosthaven: {
    fish: { day: [['pengling', 30, 38, 42], ['rimeshell', 24, 38, 41], ['flopfin', 26, 36, 40], ['lampreel', 20, 38, 42]] },
    surf: { day: [['pengling', 34, 38, 42], ['floemperor', 6, 40, 42], ['rimeshell', 30, 38, 41], ['skymanta', 30, 39, 42]] },
  },
  glacier: {
    grass: {
      day: [['icicub', 22, 39, 42], ['shardling', 22, 39, 42], ['frostkit', 18, 39, 42], ['huskpup', 16, 39, 42], ['snowpip', 14, 39, 42], ['mammote', 8, 39, 42]],
      night: [['shardling', 24, 39, 42], ['icicub', 18, 39, 42], ['auroraith', 8, 40, 42], ['frostkit', 18, 39, 42], ['hootlet', 16, 39, 42], ['snowdrift', 6, 40, 42], ['snowpip', 10, 39, 42]],
    },
  },
});

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  frost: { bpm: 96, lead: 'triangle', tr: 0, chords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'Am', 'B'],
    melody: 'B4:2 E5:2 G5:4 F#5:2 E5:2 B5:4 A5:2 G5:2 E5:4 F#5:2 G5:2 A5:4 B5:2 A5:2 G5:4 E5:2 G5:2 C6:4 B5:2 A5:2 E5:4 D#5:8' },
  pass: { bpm: 120, lead: 'square', tr: 0, chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'E'],
    melody: 'A4:2 C5:2 E5:4 E5:2 F5:2 A5:4 G5:2 E5:2 C5:4 D5:2 E5:2 G5:4 A5:2 G5:2 E5:4 C5:2 D5:2 F5:4 E5:2 D5:2 B4:4 G#4:8' },
  eclipse: { bpm: 72, lead: 'triangle', tr: -2, chords: ['Cm', 'Ab', 'Fm', 'G', 'Cm', 'Ab', 'Fm', 'G'],
    melody: 'C5:4 Eb5:4 Ab5:8 G5:4 F5:4 Eb5:8 C5:4 D5:4 Eb5:4 F5:4 G5:16' },
});

/* ---------- Quests ---------- */
DATA.quests.act4 = {
  name: 'The Long Night', kind: 'main', giver: 'Aerin',
  stages: [
    'Morrow fled north-east to Frosthaven. Cross Frostspine Pass, east of Skyreach.',
    'Earn the Frost Badge from Hall Master Torvald in Frosthaven.',
    'The Order is at the Glacier Beacon, north of Frosthaven. Stop them before they take its Core!',
    'The sun has gone dark, and the Drowned Spire is rising out of the Sound.',
  ],
  reward: 'Vital Draught x5, Starseed Honey x3',
};

/* ---------- Region ---------- */
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'frosthaven'), 0, { id: 'frostspine', name: 'Frostspine Pass', x: 62, y: 46, desc: 'A high, icy pass between Skyreach and Frosthaven. The ice fields are a slippery puzzle.' });
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'frosthaven') + 1, 0, { id: 'glacier', name: 'Glacier Beacon', x: 90, y: 14, desc: 'An old Beacon built into the glacier above Frosthaven.' });
Object.assign(DATA.region.find((r) => r.id === 'frosthaven') || {}, { desc: 'A snowbound harbour town of red-roofed houses, home of the Frost Hall.' });
DATA.regionRoutes = DATA.regionRoutes.filter(([a, b]) => !(a === 'skyreach' && b === 'frosthaven')).concat([['skyreach', 'frostspine'], ['frostspine', 'frosthaven'], ['frosthaven', 'glacier']]);
