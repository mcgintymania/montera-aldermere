'use strict';
/* =====================================================================
   BRIGHTHOLM — the Courier, the legend and a new trainer
   ===================================================================== */
HALL_THEME.lark = { roof: '#d8a030', wall: '#f2e6cc', trim: '#6a4a2a', light: '#ffe07a', banner: '#c8763a' };
BUILD_STYLE.barn = { roof: '#a83a2a', wall: '#c8743a', chimney: false };
DATA.restPoints.larkfield = { map: 'bh_home', x: 3, y: 4, dir: 'down', text: 'Mum: Sit down, love, have a rest... There. Your Wildmon look much happier now.' };

TILE_DRAW.clipping = function (p) {
  TILE_DRAW.wall(p, 0, 0);
  p.r('#8a7a62', 3, 3, 10, 11); p.r('#efe6d0', 4, 4, 8, 9);
  p.r('#2a2a3a', 5, 5, 6, 1); p.r('#6a6a7a', 5, 7, 6, 1); p.r('#6a6a7a', 5, 9, 4, 1); p.r('#6a6a7a', 5, 11, 5, 1);
  p.r('#d8a030', 9, 8, 2, 3); p.r('#c84a3a', 7, 2, 2, 2);
};
TILE_DRAW.cabinet = function (p) {
  p.r('#5a3a20', 1, 0, 14, 16); p.r('#8a5c36', 2, 1, 12, 14);
  p.r('#cfe6f0', 3, 2, 10, 12); p.r('#a8c8d8', 3, 2, 10, 1);
  for (const y of [5, 9, 13]) p.r('#8a5c36', 3, y, 10, 1);
  for (let i = 0; i < 4; i++) { p.r('#b8c4cc', 4 + i * 2, 3, 1, 2); p.r('#b8c4cc', 4 + i * 2, 7, 1, 2); }
  p.r('#ffffff', 4, 2, 1, 3);
};
TILE_DRAW.planter = function (p) {
  TILE_DRAW.wood(p, 0, 0);
  p.r('#8a4a2a', 3, 9, 10, 6); p.r('#a85a32', 3, 9, 10, 1);
  p.r('#3aa860', 4, 5, 2, 4); p.r('#4ac070', 7, 4, 2, 5); p.r('#3aa860', 10, 6, 2, 3); p.r('#f0d040', 7, 3, 2, 1);
};
TILE_DRAW.stairs = function (p) {
  p.r('#8a5c36', 0, 0, 16, 16);
  for (let y = 0; y < 16; y += 4) { p.r('#c99a62', 0, y, 16, 3); p.r('#5a3a20', 0, y + 3, 16, 1); }
  p.r('#5a3a20', 0, 0, 1, 16); p.r('#5a3a20', 15, 0, 1, 16);
};
TILE_DRAW.wheat = function (p, f, v) {
  p.r('#b8862a', 0, 0, 16, 16);
  const R = mulberry(v * 17 + 3);
  for (let x = 1; x < 16; x += 3) { const h = 9 + Math.floor(R() * 4); p.r('#e8c050', x, 16 - h, 1, h); p.r('#f8dc78', x, 16 - h, 2, 3); }
  p.r('#8a6420', 0, 15, 16, 1);
};

