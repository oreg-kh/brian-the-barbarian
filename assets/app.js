// ================================================================
// állapot + segédek
// ================================================================
const state = {
  data: null,
  languages: [],
  navStructure: null,
  listenerDocs: null,
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

  navCommands: document.getElementById("navCommands"),
  navListeners: document.getElementById("navListeners"),
  navAudits: document.getElementById("navAudits"),

  navCommandsSummary: document.getElementById("navCommandsSummary"),
  navListenersSummary: document.getElementById("navListenersSummary"),
  navAuditsSummary: document.getElementById("navAuditsSummary"),

  content: document.getElementById("content"),
  currentSelection: document.getElementById("currentSelection"),
  inviteBtn: document.getElementById("inviteBtn"),
  supportBtn: document.getElementById("supportBtn"),
  brandName: document.getElementById("brandName"),
  brandSub: document.getElementById("brandSub"),
  buildInfo: document.getElementById("buildInfo"),

  brandAvatarBtn: document.getElementById("brandAvatarBtn"),
  brandAvatar: document.getElementById("brandAvatar"),

  langBtn: document.getElementById("langBtn"),
  langBtnLabel: document.getElementById("langBtnLabel"),
  langMenu: document.getElementById("langMenu"),

  appearanceLabel: document.getElementById("appearanceLabel"),
  appearanceBtn: document.getElementById("appearanceBtn"),
  appearanceBtnLabel: document.getElementById("appearanceBtnLabel"),
  appearanceMenu: document.getElementById("appearanceMenu"),

  termsBtn: document.getElementById("termsBtn"),
  privacyBtn: document.getElementById("privacyBtn"),
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

function langKeyFromLocale(locale) {
  return (locale || "en").split("-")[0].toLowerCase();
}

// ================================================================
// i18n (UI fordítás)
// ================================================================
const I18N = {
  hu: {
    home: "Kezdőlap",
    home_hint: "Válassz a bal oldali menüből parancsot, listenert vagy audit modult.",
    commands: "Parancsok",
    listeners: "Listenerek",
    audits: "Audit modulok",
    search_placeholder: "Keresés a menüben…",
    appearance: "Megjelenés",
    appearance_system: "Rendszer",
    appearance_dark: "Sötét mód",
    appearance_light: "Világos mód",
    terms: "Terms",
    privacy: "Privacy",
    error_title: "Hiba",
    error_load: "Nem sikerült betölteni a dokumentációs adatokat.",
  },
  en: {
    home: "Home",
    home_hint: "Pick a command, listener or audit module from the left menu.",
    commands: "Commands",
    listeners: "Listeners",
    audits: "Audit modules",
    search_placeholder: "Search in menu…",
    appearance: "Appearance",
    appearance_system: "System",
    appearance_dark: "Dark",
    appearance_light: "Light",
    terms: "Terms",
    privacy: "Privacy",
    error_title: "Error",
    error_load: "Failed to load documentation data.",
  },
};

function t(key) {
  const lk = langKeyFromLocale(state.locale);
  return I18N[lk]?.[key] || I18N.en[key] || key;
}

function pickLocaleText(obj, fallback = "") {
  if (!obj) return fallback;
  const lk = langKeyFromLocale(state.locale);
  return obj[lk] || obj.en || obj.hu || fallback;
}

function applyI18n() {
  document.documentElement.lang = langKeyFromLocale(state.locale);

  el.navCommandsSummary.textContent = t("commands");
  el.navListenersSummary.textContent = t("listeners");
  el.navAuditsSummary.textContent = t("audits");
  el.navSearch.placeholder = t("search_placeholder");

  el.appearanceLabel.textContent = t("appearance");
  el.termsBtn.textContent = t("terms");
  el.privacyBtn.textContent = t("privacy");

  renderAppearanceButton();
}

// ================================================================
// Twemoji zászlók (asztali böngésző kompatibilis)
// ================================================================
function emojiToCodePoints(str) {
  const cps = [];
  for (const ch of str) cps.push(ch.codePointAt(0).toString(16));
  return cps.join("-");
}

function twemojiSvgUrl(emoji) {
  const code = emojiToCodePoints(emoji).toLowerCase();
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`;
}

function makeFlagImg(emoji, alt) {
  const img = document.createElement("img");
  img.className = "flagIcon";
  img.loading = "lazy";
  img.referrerPolicy = "no-referrer";
  img.alt = alt || "";
  img.src = twemojiSvgUrl(emoji);
  return img;
}

// ================================================================
// téma (system/dark/light) + megjelenés menü
// ================================================================
function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme() {
  const saved = localStorage.getItem("btb_theme") || "system";
  state.theme = saved;

  const effective = saved === "system" ? getSystemTheme() : saved;
  document.documentElement.dataset.theme = effective;
}

function setTheme(mode) {
  localStorage.setItem("btb_theme", mode);
  applyTheme();
  renderAppearanceButton();
  closeAppearanceMenu();
}

function buildAppearanceMenu() {
  el.appearanceMenu.innerHTML = "";

  const opts = [
    { id: "system", label: t("appearance_system"), hint: "OS" },
    { id: "dark", label: t("appearance_dark"), hint: "Dark" },
    { id: "light", label: t("appearance_light"), hint: "Light" },
  ];

  opts.forEach((o) => {
    const btn = document.createElement("button");
    btn.className = "appearance__opt";
    btn.type = "button";
    btn.setAttribute("role", "menuitem");
    btn.innerHTML = `
      <div style="font-weight:800;">${safeText(o.label)}</div>
      <small>${safeText(o.hint)}</small>
    `;
    btn.addEventListener("click", () => setTheme(o.id));
    el.appearanceMenu.appendChild(btn);
  });
}

function renderAppearanceButton() {
  const mode = state.theme || (localStorage.getItem("btb_theme") || "system");
  const label =
    mode === "dark" ? t("appearance_dark") :
    mode === "light" ? t("appearance_light") :
    t("appearance_system");

  el.appearanceBtnLabel.textContent = label;
}

function closeAppearanceMenu() {
  el.appearanceMenu.classList.remove("is-open");
  el.appearanceBtn.setAttribute("aria-expanded", "false");
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

  applyI18n();
  buildAppearanceMenu();

  buildLanguageMenu();
  renderLanguageButton();
  closeLangMenu();

  // újrarender az aktuális nézethez (hogy a UI szövegek frissüljenek)
  if (state.activeId) selectById(state.activeId, { pushHash: false });
  else renderHome();
}

// ================================================================
// adatok betöltése
// ================================================================
async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("Nem sikerült betölteni: " + path);
  return res.json();
}

// ================================================================
// csoportosítás (fájlban állítható)
// ================================================================
function resolveGroupDef(sectionKey, rawGroup) {
  const defs = state.navStructure?.[sectionKey] || [];
  const found = defs.find((d) => (d.match || []).includes(rawGroup));
  if (found) return found;

  // fallback: ha nincs definiálva a configban
  const g = rawGroup || "Egyéb";
  return { id: g, title: { hu: g, en: g } };
}

function groupItems(sectionKey, items) {
  const map = new Map();

  items.forEach((it) => {
    const def = resolveGroupDef(sectionKey, it.group);
    if (!map.has(def.id)) map.set(def.id, { def, items: [] });
    map.get(def.id).items.push(it);
  });

  // config szerinti sorrend + maradék abc
  const defs = state.navStructure?.[sectionKey] || [];
  const ordered = [];

  defs.forEach((d) => {
    if (map.has(d.id)) ordered.push(map.get(d.id));
  });

  const rest = Array.from(map.values())
    .filter((x) => !ordered.includes(x))
    .sort((a, b) => pickLocaleText(a.def.title).localeCompare(pickLocaleText(b.def.title)));

  return ordered.concat(rest);
}

// ================================================================
// init
// ================================================================
async function init() {
  // ================================================================
  // config beállítás
  // ================================================================
  const cfg = window.BTB_CONFIG || {};
  el.brandName.textContent = cfg.BOT_NAME || "Brian the Barbarian";
  el.inviteBtn.href = cfg.DISCORD_INVITE_URL || "#";
  el.supportBtn.href = cfg.SUPPORT_SERVER_URL || "#";

  // bot avatar
  const avatarUrl = cfg.BOT_AVATAR_URL || "assets/images/bot-avatar.png";
  el.brandAvatar.src = avatarUrl;
  el.brandAvatar.addEventListener("error", () => {
    // ha nincs kép, legalább ne legyen törött ikon
    el.brandAvatar.removeAttribute("src");
    el.brandAvatar.style.background = "var(--accent)";
  });

  // ================================================================
  // mentett beállítások
  // ================================================================
  applyTheme();
  loadLocale();
  applyI18n();

  // rendszer téma váltás figyelés (ha "system")
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  if (mq && mq.addEventListener) {
    mq.addEventListener("change", () => {
      if ((localStorage.getItem("btb_theme") || "system") === "system") applyTheme();
    });
  }

  // ================================================================
  // adatok
  // ================================================================
  const [data, languages, navStructure, listenerDocs] = await Promise.all([
    loadJson("assets/data/bot-data.json"),
    loadJson("assets/data/languages.json"),
    loadJson("assets/data/nav-structure.json"),
    loadJson("assets/data/listener-docs.json").catch(() => ({})),
  ]);

  state.data = data;
  state.languages = languages;
  state.navStructure = navStructure;
  state.listenerDocs = listenerDocs || {};

  el.buildInfo.textContent = data.generatedAt
    ? "Build: " + data.generatedAt.replace("T", " ").replace("Z", " UTC")
    : "";

  // ================================================================
  // UI építés
  // ================================================================
  buildNav();
  buildLanguageMenu();
  buildAppearanceMenu();

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

  function toggleCollapsed() {
    el.sidebar.classList.toggle("is-collapsed");
  }

  el.collapseSidebarBtn.addEventListener("click", toggleCollapsed);

  // összecsukva csak az avatar látszik -> avatarral lehessen visszanyitni is
  el.brandAvatarBtn.addEventListener("click", toggleCollapsed);

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

    // megjelenés menü zárás, ha kívül katt
    if (el.appearanceMenu.classList.contains("is-open")) {
      const inside = el.appearanceMenu.contains(ev.target) || el.appearanceBtn.contains(ev.target);
      if (!inside) closeAppearanceMenu();
    }
  });

  el.langBtn.addEventListener("click", () => {
    const open = el.langMenu.classList.toggle("is-open");
    el.langBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  el.appearanceBtn.addEventListener("click", () => {
    const open = el.appearanceMenu.classList.toggle("is-open");
    el.appearanceBtn.setAttribute("aria-expanded", open ? "true" : "false");
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
  renderAppearanceButton();
}

// ================================================================
// navigáció építése
// ================================================================
function buildNav() {
  const data = state.data;
  if (!data) return;

  // ------------------------------------------------
  // PARANCSOK
  // ------------------------------------------------
  el.navCommands.innerHTML = "";
  groupItems("commands", data.commands).forEach(({ def, items }) => {
    const wrap = document.createElement("div");
    wrap.className = "navSubGroup";

    const title = pickLocaleText(def.title, def.id);
    wrap.innerHTML = `<div class="navSubGroup__title">${safeText(title)}</div>`;

    items.forEach((cmd) => {
      wrap.appendChild(makeNavItem(cmd.id, `/${cmd.name}`, cmd.description));
    });

    el.navCommands.appendChild(wrap);
  });

  // ------------------------------------------------
  // LISTENEREK (csak leírás + csoport leírás)
  // ------------------------------------------------
  el.navListeners.innerHTML = "";
  groupItems("listeners", data.listeners).forEach(({ def, items }) => {
    const wrap = document.createElement("div");
    wrap.className = "navSubGroup";

    const title = pickLocaleText(def.title, def.id);
    const desc = pickLocaleText(def.description, "");

    wrap.innerHTML = `
      <div class="navSubGroup__title">${safeText(title)}</div>
      ${desc ? `<div class="navItem__meta" style="margin:2px 10px 8px;">${safeText(desc)}</div>` : ""}
    `;

    items.forEach((l) => {
      wrap.appendChild(makeNavItem(l.id, l.title, getListenerDoc(l)));
    });

    el.navListeners.appendChild(wrap);
  });

  // ------------------------------------------------
  // AUDIT MODULOK
  // ------------------------------------------------
  el.navAudits.innerHTML = "";
  groupItems("audits", data.auditModules).forEach(({ def, items }) => {
    const wrap = document.createElement("div");
    wrap.className = "navSubGroup";

    const title = pickLocaleText(def.title, def.id);
    wrap.innerHTML = `<div class="navSubGroup__title">${safeText(title)}</div>`;

    items.forEach((a) => {
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

  renderHome();
}

function renderHome() {
  el.currentSelection.textContent = t("home");
  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">${safeText(window.BTB_CONFIG?.BOT_NAME || "Brian the Barbarian")}</h1>
      <p class="p">${safeText(t("home_hint"))}</p>
      <div class="badges">
        <span class="badge">${(state.data?.commands?.length || 0)} ${t("commands")}</span>
        <span class="badge">${(state.data?.listeners?.length || 0)} ${t("listeners")}</span>
        <span class="badge">${(state.data?.auditModules?.length || 0)} ${t("audits")}</span>
      </div>
    </div>
  `;
}

function renderStatic(view) {
  const title = view === "terms" ? t("terms") : t("privacy");
  el.currentSelection.textContent = title;

  const body =
    view === "terms"
      ? `
      <p class="p">Ez egy sablon. Írd át a botod valós működésére:</p>
      <ul>
        <li>milyen adatokat kezel</li>
        <li>miért és meddig tárolja</li>
        <li>hogyan kérhető törlés</li>
      </ul>
      `
      : `
      <p class="p">Ez egy sablon. Írd át a botod valós működésére:</p>
      <ul>
        <li>naplózás/audit: mi kerül mentésre</li>
        <li>tárolt beállítások (DB)</li>
        <li>harmadik fél szolgáltatások</li>
      </ul>
      `;

  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">${safeText(title)}</h1>
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

// ================================================================
// LISTENER: csak leírás (nincs badge, nincs fájl, nincs group)
// ================================================================
function getListenerDoc(l) {
  const key = l?.name;
  const doc = state.listenerDocs?.[key];
  if (!doc) return safeText(l?.description || "");
  return pickLocaleText(doc, safeText(l?.description || ""));
}

function renderListener(l) {
  el.currentSelection.textContent = l.title;

  el.content.innerHTML = `
    <div class="card">
      <h1 class="h1">${safeText(l.title)}</h1>
      <p class="p">${safeText(getListenerDoc(l))}</p>
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
// nyelv menü építés (zászló képekkel)
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

    const left = document.createElement("div");

    const title = document.createElement("div");
    title.style.fontWeight = "800";
    title.appendChild(makeFlagImg(l.flag, label));
    title.appendChild(document.createTextNode(safeText(label)));

    const meta = document.createElement("small");
    meta.textContent = `${safeText(l.langName)} • ${safeText(l.locale)}`;

    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement("small");
    right.textContent = safeText(l.market);

    btn.appendChild(left);
    btn.appendChild(right);

    btn.addEventListener("click", () => setLocale(l.locale));
    el.langMenu.appendChild(btn);
  });
}

function renderLanguageButton() {
  const current =
    state.languages.find((l) => l.locale === state.locale) ||
    state.languages.find((l) => l.market === "hu");

  if (!current) {
    el.langBtnLabel.textContent = "Nyelv";
    return;
  }

  const region = marketToRegion(current.market);
  const label = getNativeRegionName(current.locale, region, current.name);

  // gomb label: zászló kép + szöveg
  el.langBtnLabel.innerHTML = "";
  el.langBtnLabel.appendChild(makeFlagImg(current.flag, label));
  el.langBtnLabel.appendChild(document.createTextNode(safeText(label)));
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
      <h1 class="h1">${safeText(t("error_title"))}</h1>
      <p class="p">${safeText(t("error_load"))}</p>
      <pre style="white-space:pre-wrap;color:var(--muted);">${safeText(err.message)}</pre>
    </div>
  `;
});