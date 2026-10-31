/* § Lab: test textures, logo variants and type pairings; shortlist what works. */
(function () {
  const SL_KEY = 'quasar.lab.shortlist', PR_KEY = 'quasar.tex.presets';
  const ld = (k, d) => JSON.parse(localStorage.getItem(k) || 'null') || d;
  const sv = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  let fontsReady = null;
  const loadFonts = () => fontsReady || (fontsReady = new Promise((res) => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'assets/fonts/fonts-lab.css';
    const s = document.createElement('script'); s.src = 'assets/fonts/fonts-lab-embed.js';
    const p1 = new Promise((r) => { l.onload = r; l.onerror = r; }), p2 = new Promise((r) => { s.onload = r; s.onerror = r; });
    document.head.appendChild(l); document.head.appendChild(s);
    Promise.all([p1, p2]).then(async () => { try { await Promise.all((window.QFONTLAB || []).flatMap((f) => f.faces.map((x) => document.fonts.load(`${String(x.w).split(/\s+/)[0]} 20px "${f.family}"`)))); await document.fonts.ready; } catch (e) {} res(); });
  }));
  const FONTS = (role) => [...({ display: ['Unbounded'], text: ['Space Grotesk'], mono: ['JetBrains Mono'] }[role]), ...(window.QFONTLAB || []).filter((f) => f.role === role).map((f) => f.family)];
  const opt = (list, v) => list.map((x) => { const [val, lab] = Array.isArray(x) ? x : [x, x]; return `<option value="${val}" ${String(val) === String(v) ? 'selected' : ''}>${lab}</option>`; }).join('');
  const T = Q.text, r2 = Q.r2;

  /* ---------- textures ---------- */
  const BASES = [['party-post', 'Party post'], ['research-post', 'Research post'], ['void', 'Void'], ['black', 'Black'], ['paper', 'Paper'], ['cream', 'Cream'], ['logo', 'Logo on void']];
  const baseSVG = (b) => {
    if (b === 'party-post') return Q.renderTpl('post-square', {}, 'party', null);
    if (b === 'research-post') return Q.renderTpl('post-square', { eyebrow: 'FIG. 07 · Spatial design', title: 'The seventh dimension' }, 'research', 'light');
    if (b === 'logo') return Q.doc(1080, 1080, Q.place('stacked', 240, 240, 600, 600, { mode: 'color', align: 'center', valign: 'middle' }), { bg: '#050307' });
    return Q.doc(1080, 1080, '', { bg: { void: '#050307', black: '#000000', paper: '#EFE7DA', cream: '#F4EAD8' }[b] });
  };
  const INKS = ['#FFFFFF', '#F4EAD8', '#000000', '#14111A', '#FFB347', '#FF2E88', '#C4441A', '#34509E'];
  const tex = { base: 'party-post', layers: [{ k: 'grain-fine', i: 0.35, s: 1, b: 'overlay', c: '#FFFFFF', seed: 3 }] };
  const texItem = (name) => ({ id: `texture-test-${QX.slug(name || 'composite')}`, title: name || 'Texture test', w: 1080, h: 1080, register: tex.base.startsWith('research') || tex.base === 'paper' || tex.base === 'cream' ? 'research' : 'party', format: 'texture', section: 'lab', vector: true,
    svg: () => baseSVG(tex.base).replace(/<\/svg>$/, Q.texStack(tex.layers, 1080, 1080) + '</svg>') });
  const tileItem = (layers, name) => ({ id: `texture-${QX.slug(name)}-tile`, title: `${name} · tile`, w: 2048, h: 2048, register: 'core', format: 'texture', section: 'lab', transparent: true, svg: () => Q.doc(2048, 2048, Q.texStack(layers.map((l) => Object.assign({}, l, { b: 'normal' })), 2048, 2048)) });
  const libItem = (t) => ({ heavy: true, id: `texture-${t.k}`, title: t.n, w: 1024, h: 1024, register: 'core', format: 'texture', section: 'foundations', transparent: true,
    svg: (o = {}) => o.preview ? Q.doc(1024, 1024, `<rect width="512" height="1024" fill="#050307"/><rect x="512" width="512" height="1024" fill="#EFE7DA"/><g>${Q.texLayer({ k: t.k, i: 0.6, s: 1, c: '#FFFFFF' }, 512, 1024)}</g><g transform="translate(512 0)"><clipPath id="cl${t.k}"><rect width="512" height="1024"/></clipPath><g clip-path="url(#cl${t.k})">${Q.texLayer({ k: t.k, i: 0.6, s: 1, c: '#14111A' }, 512, 1024)}</g></g>`) : Q.doc(1024, 1024, Q.texLayer({ k: t.k, i: 0.6, s: 1, c: '#FFFFFF' }, 1024, 1024)) });
  Q.texLibItems = () => Q.TEX.map(libItem);

  const texUI = (el) => {
    const layerRow = (L, i) => `<div class="panel fgrid" style="padding:12px;gap:8px" data-li="${i}">
      <div style="display:flex;gap:6px;align-items:center"><label class="field" style="flex:1"><span>Layer ${i + 1}</span><select data-lk="k">${[...new Set(Q.TEX.map((t) => t.cat))].map((c) => `<optgroup label="${c}">${opt(Q.TEX.filter((t) => t.cat === c).map((t) => [t.k, t.n]), L.k)}</optgroup>`).join('')}</select></label><button class="btn sm ghost" data-lseed title="New random seed">↻</button><button class="btn sm ghost" data-ldel aria-label="Remove layer">×</button></div>
      <label class="field"><span>Intensity ${Math.round(L.i * 100)}</span><input type="range" min="0" max="1" step="0.01" value="${L.i}" data-lk="i"></label>
      <label class="field"><span>Scale ${L.s.toFixed(2)}×</span><input type="range" min="0.25" max="4" step="0.05" value="${L.s}" data-lk="s"></label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:end"><label class="field" style="flex:1;min-width:120px"><span>Blend</span><select data-lk="b">${opt(Q.BLENDS, L.b || 'normal')}</select></label><div class="field"><span>Ink</span><div style="display:flex;gap:4px">${INKS.map((c) => `<button data-lc="${c}" aria-label="${c}" style="width:22px;height:22px;border-radius:50%;background:${c};border:2px solid ${L.c === c ? 'var(--q-accent)' : 'var(--q-line)'}"></button>`).join('')}</div></div></div></div>`;
    const presets = () => Q.texPresets().map((p, i) => `<button class="btn sm ghost" data-pre="${i}">${QS.esc(p.n)}</button>`).join('');
    el.innerHTML = `<div class="editor"><div class="ctl">
        <div class="field"><span>Base</span><select id="tBase">${opt(BASES, tex.base)}</select></div>
        <div class="field"><span>Presets</span><div class="row" style="margin:0;gap:6px" id="tPre">${presets()}</div></div>
        <div id="tLayers" class="fgrid" style="gap:8px"></div>
        <div class="row" style="margin:0"><button class="btn sm ghost" id="tAdd">Add layer</button><button class="btn sm ghost" id="tSave">Save as preset</button></div>
        <div class="row" style="margin:0"><button class="btn primary sm" id="tExp">Export composite…</button><button class="btn ghost sm" id="tTile">Export texture tile…</button></div>
        <p class="note">Saved presets appear in Foundations → Textures, ready for the whole team.</p></div>
      <div><div class="stage" id="tStage"></div></div></div>
      ${QS.section('Texture library', `${Q.TEX.length} textures. Left half on Void with light ink, right half on Paper with dark ink. Click “Try” to add one as a layer.`, `<div class="grid" style="--min:200px">${Q.TEX.map((t) => `<div style="display:grid;gap:6px">${QS.card(libItem(t), { lazy: true })}<div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span class="note">${t.cat} · ${t.d}</span><button class="btn sm ghost" data-try="${t.k}">Try</button></div></div>`).join('')}</div>`)}`;
    let tm;
    const paint = () => { clearTimeout(tm); tm = setTimeout(() => { QS.$('#tStage', el).innerHTML = texItem().svg(); }, 90); };
    const layers = () => { QS.$('#tLayers', el).innerHTML = tex.layers.map(layerRow).join(''); paint(); };
    layers(); QS.lazy(el);
    el.oninput = (e) => { const r = e.target.closest('[data-li]'), k = e.target.dataset.lk; if (!r || !k) return; const L = tex.layers[+r.dataset.li]; L[k] = k === 'i' || k === 's' ? +e.target.value : e.target.value; const lab = e.target.parentNode.querySelector('span'); if (k === 'i') lab.textContent = `Intensity ${Math.round(L.i * 100)}`; if (k === 's') lab.textContent = `Scale ${L.s.toFixed(2)}×`; paint(); };
    el.onchange = (e) => { if (e.target.id === 'tBase') { tex.base = e.target.value; paint(); } else if (e.target.dataset.lk === 'k' || e.target.dataset.lk === 'b') { const L = tex.layers[+e.target.closest('[data-li]').dataset.li]; L[e.target.dataset.lk] = e.target.value; paint(); } };
    el.onclick = (e) => {
      const r = e.target.closest('[data-li]'), L = r && tex.layers[+r.dataset.li];
      if (e.target.closest('[data-lc]') && L) { L.c = e.target.closest('[data-lc]').dataset.lc; layers(); return; }
      if (e.target.closest('[data-lseed]') && L) { L.seed = Math.floor(Math.random() * 999); paint(); return; }
      if (e.target.closest('[data-ldel]') && L) { tex.layers.splice(+r.dataset.li, 1); layers(); return; }
      const tr = e.target.closest('[data-try]'); if (tr) { tex.layers.push({ k: tr.dataset.try, i: 0.4, s: 1, b: 'normal', c: tex.base.includes('research') || tex.base === 'paper' || tex.base === 'cream' ? '#14111A' : '#FFFFFF', seed: 3 }); layers(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const pr = e.target.closest('[data-pre]'); if (pr) { const p = Q.texPresets()[+pr.dataset.pre]; tex.layers = JSON.parse(JSON.stringify(p.layers)).map((l) => Object.assign({ c: '#FFFFFF', seed: 3 }, l)); if (p.reg) tex.base = p.reg === 'research' ? 'research-post' : 'party-post'; QS.$('#tBase', el).value = tex.base; layers(); return; }
      if (e.target.id === 'tAdd') { tex.layers.push({ k: 'noise-mono', i: 0.3, s: 1, b: 'overlay', c: '#FFFFFF', seed: 3 }); layers(); }
      if (e.target.id === 'tSave') { const n = prompt('Preset name', 'My texture'); if (!n) return; const list = ld(PR_KEY, []); list.push({ n, reg: texItem().register, layers: JSON.parse(JSON.stringify(tex.layers)), saved: Date.now() }); sv(PR_KEY, list); QS.$('#tPre', el).innerHTML = presets(); QS.toast('Preset saved to Foundations'); }
      if (e.target.id === 'tExp') QX.open(QS.add(texItem('composite')));
      if (e.target.id === 'tTile') QX.open(QS.add(tileItem(tex.layers, 'custom')));
    };
  };

  /* ---------- logo ---------- */
  const lg = { font: 'Unbounded', pattern: 'contrast', track: 0.12, lockup: 'primary', ry: 5, sw: 1.6, core: 4.8, jet: 10, glow: true, way: 'color' };
  const WAYS = { color: ['#050307', 'color'], light: ['#F4EAD8', 'color-light'], party: ['#000000', 'party'], mono: ['#050307', 'mono', '#F4EAD8'], research: ['#EFE7DA', 'mono', '#14111A'] };
  const markP = (p, mode, ink) => {
    const id = Q.uid('lg'), C = mode === 'mono' ? [ink, ink, ink, ink] : mode === 'party' ? ['#7A3DFF', '#FFC21A', '#FFFFFF', '#000'] : mode === 'color-light' ? ['#6A45E0', '#E8650F', '#050307', '#050307'] : ['#A98BFF', '#FFB347', '#FFE2A8', '#050307'];
    const G = mode === 'party' ? ['#FFFFFF', '#FFC21A', '#FF2E88'] : ['#FFF3D6', '#FFB347', '#FF5A1F'];
    return (p.glow && mode !== 'mono' ? `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${G[0]}"/><stop offset=".45" stop-color="${G[1]}"/><stop offset="1" stop-color="${G[2]}" stop-opacity="0"/></radialGradient></defs><circle cx="20" cy="20" r="15" fill="url(#${id})" opacity=".55"/>` : '') +
      (p.jet > 0 ? `<path d="M20 ${r2(11.5 - p.jet)}v${p.jet}M20 28.5v${p.jet}" stroke="${C[0]}" stroke-width="1.3" stroke-linecap="round"/>` : '') +
      `<ellipse cx="20" cy="20" rx="17.5" ry="${p.ry}" fill="none" stroke="${C[1]}" stroke-width="${p.sw}"/><circle cx="20" cy="20" r="${p.core}" fill="${mode === 'mono' ? 'none' : C[3]}" stroke="${C[2]}" stroke-width="${mode === 'mono' ? 1.5 : 0.9}"/>`;
  };
  const availW = (font, w) => { const F = (window.QFONTLAB || []).find((f) => f.family === font); if (!F) return w; let best = null, bd = 1e9; F.faces.forEach((x) => { const [a, b] = String(x.w).split(/\s+/).map(Number); const lo = a, hi = b || a, c = Math.max(lo, Math.min(hi, w)), d = Math.abs(c - w); if (d < bd) { bd = d; best = c; } }); return best || w; };
  const words0 = (p) => ({ contrast: [['THE ', 300], ['QUASAR', 700], [' LAB', 300]], solid: [['THE QUASAR LAB', 700]], light: [['THE QUASAR LAB', 300]], medium: [['THE QUASAR LAB', 500]], 'quasar-only': [['QUASAR', 700]] }[p.pattern]);
  const words = (p) => words0(p).map(([t, w]) => [t, availW(p.font, w)]);
  const logoP = (p) => {
    const [bg, mode, ink0] = WAYS[p.way], ink = ink0 || Q.inkFor(mode), ts = 21, ls = ts * p.track, W = words(p);
    const ww = W.reduce((a, [s, w]) => a + Q.tw(s, ts, p.font, w, ls) + ls, -ls) * 1.04 + 4;
    const sub = p.pattern === 'quasar-only' ? `<text x="0" y="0" font-family="JetBrains Mono" font-size="7.5" font-weight="600" letter-spacing="2.6" fill="${ink}">THE · LAB</text>` : '';
    const wm = (x, y, anchor) => `<text x="${r2(anchor === 'middle' ? x - ww / 2 : x)}" y="${r2(y)}" font-family="${p.font}" font-size="${ts}" letter-spacing="${r2(ls)}" fill="${ink}">${W.map(([s, w]) => `<tspan font-weight="${w}">${Q.esc(s)}</tspan>`).join('')}</text>`;
    let w, h, inner;
    if (p.lockup === 'stacked') { w = Math.max(ww, 80) + 20; h = 80 + 46; inner = `<g transform="translate(${r2(w / 2 - 36)} 0) scale(1.8)">${markP(p, mode, ink)}</g>` + wm(w / 2, 108, 'middle') + (sub ? `<g transform="translate(${r2(w / 2 - 22)} 122)">${sub}</g>` : ''); h += sub ? 10 : 0; }
    else if (p.lockup === 'symbol') { w = 64; h = 64; inner = `<g transform="scale(1.6)">${markP(p, mode, ink)}</g>`; }
    else { w = 80 + ww + 4; h = 64; inner = `<g transform="scale(1.6)">${markP(p, mode, ink)}</g>` + wm(80, 32 + ts * 0.36) + (sub ? `<g transform="translate(81 ${32 + ts * 0.36 + 14})">${sub}</g>` : ''); }
    const pad = 16; return { w: w + pad * 2, h: h + pad * 2, bg, inner: `<g transform="translate(${pad} ${pad})">${inner}</g>` };
  };
  const logoItem = (p, name) => { const L = logoP(p); return { id: `logo-test-${QX.slug(name || `${p.font}-${p.pattern}-${p.lockup}`)}`, title: name || `${p.font} · ${p.pattern} · ${p.lockup}`, w: L.w * 4, h: L.h * 4, register: p.way === 'party' ? 'party' : p.way === 'research' ? 'research' : 'core', format: 'logo', section: 'lab', dark: !['light', 'research'].includes(p.way),
    svg: (o = {}) => Q.doc(L.w * 4, L.h * 4, `<g transform="scale(4)">${L.inner}</g>`, { bg: L.bg, transparent: o.transparent }), lab: { type: 'logo', p: Object.assign({}, p) } }; };
  const logoUI = (el) => {
    const rng = (k, lab, min, max, step) => `<label class="field"><span>${lab} <b data-v="${k}">${lg[k]}</b></span><input type="range" data-g="${k}" min="${min}" max="${max}" step="${step}" value="${lg[k]}"></label>`;
    el.innerHTML = `<div class="editor"><div class="ctl">
      <label class="field"><span>Wordmark font</span><select data-g="font">${opt(FONTS('display'), lg.font)}</select></label>
      <label class="field"><span>Weight pattern</span><select data-g="pattern">${opt([['contrast', 'THE light · QUASAR bold · LAB light'], ['solid', 'All bold'], ['medium', 'All medium'], ['light', 'All light'], ['quasar-only', 'QUASAR + mono THE · LAB']], lg.pattern)}</select></label>
      ${rng('track', 'Tracking (em)', -0.04, 0.4, 0.01)}
      <div class="field"><span>Lockup</span>${QS.seg('glock', [['primary', 'Primary'], ['stacked', 'Stacked'], ['symbol', 'Symbol']], lg.lockup)}</div>
      <div class="field"><span>Colorway</span>${QS.seg('gway', [['color', 'Void'], ['light', 'Cream'], ['party', 'Party'], ['mono', 'Mono'], ['research', 'Research']], lg.way)}</div>
      <p class="kick" style="margin:6px 0 0">Symbol</p>
      ${rng('ry', 'Disk height', 2.5, 9, 0.1)}${rng('sw', 'Disk stroke', 0.8, 3.2, 0.1)}${rng('core', 'Core radius', 3, 7.5, 0.1)}${rng('jet', 'Jet length', 0, 11, 0.5)}
      <label class="qcheck"><input type="checkbox" data-g="glow" ${lg.glow ? 'checked' : ''}> Halo glow</label>
      <div class="row" style="margin:0"><button class="btn primary sm" id="gExp">Export…</button><button class="btn ghost sm" id="gSave">Add to shortlist</button><button class="btn ghost sm" id="gReset">Reset to current logo</button></div></div>
      <div><div class="stage" id="gStage" style="min-height:280px"></div></div></div>
      ${QS.section('Same settings, every display font', 'Click any card to export it. Use “Add to shortlist” above after picking a font from the list.', '<div class="grid" id="gCmp" style="--min:280px"></div>')}`;
    let tm;
    const paint = () => { clearTimeout(tm); tm = setTimeout(() => { QS.$('#gStage', el).innerHTML = logoItem(lg).svg(); QS.$('#gCmp', el).innerHTML = FONTS('display').map((f) => QS.card(logoItem(Object.assign({}, lg, { font: f })))).join(''); }, 80); };
    paint();
    el.oninput = (e) => { const k = e.target.dataset.g; if (!k) return; lg[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'range' ? +e.target.value : e.target.value; const b = el.querySelector(`[data-v="${k}"]`); if (b) b.textContent = lg[k]; paint(); };
    el.onchange = el.oninput;
    el.onclick = (e) => {
      const a = e.target.closest('[data-seg="glock"] button'), b = e.target.closest('[data-seg="gway"] button');
      if (a) { lg.lockup = a.dataset.v; paint(); } if (b) { lg.way = b.dataset.v; paint(); }
      if (e.target.id === 'gExp') QX.open(QS.add(logoItem(lg)));
      if (e.target.id === 'gSave') { const it = logoItem(lg); const s = ld(SL_KEY, []); s.push({ type: 'logo', p: Object.assign({}, lg), n: it.title, at: Date.now() }); sv(SL_KEY, s); QS.toast('Added to shortlist'); }
      if (e.target.id === 'gReset') { Object.assign(lg, { font: 'Unbounded', pattern: 'contrast', track: 0.12, ry: 5, sw: 1.6, core: 4.8, jet: 10, glow: true }); logoUI(el); }
    };
  };

  /* ---------- type ---------- */
  const ty = { d: 'Unbounded', t: 'Space Grotesk', m: 'JetBrains Mono', head: 'Become the brightest light', body: 'Stories and data on the same plane, so neither one gets to erase the other.', label: 'FIG. 07 — DEC 8, 2026 · BRUSSELS' };
  const pairItem = (p, reg) => { const th = Q.theme(reg), W = 1080, H = 1350, m = 80; return { id: `type-test-${QX.slug(p.d)}-${QX.slug(p.t)}-${reg}`, title: `${p.d} + ${p.t} + ${p.m} · ${reg}`, w: W, h: H, register: reg, format: 'type', section: 'lab', dark: th.dark,
    svg: () => { const up = reg === 'party', hs = Q.fit(up ? p.head.toUpperCase() : p.head, up ? 120 : 90, W - 2 * m, 4, p.d, up ? 800 : 500, -0.02);
      return Q.doc(W, H, (up ? Q.quasar(800, 300, 400, th, { tilt: -14, jet: 900 }) : Q.regMarks(W, H, 28, th.fg, 16)) +
        T(m, m + 20, p.label.toUpperCase(), { f: p.m, s: 22, w: 500, ls: 3, fill: up ? th.c : th.a }) +
        T(m, 560, hs.lines, { f: p.d, s: hs.size, w: up ? 800 : 500, ls: -0.02 * hs.size, fill: th.fg, lh: 1.02 }) +
        T(m, 600 + hs.lines.length * hs.size * 1.02, Q.wrap(p.body, 32, W - 2 * m - 60, p.t, 400).slice(0, 4), { f: p.t, s: 32, w: 400, fill: th.mute, lh: 1.38 }) +
        T(m, m + 64, [`DISPLAY · ${p.d}`, `TEXT · ${p.t}`, `MONO · ${p.m}`].map((x) => x.toUpperCase()), { f: p.m, s: 16, w: 500, ls: 2, fill: th.mute, lh: 1.6 }), { bg: th.bg }); }, lab: { type: 'type', p: Object.assign({}, p) } }; };
  const typeUI = (el) => {
    el.innerHTML = `<div class="editor"><div class="ctl">
      <label class="field"><span>Display</span><select data-y="d">${opt(FONTS('display'), ty.d)}</select></label>
      <label class="field"><span>Text</span><select data-y="t">${opt(FONTS('text'), ty.t)}</select></label>
      <label class="field"><span>Mono</span><select data-y="m">${opt(FONTS('mono'), ty.m)}</select></label>
      <label class="field"><span>Headline</span><input data-y="head" value="${QS.esc(ty.head)}"></label>
      <label class="field"><span>Body</span><textarea data-y="body" rows="3">${QS.esc(ty.body)}</textarea></label>
      <label class="field"><span>Label</span><input data-y="label" value="${QS.esc(ty.label)}"></label>
      <div class="row" style="margin:0"><button class="btn ghost sm" id="ySave">Add pairing to shortlist</button></div>
      <p class="note">All candidates are open-license (SIL OFL) and bundled in assets/fonts/lab.</p></div>
      <div><div class="grid" id="yPrev" style="--min:240px"></div><div class="panel" id="yWater" style="margin-top:16px;overflow:hidden"></div></div></div>
      ${QS.section('Headline in every display font', null, '<div class="fgrid" id="yCmp" style="gap:0"></div>')}
      ${QS.section('Body in every text font · labels in every mono', null, '<div class="split"><div class="panel fgrid" id="yTxt"></div><div class="panel fgrid" id="yMono"></div></div>')}`;
    let tm;
    const paint = () => { clearTimeout(tm); tm = setTimeout(() => {
      QS.$('#yPrev', el).innerHTML = ['party', 'research'].map((r) => QS.card(pairItem(ty, r))).join('');
      QS.$('#yWater', el).innerHTML = [72, 48, 32, 20].map((s) => `<p style="font-family:'${ty.d}';font-size:${s}px;line-height:1.05;font-weight:${s > 40 ? 700 : 500};white-space:nowrap;margin:6px 0">${QS.esc(ty.head)}</p>`).join('') + `<p style="font-family:'${ty.t}';font-size:17px;max-width:60ch;margin-top:12px">${QS.esc(ty.body)}</p><p style="font-family:'${ty.m}';font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-top:10px;color:var(--q-accent)">${QS.esc(ty.label)}</p>`;
      QS.$('#yCmp', el).innerHTML = FONTS('display').map((f) => `<button data-pick="d" data-f="${f}" style="display:grid;grid-template-columns:170px 1fr;gap:16px;align-items:baseline;text-align:left;padding:14px 4px;border-bottom:1px solid var(--q-line);${f === ty.d ? 'color:var(--q-accent)' : ''}"><span style="font:500 .62rem/1.3 var(--m);letter-spacing:.12em;text-transform:uppercase;color:var(--q-ink-3)">${f}</span><span style="font-family:'${f}';font-weight:700;font-size:clamp(1.3rem,3vw,2.4rem);line-height:1.05;text-transform:uppercase;overflow-wrap:anywhere">${QS.esc(ty.head)}</span></button>`).join('');
      QS.$('#yTxt', el).innerHTML = FONTS('text').map((f) => `<button data-pick="t" data-f="${f}" style="text-align:left;display:grid;gap:4px;${f === ty.t ? 'color:var(--q-accent)' : ''}"><span style="font:500 .6rem/1 var(--m);letter-spacing:.12em;text-transform:uppercase;color:var(--q-ink-3)">${f}</span><span style="font-family:'${f}';font-size:1rem;line-height:1.45">${QS.esc(ty.body)}</span></button>`).join('');
      QS.$('#yMono', el).innerHTML = FONTS('mono').map((f) => `<button data-pick="m" data-f="${f}" style="text-align:left;display:grid;gap:4px;${f === ty.m ? 'color:var(--q-accent)' : ''}"><span style="font:500 .6rem/1 var(--m);letter-spacing:.12em;text-transform:uppercase;color:var(--q-ink-3)">${f}</span><span style="font-family:'${f}';font-size:.86rem;letter-spacing:.12em;text-transform:uppercase">${QS.esc(ty.label)}</span></button>`).join('');
    }, 100); };
    paint();
    el.oninput = (e) => { const k = e.target.dataset.y; if (k) { ty[k] = e.target.value; paint(); } };
    el.onchange = el.oninput;
    el.onclick = (e) => { const p = e.target.closest('[data-pick]'); if (p) { ty[p.dataset.pick] = p.dataset.f; el.querySelector(`select[data-y="${p.dataset.pick}"]`).value = p.dataset.f; paint(); }
      if (e.target.id === 'ySave') { const s = ld(SL_KEY, []); s.push({ type: 'type', p: Object.assign({}, ty), n: `${ty.d} + ${ty.t} + ${ty.m}`, at: Date.now() }); sv(SL_KEY, s); QS.toast('Pairing added to shortlist'); } };
  };

  /* ---------- shortlist ---------- */
  const slItems = () => ld(SL_KEY, []).map((x, i) => Object.assign(x.type === 'logo' ? logoItem(x.p, x.n) : pairItem(x.p, 'party'), { id: `shortlist-${String(i + 1).padStart(2, '0')}-${x.type}`, _i: i }));
  const slUI = (el) => {
    const its = slItems();
    el.innerHTML = its.length ? `<div class="row" style="margin:0 0 16px"><button class="btn sm ghost" id="sZip">Download shortlist (ZIP)</button><button class="btn sm ghost" id="sClear">Clear shortlist</button></div><div class="grid" style="--min:260px">${its.map((it) => `<div style="display:grid;gap:6px">${QS.card(it)}<button class="btn sm ghost" data-rm="${it._i}" style="justify-self:start">Remove</button></div>`).join('')}</div>`
      : '<div class="panel"><h3>Nothing shortlisted yet</h3><p class="note" style="margin-top:6px">Use “Add to shortlist” in the Logo and Type tabs. The shortlist is saved on this device so you can compare candidates side by side and export them for review.</p></div>';
    el.onclick = (e) => { const r = e.target.closest('[data-rm]'); if (r) { const s = ld(SL_KEY, []); s.splice(+r.dataset.rm, 1); sv(SL_KEY, s); slUI(el); }
      if (e.target.id === 'sClear' && confirm('Clear the whole shortlist?')) { sv(SL_KEY, []); slUI(el); }
      if (e.target.id === 'sZip') QX.batch(slItems(), 'lab-shortlist'); };
    el.oninput = el.onchange = null;
  };

  let tab = 'textures';
  QS.app('lab', {
    title: 'Lab', desc: 'Test textures, logo variants and font pairings. Shortlist what works.',
    lede: 'A sandbox for the system. Stack textures, bend the logo, swap typefaces, and shortlist the candidates worth showing the team. Nothing here changes the system until you save it.',
    items: () => [...Q.texLibItems(), ...slItems()],
    render(el) {
      el.innerHTML = `<div class="row" style="margin:0 0 20px">${QS.seg('labtab', [['textures', 'Textures'], ['logo', 'Logo'], ['type', 'Type'], ['shortlist', 'Shortlist']], tab)}</div><div id="labBody"><p class="note">Loading candidate fonts…</p></div>`;
      const body = QS.$('#labBody', el);
      const show = () => ({ textures: texUI, logo: logoUI, type: typeUI, shortlist: slUI }[tab](body));
      loadFonts().then(show);
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-seg="labtab"] button'); if (b) { tab = b.dataset.v; show(); } });
    }
  });
})();
