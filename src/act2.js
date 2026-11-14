'use strict';
/* =====================================================================
   ACT II SYSTEMS — surfing (Tide Board), pushable boulders and lava pits,
   laser gates and conveyor belts, power cuts.
   ===================================================================== */
Object.assign(SFX, {
  push: [[140, 0.08, 'square', 0.2, 90], [110, 0.1, 'square', 0.2, 70]],
  splash: [[600, 0.05, 'triangle', 0.3, 200], [300, 0.12, 'triangle', 0.25, 120]],
  zap: [[1200, 0.03, 'sawtooth', 0.12, 300], [800, 0.05, 'square', 0.1, 200]],
  fill: [[200, 0.08, 'square', 0.2, 60], [90, 0.2, 'triangle', 0.3, 40]],
});

const LASER = (p, f, horiz) => {
  p.r('#5a6270', 0, 0, 16, 16); p.r('#6a7280', 1, 1, 14, 14);
  const c = f % 2 ? '#ff6a8a' : '#ffd0e0';
  if (horiz) { p.r('#3a3a44', 0, 6, 2, 4); p.r('#3a3a44', 14, 6, 2, 4); for (let x = 2; x < 14; x++) p.r(x % 3 === f % 3 ? '#ffffff' : c, x, 7 + ((x + f) % 2), 1, 1); p.r('#e8305a', 2, 8, 12, 1); }
  else { p.r('#3a3a44', 6, 0, 4, 2); p.r('#3a3a44', 6, 14, 4, 2); for (let y = 2; y < 14; y++) p.r(y % 3 === f % 3 ? '#ffffff' : c, 7 + ((y + f) % 2), y, 1, 1); p.r('#e8305a', 8, 2, 1, 12); }
};
const BELT = (p, f, dx, dy) => {
  p.r('#3a3a44', 0, 0, 16, 16); p.r('#4a4a56', 1, 0, 14, 16);
  for (let i = 0; i < 4; i++) { const o = (f * 2 + i * 4) % 16; if (dx) { const x = dx > 0 ? o : 15 - o; p.r('#8a8a98', x, 2, 1, 12); } else { const y = dy > 0 ? o : 15 - o; p.r('#8a8a98', 2, y, 12, 1); } }
  p.r('#f0c040', 7, 7, 2, 2);
  if (dx) { p.r('#f0c040', 8 + dx * 2, 6, 1, 4); } else { p.r('#f0c040', 6, 8 + dy * 2, 4, 1); }
  p.r('#2a2a32', 0, 0, 1, 16); p.r('#2a2a32', 15, 0, 1, 16);
};
Object.assign(TILE_DRAW, {
  laser(p, f) { LASER(p, f, true); },
  laseroff(p) { p.r('#5a6270', 0, 0, 16, 16); p.r('#6a7280', 1, 1, 14, 14); p.r('#3a3a44', 0, 6, 2, 4); p.r('#3a3a44', 14, 6, 2, 4); p.r('#8a92a0', 3, 3, 1, 1); p.r('#8a92a0', 12, 12, 1, 1); },
  metal(p, f, v) { p.r('#6a7280', 0, 0, 16, 16); p.r('#7a8290', 1, 1, 14, 14); p.r('#5a6270', 0, 15, 16, 1); p.r('#5a6270', 15, 0, 1, 16); if (v % 2) { p.r('#4a5260', 3, 3, 1, 1); p.r('#4a5260', 12, 3, 1, 1); p.r('#4a5260', 3, 12, 1, 1); p.r('#4a5260', 12, 12, 1, 1); } },
  belt_u(p, f) { BELT(p, f, 0, -1); }, belt_d(p, f) { BELT(p, f, 0, 1); }, belt_l(p, f) { BELT(p, f, -1, 0); }, belt_r(p, f) { BELT(p, f, 1, 0); },
  pit(p, f) {
    p.r('#2a1a14', 0, 0, 16, 16); p.r(f % 2 ? '#e85a1a' : '#f07a2a', 2, 2, 12, 12); p.r('#ffb040', 4 + (f % 3), 5, 4, 2); p.r('#ffd060', 9, 9 - (f % 2), 2, 2); p.r('#a03010', 2, 13, 12, 1);
  },
  pitfill(p) { p.r('#4a3a30', 0, 0, 16, 16); p.r('#6a5a4a', 2, 2, 12, 12); p.r('#7a6a58', 4, 4, 5, 3); p.r('#3a2a20', 2, 13, 12, 1); },
  ash(p, f, v) { p.r('#5a5450', 0, 0, 16, 16); const R = mulberry(v * 23 + 1); for (let i = 0; i < 10; i++) p.r(i % 2 ? '#4a4440' : '#6a6460', Math.floor(R() * 16), Math.floor(R() * 16), 1, 1); if (v === 1) { p.r('#e86a2a', 6, 9, 2, 1); } },
  lava(p, f) { p.r('#c83a1a', 0, 0, 16, 16); for (let i = 0; i < 3; i++) { const o = (f * 2 + i * 6) % 16; p.r('#f07a2a', o, 3 + i * 5, 4, 1); p.r('#ffd060', (o + 2) % 16, 3 + i * 5, 1, 1); } },
  basalt(p, f, v) { p.r('#2a2428', 0, 0, 16, 16); p.r('#3a3238', 1, 1, 14, 9); p.r('#4a4048', 2, 2, 6, 3); p.r('#1a1418', 0, 12, 16, 4); if (v % 2) p.r('#e8602a', 9, 6, 2, 1); },
});
Object.assign(TILE_FRAMES, { laser: 6, belt_u: 8, belt_d: 8, belt_l: 8, belt_r: 8, pit: 4, lava: 8 });
Object.assign(TILE_VARIANTS, { metal: 2, ash: 4, basalt: 2 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) {
    if (name === 'laser' || name.startsWith('belt_')) f = Math.floor(Game.t * 8);
    if (name === 'pit' || name === 'lava') f = Math.floor(Game.t * 3);
    return gt(name, f, v);
  };
}

