document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('articles');
  container.innerHTML = '';

  try {
    const res = await fetch('https://blog-comments-api.onrender.com/posts');
    if (!res.ok) throw new Error('Errore fetch post');

    const posts = await res.json();

    posts.forEach(post => {
      const article = document.createElement('article');
      article.className = 'post';

      // parsing Markdown dell'excerpt
      const parsedExcerpt = marked.parse(post.excerpt || '');

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
          ${parsedExcerpt}
        </div>
      `;

      container.appendChild(article);
    });

  } catch (err) {
    container.innerHTML = '<p>Errore nel caricamento dei post.</p>';
    console.error(err);
  }
});
