'use strict';
/* =====================================================================
   MONTERA: THE LANTERNS OF ALDERMERE — DATA
   Pure data: tiles, items, quests, achievements, music, maps, scripts.
   Add content here; the engine reads it.
   ===================================================================== */
const DATA = { version: 12, build: '1.0' };

/* ---------- Tiles: map character -> properties ---------- */
DATA.tiles = {
  '.': { t: 'grass' },
  ',': { t: 'tall', tall: true },
  '_': { t: 'path' },
  's': { t: 'sand' },
  'f': { t: 'flowers' },
  '~': { t: 'water', solid: true, water: true },
  'T': { t: 'tree', solid: true },
  '#': { t: 'fence', solid: true },
  'r': { t: 'rock', solid: true },
  'b': { t: 'bush', solid: true, text: 'A thorny bush blocks the way. A Brush Hook could cut straight through it.' },
  'v': { t: 'ledge', ledge: 'down' },
  'w': { t: 'dock' },
  // interiors
  'W': { t: 'wall', solid: true },
  'F': { t: 'wood' },
  'K': { t: 'tilefloor' },
  'R': { t: 'rug' },
  'm': { t: 'mat' },
  'B': { t: 'shelf', solid: true, text: 'Shelves crammed with well-thumbed books about Wildmon.' },
  'Q': { t: 'window', solid: true, text: 'The window looks out over the village.' },
  'P': { t: 'pc', solid: true, text: 'A computer terminal hums quietly.' },
  'V': { t: 'tv', solid: true, text: 'A programme about a trainer sailing between the islands of the Sound.' },
  'L': { t: 'table', solid: true, text: 'A sturdy wooden table.' },
  'D': { t: 'bedtop', solid: true, text: 'A comfy bed. No time for a nap!' },
  'd': { t: 'bedbot', solid: true, text: 'A comfy bed. No time for a nap!' },
  'p': { t: 'plant', solid: true, text: 'A potted plant. Someone waters it every day.' },
  'C': { t: 'counter', solid: true, counter: true },
  'M': { t: 'machine', solid: true, text: 'A bank of research equipment, blinking away.' },
  'H': { t: 'healer', solid: true, text: 'The healing machine. Six Lantern cradles glow softly.' },
  'k': { t: 'board', solid: true, text: 'A blackboard.' },
  'h': { t: 'martshelf', solid: true, text: 'The shelves are almost empty.' },
  'A': { t: 'lanterns', solid: true, text: 'Three Lanterns glow on the table.' },
  'n': { t: 'kitchen', solid: true, text: 'Something smells delicious.' },
};

/* ---------- Items ---------- */
DATA.pockets = [
  { id: 'items', name: 'Items' },
  { id: 'lanterns', name: 'Lanterns' },
  { id: 'key', name: 'Key Items' },
  { id: 'collect', name: 'Collectibles' },
];
DATA.items = {
  parcel: { name: 'Kindled Lanterns', pocket: 'key', desc: 'Three new Lanterns, still warm from the Fernwick shrine flame. Something stirs inside each one.' },
  town_map: { name: 'Aldermere Map', pocket: 'key', use: 'map', desc: 'A folding map of Aldermere. Places you have visited are marked on it.' },
  running_shoes: { name: 'Trail Boots', pocket: 'key', use: 'autorun', desc: 'Hold B (or Shift) to run. Use them to switch Always Run on or off.' },
  sea_glass: { name: 'Sea Glass', pocket: 'collect', desc: 'Frosted glass rolled smooth by the tide. Old Fenn on the Emberlow pier collects it.' },
  old_coin: { name: 'Old Coin', pocket: 'collect', desc: 'A worn coin stamped with a lighthouse. Collectors might pay well for it one day.' },
  shiny_pebble: { name: 'Shiny Pebble', pocket: 'collect', desc: 'A pebble that glitters with tiny flecks of light.' },
  fenn_shell: { name: "Fenn's Shell", pocket: 'collect', desc: 'A spiral shell from Old Fenn. Hold it to your ear and you can hear the Sound.' },
  lantern: { name: 'Lantern', pocket: 'lanterns', battle: 'catch', ball: 1, price: 200, sell: 100, desc: 'A glass Lantern for catching Wildmon. Weaken a Wildmon first to improve your chances.' },
  potion: { name: 'Tonic', pocket: 'items', battle: 'heal', field: true, heal: 20, price: 300, sell: 150, desc: 'A herbal spray that restores 20 HP to one Wildmon.' },
  super_potion: { name: 'Strong Tonic', pocket: 'items', battle: 'heal', field: true, heal: 50, price: 700, sell: 350, desc: 'A stronger spray that restores 50 HP to one Wildmon.' },
  antidote: { name: 'Antivenom', pocket: 'items', battle: 'cure', field: true, cure: 'psn', cureText: 'no longer poisoned', price: 100, sell: 50, desc: 'Cures a poisoned Wildmon.' },
  unknot: { name: 'Unknot Salve', pocket: 'items', battle: 'cure', field: true, cure: 'par', cureText: 'no longer paralysed', price: 200, sell: 100, desc: 'Loosens stiff muscles. Cures paralysis.' },
  burn_salve: { name: 'Burn Salve', pocket: 'items', battle: 'cure', field: true, cure: 'brn', cureText: 'no longer burned', price: 250, sell: 125, desc: 'A cooling balm that heals a burn.' },
  wake_bell: { name: 'Wake Bell', pocket: 'items', battle: 'cure', field: true, cure: 'slp', cureText: 'wide awake', price: 250, sell: 125, desc: 'A tiny bell whose chime wakes a sleeping Wildmon.' },
  thaw_tea: { name: 'Thaw Tea', pocket: 'items', battle: 'cure', field: true, cure: 'frz', cureText: 'thawed out', price: 250, sell: 125, desc: 'Piping-hot tea that thaws a frozen Wildmon.' },
  old_rod: { name: 'Driftwood Rod', pocket: 'key', use: 'fish', desc: "Old Fenn's first fishing rod. Face water and press A to fish." },
  lustre_lens: { name: 'Lustre Lens', pocket: 'key', desc: 'A lens that catches strange colours. Lustre Wildmon appear twice as often.' },
  prof_medal: { name: "Professor's Medal", pocket: 'collect', desc: 'Awarded by Professor Thorne for catching 40 different species.' },
};
DATA.shops = { fernwick: ['lantern', 'potion', 'antidote', 'unknot', 'burn_salve', 'wake_bell', 'thaw_tea'] };

/* ---------- Quests ---------- */
DATA.quests = {
  parcel: {
    name: 'The Shrine Lanterns', kind: 'main', giver: 'Professor Thorne',
    stages: [
      'Collect the kindled Lanterns from Keeper Edda at the shrine in Fernwick, north along Route 1.',
      "Bring the Lanterns back to Professor Thorne's lab in Emberlow.",
    ],
    reward: 'Trail Boots, 500 Cr',
  },
  seaglass: {
    name: 'Sea Glass for Old Fenn', kind: 'side', giver: 'Old Fenn',
    stages: [
      'Find 3 pieces of Sea Glass around Emberlow and Route 1. ({sea_glass}/3)',
      'Give the Sea Glass to Old Fenn on the Emberlow pier.',
    ],
    reward: '300 Cr and a keepsake',
  },
  trainer: {
    name: "A Trainer's First Steps", kind: 'main', giver: 'Professor Thorne',
    stages: [
      "Catch a Wildmon in Route 1's tall grass. Weaken it, then throw a Lantern from your Bag.",
      'Show Professor Thorne your Wildbook in Emberlow.',
    ],
    reward: '5 Tonics and 5 Lanterns',
  },
  exam: {
    name: 'The Practice Exam', kind: 'side', giver: 'Ms Hollis',
    stages: ["Beat Ms Hollis's practice exam at the Fernwick Trainer School."],
    reward: '2 Strong Tonics, 600 Cr',
  },
};
DATA.milestones = [
  { id: 's10', seen: 10, text: 'See 10 species', rewardText: '5 Tonics', items: [['potion', 5]] },
  { id: 'c5', need: 5, text: 'Catch 5 species', rewardText: '5 Lanterns', items: [['lantern', 5]] },
  { id: 'c10', need: 10, text: 'Catch 10 species', rewardText: '3 Strong Tonics', items: [['super_potion', 3]] },
  { id: 'c20', need: 20, text: 'Catch 20 species', rewardText: '10 Lanterns, 1000 Cr', items: [['lantern', 10]], money: 1000 },
  { id: 'c30', need: 30, text: 'Catch 30 species', rewardText: 'Lustre Lens', items: [['lustre_lens', 1]] },
  { id: 'c40', need: 40, text: 'Catch 40 species', rewardText: "Professor's Medal", items: [['prof_medal', 1]], rep: 50 },
];

