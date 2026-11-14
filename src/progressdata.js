'use strict';
/* =====================================================================
   PROGRESSION DATA — progression: Lumen, Attunement, Growth Paths,
   evolution items, Move Scrolls, Training Ground, Mastery Traits
   ===================================================================== */

/* Attunement: cost to reach rank n (index n-1) */
DATA.attune = {
  essence: [3, 5, 8, 12, 16, 20, 25, 30, 40, 50],
  lumen: [100, 200, 400, 600, 900, 1200, 1600, 2000, 3000, 4000],
  capBySigils: [2, 3, 4, 5, 5, 6, 7, 7, 8], // index = Hall Badges earned; Champion raises the cap to 10
};
DATA.refine = { essence: 30, max: 3 };
DATA.training = { perStat: 30, total: 60, perDrill: 4, drillCost: 150, resetCost: 300, reminderCost: 200 };

/* ---------- Mastery Traits (Mastery rank 5) ---------- */
Object.assign(DATA.traits, {
  old_growth: { name: 'Old Growth', desc: 'Mastery Trait. Restores 1/16 of its HP at the end of every turn.' },
  kindling: { name: 'Kindling', desc: 'Mastery Trait. The first Fire move it uses in each battle has 30% more power.' },
  riptide: { name: 'Riptide', desc: 'Mastery Trait. Each foe it knocks out raises its Attack.' },
});
DATA.masteryTraits = {
  mossling: 'old_growth', firecub: 'kindling', puddlepup: 'riptide', burrowbit: 'grit', twigwing: 'glare', grubble: 'radiance',
  zappik: 'grit', pebblin: 'thick_fur', murkle: 'sturdy', wispet: 'night_eyes', fawnlight: 'kindling_heart', shellsnip: 'grit',
  molekin: 'thick_fur', shadepaw: 'riptide', flopfin: 'grit', lumifin: 'sturdy', kindlit: 'sunsoak',
};

/* ---------- Branching species ---------- */
Object.assign(DATA.species, {
  moonhop: { n: 41, name: 'Moonhop', types: ['normal', 'psychic'], base: [64, 44, 54, 86, 70, 82], growth: 'medium', catch: 120, exp: 145, rarity: 'uncommon', line: 'burrowbit',
    evo: [], moves: [[1, 'confusion'], [1, 'quick_attack'], [18, 'dazzle'], [22, 'psybeam'], [28, 'focus_mind'], [34, 'mend']], traits: ['run_away', 'keen_eye'],
    habitat: 'Evolves from Burrowbit that favour special moves', desc: 'A rabbit that hops between moonbeams. It stares at the night sky for hours, ears twitching at sounds nobody else can hear.' },
  duskmoth: { n: 42, name: 'Duskmoth', types: ['dark', 'air'], base: [62, 70, 52, 75, 66, 70], growth: 'fast', catch: 45, exp: 178, rarity: 'uncommon', line: 'grubble',
    evo: [], moves: [[1, 'gust'], [1, 'bite'], [10, 'confuse_ray'], [14, 'shadow_swipe'], [20, 'wing_attack'], [26, 'crunch'], [32, 'air_slash']], traits: ['night_eyes', 'shed_skin'],
    habitat: 'Evolves from Silkcase at night', desc: 'A moth that only flies after dark. Its wing-spots look like watching eyes, which keeps hungry birds well away.' },
  voltpaw: { n: 43, name: 'Voltpaw', types: ['electric', 'fighting'], base: [70, 105, 70, 55, 60, 90], growth: 'medium', catch: 75, exp: 170, rarity: 'rare', line: 'zappik',
    evo: [], moves: [[1, 'spark'], [1, 'low_kick'], [22, 'rock_smash'], [26, 'bulk_up'], [32, 'focus_strike'], [38, 'thunderbolt']], traits: ['static', 'grit'],
    habitat: 'Evolves from Zappik that favour physical moves, from Lv 22', desc: 'A fox that walks on its hind legs and boxes with crackling paws. It picks fights with thunderclouds.' },
});
DATA.species.burrowbit.evo = [{ to: 'warrenbuck', lv: 18, path: 'phys' }, { to: 'moonhop', lv: 18, path: 'spec' }];
DATA.species.silkcase.evo = [{ to: 'lumoth', lv: 10, time: 'day' }, { to: 'duskmoth', lv: 10, time: 'night' }];
DATA.species.zappik.evo = [{ to: 'joltfox', item: 'thunder_shard' }, { to: 'voltpaw', lv: 22, path: 'phys', strict: true }];
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
DATA.pathNames = { phys: 'Physical', spec: 'Spirit', support: 'Support' };

