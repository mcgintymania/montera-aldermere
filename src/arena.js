'use strict';
/* =====================================================================
   ARENA — a ranked ladder and friend battles by team code, both in the
   Battle Spire lobby once you are Champion.
   ===================================================================== */

/* ---------- Ranks ---------- */
const ARENA_RANKS = [
  { name: 'Copper', min: 0, reward: null },
  { name: 'Bronze', min: 1100, reward: ['rare_candy', 2] },
  { name: 'Silver', min: 1250, reward: ['spark_prism', 1] },
  { name: 'Gold', min: 1400, reward: ['lucky_ribbon', 1] },
  { name: 'Crystal', min: 1550, reward: ['spark_prism', 2] },
  { name: 'Lantern', min: 1700, reward: ['sovereign_lantern', 1] },
];
const ARENA_CLASSES = ['Arena Rookie', 'Arena Regular', 'Arena Ace', 'Arena Veteran', 'Arena Star', 'Arena Legend'];
const Arena = {
  state() {
    if (!G.arena || typeof G.arena !== 'object') G.arena = {};
    const a = G.arena;
    for (const [k, v] of [['rating', 1000], ['best', 1000], ['w', 0], ['l', 0], ['streak', 0], ['fw', 0], ['fl', 0]]) if (typeof a[k] !== 'number') a[k] = v;
    if (!a.ranks || typeof a.ranks !== 'object') a.ranks = {};
    return a;
  },
  tier(r) { let t = 0; ARENA_RANKS.forEach((x, i) => { if (r >= x.min) t = i; }); return t; },
  rankName(r) { return ARENA_RANKS[this.tier(r)].name; },
  label() { const a = this.state(); return `${this.rankName(a.rating)} (${a.rating})`; },
  /* an opponent whose strength follows your rating */
  opponent(rating) {
    const t = this.tier(rating);
    const opp = Math.max(900, Math.round(rating + (Math.random() * 120 - 60)));
    const finals = Object.keys(DATA.species).filter((k) => { const s = DATA.species[k]; return !s.legend && !s.evo.length; });
    const total = (k) => DATA.species[k].base.reduce((a, b) => a + b, 0);
    const lo = [380, 420, 440, 460, 480, 490][t];
    let pool = finals.filter((k) => total(k) >= lo); if (pool.length < 6) pool = finals;
    const pick = []; while (pick.length < 3) { const sp = pool[Math.floor(Math.random() * pool.length)]; if (!pick.includes(sp)) pick.push(sp); }
    const pot = Math.min(15, 4 + t * 2);
    const name = SPIRE_NAMES[Math.floor(Math.random() * SPIRE_NAMES.length)]; const look = SPIRE_LOOKS[Math.floor(Math.random() * SPIRE_LOOKS.length)];
    const lines = [['Ready when you are!'], ['I have been training all week for this.'], ['Your rating says you are good. Let us see if it is right.'],
      ['I do not lose twice to the same trainer.'], ['Only the best make it this far. Show me why you belong.'], ['A Lantern-rank battle. Let the whole island watch.']];
    const holds = Object.keys(DATA.items).filter((k) => DATA.items[k].hold);
    return {
      rating: opp,
      trainer: { cls: ARENA_CLASSES[t], name, look, team: pick.map((sp) => [sp, 50]), prize: 0, ai: t >= 2 ? 'expert' : 'tactical', music: 'battlespire', intro: lines[t], lose: 'Good battle.', after: '' },
      team: pick.map((sp) => Mon.create(sp, 50, { lustre: false, mark: null, ti: Math.floor(Math.random() * 2), item: t >= 3 && holds.length ? holds[Math.floor(Math.random() * holds.length)] : null,
        pot: { hp: pot, atk: pot, def: pot, spa: pot, spd: pot, spe: pot } })),
    };
  },
  change(me, opp, won) {
    const exp = 1 / (1 + Math.pow(10, (opp - me) / 400));
    return won ? Math.max(8, Math.round(32 * (1 - exp))) : -Math.max(6, Math.round(32 * exp));
  },
  /* fight with a Lv 50 copy of the team, then put the real party back */
  async fight(s, team, opts) {
    const saved = G.party;
    try {
      G.party = team;
      return await s.battle(Object.assign({ kind: 'trainer', music: 'battlespire', noWhiteout: true, noExp: true, noItems: true }, opts));
    } finally { G.party = saved; }
  },
};

