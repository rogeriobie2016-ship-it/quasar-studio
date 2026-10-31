/* § Panels: booth banners and large-format signage. 1 unit = 1 mm. */
(function () {
  const T = Q.text;
  let guides = true;
  const withGuides = (svg, W, H, b, safe, extra = '') => {
    const s = QX.expand(svg, W, H, b);
    const ov = `<path d="M${-b} ${-b}H${W + b}V${H + b}H${-b}Z M0 0V${H}H${W}V0Z" fill="#E5383B" fill-opacity=".35" fill-rule="evenodd"/><rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#E5383B" stroke-width="${Math.max(1, W / 600)}"/><rect x="${safe}" y="${safe}" width="${W - safe * 2}" height="${H - safe * 2}" fill="none" stroke="#00C2FF" stroke-width="${Math.max(1, W / 600)}" stroke-dasharray="${W / 80} ${W / 120}"/>${extra}`;
    return s.replace(/<\/svg>$/, ov + '</svg>');
  };
  const P = [
    { k: 'rollup', n: 'Roll-up banner', W: 850, H: 2000, bleed: 5, safe: 30, regs: ['research', 'party'], extra: (W, H) => `<rect x="0" y="${H - 150}" width="${W}" height="150" fill="#000" opacity=".35"/>` + T(W / 2, H - 70, 'HIDDEN IN STAND BASE · 150 mm', { f: 'm', s: 18, w: 600, fill: '#fff', anchor: 'middle', ls: 2 }),
      draw: (th, W, H) => th.reg === 'research'
        ? (() => { const g = Q.gridPattern(17, th.grid, 5); return `<defs>${g.defs}</defs><rect width="${W}" height="${H}" fill="url(#${g.id})"/>` + Q.place('horizontal', 60, 70, 730, 80, { mode: 'mono', ink: th.fg }) + `<path d="M60 190H790" stroke="${th.fg}" stroke-width="2"/>` + T(60, 300, Q.wrap('Research and design for the people systems were not designed for.', 62, 730, 'd', 500), { f: 'd', s: 62, w: 500, fill: th.fg, lh: 1.08 }) + Q.quasar(425, 1150, 250, th, { labels: true, jet: 300, sw: 2 }) + T(60, 1620, ['HIIPE · QUASAR PHYSICS · DATA BLACK HOLES', 'NDF · DROID · THE SEVENTH DIMENSION'], { f: 'm', s: 20, w: 600, ls: 2, fill: th.a, lh: 1.7 }) + `<rect x="630" y="1580" width="160" height="160" fill="none" stroke="${th.fg}" stroke-width="2" stroke-dasharray="6 6"/>` + T(710, 1666, 'QR', { f: 'm', s: 26, w: 700, fill: th.mute, anchor: 'middle' }) + T(60, 1790, 'EST. MIT 2018 · USC MEDIA ARTS + PRACTICE', { f: 'm', s: 18, w: 500, ls: 2, fill: th.mute }); })()
        : Q.quasar(560, 700, 620, th, { tilt: -12, jet: 1400 }) + T(60, 150, 'UNITEDXR EUROPE · BRUSSELS', { f: 'm', s: 26, w: 700, ls: 4, fill: th.c }) + T(56, 1300, ['REALITY', 'HACK', 'AFTER', 'PARTY'], { f: 'd', s: 128, w: 800, fill: th.fg, lh: 0.95, ls: -3 }) + T(60, 1790, 'DEC 2026 · LAVALLÉE', { f: 'm', s: 34, w: 800, ls: 3, fill: th.a }) + Q.place('primary', 60, 1680, 520, 56, { mode: 'party' }) + Q.grain(W, H, 0.2) },
    { k: 'backwall', n: 'Booth back wall', W: 3000, H: 2400, bleed: 20, safe: 80, regs: ['research', 'party'], extra: (W, H) => `<rect x="0" y="${H - 900}" width="${W}" height="900" fill="#00C2FF" opacity=".08"/>` + T(100, H - 860, 'TABLE + PEOPLE OCCLUDE BELOW ~900 mm', { f: 'm', s: 40, w: 600, fill: '#00C2FF', ls: 3 }),
      draw: (th, W, H) => th.reg === 'research'
        ? (() => { const g = Q.gridPattern(40, th.grid, 5), hl = Q.wrap('Become the brightest light.', 200, 1250, 'd', 500); return `<defs>${g.defs}</defs><rect width="${W}" height="${H}" fill="url(#${g.id})"/>` + Q.place('horizontal', 140, 140, 1500, 150, { mode: 'mono', ink: th.fg }) + T(140, 640, hl, { f: 'd', s: 200, w: 500, fill: th.fg, lh: 1.02, ls: -4 }) + T(140, 640 + hl.length * 204 + 40, Q.wrap('A research and design lab merging film, music, data, AR/VR and critical pedagogy for long-term social change, especially with youth.', 46, 1200, 't'), { f: 't', s: 46, fill: th.mute, lh: 1.35 }) + `<g transform="translate(1460 160) scale(.95)">${Q.ILLUS.find((x) => x.k === 'seven').draw(th).replace(/FIG\. 02[^<]*/, '')}</g>`; })()
        : Q.quasar(2100, 900, 1300, th, { tilt: -10, jet: 2600 }) + Q.place('primary', 160, 160, 1100, 120, { mode: 'party' }) + T(150, 700, ['BECOME', 'THE', 'LIGHT'], { f: 'd', s: 280, w: 800, fill: th.fg, lh: 0.95, ls: -8 }) + T(160, 1400, 'UNITEDXR EUROPE · BRUSSELS · DEC 2026', { f: 'm', s: 60, w: 700, ls: 8, fill: th.c }) + Q.grain(W, H, 0.2) },
    { k: 'hanging', n: 'Hanging banner', W: 2000, H: 1000, bleed: 20, safe: 60, regs: ['party', 'core'],
      draw: (th, W, H) => (th.reg === 'party' ? Q.quasar(1600, 300, 600, th, { jet: 900, tilt: -14 }) + Q.grain(W, H, 0.2) : Q.orbits(1000, 500, 300, 80, 9, 110, th.a, 2, 0.5, -6, '4 14')) + Q.place('primary', 160, 360, 1680, 280, { mode: th.reg === 'party' ? 'party' : 'color', align: 'center', valign: 'middle' }) + T(W / 2, 820, th.reg === 'party' ? 'AFTERPARTY →' : 'RESEARCH + DESIGN LAB', { f: 'm', s: 54, w: 700, ls: 8, fill: th.reg === 'party' ? th.c : th.a, anchor: 'middle' }) },
    { k: 'table', n: 'Table front', W: 1800, H: 750, bleed: 10, safe: 40, regs: ['core', 'research'],
      draw: (th, W, H) => Q.place('horizontal', 150, 240, 1500, 180, { mode: th.reg === 'research' ? 'mono' : 'color', ink: th.fg, align: 'center', valign: 'middle' }) + `<path d="M150 520H1650" stroke="${th.fg}" stroke-width="2" opacity=".4"/>` + T(W / 2, 600, 'HIIPE · QUASAR PHYSICS · DATA BLACK HOLES · NDF · DROID · 7D', { f: 'm', s: 32, w: 600, ls: 4, fill: th.a, anchor: 'middle' }) }
  ];
  const item = (p, reg) => { const th = Q.theme(reg); return { id: `${p.k}-${reg}`, title: `${p.n} · ${reg}`, w: p.W, h: p.H, register: reg, format: 'signage', section: 'panels', print: { mm: [p.W, p.H], bleed: p.bleed }, dark: th.dark,
    svg: (o = {}) => { const s = Q.doc(p.W, p.H, p.draw(th, p.W, p.H), { bg: th.bg }); return o.preview && guides ? withGuides(s, p.W, p.H, p.bleed, p.safe, p.extra ? p.extra(p.W, p.H) : '') : s; } }; };
  QS.app('panels', {
    title: 'Panels', desc: 'Booth banners and large-format signage with bleed and safe area.',
    lede: 'Large format for the UnitedXR booth and the party. Previews show bleed (red) and safe area (blue dashed); exports never include the guides. Confirm final sizes with the organizer and the printer before ordering.',
    items: () => P.flatMap((p) => p.regs.map((r) => item(p, r))),
    render(el) {
      const draw = () => { QS.$('#pnl', el).innerHTML = P.map((p) => `<h3 class="kick" style="margin:26px 0 12px">${p.n} · ${p.W} × ${p.H} mm · bleed ${p.bleed} · safe ${p.safe}</h3><div class="grid" style="--min:${p.H > p.W ? 240 : 360}px">${p.regs.map((r) => QS.card(item(p, r))).join('')}</div>`).join(''); };
      el.innerHTML = `<div class="row">${QS.seg('guides', [['1', 'Show guides'], ['0', 'Hide guides']], '1')}</div><div id="pnl"></div>
        ${QS.section('Print checklist', null, `<div class="panel spec" style="font-size:.8rem;gap:8px"><span>· Export PDF with the listed bleed and crop marks on. For vector output send SVG plus the font files from Foundations.</span><span>· Large-format PDFs are capped near 9000 px on the long side: right for viewing distance, but ask the printer if they need more.</span><span>· Party pieces: ask whether fluorescent inks are available on their large-format press; otherwise print CMYK and expect duller neons.</span><span>· The QR box is a placeholder. Generate the code with the final URL and place it at least 25 mm square.</span></div>`)}`;
      draw();
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-seg="guides"] button'); if (b) { guides = b.dataset.v === '1'; draw(); } });
    }
  });
})();
