'use strict';
/* =====================================================================
   BATTLE DATA — Traits, extra moves, held items, trainer tactics
   ===================================================================== */

DATA.traits = {
  overgrowth: { name: 'Wild Bloom', desc: 'Grass moves hit 50% harder when HP is below a third.' },
  blaze: { name: 'Flare Up', desc: 'Fire moves hit 50% harder when HP is below a third.' },
  torrent: { name: 'Undertow', desc: 'Water moves hit 50% harder when HP is below a third.' },
  shell_armor: { name: 'Hard Shell', desc: 'A hard shell. Cannot be hit by clean strikes.' },
  glare: { name: 'Glare', desc: "Lowers the foe's Attack when it enters battle." },
  night_eyes: { name: 'Night Eyes', desc: 'Dark moves hit 20% harder at night.' },
  grit: { name: 'Grit', desc: 'Attack rises by 50% while it has a status condition. Burns do not weaken it.' },
  run_away: { name: 'Skittish', desc: 'Always escapes from wild Wildmon.' },
  pickup: { name: 'Forager', desc: 'Sometimes picks up an item after battle if it is not holding one.' },
  keen_eye: { name: 'Sharp Sight', desc: 'Its accuracy cannot be lowered.' },
  shed_skin: { name: 'Molt', desc: 'May shed a status condition at the end of each turn.' },
  radiance: { name: 'Radiance', desc: 'Light moves hit 20% harder.' },
  static: { name: 'Charged Coat', desc: 'Contact with it may paralyse the attacker.' },
  sturdy: { name: 'Steadfast', desc: 'Survives a knockout blow with 1 HP when at full health.' },
  iron_hide: { name: 'Iron Hide', desc: 'Foes cannot lower its stats.' },
  toxic_touch: { name: 'Toxic Touch', desc: 'Contact with it may poison the attacker.' },
  riptide_dash: { name: 'Riptide Dash', desc: 'Speed doubles in the rain.' },
  floating: { name: 'Floating', desc: 'Drifts above the ground. Immune to Earth moves.' },
  sunsoak: { name: 'Sunsoak', desc: 'Speed doubles in harsh sunlight.' },
  kindling_heart: { name: 'Kindling Heart', desc: 'Absorbs Fire moves, which then power up its own Fire moves.' },
  thick_fur: { name: 'Thick Fur', desc: 'Takes half damage from Fire and Ice moves.' },
};
(() => {
  const T = {
    mossling: ['overgrowth', 'shell_armor'], thornback: ['overgrowth', 'shell_armor'], bastionoak: ['overgrowth', 'sturdy'],
    firecub: ['blaze', 'glare'], cinderclaw: ['blaze', 'glare'], infernyx: ['blaze', 'night_eyes'],
    puddlepup: ['torrent', 'grit'], brinehound: ['torrent', 'grit'], abyssmaul: ['torrent', 'grit'],
    burrowbit: ['run_away', 'pickup'], warrenbuck: ['glare', 'thick_fur'],
    twigwing: ['keen_eye', 'grit'], gustfinch: ['keen_eye', 'grit'], tempestral: ['keen_eye', 'glare'],
    grubble: ['shed_skin', 'run_away'], silkcase: ['shed_skin'], lumoth: ['radiance', 'shed_skin'],
    zappik: ['static', 'keen_eye'], joltfox: ['static', 'keen_eye'],
    pebblin: ['sturdy', 'iron_hide'], bouldrum: ['sturdy', 'iron_hide'], cragmaw: ['sturdy', 'iron_hide'],
    murkle: ['toxic_touch', 'riptide_dash'], bogmire: ['toxic_touch', 'riptide_dash'],
    wispet: ['floating'], lanternwisp: ['floating', 'radiance'], gloamshade: ['floating', 'radiance'],
    fawnlight: ['sunsoak', 'radiance'], solstag: ['sunsoak', 'kindling_heart'], noxstag: ['night_eyes', 'glare'],
    shellsnip: ['shell_armor', 'sturdy'], reefclamp: ['shell_armor', 'iron_hide'],
    molekin: ['grit', 'keen_eye'], tunnelord: ['iron_hide', 'grit'],
    shadepaw: ['night_eyes', 'glare'], nightprowl: ['night_eyes', 'glare'],
    flopfin: ['riptide_dash', 'run_away'], gyrefin: ['riptide_dash', 'glare'],
    lumifin: ['radiance', 'riptide_dash'], kindlit: ['kindling_heart', 'radiance'],
  };
  for (const [k, v] of Object.entries(T)) DATA.species[k].traits = v;
})();

