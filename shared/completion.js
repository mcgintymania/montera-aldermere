/* =====================================================================
   COMPLETION — how much of the game is done, as a percentage made of
   weighted parts. Shared by both games; each saves its summary in the
   save file so the title screen and the Companion can show it.
   ===================================================================== */
const Completion = {
  isBrightholm() { return typeof BH_BADGES !== 'undefined'; },
  part(id, name, weight, have, need, hint) { need = Math.max(1, need); return { id, name, w: weight, have: Math.max(0, Math.min(have, need)), need, hint }; },
  caught(k) { return !!(G.dex && G.dex[k] && G.dex[k].caught); },
  done(k) { return !!(G.quests && G.quests[k] && G.quests[k].done); },

  aldermere() {
    const f = G.flags || {}; const P = this.part.bind(this);
    const qs = Object.keys(DATA.quests); const main = qs.filter((k) => DATA.quests[k].kind === 'main'); const side = qs.filter((k) => DATA.quests[k].kind !== 'main');
    const dex = DATA.speciesList.filter((k) => DATA.species[k]); const legends = dex.filter((k) => DATA.species[k].rarity === 'legendary');
    const ach = Object.keys(DATA.achievements);
    const ranks = typeof ARENA_RANKS !== 'undefined' ? ARENA_RANKS.slice(1).map((r) => r.min) : [1100, 1250, 1400, 1550, 1700];
    const best = (G.arena && G.arena.best) || 0;
    return [
      P('badges', 'Hall Badges', 16, ['bloom', 'tide', 'spark', 'forge', 'veil', 'gale', 'frost', 'iron'].filter((b) => f['sigil_' + b]).length, 8, 'Earn all eight Hall Badges.'),
      P('champion', 'Champion', 10, f.champion ? 1 : 0, 1, 'Beat the four Gatekeepers and the Champion.'),
      P('story', 'Story quests', 10, main.filter((k) => this.done(k)).length, main.length, 'Finish the story, including the Starfall Isles after the League.'),
      P('side', 'Side quests', 7, side.filter((k) => this.done(k)).length, side.length, 'Finish every side quest. Check your quest log for who to talk to.'),
      P('wildbook', 'Wildbook', 25, dex.filter((k) => this.caught(k)).length, dex.length, 'Catch every Wildmon. Try other times of day, fishing, surfing and evolving.'),
      P('legends', 'Wardens and legends', 7, legends.filter((k) => this.caught(k)).length, legends.length, 'Find and catch the Wardens and the other legends.'),
      P('masters', 'Lantern Masters', 5, G.ach && G.ach.lantern_master ? 1 : 0, 1, 'Defeat the Lantern Masters and Solenne in the Starfall Isles.'),
      P('spire', 'Battle Spire', 5, Math.min(21, f.bs_best || 0), 21, 'Win 21 battles in a row at the Battle Spire.'),
      P('arena', 'Arena rank', 5, ranks.filter((m) => best >= m).length, ranks.length, 'Climb the Arena all the way to Lantern rank.'),
      P('ach', 'Achievements', 10, ach.filter((k) => G.ach && G.ach[k]).length, ach.length, 'Earn every achievement on your trainer card.'),
    ];
  },

  brightholm() {
    const f = G.flags || {}; const P = this.part.bind(this);
    const own = (k) => !BH_BASE.quests.has(k);
    const qs = Object.keys(DATA.quests).filter(own);
    const main = qs.filter((k) => DATA.quests[k].kind === 'main'); const boards = qs.filter((k) => k.startsWith('bq_'));
    const side = qs.filter((k) => !main.includes(k) && !boards.includes(k));
    const dex = bhRegionalDex();
    const friends = Object.keys(FRIENDS); const fr = G.friends || {};
    const trials = Object.keys(DATA.trials || {});
    const re = Object.keys(REMATCH).map((t) => 're_' + t).concat(['re_skye']);
    const reDone = re.filter((t) => f['beat_' + t]).length + (f.kit_redeemed ? (f.beat_kit_fair ? 1 : 0) : 0);
    const help = Object.keys(JOBS).map((k) => 'job_' + k).concat(TRADES.map((T) => T.id));
    const ach = this.bhAchievements();
    return [
      P('badges', 'Hall Badges', 14, BH_BADGES.filter((b) => f['sigil_' + b.id]).length, 8, 'Earn all eight Hall Badges.'),
      P('festival', 'The lantern festival', 4, f.festival_done ? 1 : 0, 1, 'Save the lantern festival.'),
      P('champion', 'Champion', 8, f.bh_champion ? 1 : 0, 1, 'Climb Lumen Climb, beat the Gatekeepers and the Champion.'),
      P('story', 'Story quests', 4, main.filter((k) => this.done(k)).length, main.length, 'Finish the story quests.'),
      P('side', 'Side and friend quests', 6, side.filter((k) => this.done(k)).length, side.length, 'Finish every side quest and friend quest.'),
      P('boards', 'Quest boards', 5, boards.filter((k) => this.done(k)).length, boards.length, 'Take on every job from the quest boards in Stockridge, Vantage City, Coralport and Starfall.'),
      P('friends', 'Friends', 8, friends.reduce((a, k) => a + Math.min(5, (fr[k] && fr[k].lv) || 0), 0), friends.length * 5, 'Reach five hearts with all ten friends. Talk every day and bring presents they love.'),
      P('wildbook', 'Brightholm Wildbook', 20, dex.filter((k) => this.caught(k)).length, dex.length, 'Catch every Wildmon found in Brightholm.'),
      P('halcyra', 'Halcyra', 3, this.caught('halcyra') ? 1 : 0, 1, 'After becoming Champion, look under the old Paragon pit on Quarry Road.'),
      P('rematch', 'Rematches', 8, reDone, re.length + (f.kit_redeemed ? 1 : 0), 'As Champion, beat every Hall Master and Skye in a rematch' + (f.kit_redeemed ? ', and Kit in his fair rematch.' : '.')),
      P('trials', 'Frontier Trials', 8, trials.reduce((a, k) => a + Math.min(3, f['trial_' + k] || 0), 0), trials.length * 3, 'Win Gold in every Frontier Trial.'),
      P('houses', 'Houses', 4, Object.keys(G.homes || {}).filter((k) => HOUSES[k]).length, Object.keys(HOUSES).length, 'Buy all three houses: Stockridge, Starfall and Coralport.'),
      P('helping', 'Trades and town jobs', 4, help.filter((k) => f[k]).length, help.length, 'Make every NPC trade and help with every town job.'),
      P('ach', 'Achievements', 4, ach.filter((k) => G.ach && G.ach[k]).length, ach.length, 'Earn every achievement on your trainer card.'),
    ];
  },
  bhAchievements() { return Object.keys(DATA.achievements).filter((k) => !BH_BASE.ach.has(k)); },

  parts() { return this.isBrightholm() ? this.brightholm() : this.aldermere(); },
  summary() {
    const parts = this.parts();
    const w = parts.reduce((a, p) => a + p.w, 0);
    const got = parts.reduce((a, p) => a + p.w * (p.have / p.need), 0);
    const pct = Math.floor((got / w) * 1000) / 10;
    return { pct: parts.every((p) => p.have >= p.need) ? 100 : Math.min(99.9, pct), parts };
  },
  /* refreshed every time the game saves; a toast for each new tenth */
  stamp() {
    let s; try { s = this.summary(); } catch { return; }
    const before = G.completion && typeof G.completion.pct === 'number' ? G.completion.pct : null;
    G.completion = { pct: s.pct, parts: s.parts.map((p) => [p.id, p.name, p.have, p.need, p.w]) };
    if (G.flags && G.flags[this.isBrightholm() ? 'bh_champion' : 'champion'] && !G.flags.comp_champ_told) {
      G.flags.comp_champ_told = 1;
      setTimeout(() => UI.toast('Champion!', `Your adventure is ${Math.floor(s.pct)}% complete. Your trainer card shows what is left.`, true), 900);
    } else if (before !== null && Math.floor(s.pct / 10) > Math.floor(before / 10)) {
      setTimeout(() => UI.toast(s.pct >= 100 ? 'Everything done!' : `${Math.floor(s.pct / 10) * 10}% complete`, s.pct >= 100 ? 'You have completed the whole game. Amazing!' : 'See your trainer card for what is left.', true), 900);
    }
  },
  /* the trainer card page */
  render(body) {
    const s = this.summary();
    const head = h('div', 'comphead'); head.append(h('span', 'cpl', 'Completion'), h('span', 'cpv', `${s.pct >= 100 ? 100 : s.pct.toFixed(1)}%`));
    const bar = h('div', 'cpbar'); const fill = h('i'); fill.style.width = `${s.pct}%`; bar.appendChild(fill);
    body.append(head, bar);
    const list = h('div', 'complist');
    for (const p of s.parts) {
      const r = h('div', 'cprow' + (p.have >= p.need ? ' on' : ''));
      const b = h('span', 'cpb'); const i = h('i'); i.style.width = `${(p.have / p.need) * 100}%`; b.appendChild(i);
      r.append(h('span', 'cpm', p.have >= p.need ? '★' : '☆'), h('span', 'cpn', p.name), b, h('span', 'cpc', p.need > 1 ? `${p.have}/${p.need}` : p.have ? 'Done' : '–'));
      if (p.have < p.need) r.appendChild(h('span', 'cph', p.hint));
      list.appendChild(r);
    }
    body.appendChild(list);
  },
};
{
  const snap = Save.snapshot.bind(Save);
  Save.snapshot = function () { Completion.stamp(); return snap(); };
}
