/* Quasar Studio · shell: version, router, theme, shared UI helpers.
   To publish a new version, change versao below and add a line to CHANGELOG in README.md. */
var SITE = { nome: 'Quasar Studio', versao: 'V.1.3 - November 2026' };

(function () {
  const QS = (window.QS = { apps: {}, reg: {} });
  QS.ORDER = [
    ['Brand', ['overview', 'foundations', 'variations', 'pieces', 'lab']],
    ['Make', ['studio', 'create', 'export', 'collection']],
    ['Assets', ['stings', 'illustrations', 'stickers', 'badges', 'merch', 'panels', 'sponsors', 'team', 'backgrounds']]
  ];
  QS.app = (key, def) => { QS.apps[key] = def; };
  QS.$ = (s, r = document) => r.querySelector(s);
  QS.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* register items so [data-exp] buttons can open the export dialog */
  QS.add = (it) => { QS.reg[it.id] = it; return it; };
  QS.card = (it, o = {}) => {
    QS.add(it);
    return `<figure class="pcard${o.cls ? ' ' + o.cls : ''}" data-reg="${it.register || ''}" data-fmt="${it.format || ''}">
      <button class="pcard-prev${it.transparent ? ' checker' : ''}${it.dark === false ? ' light' : ''}" data-exp="${it.id}" aria-label="Export ${QS.esc(it.title)}">${o.lazy ? `<span class="lz" data-lz="${it.id}" style="display:block;width:100%;aspect-ratio:${it.w}/${it.h};max-height:420px"></span>` : it.svg({ preview: true })}</button>
      <figcaption><div><b>${QS.esc(it.title)}</b><span>${it.print ? `${it.print.mm[0]}×${it.print.mm[1]} mm` : `${Math.round(it.w)}×${Math.round(it.h)}`}${it.register ? ' · ' + it.register : ''}</span></div>
      <button class="btn sm ghost" data-exp="${it.id}">Export</button></figcaption></figure>`;
  };
  /* lazy previews: heavy items (filter textures) are rasterized once to a small cached PNG */
  const THUMBS = {};
  QS.lazy = (root) => {
    let dead = false;
    const fill = async (s) => {
      if (dead || !s.isConnected || !s.dataset.lz) return; const it = QS.reg[s.dataset.lz]; s.removeAttribute('data-lz'); if (!it) return;
      try {
        if (it.heavy) {
          if (!THUMBS[it.id]) { Q._lite = false; const svg = it.svg({ preview: true }), sc = 420 / Math.max(it.w, it.h); THUMBS[it.id] = URL.createObjectURL((await QX.raster(svg, it.w, it.h, sc, 'png')).blob); }
          if (s.isConnected) s.outerHTML = `<img src="${THUMBS[it.id]}" alt="" style="width:100%;height:auto;display:block">`;
        } else { Q._lite = true; s.outerHTML = it.svg({ preview: true }); }
      } catch (err) { console.warn('preview failed', it.id, err); if (s.isConnected) s.outerHTML = '<span class="note">Preview unavailable</span>'; } finally { Q._lite = false; }
    };
    const all = QS.$$('[data-lz]', root);
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); fill(e.target); } }), { rootMargin: '600px' }) : null;
    if (io) all.forEach((s) => io.observe(s));
    let qi = 0; const worker = async () => { while (!dead && qi < all.length) await fill(all[qi++]); }; Promise.resolve().then(() => Promise.all([worker(), worker(), worker(), worker()]));
    return { disconnect: () => { dead = true; io && io.disconnect(); } };
  };
  QS.esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  QS.toast = (msg) => { const t = QS.$('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(QS._tt); QS._tt = setTimeout(() => t.classList.remove('on'), 2400); };
  QS.section = (title, sub, body, o = {}) => `<section class="blk"${o.id ? ` id="${o.id}"` : ''}><header class="blk-h"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>${o.actions || ''}</header>${body}</section>`;
  QS.zipBtn = (key, label) => `<button class="btn ghost sm" data-zip="${key}">Download ${label || 'section'} ZIP</button>`;
  QS.seg = (name, opts, val) => `<div class="seg" data-seg="${name}">${opts.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<button data-v="${v}" aria-pressed="${String(v) === String(val)}">${l}</button>`; }).join('')}</div>`;

  /* file input → data URL (partner logos, photos). Never uploaded anywhere. */
  QS.pickImage = () => new Promise((res) => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/png,image/jpeg,image/svg+xml,image/webp';
    i.onchange = () => { const f = i.files[0]; if (!f) return res(null); const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => res({ src: r.result, w: img.naturalWidth || 400, h: img.naturalHeight || 200, name: f.name }); img.onerror = () => res({ src: r.result, w: 400, h: 200, name: f.name }); img.src = r.result; }; r.readAsDataURL(f); };
    i.click();
  });

  /* ---------- theme ---------- */
  const root = document.documentElement;
  QS.setTheme = (t) => { root.dataset.theme = t; localStorage.setItem('quasar.theme', t); const b = QS.$('#themeBtn'); if (b) b.innerHTML = t === 'dark' ? '<i class="dot"></i>Dark' : '<i class="dot"></i>Light'; };

  /* ---------- nav ---------- */
  const buildNav = () => {
    let n = 1;
    QS.$('#navList').innerHTML = QS.ORDER.map(([g, keys]) => `<div class="nav-g"><p>${g}</p>${keys.map((k) => { const a = QS.apps[k]; const num = String(n++).padStart(2, '0'); return a ? `<a href="#/${k}" data-k="${k}"><span>${num}</span>${a.title}</a>` : ''; }).join('')}</div>`).join('');
    QS.$('#ver').textContent = SITE.nome + ' · ' + SITE.versao;
  };
  QS.num = (key) => { const flat = QS.ORDER.flatMap((g) => g[1]); return String(flat.indexOf(key) + 1).padStart(2, '0'); };

  /* ---------- router ---------- */
  const route = () => {
    const key = (location.hash.match(/^#\/([\w-]+)/) || [])[1] || 'overview';
    const app = QS.apps[key] || QS.apps.overview;
    QS.$$('#navList a').forEach((a) => a.setAttribute('aria-current', a.dataset.k === key ? 'page' : 'false'));
    document.body.classList.remove('nav-open');
    if (QS.cleanup) { try { QS.cleanup(); } catch (e) {} QS.cleanup = null; }
    const main = QS.$('#main');
    main.innerHTML = `<header class="phead"><p class="kick">§ ${QS.num(key)} / ${app.title}</p><h1>${app.h1 || app.title}</h1>${app.lede ? `<p class="lede">${app.lede}</p>` : ''}${app.items ? `<div class="row">${QS.zipBtn(key, app.title)}</div>` : ''}</header><div class="pbody"></div>`;
    document.title = `${app.title} · ${SITE.nome}`;
    try { app.render(QS.$('.pbody', main)); } catch (e) { console.error(e); QS.$('.pbody', main).innerHTML = `<p class="note">This section failed to render: ${QS.esc(e.message)}</p>`; }
    window.scrollTo(0, 0); main.focus({ preventScroll: true });
  };
  QS.route = route;

  /* ---------- global delegation ---------- */
  document.addEventListener('click', (e) => {
    const exp = e.target.closest('[data-exp]'); if (exp) { QX.open(QS.reg[exp.dataset.exp]); return; }
    const z = e.target.closest('[data-zip]');
    if (z) { const a = QS.apps[z.dataset.zip]; if (a && a.items) QX.batch(a.items(), a.title); return; }
    const sb = e.target.closest('.seg[data-seg] button');
    if (sb && !sb.closest('.qdlg')) { QS.$$('button', sb.parentNode).forEach((b) => b.setAttribute('aria-pressed', b === sb)); }
  });

  QS.boot = async () => {
    QS.setTheme(localStorage.getItem('quasar.theme') || 'dark');
    QS.$('#themeBtn').onclick = () => QS.setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    QS.$('#menuBtn').onclick = () => document.body.classList.toggle('nav-open');
    buildNav();
    try { await Promise.all(['300 20px Unbounded', '500 20px Unbounded', '700 20px Unbounded', '400 20px "Space Grotesk"', '500 20px "Space Grotesk"', '500 20px "JetBrains Mono"'].map((f) => document.fonts.load(f))); } catch (e) {}
    window.addEventListener('hashchange', route);
    route();
  };
})();