Object.assign(DATA.moves, {
  mend: { name: 'Mend', type: 'normal', cat: 'status', acc: null, pp: 10, eff: 'heal', desc: 'Restores half of its max HP.' },
  guard: { name: 'Guard', type: 'normal', cat: 'status', acc: null, pp: 10, pri: 4, eff: 'guard', desc: 'Blocks every move this turn. Fails if used twice in a row.' },
  reckless_charge: { name: 'Reckless Charge', type: 'normal', cat: 'phys', pow: 100, acc: 100, pp: 15, recoil: 3, desc: 'A reckless charge. The user takes a third of the damage as recoil.' },
  war_cry: { name: 'War Cry', type: 'normal', cat: 'status', acc: null, pp: 20, eff: 'self', st: { atk: 2 }, desc: 'A rousing roar. Sharply raises Attack.' },
  swift_step: { name: 'Swift Step', type: 'air', cat: 'status', acc: null, pp: 20, eff: 'self', st: { spe: 2 }, desc: 'Light on its feet. Sharply raises Speed.' },
  focus_mind: { name: 'Focus Mind', type: 'psychic', cat: 'status', acc: null, pp: 20, eff: 'self', st: { spa: 1, spd: 1 }, desc: 'Clears its mind. Raises Spirit and Resolve.' },
  seed_leech: { name: 'Siphon Seed', type: 'grass', cat: 'status', acc: 90, pp: 10, eff: 'seed', desc: 'Plants a seed that drains the foe each turn. Grass types are immune.' },
  rain_dance: { name: 'Raincall', type: 'water', cat: 'status', acc: null, pp: 5, eff: 'weather', w: 'rain', desc: 'Summons rain for five turns. Water moves strengthen; Fire moves weaken.' },
  sunny_day: { name: 'Suncall', type: 'fire', cat: 'status', acc: null, pp: 5, eff: 'weather', w: 'sun', desc: 'Summons harsh sun for five turns. Fire moves strengthen; Water moves weaken.' },
  sandstorm: { name: 'Dustcall', type: 'rock', cat: 'status', acc: null, pp: 10, eff: 'weather', w: 'sand', desc: 'A five-turn sandstorm that hurts all but Rock, Earth and Steel types.' },
  hailstorm: { name: 'Sleetcall', type: 'ice', cat: 'status', acc: null, pp: 10, eff: 'weather', w: 'hail', desc: 'A five-turn hailstorm that hurts all but Ice types.' },
  thunderbolt: { name: 'Storm Lance', type: 'electric', cat: 'spec', pow: 90, acc: 100, pp: 15, eff: 'par', ch: 10, desc: 'A strong bolt of lightning. May paralyse.' },
  flamethrower: { name: 'Cinder Gout', type: 'fire', cat: 'spec', pow: 90, acc: 100, pp: 15, eff: 'brn', ch: 10, desc: 'A stream of fire. May burn.' },
  hydro_pulse: { name: 'Hydro Pulse', type: 'water', cat: 'spec', pow: 90, acc: 100, pp: 15, desc: 'A pulsing blast of water.' },
  solar_leaf: { name: 'Solar Leaf', type: 'grass', cat: 'spec', pow: 90, acc: 100, pp: 15, desc: 'Leaves charged with sunlight.' },
  frost_beam: { name: 'Frost Beam', type: 'ice', cat: 'spec', pow: 90, acc: 100, pp: 10, eff: 'frz', ch: 10, desc: 'A freezing beam. May freeze.' },
  tremor: { name: 'Tremor', type: 'earth', cat: 'phys', pow: 100, acc: 100, pp: 10, desc: 'Shakes the ground violently.' },
  rock_slide: { name: 'Rockfall', type: 'rock', cat: 'phys', pow: 75, acc: 90, pp: 10, eff: 'flinch', ch: 30, desc: 'A rockfall. May make the foe flinch.' },
  focus_strike: { name: 'Focus Strike', type: 'fighting', cat: 'phys', pow: 75, acc: 100, pp: 15, desc: 'A focused, crushing blow.' },
  psybeam: { name: 'Mind Beam', type: 'psychic', cat: 'spec', pow: 65, acc: 100, pp: 20, eff: 'conf', ch: 10, desc: 'A strange beam. May confuse.' },
  shade_orb: { name: 'Shade Orb', type: 'ghost', cat: 'spec', pow: 80, acc: 100, pp: 15, eff: 'foe', st: { spd: -1 }, ch: 20, desc: 'An orb of shadow. May lower Resolve.' },
  crunch: { name: 'Grind Bite', type: 'dark', cat: 'phys', pow: 80, acc: 100, pp: 15, eff: 'foe', st: { def: -1 }, ch: 20, desc: 'Crunches with sharp fangs. May lower Defence.' },
  iron_head: { name: 'Steel Brow', type: 'steel', cat: 'phys', pow: 80, acc: 100, pp: 15, eff: 'flinch', ch: 30, desc: 'A steel-hard headbutt. May make the foe flinch.' },
  dazzling_ray: { name: 'Dazzling Ray', type: 'light', cat: 'spec', pow: 90, acc: 100, pp: 10, eff: 'foe', st: { acc: -1 }, ch: 20, desc: 'A blinding ray. May lower accuracy.' },
  air_slash: { name: 'Wind Blade', type: 'air', cat: 'spec', pow: 75, acc: 95, pp: 15, eff: 'flinch', ch: 30, desc: 'A blade of air. May make the foe flinch.' },
  sludge: { name: 'Muck Toss', type: 'poison', cat: 'spec', pow: 65, acc: 100, pp: 20, eff: 'psn', ch: 30, desc: 'Hurls toxic sludge. May poison.' },
});
(() => {
  const ADD = {
    mossling: [[15, 'seed_leech']], thornback: [[15, 'seed_leech'], [40, 'solar_leaf']], bastionoak: [[1, 'mend'], [40, 'solar_leaf'], [48, 'tremor']],
    firecub: [[15, 'sunny_day']], cinderclaw: [[15, 'sunny_day'], [30, 'crunch'], [38, 'flamethrower']], infernyx: [[40, 'flamethrower'], [46, 'crunch'], [52, 'war_cry']],
    puddlepup: [[15, 'rain_dance']], brinehound: [[15, 'rain_dance'], [34, 'hydro_pulse']], abyssmaul: [[40, 'focus_strike'], [46, 'hydro_pulse'], [52, 'war_cry']],
    burrowbit: [[16, 'guard']], warrenbuck: [[26, 'swift_step'], [36, 'reckless_charge']],
    twigwing: [[12, 'guard']], gustfinch: [[26, 'air_slash'], [32, 'swift_step']], tempestral: [[40, 'air_slash'], [46, 'reckless_charge']],
    lumoth: [[24, 'psybeam'], [30, 'dazzling_ray'], [36, 'focus_mind']],
    zappik: [[13, 'guard']], joltfox: [[30, 'thunderbolt'], [36, 'swift_step']],
    pebblin: [[20, 'sandstorm']], bouldrum: [[30, 'rock_slide'], [36, 'tremor']], cragmaw: [[40, 'rock_slide'], [46, 'tremor']],
    murkle: [[14, 'guard'], [28, 'sludge']], bogmire: [[34, 'sludge'], [40, 'rain_dance']],
    wispet: [[24, 'shade_orb']], lanternwisp: [[32, 'shade_orb'], [38, 'mend']], gloamshade: [[36, 'shade_orb'], [42, 'dazzling_ray']],
    fawnlight: [[20, 'mend']], solstag: [[32, 'sunny_day'], [40, 'dazzling_ray'], [46, 'flamethrower']], noxstag: [[32, 'crunch'], [40, 'mend']],
    shellsnip: [[26, 'rock_slide']], reefclamp: [[38, 'rock_slide'], [44, 'crunch']],
    molekin: [[26, 'sandstorm']], tunnelord: [[38, 'tremor'], [42, 'iron_head']],
    shadepaw: [[26, 'crunch']], nightprowl: [[36, 'crunch'], [42, 'swift_step']],
    gyrefin: [[36, 'air_slash'], [40, 'rain_dance']], lumifin: [[28, 'rain_dance'], [34, 'hydro_pulse'], [40, 'dazzling_ray']],
    kindlit: [[30, 'sunny_day'], [34, 'flamethrower'], [40, 'mend']],
  };
  for (const [k, v] of Object.entries(ADD)) { const s = DATA.species[k]; s.moves = s.moves.concat(v).sort((a, b) => a[0] - b[0]); }
})();

