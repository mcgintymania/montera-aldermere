"""Body form for every Wildmon. Colours, size and eyes come from the current art unless given here.
Run tools/gen_art.py to write src/artdata.js."""
Q = 'quad'
SPEC = {
  # grass tortoise starter
  'mossling':   dict(f=Q, build='tortoise', x=['sapling'], tail='stub'),
  'thornback':  dict(f=Q, build='tortoise', x=['sapling'], back='spikes', tail='stub'),
  'bastionoak': dict(f=Q, build='tortoise', x=['tree', 'claws'], back='spikes', tail='stub'),
  # fire starter
  'firecub':    dict(f=Q, build='pup', ear='point', tail='flame'),
  'cinderclaw': dict(f=Q, build='cat', ear='tuft', tail='flame', x=['stripes', 'claws']),
  'infernyx':   dict(f=Q, build='lion', ear='point', tail='flame', x=['mane'], back='flames'),
  # water starter
  'puddlepup':  dict(f=Q, build='pup', ear='floppy', tail='puff', mouth='nose'),
  'brinehound': dict(f=Q, build='hound', ear='fin', tail='whip'),
  'abyssmaul':  dict(f='biped', build='brute', x=['fins', 'barnacles'], ear='fin'),
  # rabbits
  'burrowbit':  dict(f='rabbit', ear='long'),
  'warrenbuck': dict(f='rabbit', ear='long', horn='twin'),
  'moonhop':    dict(f='rabbit', ear='long', horn='moon'),
  # songbird to storm raptor
  'twigwing':   dict(f='bird', pose='perch', tail='leaf'),
  'gustfinch':  dict(f='bird', pose='perch', x=['crest'], tail='fan'),
  'tempestral': dict(f='bird', pose='flier', x=['crest'], tail='fan'),
  # bug line
  'grubble':    dict(f='worm', shape='caterpillar'),
  'silkcase':   dict(f='blob', shape='tall', x=['cocoon']),
  'lumoth':     dict(f='bug', shape='moth'),
  'duskmoth':   dict(f='bug', shape='moth', tail='swallow'),
  # electric rodent
  'zappik':     dict(f=Q, build='rodent', ear='disc', tail='bolt'),
  'joltfox':    dict(f=Q, build='fox', ear='big', tail='bolt', x=['ruff']),
  'voltpaw':    dict(f='biped', build='lanky', ear='point', tail='bolt'),
  # rocks
  'pebblin':    dict(f='mineral', shape='boulder'),
  'bouldrum':   dict(f='mineral', shape='boulder', x=['arms']),
  'cragmaw':    dict(f='mineral', shape='boulder', x=['arms'], mouth='jaw', back='spikes'),
  # sludge
  'murkle':     dict(f='blob', shape='drip'),
  'bogmire':    dict(f='blob', shape='flat', x=['drop', 'arms']),
  # ghost wisp to lantern
  'wispet':     dict(f='wisp', shape='tail'),
  'lanternwisp':dict(f='wisp', shape='tail', x=['handle', 'core']),
  'gloamshade': dict(f='wisp', shape='sheet', x=['hood', 'arms']),
  # light deer
  'fawnlight':  dict(f=Q, build='deer', ear='round', tail='puff', x=['spots', 'hooves']),
  'solstag':    dict(f=Q, build='deer', ear='round', tail='puff', horn='sun', x=['hooves']),
  'noxstag':    dict(f=Q, build='deer', ear='round', tail='puff', horn='moon', x=['spots', 'hooves']),
  # crabs
  'shellsnip':  dict(f='crab', shape='crab'),
  'reefclamp':  dict(f='crab', shape='crab', x=['bigclaw'], back='spikes'),
  # moles
  'molekin':    dict(f=Q, build='mole', tail='thin', mouth='nose', x=['claws']),
  'tunnelord':  dict(f=Q, build='mole', tail='thin', mouth='drill', x=['claws'], back='plates'),
  # dark cat
  'shadepaw':   dict(f=Q, build='cat', ear='point', tail='thin'),
  'nightprowl': dict(f=Q, build='cat', ear='tuft', tail='thin', x=['stripes'], back='spikes'),
  # fish
  'flopfin':    dict(f='fish', shape='fish'),
  'gyrefin':    dict(f='fish', shape='fish', wing='fin'),
  'lumifin':    dict(f='jelly', x=['core']),
  'kindlit':    dict(f='blob', shape='tall', x=['flame']),
  # grass rodents
  'sprigrat':   dict(f=Q, build='ferret', ear='leaf', tail='leaf'),
  'thicketrat': dict(f=Q, build='ferret', ear='leaf', tail='leaf', back='leaves'),
  # mushrooms
  'sporelet':   dict(f='blob', shape='cap'),
  'fungrove':   dict(f='blob', shape='cap', s_mul=1.1),
  # wasps
  'stinglet':   dict(f='bug', shape='bee'),
  'waspire':    dict(f='bug', shape='bee', s_mul=1.15),
  # light worms
  'glimwig':    dict(f='worm', shape='centipede'),
  'beamwyrm':   dict(f='worm', shape='serpent', back='crystals'),
  # plant fighters
  'bramblimp':  dict(f='biped', build='imp', ear='leaf'),
  'briarbrawl': dict(f='biped', build='squat', ear='leaf', back='spikes'),
  # gulls
  'gullet':     dict(f='bird', pose='flier', tail='fork'),
  'squallgull': dict(f='bird', pose='soar', tail='fork', x=['crest']),
  # desert fox
  'sandkit':    dict(f=Q, build='fox', ear='big', tail='brush'),
  'dunefox':    dict(f=Q, build='fox', ear='big', tail='brush', back='spikes'),
  # sea ghosts
  'driftveil':  dict(f='wisp', shape='veil'),
  'wraithtide': dict(f='wisp', shape='veil', x=['drop', 'crown']),
  # starfish
  'glintstar':  dict(f='mineral', shape='star'),
  'prismstar':  dict(f='mineral', shape='star', x=['core']),
  # crows
  'rookling':   dict(f='bird', pose='raptor', tail='long', s_mul=0.85),
  'corvane':    dict(f='bird', pose='raptor', x=['plume'], tail='long'),
  # bats
  'fizzbat':    dict(f='bat'),
  'thunderwing':dict(f='bat', tail='bolt', s_mul=1.1),
  # electric beetles
  'coilbug':    dict(f='bug', shape='beetle'),
  'dynacoil':   dict(f='bug', shape='beetle', s_mul=1.12),
  # gears
  'gearling':   dict(f='mineral', shape='gear'),
  'cogmaul':    dict(f='biped', build='robot', x=['core']),
  # lava
  'magmite':    dict(f='blob', shape='round', x=['flame', 'spots']),
  'volcarn':    dict(f=Q, build='boar', back='flames', mouth='tusks'),
  # fire toads
  'cindertoad': dict(f='frog', shape='toad', x=['flame']),
  'ashtoad':    dict(f='frog', shape='toad', back='bumps', x=['sac']),
  # boxers
  'pummelo':    dict(f='biped', build='kanga', ear='round'),
  'gauntlord':  dict(f='biped', build='kanga', ear='round', s_mul=1.08),
  # crystals to dragon
  'quartzling': dict(f='mineral', shape='crystal'),
  'geodrake':   dict(f=Q, build='drake', back='crystals', tail='spike', horn='twin'),
  # drill birds
  'drillbeak':  dict(f='bird', pose='chick', mouth='long'),
  'augerhawk':  dict(f='bird', pose='raptor', mouth='long', x=['crest']),
  # fire ghosts
  'smoulder':   dict(f='wisp', shape='flame'),
  'pyrewraith': dict(f='wisp', shape='flame', x=['hood']),
  # sky rays
  'mantaglide': dict(f='fish', shape='ray', wing='feather'),
  'skymanta':   dict(f='fish', shape='ray', wing='feather', s_mul=1.1),
  # town birds
  'rooftik':    dict(f='bird', pose='chick', x=['crest'], tail='fork'),
  'roofhawk':   dict(f='bird', pose='perch', x=['crest'], tail='long'),
  # psychic orbs
  'psylet':     dict(f='wisp', shape='orb'),
  'psyren':     dict(f='wisp', shape='orb', horn='gem', x=['hood', 'arms']),
  # scrap rats
  'rustrat':    dict(f=Q, build='rodent', ear='round', tail='thin', back='bumps'),
  'scraprat':   dict(f=Q, build='boar', ear='round', tail='thin', back='quills', mouth='fang', x=['claws']),
  # mud
  'bogling':    dict(f='blob', shape='flat'),
  'mudmaw':     dict(f='blob', shape='flat', x=['arms'], mouth='jaw'),
  # marsh ghosts
  'fenwisp':    dict(f='wisp', shape='tail', x=['leafhat', 'mist']),
  'willowraith':dict(f='plant', shape='tree'),
  # frogs
  'croaklet':   dict(f='frog', shape='frog'),
  'venomcroak': dict(f='frog', shape='frog', x=['spots'], back='spikes'),
  # grave butterflies
  'gravemoth':  dict(f='bug', shape='butterfly'),
  'tombwing':   dict(f='bug', shape='butterfly', tail='swallow', s_mul=1.05),
  # hex lynx
  'hexcat':     dict(f=Q, build='lynx', ear='tuft', tail='ribbon', horn='gem'),
  'hexpanther': dict(f=Q, build='lynx', ear='tuft', tail='ribbon', horn='gem', x=['stripes'], back='quills'),
  # ghost dogs
  'bonepup':    dict(f=Q, build='dog', ear='point', tail='thin', back='quills', c='#e8e2d0', c2='#9a8ab8', b='#f8f4ea'),
  'cryptound':  dict(f=Q, build='hound', ear='point', tail='brush', back='spikes', c='#2e3440', c2='#7af0c0', b='#4a5460', eye='glow'),
  # eels
  'lampreel':   dict(f='fish', shape='eel', x=['lure']),
  'voltreel':   dict(f='fish', shape='eel', x=['lure'], s_mul=1.08),
  # rock birds
  'pebwing':    dict(f='bird', pose='chick', x=['plume']),
  'cragrook':   dict(f='bird', pose='wader'),
  # whirlwinds
  'puffwhirl':  dict(f='wisp', shape='tornado'),
  'cyclonix':   dict(f='wisp', shape='tornado', x=['crown']),
  # ice fox
  'frostkit':   dict(f=Q, build='fox', ear='point', tail='fluff', x=['stripes']),
  'rimefox':    dict(f=Q, build='fox', ear='point', tail='brush', x=['ruff'], back='crystals'),
  # rams
  'goatlet':    dict(f=Q, build='ram', ear='round', horn='single', x=['hooves'], tail='stub'),
  'crestram':   dict(f=Q, build='ram', ear='round', horn='curl', x=['hooves'], back='quills', tail='stub'),
  # lichen
  'lichenlo':   dict(f='blob', shape='round', x=['spots', 'leafhat']),
  'mossgaunt':  dict(f='mineral', shape='slab', x=['moss', 'arms']),
  # storm lion
  'stormpup':   dict(f=Q, build='hound', ear='fin', tail='bolt', back='spikes', s_mul=0.85, c='#5a78d0', c2='#f0d040'),
  'thundermane':dict(f=Q, build='lion', ear='point', tail='bolt', x=['mane'], wing='feather'),
  # owls
  'hootlet':    dict(f='bird', pose='owl'),
  'gloomowl':   dict(f='bird', pose='owl', wing='raised'),
  # clouds
  'cloudmallow':dict(f='blob', shape='cloud'),
  'nimbusoft':  dict(f='blob', shape='cloud', x=['rain'], horn='crown'),
  # dragons
  'kindrake':   dict(f=Q, build='drake', wing='bat', tail='spike'),
  'pyrowyrm':   dict(f='worm', shape='serpent', wing='bat', horn='twin', back='spikes'),
  'echolith':   dict(f='mineral', shape='geode'),
  'snowpip':    dict(f='bird', pose='flier', tail='fan', s_mul=0.8),
  # penguins
  'pengling':   dict(f='bird', pose='penguin'),
  'floemperor': dict(f='bird', pose='penguin', horn='crown', s_mul=1.08),
  # hares
  'frostbun':   dict(f=Q, build='lynx', ear='long', tail='puff'),
  'blizzhare':  dict(f=Q, build='lynx', ear='long', tail='puff', back='crystals', horn='single'),
  # yetis
  'yetling':    dict(f='biped', build='squat', x=['mane']),
  'yetimaul':   dict(f='biped', build='squat', x=['mane'], horn='twin', s_mul=1.15),
  # ice bears
  'icicub':     dict(f=Q, build='bear', ear='round', back='crystals', tail='stub'),
  'glacieryx':  dict(f=Q, build='bear', ear='round', back='crystals', x=['shell'], tail='stub'),
  # floating shards
  'shardling':  dict(f='mineral', shape='shard'),
  'prismafrost':dict(f='mineral', shape='shard', x=['core'], s_mul=1.08),
  # mammoths
  'mammote':    dict(f=Q, build='mammoth', ear='disc', mouth='trunk', tail='thin'),
  'mammaul':    dict(f=Q, build='mammoth', ear='disc', mouth='tusks', tail='thin', x=['mane']),
  'auroraith':  dict(f='wisp', shape='sheet', horn='crown', x=['mist']),
  # huskies
  'huskpup':    dict(f=Q, build='dog', ear='point', tail='curl'),
  'sledhound':  dict(f=Q, build='hound', ear='point', tail='curl', x=['ruff']),
  # dragonflies
  'frostmoth':  dict(f='bug', shape='dragonfly'),
  'aurmoth':    dict(f='bug', shape='dragonfly', x=['crown'], s_mul=1.08),
  # clams
  'rimeshell':  dict(f='blob', shape='clam'),
  'ironfrost':  dict(f='blob', shape='clam', back='crystals', s_mul=1.1),
  'snowdrift':  dict(f=Q, build='lizard', tail='whip', back='crystals', x=['claws']),
  # rivets to iron
  'rivetling':  dict(f='blob', shape='round', back='bumps'),
  'bolthulk':   dict(f='biped', build='golem'),
  'ironclast':  dict(f='biped', build='golem', back='plates', horn='single'),
  # smelters
  'smeltmite':  dict(f='crab', shape='mite', x=['flame']),
  'crucibeast': dict(f='crab', shape='scorpion', x=['flame']),
  # deep sea
  'abyssling':  dict(f='fish', shape='fish', x=['lure']),
  'leviathorn': dict(f='worm', shape='coils', back='spikes', ear='fin'),
  # barnacles
  'barnaclad':  dict(f='blob', shape='pear', x=['barnacles']),
  'hullgaunt':  dict(f='biped', build='squat', x=['barnacles', 'shell']),
  # sharks
  'gloomray':   dict(f='fish', shape='ray', back='spikes'),
  'abyssray':   dict(f='fish', shape='ray', back='spikes', x=['lure'], s_mul=1.12),
  # wire mice
  'cogmouse':   dict(f=Q, build='rodent', ear='antenna', tail='curl', x=['saddle']),
  'dynamaus':   dict(f=Q, build='rodent', ear='antenna', tail='curl', x=['saddle', 'stripes'], back='bumps', s_mul=1.15),
  # slag
  'slaglet':    dict(f='blob', shape='flat', x=['spots'], back='bumps'),
  'slagolem':   dict(f=Q, build='bear', back='flames', horn='twin', mouth='fang'),
  'lumenkoi':   dict(f='fish', shape='koi', x=['crown', 'whiskers']),
  'spirewing':  dict(f='bird', pose='raptor', wing='raised', tail='long'),
  # knights
  'knightling': dict(f='biped', build='knight', x=['helm'], s_mul=0.85),
  'paladross':  dict(f='biped', build='knight', x=['helm', 'cape']),
  'hollowshell':dict(f='biped', build='gown', x=['helm', 'shell']),
  # candle spirits
  'emberwick':  dict(f='biped', build='imp', x=['flame']),
  'lumenwick':  dict(f='blob', shape='tall', x=['flame', 'arms'], horn='crown'),
  'gargrim':    dict(f='biped', build='brute', wing='bat', horn='twin', tail='spike'),
  'ironwing':   dict(f='bird', pose='soar', wing='blade', tail='spike'),
  'augurine':   dict(f='biped', build='robe', horn='crown', x=['orb']),
  # star cats
  'twinkit':    dict(f=Q, build='cat', ear='big', tail='ribbon', x=['spots'], c='#e4d4f4', c2='#f0c848', b='#fff8e8'),
  'constellynx':dict(f=Q, build='lynx', ear='big', tail='ribbon', horn='crown', x=['spots', 'mane']),
  # meteors
  'meteorb':    dict(f='mineral', shape='meteor'),
  'astrolith':  dict(f='mineral', shape='meteor', back='crystals', s_mul=1.08),
  'nebulune':   dict(f='jelly', horn='crown', x=['core', 'stars']),
  # wardens and legends
  'solvane':    dict(f='bird', pose='raptor', wing='raised', x=['plume'], tail='ribbon', horn='sun'),
  'tidevane':   dict(f='fish', shape='seahorse'),
  'galevane':   dict(f='bird', pose='swift', x=['crest'], tail='bolt'),
  'nocthra':    dict(f='worm', shape='serpent', back='sail', horn='moon'),
  'aurelion':   dict(f=Q, build='lion', ear='round', tail='fluff', horn='sun', x=['mane']),
  'eclipsar':   dict(f='biped', build='cloak', x=['orb'], horn='moon'),
  'aldra':      dict(f='wisp', shape='orb', x=['crown', 'core']),
}