const BH_WARDENS = ['aurelion', 'nocthra', 'solvane', 'tidevane', 'galevane'];
const Legend = {
  saves() {
    const out = [];
    for (const n of [1, 2, 3]) {
      try {
        const d = JSON.parse(localStorage.getItem('mq_slot_' + n));
        if (d && typeof d === 'object' && typeof d.name === 'string' && d.name && d.flags && d.flags.champion) out.push(d);
      } catch { /* unreadable slot */ }
    }
    return out;
  },
  fromSave(d) {
    const all = (d.party || []).concat(d.box || []).filter((m) => m && DATA.species[m.sp]);
    const line = (sp) => DATA.species[sp] && DATA.species[sp].line;
    const startSp = d.flags.starter;
    const starter = all.find((m) => startSp && line(m.sp) === line(startSp)) || (d.party || [])[0] || null;
    const team = (d.party || []).filter((m) => m && DATA.species[m.sp]).map((m) => ({ sp: m.sp, nick: m.nick || null, lv: m.lv, moves: (m.moves || []).map((mv) => mv.id), lustre: !!m.lustre, mark: m.mark || null }));
    const caught = (sp) => d.dex && d.dex[sp] && d.dex[sp].caught;
    return {
      real: true, name: d.name, look: d.look, slot: d.slot, playtime: d.playtime || 0,
      starter: starter ? { sp: starter.sp, nick: starter.nick || null } : null,
      team, wardens: BH_WARDENS.filter(caught),
    };
  },
  fallback() {
    return {
      real: false, name: 'Ellis', look: { hair: '#2a2a3a', skin: '#e8b890', shirt: '#3a6fc8', pants: '#2c3044', shoes: '#c83a3a' },
      starter: { sp: 'firecub', nick: 'Ember' }, team: [], wardens: ['aurelion'], playtime: 0,
    };
  },
  partnerName(L) {
    if (!L.starter || !DATA.species[L.starter.sp]) return null;
    const sp = DATA.species[L.starter.sp].name;
    return L.starter.nick ? `${L.starter.nick} the ${sp}` : sp;
  },
};

Game.drawBhIntro = function (ctx) {
  const g = ctx.createRadialGradient(120, 60, 10, 120, 88, 170); g.addColorStop(0, '#26306a'); g.addColorStop(1, '#070912');
  ctx.fillStyle = g; ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  const t = this.t;
  for (let i = 0; i < 40; i++) {
    const x = (i * 53) % SCREEN_W, y = (i * 29) % 120; const a = 0.3 + 0.7 * Math.abs(Math.sin(t * 1.3 + i));
    ctx.fillStyle = `rgba(255,250,220,${a.toFixed(2)})`; ctx.fillRect(x, y, 1, 1);
  }
  if (this.introLook) { const img = charSprite(this.introLook, 'down', 0); ctx.drawImage(img, 0, 0, 16, 17, 96, 40, 48, 51); }
};

