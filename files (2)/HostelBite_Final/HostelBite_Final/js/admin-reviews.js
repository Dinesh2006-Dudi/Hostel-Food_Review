// ============================================================
//  HostelBite — Module 6c: Admin Reviews Management JS
//  File: js/admin-reviews.js
// ============================================================

if (!HostelBite.requireAdmin()) { /* stops */ }

renderNavbar([
  { label:'← Admin',     href:'admin-dashboard.html' },
  { label:'Manage Menu', href:'admin-menu.html' },
]);

const MEAL_EMOJI = { Breakfast:'🌅', Lunch:'☀️', Snacks:'🌇', Dinner:'🌙' };

/* ── Filter & Render ── */
function getFiltered() {
  const search  = document.getElementById('search').value.toLowerCase();
  const region  = document.getElementById('f-region').value;
  const meal    = document.getElementById('f-meal').value;
  const rating  = document.getElementById('f-rating').value;

  return HostelBite.reviews.filter(r => {
    const mR = region === 'all' || r.region === region;
    const mM = meal   === 'all' || r.meal   === meal;
    const mS = !search || (r.studentName||'').toLowerCase().includes(search)
                        || (r.comment||'').toLowerCase().includes(search);
    const mRat = rating === 'all'  ? true
               : rating === 'high' ? r.overall >= 4
               : rating === 'mid'  ? r.overall >= 3 && r.overall < 4
               : r.overall < 3;
    return mR && mM && mS && mRat;
  });
}

function render() {
  const filtered = getFiltered();
  const total    = HostelBite.reviews.length;
  document.getElementById('rev-count').textContent =
    `Showing ${filtered.length} of ${total} reviews`;

  const listEl = document.getElementById('reviews-list');
  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="card empty-state">
        <div class="es-icon">🔍</div>
        <h3>No reviews match</h3>
        <p style="margin-top:8px">Try adjusting filters above.</p>
      </div>`;
    return;
  }

  listEl.innerHTML = filtered.map((r, idx) => {
    const color = r.overall >= 4 ? '#2E7D32' : r.overall >= 3 ? '#F57F17' : '#C62828';
    const avatar = (r.studentName||'??').split(' ').map(w=>w[0]).join('').slice(0,2);
    return `
      <div class="card rev-card slide-in delay-${(idx%4)+1}">
        <div class="rev-top">
          <div class="rev-left">
            <div class="s-avatar ${(r.region||'').toLowerCase()}">${avatar}</div>
            <div style="flex:1">
              <div class="rev-meta">
                <span class="rev-name">${r.studentName||'Unknown'}</span>
                <span style="font-size:20px">${r.emoji||''}</span>
                <span class="rev-meal">${MEAL_EMOJI[r.meal]||''} ${r.meal}</span>
                ${regionBadge(r.region)}
                <span class="badge ${ratingClass(r.overall)}">${r.overall}⭐</span>
                <span style="font-size:12px;color:var(--muted)">${r.date}</span>
              </div>
              ${r.comment ? `<div class="rev-comment">"${r.comment}"</div>` : ''}
              <div class="sub-mini">
                ${Object.entries(r.ratings||{}).map(([k,v]) =>
                  `<span class="sub-m">${k}: <strong>${v}⭐</strong></span>`).join('')}
              </div>
              ${(r.tags||[]).length ? `
                <div class="tags-row" style="margin-top:6px">
                  ${r.tags.map(t=>`<span class="tag" style="font-size:11px;padding:2px 8px">${t}</span>`).join('')}
                </div>` : ''}
            </div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="flagReview(${r.id})">🚩 Flag</button>
        </div>
      </div>`;
  }).join('');
}

/* ── Flag ── */
window.flagReview = function(id) {
  showToast(`Review #${id} flagged for review.`, 'info');
};

/* ── Filters ── */
window.applyFilters = render;
window.clearFilters = function() {
  document.getElementById('search').value   = '';
  document.getElementById('f-region').value = 'all';
  document.getElementById('f-meal').value   = 'all';
  document.getElementById('f-rating').value = 'all';
  render();
};

/* ── Export CSV ── */
window.doExport = function() {
  const filtered = getFiltered();
  const rows = [
    ['ID','Student','Region','Meal','Date','Taste','Quantity','Freshness','Presentation','Overall','Emoji','Tags','Comment'],
    ...filtered.map(r => [
      r.id, r.studentName, r.region, r.meal, r.date,
      r.ratings?.taste, r.ratings?.quantity, r.ratings?.freshness, r.ratings?.presentation,
      r.overall, r.emoji, (r.tags||[]).join('|'), r.comment||'',
    ])
  ];
  exportCSV(rows, `hostelbite-reviews-${todayStr()}.csv`);
  showToast(`Exported ${filtered.length} reviews as CSV!`);
};

render();
