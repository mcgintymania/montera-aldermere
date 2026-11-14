#!/usr/bin/env python3
"""Builds dist/companion.html from the game's data files plus the companion app."""
import re, pathlib
root = pathlib.Path(__file__).parent
src, comp = root / 'src', root / 'companion'
game_files = re.search(r"\[(.*?)\]", (root / 'build.py').read_text(), re.S).group(1)
files = re.findall(r"'([^']+)'", game_files)
data_files = files[:files.index('engine.js')]
engine = (src / 'engine.js').read_text()

def grab(name):
    """Pull one top-level function out of engine.js by brace matching."""
    i = engine.index(f'const {name} = {{') if name.isupper() else engine.index(f'function {name}(')
    j = engine.index('{', i); depth = 0
    for k in range(j, len(engine)):
        if engine[k] == '{': depth += 1
        elif engine[k] == '}':
            depth -= 1
            if depth == 0: return engine[i:k + 1] + (';' if name.isupper() else '')
    raise SystemExit(f'could not extract {name}')

shim = "\n".join([
    "const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);",
    "let G = null;",
    grab('PAL'), grab('mulberry'), grab('makeCanvas'), grab('pen'), grab('shade'),
])
js = "\n".join([
    "'use strict';",
    "const LOGO_SRC = 'data:image/jpeg;base64," + (src / 'logo.b64').read_text().strip() + "';",
    "\n".join((src / f).read_text().replace("'use strict';", '', 1) for f in data_files),
    shim,
    '(() => {' + (comp / 'app.js').read_text().replace("'use strict';", '', 1) + '})();',
])
html = (comp / 'template.html').read_text()
html = html.replace('/*CSS*/', (comp / 'style.css').read_text()).replace('/*JS*/', js)
out = root / 'dist' / 'companion.html'
out.write_text(html)
print(f'built {out.name}: {len(html)} bytes')
