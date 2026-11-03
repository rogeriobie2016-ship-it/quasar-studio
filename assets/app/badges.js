/* § Badges: event credentials (4 × 6 in) and pin-back button badges (58 mm). */
(function () {
  const T = Q.text, r2 = Q.r2, KEY = 'quasar.badges.v1';
  const ROLES = [
    { k: 'guest', n: 'Guest', c: '#F4EAD8' }, { k: 'speaker', n: 'Speaker', c: '#FF2E88' }, { k: 'crew', n: 'Crew', c: '#C8FF1F' },
    { k: 'press', n: 'Press', c: '#00E5FF' }, { k: 'partner', n: 'Partner', c: '#FFC21A' }, { k: 'vip', n: 'VIP', c: '#7A3DFF' }
  ];
  const DEF = 'Firstname Lastname, Organization, speaker\nFirstname Lastname, Organization, crew\nFirstname Lastname, Organization, guest';
  const st = Object.assign({ ev: 'uxr', reg: 'party', list: DEF }, JSON.parse(localStorage.getItem(KEY) || '{}'));
  const save = () => localStorage.setItem(KEY, JSON.stringify(st));
  const people = () => st.list.split('\n').map((l) => l.split(',').map((x) => x.trim())).filter((p) => p[0]).map(([name, org, role]) => ({ name, org: org || '', role: (ROLES.find((r) => r.k === (role || '').toLowerCase()) || ROLES[0]) }));
  const W = 1016, H = 1524;
  const badge = (p, i, ev, reg) => {
    const th = Q.theme(reg), E = Q.EVENTS.find((e) => e.k === ev), [first, ...rest] = p.name.split(' '), last = rest.join(' ');
    return { id: `badge-${ev}-${reg}-${String(i + 1).padStart(3, '0')}-${p.role.k}`, title: `${p.role.n} · ${String(i + 1).padStart(3, '0')}`, w: W, h: H, register: reg, format: 'print', section: 'badges', print: { mm: [101.6, 152.4], bleed: 3 }, dark: th.dark,
      svg: (o = {}) => {
        const m = 70; let s;
        if (reg === 'party') {
          const fs = Q.fit(first.toUpperCase(), 150, W - 2 * m, 1, 'd', 800, -0.03), ls = Q.fit((last || ' ').toUpperCase(), 92, W - 2 * m, 2, 'd', 800, -0.02);
          s = Q.quasar(760, 260, 420, th, { tilt: -14, jet: 700 }) + T(m, 150, E.n.toUpperCase(), { f: 'm', s: 30, w: 700, ls: 4, fill: th.c }) + T(m, 196, `${E.city.toUpperCase()} · ${E.date}`, { f: 'm', s: 24, w: 600, ls: 3, fill: th.fg }) +
            T(m, 760, fs.lines, { f: 'd', s: fs.size, w: 800, fill: th.fg, ls: -0.03 * fs.size }) + T(m, 760 + ls.size * 1.05, ls.lines, { f: 'd', s: ls.size, w: 800, fill: th.fg, ls: -0.02 * ls.size, lh: 1 }) +
            T(m, 820 + ls.lines.length * ls.size + 40, Q.wrap(p.org.toUpperCase(), 30, W - 2 * m, 'm', 600, 3).slice(0, 2), { f: 'm', s: 30, w: 600, ls: 3, fill: th.mute, lh: 1.4 }) +
            `<rect x="0" y="${H - 300}" width="${W}" height="300" fill="${p.role.c}"/>` + T(m, H - 110, p.role.n.toUpperCase(), { f: 'd', s: 130, w: 800, fill: '#000', ls: -3 }) +
            Q.place('primary', W - m - 330, H - 270, 330, 40, { mode: 'mono', ink: '#000', align: 'right' }) + Q.text(W - m, H - 50, `NO. ${String(i + 1).padStart(3, '0')}`, { f: 'm', s: 22, w: 700, ls: 3, fill: '#000', anchor: 'end' }) + Q.grain(W, H, 0.18);
        } else {
          const g = Q.gridPattern(30, th.grid, 5), nf = Q.fit(p.name, 96, W - 2 * m, 2, 'd', 500, -0.015);
          s = `<defs>${g.defs}</defs><rect width="${W}" height="${H}" fill="url(#${g.id})"/>` + Q.place('horizontal', m, 110, 760, 80, { mode: 'mono', ink: th.fg }) + `<path d="M${m} 230H${W - m}" stroke="${th.fg}" stroke-width="2"/>` +
            T(m, 290, `${E.n.toUpperCase()} · ${E.city.toUpperCase()} · ${E.date}`, { f: 'm', s: 22, w: 600, ls: 2.4, fill: th.a }) + Q.quasar(W / 2, 520, 220, th, { jet: 150, sw: 2 }) +
            T(m, 860, nf.lines, { f: 'd', s: nf.size, w: 500, fill: th.fg, ls: -0.015 * nf.size, lh: 1.05 }) + T(m, 900 + nf.lines.length * nf.size * 1.05, Q.wrap(p.org.toUpperCase(), 28, W - 2 * m, 'm', 500, 2.4).slice(0, 2), { f: 'm', s: 28, w: 500, ls: 2.4, fill: th.mute, lh: 1.4 }) +
            `<path d="M${m} ${H - 260}H${W - m}" stroke="${th.fg}" stroke-width="2"/>` + T(m, H - 160, p.role.n.toUpperCase(), { f: 'd', s: 84, w: 600, fill: th.a }) + T(m, H - 90, `PLATE NO. ${String(i + 1).padStart(3, '0')}`, { f: 'm', s: 22, w: 600, ls: 3, fill: th.fg }) +
            `<rect x="${W - m - 150}" y="${H - 230}" width="150" height="150" fill="none" stroke="${th.fg}" stroke-dasharray="6 6" stroke-width="2"/>` + T(W - m - 75, H - 146, 'QR', { f: 'm', s: 24, w: 700, fill: th.mute, anchor: 'middle' }) + Q.regMarks(W, H, 26, th.fg, 18);
        }
        if (o.preview) s += `<rect x="${W / 2 - 80}" y="40" width="160" height="34" rx="17" fill="none" stroke="#00C2FF" stroke-width="3" stroke-dasharray="8 6"/>`;
        return Q.doc(W, H, s, { bg: th.bg });
      } };
  };
  /* pin-back buttons: 58 mm face + 6 mm wrap each side = 70 mm print circle. 10 units = 1 mm */
  const BTN = [
    { k: 'mark', n: 'The mark', bg: '#000', draw: () => Q.mark(170, 170, 360, { mode: 'party' }) },
    { k: '7d', n: '7D', bg: '#000', draw: () => `<ellipse cx="350" cy="350" rx="250" ry="70" fill="none" stroke="#7A3DFF" stroke-width="18" transform="rotate(-16 350 350)"/>` + T(350, 440, '7D', { f: 'd', s: 250, w: 800, fill: '#C8FF1F', anchor: 'middle' }) },
    { k: 'afterparty', n: 'Afterparty', bg: '#FFC21A', draw: () => T(350, 320, ['REALITY', 'HACK'], { f: 'd', s: 64, w: 800, fill: '#000', anchor: 'middle', lh: 1 }) + T(350, 455, 'AFTERPARTY', { f: 'd', s: 54, w: 800, fill: '#FF2E88', anchor: 'middle' }) },
    { k: 'dbh', n: 'Ask me about Data Black Holes', bg: '#EFE7DA', draw: () => { let s = ''; for (let i = 0; i < 7; i++) { const f = i / 6, rx = 180 * Math.pow(1 - f, 1.4) + 8; s += `<ellipse cx="350" cy="${r2(380 + f * f * 90)}" rx="${r2(rx)}" ry="${r2(rx * 0.24)}" fill="none" stroke="#14111A" stroke-width="3"/>`; } return T(350, 250, ['ASK ME ABOUT', 'DATA BLACK HOLES'], { f: 'd', s: 34, w: 700, fill: '#C4441A', anchor: 'middle', lh: 1.15 }) + s; } },
    { k: 'hiipe', n: 'HIIPE', bg: '#F4EAD8', draw: () => { let d = ''; for (let a = 0; a <= Math.PI * 5; a += 0.08) { const r = 8 + a * 12; d += (a ? 'L' : 'M') + r2(350 + Math.cos(a) * r) + ' ' + r2(320 + Math.sin(a) * r); } return `<path d="${d}" fill="none" stroke="#C4441A" stroke-width="9" stroke-linecap="round"/>` + T(350, 540, 'HIIPE', { f: 'd', s: 60, w: 800, fill: '#050307', anchor: 'middle', ls: 4 }); } }
  ];
  const ringText = (bg) => { const id = Q.uid('bt'), ink = ['#000', '#000000', '#050307'].includes(bg) ? '#F4EAD8' : '#050307'; return `<defs><path id="${id}" d="M350 350m-318 0a318 318 0 1 1 636 0a318 318 0 1 1-636 0"/></defs><text font-family="JetBrains Mono" font-size="19" font-weight="700" letter-spacing="5" fill="${ink}" opacity=".85"><textPath href="#${id}" startOffset="18%">THE QUASAR LAB · RESEARCH + DESIGN</textPath></text>`; };
  const btnItem = (b) => ({ id: `button-58mm-${b.k}`, title: `Button 58 mm · ${b.n}`, w: 700, h: 700, register: ['dbh', 'hiipe'].includes(b.k) ? 'research' : 'party', format: 'merch', section: 'badges', print: { mm: [70, 70], bleed: 0 }, dark: b.bg === '#000',
    svg: (o = {}) => Q.doc(700, 700, `<circle cx="350" cy="350" r="350" fill="${b.bg}"/>` + b.draw() + ringText(b.bg) + (o.preview ? `<circle cx="350" cy="350" r="290" fill="none" stroke="#00C2FF" stroke-width="3" stroke-dasharray="10 8"/><circle cx="350" cy="350" r="348" fill="none" stroke="#E5383B" stroke-width="3"/>` : ''), { bg: null, transparent: true }), transparent: true });
  const all = () => [...people().map((p, i) => badge(p, i, st.ev, st.reg)), ...BTN.map(btnItem)];

  QS.app('badges', {
    title: 'Badges', desc: 'Event credentials with role colors, plus 58 mm pin-back button badges.',
    lede: 'Credentials for the booth, the panel and the party, generated from a simple list. Every badge carries the lab mark and a plate number. Buttons below are 58 mm with the wrap built in.',
    items: all,
    render(el) {
      const draw = () => { QS.$('#bdGrid', el).innerHTML = people().map((p, i) => QS.card(badge(p, i, st.ev, st.reg))).join(''); save(); };
      el.innerHTML = `<div class="split"><div class="panel fgrid"><p class="kick" style="margin:0">Attendee list</p><label class="field"><span>One per line: Name, Organization, Role</span><textarea id="bdList" rows="7" style="font-family:var(--m);font-size:.8rem">${QS.esc(st.list)}</textarea></label>
          <p class="note">Roles: ${ROLES.map((r) => `<b style="color:${r.c === '#F4EAD8' ? 'inherit' : r.c}">${r.k}</b>`).join(' · ')}. Names and organizations only: no emails, phone numbers or dietary or access notes on a printed badge.</p></div>
        <div class="panel fgrid"><div class="field"><span>Event</span>${QS.seg('bdev', Q.EVENTS.map((e) => [e.k, e.n]), st.ev)}</div><div class="field"><span>Register</span>${QS.seg('bdreg', [['party', 'Party'], ['research', 'Research']], st.reg)}</div>
          <div class="spec"><span><b>Size</b> 4 × 6 in (101.6 × 152.4 mm), 3 mm bleed</span><span><b>Hole</b> slot punch top center (blue dashed, preview only)</span><span><b>Stock</b> 350 gsm silk or PVC; party roles readable from 3 m</span></div>
          <button class="btn sm primary" data-zip="badges">Download all badges + buttons (ZIP)</button></div></div>
        <div class="grid" id="bdGrid" style="--min:200px;margin-top:20px"></div>
        ${QS.section('Role colors', 'Party register only. Research badges stay monochrome with the role in Redline.', `<div class="grid" style="--min:140px">${ROLES.map((r) => `<div class="sw"><i style="background:${r.c};height:56px"></i><div><b>${r.n}</b><code>${r.c}</code></div></div>`).join('')}</div>`)}
        ${QS.section('Button badges · 58 mm', 'Print circle is 70 mm: the blue dashed ring is the visible face, everything outside it wraps around the edge. The lab name runs on the wrap ring.', `<div class="grid" style="--min:180px">${BTN.map((b) => QS.card(btnItem(b))).join('')}</div>`)}`;
      draw();
      let tm; el.addEventListener('input', (e) => { if (e.target.id === 'bdList') { st.list = e.target.value; clearTimeout(tm); tm = setTimeout(draw, 250); } });
      el.addEventListener('click', (e) => { const a = e.target.closest('[data-seg="bdev"] button'), b = e.target.closest('[data-seg="bdreg"] button'); if (a) { st.ev = a.dataset.v; draw(); } if (b) { st.reg = b.dataset.v; draw(); } });
    }
  });
})();
