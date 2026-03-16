const state = {
  lang: 'hu',
  theme: 'light',
  menu: null,
  i18n: null,
  commandDocs: null,
  activeGroupId: null,
  active: {
    type: 'page',
    id: 'first-steps'
  },
  expandedSections: {},
  sidebarOpen: false,
  visitorStats: {
    today: null,
    total: null
  },
  discordWidgetLoaded: false,
  discordWidgetTheme: null,
  discordWidgetOutsideBound: false
};

// ================================================================
// főmenü ikonok
// ================================================================
const icons = {
  intro: `
    <svg viewBox="0 0 35 35" aria-hidden="true">
      <path fill="currentColor" d="M29.734,34.75H22.578a1.25,1.25,0,0,1-1.25-1.25V29.527a2.9,2.9,0,0,0-1.056-2.19,4.224,4.224,0,0,0-2.64-.987A4.127,4.127,0,0,0,14.7,27.477a3.19,3.19,0,0,0-1.025,2.275V33.5a1.25,1.25,0,0,1-1.25,1.25H5.266a3.136,3.136,0,0,1-3.132-3.132V13.324A5.949,5.949,0,0,1,4.589,8.518L14.9,1.065a4.494,4.494,0,0,1,5.2.018L30.432,8.625a5.949,5.949,0,0,1,2.434,4.79v18.2A3.136,3.136,0,0,1,29.734,34.75Zm-5.906-2.5h5.906a.632.632,0,0,0,.632-.632v-18.2a3.444,3.444,0,0,0-1.408-2.771L18.617,3.1a2.024,2.024,0,0,0-2.256-.007L6.054,10.544a3.441,3.441,0,0,0-1.42,2.78V31.618a.633.633,0,0,0,.632.632h5.906v-2.5a5.666,5.666,0,0,1,1.783-4.068A6.526,6.526,0,0,1,17.7,23.852a6.72,6.72,0,0,1,4.207,1.6,5.365,5.365,0,0,1,1.917,4.078Z"></path>
    </svg>
  `,
  slash: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
    </svg>
  `,
  gear: `
    <svg viewBox="0 0 35 35" aria-hidden="true">
      <path fill="currentColor" d="M24.5,32.849h-14a3.236,3.236,0,0,1-2.792-1.613l-7-12.124a3.231,3.231,0,0,1,0-3.223l7-12.125A3.234,3.234,0,0,1,10.5,2.151h14a3.234,3.234,0,0,1,2.793,1.612l7,12.125a3.231,3.231,0,0,1,0,3.223l-7,12.125A3.235,3.235,0,0,1,24.5,32.849Zm-14-28.2a.727.727,0,0,0-.627.363l-7,12.124a.725.725,0,0,0,0,.725l7,12.123a.727.727,0,0,0,.627.363h14a.726.726,0,0,0,.629-.364l7-12.123a.725.725,0,0,0,0-.725l-7-12.123a.725.725,0,0,0-.628-.363Z"></path>
      <path fill="currentColor" d="M17.5,23.862A6.362,6.362,0,1,1,23.862,17.5,6.369,6.369,0,0,1,17.5,23.862Zm0-10.224A3.862,3.862,0,1,0,21.362,17.5,3.866,3.866,0,0,0,17.5,13.638Z"></path>
    </svg>
  `,
  policy: `
    <svg viewBox="0 0 35 35" aria-hidden="true">
      <path fill="currentColor" d="M17.5,34.44A3.07,3.07,0,0,1,15.89,34L9.82,30.45A14.79,14.79,0,0,1,2.25,17.7V8A3.2,3.2,0,0,1,4.34,5L16.4.57a3.2,3.2,0,0,1,2.2,0L30.66,5a3.2,3.2,0,0,1,2.09,3V17.7a14.79,14.79,0,0,1-7.57,12.75L19.11,34A3.07,3.07,0,0,1,17.5,34.44Zm0-31.56a.67.67,0,0,0-.24,0L5.2,7.33A.69.69,0,0,0,4.75,8V17.7a12.3,12.3,0,0,0,6.33,10.59l6.07,3.56a.73.73,0,0,0,.7,0l6.07-3.56h0A12.3,12.3,0,0,0,30.25,17.7V8a.69.69,0,0,0-.45-.65L17.74,2.92A.67.67,0,0,0,17.5,2.88Z"></path>
      <path fill="currentColor" d="M16.4,22.35a1.3,1.3,0,0,1-.81-.29l-4.27-3.6a1.25,1.25,0,0,1,1.61-1.92l3.35,2.82L22,13.06a1.25,1.25,0,0,1,1.86,1.68l-6.48,7.2A1.27,1.27,0,0,1,16.4,22.35Z"></path>
    </svg>
  `,
  discord: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      fill="currentColor"
      d="M19.888 7.335a5.134 5.134 0 0 0-2.893-2.418a9.144 9.144 0 0 0-2.275-.508a9.963 9.963 0 0 0-.508 1.038a15.039 15.039 0 0 0-4.56 0a11.372 11.372 0 0 0-.519-1.038c-.752.082-1.493.249-2.208.497a5.123 5.123 0 0 0-2.904 2.44a16.176 16.176 0 0 0-1.91 9.717a16.562 16.562 0 0 0 4.98 2.528a4.339 4.339 0 0 0 1.104-1.777c-.54-.202-1.06-.45-1.557-.74c-.089-.122.254-.32.364-.354a11.826 11.826 0 0 0 10.037 0c.1 0 .453.232.364.354c-.441.342-1.424.585-1.59.828a7.4 7.4 0 0 0 1.105 1.69a16.628 16.628 0 0 0 4.99-2.53a16.232 16.232 0 0 0-2.02-9.727M8.669 14.7a1.943 1.943 0 0 1-1.92-1.955a1.943 1.943 0 0 1 1.92-1.91a1.942 1.942 0 0 1 1.933 1.965a1.943 1.943 0 0 1-1.933 1.9m6.625 0a1.943 1.943 0 0 1-1.932-1.944a1.932 1.932 0 1 1 3.865.034a1.932 1.932 0 0 1-1.933 1.899z"
    ></path>
  </svg>
`
};

