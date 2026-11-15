'use strict';
/* =====================================================================
   BRIGHTHOLM — Frontier Trials: optional challenges that earn trophies
   ===================================================================== */
const MEDALS = [null, { id: 'bronze', name: 'Bronze', c1: '#c8804a', c2: '#f0c090' }, { id: 'silver', name: 'Silver', c1: '#b8c4d0', c2: '#ffffff' }, { id: 'gold', name: 'Gold', c1: '#e8b830', c2: '#fff4a0' }];
DATA.trials = {
  roundup: { name: 'Stockridge Round-Up', where: 'Stockridge', host: 'Wrangler Tess', par: 9, silver: 15,
    desc: 'Nudge three runaway Steerling back into their hay pens. Fewer pushes earn a better trophy.',
    rewards: [null, ['great_lantern', 2], ['super_potion', 3], ['rare_candy', 1]] },
  gauntlet: { name: 'Quarry Gauntlet', where: 'Quarry Road', host: 'Foreman Bram',
    desc: 'Beat three quarry crews in a row with no healing in between. Keep your whole team standing for Gold.',
    rewards: [null, ['great_lantern', 2], ['super_potion', 3], ['rare_candy', 1]] },
};
DATA.achievements.first_trial = { name: 'Trailblazer', desc: 'Earn a trophy in a Frontier Trial.' };
DATA.achievements.gold_trial = { name: 'Solid Gold', desc: 'Earn a Gold trophy in a Frontier Trial.' };

const Trials = {
  run: null,
  best(id) { return (G && G.flags['trial_' + id]) || 0; },
  medalName(m) { return m ? MEDALS[m].name : 'No trophy yet'; },
  async award(s, id, medal, host) {
    const tr = DATA.trials[id], prev = this.best(id);
    await s.say(`${MEDALS[medal].name} trophy!`, { name: host, sfx: 'badge' });
    if (medal <= prev) return s.say(prev === 3 ? ["You already hold the Gold. Nobody does it better!"] : [`Your best is still ${MEDALS[prev].name}. Have another go any time!`], { name: host });
    G.flags['trial_' + id] = medal; Game.dirty = true;
    await UI.trophyShow(tr, medal);
    for (let m = prev + 1; m <= medal; m++) { const [it, n] = tr.rewards[m]; await s.give(it, n); }
    Game.achieve('first_trial'); if (medal === 3) Game.achieve('gold_trial');
    await s.say(medal < 3 ? [`It'll go in your trophy cabinet at home. Come back and try for ${MEDALS[medal + 1].name}!`] : ['A Gold trophy! Your cabinet back home is going to look grand.'], { name: host });
  },
};

const TrophyArt = {
  cache: new Map(),
  canvas(medal) {
    if (this.cache.has(medal)) return this.cache.get(medal);
    const c = makeCanvas(19, 19), x = c.getContext('2d');
    const m = MEDALS[medal], c1 = m ? m.c1 : '#3a3f55', c2 = m ? m.c2 : '#2e3246', edge = m ? shade(m.c1, -0.55) : '#22263a';
    const rows = ['', '', '  EEEEEEEEEEE', 'EEELLHMMMMMMEEE', 'E ELHMMMMMMME E', 'E ELMMMMMMMME E', 'EE EMMMMMMMDE EE', ' EEEMMMMMMDEEE', '   EMMMMMDDE', '    EEMMDEE', '      EME', '      EME', '     EMMME', '    EEEEEEE', '   EDDDDDDDE', '   EDDDDDDDE', '   EEEEEEEEE'];
    for (let j = 0; j < rows.length; j++) for (let i = 0; i < rows[j].length; i++) {
      const k = rows[j][i]; if (k === ' ') continue;
      x.fillStyle = k === 'E' ? edge : k === 'L' ? (m ? '#ffffff' : c1) : k === 'H' ? c2 : k === 'D' ? shade(c1, -0.25) : c1;
      x.fillRect(i + 2, j, 1, 1);
    }
    if (m) { x.fillStyle = '#ffffff'; x.fillRect(9, 4, 1, 1); }
    this.cache.set(medal, c); return c;
  },
};

