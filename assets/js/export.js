/* Quasar Studio · export engine: SVG with embedded fonts, PNG/JPG/WebP raster, print PDF with bleed + crop marks,
   ZIP (store), video (MP4 / WebM with alpha) and PNG sequences. No external libraries. */
(function () {
  const QX = (window.QX = {});
  const PREF_KEY = 'quasar.export.v1';
  QX.prefs = Object.assign({ scale: 2, transparent: false, bleed: 3, crop: true, jpgq: 0.92, dpi: 300 }, JSON.parse(localStorage.getItem(PREF_KEY) || '{}'));
  QX.savePrefs = () => localStorage.setItem(PREF_KEY, JSON.stringify(QX.prefs));
  QX.slug = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');
  QX.name = (piece, fmt, size, ext) => `quasar_${QX.slug(piece)}_${fmt}_${size}.${ext || fmt}`;

  /* ---------- fonts inside SVG ---------- */
  const FAM = { Unbounded: 'Unbounded', 'Space Grotesk': 'SpaceGrotesk', 'JetBrains Mono': 'JetBrainsMono' };
  QX.withFonts = (svg) => {
    const D = window.QFONTDATA || {}; let css = '';
    Object.entries(FAM).forEach(([fam, key]) => { if (svg.includes(fam) && D[key]) css += `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${D[key]}) format('woff2');font-weight:100 900;}`; });
    (window.QFONTLAB || []).forEach((F) => { if (svg.includes(F.family)) F.faces.forEach((x) => (css += `@font-face{font-family:'${F.family}';src:url(data:font/woff2;base64,${x.b64}) format('woff2');font-weight:${x.w};}`)); });
    if (!css) return svg;
    return svg.replace(/<svg([^>]*)>/, `<svg$1><defs><style>${css}</style></defs>`);
  };
  QX.svgBlob = (svg) => new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + QX.withFonts(svg)], { type: 'image/svg+xml' });

  QX.loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Image failed to render')); i.src = src; });
  QX.svgToCanvas = async (svg, W, H, bg) => {
    const url = URL.createObjectURL(new Blob([QX.withFonts(svg)], { type: 'image/svg+xml' }));
    try {
      const img = await QX.loadImg(url);
      const c = document.createElement('canvas'); c.width = Math.round(W); c.height = Math.round(H);
      const x = c.getContext('2d'); if (bg) { x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height); }
      x.drawImage(img, 0, 0, c.width, c.height); return c;
    } finally { setTimeout(() => URL.revokeObjectURL(url), 2000); }
  };
  const MAXPX = 16000, MAXAREA = 200e6;
  QX.clampScale = (w, h, s) => Math.min(s, MAXPX / w, MAXPX / h, Math.sqrt(MAXAREA / (w * h)));
  QX.canvasBlob = (c, type, q) => new Promise((res) => c.toBlob(res, type, q));
  /* raster: fmt png|jpg|webp */
  QX.raster = async (svg, w, h, scale, fmt, o = {}) => {
    const s = QX.clampScale(w, h, scale);
    const c = await QX.svgToCanvas(svg, w * s, h * s, fmt === 'jpg' ? (o.bg || '#ffffff') : null);
    return { blob: await QX.canvasBlob(c, fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png', o.q || QX.prefs.jpgq), w: c.width, h: c.height };
  };
  /* expand an svg's viewBox by `b` units on every side (bleed) */
  QX.expand = (svg, w, h, b) => svg.replace(/viewBox="[^"]*"/, `viewBox="${-b} ${-b} ${w + 2 * b} ${h + 2 * b}"`).replace(/ width="[\d.]+" height="[\d.]+"/, ` width="${w + 2 * b}" height="${h + 2 * b}"`);

  /* ---------- PDF (image based, with bleed, TrimBox, crop marks) ---------- */
  const enc = new TextEncoder();
  QX.pdf = async (svg, w, h, o = {}) => {
    const mm = o.mm || [w / 3.7795, h / 3.7795]; // fallback 96dpi
    const bleed = o.bleed != null ? o.bleed : QX.prefs.bleed, crop = o.crop != null ? o.crop : QX.prefs.crop, slug = crop ? 10 : 0;
    const unitPerMM = w / mm[0], b = bleed * unitPerMM;
    const src = bleed ? QX.expand(svg, w, h, b) : svg;
    const pw = mm[0] + 2 * bleed, ph = mm[1] + 2 * bleed;
    let dpi = o.dpi || QX.prefs.dpi; const maxSide = 9000;
    if ((Math.max(pw, ph) / 25.4) * dpi > maxSide) dpi = Math.floor(maxSide / (Math.max(pw, ph) / 25.4));
    const W = Math.round((pw / 25.4) * dpi), H = Math.round((ph / 25.4) * dpi);
    const c = await QX.svgToCanvas(src, W, H, '#ffffff');
    const jpg = new Uint8Array(await (await QX.canvasBlob(c, 'image/jpeg', 0.93)).arrayBuffer());
    const pt = (v) => (v * 72) / 25.4, f = (n) => (Math.round(n * 1000) / 1000).toString();
    const MW = pt(pw + 2 * slug), MH = pt(ph + 2 * slug), S = pt(slug), Bd = pt(bleed);
    let cs = `q ${f(pt(pw))} 0 0 ${f(pt(ph))} ${f(S)} ${f(S)} cm /Im0 Do Q\n`;
    if (crop) {
      const tx0 = S + Bd, ty0 = S + Bd, tx1 = tx0 + pt(mm[0]), ty1 = ty0 + pt(mm[1]), off = Bd + pt(2), L = pt(6);
      cs += '0.25 w 0 0 0 1 K\n';
      [[tx0, ty0], [tx1, ty0], [tx0, ty1], [tx1, ty1]].forEach(([x, y]) => {
        const sx = x === tx0 ? -1 : 1, sy = y === ty0 ? -1 : 1;
        cs += `${f(x + sx * off)} ${f(y)} m ${f(x + sx * (off + L))} ${f(y)} l S\n${f(x)} ${f(y + sy * off)} m ${f(x)} ${f(y + sy * (off + L))} l S\n`;
      });
      const info = (o.label || 'quasar') + `  ·  trim ${Math.round(mm[0])}x${Math.round(mm[1])} mm  ·  bleed ${bleed} mm  ·  ${dpi} dpi`;
      cs += `BT /F1 5 Tf 0 0 0 1 k ${f(tx0)} ${f(pt(3))} Td (${info.replace(/[()\\]/g, '').replace(/[^\x20-\x7e]/g, '-')}) Tj ET\n`;
    }
    const objs = [];
    objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
    objs[3] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${f(MW)} ${f(MH)}] /BleedBox [${f(S)} ${f(S)} ${f(S + pt(pw))} ${f(S + pt(ph))}] /TrimBox [${f(S + Bd)} ${f(S + Bd)} ${f(S + Bd + pt(mm[0]))} ${f(S + Bd + pt(mm[1]))}] /Resources << /XObject << /Im0 5 0 R >> /Font << /F1 6 0 R >> >> /Contents 4 0 R >>`;
    objs[4] = { dict: `<< /Length ${enc.encode(cs).length} >>`, data: enc.encode(cs) };
    objs[5] = { dict: `<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>`, data: jpg };
    objs[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
    objs[7] = `<< /Title (${(o.label || 'Quasar Studio').replace(/[()\\]/g, '')}) /Creator (Quasar Studio) /Producer (Quasar Studio export) >>`;
    const parts = [enc.encode('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')]; let len = parts[0].length; const xref = [];
    for (let i = 1; i < objs.length; i++) {
      xref[i] = len; const ob = objs[i];
      const head = enc.encode(`${i} 0 obj\n` + (typeof ob === 'string' ? ob + '\nendobj\n' : ob.dict + '\nstream\n'));
      parts.push(head); len += head.length;
      if (typeof ob !== 'string') { parts.push(ob.data); len += ob.data.length; const t = enc.encode('\nendstream\nendobj\n'); parts.push(t); len += t.length; }
    }
    let x = `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
    for (let i = 1; i < objs.length; i++) x += String(xref[i]).padStart(10, '0') + ' 00000 n \n';
    x += `trailer\n<< /Size ${objs.length} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${len}\n%%EOF`;
    parts.push(enc.encode(x));
    return { blob: new Blob(parts, { type: 'application/pdf' }), dpi };
  };

  /* ---------- ZIP (store) ---------- */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (u) => { let c = 0xffffffff; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  QX.zip = async (files) => {
    const out = [], cen = []; let off = 0; const d = new Date();
    const dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(), tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    for (const f of files) {
      const data = f.data instanceof Blob ? new Uint8Array(await f.data.arrayBuffer()) : typeof f.data === 'string' ? enc.encode(f.data) : f.data;
      const name = enc.encode(f.name), crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true); h.setUint16(10, tm, true); h.setUint16(12, dt, true);
      h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      out.push(new Uint8Array(h.buffer), name, data);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true); c.setUint16(12, tm, true); c.setUint16(14, dt, true);
      c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
      cen.push(new Uint8Array(c.buffer), name);
      off += 30 + name.length + data.length;
    }
    const csize = cen.reduce((a, b) => a + b.length, 0), e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csize, true); e.setUint32(16, off, true);
    return new Blob([...out, ...cen, new Uint8Array(e.buffer)], { type: 'application/zip' });
  };

  QX.download = (blob, name) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  };

  /* ---------- video ---------- */
  QX.videoTypes = () => {
    const MR = window.MediaRecorder; if (!MR) return [];
    return [
      { k: 'mp4', label: 'MP4 (H.264)', mime: 'video/mp4;codecs=avc1.640028', ext: 'mp4' },
      { k: 'mp4', label: 'MP4', mime: 'video/mp4', ext: 'mp4' },
      { k: 'webm-alpha', label: 'WebM VP9 + alpha', mime: 'video/webm;codecs=vp9', ext: 'webm', alpha: true },
      { k: 'webm-alpha', label: 'WebM VP8 + alpha', mime: 'video/webm;codecs=vp8', ext: 'webm', alpha: true },
      { k: 'webm', label: 'WebM', mime: 'video/webm', ext: 'webm' }
    ].filter((t) => MR.isTypeSupported(t.mime)).filter((t, i, a) => a.findIndex((u) => u.k === t.k) === i);
  };
  /* draw(ctx, t, w, h) is deterministic in t (seconds) */
  QX.record = (draw, o) => new Promise((res, rej) => {
    const c = document.createElement('canvas'); c.width = o.w; c.height = o.h;
    const ctx = c.getContext('2d', { alpha: true });
    const stream = c.captureStream(o.fps || 30);
    let rec; try { rec = new MediaRecorder(stream, { mimeType: o.mime, videoBitsPerSecond: o.bitrate || 16e6 }); } catch (e) { rej(e); return; }
    const chunks = []; rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => res(new Blob(chunks, { type: o.mime.split(';')[0] }));
    draw(ctx, 0, o.w, o.h); rec.start(250);
    const t0 = performance.now(), dur = o.dur;
    const tick = () => {
      const t = (performance.now() - t0) / 1000; ctx.clearRect(0, 0, o.w, o.h); draw(ctx, Math.min(t, dur), o.w, o.h);
      o.onProgress && o.onProgress(Math.min(1, t / dur));
      if (t < dur + 0.12) requestAnimationFrame(tick); else rec.stop();
    };
    requestAnimationFrame(tick);
  });
  QX.pngSeq = async (draw, o) => {
    const c = document.createElement('canvas'); c.width = o.w; c.height = o.h; const ctx = c.getContext('2d', { alpha: true });
    const n = Math.round(o.dur * o.fps), files = [];
    for (let i = 0; i <= n; i++) {
      ctx.clearRect(0, 0, o.w, o.h); draw(ctx, i / o.fps, o.w, o.h);
      files.push({ name: `${o.base}_${String(i).padStart(5, '0')}.png`, data: await QX.canvasBlob(c, 'image/png') });
      o.onProgress && o.onProgress(i / n); if (o.cancel && o.cancel()) throw new Error('cancelled');
    }
    return QX.zip(files);
  };

  /* ---------- item helpers ---------- */
  /* item: {id, title, w, h, svg(o), vector, print:{mm:[w,h], bleed}, transparent, webp, presets, register, format, section} */
  QX.sizeTag = (it, fmt, s = 1) => fmt === 'pdf' ? (it.print ? `${it.print.mm[0]}x${it.print.mm[1]}mm` : `${Math.round(it.w)}x${Math.round(it.h)}`) : fmt === 'svg' ? `${Math.round(it.w)}x${Math.round(it.h)}` : `${Math.round(it.w * s)}x${Math.round(it.h * s)}`;
  QX.render = async (it, fmt, o = {}) => {
    const scale = o.scale || 1, transparent = !!o.transparent && fmt !== 'jpg' && fmt !== 'pdf';
    const svg = it.svg({ transparent, export: true, bleed: fmt === 'pdf' });
    const base = it.id;
    if (fmt === 'svg') return { blob: QX.svgBlob(svg), name: QX.name(base, 'svg', QX.sizeTag(it, 'svg')) };
    if (fmt === 'pdf') {
      const bleed = o.bleed != null ? o.bleed : it.print ? it.print.bleed != null ? it.print.bleed : QX.prefs.bleed : 0;
      const r = await QX.pdf(svg, it.w, it.h, { mm: it.print && it.print.mm, bleed, crop: o.crop != null ? o.crop : !!it.print && QX.prefs.crop, label: base });
      return { blob: r.blob, name: QX.name(base, 'pdf', QX.sizeTag(it, 'pdf') + (bleed ? `-bleed${bleed}` : '')) };
    }
    const r = await QX.raster(svg, it.w, it.h, scale, fmt, { bg: it.bg });
    const ext = fmt === 'jpg' ? 'jpg' : fmt;
    return { blob: r.blob, name: QX.name(base, fmt + (transparent ? '-alpha' : ''), `${r.w}x${r.h}`, ext) };
  };

  /* ---------- batch ---------- */
  QX.batch = async (items, label, o = {}) => {
    const ui = QX.progress(`Building ${label}.zip`); const files = [];
    try {
      for (let i = 0; i < items.length; i++) {
        if (ui.cancelled) throw new Error('cancelled');
        const it = items[i], dir = (it.section || 'misc') + '/';
        ui.set(i / items.length, it.title);
        const s = Math.min(o.scale || 2, 4096 / Math.max(it.w, it.h));
        const png = await QX.render(it, 'png', { scale: Math.max(0.25, s), transparent: !!it.transparent });
        files.push({ name: dir + png.name, data: png.blob });
        if (it.vector !== false) { const v = await QX.render(it, 'svg'); files.push({ name: dir + v.name, data: v.blob }); }
        if (it.print && o.pdf !== false) { const p = await QX.render(it, 'pdf', { }); files.push({ name: dir + p.name, data: p.blob }); }
      }
      files.push({ name: 'README.txt', data: `Quasar Studio export · ${label}\n${window.SITE ? SITE.nome + ' ' + SITE.versao : ''}\nGenerated ${new Date().toISOString()}\n\nNaming: quasar_[piece]_[format]_[size]\nPNG at 2x (long side capped at 4096 px), SVG with embedded fonts, PDF with bleed and crop marks for print pieces.\nConfidential. Do not distribute outside the lab.\n` });
      ui.set(1, 'Compressing');
      const zip = await QX.zip(files); QX.download(zip, `quasar_${QX.slug(label)}_zip_${items.length}-pieces.zip`);
      ui.done(`${files.length - 1} files`);
    } catch (e) { ui.done(e.message === 'cancelled' ? 'Cancelled' : 'Error: ' + e.message, true); }
  };
  QX.progress = (title) => {
    const el = document.createElement('div'); el.className = 'qprog';
    el.innerHTML = `<div class="qprog-t">${title}</div><div class="qprog-s">Starting…</div><div class="qprog-bar"><i></i></div><button class="btn sm ghost">Cancel</button>`;
    document.body.appendChild(el); const st = { cancelled: false };
    el.querySelector('button').onclick = () => (st.cancelled = true);
    st.set = (p, s) => { el.querySelector('i').style.width = Math.round(p * 100) + '%'; el.querySelector('.qprog-s').textContent = s || ''; };
    st.done = (msg, err) => { el.classList.add(err ? 'err' : 'ok'); el.querySelector('.qprog-s').textContent = msg; el.querySelector('i').style.width = '100%'; el.querySelector('button').remove(); setTimeout(() => el.remove(), 2600); };
    return st;
  };

  /* ---------- export dialog ---------- */
  QX.open = (it) => {
    if (!it) return;
    const P = QX.prefs, fmts = ['png', 'jpg'];
    if (it.webp) fmts.push('webp');
    if (it.vector !== false) fmts.push('svg');
    fmts.push('pdf');
    const st = { fmt: it.print ? 'pdf' : 'png', scale: P.scale, transparent: it.transparent ? true : P.transparent, bleed: it.print ? (it.print.bleed != null ? it.print.bleed : P.bleed) : 0, crop: !!it.print && P.crop, preset: null };
    const dlg = document.createElement('div'); dlg.className = 'qdlg'; dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-label', 'Export ' + it.title);
    const draw = () => {
      const w = st.preset ? st.preset.w : it.w * st.scale, h = st.preset ? st.preset.h : it.h * st.scale;
      const nm = st.fmt === 'svg' ? QX.name(it.id, 'svg', QX.sizeTag(it, 'svg')) : st.fmt === 'pdf' ? QX.name(it.id, 'pdf', QX.sizeTag(it, 'pdf') + (st.bleed ? '-bleed' + st.bleed : '')) : QX.name(it.id, st.fmt + (st.transparent && st.fmt !== 'jpg' ? '-alpha' : ''), `${Math.round(w)}x${Math.round(h)}`, st.fmt);
      const raster = ['png', 'jpg', 'webp'].includes(st.fmt), alphaOK = ['png', 'webp', 'svg'].includes(st.fmt);
      dlg.innerHTML = `<div class="qdlg-card"><div class="qdlg-prev ${st.transparent && alphaOK ? 'checker' : ''}">${it.svg({ transparent: st.transparent && alphaOK, preview: true })}</div>
      <div class="qdlg-side"><p class="kick">Export</p><h3>${it.title}</h3><p class="meta">${it.print ? `${it.print.mm[0]} × ${it.print.mm[1]} mm` : `${Math.round(it.w)} × ${Math.round(it.h)} px`}${it.register ? ' · ' + it.register : ''}</p>
      <div class="qfield"><span>Format</span><div class="seg">${fmts.map((f) => `<button data-fmt="${f}" aria-pressed="${st.fmt === f}">${f.toUpperCase()}</button>`).join('')}</div></div>
      ${raster ? `<div class="qfield"><span>Size</span><div class="seg">${[1, 2, 4].map((s) => `<button data-scale="${s}" aria-pressed="${!st.preset && st.scale === s}">${s}×</button>`).join('')}${(it.presets || []).map((p, i) => `<button data-preset="${i}" aria-pressed="${st.preset === it.presets[i]}">${p.label}</button>`).join('')}</div></div>` : ''}
      ${alphaOK ? `<label class="qcheck"><input type="checkbox" data-alpha ${st.transparent ? 'checked' : ''}> Transparent background</label>` : ''}
      ${st.fmt === 'pdf' ? `<div class="qfield"><span>Bleed (mm)</span><div class="seg">${[0, 3, 5, 10, 25, 50].map((b) => `<button data-bleed="${b}" aria-pressed="${st.bleed === b}">${b}</button>`).join('')}</div></div><label class="qcheck"><input type="checkbox" data-crop ${st.crop ? 'checked' : ''}> Crop marks + slug line</label><p class="note">PDF is raster at up to ${P.dpi} dpi inside a print-ready page box (TrimBox and BleedBox set). For vector print, send the SVG.</p>` : ''}
      ${st.fmt === 'svg' ? '<p class="note">Fonts are embedded in the file. Open in Illustrator, Figma or Inkscape.</p>' : ''}
      <div class="qname"><span>File</span><code>${nm}</code></div>
      <div class="row"><button class="btn primary" data-go>Download</button><button class="btn ghost" data-close>Close</button></div></div></div>`;
    };
    draw(); document.body.appendChild(dlg);
    const close = () => { dlg.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = (e) => e.key === 'Escape' && close(); document.addEventListener('keydown', onKey);
    dlg.addEventListener('click', async (e) => {
      const b = e.target.closest('button,input'); if (e.target === dlg) return close(); if (!b) return;
      if (b.dataset.fmt) { st.fmt = b.dataset.fmt; if (st.fmt === 'pdf' && !it.print) st.bleed = 0; }
      else if (b.dataset.scale) { st.scale = +b.dataset.scale; st.preset = null; P.scale = st.scale; QX.savePrefs(); }
      else if (b.dataset.preset) st.preset = it.presets[+b.dataset.preset];
      else if (b.hasAttribute('data-alpha')) st.transparent = b.checked;
      else if (b.dataset.bleed) st.bleed = +b.dataset.bleed;
      else if (b.hasAttribute('data-crop')) st.crop = b.checked;
      else if (b.hasAttribute('data-close')) return close();
      else if (b.hasAttribute('data-go')) {
        b.disabled = true; b.textContent = 'Rendering…';
        try {
          const scale = st.preset ? st.preset.w / it.w : st.scale;
          const r = await QX.render(it, st.fmt, { scale, transparent: st.transparent, bleed: st.bleed, crop: st.crop });
          QX.download(r.blob, r.name); b.textContent = 'Downloaded ✓';
        } catch (err) { b.textContent = 'Failed: ' + err.message; }
        setTimeout(() => { b.disabled = false; b.textContent = 'Download'; }, 1800); return;
      } else return;
      draw();
    });
    setTimeout(() => dlg.querySelector('[data-go]').focus(), 30);
  };
})();
