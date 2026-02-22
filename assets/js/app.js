// ================================================================
// Imports
// ================================================================
import { CONFIG } from "./config.js";

// ================================================================
// DOM helper
// ================================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function safeText(el, value) {
  if (el) el.textContent = value ?? "";
}

function safeHref(el, value) {
  if (el && value) el.href = value;
  if (el && !value) el.style.display = "none";
}

// ================================================================
// Theme
// ================================================================
const THEME_KEY = "brian_theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  const icon = $("#themeIcon");
  const label = $("#themeLabel");
  if (theme === "light") {
    safeText(icon, "☀️");
    safeText(label, "Világos");
  } else {
    safeText(icon, "🌙");
    safeText(label, "Sötét");
  }
}

// ================================================================
// Router
// ================================================================
const ROUTES = [
  { id: "home", title: "Kezdőlap", subtitle: "Áttekintés + gyors linkek" },
  { id: "commands", title: "Parancsok", subtitle: "Keresés, szűrés, részletek" },
  { id: "events", title: "Eventek", subtitle: "Listenerek • Audit modulok • Interakciók" },
  { id: "setup", title: "Beállítás", subtitle: "Gyors telepítés és linkek" },
  { id: "legal", title: "Jogi", subtitle: "Privacy / Terms sablon" },
];

function getRouteId() {
  const raw = (location.hash || "#home").replace("#", "").trim();
  return ROUTES.some((r) => r.id === raw) ? raw : "home";
}

function setActiveRoute(routeId) {
  // ================================================================
  // View váltás
  // ================================================================
  ROUTES.forEach((r) => {
    const view = $(`#view-${r.id}`);
    if (!view) return;
    view.hidden = r.id !== routeId;
  });

  // ================================================================
  // Sidebar aktív link
  // ================================================================
  $$(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === routeId);
  });

  const route = ROUTES.find((r) => r.id === routeId);
  safeText($("#pageTitle"), route?.title ?? "");
  safeText($("#pageSubtitle"), route?.subtitle ?? "");
}

// ================================================================
// Data loading
// ================================================================
async function loadBotData() {
  const res = await fetch("./assets/data/bot-data.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Nem sikerült betölteni: bot-data.json");
  return res.json();
}

