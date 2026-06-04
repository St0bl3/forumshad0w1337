const cursorDot = document.querySelector("#cursorDot");
const particleCanvas = document.querySelector("#particleCanvas");
const ctx = particleCanvas.getContext("2d");
const accountName = document.querySelector("#accountName");
const accountAction = document.querySelector("#accountAction");
const profilePanel = document.querySelector("#profilePanel");
const profileAvatar = document.querySelector("#profileAvatar");
const profileName = document.querySelector("#profileName");
const profileMeta = document.querySelector("#profileMeta");
const logoutButton = document.querySelector("#logoutButton");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const authMessage = document.querySelector("#authMessage");
const topicForm = document.querySelector("#topicForm");
const topicList = document.querySelector("#topicList");
const topicMessage = document.querySelector("#topicMessage");
const forumSearch = document.querySelector("#forumSearch");
const forumFilter = document.querySelector("#forumFilter");
const chatForm = document.querySelector("#chatForm");
const chatFeed = document.querySelector("#chatFeed");
const topicStat = document.querySelector("#topicStat");
const chatStat = document.querySelector("#chatStat");
const userStat = document.querySelector("#userStat");
const heroCount = document.querySelector("#heroCount");

const demoTopics = [
  {
    id: 1,
    title: "Какую фишку добавить на форум первой?",
    category: "Идеи",
    body: "Предлагайте идеи: реакции, рейтинги, красивые профили, закрепы, уведомления или темную/светлую тему.",
    author: "Pulse",
    date: "04.06.2026",
    replies: 18
  },
  {
    id: 2,
    title: "Правила уютного общения",
    category: "Общее",
    body: "Держим форум чистым: без спама, без токсичности, с нормальными названиями тем и уважением к другим.",
    author: "Admin",
    date: "04.06.2026",
    replies: 6
  },
  {
    id: 3,
    title: "Проблемы со входом или регистрацией",
    category: "Помощь",
    body: "Если не получается войти, проверьте ник, email и пароль. В демо-версии данные хранятся только в браузере.",
    author: "Support",
    date: "04.06.2026",
    replies: 9
  }
];

const demoMessages = [
  { author: "Pulse", text: "Форум обновлен: теперь без лишней тематики, просто красивое общение.", time: "20:55" },
  { author: "Admin", text: "Курсор с частицами уже работает, попробуй подвигать мышкой.", time: "20:56" },
  { author: "Support", text: "После регистрации можно писать темы и сообщения.", time: "20:57" }
];

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

let users = readStore("pulseUsers", []);
let currentUser = readStore("pulseCurrentUser", null);
let topics = readStore("pulseTopics", demoTopics);
let messages = readStore("pulseMessages", demoMessages);
let apiMode = location.protocol !== "file:";
let authToken = localStorage.getItem("pulseAuthToken") || "";
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let dot = { x: pointer.x, y: pointer.y };
let particles = [];

async function api(path, options = {}) {
  if (!apiMode) throw new Error("API is disabled for local file preview.");
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "API error");
  return data;
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  particleCanvas.width = Math.floor(window.innerWidth * ratio);
  particleCanvas.height = Math.floor(window.innerHeight * ratio);
  particleCanvas.style.width = `${window.innerWidth}px`;
  particleCanvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function addParticle(x, y, strong = false) {
  particles.push({
    x,
    y,
    vx: (Math.random() - 0.5) * (strong ? 4 : 1.8),
    vy: (Math.random() - 0.5) * (strong ? 4 : 1.8),
    life: strong ? 42 : 28,
    maxLife: strong ? 42 : 28,
    size: Math.random() * (strong ? 4 : 2.4) + 1,
    color: Math.random() > 0.72 ? "80,243,255" : "255,255,255"
  });
  if (particles.length > 180) particles.splice(0, particles.length - 180);
}