const submenuIcons = {
  command: `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M4.32 5.884 1.781 8l2.539 2.116a.5.5 0 11-.64.768l-3-2.5a.5.5 0 010-.768l3-2.5a.5.5 0 01.64.768m11 1.732-3-2.5a.5.5 0 10-.64.768L14.219 8l-2.539 2.116a.5.5 0 10.64.768l3-2.5a.5.5 0 000-.768M10.17 2.03a.5.5 0 00-.64.3l-4 11a.5.5 0 00.3.64A.5.5 0 006 14a.5.5 0 00.47-.33l4-11a.5.5 0 00-.3-.64"></path>
    </svg>
  `,
  light: `
    <svg viewBox="0 0 35 35" aria-hidden="true">
      <path fill="currentColor" d="M17.5,25.88a8.38,8.38,0,1,1,8.38-8.38A8.389,8.389,0,0,1,17.5,25.88Zm0-14.26a5.88,5.88,0,1,0,5.88,5.88A5.887,5.887,0,0,0,17.5,11.62Z"></path>
      <path fill="currentColor" d="M17.5,5.471h-.034A1.251,1.251,0,0,1,16.25,4.187l.075-2.721A1.267,1.267,0,0,1,17.609.25a1.251,1.251,0,0,1,1.215,1.284l-.075,2.721A1.249,1.249,0,0,1,17.5,5.471Z"></path>
      <path fill="currentColor" d="M26.893,9.364a1.25,1.25,0,0,1-.859-2.158l1.978-1.871A1.25,1.25,0,0,1,29.73,7.151L27.752,9.022A1.242,1.242,0,0,1,26.893,9.364Z"></path>
      <path fill="currentColor" d="M33.5,18.837h-.036l-2.722-.077a1.249,1.249,0,0,1-1.213-1.284,1.211,1.211,0,0,1,1.285-1.214l2.721.077a1.25,1.25,0,0,1-.035,2.5Z"></path>
      <path fill="currentColor" d="M28.748,30.13a1.248,1.248,0,0,1-.909-.392L25.97,27.759a1.25,1.25,0,1,1,1.817-1.717l1.869,1.98a1.249,1.249,0,0,1-.908,2.108Z"></path>
      <path fill="currentColor" d="M17.4,34.75h-.037a1.249,1.249,0,0,1-1.213-1.285l.079-2.721a1.25,1.25,0,0,1,2.5.072l-.079,2.721A1.249,1.249,0,0,1,17.4,34.75Z"></path>
      <path fill="currentColor" d="M6.112,29.989a1.249,1.249,0,0,1-.857-2.159l1.98-1.867A1.25,1.25,0,1,1,8.95,27.781L6.969,29.648A1.242,1.242,0,0,1,6.112,29.989Z"></path>
      <path fill="currentColor" d="M4.221,18.72H4.184l-2.721-.081A1.25,1.25,0,0,1,.251,17.352,1.237,1.237,0,0,1,1.537,16.14l2.721.081a1.25,1.25,0,0,1-.037,2.5Z"></path>
      <path fill="currentColor" d="M8.135,9.335a1.248,1.248,0,0,1-.91-.393L5.359,6.961a1.25,1.25,0,1,1,1.82-1.715L9.046,7.228a1.251,1.251,0,0,1-.911,2.107Z"></path>
    </svg>
  `,
  dark: `
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path fill="currentColor" d="M18.44,34.68a18.22,18.22,0,0,1-2.94-.24,18.18,18.18,0,0,1-15-20.86A18.06,18.06,0,0,1,9.59.63,2.42,2.42,0,0,1,12.2.79a2.39,2.39,0,0,1,1,2.41L11.9,3.1l1.23.22A15.66,15.66,0,0,0,23.34,21h0a15.82,15.82,0,0,0,8.47.53A2.44,2.44,0,0,1,34.47,25,18.18,18.18,0,0,1,18.44,34.68ZM10.67,2.89a15.67,15.67,0,0,0-5,22.77A15.66,15.66,0,0,0,32.18,24a18.49,18.49,0,0,1-9.65-.64A18.18,18.18,0,0,1,10.67,2.89Z"></path>
    </svg>
  `
};

const t = (k) => state.i18n?.[state.lang]?.[k] || state.i18n?.hu?.[k] || k;

const tp = (k, vars = {}) => {
  let text = t(k);

  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });

  return text;
};

const el = (tag, cls, html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  e.innerHTML = html;
  return e;
};

const chevronIcon = () => '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4.5 6 8l4-3.5"/></svg>';

const menuToggleIcon = () => `
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path fill="currentColor" d="M2.667 12h10.666c.367 0 .667-.3.667-.667s-.3-.666-.667-.666H2.667c-.367 0-.667.3-.667.666s.3.667.667.667m0-3.333h10.666c.367 0 .667-.3.667-.667s-.3-.667-.667-.667H2.667C2.3 7.333 2 7.633 2 8s.3.667.667.667m-.667-4c0 .366.3.666.667.666h10.666c.367 0 .667-.3.667-.666S13.7 4 13.333 4H2.667C2.3 4 2 4.3 2 4.667"></path>
  </svg>
`;

