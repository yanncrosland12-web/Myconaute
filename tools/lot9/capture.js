// Repère les meubles vectoriels (boutique, guilde), mesure leur boîte (coordonnées viewBox) et les rend isolés -> lot9/ref/<nom>.png + lot9/boxes.json
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:412,height:860},deviceScaleFactor:4});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
await p.evaluate(()=>{newRun(CHARS[0].id,0);enterGame&&enterGame();try{S.unl.guilde=true;S.unl.gym=true;}catch(e){}});await p.waitForTimeout(800);
const out={};
for(const room of ['shop','guilde']){
  await p.evaluate(r=>{S.loc=r;render();document.querySelectorAll('.tut,#tut,.tutorial').forEach(e=>e.remove());},room);await p.waitForTimeout(900);
  const res=await p.evaluate((room)=>{
    const svg=document.querySelector('#world svg.scene');const all=[...svg.querySelectorAll('*')];
    const A=(e,k)=>e.getAttribute(k);
    const mark=(name,els)=>els.filter(Boolean).forEach(e=>e.setAttribute('data-fx',(A(e,'data-fx')?A(e,'data-fx')+' ':'')+name));
    const R=(x,y,w)=>all.find(e=>e.tagName==='rect'&&A(e,'x')==x&&A(e,'y')==y&&(w==null||A(e,'width')==w));
    const notText=g=>[...g.children].filter(c=>c.tagName!=='text'&&!(c.tagName==='g'&&c.querySelector('text'))&&!A(c,'class')?.includes('hot')&&A(c,'fill')!=='transparent');
    const grp=d=>svg.querySelector('g[data-d="'+d+'"]');
    if(room==='shop'){
      const cnt=grp('4.35');mark('s_comptoir',[cnt]);
      mark('s_caisse',[...grp('3').querySelectorAll('polygon,path,rect')]);
      const rug=all.filter(e=>e.tagName==='rect'&&(A(e,'fill')==='#8e2b3a'&&A(e,'x')==='58'||A(e,'x')==='63'&&A(e,'y')==='180'));mark('s_tapis',rug);
      const td=all.filter(e=>(e.tagName==='rect'&&(A(e,'x')==='5'&&A(e,'y')==='5'||A(e,'x')==='46'&&A(e,'y')==='6'))||(e.tagName==='path'&&(A(e,'d')||'').startsWith('M12 10 V45')));mark('s_trappe',td);
      mark('s_ardoise',[R(8,24,54),R(12,28,46)].filter(e=>e&&A(e,'fill')!=='transparent'));
      const jars=all.filter(e=>e.tagName==='rect'&&((A(e,'width')==='120'&&(A(e,'y')==='52'||A(e,'y')==='94'))||A(e,'stroke')==='#cfe8f0'||(A(e,'width')==='12'&&A(e,'fill')==='#8a5a33')));mark('s_bocaux',jars);
      const rack=R(76,101,118);const i0=all.indexOf(rack);const rk=[];for(let i=i0;i<all.length;i++){const e=all[i];if(e.tagName==='rect'&&A(e,'fill')==='transparent'&&A(e,'data-act')==='forge')break;rk.push(e);}mark('s_ratelier',rk);
      mark('s_pancarte_foret',notText(grp('4.05').firstElementChild));
      mark('s_pancarte_armes',notText(grp('9.1').firstElementChild));
      mark('s_pancarte_guilde',notText(grp('9').firstElementChild));
      mark('s_enseigne',[R(22,18,100)]);
      const win=all.filter(e=>(e.tagName==='rect'&&['96','100'].includes(A(e,'x'))&&['60','64'].includes(A(e,'y')))||(e.tagName==='circle'&&A(e,'cx')==='132')||(e.tagName==='path'&&/^M100 94|^M121 64/.test(A(e,'d')||'')));mark('s_fenetre',win);
      const d1=all.filter(e=>(e.tagName==='path'&&/^M5[07] \d+ V(88|90)|^M69 \d+ V80|^M81/.test(A(e,'d')||''))||(e.tagName==='circle'&&A(e,'cx')==='82')||R(52,54,34)===e);mark('s_porte_cuisine',d1);
      const d2=all.filter(e=>(e.tagName==='path'&&/^M155 |^M162 /.test(A(e,'d')||''))||(e.tagName==='circle'&&A(e,'cx')==='188'));mark('s_porte_maison',d2);
    } else {
      const lw=all.filter(e=>e.tagName==='path'&&/^M7 /.test(A(e,'d')||''));const door=lw[0];
      if(door){const sib=[...door.parentNode.children];const k=sib.indexOf(door);const dd=[];for(let i=k;i<sib.length;i++){const e=sib[i];if(e.tagName==='rect'&&A(e,'x')==='66'&&A(e,'y')==='40')break;dd.push(e);}mark('g_porte',dd.filter(e=>e.tagName!=='text'));}
      const bd=R(66,40,64);const sib=[...bd.parentNode.children];const k=sib.indexOf(bd);const bb=[];for(let i=k;i<sib.length;i++){const e=sib[i];if(e.tagName==='rect'&&A(e,'x')==='150'&&A(e,'y')==='10')break;if(e.tagName!=='text')bb.push(e);}mark('g_tableau',bb);
      const sh=R(150,10,46);const k2=sib.indexOf(sh);mark('g_biblio',sib.slice(k2).filter(e=>e.tagName==='rect'));
      const ban=all.filter(e=>(e.tagName==='path'&&(/^M36 14/.test(A(e,'d')||'')||/^M50 29/.test(A(e,'d')||'')))||(e.tagName==='circle'&&A(e,'cx')==='50'&&A(e,'cy')==='36'));mark('g_banniere',ban);
      const em=R(78,8,64);const s3=[...em.parentNode.children];const k3=s3.indexOf(em);mark('g_embleme',[em,s3[k3+1],s3[k3+2]]);
      const fp=all.filter(e=>e.tagName==='rect'&&((A(e,'x')==='150'&&A(e,'y')==='60')||(A(e,'x')==='156'&&A(e,'y')==='88')||(A(e,'x')==='146'&&A(e,'y')==='54')));mark('g_cheminee',fp);
      mark('g_bureau',[grp('3.3')]);mark('g_comptoir',[grp('5.1')]);mark('g_tonneau',[grp('7')]);
    }
    // boîtes en coordonnées viewBox
    const vb=svg.viewBox.baseVal,sr=svg.getBoundingClientRect(),kx=vb.width/sr.width,ky=vb.height/sr.height;
    const names=new Set();svg.querySelectorAll('[data-fx]').forEach(e=>A(e,'data-fx').split(' ').forEach(n=>names.add(n)));
    const boxes={};
    for(const n of names){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;svg.querySelectorAll('[data-fx~="'+n+'"]').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width&&!r.height)return;x0=Math.min(x0,r.left);y0=Math.min(y0,r.top);x1=Math.max(x1,r.right);y1=Math.max(y1,r.bottom);});
      boxes[n]={room,x:+(vb.x+(x0-sr.left)*kx).toFixed(2),y:+(vb.y+(y0-sr.top)*ky).toFixed(2),w:+((x1-x0)*kx).toFixed(2),h:+((y1-y0)*ky).toFixed(2),sx:x0,sy:y0,sw:x1-x0,sh:y1-y0};}
    return boxes;
  },room);
  for(const n in res){
    await p.evaluate(n=>{const svg=document.querySelector('#world svg.scene');let st=document.getElementById('fxst');if(!st){st=document.createElement('style');st.id='fxst';document.head.appendChild(st);}
      st.textContent='body *{visibility:hidden!important} #world svg.scene *{visibility:hidden!important} #world svg.scene [data-fx~="'+n+'"], #world svg.scene [data-fx~="'+n+'"] *{visibility:visible!important} #world svg.scene [data-fx~="'+n+'"] text{visibility:hidden!important} #world svg.scene .hot[fill="transparent"]{visibility:hidden!important} body,#world svg.scene{background:#000!important} .ents .char, .ents [class*=breathe]{}';},n);
    const r=res[n];const pad=2;
    await p.screenshot({path:'lot9/ref/'+n+'.png',clip:{x:r.sx-pad,y:r.sy-pad,width:r.sw+2*pad,height:r.sh+2*pad},omitBackground:false});
    out[n]=r;console.log(n,room,r.x,r.y,r.w,r.h);
  }
  await p.evaluate(()=>{const s=document.getElementById('fxst');if(s)s.remove();});
}
fs.writeFileSync('lot9/boxes.json',JSON.stringify(out,null,1));await b.close();})();