// ================================================================
// Rendering — Home
// ================================================================
function renderHome(data) {
  safeText($("#botName"), CONFIG.BOT_NAME);
  safeText($("#tagline"), CONFIG.TAGLINE);
  safeText($("#heroTitle"), CONFIG.BOT_NAME);
  safeText($("#heroLead"), CONFIG.HERO_LEAD);
  safeText($("#kicker"), CONFIG.KICKER);
  safeText($("#footerName"), CONFIG.BOT_NAME);

  safeText($("#statCommands"), String(data.meta.commandsCount));
  safeText($("#statEvents"), String(data.meta.listenersCount));
  safeText($("#statAudit"), String(data.meta.auditModulesCount));

  safeText($("#buildStats"), `${data.meta.commandsCount} cmd • ${data.meta.listenersCount} listener • ${data.meta.auditModulesCount} audit`);

  // ================================================================
  // Home pill-ek (kategóriák)
  // ================================================================
  const pillRow = $("#pillRow");
  if (pillRow) {
    pillRow.innerHTML = "";
    const counts = new Map();
    data.commands.forEach((c) => counts.set(c.categoryLabel, (counts.get(c.categoryLabel) || 0) + 1));

    Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .forEach(([label, n]) => {
        const el = document.createElement("div");
        el.className = "pill";
        el.textContent = `${label} • ${n}`;
        pillRow.appendChild(el);
      });
  }

  // ================================================================
  // Home quick list
  // ================================================================
  const quickList = $("#quickList");
  if (quickList) {
    quickList.innerHTML = "";
    const items = [
      { ic: "🧭", title: "Világ regisztráció", text: "Szerver + csatorna hozzárendelés a világhoz." },
      { ic: "🗺️", title: "Térképek és statok", text: "Játékos / törzs térkép, napi stat, war stat." },
      { ic: "🧾", title: "Audit & logging", text: "Üzenetek, role-ok, csatornák és tag események naplózása." },
    ];

    items.forEach((it) => {
      const row = document.createElement("div");
      row.className = "quick-item";
      row.innerHTML = `
        <div class="badge" aria-hidden="true">${it.ic}</div>
        <div>
          <b>${it.title}</b>
          <span>${it.text}</span>
        </div>
      `;
      quickList.appendChild(row);
    });
  }

  // ================================================================
  // Feature grid — automatikus “menő kártyák”
  // ================================================================
  const grid = $("#featureGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const features = [
    {
      title: "Parancsközpont",
      desc: "Az összes slash parancs kereshető, kategorizált, és kattintásra mutatja az opciókat is.",
      tag: `${data.meta.commandsCount} parancs`,
      icon: "⌨️",
      to: "#commands",
    },
    {
      title: "Event térkép",
      desc: "Listenerek + audit modulok külön nézetben, gyors kereséssel és customId listával.",
      tag: `${data.meta.listenersCount + data.meta.auditModulesCount} modul`,
      icon: "⚡",
      to: "#events",
    },
    {
      title: "Logging / Audit",
      desc: "Role, csatorna, emoji, guild és üzenet események strukturált naplózása.",
      tag: `${data.meta.auditModulesCount} audit modul`,
      icon: "🧾",
      to: "#events",
    },
    {
      title: "Ticket / Panel",
      desc: "Ticket panel és interakciók (gombok, modalok) customId-val dokumentálva.",
      tag: `${data.meta.componentsCount} interakció modul`,
      icon: "🎫",
      to: "#events",
    },
    {
      title: "Világ és csatorna regisztráció",
      desc: "World beállítások, csatornák és szerver mapping — gyors setup oldallal.",
      tag: "setup",
      icon: "🧩",
      to: "#setup",
    },
    {
      title: "Sötét/Világos mód",
      desc: "Azonnali váltás, mentett preferenciával (localStorage) + rendszer téma követése.",
      tag: "UI",
      icon: "🌓",
      to: "#home",
    },
  ];

  features.forEach((f) => {
    const el = document.createElement("a");
    el.className = "item";
    el.href = f.to;

    el.innerHTML = `
      <div class="item-top">
        <div>
          <div class="item-title">${f.icon} ${f.title}</div>
          <div class="item-sub">${f.desc}</div>
        </div>
        <div class="kbd">${f.tag}</div>
      </div>
    `;
    grid.appendChild(el);
  });
}

// ================================================================
// Rendering — Commands
// ================================================================
function renderCommandChips(data, state) {
  const wrap = $("#commandChips");
  if (!wrap) return;

  const counts = new Map();
  data.commands.forEach((c) => counts.set(c.categoryLabel, (counts.get(c.categoryLabel) || 0) + 1));

  const entries = Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], "hu"));
  wrap.innerHTML = "";

  const all = document.createElement("button");
  all.className = "chip" + (!state.category ? " active" : "");
  all.type = "button";
  all.textContent = `Minden • ${data.meta.commandsCount}`;
  all.addEventListener("click", () => {
    state.category = null;
    updateCommands(data, state);
  });
  wrap.appendChild(all);

  entries.forEach(([label, n]) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (state.category === label ? " active" : "");
    btn.type = "button";
    btn.textContent = `${label} • ${n}`;
    btn.addEventListener("click", () => {
      state.category = label;
      updateCommands(data, state);
    });
    wrap.appendChild(btn);
  });
}

function commandMatches(cmd, q) {
  if (!q) return true;
  const hay = [
    cmd.name,
    cmd.description,
    cmd.categoryLabel,
    ...(cmd.options || []).map((o) => `${o.name} ${o.description} ${o.type}`),
  ]
    .join(" ")
    .toLowerCase();

  return hay.includes(q.toLowerCase());
}

