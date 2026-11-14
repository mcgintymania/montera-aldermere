'use strict';
/* =====================================================================
   POST-GAME SYSTEMS — the Hollow Vault building, Battle Spire
   battle rules (no EXP, no items), save fields, rest point, glider.
   ===================================================================== */
{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind !== 'vault') return rb0(b);
    const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d'));
    p.r('#2a2a32', 0, 6, W, H - 6); p.r('#4a4a54', 1, 7, W - 2, H - 8); p.r('#5a5a64', 0, 2, W, 6); p.r('#6a6a74', 2, 0, W - 4, 3);
    for (let x = 4; x < W - 4; x += 8) p.r('#3a3a44', x, 10, 2, H - 14);
    p.r('#c84a2a', W / 2 - 6, 9, 12, 3); p.r('#e8c040', W - 8, 12, 4, 4);
    const dx = b.door * TS; const open = G && G.flags.vault_open;
    p.r('#1a1a20', dx - 4, H - 16, 24, 16); p.r(open ? '#0a0a10' : '#6a6a74', dx - 3, H - 15, 22, 15);
    if (!open) { p.r('#3a3a44', dx + 7, H - 15, 2, 15); p.ell('#8a6ae8', dx + 8, H - 8, 3, 3); }
    return { img: c, windows: [] };
  };
}

/* ---------- Battle Spire rules ---------- */
{
  const ax0 = BattleScene.awardExp.bind(BattleScene);
  BattleScene.awardExp = async function (loser) { if (this.B && this.B.opts && this.B.opts.noExp) return; return ax0(loser); };
  const use0 = BattleScene.useItem.bind(BattleScene);
  BattleScene.useItem = async function (act) {
    if (this.B && this.B.opts && this.B.opts.noItems) { await this.say('Items can\'t be used in the Battle Spire!'); return null; }
    return use0(act);
  };
  const bg0 = BattleScene.bg.bind(BattleScene);
  BattleScene.bg = function (kind) {
    if (World.map && World.id === 'spire_lobby') return { sky: ['#1a1440', '#5a3a8a'], ground: '#e8e0c8', plat: '#f4ecd8', plat2: '#c8bca0' };
    if (World.map && (World.id === 'starfall' || World.id === 'starfall_peak')) return { sky: ['#2a3a7a', '#e8a8c8'], ground: '#8ab060', plat: '#a8c878', plat2: '#6a9048' };
    if (World.map && World.id === 'hollow_vault') return { sky: ['#0a0812', '#3a2a5a'], ground: '#4a4a54', plat: '#6a6a74', plat2: '#2a2a32' };
    return bg0(kind);
  };
}

/* ---------- Save fields ---------- */
{
  const mig0 = Save.migrate.bind(Save);
  Save.migrate = function (d) { d = mig0(d); if (d && typeof d === 'object') { if (typeof d.bp !== 'number') d.bp = 0; if (!Array.isArray(d.hof)) d.hof = []; } return d; };
}
DATA.restPoints.starfall = { map: 'star_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Stella: Your Wildmon are all better now. Enjoy the stars!' };
if (typeof GLIDE_ORDER !== 'undefined') GLIDE_ORDER.push('starfall');
