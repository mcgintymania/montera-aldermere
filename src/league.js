'use strict';
/* =====================================================================
   LANTERN LEAGUE SYSTEMS — League tiles and building, the Lantern Road gate,
   Sanctum gate lamps, Gatekeeper backdrops, the Credits roll.
   ===================================================================== */
Object.assign(TILE_DRAW, {
  leaguefloor(p, f, v) {
    p.r('#e8e0c8', 0, 0, 16, 16); p.r('#f4ecd8', 1, 1, 14, 14); p.r('#d8cca8', 0, 15, 16, 1); p.r('#d8cca8', 15, 0, 1, 16);
    if (v % 2) { p.r('#e0c870', 7, 7, 2, 2); }
  },
  leaguewall(p, f, v) {
    p.r('#3a2a5a', 0, 0, 16, 16); p.r('#4a3a6a', 1, 0, 14, 12); p.r('#e8c040', 0, 12, 16, 2); p.r('#2a1a3a', 0, 14, 16, 2);
    p.r('#5a4a7a', 3, 2, 4, 8); p.r('#5a4a7a', 9, 2, 4, 8);
  },
  carpet(p) { p.r('#a82a3a', 0, 0, 16, 16); p.r('#c83a4a', 1, 0, 14, 16); p.r('#e8c040', 1, 0, 1, 16); p.r('#e8c040', 14, 0, 1, 16); },
  gatearch(p, f) {
    p.r('#2a1a3a', 0, 0, 16, 16); p.r('#e8c040', 1, 1, 14, 15); p.r('#1a1024', 3, 3, 10, 13);
    const c = ['#c8a8f8', '#e8d0ff', '#ffffff', '#e8d0ff'][f % 4]; p.r(c, 5, 6, 6, 10); p.r('#ffffff', 7, 9, 2, 3);
  },
});
Object.assign(TILE_FRAMES, { gatearch: 4 });
Object.assign(TILE_VARIANTS, { leaguefloor: 2 });
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name === 'gatearch') f = Math.floor(Game.t * 5); return gt(name, f, v); };
}

/* ---------- The League building ---------- */
{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind !== 'league') return rb0(b);
    const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
    p.r('#2a1a3a', 6, 28, W - 12, H - 28); p.r('#f0e8d8', 8, 30, W - 16, H - 32);
    for (let x = 14; x < W - 14; x += 18) { p.r('#d8ccb0', x, 34, 6, H - 40); p.r('#ffffff', x + 1, 34, 2, H - 40); }
    for (let x = 22; x < W - 22; x += 18) { p.r('#3a2a5a', x, 44, 8, 14); p.r('#ffe7a0', x + 1, 45, 6, 12); windows.push({ x: x + 4, y: 51, r: 12 }); }
    p.r('#3a2a5a', 2, 20, W - 4, 10); p.r('#5a3a8a', 4, 20, W - 8, 6); p.r('#e8c040', 2, 28, W - 4, 2);
    for (let y = 0; y < 20; y++) { const w = Math.round((W - 20) * (y / 20)); p.r(y % 4 < 2 ? '#5a3a8a' : '#4a2a7a', Math.round((W - w) / 2), y + 2, w, 1); }
    p.r('#e8c040', W / 2 - 1, -4, 2, 8); p.ell('#ffe7a0', W / 2, -4, 5, 5); p.ell('#ffffff', W / 2, -5, 2, 2); windows.push({ x: W / 2, y: -4, r: 28 });
    const dx = b.door * TS; p.r('#2a1a3a', dx - 6, H - 22, 28, 22); p.r('#e8c040', dx - 5, H - 21, 26, 21); p.r('#1a1024', dx - 2, H - 18, 20, 18); p.r('#c8a8f8', dx + 6, H - 14, 4, 14);
    p.r('#c8bca0', dx - 10, H - 3, 36, 3);
    return { img: c, windows };
  };
  const dp0 = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    const p = pen(ctx);
    if (pr.type === 'leaguegate') {
      p.r('#3a2a5a', sx, sy + 2, 16, 14); for (let x = 1; x < 16; x += 3) p.r('#e8c040', sx + x, sy + 3, 1, 12); p.r('#e8c040', sx, sy + 2, 16, 2); p.r('#e8c040', sx, sy + 9, 16, 1);
      return;
    }
    if (pr.type === 'gatelamp') {
      const lit = G.flags['beat_' + pr.gate];
      p.r('#2a1a3a', sx + 7, sy + 8, 2, 8); p.r('#2a1a3a', sx + 4, sy + 1, 8, 8); p.r(lit ? '#ffe7a0' : '#5a4a6a', sx + 5, sy + 2, 6, 6);
      if (lit) { ctx.save(); ctx.globalAlpha = 0.35 + Math.sin(t * 4) * 0.1; p.ell('#ffe7a0', sx + 8, sy + 5, 9, 9); ctx.restore(); p.r('#ffffff', sx + 7, sy + 4, 2, 2); }
      return;
    }
    return dp0(ctx, pr, sx, sy, t);
  };
}

