/* 0.9.57 — Culture avancée : humidité par case, température, compost & engrais, maladies, météo plus marquée */
(function () {
  if (typeof S === "undefined" || typeof onCell !== "function") return;
  const W = window;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const HB = { humus: [60, 85], mousse: [45, 70], souche: [25, 55] };
  const subOf = (sp) => (SP[sp] && SP[sp].sub) || "mousse";
  W.humBand = (sp) => HB[subOf(sp)] || [40, 70];
  const SUBH = { humus: 62, mousse: 50, souche: 38 };

  /* ---------- Météo : nouveaux temps marqués ---------- */
  Object.assign(WX, {
    deluge: { n: "Déluge", ic: "🌊", d: "Des trombes d'eau : l'humidité de la cave grimpe fort cette nuit (+25 %), un client de moins, mais ceux qui viennent paient +10 %." },
    gel: { n: "Gel", ic: "🥶", d: "Il gèle : 2 pousses ralentissent cette nuit, la cave s'assèche un peu. Les limaces restent cachées." },
    aurore: { n: "Aurore boréale", ic: "🌌", d: "Le ciel danse : Brillants ×2 aujourd'hui, et +3 éclats cette nuit." }
  });
  WX_W.printemps.deluge = 1; WX_W.automne.deluge = 2; WX_W.automne.gel = 1; WX_W.hiver.gel = 3; WX_W.hiver.aurore = 1; WX_W.ete.aurore = 0.5;
  if (typeof seasonCustDelta === "function") { const f = seasonCustDelta; seasonCustDelta = function () { return f() - (wx() === "deluge" ? 1 : 0); }; }
  if (typeof seasonSell === "function") { const f = seasonSell; seasonSell = function () { return f() + (wx() === "deluge" ? 0.1 : 0); }; }
  if (typeof seasonShiny === "function") { const f = seasonShiny; seasonShiny = function () { return f() * (wx() === "aurore" ? 2 : 1); }; }
  if (typeof seasonSlug === "function") { const f = seasonSlug; seasonSlug = function () { return wx() === "gel" ? 0 : f() * (wx() === "deluge" ? 1.3 : 1); }; }

  /* ---------- État ---------- */
  function ensure() {
    if (!S || !S.cells) return;
    if (S.compost == null) S.compost = 0;
    if (S.temp == null) S.temp = 14;
    for (const o of cellsList()) if (o.cell.hum == null) o.cell.hum = SUBH[o.cell.sub] || 50;
  }
  const baseT = { printemps: 13, ete: 22, automne: 11, hiver: 4 };
  const wxT = { canicule: 8, neige: -4, gel: -6, deluge: -2, orage: 1, aurore: -3 };
  const wxH = { pluie: 12, deluge: 25, orage: 10, canicule: -18, gel: -8, vent: -8, neige: -3 };

  /* ---------- Nuit ---------- */
  function cultureNight() {
    const out = [];
    ensure();
    const w = wx();
    // humidité
    for (const o of cellsList()) {
      let h = o.cell.hum;
      h += (50 - h) * 0.2 + (wxH[w] || 0) + ((SUBH[o.cell.sub] || 50) - 50) * 0.15 + (rnd() * 6 - 3);
      if (nbrs(o.r, o.c).some((n) => n.cell.p && (n.cell.p.sp === "hygrophore" || n.cell.p.sp === "vase"))) h += 8;
      o.cell.hum = Math.round(clamp(h, 5, 95));
    }
    // maladies
    let died = 0, newSick = 0;
    for (const o of cellsList()) {
      const p = o.cell.p;
      if (!p || isRipe(p)) continue;
      if (p.sick) {
        p.sick++;
        if (p.sick >= 4) { o.cell.p = null; died++; S.compost += 2; continue; }
        if (rnd() < 0.25) { const n = pick(nbrs(o.r, o.c).filter((n2) => n2.cell.p && !n2.cell.p.sick && !isRipe(n2.cell.p))); if (n) { n.cell.p.sick = 1; newSick++; } }
      } else {
        const risk = 0.025 + (o.cell.hum > 82 ? 0.07 : 0) + (S.temp > 20 ? 0.04 : 0) + (S.temp < 5 ? 0.03 : 0);
        if (rnd() < risk) { p.sick = 1; newSick++; }
      }
    }
    if (newSick) out.push({ t: "🦠 Une maladie touche " + newSick + " " + plural(newSick, "pousse") + " (mildiou). Soigne-les vite, ou elles dépériront.", k: "bad" });
    if (died) out.push({ t: "🥀 " + died + " " + plural(died, "pousse") + " malade" + (died > 1 ? "s ont" : " a") + " dépéri. (+" + 2 * died + " compost)", k: "bad" });
    // météo marquée
    if (w === "gel") {
      const g = shuffle(growing().filter((o) => o.cell.p.g > 0)).slice(0, 2);
      g.forEach((o) => o.cell.p.g--);
      if (g.length) out.push({ t: "🥶 Le gel a ralenti " + g.length + " " + plural(g.length, "pousse") + ".", k: "bad" });
    }
    if (w === "aurore") { gainEclats(3); out.push({ t: "🌌 L'aurore boréale a laissé des reflets dans la cave : +3 éclats.", k: "good" }); }
    // température du lendemain
    const nd = (S.day || 1) + 1, sn = seasonOf(nd);
    S.temp = Math.round((baseT[sn] || 12) + rnd() * 6 - 3);
    // compost : 1 point par nuit si tu as une compostière, sinon rien de gratuit
    if (S.perks && S.perks.compost) S.compost += 1;
    return out;
  }
  const _ne = W.nightExtras;
  W.nightExtras = function () {
    let out = [];
    try { out = (typeof _ne === "function" ? _ne() : []) || []; } catch (e) { console.error(e); }
    try { out = out.concat(cultureNight()); } catch (e) { console.error(e); }
    return out;
  };
  // température du jour : décalage selon la météo tirée le matin
  const _sd = startDay;
  startDay = function (first) {
    ensure();
    const r = _sd.apply(this, arguments);
    try { if (S && S.phase === "day" && !first) { S.temp += (wxT[wx()] || 0); save(); } } catch (e) {}
    return r;
  };

  /* ---------- Compost : récoltes pourries, pousses arrachées, limaces ---------- */
  const _sl = sleep;
  sleep = function () {
    const pre = S && S.bag ? S.bag.filter((i) => i.f <= 1 && i.sp !== "polypore") : [];
    const r = _sl.apply(this, arguments);
    try { const gone = pre.filter((i) => !S.bag.includes(i)).length; if (gone) { S.compost = (S.compost || 0) + Math.min(3, gone); save(); } } catch (e) {}
    return r;
  };
  const _up = uproot;
  uproot = function (r, c) { ensure(); if (S.cells[r][c].p) S.compost += 1; return _up.apply(this, arguments); };
  const _cl = clean;
  clean = function (r, c) { const had = S.cells[r][c].p && S.cells[r][c].p.slug; const x = _cl.apply(this, arguments); if (had && !S.cells[r][c].p.slug) { ensure(); S.compost += 1; } return x; };

  /* ---------- Qualité : humidité, maladie, engrais ---------- */
  const _hv = harvest;
  harvest = function (r, c, quiet) {
    const cell = S.cells[r] && S.cells[r][c], p = cell && cell.p, hum = cell && cell.hum;
    const it = _hv.apply(this, arguments);
    if (it && p) {
      const [a, b] = humBand(p.sp), h = hum == null ? 50 : hum;
      if (h >= a && h <= b) it.q *= 1.1; else if (h < a - 20 || h > b + 20) it.q *= 0.85;
      if (p.sick) it.q *= 0.6;
      if (p.fert) it.q *= 1.1;
    }
    return it;
  };

  /* ---------- Fiche de parcelle : jauges + actions ---------- */
  const humTxt = (h, sp) => { const [a, b] = humBand(sp); return h < a ? "trop sec" : h > b ? "trop humide" : "idéal"; };
  function panel(r, c) {
    const cell = S.cells[r][c], p = cell.p;
    if (!p) return "";
    const [a, b] = humBand(p.sp), h = cell.hum, used = cell.wd === S.day;
    const col = h < a || h > b ? "#e08a3a" : "#5ec8e8";
    let x = '<div class="cu-box" style="margin:10px 0;padding:10px;border:2px solid var(--line);background:rgba(0,0,0,.18)">' +
      '<div style="display:flex;justify-content:space-between;font-size:13px"><b>💧 Humidité ' + h + " %</b><span>idéal " + a + "–" + b + " % · <b>" + humTxt(h, p.sp) + "</b></span></div>" +
      '<div style="position:relative;height:10px;margin:6px 0;border:2px solid var(--line);background:#2a1c12"><i style="position:absolute;left:' + a + "%;width:" + (b - a) + '%;top:0;bottom:0;background:rgba(94,200,232,.25)"></i><i style="position:absolute;left:0;top:0;bottom:0;width:' + h + "%;background:" + col + '"></i></div>' +
      '<div style="font-size:13px">🌡️ Cave : ' + S.temp + " °C" + (p.sick ? ' · <b style="color:#e06a5a">🦠 Malade (' + p.sick + "/4 nuits)</b>" : "") + (p.fert ? " · 🌿 Engraissée" : "") + " · ♻️ Compost : " + (S.compost || 0) + "</div>" +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">' +
      '<button class="btn btn-ghost" data-act="cu-water" ' + (used ? "disabled" : "") + ">💧 Arroser (+30 %)</button>" +
      '<button class="btn btn-ghost" data-act="cu-air" ' + (used ? "disabled" : "") + ">🌬️ Aérer (−25 %)</button>" +
      '<button class="btn btn-ghost" data-act="cu-fert" ' + ((S.compost || 0) < 3 || p.fert ? "disabled" : "") + ">🌿 Engrais · 3 compost</button>" +
      (p.sick ? '<button class="btn btn-primary" data-act="cu-cure" ' + (S.energy < 1 || S.gold < 4 ? "disabled" : "") + ">💊 Soigner · 1 énergie + 4 or</button>" : '<span style="font-size:12px;opacity:.75;align-self:center">Arroser ou aérer : une fois par jour.</span>') +
      "</div></div>";
    return x;
  }
  const _oc = onCell;
  onCell = function (r, c) {
    ensure();
    const res = _oc.apply(this, arguments);
    try {
      const sh = document.getElementById("sheet"), inn = document.getElementById("sheet-in"), p = S.cells[r][c].p;
      if (p && sh && !sh.hidden && inn && !inn.querySelector(".cu-box") && !inn.querySelector(".plist")) {
        const g = inn.querySelector(".info-grid");
        const d = document.createElement("div"); d.innerHTML = panel(r, c);
        if (g) g.after(d.firstChild); else inn.appendChild(d.firstChild);
      }
    } catch (e) { console.error(e); }
    return res;
  };
  function act(a) {
    if (!sel) return;
    const { r, c } = sel, cell = S.cells[r][c], p = cell.p;
    if (!p) return;
    if (a === "water" || a === "air") {
      if (cell.wd === S.day) return toast("Déjà fait aujourd'hui pour cette parcelle.");
      cell.hum = clamp(cell.hum + (a === "water" ? 30 : -25), 5, 95); cell.wd = S.day;
      S.log = a === "water" ? "Tu arroses la parcelle : 💧 " + cell.hum + " %." : "Tu aères la parcelle : 💧 " + cell.hum + " %.";
    } else if (a === "fert") {
      if ((S.compost || 0) < 3 || p.fert) return;
      S.compost -= 3; p.fert = true; growOne(p);
      S.log = "🌿 Engrais déposé : la pousse gagne une nuit et sa qualité sera meilleure.";
    } else if (a === "cure") {
      if (S.energy < 1) return toast("Il faut 1 énergie.");
      if (S.gold < 4) return toast("Il faut 4 or de soufre.");
      S.energy--; S.gold -= 4; p.sick = 0;
      S.log = "💊 Pousse soignée.";
    }
    save(); render();
    closeSheet(); onCell(r, c);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-act^='cu-']");
    if (!b || b.disabled) return;
    e.stopPropagation(); e.preventDefault();
    act(b.getAttribute("data-act").slice(3));
  }, true);

  /* ---------- Carnet : section culture ---------- */
  const _om = openModal;
  openModal = function (html) {
    try {
      if (typeof html === "string" && html.indexOf("Carnet du myconaute") >= 0) {
        ensure();
        const sick = cellsList().filter((o) => o.cell.p && o.cell.p.sick).length, w = WX[wx()] || { ic: "", n: "" };
        const sec = '<h3 class="bag-h">🌦️ Cave et météo</h3><p>' + w.ic + " " + w.n + " · 🌡️ " + S.temp + " °C · ♻️ " + (S.compost || 0) + " compost" + (sick ? ' · <b style="color:#e06a5a">🦠 ' + sick + " " + plural(sick, "pousse") + " malade" + (sick > 1 ? "s" : "") + "</b>" : "") +
          "<br><small>Chaque espèce aime une humidité (humus : humide, mousse : moyenne, souche : sèche). Dans la bonne zone : qualité +10 %. Arrose ou aère depuis la fiche d'une pousse. Humidité forte + chaleur = mildiou. Le compost vient des récoltes pourries, des pousses arrachées et des limaces chassées.</small></p>";
        html = html.replace('<h3 class="bag-h">🎭 Tes traits</h3>', sec + '<h3 class="bag-h">🎭 Tes traits</h3>');
      }
    } catch (e) {}
    return _om.call(this, html);
  };
})();
