import { preprocessDialogue, extractExcerpt } from './dialogueUtils.js';

const container = document.getElementById('articles');

// Puliamo eventuale loader iniziale
container.innerHTML = '';

async function fetchPosts() {
  try {
    const res = await fetch('https://blog-comments-api.onrender.com/posts');
    if (!res.ok) throw new Error('Server non pronto');

    const posts = await res.json();

    // Puliamo container prima di inserire i post
    container.innerHTML = '';

    posts.forEach(post => {
      const excerptMd = extractExcerpt(post.content);
      const processed = preprocessDialogue(excerptMd);
      const excerptHtml = marked.parse(processed);

      const article = document.createElement('article');
      article.className = 'post';
      article.innerHTML = `
        <h2 class="post-title">
          <a href="article.html?slug=${post.slug}">${post.title}</a>
        </h2>

        <div class="post-meta">
          <time datetime="${post.createdAt}">
            ${new Date(post.createdAt).toLocaleDateString('it-IT')}
          </time>
        </div>

        <div class="post-excerpt">
          ${excerptHtml}
        </div>
      `;

      container.appendChild(article);
    });

  } catch (err) {
    console.warn('Server non pronto, riprovo tra 2 secondi...');
    setTimeout(fetchPosts, 2000);
  }
}

// Avvio immediato
fetchPosts();
