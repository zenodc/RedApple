// js/admin.js

const API_BASE = 'https://blog-comments-api.onrender.com';

let token = null;

// -------- LOGIN --------
document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('login-msg');

  msg.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.message || 'Errore login';
      return;
    }

    token = data.token;
    msg.textContent = 'Login effettuato ✅';
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('post-section').classList.remove('hidden');

  } catch (err) {
    console.error(err);
    msg.textContent = 'Errore di connessione';
  }
});

// -------- CREAZIONE POST --------
document.getElementById('create-btn').addEventListener('click', async () => {
  if (!token) return alert('Non sei loggato');

  const title = document.getElementById('post-title').value;
  const slug = document.getElementById('post-slug').value;
  const excerpt = document.getElementById('post-excerpt').value;
  const content = document.getElementById('post-content').value;
  const published = document.getElementById('post-published').checked;
  const msg = document.getElementById('post-msg');

  msg.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, slug, excerpt, content, published })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.message || 'Errore creazione post';
      return;
    }

    msg.textContent = 'Post creato ✅';
    // reset form
    document.getElementById('post-title').value = '';
    document.getElementById('post-slug').value = '';
    document.getElementById('post-excerpt').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-published').checked = true;

  } catch (err) {
    console.error(err);
    msg.textContent = 'Errore di connessione';
  }
});