/* ---------- Dynamic tiles: lasers, power cuts, filled pits ---------- */
const Act2 = {
  powerOut() { return !!(World.map && World.map.powerFlag && !G.flags[World.map.powerFlag]); },
  pitKey() { return 'pits_' + World.id; },
  pits() { return G.flags[this.pitKey()] || (G.flags[this.pitKey()] = {}); },
  boulderKey() { return 'bould_' + World.id; },
};
{
  const ch0 = World.ch.bind(World);
  World.ch = function (x, y) {
    const c = ch0(x, y);
    if (c === 'z') return Act2.powerOut() ? 'z' : (FieldState.gatesOn() ? 'c' : 'z');
    if (c === 'Z') return Act2.powerOut() ? 'Z' : (FieldState.gatesOn() ? 'Z' : 'c');
    if (c === 'i' && World.inBounds(x, y) && Act2.pits()[x + ',' + y]) return 'j';
    return c;
  };
  const load0 = World.load.bind(World);
  World.load = function (id) {
    load0(id);
    const saved = G && G.flags[Act2.boulderKey()];
    if (saved) {
      const bs = this.props.filter((p) => p.type === 'boulder');
      bs.forEach((b) => { const s = saved[b.id]; if (s === null) this.props = this.props.filter((p) => p !== b); else if (s) { b.x = s[0]; b.y = s[1]; } });
    }
  };
}

