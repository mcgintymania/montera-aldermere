const fs=require('fs'), vm=require('vm');
const ctx={console}; vm.createContext(ctx);
ctx.clamp=(v,a,b)=>v<a?a:v>b?b:v; vm.runInContext(['data.js','monsters.js','battledata.js','progressdata.js','act1data.js','act1maps.js','act2data.js','act2maps.js','act3data.js','act3rows.js','act3maps.js','skyreachdata.js','skyreachrows.js','skyreachmaps.js','frostdata.js','frostrows.js','frostmaps.js','spiredata.js','spirerows.js','spiremaps.js','leaguedata.js','leaguerows.js','leaguemaps.js','postgamedata.js','postgamerows.js','postgamemaps.js'].map(f=>fs.readFileSync(__dirname+'/../src/'+f,'utf8')).join('\n')+';this.DATA=DATA;',ctx);
const D=ctx.DATA; D.scripts.warehouseKeeper=D.scripts.warehouseKeeper||(()=>{}); const extra=fs.readFileSync(__dirname+'/../src/progress.js','utf8')+fs.readFileSync(__dirname+'/../src/field.js','utf8')+fs.readFileSync(__dirname+'/../src/act2.js','utf8')+fs.readFileSync(__dirname+'/../src/doubles.js','utf8')+fs.readFileSync(__dirname+'/../src/storage.js','utf8')+fs.readFileSync(__dirname+'/../src/act3.js','utf8')+fs.readFileSync(__dirname+'/../src/skyreach.js','utf8')+fs.readFileSync(__dirname+'/../src/frost.js','utf8')+fs.readFileSync(__dirname+'/../src/spire.js','utf8')+fs.readFileSync(__dirname+'/../src/league.js','utf8')+fs.readFileSync(__dirname+'/../src/postgame.js','utf8'); for(const m of extra.matchAll(/async (\w+)\(s[,)]/g)) if(!D.scripts[m[1]]) D.scripts[m[1]]=()=>{}; let errs=0; const err=(...a)=>{errs++;console.log('ERR',...a);};
const solidT=c=>{const t=D.tiles[c]; return !t||(t.solid&&!t.dyn&&!t.cut);};
for(const [id,m] of Object.entries(D.maps)){
  const w=m.rows[0].length,h=m.rows.length;
  m.rows.forEach((r,y)=>{ if(r.length!==w) err(id,'row',y,'len',r.length,'!=',w); for(const c of r) if(!D.tiles[c]) err(id,'bad char',c,'row',y); });
  const solid=new Set(), warps={};
  for(const b of m.buildings||[]){ if(b.x<0||b.y<0||b.x+b.w>w||b.y+b.h>h) err(id,'building OOB',b.kind);
    for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){ if(solid.has(x+','+y)) err(id,'building overlap',x,y); solid.add(x+','+y);}
    if(b.to){ const k=(b.x+b.door)+','+(b.y+b.h-1); solid.delete(k); warps[k]=b.to; } }
  for(const wp of m.warps||[]) warps[wp.x+','+wp.y]=wp.to;
  const occ=new Set();
  const isFree=(x,y)=> x>=0&&y>=0&&x<w&&y<h && !solid.has(x+','+y) && !solidT(m.rows[y][x]) && !D.tiles[m.rows[y][x]].ledge;
  const objs=[...(m.props||[]).map(p=>['prop',p]),...(m.items||[]).filter(i=>!i.hidden).map(i=>['item',i]),...(m.npcs||[]).map(n=>['npc',n])];
  for(const [k,o] of objs){ if(!isFree(o.x,o.y)&&!o.onWater) err(id,k,o.id||o.type,'on blocked tile',o.x,o.y,m.rows[o.y]&&m.rows[o.y][o.x]); if(occ.has(o.x+','+o.y)) err(id,'stacked object',o.x,o.y); if(!(k==='prop'&&o.type==='boulder')) occ.add(o.x+','+o.y);
    if(k==='npc'&&o.script&&!D.scripts[o.script]) err(id,'missing script',o.script); if(k==='npc'&&typeof o.look==='string'&&!D.looks[o.look]) err(id,'missing look',o.look); }
  for(const i of (m.items||[])) if(i.item&&!D.items[i.item]) err(id,'bad item',i.item);
  for(const [k,to] of Object.entries(warps)){ const t=D.maps[to.map]; if(!t){err(id,'warp to missing',to.map);continue;}
    const tw=t.rows[0].length; if(to.x<0||to.y<0||to.x>=tw||to.y>=t.rows.length) err(id,'warp target OOB',k,to);
    else if(solidT(t.rows[to.y][to.x])) err(id,'warp target solid',k,to.map,to.x,to.y);
    const tws=(t.warps||[]).some(x=>x.x===to.x&&x.y===to.y); if(tws) err(id,'warp lands on warp',k,to);
    for(const n of t.npcs||[]) if(!n.cond&&n.x===to.x&&n.y===to.y) err(id,'warp lands on npc',to); }
  for(const tr of m.triggers||[]) if(!D.scripts[tr.script]) err(id,'missing trigger script',tr.script);
  for(const [side,c] of Object.entries(m.connections||{})){ const t=D.maps[c.map]; if(!t){err(id,'conn missing',c.map);continue;}
    // every walkable edge tile on that side must map to walkable tile in target
    const tw=t.rows[0].length, th=t.rows.length;
    for(let i=0;i<(side==='north'||side==='south'?w:h);i++){
      const x= side==='north'||side==='south'? i : (side==='west'?0:w-1), y= side==='north'?0: side==='south'?h-1 : i;
      if(!isFree(x,y)||c.surf) continue;
      const tx= side==='north'||side==='south'? x+(c.dx||0) : (side==='west'?tw-1:0), ty= side==='north'? th-1 : side==='south'? 0 : y+(c.dy||0);
      if(tx<0||ty<0||tx>=tw||ty>=th||solidT(t.rows[ty][tx])) err(id,'connection',side,'from',x,y,'lands blocked',c.map,tx,ty);
    } }
  // reachability BFS from first warp target / start
  m._free=isFree; m._warps=warps; m._occ=occ; m._solid=solid;
}
// BFS each map from all its entry points and check every npc/item/prop/warp is reachable (adjacent)
const entries={}; const add=(map,x,y)=>{(entries[map]=entries[map]||[]).push([x,y]);}; add('ml_tower_4',7,7); add('ml_tower_1',16,3); add('hall_of_fame',5,6);
add('emberlow_home',7,3);
for(const m of Object.values(D.maps)) for(const to of Object.values(m._warps)) add(to.map,to.x,to.y);
for(const [id,m] of Object.entries(D.maps)) for(const [side,c] of Object.entries(m.connections||{})){ const t=D.maps[c.map]; const tw=t.rows[0].length, th=t.rows.length;
  const w=m.rows[0].length, h=m.rows.length;
  if(side==='north'||side==='south'){ for(let x=0;x<w;x++){ const y= side==='north'?0:h-1; if(m._free(x,y)) add(c.map, x+(c.dx||0), side==='north'?th-1:0);} }
  else { for(let y=0;y<h;y++){ const x= side==='west'?0:w-1; if(m._free(x,y)) add(c.map, side==='west'?tw-1:0, y+(c.dy||0)); } } }