// ================================================================
// json fájl betöltése fallback nélkül
// ================================================================
async function fetchJson(path) {
  const res = await fetch(path, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Nem sikerült betölteni: ${path} (${res.status})`);
  }

  return await res.json();
}

// ================================================================
// body görgetésének vezérlése overlay vagy modal esetén
// ================================================================
function syncBodyLock() {
  const sidebarOpen = document.getElementById('sidebarOverlay')?.classList.contains('open');
  const imageOpen = document.getElementById('imageModal')?.classList.contains('open');
  const visitorOpen = document.getElementById('visitorStatsModal')?.classList.contains('open');

  document.body.classList.toggle('modal-open', !!(sidebarOpen || imageOpen || visitorOpen));
}

// ================================================================
// aktív menüpont beállítása
// ================================================================
function setActiveItem(type, id, groupId = null) {
  state.active = { type, id };

  if (groupId) {
    state.activeGroupId = groupId;
  }

  buildSidebar();
}

// ================================================================
// aktív menüpont ellenőrzése
// ================================================================
function isActiveItem(type, id) {
  return state.active?.type === type && state.active?.id === id;
}

// ================================================================
// alkalmazás inicializálása
// ================================================================
async function init() {
  try {
    const [menu, i18n, commandDocs] = await Promise.all([
      fetchJson('menu.json'),
      fetchJson('translations.json'),
      fetchJson('command-docs.json')
    ]);

    state.menu = menu;
    state.i18n = i18n;
    state.commandDocs = commandDocs;
    state.lang = localStorage.getItem('lang') || 'hu';

    const storedTheme = localStorage.getItem('theme');
    state.theme = (storedTheme === 'dark' || storedTheme === 'light') ? storedTheme : 'light';
    state.activeGroupId = state.menu.nav?.[0]?.id || null;

    applyTheme();
    createImageModal();
    createVisitorStatsModal();
    buildTopbar();
    buildSidebar();
    initSidebarDrawer();
    initVisitorStatsTrigger();

    renderPage(
      getPageContent('pages.firstSteps'),
      ['Dashboard', t('sidebar.introduction'), t('intro.firstSteps')],
      {
        type: 'page',
        id: 'first-steps',
        groupId: 'intro'
      }
    );

    await loadLastUpdatedFromGitHub();
    await loadVisitorStats();
  } catch (error) {
    console.error('Inicializálási hiba:', error);

    document.body.innerHTML = `
      <div style="padding:24px;font-family:Inter,Segoe UI,Arial,sans-serif;">
        <h1>${t('errors.load.title')}</h1>
        <p>${t('errors.load.description')}</p>
        <p>${t('errors.load.consoleHint')}</p>
      </div>
    `;
  }
}

// ================================================================
// téma alkalmazása
// ================================================================
function applyTheme() {
  const root = document.documentElement;
  root.setAttribute('data-theme', state.theme === 'dark' ? 'dark' : 'light');
}

// ================================================================
// sidebar nyitása / zárása
// ================================================================
function setSidebarOpen(open) {
  const overlay = document.getElementById('sidebarOverlay');
  if (!overlay) return;

  state.sidebarOpen = !!open;
  overlay.classList.toggle('open', state.sidebarOpen);
  overlay.setAttribute('aria-hidden', String(!state.sidebarOpen));
  syncBodyLock();
}

function closeSidebar() {
  setSidebarOpen(false);
}

function initSidebarDrawer() {
  const toggle = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (toggle) {
    toggle.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setSidebarOpen(!state.sidebarOpen);
    };
  }

  if (backdrop) {
    backdrop.onclick = () => closeSidebar();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeImageModal();
      closeVisitorStatsModal();
    }
  });
}

// ================================================================
// felső sáv felépítése
// ================================================================
function buildTopbar() {
  const menuButton = document.getElementById('sidebarToggle');
  const discordIcon = document.getElementById('discordIcon');
  const picker = document.getElementById('languagePicker');
  const current = document.getElementById('languageCurrent');
  const menu = document.getElementById('languageMenu');
  const actionButton = document.getElementById('topbarActionBtn');
  const actionMenu = document.getElementById('topbarActionMenu');
  const activeLang = state.menu.languages.find((l) => l.code === state.lang) || state.menu.languages[0];

  // ================================================================
  // hamburger menü ikon
  // ================================================================
  if (menuButton) {
    menuButton.innerHTML = menuToggleIcon();
    menuButton.setAttribute('aria-label', 'Menü');
  }

  // ================================================================
  // discord ikon
  // ================================================================
  if (discordIcon) {
    discordIcon.innerHTML = icons.discord;
  }

  if (actionButton) {
    actionButton.setAttribute('aria-label', `${t('topbar.installBrian')} / ${t('topbar.discordServer')}`);
  }

  // ================================================================
  // discord widget inicializálása
  // ================================================================
  initDiscordSupportWidget();

  // ================================================================
  // fordítások frissítése
  // ================================================================
  document.querySelectorAll('[data-i18n]').forEach((n) => {
    n.textContent = t(n.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((n) => {
    n.setAttribute('aria-label', t(n.dataset.i18nAriaLabel));
  });

  if (!picker || !current || !menu) {
    syncImageModalTexts();
    syncVisitorStatsModalTexts();
    return;
  }

  // ================================================================
  // aktuális nyelv gomb tartalma
  // ================================================================
  current.innerHTML = `
    <span class="btn-icon">${svgFlag(activeLang.country)}</span>
    <span>${activeLang.name}</span>
    <span class="lang-arrow">${chevronIcon()}</span>
  `;

  menu.innerHTML = '';

  // ================================================================
  // nyelv lista felépítése
  // ================================================================
  state.menu.languages.forEach((l) => {
    const b = el('button', 'language-item', `<span class="btn-icon">${svgFlag(l.country)}</span> ${l.name}`);

    b.onclick = () => {
      state.lang = l.code;
      localStorage.setItem('lang', state.lang);
      picker.classList.remove('open');
      buildTopbar();
      buildSidebar();
    };

    menu.appendChild(b);
  });

  current.onclick = (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
  };

  // ================================================================
  // külső kattintásra menük bezárása
  // ================================================================
  document.onclick = (e) => {
    if (!picker.contains(e.target)) {
      picker.classList.remove('open');
    }

    if (actionButton && actionMenu && !actionButton.contains(e.target) && !actionMenu.contains(e.target)) {
      actionMenu.classList.remove('open');
      actionButton.setAttribute('aria-expanded', 'false');
    }
  };

  syncImageModalTexts();
  syncVisitorStatsModalTexts();
}

// ================================================================
// discord támogatói widget inicializálása
// ================================================================
async function initDiscordSupportWidget() {
  const guildId = '1386681452510445618';

  const actionButton = document.getElementById('topbarActionBtn');
  const actionMenu = document.getElementById('topbarActionMenu');
  const addBotItem = document.getElementById('topbarAddBotItem');
  const supportItem = document.getElementById('topbarSupportItem');
  const supportStatus = document.getElementById('supportBtnStatus');

  const panel = document.getElementById('discordWidgetPanel');
  const name = document.getElementById('discordWidgetName');
  const status = document.getElementById('discordWidgetStatus');
  const frame = document.getElementById('discordWidgetFrame');
  const loading = document.getElementById('discordWidgetLoading');

  if (
    !actionButton ||
    !actionMenu ||
    !addBotItem ||
    !supportItem ||
    !supportStatus ||
    !panel ||
    !name ||
    !status ||
    !frame ||
    !loading
  ) {
    return;
  }

  // ================================================================
  // bot hozzáadása menüpont linkje
  // ================================================================
  addBotItem.href = state.menu.settings.discord.addBotUrl;

  // ================================================================
  // gyorsművelet menü nyitása / zárása
  // ================================================================
  actionButton.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const open = !actionMenu.classList.contains('open');
    actionMenu.classList.toggle('open', open);
    actionButton.setAttribute('aria-expanded', String(open));
  };

  actionMenu.onclick = (e) => {
    e.stopPropagation();
  };

  // ================================================================
  // support panel nyitása / zárása
  // ================================================================
  const toggleSupportPanel = () => {
    const open = !panel.classList.contains('open');
    panel.classList.toggle('open', open);

    if (open) {
      const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

      if (!state.discordWidgetLoaded || state.discordWidgetTheme !== theme) {
        frame.src = `https://discord.com/widget?id=${guildId}&theme=${theme}`;
        state.discordWidgetLoaded = true;
        state.discordWidgetTheme = theme;
      }

      frame.style.display = 'block';
      loading.style.display = 'none';
    }

    return open;
  };

  supportItem.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    actionMenu.classList.remove('open');
    actionButton.setAttribute('aria-expanded', 'false');

    toggleSupportPanel();
  };

  panel.onclick = (e) => e.stopPropagation();

  // ================================================================
  // külső kattintásra widget bezárása
  // ================================================================
  if (!state.discordWidgetOutsideBound) {
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('open')) return;
      if (actionButton.contains(e.target) || panel.contains(e.target)) return;

      panel.classList.remove('open');
    });

    state.discordWidgetOutsideBound = true;
  }

  // ================================================================
  // discord szerveradatok betöltése
  // ================================================================
  try {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
    if (!res.ok) throw new Error('widget');

    const data = await res.json();
    const serverName = data.name || t('support.serverName');
    const online = data.presence_count ?? 0;

    supportStatus.textContent = tp('support.onlineCount', { count: online });

    name.textContent = serverName;
    status.textContent = tp('support.membersOnlineCount', { count: online });
  } catch {
    supportStatus.textContent = t('support.unavailable');

    name.textContent = t('support.serverName');
    status.textContent = t('support.unavailable');
  }
}