/* ---------- Achievements ---------- */
DATA.achievements = {
  first_steps: { name: 'First Steps', desc: 'Leave Emberlow Village.' },
  errand: { name: 'Errand Runner', desc: 'Bring the shrine Lanterns back to Professor Thorne.' },
  cartographer: { name: 'Cartographer', desc: 'Obtain the Aldermere Map.' },
  treasure: { name: 'Treasure Hunter', desc: 'Find a hidden item.' },
  beachcomber: { name: 'Beachcomber', desc: 'Help Old Fenn with his Sea Glass.' },
  explorer: { name: 'Explorer', desc: 'Visit Emberlow, Route 1 and Fernwick.' },
  chatterbox: { name: 'Chatterbox', desc: 'Talk to 12 different people.' },
  partner: { name: 'Partners', desc: 'Choose your first Wildmon.' },
  first_catch: { name: 'Lantern Lit', desc: 'Catch a Wildmon.' },
  first_win: { name: 'First Victory', desc: 'Win a battle against a trainer.' },
  collector: { name: 'Collector', desc: 'Catch 10 different species.' },
  evolution: { name: 'Metamorphosis', desc: 'Evolve a Wildmon.' },
  lustre: { name: 'Strange Colours', desc: 'Catch a Lustre Wildmon.' },
  marked: { name: 'One of a Kind', desc: 'Catch a Wildmon with unusual markings.' },
  angler: { name: 'Angler', desc: 'Catch a Wildmon by fishing.' },
  top_marks: { name: 'Top Marks', desc: "Pass Ms Hollis's practice exam." },
};

DATA.reputation = [
  [0, 'Newcomer'], [20, 'Helping Hand'], [50, 'Known Face'], [100, 'Local Hero'], [200, 'Regional Name'],
];

/* ---------- Region map (Aldermere Map) ---------- */
DATA.region = [
  { id: 'emberlow', name: 'Emberlow Village', x: 190, y: 150, desc: 'A quiet fishing village on the south-east coast, home of Professor Thorne and the Emberlow Light.' },
  { id: 'route1', name: 'Route 1', x: 190, y: 129, desc: 'A gentle route of meadows and ledges linking Emberlow and Fernwick.' },
  { id: 'fernwick', name: 'Fernwick', x: 188, y: 108, desc: 'A small town at the edge of Bramblewood, with a Trainer School.' },
  { id: 'bramblewood', name: 'Bramblewood', x: 198, y: 88 },
  { id: 'mossgate', name: 'Mossgate', x: 208, y: 68 },
  { id: 'port_calder', name: 'Port Calder', x: 152, y: 156 },
  { id: 'voltara', name: 'Voltara', x: 120, y: 136 },
  { id: 'glasswater', name: 'Glasswater City', x: 150, y: 104 },
  { id: 'cinderhollow', name: 'Cinderhollow', x: 100, y: 166 },
  { id: 'saltmere', name: 'Saltmere', x: 66, y: 132 },
  { id: 'ashgrave', name: 'Ashgrave', x: 44, y: 106 },
  { id: 'skyreach', name: 'Skyreach', x: 36, y: 68 },
  { id: 'frosthaven', name: 'Frosthaven', x: 86, y: 28 },
  { id: 'ironmouth', name: 'Ironmouth', x: 176, y: 38 },
  { id: 'lantern_isle', name: 'Lantern Isle', x: 118, y: 74 },
];
DATA.regionRoutes = [
  ['emberlow', 'route1'], ['route1', 'fernwick'], ['fernwick', 'bramblewood'], ['bramblewood', 'mossgate'],
  ['emberlow', 'port_calder'], ['port_calder', 'voltara'], ['voltara', 'glasswater'], ['voltara', 'cinderhollow'],
  ['cinderhollow', 'saltmere'], ['saltmere', 'ashgrave'], ['ashgrave', 'skyreach'], ['skyreach', 'frosthaven'],
  ['frosthaven', 'ironmouth'], ['ironmouth', 'mossgate'], ['glasswater', 'lantern_isle'],
];

/* ---------- Music (8th-note sequencer; chords drive the bass) ---------- */
DATA.music = {
  title: { bpm: 84, lead: 'square', chords: ['D', 'Em', 'G', 'A', 'D', 'D', 'A', 'D'],
    melody: 'D5:4 A5:4 G5:2 F#5:2 E5:4 F#5:2 G5:2 A5:2 B5:2 A5:8 D6:4 C#6:2 B5:2 A5:4 G5:2 F#5:2 G5:2 E5:2 C#5:2 E5:2 D5:8' },
  town: { bpm: 104, lead: 'square', chords: ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'C'],
    melody: 'E5:2 G5:2 C6:3 B5:1 A5:2 G5:2 E5:4 F5:2 A5:2 G5:2 F5:2 E5:6 -:2 E5:2 G5:2 C6:3 D6:1 E6:2 D6:2 C6:4 A5:2 B5:2 C6:2 D6:2 C6:6 -:2' },
  fernwick: { bpm: 94, lead: 'triangle', tr: -7, chords: ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'C'],
    melody: 'E5:2 G5:2 C6:3 B5:1 A5:2 G5:2 E5:4 F5:2 A5:2 G5:2 F5:2 E5:6 -:2 E5:2 G5:2 C6:3 D6:1 E6:2 D6:2 C6:4 A5:2 B5:2 C6:2 D6:2 C6:6 -:2' },
  route: { bpm: 132, lead: 'square', chords: ['G', 'Em', 'C', 'D', 'G', 'C', 'D', 'G'],
    melody: 'D5:1 G5:1 B5:1 D6:1 B5:2 G5:2 A5:2 B5:1 A5:1 G5:2 E5:2 D5:2 E5:1 G5:1 A5:2 B5:2 A5:6 -:2 D5:1 G5:1 B5:1 D6:1 E6:2 D6:2 C6:2 B5:1 C6:1 D6:2 B5:2 A5:2 G5:1 A5:1 B5:2 A5:2 G5:6 -:2' },
  indoor: { bpm: 92, lead: 'triangle', chords: ['F', 'C', 'Dm', 'F', 'F', 'Bb', 'C', 'F'],
    melody: 'A4:2 C5:2 F5:4 E5:2 D5:2 C5:4 D5:2 F5:2 A5:3 G5:1 F5:8 A4:2 C5:2 F5:4 G5:2 A5:2 Bb5:4 A5:2 G5:2 E5:2 C5:2 F5:8' },
  battle: { bpm: 150, lead: 'square', chords: ['Am', 'F', 'Am', 'E', 'C', 'Dm', 'G', 'Am'],
    melody: 'A4:1 C5:1 E5:1 A5:1 G5:2 E5:2 F5:1 E5:1 D5:1 C5:1 D5:2 E5:2 A4:1 C5:1 E5:1 A5:1 B5:2 C6:2 B5:1 A5:1 G#5:1 B5:1 A5:4 E5:1 E5:1 F5:1 G5:1 A5:2 G5:2 F5:1 F5:1 E5:1 D5:1 E5:4 C5:1 D5:1 E5:1 F5:1 G5:2 F5:1 E5:1 D5:2 E5:2 A4:4' },
  battle_trainer: { bpm: 162, lead: 'square', tr: 2, chords: ['Am', 'F', 'Am', 'E', 'C', 'Dm', 'G', 'Am'],
    melody: 'A4:1 C5:1 E5:1 A5:1 G5:2 E5:2 F5:1 E5:1 D5:1 C5:1 D5:2 E5:2 A4:1 C5:1 E5:1 A5:1 B5:2 C6:2 B5:1 A5:1 G#5:1 B5:1 A5:4 E5:1 E5:1 F5:1 G5:1 A5:2 G5:2 F5:1 F5:1 E5:1 D5:1 E5:4 C5:1 D5:1 E5:1 F5:1 G5:2 F5:1 E5:1 D5:2 E5:2 A4:4' },
  victory: { bpm: 120, lead: 'square', chords: ['C', 'G', 'C', 'C'], melody: 'C5:1 E5:1 G5:1 C6:5 A5:1 B5:1 C6:1 D6:5 E6:2 D6:2 C6:2 B5:2 C6:8' },
  evolve: { bpm: 140, lead: 'triangle', chords: ['C', 'D', 'E', 'E'], melody: 'C5:1 E5:1 G5:1 E5:1 C5:1 E5:1 G5:1 E5:1 D5:1 F#5:1 A5:1 F#5:1 D5:1 F#5:1 A5:1 F#5:1 E5:1 G#5:1 B5:1 G#5:1 E5:1 G#5:1 B5:1 G#5:1 E6:8' },
  lab: { bpm: 100, lead: 'square', tr: 2, chords: ['F', 'C', 'Dm', 'F', 'F', 'Bb', 'C', 'F'],
    melody: 'A4:2 C5:2 F5:4 E5:2 D5:2 C5:4 D5:2 F5:2 A5:3 G5:1 F5:8 A4:2 C5:2 F5:4 G5:2 A5:2 Bb5:4 A5:2 G5:2 E5:2 C5:2 F5:8' },
};

