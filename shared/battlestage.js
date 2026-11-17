'use strict';
/* =====================================================================
   BATTLE STAGE — side-on duels. Both Wildmon stand on the same ground
   and face each other; the backdrop shows where the battle is; the
   name plates sit along the top, yours on the left. Shared by both games.
   ===================================================================== */
const STAGE = { feet: 120, px: 66, ex: 174, horizon: 84 };
const stagePos = (si) => ({ x: si === 1 ? STAGE.ex : STAGE.px, y: STAGE.feet });

/* scenery behind the battle, by kind of place */
function drawBackdrop(ctx, kind, t, night) {
  const bg = BattleScene.bg(kind); const H = STAGE.horizon; const P = (c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, bg.sky[0]); sky.addColorStop(1, bg.sky[1]);
  ctx.fillStyle = sky; ctx.fillRect(-4, 0, SCREEN_W + 8, H + 2);
  if (kind === 'cave') {
    P('#2a2430', -4, 0, SCREEN_W + 8, H + 2);
    for (let i = 0; i < 18; i++) { const x = (i * 29) % 250 - 4, w = 6 + (i * 7) % 9, h = 8 + (i * 13) % 22; P('#3a3240', x, 0, w, h); P('#46404e', x + 1, 0, w - 3, h - 3); P('#3a3240', x + w / 2 - 1, h, 2, 3); }
    for (let i = 0; i < 12; i++) { const x = (i * 41 + 9) % 250 - 4, h = 14 + (i * 11) % 18; P('#352e3c', x, H - h, 10 + (i % 3) * 4, h); }
    for (let i = 0; i < 6; i++) { const x = (i * 47 + 20) % 240, y = 18 + (i * 23) % 50; const a = 0.45 + 0.35 * Math.sin(t * 2 + i); P(`rgba(140,220,255,${a})`, x, y, 2, 2); }
  } else if (kind === 'water') {
    if (!night) { P('rgba(255,255,255,0.75)', 24, 18, 26, 5); P('rgba(255,255,255,0.75)', 30, 14, 14, 5); P('rgba(255,255,255,0.6)', 168, 26, 30, 4); }
    else for (let i = 0; i < 24; i++) P('#fff6d8', (i * 37) % 240, (i * 19) % 60, 1, 1);
    P(shade(bg.ground, 0.15), -4, H - 10, SCREEN_W + 8, 12);
    for (let i = 0; i < 16; i++) { const x = ((i * 31 + t * 12) % 260) - 10; P('rgba(255,255,255,0.55)', x, H - 6 + (i % 3) * 3, 8, 1); }
  } else if (kind === 'indoor') {
    P('#8a6a4a', -4, 0, SCREEN_W + 8, H + 2); P('#a07a54', -4, 0, SCREEN_W + 8, 6);
    for (let x = 6; x < 240; x += 34) { P('#6a4e34', x, 6, 4, H - 6); P('#c8963a', x + 12, 22, 12, 28); P('#e8c46a', x + 14, 24, 8, 24); P('#7a4b2a', x + 12, 50, 12, 3); }
    for (let x = 22; x < 240; x += 68) { const a = 0.55 + 0.25 * Math.sin(t * 3 + x); P('#3a2a1a', x, 58, 8, 10); P(`rgba(255,200,90,${a})`, x + 2, 60, 4, 6); }
  } else {
    if (!night) { P('rgba(255,255,255,0.8)', 30, 16, 28, 6); P('rgba(255,255,255,0.8)', 38, 11, 14, 6); P('rgba(255,255,255,0.65)', 176, 24, 34, 5); P('rgba(255,255,255,0.65)', 186, 20, 16, 5); }
    else { for (let i = 0; i < 30; i++) P(i % 7 ? '#e8ecff' : '#fff2b0', (i * 41) % 240, (i * 17) % 64, 1, 1); P('#fff6d8', 196, 14, 8, 8); P(bg.sky[0], 199, 13, 7, 7); }
    const hill = (base, amp, col, seed) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-4, H + 2); for (let x = -4; x <= SCREEN_W + 4; x += 6) ctx.lineTo(x, base - amp * (0.5 + 0.5 * Math.sin(x / 31 + seed) * Math.cos(x / 17 + seed * 2))); ctx.lineTo(SCREEN_W + 4, H + 2); ctx.fill(); };
    hill(H - 16, 14, night ? '#2a3a5a' : '#9cc8b8', 1.3);
    hill(H - 6, 10, night ? '#1e3a2e' : shade(bg.plat2, -0.15), 4.1);
    for (let i = 0; i < 9; i++) { const x = (i * 53 + 11) % 250 - 6, y = H - 4; P(night ? '#14281e' : '#3f7a3a', x, y - 14, 10, 12); P(night ? '#1c3428' : '#4f9a48', x + 2, y - 16, 6, 5); P('#5a3a20', x + 4, y - 3, 2, 4); }
  }
  // the ground, with a little perspective
  const gr = ctx.createLinearGradient(0, H, 0, SCREEN_H); gr.addColorStop(0, shade(bg.ground, 0.1)); gr.addColorStop(1, shade(bg.ground, -0.18));
  ctx.fillStyle = gr; ctx.fillRect(-4, H, SCREEN_W + 8, SCREEN_H - H);
  P(shade(bg.ground, -0.22), -4, H, SCREEN_W + 8, 1);
  for (let r = 0; r < 6; r++) { const y = H + 4 + r * r * 2.2; P(shade(bg.ground, -0.08), -4, y, SCREEN_W + 8, 1); }
  for (let i = 0; i < 26; i++) { const y = H + 6 + (i * 13) % 70; P(shade(bg.ground, kind === 'cave' ? 0.12 : -0.15), (i * 37) % 240, y, 2 + (y - H) / 30, 1); }
  // a pool of lantern light under each Wildmon
  for (const x of [STAGE.px, STAGE.ex]) {
    const g = ctx.createRadialGradient(x, STAGE.feet, 2, x, STAGE.feet, 30); g.addColorStop(0, night || kind === 'cave' ? 'rgba(255,214,120,0.45)' : 'rgba(255,244,200,0.35)'); g.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, STAGE.feet, 30, 8, 0, 0, Math.PI * 2); ctx.fill();
  }
}

