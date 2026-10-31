/* § Foundations: logo, color, type, textures, iconography */
(function () {
  const logoItem = (type, mode, bg, ink, label, extra = {}) => {
    const L = Q.logo(type, { mode, ink, pad: true });
    return Object.assign({ id: `logo-${type}-${label}`, title: `${type[0].toUpperCase() + type.slice(1)} · ${label.replace(/-/g, ' ')}`, w: L.w * 4, h: L.h * 4, register: 'core', format: 'logo', section: 'foundations', dark: bg !== '#F4EAD8' && bg !== '#FFFFFF' && bg !== '#EFE7DA',
      svg: (o = {}) => Q.doc(L.w * 4, L.h * 4, `<g transform="scale(4)">${L.inner}</g>`, { bg, transparent: o.transparent }) }, extra);
  };
  const tex = [
    { k: 'orbit-lines', n: 'Orbit lines', reg: 'core', draw: (th, S) => Q.orbits(S / 2, S / 2, S * 0.08, S * 0.023, 14, S * 0.035, th.a, S / 900, 0.6, -12, `${S / 300} ${S / 120}`) },
    { k: 'grain', n: 'Grain', reg: 'core', draw: (th, S) => Q.grain(S, S, 0.32, 0.9, 3, 'normal') },
    { k: 'signal-noise', n: 'Signal noise', reg: 'research', draw: (th, S) => Q.signal(0, 0, S, S, th.fg, 12, 64, 0.75) },
    { k: 'orbit-pattern-small', n: 'Orbit pattern · small', reg: 'core', draw: (th, S) => { const p = Q.orbitPattern(S / 8, th.a, 0.8, S / 700); return `<defs>${p.defs}</defs><rect width="${S}" height="${S}" fill="url(#${p.id})"/>`; } },
    { k: 'orbit-pattern-large', n: 'Orbit pattern · large', reg: 'party', draw: (th, S) => { const p = Q.orbitPattern(S / 2.5, th.a, 1, S / 260); return `<defs>${p.defs}</defs><rect width="${S}" height="${S}" fill="url(#${p.id})"/>`; } },
    { k: 'research-grid', n: 'Research grid', reg: 'research', draw: (th, S) => { const g = Q.gridPattern(S / 40, th.fg + '22', 5); return `<defs>${g.defs}</defs><rect width="${S}" height="${S}" fill="url(#${g.id})"/>`; } },
    { k: 'halftone', n: 'Halftone field', reg: 'party', draw: (th, S) => { let s = ''; const n = 40, st = S / n; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const d = Math.hypot(x - n * 0.7, y - n * 0.3) / n; const r = Math.max(0, st * 0.42 * (1 - d * 1.3)); if (r > 0.3) s += `<circle cx="${Q.r2(x * st + st / 2)}" cy="${Q.r2(y * st + st / 2)}" r="${Q.r2(r)}" fill="${th.a}"/>`; } return s; } }
  ];
  const texItem = (t, mode) => { const th = Q.theme(t.reg, mode), S = 1024; return { id: `texture-${t.k}`, title: t.n, w: S, h: S, register: t.reg, format: 'texture', section: 'foundations', dark: th.dark, svg: (o = {}) => Q.doc(S, S, t.draw(th, S), { bg: th.bg, transparent: o.transparent }) }; };
  const iconSheet = (set, name, reg) => { const th = Q.theme(reg), n = set.length, W = 240 * n + 80, H = 360; return { id: `icons-${name}-${reg}`, title: `Icon sheet · ${name} · ${reg}`, w: W, h: H, register: reg, format: 'icon', section: 'foundations', dark: th.dark,
    svg: (o = {}) => Q.doc(W, H, set.map((k, i) => Q.iconG(k, 80 + i * 240, 70, 140, th.reg === 'party' ? [th.a, th.e, th.disk, th.c, th.d, th.b, '#fff'][i % 7] : th.fg, 1.5) + Q.text(150 + i * 240, 280, Q.ICONS[k].n.toUpperCase(), { f: 'm', s: 15, w: 600, ls: 1.6, fill: th.fg, anchor: 'middle' }) + Q.text(150 + i * 240, 305, Q.ICONS[k].k, { f: 'm', s: 13, w: 500, fill: th.mute, anchor: 'middle' })).join(''), { bg: th.bg, transparent: o.transparent }) }; };
  const texPresetItem = (p, i) => { const reg = p.reg || 'party', base = reg === 'research' ? Q.renderTpl('post-square', { eyebrow: 'FIG. 07 · Spatial design', title: 'The seventh dimension' }, 'research', 'light') : Q.renderTpl('post-square', {}, 'party', null); return { heavy: true, id: `texture-preset-${QX.slug(p.n)}`, title: p.n, w: 1080, h: 1080, register: reg, format: 'texture', section: 'foundations', dark: reg !== 'research', svg: () => base.replace(/<\/svg>$/, Q.texStack(p.layers, 1080, 1080) + '</svg>') }; };
  const lum = (h) => { const c = Q.hexToRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(1); };

  const LOGOS = () => [
    logoItem('primary', 'color', '#050307', null, 'color-void'), logoItem('horizontal', 'color', '#050307', null, 'color-void'), logoItem('stacked', 'color', '#050307', null, 'color-void'), logoItem('symbol', 'color', '#050307', null, 'color-void'),
    logoItem('primary', 'mono', '#050307', '#F4EAD8', 'mono-cream'), logoItem('primary', 'mono', '#F4EAD8', '#050307', 'mono-void'), logoItem('primary', 'color-light', '#F4EAD8', null, 'inverted-cream')
  ];

  QS.app('foundations', {
    title: 'Foundations', desc: 'Logo, color, type, textures and the 7D icon set.',
    lede: 'The parts everything else is built from. Every swatch, lockup, texture and icon on this page can be exported.',
    items: () => [...LOGOS(), ...tex.map((t) => texItem(t)), ...Q.texLibItems(), ...Q.texPresets().map(texPresetItem), iconSheet(Q.SEVEN, '7d', 'research'), iconSheet(Q.SEVEN, '7d', 'party'), iconSheet(Q.CONCEPTS, 'concepts', 'research'), iconSheet(Q.CONCEPTS, 'concepts', 'core')],
    render(el) {
      const L = LOGOS(), P = Q.PAL;
      const sw = (c, extra = '') => { const [r, g, b] = Q.hexToRgb(c.hex), k = Q.cmyk(c.hex); return `<div class="sw"><i style="background:${c.hex}"></i><div><b>${c.n}</b><code>${c.hex} · RGB ${r} ${g} ${b}</code><code>CMYK ${k.join(' ')}${c.pms ? ' · PMS ' + c.pms : ''}</code>${extra}<small>${c.role || ''}</small><button data-copy="${c.hex}">Copy hex</button></div></div>`; };
      const clear = (() => { const Lg = Q.logo('primary', { mode: 'color' }), X = 16, W = Lg.w + X * 4, H = Lg.h + X * 4; const box = (x, y) => `<rect x="${x}" y="${y}" width="${X}" height="${X}" fill="#A98BFF" opacity=".25" stroke="#A98BFF" stroke-width=".5"/>`; return Q.doc(W, H, `<rect x="${X}" y="${X}" width="${Lg.w + X * 2}" height="${Lg.h + X * 2}" fill="none" stroke="#A98BFF" stroke-dasharray="3 3" stroke-width=".7"/><g transform="translate(${X * 2} ${X * 2})">${Lg.inner}</g>${box(X, X)}${box(W - X * 2, H - X * 2)}${box(X * 2 + 24, X)}` + Q.text(X * 2 + 24 + X + 4, X + 11, 'X', { f: 'm', s: 9, w: 600, fill: '#A98BFF' }) + `<path d="M${X * 2 + 32} ${X * 2 + 19}v${X * 0.9}" stroke="#A98BFF" stroke-width=".6"/>`, { bg: '#050307' }); })();
      const mis = [
        ['Do not stretch or squash', (s) => `<g transform="translate(0 6) scale(1.35 .7)">${s}</g>`],
        ['Do not rotate', (s) => `<g transform="rotate(-14 110 32)">${s}</g>`],
        ['Do not recolor outside the palette', (s) => s.replace(/#FFB347/g, '#2FBF71').replace(/#A98BFF/g, '#E5383B')],
        ['Do not add shadows or effects', (s) => `<defs><filter id="msh"><feDropShadow dx="4" dy="4" stdDeviation="2" flood-color="#FF2E88"/></filter></defs><g filter="url(#msh)">${s}</g>`],
        ['Do not outline the wordmark', (s) => s.replace(/fill="#F4EAD8"/g, 'fill="none" stroke="#F4EAD8" stroke-width=".6"')],
        ['Do not rearrange the parts', (s) => s.replace('translate(0 0)', 'translate(176 0)').replace(/x="80"/, 'x="0"')],
        ['Do not place on busy grounds', (s) => { const p = Q.orbitPattern(26, '#FF7A1A', 1, 1.2); return `<defs>${p.defs}</defs><rect x="-20" y="-20" width="300" height="104" fill="url(#${p.id})"/>${s}`; }],
        ['Do not redraw the symbol', (s) => s.replace(/ry="5"/, 'ry="12"').replace(/r="4.8"/, 'r="9"')]
      ];
      const Lp = Q.logo('primary', { mode: 'color' });
      el.innerHTML = `
      <nav class="row" aria-label="On this page"><a class="btn sm ghost" href="#/foundations" data-jump="f-logo">Logo</a><a class="btn sm ghost" href="#/foundations" data-jump="f-color">Color</a><a class="btn sm ghost" href="#/foundations" data-jump="f-type">Type</a><a class="btn sm ghost" href="#/foundations" data-jump="f-tex">Textures</a><a class="btn sm ghost" href="#/foundations" data-jump="f-icons">Icons</a></nav>
      ${QS.section('Logo', 'Four lockups. Primary leads; horizontal adds the descriptor for banners and footers; stacked for square and vertical spaces; symbol alone for avatars, pins and favicons.', `<div class="grid" style="--min:280px">${L.slice(0, 4).map((i) => QS.card(i)).join('')}</div>`, { id: 'f-logo' })}
      ${QS.section('Monochrome and inverted', 'Use mono when only one ink is available (foil, embroidery, laser etch, fax-grade print). Inverted color sits on Cream.', `<div class="grid" style="--min:280px">${L.slice(4).map((i) => QS.card(i)).join('')}</div>`)}
      <div class="split blk"><div class="panel"><h3>Clear space</h3><p class="note" style="margin:6px 0 14px">X = the height of the accretion disk, one quarter of the symbol height. Keep X free on every side.</p><div style="background:#050307;border-radius:10px;padding:10px">${clear}</div></div>
        <div class="panel"><h3>Minimum sizes</h3><table class="tbl" style="margin-top:10px"><tr><th>Lockup</th><th>Digital</th><th>Print</th></tr><tr><td>Symbol</td><td>16 px</td><td>6 mm</td></tr><tr><td>Primary</td><td>120 px wide</td><td>30 mm wide</td></tr><tr><td>Horizontal</td><td>220 px wide</td><td>55 mm wide</td></tr><tr><td>Stacked</td><td>72 px wide</td><td>20 mm wide</td></tr><tr><td>Enamel pin</td><td>—</td><td>symbol ≥ 18 mm</td></tr></table>
        <div class="row" style="background:#050307;padding:12px;border-radius:10px;align-items:flex-end">${[['symbol', 16], ['primary', 120], ['stacked', 72]].map(([t, wd]) => { const g = Q.logo(t, { mode: 'color' }); return `<svg viewBox="0 0 ${g.w} ${g.h}" width="${wd}" height="${Q.r2(wd * g.h / g.w)}">${g.inner}</svg>`; }).join('')}</div></div></div>
      ${QS.section('Misuse', null, `<div class="dos">${mis.map(([t, f]) => `<figure><div class="p"><svg viewBox="-10 -10 ${Lp.w + 20} ${Lp.h + 20}">${f(Lp.inner)}</svg></div><figcaption><i>✕</i>${t}</figcaption></figure>`).join('')}</div>`)}
      ${QS.section('Animated logo reveal', 'Ignition, 4 seconds. Export it as MP4, WebM with alpha or a PNG sequence from Stings.', `<div class="player"><canvas id="fdCanvas" width="1280" height="720"></canvas><div class="bar"><b>Ignition<small>4.0 s · loops</small></b>${QS.seg('freg', [['core', 'Core'], ['research', 'Research'], ['party', 'Party']], 'core')}<a class="btn sm ghost" href="#/stings">Export in Stings</a></div></div>`)}

      ${QS.section('Color · core', 'Extracted from the mark: the void, the glow, the disk and the jets.', `<div class="grid" style="--min:170px">${P.core.map((c) => sw(c)).join('')}</div>`, { id: 'f-color', actions: '<div class="row" style="margin:0"><button class="btn sm ghost" data-dl="css">tokens.css</button><button class="btn sm ghost" data-dl="json">tokens.json</button></div>' })}
      ${QS.section('Tokens · light and dark', 'Interface and document tokens. The studio itself runs on these.', `<div class="wrap-x"><table class="tbl"><tr><th>Token</th><th>Light</th><th>Dark</th><th>Role</th></tr>${Q.TOKENS.map(([t, l, d, r]) => `<tr><td><code>${t}</code></td><td><span style="display:inline-flex;gap:8px;align-items:center"><i style="width:18px;height:18px;border-radius:5px;background:${l};border:1px solid var(--q-line)"></i><code>${l}</code></span></td><td><span style="display:inline-flex;gap:8px;align-items:center"><i style="width:18px;height:18px;border-radius:5px;background:${d};border:1px solid var(--q-line)"></i><code>${d}</code></span></td><td>${r}</td></tr>`).join('')}</table></div>`)}
      ${QS.section('Research sub-palette', 'Restrained. Paper, archive ink and one redline. Plate Blue only for data series.', `<div class="grid" style="--min:160px">${P.research.map((c) => sw(c)).join('')}</div>`)}
      ${QS.section('Party sub-palette', 'High energy on true black. Plasma, Flux, Ion, Laser and Flare have fluorescent Pantone equivalents that glow under UV and read under club lighting. Always print fluorescents as spot colors; CMYK cannot reproduce them.', `<div class="grid" style="--min:160px">${P.party.map((c) => sw(c)).join('')}</div>`)}
      ${QS.section('Semantic · task system', 'Four colors for the lab\'s task board and calendars. Never use them decoratively.', `<div class="grid" style="--min:200px">${P.semantic.map((c) => `<div class="sw"><i style="background:linear-gradient(90deg,${c.hex} 0 50%,${c.dark} 50%)"></i><div><b>${c.n}</b><code>Light ${c.hex} · Dark ${c.dark}</code><code>Tint ${c.tint} · ${c.tintDark}</code><div class="row" style="margin-top:8px"><span class="tag" style="background:${c.tint};color:${c.hex};border-color:transparent">${c.n}</span><span class="tag" style="background:${c.tintDark};color:${c.dark};border-color:transparent">${c.n}</span></div></div></div>`).join('')}</div>
        <p class="note" style="margin-top:12px">Blue = events · Orange = travel · Green = school · Red = applications.</p>`)}
      ${QS.section('Contrast check', null, `<div class="wrap-x"><table class="tbl"><tr><th>Pair</th><th>Ratio</th><th>Use</th></tr>${[['Cream on Void', '#F4EAD8', '#050307'], ['Gold on Void', '#FFB347', '#050307'], ['Archive on Paper', '#14111A', '#EFE7DA'], ['Redline on Paper', '#C4441A', '#EFE7DA'], ['Plasma on Blackout', '#FF2E88', '#000000'], ['Laser on Blackout', '#C8FF1F', '#000000'], ['UV on Blackout', '#7A3DFF', '#000000']].map(([n, a, b]) => { const r = ratio(a, b); return `<tr><td><span style="background:${b};color:${a};padding:3px 8px;border-radius:6px;font-weight:600">${n}</span></td><td><code>${r}:1</code></td><td>${r >= 7 ? 'Any text' : r >= 4.5 ? 'Body and up' : r >= 3 ? 'Large type, graphics' : 'Graphics only, never text'}</td></tr>`; }).join('')}</table></div>`)}

      ${QS.section('Type', 'Three open-license families (SIL OFL 1.1), bundled with the studio. Variable fonts: one file covers every weight.', `<div class="grid" style="--min:300px">${[
        ['Unbounded', 'Display', "'Unbounded'", 'Unbounded-Variable', 'OFL-Unbounded', 'Wide, round, built for headlines. Uppercase for party, sentence case for research titles. Weights 300 / 500 / 700 / 800.', 'Become the brightest light', 600],
        ['Space Grotesk', 'Text', "'Space Grotesk'", 'SpaceGrotesk-Variable', 'OFL-SpaceGrotesk', 'Body, quotes, captions, interface. Weights 400 / 500.', 'Stories and data on the same plane, so neither one erases the other.', 400],
        ['JetBrains Mono', 'Mono · data and labels', "'JetBrains Mono'", 'JetBrainsMono-Variable', 'OFL-JetBrainsMono', 'Figure numbers, dates, coordinates, labels, tickers. Uppercase with +0.12em tracking.', 'FIG. 07 — 51.0° N · DEC 8, 2026', 500]
      ].map(([n, role, ff, file, ofl, d, sample, wt]) => `<div class="panel" style="display:grid;gap:10px"><p class="kick" style="margin:0">${role}</p><h3 style="font-family:${ff};font-weight:${wt};font-size:1.5rem;letter-spacing:${ff.includes('Mono') ? '.04em' : '-.01em'}">${n}</h3><p style="font-family:${ff};font-weight:${wt};font-size:1.25rem;line-height:1.2">${sample}</p><p class="note">${d}</p><div class="row" style="margin:0"><a class="btn sm ghost" href="assets/fonts/${file}.ttf" download>.ttf</a><a class="btn sm ghost" href="assets/fonts/${file}-latin.woff2" download>.woff2</a><a class="btn sm ghost" href="assets/fonts/${ofl}.txt" download>License</a></div></div>`).join('')}</div>
        <div class="row"><button class="btn primary sm" id="fontZip">Download all fonts (ZIP)</button></div>`, { id: 'f-type' })}
      ${QS.section('Type scale', 'Digital sizes at 1080 px wide; print sizes for A-series posters.', `<div class="wrap-x"><table class="tbl"><tr><th>Style</th><th>Family</th><th>Digital</th><th>Print</th><th>Sample</th></tr>${[['Display XL', 'Unbounded 800, UPPER, −2%', '120–150', '96 pt+', 'd', 800, 30], ['Display', 'Unbounded 500, −1%', '78–96', '48 pt', 'd', 500, 24], ['Heading', 'Unbounded 500', '40–50', '24 pt', 'd', 500, 18], ['Body', 'Space Grotesk 400, 135%', '28–34', '10–12 pt', 't', 400, 15], ['Label', 'JetBrains Mono 500, UPPER, +12%', '16–24', '7–9 pt', 'm', 500, 11]].map(([n, f, dg, pr, fam, wt, px]) => `<tr><td>${n}</td><td>${f}</td><td><code>${dg} px</code></td><td><code>${pr}</code></td><td style="font-family:${fam === 'd' ? 'var(--d)' : fam === 't' ? 'var(--t)' : 'var(--m)'};font-weight:${wt};font-size:${px}px;${fam !== 't' ? 'text-transform:uppercase;' : ''}white-space:nowrap">Quasar</td></tr>`).join('')}</table></div>`)}

      ${QS.section('Textures and patterns', 'Exported as 1024 px seamless tiles. Orbit pattern repeats in two scales: small for stationery and fills, large for walls and backdrops.', `<div class="grid" style="--min:220px">${tex.map((t) => QS.card(texItem(t))).join('')}</div>`, { id: 'f-tex', actions: '<a class="btn sm ghost" href="#/lab">Test textures in the Lab</a>' })}
      ${QS.section('Texture library', 'Overlays to stack on any piece: noise, grain, screen lines, paper, print and film. Left half on Void, right half on Paper. Exported tiles are transparent.', `<div class="grid" style="--min:180px">${Q.texLibItems().map((i) => QS.card(i, { lazy: true })).join('')}</div>`)}
      ${QS.section('Texture presets', 'Approved stacks. Team-saved presets from the Lab appear here too.', `<div class="grid" style="--min:220px">${Q.texPresets().map((p, i) => QS.card(texPresetItem(p, i), { lazy: true })).join('')}</div>`)}

      ${QS.section('Iconography · the Seventh Dimension', '24 px grid, 1.5 stroke, round caps. One glyph per dimension plus the propinquital loop. Click to download SVG.', `<div class="icons">${Q.SEVEN.map((k) => `<button data-icon="${k}">${Q.icon(k, 40, 'var(--q-accent)')}<b>${Q.ICONS[k].n}</b><small>${Q.ICONS[k].k === '∞' ? 'Loop' : 'Dimension ' + Q.ICONS[k].k}</small><small style="text-transform:none;letter-spacing:0;font-family:var(--t);font-size:.74rem">${Q.ICONS[k].d}</small></button>`).join('')}</div>`, { id: 'f-icons', actions: '<button class="btn sm ghost" id="iconZip">Icon set ZIP</button>' })}
      ${QS.section('Iconography · concepts', null, `<div class="icons">${Q.CONCEPTS.map((k) => `<button data-icon="${k}">${Q.icon(k, 40, 'var(--q-accent-2)')}<b>${Q.ICONS[k].n}</b><small style="text-transform:none;letter-spacing:0;font-family:var(--t);font-size:.74rem">${Q.ICONS[k].d}</small></button>`).join('')}</div>
        <div class="grid" style="--min:320px;margin-top:16px">${[iconSheet(Q.SEVEN, '7d', 'research'), iconSheet(Q.SEVEN, '7d', 'party'), iconSheet(Q.CONCEPTS, 'concepts', 'core')].map((i) => QS.card(i)).join('')}</div>`)}`;

      let freg = 'core';
      const pl = Q.player(QS.$('#fdCanvas', el), Q.STINGS[0], () => ({ reg: freg }));
      QS.lazy(el);
      QS.cleanup = () => pl.stop();
      el.addEventListener('click', async (e) => {
        const s = e.target.closest('[data-seg="freg"] button'); if (s) freg = s.dataset.v;
        const j = e.target.closest('[data-jump]'); if (j) { e.preventDefault(); const t = document.getElementById(j.dataset.jump); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 20, behavior: 'smooth' }); }
        const c = e.target.closest('[data-copy]'); if (c) { navigator.clipboard && navigator.clipboard.writeText(c.dataset.copy); QS.toast('Copied ' + c.dataset.copy); }
        const ic = e.target.closest('[data-icon]'); if (ic) QX.download(new Blob([Q.icon(ic.dataset.icon, 24, '#14111A')], { type: 'image/svg+xml' }), QX.name('icon-' + ic.dataset.icon, 'svg', '24x24'));
        const dl = e.target.closest('[data-dl]');
        if (dl) {
          if (dl.dataset.dl === 'css') { const css = `/* Quasar Studio tokens · ${SITE.versao} */\n:root,[data-theme=light]{\n${Q.TOKENS.map((t) => `  ${t[0]}:${t[1]};`).join('\n')}\n}\n[data-theme=dark]{\n${Q.TOKENS.map((t) => `  ${t[0]}:${t[2]};`).join('\n')}\n}\n:root{\n${Q.PAL.core.map((c) => `  --q-${c.k}:${c.hex};`).join('\n')}\n${Q.PAL.research.map((c) => `  --q-research-${QX.slug(c.n)}:${c.hex};`).join('\n')}\n${Q.PAL.party.map((c) => `  --q-party-${QX.slug(c.n)}:${c.hex};`).join('\n')}\n${Q.PAL.semantic.map((c) => `  --q-task-${c.k}:${c.hex};\n  --q-task-${c.k}-dark:${c.dark};`).join('\n')}\n  --q-font-display:'Unbounded',sans-serif;\n  --q-font-text:'Space Grotesk',sans-serif;\n  --q-font-mono:'JetBrains Mono',monospace;\n}\n`; QX.download(new Blob([css], { type: 'text/css' }), 'quasar_tokens_css_v1.css'); }
          else QX.download(new Blob([JSON.stringify({ version: SITE.versao, tokens: Object.fromEntries(Q.TOKENS.map((t) => [t[0], { light: t[1], dark: t[2], role: t[3] }])), palettes: Q.PAL, fonts: { display: 'Unbounded', text: 'Space Grotesk', mono: 'JetBrains Mono' } }, null, 2)], { type: 'application/json' }), 'quasar_tokens_json_v1.json');
        }
        if (e.target.id === 'fontZip') {
          try { const fs = ['Unbounded-Variable.ttf', 'Unbounded-Variable-latin.woff2', 'SpaceGrotesk-Variable.ttf', 'SpaceGrotesk-Variable-latin.woff2', 'JetBrainsMono-Variable.ttf', 'JetBrainsMono-Variable-latin.woff2', 'OFL-Unbounded.txt', 'OFL-SpaceGrotesk.txt', 'OFL-JetBrainsMono.txt'];
            const files = await Promise.all(fs.map(async (n) => ({ name: 'quasar-fonts/' + n, data: await (await fetch('assets/fonts/' + n)).blob() }))); QX.download(await QX.zip(files), 'quasar_fonts_zip_ttf-woff2.zip');
          } catch (err) { QS.toast('ZIP needs the site served over http. Use the single-file links above.'); }
        }
        if (e.target.id === 'iconZip') {
          const files = []; for (const k of [...Q.SEVEN, ...Q.CONCEPTS]) { const svg = Q.icon(k, 24, '#14111A'); files.push({ name: `svg/${QX.name('icon-' + k, 'svg', '24x24')}`, data: svg }); const r = await QX.raster(svg, 24, 24, 512 / 24, 'png'); files.push({ name: `png/${QX.name('icon-' + k, 'png-alpha', '512x512', 'png')}`, data: r.blob }); }
          QX.download(await QX.zip(files), 'quasar_icons_zip_svg-png.zip');
        }
      });
    }
  });
})();