/* ---------- Battle backdrops ---------- */
{
  const bg0 = BattleScene.bg.bind(BattleScene);
  const TH = {
    gate_ilsa: { sky: ['#3a2a6a', '#8a6ac8'], ground: '#c8b8f0', plat: '#e8e0ff', plat2: '#a898d8' },
    gate_nyx: { sky: ['#0a0812', '#2a1a3a'], ground: '#2a2234', plat: '#3a3048', plat2: '#1a1424' },
    gate_brigid: { sky: ['#8a2a1a', '#e88a4a'], ground: '#c8a888', plat: '#e8d0b0', plat2: '#a88868' },
    gate_thane: { sky: ['#5a4a3a', '#a8987a'], ground: '#8a7a5a', plat: '#a8987a', plat2: '#6a5a3a' },
    champion_room: { sky: ['#2a1a4a', '#e8c040'], ground: '#a82a3a', plat: '#e8c040', plat2: '#8a1a2a' },
  };
  BattleScene.bg = function (kind) { if (World.map && TH[World.id]) return TH[World.id]; if (World.map && World.id === 'lantern_cave') return bg0('cave'); return bg0(kind); };
}

/* ---------- Credits ---------- */
const Credits = {
  roll(entry) {
    return new Promise((resolve) => {
      Sound.play('fanfare');
      const ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#06040c;color:#f4ecd8;overflow:hidden;font-family:inherit;display:flex;justify-content:center;cursor:pointer';
      const caught = Object.values(G.dex).filter((d) => d.caught).length;
      const hrs = Math.floor((G.playtime || 0) / 3600), mins = Math.floor(((G.playtime || 0) % 3600) / 60);
      const H = (t) => `<div style="margin-top:46px;font-size:13px;letter-spacing:3px;color:#e8c040">${t}</div>`;
      const L = (t) => `<div style="margin-top:8px;font-size:15px">${t}</div>`;
      const team = entry.team.map((m) => L(`${m.name === DATA.species[m.sp].name ? m.name : `${m.name} &middot; ${DATA.species[m.sp].name}`} &middot; Lv. ${m.lv}${m.lustre ? ' &#10022;' : ''}`)).join('');
      const html = `<div class="crd" style="position:absolute;top:100%;width:min(520px,92vw);text-align:center;line-height:1.35">
        <img src="${typeof LOGO_SRC !== 'undefined' ? LOGO_SRC : ''}" style="width:min(320px,70vw);border-radius:12px" alt="">
        ${H('CHAMPION')}${L(G.name)}
        ${H('HALL OF FAME TEAM')}${team}
        ${H('THE JOURNEY')}${L(`${Prog.sigils()} Badges`)}${L(`${caught} Wildmon caught`)}${L(`${hrs}h ${String(mins).padStart(2, '0')}m played`)}
        ${H('YOUR RIVAL')}${L('Kit')}
        ${H('YOUR FRIEND')}${L('Wren')}
        ${H('HALL MASTERS')}${L('Hazel &middot; Coral &middot; Rhea &middot; Brann')}${L('Vesper &middot; Aerin &middot; Torvald &middot; Vance')}
        ${H('GATEKEEPERS OF THE LANTERN LEAGUE')}${L('Ilsa &middot; Nyx &middot; Brigid &middot; Thane')}
        ${H('THE HOLLOW ORDER')}${L('Morrow &middot; Sable &middot; Corvin')}
        ${H('AND')}${L('Professor Thorne &middot; Mum &middot; Captain Rook &middot; Keeper Lumley')}${L('every nurse, sailor, climber, skier and shopkeeper in Aldermere')}
        ${H('THE WILDMON')}${L(`${DATA.speciesList.length} of them, and every one worth meeting`)}
        <div style="margin-top:80px;font-size:22px;letter-spacing:2px">Thank you for playing</div>
        <div style="margin-top:14px;font-size:13px;color:#c8a8f8">The Starfall Isles are waiting...</div>
        <div style="height:60vh"></div></div>`;
      ov.innerHTML = html; document.body.appendChild(ov);
      const el = ov.querySelector('.crd'); const dur = 42000; const t0 = performance.now(); let done = false;
      const total = () => el.offsetHeight + innerHeight;
      const step = (now) => {
        if (done) return;
        const k = Math.min(1, (now - t0) / dur);
        el.style.transform = `translateY(${-k * total()}px)`;
        if (k >= 1) return finish();
        requestAnimationFrame(step);
      };
      const finish = () => { if (done) return; done = true; ov.style.transition = 'opacity .8s'; ov.style.opacity = '0'; setTimeout(() => { ov.remove(); resolve(); }, 800); removeEventListener('keydown', key); };
      const skip = () => { if (performance.now() - t0 > 2500) finish(); };
      const key = () => skip();
      ov.addEventListener('pointerdown', skip); addEventListener('keydown', key);
      requestAnimationFrame(step);
    });
  },
};

DATA.restPoints.lantern_isle = { map: 'isle_hearth', x: 4, y: 4, dir: 'up', text: 'Nurse Aurelia: Your Wildmon are all better now. Good luck in the League!' };
if (typeof GLIDE_ORDER !== 'undefined') GLIDE_ORDER.push('lantern_isle');

/* ---------- Leaving the Sanctum closes every gate again ---------- */
{
  const enter0 = Game.onEnterMap.bind(Game);
  Game.onEnterMap = function () {
    if (!SANCTUM.has(World.id) && GATEKEEPERS.some((k) => G.flags['beat_' + k.id])) {
      for (const k of GATEKEEPERS) delete G.flags['beat_' + k.id];
      delete G.flags.hof_done_run;
    }
    return enter0();
  };
}
