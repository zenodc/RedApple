// js/blog.js

// 1. fetch per ottenere gli articoli

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('articles');
  container.innerHTML = '';

  try {
    const res = await fetch('https://blog-comments-api.onrender.com/posts');
    const posts = await res.json();

    posts.forEach(post => {
      const article = document.createElement('article');
      article.className = 'post';

      article.innerHTML = `
        <h2 class="post-title">
          <a href="article.html?slug=${post.slug}">${post.title}</a>
        </h2>

        <div class="post-meta">
          <time datetime="${post.createdAt}">${new Date(post.createdAt).toLocaleDateString('it-IT')}</time>
        </div>

        <p class="post-excerpt">
          ${post.excerpt}
        </p>

        <ul class="post-tags">
          ${post.tags ? post.tags.map(tag => `<li>#${tag}</li>`).join('') : ''}
        </ul>
      `;

      container.appendChild(article);
    });

  } catch (err) {
    container.innerHTML = '<p>Errore nel caricamento dei post.</p>';
    console.error(err);
  }
});


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

     // <ul class="post-tags">
   //     ${post.tags.map(tag => `<li>#${tag}</li>`).join("")}
  //    </ul>
  //  `;

    container.appendChild(article);
  });
}

