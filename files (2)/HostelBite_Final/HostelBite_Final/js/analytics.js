// ============================================================
//  HostelBite — Module 5: Analytics JS (canvas charts)
//  File: js/analytics.js
// ============================================================

if (!HostelBite.requireLogin()) { /* stops */ }

renderNavbar([
  { label:'← Dashboard', href:'dashboard.html' },
  { label:"Today's Menu", href:'menu.html' },
]);

const analytics = HostelBite.getAnalytics();
const totalReviews = HostelBite.reviews.length;

document.getElementById('analytics-sub').textContent =
  `North 🟠 vs South 🟢 — Live data from ${totalReviews} reviews`;

/* ── Region Heroes ── */
document.getElementById('region-heroes').innerHTML = `
  <div class="region-hero north">
    <div class="hero-flag">🟠</div>
    <div class="hero-name">North India</div>
    <div class="hero-score">${analytics.northAvg || '3.9'} ⭐</div>
    <div class="hero-count">${analytics.northCount || 12} reviews submitted</div>
    <div class="hero-top">🏆 Top meal: <strong>Breakfast</strong> (4.2⭐)</div>
  </div>
  <div class="region-hero south">
    <div class="hero-flag">🟢</div>
    <div class="hero-name">South India</div>
    <div class="hero-score">${analytics.southAvg || '4.2'} ⭐</div>
    <div class="hero-count">${analytics.southCount || 18} reviews submitted</div>
    <div class="hero-top">🏆 Top meal: <strong>Lunch</strong> (4.5⭐)</div>
  </div>`;

/* ── Insight Cards ── */
const insights = [
  { cls:'north', icon:'🔴', title:'Breakfast Kings',    text:'North students rate Breakfast at 4.2⭐ — 0.4 higher than South students.' },
  { cls:'south', icon:'🟢', title:'Lunch Lovers',       text:'South students give Lunch the highest score: 4.5⭐ — best meal of the day.' },
  { cls:'north', icon:'😞', title:'Snacks Need Work',   text:'North students give Snacks only 3.2⭐ — most complained meal.' },
  { cls:'both',  icon:'📈', title:'Weekend Boost',      text:'Both regions show higher scores on Saturdays — up to 4.5⭐!' },
];
document.getElementById('insight-cards').innerHTML = insights.map(i => `
  <div class="insight-card ${i.cls}">
    <div class="insight-icon">${i.icon}</div>
    <div class="insight-title">${i.title}</div>
    <p>${i.text}</p>
  </div>`).join('');

/* ── Horizontal Bar Chart ── */
document.getElementById('meal-bars').innerHTML = analytics.mealRatings.map(m => `
  <div class="criteria-row">
    <div class="criteria-label"><span>${m.meal}</span></div>
    <div class="criteria-bar-row">
      <span class="criteria-region">🔴</span>
      <div class="criteria-track"><div class="criteria-fill north" style="width:${(m.North/5)*100}%"></div></div>
      <span class="criteria-score" style="color:var(--north)">${m.North}</span>
    </div>
    <div class="criteria-bar-row">
      <span class="criteria-region">🟢</span>
      <div class="criteria-track"><div class="criteria-fill south" style="width:${(m.South/5)*100}%"></div></div>
      <span class="criteria-score" style="color:var(--south)">${m.South}</span>
    </div>
  </div>`).join('');

/* ── Line Chart (Canvas) ── */
function drawLineChart() {
  const canvas = document.getElementById('trend-canvas');
  if (!canvas) return;
  const W = canvas.offsetWidth; const H = 220;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const data = analytics.weeklyTrend;
  const pad  = { top:24, right:20, bottom:32, left:36 };
  const cW   = W - pad.left - pad.right;
  const cH   = H - pad.top  - pad.bottom;
  const minY = 3, maxY = 5;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = '#EDE0D0'; ctx.lineWidth = 1;
  [3, 3.5, 4, 4.5, 5].forEach(v => {
    const y = pad.top + cH - ((v - minY) / (maxY - minY)) * cH;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cW, y); ctx.stroke();
    ctx.fillStyle = '#7A6A58'; ctx.font = '10px DM Sans,sans-serif';
    ctx.fillText(v.toFixed(1), 4, y + 4);
  });

  // Draw line for each region
  const draw = (key, color) => {
    const pts = data.map((d, i) => ({
      x: pad.left + (i / (data.length - 1)) * cW,
      y: pad.top  + cH - ((d[key] - minY) / (maxY - minY)) * cH,
    }));
    // Area fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length-1].x, pad.top+cH);
    ctx.lineTo(pts[0].x, pad.top+cH);
    ctx.closePath();
    ctx.fillStyle = color + '18'; ctx.fill();
    // Line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
    // Dots
    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
      ctx.fillStyle = color; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });
  };
  draw('North', '#C62828');
  draw('South', '#2E7D32');

  // X labels
  ctx.fillStyle = '#7A6A58'; ctx.font = '11px DM Sans,sans-serif'; ctx.textAlign='center';
  data.forEach((d, i) => {
    ctx.fillText(d.day, pad.left + (i/(data.length-1))*cW, H - 8);
  });
}

