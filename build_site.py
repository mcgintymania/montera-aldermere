#!/usr/bin/env python3
"""Assembles the installable web app in site/: the title screen, both games, the Companion, manifest, service worker and icons."""
import hashlib, json, pathlib, shutil, subprocess, sys

root = pathlib.Path(__file__).parent
dist, site, pwa = root / 'dist', root / 'site', root / 'pwa'
if '--no-build' not in sys.argv:
    subprocess.run([sys.executable, str(root / 'build.py')], check=True)
    subprocess.run([sys.executable, str(root / 'build_brightholm.py')], check=True)
    subprocess.run([sys.executable, str(root / 'tools' / 'bh_snapshot.py')], check=True)
    subprocess.run([sys.executable, str(root / 'build_companion.py')], check=True)
subprocess.run([sys.executable, str(root / 'build_launcher.py')] + (['--release'] if '--release' in sys.argv else []), check=True)

site.mkdir(exist_ok=True)
(site / 'icons').mkdir(exist_ok=True)
shutil.copy(dist / 'launcher.html', site / 'index.html')
shutil.copy(dist / 'montera.html', site / 'aldermere.html')
shutil.copy(dist / 'brightholm.html', site / 'brightholm.html')
shutil.copy(dist / 'companion.html', site / 'companion.html')
shutil.copy(root / 'launcher' / 'logo.webp', site / 'logo.webp')
subprocess.run([sys.executable, 'mkicons.py', str((site / 'icons').resolve())], cwd=pwa, check=True, capture_output=True)

BG = '#0d0f17'
manifest = {
    'id': './',
    'name': 'Montera',
    'short_name': 'Montera',
    'description': 'Retro monster-catching adventures: catch Wildmon, earn Badges and become Champion.',
    'start_url': './',
    'scope': './',
    'display': 'standalone',
    'display_override': ['fullscreen', 'standalone'],
    'orientation': 'any',
    'background_color': BG,
    'theme_color': BG,
    'categories': ['games', 'entertainment'],
    'icons': [
        {'src': 'icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
        {'src': 'icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any'},
        {'src': 'icons/maskable-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'maskable'},
        {'src': 'icons/maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
    ],
    'shortcuts': [
        {'name': 'The Lanterns of Aldermere', 'short_name': 'Aldermere', 'url': 'aldermere.html', 'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192'}]},
        {'name': 'Companion Guide', 'short_name': 'Guide', 'url': 'companion.html', 'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192'}]},
        {'name': 'Wildbook', 'url': 'companion.html#/wildmon', 'icons': [{'src': 'icons/icon-192.png', 'sizes': '192x192'}]},
    ],
}
(site / 'manifest.webmanifest').write_text(json.dumps(manifest, indent=2))

shell = ['./', 'index.html', 'aldermere.html', 'brightholm.html', 'companion.html', 'logo.webp', 'manifest.webmanifest'] + [f'icons/{p.name}' for p in sorted((site / 'icons').glob('*.png'))]
digest = hashlib.sha256(b''.join((site / (p if p != './' else 'index.html')).read_bytes() for p in shell)).hexdigest()[:12]
sw = """const CACHE = 'montera-%s';
const SHELL = %s;
const FONTS = 'montera-fonts';
const PAGES = ['aldermere.html', 'brightholm.html', 'companion.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.open(CACHE).then(async (c) => {
      const hit = await c.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await c.match(PAGES.find((p) => url.pathname.endsWith('/' + p)) || 'index.html') : null);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
""" % (digest, json.dumps(shell))
(site / 'sw.js').write_text(sw)
(site / '.nojekyll').write_text('')
shutil.copy(root / 'README.md', site / 'README.md') if (root / 'README.md').exists() else None
print(f'site ready: cache {digest}, {len(shell)} files precached')