/* ---------- Character looks ---------- */
DATA.looks = {
  mum: { hair: '#8a4b2a', skin: '#f2c8a0', shirt: '#d06a8a', pants: '#5a4a7a', shoes: '#3a2a2a' },
  prof: { hair: '#c9c9c9', skin: '#f0c49a', shirt: '#f4f4f0', pants: '#4a5a7a', shoes: '#2a2a3a' },
  kit: { hair: '#d8a030', skin: '#f2c8a0', shirt: '#3a6fc8', pants: '#2c3044', shoes: '#c83a3a' },
  clover: { hair: '#d8a030', skin: '#f2c8a0', shirt: '#7ab85a', pants: '#e8d0a0', shoes: '#6a4a2a' },
  aide: { hair: '#3a3a4a', skin: '#e0b088', shirt: '#f4f4f0', pants: '#3a4a3a', shoes: '#2a2a2a' },
  aide2: { hair: '#a8442a', skin: '#f2c8a0', shirt: '#f4f4f0', pants: '#5a3a3a', shoes: '#2a2a2a' },
  villager: { hair: '#5a3a2a', skin: '#e8b890', shirt: '#e0a040', pants: '#4a6a8a', shoes: '#3a2a2a' },
  villager2: { hair: '#2a2a2a', skin: '#c08a60', shirt: '#4ab0a0', pants: '#3a3a4a', shoes: '#2a2a2a' },
  boy: { hair: '#3a2a1a', skin: '#f2c8a0', shirt: '#e85a4a', pants: '#3a5a9a', shoes: '#ffffff', hat: '#e85a4a' },
  girl: { hair: '#e8b830', skin: '#f2c8a0', shirt: '#f0a0c0', pants: '#6a5aa0', shoes: '#ffffff' },
  old: { hair: '#e8e8e8', skin: '#e0b088', shirt: '#4a6a8a', pants: '#5a4a3a', shoes: '#2a2a2a', hat: '#2a3a5a' },
  hiker: { hair: '#5a3a1a', skin: '#d8a070', shirt: '#a06a3a', pants: '#5a5a3a', shoes: '#3a2a1a', hat: '#6a8a3a' },
  nurse: { hair: '#e87090', skin: '#f2c8a0', shirt: '#ffffff', pants: '#ffffff', shoes: '#e87090', hat: '#ffffff' },
  clerk: { hair: '#2a2a3a', skin: '#e8b890', shirt: '#3b8fd0', pants: '#2a3a5a', shoes: '#2a2a2a' },
  ranger: { hair: '#4a3a2a', skin: '#d8a070', shirt: '#4a7a3a', pants: '#3a4a2a', shoes: '#2a2a1a', hat: '#6a5a2a' },
  teacher: { hair: '#6a3a6a', skin: '#f0c49a', shirt: '#8a5ab0', pants: '#3a3a5a', shoes: '#2a2a2a' },
  student: { hair: '#2a1a1a', skin: '#f2c8a0', shirt: '#f0d040', pants: '#3a4a7a', shoes: '#ffffff' },
  student2: { hair: '#c86a2a', skin: '#e8b890', shirt: '#5ab0e0', pants: '#4a3a3a', shoes: '#ffffff' },
};

/* Player appearance options (new game) */
DATA.playerLook = {
  hair: ['#3a2a1a', '#8a4b2a', '#d8a030', '#2a2a3a', '#c84a3a', '#e8e0d0'],
  skin: ['#f6d2b0', '#e8b890', '#c08a60', '#8a5a3a'],
  shirt: ['#c83a3a', '#3a6fc8', '#3aa860', '#e8a030', '#8a4ab0', '#2a3040'],
  hat: [null, '#c83a3a', '#2a3a5a', '#e8e0d0'],
};

/* ---------- Text helpers for scripts ---------- */
const Q = (s, id) => s.quest(id);

/* ---------- Scripts ----------
   Each script is async (s, npc). `s` is the script API (see engine).
   ------------------------------------------------------------------ */
DATA.scripts = {
  async mum(s) {
    const o = { name: 'Mum' };
    if (s.flag('parcel_done')) return s.say(['Trail Boots? Your dad had a pair just like those.', 'Remember, love: you can always come home for a rest.'], o);
    const q = Q(s, 'parcel');
    if (q) return s.say(["Fernwick's straight up Route 1. Stay on the path and you'll be fine."], o);
    if (!s.flag('mum_intro')) {
      s.set('mum_intro');
      return s.say(['Morning, sleepyhead! Professor Thorne knocked earlier. She wants to see you at the lab.', "It's the big building down by the beach. Go on, don't keep her waiting!"], o);
    }
    return s.say(["The lab's just south of here, down by the beach."], o);
  },

  async prof(s) {
    const o = { name: 'Prof. Thorne' };
    const q = Q(s, 'parcel');
    if (s.flag('parcel_done')) {
      return s.say(["The three Wildmon are still resting. Their Lanterns brighten a little every hour.",
        "While you wait, why not explore? Old Fenn on the pier could use a sharp pair of eyes."], o);
    }
    if (q && q.stage === 1 && s.has('parcel')) {
      await s.say(['Is that... it is! My Lanterns, kindled and ready!', 'The shrine flame was grey, you say? And Edda saw a grey Wildmon? ...Hm. That is troubling. I will look into it.'], o);
      s.take('parcel');
      await s.say(['Each of these will carry a Wildmon safely at your side. Some trainers say they can feel their partner\'s light through the glass.',
        "Now, a thank-you. You'll be covering a lot of ground on your journey, so take these."], o);
      await s.give('running_shoes');
      await s.say(['Hold B, or Shift on a keyboard, while you walk to run.', 'And a little something for the road.'], o);
      await s.money(500);
      s.set('parcel_done');
      await s.completeQuest('parcel');
      s.achieve('errand');
      s.rep(10);
      await s.say(['As for your partner... the three Wildmon are resting after their long journey up the coast.',
        "Let them settle in, and come back soon. I promise it'll be worth the wait!"], o);
      return;
    }
    if (q && q.stage === 0) return s.say(['Keeper Edda is at the shrine in Fernwick, north along Route 1. Look for the stone lantern by the flowers.'], o);
    if (q && q.stage === 1) return s.say(["Hmm? You've misplaced the Lanterns? Check your Bag."], o);

    if (!s.flag('prof_intro')) {
      s.set('prof_intro');
      await s.say(['Ah, {player}! Come in, come in. Mind the cables.',
        'As you know, Aldermere is home to all sorts of Wildmon. People and Wildmon have lived side by side here for centuries.',
        "Most trainers start their journey with a partner Wildmon, and this year I have three looking for new friends.",
        "But there's a snag. A new Lantern has to be kindled in the Fernwick shrine flame before a Wildmon can rest inside it.",
        'Keeper Edda has been tending three of mine up there since yesterday. Without a lit Lantern, a Wildmon can\'t travel safely.'], o);
    }
    const yes = await s.ask('Would you collect the Lanterns from the Fernwick shrine for me?', ['Yes', 'No'], o);
    if (yes === 0) {
      await s.say(['Splendid! Fernwick is north of here along Route 1. The shrine is the stone lantern by the flowers, east of the main road.'], o);
      await s.startQuest('parcel');
      s.set('met_prof');
      await s.say(["Kit has already run off ahead. My apprentice never waits for anyone!"], o);
    } else {
      await s.say(["Hmm. Well, I'll be right here when you're ready."], o);
    }
  },

  async kitTown(s, npc) {
    const o = { name: 'Kit' };
    await s.say(['Hey, {player}. The Professor called you to the lab too?',
      "Don't bother hurrying. I'm getting the strongest partner, and then I'm going to be Champion of the Lantern League.",
      'Just watch me.'], o);
  },

  async kitRoute1(s) {
    s.set('kit_route1');
    const p = s.player();
    const sx = p.x, sy = p.y + 4;
    s.music('town');
    s.spawn({ id: 'kit_r1', x: sx, y: sy, dir: 'up', look: 'kit' });
    await s.emote('player', '!');
    await s.walk('kit_r1', 'UUU');
    s.face('player', 'down');
    await s.say(['There you are! The Professor sent me to make sure you hadn\'t fallen in a pond.',
      "Are those the shrine Lanterns? They're glowing! That means we get our partners today!",
      'Last one back to the lab gets the Wildmon nobody wants. See you at the finish line, slowcoach!'], { name: 'Kit' });
    await s.walk('kit_r1', 'DDDDD', 2);
    s.remove('kit_r1');
    s.music();
  },

  async clover(s) {
    const o = { name: 'Clover' };
    if (!s.flag('got_map')) {
      await s.say(['Oh, hi {player}! Kit left in a hurry again.',
        'He never even opened this Aldermere Map. You should have it. Someone ought to use it!'], o);
      s.set('got_map');
      await s.give('town_map');
      s.achieve('cartographer');
      await s.say(['You can open it any time from the menu.'], o);
      return;
    }
    return s.say(['Kit wants to be Champion so badly. I just hope he remembers to be kind to his Wildmon.'], o);
  },

  async fenn(s) {
    const o = { name: 'Old Fenn' };
    const q = Q(s, 'seaglass');
    if (q && q.done) {
      return s.say(['On a still night you can see the Emberlow Light all the way from Fernwick.',
        'Folk say the old Beacons once kept something in the dark. Daft stories, most likely... most likely.'], o);
    }
    if (q && s.count('sea_glass') >= 3) {
      await s.say(['Would you look at that... three pieces, bright as the day they washed up.']);
      s.take('sea_glass', 3);
      await s.say(['Here, for your trouble. And take this shell. It was hers. It ought to see a bit of the world.'], o);
      await s.money(300);
      await s.give('fenn_shell');
      await s.completeQuest('seaglass');
      s.achieve('beachcomber');
      s.rep(10);
      return;
    }
    if (q) {
      return s.say([`Found ${s.count('sea_glass')} so far? Keep your eyes on the sand and the long grass.`], o);
    }
    await s.say(["Ahoy, young'un. Ever seen Sea Glass? Bits of old bottles, rolled smooth by the tide.",
      'My wife used to set it into lantern windows. The light came through like little stars.',
      "I've lost my eye for spotting it these days."], o);
    const yes = await s.ask('Find me three pieces around Emberlow and Route 1?', ['Yes', 'No'], o);
    if (yes === 0) {
      await s.startQuest('seaglass');
      await s.say(['Grand. The beach is a good place to start.'], o);
    } else {
      await s.say(["Aye, well. The sea's patient. So am I."], o);
    }
  },

  async clerk(s) {
    const o = { name: 'Clerk' };
    const q = Q(s, 'parcel');
    if (q) return s.say(["Sorry, the shelves are bare until the next delivery comes up from Port Calder. Do call again!"], o);
    return s.say(["Welcome to Fernwick Mart! I'm afraid the shelves are bare until the next cart comes up from Port Calder."], o);
  },

  async nurse(s) {
    const o = { name: 'Nurse Ama' };
    s.setRestPoint('fernwick');
    await s.say(['Welcome to the Fernwick Hearthhouse! We restore tired Wildmon to full health, free of charge.',
      "You haven't got a partner yet, have you? Come back when you do. We'll take very good care of them."], o);
  },
};

