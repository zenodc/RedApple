// js/blog.js

// 1. Articoli finti (mock)
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

// 2. Funzione per creare l’estratto
function createExcerpt(text, maxLength = 150) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "…";
}

// 3. Rendering degli articoli
function renderPosts(posts) {
  const container = document.getElementById("articles");
  container.innerHTML = "";

  posts.forEach(post => {
    const article = document.createElement("article");
    article.className = "post";

    article.innerHTML = `
      <h2 class="post-title">
        <a href="article.html?id=${post.id}">
          ${post.title}
        </a>
      </h2>

      <div class="post-meta">
        <time datetime="${post.date}">
          ${new Date(post.date).toLocaleDateString("it-IT")}
        </time>
      </div>

      <p class="post-excerpt">
        ${createExcerpt(post.text)}
      </p>

      <ul class="post-tags">
        ${post.tags.map(tag => `<li>#${tag}</li>`).join("")}
      </ul>
    `;

    container.appendChild(article);
  });
}

// 4. Avvio quando il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
  renderPosts(mockPosts);
});
