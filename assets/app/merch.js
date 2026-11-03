/* § Merch: enamel pins, round stickers, wristbands, tote, lanyard, poster, photo backdrop */
(function () {
  const T = Q.text, r2 = Q.r2, P = Q.theme('party');
  const METAL = { gold: ['#C9A04A', 'Gold plating'], nickel: ['#2B2A30', 'Black nickel'], silver: ['#B9BCC2', 'Silver plating'] };
  const PMS = { '#FFC21A': '803 C', '#FF6A00': '804 C', '#FF2E88': '806 C', '#7A3DFF': '2665 C', '#00E5FF': '801 C', '#C8FF1F': '802 C', '#F4EAD8': '7527 C', '#050307': 'Black 6 C', '#C4441A': '173 C' };
  /* pin art in a 300×300 field (10 units = 1 mm on a 30 mm pin); m = metal line width */
  const PINS = [
    { k: 'mark', n: 'The mark', mm: 30, colors: ['#FFC21A', '#FF6A00', '#050307', '#7A3DFF'], art: (mt) => `<ellipse cx="150" cy="150" rx="120" ry="120" fill="#FF6A00" stroke="${mt}" stroke-width="7"/><ellipse cx="150" cy="150" rx="72" ry="72" fill="#FFC21A" stroke="${mt}" stroke-width="4"/><rect x="141" y="8" width="18" height="70" rx="9" fill="#7A3DFF" stroke="${mt}" stroke-width="5"/><rect x="141" y="222" width="18" height="70" rx="9" fill="#7A3DFF" stroke="${mt}" stroke-width="5"/><ellipse cx="150" cy="150" rx="146" ry="42" fill="none" stroke="${mt}" stroke-width="20"/><circle cx="150" cy="150" r="38" fill="#050307" stroke="${mt}" stroke-width="7"/>` },
    { k: '7d', n: '7D orbit', mm: 30, colors: ['#050307', '#00E5FF', '#FF2E88'], art: (mt) => `<circle cx="150" cy="150" r="136" fill="#050307" stroke="${mt}" stroke-width="8"/><ellipse cx="150" cy="150" rx="128" ry="40" fill="none" stroke="#00E5FF" stroke-width="14" transform="rotate(-18 150 150)"/>` + T(150, 186, '7D', { f: 'd', s: 104, w: 800, fill: '#FF2E88', anchor: 'middle', style: `paint-order:stroke;stroke:${mt};stroke-width:6px` }) },
    { k: 'afterparty-26', n: 'Afterparty BRU 26', mm: 35, colors: ['#000000', '#C8FF1F', '#FFC21A'], art: (mt) => `<ellipse cx="150" cy="150" rx="146" ry="86" fill="#000" stroke="${mt}" stroke-width="8"/><ellipse cx="150" cy="150" rx="118" ry="60" fill="none" stroke="#FFC21A" stroke-width="8"/>` + T(150, 140, 'AFTERPARTY', { f: 'd', s: 30, w: 800, fill: '#C8FF1F', anchor: 'middle' }) + T(150, 182, 'BRU · 26', { f: 'm', s: 26, w: 800, fill: mt, anchor: 'middle', ls: 3 }) }
  ];
  const pinArt = (p, metal) => ({ id: `pin-${p.k}-${metal}-art`, title: `Pin · ${p.n} · art`, w: 300, h: 300, register: 'party', format: 'merch', section: 'merch', transparent: true, svg: () => Q.doc(300, 300, p.art(METAL[metal][0])) });
  const pinSpec = (p, metal) => {
    const W = 1600, H = 1000, mt = METAL[metal];
    return { id: `pin-${p.k}-${metal}-spec`, title: `Pin · ${p.n} · spec sheet`, w: W, h: H, register: 'party', format: 'merch', section: 'merch', dark: false,
      svg: () => Q.doc(W, H, `<rect x="60" y="60" width="760" height="760" rx="20" fill="#F2F0EC"/><g transform="translate(140 140) scale(2)">${p.art(mt[0])}</g>` +
        `<path d="M140 880H740" stroke="#14111A" stroke-width="2"/><path d="M140 868v24M740 868v24" stroke="#14111A" stroke-width="2"/>` + T(440, 930, `${p.mm} mm`, { f: 'm', s: 26, w: 600, fill: '#14111A', anchor: 'middle' }) +
        T(900, 120, 'ENAMEL PIN · SPEC', { f: 'm', s: 22, w: 600, ls: 3, fill: '#C4441A' }) + T(900, 190, p.n.toUpperCase(), { f: 'd', s: 52, w: 700, fill: '#14111A' }) +
        [['Size', `${p.mm} mm (longest side)`], ['Type', 'Hard enamel, polished'], ['Metal', `${mt[1]} · raised lines ≥ 0.3 mm`], ['Colors', p.colors.map((c) => `PMS ${PMS[c] || c}`).join(' · ')], ['Back', '2 posts, rubber clutches'], ['Backstamp', 'THE QUASAR LAB · 2026'], ['Packaging', 'Backing card, see poster artwork'], ['Quantity', 'TBD (confirm)']].map(([k, v], i) => T(900, 290 + i * 70, k.toUpperCase(), { f: 'm', s: 18, w: 600, ls: 2, fill: '#857985' }) + T(900, 318 + i * 70, v, { f: 't', s: 24, w: 500, fill: '#14111A' })).join('') +
        p.colors.map((c, i) => `<rect x="${900 + i * 90}" y="870" width="70" height="70" rx="35" fill="${c}" stroke="#14111A" stroke-width="1"/>`).join(''), { bg: '#FFFFFF' }) };
  };
  const wrist = (v) => {
    const W = 2500, H = 250, th = v === 'crew' ? { bg: '#000', fg: P.a, ink: '#F4EAD8' } : v === 'research' ? { bg: '#EFE7DA', fg: '#C4441A', ink: '#14111A' } : { bg: P.c, fg: '#000', ink: '#000' };
    const label = v === 'crew' ? 'CREW · ALL ACCESS' : v === 'research' ? 'LAB GUEST · UNITEDXR EUROPE · BRUSSELS' : 'REALITY HACK AFTERPARTY · LAVALLÉE · 12.2026';
    return { id: `wristband-${v}`, title: `Wristband · ${v}`, w: W, h: H, register: v === 'research' ? 'research' : 'party', format: 'merch', section: 'merch', print: { mm: [250, 25], bleed: 2 }, dark: v === 'crew',
      svg: (o = {}) => { let s = `<rect x="0" y="0" width="250" height="${H}" fill="${th.ink}" opacity=".08"/>` + T(125, 140, 'TAB', { f: 'm', s: 26, w: 700, fill: th.ink, anchor: 'middle', ls: 4, op: o.preview ? 0.5 : 0 }); for (let x = 290, i = 0; x < W - 100; i++) { s += Q.mark(x, 65, 120, v === 'research' ? { mode: 'mono', ink: th.ink } : v === 'crew' ? { mode: 'party' } : { mode: 'mono', ink: '#000' }); x += 150; const tw = Q.tw(label, 44, 'd', 800, 2); if (x + tw > W - 40) break; s += T(x, 142, label, { f: 'd', s: 44, w: 800, fill: th.fg, ls: 2 }); x += tw + 50; } return Q.doc(W, H, s, { bg: th.bg }); } };
  };
  /* Crossed line for one-ink pieces. The mask knocks the X out of NOT, so the gap stays free of ink on a transparent export. */
  const crossedLine = (W, H, c) => {
    const id = Q.uid('x'), X = 'M1000 1872Q1400 2010 1806 2172M1800 1862Q1420 1990 1012 2192', stroke = 'fill="none" stroke-linecap="round"';
    return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><path d="${X}" ${stroke} stroke="#000" stroke-width="58"/></mask>` +
      `<g mask="url(#${id})">${T(1400, 2110, 'NOT', { f: 'd', s: 300, w: 800, fill: c, anchor: 'middle', ls: 14 })}</g><path d="${X}" ${stroke} stroke="${c}" stroke-width="26"/>` +
      T(1400, 2410, 'DESIGNED FOR', { f: 'd', s: 190, w: 800, fill: c, anchor: 'middle', ls: 14 });
  };
  const tote = (ink) => {
    const W = 2800, H = 3000, c = ink === 'cream' ? '#F4EAD8' : '#050307', bag = ink === 'cream' ? '#14111A' : '#E9DFC9';
    return { id: `tote-${ink}-ink`, title: `Tote · 1-color ${ink}`, w: W, h: H, register: 'research', format: 'merch', section: 'merch', print: { mm: [280, 300], bleed: 0 }, dark: ink === 'cream',
      svg: (o = {}) => Q.doc(W, H, Q.orbits(1400, 1250, 300, 90, 8, 120, c, 6, 1, -10, '18 24') + Q.quasar(1400, 1250, 380, { reg: 'research', fg: c, a: c, bg: o.transparent ? 'none' : bag, line: c }, { jet: 520, sw: 8, tilt: -10 }) +
        crossedLine(W, H, c) + Q.place('primary', 700, 2560, 1400, 200, { mode: 'mono', ink: c, align: 'center' }), { bg: bag, transparent: o.transparent }) };
  };
  const lanyard = () => { const W = 9000, H = 200; return { id: 'lanyard', title: 'Lanyard · 20 × 900 mm', w: W, h: H, register: 'party', format: 'merch', section: 'merch', print: { mm: [900, 20], bleed: 2 }, svg: () => { let s = ''; for (let x = 60; x < W - 600; x += 1140) s += Q.place('primary', x, 50, 1000, 100, { mode: 'party', valign: 'middle' }); return Q.doc(W, H, s, { bg: '#000' }); } }; };
  const poster = (reg) => {
    const W = 4200, H = 5940, th = Q.theme(reg);
    return { id: `poster-a2-${reg}`, title: `Poster A2 · ${reg}`, w: W, h: H, register: reg, format: 'merch', section: 'merch', print: { mm: [420, 594], bleed: 3 }, dark: th.dark,
      svg: () => Q.doc(W, H, reg === 'party'
        ? Q.quasar(2600, 1900, 2000, th, { tilt: -14, jet: 4200 }) + T(260, 420, 'UNITEDXR EUROPE · BRUSSELS', { f: 'm', s: 110, w: 700, ls: 14, fill: th.c }) + T(250, 3900, ['REALITY', 'HACK', 'AFTER', 'PARTY'], { f: 'd', s: 560, w: 800, fill: th.fg, lh: 0.94, ls: -12 }) + T(260, 5560, 'DEC 2026 · LAVALLÉE', { f: 'm', s: 140, w: 800, ls: 8, fill: th.a }) + Q.place('primary', 2400, 5440, 1550, 160, { mode: 'party', align: 'right' }) + Q.grain(W, H, 0.22)
        : `<g transform="translate(300 700) scale(2.25)">${Q.ILLUS.find((x) => x.k === 'seven').draw(th).replace(/FIG\. 02[^<]*/, '')}</g>` + T(300, 520, 'THE SEVENTH DIMENSION', { f: 'd', s: 230, w: 500, fill: th.fg, ls: -4 }) + T(300, 4100, ['Spatial design in seven layers: flat, space, time, mechanics,', 'arrival and paratext, affect, and the propinquital loop that', 'returns what we feel to where we began.'], { f: 't', s: 110, fill: th.mute, lh: 1.35 }) + Q.place('horizontal', 300, 5400, 2600, 230, { mode: 'mono', ink: th.fg }) + Q.regMarks(W, H, 120, th.fg, 90), { bg: th.bg }) };
  };
  const backdrop = (slots) => {
    const W = 3000, H = 2400;
    return { id: `photo-backdrop${slots ? '-partners' : ''}`, title: `Photo backdrop · step & repeat${slots ? ' + partner slots' : ''}`, w: W, h: H, register: 'party', format: 'signage', section: 'merch', print: { mm: [3000, 2400], bleed: 50 },
      svg: (o = {}) => { let s = ''; const cw = 500, ch = 300; for (let r = 0; r < 9; r++) for (let c = -1; c < 7; c++) { const x = c * cw + (r % 2 ? cw / 2 : 0), y = r * ch - 60, k = (r + c + 20) % 3; s += k === 0 ? Q.place('stacked', x + 170, y + 30, 160, 240, { mode: 'party', align: 'center' }) : k === 1 || !slots ? T(x + cw / 2, y + 160, k === 1 ? 'AFTERPARTY' : 'REALITY HACK', { f: 'd', s: 44, w: 800, fill: k === 1 ? P.a : P.c, anchor: 'middle' }) : (o.export && o.hideSlots ? '' : `<rect x="${x + 110}" y="${y + 90}" width="280" height="120" fill="none" stroke="#F4EAD8" stroke-dasharray="10 10" stroke-width="3" opacity=".5"/>` + T(x + cw / 2, y + 160, 'PARTNER', { f: 'm', s: 24, w: 600, fill: '#F4EAD8', anchor: 'middle', ls: 4, op: 0.5 })); }
        return Q.doc(W, H, s + (o.preview ? `<rect x="0" y="1400" width="${W}" height="1000" fill="#C8FF1F" opacity=".06"/>` + T(40, 1440, 'PHOTO ZONE (people stand here, 1.4–2.4 m)', { f: 'm', s: 30, w: 600, fill: '#C8FF1F', ls: 2 }) : ''), { bg: '#000' }); } };
  };
  const all = () => [...PINS.flatMap((p) => [pinArt(p, 'gold'), pinSpec(p, 'gold')]), ...['symbol', 'afterparty-bru', 'event-horizon', 'dbh'].map((k) => Q.roundItem(Q.STICKERS.find((s) => s.k === k))), wrist('party'), wrist('crew'), wrist('research'), tote('void'), tote('cream'), lanyard(), poster('party'), poster('research'), backdrop(false), backdrop(true)];

  QS.app('merch', {
    title: 'Merch', desc: 'Enamel pins with print specs, stickers, wristbands, tote, lanyard, posters and the party photo backdrop.',
    lede: 'Souvenirs people keep. Every piece carries its production spec: colors, metal, size, bleed.',
    items: all,
    render(el) {
      let metal = 'gold';
      const pins = () => { QS.$('#pins', el).innerHTML = PINS.map((p) => QS.card(pinArt(p, metal))).join('') + PINS.map((p) => QS.card(pinSpec(p, metal))).join(''); };
      el.innerHTML = `${QS.section('Enamel pins', 'Hard enamel. Raised metal lines separate every color; keep lines at least 0.3 mm and enamel areas at least 1 mm wide.', `<div class="row" style="margin:0 0 14px">${QS.seg('metal', Object.entries(METAL).map(([k, v]) => [k, v[1]]), metal)}</div><div class="grid" id="pins" style="--min:220px"></div>`)}
        ${QS.section('Round stickers · 60 mm', 'Circle cut. The pink dashed line is the trim; artwork bleeds 2 mm. Die-cut versions live in <a href="#/stickers">Stickers</a>.', `<div class="grid" style="--min:180px">${['symbol', 'afterparty-bru', 'event-horizon', 'dbh'].map((k) => QS.card(Q.roundItem(Q.STICKERS.find((s) => s.k === k)))).join('')}</div>`)}
        ${QS.section('Wristbands', 'Tyvek 250 × 25 mm with adhesive tab on the left (keep it empty). Party band in fluorescent PMS 802.', `<div class="grid" style="--min:100%">${['party', 'crew', 'research'].map((v) => QS.card(wrist(v))).join('')}</div>`)}
        ${QS.section('Tote and lanyard', 'Tote: one-color screenprint, 280 × 300 mm print area, export the art with transparent background. Lanyard: 20 mm woven or dye-sub.', `<div class="grid" style="--min:260px">${QS.card(tote('void'))}${QS.card(tote('cream'))}</div><div class="grid" style="--min:100%;margin-top:16px">${QS.card(lanyard())}</div>`)}
        ${QS.section('Posters', 'A2 with 3 mm bleed. Party for the afterparty, research for the booth and the lab.', `<div class="grid" style="--min:260px">${QS.card(poster('party'))}${QS.card(poster('research'))}</div>`)}
        ${QS.section('Photo backdrop', 'Step and repeat, 3 × 2.4 m with 50 mm bleed. The lower band is where people stand: logos repeat often enough to land in every photo.', `<div class="grid" style="--min:320px">${QS.card(backdrop(false))}${QS.card(backdrop(true))}</div>`)}`;
      pins();
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-seg="metal"] button'); if (b) { metal = b.dataset.v; pins(); } });
    }
  });
})();
