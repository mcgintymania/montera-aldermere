'use strict';
/* =====================================================================
   BRIGHTHOLM — Shalebrook Pass, Vantage City, Paragon Academy, the
   skateboard, the Skate Trial and Hall 3
   ===================================================================== */
DATA.tiles['('] = { t: 'asphalt' };
DATA.tiles[')'] = { t: 'pavement' };
DATA.tiles['`'] = { t: 'crossing' };
DATA.tiles['·'] = { t: 'concrete' };
DATA.tiles['¦'] = { t: 'barrier', solid: true, text: 'A painted barrier, scuffed by a thousand skateboard wheels.' };
Object.assign(TILE_DRAW, {
  asphalt(p, f, v) { p.r('#4a4c54', 0, 0, 16, 16); const R = mulberry(v * 17 + 2); for (let i = 0; i < 8; i++) p.r(R() < 0.5 ? '#42444c' : '#565862', Math.floor(R() * 16), Math.floor(R() * 16), 1, 1); if (v === 3) p.r('#e8d070', 6, 7, 4, 1); },
  pavement(p, f, v) { p.r('#c8c4bc', 0, 0, 16, 16); p.r('#b4b0a8', 0, 0, 16, 1); p.r('#b4b0a8', 0, 0, 1, 16); p.r('#d8d4cc', 1, 1, 14, 1); if (v === 2) { p.r('#a8a49c', 5, 9, 2, 1); } },
  crossing(p) { p.r('#4a4c54', 0, 0, 16, 16); for (let i = 1; i < 16; i += 4) p.r('#f0f0e8', i, 1, 2, 14); },
  concrete(p, f, v) { p.r('#b8c0c8', 0, 0, 16, 16); p.r('#a8b0b8', 0, 15, 16, 1); p.r('#a8b0b8', 15, 0, 1, 16); const R = mulberry(v * 7 + 4); for (let i = 0; i < 5; i++) p.r('#c8d0d8', Math.floor(R() * 15), Math.floor(R() * 15), 2, 1); if (v === 1) { p.r('#e8742a', 3, 4, 3, 1); p.r('#5ab8e8', 9, 10, 4, 1); } },
  barrier(p, f, v) { p.r('#b8c0c8', 0, 0, 16, 16); p.r('rgba(0,0,0,0.2)', 1, 12, 15, 3); p.r('#3a4a6a', 0, 3, 16, 10); p.r('#e8742a', 0, 3, 16, 2); p.r('#4a5a7a', 0, 6, 16, 1); if (v % 2) p.r('#e8c040', 4, 8, 3, 2); p.r('#2a3a5a', 0, 12, 16, 1); },
  ramp_u(p, f) { RAMP(p, f, 0, -1); }, ramp_d(p, f) { RAMP(p, f, 0, 1); }, ramp_l(p, f) { RAMP(p, f, -1, 0); }, ramp_r(p, f) { RAMP(p, f, 1, 0); },
});
function RAMP(p, f, dx, dy) {
  p.r('#7a8698', 0, 0, 16, 16); p.r('#8a96a8', 1, 1, 14, 14);
  for (let i = 0; i < 2; i++) {
    const o = ((f + i * 3) % 6) * 3 - 2;
    for (let k = -4; k <= 4; k++) {
      const a = o - Math.abs(k), b = 7 + k;
      const x = dx ? (dx > 0 ? a : 15 - a) : b, y = dy ? (dy > 0 ? a : 15 - a) : b;
      if (x >= 1 && x < 14 && y >= 1 && y < 14) p.r(i ? '#f0c040' : '#ffe890', x, y, dx ? 2 : 1, dy ? 2 : 1);
    }
  }
  if (dx) { p.r('#5a6678', 0, 0, 16, 1); p.r('#5a6678', 0, 15, 16, 1); } else { p.r('#5a6678', 0, 0, 1, 16); p.r('#5a6678', 15, 0, 1, 16); }
}
Object.assign(TILE_VARIANTS, { asphalt: 4, pavement: 3, concrete: 3, barrier: 2 });
Object.assign(TILE_FRAMES, { ramp_u: 6, ramp_d: 6, ramp_l: 6, ramp_r: 6 });
{
  const gt = Gfx.tile.bind(Gfx);
  const MAP = { wind_u: 'ramp_u', wind_d: 'ramp_d', wind_l: 'ramp_l', wind_r: 'ramp_r' };
  Gfx.tile = function (name, f, v) {
    if (World.map && World.map.ramps && MAP[name]) return gt(MAP[name], Math.floor(Game.t * 10), v);
    return gt(name, f, v);
  };
  const tl = World.tile.bind(World);
  const RT = { text: 'A skate ramp. Roll onto it and it carries you along.' };
  World.tile = function (x, y) { const t = tl(x, y); return t && t.slide && this.map && this.map.ramps ? Object.assign({}, t, RT) : t; };
}

Object.assign(BH_HOUSE, {
  modern: { wall: 'plaster', wallCol: '#c8d4dc', roof: 'tin', roofCol: '#4a5a6a', door: '#2a3a5a', trim: '#5a6a7a' },
  flat: { wall: 'brick', wallCol: '#8a5a4a', roof: 'tin', roofCol: '#6a6a72', door: '#3a5a4a', trim: '#e8e0d0' },
});

Object.assign(DATA.looks, {
  zara: { hair: '#2a1a3a', skin: '#8a5a3a', shirt: '#5ab8e8', pants: '#3a3a4a', shoes: '#f0f0e8', style: 'spiky' },
  skater: { hair: '#e8742a', skin: '#f0c8a0', shirt: '#e84a6a', pants: '#3a4a6a', shoes: '#f0f0e8', hat: '#2a2a3a' },
  skater2: { hair: '#1a1a1a', skin: '#c08a60', shirt: '#7ad050', pants: '#2a2a3a', shoes: '#e8c040', style: 'ponytail' },
  cadet: { hair: '#3a2a1a', skin: '#e8b890', shirt: '#f4f4f0', pants: '#d8a030', shoes: '#f4f4f0', style: 'short' },
  cadet2: { hair: '#e8d8a0', skin: '#f2c8a0', shirt: '#f4f4f0', pants: '#d8a030', shoes: '#f4f4f0', style: 'bun' },
  founder: { hair: '#d8dce4', skin: '#c8ccd4', shirt: '#2a2a34', pants: '#2a2a34', shoes: '#c8ccd4', style: 'short' },
  climber2: { hair: '#5a3a1a', skin: '#e8b890', shirt: '#4a8a5a', pants: '#5a4a3a', shoes: '#3a2a1a', hat: '#c84a3a' },
});

