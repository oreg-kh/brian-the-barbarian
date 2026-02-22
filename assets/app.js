// ================================================================
// állapot + segédek
// ================================================================
const state = {
  data: null,
  languages: [],
  activeId: null,
  theme: "system",
  locale: "hu-HU",
};

// ================================================================
// DOM
// ================================================================
const el = {
  sidebar: document.getElementById("sidebar"),
  collapseSidebarBtn: document.getElementById("collapseSidebarBtn"),
  openSidebarBtn: document.getElementById("openSidebarBtn"),
  navSearch: document.getElementById("navSearch"),
  guideList: document.getElementById("guideList"),
  navCommands: document.getElementById("navCommands"),
  navListeners: document.getElementById("navListeners"),
  navAudits: document.getElementById("navAudits"),
  content: document.getElementById("content"),
  currentSelection: document.getElementById("currentSelection"),
  inviteBtn: document.getElementById("inviteBtn"),
  supportBtn: document.getElementById("supportBtn"),
  brandName: document.getElementById("brandName"),
  buildInfo: document.getElementById("buildInfo"),
  themeToggle: document.getElementById("themeToggle"),
  langBtn: document.getElementById("langBtn"),
  langBtnLabel: document.getElementById("langBtnLabel"),
  langMenu: document.getElementById("langMenu"),
};

// ================================================================
// kis utilok
// ================================================================
function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function safeText(x) {
  return (x ?? "").toString();
}

function setHash(id) {
  if (!id) return;
  location.hash = encodeURIComponent(id);
}

function getHash() {
  const raw = (location.hash || "").replace(/^#/, "");
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

// ================================================================
// téma (light/dark)
// ================================================================
function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme() {
  const saved = localStorage.getItem("btb_theme");
  const theme = saved || "system";
  state.theme = theme;

  const effective = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.dataset.theme = effective;
}

function toggleTheme() {
  const current = state.theme === "system" ? getSystemTheme() : state.theme;
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("btb_theme", next);
  applyTheme();
}

// ================================================================
// nyelv / locale
// ================================================================
function marketToRegion(market) {
  if (!market) return "001";
  if (market === "uk") return "GB";
  if (market === "net") return "001";
  if (market === "beta") return "001";
  return market.toUpperCase();
}

function getNativeRegionName(locale, region, fallback) {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return dn.of(region) || fallback;
  } catch {
    return fallback;
  }
}

function loadLocale() {
  const saved = localStorage.getItem("btb_locale");
  if (saved) state.locale = saved;
}

function setLocale(locale) {
  state.locale = locale;
  localStorage.setItem("btb_locale", locale);
  renderLanguageButton();
  closeLangMenu();
}

// ================================================================
// adatok betöltése
// ================================================================
async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Nem sikerült betölteni: " + path);
  return res.json();
}

async function init() {
  // ================================================================
  // config beállítás
  // ================================================================
  const cfg = window.BTB_CONFIG || {};
  el.brandName.textContent = cfg.BOT_NAME || "Brian the Barbarian";
  el.inviteBtn.href = cfg.DISCORD_INVITE_URL || "#";
  el.supportBtn.href = cfg.SUPPORT_SERVER_URL || "#";

  // ================================================================
  // mentett beállítások
  // ================================================================
  applyTheme();
  loadLocale();

  // ================================================================
  // adatok
  // ================================================================
  const [data, languages] = await Promise.all([
    loadJson("assets/data/bot-data.json"),
    loadJson("assets/data/languages.json"),
  ]);

  state.data = data;
  state.languages = languages;

  el.buildInfo.textContent = data.generatedAt ? "Build: " + data.generatedAt.replace("T", " ").replace("Z", " UTC") : "";

  // ================================================================
  // UI építés
  // ================================================================
  buildNav();
  buildGuide();
  buildLanguageMenu();

  // ================================================================
  // kiválasztás hash alapján
  // ================================================================
  const initial = getHash();
  if (initial) {
    selectById(initial, { pushHash: false });
  } else {
    renderHome();
  }

  // ================================================================
  // események
  // ================================================================
  window.addEventListener("hashchange", () => {
    const id = getHash();
    if (id) selectById(id, { pushHash: false });
  });

  el.collapseSidebarBtn.addEventListener("click", () => {
    el.sidebar.classList.toggle("is-collapsed");
  });

  el.openSidebarBtn.addEventListener("click", () => {
    el.sidebar.classList.add("is-open");
  });

  document.addEventListener("click", (ev) => {
    // mobil sidebar zárás (katt a main területen)
    if (window.innerWidth <= 980) {
      const clickedInsideSidebar = el.sidebar.contains(ev.target);
      const clickedMenuBtn = el.openSidebarBtn.contains(ev.target);
      if (!clickedInsideSidebar && !clickedMenuBtn) {
        el.sidebar.classList.remove("is-open");
      }
    }

    // nyelv menü zárás, ha kívül katt
    if (el.langMenu.classList.contains("is-open")) {
      const inside = el.langMenu.contains(ev.target) || el.langBtn.contains(ev.target);
      if (!inside) closeLangMenu();
    }
  });

  el.themeToggle.addEventListener("click", toggleTheme);

  el.langBtn.addEventListener("click", () => {
    const open = el.langMenu.classList.toggle("is-open");
    el.langBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  el.navSearch.addEventListener("input", () => {
    applyNavFilter(el.navSearch.value);
  });

  // terms / privacy gombok
  $all("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      if (view) renderStatic(view);
      if (window.innerWidth <= 980) el.sidebar.classList.remove("is-open");
    });
  });

  renderLanguageButton();
}

