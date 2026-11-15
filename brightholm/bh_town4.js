'use strict';
/* =====================================================================
   BRIGHTHOLM — Inside Paragon: the Training Wing, Skye, Ivo, and
   Hall 4 (the Circuit Hall)
   ===================================================================== */
DATA.tiles['Ø'] = { t: 'metalwall', solid: true, text: 'A humming wall of steel panels. Cables run behind it.' };
DATA.tiles['÷'] = { t: 'metal' };
DATA.tiles['ä'] = { t: 'egate', solid: true, text: 'A crackling energy gate. A floor switch somewhere must turn it off.' };
DATA.tiles['Ä'] = { t: 'egateoff' };
DATA.tiles['ö'] = { t: 'egate', solid: true, text: 'A crackling energy gate. A floor switch somewhere must turn it off.' };
DATA.tiles['Ö'] = { t: 'egateoff' };
DATA.tiles['¡'] = { t: 'switchoff', plate: true };
DATA.tiles['¿'] = { t: 'switchon', plate: true };
Object.assign(TILE_DRAW, {
  metalwall(p, f, v) { p.r('#2a2e3a', 0, 0, 16, 16); p.r('#3a4050', 1, 1, 14, 6); p.r('#3a4050', 1, 9, 14, 6); p.r('#4a5262', 1, 1, 14, 1); p.r('#4a5262', 1, 9, 14, 1); if (v) { p.r('#e8c040', 12, 3, 2, 2); } else { p.r('#5ab8e8', 3, 11, 2, 2); } },
  switchoff(p) { TILE_DRAW.metal(p, 0, 0); p.r('#2a2e3a', 3, 3, 10, 10); p.r('#5a3030', 4, 4, 8, 8); p.r('#a84040', 5, 5, 6, 3); p.r('#f0d040', 7, 9, 2, 2); },
  switchon(p) { TILE_DRAW.metal(p, 0, 0); p.r('#2a2e3a', 3, 3, 10, 10); p.r('#2a5a30', 4, 4, 8, 8); p.r('#5ad070', 5, 8, 6, 3); p.r('#f0f070', 7, 5, 2, 2); },
  egate(p, f) {
    TILE_DRAW.metal(p, 0, 0); p.r('#2a2e3a', 0, 1, 3, 14); p.r('#2a2e3a', 13, 1, 3, 14); p.r('#e8c040', 1, 2, 1, 12); p.r('#e8c040', 14, 2, 1, 12);
    for (let r = 0; r < 3; r++) { const y0 = 3 + r * 4; for (let x = 3; x < 13; x++) { const y = y0 + (((x + f + r) % 4) < 2 ? 0 : 1); p.r(r === 1 ? '#ffffff' : '#fff070', x, y, 1, 1); p.r('rgba(255,230,80,0.35)', x, y + 1, 1, 1); } }
  },
  egateoff(p) { TILE_DRAW.metal(p, 0, 0); p.r('#2a2e3a', 0, 1, 3, 14); p.r('#2a2e3a', 13, 1, 3, 14); p.r('#5a5a40', 1, 2, 1, 12); p.r('#5a5a40', 14, 2, 1, 12); },
});
Object.assign(TILE_VARIANTS, { metalwall: 2 });
Object.assign(TILE_FRAMES, { egate: 4 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name === 'egate') f = Math.floor(Game.t * 10); return gt(name, f, v); };
}
{
  const ch0 = World.ch.bind(World);
  World.ch = function (x, y) {
    const c = ch0(x, y);
    if (c === 'ä') return FieldState.gatesOn() ? 'Ä' : 'ä';
    if (c === 'ö') return FieldState.gatesOn() ? 'ö' : 'Ö';
    if (c === '¡') return FieldState.gatesOn() ? '¿' : '¡';
    return c;
  };
}

Object.assign(DATA.looks, {
  ivo: { hair: '#f0d040', skin: '#e8b890', shirt: '#2a3a5a', pants: '#3a3a4a', shoes: '#e8c040', style: 'spiky' },
  vex: { hair: '#e8e8f0', skin: '#e0c0a8', shirt: '#f4f4f0', pants: '#2a2a34', shoes: '#d8a030', style: 'long' },
  mechanic: { hair: '#3a2a1a', skin: '#c08a60', shirt: '#4a6a8a', pants: '#3a3a4a', shoes: '#2a2a2a', hat: '#e8c040' },
});
DATA.items.paragon_pass = { name: 'Paragon Pass', pocket: 'key', desc: 'A silver card with a P on it. A Gibbolt stole it from a careless cadet. It opens the service door at the side of Paragon Academy.' };

