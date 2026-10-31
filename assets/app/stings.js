/* § Stings: logo stings, series intro/outro, transitions. Play, scrub, record. */
(function () {
  const SIZES = [['1920x1080', '16:9 · 1920×1080'], ['1280x720', '16:9 · 1280×720'], ['1080x1920', '9:16 · 1080×1920'], ['1080x1080', '1:1 · 1080²']];
  const st = { i: 0, reg: 'core', alpha: false, size: '1920x1080', fps: 30, title: '', ep: '01' };
  const opts = () => ({ reg: st.reg, alpha: st.alpha, title: st.title || undefined, ep: st.ep });
  const poster = (s, reg) => {
    const c = document.createElement('canvas'); c.width = 960; c.height = 540; const x = c.getContext('2d');
    s.draw(x, s.kind === 'Transition' ? s.dur * 0.3 : s.dur, 960, 540, { reg }); const url = c.toDataURL('image/png');
    return { id: `${s.k}-${reg}-poster`, title: `${s.n} · poster frame`, w: 960, h: 540, register: reg, format: 'video', section: 'stings', vector: false, dark: reg !== 'research', svg: () => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 960 540" width="960" height="540"><image href="${url}" width="960" height="540"/></svg>` };
  };
  QS.app('stings', {
    title: 'Stings', desc: 'Logo stings, making-of intro and outro, transitions. MP4, WebM with alpha, PNG sequence.',
    lede: 'Motion that plays in the browser and leaves as a file. Every frame is computed, so a PNG sequence is frame-exact and WebM keeps the alpha channel.',
    items: () => Q.STINGS.filter((s) => s.kind !== 'Transition').flatMap((s) => [poster(s, 'core'), poster(s, 'party'), poster(s, 'research')]),
    render(el) {
      const vt = QX.videoTypes();
      const cur = () => Q.STINGS[st.i];
      const dims = () => st.size.split('x').map(Number);
      el.innerHTML = `<div class="editor" style="grid-template-columns:minmax(0,1fr) minmax(260px,340px)">
        <div><div class="player" id="pl"><canvas id="stCanvas"></canvas><div class="scrub"><input type="range" id="scrub" min="0" max="1000" value="0" aria-label="Scrub"></div>
          <div class="bar"><b id="stName"></b><button class="btn sm ghost" id="pp">Pause</button><button class="btn sm ghost" id="rs">Restart</button></div></div>
          <div class="grid" style="--min:160px;margin-top:16px" id="stList"></div></div>
        <div class="ctl"><div class="panel fgrid">
          <div class="field"><span>Register</span>${QS.seg('sreg', [['core', 'Core'], ['research', 'Research'], ['party', 'Party']], st.reg)}</div>
          <div class="field"><span>Background</span>${QS.seg('salpha', [['0', 'Solid'], ['1', 'Alpha']], '0')}</div>
          <div class="field"><span>Frame</span>${QS.seg('ssize', SIZES, st.size)}</div>
          <div id="stFields" class="fgrid"></div></div>
          <div class="panel fgrid"><p class="kick" style="margin:0">Export</p>
            <div class="field"><span>Frame rate</span>${QS.seg('sfps', [[24, '24'], [30, '30'], [60, '60']], st.fps)}</div>
            <div class="row" style="margin:0" id="vidBtns">${vt.length ? vt.map((t) => `<button class="btn sm ${t.k === 'mp4' ? 'primary' : 'ghost'}" data-rec="${t.mime}" data-ext="${t.ext}" data-k="${t.k}">${t.label}</button>`).join('') : '<p class="note">This browser cannot record video. Use PNG sequence.</p>'}<button class="btn sm ghost" id="seqBtn">PNG sequence (ZIP)</button></div>
            <p class="note" id="recNote">Video records in real time: keep this tab visible until it finishes. WebM alpha needs “Alpha” on.</p>
            <button class="btn sm ghost" id="allBtn">Record all stings (ZIP)</button></div></div></div>`;
      const cv = QS.$('#stCanvas', el);
      const size = () => { const [w, h] = dims(); const s = Math.min(1, 1280 / Math.max(w, h)); cv.width = Math.round(w * s); cv.height = Math.round(h * s); QS.$('#pl', el).classList.toggle('alpha', st.alpha); };
      const list = () => { QS.$('#stList', el).innerHTML = Q.STINGS.map((s, i) => `<button class="tile" data-si="${i}" style="text-align:left;${i === st.i ? 'border-color:var(--q-accent)' : ''}"><span>${s.kind.toUpperCase()} · ${s.dur.toFixed(1)} S</span><b style="font-size:.82rem">${s.n}</b><p>${s.desc}</p></button>`).join(''); };
      const fields = () => { const s = cur(); QS.$('#stName', el).innerHTML = `${s.n}<small>${s.kind} · ${s.dur.toFixed(1)} s</small>`; QS.$('#stFields', el).innerHTML = (s.fields || []).map((f) => `<label class="field"><span>${f === 'ep' ? 'Episode' : s.k === 'outro' ? 'Next episode line' : 'Episode title'}</span><input data-sf="${f}" value="${QS.esc(st[f] || '')}" placeholder="${f === 'ep' ? '01' : s.k === 'outro' ? 'Episode 02 · The propinquital loop' : 'Building the seventh dimension'}"></label>`).join(''); };
      size(); list(); fields();
      const scrub = QS.$('#scrub', el); let dragging = false;
      const pl = Q.player(cv, cur, opts, (f) => { if (!dragging) scrub.value = Math.round(f * 1000); });
      QS.cleanup = () => pl.stop();
      scrub.addEventListener('input', () => { dragging = true; pl.seek(scrub.value / 1000); QS.$('#pp', el).textContent = 'Play'; });
      scrub.addEventListener('change', () => (dragging = false));
      el.addEventListener('input', (e) => { const f = e.target.dataset.sf; if (f) st[f] = e.target.value; });
      const fname = (fmt, ext) => { const [w, h] = dims(); return QX.name(`${cur().k}-${st.reg}`, fmt, `${w}x${h}`, ext); };
      const lock = (on) => QS.$$('#vidBtns button, #allBtn', el).forEach((b) => (b.disabled = on));
      el.addEventListener('click', async (e) => {
        const t = e.target.closest('button'); if (!t) return;
        const sg = t.closest('.seg'); if (sg) { const k = sg.dataset.seg, v = t.dataset.v; if (k === 'sreg') st.reg = v; if (k === 'salpha') { st.alpha = v === '1'; size(); } if (k === 'ssize') { st.size = v; size(); } if (k === 'sfps') st.fps = +v; return; }
        if (t.dataset.si != null) { st.i = +t.dataset.si; list(); fields(); pl.restart(); QS.$('#pp', el).textContent = 'Pause'; return; }
        if (t.id === 'pp') { t.textContent = pl.toggle() ? 'Play' : 'Pause'; return; }
        if (t.id === 'rs') { pl.restart(); QS.$('#pp', el).textContent = 'Pause'; return; }
        if (t.dataset.rec) {
          const [w, h] = dims(), alpha = t.dataset.k === 'webm-alpha' && st.alpha, s = cur(), ui = QX.progress('Recording ' + s.n); lock(true);
          if (t.dataset.k === 'webm-alpha' && !st.alpha) QS.toast('Alpha is off: recording with a solid background');
          try { const blob = await QX.record((ctx, tt, ww, hh) => s.draw(ctx, tt, ww, hh, Object.assign(opts(), { alpha: st.alpha && t.dataset.k !== 'mp4' })), { w, h, dur: s.dur, fps: st.fps, mime: t.dataset.rec, onProgress: (p) => ui.set(p, `${Math.round(p * s.dur * 10) / 10} / ${s.dur} s`) });
            QX.download(blob, fname(alpha ? 'webm-alpha' : t.dataset.k === 'mp4' ? 'mp4' : 'webm', t.dataset.ext)); ui.done('Saved');
          } catch (err) { ui.done('Failed: ' + err.message, true); }
          lock(false); return;
        }
        if (t.id === 'seqBtn') {
          const [w, h] = dims(), s = cur(), ui = QX.progress('PNG sequence · ' + s.n);
          try { const zip = await QX.pngSeq((ctx, tt, ww, hh) => s.draw(ctx, tt, ww, hh, opts()), { w, h, dur: s.dur, fps: st.fps, base: QX.name(`${s.k}-${st.reg}`, st.alpha ? 'png-alpha' : 'png', `${w}x${h}`, 'x').replace(/\.x$/, ''), onProgress: (p) => ui.set(p, `frame ${Math.round(p * s.dur * st.fps)} / ${Math.round(s.dur * st.fps)}`), cancel: () => ui.cancelled });
            QX.download(zip, fname(`pngseq-${st.fps}fps`, 'zip')); ui.done('Saved');
          } catch (err) { ui.done(err.message === 'cancelled' ? 'Cancelled' : 'Failed: ' + err.message, true); }
          return;
        }
        if (t.id === 'allBtn') {
          const pick = vt.find((v) => (st.alpha ? v.k === 'webm-alpha' : v.k === 'mp4')) || vt[0]; if (!pick) { QS.toast('Video recording is not available in this browser'); return; }
          const [w, h] = dims(), files = [], ui = QX.progress('Recording all stings'); lock(true);
          try { for (let i = 0; i < Q.STINGS.length; i++) { if (ui.cancelled) throw new Error('cancelled'); const s = Q.STINGS[i]; ui.set(i / Q.STINGS.length, s.n);
              const blob = await QX.record((ctx, tt, ww, hh) => s.draw(ctx, tt, ww, hh, Object.assign(opts(), { alpha: st.alpha && pick.alpha })), { w, h, dur: s.dur, fps: st.fps, mime: pick.mime });
              files.push({ name: QX.name(`${s.k}-${st.reg}`, pick.alpha && st.alpha ? 'webm-alpha' : pick.k, `${w}x${h}`, pick.ext), data: blob }); }
            QX.download(await QX.zip(files), `quasar_stings-${st.reg}_zip_${files.length}-pieces.zip`); ui.done(files.length + ' files');
          } catch (err) { ui.done(err.message === 'cancelled' ? 'Cancelled' : 'Failed: ' + err.message, true); }
          lock(false);
        }
      });
    }
  });
})();
