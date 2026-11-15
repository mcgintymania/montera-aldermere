'use strict';
/* =====================================================================
   BRIGHTHOLM — Friends (friendship levels 1 to 5, gifts, friend quests,
   the Friend Book) and town quest boards
   ===================================================================== */
const FRIEND_PTS = [0, 3, 7, 12, 18];
const FRIENDS = {
  gil: { name: 'Fisher Gil', script: 'bhGil', where: 'Furrow Lane', likes: ['tomato', 'turnip'], loves: ['sweet_pie'], gift2: ['great_lantern', 3], gift5: ['rare_candy', 3],
    up: ['You keep coming back to see an old fisherman. That is kind of you.', 'You know, you are the best fishing friend I have had in years.', 'I have a fishing secret for you. Come and ask me about it.', 'Best fishing partner in Brightholm. No contest.'],
    quest: { name: 'The Golden One', type: 'show', target: 'regalfin', ask: 'There is a fish in Furrow Pond I have chased for forty years: a Goldkoi that turns into a Regalfin. Show me a Regalfin before I retire. Please.', reward: ['rare_candy', 2] } },
  tess: { name: 'Wrangler Tess', script: 'bhTess', where: 'the Stockridge paddock', likes: ['turnip', 'pumpkin'], loves: ['sweet_pie'], gift2: ['super_potion', 3], gift5: ['rare_candy', 3],
    up: ['You are good with the Steerling. They do not trust just anybody.', 'You could be a wrangler, you know. You have the knack.', 'I have a favour to ask. You are the only one I would ask.', 'Partner. That is what you are. My ranch partner.'],
    quest: { name: 'Feed the Herd', type: 'item', target: 'pumpkin', qty: 3, ask: 'Winter is coming and my herd needs feeding. Grow me three Pumpkins in autumn? They go mad for them.', reward: ['full_restore', 2] } },
  bram: { name: 'Foreman Bram', script: 'bhBram', where: 'Quarry Road', likes: ['emberroot', 'potion'], loves: ['hyper_potion'], gift2: ['revive', 2], gift5: ['rare_candy', 3],
    up: ['You again! The crews like you, you know.', 'Hard worker, you are. I can tell.', 'I need someone who can dig deep. Come and talk to me.', 'You are an honorary member of the Shalebrook crew. Hard hat and all.'],
    quest: { name: 'Deep Digger', type: 'show', target: 'bedrockbore', ask: 'Old Shale Mine Gritmole grow into Bedrockbore, and they dig better than any machine. Show me one and I will believe it.', reward: ['scroll_cragcharge', 1] } },
  hilde: { name: 'Quarry Boss Hilde', script: 'bhHilde', where: 'Shalebrook', likes: ['tomato', 'strawberry'], loves: ['hyper_potion'], gift2: ['great_lantern', 3], gift5: ['rare_candy', 3],
    up: ['You stood up to Paragon. Shalebrook will not forget it.', 'Come by any time. There is always tea on the stove.', 'I have a job for someone I trust. That means you.', 'You are family in Shalebrook now.'],
    quest: { name: 'Warm Hands', type: 'item', target: 'emberroot', qty: 3, ask: 'The night crews freeze in winter. Emberroot tea keeps them warm. Bring me three roots from your garden?', reward: ['max_potion', 3] } },
  jaz: { name: 'Skater Jaz', script: 'bhJaz', where: 'Vantage City', likes: ['strawberry', 'sunflower'], loves: ['sweet_pie'], gift2: ['super_potion', 3], gift5: ['rare_candy', 3],
    up: ['Yo! You still riding my old board? Sick.', 'You are honestly one of the best skaters I know.', 'I have got a challenge for you. A real one.', 'Best friends. Skate crew for life.'],
    quest: { name: 'Gold on Wheels', type: 'flag', target: 'trial_skate', min: 3, ask: 'Get Gold in Coach Dex\'s Skate Trial. Under fourteen seconds. I believe in you!', reward: ['full_restore', 2] } },
  dex: { name: 'Coach Dex', script: 'bhDex', where: 'Vantage City', likes: ['tomato', 'sunflower'], loves: ['hyper_potion'], gift2: ['great_lantern', 3], gift5: ['rare_candy', 3],
    up: ['Nice form today, rider.', 'You are a natural. Seriously.', 'I want to see something with real speed. Come talk to me.', 'If I ever retire, you are running this park.'],
    quest: { name: 'Fastest in the Sky', type: 'show', target: 'celestrel', ask: 'Nothing in Brightholm moves faster than a Celestrel. Show me one, and I will show you my secret line through the park.', reward: ['rare_candy', 2] } },
  rigel: { name: 'Apprentice Rigel', npc: { map: 'star_house1', id: 'appr' }, where: 'Starfall', likes: ['snowdrop', 'mintleaf'], loves: ['sweet_pie'], gift2: ['dusk_lantern', 3], gift5: ['rare_candy', 3],
    up: ['Oh, hello! Seren says I should get out more. You count, right?', 'Want to look through the telescope later? It is amazing tonight.', 'I have a favour to ask. It is about a star.', 'You are my best friend. Do not tell Seren, she will get jealous.'],
    quest: { name: 'Catch a Falling Star', type: 'show', target: 'novaflare', ask: 'A Comette grows into a Novaflare, and it lights up the whole sky. Seren has only seen one. Show me one, and I will write your name in the observatory log!', reward: ['rare_candy', 2] } },
  wren: { name: 'Ranger Wren', script: 'bhWren', where: 'Coralport Ranger Station', likes: ['frostkale', 'tomato'], loves: ['sweet_pie'], gift2: ['revive', 3], gift5: ['rare_candy', 3],
    up: ['Good to see you. Really.', 'You remind me of someone from Aldermere. The good parts.', 'The Rangers need a hand with something. Talk to me.', 'Partner. Ranger Wren and Champion {player}. Has a nice ring to it.'],
    quest: { name: 'Fog Watch', type: 'show', target: 'fogmantle', ask: 'The Rangers want to study the fog Wildmon of Saltreach. Show me a Fogmantle so we can check it is healthy.', reward: ['full_restore', 2] } },
  hale: { name: 'Mrs Hale', script: 'bhHale', where: 'Larkfield', likes: ['strawberry', 'sweetroot'], loves: ['sweet_pie'], gift2: ['super_potion', 3], gift5: ['rare_candy', 3],
    up: ['You are always welcome here, love. You know that.', 'Skye talks about you all the time. Do not tell her I told you.', 'Could you help me with something? It is a surprise for Skye.', 'You are like my own, you know. Both of you.'],
    quest: { name: 'A Pie for Skye', type: 'item', target: 'sweet_pie', qty: 1, ask: 'Skye\'s birthday is coming. Your mum\'s Sweetroot Pie is her favourite. Could you make one and bring it to me? It is a surprise!', reward: ['full_restore', 2] } },
  joss: { name: 'Farmer Joss', script: 'bhJoss', where: 'Larkfield', likes: ['turnip', 'sunflower'], loves: ['pumpkin'], gift2: ['seed_pumpkin', 4], gift5: ['rare_candy', 3],
    up: ['Now then. Good to see a young farmer about.', 'Your garden is coming on nicely. I have been watching.', 'I need a hand before the harvest fair. Come and see me.', 'Best farmer in Larkfield. After me. Just.'],
    quest: { name: 'Harvest Fair', type: 'item', target: 'sunflower', qty: 5, ask: 'The harvest fair needs sunflowers for the stalls. Five, from your own garden. Summer is the time!', reward: ['seed_pumpkin', 6] } },
};
DATA.items.friend_book = { name: 'Friend Book', pocket: 'key', use: 'friends', desc: 'A little book where you keep track of your friends. Use it to see how close you are.' };
DATA.achievements.best_friend = { name: 'Best Friends', desc: 'Reach friendship level 5 with someone.' };
const fState = (id) => { G.friends = G.friends || {}; return G.friends[id] || (G.friends[id] = { pts: 0, lv: 1, day: -1, gift: -1 }); };
const fLevel = (pts) => FRIEND_PTS.filter((p) => pts >= p).length;
const fDay = () => Math.floor((G.playtime || 0) / 1200);
const hearts = (lv) => '♥'.repeat(lv) + '♡'.repeat(5 - lv);
const reqMet = (r) => (r.type === 'item' ? (G.bag[r.target] || 0) >= (r.qty || 1) : r.type === 'show' ? G.party.some((m) => m.sp === r.target) : (G.flags[r.target] || 0) >= r.min);
const reqText = (r) => (r.type === 'item' ? `Bring ${r.qty || 1} ${DATA.items[r.target].name}.` : r.type === 'show' ? `Show a ${DATA.species[r.target].name} in your team.` : r.ask);
for (const [id, F] of Object.entries(FRIENDS)) {
  DATA.quests['fq_' + id] = { name: F.quest.name, kind: 'side', giver: F.name, stages: [F.quest.ask + ' ' + reqText(F.quest)], reward: `${DATA.items[F.quest.reward[0]] ? DATA.items[F.quest.reward[0]].name : ''}${F.quest.reward[1] > 1 ? ' x' + F.quest.reward[1] : ''}` };
}

