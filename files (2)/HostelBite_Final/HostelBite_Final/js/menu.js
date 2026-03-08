// ============================================================
//  HostelBite — Module 3: Menu JS
//  File: js/menu.js
// ============================================================

if (!HostelBite.requireLogin()) { /* stops */ }

renderNavbar([
  { label:'← Dashboard', href:'dashboard.html' },
  { label:'Rate a Meal',  href:'review.html' },
  { label:'Analytics',   href:'analytics.html' },
]);

document.getElementById('today-date').textContent =
  new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

/* ── Render all meal cards ── */
function renderMenu(filterKey = 'all') {
  const grid = document.getElementById('menu-grid');
  const entries = Object.entries(HostelBite.menu)
    .filter(([meal]) => filterKey === 'all' || meal === filterKey);

  grid.innerHTML = entries.map(([meal, data], idx) => {
    const vegCount    = data.items.filter(i => i.veg).length;
    const nonVegCount = data.items.length - vegCount;
    const totalCal    = data.items.reduce((s,i) => s + (i.cal||0), 0);

    const itemsHTML = data.items.map(item => `
      <div class="meal-item">
        <div class="meal-item-left">
          ${vegDot(item.veg)}
          <span class="meal-item-name">${item.name}</span>
        </div>
        <div class="meal-item-right">
          ${item.cal ? `<span class="cal-pill">${item.cal} kcal</span>` : ''}
          ${item.region !== 'both' ? `<span class="region-pill ${item.region.toLowerCase()}">${item.region}</span>` : ''}
        </div>
      </div>`).join('');

    return `
      <div class="meal-card fade-in delay-${(idx%4)+1}">
        <div class="meal-header" style="background:${data.gradient}">
          <div class="m-emoji">${data.emoji}</div>
          <h3>${meal}</h3>
          <div class="meal-time">⏰ ${data.time}</div>
          <div class="meal-meta">
            <span class="meal-meta-pill">🥦 ${vegCount} Veg</span>
            <span class="meal-meta-pill">🍗 ${nonVegCount} Non-veg</span>
            <span class="meal-meta-pill">🔥 ~${totalCal} kcal</span>
          </div>
        </div>
        <div class="meal-body">
          ${itemsHTML}
          <div class="meal-legend">
            <span class="legend-veg">${vegDot(true)} Vegetarian</span>
            <span class="legend-veg">${vegDot(false)} Non-Vegetarian</span>
          </div>
          <button class="btn btn-primary btn-full" onclick="location.href='review.html'" style="margin-top:10px">
            ⭐ Rate This Meal
          </button>
        </div>
      </div>`;
  }).join('');
}

/* ── Filter ── */
window.filterMeal = function(btn, meal) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMenu(meal);
};

renderMenu();
