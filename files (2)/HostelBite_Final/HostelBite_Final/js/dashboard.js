// ============================================================
//  HostelBite — Module 2: Dashboard JS
//  File: js/dashboard.js
// ============================================================

if (!HostelBite.requireLogin()) { /* stops */ }

const user      = HostelBite.currentUser;
const isNorth   = user.region === 'North';
const accentGrad = isNorth
  ? 'linear-gradient(135deg,#C62828,#E8580A)'
  : 'linear-gradient(135deg,#2E7D32,#43A047)';

/* ── Navbar ── */
renderNavbar([
  { label: "Today's Menu",  href: 'menu.html' },
  { label: 'Rate a Meal',   href: 'review.html' },
  { label: 'My Reviews',    href: 'my-reviews.html' },
  { label: 'Analytics',     href: 'analytics.html' },
]);

/* ── Greeting ── */
const hour = new Date().getHours();
document.getElementById('greeting').textContent =
  (hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening') + ' 👋';

/* ── Welcome Hero ── */
document.getElementById('welcome-hero').style.background = accentGrad;
document.getElementById('user-name').textContent  = user.name;
document.getElementById('avatar-big').textContent = user.avatar;
document.getElementById('user-state').textContent = user.state || '';

const pills = [
  { label: isNorth ? '🟠 North India' : '🟢 South India' },
  { label: '🏠 Room ' + user.room },
  { label: '📚 ' + user.course },
];
document.getElementById('meta-pills').innerHTML = pills.map(p =>
  `<span class="meta-pill">${p.label}</span>`
).join('');

/* ── Stats ── */
const myReviews = HostelBite.getMyReviews();
const allReviews = HostelBite.reviews;
const myAvg  = myReviews.length  ? (myReviews.reduce((s,r)=>s+r.overall,0)/myReviews.length).toFixed(1) : '—';
const allAvg = allReviews.length ? (allReviews.reduce((s,r)=>s+r.overall,0)/allReviews.length).toFixed(1) : '—';
const uniqueMeals = new Set(myReviews.map(r=>r.meal)).size;

const stats = [
  { icon:'⭐', val:myAvg,             label:'My Avg Rating',  color:'#F5A623' },
  { icon:'📝', val:myReviews.length,  label:'Total Reviews',  color:'var(--saffron)' },
  { icon:'🏘️', val:allAvg,            label:'Community Avg',  color:'#5C6BC0' },
  { icon:'🍽️', val:uniqueMeals,       label:'Meals Rated',    color:'var(--south)' },
];
document.getElementById('stats-grid').innerHTML = stats.map(s => `
  <div class="card stat-card card-hover fade-in">
    <div class="stat-icon" style="background:${s.color}22">${s.icon}</div>
    <div>
      <div class="stat-value">${s.val}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  </div>
`).join('');

/* ── Today's Menu Snapshot ── */
const meals = Object.entries(HostelBite.menu);
document.getElementById('menu-snap').innerHTML = meals.map(([meal, data]) => `
  <div class="menu-snap-row">
    <div class="meal-info">
      <span class="m-emoji">${data.emoji}</span>
      <div>
        <div style="font-weight:600;font-size:14px">${meal}</div>
        <div style="font-size:12px;color:var(--muted)">${data.time}</div>
      </div>
    </div>
    <button class="btn btn-sm btn-primary" onclick="location.href='review.html'">Rate</button>
  </div>
`).join('') + `
  <button class="btn btn-primary btn-full" style="margin-top:14px" onclick="location.href='review.html'">
    ⭐ Rate Today's Meal
  </button>`;

/* ── North vs South Bars ── */
const analytics = HostelBite.getAnalytics();
document.getElementById('ns-bars').innerHTML = analytics.mealRatings.map(m => `
  <div style="margin-bottom:12px">
    <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px">${m.meal}</div>
    <div class="bar-row">
      <span style="font-size:11px;width:14px">🔴</span>
      <div class="bar-track"><div class="bar-fill-ns" style="width:${(m.North/5)*100}%;background:#C62828"></div></div>
      <span class="bar-score" style="color:#C62828">${m.North}</span>
    </div>
    <div class="bar-row">
      <span style="font-size:11px;width:14px">🟢</span>
      <div class="bar-track"><div class="bar-fill-ns" style="width:${(m.South/5)*100}%;background:#2E7D32"></div></div>
      <span class="bar-score" style="color:#2E7D32">${m.South}</span>
    </div>
  </div>
`).join('');

/* ── Recent Reviews ── */
const recent = [...myReviews].reverse().slice(0, 3);
const reviewsEl = document.getElementById('recent-reviews');
if (recent.length === 0) {
  reviewsEl.innerHTML = `
    <div class="empty-state">
      <div class="es-icon">🍽️</div>
      <h4>No reviews yet!</h4>
      <p style="margin-top:8px">Rate your first meal and help improve hostel food.</p>
      <button class="btn btn-primary" style="margin-top:16px" onclick="location.href='review.html'">Rate a Meal</button>
    </div>`;
} else {
  reviewsEl.innerHTML = recent.map(r => `
    <div class="review-item slide-in">
      <div class="review-header">
        <div class="review-meal">${r.emoji} ${r.meal} <span class="review-score">${r.overall}⭐</span></div>
        <span style="font-size:12px;color:var(--muted)">${r.date}</span>
      </div>
      <p style="font-size:13px;color:var(--muted)">${r.comment || 'No comment'}</p>
      <div class="tags-row" style="margin-top:6px">
        ${(r.tags||[]).map(t=>`<span class="tag" style="font-size:11px;padding:2px 8px">${t}</span>`).join('')}
      </div>
    </div>`).join('');
}