/* ---------- The stolen pass and the service door ---------- */
{
  const v = DATA.maps.vantage;
  v.props = v.props.filter((pr) => !(pr.type === 'wildmon' && pr.sp === 'gibbolt')).concat([
    { type: 'wildmon', sp: 'gibbolt', x: 34, y: 1, script: 'bhGibboltPass', cond: (g) => !g.bag.paragon_pass && !g.flags.wing_done },
    { type: 'servicedoor', x: 33, y: 4, script: 'bhServiceDoor' },
  ]);
  v.npcs = v.npcs.map((n) => {
    if (n.id === 'gran') return Object.assign({}, n, { talk: null, script: 'bhIvoGran' });
    return n;
  }).concat([
    { id: 'skye_v2', x: 14, y: 8, dir: 'down', look: 'skye', name: 'Skye', script: 'bhSkyeAfter', cond: (g) => !!g.flags.wing_done },
  ]);
  const hall4 = v.buildings.find((b) => b.to && b.to.map === 'vantage_hall4');
  hall4.to = { map: 'circuit_hall', x: 7, y: 13, dir: 'up' };
}
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'servicedoor') {
      const p = pen(ctx);
      p.r('#2a2e3a', sx + 2, sy - 6, 12, 22); p.r('#6a7280', sx + 3, sy - 5, 10, 20); p.r('#8a92a0', sx + 3, sy - 5, 10, 1);
      p.r('#3a4050', sx + 3, sy + 3, 10, 1); p.r('#e8c040', sx + 10, sy + 4, 2, 2);
      p.r('#1a1e2a', sx + 4, sy - 2, 3, 4); p.r(Math.floor(t * 2) % 2 ? '#e84a4a' : '#5a2020', sx + 5, sy - 1, 1, 1);
      p.r('#d8a030', sx + 6, sy - 4, 4, 2);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}