Object.assign(DATA.items, {
  bramble_berry: { name: 'Bramble Berry', pocket: 'items', hold: 'berry', heal: 10, field: true, battle: 'heal', price: 100, sell: 50, desc: 'Restores 10 HP. A Wildmon holding one eats it when its HP falls to half.' },
  cure_berry: { name: 'Mendberry', pocket: 'items', hold: 'cureberry', cure: 'all', cureText: 'cured', field: true, battle: 'cure', price: 150, sell: 75, desc: 'Cures any status. A Wildmon holding one eats it as soon as it gets a status.' },
  ember_charm: { name: 'Ember Charm', pocket: 'items', hold: 'boost', boost: 'fire', sell: 400, desc: 'A held charm that powers up Fire moves by 20%.' },
  tide_charm: { name: 'Tide Charm', pocket: 'items', hold: 'boost', boost: 'water', sell: 400, desc: 'A held charm that powers up Water moves by 20%.' },
  leaf_charm: { name: 'Leaf Charm', pocket: 'items', hold: 'boost', boost: 'grass', sell: 400, desc: 'A held charm that powers up Grass moves by 20%.' },
  spark_charm: { name: 'Spark Charm', pocket: 'items', hold: 'boost', boost: 'electric', sell: 400, desc: 'A held charm that powers up Electric moves by 20%.' },
  swift_feather: { name: 'Swift Feather', pocket: 'items', hold: 'quick', sell: 400, desc: 'Held: sometimes lets the holder move first.' },
  lucky_coin: { name: 'Lucky Coin', pocket: 'items', hold: 'coin', sell: 500, desc: 'Held: doubles prize money from trainer battles if the holder takes part.' },
  hearth_ember: { name: 'Hearth Ember', pocket: 'items', hold: 'ember', sell: 500, desc: 'A warm, never-dying ember. Held: restores a little HP every turn.' },
  lucky_ribbon: { name: 'Lucky Ribbon', pocket: 'items', hold: 'ribbon', sell: 400, desc: 'Held: sometimes lets the holder hang on with 1 HP.' },
  stillstone: { name: 'Stillstone', pocket: 'items', hold: 'still', sell: 300, desc: 'A perfectly smooth stone. Held: the holder will not evolve.' },
  camp_pack: { name: 'Camp Pack', pocket: 'key', use: 'camp', desc: 'Shares half of all battle EXP with Wildmon that did not battle. Use it to switch it on or off.' },
});
DATA.shops.fernwick = ['lantern', 'potion', 'bramble_berry', 'cure_berry', 'antidote', 'unknot', 'burn_salve', 'wake_bell', 'thaw_tea'];

