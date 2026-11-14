'use strict';
/* =====================================================================
   POST-GAME DATA — the post-game: the Starfall Isles, the last
   five Wildmon, legendary hunts, the Battle Spire and the Lantern Masters.
   ===================================================================== */

/* ---------- Moves ---------- */
Object.assign(DATA.moves, {
  star_shower: { name: 'Star Shower', type: 'light', cat: 'spec', pow: 90, acc: 100, pp: 10, desc: 'Rains down a shower of falling stars.' },
  meteor_strike: { name: 'Meteor Strike', type: 'rock', cat: 'phys', pow: 100, acc: 85, pp: 5, desc: 'Crashes into the foe like a falling star.' },
  nebula_veil: { name: 'Nebula Veil', type: 'psychic', cat: 'status', acc: null, pp: 10, eff: 'self', st: { spa: 1, spd: 1 }, desc: 'Wraps itself in starlit mist. Raises Spirit and Resolve.' },
});

/* ---------- Species #169–173 ---------- */
Object.assign(DATA.species, {
  twinkit: { n: 169, name: 'Twinkit', types: ['light', 'psychic'], base: [56, 44, 50, 70, 64, 76], growth: 'slow', catch: 90, exp: 72, rarity: 'uncommon', line: 'twinkit',
    evo: [{ to: 'constellynx', lv: 40 }], moves: [[1, 'glimmer'], [1, 'confusion'], [10, 'dazzle'], [18, 'psybeam'], [26, 'radiant_pulse'], [34, 'nebula_veil'], [38, 'star_shower']], traits: ['radiance', 'keen_eye'],
    habitat: 'Starfall Isles', desc: 'A small cat with stars in its fur. It is only ever seen at night, chasing shooting stars across the beach.' },
  constellynx: { n: 170, name: 'Constellynx', types: ['light', 'psychic'], base: [84, 70, 78, 118, 96, 114], growth: 'slow', catch: 30, exp: 230, rarity: 'uncommon', line: 'twinkit',
    evo: [], moves: [[1, 'glimmer'], [1, 'confusion'], [10, 'dazzle'], [18, 'psybeam'], [26, 'radiant_pulse'], [34, 'nebula_veil'], [38, 'star_shower'], [40, 'psy_storm'], [50, 'dawnbreak']], traits: ['radiance', 'night_eyes'],
    habitat: 'Evolves from Twinkit', desc: 'The stars in its coat move into the shapes of the constellations overhead. Navigators once steered by them.' },
  meteorb: { n: 171, name: 'Meteorb', types: ['rock', 'light'], base: [60, 70, 80, 50, 60, 40], growth: 'slow', catch: 120, exp: 70, rarity: 'common', line: 'meteorb',
    evo: [{ to: 'astrolith', lv: 45 }], moves: [[1, 'tackle'], [1, 'harden'], [10, 'rock_throw'], [18, 'glimmer'], [26, 'rock_tomb'], [34, 'radiant_pulse'], [42, 'rock_slide']], traits: ['sturdy', 'radiance'],
    habitat: 'Starfall Isles', desc: 'A chunk of a fallen star that rolled out of its crater and kept going. It is still faintly warm.' },
  astrolith: { n: 172, name: 'Astrolith', types: ['rock', 'light'], base: [96, 118, 120, 70, 80, 56], growth: 'slow', catch: 30, exp: 230, rarity: 'common', line: 'meteorb',
    evo: [], moves: [[1, 'tackle'], [1, 'harden'], [10, 'rock_throw'], [18, 'glimmer'], [26, 'rock_tomb'], [34, 'radiant_pulse'], [42, 'rock_slide'], [45, 'meteor_strike'], [55, 'first_light']], traits: ['sturdy', 'iron_hide'],
    habitat: 'Evolves from Meteorb', desc: 'A towering star-stone with a molten heart. The craters of the Starfall Isles are said to be its footprints.' },
  nebulune: { n: 173, name: 'Nebulune', types: ['psychic', 'ghost'], base: [80, 50, 70, 120, 110, 100], growth: 'slow', catch: 20, exp: 230, rarity: 'rare', line: 'nebulune',
    evo: [], moves: [[1, 'confusion'], [1, 'lick'], [14, 'hex_wave'], [24, 'psybeam'], [34, 'nebula_veil'], [44, 'shade_orb'], [54, 'psy_storm'], [62, 'star_shower']], traits: ['floating', 'night_eyes'],
    habitat: 'Starfall Isles (night, rare)', desc: 'A drifting cloud of violet starlight. Look into it and you see a sky that isn\'t this one.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { twinkit: 'floating', meteorb: 'grit', nebulune: 'radiance' });

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  starfall_pass: { name: 'Starfall Pass', pocket: 'key', desc: 'A ferry pass from Professor Thorne. The Port Calder ferry will take you to the Starfall Isles.' },
  vault_key: { name: 'Vault Key', pocket: 'key', desc: 'A black key stamped with the mark of the Hollow Order. Morrow sent it with a note: "Finish what I started. Free it."' },
  master_crest: { name: 'Lantern Master Crest', pocket: 'key', desc: 'Awarded for defeating the Lantern Masters and the former Champion Solenne.' },
  scroll_starshower: { name: 'Scroll: Star Shower', pocket: 'items', scroll: 'star_shower', sell: 2500, desc: 'A Move Scroll. Teaches Star Shower to a Wildmon that can use Light moves.' },
});
Object.assign(DATA.scrolls, { scroll_starshower: 'star_shower' });

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  solenne: { hair: '#f8f0e0', skin: '#e8c0a0', shirt: '#e8c040', pants: '#f8f8f8', shoes: '#c8a040' },
  attendant: { hair: '#2a2a3a', skin: '#e0b090', shirt: '#4a3a8a', pants: '#2a2a3a', shoes: '#1a1a1a', hat: '#e8c040' },
});

