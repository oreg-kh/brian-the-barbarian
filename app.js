const state = {
  lang: 'hu',
  theme: 'light',
  menu: null,
  i18n: null,
  commandDocs: null,
  active: null,
  activeGroupId: null,
  discordWidgetLoaded: false,
  discordWidgetTheme: null,
  discordWidgetOutsideBound: false
};

const icons = {
  intro: `<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"/><path d="M8 5v14M4 10h16"/></svg>`,
  slash: `<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M7 10.5 10 12 7 13.5"/><path d="M12 14h5"/></svg>`,
  gear: `<svg viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.2994 10.4527L19.2267 10.7677C19.3846 10.7935 19.5003 10.9298 19.5 11.0896V12.883C19.5 13.0412 19.3865 13.1768 19.2303 13.2042L17.3004 13.543C17.1885 13.9298 17.0349 14.3022 16.8415 14.6543L17.9823 16.2382C18.0759 16.3679 18.0612 16.5463 17.9483 16.6595L16.6804 17.9283C16.5682 18.0401 16.3921 18.0561 16.2623 17.9645L14.6627 16.8424C14.3099 17.0387 13.9352 17.1952 13.5442 17.3103L13.2034 19.231C13.176 19.3865 13.0406 19.5 12.8825 19.5H11.0888C10.9294 19.5 10.7934 19.3849 10.7676 19.228L10.4493 17.3168C10.059 17.204 9.6823 17.0485 9.32585 16.8525L7.73767 17.9648C7.60821 18.0558 7.43178 18.0401 7.31992 17.9283L6.05198 16.6595C5.93947 16.5463 5.9248 16.3686 6.01741 16.2391L7.13958 14.6697C6.94163 14.3116 6.78444 13.9337 6.67062 13.5414L4.76905 13.2042C4.61349 13.1765 4.5 13.0412 4.5 12.883V11.0896C4.5 10.9304 4.61544 10.7941 4.77263 10.768L6.67421 10.4514C6.78868 10.0582 6.94586 9.68022 7.14316 9.32315L6.0347 7.73739C5.94371 7.60793 5.95937 7.43185 6.07122 7.32L7.33883 6.0525C7.452 5.94 7.62908 5.925 7.7592 6.01793L9.33433 7.14293C9.68817 6.94924 10.0639 6.795 10.4552 6.6825L10.767 4.77359C10.7927 4.61576 10.929 4.5 11.0888 4.5H12.8825C13.041 4.5 13.1763 4.61413 13.2037 4.77L13.5399 6.68935C13.929 6.8025 14.304 6.95837 14.6591 7.15467L16.2385 6.01957C16.3683 5.92598 16.5464 5.94065 16.6595 6.05348L17.9278 7.32098C18.0397 7.43315 18.0553 7.60957 17.9643 7.73902L16.8392 9.34239C17.0323 9.69424 17.1865 10.066 17.2994 10.4527ZM9.71725 12C9.71725 13.2607 10.7393 14.2826 12.0001 14.2826C13.2608 14.2826 14.2829 13.2607 14.2829 12C14.2829 10.7394 13.2608 9.71742 12.0001 9.71742C10.7393 9.71742 9.71725 10.7394 9.71725 12Z"/></svg>`,
  policy: `<svg viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5.2 3.4 8.6 8 10 4.6-1.4 8-4.8 8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></svg>`,
  discord: `<svg viewBox="0 0 18 14" fill="currentColor" stroke="none"><path d="M15.248 1.089A15.431 15.431 0 0011.534 0a9.533 9.533 0 00-.476.921 14.505 14.505 0 00-4.12 0A9.582 9.582 0 006.461 0a15.54 15.54 0 00-3.717 1.091C.395 4.405-.242 7.636.076 10.821A15.269 15.269 0 004.631 13c.369-.473.695-.974.975-1.499a9.896 9.896 0 01-1.536-.699c.13-.089.255-.18.377-.27 1.424.639 2.979.97 4.553.97 1.574 0 3.129-.331 4.553-.97.123.096.25.188.377.27a9.94 9.94 0 01-1.54.7c.28.525.607 1.026.976 1.498a15.2 15.2 0 004.558-2.178c.373-3.693-.639-6.895-2.676-9.733zM6.01 8.862c-.888 0-1.621-.767-1.621-1.712 0-.944.708-1.718 1.618-1.718.91 0 1.638.774 1.623 1.718-.016.945-.715 1.712-1.62 1.712zm5.98 0c-.889 0-1.62-.767-1.62-1.712 0-.944.708-1.718 1.62-1.718.912 0 1.634.774 1.618 1.718-.015.945-.713 1.712-1.618 1.712z"/></svg>`,
  support: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor" stroke="none"><path d="M267.7 576.9C267.7 576.9 267.7 576.9 267.7 576.9L229.9 603.6C222.6 608.8 213 609.4 205 605.3C197 601.2 192 593 192 584L192 512L160 512C107 512 64 469 64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L359.6 512L267.7 576.9zM332 472.8C340.1 467.1 349.8 464 359.7 464L480 464C506.5 464 528 442.5 528 416L528 192C528 165.5 506.5 144 480 144L160 144C133.5 144 112 165.5 112 192L112 416C112 442.5 133.5 464 160 464L216 464C226.4 464 235.3 470.6 238.6 479.9C239.5 482.4 240 485.1 240 488L240 537.7C272.7 514.6 303.3 493 331.9 472.8z"/></svg>`
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
const sidebarToggleIcon = (collapsed) => collapsed
  ? '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M8 2.5 4 6l4 3.5"/></svg>'
  : '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2.5 8 6l-4 3.5"/></svg>';

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

    applyTheme();
    state.activeGroupId = state.menu.nav?.[0]?.id || null;

    createImageModal();
    buildTopbar();
    buildIconRail();
    buildSidebar();
    initSidebarToggle();

    renderPage(
      getPageContent('pages.firstSteps'),
      ['Dashboard', t('sidebar.introduction'), t('intro.firstSteps')]
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
// oldalsáv állapot beállítása
// ================================================================
function setSidebarHidden(hidden) {
  const shell = document.querySelector('.sidebar-shell');
  const appShell = document.querySelector('.app-shell');
  const btn = document.getElementById('sidebarToggle');
  const collapsedBtn = document.getElementById('sidebarToggleCollapsed');

  if (!shell || !btn || !collapsedBtn || !appShell) return;

  shell.classList.toggle('submenus-hidden', hidden);
  appShell.classList.toggle('sidebar-collapsed', hidden);
  btn.innerHTML = sidebarToggleIcon(true);
  collapsedBtn.innerHTML = sidebarToggleIcon(false);

  localStorage.setItem('submenusHidden', hidden ? '1' : '0');
}

// ================================================================
// mobil nézetben oldalsáv automatikus elrejtése kiválasztás után
// ================================================================
function hideSidebarAfterSelectionOnMobile() {
  if (window.innerWidth <= 1100) {
    setSidebarHidden(true);
  }
}

// ================================================================
// oldalsáv nyitás / zárás
// ================================================================
function initSidebarToggle() {
  const btn = document.getElementById('sidebarToggle');
  const collapsedBtn = document.getElementById('sidebarToggleCollapsed');

  if (!btn || !collapsedBtn) return;

  const hidden = localStorage.getItem('submenusHidden') === '1';
  setSidebarHidden(hidden);

  btn.onclick = () => setSidebarHidden(true);
  collapsedBtn.onclick = () => setSidebarHidden(false);
}

// ================================================================
// felső sáv felépítése
// ================================================================
function buildTopbar() {
  document.getElementById('discordIcon').innerHTML = icons.discord;
  document.getElementById('supportIcon').innerHTML = `<img class="support-avatar-icon" src="images/brian-the-barbarian.png" alt="Brian the Barbarian"/>`;
  document.getElementById('discordAddBtn').href = state.menu.settings.discord.addBotUrl;

  initDiscordSupportWidget();

  document.querySelectorAll('[data-i18n]').forEach(n => {
    n.textContent = t(n.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(n => {
    n.setAttribute('aria-label', t(n.dataset.i18nAriaLabel));
  });

  const picker = document.getElementById('languagePicker');
  const current = document.getElementById('languageCurrent');
  const menu = document.getElementById('languageMenu');
  const activeLang = state.menu.languages.find(l => l.code === state.lang) || state.menu.languages[0];

  current.innerHTML = `<span class="btn-icon">${svgFlag(activeLang.country)}</span><span>${activeLang.name}</span><span class="lang-arrow">${chevronIcon()}</span>`;
  menu.innerHTML = '';

  state.menu.languages.forEach(l => {
    const b = el('button', 'language-item', `<span class="btn-icon">${svgFlag(l.country)}</span> ${l.name}`);
    b.onclick = () => {
      state.lang = l.code;
      localStorage.setItem('lang', state.lang);
      picker.classList.remove('open');
      buildTopbar();
      buildIconRail();
      buildSidebar();
    };
    menu.appendChild(b);
  });

  current.onclick = (e) => {
    e.stopPropagation();
    picker.classList.toggle('open');
  };

  document.onclick = (e) => {
    if (!picker.contains(e.target)) {
      picker.classList.remove('open');
    }
  };

  syncImageModalTexts();
}

// ================================================================
// discord támogatói widget inicializálása
// ================================================================
async function initDiscordSupportWidget() {
  const guildId = '891626562871525398';
  const btn = document.getElementById('supportBtn');
  const supportName = document.getElementById('supportBtnName');
  const supportStatus = document.getElementById('supportBtnStatus');
  const panel = document.getElementById('discordWidgetPanel');
  const name = document.getElementById('discordWidgetName');
  const status = document.getElementById('discordWidgetStatus');
  const frame = document.getElementById('discordWidgetFrame');
  const loading = document.getElementById('discordWidgetLoading');

  if (!btn || !supportName || !supportStatus || !panel || !name || !status || !frame || !loading) return;

  btn.onclick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));

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
  };

  panel.onclick = (e) => e.stopPropagation();

  if (!state.discordWidgetOutsideBound) {
    document.addEventListener('click', (e) => {
      if (!panel.classList.contains('open')) return;
      if (btn.contains(e.target) || panel.contains(e.target)) return;

      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });

    state.discordWidgetOutsideBound = true;
  }

  try {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
    if (!res.ok) throw new Error('widget');

    const data = await res.json();
    const serverName = data.name || t('support.serverName');
    const online = data.presence_count ?? 0;

    supportName.textContent = serverName;
    supportStatus.textContent = tp('support.onlineCount', { count: online });
    name.textContent = serverName;
    status.textContent = tp('support.membersOnlineCount', { count: online });
  } catch {
    supportName.textContent = t('support.serverName');
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
// morzsa navigáció beállítása
// ================================================================
function setTopBreadcrumb(parts) {
  const n = document.getElementById('topBreadcrumb');
  if (n) n.textContent = '';
}

// ================================================================
// bal oldali ikon sáv felépítése
// ================================================================
function buildIconRail() {
  const rail = document.getElementById('iconRail');
  rail.innerHTML = '';

  state.menu.nav.forEach((group) => {
    const b = el('button', 'rail-item', icons[group.icon] || icons.intro);

    if (group.id === state.activeGroupId) {
      b.classList.add('active');
    }

    b.title = t(group.labelKey);
    b.onclick = () => {
      state.activeGroupId = group.id;
      buildIconRail();
      buildSidebar();
    };

    rail.appendChild(b);
  });
}

// ================================================================
// oldalsáv felépítése
// ================================================================
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  const group = state.menu.nav.find(g => g.id === state.activeGroupId) || state.menu.nav[0];
  if (!group) return;

  group.children.forEach(child => sidebar.appendChild(buildChild(child, group)));
}

// ================================================================
// oldalsáv elem felépítése
// ================================================================
function buildChild(child, group) {
  if (child.type === 'commandGroup') {
    const block = el('div');
    const main = el('button', 'sub-item sub-toggle', `<span>${t(child.labelKey)}</span><span class="toggle-icon">${chevronIcon()}</span>`);
    const list = el('div', 'command-list');

    list.style.display = 'none';

    main.onclick = () => {
      const opening = list.style.display === 'none';
      list.style.display = opening ? 'block' : 'none';
      main.classList.toggle('open', opening);
    };

    child.commands.forEach(cmd => {
      const b = el('button', 'cmd-option', cmd);
      b.onclick = () => {
        renderCommand(cmd, group.labelKey, child.labelKey);
        hideSidebarAfterSelectionOnMobile();
      };
      list.appendChild(b);
    });

    block.append(main, list);
    return block;
  }

  if (child.type === 'appearance') {
    const block = el('div');
    const main = el('button', 'sub-item sub-toggle', `<span>${t(child.labelKey)}</span><span class="toggle-icon">${chevronIcon()}</span>`);
    const list = el('div', 'command-list');

    list.style.display = 'none';

    main.onclick = () => {
      const opening = list.style.display === 'none';
      list.style.display = opening ? 'block' : 'none';
      main.classList.toggle('open', opening);
    };

    ['dark', 'light'].forEach(mode => {
      const b = el('button', 'cmd-option', t(`settings.${mode}`));
      b.onclick = () => {
        state.theme = mode;
        localStorage.setItem('theme', state.theme);
        applyTheme();
        hideSidebarAfterSelectionOnMobile();
      };
      list.appendChild(b);
    });

    block.append(main, list);
    return block;
  }

  if (child.type === 'language') {
    const block = el('div');
    const main = el('button', 'sub-item sub-toggle', `<span>${t(child.labelKey)}</span><span class="toggle-icon">${chevronIcon()}</span>`);
    const list = el('div', 'command-list');

    list.style.display = 'none';

    main.onclick = () => {
      const opening = list.style.display === 'none';
      list.style.display = opening ? 'block' : 'none';
      main.classList.toggle('open', opening);
    };

    state.menu.languages.forEach(l => {
      const b = el('button', 'cmd-option', `<span class="btn-icon">${svgFlag(l.country)}</span> ${l.name}`);
      b.onclick = () => {
        state.lang = l.code;
        localStorage.setItem('lang', state.lang);
        buildTopbar();
        buildIconRail();
        buildSidebar();
        hideSidebarAfterSelectionOnMobile();
      };
      list.appendChild(b);
    });

    block.append(main, list);
    return block;
  }

  const b = el('button', 'sub-item', t(child.labelKey));
  b.onclick = () => {
    if (child.type === 'page') {
      renderPage(
        getPageContent(child.contentKey),
        [t(group.labelKey), t(child.labelKey)]
      );
      hideSidebarAfterSelectionOnMobile();
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
// oldal szövegének formázása bekezdésekre bontva
// ================================================================
function formatPageText(text) {
  if (!text) return '';

  return String(text)
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)
    .map(paragraph => `<p class="page-intro">${paragraph}</p>`)
    .join('');
}

// ================================================================
// egyszerű tartalmi oldal renderelése
// ================================================================
function renderPage(page, crumb) {
  setTopBreadcrumb(crumb);

  const introHtml = formatPageText(page.text);
  const stepsHtml = Array.isArray(page.steps) && page.steps.length
    ? `
      <ol class="setup-steps">
        ${page.steps.map(step => `
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
  modal.className = 'image-modal';
  modal.innerHTML = `
    <div class="image-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="imageModalTitle">
      <div class="image-modal-header">
        <strong id="imageModalTitle"></strong>
        <button id="imageModalClose" class="image-modal-close" type="button" aria-label="Bezárás">×</button>
      </div>
      <div class="image-modal-body">
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeImageModal();
    }
  });

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
  document.body.classList.add('modal-open');

  image.style.display = 'none';
  image.removeAttribute('src');
  image.alt = altText;
  message.textContent = '';

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
  document.body.classList.remove('modal-open');
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
// ha az options mező létezik, akkor azt használjuk akkor is,
// ha üres tömb; alapértelmezett opció csak akkor kell,
// ha az options mező nincs megadva
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
// csak azokhoz az elemekhez használjuk, amelyek nem legördülőként jelennek meg
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
// több elem esetén legördülő marad eredeti szöveggel
// egy elem esetén fordítjuk, ha van hozzá kulcs
// ================================================================
function formatCommandValuesCell(option) {
  const values = Array.isArray(option?.values)
    ? option.values
    : (option?.value !== undefined && option?.value !== null && option?.value !== '' ? [option.value] : []);

  if (values.length > 1) {
    return `<select>${values.map(v => `<option>${v}</option>`).join('')}</select>`;
  }

  if (values.length === 1) {
    return translateSingleCommandValue(values[0]);
  }

  return '-';
}

// ================================================================
// parancs ismertető renderelése fordításokkal
// ================================================================
function renderCommand(cmd, groupKey, subKey) {
  const imageName = cmd.replace(/^\//, '').replace(/\s+/g, '-');
  const imagePath = `images/${imageName}.png`;
  const { docsConfig, doc, parentDoc, rootCommand, subcommand } = getResolvedCommandDoc(cmd);

  const commandOptions = getCommandOptions(doc, parentDoc, docsConfig);
  const description = getTranslatedCommandDescription(cmd, rootCommand, subcommand, doc, parentDoc, docsConfig);
  const access = getTranslatedCommandAccess(rootCommand, subcommand, doc, parentDoc, docsConfig);

  const options = commandOptions.map(option => `
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

  document.getElementById('content').innerHTML = `<div class="card">
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
  </div>`;

  const imageButton = document.getElementById('commandImageButton');
  if (imageButton) {
    imageButton.onclick = () => openImageModal(imagePath, `${cmd} demo`);
  }
}

// ================================================================
// megjelenés oldal renderelése
// ================================================================
function renderAppearance() {
  setTopBreadcrumb(['Dashboard', t('sidebar.settings'), t('settings.appearance')]);
  document.getElementById('content').innerHTML = `<div class="card"><h1>${t('settings.appearance')}</h1><div class="list-grid">${['dark', 'light'].map(k => `<button class="sub-item" data-theme="${k}">${t('settings.' + k)}</button>`).join('')}</div></div>`;
  document.querySelectorAll('[data-theme]').forEach(b => {
    b.onclick = () => {
      state.theme = b.dataset.theme;
      localStorage.setItem('theme', state.theme);
      applyTheme();
    };
  });
}

// ================================================================
// nyelv oldal renderelése
// ================================================================
function renderLanguageSettings() {
  setTopBreadcrumb(['Dashboard', t('sidebar.settings'), t('settings.language')]);
  document.getElementById('content').innerHTML = `<div class="card"><h1>${t('settings.language')}</h1><div class="list-grid">${state.menu.languages.map(l => `<button class="sub-item" data-lang="${l.code}"><span class="btn-icon">${svgFlag(l.country)}</span> ${l.name}</button>`).join('')}</div></div>`;
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.onclick = () => {
      state.lang = b.dataset.lang;
      localStorage.setItem('lang', state.lang);
      buildTopbar();
      buildIconRail();
      buildSidebar();
      renderLanguageSettings();
    };
  });
}

// ================================================================
// budapesti dátum lekérése YYYY-MM-DD formátumban
// ================================================================
function getBudapestDateString() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Budapest',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
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
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  const second = parts.find(p => p.type === 'second')?.value;

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

  // ================================================================
  // állítsd be a saját GitHub repo adataidra
  // ================================================================
  const owner = 'oreg-kh';
  const repo = 'website';
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

    const todayEl = document.getElementById('visitorToday');
    const totalEl = document.getElementById('visitorTotal');

    if (todayEl) {
      todayEl.textContent = data.today || '0';
    }

    if (totalEl) {
      totalEl.textContent = data.total || '0';
    }
  } catch (error) {
    console.error('Látogatói statisztika hiba:', error);
  }
}

init();
