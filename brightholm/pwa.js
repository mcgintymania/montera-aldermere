'use strict';
/* =====================================================================
   APP SHELL — offline caching and the install prompt when hosted
   ===================================================================== */
const AppShell = {
  prompt: null,
  hosted() { return /^https?:$/.test(location.protocol); },
  init() {
    if (!this.hosted()) return;
    if ('serviceWorker' in navigator) addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); this.prompt = e; });
    addEventListener('appinstalled', () => { this.prompt = null; });
  },
  canInstall() { return !!this.prompt; },
  async install() {
    const p = this.prompt; if (!p) return false;
    this.prompt = null; p.prompt();
    try { return (await p.userChoice).outcome === 'accepted'; } catch { return false; }
  },
};
AppShell.init();
