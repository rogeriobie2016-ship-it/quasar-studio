/* Quasar Studio · illustration system. Each illustration draws in a 1600×1200 field for either register. */
(function () {
  const r2 = Q.r2, T = Q.text;
  const cap = (th, n, title) => th.reg === 'research' ? T(80, 1140, `FIG. ${n} — ${title}`, { f: 'm', s: 18, w: 500, ls: 2.4, fill: th.fg }) + `<path d="M80 1108H1520" stroke="${th.fg}" stroke-width="1" opacity=".35"/>` + T(1520, 1140, 'THE QUASAR LAB · ARCHIVE', { f: 'm', s: 14, w: 500, ls: 2, fill: th.mute, anchor: 'end' }) + Q.regMarks(1600, 1200, 34, th.fg, 22) : '';
  const cyc = (th, i) => th.reg === 'party' ? [th.a, th.e, th.disk, th.c, th.d, th.b, '#FFFFFF'][i % 7] : i === 6 ? th.a : th.fg;
  const arrowDef = (id, color) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${color}"/></marker>`;
  const grain = (th) => th.reg === 'party' ? Q.grain(1600, 1200, 0.22) : '';
  const L = [];

  L.push({ k: 'anatomy', n: 'Anatomy of a quasar', desc: 'The mark as a scientific plate: core, disk, jet, halo.', draw: (th) =>
    (th.reg === 'research' ? Q.orbits(800, 560, 520, 125, 3, 120, th.fg, 0.8, 0.18, 0, '2 8') : '') + Q.quasar(800, 560, 430, th, { labels: th.reg === 'research', jet: 470 }) + grain(th) + cap(th, '01', 'ANATOMY OF A QUASAR') });

  L.push({ k: 'seven', n: 'The Seventh Dimension', desc: 'Seven nested orbits of spatial design, with the propinquital loop.', draw: (th) => {
    const cx = 800, cy = 560, names = [['01–02', 'Flat'], ['03', 'Space'], ['04', 'Time'], ['05', 'Mechanics'], ['06', 'Arrival · paratext'], ['07', 'Affect']];
    const id = Q.uid('ar'); let s = `<defs>${arrowDef(id, th.reg === 'party' ? th.c : th.a)}</defs>`;
    for (let i = 5; i >= 0; i--) { const rx = 150 + i * 108, ry = rx * 0.36, c = cyc(th, i); s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${r2(ry)}" fill="none" stroke="${c}" stroke-width="${th.reg === 'party' ? 3 : i === 5 ? 2 : 1.2}" ${i % 2 && th.reg === 'research' ? 'stroke-dasharray="3 7"' : ''}/>`; }
    s += `<path d="M${cx - 60} ${cy}l60 -22l60 22l-60 22z" fill="${th.reg === 'party' ? th.a : th.fg}" opacity=".9"/>`;
    for (let i = 0; i < 6; i++) { const rx = 150 + i * 108, ry = rx * 0.36, y = cy - ry; s += `<circle cx="${cx}" cy="${r2(y)}" r="7" fill="${th.bg}" stroke="${cyc(th, i)}" stroke-width="2.5"/>` + T(cx + 18, y + 6, `${names[i][0]} · ${names[i][1].toUpperCase()}`, { f: 'm', s: 17, w: 500, ls: 1.6, fill: th.fg }); }
    const rx7 = 150 + 5 * 108, ry7 = rx7 * 0.36;
    s += `<path d="M${cx - rx7 * 0.96} ${r2(cy + ry7 * 0.3)}C${cx - rx7 * 0.8} ${r2(cy + ry7 * 1.55)} ${cx - 120} ${r2(cy + ry7 * 1.25)} ${cx - 34} ${cy + 26}" fill="none" stroke="${th.reg === 'party' ? th.c : th.a}" stroke-width="3" stroke-dasharray="10 8" marker-end="url(#${id})"/>` + T(cx - rx7 * 0.66, cy + ry7 * 1.32, 'PROPINQUITAL LOOP', { f: 'm', s: 17, w: 600, ls: 2.4, fill: th.reg === 'party' ? th.c : th.a });
    Q.SEVEN.forEach((k, i) => { const x = 170 + i * 200; s += Q.iconG(k, x, 920, 44, cyc(th, i), 1.5) + T(x + 22, 996, Q.ICONS[k].k, { f: 'm', s: 14, w: 600, ls: 1, fill: th.mute, anchor: 'middle' }); });
    return s + grain(th) + cap(th, '02', 'THE SEVENTH DIMENSION');
  } });

  L.push({ k: 'dbh', n: 'Data Black Hole', desc: 'People pulled out of view by a data system that was not built to see them.', draw: (th) => {
    const cx = 800; let s = '';
    for (let i = 0; i < 16; i++) { const f = i / 15, rx = 720 * Math.pow(1 - f, 1.5) + 18, cy = 360 + Math.pow(f, 2.2) * 560; s += `<ellipse cx="${cx}" cy="${r2(cy)}" rx="${r2(rx)}" ry="${r2(rx * 0.22)}" fill="none" stroke="${th.reg === 'party' ? (i % 3 ? th.b : th.a) : th.fg}" stroke-width="${i ? 1.2 : 2}" opacity="${r2(1 - f * 0.5)}"/>`; }
    s += `<ellipse cx="${cx}" cy="920" rx="20" ry="6" fill="${th.reg === 'party' ? '#000' : th.fg}"/>`;
    const rnd = Q.rng(42);
    for (let i = 0; i < 90; i++) { const a = rnd() * Math.PI * 2, rr = 120 + rnd() * 640, f = rnd(), fall = f > 0.62; const x = cx + Math.cos(a) * rr * (fall ? 1 - (f - 0.62) * 2.2 : 1), y = 360 + Math.sin(a) * rr * 0.22 + (fall ? Math.pow((f - 0.62) * 2.4, 2) * 540 : -rnd() * 220 - 20); s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${fall ? 4 : 6}" fill="${fall ? th.mute : th.reg === 'party' ? cyc(th, i) : th.a}" opacity="${fall ? 0.55 : 1}"/>`; }
    const lab = (x, y, x2, y2, t) => `<path d="M${x} ${y}L${x2} ${y2}" stroke="${th.fg}" stroke-width="1" opacity=".6"/>` + T(x2 + (x2 > x ? 10 : -10), y2 + 5, t, { f: 'm', s: 17, w: 500, ls: 1.8, fill: th.fg, anchor: x2 > x ? 'start' : 'end' });
    s += lab(560, 560, 300, 520, 'THE MISSING FIELD') + lab(1010, 640, 1240, 600, 'THE BOX THAT DOES NOT FIT') + lab(820, 860, 1060, 900, 'THE DATASET THAT NEVER COUNTED YOU');
    return s + grain(th) + cap(th, '03', 'DATA BLACK HOLE');
  } });

  L.push({ k: 'physics', n: 'Quasar Physics', desc: 'Stories and data on the same plane, so neither erases the other.', draw: (th) => {
    let s = `<path d="M240 300L1460 240L1360 900L140 960Z" fill="none" stroke="${th.fg}" stroke-width="1.5" opacity=".5"/>`;
    const sk = (x, y, w, h, c, type, i) => { const g = `<g transform="translate(${x} ${y}) skewY(-2.8)"><rect width="${w}" height="${h}" rx="10" fill="${th.bg}" stroke="${c}" stroke-width="2"/>`; return g + (type === 'story' ? [0, 1, 2].map((j) => `<rect x="20" y="${40 + j * 26}" width="${w - 40 - j * 50}" height="8" rx="4" fill="${c}" opacity=".6"/>`).join('') + T(20, 26, `STORY ${i}`, { f: 'm', s: 13, w: 600, ls: 1.5, fill: c }) : T(20, 26, `DATA ${i}`, { f: 'm', s: 13, w: 600, ls: 1.5, fill: c }) + [0, 1, 2, 3, 4].map((j) => { const bh = 16 + ((i * 7 + j * 13) % 40); return `<rect x="${24 + j * 34}" y="${h - 18 - bh}" width="20" height="${bh}" fill="${c}"/>`; }).join('')) + '</g>'; };
    const cs = th.reg === 'party' ? th.e : th.a, cd = th.reg === 'party' ? th.d : th.b;
    for (let i = 0; i < 4; i++) { s += sk(300 + i * 270, 380 - i * 13, 220, 140, cs, 'story', i + 1); s += sk(260 + i * 270, 660 - i * 13, 220, 140, cd, 'data', i + 1); s += `<path d="M${410 + i * 270} ${r2(530 - i * 13)}L${370 + i * 270} ${r2(660 - i * 13)}" stroke="${th.fg}" stroke-dasharray="3 5" opacity=".7"/>`; }
    s += T(1380, 230, 'SAME PLANE', { f: 'm', s: 18, w: 600, ls: 3, fill: th.fg, anchor: 'end' });
    return s + grain(th) + cap(th, '04', 'QUASAR PHYSICS');
  } });

  L.push({ k: 'hiipe', n: 'HIIPE spiral', desc: 'Holistic, Intuitive, Iterative, Project Evolution: each turn wider than the last.', draw: (th) => {
    const cx = 800, cy = 570; let d = ''; for (let a = 0; a <= Math.PI * 7; a += 0.05) { const r = 18 + a * 21; d += (a ? 'L' : 'M') + r2(cx + Math.cos(a) * r) + ' ' + r2(cy + Math.sin(a) * r * 0.8); }
    let s = `<path d="${d}" fill="none" stroke="${th.reg === 'party' ? th.b : th.fg}" stroke-width="2.5" opacity=".85"/>`;
    const st = [['H', 'Holistic', 'Enter whole. The designer is part of the community.'], ['I', 'Intuitive', 'Trust the body and the room before the brief.'], ['I', 'Iterative', 'Build · Plus/Delta · i*+1.'], ['PE', 'Project Evolution', 'The project outlives the project.']];
    st.forEach((x, i) => { const a = Math.PI * (2.2 + i * 1.45), r = 18 + a * 21, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * 0.8, c = cyc(th, i + (th.reg === 'party' ? 0 : 6 * (i === 3 ? 1 : 0))); s += `<circle cx="${r2(px)}" cy="${r2(py)}" r="38" fill="${th.bg}" stroke="${th.reg === 'party' ? c : th.a}" stroke-width="3"/>` + T(px, py + 11, x[0], { f: 'd', s: 30, w: 700, fill: th.fg, anchor: 'middle' }) + T(px + (px > cx ? 56 : -56), py - 6, x[1].toUpperCase(), { f: 'd', s: 20, w: 600, fill: th.fg, anchor: px > cx ? 'start' : 'end' }) + T(px + (px > cx ? 56 : -56), py + 22, x[2], { f: 't', s: 17, fill: th.mute, anchor: px > cx ? 'start' : 'end' }); });
    s += Q.quasar(cx, cy, 34, th, { jet: 0, glow: true });
    return s + grain(th) + cap(th, '05', 'HIIPE · A METHOD IN MOTION');
  } });

  L.push({ k: 'droid', n: 'DROID double loop', desc: 'Return on investment and return on impact feeding each other.', draw: (th) => {
    const id = Q.uid('ar'), c1 = th.reg === 'party' ? th.e : th.a, c2 = th.reg === 'party' ? th.d : th.b;
    let s = `<defs>${arrowDef(id + 'a', c1)}${arrowDef(id + 'b', c2)}</defs>`;
    s += `<circle cx="590" cy="560" r="300" fill="none" stroke="${c1}" stroke-width="4"/><circle cx="1010" cy="560" r="300" fill="none" stroke="${c2}" stroke-width="4"/>`;
    s += `<path d="M590 220A340 340 0 0 1 860 330" fill="none" stroke="${c1}" stroke-width="3" marker-end="url(#${id}a)"/><path d="M1010 900A340 340 0 0 1 740 790" fill="none" stroke="${c2}" stroke-width="3" marker-end="url(#${id}b)"/>`;
    s += T(470, 560, ['RETURN ON', 'INVESTMENT'], { f: 'd', s: 30, w: 600, fill: th.fg, anchor: 'middle', lh: 1.15 }) + T(1130, 560, ['RETURN ON', 'IMPACT'], { f: 'd', s: 30, w: 600, fill: th.fg, anchor: 'middle', lh: 1.15 }) + T(800, 570, 'DROID', { f: 'd', s: 34, w: 700, fill: th.reg === 'party' ? th.c : th.a, anchor: 'middle', ls: 3 });
    return s + grain(th) + cap(th, '06', 'DROID · THE DOUBLE ROI');
  } });

  L.push({ k: 'ndf', n: 'Not Designed For', desc: 'A grid built for squares, and the one shape it never imagined.', draw: (th) => {
    let s = ''; const cols = 10, rows = 6, S = 104, x0 = 800 - (cols * S) / 2, y0 = 210;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (r === 2 && c === 6) continue; s += `<rect x="${x0 + c * S + 12}" y="${y0 + r * S + 12}" width="${S - 24}" height="${S - 24}" fill="none" stroke="${th.fg}" stroke-width="1.5" opacity=".55"/>`; }
    const gx = x0 + 6 * S + S / 2, gy = y0 + 2 * S + S / 2;
    if (th.reg === 'party') s += Q.quasar(gx + 24, gy - 30, 120, th, { jet: 160 });
    else s += `<circle cx="${gx + 24}" cy="${gy - 30}" r="74" fill="${th.a}"/>`;
    s += `<rect x="${gx - S / 2 + 12}" y="${gy - S / 2 + 12}" width="${S - 24}" height="${S - 24}" fill="none" stroke="${th.fg}" stroke-width="2" stroke-dasharray="4 6"/>`;
    s += T(800, 960, 'NOT DESIGNED FOR', { f: 'd', s: 54, w: 700, fill: th.fg, anchor: 'middle', ls: 4 });
    return s + grain(th) + cap(th, '07', 'NDF');
  } });

  L.push({ k: 'signal', n: 'Light from far away', desc: 'A signal leaves the core long ago and arrives now.', draw: (th) => {
    let s = Q.quasar(260, 560, 150, th, { jet: 200, tilt: -90 });
    for (let i = 0; i < 9; i++) { const r = 280 + i * 130; s += `<path d="M${r2(260 + r * Math.cos(-0.5))} ${r2(560 + r * Math.sin(-0.5))}A${r} ${r} 0 0 1 ${r2(260 + r * Math.cos(0.5))} ${r2(560 + r * Math.sin(0.5))}" fill="none" stroke="${th.reg === 'party' ? cyc(th, i) : th.fg}" stroke-width="${3 - i * 0.22}" opacity="${r2(1 - i * 0.08)}"/>`; }
    s += Q.signal(1250, 470, 270, 180, th.reg === 'party' ? th.c : th.fg, 4, 18, 0.9);
    s += T(260, 860, 'EMITTED · LONG AGO', { f: 'm', s: 17, w: 600, ls: 2, fill: th.fg, anchor: 'middle' }) + T(1385, 700, 'RECEIVED · NOW', { f: 'm', s: 17, w: 600, ls: 2, fill: th.fg, anchor: 'middle' });
    return s + grain(th) + cap(th, '08', 'LIGHT FROM FAR AWAY');
  } });

  L.push({ k: 'dancefloor', n: 'The dancefloor as accretion disk', desc: 'Party scene: the crowd in orbit around the booth.', draw: (th) => {
    let s = ''; const cx = 800, cy = 640, rnd = Q.rng(9);
    s += Q.quasar(cx, cy, 120, th, { jet: 560, ratio: 0.3 });
    for (let i = 0; i < 520; i++) { const a = rnd() * Math.PI * 2, rr = 200 + Math.pow(rnd(), 0.7) * 560, x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.32, front = Math.sin(a) > 0; s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(front ? 5 + rnd() * 4 : 3 + rnd() * 3)}" fill="${th.reg === 'party' ? cyc(th, Math.floor(rnd() * 6)) : th.fg}" opacity="${r2(front ? 0.95 : 0.55)}"/>`; }
    if (th.reg === 'party') for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.2; s += `<path d="M${cx} ${cy - 40}L${r2(cx + Math.cos(a) * 1100)} ${r2(cy - 40 + Math.sin(a) * 1100)}" stroke="${cyc(th, i)}" stroke-width="3" opacity=".7"/>`; }
    return s + grain(th) + cap(th, '09', 'THE DANCEFLOOR AS ACCRETION DISK');
  } });

  L.push({ k: 'lasers', n: 'Jets over the crowd', desc: 'Party scene: light beams fanning over a horizon of heads.', draw: (th) => {
    let s = ''; const rnd = Q.rng(23), ox = 800, oy = 1000;
    for (let i = 0; i < 14; i++) { const a = -Math.PI + 0.25 + (i / 13) * (Math.PI - 0.5); s += `<path d="M${ox} ${oy}L${r2(ox + Math.cos(a) * 1500)} ${r2(oy + Math.sin(a) * 1500)}" stroke="${th.reg === 'party' ? cyc(th, i) : th.fg}" stroke-width="${th.reg === 'party' ? 4 : 1.2}" opacity="${th.reg === 'party' ? 0.75 : 0.6}"/>`; }
    if (th.reg === 'research') for (let i = 1; i < 5; i++) s += `<path d="M${ox - i * 110} ${oy}A${i * 110} ${i * 110} 0 0 1 ${ox + i * 110} ${oy}" fill="none" stroke="${th.a}" stroke-width="1.2" stroke-dasharray="3 6"/>`;
    s += Q.quasar(800, 300, 150, th, { jet: 220 });
    for (let i = 0; i < 70; i++) { const x = rnd() * 1640 - 20, r = 26 + rnd() * 18, y = 1060 + rnd() * 50; s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${th.reg === 'party' ? '#000' : th.bg}" stroke="${th.reg === 'party' ? '#222' : th.fg}" stroke-width="1.5"/><rect x="${r2(x - r * 1.3)}" y="${r2(y + r * 0.8)}" width="${r2(r * 2.6)}" height="200" rx="${r2(r)}" fill="${th.reg === 'party' ? '#000' : th.bg}" stroke="${th.reg === 'party' ? '#222' : th.fg}" stroke-width="1.5"/>`; }
    return s + grain(th) + cap(th, '10', 'JETS OVER THE CROWD');
  } });

  Q.ILLUS = L;
  Q.illus = (k, reg, mode, o = {}) => {
    const it = L.find((x) => x.k === k), th = Q.theme(reg, mode);
    return Q.doc(1600, 1200, it.draw(th), { bg: th.bg, transparent: o.transparent });
  };
})();