/* ---------- Maps ----------
   rows: tile characters (see DATA.tiles)
   buildings: drawn structures; the door tile warps to `to`
   warps, npcs, props, items, triggers, connections
   ------------------------------------------------------------------ */
DATA.maps = {};

DATA.maps.emberlow = {
  name: 'Emberlow Village', region: 'emberlow', music: 'town', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTT__TTTTTTTTTTTT',
    'TTTTTTTTTTTT__TTTTTTTTTTTT',
    'TT.ff.......__.......ff.TT',
    'TT..........__..........TT',
    'TT..........__..........TT',
    'TT..........__..........TT',
    'TT..........__..........TT',
    'TT..........__..........TT',
    'TT..........__..........TT',
    'TT...________________...TT',
    'TT.ff.......__......ff..TT',
    'TT......................TT',
    'TT......................TT',
    'TT.ff..................fTT',
    'TT......................TT',
    'TT......................TT',
    'TT..........__..........TT',
    'TT.........____.........TT',
    'rrssssssssssssssssssssssrr',
    'rsssssssssssssssssssssssr~',
    '~~~sssswssssssssssssss~~~~',
    '~~~~~~~w~~~~~~~~~~~~~~~~~~',
    '~~~~~~~w~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~',
  ],
  connections: { north: { map: 'route1', dx: -3 } },
  buildings: [
    { kind: 'home', x: 3, y: 5, w: 5, h: 4, door: 2, to: { map: 'emberlow_home', x: 4, y: 6, dir: 'up' } },
    { kind: 'kit', x: 18, y: 5, w: 5, h: 4, door: 2, to: { map: 'kit_home', x: 5, y: 6, dir: 'up' } },
    { kind: 'lab', x: 9, y: 11, w: 7, h: 5, door: 3, to: { map: 'lab', x: 5, y: 8, dir: 'up' } },
    { kind: 'lighthouse', x: 21, y: 15, w: 2, h: 4 },
  ],
  props: [
    { type: 'sign', x: 10, y: 3, text: 'EMBERLOW VILLAGE\nWhere the light first wakes.' },
    { type: 'mailbox', x: 8, y: 8, text: "{player}'s house." },
    { type: 'mailbox', x: 17, y: 8, text: 'The Marlowe household.' },
    { type: 'lamp', x: 4, y: 9 },
    { type: 'lamp', x: 21, y: 9 },
    { type: 'lamp', x: 14, y: 16 },
    { type: 'sign', x: 11, y: 16, text: "PROF. THORNE'S WILDMON LAB" },
    { type: 'sign', x: 20, y: 18, text: 'THE EMBERLOW LIGHT\nLit every night for three hundred years.' },
  ],
  items: [
    { id: 'g1', x: 15, y: 19, item: 'sea_glass' },
    { id: 'g2', x: 3, y: 2, item: 'sea_glass', hidden: true },
  ],
  npcs: [
    { id: 'kit', x: 14, y: 9, dir: 'left', look: 'kit', script: 'kitTown', cond: s => !s.flags.met_prof },
    { id: 'maeve', x: 17, y: 12, dir: 'down', look: 'villager', move: 'wander', name: 'Maeve',
      talk: ["Lovely day for it! The sea's as flat as a millpond.", 'Professor Thorne has been up since dawn. Something exciting is happening at that lab, mark my words.'] },
    { id: 'finn', x: 10, y: 18, dir: 'down', look: 'boy', move: 'turn', name: 'Finn',
      talk: ["See the lighthouse? Grandad says it's been lit every single night for three hundred years.", 'He says if it ever goes dark, the Long Night comes back. Spooky, right?'] },
    { id: 'fenn', x: 7, y: 22, dir: 'up', look: 'old', script: 'fenn' },
  ],
};

DATA.maps.emberlow_home = {
  name: 'Your House', region: 'emberlow', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WBBWQQWPWW',
    'FFFFFFFFDF',
    'FnnFFFFFdF',
    'FFLLFFFFFF',
    'FFLLFFFFFV',
    'pFFFRRFFFp',
    'FFFFmmFFFF',
  ],
  warps: [
    { x: 4, y: 7, to: { map: 'emberlow', x: 5, y: 9, dir: 'down' } },
    { x: 5, y: 7, to: { map: 'emberlow', x: 5, y: 9, dir: 'down' } },
  ],
  tileText: {
    '1,1': 'Your old adventure books. A dog-eared one is called "The Lanterns of Aldermere".',
    '2,1': 'Your old adventure books. A dog-eared one is called "The Lanterns of Aldermere".',
    '7,1': 'Your Lantern Shelf. It glows softly in the corner of the room.',
  },
  npcs: [
    { id: 'mum', x: 1, y: 4, dir: 'right', look: 'mum', script: 'mum' },
  ],
};

DATA.maps.kit_home = {
  name: "Kit's House", region: 'emberlow', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WWQQWBBWVW',
    'FFFFFFFFFF',
    'FFFLLFFFFF',
    'FFFLLFFFFF',
    'FFFFFFFFFF',
    'pFFFRRFFFp',
    'FFFFFmmFFF',
  ],
  warps: [
    { x: 5, y: 7, to: { map: 'emberlow', x: 20, y: 9, dir: 'down' } },
    { x: 6, y: 7, to: { map: 'emberlow', x: 20, y: 9, dir: 'down' } },
  ],
  tileText: {
    '5,1': 'Books about Lantern League champions. Every page has been read to tatters.',
    '6,1': 'Books about Lantern League champions. Every page has been read to tatters.',
    '8,1': 'A battle on TV! A Champion\'s Wildmon lands a huge hit. Kit must watch this a lot.',
  },
  npcs: [
    { id: 'clover', x: 6, y: 3, dir: 'down', look: 'clover', script: 'clover' },
  ],
};

DATA.maps.lab = {
  name: "Prof. Thorne's Lab", region: 'emberlow', music: 'lab', outdoor: false,
  rows: [
    'WWWWWWWWWWWW',
    'WMMWBBBBWQQW',
    'KKKKKKKKKKKK',
    'KKKKKKKKKKKK',
    'KKKAAAKKKKKK',
    'KKKKKKKKKKKK',
    'BBKKKKKKKKBB',
    'KKKKKKKKKKKK',
    'KKKKKKKKKKpK',
    'pKKKKmmKKKKK',
  ],
  warps: [
    { x: 5, y: 9, to: { map: 'emberlow', x: 12, y: 16, dir: 'down' } },
    { x: 6, y: 9, to: { map: 'emberlow', x: 12, y: 16, dir: 'down' } },
  ],
  tileText: {
    '3,4': 'Three Lanterns glow softly on the table. Something stirs inside each one...',
    '4,4': 'Three Lanterns glow softly on the table. Something stirs inside each one...',
    '5,4': 'Three Lanterns glow softly on the table. Something stirs inside each one...',
    '0,6': 'Field notes: "Wildmon caught in the same place often share a temperament."',
    '1,6': 'Field notes: "Wildmon caught in the same place often share a temperament."',
    '10,6': 'A thick binder labelled THE LONG NIGHT: MYTH OR RECORD? It is full of question marks.',
    '11,6': 'A thick binder labelled THE LONG NIGHT: MYTH OR RECORD? It is full of question marks.',
  },
  npcs: [
    { id: 'prof', x: 4, y: 3, dir: 'down', look: 'prof', script: 'prof' },
    { id: 'aide1', x: 1, y: 2, dir: 'up', look: 'aide', name: 'Aide Rhys',
      talk: ["The Professor studies how a Wildmon's light changes as it grows. She calls it Essence.", 'Catch the same kind of Wildmon more than once and you gather more of it. Fascinating stuff!'] },
    { id: 'aide2', x: 9, y: 7, dir: 'down', look: 'aide2', move: 'wander', name: 'Aide Nell',
      talk: ['Wildmon love tall grass, caves and deep water.', 'When you have a partner, the grass is where your adventure really starts.'] },
  ],
};

