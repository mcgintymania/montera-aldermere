'use strict';
/* =====================================================================
   LANTERN LEAGUE DATA — Lantern Road, Lantern Isle, the four Gatekeepers of
   the Lantern League, Champion Kit, the Roll of Lights and the credits.
   ===================================================================== */

Object.assign(DATA.tiles, {
  '/': { t: 'gatearch' },
  '|': { t: 'leaguefloor' },
  ';': { t: 'leaguewall', solid: true },
  '-': { t: 'carpet' },
});

/* ---------- Species #164–168 ---------- */
Object.assign(DATA.species, {
  emberwick: { n: 164, name: 'Emberwick', types: ['fire', 'light'], base: [46, 30, 44, 66, 56, 58], growth: 'mslow', catch: 120, exp: 66, rarity: 'uncommon', line: 'emberwick',
    evo: [{ to: 'lumenwick', lv: 42 }], moves: [[1, 'ember'], [1, 'glimmer'], [10, 'dazzle'], [18, 'flame_burst'], [26, 'radiant_pulse'], [34, 'flamethrower'], [40, 'dazzling_ray']], traits: ['kindling', 'radiance'],
    habitat: 'Lantern Road caves', desc: 'A little candle flame with a mind of its own. Lost travellers on Lantern Road follow it home. Usually.' },
  lumenwick: { n: 165, name: 'Lumenwick', types: ['fire', 'light'], base: [70, 50, 70, 116, 90, 94], growth: 'mslow', catch: 40, exp: 210, rarity: 'uncommon', line: 'emberwick',
    evo: [], moves: [[1, 'ember'], [1, 'glimmer'], [10, 'dazzle'], [18, 'flame_burst'], [26, 'radiant_pulse'], [34, 'flamethrower'], [40, 'dazzling_ray'], [42, 'solar_flare'], [50, 'dawnbreak']], traits: ['kindling', 'radiance'],
    habitat: 'Evolves from Emberwick', desc: 'A great lantern of living flame. The first Lantern-makers are said to have copied its shape.' },
  gargrim: { n: 166, name: 'Gargrim', types: ['rock', 'dark'], base: [84, 104, 110, 50, 70, 62], growth: 'slow', catch: 35, exp: 200, rarity: 'uncommon', line: 'gargrim',
    evo: [], moves: [[1, 'scratch'], [1, 'harden'], [12, 'rock_throw'], [20, 'bite'], [28, 'rock_tomb'], [36, 'crunch'], [44, 'crag_charge'], [52, 'rock_slide']], traits: ['sturdy', 'night_eyes'],
    habitat: 'Lantern Road', desc: 'It perches on cliff edges pretending to be a statue. It is very good at it, until it sneezes.' },
  ironwing: { n: 167, name: 'Ferrokite', types: ['steel', 'air'], base: [70, 88, 108, 40, 70, 74], growth: 'slow', catch: 35, exp: 196, rarity: 'uncommon', line: 'ironwing',
    evo: [], moves: [[1, 'peck'], [1, 'harden'], [12, 'metal_claw'], [20, 'wing_attack'], [28, 'iron_defense'], [36, 'air_slash'], [44, 'iron_head'], [52, 'dive_bomb']], traits: ['iron_hide', 'keen_eye'],
    habitat: 'Lantern Road', desc: 'Its feathers are sharpened steel. The League once used Ferrokite to carry messages along Lantern Road.' },
  augurine: { n: 168, name: 'Augurine', types: ['psychic', 'light'], base: [80, 50, 76, 114, 104, 86], growth: 'slow', catch: 25, exp: 220, rarity: 'rare', line: 'augurine',
    evo: [], moves: [[1, 'confusion'], [1, 'glimmer'], [12, 'psybeam'], [20, 'radiant_pulse'], [28, 'focus_mind'], [36, 'psy_cutter'], [44, 'dazzling_ray'], [52, 'psy_storm']], traits: ['radiance', 'keen_eye'],
    habitat: 'Lantern Isle (rare)', desc: 'It sees a few seconds into the future. Ask it a question and it nods before you have finished speaking.' },
});
DATA.speciesList = Object.keys(DATA.species).sort((a, b) => DATA.species[a].n - DATA.species[b].n);
Object.assign(DATA.masteryTraits, { emberwick: 'floating', gargrim: 'grit', ironwing: 'grit', augurine: 'floating' });

