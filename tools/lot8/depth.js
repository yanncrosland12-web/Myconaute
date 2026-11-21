/* 0.9.56 — Profondeur : qualité ★, réputation, commandes des villageois, traits de départ, défis du jour, carnet */
(function () {
  if (typeof S === "undefined" || typeof harvest !== "function") return;
  const W = window;

  /* ---------- Qualité en étoiles ---------- */
  W.qStarN = (it) => { const q = (it && it.q) || 1; return q < 0.75 ? 1 : q < 0.95 ? 2 : q < 1.12 ? 3 : q < 1.3 ? 4 : 5; };
  W.qStars = (it) => "★".repeat(qStarN(it));

  /* ---------- Traits aléatoires de départ ---------- */
  const RQ = [
    { id: "mainverte", n: "Main verte", d: "Récoltes +10 % de qualité" },
    { id: "bavard", n: "Bavard", d: "+1 client chaque jour" },
    { id: "leve", n: "Lève-tôt", d: "+1 énergie un jour sur trois" },
    { id: "econome", n: "Économe", d: "Commence avec +25 or" },
    { id: "charmeur", n: "Charmeur", d: "Réputation +1 chaque jour" },
    { id: "chanceux", n: "Chanceux", d: "Récompenses des défis ×1,5" }
  ];
  const RD = [
    { id: "distrait", n: "Distrait", d: "Récoltes −1 nuit de fraîcheur" },
    { id: "depensier", n: "Dépensier", d: "−3 or chaque matin" },
    { id: "somnambule", n: "Somnambule", d: "15 % de chances de −1 énergie au réveil" },
    { id: "rustre", n: "Rustre", d: "Réputation −1 chaque jour" },
    { id: "lent", n: "Lent", d: "1 client de moins chaque jour" },
    { id: "mefiant", n: "Méfiant", d: "Commandes des villageois payées −20 %" }
  ];
  const tq = (id) => S && S.rtr && S.rtr.q === id, td = (id) => S && S.rtr && S.rtr.d === id;
  W.rtrHas = (id) => tq(id) || td(id);
  function ensure() {
    if (!S) return;
    if (S.rep == null) S.rep = 30;
    if (!S.orders) S.orders = [];
    if (!S.rtr) S.rtr = { q: pick(RQ).id, d: pick(RD).id };
  }
  const RQI = Object.fromEntries(RQ.map((t) => [t.id, t])), RDI = Object.fromEntries(RD.map((t) => [t.id, t]));

  /* ---------- Réputation (0–100) ---------- */
  const clampR = (v) => Math.max(0, Math.min(100, Math.round(v)));
  W.repAdd = (d) => { ensure(); S.rep = clampR(S.rep + d); };
  W.repTier = () => { const r = (S && S.rep) || 30; return r < 15 ? ["Mal vue", -1] : r < 40 ? ["Discrète", 0] : r < 60 ? ["Appréciée", 1] : r < 80 ? ["Réputée", 2] : ["Célèbre", 3]; };
  const _gc = genCustomers;
  genCustomers = function (extra = 0) {
    ensure();
    let e = extra + repTier()[1] + (tq("bavard") ? 1 : 0) - (td("lent") ? 1 : 0);
    return _gc.call(this, e);
  };
  const _sm = sellMult;
  sellMult = function (sp) { const r = (S && S.rep != null) ? S.rep : 30; return _sm.apply(this, arguments) * (1 + (r - 30) / 700); };

  /* ---------- Défis du jour ---------- */
  function newChal() {
    const day = S.day, types = ["sell", "harvest", "earn", "plant"];
    const t = pick(types), sp = pick(S.pool.length ? S.pool : ["pleurote"]);
    let c;
    if (t === "sell") c = { t, sp, n: ri(2, 3), lbl: (n) => "Vendre " + n + " × " + SP[sp].n };
    else if (t === "harvest") c = { t, n: ri(3, 5), lbl: (n) => "Récolter " + n + " champignons" };
    else if (t === "earn") c = { t, n: 30 + day * 6, lbl: (n) => "Gagner " + n + " or à la boutique" };
    else c = { t, n: ri(2, 4), lbl: (n) => "Planter " + n + " spores" };
    const rw = rnd() < 0.5 ? { g: Math.round((12 + day * 3) * (tq("chanceux") ? 1.5 : 1)) } : { e: Math.round((2 + Math.floor(day / 6)) * (tq("chanceux") ? 1.5 : 1)) };
    S.chal = { t: c.t, sp: c.sp || null, n: c.n, p: 0, done: false, txt: c.lbl(c.n), rw };
  }
  const rwTxt = (rw) => rw.g ? rw.g + " or" : rw.e + " éclats";
  function chalProg(t, k, sp) {
    const c = S && S.chal;
    if (!c || c.done || c.t !== t) return;
    if (t === "sell" && sp !== c.sp) return;
    c.p += k;
    if (c.p >= c.n) {
      c.done = true; c.p = c.n;
      if (c.rw.g) S.gold += c.rw.g; else gainEclats(c.rw.e);
      repAdd(2);
      setTimeout(() => toast("🎯 Défi réussi : " + c.txt + " → +" + rwTxt(c.rw) + " !"), 300);
    }
  }

  /* ---------- Commandes des villageois ---------- */
  const NPCN = () => (typeof FOLK !== "undefined" ? FOLK.map((f) => f.n) : ["Margot", "Gaspard", "Ysolde"]);
  function newOrder() {
    const cand = S.pool.filter((s) => SP[s] && !SP[s].only);
    if (!cand.length) return null;
    const sp = pick(cand), n = ri(2, 4), st = Math.min(4, 2 + Math.floor(S.day / 8) + (rnd() < 0.3 ? 1 : 0));
    let rw = Math.round(unitPrice(sp, 1) * n * (1.6 + 0.15 * (st - 2)));
    if (td("mefiant")) rw = Math.round(rw * 0.8);
    return { who: pick(NPCN()), sp, n, st, due: S.day + ri(3, 5), rw };
  }
  const ordTxt = (o) => o.who + " veut " + o.n + " × " + SP[o.sp].n + " " + "★".repeat(o.st) + "+ avant le jour " + o.due + " → " + o.rw + " or";
  W.nightExtras = function () {
    const out = [];
    try {
      ensure();
      // livraisons
      for (const o of S.orders.slice()) {
        const ok = S.bag.filter((i) => i.sp === o.sp && qStarN(i) >= o.st).sort((a, b) => itemPrice(a) - itemPrice(b));
        if (ok.length >= o.n) {
          ok.slice(0, o.n).forEach((i) => S.bag.splice(S.bag.indexOf(i), 1));
          S.gold += o.rw; repAdd(5);
          S.orders.splice(S.orders.indexOf(o), 1);
          out.push({ t: "📜 Commande livrée à " + o.who + " (" + o.n + " × " + SP[o.sp].n + ") : +" + o.rw + " or, réputation +5.", k: "gold" });
        } else if (S.day >= o.due) {
          S.orders.splice(S.orders.indexOf(o), 1); repAdd(-6);
          out.push({ t: "📜 " + o.who + " n'a pas reçu ses " + SP[o.sp].n + " à temps. Réputation −6.", k: "bad" });
        }
      }
      // réputation quotidienne
      if (tq("charmeur")) repAdd(1);
      if (td("rustre")) repAdd(-1);
      if (S.chal && !S.chal.done) repAdd(-1);
    } catch (e) { console.error(e); }
    return out;
  };

  /* ---------- Matin ---------- */
  const say = (t) => { S.log = (S.log ? S.log + " " : "") + t; };
  const _sd = startDay;
  startDay = function (first) {
    ensure();
    if (first && tq("econome")) S.gold += 25;
    const r = _sd.apply(this, arguments);
    try {
      if (S.phase === "day") {
        if (first) {
          say("<br>Tes traits : <b>" + RQI[S.rtr.q].n + "</b> (" + RQI[S.rtr.q].d.toLowerCase() + ") et <b>" + RDI[S.rtr.d].n + "</b> (" + RDI[S.rtr.d].d.toLowerCase() + "). Détails dans ton carnet 🎯.");
        } else {
          if (tq("leve") && S.day % 3 === 0) { S.energy++; say("Lève-tôt : <b>+1 énergie</b>."); }
          if (td("somnambule") && rnd() < 0.15 && S.energy > 0) { S.energy--; say("Tu as erré toute la nuit : <b>−1 énergie</b>."); }
          if (td("depensier") && S.gold >= 3) { S.gold -= 3; say("Dépensier : <b>−3 or</b> partis en friandises."); }
        }
        newChal();
        if (!first && S.orders.length < 2 && rnd() < 0.45) {
          const o = newOrder();
          if (o) { S.orders.push(o); say("📜 Nouvelle commande : " + ordTxt(o) + "."); }
        }
        save(); render();
      }
    } catch (e) { console.error(e); }
    return r;
  };

  /* ---------- Hooks d'actions ---------- */
  const _hv = harvest;
  harvest = function (r, c, quiet) {
    const it = _hv.apply(this, arguments);
    if (it) {
      if (tq("mainverte")) it.q *= 1.1;
      if (td("distrait")) it.f = Math.max(1, (it.f || 1) - 1);
      chalProg("harvest", 1);
    }
    return it;
  };
  const _pl = plant;
  plant = function (r, c, sp) {
    const had = !!(S.cells[r] && S.cells[r][c] && S.cells[r][c].p);
    const res = _pl.apply(this, arguments);
    if (!had && S.cells[r][c].p) chalProg("plant", 1);
    return res;
  };
  if (typeof finishSale === "function") {
    const _fs = finishSale;
    finishSale = function (b, price, n) {
      let hiq = false;
      try { if (!b.dish) hiq = sellOrder(b.want).slice(0, n).some((i) => qStarN(i) >= 4); } catch (e) {}
      const p = _fs.apply(this, arguments);
      repAdd(1 + (hiq ? 1 : 0));
      if (!b.dish) chalProg("sell", n, b.want);
      chalProg("earn", p);
      return p;
    };
  }
  if (typeof negoRefuse === "function") {
    const _nr = negoRefuse;
    negoRefuse = function () { repAdd(-2); return _nr.apply(this, arguments); };
  }

  /* ---------- HUD + carnet ---------- */
  { const st = document.createElement("style"); st.textContent = "html body .hud-row2:has(.dp-chip){grid-template-columns:auto auto minmax(0,1fr) auto auto!important;gap:6px!important}html body .dp-chip{margin:0!important}"; document.head.appendChild(st); }
  const _rh = renderHud;
  renderHud = function () {
    const r = _rh.apply(this, arguments);
    try {
      ensure();
      const row = document.querySelector("#hud .hud-row2");
      if (row && !row.querySelector(".dp-chip")) {
        const b = document.createElement("button");
        b.className = "wxc r2 dp-chip"; b.setAttribute("data-act", "dpInfo"); b.setAttribute("aria-label", "Carnet : défi, réputation, commandes");
        const w = row.querySelector(".wxc.r2");
        row.insertBefore(b, w ? w.nextSibling : row.firstChild);
      }
      const b = row && row.querySelector(".dp-chip");
      if (b) {
        const c = S.chal, d = c ? (c.done ? "✔" : c.p + "/" + c.n) : "";
        b.style.cssText = "flex:0 0 auto;padding:0 6px;min-width:0";
        b.innerHTML = '<span style="font-size:11px;font-weight:800;white-space:nowrap">🎯' + (c && c.done ? "✔" : "") + "⭐" + S.rep + (S.orders.length ? "📜" : "") + "</span>";
      }
    } catch (e) {}
    return r;
  };
  function carnet() {
    ensure();
    const [tn] = repTier(), c = S.chal, q = RQI[S.rtr.q], d = RDI[S.rtr.d];
    let h = '<p class="label">Carnet du myconaute</p><h2 style="margin:4px 0 10px">Jour ' + S.day + "</h2>";
    h += '<h3 class="bag-h">🎯 Défi du jour</h3><p>' + (c ? c.txt + " — <b>" + (c.done ? "réussi !" : c.p + "/" + c.n) + "</b><br><small>Récompense : " + rwTxt(c.rw) + " et réputation +2. Raté : réputation −1.</small>" : "Aucun défi aujourd'hui.") + "</p>";
    h += '<h3 class="bag-h">⭐ Réputation : ' + S.rep + "/100 (" + tn + ")</h3>" +
      '<div class="ivbar" style="height:10px;margin:4px 0"><i style="width:' + S.rep + '%;background:#f2c14b"></i></div>' +
      "<p><small>Ventes réussies : +1 (+2 si ★★★★ ou mieux) · client vexé : −2 · commande livrée : +5, ratée : −6. Plus elle est haute, plus il y a de clients et meilleurs sont les prix.</small></p>";
    h += '<h3 class="bag-h">📜 Commandes</h3>' + (S.orders.length ? "<ul style='padding-left:18px;margin:4px 0'>" + S.orders.map((o) => "<li>" + ordTxt(o) + "</li>").join("") + "</ul><p><small>Livrées automatiquement la nuit si ta besace contient les champignons demandés, de la qualité requise.</small></p>" : "<p>Aucune commande en cours. Les villageois en passent parfois le matin.</p>");
    h += '<h3 class="bag-h">🎭 Tes traits</h3><p><b>' + q.n + "</b> : " + q.d + "<br><b>" + d.n + "</b> : " + d.d + "</p>";
    h += '<h3 class="bag-h">★ Qualité des récoltes</h3><p><small>De ★ à ★★★★★ selon le sol idéal, les voisins (girolles, roi fongique…), les limaces et tes traits. Le prix suit la qualité.</small></p>';
    h += '<button class="btn btn-primary" style="width:100%;margin-top:14px" data-act="closeModal">Fermer</button>';
    openModal(h);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-act='dpInfo']");
    if (!b) return;
    e.stopPropagation(); e.preventDefault();
    carnet();
  }, true);
})();
