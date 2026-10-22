/* Pictogrammes « dessin technique » : visuels provisoires en attendant les vraies photos.
   Trait 2px sur viewBox 120×120, couleur héritée. */
(function () {
  const C = (cx, cy, r, x = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" ${x}/>`;
  const R = (x, y, w, h, rx = 0, e = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${e}/>`;
  const L = (d, e = "") => `<path d="${d}" ${e}/>`;
  const holes = (cx, cy, r, n, hr) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2; return C((cx + Math.cos(a) * r).toFixed(1), (cy + Math.sin(a) * r).toFixed(1), hr);
  }).join("");

  const K = {
    disque: C(60, 60, 42) + C(60, 60, 31) + C(60, 60, 12) + holes(60, 60, 18, 6, 2.6) +
      Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; const x1 = 60 + Math.cos(a) * 33, y1 = 60 + Math.sin(a) * 33, x2 = 60 + Math.cos(a + .35) * 40, y2 = 60 + Math.sin(a + .35) * 40; return L(`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`); }).join(""),
    jante: C(60, 60, 44) + C(60, 60, 36) + holes(60, 60, 40, 24, 1.2),
    bande: C(60, 60, 44) + C(60, 60, 30) + L("M60 16v28M60 76v28", 'stroke-dasharray="3 4"'),
    moyeu: R(16, 52, 88, 16, 3) + R(30, 30, 6, 60, 2) + R(84, 30, 6, 60, 2) + holes(33, 60, 0, 1, 0) + R(4, 56, 112, 8, 2, 'stroke-dasharray="4 3"') + C(33, 36, 1.6) + C(33, 84, 1.6) + C(87, 36, 1.6) + C(87, 84, 1.6),
    plaquette: L("M22 40h62a14 14 0 0 1 14 14v12a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14z") + L("M28 46h52a10 10 0 0 1 10 10v8a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10z", 'stroke-dasharray="3 3"') + C(96, 34, 5) + L("M84 40l8-10"),
    patin: R(18, 50, 84, 20, 10) + R(26, 54, 68, 12, 6, 'stroke-dasharray="3 3"') + L("M60 70v22M54 92h12"),
    repousse: L("M14 70l60-26h22a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H74z") + L("M74 44v32") + L("M84 54h10M84 66h10"),
    cles6: L("M24 30h12v52h52v12H24z") + L("M44 30h10v40h40v10H44z") + L("M64 30h8v28h28v8H64z"),
    dynamo: R(10, 54, 74, 12, 6) + C(92, 60, 16) + C(92, 60, 4) + L("M92 60l9-9") + L("M18 60h46", 'stroke-dasharray="4 3"'),
    pompe: R(52, 20, 16, 74, 4) + L("M38 18h44") + L("M60 94v8M30 104h60") + C(76, 74, 9) + L("M76 74l4-5") + L("M68 40c22 0 26 18 34 40", 'stroke-dasharray="2 3"'),
    minipompe: R(16, 50, 74, 20, 10) + R(90, 54, 14, 12, 3) + L("M26 50v20M38 50v20"),
    co2: R(20, 46, 52, 28, 14) + L("M72 54h20l10 6-10 6H72") + L("M30 50v20", 'stroke-dasharray="2 3"'),
    valve: L("M60 14v74") + R(52, 26, 16, 8, 2) + R(50, 72, 20, 14, 2) + L("M54 88l6 18 6-18"),
    meche: L("M20 80c10-20 20 20 30 0s20 20 30 0 20 20 30 0") + R(30, 26, 60, 12, 6) + L("M90 32h14"),
    huile: L("M44 40h32v56a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6z") + L("M52 40v-10h16v10") + L("M60 30V14l8-4") + R(48, 58, 24, 26, 2, 'stroke-dasharray="3 3"'),
    bidon: L("M42 34h36l4 10v52a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8V44z") + L("M50 34v-10h20v10") + L("M60 24v-8") + L("M38 60h44M38 74h44"),
    portebidon: L("M44 22v76a8 8 0 0 0 8 8h16a8 8 0 0 0 8-8V22") + L("M44 40h32M44 70h32") + C(60, 30, 2.5) + C(60, 86, 2.5),
    fouet: R(14, 54, 50, 12, 6) + L("M64 60c20 0 30-24 46-24", 'stroke-dasharray="5 3"') + C(110, 36, 3),
    clecassette: C(60, 60, 26) + C(60, 60, 14) + Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180; return L(`M${(60 + Math.cos(a) * 26).toFixed(1)} ${(60 + Math.sin(a) * 26).toFixed(1)}L${(60 + Math.cos(a) * 32).toFixed(1)} ${(60 + Math.sin(a) * 32).toFixed(1)}`); }).join(""),
    clerayon: L("M38 38h44v44H38z") + L("M38 50h-6M38 70h-6M82 50h6M82 70h6M50 38v-6M70 38v-6M50 82v6M70 82v6") + C(60, 60, 6),
    pince: L("M50 58L20 96M70 58l30 38") + C(60, 52, 6) + L("M54 46l-6-26h24l-6 26"),
    controleur: R(16, 54, 88, 12, 3) + L("M22 66v14h6V66M92 66v14h6V66") + L("M40 54v-8M52 54v-6M64 54v-8M76 54v-6"),
    crochets: L("M30 20v56a12 12 0 0 0 24 0v-6") + L("M66 20v56a12 12 0 0 0 24 0v-6") + R(22, 14, 16, 8, 2) + R(58, 14, 16, 8, 2),
    malette: R(14, 38, 92, 60, 6) + L("M44 38v-10h32v10") + L("M14 62h92") + R(54, 56, 12, 12, 2),
    kit: R(26, 30, 68, 60, 6) + L("M40 46l40 28M80 46L40 74") + L("M26 44h68", 'stroke-dasharray="3 3"'),
    embout: R(24, 40, 12, 40, 3) + R(50, 34, 12, 46, 3) + R(76, 44, 12, 36, 3) + L("M30 80v12M56 80v12M82 80v12"),
    adaptateur: L("M20 76h80l-10-28H40z") + C(40, 64, 5) + C(80, 64, 5) + C(52, 54, 3) + C(68, 54, 3),
    direction: R(36, 22, 48, 18, 4) + R(36, 80, 48, 18, 4) + L("M44 40v40M76 40v40", 'stroke-dasharray="4 4"'),
    sacoche: L("M16 34h88L64 92H56z") + L("M24 42h72", 'stroke-dasharray="3 3"') + L("M30 34v-8M60 34v-8M90 34v-8"),
    selle: L("M12 54c18-10 50-14 78-10 10 2 18 6 20 12-8 6-30 8-48 8-24 0-40-2-50-10z") + L("M48 64v30M70 64v30M40 94h40"),
    gardeboue: L("M14 82a46 46 0 0 1 92 0") + L("M24 82a36 36 0 0 1 72 0") + L("M60 36v-14"),
    cadre: L("M18 82l30-46h52L76 82z") + L("M48 36L40 22M100 36l6-14M76 82l24-46") + C(76, 82, 6),
    fourche: R(48, 10, 24, 14, 3) + L("M50 24v34M70 24v34") + L("M44 58l-6 46M76 58l6 46") + R(40, 56, 40, 6, 2) + C(38, 104, 3) + C(82, 104, 3),
    pedale: R(24, 30, 72, 60, 10) + R(36, 42, 48, 36, 4) + holes(60, 60, 34, 10, 1.6) + L("M60 60H8"),
    cintre: L("M8 70c14 0 20-6 30-14h44c10 8 16 14 30 14") + R(52, 50, 16, 14, 3) + L("M38 56v-6M82 56v-6", 'stroke-dasharray="2 2"'),
    poignee: R(14, 48, 92, 24, 12) + L("M30 48v24M44 48v24M58 48v24M72 48v24M86 48v24", 'stroke-dasharray="2 3"') + R(100, 46, 10, 28, 3),
    collier: C(60, 60, 30) + C(60, 60, 22) + R(84, 52, 18, 16, 3) + L("M93 52v16"),
    casque: L("M14 74c0-30 22-48 50-48s42 16 42 40v8z") + L("M14 74h92l-6 10H20z") + L("M40 34l8 18M60 28v20M80 32l-6 18") + L("M106 66l8 4"),
    tshirt: L("M40 22l-26 14 10 20 12-6v50h48V50l12 6 10-20-26-14c-4 8-10 12-20 12s-16-4-20-12z"),
    casquette: L("M20 78c0-28 18-44 40-44s40 16 40 44z") + L("M100 78c10 0 16 4 16 8H60") + C(60, 34, 3),
    gants: L("M40 104V60l-6-30a5 5 0 0 1 10-2l6 24V18a5 5 0 0 1 10 0v34V14a5 5 0 0 1 10 0v38-30a5 5 0 0 1 10 0v42l6-10a5 5 0 0 1 9 4l-12 34v10z"),
    sac: R(30, 30, 60, 72, 14) + L("M46 30c0-10 6-16 14-16s14 6 14 16") + R(42, 62, 36, 26, 6),
    chaussette: L("M44 14h30v58l20 14a10 10 0 0 1-6 18H58a14 14 0 0 1-14-14z") + L("M44 30h30", 'stroke-dasharray="3 3"') + L("M50 46h18v24H50z"),
    genou: L("M36 16h48v20c8 8 12 18 12 30s-4 22-12 30v8H36v-8c-8-8-12-18-12-30s4-22 12-30z") + C(60, 64, 18) + L("M44 64h32M60 48v32", 'stroke-dasharray="2 3"'),
    coude: L("M30 22h40c14 10 22 26 22 44s-8 34-22 44H30c10-12 14-26 14-44s-4-32-14-44z") + C(64, 66, 14),
  };

  const BIKES = {
    vtt: C(26, 80, 20) + C(94, 80, 20) + L("M26 80l20-34h34l14 34M46 46l12 34h22M80 46l-6-12h-8M46 46l-4-10h-8M58 80l-12-34") + R(48, 62, 14, 5, 2),
    route: C(26, 80, 20) + C(94, 80, 20) + L("M26 80l22-30h32l14 30M48 50l10 30h22M80 50l-4-14h-6c8 0 10 10 4 12M48 50l-4-10h-8M58 80L48 50"),
    ville: C(26, 82, 20) + C(94, 82, 20) + L("M26 82l26-28 8 28h22l12 0M52 54l30-6 12 34M82 48l-6-14h10M52 54l-4-12h-10") + L("M10 64c6-6 22-6 28 0", 'stroke-dasharray="3 3"'),
    bmx: C(28, 84, 16) + C(92, 84, 16) + L("M28 84l22-26h30l12 26M50 58l10 26h18M80 58l-2-18h-10l16-4M50 58l-4-8h-8"),
    equipement: K.casque,
    accessoires: K.bidon,
  };

  function svg(inner, cls = "picto") {
    return `<svg class="${cls}" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }

  /* Image réelle si présente dans le manifeste, sinon visuel provisoire. */
  function srcset(key, widths) {
    return widths.map(w => `assets/img/${key}-${w}.webp ${w}w`).join(", ");
  }
  function img(key, alt, opts = {}) {
    const m = (window.WB && WB.IMAGES[key]) || null;
    if (!m) return null;
    const w = m.w || [800];
    const sizes = opts.sizes || "(max-width: 700px) 100vw, 50vw";
    return `<img src="assets/img/${key}-${w[Math.min(1, w.length - 1)]}.webp" srcset="${srcset(key, w)}" sizes="${sizes}" alt="${alt || ""}" width="${m.iw || 800}" height="${m.ih || 800}" loading="${opts.eager ? "eager" : "lazy"}" decoding="async"${opts.cls ? ` class="${opts.cls}"` : ""}>`;
  }
  function product(p, opts = {}) {
    const real = img(p.img, `${p.n} ${brandName(p.b)}`, opts);
    if (real) return `<div class="pmedia is-real">${real}</div>`;
    return `<div class="pmedia is-ph" role="img" aria-label="Visuel provisoire : ${p.n}">${svg(K[p.k] || K.malette)}<span class="ph-tag">Photo à venir</span></div>`;
  }
  function scene(key, alt, kind, opts = {}) {
    const real = img(key, alt, Object.assign({ sizes: "100vw" }, opts));
    if (real) return `<div class="smedia is-real">${real}</div>`;
    const draw = BIKES[kind] || K[kind] || "";
    return `<div class="smedia is-ph" role="img" aria-label="Visuel provisoire : ${alt}"><div class="ph-scene"></div>${draw ? svg(draw, "picto ph-big") : ""}<span class="ph-tag">Visuel provisoire · ${key.split("/").pop()}</span></div>`;
  }
  function brandName(id) { const b = (window.WB && WB.BRANDS || []).find(x => x.id === id); return b ? b.name : id; }

  window.WB = Object.assign(window.WB || {}, { picto: { K, BIKES, svg, product, scene, img, brandName } });
})();
