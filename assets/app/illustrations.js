/* § Illustrations */
(function () {
  const VAR = [['research', 'light', 'Research'], ['research', 'dark', 'Research · archive'], ['party', null, 'Party']];
  const item = (L, reg, mode) => ({ id: `illustration-${L.k}-${reg}${mode === 'dark' ? '-dark' : ''}`, title: L.n, w: 1600, h: 1200, register: reg, format: 'illustration', section: 'illustrations', dark: reg === 'party' || mode === 'dark', desc: L.desc,
    svg: (o = {}) => Q.illus(L.k, reg, mode, { transparent: o.transparent }) });
  QS.app('illustrations', {
    title: 'Illustrations', desc: 'Ten original illustrations: orbits, signal, the 7D model, Data Black Holes, party scenes.',
    lede: 'An illustration system built from the same four parts as the mark. Every illustration exists in the research register (as a numbered figure) and the party register (as light).',
    items: () => Q.ILLUS.flatMap((L) => VAR.map(([r, m]) => item(L, r, m))),
    render(el) {
      let v = 0;
      const draw = () => { const [r, m] = VAR[v]; QS.$('#ilGrid', el).innerHTML = Q.ILLUS.map((L) => `<div style="display:grid;gap:8px">${QS.card(item(L, r, m), { lazy: true })}<p class="note">${L.desc}</p></div>`).join(''); QS.lazy(el); };
      el.innerHTML = `<div class="row">${QS.seg('il', VAR.map((x, i) => [i, x[2]]), 0)}</div><div class="grid" id="ilGrid" style="--min:320px;margin-top:18px"></div>
        ${QS.section('Drawing rules', null, `<div class="grid" style="--min:240px"><div class="panel"><h3>Build from the mark</h3><p class="note" style="margin-top:6px">Ellipses at 0.24–0.36 ratio, a vertical axis, a dark core, a ring. If a shape cannot be described with those, it probably does not belong.</p></div><div class="panel"><h3>Research = figures</h3><p class="note" style="margin-top:6px">Number every figure, label in mono, one redline accent, registration marks on the corners.</p></div><div class="panel"><h3>Party = light</h3><p class="note" style="margin-top:6px">Glow, beams and dots on true black, plus grain. People are points of light, never drawn figures.</p></div></div>`)}`;
      draw();
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-seg="il"] button'); if (b) { v = +b.dataset.v; draw(); } });
    }
  });
})();