// ================================================================
// navigáció építése
// ================================================================
function buildNav() {
  const data = state.data;
  if (!data) return;

  // ------------------------------------------------
  // parancsok csoportosítása
  // ------------------------------------------------
  const groups = {};
  data.commands.forEach((c) => {
    const g = c.group || "Egyéb";
    groups[g] = groups[g] || [];
    groups[g].push(c);
  });

  el.navCommands.innerHTML = "";
  Object.keys(groups).forEach((g) => {
    const wrap = document.createElement("div");
    wrap.className = "navSubGroup";
    wrap.innerHTML = `<div class="navSubGroup__title">${safeText(g)}</div>`;
    groups[g].forEach((cmd) => {
      wrap.appendChild(makeNavItem(cmd.id, `/${cmd.name}`, cmd.description));
    });
    el.navCommands.appendChild(wrap);
  });

  // ------------------------------------------------
  // listenerek
  // ------------------------------------------------
  const lGroups = {};
  data.listeners.forEach((l) => {
    const g = l.group || "Egyéb";
    lGroups[g] = lGroups[g] || [];
    lGroups[g].push(l);
  });

  el.navListeners.innerHTML = "";
  Object.keys(lGroups).forEach((g) => {
    const wrap = document.createElement("div");
    wrap.className = "navSubGroup";
    wrap.innerHTML = `<div class="navSubGroup__title">${safeText(g)}</div>`;
    lGroups[g].forEach((l) => {
      wrap.appendChild(makeNavItem(l.id, l.title, l.description));
    });
    el.navListeners.appendChild(wrap);
  });

  // ------------------------------------------------
  // audit modulok
  // ------------------------------------------------
  const aGroups = {};
  data.auditModules.forEach((a) => {
    const g = a.group || "Egyéb";
    aGroups[g] = aGroups[g] || [];
    aGroups[g].push(a);
  });

  el.navAudits.innerHTML = "";
  Object.keys(aGroups).forEach((g) => {
    const wrap = document.createElement("div");
    wrap.className = "navSubGroup";
    wrap.innerHTML = `<div class="navSubGroup__title">${safeText(g)}</div>`;
    aGroups[g].forEach((a) => {
      wrap.appendChild(makeNavItem(a.id, a.title, a.description));
    });
    el.navAudits.appendChild(wrap);
  });
}

function makeNavItem(id, title, meta) {
  const btn = document.createElement("button");
  btn.className = "navItem";
  btn.type = "button";
  btn.setAttribute("data-id", id);
  btn.innerHTML = `
    <div>${safeText(title)}</div>
    ${meta ? `<span class="navItem__meta">${safeText(meta)}</span>` : ""}
  `;
  btn.addEventListener("click", () => {
    selectById(id, { pushHash: true });
    if (window.innerWidth <= 980) el.sidebar.classList.remove("is-open");
  });
  return btn;
}

function applyNavFilter(q) {
  const query = (q || "").trim().toLowerCase();
  const items = $all(".navItem");

  items.forEach((it) => {
    const text = it.textContent.toLowerCase();
    it.style.display = text.includes(query) ? "" : "none";
  });

  // ha üres lett egy subgroup, rejtsük
  $all(".navSubGroup").forEach((g) => {
    const hasVisible = $all(".navItem", g).some((x) => x.style.display !== "none");
    g.style.display = hasVisible ? "" : "none";
  });
}