Object.assign(UI, {
  courier(opt = {}) {
    const L = (G && G.legend) || opt.legend || Legend.fallback();
    const partner = Legend.partnerName(L);
    const warden = L.wardens && L.wardens[0] && DATA.species[L.wardens[0]] ? DATA.species[L.wardens[0]].name : null;
    const e = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    return new Promise((res) => {
      const p = this.panel('courier');
      p.el.querySelector('.pclose').remove();
      const paper = h('div', 'paper');
      paper.innerHTML = `
        <div class="mast">THE ALDERMERE COURIER</div>
        <div class="dateline"><span>Special Anniversary Edition</span><span>Emberlow · Aldermere</span></div>
        <h1>FIVE YEARS OF CHAMPION ${e(L.name.toUpperCase())}</h1>
        <div class="sub">From one small village to every League in the world</div>
        <div class="photo"><canvas width="16" height="17"></canvas><div class="cap">Champion ${e(L.name)} on the night of the final.</div></div>
        <p class="lead">Five years ago today, a young trainer from Emberlow Village walked into the Lantern League and defeated Champion Kit in a final that people across Aldermere still talk about.</p>
        ${partner ? `<p>At ${e(L.name)}'s side, then as now, was ${e(partner)}, the partner chosen on the very first day of the journey.</p>` : ''}
        <p>Since that night, ${e(L.name)} has taken the Champion's title in every region across the sea, and holds every one of them still. Not a single challenger has come close.</p>
        <div class="box2"><b>THE HOLLOW ORDER: FIVE YEARS ON</b><br>The same journey ended the Hollow Order. Morrow Lumen Industries closed its doors, and its grey Lanterns were locked away for good.</div>
        ${warden ? `<div class="box2"><b>WARDEN WATCH</b><br>${e(warden)} has not been seen in the wild since ${e(L.name)} caught it. Most say it never will be again.</div>` : ''}
        <div class="small">Former Champion Kit has not been seen in public since.</div>`;
      const cv = paper.querySelector('canvas'); cv.getContext('2d').drawImage(charSprite(L.look, 'down', 0), 0, 0);
      const more = h('div', 'cmore', '▼');
      p.el.append(paper, more);
      let closing = false;
      const finish = () => {
        if (closing) return;
        if (paper.scrollTop + paper.clientHeight < paper.scrollHeight - 4) { paper.scrollBy({ top: paper.clientHeight * 0.8, behavior: 'smooth' }); Sound.sfx('select'); return; }
        closing = true; Sound.sfx('confirm');
        if (opt.reread) { p.finish(); res(); return; }
        p.el.classList.add('pull');
        setTimeout(() => { p.finish(); res(); }, 1500);
      };
      more.addEventListener('pointerdown', (ev) => { ev.preventDefault(); finish(); });
      paper.addEventListener('pointerup', () => { if (paper.scrollTop + paper.clientHeight >= paper.scrollHeight - 4) finish(); });
      p.input = (a) => { if (a === 'a') finish(); else if (a === 'b' && opt.reread) { p.finish(); res(); } else if (a === 'down') paper.scrollBy({ top: 30 }); else if (a === 'up') paper.scrollBy({ top: -30 }); };
    });
  },

  bhLookEditor(name, gender) {
    return new Promise((res) => {
      const p = this.panel('looks', `How does ${name} look?`);
      p.el.querySelector('.pclose').remove();
      const cv = makeCanvas(16, 17); cv.className = 'lprev';
      const rows = h('div', 'lrows'); p.el.append(cv, rows);
      const opts = DATA.bhLook;
      const pick = { style: gender === 'girl' ? 1 : gender === 'boy' ? 0 : 2, hair: 0, skin: 0, shirt: gender === 'girl' ? 7 : 1, hat: 0 };
      const labels = { style: 'Hair', hair: 'Colour', skin: 'Skin', shirt: 'Outfit', hat: 'Cap' };
      const keys = ['style', 'hair', 'skin', 'shirt', 'hat']; let sel = 0;
      const look = () => ({ hair: opts.hair[pick.hair], skin: opts.skin[pick.skin], shirt: opts.shirt[pick.shirt], pants: '#2c3044', shoes: pick.shirt === 0 ? '#2a2a3a' : '#c83a3a', hat: opts.hat[pick.hat] || undefined, style: opts.style[pick.style] });
      let dirI = 0; const dirs = ['down', 'left', 'up', 'right'];
      const paint = () => { const c = cv.getContext('2d'); c.clearRect(0, 0, 16, 17); c.drawImage(charSprite(look(), dirs[dirI], 0), 0, 0); };
      const iv = setInterval(() => { dirI = (dirI + 1) % 4; paint(); }, 700);
      const draw = () => {
        rows.innerHTML = '';
        keys.forEach((k, i) => {
          const r = h('div', 'lrow' + (i === sel ? ' sel' : '')); r.appendChild(h('span', 'll', labels[k]));
          const sw = h('div', 'sw');
          opts[k].forEach((c, j) => {
            const s = h('div', 'swatch' + (k === 'style' ? ' txt' : '') + (j === pick[k] ? ' on' : ''));
            if (k === 'style') s.textContent = opts.styleName[c]; else if (c) s.style.background = c; else s.textContent = '✕';
            s.addEventListener('pointerdown', (e) => { e.preventDefault(); sel = i; pick[k] = j; Sound.sfx('select'); draw(); }); sw.appendChild(s);
          });
          r.appendChild(sw); rows.appendChild(r);
        });
        const d = h('div', 'lrow done' + (sel === keys.length ? ' sel' : ''), 'Done ▶');
        d.addEventListener('pointerdown', (e) => { e.preventDefault(); finish(); }); rows.appendChild(d);
        paint();
      };
      const finish = () => { clearInterval(iv); Sound.sfx('confirm'); p.finish(); res(look()); };
      p.input = (a) => {
        if (a === 'up') { sel = (sel + keys.length) % (keys.length + 1); Sound.sfx('select'); draw(); }
        else if (a === 'down') { sel = (sel + 1) % (keys.length + 1); Sound.sfx('select'); draw(); }
        else if ((a === 'left' || a === 'right') && sel < keys.length) { const k = keys[sel]; const n = opts[k].length; pick[k] = (pick[k] + (a === 'left' ? n - 1 : 1)) % n; Sound.sfx('select'); draw(); }
        else if (a === 'a') { if (sel === keys.length) finish(); else { sel = keys.length; draw(); } }
      };
      draw();
    });
  },

  async newGame() {
    const list = Save.list(); let slot = (list.find((s) => !s.data) || {}).n;
    if (!slot) {
      const i = await this.menu([...list.map((s) => this.slotLabel(s)), 'Cancel'], { cls: 'slots', header: 'All slots are full. Overwrite which one?' });
      if (i < 0 || i === 3) return false;
      const k = await this.ask(`Overwrite slot ${i + 1}? This cannot be undone.`, ['No', 'Yes']);
      if (k !== 1) return false;
      slot = i + 1;
    }
    await Game.fadeOut(300);
    Game.mode = 'bhintro'; Game.introLook = null; Sound.play('indoor');
    await Game.fadeIn(400);
    const champs = Legend.saves();
    let legend;
    if (champs.length > 1) {
      const i = await this.ask('More than one of your Aldermere trainers became Champion. Which one is the legend in this story?', champs.map((d) => d.name).slice(0, 3));
      legend = Legend.fromSave(champs[Math.max(0, i)]);
    } else legend = champs.length ? Legend.fromSave(champs[0]) : Legend.fallback();
    await this.courier({ legend });
    await this.dialog(['Larkfield, in the Far Reach of Brightholm.', 'A clipping from the Courier hangs on a bedroom wall, read so many times its corners have gone soft.', 'Someone in that bedroom is about to wake up.']);
    const gi = await this.ask('Who is waking up? Are you a boy, a girl, or neither?', ['Boy', 'Girl', 'Neither']);
    const gender = ['boy', 'girl', 'neither'][Math.max(0, gi)];
    const pronOrder = gender === 'boy' ? ['he', 'she', 'they'] : gender === 'girl' ? ['she', 'he', 'they'] : ['they', 'he', 'she'];
    const pronLabel = { he: 'He / him', she: 'She / her', they: 'They / them' };
    const pi = await this.ask('Which words should people use for you?', pronOrder.map((k) => pronLabel[k]));
    const pron = pronOrder[Math.max(0, pi)];
    const name = await this.nameEntry({ presets: gender === 'boy' ? ['Rowan', 'Milo', 'Finch', 'Jonah', 'Arlo', 'Cole'] : gender === 'girl' ? ['Rowan', 'Maisie', 'Isla', 'Nell', 'Juno', 'Tess'] : ['Rowan', 'Sky', 'Ellis', 'Robin', 'Jules', 'Wren'] });
    const look = await this.bhLookEditor(name, gender);
    Game.introLook = look;
    let friend;
    if (gender === 'boy') friend = { gender: 'girl', pron: 'she' };
    else if (gender === 'girl') friend = { gender: 'boy', pron: 'he' };
    else { const fi = await this.ask('And your best friend Skye, who lives next door. Is Skye a boy or a girl?', ['Boy', 'Girl']); friend = fi === 0 ? { gender: 'boy', pron: 'he' } : { gender: 'girl', pron: 'she' }; }
    await this.dialog([`${name}. Best friends with Skye since before either of you could walk.`, `Both of you with that same Courier clipping on your bedroom walls. Both of you dreaming of beating ${legend.name}.`]);
    await Game.fadeOut(600);
    const st = newState(name, look, slot);
    st.gender = gender; st.pron = pron; st.friend = friend; st.legend = legend; st.flags.woke = true;
    Save.write(slot, st);
    Game.introLook = null;
    Game.enterWorld(st);
    setTimeout(() => Script.run(DATA.scripts.bhWake), 450);
    return true;
  },
});

{
  const title0 = UI.title.bind(UI);
  UI.title = async function () {
    let open = false;
    try { open = localStorage.getItem('mtb_tester') === '1' || localStorage.getItem('mtb_unlocked') === '1'; } catch { open = false; }
    if (open || !AppShell.hosted()) return title0();
    Game.mode = 'bhintro'; this.hud(false);
    await this.dialog(['The Rising Light of Brightholm is not open yet.', 'Beat the Champion in The Lanterns of Aldermere to unlock it.']);
    location.href = './';
    return new Promise(() => {});
  };
}
