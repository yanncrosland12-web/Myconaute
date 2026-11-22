/* Lot 9 : meubles vectoriels de la boutique et de la guilde remplacés par des sprites pixel (window.FURNPX = {nom:[b64,x,y,w,h]}) */
(function () {
  const PX = window.FURNPX || {};
  if (!Object.keys(PX).length) return;
  const NS = "http://www.w3.org/2000/svg";
  /* sprites dessinés de face : posés dans le repère du mur (boîte locale x,y,w,h) */
  const LOC = { g_cheminee: [146, 54, 54, 96] };
  /* ombres de contact (lot 10) pour les meubles posés au sol */
  const SHD = { s_comptoir: { f: 0.96, o: 0.6 }, s_caisse: { f: 0.96, o: 0.6 }, g_bureau: { f: 0.96, o: 0.6 }, g_comptoir: { f: 0.96, o: 0.6 }, g_tonneau: { f: 0.85, d: 0.5, o: 0.6 }, s_pancarte_foret: { px: 0.24, f: 0.5, o: 0.55 }, s_pancarte_armes: { px: 0.3, f: 0.45, o: 0.55 }, s_pancarte_guilde: { px: 0.5, f: 0.4, o: 0.55 } };
  function marks(svg, room) {
    const all = [...svg.querySelectorAll("*")], M = {};
    const A = (e, k) => e.getAttribute(k);
    const mark = (n, els) => { els = (els || []).filter(Boolean); if (els.length) M[n] = els; };
    const R = (x, y, w) => all.find((e) => e.tagName === "rect" && A(e, "x") == x && A(e, "y") == y && (w == null || A(e, "width") == w));
    const notText = (g) => g ? [...g.children].filter((c) => c.tagName !== "text" && !(c.tagName === "g" && c.querySelector("text")) && A(c, "fill") !== "transparent") : [];
    const grp = (d) => svg.querySelector('g[data-d="' + d + '"]');
    const until = (start, stop) => { if (!start) return []; const sib = [...start.parentNode.children], out = []; for (let i = sib.indexOf(start); i < sib.length; i++) { if (stop(sib[i])) break; out.push(sib[i]); } return out; };
    if (room === "shop") {
      const c = grp("4.35"); if (c) mark("s_comptoir", [...c.children]);
      const cr = grp("3"); if (cr) mark("s_caisse", [...cr.children].filter((e) => /^(polygon|path|rect)$/.test(e.tagName)));
      mark("s_tapis", all.filter((e) => e.tagName === "rect" && ((A(e, "fill") === "#8e2b3a" && A(e, "x") === "58") || (A(e, "x") === "63" && A(e, "y") === "180"))));
      mark("s_trappe", all.filter((e) => (e.tagName === "rect" && ((A(e, "x") === "5" && A(e, "y") === "5") || (A(e, "x") === "46" && A(e, "y") === "6"))) || (e.tagName === "path" && (A(e, "d") || "").startsWith("M12 10 V45"))));
      mark("s_ardoise", [R(8, 24, 54), R(12, 28, 46)].filter((e) => e && A(e, "fill") !== "transparent"));
      mark("s_bocaux", all.filter((e) => e.tagName === "rect" && ((A(e, "width") === "120" && (A(e, "y") === "52" || A(e, "y") === "94")) || A(e, "stroke") === "#cfe8f0" || (A(e, "width") === "12" && A(e, "fill") === "#8a5a33"))));
      mark("s_ratelier", until(R(76, 101, 118), (e) => A(e, "data-act") === "forge"));
      const fg = grp("4.05"), ag = grp("9.1"), ug = grp("9");
      mark("s_pancarte_foret", notText(fg && fg.firstElementChild));
      mark("s_pancarte_armes", notText(ag && ag.firstElementChild));
      mark("s_pancarte_guilde", notText(ug && ug.firstElementChild));
      mark("s_enseigne", [R(22, 18, 100)]);
      mark("s_fenetre", all.filter((e) => (e.tagName === "rect" && ["96", "100"].includes(A(e, "x")) && ["60", "64"].includes(A(e, "y"))) || (e.tagName === "circle" && A(e, "cx") === "132") || (e.tagName === "path" && /^M100 94|^M121 64/.test(A(e, "d") || ""))));
      const pl = R(52, 54, 34);
      mark("s_porte_cuisine", all.filter((e) => (e.tagName === "path" && /^M5[07] \d+ V(88|90)|^M69 \d+ V80|^M81 /.test(A(e, "d") || "")) || (e.tagName === "circle" && A(e, "cx") === "82") || e === pl));
      mark("s_porte_maison", all.filter((e) => (e.tagName === "path" && /^M155 |^M162 /.test(A(e, "d") || "")) || (e.tagName === "circle" && A(e, "cx") === "188")));
    } else if (room === "guilde") {
      const door = all.find((e) => e.tagName === "path" && /^M7 /.test(A(e, "d") || ""));
      mark("g_porte", until(door, (e) => e.tagName === "rect" && A(e, "x") === "66" && A(e, "y") === "40").filter((e) => e.tagName !== "text"));
      mark("g_tableau", until(R(66, 40, 64), (e) => e.tagName === "rect" && A(e, "x") === "150" && A(e, "y") === "10").filter((e) => e.tagName !== "text"));
      mark("g_biblio", until(R(150, 10, 46), () => false).filter((e) => e.tagName === "rect"));
      mark("g_banniere", all.filter((e) => (e.tagName === "path" && /^M36 14|^M50 29/.test(A(e, "d") || "")) || (e.tagName === "circle" && A(e, "cx") === "50" && A(e, "cy") === "36")));
      const em = R(78, 8, 64); if (em) { const s3 = [...em.parentNode.children], k = s3.indexOf(em); mark("g_embleme", [em, s3[k + 1], s3[k + 2]]); }
      mark("g_cheminee", all.filter((e) => e.tagName === "rect" && ((A(e, "x") === "150" && A(e, "y") === "60") || (A(e, "x") === "156" && A(e, "y") === "88") || (A(e, "x") === "146" && A(e, "y") === "54"))));
      [["g_bureau", "3.3"], ["g_comptoir", "5.1"], ["g_tonneau", "7"]].forEach(([n, d]) => { const g = grp(d); if (g) mark(n, [...g.children]); });
    }
    return M;
  }
  function ctm(el, svg) {
    // matrice cumulée des transform des ancêtres (élément exclu) jusqu'au <svg>
    let m = svg.createSVGMatrix();
    const chain = [];
    for (let p = el.parentNode; p && p !== svg; p = p.parentNode) chain.unshift(p);
    for (const p of chain) {
      const t = p.transform && p.transform.baseVal && p.transform.baseVal.consolidate();
      if (t) m = m.multiply(t.matrix);
    }
    return m;
  }
  function apply(str, room) {
    try {
      const doc = new DOMParser().parseFromString(str.replace("<svg ", '<svg xmlns="' + NS + '" xmlns:xlink="http://www.w3.org/1999/xlink" '), "image/svg+xml");
      const svg = doc.documentElement;
      if (!svg || svg.tagName !== "svg") return str;
      const M = marks(svg, room);
      let n = 0;
      for (const k in M) {
        const d = PX[k]; if (!d) continue;
        const els = M[k], first = els[0], par = first.parentNode;
        const im = doc.createElementNS(NS, "image");
        im.setAttribute("href", "data:image/png;base64," + d[0]);
        const L = LOC[k], bx = L || d.slice(1);
        im.setAttribute("x", bx[0]); im.setAttribute("y", bx[1]); im.setAttribute("width", bx[2]); im.setAttribute("height", bx[3]);
        im.setAttribute("preserveAspectRatio", "none"); im.setAttribute("style", "image-rendering:pixelated;image-rendering:crisp-edges");
        im.setAttribute("class", "fx9"); im.setAttribute("pointer-events", "none");
        const m = L ? svg.createSVGMatrix() : ctm(first, svg).inverse();
        if (!(m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1 && m.e === 0 && m.f === 0)) im.setAttribute("transform", "matrix(" + [m.a, m.b, m.c, m.d, m.e, m.f].map((v) => +v.toFixed(5)).join(" ") + ")");
        par.insertBefore(im, first);
        const sh = SHD[k];
        if (sh && typeof groundShadow === "function") {
          const g = doc.createElementNS(NS, "g");
          g.innerHTML = groundShadow(d[1] + d[3] * (sh.px || 0.5), d[2] + d[4], d[3], sh);
          par.insertBefore(g.firstChild, im);
        }
        els.forEach((e) => e.remove()); n++;
      }
      if (!n) return str;
      return new XMLSerializer().serializeToString(svg).replace(/ xmlns(:xlink)?="[^"]*"/g, "");
    } catch (e) { return str; }
  }
  if (typeof shopSVG === "function") { const _s = shopSVG; shopSVG = function () { return apply(_s.apply(this, arguments), "shop"); }; }
  if (typeof guildeSVG === "function") { const _g = guildeSVG; guildeSVG = function () { return apply(_g.apply(this, arguments), "guilde"); }; }
})();