Object.assign(UI, {
  trophyShow(tr, medal) {
    return new Promise((res) => {
      const p = this.panel('badgeshow');
      p.el.querySelector('.pclose').remove();
      const cv = makeCanvas(19, 19); cv.className = 'bsbig'; cv.getContext('2d').drawImage(TrophyArt.canvas(medal), 0, 0);
      const wrap = h('div', 'bswrap'); wrap.append(cv, h('div', 'bshine'));
      p.el.append(wrap, h('div', 'bsname', `${MEDALS[medal].name} Trophy`), h('div', 'bssub', `Frontier Trial · ${tr.name}`), h('div', 'bstap', '▼'));
      const done = () => { p.finish(); res(); };
      p.el.addEventListener('pointerdown', (e) => { e.preventDefault(); done(); });
      p.input = (a) => { if (a === 'a' || a === 'b') done(); };
    });
  },
  trialHud(text) {
    let el = document.getElementById('trialhud');
    if (!text) { if (el) el.remove(); return; }
    if (!el) { el = h('div', 'trialhud'); el.id = 'trialhud'; (document.getElementById('stage') || document.body).parentElement.appendChild(el); }
    el.textContent = text;
  },
});
{
  const tc = UI.trophyCabinet.bind(UI);
  UI.trophyCabinet = function () {
    const done = tc();
    const el = [...document.querySelectorAll('.panel.cabinet')].pop();
    if (el) { const p = { el };
      p.el.appendChild(h('div', 'cabhead', 'Frontier Trials'));
      const grid = h('div', 'cabgrid cabtrials'); p.el.appendChild(grid);
      for (const [id, tr] of Object.entries(DATA.trials)) {
        const m = Trials.best(id), cell = h('div', 'cabcell' + (m ? ' on' : ''));
        const cv = makeCanvas(19, 19); cv.className = 'cabbadge'; cv.getContext('2d').drawImage(TrophyArt.canvas(m), 0, 0);
        cell.append(cv, h('div', 'cabname', m || G.flags['trial_seen_' + id] ? tr.name : '???'), h('div', 'cabsub', m ? MEDALS[m].name : ''));
        grid.appendChild(cell);
      }
      const n = Object.keys(DATA.trials).filter((id) => Trials.best(id)).length;
      p.el.appendChild(h('div', 'hint', `${n} of ${Object.keys(DATA.trials).length} trophies found so far. More Frontier Trials wait across Brightholm.`));
    }
    return done;
  };
}

/* ---------- Herding: Steerling you nudge like boulders ---------- */
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'herd') {
      const ox = pr.anim ? Math.round(pr.anim.dx * (1 - pr.anim.k) * -16) : 0, oy = pr.anim ? Math.round(pr.anim.dy * (1 - pr.anim.k) * -16) : 0;
      const home = World.ch(pr.x, pr.y) === '{';
      const bob = home ? 0 : Math.round(Math.sin(t * 3 + pr.x) * 1);
      ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(sx + 3 + ox, sy + 13 + oy, 10, 2);
      ctx.drawImage(OverMon.img(pr.sp), sx - 4 + ox, sy - 9 + bob + oy);
      if (home && !pr.anim) { ctx.fillStyle = '#e8434f'; for (const [x, y, w] of [[2, 0, 2], [5, 0, 2], [1, 1, 7], [2, 2, 5], [3, 3, 3], [4, 4, 1]]) ctx.fillRect(sx + 4 + x, sy - 14 + y, w, 1); }
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
  const origStep = Game.tryStep.bind(Game);
  Game.tryStep = function (d) {
    const p = this.player; const [dx, dy] = DIRS[d]; const nx = p.x + dx, ny = p.y + dy;
    const b = World.propAt(nx, ny);
    if (b && b.type === 'herd') {
      p.dir = d;
      const bx = nx + dx, by = ny + dy; const tile = World.tile(bx, by);
      const free = World.inBounds(bx, by) && !World.blocked(bx, by, b) && !World.warps[bx + ',' + by] && !(tile && tile.water);
      if (!free) { this.bump(); return; }
      Sound.sfx('push'); b.x = bx; b.y = by; b.anim = { dx, dy, k: 0 };
      this.dirty = true; p.bumpT = 0.25;
      if (Trials.run && Trials.run.id === 'roundup') {
        Trials.run.pushes++; UI.trialHud(`Pushes: ${Trials.run.pushes}   Gold: ${DATA.trials.roundup.par} or fewer`);
        const herd = World.props.filter((x) => x.type === 'herd');
        if (World.ch(bx, by) === '{') Sound.sfx('confirm');
        if (herd.every((x) => World.ch(x.x, x.y) === '{')) setTimeout(() => Script.run((s) => DATA.scripts.bhRoundupDone(s)), 350);
      }
      return;
    }
    return origStep(d);
  };
}

