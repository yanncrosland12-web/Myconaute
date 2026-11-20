/* PXUI : transforme à la volée les émojis et petites icônes vectorielles en icônes pixel art (style Stardew). */
(function(){
  const EMO=/(\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*)/gu;
  const cache=new Map(), N=16;
  function outline(cv){ // contour sombre 1 px + seuil d'alpha net
    const c=cv.getContext('2d'),d=c.getImageData(0,0,cv.width,cv.height),a=d.data,w=cv.width,h=cv.height,o=new Uint8ClampedArray(a);
    for(let i=0;i<w*h;i++){const al=a[i*4+3];o[i*4+3]=al>110?255:0;}
    const out=new Uint8ClampedArray(o);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(o[i*4+3])continue;
      for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=w||Y>=h)continue;if(o[(Y*w+X)*4+3]){out[i*4]=42;out[i*4+1]=26;out[i*4+2]=20;out[i*4+3]=255;break;}}}
    d.data.set(out);c.putImageData(d,0,0);return cv.toDataURL();
  }
  function small(src,draw){const big=document.createElement('canvas');big.width=big.height=96;const b=big.getContext('2d');draw(b);
    const cv=document.createElement('canvas');cv.width=cv.height=N+2;const c=cv.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(big,1,1,N,N);return outline(cv);}
  function emoUrl(e){if(cache.has(e))return cache.get(e);
    const u=small(e,b=>{b.textAlign='center';b.textBaseline='middle';b.font='80px "Apple Color Emoji","Noto Color Emoji","Segoe UI Emoji",sans-serif';b.fillText(e,48,52);});cache.set(e,u);return u;}
  function img(u,cls){const i=document.createElement('img');i.src=u;i.className='pxi'+(cls?' '+cls:'');i.alt='';i.draggable=false;return i;}
  function doText(n){const t=n.nodeValue;if(!t||!EMO.test(t))return;EMO.lastIndex=0;const p=n.parentNode;if(!p||p.closest&&p.closest('svg,textarea,input,script,style,.nopx'))return;
    const f=document.createDocumentFragment();let last=0;t.replace(EMO,(m,_,off)=>{if(off>last)f.appendChild(document.createTextNode(t.slice(last,off)));f.appendChild(img(emoUrl(m)));last=off+m.length;});
    if(last<t.length)f.appendChild(document.createTextNode(t.slice(last)));p.replaceChild(f,n);}
  function svgIcon(s){if(s.dataset.px||s.closest('#world,.scene,#b-arena,.nopx'))return;const W=parseFloat(s.getAttribute('width')||s.getBoundingClientRect().width||0);if(!W||W>56)return;
    if(s.querySelector('use,image,animate,mask'))return; // lune animée, sprites : on laisse
    const key=s.outerHTML;let u=cache.get(key);
    if(!u){const vb=s.getAttribute('viewBox')||'0 0 24 24';const x=s.cloneNode(true);x.setAttribute('xmlns','http://www.w3.org/2000/svg');x.setAttribute('width','96');x.setAttribute('height','96');x.setAttribute('viewBox',vb);
      const im=new Image();const data='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(x.outerHTML);s.dataset.px='1';
      im.onload=()=>{u=small(key,b=>b.drawImage(im,0,0,96,96));cache.set(key,u);const r=img(u,'pxs');r.style.width=r.style.height=W+'px';if(s.parentNode)s.parentNode.replaceChild(r,s);};im.src=data;return;}
    const r=img(u,'pxs');r.style.width=r.style.height=W+'px';s.parentNode.replaceChild(r,s);}
  function scan(root){if(!root)return;if(root.nodeType===3){doText(root);return;}if(root.nodeType!==1)return;
    if(root.tagName==='svg'){svgIcon(root);return;}
    const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);const ts=[];while(tw.nextNode())ts.push(tw.currentNode);ts.forEach(doText);
    root.querySelectorAll&&root.querySelectorAll('svg').forEach(svgIcon);}
  const st=document.createElement('style');st.textContent='img.pxi{height:1.15em;width:auto;vertical-align:-0.2em;image-rendering:pixelated;image-rendering:crisp-edges;display:inline-block}img.pxs{image-rendering:pixelated;vertical-align:middle;display:inline-block}';document.head.appendChild(st);
  let pend=false;const q=new Set();
  new MutationObserver(ms=>{for(const m of ms){m.addedNodes.forEach(n=>q.add(n));if(m.type==='characterData')q.add(m.target);}if(!pend){pend=true;requestAnimationFrame(()=>{pend=false;const a=[...q];q.clear();a.forEach(n=>{if(n.isConnected)scan(n)});});}}).observe(document.body,{childList:true,subtree:true,characterData:true});
  scan(document.body);
})();
