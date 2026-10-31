/* § Sponsors: co-branded lockups, thank-you cards and deck cover with empty partner slots.
   Partner logos are loaded from the user's device, kept in memory only, never redrawn. */
(function () {
  const T = Q.text, r2 = Q.r2;
  const LOGOS = []; let showSlots = true, tier = 6;
  const slot = (x, y, w, h, i, th, o = {}) => {
    const L = LOGOS[i];
    if (L) return `<image href="${L.src}" x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" preserveAspectRatio="xMidYMid meet"/>`;
    if (!showSlots || o.export) return '';
    return `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" fill="none" stroke="${th.fg}" stroke-width="${Math.max(1, w / 160)}" stroke-dasharray="${w / 40} ${w / 50}" opacity=".5"/>` + T(x + w / 2, y + h / 2 + Math.min(w, h) * 0.06, `PARTNER ${String(i + 1).padStart(2, '0')}`, { f: 'm', s: Math.min(w, h) * 0.16, w: 600, ls: Math.min(w, h) * 0.02, fill: th.fg, anchor: 'middle', op: 0.6 });
  };
  const V = [
    { k: 'lockup-horizontal', n: 'Co-brand lockup · horizontal', w: 1600, h: 400, regs: ['core', 'research'], t: true, draw: (th, o) => Q.place('primary', 60, 150, 760, 100, { mode: th.reg === 'research' ? 'mono' : 'color', ink: th.fg, valign: 'middle' }) + T(890, 222, '×', { f: 'd', s: 60, w: 300, fill: th.fg, anchor: 'middle' }) + slot(960, 110, 580, 180, 0, th, o) },
    { k: 'lockup-stacked', n: 'Co-brand lockup · stacked', w: 800, h: 1000, regs: ['core', 'research'], t: true, draw: (th, o) => Q.place('stacked', 200, 60, 400, 420, { mode: th.reg === 'research' ? 'mono' : 'color', ink: th.fg, align: 'center' }) + `<path d="M200 560H600" stroke="${th.fg}" stroke-width="2" opacity=".5"/>` + T(400, 620, 'WITH', { f: 'm', s: 26, w: 600, ls: 6, fill: th.mute, anchor: 'middle' }) + slot(150, 680, 500, 240, 0, th, o) },
    { k: 'lockup-presented', n: 'Presented with', w: 1600, h: 400, regs: ['party', 'core'], t: true, draw: (th, o) => Q.place('primary', 60, 150, 700, 100, { mode: th.reg === 'party' ? 'party' : 'color', valign: 'middle' }) + `<path d="M820 110V290" stroke="${th.fg}" stroke-width="2" opacity=".4"/>` + T(880, 175, th.reg === 'party' ? 'AFTERPARTY PRESENTED WITH' : 'PRESENTED WITH', { f: 'm', s: 22, w: 600, ls: 3, fill: th.reg === 'party' ? th.c : th.a }) + slot(880, 200, 660, 130, 0, th, o) },
    { k: 'thanks', n: 'Thank-you card', w: 1080, h: 1350, regs: ['party', 'research'], draw: (th, o) => {
      const u = 1, m = 80, n = tier, cols = n === 1 ? 1 : n <= 4 ? 2 : 3, rows = Math.ceil(n / cols), gw = 1080 - 2 * m, cw = (gw - (cols - 1) * 30) / cols, ch = Math.min(220, cw * 0.55), y0 = 620;
      let s = th.reg === 'party' ? Q.quasar(860, 230, 380, th, { tilt: -14, jet: 900 }) + Q.grain(1080, 1350, 0.2) : (() => { const g = Q.gridPattern(36, th.grid, 5); return `<defs>${g.defs}</defs><rect width="1080" height="1350" fill="url(#${g.id})"/>` + Q.regMarks(1080, 1350, 28, th.fg, 16); })();
      s += T(m, 160, 'WITH GRATITUDE', { f: 'm', s: 24, w: 600, ls: 4, fill: th.reg === 'party' ? th.c : th.a }) + T(m, 300, ['THANK YOU', 'FOR THE LIGHT.'], { f: 'd', s: th.reg === 'party' ? 84 : 72, w: th.reg === 'party' ? 800 : 500, fill: th.fg, lh: 1.02 });
      for (let i = 0; i < n; i++) s += slot(m + (i % cols) * (cw + 30), y0 + Math.floor(i / cols) * (ch + 40), cw, ch, i, th, o);
      return s + Q.place('primary', m, 1350 - m - 40, 340, 40, { mode: th.reg === 'party' ? 'party' : 'mono', ink: th.fg, valign: 'bottom' }) + T(1080 - m, 1350 - m, 'REALITY HACK AFTERPARTY · BRU', { f: 'm', s: 18, w: 600, ls: 2, fill: th.mute, anchor: 'end' });
    } },
    { k: 'deck-cover', n: 'Sponsor deck cover', w: 1920, h: 1080, regs: ['research', 'party'], draw: (th, o) => {
      let s = th.reg === 'party' ? Q.quasar(1450, 520, 560, th, { tilt: -12, jet: 1100 }) + Q.grain(1920, 1080, 0.2) : (() => { const g = Q.gridPattern(36, th.grid, 5); return `<defs>${g.defs}</defs><rect width="1920" height="1080" fill="url(#${g.id})"/>` + Q.quasar(1450, 520, 300, th, { jet: 340, labels: true, sw: 1.8 }); })();
      s += Q.place('primary', 110, 110, 420, 50, { mode: th.reg === 'party' ? 'party' : 'mono', ink: th.fg }) + T(110, 420, 'PARTNERSHIP PROPOSAL', { f: 'm', s: 26, w: 600, ls: 4, fill: th.reg === 'party' ? th.c : th.a }) + T(110, 540, ['Season 2026–27'], { f: 'd', s: 100, w: th.reg === 'party' ? 800 : 500, fill: th.fg }) + T(110, 640, 'UnitedXR Europe · MIT Reality Hack · Sundance', { f: 't', s: 36, fill: th.mute });
      return s + T(110, 850, 'PREPARED FOR', { f: 'm', s: 22, w: 600, ls: 3, fill: th.mute }) + slot(110, 880, 420, 110, 0, th, o) + T(1810, 990, 'CONFIDENTIAL', { f: 'm', s: 20, w: 600, ls: 3, fill: th.mute, anchor: 'end' });
    } }
  ];
  const item = (v, reg) => { const th = Q.theme(reg); return { id: `sponsor-${v.k}-${reg}`, title: `${v.n} · ${reg}`, w: v.w, h: v.h, register: reg, format: 'sponsor', section: 'sponsors', dark: th.dark,
    svg: (o = {}) => Q.doc(v.w, v.h, v.draw(th, o), { bg: th.bg, transparent: o.transparent }) }; };
  QS.app('sponsors', {
    title: 'Sponsors', desc: 'Co-branded lockups, thank-you cards and a deck cover with empty partner slots.',
    lede: 'Partners supply their own logo files. Load them here (they stay on this device), and they drop into every slot in order. Empty slots show a guide in the preview and disappear on export.',
    items: () => V.flatMap((v) => v.regs.map((r) => item(v, r))),
    render(el) {
      const draw = () => {
        QS.$('#slots', el).innerHTML = Array.from({ length: 9 }, (_, i) => `<div class="drop"><span><b style="font:500 .7rem var(--m)">P${String(i + 1).padStart(2, '0')}</b> ${LOGOS[i] ? QS.esc(LOGOS[i].name) : 'empty'}</span><span class="row" style="margin:0"><button class="btn sm ghost" data-up="${i}">Load</button>${LOGOS[i] ? `<button class="btn sm ghost" data-rm="${i}">×</button>` : ''}</span></div>`).join('');
        QS.$('#spGrid', el).innerHTML = V.map((v) => `<h3 class="kick" style="margin:26px 0 12px">${v.n}</h3><div class="grid" style="--min:${v.w > v.h ? 340 : 240}px">${v.regs.map((r) => QS.card(item(v, r))).join('')}</div>`).join('');
      };
      el.innerHTML = `<div class="split"><div class="panel fgrid"><p class="kick" style="margin:0">Partner slots</p><div class="fgrid" id="slots" style="gap:6px"></div><p class="note">Use the partner's official file (SVG or PNG with transparency). Check their brand guide for clear space and on-dark versions. Never recolor or redraw a partner mark.</p></div>
        <div class="panel fgrid"><div class="field"><span>Empty slot guides</span>${QS.seg('sg', [['1', 'Show'], ['0', 'Hide']], '1')}</div><div class="field"><span>Thank-you card tier</span>${QS.seg('tier', [[1, '1 logo'], [4, '4'], [6, '6'], [9, '9']], tier)}</div>
        <p class="note">No sponsor amounts or tiers by value appear on any piece. Order logos alphabetically unless an agreement says otherwise.</p></div></div><div id="spGrid"></div>`;
      draw();
      el.addEventListener('click', async (e) => {
        const up = e.target.closest('[data-up]'); if (up) { const img = await QS.pickImage(); if (img) { LOGOS[+up.dataset.up] = img; draw(); } return; }
        const rm = e.target.closest('[data-rm]'); if (rm) { LOGOS[+rm.dataset.rm] = null; draw(); return; }
        const sg = e.target.closest('[data-seg="sg"] button'); if (sg) { showSlots = sg.dataset.v === '1'; draw(); }
        const tr = e.target.closest('[data-seg="tier"] button'); if (tr) { tier = +tr.dataset.v; draw(); }
      });
    }
  });
})();