Object.assign(DATA.music, {
  vantage: { bpm: 132, lead: 'square', chords: ['C', 'Am', 'F', 'G', 'C', 'Am', 'Dm', 'G'],
    melody: 'E5:2 G5:2 C6:2 G5:2 A5:4 G5:4 E5:2 D5:2 C5:2 D5:2 E5:4 G5:4 E5:2 G5:2 C6:2 D6:2 E6:4 D6:4 C6:2 B5:2 A5:2 B5:2 C6:8' },
});

DATA.items.skate_wheel = { name: 'Skate Wheel', pocket: 'collect', desc: 'A bright orange skateboard wheel. Somebody is missing this.' };
DATA.items.skateboard = { name: 'Skateboard', pocket: 'key', use: 'skate', desc: "Jaz's old board, fixed up good as new. Use it to hop on or off. Outdoors it's much faster than running." };
UI.useKey = Object.assign(UI.useKey || {}, {
  async skate() {
    G.skate = !G.skate; Game.dirty = true; Sound.sfx(G.skate ? 'jump' : 'confirm');
    await UI.dialog(G.skate ? `${G.name} hopped on the Skateboard! It works outdoors. Use it again to hop off.` : `${G.name} hopped off the Skateboard.`);
  },
});
{
  const sm = Entity.prototype.startMove;
  Entity.prototype.startMove = function (dir, tx, ty, speed = 1, jump = false) {
    if (Game.player === this && G && G.skate && World.map && World.map.outdoor && !jump && speed <= 2) speed = 2.8;
    return sm.call(this, dir, tx, ty, speed, jump);
  };
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (G && G.skate && World.map && World.map.outdoor && this.player) {
      const [cx, cy] = this.camera(); const p = this.player; const x = Math.round(p.drawX - cx), y = Math.round(p.drawY - cy);
      const P = pen(ctx); const side = p.dir === 'left' || p.dir === 'right';
      if (side) { P.r('#2a1a10', x + 1, y + 13, 14, 2); P.r('#e8742a', x + 2, y + 12, 12, 1); P.r('#f0e8d0', x + 3, y + 15, 2, 1); P.r('#f0e8d0', x + 11, y + 15, 2, 1); }
      else { P.r('#2a1a10', x + 5, y + 10, 6, 6); P.r('#e8742a', x + 6, y + 10, 4, 5); P.r('#f0e8d0', x + 5, y + 11, 1, 1); P.r('#f0e8d0', x + 10, y + 11, 1, 1); P.r('#f0e8d0', x + 5, y + 14, 1, 1); P.r('#f0e8d0', x + 10, y + 14, 1, 1); }
    }
    if (World.map && World.map.rings && Trials.run && Trials.run.id === 'skate') {
      const [cx, cy] = this.camera(); const P = pen(ctx); const bob = Math.round(Math.sin(this.t * 4) * 1.5);
      World.map.rings.forEach(([rx, ry], i) => {
        if (Trials.run.got.has(i)) return;
        const x = rx * TS - cx, y = ry * TS - cy + bob;
        P.r('rgba(0,0,0,0.2)', x + 3, y + 13 - bob, 10, 2);
        P.r('#e8742a', x + 4, y + 1, 8, 2); P.r('#e8742a', x + 4, y + 11, 8, 2); P.r('#e8742a', x + 2, y + 3, 2, 8); P.r('#e8742a', x + 12, y + 3, 2, 8);
        P.r('#ffd890', x + 5, y + 1, 4, 1); P.r('#ffd890', x + 2, y + 4, 1, 3);
      });
    }
  };
  const oa = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const p = this.player;
    if (World.map && World.map.rings && Trials.run && Trials.run.id === 'skate') {
      World.map.rings.forEach(([rx, ry], i) => {
        if (rx === p.x && ry === p.y && !Trials.run.got.has(i)) { Trials.run.got.add(i); Sound.sfx('item'); }
      });
      if (Trials.run.got.size === World.map.rings.length && !Trials.run.done) { Trials.run.done = performance.now(); Script.run((s) => DATA.scripts.bhSkateDone(s)); }
    }
    return oa();
  };
}

/* ---------- Shalebrook: the pass is cleared ---------- */
{
  const ch0 = World.ch.bind(World);
  World.ch = function (x, y) { const c = ch0(x, y); if (c === 'r' && this.id === 'shalebrook' && y === 24 && (x === 13 || x === 14) && G && G.flags.beat_petra) return '_'; return c; };
  const sb = DATA.maps.shalebrook;
  sb.connections = { north: { map: 'quarry_road', dx: 0 }, south: { map: 'shale_pass', dx: 0 } };
  sb.npcs = sb.npcs.map((n) => (n.id === 'pass1' ? Object.assign({}, n, { cond: (g) => !g.flags.beat_petra }) : n)).concat([
    { id: 'pass2', x: 11, y: 24, dir: 'right', look: 'quarry', name: 'Quarry Worker', cond: (g) => !!g.flags.beat_petra,
      talk: ['All clear! Petra and her Aegadillo shifted the last boulders this morning.', 'Shalebrook Pass winds down the mountain to Vantage City. You can see the lights from the bottom.'] },
  ]);
  sb.props = sb.props.map((pr) => (pr.x === 12 && pr.y === 23 ? Object.assign({}, pr, { text: 'SHALEBROOK PASS\nSouth to Vantage City.' }) : pr));
  const pet = DATA.scripts.bhPetra;
  DATA.scripts.bhPetra = async function (s) {
    if (s.flag('beat_petra')) return s.say(['Stone does not rush, and it does not break. Remember that, on the road ahead.', 'My Aegadillo cleared the pass for you. Vantage City is next. Watch yourself around that Academy.'], { name: 'Petra' });
    return pet(s);
  };
}