DATA.maps.route1 = {
  name: 'Route 1', region: 'route1', music: 'route', outdoor: true, border: 'T', weather: ['clear', 'clear', 'rain', 'clear'],
  rows: [
    'TTTTTTTTT__TTTTTTTTT',
    'TTTTTTTTT__TTTTTTTTT',
    'TT.......__......TTT',
    'TT,,,,...__...,,,,TT',
    'TT,,,,...__...,,,,TT',
    'TT.......__.......TT',
    'TTvvvvvvv__vvvvv..TT',
    'TT.......__.......TT',
    'TT..TTT..__..,,,,.TT',
    'TT..TTT..__..,,,,.TT',
    'TT.......__..,,,,.TT',
    'TT...________.....TT',
    'TT..._......~~~..TTT',
    'TT..._.....~~~~~.TTT',
    'TT..._.....~~~~~..TT',
    'TT..._......~~~...TT',
    'TT,,,_,,,.........TT',
    'TT,,,_,,,.........TT',
    'TT..._________....TT',
    'TT.......__...bbbbTT',
    'TT,,,,,..__...b..TTT',
    'TT,,,,,..__...b..TTT',
    'TT,,,,,..__...bbbTTT',
    'TT.......__.......TT',
    'TTvvvvvvv__vvvvvvvTT',
    'TT.......__.......TT',
    'TT..,,,,.__.,,,,..TT',
    'TT..,,,,.__.,,,,..TT',
    'TT..,,,,.__.,,,,..TT',
    'TT.......__..f.f..TT',
    'TT.ff....__.......TT',
    'TT.......__.......TT',
    'TTTTTTTTT__TTTTTTTTT',
    'TTTTTTTTT__TTTTTTTTT',
  ],
  connections: { south: { map: 'emberlow', dx: 3 }, north: { map: 'fernwick', dx: 4 } },
  props: [
    { type: 'sign', x: 8, y: 31, text: 'ROUTE 1\nNorth: Fernwick   South: Emberlow Village' },
    { type: 'sign', x: 11, y: 2, text: 'ROUTE 1\nSouth: Emberlow Village' },
    { type: 'sign', x: 8, y: 23, text: 'TRAINER TIP\nLedges can be jumped down, but never climbed up.' },
  ],
  items: [
    { id: 'g3', x: 17, y: 10, item: 'sea_glass' },
    { id: 'coin', x: 16, y: 14, item: 'old_coin', hidden: true },
    { id: 'pebble', x: 15, y: 21, item: 'shiny_pebble', locked: true },
  ],
  npcs: [
    { id: 'tom', x: 7, y: 7, dir: 'down', look: 'boy', move: 'turn', name: 'Youngster Tom',
      talk: ["I'm getting my first Wildmon next week!", "When I do, you're the first trainer I'm battling. Don't forget!"] },
    { id: 'bram', x: 14, y: 16, dir: 'left', look: 'hiker', move: 'wander', name: 'Hiker Bram',
      talk: ['Spotted the ledges? You can hop down them but never climb back up.', 'Handy shortcut when you are heading south!'] },
    { id: 'ivy', x: 10, y: 13, dir: 'right', look: 'girl', name: 'Ivy',
      talk: ['Shh! Something just splashed in the pond.', "I think it was a Wildmon! I'm going to sit here until it comes back."] },
  ],
  triggers: [
    { x: 2, y: 25, w: 16, h: 1, script: 'kitRoute1', cond: s => s.quests.parcel && s.quests.parcel.stage === 1 && !s.quests.parcel.done && !s.flags.kit_route1 },
  ],
};

