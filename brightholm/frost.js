'use strict';
/* =====================================================================
   FROSTHAVEN SYSTEMS — slippery ice, ice blocks and snowy pines, the Frost
   Hall theme, the glacier Beacon, the eclipse, badge and rest point.
   ===================================================================== */
Object.assign(TILE_DRAW, {
  ice(p, f, v) {
    p.r('#bfe2f6', 0, 0, 16, 16); p.r('#d4ecfa', 1, 1, 14, 14);
    p.r('#ffffff', 3 + (v % 2) * 6, 3, 4, 1); p.r('#ffffff', 2 + (v % 2) * 6, 4, 2, 1); p.r('#a8d0ec', 9 - (v % 2) * 5, 11, 5, 1);
    if (v === 3) p.r('#a8d0ec', 5, 7, 1, 4);
    p.r('#a0c8e4', 0, 15, 16, 1); p.r('#a0c8e4', 15, 0, 1, 16);
  },
  iceblock(p, f, v) {
    TILE_DRAW.ice(p, f, v);
    p.r('rgba(0,0,0,0.18)', 2, 12, 13, 3);
    p.r('#4a88c0', 1, 2, 14, 12); p.r('#7ab8e8', 2, 3, 12, 10); p.r('#a8d8f8', 2, 3, 12, 3); p.r('#e8f8ff', 3, 4, 4, 1); p.r('#e8f8ff', 3, 5, 1, 3);
    p.r('#3a6a9a', 1, 13, 14, 1);
  },
  snowpine(p) {
    p.r('#eef4fa', 0, 0, 16, 16);
    p.r('#5a3a20', 7, 12, 2, 4);
    p.r('#1e5a3a', 2, 8, 12, 5); p.r('#2a6a48', 3, 4, 10, 5); p.r('#2a6a48', 5, 1, 6, 4); p.r('#3a7a5a', 7, 0, 2, 2);
    p.r('#ffffff', 3, 8, 5, 1); p.r('#ffffff', 9, 9, 4, 1); p.r('#ffffff', 4, 4, 4, 1); p.r('#ffffff', 9, 5, 3, 1); p.r('#ffffff', 6, 1, 3, 1);
    p.r('rgba(0,0,0,0.12)', 2, 13, 12, 1);
  },
});
Object.assign(TILE_VARIANTS, { ice: 4 });

/* ---------- Ice: keep sliding in the direction you stepped ---------- */
{
  const arr0 = Game.onArrive.bind(Game);
  Game.onArrive = function () {
    const before = World.id;
    arr0();
    const p = this.player;
    if (World.id !== before || Script.running || this.busy || p.moving) return;
    const t = World.tile(p.x, p.y);
    if (!t || !t.ice || G.surfing) return;
    const [dx, dy] = DIRS[p.dir]; const nx = p.x + dx, ny = p.y + dy;
    if (World.inBounds(nx, ny) && !World.blocked(nx, ny, p) && !World.warps[nx + ',' + ny]) {
      if (!p.sliding) Sound.sfx('slide');
      p.sliding = true; p.startMove(p.dir, nx, ny, 2.4); p.walking = false;
    } else p.sliding = false;
  };
}

/* ---------- Frost Hall theme + the glacier Beacon ---------- */
HALL_THEME.frost = { roof: '#6aa8d8', wall: '#f4f8fc', trim: '#3a5a7a', light: '#e0f4ff', banner: '#c84a4a' };
{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind === 'beacon' && b.ice) {
      const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
      p.r('#9ab0c4', 2, H - 6, W - 4, 6); p.r('#c8d8e8', 3, H - 6, W - 6, 2);
      for (let y = 20; y < H - 6; y++) { const w = W - 12 + Math.round((y - 20) * 0.12); const x = Math.round((W - w) / 2); p.r(Math.floor((y - 20) / 8) % 2 ? '#6aa8d8' : '#f4f8fc', x, y, w, 1); p.r('rgba(0,0,0,0.12)', x + w - 3, y, 3, 1); }
      p.r('#3a4a5a', 8, 16, W - 16, 3); for (let x = 9; x < W - 9; x += 3) p.r('#3a4a5a', x, 12, 1, 4); p.r('#3a4a5a', 8, 12, W - 16, 1);
      const lit = !(G && G.flags.eclipse);
      p.r('#5a6a7a', 13, 4, W - 26, 9); p.r(lit ? '#d8f4ff' : '#6a6a78', 14, 5, W - 28, 7); p.r(lit ? '#ffffff' : '#8a8a98', 16, 6, 4, 3);
      p.r('#6aa8d8', 11, 1, W - 22, 4); p.r('#8ac8f0', 13, 0, W - 26, 2); p.r('#3a4a5a', W / 2 - 1, -2, 2, 3);
      p.r('#ffffff', 9, 15, W - 18, 1);
      const dx = b.door * TS; p.r('#3a4a5a', dx + 3, H - 15, 10, 10); p.r('#1a2430', dx + 4, H - 14, 8, 9); p.r('#c8d8e8', dx + 2, H - 5, 12, 1);
      return { img: c, windows: [{ x: W / 2, y: 8, r: 30, beam: lit }] };
    }
    return rb0(b);
  };
}

/* ---------- The eclipse: a black sun over every outdoor map ---------- */
const Eclipse = { on() { return !!(G && G.flags.eclipse && !G.flags.eclipse_over); } };
{
  const ph0 = Game.phase.bind(Game);
  Game.phase = function () {
    if (Eclipse.on()) return { tint: '#5a4a7a', light: 0.88, night: true };
    return ph0();
  };
  const play0 = Sound.play.bind(Sound);
  Sound.play = function (id) {
    if (Eclipse.on() && World.map && World.map.outdoor && id === World.map.music) id = 'eclipse';
    return play0(id);
  };
  const dw0 = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw0(ctx);
    if (!Eclipse.on() || !World.map.outdoor) return;
    // the black sun with its corona, fixed in the sky corner
    const x = SCREEN_W - 34, y = 26, t = Game.t;
    const g = ctx.createRadialGradient(x, y, 8, x, y, 26 + Math.sin(t * 1.5) * 2);
    g.addColorStop(0, 'rgba(255,240,200,0.9)'); g.addColorStop(0.45, 'rgba(200,170,255,0.35)'); g.addColorStop(1, 'rgba(120,90,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0a0812'; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
  };
}
DATA.badges.frost = { name: 'Frost Badge', hall: 'Frost Hall', town: 'Frosthaven', master: 'Torvald' };
DATA.restPoints.frosthaven = { map: 'frost_hearth', x: 4, y: 4, dir: 'up', text: 'Hearthkeeper Sigrid: Your Wildmon are all better now. Please take care out there!' };
if (typeof GLIDE_ORDER !== 'undefined') GLIDE_ORDER.push('frosthaven');
{
  const bg0 = BattleScene.bg.bind(BattleScene);
  BattleScene.bg = function (kind) {
    if (World.map && ['frostspine', 'frosthaven', 'glacier', 'frost_hall'].includes(World.id) && kind !== 'water') return { sky: Eclipse.on() ? ['#1a1428', '#3a3058'] : ['#a8c8e8', '#e8f2fa'], ground: '#e8eef6', plat: '#ffffff', plat2: '#c8d4e4' };
    return bg0(kind);
  };
}