/* ---------- Shalebrook Pass ---------- */
Object.assign(DATA.trainers, {
  ash: { cls: 'Climber', name: 'Ash', look: 'climber2', team: [['rookling', 17], ['tuftfang', 17]], prize: 32, ai: 'basic',
    intro: 'Up here the wind tests you. So do I!', lose: 'Blown clean off the ledge.', after: 'Tuftfang hunt along these ledges at dusk. They are almost impossible to spot.' },
  ruth: { cls: 'Hiker', name: 'Ruth', look: 'hiker', team: [['goatlet', 17], ['armlet', 17], ['pebblin', 17]], prize: 32, ai: 'basic',
    intro: 'Forty years walking this pass. Let us see what you are made of!', lose: 'My knees and my team both need a rest.', after: 'Down in Vantage City, they say Paragon trains Wildmon in a week. Took me forty years.' },
  nova: { cls: 'Paragon Cadet', name: 'Nova', look: 'cadet2', team: [['gibbolt', 18, null, { grey: true }], ['yipper', 18, null, { grey: true }]], prize: 72, ai: 'tactical', pot: 14,
    intro: 'A wild trainer! Watch how a Paragon cadet battles!', lose: 'This... is not in the training manual.', after: 'Our Wildmon never get tired. Never get scared. Never get anything, really.' },
  kai: { cls: 'Skater', name: 'Kai', look: 'skater', team: [['rooftik', 17], ['gibbolt', 18]], prize: 31, ai: 'basic',
    intro: 'Whoa, dude! Battle before I bomb the hill?', lose: 'Wiped out! Totally wiped out.', after: 'Check the skate park in Vantage City. Jaz is the best skater there, and she lost her wheels again.' },
});
DATA.maps.shale_pass = {
  name: 'Shalebrook Pass', region: 'farreach', music: 'route', outdoor: true, border: ']', weather: ['clear', 'clear', 'rain', 'clear'],
  rows: [
    ']]]]]]]]]]]]]__]]]]]]]]]]]]]',
    ']]]]]].......__.......]]]]]]',
    ']]]]]].,,,,,.__.......]]]]]]',
    ']]]]]].,,,,,.__.......]]]]]]',
    ']]]]]].,,,,,.________.]]]]]]',
    ']]]]]].......________.]]]]]]',
    ']]]..r.............__.r..]]]',
    ']]].,,,,.......,,,,__....]]]',
    ']]].,,,,.......,,,,__....]]]',
    ']]].,,,,.......,,,,__....]]]',
    ']]].,,,,.____________....]]]',
    ']]]......____________....]]]',
    ']]]]]vvvv__vvvvvvvvvvvv]]]]]',
    ']]]]]....__.,,,,...,,,,]]]]]',
    ']]]]]....__.,,,,...,,,,]]]]]',
    ']]]]]....__.,,,,...,,,,]]]]]',
    ']]]]]....__........,,,,]]]]]',
    ']]]]]...._________.....]]]]]',
    ']]]......_________.......]]]',
    ']]].,,,,,.......__.,,,,,.]]]',
    ']]].,,,,,.......__.,,,,,.]]]',
    ']]].,,,,,.......__.,,,,,.]]]',
    ']]].,,,,,.......__.,,,,,.]]]',
    ']]].............__.......]]]',
    ']]]]]]....._______....]]]]]]',
    ']]]]]]....._______..r.]]]]]]',
    ']]]]]].....__.........]]]]]]',
    ']]]]]].r...__..,,,,,,.]]]]]]',
    ']]]]]].....__..,,,,,,.]]]]]]',
    ']]]]]].....__..,,,,,,.]]]]]]',
    ']]]vvvvvvvv____vvvvvvvvvv]]]',
    ']]]........____........r.]]]',
    ']]]..,,,,,...__..,,,,,,..]]]',
    ']]].r,,,,,...__..,,,,,,..]]]',
    ']]]..,,,,,...__..,,,,,,..]]]',
    ']]]..........__..........]]]',
    ']]]]]]]......__......]]]]]]]',
    ']]]]]]]......__......]]]]]]]',
    ']]]]]]]......__......]]]]]]]',
    ']]]]]]]]]]]]]__]]]]]]]]]]]]]',
  ],
  connections: { north: { map: 'shalebrook', dx: 0 }, south: { map: 'vantage', dx: 4 } },
  props: [
    { type: 'sign', x: 12, y: 1, text: 'SHALEBROOK PASS\nNorth: Shalebrook\nSouth: Vantage City' },
    { type: 'sign', x: 12, y: 36, text: 'VANTAGE CITY LOOKOUT\nThe brightest city in Brightholm. The big white building is Paragon Academy.' },
  ],
  items: [
    { id: 'p1', x: 24, y: 9, item: 'super_potion' },
    { id: 'g1', x: 4, y: 22, item: 'great_lantern', qty: 2 },
    { id: 'r1', x: 21, y: 1, item: 'revive', hidden: true },
    { id: 's1', x: 23, y: 33, item: 'skate_wheel', hidden: true },
  ],
  npcs: [
    { id: 'ash', x: 21, y: 8, dir: 'left', look: 'climber2', trainer: 'ash', sight: 3, name: 'Climber Ash' },
    { id: 'ruth', x: 5, y: 16, dir: 'right', look: 'hiker', trainer: 'ruth', sight: 4, name: 'Hiker Ruth' },
    { id: 'nova', x: 15, y: 26, dir: 'left', look: 'cadet2', trainer: 'nova', sight: 3, name: 'Paragon Cadet Nova' },
    { id: 'kai', x: 12, y: 33, dir: 'right', look: 'skater', trainer: 'kai', sight: 2, name: 'Skater Kai' },
  ],
};
DATA.encounters.shale_pass = {
  grass: {
    day: [['tuftfang', 14, 14, 17], ['gibbolt', 16, 14, 17], ['rooftik', 16, 14, 17], ['goatlet', 14, 14, 17], ['armlet', 12, 14, 17], ['twigwing', 12, 14, 16], ['pebblin', 10, 14, 17], ['zappy', 6, 15, 17]],
    night: [['tuftfang', 26, 14, 18], ['gibbolt', 12, 14, 17], ['shadepaw', 16, 14, 17], ['hootlet', 14, 14, 17], ['armlet', 12, 14, 17], ['wispet', 12, 15, 17], ['zappy', 8, 15, 17]],
  },
};

/* ---------- Vantage City ---------- */
DATA.trainers.zara = { cls: 'Hall Master', name: 'Zara', look: 'zara', team: [['rooftik', 22], ['gustfinch', 23], ['augerhawk', 25, 'super_potion']], prize: 120, ai: 'tactical', items: { super_potion: 2 }, pot: 12,
  intro: 'Welcome!', lose: 'Sick run! You totally stuck the landing.', after: '' };
Object.assign(DATA.trainers, {
  rio: { cls: 'Skater', name: 'Rio', look: 'skater', team: [['twigwing', 20], ['gibbolt', 21]], prize: 38, ai: 'basic',
    intro: 'You found a way through the ramps? Respect. Now battle me!', lose: 'Bailed it.', after: 'Zara flies Air types. Electric and Rock moves knock them right out of the sky.' },
  pia: { cls: 'Skater', name: 'Pia', look: 'skater2', team: [['rooftik', 21], ['fizzbat', 20]], prize: 38, ai: 'basic',
    intro: 'Ramps go one way, rider. Pick the right one!', lose: 'Okay, okay. Nice lines.', after: 'Stuck? Ramps always win. Look for the one that carries you where you want to go.' },
});
DATA.shops.vantage = ['great_lantern', 'lantern', 'super_potion', 'potion', 'revive', 'antidote', 'burn_salve', 'wake_bell', 'unknot', 'thaw_tea', 'scroll_galeburst'];

