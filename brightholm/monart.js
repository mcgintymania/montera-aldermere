'use strict';
/* =====================================================================
   WILDMON SPRITES — every Wildmon is drawn from a body form plus parts.
   art: { f: form, c: main colour, c2: accent, b: belly, s: size, eye,
          ear, tail, horn, wing, back, x: [extra parts], ...form options }
   Sprites face left; the back view is the same drawing mirrored.
   ===================================================================== */
MonArt.render = function (s, opt) {
  const W = 48, H = 48;
  const a = Object.assign({ x: [] }, s.art);
  if (opt.lustre) { const sh = (s.n * 47) % 120 + 120; a.c = hueShift(a.c, sh); a.c2 = hueShift(a.c2, sh * 0.6); a.b = hueShift(a.b, sh); }
  const P = new Array(W * H).fill(null), ID = new Int16Array(W * H).fill(-1);
  let nid = 0;
  const put = (x, y, col, id) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; P[y * W + x] = col; ID[y * W + x] = id; };
  /* shaded ellipse */
  const ell = (cx, cy, rx, ry, col, o = {}) => {
    const id = nid++; if (rx < 0.6 || ry < 0.6) return;
    for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry, d = nx * nx + ny * ny; if (d > 1) continue;
      let c = col;
      if (!o.flat) { const L = -nx * 0.55 - ny * 0.85; if (L > 0.62) c = shade(col, 0.28); else if (L < -0.5) c = shade(col, -0.22); }
      const prev = ID[y * W + x];
      if (!o.noEdge && prev >= 0 && d > 1 - 2.2 / Math.min(rx, ry)) c = shade(col, -0.42);
      put(x, y, c, id);
    }
  };
  /* filled polygon (any shape), lighter on its upper half */
  const poly = (pts, col, o = {}) => {
    const id = nid++; const ys = pts.map((p) => p[1]); const y0 = Math.floor(Math.min(...ys)), y1 = Math.ceil(Math.max(...ys)); const mid = (y0 + y1) / 2;
    for (let y = y0; y <= y1; y++) {
      const yy = y + 0.5; const xs = [];
      for (let i = 0; i < pts.length; i++) { const [x1, y1_] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; if ((y1_ <= yy && y2 > yy) || (y2 <= yy && y1_ > yy)) xs.push(x1 + (yy - y1_) / (y2 - y1_) * (x2 - x1)); }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) put(x, y, !o.flat && y < mid - 1 ? shade(col, 0.14) : !o.flat && y > y1 - 2 ? shade(col, -0.14) : col, id);
    }
  };
  const tri = (pts, col, o) => poly(pts, col, o);
  const rect = (x, y, w, h, col) => { const id = nid++; for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, i === 0 ? shade(col, 0.12) : i === w - 1 ? shade(col, -0.2) : col, id); };
  const px = (x, y, col) => put(x, y, col, nid++);
  /* thick tapered stroke along points */
  const limb = (pts, w0, w1, col) => {
    const id = nid++; const segs = []; let total = 0;
    for (let i = 0; i + 1 < pts.length; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push(l); total += l; }
    let run = 0;
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; const n = Math.max(1, Math.ceil(segs[i] * 2));
      for (let k = 0; k <= n; k++) {
        const t = k / n; const x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; const r = (w0 + (w1 - w0) * ((run + segs[i] * t) / (total || 1))) / 2;
        for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) if ((xx + 0.5 - x) ** 2 + (yy + 0.5 - y) ** 2 <= r * r + 0.25) put(xx, yy, yy < y - r * 0.3 ? shade(col, 0.12) : col, id);
      }
      run += segs[i];
    }
  };
  const eyes = []; const eye = (x, y, big = 1) => eyes.push([x, y, big]);
  const S = a.s || 1, GY = 45, back = !!opt.back;
  const C = a.c, C2 = a.c2, B = a.b; const has = (k) => a.x.includes(k);
  const INK = PAL.ink;

  /* ---------- parts ---------- */
  const flame = (x, y, sz, col1 = '#ff8a3a', col2 = '#ffe060') => {
    tri([[x - sz * 0.6, y], [x + sz * 0.6, y], [x + sz * 0.15, y - sz * 1.7]], col1);
    tri([[x - sz * 0.9, y + 1], [x - sz * 0.1, y], [x - sz * 0.7, y - sz * 1.1]], col1);
    tri([[x - sz * 0.3, y], [x + sz * 0.35, y], [x, y - sz * 1.0]], col2, { flat: true });
  };
  const ears = (hx, hy, hr, type, col = C) => {
    if (!type || type === 'none') return;
    const L = [hx - hr * 0.55, hy - hr * 0.6], R = [hx + hr * 0.4, hy - hr * 0.75];
    for (const [ex, ey] of [R, L]) {
      const k = ex > hx ? 1 : -1;
      if (type === 'point') { tri([[ex - 3 * S, ey + 2], [ex + 3 * S, ey + 2], [ex, ey - 6 * S]], col); if (!back) tri([[ex - 1.4 * S, ey + 1], [ex + 1.4 * S, ey + 1], [ex, ey - 3.5 * S]], shade(B, -0.05), { flat: true }); }
      if (type === 'big') { tri([[ex - 4.5 * S, ey + 3], [ex + 4 * S, ey + 2], [ex + k * 2 * S, ey - 10 * S]], col); if (!back) tri([[ex - 2.2 * S, ey + 1], [ex + 2 * S, ey + 1], [ex + k * 1.5 * S, ey - 6 * S]], '#f0c8a8', { flat: true }); }
      if (type === 'tuft') { tri([[ex - 3 * S, ey + 2], [ex + 3 * S, ey + 2], [ex + 1, ey - 7 * S]], col); px(ex + 1, ey - 7 * S - 1, INK); px(ex + 1, ey - 7 * S - 2, INK); }
      if (type === 'round') { ell(ex, ey, 3.2 * S, 3 * S, col); if (!back) ell(ex, ey + 0.5, 1.7 * S, 1.5 * S, B, { flat: true }); }
      if (type === 'disc') { ell(ex + k * S, ey - S, 4.5 * S, 4.2 * S, col); if (!back) ell(ex + k * S, ey - S, 2.6 * S, 2.4 * S, '#f0b8b8', { flat: true }); }
      if (type === 'long') { ell(ex + k, ey - 6 * S, 2.3 * S, 7 * S, col); if (!back) ell(ex + k, ey - 6 * S, 1.1 * S, 5 * S, '#f8c8c8', { flat: true }); }
      if (type === 'floppy') { ell(ex + k * 3 * S, ey + 4 * S, 2.5 * S, 5.5 * S, shade(col, -0.18)); }
      if (type === 'fin') tri([[ex - 3 * S, ey + 3], [ex + 3 * S, ey + 2], [ex + k * 4 * S, ey - 7 * S]], C2);
      if (type === 'bat') tri([[ex - 4 * S, ey + 3], [ex + 4 * S, ey + 3], [ex + k * 5 * S, ey - 9 * S]], col);
      if (type === 'antenna') { for (let i = 0; i < 7 * S; i++) px(ex + k * i * 0.5, ey - i, shade(col, -0.35)); ell(ex + k * 3.5 * S, ey - 7 * S, 1.8 * S, 1.8 * S, C2); }
      if (type === 'leaf') { poly([[ex, ey + 2], [ex + k * 5 * S, ey - 4 * S], [ex + k * 2 * S, ey - 9 * S], [ex - k * 1 * S, ey - 3 * S]], C2); }
    }
  };
  const horns = (hx, hy, hr, type) => {
    if (!type) return;
    if (type === 'single') tri([[hx - 1.5 * S, hy - hr + 2], [hx + 2 * S, hy - hr + 2], [hx - 1, hy - hr - 6 * S]], '#f0e8d0');
    if (type === 'twin') for (const d of [-1, 1]) tri([[hx + d * 3 * S - 1.5, hy - hr + 2], [hx + d * 3 * S + 1.5, hy - hr + 2], [hx + d * 4.5 * S, hy - hr - 5 * S]], '#e8e0c8');
    if (type === 'curl') for (const d of [1, -1]) { limb([[hx + d * 2 * S, hy - hr * 0.6], [hx + d * 6 * S, hy - hr * 0.9], [hx + d * 8 * S, hy - hr * 0.2], [hx + d * 6 * S, hy + hr * 0.3]], 4 * S, 2 * S, '#d8c8a0'); }
    if (type === 'antler') for (const d of [-1, 1]) { limb([[hx + d * 2, hy - hr], [hx + d * 5 * S, hy - hr - 7 * S], [hx + d * 9 * S, hy - hr - 10 * S]], 2, 1.2, '#a07848'); limb([[hx + d * 4 * S, hy - hr - 5 * S], [hx + d * 1 * S, hy - hr - 10 * S]], 1.6, 1, '#a07848'); }
    if (type === 'sun') { for (const d of [-1, 1]) { for (let i = 0; i < 8 * S; i++) px(hx + d * (2 + i * 0.6), hy - hr - i, '#f0c040'); for (let i = 0; i < 4 * S; i++) px(hx + d * (4 + i * 0.9), hy - hr - 4 * S - i * 0.3, '#f0c040'); } ell(hx, hy - hr - 9 * S, 3.2 * S, 3.2 * S, '#ffe060'); }
    if (type === 'moon') { const mx = hx + 1, my = hy - hr - 6 * S, r = 5 * S; ell(mx, my, r, r, C2); const cut = nid - 1; for (let y = Math.floor(my - r - 1); y <= my + r + 1; y++) for (let x = Math.floor(mx - r - 1); x <= mx + r + 1; x++) { if (x < 0 || y < 0 || x >= W || y >= H) continue; const dx = x + 0.5 - (mx + 3 * S), dy = y + 0.5 - (my - 1.5 * S); if (dx * dx + dy * dy < (4.2 * S) ** 2 && ID[y * W + x] === cut) { P[y * W + x] = null; ID[y * W + x] = -1; } } }
    if (type === 'crown') for (let i = -1; i <= 1; i++) tri([[hx + i * 3 * S - 1.5, hy - hr + 1], [hx + i * 3 * S + 1.5, hy - hr + 1], [hx + i * 3 * S, hy - hr - (i ? 4 : 6) * S]], '#f0c848');
    if (type === 'gem') { tri([[hx - 2 * S, hy - hr + 1], [hx + 2 * S, hy - hr + 1], [hx, hy - hr - 4 * S]], C2); px(hx, hy - hr - 1, '#ffffff'); }
  };
  const tail = (tx, ty, type, col = C) => {
    if (!type || type === 'none') return;
    if (type === 'flame') flame(tx + 3 * S, ty + 2 * S, 5 * S, a.flame || '#ff8a3a', '#ffe060');
    if (type === 'fluff') ell(tx + 2 * S, ty, 4.5 * S, 3 * S, C2);
    if (type === 'puff') ell(tx + 1, ty + 1, 3 * S, 3 * S, C2);
    if (type === 'brush') { limb([[tx, ty], [tx + 6 * S, ty - 3 * S], [tx + 10 * S, ty - 9 * S]], 4 * S, 7 * S, col); ell(tx + 10 * S, ty - 10 * S, 3 * S, 2.5 * S, B, { flat: true }); }
    if (type === 'thin') limb([[tx, ty], [tx + 5 * S, ty - 2 * S], [tx + 9 * S, ty - 6 * S], [tx + 10 * S, ty - 10 * S]], 1.6, 1, shade(col, -0.1));
    if (type === 'whip') limb([[tx - 2, ty + 2], [tx + 7 * S, ty + 4 * S], [tx + 13 * S, ty + 3 * S], [tx + 16 * S, ty]], 4 * S, 1, col);
    if (type === 'curl') { limb([[tx, ty], [tx + 5 * S, ty - 4 * S], [tx + 3 * S, ty - 8 * S], [tx, ty - 6 * S]], 3 * S, 2 * S, col); }
    if (type === 'club') { limb([[tx, ty], [tx + 6 * S, ty + 1], [tx + 10 * S, ty - 1]], 3 * S, 2.5 * S, col); ell(tx + 11 * S, ty - 1, 3.4 * S, 3 * S, C2); }
    if (type === 'bolt') { tri([[tx, ty + 2], [tx + 6 * S, ty - 2 * S], [tx + 3 * S, ty + 1]], col); tri([[tx + 3 * S, ty - 1], [tx + 9 * S, ty - 7 * S], [tx + 6 * S, ty - 2 * S]], col); tri([[tx + 7 * S, ty - 5 * S], [tx + 10 * S, ty - 11 * S], [tx + 9 * S, ty - 5 * S]], C2); }
    if (type === 'leaf') { limb([[tx, ty], [tx + 4 * S, ty - 3 * S]], 1.5, 1.5, '#6a4a2a'); poly([[tx + 3 * S, ty - 3 * S], [tx + 9 * S, ty - 9 * S], [tx + 12 * S, ty - 4 * S], [tx + 7 * S, ty]], C2); }
    if (type === 'fan') poly([[tx, ty], [tx + 9 * S, ty - 8 * S], [tx + 12 * S, ty - 2 * S], [tx + 10 * S, ty + 4 * S]], C2);
    if (type === 'ribbon') { limb([[tx, ty], [tx + 6 * S, ty - 5 * S], [tx + 10 * S, ty + 1], [tx + 15 * S, ty - 4 * S]], 2.5 * S, 1.2, C2); }
    if (type === 'spike') { limb([[tx, ty], [tx + 9 * S, ty - 2 * S]], 3 * S, 2 * S, col); tri([[tx + 8 * S, ty - 4 * S], [tx + 8 * S, ty + 1.5 * S], [tx + 14 * S, ty - 2.5 * S]], C2); }
    if (type === 'fork') { tri([[tx, ty - 1], [tx + 9 * S, ty - 6 * S], [tx + 5 * S, ty + 1]], col); tri([[tx, ty + 1], [tx + 9 * S, ty + 5 * S], [tx + 5 * S, ty]], col); }
    if (type === 'stub') ell(tx + S, ty, 2.2 * S, 1.8 * S, col);
    if (type === 'long') for (const d of [0, 1]) limb([[tx, ty + d * 2], [tx + 8 * S, ty + 3 * S + d * 3], [tx + 15 * S, ty + 6 * S + d * 4]], 2.4 * S, 1.2, d ? shade(C2, -0.15) : C2);
  };
  const backs = (x0, x1, y, type, ry = 4) => {
    if (!type) return;
    const n = Math.max(3, Math.round((x1 - x0) / (4 * S)));
    for (let i = 0; i < n; i++) {
      const x = x0 + (x1 - x0) * (i + 0.5) / n; const yy = y + Math.abs(i - (n - 1) / 2) * 0.6;
      if (type === 'spikes') tri([[x - 2.2 * S, yy + 2], [x + 2.2 * S, yy + 2], [x + 0.5, yy - ry * S]], C2);
      if (type === 'plates') poly([[x - 2.5 * S, yy + 2], [x - 1.5 * S, yy - ry * 0.8 * S], [x + 1.5 * S, yy - ry * 1.1 * S], [x + 2.5 * S, yy + 2]], C2);
      if (type === 'crystals') tri([[x - 1.8 * S, yy + 2], [x + 1.8 * S, yy + 2], [x + (i % 2 ? 2 : -2), yy - (ry + (i % 2) * 2) * S]], i % 2 ? C2 : shade(C2, 0.25));
      if (type === 'quills') limb([[x, yy + 2], [x + 3 * S, yy - ry * S]], 1.4, 0.8, shade(C2, -0.1));
      if (type === 'leaves') ell(x, yy, 2.6 * S, 2 * S, i % 2 ? C2 : shade(C2, 0.15));
      if (type === 'flames' && i % 2 === 0) flame(x, yy + 2, 3.2 * S);
      if (type === 'bumps') ell(x, yy + 1, 2 * S, 1.6 * S, shade(C, -0.12));
    }
    if (type === 'sail') { const pts = [[x0, y + 2]]; for (let i = 0; i <= 4; i++) pts.push([x0 + (x1 - x0) * i / 4, y - ry * S * (i % 2 ? 2.4 : 1.6)]); pts.push([x1, y + 2]); poly(pts, C2); }
  };
  const wing = (x, y, span, type, up = 1, col = C2) => {
    if (type === 'feather') { poly([[x, y], [x + span * 0.55, y - span * 0.75 * up], [x + span, y - span * 0.55 * up], [x + span * 0.8, y - span * 0.1 * up], [x + span * 0.35, y + 2]], col); for (let i = 1; i < 4; i++) limb([[x + span * 0.25 * i, y - span * 0.15 * i * up], [x + span * (0.3 + 0.2 * i), y - span * 0.5 * up]], 1, 1, shade(col, -0.2)); }
    if (type === 'bat') { poly([[x, y], [x + span * 0.4, y - span * 0.8 * up], [x + span, y - span * 0.5 * up], [x + span * 0.8, y - span * 0.15 * up], [x + span * 0.6, y - span * 0.05 * up], [x + span * 0.45, y + span * 0.08], [x + span * 0.25, y + 1]], col); limb([[x, y], [x + span * 0.4, y - span * 0.8 * up], [x + span, y - span * 0.5 * up]], 1.4, 1, shade(col, -0.3)); }
    if (type === 'blade') for (let i = 0; i < 4; i++) tri([[x + span * 0.12 * i, y - span * 0.05 * i * up], [x + span * (0.35 + 0.18 * i), y - span * (0.85 - 0.12 * i) * up], [x + span * (0.25 + 0.18 * i), y - span * 0.1 * i * up + 2]], i % 2 ? shade(col, 0.15) : col);
    if (type === 'insect') { ell(x + span * 0.45, y - span * 0.35 * up, span * 0.5, span * 0.22, '#e8f4ff', { noEdge: false }); }
    if (type === 'fin') tri([[x, y + 1], [x + span * 0.7, y - span * 0.2 * up], [x + span * 0.5, y - span * 0.75 * up]], col);
  };
  const face = (hx, hy, hr, o = {}) => {
    if (back) return;
    if (o.muzzle !== false) ell(hx - hr * 0.62, hy + hr * 0.32, hr * 0.48, hr * 0.38, B, { flat: true });
    const m = o.mouth || a.mouth;
    if (m === 'beak') tri([[hx - hr + 1, hy - 1], [hx - hr + 1, hy + 2.5 * S], [hx - hr - 5 * S, hy + 0.5]], a.beak || '#f0b030');
    else if (m === 'hook') { poly([[hx - hr + 1, hy - 2], [hx - hr - 4 * S, hy - 1], [hx - hr - 5 * S, hy + 2 * S], [hx - hr - 3 * S, hy + 1.5 * S], [hx - hr + 1, hy + 2 * S]], a.beak || '#e8c050'); }
    else if (m === 'long') poly([[hx - hr * 0.6, hy - 1], [hx - hr - 8 * S, hy + 0.5], [hx - hr * 0.6, hy + 2]], a.beak || '#e0b040');
    else if (m === 'snout') { ell(hx - hr * 1.05, hy + hr * 0.28, hr * 0.55, hr * 0.42, shade(C, 0.08)); px(hx - hr * 1.5, hy + hr * 0.12, INK); }
    else if (m === 'trunk') limb([[hx - hr * 0.8, hy + hr * 0.2], [hx - hr * 1.4, hy + hr * 0.8], [hx - hr * 1.5, hy + hr * 1.6], [hx - hr * 1.2, hy + hr * 2.1]], 3 * S, 2 * S, C);
    else if (m === 'tusks') { px(hx - hr * 0.95, hy + hr * 0.15, INK); for (const d of [0, 1]) limb([[hx - hr * 0.6 - d * 2, hy + hr * 0.55], [hx - hr * 1.0 - d * 2, hy + hr * 0.95], [hx - hr * 0.9 - d * 2, hy + hr * 0.5]], 1.6, 1, '#f4ecd8'); }
    else if (m === 'fang') { px(hx - hr * 0.95, hy + hr * 0.15, INK); px(hx - hr * 0.7, hy + hr * 0.6, '#ffffff'); px(hx - hr * 0.4, hy + hr * 0.6, '#ffffff'); }
    else if (m === 'nose') ell(hx - hr * 0.95, hy + hr * 0.25, 1.6 * S + 0.5, 1.4 * S + 0.5, C2);
    else if (m === 'drill') tri([[hx - hr * 0.5, hy + hr * 0.1], [hx - hr * 0.5, hy + hr * 0.6], [hx - hr * 1.6, hy + hr * 0.35]], C2);
    else if (m !== 'none') px(hx - hr * 0.95, hy + hr * 0.15, INK);
    if (o.eyes !== false) { eye(hx - hr * 0.42, hy - hr * 0.1, 1); eye(hx + hr * 0.22, hy - hr * 0.15, 0.8); }
  };

  /* ---------- body forms ---------- */
  const QB = { // quadruped builds: body w/h, leg length/width, head size, head lift, neck
    pup: [10, 7, 4, 3.4, 7.5, 0.45, 0], cat: [11, 5.5, 6, 2.6, 6.5, 0.6, 0], fox: [11, 6, 5, 2.8, 6.5, 0.55, 0], hound: [13, 6.5, 8, 3, 6.5, 0.9, 3],
    deer: [11, 6, 11, 2.4, 6, 1.4, 6], rodent: [9, 6.5, 2, 2.6, 6.5, 0.2, 0], mole: [13, 6, 1, 3, 6.5, -0.2, 0], ram: [12, 8, 6, 3.8, 6.5, 0.6, 1],
    mammoth: [14, 10, 7, 5, 8, 0.5, 0], lizard: [13, 5, 3, 3, 6, 0.1, 1], ferret: [15, 4.5, 3, 2.4, 5.5, 0.35, 1], lion: [12, 7.5, 7, 3.6, 7, 0.7, 1],
    bear: [13, 9, 5, 4.6, 7, 0.4, 0], boar: [12, 8.5, 4, 3.8, 7, 0.1, 0], lynx: [11, 7, 8, 3, 6.5, 0.8, 1], tortoise: [11, 7, 4, 3.4, 7.5, 0.45, 0],
    dog: [12, 7, 6, 3.2, 7, 0.6, 1], drake: [13, 7.5, 6, 3.6, 6.5, 1.1, 4],
  };
  const quad = () => {
    const [bw, bh, lg, lw, hr0, lift, neck] = QB[a.build || 'pup'];
    const brx = bw * S, bry = bh * S, legH = lg * S, cx = 26;
    const bcy = GY - legH - bry + 2, hr = hr0 * S * (a.head || 1);
    const hx = cx - brx * 0.8 - neck * S * 0.6, hy = bcy - bry * lift - hr * 0.45 - neck * S;
    const legW = Math.max(2, Math.round(lw * S));
    tail(cx + brx * 0.9, bcy - bry * 0.35, a.tail);
    if (a.wing) wing(cx - brx * 0.2, bcy - bry * 0.6, 16 * S, a.wing, 1, C2);
    for (const fx of [0.62, 0.15]) rect(cx + brx * fx - legW / 2, bcy + bry * 0.4, legW, GY - (bcy + bry * 0.4), shade(C, -0.28));
    if (a.build === 'tortoise' || has('shell')) {
      ell(cx, bcy + 1, brx, bry * 0.8, C); ell(cx + 2 * S, bcy - bry * 0.35, brx * 1.02, bry * 1.05, C2);
      const R = mulberry(7); for (let i = 0; i < 9; i++) ell(cx + 2 * S + (R() - 0.5) * brx * 1.3, bcy - bry * 0.35 + (R() - 0.6) * bry, 2.2 * S, 1.6 * S, shade(C2, -0.15), { flat: true });
    } else { ell(cx, bcy, brx, bry, C); if (!back) ell(cx - brx * 0.25, bcy + bry * 0.45, brx * 0.55, bry * 0.42, B, { flat: true }); }
    backs(cx - brx * 0.5, cx + brx * 0.75, bcy - bry * (a.build === 'tortoise' || has('shell') ? 1.3 : 0.95), a.back, a.backH || 4);
    if (has('sapling')) { rect(cx + 2 * S, bcy - bry * 1.4 - 5 * S, 1, 5 * S, '#6a4a2a'); ell(cx - 0.5 * S, bcy - bry * 1.4 - 5 * S, 2.8 * S, 1.6 * S, '#5ac040'); ell(cx + 4.5 * S, bcy - bry * 1.4 - 6 * S, 2.8 * S, 1.6 * S, '#6ad050'); }
    if (has('tree')) { rect(cx + 2 * S - 1, bcy - bry * 1.3 - 8, 3, 9, '#6a4a2a'); ell(cx + 2 * S, bcy - bry * 1.3 - 13, 10 * S, 6.5 * S, '#4a9a3a'); ell(cx - 4 * S, bcy - bry * 1.3 - 14, 5 * S, 4 * S, '#5ab048'); ell(cx + 7 * S, bcy - bry * 1.3 - 12, 5 * S, 4 * S, '#3a8a30'); }
    if (has('stripes')) for (let i = 0; i < 3; i++) { const x = cx + brx * (0.1 + i * 0.25); for (let j = 0; j < bry * 1.1; j++) px(x + (j % 2), bcy - bry * 0.8 + j, shade(C, -0.35)); }
    if (has('spots')) { const R = mulberry(3); for (let i = 0; i < 6; i++) ell(cx + (R() - 0.3) * brx * 1.3, bcy - bry * 0.3 + (R() - 0.5) * bry * 0.8, 1.2 * S + 0.3, 1 * S + 0.3, C2, { flat: true, noEdge: true }); }
    if (has('saddle')) ell(cx + brx * 0.1, bcy - bry * 0.75, brx * 0.45, bry * 0.4, C2);
    for (const fx of [-0.6, -0.15]) rect(cx + brx * fx - legW / 2, bcy + bry * 0.45, legW, GY - (bcy + bry * 0.45) + 1, C);
    if (has('claws')) for (const fx of [-0.6, -0.15]) { const x = cx + brx * fx; px(x - 2, GY, '#f4f0e8'); px(x, GY, '#f4f0e8'); px(x + 2, GY, '#f4f0e8'); }
    if (has('hooves')) for (const fx of [-0.6, -0.15, 0.15, 0.62]) rect(cx + brx * fx - legW / 2, GY - 1, legW, 2, '#3a2a20');
    if (neck) limb([[cx - brx * 0.55, bcy - bry * 0.3], [hx + hr * 0.3, hy + hr * 0.4]], 5 * S, 4 * S, C);
    if (has('mane')) ell(hx + hr * 0.55, hy + hr * 0.25, hr * 1.3, hr * 1.25, C2);
    if (has('ruff')) ell(hx + hr * 0.6, hy + hr * 0.75, hr * 0.9, hr * 0.6, B);
    ears(hx, hy, hr, a.ear);
    ell(hx, hy, hr, hr * 0.92, C);
    horns(hx, hy, hr, a.horn);
    face(hx, hy, hr, { mouth: a.mouth });
  };
  const rabbit = () => { // sits upright on big haunches
    const cx = 25, r = 9 * S, cy = GY - r + 1;
    tail(cx + r * 0.95, cy + r * 0.3, a.tail || 'puff');
    ell(cx + r * 0.25, cy, r, r * 0.95, C); ell(cx + r * 0.3, GY - 1.5 * S, r * 0.9, 2.2 * S, shade(C, -0.2));
    if (!back) ell(cx - r * 0.25, cy + r * 0.15, r * 0.5, r * 0.6, B, { flat: true });
    const hx = cx - r * 0.35, hy = cy - r * 1.05, hr = 6.5 * S * (a.head || 1);
    rect(cx - r * 0.55, cy + r * 0.35, 2.5 * S, GY - cy - r * 0.35, C);
    ears(hx, hy, hr, a.ear || 'long'); ell(hx, hy, hr, hr * 0.9, C); horns(hx, hy, hr, a.horn); face(hx, hy, hr);
  };
  const bird = () => {
    const pose = a.pose || 'perch';
    if (pose === 'swift') { // sleek body with long swept-back sickle wings
      const cx = 24, cy = GY - 18 * S, rx = 9 * S, ry = 4.5 * S;
      for (const [d, col] of [[1, shade(C2, -0.15)], [-1, C2]]) poly([[cx - 2 * S, cy - 1], [cx + 6 * S, cy - 10 * S * d - 2], [cx + 20 * S, cy - 13 * S * d], [cx + 9 * S, cy - 5 * S * d], [cx + 4 * S, cy + 1]], col);
      tail(cx + rx * 0.8, cy + 1, a.tail || 'fork');
      ell(cx, cy, rx, ry, C); if (!back) ell(cx - rx * 0.2, cy + ry * 0.35, rx * 0.6, ry * 0.45, B, { flat: true });
      const hx = cx - rx * 0.95, hy = cy - ry * 0.3, hr = 4.2 * S;
      if (has('crest')) tri([[hx, hy - hr + 1], [hx + 3, hy - hr + 1], [hx + 7 * S, hy - hr - 5 * S]], C2);
      ell(hx, hy, hr, hr, C); face(hx, hy, hr, { mouth: a.mouth || 'beak', muzzle: false }); return;
    }
    if (pose === 'flier' || pose === 'soar') { // in flight, wings spread wide, no legs
      const cx = 25, cy = GY - 17 * S, rx = 10 * S, ry = 5.5 * S;
      wing(cx - 2, cy - 1, 20 * S, a.wing || 'feather', 1, C2);
      tail(cx + rx * 0.8, cy + 1, a.tail || 'fork');
      ell(cx, cy, rx, ry, C); if (!back) ell(cx - rx * 0.2, cy + ry * 0.35, rx * 0.6, ry * 0.45, B, { flat: true });
      const hx = cx - rx * 0.95, hy = cy - ry * 0.4, hr = 4.6 * S;
      if (has('crest')) tri([[hx, hy - hr + 1], [hx + 3, hy - hr + 1], [hx + 5 * S, hy - hr - 6 * S]], C2);
      ell(hx, hy, hr, hr, C); if (pose === 'soar') wing(cx + 4, cy + 2, 16 * S, a.wing || 'feather', -0.6, shade(C2, -0.15));
      face(hx, hy, hr, { mouth: a.mouth || 'beak', muzzle: false }); return;
    }
    const tall = pose === 'raptor' || pose === 'penguin' || pose === 'owl';
    const legL = pose === 'wader' ? 14 * S : tall ? 3 * S : 5 * S;
    const rx = (pose === 'owl' ? 10 : pose === 'penguin' ? 7.5 : pose === 'raptor' ? 7 : pose === 'chick' ? 9 : 9.5) * S;
    const ry = (pose === 'owl' ? 11 : pose === 'penguin' ? 11.5 : pose === 'raptor' ? 10 : pose === 'chick' ? 8.5 : 7.5) * S;
    const cx = 25, cy = GY - legL - ry + 1;
    for (const lx of [cx - 3, cx + 2]) { rect(lx, cy + ry - 2, pose === 'wader' ? 1 : 2, GY - cy - ry + 3, a.leg || '#d8a040'); px(lx - 1, GY, a.leg || '#d8a040'); px(lx + 1, GY, a.leg || '#d8a040'); }
    if (pose === 'perch' || pose === 'wader' || pose === 'chick') tail(cx + rx * 0.6, cy - 1, a.tail || 'wedge');
    else tail(cx + rx * 0.5, cy + ry * 0.6, a.tail || 'wedge');
    if (a.tail === undefined || a.tail === 'wedge') tri([[cx + rx * 0.6, cy - 1], [cx + rx * 0.6, cy + 4], [cx + rx + 7 * S, cy + 4 * S]], shade(C, -0.15));
    if (tall && a.wing === 'raised') wing(cx + 1, cy - ry * 0.3, 17 * S, 'feather', 1, C2);
    ell(cx, cy, rx, ry, C);
    if (!back) ell(cx - rx * 0.25, cy + ry * 0.3, rx * 0.6, ry * 0.55, B, { flat: true });
    if (pose === 'penguin') for (const d of [-1, 1]) ell(cx + d * rx * 0.95, cy + ry * 0.1, 2.4 * S, 6 * S, C2);
    else if (a.wing !== 'raised') ell(cx + rx * 0.25, cy, rx * 0.7, ry * 0.55, C2);
    let hx = cx - rx * 0.6, hy = cy - ry * 0.9, hr = 5.5 * S;
    if (pose === 'owl') { hx = cx - 1; hy = cy - ry * 0.55; hr = 7 * S; }
    if (pose === 'penguin' || pose === 'raptor') { hx = cx - rx * 0.4; hy = cy - ry * 0.95; hr = 5 * S; }
    if (pose === 'wader') { limb([[cx - rx * 0.6, cy - ry * 0.4], [cx - rx * 0.9, cy - ry * 1.4], [cx - rx * 0.6, cy - ry * 2.0]], 3.5 * S, 3 * S, C); hx = cx - rx * 0.75; hy = cy - ry * 2.2; hr = 4.5 * S; }
    if (has('crest')) { tri([[hx, hy - hr + 1], [hx + 3, hy - hr + 1], [hx + 4 * S, hy - hr - 6 * S]], C2); tri([[hx + 2, hy - hr + 2], [hx + 5, hy - hr + 2], [hx + 7 * S, hy - hr - 3 * S]], C2); }
    if (has('plume')) limb([[hx + 1, hy - hr + 1], [hx + 4 * S, hy - hr - 6 * S], [hx + 9 * S, hy - hr - 7 * S]], 2, 1, C2);
    if (pose === 'owl') ears(hx, hy, hr, 'tuft');
    ell(hx, hy, hr, hr, pose === 'owl' ? C : C);
    if (pose === 'owl' && !back) { ell(hx - hr * 0.35, hy, hr * 0.42, hr * 0.42, B, { flat: true }); ell(hx + hr * 0.35, hy, hr * 0.42, hr * 0.42, B, { flat: true }); }
    horns(hx, hy, hr, a.horn);
    if (!back) {
      if (pose === 'owl') { eye(hx - hr * 0.4, hy - 1, 1); eye(hx + hr * 0.3, hy - 1, 1); tri([[hx - 1, hy + 1], [hx + 1, hy + 1], [hx, hy + 3 * S]], a.beak || '#e8b030'); }
      else face(hx, hy, hr, { mouth: a.mouth || (pose === 'raptor' ? 'hook' : pose === 'wader' ? 'long' : 'beak'), muzzle: false });
    }
  };
  const bat = () => {
    const cx = 24, cy = GY - 17 * S, r = 6.5 * S;
    for (const d of [-1, 1]) { const x = cx + d * r * 0.6; const span = 17 * S; poly([[x, cy - 2], [x + d * span * 0.5, cy - span * 0.6], [x + d * span, cy - span * 0.25], [x + d * span * 0.8, cy + span * 0.15], [x + d * span * 0.55, cy + span * 0.05], [x + d * span * 0.35, cy + span * 0.3], [x, cy + r * 0.6]], C2); }
    ell(cx, cy + 2, r * 0.9, r * 1.15, C); ears(cx, cy - r * 0.7, r * 0.9, a.ear || 'bat'); ell(cx, cy - r * 0.7, r * 0.85, r * 0.75, C);
    if (!back) { eye(cx - r * 0.35, cy - r * 0.75, 1); eye(cx + r * 0.25, cy - r * 0.75, 1); px(cx - 1, cy - r * 0.25, '#ffffff'); px(cx + 1, cy - r * 0.25, '#ffffff'); }
    tail(cx + r * 0.6, cy + r, a.tail);
    for (const d of [-1, 1]) { px(cx + d * 2, cy + r * 1.3, INK); px(cx + d * 2, cy + r * 1.3 + 1, INK); }
  };
  const worm = () => {
    const shape = a.shape || 'caterpillar';
    if (shape === 'serpent') { // coiled S-shape, head raised high
      const pts = [[38, GY - 3], [30, GY - 4], [22, GY - 3], [16, GY - 7], [19, GY - 13], [26, GY - 16], [27, GY - 23], [22, GY - 28]].map(([x, y]) => [24 + (x - 24) * S, GY + (y - GY) * S]);
      limb(pts, 3 * S, 6.5 * S, C); if (!back) limb(pts.slice(1, 6).map(([x, y]) => [x - 1, y + 2]), 1.8 * S, 3 * S, B);
      backs(pts[7][0], pts[4][0] + 2, pts[6][1], a.back, a.backH || 3);
      const [hx, hy] = pts[7]; const hr = 5 * S; if (a.wing) wing(hx + 6 * S, hy + 8 * S, 15 * S, a.wing, 1, C2);
      ears(hx, hy, hr, a.ear); ell(hx, hy, hr * 1.2, hr, C); horns(hx, hy, hr, a.horn); face(hx, hy, hr, { mouth: a.mouth || 'fang', muzzle: false }); return;
    }
    if (shape === 'coils') { // sea serpent: humps rising out of the water, head held high
      for (const [x0, w, h] of [[34, 6, 7], [24, 6, 9]]) limb([[(x0 + w) * 1, GY - 1], [x0 + w * 0.6, GY - h * S], [x0 - w * 0.6, GY - h * S], [x0 - w, GY - 1]].map(([x, y]) => [24 + (x - 24) * S, y]), 5 * S, 5 * S, C);
      const nk = [[14, GY - 1], [12, GY - 10], [15, GY - 20], [12, GY - 27]].map(([x, y]) => [24 + (x - 24) * S, GY + (y - GY) * S]);
      limb(nk, 6.5 * S, 4.5 * S, C); if (!back) limb(nk.slice(0, 3).map(([x, y]) => [x - 1.5, y]), 2 * S, 1.6 * S, B);
      backs(nk[3][0], nk[1][0] + 4 * S, nk[2][1], a.back, a.backH || 3);
      const [hx, hy] = nk[3]; const hr = 5 * S; ears(hx, hy, hr, a.ear); ell(hx - 1, hy, hr * 1.25, hr * 0.95, C); horns(hx, hy, hr, a.horn);
      for (let i = 0; i < 4; i++) ell(10 + i * 9, GY, 4 * S, 1.2, '#8ac8e8', { flat: true, noEdge: true });
      face(hx - 1, hy, hr, { mouth: a.mouth || 'fang', muzzle: false }); return;
    }
    if (shape === 'centipede' || shape === 'caterpillar') {
      const segs = shape === 'centipede' ? 6 : 4, r = (shape === 'centipede' ? 4.2 : 5.2) * S;
      for (let i = segs - 1; i >= 0; i--) {
        const x = 38 - i * 2 * r * 0.72, y = GY - r - Math.sin(i * 0.9) * 2;
        if (shape === 'centipede') for (const d of [-1, 1]) limb([[x, y + r * 0.5], [x + d * 2, GY + 0.5]], 1.2, 1, shade(C, -0.4));
        ell(x, y, r * (i === 0 ? 1.15 : 1), r, i % 2 ? C : shade(C, 0.08)); if (!back) ell(x, y + r * 0.55, r * 0.7, r * 0.35, B, { flat: true });
        if (shape === 'caterpillar') { px(x - 2, GY, shade(C, -0.4)); px(x + 2, GY, shade(C, -0.4)); }
        if (i % 2 === 0) ell(x, y - r * 0.55, 1.4, 1.2, C2, { flat: true, noEdge: true });
      }
      backs(38 - (segs - 1) * 2 * r * 0.72, 40, GY - r * 2, a.back, 3);
      const hx = 38 - (segs - 1) * 2 * r * 0.72 - r * 0.9, hy = GY - r * 1.9;
      ears(hx, hy, r, a.ear || 'antenna'); ell(hx, hy, r * 1.25, r * 1.15, C); horns(hx, hy, r, a.horn);
      if (!back) { eye(hx - r * 0.5, hy - r * 0.1, 1); eye(hx + r * 0.25, hy - r * 0.15, 0.8); px(hx - r * 0.2, hy + r * 0.5, INK); }
    }
  };
  const blob = () => {
    const shape = a.shape || 'round';
    const cx = 24; let cy = GY - 9 * S, rx = 11 * S, ry = 9.5 * S;
    if (shape === 'pear') { ry = 11 * S; rx = 9 * S; cy = GY - ry + 1; }
    if (shape === 'flat') { ry = 6.5 * S; rx = 13 * S; cy = GY - ry + 1; }
    if (shape === 'tall') { ry = 13 * S; rx = 8 * S; cy = GY - ry + 1; }
    if (shape === 'cloud') { cy = GY - 16 * S; }
    if (has('arms')) for (const d of [-1, 1]) ell(cx + d * rx * 0.95, cy + ry * 0.25, 3.5 * S, 5 * S, shade(C, -0.08));
    if (has('hood')) tri([[cx - rx * 0.9, cy], [cx + rx * 0.9, cy], [cx + 1, cy - ry * 1.9]], shade(C, -0.25));
    if (shape === 'cloud') { for (const [dx, dy, r] of [[-0.7, 0.2, 0.55], [0.7, 0.25, 0.55], [-0.3, -0.45, 0.6], [0.35, -0.4, 0.55]]) ell(cx + dx * rx, cy + dy * ry, rx * r, ry * r, C); }
    if (shape === 'drip') { tri([[cx - rx * 0.5, cy - ry * 0.6], [cx + rx * 0.5, cy - ry * 0.6], [cx + 2, cy - ry * 1.9]], C); }
    if (shape === 'clam') { // two ridged shells with a face peeking out
      cy = GY - 9 * S; ell(cx, cy + 3 * S, rx * 1.1, ry * 0.55, shade(C, -0.1)); ell(cx, cy, rx * 0.75, ry * 0.5, B);
      ell(cx, cy - 4 * S, rx * 1.15, ry * 0.75, C); for (let i = -3; i <= 3; i++) limb([[cx + i * 2.5 * S, cy - 2 * S], [cx + i * 3.2 * S, cy - 9 * S]], 1, 1, shade(C, -0.25));
      backs(cx - rx * 0.8, cx + rx * 0.8, cy - ry * 1.1, a.back, a.backH || 3);
      if (!back) { eye(cx - rx * 0.3, cy - 1, 1); eye(cx + rx * 0.2, cy - 1, 1); px(cx - 1, cy + 2, INK); px(cx, cy + 2, INK); } return;
    }
    if (shape === 'cap') { // mushroom: stalk body under a wide cap
      ell(cx, cy + ry * 0.25, rx * 0.65, ry * 0.75, B);
      ell(cx, cy - ry * 0.55, rx * 1.35, ry * 0.75, C); const R = mulberry(5); for (let i = 0; i < 5; i++) ell(cx + (R() - 0.5) * rx * 2, cy - ry * 0.75 + (R() - 0.5) * ry * 0.5, 1.8 * S, 1.4 * S, C2, { flat: true, noEdge: true });
      if (!back) { eye(cx - rx * 0.3, cy + ry * 0.1, 1); eye(cx + rx * 0.2, cy + ry * 0.1, 1); px(cx - 1, cy + ry * 0.45, INK); px(cx, cy + ry * 0.5, INK); }
      return;
    }
    ell(cx, cy, rx, ry, C);
    if (shape === 'cloud' && !back) ell(cx - rx * 0.1, cy + ry * 0.1, rx * 0.55, ry * 0.45, B, { flat: true });
    else if (!back && !has('cocoon')) ell(cx - rx * 0.15, cy + ry * 0.4, rx * 0.6, ry * 0.4, B, { flat: true });
    if (has('cocoon')) for (let i = 0; i < 5; i++) for (let x = -rx; x < rx; x++) px(cx + x, cy - ry * 0.6 + i * ry * 0.35 + Math.sin(x / 2 + i) * 1, shade(C, -0.15 + (i % 2) * 0.2));
    if (shape === 'cloud' && has('rain')) for (let i = -2; i <= 2; i++) limb([[cx + i * 4 * S, cy + ry * 0.9], [cx + i * 4 * S - 1, cy + ry * 0.9 + 5 * S]], 1.2, 1, '#8ac8f0');
    backs(cx - rx * 0.7, cx + rx * 0.7, cy - ry * 0.95, a.back, a.backH || 3);
    if (has('drop')) { ell(cx + 2, cy - ry - 2, 2.5 * S, 3 * S, C2); tri([[cx + 2 - 2 * S, cy - ry - 3], [cx + 2 + 2 * S, cy - ry - 3], [cx + 2, cy - ry - 9 * S]], C2); }
    if (has('flame')) flame(cx + 1, cy - ry + 3, 6 * S);
    if (has('core')) { ell(cx, cy + 1, rx * 0.4, ry * 0.4, C2, { flat: true, noEdge: true }); ell(cx, cy + 1, rx * 0.2, ry * 0.2, '#ffffff', { flat: true, noEdge: true }); }
    if (has('barnacles')) for (const [bx, by] of [[cx + 4, cy - 4], [cx + 6, cy + 2], [cx - 6, cy - 6], [cx - 2, cy + 4]]) ell(bx, by, 1.8, 1.5, '#e8e0d0');
    if (has('leafhat')) { poly([[cx - 1, cy - ry + 1], [cx - 7 * S, cy - ry - 5 * S], [cx - 1, cy - ry - 3 * S]], C2); poly([[cx + 1, cy - ry + 1], [cx + 8 * S, cy - ry - 6 * S], [cx + 1, cy - ry - 3 * S]], shade(C2, 0.12)); }
    if (has('spots')) { const R = mulberry(4); for (let i = 0; i < 6; i++) ell(cx + (R() - 0.5) * rx * 1.4, cy + (R() - 0.7) * ry * 0.9, 1.5 * S, 1.2 * S, C2, { flat: true, noEdge: true }); }
    ears(cx - 1, cy - ry * 0.35, rx * 0.8, a.ear); horns(cx, cy - ry * 0.1, ry, a.horn);
    if (!back) {
      if (has('cocoon')) { eye(cx - 3, cy - ry * 0.25, 0.8); eye(cx + 2, cy - ry * 0.25, 0.8); }
      else { eye(cx - rx * 0.35, cy - ry * 0.25, 1); eye(cx + rx * 0.25, cy - ry * 0.25, 1); if (a.mouth === 'jaw') { rect(cx - rx * 0.6, cy + ry * 0.15, rx * 1.1, 3 * S, '#2a1a1a'); for (let i = 0; i < 4; i++) tri([[cx - rx * 0.5 + i * rx * 0.28, cy + ry * 0.15], [cx - rx * 0.5 + i * rx * 0.28 + 2.5, cy + ry * 0.15], [cx - rx * 0.5 + i * rx * 0.28 + 1.2, cy + ry * 0.15 + 2.5 * S]], '#f0ece0', { flat: true }); } else { px(cx - 1, cy + ry * 0.12, INK); px(cx, cy + ry * 0.18, INK); px(cx + 1, cy + ry * 0.12, INK); } }
    }
  };
  const frog = () => { // squat, wide mouth, eyes bulging on top, bent legs
    const toad = a.shape === 'toad'; const cx = 25, rx = (toad ? 12 : 10) * S, ry = (toad ? 8 : 7) * S, cy = GY - ry - 1;
    for (const d of [1, -1]) { ell(cx + d * rx * 0.7, GY - 3 * S, 4.5 * S, 3.2 * S, shade(C, -0.15)); rect(cx + d * rx * 0.85 - 1, GY - 1, 4 * S, 1.5, shade(C, -0.3)); }
    ell(cx, cy, rx, ry, C); if (!back) ell(cx - rx * 0.1, cy + ry * 0.45, rx * 0.75, ry * 0.4, B, { flat: true });
    backs(cx - rx * 0.4, cx + rx * 0.8, cy - ry * 0.8, a.back, a.backH || 3);
    if (has('spots')) { const R = mulberry(6); for (let i = 0; i < 6; i++) ell(cx + (R() - 0.3) * rx * 1.4, cy + (R() - 0.7) * ry, 1.4 * S, 1.2 * S, C2, { flat: true, noEdge: true }); }
    for (const d of [-1, 1]) { ell(cx - rx * 0.35 + d * 4 * S, cy - ry * 0.85, 3 * S, 3 * S, C); }
    if (has('flame')) flame(cx + rx * 0.4, cy - ry * 0.6, 4.5 * S);
    if (!back) { eye(cx - rx * 0.35 - 4 * S, cy - ry * 0.95, 1); eye(cx - rx * 0.35 + 4 * S, cy - ry * 0.95, 1); rect(cx - rx * 0.85, cy + ry * 0.1, rx * 0.9, 1, INK); }
    if (has('sac') && !back) ell(cx - rx * 0.55, cy + ry * 0.55, rx * 0.35, ry * 0.4, C2);
  };
  const wisp = () => {
    const shape = a.shape || 'tail';
    const cx = 24; let cy = GY - 15 * S; const rx = 9.5 * S, ry = 8.5 * S;
    if (shape === 'sheet') { // draped sheet ghost with a ragged hem
      const pts = [[cx - rx, cy]]; for (let i = 0; i <= 6; i++) pts.push([cx - rx + i * rx / 3, cy + ry * 1.5 + (i % 2 ? -3 * S : 0)]); pts.push([cx + rx, cy]);
      poly(pts, C); ell(cx, cy - 1, rx, ry * 0.9, C);
      if (has('arms')) for (const d of [-1, 1]) limb([[cx + d * rx * 0.8, cy + 2], [cx + d * rx * 1.4, cy - 2 * S]], 3 * S, 2 * S, C);
    } else if (shape === 'orb') { // floating orb with an orbit ring
      ell(cx, cy, rx * 0.9, ry * 0.9, C); for (let t = 0; t < 60; t++) { const an = t / 60 * Math.PI * 2; const x = cx + Math.cos(an) * rx * 1.5, y = cy + Math.sin(an) * ry * 0.35; if (Math.sin(an) > -0.2 || Math.abs(Math.cos(an)) > 0.6) px(x, y, C2); }
    } else if (shape === 'flame') { // a living flame
      poly([[cx - rx, cy + ry * 0.6], [cx - rx * 0.6, cy - ry * 0.6], [cx - rx * 0.3, cy - ry * 1.6], [cx + rx * 0.1, cy - ry * 0.7], [cx + rx * 0.5, cy - ry * 2.0], [cx + rx * 0.9, cy - ry * 0.4], [cx + rx, cy + ry * 0.6]], C);
      ell(cx, cy + ry * 0.4, rx, ry * 0.75, C);
    } else if (shape === 'veil') { // tall flowing veil
      poly([[cx - rx * 0.7, cy - ry * 0.4], [cx - rx * 1.2, cy + ry * 1.8], [cx - rx * 0.3, cy + ry * 1.4], [cx + rx * 0.3, cy + ry * 2.0], [cx + rx * 1.1, cy + ry * 1.3], [cx + rx * 0.7, cy - ry * 0.4]], shade(C, -0.1));
      ell(cx, cy - ry * 0.3, rx * 0.8, ry * 0.85, C);
    } else if (shape === 'tornado') { // a spinning funnel of air
      for (let i = 0; i < 6; i++) { const w = rx * (0.35 + i * 0.2); ell(cx + Math.sin(i * 1.3) * 2 * S, GY - 3 * S - i * 4.2 * S, w, 2.6 * S, i % 2 ? C : shade(C, 0.1)); }
      cy = GY - 22 * S; ell(cx, cy, rx * 0.9, ry * 0.75, C);
    } else { cy -= 0; tri([[cx + rx * 0.2, cy + ry * 0.4], [cx + rx * 0.9, cy + ry * 0.2], [cx + rx * 1.4, cy + ry * 1.7]], C); ell(cx + rx * 0.3, cy + ry * 0.75, rx * 0.65, ry * 0.5, C); ell(cx, cy, rx, ry, C); }
    if (has('hood')) tri([[cx - rx * 0.9, cy], [cx + rx * 0.9, cy], [cx + 1, cy - ry * 1.9]], shade(C, -0.25));
    if (has('crown')) horns(cx, cy, ry, 'crown');
    if (has('handle')) { for (let t = 0; t < 30; t++) { const an = Math.PI + t / 30 * Math.PI; px(cx + Math.cos(an) * 4 * S, cy - ry - 1 + Math.sin(an) * 4 * S, '#8a7a5a'); } }
    if (has('flame')) flame(cx + 1, cy - ry + 3, 6 * S);
    if (has('core')) { ell(cx, cy + 1, rx * 0.4, ry * 0.4, C2, { flat: true, noEdge: true }); ell(cx, cy + 1, rx * 0.2, ry * 0.2, '#ffffff', { flat: true, noEdge: true }); }
    if (has('drop')) { ell(cx + 2, cy - ry - 2, 2.5 * S, 3 * S, C2); tri([[cx + 2 - 2 * S, cy - ry - 3], [cx + 2 + 2 * S, cy - ry - 3], [cx + 2, cy - ry - 9 * S]], C2); }
    if (has('leafhat')) { poly([[cx - 1, cy - ry + 1], [cx - 7 * S, cy - ry - 5 * S], [cx - 1, cy - ry - 3 * S]], C2); poly([[cx + 1, cy - ry + 1], [cx + 8 * S, cy - ry - 6 * S], [cx + 1, cy - ry - 3 * S]], shade(C2, 0.12)); }
    if (has('mist')) for (let i = 0; i < 3; i++) ell(cx + (i - 1) * 7 * S, GY - 2, 4 * S, 1.5 * S, shade(C, 0.2), { flat: true });
    if (!back) { eye(cx - rx * 0.35, cy - ry * 0.2, 1); eye(cx + rx * 0.25, cy - ry * 0.2, 1); if (a.mouth !== 'none') { px(cx - 1, cy + ry * 0.2, INK); px(cx, cy + ry * 0.25, INK); px(cx + 1, cy + ry * 0.2, INK); } }
  };
  const mineral = () => {
    const shape = a.shape || 'boulder';
    const cx = 24; let cy = GY - 9 * S, rx = 11 * S, ry = 9.5 * S;
    if (has('arms')) for (const d of [-1, 1]) ell(cx + d * rx * 1.15, cy + ry * 0.25, 3.5 * S, 5 * S, shade(C, -0.08));
    if (shape === 'boulder') {
      const id = nid++; const R = mulberry(a.c.length * 13 + (S * 10 | 0)); const rad = []; for (let k = 0; k < 9; k++) rad.push(0.8 + R() * 0.3);
      for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++) for (let x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) {
        const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; const ang = (Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI) * 9; const k = Math.floor(ang) % 9, f = ang - Math.floor(ang);
        const rr = rad[k] * (1 - f) + rad[(k + 1) % 9] * f; if (Math.hypot(dx, dy) > rr * 1.05) continue;
        const L = -dx * 0.5 - dy * 0.8; put(x, y, L > 0.5 ? shade(C, 0.25) : L < -0.45 ? shade(C, -0.25) : C, id);
      }
      for (let k = 0; k < 6; k++) { const x = cx + (R() - 0.5) * rx * 1.3, y = cy + (R() - 0.5) * ry * 1.2; px(x, y, C2); px(x + 1, y, C2); px(x, y + 1, shade(C2, -0.2)); }
    }
    if (shape === 'crystal') { // a cluster of upright crystals
      cy = GY - 6 * S; ell(cx, GY - 4 * S, rx * 0.9, 4.5 * S, shade(C, -0.2));
      for (const [dx, h, w] of [[-7, 14, 3.5], [6, 12, 3.2], [-1, 20, 4.5], [10, 7, 2.5], [-11, 8, 2.6]]) poly([[cx + dx * S - w * S, GY - 3 * S], [cx + dx * S - w * S, GY - (h - 4) * S], [cx + dx * S, GY - h * S], [cx + dx * S + w * S, GY - (h - 4) * S], [cx + dx * S + w * S, GY - 3 * S]], dx === -1 ? C : shade(C, dx > 0 ? -0.12 : 0.1));
      cy = GY - 9 * S;
    }
    if (shape === 'shard') { cy = GY - 16 * S; poly([[cx, cy - 13 * S], [cx + 8 * S, cy - 2 * S], [cx + 2 * S, cy + 12 * S], [cx - 7 * S, cy + 1 * S]], C); poly([[cx, cy - 13 * S], [cx + 2 * S, cy + 12 * S], [cx - 7 * S, cy + 1 * S]], shade(C, 0.15)); for (const d of [-1, 1]) poly([[cx + d * 11 * S, cy - 4 * S], [cx + d * 13 * S, cy], [cx + d * 11 * S, cy + 4 * S], [cx + d * 9 * S, cy]], C2); ry = 7 * S; }
    if (shape === 'star') { const pts = []; for (let i = 0; i < 10; i++) { const an = -Math.PI / 2 + i * Math.PI / 5; const r = (i % 2 ? 0.45 : 1) * rx * 1.15; pts.push([cx + Math.cos(an) * r, cy - 2 + Math.sin(an) * r]); } poly(pts, C); }
    if (shape === 'gear') { const id = nid++; for (let y = Math.floor(cy - ry * 1.3); y <= cy + ry * 1.3; y++) for (let x = Math.floor(cx - rx * 1.3); x <= cx + rx * 1.3; x++) { const dx = x + 0.5 - cx, dy = y + 0.5 - cy; const an = Math.atan2(dy, dx); const r = rx * (Math.cos(an * 8) > 0.3 ? 1.15 : 0.92); const d = Math.hypot(dx, dy); if (d <= r && d > rx * 0.3) put(x, y, (dy < 0 ? shade(C, 0.15) : C), id); } }
    if (shape === 'slab') { cy = GY - 13 * S; poly([[cx - 7 * S, GY], [cx - 8 * S, cy - 9 * S], [cx - 2 * S, cy - 14 * S], [cx + 7 * S, cy - 11 * S], [cx + 8 * S, GY]], C); }
    if (shape === 'geode') { ell(cx, cy, rx, ry, C); ell(cx - rx * 0.1, cy + ry * 0.05, rx * 0.6, ry * 0.55, C2, { flat: true }); const R = mulberry(2); for (let i = 0; i < 7; i++) tri([[cx - rx * 0.1 + (R() - 0.5) * rx, cy + ry * 0.3], [cx - rx * 0.1 + (R() - 0.5) * rx + 2, cy + ry * 0.3], [cx - rx * 0.1 + (R() - 0.5) * rx + 1, cy - ry * 0.3]], shade(C2, 0.3), { flat: true }); }
    if (shape === 'meteor') { for (let i = 0; i < 3; i++) limb([[cx + rx * 0.4, cy - ry * 0.5 + i * 4 * S], [cx + rx * 1.6, cy - ry * 1.2 + i * 4 * S]], 3 * S, 1, i === 1 ? '#ffd060' : '#ff9040'); ell(cx, cy, rx * 0.85, ry * 0.85, C); const R = mulberry(8); for (let i = 0; i < 4; i++) ell(cx + (R() - 0.5) * rx, cy + (R() - 0.5) * ry, 1.8 * S, 1.5 * S, shade(C, -0.25), { flat: true }); }
    backs(cx - rx * 0.7, cx + rx * 0.7, cy - ry * 0.95, a.back, a.backH || 3);
    if (has('moss')) for (let i = 0; i < 6; i++) ell(cx - rx * 0.7 + i * rx * 0.28, cy - ry * 0.85 + (i % 2), 2.6 * S, 1.6 * S, i % 2 ? '#5aa040' : '#6ab850');
    if (has('flame')) flame(cx + 1, cy - ry + 3, 6 * S);
    if (has('core')) { ell(cx, cy + 1, rx * 0.35, ry * 0.35, C2, { flat: true, noEdge: true }); ell(cx, cy + 1, rx * 0.17, ry * 0.17, '#ffffff', { flat: true, noEdge: true }); }
    if (has('barnacles')) for (const [bx, by] of [[cx + 4, cy - 4], [cx + 6, cy + 2], [cx - 6, cy - 6], [cx - 2, cy + 4]]) ell(bx, by, 1.8, 1.5, '#e8e0d0');
    if (!back) {
      eye(cx - rx * 0.35, cy - ry * 0.25, 1); eye(cx + rx * 0.25, cy - ry * 0.25, 1);
      if (a.mouth === 'jaw') { rect(cx - rx * 0.7, cy + ry * 0.15, rx * 1.2, 4 * S, '#2a1a1a'); for (let i = 0; i < 5; i++) tri([[cx - rx * 0.6 + i * rx * 0.25, cy + ry * 0.15], [cx - rx * 0.6 + i * rx * 0.25 + 3, cy + ry * 0.15], [cx - rx * 0.6 + i * rx * 0.25 + 1.5, cy + ry * 0.15 + 3 * S]], '#f0ece0', { flat: true }); }
      else { px(cx - 1, cy + ry * 0.15, INK); px(cx, cy + ry * 0.2, INK); px(cx + 1, cy + ry * 0.15, INK); }
    }
  };
  const bug = () => {
    const shape = a.shape || 'moth';
    const cx = 24, cy = GY - 16 * S;
    if (shape === 'moth' || shape === 'butterfly') {
      const big = shape === 'butterfly';
      for (const d of [-1, 1]) {
        if (big) { poly([[cx + d * 2, cy - 2 * S], [cx + d * 7 * S, cy - 15 * S], [cx + d * 17 * S, cy - 13 * S], [cx + d * 14 * S, cy - 2 * S]], C); poly([[cx + d * 2, cy], [cx + d * 13 * S, cy + 3 * S], [cx + d * 11 * S, cy + 12 * S], [cx + d * 4 * S, cy + 9 * S]], shade(C, -0.08)); ell(cx + d * 10 * S, cy - 8 * S, 3 * S, 3 * S, C2, { flat: true }); }
        else { ell(cx + d * 9 * S, cy - 5 * S, 9 * S, 8 * S, C); ell(cx + d * 7 * S, cy + 7 * S, 6 * S, 5.5 * S, shade(C, -0.08)); ell(cx + d * 9 * S, cy - 5 * S, 3.5 * S, 3.5 * S, C2, { flat: true }); ell(cx + d * 9 * S, cy - 5 * S, 1.5 * S, 1.5 * S, '#ffffff', { flat: true, noEdge: true }); }
        if (a.tail === 'swallow') limb([[cx + d * 8 * S, cy + 10 * S], [cx + d * 10 * S, cy + 17 * S]], 2.5 * S, 1, shade(C, -0.1));
      }
      ell(cx, cy + 2 * S, 3.5 * S, 9 * S, B); for (let i = 0; i < 4; i++) ell(cx, cy - 3 * S + i * 3.5 * S, 3.2 * S, 0.6, shade(B, -0.15), { flat: true, noEdge: true });
      const hy = cy - 8 * S; ell(cx, hy, 4.5 * S, 4 * S, B);
      for (const d of [-1, 1]) for (let i = 0; i < 7 * S; i++) { px(cx + d * (2 + i * 0.7), hy - 4 * S - i * 0.8, shade(C2, -0.2)); if (shape === 'moth' && i % 2) px(cx + d * (3 + i * 0.7), hy - 4 * S - i * 0.8, C2); }
      if (shape === 'butterfly') for (const d of [-1, 1]) ell(cx + d * (2 + 7 * S * 0.7), hy - 4 * S - 7 * S * 0.8, 1.3, 1.3, C2);
      if (!back) { eye(cx - 2 * S, hy, 0.9); eye(cx + 2 * S, hy, 0.9); }
      return;
    }
    if (shape === 'bee') { // round striped body, small wings, stinger
      const by = GY - 11 * S, r = 8 * S;
      for (const d of [0, 1]) ell(cx + 2 * S + d * 5 * S, by - r * 1.1 - d * 2, 5 * S, 3.5 * S, '#eef6ff', { flat: true });
      tri([[cx + r * 1.1, by - 1], [cx + r * 1.1, by + 3], [cx + r * 1.1 + 5 * S, by + 1]], INK);
      ell(cx + 2, by, r * 1.15, r, C); for (let i = 0; i < 3; i++) for (let j = -r; j < r; j++) px(cx - r * 0.2 + i * r * 0.55, by + j, a.stripe || INK);
      const hx = cx - r * 1.05, hy = by - r * 0.35, hr = 5 * S; ears(hx, hy, hr, 'antenna'); ell(hx, hy, hr, hr, B);
      for (const d of [0, 1]) limb([[cx - 2 + d * 5, by + r * 0.8], [cx - 4 + d * 5, GY]], 1.2, 1, INK);
      if (!back) { eye(hx - hr * 0.3, hy - 1, 1); eye(hx + hr * 0.4, hy - 1, 0.9); } return;
    }
    if (shape === 'beetle') { // armoured shell, big horn
      const by = GY - 8 * S, rx = 12 * S, ry = 8 * S;
      for (let i = 0; i < 3; i++) for (const d of [-1, 1]) limb([[cx - 4 * S + i * 5 * S, by + ry * 0.4], [cx - 4 * S + i * 5 * S + d * 2 * S, GY]], 1.6, 1, shade(C, -0.4));
      ell(cx + 2, by, rx, ry, C); limb([[cx + 2, by - ry], [cx + 2, by + ry * 0.4]], 1, 1, shade(C, -0.35));
      ell(cx + 2 - rx * 0.25, by - ry * 0.35, rx * 0.25, ry * 0.25, shade(C, 0.35), { flat: true, noEdge: true });
      const hx = cx - rx * 0.85, hy = by + 1, hr = 4.5 * S; ell(hx, hy, hr, hr * 0.9, shade(C, -0.25));
      limb([[hx - 1, hy - hr * 0.5], [hx - 4 * S, hy - hr - 4 * S], [hx - 2 * S, hy - hr - 9 * S]], 3 * S, 1.2, C2);
      if (!back) { eye(hx - hr * 0.3, hy, 0.9); } return;
    }
    if (shape === 'dragonfly') { // long thin body, two pairs of long wings
      const by = GY - 15 * S;
      for (const [dx, up] of [[-2, 1], [3, 1], [-2, -0.5], [3, -0.5]]) ell(cx + dx * S + 9 * S, by - up * 6 * S, 10 * S, 2.6 * S, up > 0 ? '#eef8ff' : '#dceef8', { flat: true });
      limb([[cx - 4 * S, by], [cx + 8 * S, by + 1], [cx + 18 * S, by + 3 * S], [cx + 22 * S, by + 2 * S]], 4 * S, 1.6, C);
      for (let i = 0; i < 4; i++) px(cx + 8 * S + i * 3 * S, by + 1 + i * 0.5, C2);
      for (const d of [0, 1]) limb([[cx - 1 + d * 3, by + 2 * S], [cx - 3 + d * 4, GY]], 1.2, 1, shade(C, -0.35));
      const hx = cx - 6 * S, hy = by - 1, hr = 4.2 * S; ell(hx, hy, hr, hr, C2);
      if (has('crown')) horns(hx, hy, hr, 'crown');
      if (!back) { eye(hx - hr * 0.4, hy - 1, 1.2); eye(hx + hr * 0.3, hy - 1, 1); } return;
    }
    if (shape === 'mantis') { // tall, thin, folded scythe arms
      const by = GY - 10 * S;
      limb([[cx + 10 * S, by + 2], [cx + 2 * S, by - 1], [cx - 3 * S, by - 9 * S]], 4 * S, 3 * S, C);
      for (const d of [0, 1]) limb([[cx + 4 * S + d * 5 * S, by + 1], [cx + 2 * S + d * 7 * S, GY]], 1.4, 1, shade(C, -0.3));
      ell(cx + 6 * S, by - 2 * S, 7 * S, 3 * S, '#eaf6e0', { flat: true });
      const hx = cx - 4 * S, hy = by - 12 * S, hr = 4 * S; ears(hx, hy, hr, 'antenna'); poly([[hx - hr * 1.3, hy - hr * 0.5], [hx + hr * 1.3, hy - hr * 0.5], [hx, hy + hr * 1.2]], C);
      for (const d of [0, 1]) limb([[cx - 3 * S, by - 6 * S], [cx - 9 * S - d * 2, by - 3 * S], [cx - 6 * S - d * 2, by - 10 * S]], 2.4 * S, 1.2, C2);
      if (!back) { eye(hx - hr * 0.6, hy - hr * 0.3, 1); eye(hx + hr * 0.5, hy - hr * 0.3, 1); } return;
    }
  };
  const fish = () => {
    const shape = a.shape || 'fish';
    const cx = 23; const cy = GY - 12 * S;
    if (shape === 'eel') {
      const pts = [[10, cy - 4], [17, cy + 2], [25, cy - 2], [33, cy + 3], [40, cy - 1]].map(([x, y]) => [24 + (x - 24) * S, y]);
      limb(pts, 7 * S, 2 * S, C); if (!back) limb(pts.slice(0, 4).map(([x, y]) => [x, y + 2 * S]), 2.5 * S, 1.2, B);
      backs(pts[1][0], pts[4][0], cy - 4 * S, a.back || 'fin', 2);
      if (a.back === undefined) for (let i = 1; i < 4; i++) tri([[pts[i][0] - 2 * S, pts[i][1] - 3 * S], [pts[i][0] + 3 * S, pts[i][1] - 3 * S], [pts[i][0] + 2 * S, pts[i][1] - 6 * S]], C2);
      const hx = pts[0][0], hy = pts[0][1];
      if (has('lure')) { for (let i = 0; i < 8 * S; i++) px(hx + 2 - i * 0.5, hy - 4 * S - i * 0.8, shade(C, 0.2)); ell(hx + 2 - 8 * S * 0.5, hy - 4 * S - 8 * S * 0.8, 2.6, 2.6, C2); }
      if (!back) { eye(hx - 1, hy - 2 * S, 1); px(hx - 4 * S, hy + 1, INK); }
      return;
    }
    if (shape === 'ray') { // flat diamond seen from above-front, long tail
      const ry = 7 * S, w = 18 * S; const by = GY - 12 * S;
      limb([[cx + 2, by + 2], [cx + 12 * S, by + 4 * S], [cx + 20 * S, by + 2 * S]], 2, 1, shade(C, -0.2));
      poly([[cx - w, by + 2], [cx - 3 * S, by - ry * 1.3], [cx + 4 * S, by - ry * 1.2], [cx + w * 0.9, by - 1], [cx + 3 * S, by + ry * 0.8], [cx - 4 * S, by + ry * 0.8]], C);
      if (!back) ell(cx - 1, by + ry * 0.2, w * 0.35, ry * 0.4, B, { flat: true });
      for (const d of [-1, 1]) limb([[cx - 2 + d * 3 * S, by - ry * 1.1], [cx - 2 + d * 4 * S, by - ry * 1.6]], 1.6, 1.2, C2);
      if (a.wing) wing(cx + 2 * S, by - ry * 0.9, 16 * S, a.wing, 1, C2);
      backs(cx - 4 * S, cx + 8 * S, by - ry * 1.05, a.back, a.backH || 3);
      if (has('lure')) { for (let i = 0; i < 6 * S; i++) px(cx - 2 - i * 0.3, by - ry * 1.2 - i, shade(C, 0.2)); ell(cx - 2 - 6 * S * 0.3, by - ry * 1.2 - 6 * S, 2.4, 2.4, C2); }
      if (!back) { eye(cx - 5 * S, by - ry * 0.6, 1); eye(cx + 2 * S, by - ry * 0.6, 1); }
      return;
    }
    if (shape === 'puffer') { const r = 10 * S; for (let i = 0; i < 12; i++) { const an = i / 12 * Math.PI * 2; tri([[cx + Math.cos(an - 0.15) * r, cy + Math.sin(an - 0.15) * r], [cx + Math.cos(an + 0.15) * r, cy + Math.sin(an + 0.15) * r], [cx + Math.cos(an) * (r + 4 * S), cy + Math.sin(an) * (r + 4 * S)]], C2); } tri([[cx + r * 0.8, cy], [cx + r + 5 * S, cy - 4 * S], [cx + r + 5 * S, cy + 4 * S]], C2); ell(cx, cy, r, r, C); if (!back) ell(cx - 1, cy + r * 0.4, r * 0.7, r * 0.45, B, { flat: true }); if (!back) { eye(cx - r * 0.5, cy - r * 0.2, 1.1); rect(cx - r * 0.9, cy + r * 0.15, 3, 1, INK); } return; }
    if (shape === 'seahorse') { const pts = [[26, GY - 1], [31, GY - 4], [29, GY - 8], [24, GY - 12], [25, GY - 20], [21, GY - 26]].map(([x, y]) => [24 + (x - 24) * S, GY + (y - GY) * S]); limb(pts, 3 * S, 7 * S, C); backs(pts[3][0] + 2, pts[3][0] + 4, pts[3][1], 'spikes', 2); const [hx, hy] = pts[5]; ell(hx, hy, 4.5 * S, 4 * S, C); limb([[hx - 3 * S, hy + 1], [hx - 9 * S, hy + 2 * S]], 2.5 * S, 2 * S, C); tri([[hx + 1, hy - 4 * S], [hx + 5 * S, hy - 8 * S], [hx + 3 * S, hy - 2 * S]], C2); if (!back) eye(hx - 1, hy - 1, 1); return; }
    const rx = (shape === 'shark' ? 14 : shape === 'koi' ? 12 : 12) * S, ry = (shape === 'shark' ? 6 : 7.5) * S;
    tri([[cx + rx * 0.7, cy], [cx + rx + 8 * S, cy - 7 * S], [cx + rx + 8 * S, cy + 7 * S]], C2);
    if (shape === 'koi') for (const d of [-1, 1]) limb([[cx + rx * 0.9, cy], [cx + rx + 6 * S, cy + d * 5 * S], [cx + rx + 12 * S, cy + d * 3 * S]], 4 * S, 1.5, shade(C2, 0.1));
    if (a.wing) wing(cx - 2, cy - 2, 18 * S, a.wing, 1, C2);
    if (shape === 'shark') tri([[cx - rx * 0.1, cy - ry + 1], [cx + rx * 0.4, cy - ry + 1], [cx + rx * 0.3, cy - ry - 9 * S]], C2);
    else tri([[cx - rx * 0.2, cy - ry + 1], [cx + rx * 0.5, cy - ry + 1], [cx + rx * 0.3, cy - ry - 5 * S]], C2);
    ell(cx, cy, rx, ry, C); if (!back) ell(cx - rx * 0.1, cy + ry * 0.4, rx * 0.7, ry * 0.45, B, { flat: true });
    if (has('spots')) { const R = mulberry(5); for (let i = 0; i < 5; i++) ell(cx + (R() - 0.4) * rx * 1.3, cy + (R() - 0.7) * ry, 2 * S, 1.6 * S, C2, { flat: true, noEdge: true }); }
    else for (let i = 0; i < 3; i++) for (let j = -2; j < 3; j++) px(cx + i * 3 + 1, cy + j * 1.5, shade(C, -0.18));
    tri([[cx + 1, cy + 2], [cx + 6 * S, cy + 3], [cx + 3 * S, cy + 8 * S]], shade(C2, -0.1));
    if (has('whiskers')) for (const d of [0, 1]) limb([[cx - rx * 0.9, cy + ry * 0.2], [cx - rx * 1.3, cy + ry * (0.6 + d * 0.5)]], 1, 1, C2);
    if (has('lure')) { for (let i = 0; i < 8 * S; i++) px(cx - rx * 0.5 - i * 0.6, cy - ry - i * 0.8, shade(C, 0.2)); ell(cx - rx * 0.5 - 8 * S * 0.6, cy - ry - 8 * S * 0.8, 2.6, 2.6, C2); }
    if (has('crown')) horns(cx - rx * 0.4, cy - ry * 0.4, ry, 'crown');
    if (!back) { eye(cx - rx * 0.62, cy - ry * 0.2, 1.1); if (shape === 'shark') { for (let i = 0; i < 4; i++) px(cx - rx * 0.9 + i * 1.5, cy + ry * 0.35 + (i % 2), '#ffffff'); } else { px(cx - rx * 0.95, cy + ry * 0.2, INK); px(cx - rx * 0.9, cy + ry * 0.3, INK); } }
  };
  const jelly = () => { // bell with trailing tentacles
    const cx = 24, cy = GY - 20 * S, rx = 10 * S, ry = 7.5 * S;
    for (let i = 0; i < 5; i++) { const x = cx - rx * 0.75 + i * rx * 0.38; limb([[x, cy + 2], [x + (i % 2 ? 2 : -2), cy + 8 * S], [x, cy + 15 * S], [x + (i % 2 ? -1 : 1) * 2, cy + 20 * S]], 2 * S, 1, i % 2 ? C2 : shade(C, -0.1)); }
    ell(cx, cy, rx, ry, C); rect(cx - rx, cy, rx * 2, 2, shade(C, -0.2));
    if (has('core')) ell(cx, cy - 1, rx * 0.35, ry * 0.35, C2, { flat: true, noEdge: true });
    if (has('stars')) { const R = mulberry(11); for (let i = 0; i < 6; i++) { const x = cx + (R() - 0.5) * rx * 1.6, y = cy + (R() - 0.6) * ry * 1.2; px(x, y, '#fff6c8'); } }
    horns(cx, cy, ry, a.horn);
    if (!back) { eye(cx - rx * 0.35, cy - ry * 0.15, 1); eye(cx + rx * 0.25, cy - ry * 0.15, 1); }
  };
  const crab = () => {
    const shape = a.shape || 'crab';
    const cx = 24, cy = GY - 8 * S, rx = (shape === 'scorpion' ? 9 : 11) * S, ry = 6.5 * S;
    if (shape === 'mite') { const r = 8 * S, my = GY - 7 * S; for (let i = 0; i < 4; i++) for (const d of [-1, 1]) limb([[cx + d * r * 0.4, my + 1], [cx + d * (r + 3 * S), my - 3 * S + i * 2 * S], [cx + d * (r + 5 * S), GY]], 1.4, 1, shade(C, -0.35)); ell(cx, my, r, r * 0.8, C); backs(cx - r * 0.7, cx + r * 0.7, my - r * 0.75, a.back, a.backH || 3); if (has('flame')) flame(cx + 1, my - r * 0.6, 5 * S); if (!back) { ell(cx, my + r * 0.3, r * 0.6, r * 0.35, B, { flat: true }); eye(cx - r * 0.4, my - r * 0.2, 1); eye(cx + r * 0.2, my - r * 0.2, 1); } return; }
    if (shape === 'scorpion') limb([[cx + rx * 0.8, cy], [cx + rx + 5 * S, cy - 4 * S], [cx + rx + 6 * S, cy - 12 * S], [cx + rx + 1 * S, cy - 17 * S]], 4 * S, 2.5 * S, C);
    if (shape === 'scorpion') tri([[cx + rx + 1 * S, cy - 19 * S], [cx + rx - 3 * S, cy - 15 * S], [cx + rx + 3 * S, cy - 15 * S]], C2);
    for (let i = 0; i < 3; i++) for (const d of [-1, 1]) { const x = cx + d * (rx * 0.5 + i * 3 * S); for (let j = 0; j < 5 * S; j++) px(x + d * j * 0.4, cy + ry * 0.5 + j, shade(C, -0.25)); }
    ell(cx, cy, rx, ry, C);
    backs(cx - rx * 0.8, cx + rx * 0.8, cy - ry * 0.85, a.back, a.backH || 3);
    if (has('flame')) flame(cx + 2, cy - ry + 2, 5 * S);
    if (!back) ell(cx, cy + ry * 0.35, rx * 0.6, ry * 0.4, B, { flat: true });
    const claw = (x, y, d, big) => { ell(x, y, (big ? 6 : 5) * S, (big ? 5.5 : 4.5) * S, C); tri([[x - d * 2 * S, y - 2 * S], [x + d * 4 * S, y - 7 * S * (big ? 1.3 : 1)], [x + d * 3 * S, y - 1]], C2); };
    if (shape === 'scorpion') claw(cx - rx - 4 * S, cy - ry * 0.2, -1, true);
    else for (const d of [-1, 1]) claw(cx + d * (rx + 3 * S), cy - ry * 0.6, d, has('bigclaw') && d < 0);
    if (shape === 'crab') for (const d of [-1, 1]) { rect(cx + d * 3 * S, cy - ry - 4 * S, 1, 4 * S, shade(C, -0.2)); ell(cx + d * 3 * S, cy - ry - 5 * S, 2.2 * S, 2.2 * S, '#ffffff'); if (!back) eyes.push([cx + d * 3 * S, cy - ry - 5 * S, 0.7]); }
    else if (!back) { eye(cx - rx * 0.55, cy - ry * 0.3, 1); eye(cx - rx * 0.15, cy - ry * 0.35, 1); }
    if (!back) { px(cx - 1, cy + 1, INK); px(cx + 1, cy + 1, INK); }
  };
  const biped = () => {
    const build = a.build || 'brute';
    const D = { golem: [10, 10, 7, 5, 4.5, 8], robot: [9, 9, 7, 5.5, 3.5, 7], gown: [8, 12, 0, 5.5, 2.4, 7], cloak: [8, 12, 0, 6, 2.6, 8], brute: [9, 10, 7, 6.5, 4, 7], lanky: [6, 11, 11, 5.5, 2.4, 9], squat: [10, 8, 4, 7, 4.2, 5], imp: [6.5, 6.5, 5, 7.5, 2.4, 5], knight: [7.5, 10, 8, 6, 3, 7], robe: [8, 12, 0, 6, 2.6, 8], kanga: [8, 9.5, 8, 6, 3, 6] }[build];
    const [trx0, try0, legL, hr0, armW, armL] = D;
    const cx = 25, legH = legL * S, trx = trx0 * S, tr_y = try0 * S, ty = GY - legH - tr_y + 2, hr = hr0 * S * (a.head || 1);
    if (build === 'robe') poly([[cx - trx * 1.2, GY], [cx - trx * 0.8, ty - tr_y * 0.3], [cx + trx * 0.8, ty - tr_y * 0.3], [cx + trx * 1.25, GY]], shade(C, -0.1));
    else if (build === 'gown') { const pts = [[cx - trx * 0.6, ty - tr_y * 0.3]]; for (let i = 0; i <= 6; i++) pts.push([cx - trx * 1.8 + i * trx * 0.6, GY - (i % 2 ? 3 * S : 0)]); pts.push([cx + trx * 0.6, ty - tr_y * 0.3]); poly(pts, shade(C, -0.08)); }
    else if (build === 'cloak') poly([[cx - trx * 1.4, GY], [cx - trx * 0.3, ty - tr_y * 1.6], [cx + trx * 0.4, ty - tr_y * 1.6], [cx + trx * 1.6, GY - 4 * S], [cx + trx * 1.1, GY]], shade(C2, -0.2));
    else if (build === 'kanga') { ell(cx + trx * 0.4, GY - 4 * S, trx * 0.9, 4 * S, shade(C, -0.2)); limb([[cx + trx * 0.6, ty + tr_y * 0.6], [cx + trx * 1.8, ty + tr_y + legH * 0.6], [cx + trx * 2.6, GY - 1]], 4 * S, 2 * S, C); }
    else for (const d of [-1, 1]) { rect(cx + d * trx * 0.45 - 2.5 * S, GY - legH, 5 * S, legH, shade(C, d > 0 ? -0.25 : 0)); ell(cx + d * trx * 0.45 - 1, GY, 3.5 * S, 1.5 * S, shade(C, -0.35)); }
    tail(cx + trx * 0.9, ty + tr_y * 0.5, a.tail);
    if (a.wing) wing(cx + trx * 0.2, ty - tr_y * 0.4, 18 * S, a.wing, 1, C2);
    if (has('cape')) poly([[cx - trx * 0.6, ty - tr_y * 0.8], [cx + trx * 1.4, ty + tr_y * 1.2], [cx + trx * 0.2, ty + tr_y * 1.1], [cx + trx * 0.6, ty - tr_y * 0.8]], C2);
    ell(cx + trx + 1, ty - 1, armW * S, armL * S, shade(C, -0.2)); ell(cx + trx + 2, ty + armL * 0.85 * S, (armW + 0.5) * S, 4 * S, a.fist || C2);
    if (has('shell')) { ell(cx + trx * 0.55, ty - 1, trx * 1.05, tr_y * 1.1, C2); for (let i = -2; i <= 2; i++) limb([[cx + trx * 0.55 + i * 2 * S, ty - tr_y], [cx + trx * 0.55 + i * 3 * S, ty + tr_y * 0.9]], 1, 1, shade(C2, -0.25)); }
    if (build === 'golem' || build === 'robot') poly([[cx - trx * 1.1, ty - tr_y * 0.9], [cx + trx * 1.1, ty - tr_y * 0.9], [cx + trx * 0.85, ty + tr_y * 0.95], [cx - trx * 0.85, ty + tr_y * 0.95]], C);
    else ell(cx, ty, trx, tr_y, C);
    if (!back && build !== 'robe' && build !== 'gown' && build !== 'cloak') ell(cx - 1, ty + 2 * S, trx * 0.6, tr_y * 0.6, B, { flat: true });
    if (build === 'robe' && !back) rect(cx - 1, ty - tr_y * 0.4, 2, tr_y * 1.6, C2);
    backs(cx - trx * 0.3, cx + trx * 0.95, ty - tr_y * 0.75, a.back, a.backH || 3);
    if (has('barnacles')) for (const [bx, by] of [[cx + 4, ty - 4], [cx + 6, ty + 2], [cx - 6, ty - 6]]) ell(bx, by, 1.6, 1.4, '#e8e0d0');
    if (has('core')) { ell(cx, ty, trx * 0.35, tr_y * 0.3, C2, { flat: true, noEdge: true }); ell(cx, ty, trx * 0.15, tr_y * 0.13, '#ffffff', { flat: true, noEdge: true }); }
    if (has('flame')) flame(cx + trx * 0.5, ty - tr_y * 0.6, 5 * S);
    const hx = cx - 2, hy = ty - tr_y - hr * (build === 'golem' ? 0.15 : 0.55);
    if (has('mane')) ell(hx + hr * 0.3, hy + hr * 0.3, hr * 1.45, hr * 1.3, C2);
    if (has('fins')) tri([[hx - 2, hy - hr + 2], [hx + 6, hy - hr + 2], [hx + 4, hy - hr - 8 * S]], C2);
    ears(hx, hy, hr, a.ear);
    if (build === 'robot') { poly([[hx - hr, hy - hr * 0.8], [hx + hr, hy - hr * 0.8], [hx + hr, hy + hr * 0.8], [hx - hr, hy + hr * 0.8]], C2); for (const d of [-1, 1]) { limb([[hx + d * hr * 0.6, hy - hr * 0.8], [hx + d * hr * 0.9, hy - hr * 1.8]], 1.2, 1, INK); ell(hx + d * hr * 0.9, hy - hr * 1.9, 1.4 * S, 1.4 * S, '#f05040'); } }
    else if (has('helm')) { ell(hx, hy, hr * 1.1, hr, C2); rect(hx - hr * 0.9, hy - 1, hr * 1.2, 2, INK); tri([[hx - 1, hy - hr], [hx + 2, hy - hr], [hx + hr, hy - hr - 6 * S]], a.plume || '#d84040'); }
    else ell(hx, hy, hr, hr * 0.9, C);
    if (has('hood')) poly([[hx - hr * 1.15, hy + hr * 0.6], [hx - hr * 0.9, hy - hr * 0.7], [hx + 1, hy - hr * 1.6], [hx + hr * 1.1, hy - hr * 0.6], [hx + hr * 1.15, hy + hr * 0.8]], shade(C2, -0.1));
    horns(hx, hy, hr, a.horn);
    ell(cx - trx - 1, ty - 1, armW * S, armL * S, C); ell(cx - trx - 2, ty + armL * 0.85 * S, (armW + 1) * S, (armW + 0.5) * S, a.fist || C2);
    if (has('orb')) { ell(cx - trx - 3, ty - armL * S * 0.6, 3.5 * S, 3.5 * S, C2); px(cx - trx - 4, ty - armL * S * 0.6 - 1, '#ffffff'); }
    if (!back) {
      if (has('helm')) { eye(hx - hr * 0.45, hy - 2, 0.8); eye(hx + hr * 0.15, hy - 2, 0.8); }
      else { eye(hx - hr * 0.45, hy - 1, 1); eye(hx + hr * 0.25, hy - 1, 0.8); if (a.mouth === 'beak') face(hx, hy, hr, { mouth: 'beak', muzzle: false, eyes: false }); else if (a.mouth === 'tusks' || a.mouth === 'fang') face(hx, hy, hr, { mouth: a.mouth, muzzle: false, eyes: false }); else rect(hx - hr * 0.5, hy + hr * 0.4, hr * 0.8, 1, INK); }
    }
  };
  const plant = () => { // a rooted bulb with leaves and a bloom on top
    const shape = a.shape || 'bulb'; const cx = 24, r = (shape === 'tree' ? 8 : 9) * S, cy = GY - r - 2 * S;
    for (const d of [-1, 1]) { limb([[cx + d * 3 * S, cy + r * 0.7], [cx + d * 6 * S, GY]], 2.5 * S, 1.5, shade(C2, -0.25)); }
    if (shape === 'tree') { ell(cx, cy - r * 1.6, r * 1.6, r * 1.1, C2); ell(cx - r, cy - r * 1.3, r * 0.8, r * 0.7, shade(C2, 0.12)); ell(cx + r, cy - r * 1.4, r * 0.8, r * 0.7, shade(C2, -0.1)); }
    ell(cx, cy, r, r, C); if (!back) ell(cx - r * 0.15, cy + r * 0.4, r * 0.6, r * 0.4, B, { flat: true });
    for (const d of [-1, 1]) poly([[cx + d * r * 0.7, cy], [cx + d * (r + 8 * S), cy - 3 * S], [cx + d * (r + 5 * S), cy + 3 * S]], C2);
    if (shape === 'flower') { for (let i = 0; i < 6; i++) { const an = i / 6 * Math.PI * 2; ell(cx + Math.cos(an) * 5 * S, cy - r - 3 * S + Math.sin(an) * 4 * S, 3.2 * S, 2.6 * S, a.petal || '#f070a0'); } ell(cx, cy - r - 3 * S, 2.6 * S, 2.4 * S, '#ffe060'); }
    if (shape === 'bulb') { limb([[cx, cy - r + 1], [cx + 2 * S, cy - r - 6 * S]], 1.5, 1.5, '#5a8a30'); poly([[cx + 2 * S, cy - r - 6 * S], [cx + 8 * S, cy - r - 10 * S], [cx + 4 * S, cy - r - 3 * S]], C2); }
    if (has('thorns')) for (let i = 0; i < 5; i++) { const an = Math.PI * (0.9 + i * 0.3); tri([[cx + Math.cos(an) * r - 1, cy + Math.sin(an) * r], [cx + Math.cos(an) * r + 1, cy + Math.sin(an) * r], [cx + Math.cos(an) * (r + 3 * S), cy + Math.sin(an) * (r + 3 * S)]], '#f0e8c8'); }
    if (!back) { eye(cx - r * 0.35, cy - r * 0.15, 1); eye(cx + r * 0.3, cy - r * 0.15, 1); px(cx - 1, cy + r * 0.25, INK); px(cx, cy + r * 0.3, INK); }
  };

  const FORMS = { quad, rabbit, bird, bat, worm, blob, frog, wisp, mineral, bug, fish, jelly, crab, biped, plant };
  (FORMS[a.f] || blob)();

  for (const [x, y, big] of eyes) {
    const style = opt.blink ? 'blink' : a.eye;
    const X = Math.round(x), Y = Math.round(y);
    if (style === 'blink' || style === 'sleepy') { px(X - 1, Y + 1, INK); px(X, Y + 1, INK); if (big >= 1) px(X + 1, Y + 1, INK); continue; }
    if (style === 'calm') { px(X - 1, Y, INK); px(X, Y + 1, INK); px(X + 1, Y, INK); continue; }
    if (style === 'glow') { px(X, Y, '#f8f080'); px(X + 1, Y, '#f8f080'); px(X, Y + 1, '#d8c040'); px(X + 1, Y + 1, '#d8c040'); continue; }
    if (style === 'sharp') { px(X - 1, Y, INK); px(X, Y, INK); px(X + 1, Y + 1, INK); px(X, Y + 1, INK); px(X - 1, Y + 1, '#ffffff'); continue; }
    const h = big >= 1 ? 3 : 2;
    for (let j = 0; j < h; j++) { px(X, Y + j, INK); px(X + 1, Y + j, INK); }
    px(X, Y, '#ffffff');
  }
  if (opt.mark && !opt.sil) {
    const R = mulberry(9); const mc = '#fff6d8';
    const cells = []; for (let i = 0; i < W * H; i++) if (P[i] && P[i] !== INK) cells.push(i);
    const pick = () => cells[Math.floor(R() * cells.length)];
    if (opt.mark === 'stars') for (let k = 0; k < 5; k++) { const i = pick(); const x = i % W, y = (i / W) | 0; for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) if (P[(y + dy) * W + x + dx]) P[(y + dy) * W + x + dx] = mc; }
    if (opt.mark === 'spots') for (let k = 0; k < 10; k++) { const i = pick(); P[i] = '#3a2a2a'; if (P[i + 1]) P[i + 1] = '#3a2a2a'; }
    if (opt.mark === 'stripes') for (let y = 0; y < H; y++) if (y % 5 === 0) for (let x = 0; x < W; x++) if (P[y * W + x]) P[y * W + x] = shade(P[y * W + x], -0.35);
    if (opt.mark === 'heart') { const i = cells[Math.floor(cells.length * 0.55)]; const x = i % W, y = (i / W) | 0; for (const [dx, dy] of [[-1, 0], [1, 0], [-2, -1], [-1, -1], [1, -1], [2, -1], [0, 1], [0, 0], [0, 2], [-1, 1], [1, 1]]) if (P[(y + dy) * W + x + dx]) P[(y + dy) * W + x + dx] = '#f05a8a'; }
    if (opt.mark === 'swirl') { const i = cells[Math.floor(cells.length * 0.5)]; const x = i % W, y = (i / W) | 0; for (let t = 0; t < 14; t++) { const r = t * 0.35, an = t * 0.9; const k = (Math.round(y + Math.sin(an) * r)) * W + Math.round(x + Math.cos(an) * r); if (P[k]) P[k] = mc; } }
  }
  const out = new Array(W * H).fill(null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (P[y * W + x]) continue;
    let n = null; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && P[yy * W + xx]) { n = P[yy * W + xx]; break; } }
    if (n) out[y * W + x] = shade(n.startsWith('#') ? n : '#444444', -0.72);
  }
  const c = makeCanvas(W, H), ctx = c.getContext('2d');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let col = P[y * W + x] || out[y * W + x]; if (!col) continue;
    if (opt.sil) col = '#f6f0dc';
    ctx.fillStyle = col; ctx.fillRect(back ? W - 1 - x : x, y, 1, 1);
  }
  return c;
};