/* ---------- The Lantern Masters (post-game rematch teams) ---------- */
{
  const up = (team, add, extra) => team.map(([sp, lv, item, ex]) => [sp, lv + add, item, ex]).concat(extra || []);
  const T = DATA.trainers;
  T.gk_ilsa_m = Object.assign({}, T.gk_ilsa, { cls: 'Lantern Master', team: up(T.gk_ilsa.team, 18), pot: 13, items: { full_restore: 2 }, lose: 'Even the future bows to you.' });
  T.gk_nyx_m = Object.assign({}, T.gk_nyx, { cls: 'Lantern Master', team: up(T.gk_nyx.team, 18), pot: 13, items: { full_restore: 2 }, lose: 'Fine. You win. Again.' });
  T.gk_brigid_m = Object.assign({}, T.gk_brigid, { cls: 'Lantern Master', team: up(T.gk_brigid.team, 18), pot: 13, items: { full_restore: 2 }, lose: 'HA! Still got it, Champion!' });
  T.gk_thane_m = Object.assign({}, T.gk_thane, { cls: 'Lantern Master', team: up(T.gk_thane.team, 18), pot: 13, items: { full_restore: 2 }, lose: 'The mountain moves again.' });
  T.kit_m = { cls: 'Rival', name: 'Kit', look: 'kit', team: [], prize: 800, ai: 'expert', items: { full_restore: 3 }, pot: 14, music: 'champion', intro: 'Kit', lose: 'Still you. Always you. Good.', after: '' };
  Object.defineProperty(T.kit_m, 'team', { get() { return T.champion_kit.team.map(([sp, lv, item, ex]) => [sp, lv + 14, item, ex]); } });
  T.solenne = { cls: 'Former Champion', name: 'Solenne', look: 'solenne', team: [['paladross', 74], ['leviathorn', 74], ['pyrowyrm', 74], ['glacieryx', 74], ['prismstar', 75], ['constellynx', 76, 'lucky_ribbon']], prize: 1000, ai: 'expert', items: { full_restore: 2 }, pot: 9, music: 'champion',
    intro: 'Solenne', lose: 'Wonderful. Simply wonderful. The League is in good hands.', after: '' };
}

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  starfall: {
    grass: {
      day: [['meteorb', 24, 58, 64], ['constellynx', 6, 60, 64], ['nimbusoft', 16, 58, 64], ['paladross', 12, 58, 64], ['lumenwick', 14, 58, 64], ['pyrowyrm', 10, 58, 64], ['astrolith', 8, 60, 64], ['augurine', 10, 60, 64]],
      night: [['twinkit', 26, 58, 62], ['nebulune', 8, 60, 64], ['meteorb', 18, 58, 64], ['gloomowl', 14, 58, 64], ['auroraith', 12, 60, 64], ['spirewing', 12, 60, 64], ['constellynx', 10, 60, 64]],
    },
    fish: { day: [['lumenkoi', 10, 58, 64], ['leviathorn', 20, 58, 64], ['abyssray', 30, 58, 64], ['floemperor', 40, 58, 64]] },
  },
  starfall_peak: {
    grass: {
      day: [['astrolith', 24, 60, 66], ['meteorb', 20, 60, 64], ['augurine', 14, 60, 66], ['cyclonix', 18, 60, 66], ['constellynx', 12, 62, 66], ['snowpip', 12, 60, 64]],
      night: [['nebulune', 16, 62, 66], ['twinkit', 24, 60, 64], ['constellynx', 18, 62, 66], ['spirewing', 16, 60, 66], ['astrolith', 14, 60, 66], ['auroraith', 12, 62, 66]],
    },
  },
  deepreach: {
    cave: { day: [['hullgaunt', 40, 60, 66], ['hollowshell', 34, 60, 66], ['nebulune', 26, 62, 66]] },
    surf: { day: [['leviathorn', 34, 60, 66], ['abyssray', 34, 60, 66], ['lumenkoi', 16, 60, 66], ['hullgaunt', 16, 60, 66]] },
    fish: { day: [['abyssray', 40, 60, 66], ['leviathorn', 30, 60, 66], ['lumenkoi', 30, 60, 66]] },
  },
});
for (const t of Object.values(DATA.encounters)) for (const k of Object.keys(t)) if (!t[k].night) t[k].night = t[k].day;

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  starfall: { bpm: 84, lead: 'triangle', tr: 0, chords: ['D', 'Bm', 'G', 'A', 'D', 'Bm', 'Em', 'A'],
    melody: 'A4:2 D5:2 F#5:4 A5:4 B5:2 A5:2 F#5:4 D5:4 E5:2 F#5:2 G5:4 B5:4 A5:8 F#5:2 A5:2 D6:4 C#6:4 B5:2 A5:2 D5:4' },
  battlespire: { bpm: 150, lead: 'square', tr: 0, chords: ['Em', 'C', 'D', 'B', 'Em', 'C', 'Am', 'B'],
    melody: 'E5:2 G5:2 B5:2 E6:2 D6:2 B5:2 G5:4 C6:2 B5:2 A5:2 G5:2 F#5:4 D5:4 E5:2 G5:2 B5:2 E6:2 F#6:2 E6:2 D6:4 C6:2 B5:2 A5:2 G5:2 D#5:8' },
  legend: { bpm: 152, lead: 'sawtooth', tr: 0, chords: ['Dm', 'Dm', 'Bb', 'C', 'Dm', 'Dm', 'Gm', 'A'],
    melody: 'D5:2 F5:2 A5:2 D6:2 C6:2 A5:2 F5:4 Bb5:2 A5:2 G5:2 F5:2 E5:4 C5:4 D5:2 F5:2 A5:2 D6:2 E6:2 F6:2 E6:4 D6:2 C6:2 Bb5:2 A5:2 C#6:8' },
});