DATA.maps.vantage = {
  name: 'Vantage City', region: 'vantage', music: 'vantage', outdoor: true, border: 'T',
  rows: [
    'TTTTTTTTTTTTTTTTT((TTTTTTTTTTTTTTTTT',
    'T)))))))...~~...)(())))))))))))))))T',
    'T))))))).f.~~.f.)(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))``))))))))))))))))T',
    'T(((((((((((((((`((`(((((((((((((((T',
    'T(((((((((((((((`((`(((((((((((((((T',
    'T))))))))))))))))``))))))))))))))))T',
    'T..........)fff))(())fff)..........T',
    'T.T..T..T..)fff))(())fff)..T..T..T.T',
    'T..........))))))(())))))..........T',
    'T))))))))))·····)(())))))))))))))))T',
    'T))))))))))·····)(())))))))))))))))T',
    'T))))))))))·····)(())))))))))))))))T',
    'T))))))))))·····)(())))))))))))))))T',
    'T))))))))))·····)(())))))))))))))))T',
    'T))))))))))·····)(())))))))))))))))T',
    'T))))))))))))))))``))))))))))))))))T',
    'T(((((((((((((((`((`(((((((((((((((T',
    'T(((((((((((((((`((`(((((((((((((((T',
    'T))))))))))))))))``))))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'T))))))))))))))))(())))))))))))))))T',
    'TTTTTTTTTTTTTTTTT¦¦TTTTTTTTTTTTTTTTT',
  ],
  connections: { north: { map: 'shale_pass', dx: -4 } },
  buildings: [
    { kind: 'academy', x: 21, y: 1, w: 12, h: 7, door: 6, to: { map: 'paragon_lobby', x: 6, y: 8, dir: 'up' } },
    { kind: 'hearth', x: 2, y: 3, w: 6, h: 4, door: 3, to: { map: 'vantage_hearth', x: 5, y: 6, dir: 'up' } },
    { kind: 'mart', x: 9, y: 3, w: 5, h: 4, door: 2, to: { map: 'vantage_mart', x: 4, y: 6, dir: 'up' } },
    { kind: 'house', style: 'modern', x: 2, y: 15, w: 9, h: 6, door: 4, to: { map: 'vantage_hall4', x: 4, y: 4, dir: 'up' } },
    { kind: 'hall', style: 'skate', x: 24, y: 15, w: 10, h: 6, door: 5, to: { map: 'vantage_hall', x: 7, y: 15, dir: 'up' } },
    { kind: 'house', style: 'timber', x: 2, y: 25, w: 6, h: 4, door: 3, to: { map: 'vantage_furniture', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'flat', x: 9, y: 25, w: 5, h: 4, door: 2, to: { map: 'vantage_apt', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'brick', x: 22, y: 25, w: 5, h: 4, door: 2, to: { map: 'vantage_house2', x: 4, y: 4, dir: 'up' } },
    { kind: 'house', style: 'modern', x: 28, y: 25, w: 6, h: 4, door: 3, to: { map: 'vantage_ferry', x: 4, y: 4, dir: 'up' } },
  ],
  props: [
    { type: 'sign', x: 16, y: 2, text: 'VANTAGE CITY\nThe city that never stops.' },
    { type: 'sign', x: 25, y: 8, text: 'PARAGON ACADEMY\n"Want to be the next Champion? Paragon makes it possible."' },
    { type: 'sign', x: 31, y: 21, text: 'VANTAGE HALL\nHall Master: Zara\n"Ride the wind!"' },
    { type: 'sign', x: 8, y: 21, text: 'CIRCUIT HALL\nHall Master: Ivo\nCLOSED until further notice.' },
    { type: 'sign', x: 8, y: 29, text: 'HOMEWARD FURNISHINGS\nMake your house a home.' },
    { type: 'sign', x: 34, y: 29, text: 'VANTAGE FERRY TERMINAL\nFerries to the Sunward Keys.' },
    { type: 'sign', x: 20, y: 12, text: 'PARAGON FREE TRIAL DAY!\nBring your Wildmon. Leave with a champion.' },
    { type: 'trialpost', trial: 'skate', x: 11, y: 15, script: 'bhTrialPost' },
    { type: 'lamp', x: 16, y: 7 }, { type: 'lamp', x: 19, y: 7 }, { type: 'lamp', x: 16, y: 20 }, { type: 'lamp', x: 19, y: 20 },
    { type: 'lamp', x: 16, y: 25 }, { type: 'lamp', x: 19, y: 25 }, { type: 'lamp', x: 1, y: 11 }, { type: 'lamp', x: 34, y: 11 },
    { type: 'wildmon', sp: 'gibbolt', x: 34, y: 1, text: 'A Gibbolt is dangling from a lamp post, chewing a stolen sandwich.' },
  ],
  items: [
    { id: 'w1', x: 34, y: 14, item: 'skate_wheel', hidden: true },
    { id: 'w2', x: 1, y: 30, item: 'skate_wheel' },
    { id: 'h1', x: 1, y: 1, item: 'great_lantern', hidden: true },
  ],
  npcs: [
    { id: 'jaz', x: 13, y: 17, dir: 'down', look: 'skater2', name: 'Skater Jaz', script: 'bhJaz' },
    { id: 'dex', x: 14, y: 19, dir: 'left', look: 'skater', name: 'Coach Dex', script: 'bhDex' },
    { id: 'fan', x: 24, y: 9, dir: 'up', look: 'boy', move: 'turn', name: 'Paragon Fan', talk: ['One day I will be a Paragon cadet. They get silver Lanterns and everything!', 'The founder never takes off the mask. Isn\'t that SO cool?'] },
    { id: 'gran', x: 10, y: 21, dir: 'left', look: 'tilly', name: 'Worried Gran', talk: ['My grandson Ivo runs the Circuit Hall. Or he did.', 'He went to Paragon for a "masterclass" a month ago and has not come home since. The Hall has been shut ever since.'] },
    { id: 'commuter', x: 22, y: 11, dir: 'left', look: 'villager', move: 'wander', name: 'Commuter', talk: ['Ferries to the Sunward Keys stopped last week. Something about the reefs going grey.', 'Grey reefs. Grey Wildmon. Am I the only one who finds that odd?'] },
    { id: 'kid', x: 4, y: 13, dir: 'down', look: 'pip', move: 'wander', name: 'Kid', talk: ['Gibbolt stole my ice lolly! It went up that lamp post!'] },
    { id: 'skye_v', x: 27, y: 9, dir: 'up', look: 'skye', name: 'Skye', script: 'bhSkyeVantage', cond: (g) => !g.flags.paragon_lobby },
  ],
};
DATA.restPoints.vantage = { map: 'vantage_hearth', x: 4, y: 4, dir: 'up', text: 'Hearthkeeper Opal: All rested! Vantage City never sleeps, but your Wildmon should.' };
DATA.maps.vantage_hearth = Object.assign({}, DATA.maps.stock_hearth, {
  name: 'Vantage Hearthhouse', region: 'vantage',
  warps: [5, 6].map((x) => ({ x, y: 7, to: { map: 'vantage', x: 5, y: 7, dir: 'down' } })),
  npcs: [
    { id: 'nurse', x: 4, y: 2, dir: 'down', look: 'nurse', script: 'bhNurse3' },
    { id: 'trav', x: 9, y: 5, dir: 'left', look: 'hiker', move: 'wander', name: 'Traveller', talk: ['I got stuck here when the ferries stopped. Lovely city. Very loud.'] },
  ],
});
DATA.maps.vantage_mart = Object.assign({}, DATA.maps.stock_mart, {
  name: 'Vantage Mart', region: 'vantage',
  warps: [4, 5].map((x) => ({ x, y: 7, to: { map: 'vantage', x: 11, y: 7, dir: 'down' } })),
  npcs: [
    { id: 'clerk', x: 1, y: 2, dir: 'down', look: 'clerk', script: 'bhClerk3' },
    { id: 'shopper', x: 7, y: 4, dir: 'up', look: 'villager2', move: 'wander', name: 'Shopper', talk: ['Paragon cadets come in and buy every Revive on the shelf. Every single one.'] },
  ],
});
const vHouse = (name, to, npcs, tileText) => Object.assign(bhHouse(name, to, npcs, tileText), { region: 'vantage' });
DATA.maps.vantage_hall4 = vHouse('Circuit Hall', { map: 'vantage', x: 6, y: 21, dir: 'down' }, [
  { id: 'rec', x: 4, y: 2, dir: 'down', look: 'clerk', name: 'Hall Clerk', talk: ['Sorry, the Circuit Hall is closed. Hall Master Ivo is away at Paragon Academy.', 'He said it was a masterclass. That was a month ago. He has not answered a single letter.'] },
]);
DATA.maps.vantage_furniture = vHouse('Homeward Furnishings', { map: 'vantage', x: 5, y: 29, dir: 'down' }, [
  { id: 'fclerk', x: 2, y: 3, dir: 'right', look: 'villager2', name: 'Shop Owner', talk: ['Welcome to Homeward Furnishings! Beds, rugs, lamps, everything for your room.', "We're still unpacking the new range. Come back soon, and start saving your Cr!"] },
]);
DATA.maps.vantage_apt = vHouse('Apartment', { map: 'vantage', x: 11, y: 29, dir: 'down' }, [
  { id: 'resident', x: 7, y: 2, dir: 'down', look: 'student', name: 'Student', talk: ['I study Wildmon at the city college. Did you know Gibbolt only steal things that shine?', 'My notes say a Paragon Lantern shines silver. Funny how the Gibbolt never go near them.'] },
]);
DATA.maps.vantage_house2 = vHouse('Brick House', { map: 'vantage', x: 24, y: 29, dir: 'down' }, [
  { id: 'mumv', x: 3, y: 3, dir: 'right', look: 'mum', name: 'Neighbour', talk: ['My son wants to join Paragon. Says his Rooftik is "holding him back".', 'Holding him back! That Rooftik sleeps on his pillow every night.'] },
]);
DATA.maps.vantage_ferry = vHouse('Ferry Terminal', { map: 'vantage', x: 31, y: 29, dir: 'down' }, [
  { id: 'ferryclerk', x: 2, y: 3, dir: 'right', look: 'sailor', name: 'Ferry Clerk', talk: ['All ferries to the Sunward Keys are suspended. Sorry!', 'The reef Wildmon have gone grey and nobody knows why. The Rangers have closed the harbour until they find out.'] },
]);

/* ---------- Paragon Academy ---------- */
DATA.maps.paragon_lobby = {
  name: 'Paragon Academy', region: 'vantage', music: 'indoor', outdoor: false,
  rows: ['WWWWWWWWWWWWWW', 'WIIWWWUUWWWIIW', 'KKKKKKKKKKKKKK', 'KJKKKKKKKKKKJK', 'KKKKKKKKKKKKKK', 'CCCCKKKKKKKKKK', 'KKKKKKKKKKKKKK', 'pKKKKKKKKKKKKp', 'KKKKKKKKKKKKKK', 'KKKKKKmmKKKKKK'],
  warps: [6, 7].map((x) => ({ x, y: 9, to: { map: 'vantage', x: 27, y: 8, dir: 'down' } })),
  tileText: { '1,3': 'A golden statue of a Wildmon mid-leap. The plaque reads: STRENGTH IS EVERYTHING.', '12,3': 'A golden statue of a trainer holding a silver Lantern high. There is no name on the plaque.', '1,1': 'Through the glass, cadets drill in perfect rows. Their Wildmon move in perfect silence.', '2,1': 'Through the glass, cadets drill in perfect rows. Their Wildmon move in perfect silence.', '11,1': 'A trophy wall. Every trophy is new. Not one has a scratch.', '12,1': 'A trophy wall. Every trophy is new. Not one has a scratch.' },
  npcs: [
    { id: 'reception', x: 1, y: 4, dir: 'down', look: 'paragon', name: 'Receptionist', script: 'bhReception' },
    { id: 'guard1', x: 6, y: 2, dir: 'down', look: 'cadet', name: 'Cadet', script: 'bhCadetGuard' },
    { id: 'guard2', x: 7, y: 2, dir: 'down', look: 'cadet2', name: 'Cadet', script: 'bhCadetGuard' },
    { id: 'trialee', x: 10, y: 6, dir: 'left', look: 'boy', name: 'Trial Day Hopeful', talk: ['I came for the free trial day! They took my Yipper "for assessment" an hour ago.', 'I am sure it is fine. They are the best. Everybody says so.'] },
  ],
};
DATA.mapEnter.paragon_lobby = () => { if (!G.flags.paragon_lobby) Script.run(DATA.scripts.bhParagonLobby); };

function renderAcademy(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = Math.floor(W / 2), wy = 26;
  p.r('#b8902a', 0, 10, W, 4); p.r('#e8c040', 2, 6, W - 4, 5); p.r('#fff0a0', 2, 6, W - 4, 1);
  for (let y = 0; y < 16; y++) { const w = Math.round(10 + y * 3); p.r(y < 1 ? '#b8902a' : '#f4f4f0', cx - w, y + 2, w * 2, 1); p.r('#d8a030', cx - w, y + 2, 2, 1); p.r('#d8a030', cx + w - 2, y + 2, 2, 1); }
  p.r('#d8a030', cx - 6, 7, 12, 10); p.r('#f4f4f0', cx - 5, 8, 10, 8);
  for (const [x, y] of [[-2, 0], [-2, 1], [-2, 2], [-2, 3], [-2, 4], [-2, 5], [-2, 6], [-1, 0], [0, 0], [1, 1], [1, 2], [0, 3], [-1, 3]]) p.r('#b8bcc8', cx + x, 9 + y, 1, 1);
  p.r('#f4f4f0', 0, wy - 8, W, H - wy + 5); p.r('#d8d8d0', 0, wy - 8, W, 2); p.r('#d8a030', 0, wy - 6, W, 2);
  for (let x = 6; x < W - 6; x += 22) { p.r('#e8e8e0', x, wy - 4, 8, H - wy - 1); p.r('#ffffff', x + 1, wy - 4, 2, H - wy - 1); p.r('#c8c8c0', x + 7, wy - 4, 1, H - wy - 1); p.r('#d8a030', x - 1, wy - 4, 10, 2); }
  for (let x = 15; x < W - 12; x += 22) { if (Math.abs(x + 4 - cx) < 16) continue; p.r('#2a3a5a', x - 1, wy + 2, 12, 22); p.r('#7ab8e0', x, wy + 3, 10, 20); p.r('#c8e8ff', x, wy + 3, 3, 20); p.r('#2a3a5a', x, wy + 12, 10, 1); windows.push({ x: x + 5, y: wy + 12, r: 16, rect: [x, wy + 3, 10, 20] }); }
  const dx = b.door * TS; p.r('#d8a030', dx - 5, H - 30, 26, 27); p.r('#2a3a5a', dx - 3, H - 28, 22, 25); p.r('#7ab8e0', dx - 2, H - 27, 9, 24); p.r('#7ab8e0', dx + 9, H - 27, 9, 24); p.r('#c8e8ff', dx - 2, H - 27, 2, 24);
  windows.push({ x: dx + 8, y: H - 14, r: 18 });
  for (const x of [dx - 14, dx + 26]) { p.r('#3a3a44', x, 4, 2, wy - 8); p.r('#f4f4f0', x + 2, 5, 8, 6); p.r('#d8a030', x + 4, 7, 4, 2); }
  p.r('#b8b4ac', 0, H - 3, W, 3); p.r('#d8d4cc', 0, H - 3, W, 1);
  return { img: c, windows };
}
function renderSkateHall(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = W / 2, wy = 40;
  for (let y = 0; y < wy; y++) { const k = (wy - y) / wy; const w = Math.round(Math.sqrt(Math.max(0, 1 - k * k * 0.92)) * (W / 2 - 1)); p.r(y % 6 < 3 ? '#5ab8e8' : '#3a98c8', cx - w, y, w * 2, 1); p.r('#1a4a6a', cx - w, y, 1, 1); p.r('#1a4a6a', cx + w - 1, y, 1, 1); }
  p.r('#f0f0e8', cx - 30, 14, 60, 2); p.r('#e8742a', cx - 24, 22, 48, 2);
  p.r('#3a3a4a', 0, wy, W, H - wy - 3); p.r('#4a4a5a', 0, wy, W, 2);
  const tags = [['#e84a6a', 6], ['#7ad050', 30], ['#e8c040', W - 40], ['#c87ae8', W - 20]];
  for (const [col, x] of tags) { p.r(col, x, wy + 6, 10, 3); p.r(col, x + 2, wy + 9, 3, 6); p.r(shade(col, 0.3), x + 6, wy + 10, 5, 2); }
  for (const x of [20, W - 32]) { p.r('#1a1a24', x - 1, wy + 4, 14, 12); p.r('#7ab8e0', x, wy + 5, 12, 10); p.r('#c8e8ff', x, wy + 5, 4, 10); windows.push({ x: x + 6, y: wy + 10, r: 15, rect: [x, wy + 5, 12, 10] }); }
  const dx = b.door * TS; p.r('#1a1a24', dx - 2, H - 26, 20, 23); p.r('#e8742a', dx - 1, H - 25, 18, 2); p.r('#2a2a34', dx, H - 23, 16, 20); for (let y = H - 21; y < H - 4; y += 3) p.r('#3a3a48', dx, y, 16, 1);
  p.r('#ffd890', dx + 3, H - 8, 10, 4); windows.push({ x: dx + 8, y: H - 8, r: 14 });
  p.r('#7a7a84', 0, H - 3, W, 3); p.r('#9a9aa4', 0, H - 3, W, 1);
  return { img: c, windows };
}
{
  const rb = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind === 'academy') return renderAcademy(b);
    if (b.kind === 'hall' && b.style === 'skate') return renderSkateHall(b);
    return rb(b);
  };
}