function updateCommands(data, state) {
  // ================================================================
  // Chip state frissítés
  // ================================================================
  renderCommandChips(data, state);

  const q = state.query.trim();
  const list = data.commands
    .filter((c) => (!state.category ? true : c.categoryLabel === state.category))
    .filter((c) => commandMatches(c, q));

  safeText($("#commandCountLabel"), `${list.length} találat • ${data.meta.commandsCount} összesen`);

  const wrap = $("#commandList");
  if (!wrap) return;

  wrap.innerHTML = "";
  list.forEach((cmd) => {
    const el = document.createElement("div");
    el.className = "item";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", `/${cmd.name} részletek`);

    const optCount = (cmd.options || []).length;

    el.innerHTML = `
      <div class="item-top">
        <div>
          <div class="item-title">/<span>${cmd.name}</span></div>
          <div class="item-sub">${cmd.description || ""}</div>
        </div>
        <div class="kbd">${cmd.categoryLabel}</div>
      </div>
      <div class="tags">
        <div class="tag">${optCount} opció</div>
        <div class="tag">${cmd.sourceFile.split("/").slice(-1)[0]}</div>
      </div>
    `;

    el.addEventListener("click", () => openCommandModal(cmd));
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") openCommandModal(cmd);
    });

    wrap.appendChild(el);
  });
}

function openCommandModal(cmd) {
  const modal = $("#detailModal");
  if (!modal) return;

  safeText($("#modalTitle"), `/${cmd.name}`);
  safeText($("#modalSubtitle"), cmd.description || cmd.categoryLabel || "");

  const body = $("#modalBody");
  if (body) {
    const opts = cmd.options || [];
    const optsHtml =
      opts.length === 0
        ? `<div class="tiny muted">Nincs opció (vagy nem volt felismerhető a builder blokkban).</div>`
        : `
          <div class="modal-grid">
            ${opts
              .map(
                (o) => `
              <div class="opt">
                <b>${o.name} <span class="tiny muted">(${o.type}${o.required ? ", kötelező" : ""})</span></b>
                <span>${o.description || ""}</span>
              </div>
            `
              )
              .join("")}
          </div>
        `;

    body.innerHTML = `
      <div class="tags" style="margin-top:0">
        <div class="tag">${cmd.categoryLabel}</div>
        <div class="tag">${cmd.sourceFile}</div>
      </div>

      <div class="divider"></div>

      <div class="btn-row" style="margin-top:0">
        <button class="btn" id="copySlashBtn" type="button">Parancs másolása</button>
        <a class="btn ghost" href="#setup">Setup</a>
      </div>

      <div class="divider"></div>

      ${optsHtml}
    `;

    const copyBtn = $("#copySlashBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(`/${cmd.name}`);
        copyBtn.textContent = "Kimásolva ✅";
        setTimeout(() => (copyBtn.textContent = "Parancs másolása"), 900);
      });
    }
  }

  modal.showModal();
}

// ================================================================
// Rendering — Events
// ================================================================
function eventMatches(item, q) {
  if (!q) return true;
  const hay = JSON.stringify(item).toLowerCase();
  return hay.includes(q.toLowerCase());
}

function renderEvents(data, state) {
  const wrap = $("#eventList");
  if (!wrap) return;

  const q = state.query.trim();
  const section = state.tab;

  wrap.innerHTML = "";

  if (section === "listeners") {
    const list = data.events.listeners.filter((e) => eventMatches(e, q));
    list.forEach((e) => wrap.appendChild(renderListenerCard(e)));
  } else if (section === "audit") {
    const list = data.events.auditModules.filter((e) => eventMatches(e, q));
    list.forEach((e) => wrap.appendChild(renderAuditCard(e)));
  } else {
    const list = data.events.components.filter((e) => eventMatches(e, q));
    list.forEach((e) => wrap.appendChild(renderComponentCard(e)));
  }
}

