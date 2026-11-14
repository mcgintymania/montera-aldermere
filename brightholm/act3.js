'use strict';
/* =====================================================================
   ACT III SYSTEMS — tower tiles and teleport pads, marsh grass, graves
   and candles, the Morrow Lumen tower and Lantern Warehouse buildings,
   Starseed Honey, Veil Hall theme, badges and rest points.
   ===================================================================== */
DATA.tiles.U.tall = true;

Object.assign(TILE_DRAW, {
  pad(p, f) {
    p.r('#c8ccd4', 0, 0, 16, 16); p.r('#d8dce4', 1, 1, 14, 14);
    p.r('#3a4a6a', 2, 2, 12, 12); p.r('#4a6aa8', 3, 3, 10, 10);
    const c = ['#80d0ff', '#b0e8ff', '#e0f8ff', '#b0e8ff'][f % 4];
    p.r(c, 5, 5, 6, 6); p.r('#ffffff', 7, 7, 2, 2);
    p.r('#2a3a5a', 2, 13, 12, 1);
  },
  glass(p, f) {
    p.r('#4a5262', 0, 0, 16, 16); p.r('#8ac8e8', 1, 1, 14, 12); p.r('#b8e4f8', 1, 1, 14, 4);
    p.r('#e8f8ff', 3 + (f % 2), 2, 2, 8); p.r('#4a5262', 7, 1, 1, 12); p.r('#3a4252', 0, 13, 16, 3);
  },
  marsh(p, f, v) {
    p.r('#4a6a48', 0, 0, 16, 16); const R = mulberry(v * 17 + 3);
    for (let i = 0; i < 4; i++) p.r('#3a5a6a', Math.floor(R() * 13), Math.floor(R() * 13), 3, 1);
    const s = f ? 1 : 0;
    for (const [x, y] of [[1, 2], [6, 1], [11, 3], [3, 9], [9, 8], [13, 10]]) {
      p.r('#6a8a4a', x + s, y, 1, 6); p.r('#8aa85a', x + 1, y + 1 - s, 1, 5); p.r('#a8b860', x + s, y - 1, 1, 1);
      if (v % 2 && x === 9) { p.r('#6a4a2a', x + s, y - 2, 2, 3); }
    }
    p.r('#2a4a3a', 0, 15, 16, 1);
  },
  grave(p, f, v) {
    p.r(PAL.g2, 0, 0, 16, 16); p.r('rgba(0,0,0,0.2)', 3, 13, 11, 2);
    p.r('#5a5a62', 3, 3, 10, 11); p.r('#8a8a94', 4, 4, 8, 9); p.r('#8a8a94', 5, 2, 6, 2); p.r('#5a5a62', 4, 1, 8, 1);
    p.r('#6a6a74', 6, 6, 4, 1); p.r('#6a6a74', 6, 8, 4, 1);
    if (v % 2) { p.r('#d84a7a', 3, 13, 2, 1); p.r('#f0e070', 11, 13, 2, 1); }
  },
  candle(p, f) {
    p.r('#2a2a34', 0, 0, 16, 16); p.r('#3a3444', 1, 1, 14, 14);
    p.r('#1a1a22', 5, 13, 6, 2); p.r('#4a3a2a', 7, 6, 2, 8); p.r('#f0e8d0', 6, 4, 4, 4);
    p.r(f % 2 ? '#ffd060' : '#ffb040', 7, 1, 2, 3); p.r('#ffffff', 7, 2, 1, 1);
  },
});
Object.assign(TILE_FRAMES, { pad: 4, glass: 2, marsh: 2, candle: 2 });
Object.assign(TILE_VARIANTS, { marsh: 4, grave: 2 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) {
    if (name === 'pad') f = Math.floor(Game.t * 6);
    if (name === 'candle') f = Math.floor(Game.t * 4);
    if (name === 'glass') f = Math.floor(Game.t * 0.5);
    return gt(name, f, v);
  };
}
/* Candles glow through the Veil Hall's darkness */
{
  const dw0 = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw0(ctx);
    if (!World.map.dim) return;
    const [cx, cy] = this.camera();
    for (let y = 0; y < World.h; y++) for (let x = 0; x < World.w; x++) {
      if (World.ch(x, y) !== '!') continue;
      const sx = x * TS + 8 - cx, sy = y * TS + 3 - cy;
      if (sx < -40 || sy < -40 || sx > SCREEN_W + 40 || sy > SCREEN_H + 40) continue;
      const g = ctx.createRadialGradient(sx, sy, 1, sx, sy, 22);
      g.addColorStop(0, 'rgba(255,210,120,0.55)'); g.addColorStop(1, 'rgba(255,180,80,0)');
      ctx.fillStyle = g; ctx.fillRect(sx - 22, sy - 22, 44, 44);
      ctx.fillStyle = Math.floor(Game.t * 4) % 2 ? '#ffd060' : '#ffb040'; ctx.fillRect(sx - 1, sy - 2, 2, 3);
    }
  };
}