/* ---------- Vantage Hall: the ramp park ---------- */
DATA.maps.vantage_hall = {
  name: 'Vantage Hall', region: 'vantage', music: 'hall', outdoor: false, ramps: true,
  rows: [
    'WWWWWWWWWWWWWWW',
    'WJWWWWWWWWWWWJW',
    '¦·············¦',
    '¦·····¦·¦·····¦',
    '¦:¦¦¦:¦^¦:¦¦¦:¦',
    '¦:¦···¦^¦···¦:¦',
    '¦:¦·¦¦¦^¦¦¦·¦:¦',
    '¦···<<<^>>>···¦',
    '¦¦¦:¦¦¦^¦¦¦:¦¦¦',
    '¦···:··^··:···¦',
    '¦·¦¦¦:¦<¦:¦¦¦·¦',
    '¦·····¦·¦·····¦',
    '¦:¦¦¦¦¦¦¦¦¦·¦:¦',
    '¦·············¦',
    '¦¦¦····¦····¦¦¦',
    '¦·············¦',
    '¦¦¦¦¦¦mmm¦¦¦¦¦¦',
  ],
  warps: [6, 7, 8].map((x) => ({ x, y: 16, to: { map: 'vantage', x: 29, y: 21, dir: 'down' } })),
  npcs: [
    { id: 'zara', x: 7, y: 2, dir: 'down', look: 'zara', script: 'bhZara', name: 'Zara' },
    { id: 'rio', x: 12, y: 13, dir: 'left', look: 'skater', trainer: 'rio', sight: 1, name: 'Skater Rio' },
    { id: 'pia', x: 9, y: 11, dir: 'right', look: 'skater2', trainer: 'pia', sight: 1, name: 'Skater Pia' },
    { id: 'guide', x: 10, y: 15, dir: 'left', look: 'clerk', script: 'bhHallGuide3', name: 'Hall Guide' },
  ],
};