/* ---------- Quests ---------- */
DATA.quests.starfall = {
  name: 'The Starfall Isles', kind: 'main', giver: 'Professor Thorne',
  stages: [
    'Professor Thorne has news for the new Champion. Visit the lab in Emberlow.',
    'Take the ferry from Port Calder to the Starfall Isles.',
    'Explore the Starfall Isles. Something golden has been seen on the summit.',
  ],
  reward: 'Scroll: Star Shower',
};
DATA.quests.wardens = {
  name: 'The Five Wardens', kind: 'side', giver: 'Professor Thorne',
  stages: ['Find and catch the five Wardens: Solvane at Emberforge, Tidevane in Deepreach, Galevane in a Gullwind storm, Nocthra atop the Drowned Spire and Aurelion on Starfall Peak.'],
  reward: 'Sovereign Lantern',
};
DATA.quests.masters = {
  name: 'The Lantern Masters', kind: 'side', giver: 'League Guard',
  stages: ['The Gatekeepers have become the Lantern Masters. Beat all four, then Kit, then whoever waits behind him.'],
  reward: 'Lantern Master Crest',
};

/* ---------- Region ---------- */
DATA.region.push(
  { id: 'starfall', name: 'Starfall Isles', x: 7, y: 134, desc: 'Remote islands far out to sea, scattered with star-craters. Home to rare Wildmon and older legends.' },
  { id: 'starfall_peak', name: 'Starfall Peak', x: 7, y: 124, desc: 'The highest point of the Starfall Isles, where the sun is said to rise twice.' },
);
DATA.regionRoutes = DATA.regionRoutes.concat([['port_calder', 'starfall'], ['starfall', 'starfall_peak']]);

/* ---------- Balance: marsh encounters in Saltmere, Rekindles in later shops ---------- */
if (DATA.encounters.saltmere && !DATA.encounters.saltmere.grass && DATA.encounters.route7 && DATA.encounters.route7.grass) {
  const g = DATA.encounters.route7.grass;
  const down = (list) => list.map(([sp, w, a, b]) => [sp, w, Math.max(2, a - 1), Math.max(2, b - 1)]);
  DATA.encounters.saltmere.grass = { day: down(g.day), night: down(g.night || g.day) };
}
for (const id of ['glasswater', 'saltmere', 'ashgrave', 'skyreach', 'frosthaven']) if (DATA.shops[id] && !DATA.shops[id].includes('revive')) DATA.shops[id].push('revive');
