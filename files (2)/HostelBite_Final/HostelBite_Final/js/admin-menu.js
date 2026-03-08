// ============================================================
//  HostelBite — Module 6b: Admin Menu Management JS
//  File: js/admin-menu.js
// ============================================================

if (!HostelBite.requireAdmin()) { /* stops */ }

renderNavbar([
  { label:'← Admin', href:'admin-dashboard.html' },
  { label:'Reviews', href:'admin-reviews.html' },
]);

document.getElementById('menu-date').textContent =
  new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

// Local copy of menu (editable)
const menu = JSON.parse(JSON.stringify(HostelBite.menu));
let activeMeal = 'Breakfast';

/* ── Tabs ── */
document.getElementById('meal-tabs').innerHTML =
  Object.entries(menu).map(([meal, data]) => `
    <button class="meal-tab ${meal === activeMeal ? 'active' : ''}"
      id="tab-${meal}" onclick="switchMeal('${meal}')">
      ${data.emoji} ${meal}
      <span style="margin-left:6px;font-size:11px;background:${meal===activeMeal?'var(--saffron)':'var(--border)'};color:${meal===activeMeal?'#fff':'var(--muted)'};border-radius:10px;padding:1px 7px" id="count-${meal}">
        ${data.items.length}
      </span>
    </button>`).join('');

/* ── Switch meal ── */
window.switchMeal = function(meal) {
  activeMeal = meal;
  document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + meal).classList.add('active');
  renderItems();
  document.getElementById('meal-heading').textContent = `${menu[meal].emoji} ${meal} Items`;
  document.getElementById('meal-time').textContent    = `⏰ ${menu[meal].time}`;
  document.getElementById('add-heading').textContent  = `➕ Add New Item to ${meal}`;
};

/* ── Render items ── */
function renderItems() {
  const items = menu[activeMeal].items;
  document.getElementById('item-count').textContent = `${items.length} items`;
  document.getElementById('items-list').innerHTML = items.length === 0
    ? `<p style="color:var(--muted);font-style:italic">No items yet. Add items below.</p>`
    : items.map((item, i) => `
      <div class="item-row">
        <div class="item-left">
          ${vegDot(item.veg)}
          <span class="item-name">${item.name}</span>
          ${item.cal ? `<span style="font-size:12px;background:#F0F0F0;padding:2px 8px;border-radius:8px;color:var(--muted)">${item.cal} kcal</span>` : ''}
        </div>
        <div class="item-right">
          ${item.region !== 'both' ? `<span class="region-pill ${item.region.toLowerCase()}">${item.region}</span>` : ''}
          <button class="btn btn-danger btn-sm" onclick="removeItem(${i})">Remove</button>
        </div>
      </div>`).join('');
  // Update tab count
  document.getElementById('count-' + activeMeal).textContent = items.length;
}

/* ── Add item ── */
window.addItem = function() {
  const name = document.getElementById('item-name').value.trim();
  if (!name) { showToast('Please enter an item name.', 'error'); return; }
  const cal    = parseInt(document.getElementById('item-cal').value) || null;
  const region = document.getElementById('item-region').value;
  const veg    = document.querySelector('input[name="veg"]:checked').value === 'veg';
  menu[activeMeal].items.push({ name, veg, cal, region });
  document.getElementById('item-name').value = '';
  document.getElementById('item-cal').value  = '';
  renderItems();
  showToast(`"${name}" added to ${activeMeal}!`);
};

/* ── Remove item ── */
window.removeItem = function(idx) {
  const name = menu[activeMeal].items[idx].name;
  menu[activeMeal].items.splice(idx, 1);
  renderItems();
  showToast(`"${name}" removed.`, 'error');
};

/* ── Save ── */
window.saveMenu = function() {
  Object.assign(HostelBite.menu, menu);
  const btn = document.getElementById('save-btn');
  btn.textContent = '✅ Saved!';
  btn.style.background = 'var(--south)';
  showToast('Menu saved successfully!');
  setTimeout(() => { btn.textContent = '💾 Save Menu'; btn.style.background = ''; }, 2500);
};

/* Init */
switchMeal('Breakfast');