/* ---------- Buildings: the tower and the Lantern Warehouse ---------- */
HALL_THEME.veil = { roof: '#4a3a6a', wall: '#c8c0d4', trim: '#2a2238', light: '#c8a0ff', banner: '#6a4aa8' };
BUILD_STYLE.warehouse = { roof: '#6a5a48', wall: '#d8c8a8', emblem: 'lantern' };
{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind === 'tower') return renderTower(b);
    if (b.kind === 'warehouse') return renderWarehouse(b);
    return rb0(b);
  };
}
function renderTower(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  p.r('#2a2e3a', 4, 0, W - 8, H); p.r('#3a4252', 5, 1, W - 10, H - 2);
  for (let y = 6; y < H - 22; y += 8) {
    for (let x = 8; x < W - 8; x += 6) { p.r('#6ab0d8', x, y, 4, 5); p.r('#a8e0f8', x, y, 4, 1); windows.push({ x: x + 2, y: y + 2, r: 8 }); }
    p.r('#2a2e3a', 5, y + 6, W - 10, 1);
  }
  p.r('#5a6270', 2, H - 22, W - 4, 22); p.r('#7a8290', 3, H - 22, W - 6, 2);
  p.r('#e8e8f0', W / 2 - 18, H - 19, 36, 5); p.r('#3a4252', W / 2 - 16, H - 18, 32, 3); p.r('#ffd060', W / 2 - 15, H - 17, 4, 1);
  p.r('#c8ccd4', W / 2 - 2, -1, 4, 4); p.r('#e85a4a', W / 2 - 1, -1, 2, 1);
  const dx = b.door * TS;
  p.r('#2a2e3a', dx - 3, H - 12, 22, 12); p.r('#bfe6f5', dx - 2, H - 11, 20, 11); p.r('#2a2e3a', dx + 7, H - 11, 2, 11); p.r('#e8f8ff', dx, H - 10, 4, 4);
  windows.push({ x: dx + 8, y: H - 6, r: 16 });
  return { img: c, windows };
}
function renderWarehouse(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
  p.r('#4a3a2a', 0, 4, W, 18); p.r('#6a5a48', 1, 4, W - 2, 16);
  for (let x = 2; x < W - 2; x += 4) p.r('#5a4a38', x, 5, 1, 15);
  p.r('#8a7a62', 1, 4, W - 2, 2);
  p.r('#d8c8a8', 0, 22, W, H - 22); for (let y = 25; y < H - 3; y += 4) p.r('#c4b494', 0, y, W, 1);
  p.r('#8a7a68', 0, H - 3, W, 3);
  // big shutter door
  const dx = b.door * TS - 4;
  p.r('#3a3a44', dx, H - 22, 24, 19); for (let y = H - 21; y < H - 3; y += 2) p.r('#7a7a88', dx + 1, y, 22, 1);
  // lantern sign
  p.r(PAL.ink, W - 22, 8, 16, 11); p.r('#f0e8d0', W - 21, 9, 14, 9);
  p.r('#5a4030', W - 15, 10, 2, 1); p.r('#e8a040', W - 17, 11, 6, 5); p.r('#ffe08a', W - 16, 12, 4, 3); p.r('#5a4030', W - 17, 16, 6, 1);
  return { img: c, windows: [{ x: W - 14, y: 13, r: 14 }] };
}

