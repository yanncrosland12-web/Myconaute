/* Sauvegardes portables : export/import + synchro cloud (artefact) */
(function () {
  const PFX = "myconautes", STAMP = "myconautes-save-at";
  function snap() {
    const d = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(PFX) === 0 && k !== STAMP) d[k] = localStorage.getItem(k);
      }
    } catch (e) {}
    return d;
  }
  function restore(d) {
    try {
      for (const k in d) if (k.indexOf(PFX) === 0 && typeof d[k] === "string") localStorage.setItem(k, d[k]);
    } catch (e) { return false; }
    try { META = Object.assign(META, JSON.parse(d[KEY_META] || "{}")); } catch (e) {}
    return true;
  }
  const enc = (o) => "MYCO1:" + btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  function dec(t) {
    t = String(t || "").trim().replace(/\s+/g, "");
    if (t.indexOf("MYCO1:") === 0) t = t.slice(6);
    const o = JSON.parse(decodeURIComponent(escape(atob(t))));
    if (!o || typeof o.d !== "object") throw new Error("bad");
    return o;
  }
  function stamp() { try { localStorage.setItem(STAMP, String(Date.now())); } catch (e) {} }
  const localAt = () => { try { return +localStorage.getItem(STAMP) || 0; } catch (e) { return 0; } };

  /* --- synchro cloud (seulement dans l'artefact claude.ai) --- */
  let tCloud = null;
  const docRef = () => CAP.db && CAP.uid ? CAP.db.doc("data/users/" + CAP.uid + "/save") : null;
  function pushCloud() {
    clearTimeout(tCloud);
    tCloud = setTimeout(async () => {
      const r = docRef(); if (!r) return;
      try { await r.set({ at: localAt(), v: GAME_VERSION, blob: enc({ d: snap() }) }); } catch (e) {}
    }, 4000);
  }
  const _ls = lsSet;
  lsSet = function (k, v) { _ls(k, v); if (k === KEY_RUN || k === KEY_META) { stamp(); pushCloud(); } };
  async function pullCloud() {
    try {
      await capInit();
      const r = docRef(); if (!r) return;
      const s = await r.get();
      const c = s && s.exists ? s.data() : null;
      if (!c || !c.blob) { if (localAt() || lsGet(KEY_RUN)) { if (!localAt()) stamp(); pushCloud(); } return; }
      if ((+c.at || 0) > localAt()) {
        const o = dec(c.blob);
        restore(o.d); try { localStorage.setItem(STAMP, String(c.at)); } catch (e) {}
        if (screen === "title") renderTitle();
        toast("Sauvegarde récupérée (" + String(c.v || "").replace(/ test$/, "") + ")");
      } else if (localAt() > (+c.at || 0)) pushCloud();
    } catch (e) {}
  }

  /* --- écran Sauvegarde --- */
  function sheet() {
    const code = enc({ at: Date.now(), v: GAME_VERSION, d: snap() });
    const run = lsGet(KEY_RUN);
    const info = run && run.phase !== "over" ? "Partie en cours : jour " + run.day : "Pas de partie en cours";
    openSheet(sheetHead("Sauvegarde", info + " · progression (éclats, maison, succès) incluse.") +
      '<div class="stack">' +
      '<p class="small">Pour garder ta partie en passant à une nouvelle version : <b>Copier</b> ici, puis dans la nouvelle version <b>Sauvegarde › Coller</b>. Dans le jeu en ligne, la synchro est automatique.</p>' +
      '<button class="btn btn-primary" data-act="sv-copy">Copier ma sauvegarde</button>' +
      (window.claude ? '' : '<button class="btn btn-ghost" data-act="sv-file">Télécharger un fichier</button>') +
      '<textarea id="sv-in" rows="4" spellcheck="false" autocapitalize="off" placeholder="Colle ici un code de sauvegarde (MYCO1:…)" style="width:100%;box-sizing:border-box;font:12px monospace;padding:8px;border-radius:8px"></textarea>' +
      '<button class="btn btn-ghost" data-act="sv-load">Charger ce code</button>' +
      '<label class="btn btn-ghost" style="text-align:center">Charger un fichier<input id="sv-fi" type="file" accept=".txt,text/plain" hidden></label>' +
      '<textarea id="sv-out" readonly rows="2" style="width:100%;box-sizing:border-box;font:10px monospace;opacity:.6">' + code + '</textarea>' +
      "</div>");
    const fi = document.getElementById("sv-fi");
    if (fi) fi.onchange = () => { const f = fi.files && fi.files[0]; if (!f) return; f.text().then(load); };
  }
  function load(t) {
    let o;
    try { o = dec(t); } catch (e) { toast("Code de sauvegarde invalide."); return; }
    restore(o.d); stamp(); pushCloud();
    closeSheet(); S = null; screen = "title";
    try { showScreen && showScreen("title"); } catch (e) {}
    renderTitle();
    toast("Sauvegarde chargée !");
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-act^='sv-']");
    if (!b) return;
    const a = b.getAttribute("data-act");
    if (a === "sv-open") { e.stopPropagation(); sheet(); }
    else if (a === "sv-copy") {
      const o = document.getElementById("sv-out");
      const done = () => toast("Sauvegarde copiée. Colle-la dans la nouvelle version.");
      try { navigator.clipboard.writeText(o.value).then(done, () => { o.select(); document.execCommand("copy"); done(); }); }
      catch (er) { o.select(); try { document.execCommand("copy"); } catch (x) {} done(); }
    } else if (a === "sv-file") {
      const txt = document.getElementById("sv-out").value;
      const name = "myconautes-sauvegarde-" + new Date().toISOString().slice(0, 10) + ".txt";
      (async () => {
        try { const dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null; if (dl) { await dl.save({ filename: name, data: txt }); return; } } catch (er) {}
        const u = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
        const l = document.createElement("a"); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove();
        setTimeout(() => URL.revokeObjectURL(u), 2000);
      })();
    } else if (a === "sv-load") load(document.getElementById("sv-in").value);
  }, true);

  /* bouton sur l'écran titre */
  const ta = document.querySelector(".title-actions");
  if (ta && !ta.querySelector("[data-act='sv-open']")) {
    const b = document.createElement("button");
    b.className = "btn btn-ghost"; b.setAttribute("data-act", "sv-open"); b.textContent = "💾 Sauvegarde";
    const ref = ta.querySelector("[data-act='code']"); ta.insertBefore(b, ref || null);
  }
  if (!localAt() && lsGet(KEY_RUN)) stamp();
  pullCloud();
})();
