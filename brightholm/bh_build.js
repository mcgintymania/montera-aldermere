'use strict';
for (const k of Object.keys(DATA.quests)) if (!BH_BASE.own.quests.includes(k)) BH_BASE.quests.add(k);
for (const k of Object.keys(DATA.achievements)) if (!BH_BASE.own.ach.includes(k)) BH_BASE.ach.add(k);
/* =====================================================================
   BRIGHTHOLM — building materials and the Larkfield barn Hall
   ===================================================================== */
const BH_WALL = {
  wood(p, x0, y0, w, h, col, seed) {
    const R = mulberry(seed);
    p.r(col, x0, y0, w, h);
    for (let y = y0; y < y0 + h; y += 4) {
      p.r(shade(col, 0.12), x0, y, w, 1); p.r(shade(col, -0.28), x0, y + 3, w, 1);
      for (let x = x0 + Math.floor(R() * 10); x < x0 + w; x += 10 + Math.floor(R() * 12)) p.r(shade(col, -0.32), x, y, 1, 3);
      for (let i = 0; i < 3; i++) p.r(shade(col, -0.12), x0 + Math.floor(R() * w), y + 1 + Math.floor(R() * 2), 2, 1);
    }
  },
  brick(p, x0, y0, w, h, col) {
    p.r(shade(col, 0.45), x0, y0, w, h);
    for (let y = y0, row = 0; y < y0 + h; y += 4, row++) {
      for (let x = x0 - (row % 2) * 4; x < x0 + w; x += 8) {
        const bx = Math.max(x0, x), bw = Math.min(x + 7, x0 + w) - bx; if (bw <= 0) continue;
        const c = (row * 7 + x) % 5 === 0 ? shade(col, -0.12) : (row * 3 + x) % 7 === 0 ? shade(col, 0.08) : col;
        p.r(c, bx, y, bw, 3); p.r(shade(c, 0.15), bx, y, bw, 1);
      }
    }
  },
  stone(p, x0, y0, w, h, col, seed) {
    const R = mulberry(seed);
    p.r(shade(col, -0.35), x0, y0, w, h);
    for (let y = y0; y < y0 + h; y += 5) {
      let x = x0 - Math.floor(R() * 4);
      while (x < x0 + w) {
        const bw = 5 + Math.floor(R() * 5); const bx = Math.max(x0, x), ww = Math.min(x + bw - 1, x0 + w) - bx;
        if (ww > 0) { const c = shade(col, (R() - 0.5) * 0.18); p.r(c, bx, y, ww, 4); p.r(shade(c, 0.18), bx, y, ww, 1); p.r(shade(c, -0.15), bx, y + 3, ww, 1); }
        x += bw;
      }
    }
  },
  timber(p, x0, y0, w, h, col, seed, beam = '#4a2c18') {
    p.r(col, x0, y0, w, h);
    for (let y = y0 + 3; y < y0 + h; y += 6) p.r(shade(col, -0.05), x0, y, w, 1);
    p.r(beam, x0, y0, w, 2); p.r(beam, x0, y0 + Math.floor(h / 2) - 1, w, 2);
    for (let x = x0; x < x0 + w; x += 16) p.r(beam, x, y0, 2, h);
    p.r(beam, x0 + w - 2, y0, 2, h);
  },
  plaster(p, x0, y0, w, h, col) {
    p.r(col, x0, y0, w, h);
    for (let y = y0 + 4; y < y0 + h; y += 5) p.r(shade(col, -0.08), x0, y, w, 1);
  },
};
const BH_ROOF = {
  shingle(p, W, roofH, col) {
    p.r(shade(col, -0.45), 0, 2, W, roofH); p.r(col, 1, 2, W - 2, roofH - 2);
    for (let y = 5; y < roofH - 2; y += 4) { p.r(shade(col, -0.2), 1, y, W - 2, 1); for (let x = ((y / 4) % 2) * 4 + 2; x < W - 2; x += 8) p.r(shade(col, -0.2), x, y - 3, 1, 3); }
    p.r(shade(col, 0.3), 1, 2, W - 2, 2); p.r(shade(col, -0.35), 0, roofH - 2, W, 3);
  },
  thatch(p, W, roofH, col, seed) {
    const R = mulberry(seed);
    p.r(shade(col, -0.4), 0, 1, W, roofH + 1); p.r(col, 1, 1, W - 2, roofH - 1);
    for (let x = 1; x < W - 1; x++) {
      const len = 3 + Math.floor(R() * 6);
      for (let y = 3 + Math.floor(R() * 3); y < roofH - 2; y += len + 2) p.r(R() < 0.5 ? shade(col, -0.18) : shade(col, 0.14), x, y, 1, len);
    }
    for (let y = 6; y < roofH - 3; y += 7) p.r(shade(col, -0.25), 1, y, W - 2, 1);
    p.r(shade(col, 0.28), 2, 1, W - 4, 2);
    for (let x = 0; x < W; x += 2) p.r(shade(col, -0.32), x, roofH - 2, 2, 2 + (x * 7) % 3);
  },
  slate(p, W, roofH, col) {
    p.r(shade(col, -0.45), 0, 2, W, roofH); p.r(col, 1, 2, W - 2, roofH - 2);
    for (let y = 4, row = 0; y < roofH - 2; y += 3, row++) {
      p.r(shade(col, -0.25), 1, y, W - 2, 1);
      for (let x = 2 + (row % 2) * 3; x < W - 2; x += 6) p.r(shade(col, -0.18), x, y - 2, 1, 2);
      for (let x = 4 + (row % 3) * 5; x < W - 2; x += 15) p.r(shade(col, 0.15), x, y - 2, 2, 1);
    }
    p.r(shade(col, 0.35), 1, 2, W - 2, 1); p.r(shade(col, -0.35), 0, roofH - 2, W, 3);
  },
  tin(p, W, roofH, col) {
    p.r(shade(col, -0.45), 0, 2, W, roofH); p.r(col, 1, 2, W - 2, roofH - 2);
    for (let x = 2; x < W - 2; x += 3) { p.r(shade(col, 0.22), x, 3, 1, roofH - 5); p.r(shade(col, -0.2), x + 1, 3, 1, roofH - 5); }
    for (const [x, y] of [[9, 7], [W - 16, 12], [W / 2 | 0, 5]]) p.r('#a8582a', x, y, 3, 2);
    p.r(shade(col, -0.35), 0, roofH - 2, W, 3);
  },
};
const BH_HOUSE = {
  farmhouse: { wall: 'wood', wallCol: '#c8904a', roof: 'thatch', roofCol: '#d8b060', chimney: '#8a8478', boxes: true, door: '#3a6a4a' },
  brick: { wall: 'brick', wallCol: '#b04a32', roof: 'slate', roofCol: '#4a5466', chimney: '#8a3a2a', door: '#2a3a5a', trim: '#f2ece0' },
  stone: { wall: 'stone', wallCol: '#a8a090', roof: 'slate', roofCol: '#5a5048', chimney: '#7a7468', boxes: true, door: '#7a3a2a' },
  timber: { wall: 'timber', wallCol: '#f2e8d4', roof: 'shingle', roofCol: '#7a4a3a', chimney: '#8a5a3a', door: '#5a3a20' },
  cottage: { wall: 'plaster', wallCol: '#e8dcc8', roof: 'thatch', roofCol: '#c8a050', chimney: '#a8a090', boxes: true, door: '#3a5a8a' },
  barn: { wall: 'wood', wallCol: '#a8382a', roof: 'tin', roofCol: '#9aa4ae', barnDoor: true, noWindows: true },
};