/* ---------- Trial Post signs ---------- */
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'trialpost') {
      const p = pen(ctx); const wave = Math.floor(t * 4) % 2;
      p.r('rgba(0,0,0,0.22)', sx + 4, sy + 13, 9, 2);
      p.r('#5a3a20', sx + 7, sy - 6, 2, 20); p.r('#8a5c36', sx + 7, sy - 6, 1, 20);
      p.r('#e8742a', sx + 9, sy - 6, 6, 4); p.r('#f0a040', sx + 9, sy - 6, 6, 1); p.r('#e8742a', sx + 9 + wave, sy - 2, 4, 1);
      p.r('#c8a060', sx + 3, sy + 2, 10, 6); p.r('#5a3a20', sx + 3, sy + 2, 10, 1); p.r('#5a3a20', sx + 3, sy + 7, 10, 1);
      p.r('#e8c040', sx + 7, sy + 4, 2, 2);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}
DATA.scripts.bhTrialPost = async function (s) {
  const pr = World.propAt(Game.player.x + DIRS[Game.player.dir][0], Game.player.y + DIRS[Game.player.dir][1]);
  const id = pr && pr.trial; const tr = DATA.trials[id]; if (!tr) return;
  G.flags['trial_seen_' + id] = 1;
  await s.say([`FRONTIER TRIAL: ${tr.name.toUpperCase()}`, tr.desc, `Your best: ${Trials.medalName(Trials.best(id))}. Talk to ${tr.host} to take the trial.`], { sign: true });
};

/* ---------- Trial 1: Stockridge Round-Up ---------- */
DATA.tiles['{'] = { t: 'straw', text: 'A pen lined with fresh straw. It smells sweet.' };
DATA.tiles['}'] = { t: 'haybale', solid: true, text: 'A tightly rolled hay bale. Far too heavy to shift.' };
Object.assign(TILE_DRAW, {
  straw(p, f, v) {
    TILE_DRAW.grass(p, f, v); const R = mulberry(v * 31 + 7);
    p.r('#c8a040', 1, 1, 14, 14); p.r('#e8c860', 2, 2, 12, 12);
    for (let i = 0; i < 14; i++) p.r(R() < 0.5 ? '#f8e090' : '#b89030', 2 + Math.floor(R() * 11), 2 + Math.floor(R() * 12), 2, 1);
    p.r('#8a5c36', 0, 0, 16, 1); p.r('#8a5c36', 0, 15, 16, 1); p.r('#8a5c36', 0, 0, 1, 16); p.r('#8a5c36', 15, 0, 1, 16);
  },
  haybale(p, f, v) {
    TILE_DRAW.grass(p, f, v);
    p.r('rgba(0,0,0,0.2)', 2, 12, 13, 3); p.r('#a8862a', 1, 3, 14, 11); p.r('#e8c060', 2, 3, 12, 9); p.r('#c8a040', 2, 9, 12, 2);
    for (const x of [4, 8, 12]) p.r('#b8902e', x, 4, 1, 7);
    p.r('#8a5c36', 1, 6, 14, 1); p.r('#fff0a8', 3, 4, 4, 1);
  },
});
Object.assign(TILE_VARIANTS, { straw: 3, haybale: 1 });