for(const [id,m] of Object.entries(D.maps)){
  const w=m.rows[0].length,h=m.rows.length; const seen=new Set(); const q=[...(entries[id]||[])];
  if(!q.length) err(id,'unreachable map (no entries)');
  q.forEach(([x,y])=>seen.add(x+','+y));
  while(q.length){ const [x,y]=q.shift();
    for(const [dx,dy,d] of [[0,1,'down'],[0,-1,'up'],[1,0],[-1,0]]){ let nx=x+dx,ny=y+dy;
      if(nx>=0&&ny>=0&&nx<w&&ny<h&&D.tiles[m.rows[ny][nx]].ledge){ if(d==='down'){ ny++; if(!(m._free(nx,ny))) continue; } else continue; }
      const k=nx+','+ny; if(seen.has(k)) continue; if(!m._free(nx,ny)) { if(!m._warps[k]) continue; } if(m._occ.has(k)) continue; seen.add(k); if(!m._warps[k]) q.push([nx,ny]); } }
  const adj=(o)=>[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>seen.has((o.x+dx)+','+(o.y+dy)) || (m.rows[o.y+dy]&&D.tiles[m.rows[o.y+dy][o.x+dx]]&&D.tiles[m.rows[o.y+dy][o.x+dx]].counter && seen.has((o.x+2*dx)+','+(o.y+2*dy))));
  for(const n of m.npcs||[]) if(!n.onWater&&!adj(n)) err(id,'npc unreachable',n.id);
  for(const p of m.props||[]) if(p.text&&!adj(p)) err(id,'prop unreachable',p.type,p.x,p.y);
  for(const i of m.items||[]) if(!i.locked&&!adj(i)) err(id,'item unreachable',i.id); else if(i.locked&&adj(i)) err(id,'locked item IS reachable',i.id);
  for(const k of Object.keys(m._warps)) if(!seen.has(k)) err(id,'warp unreachable',k);
  for(const tr of m.triggers||[]) { let ok=false; for(let y=tr.y;y<tr.y+tr.h;y++)for(let x=tr.x;x<tr.x+tr.w;x++) if(seen.has(x+','+y)) ok=true; if(!ok) err(id,'trigger unreachable'); }
  for(const k of Object.keys(m.tileText||{})){ const [x,y]=k.split(',').map(Number); if(!adj({x,y})) err(id,'tileText unreachable',k); }
  console.log(id.padEnd(14), 'reachable tiles', seen.size);
}
// music/quests
for(const m of Object.values(D.maps)) if(!D.music[m.music]) err('missing music',m.music);
for(const [k,t] of Object.entries(D.music)){ const tot=t.melody.split(/\s+/).reduce((a,x)=>a+ +x.split(':')[1],0); if(tot!==t.chords.length*8) err('music length',k,tot); }
console.log(errs? errs+' ERRORS':'ALL DATA CHECKS PASSED');
