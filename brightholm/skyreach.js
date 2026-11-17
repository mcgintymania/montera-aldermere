'use strict';
/* =====================================================================
   SKYREACH SYSTEMS — climbing with the Climbing Gear, wind currents,
   cliff/sky/snow tiles, the Beacon and Signal Tower buildings, the
   mirror-and-beam puzzle, the Gale Glider, badge and rest point.
   ===================================================================== */
const WIND = (p, f, dx, dy) => {
  p.r('#8ac8f0', 0, 0, 16, 16); p.r('#a8d8f8', 0, 0, 16, 5);
  for (let i = 0; i < 3; i++) {
    const o = (f * 2 + i * 6) % 16;
    if (dx) { const x = dx > 0 ? o : 15 - o; p.r('#ffffff', x, 3 + i * 5, 4, 1); p.r('#e0f4ff', (x + 8) % 16, 5 + i * 4, 2, 1); }
    else { const y = dy > 0 ? o : 15 - o; p.r('#ffffff', 3 + i * 5, y, 1, 4); p.r('#e0f4ff', 5 + i * 4, (y + 8) % 16, 1, 2); }
  }
  const c = '#3a6ab8';
  if (dx) { for (let k = 0; k < 4; k++) { p.r(c, 8 + dx * (k - 1), 8 - k, 1, 1); p.r(c, 8 + dx * (k - 1), 7 + k, 1, 1); } }
  else { for (let k = 0; k < 4; k++) { p.r(c, 8 - k, 8 + dy * (k - 1), 1, 1); p.r(c, 7 + k, 8 + dy * (k - 1), 1, 1); } }
};
Object.assign(TILE_DRAW, {
  cliff(p, f, v) {
    p.r('#7a5a3a', 0, 0, 16, 16); p.r('#9a7a52', 1, 0, 14, 15);
    p.r('#6a4a2a', 0, 7, 16, 1); p.r('#b89a6a', 2, 1, 5, 1); p.r('#b89a6a', 9, 9, 5, 1);
    // handholds
    p.r('#4a321c', 3 + (v % 2) * 6, 3, 3, 2); p.r('#4a321c', 9 - (v % 2) * 5, 11, 3, 2); p.r('#c8aa78', 3 + (v % 2) * 6, 3, 3, 1); p.r('#c8aa78', 9 - (v % 2) * 5, 11, 3, 1);
    p.r('#5a3a20', 0, 15, 16, 1);
  },
  cliffwall(p, f, v) {
    p.r('#5a5a62', 0, 0, 16, 16); p.r('#7a7a84', 1, 0, 14, 15); p.r('#8a8a94', 2, 1, 6, 2); p.r('#6a6a72', 0, 7, 16, 1);
    if (v % 2) { p.r('#6a6a72', 9, 3, 1, 4); p.r('#9a9aa4', 10, 10, 4, 1); } else { p.r('#6a6a72', 4, 9, 1, 5); p.r('#9a9aa4', 3, 3, 3, 1); }
    p.r('#4a4a52', 0, 15, 16, 1);
  },
  sky(p, f, v) {
    p.r('#9ad0f4', 0, 0, 16, 16); p.r('#b0dcf8', 0, 0, 16, 6);
    const o = (f + v * 5) % 16; p.r('#ffffff', o, 9, 6, 2); p.r('#ffffff', (o + 1) % 16, 8, 4, 1); p.r('#e8f4fc', (o + 9) % 16, 3, 4, 1);
  },
  wind_u(p, f) { WIND(p, f, 0, -1); }, wind_d(p, f) { WIND(p, f, 0, 1); }, wind_l(p, f) { WIND(p, f, -1, 0); }, wind_r(p, f) { WIND(p, f, 1, 0); },
  snow(p, f, v) {
    p.r('#eef4fa', 0, 0, 16, 16); const R = mulberry(v * 41 + 5);
    for (let i = 0; i < 8; i++) p.r(i % 2 ? '#d8e4f0' : '#ffffff', Math.floor(R() * 16), Math.floor(R() * 16), 2, 1);
    if (v === 2) { p.r('#7a9a6a', 6, 10, 1, 3); p.r('#7a9a6a', 8, 11, 1, 2); }
  },
  stonefloor(p, f, v) {
    p.r('#a8a49a', 0, 0, 16, 16); p.r('#b8b4aa', 1, 1, 6, 6); p.r('#b8b4aa', 9, 1, 6, 6); p.r('#b8b4aa', 1, 9, 6, 6); p.r('#b8b4aa', 9, 9, 6, 6);
    if (v % 2) p.r('#98948a', 3, 3, 2, 1);
  },
});
Object.assign(TILE_FRAMES, { wind_u: 8, wind_d: 8, wind_l: 8, wind_r: 8, sky: 16 });
Object.assign(TILE_VARIANTS, { cliff: 2, cliffwall: 2, sky: 3, snow: 4, stonefloor: 2 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) {
    if (name.startsWith('wind_')) f = Math.floor(Game.t * 10);
    if (name === 'sky') f = Math.floor(Game.t * 1.5);
    return gt(name, f, v);
  };
}

