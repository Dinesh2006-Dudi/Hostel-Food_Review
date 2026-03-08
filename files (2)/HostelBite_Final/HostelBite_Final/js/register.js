// ============================================================
//  HostelBite — Module 1: Register JS
//  File: js/register.js
// ============================================================

const NORTH_STATES = ['Uttar Pradesh','Bihar','Rajasthan','Haryana','Punjab','Delhi','Madhya Pradesh','Uttarakhand','Himachal Pradesh','Jharkhand','Chhattisgarh'];
const SOUTH_STATES = ['Tamil Nadu','Kerala','Karnataka','Andhra Pradesh','Telangana','Puducherry','Goa'];

let selectedRegion = '';

/* ── Region selector ── */
window.selectRegion = function (region) {
  selectedRegion = region;
  document.getElementById('region-north').classList.toggle('active', region === 'North');
  document.getElementById('region-south').classList.toggle('active', region === 'South');

  const states = region === 'North' ? NORTH_STATES : SOUTH_STATES;
  const stateSelect = document.getElementById('state');
  stateSelect.innerHTML = '<option value="">Select State</option>' +
    states.map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('state-group').style.display = 'block';
};

/* ── Step 1 → Step 2 ── */
document.getElementById('step1-next').addEventListener('click', () => {
  const name      = document.getElementById('name').value.trim();
  const email     = document.getElementById('email').value.trim();
  const password  = document.getElementById('password').value;
  const studentId = document.getElementById('studentId').value.trim();

  if (!name || !email || !password || !studentId) {
    showToast('Please fill in all fields.', 'error'); return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters.', 'error'); return;
  }
  if (HostelBite.students.find(s => s.email === email)) {
    showToast('Email already registered!', 'error'); return;
  }

  // Go to step 2
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  document.getElementById('progress-fill').style.width = '100%';
  document.getElementById('step-label').textContent = 'Step 2 of 2 — Hostel & Region';
});

/* ── Step 2 → Step 1 ── */
document.getElementById('step2-back').addEventListener('click', () => {
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  document.getElementById('progress-fill').style.width = '50%';
  document.getElementById('step-label').textContent = 'Step 1 of 2 — Basic Information';
});

/* ── Submit ── */
document.getElementById('step2-submit').addEventListener('click', async () => {
  const room   = document.getElementById('room').value.trim();
  const course = document.getElementById('course').value.trim();
  const year   = document.getElementById('year').value;
  const state  = document.getElementById('state').value;

  if (!room || !course) { showToast('Please fill in Room and Course.', 'error'); return; }
  if (!selectedRegion)  { showToast('Please select your region (North / South).', 'error'); return; }
  if (!state)           { showToast('Please select your home state.', 'error'); return; }

  const name      = document.getElementById('name').value.trim();
  const email     = document.getElementById('email').value.trim();
  const password  = document.getElementById('password').value;
  const studentId = document.getElementById('studentId').value.trim();

  const btn = document.getElementById('step2-submit');
  btn.textContent = 'Creating...'; btn.disabled = true;
  await new Promise(r => setTimeout(r, 700));

  const avatar = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const newStudent = {
    id: HostelBite.students.length + 1,
    name, email, password, studentId, room, course, year,
    region: selectedRegion, state, avatar,
  };

  HostelBite.students.push(newStudent);
  HostelBite.saveStudents();
  HostelBite.currentUser = newStudent;
  HostelBite.isAdmin = false;
  HostelBite.saveSession();

  showToast(`Welcome, ${name.split(' ')[0]}! Account created 🎉`, 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
});
