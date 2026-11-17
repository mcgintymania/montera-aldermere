'use strict';
/* =====================================================================
   ACT I SYSTEMS — world features for Act I
   Hedge gates + floor switches, Brush Hook cutting, sliding currents,
   Hall buildings, overworld Wildmon, dim interiors, Calm Incense,
   Hearthhouse rest points everywhere, Badges.
   ===================================================================== */

/* ---------- Sounds ---------- */
Object.assign(SFX, {
  badge: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.16], [988, 0.08], [1047, 0.08], [1319, 0.4]],
  cut: [[900, 0.03, 'sawtooth', 0.12, 300], [500, 0.06, 'square', 0.1, 200]],
  switch: [[300, 0.04, 'square', 0.18], [600, 0.08, 'triangle', 0.3]],
  slide: [[500, 0.08, 'triangle', 0.25, 800]],
});

const HALL_FLOOR = (p, a, b, c) => {
  p.r(a, 0, 0, 16, 16); p.r(b, 0, 0, 16, 1); p.r(b, 0, 0, 1, 16); p.r(c, 15, 0, 1, 16); p.r(c, 0, 15, 16, 1);
  p.r(b, 7, 7, 2, 2); p.r(shade(a, 0.12), 2, 2, 3, 1);
};
const CURRENT = (p, f, dx, dy) => {
  p.r('#4aa0e0', 0, 0, 16, 16);
  for (let i = 0; i < 3; i++) { const o = (f * 2 + i * 6) % 16; if (dx) p.r('#8ad0f8', (dx > 0 ? o : 15 - o), 3 + i * 5, 3, 1); else p.r('#8ad0f8', 3 + i * 5, (dy > 0 ? o : 15 - o), 1, 3); }
  const ax = 8, ay = 8; p.r('#e8f8ff', ax - 1, ay - 1, 2, 2);
  if (dx) { p.r('#e8f8ff', ax + dx * 2, ay - 1, 1, 2); p.r('#e8f8ff', ax - dx * 2, ay - 3, 1, 1); p.r('#e8f8ff', ax - dx * 2, ay + 2, 1, 1); p.r('#e8f8ff', ax - dx, ay - 2, 1, 1); p.r('#e8f8ff', ax - dx, ay + 1, 1, 1); }
  else { p.r('#e8f8ff', ax - 1, ay + dy * 2, 2, 1); p.r('#e8f8ff', ax - 3, ay - dy * 2, 1, 1); p.r('#e8f8ff', ax + 2, ay - dy * 2, 1, 1); p.r('#e8f8ff', ax - 2, ay - dy, 1, 1); p.r('#e8f8ff', ax + 1, ay - dy, 1, 1); }
  p.r('#3a88c8', 0, 0, 16, 1); p.r('#3a88c8', 0, 15, 16, 1);
};
Object.assign(TILE_DRAW, {
  gate(p, f, v) {
    p.r('#4a7a3a', 0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < 16; x += 4) { p.r('#2f5a2a', x, y, 3, 3); p.r('#6aa050', x, y, 2, 1); }
    p.r('#7a5030', 0, 13, 16, 3); p.r('#a07040', 0, 13, 16, 1);
    p.r('#e85a8a', 4, 5); p.r('#e85a8a', 11, 9); p.r('#fff0f0', 4, 4);
  },
  gateopen(p) { HALL_FLOOR(p, '#9ab878', '#b4d090', '#7a9858'); p.r('#7a5030', 1, 12, 3, 3); p.r('#7a5030', 12, 12, 3, 3); p.r('#a07040', 1, 12, 3, 1); p.r('#a07040', 12, 12, 3, 1); },
  plate(p) { HALL_FLOOR(p, '#9ab878', '#b4d090', '#7a9858'); p.r('#5a5a64', 3, 3, 10, 10); p.r('#c84a3a', 4, 4, 8, 7); p.r('#e8705a', 4, 4, 8, 2); p.r('#8a2a20', 4, 11, 8, 1); },
  plateon(p) { HALL_FLOOR(p, '#9ab878', '#b4d090', '#7a9858'); p.r('#5a5a64', 3, 3, 10, 10); p.r('#3aa860', 4, 6, 8, 6); p.r('#5ac880', 4, 6, 8, 1); },
  cur_u(p, f) { CURRENT(p, f, 0, -1); }, cur_d(p, f) { CURRENT(p, f, 0, 1); }, cur_l(p, f) { CURRENT(p, f, -1, 0); }, cur_r(p, f) { CURRENT(p, f, 1, 0); },
  stairs(p) {
    p.r('#5a4a3a', 0, 0, 16, 16);
    for (let i = 0; i < 4; i++) { p.r(shade('#a89070', -i * 0.12), 0, i * 4, 16, 3); p.r('#3a2a1a', 0, i * 4 + 3, 16, 1); }
  },
  cavefloor(p, f, v) {
    p.r('#6a6458', 0, 0, 16, 16); const R = mulberry(v * 19 + 5);
    for (let i = 0; i < 10; i++) p.r(i % 2 ? '#5a5448' : '#7a7466', Math.floor(R() * 16), Math.floor(R() * 16), 2, 1);
    if (v === 2) { p.r('#3a6a8a', 5, 9, 5, 2); p.r('#5a8aaa', 6, 9, 2, 1); }
  },
  cavewall(p, f, v) {
    p.r('#3a342c', 0, 0, 16, 16); p.r('#4e463a', 1, 1, 14, 9); p.r('#5e5446', 2, 2, 6, 3); p.r('#2a241e', 0, 12, 16, 4);
    if (v % 2) { p.r('#2a241e', 9, 3, 1, 6); p.r('#2a241e', 10, 8, 3, 1); }
    p.r('#3a6a50', 3 + v, 11, 3, 1);
  },
  hallgreen(p) { HALL_FLOOR(p, '#9ab878', '#b4d090', '#7a9858'); },
  hallblue(p) { HALL_FLOOR(p, '#8ab0c8', '#a8c8e0', '#6a90a8'); },
  statue(p) {
    HALL_FLOOR(p, '#b8b0a0', '#d0c8b8', '#988f80');
    p.r('#6a6a74', 3, 11, 10, 4); p.r('#8a8a94', 4, 11, 8, 1);
    p.ell('#8a8a94', 8, 7, 5, 4.5); p.ell('#a8a8b4', 7, 6, 3, 2.5); p.r('#5a5a64', 5, 2, 2, 3); p.r('#5a5a64', 9, 2, 2, 3);
  },
  crate(p) {
    p.r('#6a6458', 0, 0, 16, 16);
    p.r('#5a3a1a', 1, 2, 14, 13); p.r('#9a6a3a', 2, 3, 12, 11); p.r('#7a4a2a', 2, 8, 12, 1); p.r('#7a4a2a', 7, 3, 1, 11);
    p.r('#8a8a94', 9, 4, 3, 3); p.r('#c8c8d0', 10, 5, 1, 1);
  },
});
Object.assign(TILE_FRAMES, { cur_u: 8, cur_d: 8, cur_l: 8, cur_r: 8 });
Object.assign(TILE_VARIANTS, { cavefloor: 4, cavewall: 2 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name.startsWith('cur_')) f = Math.floor(Game.t * 8); return gt(name, f, v); };
}