// ================================================================
// zászló ikon html generálása
// ================================================================
function svgFlag(country) {
  const code = String(country || '').toLowerCase();
  return `<img class="flag-img" src="https://flagcdn.com/${code}.svg" alt="${country} flag" loading="lazy"/>`;
}

// ================================================================
// morzsa navigáció
// ================================================================
function setTopBreadcrumb(parts) {
  const n = document.getElementById('topBreadcrumb');
  if (n) n.textContent = '';
}

// ================================================================
// sidebar teljes felépítése
// ================================================================
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = '';

  state.menu.nav.forEach((group) => {
    const open = state.activeGroupId === group.id;
    const block = el('div', `nav-group ${open ? 'open' : ''}`);

    const main = el(
      'button',
      `nav-main ${open ? 'open' : ''}`,
      `
        <span class="nav-main-left">
          <span class="nav-icon">${icons[group.icon] || icons.policy}</span>
          <span>${t(group.labelKey)}</span>
        </span>
        <span class="toggle-icon">${chevronIcon()}</span>
      `
    );

    main.onclick = () => {
      state.activeGroupId = state.activeGroupId === group.id ? null : group.id;
      buildSidebar();
    };

    const submenu = el('div', 'submenu');
    submenu.style.display = open ? 'block' : 'none';

    group.children.forEach((child) => {
      submenu.appendChild(buildChild(child, group));
    });

    block.append(main, submenu);
    sidebar.appendChild(block);
  });
}

// ================================================================
// szekció-azonosító készítése
// ================================================================
function getSectionKey(groupId, childId) {
  return `${groupId}::${childId}`;
}