Object.assign(BattleScene, {
  draw(ctx) {
    if (this.D && typeof Doubles !== 'undefined') return Doubles.draw(ctx);
    if (!this.B) return;
    const A = this.anim, B = this.B, t = this.t, tw = A.tw || {}, k = tw.k || 0;
    let sx = 0; if (A.shake > 0) sx = Math.round(Math.sin(t * 60) * 2);
    ctx.save(); ctx.translate(sx, 0);
    drawBackdrop(ctx, B.bgk, t, Game.phase().light > 0.5);
    const intro = tw.kind === 'intro' ? 1 - k : 0;
    const ex = STAGE.ex + intro * 120, px = STAGE.px - intro * 120, fy = STAGE.feet;
    // the other trainer, facing you
    const e = B.sides[1].a.mon;
    if (A.trainerX !== null && B.trainer) {
      let tx = ex; if (tw.kind === 'trainerOut') tx = ex + k * 80; if (tw.kind === 'trainerBack') tx = ex + (1 - k) * 80;
      ctx.drawImage(charSprite(DATA.looks[B.trainer.look], 'left', 0), 0, 0, 16, 17, tx - 24, fy - 51 + 2, 48, 51);
    }
    if (!A.eHide || tw.kind === 'eFaint') {
      let ey = 0, scale = 1, lx = 0, clipH = 48;
      if (tw.kind === 'eIn') scale = k;
      if (tw.kind === 'eFaint') { ey = k * 30; clipH = Math.max(0, 48 - k * 48); }
      if (tw.kind === 'eLunge') lx = -Math.sin(k * Math.PI) * 10;
      const vis = !(A.blink && A.blink.side === 1 && Math.floor(A.blink.t * 16) % 2);
      if (vis) this.drawMon(ctx, e, false, ex + lx, fy + ey, scale, clipH, A.tint && A.tint.side === 1);
    }
    // you, before sending out
    const p = B.sides[0].a.mon;
    if (A.pHide && tw.kind !== 'pFaint') ctx.drawImage(charSprite(G.look, 'right', 0), 0, 0, 16, 17, px - 24, fy - 51 + 2, 48, 51);
    if (!A.pHide || tw.kind === 'pFaint') {
      let py = 0, scale = 1, lx = 0, clipH = 48;
      if (tw.kind === 'pIn') scale = k;
      if (tw.kind === 'pFaint') { py = k * 30; clipH = Math.max(0, 48 - k * 48); }
      if (tw.kind === 'pLunge') lx = Math.sin(k * Math.PI) * 10;
      const vis = !(A.blink && A.blink.side === 0 && Math.floor(A.blink.t * 16) % 2);
      if (vis) this.drawMon(ctx, p, true, px + lx, fy + py, scale, clipH, A.tint && A.tint.side === 0);
    }
    // the Lantern, thrown across
    const by0 = fy - 22;
    if (tw.kind === 'throw') { const bx = STAGE.px + (STAGE.ex - STAGE.px) * k, by = by0 - Math.sin(k * Math.PI) * 50; this.drawLantern(ctx, bx, by, 0); }
    else if (A.ball) {
      let wob = 0; if (tw.kind === 'wobble') wob = Math.sin(k * Math.PI * 2) * 0.35;
      let by = by0 + 12; if (tw.kind === 'drop') by = by0 - 30 + 42 * k;
      if (tw.kind === 'drop') { ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(STAGE.ex, by0 - 10, 0, STAGE.ex, by0 - 10, 30 * (1 - k)); gl.addColorStop(0, 'rgba(255,240,200,0.9)'); gl.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = gl; ctx.fillRect(STAGE.ex - 36, by0 - 46, 72, 72); ctx.globalCompositeOperation = 'source-over'; }
      this.drawLantern(ctx, STAGE.ex, by, wob, A.ball.stars);
    }
    // effects
    const mid = fy - 24;
    if (A.typeFx) this.drawTypeFx(ctx, A.typeFx, ex, px);
    if (A.statFx) { const s = A.statFx.side, cx = s === 1 ? ex : px; ctx.fillStyle = A.statFx.up ? 'rgba(255,140,90,0.9)' : 'rgba(90,150,255,0.9)'; for (let i = 0; i < 6; i++) { const off = ((t * 60 + i * 9) % 40) * (A.statFx.up ? -1 : 1); const x = cx - 18 + i * 7, y = mid + off * 0.6; ctx.fillRect(x, y, 2, 6); ctx.fillRect(x - 1, A.statFx.up ? y : y + 4, 4, 2); } }
    for (const f of A.fx) { const cx = f.si === 1 ? ex : px; const r = 8 + f.t * 34; ctx.fillStyle = `rgba(255,255,220,${1 - f.t / f.life})`; const x = cx + Math.cos(f.a) * r, y = mid + Math.sin(f.a) * r * 0.8; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); }
    if (A.guardFx) { const s = A.guardFx.side, cx = s === 1 ? ex : px; ctx.strokeStyle = `rgba(150,220,255,${A.guardFx.t + 0.2})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, mid, 26, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1; }
    const wk = B.weather && B.weather.k;
    if (wk === 'rain') { ctx.fillStyle = 'rgba(30,50,90,0.18)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.fillStyle = 'rgba(200,220,255,0.6)'; for (let i = 0; i < 60; i++) ctx.fillRect(Math.round((i * 53 + t * 50) % 250 - 5), Math.round((i * 97 + t * 260) % 190 - 10), 1, 5); }
    if (wk === 'sun') { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(80,50,0,0.18)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.globalCompositeOperation = 'source-over'; }
    if (wk === 'sand') { ctx.fillStyle = 'rgba(200,160,90,0.25)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.fillStyle = 'rgba(230,200,140,0.8)'; for (let i = 0; i < 50; i++) ctx.fillRect(Math.round((i * 61 + t * 160) % 250 - 5), Math.round((i * 37 + t * 20) % 176), 2, 1); }
    if (wk === 'hail') { ctx.fillStyle = 'rgba(220,240,255,0.15)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.fillStyle = '#f0f8ff'; for (let i = 0; i < 30; i++) ctx.fillRect(Math.round((i * 53 + t * 40) % 250 - 5), Math.round((i * 89 + t * 180) % 190 - 10), 2, 2); }
    if (A.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${Math.min(0.8, A.flash)})`; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); }
    if (tw.kind === 'intro') { ctx.fillStyle = '#000'; for (let i = 0; i < 11; i++) { const w = (1 - k) * SCREEN_W; ctx.fillRect(i % 2 ? SCREEN_W - w : 0, i * 16, w, 16); } }
    ctx.restore();
  },
  /* yours faces right, theirs faces left: both drawn from the front */
  drawMon(ctx, m, mine, cx, by, scale, clipH) {
    const blink = Math.floor(this.t * 10 + (mine ? 17 : 0)) % 37 === 0;
    const img = MonArt.get(m.sp, { back: false, blink, lustre: m.lustre, mark: m.mark, grey: m.grey });
    const bob = Math.floor(this.t * 2.2 + (mine ? 1 : 0)) % 2;
    const w = Math.round(48 * scale);
    if (w < 1) return;
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(cx, by - 1, 17 * scale, 4 * scale, 0, 0, Math.PI * 2); ctx.fill();
    const sh = Math.min(48, clipH); if (sh <= 0) return;
    const y = Math.round(by - w - 1 + bob * (scale === 1 ? 1 : 0));
    if (mine) { ctx.save(); ctx.translate(Math.round(cx), 0); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, 48, sh, Math.round(-w / 2), y, w, Math.round(sh * scale)); ctx.restore(); }
    else ctx.drawImage(img, 0, 0, 48, sh, Math.round(cx - w / 2), y, w, Math.round(sh * scale));
    if (m.lustre && Math.floor(this.t * 3) % 4 === 0) { ctx.fillStyle = '#fffbe0'; ctx.fillRect(Math.round(cx + 14), Math.round(by - 40), 2, 2); ctx.fillRect(Math.round(cx - 16), Math.round(by - 24), 1, 1); }
  },
  drawTypeFx(ctx, f, ex, px) {
    const cx = f.side === 1 ? ex : px, cy = STAGE.feet - 24;
    const col = DATA.typeColors[f.type || 'normal']; const k = 1 - f.t / 0.45;
    ctx.fillStyle = col; ctx.globalAlpha = 0.85;
    if (f.cast) { for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2 + k * 3; const r = 26 * (1 - k); ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), 3, 3); } }
    else { for (let i = 0; i < 7; i++) { const a = i * 0.9 + k * 2; const r = 6 + k * 18; ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r * 0.8), 3, 3); } ctx.fillRect(cx - 8 + k * 4, cy - 1, 16 - k * 8, 2); ctx.fillRect(cx - 1, cy - 8 + k * 4, 2, 16 - k * 8); }
    ctx.globalAlpha = 1;
  },
});

