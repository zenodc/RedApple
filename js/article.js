import { preprocessDialogue, extractExcerpt } from './dialogueUtils.js';

const excerptMd = extractExcerpt(post.content);
const processed = preprocessDialogue(excerptMd);
const excerptHtml = marked.parse(processed);


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
// rendering post
// =======================


  // 1. preprocessa il testo
  const processedContent = preprocessDialogue(post.content);

  // 2. parsing Markdown → HTML
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
// Commenti mock (temporanei)
// =======================

const mockComments = {
  // postId: [ { author, text, date } ]
};

function renderComments(postId) {
  const list = document.getElementById('comments-list');
  list.innerHTML = '';

  const comments = mockComments[postId] || [];

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
}

function setupCommentForm(postId) {
  const form = document.getElementById('comment-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    const author = document.getElementById('author').value;
    const text = document.getElementById('comment-text').value;

    const newComment = {
      author,
      text,
      date: new Date().toISOString()
    };

    if (!mockComments[postId]) {
      mockComments[postId] = [];
    }

    mockComments[postId].push(newComment);

    form.reset();
    renderComments(postId);
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