/* ---------- Climbing ---------- */
DATA.items.climbing_gear.desc = 'Ropes, pitons and a harness from Hall Master Vesper. Lets you climb rock faces that have handholds.';
{
  const bl0 = World.blocked.bind(World);
  World.blocked = function (x, y, who) {
    const p = Game.player;
    if (who === p && p && this.inBounds(x, y) && !this.solid[y * this.w + x]) {
      const t = this.tile(x, y);
      if (t && t.climb && S.has('climbing_gear') && !G.surfing) return !!(this.propAt(x, y) || this.npcAt(x, y) || this.itemAt(x, y, false));
    }
    return bl0(x, y, who);
  };
  const ts0 = Game.tryStep.bind(Game);
  Game.tryStep = function (d) {
    const p = this.player; const [dx, dy] = DIRS[d]; const nx = p.x + dx, ny = p.y + dy;
    const t = World.inBounds(nx, ny) && World.tile(nx, ny);
    if (t && t.climb && !S.has('climbing_gear') && !Script.running && !this.busy) {
      p.dir = d;
      if (!G.flags.climb_hint) { G.flags.climb_hint = 1; return Script.run((s) => s.say(t.text + ' You\'ll need Climbing Gear.')); }
      return this.bump();
    }
    const on = World.tile(p.x, p.y);
    if (t && t.climb && !(on && on.climb) && !G.flags.climbed_once) { G.flags.climbed_once = 1; Game.achieve('climber'); }
    return ts0(d);
  };
}
DATA.achievements.climber = { name: 'Scaler', desc: 'Climb a rock face with the Climbing Gear.' };

/* ---------- Buildings ---------- */
HALL_THEME.gale = { roof: '#3a8ad0', wall: '#eef2f8', trim: '#2a4a6a', light: '#d0f0ff', banner: '#e8a040' };
{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind === 'beacon') return renderBeacon(b);
    if (b.kind === 'signal') return renderSignal(b);
    return rb0(b);
  };
}
function renderBeacon(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
  p.r('#8a8478', 2, H - 6, W - 4, 6); p.r('#a8a294', 3, H - 6, W - 6, 2);
  for (let y = 20; y < H - 6; y++) { const w = W - 12 + Math.round((y - 20) * 0.12); const x = Math.round((W - w) / 2); p.r(Math.floor((y - 20) / 8) % 2 ? '#3a6ab0' : '#f0eee8', x, y, w, 1); p.r('rgba(0,0,0,0.14)', x + w - 3, y, 3, 1); }
  p.r('#3a3a44', 8, 16, W - 16, 3); for (let x = 9; x < W - 9; x += 3) p.r('#3a3a44', x, 12, 1, 4); p.r('#3a3a44', 8, 12, W - 16, 1);
  p.r('#5a5a64', 13, 4, W - 26, 9); const lit = G && G.flags.beacon_clear; p.r(lit ? '#ffe7a0' : '#b8b8c0', 14, 5, W - 28, 7); p.r(lit ? '#fff8e0' : '#d0d0d8', 16, 6, 4, 3);
  p.r('#3a6ab0', 11, 1, W - 22, 4); p.r('#5a8ad0', 13, 0, W - 26, 2); p.r('#3a3a44', W / 2 - 1, -2, 2, 3);
  const dx = b.door * TS; p.r('#4a3a2a', dx + 3, H - 15, 10, 10); p.r('#2a2018', dx + 4, H - 14, 8, 9); p.r('#a8a294', dx + 2, H - 5, 12, 1);
  return { img: c, windows: [{ x: W / 2, y: 8, r: 30, beam: !!lit }] };
}
function renderSignal(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
  p.r('#6a665e', 4, 14, W - 8, H - 14); p.r('#8a867c', 5, 14, W - 10, H - 15);
  for (let y = 18; y < H - 4; y += 6) for (let x = 6 + ((y / 6) % 2) * 4; x < W - 6; x += 8) p.r('#7a766c', x, y, 5, 1);
  p.r('#5a564e', 2, 10, W - 4, 5); p.r('#7a766c', 3, 10, W - 6, 2); for (let x = 3; x < W - 3; x += 4) p.r('#5a564e', x, 6, 2, 4);
  p.r('#c8d8e8', W / 2 - 3, 0, 6, 8); p.r('#e8f4ff', W / 2 - 2, 1, 2, 4); p.r('#5a564e', W / 2 - 4, 7, 8, 2);
  const solved = G && G.flags.signal_solved;
  const dx = b.door * TS; p.r('#3a3630', dx + 2, H - 16, 12, 16); p.r(solved ? '#1a1814' : '#8a6ac8', dx + 3, H - 15, 10, 15);
  if (!solved) { p.r('#c8a8f8', dx + 7, H - 12, 2, 6); p.r('#c8a8f8', dx + 5, H - 10, 6, 2); }
  return { img: c, windows: [{ x: W / 2, y: 4, r: 12 }] };
}

