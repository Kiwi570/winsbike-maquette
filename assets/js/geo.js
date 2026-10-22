/* Plan de géométrie du cadre Weapon BEAST à partir des cotes fabricant.
   Repère en millimètres, y vers le bas. Position du boîtier déduite des cotes (bases 435, front center 692, empattement 1124). */
(function () {
  const rad = d => d * Math.PI / 180;
  const R = [0, 0], F = [1124, 0];
  const drop = 40, BB = [Math.sqrt(435 * 435 - drop * drop), drop];
  const s = [-Math.cos(rad(73)), -Math.sin(rad(73))];
  const u = [-Math.cos(rad(66)), -Math.sin(rad(66))];
  const n = [Math.sin(rad(66)), -Math.cos(rad(66))];
  const A = [F[0] - 44 * n[0], F[1] - 44 * n[1]];
  const at = (P, d, t) => [P[0] + d[0] * t, P[1] + d[1] * t];
  const xs = y => BB[0] + (y - BB[1]) * (Math.cos(rad(73)) / Math.sin(rad(73)));
  // hauteur de douille telle que le tube horizontal effectif mesure 580 mm
  let t = 400; for (let i = 0; i < 60; i++) { const P = at(A, u, t); const f = P[0] - xs(P[1]) - 580; t += f / 0.13; }
  const HT = at(A, u, t), HB = at(A, u, t - 105), STt = at(BB, s, 406), STj = at(BB, s, 372), STp = at(BB, s, 560);
  const TTs = at(BB, s, 352), TTe = at(A, u, t - 14), DTe = at(A, u, t - 88), FK = at(A, u, 40);
  const RW = 355;

  const COTES = [
    { k: "ha", label: "Angle de direction", val: "66°" },
    { k: "sa", label: "Angle de selle", val: "73°" },
    { k: "wb", label: "Empattement", val: "1124 mm" },
    { k: "fc", label: "Front center", val: "692 mm" },
    { k: "cs", label: "Bases", val: "435 mm" },
    { k: "tet", label: "Tube horizontal effectif", val: "580 mm" },
    { k: "fork", label: "Débattement de fourche conseillé", val: "160 mm" },
    { k: "st", label: "Taille · roue", val: "16\" · 27,5\"" },
    { k: "w", label: "Poids du cadre", val: "2420 g" },
  ];

  const p = P => `${P[0].toFixed(1)} ${P[1].toFixed(1)}`;
  const line = (a, b, cls, k) => `<path class="${cls}"${k ? ` data-k="${k}"` : ""} d="M${p(a)}L${p(b)}"/>`;
  function dim(a, b, off, k, text) {
    const dx = b[0] - a[0], dy = b[1] - a[1], Ln = Math.hypot(dx, dy), nx = -dy / Ln, ny = dx / Ln;
    const a2 = [a[0] + nx * off, a[1] + ny * off], b2 = [b[0] + nx * off, b[1] + ny * off];
    const sg = off >= 0 ? 1 : -1, m = [(a2[0] + b2[0]) / 2 + nx * sg * 34, (a2[1] + b2[1]) / 2 + ny * sg * 34];
    let ang = Math.atan2(dy, dx) * 180 / Math.PI; if (ang > 90 || ang < -90) ang += 180;
    return `<g class="dim" data-k="${k}">${off ? line(a, a2, "ext") + line(b, b2, "ext") : ""}<path class="dl" d="M${p(a2)}L${p(b2)}" marker-start="url(#ar)" marker-end="url(#ar)"/>
      <text transform="translate(${p(m)}) rotate(${ang.toFixed(1)})" text-anchor="middle" dominant-baseline="middle">${text}</text></g>`;
  }

  function draw(svg) {
    svg.setAttribute("viewBox", "-420 -700 1960 1200");
    const angS = Math.atan2(s[1], s[0]), angU = Math.atan2(u[1], u[0]);
    svg.innerHTML = `<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5 0 9z" class="arh"/></marker></defs>
      <g class="ground">${line([-400, RW], [1520, RW], "gl")}</g>
      <g class="wheels"><circle class="wh" cx="0" cy="0" r="${RW}"/><circle class="wh" cx="1124" cy="0" r="${RW}"/><circle class="hubdot" cx="0" cy="0" r="9"/><circle class="hubdot" cx="1124" cy="0" r="9"/></g>
      <g class="axes">${line(at(A, u, -120), at(A, u, t + 120), "ax")}${line(at(BB, s, -60), at(BB, s, 640), "ax")}${line([HB[0] - 260, HB[1]], [HB[0] + 40, HB[1]], "ax")}${line([BB[0] - 260, BB[1]], [BB[0] + 80, BB[1]], "ax")}</g>
      <g class="frame">
        ${line(R, BB, "tube", "cs")}${line(R, STj, "tube")}${line(BB, STt, "tube", "st")}${line(STt, STp, "post")}
        ${line(TTs, TTe, "tube")}${line(BB, DTe, "tube")}${line(HB, HT, "tube head", "ha")}
        ${line(HB, FK, "fork", "fork")}${line(FK, F, "fork", "fork")}
        <circle class="bb" cx="${BB[0].toFixed(1)}" cy="${BB[1].toFixed(1)}" r="20"/>
      </g>
      <g class="dims">
        ${dim([0, RW + 70], [1124, RW + 70], 0, "wb", "EMPATTEMENT 1124")}
        ${dim(R, BB, 80, "cs", "BASES 435")}
        ${dim(BB, F, -80, "fc", "FRONT CENTER 692")}
        ${dim([xs(HT[1]), HT[1]], HT, -80, "tet", "TUBE HORIZONTAL EFFECTIF 580")}
        <g class="dim" data-k="ha"></g><g class="dim" data-k="sa"></g>
        <g class="dim" data-k="fork"><text x="${(FK[0] + 110).toFixed(1)}" y="${(FK[1] - 120).toFixed(1)}" class="tag-t">FOURCHE 160</text></g>
        <g class="dim" data-k="st"><text transform="translate(${p(at(BB, s, 200))}) rotate(${(angS * 180 / Math.PI + 180).toFixed(1)})" dy="-24" text-anchor="middle">TAILLE 16"</text></g>
      </g>`;
    // arc de l'angle de direction : de l'horizontale arrière jusqu'à l'axe de direction
    const ha = svg.querySelector('.dims .dim[data-k="ha"]');
    if (ha) {
      const r = 120, P0 = [HB[0] - r, HB[1]], P1 = [HB[0] + u[0] * r, HB[1] + u[1] * r];
      const mid = (Math.PI + angU + 2 * Math.PI) / 2, T = [HB[0] + Math.cos(mid) * (r + 50), HB[1] + Math.sin(mid) * (r + 50)];
      ha.innerHTML = `<path class="dl" d="M${p(P0)}A${r} ${r} 0 0 1 ${p(P1)}"/><text x="${T[0].toFixed(1)}" y="${T[1].toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="big">66°</text>`;
    }
    const sa = svg.querySelector('.dims .dim[data-k="sa"]');
    if (sa) {
      const r = 150, P0 = [BB[0] - r, BB[1]], P1 = [BB[0] + s[0] * r, BB[1] + s[1] * r];
      const mid = (Math.PI + angS + 2 * Math.PI) / 2, T = [BB[0] + Math.cos(mid) * (r + 54), BB[1] + Math.sin(mid) * (r + 54)];
      sa.innerHTML = `<path class="dl" d="M${p(P0)}A${r} ${r} 0 0 1 ${p(P1)}"/><text x="${T[0].toFixed(1)}" y="${T[1].toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="big">73°</text>`;
    }
  }

  function cotes(dl) {
    dl.innerHTML = COTES.map(c => `<div class="cote" data-k="${c.k}" tabindex="0"><dt>${c.label}</dt><dd>${c.val}</dd></div>`).join("");
  }

  function bind(svg, dl) {
    const set = k => {
      svg.querySelectorAll("[data-k]").forEach(e => e.classList.toggle("is-hi", e.dataset.k === k));
      svg.classList.toggle("has-hi", !!k && k !== "w");
      dl.querySelectorAll(".cote").forEach(e => e.classList.toggle("is-hi", e.dataset.k === k));
    };
    dl.addEventListener("pointerover", e => { const c = e.target.closest(".cote"); set(c ? c.dataset.k : null); });
    dl.addEventListener("pointerleave", () => set(null));
    dl.addEventListener("focusin", e => { const c = e.target.closest(".cote"); set(c ? c.dataset.k : null); });
    dl.addEventListener("focusout", () => set(null));
    svg.addEventListener("pointerover", e => { const g = e.target.closest("[data-k]"); set(g ? g.dataset.k : null); });
    svg.addEventListener("pointerleave", () => set(null));
  }

  function animate(svg, dl, trigger) {
    if (!window.gsap || !window.ScrollTrigger || window.WB.calm) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger, start: "top 70%", once: true } });
    tl.from(svg.querySelectorAll(".ground path"), { drawSVG: 0, duration: .8, ease: "power2.inOut" })
      .from(svg.querySelectorAll(".axes path"), { opacity: 0, duration: .6, stagger: .05 }, "<")
      .from(svg.querySelectorAll(".wh"), { opacity: 0, scale: .7, rotation: -90, transformOrigin: "50% 50%", duration: 1.1, ease: "power3.out" }, "<.1")
      .from(svg.querySelectorAll(".frame .tube, .frame .fork"), { drawSVG: 0, duration: .7, stagger: .07, ease: "power3.out" }, "-=.6")
      .from(svg.querySelectorAll(".frame .post"), { opacity: 0, duration: .4 }, "-=.3")
      .from(svg.querySelectorAll(".bb, .hubdot"), { scale: 0, transformOrigin: "50% 50%", duration: .4, ease: "back.out(3)" }, "-=.3")
      .from(svg.querySelectorAll(".dims .dl"), { drawSVG: 0, duration: .6, stagger: .08, ease: "power2.out" }, "-=.2")
      .from(svg.querySelectorAll(".dims text"), { opacity: 0, y: 12, duration: .4, stagger: .06 }, "-=.5")
      .from(dl.querySelectorAll(".cote"), { x: -20, opacity: 0, duration: .5, stagger: .05, ease: "power3.out" }, 0.2);
    dl.querySelectorAll("dd").forEach(dd => {
      const m = dd.textContent.match(/^(\d+)/); if (!m) return;
      const end = +m[1], rest = dd.textContent.slice(m[1].length), o = { v: 0 };
      tl.to(o, { v: end, duration: 1.2, ease: "power2.out", onUpdate: () => { dd.textContent = Math.round(o.v) + rest; } }, 0.3);
    });
  }

  window.WB = Object.assign(window.WB || {}, {
    geo(svg, dl, trigger) { draw(svg); if (dl) { cotes(dl); bind(svg, dl); } animate(svg, dl || document.createElement("dl"), trigger || svg); },
  });
})();