// ================================================================
// sidebar almenü elem felépítése
// ================================================================
function buildChild(child, group) {
  const sectionKey = getSectionKey(group.id, child.id || child.labelKey || child.type);

  if (child.type === 'commandGroup') {
    const block = el('div', 'submenu-block');
    const opened = !!state.expandedSections[sectionKey];

    const main = el(
      'button',
      `sub-item sub-toggle ${opened ? 'open' : ''}`,
      `
        <span>${t(child.labelKey)}</span>
        <span class="toggle-icon">${chevronIcon()}</span>
      `
    );

    const list = el('div', 'command-list');
    list.style.display = opened ? 'block' : 'none';

    main.onclick = () => {
      state.expandedSections[sectionKey] = !state.expandedSections[sectionKey];
      buildSidebar();
    };

    child.commands.forEach((cmd) => {
      const activeClass = isActiveItem('command', cmd) ? 'active' : '';

      const b = el(
        'button',
        `cmd-option with-icon ${activeClass}`,
        `
          <span class="submenu-icon">${submenuIcons.command}</span>
          <span>${formatSidebarCommandLabel(cmd)}</span>
        `
      );

      b.onclick = () => {
        renderCommand(cmd, group.labelKey, child.labelKey, group.id);
        closeSidebar();
      };

      list.appendChild(b);
    });

    block.append(main, list);
    return block;
  }

  if (child.type === 'appearance') {
    const block = el('div', 'submenu-block');
    const opened = !!state.expandedSections[sectionKey];

    const main = el(
      'button',
      `sub-item sub-toggle ${opened ? 'open' : ''}`,
      `
        <span>${t(child.labelKey)}</span>
        <span class="toggle-icon">${chevronIcon()}</span>
      `
    );

    const list = el('div', 'command-list');
    list.style.display = opened ? 'block' : 'none';

    main.onclick = () => {
      state.expandedSections[sectionKey] = !state.expandedSections[sectionKey];
      buildSidebar();
    };

    [
      { mode: 'light', icon: submenuIcons.light },
      { mode: 'dark', icon: submenuIcons.dark }
    ].forEach((item) => {
      const b = el(
        'button',
        `cmd-option with-icon ${state.theme === item.mode ? 'active' : ''}`,
        `
          <span class="submenu-icon">${item.icon}</span>
          <span>${t(`settings.${item.mode}`)}</span>
        `
      );

      b.onclick = () => {
        state.theme = item.mode;
        localStorage.setItem('theme', state.theme);
        applyTheme();
        buildTopbar();
        buildSidebar();
        closeSidebar();
      };

      list.appendChild(b);
    });

    block.append(main, list);
    return block;
  }

  if (child.type === 'language') {
    const block = el('div', 'submenu-block');
    const opened = !!state.expandedSections[sectionKey];

    const main = el(
      'button',
      `sub-item sub-toggle ${opened ? 'open' : ''}`,
      `
        <span>${t(child.labelKey)}</span>
        <span class="toggle-icon">${chevronIcon()}</span>
      `
    );

    const list = el('div', 'command-list');
    list.style.display = opened ? 'block' : 'none';

    main.onclick = () => {
      state.expandedSections[sectionKey] = !state.expandedSections[sectionKey];
      buildSidebar();
    };

    state.menu.languages.forEach((l) => {
      const b = el(
        'button',
        `cmd-option with-icon ${state.lang === l.code ? 'active' : ''}`,
        `
          <span class="submenu-flag">${svgFlag(l.country)}</span>
          <span>${l.name}</span>
        `
      );

      b.onclick = () => {
        state.lang = l.code;
        localStorage.setItem('lang', state.lang);
        buildTopbar();
        buildSidebar();
        closeSidebar();
      };

      list.appendChild(b);
    });

    block.append(main, list);
    return block;
  }

  const activeClass = isActiveItem('page', child.id) ? 'active' : '';
  const b = el('button', `sub-item ${activeClass}`, t(child.labelKey));

  b.onclick = () => {
    if (child.type === 'page') {
      renderPage(
        getPageContent(child.contentKey),
        [t(group.labelKey), t(child.labelKey)],
        {
          type: 'page',
          id: child.id,
          groupId: group.id
        }
      );
      closeSidebar();
    }
  };

  return b;
}

// ================================================================
// oldal tartalmának feloldása fordítási kulcsokból
// ================================================================
function getPageContent(contentKey) {
  const page = {
    title: t(`${contentKey}.title`),
    text: t(`${contentKey}.text`)
  };

  const steps = [];

  for (let i = 1; i <= 20; i++) {
    const titleKey = `${contentKey}.steps.${i}.title`;
    const textKey = `${contentKey}.steps.${i}.text`;

    const stepTitle = t(titleKey);
    const stepText = t(textKey);

    const hasTitle = stepTitle !== titleKey;
    const hasText = stepText !== textKey;

    if (!hasTitle && !hasText) {
      break;
    }

    steps.push({
      title: hasTitle ? stepTitle : `${i}. lépés`,
      text: hasText ? stepText : ''
    });
  }

  if (steps.length) {
    page.steps = steps;
  }

  return page;
}

// ================================================================
// oldal szövegének formázása
// ================================================================
function formatPageText(text) {
  if (!text) return '';

  return String(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p class="page-intro">${paragraph}</p>`)
    .join('');
}

// ================================================================
// egyszerű tartalmi oldal renderelése
// ================================================================
function renderPage(page, crumb, meta = null) {
  if (meta?.type && meta?.id) {
    setActiveItem(meta.type, meta.id, meta.groupId || null);
  }

  setTopBreadcrumb(crumb);

  const introHtml = formatPageText(page.text);
  const stepsHtml = Array.isArray(page.steps) && page.steps.length
    ? `
      <ol class="setup-steps">
        ${page.steps.map((step) => `
          <li class="setup-step">
            <h2>${step.title}</h2>
            <p>${step.text}</p>
          </li>
        `).join('')}
      </ol>
    `
    : '';

  document.getElementById('content').innerHTML = `
    <div class="card">
      <h1>${page.title}</h1>
      ${introHtml}
      ${stepsHtml}
    </div>
  `;
}

// ================================================================
// kép modal létrehozása
// ================================================================
function createImageModal() {
  if (document.getElementById('imageModal')) return;

  const modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.className = 'dialog-modal';
  modal.innerHTML = `
    <div class="dialog-modal-dialog image-dialog" role="dialog" aria-modal="true" aria-labelledby="imageModalTitle">
      <div class="dialog-modal-header">
        <strong id="imageModalTitle"></strong>
        <button id="imageModalClose" class="dialog-modal-close" type="button" aria-label="Bezárás"></button>
      </div>
      <div class="dialog-modal-body image-modal-body">
        <img id="imageModalImage" alt="" />
        <p id="imageModalMessage" class="image-modal-message"></p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeImageModal();
    }
  });

  document.getElementById('imageModalClose')?.addEventListener('click', closeImageModal);
  syncImageModalTexts();
}