/* ---------- Mirror puzzle ---------- */
const MirrorBeam = {
  beam() {
    const props = World.props; const path = [];
    const em = props.find((p) => p.type === 'emitter'); if (!em) return { path, hit: false };
    let x = em.x, y = em.y, dx = 1, dy = 0;
    for (let i = 0; i < 200; i++) {
      x += dx; y += dy;
      if (!World.inBounds(x, y)) break;
      const t = World.tile(x, y); if (!t || (t.solid && t.t !== 'stairs')) break;
      if (t.t === 'stairs') break;
      const pr = World.propAt(x, y);
      if (pr && pr.type === 'receiver') { path.push([x, y]); return { path, hit: true }; }
      if (pr && pr.type === 'mirror') { path.push([x, y]); if (pr.o === '/') { const t2 = dx; dx = -dy; dy = -t2; } else { const t2 = dx; dx = dy; dy = t2; } continue; }
      if (pr) break;
      path.push([x, y]);
    }
    return { path, hit: false };
  },
};
{
  const load0 = World.load.bind(World);
  World.load = function (id) {
    load0(id);
    const st = G && G.flags.mirrors;
    if (st) for (const p of this.props) if (p.type === 'mirror' && st[p.id]) p.o = st[p.id];
  };
  const dp0 = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    const p = pen(ctx);
    if (pr.type === 'mirror') {
      p.r('rgba(0,0,0,0.2)', sx + 2, sy + 12, 12, 3); p.r('#5a4a3a', sx + 2, sy + 11, 12, 3); p.r('#7a6a52', sx + 3, sy + 11, 10, 1);
      for (let k = 0; k < 11; k++) { const xx = pr.o === '/' ? 13 - k : 2 + k; p.r('#3a3a44', sx + xx, sy + k, 2, 1); p.r('#d8f0ff', sx + xx + (pr.o === '/' ? -1 : 1), sy + k, 1, 1); }
      return;
    }
    if (pr.type === 'emitter') {
      p.r('#3a3a44', sx + 1, sy + 2, 12, 12); p.r('#5a5a64', sx + 2, sy + 3, 10, 10); p.r('#ffe7a0', sx + 9, sy + 5, 4, 6); p.r('#ffffff', sx + 10, sy + 7, 2, 2);
      return;
    }
    if (pr.type === 'receiver') {
      const lit = G.flags.signal_solved || MirrorBeam.beam().hit;
      p.r('#3a3a44', sx + 3, sy + 11, 10, 4); p.ell(lit ? '#e8d0ff' : '#8a6ac8', sx + 8, sy + 6, 5, 6); p.ell(lit ? '#ffffff' : '#c8a8f8', sx + 7, sy + 4, 2, 2);
      return;
    }
    if (pr.type === 'seal') {
      p.r('#4a3a6a', sx, sy, 16, 16); p.r('#8a6ac8', sx + 1, sy + 1, 14, 14); p.r('#c8a8f8', sx + 7, sy + 3, 2, 10); p.r('#c8a8f8', sx + 3, sy + 7, 10, 2);
      if (Math.floor(t * 2) % 2) p.r('#ffffff', sx + 7, sy + 7, 2, 2);
      return;
    }
    return dp0(ctx, pr, sx, sy, t);
  };
  const dw0 = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw0(ctx);
    if (!World.map.beam) return;
    const [cx, cy] = this.camera(); const em = World.props.find((p) => p.type === 'emitter'); if (!em) return;
    const b = MirrorBeam.beam(); const pts = [[em.x, em.y], ...b.path];
    ctx.save(); ctx.globalAlpha = 0.75 + Math.sin(Game.t * 6) * 0.15;
    ctx.strokeStyle = '#fff2a0'; ctx.lineWidth = 3; ctx.beginPath();
    pts.forEach(([x, y], i) => { const px = x * TS + 8 - cx, py = y * TS + 7 - cy; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
    ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
  };
}

