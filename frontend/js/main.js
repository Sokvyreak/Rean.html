/* ==========================================================
   SME News — frontend logic
   - Dark / light mode toggle (Bootstrap 5.3 data-bs-theme)
   - Loads articles from the Node.js/Express API
   - Falls back to sample data if the API is unreachable
   ========================================================== */

const API_BASE = window.API_BASE_URL || "http://localhost:5000/api";

/* ---------------- Dark mode toggle ---------------- */
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  // Respect the system preference on first load (no persistence across
  // reloads is used here on purpose — see note in README about storage).
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");

  btn.addEventListener("click", () => {
    const current = root.getAttribute("data-bs-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  function setTheme(mode) {
    root.setAttribute("data-bs-theme", mode);
    icon.className = mode === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  }
})();

/* ---------------- Today's date (Khmer locale) ---------------- */
(function setDate() {
  const el = document.getElementById("today-date");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" });
})();

/* ---------------- Sample fallback data ---------------- */
const SAMPLE_ARTICLES = [
  { category: "សេដ្ឋកិច្ច", title: "ក្រុមហ៊ុនកសិកម្មចុះកិច្ចសន្យាទិញលក់ស្រូវទំហំធំជាមួយសហគមន៍មូលដ្ឋាន", excerpt: "កិច្ចព្រមព្រៀងនេះរំពឹងជួយបង្កើនប្រាក់ចំណូលកសិករនៅតំបន់ជនបទ។" },
  { category: "បច្ចេកវិទ្យា", title: "ការិយាល័យឌីជីថលថ្មីជួយសហគ្រាសខ្នាតតូចគ្រប់គ្រងគណនេយ្យតាមអនឡាញ", excerpt: "កម្មវិធីនេះផ្តល់ជូនដោយឥតគិតថ្លៃសម្រាប់សហគ្រិនចាប់ផ្តើមអាជីវកម្ម។" },
  { category: "ធនាគារ-ហិរញ្ញវត្ថុ", title: "ធនាគារជាតិណែនាំវិធានការថ្មីគាំទ្រការផ្តល់កម្ចីដល់សហគ្រាសខ្នាតតូច", excerpt: "វិធានការនេះមានគោលដៅកាត់បន្ថយការប្រថុយប្រថានសម្រាប់ធនាគារពាណិជ្ជ។" },
  { category: "ពាណិជ្ជកម្ម", title: "ពិព័រណ៍ពាណិជ្ជកម្មតំបន់ទាក់ទាញអ្នកចូលរួមជាង ៣០០សហគ្រាស", excerpt: "ព្រឹត្តិការណ៍នេះជាឱកាសសម្រាប់សហគ្រិនក្នុងស្រុកបង្ហាញផលិតផលរបស់ខ្លួន។" },
  { category: "គំនិតអាជីវកម្ម", title: "គំនិតអាជីវកម្មខ្នាតតូចដែលកំពុងពេញនិយមក្នុងចំណោមយុវជនកម្ពុជា", excerpt: "ការស្ទង់មតិថ្មីបង្ហាញពីនិន្នាការជ្រើសរើសអាជីវកម្មរបស់យុវជន។" },
  { category: "សង្គមជាតិ-សេដ្ឋកិច្ច", title: "កម្មវិធីបណ្តុះបណ្តាលជំនាញវិជ្ជាជីវៈពង្រីកទៅដល់ខេត្តជាច្រើនទៀត", excerpt: "គោលដៅគឺបង្កើនលទ្ធភាពការងារសម្រាប់យុវជនតាមបណ្តាខេត្ត។" },
];

const SAMPLE_MINI = [
  { title: "អ្នកជំនាញព្យាករណ៍កំណើនវិស័យទេសចរណ៍នៅត្រីមាសទី៣", category: "ទេសចរណ៍" },
  { title: "សហគ្រិនវ័យក្មេងបង្កើតកម្មវិធីទូរស័ព្ទសម្រាប់ភ្ជាប់កសិករនិងអ្នកលក់រាយ", category: "បច្ចេកវិទ្យា" },
  { title: "ធនាគារពាណិជ្ជចំនួន៥ ចុះកិច្ចព្រមព្រៀងគាំទ្រកម្ចីសម្រាប់សហគ្រាសស្ត្រី", category: "ហិរញ្ញវត្ថុ" },
];

