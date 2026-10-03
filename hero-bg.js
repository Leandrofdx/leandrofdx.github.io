(() => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    document.documentElement.classList.add("hero-reduced");
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  // Brighter cyan — luminous orbits
  const BLUE = [6, 182, 212];
  const ICE = [103, 232, 249];
  const MINT = [165, 243, 252];
  const DEEP = [8, 120, 145];
  const WHITE = [255, 255, 255];
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let last = 0;
  let t = 0;

  let orbs = [];
  let rings = [];
  let rain = [];
  let pings = [];
  let motes = [];

  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    orbs = [
      { x: 0.16, y: 0.3, r: 0.42, c: BLUE, a: 0.22, sx: 0.05, sy: 0.04, ph: 0.4 },
      { x: 0.84, y: 0.62, r: 0.46, c: ICE, a: 0.18, sx: -0.04, sy: 0.05, ph: 1.8 },
      { x: 0.5, y: 0.88, r: 0.36, c: MINT, a: 0.16, sx: 0.03, sy: -0.03, ph: 3.1 },
    ];

    // Fewer orbits — cleaner stage
    rings = [
      { rx: 0.48, ry: 0.2, rot: -0.28, speed: 0.09, w: 1.45, a: 0.28, traveler: 0 },
      { rx: 0.62, ry: 0.28, rot: 0.48, speed: -0.06, w: 1.2, a: 0.2, traveler: 0.55 },
    ];

    const rainN = Math.max(10, Math.min(22, Math.round(w / 55)));
    rain = Array.from({ length: rainN }, () => edgeRain());

    motes = Array.from({ length: Math.max(8, Math.min(16, Math.round((w * h) / 70000))) }, () => {
      const edge = edgePoint();
      return {
        x: edge.x,
        y: edge.y,
        r: rand(1, 1.8),
        ph: rand(0, Math.PI * 2),
        sp: rand(0.3, 0.8),
        amp: rand(8, 18),
        ox: edge.x,
        oy: edge.y,
      };
    });

    pings = [];
    spawnPing(true);
  }

  function edgePoint() {
    // Keep activity off the text center
    const side = Math.floor(Math.random() * 4);
    if (side === 0) return { x: rand(0, w * 0.22), y: rand(0, h) };
    if (side === 1) return { x: rand(w * 0.78, w), y: rand(0, h) };
    if (side === 2) return { x: rand(0, w), y: rand(0, h * 0.18) };
    return { x: rand(0, w), y: rand(h * 0.82, h) };
  }

  function edgeRain() {
    const p = edgePoint();
    return {
      x: p.x,
      y: rand(0, h),
      len: rand(10, 28),
      speed: rand(14, 32),
      a: rand(0.05, 0.14),
      thick: rand(0.5, 1),
    };
  }

  function spawnPing(randomAge) {
    const p = edgePoint();
    pings.push({
      x: p.x,
      y: p.y,
      age: randomAge ? rand(0, 2.2) : 0,
      life: rand(2.8, 4.2),
      maxR: rand(60, 120),
      cool: Math.random() > 0.35,
    });
    if (pings.length > 2) pings.shift();
  }

  function drawVoid() {
    // True black stage — blue lives in the motion, not the fill
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);
  }

  function drawAurora(time) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const o of orbs) {
      const x = (o.x + Math.sin(time * o.sx * 5 + o.ph) * 0.06) * w;
      const y = (o.y + Math.cos(time * o.sy * 5 + o.ph * 1.3) * 0.05) * h;
      const breath = 0.85 + 0.15 * Math.sin(time * 0.7 + o.ph);
      const r = o.r * Math.max(w, h) * breath;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, rgba(o.c, o.a * 0.9));
      grd.addColorStop(0.35, rgba(o.c, o.a * 0.35));
      grd.addColorStop(1, rgba(o.c, 0));
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.15, r * 0.72, o.ph * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawOrbit(ring, time) {
    const cx = w * 0.5;
    const cy = h * 0.48;
    const rx = ring.rx * Math.min(w, h);
    const ry = ring.ry * Math.min(w, h);
    const rot = ring.rot + time * ring.speed * 0.35;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // soft band
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(ICE, ring.a * 0.55);
    ctx.lineWidth = ring.w * 7;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(MINT, ring.a * 1.35);
    ctx.lineWidth = ring.w;
    ctx.stroke();

    // bright arc segment
    const a0 = time * ring.speed * 2.2 + ring.traveler * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, a0, a0 + 0.55);
    ctx.strokeStyle = rgba(MINT, 0.95);
    ctx.lineWidth = ring.w + 1.8;
    ctx.lineCap = "round";
    ctx.stroke();

    // traveler bead
    const px = Math.cos(a0 + 0.55) * rx;
    const py = Math.sin(a0 + 0.55) * ry;
    const glow = ctx.createRadialGradient(px, py, 0, px, py, 34);
    glow.addColorStop(0, rgba(WHITE, 0.95));
    glow.addColorStop(0.15, rgba(MINT, 0.7));
    glow.addColorStop(0.45, rgba(ICE, 0.35));
    glow.addColorStop(1, rgba(BLUE, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, py, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawRain(dt) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const d of rain) {
      d.y += d.speed * dt;
      if (d.y - d.len > h) {
        Object.assign(d, edgeRain());
        d.y = -d.len;
      }
      const g = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
      g.addColorStop(0, rgba(BLUE, 0));
      g.addColorStop(0.7, rgba(BLUE, d.a * 1.15));
      g.addColorStop(1, rgba(ICE, d.a));
      ctx.strokeStyle = g;
      ctx.lineWidth = d.thick;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - d.len);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPings(dt) {
    if (Math.random() < 0.004) spawnPing(false);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = pings.length - 1; i >= 0; i--) {
      const p = pings[i];
      p.age += dt;
      const k = p.age / p.life;
      if (k >= 1) {
        pings.splice(i, 1);
        continue;
      }
      const r = p.maxR * (0.15 + k * 0.85);
      const a = (1 - k) * 0.35;
      const col = p.cool ? BLUE : ICE;

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(col, a);
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(WHITE, a * 0.35);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 18);
      core.addColorStop(0, rgba(WHITE, (1 - k) * 0.5));
      core.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawMotes(time) {
    for (const m of motes) {
      m.x = m.ox + Math.sin(time * m.sp + m.ph) * m.amp;
      m.y = m.oy + Math.cos(time * m.sp * 0.7 + m.ph) * m.amp * 0.6;
      const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * m.sp * 2 + m.ph));
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(BLUE, 0.06 * pulse);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(WHITE, 0.35 + pulse * 0.4);
      ctx.fill();
    }
  }

  function drawHorizonSheen(time) {
    const y = h * (0.58 + Math.sin(time * 0.25) * 0.02);
    const g = ctx.createLinearGradient(0, y - 80, 0, y + 80);
    g.addColorStop(0, rgba(BLUE, 0));
    g.addColorStop(0.5, rgba(BLUE, 0.08));
    g.addColorStop(1, rgba(BLUE, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 80, w, 160);

    // thin luminous horizon line
    ctx.beginPath();
    ctx.moveTo(w * 0.12, y);
    for (let x = w * 0.12; x <= w * 0.88; x += 8) {
      const yy = y + Math.sin(x * 0.01 + time * 1.2) * 3;
      ctx.lineTo(x, yy);
    }
    ctx.strokeStyle = rgba(ICE, 0.2);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawFrame() {
    const v = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(0.65, "rgba(0,0,0,0.1)");
    v.addColorStop(1, "rgba(0,0,0,0.5)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }

  function frame(ts) {
    if (!last) last = ts;
    const dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    t += dt;

    drawVoid();
    drawAurora(t);
    drawHorizonSheen(t);
    for (const r of rings) drawOrbit(r, t);
    drawRain(dt);
    drawMotes(t);
    drawPings(dt);
    drawFrame();

    raf = requestAnimationFrame(frame);
  }

  function start() {
    resize();
    cancelAnimationFrame(raf);
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", () => {
    clearTimeout(canvas._t);
    canvas._t = setTimeout(start, 140);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else start();
  });

  start();
})();
