/* § Backgrounds: meeting backgrounds in both registers */
(function () {
  const T = Q.text, W = 1920, H = 1080;
  let plate = { on: false, name: 'Firstname Lastname', role: 'Role · The Quasar Lab' };
  const nameplate = (th) => plate.on ? `<rect x="80" y="900" width="${Math.max(Q.tw(plate.name, 34, 'd', 600), Q.tw(plate.role.toUpperCase(), 16, 'm', 600, 2)) + 80}" height="110" fill="${th.bg}" opacity=".85"/>` + T(120, 950, plate.name, { f: 'd', s: 34, w: 600, fill: th.fg }) + T(120, 985, plate.role.toUpperCase(), { f: 'm', s: 16, w: 600, ls: 2, fill: th.reg === 'party' ? th.c : th.a }) : '';
  const B = [
    { k: 'paper-plate', n: 'Research · paper plate', reg: 'research', mode: 'light', draw: (th) => { const g = Q.gridPattern(36, th.grid, 5); return `<defs>${g.defs}</defs><rect width="${W}" height="${H}" fill="url(#${g.id})"/>` + Q.quasar(1620, 330, 200, th, { labels: false, jet: 220, sw: 1.6 }) + Q.place('primary', 80, 80, 400, 44, { mode: 'mono', ink: th.fg }) + T(1840, 1010, 'FIG. 00 · THE QUASAR LAB', { f: 'm', s: 16, w: 500, ls: 2, fill: th.mute, anchor: 'end' }) + Q.regMarks(W, H, 30, th.fg, 18); } },
    { k: 'archive', n: 'Research · archive', reg: 'research', mode: 'dark', draw: (th) => Q.orbits(1700, 200, 140, 40, 10, 70, th.fg, 1.2, 0.35, -10, '3 9') + Q.quasar(1700, 200, 130, th, { jet: 160, tilt: -10, sw: 1.4 }) + Q.place('primary', 80, 80, 400, 44, { mode: 'mono', ink: th.fg }) + Q.signal(80, 1010, 500, 20, th.fg, 4, 4, 0.5) },
    { k: 'seven', n: 'Research · seventh dimension', reg: 'research', mode: 'light', draw: (th) => `<g transform="translate(1180 -40) scale(.5)">${Q.ILLUS.find((x) => x.k === 'seven').draw(th).replace(/FIG\. 02[^<]*/, '')}</g>` + Q.place('primary', 80, 80, 400, 44, { mode: 'mono', ink: th.fg }) },
    { k: 'glow', n: 'Party · glow', reg: 'party', draw: (th) => Q.quasar(1720, 160, 520, th, { tilt: -16, jet: 1100 }) + Q.place('primary', 80, 80, 400, 44, { mode: 'party' }) + Q.grain(W, H, 0.2) },
    { k: 'orbits', n: 'Party · orbits', reg: 'party', draw: (th) => [th.a, th.b, th.c, th.d, th.e].map((c, i) => `<ellipse cx="960" cy="540" rx="${1050 + i * 70}" ry="${330 + i * 30}" fill="none" stroke="${c}" stroke-width="6" transform="rotate(${-14 + i * 4} 960 540)" opacity=".85"/>`).join('') + `<rect x="560" y="200" width="800" height="700" fill="#000" opacity=".0"/>` + Q.place('primary', 80, 80, 400, 44, { mode: 'party' }) + Q.grain(W, H, 0.2) },
    { k: 'minimal', n: 'Core · minimal', reg: 'core', draw: (th) => Q.mark(1700, 70, 140, { mode: 'color' }) + T(80, 1010, 'THE QUASAR LAB', { f: 'm', s: 18, w: 600, ls: 4, fill: th.mute }) }
  ];
  const item = (b) => { const th = Q.theme(b.reg, b.mode); return { id: `meeting-bg-${b.k}`, title: b.n, w: W, h: H, register: b.reg, format: 'background', section: 'backgrounds', dark: th.dark,
    svg: (o = {}) => Q.doc(W, H, b.draw(th) + nameplate(th) + (o.preview && showSafe ? `<ellipse cx="960" cy="620" rx="380" ry="460" fill="none" stroke="#00C2FF" stroke-width="3" stroke-dasharray="14 10"/>` + T(960, 140, 'YOU', { f: 'm', s: 22, w: 600, ls: 4, fill: '#00C2FF', anchor: 'middle' }) : ''), { bg: th.bg }) }; };
  let showSafe = true;
  QS.app('backgrounds', {
    title: 'Backgrounds', desc: 'Zoom and meeting backgrounds in both registers.',
    lede: 'For Zoom, Meet and Teams. The center stays quiet because that is where you are. Export PNG 1× (1920 × 1080) and set it in your video settings.',
    items: () => B.map(item),
    render(el) {
      const draw = () => { QS.$('#bgGrid', el).innerHTML = B.map((b) => QS.card(item(b))).join(''); };
      el.innerHTML = `<div class="panel fgrid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));align-items:end">
        <div class="field"><span>Person guide</span>${QS.seg('safe', [['1', 'Show'], ['0', 'Hide']], '1')}</div>
        <div class="field"><span>Name plate</span>${QS.seg('plate', [['0', 'Off'], ['1', 'On']], '0')}</div>
        <label class="field"><span>Name</span><input id="bgName" value="${QS.esc(plate.name)}"></label><label class="field"><span>Role</span><input id="bgRole" value="${QS.esc(plate.role)}"></label></div>
        <div class="grid" id="bgGrid" style="--min:340px;margin-top:20px"></div>
        <p class="note" style="margin-top:14px">Zoom mirrors your self-view only; other people see the text the right way round. Turn off “Mirror my video” if the mirrored preview bothers you.</p>`;
      draw();
      let tm;
      el.addEventListener('input', (e) => { if (e.target.id === 'bgName') plate.name = e.target.value; if (e.target.id === 'bgRole') plate.role = e.target.value; clearTimeout(tm); tm = setTimeout(draw, 150); });
      el.addEventListener('click', (e) => { const a = e.target.closest('[data-seg="safe"] button'), b = e.target.closest('[data-seg="plate"] button'); if (a) { showSafe = a.dataset.v === '1'; draw(); } if (b) { plate.on = b.dataset.v === '1'; draw(); } });
    }
  });
})();
