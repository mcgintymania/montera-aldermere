'use strict';
/* =====================================================================
   LANTERN STORAGE — Wildmon you are not carrying rest in their Lanterns
   on Lantern Shelves. Every Hearthhouse shelf is linked to your Lantern
   Warehouse, so you can reach them from any Hearthhouse. Space grows by
   upgrading at the Lantern Warehouse in Port Calder.
   ===================================================================== */
DATA.storageTiers = [
  { name: 'Lantern Shelf', cap: 30, desc: 'A single wooden shelf of Lanterns.' },
  { name: 'Lantern Storeroom', cap: 90, price: 5000, desc: 'A whole room of shelves at the Warehouse.' },
  { name: 'Lantern Warehouse', cap: 240, price: 20000, badges: 4, desc: 'Racks from floor to ceiling, with a keeper on duty day and night.' },
  { name: 'Lantern Bunker', cap: 600, price: 60000, badges: 8, desc: 'A deep vault under the docks. Room for a whole region of Wildmon.' },
];
const LanternStorage = {
  tierIdx() { return Math.min(DATA.storageTiers.length - 1, (G && G.storeTier) || 0); },
  tier() { return DATA.storageTiers[this.tierIdx()]; },
  cap() { return this.tier().cap; },
  full() { return G.box.length >= this.cap(); },
  title() { return `${this.tier().name} (${G.box.length}/${this.cap()})`; },
};
DATA.tiles.t = { t: 'lshelf', solid: true, text: 'A Lantern Shelf. Wildmon rest inside the glowing Lanterns.' };
TILE_DRAW.lshelf = function (p, f) {
  TILE_DRAW.wall(p, 0, 1);
  p.r('#5a3a20', 0, 0, 16, 16); p.r('#7a4b2a', 1, 1, 14, 14);
  for (const y of [1, 8]) {
    p.r('#4a2c14', 1, y + 6, 14, 1);
    for (let i = 0; i < 3; i++) {
      const x = 2 + i * 5; const glow = (i + y + f) % 3 === 0 ? '#fff4c0' : '#ffd870';
      p.r('#c8a040', x, y, 3, 1); p.r('#2a2a32', x, y + 1, 3, 5); p.r(glow, x + 1, y + 2, 1, 3);
    }
  }
};
TILE_FRAMES.lshelf = 3;
{
  const gt = Gfx.tile.bind(Gfx);
  Gfx.tile = function (name, f, v) { if (name === 'lshelf') f = Math.floor(Game.t * 1.5); return gt(name, f, v); };
}
/* Every storage terminal becomes a Lantern Shelf */
for (const m of Object.values(DATA.maps)) {
  for (const [k, sc] of Object.entries(m.tileScripts || {})) {
    if (sc !== 'storagePc') continue;
    const [x, y] = k.split(',').map(Number); const r = m.rows[y];
    if (r && r[x] === 'P') m.rows[y] = r.slice(0, x) + 't' + r.slice(x + 1);
    if (m.tileText && m.tileText[k]) delete m.tileText[k];
  }
}
DATA.scripts.storagePc = async function (s) {
  if (!G.party.length && !G.box.length) return s.say(['A Lantern Shelf. Wildmon that do not fit in your party rest here in their Lanterns.', 'You do not have any Wildmon yet.']);
  if (!s.flag('shelf_intro')) {
    s.set('shelf_intro');
    await s.say(['Rows of Lanterns glow softly on the shelf.', 'Every Hearthhouse shelf is linked to your Lantern Warehouse, so your Wildmon can be fetched from any Hearthhouse.',
      `You have a ${LanternStorage.tier().name} with room for ${LanternStorage.cap()} Wildmon. The Lantern Warehouse in Port Calder can add more space.`]);
  } else await s.say(`${G.name} checked the Lantern Shelf. (${G.box.length}/${LanternStorage.cap()})`);
  await UI.storage();
};
/* No room left: stop the Lantern throw before it is used up */
{
  const use0 = BattleScene.useItem.bind(BattleScene);
  BattleScene.useItem = async function (act) {
    const it = DATA.items[act.id];
    if (it && it.battle === 'catch' && G.party.length >= 6 && LanternStorage.full()) {
      await this.say([`There is no room for another Wildmon! Your party and your ${LanternStorage.tier().name} are both full.`, 'Release some Wildmon, or upgrade at the Lantern Warehouse in Port Calder.']);
      return null;
    }
    return use0(act);
  };
}
DATA.scripts.warehouseKeeper = async function (s) {
  const o = { name: 'Keeper Lumley' };
  const i = LanternStorage.tierIdx(), next = DATA.storageTiers[i + 1];
  await s.say([`Welcome to the Lantern Warehouse! Every Hearthhouse shelf in Aldermere sends its Lanterns here.`, `You have a ${LanternStorage.tier().name}: ${G.box.length} of ${LanternStorage.cap()} spaces used.`], o);
  if (!next) return s.say('You have the biggest vault we have. There is no more room to give!', o);
  const need = next.badges && Prog.sigils() < next.badges && !G.flags.champion;
  if (need) return s.say([`Next up is the ${next.name} (${next.cap} spaces). ${next.desc}`, `I can only open that for trainers with ${next.badges} Badges, mind. Come back when you have them!`], o);
  const c = await s.ask(`Upgrade to the ${next.name} (${next.cap} spaces) for ${next.price} Cr?`, ['Upgrade', 'Not now'], o);
  if (c !== 0) return s.say('Come back any time.', o);
  if (G.money < next.price) return s.say(`Sorry, that is ${next.price} Cr and you have ${G.money} Cr.`, o);
  G.money -= next.price; G.storeTier = i + 1; Game.dirty = true; Sound.sfx('item');
  await s.say([`Done! You now have a ${next.name} with room for ${next.cap} Wildmon.`, 'Every Hearthhouse shelf can reach it straight away.'], o);
  if (G.storeTier >= 2) Game.achieve('hoarder');
};
DATA.achievements.hoarder = { name: 'Lantern Keeper', desc: 'Upgrade your storage to a Lantern Warehouse.' };
{
  const mig = Save.migrate.bind(Save);
  Save.migrate = function (d) {
    d = mig(d);
    if (d && typeof d === 'object' && typeof d.storeTier !== 'number') {
      // older saves keep every Wildmon: start on the smallest tier that already fits them, free of charge
      const n = (d.box || []).length; let t = 0; while (t < DATA.storageTiers.length - 1 && DATA.storageTiers[t].cap < n) t++; d.storeTier = t;
    }
    return d;
  };
}
