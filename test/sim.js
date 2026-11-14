const fs=require('fs'), vm=require('vm');
const ctx={console, Math, Date, Set, Map, JSON, Object, Array, Number, String, setTimeout};
ctx.clamp=(v,a,b)=>v<a?a:v>b?b:v; ctx.G=null;
vm.createContext(ctx);
const src=['data.js','monsters.js','battledata.js','progressdata.js','act1data.js','act2data.js','act3data.js','skyreachdata.js','frostdata.js','spiredata.js','leaguedata.js','postgamedata.js','battle.js'].map(f=>fs.readFileSync(__dirname+'/../src/'+f,'utf8')).join('\n');
vm.runInContext(src+';this.DATA=DATA;this.Mon=Mon;this.BE=BattleEngine;',ctx);
const {DATA,Mon,BE}=ctx; let errs=0; const err=(...a)=>{errs++;console.log('ERR',...a);};
// references
for(const [k,s] of Object.entries(DATA.species)){
  for(const [l,m] of s.moves) if(!DATA.moves[m]) err(k,'bad move',m);
  for(const e of s.evo) if(!DATA.species[e.to]) err(k,'bad evo',e.to);
  if(!DATA.species[s.line]) err(k,'bad line'); if(s.base.length!==6) err(k,'base');
  for(const t of s.types) if(!DATA.chart[t]) err(k,'type',t);
  if(Mon.movesAt(k,1).length===0) err(k,'no moves at L1');
}
for(const [m,e] of Object.entries(DATA.encounters)) for(const kind of Object.values(e)) for(const list of Object.values(kind)) for(const [sp] of list) if(!DATA.species[sp]) err('enc',m,sp);
for(const [t,T] of Object.entries(DATA.trainers)) for(const [sp] of T.team) if(!DATA.species[sp]) err('trainer',t,sp);
for(const [k,mv] of Object.entries(DATA.moves)) if(!DATA.chart[mv.type]) err('move type',k);
// chart symmetry sanity
const types=DATA.types; for(const t of types) for(const k of ['se','nv','im']) for(const d of DATA.chart[t][k]) if(!types.includes(d)) err('chart',t,d);
// stats sanity
for(const sp of ['mossling','firecub','puddlepup']){ const m=Mon.create(sp,5,{mastery:{}}); const st=Mon.stats(m,{}); console.log(sp,'L5',JSON.stringify(st),'moves',m.moves.map(x=>x.id).join(',')); }
const m50=Mon.create('infernyx',50,{mastery:{},pot:{hp:15,atk:15,def:15,spa:15,spd:15,spe:15},temp:20}); console.log('infernyx L50 max', JSON.stringify(Mon.stats(m50,{})));
// battles
let turnsTot=0, n=0, maxT=0, switches=0, items=0; const R=Math.random;
for(let i=0;i<3000;i++){
  const sps=DATA.speciesList; const a=sps[Math.floor(R()*sps.length)], b=sps[Math.floor(R()*sps.length)];
  const la=2+Math.floor(R()*40), lb=Math.max(2,la+Math.floor(R()*7)-3);
  const A=Mon.create(a,la,{mastery:{}}), B=Mon.create(b,lb,{mastery:{}});
  const tier=['basic','tactical','expert'][i%3]; const W=[null,'rain','sun','sand','hail'][i%5]; if(i%4===0){A.item=['bramble_berry','cure_berry','hearth_ember','lucky_ribbon','swift_feather','ember_charm'][i%6];} const Bt={kind:'trainer',rng:R,turn:0,used:[],night:i%2===0,weather:W?{k:W,turns:5}:null,sides:[{a:BE.actor(A),party:[A],idx:0},{a:BE.actor(B),party:[B,Mon.create(sps[(i*7)%sps.length],lb,{mastery:{}})],idx:0,items:{potion:1}}]};
  let t=0;
  try{
    while(A.hp>0&&Bt.sides[1].a.mon.hp>0&&t<300){ const ev=[]; const a0={type:'move',id:BE.aiMove(Bt,0,tier)}; const a1x=BE.aiAction(Bt,1,tier); if(a1x.type==='switch'){ Bt.sides[1].idx=a1x.idx; Bt.sides[1].a=BE.actor(Bt.sides[1].party[a1x.idx]); Bt.sides[1].switches=(Bt.sides[1].switches||0)+1; Bt.sides[1].lastSwitch=Bt.turn; switches++; } if(a1x.type==='item'){ Bt.sides[1].items.potion--; items++; } const a1=a1x.type==='move'?a1x:{type:'move',id:BE.aiMove(Bt,1,tier)}; const B2=Bt.sides[1].a.mon;
      const ord=BE.order(Bt,a0,a1); for(const si of ord){ BE.useMove(Bt,si,si===0?a0.id:a1.id,ev); if(A.hp<=0||B2.hp<=0) break; } Bt.turn++;
      BE.endTurn(Bt,ev); t++;
      for(const e of ev){ if(e.t==='text'&&(!e.s||e.s.includes('undefined')||e.s.includes('NaN'))) err('bad text',e.s); if(e.t==='hp'&&(isNaN(e.hp)||e.hp<0)) err('bad hp',e.hp); }
      for(const M of [A,Bt.sides[1].a.mon]){ if(M.hp>Mon.stats(M,{}).hp) err('hp over max',M.sp); M.moves.forEach(mv=>{ if(mv.pp<0) err('pp<0'); }); }
    }
  }catch(e){ err('exception',a,b,e.stack.split('\n').slice(0,3).join(' | ')); break; }
  if(t>=300) { stale=(stale||0)+1; }
  turnsTot+=t; n++; maxT=Math.max(maxT,t);
}
console.log('AI switches',switches,'items',items); console.log('battles',n,'avg turns',(turnsTot/n).toFixed(1),'max',maxT);
// catch rates: full hp vs 1hp for burrowbit L3 and fawnlight L5
for(const [sp,lv] of [['burrowbit',3],['zappik',4],['fawnlight',5],['kindlit',5],['lumifin',7]]){
  const res=[]; for(const frac of [1,0.5,0.05]){ let c=0; for(let i=0;i<4000;i++){ const m=Mon.create(sp,lv,{mastery:{}}); m.hp=Math.max(1,Math.floor(Mon.stats(m,{}).hp*frac)); if(BE.catchShakes(m,1,1,R)===4) c++; } res.push((c/40).toFixed(0)+'%'); }
  console.log('catch',sp,'full/half/low:',res.join(' / '));
}
// exp: levels gained by starter beating 30 L3 wild
const st=Mon.create('firecub',5,{mastery:{}}); let wins=0; for(let i=0;i<40;i++){ const w=Mon.create('burrowbit',3+Math.floor(i/10),{mastery:{}}); st.exp+=BE.expGain(st,w,false); while(st.exp>=Mon.expAt('mslow',st.lv+1)) st.lv++; if(i===9||i===19||i===39) console.log('after',i+1,'wild wins: Lv',st.lv); }
console.log('stalemates', typeof stale==='undefined'?0:stale);
// trait checks
{ const mk=(sp,lv,o={})=>Mon.create(sp,lv,Object.assign({mastery:{}},o)); const fire=DATA.moves.ember;
 const K=mk('kindlit',20,{ti:0}), F=mk('firecub',20,{moves:['ember']}); const Bt={kind:'wild',rng:Math.random,sides:[{a:BE.actor(F)},{a:BE.actor(K)}],turn:0,used:[]}; const ev=[]; BE.useMove(Bt,0,'ember',ev); if(!BE.sides) {} if(!Bt.sides[1].a.kindled) err('kindling heart failed');
 const W=mk('wispet',20,{ti:0}); if(BE.damage(Bt,BE.actor(mk('molekin',20)),BE.actor(W),DATA.moves.dig_claw,()=>0.5,false).mult!==0) err('floating failed');
 const P=mk('pebblin',30,{ti:0}); const Bt2={kind:'wild',rng:()=>0.5,sides:[{a:BE.actor(mk('abyssmaul',60))},{a:BE.actor(P)}],turn:0,used:[]}; const ev2=[]; Bt2.sides[0].a.mon.moves=[{id:'hydro_pulse',pp:5}]; BE.useMove(Bt2,0,'hydro_pulse',ev2); if(P.hp!==1) err('sturdy failed',P.hp);
 const G1=mk('mossling',20); const T1=BE.actor(G1); const Bt3={kind:'wild',rng:()=>0.5,weather:{k:'rain',turns:5},sides:[{a:BE.actor(mk('puddlepup',20))},{a:T1}],turn:0,used:[]}; const d1=BE.damage(Bt3,Bt3.sides[0].a,BE.actor(mk('firecub',20)),DATA.moves.water_gun,()=>0.5,false).dmg; Bt3.weather=null; const d0=BE.damage(Bt3,Bt3.sides[0].a,BE.actor(mk('firecub',20)),DATA.moves.water_gun,()=>0.5,false).dmg; if(!(d1>d0*1.3)) err('rain boost',d0,d1); console.log('rain water dmg',d0,'->',d1);
 const Gd=mk('burrowbit',20,{moves:['guard','tackle']}); const Bt4={kind:'wild',rng:Math.random,sides:[{a:BE.actor(mk('firecub',20,{moves:['scratch']}))},{a:BE.actor(Gd)}],turn:1,used:[]}; const ev4=[]; BE.useMove(Bt4,1,'guard',ev4); const hp=Gd.hp; BE.useMove(Bt4,0,'scratch',ev4); if(Gd.hp!==hp) err('guard failed'); }
console.log(errs? errs+' ERRORS':'ALL SIM CHECKS PASSED');