/* ---------- Team codes ---------- */
const TeamCode = {
  PREFIX: 'MTEAM1.',
  encode(party) {
    const t = party.slice(0, 6).map((m) => [m.sp, m.nick || 0, m.moves.map((x) => x.id).join(' '), DATA.statKeys.map((k) => (m.pot[k] || 0).toString(16)).join(''), m.temp, m.ti || 0, m.item || 0, m.lustre ? 1 : 0]);
    const json = JSON.stringify({ n: G.name, t });
    return this.PREFIX + btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') + '~';
  },
  decode(text) {
    try {
      const raw = String(text || '');
      const at = raw.indexOf(this.PREFIX); if (at < 0) return null;
      let body = raw.slice(at + this.PREFIX.length); const end = body.indexOf('~');
      body = end >= 0 ? body.slice(0, end) : body.split(/\s/)[0];
      let b = body.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '=';
      const o = JSON.parse(decodeURIComponent(escape(atob(b))));
      if (!o || !Array.isArray(o.t) || !o.t.length || o.t.length > 6) return null;
      const name = String(o.n || 'Friend').replace(/[^\p{L}\p{N} '\-]/gu, '').slice(0, 12) || 'Friend';
      const team = [];
      for (const r of o.t) {
        if (!Array.isArray(r) || r.length !== 8 || typeof r[2] !== 'string' || typeof r[3] !== 'string' || !/^[0-9a-f]{6}$/.test(r[3])) return null;
        const e = { s: r[0], n: r[1] || null, m: r[2].split(' ').filter(Boolean), p: r[3].split('').map((c) => parseInt(c, 16)), t: r[4], i: r[5], h: r[6] || null, l: r[7] };
        if (!e || !DATA.species[e.s] || !Array.isArray(e.m) || !e.m.length || e.m.length > 4 || !e.m.every((id) => DATA.moves[id])) return null;
        if (!Array.isArray(e.p) || e.p.length !== 6 || !e.p.every((v) => Number.isInteger(v) && v >= 0 && v <= 15)) return null;
        if (!Number.isInteger(e.t) || !DATA.temperaments[e.t]) return null;
        if (e.h && !(DATA.items[e.h] && DATA.items[e.h].hold)) return null;
        const pot = {}; DATA.statKeys.forEach((k, i) => { pot[k] = e.p[i]; });
        const m = Mon.create(e.s, 50, { lustre: !!e.l, mark: null, temp: e.t, ti: e.i === 1 ? 1 : 0, item: e.h || null, pot, moves: e.m });
        if (e.n) m.nick = String(e.n).replace(/[^\p{L}\p{N} '\-]/gu, '').slice(0, 10) || null;
        team.push(m);
      }
      return { name, team };
    } catch { return null; }
  },
};

/* ---------- The code panel: show a code to copy, or paste one in ---------- */
UI.teamCode = function (mode, code) {
  return new Promise((res) => {
    const p = this.panel('teamcode', mode === 'share' ? 'Your team code' : 'Battle a friend');
    const help = h('div', 'box desc tchelp', mode === 'share'
      ? 'Send this code to a friend. They paste it at the Link Terminal in the Battle Spire to battle your team, played by the game.'
      : 'Paste the team code your friend sent you, then press Battle.');
    const ta = h('textarea', 'tcbox'); ta.spellcheck = false; ta.autocomplete = 'off';
    if (mode === 'share') { ta.value = code; ta.readOnly = true; } else ta.placeholder = 'MTEAM1.…';
    const row = h('div', 'tcrow'); const err = h('div', 'err', '');
    const btn = (label, fn) => { const b = h('div', 'btn', label); b.addEventListener('pointerdown', (e) => { e.preventDefault(); fn(); }); row.appendChild(b); return b; };
    const done = (v) => { Input.textMode = false; p.finish(); res(v); };
    if (mode === 'share') {
      btn('Copy', () => {
        ta.select();
        const ok = () => { err.textContent = 'Copied! Now paste it into a message to your friend.'; Sound.sfx('confirm'); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, () => { document.execCommand('copy'); ok(); });
        else { document.execCommand('copy'); ok(); }
      });
      if (navigator.share) btn('Share', () => { navigator.share({ title: 'My Montera team', text: code }).catch(() => {}); });
      btn('Done', () => done(null));
    } else {
      btn('Battle', () => {
        const t = TeamCode.decode(ta.value);
        if (!t) { err.textContent = 'That code doesn\'t work. Ask your friend to copy the whole code again.'; Sound.sfx('bump'); return; }
        Sound.sfx('confirm'); done(t);
      });
      btn('Cancel', () => { Sound.sfx('cancel'); done(null); });
    }
    p.el.append(help, ta, row, err);
    p.el.querySelector('.pclose').addEventListener('pointerdown', () => { Input.textMode = false; res(null); });
    ta.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Escape') { e.preventDefault(); done(null); } });
    p.input = (a) => { if (a === 'b' || a === 'menu') done(null); };
    Input.textMode = true;
    setTimeout(() => { if (mode === 'share') ta.select(); else ta.focus(); }, 60);
  });
};

/* ---------- People in the Battle Spire lobby ---------- */
DATA.maps.spire_lobby.npcs.push(
  { id: 'arena', x: 2, y: 5, dir: 'right', look: 'ace2', script: 'arenaDesk', name: 'Arena Registrar' },
  { id: 'link', x: 12, y: 5, dir: 'left', look: 'engineer', script: 'linkTerminal', name: 'Link Operator' },
);
DATA.maps.spire_lobby.props.push({ type: 'sign', x: 12, y: 2, text: 'THE ARENA\nRanked battles, three on three at level 50.\nRanks: Copper, Bronze, Silver, Gold, Crystal and Lantern.\nThe Link Terminal takes on your friends\' teams.' });

Object.assign(DATA.scripts, {
  async arenaDesk(s) {
    const o = { name: 'Arena Registrar' };
    const a = Arena.state();
    if (!s.flag('arena_intro')) {
      s.set('arena_intro');
      await s.say(['Welcome to the Arena! Every win raises your rating, every loss lowers it.',
        'Climb from Copper through Bronze, Silver, Gold and Crystal, all the way to Lantern rank.',
        'Your first three Wildmon fight at level 50, healed before each battle. Reach a new rank and there is a prize waiting.'], o);
    }
    for (;;) {
      const next = ARENA_RANKS[Arena.tier(a.rating) + 1];
      const c = await s.ask(`Rank: ${Arena.label()}. Record ${a.w}-${a.l}.${next ? ` ${next.name} at ${next.min}.` : ''}`, ['Ranked battle', 'Rank prizes', 'Leave'], o);
      if (c === 1) {
        await s.say(ARENA_RANKS.slice(1).map((r) => `${r.name} (${r.min}): ${r.reward[1] > 1 ? r.reward[1] + ' x ' : ''}${DATA.items[r.reward[0]] ? DATA.items[r.reward[0]].name : r.reward[0]}${a.ranks[r.name] ? '. Claimed.' : '.'}`), o);
        continue;
      }
      if (c !== 0) return s.say('Come back and climb whenever you like.', o);
      if (G.party.length < 3) return s.say('You need at least three Wildmon in your party for a ranked battle.', o);
      const opp = Arena.opponent(a.rating);
      await s.say([`Your opponent: ${opp.trainer.cls} ${opp.trainer.name}, rated ${opp.rating}.`, ...opp.trainer.intro], o);
      const team = G.party.slice(0, 3).map(spireClone);
      const res = await Arena.fight(s, team, { trainer: opp.trainer, enemy: opp.team });
      const won = res === 'win';
      const before = a.rating; const tierBefore = Arena.tier(before);
      const d = Arena.change(a.rating, opp.rating, won);
      a.rating = Math.max(800, a.rating + d); a.best = Math.max(a.best, a.rating);
      if (won) { a.w++; a.streak++; } else { a.l++; a.streak = 0; }
      const bp = won ? 2 + Arena.tier(a.rating) : 0; G.bp = (G.bp || 0) + bp;
      Game.dirty = true;
      await s.say([`${won ? 'Victory!' : 'Defeat.'} Rating ${before} → ${a.rating} (${d > 0 ? '+' : ''}${d}).${bp ? ` +${bp} BP.` : ''}${a.streak >= 3 ? ` ${a.streak} wins in a row!` : ''}`], o);
      for (let t = tierBefore + 1; t <= Arena.tier(a.rating); t++) {
        const r = ARENA_RANKS[t]; if (a.ranks[r.name]) continue;
        a.ranks[r.name] = 1; Sound.sfx('levelup');
        await s.say(`You reached ${r.name} rank!`, { sign: true });
        await s.give(r.reward[0], r.reward[1]);
        if (r.name === 'Lantern') s.achieve('arena_lantern');
      }
      if (!won && Arena.tier(a.rating) < tierBefore) await s.say(`You dropped to ${Arena.rankName(a.rating)} rank. You can climb back up!`, o);
      if (won) s.achieve('arena_win');
    }
  },
  async linkTerminal(s) {
    const o = { name: 'Link Operator' };
    const a = Arena.state();
    if (!s.flag('link_intro')) {
      s.set('link_intro');
      await s.say(['This is the Link Terminal. It turns a whole team into a code you can send to a friend.',
        'Paste a friend\'s code here and you can battle their team, played by the game. Everyone fights at level 50.'], o);
    }
    const c = await s.ask(`Friend battles: ${a.fw} won, ${a.fl} lost.`, ['Share my team', 'Battle a friend', 'Leave'], o);
    if (c === 0) { await UI.teamCode('share', TeamCode.encode(G.party)); return s.say('Your friend can battle that team any time. It will not change, even if your party does.', o); }
    if (c !== 1) return s.say('Come back any time.', o);
    const t = await UI.teamCode('paste');
    if (!t) return s.say('Come back when you have a code.', o);
    await s.say(`${t.name}'s team: ${t.team.map((m) => Mon.name(m)).join(', ')}.`, o);
    const team = G.party.slice(0, 6).map(spireClone);
    const trainer = { cls: 'Friend', name: t.name, look: 'ace', team: t.team.map((m) => [m.sp, 50]), prize: 0, ai: 'expert', music: 'battlespire', intro: [], lose: 'Nice one!', after: '' };
    const res = await Arena.fight(s, team, { trainer, enemy: t.team });
    if (res === 'win') { a.fw++; s.achieve('friend_win'); } else a.fl++;
    Game.dirty = true;
    return s.say(res === 'win' ? [`You beat ${t.name}'s team! Better let them know.`] : [`${t.name}'s team won this time. Tweak your team and try again!`], o);
  },
});
DATA.achievements.arena_win = { name: 'Arena Debut', desc: 'Win a ranked battle in the Arena.' };
DATA.achievements.arena_lantern = { name: 'Lantern Rank', desc: 'Reach Lantern rank in the Arena.' };
DATA.achievements.friend_win = { name: 'Friendly Rivalry', desc: 'Beat a friend\'s team at the Link Terminal.' };