function renderListenerCard(e) {
  const el = document.createElement("div");
  el.className = "item";

  el.innerHTML = `
    <div class="item-top">
      <div>
        <div class="item-title">${e.title}</div>
        <div class="item-sub"><span class="muted">${e.categoryLabel}</span> • <code>${e.discordEvent}</code></div>
      </div>
      <div class="kbd">listener</div>
    </div>
    <div class="tags">
      ${e.key ? `<div class="tag">key: ${e.key}</div>` : ""}
      ${e.internalName ? `<div class="tag">name: ${e.internalName}</div>` : ""}
      <div class="tag">${e.file}</div>
    </div>
  `;

  el.addEventListener("click", () => openGenericModal(`${e.title}`, `${e.categoryLabel} • ${e.discordEvent}`, e));
  return el;
}

function renderAuditCard(a) {
  const el = document.createElement("div");
  el.className = "item";

  el.innerHTML = `
    <div class="item-top">
      <div>
        <div class="item-title">${a.title}</div>
        <div class="item-sub"><span class="muted">${a.groupLabel}</span> • ${a.subtitle}</div>
      </div>
      <div class="kbd">audit</div>
    </div>
    <div class="tags">
      <div class="tag">key: ${a.key}</div>
      <div class="tag">${a.file}</div>
    </div>
  `;

  el.addEventListener("click", () => openGenericModal(a.title, `${a.groupLabel}`, a));
  return el;
}

function renderComponentCard(c) {
  const el = document.createElement("div");
  el.className = "item";

  const ids = (c.customIds || []).slice(0, 6);

  el.innerHTML = `
    <div class="item-top">
      <div>
        <div class="item-title">${c.kind === "modal" ? "🧾" : "🟦"} ${c.title}</div>
        <div class="item-sub"><span class="muted">${c.kind}</span> • ${c.countCustomIds} customId</div>
      </div>
      <div class="kbd">ui</div>
    </div>
    <div class="tags">
      ${ids.map((id) => `<div class="tag">${id}</div>`).join("")}
      ${c.customIds.length > ids.length ? `<div class="tag">+${c.customIds.length - ids.length}</div>` : ""}
    </div>
    <div class="tags">
      <div class="tag">${c.file}</div>
    </div>
  `;

  el.addEventListener("click", () => openGenericModal(c.title, `${c.kind} • customId-k`, c));
  return el;
}

function openGenericModal(title, subtitle, payload) {
  const modal = $("#detailModal");
  if (!modal) return;

  safeText($("#modalTitle"), title);
  safeText($("#modalSubtitle"), subtitle);

  const body = $("#modalBody");
  if (body) {
    body.innerHTML = `
      <div class="tiny muted">Részletek (JSON):</div>
      <div class="divider"></div>
      <pre style="margin:0; white-space:pre-wrap; word-break:break-word; color:var(--muted); font-size:12px">${escapeHtml(
        JSON.stringify(payload, null, 2)
      )}</pre>
    `;
  }

  modal.showModal();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ================================================================
// Setup — copy buttons
// ================================================================
async function copyToClipboard(text, btn) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
  if (!btn) return;
  const old = btn.textContent;
  btn.textContent = "Másolva ✅";
  setTimeout(() => (btn.textContent = old), 900);
}

// ================================================================
// Mobile sidebar
// ================================================================
function setupMobileSidebar() {
  const sidebar = $("#sidebar");
  const btn = $("#menuBtn");
  if (!sidebar || !btn) return;

  btn.addEventListener("click", () => sidebar.classList.toggle("open"));

  document.addEventListener("click", (ev) => {
    const isMobile = window.matchMedia("(max-width: 920px)").matches;
    if (!isMobile) return;
    const target = ev.target;
    const clickInside = sidebar.contains(target) || btn.contains(target);
    if (!clickInside) sidebar.classList.remove("open");
  });

  $$(".nav-link").forEach((a) => {
    a.addEventListener("click", () => sidebar.classList.remove("open"));
  });
}