async function friendBeat(s, id) {
  const F = FRIENDS[id]; const f = fState(id); const o = { name: F.name };
  if (!s.has('friend_book')) { G.bag.friend_book = 1; await s.say(['You jot their name in a little notebook. You can keep track of your friends in the Friend Book in your Bag.'], { sign: true }); }
  const day = fDay(); let gained = 0;
  if (f.day !== day) { f.day = day; gained += 1; }
  const giftable = [...F.loves, ...F.likes].filter((k) => s.has(k));
  if (giftable.length && f.gift !== day) {
    const c = await s.ask(`Give ${F.name} a present?`, giftable.map((k) => DATA.items[k].name).concat(['Not today']));
    if (c < giftable.length) {
      const k = giftable[c]; s.take(k); f.gift = day; const love = F.loves.includes(k); gained += love ? 5 : 3; Sound.sfx('heal');
      await s.say([love ? `${DATA.items[k].name}? For me? Oh, this is my favourite thing in the world!` : `${DATA.items[k].name}! You remembered. Thank you!`], o);
    }
  }
  const q = s.quest('fq_' + id);
  if (q && !q.done && reqMet(F.quest)) {
    await s.say([`You did it! ${F.quest.type === 'show' ? 'Look at it! Just look at it!' : 'Thank you so much!'}`], o);
    if (F.quest.type === 'item') s.take(F.quest.target, F.quest.qty || 1);
    await s.completeQuest('fq_' + id); gained += 5;
    await s.give(F.quest.reward[0], F.quest.reward[1]);
  }
  f.pts += gained; Game.dirty = true;
  const lv = fLevel(f.pts);
  while (f.lv < lv) {
    f.lv += 1; Sound.sfx('quest'); UI.toast && UI.toast('Friendship', `${F.name} ${hearts(f.lv)}`);
    await s.say([F.up[f.lv - 2]], o);
    if (f.lv === 2) { await s.say(['Here, I want you to have this.'], o); await s.give(F.gift2[0], F.gift2[1]); }
    if (f.lv === 3 && !s.quest('fq_' + id)) { await s.say([F.quest.ask], o); await s.startQuest('fq_' + id); }
    if (f.lv === 5) { await s.say(['Best friends. Here, I have been saving this for you.'], o); await s.give(F.gift5[0], F.gift5[1]); Game.achieve('best_friend'); }
  }
}
for (const [id, F] of Object.entries(FRIENDS)) {
  if (F.script) {
    const orig = DATA.scripts[F.script];
    DATA.scripts[F.script] = async function (s, n) { await friendBeat(s, id); return orig(s, n); };
  } else {
    const m = DATA.maps[F.npc.map]; const n = m && m.npcs.find((x) => x.id === F.npc.id);
    if (n) { const talk = n.talk; n.talk = null; n.script = 'bhFriend_' + id; DATA.scripts['bhFriend_' + id] = async (s) => { await friendBeat(s, id); await s.say(talk, { name: F.name }); }; }
  }
}
UI.useKey = Object.assign(UI.useKey || {}, {
  async friends() {
    const lines = Object.entries(FRIENDS).map(([id, F]) => { const f = (G.friends || {})[id]; return f ? `${F.name}  ${hearts(f.lv)}  (${F.where})` : null; }).filter(Boolean);
    await UI.dialog(lines.length ? ['YOUR FRIENDS'].concat(lines) : ['No friends written down yet. Talk to people around Brightholm!']);
  },
});