function animateCursor() {
  dot.x += (pointer.x - dot.x) * 0.18;
  dot.y += (pointer.y - dot.y) * 0.18;
  cursorDot.style.left = `${dot.x}px`;
  cursorDot.style.top = `${dot.y}px`;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.96;
    particle.vy *= 0.96;
    particle.life -= 1;
    const alpha = particle.life / particle.maxLife;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${particle.color}, ${alpha * 0.75})`;
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateCursor);
}

window.addEventListener("mousemove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  addParticle(event.clientX, event.clientY);
});

window.addEventListener("mousedown", (event) => {
  cursorDot.classList.add("is-active");
  for (let i = 0; i < 18; i += 1) addParticle(event.clientX, event.clientY, true);
});

window.addEventListener("mouseup", () => {
  cursorDot.classList.remove("is-active");
});

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  });
  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
  });
});

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

function getDisplayName() {
  return currentUser?.username || "Гость";
}

function updateAccountUI() {
  const name = getDisplayName();
  accountName.textContent = name;
  accountAction.textContent = currentUser ? "Профиль" : "Войти";
  profileName.textContent = name;
  profileAvatar.textContent = name.charAt(0).toUpperCase();
  profileMeta.textContent = currentUser
    ? `${currentUser.email} • участник форума`
    : "Войди, чтобы участвовать в форуме.";
  logoutButton.classList.toggle("hidden", !currentUser);
  userStat.textContent = users.length;
}

function requireAccount(target) {
  if (currentUser) return true;
  target.textContent = "Сначала войдите или зарегистрируйтесь.";
  location.hash = "account";
  return false;
}

function setAuthTab(tab) {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });
  loginForm.classList.toggle("active", tab === "login");
  registerForm.classList.toggle("active", tab === "register");
  authMessage.textContent = "";
}

document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  registerUser();
});

async function registerUser() {
  const data = new FormData(registerForm);
  const username = String(data.get("username")).trim();
  const email = String(data.get("email")).trim().toLowerCase();
  const password = String(data.get("password"));

  if (apiMode) {
    try {
      const result = await api("/api/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password })
      });
      registerForm.reset();
      authMessage.innerHTML = result.verificationUrl
        ? `${escapeHTML(result.message)} <a href="${escapeHTML(result.verificationUrl)}">Подтвердить вручную</a>`
        : escapeHTML(result.message);
      return;
    } catch (error) {
      authMessage.textContent = error.message;
      return;
    }
  }

  const exists = users.some((user) => user.username.toLowerCase() === username.toLowerCase() || user.email === email);

  if (exists) {
    authMessage.textContent = "Такой никнейм или email уже есть.";
    return;
  }

  currentUser = { username, email, password };
  users = [...users, currentUser];
  writeStore("pulseUsers", users);
  writeStore("pulseCurrentUser", currentUser);
  registerForm.reset();
  authMessage.textContent = "Аккаунт создан. Теперь можно писать.";
  updateAccountUI();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginUser();
});

async function loginUser() {
  const data = new FormData(loginForm);
  const login = String(data.get("login")).trim().toLowerCase();
  const password = String(data.get("password"));

  if (apiMode) {
    try {
      const result = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ login, password })
      });
      authToken = result.token;
      currentUser = result.user;
      localStorage.setItem("pulseAuthToken", authToken);
      writeStore("pulseCurrentUser", currentUser);
      loginForm.reset();
      authMessage.textContent = "Вход выполнен.";
      updateAccountUI();
      return;
    } catch (error) {
      authMessage.textContent = error.message;
      return;
    }
  }

  const user = users.find((item) => (item.username.toLowerCase() === login || item.email === login) && item.password === password);

  if (!user) {
    authMessage.textContent = "Неверный логин или пароль.";
    return;
  }

  currentUser = user;
  writeStore("pulseCurrentUser", currentUser);
  loginForm.reset();
  authMessage.textContent = "Вход выполнен.";
  updateAccountUI();
}

logoutButton.addEventListener("click", () => {
  currentUser = null;
  authToken = "";
  localStorage.removeItem("pulseAuthToken");
  localStorage.removeItem("pulseCurrentUser");
  authMessage.textContent = "Вы вышли из аккаунта.";
  updateAccountUI();
});

function updateStats() {
  topicStat.textContent = topics.length;
  heroCount.textContent = topics.length;
  chatStat.textContent = messages.length;
  userStat.textContent = users.length;
}

function renderTopics() {
  const query = forumSearch.value.trim().toLowerCase();
  const category = forumFilter.value;
  const filtered = topics.filter((topic) => {
    const haystack = `${topic.title} ${topic.body} ${topic.author}`.toLowerCase();
    return haystack.includes(query) && (category === "all" || topic.category === category);
  });

  topicList.innerHTML = filtered.length
    ? filtered.map((topic) => `
      <article class="topic-card">
        <div class="topic-head">
          <h3>${escapeHTML(topic.title)}</h3>
          <span class="topic-pill">${escapeHTML(topic.category)}</span>
        </div>
        <p>${escapeHTML(topic.body)}</p>
        <div class="topic-meta">
          <span>${escapeHTML(topic.author)}</span>
          <span>${escapeHTML(topic.date)}</span>
          <span>${escapeHTML(topic.replies)} ответов</span>
        </div>
      </article>
    `).join("")
    : `<div class="empty-state">Ничего не найдено. Создайте новую тему.</div>`;

  document.querySelectorAll(".topic-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
  updateStats();
}

topicForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createTopic();
});

async function createTopic() {
  if (!requireAccount(topicMessage)) return;
  const data = new FormData(topicForm);
  const topic = {
    id: Date.now(),
    title: String(data.get("title")).trim(),
    category: String(data.get("category")),
    body: String(data.get("body")).trim(),
    author: currentUser.username,
    date: new Intl.DateTimeFormat("ru-RU").format(new Date()),
    replies: 0
  };

  if (apiMode) {
    try {
      await api("/api/topics", {
        method: "POST",
        body: JSON.stringify({ title: topic.title, category: topic.category, body: topic.body })
      });
      topicForm.reset();
      topicMessage.textContent = "Тема создана.";
      await loadServerData();
      return;
    } catch (error) {
      topicMessage.textContent = error.message;
      return;
    }
  }

  topics = [topic, ...topics];
  writeStore("pulseTopics", topics);
  topicForm.reset();
  topicMessage.textContent = "Тема создана.";
  renderTopics();
}

forumSearch.addEventListener("input", renderTopics);
forumFilter.addEventListener("change", renderTopics);

function renderChat() {
  chatFeed.innerHTML = messages.map((message) => `
    <div class="chat-message">
      <strong>${escapeHTML(message.author)}</strong>
      <span>${escapeHTML(message.time)}</span>
      <p>${escapeHTML(message.text)}</p>
    </div>
  `).join("");
  chatFeed.scrollTop = chatFeed.scrollHeight;
  updateStats();
}

function formatTime() {
  return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendChatMessage();
});

async function sendChatMessage() {
  if (!requireAccount(authMessage)) return;
  const data = new FormData(chatForm);
  const text = String(data.get("message")).trim();
  if (!text) return;

  if (apiMode) {
    try {
      await api("/api/messages", {
        method: "POST",
        body: JSON.stringify({ body: text })
      });
      chatForm.reset();
      await loadServerData();
      return;
    } catch (error) {
      authMessage.textContent = error.message;
      return;
    }
  }

  messages = [...messages, { author: currentUser.username, text, time: formatTime() }].slice(-80);
  writeStore("pulseMessages", messages);
  chatForm.reset();
  renderChat();
}

function normalizeServerTopic(topic) {
  return {
    id: topic.id,
    title: topic.title,
    category: topic.category,
    body: topic.body,
    author: topic.author_name,
    date: new Intl.DateTimeFormat("ru-RU").format(new Date(topic.created_at)),
    replies: topic.replies || 0
  };
}

function normalizeServerMessage(message) {
  return {
    author: message.author_name,
    text: message.body,
    time: new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date(message.created_at))
  };
}

async function loadServerData() {
  if (!apiMode) return;
  try {
    const [topicData, messageData] = await Promise.all([
      api("/api/topics"),
      api("/api/messages")
    ]);
    topics = topicData.topics.map(normalizeServerTopic);
    messages = messageData.messages.map(normalizeServerMessage);
    if (!messages.length) messages = demoMessages;
    renderTopics();
    renderChat();
  } catch (error) {
    apiMode = false;
    authMessage.textContent = "Vercel API пока не настроен, включен демо-режим.";
  }
}

async function restoreSession() {
  if (!apiMode || !authToken) return;
  try {
    const result = await api("/api/me");
    currentUser = result.user;
    writeStore("pulseCurrentUser", currentUser);
  } catch {
    authToken = "";
    currentUser = null;
    localStorage.removeItem("pulseAuthToken");
    localStorage.removeItem("pulseCurrentUser");
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateCursor();
restoreSession().finally(async () => {
  updateAccountUI();
  await loadServerData();
  renderTopics();
  renderChat();
});
