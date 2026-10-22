/* Page marque Sumart : catalogue filtrable, mur d'outils, plaquettes. */
(function () {
  const WB = window.WB, { $, $$, calm, fine, norm } = WB;
  const G = window.gsap, ST = window.ScrollTrigger;
  const ITEMS = WB.P.filter(p => p.b === "sumart");
  const FAMS = Object.entries(WB.FAMILLES);
  const FAM_IMG = { freinage: ["grok/sumart-freinage-16x9", 131], outillage: ["grok/sumart-outillage-16x9", 171], entretien: ["grok/sumart-gonflage-16x9", 114], roues: ["grok/sumart-roues-16x9", 146], accessoires: ["grok/sumart-accessoires-16x9", 149] };
  const state = { fam: "all", q: "", sort: "rank", max: 125, ref: null };

  /* ---------- héros : panneau + étiquettes suspendues ---------- */
  const bg = $(".br-bg");
  const pk = innerWidth < 700 && WB.IMAGES["grok/panneau-perfore-9x16"] ? "grok/panneau-perfore-9x16" : WB.IMAGES["grok/panneau-perfore-16x9"] ? "grok/panneau-perfore-16x9" : null;
  if (pk) bg.innerHTML = WB.picto.scene(pk, "Panneau perforé", "", { sizes: "100vw", eager: true });
  const wall = $(".br-wall"), WALL = [153, 166, 161, 113, 162, 158];
  wall.innerHTML = WALL.map(id => { const p = WB.byId(id); return `<article class="tag tag-mini" data-id="${id}"><i class="tag-pin" aria-hidden="true"></i>
    <div class="tag-swing"><i class="tag-cord" aria-hidden="true"></i><div class="tag-card"><span class="tag-hole" aria-hidden="true"></span>
      <button type="button" class="tag-media" data-quick="${id}" aria-label="Aperçu rapide : ${p.n}">${WB.picto.product(p, { sizes: "160px", eager: true })}</button>
      <h3 class="tag-name">${p.n}</h3><div class="tag-foot"><span class="price">${WB.fmt(p.p)}</span><button type="button" class="btn-add btn-add-sm" data-add="${id}" aria-label="Ajouter ${p.n}">+</button></div>
    </div></div></article>`; }).join("");
  const tags = $$(".tag", wall).map(el => ({ el, sw: el.querySelector(".tag-swing"), a: (Math.random() - .5) * 6, v: 0 }));
  if (!calm) {
    let running = false, lastX = 0, lastT = 0;
    const step = () => { let e = 0; tags.forEach(t => { t.v += -.045 * t.a - .07 * t.v; t.a += t.v; e += Math.abs(t.a) + Math.abs(t.v); t.sw.style.transform = `rotate(${t.a.toFixed(3)}deg)`; }); if (e > .02) requestAnimationFrame(step); else running = false; };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(step); } };
    wall.addEventListener("pointermove", e => { const now = performance.now(), vx = (e.clientX - lastX) / Math.max(8, now - lastT); lastX = e.clientX; lastT = now; const tg = e.target.closest(".tag"); if (!tg) return; const t = tags.find(x => x.el === tg); t.v += Math.max(-1.6, Math.min(1.6, vx * .9)); kick(); }, { passive: true });
    wall.addEventListener("pointerenter", () => WB.sound.ratchet());
    setTimeout(kick, 900);
  }

  /* ---------- familles ---------- */
  const count = f => ITEMS.filter(p => p.fam === f).length;
  $(".fams-grid").innerHTML = FAMS.map(([k, label]) => {
    const [img, pid] = FAM_IMG[k];
    const media = WB.IMAGES[img] ? WB.picto.scene(img, label, "", { sizes: "(max-width:700px) 80vw, 20vw" }) : `<div class="fam-prod">${WB.picto.product(WB.byId(pid), { sizes: "20vw" })}</div>`;
    return `<button type="button" class="fam" data-fam="${k}" data-tilt data-cursor="Filtrer"><span class="fam-media">${media}</span><span class="fam-body"><span class="fam-name">${label}</span><span class="mono fam-n">${count(k)} pièces</span></span></button>`;
  }).join("");
  $(".fams-grid").addEventListener("click", e => { const b = e.target.closest(".fam"); if (!b) return; state.fam = b.dataset.fam; state.ref = null; apply(); setTimeout(() => WB.scrollTo("#catalogue"), 80); });

  /* ---------- catalogue ---------- */
  const grid = $(".cat-grid"), chips = $(".chips"), countEl = $(".cat-count"), empty = $(".cat-empty");
  grid.innerHTML = ITEMS.map(p => WB.card(p, { fam: true })).join("");
  const cardOf = id => grid.querySelector(`.pcard[data-id="${id}"]`);
  const renderChips = () => {
    chips.innerHTML = [["all", "Tout", ITEMS.length], ...FAMS.map(([k, l]) => [k, l, count(k)])].map(([k, l, n]) => `<button type="button" class="chip" role="radio" aria-checked="${state.fam === k}" data-fam="${k}">${l}<span class="mono">${n}</span></button>`).join("") +
      (state.ref ? `<button type="button" class="chip chip-ref" data-clear-ref aria-label="Retirer le filtre plaquette ${state.ref}">Plaquette ${state.ref} <span aria-hidden="true">×</span></button>` : "");
  };
  const match = p => (state.fam === "all" || p.fam === state.fam) && p.p <= state.max && (!state.ref || p.ref === state.ref) && (!state.q || norm(`${p.n} ${WB.FAMILLES[p.fam]} ${p.ref || ""}`).includes(norm(state.q)));
  const order = (a, b) => state.sort === "asc" ? a.p - b.p : state.sort === "desc" ? b.p - a.p : state.sort === "name" ? a.n.localeCompare(b.n, "fr") : (a.rank || 99) - (b.rank || 99) || a.id - b.id;
  function apply(animate = true) {
    renderChips();
    const cards = $$(".pcard", grid);
    const st = (animate && G && window.Flip && !calm) ? Flip.getState(cards) : null;
    const shown = ITEMS.filter(match).sort(order);
    ITEMS.forEach(p => { cardOf(p.id).hidden = !shown.includes(p); });
    shown.forEach(p => grid.append(cardOf(p.id)));
    ITEMS.filter(p => !shown.includes(p)).forEach(p => grid.append(cardOf(p.id)));
    countEl.textContent = `${shown.length} pièce${shown.length > 1 ? "s" : ""} affichée${shown.length > 1 ? "s" : ""} sur ${ITEMS.length}`;
    empty.hidden = shown.length > 0;
    if (st) Flip.from(st, { duration: .6, ease: "power3.inOut", absolute: true,
      onEnter: els => G.fromTo(els, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .45 }),
      onLeave: els => G.to(els, { opacity: 0, scale: .85, duration: .35 }) });
    if (window.ScrollTrigger) { clearTimeout(apply.t); apply.t = setTimeout(() => ScrollTrigger.refresh(), 1700); }
  }
  chips.addEventListener("click", e => {
    if (e.target.closest("[data-clear-ref]")) { state.ref = null; apply(); return; }
    const c = e.target.closest(".chip"); if (!c) return; state.fam = c.dataset.fam; apply(); WB.sound.ratchet();
  });
  let qt; $("#cat-q").addEventListener("input", e => { clearTimeout(qt); qt = setTimeout(() => { state.q = e.target.value.trim(); apply(); }, 160); });
  $("#cat-sort").addEventListener("change", e => { state.sort = e.target.value; apply(); });
  const mx = $("#cat-max"), mxo = $("#cat-max-out");
  mx.addEventListener("input", () => { mxo.textContent = mx.value + " €"; });
  mx.addEventListener("change", () => { state.max = +mx.value; apply(); });
  document.addEventListener("click", e => { if (e.target.closest("[data-reset]")) { Object.assign(state, { fam: "all", q: "", max: 125, ref: null }); $("#cat-q").value = ""; mx.value = 125; mxo.textContent = "125 €"; apply(); } });
  apply(false);

  /* ---------- plaquettes ---------- */
  const REFS = ["11", "18", "23", "24", "62", "90", "91"];
  $(".plaq-grid").innerHTML = REFS.map(r => {
    const ps = ITEMS.filter(p => p.ref === r), p0 = ps[0];
    const prices = [...new Set(ps.map(p => WB.fmt(p.p)))].join(" et ");
    return `<button type="button" class="plaq" data-ref="${r}" data-tilt data-cursor="Afficher">
      <span class="plaq-media">${WB.picto.product(p0, { sizes: "(max-width:700px) 40vw, 14vw" })}</span>
      <span class="plaq-ref">${r === "24" ? "Réf. 24" : "DBP-" + r}</span>
      <span class="mono plaq-meta">${ps.length > 1 ? ps.length + " versions · " : ""}${prices}</span></button>`;
  }).join("");
  $(".plaq-grid").addEventListener("click", e => { const b = e.target.closest(".plaq"); if (!b) return; state.ref = b.dataset.ref; state.fam = "freinage"; state.q = ""; $("#cat-q").value = ""; apply(); setTimeout(() => WB.scrollTo("#catalogue"), 80); });

  WB.boot();

  /* ---------- animations ---------- */
  const arrive = WB.arrive();
  if (!G || calm) return;
  const tl = G.timeline({ delay: arrive ? .45 : .15 });
  tl.fromTo(".br-word", { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 1.6, ease: "power3.inOut" }, 0)
    .from(".br-word", { yPercent: 40, opacity: 0, duration: .9, ease: "power4.out" }, 0)
    .from(".br-copy > *:not(.br-title)", { y: 24, opacity: 0, duration: .6, stagger: .07, ease: "power3.out" }, .3)
    .from(".tag-mini .tag-swing", { y: -180, opacity: 0, duration: .9, stagger: .07, ease: "bounce.out" }, .2);
  $$(".br-stats [data-n]").forEach(dd => { const o = { v: 0 }, end = +dd.dataset.n; tl.to(o, { v: end, duration: 1.2, ease: "power2.out", onUpdate: () => dd.textContent = Math.round(o.v) }, .5); });
  G.from(".fam", { y: 60, opacity: 0, duration: .7, stagger: .08, ease: "power3.out", scrollTrigger: { trigger: ".fams", start: "top 85%", once: true } });
  G.from(".plaq", { y: 40, opacity: 0, rotateX: -40, duration: .6, stagger: .06, ease: "power3.out", scrollTrigger: { trigger: ".plaq-grid", start: "top 85%", once: true } });
  ST.create({ trigger: ".cat-grid", start: "top 85%", once: true, onEnter: () => G.from($$(".cat-grid .pcard:not([hidden])").slice(0, 10), { y: 50, opacity: 0, duration: .6, stagger: .05, ease: "power3.out", clearProps: "opacity,transform" }) });
})();
