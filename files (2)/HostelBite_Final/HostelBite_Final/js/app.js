// ============================================================
//  HostelBite — Global JS: State, Data, Utilities
//  File: js/app.js
//  Include this FIRST in every HTML page
// ============================================================

/* ── APP STATE ─────────────────────────────────────────────── */
const HostelBite = {

  /* Logged in user (null if not logged in) */
  currentUser: JSON.parse(sessionStorage.getItem('hb_user') || 'null'),
  isAdmin:     JSON.parse(sessionStorage.getItem('hb_admin') || 'false'),

  /* ── Students ── */
  students: JSON.parse(localStorage.getItem('hb_students') || 'null') || [
    { id:1, name:'Arjun Sharma',  email:'arjun@hostel.in',  password:'pass123',
      studentId:'CS2021001', room:'A-101', course:'B.Tech CSE', year:'3rd',
      region:'North', state:'Uttar Pradesh', avatar:'AS' },
    { id:2, name:'Kavya Nair',    email:'kavya@hostel.in',  password:'pass123',
      studentId:'EC2021045', room:'B-203', course:'B.Tech ECE', year:'3rd',
      region:'South', state:'Kerala',         avatar:'KN' },
    { id:3, name:'Rahul Gupta',   email:'rahul@hostel.in',  password:'pass123',
      studentId:'ME2022010', room:'C-305', course:'B.Tech ME',  year:'2nd',
      region:'North', state:'Bihar',           avatar:'RG' },
    { id:4, name:'Priya Menon',   email:'priya@hostel.in',  password:'pass123',
      studentId:'CS2022033', room:'D-108', course:'B.Tech CSE', year:'2nd',
      region:'South', state:'Tamil Nadu',     avatar:'PM' },
  ],

  /* ── Reviews ── */
  reviews: JSON.parse(localStorage.getItem('hb_reviews') || 'null') || [
    { id:1, studentId:1, studentName:'Arjun Sharma',  region:'North', meal:'Breakfast',
      date:'2024-03-08', ratings:{taste:4,quantity:3,freshness:4,presentation:3},
      overall:3.5,  comment:'Paratha was good but needed more butter!', emoji:'😊', tags:['#spicy','#fresh'] },
    { id:2, studentId:2, studentName:'Kavya Nair',    region:'South', meal:'Lunch',
      date:'2024-03-08', ratings:{taste:5,quantity:4,freshness:5,presentation:4},
      overall:4.5,  comment:'Sambar was perfect today! Reminded me of home.', emoji:'😍', tags:['#fresh','#healthy'] },
    { id:3, studentId:1, studentName:'Arjun Sharma',  region:'North', meal:'Dinner',
      date:'2024-03-07', ratings:{taste:2,quantity:3,freshness:2,presentation:2},
      overall:2.25, comment:'Dal was too watery today.', emoji:'😞', tags:['#bland'] },
    { id:4, studentId:2, studentName:'Kavya Nair',    region:'South', meal:'Snacks',
      date:'2024-03-07', ratings:{taste:3,quantity:3,freshness:4,presentation:3},
      overall:3.25, comment:'Filter coffee was decent.', emoji:'😐', tags:['#fresh'] },
    { id:5, studentId:3, studentName:'Rahul Gupta',   region:'North', meal:'Lunch',
      date:'2024-03-08', ratings:{taste:3,quantity:4,freshness:3,presentation:3},
      overall:3.25, comment:'Dal was okay, roti was soft.', emoji:'😊', tags:['#bland','#healthy'] },
    { id:6, studentId:4, studentName:'Priya Menon',   region:'South', meal:'Breakfast',
      date:'2024-03-08', ratings:{taste:4,quantity:4,freshness:4,presentation:3},
      overall:3.75, comment:'Dosa was crispy! Good morning meal.', emoji:'😍', tags:['#fresh','#perfect'] },
  ],

  /* ── Daily Menu ── */
  menu: {
    Breakfast: {
      time:'7:00 AM – 9:00 AM', emoji:'🌅',
      gradient:'linear-gradient(135deg,#FF8F00,#FFB300)',
      items:[
        {name:'Idli & Sambar',    veg:true,  cal:180, region:'both'},
        {name:'Aloo Paratha',     veg:true,  cal:320, region:'North'},
        {name:'Dosa & Chutney',   veg:true,  cal:220, region:'South'},
        {name:'Poha',             veg:true,  cal:200, region:'North'},
        {name:'Upma',             veg:true,  cal:190, region:'South'},
        {name:'Boiled Eggs',      veg:false, cal:140, region:'both'},
        {name:'Bread & Butter',   veg:true,  cal:160, region:'both'},
      ]
    },
    Lunch: {
      time:'12:30 PM – 2:30 PM', emoji:'☀️',
      gradient:'linear-gradient(135deg,#E8580A,#F5A623)',
      items:[
        {name:'Dal Tadka',            veg:true,  cal:180, region:'North'},
        {name:'Roti (2 pcs)',         veg:true,  cal:200, region:'North'},
        {name:'Rice + Sambar',        veg:true,  cal:300, region:'South'},
        {name:'Rasam',                veg:true,  cal:60,  region:'South'},
        {name:'Kootu & Papad',        veg:true,  cal:180, region:'South'},
        {name:'Seasonal Sabzi',       veg:true,  cal:150, region:'both'},
        {name:'Salad',                veg:true,  cal:60,  region:'both'},
        {name:'Chicken Curry',        veg:false, cal:280, region:'both'},
      ]
    },
    Snacks: {
      time:'5:00 PM – 6:00 PM', emoji:'🌇',
      gradient:'linear-gradient(135deg,#5C6BC0,#7E57C2)',
      items:[
        {name:'Samosa & Chai',         veg:true,  cal:250, region:'North'},
        {name:'Bread Pakora',          veg:true,  cal:280, region:'North'},
        {name:'Bajji & Filter Coffee', veg:true,  cal:230, region:'South'},
        {name:'Murukku',               veg:true,  cal:200, region:'South'},
        {name:'Biscuits',              veg:true,  cal:130, region:'both'},
      ]
    },
    Dinner: {
      time:'8:00 PM – 9:30 PM', emoji:'🌙',
      gradient:'linear-gradient(135deg,#1A237E,#283593)',
      items:[
        {name:'Rajma / Chole + Roti',  veg:true,  cal:580, region:'North'},
        {name:'Kheer',                 veg:true,  cal:180, region:'North'},
        {name:'Rice + Dal Curry',      veg:true,  cal:350, region:'South'},
        {name:'Curd',                  veg:true,  cal:100, region:'South'},
        {name:'Payasam',               veg:true,  cal:170, region:'South'},
        {name:'Mixed Veg Sabzi',       veg:true,  cal:140, region:'both'},
      ]
    }
  },

  /* ── Save helpers ── */
  saveStudents() { localStorage.setItem('hb_students', JSON.stringify(this.students)); },
  saveReviews()  { localStorage.setItem('hb_reviews',  JSON.stringify(this.reviews)); },
  saveSession()  {
    sessionStorage.setItem('hb_user',  JSON.stringify(this.currentUser));
    sessionStorage.setItem('hb_admin', JSON.stringify(this.isAdmin));
  },

  /* ── Auth ── */
  login(email, password) {
    if (email === 'admin@hostel.in' && password === 'admin123') {
      this.isAdmin = true;
      this.currentUser = { name:'Admin', email, avatar:'AD', region:'admin' };
      this.saveSession();
      return { ok:true, role:'admin' };
    }
    const s = this.students.find(s => s.email === email && s.password === password);
    if (s) {
      this.currentUser = s;
      this.isAdmin = false;
      this.saveSession();
      return { ok:true, role:'student', user:s };
    }
    return { ok:false };
  },
  logout() {
    this.currentUser = null; this.isAdmin = false;
    sessionStorage.clear();
    window.location.href = 'login.html';
  },
  requireLogin() {
    if (!this.currentUser) { window.location.href = 'login.html'; return false; }
    return true;
  },
  requireAdmin() {
    if (!this.isAdmin) { window.location.href = 'dashboard.html'; return false; }
    return true;
  },

  /* ── Reviews helpers ── */
  addReview(data) {
    const rev = {
      ...data,
      id: this.reviews.length + 1,
      studentId:   this.currentUser.id,
      studentName: this.currentUser.name,
      region:      this.currentUser.region,
      date:        new Date().toISOString().split('T')[0],
    };
    this.reviews.push(rev);
    this.saveReviews();
    return rev;
  },
  getMyReviews() {
    return this.reviews.filter(r => r.studentId === this.currentUser?.id);
  },

  /* ── Analytics helpers ── */
  getAnalytics() {
    const north = this.reviews.filter(r => r.region === 'North');
    const south = this.reviews.filter(r => r.region === 'South');
    const avg   = arr => arr.length ? +(arr.reduce((s,r) => s+r.overall,0)/arr.length).toFixed(1) : 0;
    const mealAvg = (arr, meal) => {
      const m = arr.filter(r => r.meal === meal);
      return m.length ? +(m.reduce((s,r) => s+r.overall,0)/m.length).toFixed(1) : 0;
    };
    return {
      northAvg: avg(north), southAvg: avg(south),
      northCount: north.length, southCount: south.length,
      mealRatings: ['Breakfast','Lunch','Snacks','Dinner'].map(m => ({
        meal: m,
        North: mealAvg(north, m) || [4.2,3.6,3.2,4.0][['Breakfast','Lunch','Snacks','Dinner'].indexOf(m)],
        South: mealAvg(south, m) || [3.8,4.5,3.9,3.7][['Breakfast','Lunch','Snacks','Dinner'].indexOf(m)],
      })),
      weeklyTrend: [
        {day:'Mon', North:3.8, South:4.1},{day:'Tue', North:4.2, South:3.9},
        {day:'Wed', North:3.5, South:4.3},{day:'Thu', North:4.0, South:4.0},
        {day:'Fri', North:3.7, South:4.2},{day:'Sat', North:4.5, South:3.8},
        {day:'Sun', North:4.1, South:4.4},
      ],
    };
  },
};