/* ---------- Items ---------- */
Object.assign(DATA.items, {
  revive: { name: 'Rekindle', pocket: 'items', battle: 'heal', field: true, revive: true, price: 1500, sell: 750, desc: 'Rekindles a faded Wildmon with half its HP.' },
  full_restore: { name: 'Hearth Draught', pocket: 'items', battle: 'heal', field: true, heal: 999, cure: 'all', cureText: 'cured', price: 3000, sell: 1500, desc: 'Fully restores one Wildmon\'s HP and cures any status condition.' },
  champion_crest: { name: 'Champion\'s Crest', pocket: 'key', desc: 'Proof that you are the Champion of the Lantern League. It glows warmly in your hand.' },
});
DATA.shops.lantern_isle = ['great_lantern', 'bright_lantern', 'swift_lantern', 'dusk_lantern', 'patience_lantern', 'kin_lantern', 'friend_lantern', 'heal_lantern', 'hyper_potion', 'max_potion', 'full_restore', 'revive', 'full_heal', 'calm_incense'];
DATA.shops.ironmouth = (DATA.shops.ironmouth || []).concat(['revive']);

/* ---------- Looks ---------- */
Object.assign(DATA.looks, {
  ace: { hair: '#2a2a3a', skin: '#e8c0a0', shirt: '#e8e8f0', pants: '#3a4a8a', shoes: '#1a1a1a', hat: '#c83a3a' },
  ace2: { hair: '#c86a3a', skin: '#f0c8a8', shirt: '#3a3a4a', pants: '#e8e8f0', shoes: '#1a1a1a' },
  ilsa: { hair: '#c8b8f8', skin: '#f0d0c0', shirt: '#6a4aa8', pants: '#4a3a7a', shoes: '#2a1a3a' },
  nyx: { hair: '#1a1a24', skin: '#d8b8a0', shirt: '#2a2a34', pants: '#1a1a24', shoes: '#0a0a0a', hat: '#4a2a5a' },
  brigid: { hair: '#c84a2a', skin: '#d8a080', shirt: '#e8e0d0', pants: '#2a2a2a', shoes: '#4a2a1a' },
  thane: { hair: '#8a8a8a', skin: '#b88a6a', shirt: '#6a5a3a', pants: '#4a3a2a', shoes: '#2a1a0a' },
  leagueguard: { hair: '#3a2a1a', skin: '#e0b090', shirt: '#e8c040', pants: '#2a2a4a', shoes: '#1a1a1a', hat: '#2a2a4a' },
});