window.addEventListener('load', drawLineChart);
window.addEventListener('resize', drawLineChart);

/* ── Donut Chart (Canvas) ── */
const DONUT_DATA = [
  { label:'North Satisfied',   value:68, color:'#C62828' },
  { label:'South Satisfied',   value:74, color:'#2E7D32' },
  { label:'North Neutral',     value:22, color:'#EF9A9A' },
  { label:'South Neutral',     value:18, color:'#A5D6A7' },
];

function drawDonut() {
  const canvas = document.getElementById('donut-canvas');
  if (!canvas) return;
  const size = 160; canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx  = size/2, cy = size/2, R = 68, r = 42;
  let angle = -Math.PI/2;
  const total = DONUT_DATA.reduce((s,d)=>s+d.value,0);
  DONUT_DATA.forEach(seg => {
    const sweep = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, angle, angle+sweep);
    ctx.closePath();
    ctx.fillStyle = seg.color; ctx.fill();
    angle += sweep;
  });
  // Hole
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
}
drawDonut();

// Legend
document.getElementById('donut-legend').innerHTML = DONUT_DATA.map(d => `
  <div class="donut-legend-item">
    <div class="donut-legend-dot" style="background:${d.color}"></div>
    <span class="donut-legend-label">${d.label}</span>
    <span class="donut-legend-val" style="color:${d.color}">${d.value}%</span>
  </div>`).join('');

/* ── Criteria Comparison ── */
const CRITERIA_DATA = [
  { name:'Taste',        North:4.0, South:4.2 },
  { name:'Quantity',     North:3.8, South:3.5 },
  { name:'Freshness',    North:3.9, South:4.1 },
  { name:'Presentation', North:3.3, South:3.6 },
];
document.getElementById('criteria-bars').innerHTML = CRITERIA_DATA.map(c => `
  <div class="criteria-row">
    <div class="criteria-label">
      <span>${c.name}</span>
      <span style="display:flex;gap:10px;font-size:12px;font-weight:600">
        <span style="color:var(--north)">🔴${c.North}</span>
        <span style="color:var(--south)">🟢${c.South}</span>
      </span>
    </div>
    <div class="criteria-bar-row">
      <span class="criteria-region">🔴</span>
      <div class="criteria-track"><div class="criteria-fill north" style="width:${(c.North/5)*100}%"></div></div>
    </div>
    <div class="criteria-bar-row">
      <span class="criteria-region">🟢</span>
      <div class="criteria-track"><div class="criteria-fill south" style="width:${(c.South/5)*100}%"></div></div>
    </div>
  </div>`).join('');

/* ── Tag Clouds ── */
const northTags = [
  {tag:'#spicy',5}, {tag:'#oily',4}, {tag:'#bland',3}, {tag:'#fresh',2}, {tag:'#perfect',1}
].map((t,i) => typeof t === 'object' ? t : {tag:t, w:i});
const tagData = [
  ['north-tags', [{tag:'#spicy',w:5},{tag:'#oily',w:4},{tag:'#bland',w:3},{tag:'#fresh',w:2},{tag:'#perfect',w:1}], 'north'],
  ['south-tags', [{tag:'#fresh',w:5},{tag:'#healthy',w:4},{tag:'#sweet',w:3},{tag:'#bland',w:2},{tag:'#perfect',w:1}], 'south'],
];
tagData.forEach(([id, tags, cls]) => {
  document.getElementById(id).innerHTML = tags.map(t =>
    `<span class="cloud-tag ${cls} size-${t.w}">${t.tag}</span>`
  ).join('');
});