/* doubles: two a side, the back one a little higher */
Object.assign(Doubles, {
  pos(si, s) { const base = si === 1 ? STAGE.ex : STAGE.px; const dir = si === 1 ? 1 : -1; return { x: base + dir * (s === 0 ? -14 : 26), y: STAGE.feet + (s === 0 ? 6 : -10) }; },
  draw(ctx) {
    const D = this.D; if (!D) return;
    const t = D.t; let sx = D.shake > 0 ? Math.round(Math.sin(t * 60) * 2) : 0;
    ctx.save(); ctx.translate(sx, 0);
    drawBackdrop(ctx, D.bgk, t, Game.phase().light > 0.5);
    const order = []; for (const si of [0, 1]) for (const s of [1, 0]) order.push([si, s]);
    for (const [si, s] of order) {
      const x = D.slots[si][s]; const key = si + ':' + s; const fd = D.fade[key] || 0;
      if (!x || (x.a.mon.hp <= 0 && fd >= 1)) continue;
      const p = this.pos(si, s); let lx = 0;
      if (D.lunge && D.lunge.side === si && D.lunge.slot === s) lx = (si === 0 ? 1 : -1) * Math.sin((1 - D.lunge.t / 0.2) * Math.PI) * 8;
      if (D.blink && D.blink.side === si && D.blink.slot === s && Math.floor(D.blink.t * 16) % 2) continue;
      const scale = D.pop && D.pop.si === si && D.pop.s === s ? 1 - D.pop.t / 0.35 : 1;
      const m = x.a.mon; const img = MonArt.get(m.sp, { back: false, lustre: m.lustre, mark: m.mark, grey: m.grey });
      const clip = Math.max(0, 48 - fd * 48);
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(p.x + lx, p.y - 1, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      if (clip > 0 && scale > 0.05) {
        const w = Math.round(48 * scale); const y = Math.round(p.y - w - 1 + fd * 30);
        if (si === 0) { ctx.save(); ctx.translate(Math.round(p.x + lx), 0); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, 48, clip, Math.round(-w / 2), y, w, Math.round(clip * scale)); ctx.restore(); }
        else ctx.drawImage(img, 0, 0, 48, clip, Math.round(p.x + lx - w / 2), y, w, Math.round(clip * scale));
      }
    }
    if (D.typeFx) { const p = this.pos(D.typeFx.side, D.typeFx.slot); ctx.fillStyle = DATA.typeColors[D.typeFx.type || 'normal']; ctx.globalAlpha = 0.8; for (let i = 0; i < 8; i++) { const a = i * 0.8 + t * 9; ctx.fillRect(Math.round(p.x + Math.cos(a) * (10 + i * 2)), Math.round(p.y - 22 + Math.sin(a) * 10), 3, 3); } ctx.globalAlpha = 1; }
    if (D.statFx) { const p = this.pos(D.statFx.side, D.statFx.slot); ctx.fillStyle = D.statFx.up ? 'rgba(255,140,90,0.9)' : 'rgba(90,150,255,0.9)'; for (let i = 0; i < 5; i++) { const off = ((t * 60 + i * 9) % 30) * (D.statFx.up ? -1 : 1); ctx.fillRect(p.x - 14 + i * 7, p.y - 22 + off * 0.6, 2, 6); } }
    const wk = D.E.weather && D.E.weather.k;
    if (wk === 'rain') { ctx.fillStyle = 'rgba(200,220,255,0.6)'; for (let i = 0; i < 60; i++) ctx.fillRect(Math.round((i * 53 + t * 50) % 250 - 5), Math.round((i * 97 + t * 260) % 190 - 10), 1, 5); }
    if (wk === 'sun') { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(80,50,0,0.18)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); ctx.globalCompositeOperation = 'source-over'; }
    if (wk === 'sand') { ctx.fillStyle = 'rgba(200,160,90,0.25)'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); }
    if (D.intro > 0) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H); }
    ctx.restore();
  },
});