/* ---------- Gale Glider: fly to visited Hearthhouse towns ---------- */
const GLIDE_ORDER = ['emberlow', 'fernwick', 'mossgate', 'port_calder', 'voltara', 'cinderhollow', 'glasswater', 'saltmere', 'ashgrave', 'skyreach'];
UI.useKey = Object.assign(UI.useKey || {}, {
  async glider() {
    if (!World.map.outdoor) { await UI.dialog('You can only use the Gale Glider outdoors.'); return; }
    const towns = GLIDE_ORDER.filter((id) => G.visited[id] && DATA.restPoints[id]);
    if (!towns.length) { await UI.dialog('There is nowhere to fly to yet.'); return; }
    const names = towns.map((id) => (DATA.region.find((r) => r.id === id) || { name: id }).name);
    const i = await UI.menu([...names, 'Cancel'], { cls: 'choice', header: 'Fly where?' });
    if (i < 0 || i >= towns.length) return;
    const rp = DATA.restPoints[towns[i]]; const hm = DATA.maps[rp.map]; const to = hm && hm.warps && hm.warps[0] && hm.warps[0].to;
    if (!to) return;
    UI.afterMenu = async () => { Sound.sfx('flee'); await Game.warpTo(Object.assign({}, to, { dir: 'down' })); await UI.dialog(`${G.name} glided to ${names[i]}!`); Game.achieve('glider'); };
    const top = UI.stack[UI.stack.length - 1]; if (top && top.finish) top.finish();
  },
});
DATA.achievements.glider = { name: 'Frequent Flyer', desc: 'Fly somewhere with the Gale Glider.' };

/* ---------- Summit encounters, badge, rest point, backdrops ---------- */
{
  const enc0 = World.encounter.bind(World);
  World.encounter = function (kind) {
    if (World.id === 'gullwind' && kind === 'grass' && Game.player && Game.player.y < 20 && DATA.encounters.gullwind_top) {
      const save = DATA.encounters.gullwind; DATA.encounters.gullwind = DATA.encounters.gullwind_top;
      try { return enc0(kind); } finally { DATA.encounters.gullwind = save; }
    }
    return enc0(kind);
  };
  const bg0 = BattleScene.bg.bind(BattleScene);
  BattleScene.bg = function (kind) {
    if (World.map && (World.id === 'gale_hall' || World.id === 'skyreach')) return { sky: ['#6ab0e8', '#cfe8f8'], ground: '#e8f0f8', plat: '#ffffff', plat2: '#c8d8e8' };
    if (World.map && World.id === 'gullwind' && Game.player && Game.player.y < 20) return { sky: ['#8ab0d0', '#e0ecf4'], ground: '#e8eef4', plat: '#ffffff', plat2: '#c0ccd8' };
    if (World.map && World.id === 'gullwind' && World.weather === 'rain') return { sky: ['#3a4a5a', '#6a7a88'], ground: '#6a6a60', plat: '#8a8a7a', plat2: '#5a5a50' };
    return bg0(kind);
  };
}
DATA.badges.gale = { name: 'Gale Badge', hall: 'Gale Hall', town: 'Skyreach', master: 'Aerin' };
DATA.restPoints.skyreach = { map: 'sky_hearth', x: 4, y: 4, dir: 'up', text: 'Hearthkeeper Cirra: Your Wildmon are all better now. Please take care out there!' };

/* ---------- Allies for double battles ---------- */
DATA.allies.wren2 = { name: 'Wren', look: 'wren', team: [['solstag', 36], ['waspire', 35], ['beamwyrm', 35]] };
DATA.allies.kit = { name: 'Kit', look: 'kit', team: [] };
Object.defineProperty(DATA.allies.kit, 'team', {
  get() {
    const evo = { mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' };
    const pick = RIVAL_PICK[G && G.flags.starter] || 'firecub';
    return [[evo[pick], 38], ['joltfox', 36], ['psyren', 36]];
  },
});

