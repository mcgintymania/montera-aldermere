'use strict';
/* =====================================================================
   BRIGHTHOLM — Where the last new Wildmon live, and the Old Shale Mine:
   a dark cave where a better Lantern lights more of the way
   ===================================================================== */
const addEnc = (map, kind, tods, entry) => {
  const e = DATA.encounters[map] || (DATA.encounters[map] = {});
  const k = e[kind] || (e[kind] = {});
  for (const tod of tods) (k[tod] || (k[tod] = [])).push(entry);
};
addEnc('furrow_lane', 'grass', ['day'], ['chirpling', 14, 2, 4]);
addEnc('furrow_lane', 'grass', ['day'], ['seedsprout', 4, 3, 4]);
addEnc('furrow_lane', 'fish', ['day', 'night'], ['goldkoi', 6, 4, 7]);
addEnc('quarry_road', 'grass', ['day'], ['ashfoal', 8, 8, 11]);
addEnc('quarry_road', 'grass', ['day', 'night'], ['gritmole', 8, 8, 11]);
addEnc('shale_pass', 'grass', ['day'], ['cooper', 12, 14, 17]);
addEnc('shale_pass', 'grass', ['night'], ['binrascal', 12, 14, 17]);
addEnc('starfall_road', 'grass', ['day'], ['cooper', 10, 36, 38]);
addEnc('starfall_road', 'grass', ['night'], ['binrascal', 10, 36, 38]);
addEnc('starfall_road', 'grass', ['night'], ['comette', 8, 36, 39]);
addEnc('lumen_climb', 'grass', ['night'], ['comette', 8, 50, 53]);
addEnc('lumen_climb', 'grass', ['day', 'night'], ['frostpuff', 10, 50, 53]);
addEnc('sunward_shore', 'grass', ['day', 'night'], ['pincrab', 12, 28, 31]);
addEnc('sunward_shore', 'grass', ['night'], ['fogling', 10, 28, 31]);
addEnc('saltreach', 'grass', ['night'], ['fogling', 12, 33, 36]);
Object.assign(DATA.species.binrascal, { habitat: 'Shalebrook Pass and Starfall Road at night, on its way to raid the Vantage bins' });
Object.assign(DATA.species.cooper, { habitat: 'Shalebrook Pass and Starfall Road, on its way to the Vantage pavements' });
Object.assign(DATA.species.seedsprout, { habitat: 'Now and then on Furrow Lane, and in gardens that are well looked after' });
Object.assign(DATA.species.frostpuff, { habitat: 'High up Lumen Climb' });
Object.assign(DATA.species.moltworm, { habitat: 'The Old Shale Mine, glowing softly in the dark' });
Object.assign(DATA.species.grotbat, { habitat: 'The Old Shale Mine, roosting upside down' });

/* ---------- The Old Shale Mine ---------- */
DATA.tiles['ɘ'] = { t: 'cavefloor' };
DATA.maps.shale_pass.buildings = (DATA.maps.shale_pass.buildings || []).concat([{ kind: 'cavemouth', x: 3, y: 4, w: 2, h: 3, door: 1, to: { map: 'shale_mine', x: 9, y: 14, dir: 'up' } }]);
DATA.maps.shale_pass.props.push({ type: 'sign', x: 6, y: 6, text: 'OLD SHALE MINE\nClosed for forty years. Bring a bright Lantern.' });
DATA.maps.shale_mine = {
  name: 'Old Shale Mine', region: 'farreach', music: 'cave', outdoor: false, caveEnc: true, darkCave: true,
  rows: [
    'EEEEEEEEEEEEEEEEEEEE',
    'EɘɘɘɘEEEEEEEEɘɘɘɘɘɘE',
    'EɘɘɘɘɘɘɘEEEEɘɘɘɘɘɘɘE',
    'EEEɘɘɘɘɘɘEEɘɘɘEEEɘɘE',
    'EɘɘɘɘEEɘɘɘɘɘɘEEEEɘɘE',
    'EɘɘɘɘEEEEɘɘɘEEɘɘɘɘɘE',
    'EɘEEɘɘɘɘEɘɘɘEɘɘɘEEEE',
    'EɘEEɘɘɘɘEEɘEEɘɘɘɘɘɘE',
    'EɘɘɘɘEEɘɘɘɘɘɘɘEEEɘɘE',
    'EEEɘɘEEɘɘEEEɘɘɘɘEɘɘE',
    'EɘɘɘɘɘɘɘɘEEEEEɘɘEɘɘE',
    'EɘEEEEEɘɘɘɘɘɘEɘɘɘɘɘE',
    'EɘɘɘɘɘEEEEɘɘɘEEEEɘEE',
    'EEEEɘɘɘɘɘɘɘɘɘɘɘɘɘɘɘE',
    'EEEEEEEEɘɘɘEEEEEEEEE',
    'EEEEEEEEEɘEEEEEEEEEE',
  ],
  warps: [{ x: 9, y: 15, to: { map: 'shale_pass', x: 4, y: 7, dir: 'down' } }],
  items: [
    { id: 'dl', x: 1, y: 1, item: 'dusk_lantern', qty: 3 }, { id: 'ns', x: 18, y: 1, item: 'scroll_cragcharge' },
    { id: 'hp', x: 1, y: 10, item: 'super_potion', qty: 2 }, { id: 'rc', x: 18, y: 9, item: 'rare_candy', hidden: true },
  ],
  npcs: [
    { id: 'oldminer', x: 10, y: 13, dir: 'down', look: 'miner', name: 'Old Miner', talk: ['Forty years I worked this mine. Dark as a pocket down here.', 'A plain Lantern lights a little. A Great Lantern lights more. A Dusk Lantern? That lights the whole tunnel.', 'Mind the Grotbat. They hum, then they bite.'] },
  ],
};
DATA.encounters.shale_mine = { cave: { day: [['moltworm', 30, 14, 17], ['grotbat', 30, 14, 17], ['gritmole', 20, 14, 17], ['armlet', 10, 14, 17], ['pebblin', 10, 14, 17]] } };
DATA.encounters.shale_mine.cave.night = DATA.encounters.shale_mine.cave.day;
const lanternLight = () => {
  if (!G) return 0.6;
  if (G.bag.dusk_lantern) return 1.6;
  if (G.bag.great_lantern) return 1.25;
  if (G.bag.lantern) return 1;
  return 0.6;
};
{
  const dw = Game.drawWorld.bind(Game);
  Game.drawWorld = function (ctx) {
    dw(ctx);
    if (!World.map || !World.map.darkCave) return;
    const [cx, cy] = this.camera(); const p = this.player; const k = lanternLight();
    const x = p.drawX + 8 - cx, y = p.drawY + 6 - cy;
    const g = ctx.createRadialGradient(x, y, 10 * k, x, y, 58 * k);
    g.addColorStop(0, 'rgba(6,6,14,0)'); g.addColorStop(1, 'rgba(6,6,14,0.94)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = 'rgba(255,220,140,0.06)'; ctx.beginPath(); ctx.arc(x, y, 30 * k, 0, Math.PI * 2); ctx.fill();
  };
}
DATA.mapEnter.shale_mine = () => {
  if (G.flags.mine_seen) return; G.flags.mine_seen = 1;
  Script.run((s) => s.say([lanternLight() >= 1.6 ? 'You hold up a Dusk Lantern. Its glow fills the old tunnels.' : lanternLight() >= 1 ? 'You hold up a Lantern. It lights a little way into the dark.' : 'It is pitch dark. Even a plain Lantern would help.'], { sign: true }));
};