/* ---------- Boulders ---------- */
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'boulder') {
      const p = pen(ctx); const ox = pr.anim ? Math.round(pr.anim.dx * (1 - pr.anim.k) * -16) : 0, oy = pr.anim ? Math.round(pr.anim.dy * (1 - pr.anim.k) * -16) : 0;
      p.r('rgba(0,0,0,0.25)', sx + 2 + ox, sy + 12 + oy, 13, 3);
      p.ell('#3a3632', sx + 8 + ox, sy + 8 + oy, 7.5, 7); p.ell('#6a645c', sx + 7.5 + ox, sy + 7.5 + oy, 6.5, 6); p.ell('#8a847a', sx + 6 + ox, sy + 5.5 + oy, 3, 2.5);
      p.r('#3a3632', sx + 9 + ox, sy + 9 + oy, 3, 1);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
  const origStep = Game.tryStep.bind(Game);
  Game.tryStep = function (d) {
    const p = this.player; const [dx, dy] = DIRS[d]; const nx = p.x + dx, ny = p.y + dy;
    const b = World.propAt(nx, ny);
    if (b && b.type === 'boulder' && !G.surfing) {
      p.dir = d;
      if (World.map.needGloves && !S.has('power_gloves')) return Script.run((s) => s.say('A big boulder. It would take some serious strength to move it.'));
      const bx = nx + dx, by = ny + dy;
      const tile = World.tile(bx, by);
      const isPit = World.ch(bx, by) === 'i';
      const free = isPit || (World.inBounds(bx, by) && !World.blocked(bx, by, b) && !World.warps[bx + ',' + by] && !(tile && tile.water));
      if (!free) { this.bump(); return; }
      Sound.sfx('push'); b.x = bx; b.y = by; b.anim = { dx, dy, k: 0 };
      const save = G.flags[Act2.boulderKey()] || (G.flags[Act2.boulderKey()] = {});
      if (isPit) {
        Act2.pits()[bx + ',' + by] = 1; World.props = World.props.filter((x) => x !== b); save[b.id] = null;
        Sound.sfx('fill'); for (let i = 0; i < 8; i++) this.particles.push({ k: 'dust', x: bx * TS + 8, y: by * TS + 10, vx: (i - 3.5) * 14, vy: -20, t: 0.4 });
      } else save[b.id] = [bx, by];
      this.dirty = true; p.bumpT = 0.25;
      return;
    }
    return origStep(d);
  };
  const up0 = Game.updateParticles.bind(Game);
  Game.updateParticles = function (dt) { up0(dt); for (const pr of World.props) if (pr.anim) { pr.anim.k += dt * 7; if (pr.anim.k >= 1) pr.anim = null; } };
}

/* ---------- Surfing with the Tide Board ---------- */
DATA.items.tide_board = { name: 'Tide Board', pocket: 'key', desc: 'A sturdy Ranger board. Face open water and press A to paddle across it. Step onto land to get off.' };
DATA.items.power_gloves = { name: 'Power Gloves', pocket: 'key', desc: 'Heavy work gloves from Hall Master Brann. Lets you push big boulders anywhere in Aldermere.' };
{
  const blocked0 = World.blocked.bind(World);
  World.blocked = function (x, y, who) {
    const p = Game.player;
    if (G && G.surfing && p && who === p) {
      if (!this.inBounds(x, y)) return true;
      const t = this.tile(x, y);
      if (t && t.water) { if (this.solid[y * this.w + x] || this.npcAt(x, y) || this.propAt(x, y)) return true; return false; }
    }
    return blocked0(x, y, who);
  };
  const interact0 = Game.interact.bind(Game);
  Game.interact = function () {
    const p = this.player; const [dx, dy] = DIRS[p.dir]; const x = p.x + dx, y = p.y + dy;
    const t = World.tile(x, y);
    if (!G.surfing && t && t.water && World.inBounds(x, y) && S.has('tide_board') && World.map.outdoor && !World.npcAt(x, y) && !World.solid[y * World.w + x]) {
      return Script.run(async (s) => {
        const opts = S.has('old_rod') ? ['Ride the Tide Board', 'Fish', 'Cancel'] : ['Ride the Tide Board', 'Cancel'];
        const c = await s.ask('The water is calm.', opts);
        if (opts[c] === 'Fish') return fishing(s);
        if (c !== 0) return;
        G.surfing = true; Sound.sfx('splash'); Game.dirty = true;
        p.startMove(p.dir, x, y, 1, true);
        s.achieve('surfer');
      });
    }
    return interact0();
  };
  const arrive0 = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const p = this.player;
    if (G.surfing) {
      const t = World.tile(p.x, p.y);
      if (!t || !t.water) { G.surfing = false; Sound.sfx('splash'); }
    }
    const before = World.id;
    arrive0();
    if (World.id !== before || Script.running || this.busy || p.moving) return;
    if (G.surfing && G.repel <= 0 && (this.sinceBattle || 0) > 3 && G.party.some((m) => m.hp > 0) && Math.random() < 1 / 14) {
      const enc = World.encounter('surf'); if (enc) { p.walking = false; Script.run(() => this.wildBattle(enc, 'water')); }
    }
  };
  const de0 = Game.drawEntity.bind(Game);
  Game.drawEntity = function (ctx, e, cx, cy) {
    if (e === this.player && G && G.surfing) {
      const sx = Math.round(e.drawX - cx), sy = Math.round(e.drawY - cy); const bob = Math.round(Math.sin(this.t * 4) * 1);
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(sx + 1, sy + 13 + bob, 14, 2);
      ctx.fillStyle = '#2a6a8a'; ctx.fillRect(sx + 2, sy + 9 + bob, 12, 5); ctx.fillStyle = '#4ab0d0'; ctx.fillRect(sx + 3, sy + 9 + bob, 10, 2); ctx.fillStyle = '#f0d040'; ctx.fillRect(sx + 7, sy + 10 + bob, 2, 3);
      ctx.save(); ctx.beginPath(); ctx.rect(sx - 2, sy - 6, 20, 16 + bob); ctx.clip();
      ctx.drawImage(charSprite(e.look, e.dir, 0), sx, sy - 6 + bob); ctx.restore();
      return;
    }
    return de0(ctx, e, cx, cy);
  };
  const wo0 = Game.whiteout.bind(Game);
  Game.whiteout = async function () { G.surfing = false; return wo0(); };
}
DATA.achievements.surfer = { name: 'Making Waves', desc: 'Ride the Tide Board for the first time.' };

