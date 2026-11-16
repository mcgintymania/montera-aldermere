'use strict';
const RELEASED = /*RELEASED*/false;
const TESTER_CODE = 'LARKFIELD';
const KEY = { tester: 'mtb_tester', unlocked: 'mtb_unlocked' };
const BADGES = ['bloom', 'tide', 'spark', 'forge', 'veil', 'gale', 'frost', 'iron'];

const $ = (s) => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const flag = (k) => { try { return localStorage.getItem(k) === '1'; } catch { return false; } };
const setFlag = (k) => { try { localStorage.setItem(k, '1'); } catch { /* storage unavailable */ } };
const fmtTime = (sec) => { sec = Math.max(0, Math.floor(sec || 0)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60); return `${h}:${String(m).padStart(2, '0')}`; };

const Aldermere = {
  slots() {
    const out = [];
    for (const n of [1, 2, 3]) {
      try {
        const d = JSON.parse(localStorage.getItem('mq_slot_' + n));
        if (d && typeof d === 'object' && typeof d.name === 'string' && d.name) out.push(d);
      } catch { /* unreadable slot */ }
    }
    return out;
  },
  badges(d) { const f = (d && d.flags) || {}; return BADGES.filter((b) => f['sigil_' + b]).length; },
  champion(d) { return !!(d && d.flags && d.flags.champion); },
  latest() { return this.slots().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0] || null; },
  parseExport(text) {
    text = String(text || '').trim(); let obj = null;
    try { obj = JSON.parse(decodeURIComponent(escape(atob(text.replace(/\s+/g, ''))))); } catch { try { obj = JSON.parse(text); } catch { return null; } }
    if (obj && obj.format === 'MQSAVE') obj = obj.data;
    return obj && typeof obj === 'object' && typeof obj.name === 'string' ? obj : null;
  },
};

const BH_BADGE_IDS = ['spur', 'bedrock', 'updraft', 'circuit', 'reef', 'wisp', 'starlight', 'homestead'];
const readSlots = (prefix) => {
  const out = [];
  for (const n of [1, 2, 3]) {
    try { const d = JSON.parse(localStorage.getItem(prefix + n)); if (d && typeof d === 'object' && typeof d.name === 'string' && d.name) out.push(d); } catch { /* unreadable slot */ }
  }
  return out;
};
const pctOf = (d) => (d && d.completion && typeof d.completion.pct === 'number' ? d.completion.pct : null);
const pctTag = (d) => { const p = pctOf(d); return p === null ? '' : `<span class="pct" title="Completion">${p >= 100 ? 100 : Math.floor(p)}% complete</span>`; };

const Brightholm = {
  slots() { return readSlots('mtb_slot_'); },
  latest() { return this.slots().sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))[0] || null; },
  badges(d) { const f = (d && d.flags) || {}; return BH_BADGE_IDS.filter((b) => f['sigil_' + b]).length; },
  tester() { return flag(KEY.tester); },
  unlocked() {
    if (flag(KEY.unlocked)) return true;
    if (Aldermere.slots().some((d) => Aldermere.champion(d))) { setFlag(KEY.unlocked); return true; }
    return false;
  },
  visible() { return RELEASED || this.tester(); },
  playable() { return this.tester() || (RELEASED && this.unlocked()); },
};

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2600);
}

function modal(build) {
  const m = $('#modal'); m.innerHTML = ''; m.classList.remove('hidden');
  const sheet = el('div', 'sheet'); m.appendChild(sheet);
  const close = () => { m.classList.add('hidden'); m.innerHTML = ''; };
  m.onclick = (e) => { if (e.target === m) close(); };
  build(sheet, close);
  const first = sheet.querySelector('input, textarea'); if (first) setTimeout(() => first.focus(), 30);
}

function badgeDots(n) { return `<span class="badges" aria-label="${n} of 8 Badges">${BADGES.map((_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`; }

function aldermereCard() {
  const c = el('button', 'card'); c.type = 'button';
  const d = Aldermere.latest();
  let save = '<div class="save"><span class="small">No save yet. Your adventure starts here.</span></div>';
  if (d) {
    const n = Aldermere.badges(d);
    save = `<div class="save"><span>${esc(d.name)}</span>${badgeDots(n)}${Aldermere.champion(d) ? '<span class="champ">★ Champion</span>' : `<span class="small">${n}/8 Badges</span>`}${pctTag(d)}<span class="small">${fmtTime(d.playtime)}</span></div>`;
  }
  c.innerHTML = `<span class="tag">Game 1</span><span class="play">${d ? 'Continue' : 'Play'}</span><h2>The Lanterns of Aldermere</h2><p>Catch Wildmon, earn eight Badges and stop the Hollow Order.</p>${save}`;
  c.onclick = () => { location.href = 'aldermere.html'; };
  return c;
}

