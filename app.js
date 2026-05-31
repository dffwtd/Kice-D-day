const MAJOR_TYPES = new Set(["6모", "9모", "수능"]);

const state = {
  events: [],
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  majorCards: $("#majorCards"),
  otherCards: $("#otherCards"),
};

const todayKey = () => toDateKey(new Date());

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysUntil(dateKey) {
  const today = parseLocalDate(todayKey());
  const target = parseLocalDate(dateKey);
  return Math.ceil((target - today) / 86400000);
}

function formatDate(dateKey) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  })
    .format(parseLocalDate(dateKey))
    .replace(/\.$/, "");
}

function formatDday(dateKey) {
  const days = daysUntil(dateKey);
  if (days === 0) return "D-Day";
  if (days > 0) return `D-${days}`;
  return `D+${Math.abs(days)}`;
}

async function loadEvents() {
  const response = await fetch("./data/events.json", { cache: "no-store" });
  if (!response.ok) throw new Error("일정 데이터를 불러오지 못했습니다.");
  state.events = normalizeEvents(await response.json());
}

function normalizeEvents(events) {
  return events
    .filter((event) => event.active !== false)
    .map((event) => ({
      id: event.id || `${event.year}-${event.type}-${event.date}`,
      year: Number(event.year),
      type: event.type || "기타",
      name: event.name || "이름 없는 일정",
      date: event.date,
      organizer: event.organizer || "",
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function render() {
  renderCards(elements.majorCards, state.events.filter((event) => MAJOR_TYPES.has(event.type)));
  renderCards(elements.otherCards, state.events.filter((event) => !MAJOR_TYPES.has(event.type)));
}

function renderCards(container, events) {
  const template = $("#cardTemplate");
  container.innerHTML = "";

  if (!events.length) {
    container.innerHTML = `<p class="muted">표시할 일정이 없습니다.</p>`;
    return;
  }

  events.forEach((event) => {
    const card = template.content.cloneNode(true);
    card.querySelector(".badge").textContent = event.type;
    card.querySelector("h3").textContent = event.name;
    card.querySelector(".date-line").textContent = formatDate(event.date);
    card.querySelector(".organizer-line").textContent = event.organizer;
    card.querySelector(".dday").textContent = formatDday(event.date);
    container.append(card);
  });
}


loadEvents()
  .then(render)
  .catch((error) => {
    elements.majorCards.innerHTML = `<p class="muted">${error.message}</p>`;
  });
