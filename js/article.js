import { preprocessDialogue, extractExcerpt } from './dialogueUtils.js';

// =======================
// Utility
// =======================

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

// =======================
// Fetch post
// =======================

async function fetchPost(slug) {
  try {
    const res = await fetch(`https://blog-comments-api.onrender.com/posts/${slug}`);
    if (!res.ok) throw new Error('Post non trovato');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// =======================
// Rendering post
// =======================

function renderPost(post) {
  const container = document.getElementById('post');

  if (!post) {
    container.innerHTML = '<p>Articolo non trovato.</p>';
    return;
  }

  const processedContent = preprocessDialogue(post.content);
  const parsedContent = marked.parse(processedContent);

  container.innerHTML = `
    <h1 class="post-title">${post.title}</h1>

    <div class="post-meta">
      <time datetime="${post.createdAt}">
        ${new Date(post.createdAt).toLocaleDateString('it-IT')}
      </time>
    </div>

    <div class="post-content">
      ${parsedContent}
    </div>
  `;
}

// =======================
// Commenti 
// =======================

async function renderComments(postId) {
  const list = document.getElementById('comments-list');
  list.innerHTML = '<p>Caricamento commenti…</p>';

  try {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
    const comments = await res.json();

    list.innerHTML = '';

    if (comments.length === 0) {
      list.innerHTML = '<p>Nessun commento.</p>';
      return;
    }

    comments.forEach(c => {
      const div = document.createElement('div');
      div.className = 'comment';

      div.innerHTML = `
        <div class="comment-meta">
          <strong>${c.author}</strong> —
          ${new Date(c.date).toLocaleDateString('it-IT')}
        </div>
        <div class="comment-text">
          ${c.text}
        </div>
      `;

      list.appendChild(div);
    });

  } catch (err) {
    list.innerHTML = '<p>Errore nel caricamento dei commenti.</p>';
  }
}

function setupCommentForm(postId) {
  const form = document.getElementById('comment-form');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const author = document.getElementById('author').value;
    const text = document.getElementById('comment-text').value;

    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, text })
      });

      if (!res.ok) {
        throw new Error('Errore POST');
      }

      form.reset();
      renderComments(postId);

    } catch (err) {
      alert('Errore nell’invio del commento');
    }
  });
}


// =======================
// Bootstrap
// =======================

document.addEventListener('DOMContentLoaded', async () => {
  const slug = getSlug();
  if (!slug) return;

  const post = await fetchPost(slug);
  renderPost(post);

  if (post && post._id) {
    renderComments(post._id);
    setupCommentForm(post._id);
  }
});