/* ---------- Badge 3 ---------- */
Object.assign(BH_BADGES[2], { id: 'updraft', name: 'Updraft Badge', hall: 'Vantage Hall', town: 'Vantage City', master: 'Zara', type: 'air', shape: 'hex', c1: '#5ab8e8', c2: '#f4fbff' });
DATA.badges.updraft = { name: 'Updraft Badge', hall: 'Vantage Hall', town: 'Vantage City', master: 'Zara' };
{
  const cv = BadgeArt.canvas.bind(BadgeArt);
  BadgeArt.canvas = function (b, earned) {
    const fresh = !this.cache.has(b.id + (earned ? 1 : 0)); const c = cv(b, earned);
    if (fresh && earned && b.id === 'updraft') {
      const x = c.getContext('2d'); x.fillStyle = '#2a7ab8';
      for (const [i, j] of [[5, 10], [6, 9], [7, 8], [8, 8], [9, 9], [10, 8], [11, 8], [12, 9], [13, 10], [6, 11], [7, 10], [11, 10], [12, 11], [9, 10], [9, 11]]) x.fillRect(i, j, 1, 1);
    }
    return c;
  };
}

/* ---------- Trial 3: Vantage Skate Trial ---------- */
DATA.trials.skate = { name: 'Vantage Skate Trial', where: 'Vantage City', host: 'Coach Dex', gold: 14, silver: 22,
  desc: 'Grab all six rings in the skate park as fast as you can. You need a skateboard.',
  rewards: [null, ['great_lantern', 3], ['hyper_potion', 2], ['rare_candy', 1]] };