// ================================================================
// kezelési útmutató
// ================================================================
function buildGuide() {
  const data = state.data;
  if (!data) return;

  el.guideList.innerHTML = "";
  (data.guide || []).forEach((step) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.textContent = `/${step.command}`;
    a.addEventListener("click", () => {
      selectById("command:" + step.command, { pushHash: true });
      if (window.innerWidth <= 980) el.sidebar.classList.remove("is-open");
    });

    const small = document.createElement("div");
    small.style.color = "var(--muted)";
    small.style.fontSize = "12px";
    small.textContent = safeText(step.text);

    li.appendChild(a);
    li.appendChild(small);
    el.guideList.appendChild(li);
  });
}

// ================================================================
// kiválasztás + render
// ================================================================
function selectById(id, { pushHash }) {
  state.activeId = id;

  if (pushHash) setHash(id);

  // aktív highlight
  $all(".navItem").forEach((b) => {
    b.classList.toggle("is-active", b.getAttribute("data-id") === id);
  });

  const data = state.data;

  const cmd = data.commands.find((c) => c.id === id);
  if (cmd) return renderCommand(cmd);

  const l = data.listeners.find((x) => x.id === id);
  if (l) return renderListener(l);

  const a = data.auditModules.find((x) => x.id === id);
  if (a) return renderAudit(a);

  // fallback
  renderHome();
}

function renderHome() {
  el.currentSelection.textContent = "Kezdőlap";
  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">${safeText(window.BTB_CONFIG?.BOT_NAME || "Brian the Barbarian")}</h1>
      <p class="p">
        Válassz a bal oldali menüből parancsot, listenert vagy audit modult.
      </p>
      <div class="badges">
        <span class="badge">${(state.data?.commands?.length || 0)} parancs</span>
        <span class="badge">${(state.data?.listeners?.length || 0)} listener</span>
        <span class="badge">${(state.data?.auditModules?.length || 0)} audit modul</span>
      </div>
    </div>
  `;
}

function renderStatic(view) {
  const title = view === "terms" ? "Terms" : "Privacy";
  el.currentSelection.textContent = title;

  const body =
    view === "terms"
      ? `
      <p class="p">
        Ez egy sablon. Írd át a botod valós működésére:
      </p>
      <ul>
        <li>milyen adatokat kezel</li>
        <li>miért és meddig tárolja</li>
        <li>hogyan kérhető törlés</li>
      </ul>
      `
      : `
      <p class="p">
        Ez egy sablon. Írd át a botod valós működésére:
      </p>
      <ul>
        <li>naplózás/audit: mi kerül mentésre</li>
        <li>tárolt beállítások (DB)</li>
        <li>harmadik fél szolgáltatások</li>
      </ul>
      `;

  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">${title}</h1>
      ${body}
    </div>
  `;
}

function renderCommand(cmd) {
  el.currentSelection.textContent = `/${cmd.name}`;

  const who = cmd.who ? [cmd.who] : ["Bárki"];
  const botPerms = uniq(cmd.botPerms || []);

  const base = `
    <div class="card">
      <h1 class="h1">/${safeText(cmd.name)}</h1>
      <p class="p">${safeText(cmd.description)}</p>

      <div class="badges">
        <span class="badge">Használhatja: ${who.map(safeText).join(", ")}</span>
        ${botPerms.map((p) => `<span class="badge">Bot: ${safeText(p)}</span>`).join("")}
      </div>
    </div>
  `;

  const optionsHtml = renderCommandOptions(cmd);

  el.content.innerHTML = base + optionsHtml;
  el.content.focus({ preventScroll: true });
}

function renderCommandOptions(cmd) {
  // ------------------------------------------------
  // subcommand groups / subcommands
  // ------------------------------------------------
  if ((cmd.groups && cmd.groups.length) || (cmd.subcommands && cmd.subcommands.length)) {
    let html = `<div class="card"><h2 class="h1" style="font-size:18px;margin:0 0 10px;">Alparancsok</h2>`;

    if (cmd.groups && cmd.groups.length) {
      cmd.groups.forEach((g) => {
        html += `
          <div class="card" style="box-shadow:none;margin-top:12px;">
            <div style="font-weight:800;">${safeText(g.name)}</div>
            <div class="p" style="margin-top:6px;">${safeText(g.description)}</div>
            ${g.subcommands.map((s) => renderSubcommand(cmd.name, s)).join("")}
          </div>
        `;
      });
    }

    if (cmd.subcommands && cmd.subcommands.length) {
      html += cmd.subcommands.map((s) => renderSubcommand(cmd.name, s)).join("");
    }

    html += `</div>`;
    return html;
  }

  // ------------------------------------------------
  // sima opciók
  // ------------------------------------------------
  const opts = cmd.options || [];
  if (!opts.length) {
    return `
      <div class="card">
        <h2 class="h1" style="font-size:18px;margin:0 0 10px;">Mezők</h2>
        <p class="p">Nincs paramétere.</p>
      </div>
    `;
  }

  return `
    <div class="card">
      <h2 class="h1" style="font-size:18px;margin:0 0 10px;">Mezők</h2>
      ${renderOptionsTable(opts)}
    </div>
  `;
}

