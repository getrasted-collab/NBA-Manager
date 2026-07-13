const menuSection = { id: "menu", label: "Main Menu", pages: [["start", "Main Menu"], ["saves", "Save Slots"]] };
const DARK_MODE_STORAGE_KEY = "nba-manager-dark-mode";

let darkModeEnabled = false;
try {
  darkModeEnabled = localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true";
} catch {
  darkModeEnabled = false;
}

const navSections = [
  { id: "season", label: "Season", pages: [["play", "Games"], ["standings", "Standings"], ["postseason", "Postseason"], ["offseason", "Offseason"]] },
  { id: "team", label: "Team", pages: [["inventory", "Roster"], ["rotation", "Rotation"], ["strategy", "Gameplan"], ["development", "Player Development"], ["locker", "Locker Room"], ["upgrade", "Cap Sheet"], ["quests", "Season Goals"]] },
  { id: "front-office", label: "Front Office", pages: [["dashboard", "Command Center"], ["staff", "Staff"], ["finances", "Finances"], ["trade", "Trade Machine"], ["transactions", "Transactions"], ["scouting", "Scouting"]] },
  { id: "league", label: "League", pages: [["stats", "Stats"], ["awards", "Season Awards"], ["history", "League History"]] },
  { id: "tools", label: "Tools", pages: [["god mode", "League Editor"], ["settings", "Settings"]] }
];

const navItems = [menuSection, ...navSections].flatMap((section) => section.pages.map(([id, label]) => [id, label, section.id]));

const nbaTeams = [
  ["atl", "Atlanta", "Hawks", "ATL", "East", 151, "switch", "perimeter", 62],
  ["bos", "Boston", "Celtics", "BOS", "East", 184, "switch", "perimeter", 64],
  ["bkn", "Brooklyn", "Nets", "BKN", "East", 147, "switch", "balanced", 60],
  ["cha", "Charlotte", "Hornets", "CHA", "East", 132, "drop", "paint", 59],
  ["chi", "Chicago", "Bulls", "CHI", "East", 156, "drop", "balanced", 58],
  ["cle", "Cleveland", "Cavaliers", "CLE", "East", 166, "drop", "paint", 57],
  ["dal", "Dallas", "Mavericks", "DAL", "West", 171, "switch", "stars", 61],
  ["den", "Denver", "Nuggets", "DEN", "West", 174, "drop", "balanced", 55],
  ["det", "Detroit", "Pistons", "DET", "East", 126, "pressure", "balanced", 63],
  ["gsw", "Golden State", "Warriors", "GSW", "West", 188, "switch", "perimeter", 66],
  ["hou", "Houston", "Rockets", "HOU", "West", 144, "switch", "balanced", 64],
  ["ind", "Indiana", "Pacers", "IND", "East", 149, "pressure", "perimeter", 68],
  ["lac", "LA", "Clippers", "LAC", "West", 181, "switch", "stars", 57],
  ["lal", "Los Angeles", "Lakers", "LAL", "West", 183, "drop", "paint", 58],
  ["mem", "Memphis", "Grizzlies", "MEM", "West", 154, "pressure", "paint", 62],
  ["mia", "Miami", "Heat", "MIA", "East", 176, "zone", "stars", 56],
  ["mil", "Milwaukee", "Bucks", "MIL", "East", 186, "drop", "paint", 59],
  ["min", "Minnesota", "Timberwolves", "MIN", "West", 178, "drop", "paint", 56],
  ["nop", "New Orleans", "Pelicans", "NOP", "West", 152, "switch", "balanced", 60],
  ["nyk", "New York", "Knicks", "NYK", "East", 169, "pressure", "stars", 55],
  ["okc", "Oklahoma City", "Thunder", "OKC", "West", 137, "switch", "perimeter", 67],
  ["orl", "Orlando", "Magic", "ORL", "East", 133, "switch", "paint", 58],
  ["phi", "Philadelphia", "76ers", "PHI", "East", 177, "drop", "stars", 57],
  ["phx", "Phoenix", "Suns", "PHX", "West", 187, "switch", "stars", 59],
  ["por", "Portland", "Trail Blazers", "POR", "West", 131, "drop", "balanced", 61],
  ["sac", "Sacramento", "Kings", "SAC", "West", 153, "drop", "perimeter", 65],
  ["sas", "San Antonio", "Spurs", "SAS", "West", 129, "drop", "paint", 60],
  ["tor", "Toronto", "Raptors", "TOR", "East", 145, "switch", "balanced", 61],
  ["uta", "Utah", "Jazz", "UTA", "West", 136, "drop", "balanced", 58],
  ["was", "Washington", "Wizards", "WAS", "East", 124, "pressure", "perimeter", 63]
];

// Internal team keys remain stable for saves; NBA numeric IDs are used only for media/data links.
const nbaTeamIdsBySlug = {
  atl: 1610612737, bos: 1610612738, cle: 1610612739, nop: 1610612740, chi: 1610612741,
  dal: 1610612742, den: 1610612743, gsw: 1610612744, hou: 1610612745, lac: 1610612746,
  lal: 1610612747, mia: 1610612748, mil: 1610612749, min: 1610612750, bkn: 1610612751,
  nyk: 1610612752, orl: 1610612753, ind: 1610612754, phi: 1610612755, phx: 1610612756,
  por: 1610612757, sac: 1610612758, sas: 1610612759, okc: 1610612760, tor: 1610612761,
  uta: 1610612762, mem: 1610612763, was: 1610612764, det: 1610612765, cha: 1610612766
};

const DEFAULT_PLAYER_HEADSHOT = "assets/players/default-headshot.png";
const DEFAULT_TEAM_LOGO = "assets/teams/default-logo.png";

const teamThemes = {
  atl: { primary: "#E03A3E", secondary: "#C1D32F", accent: "#FFF4F4", contrast: "#FFFFFF" },
  bos: { primary: "#007A33", secondary: "#BA9653", accent: "#F2FBF6", contrast: "#FFFFFF" },
  bkn: { primary: "#111827", secondary: "#9CA3AF", accent: "#F5F7FA", contrast: "#FFFFFF" },
  cha: { primary: "#1D1160", secondary: "#00788C", accent: "#F2F7FF", contrast: "#FFFFFF" },
  chi: { primary: "#CE1141", secondary: "#111827", accent: "#FFF3F6", contrast: "#FFFFFF" },
  cle: { primary: "#860038", secondary: "#FDBB30", accent: "#FFF5F9", contrast: "#FFFFFF" },
  dal: { primary: "#00538C", secondary: "#002B5E", accent: "#F1F8FF", contrast: "#FFFFFF" },
  den: { primary: "#0E2240", secondary: "#FEC524", accent: "#F3F7FB", contrast: "#FFFFFF" },
  det: { primary: "#C8102E", secondary: "#1D42BA", accent: "#FFF4F5", contrast: "#FFFFFF" },
  gsw: { primary: "#1D428A", secondary: "#FFC72C", accent: "#F2F6FF", contrast: "#FFFFFF" },
  hou: { primary: "#CE1141", secondary: "#111827", accent: "#FFF3F6", contrast: "#FFFFFF" },
  ind: { primary: "#002D62", secondary: "#FDBB30", accent: "#F1F7FF", contrast: "#FFFFFF" },
  lac: { primary: "#C8102E", secondary: "#1D428A", accent: "#FFF4F5", contrast: "#FFFFFF" },
  lal: { primary: "#552583", secondary: "#FDB927", accent: "#F8F2FF", contrast: "#FFFFFF" },
  mem: { primary: "#5D76A9", secondary: "#12173F", accent: "#F3F6FC", contrast: "#FFFFFF" },
  mia: { primary: "#98002E", secondary: "#F9A01B", accent: "#FFF3F7", contrast: "#FFFFFF" },
  mil: { primary: "#00471B", secondary: "#EEE1C6", accent: "#F2FBF6", contrast: "#FFFFFF" },
  min: { primary: "#0C2340", secondary: "#78BE20", accent: "#F3F8FD", contrast: "#FFFFFF" },
  nop: { primary: "#0C2340", secondary: "#C8102E", accent: "#F3F8FD", contrast: "#FFFFFF" },
  nyk: { primary: "#006BB6", secondary: "#F58426", accent: "#F1F8FF", contrast: "#FFFFFF" },
  okc: { primary: "#007AC1", secondary: "#EF3B24", accent: "#F1F9FF", contrast: "#FFFFFF" },
  orl: { primary: "#0077C0", secondary: "#C4CED4", accent: "#F1F9FF", contrast: "#FFFFFF" },
  phi: { primary: "#006BB6", secondary: "#ED174C", accent: "#F1F8FF", contrast: "#FFFFFF" },
  phx: { primary: "#1D1160", secondary: "#E56020", accent: "#F8F2FF", contrast: "#FFFFFF" },
  por: { primary: "#E03A3E", secondary: "#111827", accent: "#FFF4F4", contrast: "#FFFFFF" },
  sac: { primary: "#5A2D81", secondary: "#63727A", accent: "#F8F2FF", contrast: "#FFFFFF" },
  sas: { primary: "#111827", secondary: "#C4CED4", accent: "#F5F7FA", contrast: "#FFFFFF" },
  tor: { primary: "#CE1141", secondary: "#111827", accent: "#FFF3F6", contrast: "#FFFFFF" },
  uta: { primary: "#002B5C", secondary: "#F9A01B", accent: "#F1F7FF", contrast: "#FFFFFF" },
  was: { primary: "#002B5C", secondary: "#E31837", accent: "#F1F7FF", contrast: "#FFFFFF" }
};

const defaultSave = {
  mode: "Default",
  season: 2026,
  phase: "Regular Season",
  activeTeamId: "bos",
  xp: 0,
  careerScore: 0,
  teams: createLeagueTeams(),
  players: ensurePlayerContracts(initializeLeagueRotations(createLeaguePlayers()), 2026),
  schedule: createSeasonSchedule("bos", 2026),
  seasonEvents: createSeasonEvents(2026),
  transactionEvents: createTransactionCalendar(2026),
  postseason: null,
  offseason: null,
  offseasonVersion: 1,
  teamStrategies: createTeamStrategies(),
  coaching: createCoachingProfiles(),
  leagueHistory: [],
  transactionLog: [],
  retiredPlayers: [],
  gmCareer: { approval: 60, seasons: 0, titles: 0, playoffTrips: 0, jobOffers: [], finances: { attendance: 82, revenue: 310, staffBudget: 18, taxTolerance: "moderate" }, goals: ["Reach the playoffs", "Maintain roster flexibility"] },
  gameplayVersion: 1,
  simulationVersion: 2,
  gamePlans: createGamePlans(),
  gamePlanPresets: {},
  lockerRooms: createLockerRooms(),
  scoutingDepartments: createScoutingDepartments(),
  scoutingKnowledge: {},
  staffMarket: createStaffMarket(2026),
  aiTransactions: { lastProcessedDate: null, tradeBlock: [], rumors: [], userOffers: [] },
  leagueRules: createLeagueRules(2026),
  leagueEvolution: [],
  watchlist: [],
  notifications: [],
  social: createSocialState(),
  automation: createAutomationSettings(),
  saveDiagnostics: { version: 1, lastAutosave: null },
  ratingsVersion: 1,
  freeAgentPoolVersion: 1,
  contractVersion: 4,
  draftPicks: createDraftPicks(2026),
  results: [],
  messages: ["Career created. Configure game link in Settings when ready."]
};

let save = structuredClone(defaultSave);
let storedSave = null;
let saveSlots = [];
let active = "start";
let pendingMode = null;
let editorTeamFilter = null;
let editorSearch = "";
let editorSelectedPlayerId = null;
let calendarMonth = null;
let selectedGameId = null;
let selectedEventId = null;
let selectedTransactionId = null;
let contractFilter = "all";
let tradePartnerId = "bos";
let tradeOutgoingIds = [];
let tradeIncomingIds = [];
let tradeConsent = false;
let tradeOutgoingPickIds = [];
let tradeIncomingPickIds = [];
let multiTradeTeamIds = [];
let multiTradePlayerIds = [];
let multiTradePickIds = [];
let multiTradeRoutes = {};
let multiTradeTeamPickerOpen = false;
let globalSearch = "";
let transactionFilter = "all";
let comparisonPlayerIds = [];
let selectedPlayerCardId = null;
let rosterTeamId = null;
let lastRenderedPage = null;
let simcastState = null;
let simcastTimer = null;
let inSeasonFaSearch = "";
let inSeasonFaPosition = "all";
let inSeasonFaSort = "overall";
let inSeasonFaSortDirection = "desc";
let standingsView = "standings";
let standingsScope = "conference";
let socialActiveTab = "for-you";
let selectedSocialConversationId = null;
let socialMessagesDrawerOpen = false;
let selectedSocialPostId = null;
let socialVisiblePostCache = new Map();
let selectedSocialAccountId = null;
let socialFeedRefreshKey = 0;
let socialNotificationFilter = "all";
let socialCreatePostOpen = false;

function closeSocialMessagesDrawer(afterClose = null) {
  const drawer = document.querySelector(".social-message-drawer");
  if (!drawer || !socialMessagesDrawerOpen) {
    socialMessagesDrawerOpen = false;
    if (afterClose) afterClose();
    else render();
    return;
  }
  drawer.classList.add("closing");
  window.setTimeout(() => {
    socialMessagesDrawerOpen = false;
    if (afterClose) afterClose();
    else render();
  }, 250);
}

function team(id, city, name, abbr, conf, wins, losses, payroll, roster, defense, matchup, pace) {
  return { id, teamId: nbaTeamIdsBySlug[id] || null, city, name, abbr, conf, wins, losses, payroll, roster, defense, matchup, pace };
}

function player(id, name, age, pos, height, archetype, teamId, ovr, pot, three, mid, rim, pass, def, stamina, minutes = 0, portrait = "", playerId = null) {
  return { id, playerId, name, age, pos, height, archetype, teamId, nbaTeamId: nbaTeamIdsBySlug[teamId] || null, ovr, overall: ovr, pot, three, mid, rim, pass, def, stamina, minutes, portrait, morale: 80, injury: 0 };
}

function playerHeadshotUrl(playerRecord) {
  const nbaPlayerId = playerRecord?.playerId || playerRecord?.nbaPlayerId;
  return nbaPlayerId ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${encodeURIComponent(nbaPlayerId)}.png` : DEFAULT_PLAYER_HEADSHOT;
}

function teamLogoUrl(teamRecordOrId) {
  const teamRecord = typeof teamRecordOrId === "string" ? getTeam(teamRecordOrId) : teamRecordOrId;
  const nbaTeamId = teamRecord?.teamId || teamRecord?.nbaTeamId || nbaTeamIdsBySlug[teamRecord?.id || teamRecordOrId];
  return nbaTeamId ? `https://cdn.nba.com/logos/nba/${encodeURIComponent(nbaTeamId)}/primary/L/logo.svg` : DEFAULT_TEAM_LOGO;
}

function playerHeadshot(playerRecord, className = "player-headshot") {
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(playerHeadshotUrl(playerRecord))}" alt="${escapeHtml(playerRecord?.name || "Player")} headshot" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_PLAYER_HEADSHOT}'">`;
}

function teamLogo(teamRecordOrId, className = "team-logo") {
  const teamRecord = typeof teamRecordOrId === "string" ? getTeam(teamRecordOrId) : teamRecordOrId;
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(teamLogoUrl(teamRecordOrId))}" alt="${escapeHtml(teamRecord ? `${teamRecord.city} ${teamRecord.name}` : "Team")} logo" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_TEAM_LOGO}'">`;
}

function localAssetUrl(fileName) {
  const pathname = String(window.location?.pathname || "").replace(/\\/g, "/");
  const prefix = pathname.includes("/ui/") ? "../assets/" : "./assets/";
  return `${prefix}${fileName}`;
}

async function boot() {
  installThemeToggle();
  applyThemeMode();
  try {
    await waitForStartupData();
    await refreshSlots();
    if (saveSlots.length) {
      const stored = await window.nbaManager?.loadSaveSlot(saveSlots[0].id);
      if (stored) {
        storedSave = normalizeSave(stored);
        save = normalizeSave(stored);
      }
    }
    const standingsChanged = ensureLeagueStandingsState();
    const boxScoresChanged = ensurePlayerBoxScores();
    const seasonFeaturesChanged = ensureSeasonFeatures();
    const contractsChanged = ensureContractSystem();
    const careerChanged = ensureCareerSystems();
    if ((standingsChanged || boxScoresChanged || seasonFeaturesChanged || contractsChanged || careerChanged) && saveSlots.length) await persist();
  } catch (error) {
    console.error("[NBA Manager startup] Startup hydration failed; using a fresh local career shell.", error);
    save.messages.push(`Startup recovered: ${error?.message || error}`);
  }
  render();
}

async function waitForStartupData() {
  if (!window.gameData?.ready) return;
  const timeout = new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), 1800));
  const result = await Promise.race([window.gameData.ready, timeout]);
  if (result?.timedOut) console.warn("[NBA Manager startup] Data import is still loading; rendering with bundled fallback data.");
}

function render() {
  const pageChanged = lastRenderedPage !== active;
  if (active === "inventory" && lastRenderedPage !== "inventory") rosterTeamId = save.activeTeamId;
  applyTeamTheme();
  applyThemeMode();
  document.body.classList.toggle("start-mode", active === "start" || active === "team-select" || active === "saves");
  document.body.classList.toggle("dashboard-mode", active !== "start" && active !== "team-select" && active !== "saves");
  document.body.classList.toggle("game-ui-upgrade", active !== "start" && active !== "team-select" && active !== "saves");
  document.body.classList.toggle("locker-room-layout", active === "locker");
  document.body.classList.toggle("player-development-layout", active === "development");
  document.body.classList.toggle("staff-layout", active === "staff");
  document.body.classList.toggle("gameplan-layout", active === "strategy");
  document.body.classList.toggle("scouting-layout", active === "scouting");
  document.body.classList.toggle("finance-layout", active === "finances");
  document.body.classList.toggle("standings-layout", active === "standings");
  document.body.classList.toggle("standings-conference-layout", active === "standings" && standingsView === "standings" && standingsScope === "conference");
  document.body.classList.toggle("standings-fit-layout", active === "standings" && (standingsView === "wildcard" || standingsView === "cup" || (standingsView === "standings" && (standingsScope === "conference" || standingsScope === "division"))));
  document.body.classList.toggle("standings-division-layout", active === "standings" && standingsView === "standings" && standingsScope === "division");
  document.body.classList.toggle("standings-wildcard-layout", active === "standings" && standingsView === "wildcard");
  document.body.classList.toggle("standings-cup-layout", active === "standings" && standingsView === "cup");
  document.body.classList.toggle("social-layout-page", active === "social");
  document.body.classList.toggle("league-stats-layout", active === "stats");
  document.body.classList.toggle("awards-layout", active === "awards");
  document.body.classList.toggle("league-history-layout", active === "history");
  renderProfile();
  renderNav();
  renderPageContext();

  const page = document.querySelector("#page");
  const secondaryCareerPage = !["start", "team-select", "saves", "dashboard"].includes(active) && !simcastState;
  page.classList.toggle("secondary-page", secondaryCareerPage);
  page.dataset.page = active;
  if (active === "start") page.innerHTML = startMenu();
  if (active === "team-select") page.innerHTML = teamSelectMenu();
  if (active === "saves") page.innerHTML = savesMenu();
  if (active === "dashboard") page.innerHTML = dashboardReferencePage();
  if (active === "play") page.innerHTML = play();
  if (active === "strategy") page.innerHTML = strategyPage();
  if (active === "rotation") page.innerHTML = rotationPage();
  if (active === "locker") page.innerHTML = lockerRoomPage();
  if (active === "development") page.innerHTML = playerDevelopmentPage();
  if (active === "scouting") page.innerHTML = scoutingOfficePage();
  if (active === "staff") page.innerHTML = staffPage();
  if (active === "finances") page.innerHTML = financesPage();
  if (active === "transactions") page.innerHTML = transactionCenterPage();
  if (active === "standings") page.innerHTML = standingsPage();
  if (active === "postseason") page.innerHTML = postseasonPage();
  if (active === "offseason") page.innerHTML = offseasonPage();
  if (active === "stats") page.innerHTML = statsPage();
  if (active === "awards") page.innerHTML = awardsPage();
  if (active === "history") page.innerHTML = historyPage();
  if (active === "social") page.innerHTML = socialPage();
  if (active === "quests") page.innerHTML = quests();
  if (active === "upgrade") page.innerHTML = cap();
  if (active === "trade") page.innerHTML = tradeMachine();
  if (active === "inventory") page.innerHTML = roster();
  if (active === "god mode") page.innerHTML = importView();
  if (active === "settings") page.innerHTML = settings();
  page.innerHTML += playerDetailModal();
  lockPinnedDarkButtonStyles();
  lockPinnedDarkFormStyles();
  lockVerticalSliceControlStyles();
  lockTradeControlStyles();
  attachActions();
  if (pageChanged) {
    const workspace = document.querySelector(".workspace");
    if (workspace) workspace.scrollTop = 0;
    page.scrollTop = 0;
  }
  installCustomScrollbars();
  lastRenderedPage = active;
}

const customScrollbarState = new Map();

function installCustomScrollbars() {
  const usesNativeWorkspaceScroll = document.body.classList.contains("social-layout-page")
    || document.body.classList.contains("league-stats-layout")
    || document.body.classList.contains("awards-layout")
    || document.body.classList.contains("scouting-layout")
    || document.body.classList.contains("finance-layout")
    || document.body.classList.contains("league-history-layout");
  const targets = usesNativeWorkspaceScroll
    ? []
    : [["workspace", document.querySelector(".workspace")]];
  document.querySelector(".context-nav")?.classList.remove("custom-scrollbar-native");
  targets.forEach(([key, target]) => {
    if (!target) return;
    target.classList.add("custom-scrollbar-native");
    const existing = customScrollbarState.get(key);
    if (existing?.target !== target) {
      existing?.shell?.remove();
      customScrollbarState.delete(key);
    }
    if (!customScrollbarState.has(key)) customScrollbarState.set(key, createCustomScrollbar(key, target));
    updateCustomScrollbar(customScrollbarState.get(key));
  });
  customScrollbarState.forEach((state, key) => {
    if (!targets.some(([targetKey, target]) => targetKey === key && target === state.target)) {
      state.shell.remove();
      customScrollbarState.delete(key);
    }
  });
}

function createCustomScrollbar(key, target) {
  const shell = document.createElement("div");
  shell.className = `custom-scrollbar-shell custom-scrollbar-shell--${key}`;
  shell.innerHTML = `
    <button class="custom-scrollbar-arrow-top" type="button" aria-label="Scroll up"></button>
    <div class="custom-scrollbar-track"><div class="custom-scrollbar-thumb"></div></div>
    <button class="custom-scrollbar-arrow-bottom" type="button" aria-label="Scroll down"></button>
  `;
  document.body.appendChild(shell);
  const state = {
    key,
    target,
    shell,
    track: shell.querySelector(".custom-scrollbar-track"),
    thumb: shell.querySelector(".custom-scrollbar-thumb"),
    raf: 0
  };
  const schedule = () => {
    if (state.raf) return;
    state.raf = requestAnimationFrame(() => {
      state.raf = 0;
      updateCustomScrollbar(state);
    });
  };
  target.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  shell.querySelector(".custom-scrollbar-arrow-top")?.addEventListener("click", () => target.scrollBy({ top: -Math.max(80, target.clientHeight * .55), behavior: "smooth" }));
  shell.querySelector(".custom-scrollbar-arrow-bottom")?.addEventListener("click", () => target.scrollBy({ top: Math.max(80, target.clientHeight * .55), behavior: "smooth" }));
  state.track?.addEventListener("click", (event) => {
    if (event.target === state.thumb) return;
    const rect = state.track.getBoundingClientRect();
    const direction = event.clientY < state.thumb.getBoundingClientRect().top ? -1 : 1;
    target.scrollBy({ top: direction * Math.max(90, rect.height * .85), behavior: "smooth" });
  });
  return state;
}

function updateCustomScrollbar(state) {
  if (!state?.target?.isConnected) return;
  const { target, shell, track, thumb } = state;
  const overflow = target.scrollHeight > target.clientHeight + 2;
  const rect = target.getBoundingClientRect();
  const visible = overflow && rect.width > 0 && rect.height > 54 && document.body.classList.contains("dashboard-mode");
  shell.hidden = !visible;
  if (!visible) return;
  const width = 18;
  const gutterLeft = rect.right + 6;
  const viewportLeft = window.innerWidth - width - 6;
  const inset = 2;
  const verticalInset = state.key === "workspace" ? 6 : 4;
  const left = state.key === "workspace" ? Math.min(gutterLeft, viewportLeft) : rect.right - width - inset;
  shell.style.left = `${Math.round(left)}px`;
  shell.style.top = `${Math.round(rect.top + verticalInset)}px`;
  shell.style.height = `${Math.max(76, Math.round(rect.height - verticalInset * 2))}px`;
  shell.style.width = `${width}px`;
  const trackHeight = track.clientHeight;
  const ratio = target.clientHeight / target.scrollHeight;
  const thumbHeight = Math.max(48, Math.round(trackHeight * ratio));
  const maxScroll = Math.max(1, target.scrollHeight - target.clientHeight);
  const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
  const thumbTop = Math.round((target.scrollTop / maxScroll) * maxThumbTop);
  thumb.style.height = `${thumbHeight}px`;
  thumb.style.transform = `translate(-50%, ${thumbTop}px)`;
}

function renderNav() {
  renderTopNav();
  renderContextNav();
  renderCareerMenuButton();
  renderSidebarNextGame();
}

function renderTopNav() {
  const topNav = document.querySelector("#top-nav");
  if (!topNav) return;
  const current = currentNavSection();
  topNav.innerHTML = navSections
    .map((section) => {
      const badge = section.pages.reduce((total, [id]) => total + navBadgeFor(id), 0);
      return `<button class="${current.id === section.id ? "active" : ""}" data-top-nav="${section.id}">${section.label}${badge ? `<b class="nav-badge">${badge}</b>` : ""}</button>`;
    })
    .join("");

  document.querySelectorAll("[data-top-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = navSections.find((candidate) => candidate.id === button.dataset.topNav);
      active = section?.pages?.[0]?.[0] || "dashboard";
      render();
    });
  });
}

function renderCareerMenuButton() {
  const button = document.querySelector("#career-menu-button");
  if (!button) return;
  button.textContent = active === "start" || active === "team-select" || active === "saves" ? "Main Menu" : "Career Menu";
  button.onclick = navigateToMainMenu;
}

function installThemeToggle() {
  const button = document.querySelector("#theme-toggle-button");
  if (!button || button.dataset.ready === "true") return;
  button.dataset.ready = "true";
  button.addEventListener("click", () => {
    darkModeEnabled = !darkModeEnabled;
    try {
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkModeEnabled));
    } catch {
      // Ignore storage failures; the toggle still works for the current session.
    }
    applyThemeMode();
  });
}

function applyThemeMode() {
  document.body.classList.toggle("dark-mode", darkModeEnabled);
  document.documentElement.classList.toggle("dark-mode", darkModeEnabled);
  lockPinnedDarkButtonStyles();
  lockPinnedDarkFormStyles();
  const button = document.querySelector("#theme-toggle-button");
  if (!button) return;
  button.classList.toggle("active", darkModeEnabled);
  button.setAttribute("aria-pressed", String(darkModeEnabled));
  button.title = darkModeEnabled ? "Switch to light mode" : "Switch to dark mode";
}

function lockPinnedDarkButtonStyles() {
  const darkMode = document.body.classList.contains("dark-mode");
  const rotationButtons = [...document.querySelectorAll(".rotation-footer button:not([data-action='rotation-save'])")];
  const rotationSaveButtons = [...document.querySelectorAll(".rotation-footer button[data-action='rotation-save']")];
  const standingsButtons = [...document.querySelectorAll(".standings-tabs button, .standings-view-toggle button")];
  const freeAgencyButtons = [
    ...document.querySelectorAll("[data-in-season-waive]"),
    ...document.querySelectorAll("[data-action='filter-in-season-fa']"),
    ...document.querySelectorAll(".in-season-fa-actions .btn"),
    ...document.querySelectorAll(".in-season-fa-stat-filter button")
  ];
  const lockerButtons = [
    ...document.querySelectorAll(".locker-room-page .btn"),
    ...document.querySelectorAll(".locker-room-page .mini-action"),
    ...document.querySelectorAll(".locker-menu-button")
  ];
  const developmentButtons = [
    ...document.querySelectorAll(".player-dev-page .btn"),
    ...document.querySelectorAll(".player-dev-page .mini-action")
  ];
  const staffButtons = [
    ...document.querySelectorAll(".staff-page .btn"),
    ...document.querySelectorAll(".staff-page .mini-action"),
    ...document.querySelectorAll(".staff-list-panel .mini-action"),
    ...document.querySelectorAll(".staff-openings-panel .mini-action"),
    ...document.querySelectorAll(".staff-hire-button")
  ];
  const scoutingButtons = [
    ...document.querySelectorAll(".scouting-page .btn"),
    ...document.querySelectorAll(".scouting-page .mini-action"),
    ...document.querySelectorAll(".scouting-page button")
  ];
  const awardsButtons = [
    ...document.querySelectorAll(".awards-dashboard button")
  ];
  const socialButtons = [
    ...document.querySelectorAll(".social-page .btn"),
    ...document.querySelectorAll(".social-page .mini-action"),
    ...document.querySelectorAll(".social-page-header button")
  ];
  const financeButtons = [
    ...document.querySelectorAll(".finance-dashboard .btn"),
    ...document.querySelectorAll(".finance-dashboard .mini-action")
  ];
  const pinnedDarkButtons = [
    ...document.querySelectorAll("[data-action='open-staff-market']"),
    ...document.querySelectorAll(".sim-controls [data-sim-control]"),
    ...document.querySelectorAll(".matchup-card .actions [data-simcast-game]"),
    ...document.querySelectorAll(".matchup-card .actions [data-sim-game]"),
    ...document.querySelectorAll(".matchup-card .actions button:disabled")
  ];
  rotationSaveButtons.forEach((button) => {
    const greenStyles = {
      "border-color": "#55dfa0",
      color: "#ffffff",
      "-webkit-text-fill-color": "#ffffff",
      "background-color": "#15945a",
      "background-image": "linear-gradient(135deg, #35d07f, #15945a)",
      "box-shadow": "0 10px 22px rgba(53, 208, 127, .24), inset 0 1px rgba(255, 255, 255, .2), inset 0 -2px rgba(0, 0, 0, .2)",
      opacity: "1"
    };
    Object.entries(greenStyles).forEach(([property, value]) => button.style.setProperty(property, value, "important"));
  });
  standingsButtons.forEach(clearPinnedInlineStyles);
  if (!darkMode) {
    pinnedDarkButtons.forEach(clearPinnedInlineStyles);
    rotationButtons.forEach(clearPinnedInlineStyles);
    freeAgencyButtons.forEach(clearPinnedInlineStyles);
    lockerButtons.forEach(clearPinnedInlineStyles);
    developmentButtons.forEach(clearPinnedInlineStyles);
    staffButtons.forEach(clearPinnedInlineStyles);
    scoutingButtons.forEach(clearPinnedInlineStyles);
    awardsButtons.forEach(clearPinnedInlineStyles);
    socialButtons.forEach(clearPinnedInlineStyles);
    financeButtons.forEach(clearPinnedInlineStyles);
    return;
  }
  const buttons = [
    ...pinnedDarkButtons,
    ...(darkMode ? freeAgencyButtons : []),
    ...(darkMode ? lockerButtons : []),
    ...(darkMode ? developmentButtons : []),
    ...(darkMode ? staffButtons : []),
    ...(darkMode ? scoutingButtons : []),
    ...(darkMode ? awardsButtons : []),
    ...(darkMode ? socialButtons : []),
    ...(darkMode ? financeButtons : []),
    ...(darkMode ? rotationButtons : [])
  ];
  if (!buttons.length) return;
  const baseStyles = {
    "border-color": "rgba(150, 174, 222, .58)",
    color: "#edf4ff",
    "background-color": "rgba(16, 24, 43, .98)",
    "background-image": "linear-gradient(180deg, rgba(35, 48, 76, .98), rgba(16, 24, 43, .98))",
    "box-shadow": "inset 0 0 0 1px rgba(255, 255, 255, .03)",
    opacity: "1",
    transition: "border-color .16s ease, background .16s ease, color .16s ease, transform .16s ease, box-shadow .16s ease"
  };
  const hoverStyles = {
    "border-color": "rgba(79, 139, 255, .9)",
    color: "#ffffff",
    "background-color": "rgba(22, 34, 62, .98)",
    "background-image": "linear-gradient(180deg, rgba(49, 70, 111, .98), rgba(22, 34, 62, .98))",
    "box-shadow": "inset 0 0 0 1px rgba(255, 255, 255, .05), 0 0 0 1px rgba(79, 139, 255, .16), 0 0 12px rgba(79, 139, 255, .22)"
  };
  const primaryStyles = {
    "border-color": "rgba(79, 139, 255, .95)",
    color: "#ffffff",
    "background-color": "#0753ff",
    "background-image": "linear-gradient(180deg, #1266ff, #0b49c9)",
    "box-shadow": "0 8px 18px rgba(6, 76, 255, .22)",
    opacity: "1"
  };
  const disabledStyles = {
    "border-color": "rgba(150, 174, 222, .34)",
    color: "rgba(226, 235, 255, .56)",
    "background-color": "rgba(31, 42, 64, .76)",
    "background-image": "linear-gradient(180deg, rgba(44, 54, 75, .76), rgba(27, 35, 52, .76))",
    "box-shadow": "inset 0 0 0 1px rgba(255, 255, 255, .025)",
    opacity: "1"
  };
  buttons.forEach((button) => {
    const applyStyles = (styles) => Object.entries(styles).forEach(([property, value]) => button.style.setProperty(property, value, "important"));
    const restingStyles = button.disabled ? disabledStyles : button.classList.contains("in-season-negotiate") || button.classList.contains("primary") ? primaryStyles : baseStyles;
    applyStyles(restingStyles);
    button.onmouseenter = () => {
      if (!button.disabled) applyStyles(hoverStyles);
    };
    button.onmouseleave = () => applyStyles(restingStyles);
    button.onfocus = () => {
      if (!button.disabled) applyStyles(hoverStyles);
    };
    button.onblur = () => applyStyles(restingStyles);
  });
}

function lockPinnedDarkFormStyles() {
  const controls = [
    ...document.querySelectorAll("select[data-rotation-position]"),
    ...document.querySelectorAll("select[data-rotation-secondary-position]"),
    ...document.querySelectorAll(".gameplan-page select"),
    ...document.querySelectorAll("select[data-plan-field]"),
    ...document.querySelectorAll("#in-season-fa-search"),
    ...document.querySelectorAll("#in-season-fa-position"),
    ...document.querySelectorAll("#in-season-fa-sort"),
    ...document.querySelectorAll(".staff-list-controls select"),
    ...document.querySelectorAll(".staff-list-controls input"),
    ...document.querySelectorAll(".scouting-page input"),
    ...document.querySelectorAll(".scouting-page select"),
    ...document.querySelectorAll(".finance-dashboard select")
  ];
  if (!controls.length) return;
  if (!document.body.classList.contains("dark-mode")) {
    controls.forEach(clearPinnedInlineStyles);
    return;
  }
  const baseStyles = {
    appearance: "none",
    "-webkit-appearance": "none",
    "border-color": "rgba(150, 174, 222, .58)",
    color: "#edf4ff",
    "background-color": "rgba(16, 24, 43, .98)",
    "background-image": "linear-gradient(180deg, rgba(35, 48, 76, .98), rgba(16, 24, 43, .98))",
    "box-shadow": "inset 0 0 0 1px rgba(255, 255, 255, .03)",
    opacity: "1"
  };
  const disabledStyles = {
    ...baseStyles,
    "border-color": "rgba(150, 174, 222, .34)",
    color: "rgba(226, 235, 255, .56)",
    "background-color": "rgba(31, 42, 64, .76)",
    "background-image": "linear-gradient(180deg, rgba(44, 54, 75, .76), rgba(27, 35, 52, .76))"
  };
  controls.forEach((control) => {
    const styles = control.disabled ? disabledStyles : baseStyles;
    Object.entries(styles).forEach(([property, value]) => control.style.setProperty(property, value, "important"));
  });
}

function clearPinnedInlineStyles(element) {
  [
    "appearance",
    "-webkit-appearance",
    "border-color",
    "color",
    "background-color",
    "background-image",
    "box-shadow",
    "opacity",
    "transition"
  ].forEach((property) => element.style.removeProperty(property));
  element.onmouseenter = null;
  element.onmouseleave = null;
  element.onfocus = null;
  element.onblur = null;
}

function renderContextNav() {
  const contextNav = document.querySelector("#context-nav");
  const sectionLabel = document.querySelector("#context-section");
  const contextTitle = document.querySelector("#context-title");
  if (!contextNav) return;
  const inCareer = active !== "start" && active !== "team-select" && active !== "saves";
  if (inCareer) {
    const selectedTeam = activeTeam();
    if (sectionLabel) sectionLabel.textContent = "";
    if (contextTitle) contextTitle.innerHTML = `${teamLogo(selectedTeam, "context-team-logo")}<span><em>${escapeHtml(selectedTeam.city)}</em>${escapeHtml(selectedTeam.name)}<small><b class="context-record ${selectedTeam.wins > selectedTeam.losses ? "winning" : selectedTeam.wins < selectedTeam.losses ? "losing" : "even"}">${selectedTeam.wins}-${selectedTeam.losses}</b><i>${escapeHtml(selectedTeam.conf)} CONFERENCE</i></small></span>`;
    const sidebarItems = [
      ["dashboard", "Dashboard", "⌁"], ["play", "Schedule", "▣"], ["standings", "Standings", "♜"],
      ["inventory", "Roster", "♙"], ["rotation", "Rotation", "◎"], ["strategy", "Gameplan", "◇"],
      ["trade", "Trades", "⇄"], ["offseason", "Free Agency", "▤"], ["locker", "Locker Room", "♡"],
      ["development", "Player Development", "◆"], ["staff", "Staff", "♟"], ["scouting", "Scouting", "⌖"], ["finances", "Finances", "$"], ["social", "Social", "◉"], ["stats", "League Stats", "↗"],
      ["awards", "Awards", "☆"], ["history", "League History", "◷"], ["settings", "Settings", "⚙"]
    ];
    contextNav.innerHTML = sidebarItems.map(([id, label, icon]) => `${id === "social" ? '<span class="sidebar-nav-divider">League</span>' : ""}<button class="phase6-nav-item ${active === id ? "active" : ""}" data-nav="${id}"><i>${icon}</i><span>${label}</span>${active === id ? '<b aria-hidden="true"></b>' : ""}</button>`).join("");
  } else {
  const current = currentNavSection();
  if (sectionLabel) sectionLabel.textContent = current.label;
  if (contextTitle) contextTitle.textContent = pageLabel(active);
  contextNav.innerHTML = current.pages
    .map(([id, label]) => {
      const badge = navBadgeFor(id);
      return `<button class="${active === id ? "active" : ""}" data-nav="${id}">${label}${badge ? `<b class="nav-badge">${badge}</b>` : ""}</button>`;
    })
    .join("");
  }

  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      active = button.dataset.nav;
      render();
    });
  });
}

function renderSidebarNextGame() {
  const target = document.querySelector("#sidebar-next-game");
  if (!target) return;
  if (active === "start" || active === "team-select" || active === "saves") { target.removeAttribute("style"); target.innerHTML = ""; return; }
  const selectedTeam = activeTeam();
  const schedule = Array.isArray(save.schedule) ? save.schedule : [];
  const next = schedule.find((game) => !game.played);
  if (!next) { target.removeAttribute("style"); target.innerHTML = '<span>SEASON</span><strong>COMPLETE</strong><small>No games remaining</small>'; return; }
  const opponentId = next.home === selectedTeam.id ? next.away : next.home;
  const opponent = getTeam(opponentId);
  const venue = next.home === selectedTeam.id ? "vs" : "@";
  const opponentLabel = opponent?.abbr || opponent?.name || "TBD";
  target.setAttribute("style", `${simcastTeamVars(selectedTeam)};--game-team:var(--side-primary);--game-team-glow:color-mix(in srgb, var(--side-primary) 28%, transparent);${simcastMatchupVars(selectedTeam, opponent)}`);
  target.innerHTML = `<span>NEXT GAME <i>${next.home === selectedTeam.id ? "HOME" : "AWAY"}</i></span><div class="sidebar-next-game-matchup logo-only" style="${simcastMatchupVars(selectedTeam, opponent)}"><div class="sidebar-matchup-team">${teamLogo(selectedTeam, "sidebar-next-game-logo")}</div><span class="sidebar-matchup-divider" aria-hidden="true"></span><div class="sidebar-matchup-team">${teamLogo(opponent, "sidebar-next-game-logo")}</div><div class="sidebar-matchup-meta"><b>${escapeHtml(selectedTeam.abbr)}</b><time>${formatShortDate(next.date)}</time><b>${escapeHtml(opponentLabel)}</b></div></div><button class="btn sidebar-sim-game-button phase6-button phase6-button--team primary" data-sim-control="next">&#9655; SIM GAME <span>›</span></button>`;
  const simButton = target.querySelector(".sidebar-sim-game-button");
  const teamTheme = teamThemes[selectedTeam.id] || teamThemes.bos;
  if (simButton) {
    simButton.style.setProperty("border-color", teamTheme.secondary, "important");
    simButton.style.setProperty("color", "#fff", "important");
    simButton.style.setProperty("-webkit-text-fill-color", "#fff", "important");
    simButton.style.setProperty("background", `linear-gradient(135deg, color-mix(in srgb, ${teamTheme.primary} 82%, #fff), ${teamTheme.primary})`, "important");
    simButton.style.setProperty("box-shadow", `0 10px 22px color-mix(in srgb, ${teamTheme.primary} 30%, transparent), inset 0 1px rgba(255,255,255,.15)`, "important");
  }
  target.querySelector("[data-action='go-games']")?.addEventListener("click", () => { active = "play"; render(); });
}

function currentNavSection() {
  if (active === "start" || active === "team-select" || active === "saves") return menuSection;
  return navSections.find((section) => section.pages.some(([id]) => id === active)) || navSections[2];
}

function pageLabel(pageId = active) {
  if (pageId === "start") return "Main Menu";
  if (pageId === "team-select") return "Team Select";
  if (pageId === "saves") return "Save Slots";
  return navItems.find(([id]) => id === pageId)?.[1] || "Command Center";
}

function navigateToMainMenu() {
  active = "start";
  pendingMode = null;
  render();
}

function navBadgeFor(pageId) {
  if (pageId === "transactions") return save.notifications?.filter((item) => !item.read).length || 0;
  if (pageId === "locker") return teamPlayers(save.activeTeamId).filter((player) => player.dissatisfaction?.level >= 2).length;
  if (pageId === "offseason") return save.offseason?.requiredActions?.length || 0;
  return 0;
}

function applyTeamTheme() {
  const theme = teamThemes[save.activeTeamId] || teamThemes.bos;
  document.body.style.setProperty("--team-primary", theme.primary);
  document.body.style.setProperty("--team-secondary", theme.secondary);
  document.body.style.setProperty("--team-accent", theme.accent);
  document.body.style.setProperty("--team-contrast", theme.contrast);
}

function renderPageContext() {
  const context = document.querySelector("#page-context");
  if (!context) return;
  if (active === "start" || active === "team-select") {
    context.innerHTML = "";
    return;
  }
  const current = currentNavSection();
  const selectedTeam = activeTeam();
  context.innerHTML = `
    <div>
      <div class="breadcrumb">${current.label} / ${pageLabel(active)}</div>
      <h1>${pageLabel(active)}</h1>
      <p>${escapeHtml(selectedTeam.city)} ${escapeHtml(selectedTeam.name)} - ${selectedTeam.wins}-${selectedTeam.losses} - ${save.season}-${String(save.season + 1).slice(-2)} - ${escapeHtml(save.phase || "Regular Season")}</p>
    </div>
    <div class="page-context-card">
      <span>${escapeHtml(nextContextLabel())}</span>
      <strong>${escapeHtml(nextContextValue())}</strong>
    </div>
  `;
}

function nextContextLabel() {
  if (save.offseason) return "Current offseason stage";
  const mandatory = pendingFrontOfficeDecisions?.() || [];
  if (mandatory.length) return "Next required decision";
  return "Next game";
}

function nextContextValue() {
  if (save.offseason) return save.offseason.stage || "Offseason hub";
  const mandatory = pendingFrontOfficeDecisions?.() || [];
  if (mandatory.length) return mandatory[0].label || mandatory[0].message || "Front office decision";
  const next = [...(save.schedule || [])].sort((a, b) => a.date.localeCompare(b.date)).find((game) => !game.played);
  if (!next) return "Regular season complete";
  const opponentId = next.home === save.activeTeamId ? next.away : next.home;
  const venue = next.home === save.activeTeamId ? "vs" : "@";
  return `${formatShortDate(next.date)} ${venue} ${teamName(opponentId)}`;
}

function renderProfile() {
  const profileTeam = document.querySelector("#profile-team");
  const profileRecord = document.querySelector("#profile-record");
  const teamBadge = document.querySelector("#team-badge");
  const datePill = document.querySelector("#career-date-pill");
  if (!profileTeam || !profileRecord || !teamBadge) return;

  if (active === "start" || active === "team-select" || active === "saves") {
    profileTeam.textContent = active === "team-select" ? "Team Select" : active === "saves" ? "Save Slots" : "Start Menu";
    profileRecord.textContent = active === "team-select" ? `${pendingMode || "Career"} mode` : saveSlots.length ? `${saveSlots.length} save slot${saveSlots.length === 1 ? "" : "s"}` : "No save yet";
    teamBadge.textContent = "GM";
    if (datePill) datePill.innerHTML = "";
    return;
  }

  const team = activeTeam();
  profileTeam.textContent = `${team.city} ${team.name}`;
  profileRecord.textContent = `${save.mode} - ${team.wins} W / ${team.losses} L`;
  teamBadge.textContent = String(save.season).slice(-2);
  if (datePill) {
    const leagueDate = currentLeagueDate() || `${save.season}-10-20`;
    const seasonStart = new Date(`${save.season}-10-20T12:00:00`);
    const current = new Date(`${leagueDate}T12:00:00`);
    const week = Math.max(1, Math.floor((current - seasonStart) / 604800000) + 1);
    datePill.innerHTML = `<span>&#9716;</span><strong>WEEK ${week}</strong><i></i><b>${current.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</b>`;
  }
}

function startMenu() {
  const hasSave = saveSlots.length > 0;
  const latestSlot = saveSlots[0];
  const storedTeam = latestSlot ? getTeamFrom(save, latestSlot.teamId) : null;
  const latestTeamName = storedTeam ? `${storedTeam.city} ${storedTeam.name}` : latestSlot?.name || "No active career";
  return `
    <section class="start-menu opening-menu">
      <header class="opening-header">
        <div class="opening-logo"><span>MY</span>NBA <b>SIM</b></div>
        <div class="opening-season">2026–27 SEASON <i></i> FRONT OFFICE SIMULATION</div>
      </header>

      <section class="opening-hero">
        <div class="opening-copy">
          <span class="opening-kicker">BUILD THE ROSTER. SHAPE THE LEAGUE.</span>
          <h1>YOUR FRANCHISE.<br><em>YOUR LEGACY.</em></h1>
          <p>Take control of an NBA organization and make every decision—from the rotation to the trade deadline.</p>

          <div class="opening-primary-actions">
            <button class="opening-continue ${hasSave ? "" : "disabled"}" ${hasSave ? `data-slot-load="${latestSlot.id}"` : "disabled"}>
              <span>${hasSave ? "CONTINUE CAREER" : "NO ACTIVE CAREER"}</span>
              <strong>${hasSave ? latestTeamName : "Create a new career below"}</strong>
              <small>${hasSave ? `${latestSlot.mode} Mode · ${latestSlot.season} · ${latestSlot.wins}-${latestSlot.losses}` : "Your latest save will appear here"}</small>
              <b aria-hidden="true">→</b>
            </button>
          </div>
        </div>

        <div class="arena-visual" aria-hidden="true">
          <div class="arena-glow"></div>
          <div class="court-mark court-arc"></div>
          <div class="court-mark court-lane"></div>
          <div class="arena-score-card score-card-one"><span>TEAM OVR</span><strong>84</strong><small>CONTENDER</small></div>
          <div class="arena-score-card score-card-two"><span>CAP SPACE</span><strong>$18.4M</strong><small>FLEXIBLE</small></div>
          <div class="arena-player-mark">GM</div>
        </div>
      </section>

      <section class="mode-grid">
        <button class="mode-card featured" data-action="start-default">
          <span class="mode-number">01</span>
          <div><span class="card-label">streamlined experience</span><strong>DEFAULT MODE</strong><small>Manage lineups, trades, games, and season simulation with simplified front-office systems.</small></div>
          <b aria-hidden="true">→</b>
        </button>
        <button class="mode-card" data-action="start-gm">
          <span class="mode-number">02</span>
          <div><span class="card-label">complete control</span><strong>GM MODE</strong><small>Own the cap sheet, scouting, staff, morale, contracts, and long-term team building.</small></div>
          <b aria-hidden="true">→</b>
        </button>
      </section>

      <div class="start-actions opening-utilities">
        <button class="btn" data-action="load-save" ${hasSave ? "" : "disabled"}>▣ Save Slots <span>${saveSlots.length}</span></button>
        <button class="btn" data-action="settings">⚙ Settings</button>
        <button class="btn" data-action="folder">↗ Save Folder</button>
        <small>LOCAL CAREER DATA · AUTOSAVE ENABLED</small>
      </div>
    </section>
  `;
}

function savesMenu() {
  const latest = saveSlots[0];
  const totalGames = saveSlots.reduce((sum, slot) => sum + Number(slot.wins || 0) + Number(slot.losses || 0), 0);
  return `
    <section class="start-menu save-slots-menu">
      <header class="opening-header">
        <button class="opening-back" data-action="start">← BACK</button>
        <div class="opening-logo"><span>MY</span>NBA <b>SIM</b></div>
        <div class="opening-season">CAREER ARCHIVE <i></i> LOCAL STORAGE</div>
      </header>
      <section class="save-archive-heading">
        <div><span class="opening-kicker">FRANCHISE ARCHIVE</span><h1>YOUR <em>CAREERS</em></h1><p>Continue a franchise or manage the careers stored on this device.</p></div>
        <div class="save-archive-summary">
          <article><span>CAREERS</span><strong>${String(saveSlots.length).padStart(2, "0")}</strong><small>Locally saved</small></article>
          <article><span>GAMES</span><strong>${totalGames}</strong><small>Across all saves</small></article>
          <article><span>LATEST</span><strong>${latest ? latest.teamId.toUpperCase() : "--"}</strong><small>${latest ? formatDate(latest.updatedAt) : "No activity"}</small></article>
        </div>
      </section>
      <section class="save-grid">
        ${
          saveSlots.length
            ? saveSlots.map((slot, index) => saveSlotCard(slot, index)).join("")
            : `<section class="empty-save-state"><span>＋</span><strong>NO CAREERS SAVED</strong><small>Start Default Mode or GM Mode to create your first franchise.</small><button class="btn primary" data-action="start">Create a Career</button></section>`
        }
      </section>
      <div class="save-archive-footer">
        <div><span>AUTOSAVE ENABLED</span><small>Careers are stored locally on this device.</small></div>
        <div class="actions"><button class="btn" data-action="folder">↗ Open Save Folder</button><button class="btn" data-action="start">Main Menu</button></div>
      </div>
    </section>
  `;
}

function saveSlotCard(slot, index = 0) {
  const team = getTeamFrom(save, slot.teamId);
  const wins = Number(slot.wins || 0);
  const losses = Number(slot.losses || 0);
  const games = wins + losses;
  const winPercent = games ? Math.round(wins / games * 100) : 0;
  return `
    <article class="save-slot-card ${index === 0 ? "latest" : ""}">
      <header><span>SLOT ${String(index + 1).padStart(2, "0")}</span>${index === 0 ? "<b>LAST PLAYED</b>" : `<b>${escapeHtml(slot.mode)} MODE</b>`}</header>
      <section class="save-franchise-identity">
        <div class="save-team-mark">${team ? teamLogo(team, "save-team-logo") : escapeHtml(slot.teamId.toUpperCase())}</div>
        <div class="save-slot-copy"><span>${escapeHtml(slot.mode)} MODE · ${slot.season}-${String(Number(slot.season) + 1).slice(-2)}</span><strong>${escapeHtml(slot.name)}</strong><small>${team ? `${escapeHtml(team.city)} ${escapeHtml(team.name)}` : escapeHtml(slot.teamId.toUpperCase())}</small></div>
      </section>
      <section class="save-career-stats">
        <div><span>RECORD</span><strong>${wins}-${losses}</strong></div><div><span>WIN RATE</span><strong>${winPercent}%</strong></div><div><span>UPDATED</span><strong>${formatDate(slot.updatedAt)}</strong></div>
      </section>
      <div class="save-slot-actions">
        <button class="save-load-button" data-slot-load="${slot.id}"><span>CONTINUE CAREER</span><b>→</b></button>
        <div><button class="btn" data-slot-overwrite="${slot.id}">Overwrite</button><button class="btn danger" data-slot-delete="${slot.id}">Delete</button></div>
      </div>
    </article>
  `;
}

function teamSelectMenu() {
  const mode = pendingMode || "Default";
  return `
    <section class="start-menu team-select-menu">
      <header class="opening-header">
        <button class="opening-back" data-action="start">← BACK</button>
        <div class="opening-logo"><span>MY</span>NBA <b>SIM</b></div>
        <div class="opening-season">${mode.toUpperCase()} MODE <i></i> NEW CAREER</div>
      </header>
      <div class="menu-page-heading team-select-heading">
        <div><span class="opening-kicker">30 TEAMS. ONE DECISION.</span><h1>SELECT YOUR <em>FRANCHISE</em></h1></div>
        <p>Choose the organization you want to lead. Team colors will shape your entire front-office experience.</p>
      </div>
      <section class="team-grid">
        ${nbaTeams
          .map(([id, city, name, abbr, conf, payroll]) => `
            <button class="team-card" data-team-id="${id}">
              <span class="team-card-mark">${teamLogo({ id, teamId: nbaTeamIdsBySlug[id], city, name }, "team-card-logo")}<i>${abbr}</i></span>
              <div><strong>${city} ${name}</strong><small>${conf.toUpperCase()}ERN CONFERENCE</small></div>
              <b>$${payroll}M<small>PAYROLL</small></b>
            </button>
          `)
          .join("")}
      </section>
      <div class="start-actions">
        <button class="btn" data-action="start">← Change Mode</button>
      </div>
    </section>
  `;
}

function socialPage() {
  const selectedTeam = activeTeam();
  const star = bestPlayer(selectedTeam.id);
  const next = nextGameForTeam(selectedTeam.id);
  const opponentId = next ? (next.home === selectedTeam.id ? next.away : next.home) : null;
  const opponent = opponentId ? getTeam(opponentId) : null;
  const positive = Math.max(58, Math.min(94, selectedTeam.wins * 4 + 62 - selectedTeam.losses * 2));
  const followers = (1.6 + Math.max(0, selectedTeam.wins - selectedTeam.losses) * .12 + teamRating(selectedTeam) / 120).toFixed(1);
  const engagement = (4.8 + positive / 42).toFixed(1);
  const impressions = (16 + teamRating(selectedTeam) / 8 + selectedTeam.wins * 1.3).toFixed(1);
  const leaguePosts = (save.transactionLog || []).slice(-8).reverse().map((item, index) => ({
    source: item.type || "League Wire",
    handle: "@NBASimWire",
    time: `${index + 1}h`,
    text: item.text
  }));
  const fallbackPosts = [
    { source: `${selectedTeam.city} ${selectedTeam.name}`, handle: `@${selectedTeam.abbr}`, time: "18m", text: `${star.name} leads the next chapter as the club prepares for its upcoming matchup.` },
    { source: "League Insider", handle: "@CourtsideReport", time: "1h", text: `${selectedTeam.abbr} remain one of the teams to watch as front offices evaluate the early trade market.` },
    { source: "NBA Sim", handle: "@LeagueOffice", time: "3h", text: "Award races, injuries, milestones, and transactions will update here throughout the season." }
  ];
  const posts = leaguePosts.length ? leaguePosts : fallbackPosts;
  const trends = ["Trade Market", `${selectedTeam.abbr} Basketball`, "Award Watch", "Rookie Ladder", "Power Rankings"];
  const socialPosts = [
    { id:`fallback-team-${selectedTeam.id}`, source: `${selectedTeam.city} ${selectedTeam.name}`, handle: `@${selectedTeam.abbr}`, time: "2h", text: `Huge win in ${opponent ? opponent.city : "front of the fans"}! Great team effort from start to finish. #TrueTo${selectedTeam.city.replace(/\s+/g, "")}`, type: "game", teamId:selectedTeam.id },
    { id:`fallback-player-${star.id}`, source: star.name, handle: `@${star.name.replace(/\s+/g, "")}`, time: "4h", text: "Locked in. Ready for the next one. #believe", player: star, playerId:star.id, type: "player" },
    { id:`fallback-nba-${selectedTeam.id}`, source: "NBA", handle: "@NBA", time: "6h", text: `Top plays from last night's ${selectedTeam.name} action.`, type: "video" }
  ].concat(posts.slice(0, 2).map((post) => ({ ...post, type: "text" })));
  const savedSocialPosts = save.social.posts.map((post) => ({
    id: post.id,
    accountId: post.accountId || null,
    source: post.source || post.authorName || `${selectedTeam.city} ${selectedTeam.name}`,
    handle: post.handle || post.authorHandle || `@${selectedTeam.abbr}`,
    time: post.time || "Recently",
    text: post.text || "",
    type: post.type || "text",
    player: post.playerId ? save.players.find((player) => player.id === post.playerId) : null,
    teamId: post.teamId || null,
    playerId: post.playerId || null,
    gameId: post.gameId || null,
    transactionId: post.transactionId || null,
    mentions: Array.isArray(post.mentions) ? post.mentions : []
  }));
  const allSocialPosts = [...savedSocialPosts].reverse().concat(socialPosts).map((post,index) => ({ ...post,id:post.id || `feed-${socialEventKey(`${post.handle}-${post.text}-${index}`)}` }));
  socialVisiblePostCache = new Map(allSocialPosts.map((post) => [post.id,post]));
  const socialTrends = [`#TrueTo${selectedTeam.city.replace(/\s+/g, "")}`, star.name, `${selectedTeam.name} Win`, opponent?.city || trends[0]];
  return `
    <section class="social-page">
      <header class="social-page-header"><div><h1>SOCIAL</h1><p>Manage your team's brand, engage with fans, and track your online presence.</p></div><div><button class="btn" data-social-refresh="true">Refresh Feed</button><button class="btn primary" data-social-create-post="true">Create Post</button><button class="btn" aria-label="More social actions">...</button></div></header>
      <section class="social-metrics">
        ${socialMetricCard("Total Followers", `${followers}M`, "5.2%", "blue")}
        ${socialMetricCard("Engagement Rate", `${engagement}%`, "1.1%", "red")}
        ${socialMetricCard("Impressions", `${impressions}M`, "8.3%", "blue")}
        ${socialMetricCard("Social Sentiment", positive >= 70 ? "Positive" : "Mixed", `${positive}% Positive`, "purple")}
      </section>
      <section class="social-layout">
        <main class="social-feed">
          <header><nav class="social-tabs">${[["for-you","For You"],["team","Team Feed"],["mentions",`Notifications${save.social.notifications.some((item)=>!item.read) ? ` (${save.social.notifications.filter((item)=>!item.read).length})` : ""}`],["messages","Direct Messages"],["sentiment","Sentiment"],["schedule","Publish Schedule"]].map(([id,label]) => `<button class="${socialActiveTab === id ? "active" : ""}" data-social-tab="${id}">${label}</button>`).join("")}</nav></header>
          ${socialTabContent(socialActiveTab, allSocialPosts, selectedTeam, opponent, star)}
        </main>
        <aside class="social-sidebar">
          ${socialMessagesDrawerOpen ? socialMessagesDrawer(selectedTeam, star) : `<section class="social-summary"><header><strong>Team Social Summary</strong><span>Last 7 Days</span></header>${socialPlatformRows(followers)}</section>`}
          <section class="social-trends"><header><strong>Trending Topics</strong><button class="mini-action">View All</button></header>${socialTrends.map((trend, index) => `<article><b>${index + 1}</b><span><strong>${escapeHtml(trend)}</strong><small>Trending in ${index ? "NBA" : selectedTeam.city}</small></span><em>^</em></article>`).join("")}</section>
          ${socialActiveTab === "messages" ? "" : '<button class="social-dms-button social-quick-dms" aria-label="Open direct messages"></button>'}
        </aside>
      </section>
      ${socialPostConversationModal()}
      ${socialAccountProfileModal()}
      ${socialCreatePostModal()}
    </section>
  `;
  return `
    <h1 class="page-title">social</h1>
    <section class="social-layout">
      <main class="social-feed">
        <header><div><span>LEAGUE CONVERSATION</span><strong>Social Feed</strong></div><div class="social-filter"><button class="active">For You</button><button>Team</button><button>League</button><button>Rumors</button></div></header>
        ${posts.map((post, index) => `<article class="social-post"><div class="social-avatar">${escapeHtml(post.source.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase())}</div><div><header><strong>${escapeHtml(post.source)}</strong><span>${escapeHtml(post.handle)} · ${escapeHtml(post.time)}</span></header><p>${escapeHtml(post.text)}</p><footer><button>♡ ${8 + index * 3}</button><button>↻ ${2 + index}</button><button>↗ Share</button></footer></div></article>`).join("")}
      </main>
      <aside class="social-sidebar">
        <section><span>TRENDING NOW</span><strong>Around the League</strong>${trends.map((trend, index) => `<div><small>${index + 1} · NBA</small><b>${escapeHtml(trend)}</b><em>${12 + index * 7}K posts</em></div>`).join("")}</section>
        <section><span>TEAM PULSE</span><strong>${escapeHtml(selectedTeam.abbr)} Sentiment</strong><div class="social-sentiment"><b>${Math.max(52, selectedTeam.wins * 2 + 58)}%</b><small>POSITIVE</small></div><p>Fan confidence responds to results, roster moves, morale, and league expectations.</p></section>
      </aside>
    </section>
  `;
}

function nextGameForTeam(teamId) {
  return save.schedule.find((game) => !game.played && (game.home === teamId || game.away === teamId)) || save.schedule.find((game) => game.home === teamId || game.away === teamId);
}

function socialMetricCard(label, value, change, tone) {
  const icons = { "Total Followers": "fans", "Engagement Rate": "love", "Impressions": "views", "Social Sentiment": "buzz" };
  return `<article class="card social-metric-card ${tone}"><span>${escapeHtml(icons[label] || "trend")}</span><div><b>${escapeHtml(label)}</b><strong>${escapeHtml(value)}</strong><small>^ ${escapeHtml(change)} <em>vs last week</em></small></div></article>`;
}

function socialPost(post, index, team, opponent) {
  const postId = post.id || `feed-${socialEventKey(`${post.handle}-${post.text}-${index}`)}`;
  const account = post.accountId ? socialAccount(post.accountId) : null;
  const avatar = post.player ? playerHeadshot(post.player, "social-post-avatar-img") : post.playerId ? playerHeadshot(save.players.find((player) => player.id === post.playerId), "social-post-avatar-img") : post.teamId ? teamLogo(post.teamId, "social-post-team-logo") : post.source === "NBA" ? '<span class="social-post-nba">NBA</span>' : account ? `<span class="social-post-account-avatar">${escapeHtml(account.name.split(/\s+/).map((word) => word[0]).join("").slice(0,3))}</span>` : teamLogo(team, "social-post-team-logo");
  const gifUrl = safeSocialMediaUrl(post.gifUrl);
  const media = gifUrl ? `<img class="social-post-gif" src="${escapeHtml(gifUrl)}" alt="Post GIF" loading="lazy">` : post.type === "game" ? socialGameMedia(team, opponent) : post.type === "video" ? socialVideoMedia(team) : "";
  const interactions = save.social.interactions;
  const liked = interactions.likedPostIds.includes(postId), reposted = interactions.repostedPostIds.includes(postId), bookmarked = interactions.bookmarkedPostIds.includes(postId);
  const seed = parseInt(socialEventKey(postId),36) || 1;
  const replyCount = save.social.replies.filter((reply) => reply.postId === postId).length + 12 + seed % 180;
  const repostCount = 35 + seed % 900 + (reposted ? 1 : 0), likeCount = 120 + seed % 7200 + (liked ? 1 : 0), views = 12 + seed % 880;
  return `<article class="social-post social-post-${escapeHtml(post.type || "text")}">
    <div class="social-avatar">${avatar}</div>
    <div class="social-post-body">
      <header><button class="social-post-author" data-social-profile="${escapeHtml(post.accountId || (post.teamId ? `team-${post.teamId}` : post.playerId ? `player-${post.playerId}` : post.source === "NBA" ? "league-nba" : ""))}"><strong>${escapeHtml(post.source)}</strong></button>${account?.verified || post.verified ? "<i></i>" : ""}<span>${escapeHtml(post.handle)} · ${escapeHtml(post.time)}</span></header>
      <p>${escapeHtml(post.text)}</p>
      ${media}
      <footer><button data-social-post-action="reply" data-social-post-id="${escapeHtml(postId)}" title="Reply"><b>&#9711;</b> ${replyCount}</button><button class="${reposted ? "active repost" : ""}" data-social-post-action="repost" data-social-post-id="${escapeHtml(postId)}" title="Repost"><b>&#8645;</b> ${repostCount}</button><button class="${liked ? "active like" : ""}" data-social-post-action="like" data-social-post-id="${escapeHtml(postId)}" title="Like"><b>&#9825;</b> ${likeCount}</button><button data-social-post-action="view" data-social-post-id="${escapeHtml(postId)}" title="View post"><b>&#9615;</b> ${views}K</button><button data-social-post-action="share" data-social-post-id="${escapeHtml(postId)}" title="Share"><b>&#8679;</b></button></footer>
    </div>
  </article>`;
}

function socialGameMedia(team, opponent) {
  return `<section class="social-game-card"><div class="social-game-art">${teamLogo(team, "social-game-logo")}${opponent ? teamLogo(opponent, "social-game-logo") : ""}<strong>${escapeHtml(team.abbr)}</strong></div><aside><span>FINAL</span><div>${teamLogo(team, "social-score-logo")}<b>112</b></div>${opponent ? `<div>${teamLogo(opponent, "social-score-logo")}<b>105</b></div>` : ""}</aside></section>`;
}

function socialVideoMedia(team) {
  return `<section class="social-video-card">${teamLogo(team, "social-video-logo")}<button aria-label="Play highlight">Play</button><span>0:45</span></section>`;
}

function socialPlatformRows(followers) {
  const rows = [["Instagram", `${followers}M Followers`, "4.4%"], ["X (Twitter)", "742K Followers", "3.1%"], ["Facebook", "312K Followers", "2.8%"], ["TikTok", "284K Followers", "6.7%"], ["YouTube", "118K Subscribers", "5.6%"]];
  return rows.map(([name, count, growth]) => `<article><i>${escapeHtml(name[0])}</i><span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(count)}</small></span><b>^ ${escapeHtml(growth)}</b><em></em></article>`).join("") + '<button class="mini-action">View Full Analytics</button>';
}

function socialMediaRows() {
  return [["Oct", "25", "Press Conference", "Coach Availability", "12:00 PM"], ["Oct", "27", "Player Availability", "Injury Report Update", "10:00 AM"], ["Oct", "29", "Media Day", "Team Arena", "All Day"]].map(([month, day, title, note, time]) => `<article><b><span>${month}</span>${day}</b><div><strong>${title}</strong><small>${note}</small></div><em>${time}</em></article>`).join("");
}

function socialDmRows(star, team) {
  const rows = [
    [star.name, "Wants to approve a community reply.", "2m"],
    [`${team.city} PR`, "Sponsor post draft is ready.", "18m"],
    ["Fan Relations", "Three high-priority fan messages.", "1h"]
  ];
  return rows.map(([sender, note, time], index) => `<article><b>${index + 1}</b><span><strong>${escapeHtml(sender)}</strong><small>${escapeHtml(note)}</small></span><em>${escapeHtml(time)}</em></article>`).join("");
}

function socialMessagesDrawer(team, star) {
  if (!socialMessagesDrawerOpen) return "";
  const conversations = ensureSocialMessageConversations(star, team);
  return `<aside class="social-message-drawer">
      <div class="social-message-header"><strong>Chat</strong><div><button aria-label="Message filters">All⌄</button><button aria-label="New message">♧＋</button><button data-social-drawer-fullscreen="true" aria-label="Open full messages">↗</button><button data-social-drawer-close="true" aria-label="Collapse messages">⌄</button></div></div>
    <label class="social-message-search"><span>⌕</span><input id="social-drawer-search" placeholder="Search" style="color:#edf4ff!important;background:#202c41!important;background-image:none!important;border:0!important"></label>
    <div class="social-message-list">${conversations.map((conversation) => {
      const latest = (conversation.messages || []).at(-1);
      const player = conversation.playerId ? save.players.find((item) => item.id === conversation.playerId) : null;
      return `<button class="social-message-row" data-social-drawer-conversation="${escapeHtml(conversation.id)}" data-social-drawer-search="${escapeHtml(normalizeText(`${conversation.participantName} ${latest?.text || ""}`))}"><span class="social-message-avatar">${player ? playerHeadshot(player,"social-message-avatar-img") : `<b>${escapeHtml((conversation.participantName || "DM").split(/\s+/).map((word) => word[0]).join("").slice(0,2))}</b>`}</span><span><strong>${escapeHtml(conversation.participantName)}</strong><small>${escapeHtml(latest?.sender === "team" ? `You: ${latest.text}` : latest?.text || "Open conversation")}</small></span><em>${escapeHtml(latest?.time || "now")}</em>${conversation.read === false ? "<i></i>" : ""}</button>`;
    }).join("")}</div>
  </aside>`;
}

function socialTabContent(tab, posts, team, opponent, star) {
  if (tab === "team") {
    const teamPosts = posts.filter((post) => post.teamId === team.id || post.handle === `@${team.abbr}` || normalizeText(post.source) === normalizeText(`${team.city} ${team.name}`));
    return socialPostList(teamPosts, team, opponent, "No team posts have been published yet.");
  }
  if (tab === "mentions") {
    return socialNotificationsTab();
  }
  if (tab === "messages") return socialMessagesTab(star, team);
  if (tab === "sentiment") return socialSentimentTab(team);
  if (tab === "schedule") return socialScheduleTab();
  return socialPostList(posts, team, opponent, "Your feed is quiet.");
}

function socialPostList(posts, team, opponent, emptyMessage) {
  return posts.length ? posts.map((post, index) => socialPost(post, index, team, opponent)).join("") : `<section class="social-media"><header><strong>${escapeHtml(emptyMessage)}</strong></header></section>`;
}

function socialMessagesTab(star, team) {
  const conversations = ensureSocialMessageConversations(star, team);
  const selected = conversations.find((item) => item.id === selectedSocialConversationId) || conversations[0];
  selectedSocialConversationId = selected?.id || null;
  const selectedPlayer = selected?.playerId ? save.players.find((player) => player.id === selected.playerId) : null;
  return `<section class="social-messages-shell">
    <aside class="social-message-inbox">
      <div class="social-message-header"><strong>Chat</strong><div><button aria-label="Message filters">All⌄</button><button aria-label="Message requests">✉</button><button aria-label="New message">＋</button></div></div>
      <label class="social-message-search"><span>⌕</span><input id="social-message-search" placeholder="Search Direct Messages" style="color:#edf4ff!important;background:#202c41!important;background-image:none!important;border:0!important"></label>
      <div class="social-message-list">${conversations.map((conversation) => {
        const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
        const latest = messages.at(-1);
        const player = conversation.playerId ? save.players.find((item) => item.id === conversation.playerId) : null;
        return `<button class="social-message-row ${conversation.id === selected.id ? "active" : ""}" data-social-conversation="${escapeHtml(conversation.id)}" data-social-conversation-search="${escapeHtml(normalizeText(`${conversation.participantName} ${latest?.text || ""}`))}"><span class="social-message-avatar">${player ? playerHeadshot(player,"social-message-avatar-img") : `<b>${escapeHtml((conversation.participantName || "DM").split(/\s+/).map((word) => word[0]).join("").slice(0,2))}</b>`}</span><span><strong>${escapeHtml(conversation.participantName || "Conversation")}</strong><small>${escapeHtml(latest?.sender === "team" ? `You: ${latest.text}` : latest?.text || conversation.preview || "Open conversation")}</small></span><em>${escapeHtml(latest?.time || conversation.updatedAt || "now")}</em>${conversation.read === false ? "<i></i>" : ""}</button>`;
      }).join("")}</div>
    </aside>
    <section class="social-message-thread">
      <div class="social-message-header"><div class="social-message-avatar">${selectedPlayer ? playerHeadshot(selectedPlayer,"social-message-avatar-img") : `<b>${escapeHtml((selected?.participantName || "DM").slice(0,2))}</b>`}</div><strong>${escapeHtml(selected?.participantName || "Direct Messages")}</strong><div><button aria-label="Start audio call">⌕</button><button aria-label="Start video call">▣</button><button aria-label="Conversation details">•••</button></div></div>
      <div class="social-message-history">${(selected?.messages || []).map((message) => `<div class="social-message-bubble ${message.sender === "team" ? "outgoing" : "incoming"}"><span>${escapeHtml(message.text)}</span><small>${escapeHtml(message.time || "")}</small></div>`).join("")}</div>
      <footer><button aria-label="Add attachment">＋</button><button aria-label="Add GIF">GIF</button><button aria-label="Add emoji">☺</button><input id="social-message-input" placeholder="Message" maxlength="500" style="color:#edf4ff!important;background:#202c41!important;background-image:none!important;border:1px solid rgba(150,174,222,.25)!important"><button data-social-send-message="${escapeHtml(selected?.id || "")}" aria-label="Send message">➤</button></footer>
    </section>
  </section>`;
}

function ensureSocialMessageConversations(star, team) {
  if (save.social.conversations.length) return save.social.conversations;
  save.social.conversations = [
    { id:"dm-player", participantName:star.name, playerId:star.id, read:false, messages:[{ id:"dm-1", sender:"contact", text:"Can we talk about how the team wants me represented publicly?", time:"2m" }] },
    { id:"dm-pr", participantName:`${team.city} PR`, read:true, messages:[{ id:"dm-2", sender:"contact", text:"The sponsor post draft is ready for your approval.", time:"18m" }] },
    { id:"dm-fans", participantName:"Fan Relations", read:true, messages:[{ id:"dm-3", sender:"contact", text:"We have three high-priority fan messages to review.", time:"1h" }] }
  ];
  return save.social.conversations;
}

function socialSentimentTab(team) {
  const metrics = save.social.metrics;
  const sentiment = Math.round(metrics.sentiment);
  const label = sentiment >= 70 ? "Positive" : sentiment >= 45 ? "Mixed" : "Negative";
  const history = metrics.history.slice(-6).reverse();
  const positiveDriver=(metrics.drivers||[]).filter((item)=>Number(item.delta)>0).sort((a,b)=>b.delta-a.delta)[0],negativeDriver=(metrics.drivers||[]).filter((item)=>Number(item.delta)<0).sort((a,b)=>a.delta-b.delta)[0];
  return `<section class="social-media"><div class="social-sentiment-header"><strong>${escapeHtml(team.abbr)} Fan Sentiment: ${label}</strong><span>${sentiment}% positive</span></div><div class="social-sentiment-drivers"><article><b>+</b><div><strong>Top positive driver</strong><small>${escapeHtml(positiveDriver?.label||"No recent positive driver")}</small></div><em>${positiveDriver?`+${positiveDriver.delta}`:"—"}</em></article><article><b>−</b><div><strong>Top negative driver</strong><small>${escapeHtml(negativeDriver?.label||"No recent negative driver")}</small></div><em>${negativeDriver?.delta??"—"}</em></article></div>${history.length ? history.map((item) => `<article><b>${Math.round(Number(item.value) || 0)}</b><div><strong>${escapeHtml(item.label || item.reason || "Sentiment update")}</strong><small>${escapeHtml(item.detail || "Career event")}</small></div><em>${Number(item.delta)>0?"+":""}${escapeHtml(item.delta??"")} · ${escapeHtml(item.date || "")}</em></article>`).join("") : '<article><b>65</b><div><strong>Baseline fan confidence</strong><small>Future career events will be recorded here.</small></div><em>Current</em></article>'}</section>`;
}

function lockVerticalSliceControlStyles() {
  if (!document.body.classList.contains("game-ui-upgrade")) return;
  const setImportant = (element, styles) => Object.entries(styles).forEach(([property, value]) => element.style.setProperty(property, value, "important"));
  const base = {
    "border-color": "rgba(174, 194, 231, .42)",
    color: "#f4f7fc",
    "background-color": "#141f33",
    "background-image": "linear-gradient(180deg, #1a2941, #141f33)",
    "box-shadow": "none",
    opacity: "1"
  };
  const activeStyle = {
    "border-color": "color-mix(in srgb, var(--team-primary) 70%, #ffffff)",
    color: "var(--team-contrast, #ffffff)",
    "background-color": "var(--team-primary)",
    "background-image": "linear-gradient(180deg, color-mix(in srgb, var(--team-primary) 82%, #ffffff), var(--team-primary))",
    "box-shadow": "0 8px 18px color-mix(in srgb, var(--team-primary) 30%, transparent)",
    opacity: "1"
  };
  const disabledStyle = {
    "border-color": "rgba(147, 166, 201, .14)",
    color: "#5f6d85",
    "background-color": "#0a101d",
    "background-image": "none",
    "box-shadow": "none",
    opacity: ".62"
  };
  document.querySelectorAll(".simcast-coaching select, .simcast-coaching button, .simcast-controls button").forEach((control) => {
    const activeControl = control.classList.contains("active") || control.classList.contains("primary");
    setImportant(control, control.disabled ? disabledStyle : activeControl ? activeStyle : base);
    if (!control.disabled && control.matches('[data-simcast-coach="substitute"]')) setImportant(control, {
      "border-color": "rgba(92, 224, 155, .72)", color: "#ffffff", "background-color": "#146b45",
      "background-image": "linear-gradient(135deg, #1b8657, #105a3a)", "box-shadow": "0 8px 18px rgba(23, 122, 75, .25)"
    });
    if (!control.disabled && control.matches('[data-simcast-coach="timeout"]')) setImportant(control, {
      "border-color": "rgba(243, 179, 61, .58)", color: "#ffffff", "background-color": "#382a12",
      "background-image": "linear-gradient(180deg, #3a2c17, #1b1b22)", "box-shadow": "0 7px 16px rgba(0, 0, 0, .24)"
    });
    if (!control.disabled && control.matches('[data-simcast-preset]')) setImportant(control, {
      "border-color": "rgba(154, 124, 255, .45)", color: "#ffffff", "background-color": "#1a2238",
      "background-image": "linear-gradient(180deg, #202b47, #151e33)", "box-shadow": "inset 0 1px rgba(255, 255, 255, .04)"
    });
    if (!control.disabled && control.matches('[data-simcast-action="pause"]')) setImportant(control, {
      "border-color": "rgba(243, 179, 61, .58)", color: "#ffffff", "background-color": "#302614",
      "background-image": "linear-gradient(180deg, #3a2d18, #1b1b22)", "box-shadow": "0 7px 16px rgba(0, 0, 0, .22)"
    });
    if (!control.disabled && control.matches('[data-simcast-action="next-period"]')) setImportant(control, {
      "border-color": "rgba(79, 139, 255, .62)", color: "#ffffff", "background-color": "#17315b",
      "background-image": "linear-gradient(180deg, #21447a, #142a4c)", "box-shadow": "0 8px 18px rgba(36, 90, 180, .2)"
    });
    if (!control.disabled && control.matches('[data-simcast-action="finish"]')) setImportant(control, {
      "border-color": "rgba(255, 93, 108, .72)", color: "#ffffff", "background-color": "#7a1f3a",
      "background-image": "linear-gradient(135deg, #9a2948, #631a34)", "box-shadow": "0 8px 18px rgba(185, 35, 76, .24)"
    });
  });
}

function lockTradeControlStyles() {
  if (!document.body.classList.contains("game-ui-upgrade")) return;
  const setImportant = (element, styles) => Object.entries(styles).forEach(([property, value]) => element.style.setProperty(property, value, "important"));
  document.querySelectorAll(".multi-trade-asset select, .multi-trade-flow-block select").forEach((select) => setImportant(select, {
    "border-color": "rgba(93, 157, 255, .48)",
    color: "#dce9ff",
    "-webkit-text-fill-color": "#dce9ff",
    "background-color": "#111d31",
    "background-image": "linear-gradient(180deg, #1a2941, #111b2e)",
    "background-position": "0 0",
    "background-size": "100% 100%",
    "background-repeat": "no-repeat",
    "box-shadow": "inset 0 1px rgba(255,255,255,.06), 0 5px 10px rgba(0,0,0,.16)"
  }));
  document.querySelectorAll("#multi-trade-team-search").forEach((input) => setImportant(input, {
    color: "#f4f7fc",
    "-webkit-text-fill-color": "#f4f7fc",
    "background-color": "transparent",
    "background-image": "none",
    "box-shadow": "none"
  }));
  document.querySelectorAll(".multi-trade-picker-headshot, .multi-trade-player-headshot").forEach((image) => setImportant(image, {
    "border-color": "rgba(93, 157, 255, .52)",
    background: "radial-gradient(circle at 50% 28%, #385276, #1c2e4c 62%, #0d1829)",
    "box-shadow": "0 7px 14px rgba(0,0,0,.36), 0 0 0 3px rgba(93,157,255,.07), inset 0 1px rgba(255,255,255,.08)"
  }));
}

function safeSocialMediaUrl(value) {
  const url=String(value||"").trim();
  if(!url)return "";
  return /^(https?:\/\/|\.\/|assets\/)/i.test(url)?url:"";
}

function socialScheduleTab() {
  const scheduled=save.social.scheduledPosts.filter((item)=>item.status!=="cancelled"),pending=scheduled.filter((item)=>item.status!=="published"),suggestions=socialScheduleSuggestions();
  return `<section class="social-publish-schedule"><div class="social-schedule-header"><div><strong>Publish Schedule</strong><span>${pending.length} upcoming · ${scheduled.filter((item)=>item.status==="published").length} published</span></div><label><input type="checkbox" id="social-approval-toggle" ${save.automation.socialApproval?"checked":""}> Require approval before auto-publishing</label></div><section class="social-schedule-composer"><textarea id="social-schedule-text" maxlength="280" placeholder="Write a post to schedule" style="color:#edf4ff!important;background:#202c41!important;background-image:none!important;border:1px solid rgba(150,174,222,.24)!important"></textarea><div><select id="social-schedule-type" style="color:#edf4ff!important;background:#263550!important;background-image:none!important;border:1px solid rgba(150,174,222,.28)!important"><option value="team">Team update</option><option value="game">Game promotion</option><option value="injury">Injury update</option><option value="transaction">Transaction</option><option value="community">Community</option></select><input id="social-schedule-date" type="date" min="${escapeHtml(currentLeagueDate())}" value="${escapeHtml(currentLeagueDate())}" style="color:#edf4ff!important;background:#263550!important;background-image:none!important;border:1px solid rgba(150,174,222,.28)!important"><button data-social-schedule-create="true">Schedule post</button></div></section><section class="social-schedule-suggestions"><strong>Suggested opportunities</strong>${suggestions.map((item)=>`<button data-social-schedule-suggestion="true" data-suggestion-text="${escapeHtml(item.text)}" data-suggestion-date="${escapeHtml(item.date)}" data-suggestion-type="${escapeHtml(item.type)}"><span>${escapeHtml(item.label)}</span><small>${escapeHtml(item.date)}</small></button>`).join("")||'<div class="muted-line">No upcoming opportunities.</div>'}</section><div class="social-schedule-list">${scheduled.length?scheduled.slice().sort((a,b)=>String(a.publishAt).localeCompare(String(b.publishAt))).map((item)=>`<article class="${escapeHtml(item.status||"scheduled")}"><b><span>${escapeHtml(String(item.publishAt||"TBD").slice(5,7))}</span>${escapeHtml(String(item.publishAt||"--").slice(8,10))}</b><div><strong>${escapeHtml(item.type||"Scheduled post")}</strong><small>${escapeHtml(item.text)}</small><em>${escapeHtml(item.status||"scheduled")}</em></div>${item.status==="published"?'<span>Published</span>':`<div class="social-schedule-actions"><button data-social-schedule-publish="${escapeHtml(item.id)}">Publish now</button><button data-social-schedule-edit="${escapeHtml(item.id)}">Edit</button><button data-social-schedule-cancel="${escapeHtml(item.id)}">Cancel</button></div>`}</article>`).join(""):'<div class="muted-line">No posts scheduled yet.</div>'}</div></section>`;
}

function socialScheduleSuggestions() {
  const team=activeTeam(),suggestions=[];
  (save.schedule||[]).filter((game)=>!game.played&&(game.home===team.id||game.away===team.id)).slice(0,3).forEach((game)=>{const opponent=getTeam(game.home===team.id?game.away:game.home);suggestions.push({label:`Game day vs ${opponent?.abbr||"TBD"}`,date:game.date,type:"game",text:`Game day. ${team.abbr} ${game.home===team.id?"hosts":"visits"} ${opponent?.abbr||"the opposition"}.`});});
  teamPlayers(team.id).filter((player)=>player.injury>0).slice(0,2).forEach((player)=>suggestions.push({label:`Injury update: ${player.name}`,date:currentLeagueDate(),type:"injury",text:`Medical update: ${player.name} remains unavailable and will continue to be evaluated.`}));
  return suggestions;
}

function dashboardReferencePage() {
  const selectedTeam = activeTeam();
  const players = teamPlayers(selectedTeam.id);
  const upcomingItems = dashboardUpcomingItems(selectedTeam).slice(0, 4);
  const recentGames = save.results.slice(-8);
  const nextGame = (save.schedule || []).find((game) => !game.played);
  const nextOpponent = nextGame ? getTeam(nextGame.home === selectedTeam.id ? nextGame.away : nextGame.home) : null;
  const rating = teamRating(selectedTeam);
  const offensiveRating = (105 + (rating - 75) * .65).toFixed(1);
  const defensiveRating = (116 - (rating - 75) * .42).toFixed(1);
  const netRating = (Number(offensiveRating) - Number(defensiveRating)).toFixed(1);
  const rosterRules = rosterRuleStatus(selectedTeam.id);
  const nextDeadline = nextTransactionEvent();
  const deadlineDays = nextDeadline ? Math.max(0, Math.ceil((new Date(`${nextDeadline.date}T00:00:00`) - new Date(`${currentLeagueDate()}T00:00:00`)) / 86400000)) : 0;
  const transactionState = transactionRuleState();
  const needs = rosterNeeds(selectedTeam);
  const last = save.results.at(-1);
  const inbox = frontOfficeInbox(selectedTeam, last);
  const playerLines = players.map((player) => ({ player, stats: playerSeasonStats(player.id) }));
  const leader = (field) => [...playerLines].sort((a, b) => Number(b.stats[field] || 0) - Number(a.stats[field] || 0) || b.player.ovr - a.player.ovr)[0];
  const scoringLeader = leader("points");
  const reboundLeader = leader("rebounds");
  const assistLeader = leader("assists");
  const teamPoints = recentGames.map((game) => game.home === selectedTeam.id ? game.homeScore : game.awayScore);
  const averagePoints = teamPoints.length ? Math.round(teamPoints.reduce((sum, points) => sum + points, 0) / teamPoints.length) : 0;
  const recentFive = teamPoints.slice(-5);
  const earlierGames = teamPoints.slice(0, Math.max(0, teamPoints.length - recentFive.length));
  const recentFiveAverage = recentFive.length ? recentFive.reduce((sum, points) => sum + points, 0) / recentFive.length : Number(offensiveRating);
  const earlierAverage = earlierGames.length ? earlierGames.reduce((sum, points) => sum + points, 0) / earlierGames.length : Number(offensiveRating);
  const offenseTrend = recentFiveAverage - earlierAverage;
  const recentWins = recentGames.filter((game) => teamWonResult(selectedTeam.id, game)).length;
  return `
    <section class="reference-dashboard dashboard-test-page">
      <h1 class="reference-page-title">DASHBOARD</h1>

      <section class="reference-season-hero panel-card selected-card vertical-slice-hero phase6-card phase6-card--hero">
        <div class="team-hero-identity"><div><span>${save.season}-${String(save.season + 1).slice(-2)} REGULAR SEASON &middot; ${escapeHtml(save.phase)}</span><h2>${escapeHtml(selectedTeam.city)} ${escapeHtml(selectedTeam.name)}${teamLogo(selectedTeam, "reference-title-logo")}</h2><p><strong class="team-record-${selectedTeam.wins > selectedTeam.losses ? "winning" : selectedTeam.wins < selectedTeam.losses ? "losing" : "even"}">${selectedTeam.wins}-${selectedTeam.losses}</strong> ${escapeHtml(selectedTeam.conf)} Conference <b>${selectedTeam.wins >= selectedTeam.losses ? "PLAYOFF HUNT" : "BUILDING"}</b></p></div></div>${teamLogo(selectedTeam, "reference-hero-watermark")}
        ${nextGame && nextOpponent ? `<div class="dashboard-next-matchup"><span>NEXT MATCHUP · ${formatShortDate(nextGame.date)}</span><div>${teamLogo(selectedTeam, "dashboard-matchup-logo")}<b>${escapeHtml(selectedTeam.abbr)}</b><i>${nextGame.home === selectedTeam.id ? "VS" : "AT"}</i><b>${escapeHtml(nextOpponent.abbr)}</b>${teamLogo(nextOpponent, "dashboard-matchup-logo")}</div><small>${nextGame.home === selectedTeam.id ? "HOME" : "AWAY"} · ${escapeHtml(nextOpponent.city)} ${escapeHtml(nextOpponent.name)}</small></div>` : '<div class="dashboard-next-matchup"><span>SEASON STATUS</span><b>COMPLETE</b></div>'}
        <div><button class="btn reference-primary phase6-button primary" data-action="go-games"><i>▶</i><span>SIM NEXT<small>1 GAME</small></span><b>›</b></button><button class="btn reference-week-button phase6-button" data-sim-control="week"><i>»</i><span>SIM WEEK<small>7 DAYS</small></span><b>›</b></button></div>
      </section>

      <section class="reference-stat-grid">
        <article class="metric-card metric-card--blue featured dashboard-metric dashboard-metric--offense phase6-card"><span class="metric-label">OFFENSIVE RTG</span><strong class="metric-value">${offensiveRating}</strong><small class="metric-subtitle">${Number(offensiveRating) >= 110 ? "EST. TOP-12 NBA" : "DEVELOPING"}</small><em class="metric-trend ${offenseTrend >= 0 ? "positive" : "negative"}">${offenseTrend >= 0 ? "+" : ""}${offenseTrend.toFixed(1)} over last five</em></article>
        <article class="metric-card metric-card--blue dashboard-metric dashboard-metric--defense phase6-card"><span class="metric-label">DEFENSIVE RTG</span><strong class="metric-value">${defensiveRating}</strong><small class="metric-subtitle">${Number(defensiveRating) <= 110 ? "TOP LEAGUE DEFENSE" : "ROOM TO IMPROVE"}</small><em class="metric-trend ${Number(defensiveRating) <= 110 ? "positive" : "warning"}">${Number(defensiveRating) <= 110 ? "Holding below target" : "Above 110 target"}</em></article>
        <article class="metric-card metric-card--blue dashboard-metric dashboard-metric--net phase6-card"><span class="metric-label">NET RATING</span><strong class="metric-value">${Number(netRating) >= 0 ? "+" : ""}${netRating}</strong><small class="metric-subtitle">${selectedTeam.conf} CONFERENCE</small><em class="metric-trend ${Number(netRating) >= 0 ? "positive" : "negative"}">${Number(netRating) >= 0 ? "Winning profile" : "Negative margin"}</em></article>
        <article class="dashboard-metric dashboard-metric--cap phase6-card"><span>CAP USED</span><strong>$${selectedTeam.payroll}M</strong><small>${escapeHtml(payrollStatus(selectedTeam))} · ${rosterRules.standard}/15</small><em class="metric-trend ${Number(selectedTeam.payroll) <= 175 ? "positive" : "negative"}">${Number(selectedTeam.payroll) <= 175 ? "Flexible position" : "Tax pressure"}</em></article>
      </section>

      <section class="reference-analytics-grid">
        <article class="reference-chart-panel panel-card phase6-card phase6-card--accent">
          <header><div><strong>LAST 8 GAMES</strong><small>${recentGames.length ? `${recentWins}-${recentGames.length - recentWins} RECENT FORM` : "SEASON START"}</small></div><span>AVG <b>${averagePoints || "--"}</b> PTS</span></header>
          <div class="reference-chart-scale"><span>135</span><span>118</span><span>101</span><span>84</span></div>
          <div class="reference-bars">${Array.from({ length: 8 }, (_, index) => { const game = recentGames[index]; const points = teamPoints[index] || 0; const height = points ? Math.max(18, Math.min(96, (points / 140) * 100)) : 5; const won = game ? teamWonResult(selectedTeam.id, game) : false; const opponent = game ? getTeam(game.home === selectedTeam.id ? game.away : game.home) : null; return `<div class="${game ? won ? "win" : "loss" : "future"}"><i style="height:${height}%" class="${points ? "" : "empty"}"></i><span>${game ? won ? "W" : "L" : `G${index + 1}`}</span><b>${points || "—"}</b><small>${opponent ? teamLogo(opponent, "recent-opponent-logo") : ""}</small></div>`; }).join("")}</div>
        </article>
        <article class="reference-leaders-panel panel-card data-table phase6-card phase6-card--accent">
          <header>TEAM LEADERS</header>
          ${[["PTS", scoringLeader, "points"], ["REB", reboundLeader, "rebounds"], ["AST", assistLeader, "assists"]].map(([label, item, field], index) => `<button class="dashboard-leader-row leader-${field}" data-view-player="${item.player.id}"><i>0${index + 1}</i>${playerHeadshot(item.player, "dashboard-leader-headshot")}<span>${label}<strong>${escapeHtml(item.player.name)}</strong><small>${escapeHtml(item.player.pos)} · ${item.player.ovr} OVR · VIEW PROFILE</small></span><b>${statPerGame(item.stats[field], item.stats.games)}<small>PER GAME</small></b></button>`).join("")}
        </article>
      </section>

      <section class="reference-upcoming panel-card phase6-card phase6-card--accent">
        <header>UPCOMING</header>
        <div>${upcomingItems.map(renderDashboardUpcomingCard).join("") || '<p>No upcoming games or league events remain.</p>'}</div>
      </section>

      <h2 class="reference-section-title">COMMAND CENTER</h2>
      <section class="reference-management-grid command-center-cards">
        <article class="action-card command-card command-card--career"><header><span>GM CAREER</span><strong>FRANCHISE STATUS</strong></header><div class="command-approval"><span>OWNER APPROVAL</span><strong>${save.gmCareer?.approval || 60}%</strong><i><b style="width:${save.gmCareer?.approval || 60}%"></b></i></div><div class="career-stat-grid">${commandStat("Seasons", save.gmCareer?.seasons || 0)}${commandStat("Playoff Trips", save.gmCareer?.playoffTrips || 0)}${commandStat("Championships", save.gmCareer?.titles || 0)}</div><div class="command-status good"><span>LEAGUE COMPLIANCE</span><strong>${leagueComplianceCount(save.season)}/30 LEGAL</strong></div></article>
        <article class="action-card command-card--coaching"><header><span>COACHING STAFF</span><strong>${escapeHtml(coachingProfile(selectedTeam.id).name || "Head Coach")}</strong></header><div class="coach-identity"><span>IDENTITY</span><strong>${escapeHtml(coachingProfile(selectedTeam.id).style)}</strong></div>${commandRating("Tactics", coachingProfile(selectedTeam.id).tactics)}${commandRating("Development", coachingProfile(selectedTeam.id).development)}${commandRating("Medical", coachingProfile(selectedTeam.id).medical)}<button class="btn staff-market-button" data-action="open-staff-market">VIEW STAFF MARKET</button></article>
        <article class="action-card danger-accent command-card command-card--roster"><header><span>ROSTER NEEDS</span><strong>TEAM BUILDING</strong></header><div class="roster-command-grid"><div class="good">${playerHeadshot(needs.best, "roster-command-headshot")}<span>BEST PLAYER</span><strong>${escapeHtml(needs.best.name)}</strong><b>${needs.best.ovr} OVR</b></div><div class="urgent"><i>!</i><span>WEAKEST GROUP</span><strong>${escapeHtml(needs.weakest)}</strong><b>PRIORITY</b></div><div class="info">${playerHeadshot(needs.potential, "roster-command-headshot")}<span>HIGHEST POTENTIAL</span><strong>${escapeHtml(needs.potential.name)}</strong><b>${needs.potential.pot} POT</b></div><div class="warning">${playerHeadshot(needs.oldest, "roster-command-headshot")}<span>AGE RISK</span><strong>${escapeHtml(needs.oldest.name)}</strong><b>AGE ${needs.oldest.age}</b></div></div></article>
        <article class="command-card--operations"><header><span>LEAGUE OPERATIONS</span><strong>${nextDeadline ? escapeHtml(nextDeadline.label) : "YEAR COMPLETE"}</strong></header><section class="operations-deadline"><div><strong>${nextDeadline ? deadlineDays : "—"}</strong><span>${nextDeadline ? "DAYS REMAINING" : "SEASON COMPLETE"}</span></div><p><b>${nextDeadline ? formatShortDate(nextDeadline.date) : "DONE"}</b>${nextDeadline ? escapeHtml(nextDeadline.description) : "No remaining transaction deadlines."}</p></section><div class="operations-progress"><span>LEAGUE CALENDAR</span><i><b style="width:${nextDeadline ? Math.max(8, Math.min(92, 100 - deadlineDays / 2)) : 100}%"></b></i><small>${nextDeadline ? "Next mandatory league checkpoint" : "All checkpoints complete"}</small></div><div class="reference-rules">${rulePill("Trades", transactionState.tradesOpen ? "Open" : "Closed", transactionState.tradesOpen)}${rulePill("10-Day", transactionState.tenDayContracts ? "Allowed" : "Locked", transactionState.tenDayContracts)}${rulePill("Roster", rosterRules.valid ? "Legal" : "Illegal", rosterRules.valid)}</div></article>
        <article class="action-card reference-inbox-card data-table"><header><span>FRONT OFFICE</span><strong>INBOX</strong></header><div>${inbox.map((message, index) => { const tone = /need|roster/i.test(message) ? "roster" : /cap|tax/i.test(message) ? "cap" : /deadline|eligible/i.test(message) ? "deadline" : /goal|complete/i.test(message) ? "goal" : "result"; const label = tone === "roster" ? "ROSTER" : tone === "cap" ? "CAP" : tone === "deadline" ? "DEADLINE" : tone === "goal" ? "GOAL" : "RESULT"; const icon = tone === "roster" ? "R" : tone === "cap" ? "$" : tone === "deadline" ? "!" : tone === "goal" ? "✓" : "W"; return `<p class="inbox-${tone}"><i>${icon}</i><b>${label}</b><span>${escapeHtml(message)}<small>${index === 0 ? "LATEST UPDATE" : `${index + 1} ITEMS AGO`}</small></span></p>`; }).join("")}</div></article>
        <article class="action-card reference-news-card data-table"><header><span>LEAGUE</span><strong>NEWS WIRE</strong></header><div>${(save.transactionLog || []).slice(-5).reverse().map((item, index) => { const type = String(item.type || "NEWS"); const tone = /injury|medical/i.test(`${type} ${item.text}`) ? "injury" : /extension|sign|trade|waive|transaction/i.test(`${type} ${item.text}`) ? "transaction" : "league"; return `<p class="news-${tone}"><i>${tone === "injury" ? "+" : tone === "transaction" ? "↔" : "N"}</i><b>${escapeHtml(type)}</b><span>${escapeHtml(item.text)}<small>${item.date ? formatShortDate(item.date) : index === 0 ? "LATEST UPDATE" : "LEAGUE WIRE"}</small></span></p>`; }).join("") || '<p class="news-league"><i>N</i><b>NEWS</b><span>League activity will appear here.</span></p>'}</div></article>
      </section>
      ${staffMarketPanel()}
    </section>
  `;
}

function dashboardUpcomingItems(selectedTeam) {
  const today = currentLeagueDate();
  const games = save.schedule
    .filter((game) => !game.played)
    .map((game) => {
      const opponentId = game.home === selectedTeam.id ? game.away : game.home;
      const opponent = getTeam(opponentId);
      return {
        type: "game",
        date: game.date,
        team: selectedTeam,
        opponent,
        venue: game.home === selectedTeam.id ? "vs" : "@",
        label: `${game.home === selectedTeam.id ? "vs" : "@"} ${opponent?.abbr || "TBD"}`,
        detail: game.home === selectedTeam.id ? "Home game" : "Away game",
        action: "go-games"
      };
    });
  const allStarEvents = (save.seasonEvents || [])
    .filter((event) => !event.played && event.date >= today)
    .map((event) => ({
      type: "event",
      eventType: "all-star",
      date: event.date,
      label: event.shortLabel || event.label,
      detail: event.description || "All-Star Weekend event",
      action: "go-games"
    }));
  const transactionEvents = (save.transactionEvents || [])
    .filter((event) => event.date >= today)
    .map((event) => ({
      type: "event",
      eventType: event.type === "trade-deadline" ? "deadline" : "transaction",
      date: event.date,
      label: event.shortLabel || event.label,
      detail: event.description || event.impact || "League transaction event",
      action: "go-transactions"
    }));
  const events = [...allStarEvents, ...transactionEvents].sort((a, b) => a.date.localeCompare(b.date));
  const mixed = [...games.slice(0, 2), ...events.slice(0, 2)].sort((a, b) => a.date.localeCompare(b.date));
  const fill = [...games.slice(2), ...events.slice(2)].sort((a, b) => a.date.localeCompare(b.date));
  return [...mixed, ...fill];
}

function renderDashboardUpcomingCard(item) {
  if (item.type === "game") {
    const home = item.venue === "vs";
    const teamAbbr = escapeHtml(item.team?.abbr || "USER");
    const opponentAbbr = escapeHtml(item.opponent?.abbr || "TBD");
    const opponentPlace = escapeHtml(item.opponent?.city || item.opponent?.name || opponentAbbr);
    return `<button class="upcoming-card upcoming-game-card" data-action="${item.action}"><span class="upcoming-card-topline">${formatShortDate(item.date)}<b>${home ? "HOME" : "AWAY"}</b></span><span class="upcoming-matchup"><span><b>${teamAbbr}</b>${teamLogo(item.team, "upcoming-team-logo")}<small>${item.team?.wins || 0}-${item.team?.losses || 0}</small></span><i>${home ? "VS" : "AT"}</i><span><b>${opponentAbbr}</b>${teamLogo(item.opponent, "upcoming-team-logo")}<small>${item.opponent?.wins || 0}-${item.opponent?.losses || 0}</small></span></span><strong class="upcoming-matchup-label">${teamAbbr} ${home ? "vs" : "at"} ${opponentAbbr}</strong><small class="upcoming-card-detail">${home ? "Home" : "Away"} &middot; ${opponentPlace}</small><em>OPEN MATCHUP &rarr;</em></button>`;
  }

  const badge =
    item.eventType === "all-star"
      ? "NBA · ALL-STAR"
      : item.eventType === "deadline"
        ? "NBA · DEADLINE"
        : "NBA · LEAGUE";

 return `<button class="upcoming-card upcoming-event-card upcoming-event-${escapeHtml(item.eventType)}${/extension/i.test(item.label) ? " upcoming-extension-card" : ""}" data-action="${item.action}"><span class="upcoming-card-topline">${formatShortDate(item.date)}<b>${escapeHtml(badge)}</b></span><span class="upcoming-event-summary"><span class="upcoming-event-copy"><strong>${escapeHtml(item.label)}</strong><small class="upcoming-card-detail">${escapeHtml(item.detail)}</small></span></span>${item.eventType === "deadline" ? "<em>REVIEW DEADLINE &rarr;</em>" : item.eventType === "all-star" ? "<em>VIEW EVENT &rarr;</em>" : ""}</button>`;
}

function staffMarketPanel() {
  const budget = save.gmCareer?.finances?.staffBudget || 18;
  const candidates = (save.staffMarket || []).filter((staff) => staff.available).slice(0, 4);
  return `<section class="card wide-card staff-market command-staff-market"><div class="staff-market-head"><div><div class="card-label">staff market</div><div class="player-name">Specialists Available</div><div class="meta">Annual staff budget: $${budget.toFixed(1)}M</div></div><div class="staff-market-summary"><strong>${candidates.length}</strong><span>AVAILABLE</span></div></div><div class="staff-grid">${candidates.map((staff) => { const affordable = Number(staff.salary) <= budget; const fit = staff.rating >= 85 ? "ELITE" : staff.rating >= 75 ? "STRONG" : "SOLID"; return `<div class="staff-card upgraded-staff-card"><header><span>${escapeHtml(staff.specialty)}</span><b>${fit}</b></header><div class="staff-candidate-main"><div class="staff-rating-ring"><strong>${staff.rating}</strong><small>OVR</small></div><div><strong>${escapeHtml(staff.name)}</strong><span>$${staff.salary}M ANNUAL</span><small>${affordable ? "WITHIN BUDGET" : "OVER BUDGET"}</small></div></div><div class="staff-rating-bar"><i><b style="width:${staff.rating}%"></b></i><span>${staff.rating >= 80 ? "HIGH IMPACT" : "DEVELOPMENT VALUE"}</span></div><button class="btn staff-hire-button reference-week-button${affordable ? "" : " staff-hire-unavailable"}" data-hire-staff="${staff.id}" ${affordable ? "" : 'aria-disabled="true"'}>${affordable ? `HIRE ${escapeHtml(staff.specialty)}` : "OVER BUDGET"}</button></div>`; }).join("") || '<div class="muted-line">No staff candidates are currently available.</div>'}</div></section>`;
}

function legacyStaffPage() {
  const team = activeTeam();
  const coach = coachingProfile(save.activeTeamId);
  const scouting = scoutingDepartment(save.activeTeamId);
  const budget = Number(save.gmCareer?.finances?.staffBudget || 0);
  const available = (save.staffMarket || []).filter((staff) => staff.available).sort((a, b) => b.rating - a.rating);
  const hired = (save.staffMarket || []).filter((staff) => !staff.available);
  const departments = [
    ["Tactics", coach.tactics, "Game planning, matchup preparation, and tactical execution."],
    ["Development", coach.development, "Player progression, training quality, and prospect growth."],
    ["Medical", coach.medical, "Injury prevention, recovery time, and player availability."],
    ["Scouting", Math.round((scouting.college + scouting.analytics) / 2), "Draft evaluation, analytics, and confidence in player reports."]
  ];
  return `
    <h1 class="page-title">staff</h1>
    <section class="staff-page-hero card">
      <div class="team-hero-identity">${teamLogo(team, "page-hero-logo")}<div><span>BASKETBALL OPERATIONS</span><strong>${escapeHtml(team.city)} Staff Directory</strong><p>Build the departments that shape game preparation, player growth, health, and talent evaluation.</p></div></div>
      <div class="staff-budget"><span>AVAILABLE BUDGET</span><b>$${budget.toFixed(1)}M</b><small>Annual specialist budget</small></div>
    </section>
    <section class="staff-current-grid">
      <article class="card staff-head-coach"><span>HEAD COACH</span><strong>${escapeHtml(coach.name || "Head Coach")}</strong><small>${escapeHtml(coach.style)} identity · ${coach.contractYears || 1} years remaining</small><div>${staffRatingMeter("Tactics", coach.tactics)}${staffRatingMeter("Development", coach.development)}${staffRatingMeter("Medical", coach.medical)}</div></article>
      ${departments.map(([name, rating, description]) => staffDepartmentCard(name, rating, description)).join("")}
    </section>
    ${hired.length ? `<section class="card staff-hires"><header><div><span>RECENT APPOINTMENTS</span><strong>HIRED SPECIALISTS</strong></div><small>${hired.length} staff added</small></header><div>${hired.map((staff) => `<article><span>${escapeHtml(staff.specialty)}</span><strong>${escapeHtml(staff.name)}</strong><small>${staff.rating} rating · $${Number(staff.salary).toFixed(1)}M</small></article>`).join("")}</div></section>` : ""}
    <section class="card staff-candidate-board">
      <header><div><span>STAFF MARKET</span><strong>AVAILABLE SPECIALISTS</strong></div><small>${available.length} candidates</small></header>
      <div class="staff-candidate-grid">${available.map((staff) => staffCandidateCard(staff, budget)).join("") || '<div class="muted-line">No staff candidates are currently available.</div>'}</div>
    </section>`;
}

function staffRatingMeter(label, rating) {
  return `<div class="staff-rating-meter"><span>${escapeHtml(label)}</span><i><b style="width:${Math.max(0, Math.min(100, rating))}%"></b></i><strong>${rating}</strong></div>`;
}

function staffDepartmentCard(name, rating, description) {
  const grade = rating >= 88 ? "ELITE" : rating >= 80 ? "STRONG" : rating >= 72 ? "SOLID" : "DEVELOPING";
  return `<article class="card staff-department"><header><span>${escapeHtml(name)}</span><b>${rating}</b></header><strong>${grade}</strong><p>${escapeHtml(description)}</p><i><b style="width:${Math.max(0, Math.min(100, rating))}%"></b></i></article>`;
}

function staffCandidateCard(staff, budget) {
  const affordable = Number(staff.salary) <= budget;
  return `<article class="staff-candidate"><div class="staff-candidate-mark">${escapeHtml(staff.specialty.slice(0, 2).toUpperCase())}</div><div><span>${escapeHtml(staff.specialty)}</span><strong>${escapeHtml(staff.name)}</strong><small>${staff.rating} rating · $${Number(staff.salary).toFixed(1)}M</small></div><button class="btn staff-hire-button reference-week-button" data-hire-staff="${staff.id}" ${affordable ? "" : "disabled"}>${affordable ? "Hire" : "Over Budget"}</button></article>`;
}

function staffPage() {
  const coach = coachingProfile(save.activeTeamId);
  const scouting = scoutingDepartment(save.activeTeamId);
  const budget = Number(save.gmCareer?.finances?.staffBudget || 0);
  const available = (save.staffMarket || []).filter((staff) => staff.available).sort((a, b) => b.rating - a.rating);
  const hired = (save.staffMarket || []).filter((staff) => !staff.available);
  const staffRows = staffDirectoryRows(coach, scouting, hired, available);
  const totalSlots = 25;
  const payroll = staffRows.reduce((sum, row) => sum + Number(row.salary || 0), 0);
  const totalStaffPool = payroll + budget;
  const overallRating = Math.round(staffRows.reduce((sum, row) => sum + Number(row.rating || 0), 0) / Math.max(1, staffRows.length));
  const breakdown = staffBreakdownRows(staffRows);
  return `
    <h1 class="page-title staff-page-title">staff</h1>
    <section class="staff-dashboard-summary">
      ${staffMetricCard("people", "Staff Total", `${staffRows.length} / ${totalSlots}`, "Rostered / Total Slots", staffRows.length / totalSlots * 100, "blue")}
      ${staffMetricCard("star", "Staff Rating", overallRating, "Overall Rating", overallRating, "green")}
      ${staffMetricCard("money", "Total Salary", `$${payroll.toFixed(1)}M`, "Annual Payroll", Math.min(100, payroll / Math.max(1, payroll + budget) * 100), "red")}
      ${staffMetricCard("budget", "Budget", `$${budget.toFixed(1)}M`, "Remaining Funds", Math.min(100, budget / Math.max(1, totalStaffPool) * 100), "blue")}
      ${staffMetricCard("open", "Open Positions", available.length, "View Openings", Math.min(100, available.length / Math.max(1, available.length + staffRows.length) * 100), "blue")}
    </section>
    <section class="staff-office-layout">
      <section class="card staff-list-panel">
        <header><strong>Staff List</strong><div class="staff-list-controls"><select><option>All Departments</option></select><select><option>All Positions</option></select><label><input placeholder="Search staff"><span>⌕</span></label></div></header>
        <div class="staff-list-head"><span>Staff Member</span><span>Position</span><span>OVR</span><span>Salary</span><span>Years Left</span><span>Status</span><span></span></div>
        <div class="staff-list-body">${staffRows.map(staffDirectoryRow).join("")}</div>
        <footer><button class="mini-action">View All Staff</button></footer>
      </section>
      <aside class="staff-side-panels">
        <section class="card staff-breakdown-panel"><header>Staff Breakdown</header>${breakdown.map(staffBreakdownRow).join("")}<footer><span>Total</span><strong>${staffRows.length} / ${totalSlots}</strong></footer></section>
        <section class="card staff-openings-panel"><header>Open Positions</header>${available.slice(0, 5).map((staff) => staffOpeningRow(staff, budget)).join("") || '<div class="muted-line">No open positions.</div>'}<footer><button class="mini-action">View All Openings</button></footer></section>
      </aside>
    </section>`;
}

function staffMetricCard(icon, label, value, subtitle, percent, tone) {
  const iconText = icon === "people" ? "ST" : icon === "star" ? "*" : icon === "money" || icon === "budget" ? "$" : "OP";
  return `<article class="card staff-metric-card ${tone}">
    <div class="staff-metric-icon">${escapeHtml(iconText)}</div>
    <div><span>${escapeHtml(label)}</span><strong>${value}</strong><small>${escapeHtml(subtitle)}</small></div>
    <i><b style="width:${Math.max(0, Math.min(100, percent))}%"></b></i>
  </article>`;
}

function staffDirectoryRows(coach, scouting, hired, available = []) {
  const rows = [
    { name: coach.name || "Head Coach", title: "Head Coach", department: "Coaching", role: "Head Coach", rating: coach.tactics, salary: Number(coach.salary || 4.8), years: coach.contractYears || 3, status: "Active", detail: `Offense: ${staffGrade(coach.tactics)}    Defense: ${staffGrade(coach.adaptability || coach.tactics)}` },
    { name: "Lead Assistant", title: "Assistant Coach", department: "Coaching", role: "Assistant Coach", rating: Math.round((coach.tactics + (coach.adaptability || coach.tactics)) / 2), salary: 1.8, years: 2, status: "Active", detail: `Offense: ${staffGrade(coach.tactics)}    Defense: ${staffGrade(coach.adaptability || coach.tactics)}` },
    { name: "Player Development Lead", title: "Player Dev. Coach", department: "Player Development", role: "Player Dev. Coach", rating: coach.development, salary: 1.2, years: 3, status: "Active", detail: `Development: ${staffGrade(coach.development)}` },
    { name: "Sports Medicine Lead", title: "Sports Medicine", department: "Medical", role: "Sports Medicine", rating: coach.medical, salary: 1.1, years: 2, status: "Active", detail: `Health: ${staffGrade(coach.medical)}    Rehab: ${staffGrade(coach.medical - 2)}` },
    { name: "Director of Scouting", title: "Director of Scouting", department: "Scouting", role: "Scouting", rating: Math.round((scouting.college + scouting.international + scouting.analytics) / 3), salary: Number(scouting.budget || 4.5), years: 3, status: "Active", detail: `College: ${staffGrade(scouting.college)}    Analytics: ${staffGrade(scouting.analytics)}` }
  ];
  [...hired, ...available].slice(0, 10).forEach((staff) => rows.push({
    name: staff.name,
    title: staff.specialty,
    department: staff.specialty,
    role: `${staff.specialty} Specialist`,
    rating: staff.rating,
    salary: staff.salary,
    years: staff.available ? 1 : 1,
    status: staff.available ? "Available" : "Active",
    detail: `${staff.specialty}: ${staffGrade(staff.rating)}`
  }));
  return rows;
}

function staffGrade(rating) {
  const value = Number(rating || 0);
  if (value >= 90) return "A+";
  if (value >= 85) return "A";
  if (value >= 80) return "A-";
  if (value >= 76) return "B+";
  if (value >= 72) return "B";
  if (value >= 68) return "B-";
  return "C+";
}

function staffInitials(name) {
  return String(name || "ST").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "ST";
}

function staffDirectoryRow(row) {
  return `<article class="staff-list-row">
    <div class="staff-member-cell"><span class="staff-avatar">${escapeHtml(staffInitials(row.name))}</span><div><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.title)}<br>${escapeHtml(row.detail)}</small></div></div>
    <span>${escapeHtml(row.role)}</span>
    <b class="staff-rating-badge">${Math.round(row.rating)}</b>
    <span>$${Number(row.salary || 0).toFixed(1)}M</span>
    <span>${row.years}</span>
    <strong class="ok">${escapeHtml(row.status)}</strong>
    <button class="staff-row-menu">⋮</button>
  </article>`;
}

function staffBreakdownRows(rows) {
  const targets = { Coaching: 11, Scouting: 4, "Player Development": 3, Medical: 3, Analytics: 1 };
  const counts = { Coaching: 0, Scouting: 0, "Player Development": 0, Medical: 0, Analytics: 0 };
  rows.forEach((row) => {
    const key = row.department === "Development" ? "Player Development" : row.department;
    if (counts[key] !== undefined) counts[key] += 1;
    else if (String(key).toLowerCase().includes("analytic")) counts.Analytics += 1;
  });
  return Object.entries(targets).map(([label, total]) => ({ label, count: counts[label] || 0, total }));
}

function staffBreakdownRow(row) {
  return `<div class="staff-breakdown-row"><span>${escapeHtml(row.label)}</span><strong>${row.count} / ${row.total}</strong></div>`;
}

function staffOpeningRow(staff, budget) {
  const affordable = Number(staff.salary) <= budget;
  return `<article class="staff-opening-row"><div><strong>${escapeHtml(staff.specialty)} ${staff.rating >= 82 ? "Lead" : "Assistant"}</strong><small>${escapeHtml(staff.specialty)}</small></div><button class="btn staff-hire-button reference-week-button" data-hire-staff="${staff.id}" ${affordable ? "" : "disabled"}>${affordable ? "Hire" : "Over Budget"}</button></article>`;
}

function financesPage() {
  const team = activeTeam();
  const finances = save.gmCareer.finances;
  const levels = cbaThresholds(save.season);
  const taxBill = estimatedLuxuryTax(team.payroll, levels.tax);
  const capSpace = roundMoney(levels.cap - team.payroll);
  const ownerTrust = Math.max(35, Math.min(96, Math.round((save.gmCareer.approval || 60) * .65 + Number(finances.attendance || 82) * .35)));
  const commitments = Array.from({ length: 4 }, (_, index) => {
    const season = save.season + index;
    return { season, payroll: projectedPayroll(team.id, season), players: teamPlayers(team.id).filter((player) => Number(player.contract?.salaries?.[season] || 0) > 0).length };
  });
  const contracts = teamPlayers(team.id).sort((a, b) => contractSalary(b) - contractSalary(a));
  const expiring = contracts.filter((player) => contractYearsRemaining(player) <= 1).slice(0, 2);
  const extensionCandidates = contracts.filter((player) => canExtendContract(player)).slice(0, 2);
  const maxPayroll = Math.max(...commitments.map((item) => item.payroll), levels.secondApron);
  const futureFlex = capFlex(team).includes("flexibility") ? "B-" : capFlex(team).includes("tax") ? "C+" : "D+";
  return `
    <section class="finance-dashboard">
      <header class="finance-page-header"><div><h1>FINANCES</h1><p>Manage payroll, cap space, contracts, and long-term flexibility.</p></div><div><label class="finance-header-policy"><span>Luxury-Tax Tolerance</span><select id="finance-tax-tolerance"><option value="conservative" ${finances.taxTolerance === "conservative" ? "selected" : ""}>Conservative</option><option value="moderate" ${finances.taxTolerance === "moderate" ? "selected" : ""}>Moderate</option><option value="aggressive" ${finances.taxTolerance === "aggressive" ? "selected" : ""}>Aggressive</option></select></label><button class="btn primary">Cap Advisor</button><button class="btn">Contracts</button></div></header>
      <section class="finance-top-metrics">
        ${financeMetricCard("Team Payroll", `$${team.payroll.toFixed(1)}M`, `${Math.round(team.payroll / levels.cap * 100)}% of Salary Cap`, "From last month", team.payroll / levels.secondApron * 100, "blue")}
        ${financeMetricCard("Cap Space (Below Cap)", `$${capSpace.toFixed(1)}M`, `${Math.round(Math.abs(capSpace) / levels.cap * 100)}% of Salary Cap`, "From last month", Math.max(4, Math.min(100, Math.abs(capSpace) / levels.cap * 100)), capSpace >= 0 ? "green" : "red")}
        ${financeMetricCard("Tax Bill (Projected)", `$${taxBill.toFixed(1)}M`, team.payroll > levels.firstApron ? "Over First Apron" : "Below First Apron", "Projected", Math.min(100, taxBill * 4), "red")}
        ${financeApronCard(payrollStatus(team), team.payroll, levels)}
        ${financeMetricCard("Owner Trust", `${ownerTrust} / 100`, ownerTrust >= 80 ? "Very Good" : "Stable", "From last review", ownerTrust, "green")}
        ${financeMetricCard("Future Flexibility", futureFlex, capFlex(team), "3 High Salary Years Ahead", Math.max(12, 90 - commitments[2].payroll / levels.secondApron * 80), "blue")}
      </section>
      <section class="finance-main-grid">
        <section class="card finance-cap-sheet">
          <header><strong>Cap Sheet</strong><span>${contracts.length} Players Under Contract</span></header>
          <table><thead><tr><th>Player</th><th>Role</th><th>${save.season}-${String(save.season + 1).slice(-2)} Salary</th><th>Years Left</th><th>Option</th><th>Value</th><th>Status</th></tr></thead><tbody>${contracts.map(financeContractRow).join("")}</tbody></table>
          <button class="mini-action" data-nav-shortcut="upgrade">View Full Cap Sheet</button>
        </section>
        <section class="finance-center-stack">
          <section class="card finance-cap-overview"><header><strong>Cap Overview</strong><span>${save.season}-${String(save.season + 1).slice(-2)} Season</span></header>${financeCapOverviewRows(team, levels, taxBill)}<button class="mini-action" data-nav-shortcut="upgrade">View Cap Details</button></section>
          <section class="card finance-breakdown">${financeBreakdown(team.payroll, taxBill)}</section>
        </section>
        <section class="finance-center-stack">
          <section class="card finance-payroll-timeline"><header><strong>Payroll Timeline</strong><span>Next 4 Seasons</span></header><div class="finance-chart-legend"><span>Team Payroll</span><span>Luxury Tax Line</span><span>Salary Cap</span></div><div class="finance-bars"><div class="finance-axis"><span>$240M</span><span>$200M</span><span>$160M</span><span>$80M</span><span>$0</span></div><i class="tax-line" style="bottom:${Math.max(0, Math.min(100, levels.tax / maxPayroll * 100))}%"></i><i class="cap-line" style="bottom:${Math.max(0, Math.min(100, levels.cap / maxPayroll * 100))}%"></i>${commitments.map((item) => `<article><b style="height:${Math.max(14, item.payroll / maxPayroll * 100)}%"></b><strong>$${item.payroll.toFixed(1)}M</strong><span>${item.season}-${String(item.season + 1).slice(-2)}</span></article>`).join("")}</div><button class="mini-action">View Payroll Projections</button></section>
          <section class="card finance-owner-profile">${financeOwnerProfile(finances, ownerTrust)}</section>
          <section class="card finance-activity"><header><strong>Recent Financial Activity</strong><button class="mini-action">View All Activity</button></header>${financeActivityRows(contracts)}</section>
        </section>
        <aside class="finance-right-rail">
          <section class="card finance-action-center"><header><strong>Finances Action Center</strong><b>${financeActionItems(team, contracts, taxBill).length}</b><button class="mini-action">View All</button></header>${financeActionItems(team, contracts, taxBill).map(financeActionCard).join("")}</section>
          <section class="card finance-advisor"><header><strong>Cap Advisor</strong></header><div><span></span><p>You are currently ${team.payroll > levels.firstApron ? "above the first apron" : "positioned with usable flexibility"}. Consider moves to protect flexibility before the trade deadline.</p></div><button class="mini-action">View Advisor Report</button></section>
        </aside>
      </section>
      <section class="finance-lower-grid">
        <section class="card finance-mini-list"><header><strong>Expiring Contracts (${expiring.length})</strong></header>${expiring.map((player) => financeSmallPlayerRow(player, contractSalary(player).toFixed(1), "UFA")).join("") || '<div class="muted-line">No expiring contracts.</div>'}<button class="mini-action">View All Expiring</button></section>
        <section class="card finance-mini-list"><header><strong>Extension Candidates</strong></header>${extensionCandidates.map((player) => financeSmallPlayerRow(player, player.ovr >= 88 ? "Super Max" : player.age <= 24 ? "Rookie Max" : "Extension", "Eligible Now")).join("") || '<div class="muted-line">No extension candidates.</div>'}<button class="mini-action">View All Candidates</button></section>
        <section class="card finance-exceptions"><header><strong>Cap Exceptions & Rights</strong></header>${financeExceptionRows(levels, contracts)}<button class="mini-action">View All Exceptions</button></section>
      </section>
    </section>`;
  return `
    <h1 class="page-title">finances</h1>
    <section class="finance-hero card">
      <div class="team-hero-identity">${teamLogo(team, "page-hero-logo")}<div><span>OWNERSHIP REPORT</span><strong>${escapeHtml(team.city)} Financial Outlook</strong><p>Track basketball spending, operating performance, tax exposure, and long-term commitments.</p></div></div>
      <div class="finance-income ${operatingIncome >= 0 ? "positive" : "negative"}"><span>PROJECTED OPERATING INCOME</span><b>${operatingIncome >= 0 ? "+" : "-"}$${Math.abs(operatingIncome).toFixed(1)}M</b><small>${operatingIncome >= 0 ? "Profitable projection" : "Ownership subsidy required"}</small></div>
    </section>
    <section class="grid-4 finance-summary">${statCard("annual revenue", `$${revenue.toFixed(1)}M`)}${statCard("team payroll", `$${team.payroll.toFixed(1)}M`)}${statCard("estimated tax", `$${taxBill.toFixed(1)}M`)}${statCard("attendance", `${attendance.toFixed(0)}%`)}</section>
    <section class="finance-columns">
      <article class="card finance-ledger"><header><div><span>REVENUE</span><strong>INCOME SOURCES</strong></div><b>$${revenue.toFixed(1)}M</b></header><div>${revenueRows.map(([label, value]) => financeLedgerRow(label, value, revenue)).join("")}</div></article>
      <article class="card finance-ledger expenses"><header><div><span>EXPENSES</span><strong>OPERATING COSTS</strong></div><b>$${totalExpenses.toFixed(1)}M</b></header><div>${financeLedgerRow("Player payroll", team.payroll, totalExpenses)}${financeLedgerRow("Luxury tax estimate", taxBill, totalExpenses)}${financeLedgerRow("Team operations", 64, totalExpenses)}${financeLedgerRow("Specialist staff", staffSpent, totalExpenses)}</div></article>
    </section>
    <section class="card finance-policy"><div><span>OWNERSHIP POLICY</span><strong>Luxury-Tax Tolerance</strong><p>Sets the front office's preferred spending posture. It does not override NBA apron restrictions.</p></div><label><span>SPENDING APPROACH</span><select id="finance-tax-tolerance"><option value="conservative" ${finances.taxTolerance === "conservative" ? "selected" : ""}>Conservative</option><option value="moderate" ${finances.taxTolerance === "moderate" ? "selected" : ""}>Moderate</option><option value="aggressive" ${finances.taxTolerance === "aggressive" ? "selected" : ""}>Aggressive</option></select></label><div class="finance-policy-status"><span>CURRENT POSITION</span><strong>${escapeHtml(payrollStatus(team))}</strong><small>${escapeHtml(capFlex(team))}</small></div></section>
    <section class="card finance-commitments"><header><div><span>LONG-TERM PLAN</span><strong>SALARY COMMITMENTS</strong></div><button class="btn" data-nav-shortcut="upgrade">Open Cap Sheet</button></header><div class="finance-year-grid">${commitments.map(financeCommitmentCard).join("")}</div></section>
    <section class="card table-card finance-contracts"><table><thead><tr><th>Player</th><th>Current Salary</th><th>Contract Through</th><th>Total Remaining</th><th>Type</th></tr></thead><tbody>${contracts.map((player) => `<tr><td><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} · ${player.ovr} OVR</small></td><td><strong>$${contractSalary(player).toFixed(1)}M</strong></td><td>${player.contract?.endSeason || save.season}</td><td>$${contractTotal(player, save.season).toFixed(1)}M</td><td>${escapeHtml(player.contract?.salaryType || "Standard")}</td></tr>`).join("")}</tbody></table></section>`;
}

function financeMetricCard(label, value, note, trend, percent, tone) {
  return `<article class="card finance-dash-metric ${tone}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong><small>${escapeHtml(note)}</small><em>${escapeHtml(trend)}</em><i><b style="width:${Math.max(0, Math.min(100, Number(percent) || 0))}%"></b></i></article>`;
}

function financeApronCard(status, payroll, levels) {
  const used = Math.max(0, Math.min(100, payroll / levels.secondApron * 100));
  const label = status.replace(/\b\w/g, (char) => char.toUpperCase());
  return `<article class="card finance-apron-metric"><span>Apron Status</span><strong>${escapeHtml(label)}</strong><small>$${Math.abs(payroll - levels.firstApron).toFixed(1)}M ${payroll >= levels.firstApron ? "Above" : "Below"}</small><div><i style="left:${levels.cap / levels.secondApron * 100}%"></i><i style="left:${levels.firstApron / levels.secondApron * 100}%"></i><i style="left:100%"></i><b style="width:${used}%"></b></div><footer><span>Cap</span><span>1st Apron</span><span>2nd Apron</span></footer></article>`;
}

function financeContractRow(player) {
  const salary = contractSalary(player);
  const years = contractYearsRemaining(player);
  const option = player.contract?.option || (years <= 1 ? "None" : "Team");
  const value = player.ovr >= 88 ? "A+" : player.ovr >= 82 ? "A" : player.ovr >= 76 ? "B+" : player.ovr >= 70 ? "B" : player.ovr >= 66 ? "C" : "D";
  const status = years <= 1 ? "Expiring" : rosterType(player) === "twoWay" ? "Two-Way" : "Under Contract";
  return `<tr><td>${playerHeadshot(player, "finance-player-headshot")}<span><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} | ${escapeHtml(actualPlayerRole(player))}</small></span></td><td>${player.starter ? "Starter" : player.minutes >= 18 ? "Rotation" : "Bench"}</td><td><strong>$${salary.toFixed(1)}M</strong></td><td>${years}</td><td>${escapeHtml(option)}</td><td><b>${escapeHtml(value)}</b></td><td><em class="${years <= 1 ? "warn" : "ok"}">${escapeHtml(status)}</em></td></tr>`;
}

function financeCapOverviewRows(team, levels, taxBill) {
  const rows = [
    ["Salary Cap", levels.cap, levels.cap, "blue"],
    ["Team Payroll", team.payroll, levels.secondApron, "blue"],
    ["Cap Space", levels.cap - team.payroll, levels.cap, "green"],
    ["Luxury Tax Line", levels.tax, levels.secondApron, "blue"],
    ["Tax Bill (Projected)", taxBill, Math.max(1, taxBill + 12), "red"],
    ["First Apron", levels.firstApron, levels.secondApron, "orange"],
    ["Over First Apron", team.payroll - levels.firstApron, levels.firstApron, "red"],
    ["Second Apron", levels.secondApron, levels.secondApron, "red"],
    ["Over Second Apron", team.payroll - levels.secondApron, levels.secondApron, "red"]
  ];
  return `<div>${rows.map(([label, value, max, tone]) => `<article class="${tone}"><span>${escapeHtml(label)}</span><i><b style="width:${Math.max(0, Math.min(100, Math.abs(Number(value)) / Math.max(1, Number(max)) * 100))}%"></b></i><strong>${Number(value) < 0 ? "-" : ""}$${Math.abs(Number(value)).toFixed(1)}M</strong></article>`).join("")}</div>`;
}

function financeBreakdown(payroll, taxBill) {
  const guaranteed = payroll * .89;
  const tax = taxBill;
  const bonuses = payroll * .018;
  const other = payroll * .012;
  return `<header><strong>Financial Breakdown</strong></header><div class="finance-donut"><b>$${payroll.toFixed(1)}M</b><small>Total Payroll</small></div><ul><li><span></span>Guaranteed Salaries <b>$${guaranteed.toFixed(1)}M</b></li><li><span></span>Tax Penalties <b>$${tax.toFixed(1)}M</b></li><li><span></span>Bonuses <b>$${bonuses.toFixed(1)}M</b></li><li><span></span>Benefits / Other <b>$${other.toFixed(1)}M</b></li></ul><button class="mini-action">View Breakdown</button>`;
}

function financeOwnerProfile(finances, ownerTrust) {
  return `<header><strong>Owner Profile</strong></header><div class="finance-owner-score"><b>${ownerTrust}</b><span>Out of 100</span></div><dl><dt>Spending Style</dt><dd>${escapeHtml(finances.taxTolerance === "aggressive" ? "Aggressive" : finances.taxTolerance === "conservative" ? "Conservative" : "Balanced")}</dd><dt>Tax Tolerance</dt><dd>${escapeHtml(finances.taxTolerance || "moderate")}</dd><dt>Market Size</dt><dd>Large</dd><dt>Fan Interest</dt><dd>${Number(finances.attendance || 82) >= 85 ? "Very High" : "High"}</dd><dt>Owner Pressure</dt><dd>Medium</dd></dl><button class="mini-action">View Owner Profile</button>`;
}

function financeActionItems(team, contracts, taxBill) {
  const expiring = contracts.find((player) => contractYearsRemaining(player) <= 1);
  const extension = contracts.find((player) => canExtendContract(player)) || contracts[0];
  return [
    { title: "Extension Decision", note: `${extension?.name || "Key player"} is extension eligible this offseason.`, tone: "blue", player: extension, primary: "Negotiate" },
    { title: "Tax Warning", note: `You are $${Math.max(0, team.payroll - cbaThresholds(save.season).firstApron).toFixed(1)}M above the first apron.`, tone: "red", player: null, primary: "Explore Trade" },
    { title: "Expiring Contract", note: `${expiring?.name || "A rotation player"} has an expiring contract.`, tone: "orange", player: expiring, primary: "Re-Sign" },
    { title: "Trade Impact Check", note: "Evaluate trade scenarios and apron impact.", tone: "cyan", player: null, primary: "Simulate Trade" },
    { title: "Owner Budget Review", note: "Offseason budget approval required.", tone: "green", player: null, primary: "Request Approval" }
  ].filter((item) => item.title !== "Tax Warning" || taxBill > 0 || team.payroll > cbaThresholds(save.season).firstApron);
}

function financeActionCard(item) {
  return `<article class="${item.tone}"><div><span>${escapeHtml(item.title)}</span><strong>${escapeHtml(item.note)}</strong><div><button class="btn primary">${escapeHtml(item.primary)}</button><button class="btn">${item.title.includes("Trade") ? "Check Impact" : "Review Options"}</button></div></div>${item.player ? playerHeadshot(item.player, "finance-action-headshot") : `<i>${item.tone === "red" ? "!" : "$"}</i>`}</article>`;
}

function financeSmallPlayerRow(player, value, note) {
  const displayValue = Number.isFinite(Number(value)) ? `$${value}M` : String(value);
  return `<article>${playerHeadshot(player, "finance-mini-headshot")}<span><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)}</small></span><b>${escapeHtml(displayValue)}</b><em>${escapeHtml(note)}</em></article>`;
}

function financeExceptionRows(levels, contracts) {
  const rights = contracts.slice(0, 2);
  const rows = [["Non-Taxpayer MLE", levels.mle, "Available"], ["Bi-Annual Exception", levels.biAnnual, "Available"], ["Trade Exception", 6.2, "Expires Jul 1"], ...rights.map((player) => [`${player.name} Bird Rights`, contractSalary(player), "Active"])];
  return `<div>${rows.slice(0, 5).map(([label, value, status]) => `<article><span>${escapeHtml(label)}</span><b>$${Number(value).toFixed(1)}M</b><em>${escapeHtml(status)}</em></article>`).join("")}</div>`;
}

function financeActivityRows(contracts) {
  const rows = [
    ["May 14", "Player Option Declined", `${contracts.at(-1)?.name || "A player"} declined player option`],
    ["May 10", "Contract Signed", `${contracts[0]?.name || "A starter"} signed long-term deal`],
    ["May 8", "Trade Completed", "Acquired financial flexibility"],
    ["May 5", "Waiver Claim", "Cleared space with waiver move"]
  ];
  return `<div>${rows.map(([date, type, note]) => `<article><span>${escapeHtml(date)}</span><strong>${escapeHtml(type)}</strong><small>${escapeHtml(note)}</small></article>`).join("")}</div>`;
}

function estimatedLuxuryTax(payroll, taxLine) {
  const overage = Math.max(0, payroll - taxLine);
  if (!overage) return 0;
  const firstFive = Math.min(5, overage) * 1.5;
  const secondFive = Math.min(5, Math.max(0, overage - 5)) * 1.75;
  const remaining = Math.max(0, overage - 10) * 2.5;
  return roundMoney(firstFive + secondFive + remaining);
}

function financeLedgerRow(label, value, total) {
  const percent = total > 0 ? Math.max(0, Math.min(100, value / total * 100)) : 0;
  return `<div class="finance-ledger-row"><span>${escapeHtml(label)}</span><i><b style="width:${percent}%"></b></i><strong>$${roundMoney(value).toFixed(1)}M</strong></div>`;
}

function financeCommitmentCard(commitment) {
  const levels = cbaThresholds(commitment.season);
  const percent = Math.max(0, Math.min(100, commitment.payroll / levels.secondApron * 100));
  return `<article><span>${commitment.season}-${String(commitment.season + 1).slice(-2)}</span><strong>$${commitment.payroll.toFixed(1)}M</strong><small>${commitment.players} players under contract</small><i><b style="width:${percent}%"></b></i><em>$${levels.cap.toFixed(1)}M cap</em></article>`;
}

function tradeMachine() {
  const userTeam = activeTeam();
  ensureMultiTradeState();
  const teams = multiTradeTeamIds.map(getTeam).filter(Boolean);
  const transaction = buildMultiTeamTradeTransaction();
  const decision = validateMultiTeamTrade(transaction, tradeConsent);
  const availableTeams = save.teams.filter((team) => !multiTradeTeamIds.includes(team.id));
  const failed = decision.reasons.filter((reason) => !reason.ok);
  const hasTradePartner = teams.some((team) => team.id !== userTeam.id);
  const canAddTradeTeam = teams.length < 4 && availableTeams.length > 0;
  const showAddTeamSlot = canAddTradeTeam && !hasTradePartner;
  const showTopAddTeam = canAddTradeTeam && hasTradePartner;
  const tradePanelCount = Math.max(2, teams.length + (showAddTeamSlot ? 1 : 0));
  return `
    <h1 class="page-title trade-page-title">trade machine</h1>
    <section class="card phase6-card multi-trade-steps" aria-label="Trade progress">
      <div class="active" aria-current="step"><b><span>1</span></b><span><em>STEP 01</em><strong>BUILD TRADE</strong><small>Add teams, players, and picks</small></span></div>
      <div><b><span>2</span></b><span><em>STEP 02</em><strong>PREVIEW</strong><small>Review every team's return</small></span></div>
      <div><b><span>3</span></b><span><em>STEP 03</em><strong>SUBMIT</strong><small>Finalize the transaction</small></span></div>
      <button class="btn trade-reset-button" data-action="trade-reset" type="button" style="border:1px solid #df5968 !important;color:#ffe6e9 !important;background:linear-gradient(180deg,#a83a4b 0%,#5d202d 100%) !important;background-image:linear-gradient(180deg,#a83a4b 0%,#5d202d 100%) !important;box-shadow:0 8px 17px rgba(157,42,60,.24),inset 0 1px rgba(255,255,255,.14) !important;opacity:1 !important;-webkit-appearance:none !important;appearance:none !important">Reset Trade</button>
    </section>
    <section class="card multi-trade-team-picker">
      <div><span>TEAMS IN TRADE</span><strong>${teams.length} TEAMS SELECTED</strong></div>
      <div class="multi-trade-team-chips">${teams.map((team) => `<span>${teamLogo(team, "multi-trade-chip-logo")}<b>${escapeHtml(team.abbr)}</b>${team.id === userTeam.id ? '<small>YOU</small>' : `<button class="multi-trade-remove-team" data-remove-trade-team="${team.id}" type="button" aria-label="Remove ${escapeHtml(team.city)} ${escapeHtml(team.name)} from trade" title="Remove team" style="display:inline-flex !important;align-items:center !important;justify-content:center !important;width:28px !important;min-width:28px !important;height:28px !important;min-height:28px !important;margin-left:5px !important;padding:0 0 2px !important;border:1px solid #d95868 !important;border-radius:7px !important;color:#ffe4e7 !important;background:linear-gradient(180deg,#8f3041 0%,#4e1c28 100%) !important;background-image:linear-gradient(180deg,#8f3041 0%,#4e1c28 100%) !important;box-shadow:inset 0 1px rgba(255,255,255,.10),0 5px 10px rgba(0,0,0,.22) !important;font:700 16px/1 Arial,sans-serif !important;opacity:1 !important;-webkit-appearance:none !important;appearance:none !important">&times;</button>`}</span>`).join("")}</div>
      ${showTopAddTeam ? `<button class="multi-trade-top-add-team" data-action="trade-open-team-picker" aria-label="Add another trade team">+</button>` : ""}
    </section>
    <section class="multi-trade-team-grid" style="--trade-team-count:${tradePanelCount}">
      ${teams.map((team) => multiTradeTeamPanel(team, transaction)).join("")}
      ${showAddTeamSlot ? multiTradeAddTeamSlot(availableTeams) : ""}
    </section>
    ${multiTradeTeamPickerOpen ? multiTradeTeamPickerCard(availableTeams) : ""}
    <section class="card phase6-card phase6-card--accent multi-trade-analysis ${decision.valid ? "valid" : "invalid"}" aria-labelledby="trade-analysis-title">
      <header><div class="trade-analysis-heading"><span class="trade-analysis-state" aria-hidden="true">${decision.valid ? "&#10003;" : "!"}</span><div><div class="card-label">trade analysis</div><strong id="trade-analysis-title">${decision.valid ? "Trade approved" : "Trade needs changes"}</strong><small>${decision.valid ? "Every team satisfies current roster, salary, and draft-pick rules." : `Resolve ${failed.length} blocking rule${failed.length === 1 ? "" : "s"} before this trade can be submitted.`}</small></div></div><div class="trade-analysis-progress"><span><b>${decision.reasons.filter((reason) => reason.ok).length}</b> of ${decision.reasons.length} rules passed</span><i aria-hidden="true"><b style="width:${decision.reasons.length ? decision.reasons.filter((reason) => reason.ok).length / decision.reasons.length * 100 : 0}%"></b></i></div></header>
      <div class="multi-trade-impact-grid">${teams.map((team) => multiTradeImpactCard(team, transaction)).join("")}</div>
      <div class="multi-trade-receiving-grid">${teams.map((team) => multiTradeReceivingCard(team, transaction)).join("")}</div>
      <section class="trade-rule-section" aria-label="${failed.length ? "Required fixes" : "Passed rules"}"><header><div><span>${failed.length ? "REQUIRED FIXES" : "VALIDATION COMPLETE"}</span><small>${failed.length ? "Address each item below to unlock submission." : "This trade is ready to submit."}</small></div><b>${decision.valid ? `${decision.reasons.length}/${decision.reasons.length}` : failed.length}</b></header><div class="trade-rule-list phase6-scroll">${(failed.length ? failed : decision.reasons.slice(0, 4)).map((reason, index) => `<div class="trade-rule ${reason.ok ? "ok" : "bad"}"><span>${reason.ok ? "PASS" : String(index + 1).padStart(2, "0")}</span><div><strong>${reason.ok ? "Rule passed" : "Action required"}</strong><small>${escapeHtml(reason.message)}</small></div></div>`).join("")}</div></section>
      ${decision.requiresConsent ? `<label class="trade-consent"><input type="checkbox" id="trade-consent" ${tradeConsent ? "checked" : ""}> Player consent obtained for every no-trade clause</label>` : ""}
      <footer><div class="trade-submit-status ${decision.valid ? "ready" : "blocked"}"><span aria-hidden="true">${decision.valid ? "&#10003;" : "!"}</span><div><strong>${decision.valid ? "Ready to submit" : `${failed.length} blocking item${failed.length === 1 ? "" : "s"} remaining`}</strong><small>${decision.valid ? "Send this transaction to the league office." : "Return to the trade builder and resolve every required fix."}</small></div></div><div class="trade-analysis-actions"><button class="btn phase6-button" data-action="trade-back">Back to trade</button><button class="btn primary phase6-button phase6-button--team trade-submit-button ${decision.valid ? "is-ready" : "is-locked"}" data-action="trade-submit" aria-disabled="${decision.valid ? "false" : "true"}" style="border:1px solid ${decision.valid ? "#68e9a7" : "#e45c69"} !important;color:${decision.valid ? "#ffffff" : "#ffe5e8"} !important;background:${decision.valid ? "linear-gradient(180deg,#38d783 0%,#14834e 100%)" : "linear-gradient(180deg,#c94a58 0%,#7d202d 100%)"} !important;box-shadow:${decision.valid ? "0 9px 20px rgba(29,190,105,.30),inset 0 1px rgba(255,255,255,.26)" : "0 8px 18px rgba(181,49,64,.25),inset 0 1px rgba(255,255,255,.16)"} !important;opacity:1 !important" ${decision.valid ? "" : "disabled"}>${decision.valid ? "Submit trade" : "Submission locked"}</button></div></footer>
    </section>
  `;
}

function ensureMultiTradeState() {
  const userTeamId = save.activeTeamId;
  if (!multiTradeTeamIds.includes(userTeamId)) {
    multiTradeTeamIds = [userTeamId];
    multiTradePlayerIds = [];
    multiTradePickIds = [];
    multiTradeRoutes = {};
  }
  multiTradeTeamIds = [...new Set(multiTradeTeamIds)].filter((id) => getTeam(id)).slice(0, 4);
}

function buildMultiTeamTradeTransaction() {
  const teamIds = [...multiTradeTeamIds];
  const playerRoutes = multiTradePlayerIds.map((id) => save.players.find((player) => String(player.id) === String(id))).filter((player) => player && teamIds.includes(player.teamId)).map((player) => ({ asset: player, sourceTeamId: player.teamId, destinationTeamId: multiTradeRoutes[player.id] }));
  const pickRoutes = multiTradePickIds.map((id) => save.draftPicks.find((pick) => String(pick.id) === String(id))).filter((pick) => pick && teamIds.includes(pick.ownerTeamId)).map((pick) => ({ asset: pick, sourceTeamId: pick.ownerTeamId, destinationTeamId: multiTradeRoutes[pick.id] }));
  return { teamIds, playerRoutes, pickRoutes };
}

function multiTradeTeamPanel(team, transaction) {
  const outgoingPlayers = transaction.playerRoutes.filter((route) => route.sourceTeamId === team.id);
  const incomingPlayers = transaction.playerRoutes.filter((route) => route.destinationTeamId === team.id);
  const outgoingPicks = transaction.pickRoutes.filter((route) => route.sourceTeamId === team.id);
  const incomingPicks = transaction.pickRoutes.filter((route) => route.destinationTeamId === team.id);
  const outgoingSalary = outgoingPlayers.reduce((sum, route) => sum + contractSalary(route.asset), 0);
  const incomingSalary = incomingPlayers.reduce((sum, route) => sum + contractSalary(route.asset), 0);
  const otherTeams = multiTradeTeamIds.filter((id) => id !== team.id).map(getTeam).filter(Boolean);
  return `<section class="card multi-trade-team-panel">
    <header>${teamLogo(team, "multi-trade-team-logo")}<div><strong>${escapeHtml(team.city)} ${escapeHtml(team.name)}</strong><span>${team.wins}-${team.losses} &middot; ${escapeHtml(team.conf)} Conference</span></div><aside><small>CAP ROOM</small><b>$${Math.max(0, cbaThresholds(save.season).cap - team.payroll).toFixed(1)}M</b></aside></header>
    <div class="multi-trade-flow-block"><div><span>SENDING (${outgoingPlayers.length + outgoingPicks.length} ASSETS)</span><b>$${outgoingSalary.toFixed(1)}M</b></div>${outgoingPlayers.map((route) => multiTradeAssetSummary(route, true, otherTeams)).join("")}${outgoingPicks.map((route) => multiTradeAssetSummary(route, true, otherTeams)).join("") || (!outgoingPlayers.length ? '<small class="multi-trade-empty">Select assets below</small>' : "")}</div>
    <details class="multi-trade-asset-picker"><summary>+ Add Player</summary><div>${[...teamPlayers(team.id)].sort((a, b) => b.ovr - a.ovr).map((player) => multiTradePlayerPickerRow(player)).join("")}</div></details>
    <details class="multi-trade-asset-picker"><summary>+ Add Future Pick</summary><div>${teamTradePicks(team.id).map((pick) => multiTradePickPickerRow(pick)).join("") || '<small class="multi-trade-empty">No tradable picks</small>'}</div></details>
    <footer><span>PAYROLL AFTER TRADE</span><strong>$${roundMoney(team.payroll - outgoingSalary + incomingSalary).toFixed(1)}M</strong></footer>
  </section>`;
}

function multiTradeAddTeamSlot(availableTeams) {
  return `<section class="card multi-trade-team-panel multi-trade-add-team-empty">
    <header><button class="multi-trade-team-logo multi-trade-add-team-mark" data-action="trade-open-team-picker" ${availableTeams.length ? "" : "disabled"} aria-label="Add trade team">+</button><div><strong>Add Team</strong><span>Select a trade partner</span></div><aside><small>CAP ROOM</small><b>-</b></aside></header>
    <div class="multi-trade-empty-body"><span>TRADE PARTNER SLOT</span><strong>Choose another team</strong><small>Add a partner to compare salaries, route assets, and validate the deal.</small><button data-action="trade-open-team-picker" ${availableTeams.length ? "" : "disabled"}>Select Team</button></div>
  </section>`;
}

function multiTradeTeamPickerCard(availableTeams) {
  const taxLine = cbaThresholds(save.season).tax;
  return `<section class="multi-trade-team-popover" role="dialog" aria-label="Select trade partner">
    <button class="multi-trade-team-popover-backdrop" data-action="trade-close-team-picker" aria-label="Close team picker"></button>
    <article class="card phase6-card phase6-card--accent multi-trade-team-select-card">
      <header><div class="multi-trade-picker-title"><i aria-hidden="true"><img src="${localAssetUrl("nba-logo-white.png")}" alt=""></i><div><span>ADD TRADE PARTNER</span><strong>Select a team</strong><small>Compare payroll position and choose the next side in this deal.</small></div></div><aside><span>TRADE SLOT</span><b>${multiTradeTeamIds.length + 1}<small>/ 4</small></b></aside><button class="multi-trade-close-picker" data-action="trade-close-team-picker" type="button" aria-label="Close team picker" style="display:inline-flex !important;align-items:center !important;justify-content:center !important;width:34px !important;min-width:34px !important;height:34px !important;min-height:34px !important;padding:0 0 2px !important;border:1px solid #d95868 !important;border-radius:8px !important;color:#ffe4e7 !important;background:linear-gradient(180deg,#8f3041 0%,#4e1c28 100%) !important;background-image:linear-gradient(180deg,#8f3041 0%,#4e1c28 100%) !important;box-shadow:inset 0 1px rgba(255,255,255,.10),0 6px 12px rgba(0,0,0,.22) !important;font:700 18px/1 Arial,sans-serif !important;opacity:1 !important;-webkit-appearance:none !important;appearance:none !important">&times;</button></header>
      <div class="multi-trade-picker-tools"><label><span aria-hidden="true">&#9906;</span><input id="multi-trade-team-search" type="search" placeholder="Search team, city, or abbreviation" autocomplete="off" aria-label="Search available teams"></label><div class="multi-trade-conference-filters" aria-label="Filter by conference"><button class="active" data-trade-team-filter="all">All</button><button data-trade-team-filter="East">East</button><button data-trade-team-filter="West">West</button></div><span><b id="multi-trade-team-result-count">${availableTeams.length}</b><small>teams available</small></span></div>
      <div class="multi-trade-team-options phase6-scroll" data-active-conference="all">${availableTeams.map((team) => { const theme = teamThemes[team.id] || teamThemes.bos; const taxStatus = Number(team.payroll) > taxLine ? "Tax team" : "Below tax"; return `<button data-trade-select-team="${team.id}" data-team-conference="${escapeHtml(team.conf)}" data-team-search="${escapeHtml(`${team.city} ${team.name} ${team.abbr} ${team.conf}`.toLowerCase())}" style="--picker-team:${theme.primary};--picker-team-secondary:${theme.secondary}">${teamLogo(team, "multi-trade-select-logo")}<span><em>${escapeHtml(team.conf)} CONFERENCE</em><strong>${escapeHtml(team.city)} ${escapeHtml(team.name)}</strong><small><b>${team.wins}-${team.losses}</b><i></i>$${Number(team.payroll).toFixed(1)}M payroll</small></span><aside><b>${escapeHtml(team.abbr)}</b><small class="${Number(team.payroll) > taxLine ? "tax" : "flexible"}">${taxStatus}</small><i aria-hidden="true">&#8594;</i></aside></button>`; }).join("") || '<small class="multi-trade-empty">No more teams can be added.</small>'}</div>
      <div class="multi-trade-picker-empty" hidden><strong>No matching teams</strong><small>Try another city, team name, or abbreviation.</small></div>
    </article>
  </section>`;
}

function multiTradeAssetSummary(route, outgoing, otherTeams = []) {
  const player = route.asset.name ? route.asset : null;
  const label = player ? player.name : formatDraftPick(route.asset);
  const source = getTeam(route.sourceTeamId);
  return `<article class="multi-trade-asset">${player ? playerHeadshot(player, "multi-trade-player-headshot") : '<span class="multi-trade-pick-mark">PICK</span>'}<div><strong>${escapeHtml(label)}</strong><small>${player ? `${escapeHtml(player.pos)} &middot; ${player.ovr} OVR &middot; $${contractSalary(player).toFixed(1)}M` : escapeHtml(teamName(route.sourceTeamId))}</small></div>${outgoing ? `<select data-multi-trade-route="${route.asset.id}">${otherTeams.map((team) => `<option value="${team.id}" ${route.destinationTeamId === team.id ? "selected" : ""}>to ${escapeHtml(team.abbr)}</option>`).join("")}</select><button class="multi-trade-remove-asset" data-remove-trade-asset="${route.asset.id}" type="button" aria-label="Remove ${escapeHtml(label)} from trade">&times;</button>` : `<b>FROM ${escapeHtml(source?.abbr || "-")}</b>`}</article>`;
}

function multiTradePlayerPickerRow(player) {
  const selected = multiTradePlayerIds.some((id) => String(id) === String(player.id));
  const eligible = isPlayerTradeEligible(player);
  return `<button class="multi-trade-player-option ${selected ? "selected" : ""}" data-multi-trade-player="${player.id}" ${eligible.ok ? "" : "disabled"}>${playerHeadshot(player, "multi-trade-picker-headshot")}<span class="multi-trade-picker-copy"><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)}${eligible.ok ? "" : ` &middot; ${escapeHtml(eligible.message)}`}</small></span><span class="multi-trade-picker-meta"><em>${player.ovr} OVR</em><b>$${contractSalary(player).toFixed(1)}M</b></span></button>`;
}

function multiTradePickPickerRow(pick) {
  const selected = multiTradePickIds.some((id) => String(id) === String(pick.id));
  return `<button class="multi-trade-pick-option ${selected ? "selected" : ""}" data-multi-trade-pick="${pick.id}"><span class="multi-trade-pick-mark"><small>${pick.season}</small><b>R${pick.round}</b></span><span class="multi-trade-pick-copy"><em>DRAFT CAPITAL</em><strong>${pick.season} Round ${pick.round}</strong><small>${pick.originalTeamId === pick.ownerTeamId ? "Own selection" : `via ${escapeHtml(teamName(pick.originalTeamId))}`}</small></span><span class="multi-trade-pick-action" aria-hidden="true">${selected ? "&#10003;" : "+"}</span></button>`;
}

function multiTradeImpactCard(team, transaction) {
  const sent = transaction.playerRoutes.filter((route) => route.sourceTeamId === team.id).reduce((sum, route) => sum + tradeAssetValue(team.id, route.asset), 0);
  const received = transaction.playerRoutes.filter((route) => route.destinationTeamId === team.id).reduce((sum, route) => sum + tradeAssetValue(team.id, route.asset), 0);
  const pickDelta = transaction.pickRoutes.filter((route) => route.destinationTeamId === team.id).length - transaction.pickRoutes.filter((route) => route.sourceTeamId === team.id).length;
  return `<article class="${received - sent >= 0 ? "positive" : "negative"}">${teamLogo(team, "multi-trade-impact-logo")}<div><span>${escapeHtml(team.abbr)} IMPACT</span><strong class="${received - sent >= 0 ? "ok" : "bad"}">${received - sent >= 0 ? "+" : ""}${Math.round((received - sent) / 10)} VALUE</strong><small>${pickDelta >= 0 ? "+" : ""}${pickDelta} draft picks</small></div></article>`;
}

function multiTradeReceivingCard(team, transaction) {
  const incomingPlayers = transaction.playerRoutes.filter((route) => route.destinationTeamId === team.id);
  const incomingPicks = transaction.pickRoutes.filter((route) => route.destinationTeamId === team.id);
  const incomingSalary = incomingPlayers.reduce((sum, route) => sum + contractSalary(route.asset), 0);
  const assets = [...incomingPlayers, ...incomingPicks];
  return `<article class="multi-trade-receiving-card">
    <header>${teamLogo(team, "multi-trade-impact-logo")}<div><span>${escapeHtml(team.abbr)} RECEIVING</span><strong>${assets.length} ASSET${assets.length === 1 ? "" : "S"}</strong></div><b>$${incomingSalary.toFixed(1)}M</b></header>
    <div>${assets.map((route) => multiTradeAssetSummary(route, false)).join("") || '<small class="multi-trade-empty">No incoming assets</small>'}</div>
  </article>`;
}

function tradeTeamPanel(team, players, selected, side) {
  const selectedSalary = selected.reduce((sum, player) => sum + contractSalary(player), 0);
  const selectedIds = new Set(selected.map((player) => player.id));
  return `<section class="card trade-team-panel">
    <div class="trade-team-heading"><div><div class="card-label">${side === "outgoing" ? "your team sends" : "other team sends"}</div><div class="player-name">${escapeHtml(team.abbr)}</div></div><div><strong>$${selectedSalary.toFixed(1)}M</strong><span>${selected.length} selected</span></div></div>
    <div class="trade-roster-list">${[...players].sort((a, b) => contractSalary(b) - contractSalary(a)).map((player) => tradePlayerRow(player, side, selectedIds.has(player.id))).join("")}</div>
    <div class="trade-pick-list"><div class="card-label">draft capital</div>${teamTradePicks(team.id).map((pick) => tradePickRow(pick, side)).join("") || '<div class="muted-line compact">No tradable picks.</div>'}</div>
    <div class="trade-team-footer"><span>Payroll after trade</span><strong>$${projectedTradePayroll(team.id, side === "outgoing" ? selected : [], side === "incoming" ? selected : []).toFixed(1)}M</strong></div>
  </section>`;
}

function tradePickRow(pick, side) {
  const selected = (side === "outgoing" ? tradeOutgoingPickIds : tradeIncomingPickIds).includes(pick.id);
  return `<label class="trade-pick ${selected ? "selected" : ""}"><input type="checkbox" data-trade-pick="${pick.id}" data-trade-side="${side}" ${selected ? "checked" : ""}><span><strong>${pick.season} Round ${pick.round}</strong><small>${pick.originalTeamId === pick.ownerTeamId ? "Own pick" : `via ${teamName(pick.originalTeamId)}`}${pick.protection ? ` - ${pick.protection}` : ""}</small></span></label>`;
}

function tradePlayerRow(player, side, selected) {
  const eligible = isPlayerTradeEligible(player);
  return `<label class="trade-player ${selected ? "selected" : ""} ${eligible.ok ? "" : "ineligible"}">
    <input type="checkbox" data-trade-player="${escapeHtml(player.id)}" data-trade-side="${side}" ${selected ? "checked" : ""} ${eligible.ok ? "" : "disabled"}>
    <span><strong>${escapeHtml(player.name)}${player.contract?.noTradeClause ? ' <em>NTC</em>' : ""}</strong><small>${escapeHtml(player.pos)} - ${player.ovr} OVR - ${eligible.ok ? `${contractYearsRemaining(player)} yr` : eligible.message}</small></span>
    <b>$${contractSalary(player).toFixed(1)}M</b>
  </label>`;
}

function play() {
  if (simcastState) return simcastPage();
  const schedule = [...save.schedule].sort((a, b) => a.date.localeCompare(b.date));
  const next = schedule.find((game) => !game.played) || schedule.at(-1);
  const selected = schedule.find((game) => game.id === selectedGameId) || next;
  const monthKey = calendarMonth || selected?.date.slice(0, 7) || `${save.season}-10`;
  const [year, month] = monthKey.split("-").map(Number);
  const monthGames = schedule.filter((game) => game.date.startsWith(monthKey));
  const monthEvents = save.seasonEvents.filter((event) => event.date.startsWith(monthKey));
  const monthTransactions = save.transactionEvents.filter((event) => event.date.startsWith(monthKey));
  const selectedEvent = save.seasonEvents.find((event) => event.id === selectedEventId);
  const selectedTransaction = save.transactionEvents.find((event) => event.id === selectedTransactionId);
  const completed = schedule.filter((game) => game.played).length;
  const currentDate = currentLeagueDate();
  return `
    <h1 class="page-title">games</h1>
    <section class="card calendar-toolbar">
      <div>
        <div class="card-label">${save.season}-${String(save.season + 1).slice(-2)} regular season</div>
        <div class="player-name">${escapeHtml(activeTeam().city)} ${escapeHtml(activeTeam().name)} Schedule</div>
        <div class="meta">Season date: ${currentDate ? formatGameDate(currentDate) : "Season complete"} - ${completed} of ${schedule.length} games played - ${activeTeam().wins} W / ${activeTeam().losses} L</div>
      </div>
      <div class="calendar-nav">
        <button class="icon-btn" data-calendar-shift="-1" title="Previous month" aria-label="Previous month">&lt;</button>
        <strong>${new Date(year, month - 1, 1).toLocaleDateString([], { month: "long", year: "numeric" })}</strong>
        <button class="icon-btn" data-calendar-shift="1" title="Next month" aria-label="Next month">&gt;</button>
      </div>
      <div class="sim-controls"><button class="btn" data-sim-control="next">Next Game</button><button class="btn" data-sim-control="week">1 Week</button><button class="btn" data-sim-control="month">1 Month</button><button class="btn" data-sim-control="decision">Next Decision</button></div>
    </section>
    <section class="card season-calendar">
      <div class="calendar-weekdays">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="calendar-grid">${calendarCells(year, month, monthGames, monthEvents, monthTransactions, selected?.id, selectedEvent?.id, selectedTransaction?.id)}</div>
    </section>
    ${seasonFeatureStrip()}
    <section class="grid-2 game-center-grid">
      ${selectedTransaction ? transactionEventCard(selectedTransaction) : selectedEvent ? seasonEventCard(selectedEvent) : selected ? gameMatchupCard(selected) : '<section class="card card-pad"><div class="muted-line">No game selected.</div></section>'}
      ${seasonSummaryCard(schedule)}
    </section>
    ${!selectedEvent && !selectedTransaction && selected?.played ? playerBoxScorePanel(selected) : ""}
  `;
}

function strategyPage() {
  const plan = gamePlan(save.activeTeamId);
  const presets = save.gamePlanPresets?.[save.activeTeamId] || [];
  const next = nextGameForTeam(save.activeTeamId) || [...save.schedule].sort((a, b) => a.date.localeCompare(b.date)).find((game) => !game.played);
  const opponentId = next ? next.home === save.activeTeamId ? next.away : next.home : null;
  const opponent = opponentId ? getTeam(opponentId) : null;
  const team = activeTeam();
  const theirPlan = opponentId ? gamePlan(opponentId) : null;
  const advice = opponentId ? tacticalAdvice(save.activeTeamId, opponentId) : "Save a balanced plan before the next game is scheduled.";
  const fit = gamePlanFit(save.activeTeamId, plan);
  const threats = opponentId ? teamPlayers(opponentId).sort((a, b) => b.ovr - a.ovr).slice(0, 4) : [];
  const defenders = teamPlayers(save.activeTeamId).filter((player) => isPlayerGameEligible(player).ok).sort((a, b) => b.def - a.def).slice(0, 5);
  return `<section class="gameplan-page phase6-screen phase6-gameplan-screen">
    <section class="gameplan-summary-grid">
      <article class="gameplan-matchup-card">
        <span>Next Opponent</span>
        <div>${teamLogo(team, "gameplan-team-logo")}<b>vs</b>${opponent ? teamLogo(opponent, "gameplan-team-logo") : ""}</div>
        <strong>${escapeHtml(team.abbr)} ${opponent ? `vs ${escapeHtml(opponent.abbr)}` : ""}</strong>
        <small>${next ? `${formatShortDate(next.date)} - ${next.home === save.activeTeamId ? "Home" : "Away"} game` : "Schedule pending"}</small>
      </article>
      ${gameplanSummaryCard("Offensive Style", gameplanOffenseLabel(plan.offense), "Create advantages in the half court.", "blue")}
      ${gameplanSummaryCard("Defensive Style", gameplanDefenseLabel(plan.defense), "Contest shots and force tough looks.", "green")}
      ${gameplanSummaryCard("Pace", gameplanPaceLabel(plan.pace), "Moderate tempo, control possessions.", "orange")}
    </section>
    <nav class="gameplan-tabs"><button class="active">Offensive Plan</button><button>Defensive Plan</button><button>Pace & Style</button><button>Shot Profile</button><button>Matchups</button><button>Late Game Plan</button><button>Playbook</button></nav>
    <section class="gameplan-main-layout">
      <main class="gameplan-main">
        <section class="gameplan-card gameplan-offense-card">
          <div class="gameplan-control-column">
            ${strategySelect("Offensive Style", "offense", plan.offense, ["balanced", "rim", "perimeter", "stars", "ball movement"])}
            <div class="gameplan-pill-group"><span>Shot Focus</span>${gameplanPlanButton("rim", "Attack Paint", plan.offense === "rim")}${gameplanPlanButton("balanced", "Balanced", plan.offense === "balanced")}${gameplanPlanButton("perimeter", "Hunt 3s", plan.offense === "perimeter")}</div>
            ${gameplanToggle("Feed Star Early", "Get our best player involved early.", plan.offense === "stars")}
            ${gameplanToggle("Push After Misses", "Look to run in transition.", plan.transition === "run")}
            ${gameplanToggle("Crash Offensive Glass", "Attack the offensive boards.", plan.rebounding === "crash glass")}
          </div>
          <div class="gameplan-action-column">
            <span>Primary Actions (Pick 2)</span>
            <div class="gameplan-action-grid">${["Pick & Roll", "Post Ups", "Handoff", "Isolation", "Off Screen", "Off Rebounds"].map((label, index) => `<button class="${index === 0 || (plan.offense === "stars" && index === 3) ? "active" : ""}">${escapeHtml(label)}</button>`).join("")}</div>
            <label class="gameplan-range"><span>Set Frequency</span><input type="range" min="0" max="100" value="${plan.offense === "stars" ? 86 : plan.offense === "balanced" ? 55 : 72}"><b>High</b><small>Run actions more often to create advantages.</small></label>
          </div>
          <div class="gameplan-scout-card">
            <header>${opponent ? teamLogo(opponent, "gameplan-scout-logo") : ""}<strong>Scout Report: ${opponent ? `${escapeHtml(opponent.city)} ${escapeHtml(opponent.name)}` : "Next Opponent"}</strong></header>
            ${gameplanScoutLine("Strengths", opponent ? `${gameplanOffenseLabel(theirPlan.offense)} offense, ${gameplanPaceLabel(theirPlan.pace).toLowerCase()} pace.` : "Opponent pending.", "green")}
            ${gameplanScoutLine("Weaknesses", opponent ? gameplanWeakness(theirPlan) : "No scouting available.", "red")}
            ${gameplanScoutLine("Pace Tendency", opponent ? gameplanPaceLabel(theirPlan.pace) : "Unknown", "orange")}
            ${gameplanScoutLine("Scout Recommendation", advice, "blue")}
          </div>
        </section>
        <section class="gameplan-lower-grid">
          <article class="gameplan-card">${strategySelect("Pace", "pace", plan.pace, ["slow", "balanced", "fast"])}<div class="gameplan-range stack"><span>Tempo</span><input type="range" min="0" max="100" value="${plan.pace === "fast" ? 78 : plan.pace === "slow" ? 32 : 55}"><b>100</b></div><div class="gameplan-pill-group"><span>Playstyle Emphasis</span>${gameplanPlanButton("space", "Space The Floor", plan.offense === "perimeter")}${gameplanPlanButton("rim", "Attack The Rim", plan.offense === "rim")}${gameplanPlanButton("move", "Move The Ball", plan.offense === "ball movement")}</div>${strategySelect("Transition Focus", "transition", plan.transition, ["get back", "balanced", "run"])}</article>
          <article class="gameplan-card gameplan-shot-profile">${gameplanShotBar("3PT Rate", plan.offense === "perimeter" ? 48 : 38, "League Avg: 38%")}${gameplanShotBar("Mid-Range Rate", plan.offense === "stars" ? 28 : 22, "League Avg: 20%")}${gameplanShotBar("At Rim Rate", plan.offense === "rim" ? 52 : 38, "League Avg: 42%")}${gameplanToggle("Shot Quality Over Quantity", "Prioritize good shots over volume.", true)}</article>
          <article class="gameplan-card">${strategySelect("Score Margin", "closing", plan.closing, ["best overall", "offense", "defense", "shooting"])}${strategySelect("Time Remaining", "minutesLimit", String(plan.minutesLimit), ["none", "32", "28", "24"])}<div class="gameplan-pill-group"><span>Strategy</span>${gameplanPlanButton("tie", "Play For A Tie", false)}${gameplanPlanButton("lead", "Small Lead", true)}${gameplanPlanButton("protect", "Protect A Lead", plan.defense === "zone")}</div>${strategySelect("Foul Strategy", "load", plan.load, ["none", "light", "moderate", "aggressive"])}</article>
          <article class="gameplan-card">${strategySelect("Offensive Playbook", "stagger", plan.stagger, ["balanced", "always one star", "second unit"])}${strategySelect("Defensive Playbook", "defense", plan.defense, ["drop", "switch", "pressure", "zone"])}${strategySelect("Inbound Play", "rebounding", plan.rebounding, ["protect transition", "balanced", "crash glass"])}<button class="gameplan-manage">Manage Playbook</button></article>
        </section>
        <section class="gameplan-bottom-grid">
          <section class="gameplan-card matchup-assignments"><header><h2>Matchup Assignments</h2></header>${threats.map((threat, index) => `<article><span>${playerHeadshot(threat, "gameplan-threat-shot")}<b>${escapeHtml(threat.name)}</b><small>${escapeHtml(threat.pos)}</small></span><span>${playerHeadshot(defenders[index] || defenders[0], "gameplan-threat-shot")}<b>${escapeHtml((defenders[index] || defenders[0])?.name || "Best Defender")}</b><small>${escapeHtml((defenders[index] || defenders[0])?.pos || "")}</small></span><select><option>${index === 0 ? "Deny Post" : index === 1 ? "Go Over Screens" : "Stay Attached"}</option></select></article>`).join("") || '<div class="muted-line">No matchup data yet.</div>'}</section>
          <section class="gameplan-card coach-recommendations"><header><h2>Coach Recommendations</h2></header>${["Head Coach|Run more pick and roll with your best creator.", "Defensive Coach|Protect the perimeter and avoid over-helping.", "Analytics|Attack in transition after misses."].map((line) => { const [title, text] = line.split("|"); return `<article><b>${escapeHtml(title)}</b><span>${escapeHtml(text)}</span></article>`; }).join("")}</section>
        </section>
      </main>
      <aside class="gameplan-rail">
        <section class="gameplan-card action-center"><header><h2>Gameplan Action Center</h2></header>${gameplanAction("Opponent Weak Rim Protection", "They allow high efficiency at the rim.", "Attack Paint", "Pick & Roll")}${gameplanAction("Star Matchup Problem", "Their best defender is on your star.", "Change Matchup", "Send Help")}${gameplanAction("Bench Advantage", "Our bench outperforms theirs.", "Stagger Star", "Push Bench Pace")}${gameplanAction("Clutch Concern", "Close games have been a struggle.", "Set Closing Lineup", "Late Game Plan")}</section>
        <section class="gameplan-card opponent-threats"><header><h2>Opponent Threats</h2></header>${threats.map((player, index) => `<article>${playerHeadshot(player, "gameplan-threat-shot")}<div><b>${escapeHtml(player.name)}</b><span>${escapeHtml(player.pos)} - ${player.ovr} OVR</span></div><em>${["Primary Creator", "3PT Threat", "Paint Finisher", "Hot Streak"][index] || "Threat"}</em></article>`).join("") || '<div class="muted-line">Opponent threats will appear before the next game.</div>'}</section>
      </aside>
    </section>
    <footer class="gameplan-footer"><button>Reset Plan</button><button data-action="save-plan-preset">Save Preset</button><button class="primary gameplan-coach-plan" data-action="auto-game-plan">Use Coach Plan</button><button class="icon-button gameplan-save-shortcut">S</button><div><b>${fit}</b><span>${fit >= 75 ? "Good Fit" : "Needs Tuning"}</span><small>Plan matches our strengths.</small></div><button class="primary" data-action="save-game-plan">Sim Game With Gameplan</button></footer>
  </section>`;
}

function gameplanSummaryCard(label, value, detail, tone) {
  return `<article class="gameplan-summary-card ${tone}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(detail)}</small></article>`;
}

function gameplanOffenseLabel(value) {
  return ({ balanced: "Balanced", rim: "Attack Paint", perimeter: "Hunt 3s", stars: "Star Heavy", "ball movement": "Motion Heavy" })[value] || "Balanced";
}

function gameplanDefenseLabel(value) {
  return ({ drop: "Protect Paint", switch: "Switch Everything", pressure: "Pressure Ball", zone: "Zone Coverage" })[value] || "Protect Perimeter";
}

function gameplanPaceLabel(value) {
  return ({ slow: "Slow", balanced: "Balanced", fast: "Fast" })[value] || "Balanced";
}

function gameplanPlanButton(value, label, active) {
  return `<button class="${active ? "active" : ""}" data-plan-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
}

function gameplanToggle(label, detail, active) {
  return `<label class="gameplan-toggle"><input type="checkbox" ${active ? "checked" : ""}><span>${escapeHtml(label)}<small>${escapeHtml(detail)}</small></span></label>`;
}

function gameplanScoutLine(label, detail, tone) {
  return `<article class="${escapeHtml(tone)}"><b>${escapeHtml(label)}</b><span>${escapeHtml(detail)}</span></article>`;
}

function gameplanWeakness(plan) {
  if (plan.defense === "drop") return "Allows pull-up threes and pick-and-pop looks.";
  if (plan.defense === "switch") return "Can be punished with size mismatches.";
  if (plan.pace === "fast") return "Turnovers under pressure, transition defense.";
  return "Can be moved with pace and extra passes.";
}

function gameplanShotBar(label, value, sub) {
  return `<div class="gameplan-shot-bar"><span>${escapeHtml(label)}</span><i><b style="width:${Math.max(5, Math.min(100, value))}%"></b></i><strong>${value}%</strong><small>${escapeHtml(sub)}</small></div>`;
}

function gameplanAction(title, detail, primary, secondary) {
  return `<article><div><b>${escapeHtml(title)}</b><span>${escapeHtml(detail)}</span></div><footer><button>${escapeHtml(primary)}</button><button>${escapeHtml(secondary)}</button></footer></article>`;
}

function rotationPage() {
  return `
    <section class="phase6-screen phase6-rotation-screen">
    <h1 class="page-title rotation-page-title">rotation</h1>
    ${rotationManagementPanel()}
    </section>
  `;
}

function strategySelect(label, key, value, options) {
  return `<label class="strategy-control"><span>${escapeHtml(label)}</span><select data-plan-field="${key}">${options.map((option) => `<option value="${escapeHtml(option)}" ${String(value) === String(option) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></label>`;
}

function matchupScoutingCard(game) {
  const opponentId = game.home === save.activeTeamId ? game.away : game.home;
  const opponent = getTeam(opponentId);
  const theirPlan = gamePlan(opponentId);
  const advice = tacticalAdvice(save.activeTeamId, opponentId);
  return `<section class="card card-pad matchup-scout"><div><div class="card-label">opponent report</div><div class="player-name">${escapeHtml(opponent.city)} ${escapeHtml(opponent.name)}</div><div class="meta">Expected ${escapeHtml(theirPlan.pace)} pace, ${escapeHtml(theirPlan.offense)} offense, ${escapeHtml(theirPlan.defense)} coverage.</div></div><div class="tactical-advice"><strong>Staff Recommendation</strong><span>${escapeHtml(advice)}</span></div></section>`;
}

function lockerRoomPage() {
  const team = activeTeam();
  const room = lockerRoom(save.activeTeamId);
  const players = teamPlayers(save.activeTeamId).sort((a, b) => lockerConcernScore(b) - lockerConcernScore(a));
  const leaders = [...players].sort((a, b) => lockerLeadershipScore(b) - lockerLeadershipScore(a)).slice(0, 12);
  const issues = players.filter((player) => Number(player.dissatisfaction?.level || 0) > 0).slice(0, 5);
  const actionItems = lockerActionItems(players, issues);
  const avgMorale = Math.round(players.reduce((sum, player) => sum + Number(player.morale || 75), 0) / Math.max(1, players.length));
  const leadership = Math.round(leaders.slice(0, 5).reduce((sum, player) => sum + lockerLeadershipScore(player), 0) / Math.max(1, Math.min(5, leaders.length)));
  const risk = Math.min(99, issues.reduce((sum, player) => sum + Number(player.dissatisfaction?.level || 0) * 9, 0));
  const factors = lockerChemistryFactors(room, players, avgMorale, leadership);
  return `
    <section class="locker-room-page">
      <header class="locker-room-header">
        <div>${teamLogo(team, "locker-room-team-logo")}<div><h1>LOCKER ROOM</h1><p>Manage team chemistry, handle issues, and keep the locker room united.</p></div></div>
        <div><button class="btn primary" data-player-meeting="${leaders[0]?.id || players[0]?.id || ""}" ${players.length ? "" : "disabled"}>Team Meeting</button><button class="btn" data-action="go-games">Calendar</button></div>
      </header>
      <section class="locker-room-metrics">
        ${lockerMetricCard("Team Chemistry", room.chemistry, "/ 100", chemistryLabel(room.chemistry), "+4 from last week", "green")}
        ${lockerMetricCard("Team Morale", avgMorale, "/ 100", avgMorale >= 70 ? "Positive" : "Fragile", "+3 from last week", "blue")}
        ${lockerMetricCard("Leadership", leadership, "/ 100", leadership >= 78 ? "Strong" : "Developing", "+2 from last week", "purple")}
        ${lockerMetricCard("Disruption Risk", risk, "", risk >= 45 ? "High" : risk >= 22 ? "Medium" : "Low", `${issues.length} active issue${issues.length === 1 ? "" : "s"}`, "orange")}
      </section>
      <nav class="locker-room-tabs"><button class="active">Overview</button><button>Players</button><button>Leadership</button><button>Groups</button><button>Promises</button><button>History</button></nav>
      <section class="locker-room-layout">
        <main class="locker-room-main">
          <section class="card locker-panel locker-leadership-panel"><header><strong>Team Leadership Hierarchy</strong><span>Influence</span></header><div>${leaders.map((player, index) => lockerLeaderRow(player, index)).join("")}</div></section>
          <section class="card locker-panel locker-factors-panel"><header><strong>Team Chemistry Factors</strong><button class="mini-action">View Details</button></header><div>${factors.map(lockerFactorRow).join("")}</div></section>
          <section class="card locker-panel locker-morale-panel"><header><strong>Player Morale</strong><span>Concern</span></header><div>${players.slice(0, 14).map(lockerMoraleRow).join("")}</div></section>
          <section class="card locker-panel locker-groups-panel"><header><strong>Social Groups</strong><button class="mini-action">View Groups</button></header><div>${lockerGroupRows(players).map(lockerGroupRow).join("")}</div></section>
        </main>
        <aside class="locker-action-center">
          <section class="card locker-panel"><header><strong>Action Center</strong><b>${actionItems.length}</b><button class="mini-action">View All</button></header><div class="locker-issue-list">${actionItems.map(lockerIssueCardV2).join("") || '<div class="muted-line">No active locker room issues.</div>'}</div></section>
          <section class="card locker-advice-card">${players[0] ? playerHeadshot(players[0], "locker-advice-headshot") : ""}<div><strong>Staff Advice</strong><small>Assistant Coach</small><p>${issues.length ? "The bench unit needs clear roles. A meeting or rotation change could help." : "The room is steady. Keep roles clear and reinforce leadership."}</p></div><button class="btn">View All Advice</button></section>
          <section class="card locker-quick-actions"><header><strong>Quick Actions</strong></header><div><button class="btn" data-player-meeting="${leaders[0]?.id || players[0]?.id || ""}" ${players.length ? "" : "disabled"}>Team Meeting</button><button class="btn" data-player-meeting="${issues[0]?.id || players[0]?.id || ""}" ${players.length ? "" : "disabled"}>Talk To Player</button><button class="btn">Make Promise</button><button class="btn">Assign Mentor</button><button class="btn" data-player-meeting="${leaders[0]?.id || players[0]?.id || ""}" ${leaders.length ? "" : "disabled"}>Ask Leader</button></div></section>
        </aside>
      </section>
      <section class="card locker-recent-events">${lockerRecentEvents(players, issues)}</section>
    </section>
  `;
}

function lockerPlayerCard(player) {
  const desired = player.preferredRole || inferPreferredRole(player);
  const promised = player.promisedRole || "none";
  const concern = player.dissatisfaction || { level: 0, reason: "Content" };
  return `<section class="card locker-player ${concern.level >= 3 ? "critical" : concern.level ? "concern" : ""}">
    <div class="locker-player-main"><div><div class="card-label">${escapeHtml(player.personality || "professional")} - ${escapeHtml(player.leadership || "steady")}</div><div class="player-name">${escapeHtml(player.name)}</div><div class="meta">${escapeHtml(player.pos)} - ${player.ovr} OVR - Morale ${player.morale} - ${escapeHtml(desired)} role expected</div></div><div class="morale-badge">${player.morale}</div></div>
    <div class="morale-reasons">${(player.moraleHistory || []).slice(-3).reverse().map((item) => `<span class="${item.change >= 0 ? "positive" : "negative"}">${item.change > 0 ? "+" : ""}${item.change} ${escapeHtml(item.reason)}</span>`).join("") || '<span>No recent morale changes</span>'}</div>
    <div class="locker-actions"><label><span>Promised role</span><select data-role-promise="${player.id}">${["none", "franchise", "starter", "sixth man", "rotation", "prospect", "depth"].map((role) => `<option value="${role}" ${promised === role ? "selected" : ""}>${role}</option>`).join("")}</select></label><div><strong>${escapeHtml(dissatisfactionLabel(concern.level))}</strong><span>${escapeHtml(concern.reason || "Content")}</span></div><button class="btn" data-player-meeting="${player.id}">Hold Meeting</button><button class="btn" data-view-player="${player.id}">View Card</button></div>
  </section>`;
}

function lockerMetricCard(label, value, suffix, status, trend, tone) {
  return `<article class="card locker-metric-card ${tone}"><div class="locker-ring" style="--metric:${Math.max(0, Math.min(100, value))}%"><strong>${value}</strong></div><div><span>${escapeHtml(label)}</span><strong>${value}<small>${escapeHtml(suffix)}</small></strong><b>${escapeHtml(status)}</b><em>${escapeHtml(trend)}</em></div><i><b style="width:${Math.max(0, Math.min(100, value))}%"></b></i></article>`;
}

function lockerLeadershipScore(player) {
  return Math.round(Math.min(99, player.ovr * .62 + player.age * .75 + (player.personality === "mentor" ? 14 : 0) + (player.leadership === "vocal" ? 7 : player.leadership === "steady" ? 4 : 0)));
}

function lockerLeaderRow(player, index) {
  const tiers = ["Team Leaders", "Team Leaders", "Core Leaders", "Core Leaders", "Important Players", "Important Players", "Role Players", "Role Players"];
  const showTier = index === 0 || tiers[index] !== tiers[index - 1];
  return `${showTier ? `<h4>${escapeHtml(tiers[index])}</h4>` : ""}<article>${playerHeadshot(player, "locker-small-headshot")}<span><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)}</small></span><b>${lockerLeadershipScore(player)}</b></article>`;
}

function lockerChemistryFactors(room, players, avgMorale, leadership) {
  const roleAcceptance = Math.round(players.reduce((sum, player) => sum + (roleRank(actualPlayerRole(player)) >= roleRank(player.promisedRole !== "none" ? player.promisedRole : player.preferredRole) ? 88 : 58), 0) / Math.max(1, players.length));
  return [
    { label: "Trust", note: "Players believe in each other.", value: room.chemistry },
    { label: "Communication", note: "The team communicates well.", value: Math.round((leadership + room.chemistry) / 2) },
    { label: "Role Acceptance", note: "Players accept their roles.", value: roleAcceptance },
    { label: "Commitment", note: "Players are committed to winning.", value: avgMorale },
    { label: "Togetherness", note: "Players enjoy being around each other.", value: Math.round(room.continuity) }
  ];
}

function lockerFactorRow(factor) {
  return `<article><span><strong>${escapeHtml(factor.label)}</strong><small>${escapeHtml(factor.note)}</small></span><i><b style="width:${Math.max(0, Math.min(100, factor.value))}%"></b></i><em>${factor.value}</em></article>`;
}

function lockerMoraleRow(player) {
  const concern = player.dissatisfaction || { level: 0, reason: "" };
  const morale = Number(player.morale || 75);
  const label = morale >= 86 ? "Very Happy" : morale >= 72 ? "Happy" : morale >= 58 ? "Content" : morale >= 42 ? "Concerned" : "Unhappy";
  return `<article>${playerHeadshot(player, "locker-small-headshot")}<span><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} - ${escapeHtml(actualPlayerRole(player))}</small></span><b class="${morale < 55 ? "bad" : "ok"}">${escapeHtml(label)}</b><em class="${concern.level ? "negative" : "positive"}">${concern.level ? "▼" : "▲"}</em><small>${escapeHtml(concern.level ? concern.reason : "-")}</small></article>`;
}

function lockerGroupRows(players) {
  const vets = players.filter((player) => player.age >= 28).slice(0, 5);
  const young = players.filter((player) => player.age <= 24).slice(0, 5);
  const bench = players.filter((player) => !player.starter && player.minutes > 0).slice(0, 5);
  return [
    { name: "Veteran Core", players: vets, status: "Settled", value: 72 },
    { name: "Bench Unit", players: bench, status: "On Track", value: 58 },
    { name: "Young Group", players: young, status: "Building", value: 64 }
  ].filter((group) => group.players.length);
}

function lockerGroupRow(group) {
  return `<article><div>${group.players.map((player) => playerHeadshot(player, "locker-avatar-stack")).join("")}</div><span><strong>${escapeHtml(group.name)}</strong><small>${group.players.length} Players</small><i><b style="width:${group.value}%"></b></i></span><em>${escapeHtml(group.status)}</em></article>`;
}

function lockerActionItems(players, issues) {
  const used = new Set();
  const items = [];
  const add = (player, type, level = 1) => {
    if (!player || used.has(`${player.id}:${type}`)) return;
    used.add(`${player.id}:${type}`);
    items.push({ player, type, level });
  };
  issues.forEach((player, index) => add(player, ["playing", "contract", "mentor", "bench", "adjustment"][index] || "playing", Number(player.dissatisfaction?.level || 1)));
  const byMorale = [...players].sort((a, b) => Number(a.morale || 75) - Number(b.morale || 75));
  const rookies = players.filter((player) => player.age <= 23).sort((a, b) => b.pot - a.pot);
  const bench = players.filter((player) => !player.starter && player.minutes > 0).sort((a, b) => Number(a.morale || 75) - Number(b.morale || 75));
  add(byMorale[0], "playing", 3);
  add(players.find((player) => Number(player.contract?.endSeason || 9999) <= save.season + 1), "contract", 2);
  add(rookies[0], "mentor", 2);
  add(bench[0], "bench", 1);
  add(players.find((player) => player.age >= 28), "adjustment", 1);
  const types = ["playing", "contract", "mentor", "bench", "adjustment"];
  [...players].sort((a, b) => Number(a.morale || 75) - Number(b.morale || 75)).slice(0, 12).forEach((player, index) => {
    add(player, types[index % types.length], Math.max(1, Number(player.dissatisfaction?.level || 0) || (index % 3) + 1));
  });
  return items.slice(0, 9);
}

function lockerIssueCardV2(item) {
  const player = item.player || item;
  const level = Number(item.level || player.dissatisfaction?.level || 1);
  const severity = level >= 3 ? "High" : level >= 2 ? "Medium" : "Low";
  const profiles = {
    playing: ["Playing Time Dispute", `${player.name} is unhappy with his playing time.`, "Talk To Player", "Adjust Rotation", "high"],
    contract: ["Contract Anxiety", `${player.name} is focused on his contract year.`, "Reassure Player", "Discuss Extension", "medium"],
    mentor: ["Rookie Needs Mentor", `${player.name} could benefit from a mentor.`, "Assign Mentor", "Send To G League", "medium"],
    bench: ["Bench Unit Morale Dropping", "Bench players want clearer roles.", "Bench Meeting", "Clarify Roles", "low"],
    adjustment: ["New Player Adjustment", `${player.name} is adjusting to the system.`, "Check In With Player", "Give More Time", "positive"]
  };
  const [title, detail, primary, secondary, tone] = profiles[item.type] || profiles.playing;
  return `<article class="${escapeHtml(tone)}"><i>${escapeHtml(title.slice(0, 1))}</i><div><span>${escapeHtml(title)} <b>${escapeHtml(severity)}</b></span><strong>${escapeHtml(detail)}</strong><small>Impact: -${Math.max(1, level + 1)} Morale | -${Math.max(1, level)} Chemistry</small><div><button class="btn primary" data-player-meeting="${player.id}">${escapeHtml(primary)}</button><button class="btn" data-view-player="${player.id}">${escapeHtml(secondary)}</button><button class="btn locker-menu-button" data-view-player="${player.id}">...</button></div></div>${playerHeadshot(player, "locker-issue-headshot")}</article>`;
}

function lockerRecentEvents(players, issues) {
  const leader = [...players].sort((a, b) => lockerLeadershipScore(b) - lockerLeadershipScore(a))[0];
  const unhappy = issues[0] || players.find((player) => Number(player.morale || 75) < 60);
  const rumor = players.find((player) => Number(player.dissatisfaction?.level || 0) >= 2) || players[1];
  const items = [
    ["+2", leader ? `${leader.name} praised the team in interview` : "Leadership group stayed aligned", "positive"],
    ["-3", unhappy ? `${unhappy.name} wants clearer role` : "Bench players monitoring roles", "negative"],
    ["-2", rumor ? `Trade rumors affecting ${rumor.name}` : "Rumors affecting veterans", "negative"]
  ];
  return `${items.map(([impact, text, tone]) => `<article><b class="${tone}">${escapeHtml(impact)}</b><span>${escapeHtml(text)}</span></article>`).join("")}<button class="mini-action">View All</button>`;
}

function lockerIssueCard(player) {
  const concern = player.dissatisfaction || { level: 0, reason: "" };
  const severity = concern.level >= 3 ? "High" : concern.level >= 2 ? "Medium" : "Low";
  const title = concern.reason?.toLowerCase().includes("role") ? "Role Clarity Issue" : player.morale < 45 ? "Morale Dropping" : "Locker Room Concern";
  return `<article class="${concern.level >= 3 ? "high" : concern.level >= 2 ? "medium" : "low"}"><div><span>${escapeHtml(title)} <b>${escapeHtml(severity)}</b></span><strong>${escapeHtml(player.name)} needs attention.</strong><small>Impact: -${concern.level + 1} Chemistry | -${concern.level + 2} Morale</small><div><button class="btn primary" data-player-meeting="${player.id}">Talk To Player</button><button class="btn" data-view-player="${player.id}">View Card</button></div></div>${playerHeadshot(player, "locker-issue-headshot")}</article>`;
}

function scoutingOfficePage() {
  const department = scoutingDepartment(save.activeTeamId);
  const candidates = save.offseason?.draftClass?.length ? save.offseason.draftClass : scoutingPlayerPool();
  const search = normalizeText(globalSearch);
  const filtered = candidates.filter((player) => !search || normalizeText(player.name).includes(search)).slice(0, 45);
  const selected = filtered[0] || candidates[0];
  const reportsDue = filtered.filter((player) => scoutingReport(player).confidence < 70).length;
  const scoutCount = Math.max(6, Math.min(10, Math.round((department.college + department.international + department.analytics) / 26)));
  const coverage = Math.round((department.college + department.international + department.medical + department.analytics) / 4);
  const accuracy = Math.max(62, Math.min(92, Math.round((department.analytics + department.medical) / 2)));
  return `
    <section class="scouting-page">
      <header class="scouting-page-header"><div><h1>SCOUTING</h1><p>Discover talent, evaluate players, and build your draft board.</p></div><div><button class="btn primary">Scouting Staff</button><button class="btn">Draft War Room</button></div></header>
      <section class="scouting-metrics">
        ${scoutingMetricCard("Scouting Coverage", coverage >= 82 ? "Very Good" : "Good", `${Math.max(70, coverage)}% of regions`, coverage, "blue")}
        ${scoutingMetricCard("Scouts", `${scoutCount} / 10`, `${Math.max(0, 10 - scoutCount)} Available`, scoutCount * 10, "blue")}
        ${scoutingMetricCard("Active Assignments", Math.min(9, Math.max(3, reportsDue)), `${Math.min(3, reportsDue)} Reports Due Soon`, Math.min(100, reportsDue * 16), "orange")}
        ${scoutingMetricCard("Draft Board", filtered.length || candidates.length, "Players Tracked", Math.min(100, (filtered.length || candidates.length) * 2), "purple")}
        ${scoutingMetricCard("Scout Accuracy (Last 3 Yrs)", `${accuracy}%`, "Above League Avg", accuracy, "green")}
      </section>
      <nav class="scouting-tabs"><button class="active">Overview</button><button>Draft Board</button><button>NBA Players</button><button>International</button><button>Assignments</button><button>Watchlist</button><button>History</button></nav>
      <section class="scouting-board-layout">
        <section class="card scouting-draft-board">
          <header><strong>Draft Board</strong><div class="actions"><input id="global-player-search" value="${escapeHtml(globalSearch)}" placeholder="Search players"><button class="btn" data-action="global-search">Search</button></div></header>
          <div class="scouting-board-head"><span>Rank</span><span>Player</span><span>Pos</span><span>OVR Range</span><span>Potential</span><span>Confidence</span><span>Trend</span></div>
          <div>${filtered.slice(0, 9).map((player, index) => scoutingDraftRow(player, index, selected?.id === player.id)).join("") || '<div class="muted-line">No matching players.</div>'}</div>
          <button class="mini-action">View Full Draft Board</button>
        </section>
        ${selected ? scoutingSelectedPanel(selected) : '<section class="card scouting-selected-panel"><div class="muted-line">No players available.</div></section>'}
        <aside class="scouting-right-rail">
          <section class="card scouting-action-center"><header><strong>Scouting Action Center</strong><b>${Math.min(9, Math.max(4, reportsDue))}</b><button class="mini-action">View All</button></header>${scoutingActionItems(filtered).map(scoutingActionCard).join("")}</section>
          <section class="card scouting-assignments"><header><strong>Scout Assignments</strong><button class="mini-action">View All</button></header>${scoutingAssignmentRows(filtered, department)}</section>
        </aside>
        <section class="scouting-bottom-grid">
          <section class="card scouting-team-summary scouting-bottom-team-summary"><header><strong>Scouting Team Summary</strong><button class="mini-action">View Staff</button></header>${scoutingStaffCards(department)}</section>
          <section class="card scouting-staff-recs"><header><strong>Staff Recommendations</strong><button class="mini-action">View All</button></header>${scoutingRecommendationRows(filtered)}</section>
          ${scoutingComparisonWidget(filtered)}
        </section>
      </section>
    </section>
    ${comparisonPanel()}
  `;
}

function scoutingMetricCard(label, value, note, percent, tone) {
  return `<article class="card scouting-metric-card ${tone}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong><small>${escapeHtml(note)}</small><i><b style="width:${Math.max(0, Math.min(100, Number(percent) || 0))}%"></b></i></article>`;
}

function scoutingDraftRow(player, index, activeRow = false) {
  const report = scoutingReport(player);
  const trend = report.confidence >= 72 ? "up" : report.confidence < 52 ? "down" : "flat";
  return `<button class="${activeRow ? "active" : ""}" data-view-player="${player.id}">
    <b>${index + 1}</b>
    <span>${playerHeadshot(player, "scouting-row-headshot")}<em><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.college || teamName(player.teamId) || "Prospect")}</small></em></span>
    <i>${escapeHtml(player.pos || "G/F")}</i>
    <i>${escapeHtml(report.overall)}</i>
    <i>${escapeHtml(report.potential)}</i>
    <i>${report.confidence}%</i>
    <i class="${trend}">${trend === "up" ? "^" : trend === "down" ? "v" : "-"}</i>
  </button>`;
}

function scoutingSelectedPanel(player) {
  const report = scoutingReport(player);
  const fit = Math.max(55, Math.min(98, Math.round((Number(player.pot || 75) + report.confidence) / 2)));
  const comparison = scoutingPlayerPool().find((candidate) => candidate.pos === player.pos && candidate.ovr >= 76) || scoutingPlayerPool()[0];
  const watched = save.watchlist.includes(player.id);
  return `<section class="card scouting-selected-panel">
    <header>${playerHeadshot(player, "scouting-selected-headshot")}<div><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos || "G/F")} | ${escapeHtml(player.college || "USA")} | ${player.age || 19} years old</small><small>${escapeHtml(player.height || "6'7")} | ${player.weight || 205} lbs</small></div><aside><span>Scout Confidence</span><b>${report.confidence}%</b><small>Report Complete in 5 Days</small></aside></header>
    <div class="scouting-profile-chips"><span>Archetype <b>${escapeHtml(player.archetype || "Two-Way Wing")}</b></span><span>Comparison <b>${escapeHtml(comparison?.name || "NBA Starter")}</b></span><span>Draft Range <b>Top ${Math.max(1, Math.min(12, 100 - Number(player.pot || 88)))}</b></span><span>Recommendation <b>Top 3 Pick</b></span></div>
    <nav class="scouting-report-tabs"><button class="active">Scouting Report</button><button>Attributes</button><button>Medical</button><button>Interview</button><button>Workouts</button><button>Fit & Role</button></nav>
    <section class="scouting-report-grid">
      <article><span>Scouted Overall</span><strong>${escapeHtml(report.overall)}</strong><small>Likely range: ${escapeHtml(report.overall)}</small></article>
      <article><span>Scouted Potential</span><strong>${escapeHtml(report.potential)}</strong><small>${Number(player.pot || 0) >= 90 ? "Franchise Superstar" : "High-level starter"}</small></article>
      <article><span>Risk Level</span><strong>${report.confidence >= 70 ? "Low" : "Medium"}</strong><small>${report.confidence >= 70 ? "High floor, high upside" : "More reports needed"}</small></article>
    </section>
    <section class="scouting-fit-grid">
      <article><span>Fit With ${escapeHtml(teamName(save.activeTeamId))}</span><strong>${fit >= 88 ? "A+" : fit >= 80 ? "A" : "B+"}</strong><small>Position</small><small>Timeline</small><small>Culture</small></article>
      <article><span>Strengths</span>${["Elite two-way potential", "High basketball IQ", "Competitive and coachable", "Great size and mobility"].map((item) => `<small>+ ${escapeHtml(item)}</small>`).join("")}</article>
      <article><span>Concerns</span>${["Shooting consistency", "Strength against bigger players", "Slight frame for NBA early"].map((item) => `<small>! ${escapeHtml(item)}</small>`).join("")}</article>
    </section>
    <section class="scouting-next-steps"><button class="btn primary" data-scout-player="${player.id}">Scout More</button><button class="btn ${watched ? "primary" : ""}" data-watch-player="${player.id}">${watched ? "Watching" : "Add Watchlist"}</button><button class="btn" data-compare-player="${player.id}">Compare</button><button class="btn" data-view-player="${player.id}">View Profile</button></section>
  </section>`;
}

function scoutingActionItems(players) {
  const source = players.length ? players : scoutingPlayerPool();
  return source.slice(0, 5).map((player, index) => ({ player, title: ["Scout Confidence Low", "Workout Available", "International Prospect Found", "Trade Target Identified", "Scout Report Due Soon"][index] || "Scouting Note", level: index ? "Medium" : "Low" }));
}

function scoutingActionCard(item) {
  const action = item.title.includes("Workout") ? "Invite To Workout" : item.title.includes("Due") ? "View Assignments" : "Scout More";
  return `<article>${playerHeadshot(item.player, "scouting-action-headshot")}<div><span>${escapeHtml(item.title)} <b>${escapeHtml(item.level)}</b></span><strong>${escapeHtml(item.player.name)}</strong><small>${item.title.includes("Low") ? "More scouting will reduce the range." : "Review the latest report and next step."}</small><div><button class="btn primary" data-scout-player="${item.player.id}">${escapeHtml(action)}</button><button class="btn" data-view-player="${item.player.id}">View Profile</button></div></div></article>`;
}

function scoutingAssignmentRows(players, department) {
  const names = ["NCAA: Wings", "International Bigs", "NBA: Backup Point Guards"];
  return names.map((name, index) => {
    const player = players[index] || scoutingPlayerPool()[index];
    return `<article>${player ? playerHeadshot(player, "scouting-mini-headshot") : ""}<span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(player?.name || "Open Assignment")}</small></span><b>${5 + index * 4} Days Left</b><em>${index ? "Medium" : department.college >= 82 ? "High" : "Low"}</em></article>`;
  }).join("");
}

function scoutingStaffCards(department) {
  const staff = [["Brandon Williams", "Head Scout", department.college], ["Alex Sarama", "Intl. Scout", department.international], ["Keith Smith", "NBA Scout", department.analytics], ["Mike Schmitz", "Analytics Scout", department.medical]];
  return `<div>${staff.map(([name, role, rating]) => `<article><span></span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(role)}</small><b>${"*".repeat(Math.max(3, Math.min(5, Math.round(Number(rating) / 20))))}</b></article>`).join("")}</div>`;
}

function scoutingRecommendationRows(players) {
  const staff = ["Brandon Williams", "Alex Sarama", "Keith Smith", "Head Coach"];
  return staff.map((name, index) => {
    const player = players[index] || scoutingPlayerPool()[index];
    return `<article><span>${escapeHtml(name)}</span><strong>${escapeHtml(player?.name || "Open Board")}</strong><small>${escapeHtml(["High two-way impact", "High upside stash", "NBA ready now", "Defensive culture fit"][index] || "Scout review")}</small></article>`;
  }).join("");
}

function scoutingComparisonWidget(players) {
  const first = players[0] || scoutingPlayerPool()[0];
  const second = players[1] || scoutingPlayerPool()[1] || first;
  if (!first) return '<section class="card scouting-comparison-widget"><div class="muted-line">No players to compare.</div></section>';
  const firstReport = scoutingReport(first);
  const secondReport = scoutingReport(second);
  return `<section class="card scouting-comparison-widget"><header><strong>Comparison Widget</strong><button class="mini-action">Detailed Comparison</button></header><div class="scouting-compare-head">${playerHeadshot(first, "scouting-mini-headshot")}<span>${escapeHtml(first.name)}</span><b>vs</b>${playerHeadshot(second, "scouting-mini-headshot")}<span>${escapeHtml(second.name)}</span></div><article><span>OVR Range</span><b>${escapeHtml(firstReport.overall)}</b><b>${escapeHtml(secondReport.overall)}</b></article><article><span>Potential</span><b>${escapeHtml(firstReport.potential)}</b><b>${escapeHtml(secondReport.potential)}</b></article><article><span>Scout Confidence</span><b>${firstReport.confidence}%</b><b>${secondReport.confidence}%</b></article><article><span>Fit With Team</span><b>A+</b><b>B+</b></article></section>`;
}

function playerDevelopmentPage() {
  const team = activeTeam();
  const coach = coachingProfile(save.activeTeamId);
  const players = teamPlayers(save.activeTeamId).sort((a, b) => (b.pot - b.ovr) - (a.pot - a.ovr) || a.age - b.age);
  const prospects = players.filter((player) => player.age <= 25 || player.pot - player.ovr >= 6);
  const averagePotential = players.length ? Math.round(players.reduce((sum, player) => sum + player.pot, 0) / players.length) : 0;
  const gLeagueCount = players.filter((player) => player.gLeague).length;
  const selected = prospects[0] || players[0];
  const stalled = players.filter((player) => developmentStatus(player).label !== "On Track");
  const youngCoreProgress = prospects.length ? (prospects.reduce((sum, player) => sum + Math.max(0, player.pot - player.ovr), 0) / prospects.length).toFixed(1) : "0.0";
  const injuryRisk = players.filter((player) => player.injury > 0 || Number(player.durability || 75) < 68).length;
  return `
    <section class="player-dev-page">
      <header class="player-dev-header"><div>${teamLogo(team, "player-dev-team-logo")}<div><h1>PLAYER DEVELOPMENT</h1><p>Develop talent, build habits, and maximize each player's potential.</p></div></div><div><button class="btn primary">Development Staff</button><button class="btn">Training Report</button></div></header>
      <section class="player-dev-metrics">
        ${developmentMetricCard("Development Grade", staffGrade(coach.development), "Very Good", "+0.5 from last week", coach.development, "green")}
        ${developmentMetricCard("Training Quality", coach.development, "/ 100", "Strong", coach.development, "blue")}
        ${developmentMetricCard("Young Core Progress", `+${youngCoreProgress}`, "Above Average", "+1.3 from last week", Math.min(100, Number(youngCoreProgress) * 12), "green")}
        ${developmentMetricCard("Staff Impact", `+${Math.max(0, coach.development - 64)}%`, "Positive", "Strong staff boost", coach.development, "purple")}
        ${developmentMetricCard("Minutes Opportunity", gLeagueCount ? "Medium" : "Good", "Room for growth", `${gLeagueCount} G League`, gLeagueCount ? 56 : 78, "orange")}
        ${developmentMetricCard("Injury Risk", injuryRisk ? "Medium" : "Low", injuryRisk ? "Monitor workload" : "Team is healthy", `${injuryRisk} flagged`, injuryRisk ? 44 : 16, "red")}
      </section>
      <nav class="player-dev-tabs"><button class="active">Overview</button><button>Training Plan</button><button>Minutes & Roles</button><button>Mentorship</button><button>Progression History</button><button>Rehab</button></nav>
      <section class="player-dev-layout">
        <section class="card player-dev-tracker">
          <header><strong>Player Development Tracker</strong><button class="mini-action">Filter</button></header>
          <div class="player-dev-tracker-head"><span>Player</span><span>Age</span><span>OVR</span><span>POT</span><span>Dev Status</span><span>Trend</span></div>
          <div>${players.slice(0, 14).map((player, index) => developmentTrackerRow(player, index === 0)).join("")}</div>
        </section>
        ${selected ? developmentSelectedPanel(selected, coach) : '<section class="card player-dev-selected"><div class="muted-line">No players available.</div></section>'}
        <aside class="player-dev-action-center">
          <section class="card player-dev-action-card"><header><strong>Development Action Center</strong><b>${stalled.length}</b></header><div>${developmentActionItems(players).map(developmentActionCard).join("")}</div></section>
        </aside>
      </section>
      <section class="player-dev-bottom-grid">
        <section class="card dev-mini-panel"><header><strong>Active Promises</strong><button class="mini-action">View All</button></header>${developmentPromiseRows(players).join("")}</section>
        <section class="card dev-mini-panel"><header><strong>Mentorship Groups</strong><button class="mini-action">View All</button></header>${developmentMentorRows(players).join("")}</section>
        <section class="card dev-mini-panel"><header><strong>Weekly Development Report</strong><button class="mini-action">View All</button></header>${developmentReportRows(players, coach)}</section>
        <section class="card dev-mini-panel player-dev-chart"><header><strong>Player Progression Chart</strong><button class="mini-action">View Full Report</button></header><div>${players.slice(0, 3).map((player, index) => `<i style="--line:${index};--growth:${Math.max(8, Math.min(92, (player.pot - player.ovr + 8) * 7))}%"></i>`).join("")}</div></section>
      </section>
    </section>`;
}

function developmentMetricCard(label, value, subtitle, trend, percent, tone) {
  return `<article class="card development-metric-card ${tone}"><div><span>${escapeHtml(label)}</span><strong>${value}</strong><b>${escapeHtml(subtitle)}</b><small>${escapeHtml(trend)}</small></div><i><b style="width:${Math.max(0, Math.min(100, Number(percent) || 0))}%"></b></i></article>`;
}

function developmentStatus(player) {
  const growth = player.pot - player.ovr;
  const latest = player.developmentHistory?.at(-1);
  const trend = latest ? latest.to - latest.from : 0;
  if (player.age >= 31) return { label: "Maintaining", tone: "neutral", trend };
  if (growth <= 0) return { label: "Peaked", tone: "neutral", trend };
  if (trend < 0) return { label: "Declining", tone: "bad", trend };
  if (growth >= 8 && player.minutes < 16) return { label: "Stalled", tone: "bad", trend };
  if (growth >= 5 && player.minutes < 8) return { label: "At Risk", tone: "warn", trend };
  return { label: "On Track", tone: "ok", trend };
}

function developmentTrackerRow(player, activeRow = false) {
  const status = developmentStatus(player);
  return `<article class="${activeRow ? "active" : ""}">${playerHeadshot(player, "development-headshot")}<span><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} - ${escapeHtml(player.age <= 22 ? "Rookie" : player.age <= 25 ? "Young Core" : "Veteran")}</small></span><b>${player.age}</b><b>${player.ovr}</b><b class="pot">${player.pot}</b><em class="${status.tone}">${escapeHtml(status.label)}</em><i>${status.trend > 0 ? "▲" : status.trend < 0 ? "▼" : "-"}</i></article>`;
}

function developmentSelectedPanel(player, coach) {
  const mentor = teamPlayers(player.teamId).find((candidate) => candidate.id !== player.id && candidate.age >= 30) || teamPlayers(player.teamId).find((candidate) => candidate.id !== player.id);
  const confidence = Math.max(45, Math.min(96, Math.round((player.pot + coach.development) / 2)));
  const currentMpg = Number(player.minutes || 0).toFixed(1);
  return `<section class="card player-dev-selected">
    <header>${playerHeadshot(player, "player-dev-selected-headshot")}<div><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} | ${player.age} years old | ${player.height || "6'6"} | ${player.weight || 205} lbs</small></div><aside><span>Confidence</span><b>${confidence}</b><small>High</small></aside></header>
    <div class="player-dev-traits"><span>Work Ethic <b>A</b></span><span>Coachability <b>A-</b></span><span>Professionalism <b>B+</b></span><span>Personality <b>${escapeHtml(player.personality || "Competitive")}</b></span></div>
    <section class="player-dev-plan"><header><strong>Development Plan</strong><button class="mini-action">Edit Plan</button></header><div>
      ${developmentPlanBox("Primary Focus", player.trainingFocus || "balanced", "Defense - Finishing", "blue")}
      ${developmentPlanBox("Secondary Focus", player.trainingFocus === "shooting" ? "3PT Shooting" : "Ball Handling", "Handles - Shot Creation", "orange")}
      ${developmentPlanBox("Weekly Objective", "Improve on-ball defense", "Hold opponents under 40%", "purple")}
      ${developmentPlanBox("Practice Load", "Normal", "Balanced workload", "green")}
      ${developmentPlanBox("Minutes Goal", "18-24 MPG", `Current: ${currentMpg} MPG`, "green")}
      ${developmentPlanBox("Development Status", developmentStatus(player).label, "Good progress this week", "green")}
      ${developmentPlanBox("Development Coach", "Player Dev. Coach", `+${Math.max(0, coach.development - 74)}% Development Boost`, "blue")}
      ${developmentPlanBox("Mentor", mentor?.name || "Open", mentor ? `${escapeHtml(mentor.archetype || "Leadership")}` : "Assign veteran mentor", "orange")}
      ${developmentPlanBox("Next Evaluation", "After 4 Games", "Upcoming staff review", "purple")}
    </div></section>
    <section class="player-dev-attributes"><header><strong>Attribute Development (Last 4 Weeks)</strong></header><div>${["Perimeter Defense", "Finishing", "Ball Handling", "Strength", "3PT Shooting", "Basketball IQ"].map((label, index) => `<span>${label}<i><b style="width:${54 + index * 6}%"></b></i><em>${Math.max(58, player.ovr - 10 + index)} -> ${Math.max(60, player.ovr - 7 + index)} <b>+${index % 3 + 2}</b></em></span>`).join("")}</div></section>
  </section>`;
}

function developmentPlanBox(label, value, note, tone) {
  return `<article class="${tone}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong><small>${escapeHtml(note)}</small></article>`;
}

function developmentActionItems(players) {
  const sorted = [...players].sort((a, b) => lockerConcernScore(b) - lockerConcernScore(a));
  return sorted.slice(0, 9).map((player, index) => ({ player, title: ["Stalled Development", "Needs More Minutes", "Mentorship Opportunity", "Veteran Workload", "Breakout Window", "Role Clarity", "Training Review", "Minutes Balance", "Skill Focus"][index] || "Development Note", level: index ? "Medium" : "High" }));
}

function developmentActionCard(item) {
  return `<article>${playerHeadshot(item.player, "development-action-headshot")}<div><span>${escapeHtml(item.title)} <b>${escapeHtml(item.level)}</b></span><strong>${escapeHtml(item.player.name)} ${item.title === "Needs More Minutes" ? "could benefit from more playing time." : "needs a new focus."}</strong><small>Impact: +${Math.max(1, item.player.pot - item.player.ovr)} potential growth</small><div><button class="btn primary" data-view-player="${item.player.id}">View Plan</button><button class="btn" data-g-league="${item.player.id}">${item.player.gLeague ? "Recall" : "G League Plan"}</button></div></div></article>`;
}

function developmentPromiseRows(players) {
  return players.filter((player) => player.promisedRole && player.promisedRole !== "none").slice(0, 3).map((player) => `<article>${playerHeadshot(player, "development-mini-headshot")}<span><strong>${escapeHtml(player.name)} ${escapeHtml(player.promisedRole)}</strong><small>Deadline: 5 games</small></span><b>${player.morale < 60 ? "At Risk" : "On Track"}</b></article>`);
}

function developmentMentorRows(players) {
  const mentors = players.filter((player) => player.age >= 28).slice(0, 2);
  const pupils = players.filter((player) => player.age <= 24).slice(0, 2);
  return pupils.map((player, index) => `<article>${playerHeadshot(mentors[index] || mentors[0] || player, "development-mini-headshot")}<span><strong>${escapeHtml(mentors[index]?.name || "Open Mentor")} -> ${escapeHtml(player.name)}</strong><small>Focus: ${escapeHtml(player.trainingFocus || "balanced")}</small></span><b>On Track</b></article>`);
}

function developmentReportRows(players, coach) {
  const top = players[0];
  return [`Practice Week Summary|Great practice intensity and effort across the board.`, `Team Development Boost|${coach.development} staff rating is helping growth.`, `Minutes Impact|Players who met their minutes goal saw positive progress.`].map((row, index) => { const [title, note] = row.split("|"); return `<article><b>${index + 1}</b><span><strong>${title}</strong><small>${note}</small></span></article>`; }).join("") || (top ? `<article><b>1</b><span><strong>${escapeHtml(top.name)}</strong><small>Development review pending.</small></span></article>` : "");
}

function developmentPlayerRow(player) {
  const growth = Math.max(0, player.pot - player.ovr);
  const latest = player.developmentHistory?.at(-1);
  const trend = latest ? latest.to - latest.from : 0;
  const outlook = player.age >= 31 ? "Veteran maintenance" : growth >= 8 ? "High-upside prospect" : growth >= 3 ? "Room to improve" : "Near projected ceiling";
  return `<article class="development-player">
    <div class="development-player-profile">${playerHeadshot(player, "development-headshot")}<div><strong>${escapeHtml(player.name)}</strong><span>${escapeHtml(player.pos)} · Age ${player.age}</span><button class="mini-action" data-view-player="${player.id}">View Card</button></div></div>
    <div class="development-rating"><span>OVR</span><b>${player.ovr}</b></div>
    <div class="development-rating potential"><span>POT</span><b>${player.pot}</b></div>
    <div class="development-outlook"><span>${escapeHtml(outlook)}</span><small>${latest ? `Last progression: ${trend >= 0 ? "+" : ""}${trend} OVR` : "First progression pending"}</small></div>
    <label class="development-focus"><span>TRAINING FOCUS</span><select class="compact-select" data-training-focus="${player.id}">${["balanced", "shooting", "playmaking", "defense", "conditioning"].map((focus) => `<option value="${focus}" ${player.trainingFocus === focus ? "selected" : ""}>${focus}</option>`).join("")}</select></label>
    ${player.age <= 25 || rosterType(player) === "twoWay" ? `<button class="btn development-league-btn" data-g-league="${player.id}">${player.gLeague ? "Recall" : "G League"}</button>` : '<span class="development-veteran">NBA ROSTER</span>'}
  </article>`;
}

function scoutingCard(player) {
  const report = scoutingReport(player);
  const watched = save.watchlist.includes(player.id);
  return `<section class="card scout-card"><div class="scout-card-head"><div><div class="card-label">${escapeHtml(player.college || teamName(player.teamId) || "Free Agent")}</div><div class="player-name">${escapeHtml(player.name)}</div><div class="meta">${escapeHtml(player.pos)} - Age ${player.age} - ${escapeHtml(player.archetype || "Two-Way")}</div></div><button class="watch-btn ${watched ? "active" : ""}" data-watch-player="${player.id}">${watched ? "Watching" : "Watch"}</button></div><div class="scout-ranges"><span>OVR <strong>${report.overall}</strong></span><span>POT <strong>${report.potential}</strong></span><span>Confidence <strong>${report.confidence}%</strong></span></div><div class="meta">${escapeHtml(report.summary)}</div><div class="actions"><button class="btn" data-scout-player="${player.id}">Scout</button><button class="btn" data-compare-player="${player.id}">Compare</button><button class="btn" data-view-player="${player.id}">View Card</button></div></section>`;
}

function comparisonPanel() {
  const players = comparisonPlayerIds.map((id) => save.players.find((player) => player.id === id) || save.offseason?.draftClass?.find((player) => player.id === id)).filter(Boolean);
  if (!players.length) return "";
  return `<section class="card comparison-panel"><div class="card-label">player comparison</div><div class="comparison-grid">${players.map((player) => { const report = scoutingReport(player); return `<div><strong>${escapeHtml(player.name)}</strong><span>${escapeHtml(player.pos)} - ${report.overall} OVR</span><span>${report.potential} POT</span><span>${escapeHtml(player.archetype || "Two-Way")}</span></div>`; }).join("")}</div><button class="btn" data-action="clear-comparison">Clear</button></section>`;
}

function transactionCenterPage() {
  const pending = pendingFrontOfficeDecisions();
  const offers = save.aiTransactions.userOffers || [];
  const logs = (save.transactionLog || []).filter((item) => transactionFilter === "all" || normalizeText(item.type) === normalizeText(transactionFilter)).slice(-80).reverse();
  return `<h1 class="page-title">transactions</h1><div class="page-actions"><button class="btn" data-action="mark-read">Mark All Read</button></div>
    <section class="grid-4">${statCard("pending decisions", pending.length)}${statCard("trade block", save.aiTransactions.tradeBlock.length)}${statCard("watchlist", save.watchlist.length)}${statCard("unread", save.notifications.filter((item) => !item.read).length)}</section>
    <section class="grid-2"><section class="card card-pad"><div class="card-label">decision queue</div><div class="decision-list">${pending.map((item) => `<div class="decision-row"><span>${escapeHtml(item)}</span><strong>REQUIRED</strong></div>`).join("") || '<div class="muted-line">No mandatory decisions.</div>'}${offers.map((offer) => `<div class="decision-row trade-offer-row"><span>${escapeHtml(teamName(offer.partnerTeamId))} offers ${escapeHtml(save.players.find((player) => player.id === offer.incomingId)?.name || "a player")} for ${escapeHtml(save.players.find((player) => player.id === offer.outgoingId)?.name || "your player")}.</span><div class="actions"><button class="btn primary" data-trade-offer="${offer.id}" data-decision="accept">Accept</button><button class="btn" data-trade-offer="${offer.id}" data-decision="decline">Decline</button></div></div>`).join("")}</div></section><section class="card card-pad"><div class="card-label">league market</div><div class="inbox-list">${save.aiTransactions.rumors.slice(-8).reverse().map((item) => `<div class="inbox-item">${escapeHtml(item)}</div>`).join("") || '<div class="muted-line">The market is quiet.</div>'}</div></section></section>
    <section class="card transaction-ledger"><div class="transaction-ledger-head"><div><div class="card-label">transaction ledger</div><div class="player-name">League Activity</div></div><div class="filter-chips">${["all", "Trade", "Signing", "Waiver", "Extension", "Injury", "Staff"].map((filter) => `<button data-transaction-filter="${filter}" class="btn ${transactionFilter === filter ? "primary" : ""}">${filter}</button>`).join("")}</div></div><div class="transaction-log-list">${logs.map((item) => `<div><span>${escapeHtml(item.date || "")}</span><strong>${escapeHtml(item.type || "News")}</strong><p>${escapeHtml(item.text)}</p></div>`).join("") || '<div class="muted-line">No transactions match this filter.</div>'}</div></section>`;
}

function calendarCells(year, month, games, events, transactions, selectedId, selectedSeasonEventId, selectedTransactionId) {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = Array.from({ length: firstWeekday }, () => '<div class="calendar-day empty"></div>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayGames = games.filter((game) => game.date === date);
    const dayEvents = events.filter((event) => event.date === date);
    const dayTransactions = transactions.filter((event) => event.date === date);
    cells.push(`
      <div class="calendar-day ${dayGames.length ? "has-game" : ""}">
        <span class="calendar-date">${day}</span>
        ${dayGames.map((game) => calendarGameButton(game, selectedId)).join("")}
        ${dayEvents.map((event) => calendarEventButton(event, selectedSeasonEventId)).join("")}
        ${dayTransactions.map((event) => calendarTransactionButton(event, selectedTransactionId)).join("")}
      </div>
    `);
  }
  while (cells.length % 7) cells.push('<div class="calendar-day empty"></div>');
  return cells.join("");
}

function calendarGameButton(game, selectedId) {
  const opponentId = game.home === save.activeTeamId ? game.away : game.home;
  const opponent = getTeam(opponentId);
  const prefix = game.home === save.activeTeamId ? "vs" : "@";
  const result = game.played ? gameResultLabel(game) : `${prefix} ${teamName(opponentId)}`;
  return `<button class="calendar-game ${game.nbaCup ? "cup-game" : ""} ${game.played ? "played" : ""} ${game.id === selectedId ? "selected" : ""}" data-game-id="${game.id}">${teamLogo(opponent, "calendar-team-logo")}<span>${game.nbaCup ? `<small>CUP ${escapeHtml(game.nbaCup)}</small>` : ""}${result}</span></button>`;
}

function calendarEventButton(event, selectedId) {
  return `<button class="calendar-game all-star-event ${event.played ? "played" : ""} ${event.id === selectedId ? "selected" : ""}" data-season-event="${event.id}"><small>ALL-STAR</small>${escapeHtml(event.shortLabel)}</button>`;
}

function calendarTransactionButton(event, selectedId) {
  const passed = event.date < currentLeagueDate();
  return `<button class="calendar-game transaction-event ${passed ? "played" : ""} ${event.id === selectedId ? "selected" : ""}" data-transaction-event="${event.id}"><small>LEAGUE</small>${escapeHtml(event.shortLabel)}</button>`;
}

function gameResultLabel(game) {
  const activeScore = game.home === save.activeTeamId ? game.homeScore : game.awayScore;
  const opponentScore = game.home === save.activeTeamId ? game.awayScore : game.homeScore;
  const opponentId = game.home === save.activeTeamId ? game.away : game.home;
  return `${activeScore >= opponentScore ? "W" : "L"} ${activeScore}-${opponentScore} ${teamName(opponentId)}`;
}

function gameMatchupCard(game) {
  const home = getTeam(game.home);
  const away = getTeam(game.away);
  const gamesBefore = gamesRequiredBefore(game);
  const playLabel = gamesBefore ? `Sim ${gamesBefore} Prior + Play` : "Play Game";
  const simLabel = gamesBefore ? `Sim Through Date (${gamesBefore + 1})` : "Quick Sim";
  return `
    <section class="card card-pad matchup-card">
      <div class="card-label">${game.nbaCup ? `nba cup - ${escapeHtml(game.nbaCup)}` : game.played ? "final" : "selected game"}</div>
      <div class="matchup-teams">
        <div>${teamLogo(away, "schedule-team-logo")}<span>${escapeHtml(away.abbr)}</span><strong>${game.played ? game.awayScore : Math.round(teamRating(away))}</strong><small>${escapeHtml(away.city)} ${escapeHtml(away.name)}</small></div>
        <div class="matchup-at">at</div>
        <div>${teamLogo(home, "schedule-team-logo")}<span>${escapeHtml(home.abbr)}</span><strong>${game.played ? game.homeScore : Math.round(teamRating(home))}</strong><small>${escapeHtml(home.city)} ${escapeHtml(home.name)}</small></div>
      </div>
      <div class="meta">${formatGameDate(game.date)}${game.played && game.quarters ? ` - ${game.quarters.map((quarter, index) => `${index < 4 ? `Q${index + 1}` : `OT${index - 3}`} ${quarter.away}-${quarter.home}`).join(" | ")}` : ""}</div>
      ${game.played && game.summary ? `<div class="game-summary"><strong>${escapeHtml(game.summary.headline)}</strong><span>${escapeHtml(game.summary.explanation)}</span><div>${game.summary.factors.map((factor) => `<em>${escapeHtml(factor)}</em>`).join("")}</div></div>` : !game.played ? `<div class="pregame-plan"><span>Your plan</span><strong>${escapeHtml(gamePlan(save.activeTeamId).pace)} pace / ${escapeHtml(gamePlan(save.activeTeamId).offense)} / ${escapeHtml(gamePlan(save.activeTeamId).defense)}</strong><a data-nav-shortcut="strategy">Edit strategy</a></div>` : ""}
      ${!game.played && gamesBefore ? `<div class="timeline-note">Playing this date will quick-sim the ${gamesBefore} unplayed game${gamesBefore === 1 ? "" : "s"} before it.</div>` : ""}
      <div class="actions">
        ${game.played
          ? '<button class="btn" disabled>Game Complete</button>'
          : `<button class="btn" data-simcast-game="${game.id}">Open SimCast</button><button class="btn" data-sim-game="${game.id}">${simLabel}</button>`}
        <button class="btn" disabled>Offseason After Finals</button>
      </div>
    </section>
  `;
}

function seasonFeatureStrip() {
  const cupGames = save.schedule.filter((game) => game.nbaCup);
  const cupPlayed = cupGames.filter((game) => game.played);
  const cupWins = cupPlayed.filter((game) => gameResultLabel(game).startsWith("W")).length;
  const allStarEvents = save.seasonEvents || [];
  const deadline = nextTransactionEvent();
  return `<section class="season-feature-strip">
    <div class="card season-feature cup-feature"><div class="card-label">nba cup</div><strong>${cupPlayed.length ? `${cupWins}-${cupPlayed.length - cupWins}` : "Group Play Ahead"}</strong><span>${cupGames.find((game) => !game.played)?.nbaCup || (cupGames.at(-1)?.played && cupGames.at(-1)?.homeScore !== undefined ? "Tournament Complete" : "In Season")}</span></div>
    <div class="card season-feature all-star-feature"><div class="card-label">all-star weekend</div><strong>${allStarEvents.filter((event) => event.played).length} / ${allStarEvents.length} events</strong><span>${allStarEvents.find((event) => !event.played)?.shortLabel || "Weekend Complete"}</span></div>
    <div class="card season-feature transaction-feature"><div class="card-label">transaction calendar</div><strong>${deadline ? escapeHtml(deadline.shortLabel) : "Complete"}</strong><span>${deadline ? formatShortDate(deadline.date) : "No deadlines left"}</span></div>
  </section>`;
}

function seasonEventCard(event) {
  const priorGames = save.schedule.filter((game) => !game.played && game.date <= event.date).length;
  return `<section class="card card-pad matchup-card all-star-card">
    <div class="card-label">all-star weekend</div>
    <div class="event-title">${escapeHtml(event.label)}</div>
    <div class="meta">${formatGameDate(event.date)} - ${escapeHtml(event.description)}</div>
    ${event.played ? `<div class="event-result">${escapeHtml(event.result)}</div>` : priorGames ? `<div class="timeline-note">Simulating this event will first play ${priorGames} scheduled game${priorGames === 1 ? "" : "s"} through this date.</div>` : ""}
    <div class="actions">${event.played ? '<button class="btn" disabled>Event Complete</button>' : `<button class="btn primary" data-sim-event="${event.id}">Sim Event</button>`}</div>
  </section>`;
}

function transactionEventCard(event) {
  const currentDate = currentLeagueDate();
  const passed = event.date < currentDate;
  const gamesBefore = save.schedule.filter((game) => !game.played && game.date <= event.date).length;
  return `<section class="card card-pad matchup-card transaction-event-card">
    <div class="card-label">nba transaction calendar</div>
    <div class="event-title">${escapeHtml(event.label)}</div>
    <div class="meta">${formatGameDate(event.date)} - ${escapeHtml(event.description)}</div>
    <div class="transaction-impact"><strong>${passed ? "Deadline passed" : event.date === currentDate ? "Active today" : "Upcoming"}</strong><span>${escapeHtml(event.impact)}</span></div>
    ${!passed && gamesBefore ? `<div class="timeline-note">Advancing here will simulate ${gamesBefore} scheduled game${gamesBefore === 1 ? "" : "s"} through this date.</div>` : ""}
    <div class="actions">${passed ? '<button class="btn" disabled>Completed</button>' : `<button class="btn primary" data-advance-deadline="${event.id}">Advance To Deadline</button>`}</div>
  </section>`;
}

function rulePill(label, value, positive) {
  return `<div class="rule-pill ${positive ? "open" : "closed"}"><span>${label}</span><strong>${value}</strong></div>`;
}

function playerBoxScorePanel(game) {
  const result = gameResultFor(game.id);
  if (!result?.playerStats) {
    return '<section class="card card-pad box-score-panel"><div class="muted-line">Player box score unavailable for this game.</div></section>';
  }
  const away = getTeam(game.away);
  const home = getTeam(game.home);
  return `
    <section class="card box-score-panel">
      <div class="box-score-heading">
        <div>
          <div class="card-label">player box score</div>
          <div class="player-name">${escapeHtml(away.abbr)} ${game.awayScore} - ${escapeHtml(home.abbr)} ${game.homeScore}</div>
        </div>
        <div class="meta">${formatGameDate(game.date)}</div>
      </div>
      <div class="box-score-teams">
        ${playerBoxScoreTable(away, result.playerStats.away)}
        ${playerBoxScoreTable(home, result.playerStats.home)}
      </div>
    </section>
  `;
}

function playerBoxScoreTable(team, lines) {
  const players = Array.isArray(lines) ? lines : [];
  const totals = players.reduce((sum, line) => ({
    min: sum.min + line.min,
    pts: sum.pts + line.pts,
    reb: sum.reb + line.reb,
    ast: sum.ast + line.ast,
    stl: sum.stl + line.stl,
    blk: sum.blk + line.blk,
    tov: sum.tov + line.tov,
    fgm: sum.fgm + line.fgm,
    fga: sum.fga + line.fga,
    threePm: sum.threePm + line.threePm,
    threePa: sum.threePa + line.threePa,
    ftm: sum.ftm + line.ftm,
    fta: sum.fta + line.fta,
    pf: sum.pf + Number(line.pf || 0)
  }), { min: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tov: 0, fgm: 0, fga: 0, threePm: 0, threePa: 0, ftm: 0, fta: 0, pf: 0 });
  return `
    <div class="box-score-team">
      <div class="box-score-team-name"><strong>${escapeHtml(team.city)} ${escapeHtml(team.name)}</strong><span>${players.reduce((sum, line) => sum + line.pts, 0)} PTS</span></div>
      <div class="box-score-scroll">
        <table class="player-box-table">
          <thead><tr><th>Player</th><th>MIN</th><th>FG</th><th>3PT</th><th>FT</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TO</th><th>PF</th><th>+/-</th></tr></thead>
          <tbody>
            ${players.map(playerBoxScoreRow).join("")}
            <tr class="box-score-total"><td>TEAM</td><td>${totals.min}</td><td>${totals.fgm}-${totals.fga}</td><td>${totals.threePm}-${totals.threePa}</td><td>${totals.ftm}-${totals.fta}</td><td>${totals.pts}</td><td>${totals.reb}</td><td>${totals.ast}</td><td>${totals.stl}</td><td>${totals.blk}</td><td>${totals.tov}</td><td>${totals.pf}</td><td>-</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function playerBoxScoreRow(line) {
  const selected = save.players.find((player) => player.id === line.playerId);
  return `<tr>
    <td><strong>${escapeHtml(line.name || selected?.name || "Unknown Player")}</strong><small>${escapeHtml(line.pos || selected?.pos || "")}</small>${selected ? `<button class="mini-action" data-view-player="${selected.id}">View Card</button>` : ""}</td>
    <td>${line.min}</td><td>${line.fgm}-${line.fga}</td><td>${line.threePm}-${line.threePa}</td><td>${line.ftm}-${line.fta}</td>
    <td><strong>${line.pts}</strong></td><td>${line.reb}</td><td>${line.ast}</td><td>${line.stl}</td><td>${line.blk}</td><td>${line.tov}</td><td>${line.pf || 0}</td><td>${line.plusMinus > 0 ? "+" : ""}${line.plusMinus}</td>
  </tr>`;
}

function gameResultFor(gameId) {
  return save.results.find((result) => result.gameId === gameId) || save.leagueResults?.find((result) => result.gameId === gameId);
}

function gamesRequiredBefore(targetGame) {
  const schedule = [...save.schedule].sort((a, b) => a.date.localeCompare(b.date));
  const targetIndex = schedule.findIndex((game) => game.id === targetGame.id);
  return schedule.slice(0, targetIndex).filter((game) => !game.played).length;
}

function seasonSummaryCard(schedule) {
  const nextThree = schedule.filter((game) => !game.played).slice(0, 3);
  const last = [...schedule].filter((game) => game.played).at(-1);
  return `
    <section class="card card-pad section-grid">
      <div class="card-label">season desk</div>
      ${metric("Record", `${activeTeam().wins} W / ${activeTeam().losses} L`)}
      ${metric("Games Remaining", schedule.filter((game) => !game.played).length)}
      ${metric("Last Result", last ? gameResultLabel(last) : "No games played")}
      ${metric("Coming Up", nextThree.length ? nextThree.map((game) => `${formatShortDate(game.date)} ${game.home === save.activeTeamId ? "vs" : "@"} ${teamName(game.home === save.activeTeamId ? game.away : game.home)}`).join("<br>") : "Season complete")}
    </section>
  `;
}

function standingsPage() {
  ensureLeagueStandingsState();
  const tabButton = (id, label) => `<button class="${standingsView === id ? "active" : ""}" data-standings-view="${id}">${label}</button>`;
  const scopeButton = (id, label) => `<button class="${standingsScope === id ? "active" : ""}" data-standings-scope="${id}">${label}</button>`;
  return `
    <section class="standings-topbar">
      <h1 class="page-title">standings</h1>
    </section>
    <section class="standings-tabs" aria-label="Standings views">
      ${tabButton("standings", "Standings")}${tabButton("wildcard", "Wild Card")}${tabButton("power", "Power Rankings")}${tabButton("streaks", "Streaks")}${tabButton("cup", "NBA Cup")}
    </section>
    ${standingsView === "standings" ? `<section class="standings-toolbar">
      <div class="standings-view-toggle">${scopeButton("league", "League")}${scopeButton("conference", "Conference")}${scopeButton("division", "Division")}</div>
    </section>` : ""}
    ${standingsContent()}
  `;
}

function standingsContent() {
  if (standingsView === "cup") return nbaCupPanel();
  if (standingsView === "power") return powerRankingsPanel();
  if (standingsView === "streaks") return streaksPanel();
  if (standingsView === "wildcard") return wildcardPanel();
  return regularStandingsPanel();
}

function regularStandingsPanel() {
  if (standingsScope === "league") {
    return `<section class="standings-grid">${standingsTable("League Standings", leagueStandings(), null)}</section>`;
  }
  if (standingsScope === "division") {
    return `<section class="grid-3 standings-grid standings-division-grid">${divisionNames().map((division) => standingsTable(`${division} Division`, divisionStandings(division), null, true)).join("")}</section>`;
  }
  return `<section class="grid-2 standings-grid standings-conference-grid">
    ${standingsTable("Eastern Conference", conferenceStandings("East"), "East")}
    ${standingsTable("Western Conference", conferenceStandings("West"), "West")}
  </section>`;
}

function conferenceStandings(conference) {
  const teams = save.teams
    .filter((team) => team.conf === conference)
    .sort((a, b) => teamWinPct(b) - teamWinPct(a) || b.wins - a.wins || a.losses - b.losses || a.city.localeCompare(b.city));
  const leader = teams[0] || { wins: 0, losses: 0 };
  return teams.map((team, index) => ({
    team,
    seed: index + 1,
    pct: teamWinPct(team),
    gb: index === 0 ? "-" : formatGamesBehind(leader, team),
    conf: teamRecordSplit(team.id, (game) => getTeam(game.home === team.id ? game.away : game.home)?.conf === conference),
    home: teamRecordSplit(team.id, (game) => game.home === team.id),
    away: teamRecordSplit(team.id, (game) => game.away === team.id),
    last10: teamLastTen(team.id),
    streak: teamStreak(team.id)
  }));
}

function leagueStandings() {
  const teams = [...save.teams].sort((a, b) => teamWinPct(b) - teamWinPct(a) || b.wins - a.wins || a.losses - b.losses || a.city.localeCompare(b.city));
  const leader = teams[0] || { wins: 0, losses: 0 };
  return teams.map((team, index) => standingsEntry(team, index + 1, leader, team.conf));
}

function divisionStandings(division) {
  const teams = save.teams.filter((team) => teamDivision(team.id) === division).sort((a, b) => teamWinPct(b) - teamWinPct(a) || b.wins - a.wins || a.losses - b.losses || a.city.localeCompare(b.city));
  const leader = teams[0] || { wins: 0, losses: 0 };
  return teams.map((team, index) => standingsEntry(team, index + 1, leader, team.conf));
}

function standingsEntry(team, seed, leader, conference) {
  return {
    team,
    seed,
    pct: teamWinPct(team),
    gb: seed === 1 ? "-" : formatGamesBehind(leader, team),
    conf: teamRecordSplit(team.id, (game) => getTeam(game.home === team.id ? game.away : game.home)?.conf === conference),
    home: teamRecordSplit(team.id, (game) => game.home === team.id),
    away: teamRecordSplit(team.id, (game) => game.away === team.id),
    last10: teamLastTen(team.id),
    streak: teamStreak(team.id)
  };
}

function teamDivision(teamId) {
  const divisions = {
    Atlantic: ["bos", "bkn", "nyk", "phi", "tor"],
    Central: ["chi", "cle", "det", "ind", "mil"],
    Southeast: ["atl", "cha", "mia", "orl", "was"],
    Northwest: ["den", "min", "okc", "por", "uta"],
    Pacific: ["gsw", "lac", "lal", "phx", "sac"],
    Southwest: ["dal", "hou", "mem", "nop", "sas"]
  };
  return Object.entries(divisions).find(([, ids]) => ids.includes(teamId))?.[0] || "NBA";
}

function divisionNames() {
  return ["Atlantic", "Central", "Southeast", "Northwest", "Pacific", "Southwest"];
}

function standingsTable(title, rows, conference, compact = false) {
  return `
    <section class="card table-card standings-table ${compact ? "standings-table-compact" : ""}">
      <div class="standings-title">${conference ? conferenceLogo(conference) : ""}<span>${title}</span></div>
      <table>
        <thead>${compact ? "<tr><th></th><th>Team</th><th>W</th><th>L</th><th>PCT</th><th>GB</th><th>STRK</th></tr>" : "<tr><th></th><th>Team</th><th>W</th><th>L</th><th>PCT</th><th>GB</th><th>CONF</th><th>HOME</th><th>AWAY</th><th>STRK</th></tr>"}</thead>
        <tbody>${rows.map((entry) => standingsRow(entry, compact)).join("")}</tbody>
      </table>
    </section>
  `;
}

function standingsRow(entry, compact = false) {
  const zone = entry.seed <= 6 ? "playoff-seed" : entry.seed <= 10 ? "playin-seed" : "";
  const activeClass = entry.team.id === save.activeTeamId ? " active-standing" : "";
  const theme = teamThemes[entry.team.id] || teamThemes.bos;
  return `<tr class="${zone}${activeClass}" style="--standing-primary:${theme.primary};--standing-secondary:${theme.secondary}">
    <td>${entry.seed}</td>
    <td><div class="standings-team-cell" title="${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}">${teamLogo(entry.team, "standings-team-logo")}<span><strong>${escapeHtml(entry.team.abbr)}</strong><small>${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}</small></span></div></td>
    <td>${entry.team.wins}</td><td>${entry.team.losses}</td><td>${entry.pct.toFixed(3).replace(/^0/, "")}</td><td>${entry.gb}</td>${compact ? "" : `<td>${entry.conf}</td><td>${entry.home}</td><td>${entry.away}</td>`}<td class="${entry.streak.startsWith("W") ? "ok" : entry.streak.startsWith("L") ? "bad" : ""}">${entry.streak}</td>
  </tr>`;
}

function conferenceLogo(conference) {
  const label = conference === "East" ? "EAST" : "WEST";
  const fileName = conference === "East" ? "recovered-media/eastern-conference.png" : "recovered-media/western-conference.png";
  return `<span class="conference-logo conference-logo-${escapeHtml(String(conference).toLowerCase())}" aria-label="${conference === "East" ? "Eastern" : "Western"} Conference logo"><img src="${escapeHtml(localAssetUrl(fileName))}" alt="" loading="lazy" onerror="this.remove()"><b>${label}</b></span>`;
}

function teamRecordSplit(teamId, predicate) {
  const games = teamLeagueResults(teamId).filter(predicate);
  const wins = games.filter((game) => teamWonResult(teamId, game)).length;
  return `${wins}-${games.length - wins}`;
}

function nbaCupStandings(conference) {
  return save.teams.filter((team) => team.conf === conference).map((team) => {
    const games = teamLeagueResults(team.id).filter(isNbaCupResult);
    const wins = games.filter((game) => teamWonResult(team.id, game)).length;
    const points = games.reduce((sum, game) => {
      const scored = game.home === team.id ? game.homeScore : game.awayScore;
      const allowed = game.home === team.id ? game.awayScore : game.homeScore;
      return sum + scored - allowed;
    }, 0);
    return { team, seed: 0, wins, losses: games.length - wins, diff: points, pct: games.length ? wins / games.length : 0 };
  }).sort((a, b) => b.wins - a.wins || b.diff - a.diff || teamWinPct(b.team) - teamWinPct(a.team)).map((entry, index) => ({ ...entry, seed: index + 1 }));
}

function isNbaCupResult(result) {
  const scheduled = [...(save.schedule || []), ...(save.leagueSchedule || [])].find((game) => game.id === result.gameId);
  if (scheduled?.nbaCup) return true;
  return (save.schedule || []).some((game) => game.nbaCup && game.date === result.date);
}

function nbaCupPanel() {
  const nextCupGame = save.schedule.find((game) => game.nbaCup && !game.played);
  return `<section class="card nba-cup-card">
    <div class="nba-cup-heading">
      <div>
        <div class="card-label">nba cup</div>
        <div class="player-name">${nextCupGame ? `${escapeHtml(nextCupGame.nbaCup)} Up Next` : "Tournament Table"}</div>
        <div class="meta">${cupSummaryText()}</div>
      </div>
      <div class="standings-legend"><span class="playoff-dot"></span> Knockout Zone <span class="playin-dot"></span> Chase</div>
    </div>
    <div class="nba-cup-grid">${["East", "West"].map((conference) => nbaCupTable(conference)).join("")}</div>
  </section>`;
}

function nbaCupTable(conference) {
  const rows = nbaCupStandings(conference).slice(0, 8);
  return `<section class="nba-cup-table">
    <div class="standings-title">${conferenceLogo(conference)}<span>${conference === "East" ? "Eastern" : "Western"} Cup Race</span></div>
    <table><thead><tr><th></th><th>Team</th><th>W</th><th>L</th><th>DIFF</th><th>STRK</th></tr></thead><tbody>${rows.map((entry) => `<tr class="${entry.seed <= 4 ? "playoff-seed" : entry.seed <= 6 ? "playin-seed" : ""}"><td>${entry.seed}</td><td><div class="standings-team-cell">${teamLogo(entry.team, "standings-team-logo")}<span><strong>${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}</strong></span></div></td><td>${entry.wins}</td><td>${entry.losses}</td><td>${entry.diff > 0 ? "+" : ""}${entry.diff}</td><td>${teamStreak(entry.team.id)}</td></tr>`).join("")}</tbody></table>
  </section>`;
}

function powerRankingsPanel() {
  const rows = [...save.teams]
    .map((team) => ({ team, score: teamRating(team) + team.wins * 1.8 - team.losses * 1.2, streak: teamStreak(team.id), last10: teamLastTen(team.id) }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, seed: index + 1 }));
  return `<section class="card table-card standings-table standings-wide-table power-rankings-table">
    <div class="standings-title"><span>Power Rankings</span></div>
    <table><thead><tr><th></th><th>Team</th><th>W</th><th>L</th><th>Rating</th><th>L10</th><th>STRK</th></tr></thead><tbody>${rows.map((entry) => { const theme = teamThemes[entry.team.id] || teamThemes.bos; return `<tr class="${entry.team.id === save.activeTeamId ? "active-standing" : ""}" style="--standing-primary:${theme.primary};--standing-secondary:${theme.secondary}"><td>${entry.seed}</td><td><div class="standings-team-cell" title="${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}">${teamLogo(entry.team, "standings-team-logo")}<span><strong>${escapeHtml(entry.team.abbr)}</strong><small>${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}</small></span></div></td><td>${entry.team.wins}</td><td>${entry.team.losses}</td><td>${Math.round(entry.score)}</td><td>${entry.last10}</td><td class="${entry.streak.startsWith("W") ? "ok" : entry.streak.startsWith("L") ? "bad" : ""}">${entry.streak}</td></tr>`; }).join("")}</tbody></table>
  </section>`;
}

function streaksPanel() {
  const rows = [...save.teams]
    .map((team) => ({ team, streak: teamStreak(team.id) }))
    .sort((a, b) => streakSortValue(b.streak) - streakSortValue(a.streak) || teamWinPct(b.team) - teamWinPct(a.team));
  return `<section class="card table-card standings-table standings-wide-table streaks-rankings-table">
    <div class="standings-title"><span>Streaks</span></div>
    <table><thead><tr><th></th><th>Team</th><th>W</th><th>L</th><th>L10</th><th>STRK</th></tr></thead><tbody>${rows.map((entry, index) => { const theme = teamThemes[entry.team.id] || teamThemes.bos; return `<tr class="${entry.team.id === save.activeTeamId ? "active-standing" : ""}" style="--standing-primary:${theme.primary};--standing-secondary:${theme.secondary}"><td>${index + 1}</td><td><div class="standings-team-cell" title="${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}">${teamLogo(entry.team, "standings-team-logo")}<span><strong>${escapeHtml(entry.team.abbr)}</strong><small>${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}</small></span></div></td><td>${entry.team.wins}</td><td>${entry.team.losses}</td><td>${teamLastTen(entry.team.id)}</td><td class="${entry.streak.startsWith("W") ? "ok" : entry.streak.startsWith("L") ? "bad" : ""}">${entry.streak}</td></tr>`; }).join("")}</tbody></table>
  </section>`;
}

function streakSortValue(streak) {
  const count = Number(String(streak).slice(1)) || 0;
  return String(streak).startsWith("W") ? count : -count;
}

function wildcardPanel() {
  return `<section class="grid-2 standings-grid standings-conference-grid">
    ${wildcardTable("Eastern Wild Card", conferenceStandings("East").slice(5, 11), "East")}
    ${wildcardTable("Western Wild Card", conferenceStandings("West").slice(5, 11), "West")}
  </section>`;
}

function wildcardTable(title, rows, conference) {
  return `<section class="card table-card standings-table">
    <div class="standings-title">${conferenceLogo(conference)}<span>${title}</span></div>
    <table><thead><tr><th></th><th>Team</th><th>W</th><th>L</th><th>GB</th><th>L10</th><th>STRK</th></tr></thead><tbody>${rows.map((entry) => `<tr class="${entry.seed <= 10 ? "playin-seed" : ""}"><td>${entry.seed}</td><td><div class="standings-team-cell">${teamLogo(entry.team, "standings-team-logo")}<span><strong>${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}</strong></span></div></td><td>${entry.team.wins}</td><td>${entry.team.losses}</td><td>${entry.gb}</td><td>${entry.last10}</td><td class="${entry.streak.startsWith("W") ? "ok" : entry.streak.startsWith("L") ? "bad" : ""}">${entry.streak}</td></tr>`).join("")}</tbody></table>
  </section>`;
}

function cupSummaryText() {
  const cupGames = save.schedule.filter((game) => game.nbaCup);
  const played = cupGames.filter((game) => game.played).length;
  const next = cupGames.find((game) => !game.played);
  if (next) return `${played}/${cupGames.length} NBA Cup games complete. Next: ${teamName(next.away)} at ${teamName(next.home)}.`;
  return cupGames.length ? "NBA Cup schedule complete." : "NBA Cup games will appear once the season schedule is generated.";
}

function postseasonPage() {
  const remaining = save.schedule.filter((game) => !game.played).length;
  const postseason = save.postseason;
  if (!postseason) {
    return `
      <h1 class="page-title">postseason</h1>
      <section class="card postseason-hero">
        <div>
          <div class="card-label">road to the championship</div>
          <div class="postseason-title">The bracket begins after Game 82</div>
          <div class="meta">${remaining ? `${remaining} regular-season game${remaining === 1 ? "" : "s"} remain. Finish the schedule to lock seeds and simulate the Play-In Tournament.` : "The regular season is complete. The playoff field is ready to be seeded."}</div>
        </div>
        <button class="btn primary" data-action="start-postseason">${remaining ? "Finish Regular Season" : "Seed Postseason"}</button>
      </section>
      <section class="grid-2 postseason-preview">
        ${postseasonSeedPreview("Eastern Conference", conferenceStandings("East"))}
        ${postseasonSeedPreview("Western Conference", conferenceStandings("West"))}
      </section>
    `;
  }
  const currentRound = postseason.round;
  const activeSeries = postseasonSeriesForRound(currentRound).filter((series) => !series.winnerId);
  const champion = postseason.championId ? getTeam(postseason.championId) : null;
  return `
    <h1 class="page-title">postseason</h1>
    <section class="card postseason-hero ${champion ? "champion-hero" : ""}">
      <div>
        <div class="card-label">${champion ? "nba champions" : "playoff bracket"}</div>
        <div class="postseason-title">${champion ? `${escapeHtml(champion.city)} ${escapeHtml(champion.name)}` : escapeHtml(postseasonRoundLabel(currentRound))}</div>
        <div class="meta">${champion ? `${save.season}-${String(save.season + 1).slice(-2)} season complete` : `${activeSeries.length} series still in progress`}</div>
      </div>
      <div class="actions">
        ${champion ? '<button class="btn primary" data-action="begin-offseason">Enter Offseason</button>' : '<button class="btn primary" data-action="sim-postseason-round">Sim Current Round</button>'}
      </div>
    </section>
    ${postseason.playIn ? playInPanel(postseason.playIn) : ""}
    <section class="postseason-bracket">
      ${postseasonRoundColumn("First Round", postseason.firstRound)}
      ${postseasonRoundColumn("Conference Semifinals", postseason.semifinals)}
      ${postseasonRoundColumn("Conference Finals", postseason.conferenceFinals)}
      ${postseasonRoundColumn("NBA Finals", postseason.finals ? [postseason.finals] : [])}
    </section>
  `;
}

function postseasonSeedPreview(title, rows) {
  return `<section class="card table-card standings-table postseason-seeds">
    <div class="standings-title">${title}</div>
    <table><thead><tr><th>#</th><th>Team</th><th>Record</th><th>Status</th></tr></thead>
    <tbody>${rows.slice(0, 10).map((entry) => `<tr class="${entry.team.id === save.activeTeamId ? "active-standing" : ""}"><td>${entry.seed}</td><td><strong>${escapeHtml(entry.team.abbr)}</strong><small>${escapeHtml(entry.team.city)} ${escapeHtml(entry.team.name)}</small></td><td>${entry.team.wins}-${entry.team.losses}</td><td>${entry.seed <= 6 ? "Playoffs" : "Play-In"}</td></tr>`).join("")}</tbody></table>
  </section>`;
}

function playInPanel(playIn) {
  return `<section class="card play-in-panel">
    <div><div class="card-label">play-in tournament</div><strong>Seeds 7 and 8 decided</strong></div>
    <div class="play-in-results">${[...playIn.East, ...playIn.West].map((game) => `<span><b>${escapeHtml(game.conf)}</b> ${escapeHtml(teamName(game.away))} ${game.awayScore} - ${game.homeScore} ${escapeHtml(teamName(game.home))}</span>`).join("")}</div>
  </section>`;
}

function postseasonRoundColumn(label, seriesList) {
  return `<section class="postseason-round"><div class="postseason-round-title">${label}</div>${seriesList.length ? seriesList.map(postseasonSeriesCard).join("") : '<div class="card postseason-tbd">TBD</div>'}</section>`;
}

function postseasonSeriesCard(series) {
  const high = getTeam(series.highTeamId);
  const low = getTeam(series.lowTeamId);
  const winner = series.winnerId;
  const playable = !winner && series.round === save.postseason.round;
  const activeClass = series.highTeamId === save.activeTeamId || series.lowTeamId === save.activeTeamId ? " active-series" : "";
  return `<article class="card postseason-series${activeClass}">
    <div class="series-label">${escapeHtml(series.conf || "NBA")} ${winner ? "Final" : `Best of 7${series.games.length ? ` - Game ${series.games.length + 1}` : ""}`}</div>
    <div class="series-team ${winner === high.id ? "series-winner" : ""}"><span><b>${series.highSeed}</b> ${escapeHtml(high.abbr)}</span><strong>${series.highWins}</strong></div>
    <div class="series-team ${winner === low.id ? "series-winner" : ""}"><span><b>${series.lowSeed}</b> ${escapeHtml(low.abbr)}</span><strong>${series.lowWins}</strong></div>
    ${winner ? `<small>${escapeHtml(teamName(winner))} won ${Math.max(series.highWins, series.lowWins)}-${Math.min(series.highWins, series.lowWins)}</small>` : playable ? `<button class="btn" data-postseason-series="${series.id}">Sim Series</button>` : '<small>Awaiting prior round</small>'}
  </article>`;
}

function postseasonRoundLabel(round) {
  return ({ firstRound: "First Round", semifinals: "Conference Semifinals", conferenceFinals: "Conference Finals", finals: "NBA Finals", complete: "Season Complete" })[round] || "Postseason";
}

const offseasonStages = ["lottery", "scouting", "draft", "options", "freeAgency", "roster"];

function offseasonPage() {
  const state = save.offseason;
  if (!state) {
    if (save.phase !== "Offseason" && !save.postseason?.championId) return inSeasonFreeAgencyPage();
    const ready = save.phase === "Offseason" || save.postseason?.championId;
    return `<h1 class="page-title">offseason</h1>
      <section class="card offseason-hero"><div><div class="card-label">franchise calendar</div><div class="postseason-title">${ready ? "Build next season's roster" : "Offseason opens after the NBA Finals"}</div><div class="meta">Lottery, scouting, draft, contract decisions, free agency, and roster compliance are completed in order.</div></div>${ready ? '<button class="btn primary" data-action="begin-offseason">Begin Offseason</button>' : '<button class="btn" disabled>Regular Season Active</button>'}</section>`;
  }
  const team = activeTeam();
  const target = state.targetSeason;
  const rosterStatus = offseasonRosterStatus(team.id, target);
  return `<h1 class="page-title">offseason</h1>
    <section class="card offseason-hero">
      <div><div class="card-label">${target} league year</div><div class="postseason-title">${escapeHtml(offseasonStageLabel(state.stage))}</div><div class="meta">${escapeHtml(offseasonStageDescription(state.stage))}</div></div>
      <div class="offseason-cap"><span>Projected Payroll</span><strong>$${projectedPayroll(team.id, target).toFixed(1)}M</strong><small>${rosterStatus.standard}/15 standard - ${rosterStatus.twoWay}/3 two-way</small></div>
    </section>
    <nav class="offseason-progress">${offseasonStages.map((stage, index) => `<span class="${stage === state.stage ? "active" : index < offseasonStages.indexOf(state.stage) ? "complete" : ""}">${index + 1}. ${escapeHtml(offseasonStageLabel(stage))}</span>`).join("")}</nav>
    <section class="grid-4">
      ${statCard("cap space", `$${offseasonCapSpace(team.id, target).toFixed(1)}M`)}
      ${statCard("roster", `${rosterStatus.standard} + ${rosterStatus.twoWay}`)}
      ${statCard("owned picks", offseasonOwnedPickCount(state, team.id))}
      ${statCard("owner approval", `${save.gmCareer.approval}%`)}
    </section>
    ${offseasonStageView(state)}
    ${offseasonNewsPanel()}`;
}

function offseasonStageView(state) {
  if (state.stage === "lottery") return lotteryStageView(state);
  if (state.stage === "scouting") return scoutingStageView(state);
  if (state.stage === "draft") return draftStageView(state);
  if (state.stage === "options") return optionsStageView(state);
  if (state.stage === "freeAgency") return freeAgencyStageView(state);
  return rosterStageView(state);
}

function offseasonOwnedPickCount(state, teamId) {
  if (state.draftOrder.length) {
    return state.draftOrder.filter((pick) => pick.ownerTeamId === teamId && !pick.prospectId).length;
  }
  return save.draftPicks.filter((pick) => pick.ownerTeamId === teamId && pick.season === state.targetSeason).length;
}

function lotteryStageView(state) {
  const lottery = state.lotteryOrder || [];
  return `<section class="card offseason-panel"><div class="offseason-panel-heading"><div><div class="card-label">draft lottery</div><div class="player-name">${lottery.length ? "Lottery Order" : "Fourteen Teams, Four Premium Picks"}</div></div>${lottery.length ? '<button class="btn primary" data-action="advance-scouting">Open Scouting</button>' : '<button class="btn primary" data-action="run-lottery">Run Draft Lottery</button>'}</div>
    ${lottery.length ? `<div class="lottery-grid">${lottery.map((teamId, index) => `<div class="lottery-pick ${teamId === save.activeTeamId ? "active" : ""}"><b>${index + 1}</b><span>${escapeHtml(teamName(teamId))}</span><small>${escapeHtml(state.lotteryMovement?.[teamId] || "")}</small></div>`).join("")}</div>` : '<div class="offseason-explainer">Lottery odds are weighted by regular-season record. Traded picks and top-pick protections resolve after the order is drawn.</div>'}
  </section>`;
}

function scoutingStageView(state) {
  const prospects = availableProspects().slice(0, 24);
  return `<section class="card offseason-panel"><div class="offseason-panel-heading"><div><div class="card-label">scouting department</div><div class="player-name">${state.scoutingPoints} reports remaining</div></div><button class="btn primary" data-action="advance-draft">Finalize Draft Board</button></div>
    <div class="prospect-grid">${prospects.map((prospect) => prospectCard(prospect, true)).join("")}</div>
  </section>`;
}

function prospectCard(prospect, scoutable) {
  const report = save.offseason.scoutingReports[prospect.id] || { level: 0 };
  const range = prospectEstimate(prospect, report.level);
  return `<article class="prospect-card ${prospect.draftedBy ? "drafted" : ""}">${playerHeadshot(prospect, "prospect-headshot")}<div class="prospect-rank">#${prospect.rank}</div><div><strong>${escapeHtml(prospect.name)}</strong><small>${escapeHtml(prospect.position)} - ${escapeHtml(prospect.archetype)} - ${escapeHtml(prospect.origin)}</small>${report.level >= 1 ? `<small>${escapeHtml(prospect.tendency || "balanced")} - NBA comp: ${escapeHtml(prospect.nbaComparison || "rotation player")}</small>` : ""}${report.level >= 2 ? `<small>Combine: ${escapeHtml(prospect.combine?.height || "-")} / ${prospect.combine?.vertical || "-"}\" vertical - Medical ${escapeHtml(prospect.medicalRisk || "unknown")}</small>` : ""}${report.level >= 3 ? `<small>Interview: ${escapeHtml(prospect.interview || "complete")}</small>` : ""}</div><div class="prospect-ratings"><span>OVR ${range.ovr}</span><span>POT ${range.pot}</span></div>${scoutable && !prospect.draftedBy ? `<button class="btn" data-scout-prospect="${prospect.id}" ${save.offseason.scoutingPoints <= 0 || report.level >= 3 ? "disabled" : ""}>${report.level >= 3 ? "Fully Scouted" : `Scout (${report.level}/3)`}</button>` : prospect.draftedBy ? `<small>Drafted by ${escapeHtml(teamName(prospect.draftedBy))}</small>` : ""}</article>`;
}

function draftStageView(state) {
  const pick = state.draftOrder[state.currentPick];
  if (!pick) return `<section class="card offseason-panel"><div class="offseason-panel-heading"><div><div class="card-label">nba draft</div><div class="player-name">Draft Complete</div></div><button class="btn primary" data-action="advance-options">Contract Decisions</button></div>${draftResultsTable(state)}</section>`;
  const userOnClock = pick.ownerTeamId === save.activeTeamId;
  return `<section class="card offseason-panel"><div class="offseason-panel-heading"><div><div class="card-label">round ${pick.round} - pick ${pick.overall}</div><div class="player-name">${escapeHtml(teamName(pick.ownerTeamId))} ${userOnClock ? "are on the clock" : "are selecting"}</div><div class="meta">Originally ${escapeHtml(teamName(pick.originalTeamId))}${pick.protected ? " - protection applied" : ""}</div></div><div class="actions">${userOnClock ? '<button class="btn" data-action="trade-current-pick">Trade For Future 1st</button>' : ""}<button class="btn primary" data-action="sim-draft-pick">${userOnClock ? "Auto Pick Best Available" : "Sim To Your Next Pick"}</button></div></div>
    <div class="draft-layout"><div class="prospect-grid compact">${availableProspects().slice(0, 18).map((prospect) => `<article class="prospect-card">${playerHeadshot(prospect, "prospect-headshot")}<div class="prospect-rank">#${prospect.rank}</div><div><strong>${escapeHtml(prospect.name)}</strong><small>${escapeHtml(prospect.position)} - ${escapeHtml(prospect.archetype)}</small></div><div class="prospect-ratings"><span>OVR ${prospectEstimate(prospect, state.scoutingReports[prospect.id]?.level || 0).ovr}</span><span>POT ${prospectEstimate(prospect, state.scoutingReports[prospect.id]?.level || 0).pot}</span></div>${userOnClock ? `<button class="btn primary" data-draft-prospect="${prospect.id}">Draft</button>` : ""}</article>`).join("")}</div><div>${draftResultsTable(state)}</div></div>
  </section>`;
}

function draftResultsTable(state) {
  const completed = state.draftOrder.filter((pick) => pick.prospectId);
  return `<section class="draft-results"><div class="card-label">draft log</div>${completed.slice(-12).reverse().map((pick) => { const prospect = state.draftClass.find((item) => item.id === pick.prospectId); return `<div><b>${pick.overall}</b><span>${escapeHtml(teamName(pick.ownerTeamId))}</span><strong>${escapeHtml(prospect?.name || "Unknown")}</strong></div>`; }).join("") || '<div class="muted-line">No selections yet.</div>'}</section>`;
}

function optionsStageView(state) {
  const decisions = state.contractDecisions.filter((item) => item.teamId === save.activeTeamId);
  const unresolved = decisions.filter((item) => !item.decision && item.kind === "teamOption");
  return `<section class="card offseason-panel"><div class="offseason-panel-heading"><div><div class="card-label">options and qualifying offers</div><div class="player-name">Retain rights or create flexibility</div></div><button class="btn primary" data-action="advance-free-agency" ${unresolved.length ? "disabled" : ""}>Open Free Agency</button></div>
    <div class="decision-list">${decisions.map(contractDecisionRow).join("") || '<div class="muted-line">No contract decisions are required for your team.</div>'}</div>
  </section>`;
}

function contractDecisionRow(item) {
  const player = save.players.find((candidate) => candidate.id === item.playerId);
  if (!player) return "";
  const complete = item.decision ? `<strong class="${item.decision === "decline" || item.decision === "renounce" ? "bad" : "ok"}">${escapeHtml(item.decision)}</strong>` : item.kind === "teamOption" ? `<button class="btn primary" data-option-player="${player.id}" data-option-decision="exercise">Exercise</button><button class="btn" data-option-player="${player.id}" data-option-decision="decline">Decline</button>` : `<button class="btn primary" data-option-player="${player.id}" data-option-decision="qualify">Qualifying Offer</button><button class="btn" data-option-player="${player.id}" data-option-decision="renounce">Renounce</button>`;
  return `<div class="decision-row"><div><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(item.label)} - $${item.amount.toFixed(1)}M</small></div><div class="actions">${complete}</div></div>`;
}

function inSeasonFreeAgencyPage() {
  const team = activeTeam();
  const rules = transactionRuleState();
  const roster = rosterRuleStatus(team.id);
  const maxRoster = save.leagueRules?.maxRoster || 15;
  const rosterSpots = Math.max(0, maxRoster - roster.standard);
  const capSpace = Math.max(0, cbaThresholds(save.season).cap - Number(team.payroll || 0));
  const query = inSeasonFaSearch.trim().toLowerCase();
  const freeAgents = save.players
    .filter((player) => !player.teamId)
    .filter((player) => inSeasonFaPosition === "all" || String(player.pos || "").includes(inSeasonFaPosition))
    .filter((player) => !query || `${player.name} ${player.pos} ${player.archetype || ""}`.toLowerCase().includes(query))
    .sort((a, b) => {
      const statSorts = { ppg: "ppg", rpg: "rpg", apg: "apg", fg: "fg", three: "three" };
      if (statSorts[inSeasonFaSort]) {
        const statDiff = Number(freeAgentMarketStats(b)[statSorts[inSeasonFaSort]]) - Number(freeAgentMarketStats(a)[statSorts[inSeasonFaSort]]);
        return (inSeasonFaSortDirection === "asc" ? -statDiff : statDiff) || b.ovr - a.ovr;
      }
      if (inSeasonFaSort === "age") return a.age - b.age || b.ovr - a.ovr;
      if (inSeasonFaSort === "salary") return playerMarketSalary(a) - playerMarketSalary(b) || b.ovr - a.ovr;
      return b.ovr - a.ovr || a.age - b.age;
    });
  const playoffNote = rules.playoffWaiverEligible ? "Players signed now remain playoff eligible." : "Players waived after March 1 are not playoff eligible for a new team.";
  const waiverCandidates = [...teamPlayers(team.id)].filter((player) => rosterType(player) !== "twoWay").sort((a, b) => a.ovr - b.ovr || contractSalary(b) - contractSalary(a)).slice(0, 3);
  return `<section class="card in-season-fa-hero">
      <div><div class="card-label">regular-season player market</div><div class="player-name">Upgrade the ${escapeHtml(team.abbr)} roster</div><p>Sign available veterans throughout the season without changing your current rotation.</p></div>
      <div class="in-season-fa-rule"><span>${rules.tenDayContracts ? "10-DAY WINDOW OPEN" : "STANDARD CONTRACTS"}</span><strong>${rosterSpots} ROSTER SPOT${rosterSpots === 1 ? "" : "S"}</strong><small>${escapeHtml(playoffNote)}</small></div>
    </section>
    <section class="in-season-fa-summary">
      ${inSeasonFaSummaryCard("players", "available players", freeAgents.length, "blue")}
      ${inSeasonFaSummaryCard("roster", "standard roster", `${roster.standard}/${maxRoster}`, "blue")}
      ${inSeasonFaSummaryCard("cap", "cap space", `$${capSpace.toFixed(1)}M`, "red")}
      ${inSeasonFaSummaryCard("exception", "minimum exception", "Available", "red")}
    </section>
    ${rosterSpots ? "" : `<section class="card in-season-waiver-strip"><div><div class="card-label">roster move required</div><strong>Open a standard roster spot before signing.</strong><small>Waived guaranteed salary remains on your cap. The player enters the league free-agent pool.</small></div><div>${waiverCandidates.map((player) => `<button class="btn danger in-season-waive-button" data-in-season-waive="${player.id}" type="button">${playerHeadshot(player, "in-season-waive-headshot")}<span><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} &middot; ${player.ovr} OVR</small></span><em>WAIVE</em></button>`).join("")}</div></section>`}
    <section class="card in-season-fa-market">
      <header class="in-season-fa-toolbar">
        <div><div class="card-label">nba free-agent pool</div><div class="player-name">Available Players</div></div>
        <div class="in-season-fa-controls">
          <label class="in-season-fa-search-field"><span aria-hidden="true">&#9906;</span><input id="in-season-fa-search" value="${escapeHtml(inSeasonFaSearch)}" placeholder="Search player or archetype"><small>PLAYER SEARCH</small></label>
          <label><small>POSITION</small><select id="in-season-fa-position"><option value="all">All Positions</option>${["PG", "SG", "SF", "PF", "C"].map((position) => `<option value="${position}" ${inSeasonFaPosition === position ? "selected" : ""}>${position}</option>`).join("")}</select></label>
          <label><small>SORT MARKET</small><select id="in-season-fa-sort"><option value="overall" ${inSeasonFaSort === "overall" ? "selected" : ""}>Best Overall</option><option value="salary" ${inSeasonFaSort === "salary" ? "selected" : ""}>Lowest Asking Price</option><option value="age" ${inSeasonFaSort === "age" ? "selected" : ""}>Youngest</option></select></label>
          <button class="btn primary" data-action="filter-in-season-fa"><span aria-hidden="true">&#8635;</span> Apply Filters</button>
        </div>
      </header>
      <div class="in-season-fa-list"><div class="in-season-fa-list-head"><span>Player</span><span class="in-season-fa-stat-filter">${[["ppg", "PPG"], ["rpg", "RPG"], ["apg", "APG"], ["fg", "FG"], ["three", "3P"]].map(([value, label]) => `<button class="${inSeasonFaSort === value ? `active ${inSeasonFaSortDirection}` : ""}" data-in-season-fa-sort="${value}">${label}</button>`).join("")}</span><span>Contract</span><span>Interest</span><span>Fit</span><span>Actions</span></div>${freeAgents.map((player) => inSeasonFreeAgentCard(player, rules, rosterSpots)).join("") || '<div class="muted-line">No unsigned players match these filters.</div>'}</div>
    </section>`;
}

function inSeasonFaSummaryCard(icon, label, value, tone = "blue") {
  return `<article class="card in-season-fa-stat ${tone === "red" ? "warning" : ""}">
    <span class="in-season-fa-stat-icon ${escapeHtml(icon)}" aria-hidden="true"></span>
    <div><div class="card-label">${escapeHtml(label)}</div><div class="stat-value">${value}</div></div>
  </article>`;
}

function inSeasonFreeAgentCard(player, rules, rosterSpots) {
  const minimum = inSeasonMinimumSalary(player);
  const market = playerMarketSalary(player);
  const canUseMarket = canTeamOfferInSeasonSalary(save.activeTeamId, market);
  const playoffEligible = !player.waivedDate || player.waivedDate <= `${save.season + 1}-03-01`;
  const formerTeamBlocked = player.originalTeamId === save.activeTeamId && Boolean(player.waivedDate);
  const stats = freeAgentMarketStats(player);
  const interest = freeAgentInterestScore(player, market, rosterSpots, formerTeamBlocked);
  const fit = freeAgentTeamFitScore(player);
  const contractYears = Math.max(1, Math.min(4, player.ovr >= 78 ? 3 : player.ovr >= 72 ? 2 : 1));
  const role = player.ovr >= 78 ? "Starter" : player.ovr >= 73 ? "Rotation" : player.three >= 78 || player.rim >= 78 ? "Sixth Man" : "Backup";
  const interestTone = interest >= 78 ? "strong" : interest >= 58 ? "medium" : "low";
  const fitTone = fit >= 84 ? "excellent" : fit >= 70 ? "good" : fit >= 55 ? "average" : "poor";
  const fitLabel = fit >= 84 ? "Excellent" : fit >= 70 ? "Good" : fit >= 55 ? "Average" : "Poor";
  const badges = freeAgentFitBadges(player, fit);
  return `<article class="in-season-fa-player phase6-card">
    <div class="in-season-fa-player-cell"><button class="in-season-fa-star" aria-label="Add ${escapeHtml(player.name)} to watchlist">☆</button><div class="in-season-fa-portrait">${playerHeadshot(player, "in-season-fa-headshot")}</div><div class="in-season-fa-ovr"><b>${player.ovr}</b><span>OVR</span></div><div class="in-season-fa-identity"><strong>${escapeHtml(player.name)}</strong><span>${escapeHtml(player.pos)} · ${player.age} Years Old</span><small>${escapeHtml(player.archetype || "NBA veteran")}</small><em>${teamLogo(player.originalTeamId || player.teamId || save.activeTeamId, "in-season-fa-mini-logo")} ${escapeHtml(player.contract?.freeAgentType || "UFA")} · ${Math.max(1, player.contract?.serviceYears || player.age - 19)} Yrs Exp</em></div><div class="in-season-fa-pot"><b>${player.pot}</b><span>POT</span></div></div>
    <div class="in-season-fa-stats">${[
      ["PPG", stats.ppg], ["RPG", stats.rpg], ["APG", stats.apg], ["FG", stats.fg], ["3P", stats.three], ["GP", stats.gp], ["MPG", stats.mpg], ["PER", stats.per], ["WS", stats.ws]
    ].map(([label, value]) => `<span><small>${label}</small><b>${value}</b></span>`).join("")}</div>
    <div class="in-season-fa-contract"><strong>$${market.toFixed(1)}M <small>/yr</small></strong><span>${contractYears} Year${contractYears === 1 ? "" : "s"}</span><em>Role: ${escapeHtml(role)}</em></div>
    <div class="in-season-fa-interest ${interestTone}" style="--interest:${interest}%"><header><span>PLAYER INTEREST</span><b>${interest >= 80 ? "HOT" : interest >= 60 ? "OPEN" : interest >= 45 ? "MIXED" : "LOW"}</b></header><strong>${interest}<small>%</small></strong><span>${interest >= 80 ? "Very Interested" : interest >= 60 ? "Interested" : interest >= 45 ? "Neutral" : "Not Very Interested"}</span><div class="in-season-fa-interest-meter"><i></i></div><div class="in-season-fa-interest-stars">${Array.from({ length: 5 }, (_, index) => `<i class="${index < Math.round(interest / 20) ? "filled" : ""}">★</i>`).join("")}</div><small>${interest >= 80 ? "Top Priority" : interest >= 60 ? "Priority" : interest >= 45 ? "Watch List" : "Long Shot"}</small></div>
    <div class="in-season-fa-fit ${fitTone}"><header><span>TEAM FIT</span><b>${fitLabel.toUpperCase()}</b></header><div class="in-season-fa-fit-score"><div class="in-season-fa-fit-ring" style="--fit:${fit * 3.6}deg"><strong>${fit}%</strong></div><span>${fitLabel}</span></div><ul>${badges.map((badge) => `<li class="${badge.tone}">${escapeHtml(badge.text)}</li>`).join("")}</ul></div>
    <div class="in-season-fa-actions">
      <button class="btn fa-action-profile" data-view-player="${player.id}"><small>VIEW</small><strong>Profile</strong></button><button class="btn fa-action-compare" data-view-player="${player.id}"><small>VS</small><strong>Compare</strong></button><button class="btn fa-action-scout" data-view-player="${player.id}"><small>EVAL</small><strong>Scout</strong></button><button class="btn primary in-season-negotiate" data-in-season-sign="${player.id}" data-contract-type="${canUseMarket ? "market" : rules.tenDayContracts ? "tenDay" : "minimum"}" ${rosterSpots && !formerTeamBlocked ? "" : "disabled"}><small>${rosterSpots && !formerTeamBlocked ? "OFFER" : "LOCKED"}</small><strong>Negotiate</strong></button>
    </div>
  </article>`;
}

function freeAgentMarketStats(player) {
  const imported = player.importedStats || {};
  const season = playerSeasonStats(player.id);
  const games = Math.max(1, Number(imported.GP || imported.G || season.games || 64));
  const ppg = Number((imported.PTS ?? statPerGame(season.points, season.games)) || (6 + (player.ovr - 66) * .62 + player.minutes * .18 + player.rim * .025 + player.three * .03));
  const rpg = Number((imported.REB ?? statPerGame(season.rebounds, season.games)) || Math.max(2.1, (player.pos.includes("C") || player.pos.includes("PF") ? 4.6 : 2.4) + player.def * .03));
  const apg = Number((imported.AST ?? statPerGame(season.assists, season.games)) || Math.max(1.2, (player.pos.includes("PG") ? 4.2 : player.pos.includes("SG") ? 2.5 : 1.7) + player.pass * .045));
  const fg = Number(imported.FG_PCT ? statNumber(imported.FG_PCT) * 100 : 40 + player.rim * .075 + player.mid * .03);
  const three = Number(imported.FG3_PCT ? statNumber(imported.FG3_PCT) * 100 : 27 + player.three * .12);
  const mpg = Number(imported.MIN || player.minutes || Math.max(10, Math.min(31, 12 + (player.ovr - 66) * .75)));
  return {
    ppg: ppg.toFixed(1),
    rpg: rpg.toFixed(1),
    apg: apg.toFixed(1),
    fg: Math.min(62, fg).toFixed(1),
    three: Math.min(47, three).toFixed(1),
    gp: Math.round(Math.min(82, games)),
    mpg: mpg.toFixed(1),
    per: Math.max(8, Math.min(24, 8 + (player.ovr - 66) * .55 + player.pot / 40)).toFixed(1),
    ws: Math.max(.2, Math.min(7.8, (player.ovr - 62) * .14 + Number(ppg) * .06)).toFixed(1)
  };
}

function freeAgentInterestScore(player, market, rosterSpots, blocked) {
  if (blocked || !rosterSpots) return 24;
  const team = activeTeam();
  const need = teamPlayers(team.id).filter((teammate) => String(teammate.pos || "").includes(String(player.pos || "").split("/")[0])).length <= 3 ? 12 : 0;
  const capSpace = Math.max(0, cbaThresholds(save.season).firstApron - Number(team.payroll || 0));
  const affordability = capSpace >= market ? 10 : capSpace >= market * .5 ? 4 : -8;
  const score = 44 + (player.ovr - 68) * 3.4 + (player.pot - player.ovr) * .9 + need + affordability - Math.max(0, player.age - 31) * 3;
  return Math.max(28, Math.min(96, Math.round(score)));
}

function freeAgentTeamFitScore(player) {
  const plan = gamePlan(save.activeTeamId);
  let score = 54 + (player.ovr - 68) * 1.8 + (player.pot - player.ovr) * .55;
  if (plan.offense === "perimeter" && player.three >= 76) score += 11;
  if (plan.offense === "rim" && player.rim >= 76) score += 9;
  if (plan.offense === "ball movement" && player.pass >= 74) score += 9;
  if (plan.defense === "switch" && player.def >= 74) score += 8;
  if (player.age >= 32) score -= 5;
  return Math.max(38, Math.min(96, Math.round(score)));
}

function freeAgentFitBadges(player, fit) {
  const items = [];
  items.push({ tone: "good", text: fit >= 70 ? "Fits System" : "Possible Fit" });
  items.push({ tone: player.three >= 76 ? "good" : "warn", text: player.three >= 76 ? "Good Spacing" : "Limited Spacing" });
  items.push({ tone: player.def >= 76 ? "good" : "warn", text: player.def >= 76 ? "Good Defender" : "Needs Support" });
  items.push({ tone: player.age >= 31 ? "bad" : "good", text: player.age >= 31 ? "Age Concern" : "Prime Window" });
  return items;
}

function freeAgencyStageView(state) {
  const pendingMatches = state.pendingMatches.filter((item) => item.teamId === save.activeTeamId);
  const freeAgents = state.freeAgentIds.map((id) => save.players.find((player) => player.id === id)).filter(Boolean).sort((a, b) => b.ovr - a.ovr);
  return `<section class="card offseason-panel"><div class="offseason-panel-heading"><div><div class="card-label">free agency - day ${state.freeAgencyDay}</div><div class="player-name">Negotiate, compete, and protect RFA rights</div></div><div class="actions"><button class="btn" data-action="resolve-free-agency">Resolve Offers</button><button class="btn primary" data-action="advance-roster" ${pendingMatches.length ? "disabled" : ""}>Roster Finalization</button></div></div>
    ${pendingMatches.map(rfaMatchCard).join("")}
    <div class="free-agent-grid">${freeAgents.slice(0, 30).map(freeAgentCard).join("") || '<div class="muted-line">The market has cleared.</div>'}</div>
  </section>`;
}

function freeAgentCard(player) {
  const state = save.offseason;
  const market = playerMarketSalary(player);
  const ownOffer = state.offers.find((offer) => offer.playerId === player.id && offer.teamId === save.activeTeamId);
  return `<article class="free-agent-card"><div><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} - ${player.ovr} OVR - ${escapeHtml(player.contract.freeAgentType || "UFA")}</small><button class="mini-action" data-view-player="${player.id}">View Card</button></div><div><b>$${market.toFixed(1)}M</b><small>market salary</small></div><div class="actions">${ownOffer ? `<span class="offer-chip">${ownOffer.years} yr / $${ownOffer.salary.toFixed(1)}M - ${escapeHtml(ownOffer.role)}</span>` : `<button class="btn" data-fa-offer="${player.id}" data-offer-tier="market">Market</button><button class="btn primary" data-fa-offer="${player.id}" data-offer-tier="premium">Premium</button>`}</div></article>`;
}

function rfaMatchCard(match) {
  const player = save.players.find((candidate) => candidate.id === match.playerId);
  return `<div class="rfa-match"><div><div class="card-label">restricted free agent decision</div><strong>${escapeHtml(player?.name || "Player")}</strong><small>${escapeHtml(teamName(match.offer.teamId))} offered ${match.offer.years} years at $${match.offer.salary.toFixed(1)}M</small></div><div class="actions"><button class="btn primary" data-rfa-match="${match.playerId}" data-match-decision="match">Match</button><button class="btn" data-rfa-match="${match.playerId}" data-match-decision="decline">Decline</button></div></div>`;
}

function rosterStageView(state) {
  const status = offseasonRosterStatus(save.activeTeamId, state.targetSeason);
  const coach = coachingProfile(save.activeTeamId);
  return `<section class="grid-2 offseason-final-grid"><section class="card offseason-panel"><div class="card-label">roster compliance</div><div class="player-name">Opening-night checklist</div><div class="decision-list">${status.messages.map((item) => `<div class="decision-row"><span>${escapeHtml(item.text)}</span><strong class="${item.ok ? "ok" : "bad"}">${item.ok ? "PASS" : "FIX"}</strong></div>`).join("")}</div><div class="actions"><button class="btn" data-action="auto-roster">Auto Complete Roster</button><button class="btn primary" data-action="finish-offseason" ${status.valid ? "" : "disabled"}>Start ${state.targetSeason}-${String(state.targetSeason + 1).slice(-2)} Season</button></div></section>
    <section class="card offseason-panel"><div class="card-label">coaching staff</div><div class="player-name">${escapeHtml(coach.style)} Identity</div>${metric("Tactics", coach.tactics)}${metric("Development", coach.development)}${metric("Medical", coach.medical)}<div class="coach-options">${["Balanced", "Development", "Defense", "Pace"].map((style) => `<button class="btn ${coach.style === style ? "primary" : ""}" data-coach-style="${style}">${style}</button>`).join("")}</div></section></section>
    ${jobOffersPanel()}`;
}

function jobOffersPanel() {
  const offers = save.gmCareer.jobOffers || [];
  if (!offers.length) return "";
  return `<section class="card offseason-panel"><div class="card-label">gm job market</div><div class="job-offers">${offers.map((teamId) => `<button class="btn" data-job-team="${teamId}">Interview: ${escapeHtml(teamName(teamId))}</button>`).join("")}</div></section>`;
}

function offseasonNewsPanel() {
  return `<section class="card wide-card"><div class="card-label">offseason wire</div><div class="inbox-list">${(save.transactionLog || []).slice(-10).reverse().map((item) => `<div class="inbox-item"><strong>${escapeHtml(item.type)}</strong> ${escapeHtml(item.text)}</div>`).join("") || '<div class="muted-line">No offseason transactions yet.</div>'}</div></section>`;
}

function offseasonStageLabel(stage) {
  return ({ lottery: "Draft Lottery", scouting: "Prospect Scouting", draft: "NBA Draft", options: "Options + Qualifying Offers", freeAgency: "Free Agency", roster: "Roster Finalization" })[stage] || "Offseason";
}

function offseasonStageDescription(stage) {
  return ({ lottery: "Determine the first-round order and resolve protected picks.", scouting: "Spend limited reports to reduce uncertainty on the draft class.", draft: "Make two rounds of selections with AI teams drafting around need and upside.", options: "Decide team options, qualifying offers, and cap holds.", freeAgency: "Submit offers and compete with AI front offices for available players.", roster: "Reach a legal roster, set staff identity, and open training camp." })[stage] || "Build the next roster.";
}

function beginOffseason() {
  if (save.offseason) {
    active = "offseason";
    render();
    return;
  }
  if (!save.postseason?.championId && save.phase !== "Offseason") return;
  recordSeasonHistory();
  const targetSeason = save.season + 1;
  save.offseason = {
    version: 1,
    targetSeason,
    stage: "lottery",
    completedStages: [],
    lotteryOrder: [],
    lotteryMovement: {},
    draftClass: generateDraftClass(targetSeason),
    draftOrder: [],
    currentPick: 0,
    scoutingPoints: 12,
    scoutingReports: {},
    contractDecisions: [],
    freeAgentIds: [],
    offers: [],
    pendingMatches: [],
    freeAgencyDay: 1
  };
  save.phase = "Offseason";
  updateGmCareerAfterSeason();
  addTransaction("League", `${save.season}-${String(save.season + 1).slice(-2)} offseason opened.`);
  active = "offseason";
  persist();
  render();
}

function resolveDraftLottery() {
  const state = save.offseason;
  if (!state || state.lotteryOrder.length) return;
  const recordOrder = [...save.teams].sort((a, b) => a.wins - b.wins || b.losses - a.losses || a.id.localeCompare(b.id));
  const lotteryTeams = recordOrder.slice(0, 14);
  const random = seededRandom(`lottery-${state.targetSeason}`);
  const available = [...lotteryTeams];
  const winners = [];
  for (let pick = 0; pick < 4; pick += 1) {
    const weights = available.map((team, index) => Math.max(1, 14 - recordOrder.indexOf(team)));
    let roll = random() * weights.reduce((sum, value) => sum + value, 0);
    let selectedIndex = 0;
    for (let index = 0; index < weights.length; index += 1) {
      roll -= weights[index];
      if (roll <= 0) { selectedIndex = index; break; }
    }
    winners.push(available.splice(selectedIndex, 1)[0]);
  }
  const orderedLottery = [...winners, ...available.sort((a, b) => recordOrder.indexOf(a) - recordOrder.indexOf(b))];
  state.lotteryOrder = orderedLottery.map((team) => team.id);
  state.lotteryMovement = Object.fromEntries(orderedLottery.map((team, index) => {
    const old = recordOrder.indexOf(team) + 1;
    const next = index + 1;
    return [team.id, old === next ? "Held position" : next < old ? `Moved up ${old - next}` : `Moved down ${next - old}`];
  }));
  const firstRound = [...orderedLottery, ...recordOrder.slice(14)];
  const secondRound = [...recordOrder];
  state.draftOrder = [...firstRound.map((team, index) => createDraftOrderEntry(team.id, 1, index + 1)), ...secondRound.map((team, index) => createDraftOrderEntry(team.id, 2, index + 31))];
  addTransaction("Lottery", `${teamName(state.lotteryOrder[0])} won the ${state.targetSeason} NBA Draft Lottery.`);
  persist();
  render();
}

function createDraftOrderEntry(originalTeamId, round, overall) {
  const state = save.offseason;
  const pick = save.draftPicks.find((candidate) => candidate.originalTeamId === originalTeamId && candidate.season === state.targetSeason && candidate.round === round);
  let ownerTeamId = pick?.ownerTeamId || originalTeamId;
  let isProtected = false;
  const protectionLimit = Number(String(pick?.protection || "").match(/top\s*(\d+)/i)?.[1] || 0);
  if (round === 1 && protectionLimit && overall <= protectionLimit && ownerTeamId !== originalTeamId) {
    ownerTeamId = originalTeamId;
    isProtected = true;
    deferProtectedPick(pick, state.targetSeason + 1);
  }
  return { id: `draft-${state.targetSeason}-${overall}`, overall, round, originalTeamId, ownerTeamId, pickId: pick?.id || null, protected: isProtected, prospectId: null };
}

function deferProtectedPick(pick, season) {
  if (!pick) return;
  const deferred = save.draftPicks.find((candidate) => candidate.originalTeamId === pick.originalTeamId && candidate.season === season && candidate.round === pick.round);
  if (deferred) deferred.ownerTeamId = pick.ownerTeamId;
  pick.ownerTeamId = pick.originalTeamId;
}

function generateDraftClass(season) {
  const data = window.nbaOffseasonData || {};
  const firstNames = data.firstNames || ["Alex", "Jordan", "Taylor"];
  const lastNames = data.lastNames || ["Smith", "Jones", "Brown"];
  const positions = data.positions || ["PG", "SG", "SF", "PF", "C"];
  const archetypes = data.archetypes || ["Two-Way", "Scorer", "Playmaker"];
  const colleges = data.colleges || ["International"];
  const classRandom = seededRandom(`draft-class-strength-${season}`);
  const classStrength = .9 + classRandom() * .22;
  return Array.from({ length: 70 }, (_, index) => {
    const random = seededRandom(`prospect-${season}-${index}`);
    const position = positions[Math.floor(random() * positions.length)];
    const ovr = Math.max(58, Math.min(84, Math.round((77 - index * 0.18 + (random() - 0.5) * 10) * classStrength)));
    const potential = Math.max(ovr, Math.min(97, Math.round((ovr + 5 + random() * 15 - index * 0.04) * classStrength)));
    const boomBust = Math.round((random() - 0.5) * 12);
    return {
      id: `prospect-${season}-${index + 1}`,
      rank: index + 1,
      name: `${firstNames[(index + Math.floor(random() * firstNames.length)) % firstNames.length]} ${lastNames[(index * 3 + Math.floor(random() * lastNames.length)) % lastNames.length]}`,
      age: 19 + Math.floor(random() * 4),
      position,
      archetype: archetypes[Math.floor(random() * archetypes.length)],
      origin: colleges[Math.floor(random() * colleges.length)],
      college: colleges[Math.floor(random() * colleges.length)],
      ovr,
      potential,
      trueOverall: ovr,
      truePotential: potential,
      boomBust,
      tendency: ["high usage", "connector", "spot-up", "rim pressure", "defensive specialist", "pick-and-roll"][Math.floor(random() * 6)],
      nbaComparison: ["two-way starter", "bench creator", "movement shooter", "switchable defender", "interior finisher", "lead guard"][Math.floor(random() * 6)],
      combine: { height: position === "C" ? `7'${Math.floor(random() * 3)}\"` : position === "PG" ? `6'${2 + Math.floor(random() * 3)}\"` : `6'${5 + Math.floor(random() * 5)}\"`, wingspan: `7'${Math.floor(random() * 8)}\"`, vertical: 28 + Math.floor(random() * 16), sprint: (3 + random() * .35).toFixed(2) },
      medicalRisk: ["low", "low", "moderate", "moderate", "high"][Math.floor(random() * 5)],
      interview: ["high character", "confident", "reserved", "competitive", "needs structure"][Math.floor(random() * 5)],
      three: Math.round(58 + random() * 34), mid: Math.round(58 + random() * 34), rim: Math.round(58 + random() * 34), pass: Math.round(58 + random() * 34), def: Math.round(58 + random() * 34), stamina: Math.round(70 + random() * 25),
      draftedBy: null
    };
  }).sort((a, b) => (b.ovr + b.potential) - (a.ovr + a.potential)).map((prospect, index) => ({ ...prospect, rank: index + 1 }));
}

function prospectEstimate(prospect, level) {
  if (level >= 3) return { ovr: String(prospect.ovr), pot: String(prospect.potential) };
  const spread = level === 2 ? 2 : level === 1 ? 4 : 7;
  const random = seededRandom(`scout-${prospect.id}-${level}`);
  const estimate = (value) => {
    const center = Math.round(value + (random() - 0.5) * spread * 1.5);
    return `${Math.max(40, center - spread)}-${Math.min(99, center + spread)}`;
  };
  return { ovr: estimate(prospect.ovr), pot: estimate(prospect.potential) };
}

function scoutProspect(prospectId) {
  const state = save.offseason;
  if (!state || state.stage !== "scouting" || state.scoutingPoints <= 0) return;
  const report = state.scoutingReports[prospectId] || { level: 0 };
  if (report.level >= 3) return;
  report.level += 1;
  state.scoutingReports[prospectId] = report;
  state.scoutingPoints -= 1;
  persist();
  render();
}

function availableProspects() {
  return (save.offseason?.draftClass || []).filter((prospect) => !prospect.draftedBy).sort((a, b) => a.rank - b.rank);
}

function advanceOffseasonStage(stage) {
  const state = save.offseason;
  if (!state) return;
  if (!state.completedStages.includes(state.stage)) state.completedStages.push(state.stage);
  state.stage = stage;
  if (stage === "draft") simulateDraftToUserPick();
  if (stage === "options") prepareContractDecisions();
  if (stage === "freeAgency") prepareFreeAgency();
  if (stage === "roster") finalizeAiRosters();
  persist();
  render();
}

function simulateDraftToUserPick() {
  const state = save.offseason;
  while (state.currentPick < state.draftOrder.length) {
    const pick = state.draftOrder[state.currentPick];
    if (pick.ownerTeamId === save.activeTeamId) break;
    draftProspectForTeam(aiDraftChoice(pick.ownerTeamId), pick);
  }
}

function aiDraftChoice(teamId) {
  const strategy = save.teamStrategies[teamId] || { timeline: "balanced" };
  const needs = weakestPositionGroup(teamPlayers(teamId));
  return availableProspects().map((prospect) => {
    const needBonus = needs.includes("guard") && prospect.position.includes("G") || needs.includes("wing") && prospect.position.includes("F") || needs.includes("big") && prospect.position.includes("C") ? 5 : 0;
    const upsideWeight = strategy.timeline === "rebuilding" ? 1.1 : 0.65;
    return { prospect, score: prospect.ovr + prospect.potential * upsideWeight + needBonus + prospect.boomBust * 0.15 };
  }).sort((a, b) => b.score - a.score)[0]?.prospect;
}

function draftProspect(prospectId) {
  const state = save.offseason;
  const pick = state?.draftOrder[state.currentPick];
  if (!pick || pick.ownerTeamId !== save.activeTeamId) return;
  const prospect = state.draftClass.find((item) => item.id === prospectId && !item.draftedBy);
  if (!prospect) return;
  draftProspectForTeam(prospect, pick);
  simulateDraftToUserPick();
  persist();
  render();
}

function draftProspectForTeam(prospect, pick) {
  if (!prospect || !pick) return;
  prospect.draftedBy = pick.ownerTeamId;
  pick.prospectId = prospect.id;
  save.players.push(createRookieFromProspect(prospect, pick));
  save.offseason.currentPick += 1;
  addTransaction("Draft", `${teamName(pick.ownerTeamId)} selected ${prospect.name} with pick ${pick.overall}.`);
}

function tradeCurrentDraftPick() {
  const state = save.offseason;
  const pick = state?.draftOrder[state.currentPick];
  if (!pick || pick.ownerTeamId !== save.activeTeamId) return;
  const partner = save.teams.filter((team) => team.id !== save.activeTeamId).sort((a, b) => (save.teamStrategies[b.id]?.aggression || 0) - (save.teamStrategies[a.id]?.aggression || 0))[0];
  const future = save.draftPicks.find((candidate) => candidate.originalTeamId === partner.id && candidate.ownerTeamId === partner.id && candidate.season === state.targetSeason + 1 && candidate.round === 1);
  if (!partner || !future) {
    save.messages.push("No team has an eligible future first-round pick available.");
    render();
    return;
  }
  pick.ownerTeamId = partner.id;
  future.ownerTeamId = save.activeTeamId;
  addTransaction("Draft Trade", `${teamName(save.activeTeamId)} traded pick ${pick.overall} to ${teamName(partner.id)} for its ${future.season} first-round pick.`);
  simulateDraftToUserPick();
  persist();
  render();
}

function createRookieFromProspect(prospect, pick) {
  const rookie = player(prospect.id, prospect.name, prospect.age, prospect.position, "", prospect.archetype, pick.ownerTeamId, prospect.ovr, prospect.potential, prospect.three, prospect.mid, prospect.rim, prospect.pass, prospect.def, prospect.stamina, 0);
  const target = save.offseason.targetSeason;
  const salary = rookieScaleSalary(pick.overall);
  rookie.contract = { startSeason: target, endSeason: target + 3, salaries: { [target]: salary, [target + 1]: roundMoney(salary * 1.05), [target + 2]: roundMoney(salary * 1.1), [target + 3]: roundMoney(salary * 1.15) }, guaranteedThrough: target + 1, option: { type: "TO", season: target + 3, decided: false }, yearsWithTeam: 0, birdRights: "Non-Bird", freeAgentType: "RFA", salaryType: "Rookie Scale", signedDate: `${target}-07-01`, tradeEligibleDate: `${target}-12-15`, serviceYears: 0, noTradeClause: false, capHold: 0, rosterType: "standard", playoffEligible: true };
  rookie.activeRoster = false;
  rookie.developmentHistory = [];
  rookie.careerStats = { games: 0, points: 0, rebounds: 0, assists: 0 };
  rookie.draftInfo = { year: target, round: pick.round, pick: pick.overall, teamId: pick.ownerTeamId, origin: prospect.origin || prospect.college || "Draft class" };
  rookie.teamHistory = [{ teamId: pick.ownerTeamId, fromSeason: target, toSeason: null, reason: `Drafted R${pick.round} Pick ${pick.overall}` }];
  return rookie;
}

function rookieScaleSalary(overall) {
  if (overall <= 5) return roundMoney(13 - (overall - 1) * 0.8);
  if (overall <= 14) return roundMoney(9.2 - (overall - 6) * 0.45);
  if (overall <= 30) return roundMoney(5.4 - (overall - 15) * 0.18);
  return roundMoney(Math.max(1.4, 2.8 - (overall - 31) * 0.05));
}

function prepareContractDecisions() {
  const state = save.offseason;
  if (state.contractDecisions.length) return;
  const target = state.targetSeason;
  save.players.forEach((player) => {
    const contract = player.contract;
    if (!contract || !player.teamId) return;
    const option = contract.option;
    if (option && option.season === target && !option.decided) {
      if (option.type === "PO") {
        const exercise = contract.salaries[target] >= playerMarketSalary(player) * 0.85;
        applyOptionDecision(player, exercise ? "exercise" : "decline", target);
      } else if (player.teamId === save.activeTeamId) {
        state.contractDecisions.push({ playerId: player.id, teamId: player.teamId, kind: "teamOption", label: "Team Option", amount: Number(contract.salaries[target] || 0), decision: null });
      } else {
        applyOptionDecision(player, player.ovr >= 70 ? "exercise" : "decline", target);
      }
    }
    if (contract.endSeason < target && player.age <= 25 && contract.freeAgentType === "RFA") {
      const amount = roundMoney(Math.max(2.4, playerMarketSalary(player) * 0.55));
      if (player.teamId === save.activeTeamId) state.contractDecisions.push({ playerId: player.id, teamId: player.teamId, kind: "qualifyingOffer", label: "Qualifying Offer", amount, decision: null });
      else contract.qualifyingOffer = player.ovr >= 68 ? amount : 0;
    }
  });
}

function decideContract(playerId, decision) {
  const state = save.offseason;
  const item = state?.contractDecisions.find((candidate) => candidate.playerId === playerId && !candidate.decision);
  const player = save.players.find((candidate) => candidate.id === playerId);
  if (!item || !player) return;
  item.decision = decision;
  if (item.kind === "teamOption") applyOptionDecision(player, decision, state.targetSeason);
  else if (decision === "qualify") {
    player.contract.qualifyingOffer = item.amount;
    player.contract.capHold = projectedCapHoldForSeason(player, state.targetSeason);
  } else {
    player.contract.qualifyingOffer = 0;
    player.contract.capHold = 0;
    player.contract.rightsRenounced = true;
  }
  addTransaction("Contract", `${teamName(save.activeTeamId)} ${decision === "exercise" ? "exercised" : decision === "qualify" ? "issued a qualifying offer to" : decision === "renounce" ? "renounced rights to" : "declined the option on"} ${player.name}.`);
  syncTeamPayrolls(save);
  persist();
  render();
}

function applyOptionDecision(player, decision, targetSeason) {
  const contract = player.contract;
  if (!contract?.option) return;
  const exercised = decision === "exercise";
  contract.option.decided = true;
  contract.option.exercised = exercised;
  if (!exercised) {
    delete contract.salaries[targetSeason];
    contract.endSeason = targetSeason - 1;
    contract.capHold = projectedCapHoldForSeason(player, targetSeason);
  }
}

function projectedCapHoldForSeason(player, targetSeason) {
  const previous = Number(player.contract?.salaries?.[targetSeason - 1] || playerMarketSalary(player));
  const multiplier = player.contract?.birdRights === "Bird" ? 1.5 : player.contract?.birdRights === "Early Bird" ? 1.3 : 1.2;
  return roundMoney(Math.max(2.4, previous * multiplier));
}

function prepareFreeAgency() {
  const state = save.offseason;
  if (state.freeAgentIds.length) return;
  const target = state.targetSeason;
  save.players.forEach((player) => {
    if (!player.contract || player.contract.endSeason >= target || !player.teamId) return;
    player.originalTeamId = player.teamId;
    player.contract.capHold = player.contract.rightsRenounced ? 0 : player.contract.capHold || projectedCapHoldForSeason(player, target);
    player.teamId = null;
    player.activeRoster = false;
    player.minutes = 0;
    player.starter = false;
    state.freeAgentIds.push(player.id);
  });
  generateAiOffers();
  syncTeamPayrolls(save);
}

function submitFreeAgentOffer(playerId, tier) {
  const state = save.offseason;
  const player = save.players.find((candidate) => candidate.id === playerId && !candidate.teamId);
  if (!state || !player) return;
  const market = playerMarketSalary(player);
  const salary = roundMoney(market * (tier === "premium" ? 1.15 : 1));
  const years = player.age >= 32 ? 2 : player.ovr >= 82 ? 4 : 3;
  const role = player.ovr >= 84 ? "Star" : player.ovr >= 77 ? "Starter" : "Rotation";
  if (!canTeamOfferFreeAgent(save.activeTeamId, salary)) {
    save.messages.push(`Offer blocked: ${teamName(save.activeTeamId)} lack cap space or a large enough exception for ${player.name}.`);
    render();
    return;
  }
  const existing = state.offers.find((offer) => offer.playerId === playerId && offer.teamId === save.activeTeamId);
  if (existing) Object.assign(existing, { salary, years, role });
  else state.offers.push({ playerId, teamId: save.activeTeamId, salary, years, role, day: state.freeAgencyDay });
  addTransaction("Rumor", `${teamName(save.activeTeamId)} offered ${player.name} ${years} years at $${salary.toFixed(1)}M.`);
  persist();
  render();
}

function generateAiOffers() {
  const state = save.offseason;
  const freeAgents = state.freeAgentIds.map((id) => save.players.find((player) => player.id === id)).filter((player) => player && !player.teamId);
  freeAgents.slice(0, 50).forEach((player) => {
    const candidates = save.teams.filter((team) => team.id !== save.activeTeamId && canTeamOfferFreeAgent(team.id, playerMarketSalary(player))).map((team) => ({ team, fit: aiFreeAgentFit(team.id, player) })).sort((a, b) => b.fit - a.fit).slice(0, player.ovr >= 80 ? 3 : 1);
    candidates.forEach(({ team }, index) => {
      if (state.offers.some((offer) => offer.playerId === player.id && offer.teamId === team.id)) return;
      const strategy = save.teamStrategies[team.id];
      const premium = index === 0 ? 1.08 : 0.98;
      const salary = roundMoney(playerMarketSalary(player) * premium);
      const years = strategy.timeline === "rebuilding" && player.age <= 27 ? 4 : player.age >= 32 ? 1 : 3;
      state.offers.push({ playerId: player.id, teamId: team.id, salary, years, role: player.ovr >= 82 ? "Star" : player.ovr >= 75 ? "Starter" : "Rotation", day: state.freeAgencyDay });
    });
  });
}

function canTeamOfferFreeAgent(teamId, salary) {
  const target = save.offseason.targetSeason;
  const team = getTeam(teamId);
  const room = offseasonCapSpace(teamId, target);
  const levels = cbaThresholds(target);
  const projected = projectedPayroll(teamId, target) + salary;
  if (room >= salary) return true;
  if (team.payroll >= levels.secondApron) return false;
  if (team.payroll >= levels.firstApron) return salary <= levels.taxpayerMle && projected <= levels.secondApron;
  return salary <= levels.mle && projected <= levels.firstApron;
}

function aiFreeAgentFit(teamId, player) {
  const team = getTeam(teamId);
  const strategy = save.teamStrategies[teamId] || { timeline: "balanced", need: "depth" };
  const ageFit = strategy.timeline === "rebuilding" ? Math.max(0, 31 - player.age) : player.ovr;
  const need = weakestPositionGroup(teamPlayers(teamId));
  const positionBonus = need.includes("guard") && player.pos.includes("G") || need.includes("wing") && player.pos.includes("F") || need.includes("big") && player.pos.includes("C") ? 12 : 0;
  return player.ovr * 2 + ageFit + positionBonus + team.wins * 0.25;
}

function resolveFreeAgency() {
  const state = save.offseason;
  if (!state) return;
  generateAiOffers();
  const playerIds = [...new Set(state.offers.map((offer) => offer.playerId))];
  playerIds.forEach((playerId) => {
    const player = save.players.find((candidate) => candidate.id === playerId);
    if (!player || player.teamId) return;
    const offers = state.offers.filter((offer) => offer.playerId === playerId);
    if (!offers.length) return;
    const winner = offers.map((offer) => ({ offer, score: freeAgentOfferScore(player, offer) })).sort((a, b) => b.score - a.score)[0].offer;
    const original = player.originalTeamId;
    const isRfa = player.contract.freeAgentType === "RFA" && player.contract.qualifyingOffer > 0 && original;
    if (isRfa && original === save.activeTeamId && winner.teamId !== original) {
      if (!state.pendingMatches.some((match) => match.playerId === playerId)) state.pendingMatches.push({ playerId, teamId: original, offer: winner });
      return;
    }
    if (isRfa && original !== save.activeTeamId && winner.teamId !== original && shouldAiMatchRfa(player, winner, original)) signFreeAgent(player, { ...winner, teamId: original }, "RFA match");
    else signFreeAgent(player, winner, "free agency");
  });
  state.freeAgencyDay += 1;
  state.offers = state.offers.filter((offer) => !save.players.find((player) => player.id === offer.playerId)?.teamId);
  syncTeamPayrolls(save);
  persist();
  render();
}

function freeAgentOfferScore(player, offer) {
  const team = getTeam(offer.teamId);
  const roleValue = offer.role === "Star" ? 9 : offer.role === "Starter" ? 5 : 1;
  const contender = team ? team.wins * (player.age >= 29 ? 0.35 : 0.12) : 0;
  const personalityValue = player.personality === "loyal" && offer.teamId === player.originalTeamId ? 16 : player.personality === "ambitious" ? contender * .55 : player.personality === "competitive" ? roleValue * .75 + contender * .35 : player.personality === "team-first" ? lockerRoom(offer.teamId).chemistry * .08 : 0;
  const roleMatch = roleRank(String(offer.role || "rotation").toLowerCase()) >= roleRank(player.preferredRole) ? 6 : -8;
  return offer.salary * offer.years + roleValue + contender + personalityValue + roleMatch;
}

function shouldAiMatchRfa(player, offer, teamId) {
  return player.potential >= 80 && offer.salary <= playerMarketSalary(player) * 1.2 && offseasonRosterStatus(teamId, save.offseason.targetSeason).standard < 15;
}

function decideRfaMatch(playerId, decision) {
  const state = save.offseason;
  const index = state.pendingMatches.findIndex((match) => match.playerId === playerId);
  if (index < 0) return;
  const match = state.pendingMatches[index];
  const player = save.players.find((candidate) => candidate.id === playerId);
  signFreeAgent(player, decision === "match" ? { ...match.offer, teamId: save.activeTeamId } : match.offer, decision === "match" ? "RFA match" : "offer sheet");
  state.pendingMatches.splice(index, 1);
  state.offers = state.offers.filter((offer) => offer.playerId !== playerId);
  persist();
  render();
}

function signFreeAgent(player, offer, source) {
  const target = save.offseason.targetSeason;
  const salaries = {};
  for (let offset = 0; offset < offer.years; offset += 1) salaries[target + offset] = roundMoney(offer.salary * Math.pow(1.05, offset));
  player.teamId = offer.teamId;
  recordPlayerTeamMove(player, offer.teamId, target, source);
  player.contract = { startSeason: target, endSeason: target + offer.years - 1, salaries, guaranteedThrough: target + offer.years - 1, option: offer.years >= 3 ? { type: player.age >= 29 ? "PO" : "TO", season: target + offer.years - 1, decided: false } : null, yearsWithTeam: 0, birdRights: "Non-Bird", freeAgentType: player.age <= 25 ? "RFA" : "UFA", salaryType: offer.salary >= 40 ? "Max" : offer.salary <= 3 ? "Minimum" : "Standard", signedDate: `${target}-07-06`, tradeEligibleDate: `${target}-12-15`, serviceYears: player.contract.serviceYears || Math.max(1, player.age - 19), noTradeClause: false, capHold: 0, rosterType: "standard", playoffEligible: true };
  player.activeRoster = false;
  player.promisedRole = String(offer.role || "rotation").toLowerCase() === "star" ? "franchise" : String(offer.role || "rotation").toLowerCase();
  player.morale = Math.max(72, player.morale || 72);
  player.moraleHistory = [{ season: target, date: `${target}-07-06`, change: 4, reason: `${player.promisedRole} role promised in free agency` }];
  save.offseason.freeAgentIds = save.offseason.freeAgentIds.filter((id) => id !== player.id);
  addTransaction("Signing", `${teamName(offer.teamId)} signed ${player.name} for ${offer.years} years, $${contractTotal(player, target).toFixed(1)}M (${source}).`);
}

function inSeasonMinimumSalary(player) {
  const serviceYears = Number(player.contract?.serviceYears || Math.max(0, player.age - 20));
  return roundMoney(serviceYears >= 10 ? 3.3 : serviceYears >= 7 ? 3 : serviceYears >= 4 ? 2.6 : 2.4);
}

function canTeamOfferInSeasonSalary(teamId, salary) {
  const team = getTeam(teamId);
  if (!team) return false;
  const levels = cbaThresholds(save.season);
  const payroll = Number(team.payroll || 0);
  const room = Math.max(0, levels.cap - payroll);
  if (salary <= inSeasonMinimumSalary({ age: 30, contract: { serviceYears: 10 } })) return true;
  if (room >= salary) return true;
  if (payroll >= levels.secondApron) return false;
  if (payroll >= levels.firstApron) return salary <= levels.taxpayerMle && payroll + salary <= levels.secondApron;
  return salary <= levels.mle && payroll + salary <= levels.firstApron;
}

function signInSeasonFreeAgent(playerId, contractType) {
  const player = save.players.find((candidate) => candidate.id === playerId && !candidate.teamId);
  if (!player || save.phase === "Offseason") return;
  if (player.originalTeamId === save.activeTeamId && player.waivedDate) {
    save.messages.push(`Signing blocked: ${teamName(save.activeTeamId)} cannot re-sign ${player.name} during the same league year after waiving him.`);
    render();
    return;
  }
  const status = rosterRuleStatus(save.activeTeamId);
  const maxRoster = save.leagueRules?.maxRoster || 15;
  if (status.standard >= maxRoster) {
    save.messages.push(`Signing blocked: ${teamName(save.activeTeamId)} must open a standard roster spot first.`);
    render();
    return;
  }
  const rules = transactionRuleState();
  if (contractType === "tenDay" && !rules.tenDayContracts) {
    save.messages.push("10-day contracts are only available during the league's 10-day contract window.");
    render();
    return;
  }
  const salary = contractType === "market" ? playerMarketSalary(player) : inSeasonMinimumSalary(player);
  if (contractType === "market" && !canTeamOfferInSeasonSalary(save.activeTeamId, salary)) {
    save.messages.push(`Offer blocked: ${teamName(save.activeTeamId)} does not have enough cap room or an available exception.`);
    render();
    return;
  }
  const signedDate = currentLeagueDate();
  const waiverDeadline = `${save.season + 1}-03-01`;
  const playoffEligible = !player.waivedDate || player.waivedDate <= waiverDeadline;
  const previousService = Number(player.contract?.serviceYears || Math.max(1, player.age - 19));
  player.teamId = save.activeTeamId;
  recordPlayerTeamMove(player, save.activeTeamId, save.season, contractType === "tenDay" ? "10-day contract" : "in-season free agency");
  player.contract = {
    startSeason: save.season,
    endSeason: save.season,
    salaries: { [save.season]: salary },
    guaranteedThrough: save.season,
    option: null,
    yearsWithTeam: 0,
    birdRights: "Non-Bird",
    freeAgentType: "UFA",
    salaryType: contractType === "market" ? "Standard" : "Minimum",
    signedDate,
    tradeEligibleDate: addDaysIso(signedDate, 90),
    serviceYears: previousService,
    noTradeClause: false,
    capHold: 0,
    rosterType: contractType === "tenDay" ? "tenDay" : "standard",
    contractExpiresDate: contractType === "tenDay" ? addDaysIso(signedDate, 10) : `${save.season + 1}-06-30`,
    playoffEligible
  };
  player.activeRoster = false;
  player.starter = false;
  player.minutes = 0;
  player.morale = Math.max(72, Number(player.morale || 72));
  addTransaction("Signing", `${teamName(save.activeTeamId)} signed ${player.name} to a ${contractType === "tenDay" ? "10-day" : contractType === "market" ? `$${salary.toFixed(1)}M rest-of-season` : "veteran-minimum"} contract.`);
  syncTeamPayrolls(save);
  persist();
  render();
}

function waiveInSeasonPlayer(playerId) {
  const player = save.players.find((candidate) => candidate.id === playerId && candidate.teamId === save.activeTeamId);
  if (!player) return;
  const team = activeTeam();
  const salary = contractSalaryForSeason(player, save.season);
  team.deadCapSalaries = team.deadCapSalaries || {};
  team.deadCapSalaries[save.season] = roundMoney(Number(team.deadCapSalaries[save.season] || 0) + salary);
  recordPlayerTeamMove(player, null, save.season, "Waived");
  player.originalTeamId = team.id;
  player.waivedDate = currentLeagueDate();
  player.teamId = null;
  player.activeRoster = false;
  player.starter = false;
  player.minutes = 0;
  player.contract.playoffEligible = player.waivedDate <= `${save.season + 1}-03-01`;
  addTransaction("Waiver", `${teamName(team.id)} waived ${player.name}; $${salary.toFixed(1)}M remains as dead cap.`);
  syncTeamPayrolls(save);
  persist();
  render();
}

function waiveRosterPlayer(playerId) {
  const player = save.players.find((candidate) => candidate.id === playerId && candidate.teamId === save.activeTeamId);
  if (!player) return;
  if (save.offseason) {
    waiveOffseasonPlayer(player);
    syncTeamPayrolls(save);
    persist();
    render();
    return;
  }
  waiveInSeasonPlayer(playerId);
}

function offseasonRosterStatus(teamId, targetSeason) {
  const players = teamPlayers(teamId).filter((player) => Number(player.contract?.salaries?.[targetSeason] || 0) > 0 || rosterType(player) === "twoWay");
  const standard = players.filter((player) => rosterType(player) === "standard" || rosterType(player) === "tenDay").length;
  const twoWay = players.filter((player) => rosterType(player) === "twoWay").length;
  const active = players.filter((player) => player.activeRoster).length;
  const messages = [
    { ok: standard >= 14 && standard <= (save.leagueRules?.maxRoster || 15), text: `Standard contracts: ${standard}/${save.leagueRules?.maxRoster || 15}; opening-night minimum is 14.` },
    { ok: twoWay <= (save.leagueRules?.twoWaySlots || 3), text: `Two-way contracts: ${twoWay}/${save.leagueRules?.twoWaySlots || 3}.` },
    { ok: standard + twoWay <= (save.leagueRules?.maxRoster || 15) + (save.leagueRules?.twoWaySlots || 3), text: `Total roster: ${standard + twoWay}/${(save.leagueRules?.maxRoster || 15) + (save.leagueRules?.twoWaySlots || 3)}.` },
    { ok: active >= 8 && active <= 13, text: `Active list: ${active}/13; must be 8-13.` },
    { ok: projectedPayroll(teamId, targetSeason) <= cbaThresholds(targetSeason).secondApron || standard <= 15, text: `Projected payroll: $${projectedPayroll(teamId, targetSeason).toFixed(1)}M.` }
  ];
  return { standard, twoWay, active, total: standard + twoWay, valid: messages.every((item) => item.ok), messages };
}

function projectedPayroll(teamId, season) {
  return roundMoney(teamPlayers(teamId).reduce((sum, player) => sum + Number(player.contract?.salaries?.[season] || 0), 0));
}

function leagueComplianceCount(season) {
  return save.teams.filter((team) => {
    const players = teamPlayers(team.id).filter((player) => Number(player.contract?.salaries?.[season] || 0) > 0 || rosterType(player) === "twoWay");
    const standard = players.filter((player) => rosterType(player) !== "twoWay").length;
    const twoWay = players.filter((player) => rosterType(player) === "twoWay").length;
    const active = players.filter((player) => player.activeRoster).length;
    return standard >= 14 && standard <= 15 && twoWay <= 3 && active >= 8 && active <= 13;
  }).length;
}

function offseasonCapSpace(teamId, season) {
  const holds = save.players.filter((player) => player.originalTeamId === teamId && !player.teamId && !player.contract?.rightsRenounced).reduce((sum, player) => sum + Number(player.contract?.capHold || 0), 0);
  return roundMoney(cbaThresholds(season).cap - projectedPayroll(teamId, season) - holds);
}

function autoCompleteRoster(teamId = save.activeTeamId) {
  const target = save.offseason.targetSeason;
  let roster = teamPlayers(teamId).filter((player) => Number(player.contract?.salaries?.[target] || 0) > 0 || rosterType(player) === "twoWay");
  while (roster.filter((player) => rosterType(player) === "standard").length > 15) {
    const waived = [...roster].filter((player) => rosterType(player) === "standard").sort((a, b) => a.ovr - b.ovr || contractSalaryForSeason(b, target) - contractSalaryForSeason(a, target))[0];
    waiveOffseasonPlayer(waived);
    roster = teamPlayers(teamId).filter((player) => Number(player.contract?.salaries?.[target] || 0) > 0 || rosterType(player) === "twoWay");
  }
  while (roster.filter((player) => rosterType(player) === "standard").length < 14) {
    const freeAgent = save.offseason.freeAgentIds.map((id) => save.players.find((player) => player.id === id)).filter(Boolean).sort((a, b) => b.ovr - a.ovr)[0];
    if (freeAgent) signFreeAgent(freeAgent, { teamId, salary: Math.max(2.4, Math.min(playerMarketSalary(freeAgent), 6)), years: 1, role: "Depth" }, "minimum market deal");
    else save.players.push(createReplacementPlayer(teamId, target, roster.length));
    roster = teamPlayers(teamId).filter((player) => Number(player.contract?.salaries?.[target] || 0) > 0 || rosterType(player) === "twoWay");
  }
  roster.sort((a, b) => b.ovr - a.ovr).forEach((player, index) => { player.activeRoster = index < 13; });
  setDefaultTeamRotation(teamId, true);
  syncTeamPayrolls(save);
  persist();
  render();
}

function waiveOffseasonPlayer(player) {
  if (!player) return;
  const oldTeam = player.teamId;
  recordPlayerTeamMove(player, null, save.offseason.targetSeason, "Waived");
  player.originalTeamId = oldTeam;
  player.teamId = null;
  player.activeRoster = false;
  player.minutes = 0;
  player.starter = false;
  player.contract.endSeason = save.offseason.targetSeason - 1;
  player.contract.salaries = Object.fromEntries(Object.entries(player.contract.salaries || {}).filter(([season]) => Number(season) < save.offseason.targetSeason));
  if (!save.offseason.freeAgentIds.includes(player.id)) save.offseason.freeAgentIds.push(player.id);
  addTransaction("Waiver", `${teamName(oldTeam)} waived ${player.name}.`);
}

function contractSalaryForSeason(player, season) {
  return Number(player.contract?.salaries?.[season] || 0);
}

function createReplacementPlayer(teamId, season, index) {
  const random = seededRandom(`replacement-${teamId}-${season}-${index}`);
  const created = player(`replacement-${teamId}-${season}-${index}`, `Replacement ${teamName(teamId)} ${index + 1}`, 24 + Math.floor(random() * 5), ["PG", "SG", "SF", "PF", "C"][index % 5], "", "Depth", teamId, 64 + Math.floor(random() * 5), 68 + Math.floor(random() * 5), 65, 65, 65, 65, 65, 78, 0);
  created.contract = { startSeason: season, endSeason: season, salaries: { [season]: 2.4 }, guaranteedThrough: season, option: null, yearsWithTeam: 0, birdRights: "Non-Bird", freeAgentType: "UFA", salaryType: "Minimum", signedDate: `${season}-09-20`, tradeEligibleDate: `${season}-12-15`, serviceYears: 2, noTradeClause: false, capHold: 0, rosterType: "standard", playoffEligible: true };
  created.activeRoster = false;
  created.draftInfo = { year: null, round: null, pick: null, teamId: null, origin: "Replacement market" };
  created.teamHistory = [{ teamId, fromSeason: season, toSeason: null, reason: "Replacement signing" }];
  return created;
}

function finalizeAiRosters() {
  save.teams.filter((team) => team.id !== save.activeTeamId).forEach((team) => autoCompleteRosterSilent(team.id));
  syncTeamPayrolls(save);
}

function autoCompleteRosterSilent(teamId) {
  const target = save.offseason.targetSeason;
  let roster = teamPlayers(teamId).filter((player) => Number(player.contract?.salaries?.[target] || 0) > 0 || rosterType(player) === "twoWay");
  while (roster.filter((player) => rosterType(player) === "standard").length > 15) {
    waiveOffseasonPlayer([...roster].filter((player) => rosterType(player) === "standard").sort((a, b) => a.ovr - b.ovr)[0]);
    roster = teamPlayers(teamId).filter((player) => Number(player.contract?.salaries?.[target] || 0) > 0 || rosterType(player) === "twoWay");
  }
  while (roster.filter((player) => rosterType(player) === "standard").length < 14) {
    const freeAgent = save.offseason.freeAgentIds.map((id) => save.players.find((player) => player.id === id)).filter(Boolean).sort((a, b) => aiFreeAgentFit(teamId, b) - aiFreeAgentFit(teamId, a))[0];
    if (freeAgent) signFreeAgent(freeAgent, { teamId, salary: Math.max(2.4, Math.min(playerMarketSalary(freeAgent), 8)), years: 1, role: "Depth" }, "AI roster completion");
    else save.players.push(createReplacementPlayer(teamId, target, roster.length));
    roster = teamPlayers(teamId).filter((player) => Number(player.contract?.salaries?.[target] || 0) > 0 || rosterType(player) === "twoWay");
  }
  roster.sort((a, b) => b.ovr - a.ovr).forEach((player, index) => { player.activeRoster = index < 13; });
  setDefaultTeamRotation(teamId, true);
}

function setCoachStyle(teamId, style) {
  const profile = coachingProfile(teamId);
  profile.style = style;
  if (style === "Development") { profile.development = Math.min(99, profile.development + 4); profile.tactics = Math.max(55, profile.tactics - 2); }
  if (style === "Defense") { profile.tactics = Math.min(99, profile.tactics + 3); getTeam(teamId).defense = "switch"; }
  if (style === "Pace") getTeam(teamId).pace = Math.min(72, getTeam(teamId).pace + 3);
  addTransaction("Staff", `${teamName(teamId)} committed to a ${style} coaching identity.`);
  persist();
  render();
}

function acceptJob(teamId) {
  if (!save.gmCareer.jobOffers.includes(teamId)) return;
  const previous = save.activeTeamId;
  save.activeTeamId = teamId;
  save.gmCareer.jobOffers = [];
  addTransaction("Front Office", `GM moved from ${teamName(previous)} to ${teamName(teamId)}.`);
  persist();
  render();
}

function finishOffseason() {
  const state = save.offseason;
  if (!state || !offseasonRosterStatus(save.activeTeamId, state.targetSeason).valid) return;
  const target = state.targetSeason;
  processPlayerLifecycle(target);
  processLeagueEvolution(target);
  save.teams.forEach((team) => autoCompleteRosterSilent(team.id));
  save.season = target;
  save.phase = "Regular Season";
  save.postseason = null;
  save.offseason = null;
  save.teams.forEach((team) => { team.wins = 0; team.losses = 0; });
  save.players.forEach((player) => {
    if (!player.teamId) return;
    player.contract.yearsWithTeam = Number(player.contract.yearsWithTeam || 0) + 1;
    player.contract.serviceYears = Number(player.contract.serviceYears || 0) + 1;
    player.contract.birdRights = player.contract.yearsWithTeam >= 3 ? "Bird" : player.contract.yearsWithTeam === 2 ? "Early Bird" : "Non-Bird";
    player.injury = Math.max(0, Number(player.injury || 0) - 8);
    player.fatigue = 0;
  });
  save.teams.forEach((team) => {
    scoutingDepartment(team.id).actions = 6;
    lockerRoom(team.id).continuity = Math.max(35, Math.min(95, lockerRoom(team.id).continuity - 4));
    const coach = coachingProfile(team.id);
    coach.tactics = Math.min(99, coach.tactics + (coach.contractYears > 1 ? 1 : 0));
    coach.contractYears = Math.max(0, Number(coach.contractYears || 1) - 1);
  });
  save.staffMarket = createStaffMarket(target);
  save.teams.forEach((team) => setDefaultTeamRotation(team.id, true));
  ensureDraftPickHorizon();
  save.schedule = createSeasonSchedule(save.activeTeamId, save.season);
  save.seasonEvents = createSeasonEvents(save.season);
  save.transactionEvents = createTransactionCalendar(save.season);
  save.timelineDate = `${save.season}-10-20`;
  save.results = [];
  save.leagueSchedule = createLeagueSchedule(save.activeTeamId, save.season, save.schedule);
  save.leagueResults = [];
  syncTeamPayrolls(save);
  addTransaction("League", `The ${save.season}-${String(save.season + 1).slice(-2)} NBA season opened.`);
  active = "dashboard";
  persist();
  render();
}

function createTeamStrategies() {
  return Object.fromEntries(nbaTeams.map(([id]) => [id, { timeline: "balanced", need: "depth", aggression: 50 }]));
}

function createCoachingProfiles() {
  return Object.fromEntries(nbaTeams.map(([id], index) => [id, { name: `${["Marcus", "Andre", "Calvin", "Darius", "Elliot"][index % 5]} ${["Stone", "Reed", "Brooks", "Hill", "Price", "Cole"][index % 6]}`, style: ["Balanced", "Development", "Defense", "Pace"][index % 4], tactics: 68 + index % 16, development: 66 + index * 3 % 18, medical: 65 + index * 5 % 20, adaptability: 62 + index * 7 % 28, contractYears: 2 + index % 4, salary: roundMoney(3.5 + index % 8 * .7) }]));
}

function createGamePlans() {
  return Object.fromEntries(nbaTeams.map(([id, , , , , , defense, matchup, pace]) => [id, {
    pace: pace >= 65 ? "fast" : pace <= 58 ? "slow" : "balanced",
    offense: matchup === "stars" ? "stars" : matchup === "perimeter" ? "perimeter" : matchup === "paint" ? "rim" : "balanced",
    defense,
    rebounding: "balanced",
    transition: pace >= 65 ? "run" : "balanced",
    load: "none",
    closing: "best overall",
    stagger: "balanced",
    minutesLimit: "none"
  }]));
}

function createLockerRooms() {
  return Object.fromEntries(nbaTeams.map(([id]) => [id, { chemistry: 72, continuity: 70, leaderId: null, lastUpdated: null, events: [] }]));
}

function createScoutingDepartments() {
  return Object.fromEntries(nbaTeams.map(([id], index) => [id, { college: 62 + index * 3 % 28, international: 60 + index * 5 % 30, medical: 64 + index * 7 % 25, analytics: 63 + index * 11 % 27, budget: roundMoney(5 + index % 6 * .8), actions: 6 }]));
}

function createStaffMarket(season) {
  return Array.from({ length: 12 }, (_, index) => ({ id: `staff-${season}-${index}`, name: `${["Jordan", "Casey", "Morgan", "Taylor", "Cameron", "Riley"][index % 6]} ${["Lewis", "Ward", "Young", "Grant", "Bennett", "Foster"][index % 6]}`, specialty: ["Tactics", "Development", "Medical", "Scouting"][index % 4], rating: 68 + index * 7 % 24, salary: roundMoney(1.8 + index * .35), available: true }));
}

function createLeagueRules(season) {
  return { baseSeason: season, capGrowth: 0.1, playoffTeams: 16, playIn: true, draftRounds: 2, maxRoster: 15, twoWaySlots: 3, expansionEnabled: false, relocationEnabled: true, ruleVoteSeason: season + 3 };
}

function createAutomationSettings() {
  return { scouting: false, rotations: false, minorSignings: false, qualifyingOffers: false, rosterCompliance: false, socialApproval: false, stopForInjury: true, stopForTradeOffer: true, stopForComplaint: true };
}

function createSocialState() {
  return {
    version: 2,
    accounts: [],
    posts: [],
    scheduledPosts: [],
    drafts: [],
    replies: [],
    interactions: { likedPostIds: [], repostedPostIds: [], bookmarkedPostIds: [] },
    metrics: { followers: 0, impressions: 0, engagements: 0, sentiment: 65, history: [], sentimentEventIds: [], drivers: [] },
    notifications: [],
    conversations: [],
    followingAccountIds: ["media-shams", "media-espn", "league-nba"],
    processedEventIds: [],
    nextPostId: 1,
    nextMessageId: 1
  };
}

function socialNotificationsTab() {
  const filtered = save.social.notifications.filter((item) => socialNotificationFilter === "all" || socialNotificationFilter === "verified" && item.verified || socialNotificationFilter === "mentions" && item.type === "mention");
  return `<section class="social-notifications-panel"><div class="social-notifications-header"><nav>${[["all","All"],["verified","Verified"],["mentions","Mentions"]].map(([id,label]) => `<button class="${socialNotificationFilter === id ? "active" : ""}" data-social-notification-filter="${id}">${label}</button>`).join("")}</nav><button data-social-notifications-read="true">Mark all read</button></div><div class="social-notification-list">${filtered.length ? filtered.map((item) => `<button class="social-notification-row ${item.read ? "" : "unread"}" data-social-notification="${escapeHtml(item.id)}" data-social-notification-post="${escapeHtml(item.postId || "")}"><i>${item.type === "mention" ? "@" : item.type === "reply" ? "↩" : item.type === "message" ? "✉" : "★"}</i><span><strong>${escapeHtml(item.source || "NBA Social")}</strong><p>${escapeHtml(item.text)}</p><small>${escapeHtml(item.createdAt || "Recently")}</small></span>${item.read ? "" : "<b></b>"}</button>`).join("") : '<div class="muted-line">No notifications in this category.</div>'}</div></section>`;
}

function socialAccountProfileModal() {
  if (!selectedSocialAccountId) return "";
  const account = socialAccount(selectedSocialAccountId);
  if (!account) { selectedSocialAccountId = null; return ""; }
  const followed = save.social.followingAccountIds.includes(account.id);
  const posts = save.social.posts.filter((post) => post.accountId === account.id).slice(-8).reverse();
  return `<div class="social-post-modal-backdrop" data-close-social-profile="true"><section class="social-account-profile" role="dialog" aria-label="${escapeHtml(account.name)} profile"><div class="social-dialog-header"><button data-close-social-profile="true">&#8592;</button><strong>Profile</strong></div><div class="social-account-banner"></div><section><div class="social-account-avatar">${escapeHtml(account.name.split(/\s+/).map((word)=>word[0]).join("").slice(0,2))}</div><button data-social-follow-account="${escapeHtml(account.id)}">${followed ? "Following" : "Follow"}</button><h2>${escapeHtml(account.name)} ${account.verified ? "✓" : ""}</h2><span>${escapeHtml(account.handle)}</span><p>${escapeHtml(account.style)} coverage · ${account.simulated ? "Fictional career simulation content" : "NBA Social"}</p><small>${Number(account.followers || 0).toLocaleString()} followers · ${account.reliability}% reliability</small></section><div class="social-account-posts">${posts.length ? posts.map((post,index)=>socialPost(post,index,activeTeam(),null)).join("") : '<div class="muted-line">No recent posts.</div>'}</div></section></div>`;
}

function socialCreatePostModal() {
  if (!socialCreatePostOpen) return "";
  const team=activeTeam(),players=teamPlayers(team.id).sort((a,b)=>b.ovr-a.ovr),games=(save.schedule||[]).filter((game)=>!game.played&&(game.home===team.id||game.away===team.id)).slice(0,12);
  const fieldStyle="color:#edf4ff!important;background:#263550!important;background-image:none!important;border:1px solid rgba(150,174,222,.25)!important";
  return `<div class="social-post-modal-backdrop" data-close-social-create="true"><section class="social-create-post" role="dialog" aria-label="Create post"><div class="social-dialog-header"><button data-close-social-create="true">&#10005;</button><strong>Create Post</strong></div><div class="social-create-body">${teamLogo(team,"social-create-avatar")}<div><textarea id="social-create-text" maxlength="280" placeholder="What do you want to share?" style="color:#edf4ff!important;background:#202c41!important;background-image:none!important;border:1px solid rgba(150,174,222,.24)!important"></textarea><div class="social-create-count"><span id="social-create-count">0</span>/280</div><div class="social-create-fields"><label><span>Category</span><select id="social-create-type" style="${fieldStyle}"><option value="team">Team update</option><option value="game">Game promotion</option><option value="player">Player spotlight</option><option value="transaction">Announcement</option><option value="community">Community</option></select></label><label><span>Tone</span><select id="social-create-tone" style="${fieldStyle}"><option value="professional">Professional</option><option value="energetic">Energetic</option><option value="supportive">Supportive</option><option value="confident">Confident</option></select></label><label><span>Player</span><select id="social-create-player" style="${fieldStyle}"><option value="">No player attached</option>${players.map((player)=>`<option value="${escapeHtml(player.id)}">${escapeHtml(player.name)}</option>`).join("")}</select></label><label><span>Game</span><select id="social-create-game" style="${fieldStyle}"><option value="">No game attached</option>${games.map((game)=>{const opponent=getTeam(game.home===team.id?game.away:game.home);return `<option value="${escapeHtml(game.id)}">${escapeHtml(game.date)} vs ${escapeHtml(opponent?.abbr||"TBD")}</option>`;}).join("")}</select></label><label class="wide"><span>GIF asset path or approved URL</span><input id="social-create-gif" placeholder="Optional" style="${fieldStyle}"></label><label><span>Publish</span><select id="social-create-mode" style="${fieldStyle}"><option value="now">Publish now</option><option value="schedule">Schedule</option></select></label><label id="social-create-date-label" hidden><span>Date</span><input id="social-create-date" type="date" min="${escapeHtml(currentLeagueDate())}" value="${escapeHtml(currentLeagueDate())}" style="${fieldStyle}"></label></div><section id="social-create-preview" class="social-create-preview"><small>Preview</small><p>Your post preview will appear here.</p></section></div></div><footer><button data-close-social-create="true">Cancel</button><button data-social-create-preview="true">Preview</button><button class="primary" data-social-create-submit="true">Publish</button></footer></section></div>`;
}

function socialPostConversationModal() {
  if (!selectedSocialPostId) return "";
  const post = socialVisiblePostCache.get(selectedSocialPostId) || save.social.posts.find((item) => item.id === selectedSocialPostId);
  if (!post) { selectedSocialPostId = null; return ""; }
  const replies = save.social.replies.filter((reply) => reply.postId === selectedSocialPostId);
  const relatedActions = `${post.playerId ? `<button data-view-player="${escapeHtml(post.playerId)}">View Player</button>` : ""}${post.gameId ? `<button data-social-open-game="${escapeHtml(post.gameId)}">View Game</button>` : ""}${post.transactionId ? `<button data-social-open-transaction="${escapeHtml(post.transactionId)}">View Transaction</button>` : ""}`;
  return `<div class="social-post-modal-backdrop" data-close-social-post="true"><section class="social-post-conversation" role="dialog" aria-label="Post conversation"><div class="social-dialog-header"><button data-close-social-post="true">&#8592;</button><strong>Post</strong></div><article><strong>${escapeHtml(post.source || post.authorName || "NBA Social")}</strong><small>${escapeHtml(post.handle || "")}</small><p>${escapeHtml(post.text || "")}</p>${relatedActions ? `<div class="social-post-related-actions">${relatedActions}</div>` : ""}</article><div class="social-reply-list">${replies.map((reply) => `<article><strong>${escapeHtml(reply.authorName || activeTeam().abbr)}</strong><small>${escapeHtml(reply.time || "now")}</small><p>${escapeHtml(reply.text)}</p></article>`).join("") || '<div class="muted-line">No replies yet.</div>'}</div><footer>${teamLogo(activeTeam(),"social-reply-avatar")}<input id="social-reply-input" maxlength="280" placeholder="Post your reply" style="color:#edf4ff!important;background:#202c41!important;background-image:none!important;border:1px solid rgba(150,174,222,.26)!important"><button data-social-submit-reply="${escapeHtml(selectedSocialPostId)}">Reply</button></footer></section></div>`;
}

function createSocialAccountEcosystem(teams = [], players = []) {
  const national = [
    ["media-shams","Shams Charania","@ShamsCharania","reporter",true,"breaking",98,9600000,["transactions","injuries","contracts"]],
    ["media-espn","ESPN","@espn","network",true,"broadcast",94,56000000,["games","highlights","debate"]],
    ["media-espn-nba","NBA on ESPN","@ESPNNBA","network",true,"analysis",93,8700000,["games","rankings","transactions"]],
    ["media-sportscenter","SportsCenter","@SportsCenter","network",true,"viral",91,43000000,["highlights","milestones","scores"]],
    ["media-espn-stats","ESPN Stats & Info","@ESPNStatsInfo","stats",true,"statistical",97,1900000,["records","milestones","history"]],
    ["league-nba","NBA","@NBA","league",true,"official",100,48000000,["games","players","league"]],
    ["league-comms","NBA Communications","@NBAPR","league",true,"formal",100,780000,["awards","rules","schedules"]],
    ["media-athletic","The Athletic NBA","@TheAthleticNBA","publication",true,"longform",92,1100000,["analysis","front-office","features"]],
    ["media-bleacher","Bleacher Report","@BleacherReport","publication",true,"viral",82,19000000,["highlights","reactions","culture"]],
    ["media-tnt","NBA on TNT","@NBAonTNT","network",true,"personality",89,5400000,["games","debate","playoffs"]]
  ].map(([id,name,handle,category,verified,style,reliability,followers,topics]) => ({ id,name,handle,category,verified,style,reliability,followers,topics,simulated:true }));
  const teamAccounts = teams.flatMap((team, index) => {
    const cityKey = team.city.replace(/\s+/g, "");
    const reporterFirst = ["Alex","Jordan","Taylor","Morgan","Casey","Riley"][index % 6];
    const reporterLast = ["Reed","Lewis","Grant","Bennett","Ward"][index % 5];
    return [
      { id:`team-${team.id}`,name:`${team.city} ${team.name}`,handle:`@${team.abbr}`,category:"team",verified:true,style:"official",reliability:100,followers:Math.round(650000 + teamRating(team) * 17000),topics:[team.id,"games","roster"],teamId:team.id,simulated:true },
      { id:`reporter-${team.id}`,name:`${reporterFirst} ${reporterLast}`,handle:`@${cityKey}Hoops`,category:"local-reporter",verified:true,style:"local-insider",reliability:84,followers:42000 + index * 3700,topics:[team.id,"transactions","injuries"],teamId:team.id,simulated:true },
      { id:`fans-${team.id}`,name:`${team.abbr} Fan Zone`,handle:`@${team.abbr}FanZone`,category:"fan",verified:false,style:"reactive",reliability:48,followers:18000 + index * 1900,topics:[team.id,"games","rumors"],teamId:team.id,simulated:true }
    ];
  });
  const playerAccounts = teams.flatMap((team) => players.filter((player) => player.teamId === team.id).sort((a,b) => b.ovr - a.ovr).slice(0,3).map((player) => ({
    id:`player-${player.id}`,name:player.name,handle:`@${player.name.replace(/[^a-z0-9]/gi,"").slice(0,18)}`,category:"player",verified:player.ovr >= 78,style:player.personality || "personal",reliability:88,followers:Math.round(40000 + Math.max(0,player.ovr - 65) ** 2 * 6400),topics:[team.id,player.id,"players"],teamId:team.id,playerId:player.id,simulated:true
  })));
  return [...national,...teamAccounts,...playerAccounts];
}

function syncSocialAccounts(state, teams, players) {
  const generated = createSocialAccountEcosystem(teams, players);
  const existing = new Map((state.accounts || []).map((account) => [account.id,account]));
  const next = generated.map((account) => ({ ...account, ...(existing.get(account.id) || {}), ...account }));
  const custom = (state.accounts || []).filter((account) => !generated.some((item) => item.id === account.id));
  const changed = JSON.stringify(state.accounts || []) !== JSON.stringify([...next,...custom]);
  state.accounts = [...next,...custom];
  state.followingAccountIds = [...new Set(state.followingAccountIds.filter((id) => state.accounts.some((account) => account.id === id)))];
  return changed;
}

function normalizeSocialState(candidate) {
  const fallback = createSocialState();
  const source = candidate && typeof candidate === "object" && !Array.isArray(candidate) ? candidate : {};
  const interactions = source.interactions && typeof source.interactions === "object" ? source.interactions : {};
  const metrics = source.metrics && typeof source.metrics === "object" ? source.metrics : {};
  const arrays = (value) => Array.isArray(value) ? value : [];
  return {
    ...fallback,
    ...source,
    version: 2,
    accounts: arrays(source.accounts),
    posts: arrays(source.posts),
    scheduledPosts: arrays(source.scheduledPosts),
    drafts: arrays(source.drafts),
    replies: arrays(source.replies),
    interactions: {
      likedPostIds: arrays(interactions.likedPostIds),
      repostedPostIds: arrays(interactions.repostedPostIds),
      bookmarkedPostIds: arrays(interactions.bookmarkedPostIds)
    },
    metrics: {
      followers: Math.max(0, Number(metrics.followers) || 0),
      impressions: Math.max(0, Number(metrics.impressions) || 0),
      engagements: Math.max(0, Number(metrics.engagements) || 0),
      sentiment: clampNumber(metrics.sentiment ?? 65, 0, 100),
      history: arrays(metrics.history),
      sentimentEventIds: arrays(metrics.sentimentEventIds),
      drivers: arrays(metrics.drivers)
    },
    notifications: arrays(source.notifications),
    conversations: arrays(source.conversations),
    followingAccountIds: Array.isArray(source.followingAccountIds) && source.followingAccountIds.length ? source.followingAccountIds : fallback.followingAccountIds,
    processedEventIds: arrays(source.processedEventIds),
    nextPostId: Math.max(1, Math.floor(Number(source.nextPostId) || 1)),
    nextMessageId: Math.max(1, Math.floor(Number(source.nextMessageId) || 1))
  };
}

function socialAccount(accountId) {
  return save.social?.accounts?.find((account) => account.id === accountId) || null;
}

function socialEventKey(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function addSocialEventPost(eventId, accountId, text, type = "news", importance = 1, related = {}) {
  if (!eventId || save.social.processedEventIds.includes(eventId)) return false;
  const account = socialAccount(accountId) || socialAccount("league-nba");
  if (!account) return false;
  const post = {
    id: `social-post-${save.social.nextPostId++}`,
    eventId,
    accountId: account.id,
    source: account.name,
    handle: account.handle,
    verified: account.verified,
    teamId: related.teamId || account.teamId || null,
    playerId: related.playerId || account.playerId || null,
    gameId: related.gameId || null,
    transactionId: related.transactionId || null,
    mentions: related.mentions || [],
    text,
    type,
    importance,
    createdAt: related.date || currentLeagueDate(),
    time: "Recently",
    engagementSeed: socialEventKey(`${eventId}-${accountId}`),
    storyId: related.storyId || eventId,
    sequenceIndex: Number(related.sequenceIndex || 0),
    replyToEventId: related.replyToEventId || null,
    simulated: true
  };
  save.social.posts.push(post);
  save.social.processedEventIds.push(eventId);
  save.social.notifications.unshift({ id:`social-notification-${eventId}`, type:"post", postId:post.id, text:`${account.name} posted about ${related.label || "a league event"}.`, read:false, createdAt:post.createdAt });
  return true;
}

function addSocialStorySequence(storyId, beats, related = {}) {
  let changed = false;
  beats.forEach((beat, index) => {
    changed = addSocialEventPost(`${storyId}-${beat.id || index}`, beat.accountId, beat.text, beat.type || related.type || "news", beat.importance || related.importance || 1, {
      ...related,
      ...(beat.related || {}),
      storyId,
      sequenceIndex:index,
      replyToEventId:index ? `${storyId}-${beats[index - 1].id || index - 1}` : null
    }) || changed;
  });
  return changed;
}

function socialTeamsInText(text) {
  const normalized = normalizeText(text);
  return save.teams.filter((team) => [team.city,team.name,`${team.city} ${team.name}`,team.abbr].some((term) => normalized.includes(normalizeText(term))));
}

function socialPlayerInText(text) {
  const normalized = normalizeText(text);
  return save.players.filter((player) => player.teamId && player.name.length >= 5 && normalized.includes(normalizeText(player.name))).sort((a,b) => b.name.length - a.name.length)[0] || null;
}

function processSocialStorySequences() {
  let changed = false;
  const userTeam = activeTeam();
  const results = [...(save.results || []), ...(save.leagueResults || [])].filter((result, index, list) => list.findIndex((item) => (item.gameId || item.id) === (result.gameId || result.id)) === index);
  results.filter((result) => result.home === userTeam.id || result.away === userTeam.id).forEach((result) => {
    const gameId=result.gameId||result.id||socialEventKey(JSON.stringify(result)), home=getTeam(result.home), away=getTeam(result.away);
    const homeScore=Number(result.homeScore??result.scoreHome??0),awayScore=Number(result.awayScore??result.scoreAway??0),margin=Math.abs(homeScore-awayScore);
    const winner=homeScore>=awayScore?home:away,loser=winner?.id===home?.id?away:home;
    const lines=[...(result.playerStats?.home||[]),...(result.playerStats?.away||[])];
    const standout=[...lines].sort((a,b)=>Number(b.pts||0)-Number(a.pts||0))[0];
    const player=save.players.find((item)=>item.id===standout?.playerId);
    const beats=[
      {id:"official",accountId:`team-${winner?.id}`,text:`FINAL: ${winner?.abbr} ${Math.max(homeScore,awayScore)}, ${loser?.abbr} ${Math.min(homeScore,awayScore)}.`,type:"game",importance:1},
      {id:"espn",accountId:"media-espn-nba",text:`${winner?.name} ${margin<=3?"held on in a thriller against":margin>=20?"made a statement against":"picked up a win over"} the ${loser?.name}.`,type:"analysis",importance:margin<=3||margin>=20?2:1}
    ];
    if (margin <= 3 || margin >= 20) beats.push({id:"local",accountId:`reporter-${userTeam.id}`,text:`The biggest story from ${userTeam.abbr}-${winner?.id===userTeam.id?"win":"loss"}: ${margin<=3?"late-game execution decided it.":"the margin reflected control from the opening minutes."}`,type:"reaction",importance:2});
    if (player && Number(standout.pts||0)>=30) beats.push({id:"player",accountId:`player-${player.id}`,text:`${winner?.id===player.teamId?"Great team win. On to the next one.":"We will learn from it and get back to work."}`,type:"player-reaction",importance:1,related:{playerId:player.id,teamId:player.teamId,mentions:[player.name]}});
    beats.push({id:"fans",accountId:`fans-${userTeam.id}`,text:`${winner?.id===userTeam.id?"That is the energy we needed.":"Tough one. The response in the next game matters."} #${userTeam.abbr}`,type:"fan-reaction",importance:1});
    changed=addSocialStorySequence(`story-game-${gameId}`,beats,{gameId,teamId:userTeam.id,date:result.date,label:"a game story"})||changed;
  });
  (save.transactionLog||[]).forEach((transaction,index)=>{
    const text=transaction.text||transaction.description||String(transaction);
    if (!/trade|signed|extension|draft|coach|waiv|released/i.test(text)) return;
    const key=transaction.id||socialEventKey(`${transaction.date||""}-${text}-${index}`),teams=socialTeamsInText(text),primaryTeam=teams[0]||userTeam,player=socialPlayerInText(text);
    const beats=[
      {id:"rumor",accountId:`reporter-${primaryTeam.id}`,text:`League sources have been monitoring a developing situation involving the ${primaryTeam.name}.`,type:"rumor",importance:1},
      {id:"breaking",accountId:"media-shams",text:`Sources: ${text}`,type:"breaking",importance:3},
      {id:"analysis",accountId:"media-espn-nba",text:`Breaking down the impact: ${text}`,type:"analysis",importance:2},
      {id:"official",accountId:`team-${primaryTeam.id}`,text, type:"official",importance:2}
    ];
    if(player&&socialAccount(`player-${player.id}`)) beats.push({id:"player",accountId:`player-${player.id}`,text:"Grateful for the opportunity. Ready for what comes next.",type:"player-reaction",importance:1,related:{playerId:player.id,teamId:player.teamId,mentions:[player.name]}});
    changed=addSocialStorySequence(`story-transaction-${key}`,beats,{transactionId:transaction.id||null,date:transaction.date,teamId:primaryTeam.id,label:"a transaction story"})||changed;
  });
  save.players.filter((player)=>player.injury>0).forEach((player)=>{
    const key=`${save.season}-${player.id}-${socialEventKey(player.injuryType||"injury")}`;
    const beats=[
      {id:"breaking",accountId:"media-shams",text:`${player.name} is expected to miss ${player.injury} game${player.injury===1?"":"s"} with ${player.injuryType||"an injury"}.`,type:"breaking",importance:player.ovr>=85?3:2},
      {id:"official",accountId:`team-${player.teamId}`,text:`Medical update: ${player.name} will be unavailable and evaluated as recovery progresses.`,type:"injury",importance:2},
      {id:"espn",accountId:"media-espn-nba",text:`What ${player.name}'s absence means for the ${teamName(player.teamId)} rotation.`,type:"analysis",importance:player.ovr>=85?3:1}
    ];
    changed=addSocialStorySequence(`story-injury-${key}`,beats,{playerId:player.id,teamId:player.teamId,label:"an injury story",mentions:[player.name]})||changed;
  });
  (save.leagueHistory||[]).forEach((season)=>{
    if(!season.championId)return;
    const champion=getTeam(season.championId),star=bestPlayer(season.championId);
    const beats=[
      {id:"final",accountId:"media-espn",text:`THE ${champion.name.toUpperCase()} ARE NBA CHAMPIONS.`,type:"championship",importance:5},
      {id:"official",accountId:`team-${champion.id}`,text:"WORLD CHAMPIONS.",type:"championship",importance:5},
      {id:"league",accountId:"league-nba",text:`Congratulations to the ${champion.city} ${champion.name}, NBA champions.`,type:"championship",importance:5},
      {id:"stats",accountId:"media-espn-stats",text:`The ${champion.name} completed their championship run and added another title to league history.`,type:"milestone",importance:4},
      {id:"player",accountId:`player-${star.id}`,text:"Champions forever. This is for everyone who believed in us.",type:"player-reaction",importance:4,related:{playerId:star.id}},
      {id:"fans",accountId:`fans-${champion.id}`,text:`WE DID IT. THE ${champion.name.toUpperCase()} ARE CHAMPIONS!`,type:"fan-reaction",importance:4}
    ];
    changed=addSocialStorySequence(`story-champion-${season.season}-${champion.id}`,beats,{teamId:champion.id,label:"the championship story"})||changed;
  });
  return changed;
}

function syncSocialNotifications() {
  let changed = false;
  const team = activeTeam(), players = teamPlayers(team.id), teamTerms = [team.city,team.name,team.abbr,`@${team.abbr}`,...players.map((player)=>player.name)].map((term)=>normalizeText(term));
  const existing = new Set(save.social.notifications.map((item)=>item.id));
  const add = (notification) => {
    if (existing.has(notification.id)) return;
    save.social.notifications.unshift({ read:false,createdAt:currentLeagueDate(),...notification });
    existing.add(notification.id); changed = true;
  };
  save.social.posts.forEach((post) => {
    const account = socialAccount(post.accountId), authoredByTeam = post.accountId === `team-${team.id}`;
    const searchable = normalizeText(`${post.text || ""} ${(post.mentions || []).join(" ")}`);
    const mentioned = !authoredByTeam && teamTerms.some((term)=>term && searchable.includes(term));
    if (mentioned) add({ id:`notification-mention-${post.id}`,type:"mention",postId:post.id,source:account?.name || post.source || "NBA Social",verified:Boolean(account?.verified),text:`${account?.name || post.source || "An account"} mentioned ${team.abbr} or one of your players.` });
    if (Number(post.importance || 0) >= 3 && !authoredByTeam) add({ id:`notification-major-${post.id}`,type:"coverage",postId:post.id,source:account?.name || post.source || "League coverage",verified:Boolean(account?.verified),text:post.text || "A major league story is developing." });
    if (save.social.followingAccountIds.includes(post.accountId) && !authoredByTeam) add({ id:`notification-following-${post.id}`,type:"following",postId:post.id,source:account?.name || post.source || "Followed account",verified:Boolean(account?.verified),text:`New post: ${post.text || "Open to view."}` });
  });
  save.social.replies.forEach((reply) => {
    const parent = save.social.posts.find((post)=>post.id===reply.postId);
    if (parent?.accountId === `team-${team.id}` && reply.teamId !== team.id) add({ id:`notification-reply-${reply.id}`,type:"reply",postId:reply.postId,source:reply.authorName || "NBA Social",verified:false,text:`${reply.authorName || "Someone"} replied to your post.` });
  });
  save.social.conversations.filter((conversation)=>conversation.read===false).forEach((conversation) => {
    const latest=(conversation.messages||[]).at(-1);
    add({ id:`notification-message-${conversation.id}-${latest?.id || "latest"}`,type:"message",conversationId:conversation.id,source:conversation.participantName || "Direct Message",verified:false,text:latest?.text || "You have a new direct message." });
  });
  if (save.social.notifications.length > 1000) save.social.notifications = save.social.notifications.slice(0,1000);
  return changed;
}

function processSocialSentiment() {
  let changed = false;
  const metrics = save.social.metrics, team = activeTeam();
  const apply = (eventId, delta, label, detail, date = currentLeagueDate()) => {
    if (!eventId || metrics.sentimentEventIds.includes(eventId)) return;
    const before = Number(metrics.sentiment || 65);
    metrics.sentiment = clampNumber(before + delta, 0, 100);
    metrics.sentimentEventIds.push(eventId);
    metrics.history.push({ id:eventId,date,label,detail,delta,value:metrics.sentiment });
    changed = true;
  };
  const results=[...(save.results||[]),...(save.leagueResults||[])].filter((result,index,list)=>list.findIndex((item)=>(item.gameId||item.id)===(result.gameId||result.id))===index);
  results.filter((result)=>result.home===team.id||result.away===team.id).forEach((result)=>{
    const id=result.gameId||result.id||socialEventKey(JSON.stringify(result)),homeScore=Number(result.homeScore??result.scoreHome??0),awayScore=Number(result.awayScore??result.scoreAway??0);
    const won=result.home===team.id?homeScore>awayScore:awayScore>homeScore,margin=Math.abs(homeScore-awayScore),playoff=/playoff|final/i.test(`${result.phase||""} ${save.phase||""}`);
    const delta=(won ? 2 : -2)+(margin >= 20 ? (won ? 1 : -1) : 0)+(margin <= 3 ? (won ? 0.5 : -0.5) : 0)+(playoff ? (won ? 2 : -2) : 0);
    apply(`sentiment-game-${id}`,delta,won?"Game victory":"Game loss",`${won?"Fans responded positively to":"Fan confidence fell after"} the ${margin}-point ${won?"win":"loss"}.`,result.date);
  });
  (save.transactionLog||[]).forEach((transaction,index)=>{
    const text=transaction.text||transaction.description||String(transaction),normalized=normalizeText(text);
    if (![team.city,team.name,team.abbr].some((term)=>normalized.includes(normalizeText(term)))) return;
    const key=transaction.id||socialEventKey(`${transaction.date||""}-${text}-${index}`);
    let delta=0,label="Roster transaction";
    if(/signed|extension|acquired|draft/i.test(text)){delta=1.5;label="Roster addition";}
    if(/waiv|released|traded/i.test(text)){delta=-.5;label="Roster change";}
    apply(`sentiment-transaction-${key}`,delta,label,text,transaction.date);
  });
  teamPlayers(team.id).forEach((player)=>{
    const injuryKey=`sentiment-injury-${save.season}-${player.id}-${socialEventKey(player.injuryType||"injury")}`;
    if(player.injury>0) apply(injuryKey,player.ovr>=88?-4:player.ovr>=80?-2.5:-1,`${player.name} injured`,`${player.name} is expected to miss ${player.injury} games.`);
    else if(metrics.sentimentEventIds.includes(injuryKey)) apply(`sentiment-return-${save.season}-${player.id}`,player.ovr>=88?3:1.5,`${player.name} returns`,"Fans welcomed the player's return to availability.");
    const concern=player.dissatisfaction;
    if(Number(concern?.level||0)>0) apply(`sentiment-complaint-${save.season}-${player.id}-${concern.level}`,-Math.min(3,Number(concern.level)),`${player.name} dissatisfaction`,concern.reason||"A locker-room concern became public.");
  });
  (save.leagueHistory||[]).forEach((season)=>{
    if(season.championId===team.id) apply(`sentiment-title-${season.season}`,12,"NBA championship","Winning the title created a major surge in fan confidence.");
    [["mvpId","MVP"],["dpoyId","Defensive Player of the Year"],["rookieId","Rookie of the Year"]].forEach(([field,label])=>{const player=save.players.find((item)=>item.id===season[field]);if(player?.teamId===team.id)apply(`sentiment-award-${season.season}-${field}`,4,`${label} winner`,`${player.name} won ${label}.`);});
  });
  metrics.history=metrics.history.slice(-120);
  metrics.sentimentEventIds=metrics.sentimentEventIds.slice(-4000);
  metrics.drivers=metrics.history.slice(-30).sort((a,b)=>Math.abs(Number(b.delta||0))-Math.abs(Number(a.delta||0))).slice(0,6);
  return changed;
}

function publishScheduledSocialPost(item, publishedAt = currentLeagueDate()) {
  if (!item || item.status === "published" || item.status === "cancelled") return false;
  const team=activeTeam(),account=socialAccount(`team-${team.id}`);
  save.social.posts.push({ id:`social-post-${save.social.nextPostId++}`,accountId:account?.id||`team-${team.id}`,source:account?.name||`${team.city} ${team.name}`,handle:account?.handle||`@${team.abbr}`,verified:true,teamId:team.id,playerId:item.playerId||null,gameId:item.gameId||null,text:item.text,type:item.type||"team",tone:item.tone||"professional",gifUrl:item.gifUrl||null,mentions:item.mentions||[],time:"Recently",createdAt:publishedAt,scheduledPostId:item.id,simulated:true });
  item.status="published"; item.publishedAt=publishedAt;
  save.social.notifications.unshift({ id:`notification-scheduled-${item.id}`,type:"published",source:`${team.city} ${team.name}`,text:`Scheduled post published: ${item.text}`,read:false,createdAt:publishedAt });
  return true;
}

function processScheduledSocialPosts() {
  let changed=false;
  (save.social.scheduledPosts||[]).filter((item)=>item.status!=="published"&&item.status!=="cancelled"&&item.publishAt&&item.publishAt<=currentLeagueDate()).forEach((item)=>{
    if(save.automation?.socialApproval){if(item.status!=="awaiting-approval"){item.status="awaiting-approval";changed=true;}return;}
    changed=publishScheduledSocialPost(item,item.publishAt)||changed;
  });
  return changed;
}

function processSocialCareerEvents() {
  let changed = false;
  const userTeam = activeTeam();
  const allResults = [...(save.results || []), ...(save.leagueResults || [])];
  const uniqueResults = allResults.filter((result, index, list) => list.findIndex((item) => (item.gameId || item.id) === (result.gameId || result.id)) === index);
  uniqueResults.filter((result) => result.home === userTeam.id || result.away === userTeam.id).forEach((result) => {
    const gameId = result.gameId || result.id || socialEventKey(JSON.stringify(result));
    const home = getTeam(result.home), away = getTeam(result.away);
    const homeScore = Number(result.homeScore ?? result.scoreHome ?? 0), awayScore = Number(result.awayScore ?? result.scoreAway ?? 0);
    const winner = homeScore >= awayScore ? home : away;
    const loser = winner?.id === home?.id ? away : home;
    const margin = Math.abs(homeScore - awayScore);
    const accountId = winner?.id === userTeam.id ? `team-${userTeam.id}` : "media-espn-nba";
    const text = `${winner?.city || "The winning team"} ${winner?.name || ""} ${margin >= 20 ? "rolled past" : margin <= 3 ? "survived" : "defeated"} the ${loser?.name || "opposition"}, ${Math.max(homeScore,awayScore)}-${Math.min(homeScore,awayScore)}.`;
    changed = addSocialEventPost(`game-${gameId}`, accountId, text, "game", margin >= 20 || margin <= 3 ? 2 : 1, { gameId, teamId:userTeam.id, date:result.date, label:"the latest game", mentions:[userTeam.abbr] }) || changed;
    const lines = [...(result.playerStats?.home || []), ...(result.playerStats?.away || [])];
    const standout = [...lines].sort((a,b) => Number(b.pts || 0) - Number(a.pts || 0))[0];
    if (standout && Number(standout.pts || 0) >= 40) {
      const player = save.players.find((item) => item.id === standout.playerId);
      changed = addSocialEventPost(`performance-${gameId}-${standout.playerId}`, "media-espn-stats", `${player?.name || standout.name || "A league star"} finished with ${standout.pts} points${standout.reb ? `, ${standout.reb} rebounds` : ""}${standout.ast ? ` and ${standout.ast} assists` : ""}.`, "milestone", Number(standout.pts) >= 50 ? 3 : 2, { gameId, playerId:standout.playerId, teamId:player?.teamId, date:result.date, label:"a standout performance", mentions:[player?.name].filter(Boolean) }) || changed;
    }
  });
  (save.transactionLog || []).forEach((transaction, index) => {
    const text = transaction.text || transaction.description || String(transaction);
    const eventId = `transaction-${transaction.id || socialEventKey(`${transaction.date || ""}-${text}-${index}`)}`;
    const major = /trade|extension|signed|draft|coach|waiv|released/i.test(text);
    changed = addSocialEventPost(eventId, major ? "media-shams" : "league-comms", text, "transaction", /trade|draft|coach/i.test(text) ? 3 : 2, { transactionId:transaction.id || null, date:transaction.date, label:"a transaction" }) || changed;
  });
  save.players.filter((player) => player.injury > 0).forEach((player) => {
    const eventId = `injury-${save.season}-${player.id}-${socialEventKey(player.injuryType || "injury")}`;
    changed = addSocialEventPost(eventId, "media-shams", `${player.name} is expected to miss approximately ${player.injury} game${player.injury === 1 ? "" : "s"} with ${player.injuryType || "an injury"}, sources say.`, "injury", player.ovr >= 85 ? 3 : 2, { playerId:player.id, teamId:player.teamId, label:"an injury update", mentions:[player.name,teamAbbr(player.teamId)] }) || changed;
  });
  save.players.filter((player) => player.injury <= 0).forEach((player) => {
    const injuryPrefix = `injury-${save.season}-${player.id}-`;
    if (!save.social.processedEventIds.some((id) => id.startsWith(injuryPrefix))) return;
    changed = addSocialEventPost(`return-${save.season}-${player.id}`, `team-${player.teamId}`, `${player.name} has been cleared to return to basketball activities.`, "injury-return", player.ovr >= 85 ? 2 : 1, { playerId:player.id, teamId:player.teamId, label:"a player return", mentions:[player.name] }) || changed;
  });
  (save.leagueHistory || []).forEach((season) => {
    if (season.championId) changed = addSocialEventPost(`champion-${season.season}-${season.championId}`, "league-nba", `The ${teamName(season.championId)} are the ${season.season} NBA champions.`, "championship", 5, { teamId:season.championId, label:"the NBA championship" }) || changed;
    [["mvpId","MVP"],["dpoyId","Defensive Player of the Year"],["rookieId","Rookie of the Year"],["sixthManId","Sixth Man of the Year"],["mipId","Most Improved Player"]].forEach(([field,label]) => {
      const playerId = season[field];
      const player = save.players.find((item) => item.id === playerId);
      if (player) changed = addSocialEventPost(`award-${season.season}-${field}-${playerId}`, "league-nba", `${player.name} has been named ${season.season} ${label}.`, "award", label === "MVP" ? 4 : 3, { playerId,teamId:player.teamId,label,mentions:[player.name] }) || changed;
    });
  });
  if (save.social.processedEventIds.length > 8000) save.social.processedEventIds = save.social.processedEventIds.slice(-8000);
  if (save.social.posts.length > 3000) save.social.posts = save.social.posts.slice(-3000);
  if (save.social.notifications.length > 1000) save.social.notifications = save.social.notifications.slice(0,1000);
  return changed;
}

function coachingProfile(teamId) {
  if (!save.coaching[teamId]) save.coaching[teamId] = createCoachingProfiles()[teamId];
  return save.coaching[teamId];
}

function ensureCareerSystems() {
  let changed = false;
  if (!save.offseasonVersion) { save.offseasonVersion = 1; changed = true; }
  if (!save.teamStrategies) { save.teamStrategies = createTeamStrategies(); changed = true; }
  if (!save.coaching) { save.coaching = createCoachingProfiles(); changed = true; }
  if (!Array.isArray(save.leagueHistory)) { save.leagueHistory = []; changed = true; }
  if (!Array.isArray(save.transactionLog)) { save.transactionLog = []; changed = true; }
  if (!Array.isArray(save.retiredPlayers)) { save.retiredPlayers = []; changed = true; }
  if (!save.gmCareer) { save.gmCareer = { approval: 60, seasons: 0, titles: 0, playoffTrips: 0, jobOffers: [] }; changed = true; }
  if (!save.gmCareer.finances) { save.gmCareer.finances = { attendance: 82, revenue: 310, staffBudget: 18, taxTolerance: "moderate" }; changed = true; }
  if (!Array.isArray(save.gmCareer.goals)) { save.gmCareer.goals = ["Reach the playoffs", "Maintain roster flexibility"]; changed = true; }
  if (!save.gameplayVersion) { save.gameplayVersion = 1; changed = true; }
  if (save.simulationVersion !== 2) { save.simulationVersion = 2; changed = true; }
  if (!save.gamePlans) { save.gamePlans = createGamePlans(); changed = true; }
  if (!save.gamePlanPresets) { save.gamePlanPresets = {}; changed = true; }
  if (!save.lockerRooms) { save.lockerRooms = createLockerRooms(); changed = true; }
  if (!save.scoutingDepartments) { save.scoutingDepartments = createScoutingDepartments(); changed = true; }
  if (!save.scoutingKnowledge) { save.scoutingKnowledge = {}; changed = true; }
  if (!Array.isArray(save.staffMarket)) { save.staffMarket = createStaffMarket(save.season); changed = true; }
  if (!save.aiTransactions) { save.aiTransactions = { lastProcessedDate: null, tradeBlock: [], rumors: [], userOffers: [] }; changed = true; }
  if (!Array.isArray(save.aiTransactions.userOffers)) { save.aiTransactions.userOffers = []; changed = true; }
  if (!save.leagueRules) { save.leagueRules = createLeagueRules(save.season); changed = true; }
  if (!Array.isArray(save.leagueEvolution)) { save.leagueEvolution = []; changed = true; }
  if (!Array.isArray(save.watchlist)) { save.watchlist = []; changed = true; }
  if (!Array.isArray(save.notifications)) { save.notifications = []; changed = true; }
  const normalizedSocial = normalizeSocialState(save.social);
  if (!save.social || JSON.stringify(save.social) !== JSON.stringify(normalizedSocial)) changed = true;
  save.social = normalizedSocial;
  if (syncSocialAccounts(save.social, save.teams, save.players)) changed = true;
  if (processSocialCareerEvents()) changed = true;
  if (processSocialStorySequences()) changed = true;
  if (syncSocialNotifications()) changed = true;
  if (processSocialSentiment()) changed = true;
  if (processScheduledSocialPosts()) changed = true;
  if (!save.automation) { save.automation = createAutomationSettings(); changed = true; }
  if (typeof save.automation.socialApproval !== "boolean") { save.automation.socialApproval = false; changed = true; }
  if (!save.saveDiagnostics) { save.saveDiagnostics = { version: 1, lastAutosave: null }; changed = true; }
  save.teams.forEach((team) => {
    if (!save.teamStrategies[team.id]) { save.teamStrategies[team.id] = { timeline: "balanced", need: "depth", aggression: 50 }; changed = true; }
    if (!save.coaching[team.id]) { save.coaching[team.id] = createCoachingProfiles()[team.id]; changed = true; }
    if (!save.gamePlans[team.id]) { save.gamePlans[team.id] = createGamePlans()[team.id]; changed = true; }
    if (!save.lockerRooms[team.id]) { save.lockerRooms[team.id] = { chemistry: 72, continuity: 70, leaderId: null, lastUpdated: null, events: [] }; changed = true; }
    if (!save.scoutingDepartments[team.id]) { save.scoutingDepartments[team.id] = createScoutingDepartments()[team.id]; changed = true; }
  });
  save.players.forEach((player) => {
    if (!player.careerStats || !Array.isArray(player.developmentHistory) || !Number.isFinite(player.fatigue)) changed = true;
    initializePlayerCareerFields(player);
  });
  updateLockerRooms();
  refreshAiMarketState();
  if (save.phase === "Offseason" && !save.offseason && save.postseason?.championId) {
    save.offseason = null;
  }
  refreshTeamStrategies();
  if (save.phase === "Regular Season" && repairAiRegularSeasonRosters()) changed = true;
  return changed;
}

function initializePlayerCareerFields(player) {
  player.ovr = clampNumber(player.ovr ?? player.overall, 25, 99);
  player.overall = player.ovr;
  player.careerStats = player.careerStats || { games: 0, points: 0, rebounds: 0, assists: 0 };
  player.seasonStats = player.seasonStats || {};
  player.postseasonStats = player.postseasonStats || {};
  player.developmentHistory = Array.isArray(player.developmentHistory) ? player.developmentHistory : [];
  player.fatigue = Number.isFinite(player.fatigue) ? player.fatigue : 0;
  const random = seededRandom(`personality-${player.id}`);
  player.personality = player.personality || ["professional", "ambitious", "loyal", "competitive", "team-first", "volatile", "mentor"][Math.floor(random() * 7)];
  player.leadership = player.leadership || (player.age >= 30 && player.ovr >= 76 ? "veteran leader" : player.ovr >= 88 ? "franchise voice" : "steady");
  player.preferredRole = player.preferredRole || inferPreferredRole(player);
  player.promisedRole = player.promisedRole || "none";
  player.moraleHistory = Array.isArray(player.moraleHistory) ? player.moraleHistory : [];
  player.dissatisfaction = player.dissatisfaction || { level: 0, reason: "Content", tradeRequest: false, refusesExtension: false };
  player.durability = Number.isFinite(player.durability) ? player.durability : 65 + Math.floor(random() * 31);
  player.injuryHistory = Array.isArray(player.injuryHistory) ? player.injuryHistory : [];
  player.trainingFocus = player.trainingFocus || "balanced";
  player.gLeague = Boolean(player.gLeague);
  player.scoutProfile = player.scoutProfile || { hiddenOverall: player.ovr, hiddenPotential: player.pot };
  player.draftInfo = player.draftInfo || { year: null, round: null, pick: null, teamId: null, origin: player.college || "Imported roster" };
  player.teamHistory = Array.isArray(player.teamHistory) ? player.teamHistory : (player.teamId ? [{ teamId: player.teamId, fromSeason: save?.season || 2026, toSeason: null, reason: "Initial roster" }] : []);
}

function recordPlayerTeamMove(player, teamId, season, reason) {
  if (!player) return;
  player.teamHistory = Array.isArray(player.teamHistory) ? player.teamHistory : [];
  const current = player.teamHistory.at(-1);
  if (current && current.teamId === teamId && !current.toSeason) return;
  if (current && !current.toSeason) current.toSeason = season;
  if (teamId) player.teamHistory.push({ teamId, fromSeason: season, toSeason: null, reason });
}

function gamePlan(teamId) {
  if (!save.gamePlans?.[teamId]) save.gamePlans[teamId] = createGamePlans()[teamId];
  return save.gamePlans[teamId];
}

function lockerRoom(teamId) {
  if (!save.lockerRooms?.[teamId]) save.lockerRooms[teamId] = { chemistry: 72, continuity: 70, leaderId: null, lastUpdated: null, events: [] };
  return save.lockerRooms[teamId];
}

function scoutingDepartment(teamId) {
  if (!save.scoutingDepartments?.[teamId]) save.scoutingDepartments[teamId] = createScoutingDepartments()[teamId];
  return save.scoutingDepartments[teamId];
}

function inferPreferredRole(player) {
  if (player.ovr >= 88) return "franchise";
  if (player.ovr >= 80) return "starter";
  if (player.ovr >= 76) return "sixth man";
  if (player.age <= 23 && player.pot - player.ovr >= 6) return "prospect";
  if (player.ovr >= 70) return "rotation";
  return "depth";
}

function actualPlayerRole(player) {
  if (player.ovr >= 88 && player.starter) return "franchise";
  if (player.starter) return "starter";
  if (player.minutes >= 24) return "sixth man";
  if (player.minutes >= 10) return "rotation";
  if (player.age <= 23) return "prospect";
  return "depth";
}

function roleRank(role) {
  return { none: 0, depth: 1, prospect: 1, rotation: 2, "sixth man": 3, starter: 4, franchise: 5 }[role] || 0;
}

function updateLockerRooms() {
  save.teams.forEach((team) => {
    const room = lockerRoom(team.id);
    const players = teamPlayers(team.id);
    if (!players.length) return;
    const leader = [...players].sort((a, b) => (b.age + b.ovr + (b.personality === "mentor" ? 12 : 0)) - (a.age + a.ovr + (a.personality === "mentor" ? 12 : 0)))[0];
    room.leaderId = leader?.id || null;
    const avgMorale = players.reduce((sum, player) => sum + Number(player.morale || 75), 0) / players.length;
    const complaints = players.reduce((sum, player) => sum + Number(player.dissatisfaction?.level || 0), 0);
    const winPct = team.wins + team.losses ? team.wins / (team.wins + team.losses) : .5;
    room.chemistry = Math.max(25, Math.min(99, Math.round(avgMorale * .55 + room.continuity * .25 + 10 + winPct * 10 - complaints * 1.5)));
    room.lastUpdated = currentLeagueDate();
  });
}

function updatePlayerMorale(teamId, won) {
  const room = lockerRoom(teamId);
  teamPlayers(teamId).forEach((player) => {
    const actual = actualPlayerRole(player);
    const expected = player.promisedRole !== "none" ? player.promisedRole : player.preferredRole;
    let change = won ? 1 : -1;
    const reasons = [won ? "team win" : "team loss"];
    if (roleRank(actual) < roleRank(expected)) { change -= player.personality === "team-first" ? 1 : 3; reasons.push("role below expectation"); }
    if (player.minutes >= 30) change += 1;
    if (player.injury > 0) change -= 1;
    applyMoraleChange(player, change, reasons.join(", "));
    evaluateDissatisfaction(player);
  });
  room.continuity = Math.min(99, room.continuity + .15);
  updateLockerRooms();
}

function applyMoraleChange(player, change, reason) {
  if (!change) return;
  player.morale = Math.max(0, Math.min(100, Number(player.morale || 75) + change));
  player.moraleHistory.push({ season: save.season, date: currentLeagueDate(), change, reason });
  if (player.moraleHistory.length > 20) player.moraleHistory = player.moraleHistory.slice(-20);
}

function evaluateDissatisfaction(player) {
  const prior = player.dissatisfaction.level || 0;
  let level = player.morale < 25 ? 4 : player.morale < 40 ? 3 : player.morale < 55 ? 2 : player.morale < 68 ? 1 : 0;
  if (player.personality === "loyal") level = Math.max(0, level - 1);
  player.dissatisfaction.level = level;
  player.dissatisfaction.reason = level ? `${player.preferredRole} expectations and morale ${player.morale}` : "Content";
  player.dissatisfaction.tradeRequest = level >= 3;
  player.dissatisfaction.refusesExtension = level >= 4;
  if (level > prior && player.teamId === save.activeTeamId) {
    addNotification("Locker Room", `${player.name} is now ${dissatisfactionLabel(level).toLowerCase()}.`, level >= 3 ? "urgent" : "normal");
    if (level >= 3) addTransaction("Rumor", `${player.name} is considering a trade request.`);
  }
}

function lockerConcernScore(player) { return Number(player.dissatisfaction?.level || 0) * 100 + (100 - Number(player.morale || 75)); }
function dissatisfactionLabel(level) { return ["Content", "Private Concern", "Public Complaint", "Trade Request", "Won't Re-sign"][level] || "Content"; }
function chemistryLabel(value) { return value >= 88 ? "Elite cohesion" : value >= 75 ? "Connected" : value >= 60 ? "Stable" : value >= 45 ? "Fractured" : "Toxic"; }

function gamePlanFit(teamId, plan = gamePlan(teamId)) {
  const players = teamPlayers(teamId).filter((player) => isPlayerGameEligible(player).ok && (player.minutes > 0 || player.activeRoster));
  if (!players.length) return 50;
  const average = (field) => players.reduce((sum, player) => sum + Number(player[field] || player.ovr), 0) / players.length;
  let fit = 68;
  if (plan.offense === "perimeter" || plan.offense === "ball movement") fit += (average(plan.offense === "perimeter" ? "three" : "pass") - 72) * .45;
  if (plan.offense === "rim") fit += (average("rim") - 72) * .45;
  if (plan.defense === "switch") fit += (average("def") - 72) * .3;
  if (plan.pace === "fast") fit += (average("stamina") - 72) * .25;
  return Math.max(40, Math.min(98, Math.round(fit)));
}

function tacticalAdvice(userTeamId, opponentId) {
  const opponent = gamePlan(opponentId);
  if (opponent.offense === "rim") return "Protect the paint with drop coverage and prioritize defensive rebounding.";
  if (opponent.offense === "perimeter") return "Switch more actions and avoid over-helping off shooters.";
  if (opponent.pace === "fast") return "Use balanced pace and protect transition after missed shots.";
  return "Stay balanced, keep one creator on the floor, and attack their weakest rotation group.";
}

function scoutingPlayerPool() {
  return save.players.filter((player) => player.teamId !== save.activeTeamId).sort((a, b) => b.ovr - a.ovr).slice(0, 120);
}

function scoutingReport(player) {
  const key = `${save.activeTeamId}:${player.id}`;
  const knowledge = save.scoutingKnowledge[key] || { level: player.teamId === save.activeTeamId ? 4 : 0 };
  const department = scoutingDepartment(save.activeTeamId);
  const skill = player.college ? department.college : department.analytics;
  const confidence = Math.min(99, 35 + knowledge.level * 16 + Math.round((skill - 60) * .45));
  const variance = Math.max(0, Math.round((100 - confidence) / 12));
  const random = seededRandom(`scout-${key}-${knowledge.level}`);
  const error = Math.round((random() - .5) * variance * 2);
  const actualOverall = player.scoutProfile?.hiddenOverall ?? player.trueOverall ?? player.ovr;
  const actualPotential = player.scoutProfile?.hiddenPotential ?? player.truePotential ?? player.pot;
  const estimate = actualOverall + error;
  const potential = actualPotential - Math.round(error / 2);
  const range = (value) => variance <= 1 ? `${Math.max(25, Math.min(99, value))}` : `${Math.max(25, value - variance)}-${Math.min(99, value + variance)}`;
  return { overall: range(estimate), potential: range(potential), confidence, summary: confidence >= 80 ? `Strong read: ${player.archetype || "two-way contributor"}.` : confidence >= 60 ? "Useful evaluation with remaining role uncertainty." : "Early look; ratings and medical projection remain volatile." };
}

function pendingFrontOfficeDecisions() {
  const decisions = [];
  if (!rotationStatus(save.activeTeamId).valid && save.phase === "Regular Season") decisions.push("Set a legal 240-minute rotation");
  teamPlayers(save.activeTeamId).filter((player) => player.dissatisfaction?.level >= 3).forEach((player) => decisions.push(`Resolve ${player.name}'s ${dissatisfactionLabel(player.dissatisfaction.level).toLowerCase()}`));
  if (save.phase === "Offseason" && save.offseason?.stage === "options" && save.offseason.contractDecisions?.some((item) => !item.decision)) decisions.push("Complete offseason contract decisions");
  if (save.aiTransactions?.userOffers?.length) decisions.push(`Respond to ${save.aiTransactions.userOffers.length} trade proposal${save.aiTransactions.userOffers.length === 1 ? "" : "s"}`);
  return decisions;
}

function addNotification(type, text, priority = "normal") {
  save.notifications.push({ id: `note-${Date.now()}-${save.notifications.length}`, date: currentLeagueDate(), type, text, priority, read: false });
  if (save.notifications.length > 200) save.notifications = save.notifications.slice(-200);
}

function captureGamePlanInputs() {
  const next = structuredClone(gamePlan(save.activeTeamId));
  document.querySelectorAll("[data-plan-field]").forEach((field) => { next[field.dataset.planField] = field.value; });
  return next;
}

function saveCurrentGamePlan() {
  save.gamePlans[save.activeTeamId] = captureGamePlanInputs();
  save.messages.push(`Game plan saved with ${gamePlanFit(save.activeTeamId)}% roster fit.`);
  addTransaction("Strategy", `${teamName(save.activeTeamId)} updated its tactical identity.`);
  persist();
  render();
}

function autoSetGamePlan() {
  const next = [...save.schedule].sort((a, b) => a.date.localeCompare(b.date)).find((game) => !game.played);
  if (!next) return;
  const opponentId = next.home === save.activeTeamId ? next.away : next.home;
  const opponent = gamePlan(opponentId);
  const plan = gamePlan(save.activeTeamId);
  plan.defense = opponent.offense === "rim" ? "drop" : opponent.offense === "perimeter" ? "switch" : "pressure";
  plan.rebounding = opponent.transition === "run" ? "protect transition" : "crash glass";
  plan.pace = opponent.pace === "fast" ? "slow" : "balanced";
  save.messages.push(`Coaching staff prepared an opponent-specific plan for ${teamName(opponentId)}.`);
  persist();
  render();
}

function saveGamePlanPreset() {
  const presets = save.gamePlanPresets[save.activeTeamId] || (save.gamePlanPresets[save.activeTeamId] = []);
  const plan = captureGamePlanInputs();
  presets.push({ name: `Preset ${presets.length + 1}`, plan });
  if (presets.length > 5) presets.shift();
  save.messages.push("Saved a reusable game-plan preset.");
  persist();
  render();
}

function holdPlayerMeeting(playerId) {
  const selected = save.players.find((player) => player.id === playerId && player.teamId === save.activeTeamId);
  if (!selected) return;
  const coach = coachingProfile(save.activeTeamId);
  const gain = Math.max(2, Math.round((coach.adaptability || 70) / 18) + (selected.personality === "volatile" ? -2 : 1));
  applyMoraleChange(selected, gain, "productive meeting with management");
  evaluateDissatisfaction(selected);
  addTransaction("Locker Room", `${selected.name} met with team management.`);
}

function scoutPlayer(playerId) {
  const player = save.players.find((candidate) => candidate.id === playerId) || save.offseason?.draftClass?.find((candidate) => candidate.id === playerId);
  if (!player) return;
  const department = scoutingDepartment(save.activeTeamId);
  if (department.actions <= 0) { save.messages.push("No scouting actions remain this season."); return; }
  const key = `${save.activeTeamId}:${player.id}`;
  const current = save.scoutingKnowledge[key] || { level: 0, reports: [] };
  current.level = Math.min(4, current.level + 1);
  current.reports = current.reports || [];
  current.reports.push({ date: currentLeagueDate(), type: current.level >= 3 ? "workout and interview" : "live evaluation" });
  save.scoutingKnowledge[key] = current;
  department.actions = Math.max(0, Number(department.actions || 0) - 1);
  save.messages.push(`Scouting report updated for ${player.name}.`);
}

function repairAiRegularSeasonRosters() {
  let changed = false;
  save.teams.filter((team) => team.id !== save.activeTeamId).forEach((team) => {
    let roster = teamPlayers(team.id).filter((player) => Number(player.contract?.salaries?.[save.season] || 0) > 0 || rosterType(player) === "twoWay");
    while (roster.filter((player) => rosterType(player) !== "twoWay").length > 15) {
      const removed = [...roster].filter((player) => rosterType(player) !== "twoWay").sort((a, b) => a.ovr - b.ovr)[0];
      removed.teamId = null;
      removed.activeRoster = false;
      changed = true;
      roster = teamPlayers(team.id).filter((player) => Number(player.contract?.salaries?.[save.season] || 0) > 0 || rosterType(player) === "twoWay");
    }
    while (roster.filter((player) => rosterType(player) !== "twoWay").length < 14) {
      save.players.push(createReplacementPlayer(team.id, save.season, roster.length + save.players.length));
      changed = true;
      roster = teamPlayers(team.id).filter((player) => Number(player.contract?.salaries?.[save.season] || 0) > 0 || rosterType(player) === "twoWay");
    }
    roster.sort((a, b) => b.ovr - a.ovr).forEach((player, index) => { player.activeRoster = index < 13; });
    setDefaultTeamRotation(team.id, true);
  });
  if (changed) syncTeamPayrolls(save);
  return changed;
}

function refreshTeamStrategies() {
  save.teams.forEach((team) => {
    const averageAge = teamPlayers(team.id).reduce((sum, player) => sum + player.age, 0) / Math.max(1, teamPlayers(team.id).length);
    const strategy = save.teamStrategies[team.id];
    strategy.timeline = team.wins >= 48 ? "contending" : team.wins <= 30 || averageAge < 25.5 ? "rebuilding" : "balanced";
    strategy.need = weakestPositionGroup(teamPlayers(team.id));
    strategy.aggression = strategy.timeline === "contending" ? 78 : strategy.timeline === "rebuilding" ? 42 : 58;
  });
}

function refreshAiMarketState() {
  if (!save.aiTransactions) save.aiTransactions = { lastProcessedDate: null, tradeBlock: [], rumors: [], userOffers: [] };
  const block = [];
  save.teams.filter((team) => team.id !== save.activeTeamId).forEach((team) => {
    const strategy = save.teamStrategies[team.id];
    const candidates = teamPlayers(team.id)
      .filter((player) => !player.contract?.noTradeClause && contractYearsRemaining(player) > 0)
      .sort((a, b) => tradeAssetValue(team.id, a) - tradeAssetValue(team.id, b));
    if (candidates[0] && (strategy.timeline === "rebuilding" || team.losses > team.wins + 5)) block.push(candidates[0].id);
  });
  save.aiTransactions.tradeBlock = block.slice(0, 18);
}

function tradeAssetValue(teamId, player) {
  const strategy = save.teamStrategies[teamId] || { timeline: "balanced" };
  const ageValue = strategy.timeline === "rebuilding" ? Math.max(-8, 28 - player.age) : Math.max(-5, 32 - player.age) * .35;
  const contractValue = playerMarketSalary(player) - contractSalary(player);
  const potentialValue = strategy.timeline === "rebuilding" ? (player.pot - player.ovr) * 1.5 : 0;
  const demandPenalty = player.dissatisfaction?.tradeRequest ? -7 : 0;
  return player.ovr * 2 + ageValue + contractValue + potentialValue + demandPenalty;
}

function processAiTransactionsForDate(date) {
  if (save.phase !== "Regular Season" || save.aiTransactions.lastProcessedDate === date) return;
  save.aiTransactions.lastProcessedDate = date;
  refreshTeamStrategies();
  refreshAiMarketState();
  const random = seededRandom(`market-${save.season}-${date}`);
  const day = Number(date.slice(-2));
  if (day % 7 === 0 || random() < .12) aiExtensionCycle(random);
  if (transactionRuleState().tradesOpen && (day % 9 === 0 || random() < .08)) {
    if (random() < .28) generateUserTradeOffer(random);
    else aiTradeCycle(random);
  }
  if (day % 11 === 0 || random() < .05) aiWaiverCycle(random);
}

function generateUserTradeOffer(random) {
  if (save.aiTransactions.userOffers.length >= 2) return;
  const userPlayers = teamPlayers(save.activeTeamId).filter((player) => isPlayerTradeEligible(player).ok && !player.contract?.noTradeClause).sort((a, b) => tradeAssetValue(save.activeTeamId, a) - tradeAssetValue(save.activeTeamId, b));
  const outgoing = userPlayers[Math.min(userPlayers.length - 1, Math.floor(random() * Math.min(6, userPlayers.length)))];
  if (!outgoing) return;
  const partners = save.teams.filter((team) => team.id !== save.activeTeamId).sort(() => random() - .5);
  for (const partner of partners) {
    const incoming = teamPlayers(partner.id).filter((player) => isPlayerTradeEligible(player).ok && Math.abs(contractSalary(player) - contractSalary(outgoing)) <= Math.max(6, contractSalary(outgoing) * .4)).sort((a, b) => Math.abs(tradeAssetValue(partner.id, a) - tradeAssetValue(save.activeTeamId, outgoing)) - Math.abs(tradeAssetValue(partner.id, b) - tradeAssetValue(save.activeTeamId, outgoing)))[0];
    if (!incoming) continue;
    const decision = validateTrade({ userTeamId: save.activeTeamId, partnerTeamId: partner.id, outgoingIds: [outgoing.id], incomingIds: [incoming.id], outgoingPickIds: [], incomingPickIds: [], consent: true });
    if (!decision.valid) continue;
    const offer = { id: `offer-${Date.now()}-${partner.id}`, partnerTeamId: partner.id, outgoingId: outgoing.id, incomingId: incoming.id, date: currentLeagueDate() };
    save.aiTransactions.userOffers.push(offer);
    addNotification("Trade Offer", `${teamName(partner.id)} offered ${incoming.name} for ${outgoing.name}.`, "urgent");
    save.aiTransactions.rumors.push(`${teamName(partner.id)} contacted ${teamName(save.activeTeamId)} about ${outgoing.name}.`);
    break;
  }
}

function decideAiTradeOffer(offerId, decision) {
  const offer = save.aiTransactions.userOffers.find((candidate) => candidate.id === offerId);
  if (!offer) return;
  if (decision === "accept") {
    const trade = validateTrade({ userTeamId: save.activeTeamId, partnerTeamId: offer.partnerTeamId, outgoingIds: [offer.outgoingId], incomingIds: [offer.incomingId], outgoingPickIds: [], incomingPickIds: [], consent: true });
    if (trade.valid) completeTrade(trade.transaction);
    else save.messages.push("The proposed trade is no longer legal and was withdrawn.");
  } else addTransaction("Rumor", `${teamName(save.activeTeamId)} declined a trade proposal from ${teamName(offer.partnerTeamId)}.`);
  save.aiTransactions.userOffers = save.aiTransactions.userOffers.filter((candidate) => candidate.id !== offerId);
  save.notifications.filter((item) => item.type === "Trade Offer").forEach((item) => { item.read = true; });
}

function aiExtensionCycle(random) {
  const candidates = save.players.filter((player) => player.teamId && player.teamId !== save.activeTeamId && canExtendContract(player) && !player.dissatisfaction?.refusesExtension);
  if (!candidates.length) return;
  const selected = candidates[Math.floor(random() * candidates.length)];
  const strategy = save.teamStrategies[selected.teamId];
  if (tradeAssetValue(selected.teamId, selected) < 145 && strategy.timeline !== "contending") return;
  const previousTeam = save.activeTeamId;
  save.activeTeamId = selected.teamId;
  extendPlayerContract(selected.id);
  save.activeTeamId = previousTeam;
  addTransaction("Extension", `${teamName(selected.teamId)} secured ${selected.name} before free agency.`);
}

function aiTradeCycle(random) {
  const teams = save.teams.filter((team) => team.id !== save.activeTeamId && teamPlayers(team.id).length >= 14);
  const seller = teams.filter((team) => save.teamStrategies[team.id].timeline === "rebuilding" || team.losses > team.wins + 7).sort(() => random() - .5)[0];
  const buyer = teams.filter((team) => team.id !== seller?.id && save.teamStrategies[team.id].timeline === "contending").sort(() => random() - .5)[0];
  if (!seller || !buyer) return;
  const target = teamPlayers(seller.id).filter((player) => isPlayerTradeEligible(player).ok && player.age >= 27).sort((a, b) => b.ovr - a.ovr)[0];
  if (!target) return;
  const returnPlayer = teamPlayers(buyer.id).filter((player) => isPlayerTradeEligible(player).ok && Math.abs(contractSalary(player) - contractSalary(target)) <= Math.max(5, contractSalary(target) * .35)).sort((a, b) => tradeAssetValue(buyer.id, a) - tradeAssetValue(buyer.id, b))[0];
  if (!returnPlayer) return;
  const decision = validateTrade({ userTeamId: seller.id, partnerTeamId: buyer.id, outgoingIds: [target.id], incomingIds: [returnPlayer.id], outgoingPickIds: [], incomingPickIds: [], consent: true });
  if (!decision.valid) return;
  completeTrade(decision.transaction);
  lockerRoom(seller.id).continuity = Math.max(30, lockerRoom(seller.id).continuity - 8);
  lockerRoom(buyer.id).continuity = Math.max(30, lockerRoom(buyer.id).continuity - 8);
  const rumor = `${teamName(buyer.id)} acquired ${target.name} from ${teamName(seller.id)} to support a ${save.teamStrategies[buyer.id].timeline} push.`;
  save.aiTransactions.rumors.push(rumor);
  addTransaction("Rumor", rumor);
}

function aiWaiverCycle(random) {
  const freeAgents = save.players.filter((player) => !player.teamId && contractYearsRemaining(player) <= 0).sort((a, b) => b.ovr - a.ovr);
  const needy = save.teams.filter((team) => team.id !== save.activeTeamId && teamPlayers(team.id).length < 15).sort(() => random() - .5)[0];
  if (!freeAgents[0] || !needy) return;
  const selected = freeAgents[0];
  const salary = Math.max(2.1, Math.min(5, playerMarketSalary(selected)));
  selected.teamId = needy.id;
  recordPlayerTeamMove(selected, needy.id, save.season, "Waiver signing");
  selected.originalTeamId = needy.id;
  selected.contract = { ...createPlayerContract(selected, save.season, save.players.length), salaries: { [save.season]: salary }, endSeason: save.season, guaranteedThrough: save.season, rosterType: "standard", salaryType: "Minimum" };
  selected.activeRoster = true;
  addTransaction("Signing", `${teamName(needy.id)} signed ${selected.name} from the waiver market.`);
  syncTeamPayrolls(save);
}

function recordSeasonHistory() {
  if (save.leagueHistory.some((entry) => entry.season === save.season)) return;
  const races = awardRaces();
  const championId = save.postseason?.championId || null;
  const mvp = races.mvp[0]?.player;
  const dpoy = races.dpoy[0]?.player;
  const rookie = races.rookie[0]?.player;
  const sixth = races.sixth[0]?.player;
  const mip = races.mip[0]?.player;
  const eligible = [...save.players].filter((player) => player.teamId);
  const allNba = races.allNba.slice(0, 15).map((item) => item.player.id);
  const allDefense = races.allDefense.slice(0, 10).map((item) => item.player.id);
  const allRookie = races.allRookie.slice(0, 5).map((item) => item.player.id);
  const standings = [...save.teams].sort((a, b) => b.wins - a.wins);
  const rosterSnapshots = Object.fromEntries(save.teams.map((team) => [team.id, teamPlayers(team.id).map((player) => ({ id: player.id, name: player.name, age: player.age, ovr: player.ovr, contract: contractSalary(player) }))]));
  save.leagueHistory.push({ season: save.season, championId, mvpId: mvp?.id || null, dpoyId: dpoy?.id || null, rookieId: rookie?.id || null, sixthManId: sixth?.id || null, mipId: mip?.id || null, bestRecordId: standings[0]?.id || null, allNba, allDefense, allRookie, standings: standings.map((team) => ({ teamId: team.id, wins: team.wins, losses: team.losses })), postseason: structuredClone(save.postseason), rosters: rosterSnapshots, leaders: eligible.sort((a, b) => b.careerStats.points - a.careerStats.points).slice(0, 10).map((player) => ({ id: player.id, name: player.name, stats: structuredClone(player.careerStats) })), transactions: save.transactionLog.filter((item) => item.season === save.season).slice(-80) });
  if (mvp) addTransaction("Awards", `${mvp.name} won MVP. ${dpoy?.name || "A league defender"} won Defensive Player of the Year. ${rookie?.name || "A rookie"} won Rookie of the Year.`);
}

function updateGmCareerAfterSeason() {
  const team = activeTeam();
  const madePlayoffs = save.postseason?.firstRound?.some((series) => series.highTeamId === team.id || series.lowTeamId === team.id);
  const title = save.postseason?.championId === team.id;
  save.gmCareer.seasons += 1;
  if (madePlayoffs) save.gmCareer.playoffTrips += 1;
  if (title) save.gmCareer.titles += 1;
  const delta = Math.round((team.wins - 41) * 0.45 + (madePlayoffs ? 6 : -6) + (title ? 22 : 0));
  save.gmCareer.approval = Math.max(5, Math.min(100, save.gmCareer.approval + delta));
  const candidates = [...save.teams].filter((candidate) => candidate.id !== team.id).sort((a, b) => a.wins - b.wins).slice(0, save.gmCareer.approval >= 75 ? 3 : save.gmCareer.approval <= 25 ? 2 : 0);
  save.gmCareer.jobOffers = candidates.map((candidate) => candidate.id);
  if (save.gmCareer.approval <= 15 && candidates.length) addTransaction("Front Office", `${teamName(team.id)} ownership is considering a GM change.`);
}

function processPlayerLifecycle(targetSeason) {
  const retired = [];
  save.players.forEach((player) => {
    initializePlayerCareerFields(player);
    const oldOvr = player.ovr;
    const coach = player.teamId ? coachingProfile(player.teamId) : { development: 65 };
    const mentor = player.teamId ? teamPlayers(player.teamId).find((candidate) => candidate.id !== player.id && candidate.age >= 30 && (candidate.personality === "mentor" || candidate.leadership === "veteran leader")) : null;
    const random = seededRandom(`development-${player.id}-${targetSeason}`);
    let change = 0;
    if (player.age <= 23) change = Math.round((player.pot - player.ovr) / 8 + (coach.development - 70) / 18 + (random() - 0.45) * 2);
    else if (player.age <= 28) change = Math.round((player.pot - player.ovr) / 14 + (random() - 0.55) * 2);
    else if (player.age >= 32) change = -Math.max(1, Math.round((player.age - 30) / 3 + random() * 1.5));
    change += Math.round(Number(player.boomBust || 0) / 8);
    if (player.gLeague && player.age <= 24) change += 1;
    if (mentor && player.age <= 25) change += 1;
    if (player.trainingFocus !== "balanced" && player.age <= 29) change += random() > .55 ? 1 : 0;
    if (player.injuryHistory.some((injury) => injury.season === targetSeason - 1 && injury.games >= 10)) change -= 1;
    player.ovr = Math.max(50, Math.min(player.pot, player.ovr + change));
    player.overall = player.ovr;
    if (player.trainingFocus === "shooting") player.three = Math.min(99, player.three + Math.max(0, change));
    if (player.trainingFocus === "playmaking") player.pass = Math.min(99, player.pass + Math.max(0, change));
    if (player.trainingFocus === "defense") player.def = Math.min(99, player.def + Math.max(0, change));
    if (player.trainingFocus === "conditioning") { player.stamina = Math.min(99, player.stamina + Math.max(0, change)); player.durability = Math.min(99, player.durability + 1); }
    player.age += 1;
    player.developmentHistory.push({ season: targetSeason, from: oldOvr, to: player.ovr, focus: player.trainingFocus, coach: coach.development, mentor: mentor?.name || null, injuries: player.injuryHistory.filter((injury) => injury.season === targetSeason - 1).length });
    const retireChance = player.age >= 39 ? 1 : player.age >= 36 ? 0.28 + (player.age - 36) * 0.18 : player.ovr < 58 && player.age >= 33 ? 0.22 : 0;
    if (random() < retireChance) retired.push(player);
  });
  retired.forEach((player) => {
    const hallScore = player.careerStats.games + player.careerStats.points / 18 + Math.max(0, player.ovr - 80) * 25;
    save.retiredPlayers.push({ id: player.id, name: player.name, age: player.age, careerStats: player.careerStats, retiredSeason: targetSeason, hallOfFame: hallScore >= 900, jerseyRetiredBy: hallScore >= 1250 ? player.teamId : null });
    save.players = save.players.filter((candidate) => candidate.id !== player.id);
    addTransaction("Retirement", `${player.name} retired from the NBA.`);
  });
}

function processLeagueEvolution(targetSeason) {
  if (targetSeason < save.leagueRules.ruleVoteSeason) return;
  const random = seededRandom(`league-vote-${targetSeason}`);
  const changes = [
    () => { save.leagueRules.capGrowth = Math.max(.05, Math.min(.1, save.leagueRules.capGrowth + (random() > .5 ? .01 : -.01))); return `Salary-cap growth adjusted to ${Math.round(save.leagueRules.capGrowth * 100)}%.`; },
    () => { save.leagueRules.twoWaySlots = save.leagueRules.twoWaySlots === 3 ? 4 : 3; return `Two-way roster limit changed to ${save.leagueRules.twoWaySlots}.`; },
    () => { save.leagueRules.expansionEnabled = true; return "The Board of Governors opened formal expansion review."; },
    () => { save.leagueRules.relocationEnabled = !save.leagueRules.relocationEnabled; return `Franchise relocation is now ${save.leagueRules.relocationEnabled ? "permitted" : "restricted"}.`; }
  ];
  const text = changes[Math.floor(random() * changes.length)]();
  save.leagueRules.ruleVoteSeason = targetSeason + 3;
  save.leagueEvolution.push({ season: targetSeason, type: "Rule Vote", text });
  addTransaction("League", text);
}

function addTransaction(type, textValue) {
  if (!Array.isArray(save.transactionLog)) save.transactionLog = [];
  save.transactionLog.push({ id: `txlog-${Date.now()}-${save.transactionLog.length}`, season: save.season, date: currentLeagueDate(), type, text: textValue });
  if (save.transactionLog.length > 250) save.transactionLog = save.transactionLog.slice(-250);
}

function advancePlayerHealth(teamIds, boxScore = null, allowRandomInjuries = true) {
  const minuteMap = new Map([...(boxScore?.away || []), ...(boxScore?.home || [])].map((line) => [line.playerId, Number(line.min || 0)]));
  save.players.filter((player) => teamIds.includes(player.teamId)).forEach((player) => {
    if (player.injury > 0) {
      player.injury = Math.max(0, player.injury - 1);
      if (!player.injury) { player.medicalStatus = "cleared"; player.injuryType = ""; }
      else player.medicalStatus = player.injury <= 2 ? "day-to-day" : "rehabilitation";
    }
    player.fatigue = Math.max(0, Number(player.fatigue || 0) - 2);
  });
  teamIds.forEach((teamId) => {
    const medical = coachingProfile(teamId).medical;
    rotationPlayers(teamId).filter((player) => player.minutes > 0 && isPlayerGameEligible(player).ok).forEach((player) => {
      initializePlayerCareerFields(player);
      const plan = gamePlan(teamId);
      const actualMinutes = minuteMap.has(player.id) ? minuteMap.get(player.id) : player.minutes;
      const managedMinutes = plan.minutesLimit === "none" ? actualMinutes : Math.min(actualMinutes, Number(plan.minutesLimit));
      const loadFactor = { none: 1, light: .92, moderate: .82, aggressive: .7 }[plan.load] || 1;
      player.fatigue = Math.min(100, Number(player.fatigue || 0) + managedMinutes * 0.45 * loadFactor);
      if (!allowRandomInjuries) return;
      const random = seededRandom(`injury-${save.season}-${player.id}-${player.careerStats.games}`);
      const recurrence = player.injuryHistory.slice(-3).reduce((sum, injury) => sum + (injury.season >= save.season - 1 ? .0015 : 0), 0);
      const loadModifier = { none: 0, light: -.001, moderate: -.002, aggressive: -.003 }[plan.load] || 0;
      const risk = Math.max(.001, 0.004 + player.fatigue / 5500 + Math.max(0, 75 - medical) / 5000 + Math.max(0, 75 - player.durability) / 8000 + recurrence + loadModifier);
      if (random() < risk) {
        const injuries = [{ type: "ankle sprain", min: 2, max: 8 }, { type: "hamstring strain", min: 4, max: 14 }, { type: "knee soreness", min: 2, max: 7 }, { type: "wrist sprain", min: 3, max: 10 }, { type: "back spasms", min: 2, max: 9 }];
        const injury = injuries[Math.floor(random() * injuries.length)];
        player.injury = injury.min + Math.floor(random() * (injury.max - injury.min + 1));
        player.injuryType = injury.type;
        player.medicalStatus = player.injury <= 2 ? "day-to-day" : "rehabilitation";
        player.injuryHistory.push({ season: save.season, date: currentLeagueDate(), type: injury.type, games: player.injury });
        addTransaction("Injury", `${player.name} suffered a ${injury.type} and will miss approximately ${player.injury} games.`);
        if (player.teamId === save.activeTeamId) addNotification("Medical", `${player.name}: ${injury.type}, approximately ${player.injury} games.`, "urgent");
      }
    });
  });
}

function applySimulationInjuries(result) {
  (result.injuries || []).forEach((injury) => {
    const player = save.players.find((candidate) => candidate.id === injury.playerId);
    if (!player) return;
    initializePlayerCareerFields(player);
    player.injury = Math.max(Number(player.injury || 0), Number(injury.games || 1));
    player.injuryType = injury.type;
    player.medicalStatus = player.injury <= 2 ? "day-to-day" : "rehabilitation";
    player.injuryHistory.push({ season: save.season, date: currentLeagueDate(), type: injury.type, games: player.injury });
    addTransaction("Injury", `${player.name} suffered a ${injury.type} and will miss approximately ${player.injury} games.`);
    if (player.teamId === save.activeTeamId) addNotification("Medical", `${player.name}: ${injury.type}, approximately ${player.injury} games.`, "urgent");
  });
}

function updatePlayerSeasonStats(result, postseason = false) {
  [...(result.playerStats?.away || []), ...(result.playerStats?.home || [])].forEach((line) => {
    const player = save.players.find((candidate) => candidate.id === line.playerId);
    if (!player) return;
    const collection = postseason ? "postseasonStats" : "seasonStats";
    player[collection] = player[collection] || {};
    const totals = player[collection][save.season] || (player[collection][save.season] = { games: 0, min: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fouls: 0, fgm: 0, fga: 0, threePm: 0, threePa: 0, ftm: 0, fta: 0 });
    totals.games += 1;
    totals.min += Number(line.min || 0);
    totals.points += Number(line.pts || 0);
    totals.rebounds += Number(line.reb || 0);
    totals.assists += Number(line.ast || 0);
    totals.steals += Number(line.stl || 0);
    totals.blocks += Number(line.blk || 0);
    totals.turnovers += Number(line.tov || 0);
    totals.fouls += Number(line.pf || 0);
    totals.fgm += Number(line.fgm || 0);
    totals.fga += Number(line.fga || 0);
    totals.threePm += Number(line.threePm || 0);
    totals.threePa += Number(line.threePa || 0);
    totals.ftm += Number(line.ftm || 0);
    totals.fta += Number(line.fta || 0);
  });
}

function updateCareerStats(result) {
  if (!result?.playerStats) return;
  [...(result.playerStats.away || []), ...(result.playerStats.home || [])].forEach((line) => {
    const player = save.players.find((candidate) => candidate.id === line.playerId);
    if (!player) return;
    initializePlayerCareerFields(player);
    player.careerStats.games += 1;
    player.careerStats.points += line.pts;
    player.careerStats.rebounds += line.reb;
    player.careerStats.assists += line.ast;
  });
}

function teamWinPct(team) {
  const games = team.wins + team.losses;
  return games ? team.wins / games : 0;
}

function formatGamesBehind(leader, team) {
  const value = ((leader.wins - team.wins) + (team.losses - leader.losses)) / 2;
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function teamLastTen(teamId) {
  const games = teamLeagueResults(teamId).slice(-10);
  const wins = games.filter((result) => teamWonResult(teamId, result)).length;
  return `${wins}-${games.length - wins}`;
}

function teamStreak(teamId) {
  const games = teamLeagueResults(teamId);
  if (!games.length) return "-";
  const wonLast = teamWonResult(teamId, games.at(-1));
  let count = 0;
  for (let index = games.length - 1; index >= 0; index -= 1) {
    if (teamWonResult(teamId, games[index]) !== wonLast) break;
    count += 1;
  }
  return `${wonLast ? "W" : "L"}${count}`;
}

function teamLeagueResults(teamId) {
  return [...(save.leagueResults || [])]
    .filter((result) => result.home === teamId || result.away === teamId)
    .sort((a, b) => a.date.localeCompare(b.date) || String(a.gameId).localeCompare(String(b.gameId)));
}

function teamWonResult(teamId, result) {
  return result.home === teamId ? result.homeScore > result.awayScore : result.awayScore > result.homeScore;
}

function statsPage() {
  const rows = Array.isArray(window.gameData?.playerStats) ? window.gameData.playerStats : [];
  const playerLines = leagueStatsPlayerLines(rows);
  const teamLines = leagueStatsTeamLines();
  const offLeader = [...teamLines].sort((a, b) => b.offRtg - a.offRtg)[0];
  const defLeader = [...teamLines].sort((a, b) => a.defRtg - b.defRtg)[0];
  const paceLeader = [...teamLines].sort((a, b) => b.pace - a.pace)[0];
  const netLeader = [...teamLines].sort((a, b) => b.netRtg - a.netRtg)[0];
  const scoringLeader = [...teamLines].sort((a, b) => b.ppg - a.ppg)[0];
  const playerLeaders = [...playerLines].sort((a, b) => b.ppg - a.ppg).slice(0, 10);
  const leagueAverage = (field) => teamLines.reduce((sum, line) => sum + line[field], 0) / Math.max(1, teamLines.length);

  return `
    <section class="league-stats-page">
      <header class="league-stats-header">
        <div>
          <h1 class="page-title">League Stats</h1>
          <p>Track team performance, player leaders, and league-wide trends.</p>
        </div>
        <div class="league-stats-actions">
          <button class="ghost-button">Export</button>
          <button class="ghost-button">Compare</button>
          <button class="icon-button" aria-label="League stats help">?</button>
          <button class="icon-button" aria-label="League stats settings">&#9881;</button>
        </div>
      </header>
      <section class="league-stats-top-grid">
        ${leagueStatsMetricCard("Offensive Rating Leader", offLeader, offLeader.offRtg.toFixed(1), `League Avg: ${leagueAverage("offRtg").toFixed(1)}`, "up", "off")}
        ${leagueStatsMetricCard("Defensive Rating Leader", defLeader, defLeader.defRtg.toFixed(1), `League Avg: ${leagueAverage("defRtg").toFixed(1)}`, "up", "def")}
        ${leagueStatsMetricCard("Pace (Poss/48)", paceLeader, paceLeader.pace.toFixed(1), `League Avg: ${leagueAverage("pace").toFixed(1)}`, "up", "pace")}
        ${leagueStatsMetricCard("Best Net Rating", netLeader, `${netLeader.netRtg >= 0 ? "+" : ""}${netLeader.netRtg.toFixed(1)}`, `League Avg: ${leagueAverage("netRtg").toFixed(1)}`, "up", "net")}
        ${leagueStatsMetricCard("Highest Points Per Game", scoringLeader, scoringLeader.ppg.toFixed(1), `League Avg: ${leagueAverage("ppg").toFixed(1)}`, "up", "ppg")}
        <article class="league-stat-card league-efficiency-card">
          <div>
            <span>League Efficiency Trend</span>
            <strong>+${Math.max(0.2, leagueAverage("netRtg") + 1.6).toFixed(1)}</strong>
            <small>Net rating</small>
          </div>
          <div class="league-mini-chart">${leagueStatsSparkline([42, 39, 44, 43, 47, 45, 49, 52, 50, 55])}</div>
        </article>
      </section>
      <nav class="league-stats-tabs">
        <button class="active">Overview</button>
        <button>Player Stats</button>
        <button>Team Stats</button>
        <button>Advanced</button>
        <button>Leaders</button>
        <button>Trends</button>
      </nav>
      <section class="league-stats-content">
        <main class="league-stats-main">
          <section class="league-stats-table-card">
            <header><h2>Player Leaders</h2><span>Top scorers</span></header>
            <div class="league-stats-table-wrap">
              <table>
                <thead><tr><th>Rank</th><th>Player</th><th>Team</th><th>PPG</th><th>RPG</th><th>APG</th><th>SPG</th><th>BPG</th><th>FG%</th><th>3PT%</th><th>PIE</th></tr></thead>
                <tbody>${playerLeaders.map((line, index) => leagueStatsPlayerRow(line, index)).join("")}</tbody>
              </table>
            </div>
            <button class="text-link">View full player statistics</button>
          </section>
          <section class="league-stats-table-card">
            <header><h2>Team Stats</h2><span>Efficiency ranking</span></header>
            <div class="league-stats-table-wrap">
              <table>
                <thead><tr><th>Rank</th><th>Team</th><th>Off Rtg</th><th>Def Rtg</th><th>Net Rtg</th><th>Pace</th><th>3PT%</th><th>Reb%</th><th>TOV%</th></tr></thead>
                <tbody>${teamLines.slice(0, 10).map((line, index) => leagueStatsTeamRow(line, index)).join("")}</tbody>
              </table>
            </div>
            <button class="text-link">View full team statistics</button>
          </section>
        </main>
        <aside class="league-stats-action-center">
          <header><h2>Stats Action Center</h2><b>6</b></header>
          ${leagueStatsActionCard("Scoring Race Tightening", "Top 5 scorers are within 7.4 PPG.", "Trending", "Compare Players", "View Leaderboard", "purple")}
          ${leagueStatsActionCard("Defense Trending Up", "League defensive rating improved over the last 10 games.", "Positive", "View Report", "Filter Stats", "green")}
          ${leagueStatsActionCard("New Career High", `${playerLeaders[0]?.player?.name || "A star"} posted a new season high.`, "Alert", "View Highlights", "Player Stats", "red")}
          ${leagueStatsActionCard("Team Comparison Ready", `${teamName(save.activeTeamId)} vs ${teamLines[0]?.team.abbr || "NBA"} comparison generated.`, "Ready", "Open Comparison", "Open Team Page", "blue")}
          ${leagueStatsActionCard("Award Watch Update", "MVP and ROY races updated with new odds.", "Update", "View Odds", "Award Tracker", "orange")}
          <button class="text-link">View all reports</button>
        </aside>
      </section>
      <section class="league-stats-bottom-grid">
        <section class="league-leaders-panel">
          <header><h2>League Leaders</h2></header>
          <div class="league-leader-grid">${leagueStatsLeaderTiles(playerLines)}</div>
          <button class="text-link">View more league leaders</button>
        </section>
        <section class="league-advanced-panel">
          <header><h2>Advanced Metrics</h2></header>
          ${leagueStatsAdvancedPanel(playerLeaders[0], playerLeaders[3] || playerLeaders[1])}
        </section>
        <section class="league-trend-panel">
          <header><h2>League Scoring Trend</h2></header>
          <div class="league-trend-chart">${leagueStatsSparkline([39, 45, 48, 47, 54, 56, 53, 50, 57, 55, 61, 58])}</div>
          <div><strong>${leagueAverage("ppg").toFixed(1)}</strong><span>PPG last 10</span><strong>${(leagueAverage("ppg") - 1.6).toFixed(1)}</strong><span>PPG season</span></div>
        </section>
      </section>
      <section class="league-stat-updates">
        <header><h2>Recent League Stat Updates</h2></header>
        <div>${leagueStatsUpdates(playerLeaders, teamLines)}</div>
      </section>
    </section>
  `;
}

function leagueStatsPlayerLines(importedRows = []) {
  const importedByName = new Map(importedRows.map((row) => [String(row.PLAYER_NAME || "").toLowerCase(), row]));
  return save.players
    .filter((player) => player.teamId && player.ovr >= 68)
    .map((player) => {
      const imported = importedByName.get(String(player.name).toLowerCase());
      const scoring = imported ? statNumber(imported.PTS) : 8 + (player.ovr - 70) * 0.78 + player.minutes * 0.18 + player.three * 0.035 + player.rim * 0.025;
      const rebounds = imported ? statNumber(imported.REB) : Math.max(2.1, (player.pos.includes("C") || player.pos.includes("PF") ? 5.1 : 2.7) + player.def * 0.035 + player.rim * 0.018);
      const assists = imported ? statNumber(imported.AST) : Math.max(1.2, (player.pos.includes("PG") ? 4.7 : player.pos.includes("SG") ? 2.6 : 1.8) + player.pass * 0.055);
      const steals = imported ? statNumber(imported.STL) : Math.max(0.3, 0.4 + player.def * 0.012);
      const blocks = imported ? statNumber(imported.BLK) : Math.max(0.2, (player.pos.includes("C") ? 0.75 : player.pos.includes("PF") ? 0.55 : 0.25) + player.def * 0.007);
      const fg = imported ? statNumber(imported.FG_PCT) * 100 : 41 + player.rim * 0.08 + player.mid * 0.035;
      const three = imported ? statNumber(imported.FG3_PCT) * 100 : 27 + player.three * 0.12;
      return {
        player,
        team: getTeam(player.teamId),
        ppg: Number(scoring.toFixed(1)),
        rpg: Number(rebounds.toFixed(1)),
        apg: Number(assists.toFixed(1)),
        spg: Number(steals.toFixed(1)),
        bpg: Number(blocks.toFixed(1)),
        fg: Number(Math.min(63, fg).toFixed(1)),
        three: Number(Math.min(49, three).toFixed(1)),
        pie: Number((12 + (player.ovr - 70) * 0.65 + player.minutes * 0.08).toFixed(1))
      };
    });
}

function leagueStatsTeamLines() {
  return save.teams.map((team) => {
    const rating = teamRating(team);
    const plan = gamePlan(team.id);
    const planPace = plan.pace === "fast" ? 70 : plan.pace === "slow" ? 42 : 55;
    const pace = Number((94.8 + (team.pace || 50) * 0.08 + (planPace - 50) * 0.04).toFixed(1));
    const offRtg = Number((102 + (rating - 70) * 0.82 + team.wins * 0.45).toFixed(1));
    const defRtg = Number((118 - (rating - 70) * 0.53 - team.wins * 0.32 + team.losses * 0.18).toFixed(1));
    const netRtg = Number((offRtg - defRtg).toFixed(1));
    const ppg = Number((pace * offRtg / 100).toFixed(1));
    return { team, offRtg, defRtg, netRtg, pace, ppg, three: Number((33 + rating * 0.065).toFixed(1)), reb: Number((46 + rating * 0.08).toFixed(1)), tov: Number((15.8 - rating * 0.04).toFixed(1)) };
  }).sort((a, b) => b.netRtg - a.netRtg);
}

function leagueStatsMetricCard(label, line, value, sub, trend, type) {
  return `<article class="league-stat-card ${type}">
    <div class="league-stat-identity">${type === "pace" ? '<span class="nba-chip">NBA</span>' : teamLogo(line.team, "league-stat-logo")}<b>${escapeHtml(line.team.abbr)}</b></div>
    <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(sub)}</small></div>
    <em class="${trend}">^ ${(Math.abs(line.netRtg) / 8 + 0.4).toFixed(1)}</em>
    <div class="league-mini-chart">${leagueStatsSparkline([33, 35, 34, 39, 37, 41, 40, 44, 43, 47])}</div>
  </article>`;
}

function leagueStatsSparkline(values) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return values.map((value) => `<i style="height:${22 + ((value - min) / Math.max(1, max - min)) * 34}px"></i>`).join("");
}

function leagueStatsPlayerRow(line, index) {
  return `<tr>
    <td>${index + 1}</td>
    <td><span class="league-player-cell">${playerHeadshot(line.player, "league-player-shot")}<b>${escapeHtml(line.player.name)}</b></span></td>
    <td>${teamLogo(line.team, "league-table-logo")}${escapeHtml(line.team.abbr)}</td>
    <td>${line.ppg.toFixed(1)}</td><td>${line.rpg.toFixed(1)}</td><td>${line.apg.toFixed(1)}</td><td>${line.spg.toFixed(1)}</td><td>${line.bpg.toFixed(1)}</td>
    <td>${line.fg.toFixed(1)}</td><td>${line.three.toFixed(1)}</td><td>${line.pie.toFixed(1)}</td>
  </tr>`;
}

function leagueStatsTeamRow(line, index) {
  return `<tr>
    <td>${index + 1}</td><td><span class="league-team-cell">${teamLogo(line.team, "league-table-logo")}<b>${escapeHtml(line.team.abbr)}</b></span></td>
    <td class="up">${line.offRtg.toFixed(1)}</td><td class="up">${line.defRtg.toFixed(1)}</td><td class="${line.netRtg >= 0 ? "up" : "down"}">${line.netRtg >= 0 ? "+" : ""}${line.netRtg.toFixed(1)}</td>
    <td>${line.pace.toFixed(1)}</td><td>${line.three.toFixed(1)}</td><td>${line.reb.toFixed(1)}</td><td>${line.tov.toFixed(1)}</td>
  </tr>`;
}

function leagueStatsActionCard(title, detail, badge, primary, secondary, tone) {
  return `<article class="league-action-card ${tone}">
    <div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div><span>${escapeHtml(badge)}</span>
    <footer><button>${escapeHtml(primary)}</button><button>${escapeHtml(secondary)}</button></footer>
  </article>`;
}

function leagueStatsLeaderTiles(lines) {
  const tiles = [
    ["Scoring (PPG)", [...lines].sort((a, b) => b.ppg - a.ppg)[0], "ppg"],
    ["Rebounds (RPG)", [...lines].sort((a, b) => b.rpg - a.rpg)[0], "rpg"],
    ["Assists (APG)", [...lines].sort((a, b) => b.apg - a.apg)[0], "apg"],
    ["Steals (SPG)", [...lines].sort((a, b) => b.spg - a.spg)[0], "spg"],
    ["Blocks (BPG)", [...lines].sort((a, b) => b.bpg - a.bpg)[0], "bpg"],
    ["3PT Made (GM)", [...lines].sort((a, b) => b.three - a.three)[0], "three"],
    ["True Shooting %", [...lines].sort((a, b) => b.fg - a.fg)[0], "fg"],
    ["Player Efficiency", [...lines].sort((a, b) => b.pie - a.pie)[0], "pie"]
  ];
  return tiles.map(([label, line, field]) => `<article><span>${escapeHtml(label)}</span>${playerHeadshot(line.player, "league-leader-shot")}<b>${escapeHtml(line.player.name)}</b><strong>${Number(line[field]).toFixed(1)}</strong></article>`).join("");
}

function leagueStatsAdvancedPanel(left, right) {
  if (!left || !right) return "";
  return `<div class="league-advanced-matchup">
    <div>${playerHeadshot(left.player, "league-advanced-shot")}<strong>${escapeHtml(left.player.name)}</strong><span>${escapeHtml(left.team.abbr)} - ${escapeHtml(left.player.pos)}</span></div>
    <b>vs</b>
    <div>${playerHeadshot(right.player, "league-advanced-shot")}<strong>${escapeHtml(right.player.name)}</strong><span>${escapeHtml(right.team.abbr)} - ${escapeHtml(right.player.pos)}</span></div>
  </div>
  <div class="league-radar">
    ${["Scoring", "Playmaking", "Rebounding", "Defense", "Athleticism", "Efficiency"].map((label, index) => `<span style="--i:${index}">${escapeHtml(label)}</span>`).join("")}
  </div>
  <button class="text-link">View advanced stats glossary</button>`;
}

function leagueStatsUpdates(players, teams) {
  const items = [
    [`${players[0]?.player.name || "League leader"} stays hot`, `${players[0]?.ppg.toFixed(1) || "0.0"} PPG over the last stretch.`],
    [`${teams[0]?.team.city || "Top team"} leads in net rating`, `${teams[0]?.team.abbr || "NBA"} sits at ${teams[0]?.netRtg >= 0 ? "+" : ""}${teams[0]?.netRtg.toFixed(1) || "0.0"}.`],
    [`${players[4]?.player.name || "Defender"} climbing`, "Strong two-way trend over the past week."],
    [`${teams[4]?.team.name || "Club"} offense rising`, `${teams[4]?.ppg.toFixed(1) || "0.0"} points per game pace.`]
  ];
  return items.map((item, index) => `<article>${teamLogo(teams[index % teams.length].team, "league-update-logo")}<div><strong>${escapeHtml(item[0])}</strong><span>${escapeHtml(item[1])}</span></div><small>${2 + index * 2}h ago</small></article>`).join("");
}

function statRow(row) {
  return `<tr>
    <td>${escapeHtml(row.PLAYER_NAME || "Unknown")}</td>
    <td>${escapeHtml(row.TEAM_ABBREVIATION || "-")}</td>
    <td>${statNumber(row.GP)}</td>
    <td>${statDecimal(row.MIN)}</td>
    <td>${statDecimal(row.PTS)}</td>
    <td>${statDecimal(row.REB)}</td>
    <td>${statDecimal(row.AST)}</td>
    <td>${statDecimal(row.STL)}</td>
    <td>${statDecimal(row.BLK)}</td>
    <td>${statPercent(row.FG_PCT)}</td>
    <td>${statPercent(row.FG3_PCT)}</td>
  </tr>`;
}

function statLeader(rows, field) {
  return [...rows].sort((a, b) => statNumber(b[field]) - statNumber(a[field]))[0] || {};
}

function leaderCard(label, row, field) {
  return `<section class="card stat-card">
    <div class="card-label">${label}</div>
    <div class="stat-value">${statDecimal(row[field])}</div>
    <div class="meta">${escapeHtml(row.PLAYER_NAME || "No data")}</div>
  </section>`;
}

function statNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function statDecimal(value) {
  return statNumber(value).toFixed(1);
}

function statPercent(value) {
  return `${(statNumber(value) * 100).toFixed(1)}%`;
}

function historyPage() {
  const history = [...(save.leagueHistory || [])].reverse();
  const champions = history.length ? history : leagueHistoryFallbackChampions();
  const champion = champions[0];
  const dynastyTeam = leagueHistoryDynastyTeam(champions);
  const titleLeaders = leagueHistoryTitleLeaders(champions);
  const allTimeLeaders = leagueHistoryAllTimeLeaders();
  const retired = [...(save.retiredPlayers || [])].reverse();
  return `<section class="league-history-dashboard">
    <header class="league-history-header">
      <div>
        <h1 class="page-title">League History</h1>
        <p>Review champions, award winners, dynasties, and the story of the league.</p>
      </div>
      <div class="league-history-actions">
        <button class="primary">History Tracker</button>
        <button>Compare Eras</button>
        <button>Record Book</button>
        <button class="icon-button">?</button>
        <button class="icon-button">S</button>
      </div>
    </header>
    <section class="league-history-top-grid">
      ${leagueHistoryTopCard("Defending Champion", champion?.championId, champion ? String(champion.season) : String(save.season), "NBA Champions", "Back-to-back")}
      ${leagueHistoryTopCard("Most Titles (Franchise)", titleLeaders[0]?.teamId, String(titleLeaders[0]?.titles || 17), "NBA Championships", "1960-2020")}
      ${leagueHistoryTopCard("Current Dynasty Watch", dynastyTeam?.teamId, `${dynastyTeam?.titles || 2} Titles`, "2023, 2024", "Contending")}
      ${leagueHistoryTopCard("All-Time Wins Leader", allTimeLeaders.wins.teamId, allTimeLeaders.wins.value.toLocaleString(), "Regular Season Wins", "Since 1974")}
      ${leagueHistoryRivalryCard(titleLeaders[1]?.teamId || "bos", titleLeaders[0]?.teamId || "lal")}
      ${leagueHistoryHallCard(retired)}
    </section>
    <nav class="league-history-tabs">
      <button class="active">Overview</button>
      <button>Champions</button>
      <button>Awards</button>
      <button>Dynasties</button>
      <button>Records</button>
      <button>Hall of Fame</button>
      <button>Draft History</button>
    </nav>
    <section class="league-history-main">
      <section class="history-champions-card">
        <header><h2>Champions Timeline</h2></header>
        <div class="history-table-wrap">
          <table>
            <thead><tr><th>Season</th><th>Champion</th><th>Finals MVP</th><th>Runner-Up</th><th>Record</th></tr></thead>
            <tbody>${champions.slice(0, 6).map((entry) => leagueHistoryChampionRow(entry)).join("")}</tbody>
          </table>
        </div>
        <button class="text-link">View full champions list</button>
      </section>
      ${leagueHistoryDynastyFeature(dynastyTeam, titleLeaders)}
      <aside class="history-action-center">
        <header><h2>History Action Center</h2></header>
        ${leagueHistoryAction("New Championship Added", `${champion?.championId ? teamName(champion.championId) : "A champion"} won the ${champion?.season || save.season} NBA Championship.`, "View Era")}
        ${leagueHistoryAction("Record Broken", `${allTimeLeaders.points.player.name} passes a career scoring milestone.`, "Open Record Book")}
        ${leagueHistoryAction("Hall of Fame Eligibility", `${retired[0]?.name || "Retired players"} now eligible for consideration.`, "See Ballot")}
        ${leagueHistoryAction("Award Legacy Update", `${playerDisplayName(champion?.mvpId)} joins the MVP archive.`, "View Awards")}
        ${leagueHistoryAction("Franchise Milestone", `${titleLeaders[0]?.teamName || "A franchise"} adds to its history.`, "View History")}
        <button class="text-link">View all history alerts</button>
      </aside>
    </section>
    <section class="league-history-lower-grid">
      <section class="history-leaders-card">
        <header><h2>All-Time Leaders</h2></header>
        <div>${leagueHistoryLeaderTiles(allTimeLeaders)}</div>
        <button class="text-link">View all-time leaders</button>
      </section>
      <section class="history-award-legacy">
        <header><h2>Award Legacy</h2></header>
        <div>${leagueHistoryAwardLegacy(history)}</div>
      </section>
      <section class="history-franchise-titles">
        <header><h2>Franchise Titles</h2></header>
        <div>${titleLeaders.slice(0, 5).map((item, index) => `<article><span>${index + 1}</span><b>${escapeHtml(item.teamName)}</b><i><em style="width:${Math.min(100, item.titles * 7)}%"></em></i><strong>${item.titles}</strong></article>`).join("")}</div>
        <button class="text-link">View full franchise history</button>
      </section>
      <section class="history-news-card">
        <header><h2>Recent History News</h2></header>
        <div>${leagueHistoryNews(champions, allTimeLeaders)}</div>
        <button class="text-link">View all news</button>
      </section>
    </section>
    <section class="history-timeline-strip">
      <header><h2>History Timeline</h2></header>
      <div>${leagueHistoryTimeline(champions, retired, allTimeLeaders)}</div>
      <button class="text-link">View full history timeline</button>
    </section>
  </section>`;
}

function leagueHistoryFallbackChampions() {
  const teams = [...save.teams].sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses)).slice(0, 6);
  return teams.map((team, index) => ({
    season: save.season - index,
    championId: team.id,
    mvpId: bestPlayer(team.id)?.id || null,
    bestRecordId: team.id,
    allNba: teamPlayers(team.id).slice(0, 2).map((player) => player.id),
    postseason: { runnerUpId: save.teams[(index + 7) % save.teams.length]?.id },
    standings: [{ teamId: team.id, wins: Math.max(48, team.wins + 48 - index), losses: 82 - Math.max(48, team.wins + 48 - index) }]
  }));
}

function leagueHistoryTitleLeaders(champions) {
  const counts = new Map();
  champions.forEach((entry) => counts.set(entry.championId, (counts.get(entry.championId) || 0) + 1));
  save.teams.forEach((team) => counts.set(team.id, (counts.get(team.id) || 0) + (["lal", "bos"].includes(team.id) ? 16 : ["gsw", "chi", "sas"].includes(team.id) ? 5 : team.id === save.activeTeamId ? save.gmCareer.titles : 0)));
  return [...counts.entries()]
    .map(([teamId, titles]) => ({ teamId, titles, teamName: teamNameFrom(save, teamId) }))
    .sort((a, b) => b.titles - a.titles);
}

function leagueHistoryDynastyTeam(champions) {
  return leagueHistoryTitleLeaders(champions)[0] || { teamId: save.activeTeamId, titles: save.gmCareer.titles || 1 };
}

function leagueHistoryAllTimeLeaders() {
  const players = [...save.players, ...(save.retiredPlayers || [])];
  const by = (field, fallback) => players
    .map((player) => ({ player, value: Number(player.careerStats?.[field] || fallback(player)) }))
    .sort((a, b) => b.value - a.value)[0];
  const winsTeam = [...save.teams].sort((a, b) => b.wins - a.wins)[0] || activeTeam();
  return {
    points: by("points", (player) => Math.round(player.ovr * 390 + player.age * 120)),
    rebounds: by("rebounds", (player) => Math.round((player.def + player.rim) * 110)),
    assists: by("assists", (player) => Math.round(player.pass * 170)),
    steals: by("steals", (player) => Math.round(player.def * 38)),
    blocks: by("blocks", (player) => Math.round((player.pos.includes("C") ? player.def * 48 : player.def * 24))),
    wins: { teamId: winsTeam.id, value: 3600 + winsTeam.wins * 68 }
  };
}

function leagueHistoryTopCard(label, teamId, value, sub, foot) {
  const team = getTeam(teamId) || activeTeam();
  return `<article class="history-top-card">
    <span>${escapeHtml(label)}</span>
    <div>${teamLogo(team, "history-top-logo")}<strong>${escapeHtml(value)}</strong><b>${escapeHtml(team.city)} ${escapeHtml(team.name)}</b><small>${escapeHtml(sub)}</small></div>
    <div class="history-spark">${leagueStatsSparkline([31, 34, 32, 38, 35, 41, 44, 42, 43, 48])}</div>
    <em>${escapeHtml(foot)}</em>
  </article>`;
}

function leagueHistoryRivalryCard(leftId, rightId) {
  const left = getTeam(leftId) || activeTeam();
  const right = getTeam(rightId) || save.teams.find((team) => team.id !== left.id) || activeTeam();
  return `<article class="history-top-card rivalry"><span>Historic Rivalry</span><div>${teamLogo(left, "history-top-logo")}<b>vs</b>${teamLogo(right, "history-top-logo")}<strong>${left.abbr} vs ${right.abbr}</strong><small>Most played rivalry</small></div><div class="history-spark">${leagueStatsSparkline([35, 32, 39, 43, 38, 45, 44, 41, 39, 37])}</div></article>`;
}

function leagueHistoryHallCard(retired) {
  return `<article class="history-top-card hof"><span>Hall Of Fame Class</span><div><span class="history-hof-medal">HOF</span><strong>${save.season} Class</strong><b>${Math.max(3, retired.filter((player) => player.hallOfFame).length || 12)}</b><small>New inductees</small></div><div class="history-spark">${leagueStatsSparkline([32, 35, 36, 33, 37, 39, 41, 38, 36, 34])}</div><em>View class</em></article>`;
}

function leagueHistoryChampionRow(entry) {
  const champion = getTeam(entry.championId) || activeTeam();
  const runner = getTeam(entry.postseason?.runnerUpId) || getTeam(entry.bestRecordId) || save.teams.find((team) => team.id !== champion.id) || activeTeam();
  const record = entry.standings?.find((line) => line.teamId === champion.id);
  return `<tr><td>${entry.season}</td><td>${teamLogo(champion, "history-table-logo")}<b>${escapeHtml(champion.name)}</b></td><td>${escapeHtml(playerDisplayName(entry.mvpId))}</td><td>${teamLogo(runner, "history-table-logo")}${escapeHtml(runner.abbr)}</td><td>${record ? `${record.wins}-${record.losses}` : "16-6"}</td></tr>`;
}

function leagueHistoryDynastyFeature(dynasty, titleLeaders) {
  const team = getTeam(dynasty?.teamId) || activeTeam();
  const stars = teamPlayers(team.id).sort((a, b) => b.ovr - a.ovr).slice(0, 4);
  const coach = save.coaching?.[team.id];
  return `<section class="history-dynasty-feature">
    <div class="history-dynasty-art">${teamLogo(team, "history-dynasty-bg")}<img class="history-dynasty-trophy" src="assets/nba-trophy.png" alt="">${playerHeadshot(stars[0], "history-dynasty-player")}</div>
    <div class="history-dynasty-copy">
      <span>Dynasty Feature</span><h2>${escapeHtml(team.city)} ${escapeHtml(team.name)} Dynasty</h2><p>${save.season - 4} - ${save.season} The Modern Era Dynasty</p>
      <div class="history-dynasty-stats"><article><strong>${dynasty?.titles || 3}</strong><small>NBA Titles</small></article><article><strong>${Math.max(55, team.wins + 44)}-${Math.max(12, team.losses)}</strong><small>Best Season</small></article><article><strong>${Math.round(teamRating(team))}-${Math.max(0, team.losses)}</strong><small>Regular Season</small></article></div>
      <div class="history-key-people"><div><b>Key Players</b>${stars.map((player) => `<span>${playerHeadshot(player, "history-mini-shot")}${escapeHtml(player.name)}</span>`).join("")}</div><div><b>Head Coach</b><span>${escapeHtml(coach?.name || `${team.city} Coach`)}</span></div></div>
      <h3>Why It Matters</h3><p>${escapeHtml(team.name)} built a title window around elite talent, smart roster depth, and a repeatable identity.</p>
      <button class="text-link">View Dynasty Profile</button>
    </div>
  </section>`;
}

function leagueHistoryAction(title, detail, action) {
  return `<article class="history-action-card"><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div><button>${escapeHtml(action)}</button></article>`;
}

function leagueHistoryLeaderTiles(leaders) {
  const items = [
    ["Points", leaders.points, "points"],
    ["Rebounds", leaders.rebounds, "rebounds"],
    ["Assists", leaders.assists, "assists"],
    ["Steals", leaders.steals, "steals"],
    ["Blocks", leaders.blocks, "blocks"],
    ["Championships", { player: save.retiredPlayers?.find((player) => player.hallOfFame) || leaders.points.player, value: Math.max(6, save.gmCareer.titles + 6) }, "rings"]
  ];
  return items.map(([label, item]) => `<article>${playerHeadshot(item.player, "history-leader-shot")}<span>${escapeHtml(label)}</span><b>${escapeHtml(item.player.name)}</b><strong>${Math.round(item.value).toLocaleString()}</strong></article>`).join("");
}

function leagueHistoryAwardLegacy(history) {
  const mvpCounts = new Map();
  history.forEach((entry) => entry.mvpId && mvpCounts.set(entry.mvpId, (mvpCounts.get(entry.mvpId) || 0) + 1));
  if (!mvpCounts.size) awardRaces().mvp.slice(0, 5).forEach((item, index) => mvpCounts.set(item.player.id, Math.max(1, 5 - index)));
  const leaders = [...mvpCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return `<div class="history-award-columns"><article><h3>All-Time MVP Leaders</h3>${leaders.map(([playerId, count], index) => `<div><span>${index + 1}</span><b>${escapeHtml(playerDisplayName(playerId))}</b><strong>${count}</strong></div>`).join("")}</article><article><h3>Multi-Award Legends</h3>${leaders.map(([playerId, count]) => `<div><b>${escapeHtml(playerDisplayName(playerId))}</b><span>${count + 5} Awards</span></div>`).join("")}</article></div>`;
}

function leagueHistoryNews(champions, leaders) {
  const top = champions[0];
  const items = [
    [`${teamName(top?.championId)} Capture Title`, `${teamName(top?.championId)} finished the season as champions.`],
    [`${playerDisplayName(top?.mvpId)} Finals MVP`, "Star performance defines another postseason run."],
    [`${leaders.points.player.name} Career Milestone`, "Historic scorer adds to the record book."]
  ];
  return items.map(([title, detail], index) => `<article>${teamLogo(champions[index % champions.length]?.championId || save.activeTeamId, "history-news-logo")}<div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span></div><small>${index + 1}d ago</small></article>`).join("");
}

function leagueHistoryTimeline(champions, retired, leaders) {
  const items = [
    ["Title Win", `${teamName(champions[0]?.championId)} NBA Champions`, String(champions[0]?.season || save.season), champions[0]?.championId],
    ["Jersey Retired", `${retired[0]?.name || leaders.points.player.name} honored`, String(retired[0]?.retiredSeason || save.season), retired[0]?.teamId || leaders.points.player.teamId],
    ["Hall Of Fame Induction", `${retired.find((player) => player.hallOfFame)?.name || leaders.rebounds.player.name}`, `Class of ${save.season}`, retired.find((player) => player.hallOfFame)?.teamId || leaders.rebounds.player.teamId],
    ["Record Broken", `${leaders.points.player.name} scoring mark`, "Career points", leaders.points.player.teamId],
    ["Milestone Win", `${teamName(champions[1]?.championId || save.activeTeamId)} franchise mark`, "3,000 all-time wins", champions[1]?.championId || save.activeTeamId]
  ];
  return items.map(([label, title, detail, teamId]) => `<article>${teamLogo(teamId, "history-timeline-logo")}<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div></article>`).join("");
}

function awardsPage() {
  const races = awardRaces();
  const history = [...(save.leagueHistory || [])].reverse();
  const mvpRace = races.mvp.slice(0, 10);
  const feature = mvpRace[0];
  const featureStats = feature ? awardPlayerLine(feature) : null;
  return `<section class="awards-dashboard">
    <header class="awards-header">
      <div>
        <h1 class="page-title">Awards</h1>
        <p>Track award races, season honors, and league recognition.</p>
      </div>
      <div class="awards-actions">
        <button class="primary">Awards Tracker</button>
        <button>Compare</button>
        <button>Media Votes</button>
        <button>History</button>
        <button class="icon-button" aria-label="Awards settings">&#9881;</button>
      </div>
    </header>
    <section class="awards-top-grid">
      ${awardTopCard("MVP Race", races.mvp, "mvp")}
      ${awardTopCard("Rookie of the Year", races.rookie, "rookie")}
      ${awardTopCard("Defensive Player of the Year", races.dpoy, "dpoy")}
      ${awardTopCard("Sixth Man of the Year", races.sixth, "sixth")}
      ${awardTopCard("Most Improved Player", races.mip, "mip")}
      ${awardTopCard("Coach of the Year", awardCoachRace(), "coach")}
    </section>
    <nav class="awards-tabs">
      <button class="active">Overview</button>
      <button>Major Awards</button>
      <button>All-NBA</button>
      <button>All-Defense</button>
      <button>Rookie Teams</button>
      <button>Team Awards</button>
      <button>History</button>
    </nav>
    <section class="awards-main-layout">
      <section class="awards-race-table">
        <header><h2>Award Races</h2><span>MVP leaders</span></header>
        <div class="awards-table-wrap">
          <table>
            <thead><tr><th>Rank</th><th>Player</th><th>Team</th><th>Award Score</th><th>Prev Rk</th><th>Trend</th><th>Status</th></tr></thead>
            <tbody>${mvpRace.map((item, index) => awardRaceRow(item, index)).join("")}</tbody>
          </table>
        </div>
        <button class="text-link">View full MVP race</button>
      </section>
      ${feature ? awardFeaturePanel(feature, featureStats, races) : ""}
      <aside class="awards-action-center">
        <header><h2>Awards Action Center</h2></header>
        ${awardActionCard("MVP Race Tightening", "Top 3 separated by just 1.1 points.", "View Race", "Compare Players", "purple")}
        ${awardActionCard("Rookie Stock Rising", `${races.rookie[0]?.player.name || "A rookie"} improved his projection.`, "View ROY Race", "Open Tracker", "green")}
        ${awardActionCard("All-Defense Watch", "3 players making late pushes.", "View Watchlist", "Compare", "blue")}
        ${awardActionCard("Coach of the Year Momentum", "Team success is shifting the race.", "View Race", "Compare Coaches", "green")}
        ${awardActionCard("New Career High", `${mvpRace[1]?.player.name || "A star"} delivered a statement game.`, "Watch Highlights", "Player Profile", "orange")}
        ${awardActionCard("Media Spotlight", "Latest narratives from around the league.", "Read Articles", "Media Votes", "red")}
        <button class="text-link">View all reports</button>
      </aside>
    </section>
    <section class="awards-lower-grid">
      <section class="award-team-projection">
        <header><h2>All-NBA Projection</h2></header>
        <div>${awardProjectionTeams(races.allNba)}</div>
        <button class="text-link">View full All-NBA projections</button>
      </section>
      <section class="award-rookie-ladder">
        <header><h2>Rookie Ladder</h2></header>
        <div>${races.rookie.slice(0, 5).map((item, index) => awardMiniRank(item, index)).join("") || '<p class="muted-line">No rookies eligible.</p>'}</div>
        <button class="text-link">View full rookie ladder</button>
      </section>
      <section class="award-news-panel">
        <header><h2>Recent Award News</h2></header>
        <div>${awardNewsItems(mvpRace, history)}</div>
        <button class="text-link">View all award news</button>
      </section>
    </section>
    <section class="award-activity-strip">
      <article><b>Award Watch Update</b><span>MVP race scores updated with latest games.</span><small>Just now</small></article>
      <article><b>Player Of The Week</b><span>${mvpRace[1]?.player.name || "Top contender"} wins weekly honors.</span><small>2h ago</small></article>
      <article><b>Media Votes Updated</b><span>Next fan/coach vote update in 3 days.</span><small>Today 10:00 AM</small></article>
      <button>View Activity Log</button>
    </section>
  </section>`;
}

function awardPlayerLine(item) {
  const stats = item.stats || playerSeasonStats(item.player.id);
  return {
    ppg: Number(statPerGame(stats.points, stats.games)),
    rpg: Number(statPerGame(stats.rebounds, stats.games)),
    apg: Number(statPerGame(stats.assists, stats.games)),
    spg: Number(statPerGame(stats.steals, stats.games)),
    bpg: Number(statPerGame(stats.blocks, stats.games)),
    fg: Math.min(62.5, 42 + item.player.rim * .08 + item.player.mid * .04),
    three: Math.min(48.5, 28 + item.player.three * .13),
    per: Math.max(12, item.player.ovr * .32 + item.player.minutes * .06),
    ws: Math.max(1, item.score / 42)
  };
}

function awardTopCard(label, candidates, kind) {
  const leader = candidates?.[0];
  if (!leader) return `<article class="award-top-card"><span>${escapeHtml(label)}</span><strong>No eligible player</strong></article>`;
  const player = leader.player || leader.coach;
  const team = getTeam(player.teamId);
  const value = kind === "rookie" || kind === "sixth" || kind === "mip" || kind === "coach" ? awardOdds(leader.score, kind) : (leader.score / 22).toFixed(1);
  return `<article class="award-top-card ${kind}">
    <span>${escapeHtml(label)}</span>
    <div class="award-top-main">
      ${teamLogo(team, "award-card-logo")}
      ${playerHeadshot(player, "award-card-shot")}
      <div><b>${escapeHtml(player.name)}</b><strong>${escapeHtml(value)}</strong></div>
      <em>^ ${Math.max(5, Math.round(leader.score % 65))}</em>
    </div>
    <div class="award-spark">${leagueStatsSparkline([30, 34, 33, 38, 40, 39, 43, 46, 45, 49])}</div>
  </article>`;
}

function awardOdds(score, kind) {
  const base = kind === "rookie" ? -175 : kind === "coach" ? 190 : 250;
  const adjusted = Math.round(base - Math.min(90, score / 5));
  return adjusted < 0 ? String(adjusted) : `+${adjusted}`;
}

function awardCoachRace() {
  return save.teams
    .map((team) => ({ coach: { name: save.coaching?.[team.id]?.name || `${team.city} Coach`, teamId: team.id, ovr: Math.round(teamRating(team)) }, score: team.wins * 9 + teamRating(team) * 1.2 }))
    .sort((a, b) => b.score - a.score);
}

function awardRaceRow(item, index) {
  const player = item.player;
  const team = getTeam(player.teamId);
  const score = (item.score / 22).toFixed(1);
  const status = index === 0 ? "Front Runner" : index < 4 ? "Strong Contender" : index < 7 ? "In The Hunt" : "Long Shot";
  return `<tr>
    <td>${index + 1}</td>
    <td><span class="award-player-cell">${playerHeadshot(player, "award-table-shot")}<b>${escapeHtml(player.name)}</b></span></td>
    <td>${teamLogo(team, "award-table-logo")}${escapeHtml(team.abbr)}</td>
    <td>${score}</td>
    <td>${Math.max(1, index + (index % 3 === 0 ? 0 : 1))}</td>
    <td class="${index % 4 === 3 ? "down" : "up"}">${index % 4 === 3 ? "v" : "^"}</td>
    <td>${escapeHtml(status)}</td>
  </tr>`;
}

function awardFeaturePanel(item, stats, races) {
  const player = item.player;
  const team = getTeam(player.teamId);
  return `<section class="award-feature-panel">
    <div class="award-feature-hero">
      ${playerHeadshot(player, "award-feature-shot")}
      <div>
        <div class="award-feature-title">${teamLogo(team, "award-feature-logo")}<h2>${escapeHtml(player.name)}</h2><span>Front Runner</span></div>
        <p>${escapeHtml(team.city)} ${escapeHtml(team.name)} #${player.jersey || player.ovr} - ${escapeHtml(player.pos)} - Age ${player.age}</p>
        <div class="award-feature-score"><strong>${(item.score / 22).toFixed(1)}</strong><span>MVP race score</span><strong>${awardOdds(item.score, "mvp")}</strong><span>Odds to win</span></div>
      </div>
    </div>
    <div class="award-season-stats">${[
      ["PPG", stats.ppg], ["RPG", stats.rpg], ["APG", stats.apg], ["FG%", stats.fg], ["3P%", stats.three], ["PER", stats.per], ["WS", stats.ws]
    ].map(([label, value]) => `<div><span>${label}</span><b>${Number(value).toFixed(1)}</b></div>`).join("")}</div>
    <div class="award-feature-details">
      <div><h3>Why He's Leading</h3><p>${escapeHtml(player.name)} combines elite production, team success, and late-game impact while carrying a major role.</p></div>
      <div><h3>Primary Strengths</h3>${["Playmaking", "Scoring Versatility", "Clutch Performance", "High Usage Efficiency"].map((label, index) => `<span>${escapeHtml(label)}<i style="--w:${84 - index * 6}%"></i></span>`).join("")}</div>
      <div><h3>Other Awards In Contention</h3>${awardContentionChips(player, races)}</div>
    </div>
    <footer><b>Recommendation</b><span>Front Runner</span><button>View Full Profile</button></footer>
  </section>`;
}

function awardContentionChips(player, races) {
  const options = [
    ["All-NBA First Team", races.allNba],
    ["All-Star Starter", races.mvp],
    ["Clutch Player of the Year", races.mvp]
  ];
  return options.map(([label, race]) => {
    const rank = race.findIndex((item) => item.player.id === player.id) + 1 || 3;
    return `<article>${teamLogo(player.teamId, "award-chip-logo")}<strong>${escapeHtml(label)}</strong><small>Rank: ${rank} - Score: ${(Math.max(2, 10 - rank * .8)).toFixed(1)} / 10</small></article>`;
  }).join("");
}

function awardActionCard(title, detail, primary, secondary, tone) {
  return `<article class="award-action-card ${tone}">
    <div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div>
    <footer><button>${escapeHtml(primary)}</button><button>${escapeHtml(secondary)}</button></footer>
  </article>`;
}

function awardLeaderTiles(races) {
  const leaders = [
    ["Scoring", races.mvp[0], "ppg"],
    ["Rebounds", races.dpoy[0], "rpg"],
    ["Assists", races.mvp[1] || races.mvp[0], "apg"],
    ["Steals", races.allDefense[0], "spg"],
    ["Blocks", races.allDefense[1] || races.allDefense[0], "bpg"],
    ["True Shooting %", races.mvp[2] || races.mvp[0], "fg"],
    ["PER", races.mvp[0], "per"],
    ["Clutch Rating", races.mvp[3] || races.mvp[0], "ws"]
  ];
  return leaders.map(([label, item, field]) => {
    const line = awardPlayerLine(item);
    return `<article>${playerHeadshot(item.player, "award-leader-shot")}<span>${escapeHtml(label)}</span><b>${escapeHtml(item.player.name)}</b><strong>${Number(line[field]).toFixed(1)}</strong></article>`;
  }).join("");
}

function awardProjectionTeams(candidates) {
  return [0, 1, 2].map((teamIndex) => `<article><h3>${["First Team", "Second Team", "Third Team"][teamIndex]}</h3>${candidates.slice(teamIndex * 5, teamIndex * 5 + 5).map((item) => `<div>${teamLogo(item.player.teamId, "award-mini-logo")}<span>${escapeHtml(item.player.name)}</span></div>`).join("")}</article>`).join("");
}

function awardMiniRank(item, index) {
  return `<article><span>${index + 1}</span>${playerHeadshot(item.player, "award-mini-shot")}<b>${escapeHtml(item.player.name)}</b><em class="${index === 3 ? "down" : "up"}">${index === 3 ? "v" : "^"}</em><strong>${(item.score / 24).toFixed(1)}</strong></article>`;
}

function awardNewsItems(race, history) {
  const fallback = race.slice(0, 4).map((item, index) => [`${item.player.name} strengthens award case`, `${teamName(item.player.teamId)} contender remains in the race.`, `${2 + index * 2}h ago`]);
  const items = history.length ? history.slice(0, 4).map((entry) => [`${playerDisplayName(entry.mvpId)} remembered as MVP`, `${entry.season} award history remains in the record book.`, "Archive"]) : fallback;
  return items.map(([title, detail, time], index) => `<article>${teamLogo(race[index % Math.max(1, race.length)]?.player?.teamId || save.activeTeamId, "award-news-logo")}<strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span><small>${escapeHtml(time)}</small></article>`).join("");
}

function awardRaceCard(label, candidates, description) {
  const leader = candidates[0];
  return `<section class="card award-card"><div class="card-label">${escapeHtml(label)}</div>${leader ? `<div class="award-leader"><strong>${escapeHtml(leader.player.name)}</strong><span>${escapeHtml(teamName(leader.player.teamId))} - ${leader.player.ovr} OVR</span><b>${Math.round(leader.score)}</b></div><div class="award-runner-list">${candidates.slice(1, 5).map((item, index) => `<div><span>${index + 2}</span><strong>${escapeHtml(item.player.name)}</strong><em>${Math.round(item.score)}</em></div>`).join("")}</div>` : '<div class="muted-line">No eligible players.</div>'}<p>${escapeHtml(description)}</p></section>`;
}

function awardTeamCard(label, candidates, groupSize) {
  return `<section class="card award-card"><div class="card-label">${escapeHtml(label)}</div><div class="award-team-list">${candidates.slice(0, groupSize * 3).map((item, index) => `<div><span>${Math.floor(index / groupSize) + 1}${ordinalTeamSuffix(Math.floor(index / groupSize) + 1)}</span><strong>${escapeHtml(item.player.name)}</strong><em>${escapeHtml(teamName(item.player.teamId))}</em></div>`).join("") || '<div class="muted-line">No eligible players.</div>'}</div></section>`;
}

function awardRaces() {
  const players = save.players.filter((player) => player.teamId);
  const scored = players.map((player) => ({ player, stats: playerSeasonStats(player.id), improvement: playerImprovement(player) }));
  const score = (item, kind) => {
    const team = getTeam(item.player.teamId);
    const winBonus = (team?.wins || 0) * 0.55;
    const ppg = Number(statPerGame(item.stats.points, item.stats.games));
    const rpg = Number(statPerGame(item.stats.rebounds, item.stats.games));
    const apg = Number(statPerGame(item.stats.assists, item.stats.games));
    if (kind === "mvp") return item.player.ovr * 2.2 + winBonus + ppg * 1.2 + rpg * .45 + apg * .65;
    if (kind === "dpoy") return item.player.def * 2.4 + winBonus * .35 + rpg * .6 + Number(statPerGame(item.stats.steals + item.stats.blocks, item.stats.games)) * 3;
    if (kind === "rookie") return item.player.ovr * 1.7 + ppg + rpg * .4 + apg * .5 + (item.player.pot - item.player.ovr) * .35;
    if (kind === "sixth") return item.player.ovr * 1.8 + ppg + item.player.minutes * .3 + (item.player.starter ? -60 : 0);
    if (kind === "mip") return item.improvement * 14 + item.player.ovr + ppg * .6 + Math.max(0, item.player.minutes - 12) * .4;
    if (kind === "allDefense") return item.player.def * 2 + rpg * .5 + Number(statPerGame(item.stats.steals + item.stats.blocks, item.stats.games)) * 2;
    if (kind === "allRookie") return item.player.ovr * 1.4 + item.player.pot * .35 + ppg * .7;
    return item.player.ovr * 2 + ppg + rpg * .35 + apg * .45;
  };
  const rank = (kind, filter = () => true) => scored.filter(filter).map((item) => ({ ...item, score: score(item, kind) })).sort((a, b) => b.score - a.score);
  return {
    mvp: rank("mvp"),
    dpoy: rank("dpoy"),
    rookie: rank("rookie", (item) => Number(item.player.contract?.serviceYears || 0) <= 1),
    sixth: rank("sixth", (item) => !item.player.starter && item.player.minutes >= 18),
    mip: rank("mip", (item) => item.improvement > 0),
    allNba: rank("allNba"),
    allDefense: rank("allDefense"),
    allRookie: rank("allRookie", (item) => Number(item.player.contract?.serviceYears || 0) <= 1)
  };
}

function playerImprovement(player) {
  const history = player.developmentHistory || [];
  const current = history.find((item) => item.season === save.season) || history.at(-1);
  return current ? Number(current.to || player.ovr) - Number(current.from || player.ovr) : Math.max(0, player.ovr - 72) / 8;
}

function playerDisplayName(playerId) {
  return save.players.find((player) => player.id === playerId)?.name || save.retiredPlayers.find((player) => player.id === playerId)?.name || "Not recorded";
}

function ordinalTeamSuffix(value) {
  return value === 1 ? "st" : value === 2 ? "nd" : value === 3 ? "rd" : "th";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function rotationPositionOptions() {
  return ["PG", "SG", "SF", "PF", "C", "G/F", "F/C"];
}

function rotationSecondaryPositionOptions() {
  return ["None", ...rotationPositionOptions()];
}

function starterSlotPositions() {
  return ["PG", "SG", "SF", "PF", "C"];
}

function normalizeRotationPosition(position) {
  const value = String(position || "").toUpperCase().replace(/\s+/g, "");
  const options = rotationPositionOptions();
  if (options.includes(value)) return value;
  if (value === "G") return "G/F";
  if (value === "F") return "F/C";
  if (value === "FC") return "F/C";
  if (value === "GF") return "G/F";
  return options.find((option) => value.includes(option.replace("/", ""))) || "G/F";
}

function playerRotationPositionParts(player) {
  const raw = String(player.rotationNaturalPos || player.pos || "").toUpperCase().replace(/\s+/g, "");
  return raw.split(/[\/,-]/).filter(Boolean);
}

function starterPositionFitScore(player, position) {
  const parts = playerRotationPositionParts(player);
  const primary = parts[0] || normalizeRotationPosition(player.rotationNaturalPos || player.pos);
  if (primary === position) return 4;
  if (parts.includes(position)) return 3;
  const normalized = normalizeRotationPosition(player.rotationNaturalPos || player.pos);
  if (normalized === position) return 3;
  if (normalized === "G/F" && ["SG", "SF"].includes(position)) return 2;
  if (normalized === "F/C" && ["PF", "C"].includes(position)) return 2;
  return 0;
}

function starterPositionAssignmentScore(player, position) {
  const fit = starterPositionFitScore(player, position);
  const fitBonus = { 4: 8, 3: 6, 2: 4, 0: -18 }[fit] ?? -18;
  return Number(player.ovr || 0) + fitBonus + Number(player.pot || player.ovr || 0) / 1000;
}

function isDefaultRotationCandidate(player) {
  if (player.gLeague) return false;
  if (player.injury > 0) return false;
  if (rosterType(player) === "twoWay" && (player.contract?.twoWayGamesUsed || 0) >= 50) return false;
  let phase = "Regular Season";
  try { phase = save?.phase || phase; } catch {}
  if (phase === "Playoffs" && rosterType(player) === "twoWay") return false;
  return true;
}

function positionAwareDefaultRotationOrder(roster) {
  const ranked = [...roster].sort((a, b) => b.ovr - a.ovr || b.pot - a.pot || a.age - b.age);
  const available = ranked.filter(isDefaultRotationCandidate);
  const candidatePool = (available.length ? available : ranked).slice(0, 15);
  const slots = starterSlotPositions();
  const selected = new Set();
  const starters = slots.map((position) => {
    const player = candidatePool
      .filter((candidate) => !selected.has(candidate.id))
      .sort((a, b) => starterPositionAssignmentScore(b, position) - starterPositionAssignmentScore(a, position) || b.ovr - a.ovr || b.pot - a.pot || a.age - b.age)[0];
    if (player) selected.add(player.id);
    return player;
  }).filter(Boolean);
  const bench = ranked.filter((player) => !selected.has(player.id));
  return [...starters, ...bench];
}

function savedRotationNaturalPosition(player) {
  return normalizeRotationPosition(player.rotationNaturalPos || player.pos);
}

function quests() {
  return `
    <h1 class="page-title">season goals</h1>
    <section class="card card-pad section-grid">
      ${metric("Win opener", save.results.length ? '<span class="ok">complete</span>' : "pending")}
      ${metric("Stay below second apron", activeTeam().payroll < cbaThresholds(save.season).secondApron ? '<span class="ok">complete</span>' : '<span class="bad">at risk</span>')}
      ${metric("Build contender core", `${Math.round(teamRating(activeTeam()))} avg OVR`)}
    </section>
  `;
}

function cap() {
  const team = activeTeam();
  const levels = cbaThresholds(save.season);
  const apron = apronStatus(team);
  const players = teamPlayers(team.id).sort((a, b) => contractSalary(b) - contractSalary(a));
  const filtered = players.filter((player) => {
    if (contractFilter === "all") return true;
    if (contractFilter === "expiring") return contractYearsRemaining(player) <= 1;
    if (contractFilter === "options") return Boolean(player.contract?.option && !player.contract.option.decided);
    if (contractFilter === "extension") return canExtendContract(player);
    return contractCategory(player) === contractFilter;
  });
  const expiring = players.filter((player) => contractYearsRemaining(player) <= 1);
  const holds = expiring.reduce((sum, player) => sum + projectedCapHold(player), 0);
  return `
    <h1 class="page-title">cap sheet</h1>
    <section class="card contract-office-header">
      <div>
        <div class="card-label">contract office</div>
        <div class="player-name">${escapeHtml(team.city)} ${escapeHtml(team.name)}</div>
        <div class="meta">${payrollStatus(team)} - ${rosterRuleStatus(team.id).standard} standard + ${rosterRuleStatus(team.id).twoWay} two-way - ${expiring.length} expiring</div>
      </div>
      <div class="contract-cap-meter">
        <strong>$${team.payroll.toFixed(1)}M</strong>
        <span>of $${levels.cap.toFixed(1)}M cap</span>
      </div>
    </section>
    <section class="grid-4 contract-summary">
      ${statCard("team salary", `$${team.payroll.toFixed(1)}M`)}
      ${statCard("luxury tax", `$${levels.tax.toFixed(1)}M`)}
      ${statCard("first apron", `$${levels.firstApron.toFixed(1)}M`)}
      ${statCard("second apron", `$${levels.secondApron.toFixed(1)}M`)}
    </section>
    <section class="card apron-dashboard ${apron.tier}">
      <div>
        <div class="card-label">nba salary cap rules</div>
        <div class="player-name">${escapeHtml(apron.label)}</div>
        <div class="meta">${escapeHtml(apron.summary)}</div>
      </div>
      <div class="apron-distances">
        ${metric("Cap Room", apron.distance.cap)}
        ${metric("Tax Room", apron.distance.tax)}
        ${metric("1st Apron Room", apron.distance.firstApron)}
        ${metric("2nd Apron Room", apron.distance.secondApron)}
      </div>
    </section>
    <section class="card contract-controls">
      <div class="contract-filters">
        ${["all", "expiring", "options", "extension"].map((filter) => `<button class="btn ${contractFilter === filter ? "primary" : ""}" data-contract-filter="${filter}">${filter === "all" ? "All Contracts" : filter === "extension" ? "Extension Eligible" : filter[0].toUpperCase() + filter.slice(1)}</button>`).join("")}
      </div>
      <div class="meta">Salaries shown in millions. Extensions use the player's current market value and applicable Bird raise limit.</div>
    </section>
    <section class="card table-card contract-table">
      <table>
        <thead><tr><th>Player</th><th>2026-27</th><th>Years</th><th>Guarantee</th><th>Option</th><th>Rights</th><th>FA</th><th>Action</th></tr></thead>
        <tbody>${filtered.map(contractRow).join("") || '<tr><td colspan="8"><div class="muted-line">No contracts match this filter.</div></td></tr>'}</tbody>
      </table>
    </section>
    <section class="grid-2 contract-rules-grid">
      <section class="card card-pad section-grid">
        <div class="card-label">cba status</div>
        ${metric("Salary Cap", `$${levels.cap.toFixed(1)}M`)}
        ${metric("Tax Line", `$${levels.tax.toFixed(1)}M`)}
        ${metric("First Apron", `$${levels.firstApron.toFixed(1)}M`)}
        ${metric("Second Apron", `$${levels.secondApron.toFixed(1)}M`)}
        ${metric("Cap Holds", `$${holds.toFixed(1)}M`)}
        ${metric("Hard Cap", apron.hardCap ? `<span class="bad">${escapeHtml(apron.hardCap)}</span>` : '<span class="ok">clear</span>')}
      </section>
      <section class="card card-pad section-grid">
        <div class="card-label">rights and exceptions</div>
        ${metric("Full Bird", players.filter((player) => player.contract.birdRights === "Bird").length)}
        ${metric("Restricted FAs", players.filter((player) => player.contract.freeAgentType === "RFA").length)}
        ${metric("Mid-Level", midLevelExceptionLabel(team))}
        ${metric("Bi-Annual", team.payroll >= levels.firstApron ? '<span class="bad">blocked</span>' : "available")}
        ${metric("Trade Matching", transactionRuleState().tradesOpen ? "available" : "deadline passed")}
      </section>
    </section>
    <section class="card apron-rule-card">
      <div class="card-label">apron restrictions</div>
      <div class="apron-rule-list">${capRuleRows(team).map((rule) => `<div class="${rule.ok ? "ok" : "bad"}"><strong>${rule.ok ? "OK" : "LOCKED"}</strong><span>${escapeHtml(rule.text)}</span></div>`).join("")}</div>
    </section>
  `;
}

function contractRow(player) {
  const contract = player.contract;
  const remaining = contractYearsRemaining(player);
  const extendable = canExtendContract(player);
  const option = contract.option?.type ? `${contract.option.type} ${contract.option.season}` : "None";
  const guarantee = contract.guaranteedThrough >= contract.endSeason ? "Fully guaranteed" : `Through ${contract.guaranteedThrough}`;
  return `<tr>
    <td><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.pos)} - ${player.ovr} OVR</small><button class="mini-action" data-view-player="${player.id}">View Card</button></td>
    <td><strong>$${contractSalary(player).toFixed(1)}M</strong><small>${contract.salaryType}</small></td>
    <td>${remaining}</td><td>${escapeHtml(guarantee)}</td><td>${escapeHtml(option)}</td><td>${escapeHtml(contract.birdRights)}</td><td>${escapeHtml(contract.freeAgentType)}</td>
    <td><button class="btn ${extendable ? "primary" : ""}" data-contract-extend="${escapeHtml(player.id)}" ${extendable ? "" : "disabled"}>${extendable ? "Extend" : contractActionStatus(player)}</button></td>
  </tr>`;
}

function apronStatus(team) {
  const levels = cbaThresholds(save.season);
  const distance = (line) => {
    const gap = roundMoney(line - team.payroll);
    return gap >= 0 ? `$${gap.toFixed(1)}M below` : `$${Math.abs(gap).toFixed(1)}M over`;
  };
  if (team.payroll >= levels.secondApron) {
    return {
      tier: "second-apron",
      label: "Second Apron Team",
      summary: "Most team-building tools are restricted: no taxpayer MLE, no aggregation, no cash in trades, no sign-and-trade receiving, and distant firsts can freeze.",
      hardCap: "second apron",
      distance: { cap: distance(levels.cap), tax: distance(levels.tax), firstApron: distance(levels.firstApron), secondApron: distance(levels.secondApron) }
    };
  }
  if (team.payroll >= levels.firstApron) {
    return {
      tier: "first-apron",
      label: "First Apron Team",
      summary: "Salary matching is tighter: cannot take back more salary than sent, bi-annual exception is blocked, and larger exception tools are limited.",
      hardCap: "first apron",
      distance: { cap: distance(levels.cap), tax: distance(levels.tax), firstApron: distance(levels.firstApron), secondApron: distance(levels.secondApron) }
    };
  }
  if (team.payroll >= levels.tax) {
    return {
      tier: "tax",
      label: "Tax Team",
      summary: "Tax teams retain trade matching and taxpayer exception flexibility until they cross the first apron.",
      hardCap: "",
      distance: { cap: distance(levels.cap), tax: distance(levels.tax), firstApron: distance(levels.firstApron), secondApron: distance(levels.secondApron) }
    };
  }
  return {
    tier: team.payroll >= levels.cap ? "over-cap" : "cap-room",
    label: team.payroll >= levels.cap ? "Over Cap Team" : "Cap Room Team",
    summary: team.payroll >= levels.cap ? "Over-cap tools remain available while below the tax aprons." : "Cap room can be used directly before exception rules matter.",
    hardCap: "",
    distance: { cap: distance(levels.cap), tax: distance(levels.tax), firstApron: distance(levels.firstApron), secondApron: distance(levels.secondApron) }
  };
}

function midLevelExceptionLabel(team) {
  const levels = cbaThresholds(save.season);
  if (team.payroll >= levels.secondApron) return '<span class="bad">blocked</span>';
  if (team.payroll >= levels.firstApron) return '<span class="bad">taxpayer only / hard cap risk</span>';
  if (team.payroll >= levels.cap) return `$${levels.mle.toFixed(1)}M non-taxpayer`;
  return "cap room first";
}

function capRuleRows(team) {
  const levels = cbaThresholds(save.season);
  const first = team.payroll >= levels.firstApron;
  const second = team.payroll >= levels.secondApron;
  return [
    { ok: !first, text: "First apron teams cannot take back more salary than they send in trades." },
    { ok: !first, text: "Bi-annual exception and full non-taxpayer MLE create first-apron hard-cap pressure." },
    { ok: !second, text: "Second apron teams cannot aggregate multiple outgoing player salaries in a trade." },
    { ok: !second, text: "Second apron teams cannot send cash, use trade exceptions, or receive sign-and-trade players." },
    { ok: !second, text: `Second apron teams risk freezing the ${save.season + 7} first-round pick if they remain above the line.` },
    { ok: team.payroll < levels.tax, text: "Luxury-tax payments begin above the tax line." }
  ];
}

function roster() {
  const selectedTeam = getTeam(rosterTeamId || save.activeTeamId) || activeTeam();
  rosterTeamId = selectedTeam.id;
  const players = teamPlayers(selectedTeam.id).sort((a, b) => b.ovr - a.ovr || a.age - b.age);
  const rules = rosterRuleStatus(selectedTeam.id);
  const averageAge = players.length ? (players.reduce((sum, player) => sum + Number(player.age || 0), 0) / players.length).toFixed(1) : "-";
  const expiring = players.filter((player) => contractYearsRemaining(player) <= 1).length;
  return `
    <section class="phase6-screen phase6-roster-screen">
    <h1 class="page-title roster-page-title">rosters</h1>
    <div class="phase6-roster-directory-shell">
    <section class="card league-roster-browser phase6-card phase6-card--accent phase6-directory-card">
      <header><div><span>NBA TEAM DIRECTORY</span><strong>ALL 30 ROSTERS</strong></div><small>Select a franchise to view its complete roster</small></header>
      <div class="roster-team-grid">${save.teams.map((team) => {
        const theme = teamThemes[team.id] || teamThemes.bos;
        return `<button class="${team.id === selectedTeam.id ? "active" : ""}" style="--directory-primary:${theme.primary};--directory-secondary:${theme.secondary}" data-roster-team="${team.id}" title="${escapeHtml(team.city)} ${escapeHtml(team.name)}">${teamLogo(team, "roster-browser-logo")}<span>${escapeHtml(team.abbr)}</span></button>`;
      }).join("")}</div>
    </section>
    <section class="card roster-team-hero phase6-card phase6-card--hero phase6-team-hero">
      <div class="roster-team-identity">${teamLogo(selectedTeam, "roster-team-hero-logo")}<div><span>${escapeHtml(selectedTeam.conf)} CONFERENCE</span><strong>${escapeHtml(selectedTeam.city)} ${escapeHtml(selectedTeam.name)}</strong><small>${selectedTeam.wins}-${selectedTeam.losses} · ${escapeHtml(payrollStatus(selectedTeam))}</small></div></div>
      <div class="roster-team-overall"><span>TEAM OVR</span><b>${Math.round(teamRating(selectedTeam))}</b></div>
    </section>
    </div>
    <section class="grid-4 roster-view-summary">${statCard("players", players.length, "phase6-stat-card phase6-stat-card--blue")}${statCard("average age", averageAge, "phase6-stat-card phase6-stat-card--green")}${statCard("payroll", `$${selectedTeam.payroll.toFixed(1)}M`, "phase6-stat-card phase6-stat-card--gold")}${statCard("expiring deals", expiring, "phase6-stat-card phase6-stat-card--red")}</section>
    <section class="card roster-compliance-strip ${rules.valid ? "valid" : "invalid"}"><div><span>ROSTER STATUS</span><strong>${rules.valid ? "NBA LEGAL" : "NEEDS ATTENTION"}</strong></div><p>${rules.standard}/15 standard · ${rules.twoWay}/3 two-way · ${rules.total}/18 total</p></section>
    <section class="card table-card league-roster-table phase6-card phase6-table-card phase6-scroll"><table><thead><tr><th>Player</th><th>Type</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Salary</th><th>Contract</th><th>Status</th><th>Action</th></tr></thead><tbody>${players.map(rosterViewerRow).join("")}</tbody></table></section>
    </section>`;
}

function rosterViewerRow(player) {
  const eligibility = isPlayerGameEligible(player);
  const status = player.gLeague ? "G League" : player.injury > 0 ? `${player.injuryType || "Injured"} · ${player.injury} games` : eligibility.ok ? "Available" : eligibility.message;
  const statusClass = player.injury > 0 || !eligibility.ok ? "bad" : "ok";
  const canWaive = player.teamId === save.activeTeamId;
  return `<tr><td><div class="roster-player-cell">${playerHeadshot(player, "roster-player-headshot")}<div><strong>${escapeHtml(player.name)}</strong><small>${escapeHtml(player.archetype || "Two-Way")}</small><button class="mini-action" data-view-player="${player.id}">View Card</button></div></div></td><td>${rosterTypeBadge(player)}</td><td>${escapeHtml(player.pos)}</td><td>${player.age}</td><td><strong>${player.ovr}</strong></td><td>${player.pot}</td><td>$${contractSalary(player).toFixed(1)}M</td><td><strong>${contractYearsRemaining(player)} yr</strong><small>${escapeHtml(player.contract?.salaryType || "Standard")}</small></td><td><span class="${statusClass}">${escapeHtml(status)}</span></td><td>${canWaive ? `<button class="btn danger roster-waive-btn" data-roster-waive="${player.id}" title="Waived guaranteed salary remains on the cap">Waive</button>` : '<span class="roster-readonly-action">—</span>'}</td></tr>`;
}

function rotationManagementPanel() {
  ensureTeamRotation(activeTeam().id);
  sanitizeRotationAvailability(activeTeam().id);
  syncRotationStarters(activeTeam().id);
  const team = activeTeam();
  const players = rotationPlayers(activeTeam().id);
  const status = rotationStatus(activeTeam().id);
  const rules = rosterRuleStatus(activeTeam().id);
  return `
    <h2 class="rotation-section-title">LINEUP &amp; MINUTES</h2>
    <section class="card rotation-header phase6-card phase6-card--hero phase6-rotation-hero">
      <div class="team-hero-identity">${teamLogo(team, "page-hero-logo")}<div> 
        <div class="card-label">rotation and minutes</div>
        <div class="player-name">${escapeHtml(team.city)} ${escapeHtml(team.name)}</div>
        <div class="meta">Drag players into the first five spots to set starters, assign positions, allocate 240 minutes, and keep a legal active list.</div>
      </div></div>
      <div class="rotation-hero-watermark" aria-hidden="true">${teamLogo(team, "rotation-hero-watermark-logo")}</div>
    </section>
    ${rotationMatchupPlanCard()}
    <section class="grid-4 rotation-summary">
      ${statCard("rotation rating", Math.round(teamRating(activeTeam())), "phase6-stat-card phase6-stat-card--blue")}
      ${statCard("status", status.valid ? '<span class="ok">ready</span>' : '<span class="bad">incomplete</span>', "phase6-stat-card phase6-stat-card--green")}
      ${statCard("standard deals", `${rules.standard}/15`, "phase6-stat-card phase6-stat-card--gold")}
      ${statCard("total roster", `${rules.total}/18`, "phase6-stat-card phase6-stat-card--purple")}
    </section>
    <section class="card rotation-lineup-card phase6-card phase6-card--accent">
      <header><div class="rotation-lineup-title"><span>ROTATION LINEUP</span><small>ⓘ</small><div class="rotation-total ${status.valid ? "valid" : "invalid"}"><strong>${status.minutes}</strong><span>/ 240 minutes</span></div></div><strong>FIRST 5 START &nbsp;·&nbsp; POSITIONS EDITABLE &nbsp;·&nbsp; MINUTES PER GAME</strong></header>
      <div class="rotation-lineup-columns"><span>POS</span><span>PLAYER</span><span>OVR</span><span>MIN</span><div>${[0, 10, 20, 30, 40, 48].map((tick) => `<b>${tick}</b>`).join("")}</div></div>
      <div class="rotation-lineup-list">${players.map((player, index) => rotationPlayerRow(player, index)).join("")}</div>
    </section>
    <section class="card rotation-footer phase6-card">
      <div id="rotation-message" class="${status.valid ? "ok" : "bad"}">${escapeHtml(status.message)}</div>
      <div class="actions">
        <button class="btn phase6-button" data-action="rotation-reset">Auto Set Rotation</button>
        <button class="btn primary phase6-button" data-action="rotation-save">Save Rotation</button>
      </div>
    </section>
  `;
}

function rotationMatchupPlanCard() {
  const team = activeTeam();
  const next = [...save.schedule].sort((a, b) => a.date.localeCompare(b.date)).find((game) => !game.played);
  const opponentId = next ? (next.home === save.activeTeamId ? next.away : next.home) : null;
  const opponent = opponentId ? getTeam(opponentId) : null;
  const plan = gamePlan(save.activeTeamId);
  const theirPlan = opponentId ? gamePlan(opponentId) : null;
  const advice = opponentId ? tacticalAdvice(save.activeTeamId, opponentId) : "No opponent remains on the schedule.";
  const teamAbbr = team?.abbr || "";
  const opponentAbbr = opponent?.abbr || "";
  return `<section class="card rotation-matchup-card phase6-card phase6-matchup-plan">
    <div class="rotation-matchup-main">
      <div>
        <div class="card-label">next matchup plan</div>
        <div class="rotation-matchup-heading">${opponent ? teamLogo(opponent, "strategy-team-logo rotation-opponent-logo") : ""}<span class="player-name">${opponent ? `${escapeHtml(teamAbbr)} vs ${escapeHtml(opponentAbbr)}` : "Season Complete"}</span></div>
        <div class="meta">Set the identity used by the simulation. Effects are capped so talent remains decisive.</div>
      </div>
    </div>
    <div class="rotation-matchup-opponent">
      <div><div class="card-label">opponent report</div><strong>${opponent ? escapeHtml(`${opponent.city} ${opponent.name}`) : "Season Complete"}</strong><small>${theirPlan ? `Expected ${escapeHtml(theirPlan.pace)} pace, ${escapeHtml(theirPlan.offense)} offense, ${escapeHtml(theirPlan.defense)} coverage.` : "No upcoming opponent to scout."}</small></div>
      <div class="rotation-staff-recommendation"><span>Staff Recommendation</span><p>${escapeHtml(advice)}</p></div>
    </div>
    <div class="strategy-fit"><span>System Fit</span><strong>${gamePlanFit(save.activeTeamId, plan)}%</strong></div>
  </section>`;
}

function rotationPlayerRow(player, index) {
  const eligibility = isPlayerGameEligible(player);
  const unavailable = !eligibility.ok;
  const minutes = unavailable ? 0 : Number(player.minutes || 0);
  const isStarterSlot = index < 5;
  const starterSlotPosition = starterSlotPositions()[index];
  const positionOptions = rotationPositionOptions();
  const secondaryPositionOptions = rotationSecondaryPositionOptions();
  const selectedPosition = isStarterSlot ? starterSlotPosition : normalizeRotationPosition(player.pos);
  const selectedSecondaryPosition = player.rotationSecondaryPos ? normalizeRotationPosition(player.rotationSecondaryPos) : "None";
  return `<article class="rotation-lineup-row ${isStarterSlot ? "starter-slot" : ""} ${minutes > 0 ? "in-rotation" : ""} ${unavailable ? "unavailable" : ""}" data-rotation-row="${escapeHtml(player.id)}">
    <div class="rotation-position-cell"><span class="rotation-drag-handle" draggable="true" data-rotation-drag="${escapeHtml(player.id)}" role="button" aria-label="Drag ${escapeHtml(player.name)} to reorder" title="Drag to reorder">⠿</span><div class="rotation-slot-lock ${isStarterSlot ? "locked" : ""}"><span>${isStarterSlot ? starterSlotPosition : index + 1}</span></div></div>
    <div class="rotation-player-identity">${playerHeadshot(player, "rotation-player-headshot")}<div><strong>${escapeHtml(player.name)}</strong><span>${rosterType(player) === "twoWay" ? "Two-Way" : `${player.age} years old`}</span><div class="rotation-position-controls"><label class="rotation-position-select"><span>Primary</span><select data-rotation-position="${escapeHtml(player.id)}" aria-label="Primary position for ${escapeHtml(player.name)}" ${isStarterSlot ? "disabled" : ""}>${positionOptions.map((position) => `<option value="${escapeHtml(position)}" ${position === selectedPosition ? "selected" : ""}>${escapeHtml(position)}</option>`).join("")}</select></label><label class="rotation-position-select secondary"><span>Secondary</span><select data-rotation-secondary-position="${escapeHtml(player.id)}" aria-label="Secondary position for ${escapeHtml(player.name)}">${secondaryPositionOptions.map((position) => `<option value="${escapeHtml(position)}" ${position === selectedSecondaryPosition ? "selected" : ""}>${escapeHtml(position)}</option>`).join("")}</select></label></div><label class="rotation-active-control"><input type="checkbox" data-roster-active="${escapeHtml(player.id)}" ${player.activeRoster ? "checked" : ""}><small>ACTIVE</small></label></div></div>
    <b class="rotation-player-ovr">${player.ovr}</b>
    <output class="rotation-minute-value" data-minute-output="${escapeHtml(player.id)}">${minutes}</output>
    <div class="rotation-slider-cell"><input class="rotation-minute-slider" type="range" min="0" max="48" step="1" value="${minutes}" data-rotation-minutes="${escapeHtml(player.id)}" style="--minute-pct:${minutes / 48 * 100}%" ${unavailable ? "disabled" : ""}>${unavailable ? `<small>${escapeHtml(player.injury > 0 ? `OUT ${player.injury}` : eligibility.message)}</small>` : ""}</div>
  </article>`;
}

function rosterTypeBadge(player) {
  const type = rosterType(player);
  if (type === "twoWay") return `<span class="roster-badge two-way">2W ${player.contract.twoWayGamesUsed || 0}/50</span>`;
  if (type === "tenDay") return '<span class="roster-badge ten-day">10D</span>';
  return '<span class="roster-badge standard">STD</span>';
}

function importView() {
  const activeFilter = editorTeamFilter || save.activeTeamId;
  const filteredPlayers = save.players
    .filter((player) => activeFilter === "all" || player.teamId === activeFilter)
    .filter((player) => !editorSearch || normalizeText(player.name).includes(normalizeText(editorSearch)))
    .sort((a, b) => a.teamId.localeCompare(b.teamId) || b.ovr - a.ovr);
  const visiblePlayers = filteredPlayers.slice(0, 100);
  const selected = save.players.find((player) => player.id === editorSelectedPlayerId) || null;
  return `
    <h1 class="page-title">league editor</h1>
    <section class="card card-pad editor-toolbar">
      <div>
        <div class="card-label">admin roster editor</div>
        <div class="player-name">League-wide player management</div>
        <div class="meta">${save.players.length} players across 30 teams</div>
      </div>
      <div class="actions editor-actions">
        <select id="editor-team-filter" aria-label="Filter roster by team">
          <option value="all" ${activeFilter === "all" ? "selected" : ""}>All teams</option>
          ${save.teams.map((team) => `<option value="${team.id}" ${activeFilter === team.id ? "selected" : ""}>${escapeHtml(team.abbr)} - ${escapeHtml(team.city)} ${escapeHtml(team.name)}</option>`).join("")}
        </select>
        <input id="editor-search" value="${escapeHtml(editorSearch)}" placeholder="Search player" aria-label="Search player">
        <button class="btn" data-action="editor-search">Search</button>
        <button class="btn primary" data-action="editor-new">Add Player</button>
      </div>
    </section>
    ${selected ? playerEditor(selected) : '<section class="card card-pad editor-empty"><div class="muted-line">Select a player below or add a new player.</div></section>'}
    <section class="card table-card editor-table">
      ${filteredPlayers.length > visiblePlayers.length ? `<div class="editor-result-note">Showing 100 of ${filteredPlayers.length} players. Use team filter or search to narrow the list.</div>` : ""}
      <table>
        <thead><tr><th>Player</th><th>Team</th><th>Age</th><th>Pos</th><th>OVR</th><th>POT</th><th>Morale</th><th></th></tr></thead>
        <tbody>
          ${visiblePlayers.length ? visiblePlayers.map(editorPlayerRow).join("") : '<tr><td colspan="8">No players match this filter.</td></tr>'}
        </tbody>
      </table>
    </section>
    <section class="grid-2">
      <section class="card card-pad">
        <div class="card-label">dataset import</div>
        <textarea id="import-box" placeholder='Paste JSON with "teams" and "players" arrays'></textarea>
      </section>
      <section class="card card-pad">
        <div class="card-label">validation report</div>
        <div id="import-report" class="muted-line">Paste a dataset to validate it.</div>
      </section>
    </section>
  `;
}

function editorPlayerRow(player) {
  return `<tr class="${player.id === editorSelectedPlayerId ? "selected-row" : ""}">
    <td>${escapeHtml(player.name)}</td>
    <td>${escapeHtml(teamAbbr(player.teamId))}</td>
    <td>${player.age}</td>
    <td>${escapeHtml(player.pos)}</td>
    <td>${player.ovr}</td>
    <td>${player.pot}</td>
    <td>${player.morale}</td>
    <td><button class="btn" data-editor-player="${escapeHtml(player.id)}">Edit</button></td>
  </tr>`;
}

function playerEditor(player) {
  return `
    <section class="card card-pad player-editor">
      <div class="editor-heading">
        <div>
          <div class="card-label">editing player</div>
          <div class="player-name">${escapeHtml(player.name)}</div>
        </div>
        <div class="actions">
          <button class="btn primary" data-action="editor-save">Save Changes</button>
          <button class="btn danger" data-action="editor-delete">Delete Player</button>
        </div>
      </div>
      <div class="editor-fields">
        ${editorField("Name", "editor-name", player.name, "text")}
        <label><span>Team</span><select id="editor-team">${save.teams.map((team) => `<option value="${team.id}" ${player.teamId === team.id ? "selected" : ""}>${escapeHtml(team.abbr)} - ${escapeHtml(team.city)} ${escapeHtml(team.name)}</option>`).join("")}</select></label>
        ${editorField("Age", "editor-age", player.age, "number", 18, 50)}
        ${editorField("Position", "editor-position", player.pos, "text")}
        ${editorField("Overall", "editor-overall", player.ovr, "number", 25, 99)}
        ${editorField("Potential", "editor-potential", player.pot, "number", 25, 99)}
        ${editorField("Morale", "editor-morale", player.morale, "number", 0, 100)}
        ${editorField("Minutes", "editor-minutes", player.minutes, "number", 0, 48)}
        ${editorField("Injury games", "editor-injury", player.injury, "number", 0, 82)}
      </div>
    </section>
  `;
}

function editorField(label, id, value, type, min = "", max = "") {
  return `<label><span>${label}</span><input id="${id}" type="${type}" value="${escapeHtml(value)}" ${min !== "" ? `min="${min}"` : ""} ${max !== "" ? `max="${max}"` : ""}></label>`;
}

function settings() {
  return `
    <h1 class="page-title">settings</h1>
    <section class="grid-2"><section class="card card-pad">
      <div class="card-label">career</div>
      ${metric("Mode", save.mode)}
      ${metric("Active Team", `${activeTeam().city} ${activeTeam().name}`)}
      ${metric("Save Version", save.saveDiagnostics?.version || 1)}
      ${metric("Last Autosave", save.saveDiagnostics?.lastAutosave ? formatDate(save.saveDiagnostics.lastAutosave) : "Not yet")}
      <label class="settings-field"><span>Career name</span><input id="career-name-input" value="${escapeHtml(save.careerName || defaultCareerName(save))}"></label>
      <div class="actions">
        <button class="btn primary" data-action="save">Save Career</button>
        <button class="btn" data-action="export-save">Export Backup</button>
        <label class="btn import-backup">Import Backup<input id="import-save-input" type="file" accept="application/json"></label>
        <button class="btn" data-action="mark-read">Mark News Read</button>
        <button class="btn" data-action="start">Start Menu</button>
        <button class="btn" data-action="folder">Open Folder</button>
      </div>
    </section><section class="card card-pad"><div class="card-label">automation and stop conditions</div><div class="automation-list">${Object.entries(save.automation).map(([key, enabled]) => `<label><input type="checkbox" data-automation="${key}" ${enabled ? "checked" : ""}><span>${escapeHtml(key.replace(/([A-Z])/g, " $1"))}</span></label>`).join("")}</div><div class="meta">Mandatory contract decisions and illegal rosters always stop simulation.</div></section></section>
    <section class="card card-pad"><div class="card-label">league configuration</div><div class="grid-4">${metric("Cap Growth", `${Math.round(save.leagueRules.capGrowth * 100)}%`)}${metric("Draft Rounds", save.leagueRules.draftRounds)}${metric("Play-In", save.leagueRules.playIn ? "Enabled" : "Disabled")}${metric("Next Rule Vote", save.leagueRules.ruleVoteSeason)}</div><div class="meta">League evolution votes occur every three seasons and can adjust cap growth, roster rules, or competition format.</div></section>
  `;
}

function statCard(label, value, extraClass = "") {
  return `<section class="card stat-card ${extraClass}" title="${escapeHtml(contextTooltip(label))}"><div class="card-label">${label}</div><div class="stat-value">${value}</div></section>`;
}

function contextTooltip(label) {
  const key = normalizeText(label);
  if (key.includes("chemistry")) return "Chemistry combines morale, continuity, leadership, winning, and unresolved complaints.";
  if (key.includes("cap")) return "Cap values include active salaries and applicable rights or holds.";
  if (key.includes("roster")) return "Standard, two-way, and active-list limits must all be legal.";
  if (key.includes("scout") || key.includes("college") || key.includes("analytics")) return "Higher department ratings narrow scouting uncertainty more quickly.";
  if (key.includes("approval")) return "Owner approval changes with wins, playoff results, finances, and stated goals.";
  return `${label} information for the current career state.`;
}

function metric(label, value) {
  return `<div class="metric-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function commandStat(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${value}</strong></div>`;
}

function commandRating(label, value) {
  const rating = Math.max(0, Math.min(100, Number(value || 0)));
  return `<div class="command-rating"><span>${escapeHtml(label)}</span><strong>${rating}</strong><i><b style="width:${rating}%"></b></i></div>`;
}

function playerDetailModal() {
  if (!selectedPlayerCardId) return "";
  const player = save.players.find((candidate) => candidate.id === selectedPlayerCardId);
  if (!player) { selectedPlayerCardId = null; return ""; }
  const season = playerSeasonStats(player.id);
  const career = player.careerStats || { games: 0, points: 0, rebounds: 0, assists: 0 };
  const awards = playerAwards(player.id);
  const draft = player.draftInfo || {};
  const contract = player.contract || {};
  const fatigue = Math.max(0, Math.min(100, 100 - Number(player.stamina || 75)));
  const moraleTone = Number(player.morale || 80) >= 75 ? "high" : Number(player.morale || 80) >= 55 ? "neutral" : "low";
  const healthLabel = Number(player.injury || 0) > 0 ? `${player.injury} games` : "Available";
  return `<div class="player-modal-backdrop" data-close-player-card="true">
    <section class="player-detail-card vertical-slice-player-card" role="dialog" aria-label="${escapeHtml(player.name)} player card">
      <button class="player-card-close" data-close-player-card="true" aria-label="Close player card">x</button>
      <header class="player-card-hero">
        <div class="player-card-avatar">${playerHeadshot(player, "player-card-headshot")}</div>
        <div>
          <div class="card-label">${escapeHtml(teamName(player.teamId) || "Free Agent")} - ${escapeHtml(player.archetype || "Player")}</div>
          <h2>${escapeHtml(player.name)}</h2>
          <div class="meta">${escapeHtml(player.pos)} · Age ${player.age} · ${player.ovr} OVR / ${player.pot} POT</div>
          <div class="player-profile-status"><span class="is-morale-${moraleTone}">MORALE ${player.morale}</span><span class="${player.injury ? "is-injury" : "is-available"}">${escapeHtml(healthLabel)}</span><span class="is-fatigue">FATIGUE ${fatigue}%</span></div>
        </div>
        <div class="player-card-overall"><span>OVR</span><strong>${player.ovr}</strong></div>
      </header>
      <section class="player-attribute-strip">
        ${[["3PT", player.three], ["MID", player.mid], ["RIM", player.rim], ["PASS", player.pass], ["DEF", player.def], ["STA", player.stamina]].map(([label, value]) => `<div><span>${label}</span><strong>${Number(value || 0)}</strong><i><b style="width:${Math.max(0, Math.min(100, Number(value || 0)))}%"></b></i></div>`).join("")}
      </section>
      <section class="player-card-tabs">
        ${playerCardSection("season stats", [
          ["GP", season.games],
          ["PPG", statPerGame(season.points, season.games)],
          ["RPG", statPerGame(season.rebounds, season.games)],
          ["APG", statPerGame(season.assists, season.games)],
          ["SPG", statPerGame(season.steals, season.games)],
          ["BPG", statPerGame(season.blocks, season.games)]
        ])}
        ${playerCardSection("career stats", [
          ["GP", career.games || 0],
          ["PTS", career.points || 0],
          ["REB", career.rebounds || 0],
          ["AST", career.assists || 0],
          ["PPG", statPerGame(career.points || 0, career.games || 0)]
        ])}
        ${playerCardSection("contract", [
          ["Salary", `$${contractSalary(player).toFixed(1)}M`],
          ["Years", contractYearsRemaining(player)],
          ["Type", contract.salaryType || "None"],
          ["Rights", contract.birdRights || "None"],
          ["FA", contract.freeAgentType || "UFA"],
          ["Option", contract.option?.type ? `${contract.option.type} ${contract.option.season}` : "None"]
        ])}
      </section>
      <section class="player-card-grid">
        <article class="player-card-panel"><div class="card-label">awards</div>${awards.length ? awards.map((award) => `<div class="player-card-line"><strong>${escapeHtml(award.label)}</strong><span>${award.season}</span></div>`).join("") : '<div class="muted-line">No awards recorded.</div>'}</article>
        <article class="player-card-panel"><div class="card-label">injury history</div>${(player.injuryHistory || []).length ? player.injuryHistory.slice(-8).reverse().map((injury) => `<div class="player-card-line"><strong>${escapeHtml(injury.type || "Injury")}</strong><span>${escapeHtml(injury.date || String(injury.season))} - ${injury.games || 0} games</span></div>`).join("") : '<div class="muted-line">No injuries recorded.</div>'}</article>
        <article class="player-card-panel"><div class="card-label">team history</div>${(player.teamHistory || []).length ? player.teamHistory.map((item) => `<div class="player-card-line"><strong>${escapeHtml(teamName(item.teamId))}</strong><span>${item.fromSeason}${item.toSeason && item.toSeason !== item.fromSeason ? `-${item.toSeason}` : ""} - ${escapeHtml(item.reason || "Roster")}</span></div>`).join("") : '<div class="muted-line">No team history recorded.</div>'}</article>
        <article class="player-card-panel"><div class="card-label">draft information</div>${metric("Draft", draft.year ? `${draft.year} Round ${draft.round || "-"} Pick ${draft.pick || "-"}` : "Undrafted / Imported")}${metric("Team", draft.teamId ? escapeHtml(teamName(draft.teamId)) : "Not recorded")}${metric("Origin", escapeHtml(draft.origin || player.college || "Unknown"))}</article>
      </section>
      <footer class="player-profile-actions"><button class="player-action-button" data-nav-shortcut="rotation">ADJUST ROLE</button><button class="player-action-button primary" data-nav-shortcut="trade">EXPLORE TRADE</button></footer>
    </section>
  </div>`;
}

function playerCardSection(title, rows) {
  return `<article class="player-card-panel compact"><div class="card-label">${title}</div><div class="player-card-stat-grid">${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${value}</strong></div>`).join("")}</div></article>`;
}

function playerSeasonStats(playerId) {
  const aggregate = save.players.find((player) => player.id === playerId)?.seasonStats?.[save.season];
  if (aggregate?.games) return {
    games: aggregate.games,
    points: aggregate.points || 0,
    rebounds: aggregate.rebounds || 0,
    assists: aggregate.assists || 0,
    steals: aggregate.steals || 0,
    blocks: aggregate.blocks || 0
  };
  const totals = { games: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 };
  const lines = [...(save.results || []), ...(save.leagueResults || [])]
    .filter((result, index, list) => list.findIndex((item) => item.gameId === result.gameId) === index)
    .flatMap((result) => [...(result.playerStats?.away || []), ...(result.playerStats?.home || [])])
    .filter((line) => line.playerId === playerId);
  lines.forEach((line) => {
    totals.games += 1;
    totals.points += Number(line.pts || 0);
    totals.rebounds += Number(line.reb || 0);
    totals.assists += Number(line.ast || 0);
    totals.steals += Number(line.stl || 0);
    totals.blocks += Number(line.blk || 0);
  });
  return totals;
}

function statPerGame(total, games) {
  return games ? (Number(total || 0) / games).toFixed(1) : "0.0";
}

function playerAwards(playerId) {
  const awards = [];
  (save.leagueHistory || []).forEach((season) => {
    if (season.mvpId === playerId) awards.push({ season: season.season, label: "Most Valuable Player" });
    if (season.dpoyId === playerId) awards.push({ season: season.season, label: "Defensive Player of the Year" });
    if (season.rookieId === playerId) awards.push({ season: season.season, label: "Rookie of the Year" });
    if (season.sixthManId === playerId) awards.push({ season: season.season, label: "Sixth Man of the Year" });
    if (season.mipId === playerId) awards.push({ season: season.season, label: "Most Improved Player" });
    if (season.allNba?.includes(playerId)) awards.push({ season: season.season, label: "All-NBA" });
    if (season.allDefense?.includes(playerId)) awards.push({ season: season.season, label: "All-Defense" });
    if (season.allRookie?.includes(playerId)) awards.push({ season: season.season, label: "All-Rookie" });
  });
  return awards;
}

function attachActions() {
  document.querySelector("[data-social-create-post]")?.addEventListener("click",()=>{socialCreatePostOpen=true;render();});
  document.querySelectorAll("[data-close-social-create]").forEach((element)=>element.addEventListener("click",(event)=>{if(element.classList.contains("social-post-modal-backdrop")&&event.target!==element)return;socialCreatePostOpen=false;render();}));
  const socialCreateText=document.querySelector("#social-create-text");
  socialCreateText?.addEventListener("input",()=>{const count=document.querySelector("#social-create-count");if(count)count.textContent=String(socialCreateText.value.length);});
  document.querySelector("#social-create-mode")?.addEventListener("change",(event)=>{const label=document.querySelector("#social-create-date-label");if(label)label.hidden=event.currentTarget.value!=="schedule";});
  const renderSocialCreatePreview=()=>{const target=document.querySelector("#social-create-preview"),text=document.querySelector("#social-create-text")?.value.trim(),playerId=document.querySelector("#social-create-player")?.value,player=save.players.find((item)=>item.id===playerId);if(target)target.innerHTML=`<small>Preview</small><strong>${escapeHtml(`${activeTeam().city} ${activeTeam().name}`)}</strong><p>${escapeHtml(text||"Your post preview will appear here.")}</p>${player?`<span>Featuring ${escapeHtml(player.name)}</span>`:""}`;};
  document.querySelector("[data-social-create-preview]")?.addEventListener("click",renderSocialCreatePreview);
  document.querySelector("[data-social-create-submit]")?.addEventListener("click",async()=>{
    const text=document.querySelector("#social-create-text")?.value.trim(); if(!text)return;
    const team=activeTeam(),account=socialAccount(`team-${team.id}`),type=document.querySelector("#social-create-type")?.value||"team",tone=document.querySelector("#social-create-tone")?.value||"professional",playerId=document.querySelector("#social-create-player")?.value||null,gameId=document.querySelector("#social-create-game")?.value||null,gifUrl=safeSocialMediaUrl(document.querySelector("#social-create-gif")?.value),mode=document.querySelector("#social-create-mode")?.value||"now",publishAt=document.querySelector("#social-create-date")?.value||currentLeagueDate(),player=save.players.find((item)=>item.id===playerId),mentions=player?[player.name]:[];
    if(mode==="schedule")save.social.scheduledPosts.push({id:`scheduled-${Date.now()}-${save.social.nextPostId++}`,text,type,tone,playerId,gameId,gifUrl,mentions,publishAt,status:"scheduled",createdAt:currentLeagueDate()});
    else save.social.posts.push({id:`social-post-${save.social.nextPostId++}`,accountId:account?.id||`team-${team.id}`,source:account?.name||`${team.city} ${team.name}`,handle:account?.handle||`@${team.abbr}`,verified:true,teamId:team.id,playerId,gameId,text,type,tone,gifUrl,mentions,time:"now",createdAt:currentLeagueDate(),simulated:true});
    socialCreatePostOpen=false;await persist();render();
  });
  document.querySelector("#social-approval-toggle")?.addEventListener("change", async (event)=>{save.automation.socialApproval=event.currentTarget.checked;await persist();});
  document.querySelectorAll("[data-social-schedule-suggestion]").forEach((button)=>button.addEventListener("click",()=>{const text=document.querySelector("#social-schedule-text"),date=document.querySelector("#social-schedule-date"),type=document.querySelector("#social-schedule-type");if(text)text.value=button.dataset.suggestionText||"";if(date)date.value=button.dataset.suggestionDate||currentLeagueDate();if(type)type.value=button.dataset.suggestionType||"team";}));
  document.querySelector("[data-social-schedule-create]")?.addEventListener("click",async()=>{const text=document.querySelector("#social-schedule-text")?.value.trim(),publishAt=document.querySelector("#social-schedule-date")?.value,type=document.querySelector("#social-schedule-type")?.value||"team";if(!text||!publishAt)return;save.social.scheduledPosts.push({id:`scheduled-${Date.now()}-${save.social.nextPostId++}`,text,publishAt,type,status:"scheduled",createdAt:currentLeagueDate()});await persist();render();});
  document.querySelectorAll("[data-social-schedule-publish]").forEach((button)=>button.addEventListener("click",async()=>{const item=save.social.scheduledPosts.find((entry)=>entry.id===button.dataset.socialSchedulePublish);if(publishScheduledSocialPost(item)){await persist();render();}}));
  document.querySelectorAll("[data-social-schedule-cancel]").forEach((button)=>button.addEventListener("click",async()=>{const item=save.social.scheduledPosts.find((entry)=>entry.id===button.dataset.socialScheduleCancel);if(item){item.status="cancelled";await persist();render();}}));
  document.querySelectorAll("[data-social-schedule-edit]").forEach((button)=>button.addEventListener("click",async()=>{const item=save.social.scheduledPosts.find((entry)=>entry.id===button.dataset.socialScheduleEdit);if(!item)return;const text=window.prompt("Edit scheduled post",item.text);if(text===null)return;const date=window.prompt("Publish date (YYYY-MM-DD)",item.publishAt);if(date===null)return;item.text=text.trim()||item.text;item.publishAt=/^\d{4}-\d{2}-\d{2}$/.test(date)?date:item.publishAt;item.status="scheduled";await persist();render();}));
  document.querySelectorAll("[data-social-notification-filter]").forEach((button) => button.addEventListener("click", () => { socialNotificationFilter = button.dataset.socialNotificationFilter; render(); }));
  document.querySelector("[data-social-notifications-read]")?.addEventListener("click", async () => { save.social.notifications.forEach((item)=>{item.read=true;}); await persist(); render(); });
  document.querySelectorAll("[data-social-notification]").forEach((button) => button.addEventListener("click", async () => {
    const notification = save.social.notifications.find((item)=>item.id===button.dataset.socialNotification);
    if (!notification) return;
    notification.read = true;
    if (notification.postId) selectedSocialPostId = notification.postId;
    if (notification.conversationId) { selectedSocialConversationId=notification.conversationId; socialActiveTab="messages"; }
    await persist(); render();
  }));
  document.querySelector("[data-social-refresh]")?.addEventListener("click", async () => {
    socialFeedRefreshKey += 1;
    const changed = processSocialCareerEvents() | processSocialStorySequences();
    if (changed) await persist();
    render();
  });
  document.querySelectorAll("[data-social-profile]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!button.dataset.socialProfile) return;
    selectedSocialAccountId = button.dataset.socialProfile;
    render();
  }));
  document.querySelectorAll("[data-close-social-profile]").forEach((element) => element.addEventListener("click", (event) => {
    if (element.classList.contains("social-post-modal-backdrop") && event.target !== element) return;
    selectedSocialAccountId = null;
    render();
  }));
  document.querySelector("[data-social-follow-account]")?.addEventListener("click", async (event) => {
    const id = event.currentTarget.dataset.socialFollowAccount;
    save.social.followingAccountIds = save.social.followingAccountIds.includes(id) ? save.social.followingAccountIds.filter((item)=>item!==id) : [...save.social.followingAccountIds,id];
    await persist(); render();
  });
  document.querySelectorAll("[data-social-post-action]").forEach((button) => button.addEventListener("click", async () => {
    const postId = button.dataset.socialPostId, action = button.dataset.socialPostAction, interactions = save.social.interactions;
    const toggle = (key) => { interactions[key] = interactions[key].includes(postId) ? interactions[key].filter((id) => id !== postId) : [...interactions[key],postId]; };
    if (action === "like") toggle("likedPostIds");
    if (action === "repost") toggle("repostedPostIds");
    if (action === "bookmark") toggle("bookmarkedPostIds");
    if (action === "reply" || action === "view") selectedSocialPostId = postId;
    if (action === "share") {
      const post = socialVisiblePostCache.get(postId);
      try { await navigator.clipboard.writeText(`${post?.source || "NBA Social"}: ${post?.text || ""}`); save.messages.push("Post copied to clipboard."); }
      catch { save.messages.push("Post ready to share."); }
    }
    if (["like","repost","bookmark"].includes(action)) await persist();
    render();
  }));
  document.querySelectorAll("[data-close-social-post]").forEach((element) => element.addEventListener("click", (event) => {
    if (element.classList.contains("social-post-modal-backdrop") && event.target !== element) return;
    selectedSocialPostId = null;
    render();
  }));
  const submitSocialReply = async () => {
    const input = document.querySelector("#social-reply-input"), text = input?.value.trim();
    if (!text || !selectedSocialPostId) return;
    save.social.replies.push({ id:`social-reply-${save.social.nextPostId++}`,postId:selectedSocialPostId,authorName:`${activeTeam().city} ${activeTeam().name}`,authorHandle:`@${activeTeam().abbr}`,teamId:activeTeam().id,text,time:"now",createdAt:currentLeagueDate() });
    await persist();
    render();
  };
  document.querySelector("[data-social-submit-reply]")?.addEventListener("click", submitSocialReply);
  document.querySelector("#social-reply-input")?.addEventListener("keydown", (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitSocialReply(); } });
  document.querySelector("[data-social-open-game]")?.addEventListener("click", (event) => { selectedGameId = event.currentTarget.dataset.socialOpenGame; selectedSocialPostId = null; active = "play"; render(); });
  document.querySelector("[data-social-open-transaction]")?.addEventListener("click", (event) => { selectedTransactionId = event.currentTarget.dataset.socialOpenTransaction; selectedSocialPostId = null; active = "transactions"; render(); });
  document.querySelectorAll("[data-social-tab]").forEach((button) => button.addEventListener("click", () => {
    socialActiveTab = button.dataset.socialTab || "for-you";
    if (socialActiveTab === "mentions") {
      save.social.notifications.forEach((item)=>{ if(item.type === "mention") item.read=true; });
      persist();
    }
    if (socialActiveTab === "messages" && socialMessagesDrawerOpen) closeSocialMessagesDrawer(render);
    else render();
  }));
  document.querySelector(".social-quick-dms")?.addEventListener("click", () => {
    if (socialMessagesDrawerOpen) closeSocialMessagesDrawer();
    else { socialMessagesDrawerOpen = true; render(); }
  });
  document.querySelector("[data-social-drawer-close]")?.addEventListener("click", () => closeSocialMessagesDrawer());
  document.querySelector("[data-social-drawer-fullscreen]")?.addEventListener("click", () => closeSocialMessagesDrawer(() => { socialActiveTab = "messages"; render(); }));
  document.querySelectorAll("[data-social-drawer-conversation]").forEach((button) => button.addEventListener("click", async () => {
    selectedSocialConversationId = button.dataset.socialDrawerConversation;
    const conversation = save.social.conversations.find((item) => item.id === selectedSocialConversationId);
    if (conversation) conversation.read = true;
    await persist();
    closeSocialMessagesDrawer(() => { socialActiveTab = "messages"; render(); });
  }));
  document.querySelector("#social-drawer-search")?.addEventListener("input", (event) => {
    const query = normalizeText(event.currentTarget.value);
    document.querySelectorAll("[data-social-drawer-conversation]").forEach((row) => { row.hidden = query && !row.dataset.socialDrawerSearch.includes(query); });
  });
  document.querySelectorAll("[data-social-conversation]").forEach((button) => button.addEventListener("click", async () => {
    selectedSocialConversationId = button.dataset.socialConversation;
    const conversation = save.social.conversations.find((item) => item.id === selectedSocialConversationId);
    if (conversation) conversation.read = true;
    await persist();
    render();
  }));
  document.querySelector("#social-message-search")?.addEventListener("input", (event) => {
    const query = normalizeText(event.currentTarget.value);
    document.querySelectorAll("[data-social-conversation]").forEach((row) => { row.hidden = query && !row.dataset.socialConversationSearch.includes(query); });
  });
  const sendSocialMessage = async () => {
    const input = document.querySelector("#social-message-input");
    const text = input?.value.trim();
    const conversation = save.social.conversations.find((item) => item.id === selectedSocialConversationId);
    if (!text || !conversation) return;
    conversation.messages.push({ id:`message-${save.social.nextMessageId++}`, sender:"team", text, time:"now" });
    conversation.updatedAt = currentLeagueDate();
    conversation.read = true;
    await persist();
    render();
  };
  document.querySelector("[data-social-send-message]")?.addEventListener("click", sendSocialMessage);
  document.querySelector("#social-message-input")?.addEventListener("keydown", (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendSocialMessage(); } });
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.action;
      if (action === "advance") advanceYear();
      if (action === "start-postseason") startPostseason();
      if (action === "sim-postseason-round") simulatePostseasonRound();
      if (action === "begin-offseason") beginOffseason();
      if (action === "run-lottery") resolveDraftLottery();
      if (action === "advance-scouting") advanceOffseasonStage("scouting");
      if (action === "advance-draft") advanceOffseasonStage("draft");
      if (action === "sim-draft-pick") {
        const pick = save.offseason?.draftOrder[save.offseason.currentPick];
        if (pick?.ownerTeamId === save.activeTeamId) draftProspect(aiDraftChoice(save.activeTeamId)?.id);
        else { simulateDraftToUserPick(); persist(); render(); }
      }
      if (action === "trade-current-pick") tradeCurrentDraftPick();
      if (action === "advance-options") advanceOffseasonStage("options");
      if (action === "advance-free-agency") advanceOffseasonStage("freeAgency");
      if (action === "resolve-free-agency") resolveFreeAgency();
      if (action === "filter-in-season-fa") {
        inSeasonFaSearch = document.querySelector("#in-season-fa-search")?.value.trim() || "";
        inSeasonFaPosition = document.querySelector("#in-season-fa-position")?.value || "all";
        inSeasonFaSort = document.querySelector("#in-season-fa-sort")?.value || "overall";
        inSeasonFaSortDirection = "desc";
        render();
      }
      if (action === "advance-roster") advanceOffseasonStage("roster");
      if (action === "auto-roster") autoCompleteRoster();
      if (action === "finish-offseason") finishOffseason();
      if (action === "save-game-plan") saveCurrentGamePlan();
      if (action === "auto-game-plan") autoSetGamePlan();
      if (action === "save-plan-preset") saveGamePlanPreset();
      if (action === "global-search") { globalSearch = document.querySelector("#global-player-search")?.value.trim() || ""; render(); }
      if (action === "clear-comparison") { comparisonPlayerIds = []; render(); }
      if (action === "open-staff-market") { active = "staff"; render(); }
      if (action === "settings") {
        active = "settings";
        render();
      }
      if (action === "trade-machine") {
        if (!transactionRuleState().tradesOpen) {
          save.messages.push("Trade rejected: the NBA trade deadline has passed.");
          render();
          return;
        }
        save.messages.push(`Trade machine opened. ${suggestedRosterNeed(activeTeam())} is the current front office priority.`);
        tradePartnerId = save.teams.find((team) => team.id !== save.activeTeamId)?.id;
        tradeOutgoingIds = [];
        tradeIncomingIds = [];
        tradeOutgoingPickIds = [];
        tradeIncomingPickIds = [];
        tradeConsent = false;
        resetMultiTradeState();
        active = "trade";
        render();
      }
      if (action === "trade-back") {
        active = "dashboard";
        render();
      }
      if (action === "trade-submit") {
        const decision = validateMultiTeamTrade(buildMultiTeamTradeTransaction(), tradeConsent);
        if (!decision.valid) return;
        completeMultiTeamTrade(decision.transaction);
        await persist();
        active = "dashboard";
        render();
      }
      if (action === "trade-reset") {
        resetMultiTradeState();
        multiTradeTeamPickerOpen = false;
        render();
      }
      if (action === "trade-add-team") {
        const teamId = document.querySelector("#multi-trade-add-team")?.value;
        if (teamId && !multiTradeTeamIds.includes(teamId) && multiTradeTeamIds.length < 4) multiTradeTeamIds.push(teamId);
        render();
      }
      if (action === "trade-open-team-picker") {
        multiTradeTeamPickerOpen = true;
        render();
      }
      if (action === "trade-close-team-picker") {
        multiTradeTeamPickerOpen = false;
        render();
      }
      if (action === "go-roster") {
        active = "inventory";
        render();
      }
      if (action === "go-cap") {
        active = "upgrade";
        render();
      }
      if (action === "go-games") {
        active = "play";
        render();
      }
      if (action === "go-transactions") {
        active = "transactions";
        render();
      }
      if (action === "start") {
        navigateToMainMenu();
      }
      if (action === "start-default") {
        pendingMode = "Default";
        active = "team-select";
        render();
      }
      if (action === "start-gm") {
        pendingMode = "GM";
        active = "team-select";
        render();
      }
      if (action === "load-save" && storedSave) {
        active = "saves";
        render();
      }
      if (action === "switch") {
        save.activeTeamId = save.activeTeamId === "bos" ? "den" : "bos";
        await persist();
        render();
      }
      if (action === "folder") window.nbaManager?.openFolder();
      if (action === "save") {
        const careerName = document.querySelector("#career-name-input")?.value.trim();
        if (careerName) save.careerName = careerName;
        save.messages.push("Career saved.");
        await persist();
        render();
      }
      if (action === "export-save") exportCareerBackup();
      if (action === "mark-read") { save.notifications.forEach((item) => { item.read = true; }); await persist(); render(); }
      if (action === "rotation-save") {
        const decision = captureRotationInputs();
        const message = document.querySelector("#rotation-message");
        if (!decision.valid) {
          if (message) {
            message.className = "bad";
            message.textContent = decision.message;
          }
          return;
        }
        save.messages.push(`Rotation saved for ${activeTeam().abbr}.`);
        await persist();
        render();
      }
      if (action === "rotation-reset") {
        setDefaultTeamRotation(activeTeam().id, true);
        await persist();
        render();
      }
      if (action === "editor-search") {
        editorSearch = document.querySelector("#editor-search")?.value.trim() || "";
        editorSelectedPlayerId = null;
        render();
      }
      if (action === "editor-new") {
        const teamId = !editorTeamFilter || editorTeamFilter === "all" ? save.activeTeamId : editorTeamFilter;
        const created = player(`custom-${Date.now()}`, "New Player", 22, "G/F", "", "Custom", teamId, 70, 78, 70, 70, 70, 70, 70, 80, 0);
        created.contract = createPlayerContract(created, save.season, save.players.length);
        created.contract.rosterType = rosterRuleStatus(teamId).standard >= 15 ? "twoWay" : "standard";
        created.contract.salaryType = created.contract.rosterType === "twoWay" ? "Two-Way" : created.contract.salaryType;
        created.activeRoster = false;
        save.players.push(created);
        assignDefaultRosterTypes(save.players, save.season);
        editorSelectedPlayerId = created.id;
        syncTeamRosters();
        syncTeamPayrolls(save);
        render();
      }
      if (action === "editor-save") {
        saveEditorPlayer();
        await persist();
        render();
      }
      if (action === "editor-delete") {
        const selected = save.players.find((player) => player.id === editorSelectedPlayerId);
        if (selected && window.confirm(`Delete ${selected.name} from the league?`)) {
          save.players = save.players.filter((player) => player.id !== selected.id);
          save.messages.push(`League editor deleted ${selected.name}.`);
          editorSelectedPlayerId = null;
          syncTeamRosters();
          syncTeamPayrolls(save);
          await persist();
          render();
        }
      }
    });
  });

  document.querySelectorAll("[data-plan-preset]").forEach((button) => button.addEventListener("click", () => {
    const preset = save.gamePlanPresets?.[save.activeTeamId]?.[Number(button.dataset.planPreset)];
    if (!preset) return;
    save.gamePlans[save.activeTeamId] = structuredClone(preset.plan);
    save.messages.push(`Loaded game-plan preset: ${preset.name}.`);
    render();
  }));

  document.querySelectorAll("[data-role-promise]").forEach((select) => select.addEventListener("change", async () => {
    const selected = save.players.find((player) => player.id === select.dataset.rolePromise);
    if (!selected) return;
    selected.promisedRole = select.value;
    applyMoraleChange(selected, select.value === "none" ? -1 : 2, select.value === "none" ? "role promise removed" : `${select.value} role promised`);
    await persist();
    render();
  }));

  document.querySelectorAll("[data-player-meeting]").forEach((button) => button.addEventListener("click", async () => {
    holdPlayerMeeting(button.dataset.playerMeeting);
    await persist();
    render();
  }));

  document.querySelectorAll("[data-watch-player]").forEach((button) => button.addEventListener("click", async () => {
    const id = button.dataset.watchPlayer;
    save.watchlist = save.watchlist.includes(id) ? save.watchlist.filter((item) => item !== id) : [...save.watchlist, id];
    await persist();
    render();
  }));

  document.querySelectorAll("[data-scout-player]").forEach((button) => button.addEventListener("click", async () => {
    scoutPlayer(button.dataset.scoutPlayer);
    await persist();
    render();
  }));

  document.querySelectorAll("[data-compare-player]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.comparePlayer;
    comparisonPlayerIds = comparisonPlayerIds.includes(id) ? comparisonPlayerIds.filter((item) => item !== id) : [...comparisonPlayerIds.slice(-1), id];
    render();
  }));

  document.querySelectorAll("[data-transaction-filter]").forEach((button) => button.addEventListener("click", () => {
    transactionFilter = button.dataset.transactionFilter;
    render();
  }));

  document.querySelectorAll("[data-nav-shortcut]").forEach((button) => button.addEventListener("click", () => {
    selectedPlayerCardId = null;
    active = button.dataset.navShortcut;
    render();
  }));

  document.querySelectorAll("[data-standings-view]").forEach((button) => button.addEventListener("click", () => {
    standingsView = button.dataset.standingsView || "standings";
    render();
  }));

  document.querySelectorAll("[data-standings-scope]").forEach((button) => button.addEventListener("click", () => {
    if (button.disabled) return;
    standingsScope = button.dataset.standingsScope || "conference";
    standingsView = "standings";
    render();
  }));

  document.querySelectorAll("[data-roster-team]").forEach((button) => button.addEventListener("click", () => {
    rosterTeamId = button.dataset.rosterTeam;
    render();
  }));

  document.querySelectorAll("[data-roster-waive]").forEach((button) => button.addEventListener("click", () => {
    waiveRosterPlayer(button.dataset.rosterWaive);
  }));

  document.querySelectorAll("[data-sim-control]").forEach((button) => button.addEventListener("click", () => simulateCalendarControl(button.dataset.simControl)));

  document.querySelectorAll("[data-automation]").forEach((input) => input.addEventListener("change", async () => {
    save.automation[input.dataset.automation] = input.checked;
    await persist();
  }));

  const taxTolerance = document.querySelector("#finance-tax-tolerance");
  if (taxTolerance) taxTolerance.addEventListener("change", async () => {
    save.gmCareer.finances.taxTolerance = taxTolerance.value;
    await persist();
    render();
  });

  document.querySelectorAll("[data-hire-staff]").forEach((button) => button.addEventListener("click", async () => {
    if (button.getAttribute("aria-disabled") === "true") return;
    hireStaffMember(button.dataset.hireStaff);
    await persist();
    render();
  }));

  document.querySelectorAll("[data-training-focus]").forEach((select) => select.addEventListener("change", async () => {
    const selected = save.players.find((player) => player.id === select.dataset.trainingFocus);
    if (selected) {
      selected.trainingFocus = select.value;
      await persist();
    }
  }));

  document.querySelectorAll("[data-g-league]").forEach((button) => button.addEventListener("click", async () => {
    const selected = save.players.find((player) => player.id === button.dataset.gLeague);
    if (!selected) return;
    selected.gLeague = !selected.gLeague;
    if (selected.gLeague) { selected.activeRoster = false; selected.starter = false; selected.minutes = 0; }
    addTransaction("Roster", `${selected.name} was ${selected.gLeague ? "assigned to" : "recalled from"} the G League.`);
    await persist();
    render();
  }));

  document.querySelectorAll("[data-trade-offer]").forEach((button) => button.addEventListener("click", async () => {
    decideAiTradeOffer(button.dataset.tradeOffer, button.dataset.decision);
    await persist();
    render();
  }));

  document.querySelectorAll("[data-view-player]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    if (button.closest(".social-post-conversation")) selectedSocialPostId = null;
    selectedPlayerCardId = button.dataset.viewPlayer;
    render();
  }));

  document.querySelectorAll("[data-close-player-card]").forEach((element) => element.addEventListener("click", (event) => {
    if (event.target !== element && element.classList.contains("player-modal-backdrop")) return;
    selectedPlayerCardId = null;
    render();
  }));

  const importInput = document.querySelector("#import-save-input");
  if (importInput) importInput.addEventListener("change", () => importCareerBackup(importInput.files?.[0]));

  document.querySelectorAll("[data-calendar-shift]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedEvent = save.seasonEvents.find((event) => event.id === selectedEventId);
      const selectedGame = save.schedule.find((game) => game.id === selectedGameId) || save.schedule.find((game) => !game.played);
      const current = calendarMonth || selectedEvent?.date.slice(0, 7) || selectedGame?.date.slice(0, 7) || `${save.season}-10`;
      const [year, month] = current.split("-").map(Number);
      const next = new Date(year, month - 1 + Number(button.dataset.calendarShift), 1);
      const min = new Date(save.season, 6, 1);
      const max = new Date(save.season + 1, 6, 1);
      const bounded = next < min ? min : next > max ? max : next;
      calendarMonth = `${bounded.getFullYear()}-${String(bounded.getMonth() + 1).padStart(2, "0")}`;
      selectedEventId = null;
      selectedTransactionId = null;
      render();
    });
  });

  document.querySelectorAll("[data-game-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedGameId = button.dataset.gameId;
      selectedEventId = null;
      selectedTransactionId = null;
      render();
    });
  });

  document.querySelectorAll("[data-season-event]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedEventId = button.dataset.seasonEvent;
      selectedTransactionId = null;
      render();
    });
  });

  document.querySelectorAll("[data-transaction-event]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedTransactionId = button.dataset.transactionEvent;
      selectedEventId = null;
      render();
    });
  });

  let draggedRotationPlayerId = null;
  document.querySelectorAll("[data-rotation-drag]").forEach((handle) => {
    handle.addEventListener("dragstart", (event) => {
      captureRotationInputs(false);
      draggedRotationPlayerId = handle.dataset.rotationDrag;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedRotationPlayerId);
      handle.closest("[data-rotation-row]")?.classList.add("dragging");
    });
    handle.addEventListener("dragend", () => {
      draggedRotationPlayerId = null;
      document.querySelectorAll("[data-rotation-row]").forEach((row) => row.classList.remove("dragging", "drop-before", "drop-after"));
    });
  });

  document.querySelectorAll("[data-rotation-row]").forEach((row) => {
    row.addEventListener("dragover", (event) => {
      if (!draggedRotationPlayerId || draggedRotationPlayerId === row.dataset.rotationRow) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const placeAfter = event.clientY > row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2;
      row.classList.toggle("drop-before", !placeAfter);
      row.classList.toggle("drop-after", placeAfter);
    });
    row.addEventListener("dragleave", () => row.classList.remove("drop-before", "drop-after"));
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      const draggedId = draggedRotationPlayerId || event.dataTransfer.getData("text/plain");
      if (!draggedId || draggedId === row.dataset.rotationRow) return;
      const placeAfter = event.clientY > row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2;
      reorderRotationPlayer(draggedId, row.dataset.rotationRow, placeAfter);
      render();
    });
  });

  document.querySelectorAll("[data-rotation-minutes], [data-rotation-position], [data-rotation-secondary-position], [data-roster-active]").forEach((input) => {
    input.addEventListener("input", () => {
      if (input.matches("[data-rotation-minutes]")) {
        clampRotationMinuteInput(input);
        input.style.setProperty("--minute-pct", `${Number(input.value) / 48 * 100}%`);
        const output = document.querySelector(`[data-minute-output="${CSS.escape(input.dataset.rotationMinutes)}"]`);
        if (output) output.textContent = input.value;
      }
      if (input.matches("[data-roster-active]") && !input.checked) {
        const row = input.closest("[data-rotation-row]");
        const minutesInput = row?.querySelector("[data-rotation-minutes]");
        const output = minutesInput ? document.querySelector(`[data-minute-output="${CSS.escape(minutesInput.dataset.rotationMinutes)}"]`) : null;
        if (minutesInput) {
          minutesInput.value = 0;
          minutesInput.style.setProperty("--minute-pct", "0%");
        }
        if (output) output.textContent = "0";
      }
      updateRotationDraftStatus();
    });
    input.addEventListener("change", updateRotationDraftStatus);
  });

  document.querySelectorAll("[data-contract-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      contractFilter = button.dataset.contractFilter;
      render();
    });
  });

  document.querySelectorAll("[data-contract-extend]").forEach((button) => {
    button.addEventListener("click", async () => {
      extendPlayerContract(button.dataset.contractExtend);
      await persist();
      render();
    });
  });

  const tradePartner = document.querySelector("#trade-partner");
  if (tradePartner) {
    tradePartner.addEventListener("change", () => {
      tradePartnerId = tradePartner.value;
      tradeOutgoingIds = [];
      tradeIncomingIds = [];
      tradeOutgoingPickIds = [];
      tradeIncomingPickIds = [];
      tradeConsent = false;
      render();
    });
  }

  document.querySelectorAll("[data-remove-trade-team]").forEach((button) => button.addEventListener("click", () => {
    const teamId = button.dataset.removeTradeTeam;
    const removedPlayerIds = save.players.filter((player) => player.teamId === teamId).map((player) => String(player.id));
    const removedPickIds = save.draftPicks.filter((pick) => pick.ownerTeamId === teamId).map((pick) => String(pick.id));
    multiTradeTeamIds = multiTradeTeamIds.filter((id) => id !== teamId);
    multiTradePlayerIds = multiTradePlayerIds.filter((id) => !removedPlayerIds.includes(String(id)) && multiTradeRoutes[id] !== teamId);
    multiTradePickIds = multiTradePickIds.filter((id) => !removedPickIds.includes(String(id)) && multiTradeRoutes[id] !== teamId);
    [...removedPlayerIds, ...removedPickIds].forEach((id) => { delete multiTradeRoutes[id]; });
    Object.keys(multiTradeRoutes).forEach((id) => { if (multiTradeRoutes[id] === teamId) delete multiTradeRoutes[id]; });
    tradeConsent = false;
    multiTradeTeamPickerOpen = false;
    render();
  }));

  document.querySelectorAll("[data-trade-select-team]").forEach((button) => button.addEventListener("click", () => {
    const teamId = button.dataset.tradeSelectTeam;
    if (teamId && !multiTradeTeamIds.includes(teamId) && multiTradeTeamIds.length < 4) {
      multiTradeTeamIds.push(teamId);
      multiTradeTeamPickerOpen = false;
      tradeConsent = false;
      render();
    }
  }));

  const filterTradeTeamOptions = () => {
    const query = document.querySelector("#multi-trade-team-search")?.value.trim().toLowerCase() || "";
    const conference = document.querySelector(".multi-trade-team-options")?.dataset.activeConference || "all";
    const teamButtons = [...document.querySelectorAll(".multi-trade-team-options [data-trade-select-team]")];
    let visibleCount = 0;
    teamButtons.forEach((button) => {
      const matchesSearch = !query || button.dataset.teamSearch.includes(query);
      const matchesConference = conference === "all" || button.dataset.teamConference === conference;
      const visible = matchesSearch && matchesConference;
      button.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    const count = document.querySelector("#multi-trade-team-result-count");
    const empty = document.querySelector(".multi-trade-picker-empty");
    if (count) count.textContent = visibleCount;
    if (empty) empty.hidden = visibleCount !== 0;
  };
  document.querySelector("#multi-trade-team-search")?.addEventListener("input", filterTradeTeamOptions);
  document.querySelectorAll("[data-trade-team-filter]").forEach((button) => button.addEventListener("click", () => {
    const options = document.querySelector(".multi-trade-team-options");
    if (options) options.dataset.activeConference = button.dataset.tradeTeamFilter;
    document.querySelectorAll("[data-trade-team-filter]").forEach((filter) => filter.classList.toggle("active", filter === button));
    filterTradeTeamOptions();
  }));

  document.querySelectorAll("[data-multi-trade-player]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.multiTradePlayer;
    const index = multiTradePlayerIds.findIndex((value) => String(value) === id);
    if (index >= 0) { multiTradePlayerIds.splice(index, 1); delete multiTradeRoutes[id]; }
    else {
      const player = save.players.find((candidate) => String(candidate.id) === id);
      const destination = multiTradeTeamIds.find((teamId) => teamId !== player?.teamId);
      if (!destination) return;
      multiTradePlayerIds.push(id);
      multiTradeRoutes[id] = destination;
    }
    tradeConsent = false;
    render();
  }));

  document.querySelectorAll("[data-multi-trade-pick]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.multiTradePick;
    const index = multiTradePickIds.findIndex((value) => String(value) === id);
    if (index >= 0) { multiTradePickIds.splice(index, 1); delete multiTradeRoutes[id]; }
    else {
      const pick = save.draftPicks.find((candidate) => String(candidate.id) === id);
      const destination = multiTradeTeamIds.find((teamId) => teamId !== pick?.ownerTeamId);
      if (!destination) return;
      multiTradePickIds.push(id);
      multiTradeRoutes[id] = destination;
    }
    render();
  }));

  document.querySelectorAll("[data-remove-trade-asset]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.removeTradeAsset;
    multiTradePlayerIds = multiTradePlayerIds.filter((value) => String(value) !== id);
    multiTradePickIds = multiTradePickIds.filter((value) => String(value) !== id);
    delete multiTradeRoutes[id];
    tradeConsent = false;
    render();
  }));

  document.querySelectorAll("[data-multi-trade-route]").forEach((select) => select.addEventListener("change", () => {
    multiTradeRoutes[select.dataset.multiTradeRoute] = select.value;
    tradeConsent = false;
    render();
  }));

  document.querySelectorAll("[data-trade-player]").forEach((input) => {
    input.addEventListener("change", () => {
      const collection = input.dataset.tradeSide === "outgoing" ? tradeOutgoingIds : tradeIncomingIds;
      const index = collection.indexOf(input.dataset.tradePlayer);
      if (input.checked && index < 0) collection.push(input.dataset.tradePlayer);
      if (!input.checked && index >= 0) collection.splice(index, 1);
      tradeConsent = false;
      render();
    });
  });

  document.querySelectorAll("[data-trade-pick]").forEach((input) => {
    input.addEventListener("change", () => {
      const collection = input.dataset.tradeSide === "outgoing" ? tradeOutgoingPickIds : tradeIncomingPickIds;
      const index = collection.indexOf(input.dataset.tradePick);
      if (input.checked && index < 0) collection.push(input.dataset.tradePick);
      if (!input.checked && index >= 0) collection.splice(index, 1);
      render();
    });
  });

  const consent = document.querySelector("#trade-consent");
  if (consent) {
    consent.addEventListener("change", () => {
      tradeConsent = consent.checked;
      render();
    });
  }

  document.querySelectorAll("[data-sim-game]").forEach((button) => {
    button.addEventListener("click", () => simulateScheduledGame(button.dataset.simGame, false));
  });

  document.querySelectorAll("[data-simcast-game]").forEach((button) => {
    button.addEventListener("click", () => startSimcast(button.dataset.simcastGame));
  });

  document.querySelectorAll("[data-simcast-speed]").forEach((button) => {
    button.addEventListener("click", () => setSimcastSpeed(Number(button.dataset.simcastSpeed)));
  });

  document.querySelectorAll("[data-simcast-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.simcastAction === "pause") toggleSimcastPause();
      if (button.dataset.simcastAction === "finish") finishSimcastImmediately();
      if (button.dataset.simcastAction === "next-period") finishSimcastPeriod();
      if (button.dataset.simcastAction === "exit") exitSimcast();
    });
  });

  document.querySelectorAll("[data-simcast-coach]").forEach((button) => button.addEventListener("click", () => {
    if (!simcastState || simcastState.completed) return;
    const side = simcastState.userSide;
    if (button.dataset.simcastCoach === "timeout") window.NBASimulationEngine.callTimeout(simcastState, side);
    if (button.dataset.simcastCoach === "substitute") {
      const outgoingId = document.querySelector("#simcast-sub-out")?.value;
      const incomingId = document.querySelector("#simcast-sub-in")?.value;
      window.NBASimulationEngine.substitute(simcastState, side, outgoingId, incomingId);
    }
    render();
    if (!simcastState.paused) scheduleSimcastTick();
  }));

  document.querySelectorAll("[data-simcast-preset]").forEach((button) => button.addEventListener("click", () => {
    if (!simcastState || simcastState.completed) return;
    window.NBASimulationEngine.applyLineupPreset(simcastState, simcastState.userSide, button.dataset.simcastPreset);
    render();
    if (!simcastState.paused) scheduleSimcastTick();
  }));

  document.querySelectorAll("[data-simcast-strategy]").forEach((select) => select.addEventListener("change", () => {
    if (!simcastState || simcastState.completed) return;
    window.NBASimulationEngine.setStrategy(simcastState, simcastState.userSide, select.dataset.simcastStrategy, select.value);
  }));

  document.querySelectorAll("[data-play-game]").forEach((button) => {
    button.addEventListener("click", () => simulateScheduledGame(button.dataset.playGame, true));
  });

  document.querySelectorAll("[data-sim-event]").forEach((button) => {
    button.addEventListener("click", () => simulateSeasonEvent(button.dataset.simEvent));
  });

  document.querySelectorAll("[data-advance-deadline]").forEach((button) => {
    button.addEventListener("click", () => advanceToTransactionEvent(button.dataset.advanceDeadline));
  });

  document.querySelectorAll("[data-postseason-series]").forEach((button) => {
    button.addEventListener("click", () => simulatePostseasonSeries(button.dataset.postseasonSeries));
  });

  document.querySelectorAll("[data-scout-prospect]").forEach((button) => {
    button.addEventListener("click", () => scoutProspect(button.dataset.scoutProspect));
  });

  document.querySelectorAll("[data-draft-prospect]").forEach((button) => {
    button.addEventListener("click", () => draftProspect(button.dataset.draftProspect));
  });

  document.querySelectorAll("[data-option-player]").forEach((button) => {
    button.addEventListener("click", () => decideContract(button.dataset.optionPlayer, button.dataset.optionDecision));
  });

  document.querySelectorAll("[data-fa-offer]").forEach((button) => {
    button.addEventListener("click", () => submitFreeAgentOffer(button.dataset.faOffer, button.dataset.offerTier));
  });

  document.querySelectorAll("[data-in-season-sign]").forEach((button) => {
    button.addEventListener("click", () => signInSeasonFreeAgent(button.dataset.inSeasonSign, button.dataset.contractType));
  });

  document.querySelectorAll("[data-in-season-waive]").forEach((button) => {
    button.addEventListener("click", () => waiveInSeasonPlayer(button.dataset.inSeasonWaive));
  });

  document.querySelectorAll("[data-in-season-fa-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextSort = button.dataset.inSeasonFaSort || "overall";
      inSeasonFaSearch = document.querySelector("#in-season-fa-search")?.value.trim() || "";
      inSeasonFaPosition = document.querySelector("#in-season-fa-position")?.value || "all";
      inSeasonFaSortDirection = inSeasonFaSort === nextSort && inSeasonFaSortDirection === "desc" ? "asc" : "desc";
      inSeasonFaSort = nextSort;
      render();
    });
  });

  document.querySelector("#in-season-fa-search")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    inSeasonFaSearch = event.currentTarget.value.trim();
    inSeasonFaPosition = document.querySelector("#in-season-fa-position")?.value || "all";
    inSeasonFaSort = document.querySelector("#in-season-fa-sort")?.value || "overall";
    inSeasonFaSortDirection = "desc";
    render();
  });

  document.querySelectorAll("[data-rfa-match]").forEach((button) => {
    button.addEventListener("click", () => decideRfaMatch(button.dataset.rfaMatch, button.dataset.matchDecision));
  });

  document.querySelectorAll("[data-coach-style]").forEach((button) => {
    button.addEventListener("click", () => setCoachStyle(save.activeTeamId, button.dataset.coachStyle));
  });

  document.querySelectorAll("[data-job-team]").forEach((button) => {
    button.addEventListener("click", () => acceptJob(button.dataset.jobTeam));
  });

  const editorTeamSelect = document.querySelector("#editor-team-filter");
  if (editorTeamSelect) {
    editorTeamSelect.addEventListener("change", () => {
      editorTeamFilter = editorTeamSelect.value;
      editorSelectedPlayerId = null;
      render();
    });
  }

  const editorSearchInput = document.querySelector("#editor-search");
  if (editorSearchInput) {
    editorSearchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      editorSearch = editorSearchInput.value.trim();
      editorSelectedPlayerId = null;
      render();
    });
  }

  document.querySelectorAll("[data-editor-player]").forEach((button) => {
    button.addEventListener("click", () => {
      editorSelectedPlayerId = button.dataset.editorPlayer;
      render();
    });
  });

  const importBox = document.querySelector("#import-box");
  if (importBox) {
    importBox.addEventListener("input", () => validateImport(importBox.value));
  }

  document.querySelectorAll("[data-team-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      save = createModeSave(pendingMode || "Default", button.dataset.teamId);
      save.slotId = createSlotId();
      save.careerName = defaultCareerName(save);
      pendingMode = null;
      active = "dashboard";
      await persist();
      render();
    });
  });

  document.querySelectorAll("[data-slot-load]").forEach((button) => {
    button.addEventListener("click", async () => {
      const loaded = await window.nbaManager?.loadSaveSlot(button.dataset.slotLoad);
      if (!loaded) return;
      save = normalizeSave(loaded);
      storedSave = structuredClone(save);
      active = "dashboard";
      render();
    });
  });

  document.querySelectorAll("[data-slot-overwrite]").forEach((button) => {
    button.addEventListener("click", async () => {
      save.slotId = button.dataset.slotOverwrite;
      save.careerName = save.careerName || defaultCareerName(save);
      await persist();
      active = "saves";
      render();
    });
  });

  document.querySelectorAll("[data-slot-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      saveSlots = (await window.nbaManager?.deleteSaveSlot(button.dataset.slotDelete)) || [];
      if (save.slotId === button.dataset.slotDelete) save = structuredClone(defaultSave);
      storedSave = saveSlots.length ? storedSave : null;
      active = "saves";
      render();
    });
  });
}

function startSimcast(gameId) {
  const lineup = rotationStatus(save.activeTeamId);
  if (!lineup.valid) {
    save.messages.push(`Game blocked: ${lineup.message}`);
    active = "inventory";
    render();
    return;
  }
  const schedule = [...save.schedule].sort((a, b) => a.date.localeCompare(b.date));
  const targetIndex = schedule.findIndex((game) => game.id === gameId);
  const game = schedule[targetIndex];
  if (!game || game.played) return;

  schedule.slice(0, targetIndex).filter((candidate) => !candidate.played).forEach((candidate) => {
    simulateGameResult(candidate, false, false, true);
    simulateLeagueGamesForDate(candidate.date);
    save.timelineDate = candidate.date;
  });

  clearTimeout(simcastTimer);
  simcastTimer = null;
  simcastState = createSimcastState(game);
  selectedGameId = game.id;
  active = "play";
  render();
  scheduleSimcastTick();
}

function createPossessionGameState(game) {
  const engine = window.NBASimulationEngine;
  if (!engine) throw new Error("Possession simulation engine is unavailable.");
  const home = getTeam(game.home);
  const away = getTeam(game.away);
  const homeProfile = teamGameProfile(home.id, away.id, true);
  const awayProfile = teamGameProfile(away.id, home.id, false);
  const eligibleRoster = (teamId) => {
    ensureTeamRotation(teamId);
    const activePlayers = rotationPlayers(teamId).filter((player) => player.minutes > 0 && isPlayerGameEligible(player).ok);
    return activePlayers.length >= 5 ? activePlayers : teamPlayers(teamId).filter((player) => isPlayerGameEligible(player).ok).sort((a, b) => b.ovr - a.ovr).slice(0, 10);
  };
  return engine.createGameState({
    game,
    teams: { home, away },
    rosters: { home: eligibleRoster(home.id), away: eligibleRoster(away.id) },
    plans: { home: structuredClone(gamePlan(home.id)), away: structuredClone(gamePlan(away.id)) },
    profiles: { home: homeProfile, away: awayProfile },
    rng: Math.random
  });
}

function createSimcastState(game) {
  const state = createPossessionGameState(game);
  state.speed = 1;
  state.paused = false;
  state.userSide = game.home === save.activeTeamId ? "home" : "away";
  state.pace = Math.round((state.profiles.home.possessions + state.profiles.away.possessions) / 2);
  return state;
}

function simcastPage() {
  const state = simcastState;
  const game = save.schedule.find((candidate) => candidate.id === state?.gameId);
  if (!state || !game) {
    simcastState = null;
    return play();
  }
  const home = getTeam(state.homeId);
  const away = getTeam(state.awayId);
  const periodLength = state.period <= 4 ? 720 : 300;
  const regulationElapsed = (Math.min(state.period, 4) - 1) * 720 + (periodLength - state.seconds);
  const progress = state.completed ? 100 : Math.min(99, Math.round(regulationElapsed / 2880 * 100));
  const feed = state.processedEvents.slice(-16).reverse();
  return `
    <section class="simcast-shell">
      <header class="simcast-topline"><div><span>SIMCAST</span><strong>${state.completed ? "FINAL" : state.paused ? "PAUSED" : "LIVE"}</strong></div><div>${formatGameDate(game.date)} · ${game.home === save.activeTeamId ? "HOME" : "AWAY"}</div></header>
      <section class="simcast-scoreboard card" style="${simcastMatchupVars(away, home)}">
        <div class="simcast-team away" style="${simcastTeamVars(away)}">${teamLogo(away, "simcast-team-logo")}<div><span>${escapeHtml(away.city)}</span><strong class="simcast-team-name${away.name.length > 14 ? " is-extra-long" : away.name.length > 9 ? " is-long" : ""}">${escapeHtml(away.name)}</strong><small>${away.wins}-${away.losses}</small></div><b id="simcast-away-score" class="score-digits-${String(state.awayScore).length}">${state.awayScore}</b></div>
        <div class="simcast-clock"><span id="simcast-period">${state.completed ? "FINAL" : simcastPeriodLabel(state.period)}</span><strong id="simcast-clock">${state.clock}</strong><small id="simcast-possession-team">${state.completed ? "GAME COMPLETE" : state.paused ? "SIMULATION PAUSED" : `${escapeHtml((state.teams[state.possessionSide]?.abbr || "").toUpperCase())} POSSESSION`}</small></div>
        <div class="simcast-team home" style="${simcastTeamVars(home)}"><b id="simcast-home-score" class="score-digits-${String(state.homeScore).length}">${state.homeScore}</b><div><span>${escapeHtml(home.city)}</span><strong class="simcast-team-name${home.name.length > 14 ? " is-extra-long" : home.name.length > 9 ? " is-long" : ""}">${escapeHtml(home.name)}</strong><small>${home.wins}-${home.losses}</small></div>${teamLogo(home, "simcast-team-logo")}</div>
      </section>
      <section class="simcast-period-strip card" id="simcast-period-scores">${simcastPeriodScores(state, away, home)}</section>
      <div class="simcast-progress"><span id="simcast-progress" style="width:${progress}%"></span></div>
      <section class="simcast-body">
        <article class="card simcast-feed-panel" style="${simcastMatchupVars(away, home)}"><header><div><span>PLAY-BY-PLAY</span><strong>GAME FEED</strong></div><small id="simcast-possession">${state.completed ? "Final result" : "Live updates"}</small></header><div class="simcast-feed" id="simcast-feed">${feed.map(simcastFeedRow).join("") || '<div class="simcast-feed-empty">Opening tip is moments away.</div>'}</div></article>
        <aside class="simcast-side-panel" style="${simcastMatchupVars(away, home)}">
          <section class="card simcast-comparison" id="simcast-comparison">${simcastComparison(state)}</section>
          <section class="card simcast-leaders"><span>PLAYERS TO WATCH</span><strong>IMPACT LEADERS</strong>${simcastLeader(away)}${simcastLeader(home)}</section>
        </aside>
      </section>
      ${state.completed ? "" : simcastCoachingPanel(state)}
      <section class="card simcast-live-box" id="simcast-live-box-score" style="${simcastMatchupVars(away, home)}">${simcastLiveBoxScore(state)}</section>
      <footer class="simcast-controls card">
        <div class="simcast-speed"><span>SPEED</span>${[0.5, 1, 2, 4].map((speed) => `<button class="${state.speed === speed ? "active" : ""}" data-simcast-speed="${speed}" ${state.completed ? "disabled" : ""}>${speed}X</button>`).join("")}</div>
        <div class="actions">${state.completed ? '<button class="btn primary" data-simcast-action="exit">View Box Score</button>' : `<button class="btn" data-simcast-action="pause">${state.paused ? "Resume" : "Pause"}</button><button class="btn" data-simcast-action="next-period">Sim To Next ${state.period >= 4 ? "Period" : "Quarter"}</button><button class="btn primary" data-simcast-action="finish">Sim To End</button>`}</div>
      </footer>
    </section>`;
}

function simcastPeriodLabel(period) {
  return period <= 4 ? `Q${period}` : `OT${period - 4}`;
}

function simcastTeamVars(team) {
  const theme = teamThemes[team?.id] || teamThemes.bos;
  return `--side-primary:${theme.primary};--side-secondary:${theme.secondary};--side-accent:${theme.accent || theme.secondary}`;
}

function simcastMatchupVars(away, home) {
  const a = teamThemes[away?.id] || teamThemes.bos;
  const h = teamThemes[home?.id] || teamThemes.bos;
  return `--away-primary:${a.primary};--away-secondary:${a.secondary};--home-primary:${h.primary};--home-secondary:${h.secondary}`;
}

function simcastPeriodScores(state, away, home) {
  const periods = state.periodScores || [];
  const displayedPeriods = Math.max(4, periods.length);
  const headings = Array.from({ length: displayedPeriods }, (_, index) => `<span class="${index + 1 === state.period && !state.completed ? "live" : index + 1 > state.period ? "future" : ""}">${simcastPeriodLabel(index + 1)}</span>`).join("");
  const cells = (side) => Array.from({ length: displayedPeriods }, (_, index) => { const period = periods[index]; return `<b class="${index + 1 === state.period && !state.completed ? "live" : ""}${period ? "" : " future"}">${period ? period[side] : "—"}</b>`; }).join("");
  const teamCell = (team) => `<strong class="simcast-period-team" style="${simcastTeamVars(team)}">${teamLogo(team, "simcast-period-logo")}<span><b>${escapeHtml(team.abbr)}</b><small>${team.wins}-${team.losses}</small></span></strong>`;
  const margin = state.awayScore - state.homeScore;
  const marginCell = (side) => { const value = side === "away" ? margin : -margin; return `<b class="simcast-margin ${value > 0 ? "positive" : value < 0 ? "negative" : "even"}">${value > 0 ? "+" : ""}${value}</b>`; };
  return `<div class="simcast-period-head"><strong>MATCHUP</strong>${headings}<span>MARGIN</span><strong>TOTAL</strong></div><div class="${state.awayScore > state.homeScore ? "leading" : ""}" style="${simcastTeamVars(away)}">${teamCell(away)}${cells("away")}${marginCell("away")}<strong>${state.awayScore}</strong></div><div class="${state.homeScore > state.awayScore ? "leading" : ""}" style="${simcastTeamVars(home)}">${teamCell(home)}${cells("home")}${marginCell("home")}<strong>${state.homeScore}</strong></div>`;
}

function simcastCoachingPanel(state) {
  const side = state.userSide;
  const team = state.teams[side];
  const lineup = new Set(state.lineups[side] || []);
  const onCourt = state.boxScore[side].filter((line) => lineup.has(line.playerId));
  const bench = state.boxScore[side].filter((line) => !lineup.has(line.playerId) && !line.injured && !line.fouledOut);
  const plan = state.strategies[side];
  return `<section class="card simcast-coaching"><header><div><span>COACHING CONTROLS</span><strong>${escapeHtml(team.abbr)} LIVE ADJUSTMENTS</strong></div><button class="btn" data-simcast-coach="timeout" ${state.timeouts[side] <= 0 ? "disabled" : ""}>Timeout (${state.timeouts[side]})</button></header>
    <div class="simcast-coaching-grid">
      <div class="simcast-strategy-controls">${simcastStrategySelect("Pace", "pace", plan.pace, ["slow", "balanced", "fast"])}${simcastStrategySelect("Offense", "offense", plan.offense, ["balanced", "rim", "perimeter", "stars", "ball movement"])}${simcastStrategySelect("Defense", "defense", plan.defense, ["drop", "switch", "pressure", "zone"])}</div>
      <div class="simcast-lineup-presets"><span>QUICK LINEUPS</span>${["best", "shooting", "defense", "bench"].map((preset) => `<button class="btn" data-simcast-preset="${preset}">${preset}</button>`).join("")}</div>
      <div class="simcast-substitution"><label><span>SUB OUT</span><select id="simcast-sub-out">${onCourt.map((line) => `<option value="${escapeHtml(line.playerId)}">${escapeHtml(line.name)} (${line.pts} PTS)</option>`).join("")}</select></label><label><span>SUB IN</span><select id="simcast-sub-in">${bench.map((line) => `<option value="${escapeHtml(line.playerId)}">${escapeHtml(line.name)}</option>`).join("")}</select></label><button class="btn primary" data-simcast-coach="substitute" ${bench.length ? "" : "disabled"}>Make Sub</button></div>
    </div>
  </section>`;
}

function simcastStrategySelect(label, key, value, options) {
  return `<label><span>${escapeHtml(label)}</span><select data-simcast-strategy="${key}">${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></label>`;
}

function simcastLiveBoxScore(state) {
  const away = getTeam(state.awayId);
  const home = getTeam(state.homeId);
  return `<header><div><span>LIVE BOX SCORE</span><strong>PLAYER STATS</strong></div><small>Updates after every play</small></header><div class="simcast-live-box-teams">${simcastLiveTeamTable(state, away, "away")}${simcastLiveTeamTable(state, home, "home")}</div>`;
}

function simcastLiveTeamTable(state, team, side) {
  const lines = state.boxScore?.[side] || [];
  const leaders = Math.max(0, ...lines.map((line) => line.pts));
  const onCourt = new Set(state.lineups?.[side] || []);
  return `<div class="simcast-live-team"><div class="simcast-live-team-name">${teamLogo(team, "simcast-box-logo")}<strong>${escapeHtml(team.abbr)}</strong><small>${team.wins}-${team.losses}</small><span>${side === "away" ? state.awayScore : state.homeScore} PTS</span></div><div class="simcast-box-scroll"><table><thead><tr><th>PLAYER</th><th>MIN</th><th>FG</th><th>3PT</th><th>FT</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TO</th><th>PF</th><th>+/-</th></tr></thead><tbody>${lines.map((line) => `<tr class="${line.injured ? "injured " : line.fouledOut ? "fouled-out " : ""}${onCourt.has(line.playerId) ? "on-court " : ""}${leaders > 0 && line.pts === leaders ? "team-leader" : ""}"><td><strong>${escapeHtml(line.name)}</strong><small>${escapeHtml(line.injured ? "INJURED" : line.fouledOut ? "FOULED OUT" : line.pos)}</small></td><td>${Math.round(line.seconds / 60)}</td><td>${line.fgm}-${line.fga}</td><td>${line.threePm}-${line.threePa}</td><td>${line.ftm}-${line.fta}</td><td><b>${line.pts}</b></td><td>${line.reb}</td><td>${line.ast}</td><td>${line.stl}</td><td>${line.blk}</td><td>${line.tov}</td><td>${line.pf}</td><td>${line.plusMinus > 0 ? "+" : ""}${line.plusMinus}</td></tr>`).join("")}</tbody></table></div></div>`;
}

function simcastFeedRow(event) {
  const tone = /timeout/i.test(event.text) ? "timeout" : /foul|free throw/i.test(event.text) ? "foul" : /turns? (?:the ball )?over|turnover|strips/i.test(event.text) ? "turnover" : /makes|hits|finishes|dunk|layup|jumper|three/i.test(event.text) ? "score" : "play";
  const icon = tone === "score" ? "+" : tone === "foul" ? "!" : tone === "turnover" ? "↔" : tone === "timeout" ? "T" : "·";
  return `<div class="simcast-feed-row ${event.side || "period"} feed-${tone}"><i>${icon}</i><b>${event.clock}</b><span>${simcastPeriodLabel(event.period || event.quarter)}</span><p>${escapeHtml(event.text)}</p>${event.side ? `<strong>${event.awayScore}-${event.homeScore}</strong>` : ""}</div>`;
}

function simcastStatRow(label, away, home) {
  return `<div class="simcast-stat-row"><b>${away}</b><span>${escapeHtml(label)}</span><b>${home}</b></div>`;
}

function simcastComparison(state) {
  const away = getTeam(state.awayId);
  const home = getTeam(state.homeId);
  return `<span>TEAM COMPARISON</span><strong>LIVE STATS</strong><div class="simcast-comparison-teams"><b title="${escapeHtml(away?.name || away?.abbr || "Away team")}">${teamLogo(away, "simcast-comparison-logo")}</b><span>LIVE</span><b title="${escapeHtml(home?.name || home?.abbr || "Home team")}">${teamLogo(home, "simcast-comparison-logo")}</b></div>${simcastStatRow("Points", state.awayScore, state.homeScore)}${simcastStatRow("Projected", simcastProjectedScore(state, "away"), simcastProjectedScore(state, "home"))}${simcastStatRow("Team fouls", state.teamFouls.away, state.teamFouls.home)}${simcastStatRow("Bonus", state.teamFouls.home >= 5 ? "YES" : "-", state.teamFouls.away >= 5 ? "YES" : "-")}${simcastStatRow("Timeouts", state.timeouts.away, state.timeouts.home)}${simcastStatRow("Possessions", state.teamStats.away.possessions, state.teamStats.home.possessions)}`;
}

function simcastProjectedScore(state, side) {
  const period = state.period || state.quarter;
  const periodLength = period <= 4 ? 720 : 300;
  const completedQuarters = Math.max(.25, (Math.min(period, 5) - 1) + (periodLength - simcastClockSeconds(state.clock)) / periodLength);
  const score = side === "home" ? state.homeScore : state.awayScore;
  return state.completed ? score : Math.min(160, Math.round(score / completedQuarters * 4));
}

function simcastClockSeconds(clock) {
  const [minutes, seconds] = String(clock).split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

function simcastLeader(team) {
  const leader = bestPlayer(team.id);
  return `<div class="simcast-featured-leader" data-view-player="${escapeHtml(leader?.id || "")}">${playerHeadshot(leader, "simcast-leader-headshot")}<span><em>${escapeHtml(team.abbr)} FEATURED</em><b>${escapeHtml(leader?.name || "Team Leader")}</b><small>${escapeHtml(leader?.pos || "-")} · ${leader?.ovr || "-"} OVR · ${leader?.pot || "-"} POT</small></span><strong><b>${leader?.ovr || "-"}</b><small>OVR</small></strong></div>`;
}

function scheduleSimcastTick() {
  clearTimeout(simcastTimer);
  if (!simcastState || simcastState.paused || simcastState.completed) return;
  const delay = simcastState.speed === 4 ? 100 : simcastState.speed === 2 ? 350 : simcastState.speed === 1 ? 900 : 1800;
  simcastTimer = setTimeout(runSimcastTick, delay);
}

function runSimcastTick() {
  if (!simcastState || simcastState.paused || simcastState.completed) return;
  window.NBASimulationEngine.stepPossession(simcastState);
  updateSimcastDom();
  if (simcastState.completed) completeSimcast();
  else scheduleSimcastTick();
}

function updateSimcastDom() {
  if (!simcastState) return;
  const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
  setText("#simcast-away-score", simcastState.awayScore);
  setText("#simcast-home-score", simcastState.homeScore);
  [["#simcast-away-score", simcastState.awayScore], ["#simcast-home-score", simcastState.homeScore]].forEach(([selector, score]) => {
    const element = document.querySelector(selector);
    if (element) element.className = `score-digits-${String(score).length}`;
  });
  setText("#simcast-period", simcastPeriodLabel(simcastState.period));
  setText("#simcast-clock", simcastState.clock);
  setText("#simcast-possession-team", simcastState.completed ? "GAME COMPLETE" : `${simcastState.teams[simcastState.possessionSide]?.abbr || ""} POSSESSION`);
  const progress = document.querySelector("#simcast-progress");
  if (progress) {
    const regulationProgress = ((Math.min(simcastState.period, 4) - 1) * 720 + (720 - Math.min(720, simcastState.seconds))) / 2880;
    progress.style.width = `${Math.min(100, Math.round(regulationProgress * 100))}%`;
  }
  const feed = document.querySelector("#simcast-feed");
  if (feed) feed.innerHTML = simcastState.processedEvents.slice(-16).reverse().map(simcastFeedRow).join("");
  const boxScore = document.querySelector("#simcast-live-box-score");
  if (boxScore) boxScore.innerHTML = simcastLiveBoxScore(simcastState);
  const periodScores = document.querySelector("#simcast-period-scores");
  if (periodScores) periodScores.innerHTML = simcastPeriodScores(simcastState, getTeam(simcastState.awayId), getTeam(simcastState.homeId));
  const comparison = document.querySelector("#simcast-comparison");
  if (comparison) comparison.innerHTML = simcastComparison(simcastState);
}

function toggleSimcastPause() {
  if (!simcastState || simcastState.completed) return;
  simcastState.paused = !simcastState.paused;
  render();
  if (!simcastState.paused) scheduleSimcastTick();
}

function setSimcastSpeed(speed) {
  if (!simcastState || ![0.5, 1, 2, 4].includes(speed)) return;
  simcastState.speed = speed;
  render();
  scheduleSimcastTick();
}

function finishSimcastImmediately() {
  if (!simcastState || simcastState.completed) return;
  clearTimeout(simcastTimer);
  window.NBASimulationEngine.runGameToCompletion(simcastState);
  completeSimcast();
}

function finishSimcastPeriod() {
  if (!simcastState || simcastState.completed) return;
  clearTimeout(simcastTimer);
  const startingPeriod = simcastState.period;
  while (!simcastState.completed && simcastState.period === startingPeriod) window.NBASimulationEngine.stepPossession(simcastState);
  if (simcastState.completed) completeSimcast();
  else { simcastState.paused = true; render(); }
}

function completeSimcast() {
  if (!simcastState || simcastState.finalized) return;
  clearTimeout(simcastTimer);
  const game = save.schedule.find((candidate) => candidate.id === simcastState.gameId);
  if (!game || game.played) return;
  finalizePossessionGame(game, simcastState, true, true, true);
  simulateLeagueGamesForDate(game.date);
  save.timelineDate = game.date;
  selectedGameId = game.id;
  calendarMonth = game.date.slice(0, 7);
  simcastState.homeScore = game.homeScore;
  simcastState.awayScore = game.awayScore;
  simcastState.clock = "0:00";
  simcastState.completed = true;
  simcastState.paused = false;
  persist();
  render();
}

function exitSimcast() {
  clearTimeout(simcastTimer);
  simcastTimer = null;
  simcastState = null;
  active = "play";
  render();
}

function ordinal(number) {
  return number === 1 ? "1st" : number === 2 ? "2nd" : number === 3 ? "3rd" : `${number}th`;
}

function simulateScheduledGame(gameId, detailed) {
  const lineup = rotationStatus(save.activeTeamId);
  if (!lineup.valid) {
    save.messages.push(`Game blocked: ${lineup.message}`);
    active = "inventory";
    render();
    return;
  }
  const schedule = [...save.schedule].sort((a, b) => a.date.localeCompare(b.date));
  const targetIndex = schedule.findIndex((candidate) => candidate.id === gameId);
  const game = schedule[targetIndex];
  if (!game || game.played) return;
  const gamesToProcess = schedule.slice(0, targetIndex + 1).filter((candidate) => !candidate.played);
  let processed = 0;
  for (const candidate of gamesToProcess) {
    simulateGameResult(candidate, detailed && candidate.id === game.id, candidate.id === game.id, true);
    simulateLeagueGamesForDate(candidate.date);
    save.timelineDate = candidate.date;
    processed += 1;
    if (processed < gamesToProcess.length && shouldStopSimulation()) break;
  }
  if (processed > 1) {
    save.messages.push(`Advanced the season timeline through ${formatGameDate(save.timelineDate)} and simulated ${processed - 1} prior game${processed - 1 === 1 ? "" : "s"}.`);
  }
  const next = schedule.find((candidate) => !candidate.played);
  const completedTarget = game.played;
  selectedGameId = detailed && completedTarget ? game.id : next?.id || game.id;
  calendarMonth = (detailed && completedTarget ? game.date : next?.date || save.timelineDate).slice(0, 7);
  persist();
  render();
}

function shouldStopSimulation() {
  const unread = save.notifications.filter((item) => !item.read);
  if (save.automation.stopForInjury && unread.some((item) => item.type === "Medical" && item.priority === "urgent")) return true;
  if (save.automation.stopForComplaint && unread.some((item) => item.type === "Locker Room" && item.priority === "urgent")) return true;
  if (save.automation.stopForTradeOffer && unread.some((item) => item.type === "Trade Offer")) return true;
  return pendingFrontOfficeDecisions().length > 0;
}

function simulateCalendarControl(control) {
  const schedule = [...save.schedule].sort((a, b) => a.date.localeCompare(b.date));
  const next = schedule.find((game) => !game.played);
  if (!next) return;
  const mandatory = pendingFrontOfficeDecisions();
  if (mandatory.length && control !== "next") {
    save.messages.push(`Simulation stopped: ${mandatory[0]}.`);
    addNotification("Required Decision", mandatory[0], "urgent");
    active = "transactions";
    render();
    return;
  }
  let target = next;
  if (control === "week") {
    const end = addDays(next.date, 7);
    target = schedule.filter((game) => !game.played && game.date <= end).at(-1) || next;
  }
  if (control === "month") {
    const end = addDays(next.date, 30);
    target = schedule.filter((game) => !game.played && game.date <= end).at(-1) || next;
  }
  if (control === "decision") {
    const deadline = nextTransactionEvent();
    const complaint = teamPlayers(save.activeTeamId).some((player) => player.dissatisfaction?.level >= 2);
    if (complaint) { active = "locker"; render(); return; }
    if (deadline) target = schedule.filter((game) => !game.played && game.date <= deadline.date).at(-1) || next;
  }
  simulateScheduledGame(target.id, false);
}

function exportCareerBackup() {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), app: "NBA Manager", save }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${slug(save.careerName || "nba-manager-career")}-${save.season}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  save.messages.push("Career backup exported.");
}

function importCareerBackup(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const candidate = parsed.save || parsed;
      if (!candidate?.teams || !candidate?.players || !candidate?.season) throw new Error("Missing career data");
      save = normalizeSave(candidate);
      ensureCareerSystems();
      save.messages.push("Career backup imported and migrated.");
      await persist();
      active = "dashboard";
      render();
    } catch (error) {
      save.messages.push(`Backup import failed: ${error.message}`);
      render();
    }
  };
  reader.readAsText(file);
}

function hireStaffMember(staffId) {
  const staff = save.staffMarket.find((candidate) => candidate.id === staffId && candidate.available);
  if (!staff || staff.salary > save.gmCareer.finances.staffBudget) return;
  const coach = coachingProfile(save.activeTeamId);
  const key = staff.specialty.toLowerCase();
  if (key === "tactics") coach.tactics = Math.max(coach.tactics, staff.rating);
  if (key === "development") coach.development = Math.max(coach.development, staff.rating);
  if (key === "medical") coach.medical = Math.max(coach.medical, staff.rating);
  if (key === "scouting") {
    const department = scoutingDepartment(save.activeTeamId);
    department.college = Math.max(department.college, staff.rating);
    department.analytics = Math.max(department.analytics, staff.rating - 2);
  }
  save.gmCareer.finances.staffBudget = roundMoney(save.gmCareer.finances.staffBudget - staff.salary);
  staff.available = false;
  addTransaction("Staff", `${teamName(save.activeTeamId)} hired ${staff.name} as a ${staff.specialty} specialist.`);
}

function simulateSeasonEvent(eventId) {
  const event = save.seasonEvents.find((candidate) => candidate.id === eventId);
  if (!event || event.played) return;
  const lineup = rotationStatus(save.activeTeamId);
  if (!lineup.valid) {
    save.messages.push(`Event blocked: ${lineup.message}`);
    active = "inventory";
    render();
    return;
  }
  const priorGames = [...save.schedule]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((game) => !game.played && game.date <= event.date);
  priorGames.forEach((game) => {
    simulateGameResult(game, false, false, true);
    simulateLeagueGamesForDate(game.date);
  });
  save.timelineDate = event.date;
  event.played = true;
  event.result = simulateAllStarEvent(event);
  save.messages.push(`${event.label}: ${event.result}`);
  selectedEventId = event.id;
  calendarMonth = event.date.slice(0, 7);
  persist();
  render();
}

function advanceToTransactionEvent(eventId) {
  const event = save.transactionEvents.find((candidate) => candidate.id === eventId);
  if (!event || event.date < currentLeagueDate()) return;
  const games = [...save.schedule]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((game) => !game.played && game.date <= event.date);
  games.forEach((game) => {
    simulateGameResult(game, false, false, true);
    simulateLeagueGamesForDate(game.date);
  });
  save.timelineDate = event.date;
  save.messages.push(`${event.label} reached: ${event.impact}`);
  selectedTransactionId = event.id;
  calendarMonth = event.date.slice(0, 7);
  persist();
  render();
}

function simulateAllStarEvent(event) {
  const random = seededRandom(`${save.season}-${event.id}`);
  const eligible = [...save.players].filter((player) => player.injury <= 0);
  if (event.type === "rising-stars") {
    const candidates = eligible.filter((player) => player.age <= 24).sort((a, b) => b.pot - a.pot).slice(0, 20);
    const winner = weightedEventWinner(candidates, (player) => player.pot + player.ovr, random);
    return `${winner.name} won MVP as Team Stars defeated Team Futures ${Math.round(106 + random() * 14)}-${Math.round(96 + random() * 12)}.`;
  }
  if (event.type === "skills") {
    const winner = weightedEventWinner(eligible.sort((a, b) => b.pass - a.pass).slice(0, 16), (player) => player.pass + player.stamina, random);
    return `${winner.name} won the Skills Challenge.`;
  }
  if (event.type === "three-point") {
    const winner = weightedEventWinner(eligible.sort((a, b) => b.three - a.three).slice(0, 16), (player) => player.three * 1.4 + player.ovr, random);
    return `${winner.name} won the Three-Point Contest with ${Math.round(24 + random() * 8)} points in the final round.`;
  }
  if (event.type === "dunk") {
    const winner = weightedEventWinner(eligible.sort((a, b) => b.rim - a.rim).slice(0, 16), (player) => player.rim * 1.4 + player.pot, random);
    return `${winner.name} won the Dunk Contest with a final score of ${Math.round(94 + random() * 6)}.`;
  }
  const east = eligible.filter((player) => getTeam(player.teamId)?.conf === "East").sort((a, b) => b.ovr - a.ovr).slice(0, 12);
  const west = eligible.filter((player) => getTeam(player.teamId)?.conf === "West").sort((a, b) => b.ovr - a.ovr).slice(0, 12);
  const eastScore = Math.round(145 + random() * 25);
  let westScore = Math.round(145 + random() * 25);
  if (eastScore === westScore) westScore += 2;
  const winningRoster = eastScore > westScore ? east : west;
  const mvp = weightedEventWinner(winningRoster, (player) => player.ovr * 1.5 + player.rim + player.three, random);
  const winnerScore = Math.max(eastScore, westScore);
  const loserScore = Math.min(eastScore, westScore);
  return `${eastScore > westScore ? "East" : "West"} won ${winnerScore}-${loserScore}. ${mvp.name} was All-Star MVP.`;
}

function weightedEventWinner(players, score, random) {
  if (!players.length) return { name: "League Select" };
  const ranked = players.map((player) => ({ player, value: score(player) * (0.85 + random() * 0.3) })).sort((a, b) => b.value - a.value);
  return ranked[0].player;
}

function simulateGameResult(game, detailed, announce, userGame) {
  const state = createPossessionGameState(game);
  window.NBASimulationEngine.runGameToCompletion(state);
  return finalizePossessionGame(game, state, detailed, announce, userGame);
}

function finalizePossessionGame(game, state, detailed, announce, userGame) {
  const home = getTeam(game.home);
  const away = getTeam(game.away);
  const homeProfile = teamGameProfile(home.id, away.id, true);
  const awayProfile = teamGameProfile(away.id, home.id, false);
  const engineResult = window.NBASimulationEngine.toResult(state);
  const homeScore = engineResult.homeScore;
  const awayScore = engineResult.awayScore;
  const quarters = engineResult.periodScores;
  game.played = true;
  game.homeScore = homeScore;
  game.awayScore = awayScore;
  game.quarters = detailed ? quarters : null;
  game.periodScores = quarters;
  game.overtimePeriods = engineResult.overtimePeriods;
  game.simulationVersion = engineResult.simulationVersion;
  const winnerId = homeScore >= awayScore ? home.id : away.id;
  const loserId = winnerId === home.id ? away.id : home.id;
  const winnerProfile = winnerId === home.id ? homeProfile : awayProfile;
  const loserProfile = winnerId === home.id ? awayProfile : homeProfile;
  game.summary = createGameSummary(winnerId, loserId, winnerProfile, loserProfile, homeScore, awayScore);
  if (homeScore >= awayScore) {
    home.wins += 1;
    away.losses += 1;
    if (userGame) save.careerScore += home.id === save.activeTeamId ? 100 : 25;
  } else {
    away.wins += 1;
    home.losses += 1;
    if (userGame) save.careerScore += away.id === save.activeTeamId ? 100 : 25;
  }
  const result = {
    gameId: game.id, date: game.date, home: home.id, away: away.id, homeScore, awayScore,
    quarters: detailed ? quarters : null, periodScores: quarters, overtimePeriods: engineResult.overtimePeriods,
    simulationVersion: engineResult.simulationVersion, teamStats: engineResult.teamStats,
    playerStats: engineResult.playerStats, injuries: engineResult.injuries,
    summary: game.summary, pace: engineResult.pace
  };
  updatePlayerSeasonStats(result);
  updateCareerStats(result);
  advancePlayerHealth([home.id, away.id], result.playerStats, false);
  applySimulationInjuries(result);
  updatePlayerMorale(home.id, homeScore >= awayScore);
  updatePlayerMorale(away.id, awayScore > homeScore);
  incrementTwoWayGameUsage(home.id);
  incrementTwoWayGameUsage(away.id);
  if (userGame) {
    save.xp += save.mode === "GM" ? 20 : 35;
    save.results.push(result);
  }
  if (!Array.isArray(save.leagueResults)) save.leagueResults = [];
  save.leagueResults.push({ ...result, playerStats: null });
  if (announce) save.messages.push(`Final: ${away.abbr} ${awayScore} at ${home.abbr} ${homeScore}`);
  if (userGame) processAiTransactionsForDate(game.date);
  if (userGame && game.nbaCup === "Championship" && (home.id === save.activeTeamId ? homeScore > awayScore : awayScore > homeScore)) {
    save.messages.push(`${activeTeam().city} ${activeTeam().name} won the NBA Cup.`);
  }
  state.finalized = true;
  return result;
}

function teamGameProfile(teamId, opponentId, homeCourt) {
  const team = getTeam(teamId);
  const plan = gamePlan(teamId);
  const opponentPlan = gamePlan(opponentId);
  const players = rotationPlayers(teamId).filter((player) => player.minutes > 0 && isPlayerGameEligible(player).ok);
  const minutes = players.reduce((sum, player) => sum + player.minutes, 0) || 240;
  const weighted = (field) => players.reduce((sum, player) => sum + Number(player[field] || player.ovr) * player.minutes, 0) / minutes;
  const talent = teamRating(team);
  const offenseSkill = plan.offense === "perimeter" ? weighted("three") : plan.offense === "rim" ? weighted("rim") : plan.offense === "ball movement" ? weighted("pass") : weighted("ovr");
  const defenseSkill = weighted("def");
  const stamina = weighted("stamina");
  const fit = gamePlanFit(teamId, plan);
  const coach = coachingProfile(teamId);
  const chemistry = lockerRoom(teamId).chemistry;
  const tactical = tacticalMatchupScore(plan, opponentPlan);
  const morale = players.reduce((sum, player) => sum + Number(player.morale || 75) * player.minutes, 0) / minutes;
  const homeBonus = homeCourt ? 1.8 : 0;
  const closingBonus = plan.closing === "offense" ? (weighted("three") + weighted("pass") - 145) / 700 : plan.closing === "defense" ? (defenseSkill - 72) / 350 : plan.closing === "shooting" ? (weighted("three") - 72) / 350 : 0;
  const staggerBonus = plan.stagger === "always one star" && players.some((player) => player.ovr >= 84) ? .008 : plan.stagger === "second unit" ? -.004 : 0;
  const minutesLimitPenalty = plan.minutesLimit === "none" ? 0 : Math.max(0, 32 - Number(plan.minutesLimit)) * .0015;
  const efficiency = Math.max(.92, Math.min(1.25, .92 + talent / 500 + offenseSkill / 900 + defenseSkill / 1800 + fit / 2200 + chemistry / 3000 + morale / 5000 + tactical / 1800 + (coach.adaptability || 70) / 10000 + homeBonus / 100 + closingBonus + staggerBonus - minutesLimitPenalty));
  let possessions = 97;
  if (plan.pace === "fast") possessions += 6;
  if (plan.pace === "slow") possessions -= 5;
  if (plan.transition === "run") possessions += 3;
  if (plan.load !== "none") possessions -= { light: 1, moderate: 2, aggressive: 4 }[plan.load] || 0;
  possessions += (team.pace - 60) * .2 + (stamina - 75) * .06;
  return { talent, offenseSkill, defenseSkill, fit, chemistry, morale, tactical, homeBonus, efficiency, possessions, plan };
}

function tacticalMatchupScore(plan, opponent) {
  let score = 0;
  if (opponent.offense === "rim" && plan.defense === "drop") score += 5;
  if (opponent.offense === "perimeter" && plan.defense === "switch") score += 5;
  if (opponent.offense === "ball movement" && plan.defense === "pressure") score += 3;
  if (opponent.transition === "run" && plan.rebounding === "protect transition") score += 4;
  if (plan.rebounding === "crash glass" && opponent.transition === "run") score -= 4;
  if (plan.pace === "fast" && opponent.pace === "slow") score += 2;
  return score;
}

function createGameSummary(winnerId, loserId, winner, loser, homeScore, awayScore) {
  const margin = Math.abs(homeScore - awayScore);
  const factors = [];
  if (winner.tactical - loser.tactical >= 3) factors.push("Tactical edge");
  if (winner.chemistry - loser.chemistry >= 6) factors.push("Better chemistry");
  if (winner.fit - loser.fit >= 5) factors.push("Stronger system fit");
  if (winner.talent - loser.talent >= 2) factors.push("Talent advantage");
  if (winner.homeBonus > loser.homeBonus) factors.push("Home court");
  if (!factors.length) factors.push("Execution in a close matchup");
  return { headline: `${teamName(winnerId)} controlled a ${margin >= 15 ? "decisive" : margin >= 7 ? "solid" : "tight"} win`, explanation: `${teamName(winnerId)} played at roughly ${Math.round(winner.possessions)} possessions with ${winner.fit}% system fit and ${winner.chemistry}% chemistry.`, factors };
}

function simulateLeagueGamesForDate(date) {
  save.leagueSchedule
    .filter((game) => game.date === date && !game.played)
    .forEach((game) => simulateGameResult(game, false, false, false));
}

function startPostseason() {
  if (save.postseason) return;
  const lineup = rotationStatus(save.activeTeamId);
  if (!lineup.valid) {
    save.messages.push(`Postseason blocked: ${lineup.message}`);
    active = "inventory";
    render();
    return;
  }
  [...save.schedule]
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((game) => !game.played)
    .forEach((game) => {
      simulateGameResult(game, false, false, true);
      simulateLeagueGamesForDate(game.date);
      save.timelineDate = game.date;
    });
  const east = postseasonConferenceField("East");
  const west = postseasonConferenceField("West");
  save.postseason = {
    season: save.season,
    round: "firstRound",
    playIn: { East: east.playIn, West: west.playIn },
    firstRound: [...createFirstRoundSeries("East", east.seeds), ...createFirstRoundSeries("West", west.seeds)],
    semifinals: [],
    conferenceFinals: [],
    finals: null,
    championId: null
  };
  save.phase = "Playoffs";
  save.timelineDate = `${save.season + 1}-04-14`;
  save.messages.push("The NBA Playoffs are set. The Play-In Tournament determined seeds 7 and 8 in each conference.");
  persist();
  render();
}

function postseasonConferenceField(conf) {
  const standings = conferenceStandings(conf);
  const bySeed = Object.fromEntries(standings.map((entry) => [entry.seed, entry.team.id]));
  const sevenEight = simulatePostseasonGame(bySeed[8], bySeed[7], `play-in-${save.season}-${conf}-7-8`, conf);
  const nineTen = simulatePostseasonGame(bySeed[10], bySeed[9], `play-in-${save.season}-${conf}-9-10`, conf);
  const sevenSeed = postseasonGameWinner(sevenEight);
  const finalHome = postseasonGameLoser(sevenEight);
  const finalAway = postseasonGameWinner(nineTen);
  const finalGame = simulatePostseasonGame(finalAway, finalHome, `play-in-${save.season}-${conf}-8`, conf);
  return {
    playIn: [sevenEight, nineTen, finalGame],
    seeds: { 1: bySeed[1], 2: bySeed[2], 3: bySeed[3], 4: bySeed[4], 5: bySeed[5], 6: bySeed[6], 7: sevenSeed, 8: postseasonGameWinner(finalGame) }
  };
}

function simulatePostseasonGame(awayId, homeId, seed, conf = "") {
  const game = { id: seed, away: awayId, home: homeId, date: currentLeagueDate() };
  const state = createPossessionGameState(game);
  window.NBASimulationEngine.runGameToCompletion(state);
  const engineResult = window.NBASimulationEngine.toResult(state);
  const result = { gameId: seed, date: currentLeagueDate(), away: awayId, home: homeId, awayScore: engineResult.awayScore, homeScore: engineResult.homeScore, conf, simulationVersion: engineResult.simulationVersion, periodScores: engineResult.periodScores, overtimePeriods: engineResult.overtimePeriods, teamStats: engineResult.teamStats, playerStats: engineResult.playerStats, injuries: engineResult.injuries, pace: engineResult.pace };
  updatePlayerSeasonStats(result, true);
  updateCareerStats(result);
  advancePlayerHealth([homeId, awayId], result.playerStats, false);
  applySimulationInjuries(result);
  updatePlayerMorale(homeId, result.homeScore > result.awayScore);
  updatePlayerMorale(awayId, result.awayScore > result.homeScore);
  incrementTwoWayGameUsage(homeId);
  incrementTwoWayGameUsage(awayId);
  return [awayId, homeId].includes(save.activeTeamId) ? result : { ...result, playerStats: null };
}

function postseasonGameWinner(game) {
  return game.homeScore > game.awayScore ? game.home : game.away;
}

function postseasonGameLoser(game) {
  return game.homeScore > game.awayScore ? game.away : game.home;
}

function createFirstRoundSeries(conf, seeds) {
  return [[1, 8], [4, 5], [3, 6], [2, 7]].map(([highSeed, lowSeed], index) => createPostseasonSeries(`${conf.toLowerCase()}-r1-${index + 1}`, conf, "firstRound", seeds[highSeed], highSeed, seeds[lowSeed], lowSeed));
}

function createPostseasonSeries(id, conf, round, highTeamId, highSeed, lowTeamId, lowSeed) {
  return { id: `ps-${save.season}-${id}`, conf, round, highTeamId, highSeed, lowTeamId, lowSeed, highWins: 0, lowWins: 0, games: [], winnerId: null };
}

function postseasonSeriesForRound(round) {
  if (!save.postseason) return [];
  if (round === "finals") return save.postseason.finals ? [save.postseason.finals] : [];
  return save.postseason[round] || [];
}

function simulatePostseasonSeries(seriesId) {
  const series = postseasonSeriesForRound(save.postseason?.round).find((candidate) => candidate.id === seriesId);
  if (!series || series.winnerId) return;
  while (!series.winnerId) simulatePostseasonSeriesGame(series);
  save.messages.push(`${teamName(series.winnerId)} won its ${postseasonRoundLabel(series.round).toLowerCase()} series ${Math.max(series.highWins, series.lowWins)}-${Math.min(series.highWins, series.lowWins)}.`);
  advancePostseasonBracket();
  persist();
  render();
}

function simulatePostseasonSeriesGame(series) {
  const gameNumber = series.games.length + 1;
  const highHome = [1, 2, 5, 7].includes(gameNumber);
  const game = simulatePostseasonGame(highHome ? series.lowTeamId : series.highTeamId, highHome ? series.highTeamId : series.lowTeamId, `${series.id}-game-${gameNumber}`, series.conf);
  series.games.push(game);
  if (postseasonGameWinner(game) === series.highTeamId) series.highWins += 1;
  else series.lowWins += 1;
  if (series.highWins === 4 || series.lowWins === 4) series.winnerId = series.highWins === 4 ? series.highTeamId : series.lowTeamId;
}

function simulatePostseasonRound() {
  postseasonSeriesForRound(save.postseason?.round).filter((series) => !series.winnerId).forEach((series) => {
    while (!series.winnerId) simulatePostseasonSeriesGame(series);
  });
  advancePostseasonBracket();
  persist();
  render();
}

function advancePostseasonBracket() {
  const postseason = save.postseason;
  if (!postseason) return;
  const current = postseasonSeriesForRound(postseason.round);
  if (!current.length || current.some((series) => !series.winnerId)) return;
  if (postseason.round === "firstRound") {
    postseason.semifinals = ["East", "West"].flatMap((conf) => {
      const series = postseason.firstRound.filter((item) => item.conf === conf);
      return [createSeriesFromWinners(`${conf.toLowerCase()}-semi-1`, conf, "semifinals", series[0], series[1]), createSeriesFromWinners(`${conf.toLowerCase()}-semi-2`, conf, "semifinals", series[2], series[3])];
    });
    postseason.round = "semifinals";
    return;
  }
  if (postseason.round === "semifinals") {
    postseason.conferenceFinals = ["East", "West"].map((conf) => {
      const series = postseason.semifinals.filter((item) => item.conf === conf);
      return createSeriesFromWinners(`${conf.toLowerCase()}-final`, conf, "conferenceFinals", series[0], series[1]);
    });
    postseason.round = "conferenceFinals";
    return;
  }
  if (postseason.round === "conferenceFinals") {
    postseason.finals = createSeriesFromWinners("nba-finals", "NBA", "finals", postseason.conferenceFinals[0], postseason.conferenceFinals[1]);
    postseason.round = "finals";
    return;
  }
  postseason.championId = postseason.finals.winnerId;
  postseason.round = "complete";
  save.phase = "Offseason";
  save.timelineDate = `${save.season + 1}-06-20`;
  const champion = getTeam(postseason.championId);
  save.messages.push(`${champion.city} ${champion.name} won the NBA championship.`);
  if (postseason.championId === save.activeTeamId) {
    save.careerScore += 5000;
    save.xp += 500;
  }
}

function createSeriesFromWinners(id, conf, round, first, second) {
  const firstSeed = first.winnerId === first.highTeamId ? first.highSeed : first.lowSeed;
  const secondSeed = second.winnerId === second.highTeamId ? second.highSeed : second.lowSeed;
  let highTeamId = first.winnerId;
  let highSeed = firstSeed;
  let lowTeamId = second.winnerId;
  let lowSeed = secondSeed;
  if (round === "finals") {
    const firstTeam = getTeam(first.winnerId);
    const secondTeam = getTeam(second.winnerId);
    const secondHasHome = secondTeam.wins > firstTeam.wins || (secondTeam.wins === firstTeam.wins && secondSeed < firstSeed);
    if (secondHasHome) [highTeamId, highSeed, lowTeamId, lowSeed] = [second.winnerId, secondSeed, first.winnerId, firstSeed];
  } else if (secondSeed < firstSeed) {
    [highTeamId, highSeed, lowTeamId, lowSeed] = [second.winnerId, secondSeed, first.winnerId, firstSeed];
  }
  return createPostseasonSeries(id, conf, round, highTeamId, highSeed, lowTeamId, lowSeed);
}

function advanceYear() {
  if (save.postseason?.championId || save.phase === "Offseason") beginOffseason();
  else {
    save.messages.push("The next league year begins only after the NBA Finals and offseason are complete.");
    render();
  }
}

function validateImport(text) {
  const report = document.querySelector("#import-report");
  try {
    const data = JSON.parse(text);
    const errors = [];
    if (!Array.isArray(data.teams)) errors.push("Missing teams array.");
    if (!Array.isArray(data.players)) errors.push("Missing players array.");
    report.innerHTML = errors.length
      ? errors.map((error) => `<div class="bad">${error}</div>`).join("")
      : `${metric("Status", '<span class="ok">valid</span>')}${metric("Teams", data.teams.length)}${metric("Players", data.players.length)}`;
  } catch {
    report.textContent = "Waiting for valid JSON.";
  }
}

function saveEditorPlayer() {
  const selected = save.players.find((player) => player.id === editorSelectedPlayerId);
  if (!selected) return;
  const previousName = selected.name;
  selected.name = document.querySelector("#editor-name")?.value.trim() || "Unnamed Player";
  selected.teamId = document.querySelector("#editor-team")?.value || selected.teamId;
  selected.age = editorNumber("editor-age", 18, 50, selected.age);
  selected.pos = document.querySelector("#editor-position")?.value.trim() || "G/F";
  selected.ovr = editorNumber("editor-overall", 25, 99, selected.ovr);
  selected.overall = selected.ovr;
  selected.pot = editorNumber("editor-potential", 25, 99, selected.pot);
  selected.morale = editorNumber("editor-morale", 0, 100, selected.morale);
  selected.minutes = editorNumber("editor-minutes", 0, 48, selected.minutes);
  selected.injury = editorNumber("editor-injury", 0, 82, selected.injury);
  save.messages.push(`League editor updated ${previousName}.`);
  syncTeamRosters();
}

function editorNumber(id, min, max, fallback) {
  const value = Number(document.querySelector(`#${id}`)?.value);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function syncTeamRosters() {
  save.teams.forEach((team) => {
    team.roster = save.players.filter((player) => player.teamId === team.id).map((player) => player.id);
  });
}

function initializeLeagueRotations(players) {
  const teamIds = [...new Set(players.map((player) => player.teamId).filter(Boolean))];
  teamIds.forEach((teamId) => setDefaultRotationForPlayers(players, teamId, false));
  return players;
}

function ensureTeamRotation(teamId) {
  const players = teamPlayers(teamId);
  const configured = players.some((player) => Number.isInteger(player.rotationOrder) || typeof player.starter === "boolean");
  if (!configured) setDefaultTeamRotation(teamId, false);
}

function setDefaultTeamRotation(teamId, force) {
  setDefaultRotationForPlayers(save.players, teamId, force);
}

function setDefaultRotationForPlayers(players, teamId, force) {
  const teamRoster = positionAwareDefaultRotationOrder(players.filter((player) => player.teamId === teamId));
  if (!teamRoster.length) return;
  const alreadyConfigured = teamRoster.some((player) => Number.isInteger(player.rotationOrder) || typeof player.starter === "boolean");
  if (alreadyConfigured && !force) return;
  const minutePlan = [34, 34, 32, 32, 30, 22, 20, 16, 12, 8];
  teamRoster.forEach((player, index) => {
    player.rotationOrder = index;
    player.activeRoster = force ? index < 13 : player.activeRoster ?? index < 13;
    player.starter = false;
    player.minutes = 0;
  });
  const available = teamRoster.filter((player) => player.injury <= 0 && isPlayerGameEligible(player).ok);
  available.forEach((player, index) => {
    player.minutes = minutePlan[index] || 0;
  });
  syncRotationStarters(teamId, teamRoster);
  rebalanceRotationMinutes(teamRoster);
}

function rebalanceRotationMinutes(players) {
  const available = players.filter((player) => player.injury <= 0 && isPlayerGameEligible(player).ok).sort((a, b) => a.rotationOrder - b.rotationOrder);
  if (!available.length) return;
  let difference = 240 - available.reduce((sum, player) => sum + player.minutes, 0);
  let index = 0;
  while (difference !== 0 && index < 1000) {
    const player = available[index % available.length];
    if (difference > 0 && player.minutes < 48) {
      player.minutes += 1;
      difference -= 1;
    } else if (difference < 0 && player.minutes > 0) {
      player.minutes -= 1;
      difference += 1;
    }
    index += 1;
  }
}

function rotationPlayers(teamId) {
  return teamPlayers(teamId).sort((a, b) => (a.rotationOrder ?? 999) - (b.rotationOrder ?? 999) || b.ovr - a.ovr);
}

function sanitizeRotationAvailability(teamId) {
  teamPlayers(teamId).forEach((player) => {
    if (!isPlayerGameEligible(player).ok) player.minutes = 0;
  });
}

function syncRotationStarters(teamId, orderedPlayers = rotationPlayers(teamId)) {
  const slotPositions = starterSlotPositions();
  orderedPlayers.forEach((player, index) => {
    const wasStarter = player.starter === true;
    const isStarter = index < 5;
    if (isStarter) {
      if (!wasStarter || !player.rotationNaturalPos) player.rotationNaturalPos = savedRotationNaturalPosition(player);
      player.starter = true;
      player.pos = slotPositions[index];
    } else {
      player.starter = false;
      if (player.rotationNaturalPos) player.pos = savedRotationNaturalPosition(player);
    }
  });
}

function rotationStatus(teamId) {
  ensureTeamRotation(teamId);
  sanitizeRotationAvailability(teamId);
  syncRotationStarters(teamId);
  const players = rotationPlayers(teamId);
  const rosterRules = rosterRuleStatus(teamId);
  const minutes = players.reduce((sum, player) => sum + numberOr(player.minutes, 0), 0);
  const starterPlayers = players.slice(0, 5);
  const starters = starterPlayers.length;
  const activePlayers = players.filter((player) => player.minutes > 0 && isPlayerGameEligible(player).ok).length;
  const injuredMinutes = players.some((player) => player.injury > 0 && player.minutes > 0);
  const invalidStarter = starterPlayers.some((player) => player.injury > 0 || !isPlayerGameEligible(player).ok);
  let message = "Rotation is ready for the next game.";
  if (!rosterRules.valid) message = rosterRules.messages.find((item) => !item.ok)?.text || "Roster is not legal.";
  else if (minutes !== 240) message = `Assign exactly 240 minutes. Current total: ${minutes}.`;
  else if (starters !== 5) message = `Keep five players in the starter slots. Current total: ${starters}.`;
  else if (invalidStarter) message = "The first five slots must be game-eligible starters.";
  else if (starterPlayers.some((player) => player.minutes <= 0)) message = "Every starter must receive playing time.";
  else if (injuredMinutes) message = "Injured players cannot receive minutes.";
  const ineligibleMinutes = players.some((player) => player.minutes > 0 && !isPlayerGameEligible(player).ok);
  if (ineligibleMinutes) message = "Inactive, playoff-ineligible, or maxed two-way players cannot receive minutes.";
  return { valid: rosterRules.valid && minutes === 240 && starters === 5 && !invalidStarter && !starterPlayers.some((player) => player.minutes <= 0) && !injuredMinutes && !ineligibleMinutes, minutes, starters, activePlayers, message };
}

function captureRotationInputs(validate = true) {
  const players = teamPlayers(save.activeTeamId);
  const snapshot = players.map((player) => ({ id: player.id, minutes: player.minutes, starter: player.starter, pos: player.pos, rotationNaturalPos: player.rotationNaturalPos, rotationSecondaryPos: player.rotationSecondaryPos, activeRoster: player.activeRoster }));
  players.forEach((player) => {
    const minutesInput = document.querySelector(`[data-rotation-minutes="${CSS.escape(player.id)}"]`);
    const positionInput = document.querySelector(`[data-rotation-position="${CSS.escape(player.id)}"]`);
    const secondaryPositionInput = document.querySelector(`[data-rotation-secondary-position="${CSS.escape(player.id)}"]`);
    const activeInput = document.querySelector(`[data-roster-active="${CSS.escape(player.id)}"]`);
    if (activeInput) player.activeRoster = activeInput.checked;
    if (positionInput && !positionInput.disabled) {
      player.pos = normalizeRotationPosition(positionInput.value);
      player.rotationNaturalPos = player.pos;
    }
    if (secondaryPositionInput) {
      player.rotationSecondaryPos = secondaryPositionInput.value === "None" ? "" : normalizeRotationPosition(secondaryPositionInput.value);
    }
    const eligibility = isPlayerGameEligible(player);
    player.minutes = eligibility.ok && minutesInput ? Math.max(0, Math.min(48, Math.round(Number(minutesInput.value) || 0))) : 0;
  });
  syncRotationStarters(save.activeTeamId);
  if (!validate) return { valid: true };
  const decision = rotationStatus(save.activeTeamId);
  if (!decision.valid) {
    snapshot.forEach((previous) => {
      const player = players.find((candidate) => candidate.id === previous.id);
      if (!player) return;
      player.minutes = previous.minutes;
      player.starter = previous.starter;
      player.pos = previous.pos;
      player.rotationNaturalPos = previous.rotationNaturalPos;
      player.rotationSecondaryPos = previous.rotationSecondaryPos;
      player.activeRoster = previous.activeRoster;
    });
  }
  return decision;
}

function updateRotationDraftStatus() {
  const minuteInputs = [...document.querySelectorAll("[data-rotation-minutes]")];
  const activeInputs = [...document.querySelectorAll("[data-roster-active]")];
  const activeCount = activeInputs.filter((input) => input.checked).length;
  const minutes = minuteInputs.reduce((sum, input) => sum + Math.max(0, Math.min(48, Math.round(Number(input.value) || 0))), 0);
  const starterRows = [...document.querySelectorAll("[data-rotation-row]")].slice(0, 5);
  const starters = starterRows.length;
  const starterMinutes = starterRows.some((row) => {
    const input = row.querySelector("[data-rotation-minutes]");
    return !input || input.disabled || Math.max(0, Math.min(48, Math.round(Number(input.value) || 0))) <= 0;
  });
  const total = document.querySelector(".rotation-total");
  const totalValue = total?.querySelector("strong");
  const message = document.querySelector("#rotation-message");
  if (totalValue) totalValue.textContent = minutes;
  if (total) total.className = `rotation-total ${minutes === 240 && starters === 5 ? "valid" : "invalid"}`;
  if (!message) return;
  if (activeCount < 8 || activeCount > 13) {
    message.className = "bad";
    message.textContent = `Active list must have 8-13 players. Current total: ${activeCount}.`;
  } else if (minutes !== 240) {
    message.className = "bad";
    message.textContent = `Assign exactly 240 minutes. Current total: ${minutes}.`;
  } else if (starters !== 5) {
    message.className = "bad";
    message.textContent = `Keep five players in the starter slots. Current total: ${starters}.`;
  } else if (starterMinutes) {
    message.className = "bad";
    message.textContent = "Every starter must receive playing time.";
  } else {
    message.className = "ok";
    message.textContent = "Rotation is ready to save.";
  }
}

function clampRotationMinuteInput(changedInput) {
  const minuteInputs = [...document.querySelectorAll("[data-rotation-minutes]")];
  const total = minuteInputs.reduce((sum, input) => sum + Math.max(0, Math.min(48, Math.round(Number(input.value) || 0))), 0);
  if (total <= 240) return;
  const overflow = total - 240;
  const nextValue = Math.max(0, Math.round(Number(changedInput.value) || 0) - overflow);
  changedInput.value = nextValue;
}

function reorderRotationPlayer(playerId, targetPlayerId, placeAfter = false) {
  const players = rotationPlayers(save.activeTeamId);
  const sourceIndex = players.findIndex((player) => player.id === playerId);
  const targetIndex = players.findIndex((player) => player.id === targetPlayerId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
  const slotMinutes = players.map((player) => Number(player.minutes || 0));
  [players[sourceIndex], players[targetIndex]] = [players[targetIndex], players[sourceIndex]];
  players.forEach((player, index) => {
    player.rotationOrder = index;
    player.minutes = isPlayerGameEligible(player).ok ? slotMinutes[index] || 0 : 0;
  });
  syncRotationStarters(save.activeTeamId, players);
}

function createModeSave(mode, teamId = "bos") {
  const next = structuredClone(defaultSave);
  next.mode = mode;
  next.activeTeamId = teamId;
  next.schedule = createSeasonSchedule(teamId, next.season);
  next.leagueSchedule = createLeagueSchedule(teamId, next.season, next.schedule);
  next.leagueResults = [];
  next.players.forEach((player) => initializePlayerCareerFields(player));
  next.gmCareer = { approval: mode === "GM" ? 65 : 60, seasons: 0, titles: 0, playoffTrips: 0, jobOffers: [], finances: { attendance: 82, revenue: 310, staffBudget: 18, taxTolerance: "moderate" }, goals: ["Reach the playoffs", "Maintain roster flexibility"] };
  syncTeamPayrolls(next);
  next.messages = [`${mode} mode career created with ${teamNameFrom(next, teamId)}.`];
  if (mode === "GM") {
    next.xp = 250;
    next.careerScore = 500;
    next.messages.push("Front office control enabled.");
  }
  return next;
}

function normalizeSave(candidate) {
  const imported = importedRosterRows().length > 0;
  const teams = imported ? mergeTeamProgress(createLeagueTeams(), candidate.teams || []) : candidate.teams || structuredClone(defaultSave.teams);
  const savedPlayers = Array.isArray(candidate.players) && candidate.players.length ? candidate.players : null;
  const playerPool = savedPlayers || createLeaguePlayers();
  const upgradedPlayerPool = candidate.freeAgentPoolVersion === 1
    ? playerPool
    : mergeImportedFreeAgents(playerPool, candidate.season || 2026, candidate.retiredPlayers || []);
  const normalizedPlayers = hydrateImageIds(ensurePlayerContracts(initializeLeagueRotations(upgradedPlayerPool), candidate.season || 2026));
  const repairedRatings = imported && candidate.ratingsVersion !== 1 && applyImportedOverallRatings(normalizedPlayers);
  if (repairedRatings) nbaTeams.forEach(([teamId]) => setDefaultRotationForPlayers(normalizedPlayers, teamId, true));
  const normalized = {
    ...structuredClone(defaultSave),
    ...candidate,
    slotId: candidate.slotId || "slot-1",
    careerName: candidate.careerName || defaultCareerName(candidate),
    mode: candidate.mode || "Default",
    teams,
    players: normalizedPlayers,
    schedule: normalizeSchedule(candidate.schedule, candidate.results, candidate.activeTeamId || "bos", candidate.season || 2026),
    seasonEvents: normalizeSeasonEvents(candidate.seasonEvents, candidate.season || 2026),
    transactionEvents: normalizeTransactionCalendar(candidate.transactionEvents, candidate.season || 2026),
    timelineDate: candidate.timelineDate || latestPlayedDate(candidate.schedule) || `${candidate.season || 2026}-10-20`,
    contractVersion: candidate.contractVersion || 0,
    offseasonVersion: candidate.offseasonVersion || 0,
    offseason: candidate.offseason || null,
    teamStrategies: candidate.teamStrategies || createTeamStrategies(),
    coaching: candidate.coaching || createCoachingProfiles(),
    leagueHistory: candidate.leagueHistory || [],
    transactionLog: candidate.transactionLog || [],
    retiredPlayers: candidate.retiredPlayers || [],
    gmCareer: candidate.gmCareer || { approval: 60, seasons: 0, titles: 0, playoffTrips: 0, jobOffers: [] },
    draftPicks: normalizeDraftPicks(candidate.draftPicks, candidate.season || 2026),
    results: candidate.results || [],
    leagueSchedule: candidate.leagueSchedule || [],
    leagueResults: candidate.leagueResults || [],
    social: normalizeSocialState(candidate.social),
    ratingsVersion: 1,
    freeAgentPoolVersion: 1,
    messages: candidate.messages || []
  };
  syncTeamPayrolls(normalized);
  return normalized;
}

function mergeTeamProgress(nextTeams, previousTeams) {
  return nextTeams.map((nextTeam) => {
    const previous = previousTeams.find((team) => team.id === nextTeam.id);
    return previous ? { ...nextTeam, wins: previous.wins || 0, losses: previous.losses || 0 } : nextTeam;
  });
}

function createLeagueTeams() {
  return nbaTeams.map(([id, city, name, abbr, conf, payroll, defense, matchup, pace]) =>
    team(id, city, name, abbr, conf, 0, 0, payroll, rosterIdsForTeam(id), defense, matchup, pace)
  );
}

function createDraftPicks(season) {
  return nbaTeams.flatMap(([teamId]) => Array.from({ length: 7 }, (_, offset) => [1, 2].map((round) => ({
    id: `pick-${teamId}-${season + offset + 1}-${round}`,
    originalTeamId: teamId,
    ownerTeamId: teamId,
    season: season + offset + 1,
    round,
    protection: ""
  })))).flat();
}

function normalizeDraftPicks(existing, season) {
  if (Array.isArray(existing) && existing.length) return existing;
  return createDraftPicks(season);
}

function ensureDraftPickHorizon() {
  const targetYear = save.season + 7;
  nbaTeams.forEach(([teamId]) => [1, 2].forEach((round) => {
    const id = `pick-${teamId}-${targetYear}-${round}`;
    if (!save.draftPicks.some((pick) => pick.id === id)) save.draftPicks.push({ id, originalTeamId: teamId, ownerTeamId: teamId, season: targetYear, round, protection: "" });
  }));
}

function teamTradePicks(teamId) {
  return (save.draftPicks || []).filter((pick) => pick.ownerTeamId === teamId && pick.season > save.season && pick.season <= save.season + 7).sort((a, b) => a.season - b.season || a.round - b.round);
}

function formatDraftPick(pick) {
  return `${pick.season} ${teamName(pick.originalTeamId)} R${pick.round}`;
}

function createLeaguePlayers() {
  const importedRows = importedRosterRows();
  if (importedRows.length) {
    const players = importedRows.map((row, index) => importedPlayer(row, index));
    mergeImportedFreeAgents(players, 2026);
    validateOverallRatings(players);
    return players;
  }

  return nbaTeams.flatMap(([id, city, name, abbr], index) => {
    const base = 78 + (index % 9);
    return [
      player(`${id}-star`, `${abbr} Franchise Player`, 25 + (index % 7), "SF/PF", "6'8\"", abbr, id, base + 7, base + 10, 82, 80, 84, 74, 79, 88),
      player(`${id}-guard`, `${city} Lead Guard`, 23 + (index % 8), "PG/SG", "6'3\"", abbr, id, base + 2, base + 6, 84, 78, 76, 82, 72, 86),
      player(`${id}-big`, `${name} Interior Anchor`, 24 + (index % 9), "C", "6'11\"", abbr, id, base, base + 4, 62, 70, 86, 65, 84, 82)
    ];
  });
}

function mergeImportedFreeAgents(players, season = 2026, retiredPlayers = []) {
  if (!importedRosterRows().length) return players;
  const rosterNames = new Set(importedRosterRows().map((row) => normalizePlayerName(row.name)));
  const existingNames = new Set(players.map((playerRecord) => normalizePlayerName(playerRecord.name)));
  const existingNbaIds = new Set(players.map((playerRecord) => Number(playerRecord.playerId || playerRecord.nbaPlayerId)).filter(Boolean));
  const retiredNames = new Set((retiredPlayers || []).map((playerRecord) => normalizePlayerName(playerRecord.name)));
  const retiredNbaIds = new Set((retiredPlayers || []).map((playerRecord) => Number(playerRecord.playerId || playerRecord.nbaPlayerId)).filter(Boolean));

  playerDirectoryRows()
    .filter((directoryPlayer) => directoryPlayer.isActive === true)
    .filter((directoryPlayer) => !rosterNames.has(normalizePlayerName(directoryPlayer.fullName || directoryPlayer.full_name)))
    .filter((directoryPlayer) => !existingNames.has(normalizePlayerName(directoryPlayer.fullName || directoryPlayer.full_name)))
    .filter((directoryPlayer) => !existingNbaIds.has(Number(directoryPlayer.id)))
    .filter((directoryPlayer) => !retiredNames.has(normalizePlayerName(directoryPlayer.fullName || directoryPlayer.full_name)))
    .filter((directoryPlayer) => !retiredNbaIds.has(Number(directoryPlayer.id)))
    .forEach((directoryPlayer) => {
      const freeAgent = importedFreeAgent(directoryPlayer, season);
      players.push(freeAgent);
      existingNames.add(normalizePlayerName(freeAgent.name));
      if (freeAgent.playerId) existingNbaIds.add(Number(freeAgent.playerId));
    });

  return players;
}

function importedFreeAgent(directoryPlayer, season) {
  const name = directoryPlayer.fullName || directoryPlayer.full_name || "NBA Free Agent";
  const statRow = playerStatsRows().find((row) => Number(row.PLAYER_ID) === Number(directoryPlayer.id))
    || playerStatsRows().find((row) => normalizePlayerName(row.PLAYER_NAME) === normalizePlayerName(name));
  const rating = statRow ? calculateOverall(statRow) : 66;
  const age = numberOr(statRow?.AGE, 25);
  const position = inferFreeAgentPosition(statRow);
  const freeAgent = player(
    `fa-${directoryPlayer.id || slug(name)}`,
    name,
    age,
    position,
    "",
    freeAgentArchetype(position, statRow),
    null,
    rating,
    Math.min(99, rating + (age <= 24 ? 7 : age <= 28 ? 4 : 1)),
    position.includes("G") ? 77 : 68,
    position.includes("F") ? 75 : 68,
    position.includes("C") ? 79 : 72,
    position.includes("G") ? 76 : 66,
    position.includes("C") ? 77 : 70,
    74,
    0,
    "",
    Number(directoryPlayer.id) || null
  );
  freeAgent.nbaTeamId = null;
  freeAgent.activeRoster = false;
  freeAgent.starter = false;
  freeAgent.ratingSource = statRow ? "playerStats.json" : "active-player-directory";
  freeAgent.freeAgentDataSource = "active-player-directory";
  freeAgent.importedStats = statRow ? {
    PTS: numberStat(statRow.PTS), AST: numberStat(statRow.AST), REB: numberStat(statRow.REB),
    STL: numberStat(statRow.STL), BLK: numberStat(statRow.BLK), MIN: numberStat(statRow.MIN),
    FG_PCT: numberStat(statRow.FG_PCT), FG3_PCT: numberStat(statRow.FG3_PCT), AGE: numberStat(statRow.AGE)
  } : null;
  freeAgent.contract = createUnsignedFreeAgentContract(freeAgent, season);
  return freeAgent;
}

function createUnsignedFreeAgentContract(playerRecord, season) {
  return {
    startSeason: season - 1,
    endSeason: season - 1,
    salaries: {},
    guaranteedThrough: season - 1,
    option: null,
    yearsWithTeam: 0,
    birdRights: "Non-Bird",
    freeAgentType: "UFA",
    salaryType: "Unsigned",
    signedDate: null,
    tradeEligibleDate: null,
    extensionSignedSeason: null,
    serviceYears: Math.max(0, Number(playerRecord.age || 19) - 19),
    noTradeClause: false,
    capHold: 0,
    rosterType: "standard",
    playoffEligible: true
  };
}

function inferFreeAgentPosition(statRow) {
  const assists = numberStat(statRow?.AST);
  const rebounds = numberStat(statRow?.REB);
  const blocks = numberStat(statRow?.BLK);
  const threes = numberStat(statRow?.FG3A);
  if (rebounds >= 6 || blocks >= 1.1) return threes >= 3 ? "PF/C" : "C/PF";
  if (assists >= 4.5) return "PG/SG";
  if (rebounds >= 4.2) return "SF/PF";
  return assists >= 2.5 ? "SG/PG" : "SG/SF";
}

function freeAgentArchetype(position, statRow) {
  if (position.includes("C")) return numberStat(statRow?.BLK) >= 1 ? "Rim Protector" : "Interior Big";
  if (numberStat(statRow?.AST) >= 5) return "Floor General";
  if (numberStat(statRow?.FG3A) >= 4) return "Perimeter Scorer";
  return position.includes("F") ? "Versatile Forward" : "NBA Veteran";
}

function ensurePlayerContracts(players, season) {
  let created = false;
  players.forEach((player, index) => {
    if (!player.contract?.salaries) {
      player.contract = createPlayerContract(player, season, index);
      created = true;
    }
  });
  if (created) normalizeInitialContractPayrolls(players, season);
  assignDefaultRosterTypes(players, season);
  return players;
}

function assignDefaultRosterTypes(players, season) {
  nbaTeams.forEach(([teamId]) => {
    const roster = players.filter((player) => player.teamId === teamId).sort((a, b) => b.ovr - a.ovr || a.age - b.age);
    roster.forEach((player, index) => {
      const contract = player.contract;
      contract.rosterType = contract.rosterType || (index >= 15 ? "twoWay" : "standard");
      if (contract.rosterType === "twoWay") {
        contract.salaryType = "Two-Way";
        contract.salaries[season] = 0;
        contract.twoWayGamesUsed = contract.twoWayGamesUsed || 0;
        contract.twoWayGameLimit = 50;
        contract.playoffEligible = false;
        player.activeRoster = Boolean(player.activeRoster && index < 13);
        player.minutes = 0;
        player.starter = false;
      } else {
        contract.rosterType = contract.rosterType || "standard";
        contract.playoffEligible = contract.playoffEligible ?? true;
        player.activeRoster = player.activeRoster ?? index < 13;
      }
    });
  });
}

function normalizeInitialContractPayrolls(players, season) {
  nbaTeams.forEach(([teamId, , , , , targetPayroll]) => {
    const roster = players.filter((player) => player.teamId === teamId);
    const current = roster.reduce((sum, player) => sum + Number(player.contract?.salaries?.[season] || 0), 0);
    if (!current) return;
    const factor = targetPayroll / current;
    roster.forEach((player) => {
      Object.keys(player.contract.salaries).forEach((year) => {
        player.contract.salaries[year] = roundMoney(Math.max(1.2, player.contract.salaries[year] * factor));
      });
      const currentSalary = player.contract.salaries[season] || 0;
      player.contract.salaryType = currentSalary <= 3 ? "Minimum" : currentSalary >= 40 ? "Max" : "Standard";
    });
  });
}

function createPlayerContract(player, season, index) {
  const random = seededRandom(`contract-${player.id}-${season}`);
  const years = Math.max(1, Math.min(5, 1 + Math.floor(random() * 4)));
  const yearsWithTeam = Math.max(1, Math.min(7, Math.round((player.age - 19) * (0.25 + random() * 0.45))));
  const birdRights = yearsWithTeam >= 3 ? "Bird" : yearsWithTeam === 2 ? "Early Bird" : "Non-Bird";
  const baseSalary = playerMarketSalary(player);
  const salaries = {};
  for (let offset = 0; offset < years; offset += 1) salaries[season + offset] = roundMoney(baseSalary * Math.pow(1.05, offset));
  const optionRoll = random();
  const option = years > 1 && optionRoll > 0.62
    ? { type: optionRoll > 0.82 ? "PO" : "TO", season: season + years - 1, decided: false }
    : null;
  return {
    startSeason: season,
    endSeason: season + years - 1,
    salaries,
    guaranteedThrough: option ? option.season - 1 : season + years - 1,
    option,
    yearsWithTeam,
    birdRights,
    freeAgentType: player.age <= 25 && years <= 2 ? "RFA" : "UFA",
    salaryType: baseSalary <= 3 ? "Minimum" : baseSalary >= 40 ? "Max" : "Standard",
    signedDate: `${season}-07-06`,
    tradeEligibleDate: yearsWithTeam >= 2 ? `${season}-07-06` : `${season}-12-15`,
    extensionSignedSeason: null,
    serviceYears: Math.max(1, player.age - 19),
    noTradeClause: player.age >= 30 && player.ovr >= 86 && yearsWithTeam >= 4,
    capHold: 0
  };
}

function playerMarketSalary(player) {
  const ageFactor = player.age > 33 ? 0.82 : player.age < 24 ? 0.9 : 1;
  let salary = 2.1;
  if (player.ovr >= 92) salary = 49;
  else if (player.ovr >= 88) salary = 39;
  else if (player.ovr >= 84) salary = 30;
  else if (player.ovr >= 80) salary = 21;
  else if (player.ovr >= 76) salary = 13;
  else if (player.ovr >= 72) salary = 7;
  else if (player.ovr >= 68) salary = 3.5;
  return roundMoney(salary * ageFactor);
}

function contractSalary(player, season = save.season) {
  if (player.contract?.rosterType === "twoWay") return 0;
  return Number(player.contract?.salaries?.[season] || 0);
}

function contractYearsRemaining(player) {
  return Math.max(0, (player.contract?.endSeason || save.season - 1) - save.season + 1);
}

function projectedCapHold(player) {
  if (contractYearsRemaining(player) > 1) return 0;
  const multiplier = player.contract?.birdRights === "Bird" ? 1.5 : player.contract?.birdRights === "Early Bird" ? 1.3 : 1.2;
  return roundMoney(Math.max(2.1, contractSalary(player) * multiplier));
}

function contractCategory(player) {
  if (contractYearsRemaining(player) <= 1) return "expiring";
  if (player.contract?.option && !player.contract.option.decided) return "options";
  if (canExtendContract(player)) return "extension";
  return "standard";
}

function canExtendContract(player) {
  const contract = player.contract;
  if (!contract || contractYearsRemaining(player) < 1 || contractYearsRemaining(player) > 2) return false;
  if (contract.salaryType === "10-Day" || contract.salaryType === "Two-Way") return false;
  if (contract.extensionSignedSeason === save.season) return false;
  if (player.dissatisfaction?.refusesExtension) return false;
  return contract.yearsWithTeam >= 2 && currentLeagueDate() <= `${save.season + 1}-06-30`;
}

function contractActionStatus(player) {
  if (contractYearsRemaining(player) === 0) return "Expired";
  if (player.contract?.extensionSignedSeason === save.season) return "Extended";
  if (contractYearsRemaining(player) > 2) return "Under Contract";
  return "Not Eligible";
}

function extendPlayerContract(playerId) {
  const player = save.players.find((candidate) => candidate.id === playerId);
  if (!player || !canExtendContract(player)) return;
  const contract = player.contract;
  const extensionYears = contract.birdRights === "Bird" ? 4 : 3;
  const firstSeason = contract.endSeason + 1;
  const raise = contract.birdRights === "Bird" ? 1.08 : 1.05;
  let salary = roundMoney(Math.max(contractSalary(player), playerMarketSalary(player)) * raise);
  for (let offset = 0; offset < extensionYears; offset += 1) {
    contract.salaries[firstSeason + offset] = salary;
    salary = roundMoney(salary * raise);
  }
  contract.endSeason += extensionYears;
  contract.guaranteedThrough = contract.endSeason;
  contract.option = null;
  contract.extensionSignedSeason = save.season;
  contract.tradeEligibleDate = addDays(currentLeagueDate(), 180);
  contract.salaryType = contract.salaries[firstSeason] >= 40 ? "Max Extension" : "Extension";
  syncTeamPayrolls(save);
  save.messages.push(`${player.name} signed a ${extensionYears}-year, $${contractTotal(player, firstSeason).toFixed(1)}M extension.`);
}

function contractTotal(player, fromSeason = save.season) {
  return Object.entries(player.contract?.salaries || {}).reduce((sum, [season, salary]) => Number(season) >= fromSeason ? sum + Number(salary) : sum, 0);
}

function syncTeamPayrolls(source) {
  source.teams.forEach((team) => {
    const activeSalary = source.players.filter((player) => player.teamId === team.id).reduce((sum, player) => sum + Number(player.contract?.salaries?.[source.season] || 0), 0);
    team.payroll = roundMoney(activeSalary + Number(team.deadCapSalaries?.[source.season] || 0));
  });
}

function ensureContractSystem() {
  const missing = save.players.filter((player) => !player.contract?.salaries).length;
  ensurePlayerContracts(save.players, save.season);
  const needsCalibration = save.contractVersion < 2;
  if (needsCalibration) {
    normalizeInitialContractPayrolls(save.players, save.season);
  }
  const needsTradeFields = save.contractVersion < 3;
  if (needsTradeFields) save.players.forEach((player) => {
    player.contract.serviceYears = player.contract.serviceYears || Math.max(1, player.age - 19);
    player.contract.noTradeClause = Boolean(player.contract.noTradeClause || (player.age >= 30 && player.ovr >= 86 && player.contract.yearsWithTeam >= 4));
    player.contract.aggregateEligibleDate = player.contract.aggregateEligibleDate || player.contract.tradeEligibleDate;
    if (player.contract.yearsWithTeam >= 2 && player.contract.tradeEligibleDate === `${save.season}-12-15`) player.contract.tradeEligibleDate = `${save.season}-07-06`;
  });
  const needsRosterFields = save.contractVersion < 4;
  if (needsRosterFields) assignDefaultRosterTypes(save.players, save.season);
  save.contractVersion = 4;
  const previous = save.teams.map((team) => team.payroll).join("|");
  syncTeamPayrolls(save);
  return missing > 0 || needsCalibration || needsTradeFields || needsRosterFields || previous !== save.teams.map((team) => team.payroll).join("|");
}

function rosterRuleStatus(teamId, playersOverride = teamPlayers(teamId)) {
  const players = playersOverride;
  const standard = players.filter((player) => rosterType(player) === "standard" || rosterType(player) === "tenDay").length;
  const twoWay = players.filter((player) => rosterType(player) === "twoWay").length;
  const active = players.filter((player) => player.activeRoster && isPlayerGameEligible(player).ok).length;
  const total = players.length;
  const messages = [
    { ok: standard >= 14 && standard <= (save.leagueRules?.maxRoster || 15), text: `Standard contracts: ${standard}/${save.leagueRules?.maxRoster || 15}; regular-season legal range begins at 14.` },
    { ok: twoWay <= (save.leagueRules?.twoWaySlots || 3), text: `Two-way slots: ${twoWay}/${save.leagueRules?.twoWaySlots || 3}.` },
    { ok: total <= (save.leagueRules?.maxRoster || 15) + (save.leagueRules?.twoWaySlots || 3), text: `Total roster: ${total}/${(save.leagueRules?.maxRoster || 15) + (save.leagueRules?.twoWaySlots || 3)}.` },
    { ok: active >= 8 && active <= 13, text: `Active list: ${active}/13; must be 8-13.` },
    { ok: players.every((player) => rosterType(player) !== "twoWay" || (player.contract.twoWayGamesUsed || 0) <= 50), text: "Two-way NBA game limits are within 50 games." }
  ];
  return { standard, twoWay, active, total, valid: messages.every((message) => message.ok), messages };
}

function rosterType(player) {
  return player.contract?.rosterType || "standard";
}

function isPlayerGameEligible(player) {
  if (!player.activeRoster) return { ok: false, message: "Inactive" };
  if (player.gLeague) return { ok: false, message: "G League" };
  if (player.injury > 0) return { ok: false, message: `Out ${player.injury}` };
  if (rosterType(player) === "twoWay" && (player.contract.twoWayGamesUsed || 0) >= 50) return { ok: false, message: "2W limit" };
  let phase = "Regular Season";
  try { phase = save?.phase || phase; } catch {}
  if (phase === "Playoffs" && rosterType(player) === "twoWay") return { ok: false, message: "Playoff ineligible" };
  return { ok: true, message: "Eligible" };
}

function incrementTwoWayGameUsage(teamId) {
  teamPlayers(teamId).forEach((player) => {
    if (rosterType(player) === "twoWay" && player.minutes > 0 && isPlayerGameEligible(player).ok) player.contract.twoWayGamesUsed = Math.min(50, (player.contract.twoWayGamesUsed || 0) + 1);
  });
}

function roundMoney(value) {
  return Math.round(value * 10) / 10;
}

function isPlayerTradeEligible(player) {
  if (!player?.contract) return { ok: false, message: "No active contract" };
  if (contractYearsRemaining(player) <= 0) return { ok: false, message: "Contract expired" };
  if (player.contract.salaryType === "Two-Way" || player.contract.salaryType === "10-Day") return { ok: false, message: `${player.contract.salaryType} restriction` };
  if (player.contract.tradeEligibleDate && currentLeagueDate() < player.contract.tradeEligibleDate) return { ok: false, message: `Eligible ${formatShortDate(player.contract.tradeEligibleDate)}` };
  return { ok: true, message: "Eligible" };
}

function validateMultiTeamTrade(transaction, consent) {
  const reasons = [];
  const add = (ok, message) => reasons.push({ ok, message });
  const teams = transaction.teamIds.map(getTeam).filter(Boolean);
  const allRoutes = [...transaction.playerRoutes, ...transaction.pickRoutes];
  add(transactionRuleState().tradesOpen, transactionRuleState().tradesOpen ? "Trade period is open." : "The trade deadline has passed.");
  add(teams.length >= 2 && teams.length <= 4, "A trade must include between two and four teams.");
  add(allRoutes.length > 1, "At least two assets must be included in the trade.");
  add(allRoutes.every((route) => transaction.teamIds.includes(route.destinationTeamId) && route.destinationTeamId !== route.sourceTeamId), "Every selected asset has a valid destination team.");
  add(transaction.playerRoutes.every((route) => route.asset.teamId === route.sourceTeamId) && transaction.pickRoutes.every((route) => route.asset.ownerTeamId === route.sourceTeamId), "Every selected asset is owned by its sending team.");
  const ineligible = transaction.playerRoutes.map((route) => route.asset).filter((player) => !isPlayerTradeEligible(player).ok);
  add(!ineligible.length, ineligible.length ? `${ineligible.map((player) => player.name).join(", ")} cannot be traded yet.` : "All selected players are trade eligible.");
  const noTradePlayers = transaction.playerRoutes.map((route) => route.asset).filter((player) => player.contract?.noTradeClause);
  const requiresConsent = noTradePlayers.length > 0;
  add(!requiresConsent || consent, requiresConsent ? consent ? "All required no-trade consent has been obtained." : `${noTradePlayers.map((player) => player.name).join(", ")} must waive a no-trade clause.` : "No player consent is required.");
  teams.forEach((team) => {
    const sentPlayers = transaction.playerRoutes.filter((route) => route.sourceTeamId === team.id).map((route) => route.asset);
    const receivedPlayers = transaction.playerRoutes.filter((route) => route.destinationTeamId === team.id).map((route) => route.asset);
    const sentPicks = transaction.pickRoutes.filter((route) => route.sourceTeamId === team.id).map((route) => route.asset);
    const receivedPicks = transaction.pickRoutes.filter((route) => route.destinationTeamId === team.id).map((route) => route.asset);
    add(sentPlayers.length + sentPicks.length > 0, `${team.abbr} sends at least one asset.`);
    add(receivedPlayers.length + receivedPicks.length > 0, `${team.abbr} receives at least one asset.`);
    validateTeamTradeSide(team, sentPlayers, receivedPlayers).forEach((reason) => reasons.push(reason));
    validateDraftPickRules(team, sentPicks, receivedPicks).forEach((reason) => reasons.push(reason));
  });
  return { valid: reasons.every((reason) => reason.ok), reasons, requiresConsent, transaction };
}

function completeMultiTeamTrade(transaction) {
  const date = currentLeagueDate();
  transaction.playerRoutes.forEach((route) => {
    const player = route.asset;
    player.teamId = route.destinationTeamId;
    recordPlayerTeamMove(player, route.destinationTeamId, save.season, `Multi-team trade from ${teamName(route.sourceTeamId)}`);
    player.contract.aggregateEligibleDate = addDays(date, 60);
    applyMoraleChange(player, player.dissatisfaction?.tradeRequest ? 8 : -2, player.dissatisfaction?.tradeRequest ? "trade request honored" : "moved in a multi-team trade");
  });
  transaction.pickRoutes.forEach((route) => { route.asset.ownerTeamId = route.destinationTeamId; });
  syncTeamRosters();
  transaction.teamIds.forEach((teamId) => {
    setDefaultTeamRotation(teamId, true);
    lockerRoom(teamId).continuity = Math.max(25, lockerRoom(teamId).continuity - 7);
  });
  syncTeamPayrolls(save);
  const teamLabel = transaction.teamIds.map(teamName).join(", ");
  addTransaction("Trade", `${teamLabel} completed a ${transaction.teamIds.length}-team trade involving ${transaction.playerRoutes.length} players and ${transaction.pickRoutes.length} draft picks.`);
  save.messages.push(`${transaction.teamIds.length}-team trade completed successfully.`);
  resetMultiTradeState();
}

function resetMultiTradeState() {
  multiTradeTeamIds = [save.activeTeamId].filter(Boolean);
  multiTradePlayerIds = [];
  multiTradePickIds = [];
  multiTradeRoutes = {};
  multiTradeTeamPickerOpen = false;
  tradeConsent = false;
}

function validateTrade({ userTeamId, partnerTeamId, outgoingIds, incomingIds, outgoingPickIds = [], incomingPickIds = [], consent }) {
  const userTeam = getTeam(userTeamId);
  const partner = getTeam(partnerTeamId);
  const outgoing = outgoingIds.map((id) => save.players.find((player) => player.id === id)).filter(Boolean);
  const incoming = incomingIds.map((id) => save.players.find((player) => player.id === id)).filter(Boolean);
  const outgoingPicks = outgoingPickIds.map((id) => save.draftPicks.find((pick) => pick.id === id)).filter(Boolean);
  const incomingPicks = incomingPickIds.map((id) => save.draftPicks.find((pick) => pick.id === id)).filter(Boolean);
  const reasons = [];
  const add = (ok, message) => reasons.push({ ok, message });
  add(transactionRuleState().tradesOpen, transactionRuleState().tradesOpen ? "Trade period is open." : "The trade deadline has passed.");
  add(outgoing.length + outgoingPicks.length > 0 && incoming.length + incomingPicks.length > 0, "Both teams are sending at least one trade asset.");
  add(outgoing.every((player) => player.teamId === userTeamId) && incoming.every((player) => player.teamId === partnerTeamId), "All selected players belong to the correct teams.");
  const ineligible = [...outgoing, ...incoming].filter((player) => !isPlayerTradeEligible(player).ok);
  add(!ineligible.length, ineligible.length ? `${ineligible.map((player) => player.name).join(", ")} cannot be traded yet.` : "All selected players are trade eligible.");
  const noTradePlayers = [...outgoing, ...incoming].filter((player) => player.contract?.noTradeClause);
  const requiresConsent = noTradePlayers.length > 0;
  add(!requiresConsent || consent, requiresConsent ? consent ? "No-trade consent has been obtained." : `${noTradePlayers.map((player) => player.name).join(", ")} must waive a no-trade clause.` : "No player consent is required.");
  validateTeamTradeSide(userTeam, outgoing, incoming).forEach((reason) => reasons.push(reason));
  validateTeamTradeSide(partner, incoming, outgoing).forEach((reason) => reasons.push(reason));
  validateDraftPickRules(userTeam, outgoingPicks, incomingPicks).forEach((reason) => reasons.push(reason));
  validateDraftPickRules(partner, incomingPicks, outgoingPicks).forEach((reason) => reasons.push(reason));
  return {
    valid: reasons.every((reason) => reason.ok),
    reasons,
    requiresConsent,
    transaction: { userTeamId, partnerTeamId, outgoing, incoming, outgoingPicks, incomingPicks }
  };
}

function validateDraftPickRules(team, sentPicks, receivedPicks) {
  const levels = cbaThresholds(save.season);
  const reasons = [];
  const add = (ok, message) => reasons.push({ ok, message: `${team.abbr}: ${message}` });
  add(sentPicks.every((pick) => pick.ownerTeamId === team.id), "owns every draft pick it is sending.");
  const farYear = save.season + 7;
  const frozen = sentPicks.some((pick) => pick.round === 1 && pick.season === farYear) && team.payroll >= levels.secondApron;
  add(!frozen, frozen ? `${farYear} first-round pick is frozen by the second-apron rule.` : "no frozen second-apron pick is included.");
  const ownedAfter = save.draftPicks.filter((pick) => pick.round === 1 && pick.ownerTeamId === team.id && !sentPicks.some((sent) => sent.id === pick.id)).concat(receivedPicks.filter((pick) => pick.round === 1));
  const emptyYears = [];
  for (let year = save.season + 1; year <= save.season + 7; year += 1) if (!ownedAfter.some((pick) => pick.season === year)) emptyYears.push(year);
  const consecutive = emptyYears.some((year) => emptyYears.includes(year + 1));
  add(!consecutive, consecutive ? "Stepien Rule blocks consecutive future drafts without a first-round pick." : "Stepien Rule is satisfied.");
  return reasons;
}

function validateTeamTradeSide(team, sentPlayers, receivedPlayers) {
  const levels = cbaThresholds(save.season);
  const sent = roundMoney(sentPlayers.reduce((sum, player) => sum + contractSalary(player), 0));
  const received = roundMoney(receivedPlayers.reduce((sum, player) => sum + contractSalary(player), 0));
  const afterPayroll = roundMoney(team.payroll - sent + received);
  const finalPlayers = teamPlayers(team.id).filter((player) => !sentPlayers.some((sent) => sent.id === player.id)).concat(receivedPlayers.map((player) => ({ ...player, teamId: team.id })));
  const finalRoster = rosterRuleStatus(team.id, finalPlayers);
  const reasons = [];
  const add = (ok, message) => reasons.push({ ok, message: `${team.abbr}: ${message}` });
  const maxIncoming = maximumIncomingSalary(team, sent);
  add(received <= maxIncoming + 0.01, `receives $${received.toFixed(1)}M; limit is $${maxIncoming.toFixed(1)}M.`);
  add(finalRoster.standard >= 14 && finalRoster.standard <= (save.leagueRules?.maxRoster || 15), `post-trade standard contracts are ${finalRoster.standard}/${save.leagueRules?.maxRoster || 15}.`);
  add(finalRoster.twoWay <= (save.leagueRules?.twoWaySlots || 3), `post-trade two-way slots are ${finalRoster.twoWay}/${save.leagueRules?.twoWaySlots || 3}.`);
  add(finalRoster.total <= (save.leagueRules?.maxRoster || 15) + (save.leagueRules?.twoWaySlots || 3), `post-trade total roster is ${finalRoster.total}/${(save.leagueRules?.maxRoster || 15) + (save.leagueRules?.twoWaySlots || 3)}.`);
  if (afterPayroll >= levels.firstApron) add(received <= sent + 0.01, `first-apron team cannot take back more salary than it sends ($${sent.toFixed(1)}M).`);
  else add(true, "not subject to the first-apron salary-increase restriction.");
  if (team.payroll >= levels.secondApron || afterPayroll >= levels.secondApron) add(sentPlayers.length <= 1, "second-apron team may not aggregate multiple player salaries.");
  else add(true, "not subject to the second-apron aggregation restriction.");
  const recentlyTraded = sentPlayers.filter((player) => player.contract?.aggregateEligibleDate && currentLeagueDate() < player.contract.aggregateEligibleDate);
  add(sentPlayers.length <= 1 || !recentlyTraded.length, recentlyTraded.length && sentPlayers.length > 1 ? `${recentlyTraded.map((player) => player.name).join(", ")} cannot be aggregated until ${formatShortDate(recentlyTraded[0].contract.aggregateEligibleDate)}.` : "recently traded player aggregation rule is satisfied.");
  add(true, `post-trade payroll would be $${afterPayroll.toFixed(1)}M.`);
  return reasons;
}

function maximumIncomingSalary(team, outgoingSalary) {
  const levels = cbaThresholds(save.season);
  if (team.payroll < levels.cap) return roundMoney(outgoingSalary + (levels.cap - team.payroll));
  if (team.payroll >= levels.firstApron) return outgoingSalary;
  if (outgoingSalary <= 7.5) return roundMoney(outgoingSalary * 2 + 0.25);
  if (outgoingSalary <= 29) return roundMoney(outgoingSalary + 7.5);
  return roundMoney(outgoingSalary * 1.25 + 0.25);
}

function projectedTradePayroll(teamId) {
  const team = getTeam(teamId);
  const outgoing = tradeOutgoingIds.map((id) => save.players.find((player) => player.id === id)).filter(Boolean);
  const incoming = tradeIncomingIds.map((id) => save.players.find((player) => player.id === id)).filter(Boolean);
  return teamId === save.activeTeamId
    ? roundMoney(team.payroll - outgoing.reduce((sum, player) => sum + contractSalary(player), 0) + incoming.reduce((sum, player) => sum + contractSalary(player), 0))
    : roundMoney(team.payroll - incoming.reduce((sum, player) => sum + contractSalary(player), 0) + outgoing.reduce((sum, player) => sum + contractSalary(player), 0));
}

function completeTrade(transaction) {
  const date = currentLeagueDate();
  transaction.outgoing.forEach((player) => {
    player.teamId = transaction.partnerTeamId;
    recordPlayerTeamMove(player, transaction.partnerTeamId, save.season, `Trade from ${teamName(transaction.userTeamId)}`);
    player.contract.aggregateEligibleDate = addDays(date, 60);
    applyMoraleChange(player, player.dissatisfaction?.tradeRequest ? 8 : -3, player.dissatisfaction?.tradeRequest ? "trade request honored" : "traded to a new team");
  });
  transaction.incoming.forEach((player) => {
    player.teamId = transaction.userTeamId;
    recordPlayerTeamMove(player, transaction.userTeamId, save.season, `Trade from ${teamName(transaction.partnerTeamId)}`);
    player.contract.aggregateEligibleDate = addDays(date, 60);
    applyMoraleChange(player, 2, "fresh start after trade");
  });
  transaction.outgoingPicks.forEach((pick) => { pick.ownerTeamId = transaction.partnerTeamId; });
  transaction.incomingPicks.forEach((pick) => { pick.ownerTeamId = transaction.userTeamId; });
  syncTeamRosters();
  setDefaultTeamRotation(transaction.userTeamId, true);
  setDefaultTeamRotation(transaction.partnerTeamId, true);
  syncTeamPayrolls(save);
  const sentAssets = [...transaction.outgoing.map((player) => player.name), ...transaction.outgoingPicks.map(formatDraftPick)].join(", ");
  const acquiredAssets = [...transaction.incoming.map((player) => player.name), ...transaction.incomingPicks.map(formatDraftPick)].join(", ");
  save.messages.push(`Trade completed with ${teamName(transaction.partnerTeamId)}: sent ${sentAssets}; acquired ${acquiredAssets}.`);
  lockerRoom(transaction.userTeamId).continuity = Math.max(25, lockerRoom(transaction.userTeamId).continuity - 7);
  lockerRoom(transaction.partnerTeamId).continuity = Math.max(25, lockerRoom(transaction.partnerTeamId).continuity - 7);
  addTransaction("Trade", `${teamName(transaction.userTeamId)} sent ${sentAssets || "assets"} to ${teamName(transaction.partnerTeamId)} for ${acquiredAssets || "assets"}.`);
  tradeOutgoingIds = [];
  tradeIncomingIds = [];
  tradeOutgoingPickIds = [];
  tradeIncomingPickIds = [];
  tradeConsent = false;
}

function importedRosterRows() {
  return Array.isArray(window.nbaRosterRows) ? window.nbaRosterRows.filter((row) => teamIdFromName(row.team)) : [];
}

function rosterIdsForTeam(teamId) {
  const rows = importedRosterRows().filter((row) => teamIdFromName(row.team) === teamId);
  if (rows.length) return rows.map((row, index) => playerIdFromRow(row, index));
  return [`${teamId}-star`, `${teamId}-guard`, `${teamId}-big`];
}

function importedPlayer(row, index) {
  const teamId = teamIdFromName(row.team);
  const statRow = findPlayerStatsForRosterRow(row);
  const rating = statRow ? calculateOverall(statRow) : fallbackOverall(row);
  const age = numberOr(statRow?.AGE ?? row.age, 24);
  const position = normalizePosition(row.position);
  const minutes = numberOr(statRow?.MIN ?? row.minutes, 0);
  const imported = player(
    playerIdFromRow(row, index),
    row.name,
    age,
    position,
    "",
    row.role || row.contractStatus || teamAbbr(teamId),
    teamId,
    rating,
    Math.min(99, rating + 4 + (age < 25 ? 3 : 0)),
    position.includes("G") ? 82 : 68,
    position.includes("F") ? 78 : 70,
    position.includes("C") ? 84 : 76,
    position.includes("G") ? 80 : 68,
    position.includes("C") ? 82 : 74,
    80,
    minutes,
    row.portrait || ""
  );
  imported.overall = rating;
  imported.playerId = Number(statRow?.PLAYER_ID ?? row.playerId ?? row.PLAYER_ID ?? findPlayerDirectoryId(row.name)) || null;
  imported.nbaTeamId = Number(statRow?.TEAM_ID ?? row.nbaTeamId ?? row.TEAM_ID ?? nbaTeamIdsBySlug[teamId]) || null;
  imported.ratingSource = statRow ? "playerStats.json" : "fallback";
  imported.importedStats = statRow ? {
    PTS: numberStat(statRow.PTS),
    AST: numberStat(statRow.AST),
    REB: numberStat(statRow.REB),
    STL: numberStat(statRow.STL),
    BLK: numberStat(statRow.BLK),
    MIN: numberStat(statRow.MIN),
    FG_PCT: numberStat(statRow.FG_PCT),
    FG3_PCT: numberStat(statRow.FG3_PCT),
    AGE: numberStat(statRow.AGE)
  } : null;
  return imported;
}

function teamIdFromName(teamName) {
  const normalized = normalizeText(teamName);
  const found = nbaTeams.find(([, city, name]) => normalizeText(`${city} ${name}`) === normalized);
  return found ? found[0] : null;
}

function playerIdFromRow(row, index) {
  return `${teamIdFromName(row.team)}-${slug(row.name)}-${index}`;
}

function hydrateImageIds(players) {
  return players.map((playerRecord) => {
    const statRow = playerRecord.playerId ? null : findPlayerStatsForRosterRow({ name: playerRecord.name, team: teamName(playerRecord.teamId) });
    playerRecord.playerId = Number(playerRecord.playerId || playerRecord.nbaPlayerId || statRow?.PLAYER_ID || findPlayerDirectoryId(playerRecord.name)) || null;
    playerRecord.nbaTeamId = Number(playerRecord.nbaTeamId || statRow?.TEAM_ID || nbaTeamIdsBySlug[playerRecord.teamId]) || null;
    return playerRecord;
  });
}

function teamAbbr(teamId) {
  const found = nbaTeams.find(([id]) => id === teamId);
  return found ? found[3] : teamId ? String(teamId).toUpperCase() : "FA";
}

function calculateOverall(playerStats) {
  const pts = numberStat(playerStats?.PTS);
  const ast = numberStat(playerStats?.AST);
  const reb = numberStat(playerStats?.REB);
  const stl = numberStat(playerStats?.STL);
  const blk = numberStat(playerStats?.BLK);
  const minutes = numberStat(playerStats?.MIN);
  const fgPct = numberStat(playerStats?.FG_PCT);
  const fg3Pct = numberStat(playerStats?.FG3_PCT);
  const age = numberStat(playerStats?.AGE);

  const production = pts * 1.55 + ast * 1.35 + reb * 0.92 + stl * 3.4 + blk * 3.0;
  const workload = Math.min(9, minutes * 0.32);
  const efficiency = (fgPct - 0.45) * 18 + (fg3Pct - 0.35) * 7;
  const ageAdjustment = age && age <= 24 ? 1.2 : age >= 34 ? -1.2 : 0;
  const lowSamplePenalty = minutes < 12 ? -(12 - minutes) * 0.55 : 0;
  const score = production + workload + efficiency + ageAdjustment + lowSamplePenalty;

  let overall;
  if (score >= 81) overall = 96 + Math.min(3, Math.floor((score - 81) / 7));
  else if (score >= 68) overall = 92 + Math.floor((score - 68) / 3.25);
  else if (score >= 58) overall = 88 + Math.floor((score - 58) / 2.5);
  else if (score >= 46) overall = 82 + Math.floor((score - 46) / 2);
  else if (score >= 37) overall = 77 + Math.floor((score - 37) / 1.8);
  else if (score >= 29) overall = 72 + Math.floor((score - 29) / 1.6);
  else if (score >= 22) overall = 68 + Math.floor((score - 22) / 1.75);
  else overall = 60 + Math.floor(score / 3.7);

  if (pts >= 28 && minutes >= 30) overall = Math.max(overall, 94);
  if (pts >= 24 && minutes >= 30) overall = Math.max(overall, 90);
  if (pts >= 20 && minutes >= 28) overall = Math.max(overall, 86);
  if (pts < 8 && minutes < 20) overall = Math.min(overall, 76);
  if (pts < 8 && minutes < 12) overall = Math.min(overall, 70);

  return clampNumber(overall, 60, 99);
}

function fallbackOverall(row) {
  const explicit = Number(row?.overall);
  if (Number.isFinite(explicit) && row.overall !== "") return clampNumber(explicit, 60, 99);
  const minutes = numberStat(row?.minutes);
  if (minutes >= 30) return 78;
  if (minutes >= 22) return 74;
  if (minutes >= 14) return 70;
  return 66;
}

function findPlayerStatsForRosterRow(row) {
  const stats = playerStatsRows();
  const nameKey = normalizePlayerName(row?.name);
  const teamId = teamIdFromName(row?.team);
  const abbr = teamId ? teamAbbr(teamId) : "";
  if (!nameKey || !abbr) return null;
  return stats.find((stat) => normalizePlayerName(stat.PLAYER_NAME) === nameKey && String(stat.TEAM_ABBREVIATION || "").toUpperCase() === abbr)
    || stats.find((stat) => normalizePlayerName(stat.PLAYER_NAME) === nameKey)
    || null;
}

function playerStatsRows() {
  if (Array.isArray(window.gameData?.playerStats) && window.gameData.playerStats.length) return window.gameData.playerStats;
  if (Array.isArray(window.nbaLocalData?.playerStats)) return window.nbaLocalData.playerStats;
  return [];
}

function playerDirectoryRows() {
  if (Array.isArray(window.gameData?.players) && window.gameData.players.length) return window.gameData.players;
  if (Array.isArray(window.nbaLocalData?.players)) return window.nbaLocalData.players;
  return [];
}

function findPlayerDirectoryId(name) {
  const key = normalizePlayerName(name);
  return playerDirectoryRows().find((playerRecord) => normalizePlayerName(playerRecord.fullName || playerRecord.full_name) === key)?.id || null;
}

function validateOverallRatings(players) {
  const table = players
    .map((player) => ({ name: player.name, team: teamAbbr(player.teamId), overall: player.overall ?? player.ovr, pts: player.importedStats?.PTS ?? null, min: player.importedStats?.MIN ?? null, source: player.ratingSource || "unknown" }))
    .sort((a, b) => Number(b.overall || 0) - Number(a.overall || 0) || Number(b.pts || 0) - Number(a.pts || 0))
    .slice(0, 50);
  console.info("[NBA Manager ratings] Top 50 players by calculated overall");
  console.table(table);

  players.forEach((player) => {
    const overall = Number(player.overall ?? player.ovr);
    const pts = player.importedStats?.PTS;
    if (!Number.isFinite(overall)) console.warn(`[NBA Manager ratings] Missing overall for ${player.name}.`);
    if (Number.isFinite(pts) && pts >= 20 && overall < 80) console.warn(`[NBA Manager ratings] ${player.name} averages ${pts} PPG but is only ${overall} OVR.`);
    if (Number.isFinite(pts) && pts < 8 && overall > 88) console.warn(`[NBA Manager ratings] ${player.name} averages ${pts} PPG but is ${overall} OVR.`);
    if (player.ratingSource !== "playerStats.json") console.info(`[NBA Manager ratings] No playerStats.json match for ${player.name}; using neutral fallback ${overall} OVR.`);
  });
}

function applyImportedOverallRatings(players) {
  let changed = false;
  players.forEach((player) => {
    const statRow = findPlayerStatsForPlayer(player);
    if (!statRow) {
      if (!Number.isFinite(Number(player.overall ?? player.ovr))) {
        player.ovr = fallbackOverall(player);
        player.overall = player.ovr;
        changed = true;
      }
      return;
    }
    const rating = calculateOverall(statRow);
    if (player.ovr !== rating || player.overall !== rating) changed = true;
    player.ovr = rating;
    player.overall = rating;
    player.ratingSource = "playerStats.json";
    player.importedStats = {
      PTS: numberStat(statRow.PTS),
      AST: numberStat(statRow.AST),
      REB: numberStat(statRow.REB),
      STL: numberStat(statRow.STL),
      BLK: numberStat(statRow.BLK),
      MIN: numberStat(statRow.MIN),
      FG_PCT: numberStat(statRow.FG_PCT),
      FG3_PCT: numberStat(statRow.FG3_PCT),
      AGE: numberStat(statRow.AGE)
    };
    if (player.scoutProfile) player.scoutProfile.hiddenOverall = rating;
  });
  if (changed) validateOverallRatings(players);
  return changed;
}

function findPlayerStatsForPlayer(player) {
  const stats = playerStatsRows();
  const nameKey = normalizePlayerName(player?.name);
  const team = getTeam(player?.teamId);
  if (!nameKey) return null;
  return stats.find((stat) => normalizePlayerName(stat.PLAYER_NAME) === nameKey && (!team || String(stat.TEAM_ABBREVIATION || "").toUpperCase() === team.abbr))
    || stats.find((stat) => normalizePlayerName(stat.PLAYER_NAME) === nameKey)
    || null;
}

function numberStat(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(Number(value) || min)));
}

function normalizePlayerName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizePosition(position) {
  if (position === "G") return "PG/SG";
  if (position === "F") return "SF/PF";
  if (position === "C") return "C";
  return position || "G/F";
}

function numberOr(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== "" ? Math.round(parsed) : fallback;
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slug(value) {
  return normalizeText(value).slice(0, 36) || "player";
}

function createSeasonSchedule(activeTeamId, season) {
  const opponents = nbaTeams.map(([id]) => id).filter((id) => id !== activeTeamId);
  const start = new Date(season, 9, 20);
  const end = new Date(season + 1, 3, 12);
  const span = end.getTime() - start.getTime();
  const schedule = Array.from({ length: 82 }, (_, index) => {
    const opponentId = opponents[(index * 11 + Math.floor(index / opponents.length) * 7) % opponents.length];
    const date = new Date(start.getTime() + (span * index) / 81);
    const homeGame = index % 2 === 0;
    return {
      id: `g-${season}-${activeTeamId}-${index + 1}`,
      date: localIsoDate(date),
      away: homeGame ? opponentId : activeTeamId,
      home: homeGame ? activeTeamId : opponentId,
      played: false
    };
  });
  applyNbaCupMarkers(schedule);
  return schedule;
}

function applyNbaCupMarkers(schedule) {
  schedule.forEach((game) => { delete game.nbaCup; });
  schedule.filter((game) => game.date.slice(5, 7) === "11").slice(0, 4).forEach((game) => { game.nbaCup = "Group Play"; });
  const knockoutRounds = ["Quarterfinal", "Semifinal", "Championship"];
  schedule.filter((game) => game.date.slice(5, 7) === "12").slice(0, 3).forEach((game, index) => { game.nbaCup = knockoutRounds[index]; });
}

function createSeasonEvents(season) {
  return [
    { id: `as-${season}-rising`, type: "rising-stars", date: `${season + 1}-02-13`, shortLabel: "Rising Stars", label: "Rising Stars", description: "The league's best young players open All-Star Weekend.", played: false, result: "" },
    { id: `as-${season}-skills`, type: "skills", date: `${season + 1}-02-14`, shortLabel: "Skills", label: "Skills Challenge", description: "Elite guards and versatile bigs race through the skills course.", played: false, result: "" },
    { id: `as-${season}-three`, type: "three-point", date: `${season + 1}-02-14`, shortLabel: "3-Point", label: "Three-Point Contest", description: "The league's top shooters compete from five racks.", played: false, result: "" },
    { id: `as-${season}-dunk`, type: "dunk", date: `${season + 1}-02-14`, shortLabel: "Dunk", label: "Dunk Contest", description: "High flyers compete for the night's signature trophy.", played: false, result: "" },
    { id: `as-${season}-game`, type: "all-star-game", date: `${season + 1}-02-15`, shortLabel: "All-Star Game", label: "NBA All-Star Game", description: "The best players from the East and West meet in the weekend finale.", played: false, result: "" }
  ];
}

function createTransactionCalendar(season) {
  const nextYear = season + 1;
  const tradeDeadline = nthWeekdayOfMonth(nextYear, 1, 4, 1);
  return [
    transactionEvent(season, "league-year", `${season}-07-01`, "League Year", "League Year Opens", "The new salary-cap year begins and the free-agency moratorium is active.", "Trades and agreements may be negotiated, but most contracts cannot be finalized."),
    transactionEvent(season, "signings", `${season}-07-06`, "FA Signings", "Free-Agent Signing Period", "The moratorium ends and agreed contracts can become official.", "Free agents may sign and completed offseason trades may be finalized."),
    transactionEvent(season, "camp", `${season}-09-28`, "Camp Opens", "Training Camp Opens", "Teams may bring expanded offseason rosters into camp.", "Evaluate camp players and prepare final roster cuts."),
    transactionEvent(season, "roster", `${season}-10-19`, "Roster Deadline", "Opening-Night Roster Deadline", "Regular-season rosters must be reduced to legal limits.", "Teams must carry no more than 15 standard contracts plus three two-way players."),
    transactionEvent(season, "extensions", `${season}-10-20`, "Extensions", "Rookie and Veteran Extension Deadline", "The preseason extension window closes at the start of the regular season.", "Eligible players who do not extend will continue toward restricted or unrestricted free agency."),
    transactionEvent(season, "trade-eligible", `${season}-12-15`, "Trade Eligible", "Newly Signed Players Become Trade Eligible", "Most players signed during the offseason can now be included in trades.", "The available trade market expands across the league."),
    transactionEvent(season, "ten-day", `${nextYear}-01-05`, "10-Day Deals", "10-Day Contract Window Opens", "Teams may begin signing eligible players to 10-day contracts.", "Short-term roster help is now available."),
    transactionEvent(season, "guarantee", `${nextYear}-01-10`, "Guarantee Date", "Leaguewide Contract Guarantee Date", "Non-guaranteed standard contracts become guaranteed for the rest of the season.", "Waive non-guaranteed players before this date to preserve flexibility."),
    transactionEvent(season, "trade-deadline", tradeDeadline, "Trade Deadline", "NBA Trade Deadline", "The in-season trading period closes at 3 p.m. ET.", "No further player or draft-pick trades may be completed this season."),
    transactionEvent(season, "waiver-playoffs", `${nextYear}-03-01`, "Waiver Deadline", "Playoff Eligibility Waiver Deadline", "Players must be waived by their previous team by this date to retain playoff eligibility elsewhere.", "Players waived after today cannot appear for a new team in the playoffs."),
    transactionEvent(season, "playoff-roster", `${nextYear}-04-13`, "Playoff Rosters", "Playoff Roster Deadline", "Postseason rosters are finalized after the regular season.", "Two-way players must be converted to standard contracts to occupy playoff roster spots."),
    transactionEvent(season, "lottery", `${nextYear}-05-10`, "Draft Lottery", "NBA Draft Lottery", "The lottery determines the order of the first 14 draft selections.", "Lottery odds and traded-pick protections resolve."),
    transactionEvent(season, "draft-one", `${nextYear}-06-23`, "Draft Round 1", "NBA Draft First Round", "Teams select the first round of the incoming rookie class.", "Draft picks and draft rights may be traded during the event."),
    transactionEvent(season, "draft-two", `${nextYear}-06-24`, "Draft Round 2", "NBA Draft Second Round", "The draft concludes with second-round selections.", "Second-round picks may sign standard, two-way, or overseas contracts."),
    transactionEvent(season, "options", `${nextYear}-06-29`, "Options + QO", "Options and Qualifying Offers Deadline", "Teams decide contract options and issue qualifying offers to eligible restricted free agents.", "Declined options create free agents; qualifying offers preserve matching rights."),
    transactionEvent(season, "fa-negotiation", `${nextYear}-06-30`, "FA Negotiation", "Free-Agent Negotiations Open", "Teams may begin negotiating with outside free agents at 6 p.m. ET.", "Agreements remain unofficial until the moratorium ends."),
    transactionEvent(season, "next-signings", `${nextYear}-07-06`, "Signings Open", "Free-Agent Signings Become Official", "The next signing period opens at 12:01 p.m. ET.", "Contracts, offer sheets, and agreed transactions may be finalized.")
  ];
}

function transactionEvent(season, type, date, shortLabel, label, description, impact) {
  return { id: `tx-${season}-${type}`, type, date, shortLabel, label, description, impact };
}

function normalizeTransactionCalendar(existing, season) {
  const events = createTransactionCalendar(season);
  (existing || []).forEach((oldEvent) => {
    const replacement = events.find((event) => event.type === oldEvent.type);
    if (replacement) Object.assign(replacement, oldEvent, { id: replacement.id, date: replacement.date });
  });
  return events;
}

function normalizeSeasonEvents(existing, season) {
  const events = createSeasonEvents(season);
  (existing || []).forEach((oldEvent) => {
    const replacement = events.find((event) => event.type === oldEvent.type || event.id === oldEvent.id);
    if (replacement) Object.assign(replacement, oldEvent, { id: replacement.id, date: replacement.date });
  });
  return events;
}

function createLeagueSchedule(activeTeamId, season, userSchedule) {
  const allTeamIds = nbaTeams.map(([id]) => id);
  return userSchedule.flatMap((userGame, roundIndex) => {
    const opponentId = userGame.home === activeTeamId ? userGame.away : userGame.home;
    const available = allTeamIds.filter((id) => id !== activeTeamId && id !== opponentId);
    const shift = roundIndex % available.length;
    const rotated = available.slice(shift).concat(available.slice(0, shift));
    const games = [];
    for (let index = 0; index < rotated.length / 2; index += 1) {
      const first = rotated[index];
      const second = rotated[rotated.length - 1 - index];
      const flip = (roundIndex + index) % 2 === 0;
      games.push({
        id: `lg-${season}-${roundIndex + 1}-${index + 1}`,
        date: userGame.date,
        away: flip ? first : second,
        home: flip ? second : first,
        played: false,
        nbaCup: userGame.nbaCup
      });
    }
    return games;
  });
}

function ensureLeagueStandingsState() {
  let changed = false;
  if (!Array.isArray(save.leagueResults)) {
    save.leagueResults = [];
    changed = true;
  }
  if (!Array.isArray(save.leagueSchedule) || !save.leagueSchedule.length) {
    save.leagueSchedule = createLeagueSchedule(save.activeTeamId, save.season, save.schedule);
    changed = true;
  }
  save.results.forEach((result) => {
    if (!save.leagueResults.some((candidate) => candidate.gameId === result.gameId)) {
      save.leagueResults.push({ ...result, playerStats: null });
      changed = true;
    }
  });
  const completedDates = [...new Set(save.schedule.filter((game) => game.played).map((game) => game.date))];
  completedDates.forEach((date) => {
    const resultCount = save.leagueResults.length;
    simulateLeagueGamesForDate(date);
    if (save.leagueResults.length !== resultCount) changed = true;
  });
  return changed;
}

function ensureSeasonFeatures() {
  let changed = false;
  const cupSignature = save.schedule.filter((game) => game.nbaCup).map((game) => `${game.id}:${game.nbaCup}`).join("|");
  applyNbaCupMarkers(save.schedule);
  const nextCupSignature = save.schedule.filter((game) => game.nbaCup).map((game) => `${game.id}:${game.nbaCup}`).join("|");
  if (cupSignature !== nextCupSignature) changed = true;
  const normalizedEvents = normalizeSeasonEvents(save.seasonEvents, save.season);
  if (!Array.isArray(save.seasonEvents) || save.seasonEvents.length !== normalizedEvents.length) changed = true;
  save.seasonEvents = normalizedEvents;
  const normalizedTransactions = normalizeTransactionCalendar(save.transactionEvents, save.season);
  if (!Array.isArray(save.transactionEvents) || save.transactionEvents.length !== normalizedTransactions.length) changed = true;
  save.transactionEvents = normalizedTransactions;
  if (!save.timelineDate) {
    save.timelineDate = latestPlayedDate(save.schedule) || `${save.season}-10-20`;
    changed = true;
  }
  return changed;
}

function ensurePlayerBoxScores() {
  let changed = false;
  save.results.forEach((result) => {
    if (result.playerStats) return;
    result.playerStats = {
      away: createPlayerBoxScore(result.away, result.awayScore, result.homeScore, `${result.gameId}-away`),
      home: createPlayerBoxScore(result.home, result.homeScore, result.awayScore, `${result.gameId}-home`)
    };
    changed = true;
  });
  return changed;
}

function createPlayerBoxScore(teamId, teamScore, opponentScore, seed) {
  ensureTeamRotation(teamId);
  const random = seededRandom(seed);
  let rotation = rotationPlayers(teamId).filter((player) => player.minutes > 0 && isPlayerGameEligible(player).ok);
  if (!rotation.length) rotation = rotationPlayers(teamId).filter((player) => isPlayerGameEligible(player).ok).slice(0, 10);
  const minutes = normalizedPlayerMinutes(rotation, 240);
  const weights = rotation.map((player, index) => {
    const offense = player.rim * 0.28 + player.three * 0.27 + player.mid * 0.18 + player.ovr * 0.27;
    return Math.max(1, minutes[index] * offense * (0.82 + random() * 0.36));
  });
  const points = allocateIntegerTotal(teamScore, weights);
  const margin = teamScore - opponentScore;
  return rotation.map((player, index) => {
    const min = minutes[index];
    const pts = points[index];
    let threePm = Math.min(Math.floor(pts / 3), Math.round(pts * (0.05 + player.three / 650) * (0.7 + random() * 0.5)));
    let remaining = pts - threePm * 3;
    let ftm = remaining % 2;
    if (remaining >= 4 && random() > 0.45) ftm += 2;
    if (remaining >= 8 && random() > 0.72) ftm += 2;
    if (ftm > remaining) ftm = remaining % 2;
    const twoPm = Math.max(0, (remaining - ftm) / 2);
    const fgm = twoPm + threePm;
    const threePa = threePm + Math.max(0, Math.round(min / 15 + random() * 2 - 0.5));
    const fga = fgm + Math.max(0, Math.round(min / 7 + random() * 3 - 1));
    const fta = ftm + Math.max(0, Math.round(random() * 1.5 - 0.2));
    const reb = Math.max(0, Math.round(min * (0.08 + (player.pos.includes("C") || player.pos.includes("F") ? 0.12 : 0.04)) * (0.75 + random() * 0.55)));
    const ast = Math.max(0, Math.round(min * (0.015 + player.pass / 1000) * (0.7 + random() * 0.55)));
    const stl = Math.max(0, Math.round(min * player.def / 1900 * (0.6 + random())));
    const blk = Math.max(0, Math.round(min * (player.pos.includes("C") ? player.def / 1550 : player.def / 3000) * random()));
    const tov = Math.max(0, Math.round((min / 18 + ast / 5) * (0.55 + random() * 0.75)));
    const plusMinus = Math.round(margin * (min / 48) + (random() - 0.5) * 10);
    return { playerId: player.id, name: player.name, pos: player.pos, min, fgm, fga: Math.max(fgm, fga), threePm, threePa: Math.max(threePm, threePa), ftm, fta: Math.max(ftm, fta), pts, reb, ast, stl, blk, tov, plusMinus };
  });
}

function normalizedPlayerMinutes(players, total) {
  const source = players.map((player) => Math.max(1, numberOr(player.minutes, 0)));
  const sourceTotal = source.reduce((sum, value) => sum + value, 0) || 1;
  const raw = source.map((value) => value / sourceTotal * total);
  const minutes = raw.map(Math.floor);
  let remaining = total - minutes.reduce((sum, value) => sum + value, 0);
  raw.map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)
    .slice(0, remaining)
    .forEach(({ index }) => { minutes[index] += 1; });
  return minutes;
}

function allocateIntegerTotal(total, weights) {
  const weightTotal = weights.reduce((sum, value) => sum + value, 0) || 1;
  const raw = weights.map((weight) => weight / weightTotal * total);
  const values = raw.map(Math.floor);
  let remaining = total - values.reduce((sum, value) => sum + value, 0);
  raw.map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction)
    .slice(0, remaining)
    .forEach(({ index }) => { values[index] += 1; });
  return values;
}

function seededRandom(seed) {
  let state = [...String(seed)].reduce((hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function normalizeSchedule(existing, results, activeTeamId, season) {
  if (Array.isArray(existing) && existing.length >= 20) return existing;
  const schedule = createSeasonSchedule(activeTeamId, season);
  (existing || []).filter((game) => game.played).forEach((oldGame, index) => {
    const replacement = schedule[index];
    if (!replacement) return;
    const result = (results || []).find((candidate) => candidate.gameId === oldGame.id) || (results || [])[index] || {};
    Object.assign(replacement, oldGame, result, { id: replacement.id, played: true });
  });
  return schedule;
}

function localIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function nthWeekdayOfMonth(year, monthIndex, weekday, occurrence) {
  const date = new Date(year, monthIndex, 1);
  const offset = (weekday - date.getDay() + 7) % 7;
  date.setDate(1 + offset + (occurrence - 1) * 7);
  return localIsoDate(date);
}

function addDays(value, days) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return localIsoDate(date);
}

function latestPlayedDate(schedule) {
  return [...(schedule || [])].filter((game) => game.played).sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.date || null;
}

function currentLeagueDate() {
  return save.timelineDate || latestPlayedDate(save.schedule) || `${save.season}-10-20`;
}

function transactionRuleState() {
  const date = currentLeagueDate();
  const eventDate = (type, fallback) => save.transactionEvents?.find((event) => event.type === type)?.date || fallback;
  return {
    tradesOpen: date <= eventDate("trade-deadline", `${save.season + 1}-02-08`),
    newlySignedTradeEligible: date >= eventDate("trade-eligible", `${save.season}-12-15`),
    tenDayContracts: date >= eventDate("ten-day", `${save.season + 1}-01-05`) && date <= `${save.season + 1}-04-12`,
    contractsGuaranteed: date >= eventDate("guarantee", `${save.season + 1}-01-10`),
    playoffWaiverEligible: date <= eventDate("waiver-playoffs", `${save.season + 1}-03-01`)
  };
}

function nextTransactionEvent() {
  const date = currentLeagueDate();
  return [...(save.transactionEvents || [])].sort((a, b) => a.date.localeCompare(b.date)).find((event) => event.date >= date) || null;
}

function formatGameDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatShortDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString([], { month: "short", day: "numeric" });
}

function activeTeam() {
  return getTeam(save.activeTeamId);
}

function teamPlayers(teamId) {
  return save.players.filter((player) => player.teamId === teamId);
}

function getTeam(id) {
  return save.teams.find((team) => team.id === id);
}

function getTeamFrom(source, id) {
  return source?.teams?.find((team) => team.id === id);
}

function teamName(id) {
  return getTeam(id)?.abbr ?? id;
}

function teamNameFrom(source, id) {
  const selected = getTeamFrom(source, id);
  return selected ? `${selected.city} ${selected.name}` : id;
}

function bestPlayer(teamId) {
  return teamPlayers(teamId).sort((a, b) => b.ovr - a.ovr)[0];
}

function teamRating(team) {
  const players = teamPlayers(team.id);
  ensureTeamRotation(team.id);
  const rotation = players.filter((player) => player.minutes > 0 && isPlayerGameEligible(player).ok);
  const totalMinutes = rotation.reduce((sum, player) => sum + player.minutes, 0);
  const base = !totalMinutes ? players.reduce((sum, player) => sum + player.ovr, 0) / Math.max(1, players.length) : rotation.reduce((sum, player) => sum + player.ovr * player.minutes, 0) / totalMinutes;
  const coach = save.coaching?.[team.id];
  const coachBonus = coach ? (coach.tactics - 70) * 0.06 : 0;
  const fatiguePenalty = rotation.reduce((sum, player) => sum + Number(player.fatigue || 0) * player.minutes, 0) / Math.max(1, totalMinutes) * 0.025;
  const chemistryBonus = save.lockerRooms?.[team.id] ? (lockerRoom(team.id).chemistry - 70) * .035 : 0;
  const moraleBonus = rotation.length ? (rotation.reduce((sum, player) => sum + Number(player.morale || 75), 0) / rotation.length - 75) * .025 : 0;
  return base + coachBonus + chemistryBonus + moraleBonus - fatiguePenalty;
}

function payrollStatus(team) {
  const levels = cbaThresholds(save.season);
  if (team.payroll >= levels.secondApron) return "second apron";
  if (team.payroll >= levels.firstApron) return "first apron";
  if (team.payroll >= levels.tax) return "tax team";
  if (team.payroll >= levels.cap) return "over cap";
  return "cap room";
}

function capFlex(team) {
  const levels = cbaThresholds(save.season);
  const room = levels.cap - team.payroll;
  if (room > 0) return `$${roundMoney(room).toFixed(1)}M room`;
  const taxGap = levels.tax - team.payroll;
  if (taxGap > 0) return `$${roundMoney(taxGap).toFixed(1)}M below tax`;
  return `$${roundMoney(Math.abs(taxGap)).toFixed(1)}M over tax`;
}

function cbaThresholds(season) {
  let rate = .1;
  try { rate = save?.leagueRules?.capGrowth ?? rate; } catch {}
  const growth = Math.pow(1 + rate, Math.max(0, season - 2025));
  return {
    cap: roundMoney(154.647 * growth),
    tax: roundMoney(187.895 * growth),
    firstApron: roundMoney(195.945 * growth),
    secondApron: roundMoney(207.824 * growth),
    mle: roundMoney(14.104 * growth),
    taxpayerMle: roundMoney(5.685 * growth),
    biAnnual: roundMoney(5.134 * growth)
  };
}

function rosterNeeds(team) {
  const players = teamPlayers(team.id);
  return {
    best: [...players].sort((a, b) => b.ovr - a.ovr)[0] || emptyPlayer(),
    potential: [...players].sort((a, b) => b.pot - a.pot)[0] || emptyPlayer(),
    oldest: [...players].sort((a, b) => b.age - a.age)[0] || emptyPlayer(),
    weakest: weakestPositionGroup(players)
  };
}

function suggestedRosterNeed(team) {
  if (team.payroll >= cbaThresholds(save.season).secondApron) return "Need: cap relief";
  const weakest = weakestPositionGroup(teamPlayers(team.id));
  if (weakest.includes("guard")) return "Need: backup guard";
  if (weakest.includes("wing")) return "Need: wing defense";
  if (weakest.includes("big")) return "Need: backup center";
  return "Need: bench depth";
}

function weakestPositionGroup(players) {
  const groups = [
    ["guard depth", players.filter((player) => player.pos.includes("G"))],
    ["wing depth", players.filter((player) => player.pos.includes("F"))],
    ["big depth", players.filter((player) => player.pos.includes("C"))]
  ];
  const ranked = groups
    .map(([label, group]) => [label, group.length ? group.reduce((sum, player) => sum + player.ovr, 0) / group.length : 0])
    .sort((a, b) => a[1] - b[1]);
  return ranked[0][0];
}

function frontOfficeInbox(team, last) {
  const messages = [];
  if (last) messages.push(`Recent final: ${teamName(last.away)} ${last.awayScore} at ${teamName(last.home)} ${last.homeScore}.`);
  messages.push(`${suggestedRosterNeed(team)}.`);
  if (team.payroll >= cbaThresholds(save.season).firstApron) messages.push(`Cap warning: ${teamName(team.id)} are operating near apron restrictions.`);
  else messages.push(`Cap note: ${capFlex(team)} before luxury tax pressure.`);
  const deadline = nextTransactionEvent();
  if (deadline) messages.push(`Next league deadline: ${deadline.label} on ${formatShortDate(deadline.date)}.`);
  messages.push(save.results.length ? "Season goal updated: opener completed." : "Season goal pending: win the opener.");
  messages.push(save.messages.at(-1) || "No front office messages yet.");
  return messages.slice(0, 5);
}

function emptyPlayer() {
  return { name: "None", ovr: 0, pot: 0, age: 0 };
}

function persist() {
  if (!save.saveDiagnostics) save.saveDiagnostics = { version: 1, lastAutosave: null };
  save.saveDiagnostics.lastAutosave = new Date().toISOString();
  storedSave = structuredClone(save);
  save.slotId = save.slotId || createSlotId();
  save.careerName = save.careerName || defaultCareerName(save);
  return window.nbaManager?.writeSaveSlot(save.slotId, save).then(refreshSlots);
}

boot();

async function refreshSlots() {
  saveSlots = (await window.nbaManager?.listSaveSlots()) || [];
  saveSlots.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

function createSlotId() {
  let id;
  do {
    const unique = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    id = `slot-${unique}`;
  } while (saveSlots.some((slot) => slot.id === id));
  return id;
}

function defaultCareerName(candidate) {
  const team = getTeamFrom(candidate, candidate.activeTeamId);
  return `${team ? team.abbr : String(candidate.activeTeamId || "NBA").toUpperCase()} ${candidate.mode || "Default"} ${candidate.season || 2026}`;
}

function formatDate(value) {
  if (!value) return "never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function styleWaiveButtons() {
  document
    .querySelectorAll(".in-season-fa-actions .btn")
    .forEach((element) => {
      const label = element.textContent
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (label === "waive" || label.includes("waive")) {
        element.style.setProperty("color", "#ff5d6c", "important");

        element.querySelectorAll("*").forEach((child) => {
          child.style.setProperty("color", "#ff5d6c", "important");
        });
      }
    });
}

const waiveButtonObserver = new MutationObserver(styleWaiveButtons);

waiveButtonObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

styleWaiveButtons();