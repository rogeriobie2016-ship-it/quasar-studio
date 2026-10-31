/* § Export: defaults, browser capabilities, batch ZIPs per section */
QS.app('export', {
  title: 'Export', desc: 'Export defaults, format guide, browser capabilities and one-click ZIPs for every section.',
  lede: 'Every piece in the studio exports from its own card. This page sets the defaults and builds the batch downloads.',
  render(el) {
    const P = QX.prefs, vt = QX.videoTypes(), webp = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
    const secs = QS.ORDER.flatMap((g) => g[1]).filter((k) => QS.apps[k] && QS.apps[k].items);
    el.innerHTML = `
      ${QS.section('Defaults', 'Saved on this device. Every export dialog opens with these.', `<div class="panel fgrid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        <div class="field"><span>PNG / JPG size</span>${QS.seg('scale', [[1, '1×'], [2, '2×'], [4, '4×']], P.scale)}</div>
        <div class="field"><span>Background</span>${QS.seg('alpha', [['0', 'Solid'], ['1', 'Transparent']], P.transparent ? '1' : '0')}</div>
        <div class="field"><span>Print bleed</span>${QS.seg('bleed', [[0, '0'], [3, '3 mm'], [5, '5 mm'], [10, '10 mm']], P.bleed)}</div>
        <div class="field"><span>Crop marks</span>${QS.seg('crop', [['1', 'On'], ['0', 'Off']], P.crop ? '1' : '0')}</div>
        <div class="field"><span>PDF resolution</span>${QS.seg('dpi', [[150, '150 dpi'], [300, '300 dpi']], P.dpi)}</div>
        <div class="field"><span>JPG quality</span>${QS.seg('jpgq', [[0.8, '80'], [0.92, '92'], [1, '100']], P.jpgq)}</div></div>`)}
      ${QS.section('This browser', 'Video and WebP support depend on the browser. Chrome and Edge support everything below.', `<div class="grid" style="--min:200px">
        ${[['MP4 (H.264)', vt.some((t) => t.k === 'mp4')], ['WebM with alpha', vt.some((t) => t.k === 'webm-alpha')], ['PNG sequence', true], ['WebP stickers', webp], ['ZIP batches', true], ['PDF with bleed', true]].map(([n, ok]) => `<div class="panel" style="display:flex;justify-content:space-between;align-items:center"><b style="font-weight:500">${n}</b><span class="tag" style="color:${ok ? '#4FD48D' : '#FF6B70'};border-color:currentColor">${ok ? 'Ready' : 'Not here'}</span></div>`).join('')}</div>`)}
      ${QS.section('Batch downloads', 'One ZIP per section: PNG at 2× (long side capped at 4096 px), SVG with embedded fonts, and print PDFs with bleed where the piece is for print.', `<div class="wrap-x"><table class="tbl"><tr><th>Section</th><th>Pieces</th><th></th></tr>${secs.map((k) => `<tr><td><a href="#/${k}">${QS.apps[k].title}</a></td><td><code>${QS.apps[k].items().length}</code></td><td style="text-align:right">${QS.zipBtn(k, '')}</td></tr>`).join('')}</table></div>
        <div class="row"><a class="btn ghost sm" href="#/stings">Video ZIPs live in Stings</a></div>`)}
      ${QS.section('Which format', null, `<div class="wrap-x"><table class="tbl"><tr><th>Format</th><th>Use</th><th>Notes</th></tr>
        <tr><td><b>SVG</b></td><td>Print vendors, designers, anything that scales</td><td>Fonts embedded. Grain and glow use SVG filters: rasterize at the vendor if their RIP chokes.</td></tr>
        <tr><td><b>PNG</b></td><td>Social, slides, web, messaging stickers</td><td>Transparent option. 1× for upload, 2× for slides, 4× for large screens.</td></tr>
        <tr><td><b>JPG</b></td><td>Email, places that reject PNG</td><td>No transparency.</td></tr>
        <tr><td><b>PDF</b></td><td>Print</td><td>Image at up to 300 dpi inside a page with BleedBox and TrimBox, crop marks and a slug line. Large formats are capped at about 9000 px on the long side (around 115 dpi for a 2 m banner), which is right for viewing distance.</td></tr>
        <tr><td><b>MP4</b></td><td>Social video, presentations</td><td>No alpha.</td></tr>
        <tr><td><b>WebM + alpha</b></td><td>Overlays in editors and OBS</td><td>Chromium only. For Premiere/Final Cut, use PNG sequence or convert to ProRes 4444 (README has the command).</td></tr>
        <tr><td><b>PNG sequence</b></td><td>Any editor, frame-exact</td><td>ZIP of numbered frames, alpha preserved.</td></tr></table></div>`)}`;
    el.addEventListener('click', (e) => {
      const b = e.target.closest('.seg[data-seg] button'); if (!b) return; const k = b.parentNode.dataset.seg, v = b.dataset.v;
      if (k === 'scale') P.scale = +v; if (k === 'alpha') P.transparent = v === '1'; if (k === 'bleed') P.bleed = +v; if (k === 'crop') P.crop = v === '1'; if (k === 'dpi') P.dpi = +v; if (k === 'jpgq') P.jpgq = +v;
      QX.savePrefs(); QS.toast('Default saved');
    });
  }
});
