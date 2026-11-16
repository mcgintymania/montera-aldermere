'use strict';
/* =====================================================================
   BRIGHTHOLM — The Lantern Link (bring Wildmon over from Aldermere),
   the Brightholm Wildbook and memories of the old save
   ===================================================================== */
const BH_REGIONS = new Set(['larkfield', 'farreach', 'stockridge', 'shalebrook', 'vantage', 'starfall', 'sunward', 'league']);

/* ---------- The Brightholm Wildbook: every Wildmon you can get in Brightholm ---------- */
function bhRegionalDex() {
  if (DATA.bhDex) return DATA.bhDex;
  const set = new Set(['bristling', 'blazeling', 'snapling', 'halcyra']);
  for (const [id, enc] of Object.entries(DATA.encounters)) {
    const m = DATA.maps[id]; if (!m || !BH_REGIONS.has(m.region)) continue;
    for (const kind of Object.values(enc)) for (const tod of Object.values(kind || {})) for (const e of tod || []) if (DATA.species[e[0]]) set.add(e[0]);
  }
  let grew = true;
  while (grew) { grew = false; for (const sp of [...set]) for (const e of DATA.species[sp].evo || []) if (DATA.species[e.to] && !set.has(e.to)) { set.add(e.to); grew = true; } }
  return (DATA.bhDex = DATA.speciesList.filter((k) => set.has(k)));
}
const bhDexCaught = () => bhRegionalDex().filter((k) => G.dex[k] && G.dex[k].caught).length;
const bhDexSeen = () => bhRegionalDex().filter((k) => G.dex[k] && G.dex[k].seen).length;
DATA.items.bh_crest = { name: 'Brightholm Crest', pocket: 'key', desc: 'Dad carved it from Larkfield oak. Proof that you caught every Wildmon in the Brightholm Wildbook.' };
DATA.achievements.bh_dex = { name: 'Brightholm Wildbook', desc: 'Catch every Wildmon in the Brightholm Wildbook.' };

/* ---------- Memories of the old save in dialogue ---------- */
{
  const f0 = fmt;
  fmt = function (t) {
    let s = String(t);
    if (s.includes('{partner}') || s.includes('{warden}')) {
      const L = (G && G.legend) || Legend.fallback();
      s = s.replace(/\{partner\}/g, Legend.partnerName(L) || 'their partner')
        .replace(/\{warden\}/g, L.wardens && L.wardens.length && DATA.species[L.wardens[0]] ? DATA.species[L.wardens[0]].name : 'a Warden');
    }
    return f0(s);
  };
}
{
  const tilly = DATA.maps.larkfield.npcs.find((n) => n.id === 'tilly');
  if (tilly) tilly.talk = tilly.talk.concat(['I saw {legend} once, you know, at the Vantage parade. {partner} was riding on the float, waving at everybody.']);
  const wynn = (DATA.maps.stockridge.npcs || []).find((n) => /wynn/i.test(n.id) || /Wynn/.test(n.name || ''));
  if (wynn && wynn.talk) wynn.talk = wynn.talk.concat(['They say {legend} once caught {warden}. A Warden! With their own two hands and a Lantern.']);
  DATA.maps.starfall.npcs.push({ id: 'oldfan', x: 5, y: 15, dir: 'right', look: 'gentleman', name: 'Collector', talk: ['I collect anything to do with {legend}. Postcards, badges, a little carved {partner}.', 'My prize? A photo of {legend} with {warden}. Signed!'] });
}