DATA.maps.skate_park = {
  name: 'Vantage Skate Park', region: 'vantage', music: 'vantage', outdoor: true, border: '¦', ramps: true,
  rows: [
    '¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦',
    '¦··················¦',
    '¦·¦¦¦¦¦·····¦¦¦¦¦¦·¦',
    '¦·¦···<<<<<········¦',
    '¦·¦·¦¦¦¦·¦¦¦¦¦···¦·¦',
    '¦^¦··········¦·:·¦·¦',
    '¦^¦·¦¦¦¦¦¦¦¦·¦·:·¦·¦',
    '¦^¦··········¦·:·¦·¦',
    '¦·¦¦¦¦¦·¦¦¦¦·¦¦¦¦¦·¦',
    '¦··········>>>>>···¦',
    '¦·¦¦¦¦¦¦¦·¦¦¦¦¦¦¦¦·¦',
    '¦··················¦',
    '¦¦¦¦¦¦¦¦¦··¦¦¦¦¦¦¦¦¦',
  ],
  rings: [[3, 3], [16, 3], [9, 5], [14, 7], [1, 9], [18, 11]],
  warps: [9, 10].map((x) => ({ x, y: 12, to: { map: 'vantage', x: 14, y: 20, dir: 'down' } })),
  npcs: [],
};
DATA.mapEnter.skate_park = () => {
  if (!Trials.run || Trials.run.id !== 'skate') return;
  Trials.run.t0 = performance.now();
  clearInterval(Trials.tick); Trials.tick = setInterval(() => {
    if (!Trials.run || Trials.run.id !== 'skate') { clearInterval(Trials.tick); UI.trialHud(null); return; }
    const t = ((Trials.run.done || performance.now()) - Trials.run.t0) / 1000;
    UI.trialHud(`Rings: ${Trials.run.got.size}/6   Time: ${t.toFixed(1)}s   Gold: ${DATA.trials.skate.gold}s`);
  }, 100);
};
{
  const load0 = World.load.bind(World);
  World.load = function (id) { load0(id); if (id !== 'skate_park' && Trials.run && Trials.run.id === 'skate') { Trials.run = null; clearInterval(Trials.tick); UI.trialHud(null); } };
}