// ================================================================
// Init
// ================================================================
async function init() {
  // ================================================================
  // Theme + UI
  // ================================================================
  applyTheme(getPreferredTheme());
  $("#themeToggle")?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  setupMobileSidebar();

  // ================================================================
  // Links
  // ================================================================
  safeHref($("#inviteBtnTop"), CONFIG.DISCORD_INVITE_URL);
  safeHref($("#inviteBtnHero"), CONFIG.DISCORD_INVITE_URL);
  safeHref($("#inviteBtnSetup"), CONFIG.DISCORD_INVITE_URL);

  safeHref($("#supportLink"), CONFIG.SUPPORT_SERVER_URL);
  safeHref($("#supportBtnSetup"), CONFIG.SUPPORT_SERVER_URL);
  safeHref($("#supportLinkInline"), CONFIG.SUPPORT_SERVER_URL);

  safeHref($("#repoLink"), CONFIG.GITHUB_REPO_URL);

  safeText($("#inviteUrlCode"), CONFIG.DISCORD_INVITE_URL || "—");
  safeText($("#supportUrlCode"), CONFIG.SUPPORT_SERVER_URL || "—");
  safeText($("#repoUrlCode"), CONFIG.GITHUB_REPO_URL || "—");

  $("#copyInvite")?.addEventListener("click", (ev) => copyToClipboard(CONFIG.DISCORD_INVITE_URL, ev.currentTarget));
  $("#copySupport")?.addEventListener("click", (ev) => copyToClipboard(CONFIG.SUPPORT_SERVER_URL, ev.currentTarget));
  $("#copyRepo")?.addEventListener("click", (ev) => copyToClipboard(CONFIG.GITHUB_REPO_URL, ev.currentTarget));

  // ================================================================
  // Modal close
  // ================================================================
  $("#closeModal")?.addEventListener("click", () => $("#detailModal")?.close());
  $("#detailModal")?.addEventListener("click", (ev) => {
    // kattintás a háttérre = close
    const dialog = ev.currentTarget;
    const rect = dialog.getBoundingClientRect();
    const inDialog =
      rect.top <= ev.clientY && ev.clientY <= rect.top + rect.height && rect.left <= ev.clientX && ev.clientX <= rect.left + rect.width;
    if (!inDialog) dialog.close();
  });

  // ================================================================
  // Footer year
  // ================================================================
  safeText($("#year"), String(new Date().getFullYear()));

  // ================================================================
  // Data
  // ================================================================
  const data = await loadBotData();

  renderHome(data);

  // ================================================================
  // Commands state + events state
  // ================================================================
  const commandState = { query: "", category: null };
  const eventState = { query: "", tab: "listeners" };

  // Commands handlers
  $("#commandSearch")?.addEventListener("input", (ev) => {
    commandState.query = ev.target.value || "";
    updateCommands(data, commandState);
  });

  $("#clearCommandFilters")?.addEventListener("click", () => {
    commandState.query = "";
    commandState.category = null;
    const input = $("#commandSearch");
    if (input) input.value = "";
    updateCommands(data, commandState);
  });

  updateCommands(data, commandState);

  // Events handlers
  $("#eventSearch")?.addEventListener("input", (ev) => {
    eventState.query = ev.target.value || "";
    renderEvents(data, eventState);
  });

  $$(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".tab").forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      eventState.tab = btn.dataset.tab;
      renderEvents(data, eventState);
    });
  });

  renderEvents(data, eventState);

  // ================================================================
  // Router init
  // ================================================================
  const onRoute = () => setActiveRoute(getRouteId());
  window.addEventListener("hashchange", onRoute);
  onRoute();
}

init().catch((err) => {
  console.error(err);
  const main = $("#main");
  if (main) {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="card-title">Hiba</div>
      <div class="card-body">
        <div class="muted">Nem sikerült betölteni az oldalt. Részletek a konzolban.</div>
        <pre style="margin-top:10px; color:var(--muted)">${escapeHtml(String(err?.message || err))}</pre>
      </div>
    `;
    main.prepend(el);
  }
});
