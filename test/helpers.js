window.T = {
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  key(a) { MQ.Input.queue.push(a); },
  async clear(max = 80, pick) {
    for (let i = 0; i < max; i++) {
      await T.sleep(90);
      if (!MQ.UI.open && !MQ.Script.running && !MQ.Game.busy) { await T.sleep(150); if (!MQ.UI.open && !MQ.Script.running && !MQ.Game.busy) return true; }
      if (pick !== undefined && document.querySelector('.menu.choice')) { for (let k = 0; k < pick; k++) T.key('down'); pick = undefined; await T.sleep(60); }
      T.key('a');
    }
    return false;
  },
  async step(d) {
    const p = MQ.Game.player; const sx = p.x, sy = p.y, sm = MQ.World.id;
    MQ.Input.pressDir(d);
    for (let i = 0; i < 60; i++) { await T.sleep(16); if (p.moving || MQ.World.id !== sm || MQ.Game.busy) break; }
    MQ.Input.releaseDir(d);
    for (let i = 0; i < 120; i++) { await T.sleep(16); if (!p.moving && !MQ.Game.busy && MQ.Game.fade === 0) break; }
    return p.x !== sx || p.y !== sy || MQ.World.id !== sm;
  },
  path(tx, ty) {
    const W = MQ.World, p = MQ.Game.player; const key = (x, y) => x + ',' + y;
    const prev = {}; const q = [[p.x, p.y]]; prev[key(p.x, p.y)] = null;
    const D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    while (q.length) {
      const [x, y] = q.shift(); if (x === tx && y === ty) break;
      for (const d in D) { const nx = x + D[d][0], ny = y + D[d][1]; const k = key(nx, ny); if (k in prev) continue;
        const isWarp = !!W.warps[k]; if (!(nx === tx && ny === ty) && isWarp) continue;
        if (W.blocked(nx, ny, p) && !(isWarp && nx === tx && ny === ty)) continue; prev[k] = [x, y, d]; q.push([nx, ny]); }
    }
    if (!(key(tx, ty) in prev)) return null;
    const out = []; let c = key(tx, ty); while (prev[c]) { const [x, y, d] = prev[c]; out.unshift(d); c = key(x, y); } return out;
  },
  async goto(tx, ty) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const path = T.path(tx, ty); if (!path) { await T.sleep(400); continue; }
      let ok = true;
      for (const d of path) { if (!(await T.step(d))) { ok = false; break; } if (MQ.Game.busy || MQ.UI.open) return; }
      if (ok) return;
      await T.sleep(500);
    }
    throw new Error(`goto ${tx},${ty} failed in ${MQ.World.id} at ${MQ.Game.player.x},${MQ.Game.player.y}`);
  },
  async face(d) { const p = MQ.Game.player; if (p.dir === d) return; MQ.Input.pressDir(d); await T.sleep(40); MQ.Input.releaseDir(d); await T.sleep(60); },
  async talkAt(x, y, pick) {
    const p = MQ.Game.player; const opts = [[0, 1, 'up'], [0, -1, 'down'], [1, 0, 'left'], [-1, 0, 'right'], [0, 2, 'up']];
    for (const [dx, dy, d] of opts) { const ax = x + dx, ay = y + dy; if (!T.path(ax, ay)) continue; await T.goto(ax, ay); await T.face(d); T.key('a'); await T.sleep(200); await T.clear(120, pick); return true; }
    throw new Error('cannot reach ' + x + ',' + y);
  },
  async edge(d) { await T.step(d); await T.sleep(500); },
  state() { const p = MQ.Game.player; return { map: MQ.World.id, x: p.x, y: p.y, dir: p.dir }; },
};
Object.assign(window.T, {
  text() { const d = [...document.querySelectorAll('.dialog .dtext')].pop(); return d ? d.textContent : ''; },
  async battle(strategy = 'fight', max = 400) {
    const log = [];
    for (let i = 0; i < max; i++) {
      await T.sleep(110);
      if (MQ.Game.mode !== 'battle' && MQ.Game.mode !== 'evolve') { if (!MQ.UI.open && !MQ.Script.running) return log; if (MQ.UI.open) { if (document.querySelector('.panel.learn')) { T.key('b'); await T.sleep(150); continue; } const ch = document.querySelector('.menu.choice'); if (ch) { const opts = [...ch.querySelectorAll('.mi')].map((e) => e.textContent); const t = T.text(); const want = (/Stop learning|Give up on learning/.test(t) || opts[opts.length - 1] === 'Back') ? 0 : opts.length - 1; for (let k = 0; k < want; k++) T.key('down'); T.key('a'); await T.sleep(150); continue; } if (document.querySelector('.namer')) { document.querySelector('.panel .btn').dispatchEvent(new PointerEvent('pointerdown')); continue; } T.key('a'); } continue; }
      const B = MQ.BattleScene.B; if (!B) continue;
      if (document.querySelector('.namer')) { document.querySelector('.panel .btn').dispatchEvent(new PointerEvent('pointerdown')); continue; }
      if (document.querySelector('.panel.party')) { const p = MQ.G.party; const idx = p.findIndex((m, j) => m.hp > 0 && j !== B.sides[0].idx); const cur = [...document.querySelectorAll('.prow')].findIndex((r) => r.classList.contains('sel')); for (let k = 0; k < (idx - cur + p.length) % p.length; k++) T.key('down'); T.key('a'); await T.sleep(200); T.key('a'); continue; }
      if (document.querySelector('.menu.slots')) { const opts = [...document.querySelectorAll('.menu.slots .mi')].map((e) => e.textContent); const idx = opts.findIndex((o) => o.startsWith('Lantern')); if (idx < 0) { T.key('b'); continue; } for (let k = 0; k < idx; k++) T.key('down'); T.key('a'); log.push('throw'); continue; }
      if (document.querySelector('.panel.learn')) { T.key('b'); await T.sleep(80); continue; }
      const ch = document.querySelector('.menu.choice'); if (ch) { const opts = [...ch.querySelectorAll('.mi')].map((e) => e.textContent); const t = T.text(); const want = (/Stop learning|Give up on learning/.test(t) || opts[opts.length - 1] === 'Back') ? 0 : opts.length - 1; for (let k = 0; k < want; k++) T.key('down'); T.key('a'); continue; }
      if (document.querySelector('.bmoves')) {
        const ms = B.sides[0].a.mon.moves; let best = 0, bp = -1; ms.forEach((m, k) => { const d = MQ.DATA.moves[m.id]; const pw = m.pp > 0 ? (d.pow || 0) * MQ.DATA.typeMult(d.type, MQ.DATA.species[B.sides[1].a.mon.sp].types) : -1; if (pw > bp) { bp = pw; best = k; } });
        const cur = [...document.querySelectorAll('.bmv')].findIndex((e) => e.classList.contains('sel'));
        if (cur !== best) { T.key('right'); await T.sleep(60); continue; }
        T.key('a'); continue;
      }
      if (document.querySelector('.bmenu')) {
        const e = B.sides[1].a.mon; const frac = e.hp / MQ.Mon.maxHp(e);
        const sel = [...document.querySelectorAll('.bmi')].findIndex((d) => d.classList.contains('sel'));
        let want = 0;
        if (strategy === 'catch' && B.kind === 'wild' && (frac < 0.45 || B.sides[0].a.mon.lv > e.lv + 6) && (MQ.G.bag.lantern || 0) > 0) want = 1;
        if (strategy === 'run' && B.kind === 'wild') want = 3;
        if (sel !== want) { T.key('right'); await T.sleep(60); continue; }
        T.key('a'); continue;
      }
      if (document.querySelector('.dialog')) T.key('a');
    }
    return log.concat(['TIMEOUT']);
  },
  async findEncounter(x0, y0, x1, y1, max = 300) {
    for (let i = 0; i < max; i++) {
      const p = MQ.Game.player; const tx = p.x === x0 && p.y === y0 ? x1 : x0, ty = p.x === x0 && p.y === y0 ? y1 : y0;
      try { await T.goto(tx, ty); } catch (e) {}
      await T.sleep(100);
      if (MQ.Game.mode === 'battle' || MQ.Script.running) return true;
    }
    return false;
  },
});
Object.assign(window.T, {
  async idle(max = 400) { for (let i = 0; i < max; i++) { await T.sleep(80); if (MQ.Game.mode === 'battle') await T.battle('fight'); if (!MQ.UI.open && !MQ.Script.running && !MQ.Game.busy && MQ.Game.mode === 'world') return true; if (MQ.UI.open) { const ch = document.querySelector('.menu.choice'); if (ch) { T.key('a'); continue; } T.key('a'); } } return false; },
  async walkTo(x, y, map) {
    const startMap = MQ.World.id;
    for (let k = 0; k < 12; k++) {
      if (MQ.World.id !== startMap) return true;
      if (map && MQ.World.id !== map) throw new Error('walkTo: on ' + MQ.World.id + ' not ' + map);
      const p = MQ.Game.player; if (p.x === x && p.y === y) return true;
      try { await T.goto(x, y); } catch (e) { await T.sleep(200); }
      await T.idle();
    }
    const p = MQ.Game.player; if (p.x !== x || p.y !== y) throw new Error(`walkTo ${x},${y} failed at ${p.x},${p.y} on ${MQ.World.id}`);
    return true;
  },
  async steps(seq) { for (const d of seq) { await T.step(d); await T.sleep(30); for (let i = 0; i < 60 && (MQ.Game.player.moving || MQ.Game.player.sliding); i++) await T.sleep(30); } await T.idle(); },
  async talk(x, y) {
    const opts = [[0, 1, 'up'], [0, -1, 'down'], [1, 0, 'left'], [-1, 0, 'right']];
    for (const [dx, dy, d] of opts) { const ax = x + dx, ay = y + dy; if (!T.path(ax, ay)) continue; try { await T.walkTo(ax, ay); } catch (e) { continue; } await T.face(d); T.key('a'); await T.sleep(250); await T.idle(); return true; }
    throw new Error('cannot reach ' + x + ',' + y);
  },
  async edgeGo(d, n = 1) { for (let i = 0; i < n; i++) { await T.step(d); } await T.sleep(600); await T.idle(); },
  q(id) { const q = MQ.G.quests[id]; return q ? (q.done ? 'done' : q.stage) : null; },
});