/* ---------- Items ---------- */
DATA.pockets = [
  { id: 'items', name: 'Items' }, { id: 'lanterns', name: 'Lanterns' }, { id: 'shards', name: 'Shards' },
  { id: 'scrolls', name: 'Scrolls' }, { id: 'key', name: 'Key Items' }, { id: 'collect', name: 'Collectibles' },
];
Object.assign(DATA.items, {
  thunder_shard: { name: 'Thunder Shard', pocket: 'shards', evo: true, price: 2100, sell: 1050, desc: 'A crystal humming with static. Makes certain Wildmon evolve.' },
  sun_shard: { name: 'Sun Shard', pocket: 'shards', evo: true, price: 2100, sell: 1050, desc: 'A crystal warm as noon. Makes certain Wildmon evolve.' },
  dusk_shard: { name: 'Dusk Shard', pocket: 'shards', evo: true, price: 2100, sell: 1050, desc: 'A crystal the colour of twilight. Makes certain Wildmon evolve.' },
  spark_prism: { name: 'Spark Prism', pocket: 'items', sell: 1500, desc: 'A rare prism. Used with 30 Essence to raise one stat\'s Potential by 1 (up to 3 times per Wildmon).' },
});
DATA.scrolls = {
  scroll_guard: 'guard', scroll_mend: 'mend', scroll_headbutt: 'headbutt', scroll_swift: 'swift_step', scroll_rain: 'rain_dance',
  scroll_sun: 'sunny_day', scroll_sand: 'sandstorm', scroll_hail: 'hailstorm', scroll_bubble: 'bubble_beam', scroll_flame: 'flame_burst', scroll_drain: 'mega_drain', scroll_rocktomb: 'rock_tomb',
};
const SCROLL_PRICE = { scroll_guard: 1500, scroll_headbutt: 1200, scroll_swift: 2500, scroll_rain: 2000, scroll_sun: 2000, scroll_sand: 2000, scroll_hail: 2000, scroll_bubble: 1800, scroll_flame: 1800, scroll_drain: 1800, scroll_rocktomb: 1800 };
for (const [id, mv] of Object.entries(DATA.scrolls)) {
  DATA.items[id] = { name: `Scroll: ${DATA.moves[mv].name}`, pocket: 'scrolls', scroll: mv, price: SCROLL_PRICE[id], sell: SCROLL_PRICE[id] ? Math.floor(SCROLL_PRICE[id] / 2) : 500,
    desc: `Teaches ${DATA.moves[mv].name} (${DATA.moves[mv].type}). Can be used again and again. ${DATA.moves[mv].desc}` };
}
DATA.shops.fernwick = DATA.shops.fernwick.concat(['thunder_shard', 'sun_shard', 'dusk_shard']);
DATA.shops.fernwick_scrolls = ['scroll_guard', 'scroll_headbutt', 'scroll_swift', 'scroll_bubble', 'scroll_flame', 'scroll_drain', 'scroll_rocktomb', 'scroll_rain', 'scroll_sun', 'scroll_sand', 'scroll_hail'];
DATA.milestones.find((m) => m.id === 'c10').items.push(['spark_prism', 1]);
DATA.milestones.find((m) => m.id === 'c10').rewardText = '3 Strong Tonics, Spark Prism';

/* ---------- Quests ---------- */
DATA.quests.training = {
  name: 'Drill Sergeant', kind: 'side', giver: 'Coach Rena',
  stages: ['Complete three training drills at the Fernwick Training Ground. ({drills}/3)'],
  reward: 'Spark Prism, Scroll: Mend',
};
DATA.achievements.attuned = { name: 'In Tune', desc: 'Attune a Wildmon with Essence.' };
DATA.achievements.pathfinder = { name: 'Pathfinder', desc: 'Choose a Growth Path when a Wildmon evolves.' };
DATA.achievements.scholar = { name: 'Scholar', desc: 'Teach a move with a Move Scroll.' };
DATA.achievements.drilled = { name: 'Drilled', desc: 'Complete a training drill.' };

/* ---------- Training Ground (Fernwick) ---------- */
DATA.maps.fernwick.buildings.push({ kind: 'dojo', x: 19, y: 16, w: 5, h: 4, door: 2, to: { map: 'fern_dojo', x: 5, y: 6, dir: 'up' } });
DATA.maps.fernwick.props.push({ type: 'sign', x: 24, y: 19, text: 'FERNWICK TRAINING GROUND\nDrills · Move Reminder' });
DATA.maps.fern_dojo = {
  name: 'Training Ground', region: 'fernwick', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWWW',
    'WkWWQQWWBBW',
    'FFFFFFFFFFF',
    'FRRRRRRRRRF',
    'FRRRRRRRRRF',
    'FRRRRRRRRRF',
    'FFFFFFFFFFF',
    'pFFFFmmFFFp',
  ],
  warps: [
    { x: 5, y: 7, to: { map: 'fernwick', x: 21, y: 20, dir: 'down' } },
    { x: 6, y: 7, to: { map: 'fernwick', x: 21, y: 20, dir: 'down' } },
  ],
  tileText: {
    '1,1': ['The board reads: TODAY\'S DRILLS.', 'Attack: break the boulder. Defence: stand the charge. Speed: beat the bell. Drill bonuses are capped: 30 per stat, 60 in total.'],
    '8,1': 'Training logs, stacked to the ceiling.', '9,1': 'A shelf of trophies from old Hall challenges.',
  },
  npcs: [
    { id: 'rena', x: 5, y: 2, dir: 'down', look: 'ranger', script: 'coach' },
    { id: 'pupil', x: 8, y: 5, dir: 'left', look: 'student2', move: 'wander', name: 'Trainee',
      talk: ['Levels make a Wildmon stronger all round, but drills sharpen one stat at a time.', 'I gave my Twigwing nothing but Speed drills. Now it always moves first!'] },
  ],
};
DATA.maps.fern_mart.npcs.push({ id: 'scrolls', x: 8, y: 2, dir: 'down', look: 'teacher', script: 'scrollSeller' });