function renderSubcommand(cmdName, sub) {
  const opts = sub.options || [];
  return `
    <div class="card" style="box-shadow:none;margin-top:12px;">
      <div style="font-weight:800;">/${safeText(cmdName)} ${safeText(sub.name)}</div>
      <div class="p" style="margin-top:6px;">${safeText(sub.description)}</div>
      ${
        opts.length
          ? renderOptionsTable(opts)
          : `<div class="p" style="margin:0;">Nincs paramétere.</div>`
      }
    </div>
  `;
}

function renderOptionsTable(opts) {
  const rows = opts
    .map((o) => {
      const req = o.required ? "kötelező" : "opcionális";
      const type = safeText(o.type || "—");
      const desc = safeText(o.description || "");
      const choices = (o.choices || []).length
        ? `<div class="badges" style="margin-top:8px;">${o.choices
            .slice(0, 18)
            .map((c) => `<span class="badge">${safeText(c.name)} → ${safeText(c.value)}</span>`)
            .join("")}</div>`
        : "";

      return `
        <tr>
          <td style="width: 28%;">
            <div style="font-weight:800;">${safeText(o.name)}</div>
            <div class="navItem__meta">(${type}, ${req})</div>
          </td>
          <td>
            <div>${desc || "<span style='color:var(--muted)'>—</span>"}</div>
            ${choices}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <table class="table">
      <thead>
        <tr>
          <th>Mező</th>
          <th>Leírás</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderListener(l) {
  el.currentSelection.textContent = l.title;

  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">${safeText(l.title)}</h1>
      <p class="p">${safeText(l.description)}</p>

      <div class="badges">
        <span class="badge">Esemény: ${safeText(l.name)}</span>
        <span class="badge">Csoport: ${safeText(l.group)}</span>
        <span class="badge">${l.once ? "Egyszer fut" : "Minden eseménynél fut"}</span>
      </div>

      <div class="p" style="margin-top:14px;">
        <span style="color:var(--muted);font-weight:700;">Fájl:</span>
        <code>${safeText(l.file)}</code>
      </div>
    </div>
  `;
  el.content.focus({ preventScroll: true });
}

function renderAudit(a) {
  el.currentSelection.textContent = a.title;

  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">${safeText(a.title)}</h1>
      <p class="p">${safeText(a.description)}</p>

      <div class="badges">
        <span class="badge">Kulcs: ${safeText(a.key)}</span>
        <span class="badge">Csoport: ${safeText(a.group)}</span>
      </div>

      <div class="p" style="margin-top:14px;">
        <span style="color:var(--muted);font-weight:700;">Fájl:</span>
        <code>${safeText(a.file)}</code>
      </div>
    </div>
  `;
  el.content.focus({ preventScroll: true });
}

// ================================================================
// nyelv menü építés
// ================================================================
function buildLanguageMenu() {
  el.langMenu.innerHTML = "";

  state.languages.forEach((l) => {
    const region = marketToRegion(l.market);
    const label = getNativeRegionName(l.locale, region, l.name);

    const btn = document.createElement("button");
    btn.className = "lang__opt";
    btn.type = "button";
    btn.setAttribute("role", "menuitem");

    btn.innerHTML = `
      <div>
        <div style="font-weight:800;">${safeText(l.flag)} ${safeText(label)}</div>
        <small>${safeText(l.langName)} • ${safeText(l.locale)}</small>
      </div>
      <small>${safeText(l.market)}</small>
    `;

    btn.addEventListener("click", () => setLocale(l.locale));
    el.langMenu.appendChild(btn);
  });
}

function renderLanguageButton() {
  const current = state.languages.find((l) => l.locale === state.locale) || state.languages.find((l) => l.market === "hu");
  if (!current) {
    el.langBtnLabel.textContent = "🌍 Nyelv";
    return;
  }

  const region = marketToRegion(current.market);
  const label = getNativeRegionName(current.locale, region, current.name);
  el.langBtnLabel.textContent = `${current.flag} ${label}`;
}

function closeLangMenu() {
  el.langMenu.classList.remove("is-open");
  el.langBtn.setAttribute("aria-expanded", "false");
}

// ================================================================
// start
// ================================================================
init().catch((err) => {
  console.error(err);
  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">Hiba</h1>
      <p class="p">Nem sikerült betölteni a dokumentációs adatokat.</p>
      <pre style="white-space:pre-wrap;color:var(--muted);">${safeText(err.message)}</pre>
    </div>
  `;
});
