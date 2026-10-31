/* § Pieces: the catalog of every piece type, its specs and its file name */
(function () {
  const ROWS = [
    ['Social', 'Post · square', '1080 × 1080 px', '—', '60 px', 'PNG, JPG, SVG', 'create', 'post-square'],
    ['Social', 'Post · 4:5', '1080 × 1350 px', '—', '60 px', 'PNG, JPG, SVG', 'create', 'post-45'],
    ['Social', 'Story / Reel cover · 9:16', '1080 × 1920 px', '—', 'top 250 · bottom 340 px', 'PNG, JPG, SVG', 'create', 'story'],
    ['Talks', 'Slide · 16:9', '1920 × 1080 px', '—', '96 px', 'PNG, SVG, PDF', 'create', 'slide'],
    ['Talks', 'Speaker card', '1080 × 1350 px', '—', '72 px', 'PNG, JPG, SVG', 'create', 'speaker'],
    ['Talks', 'Panel title', '1920 × 1080 px', '—', '96 px', 'PNG, SVG', 'create', 'panel-title'],
    ['Video', 'Lower third (GC)', '1920 × 1080 px, alpha', '—', 'title-safe 10%', 'PNG alpha, SVG', 'create', 'lower-third'],
    ['Social', 'Quote card', '1080 × 1080 px', '—', '72 px', 'PNG, JPG, SVG', 'create', 'quote'],
    ['Social', 'Event announcement', '1080 × 1350 px', '—', '72 px', 'PNG, JPG, SVG', 'create', 'announce'],
    ['Video', 'Logo stings', '1920 × 1080 / 1080 × 1920 / 1080²', '—', '—', 'MP4, WebM alpha, PNG seq', 'stings', 'ignition'],
    ['Video', 'Series intro / outro', '1920 × 1080', '—', '—', 'MP4, WebM alpha, PNG seq', 'stings', 'intro'],
    ['Video', 'Transitions', '1920 × 1080', '—', '—', 'WebM alpha, PNG seq', 'stings', 'jet-wipe'],
    ['Assets', 'Illustrations', '1600 × 1200 px', '—', '—', 'SVG, PNG', 'illustrations', 'seven'],
    ['Stickers', 'Sticker sheet (print)', 'A4 · 210 × 297 mm', '3 mm', '5 mm', 'PDF, SVG', 'stickers', 'sheet'],
    ['Stickers', 'Messaging stickers', '512 × 512 (WhatsApp), 320 (Discord), 128 (Slack)', '—', '16 px', 'PNG alpha, WebP', 'stickers', 'single'],
    ['Merch', 'Enamel pin', '25–30 mm', '—', 'metal line ≥ 0.3 mm', 'SVG + spec PDF', 'merch', 'pin'],
    ['Merch', 'Wristband', '250 × 25 mm', '2 mm', '3 mm', 'PDF, SVG', 'merch', 'wristband'],
    ['Merch', 'Tote (1-color screenprint)', '280 × 300 mm print area', '—', '10 mm', 'SVG, PDF', 'merch', 'tote'],
    ['Merch', 'Lanyard', '20 × 900 mm', '2 mm', '2 mm', 'PDF, SVG', 'merch', 'lanyard'],
    ['Merch', 'Poster', 'A2 · 420 × 594 mm', '3 mm', '10 mm', 'PDF, SVG', 'merch', 'poster'],
    ['Merch', 'Photo backdrop (step & repeat)', '3000 × 2400 mm', '50 mm', '100 mm', 'PDF, SVG', 'merch', 'backdrop'],
    ['Signage', 'Roll-up banner', '850 × 2000 mm', '5 mm (+150 mm base)', '30 mm', 'PDF', 'panels', 'rollup'],
    ['Signage', 'Booth back wall', '3000 × 2400 mm (confirm with organizer)', '20 mm', '80 mm', 'PDF', 'panels', 'backwall'],
    ['Signage', 'Hanging banner', '2000 × 1000 mm', '20 mm', '60 mm', 'PDF', 'panels', 'hanging'],
    ['Signage', 'Table front', '1800 × 750 mm', '10 mm', '40 mm', 'PDF', 'panels', 'table'],
    ['Sponsors', 'Co-branded lockup', 'vector', '—', 'clear space X', 'SVG, PNG alpha', 'sponsors', 'lockup'],
    ['Sponsors', 'Thank-you card', '1080 × 1350 px', '—', '72 px', 'PNG, SVG', 'sponsors', 'thanks'],
    ['Sponsors', 'Deck cover', '1920 × 1080 px', '—', '96 px', 'PNG, PDF', 'sponsors', 'deck'],
    ['Team', 'ID card (CR80)', '54 × 85.6 mm', '2 mm', '3 mm', 'PDF, PNG', 'team', 'id'],
    ['Team', 'LinkedIn banner', '1584 × 396 px', '—', 'left 568 px (avatar)', 'PNG, JPG', 'team', 'linkedin'],
    ['Backgrounds', 'Meeting background', '1920 × 1080 px', '—', 'center 40% kept quiet', 'PNG, JPG', 'backgrounds', 'zoom']
  ];
  QS.app('pieces', {
    title: 'Pieces', desc: 'The catalog: every piece type with size, bleed, safe area, formats and file name.',
    lede: 'Every piece the studio produces, with its spec. If a size is not on this list, ask before inventing one.',
    render(el) {
      const cats = ['All', ...new Set(ROWS.map((r) => r[0]))];
      const th = Q.theme('party'), sty = (() => { const W = 1080, H = 1920; return Q.doc(W, H, `<rect width="${W}" height="${H}" fill="#14111A"/><rect y="0" width="${W}" height="250" fill="#FF2E88" opacity=".35"/><rect y="${H - 340}" width="${W}" height="340" fill="#FF2E88" opacity=".35"/><rect x="60" y="250" width="${W - 120}" height="${H - 590}" fill="none" stroke="#C8FF1F" stroke-width="4" stroke-dasharray="16 12"/>` + Q.text(W / 2, 140, 'TOP 250 PX · PROFILE + CLOSE', { f: 'm', s: 32, w: 600, fill: '#fff', anchor: 'middle', ls: 3 }) + Q.text(W / 2, H - 170, 'BOTTOM 340 PX · REPLY BAR', { f: 'm', s: 32, w: 600, fill: '#fff', anchor: 'middle', ls: 3 }) + Q.text(W / 2, H / 2, 'SAFE', { f: 'd', s: 120, w: 800, fill: '#C8FF1F', anchor: 'middle' }), {}); })();
      const table = (cat) => `<div class="wrap-x"><table class="tbl"><tr><th>Piece</th><th>Size</th><th>Bleed</th><th>Safe area</th><th>Formats</th><th>File name</th><th></th></tr>${ROWS.filter((r) => cat === 'All' || r[0] === cat).map((r) => `<tr><td><b>${r[1]}</b><br><span class="tag" style="margin-top:4px;display:inline-block">${r[0]}</span></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td><code>quasar_${r[7]}_${r[5].split(',')[0].toLowerCase().replace(/\s.*/, '')}_${r[2].includes('mm') ? r[2].replace(/[^\d×x]/g, '').replace('×', 'x') + 'mm' : r[2].replace(/ px.*/, '').replace(/\s×\s/, 'x').replace(/\s.*/, '')}</code></td><td><a class="btn sm ghost" href="#/${r[6]}">Open</a></td></tr>`).join('')}</table></div>`;
      el.innerHTML = `<div class="row">${QS.seg('pc', cats.map((c) => [c, c]), 'All')}</div><div id="pcTbl" style="margin-top:14px">${table('All')}</div>
        ${QS.section('File naming', 'One pattern for every file the studio writes. Lowercase, hyphens inside each part, underscores between parts.', `<div class="panel"><p style="font:500 clamp(1rem,2.4vw,1.5rem)/1.3 var(--m);letter-spacing:.02em">quasar_<span style="color:var(--q-accent)">[piece]</span>_<span style="color:var(--q-accent-2)">[format]</span>_<span style="color:var(--q-accent)">[size]</span>.ext</p>
          <div class="spec"><span><b>piece</b> what it is, plus register when it matters: <code>post-square-party</code>, <code>rollup-banner-research</code></span><span><b>format</b> png, png-alpha, jpg, svg, pdf, mp4, webm-alpha, pngseq, zip</span><span><b>size</b> pixels for screens (<code>2160x2160</code>), millimetres for print with bleed noted (<code>850x2000mm-bleed5</code>)</span></div>
          <div class="spec"><span>quasar_post-square-party_png_2160x2160.png</span><span>quasar_rollup-banner-research_pdf_850x2000mm-bleed5.pdf</span><span>quasar_ignition-party_webm-alpha_1920x1080.webm</span><span>quasar_stickers_zip_24-pieces.zip</span></div></div>`)}
        ${QS.section('Story safe area', 'Platform UI covers the top and bottom of 9:16 frames. Keep type and logos inside the dashed area.', `<div class="split"><div class="stage" style="min-height:0">${sty}</div><div class="panel"><h3>Social checklist</h3><div class="spec" style="font-size:.8rem;gap:8px"><span>· Export PNG 1× for upload. Platforms recompress; 2× gains nothing.</span><span>· Alt text in the caption for every post.</span><span>· One register per post. Research posts never use neon.</span><span>· Dates in mono, uppercase: DEC 8, 2026.</span><span>· Never place the logo inside the top 250 px of a story.</span></div></div></div>`)}`;
      el.addEventListener('click', (e) => { const b = e.target.closest('[data-seg="pc"] button'); if (b) QS.$('#pcTbl', el).innerHTML = table(b.dataset.v); });
    }
  });
})();