DATA.maps.stock_paddock = {
  name: 'Round-Up Paddock', region: 'stockridge', music: 'route', outdoor: true, border: 'T',
  rows: [
    '############',
    '#{...}...{.#',
    '#..........#',
    '#..}..#....#',
    '#.....#..}.#',
    '#..........#',
    '#.}....{...#',
    '#####...####',
    'TTTTT..TTTTT',
  ],
  warps: [5, 6].map((x) => ({ x, y: 8, to: { map: 'stockridge', x: 15, y: 22, dir: 'down' } })),
  props: [
    { type: 'herd', sp: 'steerling', x: 3, y: 2, text: 'A runaway Steerling. Walk into it to nudge it along.' },
    { type: 'herd', sp: 'steerling', x: 8, y: 3, text: 'A runaway Steerling. Walk into it to nudge it along.' },
    { type: 'herd', sp: 'steerling', x: 5, y: 5, text: 'A runaway Steerling. Walk into it to nudge it along.' },
  ],
  npcs: [{ id: 'tess_p', x: 7, y: 7, dir: 'up', look: 'wrangler2', script: 'bhTessPaddock', name: 'Wrangler Tess' }],
};
DATA.mapEnter.stock_paddock = () => { if (!Trials.run) Trials.run = { id: 'roundup', pushes: 0 }; UI.trialHud(`Pushes: ${Trials.run.pushes}   Gold: ${DATA.trials.roundup.par} or fewer`); };
{
  const load0 = World.load.bind(World);
  World.load = function (id) { load0(id); if (id !== 'stock_paddock') { if (Trials.run && Trials.run.id === 'roundup') Trials.run = null; UI.trialHud(null); } };
}

Object.assign(DATA.scripts, {
  async bhTess(s) {
    const o = { name: 'Wrangler Tess' }; G.flags.trial_seen_roundup = 1;
    if (!s.flag('met_tess')) {
      s.set('met_tess');
      await s.say(["Howdy! I run the Stockridge Round-Up, one of the Frontier Trials.", 'Frontier Trials are challenges dotted all over Brightholm. Nobody has to do them, but folk come from miles around to try.',
        'Do well and you win a trophy: Bronze, Silver or Gold. The better the trophy, the better the prize.'], o);
    }
    const best = Trials.best('roundup');
    const c = await s.ask(`Three Steerling have broken out of the paddock again. Nudge them back into the straw pens. Fewer pushes, better trophy!${best ? ` Your best: ${MEDALS[best].name}.` : ''}`, ['Let me try!', 'Not now'], o);
    if (c !== 0) return s.say('Come back any time. They break out every day, the rascals.', o);
    await s.say(['Walk into a Steerling to nudge it one step. They will not budge if something is in the way.', 'Get stuck? Talk to me in the paddock and I will round them up so you can start again.'], o);
    Trials.run = { id: 'roundup', pushes: 0 };
    await Game.warpTo({ map: 'stock_paddock', x: 5, y: 6, dir: 'up' });
  },
  async bhTessPaddock(s) {
    const o = { name: 'Wrangler Tess' };
    const c = await s.ask('Need a hand?', ['Start again', 'Give up', 'Keep going'], o);
    if (c === 0) { Trials.run = { id: 'roundup', pushes: 0 }; await Game.warpTo({ map: 'stock_paddock', x: 5, y: 6, dir: 'up' }); return; }
    if (c === 1) { Trials.run = null; await Game.warpTo({ map: 'stockridge', x: 15, y: 22, dir: 'down' }); }
  },
  async bhRoundupDone(s) {
    const o = { name: 'Wrangler Tess' }; const n = Trials.run ? Trials.run.pushes : 99; const tr = DATA.trials.roundup;
    Trials.run = null; UI.trialHud(null);
    await s.say([`That's all three home! ${n} pushes.`, n <= tr.par ? 'Not one wasted step. I could not have done it better myself!' : n <= tr.silver ? 'Smooth work, partner.' : 'Got there in the end!'], o);
    await Trials.award(s, 'roundup', n <= tr.par ? 3 : n <= tr.silver ? 2 : 1, 'Wrangler Tess');
    await Game.warpTo({ map: 'stockridge', x: 15, y: 22, dir: 'down' });
  },
});