const SAMPLE_POPULAR = [
  { title: "ADB អនុម័តកម្ចីគាំទ្រគម្រោងហេដ្ឋារចនាសម្ព័ន្ធជនបទ", date: "29 វិច្ឆិកា 2025" },
  { title: "តើ«សេដ្ឋកិច្ចឌីជីថល»ជាអ្វី? ផ្តល់ប្រយោជន៍អ្វីខ្លះ", date: "28 កក្កដា 2025" },
  { title: "អ្វីជា«សហគមន៍កសិកម្មទំនើប»? តើមានផលប្រយោជន៍អ្វីខ្លះ", date: "04 ធ្នូ 2025" },
  { title: "ថ្នាក់ដឹកនាំទស្សនកិច្ចផលិតកម្មនាំចេញនៅតំបន់ឧស្សាហកម្ម", date: "26 មីនា 2025" },
];

/* ---------------- Rendering helpers ---------------- */
function renderArticles(articles) {
  const grid = document.getElementById("article-grid");
  grid.innerHTML = articles.map(a => `
    <div class="col-12 col-sm-6">
      <article class="article-card card border-0 shadow-sm h-100">
        <div class="img"></div>
        <div class="card-body">
          <span class="badge bg-secondary mb-2">${escapeHtml(a.category)}</span>
          <h5>${escapeHtml(a.title)}</h5>
          <p class="text-secondary small mb-0">${escapeHtml(a.excerpt || "")}</p>
        </div>
      </article>
    </div>
  `).join("");
}

function renderMiniList(items) {
  const el = document.getElementById("mini-list");
  el.innerHTML = items.map(i => `
    <div class="mini-card">
      <div class="thumb"></div>
      <div>
        <h4>${escapeHtml(i.title)}</h4>
        <div class="meta small text-muted mt-1">${escapeHtml(i.category)}</div>
      </div>
    </div>
  `).join("");
}

function renderPopular(items) {
  const el = document.getElementById("popular-list");
  el.innerHTML = items.map((i, idx) => `
    <div class="popular-item">
      <div class="popular-num">${String(idx + 1).padStart(2, "0")}</div>
      <div>
        <h6>${escapeHtml(i.title)}</h6>
        <div class="small text-muted mt-1">${escapeHtml(i.date)}</div>
      </div>
    </div>
  `).join("");
}

function renderTicker(articles) {
  const track = document.getElementById("ticker-track");
  const text = articles.map(a => a.title).join("  ·  ");
  track.textContent = `${text}   ·   ${text}`; // duplicated for seamless loop
}

function renderPagination(current, total) {
  const el = document.getElementById("pagination");
  let html = `<li class="page-item ${current === 1 ? "disabled" : ""}"><a class="page-link" href="#">‹</a></li>`;
  for (let p = 1; p <= total; p++) {
    html += `<li class="page-item ${p === current ? "active" : ""}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
  }
  html += `<li class="page-item ${current === total ? "disabled" : ""}"><a class="page-link" href="#">›</a></li>`;
  el.innerHTML = html;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* ---------------- Data loading ---------------- */
async function loadArticles(page = 1) {
  const loadingMsg = document.getElementById("loading-msg");
  try {
    const res = await fetch(`${API_BASE}/articles?page=${page}&limit=6`);
    if (!res.ok) throw new Error("API request failed");
    const data = await res.json();

    renderArticles(data.articles);
    renderMiniList(data.articles.slice(0, 3));
    renderTicker(data.articles);
    renderPagination(data.page || 1, data.totalPages || 1);
  } catch (err) {
    // Backend not running / unreachable — fall back to local sample data
    console.warn("Could not reach API, showing sample data:", err.message);
    if (loadingMsg) loadingMsg.remove();
    renderArticles(SAMPLE_ARTICLES);
    renderMiniList(SAMPLE_MINI);
    renderTicker(SAMPLE_ARTICLES);
    renderPagination(1, 1);
  }
  renderPopular(SAMPLE_POPULAR);
}

document.addEventListener("DOMContentLoaded", () => {
  loadArticles(1);

  document.getElementById("pagination").addEventListener("click", (e) => {
    const link = e.target.closest("a[data-page]");
    if (!link) return;
    e.preventDefault();
    loadArticles(Number(link.dataset.page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.reset();
    alert("អរគុណសម្រាប់ការជាវ!");
  });
});