/* ---------- The Lantern Link ---------- */
DATA.maps.bh_bedroom.tileScripts = Object.assign({}, DATA.maps.bh_bedroom.tileScripts, { '8,1': 'bhLink' });
function aldermereSaves() {
  const out = [];
  for (const n of [1, 2, 3]) {
    try { const d = JSON.parse(localStorage.getItem('mq_slot_' + n)); if (d && typeof d === 'object' && d.name && (d.party || d.box)) out.push(d); } catch { /* unreadable */ }
  }
  return out;
}
const linkCap = () => (G.flags.bh_champion ? 70 : 10 + Prog.sigils() * 5);
Object.assign(DATA.scripts, {
  async bhLink(s) {
    const o = { name: 'Lantern Link' };
    await s.say(['The Lantern Link. Dad set it up so you can call a Wildmon over from Aldermere.', 'It makes a copy of their light here. Nothing in Aldermere changes.'], { sign: true });
    const saves = aldermereSaves();
    if (!saves.length) return s.say(['No Aldermere adventure found on this device.'], o);
    if (G.flags.link_day === Math.floor((G.playtime || 0) / 1200)) return s.say(['The Lantern Link is recharging. It can call one Wildmon each day.'], o);
    const si = saves.length === 1 ? 0 : await s.ask('Which Aldermere adventure?', saves.map((d) => d.name).concat(['Cancel']), o);
    if (si < 0 || si >= saves.length) return;
    const d = saves[si];
    const all = (d.party || []).concat(d.box || []).filter((m) => m && DATA.species[m.sp] && !(DATA.species[m.sp].legend && !G.flags.bh_champion));
    if (!all.length) return s.say(['There is no Wildmon in that adventure the Link can call.'], o);
    const cap = linkCap();
    const labels = all.map((m) => `${m.nick ? m.nick + ' (' + DATA.species[m.sp].name + ')' : DATA.species[m.sp].name}  Lv ${Math.max(5, Math.min(m.lv || 5, cap))}${m.lustre ? ' ✦' : ''}`);
    await s.say([G.flags.bh_champion ? `Choose a Wildmon to call over. As Champion, it can arrive at full strength, up to Lv ${cap}.` : `Choose a Wildmon to call over. It will arrive at Lv ${cap} at most. Each Badge lets it arrive 5 levels stronger, and becoming Champion lets it arrive at full strength.`], o);
    const i = await UI.menu(labels.concat(['Cancel']), { cls: 'choice', cancel: labels.length });
    if (i < 0 || i >= all.length) return;
    const src = all[i];
    const moves = (src.moves || []).map((mv) => (typeof mv === 'string' ? mv : mv && mv.id)).filter((id) => DATA.moves[id]);
    const m = Mon.create(src.sp, Math.max(5, Math.min(src.lv || 5, cap)), { lustre: !!src.lustre, mark: src.mark || null, ti: 0, moves: moves.length ? moves.slice(0, 4) : undefined });
    m.nick = src.nick || null; m.met = { map: 'Aldermere, by Lantern Link', lv: m.lv, at: Date.now() }; m.hp = Mon.maxHp(m);
    const dx = G.dex[src.sp] || (G.dex[src.sp] = {}); dx.seen = 1; dx.caught = 1;
    G.flags.link_day = Math.floor((G.playtime || 0) / 1200); Game.dirty = true;
    Sound.sfx('lustre');
    await s.say([`A soft light fills the screen... ${Mon.name(m)} steps out of the Lantern Link!`], { sign: true });
    if (G.party.length < 6) { G.party.push(m); await s.say(`${Mon.name(m)} joined your team!`, { sfx: 'caught' }); }
    else { G.box.push(m); await s.say(`${Mon.name(m)} was sent to storage.`, { sfx: 'caught' }); }
  },
});

/* ---------- Dad rewards a complete Brightholm Wildbook ---------- */
{
  const dad0 = DATA.scripts.bhLinden;
  DATA.scripts.bhLinden = async function (s, n) {
    if (s.flag('bh_champion') && s.flag('starter_gift') && !s.has('bh_crest') && bhDexCaught() === bhRegionalDex().length) {
      const o = { name: 'Dad' };
      await s.say(['Hang on. Is that your Wildbook? Let me see...', 'Every single Wildmon in Brightholm. Every one! Your mum is going to cry.', 'I carved this for whoever managed it. I never thought it would be you. Well. I hoped.'], o);
      await s.give('bh_crest'); await s.give('rare_candy', 5); Game.achieve('bh_dex');
      return;
    }
    return dad0(s, n);
  };
}