/* ---------- Trial 2: Quarry Gauntlet ---------- */
Object.assign(DATA.trainers, {
  crew1: { cls: 'Quarry Crew', name: 'Dot & Pip', look: 'miner', team: [['pebblin', 14], ['armlet', 14]], prize: 60, ai: 'basic', pot: 6,
    intro: 'First crew! We dig it, we haul it, we battle it!', lose: 'Rubble! Pure rubble!' },
  crew2: { cls: 'Quarry Crew', name: 'Hal & Ned', look: 'worker', team: [['drillbeak', 15], ['goatlet', 15]], prize: 64, ai: 'basic', pot: 6,
    intro: 'Second crew. No time to catch your breath!', lose: 'Well, that cracked us.' },
  crew3: { cls: 'Quarry Crew', name: 'Big Moll', look: 'miner', team: [['sloshum', 15], ['molekin', 15], ['bouldrum', 16]], prize: 80, ai: 'tactical', pot: 8,
    intro: 'Last crew, and I am the toughest stone in the quarry!', lose: 'You have got grit, I will give you that.' },
});
DATA.scripts.bhBram = async function (s) {
  const o = { name: 'Foreman Bram' }; G.flags.trial_seen_gauntlet = 1;
  if (!s.flag('met_bram')) {
    s.set('met_bram');
    await s.say(['Welcome to the Shalebrook Quarry trial yard! I am Bram, the foreman.', 'My crews work hard and battle harder. We run the Quarry Gauntlet, one of the Frontier Trials.'], o);
  }
  const best = Trials.best('gauntlet');
  const c = await s.ask(`Three crews, back to back. I heal your team before you start, then no healing until it is over. Keep everyone standing for Gold!${best ? ` Your best: ${MEDALS[best].name}.` : ''}`, ['Bring it on!', 'Not now'], o);
  if (c !== 0) return s.say('The crews will be here. They always are.', o);
  if (!G.party.some((m) => m.hp > 0)) return;
  await s.healParty();
  await s.say('Right. Crews, line up!', o);
  for (const id of ['crew1', 'crew2', 'crew3']) {
    const T = DATA.trainers[id];
    const team = T.team.map(([sp, lv]) => Mon.create(sp, lv, { lustre: false, mark: null, pot: { hp: T.pot, atk: T.pot, def: T.pot, spa: T.pot, spd: T.pot, spe: T.pot }, item: null, ti: 0 }));
    await s.say(T.intro, { name: T.name });
    const res = await s.battle({ kind: 'trainer', trainer: T, enemy: team, noWhiteout: true });
    if (res !== 'win') {
      await s.healParty();
      return s.say(['That is the Gauntlet over for today. No shame in it, my crews are tough.', 'I have patched your team up. Come back and try again!'], o);
    }
  }
  const down = G.party.filter((m) => m.hp <= 0).length;
  await s.healParty();
  await s.say([down === 0 ? 'Three crews and not one of your Wildmon went down! Incredible!' : `Three crews beaten! ${down} of your Wildmon went down along the way.`], o);
  await Trials.award(s, 'gauntlet', down === 0 ? 3 : down === 1 ? 2 : 1, 'Foreman Bram');
};