DATA.maps.fernwick = {
  name: 'Fernwick', region: 'fernwick', music: 'fernwick', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT....________________....TT',
    'TT.ff........__.......ff..TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TT...._______________.....TT',
    'TT...........__...........TT',
    'TT..~~~......__...........TT',
    'TT.~~~~~.....__......ff...TT',
    'TT..~~~......__...........TT',
    'TT...........__...........TT',
    'TT...........__...........TT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
    'TTTTTTTTTTTTT__TTTTTTTTTTTTT',
  ],
  connections: { south: { map: 'route1', dx: -4 } },
  buildings: [
    { kind: 'hearth', x: 3, y: 4, w: 6, h: 4, door: 3, to: { map: 'fern_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 19, y: 4, w: 5, h: 4, door: 2, to: { map: 'fern_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'school', x: 3, y: 10, w: 7, h: 4, door: 3, to: { map: 'fern_school', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', x: 18, y: 10, w: 5, h: 4, door: 2, to: { map: 'fern_house', x: 4, y: 6, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 11, y: 20, text: 'FERNWICK\nA small town at the edge of Bramblewood.' },
    { type: 'sign', x: 10, y: 13, text: 'FERNWICK TRAINER SCHOOL\nAll new trainers welcome!' },
    { type: 'lamp', x: 12, y: 9 },
    { type: 'lamp', x: 15, y: 15 },
    { type: 'shrine', x: 22, y: 15 },
    { type: 'barrier', x: 14, y: 2, text: 'A wooden barrier. BRAMBLEWOOD: NO ENTRY WITHOUT A PARTNER WILDMON.' },
  ],
  items: [
    { id: 'pouch', x: 2, y: 20, money: 300, hidden: true },
  ],
  tileScripts: { '22,15': 'fernShrine' },
  npcs: [
    { id: 'edda', x: 23, y: 15, dir: 'left', look: 'old', name: 'Keeper Edda', script: 'edda' },
    { id: 'holt', x: 13, y: 2, dir: 'down', look: 'ranger', name: 'Ranger Holt',
      talk: ["Bramblewood's just past here, and it's thick with Wildmon this season.", "I can't let anyone through without a partner Wildmon. Rules are rules!"] },
    { id: 'pip', x: 6, y: 19, dir: 'up', look: 'student', move: 'turn', name: 'Pip',
      talk: ['The pond glitters at night.', 'Grandad says rare Wildmon come up to look at the moon. I stayed up once, but I fell asleep.'] },
    { id: 'rosa', x: 18, y: 17, dir: 'down', look: 'villager2', move: 'wander', name: 'Rosa',
      talk: ['Fernwick sits right at the edge of Bramblewood. We get all sorts of visitors: trainers, researchers...',
        '...and lately some very odd folk in grey coats, poking about with lanterns that give off no light at all.'] },
    { id: 'abel', x: 10, y: 9, dir: 'left', look: 'old', move: 'turn', name: 'Old Abel',
      talk: ['When I was young, every town lit its Beacon on the longest night of the year.', 'Now they are just Halls for trainers. Hmph. Nobody remembers why they were built.'] },
  ],
};

DATA.maps.fern_hearth = {
  name: 'Fernwick Hearthhouse', region: 'fernwick', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWWWW',
    'WQWWWHHWWWQW',
    'KKKKKKKKKWWW',
    'CCCCCCCCCKPK',
    'KKKKKKKKKKKK',
    'KKKKKKKKKKKK',
    'pKKKKKKKKKKp',
    'KKKKKmmKKKKK',
  ],
  warps: [
    { x: 5, y: 7, to: { map: 'fernwick', x: 6, y: 8, dir: 'down' } },
    { x: 6, y: 7, to: { map: 'fernwick', x: 6, y: 8, dir: 'down' } },
  ],
  tileText: { '10,3': 'The storage terminal. Wildmon that do not fit in your party are kept safe here. Your boxes are empty.' },
  npcs: [
    { id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', script: 'nurse' },
    { id: 'traveller', x: 9, y: 5, dir: 'left', look: 'hiker', move: 'wander', name: 'Traveller',
      talk: ["I'm walking all the way to Port Calder.", 'Hearthhouses are the best part of travelling. Free healing, and the sofas are lovely!'] },
  ],
};

DATA.maps.fern_mart = {
  name: 'Fernwick Mart', region: 'fernwick', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WhhWWWWhhW',
    'KKKWKKKKKK',
    'CCCKKKKKKK',
    'KKKKKKKKKK',
    'KKKKhhhhKK',
    'KKKKKKKKKK',
    'KKKKmmKKKK',
  ],
  warps: [
    { x: 4, y: 7, to: { map: 'fernwick', x: 21, y: 8, dir: 'down' } },
    { x: 5, y: 7, to: { map: 'fernwick', x: 21, y: 8, dir: 'down' } },
  ],
  npcs: [
    { id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', script: 'clerk' },
    { id: 'shopper', x: 7, y: 4, dir: 'up', look: 'villager', move: 'wander', name: 'Shopper',
      talk: ['No Lanterns, no Tonics, not even a Berry!', 'I walked all the way from Emberlow for nothing.'] },
  ],
};

DATA.maps.fern_school = {
  name: 'Trainer School', region: 'fernwick', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WkkkWWQQBW',
    'FFFFFFFFFF',
    'FLFLFFFFFF',
    'FFFFFFFFFF',
    'FLFLFFBBFF',
    'FFFFFFFFFF',
    'FFFFmmFFFF',
  ],
  warps: [
    { x: 4, y: 7, to: { map: 'fernwick', x: 6, y: 14, dir: 'down' } },
    { x: 5, y: 7, to: { map: 'fernwick', x: 6, y: 14, dir: 'down' } },
  ],
  tileText: {
    '1,1': ['The blackboard reads: TYPE BASICS.', 'Fire beats Grass, Ice and Steel. Water beats Fire, Earth and Rock. Grass beats Water, Earth and Rock.', 'Electric beats Water and Air, but does nothing at all to Earth!'],
    '2,1': ['The blackboard reads: TYPE BASICS.', 'Fire beats Grass, Ice and Steel. Water beats Fire, Earth and Rock. Grass beats Water, Earth and Rock.', 'Electric beats Water and Air, but does nothing at all to Earth!'],
    '3,1': ['In the corner: "Light beats Dark and Ghost. Ghost cannot touch Normal, and Normal cannot touch Ghost."'],
    '8,1': 'A primer called "Your First Wildmon". Chapter one: be patient, be kind.',
    '6,5': 'A shelf of Wildbook guides, each one older than the last.',
    '7,5': 'A shelf of Wildbook guides, each one older than the last.',
    '1,3': 'Someone has carved "KIT WAS HERE" into the desk.',
    '3,3': 'A desk. There is a doodle of a Wildmon with far too many teeth.',
    '1,5': 'A desk, tidy and polished.', '3,5': 'A desk with a half-finished type quiz on it.',
  },
  npcs: [
    { id: 'teacher', x: 5, y: 2, dir: 'down', look: 'teacher', name: 'Ms Hollis',
      talk: ['Welcome to the Trainer School! Lesson one: every Wildmon has a type, and types matter.',
        'Water puts out Fire. Fire burns Grass. Grass drinks up Water. Learn the chart on the board and you will win battles you have no right to win!'] },
    { id: 'stud1', x: 2, y: 4, dir: 'up', look: 'student', name: 'Student',
      talk: ['There are eight Halls in Aldermere, each one inside an old Beacon tower. Beat a Hall Master and you earn a Badge!'] },
    { id: 'stud2', x: 7, y: 3, dir: 'left', look: 'student2', move: 'turn', name: 'Student',
      talk: ["A Wildmon's power isn't just its level. Two of the same kind can have totally different potential!", 'The Professor in Emberlow can tell just by looking. I wish I could.'] },
  ],
};

DATA.maps.fern_house = {
  name: 'Ashdown House', region: 'fernwick', music: 'indoor', outdoor: false,
  rows: [
    'WWWWWWWWWW',
    'WBWQQWWVWW',
    'FFFFFFFFFF',
    'FnnFFLLFFF',
    'FFFFFLLFFF',
    'FFFFFFFFFF',
    'pFFFRRFFFp',
    'FFFFmmFFFF',
  ],
  warps: [
    { x: 4, y: 7, to: { map: 'fernwick', x: 20, y: 14, dir: 'down' } },
    { x: 5, y: 7, to: { map: 'fernwick', x: 20, y: 14, dir: 'down' } },
  ],
  tileText: { '1,1': 'Research journals, all signed "W. Ashdown" in neat handwriting.' },
  npcs: [
    { id: 'mrsash', x: 7, y: 4, dir: 'left', look: 'mum', name: 'Mrs Ashdown',
      talk: ['Oh! Are you a new trainer? My daughter Wren is about your age.',
        "She's off studying Wildmon in Bramblewood. She says it's perfectly safe. I do worry, though."] },
  ],
};

/* =====================================================================
   STORY — story scripts, trainers, healing, fishing
   ===================================================================== */
const STARTERS = ['mossling', 'firecub', 'puddlepup'];
const STARTER_BLURB = {
  mossling: 'Mossling, the Grass type. Patient and sturdy. It wears foes down and outlasts them.',
  firecub: 'Firecub, the Fire type. Quick and fierce. It strikes first and strikes hard.',
  puddlepup: 'Puddlepup, the Water type. Brave and steady. It grows stronger as a battle goes on.',
};
const RIVAL_PICK = { mossling: 'firecub', firecub: 'puddlepup', puddlepup: 'mossling' };
const evenPot = () => ({ hp: 8, atk: 8, def: 8, spa: 8, spd: 8, spe: 8 });

/* Trainer battle flow, used by line-of-sight and by talking */
async function trainerEncounter(s, npc, spotted) {
  const tid = npc.def.trainer, T = DATA.trainers[tid];
  if (spotted) {
    await s.emote(npc.id, '!');
    const p = s.player();
    const steps = Math.max(0, Math.abs(p.x - npc.x) + Math.abs(p.y - npc.y) - 1);
    const letter = { up: 'U', down: 'D', left: 'L', right: 'R' }[npc.dir];
    if (steps) await s.walk(npc.id, letter.repeat(steps));
    const opp = { up: 'down', down: 'up', left: 'right', right: 'left' }; s.face('player', opp[npc.dir]);
  }
  if (tid === 'hollis' && !spotted && s.quest('exam') && s.quest('exam').done && !s.has('camp_pack')) {
    await s.say(['Ah, my star pupil! I have something for you.', 'A Camp Pack. The whole team learns from every battle, even the ones waiting on the bench.'], { name: 'Ms Hollis' });
    await s.give('camp_pack'); return;
  }
  await s.say(T.intro, { name: `${T.cls} ${T.name}` });
  const team = T.team.map(([sp, lv, item, ex]) => greyMark(Mon.create(sp, lv, { lustre: false, mark: null, pot: evenPot(), item: item || null, ti: 0 }), ex));
  const res = await s.battle({ kind: 'trainer', trainer: T, enemy: team });
  if (res === 'win') {
    s.set('beat_' + tid); s.achieve('first_win');
    if (tid === 'hollis') {
      const q = s.quest('exam');
      if (q && !q.done) {
        await s.say('You passed with flying colours! Here is your prize.', { name: 'Ms Hollis' }); await s.give('super_potion', 2); await s.money(600); await s.completeQuest('exam'); s.achieve('top_marks'); s.rep(10);
        await s.say('And a Camp Pack. The whole team learns from every battle, even the ones waiting on the bench.', { name: 'Ms Hollis' }); await s.give('camp_pack');
      }
    }
  }
}

async function fishing(s) {
  const yes = await s.ask('The water looks inviting. Fish with the Driftwood Rod?', ['Yes', 'No']);
  if (yes !== 0) return;
  if (!G.party.some((m) => m.hp > 0)) return s.say("You'd better heal your Wildmon before fishing.");
  const tab = DATA.encounters[World.id] && DATA.encounters[World.id].fish;
  await s.say(`${G.name} cast the Driftwood Rod...`);
  await s.wait(700 + Math.random() * 1400);
  if (!tab || Math.random() < 0.3) return s.say('Not even a nibble...');
  s.sfx('bite'); await s.emote('player', '!');
  await s.say('Oh! A bite!');
  const enc = World.encounter('fish');
  const before = G.stats.caught || 0;
  await s.battle({ kind: 'wild', enemy: [enc], bg: 'water' });
  if ((G.stats.caught || 0) > before) s.achieve('angler');
}

async function giveStarter(s, sp) {
  const m = Mon.create(sp, 5, { lustre: false, mark: null, bond: 70 });
  const keys = DATA.statKeys.slice().sort(() => Math.random() - 0.5).slice(0, 2); keys.forEach((k) => { m.pot[k] = Math.max(m.pot[k], 10); });
  m.hp = Mon.maxHp(m); m.met = { map: "Prof. Thorne's Lab", lv: 5, at: Date.now() };
  G.party.push(m); s.set('has_starter'); s.set('starter', sp);
  const d = G.dex[sp] || (G.dex[sp] = {}); d.seen = 1; d.caught = 1;
  G.essence[DATA.species[sp].line] = 10; G.mastery[DATA.species[sp].line] = 10;
  await s.say(`${G.name} received ${DATA.species[sp].name}!`, { sfx: 'caught' });
  s.achieve('partner');
  const nick = await s.ask(`Give a nickname to ${DATA.species[sp].name}?`, ['Yes', 'No']);
  if (nick === 0) { const n = await UI.nameEntry({ title: `Nickname for ${DATA.species[sp].name}`, presets: [], allowEmpty: true }); if (n) m.nick = n; }
  return m;
}

async function claimMilestones(s) {
  let any = false;
  const caught = DATA.speciesList.filter((k) => G.dex[k] && G.dex[k].caught).length;
  const seen = DATA.speciesList.filter((k) => G.dex[k] && G.dex[k].seen).length;
  for (const ms of DATA.milestones) {
    if (G.milestones[ms.id]) continue;
    if ((ms.seen ? seen : caught) < (ms.seen || ms.need)) continue;
    if (!any) await s.say(['Let me see your Wildbook...', 'My word, you have been busy!'], { name: 'Prof. Thorne' });
    any = true; G.milestones[ms.id] = Date.now(); Game.dirty = true;
    await s.say(`For reaching "${ms.text}", please take this.`, { name: 'Prof. Thorne' });
    for (const [id, n] of ms.items || []) await s.give(id, n);
    if (ms.money) await s.money(ms.money);
    if (ms.rep) s.rep(ms.rep);
  }
  return any;
}

Object.assign(DATA.scripts, {
  async mum(s) {
    const o = { name: 'Mum' };
    if (G.party.length) {
      await s.say(s.flag('parcel_done') && !s.flag('mum_seen_partner') ? ['Is that your very own Wildmon? Oh, it\'s lovely!', 'You both look worn out. Have a little rest.'] : ['You look tired, love. Have a little rest.'], o);
      s.set('mum_seen_partner');
      await Game.fadeOut(300); await s.healParty(); await s.wait(500); await Game.fadeIn(300);
      await s.say('There! Your Wildmon are full of energy again. Take care out there!', o);
      if (!s.flag('got_ember')) { s.set('got_ember'); await s.say(["Oh, and take this. It's a Hearth Ember from our fireplace.", 'Give it to one of your Wildmon to hold. It keeps them warm and patches them up a little in battle.'], o); await s.give('hearth_ember'); }
      return;
    }
    if (s.flag('parcel_done')) return s.say(['Trail Boots? Your dad had a pair just like those.', 'Remember, love: you can always come home for a rest.'], o);
    const q = Q(s, 'parcel');
    if (q) return s.say(["Fernwick's straight up Route 1. Stay on the path and you'll be fine."], o);
    if (!s.flag('mum_intro')) { s.set('mum_intro'); return s.say(['Morning, sleepyhead! Professor Thorne knocked earlier. She wants to see you at the lab.', "It's the big building down by the beach. Go on, don't keep her waiting!"], o); }
    return s.say(["The lab's just south of here, down by the beach."], o);
  },

  async prof(s) {
    const o = { name: 'Prof. Thorne' };
    if (s.flag('parcel_done') && !s.flag('has_starter')) {
      if (!s.flag('choose_starter')) {
        s.set('choose_starter');
        return s.say(['{player}! Perfect timing. The three Wildmon have woken up!', 'Their Lanterns are on the table in front of me. Have a look at each one and choose the partner that feels right.', "Take your time. This is the start of something special."], o);
      }
      return s.say(['Go on, take a look at the Lanterns on the table and choose your partner.'], o);
    }
    const tq = Q(s, 'trainer');
    if (tq && !tq.done && tq.stage === 1) {
      await s.say(['You caught your first Wildmon in the wild! Let me see the Wildbook...', 'Wonderful. Every Wildmon you catch fills in a little more of Aldermere.',
        'Did you notice the Essence you gained? Each evolution line has its own. Catch the same kind again and you gather more of it.',
        'Use a line often enough and you will gain Mastery with it. Masters notice things others miss, like catches that come a little easier and rare colours.',
        'Here, these will help on the road.'], o);
      await s.give('potion', 5); await s.give('lantern', 5);
      await s.completeQuest('trainer'); s.rep(10);
      await s.say(['Ms Hollis at the Fernwick Trainer School runs practice exams. Pass one and you will be ready for anything!',
        'And whenever your Wildbook reaches a milestone, come and see me. I always have something for diligent researchers.'], o);
      if (!s.quest('exam')) await s.startQuest('exam');
      return;
    }
    if (s.flag('has_starter')) {
      if (await claimMilestones(s)) return;
      if (tq && !tq.done) return s.say(["Route 1's tall grass is full of Wildmon. Weaken one in battle, then throw a Lantern!", 'If your partner gets tired, your mum or a Hearthhouse will patch it up.'], o);
      const c = DATA.speciesList.filter((k) => G.dex[k] && G.dex[k].caught).length;
      return s.say([`${c} species caught so far. Keep going! Rare ones appear at night, and some only in the water.`, 'Bring me your Wildbook whenever you reach a milestone.'], o);
    }
    return DATA.scripts.profEarly(s);
  },

  async pickStarter(s, idx) {
    const sp = STARTERS[idx];
    if (s.flag('has_starter')) {
      if (s.flag('starter') === sp || RIVAL_PICK[s.flag('starter')] === sp) return s.say('An empty Lantern, still faintly warm.');
      return s.say(`The last Lantern. ${DATA.species[sp].name} is asleep inside. The Professor will look after it for now.`);
    }
    if (!s.flag('parcel_done')) return s.say('Three Lanterns glow softly on the table. Something stirs inside each one...');
    if (!s.flag('choose_starter')) return s.say('Three Lanterns glow softly. Better speak to the Professor first.');
    const yes = await UI.previewAsk(sp, `${STARTER_BLURB[sp]} Choose ${DATA.species[sp].name}?`);
    if (yes !== 0) return;
    await giveStarter(s, sp);
    // Kit arrives and picks the counter
    const kitSp = RIVAL_PICK[sp]; s.set('kit_starter', kitSp);
    s.spawn({ id: 'kit_lab', x: 6, y: 8, dir: 'up', look: 'kit' });
    await s.say("Professor! I'm here! Did I miss anything?", { name: 'Kit' });
    await s.walk('kit_lab', 'UUU');
    await s.say([`You picked ${DATA.species[sp].name}? Then I'll take ${DATA.species[kitSp].name}!`, "The Professor says partners get stronger by battling. So let's battle!"], { name: 'Kit' });
    const T = Object.assign({}, DATA.trainers.kit1, { team: [] });
    const res = await s.battle({ kind: 'trainer', trainer: T, enemy: [Mon.create(kitSp, 5, { lustre: false, mark: null, pot: evenPot() })], noWhiteout: true });
    if (res !== 'win') await s.say(DATA.trainers.kit1.win, { name: 'Kit' });
    else s.set('beat_kit1');
    await s.healParty();
    await s.say(["I'm heading north. Bramblewood, then the Halls, then the League. See you around, slowcoach!"], { name: 'Kit' });
    await s.walk('kit_lab', 'DDD');
    s.remove('kit_lab');
    const o = { name: 'Prof. Thorne' };
    await s.say(['That boy... Well! What a first battle.', 'Before you go, take these. This is a Wildbook. It records every Wildmon you see and catch.'], o);
    s.set('has_wildbook');
    await s.say(`${G.name} received the Wildbook!`, { sfx: 'item', note: 'Open it from the menu.' });
    await s.give('lantern', 5);
    await s.say(["Lanterns let you catch Wildmon. Weaken one first, then throw a Lantern from your Bag.", 'Try it in the tall grass on Route 1, then come back and show me!'], o);
    await s.startQuest('trainer');
  },
  async pickStarter0(s) { return DATA.scripts.pickStarter(s, 0); },
  async pickStarter1(s) { return DATA.scripts.pickStarter(s, 1); },
  async pickStarter2(s) { return DATA.scripts.pickStarter(s, 2); },

  async rhys(s) {
    const o = { name: 'Aide Rhys' };
    if (!G.party.length) return s.say(["The Professor studies how a Wildmon's light changes as it grows. She calls it Essence.", 'Once you have a Wildmon, I can appraise its Potential for you.'], o);
    const yes = await s.ask('I can appraise a Wildmon\'s hidden Potential. Shall I take a look?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('Any time!', o);
    const i = await UI.party({ mode: 'pick', title: 'Appraise which Wildmon?', hint: 'Choose a Wildmon to appraise.' });
    if (i < 0) return;
    const m = G.party[i]; m.appraised = true; Game.dirty = true;
    const g = Mon.grade(m); const best = DATA.statKeys.slice().sort((a, b) => m.pot[b] - m.pot[a])[0];
    const words = { S: 'Extraordinary! Truly one in a thousand.', A: 'Excellent. A real prize.', B: 'Very good. Above average all round.', C: 'Solid. A dependable partner.', D: 'A little below average, but that is no barrier to a good trainer.', F: 'Hmm. Modest Potential, but a big heart can go a long way.' };
    await s.say([`${Mon.name(m)}... Overall grade: ${g}. ${words[g]}`, `Its greatest Potential lies in ${DATA.statNames[best]}.`, 'I have marked its Potential on its Summary page.'], o);
  },

  async fenn(s) {
    const o = { name: 'Old Fenn' };
    if (G.party.length && !s.flag('got_rod')) {
      await s.say(["Is that your own Wildmon? Well I never! Then you'll be wanting this.", 'My first fishing rod. Face the water and give it a go. You never know what lives under the waves.'], o);
      s.set('got_rod'); await s.give('old_rod');
      if (!Q(s, 'seaglass')) return;
    }
    return DATA.scripts.fennEarly(s);
  },

  async clerk(s) {
    const o = { name: 'Clerk' };
    const q = Q(s, 'parcel');
    if (s.flag('parcel_done')) return UI.shop(DATA.shops.fernwick, s.flag('shop_greeted') ? 'Welcome back! What can I get you?' : (s.set('shop_greeted'), 'The delivery from Port Calder finally arrived! What can I get you?'));
    if (q) return s.say(["Sorry, the shelves are bare until the next delivery comes up from Port Calder. Do call again!"], o);
    return s.say(["Welcome to Fernwick Mart! I'm afraid the shelves are bare until the next cart comes up from Port Calder."], o);
  },

  async nurse(s) {
    const o = { name: 'Nurse Ama' };
    s.setRestPoint('fernwick');
    if (!G.party.length) {
      return s.say(['Welcome to the Fernwick Hearthhouse! We restore tired Wildmon to full health, free of charge.',
        "You haven't got a partner yet, have you? Come back when you do. We'll take very good care of them."], o);
    }
    const yes = await s.ask('Welcome to the Hearthhouse! Shall I rest your Wildmon by the fire?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('The fire is always lit. Come back any time.', o);
    await s.say('Let them sit by the hearth a while...', o);
    await s.healParty(); await s.wait(900);
    await s.say(['There. Every one of them is glowing bright again.', 'Safe travels, and mind the dark.'], o);
  },

  async storagePc(s) {
    if (!G.party.length && !G.box.length) return s.say('The storage terminal. Wildmon that do not fit in your party are kept safe here. You have no Wildmon yet.');
    await s.say(`${G.name} booted up the storage terminal.`);
    await UI.storage();
  },

  async holt(s) {
    const o = { name: 'Ranger Holt' };
    if (!G.party.length) return s.say(["Bramblewood's just past here, and it's thick with Wildmon this season.", "I can't let anyone through without a partner Wildmon. Rules are rules!"], o);
    return s.say(['A partner Wildmon! Good for you.', "But the forest path flooded in last week's storm. My crew is clearing fallen trees right now.", 'Give us a little while. Train up on Route 1 in the meantime!'], o);
  },
});

/* The original versions are kept for the earlier story beats */
DATA.scripts.profEarly = async function (s) {
  const o = { name: 'Prof. Thorne' };
  const q = Q(s, 'parcel');
  if (s.flag('parcel_done')) return;
  if (q && q.stage === 1 && s.has('parcel')) {
    await s.say(['Is that... it is! My Lanterns, kindled and ready!', 'The shrine flame was grey, you say? And Edda saw a grey Wildmon? ...Hm. That is troubling. I will look into it.'], o);
    s.take('parcel');
    await s.say(["Each of these will carry a Wildmon safely at your side. Some trainers say they can feel their partner's light through the glass.",
      "Now, a thank-you. You'll be covering a lot of ground on your journey, so take these."], o);
    await s.give('running_shoes');
    await s.say(['Hold B, or Shift on a keyboard, while you walk to run.', 'And a little something for the road.'], o);
    await s.money(500);
    s.set('parcel_done');
    await s.completeQuest('parcel');
    s.achieve('errand'); s.rep(10);
    s.set('choose_starter');
    await s.say(['And now... the moment you have been waiting for. The three Wildmon have woken up!',
      'Their Lanterns are on the table in front of me. Have a look at each one and choose your partner.'], o);
    return;
  }
  if (q && q.stage === 0) return s.say(['Keeper Edda is at the shrine in Fernwick, north along Route 1. Look for the stone lantern by the flowers.'], o);
  if (q && q.stage === 1) return s.say(["Hmm? You've misplaced the Lanterns? Check your Bag."], o);
  if (!s.flag('prof_intro')) {
    s.set('prof_intro');
    await s.say(['Ah, {player}! Come in, come in. Mind the cables.',
      'As you know, Aldermere is home to all sorts of Wildmon. People and Wildmon have lived side by side here for centuries.',
      'Most trainers start their journey with a partner Wildmon, and this year I have three looking for new friends.',
      "But there's a snag. A new Lantern has to be kindled in the Fernwick shrine flame before a Wildmon can rest inside it.",
      'Keeper Edda has been tending three of mine up there since yesterday. Without a lit Lantern, a Wildmon can\'t travel safely.'], o);
  }
  const yes = await s.ask('Would you collect the Lanterns from the Fernwick shrine for me?', ['Yes', 'No'], o);
  if (yes === 0) {
    await s.say(['Splendid! Fernwick is north of here along Route 1. The shrine is the stone lantern by the flowers, east of the main road.'], o);
    await s.startQuest('parcel');
    s.set('met_prof');
    await s.say(['Kit has already run off ahead. My apprentice never waits for anyone!'], o);
  } else await s.say(["Hmm. Well, I'll be right here when you're ready."], o);
};
/* ---------- The Fernwick shrine ---------- */
DATA.scripts.edda = async function (s) {
  const o = { name: 'Keeper Edda' };
  const q = Q(s, 'parcel');
  if (q && q.stage === 0 && !q.done) {
    await s.say(['You\'re from Emberlow? Then you\'ve come for Thorne\'s Lanterns. They\'re ready.',
      'But look at the shrine flame. It\'s gone grey. Sixty years I\'ve tended it, and it has never once done that.',
      'A Wildmon wandered out of Bramblewood last night, grey as ash, as if something had drunk the light right out of it.',
      'The Lanterns took the flame before it faltered. Here, carry them carefully.'], o);
    await s.give('parcel');
    await s.setStage('parcel', 1);
    return s.say(['And tell Thorne what you saw. She\'ll want to know.'], o);
  }
  if (s.flag('beat_morrow2')) return s.say(['The flame burns gold again, brighter than I have ever seen it.', 'Whatever was stealing the light, I think you put a stop to it.'], o);
  if (q && q.stage === 1 && !q.done) return s.say(['Off you go. Thorne will be waiting, and those Lanterns are eager to be opened.'], o);
  if (q && q.done) return s.say(['The flame is still grey at the edges.', 'If you find out what is draining the light, come and tell an old keeper, won\'t you?'], o);
  return s.say(['This is the Fernwick shrine. Every new Lantern on the island is kindled in its flame.', 'Lately the flame has been... tired.'], o);
};
DATA.scripts.fernShrine = async function (s) {
  if (s.flag('beat_morrow2')) return s.say('The Fernwick shrine. Its flame burns warm and gold.');
  return s.say('The Fernwick shrine. Its flame flickers a dull, ashen grey.');
};
DATA.scripts.fennEarly = async function (s) {
  const o = { name: 'Old Fenn' };
  const q = Q(s, 'seaglass');
  if (q && q.done) return s.say(['On a still night you can see the Emberlow Light all the way from Fernwick.', 'Folk say the old Beacons once kept something in the dark. Daft stories, most likely... most likely.'], o);
  if (q && s.count('sea_glass') >= 3) {
    await s.say(['Would you look at that... three pieces, bright as the day they washed up.'], o);
    s.take('sea_glass', 3);
    await s.say(['Here, for your trouble. And take this shell. It was hers. It ought to see a bit of the world.'], o);
    await s.money(300); await s.give('fenn_shell'); await s.completeQuest('seaglass'); s.achieve('beachcomber'); s.rep(10);
    return;
  }
  if (q) return s.say([`Found ${s.count('sea_glass')} so far? Keep your eyes on the sand and the long grass.`], o);
  await s.say(["Ahoy, young'un. Ever seen Sea Glass? Bits of old bottles, rolled smooth by the tide.", 'My wife used to set it into lantern windows. The light came through like little stars.', "I've lost my eye for spotting it these days."], o);
  const yes = await s.ask('Find me three pieces around Emberlow and Route 1?', ['Yes', 'No'], o);
  if (yes === 0) { await s.startQuest('seaglass'); await s.say(['Grand. The beach is a good place to start.'], o); }
  else await s.say(["Aye, well. The sea's patient. So am I."], o);
};

/* ---------- Map hooks ---------- */
DATA.maps.lab.tileScripts = { '3,4': 'pickStarter0', '4,4': 'pickStarter1', '5,4': 'pickStarter2' };
DATA.maps.lab.npcs.find((n) => n.id === 'aide1').script = 'rhys';
DATA.maps.emberlow_home.tileScripts = { '7,1': 'storagePc' };
DATA.maps.fern_hearth.tileScripts = { '10,3': 'storagePc' };
(() => {
  const r1 = DATA.maps.route1.npcs;
  Object.assign(r1.find((n) => n.id === 'tom'), { trainer: 'tom', dir: 'right', move: 'still', sight: 4 });
  Object.assign(r1.find((n) => n.id === 'bram'), { trainer: 'bram', dir: 'left', move: 'still', sight: 4 });
  Object.assign(r1.find((n) => n.id === 'ivy'), { trainer: 'ivy', noSight: true });
  const sc = DATA.maps.fern_school.npcs;
  Object.assign(sc.find((n) => n.id === 'stud1'), { trainer: 'stud1', noSight: true });
  Object.assign(sc.find((n) => n.id === 'stud2'), { trainer: 'stud2', noSight: true });
  Object.assign(sc.find((n) => n.id === 'teacher'), { trainer: 'hollis', noSight: true });
  DATA.maps.fernwick.npcs.find((n) => n.id === 'holt').script = 'holt';
})();

/* Trainer gifts */
DATA.scripts.abel = async function (s) {
  const o = { name: 'Old Abel' };
  const caught = DATA.speciesList.filter((k) => G.dex[k] && G.dex[k].caught).length;
  if (G.party.length && caught >= 3 && !s.flag('got_coin')) {
    await s.say(['Three different kinds caught already? You remind me of myself at your age.', 'Here. My lucky coin. Let one of your Wildmon hold it in a trainer battle and the prize money doubles. Works every time!'], o);
    s.set('got_coin'); await s.give('lucky_coin'); return;
  }
  return s.say(['When I was young, every town lit its Beacon on the longest night of the year.', G.party.length && !s.flag('got_coin') ? 'Catch three different kinds of Wildmon and come and see me. I might have something for you.' : 'Now they are just Halls for trainers. Hmph. Nobody remembers why they were built.'], o);
};
DATA.maps.fernwick.npcs.find((n) => n.id === 'abel').script = 'abel';