/* ---------- Trainers ---------- */
const ACE = (name, look, team, intro, lose, after) => ({ cls: 'Ace Trainer', name, look, team, prize: 60, ai: 'expert', pot: 8, intro, lose, after });
Object.assign(DATA.trainers, {
  lr1: ACE('Mara', 'ace', [['crestram', 49], ['thundermane', 50], ['floemperor', 50]], 'Eight Badges? So have I. Let\'s see whose are shinier!', 'Yours are shinier.', 'Lantern Road weeds out anyone who isn\'t ready. Stay sharp.'),
  lr2: ACE('Dorian', 'ace2', [['pyrowyrm', 50], ['hullgaunt', 50], ['nimbusoft', 50]], 'I\'ve been training on this road for a month. You\'ve been here five minutes.', 'Five minutes was enough, apparently.', 'The Gatekeepers can be fought in any order. Pick the one your team handles best first.'),
  lr3: ACE('Sasha', 'ace', [['rimefox', 50], ['gloomowl', 50], ['cragrook', 51]], 'Halfway up Lantern Road! Prove you belong here!', 'You belong here.', 'Stock up on Rekindles on Lantern Isle. You can\'t go back for healing once you\'re inside.'),
  lr4: ACE('Wolfe', 'ace2', [['mammaul', 51], ['dynamaus', 51], ['abyssray', 51]], 'The cave is dark, but my battling is darker!', 'That... didn\'t make sense, did it?', 'Push the boulders. Power Gloves on.'),
  lr5: ACE('Juno', 'ace', [['paladross', 52], ['yetimaul', 52], ['cyclonix', 52]], 'Last one before the Isle. Give it everything!', 'That was everything.', 'Good luck with the Gatekeepers. You\'ll need it.'),
  lr6: ACE('Hale', 'ace2', [['slagolem', 52], ['leviathorn', 52], ['prismafrost', 52]], 'You found me! Most people walk straight past.', 'Should\'ve stayed hidden.', 'Some say an Augurine lives on Lantern Isle. I\'ve never seen one, but it always seems to see me.'),
  gk_ilsa: { cls: 'Gatekeeper', name: 'Ilsa', look: 'ilsa', team: [['psyren', 53], ['geodrake', 53], ['echolith', 53], ['hexpanther', 54], ['prismafrost', 54], ['augurine', 55, 'cure_berry']], prize: 300, ai: 'expert', items: { max_potion: 2 }, pot: 10, music: 'battle_master',
    intro: 'Ilsa', lose: 'I saw this ending. I didn\'t believe it.', after: '' },
  gk_nyx: { cls: 'Gatekeeper', name: 'Nyx', look: 'nyx', team: [['nightprowl', 54], ['gloomowl', 54], ['cryptound', 55], ['snowdrift', 55], ['abyssray', 55], ['noxstag', 56, 'bramble_berry']], prize: 300, ai: 'expert', items: { max_potion: 2 }, pot: 10, music: 'battle_master',
    intro: 'Nyx', lose: 'Hm. The dark doesn\'t frighten you at all, does it?', after: '' },
  gk_brigid: { cls: 'Gatekeeper', name: 'Brigid', look: 'brigid', team: [['gauntlord', 55], ['crestram', 55], ['briarbrawl', 56], ['yetimaul', 56], ['cogmaul', 56], ['ironclast', 57, 'cure_berry']], prize: 300, ai: 'expert', items: { max_potion: 2 }, pot: 10, music: 'battle_master',
    intro: 'Brigid', lose: 'HA! What a fight! My knuckles are still ringing!', after: '' },
  gk_thane: { cls: 'Gatekeeper', name: 'Thane', look: 'thane', team: [['cragmaw', 56], ['tunnelord', 56], ['augerhawk', 57], ['mammaul', 57], ['gargrim', 57], ['glacieryx', 58, 'cure_berry']], prize: 300, ai: 'expert', items: { max_potion: 2 }, pot: 10, music: 'battle_master',
    intro: 'Thane', lose: 'Stone wears down. Even mine. Well fought.', after: '' },
  champion_kit: { cls: 'Champion', name: 'Kit', look: 'kit', team: [], prize: 600, ai: 'expert', items: { full_restore: 2, max_potion: 2 }, pot: 11, music: 'champion',
    intro: 'Kit', lose: 'I... lost. To you. Again. ...Of course it was you.', after: '' },
});
Object.defineProperty(DATA.trainers.champion_kit, 'team', {
  get() {
    const evo = { mossling: 'bastionoak', firecub: 'infernyx', puddlepup: 'abyssmaul' };
    const pick = RIVAL_PICK[G && G.flags.starter] || 'firecub';
    const cover = { mossling: 'pyrowyrm', firecub: 'leviathorn', puddlepup: 'thundermane' }[pick];
    return [['tempestral', 59], ['roofhawk', 58, null, { lustre: true }], ['joltfox', 58], ['psyren', 59], [cover, 60], [evo[pick], 62, 'hearth_ember']];
  },
});

