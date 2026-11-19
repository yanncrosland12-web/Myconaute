const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:260}});await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const ks=process.argv[4].split(',');const pre=process.argv[5]||'spr-';
await p.evaluate(([ks,pre])=>{document.body.innerHTML+='';const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#4a6b3a;z-index:99999';
let h='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="260">';ks.forEach((k,i)=>{h+=`<svg x="${10+i*98}" y="20" width="96" height="220" viewBox="0 -20 100 200"><use href="#${pre}${k}"/></svg>`;});h+='</svg>';d.innerHTML=h;document.body.appendChild(d);},[ks,pre]);
await p.waitForTimeout(500);await p.screenshot({path:process.argv[3]});await b.close();})();