/* ---------- Dynamic map state ---------- */
const FieldState = {
  gateKey() { return 'gates_' + World.id; },
  gatesOn() { return !!G.flags[this.gateKey()]; },
};
{
  const origCh = World.ch.bind(World);
  World.ch = function (x, y) {
    const c = origCh(x, y);
    if (c === 'b' && this.cut && this.cut.has(x + ',' + y)) return '.';
    if (c === 'g') return FieldState.gatesOn() ? 'q' : 'g';
    if (c === 'G') return FieldState.gatesOn() ? 'G' : 'q';
    if (c === 'o') return FieldState.gatesOn() ? '0' : 'o';
    return c;
  };
  const origLoad = World.load.bind(World);
  World.load = function (id) {
    origLoad(id);
    this.cut = new Set();
    this.props = this.props.filter((p) => !p.cond || p.cond(G));
  };
}

/* ---------- Buildings: Halls and the Sunken Lighthouse ---------- */
const HALL_THEME = {
  bloom: { roof: '#4a8a3a', wall: '#e4dcc4', trim: '#6a5a3a', light: '#c8f080', banner: '#5ab048' },
  tide: { roof: '#3a6aa8', wall: '#dde4ea', trim: '#4a5a6a', light: '#a0e0ff', banner: '#3a8ad0' },
};
{
  const origRB = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind === 'hall') return renderHall(b);
    if (b.kind === 'sunken') return renderSunken(b);
    return origRB(b);
  };
}
function renderHall(b) {
  const th = HALL_THEME[b.theme] || HALL_THEME.bloom;
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = Math.floor(W / 2);
  // tower
  const tw = 20, tx = cx - tw / 2;
  p.r(shade(th.wall, -0.35), tx - 1, 6, tw + 2, 30);
  for (let y = 8; y < 36; y++) p.r(Math.floor(y / 6) % 2 ? th.wall : shade(th.wall, -0.08), tx, y, tw, 1);
  p.r('#3a3a44', tx - 2, 6, tw + 4, 2); p.r('#5a5a64', cx - 6, 0, 12, 7); p.r(th.light, cx - 5, 1, 10, 5); p.r('#ffffff', cx - 2, 2, 3, 2);
  p.r(th.roof, cx - 7, -1, 14, 2);
  windows.push({ x: cx, y: 3, r: 28 });
  // main hall
  const top = 30, roofH = 12;
  p.r(shade(th.roof, -0.45), 0, top, W, roofH + 1); p.r(th.roof, 1, top, W - 2, roofH - 1);
  for (let y = top + 3; y < top + roofH - 1; y += 3) p.r(shade(th.roof, -0.2), 1, y, W - 2, 1);
  p.r(shade(th.roof, 0.3), 1, top, W - 2, 1);
  const wy = top + roofH;
  p.r(th.wall, 0, wy, W, H - wy); p.r(shade(th.wall, -0.3), 0, wy, 1, H - wy); p.r(shade(th.wall, -0.3), W - 1, wy, 1, H - wy);
  for (let y = wy + 4; y < H - 3; y += 5) p.r(shade(th.wall, -0.07), 0, y, W, 1);
  p.r(th.trim, 0, H - 3, W, 3);
  // columns + banners
  for (const x of [6, W - 10]) { p.r(shade(th.wall, 0.25), x, wy, 4, H - wy - 3); p.r(shade(th.wall, -0.2), x + 3, wy, 1, H - wy - 3); }
  for (const x of [14, W - 20]) { if (x < 12 || x > W - 18) continue; p.r(th.banner, x, wy + 2, 6, 10); p.r(shade(th.banner, -0.3), x, wy + 11, 6, 1); p.r('#fff4c0', x + 2, wy + 5, 2, 2); }
  // door
  const dx = b.door * TS;
  p.r('#2a2a32', dx + 1, H - 18, 14, 15); p.r(shade(th.trim, -0.2), dx + 2, H - 17, 12, 14); p.r(th.light, dx + 3, H - 16, 10, 3);
  p.r('#1a1a20', dx + 7, H - 12, 2, 9);
  windows.push({ x: dx + 8, y: H - 14, r: 16 });
  return { img: c, windows };
}
function renderSunken(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
  p.r('#5a5a52', 2, H - 6, W - 4, 6); p.r('#7a786a', 3, H - 6, W - 6, 2);
  for (let y = 14; y < H - 6; y++) {
    const w = W - 10 + Math.round((y - 14) * 0.1), x = Math.round((W - w) / 2 + (H - y) * 0.06);
    p.r(Math.floor((y - 14) / 9) % 2 ? '#8a5a52' : '#b8b0a0', x, y, w, 1); p.r('rgba(0,0,0,0.18)', x + w - 3, y, 3, 1);
  }
  p.r('#2a2a2a', 10, 24, 2, 9); p.r('#2a2a2a', 11, 32, 3, 1); p.r('#2a2a2a', 20, 40, 1, 7);
  p.r('#3a3a40', 7, 8, 18, 7); p.r('#1e1e24', 9, 9, 14, 5); p.r('#3a3a40', 6, 6, 20, 2);
  for (let x = 8; x < 25; x += 4) p.r('#3a3a40', x, 2, 1, 4);
  p.r('#4a6a3a', 4, H - 8, 6, 2); p.r('#4a6a3a', W - 9, H - 9, 5, 3);
  const dx = b.door * TS; p.r('#1a1a1e', dx + 3, H - 14, 10, 11); p.r('#3a2a1a', dx + 3, H - 14, 10, 1);
  return { img: c, windows: [] };
}