/* ---------- The Training Wing ---------- */
Object.assign(DATA.trainers, {
  cadet_a: { cls: 'Paragon Cadet', name: 'Brio', look: 'cadet', team: [['packhowl', 25, null, { grey: true }], ['kilowatt', 25, null, { grey: true }]], prize: 200, ai: 'tactical', pot: 14,
    intro: 'Intruder! This is a restricted training area!', lose: 'Our Wildmon were supposed to be unbeatable...', after: 'They never get tired. They never get scared. They never... get anything.' },
  cadet_b: { cls: 'Paragon Cadet', name: 'Tamsin', look: 'cadet2', team: [['vinestrike', 25, null, { grey: true }], ['gibbolt', 26, null, { grey: true }]], prize: 210, ai: 'tactical', pot: 14,
    intro: 'You do not have clearance! Silver Lanterns, go!', lose: 'Wait. Did my Gibbolt just look at me?', after: 'I used to call her Sparky. They told me names were a waste of time.' },
  cadet_c: { cls: 'Paragon Cadet', name: 'Rufus', look: 'cadet', team: [['aegadillo', 26, null, { grey: true }], ['tuftfang', 25, null, { grey: true }]], prize: 210, ai: 'tactical', pot: 14,
    intro: 'Nobody gets near the Instructor!', lose: 'I... I need to sit down.', after: 'The Instructor says the Founder hates losing. Hates it more than anything in the world.' },
  vex: { cls: 'Paragon Instructor', name: 'Vex', look: 'vex', team: [['packhowl', 27, null, { grey: true }], ['surgibbon', 27, null, { grey: true }], ['stampede', 29, 'super_potion', { grey: true }]], prize: 600, ai: 'tactical', items: { super_potion: 2 }, pot: 18,
    intro: 'Welcome!', lose: 'Unacceptable.', after: '' },
  skye3: { cls: 'Rival', name: 'Skye', look: 'skye', team: [], prize: 500, ai: 'tactical', lose: 'No... they said we could not lose...', win: 'See? Paragon works!' },
});
DATA.maps.paragon_wing = {
  name: 'Paragon Training Wing', region: 'vantage', music: 'order', outdoor: false,
  rows: [
    'WWWWWWWWWWWWWWWWWWWW',
    'WMMMWWMMWWWWMMWWMMMW',
    'WKKKWKKKKKKKKKKWKKKW',
    'WKKKWKKKKKKKKKKWKKKW',
    'WKKKWWWWWKKWWWWWKKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WWWWKWWWWKKWWWWKWWWW',
    'WMKKKKMWWKKWWMKKKKMW',
    'WKKKKKKWWKKWWKKKKKKW',
    'WMKKKKMWWKKWWMKKKKMW',
    'WWWWWWWWWKKWWWWWWWWW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WKKKKKKKKKKKKKKKKKKW',
    'WWWWWWWWWmmWWWWWWWWW',
  ],
  warps: [9, 10].map((x) => ({ x, y: 14, to: { map: 'vantage', x: 34, y: 4, dir: 'down' } })),
  tileText: {
    '1,8': 'A machine with a silver Lantern clamped inside. Its glow is being sucked down a thick cable.', '6,8': 'A machine with a silver Lantern clamped inside. Its glow is being sucked down a thick cable.',
    '1,10': 'A tank of swirling grey light. A label reads: HARVEST. DO NOT RETURN TO OWNER.', '6,10': 'A tank of swirling grey light. A label reads: HARVEST. DO NOT RETURN TO OWNER.',
    '13,8': 'A screen showing a map of Brightholm. Larkfield, Stockridge, Shalebrook and the Sunward Keys are all circled in silver.', '18,8': 'A screen showing a map of Brightholm. Every circle has a date beside it. The last date is the lantern festival.',
    '13,10': 'A filing cabinet full of trial day forms. Hundreds of them.', '18,10': 'A filing cabinet full of trial day forms. Hundreds of them.',
    '1,1': 'A wall of monitors showing every Hall in Brightholm.', '2,1': 'A wall of monitors showing every Hall in Brightholm.', '3,1': 'One monitor shows the Larkfield Hall. Your dad is sweeping the floor.',
    '6,1': 'A huge banner: STRENGTH IS EVERYTHING.', '7,1': 'A huge banner: STRENGTH IS EVERYTHING.', '12,1': 'A glass case holds an old, scuffed Badge case. It looks like it came from Aldermere.', '13,1': 'A glass case holds an old, scuffed Badge case. Every slot is full.',
  },
  props: [
    { type: 'wildmon', sp: 'yipper', x: 3, y: 9, grey: true, text: 'A grey Yipper sits in a pen. When you kneel down, its tail twitches. Just once.' },
    { type: 'wildmon', sp: 'pebblin', x: 4, y: 8, grey: true, text: 'A grey Pebblin stares at nothing.' },
    { type: 'wildmon', sp: 'rooftik', x: 17, y: 2, grey: true, text: 'A grey Rooftik is perched in a cage. It does not even flutter.' },
    { type: 'wildmon', sp: 'gibbolt', x: 18, y: 3, grey: true, text: 'A grey Gibbolt. Its fur used to be golden.' },
  ],
  npcs: [
    { id: 'cadet_a', x: 12, y: 13, dir: 'left', look: 'cadet', trainer: 'cadet_a', sight: 3, name: 'Paragon Cadet Brio' },
    { id: 'cadet_b', x: 10, y: 9, dir: 'down', look: 'cadet2', trainer: 'cadet_b', sight: 2, name: 'Paragon Cadet Tamsin' },
    { id: 'cadet_c', x: 4, y: 6, dir: 'right', look: 'cadet', trainer: 'cadet_c', sight: 4, name: 'Paragon Cadet Rufus' },
    { id: 'skye_w', x: 16, y: 9, dir: 'left', look: 'skye', name: 'Skye', script: 'bhSkyeWing', cond: (g) => !g.flags.skye_wing },
    { id: 'vex', x: 9, y: 2, dir: 'down', look: 'vex', name: 'Instructor Vex', script: 'bhVex', cond: (g) => !g.flags.beat_vex },
    { id: 'ivo', x: 2, y: 2, dir: 'down', look: 'ivo', name: 'Ivo', script: 'bhIvoCell', cond: (g) => !g.flags.ivo_free },
  ],
};
DATA.mapEnter.paragon_wing = () => { if (!G.flags.wing_entered) { G.flags.wing_entered = 1; Script.run((s) => s.say(['The service door hisses shut behind you.', 'Somewhere ahead, machines hum. And somewhere, a Wildmon is crying.'])); } };

