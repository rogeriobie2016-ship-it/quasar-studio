/* § Studio: event kit builder. One event + one register → a matched set of pieces, one ZIP. */
(function () {
  const KITS = {
    uxr: { eyebrow: 'UnitedXR Europe · Brussels', title: 'Reality Hack afterparty', date: 'DEC 2026', place: 'LaVallée, Brussels', body: 'After the panel, the party. Come find the light.', cta: 'RSVP · link in bio', tag: 'events', quote: 'Design for the people systems were not designed for.', cite: 'The Quasar Lab', panelTitle: 'Designing for the people systems missed', booth: 'Visit the booth · Dec 8 · Maison de la Poste' },
    mit: { eyebrow: 'MIT Reality Hack · Cambridge', title: 'Hack the seventh dimension', date: 'JAN 2027', place: 'MIT · Cambridge, MA', body: 'Five days of building, one night of light.', cta: 'Details · link in bio', tag: 'events', quote: 'Stories and data on the same plane.', cite: 'Quasar Physics', panelTitle: 'Spatial design in seven dimensions', booth: 'Workshops all week' },
    sun: { eyebrow: 'Sundance · 2027', title: 'Light from far away', date: 'JAN 2027', place: 'Sundance Film Festival', body: 'A gathering on film, data and the people we design with.', cta: 'Invite only · ask the lab', tag: 'travel', quote: 'Become the brightest light.', cite: 'The Quasar Lab', panelTitle: 'Film as research, research as film', booth: 'Salon and screening' }
  };
  const kit = (ev, reg, mode) => {
    const d = KITS[ev], s = (k, extra, ov = {}) => Q.tplItem(k, Object.assign({}, d, ov), reg, mode, Object.assign({ id: `kit-${ev}-${k}-${reg}`, section: 'studio' }, extra));
    return [
      s('announce', { title: 'Announcement' }), s('post-square', { title: 'Post · square' }), s('post-45', { title: 'Post · 4:5' }), s('story', { title: 'Story' }),
      s('quote', { title: 'Quote card' }), s('speaker', { title: 'Speaker card' }, { title: d.panelTitle, eyebrow: d.eyebrow }),
      s('panel-title', { title: 'Panel title' }, { title: d.panelTitle }), s('slide', { title: 'Title slide' }, { title: d.panelTitle, body: d.body }), s('lower-third', { title: 'Lower third' })
    ];
  };
  let cur = { ev: 'uxr', reg: 'party', mode: 'light' };
  QS.app('studio', {
    title: 'Studio', desc: 'Event kit builder: pick an event and a register, get the whole matched set in one ZIP.',
    lede: 'The fastest way to a full campaign. Choose an event and a register; the studio builds nine matched pieces with the event copy filled in. Tweak any of them in Create.',
    items: () => kit(cur.ev, cur.reg, cur.mode),
    render(el) {
      const draw = () => { QS.$('#kit', el).innerHTML = kit(cur.ev, cur.reg, cur.mode).map((i) => QS.card(i)).join(''); const ev = Q.EVENTS.find((e) => e.k === cur.ev); QS.$('#kitInfo', el).innerHTML = `<b>${ev.n}</b> · ${ev.city} · ${ev.date}<br><span class="note">${ev.what}</span>`; };
      el.innerHTML = `<div class="panel" style="display:grid;gap:14px">
        <div class="row" style="margin:0;gap:18px"><div class="field"><span>Event</span>${QS.seg('ev', Q.EVENTS.map((e) => [e.k, e.n]), cur.ev)}</div><div class="field"><span>Register</span>${QS.seg('kreg', [['party', 'Party'], ['research', 'Research']], cur.reg)}</div></div>
        <p id="kitInfo"></p><div class="row" style="margin:0"><button class="btn primary" data-zip="studio">Download kit ZIP</button><a class="btn ghost" href="#/create">Edit copy in Create</a></div></div>
        <div class="grid" id="kit" style="--min:240px;margin-top:20px"></div>`;
      draw();
      el.addEventListener('click', (e) => { const a = e.target.closest('[data-seg="ev"] button'), b = e.target.closest('[data-seg="kreg"] button'); if (a) { cur.ev = a.dataset.v; draw(); } if (b) { cur.reg = b.dataset.v; draw(); } });
    }
  });
})();
