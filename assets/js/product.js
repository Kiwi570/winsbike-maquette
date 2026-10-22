/* Fiche produit : cadre Weapon BEAST. */
(function () {
  const WB = window.WB, { $, $$, calm, fine } = WB;
  const G = window.gsap, ST = window.ScrollTrigger;
  const KEYS = ["weapon/cadre-beast-2", "weapon/cadre-beast-3", "weapon/cadre-beast-4", "weapon/cadre-beast-5", "weapon/cadre-beast-6", "weapon/cadre-beast-1"];
  const ALTS = ["Cadre Beast de profil, côté transmission", "Cadre Beast de trois quarts", "Cadre Beast de face, trois quarts avant", "Cadre Beast, détail arrière", "Cadre Beast, douille de direction", "Visuel Weapon : Beast, oil slick HT enduro frame"];
  const url = (k, w) => { const m = WB.IMAGES[k]; if (!m) return null; const pick = m.w.find(x => x >= w) || m.w[m.w.length - 1]; return `assets/img/${k}-${pick}.webp`; };

  /* ---------- galerie + loupe ---------- */
  const main = $(".pp-main-img"), thumbs = $(".pp-thumbs"), lens = $(".pp-lens"), box = $(".pp-main");
  let cur = 0;
  const imgTag = (i, eager) => { const k = KEYS[i], m = WB.IMAGES[k]; return m ? `<img src="${url(k, 1400)}" srcset="${m.w.map(w => `assets/img/${k}-${w}.webp ${w}w`).join(", ")}" sizes="(max-width: 900px) 100vw, 55vw" alt="${ALTS[i]}" width="${m.iw}" height="${m.ih}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>` : WB.picto.product(WB.byId(67)); };
  main.innerHTML = `<div class="pp-slide is-on">${imgTag(0, true)}</div>`;
  box.setAttribute("data-fly", "");
  thumbs.innerHTML = KEYS.map((k, i) => `<button type="button" class="pp-thumb" role="tab" aria-selected="${i === 0}" aria-label="${ALTS[i]}">${WB.IMAGES[k] ? `<img src="${url(k, 400)}" alt="" width="80" height="80" loading="lazy">` : ""}</button>`).join("");
  const go = (i) => {
    if (i === cur) return; cur = i;
    $$(".pp-thumb", thumbs).forEach((b, j) => b.setAttribute("aria-selected", j === i));
    const old = main.querySelector(".pp-slide.is-on"), n = document.createElement("div");
    n.className = "pp-slide is-on"; n.innerHTML = imgTag(i); main.append(n);
    if (G && !calm) {
      G.fromTo(n, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: .7, ease: "power3.inOut", onComplete: () => old && old.remove() });
      G.fromTo(n.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1, ease: "power3.out" });
    } else if (old) old.remove();
    WB.sound.ratchet();
  };
  thumbs.addEventListener("click", e => { const b = e.target.closest(".pp-thumb"); if (b) go($$(".pp-thumb", thumbs).indexOf(b)); });
  thumbs.addEventListener("keydown", e => { if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return; e.preventDefault(); const n = (cur + (e.key === "ArrowRight" ? 1 : KEYS.length - 1)) % KEYS.length; go(n); $$(".pp-thumb", thumbs)[n].focus(); });
  if (fine && !calm) {
    box.addEventListener("pointerenter", () => { const u = url(KEYS[cur], 1400); if (!u) return; lens.style.backgroundImage = `url(${u})`; box.classList.add("is-zoom"); });
    box.addEventListener("pointerleave", () => box.classList.remove("is-zoom"));
    box.addEventListener("pointermove", e => {
      const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, Z = 2.4, L = lens.offsetWidth;
      lens.style.transform = `translate(${x - L / 2}px, ${y - L / 2}px)`;
      lens.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`;
      lens.style.backgroundPosition = `${-(x * Z - L / 2)}px ${-(y * Z - L / 2)}px`;
    });
  }

  /* ---------- quantité + barre d'achat collante ---------- */
  const qty = $("#qty");
  document.addEventListener("click", e => { const b = e.target.closest("[data-qd]"); if (!b) return; qty.value = Math.max(1, Math.min(9, (+qty.value || 1) + +b.dataset.qd)); });
  const sticky = $(".sticky-buy"), buyRow = $(".pp-buy");
  new IntersectionObserver(([en]) => {
    const show = !en.isIntersecting && en.boundingClientRect.top < 0;
    sticky.classList.toggle("is-on", show); sticky.setAttribute("aria-hidden", !show);
    sticky.querySelector("button").tabIndex = show ? 0 : -1;
  }).observe(buyRow);
  sticky.querySelector("button").addEventListener("click", () => $(".pp-buy [data-add]").click());

  /* ---------- images déclarées ---------- */
  $$("[data-cards]").forEach(el => { el.innerHTML = el.dataset.cards.split(",").map(id => WB.card(WB.byId(id))).join(""); });
  $$("[data-product-img]").forEach(el => { el.innerHTML = WB.picto.img(el.dataset.productImg, "Visuel Weapon du cadre Beast", { sizes: "(max-width:700px) 60vw, 26vw" }) || ""; });
  const studio = WB.IMAGES["grok/cadre-studio-16x9"];
  if (studio) $(".pp-hero").style.setProperty("--studio", `url(${new URL(`assets/img/grok/cadre-studio-16x9-${studio.w.slice(-1)[0]}.webp`, location.href)})`);
  const alu = WB.IMAGES["grok/alu-brosse-16x9"];
  if (alu) $(".pp-numbers").style.setProperty("--alu", `url(${new URL(`assets/img/grok/alu-brosse-16x9-${alu.w.slice(-1)[0]}.webp`, location.href)})`);

  WB.boot();
  WB.geo($("#geo-pp"), $("#cotes-pp"), $("#geometrie"));

  /* ---------- animations ---------- */
  const arrive = WB.arrive();
  if (!G || calm) return;
  const d = arrive ? .45 : .1;
  const tl = G.timeline({ delay: d });
  if (window.SplitText) { const sp = new SplitText(".pp-title", { type: "words,chars" }); tl.from(sp.chars, { yPercent: -60, scaleY: 1.5, opacity: 0, duration: .5, stagger: .03, ease: "stamp", transformOrigin: "50% 0%" }, .1); }
  tl.fromTo(".pp-main", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power4.inOut" }, 0)
    .from(".pp-main img", { scale: 1.2, duration: 1.4, ease: "power3.out" }, 0)
    .from(".pp-thumb", { y: 20, opacity: 0, stagger: .05, duration: .4 }, .6)
    .from(".pp-info > *:not(.pp-title)", { y: 20, opacity: 0, stagger: .05, duration: .5, ease: "power3.out" }, .3);
  if (fine) {
    const qx = G.quickTo(".pp-main-img", "rotateY", { duration: .6 }), qy = G.quickTo(".pp-main-img", "rotateX", { duration: .6 });
    box.addEventListener("pointermove", e => { const r = box.getBoundingClientRect(); qx(((e.clientX - r.left) / r.width - .5) * 6); qy(-((e.clientY - r.top) / r.height - .5) * 6); });
    box.addEventListener("pointerleave", () => { qx(0); qy(0); });
  }
  $$(".pnum [data-n]").forEach(s => { const end = +s.dataset.n, o = { v: 0 }; G.to(o, { v: end, duration: 1.6, ease: "power3.out", onUpdate: () => s.textContent = Math.round(o.v), scrollTrigger: { trigger: s, start: "top 90%", once: true } }); });
  G.from(".spec-table tr", { x: -30, opacity: 0, duration: .5, stagger: .04, ease: "power3.out", scrollTrigger: { trigger: ".spec-table", start: "top 80%", once: true } });
  G.fromTo(".spec-table tr", { "--w": "0%" }, { "--w": "100%", duration: .6, stagger: .04, ease: "power2.out", scrollTrigger: { trigger: ".spec-table", start: "top 80%", once: true } });
  G.fromTo(".pp-terrain-media", { yPercent: -12 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".pp-terrain", start: "top bottom", end: "bottom top", scrub: true } });
  G.from(".pp-poster", { rotation: 14, y: 120, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".pp-terrain", start: "top 60%", once: true } });
  if (window.SplitText) { const q = new SplitText(".pp-quote p", { type: "words" }); G.from(q.words, { opacity: .1, stagger: .08, scrollTrigger: { trigger: ".pp-quote", start: "top 80%", end: "top 40%", scrub: true } }); }
})();
