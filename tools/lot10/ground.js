/* Lot 10 : ancrage au sol — ombres de contact (occlusion) sous les meubles, objets et personnages */
(function () {
  const defs = document.getElementById("defs-in");
  if (defs && !document.getElementById("rs-ao")) defs.insertAdjacentHTML("beforeend",
    '<filter id="rs-ao" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="2.4"/></filter>' +
    '<filter id="rs-ao1" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="1.1"/></filter>');
  /* f : largeur de l'empreinte (fraction de la largeur du sprite), d : profondeur iso (fraction de l'empreinte), o : opacité, dy : décalage */
  const P = [
    [/^h_lit_hamac/, { f: 0.7, d: 0.42, o: 0.42 }],
    [/^h_lit_/, { f: 0.98, d: 0.5, o: 0.6 }],
    [/^h_meuble_(caisse|coffre|etabli|biblio|armure)/, { f: 0.96, d: 0.5, o: 0.58 }],
    [/^h_lumiere_(bougie|lanterne)/, { f: 0.62, d: 0.5, o: 0.55 }],
    [/^h_compagnon_(chat|renard|lapin|crapaud|escargot)/, { f: 0.78, d: 0.42, o: 0.5 }],
    [/^h_compagnon_hibou/, { f: 0.62, d: 0.45, o: 0.5 }],
    [/^h_plante_/, { f: 0.62, d: 0.5, o: 0.55 }],
    [/^(k_four_|k_plan_)/, { f: 0.96, d: 0.5, o: 0.55 }],
    [/^k_aide_/, { f: 0.7, d: 0.45, o: 0.5 }],
    [/^(l_chaudron|l_etabli)/, { f: 0.94, d: 0.5, o: 0.55 }],
    [/^l_biblio/, { f: 0.96, d: 0.5, o: 0.5 }],
    [/^(a_mannequin)/, { f: 0.6, d: 0.5, o: 0.55 }],
    [/^(a_rochers|a_presentoir)/, { f: 0.96, d: 0.5, o: 0.55 }],
    [/^(chest)$/, { f: 0.95, d: 0.5, o: 0.5 }],
    [/^(oak|pine|birch|willow)$/, { f: 0.62, d: 0.5, o: 0.5 }],
    [/^(dead|crystal)$/, { f: 0.5, d: 0.5, o: 0.5 }],
    [/^(f_bush|f_log|f_rock|g_rock)$/, { f: 0.95, d: 0.5, o: 0.5 }],
    [/^(g_stal)$/, { f: 0.75, d: 0.5, o: 0.5 }],
    [/^(g_exit)$/, { f: 0.5, d: 0.5, o: 0.45 }],
  ];
  const ADJ = { h_lit_baldaquin: [4, 6, 0.86] };
  const r1 = (v) => Math.round(v * 10) / 10;
  function foot(cx, by, w, f, d, dy) {
    const fw = w * f, fh = fw * d, hx = fw / 2;
    by += dy;
    return [[cx, by], [cx + hx, by - fh / 2], [cx, by - fh], [cx - hx, by - fh / 2]].map((p) => r1(p[0]) + "," + r1(p[1])).join(" ");
  }
  window.groundShadow = function (cx, by, w, opt) {
    const o = Object.assign({ f: 0.95, d: 0.5, o: 0.55, dy: 1 }, opt || {});
    /* 1) ombre portée douce, décalée vers l'avant-gauche ; 2) occlusion serrée au pied */
    return '<g class="mb-spr shd gshd" pointer-events="none">' +
      '<polygon points="' + foot(cx - w * 0.1, by, w, o.f * 1.4, o.d * 1.1, o.dy + 6) + '" fill="#000" opacity="' + Math.min(0.75, o.o * 1.1).toFixed(2) + '" filter="url(#rs-ao)"/>' +
      '<polygon points="' + foot(cx, by, w, o.f * 1.04, o.d, o.dy + 0.5) + '" fill="#000" opacity="' + Math.min(0.8, o.o * 1.1).toFixed(2) + '" filter="url(#rs-ao1)"/></g>';
  };
  if (typeof decoShadow === "function") {
    decoShadow = function (k) {
      const q = SPRB_P[k];
      if (!q) return "";
      const hit = P.find(([re]) => re.test(k));
      if (!hit) return "";
      let x = q[1], w = q[3], by = q[2] + q[4];
      const a = ADJ[k];
      if (a) { const cx0 = x + w / 2; w *= a[2]; x = cx0 - w / 2 + a[0]; by += a[1]; }
      return groundShadow(x + w / 2, by, w, hit[1]);
    };
  }
  /* arbres : précalculés au chargement → on ajoute l'ombre après coup */
  try { if (typeof TREES === "object") for (const k in TREES) { const sh = decoShadow(k); if (sh && TREES[k].indexOf("gshd") < 0) TREES[k] = TREES[k].replace('<use class="mb-spr"', sh + '<use class="mb-spr"'); } } catch (e) {}
  /* personnages : ombre plus marquée */
  const st = document.createElement("style");
  st.textContent = ".pshd{fill:#000;opacity:.38;filter:url(#rs-ao1);transform:scale(1.15,1.2);transform-box:fill-box;transform-origin:center}";
  document.head.appendChild(st);
})();
