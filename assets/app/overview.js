/* § Overview */
QS.app('overview', {
  title: 'Overview', h1: 'Light from far away, <br>made to travel.',
  desc: 'What Quasar Studio is, the two registers, the season.',
  lede: 'Quasar Studio is the design system and production toolkit of The Quasar Lab: a research and design lab founded at MIT in 2018 and incubated at USC Media Arts + Practice. One identity, two registers: the archive and the afterparty.',
  render(el) {
    const ex = QS.apps;
    const d = { eyebrow: 'Reality Hack afterparty', title: 'Become the brightest light', date: 'DEC 2026', place: 'LaVallée · Brussels', body: 'Seven dimensions of spatial design, one plate at a time.' };
    const r1 = Q.tplItem('post-square', Object.assign({}, d, { eyebrow: 'FIG. 07 · Spatial design', title: 'The seventh dimension', date: 'Research series', place: 'HIIPE lab notes' }), 'research', 'light', { id: 'overview-research-sample' });
    const p1 = Q.tplItem('post-square', d, 'party', null, { id: 'overview-party-sample' });
    el.innerHTML = `
      <div class="hero blk"><canvas id="ovCanvas" width="1200" height="760" aria-label="Animated logo reveal"></canvas>
        <div class="panel" style="display:grid;gap:14px;align-content:start">
          <p class="kick">The mark</p>
          <h2>A galactic core that outshines everything around it.</h2>
          <p class="note">The symbol has four parts, and every piece in the system reuses them: the <b>core</b> (the black hole, the people the system did not see), the <b>accretion disk</b> (community in orbit), the <b>jets</b> (the axis, direction, the signal out), and the <b>halo</b> (warmth). Draw with these and anything you make will belong.</p>
          <div class="icons" style="--min:120px">${['physics', 'dbh', 'signal'].map((k) => `<div class="tile" style="padding:12px">${Q.icon(k, 32, 'var(--q-accent)')}<b style="font-size:.74rem">${Q.ICONS[k].n}</b></div>`).join('')}</div>
          <div class="row"><a class="btn primary" href="#/foundations">Foundations</a><a class="btn ghost" href="#/create">Start making</a></div>
        </div></div>
      ${QS.section('Two registers, one DNA', 'Every piece declares a register. Same mark, same type, same geometry. Different temperature.', `<div class="reg2">
        <div class="panel" style="display:grid;gap:12px"><p class="kick">Research</p>${QS.card(r1)}<p class="note">Rigorous, diagrammatic, archival. Paper and archive ink, one redline accent, figure numbers, registration marks, mono labels. For papers, talks, decks, lab notes, the HIIPE method, Quasar Physics, Data Black Holes, NDF, DROID and the Seventh Dimension.</p></div>
        <div class="panel" style="display:grid;gap:12px"><p class="kick">Party / community</p>${QS.card(p1)}<p class="note">Loud, collectible, made for souvenirs. True black, fluorescent inks that read under club light and UV, a glowing core, heavy uppercase. For the Reality Hack afterparty, pins, stickers, wristbands, posters, photo moments.</p></div></div>`)}
      ${QS.section('The season', 'Dates as of this version. Confirm anything marked "confirm" before printing.', `<div class="tl">
        <div><b>DEC 7–9, 2026</b><div><strong>UnitedXR Europe · Brussels</strong><span>Booth on Dec 8 at Maison de la Poste. Panel and Reality Hack afterparty at LaVallée (date and time: confirm).</span></div><span class="tag">Party + Research</span></div>
        <div><b>JAN 2027</b><div><strong>MIT Reality Hack · Cambridge, MA</strong><span>Hack week, workshops, afterparty.</span></div><span class="tag">Party</span></div>
        <div><b>JAN 2027</b><div><strong>Sundance</strong><span>Screenings, salon, gathering (details: confirm).</span></div><span class="tag">Research + Party</span></div></div>`)}
      ${QS.section('Everything in the studio', null, `<div class="grid" style="--min:220px">${QS.ORDER.flatMap((g) => g[1]).filter((k) => k !== 'overview').map((k) => `<a class="tile" href="#/${k}"><span>§ ${QS.num(k)}</span><b>${ex[k].title}</b><p>${ex[k].desc || ''}</p></a>`).join('')}</div>`)}
      ${QS.section('House rules', null, `<div class="grid" style="--min:240px">
        <div class="panel"><h3>No stock space</h3><p class="note" style="margin-top:8px">No starfields, rockets, nebula gradients or planets. The cosmos here is diagrams, orbits and light.</p></div>
        <div class="panel"><h3>One register per piece</h3><p class="note" style="margin-top:8px">Never mix neon party inks into a research plate, or grids and figure numbers into a party poster.</p></div>
        <div class="panel"><h3>Partners bring their own logos</h3><p class="note" style="margin-top:8px">Sponsor slots stay empty until a partner supplies the file. Never redraw a third-party mark.</p></div>
        <div class="panel"><h3>Confidential</h3><p class="note" style="margin-top:8px">This studio is internal. No personal, health or financial details in any template, and no sponsor amounts.</p></div></div>`)}`;
    const cv = QS.$('#ovCanvas', el), pl = Q.player(cv, Q.STINGS[0], () => ({ reg: 'core' }));
    QS.cleanup = () => pl.stop();
  }
});