function brightholmCard() {
  if (!Brightholm.visible()) return null;
  const playable = Brightholm.playable();
  const testing = Brightholm.tester() && !(RELEASED && Brightholm.unlocked());
  const c = el(playable ? 'button' : 'div', 'card' + (playable ? '' : ' locked'));
  if (playable) c.type = 'button';
  const tag = testing ? '<span class="tag test">Tester preview</span>' : playable ? '<span class="tag">Game 2</span>' : '<span class="tag lock">Locked</span>';
  const blurb = '<p>Five years on, a new trainer sets out from Larkfield to become an even greater Champion.</p>';
  if (playable) {
    const d = Brightholm.latest(); let save = '<div class="save"><span class="small">No save yet. Larkfield is waiting.</span></div>';
    if (d) { const n = Brightholm.badges(d); save = `<div class="save"><span>${esc(d.name)}</span>${badgeDots(n)}${d.flags && d.flags.bh_champion ? '<span class="champ">★ Champion</span>' : `<span class="small">${n}/8 Badges</span>`}${pctTag(d)}<span class="small">${fmtTime(d.playtime)}</span></div>`; }
    c.innerHTML = `${tag}<span class="play">${d ? 'Continue' : 'Play'}</span><h2>The Rising Light of Brightholm</h2>${blurb}${save}`;
    c.onclick = () => { location.href = 'brightholm.html'; };
  } else {
    c.innerHTML = `${tag}<h2>The Rising Light of Brightholm</h2>${blurb}<div class="save"><span class="small">Beat the Champion in The Lanterns of Aldermere to unlock.</span></div><div class="actions"><button class="btn" type="button" data-act="import">Unlock with a save file</button></div>`;
    c.querySelector('[data-act="import"]').onclick = importUnlock;
  }
  return c;
}

function companionCard() {
  const c = el('button', 'card'); c.type = 'button';
  c.innerHTML = '<span class="tag">Guide</span><span class="play">Open</span><h2>Companion Guide</h2><p>Every Wildmon, move, item, place and Hall, plus a team builder.</p>';
  c.onclick = () => { location.href = 'companion.html'; };
  return c;
}

function render() {
  const g = $('#games'); g.innerHTML = '';
  for (const c of [aldermereCard(), brightholmCard(), companionCard()]) if (c) g.appendChild(c);
  renderExtras();
}

function renderExtras() {
  const x = $('#extras'); x.innerHTML = '';
  if (Install.can()) {
    const b = el('button', 'btn gold', 'Install App'); b.type = 'button';
    b.onclick = async () => { if (await Install.run()) toast('Montera is installed.'); renderExtras(); };
    x.appendChild(b);
  }
}

function testerPrompt() {
  modal((s, close) => {
    s.innerHTML = '<h3>Tester code</h3><p>Enter the tester code to preview The Rising Light of Brightholm on this device.</p><input type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="24"><div class="err"></div><div class="row"><button class="btn" type="button" data-a="no">Cancel</button><button class="btn gold" type="button" data-a="ok">Unlock</button></div>';
    const inp = s.querySelector('input'), err = s.querySelector('.err');
    const go = () => {
      if (inp.value.trim().toUpperCase() !== TESTER_CODE) { err.textContent = 'That code is not right.'; inp.select(); return; }
      setFlag(KEY.tester); close(); render(); toast('Brightholm unlocked for testing on this device.');
    };
    s.querySelector('[data-a="ok"]').onclick = go;
    s.querySelector('[data-a="no"]').onclick = close;
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  });
}

function importUnlock() {
  modal((s, close) => {
    s.innerHTML = '<h3>Unlock with a save file</h3><p>Choose an exported Aldermere save, or paste its text, from a game where you beat the Champion.</p><button class="btn" type="button" data-a="file">Choose file…</button><input type="file" accept=".txt,.mqsave,.json,text/plain" class="hidden"><textarea placeholder="…or paste the save text here"></textarea><div class="err"></div><div class="row"><button class="btn" type="button" data-a="no">Cancel</button><button class="btn gold" type="button" data-a="ok">Unlock</button></div>';
    const file = s.querySelector('input[type=file]'), ta = s.querySelector('textarea'), err = s.querySelector('.err');
    const check = (text) => {
      const d = Aldermere.parseExport(text);
      if (!d) { err.textContent = 'That does not look like an Aldermere save.'; return; }
      if (!Aldermere.champion(d)) { err.textContent = `${d.name} has not beaten the Champion yet.`; return; }
      setFlag(KEY.unlocked); close(); render(); toast('The Rising Light of Brightholm is unlocked!');
    };
    s.querySelector('[data-a="file"]').onclick = () => file.click();
    file.onchange = () => { const f = file.files && file.files[0]; if (!f) return; f.text().then(check, () => { err.textContent = 'That file could not be read.'; }); };
    s.querySelector('[data-a="ok"]').onclick = () => check(ta.value);
    s.querySelector('[data-a="no"]').onclick = close;
  });
}

const Install = {
  prompt: null,
  can() { return !!this.prompt; },
  async run() { const p = this.prompt; if (!p) return false; this.prompt = null; p.prompt(); try { return (await p.userChoice).outcome === 'accepted'; } catch { return false; } },
};
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); Install.prompt = e; renderExtras(); });
addEventListener('appinstalled', () => { Install.prompt = null; renderExtras(); });

{
  let taps = [];
  const logo = $('#logo');
  logo.addEventListener('click', () => {
    const now = Date.now(); taps = taps.filter((t) => now - t < 3000); taps.push(now);
    logo.classList.remove('tap'); void logo.offsetWidth; logo.classList.add('tap');
    if (taps.length >= 5) { taps = []; if (!Brightholm.tester()) testerPrompt(); }
  });
  logo.addEventListener('contextmenu', (e) => e.preventDefault());
}

addEventListener('pageshow', render);
addEventListener('storage', render);
$('#foot').textContent = 'Montera';
render();
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
