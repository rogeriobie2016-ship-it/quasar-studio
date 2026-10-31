/* § Create: template editor with live preview */
(function () {
  const KEY = 'quasar.create.v1';
  const LABEL = { eyebrow: 'Eyebrow', title: 'Title', body: 'Body', date: 'Date', place: 'Place', name: 'Name', role: 'Role', quote: 'Quote', cite: 'Attribution', cta: 'Call to action', names: 'Panelists (one per line: Name — Role)', num: 'Number', tag: 'Task tag', photo: 'Photo' };
  const LONG = { body: 1, quote: 1, names: 1, title: 1 };
  QS.app('create', {
    title: 'Create', desc: 'Template editor: posts, stories, slides, speaker cards, panel titles, lower thirds, quotes, announcements.',
    lede: 'Pick a template, write, switch register. The preview is the file: what you see is what exports.',
    items: () => { const st = JSON.parse(localStorage.getItem(KEY) || '{}'); return Q.TPL.flatMap((t) => ['research', 'party'].map((r) => Q.tplItem(t.k, st.d || {}, r, 'light', { section: 'create' }))); },
    render(el) {
      const st = Object.assign({ k: 'post-square', reg: 'party', mode: 'light', d: {} }, JSON.parse(localStorage.getItem(KEY) || '{}'));
      const save = () => { const c = Object.assign({}, st, { d: Object.assign({}, st.d, { photo: null }) }); localStorage.setItem(KEY, JSON.stringify(c)); };
      const val = (f) => (st.d[f] != null ? st.d[f] : Q.TPL_DEFAULTS[f]);
      const fields = () => {
        const t = Q.TPL.find((x) => x.k === st.k);
        return t.f.map((f) => {
          if (f === 'tag') return `<label class="field"><span>${LABEL[f]}</span><select data-f="tag"><option value="">None</option>${Q.PAL.semantic.map((s) => `<option value="${s.k}" ${val('tag') === s.k ? 'selected' : ''}>${s.n}</option>`).join('')}</select></label>`;
          if (f === 'photo') return `<div class="drop"><span>${st.d.photo ? 'Photo loaded (stays on this device)' : 'No photo. Placeholder shown.'}</span><span class="row" style="margin:0"><button class="btn sm ghost" data-photo>Choose</button>${st.d.photo ? '<button class="btn sm ghost" data-nophoto>Clear</button>' : ''}</span></div>`;
          return `<label class="field"><span>${LABEL[f]}</span>${LONG[f] ? `<textarea data-f="${f}" rows="${f === 'names' ? 4 : 2}">${QS.esc(val(f))}</textarea>` : `<input data-f="${f}" value="${QS.esc(val(f))}">`}</label>`;
        }).join('');
      };
      const item = () => Q.tplItem(st.k, st.d, st.reg, st.mode, { id: `${st.k}-${st.reg}${st.reg === 'research' && st.mode === 'dark' ? '-dark' : ''}` });
      const paint = () => { const it = QS.add(item()); QS.$('#stage', el).innerHTML = it.svg({ preview: true }); QS.$('#stage', el).classList.toggle('checker', !!it.transparent); QS.$('#expBtn', el).dataset.exp = it.id; save(); };
      const ctl = () => {
        QS.$('#ctl', el).innerHTML = `
          <div class="field"><span>Template</span><div class="tpl-list">${Q.TPL.map((t) => `<button data-k="${t.k}" aria-pressed="${t.k === st.k}">${t.n}<small>${t.s}</small></button>`).join('')}</div></div>
          <div class="field"><span>Register</span>${QS.seg('reg', [['research', 'Research'], ['party', 'Party']], st.reg)}</div>
          ${st.reg === 'research' ? `<div class="field"><span>Ground</span>${QS.seg('mode', [['light', 'Paper'], ['dark', 'Archive']], st.mode)}</div>` : ''}
          <div class="fgrid">${fields()}</div>
          <div class="row" style="margin:0"><button class="btn primary" id="expBtn" data-exp="">Export…</button><button class="btn ghost" id="resetBtn">Reset text</button></div>
          <p class="note">Text is saved on this device only. Photos are never stored or uploaded.</p>`;
        paint();
      };
      el.innerHTML = `<div class="editor"><div class="ctl" id="ctl"></div><div><div class="stage" id="stage"></div><p class="note" style="margin-top:10px">Tip: every template has both registers. Write once, then flip Research / Party to get the pair.</p></div></div>`;
      ctl();
      let tm;
      el.addEventListener('input', (e) => { const f = e.target.dataset.f; if (!f) return; st.d[f] = e.target.value; clearTimeout(tm); tm = setTimeout(paint, 80); });
      el.addEventListener('change', (e) => { if (e.target.dataset.f === 'tag') { st.d.tag = e.target.value; paint(); } });
      el.addEventListener('click', async (e) => {
        const k = e.target.closest('.tpl-list [data-k]'); if (k) { st.k = k.dataset.k; ctl(); return; }
        const r = e.target.closest('[data-seg="reg"] button'); if (r) { st.reg = r.dataset.v; ctl(); return; }
        const m = e.target.closest('[data-seg="mode"] button'); if (m) { st.mode = m.dataset.v; paint(); return; }
        if (e.target.closest('[data-photo]')) { const img = await QS.pickImage(); if (img) { st.d.photo = img.src; ctl(); } return; }
        if (e.target.closest('[data-nophoto]')) { st.d.photo = null; ctl(); return; }
        if (e.target.id === 'resetBtn') { st.d = {}; ctl(); }
      });
    }
  });
})();
