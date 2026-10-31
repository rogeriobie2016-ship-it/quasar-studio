/* Quasar Studio · editable templates (Create, Studio kits, Collection).
   Q.renderTpl(key, data, register, mode, opts) → SVG document string. */
(function () {
  const r2 = Q.r2, T = Q.text;
  Q.TPL_DEFAULTS = {
    eyebrow: 'UnitedXR Europe · Brussels', title: 'Become the brightest light', body: 'A panel on designing with the people existing systems were not designed for.',
    date: 'DEC 8, 2026', place: 'LaVallée, Brussels', name: 'Firstname Lastname', role: 'Role · Organization', quote: 'Design is inseparable from the community it serves.',
    cite: 'HIIPE · principle 01', cta: 'RSVP · link in bio', tag: 'events', names: 'Speaker One — Role\nSpeaker Two — Role\nSpeaker Three — Role\nModerator — Role', num: '01', photo: null, ep: '01'
  };
  Q.TPL = [
    { k: 'post-square', n: 'Post', s: '1:1 · 1080', w: 1080, h: 1080, f: ['eyebrow', 'title', 'body', 'date', 'place', 'tag'] },
    { k: 'post-45', n: 'Post', s: '4:5 · 1080×1350', w: 1080, h: 1350, f: ['eyebrow', 'title', 'body', 'date', 'place', 'tag'] },
    { k: 'story', n: 'Story', s: '9:16 · 1080×1920', w: 1080, h: 1920, f: ['eyebrow', 'title', 'body', 'date', 'place', 'cta', 'tag'] },
    { k: 'slide', n: 'Slide', s: '16:9 · 1920×1080', w: 1920, h: 1080, f: ['eyebrow', 'title', 'body', 'num'] },
    { k: 'speaker', n: 'Speaker card', s: '4:5 · 1080×1350', w: 1080, h: 1350, f: ['eyebrow', 'name', 'role', 'title', 'date', 'place', 'photo'] },
    { k: 'panel-title', n: 'Panel title', s: '16:9 · 1920×1080', w: 1920, h: 1080, f: ['eyebrow', 'title', 'names', 'date', 'place'] },
    { k: 'lower-third', n: 'Lower third', s: 'GC · 1920×1080 alpha', w: 1920, h: 1080, f: ['name', 'role'], transparent: true },
    { k: 'quote', n: 'Quote card', s: '1:1 · 1080', w: 1080, h: 1080, f: ['quote', 'cite', 'eyebrow'] },
    { k: 'announce', n: 'Announcement', s: '4:5 · 1080×1350', w: 1080, h: 1350, f: ['eyebrow', 'title', 'date', 'place', 'body', 'cta', 'tag'] }
  ];
  const SEM = (k) => Q.PAL.semantic.find((s) => s.k === k);
  const tagPill = (x, y, k, th, u, anchor = 'end') => {
    const s = SEM(k); if (!s) return '';
    const lab = s.n.toUpperCase(), fs = 17 * u, tw = Q.tw(lab, fs, 'm', 600, fs * 0.12) + 40 * u, x0 = anchor === 'end' ? x - tw : x;
    return `<rect x="${r2(x0)}" y="${r2(y - 24 * u)}" width="${r2(tw)}" height="${r2(36 * u)}" rx="${r2(18 * u)}" fill="${th.dark ? s.dark : s.hex}"/><circle cx="${r2(x0 + 18 * u)}" cy="${r2(y - 6 * u)}" r="${r2(5 * u)}" fill="${th.dark ? '#000' : '#fff'}"/>` + T(x0 + 30 * u, y, lab, { f: 'm', s: fs, w: 600, ls: fs * 0.12, fill: th.dark ? '#000' : '#fff' });
  };
  const photo = (d, x, y, w, h, th, shape, u) => {
    const id = Q.uid('ph'), clip = shape === 'circle' ? `<circle cx="${r2(x + w / 2)}" cy="${r2(y + h / 2)}" r="${r2(w / 2)}"/>` : `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}"/>`;
    if (d.photo) return `<clipPath id="${id}">${clip}</clipPath><image href="${d.photo}" x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
    return `<g>${clip.replace('/>', ` fill="${th.dark ? '#1a1520' : '#E2D7C4'}" stroke="${th.fg}" stroke-width="${2 * u}" stroke-dasharray="${6 * u} ${8 * u}"/>`)}${T(x + w / 2, y + h / 2 + 8 * u, 'PHOTO', { f: 'm', s: 20 * u, w: 600, ls: 4 * u, fill: th.mute, anchor: 'middle' })}</g>`;
  };
  /* shared frames */
  const rFrame = (w, h, th, u, d, o) => {
    const m = 72 * u, gp = Q.gridPattern(36 * u, th.grid || th.line, 5);
    let s = `<defs>${gp.defs}</defs><rect width="${w}" height="${h}" fill="url(#${gp.id})"/>`;
    s += T(m, m + 14 * u, 'THE QUASAR LAB', { f: 'm', s: 18 * u, w: 600, ls: 3 * u, fill: th.fg }) + T(w - m, m + 14 * u, (d.eyebrow || '').toUpperCase(), { f: 'm', s: 18 * u, w: 500, ls: 2.4 * u, fill: th.a, anchor: 'end' });
    s += `<path d="M${m} ${r2(m + 36 * u)}H${w - m}" stroke="${th.fg}" stroke-width="${1.2 * u}"/>`;
    s += Q.regMarks(w, h, 28 * u, th.fg, 16 * u);
    return { s, m };
  };
  const rFoot = (w, h, th, u, m, left) => `<path d="M${m} ${r2(h - m - 34 * u)}H${w - m}" stroke="${th.fg}" stroke-width="${1.2 * u}"/>` + T(m, h - m, (left || '').toUpperCase(), { f: 'm', s: 18 * u, w: 500, ls: 2 * u, fill: th.fg }) + Q.place('symbol', w - m - 34 * u, h - m - 26 * u, 34 * u, 34 * u, { mode: 'mono', ink: th.fg }) + T(w - m - 46 * u, h - m, 'RESEARCH', { f: 'm', s: 18 * u, w: 500, ls: 2 * u, fill: th.mute, anchor: 'end' });
  const pTop = (w, th, u, m, d) => T(m, m + 18 * u, (d.eyebrow || '').toUpperCase(), { f: 'm', s: 22 * u, w: 600, ls: 3 * u, fill: th.c });
  const pLogo = (w, h, u, m, size = 300) => Q.place('primary', w - m - size * u, h - m - 40 * u, size * u, 40 * u, { mode: 'party', align: 'right', valign: 'bottom' });

  const R = {};
  R.post = (w, h, d, th, o) => {
    const u = w / 1080, story = h / w > 1.6;
    if (th.reg === 'research') {
      const F = rFrame(w, h, th, u, d, o), m = F.m; let s = F.s;
      const cy = story ? h * 0.3 : h * 0.33, r = w * 0.21;
      s += Q.quasar(w * 0.64, cy, r, th, { jet: Math.min(r * 1.4, cy - m - 70 * u), sw: 1.6 * u });
      s += T(m, cy - r * 0.9, ['FIG.', d.num || '01'], { f: 'm', s: 16 * u, w: 500, ls: 2 * u, fill: th.mute, lh: 1.4 });
      const ty = story ? h * 0.55 : h * 0.6, ft = Q.fit(d.title, (story ? 92 : 78) * u, w - 2 * m, story ? 4 : 3, 'd', 500, -0.01);
      s += T(m, ty, ft.lines, { f: 'd', s: ft.size, w: 500, ls: -0.01 * ft.size, fill: th.fg, lh: 1.08 });
      const by = ty + ft.lines.length * ft.size * 1.08 + 28 * u, bl = Q.wrap(d.body, 28 * u, w * 0.78, 't', 400).slice(0, 3);
      if (d.body) s += T(m, by, bl, { f: 't', s: 28 * u, fill: th.mute, lh: 1.35 });
      if (story && d.cta) s += T(m, h - m - 110 * u, '→ ' + d.cta.toUpperCase(), { f: 'm', s: 24 * u, w: 600, ls: 2.4 * u, fill: th.a });
      s += rFoot(w, h, th, u, m, [d.date, d.place].filter(Boolean).join(' · '));
      if (d.tag) s += tagPill(w - m, m + 92 * u, d.tag, th, u);
      return s;
    }
    const m = 72 * u; let s = '';
    s += Q.quasar(w * 0.72, story ? h * 0.3 : h * 0.3, w * 0.4, th, { tilt: -14, jet: h * 0.7 });
    s += pTop(w, th, u, m, d);
    if (d.tag) s += tagPill(w - m, m + 18 * u, d.tag, th, u);
    const ft = Q.fit(String(d.title).toUpperCase(), (story ? 132 : 118) * u, w - 2 * m, story ? 5 : 4, 'd', 800, -0.02);
    const base = h - m - (story ? 300 : 170) * u, ty = base - (ft.lines.length - 1) * ft.size * 0.98;
    s += T(m + 5 * u, ty + 5 * u, ft.lines, { f: 'd', s: ft.size, w: 800, ls: -0.02 * ft.size, fill: th.b, lh: 0.98 });
    s += T(m, ty, ft.lines, { f: 'd', s: ft.size, w: 800, ls: -0.02 * ft.size, fill: th.fg, lh: 0.98 });
    if (story && d.body) s += T(m, base + 70 * u, Q.wrap(d.body, 30 * u, w - 2 * m, 't', 400).slice(0, 3), { f: 't', s: 30 * u, fill: th.mute, lh: 1.35 });
    s += T(m, h - m - 82 * u, (d.date || '').toUpperCase(), { f: 'm', s: 32 * u, w: 700, ls: 2 * u, fill: th.a });
    s += T(m, h - m - 40 * u, (d.place || '').toUpperCase(), { f: 'm', s: 22 * u, w: 500, ls: 2.4 * u, fill: th.fg });
    if (story && d.cta) s += T(m, h - m, '→ ' + d.cta.toUpperCase(), { f: 'm', s: 22 * u, w: 600, ls: 2.4 * u, fill: th.c });
    s += pLogo(w, h, u, m, 260);
    return s + Q.grain(w, h, 0.2);
  };
  R.slide = (w, h, d, th) => {
    const u = h / 1080;
    if (th.reg === 'research') {
      const F = rFrame(w, h, th, u, d), m = F.m; let s = F.s;
      s += Q.quasar(1460 * u, 560 * u, 300 * u, th, { labels: true, jet: 330 * u, sw: 1.6 * u });
      const ft = Q.fit(d.title, 96 * u, 960 * u, 3, 'd', 500, -0.01);
      s += T(m, 330 * u, ft.lines, { f: 'd', s: ft.size, w: 500, ls: -0.01 * ft.size, fill: th.fg, lh: 1.06 });
      s += T(m, 330 * u + ft.lines.length * ft.size * 1.06 + 40 * u, Q.wrap(d.body, 32 * u, 880 * u, 't').slice(0, 4), { f: 't', s: 32 * u, fill: th.mute, lh: 1.4 });
      s += `<path d="M${m} ${r2(h - m - 34 * u)}H${w - m}" stroke="${th.fg}" stroke-width="${1.2 * u}"/>` + Q.place('primary', m, h - m - 22 * u, 300 * u, 26 * u, { mode: 'mono', ink: th.fg, valign: 'bottom' }) + T(w - m, h - m, `${String(d.num || '01').padStart(2, '0')}`, { f: 'm', s: 20 * u, w: 600, ls: 2 * u, fill: th.fg, anchor: 'end' });
      return s;
    }
    const m = 96 * u; let s = Q.quasar(1480 * u, 520 * u, 520 * u, th, { tilt: -12, jet: 1000 * u });
    s += T(m, m + 20 * u, (d.eyebrow || '').toUpperCase(), { f: 'm', s: 26 * u, w: 600, ls: 3.5 * u, fill: th.c });
    const ft = Q.fit(String(d.title).toUpperCase(), 140 * u, 1150 * u, 3, 'd', 800, -0.02);
    s += T(m, 420 * u, ft.lines, { f: 'd', s: ft.size, w: 800, ls: -0.02 * ft.size, fill: th.fg, lh: 0.98 });
    s += T(m, 420 * u + ft.lines.length * ft.size * 0.98 + 40 * u, Q.wrap(d.body, 34 * u, 980 * u, 't').slice(0, 3), { f: 't', s: 34 * u, fill: th.mute, lh: 1.35 });
    s += Q.place('primary', m, h - m - 36 * u, 340 * u, 36 * u, { mode: 'party', valign: 'bottom' }) + T(w - m, h - m, String(d.num || '01').padStart(2, '0'), { f: 'm', s: 24 * u, w: 700, ls: 2 * u, fill: th.a, anchor: 'end' });
    return s + Q.grain(w, h, 0.2);
  };
  R.speaker = (w, h, d, th) => {
    const u = w / 1080;
    if (th.reg === 'research') {
      const F = rFrame(w, h, th, u, d), m = F.m; let s = F.s;
      s += photo(d, m, 190 * u, 440 * u, 560 * u, th, 'rect', u) + T(m, 780 * u, 'PLATE · SPEAKER', { f: 'm', s: 16 * u, w: 500, ls: 2 * u, fill: th.mute });
      const nx = m + 480 * u, nf = Q.fit(d.name, 60 * u, w - nx - m, 3, 'd', 600, -0.01);
      s += T(nx, 230 * u, nf.lines, { f: 'd', s: nf.size, w: 600, ls: -0.01 * nf.size, fill: th.fg, lh: 1.05 });
      s += T(nx, 230 * u + nf.lines.length * nf.size * 1.05 + 20 * u, Q.wrap((d.role || '').toUpperCase(), 20 * u, w - nx - m, 'm', 500, 1.6 * u).slice(0, 3), { f: 'm', s: 20 * u, w: 500, ls: 1.6 * u, fill: th.a, lh: 1.5 });
      s += Q.quasar(nx + 160 * u, 640 * u, 140 * u, th, { jet: 100 * u, sw: 1.4 * u });
      const tf = Q.fit(d.title, 50 * u, w - 2 * m, 3, 'd', 400, -0.01);
      s += `<path d="M${m} ${860 * u}H${w - m}" stroke="${th.line}"/>` + T(m, 900 * u, 'TALK', { f: 'm', s: 16 * u, w: 500, ls: 2 * u, fill: th.mute }) + T(m, 970 * u, tf.lines, { f: 'd', s: tf.size, w: 400, ls: -0.01 * tf.size, fill: th.fg, lh: 1.12 });
      return s + rFoot(w, h, th, u, m, [d.date, d.place].filter(Boolean).join(' · '));
    }
    const m = 72 * u, cx = w / 2, cy = 520 * u, R0 = 270 * u; let s = '';
    s += Q.quasar(cx, cy, R0 * 1.55, th, { jet: 0, glow: true, ratio: 0.22 });
    s += photo(d, cx - R0, cy - R0, R0 * 2, R0 * 2, th, 'circle', u);
    s += `<path d="M${r2(cx + R0 * 1.55)} ${cy}A${r2(R0 * 1.55)} ${r2(R0 * 1.55 * 0.22)} 0 0 1 ${r2(cx - R0 * 1.55)} ${cy}" fill="none" stroke="${th.disk}" stroke-width="${r2(10 * u)}"/>`;
    s += pTop(w, th, u, m, d);
    const nf = Q.fit(String(d.name).toUpperCase(), 92 * u, w - 2 * m, 2, 'd', 800, -0.02);
    s += T(cx, 960 * u, nf.lines, { f: 'd', s: nf.size, w: 800, ls: -0.02 * nf.size, fill: th.fg, anchor: 'middle', lh: 1 });
    const ry = 960 * u + nf.lines.length * nf.size + 10 * u;
    s += T(cx, ry, (d.role || '').toUpperCase(), { f: 'm', s: 24 * u, w: 600, ls: 2.4 * u, fill: th.c, anchor: 'middle' });
    s += T(cx, ry + 60 * u, Q.wrap(d.title, 30 * u, w - 2 * m - 80 * u, 't', 500).slice(0, 2), { f: 't', s: 30 * u, w: 500, fill: th.mute, anchor: 'middle', lh: 1.3 });
    s += T(m, h - m, `${(d.date || '').toUpperCase()}  ·  ${(d.place || '').toUpperCase()}`, { f: 'm', s: 22 * u, w: 600, ls: 2 * u, fill: th.a });
    s += pLogo(w, h, u, m, 230);
    return s + Q.grain(w, h, 0.2);
  };
  R.panel = (w, h, d, th) => {
    const u = h / 1080, names = String(d.names || '').split('\n').filter(Boolean).slice(0, 6);
    if (th.reg === 'research') {
      const F = rFrame(w, h, th, u, d), m = F.m; let s = F.s;
      s += Q.orbits(1500 * u, 520 * u, 160 * u, 40 * u, 6, 70 * u, th.fg, 1.2 * u, 0.5, -8, `${3 * u} ${7 * u}`) + Q.quasar(1500 * u, 520 * u, 150 * u, th, { jet: 180 * u, tilt: -8, sw: 1.5 * u });
      s += T(m, 230 * u, 'PANEL', { f: 'm', s: 22 * u, w: 600, ls: 4 * u, fill: th.a });
      const ft = Q.fit(d.title, 110 * u, 1160 * u, 3, 'd', 500, -0.015);
      s += T(m, 230 * u + ft.size * 1.2, ft.lines, { f: 'd', s: ft.size, w: 500, ls: -0.015 * ft.size, fill: th.fg, lh: 1.05 });
      const y0 = 800 * u; s += `<path d="M${m} ${y0 - 50 * u}H${w - m}" stroke="${th.line}"/>`;
      names.forEach((n, i) => { const [a, b] = n.split(/\s+[—-]\s+/); const x = m + (i % 3) * 590 * u, y = y0 + Math.floor(i / 3) * 80 * u; s += T(x, y, a || '', { f: 't', s: 30 * u, w: 500, fill: th.fg }) + T(x, y + 30 * u, (b || '').toUpperCase(), { f: 'm', s: 17 * u, w: 500, ls: 1.6 * u, fill: th.mute }); });
      return s + T(w - m, h - m, `${(d.date || '').toUpperCase()} · ${(d.place || '').toUpperCase()}`, { f: 'm', s: 18 * u, w: 500, ls: 2 * u, fill: th.fg, anchor: 'end' });
    }
    const m = 96 * u; let s = Q.quasar(w / 2, 470 * u, 760 * u, th, { jet: 1200 * u, ratio: 0.2 });
    s += `<rect width="${w}" height="${h}" fill="#000" opacity=".35"/>`;
    s += T(w / 2, 170 * u, 'PANEL  ·  ' + (d.eyebrow || '').toUpperCase(), { f: 'm', s: 26 * u, w: 600, ls: 4 * u, fill: th.c, anchor: 'middle' });
    const ft = Q.fit(String(d.title).toUpperCase(), 150 * u, 1600 * u, 2, 'd', 800, -0.02);
    s += T(w / 2, 430 * u, ft.lines, { f: 'd', s: ft.size, w: 800, ls: -0.02 * ft.size, fill: th.fg, anchor: 'middle', lh: 0.98 });
    s += T(w / 2, 820 * u, [names.map((n) => n.split(/\s+[—-]\s+/)[0]).join('  ·  ')], { f: 't', s: 34 * u, w: 500, fill: th.fg, anchor: 'middle' });
    s += T(w / 2, 880 * u, `${(d.date || '').toUpperCase()}  ·  ${(d.place || '').toUpperCase()}`, { f: 'm', s: 26 * u, w: 700, ls: 3 * u, fill: th.a, anchor: 'middle' });
    s += Q.place('primary', w / 2 - 170 * u, h - m - 30 * u, 340 * u, 36 * u, { mode: 'party', align: 'center' });
    return s + Q.grain(w, h, 0.2);
  };
  R.lower = (w, h, d, th) => {
    const u = h / 1080, x = 120 * u, y = 800 * u, ns = 50 * u, rs = 22 * u;
    const tw = Math.max(Q.tw(d.name, ns, 'd', 600, -0.01 * ns), Q.tw((d.role || '').toUpperCase(), rs, 'm', 500, 2 * u)), pw = tw + 230 * u, ph = 150 * u;
    let s = `<rect x="${x}" y="${y}" width="${r2(pw)}" height="${ph}" rx="${th.reg === 'research' ? 0 : 75 * u}" fill="${th.bg}"${th.reg === 'party' ? ` stroke="${th.disk}" stroke-width="${2 * u}"` : ''} opacity=".96"/>`;
    s += Q.mark(x + 34 * u, y + 35 * u, 80 * u, th.reg === 'research' ? { mode: 'mono', ink: th.fg } : { mode: 'party' });
    s += T(x + 150 * u, y + 72 * u, d.name, { f: 'd', s: ns, w: 600, ls: -0.01 * ns, fill: th.fg }) + T(x + 150 * u, y + 112 * u, (d.role || '').toUpperCase(), { f: 'm', s: rs, w: 500, ls: 2 * u, fill: th.reg === 'party' ? th.c : th.a });
    if (th.reg === 'research') s += `<path d="M${x} ${y + ph + 10 * u}H${r2(x + pw)}" stroke="${th.a}" stroke-width="${4 * u}"/>`;
    return s;
  };
  R.quote = (w, h, d, th) => {
    const u = w / 1080;
    if (th.reg === 'research') {
      const F = rFrame(w, h, th, u, d), m = F.m; let s = F.s;
      s += T(m - 8 * u, 400 * u, '“', { f: 'd', s: 300 * u, w: 300, fill: th.a });
      const qf = Q.fit(d.quote, 60 * u, w - 2 * m, 6, 't', 500, -0.01);
      s += T(m, 470 * u, qf.lines, { f: 't', s: qf.size, w: 500, ls: -0.01 * qf.size, fill: th.fg, lh: 1.2 });
      s += T(m, 470 * u + qf.lines.length * qf.size * 1.2 + 30 * u, '— ' + (d.cite || '').toUpperCase(), { f: 'm', s: 20 * u, w: 600, ls: 2 * u, fill: th.a });
      return s + rFoot(w, h, th, u, m, 'QUOTE · ' + (d.num || '01'));
    }
    const m = 80 * u; let s = Q.quasar(w * 0.86, h * 0.14, w * 0.3, th, { tilt: 20, jet: w * 0.5 });
    s += T(m - 10 * u, 380 * u, '“', { f: 'd', s: 340 * u, w: 800, fill: th.a });
    const qf = Q.fit(String(d.quote).toUpperCase(), 76 * u, w - 2 * m, 6, 'd', 700, -0.02);
    s += T(m, 450 * u, qf.lines, { f: 'd', s: qf.size, w: 700, ls: -0.02 * qf.size, fill: th.fg, lh: 1.02 });
    s += T(m, 450 * u + qf.lines.length * qf.size * 1.02 + 30 * u, '— ' + (d.cite || '').toUpperCase(), { f: 'm', s: 22 * u, w: 700, ls: 2.4 * u, fill: th.c });
    s += pLogo(w, h, u, m, 240);
    return s + Q.grain(w, h, 0.2);
  };
  R.announce = (w, h, d, th) => {
    const u = w / 1080;
    if (th.reg === 'research') {
      const F = rFrame(w, h, th, u, d), m = F.m; let s = F.s;
      s += T(m, 200 * u, 'ANNOUNCEMENT', { f: 'm', s: 18 * u, w: 500, ls: 3 * u, fill: th.mute });
      const ft = Q.fit(d.title, 88 * u, w - 2 * m, 3, 'd', 500, -0.015);
      s += T(m, 200 * u + ft.size * 1.3, ft.lines, { f: 'd', s: ft.size, w: 500, ls: -0.015 * ft.size, fill: th.fg, lh: 1.05 });
      const rows = [['DATE', d.date], ['PLACE', d.place], ['WHAT', d.body], ['RSVP', d.cta]].filter((r) => r[1]);
      let y = 640 * u; rows.forEach(([k, v]) => { const lines = Q.wrap(v, 30 * u, w - 2 * m - 220 * u, 't', 500).slice(0, 3); s += `<path d="M${m} ${r2(y)}H${w - m}" stroke="${th.fg}" stroke-width="${u}"/>` + T(m, y + 46 * u, k, { f: 'm', s: 18 * u, w: 600, ls: 2.4 * u, fill: th.a }) + T(m + 220 * u, y + 46 * u, lines, { f: 't', s: 30 * u, w: 500, fill: th.fg, lh: 1.3 }); y += 46 * u + lines.length * 39 * u + 22 * u; });
      s += Q.quasar(w - m - 130 * u, 500 * u, 120 * u, th, { jet: 0, sw: 1.4 * u });
      if (d.tag) s += tagPill(w - m, 200 * u, d.tag, th, u);
      return s + rFoot(w, h, th, u, m, 'THE QUASAR LAB · ' + new Date().getFullYear());
    }
    const m = 72 * u; let s = Q.quasar(w * 0.5, h * 0.36, w * 0.5, th, { jet: h * 0.5, tilt: 8 });
    s += pTop(w, th, u, m, d); if (d.tag) s += tagPill(w - m, m + 18 * u, d.tag, th, u);
    const df = Q.fit(String(d.date || '').toUpperCase(), 150 * u, w - 2 * m, 2, 'd', 800, -0.03);
    s += T(m, 860 * u - (df.lines.length - 1) * df.size, df.lines, { f: 'd', s: df.size, w: 800, ls: -0.03 * df.size, fill: th.a, lh: 1 });
    const ft = Q.fit(String(d.title).toUpperCase(), 64 * u, w - 2 * m, 2, 'd', 700, -0.01);
    s += T(m, 940 * u, ft.lines, { f: 'd', s: ft.size, w: 700, ls: -0.01 * ft.size, fill: th.fg, lh: 1.05 });
    const by = 940 * u + ft.lines.length * ft.size * 1.05 + 20 * u;
    s += T(m, by, Q.wrap(d.body, 28 * u, w - 2 * m, 't').slice(0, 2), { f: 't', s: 28 * u, fill: th.mute, lh: 1.35 });
    s += T(m, h - m - 42 * u, (d.place || '').toUpperCase(), { f: 'm', s: 24 * u, w: 600, ls: 2.4 * u, fill: th.fg }) + T(m, h - m, (d.cta || '').toUpperCase(), { f: 'm', s: 22 * u, w: 600, ls: 2.4 * u, fill: th.c });
    s += pLogo(w, h, u, m, 230);
    return s + Q.grain(w, h, 0.2);
  };
  const MAP = { 'post-square': R.post, 'post-45': R.post, story: R.post, slide: R.slide, speaker: R.speaker, 'panel-title': R.panel, 'lower-third': R.lower, quote: R.quote, announce: R.announce };
  Q.renderTpl = (k, data, reg, mode, o = {}) => {
    const t = Q.TPL.find((x) => x.k === k), th = Q.theme(reg, mode), d = Object.assign({}, Q.TPL_DEFAULTS, data);
    const body = MAP[k](t.w, t.h, d, th, o);
    return Q.doc(t.w, t.h, body, { bg: th.bg, transparent: o.transparent || (t.transparent && o.transparent !== false) });
  };
  /* make an exportable item from a template */
  Q.tplItem = (k, data, reg, mode, extra = {}) => {
    const t = Q.TPL.find((x) => x.k === k);
    return Object.assign({ id: `${k}-${reg}${mode === 'dark' ? '-dark' : ''}`, title: `${t.n} · ${t.s.split(' · ')[0]}`, w: t.w, h: t.h, register: reg, format: 'social', section: 'create', transparent: !!t.transparent, dark: reg !== 'research' || mode === 'dark',
      svg: (o = {}) => Q.renderTpl(k, data, reg, mode, { transparent: t.transparent ? (o.export ? !!o.transparent : o.transparent !== false) : !!o.transparent }) }, extra);
  };
})();
