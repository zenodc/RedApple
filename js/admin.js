const API_URL = "https://blog-comments-api.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
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
  // GESTIONE TOKEN
  // =======================
  function getToken() {
    return localStorage.getItem("token");
  }

  function showLogin() {
    loginSection.style.display = "block";
    cmsSection.style.display = "none";
    cmsMessage.textContent = "";
  }

  function showCMS() {
    loginSection.style.display = "none";
    cmsSection.style.display = "block";
    cmsMessage.textContent = "";
    fetchPosts();
  }

  // =======================
  // AVVIO
  // =======================
  getToken() ? showCMS() : showLogin();

  // =======================
  // LOGIN
  // =======================
  loginBtn.addEventListener("click", async () => {
    loginError.textContent = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      loginError.textContent = "Inserisci username e password";
      return;
    }

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
      postsList.innerHTML = "<p>Errore nel caricamento dei post</p>";
    }
  }

  // =======================
  // RENDER POSTS
  // =======================
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
        <button onclick="editPost('${post._id}')">Modifica</button>
        <button onclick="deletePost('${post._id}')">Elimina</button>
        <hr>
      `;
      postsList.appendChild(div);
    });
  }

  // =======================
  // EDIT / DELETE
  // =======================
  window.editPost = async (id) => {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`);
      if (!res.ok) throw new Error("Errore recupero post");
      const post = await res.json();

      postIdInput.value = post._id;
      titleInput.value = post.title;
      contentInput.value = post.content;

      // opzionale: porta focus sul contenuto
      contentInput.focus();

    } catch (err) {
      alert(err.message);
    }
  };

  window.deletePost = async (id) => {
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
  };

});
