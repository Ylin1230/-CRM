const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";

const state = {
  busy: false,
  lastResult: null,
  currentMember: null
};

const dom = {
  aiContextText: document.querySelector("#aiContextText"),
  aiModeText: document.querySelector("#aiModeText"),
  refreshContextButton: document.querySelector("#refreshContextButton"),
  aiCards: document.querySelector("#aiCards"),
  chatStream: document.querySelector("#chatStream"),
  quickQuestions: document.querySelector("#quickQuestions"),
  aiForm: document.querySelector("#aiForm"),
  aiInput: document.querySelector("#aiInput"),
  sendButton: document.querySelector("#sendButton"),
  warningList: document.querySelector("#warningList")
};

const QUICK_QUESTIONS = [
  "本周哪个活动报名最多？",
  "今天新增了多少潜在考生？",
  "有哪些线索还没分配对接人？",
  "哪些跟进已经超期？",
  "最近报名趋势有没有异常？"
];

init();

function init() {
  renderQuickQuestions();
  bindEvents();
  loadCurrentMember();
}

function bindEvents() {
  dom.aiForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = dom.aiInput.value.trim();
    if (!question || state.busy) {
      return;
    }
    dom.aiInput.value = "";
    await askQuestion(question);
  });

  dom.refreshContextButton.addEventListener("click", loadCurrentMember);

  document.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.question || button.textContent.trim();
      askQuestion(question);
    });
  });
}

function renderQuickQuestions() {
  dom.quickQuestions.innerHTML = QUICK_QUESTIONS
    .map((question) => `<button type="button" data-quick-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`)
    .join("");
  dom.quickQuestions.querySelectorAll("[data-quick-question]").forEach((button) => {
    button.addEventListener("click", () => askQuestion(button.dataset.quickQuestion || ""));
  });
}

async function loadCurrentMember() {
  try {
    dom.aiContextText.textContent = "正在识别当前登录人";
    const payload = await postJson(apiUrl("/api/current-member"), buildCurrentContext());
    state.currentMember = payload.member || null;
    const memberName = payload.member?.name || "未识别";
    const deptName = payload.member?.mainDeptName || "未识别部门";
    dom.aiContextText.textContent = `当前登录人：${memberName} / ${deptName}，只读问数模式`;
  } catch (error) {
    dom.aiContextText.textContent = `当前登录人识别失败：${error.message}`;
  }
}

async function askQuestion(question) {
  state.busy = true;
  dom.sendButton.disabled = true;
  appendMessage("user", question);
  const pendingId = appendMessage("assistant", "正在读取 CRM 数据并分析...");
  scrollToBottom();

  try {
    const payload = await postJson(apiUrl("/api/ai/chat"), {
      message: question,
      ...buildCurrentContext()
    });
    state.lastResult = payload;
    replaceAssistantMessage(pendingId, renderAnswer(payload));
    renderCards(payload.cards || []);
    renderWarnings(payload.warnings || []);
    dom.aiModeText.textContent = payload.mode || "read-only";
  } catch (error) {
    replaceAssistantMessage(pendingId, `<p class="ai-error">分析失败：${escapeHtml(error.message)}</p>`);
  } finally {
    state.busy = false;
    dom.sendButton.disabled = false;
    dom.aiInput.focus();
    scrollToBottom();
  }
}

function renderAnswer(payload) {
  const paragraphs = String(payload.answer || "暂无回答")
    .split(/\n+/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
  const warningHtml = (payload.warnings || []).length
    ? `<div class="ai-alert-list">${payload.warnings.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`
    : "";
  const tableHtml = (payload.tables || []).map(renderResultTable).join("");
  const suggestionHtml = (payload.suggestions || []).length
    ? `<div class="ai-answer-suggestions">
        <strong>建议继续追问</strong>
        ${(payload.suggestions || []).map((item) => `<button type="button" data-follow-question="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
      </div>`
    : "";

  return `
    ${paragraphs}
    ${warningHtml}
    ${tableHtml}
    ${suggestionHtml}
    <div class="ai-answer-note">${escapeHtml(payload.note || "只读分析，不会修改数据。")}</div>
  `;
}

function renderResultTable(table) {
  const columns = table.columns || [];
  const rows = table.rows || [];
  return `
    <div class="ai-result-table">
      <strong>${escapeHtml(table.title || "分析结果")}</strong>
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCards(cards) {
  if (!cards.length) {
    return;
  }
  dom.aiCards.innerHTML = cards.map((card) => `
    <div class="ai-kpi-card">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
      <em>${escapeHtml(card.hint || "")}</em>
    </div>
  `).join("");
}

function renderWarnings(warnings) {
  dom.warningList.innerHTML = warnings.length
    ? warnings.map((warning) => `<div class="ai-warning-item">${escapeHtml(warning)}</div>`).join("")
    : `<div class="ai-empty-side">本次分析未发现明显预警。</div>`;
}

function appendMessage(role, htmlOrText) {
  const id = `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const isAssistant = role === "assistant";
  const message = document.createElement("article");
  message.className = `ai-message ${isAssistant ? "assistant" : "user"}`;
  message.dataset.messageId = id;
  message.innerHTML = `
    <div class="ai-avatar">${isAssistant ? "AI" : "我"}</div>
    <div class="ai-bubble">${isAssistant ? htmlOrText : `<p>${escapeHtml(htmlOrText)}</p>`}</div>
  `;
  dom.chatStream.appendChild(message);
  bindFollowQuestionButtons(message);
  return id;
}

function replaceAssistantMessage(id, html) {
  const bubble = dom.chatStream.querySelector(`[data-message-id="${CSS.escape(id)}"] .ai-bubble`);
  if (!bubble) {
    return;
  }
  bubble.innerHTML = html;
  bindFollowQuestionButtons(bubble);
}

function bindFollowQuestionButtons(root) {
  root.querySelectorAll("[data-follow-question]").forEach((button) => {
    button.addEventListener("click", () => askQuestion(button.dataset.followQuestion || button.textContent.trim()));
  });
}

function buildCurrentContext() {
  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  return {
    url: window.location.href,
    query: params,
    current: params
  };
}

function scrollToBottom() {
  dom.chatStream.scrollTop = dom.chatStream.scrollHeight;
}

function apiUrl(path) {
  return `${API_BASE_PATH}${path}`;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body || {})
  });
  const payload = await response.json();
  if (!response.ok || payload?.errcode || payload?.code >= 400 || payload?.ok === false) {
    throw new Error(payload?.msg || payload?.message || "请求失败");
  }
  return payload;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
