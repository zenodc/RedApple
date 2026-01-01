// js/article.js

// 1. Stessi articoli mock di blog.js
function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

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

document.addEventListener('DOMContentLoaded', async () => {
  const slug = getSlug();
  const post = await fetchPost(slug);
  renderPost(post);
  renderComments(post?._id); // qui puoi poi fare fetch commenti reali
});


// Commenti mock
const mockComments = {
  1: [
    {
      author: "Mario",
      text: "Articolo molto interessante, grazie.",
      date: "2025-01-02"
    }
  ],
  2: [
    {
      author: "Laura",
      text: "Condivido pienamente il discorso sulla musica.",
      date: "2025-01-11"
    },
    {
      author: "Giovanni",
      text: "Bellissimo riferimento al jazz.",
      date: "2025-01-12"
    }
  ],
  3: []
};


// 2. Legge l'id dall'URL
function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"), 10);
}

// 3. Rendering del singolo articolo
function renderPost(post) {
  const container = document.getElementById("post");

  if (!post) {
    container.innerHTML = "<p>Articolo non trovato.</p>";
    return;
  }

  container.innerHTML = `
    <h2 class="post-title">${post.title}</h2>

    <div class="post-meta">
      <time datetime="${post.date}">
        ${new Date(post.date).toLocaleDateString("it-IT")}
      </time>
    </div>

    <div class="post-content">
      <p>${post.text}</p>
    </div>

    <ul class="post-tags">
      ${post.tags.map(tag => `<li>#${tag}</li>`).join("")}
    </ul>
  `;
}

function renderComments(postId) {
  const list = document.getElementById("comments-list");
  list.innerHTML = "";

  const comments = mockComments[postId] || [];

  if (comments.length === 0) {
    list.innerHTML = "<p>Nessun commento.</p>";
    return;
  }

  comments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
      <div class="comment-meta">
        <strong>${c.author}</strong> — 
        ${new Date(c.date).toLocaleDateString("it-IT")}
      </div>
      <div class="comment-text">
        ${c.text}
      </div>
    `;

    list.appendChild(div);
  });
}

function setupCommentForm(postId) {
  const form = document.getElementById("comment-form");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const author = document.getElementById("author").value;
    const text = document.getElementById("comment-text").value;

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



// 4. Avvio
document.addEventListener("DOMContentLoaded", () => {
  const postId = getPostId();
  const post = mockPosts.find(p => p.id === postId);
  renderPost(post);
  renderComments(postId);
  setupCommentForm(postId);
});
