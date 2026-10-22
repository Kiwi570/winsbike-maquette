/* Winsbike — socle commun : préférences, défilement, curseur, sons, panier, recherche, transitions. */
(function () {
  const WB = window.WB;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;

  /* ---------- stockage tolérant ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("wb:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("wb:" + k, JSON.stringify(v)); } catch (e) { } },
  };
  const sess = {
    get(k) { try { return sessionStorage.getItem("wb:" + k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem("wb:" + k, v); } catch (e) { } },
    del(k) { try { sessionStorage.removeItem("wb:" + k); } catch (e) { } },
  };

  /* ---------- préférences ---------- */
  let calm = store.get("calm", null);
  if (calm === null) calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.toggle("calm", calm);
  const fine = matchMedia("(pointer: fine) and (hover: hover)").matches;
  const fmt = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const byId = id => WB.P.find(p => p.id === +id);

  Object.assign(WB, { $, $$, store, sess, calm, fine, fmt, norm, byId });

  /* ---------- GSAP + Lenis ---------- */
  const hasGsap = !!window.gsap;
  if (hasGsap) {
    gsap.registerPlugin(...[window.ScrollTrigger, window.SplitText, window.Flip, window.DrawSVGPlugin, window.CustomEase].filter(Boolean));
    if (window.CustomEase) {
      CustomEase.create("stamp", "M0,0 C0.18,0 0.2,1.12 0.42,1.04 0.58,0.98 0.7,1 1,1");
      CustomEase.create("torque", "M0,0 C0.4,0 0.62,0.88 0.82,0.96 0.92,1 0.96,1 1,1");
    }
    if (calm) gsap.globalTimeline.timeScale(1);
  }
  let lenis = null;
  if (!calm && window.Lenis && hasGsap) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", () => window.ScrollTrigger && ScrollTrigger.update());
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  WB.lenis = lenis;
  WB.scrollTo = (target, offset = -76) => {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: calm ? "auto" : "smooth" });
  };

  /* ---------- interface partagée injectée ---------- */
  const ui = document.createElement("div");
  ui.innerHTML = `
  <div class="shutter" aria-hidden="true">${"<i class='slat'></i>".repeat(10)}</div>
  <div class="cur" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="cur-key" d="M14 6h5v20h12v5H14z"/></svg><span class="cur-label"></span></div>
  <div class="toasts" role="status" aria-live="polite"></div>
  <div class="veil" data-close></div>
  <aside class="drawer" id="cart" role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden="true">
    <div class="drawer-hd"><h2 id="cart-title">Panier</h2><button class="x" data-close aria-label="Fermer le panier">×</button></div>
    <div class="ship">
      <svg class="chain" viewBox="0 0 320 64" aria-hidden="true">
        <g class="sprk sprk-a"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="6"/>${Array.from({ length: 10 }, (_, i) => `<rect x="30" y="6" width="4" height="7" transform="rotate(${i * 36} 32 32)"/>`).join("")}</g>
        <g class="sprk sprk-b"><circle cx="288" cy="32" r="22"/><circle cx="288" cy="32" r="6"/>${Array.from({ length: 10 }, (_, i) => `<rect x="286" y="6" width="4" height="7" transform="rotate(${i * 36} 288 32)"/>`).join("")}</g>
        <path class="chain-track" d="M32 8H288A24 24 0 0 1 288 56H32A24 24 0 0 1 32 8"/>
        <path class="chain-fill" d="M32 8H288A24 24 0 0 1 288 56H32A24 24 0 0 1 32 8"/>
        <path class="chain-links" d="M32 8H288A24 24 0 0 1 288 56H32A24 24 0 0 1 32 8"/>
      </svg>
      <p class="ship-msg"></p>
    </div>
    <div class="drawer-body"></div>
    <div class="drawer-ft"></div>
  </aside>
  <div class="search" id="search" role="dialog" aria-modal="true" aria-label="Recherche" aria-hidden="true">
    <div class="search-in">
      <label class="mono" for="q">Rechercher une pièce, une marque, une référence</label>
      <div class="search-row"><input id="q" type="search" autocomplete="off" placeholder="plaquette 91, disque 180, casque…"><button class="x" data-close aria-label="Fermer la recherche">×</button></div>
      <ul class="search-res" aria-live="polite"></ul>
    </div>
  </div>
  <div class="modal" id="quick" role="dialog" aria-modal="true" aria-labelledby="quick-title" aria-hidden="true"><div class="modal-in"></div></div>
  <nav class="menu" id="menu" aria-label="Menu" aria-hidden="true">
    <div class="menu-in">
      <a href="index.html#pratiques">Pratiques</a><a href="index.html#marques">Marques</a><a href="sumart.html">Sumart</a>
      <a href="cadre-beast-weapon.html">Cadre Beast</a><a href="index.html#atelier">L'atelier</a><a href="index.html#pro">Espace pro</a>
      <p class="mono menu-meta"><span data-open-chip></span><br>02 96 29 46 26 · contact@winsbike.fr</p>
    </div>
  </nav>`;
  document.body.append(...ui.children);

  /* ---------- toasts ---------- */
  WB.toast = (msg) => {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    $(".toasts").append(t);
    if (hasGsap && !calm) gsap.fromTo(t, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: "power3.out" });
    setTimeout(() => { if (hasGsap) gsap.to(t, { opacity: 0, y: -10, duration: .3, onComplete: () => t.remove() }); else t.remove(); }, 2600);
  };

  /* ---------- sons (WebAudio, uniquement après un clic sur « Son ») ---------- */
  const Sound = {
    on: false, ctx: null, buf: null, last: 0,
    ensure() {
      if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; this.ctx = new AC(); }
      if (this.ctx.state === "suspended") this.ctx.resume();
      if (!this.buf) {
        const b = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.06, this.ctx.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
        this.buf = b;
      }
      return this.ctx;
    },
    tick(t, f, g, dur = .02) {
      const c = this.ctx, s = c.createBufferSource(), bp = c.createBiquadFilter(), gn = c.createGain();
      s.buffer = this.buf; bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = 9;
      gn.gain.setValueAtTime(g, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(bp).connect(gn).connect(c.destination); s.start(t); s.stop(t + dur + .02);
    },
    ratchet() {
      if (!this.on) return; const now = performance.now(); if (now - this.last < 260) return; this.last = now;
      const c = this.ensure(); if (!c) return; const t = c.currentTime;
      for (let i = 0; i < 7; i++) this.tick(t + i * .021, 3000 + Math.random() * 900, .22 * (1 - i / 9));
    },
    clac() {
      if (!this.on) return; const c = this.ensure(); if (!c) return; const t = c.currentTime;
      this.tick(t, 1300, .55, .04); this.tick(t + .012, 4200, .25, .03);
      const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 2650; o.type = "sine";
      g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.0001, t + .18);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + .2);
    },
  };
  WB.sound = Sound;

  /* ---------- en-tête ---------- */
  const hd = $("#hd");
  const btnSound = $("#btn-sound"), btnCalm = $("#btn-calm");
  if (btnSound) btnSound.addEventListener("click", () => {
    Sound.on = !Sound.on; btnSound.setAttribute("aria-pressed", Sound.on);
    btnSound.querySelector(".tog-state").textContent = Sound.on ? "on" : "off";
    if (Sound.on) { Sound.ensure(); Sound.clac(); }
  });
  if (btnCalm) {
    btnCalm.setAttribute("aria-pressed", calm);
    btnCalm.querySelector(".tog-state").textContent = calm ? "on" : "off";
    btnCalm.addEventListener("click", () => { store.set("calm", !calm); location.reload(); });
  }
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (hd) {
      hd.classList.toggle("is-solid", y > 30);
    }
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- ouvert maintenant (heure de Paris) ---------- */
  const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  WB.parisNow = () => {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { d, h: (+get("hour") % 24) + (+get("minute")) / 60 };
  };
  const hh = h => `${Math.floor(h)}h${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
  WB.openStatus = () => {
    const { d, h } = WB.parisNow(), today = WB.HOURS[d];
    const slot = today.find(([a, b]) => h >= a && h < b);
    if (slot) return { open: true, label: `Ouvert · ferme à ${hh(slot[1])}` };
    const later = today.find(([a]) => a > h);
    if (later) return { open: false, label: `Fermé · rouvre à ${hh(later[0])}` };
    for (let i = 1; i <= 7; i++) {
      const dd = (d + i) % 7; if (WB.HOURS[dd].length) return { open: false, label: `Fermé · ouvre ${i === 1 ? "demain" : DAYS[dd]} à ${hh(WB.HOURS[dd][0][0])}` };
    }
    return { open: false, label: "Fermé" };
  };
  const paintOpen = () => $$("[data-open-chip]").forEach(el => {
    const s = WB.openStatus(); el.textContent = s.label; el.classList.toggle("is-open", s.open); el.classList.toggle("is-closed", !s.open);
  });
  paintOpen(); setInterval(paintOpen, 60000);

  /* ---------- médias ---------- */
  WB.hydrateMedia = (scope = document) => {
    $$("[data-scene]", scope).forEach(el => {
      const mob = el.dataset.sceneMobile && innerWidth < 700 && WB.IMAGES[el.dataset.sceneMobile] ? el.dataset.sceneMobile : el.dataset.scene;
      el.innerHTML = WB.picto.scene(mob, el.dataset.alt || "", el.dataset.kind || "", { eager: el.hasAttribute("data-eager") });
    });
  };

  /* ---------- variantes & cartes produit ---------- */
  WB.variantUI = (p, compact) => {
    let h = "";
    if (p.colors && p.colors.length > 1) {
      h += `<div class="vars" role="radiogroup" aria-label="Couleur"${compact ? "" : ` data-label="Couleur"`}>` + p.colors.map((c, i) =>
        `<button type="button" class="sw" role="radio" aria-checked="${i === 0}" data-v="${c}" title="${c}" style="--sw:${WB.SWATCH[c] || "#777"}"><span class="sr">${c}</span></button>`).join("") +
        `<span class="vars-name mono">${p.colors[0]}</span></div>`;
    }
    if (p.sizes && p.sizes.length > 1) {
      h += `<div class="vars vars-size" role="radiogroup" aria-label="Taille">` + p.sizes.map((s, i) =>
        `<button type="button" class="chip-size" role="radio" aria-checked="${i === 0}" data-v="${s}">${s}</button>`).join("") + `</div>`;
    }
    return h;
  };
  WB.readVariant = (scope) => $$(".vars", scope).map(g => { const s = $("[aria-checked=true]", g); return s ? s.dataset.v : ""; }).filter(Boolean).join(" · ");

  WB.card = (p, o = {}) => {
    const brand = WB.picto.brandName(p.b);
    const out = p.stock === "Rupture";
    return `<article class="pcard${o.cls ? " " + o.cls : ""}" data-id="${p.id}" data-tilt id="p-${p.id}">
      ${o.rank ? `<span class="pcard-rank mono">N°${o.rank}</span>` : ""}
      <button type="button" class="pcard-media" data-quick="${p.id}" aria-label="Aperçu rapide : ${p.n}">${WB.picto.product(p, { sizes: "(max-width:700px) 50vw, 25vw" })}</button>
      <div class="pcard-body">
        <p class="pcard-brand mono">${brand}${p.fam && o.fam ? ` · ${WB.FAMILLES[p.fam]}` : ""}</p>
        <h3 class="pcard-name">${p.url ? `<a href="${p.url}">${p.n}</a>` : p.n}</h3>
        ${WB.variantUI(p, true)}
        <div class="pcard-foot">
          <span class="price">${fmt(p.p)}</span>
          ${out ? `<span class="badge-out mono">Rupture</span>` : `<button type="button" class="btn-add" data-add="${p.id}" data-magnetic>Ajouter</button>`}
        </div>
      </div>
    </article>`;
  };

  /* ---------- panier ---------- */
  const Cart = {
    items: store.get("cart", []),
    save() { store.set("cart", this.items); this.render(); },
    count() { return this.items.reduce((s, i) => s + i.q, 0); },
    sub() { return this.items.reduce((s, i) => { const p = byId(i.id); return s + (p ? p.p * i.q : 0); }, 0); },
    add(id, v = "", q = 1, from) {
      const p = byId(id); if (!p) return;
      const ex = this.items.find(i => i.id === p.id && i.v === v);
      if (ex) ex.q += q; else this.items.push({ id: p.id, v, q });
      this.save(); Sound.clac(); fly(from); WB.toast(`Ajouté au panier : ${p.n}${v ? " · " + v : ""}`);
    },
    setQ(idx, q) { if (q <= 0) this.items.splice(idx, 1); else this.items[idx].q = q; this.save(); },
    render() {
      const n = this.count();
      $$(".cart-count").forEach(el => el.textContent = n);
      $$("#btn-cart").forEach(b => b.setAttribute("aria-label", `Panier, ${n} article${n > 1 ? "s" : ""}`));
      const body = $(".drawer-body"), ft = $(".drawer-ft"), sub = this.sub();
      const prog = Math.min(1, sub / WB.FREE_SHIP);
      $(".ship-msg").innerHTML = sub >= WB.FREE_SHIP
        ? `<strong>Livraison offerte.</strong> Votre panier dépasse 75 € TTC.`
        : `Plus que <strong>${fmt(WB.FREE_SHIP - sub)}</strong> pour la livraison offerte (dès 75 € TTC).`;
      if (hasGsap) {
        gsap.to(".chain-fill", { drawSVG: `0% ${Math.max(0.0001, prog * 100)}%`, duration: calm ? 0 : .9, ease: "power3.inOut" });
        gsap.to(".sprk", { rotation: prog * 540, svgOrigin: (i) => i ? "288 32" : "32 32", duration: calm ? 0 : .9, ease: "power3.inOut" });
      }
      if (!this.items.length) {
        body.innerHTML = `<div class="empty"><p class="mono">Panier vide</p><p>Commencez par le mur à outils ou le cadre Beast.</p><a class="btn" href="sumart.html">Voir l'outillage Sumart</a></div>`;
        ft.innerHTML = ""; return;
      }
      body.innerHTML = `<ul class="lines">${this.items.map((it, i) => { const p = byId(it.id); return `<li class="line">
        <div class="line-media">${WB.picto.product(p, { sizes: "80px" })}</div>
        <div class="line-info"><p class="mono">${WB.picto.brandName(p.b)}</p><p class="line-name">${p.n}</p>${it.v ? `<p class="line-v mono">${it.v}</p>` : ""}
          <div class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="Retirer un">−</button><span>${it.q}</span><button type="button" data-q="${i}" data-d="1" aria-label="Ajouter un">+</button></div></div>
        <p class="line-p">${fmt(p.p * it.q)}</p></li>`; }).join("")}</ul>`;
      ft.innerHTML = `<dl class="tot"><div><dt>Sous-total TTC</dt><dd>${fmt(sub)}</dd></div>
        <div><dt>Livraison</dt><dd>${sub >= WB.FREE_SHIP ? "Offerte" : "Selon le poids"}</dd></div></dl>
        <button type="button" class="btn btn-big" data-checkout data-magnetic>Commander</button>
        <p class="fine mono">Démonstration : aucun paiement réel.</p>`;
    },
    checkout() {
      const sub = this.sub();
      $(".drawer-body").innerHTML = `<form class="pay" id="payform">
        <h3>Paiement</h3>
        <fieldset><legend class="mono">Moyen de paiement</legend>
          <label class="opt"><input type="radio" name="pm" value="cb" checked> <span><strong>Carte bancaire</strong> Visa, Mastercard · via PayPlug, 3D Secure</span></label>
          <label class="opt"><input type="radio" name="pm" value="cheque"> <span><strong>Chèque</strong> à l'ordre de Ets Corbières · commande gardée 7 jours</span></label>
          <label class="opt"><input type="radio" name="pm" value="vir"> <span><strong>Virement</strong> coordonnées bancaires affichées après validation</span></label>
        </fieldset>
        <p class="fine">Expédition sous 2 à 8 jours après réception du paiement, avec lien de suivi.</p>
      </form>`;
      $(".drawer-ft").innerHTML = `<dl class="tot"><div><dt>Total TTC</dt><dd>${fmt(sub)}</dd></div></dl>
        <button type="submit" form="payform" class="btn btn-big">Valider la commande (démo)</button>
        <button type="button" class="btn-link" data-back>Retour au panier</button>`;
      $("#payform").addEventListener("submit", e => {
        e.preventDefault();
        const pm = new FormData(e.target).get("pm");
        $(".drawer-body").innerHTML = `<div class="done"><svg viewBox="0 0 64 64" class="done-bolt" aria-hidden="true"><path d="M32 6l22.5 13v26L32 58 9.5 45V19z"/><path d="M24 32l6 6 11-13"/></svg>
          <h3>Commande de démonstration enregistrée</h3><p>Rien n'a été débité ni envoyé. Sur le vrai site, ${pm === "cb" ? "le paiement passe par la page sécurisée PayPlug" : pm === "cheque" ? "la commande est traitée à réception du chèque" : "les coordonnées bancaires s'affichent après validation"}.</p></div>`;
        $(".drawer-ft").innerHTML = `<button type="button" class="btn btn-big" data-clear>Vider le panier et continuer</button>`;
        Sound.clac();
      });
    },
  };
  WB.cart = Cart;

  /* ---------- tiroirs, modales ---------- */
  let opened = null, lastFocus = null;
  function openLayer(el) {
    if (opened) closeLayer(true);
    lastFocus = document.activeElement; opened = el;
    el.setAttribute("aria-hidden", "false"); el.classList.add("is-open");
    $(".veil").classList.add("is-on"); document.body.classList.add("lock");
    if (lenis) lenis.stop();
    const f = el.querySelector("input, button:not([data-close]), a"); if (f) setTimeout(() => f.focus(), 60);
  }
  function closeLayer(silent) {
    if (!opened) return;
    opened.setAttribute("aria-hidden", "true"); opened.classList.remove("is-open");
    $(".veil").classList.remove("is-on"); document.body.classList.remove("lock");
    if (lenis) lenis.start();
    const o = opened; opened = null;
    if (!silent && lastFocus) lastFocus.focus();
    if (o.id === "menu") { const b = $("#btn-menu"); if (b) b.setAttribute("aria-expanded", "false"); }
  }
  WB.openLayer = openLayer; WB.closeLayer = closeLayer;
  addEventListener("keydown", e => { if (e.key === "Escape") closeLayer(); });

  WB.quick = (id) => {
    const p = byId(id); if (!p) return;
    const m = $("#quick .modal-in");
    m.innerHTML = `<button class="x" data-close aria-label="Fermer">×</button>
      <div class="quick-media">${WB.picto.product(p, { sizes: "(max-width:700px) 90vw, 40vw" })}</div>
      <div class="quick-info">
        <p class="mono">${WB.picto.brandName(p.b)}${p.fam ? " · " + WB.FAMILLES[p.fam] : ""}</p>
        <h2 id="quick-title">${p.n}</h2>
        <p class="price price-big">${fmt(p.p)} <span class="mono">TTC</span></p>
        ${WB.variantUI(p)}
        <ul class="quick-facts mono">
          ${p.norme ? `<li>Norme indiquée : ${p.norme}</li>` : ""}
          ${p.stock ? `<li>Disponibilité sur le site : ${p.stock}</li>` : ""}
          ${p.ref ? `<li>Référence de plaquette : ${p.ref}</li>` : ""}
          ${p.nc ? `<li class="todo">Nom complet et description à reprendre de la fiche du site</li>` : ""}
          <li>Livraison offerte dès 75 € TTC</li>
        </ul>
        ${p.stock === "Rupture" ? `<p class="badge-out mono">Rupture de stock</p>` : `<button type="button" class="btn btn-big" data-add="${p.id}" data-magnetic>Ajouter au panier</button>`}
        ${p.url ? `<a class="btn-link" href="${p.url}">Voir la fiche complète</a>` : ""}
      </div>`;
    openLayer($("#quick"));
  };

  /* ---------- vol vers le panier ---------- */
  function fly(from) {
    const target = $("#btn-cart");
    if (!from || !target || !hasGsap || calm) { if (target && hasGsap) gsap.fromTo(target, { scale: 1.25 }, { scale: 1, duration: .5, ease: "elastic.out(1,.4)" }); return; }
    const src = from.closest(".pcard, .modal-in, .tag, .buy, .line") || from;
    const media = (from.closest(".buy") && document.querySelector("[data-fly]")) || src.querySelector(".pmedia") || src;
    const r = media.getBoundingClientRect(), t = target.getBoundingClientRect();
    const c = media.cloneNode(true); c.classList.add("flyer");
    Object.assign(c.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    document.body.append(c);
    const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
    const tl = gsap.timeline({ onComplete: () => { c.remove(); gsap.fromTo(target, { scale: 1.35 }, { scale: 1, duration: .6, ease: "elastic.out(1,.35)" }); } });
    tl.to(c, { x: dx, duration: .75, ease: "power2.in" }, 0)
      .to(c, { y: dy - 120, duration: .32, ease: "power2.out" }, 0)
      .to(c, { y: dy, duration: .43, ease: "power2.in" }, .32)
      .to(c, { scale: .12, rotation: 200, opacity: .9, duration: .75, ease: "power2.in" }, 0);
  }

  /* ---------- recherche ---------- */
  const q = $("#q"), res = $(".search-res");
  function runSearch() {
    const v = norm(q.value.trim());
    if (!v) { res.innerHTML = `<li class="mono hint">Exemples : « plaquette 91 », « disque », « casque enfant », « weapon »</li>`; return; }
    const terms = v.split(/\s+/);
    const hits = WB.P.filter(p => { const hay = norm(`${p.n} ${WB.picto.brandName(p.b)} ${p.fam ? WB.FAMILLES[p.fam] : ""} ${p.ref || ""}`); return terms.every(t => hay.includes(t)); }).slice(0, 8);
    res.innerHTML = hits.length ? hits.map(p => `<li class="hit"><div class="hit-media">${WB.picto.product(p, { sizes: "64px" })}</div>
      <div class="hit-info"><p class="mono">${WB.picto.brandName(p.b)}</p><p>${p.url ? `<a href="${p.url}">${p.n}</a>` : `<button type="button" class="linkish" data-quick="${p.id}">${p.n}</button>`}</p></div>
      <span class="price">${fmt(p.p)}</span>${p.stock === "Rupture" ? "" : `<button type="button" class="btn-add btn-add-sm" data-add="${p.id}" aria-label="Ajouter ${p.n}">+</button>`}</li>`).join("")
      : `<li class="hint">Aucun résultat pour « ${q.value} ». Appelez l'atelier au 02 96 29 46 26.</li>`;
  }
  q.addEventListener("input", runSearch);

  /* ---------- délégation des clics ---------- */
  document.addEventListener("click", e => {
    const t = e.target;
    const add = t.closest("[data-add]");
    if (add) {
      const scope = add.closest(".pcard, .modal-in, .tag, .buy, .hit");
      const qi = scope && scope.querySelector(".qty-in");
      Cart.add(add.dataset.add, scope ? WB.readVariant(scope) : "", Math.max(1, Math.min(9, +(qi ? qi.value : 1) || 1)), add); return;
    }
    const qv = t.closest("[data-quick]"); if (qv) { e.preventDefault(); WB.quick(qv.dataset.quick); return; }
    const sw = t.closest(".sw, .chip-size");
    if (sw) { const g = sw.closest(".vars"); $$("[role=radio]", g).forEach(b => b.setAttribute("aria-checked", b === sw)); const nm = $(".vars-name", g); if (nm) nm.textContent = sw.dataset.v; Sound.ratchet(); return; }
    if (t.closest("[data-close]")) { closeLayer(); return; }
    if (t.closest("#btn-cart")) { Cart.render(); openLayer($("#cart")); return; }
    if (t.closest("#btn-search")) { openLayer($("#search")); runSearch(); return; }
    if (t.closest("#btn-menu")) { const b = $("#btn-menu"); if ($("#menu").classList.contains("is-open")) closeLayer(); else { openLayer($("#menu")); b.setAttribute("aria-expanded", "true"); } return; }
    const qb = t.closest("[data-q]"); if (qb) { const i = +qb.dataset.q; Cart.setQ(i, Cart.items[i].q + +qb.dataset.d); return; }
    if (t.closest("[data-checkout]")) { Cart.checkout(); return; }
    if (t.closest("[data-back]")) { Cart.render(); return; }
    if (t.closest("[data-clear]")) { Cart.items = []; Cart.save(); closeLayer(); return; }
    const soon = t.closest("[data-soon]");
    if (soon) { e.preventDefault(); WB.toast(soon.dataset.soon || "Page prévue dans le site complet, hors maquette."); return; }
    const copy = t.closest("[data-copy]");
    if (copy) {
      const txt = copy.dataset.copy;
      const ok = () => { WB.toast(`Copié : ${txt}`); };
      try { navigator.clipboard.writeText(txt).then(ok, () => selectText(copy)); } catch (err) { selectText(copy); }
      return;
    }
    /* ancres internes avec défilement fluide */
    const a = t.closest("a[href]");
    if (a && !e.defaultPrevented) {
      const url = new URL(a.getAttribute("href"), location.href);
      const samePage = url.pathname.replace(/\/index(\.html)?$/, "/").replace(/\.html$/, "") === location.pathname.replace(/\/index(\.html)?$/, "/").replace(/\.html$/, "");
      if (url.hash && samePage && url.origin === location.origin) {
        const target = document.getElementById(url.hash.slice(1));
        if (target) { e.preventDefault(); closeLayer(true); WB.scrollTo(target); return; }
      }
      if (url.origin === location.origin && !samePage && !a.target && !e.metaKey && !e.ctrlKey && !e.shiftKey && /\.html$|\/$/.test(url.pathname + (url.pathname.endsWith("/") ? "" : ""))) {
        e.preventDefault(); leave(url.href);
      }
    }
  });
  function selectText(el) { const s = getSelection(), r = document.createRange(); const tgt = el.querySelector(".copy-txt") || el; r.selectNodeContents(tgt); s.removeAllRanges(); s.addRange(r); WB.toast("Texte sélectionné, copiez-le avec ⌘C"); }

  /* ---------- transitions de page en rideau métallique ---------- */
  function leave(href) {
    closeLayer(true);
    if (calm || !hasGsap) { location.href = href; return; }
    sess.set("nav", "1");
    const sh = $(".shutter"); sh.classList.add("is-on");
    gsap.fromTo(".slat", { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 0%", duration: .38, stagger: .035, ease: "power3.in", onComplete: () => { location.href = href; } });
  }
  WB.arrive = () => {
    const sh = $(".shutter");
    if (sess.get("nav") && hasGsap && !calm) {
      sess.del("nav"); sh.classList.add("is-on");
      gsap.set(".slat", { scaleY: 1 });
      return gsap.to(".slat", { scaleY: 0, transformOrigin: "50% 0%", duration: .5, stagger: { each: .04, from: "end" }, ease: "power3.inOut", delay: .05, onComplete: () => { sh.classList.remove("is-on"); root.classList.remove("nav-in"); } });
    }
    sess.del("nav"); root.classList.remove("nav-in"); return null;
  };
  addEventListener("pageshow", e => { if (e.persisted) { $(".shutter").classList.remove("is-on"); root.classList.remove("nav-in"); } });

  /* ---------- curseur clé 6 pans ---------- */
  if (fine && !calm && hasGsap) {
    root.classList.add("has-cur");
    const cur = $(".cur"), lab = $(".cur-label");
    const xTo = gsap.quickTo(cur, "x", { duration: .18, ease: "power3.out" }), yTo = gsap.quickTo(cur, "y", { duration: .18, ease: "power3.out" });
    addEventListener("pointermove", e => { xTo(e.clientX); yTo(e.clientY); cur.classList.add("is-on"); }, { passive: true });
    document.addEventListener("pointerleave", () => cur.classList.remove("is-on"));
    let rot = 0;
    addEventListener("pointerdown", () => { rot += 90; gsap.to(".cur svg", { rotation: rot, duration: .35, ease: "back.out(3)" }); });
    document.addEventListener("pointerover", e => {
      const el = e.target.closest("a, button, [data-cursor], label, input, select, textarea");
      cur.classList.toggle("is-hover", !!el);
      cur.classList.toggle("is-text", !!(el && el.matches("input, textarea, select")));
      lab.textContent = el && el.dataset.cursor ? el.dataset.cursor : "";
      cur.classList.toggle("has-label", !!(el && el.dataset.cursor));
    });
  }

  /* ---------- boutons magnétiques + inclinaison 3D ---------- */
  if (fine && !calm && hasGsap) {
    document.addEventListener("pointermove", e => {
      const m = e.target.closest("[data-magnetic]");
      $$("[data-magnetic].is-mag").forEach(el => { if (el !== m) { el.classList.remove("is-mag"); gsap.to(el, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.35)" }); } });
      if (m) {
        const r = m.getBoundingClientRect(); m.classList.add("is-mag");
        gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * .28, y: (e.clientY - r.top - r.height / 2) * .38, duration: .35, ease: "power3.out" });
      }
      const card = e.target.closest("[data-tilt]");
      $$("[data-tilt].is-tilt").forEach(el => { if (el !== card) { el.classList.remove("is-tilt"); gsap.to(el, { rotateX: 0, rotateY: 0, duration: .8, ease: "elastic.out(1,.5)" }); } });
      if (card) {
        if (!card.classList.contains("is-tilt")) { card.classList.add("is-tilt"); Sound.ratchet(); }
        const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: px * 9, rotateX: -py * 9, transformPerspective: 900, duration: .4, ease: "power2.out" });
        card.style.setProperty("--gx", (px + .5) * 100 + "%"); card.style.setProperty("--gy", (py + .5) * 100 + "%");
      }
    }, { passive: true });
  }

  /* ---------- apparitions au défilement ---------- */
  WB.reveals = (scope = document) => {
    if (!hasGsap || !window.ScrollTrigger) return;
    $$("[data-reveal]", scope).forEach(el => {
      if (calm) return;
      gsap.from(el, { y: 46, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    $$("[data-stagger]", scope).forEach(el => {
      if (calm) return;
      gsap.from(el.children, { y: 40, opacity: 0, duration: .8, stagger: .07, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
    if (window.SplitText) $$("[data-split]", scope).forEach(el => {
      if (calm) return;
      document.fonts.ready.then(() => {
        const s = new SplitText(el, { type: "lines,chars", mask: "lines", linesClass: "sl" });
        gsap.from(s.chars, { yPercent: 115, duration: .9, stagger: .018, ease: "stamp", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      });
    });
  };

  /* =========================================================
     15. Mot de pied de page gravé, qui ondule sous la souris
     ========================================================= */
  function footerWord() {
    const G = window.gsap;
    const w = $(".ft-word"); if (!w) return;
    w.innerHTML = [...w.textContent].map(c => `<span>${c}</span>`).join("");
    const L = $$("span", w);
    if (!G || calm) return;
    G.from(L, { yPercent: 70, opacity: 0, duration: 1, stagger: .05, ease: "power4.out", scrollTrigger: { trigger: w, start: "top 95%", once: true } });
    if (!fine) return;
    const qs = L.map(s => G.quickTo(s, "y", { duration: .5, ease: "power3.out" }));
    w.parentElement.addEventListener("pointermove", e => { L.forEach((s, i) => { const r = s.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)); qs[i](-Math.max(0, 1 - d / 260) * 40); }); });
    w.parentElement.addEventListener("pointerleave", () => qs.forEach(q => q(0)));
  }

  /* ---------- démarrage commun ---------- */
  WB.boot = () => {
    WB.hydrateMedia();
    Cart.render();
    WB.reveals();
    footerWord();
    document.fonts && document.fonts.ready.then(() => window.ScrollTrigger && ScrollTrigger.refresh());
    addEventListener("load", () => window.ScrollTrigger && ScrollTrigger.refresh());
  };
})();