function renderBhHouse(b) {
  const st = BH_HOUSE[b.style];
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const seed = b.x * 31 + b.y * 17;
  const wallH = 28, roofH = H - wallH, wy = roofH + 1;
  BH_ROOF[st.roof](p, W, roofH, st.roofCol, seed);
  if (st.chimney) { p.r(shade(st.chimney, -0.4), W - 14, 0, 7, 9); p.r(st.chimney, W - 13, 0, 5, 8); p.r(shade(st.chimney, 0.25), W - 13, 0, 5, 1); }
  BH_WALL[st.wall](p, 0, wy, W, wallH - 1, st.wallCol, seed);
  p.r(shade(st.wallCol, -0.45), 0, wy, 1, wallH); p.r(shade(st.wallCol, -0.45), W - 1, wy, 1, wallH);
  p.r('rgba(0,0,0,0.18)', 0, wy, W, 2);
  p.r('#7a6a58', 0, H - 3, W, 3); p.r('#9a8a74', 0, H - 3, W, 1);
  const frame = st.trim || '#f2ece0';
  if (!st.noWindows) {
    for (let col = 0; col < b.w; col++) {
      if (col === b.door) continue;
      if (b.w <= 5 && col !== 0 && col !== b.w - 1 && Math.abs(col - b.door) < 1) continue;
      if (b.w > 5 && col % 2 !== (b.door % 2 ? 0 : 1) && col !== 0 && col !== b.w - 1) continue;
      const x = col * TS + 3, y = wy + 5;
      p.r(shade(frame, -0.5), x - 2, y - 2, 14, 13); p.r(frame, x - 1, y - 1, 12, 11);
      p.r('#9fd6f2', x, y, 10, 9); p.r('#d8f0ff', x, y, 4, 2);
      p.r(frame, x + 4, y, 2, 9); p.r(frame, x, y + 4, 10, 1);
      windows.push({ x: x + 5, y: y + 4, r: 14, rect: [x, y, 10, 9] });
      if (st.boxes) {
        p.r('#6a3a20', x - 1, y + 10, 12, 3); p.r('#8a5030', x - 1, y + 10, 12, 1);
        for (let i = 0; i < 5; i++) { p.r('#3aa860', x + i * 2, y + 8, 2, 2); p.r(['#e85a6a', '#f0d040', '#f4f0e8'][i % 3], x + i * 2, y + 8, 1, 1); }
      }
    }
  }
  const dx = b.door * TS;
  if (st.barnDoor) {
    const bx = dx - 6, bw = 28, by = H - 25;
    p.r('#3a1a12', bx, by, bw, 22); p.r('#8a2a20', bx + 1, by + 1, bw - 2, 21);
    p.r('#f2ece0', bx + 1, by + 1, bw - 2, 2); p.r('#f2ece0', bx + 1, by + 10, bw - 2, 2); p.r('#f2ece0', bx + 13, by + 1, 2, 21);
    for (let i = 0; i < 8; i++) { p.r('#f2ece0', bx + 2 + i * 1.4 | 0, by + 3 + i, 2, 1); p.r('#f2ece0', bx + 25 - (i * 1.4 | 0), by + 3 + i, 2, 1); }
    p.r('#5a3a20', 4, wy + 3, 10, 9); p.r('#e8c870', 5, wy + 6, 8, 5);
    p.r('#5a3a20', W - 14, wy + 3, 10, 9); p.r('#e8c870', W - 13, wy + 6, 8, 5);
  } else {
    p.r('#2a1a10', dx + 2, H - 22, 12, 19); p.r(st.door, dx + 3, H - 21, 10, 18);
    p.r(shade(st.door, 0.2), dx + 4, H - 20, 3, 7); p.r(shade(st.door, 0.2), dx + 9, H - 20, 3, 7);
    p.r(shade(st.door, 0.2), dx + 4, H - 11, 3, 7); p.r(shade(st.door, 0.2), dx + 9, H - 11, 3, 7);
    p.r('#f0d060', dx + 11, H - 13, 1, 2);
    p.r(shade(st.wallCol, -0.5), dx + 1, H - 24, 14, 2);
  }
  p.r('#a89884', dx + 1, H - 3, 14, 3);
  return { img: c, windows };
}