/* ---------- The Circuit Hall ---------- */
DATA.trainers.ivo = { cls: 'Hall Master', name: 'Ivo', look: 'ivo', team: [['gibbolt', 28], ['fizzbat', 28], ['megawatt', 31, 'super_potion']], prize: 300, ai: 'tactical', items: { super_potion: 2 }, pot: 14,
  intro: 'Welcome!', lose: 'Now THAT is real power.', after: '' };
Object.assign(DATA.trainers, {
  sparks: { cls: 'Engineer', name: 'Sparks', look: 'mechanic', team: [['kilowatt', 27], ['fizzbat', 27]], prize: 100, ai: 'basic',
    intro: 'Mind the gates! And mind me!', lose: 'Short circuit!', after: 'Every switch flips every gate. Think two steps ahead.' },
  volta: { cls: 'Engineer', name: 'Volta', look: 'mechanic', team: [['zappik', 28], ['kilowatt', 27]], prize: 104, ai: 'basic',
    intro: 'The boss is back, and so are we!', lose: 'Fully discharged.', after: 'Earth moves shrug off Electric attacks completely. Ivo hates that.' },
});
const CIRCUIT_ROWS = [
  'WWWWWWWWWWWWWWW',
  'WJWWWWWWWWWWWJW',
  'Ø÷÷÷÷÷Ø÷Ø÷÷÷÷÷Ø',
  'Ø÷÷÷÷÷ØöØ÷÷÷÷÷Ø',
  'Ø÷ØØØ÷Ø÷Ø÷ØØØ÷Ø',
  'Ø÷Ø¡÷÷ä÷ö÷÷¡Ø÷Ø',
  'Ø÷ØØØØØ÷ØØØØØ÷Ø',
  'Ø÷÷÷ö÷÷÷÷÷ä÷÷÷Ø',
  'ØØØ÷ØØØØØØØ÷ØØØ',
  'Ø¡÷÷ä÷÷Ø÷÷ö÷÷¡Ø',
  'Ø÷ØØØØØ÷ØØØØØ÷Ø',
  'Ø÷÷÷÷÷ä÷ö÷÷÷÷÷Ø',
  'ØØØØØØ÷÷÷ØØØØØØ',
  'Ø÷÷÷÷÷÷÷÷÷÷÷÷÷Ø',
  'ØØØØØØmmmØØØØØØ',
];
DATA.maps.circuit_hall = {
  name: 'Circuit Hall', region: 'vantage', music: 'hall', outdoor: false,
  rows: CIRCUIT_ROWS,
  warps: [6, 7, 8].map((x) => ({ x, y: 14, to: { map: 'vantage', x: 6, y: 21, dir: 'down' } })),
  npcs: [
    { id: 'ivo_h', x: 7, y: 2, dir: 'down', look: 'ivo', script: 'bhIvo', name: 'Ivo' },
    { id: 'sparks', x: 2, y: 11, dir: 'right', look: 'mechanic', trainer: 'sparks', sight: 1, name: 'Engineer Sparks' },
    { id: 'volta', x: 12, y: 7, dir: 'left', look: 'mechanic', trainer: 'volta', sight: 1, name: 'Engineer Volta' },
    { id: 'guide', x: 10, y: 13, dir: 'left', look: 'clerk', script: 'bhHallGuide4', name: 'Hall Guide' },
  ],
};
DATA.mapEnter.circuit_hall = () => {
  if (G.flags.ivo_free) return;
  Script.run(async (s) => {
    await s.say(['The Circuit Hall is dark. A clerk hurries over.', 'Sorry! We are closed. Hall Master Ivo is away at Paragon Academy, and he has not answered a single letter.'], { name: 'Hall Clerk' });
    await Game.warpTo({ map: 'vantage', x: 6, y: 21, dir: 'down' });
  });
};

Object.assign(BH_BADGES[3], { id: 'circuit', name: 'Circuit Badge', hall: 'Circuit Hall', town: 'Vantage City', master: 'Ivo', type: 'electric', shape: 'diamond', c1: '#e8c040', c2: '#2a3a5a' });
DATA.badges.circuit = { name: 'Circuit Badge', hall: 'Circuit Hall', town: 'Vantage City', master: 'Ivo' };
{
  const cv = BadgeArt.canvas.bind(BadgeArt);
  BadgeArt.canvas = function (b, earned) {
    const fresh = !this.cache.has(b.id + (earned ? 1 : 0)); const c = cv(b, earned);
    if (fresh && earned && b.id === 'circuit') {
      const x = c.getContext('2d'); x.fillStyle = '#f8e070';
      for (const [i, j] of [[10, 5], [9, 6], [9, 7], [8, 8], [8, 9], [9, 9], [10, 9], [10, 10], [9, 11], [9, 12], [8, 13]]) x.fillRect(i, j, 1, 1);
    }
    return c;
  };
}