/* ---------- Scripts ---------- */
Object.assign(DATA.scripts, {
  async bhNurse3(s) {
    const o = { name: 'Hearthkeeper Opal' };
    s.setRestPoint('vantage');
    const yes = await s.ask('Welcome to the Vantage Hearthhouse! Shall I rest your Wildmon?', ['Yes', 'No'], o);
    if (yes !== 0) return s.say('Come back any time. We never close.', o);
    await s.say('Let them rest by the fire...', o); await s.healParty(); await s.wait(900);
    await s.say(['All better! Vantage City never sleeps, but your Wildmon should.'], o);
  },
  async bhClerk3(s) {
    return UI.shop(DATA.shops.vantage, s.flag('greet_vmart') ? 'Welcome back!' : (s.set('greet_vmart'), 'Welcome to Vantage Mart, the biggest Mart in Brightholm!'));
  },
  async bhSkyeVantage(s) {
    const o = { name: 'Skye' };
    await s.say(['{player}! Look at it! Paragon Academy!', 'They are doing a free trial day RIGHT NOW. Come inside with me!'], o);
  },
  async bhParagonLobby(s) {
    s.set('paragon_lobby');
    const sky = { name: 'Skye' }, rec = { name: 'Receptionist' }, f = { name: 'The Founder' };
    const p = Game.player;
    s.spawn({ id: 'skye_l', x: p.x + 1, y: p.y, dir: 'up', look: 'skye', name: 'Skye' });
    await s.say(['Welcome to Paragon Academy, future champions!', 'You are just in time. The Founder is about to speak.'], rec);
    Sound.sfx('door'); await s.wait(400);
    s.spawn({ id: 'founder', x: 6, y: 1, dir: 'down', look: 'founder', name: 'The Founder' });
    await s.emote('skye_l', '!');
    await s.say(['...'], f);
    await s.say(['Look at you all. Hopeful. Talented. Loved by your Wildmon.', 'None of that will ever be enough.', 'I once watched a trainer with talent and love lose everything in one battle. Lose it to someone who was simply... luckier.',
      'Luck runs out. Power does not. Here, we make Wildmon that never tire, never fear, never hold you back.', 'Talent is not enough. Love is not enough. Only POWER wins titles.'], f);
    await s.say(['The silver mask turns towards you. For a moment it stays very still.', 'Then the Founder turns and is gone.'], { sign: true });
    s.remove('founder');
    await s.say(['Did you HEAR that? Only power wins titles!', "I'm signing up for the trial day. Just to see. If they can make my team stronger, maybe I can finally beat you. Maybe I can beat the Champion!"], sky);
    const c = await s.ask("You'll come too, right?", ['Something feels wrong', 'Be careful, Skye'], sky);
    await s.say(c === 0 ? ['Wrong? Come on, {player}. You always worry too much.', "It's just a trial day. I'll be fine."] : ["Careful? I'm always careful! Well. Sometimes."], sky);
    await s.say(['Go and get your Badge from Zara at the Vantage Hall. I will tell you all about it after!'], sky);
    await s.walk('skye_l', 'UUUU', 2); s.remove('skye_l');
    await s.say(['Your new friend is very wise. Our trial places fill up so quickly!'], rec);
  },
  async bhReception(s) {
    const o = { name: 'Receptionist' };
    await s.say(['Welcome to Paragon Academy! Membership is by invitation, after a successful trial.', 'You have such a promising aura. I am sure we will be seeing a lot more of you.'], o);
  },
  async bhCadetGuard(s) {
    await s.say(['The upper floors are for members only.', 'The Founder does not receive visitors.'], { name: 'Cadet' });
  },
  async bhJaz(s) {
    const o = { name: 'Skater Jaz' };
    const q = s.quest('wheels');
    if (s.has('skateboard')) return s.say(['How is the board riding? Use it from your Bag to hop on and off.', 'Coach Dex runs the Skate Trial. Go and show him what you have got!'], o);
    if (!q) {
      await s.say(['Ugh. My old board lost all its wheels when a Gibbolt stole it off the rack.', 'It dropped them all over the place. One rolled off up the pass, one went who knows where in the city, and one... somewhere by the trees.']);
      const c = await s.ask('Find my three wheels and the old board is yours. I have a new one anyway. Deal?', ['Deal!', 'Maybe later'], o);
      if (c !== 0) return s.say('No worries. The wheels are not going anywhere. Probably.', o);
      await s.startQuest('wheels');
      return s.say(['Bright orange, you cannot miss them. Well. You can, a bit. Look carefully!'], o);
    }
    const n = s.count('skate_wheel');
    if (n < 3) return s.say([`You have found ${n} of 3. Keep looking! One rolled up the pass, one is in the city, one is by the trees.`], o);
    s.take('skate_wheel', 3);
    await s.say(['My wheels! You found all three!', 'Give me a sec...'], o);
    await Game.fadeOut(250); Sound.sfx('confirm'); await s.wait(500); await Game.fadeIn(250);
    await s.say(['Good as new. She is all yours!'], o);
    await s.give('skateboard');
    await s.completeQuest('wheels');
    await s.say(['Use it from your Bag to hop on. Outdoors you will zoom. Indoors, carry it like a sensible person.', 'Coach Dex runs the Vantage Skate Trial over there. Give it a go!'], o);
  },
  async bhDex(s) {
    const o = { name: 'Coach Dex' }; G.flags.trial_seen_skate = 1;
    if (!s.has('skateboard')) return s.say(['I run the Vantage Skate Trial. Six rings, one skate park, beat the clock.', 'Come back when you have got a board. Jaz might help you out there.'], o);
    const best = Trials.best('skate'), tr = DATA.trials.skate;
    const c = await s.ask(`The Skate Trial! Grab all six rings as fast as you can. Gold under ${tr.gold} seconds, Silver under ${tr.silver}.${best ? ` Your best: ${MEDALS[best].name}.` : ''}`, ['Drop in!', 'Not now'], o);
    if (c !== 0) return s.say('The park is always open.', o);
    await s.say(['Ramps carry you whichever way the arrows point. Use them, or they will use you!', 'Clock starts when you roll in. Go!'], o);
    G.skate = true; Trials.run = { id: 'skate', got: new Set() };
    await Game.warpTo({ map: 'skate_park', x: 9, y: 11, dir: 'up' });
  },
  async bhSkateDone(s) {
    const run = Trials.run; const t = (run.done - run.t0) / 1000; const tr = DATA.trials.skate; const o = { name: 'Coach Dex' };
    clearInterval(Trials.tick); UI.trialHud(`Rings: 6/6   Time: ${t.toFixed(1)}s`);
    await s.say([`All six rings! ${t.toFixed(1)} seconds!`], o);
    Trials.run = null; UI.trialHud(null);
    await Trials.award(s, 'skate', t <= tr.gold ? 3 : t <= tr.silver ? 2 : 1, 'Coach Dex');
    await Game.warpTo({ map: 'vantage', x: 14, y: 20, dir: 'down' });
  },
  async bhHallGuide3(s) {
    const o = { name: 'Hall Guide' };
    await s.say(['Welcome to Vantage Hall! Zara rides Air-type Wildmon.', 'Electric, Rock and Ice moves knock fliers out of the sky. Grass and Fighting moves barely tickle them.', 'The ramps carry you where the arrows point. Find the line that takes you up to Zara!'], o);
    if (G.party.length && await s.ask('Shall I patch up your team?', ['Yes please', 'No thanks'], o) === 0) { await s.healParty(); await s.say('All set. Ride safe!', o); }
  },
  async bhZara(s) {
    const o = { name: 'Zara' };
    if (s.flag('beat_zara')) return s.say(['Keep riding, keep falling, keep getting back up. That is all skating is. That is all battling is too.', 'Hey. Your friend Skye went into Paragon this morning. Has not come out yet. Just saying.'], o);
    await s.say(['Yo! You made it up the ramps. Not bad for a first run!', 'I am Zara. I run this Hall, and I skate the city every night. My Wildmon fly beside me.',
      'Paragon offered me a "masterclass". Ivo took theirs, and look where it got him.', 'Me? I win my own way. Let us see yours!'], o);
    const res = await bossBattle(s, 'zara');
    if (res !== 'win') return;
    await s.say(['Sick run! You totally stuck the landing.', 'The Updraft Badge. You earned it.'], o);
    await s.badge('updraft');
    await s.say(['Take this too. A Move Scroll for Gale Burst. Big wind, big damage.'], o);
    await s.give('scroll_galeburst');
    await s.say(['Three Badges. Next is the Circuit Hall, if Ivo ever comes back.', 'Hey. Your friend Skye went into Paragon this morning. Has not come out yet. Just saying.'], o);
  },
});
DATA.quests.wheels = {
  name: 'Wheels Wanted', kind: 'side', giver: 'Skater Jaz',
  stages: ['Find three Skate Wheels for Jaz: one up Shalebrook Pass, one in Vantage City and one by the trees. Then bring them to the Vantage skate park.'],
  reward: 'Skateboard',
};