/* ---------- Overworld Wildmon (props of type 'wildmon') ---------- */
const OverMon = {
  cache: {},
  img(sp, grey) {
    const k = sp + (grey ? ':g' : '');
    if (this.cache[k]) return this.cache[k];
    const src = MonArt.get(sp, {}); const c = makeCanvas(24, 24); const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.drawImage(src, 0, 0, 48, 48, 0, 0, 24, 24);
    if (grey) {
      const d = x.getImageData(0, 0, 24, 24);
      for (let i = 0; i < d.data.length; i += 4) { const l = d.data[i] * 0.3 + d.data[i + 1] * 0.59 + d.data[i + 2] * 0.11; const g = 70 + l * 0.5; d.data[i] = g; d.data[i + 1] = g; d.data[i + 2] = g + 6; }
      x.putImageData(d, 0, 0);
    }
    return (this.cache[k] = c);
  },
};
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'wildmon') {
      const bob = pr.grey ? 0 : Math.round(Math.sin(t * 3 + pr.x) * 1);
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(sx + 3, sy + 13, 10, 2);
      ctx.drawImage(OverMon.img(pr.sp, pr.grey), sx - 4, sy - 9 + bob);
      return;
    }
    if (pr.type === 'herb') {
      const p = pen(ctx); p.r('rgba(0,0,0,0.2)', sx + 4, sy + 12, 8, 2);
      p.r('#3a6a2a', sx + 7, sy + 7, 2, 6); p.ell('#e8e0a0', sx + 8, sy + 6, 4, 3); p.ell('#fff8d0', sx + 7, sy + 5, 2, 1.5);
      if (Math.floor(t * 2) % 2) p.r('#ffffff', sx + 11, sy + 3);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}

