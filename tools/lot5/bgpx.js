/* Fond d'arène de combat en pixel art : le SVG vectoriel est rendu en basse résolution, palette réduite, affiché pixelisé */
(function () {
  if (typeof battleBg !== "function") return;
  const W = 390, H = 470, F = 2.6, CW = Math.round(W / F), CH = Math.round(H / F);
  let tok = 0;
  const _bb = battleBg;
  battleBg = function () {
    const s = _bb.apply(this, arguments), t = ++tok;
    setTimeout(() => pxBattle(s, t), 0);
    return s;
  };
  function defsFor(svg) {
    const seen = new Set(), out = [];
    const re = /(?:href="#|url\(#)([\w-]+)/g;
    const walk = (txt) => {
      let m; re.lastIndex = 0;
      const ids = [];
      while ((m = re.exec(txt))) ids.push(m[1]);
      for (const id of ids) {
        if (seen.has(id)) continue; seen.add(id);
        if (txt.indexOf('id="' + id + '"') >= 0) continue;
        const el = document.getElementById(id);
        if (!el) continue;
        const h = el.outerHTML; out.push(h); walk(h);
      }
    };
    walk(svg);
    return out.join("");
  }
  function pxBattle(svg, t) {
    try {
      const host = document.getElementById("b-bg");
      if (!host) return;
      let s = svg.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + W + '" height="' + H + '" ');
      const d = defsFor(svg);
      if (d) s = s.replace(/(<svg[^>]*>)/, "$1<defs>" + d + "</defs>");
      const url = URL.createObjectURL(new Blob([s], { type: "image/svg+xml" }));
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (t !== tok) return;
        const c = document.createElement("canvas"); c.width = CW; c.height = CH;
        const x = c.getContext("2d"); x.imageSmoothingEnabled = true;
        x.drawImage(img, 0, 0, CW, CH);
        const id = x.getImageData(0, 0, CW, CH), p = id.data;
        // palette réduite + léger tramage ordonné 2x2 pour l'effet pixel art
        const B = [[0, 2], [3, 1]];
        for (let yy = 0; yy < CH; yy++) for (let xx = 0; xx < CW; xx++) {
          const i = (yy * CW + xx) * 4, o = B[yy & 1][xx & 1] - 1.5;
          for (let k = 0; k < 3; k++) { const v = p[i + k] + o; p[i + k] = Math.max(0, Math.min(255, Math.round(v / 14) * 14)); }
          p[i + 3] = 255;
        }
        x.putImageData(id, 0, 0);
        c.className = "b-bgpx";
        c.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;image-rendering:pixelated;image-rendering:crisp-edges";
        const h2 = document.getElementById("b-bg");
        if (!h2) return;
        h2.innerHTML = ""; h2.appendChild(c);
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
    } catch (e) {}
  }
})();
