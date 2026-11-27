// Captures palier 0.9.62 : node rooms62.js <html> <prefix>
// cuisine en 4 variantes (four/plan/aide), labo, salle d'armes, boutique, guilde ; bulle Pipo masquée
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
await p.evaluate(()=>{newRun(CHARS[0].id,0);enterGame&&enterGame();try{S.unl.guilde=true;S.unl.gym=true;S.unl.lab=true;S.unl.kitchen=true}catch(e){};try{localStorage.setItem('myconautes-tut-done','1')}catch(e){}});await p.waitForTimeout(600);
const K=[['atre','table','lutin'],['fonte','billot','hibou'],['champi','marbre','chat'],['dragon','etal','golem']];
const shots=K.map((k,i)=>['kitchen'+i,'kitchen',{k_four:k[0],k_plan:k[1],k_aide:k[2]}]).concat([['lab','lab'],['gym','gym'],['shop','shop'],['guilde','guilde']]);
for(const [name,loc,set] of shots){
  await p.evaluate(([loc,set])=>{
    if(set)META.cos.eq=Object.assign({},META.cos.eq,set);
    S.loc=loc;try{render();}catch(e){console.log(e.message)}
    document.querySelectorAll('#pipo,.tut,#tut,.coach,.tip-bubble').forEach(e=>e.style.display='none');
  },[loc,set]);
  await p.waitForTimeout(900);
  const el=await p.$('#world svg.scene')||await p.$('#world svg');
  if(el) await el.screenshot({path:process.argv[3]+'_'+name+'.png'});
}
await b.close();})();