/* ---------- Dim interiors: a circle of light around the player ---------- */
{
  const origDW = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    origDW(ctx);
    if (!World.map.dim) return;
    const [cx, cy] = this.camera(); const p = this.player;
    const x = p.drawX + 8 - cx, y = p.drawY + 6 - cy;
    const g = ctx.createRadialGradient(x, y, 18, x, y, 92);
    g.addColorStop(0, 'rgba(8,10,20,0)'); g.addColorStop(1, `rgba(8,10,20,${World.map.dim})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  };
}

/* ---------- Arrival: switches, currents, Calm Incense ---------- */
{
  const origArrive = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const p = this.player;
    if (G.repel > 0) { G.repel--; if (G.repel === 0) Script.run((s) => s.say('The scent of the Calm Incense faded away.')); }
    const before = World.id;
    origArrive();
    if (World.id !== before || Script.running || this.busy) { p.sliding = false; return; }
    const t = World.tile(p.x, p.y);
    if (t && t.plate) {
      G.flags[FieldState.gateKey()] = !FieldState.gatesOn(); Sound.sfx('switch'); this.shake = 0.25; this.dirty = true;
    }
    if (t && t.slide) {
      const [dx, dy] = DIRS[t.slide]; const nx = p.x + dx, ny = p.y + dy;
      if (!World.blocked(nx, ny, p)) { if (!p.sliding) Sound.sfx('slide'); p.sliding = true; p.dir = t.slide; p.startMove(t.slide, nx, ny, 2.2); p.walking = false; return; }
    }
    p.sliding = false;
  };
  const origEnc = World.encounter.bind(World);
  World.encounter = function (kind) { if (kind === 'grass' && G.repel > 0) return null; return origEnc(kind); };
  // keep the player from steering while carried by a current
  const origUP = Game.updatePlayer.bind(Game);
  Game.updatePlayer = function (dt, presses) { if (this.player.sliding && this.player.moving) presses = []; return origUP(dt, presses); };
}

/* ---------- Interaction: Brush Hook, scripted props ---------- */
{
  const origInteract = Game.interact.bind(Game);
  Game.interact = function () {
    const p = this.player; const [dx, dy] = DIRS[p.dir]; const x = p.x + dx, y = p.y + dy;
    const pr = World.propAt(x, y);
    if (pr && pr.script && DATA.scripts[pr.script]) return Script.run((s) => DATA.scripts[pr.script](s, pr));
    if (World.ch(x, y) === 'b' && World.inBounds(x, y) && !World.npcAt(x, y)) {
      if (!S.has('brush_hook')) return Script.run((s) => s.say(DATA.tiles.b.text));
      return Script.run(async (s) => {
        const yes = await s.ask('A thorny bush. Cut it down with the Brush Hook?', ['Yes', 'No']);
        if (yes !== 0) return;
        Sound.sfx('cut'); World.cut.add(x + ',' + y);
        for (let i = 0; i < 8; i++) Game.particles.push({ k: 'leaf', x: x * TS + 8, y: y * TS + 8, vx: (Math.random() - 0.5) * 70, vy: -40 - Math.random() * 30, t: 0.5 });
        G.stats.cut = (G.stats.cut || 0) + 1;
        await s.wait(250);
      });
    }
    return origInteract();
  };
}
DATA.items.brush_hook = { name: 'Brush Hook', pocket: 'key', desc: 'A hooked blade from Hall Master Hazel. Face a thorny bush and press A to cut it down. Bushes grow back when you leave the area.' };

/* ---------- Hearthhouses everywhere ---------- */
DATA.restPoints = {
  emberlow: { map: 'emberlow_home', x: 5, y: 3, dir: 'down', text: 'Mum: Oh, love! Have a rest... There, your Wildmon look much better now.' },
  fernwick: { map: 'fern_hearth', x: 4, y: 4, dir: 'up', text: 'Hearthkeeper Ama: Your Wildmon are all better now. Please take care out there!' },
};
Game.whiteout = async function () {
  const lost = Math.floor(G.money / 4); G.money -= lost;
  this.mode = 'world'; this.fade = 1; this.fadeTo = 1;
  const rp = DATA.restPoints[G.rest] || DATA.restPoints.larkfield;
  World.load(rp.map); const p = this.player; p.x = p.fx = rp.x; p.y = p.fy = rp.y; p.dir = rp.dir; p.moving = false; p.sliding = false;
  G.party.forEach((m) => Mon.heal(m));
  Sound.play(World.map.music);
  await UI.dialog([`${G.name} has no Wildmon left that can fight!`, `${G.name} dropped ${lost} Cr in the panic and hurried back to safety...`]);
  await this.fadeIn(400);
  await UI.dialog(rp.text);
  UI.hud(true); this.autosave();
};
DATA.scripts.nurse = async function (s, npc) {
  const name = (npc && npc.def && npc.def.name) || 'Hearthkeeper Ama'; const o = { name };
  const rest = World.map.rest || 'fernwick'; s.setRestPoint(rest);
  const town = (DATA.region.find((r) => r.id === World.map.region) || { name: 'Fernwick' }).name;
  if (!G.party.length) {
    return s.say([`Welcome to the ${town} Hearthhouse! Come in and sit by the fire. Tired Wildmon rest here, and it never costs a thing.`,
      "You haven't got a partner yet, have you? Come back when you do. We'll take very good care of them."], o);
  }
  const yes = await s.ask('Welcome to the Hearthhouse! Shall I rest your Wildmon by the fire?', ['Yes', 'No'], o);
  if (yes !== 0) return s.say('The fire is always lit. Come back any time.', o);
  await s.say('Let them sit by the hearth a while...', o);
  await s.healParty(); await s.wait(900);
  await s.say(['There. Every one of them is glowing bright again.', 'Safe travels, and mind the dark.'], o);
};

/* ---------- Badges ---------- */
DATA.badges = {
  bloom: { name: 'Bloom Badge', hall: 'Bloom Hall', town: 'Mossgate', master: 'Hazel' },
  tide: { name: 'Tide Badge', hall: 'Tide Hall', town: 'Port Calder', master: 'Coral' },
};
S.badge = async function (id) {
  const b = DATA.badges[id]; const before = Prog.attuneCap();
  G.flags['sigil_' + id] = Date.now(); Game.dirty = true;
  Sound.sfx('badge'); UI.toast('Badge earned!', b.name, true);
  await UI.dialog(`${G.name} received the ${b.name}!`, { note: 'Shown on your Trainer Card.' });
  const after = Prog.attuneCap();
  if (after > before) await UI.dialog(`Your Wildmon can now be Attuned up to rank ${after}.`);
  if (Prog.sigils() >= 1) Game.achieve('first_badge');
  if (Prog.sigils() >= 2) Game.achieve('two_badges');
};
DATA.achievements.first_badge = { name: 'Badge Holder', desc: 'Earn your first Hall Badge.' };
DATA.achievements.two_badges = { name: 'On a Roll', desc: 'Earn two Hall Badges.' };
DATA.achievements.order_foiled = { name: 'Lights Out', desc: 'Drive the Hollow Order out of the Sunken Lighthouse.' };
DATA.achievements.green_thumb = { name: 'Green Thumb', desc: 'Nurse the grey Wildmon back to health.' };
DATA.achievements.puzzler = { name: 'Puzzler', desc: 'Solve a Hall puzzle.' };

/* Hall Master / boss battle helper */
async function bossBattle(s, tid, opt = {}) {
  const T = DATA.trainers[tid];
  const pot = T.pot || 10;
  const team = T.team.map(([sp, lv, item, ex]) => greyMark(Mon.create(sp, lv, { lustre: !!(ex && ex.lustre), mark: null, pot: { hp: pot, atk: pot, def: pot, spa: pot, spd: pot, spe: pot }, item: item || null, ti: 0 }), ex));
  const res = await s.battle({ kind: 'trainer', trainer: T, enemy: team, music: T.music || 'battle_master', noWhiteout: opt.noWhiteout });
  if (res === 'win') { s.set('beat_' + tid); Game.achieve('first_win'); }
  return res;
}

/* ---------- Save migration ---------- */
{
  const origMig = Save.migrate.bind(Save);
  Save.migrate = function (d) {
    d = origMig(d);
    if (d && typeof d === 'object') { if (typeof d.repel !== 'number') d.repel = 0; }
    return d;
  };
}

/* ---------- Map enter hooks, cave encounters, cave backdrop ---------- */
{
  const origEnter = Game.onEnterMap.bind(Game);
  Game.onEnterMap = function () {
    origEnter();
    const hook = DATA.mapEnter && DATA.mapEnter[World.id];
    if (hook) Promise.resolve(hook(S)).catch((e) => console.error(e));
    if (G.visited.bramblewood && G.visited.mossgate && G.visited.route2 && G.visited.port_calder) this.achieve('wanderer');
  };
  const origArrive2 = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const before = World.id;
    origArrive2();
    const p = this.player;
    if (World.id !== before || Script.running || this.busy || p.moving || !World.map.caveEnc) return;
    const t = World.tile(p.x, p.y);
    if (!t || t.t !== 'cavefloor' || G.repel > 0 || (this.sinceBattle || 0) <= 3 || !G.party.some((m) => m.hp > 0)) return;
    if (Math.random() < 1 / 12) { const enc = World.encounter('cave'); if (enc) { p.walking = false; Script.run(() => this.wildBattle(enc, 'cave')); } }
  };
  const origBg = BattleScene.bg.bind(BattleScene);
  BattleScene.bg = function (kind) {
    if (kind === 'cave') return { sky: ['#1a1a24', '#3a3a48'], ground: '#4a463e', plat: '#6a6458', plat2: '#3a3630' };
    return origBg(kind);
  };
}
DATA.achievements.wanderer = { name: 'Wanderer', desc: 'Visit Bramblewood, Mossgate, Route 2 and Port Calder.' };
UI.useKey = Object.assign(UI.useKey || {}, {
  async repel(k) {
    if (G.repel > 0) { await UI.dialog('The Calm Incense from earlier is still working.'); return; }
    S.take(k, 1); G.repel = 100; Game.dirty = true; Sound.sfx('heal');
    await UI.dialog(`${G.name} lit the Calm Incense. Wild Wildmon will keep away for a while.`);
  },
});

/* ---------- Lantern family: catch rules + colours ---------- */
const LANTERN_RULES = {
  tide_lantern: (B, m) => (DATA.species[m.sp].types.includes('water') || B.bgk === 'water' ? 3 : 1),
  moss_lantern: (B, m) => (DATA.species[m.sp].types.some((t) => t === 'grass' || t === 'poison') ? 3 : 1),
  dusk_lantern: (B) => (B.night || B.bgk === 'cave' || (World.map && World.map.dim) ? 3 : 1),
  swift_lantern: (B) => ((B.turn || 0) === 0 ? 4 : 1),
  patience_lantern: (B) => Math.min(4, 1 + (B.turn || 0) * 0.3),
  kin_lantern: (B, m) => (G.dex[m.sp] && G.dex[m.sp].caught ? 3 : 1),
};
function lanternMult(id, B, m) {
  const it = DATA.items[id]; const rule = LANTERN_RULES[id];
  return (it.ball || 1) * (rule ? rule(B, m) : 1);
}
BattleScene.throwLantern = async function (id) {
  const B = this.B; const foe = B.sides[1].a.mon; const it = DATA.items[id];
  this.curLantern = id;
  await this.say(`${G.name} threw ${/^[AEIOU]/.test(it.name) ? 'an' : 'a'} ${it.name}!`);
  Sound.sfx('throw');
  await this.tween('throw', 520);
  Sound.sfx('sendout'); this.anim.eHide = true; this.anim.ball = { x: 176, y: 62, wob: 0 };
  await this.tween('drop', 300);
  const line = DATA.species[foe.sp].line;
  const bonus = Mon.masteryRank(line) >= 1 ? 1.05 : 1;
  const shakes = it.master ? 4 : BattleEngine.catchShakes(foe, lanternMult(id, B, foe), bonus, B.rng);
  for (let i = 0; i < Math.min(3, shakes); i++) { await this.wait(350); Sound.sfx('shake'); await this.tween('wobble', 420); }
  await this.wait(300);
  if (shakes >= 4) {
    Sound.sfx('caught'); this.anim.ball.stars = 1; await this.wait(600);
    await this.say(`Gotcha! ${Mon.name(foe)} was caught!`);
    if (id === 'heal_lantern') Mon.heal(foe);
    if (id === 'friend_lantern') foe.bond = Math.max(foe.bond || 0, 150);
    foe.lantern = id;
    G.stats.lanterns = G.stats.lanterns || {}; G.stats.lanterns[id] = (G.stats.lanterns[id] || 0) + 1;
    if (Object.keys(G.stats.lanterns).length >= 5) Game.achieve('lamplighter');
    await this.onCaught(foe);
    return 'caught';
  }
  this.anim.ball = null; this.anim.eHide = false; Sound.sfx('breakout'); this.anim.flash = 1;
  await this.say(['Oh no! It broke free!', 'Argh! Almost had it!', 'Shoot! It was so close, too!', 'Aww! It appeared to be caught!'][shakes]);
  return null;
};
BattleScene.drawLantern = function (ctx, x, y, wob, stars) {
  const it = DATA.items[this.curLantern] || DATA.items.lantern; const [frame, glass] = it.lcol || ['#c8a040', '#ffe8a0'];
  ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.rotate(wob);
  ctx.fillStyle = PAL.ink; ctx.fillRect(-4, -9, 8, 13); ctx.fillStyle = frame; ctx.fillRect(-4, -10, 8, 2); ctx.fillRect(-3, 3, 6, 2); ctx.fillRect(-1, -13, 2, 3);
  ctx.fillStyle = glass; ctx.fillRect(-3, -8, 6, 10); ctx.fillStyle = '#ffffff'; ctx.fillRect(-2, -7, 2, 5);
  if (it.master) { ctx.fillStyle = '#ffe060'; ctx.fillRect(-1, -6, 2, 2); }
  ctx.restore();
  if (stars || it.master) { ctx.fillStyle = it.master ? '#e0a0ff' : '#ffe060'; for (let i = 0; i < 5; i++) { const a = i * 1.3 + this.t * 2; ctx.fillRect(Math.round(x + Math.cos(a) * 12), Math.round(y - 6 + Math.sin(a) * 8), 2, 2); } }
};
DATA.achievements.lamplighter = { name: 'Lamplighter', desc: 'Catch Wildmon with five different kinds of Lantern.' };

/* ---------- The Fernwick shrine ---------- */
{
  const baseDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type !== 'shrine') return baseDP(ctx, pr, sx, sy, t);
    const p = pen(ctx); const R = (c, x, y, w, h) => p.r(c, sx + x, sy + y, w, h);
    const lit = G && G.flags && G.flags.beat_morrow2;
    const flick = Math.round(Math.sin(t * 7) + Math.sin(t * 11.3));
    R('rgba(0,0,0,0.22)', 1, 13, 14, 3);
    R('#5c5a62', 2, 11, 12, 4); R('#7a7882', 2, 11, 12, 1);
    R('#6a6872', 5, 2, 6, 9); R('#8a8892', 5, 2, 1, 9);
    R('#3e3c44', 3, -2, 10, 4); R('#56545e', 4, -3, 8, 1);
    R('#2a2830', 6, 3, 4, 5);
    R(lit ? '#ffcf5a' : '#9a9aa6', 7, 4 - Math.max(0, flick), 2, 4 + Math.max(0, flick));
    R(lit ? '#fff3c4' : '#c8c8d0', 7, 6, 2, 2);
  };
}