/* ---------- Lift props ---------- */
{
  const dp0 = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'lift') {
      const p = pen(ctx);
      p.r('#3a4252', sx, sy - 10, 16, 26); p.r('#8a92a0', sx + 1, sy - 9, 14, 24); p.r('#5a6270', sx + 7, sy - 9, 2, 24);
      p.r('#c8ccd4', sx + 2, sy - 8, 5, 22); p.r('#c8ccd4', sx + 9, sy - 8, 5, 22);
      const lit = S.has('tower_key') || World.id === 'ml_tower_4';
      p.r(lit ? '#4ad080' : '#e85a4a', sx + 6, sy - 14, 4, 3);
      return;
    }
    return dp0(ctx, pr, sx, sy, t);
  };
}

/* ---------- Starseed Honey ---------- */
DATA.items.rare_candy.field = false;
DATA.items.rare_candy.use = 'candy';
UI.useKey = Object.assign(UI.useKey || {}, {
  async candy(k) {
    if (!G.party.length) return;
    const t = await UI.party({ mode: 'pick', title: 'Give the Starseed Honey to which Wildmon?', hint: 'Choose a Wildmon.' });
    if (t < 0) return;
    const m = G.party[t];
    if (m.lv >= 100) { await UI.dialog("It won't have any effect."); return; }
    S.take(k, 1);
    const growth = DATA.species[m.sp].growth;
    const before = Mon.stats(m); m.lv++; const after = Mon.stats(m);
    m.exp = Math.max(m.exp, Mon.expAt(growth, m.lv));
    if (m.hp > 0) m.hp = Math.min(after.hp, m.hp + (after.hp - before.hp));
    m.bond = Math.min(255, (m.bond || 0) + 2);
    Sound.sfx('levelup'); Game.dirty = true;
    await UI.dialog(`${Mon.name(m)} reached Lv ${m.lv}!`);
    for (const id of Mon.newMovesAt(m.sp, m.lv)) await UI.learnMove(m, id, (txt) => UI.dialog(txt));
    const opts = Mon.evoOptions(m, { time: Game.phase().night ? 'night' : 'day', levelUp: true });
    if (opts.length) await evolveChoose(m, opts);
    Game.achieve('sweet_tooth');
  },
});
DATA.achievements.sweet_tooth = { name: 'Sweet Tooth', desc: 'Give a Wildmon a Starseed Honey.' };
DATA.items.climbing_gear && (DATA.items.climbing_gear.desc = DATA.items.climbing_gear.desc || 'Ropes and spikes for climbing rocky slopes.');

/* ---------- Badges, rest points, battle backdrops ---------- */
DATA.badges.veil = { name: 'Veil Badge', hall: 'Veil Hall', town: 'Ashgrave', master: 'Vesper' };
Object.assign(DATA.restPoints, {
  glasswater: { map: 'glass_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Opal: Your Wildmon are all better now. Please take care out there!' },
  saltmere: { map: 'salt_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Brine: Your Wildmon are all better now. Please take care out there!' },
  ashgrave: { map: 'ash_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Vale: Your Wildmon are all better now. Please take care out there!' },
});
{
  const bg0 = BattleScene.bg.bind(BattleScene);
  BattleScene.bg = function (kind) {
    if (kind === 'grass' && World.map && (World.id === 'saltmere' || World.id === 'route7')) return { sky: ['#8a9aa8', '#c8d0d0'], ground: '#5a7a58', plat: '#7a9a6a', plat2: '#4a6a48' };
    if (kind === 'grass' && World.id === 'ashgrave') return { sky: ['#3a3450', '#7a6a8a'], ground: '#4a5a48', plat: '#6a7a62', plat2: '#3a4a38' };
    if (World.map && World.map.dim && kind !== 'water') return { sky: ['#14101e', '#2a2238'], ground: '#2a2434', plat: '#3a3448', plat2: '#1e1a28' };
    if (World.map && /^ml_tower/.test(World.id)) return { sky: ['#2a2e3a', '#5a6a80'], ground: '#7a8290', plat: '#a8b0bc', plat2: '#5a6270' };
    return bg0(kind);
  };
}
DATA.achievements.order_foiled = DATA.achievements.order_foiled || { name: 'Lights Out', desc: 'Defeat Morrow in his own tower.' };