/* ---------- Encounters ---------- */
Object.assign(DATA.encounters, {
  lantern_road: {
    grass: {
      day: [['crestram', 18, 48, 52], ['cragrook', 16, 48, 52], ['mammaul', 12, 48, 51], ['ironwing', 12, 48, 52], ['gargrim', 10, 48, 52], ['thundermane', 10, 48, 51], ['bolthulk', 12, 48, 51], ['pyrowyrm', 4, 49, 52], ['augurine', 2, 50, 52], ['nimbusoft', 4, 48, 52]],
      night: [['gargrim', 18, 48, 52], ['gloomowl', 16, 48, 52], ['ironwing', 14, 48, 52], ['crestram', 12, 48, 52], ['snowdrift', 8, 49, 52], ['emberwick', 14, 48, 51], ['cragrook', 14, 48, 52], ['augurine', 4, 50, 52]],
    },
  },
  lantern_cave: { cave: { day: [['emberwick', 22, 48, 52], ['gargrim', 20, 48, 52], ['ironwing', 16, 48, 52], ['slagolem', 12, 48, 51], ['cragmaw', 14, 48, 52], ['hollowshell', 8, 49, 52], ['lumenwick', 4, 50, 52], ['cryptound', 4, 49, 52]] } },
  lantern_isle: {
    grass: {
      day: [['nimbusoft', 26, 50, 54], ['paladross', 14, 50, 54], ['augurine', 8, 51, 54], ['lumenwick', 16, 50, 54], ['cyclonix', 20, 50, 54], ['emberwick', 16, 50, 52]],
      night: [['gloomowl', 24, 50, 54], ['augurine', 10, 51, 54], ['lumenwick', 20, 50, 54], ['auroraith', 8, 51, 54], ['emberwick', 22, 50, 52], ['spirewing', 16, 50, 54]],
    },
  },
});
for (const t of Object.values(DATA.encounters)) for (const k of Object.keys(t)) if (!t[k].night) t[k].night = t[k].day;

/* ---------- Music ---------- */
Object.assign(DATA.music, {
  road: { bpm: 126, lead: 'square', tr: 0, chords: ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'D'],
    melody: 'G4:2 B4:2 D5:4 D5:2 E5:2 G5:4 F#5:2 E5:2 D5:4 B4:2 D5:2 E5:4 G5:2 E5:2 D5:4 B4:2 C5:2 E5:4 D5:2 C5:2 A4:4 D5:8' },
  league: { bpm: 92, lead: 'triangle', tr: 0, chords: ['C', 'F', 'G', 'C', 'Am', 'F', 'G', 'G'],
    melody: 'C5:4 E5:4 G5:8 A5:4 G5:4 F5:8 E5:4 D5:4 E5:4 G5:4 C6:8 G5:8' },
  champion: { bpm: 168, lead: 'sawtooth', tr: 0, chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'E', 'E'],
    melody: 'A4:2 C5:2 E5:2 A5:2 G5:2 E5:2 C5:4 F5:2 A5:2 C6:2 A5:2 G5:4 E5:4 A5:2 B5:2 C6:2 E6:2 D6:2 C6:2 B5:4 G#5:2 E5:2 B5:2 G#5:2 E5:8' },
  fanfare: { bpm: 100, lead: 'triangle', tr: 0, chords: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'C'],
    melody: 'G4:2 C5:2 E5:2 G5:2 C6:8 B5:2 A5:2 G5:4 E5:4 F5:2 G5:2 A5:4 G5:4 E5:4 D5:4 C5:2 E5:2 G5:4 C6:8' },
});

/* ---------- Quests ---------- */
DATA.quests.league = {
  name: 'The Lantern League', kind: 'main', giver: 'Vance',
  stages: [
    'Show your Lantern Road Pass at the gate north of Ironmouth, then make your way along Lantern Road.',
    'Reach Lantern Isle at the end of Lantern Road.',
    'Defeat the four Gatekeepers of the Lantern League, in any order, without leaving the Sanctum.',
    'All four gates are open. Face the Champion.',
  ],
  reward: 'The title of Champion',
};

/* ---------- Region ---------- */
DATA.region.splice(DATA.region.findIndex((r) => r.id === 'lantern_isle'), 0, { id: 'lantern_road', name: 'Lantern Road', x: 150, y: 50, desc: 'A long, hard road of cliffs and caves between Ironmouth and Lantern Isle. Only trainers with eight Badges may walk it.' });
Object.assign(DATA.region.find((r) => r.id === 'lantern_isle') || {}, { desc: 'A small island crowned by the great hall of the Lantern League.' });
DATA.regionRoutes = DATA.regionRoutes.filter(([a, b]) => !(a === 'ironmouth' && b === 'lantern_isle') && !(a === 'lantern_isle' && b === 'ironmouth')).concat([['ironmouth', 'lantern_road'], ['lantern_road', 'lantern_isle']]);
