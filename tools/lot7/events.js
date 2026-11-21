/* 0.9.55 — plus d'événements : bonus de nuit (en plus de l'événement habituel), cadeaux du réveil, nouveaux événements du jour */
(function () {
  if (typeof S === "undefined" || typeof DAY_EVENTS === "undefined") return;
  const cheapSp = () => {
    const c = S.pool.filter((s) => SP[s] && SP[s].cost <= 8 && !SP[s].only);
    return pick(c.length ? c : ["pleurote"]);
  };
  const bagOk = () => typeof bagFree !== "function" || bagFree() > 0;
  const say = (t) => { S.log = (S.log ? S.log + " " : "") + t; };

  /* ---------- Nuit : second événement, surtout des bonus ---------- */
  const NIGHT_EXTRA = [
    { id: "rosee", w: () => growing().length ? 10 : 0, run: () => {
      const t = shuffle(growing()).slice(0, 2); let k = 0;
      t.forEach((o) => { if (growOne(o.cell.p)) k++; });
      return { t: "Une rosée scintillante perle du plafond : " + (k || 1) + " " + plural(k || 1, "pousse") + " " + ((k || 1) > 1 ? "gagnent" : "gagne") + " une nuit.", k: "good" };
    } },
    { id: "pieces", w: () => 9, run: () => {
      const g = ri(5, 14); S.gold += g;
      return { t: "En dormant, tu as roulé sur une latte branlante : dessous, une bourse oubliée. +" + g + " or.", k: "good" };
    } },
    { id: "reve", w: () => 7, run: () => {
      S.starNext = Math.max(S.starNext || 0, 2);
      return { t: "Rêve prémonitoire : tu vois des champignons qui brillent. Demain, les Brillants seront deux fois plus fréquents.", k: "good" };
    } },
    { id: "luciole_reine", w: () => 6, run: () => {
      S.buffs.push({ k: "luciole", d: 2, e: 1 }); gainEclats(1);
      return { t: "Une reine luciole s'est posée sur ton oreiller. Tu dors comme un loir : +1 énergie demain et +1 éclat.", k: "good" };
    } },
    { id: "vent_tiede", w: () => S.bag.length ? 7 : 0, run: () => {
      S.bag.forEach((i) => { i.f = (i.f || 1) + 1; });
      return { t: "Un vent tiède et sec a soufflé dans la cave : toute ta besace gagne 1 nuit de fraîcheur.", k: "good" };
    } },
    { id: "lune_rousse", w: () => 6, run: () => {
      S.nPrice = (S.nPrice || 0) + 0.1;
      return { t: "Lune rousse : les villageois sont d'humeur dépensière. Demain, tes ventes +10 %.", k: "good" };
    } },
    { id: "colis", w: () => bagOk() ? 6 : 0, run: () => {
      const sp = cheapSp(); giveItem(sp);
      return { t: "Tante Berthe a déposé un colis devant la porte : une " + SP[sp].n + " bien fraîche rejoint ta besace.", k: "good" };
    } },
    { id: "geodes", w: () => 5, run: () => {
      gainEclats(3);
      return { t: "Un éboulement a révélé des géodes dans le mur de la cave : +3 éclats.", k: "good" };
    } },
    { id: "fourmis", w: () => growing().some((o) => o.cell.p.g > 0) ? 5 : 0, run: () => {
      const o = pick(growing().filter((o2) => o2.cell.p.g > 0)); o.cell.p.g--;
      return { t: "Des fourmis ont creusé sous ta " + SP[o.cell.p.sp].n + " : elle perd une nuit de pousse.", k: "bad" };
    } },
    { id: "moisissure", w: () => S.bag.some((i) => (i.f || 0) > 1) ? 5 : 0, run: () => {
      const it = pick(S.bag.filter((i) => (i.f || 0) > 1)); it.f--;
      return { t: "Une moisissure verte a effleuré ta " + SP[it.sp].n + " : elle perd 1 nuit de fraîcheur.", k: "bad" };
    } },
    { id: "chat_noir", w: () => 4, run: () => {
      S.ivresse = (S.ivresse || 0) + 1;
      return { t: "Un chat noir aux yeux luisants a traversé tes rêves. Tu te réveilles un peu étourdi (+1 ivresse).", k: "iv" };
    } },
    { id: "chouette_postiere", w: () => 4, run: () => {
      S.extraCust = (S.extraCust || 0) + 1; S.gold += 3;
      return { t: "Une chouette postière t'apporte une commande et un pourboire : +3 or, et 1 client de plus demain.", k: "good" };
    } }
  ];
  window.nightBonus = function () {
    try {
      if (rnd() > 0.45) return null;
      const L = NIGHT_EXTRA.map((e) => [e, Math.max(0, e.w())]), tot = L.reduce((a, e) => a + e[1], 0);
      if (!tot) return null;
      let x = rnd() * tot;
      for (const [e, w] of L) { if (x < w) return e.run(); x -= w; }
    } catch (er) { console.error(er); }
    return null;
  };

  /* ---------- Réveil : petit cadeau automatique ---------- */
  const GIFTS = [
    { w: () => 10, run: () => { S.energy++; return "☕ Café de l'aube : tu te sens d'attaque, <b>+1 énergie</b>."; } },
    { w: () => 9, run: () => { const g = ri(3, 9); S.gold += g; return "🪙 Une pièce brille dans l'escalier : <b>+" + g + " or</b>."; } },
    { w: () => growing().length ? 8 : 0, run: () => { const o = pick(growing()); growOne(o.cell.p); return "🌱 En te levant, tu arroses ta " + SP[o.cell.p.sp].n + " : elle gagne <b>une nuit</b>."; } },
    { w: () => 7, run: () => { S.todayPrice += 0.1; return "☀️ Beau temps sur le village : <b>ventes +10 %</b> aujourd'hui."; } },
    { w: () => 6, run: () => { gainEclats(2); return "✨ Des éclats de lumière traînent sur ton oreiller : <b>+2 éclats</b>."; } },
    { w: () => 5, run: () => { DF().atk = (DF().atk || 0) + 1; return "💪 Réveil en pleine forme : <b>+1 dégât</b> en combat aujourd'hui."; } },
    { w: () => (S.ivresse || 0) > 0 ? 5 : 0, run: () => { S.ivresse = Math.max(0, S.ivresse - 2); return "💧 Un grand verre d'eau fraîche : <b>−2 ivresse</b>."; } }
  ];
  function morningGift() {
    try {
      if (S.nPrice) { S.todayPrice += S.nPrice; S.nPrice = 0; }
      if (S.energy <= 0 && S.transe) return;
      if (rnd() > 0.4) return;
      const L = GIFTS.map((g) => [g, Math.max(0, g.w())]), tot = L.reduce((a, g) => a + g[1], 0);
      let x = rnd() * tot;
      for (const [g, w] of L) { if (x < w) { say(g.run()); break; } x -= w; }
    } catch (er) { console.error(er); }
  }
  const _sd = startDay;
  startDay = function (first) {
    const r = _sd.apply(this, arguments);
    if (!first && S && S.phase === "day") { morningGift(); save(); render(); }
    return r;
  };

  /* ---------- Nouveaux événements du jour (à choix) ---------- */
  DAY_EVENTS.push(
    { id: "puits", w: () => S.gold >= 5 ? 7 : 0, t: "Le puits aux souhaits", d: "Au bout du chemin, un vieux puits couvert de mousse. On dit qu'il exauce ceux qui y jettent une pièce.",
      c: [
        { l: "Jeter 5 or", ok: () => S.gold >= 5, run: () => { S.gold -= 5; const r = rnd();
          if (r < 0.35) { S.energy++; S.starNext = Math.max(S.starNext || 0, 2); return "Le puits scintille ! <b>+1 énergie</b>, et demain les Brillants seront deux fois plus fréquents."; }
          if (r < 0.7) { gainEclats(3); return "Une bulle remonte et éclate en poussière d'étoile : <b>+3 éclats</b>."; }
          return "Plouf. Rien ne se passe… mais tu te sens un peu plus optimiste."; } },
        { l: "Passer mon chemin", run: () => "Tu gardes tes pièces. Le puits n'a pas l'air vexé." }
      ] },
    { id: "forgeron", w: () => S.gold >= 10 && S.day >= 2 ? 6 : 0, look: FOLK[1].look, t: "La meule de Gaspard", d: "Gaspard le forgeron passe avec sa meule : « Je t'affûte ton arme pour 10 pièces. Tu sentiras la différence ! »",
      c: [
        { l: "Affûter · 10 or", ok: () => S.gold >= 10, run: () => { S.gold -= 10; DF().atk = (DF().atk || 0) + 2; return "Le fil chante sous la meule. <b>+2 dégâts</b> en combat aujourd'hui."; } },
        { l: "Non merci", run: () => "« Tant pis pour toi ! » Il repart en faisant tinter ses outils." }
      ] },
    { id: "nain", w: () => (typeof canDig !== "function" || canDig()) && S.gold >= 25 ? 5 : 0, look: FOLK[9].look, t: "Fergus creuse", d: "Fergus le nain renifle les murs de ta cave : « Y a de la place, là-derrière. Pour 25 pièces, je te perce une galerie. »",
      c: [
        { l: "Creuser · 25 or", ok: () => S.gold >= 25, run: () => { S.gold -= 25; expand(); return "Trois coups de pioche plus tard, <b>ta cave s'agrandit</b> !"; } },
        { l: "Pas aujourd'hui", run: () => "Il hausse les épaules et retourne à sa mine." }
      ] },
    { id: "troupe", w: () => 6, look: EVLOOK.barde, t: "La troupe ambulante", d: "Une roulotte de saltimbanques s'arrête sur la place. Ils cherchent un volontaire pour leur numéro de jonglage aux champignons.",
      c: [
        { l: "Participer · 1 énergie", ok: () => S.energy >= 1, run: () => { S.energy--; const g = ri(10, 16); S.gold += g; S.todayPrice += 0.1; return "Le public adore ! <b>+" + g + " or</b> de chapeau, et tes ventes <b>+10 %</b> aujourd'hui."; } },
        { l: "Regarder le spectacle", run: () => { S.todayPrice += 0.05; return "Bonne humeur générale au village : ventes <b>+5 %</b> aujourd'hui."; } }
      ] },
    { id: "enfants", w: () => 6, look: EVLOOK.fillette, t: "La visite de l'école", d: "La maîtresse du village aimerait faire visiter ta cave à ses élèves. Ils promettent de ne rien toucher… promis.",
      c: [
        { l: "Faire la visite · 1 énergie", ok: () => S.energy >= 1, run: () => { S.energy--; gainEclats(2); S.extraCust = (S.extraCust || 0) + 2; return "Les enfants repartent émerveillés. <b>+2 éclats</b>, et leurs parents passeront demain (<b>2 clients de plus</b>)."; } },
        { l: "Refuser poliment", run: () => "Ils iront voir les moutons à la place." }
      ] },
    { id: "etoile", w: () => cellsList().some((o) => o.cell.p && !o.cell.p.cr) ? 5 : 0, t: "L'étoile tombée", d: "Un éclat d'étoile encore tiède est tombé dans ta cave cette nuit. Il pulse doucement.",
      c: [
        { l: "Le planter près d'un champignon", run: () => { const o = pick(cellsList().filter((o2) => o2.cell.p && !o2.cell.p.cr)); if (!o) { gainEclats(4); return "Faute de champignon à baigner de lumière, tu le brises en <b>4 éclats</b>."; } o.cell.p.cr = true; return "La lumière s'infiltre dans ta " + SP[o.cell.p.sp].n + " : elle sera <b>Brillante</b> à la récolte."; } },
        { l: "Le garder (éclats)", run: () => { gainEclats(4); return "Tu le brises en <b>4 éclats</b> scintillants."; } }
      ] },
    { id: "garde", w: () => S.day >= 3 ? 5 : 0, look: FOLK[5].look, t: "Le contrôle de Thibaut", d: "Thibaut le garde fronce les sourcils : « Contrôle des caves. Tout est en règle, j'espère ? »",
      c: [
        { l: "Lui offrir un petit pot · 5 or", ok: () => S.gold >= 5, run: () => { S.gold -= 5; S.extraCust = (S.extraCust || 0) + 1; return "« Tout est parfait ! » Il te recommandera à sa sœur : <b>1 client de plus</b> demain."; } },
        { l: "Le laisser inspecter", run: () => { if (rnd() < 0.6) return "Il ne trouve rien à redire et repart en sifflotant."; const g = Math.min(S.gold, 12); S.gold -= g; return "Une limace sur le comptoir… <b>−" + g + " or</b> d'amende."; } }
      ] },
    { id: "pelerin", w: () => S.bag.length && bagOk() ? 5 : 0, look: FOLK[0].look, t: "La pèlerine affamée", d: "Une pèlerine épuisée frappe à ta porte : « Auriez-vous de quoi manger ? Je n'ai pas grand-chose, mais je sais remercier. »",
      c: [
        { l: "Lui donner ta récolte la moins chère", run: () => { const it = S.bag.slice().sort((a, b) => itemPrice(a) - itemPrice(b))[0]; S.bag.splice(S.bag.indexOf(it), 1);
          if (rnd() < 0.5) { gainEclats(4); return "Elle te bénit : <b>+4 éclats</b>."; } S.buffs.push({ k: "pelerine", d: 2, e: 1 }); return "Elle t'apprend une prière du matin : <b>+1 énergie demain</b>."; } },
        { l: "Fermer la porte", run: () => "Tu l'entends s'éloigner sous la pluie." }
      ] }
  );
})();