/* ---------- Quest boards ---------- */
const BOARD_REQ = {
  stockridge: [['hayfever', 'Hay Fever', 'item', 'turnip', 3, 600], ['pieday', 'Pie Day', 'item', 'sweet_pie', 1, 1500], ['steerspot', 'Steerling Spotter', 'show', 'steerling', 0, 800],
    ['cricket', 'Cricket Song', 'show', 'fieldfiddle', 0, 1000], ['remedy', 'Herbal Remedy', 'item', 'potion', 2, 800], ['sunnyside', 'Sunny Side', 'item', 'sunflower', 2, 700]],
  vantage: [['binday', 'Bin Day', 'show', 'junkbandit', 0, 1500], ['pigeonpost', 'Pigeon Post', 'show', 'cobblecoo', 0, 1200], ['tomatoes', 'Fresh Tomatoes', 'item', 'tomato', 3, 1000],
    ['snack', 'Midnight Snack', 'item', 'strawberry', 2, 800], ['pluggedin', 'Plugged In', 'show', 'megawatt', 0, 1500], ['rinkrat', 'Rink Rat', 'flag', 'trial_skate', 2, 2000]],
  coralport: [['shells', 'Shell Collector', 'show', 'fortrab', 0, 1500], ['foghorn', 'Foghorn', 'show', 'fogling', 0, 1000], ['reefpatrol', 'Reef Patrol', 'show', 'octomind', 0, 1500],
    ['cooltreat', 'Cool Treat', 'item', 'frostkale', 2, 900], ['chilly', 'Chilly Nights', 'item', 'snowdrop', 2, 600], ['bigcatch', 'Big Catch', 'show', 'regalfin', 0, 2500]],
  starfall: [['shootingstar', 'Shooting Star', 'show', 'novaflare', 0, 2500], ['nightlight', 'Night Light', 'show', 'radiwurm', 0, 2000], ['skywatcher', 'Sky Watcher', 'show', 'celestrel', 0, 2000],
    ['pumpkinlights', 'Pumpkin Lanterns', 'item', 'pumpkin', 3, 2000], ['embertea', 'Ember Tea', 'item', 'emberroot', 3, 900], ['woolly', 'Woolly Weather', 'show', 'cumulamb', 0, 2500]],
};
const BOARD_POS = { stockridge: [16, 11], vantage: [26, 12], coralport: [18, 8], starfall: [8, 9] };
const BOARD_TOWN = { stockridge: 'Stockridge', vantage: 'Vantage City', coralport: 'Coralport', starfall: 'Starfall' };
const boardReq = (r) => ({ type: r[2], target: r[3], qty: r[4] || 1, min: r[4] }) ;
for (const [town, list] of Object.entries(BOARD_REQ)) {
  for (const r of list) {
    const R = boardReq(r);
    const text = r[2] === 'flag' ? 'Get at least Silver in the Vantage Skate Trial.' : reqText(R);
    DATA.quests['bq_' + r[0]] = { name: r[1], kind: 'side', giver: `${BOARD_TOWN[town]} quest board`, stages: [`${text} Then check the ${BOARD_TOWN[town]} quest board.`], reward: `${r[5]} Cr` };
  }
  DATA.maps[town].props.push({ type: 'qboard', x: BOARD_POS[town][0], y: BOARD_POS[town][1], script: 'bhBoard', town });
}
{
  const origDP = drawProp;
  drawProp = function (ctx, pr, sx, sy, t) {
    if (pr.type === 'qboard') {
      const p = pen(ctx);
      p.r('rgba(0,0,0,0.22)', sx + 1, sy + 13, 14, 3); p.r('#5a3a20', sx + 2, sy + 4, 2, 10); p.r('#5a3a20', sx + 12, sy + 4, 2, 10);
      p.r('#6a4a2a', sx, sy - 8, 16, 13); p.r('#c89a60', sx + 1, sy - 7, 14, 11);
      p.r('#f4ecd8', sx + 2, sy - 6, 5, 4); p.r('#f8e070', sx + 8, sy - 5, 5, 4); p.r('#a8e0f0', sx + 3, sy - 1, 5, 4); p.r('#f4ecd8', sx + 9, sy, 4, 3); p.r('#c83a3a', sx + 4, sy - 6, 1, 1);
      return;
    }
    return origDP(ctx, pr, sx, sy, t);
  };
}
Object.assign(DATA.scripts, {
  async bhBoard(s, pr) {
    const town = pr.town; const list = BOARD_REQ[town];
    const label = (r) => { const q = s.quest('bq_' + r[0]); return q && q.done ? `${r[1]} (done)` : q ? `${r[1]}${reqMet(boardReq(r)) ? ' (ready!)' : ' (taken)'}` : r[1]; };
    await s.say([`THE ${BOARD_TOWN[town].toUpperCase()} QUEST BOARD`, 'Notes pinned up by people around town who need a hand.'], { sign: true });
    for (;;) {
      const c = await s.ask('Which note?', list.map(label).concat(['Done']));
      if (c >= list.length) return;
      const r = list[c]; const R = boardReq(r); const id = 'bq_' + r[0]; const q = s.quest(id);
      const text = r[2] === 'flag' ? 'Get at least Silver in the Vantage Skate Trial.' : reqText(R);
      if (q && q.done) { await s.say([`"${r[1]}": all done. The note says THANK YOU in big letters.`], { sign: true }); continue; }
      if (!q) {
        if (await s.ask(`"${r[1]}". ${text} Reward: ${r[5]} Cr. Take it?`, ['Take it', 'Leave it']) === 0) { await s.startQuest(id); await s.say(['You take the note. Bring what they need back to this board.'], { sign: true }); }
        continue;
      }
      if (!reqMet(R)) { await s.say([`"${r[1]}". ${text} Not done yet.`], { sign: true }); continue; }
      if (r[2] === 'item') s.take(R.target, R.qty);
      await s.say([r[2] === 'show' ? `You show your ${DATA.species[R.target].name} to the board. A delighted note-writer rushes over to see it!` : 'You pin your delivery to the board. Someone will be very happy.'], { sign: true });
      await s.completeQuest(id); await s.money(r[5]);
      if (Object.keys(BOARD_REQ).every((t) => BOARD_REQ[t].every((x) => (s.quest('bq_' + x[0]) || {}).done))) Game.achieve('helping_hand');
    }
  },
});
DATA.achievements.helping_hand = { name: 'Helping Hand', desc: 'Finish every note on every quest board in Brightholm.' };
