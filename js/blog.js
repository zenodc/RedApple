document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('articles');
  container.innerHTML = '';

  // Loader + messaggio server in avvio
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = `
    <div class="spinner"></div>
    <p>Server in avvio, attendere prego…</p>
  `;
  container.appendChild(loader);

  // Funzione per caricare i post
  async function fetchPosts() {
    try {
      const res = await fetch('https://blog-comments-api.onrender.com/posts');
      if (!res.ok) throw new Error('Server non pronto');

      const posts = await res.json();

      // Puliamo il container e rimuoviamo loader
      container.innerHTML = '';

      posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post';

        // Nota: gli excerpt restano in HTML semplice
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
            ${post.excerpt || ''}
          </div>
        `;

        container.appendChild(article);
      });

    } catch (err) {
      console.warn('Server non pronto, riprovo tra 2 secondi...');
      setTimeout(fetchPosts, 2000);
    }
  }

  // Avvio primo fetch
  fetchPosts();
});
