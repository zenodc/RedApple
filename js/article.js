// js/article.js

// 1. Stessi articoli mock di blog.js
const mockPosts = [
  {
    id: 1,
    title: "Il primo articolo del blog",
    text: "Questo è il testo completo del primo articolo. Serve solo come esempio per verificare il rendering dinamico della pagina principale.",
    date: "2025-01-01",
    tags: ["filosofia", "scrittura"]
  },
  {
    id: 2,
    title: "Un pensiero sulla musica",
    text: "La musica non è solo suono, ma forma del tempo. Questo articolo è un altro esempio di contenuto che verrà caricato dinamicamente.",
    date: "2025-01-10",
    tags: ["musica", "jazz"]
  },
  {
    id: 3,
    title: "Appunti sparsi",
    text: "A volte un blog nasce proprio così: da appunti sparsi che lentamente trovano una struttura.",
    date: "2025-01-20",
    tags: ["note"]
  }
];

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

// 4. Avvio
document.addEventListener("DOMContentLoaded", () => {
  const postId = getPostId();
  const post = mockPosts.find(p => p.id === postId);
  renderPost(post);
});
