/* Accueil Winsbike : effets propres à l'atelier. */
(function () {
  const WB = window.WB, { $, $$, calm, fine, sess } = WB;
  const G = window.gsap, ST = window.ScrollTrigger;
  const mm = G ? G.matchMedia() : null;
  const inView = (el, cb, margin = "0px") => { const io = new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting)), { rootMargin: margin }); io.observe(el); return io; };

  /* =========================================================
     1. Texture procédurale de l'établi (en attendant la photo Grok)
     ========================================================= */
  function benchTexture(w = 1600, h = 900) {
    const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#3a3e44"); g.addColorStop(.62, "#2c2f34"); g.addColorStop(.64, "#55595f"); g.addColorStop(1, "#24272b");
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    // panneau perforé
    const top = 40, bot = h * .62;
    x.fillStyle = "#343840"; x.fillRect(0, top, w, bot - top);
    for (let yy = top + 18; yy < bot - 8; yy += 30) for (let xx = 16; xx < w; xx += 30) {
      x.fillStyle = "#16181b"; x.beginPath(); x.arc(xx, yy, 4.2, 0, 7); x.fill();
      x.fillStyle = "rgba(255,255,255,.08)"; x.beginPath(); x.arc(xx + .8, yy + 1.4, 4.2, .2, 2.9); x.fill();
    }
    // silhouettes d'outils génériques
    const tool = (fn) => { x.save(); fn(); x.restore(); };
    const steel = (y0, y1) => { const s = x.createLinearGradient(0, y0, 0, y1); s.addColorStop(0, "#8d939b"); s.addColorStop(.5, "#5d636b"); s.addColorStop(1, "#7a8088"); return s; };
    const wrench = (cx, cy, len, rot) => tool(() => {
      x.translate(cx, cy); x.rotate(rot); x.fillStyle = steel(-10, 10);
      x.beginPath(); x.roundRect(-len / 2, -9, len, 18, 9); x.fill();
      x.beginPath(); x.arc(-len / 2, 0, 22, 0, 7); x.fill(); x.beginPath(); x.arc(len / 2, 0, 19, 0, 7); x.fill();
      x.fillStyle = "#343840"; x.beginPath(); x.arc(-len / 2 - 12, 0, 11, 0, 7); x.fill(); x.beginPath(); x.roundRect(len / 2 + 2, -7, 22, 14, 3); x.fill();
      x.fillStyle = "#16181b"; x.beginPath(); x.arc(-len / 2, -32, 4, 0, 7); x.fill();
    });
    [[150, 300, 300, -1.48], [215, 310, 280, -1.5], [275, 320, 250, -1.52], [330, 330, 220, -1.53], [380, 336, 190, -1.55]].forEach(a => wrench(...a));
    // clés 6 pans en L
    for (let i = 0; i < 8; i++) tool(() => {
      x.translate(470 + i * 26, 160); x.fillStyle = steel(0, 10); const L = 120 - i * 9;
      x.fillRect(0, 0, 9 - i * .5, L); x.fillRect(0, L - 9, 34 - i, 9 - i * .5);
    });
    // roue suspendue
    tool(() => {
      x.translate(1250, 300); x.strokeStyle = "#1c1e21"; x.lineWidth = 26; x.beginPath(); x.arc(0, 0, 210, 0, 7); x.stroke();
      x.strokeStyle = "#7d838b"; x.lineWidth = 9; x.beginPath(); x.arc(0, 0, 190, 0, 7); x.stroke();
      x.strokeStyle = "rgba(160,166,174,.75)"; x.lineWidth = 1.4;
      for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, b = a + (i % 2 ? .35 : -.35); x.beginPath(); x.moveTo(Math.cos(b) * 18, Math.sin(b) * 18); x.lineTo(Math.cos(a) * 186, Math.sin(a) * 186); x.stroke(); }
      x.fillStyle = "#8d939b"; x.beginPath(); x.arc(0, 0, 22, 0, 7); x.fill();
      x.strokeStyle = "#16181b"; x.lineWidth = 6; x.beginPath(); x.moveTo(0, -236); x.lineTo(0, -300); x.stroke();
    });
    // pince
    tool(() => { x.translate(820, 210); x.rotate(.12); x.fillStyle = "#c2481a"; x.beginPath(); x.roundRect(-14, 40, 14, 150, 7); x.fill(); x.beginPath(); x.roundRect(8, 40, 14, 150, 7); x.fill(); x.fillStyle = steel(0, 40); x.beginPath(); x.moveTo(-10, 46); x.lineTo(-4, -30); x.lineTo(6, -30); x.lineTo(16, 46); x.fill(); });
    // pompe
    tool(() => { x.translate(960, 150); x.fillStyle = steel(0, 300); x.fillRect(-12, 0, 24, 320); x.fillRect(-60, -14, 120, 16); x.fillStyle = "#16181b"; x.fillRect(-46, 320, 92, 12); });
    // plan de travail en acier brossé
    const by = h * .64;
    for (let i = 0; i < 1400; i++) { x.strokeStyle = `rgba(${Math.random() > .5 ? "255,255,255" : "0,0,0"},${Math.random() * .06})`; x.lineWidth = 1; const yy = by + Math.random() * (h - by); x.beginPath(); x.moveTo(Math.random() * w, yy); x.lineTo(Math.random() * w, yy); x.stroke(); }
    x.fillStyle = "rgba(255,255,255,.22)"; x.fillRect(0, by, w, 2);
    x.fillStyle = "rgba(0,0,0,.45)"; x.fillRect(0, by + 2, w, 6);
    // cassette et disque posés sur l'établi
    tool(() => { x.translate(620, h * .8); x.scale(1, .32); for (let r = 120; r > 30; r -= 9) { x.strokeStyle = r % 18 ? "#9aa0a8" : "#5d636b"; x.lineWidth = 6; x.beginPath(); x.arc(0, 0, r, 0, 7); x.stroke(); } });
    tool(() => { x.translate(1080, h * .82); x.scale(1, .3); x.strokeStyle = "#b9bec5"; x.lineWidth = 18; x.beginPath(); x.arc(0, 0, 150, 0, 7); x.stroke(); x.lineWidth = 5; for (let i = 0; i < 6; i++) { const a = i / 6 * 7; x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * 140, Math.sin(a) * 140); x.stroke(); } x.fillStyle = "#c2481a"; x.beginPath(); x.arc(0, 0, 40, 0, 7); x.fill(); });
    return c;
  }

  /* =========================================================
     2. Lampe d'atelier WebGL (OGL) + version sans WebGL
     ========================================================= */
  function heroLamp() {
    const hero = $(".hero"), canvas = $(".hero-gl"), fb = $(".hero-fallback");
    const key = innerWidth < 700 && WB.IMAGES["grok/accueil-hero-9x16"] ? "grok/accueil-hero-9x16" : "grok/accueil-hero-16x9";
    const realSrc = WB.IMAGES[key] ? `assets/img/${key}-${WB.IMAGES[key].w.slice(-1)[0]}.webp` : null;
    const mouse = { x: .62, y: .38, tx: .62, ty: .38, active: false };
    hero.addEventListener("pointermove", e => { const r = hero.getBoundingClientRect(); mouse.tx = (e.clientX - r.left) / r.width; mouse.ty = (e.clientY - r.top) / r.height; mouse.active = true; }, { passive: true });
    hero.addEventListener("pointerleave", () => { mouse.active = false; });

    const useCss = (src) => {
      canvas.remove(); hero.classList.add("no-gl"); if (realSrc) fb.classList.add("flip");
      fb.style.backgroundImage = `url(${src})`;
      if (calm) return;
      const loop = () => {
        if (!mouse.active) { const t = performance.now() / 1000; mouse.tx = .55 + Math.sin(t * .4) * .25; mouse.ty = .4 + Math.cos(t * .3) * .15; }
        mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08;
        hero.style.setProperty("--mx", (mouse.x * 100).toFixed(2) + "%"); hero.style.setProperty("--my", (mouse.y * 100).toFixed(2) + "%");
        requestAnimationFrame(loop);
      }; loop();
    };

    const withSource = (cb) => {
      if (!realSrc) { const c = benchTexture(); cb(c, c.toDataURL("image/jpeg", .82)); return; }
      const im = new Image(); im.onload = () => cb(im, realSrc); im.onerror = () => { const c = benchTexture(); cb(c, c.toDataURL("image/jpeg", .82)); }; im.src = realSrc;
    };

    withSource((source, url) => {
      if (calm || !window.OGL) return useCss(url);
      let renderer;
      try { renderer = new OGL.Renderer({ canvas, dpr: Math.min(devicePixelRatio, 1.5), alpha: false, antialias: false }); } catch (e) { return useCss(url); }
      const gl = renderer.gl; if (!gl) return useCss(url);
      const tex = new OGL.Texture(gl, { image: source, generateMipmaps: false });
      const geometry = new OGL.Triangle(gl);
      const program = new OGL.Program(gl, {
        vertex: `attribute vec2 uv; attribute vec2 position; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 0., 1.); }`,
        fragment: `precision highp float;
          uniform sampler2D tMap; uniform vec2 uRes; uniform vec2 uImg; uniform vec2 uMouse; uniform float uTime; uniform float uOn; uniform float uFlip;
          varying vec2 vUv;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          void main(){
            float rs = uRes.x / uRes.y, ri = uImg.x / uImg.y;
            vec2 sc = rs < ri ? vec2(rs / ri, 1.) : vec2(1., ri / rs);
            vec2 uv = (vUv - .5) * sc + .5; if (uFlip > .5) uv.x = 1. - uv.x;
            vec3 col = texture2D(tMap, uv).rgb;
            vec2 p = vUv * uRes; vec2 m = vec2(uMouse.x, 1. - uMouse.y) * uRes;
            vec2 dv = (p - m) / uRes.y; dv.y *= 1.15;
            float d = length(dv);
            float light = pow(smoothstep(.62, 0., d), 1.7) * uOn;
            float rim = smoothstep(.62, .2, d) * .25 * uOn;
            vec3 warm = vec3(1., .80, .62);
            vec3 c = col * (.13 + light * 1.55 * warm + rim * vec3(1., .42, .2));
            float dust = 0.;
            for (int i = 0; i < 3; i++) {
              float fi = float(i); vec2 g = p / (5. + fi * 4.) + vec2(sin(uTime * .2 + fi) * 2., -uTime * (1.5 + fi * .7));
              vec2 id = floor(g); vec2 f = fract(g) - .5;
              float n = hash(id + fi * 13.);
              dust += step(.992, n) * smoothstep(.22, 0., length(f));
            }
            c += dust * light * .55 * warm;
            c *= smoothstep(1.25, .35, length((vUv - .5) * vec2(1.25, 1.1)));
            c += (hash(vUv * uRes + fract(uTime) * 100.) - .5) * .03;
            gl_FragColor = vec4(c, 1.);
          }`,
        uniforms: { tMap: { value: tex }, uRes: { value: new OGL.Vec2(1, 1) }, uImg: { value: new OGL.Vec2(source.width, source.height) }, uMouse: { value: new OGL.Vec2(.62, .38) }, uTime: { value: 0 }, uOn: { value: 0 }, uFlip: { value: realSrc ? 1 : 0 } },
      });
      const mesh = new OGL.Mesh(gl, { geometry, program });
      const resize = () => { const r = hero.getBoundingClientRect(); renderer.setSize(r.width, r.height); program.uniforms.uRes.value.set(r.width, r.height); };
      resize(); addEventListener("resize", resize);
      let visible = true, raf = 0;
      inView(hero, v => { visible = v; if (v && !raf) raf = requestAnimationFrame(tick); });
      function tick(t) {
        raf = 0; if (!visible) return;
        if (!mouse.active) { const s = t / 1000; mouse.tx = .58 + Math.sin(s * .35) * .22; mouse.ty = .42 + Math.cos(s * .27) * .14; }
        mouse.x += (mouse.tx - mouse.x) * .07; mouse.y += (mouse.ty - mouse.y) * .07;
        program.uniforms.uMouse.value.set(mouse.x, mouse.y); program.uniforms.uTime.value = t / 1000;
        renderer.render({ scene: mesh }); raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      WB.lampOn = () => G ? G.to(program.uniforms.uOn, { value: 1, duration: 1.4, ease: "power2.out" }) : (program.uniforms.uOn.value = 1);
      if (WB._lampPending) WB.lampOn();
      canvas.addEventListener("webglcontextlost", () => useCss(url));
    });
  }

  /* =========================================================
     3. Ouverture : serrage au couple, puis entrée du héros
     ========================================================= */
  function heroIn(delay = 0) {
    if (WB.lampOn) WB.lampOn(); else WB._lampPending = true;
    if (!G || calm) return;
    const tl = G.timeline({ delay });
    const title = $(".hero-title");
    if (window.SplitText) {
      const sp = new SplitText(title, { type: "words,chars", charsClass: "hc" });
      tl.from(sp.chars, { yPercent: -60, scaleY: 1.6, opacity: 0, duration: .55, stagger: .035, ease: "stamp", transformOrigin: "50% 0%" });
    }
    tl.from(".hero-eyebrow", { y: 16, opacity: 0, duration: .6 }, 0)
      .from(".hero-dim i", { scaleX: 0, duration: .8, ease: "power3.inOut" }, .35)
      .from(".hero-dim span", { opacity: 0, duration: .4 }, .7)
      .from(".hero-lead", { y: 24, opacity: 0, duration: .8, ease: "power3.out" }, .5)
      .from(".hero-ctas > *", { y: 24, opacity: 0, duration: .7, stagger: .08, ease: "power3.out" }, .6)
      .from(".ticker", { yPercent: 100, duration: .7, ease: "power3.out" }, .7)
      .from(".hero-spec", { opacity: 0, duration: .6 }, 1);
  }

  function intro() {
    const ld = $("#loader");
    const skip = !ld || calm || !G || document.documentElement.classList.contains("no-intro") || document.documentElement.classList.contains("nav-in");
    if (skip) { if (ld) ld.remove(); const a = WB.arrive(); heroIn(a ? .45 : .1); return; }
    sess.set("intro", "1");
    // graduations
    const marks = $(".ld-marks"); marks.innerHTML = Array.from({ length: 36 }, (_, i) => `<line x1="0" y1="-62" x2="0" y2="${i % 3 ? -57 : -52}" transform="rotate(${i * 10})"/>`).join("");
    const ticks = $(".ld-ticks"); ticks.innerHTML = Array.from({ length: 11 }, (_, i) => { const a = Math.PI + i / 10 * Math.PI, r1 = 100, r2 = i % 2 ? 92 : 86; return `<line x1="${120 + Math.cos(a) * r1}" y1="${120 + Math.sin(a) * r1}" x2="${120 + Math.cos(a) * r2}" y2="${120 + Math.sin(a) * r2}"/>${i % 2 ? "" : `<text x="${120 + Math.cos(a) * 72}" y="${124 + Math.sin(a) * 72}" text-anchor="middle">${i / 2}</text>`}`; }).join("");
    const val = $(".ld-val"), o = { v: 0 };
    const tl = G.timeline({ onComplete: () => { ld.remove(); } });
    tl.set(".ld-needle", { rotation: -90, svgOrigin: "120 120" })
      .from(".loader-in", { opacity: 0, scale: .96, duration: .3 })
      .to(".ld-head", { rotation: 120, duration: 1.2, ease: "steps(6)", svgOrigin: "0 0" }, .15)
      .to(".ld-needle", { rotation: 90, duration: 1.25, ease: "torque" }, .15)
      .fromTo(".ld-arc-on", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.25, ease: "torque" }, .15)
      .to(o, { v: 5, duration: 1.25, ease: "torque", onUpdate: () => val.textContent = o.v.toFixed(1) }, .15)
      .add(() => { $(".ld-msg").textContent = "clic"; ld.classList.add("is-click"); WB.sound.clac(); }, 1.42)
      .to(".ld-washer", { stroke: "#FF5A1F", duration: .12, yoyo: true, repeat: 1 }, 1.42)
      .to(".loader-in", { scale: .9, opacity: 0, duration: .35, ease: "power2.in" }, 1.7)
      .to(ld, { clipPath: "inset(0 0 100% 0)", duration: .7, ease: "power4.inOut" }, 1.85)
      .add(() => heroIn(0), 2.0);
  }

  /* =========================================================
     4. Bandeau défilant qui accélère avec le défilement
     ========================================================= */
  function ticker() {
    const tr = $(".ticker-track"); if (!G || calm) return;
    const loop = G.to(tr, { xPercent: -50, repeat: -1, ease: "none", duration: 38 });
    if (ST) ST.create({ trigger: ".hero", start: "top top", end: "bottom top", onUpdate: s => { const v = Math.min(5, 1 + Math.abs(s.getVelocity()) / 500); G.to(loop, { timeScale: v * (s.direction > 0 ? 1 : -1), duration: .2, overwrite: true }); G.to(loop, { timeScale: 1, duration: 1.2, delay: .25 }); } });
  }

  /* =========================================================
     5. Vue éclatée du moyeu, pilotée par le défilement
     ========================================================= */
  function hub() {
    const svg = $("#hub"); if (!svg) return;
    const parts = [
      { n: 1, name: "Embout gauche", d: "M-152-22h20v44h-20z M-148-12h12v24h-12z", sx: -300, ly: -175 },
      { n: 2, name: "Roulement gauche", d: "M-128-30h20v60h-20z", balls: [-118], sx: -210, ly: -205 },
      { n: 3, name: "Corps de moyeu", d: "M-104-24h150v48h-150z M-104-76h12v152h-12z M34-76h12v152h-12z", holes: [-98, 40], sx: -40, ly: -175 },
      { n: 4, name: "Roulement droit", d: "M48-30h20v60h-20z", balls: [58], sx: 120, ly: -205 },
      { n: 5, name: "Corps de roue libre", d: "M70-34h64v68h-64z", splines: true, sx: 205, ly: -175 },
      { n: 6, name: "Embout droit", d: "M136-22h20v44h-20z M140-12h12v24h-12z", sx: 300, ly: -205 },
    ];
    const axle = { n: 7, name: "Axe traversant", d: "M-196-8h392v16h-392z", sy: 150 };
    const balls = (x) => [-20, -10, 0, 10, 20].map(y => `<circle cx="${x}" cy="${y}" r="4.2" class="ball"/>`).join("");
    const label = (pt, cx, cy, ly) => `<g class="hlab" data-n="${pt.n}"><path class="lead" d="M${cx} ${cy}V${ly + 16}"/><circle class="lnum" cx="${cx}" cy="${ly}" r="15"/><text x="${cx}" y="${ly + 1}" class="lnum-t" text-anchor="middle" dominant-baseline="middle">${pt.n}</text></g>`;
    svg.innerHTML = `<defs><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" class="hatch"/></pattern>
      <marker id="har" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1L9 5 0 9z" class="arh"/></marker></defs>
      <path class="cl" d="M-440 0H440"/>
      <g class="hdim"><path class="dl" d="M-152-112H156" marker-start="url(#har)" marker-end="url(#har)"/><path class="ext" d="M-152-28V-120M156-28V-120"/><text x="2" y="-124" text-anchor="middle">ENTRAXE 142</text></g>
      <g class="hpart" data-n="7"><path d="${axle.d}" class="body"/><path d="M-196 0H196" class="cl2"/></g>
      ${parts.map(pt => `<g class="hpart" data-n="${pt.n}"><path d="${pt.d}" class="body"/>${pt.balls ? balls(pt.balls[0]) : ""}${pt.holes ? pt.holes.map(x => [-60, -44, 44, 60].map(y => `<circle cx="${x}" cy="${y}" r="3" class="hole"/>`).join("")).join("") : ""}${pt.splines ? Array.from({ length: 7 }, (_, i) => `<path d="M${76 + i * 9}-34v68" class="spl"/>`).join("") : ""}</g>`).join("")}
      <g class="hlabels">${parts.map(pt => { const bb = pt.d.match(/M(-?\d+)-?(\d+)h(\d+)/); const x0 = +bb[1], w = +bb[3]; return label(pt, x0 + w / 2 + pt.sx, -34, pt.ly); }).join("")}
        ${label(axle, 150, 150 - 8, 205).replace(/V(\S+)"/, (m, v) => `V${195 - 16}"`)}</g>`;
    // étiquette de l'axe sous la pièce
    const al = svg.querySelector('.hlab[data-n="7"]');
    if (al) { al.querySelector(".lead").setAttribute("d", "M150 158V190"); al.querySelector(".lnum").setAttribute("cy", 205); al.querySelector(".lnum-t").setAttribute("y", 206); }
    const legend = $$(".ecl-legend li");
    const set = (k) => legend.forEach((li, i) => li.classList.toggle("is-on", i < k));

    if (!G || calm) {
      parts.forEach(pt => svg.querySelector(`.hpart[data-n="${pt.n}"]`).setAttribute("transform", `translate(${pt.sx} 0)`));
      svg.querySelector('.hpart[data-n="7"]').setAttribute("transform", "translate(0 150)");
      svg.querySelector(".hdim").style.opacity = .25; set(7); return;
    }
    const build = () => {
      const tl = G.timeline({ defaults: { ease: "power2.inOut" } });
      tl.to(".hdim", { opacity: .15, duration: .3 }, 0);
      parts.forEach((pt, i) => tl.to(`.hpart[data-n="${pt.n}"]`, { x: pt.sx, duration: 1 }, .1 + Math.abs(i - 2.5) * .04));
      tl.to('.hpart[data-n="7"]', { y: 150, duration: .9 }, .3);
      tl.from(".hlab .lead", { drawSVG: 0, duration: .5, stagger: .07 }, .9)
        .from(".hlab .lnum, .hlab .lnum-t", { scale: 0, transformOrigin: "50% 50%", duration: .35, stagger: .05, ease: "back.out(3)" }, 1.0)
        .add(() => { }, 1.8);
      tl.eventCallback("onUpdate", () => set(Math.round(Math.max(0, (tl.progress() - .45) / .5) * 7)));
      return tl;
    };
    mm.add("(min-width: 900px)", () => {
      const tl = build();
      ST.create({ trigger: ".ecl-pin", start: "top top", end: "+=140%", pin: true, scrub: .8, animation: tl, anticipatePin: 1 });
    });
    mm.add("(max-width: 899px)", () => {
      const tl = build(); tl.pause();
      ST.create({ trigger: "#hub", start: "top 75%", once: true, onEnter: () => tl.duration(2.2).play() });
    });
  }

  /* =========================================================
     6. Grilles de cartes produit déclarées dans le HTML
     ========================================================= */
  function cards() {
    $$("[data-cards]").forEach(el => { el.innerHTML = el.dataset.cards.split(",").map(id => WB.card(WB.byId(id))).join(""); });
    $$("[data-product]").forEach(el => { el.innerHTML = WB.picto.product(WB.byId(el.dataset.product), { sizes: "(max-width:900px) 60vw, 30vw" }); });
  }

  /* =========================================================
     7. La servante : tiroirs-marques
     ========================================================= */
  function servante() {
    const body = $(".servante-body"), side = $("#tir-panel"); if (!body) return;
    body.innerHTML = WB.BRANDS.map((b, i) => `<button type="button" class="tiroir" role="tab" id="tir-${b.id}" aria-selected="${i === 0}" aria-controls="tir-panel" data-brand="${b.id}" data-cursor="Ouvrir">
      <span class="tiroir-tray" aria-hidden="true"></span>
      <span class="tiroir-face">
        <span class="tiroir-plate">${WB.picto.img("marques/" + (b.id === "crazy" ? "crazy-safety" : b.id === "allwings" ? "all-wings" : b.id), b.name, { sizes: "200px", eager: true }) || `<span class="tiroir-name">${b.name}</span>`}</span>
        <span class="tiroir-meta"><span class="mono tiroir-count"><b data-count="${b.count}">${b.count}</b> réf.</span><span class="mono tiroir-excl">${b.excl ? "Exclusivité France" : "Au catalogue"}</span></span>
        <span class="tiroir-handle" aria-hidden="true"></span>
      </span></button>`).join("");
    const show = (id, anim) => {
      const b = WB.BRANDS.find(x => x.id === id);
      $$(".tiroir", body).forEach(t => { const on = t.dataset.brand === id; t.setAttribute("aria-selected", on); t.classList.toggle("is-open", on); });
      side.setAttribute("aria-labelledby", "tir-" + id);
      side.innerHTML = `<div class="side-hd"><p class="mono eyebrow">${b.excl ? "Distributeur exclusif France" : "Au catalogue Winsbike"}</p><h3 class="h3">${b.name}</h3><p>${b.line}</p><p class="mono side-count">${b.count} référence${b.count > 1 ? "s" : ""} sur winsbike.fr</p></div>
        <div class="side-cards">${b.show.map(pid => WB.card(WB.byId(pid), { cls: "pcard-sm" })).join("")}</div>
        ${b.url ? `<a class="btn" href="${b.url}" data-magnetic>Voir la marque ${b.name}</a>` : `<a class="btn btn-ghost" href="#" data-soon="Page marque ${b.name} : même modèle que la page Sumart, prévue dans le site complet.">Voir la marque ${b.name}</a>`}`;
      if (anim && G && !calm) {
        G.from(side.querySelector(".side-hd"), { x: 30, opacity: 0, duration: .5, ease: "power3.out" });
        G.from(side.querySelectorAll(".pcard"), { y: 40, opacity: 0, rotateX: -30, duration: .6, stagger: .07, ease: "power3.out" });
      }
    };
    show(WB.BRANDS[0].id, false);
    body.addEventListener("click", e => { const t = e.target.closest(".tiroir"); if (t) { show(t.dataset.brand, true); WB.sound.ratchet(); } });
    body.addEventListener("keydown", e => {
      if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
      const all = $$(".tiroir", body), i = all.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); const n = all[(i + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length]; n.focus(); show(n.dataset.brand, true);
    });
    if (G && ST && !calm) {
      const tl = G.timeline({ scrollTrigger: { trigger: body, start: "top 75%", once: true } });
      tl.from(".tiroir", { x: -60, opacity: 0, duration: .6, stagger: .08, ease: "power3.out" });
      $$(".tiroir").forEach((t, i) => tl.to(t.querySelector(".tiroir-face"), { y: 8, duration: .14, yoyo: true, repeat: 1, ease: "power2.out" }, .5 + i * .07));
      $$("[data-count]", body).forEach(b => { const o = { v: 0 }, end = +b.dataset.count; tl.to(o, { v: end, duration: 1, ease: "power2.out", onUpdate: () => b.textContent = Math.round(o.v) }, .4); });
    }
  }

  /* =========================================================
     8. Par pratique : cartes révélées par une ligne laser
     ========================================================= */
  function pratiques() {
    const PR = [
      { k: "vtt", name: "VTT", prod: 67, alt: "grok/cadre-sentier-9x16", subs: ["Cadres", "Cassettes", "Cintres", "Disques", "Fourches", "Freins", "Garde-boue", "Jantes et roues", "Lumières", "Moyeux", "Pédales", "Pédaliers", "Plateaux", "Pneus", "Poignées", "Porte-bagages", "Potences et jeux de direction", "Selles", "Tiges de selle", "Accessoires"] },
      { k: "route", name: "Route", prod: 170, subs: ["Guidoline", "Cintres", "Pédaliers et plateaux", "Boîtiers de pédalier", "Fourches", "Pédales", "Freinage", "Dérailleurs avant", "Dérailleurs arrière", "Manettes", "Cassettes", "Chaînes", "Selles", "Tiges de selle", "Pneus et chambres à air", "Accessoires", "Potences"] },
      { k: "ville", name: "Ville", prod: 182, subs: ["Cassettes", "Dérailleurs avant", "Dérailleurs arrière", "Freinage", "Manettes", "Poignées", "Selles"] },
      { k: "bmx", name: "BMX", prod: 99, subs: ["Chaînes", "Freinage", "Manettes", "Pédales", "Pneus et fonds de jante", "Poignées", "Potences", "Selles", "Chambres à air"] },
      { k: "equipement", name: "Équipement", prod: 191, subs: ["Casques VTT", "Casques route", "Casques urbains", "Casques BMX", "Gants", "Maillots", "Protections adulte", "Protections enfant", "Chaussettes", "Pantalons et shorts"] },
      { k: "accessoires", name: "Accessoires", prod: 149, subs: ["Bagagerie", "Bidons et porte-bidons", "Électronique", "Lumières", "Porte-bagages", "Outillage", "Divers"] },
    ];
    const grid = $(".prat-grid"); if (!grid) return;
    grid.innerHTML = PR.map(r => {
      let scene = `grok/pratique-${r.k}-4x5`; if (!WB.IMAGES[scene] && r.alt && WB.IMAGES[r.alt]) scene = r.alt; const has = WB.IMAGES[scene];
      const media = has ? WB.picto.scene(scene, r.name, r.k, { sizes: "(max-width:700px) 90vw, 33vw" }) : `<div class="prat-prod">${WB.picto.product(WB.byId(r.prod), { sizes: "(max-width:700px) 90vw, 33vw" })}</div>`;
      return `<a class="prat" href="#" data-soon="Rayon ${r.name} : page catégorie prévue dans le site complet." data-tilt data-cursor="Explorer">
        <div class="prat-media">${media}<i class="laser" aria-hidden="true"></i></div>
        <div class="prat-body"><h3 class="prat-name">${r.name}</h3><p class="mono prat-count">${r.subs.length} rubriques</p>
          <ul class="prat-subs">${r.subs.slice(0, 5).map(s => `<li>${s}</li>`).join("")}${r.subs.length > 5 ? `<li class="more">+${r.subs.length - 5}</li>` : ""}</ul></div></a>`;
    }).join("");
    if (!G || !ST || calm) return;
    $$(".prat").forEach((card, i) => {
      const tl = G.timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true }, delay: (i % 3) * .12 });
      tl.fromTo(card.querySelector(".prat-media"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: .9, ease: "power3.inOut" })
        .fromTo(card.querySelector(".laser"), { top: "0%", opacity: 1 }, { top: "100%", duration: .9, ease: "power3.inOut" }, 0)
        .to(card.querySelector(".laser"), { opacity: 0, duration: .25 })
        .from(card.querySelectorAll(".prat-name, .prat-count, .prat-subs li"), { y: 16, opacity: 0, duration: .4, stagger: .03 }, .4);
    });
  }

  /* =========================================================
     9. Le mur à outils : étiquettes suspendues qui se balancent
     ========================================================= */
  function mur() {
    const board = $(".mur-board"); if (!board) return;
    const bg = $(".mur-bg");
    const pkey = innerWidth < 700 && WB.IMAGES["grok/panneau-perfore-9x16"] ? "grok/panneau-perfore-9x16" : "grok/panneau-perfore-16x9";
    if (WB.IMAGES[pkey]) bg.innerHTML = WB.picto.scene(pkey, "Panneau perforé", "", { sizes: "100vw" });
    const ids = [147, 167, 131, 171, 166, 159, 162, 161, 158, 154];
    board.innerHTML = ids.map((id, i) => { const p = WB.byId(id); return `<article class="tag" data-id="${id}">
      <i class="tag-pin" aria-hidden="true"></i>
      <div class="tag-swing"><i class="tag-cord" aria-hidden="true"></i>
        <div class="tag-card"><span class="tag-hole" aria-hidden="true"></span>
          <p class="mono tag-rank">N°${i + 1} des ventes</p>
          <button type="button" class="tag-media" data-quick="${id}" aria-label="Aperçu rapide : ${p.n}">${WB.picto.product(p, { sizes: "(max-width:700px) 60vw, 18vw" })}</button>
          <h3 class="tag-name">${p.n}</h3>
          ${WB.variantUI(p, true)}
          <div class="tag-foot"><span class="price">${WB.fmt(p.p)}</span><button type="button" class="btn-add" data-add="${id}" data-magnetic>Ajouter</button></div>
        </div></div></article>`; }).join("");
    const tags = $$(".tag", board).map(el => ({ el, sw: el.querySelector(".tag-swing"), a: 0, v: 0 }));
    if (calm) return;
    let lastX = 0, lastT = 0, running = false, visible = false;
    const step = () => {
      let energy = 0;
      tags.forEach(t => { t.v += (-0.045 * t.a - 0.075 * t.v); t.a += t.v; energy += Math.abs(t.a) + Math.abs(t.v); t.sw.style.transform = `rotate(${t.a.toFixed(3)}deg)`; });
      if (energy > .02 && visible) requestAnimationFrame(step); else running = false;
    };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(step); } };
    board.addEventListener("pointermove", e => {
      const now = performance.now(), dt = Math.max(8, now - lastT), vx = (e.clientX - lastX) / dt; lastX = e.clientX; lastT = now;
      const tag = e.target.closest(".tag"); if (!tag) return;
      const t = tags.find(x => x.el === tag); t.v += Math.max(-1.6, Math.min(1.6, vx * .9)); kick();
    }, { passive: true });
    board.addEventListener("pointerenter", () => WB.sound.ratchet());
    inView(board, v => { visible = v; if (v) kick(); });
    if (G && ST) {
      G.from($$(".tag-swing", board), { y: -160, opacity: 0, duration: .9, stagger: { each: .06, from: "random" }, ease: "bounce.out",
        scrollTrigger: { trigger: board, start: "top 80%", once: true }, onComplete: () => { tags.forEach(t => { t.v = (Math.random() - .5) * 3; }); kick(); } });
    }
  }

  /* =========================================================
     10. Trame de protection qui se contracte sous le curseur
     ========================================================= */
  function hexgrid() {
    const cv = $(".hexgrid"); if (!cv) return;
    const box = cv.parentElement, ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = Math.min(devicePixelRatio, 2), cells = [], mx = -999, my = -999, active = false, impacts = [], visible = false, raf = 0;
    const R = 22;
    const resize = () => {
      const r = box.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
      cells = []; const w = Math.sqrt(3) * R, h = 1.5 * R;
      for (let y = -R, row = 0; y < H + R; y += h, row++) for (let x = -w + (row % 2 ? w / 2 : 0); x < W + w; x += w) cells.push([x, y]);
    };
    resize(); addEventListener("resize", resize);
    box.addEventListener("pointermove", e => { const r = box.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; active = true; }, { passive: true });
    box.addEventListener("pointerleave", () => { active = false; });
    box.addEventListener("pointerdown", e => { const r = box.getBoundingClientRect(); impacts.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 }); WB.sound.clac(); });
    const hex = (x, y, r) => { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; ctx[i ? "lineTo" : "moveTo"](x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); };
    let lastImpact = 0;
    const frame = (t) => {
      raf = 0; if (!visible) return;
      if (!active && t - lastImpact > 2600) { impacts.push({ x: W * (.25 + Math.random() * .5), y: H * (.25 + Math.random() * .5), t: 0 }); lastImpact = t; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      impacts.forEach(im => im.t += 1 / 60); impacts = impacts.filter(im => im.t < 1.6);
      for (const [x, y] of cells) {
        let k = 0;
        if (active) { const d = Math.hypot(x - mx, y - my); k = Math.max(k, Math.exp(-(d * d) / (2 * 90 * 90))); }
        for (const im of impacts) { const d = Math.hypot(x - im.x, y - im.y), ring = im.t * 260; k = Math.max(k, Math.exp(-((d - ring) ** 2) / (2 * 30 * 30)) * (1 - im.t / 1.6)); }
        const r = R * (0.92 - k * .42);
        hex(x, y, r);
        ctx.strokeStyle = `rgba(255,90,31,${.16 + k * .7})`; ctx.lineWidth = 1 + k * 1.5; ctx.stroke();
        if (k > .08) { ctx.fillStyle = `rgba(255,90,31,${k * .32})`; ctx.fill(); }
      }
      raf = requestAnimationFrame(frame);
    };
    if (calm) { visible = true; frame(0); visible = false; return; }
    inView(box, v => { visible = v; if (v && !raf) raf = requestAnimationFrame(frame); });
  }

  /* =========================================================
     11. Guide des tailles casque adulte (tailles de la fiche produit)
     ========================================================= */
  function sizer() {
    const r = $("#tete"), out = $("#tete-out"), res = $("#sizer-res"); if (!r) return;
    const up = () => {
      const v = +r.value; out.textContent = v.toString().replace(".", ",") + " cm";
      let t;
      if (v < 54) t = "En dessous de la taille M : demandez conseil à l'atelier.";
      else if (v < 57) t = "<strong>Taille M</strong> (54–57 cm).";
      else if (v === 57) t = "Entre M et L : l'idéal est d'essayer en magasin.";
      else if (v <= 61) t = "<strong>Taille L</strong> (57–61 cm).";
      else t = "Au-delà de la taille L : demandez conseil à l'atelier.";
      res.innerHTML = t;
    };
    r.addEventListener("input", up); up();
  }

  /* =========================================================
     12. L'atelier : rideau métallique, cadran horaire, plan de situation
     ========================================================= */
  function atelier() {
    const today = WB.parisNow().d;
    $$(".hours tr").forEach(tr => tr.classList.toggle("is-today", +tr.dataset.d === today));
    const dial = $("#dial");
    const drawDial = () => {
      const { d, h } = WB.parisNow(), slots = WB.HOURS[d];
      const ang = hr => (hr / 24) * Math.PI * 2 - Math.PI / 2, P = (hr, r) => [Math.cos(ang(hr)) * r, Math.sin(ang(hr)) * r];
      const arc = ([a, b]) => { const [x0, y0] = P(a, 86), [x1, y1] = P(b, 86); return `<path class="d-open" d="M${x0.toFixed(1)} ${y0.toFixed(1)}A86 86 0 ${b - a > 12 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}"/>`; };
      const [nx, ny] = P(h, 74);
      dial.innerHTML = `<circle r="86" class="d-ring"/>${slots.map(arc).join("")}
        ${Array.from({ length: 24 }, (_, i) => { const [a, b] = P(i, 100), [c, e] = P(i, i % 6 ? 95 : 90); return `<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${e.toFixed(1)}" class="d-tick"/>`; }).join("")}
        ${[0, 6, 12, 18].map(i => { const [a, b] = P(i, 66); return `<text x="${a.toFixed(1)}" y="${b.toFixed(1)}" class="d-num" text-anchor="middle" dominant-baseline="middle">${i}h</text>`; }).join("")}
        <line x1="0" y1="0" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" class="d-needle"/><circle r="5" class="d-pivot"/>
        <text y="30" class="d-day" text-anchor="middle">${["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."][d]}</text>`;
    };
    if (dial) { drawDial(); setInterval(drawDial, 60000); }

    const loc = $("#locator");
    if (loc) {
      loc.innerHTML = `<g class="lc-grid">${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 50} 0V340"/>`).join("")}${Array.from({ length: 8 }, (_, i) => `<path d="M0 ${i * 50}H600"/>`).join("")}</g>
        <g class="lc-rings">${[46, 96, 150].map(r => `<circle cx="300" cy="170" r="${r}"/>`).join("")}</g>
        <path class="lc-cross" d="M300 6V334M8 170H592"/>
        <g class="lc-n"><path d="M556 52l12-30 12 30-12-8z"/><text x="568" y="70" text-anchor="middle">N</text></g>
        <g class="lc-pin"><circle cx="300" cy="170" r="18" class="lc-pulse"/><circle cx="300" cy="170" r="7"/></g>
        <text x="322" y="160" class="lc-name">ROSTRENEN</text>
        <text x="322" y="182" class="lc-sub">48,235° N · 3,317° O</text>
        <text x="16" y="28" class="lc-sub">PLAN DE SITUATION · CÔTES-D'ARMOR (22)</text>
        <text x="16" y="324" class="lc-sub">CENTRE BRETAGNE</text>`;
      if (G && !calm) {
        G.from(loc.querySelectorAll(".lc-rings circle"), { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 1.2, stagger: .15, ease: "power3.out", scrollTrigger: { trigger: loc, start: "top 80%", once: true } });
        G.from(loc.querySelector(".lc-pin"), { y: -80, opacity: 0, duration: .8, ease: "bounce.out", scrollTrigger: { trigger: loc, start: "top 80%", once: true } });
        G.to(loc.querySelector(".lc-pulse"), { scale: 2.4, opacity: 0, transformOrigin: "50% 50%", duration: 1.8, repeat: -1, ease: "power1.out" });
      }
    }
    if (G && ST && !calm) {
      G.to(".rideau i", { scaleY: 0, transformOrigin: "50% 0%", duration: .9, stagger: { each: .05, from: "end" }, ease: "power3.inOut", scrollTrigger: { trigger: ".atelier-media", start: "top 70%", once: true } });
      G.fromTo(".atelier-photo .smedia", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".atelier-media", start: "top bottom", end: "bottom top", scrub: true } });
      G.from(".steps li", { y: 30, opacity: 0, stagger: .1, duration: .6, scrollTrigger: { trigger: ".steps", start: "top 85%", once: true } });
    } else $$(".rideau i").forEach(i => i.style.transform = "scaleY(0)");
  }

  /* =========================================================
     13. Espace pro : formulaire en étapes, pignons qui s'engrènent
     ========================================================= */
  function proForm() {
    const form = $("#proform"); if (!form) return;
    const gears = $("#gears");
    const gear = (cx, cy, r, n, cls) => {
      let d = ""; const ri = r - 7, step = Math.PI * 2 / n;
      for (let i = 0; i < n; i++) { const a = i * step; const pts = [[a, ri], [a + step * .18, r], [a + step * .5, r], [a + step * .68, ri]];
        pts.forEach(([aa, rr], j) => { d += `${i === 0 && j === 0 ? "M" : "L"}${(cx + Math.cos(aa) * rr).toFixed(1)} ${(cy + Math.sin(aa) * rr).toFixed(1)}`; }); }
      return `<g class="gear ${cls}"><path d="${d}Z"/><circle cx="${cx}" cy="${cy}" r="${r * .32}"/><circle cx="${cx}" cy="${cy}" r="5" class="g-axle"/></g>`;
    };
    const GX = [60, 196, 332, 468], GR = 38;
    gears.innerHTML = `<path class="g-chain" d="M60 45H468"/>` + GX.map((x, i) => gear(x, 45, GR, 12, "g" + i)).join("");
    const steps = $$(".pf-step", form), prev = $('[data-pf="prev"]', form), next = $('[data-pf="next"]', form), err = $(".pf-err", form), labels = $$(".pf-labels li");
    let cur = 0, rot = 0;
    const paint = () => {
      steps.forEach((s, i) => { s.classList.toggle("is-on", i === cur); s.disabled = i !== cur; });
      $$(".gear", gears).forEach((g, i) => { g.classList.toggle("is-done", i < cur); g.classList.toggle("is-cur", i === cur); });
      labels.forEach((l, i) => l.classList.toggle("is-cur", i === cur));
      prev.disabled = cur === 0; next.textContent = cur === 3 ? "Envoyer la demande (démo)" : "Continuer";
      if (G && !calm) {
        $$(".gear", gears).forEach((g, i) => G.to(g, { rotation: (i % 2 ? -1 : 1) * rot, svgOrigin: `${GX[i]} 45`, duration: .8, ease: "back.out(1.6)" }));
        G.from(steps[cur].children, { y: 14, opacity: 0, duration: .4, stagger: .04 });
      }
    };
    const valid = () => {
      const s = steps[cur]; let msg = "";
      $$("input[required], select[required]", s).forEach(inp => {
        if (msg) return;
        const v = inp.type === "file" ? inp.files.length : inp.value.trim();
        if (!v) msg = `Renseignez le champ « ${s.querySelector(`label[for="${inp.id}"]`).textContent} ».`;
        else if (inp.id === "pf-siret" && inp.value.replace(/\s/g, "").length !== 14) msg = "Le SIRET compte 14 chiffres.";
        else if (inp.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value)) msg = "L'adresse e-mail semble incomplète.";
        if (msg) inp.focus();
      });
      err.textContent = msg; return !msg;
    };
    next.addEventListener("click", () => {
      if (cur < 3) {
        if (!valid()) { if (G && !calm) G.fromTo(form, { x: -8 }, { x: 0, duration: .5, ease: "elastic.out(1,.3)" }); return; }
        cur++; rot += 30; WB.sound.ratchet();
        if (cur === 3) {
          const v = id => ($("#" + id).value || "").trim(), fn = id => { const i = $("#" + id); return i.files.length ? i.files[0].name : "—"; };
          $(".pf-recap").innerHTML = `<dl class="recap">${[["Raison sociale", v("pf-rs")], ["SIRET", v("pf-siret")], ["Activité", v("pf-type")], ["Contact", v("pf-nom")], ["E-mail", v("pf-mail")], ["Téléphone", v("pf-tel") || "—"], ["K-bis", fn("pf-kbis")], ["RIB", fn("pf-rib")]].map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${String(v).replace(/[<>&]/g, "")}</dd></div>`).join("")}</dl>`;
        }
        paint(); return;
      }
      rot += 30; WB.sound.clac();
      $(".pf-steps", form).innerHTML = `<div class="pf-done"><p class="h3">Demande prête.</p><p>Démonstration : rien n'a été envoyé. Sur le vrai site, la demande partirait à contact@winsbike.fr avec vos justificatifs, et Winsbike basculerait votre compte au tarif professionnel après vérification.</p></div>`;
      $(".pf-nav", form).remove(); err.textContent = "";
      $$(".gear", gears).forEach(g => g.classList.add("is-done"));
      if (G && !calm) $$(".gear", gears).forEach((g, i) => G.to(g, { rotation: (i % 2 ? -1 : 1) * (rot + 360), svgOrigin: `${GX[i]} 45`, duration: 1.6, ease: "power3.out" }));
    });
    prev.addEventListener("click", () => { if (cur > 0) { cur--; rot -= 30; err.textContent = ""; paint(); } });
    paint();
  }

  /* =========================================================
     14. Suivi du colis piloté par le défilement
     ========================================================= */
  function track() {
    const tr = $("#track"); if (!tr || !G || !ST || calm) { if (tr) tr.classList.add("is-done"); return; }
    const stops = $$(".track-stops li", tr), parcel = $(".parcel", tr);
    const tl = G.timeline({ scrollTrigger: { trigger: tr, start: "top 80%", end: "bottom 45%", scrub: .6 } });
    tl.fromTo(".track-on", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: 1 }, 0)
      .fromTo(parcel, { left: "0%" }, { left: "100%", ease: "none", duration: 1 }, 0)
      .to(parcel, { rotation: 360 * 2, ease: "none", duration: 1 }, 0);
    tl.eventCallback("onUpdate", () => { const p = tl.progress(); stops.forEach((s, i) => s.classList.toggle("is-on", p >= i / (stops.length - 1) - .02)); });
  }

  /* ---------- démarrage ---------- */
  cards(); servante(); pratiques(); mur();
  WB.boot();
  heroLamp(); intro(); ticker(); hub();
  WB.geo($("#geo-home"), $("#cotes-home"), $("#beast"));
  hexgrid(); sizer(); atelier(); proForm(); track();
  const nf = $("#newsform"); if (nf) nf.addEventListener("submit", e => { e.preventDefault(); WB.toast("Inscription simulée : rien n'a été envoyé."); nf.reset(); });
})();
