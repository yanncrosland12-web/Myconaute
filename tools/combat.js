const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1200);
await p.evaluate(()=>{newRun(Object.keys(CHARS||{})[0]||"ermite",0)});await p.waitForTimeout(500);
const fk=process.argv.slice(3);let i=0;
for(const f of fk){await p.evaluate(f=>{if(typeof WD!=='undefined'&&WD.fight){WD.fight=null;closeBattle()}S.day=12;S.loc="forest";S.forest=genForest();S.forest.items.forEach(i=>{if(i.k==="foe")i.done=true});S.forest.items.push({k:"foe",r:S.forest.entry[0]-2,c:S.forest.entry[1],foe:f,gear:{w:-1,a:-1},st:[0,0,0]});WD.pl=null;render();startCombat(S.forest.items.length-1,true)},f);await p.waitForTimeout(900);await p.evaluate(()=>{for(const b of document.querySelectorAll('button'))if(/compris/i.test(b.textContent))b.click()});await p.waitForTimeout(200);await p.screenshot({path:`/home/claude/backup/cb_${i++}.png`,clip:{x:0,y:0,width:390,height:330}})}
console.log('errors',JSON.stringify(errs));await b.close()})();
