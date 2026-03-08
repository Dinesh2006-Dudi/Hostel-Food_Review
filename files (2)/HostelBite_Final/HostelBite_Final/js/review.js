// ============================================================
//  HostelBite — Module 4: Review JS
//  File: js/review.js
// ============================================================

if (!HostelBite.requireLogin()) { /* stops */ }

const user = HostelBite.currentUser;

renderNavbar([
  { label:'← Dashboard', href:'dashboard.html' },
  { label:"Today's Menu", href:'menu.html' },
]);

/* ── State ── */
let selectedMeal   = 'Breakfast';
let selectedEmoji  = '';
let selectedTags   = [];
let ratings        = { taste:0, quantity:0, freshness:0, presentation:0 };
let starWidgets    = {};

const EMOJIS = [
  { icon:'😍', label:'Loved it!' },
  { icon:'😊', label:'Good' },
  { icon:'😐', label:'Okay' },
  { icon:'😞', label:"Didn't like" },
  { icon:'🤢', label:'Terrible' },
];
const TAGS = ['#spicy','#bland','#sweet','#healthy','#oily','#fresh','#undercooked','#overcooked','#perfect','#salty'];
const CRITERIA = [
  { key:'taste',        label:'Taste',        icon:'👅' },
  { key:'quantity',     label:'Quantity',     icon:'🍲' },
  { key:'freshness',    label:'Freshness',    icon:'🌿' },
  { key:'presentation', label:'Presentation', icon:'🎨' },
];

/* ── Rating as ── */
document.getElementById('rating-as').innerHTML =
  `Rating as <strong>${user.name}</strong> ` + regionBadge(user.region);

/* ── Meal Tabs ── */
const meals = Object.entries(HostelBite.menu);
document.getElementById('meal-tabs').innerHTML = meals.map(([meal, data]) => `
  <div class="meal-tab ${meal === selectedMeal ? 'active' : ''}" id="tab-${meal}" onclick="selectMeal('${meal}')">
    <div class="tab-emoji">${data.emoji}</div>
    <div class="tab-name">${meal}</div>
    <div class="tab-time">${data.time.split('–')[0].trim()}</div>
  </div>`).join('');

/* ── Select meal ── */
window.selectMeal = function(meal) {
  selectedMeal = meal;
  document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + meal).classList.add('active');
};

/* ── Criteria Star Rows ── */
document.getElementById('criteria-rows').innerHTML = CRITERIA.map(c => `
  <div class="rating-row">
    <span class="rl">${c.icon} ${c.label}</span>
    <div class="stars" id="stars-${c.key}">
      ${[1,2,3,4,5].map(i => `<span class="star" data-val="${i}" data-key="${c.key}">⭐</span>`).join('')}
    </div>
  </div>`).join('');

/* Wire star clicks */
CRITERIA.forEach(c => {
  const container = document.getElementById('stars-' + c.key);
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, idx) => {
    star.addEventListener('click', () => {
      ratings[c.key] = idx + 1;
      stars.forEach((s, i) => {
        s.classList.toggle('active', i <= idx);
        s.style.filter = i <= idx ? 'none' : 'grayscale(1) opacity(0.35)';
      });
      updateOverall();
    });
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => {
        s.style.filter = i <= idx ? 'none' : 'grayscale(1) opacity(0.35)';
      });
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => {
        s.style.filter = i < ratings[c.key] ? 'none' : 'grayscale(1) opacity(0.35)';
      });
    });
  });
});

function updateOverall() {
  const vals = Object.values(ratings).filter(Boolean);
  if (!vals.length) return;
  const overall = (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
  const color = overall >= 4 ? '#2E7D32' : overall >= 3 ? '#F57F17' : '#C62828';
  const word  = overall >= 4.5 ? 'Excellent! 🎉' : overall >= 4 ? 'Great! 😍' : overall >= 3 ? 'Decent 😊' : 'Below average 😞';
  const badge = document.getElementById('overall-badge');
  badge.style.display = 'block';
  badge.style.background = `linear-gradient(135deg,${color},${color}99)`;
  badge.innerHTML = `
    <div class="ob-label">Overall Score</div>
    <div class="ob-score">${overall} ⭐</div>
    <div class="ob-word">${word}</div>`;
}

/* ── Emoji Picker ── */
document.getElementById('emoji-picker').innerHTML = EMOJIS.map(e => `
  <button class="emoji-btn" id="emoji-${e.icon}" onclick="selectEmoji('${e.icon}')">
    <span class="emoji-icon">${e.icon}</span>
    <span class="emoji-label">${e.label}</span>
  </button>`).join('');

window.selectEmoji = function(emoji) {
  selectedEmoji = emoji;
  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('emoji-' + emoji).classList.add('active');
};

/* ── Tags ── */
document.getElementById('tags-row').innerHTML = TAGS.map(t => `
  <span class="tag" id="tag-${t.slice(1)}" onclick="toggleTag('${t}')">${t}</span>`).join('');

window.toggleTag = function(tag) {
  const id = 'tag-' + tag.slice(1);
  const el = document.getElementById(id);
  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
    el.classList.remove('active');
  } else {
    selectedTags.push(tag);
    el.classList.add('active');
  }
};

/* ── Comment char count ── */
document.getElementById('comment').addEventListener('input', function() {
  const cnt = document.getElementById('char-count');
  cnt.textContent = `${this.value.length} / 300 characters`;
  cnt.style.color = this.value.length > 250 ? 'var(--north)' : 'var(--muted)';
});

/* ── Submit ── */
window.submitReview = function() {
  const vals = Object.values(ratings).filter(Boolean);
  if (vals.length < 4) { showToast('Please rate all 4 criteria.', 'error'); return; }
  if (!selectedEmoji)  { showToast('Please select an emoji reaction!', 'error'); return; }

  const overall = +(vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(2);
  const comment = document.getElementById('comment').value.trim();

  HostelBite.addReview({ meal:selectedMeal, ratings:{...ratings}, overall, comment, emoji:selectedEmoji, tags:[...selectedTags] });

  // Show success
  document.getElementById('ss-emoji').textContent = selectedEmoji;
  document.getElementById('ss-meal').textContent  = selectedMeal;
  document.getElementById('ss-score').textContent = `${overall} ⭐`;
  document.getElementById('review-form-wrap').style.display = 'none';
  document.getElementById('success-screen').style.display = 'block';
};

/* ── Reset ── */
window.resetReview = function() {
  ratings = { taste:0, quantity:0, freshness:0, presentation:0 };
  selectedEmoji = ''; selectedTags = [];
  document.querySelectorAll('.star').forEach(s => { s.classList.remove('active'); s.style.filter='grayscale(1) opacity(0.35)'; });
  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  document.getElementById('comment').value = '';
  document.getElementById('char-count').textContent = '0 / 300 characters';
  document.getElementById('overall-badge').style.display = 'none';
  document.getElementById('review-form-wrap').style.display = 'block';
  document.getElementById('success-screen').style.display = 'none';
};
