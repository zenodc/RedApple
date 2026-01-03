/* const API_URL = "https://blog-comments-api.onrender.com";

const loginSection = document.getElementById("login-section");
const cmsSection = document.getElementById("cms-section");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const publishBtn = document.getElementById("publish-btn");

const loginError = document.getElementById("login-error");
const cmsMessage = document.getElementById("cms-message");

// Controllo token all'avvio
const token = localStorage.getItem("token");
if (token) {
  showCMS();
}

loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Credenziali non valide");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    showCMS();

  } catch (err) {
    loginError.textContent = err.message;
  }
});

publishBtn.addEventListener("click", async () => {
  cmsMessage.textContent = "";

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  try {
    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ title, content })
    });

    if (!res.ok) {
      throw new Error("Errore nella pubblicazione");
    }

    cmsMessage.textContent = "Articolo pubblicato ✔";
    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

  } catch (err) {
    cmsMessage.textContent = err.message;
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  location.reload();
});

function showCMS() {
  loginSection.style.display = "none";
  cmsSection.style.display = "block";
}
*/
const API_URL = "https://blog-comments-api.onrender.com";
const token = localStorage.getItem("token");

const postForm = document.getElementById("postForm");
const postsList = document.getElementById("postsList");
const postIdInput = document.getElementById("postId");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const resetBtn = document.getElementById("resetForm");

// Carica lista post all'avvio
window.addEventListener("DOMContentLoaded", fetchPosts);

// Invia POST o PUT
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = postIdInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) return alert("Titolo e contenuto obbligatori");

  try {
    let res;
    if (id) {
      // Modifica
      res = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
    } else {
      // Creazione
      res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
    }

    if (!res.ok) throw new Error("Errore nella pubblicazione");

    postForm.reset();
    postIdInput.value = "";
    fetchPosts();

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
});

// Reset form
resetBtn.addEventListener("click", () => {
  postForm.reset();
  postIdInput.value = "";
});

// Funzione: carica lista post
async function fetchPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`, { method: "GET" });
    if (!res.ok) throw new Error("Errore nel caricamento dei post");

    const posts = await res.json();
    renderPosts(posts);

  } catch (err) {
    console.error(err);
    postsList.innerHTML = "<p>Errore nel caricamento dei post</p>";
  }
}

// Render lista post
function renderPosts(posts) {
  postsList.innerHTML = "";

  if (!posts.length) {
    postsList.innerHTML = "<p>Nessun post pubblicato</p>";
    return;
  }

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "postItem";
    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.excerpt || ""}</p>
      <button onclick="editPost('${post._id}', '${escapeHtml(post.title)}', '${escapeHtml(post.content)}')">Modifica</button>
      <button onclick="deletePost('${post._id}')">Elimina</button>
      <hr>
    `;
    postsList.appendChild(div);
  });
}

// Funzione: Modifica post
function editPost(id, title, content) {
  postIdInput.value = id;
  titleInput.value = unescapeHtml(title);
  contentInput.value = unescapeHtml(content);
}

// Funzione: elimina post
async function deletePost(id) {
  if (!confirm("Sei sicuro di voler cancellare questo post?")) return;

  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Errore nella cancellazione");

    fetchPosts();
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

// Escape HTML per sicurezza
function escapeHtml(str) {
  return str.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

function unescapeHtml(str) {
  return str.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

