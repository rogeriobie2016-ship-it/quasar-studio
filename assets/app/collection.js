/* § Collection: every finished piece in one filterable gallery */
QS.app('collection', {
  title: 'Collection', desc: 'Gallery of every finished piece, filterable by register and format.',
  lede: 'Everything the studio has made, in one place. Filter, click, export.',
  render(el) {
    const srcs = QS.ORDER.flatMap((g) => g[1]).filter((k) => k !== 'collection' && QS.apps[k] && QS.apps[k].items);
    const seen = {}, all = [];
    srcs.forEach((k) => QS.apps[k].items().forEach((it) => { if (!seen[it.id]) { seen[it.id] = 1; it.section = it.section || k; all.push(it); } }));
    const fmts = ['all', ...new Set(all.map((i) => i.format).filter(Boolean))];
    const st = { reg: 'all', fmt: 'all' }; let io;
    const draw = () => {
      const list = all.filter((i) => (st.reg === 'all' || i.register === st.reg) && (st.fmt === 'all' || i.format === st.fmt));
      QS.$('#colCount', el).textContent = `${list.length} pieces`;
      QS.$('#colGrid', el).innerHTML = list.map((i) => QS.card(i, { lazy: true })).join('');
      if (io) io.disconnect(); io = QS.lazy(el);
      QS.$('#colZip', el).onclick = () => QX.batch(list, `collection-${st.reg}-${st.fmt}`);
    };
    el.innerHTML = `<div class="panel" style="display:grid;gap:12px"><div class="field"><span>Register</span>${QS.seg('creg', [['all', 'All'], ['research', 'Research'], ['party', 'Party'], ['core', 'Core']], 'all')}</div>
      <div class="field"><span>Format</span>${QS.seg('cfmt', fmts.map((f) => [f, f]), 'all')}</div>
      <div class="row" style="margin:0"><span class="tag" id="colCount"></span><button class="btn sm ghost" id="colZip">Download this selection (ZIP)</button><a class="btn sm ghost" href="#/stings">Video pieces → Stings</a></div></div>
      <div class="grid" id="colGrid" style="--min:220px;margin-top:20px"></div>`;
    draw();
    el.addEventListener('click', (e) => { const a = e.target.closest('[data-seg="creg"] button'), b = e.target.closest('[data-seg="cfmt"] button'); if (a) { st.reg = a.dataset.v; draw(); } if (b) { st.fmt = b.dataset.v; draw(); } });
    QS.cleanup = () => io && io.disconnect();
  }
});
