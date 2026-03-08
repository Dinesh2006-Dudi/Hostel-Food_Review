// ============================================================
//  HostelBite — Module 6a: Admin Dashboard JS
//  File: js/admin-dashboard.js
// ============================================================

if (!HostelBite.requireAdmin()) { /* stops */ }

renderNavbar([
  { label:'Manage Menu',  href:'admin-menu.html' },
  { label:'All Reviews',  href:'admin-reviews.html' },
  { label:'Analytics',   href:'analytics.html' },
]);

document.getElementById('admin-date').textContent =
  new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'short' });

/* ── Stats ── */
const students = HostelBite.students;
const reviews  = HostelBite.reviews;
const todayStr = new Date().toISOString().split('T')[0];
const todayRevs = reviews.filter(r => r.date === todayStr);
const avgRating = reviews.length
  ? (reviews.reduce((s,r)=>s+r.overall,0)/reviews.length).toFixed(1) : '—';

const statsData = [
  { icon:'👥', val:students.length,       label:'Total Students',   color:'#5C6BC0' },
  { icon:'📝', val:reviews.length,        label:'Total Reviews',    color:'var(--saffron)', href:'admin-reviews.html' },
  { icon:'📅', val:todayRevs.length,      label:"Today's Reviews",  color:'var(--south)',   href:'admin-reviews.html' },
  { icon:'⭐', val:`${avgRating}⭐`,      label:'Overall Avg',      color:'var(--turmeric)' },
  { icon:'🟠', val:students.filter(s=>s.region==='North').length, label:'North Students', color:'var(--north)' },
  { icon:'🟢', val:students.filter(s=>s.region==='South').length, label:'South Students', color:'var(--south)' },
];
document.getElementById('admin-stats').innerHTML = statsData.map(s => `
  <div class="card stat-card card-hover${s.href?'" onclick="location.href=\''+s.href+'\'"':'"'} style="cursor:${s.href?'pointer':'default'}">
    <div class="stat-icon" style="background:${s.color}22">${s.icon}</div>
    <div>
      <div class="stat-value">${s.val}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  </div>`).join('');

/* ── Mini Bars ── */
const MEAL_RATINGS = [
  { meal:'Breakfast', North:4.2, South:3.8 },
  { meal:'Lunch',     North:3.6, South:4.5 },
  { meal:'Snacks',    North:3.2, South:3.9 },
  { meal:'Dinner',    North:4.0, South:3.7 },
];
document.getElementById('admin-bars').innerHTML = MEAL_RATINGS.map(m => `
  <div style="margin-bottom:10px">
    <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:4px">${m.meal}</div>
    <div class="bar-row2">
      <span style="font-size:10px;width:14px">🔴</span>
      <div class="bar-track2"><div class="bar-fill2" style="width:${(m.North/5)*100}%;background:var(--north)"></div></div>
      <span style="font-size:11px;font-weight:700;color:var(--north);width:26px">${m.North}</span>
    </div>
    <div class="bar-row2">
      <span style="font-size:10px;width:14px">🟢</span>
      <div class="bar-track2"><div class="bar-fill2" style="width:${(m.South/5)*100}%;background:var(--south)"></div></div>
      <span style="font-size:11px;font-weight:700;color:var(--south);width:26px">${m.South}</span>
    </div>
  </div>`).join('');

/* ── Announcement ── */
document.getElementById('announce-text').addEventListener('input', function() {
  document.getElementById('ann-count').textContent = `${this.value.length} / 200 characters`;
});
window.sendAnnouncement = function() {
  const text = document.getElementById('announce-text').value.trim();
  if (!text) { showToast('Please enter an announcement message.', 'error'); return; }
  document.getElementById('sent-box').classList.add('show');
  document.getElementById('sent-box').textContent = `✅ Announcement sent to all ${students.length} students!`;
  document.getElementById('announce-text').value = '';
  setTimeout(() => document.getElementById('sent-box').classList.remove('show'), 3000);
};

/* ── Students Table ── */
document.getElementById('student-count').textContent = students.length + ' registered';
document.getElementById('students-body').innerHTML = students.map(s => `
  <tr>
    <td>
      <div style="display:flex;align-items:center;gap:10px">
        <div class="s-avatar ${s.region?.toLowerCase()}">${s.avatar}</div>
        <span style="font-weight:600">${s.name}</span>
      </div>
    </td>
    <td style="color:var(--muted)">${s.studentId}</td>
    <td style="color:var(--muted)">${s.room}</td>
    <td style="color:var(--muted)">${s.course}</td>
    <td>${regionBadge(s.region)}</td>
    <td style="color:var(--muted)">${s.state||'—'}</td>
  </tr>`).join('');
