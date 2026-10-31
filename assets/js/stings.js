/* Quasar Studio · motion engine. Every sting is a deterministic draw(ctx, t, w, h, o) so it can play live,
   record to MP4/WebM, or render to an exact PNG sequence. */
(function () {
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const lerp = (a, b, e) => a + (b - a) * e;
  const E = { out: (t) => 1 - Math.pow(1 - t, 3), io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), back: (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }, expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)) };
  const TH = (o) => {
    const th = Q.theme(o.reg || 'core', o.mode);
    if (th.reg === 'research') { th.jet = th.fg; th.ringC = th.fg; th.coreFill = th.bg; th.glowOn = false; }
    else { th.jet = th.b; th.ringC = th.glow[0]; th.coreFill = '#050307'; th.glowOn = true; }
    return th;
  };
  const font = (wt, s, f = 'd') => `${wt} ${s}px "${Q.F[f]}"`;
  const tracked = (ctx, str, x, y, ls, align = 'left', perChar) => {
    const ws = [...str].map((c) => ctx.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + ls * (ws.length - 1);
    let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
    [...str].forEach((c, i) => { if (perChar) perChar(i); ctx.fillText(c, cx, y); cx += ws[i] + ls; });
    return tot;
  };
  /* logo mark in 40-unit geometry; k = px per unit. p: glow, jet, disk, core (0..1) */
  const mark = (ctx, cx, cy, k, th, p = {}) => {
    const P = Object.assign({ glow: 1, jet: 1, disk: 1, core: 1, jetLen: 10, alpha: 1 }, p);
    ctx.save(); ctx.globalAlpha = P.alpha; ctx.lineCap = 'round';
    if (th.glowOn && P.glow > 0) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15 * k * (0.6 + 0.4 * P.glow));
      g.addColorStop(0, th.glow[0]); g.addColorStop(0.45, th.glow[1]); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = P.alpha * 0.55 * P.glow; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 15 * k, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = P.alpha;
    }
    if (P.jet > 0) {
      ctx.strokeStyle = th.jet; ctx.lineWidth = 1.3 * k; const L = P.jetLen * P.jet;
      ctx.beginPath(); ctx.moveTo(cx, cy - 8.5 * k); ctx.lineTo(cx, cy - (8.5 + L) * k); ctx.moveTo(cx, cy + 8.5 * k); ctx.lineTo(cx, cy + (8.5 + L) * k); ctx.stroke();
    }
    if (P.disk > 0) { ctx.strokeStyle = th.disk; ctx.lineWidth = 1.6 * k; ctx.beginPath(); ctx.ellipse(cx, cy, 17.5 * k, 5 * k, 0, Math.PI, Math.PI + Math.PI * 2 * P.disk); ctx.stroke(); }
    if (P.core > 0) { ctx.fillStyle = th.coreFill; ctx.strokeStyle = th.ringC; ctx.lineWidth = (th.reg === 'research' ? 1.5 : 0.9) * k; ctx.beginPath(); ctx.arc(cx, cy, 4.8 * k * P.core, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  };
  /* one-line wordmark; p = reveal 0..1 */
  const word = (ctx, x, y, size, ink, p = 1, align = 'left') => {
    const parts = [['THE ', 300], ['QUASAR', 700], [' LAB', 300]], ls = size * (0.12 + (1 - E.out(p)) * 0.45);
    ctx.save(); ctx.fillStyle = ink; ctx.textBaseline = 'alphabetic';
    let tot = 0; parts.forEach(([s, wt]) => { ctx.font = font(wt, size); tot += [...s].reduce((a, c) => a + ctx.measureText(c).width + ls, 0); }); tot -= ls;
    let cx = align === 'center' ? x - tot / 2 : x, n = 0;
    parts.forEach(([s, wt]) => { ctx.font = font(wt, size); [...s].forEach((c) => { ctx.globalAlpha = cl(p * 14 - n * 0.6); ctx.fillText(c, cx, y); cx += ctx.measureText(c).width + ls; n++; }); });
    ctx.restore(); return tot;
  };
  const wordW = (ctx, size) => { const ls = size * 0.12; let t = 0; [['THE ', 300], ['QUASAR', 700], [' LAB', 300]].forEach(([s, wt]) => { ctx.font = font(wt, size); t += [...s].reduce((a, c) => a + ctx.measureText(c).width + ls, 0); }); return t - ls; };
  const bg = (ctx, w, h, th, o) => { if (!o.alpha) { ctx.fillStyle = th.bg; ctx.fillRect(0, 0, w, h); } };
  const orbitsC = (ctx, cx, cy, rx, n, step, color, a, rot = 0, dashOff = 0) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash([2, 10]); ctx.lineDashOffset = dashOff;
    for (let i = 0; i < n; i++) { ctx.globalAlpha = a * (1 - i / n); ctx.beginPath(); ctx.ellipse(cx, cy, rx + i * step, (rx + i * step) * 0.29, rot, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  };
  const R = (seed) => { let s = seed; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; };

  const S = [];
  S.push({
    k: 'ignition', n: 'Ignition', kind: 'Logo sting', dur: 4, desc: 'A point of light ignites, the jets fire, the disk closes, the wordmark arrives.',
    draw(ctx, t, w, h, o) {
      const th = TH(o), U = Math.min(w, h); bg(ctx, w, h, th, o);
      const Mf = U * 0.2, kf = Mf / 40, ts = (Mf * 21) / 64, tw = wordW(ctx, ts), tot = Mf + Mf * 0.25 + tw, xf = w / 2 - tot / 2 + Mf / 2;
      const kb = (U * 0.6) / 40, e = E.io(seg(t, 2.0, 2.9)), k = lerp(kb, kf, e), x = lerp(w / 2, xf, e);
      if (t < 0.7) { const s = E.out(seg(t, 0, 0.5)) * U * 0.012 * (1 + 0.25 * Math.sin(t * 60)); ctx.fillStyle = th.reg === 'research' ? th.fg : '#fff'; ctx.beginPath(); ctx.arc(w / 2, h / 2, s, 0, 7); ctx.fill(); }
      mark(ctx, x, h / 2, k, th, { glow: E.out(seg(t, 0.9, 2.0)), jet: E.out(seg(t, 0.35, 1.3)), disk: E.io(seg(t, 0.6, 1.8)), core: E.back(seg(t, 1.35, 1.85)), alpha: 1 });
      const fl = seg(t, 1.4, 1.5) * (1 - seg(t, 1.5, 1.9));
      if (fl > 0 && th.glowOn) { const g = ctx.createRadialGradient(x, h / 2, 0, x, h / 2, U * 0.7); g.addColorStop(0, `rgba(255,243,214,${0.5 * fl})`); g.addColorStop(1, 'rgba(255,243,214,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
      const wp = seg(t, 2.45, 3.4); if (wp > 0) word(ctx, xf + Mf * 0.75, h / 2 + ts * 0.36, ts, th.fg, wp);
    }
  });
  S.push({
    k: 'accretion', n: 'Accretion', kind: 'Logo sting', dur: 3.6, desc: 'Scattered points fall into orbit and become the disk. Use before talks and reels.',
    draw(ctx, t, w, h, o) {
      const th = TH(o), U = Math.min(w, h); bg(ctx, w, h, th, o);
      const cx = w / 2, cy = h * 0.44, k = (U * 0.42) / 40, rD = 17.5 * k, rnd = R(11);
      const fade = 1 - seg(t, 2.0, 2.6);
      for (let i = 0; i < 280; i++) {
        const a0 = rnd() * Math.PI * 2, r0 = (0.55 + rnd()) * U * 0.62, d = rnd() * 0.9, dir = rnd() > 0.15 ? 1 : -1, sz = 0.6 + rnd() * 1.8, col = rnd();
        const q = E.out(seg(t, d, d + 1.3)), r = lerp(r0, rD * (0.92 + rnd() * 0.16), q), a = a0 + q * Math.PI * 2.2 * dir, sq = lerp(1, 5 / 17.5, q);
        ctx.globalAlpha = fade * (0.35 + 0.65 * q); ctx.fillStyle = th.reg === 'research' ? th.fg : col > 0.7 ? th.b : col > 0.3 ? th.disk : th.glow[0];
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * sq, sz * U * 0.0016, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      mark(ctx, cx, cy, k, th, { disk: E.io(seg(t, 1.3, 2.1)), core: E.back(seg(t, 1.9, 2.3)), glow: E.out(seg(t, 1.9, 2.8)), jet: E.out(seg(t, 2.0, 2.6)) });
      const ts = U * 0.05; const wp = seg(t, 2.4, 3.3); if (wp > 0) word(ctx, cx, cy + 17.5 * k * 0.9 + ts * 2.2, ts, th.fg, wp, 'center');
    }
  });
  S.push({
    k: 'signal', n: 'Signal', kind: 'Logo sting', dur: 3.2, desc: 'A weak transmission resolves into the mark. Research register by default.', reg: 'research',
    draw(ctx, t, w, h, o) {
      const th = TH(o), U = Math.min(w, h); bg(ctx, w, h, th, o);
      const r = E.out(seg(t, 0.2, 1.9)), fr = Math.floor(t * 24), rnd = R(fr + 3), M = U * 0.22, k = M / 40;
      const ts = (M * 21) / 64, tw = wordW(ctx, ts), tot = M * 1.25 + tw, x0 = w / 2 - tot / 2 + M / 2;
      const jit = (1 - r) * U * 0.04 * (rnd() - 0.5);
      mark(ctx, x0 + jit, h / 2, k, th, { alpha: 0.25 + 0.75 * r });
      word(ctx, x0 + M * 0.75 - jit, h / 2 + ts * 0.36, ts, th.fg, seg(t, 0.9, 2.2));
      const rows = 60, rh = h / rows; ctx.fillStyle = th.fg;
      for (let i = 0; i < rows; i++) { if (rnd() > (1 - r) * 0.9 + 0.02) continue; let x = rnd() * w * 0.2; while (x < w) { const len = Math.pow(rnd(), 3) * w * 0.3 + 4; ctx.globalAlpha = (1 - r) * 0.7 * rnd(); ctx.fillRect(x, i * rh + rh * 0.3, len, rh * 0.35); x += len + rnd() * w * 0.1; } }
      ctx.globalAlpha = 1;
      const cap = 'TRANSMISSION RECEIVED · ' + (o.sub || 'THE QUASAR LAB'), n = Math.floor(seg(t, 2.0, 2.9) * cap.length);
      ctx.font = font(500, U * 0.022, 'm'); ctx.fillStyle = th.a; tracked(ctx, cap.slice(0, n), w / 2, h / 2 + M * 0.95, U * 0.004, 'center');
    }
  });
  S.push({
    k: 'intro', n: 'The Making Of · Intro', kind: 'Series intro', dur: 5, desc: 'Opening title for the making-of video series. Edit episode title and number.', fields: ['title', 'ep'],
    draw(ctx, t, w, h, o) {
      const th = TH(o), U = Math.min(w, h); bg(ctx, w, h, th, o);
      orbitsC(ctx, w * 0.72, h * 0.5, U * 0.18, 9, U * 0.07, th.reg === 'research' ? th.fg : th.disk, 0.6 * seg(t, 0, 0.8) * (1 - seg(t, 4.3, 4.8)), -0.18, -t * 40);
      mark(ctx, w * 0.72, h * 0.5, (U * 0.34) / 40, th, { glow: E.out(seg(t, 0.2, 1.4)) * (1 - seg(t, 4.3, 4.8)), jet: E.out(seg(t, 0.3, 1.2)), disk: E.io(seg(t, 0.2, 1.3)), core: E.back(seg(t, 0.9, 1.3)), jetLen: 18, alpha: 1 - seg(t, 4.3, 4.8) });
      const x = w * 0.08, a = 1 - seg(t, 4.3, 4.7);
      ctx.globalAlpha = a * seg(t, 0.3, 0.9); ctx.fillStyle = th.mute; ctx.font = font(500, U * 0.024, 'm'); tracked(ctx, 'THE QUASAR LAB PRESENTS', x, h * 0.3, U * 0.006);
      ctx.globalAlpha = a * seg(t, 0.8, 1.3); ctx.fillStyle = th.a; ctx.font = font(500, U * 0.03, 'm'); tracked(ctx, 'THE MAKING OF  ·  EP. ' + String(o.ep || '01').padStart(2, '0'), x, h * 0.38, U * 0.006);
      ctx.globalAlpha = a; ctx.fillStyle = th.fg; const ts = U * 0.085; ctx.font = font(700, ts);
      const lines = wrapC(ctx, (o.title || 'Building the seventh dimension').toUpperCase(), w * 0.56);
      lines.slice(0, 3).forEach((l, i) => { const p = E.out(seg(t, 1.2 + i * 0.18, 2.0 + i * 0.18)); ctx.save(); ctx.beginPath(); ctx.rect(0, h * 0.42 + i * ts * 1.08, w, ts * 1.08); ctx.clip(); ctx.fillText(l, x, h * 0.42 + (i + 0.92) * ts * 1.08 + (1 - p) * ts * 1.1); ctx.restore(); });
      ctx.globalAlpha = 1; jetWipe(ctx, seg(t, 4.2, 5.0), w, h, th);
    }
  });
  S.push({
    k: 'outro', n: 'The Making Of · Outro', kind: 'Series outro', dur: 4, desc: 'Closing card with next-episode line and logo.', fields: ['title'],
    draw(ctx, t, w, h, o) {
      const th = TH(o), U = Math.min(w, h); bg(ctx, w, h, th, o);
      orbitsC(ctx, w / 2, h * 0.5, U * 0.2, 10, U * 0.08, th.reg === 'research' ? th.fg : th.b, 0.5 * seg(t, 0, 1), 0, t * 30);
      ctx.fillStyle = th.fg; ctx.font = font(600, U * 0.07); ctx.globalAlpha = E.out(seg(t, 0.2, 0.9)) * (1 - seg(t, 3.4, 3.9)); ctx.textAlign = 'center';
      ctx.fillText('TRANSMISSION ENDS.', w / 2, h * 0.42); ctx.textAlign = 'left';
      ctx.fillStyle = th.a; ctx.font = font(500, U * 0.026, 'm'); ctx.globalAlpha *= seg(t, 0.7, 1.2); tracked(ctx, ('NEXT  ·  ' + (o.title || 'Episode 02 · The propinquital loop')).toUpperCase(), w / 2, h * 0.5, U * 0.004, 'center');
      ctx.globalAlpha = 1 - seg(t, 3.4, 3.9);
      const M = U * 0.12, ts = (M * 21) / 64, tw = wordW(ctx, ts), x0 = w / 2 - (M * 1.25 + tw) / 2 + M / 2, p = seg(t, 1.2, 2.0);
      mark(ctx, x0, h * 0.7, M / 40, th, { disk: E.io(p), core: E.back(p), jet: p, glow: p, alpha: ctx.globalAlpha });
      word(ctx, x0 + M * 0.75, h * 0.7 + ts * 0.36, ts, th.fg, seg(t, 1.6, 2.5) * (1 - seg(t, 3.4, 3.9)));
      ctx.globalAlpha = 1;
    }
  });
  const jetWipe = (ctx, p, w, h, th) => {
    if (p <= 0 || p >= 1) return;
    const a = E.io(cl(p / 0.5)), b = E.io(cl((p - 0.55) / 0.45)), cw = w * 1.04 * a, gap = w * 1.04 * b;
    const g = ctx.createLinearGradient(w / 2 - cw / 2, 0, w / 2 + cw / 2, 0);
    g.addColorStop(0, th.reg === 'research' ? th.fg : th.b); g.addColorStop(0.5, th.reg === 'research' ? th.a : '#FFFFFF'); g.addColorStop(1, th.reg === 'research' ? th.fg : th.b);
    ctx.fillStyle = g; ctx.fillRect(w / 2 - cw / 2, 0, (cw - gap) / 2, h); ctx.fillRect(w / 2 + gap / 2, 0, (cw - gap) / 2, h);
  };
  const shotLabel = (ctx, t, mid, w, h, th, o) => {
    if (o.alpha) return; ctx.fillStyle = t < mid ? th.bg : th.reg === 'research' ? '#E2D7C4' : '#14111A'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = th.mute; ctx.font = font(500, Math.min(w, h) * 0.03, 'm'); tracked(ctx, t < mid ? 'SHOT A' : 'SHOT B', w / 2, h / 2, 6, 'center');
  };
  S.push({ k: 'jet-wipe', n: 'Jet wipe', kind: 'Transition', dur: 1.2, desc: 'A relativistic jet opens across the frame. Cut on the midpoint (0.6 s).', draw(ctx, t, w, h, o) { const th = TH(o); shotLabel(ctx, t, 0.6, w, h, th, o); jetWipe(ctx, t / 1.2, w, h, th); } });
  S.push({
    k: 'orbit-wipe', n: 'Orbit wipe', kind: 'Transition', dur: 1.4, desc: 'The disk expands to swallow the frame, then opens on the next shot. Cut at 0.7 s.',
    draw(ctx, t, w, h, o) {
      const th = TH(o); shotLabel(ctx, t, 0.7, w, h, th, o);
      const D = Math.hypot(w, h), a = E.io(seg(t, 0, 0.7)), b = E.io(seg(t, 0.7, 1.4)), col = th.reg === 'research' ? th.fg : '#050307';
      ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = th.disk; ctx.lineWidth = Math.min(w, h) * 0.012;
      if (t < 0.7) { const rx = D * 0.62 * a, ry = rx * lerp(0.29, 1, a); ctx.beginPath(); ctx.ellipse(w / 2, h / 2, rx, ry, -0.2 * (1 - a), 0, 7); ctx.fill(); ctx.stroke(); }
      else if (b < 1) { const rx = D * 0.62 * b, ry = rx * lerp(1, 0.6, b); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.ellipse(w / 2, h / 2, Math.max(1, rx), Math.max(1, ry), 0, 0, 7, true); ctx.fill('evenodd'); ctx.beginPath(); ctx.ellipse(w / 2, h / 2, Math.max(1, rx), Math.max(1, ry), 0, 0, 7); ctx.stroke(); }
      ctx.restore();
    }
  });
  S.push({
    k: 'glitch-cut', n: 'Signal cut', kind: 'Transition', dur: 0.8, desc: 'A burst of signal noise hides a hard cut at 0.4 s.',
    draw(ctx, t, w, h, o) {
      const th = TH(o); shotLabel(ctx, t, 0.4, w, h, th, o);
      const p = Math.sin(Math.PI * cl(t / 0.8)), rnd = R(Math.floor(t * 30) + 5), rows = 48, rh = h / rows;
      for (let i = 0; i < rows; i++) { if (rnd() > p) continue; let x = rnd() * w * 0.1; while (x < w) { const len = Math.pow(rnd(), 2) * w * 0.4 + 8; ctx.fillStyle = [th.fg, th.a, th.b, th.disk][Math.floor(rnd() * 4)]; ctx.globalAlpha = 0.5 + rnd() * 0.5; ctx.fillRect(x, i * rh, len, rh * (0.4 + rnd() * 0.6)); x += len + rnd() * w * 0.12; } }
      ctx.globalAlpha = 1;
    }
  });
  function wrapC(ctx, str, maxW) { const out = []; let line = ''; str.split(/\s+/).forEach((wd) => { const t = line ? line + ' ' + wd : wd; if (ctx.measureText(t).width > maxW && line) { out.push(line); line = wd; } else line = t; }); out.push(line); return out; }

  Q.STINGS = S;
  Q.motion = { mark, word, tracked, TH, E, seg };

  /* looping player bound to a canvas. getO() returns live options. */
  Q.player = (canvas, sting, getO, onTime) => {
    const ctx = canvas.getContext('2d'); let t0 = performance.now(), paused = false, tp = 0, raf, dead = false;
    const frame = (now) => {
      if (dead) return;
      const st = typeof sting === 'function' ? sting() : sting, o = getO ? getO() : {};
      const t = paused ? tp : ((now - t0) / 1000) % (st.dur + 0.8);
      tp = t; ctx.clearRect(0, 0, canvas.width, canvas.height); st.draw(ctx, Math.min(t, st.dur), canvas.width, canvas.height, o);
      onTime && onTime(Math.min(t, st.dur) / st.dur); raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return {
      stop: () => { dead = true; cancelAnimationFrame(raf); },
      toggle: () => { paused = !paused; if (!paused) t0 = performance.now() - tp * 1000; return paused; },
      seek: (f) => { const st = typeof sting === 'function' ? sting() : sting; paused = true; tp = f * st.dur; },
      restart: () => { paused = false; t0 = performance.now(); }
    };
  };
})();
