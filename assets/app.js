// ================================================================
// segédfüggvények
// ================================================================
function $(sel) {
  return document.querySelector(sel);
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
// konfiguráció betöltése
// ================================================================
const CFG = window.SITE_CONFIG || {
  BOT_NAME: "Discord Bot",
  TAGLINE: "",
  DISCORD_INVITE_URL: "#",
  SUPPORT_SERVER_URL: "#",
  GITHUB_REPO_URL: "",
  FEATURED_COMMANDS: []
};

// ================================================================
// globális UI feltöltés (címek + linkek)
// ================================================================
function hydrateCommon() {
  const brandName = $("#brandName");
  if (brandName) brandName.textContent = CFG.BOT_NAME;

  const heroTitle = $("#heroTitle");
  if (heroTitle) heroTitle.textContent = CFG.BOT_NAME;

  const heroTagline = $("#heroTagline");
  if (heroTagline) heroTagline.textContent = CFG.TAGLINE;

  const inviteBtn = $("#inviteBtn");
  if (inviteBtn) inviteBtn.href = CFG.DISCORD_INVITE_URL || "#";

  const supportBtn = $("#supportBtn");
  if (supportBtn) supportBtn.href = CFG.SUPPORT_SERVER_URL || "#";

  const githubBtn = $("#githubBtn");
  if (githubBtn) {
    if (CFG.GITHUB_REPO_URL) githubBtn.href = CFG.GITHUB_REPO_URL;
    else githubBtn.style.display = "none";
  }

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

// ================================================================
// parancsok betöltése és renderelése
// ================================================================
async function loadCommands() {
  // ================================================================
  // GitHub Pages: a parancs lista útvonala oldaltól függően eltérhet
  // ================================================================
  const candidates = ["./assets/commands.json", "../assets/commands.json", "../../assets/commands.json"];
  let lastErr = null;

  for (const path of candidates) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (res.ok) return res.json();
      lastErr = new Error(`HTTP ${res.status} - ${path}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Nem sikerült betölteni a commands.json-t");
}

function categorizeCommand(cmdName) {
  if (cmdName.startsWith("calculate-")) return "Számolók";
  if (cmdName.startsWith("compare-") || cmdName.startsWith("check-") || cmdName.endsWith("-stat")) return "Statisztika";
  if (cmdName.includes("map")) return "Térképek";
  if (cmdName.includes("notification")) return "Értesítések";
  if (cmdName.includes("ticket")) return "Ticket / Support";
  if (cmdName.includes("poll")) return "Közösség";
  if (["logging", "settings", "set-bot-role", "register-world-channel", "register-world-server", "toggle-coords-info"].includes(cmdName)) return "Admin / Beállítás";
  return "Egyéb";
}

function renderCommandCard(c) {
  const perms = Array.isArray(c.permissions) && c.permissions.length
    ? `<div class="details"><div><b>Jogosultságok:</b> ${escapeHtml(c.permissions.join(", "))}</div></div>`
    : "";

  let optsHtml = "";
  if (Array.isArray(c.options) && c.options.length) {
    const items = c.options.map(o => {
      const req = (o.required === true) ? "kötelező" : "opcionális";
      return `<li><code>${escapeHtml(o.name || "")}</code> <span class="muted">(${escapeHtml(o.type)} · ${req})</span> — ${escapeHtml(o.description || "")}</li>`;
    }).join("");
    optsHtml = `<div class="details"><div><b>Opciók:</b></div><ul>${items}</ul></div>`;
  }

  const cat = categorizeCommand(c.name);

  return `
    <div class="cmd" data-name="${escapeHtml(c.name)}" data-cat="${escapeHtml(cat)}">
      <div class="cmd-top">
        <div>
          <div class="cmd-name">/${escapeHtml(c.name)}</div>
          <div class="cmd-desc">${escapeHtml(c.description || "")}</div>
        </div>
        <div class="cmd-meta">
          <span class="badge">${escapeHtml(cat)}</span>
          <span class="badge">${(c.options?.length || 0)} opció</span>
        </div>
      </div>
      ${optsHtml}
      ${perms}
    </div>
  `;
}

function renderCommandsList(targetEl, commands) {
  targetEl.innerHTML = commands.map(renderCommandCard).join("");
}

function wireSearch(inputEl, listEl) {
  inputEl.addEventListener("input", () => {
    const q = inputEl.value.trim().toLowerCase();
    const cards = listEl.querySelectorAll(".cmd");
    cards.forEach(card => {
      const name = card.getAttribute("data-name")?.toLowerCase() || "";
      const cat = card.getAttribute("data-cat")?.toLowerCase() || "";
      const text = (card.textContent || "").toLowerCase();
      const ok = !q || name.includes(q) || cat.includes(q) || text.includes(q);
      card.style.display = ok ? "" : "none";
    });
  });
}

// ================================================================
// kiemelt parancsok a főoldalon
// ================================================================
function renderFeaturedCommands(targetEl, allCommands) {
  const wanted = new Set((CFG.FEATURED_COMMANDS || []).map(s => String(s)));
  const featured = allCommands.filter(c => wanted.has(c.name)).slice(0, 6);
  if (!featured.length) {
    targetEl.innerHTML = '<div class="muted">Nincs beállítva kiemelt parancslista.</div>';
    return;
  }
  targetEl.innerHTML = featured.map(c => `
    <div class="cmd">
      <div class="cmd-top">
        <div>
          <div class="cmd-name">/${escapeHtml(c.name)}</div>
          <div class="cmd-desc">${escapeHtml(c.description || "")}</div>
        </div>
        <div class="cmd-meta">
          <span class="badge">${(c.options?.length || 0)} opció</span>
        </div>
      </div>
    </div>
  `).join("");
}

// ================================================================
// indulás
// ================================================================
(async function init() {
  hydrateCommon();

  // parancs számláló KPI
  try {
    const cmds = await loadCommands();

    const kpiCmds = $("#kpiCommands");
    if (kpiCmds) kpiCmds.textContent = String(cmds.length);

    // audit esemény KPI (kódból becsült érték, kézzel is átírható a HTML-ben)
    const kpiAudit = $("#kpiAuditEvents");
    if (kpiAudit && !kpiAudit.textContent.trim()) kpiAudit.textContent = "18+";

    const list = $("#commandsList");
    const search = $("#commandsSearch");
    if (list && search) {
      renderCommandsList(list, cmds);
      wireSearch(search, list);
    }

    const featured = $("#featuredCommands");
    if (featured) renderFeaturedCommands(featured, cmds);

  } catch (err) {
    // ha nincs commands.json (vagy rossz path), akkor csak csendben hagyjuk
    console.warn(err);
  }
})();
