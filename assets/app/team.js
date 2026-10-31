/* § Team: ID cards and LinkedIn banners. Names and roles are placeholders; photos stay in memory only. */
(function () {
  const T = Q.text, KEY = 'quasar.team.v1';
  const DEF = [{ name: 'Firstname Lastname', role: 'Role · Research' }, { name: 'Firstname Lastname', role: 'Role · Design' }, { name: 'Firstname Lastname', role: 'Role · Production' }];
  const PHOTOS = [];
  const load = () => JSON.parse(localStorage.getItem(KEY) || 'null') || DEF.map((x) => Object.assign({}, x));
  let kind = 'research';
  const photo = (i, x, y, w, h, th) => {
    const p = PHOTOS[i], id = Q.uid('tp');
    if (p) return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><image href="${p}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${th.dark ? '#1a1520' : '#E2D7C4'}" stroke="${th.fg}" stroke-dasharray="6 6" stroke-width="2"/>` + T(x + w / 2, y + h / 2 + 8, 'PHOTO', { f: 'm', s: 20, w: 600, ls: 4, fill: th.mute, anchor: 'middle' });
  };
  const idCard = (m, i, reg) => {
    const th = Q.theme(reg), W = 540, H = 856;
    return { id: `id-card-${reg}-${String(i + 1).padStart(2, '0')}`, title: `ID card · ${reg} · ${String(i + 1).padStart(2, '0')}`, w: W, h: H, register: reg, format: 'print', section: 'team', print: { mm: [54, 85.6], bleed: 2 }, dark: th.dark,
      svg: () => {
        let s;
        if (reg === 'research') {
          const nf = Q.fit(m.name, 40, 460, 2, 'd', 600, -0.01);
          s = `<rect width="${W}" height="120" fill="${th.fg}"/>` + Q.place('primary', 40, 40, 380, 40, { mode: 'mono', ink: th.bg, valign: 'middle' }) + photo(i, 40, 160, 220, 270, th) +
            T(290, 190, 'LAB MEMBER', { f: 'm', s: 16, w: 600, ls: 2.4, fill: th.a }) + T(290, 230, ['ID', `QL-${String(i + 1).padStart(4, '0')}`], { f: 'm', s: 16, w: 500, ls: 1.6, fill: th.mute, lh: 1.5 }) + T(290, 330, ['VALID', '2026–27'], { f: 'm', s: 16, w: 500, ls: 1.6, fill: th.mute, lh: 1.5 }) +
            T(40, 510, nf.lines, { f: 'd', s: nf.size, w: 600, fill: th.fg, lh: 1.08, ls: -0.01 * nf.size }) + T(40, 520 + nf.lines.length * nf.size * 1.08, Q.wrap(m.role.toUpperCase(), 18, 460, 'm', 500, 1.8).slice(0, 2), { f: 'm', s: 18, w: 500, ls: 1.8, fill: th.a, lh: 1.5 }) +
            Q.signal(40, 700, 460, 70, th.fg, i + 3, 10, 1) + T(40, 810, 'THE QUASAR LAB · RESEARCH + DESIGN', { f: 'm', s: 14, w: 500, ls: 1.6, fill: th.mute }) + Q.regMarks(W, H, 14, th.fg, 10);
        } else {
          const nf = Q.fit(m.name.toUpperCase(), 44, 460, 2, 'd', 800, -0.02);
          s = Q.quasar(400, 170, 260, th, { tilt: -14, jet: 500 }) + T(40, 80, 'AFTERPARTY · BRU 12.2026', { f: 'm', s: 16, w: 700, ls: 2.4, fill: th.c }) + T(36, 420, 'CREW', { f: 'd', s: 150, w: 800, fill: th.c, ls: -4 }) + photo(i, 40, 460, 150, 180, th) +
            T(210, 500, nf.lines, { f: 'd', s: Math.min(nf.size, 34), w: 800, fill: th.fg, lh: 1.05 }) + T(210, 520 + nf.lines.length * 36, Q.wrap(m.role.toUpperCase(), 15, 290, 'm', 600, 1.5).slice(0, 3), { f: 'm', s: 15, w: 600, ls: 1.5, fill: th.a, lh: 1.5 }) +
            `<rect x="40" y="690" width="460" height="56" rx="28" fill="${th.a}"/>` + T(270, 727, 'ALL ACCESS', { f: 'm', s: 22, w: 800, ls: 4, fill: '#000', anchor: 'middle' }) + Q.place('primary', 40, 780, 300, 32, { mode: 'party' }) + Q.grain(W, H, 0.2);
        }
        return Q.doc(W, H, s, { bg: th.bg });
      } };
  };
  const banner = (reg) => {
    const th = Q.theme(reg), W = 1584, H = 396;
    return { id: `linkedin-banner-${reg}`, title: `LinkedIn banner · ${reg}`, w: W, h: H, register: reg, format: 'social', section: 'team', dark: th.dark,
      svg: (o = {}) => Q.doc(W, H, (reg === 'research' ? (() => { const g = Q.gridPattern(24, th.grid, 5); return `<defs>${g.defs}</defs><rect width="${W}" height="${H}" fill="url(#${g.id})"/>` + Q.quasar(1340, 200, 150, th, { jet: 170, sw: 1.5 }) + Q.regMarks(W, H, 18, th.fg, 12); })() : Q.quasar(1250, 140, 380, th, { tilt: -12, jet: 700 }) + Q.grain(W, H, 0.2)) +
        Q.place('primary', 600, 80, 520, 54, { mode: reg === 'party' ? 'party' : 'mono', ink: th.fg }) + T(600, 210, Q.wrap('Research and design for the people systems were not designed for.', 30, 560, 'd', 500), { f: 'd', s: 30, w: 500, fill: th.fg, lh: 1.15 }) + T(600, 330, 'MIT 2018 · USC MEDIA ARTS + PRACTICE', { f: 'm', s: 15, w: 600, ls: 2, fill: reg === 'party' ? th.c : th.a }) +
        (o.preview ? `<rect x="0" y="0" width="568" height="${H}" fill="#00C2FF" opacity=".08"/><circle cx="210" cy="300" r="150" fill="none" stroke="#00C2FF" stroke-dasharray="8 8" stroke-width="2"/>` + T(210, 120, 'AVATAR ZONE', { f: 'm', s: 16, w: 600, ls: 3, fill: '#00C2FF', anchor: 'middle' }) : ''), { bg: th.bg }) };
  };
  QS.app('team', {
    title: 'Team', desc: 'ID cards (CR80) and LinkedIn banners with name and role fields.',
    lede: 'Lab member cards for the research side, crew passes for the party. Edit the list, add photos, export one or the whole team as a ZIP.',
    items: () => [...load().flatMap((m, i) => [idCard(m, i, 'research'), idCard(m, i, 'party')]), banner('research'), banner('party')],
    render(el) {
      let team = load();
      const save = () => localStorage.setItem(KEY, JSON.stringify(team));
      const rows = () => { QS.$('#teamList', el).innerHTML = team.map((m, i) => `<div class="r"><input data-i="${i}" data-k="name" value="${QS.esc(m.name)}" aria-label="Name ${i + 1}"><input data-i="${i}" data-k="role" value="${QS.esc(m.role)}" aria-label="Role ${i + 1}"><span class="row" style="margin:0;gap:4px;flex-wrap:nowrap"><button class="btn sm ghost" data-ph="${i}">${PHOTOS[i] ? 'Photo ✓' : 'Photo'}</button><button class="btn sm ghost" data-del="${i}" aria-label="Remove">×</button></span></div>`).join(''); };
      const cards = () => { QS.$('#idGrid', el).innerHTML = team.map((m, i) => QS.card(idCard(m, i, kind))).join(''); };
      el.innerHTML = `<div class="split"><div class="panel fgrid"><p class="kick" style="margin:0">Team list</p><div class="list-ed" id="teamList"></div><div class="row" style="margin:0"><button class="btn sm ghost" id="addM">Add person</button><button class="btn sm ghost" id="resetM">Reset to placeholders</button></div><p class="note">Names and roles only. No IDs, birthdays, health or contact details on any card. Photos are never saved.</p></div>
        <div class="panel fgrid"><div class="field"><span>Card type</span>${QS.seg('kind', [['research', 'Lab member'], ['party', 'Crew pass']], kind)}</div><div class="spec"><span><b>Size</b> CR80 · 54 × 85.6 mm portrait · 2 mm bleed</span><span><b>Print</b> PVC card printer or 350 gsm + laminate</span><span><b>Lanyard</b> slot punch at top center, keep 8 mm clear</span></div><button class="btn sm primary" data-zip="team">Download all cards + banners (ZIP)</button></div></div>
        <div class="grid" id="idGrid" style="--min:180px;margin-top:20px"></div>
        ${QS.section('LinkedIn banners', '1584 × 396. The blue zone is covered by the profile photo on desktop and mobile; nothing lives there.', `<div class="grid" style="--min:420px">${QS.card(banner('research'))}${QS.card(banner('party'))}</div>`)}`;
      rows(); cards();
      let tm;
      el.addEventListener('input', (e) => { const i = e.target.dataset.i; if (i == null) return; team[+i][e.target.dataset.k] = e.target.value; save(); clearTimeout(tm); tm = setTimeout(cards, 150); });
      el.addEventListener('click', async (e) => {
        const ph = e.target.closest('[data-ph]'); if (ph) { const img = await QS.pickImage(); if (img) { PHOTOS[+ph.dataset.ph] = img.src; rows(); cards(); } return; }
        const del = e.target.closest('[data-del]'); if (del) { team.splice(+del.dataset.del, 1); PHOTOS.splice(+del.dataset.del, 1); save(); rows(); cards(); return; }
        if (e.target.id === 'addM') { team.push({ name: 'Firstname Lastname', role: 'Role' }); save(); rows(); cards(); }
        if (e.target.id === 'resetM') { team = DEF.map((x) => Object.assign({}, x)); PHOTOS.length = 0; save(); rows(); cards(); }
        const k = e.target.closest('[data-seg="kind"] button'); if (k) { kind = k.dataset.v; cards(); }
      });
    }
  });
})();
