const API_URL = "https://blog-comments-api.onrender.com";

// =======================
// ELEMENTI DOM
// =======================
const loginSection = document.getElementById("login-section");
const cmsSection = document.getElementById("cms-section");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const loginError = document.getElementById("login-error");
const cmsMessage = document.getElementById("cms-message");

const postForm = document.getElementById("postForm");
const postsList = document.getElementById("postsList");
const postIdInput = document.getElementById("postId");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const resetBtn = document.getElementById("resetForm");

// =======================
// STATO AUTH
// =======================
function getToken() {
  return localStorage.getItem("token");
}

function showLogin() {
  loginSection.style.display = "block";
  cmsSection.style.display = "none";
}

function showCMS() {
  loginSection.style.display = "none";
  cmsSection.style.display = "block";
  fetchPosts();
}

// =======================
// AVVIO
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  token ? showCMS() : showLogin();
});

// =======================
// LOGIN
// =======================
loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) throw new Error("Credenziali non valide");

    const data = await res.json();
    localStorage.setItem("token", data.token);
    showCMS();

  } catch (err) {
    loginError.textContent = err.message;
  }
});

// =======================
// LOGOUT
// =======================
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  showLogin();
});

// =======================
// CREA / MODIFICA POST
// =======================
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = getToken();
  if (!token) return showLogin();

  const id = postIdInput.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Titolo e contenuto obbligatori");
    return;
  }

  try {
    const res = await fetch(
      id ? `${API_URL}/posts/${id}` : `${API_URL}/posts`,
      {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      }
    );

    if (!res.ok) throw new Error("Errore nella pubblicazione");

    postForm.reset();
    postIdInput.value = "";
    fetchPosts();

  } catch (err) {
    alert(err.message);
  }
});

// =======================
// RESET FORM
// =======================
resetBtn.addEventListener("click", () => {
  postForm.reset();
  postIdInput.value = "";
});

// =======================
// FETCH POST
// =======================
async function fetchPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error("Errore caricamento post");

    const posts = await res.json();
    renderPosts(posts);

  } catch (err) {
    postsList.innerHTML = "<p>Errore nel caricamento</p>";
  }
}

// =======================
// RENDER POST
// =======================
function renderPosts(posts) {
  postsList.innerHTML = "";

  if (!posts.length) {
    postsList.innerHTML = "<p>Nessun post</p>";
    return;
  }

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "postItem";
    div.innerHTML = `
      <h3>${post.title}</h3>
      <button onclick="editPost('${post._id}', \`${escapeHtml(post.title)}\`, \`${escapeHtml(post.content)}\`)">Modifica</button>
      <button onclick="deletePost('${post._id}')">Elimina</button>
      <hr>
    `;
    postsList.appendChild(div);
  });
}

// =======================
// EDIT / DELETE
// =======================
function editPost(id, title, content) {
  postIdInput.value = id;
  titleInput.value = title;
  contentInput.value = content;
}

async function deletePost(id) {
  if (!confirm("Cancellare questo post?")) return;

  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Errore cancellazione");
    fetchPosts();

  } catch (err) {
    alert(err.message);
  }
}

// =======================
// UTILS
// =======================
function escapeHtml(str) {
  return str.replace(/`/g, "\\`").replace(/\$/g, "\\$");
}