function renderBarnHall(b) {
  const W = b.w * TS, H = b.h * TS; const c = makeCanvas(W, H), p = pen(c.getContext('2d')); const windows = [];
  const cx = W / 2, apex = 14, knee = 32, wy = 54;
  const roof = '#7a2a22', wood = '#c88a40', trim = '#f2ece0';
  const hw = (y) => (y < knee ? 8 + (y - apex) * (W / 2 - 18 - 8) / (knee - apex) : W / 2 - 18 + (y - knee) * 18 / (wy - knee));
  BH_WALL.wood(p, 0, apex, W, H - apex - 3, wood, 7);
  for (let y = apex; y < wy; y++) { const w = Math.round(hw(y)); p.ctx.clearRect(0, y, Math.round(cx - w), 1); p.ctx.clearRect(Math.round(cx + w), y, W, 1); }
  for (let y = apex - 4; y < wy + 2; y++) {
    const w = hw(Math.max(apex, y)) + 3;
    const band = y < apex ? Math.round(w) : 8;
    p.r(roof, Math.round(cx - w), y, band, 1); p.r(roof, Math.round(cx + w - band), y, band, 1);
    p.r(shade(roof, 0.3), Math.round(cx - w), y, 1, 1); p.r(shade(roof, -0.4), Math.round(cx + w - 1), y, 1, 1);
  }
  for (let y = apex - 4; y < apex; y++) { const w = hw(apex) + 3 - (apex - y); p.r(roof, Math.round(cx - w), y, Math.round(w * 2), 1); }
  p.r(shade(roof, -0.4), 0, wy, 7, 2); p.r(shade(roof, -0.4), W - 7, wy, 7, 2);
  p.r('rgba(0,0,0,0.2)', 0, wy + 2, W, 2);
  p.r(trim, 0, wy - 1, W, 1);
  p.r('#7a6a58', 0, H - 3, W, 3); p.r('#9a8a74', 0, H - 3, W, 1);
  const lx = cx - 5;
  p.r('#4a2c18', lx - 1, 0, 12, 10); p.r(trim, lx, 2, 10, 8); p.r('#ffe07a', lx + 2, 4, 6, 5); p.r('#fff8d0', lx + 4, 5, 2, 2);
  p.r(roof, lx - 2, 0, 14, 2); p.r('#3a3a44', cx, -1, 1, 1);
  windows.push({ x: cx, y: 6, r: 26 });
  const loftY = 26;
  p.r('#4a2c18', cx - 7, loftY, 14, 12); p.r(trim, cx - 6, loftY + 1, 12, 10); p.r('#ffe07a', cx - 5, loftY + 2, 10, 8);
  p.r(trim, cx - 1, loftY + 2, 2, 8); p.r(trim, cx - 5, loftY + 5, 10, 1);
  windows.push({ x: cx, y: loftY + 6, r: 16, rect: [cx - 5, loftY + 2, 10, 8] });
  p.r('#3a1a12', cx - 9, wy - 9, 18, 8); p.r('#e8c040', cx - 8, wy - 8, 16, 6);
  p.r('#8a5a20', cx - 1, wy - 7, 2, 4); p.r('#8a5a20', cx - 4, wy - 6, 8, 1); p.r('#fff4c0', cx - 3, wy - 8, 6, 1);
  const dx = b.door * TS, bx = dx - 6, bw = 28, by = H - 28;
  p.r('#3a1a12', bx, by, bw, 25); p.r('#8a2a20', bx + 1, by + 1, bw - 2, 24);
  p.r(trim, bx + 1, by + 1, bw - 2, 2); p.r(trim, bx + 1, by + 12, bw - 2, 2); p.r(trim, bx + 13, by + 1, 2, 24);
  for (let i = 0; i < 9; i++) { p.r(trim, bx + 2 + (i * 1.3 | 0), by + 3 + i, 2, 1); p.r(trim, bx + 24 - (i * 1.3 | 0), by + 3 + i, 2, 1); }
  p.r('#ffe07a', dx + 2, by + 15, 12, 9);
  windows.push({ x: dx + 8, y: by + 18, r: 16 });
  for (const x of [8, W - 30]) {
    p.r('#4a2c18', x, wy + 8, 22, 14); p.r(trim, x + 1, wy + 9, 20, 12); p.r('#9fd6f2', x + 2, wy + 10, 18, 10);
    p.r(trim, x + 10, wy + 10, 2, 10); p.r(trim, x + 2, wy + 14, 18, 1);
    windows.push({ x: x + 11, y: wy + 15, r: 16, rect: [x + 2, wy + 10, 18, 10] });
  }
  for (const x of [bx - 13, bx + bw + 2]) {
    p.r('#a8862a', x, H - 12, 11, 9); p.r('#e8c060', x + 1, H - 11, 9, 7); p.r('#c8a040', x + 1, H - 8, 9, 1); p.r('#c8a040', x + 5, H - 11, 1, 7);
  }
  return { img: c, windows };
}

{
  const rb0 = renderBuilding;
  renderBuilding = function (b) {
    if (b.kind === 'hall' && b.style === 'barn') return renderBarnHall(b);
    if (b.style && BH_HOUSE[b.style]) return renderBhHouse(b);
    return rb0(b);
  };
}