/* ── TOAST ─────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = (type==='success'?'✅ ':type==='error'?'❌ ':'ℹ️ ') + msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ── NAVBAR RENDERER ───────────────────────────────────────── */
function renderNavbar(links = []) {
  const user = HostelBite.currentUser;
  const isAdmin = HostelBite.isAdmin;
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const linksHTML = links.map(l =>
    `<button class="nav-link" onclick="window.location.href='${l.href}'">${l.label}</button>`
  ).join('');

  const userHTML = user ? `
    <div class="nav-avatar ${isAdmin ? 'admin' : user.region?.toLowerCase()}">${user.avatar || 'AD'}</div>
    <button class="nav-link" onclick="HostelBite.logout()">Logout</button>
  ` : `
    <button class="btn btn-sm btn-primary" onclick="window.location.href='login.html'">Login</button>
  `;

  nav.innerHTML = `
    <a class="navbar-brand" href="${isAdmin ? 'admin-dashboard.html' : user ? 'dashboard.html' : 'index.html'}">
      <span style="font-size:24px">🍽️</span>
      <span class="logo-text">HostelBite</span>
    </a>
    <div class="navbar-links">
      ${linksHTML}
      ${userHTML}
    </div>
  `;
}

/* ── STAR RATING WIDGET ─────────────────────────────────────── */
function initStarRating(containerId, onChange) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  let current = 0;
  wrap.innerHTML = [1,2,3,4,5].map(i =>
    `<span class="star" data-val="${i}" onclick="void(0)">⭐</span>`
  ).join('');
  const stars = wrap.querySelectorAll('.star');
  const setActive = (n, isHover=false) => {
    stars.forEach((s,i) => {
      s.classList.toggle('active', !isHover && i < current);
      s.classList.toggle('hover', isHover && i < n);
    });
  };
  stars.forEach((s, idx) => {
    s.addEventListener('click',      () => { current = idx+1; setActive(current); onChange && onChange(current); });
    s.addEventListener('mouseenter', () => setActive(idx+1, true));
    s.addEventListener('mouseleave', () => setActive(0, true));
  });
  return { getValue: () => current, reset: () => { current=0; setActive(0); } };
}

/* ── REGION BADGE ───────────────────────────────────────────── */
function regionBadge(region) {
  const isNorth = region === 'North';
  return `<span class="badge badge-${isNorth?'north':'south'}">${isNorth?'🟠 North':'🟢 South'}</span>`;
}

/* ── VEG DOT ─────────────────────────────────────────────────── */
function vegDot(veg) {
  return `<span class="veg-dot ${veg?'veg':'nonveg'}"><span class="inner"></span></span>`;
}

/* ── OVERALL COLOR ──────────────────────────────────────────── */
function ratingClass(val) {
  return val >= 4 ? 'badge-rating-high' : val >= 3 ? 'badge-rating-mid' : 'badge-rating-low';
}

/* ── FORMAT DATE ────────────────────────────────────────────── */
function todayStr() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
}

/* ── EXPORT CSV ─────────────────────────────────────────────── */
function exportCSV(rows, filename) {
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,"'")}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = filename; a.click();
}
