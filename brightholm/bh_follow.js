'use strict';
/* =====================================================================
   BRIGHTHOLM — your lead Wildmon walks beside you
   ===================================================================== */
const Follow = {
  e: null, map: null, hidden: true, imgs: new Map(),
  mon() { if (!G || !Settings.follow || !G.party) return null; return G.party.find((m) => m.hp > 0) || null; },
  visible() { return !!(this.e && !this.hidden && this.map === World.id && this.mon() && Game.mode === 'world'); },
  reset() { const p = Game.player; if (!p) return; this.e = new Entity(p.x, p.y, p.dir, null); this.map = World.id; this.hidden = true; },
  stepped(fromX, fromY, speed, jump) {
    if (!this.e || this.map !== World.id) this.reset();
    const e = this.e;
    if (this.hidden) { e.x = e.fx = fromX; e.y = e.fy = fromY; e.dir = Game.player.dir; e.moving = false; this.hidden = false; return; }
    const dx = fromX - e.x, dy = fromY - e.y;
    if (Math.abs(dx) + Math.abs(dy) !== 1) { e.x = e.fx = fromX; e.y = e.fy = fromY; e.moving = false; return; }
    e.startMove(dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up', fromX, fromY, speed, jump);
  },
  img(m, dir) {
    const k = `${m.sp}|${m.lustre ? 1 : 0}|${dir}`;
    let c = this.imgs.get(k); if (c) return c;
    const src = MonArt.get(m.sp, { lustre: m.lustre, back: dir === 'up' });
    c = makeCanvas(24, 24); const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    if (dir === 'right') { x.translate(24, 0); x.scale(-1, 1); }
    x.drawImage(src, 0, 0, 48, 48, 0, 0, 24, 24);
    this.imgs.set(k, c); return c;
  },
  draw(ctx, cx, cy, t) {
    const e = this.e, m = this.mon();
    const sx = Math.round(e.drawX - cx), sy = Math.round(e.drawY - cy);
    const hop = e.moving ? Math.round(Math.abs(Math.sin(e.prog * Math.PI)) * 2) : Math.round(Math.sin(t * 2.5) * 0.6);
    const lift = e.jump && e.moving ? Math.round(Math.sin(e.prog * Math.PI) * 10) : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(sx + 3, sy + 13, 10, 2);
    ctx.drawImage(this.img(m, e.dir === 'down' ? 'left' : e.dir), sx - 4, sy - 9 - hop - lift);
    if (this.heart > 0) { const hy = sy - 16 - Math.round((1 - this.heart) * 6); ctx.fillStyle = '#e8434f'; for (const [x, y, w] of [[2, 0, 2], [5, 0, 2], [1, 1, 7], [2, 2, 5], [3, 3, 3], [4, 4, 1]]) ctx.fillRect(sx + 4 + x, hy + y, w, 1); }
  },
  heart: 0,
  line(m) {
    const n = Mon.name(m), s = DATA.species[m.sp], ty = s.types, map = World.map;
    const night = Game.phase().night, rain = map.outdoor && World.weather === 'rain', b = m.bond || 0;
    if (m.hp < Mon.maxHp(m) / 3) return `${n} looks worn out. It could do with a rest.`;
    if (rain && ty.includes('fire')) return `${n} huddles close to you, keeping its flame out of the rain.`;
    if (rain && (ty.includes('water') || ty.includes('grass'))) return `${n} is splashing happily in the puddles.`;
    if (night && (ty.includes('ghost') || ty.includes('dark'))) return `${n} seems wide awake and full of mischief tonight.`;
    if (night && map.outdoor) return `${n} is gazing up at the stars.`;
    if (map.region === 'larkfield' && !map.outdoor) return `${n} sniffs around happily. It seems right at home.`;
    if (map.name && /Hall/.test(map.name)) return `${n} is fizzing with excitement. It wants to battle!`;
    if (b >= 220) return `${n} looks up at you with complete trust.`;
    if (b >= 170) return `${n} nuzzles against your leg.`;
    if (b >= 110) return `${n} is happily walking beside you.`;
    return `${n} is watching you curiously.`;
  },
  async talk(s) {
    const m = this.mon(); if (!m) return;
    const p = Game.player; const e = this.e;
    e.dir = p.x < e.x ? 'left' : p.x > e.x ? 'right' : p.y < e.y ? 'up' : 'down';
    Sound.sfx('confirm');
    const now = Date.now();
    if (!G.partnerT || G.partnerT > G.playtime || G.playtime - G.partnerT > 600) { G.partnerT = G.playtime; m.bond = Math.min(255, (m.bond || 0) + 3); Game.dirty = true; this.heart = 1; }
    await s.say(this.line(m));
    if ((!G.findT || G.findT > G.playtime || G.playtime - G.findT > 900) && Math.random() < 0.25) {
      G.findT = G.playtime; Game.dirty = true;
      const r = Math.random(); const id = r < 0.5 ? 'potion' : r < 0.85 ? 'lantern' : 'super_potion';
      await s.say(`Oh? ${Mon.name(m)} is holding something in its mouth...`);
      await s.give(id);
    }
  },
};
{
  const sm0 = Entity.prototype.startMove;
  Entity.prototype.startMove = function (dir, tx, ty, speed = 1, jump = false) {
    const fx = this.x, fy = this.y;
    sm0.call(this, dir, tx, ty, speed, jump);
    if (this === Game.player && G) Follow.stepped(fx, fy, speed, jump);
  };
  const load0 = World.load.bind(World);
  World.load = function (id) { load0(id); if (Game.player) Follow.reset(); else Follow.e = null; };
  const ew0 = Game.enterWorld.bind(Game);
  Game.enterWorld = function (st) { ew0(st); Follow.reset(); };
  const un0 = Game.updateNPCs.bind(Game);
  Game.updateNPCs = function (dt) { un0(dt); if (Follow.e) Follow.e.update(dt); if (Follow.heart > 0) Follow.heart = Math.max(0, Follow.heart - dt * 0.8); };
  const ia0 = Game.interact.bind(Game);
  Game.interact = function () {
    const p = this.player; const [dx, dy] = DIRS[p.dir]; const x = p.x + dx, y = p.y + dy;
    if (Follow.visible() && !Follow.e.moving && Follow.e.x === x && Follow.e.y === y && !World.npcAt(x, y)) return Script.run((s) => Follow.talk(s));
    return ia0();
  };
}