/* Trainer tactics: basic | tactical | expert, plus items they carry */
Object.assign(DATA.trainers.bram, { ai: 'tactical' });
Object.assign(DATA.trainers.stud2, { ai: 'tactical', team: [['zappik', 6, 'swift_feather']] });
Object.assign(DATA.trainers.hollis, { ai: 'expert', items: { potion: 2 }, team: [['shellsnip', 7], ['twigwing', 7], ['murkle', 8, 'bramble_berry']] });
Object.assign(DATA.trainers.kit1, { ai: 'basic' });
DATA.trainerGifts = { bram: 'ember_charm', stud2: 'spark_charm', stud1: 'lucky_ribbon' };

/* Item pickups in the world */
DATA.maps.emberlow.items.push({ id: 'tide', x: 5, y: 19, item: 'tide_charm' });
DATA.maps.route1.items.push({ id: 'feather', x: 3, y: 30, item: 'swift_feather', hidden: true });
DATA.maps.fernwick.items.push({ id: 'leaf', x: 25, y: 12, item: 'leaf_charm' }, { id: 'still', x: 16, y: 18, item: 'stillstone', hidden: true });

DATA.achievements.tactician = { name: 'Tactician', desc: 'Win a battle while the weather is active.' };
DATA.achievements.outfitted = { name: 'Outfitted', desc: 'Give a Wildmon an item to hold.' };
DATA.settingsDefaults = { battleStyle: 'shift' };