function skyeTeam3() {
  const evo = { bristling: 'bristlehog', blazeling: 'blazestride', snapling: 'snaptooth' };
  const st = evo[G.flags.skye_starter] || 'snaptooth';
  const pot = { hp: 16, atk: 16, def: 16, spa: 16, spd: 16, spe: 16 };
  return [['packhowl', 26], ['vinestrike', 26], ['gibbolt', 26], [st, 28]].map(([sp, l]) => Mon.create(sp, l, { lustre: false, mark: null, pot, item: null, ti: 0 }));
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhGibboltPass(s) {
    if (!s.flag('beat_zara')) return s.say('A Gibbolt is dangling from a lamp post, chewing a stolen sandwich.');
    await s.say(['The Gibbolt is clutching something shiny. A silver card with a P on it!', 'It must have stolen it from a Paragon cadet.']);
    const c = await s.ask('Battle the Gibbolt for the card?', ['Yes', 'No']);
    if (c !== 0) return;
    await s.say('The Gibbolt shrieks and swings down from the lamp post!');
    const res = await s.battle({ kind: 'wild', enemy: [Mon.create('gibbolt', 24, { lustre: false, mark: null })], bg: 'grass' });
    if (res !== 'win' && res !== 'caught') return s.say('The Gibbolt scrambled back up the lamp post, still clutching the card.');
    await s.say(['The Gibbolt dropped the silver card!']);
    await s.give('paragon_pass');
  },
  async bhServiceDoor(s) {
    if (s.flag('wing_done')) return s.say('The service door is locked tight. A notice reads: CLOSED FOR INSPECTION.');
    if (!s.has('paragon_pass')) return s.say(['A plain steel door in the side of the Academy. A sign reads: STAFF ONLY.', 'There is a card slot beside it, glowing red.']);
    await s.say(['You slide the Paragon Pass into the slot.', 'The light turns green. The door slides open...'], { sfx: 'door' });
    await Game.warpTo({ map: 'paragon_wing', x: 9, y: 13, dir: 'up' });
  },
  async bhIvoGran(s) {
    const o = { name: 'Worried Gran' };
    if (s.flag('ivo_free')) return s.say(['My Ivo is home! He says you got him out of that place.', 'The Circuit Hall is open again. Go on, he is waiting for you. Do not let him go easy!'], o);
    await s.say(['My grandson Ivo runs the Circuit Hall. Or he did.', 'He went to Paragon for a "masterclass" a month ago and has not come home since.'], o);
    if (s.flag('beat_zara')) await s.say(['They say there is a side door, for staff. If only somebody had a pass...'], o);
  },
  async bhSkyeWing(s) {
    const o = { name: 'Skye' };
    await s.say(['{player}?! What are you doing back here?', "Look at my team! The Instructor put them in the machines for one night, and now they're SO strong.", "They don't get tired. They don't get hurt. They don't..."], o);
    await s.say(["Doesn't matter! Let me show you! Paragon works!"], o);
    const T = Object.assign({}, DATA.trainers.skye3);
    const res = await s.battle({ kind: 'trainer', trainer: T, enemy: skyeTeam3(), noWhiteout: true });
    if (res === 'win') s.set('beat_skye3');
    await s.healParty();
    await s.say(res === 'win' ? ['No... they said we could not lose...'] : ['See? See?! Paragon wo...'], o);
    await s.say(['Skye\'s partner turns its head. For the first time all day, it looks at Skye.', 'It is grey all over. It whimpers.'], { sign: true });
    await s.say(["...Hey. Hey, buddy. You're shaking.", "What did they do to you? I just wanted us to be strong. I didn't want THIS.", "{player}, I'm such an idiot. Ivo's locked up in a room on the other side. The Instructor is up the middle.",
      "Go. Stop them. I'm getting my team out of here."], o);
    s.set('skye_wing');
    await Game.fadeOut(250); s.remove('skye_w'); await Game.fadeIn(250);
  },
  async bhVex(s) {
    const o = { name: 'Instructor Vex' };
    await s.say(['Ah. The trainer from the lobby. The Founder said you might come.', 'Do you know how many trial days we have run? Every Wildmon that walks out of here is stronger than any Hall Master\'s.',
      'Light is wasted on a Wildmon. It is better spent on winning.', 'Let me show you what real strength looks like.'], o);
    const res = await bossBattle(s, 'vex', { noWhiteout: true });
    if (res !== 'win') { await s.healParty(); return s.say(['Pathetic. Come back when you understand power.'], o); }
    await s.say(['Unacceptable. Utterly unacceptable.'], o);
    Sound.sfx('door');
    await s.say(['A speaker crackles. A cold, calm voice fills the room.', '"Enough, Vex. Release the Hall Master. Let them go."', '"They have seen nothing that matters. And the festival is coming."'], { sign: true });
    await s.say(['...As you wish, Founder.'], o);
    await Game.fadeOut(300); s.remove('vex'); await Game.fadeIn(300);
    s.set('beat_vex');
    await s.say(['Instructor Vex is gone. A door on the left side of the wing clicks open.'], { sign: true });
  },
  async bhIvoCell(s) {
    const o = { name: 'Ivo' };
    if (!s.flag('beat_vex')) return s.say(['Psst! Over here! I am Ivo, Master of the Circuit Hall. They locked me in for asking too many questions.', 'Their Instructor has the key. She is up the middle, past the cadets.'], o);
    await s.say(['You beat Vex? Ha! I knew somebody would come.', 'I signed up for their masterclass. Saw what those machines do to Wildmon and told them where to stick it. So they locked me in here.',
      'They are draining light from Wildmon all over Brightholm and storing it somewhere. I heard them say "the festival" over and over.', 'Right. I have a Hall to reopen. Come and find me at the Circuit Hall, and bring your best!'], o);
    s.set('ivo_free'); s.set('wing_done');
    await Game.fadeOut(300); s.remove('ivo'); await Game.fadeIn(300);
  },
  async bhSkyeAfter(s) {
    const o = { name: 'Skye' };
    if (s.flag('skye_after')) return s.say(["I'll be at the ferry the minute it opens. See you in the Sunward Keys!"], o);
    s.set('skye_after');
    await s.say(['{player}. Thanks for coming to get me. Really.', 'The nurse says my team is not hurt. Just... dimmed. Like their light was poured out.', 'The Rangers know about grey Wildmon. The ferry clerk said they are all down in the Sunward Keys.',
      "As soon as the ferries run again I'm going down there to find out how to fix them. And then I'm going to beat you fair and square. No machines."], o);
  },
  async bhHallGuide4(s) {
    const o = { name: 'Hall Guide' };
    await s.say(['Welcome to the Circuit Hall! Ivo uses Electric-type Wildmon.', 'Earth moves are your best friend here: Electric attacks cannot touch Earth types at all.', 'The red switches flip every energy gate in the Hall. Each time you step on one, the open gates close and the closed gates open.'], o);
    const c = await s.ask('Can I help?', ['Heal my team', 'Reset the switches', 'No thanks'], o);
    if (c === 0) { await s.healParty(); return s.say('Fully charged. Good luck!', o); }
    if (c === 1) { delete G.flags.gates_circuit_hall; Game.dirty = true; await s.say('Done. All switches are back to the start.', o); }
  },
  async bhIvo(s) {
    const o = { name: 'Ivo' };
    if (s.flag('beat_ivo')) return s.say(['Real power comes from your partners believing in you. No machine can bottle that.', 'The Sunward Keys are next. Get that ferry running and see what Paragon is doing to the reefs.'], o);
    await s.say(['You made it through my gates! Nice wiring, rookie.', 'I owe you one for getting me out of there. But I am not going easy on you. That would be an insult.', 'Paragon thinks power comes from a machine. Let me show you where it really comes from!'], o);
    const res = await bossBattle(s, 'ivo');
    if (res !== 'win') return;
    await s.say(['Now THAT is real power.', 'The Circuit Badge. Four down!'], o);
    await s.badge('circuit');
    await s.say(['And take this Move Scroll for Magnet Pulse. A blast of magnetic force that never misses its mark.'], o);
    await s.give('scroll_magnetpulse');
    await s.say(['I told the Rangers everything I saw in there. They want to reopen the ferry to the Sunward Keys so they can investigate the reefs.', 'That is where you need to go next.'], o);
  },
});