// ================================================================
// kép modal szövegeinek frissítése
// ================================================================
function syncImageModalTexts() {
  const title = document.getElementById('imageModalTitle');
  const closeButton = document.getElementById('imageModalClose');

  if (title) {
    title.textContent = t('content.viewImage');
  }

  if (closeButton) {
    closeButton.setAttribute('aria-label', t('content.close'));
  }
}

// ================================================================
// kép modal megnyitása
// ================================================================
function openImageModal(src, altText = '') {
  const modal = document.getElementById('imageModal');
  const image = document.getElementById('imageModalImage');
  const message = document.getElementById('imageModalMessage');

  if (!modal || !image || !message) return;

  modal.classList.add('open');
  image.style.display = 'none';
  image.removeAttribute('src');
  image.alt = altText;
  message.textContent = '';
  syncBodyLock();

  const preview = new Image();

  preview.onload = () => {
    image.src = src;
    image.style.display = 'block';
  };

  preview.onerror = () => {
    message.textContent = t('content.imageNotFound');
  };

  preview.src = src;
}

// ================================================================
// kép modal bezárása
// ================================================================
function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  modal.classList.remove('open');
  syncBodyLock();
}

// ================================================================
// látogatói stat modal létrehozása
// ================================================================
function createVisitorStatsModal() {
  if (document.getElementById('visitorStatsModal')) return;

  const modal = document.createElement('div');
  modal.id = 'visitorStatsModal';
  modal.className = 'dialog-modal';
  modal.innerHTML = `
    <div class="dialog-modal-dialog stats-dialog" role="dialog" aria-modal="true" aria-labelledby="visitorStatsModalTitle">
      <div class="dialog-modal-header">
        <strong id="visitorStatsModalTitle"></strong>
        <button id="visitorStatsModalClose" class="dialog-modal-close" type="button" aria-label="Bezárás"></button>
      </div>
      <div class="dialog-modal-body">
        <div class="stats-list">
          <div class="stats-row">
            <span id="visitorStatsLabelToday"></span>
            <strong id="visitorStatsToday"></strong>
          </div>
          <div class="stats-row">
            <span id="visitorStatsLabelTotal"></span>
            <strong id="visitorStatsTotal"></strong>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVisitorStatsModal();
    }
  });

  document.getElementById('visitorStatsModalClose')?.addEventListener('click', closeVisitorStatsModal);
  syncVisitorStatsModalTexts();
  updateVisitorStatsModal();
}

// ================================================================
// látogatói stat modal szövegeinek frissítése
// ================================================================
function syncVisitorStatsModalTexts() {
  const title = document.getElementById('visitorStatsModalTitle');
  const closeButton = document.getElementById('visitorStatsModalClose');
  const todayLabel = document.getElementById('visitorStatsLabelToday');
  const totalLabel = document.getElementById('visitorStatsLabelTotal');

  if (title) {
    title.textContent = String(t('sidebar.visitors')).replace(/[:：]\s*$/, '');
  }

  if (closeButton) {
    closeButton.setAttribute('aria-label', t('content.close'));
  }

  if (todayLabel) {
    todayLabel.textContent = t('sidebar.visitorsToday');
  }

  if (totalLabel) {
    totalLabel.textContent = t('sidebar.visitorsTotal');
  }
}

// ================================================================
// loading dots html generálása
// ================================================================
function getLoadingDotsMarkup() {
  return `
    <span class="loading-dots" aria-label="${t('common.loading')}">
      <span>.</span><span>.</span><span>.</span>
    </span>
  `;
}

// ================================================================
// látogatói stat modal adatainak frissítése
// ================================================================
function updateVisitorStatsModal() {
  const today = document.getElementById('visitorStatsToday');
  const total = document.getElementById('visitorStatsTotal');

  if (today) {
    if (state.visitorStats.today === null || state.visitorStats.today === undefined) {
      today.innerHTML = getLoadingDotsMarkup();
    } else {
      today.textContent = state.visitorStats.today;
    }
  }

  if (total) {
    if (state.visitorStats.total === null || state.visitorStats.total === undefined) {
      total.innerHTML = getLoadingDotsMarkup();
    } else {
      total.textContent = state.visitorStats.total;
    }
  }
}

// ================================================================
// látogatói stat modal vezérlése
// ================================================================
function openVisitorStatsModal() {
  const modal = document.getElementById('visitorStatsModal');
  if (!modal) return;

  updateVisitorStatsModal();
  modal.classList.add('open');
  syncBodyLock();
}

function closeVisitorStatsModal() {
  const modal = document.getElementById('visitorStatsModal');
  if (!modal) return;

  modal.classList.remove('open');
  syncBodyLock();
}

function initVisitorStatsTrigger() {
  const trigger = document.getElementById('visitorStatsTrigger');
  if (!trigger) return;

  trigger.onclick = () => openVisitorStatsModal();
}

// ================================================================
// parancs dokumentáció feloldása főparancsra és alparancsra
// ================================================================
function getResolvedCommandDoc(cmd) {
  const docsConfig = state.commandDocs;

  if (!docsConfig) {
    return {
      docsConfig: { defaultAccess: '', defaultDescription: '', defaultOptions: [], commands: {} },
      doc: null,
      parentDoc: null,
      rootCommand: cmd,
      subcommand: ''
    };
  }

  const directDoc = docsConfig.commands?.[cmd];

  if (directDoc) {
    return {
      docsConfig,
      doc: directDoc,
      parentDoc: null,
      rootCommand: cmd,
      subcommand: ''
    };
  }

  const parts = String(cmd || '').trim().split(/\s+/);
  const rootCommand = parts[0] || cmd;
  const subcommand = parts.slice(1).join(' ');
  const parentDoc = docsConfig.commands?.[rootCommand] || null;
  const doc = subcommand ? parentDoc?.subcommands?.[subcommand] || null : parentDoc;

  return {
    docsConfig,
    doc,
    parentDoc,
    rootCommand,
    subcommand
  };
}

// ================================================================
// saját kulcs ellenőrzése objektumon
// ================================================================
function hasOwnField(obj, key) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

// ================================================================
// megjelenítendő szöveg normalizálása
// ================================================================
function formatDisplayValue(value, fallback = '-') {
  if (value === undefined || value === null) {
    return fallback;
  }

  const text = String(value).trim();
  return text ? text : fallback;
}

// ================================================================
// csak akkor ad vissza fordítást, ha a kulcs tényleg létezik
// ================================================================
function translateIfExists(key, fallback = '') {
  const translated = t(key);
  return translated !== key ? translated : fallback;
}

// ================================================================
// parancs fordítási kulcs alapjának felépítése
// ================================================================
function getCommandTranslationBase(rootCommand, subcommand = '') {
  const root = String(rootCommand || '').replace(/^\//, '');

  return subcommand
    ? `docs.commands.${root}.subcommands.${subcommand}`
    : `docs.commands.${root}`;
}

// ================================================================
// hozzáférés feloldása parancs vagy alparancs szinten
// ================================================================
function getCommandAccess(doc, parentDoc, docsConfig) {
  if (hasOwnField(doc, 'access')) {
    return doc.access;
  }

  if (hasOwnField(parentDoc, 'access')) {
    return parentDoc.access;
  }

  return docsConfig.defaultAccess;
}

// ================================================================
// parancs opciók feloldása
// ================================================================
function getCommandOptions(doc, parentDoc, docsConfig) {
  if (hasOwnField(doc, 'options') && Array.isArray(doc.options)) {
    return doc.options;
  }

  if (hasOwnField(parentDoc, 'options') && Array.isArray(parentDoc.options)) {
    return parentDoc.options;
  }

  return Array.isArray(docsConfig.defaultOptions) ? docsConfig.defaultOptions : [];
}

// ================================================================
// parancs leírás fordításának feloldása
// ================================================================
function getTranslatedCommandDescription(cmd, rootCommand, subcommand, doc, parentDoc, docsConfig) {
  const baseKey = getCommandTranslationBase(rootCommand, subcommand);
  const defaultDescription = translateIfExists(
    'docs.defaultDescription',
    docsConfig.defaultDescription || 'parancs részletes leírása.'
  );

  const rawDescription = doc?.description || parentDoc?.description || defaultDescription;
  const fallbackDescription = rawDescription || `${cmd} ${defaultDescription}`;

  return translateIfExists(`${baseKey}.description`, fallbackDescription);
}

// ================================================================
// parancs hozzáférés fordításának feloldása
// ================================================================
function getTranslatedCommandAccess(rootCommand, subcommand, doc, parentDoc, docsConfig) {
  const baseKey = getCommandTranslationBase(rootCommand, subcommand);
  const rawAccess = getCommandAccess(doc, parentDoc, docsConfig);
  const defaultAccess = translateIfExists(
    'docs.defaultAccess',
    docsConfig.defaultAccess || '-'
  );

  return translateIfExists(`${baseKey}.access`, rawAccess || defaultAccess);
}

// ================================================================
// típus mező fordítása
// ================================================================
function translateCommandType(type) {
  return translateIfExists(`docs.types.${type}`, formatDisplayValue(type));
}

// ================================================================
// egyszeres érték fordítása
// ================================================================
function translateSingleCommandValue(value) {
  const normalized = String(value || '').trim();

  const valueKeyMap = {
    'koordináta': 'docs.values.coordinate',
    'dátum': 'docs.values.date',
    'egység neve': 'docs.values.unitName',
    'klán név': 'docs.values.tribeName',
    'statisztika típusa': 'docs.values.statType',
    'koordináta(max. 5)': 'docs.values.coordinateMax5',
    'játékos név': 'docs.values.playerName',
    'minimum 1 óra; alapértelmezett: 1 óra': 'docs.values.pollDurationDefault',
    'fájl': 'docs.values.file',
    'világ azonosító': 'docs.values.worldId',
    'szerep': 'docs.values.role',
    'csatorna neve': 'docs.values.channelName'
  };

  const key = valueKeyMap[normalized];
  return key ? translateIfExists(key, normalized) : normalized;
}

// ================================================================
// formátum mező fordítása
// ================================================================
function translateCommandFormat(format) {
  const normalized = String(format || '').trim();

  const formatKeyMap = {
    'koordináták elválasztása: vessző, szóköz, pontosvessző vagy új sor': 'docs.formats.coordinatesList',
    'klánok elválasztása: &': 'docs.formats.tribesAmp',
    'játékosok elválasztása: &': 'docs.formats.playersAmp',
    'események elválasztása: &': 'docs.formats.eventsAmp',
    '.txt': 'docs.formats.fileTxt',
    'x%': 'docs.formats.percent'
  };

  const key = formatKeyMap[normalized];
  return key ? translateIfExists(key, normalized) : formatDisplayValue(format);
}

// ================================================================
// lehetséges értékek cella formázása
// ================================================================
function formatCommandValuesCell(option) {
  const values = Array.isArray(option?.values)
    ? option.values
    : (option?.value !== undefined && option?.value !== null && option?.value !== '' ? [option.value] : []);

  if (values.length > 1) {
    return `<select>${values.map((v) => `<option>${v}</option>`).join('')}</select>`;
  }

  if (values.length === 1) {
    return translateSingleCommandValue(values[0]);
  }

  return '-';
}

// ================================================================
// parancs ismertető renderelése
// ================================================================
function renderCommand(cmd, groupKey, subKey, groupId = null) {
  setActiveItem('command', cmd, groupId);

  const imageName = cmd.replace(/^\//, '').replace(/\s+/g, '-');
  const imagePath = `images/${imageName}.png`;
  const { docsConfig, doc, parentDoc, rootCommand, subcommand } = getResolvedCommandDoc(cmd);

  const commandOptions = getCommandOptions(doc, parentDoc, docsConfig);
  const description = getTranslatedCommandDescription(cmd, rootCommand, subcommand, doc, parentDoc, docsConfig);
  const access = getTranslatedCommandAccess(rootCommand, subcommand, doc, parentDoc, docsConfig);

  const options = commandOptions.map((option) => `
    <tr>
      <td>${formatDisplayValue(option.name)}</td>
      <td>${translateCommandType(option.type)}</td>
      <td>${option.required ? t('common.yes') : t('common.no')}</td>
      <td>${formatDisplayValue(option.source)}</td>
      <td>${translateCommandFormat(option.format)}</td>
      <td>${formatCommandValuesCell(option)}</td>
    </tr>
  `).join('');

  const tableBody = options || `<tr><td colspan="6">-</td></tr>`;

  setTopBreadcrumb(['Dashboard', t('sidebar.commands'), t(subKey), cmd]);

  document.getElementById('content').innerHTML = `
    <div class="card">
      <h1>${cmd}</h1>
      <p>${description}</p>
      <p><strong>${t('content.access')}:</strong> ${formatDisplayValue(access)}</p>

      <div class="command-actions">
        <button id="commandImageButton" class="command-image-button" type="button">
          ${t('content.viewImage')}
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${t('content.optionName')}</th>
              <th>${t('content.optionType')}</th>
              <th>${t('content.optionRequired')}</th>
              <th>${t('content.optionSource')}</th>
              <th>${t('content.optionFormat')}</th>
              <th>${t('content.optionValue')}</th>
            </tr>
          </thead>
          <tbody>${tableBody}</tbody>
        </table>
      </div>
    </div>
  `;

  const imageButton = document.getElementById('commandImageButton');
  if (imageButton) {
    imageButton.onclick = () => openImageModal(imagePath, `${cmd} demo`);
  }
}

// ================================================================
// dátum formázása: YYYY.MM.DD HH:MM:SS
// ================================================================
function formatFooterDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return t('common.notAvailable');
  }

  const formatter = new Intl.DateTimeFormat('hu-HU', {
    timeZone: 'Europe/Budapest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  const hour = parts.find((p) => p.type === 'hour')?.value;
  const minute = parts.find((p) => p.type === 'minute')?.value;
  const second = parts.find((p) => p.type === 'second')?.value;

  return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
}

// ================================================================
// utolsó frissítés betöltése GitHubból
// ================================================================
async function loadLastUpdatedFromGitHub() {
  const target = document.getElementById('lastUpdatedText');

  if (!target) {
    console.error('Nem található a #lastUpdatedText elem.');
    return;
  }

  const owner = 'oreg-kh';
  const repo = 'brian-the-barbarian';
  const branch = 'main';

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=1`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`GitHub API hiba: ${response.status}`);
    }

    const commits = await response.json();
    const latestCommit = Array.isArray(commits) ? commits[0] : null;
    const commitDate = latestCommit?.commit?.committer?.date || latestCommit?.commit?.author?.date;

    if (!commitDate) {
      throw new Error('Nem található commit dátum.');
    }

    target.textContent = formatFooterDate(commitDate);
  } catch (error) {
    console.error('Utolsó frissítés lekérése sikertelen:', error);
    target.textContent = t('common.notAvailable');
  }
}

// ================================================================
// látogatói statisztika betöltése Google Apps Scriptből
// ================================================================
async function loadVisitorStats() {
  const endpoint = 'https://script.google.com/macros/s/AKfycbz0CpGtSId3S33ZAL6HmHYFntOB_Xl8faC8HWRwzhp1Hysq5EtIbUBn0BcvuLFD9qEk/exec?action=stats';

  // ================================================================
  // betöltés közben loading állapot megjelenítése
  // ================================================================
  state.visitorStats.today = null;
  state.visitorStats.total = null;
  updateVisitorStatsModal();
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.error || 'Ismeretlen statisztikai hiba');
    }

    state.visitorStats.today = String(data.today || '0');
    state.visitorStats.total = String(data.total || '0');
    updateVisitorStatsModal();
  } catch (error) {
    console.error('Látogatói statisztika hiba:', error);
    state.visitorStats.today = t('common.notAvailable');
    state.visitorStats.total = t('common.notAvailable');
    updateVisitorStatsModal();
  }
}

// ================================================================
// sidebarban megjelenített parancsnév formázása
// ================================================================
function formatSidebarCommandLabel(cmd) {
  return String(cmd || '').replace(/^\//, '');
}

init();
