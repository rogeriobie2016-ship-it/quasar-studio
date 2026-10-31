/* Quasar Studio · brand core: tokens, logo, type metrics, patterns, icons, motifs.
   Every visual is generated as SVG markup so it can be shown inline and exported as vector or raster. */
(function () {
  const Q = (window.Q = {});
  let _id = 0;
  Q.uid = (p) => (p || 'q') + (++_id).toString(36);
  Q.esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  Q.rng = (seed) => { let s = (seed * 9301 + 49297) % 233280 || 1; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const r2 = (n) => Math.round(n * 100) / 100;
  Q.r2 = r2;

  /* ---------------- color ---------------- */
  Q.C = {
    void: '#050307', ink: '#0D0A12', ink2: '#151019', cream: '#F4EAD8', mute: '#BDB0A2', dim: '#857985',
    halo: '#FFF3D6', flare: '#FFE2A8', gold: '#FFB347', molten: '#FF7A1A', ember: '#FF4D1F', jet: '#A98BFF', violet: '#9B6BFF', electric: '#4D7CFF'
  };
  Q.PAL = {
    core: [
      { n: 'Void', k: 'void', hex: '#050307', role: 'Primary ground. The black hole at the center.' },
      { n: 'Cream', k: 'cream', hex: '#F4EAD8', role: 'Primary ink on dark. Light from far away.' },
      { n: 'Halo', k: 'halo', hex: '#FFF3D6', role: 'Hottest point of the glow. Highlights only.' },
      { n: 'Gold', k: 'gold', hex: '#FFB347', role: 'The accretion disk. Primary accent.' },
      { n: 'Molten', k: 'molten', hex: '#FF7A1A', role: 'Secondary accent, calls to action.' },
      { n: 'Ember', k: 'ember', hex: '#FF4D1F', role: 'Outer edge of the glow. Use sparingly.' },
      { n: 'Jet', k: 'jet', hex: '#A98BFF', role: 'The relativistic jets. Axis and direction.' },
      { n: 'Electric', k: 'electric', hex: '#4D7CFF', role: 'Data, links, signal.' }
    ],
    research: [
      { n: 'Paper', hex: '#EFE7DA', role: 'Archival ground' },
      { n: 'Vellum', hex: '#E2D7C4', role: 'Plates, cards, tables' },
      { n: 'Archive', hex: '#14111A', role: 'Text, figures, dark ground' },
      { n: 'Graphite', hex: '#4A4350', role: 'Secondary text, rules' },
      { n: 'Redline', hex: '#C4441A', role: 'Annotation, the one accent' },
      { n: 'Plate Blue', hex: '#34509E', role: 'Data series, references' },
      { n: 'Survey', hex: '#A0742A', role: 'Measurements, scale bars' }
    ],
    party: [
      { n: 'Blackout', hex: '#000000', role: 'Ground. Always true black.', pms: 'Black 6 C' },
      { n: 'Plasma', hex: '#FF2E88', role: 'Hot accent, headlines', pms: '806 C (fluorescent)' },
      { n: 'Flux', hex: '#FF6A00', role: 'Disk, energy', pms: '804 C (fluorescent)' },
      { n: 'UV', hex: '#7A3DFF', role: 'Jets, under blacklight', pms: '2665 C' },
      { n: 'Ion', hex: '#00E5FF', role: 'Cold contrast', pms: '801 C (fluorescent)' },
      { n: 'Laser', hex: '#C8FF1F', role: 'Wristbands, max visibility', pms: '802 C (fluorescent)' },
      { n: 'Flare', hex: '#FFC21A', role: 'The disk at full brightness', pms: '803 C (fluorescent)' }
    ],
    semantic: [
      { n: 'Events', k: 'events', hex: '#3D6BFF', dark: '#7D9BFF', tint: '#E3EAFF', tintDark: '#16204A' },
      { n: 'Travel', k: 'travel', hex: '#F06A0F', dark: '#FF9A4D', tint: '#FFE9D9', tintDark: '#3D1E08' },
      { n: 'School', k: 'school', hex: '#1E9E5C', dark: '#4FD48D', tint: '#DDF5E8', tintDark: '#0D3020' },
      { n: 'Applications', k: 'applications', hex: '#D9343B', dark: '#FF6B70', tint: '#FBE1E2', tintDark: '#3D1214' }
    ]
  };
  Q.TOKENS = [
    ['--q-bg', '#F6F0E5', '#050307', 'Page ground'],
    ['--q-surface', '#FFFBF4', '#0D0A12', 'Cards, panels'],
    ['--q-surface-2', '#EDE4D4', '#151019', 'Wells, inputs'],
    ['--q-ink', '#14111A', '#F4EAD8', 'Primary text'],
    ['--q-ink-2', '#4A4350', '#BDB0A2', 'Secondary text'],
    ['--q-ink-3', '#6E6572', '#958A95', 'Labels, captions'],
    ['--q-line', 'rgba(20,17,26,.14)', 'rgba(244,234,216,.13)', 'Rules, borders'],
    ['--q-accent', '#C4520B', '#FFB347', 'Links, focus, active'],
    ['--q-accent-2', '#5B3FD0', '#A98BFF', 'Secondary accent (jet)'],
    ['--q-on-accent', '#FFFFFF', '#1B0C02', 'Text on accent']
  ];
  Q.hexToRgb = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); };
  Q.cmyk = (h) => {
    const [r, g, b] = Q.hexToRgb(h).map((v) => v / 255); const k = 1 - Math.max(r, g, b);
    if (k >= 1) return [0, 0, 0, 100];
    return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map((v) => Math.round(v * 100));
  };

  /* Piece themes (registers) */
  Q.theme = (reg, mode) => {
    if (reg === 'party') return { reg: 'party', dark: true, bg: '#000000', fg: '#F4EAD8', mute: '#B6ABC2', line: 'rgba(244,234,216,.2)', a: '#FF2E88', b: '#7A3DFF', c: '#C8FF1F', d: '#00E5FF', e: '#FF6A00', disk: '#FFC21A', glow: ['#FFFFFF', '#FFC21A', '#FF2E88'] };
    if (reg === 'core') return { reg: 'core', dark: true, bg: '#050307', fg: '#F4EAD8', mute: '#BDB0A2', line: 'rgba(244,234,216,.14)', a: '#FFB347', b: '#A98BFF', c: '#FF7A1A', d: '#4D7CFF', e: '#FF4D1F', disk: '#FFB347', glow: ['#FFF3D6', '#FFB347', '#FF5A1F'] };
    if (mode === 'dark') return { reg: 'research', dark: true, bg: '#14111A', fg: '#EFE7DA', mute: '#A69CA8', line: 'rgba(239,231,218,.16)', grid: 'rgba(239,231,218,.06)', a: '#E8683A', b: '#8EA4F0', c: '#C9A35C', d: '#8EA4F0', e: '#E8683A', disk: '#E8683A', glow: ['#EFE7DA', '#E8683A', '#14111A'] };
    return { reg: 'research', dark: false, bg: '#EFE7DA', fg: '#14111A', mute: '#4A4350', line: 'rgba(20,17,26,.18)', grid: 'rgba(20,17,26,.07)', a: '#C4441A', b: '#34509E', c: '#A0742A', d: '#34509E', e: '#C4441A', disk: '#C4441A', glow: ['#14111A', '#C4441A', '#EFE7DA'] };
  };

  /* ---------------- type ---------------- */
  Q.F = { d: "Unbounded", t: "Space Grotesk", m: "JetBrains Mono" };
  const cv = document.createElement('canvas').getContext('2d');
  Q.tw = (str, size, fam = 'd', wt = 500, ls = 0) => {
    cv.font = `${wt} ${size}px "${Q.F[fam] || fam}"`;
    return cv.measureText(str).width + ls * Math.max(0, String(str).length - 1);
  };
  Q.wrap = (str, size, maxW, fam = 't', wt = 400, ls = 0) => {
    const out = [];
    String(str || '').split('\n').forEach((para) => {
      const words = para.split(/\s+/).filter(Boolean); let line = '';
      if (!words.length) { out.push(''); return; }
      words.forEach((w) => {
        const t = line ? line + ' ' + w : w;
        if (Q.tw(t, size, fam, wt, ls) > maxW && line) { out.push(line); line = w; } else line = t;
      });
      out.push(line);
    });
    return out;
  };
  /* fit: shrink size until text block fits maxW and maxLines */
  Q.fit = (str, size, maxW, maxLines, fam = 'd', wt = 600, lsk = 0, min = 10) => {
    let s = size, lines;
    while (s > min) { lines = Q.wrap(str, s, maxW, fam, wt, s * lsk); if (lines.length <= maxLines && lines.every((l) => Q.tw(l, s, fam, wt, s * lsk) <= maxW)) break; s -= Math.max(1, s * 0.05); }
    return { size: s, lines: lines || [str] };
  };
  /* text block: returns svg <text> with tspans */
  Q.text = (x, y, lines, o = {}) => {
    if (!Array.isArray(lines)) lines = [lines];
    const fam = Q.F[o.f || 't'] || o.f, s = o.s || 16, lh = (o.lh || 1.2) * s, ls = o.ls != null ? o.ls : 0;
    const attrs = `font-family="${fam}" font-size="${r2(s)}" font-weight="${o.w || 400}" fill="${o.fill || 'currentColor'}"${ls ? ` letter-spacing="${r2(ls)}"` : ''}${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}${o.style ? ` style="${o.style}"` : ''}`;
    return `<text x="${r2(x)}" y="${r2(y)}" ${attrs}>${lines.map((l, i) => `<tspan x="${r2(x)}" dy="${i ? r2(lh) : 0}">${Q.esc(o.upper ? String(l).toUpperCase() : l)}</tspan>`).join('')}</text>`;
  };

  /* ---------------- logo ---------------- */
  /* symbol, drawn in a 40×40 box. modes: color (on dark), color-light (on light), mono, party */
  Q.markInner = (o = {}) => {
    const mode = o.mode || 'color', id = Q.uid('g'), mid = Q.uid('m');
    if (mode === 'mono') {
      const ink = o.ink || Q.C.cream;
      return `<defs><mask id="${mid}" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40"><rect width="40" height="40" fill="#fff"/><circle cx="20" cy="20" r="6.9" fill="#000"/></mask></defs>` +
        `<path d="M20 1.5v10M20 28.5v10" stroke="${ink}" stroke-width="1.5" stroke-linecap="round"/>` +
        `<ellipse cx="20" cy="20" rx="17.5" ry="5" fill="none" stroke="${ink}" stroke-width="1.8" mask="url(#${mid})"/>` +
        `<circle cx="20" cy="20" r="4.8" fill="none" stroke="${ink}" stroke-width="1.5"/>`;
    }
    const P = {
      color: ['#FFF3D6', '#FFB347', '#FF5A1F', '#A98BFF', '#FFB347', '#050307', '#FFE2A8', 0.55],
      'color-light': ['#FFE7B8', '#FF9A2E', '#FF5A1F', '#6A45E0', '#E8650F', '#050307', '#050307', 0.5],
      party: ['#FFFFFF', '#FFC21A', '#FF2E88', '#7A3DFF', '#FFC21A', '#000000', '#FFFFFF', 0.7]
    }[mode] || [];
    return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${P[0]}"/><stop offset=".45" stop-color="${P[1]}"/><stop offset="1" stop-color="${P[2]}" stop-opacity="0"/></radialGradient></defs>` +
      `<circle cx="20" cy="20" r="15" fill="url(#${id})" opacity="${P[7]}"/>` +
      `<path d="M20 1.5v10M20 28.5v10" stroke="${P[3]}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<ellipse cx="20" cy="20" rx="17.5" ry="5" fill="none" stroke="${P[4]}" stroke-width="1.6"/>` +
      `<circle cx="20" cy="20" r="4.8" fill="${o.core || P[5]}" stroke="${P[6]}" stroke-width=".9"/>`;
  };
  Q.mark = (x, y, size, o = {}) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(size / 40 * 1000) / 1000})">${Q.markInner(o)}</g>`;
  Q.inkFor = (mode, ink) => ink || (mode === 'color-light' ? '#14111A' : mode === 'party' ? '#FFFFFF' : '#F4EAD8');

  /* wordmark "THE QUASAR LAB" in one line with weight contrast */
  Q.wordmark = (x, y, size, ink, anchor) => {
    const ls = size * 0.12, a = Q.tw('THE ', size, 'd', 300, ls) + ls, b = Q.tw('QUASAR', size, 'd', 700, ls) + ls, c = Q.tw(' LAB', size, 'd', 300, ls);
    const w = a + b + c, x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
    return { w, svg: `<text x="${r2(x0)}" y="${r2(y)}" font-family="Unbounded" font-size="${r2(size)}" letter-spacing="${r2(ls)}" fill="${ink}"><tspan font-weight="300">THE </tspan><tspan font-weight="700">QUASAR</tspan><tspan font-weight="300"> LAB</tspan></text>` };
  };
  Q.logoTypes = ['primary', 'horizontal', 'stacked', 'symbol'];
  /* returns {w,h,inner}; o: {mode, ink, pad} */
  Q.logo = (type = 'primary', o = {}) => {
    const mode = o.mode || 'color', ink = Q.inkFor(mode, o.ink), mo = { mode, ink };
    let w, h, inner = '';
    if (type === 'symbol') { w = 64; h = 64; inner = Q.mark(0, 0, 64, mo); }
    else if (type === 'primary' || type === 'horizontal') {
      const ts = 21, wm = Q.wordmark(80, 32 + ts * 0.36, ts, ink);
      inner = Q.mark(0, 0, 64, mo) + wm.svg; w = 80 + wm.w; h = 64;
      if (type === 'horizontal') {
        const ms = 8.6, mls = 1.6, l1 = 'RESEARCH + DESIGN LAB', l2 = 'EST. MIT 2018 · USC MA+P';
        const mw = Math.max(Q.tw(l1, ms, 'm', 500, mls), Q.tw(l2, ms, 'm', 500, mls)), rx = w + 22;
        inner += `<path d="M${r2(rx)} 17v30" stroke="${ink}" stroke-width="1" opacity=".55"/>` +
          Q.text(rx + 22, 29.5, [l1, l2], { f: 'm', s: ms, w: 500, ls: mls, fill: ink, lh: 1.65 });
        w = rx + 22 + mw;
      }
    } else if (type === 'stacked') {
      const big = 38, sm = 12.5, lsB = big * 0.08, lsS = sm * 0.5;
      const bw = Q.tw('QUASAR', big, 'd', 700, lsB); w = Math.max(bw, 96); const cx = w / 2;
      inner = Q.mark(cx - 48, 0, 96, mo) +
        `<text x="${r2(cx)}" y="${96 + 34}" text-anchor="middle" font-family="Unbounded" font-weight="300" font-size="${sm}" letter-spacing="${lsS}" fill="${ink}">THE</text>` +
        `<text x="${r2(cx)}" y="${96 + 34 + 44}" text-anchor="middle" font-family="Unbounded" font-weight="700" font-size="${big}" letter-spacing="${r2(lsB)}" fill="${ink}">QUASAR</text>` +
        `<text x="${r2(cx)}" y="${96 + 34 + 44 + 28}" text-anchor="middle" font-family="Unbounded" font-weight="300" font-size="${sm}" letter-spacing="${lsS}" fill="${ink}">LAB</text>`;
      h = 96 + 34 + 44 + 28 + 4;
    }
    if (o.pad) { const X = type === 'stacked' ? 24 : 16; inner = `<g transform="translate(${X} ${X})">${inner}</g>`; w += X * 2; h += X * 2; }
    return { w: r2(w), h: r2(h), inner };
  };
  /* place a logo inside a box (x,y,maxW,maxH) */
  Q.place = (type, x, y, maxW, maxH, o = {}) => {
    const L = Q.logo(type, o), s = Math.min(maxW / L.w, maxH / L.h);
    const ox = o.align === 'center' ? x + (maxW - L.w * s) / 2 : o.align === 'right' ? x + maxW - L.w * s : x;
    const oy = o.valign === 'bottom' ? y + maxH - L.h * s : o.valign === 'middle' ? y + (maxH - L.h * s) / 2 : y;
    return `<g transform="translate(${r2(ox)} ${r2(oy)}) scale(${r2(s * 1000) / 1000})">${L.inner}</g>`;
  };

  /* ---------------- document ---------------- */
  Q.doc = (w, h, body, o = {}) => {
    const bg = o.bg && !o.transparent ? `<rect x="${-w}" y="${-h}" width="${w * 3}" height="${h * 3}" fill="${o.bg}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${r2(w)} ${r2(h)}" width="${r2(w)}" height="${r2(h)}">${bg}${body}</svg>`;
  };

  /* ---------------- textures + patterns ---------------- */
  Q.grain = (w, h, op = 0.18, freq = 0.85, seed = 3, blend = 'overlay') => {
    const id = Q.uid('gr');
    if (Q._lite) return '';
    const m = Math.round(Math.max(w, h) * 0.04);
    return `<filter id="${id}" x="${-m}" y="${-m}" width="${w + 2 * m}" height="${h + 2 * m}" filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect x="${-m}" y="${-m}" width="${w + 2 * m}" height="${h + 2 * m}" filter="url(#${id})" opacity="${op}"${blend === 'normal' ? '' : ` style="mix-blend-mode:${blend}"`}/>`;
  };
  Q.orbits = (cx, cy, rx, ry, n, step, stroke, sw = 1, op = 0.5, tilt = 0, dash) => {
    let s = `<g transform="rotate(${tilt} ${r2(cx)} ${r2(cy)})" fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${op}">`;
    for (let i = 0; i < n; i++) s += `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(rx + i * step)}" ry="${r2(ry + i * step * (ry / rx))}"${dash && i % 2 ? ` stroke-dasharray="${dash}"` : ''}/>`;
    return s + '</g>';
  };
  /* repeatable orbit-field pattern: returns {id, defs} usable as fill="url(#id)" */
  Q.orbitPattern = (S, fg, op = 1, sw = 1.2, bg) => {
    const id = Q.uid('op'), H = S * 0.62, rx = S * 0.36, ry = H * 0.16, cr = S * 0.055;
    const unit = (x, y) => `<ellipse cx="${r2(x)}" cy="${r2(y)}" rx="${r2(rx)}" ry="${r2(ry)}"/><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(cr)}" fill="${fg}"/><path d="M${r2(x)} ${r2(y - H * 0.42)}v${r2(H * 0.2)}M${r2(x)} ${r2(y + H * 0.22)}v${r2(H * 0.2)}"/>`;
    const defs = `<pattern id="${id}" width="${r2(S)}" height="${r2(H)}" patternUnits="userSpaceOnUse">${bg ? `<rect width="${r2(S)}" height="${r2(H)}" fill="${bg}"/>` : ''}<g fill="none" stroke="${fg}" stroke-width="${sw}" opacity="${op}" stroke-linecap="round">${unit(S / 2, H / 2)}${unit(0, 0)}${unit(S, 0)}${unit(0, H)}${unit(S, H)}</g></pattern>`;
    return { id, defs };
  };
  Q.gridPattern = (S, color, major = 5) => {
    const id = Q.uid('gp'), M = S * major;
    let p = `<pattern id="${id}" width="${M}" height="${M}" patternUnits="userSpaceOnUse"><g stroke="${color}" fill="none">`;
    for (let i = 0; i < major; i++) p += `<path d="M${i * S} 0V${M}M0 ${i * S}H${M}" stroke-width="${i ? 0.5 : 1.1}"/>`;
    return { id, defs: p + '</g></pattern>' };
  };
  Q.dotPattern = (S, color, r = 1.4) => { const id = Q.uid('dp'); return { id, defs: `<pattern id="${id}" width="${S}" height="${S}" patternUnits="userSpaceOnUse"><circle cx="${S / 2}" cy="${S / 2}" r="${r}" fill="${color}"/></pattern>` }; };
  /* signal noise: seeded horizontal dashes, like a weak transmission */
  Q.signal = (x, y, w, h, color, seed = 7, rows = 40, op = 0.6) => {
    const R = Q.rng(seed), rh = h / rows; let s = `<g fill="${color}" opacity="${op}">`;
    for (let i = 0; i < rows; i++) {
      let cx = x + R() * w * 0.1;
      while (cx < x + w) { const len = Math.pow(R(), 3) * w * 0.22 + 2, gap = R() * w * 0.08 + 2; if (R() > 0.35) s += `<rect x="${r2(cx)}" y="${r2(y + i * rh + rh * 0.3)}" width="${r2(Math.min(len, x + w - cx))}" height="${r2(Math.max(1, rh * (R() > 0.85 ? 0.7 : 0.3)))}"/>`; cx += len + gap; }
    }
    return s + '</g>';
  };
  Q.regMarks = (w, h, m, color, len = 18) => {
    const c = (x, y, dx, dy) => `<path d="M${x} ${y + dy * len}V${y}H${x + dx * len}"/>`;
    return `<g fill="none" stroke="${color}" stroke-width="1.2">${c(m, m, 1, 1)}${c(w - m, m, -1, 1)}${c(m, h - m, 1, -1)}${c(w - m, h - m, -1, -1)}</g>`;
  };

  /* big quasar motif. r = disk radius x. o: {jet, tilt, glow, labels, theme} */
  Q.quasar = (cx, cy, r, th, o = {}) => {
    const id = Q.uid('qz'), ry = r * (o.ratio || 0.24), core = r * 0.24, jet = o.jet != null ? o.jet : r * 2.6;
    let s = `<g transform="rotate(${o.tilt || 0} ${r2(cx)} ${r2(cy)})">`;
    if (th.reg === 'research') {
      const sw = o.sw || Math.max(1, r * 0.008);
      s += `<g fill="none" stroke="${th.fg}" stroke-width="${r2(sw)}">` +
        `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(r * 1.25)}" ry="${r2(ry * 1.25)}" stroke-dasharray="${r2(sw * 3)} ${r2(sw * 5)}" opacity=".6"/>` +
        `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(r * 0.72)}" ry="${r2(ry * 0.72)}" opacity=".5"/>` +
        `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(core * 2.3)}" stroke-dasharray="1 ${r2(sw * 4)}" opacity=".7"/>` +
        `<path d="M${r2(cx - r)} ${r2(cy)}A${r2(r)} ${r2(ry)} 0 0 1 ${r2(cx + r)} ${r2(cy)}" stroke="${th.a}" stroke-width="${r2(sw * 2)}"/>` +
        `</g><circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(core)}" fill="${th.fg}"/>` +
        `<path d="M${r2(cx + r)} ${r2(cy)}A${r2(r)} ${r2(ry)} 0 0 1 ${r2(cx - r)} ${r2(cy)}" fill="none" stroke="${th.a}" stroke-width="${r2(sw * 2)}"/>`;
      if (jet) s += `<g stroke="${th.fg}" stroke-width="${r2(sw)}" fill="${th.fg}"><path d="M${r2(cx)} ${r2(cy - core * 1.6)}V${r2(cy - jet)}M${r2(cx)} ${r2(cy + core * 1.6)}V${r2(cy + jet)}"/><path d="M${r2(cx - sw * 4)} ${r2(cy - jet + sw * 8)}L${r2(cx)} ${r2(cy - jet)}L${r2(cx + sw * 4)} ${r2(cy - jet + sw * 8)}M${r2(cx - sw * 4)} ${r2(cy + jet - sw * 8)}L${r2(cx)} ${r2(cy + jet)}L${r2(cx + sw * 4)} ${r2(cy + jet - sw * 8)}" fill="none"/></g>`;
      if (o.labels) {
        const L = (x1, y1, x2, y2, t) => `<path d="M${r2(x1)} ${r2(y1)}L${r2(x2)} ${r2(y2)}H${r2(x2 + (x2 > x1 ? 1 : -1) * r * 0.3)}" fill="none" stroke="${th.fg}" stroke-width="${r2(sw)}" opacity=".7"/><circle cx="${r2(x1)}" cy="${r2(y1)}" r="${r2(sw * 2.2)}" fill="${th.a}"/>` + Q.text(x2 + (x2 > x1 ? 1 : -1) * r * 0.32, y2 + r * 0.025, t, { f: 'm', s: r * 0.075, w: 500, ls: r * 0.008, fill: th.fg, anchor: x2 > x1 ? 'start' : 'end' });
        s += L(cx + r * 0.2, cy - core * 0.2, cx + r * 0.9, cy - r * 0.62, 'A · CORE / EVENT HORIZON') + L(cx - r * 0.98, cy + ry * 0.2, cx - r * 1.2, cy + r * 0.5, 'B · ACCRETION DISK') + L(cx, cy - jet * 0.7, cx - r * 0.5, cy - jet * 0.82, 'C · JET') + L(cx + core * 2.2, cy + core * 0.9, cx + r * 1.0, cy + r * 0.48, 'D · HALO');
      }
    } else {
      const g = th.glow, gid = id + 'g', jid = id + 'j';
      s += `<defs><radialGradient id="${gid}"><stop offset="0" stop-color="${g[0]}"/><stop offset=".22" stop-color="${g[1]}" stop-opacity=".9"/><stop offset=".55" stop-color="${g[2]}" stop-opacity=".35"/><stop offset="1" stop-color="${g[2]}" stop-opacity="0"/></radialGradient>` +
        `<linearGradient id="${jid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${th.b}" stop-opacity="0"/><stop offset=".42" stop-color="${th.b}"/><stop offset=".5" stop-color="#FFFFFF"/><stop offset=".58" stop-color="${th.b}"/><stop offset="1" stop-color="${th.b}" stop-opacity="0"/></linearGradient></defs>`;
      if (o.glow !== false) s += `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(r * 1.15)}" ry="${r2(r * 0.95)}" fill="url(#${gid})"/>`;
      if (jet) s += `<rect x="${r2(cx - r * 0.022)}" y="${r2(cy - jet)}" width="${r2(r * 0.044)}" height="${r2(jet * 2)}" fill="url(#${jid})"/><rect x="${r2(cx - r * 0.1)}" y="${r2(cy - jet * 0.8)}" width="${r2(r * 0.2)}" height="${r2(jet * 1.6)}" fill="url(#${jid})" opacity=".25"/>`;
      s += `<path d="M${r2(cx - r)} ${r2(cy)}A${r2(r)} ${r2(ry)} 0 0 1 ${r2(cx + r)} ${r2(cy)}" fill="none" stroke="${th.disk}" stroke-width="${r2(r * 0.035)}" opacity=".85"/>` +
        `<ellipse cx="${r2(cx)}" cy="${r2(cy)}" rx="${r2(r * 1.32)}" ry="${r2(ry * 1.32)}" fill="none" stroke="${th.disk}" stroke-width="${r2(r * 0.008)}" opacity=".45"/>` +
        `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(core)}" fill="${th.bg}" stroke="${g[0]}" stroke-width="${r2(r * 0.014)}"/>` +
        `<path d="M${r2(cx + r)} ${r2(cy)}A${r2(r)} ${r2(ry)} 0 0 1 ${r2(cx - r)} ${r2(cy)}" fill="none" stroke="${th.disk}" stroke-width="${r2(r * 0.04)}"/>`;
    }
    return s + '</g>';
  };

  /* ---------------- icons (24 grid, 1.5 stroke) ---------------- */
  const I = {
    d12: { n: 'Flat', k: '1–2', d: 'Line and plane. Image, text, the flat surface.', p: '<circle cx="5" cy="5.5" r="1.4" fill="currentColor" stroke="none"/><path d="M9 5.5h11"/><path d="M4 10.5h16v9H4z"/>' },
    d3: { n: 'Space', k: '3', d: 'Volume. The room, the body in it.', p: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5L12 12l8-4.5M12 12v9"/>' },
    d4: { n: 'Time', k: '4', d: 'Duration, sequence, the orbit period.', p: '<path d="M20 12a8 8 0 1 1-4-6.93"/><circle cx="16" cy="5.07" r="1.4" fill="currentColor" stroke="none"/><path d="M12 8v4l2.8 2"/>' },
    d5: { n: 'Mechanics', k: '5', d: 'Rules, interaction, what the visitor can do.', p: '<path d="M3.5 19.5h17"/><path d="M9.5 19.5l2.5-3.5 2.5 3.5"/><path d="M5 9.5l14 5"/><circle cx="5" cy="9.5" r="2"/>' },
    d6: { n: 'Arrival', k: '6', d: 'Paratext. Threshold, invitation, the way in and the way home.', p: '<path d="M3 20.5h18"/><path d="M7 20.5V4.5h10v16"/><path d="M4 12h8M9.5 9.5L12 12l-2.5 2.5"/>' },
    d7: { n: 'Affect', k: '7', d: 'What stays in the body after you leave.', p: '<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="9" stroke-dasharray="1.5 2.5"/>' },
    loop: { n: 'Propinquital loop', k: '∞', d: 'Nearness feeding back: affect returns to the flat and starts again.', p: '<path d="M12 12c-1.9-2.8-3.8-4.2-5.7-4.2a4.2 4.2 0 0 0 0 8.4c1.9 0 3.8-1.4 5.7-4.2s3.8-4.2 5.7-4.2a4.2 4.2 0 0 1 0 8.4c-1.9 0-3.8-1.4-5.7-4.2z"/><circle cx="6.3" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="17.7" cy="12" r="1.2" fill="currentColor" stroke="none"/>' },
    hiipe: { n: 'HIIPE', k: 'H', d: 'Holistic, Intuitive, Iterative, Project Evolution.', p: '<path d="M12 12.5a1.2 1.2 0 0 1-1.2-1.2 2.4 2.4 0 0 1 2.4-2.4 3.6 3.6 0 0 1 3.6 3.6 4.8 4.8 0 0 1-4.8 4.8 6 6 0 0 1-6-6 7.2 7.2 0 0 1 7.2-7.2"/><path d="M11.8 2.4l1.6 1.7-1.6 1.7"/>' },
    dbh: { n: 'Data Black Hole', k: 'DBH', d: 'A data system that makes people disappear.', p: '<ellipse cx="12" cy="14" rx="9" ry="3.2"/><circle cx="12" cy="14" r="2.6" fill="currentColor" stroke="none"/><circle cx="4.5" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="19.5" cy="4.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none"/><path d="M5.5 6.4l3.5 4.4M18.5 6l-3.4 4.6M12 5v4.8" stroke-dasharray="1.2 1.6"/>' },
    ndf: { n: 'NDF', k: 'NDF', d: 'Not Designed For: the people a system never imagined.', p: '<path d="M3.5 8.5h11v11h-11z"/><circle cx="15.5" cy="8.5" r="5"/>' },
    droid: { n: 'DROID', k: '2×', d: 'Double ROI: return on investment and return on impact.', p: '<circle cx="8.5" cy="12" r="5.5"/><circle cx="15.5" cy="12" r="5.5"/><path d="M6.7 4.6l2.2 1.9-2.4 1.6M17.3 19.4l-2.2-1.9 2.4-1.6"/>' },
    physics: { n: 'Quasar Physics', k: 'QP', d: 'Stories and data on the same plane.', p: '<path d="M12 2.5v5M12 16.5v5"/><ellipse cx="12" cy="12" rx="9.5" ry="3"/><circle cx="12" cy="12" r="2.6"/>' },
    signal: { n: 'Signal', k: '~', d: 'Light from far away. Transmission.', p: '<circle cx="4.5" cy="12" r="1.6" fill="currentColor" stroke="none"/><path d="M9 8.5a5 5 0 0 1 0 7M13 6a8.5 8.5 0 0 1 0 12M17 3.5a12 12 0 0 1 0 17"/>' }
  };
  Q.ICONS = I;
  Q.icon = (k, size = 24, color = 'currentColor', sw = 1.5) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="color:${color}">${I[k].p}</svg>`;
  Q.iconG = (k, x, y, size, color, sw = 1.5) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(size / 24 * 1000) / 1000})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" color="${color}">${I[k].p.replace(/currentColor/g, color)}</g>`;
  Q.SEVEN = ['d12', 'd3', 'd4', 'd5', 'd6', 'd7', 'loop'];
  Q.CONCEPTS = ['hiipe', 'physics', 'dbh', 'ndf', 'droid', 'signal'];

  /* die-cut sticker: white border via morphology. Wrap any group. */
  Q.dieCut = (inner, border = 14, shadow = true) => {
    const id = Q.uid('dc');
    return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="${border}" result="d"/><feFlood flood-color="#FFFFFF"/><feComposite in2="d" operator="in" result="w"/>${shadow ? `<feGaussianBlur in="d" stdDeviation="${border * 0.35}" result="b"/><feOffset in="b" dy="${border * 0.25}" result="o"/><feFlood flood-color="#000" flood-opacity=".28"/><feComposite in2="o" operator="in" result="s"/>` : ''}<feMerge>${shadow ? '<feMergeNode in="s"/>' : ''}<feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge></filter><g filter="url(#${id})">${inner}</g>`;
  };

  /* events */
  Q.EVENTS = [
    { k: 'uxr', n: 'UnitedXR Europe', city: 'Brussels', place: 'Maison de la Poste', date: 'DEC 7–9, 2026', short: 'BRU · 12.2026', what: 'Booth Dec 8 · Panel + Reality Hack afterparty at LaVallée' },
    { k: 'mit', n: 'MIT Reality Hack', city: 'Cambridge, MA', place: 'MIT', date: 'JAN 2027', short: 'CAM · 01.2027', what: 'Hack, workshops, afterparty' },
    { k: 'sun', n: 'Sundance', city: 'Sundance 2027', place: 'Festival week', date: 'JAN 2027', short: 'SDNC · 01.2027', what: 'Screenings, salon, gathering' }
  ];
})();