/* ---------- Battle backdrops ---------- */
{
  const bg0 = BattleScene.bg.bind(BattleScene);
  BattleScene.bg = function (kind) {
    if (kind === 'volcano') return { sky: ['#3a1a14', '#8a3a1a'], ground: '#4a3a34', plat: '#6a5a50', plat2: '#3a2a24' };
    if (kind === 'plant') return { sky: ['#2a2e3a', '#4a5262'], ground: '#5a6270', plat: '#7a8290', plat2: '#4a5260' };
    return bg0(kind);
  };
  const wb0 = Game.wildBattle.bind(Game);
  Game.wildBattle = function (enc, bg) { if (bg === 'cave' && World.map.battleBg) bg = World.map.battleBg; return wb0(enc, bg); };
}
Object.assign(HALL_THEME, {
  spark: { roof: '#e8b020', wall: '#e4e6ea', trim: '#3a3a4a', light: '#fff080', banner: '#e8b020' },
  forge: { roof: '#a83a24', wall: '#d8ccc0', trim: '#3a2a24', light: '#ffa050', banner: '#c8502a' },
});
BUILD_STYLE.plant = { roof: '#5a6270', wall: '#c8ccd4', vent: true };
{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind !== 'cavemouth') return rb0(b);
    const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
    const rock = b.volcanic ? ['#2a2428', '#3a3238', '#4a4048'] : ['#5a5048', '#7a7062', '#948a7a'];
    p.ell(rock[0], W / 2, H * 0.62, W / 2, H * 0.62); p.ell(rock[1], W / 2 - 1, H * 0.6, W / 2 - 2, H * 0.58); p.ell(rock[2], W / 2 - 5, H * 0.4, W / 4, H / 5);
    const dx = b.door * TS; p.r('#100c0a', dx + 2, H - 14, 12, 14); p.r('#1e1814', dx + 3, H - 15, 10, 2); p.r('#2a221c', dx + 1, H - 12, 1, 12); p.r('#2a221c', dx + 14, H - 12, 1, 12);
    if (b.volcanic) { p.r('#e8602a', dx + 5, H - 3, 6, 1); }
    return { img: c, windows: [] };
  };
}

/* Hearthhouse rest points */
Object.assign(DATA.restPoints = DATA.restPoints || {}, {
  mossgate: { map: 'moss_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Bryony: Your Wildmon are all better now. Please take care out there!' },
  port_calder: { map: 'calder_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Lena: Your Wildmon are all better now. Please take care out there!' },
  voltara: { map: 'volt_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Joule: Your Wildmon are all better now. Please take care out there!' },
  cinderhollow: { map: 'cinder_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Ember: Your Wildmon are all better now. Please take care out there!' },
});

DATA.badges.spark = { name: 'Spark Badge', hall: 'Spark Hall', town: 'Voltara', master: 'Rhea' };
DATA.badges.forge = { name: 'Forge Badge', hall: 'Forge Hall', town: 'Cinderhollow', master: 'Brann' };
