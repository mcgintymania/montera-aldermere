'use strict';
/* =====================================================================
   DROWNED SPIRE SYSTEMS — the Spire building, Iron Hall theme, rockslide,
   story battles that can't be caught or fled, allies, badge, rest points.
   ===================================================================== */
HALL_THEME.iron = { roof: '#3a3a44', wall: '#c8ccd4', trim: '#1a1a22', light: '#ffb060', banner: '#c84a2a' };
{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind !== 'spire') return rb0(b);
    const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
    const cx = W / 2;
    for (let y = 0; y < H - 4; y++) {
      const w = Math.round(14 + (y / H) * (W - 18)); const x = Math.round(cx - w / 2);
      p.r(Math.floor(y / 7) % 2 ? '#2a3a44' : '#3a4a54', x, y, w, 1); p.r('rgba(0,0,0,0.25)', x + w - 4, y, 4, 1);
      if (y % 9 === 4) { p.r('#4a6a6a', x + 2, y, 3, 2); p.r('#5a8a7a', x + w - 7, y + 1, 2, 3); }
    }
    for (let y = 10; y < H - 20; y += 14) { p.r('#1a2028', cx - 2, y, 4, 6); p.r('#6ae8c8', cx - 1, y + 1, 2, 2); }
    p.r('#1a1a24', cx - 4, -1, 8, 6); p.r(G && G.flags.eclipse_over ? '#ffe7a0' : '#8a6ae8', cx - 2, 0, 4, 3);
    p.r('#2a3a44', 0, H - 6, W, 6); p.r('#4a5a64', 1, H - 6, W - 2, 2);
    const dx = b.door * TS; p.r('#0a0e14', dx + 1, H - 18, 14, 18); p.r('#1a2a34', dx + 2, H - 17, 12, 2); p.r('#6ae8c8', dx + 7, H - 14, 2, 2);
    return { img: c, windows: [{ x: cx, y: 2, r: 26 }] };
  };
  const dp0 = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'rockslide') { ctx.drawImage(Gfx.tile('rock', 0, (pr.x % 2)), sx, sy); return; }
    return dp0(ctx, pr, sx, sy, t);
  };
}

/* ---------- Story battles: no catching, no running ---------- */
{
  const use0 = BattleScene.useItem.bind(BattleScene);
  BattleScene.useItem = async function (act) {
    const B = this.B; const it = DATA.items[act.id];
    if (B && B.opts && B.opts.noCatch && it && it.battle === 'catch') { await this.say('It\'s no use! Nocthra\'s darkness swallows the Lantern\'s light!'); return null; }
    return use0(act);
  };
  const run0 = BattleEngine.runAway.bind(BattleEngine);
  BattleEngine.runAway = function (B, n) { if (B && B.opts && B.opts.noRun) return false; return run0(B, n); };
}

/* ---------- Allies ---------- */
DATA.allies.wren3 = { name: 'Wren', look: 'wren', team: [['solstag', 45], ['waspire', 44], ['beamwyrm', 44], ['lumenkoi', 44]] };
DATA.allies.kit2 = { name: 'Kit', look: 'kit', team: [] };
Object.defineProperty(DATA.allies.kit2, 'team', {
  get() {
    const evo = { mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' };
    const pick = RIVAL_PICK[G && G.flags.starter] || 'firecub';
    return [[evo[pick], 47], ['tempestral', 45], ['joltfox', 45], ['psyren', 45]];
  },
});

/* ---------- Badge, rest points, glider ---------- */
DATA.badges.iron = { name: 'Iron Badge', hall: 'Iron Hall', town: 'Ironmouth', master: 'Vance' };
DATA.restPoints.ironmouth = { map: 'iron_hearth', x: 4, y: 4, dir: 'up', text: 'Hearthkeeper Ingrid: Your Wildmon are all better now. Please take care out there!' };
DATA.restPoints.drowned_spire = { map: 'spire_base', x: 16, y: 6, dir: 'left', text: 'Sable: There. They\'re patched up. Try not to fall off this time.' };
if (typeof GLIDE_ORDER !== 'undefined') GLIDE_ORDER.push('ironmouth');
{
  const bg0 = BattleScene.bg.bind(BattleScene);
  BattleScene.bg = function (kind) {
    if (World.map && World.id === 'spire_top') return G.flags.eclipse_over ? { sky: ['#f0c890', '#ffe8c0'], ground: '#5a6a70', plat: '#7a8a90', plat2: '#4a5a60' } : { sky: ['#0a0812', '#2a2040'], ground: '#2a3a44', plat: '#3a4a54', plat2: '#1a2a34' };
    if (World.map && /^spire_/.test(World.id)) return { sky: ['#0e1a24', '#1e3440'], ground: '#2a3a44', plat: '#3a5058', plat2: '#1a2a34' };
    if (World.map && (World.id === 'iron_hall' || World.id === 'ironmouth')) return { sky: ['#3a3a44', '#6a6a78'], ground: '#5a5a62', plat: '#7a7a84', plat2: '#4a4a52' };
    return bg0(kind);
  };
}
