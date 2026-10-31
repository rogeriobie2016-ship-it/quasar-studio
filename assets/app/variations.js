/* § Variations: every lockup in every colorway, plus event lockups */
(function () {
  const WAYS = [
    { k: 'color-void', n: 'Color on Void', mode: 'color', bg: '#050307', dark: true },
    { k: 'color-cream', n: 'Color on Cream', mode: 'color-light', bg: '#F4EAD8', dark: false },
    { k: 'mono-cream', n: 'Mono Cream', mode: 'mono', ink: '#F4EAD8', bg: '#050307', dark: true },
    { k: 'mono-void', n: 'Mono Void', mode: 'mono', ink: '#050307', bg: '#FFFFFF', dark: false },
    { k: 'party', n: 'Party', mode: 'party', bg: '#000000', dark: true },
    { k: 'gold-foil', n: 'Gold foil (1 ink)', mode: 'mono', ink: '#FFB347', bg: '#050307', dark: true },
    { k: 'research', n: 'Research ink', mode: 'mono', ink: '#14111A', bg: '#EFE7DA', dark: false }
  ];
  const item = (type, w) => {
    const L = Q.logo(type, { mode: w.mode, ink: w.ink, pad: true }), s = 4;
    return { id: `logo-${type}-${w.k}`, title: `${type[0].toUpperCase() + type.slice(1)} · ${w.n}`, w: L.w * s, h: L.h * s, register: w.k === 'party' ? 'party' : w.k === 'research' ? 'research' : 'core', format: 'logo', section: 'variations', dark: w.dark,
      svg: (o = {}) => Q.doc(L.w * s, L.h * s, `<g transform="scale(${s})">${L.inner}</g>`, { bg: w.bg, transparent: o.transparent }) };
  };
  const eventItem = (ev, reg) => {
    const th = Q.theme(reg), W = 1600, H = 400;
    return { id: `lockup-event-${ev.k}-${reg}`, title: `${ev.n} lockup · ${reg}`, w: W, h: H, register: reg, format: 'logo', section: 'variations', dark: th.dark,
      svg: (o = {}) => Q.doc(W, H, Q.place('primary', 80, 140, 760, 120, { mode: reg === 'party' ? 'party' : 'mono', ink: th.fg, valign: 'middle' }) + `<path d="M900 120V280" stroke="${th.fg}" stroke-width="2" opacity=".5"/>` +
        Q.text(950, 188, ev.n.toUpperCase(), { f: 'd', s: 40, w: 700, fill: reg === 'party' ? th.a : th.fg, ls: 1 }) + Q.text(950, 240, `${ev.city.toUpperCase()} · ${ev.date}`, { f: 'm', s: 24, w: 500, ls: 3, fill: reg === 'party' ? th.c : th.a }), { bg: th.bg, transparent: o.transparent }) };
  };
  const all = () => [...Q.logoTypes.flatMap((t) => WAYS.map((w) => item(t, w))), ...Q.EVENTS.flatMap((ev) => ['party', 'research'].map((r) => eventItem(ev, r)))];

  QS.app('variations', {
    title: 'Variations', desc: 'Every lockup × every colorway, plus event lockups. Download all logos in one ZIP.',
    lede: 'Four lockups in seven colorways, ready for any surface. Export any of them as SVG, transparent PNG at 1×/2×/4×, JPG or PDF.',
    items: all,
    render(el) {
      let type = 'all';
      const draw = () => {
        const types = type === 'all' ? Q.logoTypes : [type];
        QS.$('#varGrid', el).innerHTML = types.map((t) => `<h3 class="kick" style="margin:26px 0 12px">${t}</h3><div class="grid" style="--min:${t === 'symbol' ? 170 : t === 'stacked' ? 200 : 280}px">${WAYS.map((w) => QS.card(item(t, w))).join('')}</div>`).join('');
      };
      el.innerHTML = `<div class="row">${QS.seg('vt', [['all', 'All lockups'], ...Q.logoTypes.map((t) => [t, t])], 'all')}</div><div id="varGrid"></div>
        ${QS.section('Event lockups', 'Primary lockup + event name for co-branded season materials. These are ours: never set an organizer\'s own logo here.', `<div class="grid" style="--min:340px">${Q.EVENTS.flatMap((ev) => ['party', 'research'].map((r) => QS.card(eventItem(ev, r)))).join('')}</div>`)}
        ${QS.section('Choosing a colorway', null, `<div class="wrap-x"><table class="tbl"><tr><th>Colorway</th><th>Use for</th></tr>
          <tr><td>Color on Void</td><td>Default. Screens, slides, social, the website.</td></tr><tr><td>Color on Cream</td><td>Light documents, letterhead, research print on uncoated paper.</td></tr>
          <tr><td>Mono Cream / Mono Void</td><td>Single-ink print, embroidery, laser etching, over photography.</td></tr><tr><td>Party</td><td>Afterparty materials only. Fluorescent spot inks in print.</td></tr>
          <tr><td>Gold foil</td><td>Hot foil, metal pins, tote screenprint, premium stationery.</td></tr><tr><td>Research ink</td><td>Papers, posters, archival plates, academic decks.</td></tr></table></div>`)}`;
      draw();
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-seg="vt"] button'); if (b) { type = b.dataset.v; draw(); } });
    }
  });
})();
