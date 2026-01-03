const API_URL = "https://blog-comments-api.onrender.com";

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
