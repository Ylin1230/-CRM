const ACTIVITY_STUDENT_FIELD = {
  activityName: "_widget_1778462323391",
  personName: "_widget_1778462323439",
  phone: "_widget_1778462323458",
  email: "_widget_1778462323477",
  company: "_widget_1778462323496",
  position: "_widget_1778462323515",
  gender: "_widget_1778462323579",
  education: "_widget_1778462323612",
  signupSource: "_widget_1778462323706",
  intention: "_widget_1778655214142",
  direction: "_widget_1778655214041",
  sourceCode: "_widget_1778654034413",
  repeatCount: "_widget_1778673212735"
};

const LEAD_FIELD = {
  code: "_widget_1771903380071",
  personName: "_widget_1771903284177",
  phone: "_widget_1771903284178",
  gender: "_widget_1771904316578",
  age: "_widget_1771903284180",
  direction: "_widget_1771903284181",
  submitTime: "_widget_1771903284182",
  education: "_widget_1771903284184",
  company: "_widget_1771903284185",
  position: "_widget_1771903284186",
  industry: "_widget_1771903284187",
  signupSource: "_widget_1771903284189",
  owner: "_widget_1778221025783",
  referrer: "_widget_1771903284191",
  intention: "_widget_1771903284192",
  email: "_widget_1771903284193",
  city: "_widget_1771912523597",
  meetup: "_widget_1778720174752",
  signup: "_widget_1778486902855",
  confirmed: "_widget_1778720174840",
  exam: "_widget_1778486902872",
  sourceCode: "_widget_1771903380373",
  status: "_widget_1771912718738"
};

const SOURCE_CONFIG = {
  activityStudent: {
    label: "活动学员",
    endpoint: "/api/activity-student/list",
    countEndpoint: "/api/activity-student/count",
    groupedEndpoint: "/api/activity-student/grouped",
    phoneField: ACTIVITY_STUDENT_FIELD.phone,
    nameField: ACTIVITY_STUDENT_FIELD.personName,
    fields: ACTIVITY_STUDENT_FIELD,
    columns: [
      { key: "personName", title: "姓名", field: ACTIVITY_STUDENT_FIELD.personName },
      { key: "phone", title: "手机号", field: ACTIVITY_STUDENT_FIELD.phone },
      { key: "activityName", title: "活动名称", field: ACTIVITY_STUDENT_FIELD.activityName },
      { key: "direction", title: "报考方向", field: ACTIVITY_STUDENT_FIELD.direction },
      { key: "company", title: "企业名称", field: ACTIVITY_STUDENT_FIELD.company },
      { key: "position", title: "职位", field: ACTIVITY_STUDENT_FIELD.position },
      { key: "repeatCount", title: "重复次数", field: ACTIVITY_STUDENT_FIELD.repeatCount }
    ],
    defaultTemplate:
      "【中国科大管理学院】{姓名}您好，您报名的{活动名称}即将开始，请留意活动通知并按时参加。如已收到请忽略。"
  },
  lead: {
    label: "潜在考生",
    endpoint: "/api/lead/list",
    countEndpoint: "/api/lead/count",
    phoneField: LEAD_FIELD.phone,
    nameField: LEAD_FIELD.personName,
    fields: LEAD_FIELD,
    columns: [
      { key: "personName", title: "姓名", field: LEAD_FIELD.personName },
      { key: "phone", title: "手机号", field: LEAD_FIELD.phone },
      { key: "direction", title: "报考方向", field: LEAD_FIELD.direction },
      { key: "company", title: "工作单位", field: LEAD_FIELD.company },
      { key: "position", title: "职务", field: LEAD_FIELD.position },
      { key: "signupSource", title: "来源渠道", field: LEAD_FIELD.signupSource },
      { key: "status", title: "线索状态", field: LEAD_FIELD.status }
    ],
    defaultTemplate:
      "【中国科大管理学院】{姓名}您好，关于您关注的{报考方向}项目，老师将为您提供报考信息提醒。如已收到请忽略。"
  }
};

const TEMPLATE_TEXT = {
  activity:
    "【中国科大管理学院】{姓名}您好，您报名的{活动名称}即将开始，请留意活动通知并按时参加。如已收到请忽略。",
  exam:
    "【中国科大管理学院】{姓名}您好，{报考方向}相关考试安排已更新，请及时查看通知并做好准备。如需咨询请联系招生老师。",
  follow:
    "【中国科大管理学院】{姓名}您好，老师想和您确认近期项目咨询情况，稍后会与您联系，请保持手机畅通。"
};

const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";

if (window.location.protocol === "file:") {
  window.location.replace("http://127.0.0.1:3000/sms.html");
  throw new Error("请通过后端服务地址打开消息推送页面");
}

const smsState = {
  sourceType: "activityStudent",
  rows: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedIds: new Set(),
  activityGroups: [],
  activeActivityId: "all",
  query: "",
  backendReady: false,
  apiReady: false,
  smsMode: "mock",
  smsProvider: "mock",
  emptyMessage: "暂无接收人数据",
  sendMode: "immediate"
};

const smsDom = {
  cloudState: document.querySelector("#smsCloudState"),
  reloadButton: document.querySelector("#smsReloadButton"),
  sourceCountTag: document.querySelector("#sourceCountTag"),
  selectedCountTag: document.querySelector("#selectedCountTag"),
  searchInput: document.querySelector("#recipientSearchInput"),
  clearSearchButton: document.querySelector("#clearRecipientSearchButton"),
  recipientWorkspace: document.querySelector("#recipientWorkspace"),
  activitySidebar: document.querySelector("#activitySmsSidebar"),
  activityList: document.querySelector("#activitySmsList"),
  activityCount: document.querySelector("#activitySmsCount"),
  listTitle: document.querySelector("#recipientListTitle"),
  listMeta: document.querySelector("#recipientListMeta"),
  selectCurrentActivityButton: document.querySelector("#selectCurrentActivityButton"),
  header: document.querySelector("#recipientHeader"),
  rows: document.querySelector("#recipientRows"),
  emptyState: document.querySelector("#recipientEmptyState"),
  recordSummary: document.querySelector("#recipientRecordSummary"),
  pageLabel: document.querySelector("#recipientPageLabel"),
  prevPageButton: document.querySelector("#recipientPrevPageButton"),
  nextPageButton: document.querySelector("#recipientNextPageButton"),
  pageSizeSelect: document.querySelector("#recipientPageSizeSelect"),
  scheduleField: document.querySelector("#scheduleField"),
  scheduledAt: document.querySelector("#scheduledAt"),
  content: document.querySelector("#smsContent"),
  charCount: document.querySelector("#smsCharCount"),
  modeTag: document.querySelector("#smsModeTag"),
  previewText: document.querySelector("#smsPreviewText"),
  composerHint: document.querySelector("#smsComposerHint"),
  sendButton: document.querySelector("#sendSmsButton"),
  statusText: document.querySelector("#smsStatusText"),
  reloadLogsButton: document.querySelector("#reloadSmsLogsButton"),
  logList: document.querySelector("#smsLogList")
};

initSmsPage();

async function initSmsPage() {
  bindSmsEvents();
  setDefaultScheduleTime();
  await loadSmsConfig();
  setTemplate(SOURCE_CONFIG[smsState.sourceType].defaultTemplate);
  await loadRecipients();
  await loadSmsLogs();
}

function bindSmsEvents() {
  document.querySelectorAll("[data-source]").forEach((button) => {
    button.addEventListener("click", () => switchSource(button.dataset.source));
  });

  document.querySelectorAll("[data-send-mode]").forEach((button) => {
    button.addEventListener("click", () => switchSendMode(button.dataset.sendMode));
  });

  document.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => setTemplate(TEMPLATE_TEXT[button.dataset.template]));
  });

  document.querySelectorAll("[data-variable]").forEach((button) => {
    button.addEventListener("click", () => insertVariable(button.dataset.variable));
  });

  smsDom.reloadButton.addEventListener("click", loadRecipients);
  smsDom.reloadLogsButton.addEventListener("click", loadSmsLogs);
  smsDom.selectCurrentActivityButton.addEventListener("click", selectVisibleActivityRows);
  smsDom.searchInput.addEventListener("input", () => {
    smsState.query = smsDom.searchInput.value.trim();
    renderRecipients();
  });
  smsDom.clearSearchButton.addEventListener("click", () => {
    smsState.query = "";
    smsDom.searchInput.value = "";
    renderRecipients();
  });
  smsDom.prevPageButton.addEventListener("click", () => {
    if (smsState.page > 1) {
      smsState.page -= 1;
      refreshRecipientPage();
    }
  });
  smsDom.nextPageButton.addEventListener("click", () => {
    if (smsState.page < recipientTotalPages()) {
      smsState.page += 1;
      refreshRecipientPage();
    }
  });
  smsDom.pageSizeSelect.addEventListener("change", () => {
    smsState.limit = Number(smsDom.pageSizeSelect.value);
    smsState.page = 1;
    refreshRecipientPage();
  });
  smsDom.content.addEventListener("input", renderComposer);
  smsDom.scheduledAt.addEventListener("input", renderComposer);
  smsDom.sendButton.addEventListener("click", sendSms);
}

async function loadSmsConfig() {
  try {
    const config = await getJson(apiUrl("/api/config"));
    smsState.backendReady = true;
    smsState.apiReady = Boolean(config.hasToken);
    smsState.smsMode = config.sms?.mode || "mock";
    smsState.smsProvider = config.sms?.provider || "mock";
    smsState.emptyMessage = smsState.apiReady
      ? "暂无接收人数据"
      : "后端已启动，但未配置百数云 API Token";
    smsDom.cloudState.textContent = smsState.apiReady
      ? `百数云已配置，短信${smsState.smsMode === "mock" ? "模拟发送" : "服务已配置"}`
      : "后端已启动，未配置百数云 API Token";
    smsDom.modeTag.textContent = smsState.smsMode === "mock" ? "模拟发送" : `服务商：${smsState.smsProvider}`;
  } catch {
    smsState.backendReady = false;
    smsState.apiReady = false;
    smsState.emptyMessage = "未连接后端，请先启动 backend 服务并通过 127.0.0.1:3000 打开";
    smsDom.cloudState.textContent = "后端未连接";
  }
}

async function switchSource(sourceType) {
  if (!SOURCE_CONFIG[sourceType] || smsState.sourceType === sourceType) {
    return;
  }

  smsState.sourceType = sourceType;
  smsState.page = 1;
  smsState.selectedIds.clear();
  smsState.activeActivityId = "all";
  smsState.query = "";
  smsDom.searchInput.value = "";
  document.querySelectorAll("[data-source]").forEach((button) => {
    button.classList.toggle("active", button.dataset.source === sourceType);
  });
  setTemplate(SOURCE_CONFIG[sourceType].defaultTemplate);
  await loadRecipients();
}

function refreshRecipientPage() {
  if (smsState.sourceType === "activityStudent") {
    renderRecipients();
    return;
  }
  loadRecipients();
}

function switchSendMode(mode) {
  smsState.sendMode = mode === "scheduled" ? "scheduled" : "immediate";
  document.querySelectorAll("[data-send-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sendMode === smsState.sendMode);
  });
  smsDom.scheduleField.hidden = smsState.sendMode !== "scheduled";
  renderComposer();
}

async function loadRecipients() {
  setStatus(`正在加载${SOURCE_CONFIG[smsState.sourceType].label}列表`);

  if (!smsState.apiReady) {
    smsState.rows = [];
    smsState.total = 0;
    smsState.activityGroups = [];
    renderRecipients();
    setStatus(smsState.emptyMessage);
    return;
  }

  try {
    const config = SOURCE_CONFIG[smsState.sourceType];
    if (smsState.sourceType === "activityStudent") {
      const result = await postJson(apiUrl(config.groupedEndpoint), {
        limit: 300
      });
      smsState.rows = extractRows(result);
      smsState.activityGroups = Array.isArray(result.activities) ? result.activities : buildActivityGroups(smsState.rows);
      smsState.total = Number(result.total || result.loaded || smsState.rows.length);
      if (!smsState.activityGroups.some((activity) => activity.id === smsState.activeActivityId)) {
        smsState.activeActivityId = "all";
      }
      smsState.emptyMessage = "暂无活动学员数据";
      renderRecipients();
      setStatus(`活动学员列表加载完成：${smsState.activityGroups.length} 场活动，${smsState.rows.length} 人`);
      return;
    }

    const requestBody = {
      page: smsState.page,
      limit: smsState.limit,
      skip: (smsState.page - 1) * smsState.limit
    };
    const [listResult, countResult] = await Promise.all([
      postJson(apiUrl(config.endpoint), requestBody),
      postJson(apiUrl(config.countEndpoint), {})
    ]);

    smsState.rows = extractRows(listResult);
    smsState.activityGroups = [];
    smsState.total = extractTotal(countResult, extractTotal(listResult, smsState.rows.length));
    smsState.emptyMessage = "暂无接收人数据";
    renderRecipients();
    setStatus(`${SOURCE_CONFIG[smsState.sourceType].label}列表加载完成`);
  } catch (error) {
    smsState.rows = [];
    smsState.total = 0;
    smsState.emptyMessage = `接口加载失败：${error.message}`;
    renderRecipients();
    setStatus(smsState.emptyMessage);
  }
}

function renderRecipients() {
  const config = SOURCE_CONFIG[smsState.sourceType];
  const visibleRows = visibleRecipientRows();
  const rows = pagedRecipientRows(visibleRows);
  smsDom.header.innerHTML = renderHeader(config);
  smsDom.rows.innerHTML = rows.map((row) => renderRecipientRow(row, config)).join("");
  smsDom.emptyState.textContent = smsState.emptyMessage;
  smsDom.emptyState.hidden = rows.length > 0;
  smsDom.recipientWorkspace.classList.toggle("lead-mode", smsState.sourceType !== "activityStudent");
  smsDom.activitySidebar.hidden = smsState.sourceType !== "activityStudent";
  smsDom.selectCurrentActivityButton.hidden = smsState.sourceType !== "activityStudent";
  smsDom.sourceCountTag.textContent = sourceCountText();
  smsDom.selectedCountTag.textContent = `已选 ${smsState.selectedIds.size} 人`;
  const summaryTotal = smsState.sourceType === "activityStudent"
    ? visibleRows.length
    : smsState.total || visibleRows.length;
  smsDom.recordSummary.textContent = `共 ${summaryTotal} 条，当前显示 ${rows.length} 条`;
  smsDom.pageLabel.textContent = `第 ${smsState.page} 页`;
  smsDom.prevPageButton.disabled = smsState.page <= 1;
  smsDom.nextPageButton.disabled = smsState.page >= recipientTotalPages();
  renderActivitySidebar();
  renderRecipientListHead(visibleRows);

  const checkAll = smsDom.header.querySelector("#recipientCheckAll");
  if (checkAll) {
    checkAll.checked = rows.length > 0 && rows.every((row) => smsState.selectedIds.has(rowId(row)));
    checkAll.indeterminate =
      rows.some((row) => smsState.selectedIds.has(rowId(row))) && !checkAll.checked;
    checkAll.addEventListener("change", () => {
      rows.forEach((row) => {
        const id = rowId(row);
        if (checkAll.checked && hasValidPhone(row, config)) {
          smsState.selectedIds.add(id);
        } else {
          smsState.selectedIds.delete(id);
        }
      });
      renderRecipients();
    });
  }

  smsDom.activityList.querySelectorAll("[data-activity-id]").forEach((button) => {
    button.addEventListener("click", () => {
      smsState.activeActivityId = button.dataset.activityId;
      smsState.page = 1;
      renderRecipients();
    });
  });

  smsDom.rows.querySelectorAll(".recipient-check").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        smsState.selectedIds.add(checkbox.dataset.id);
      } else {
        smsState.selectedIds.delete(checkbox.dataset.id);
      }
      renderRecipients();
    });
  });

  renderComposer();
}

function renderHeader(config) {
  const columns = config.columns
    .map((column) => `<th>${escapeHtml(column.title)}</th>`)
    .join("");
  return `
    <th class="check-col"><input id="recipientCheckAll" type="checkbox" aria-label="全选当前页" /></th>
    ${columns}
  `;
}

function renderRecipientRow(row, config) {
  const id = rowId(row);
  const checked = smsState.selectedIds.has(id) ? "checked" : "";
  const selectable = hasValidPhone(row, config);
  const selectedClass = smsState.selectedIds.has(id) ? "selected" : "";
  const cells = config.columns
    .map((column) => {
      const value = displayValue(row, column.field);
      const className = column.key === "phone" && !selectable ? "invalid-phone" : "";
      return `<td class="${className}">${escapeHtml(value || "-")}</td>`;
    })
    .join("");

  return `
    <tr class="${selectedClass}">
      <td class="check-col">
        <input class="recipient-check" data-id="${escapeHtml(id)}" type="checkbox" ${checked} ${selectable ? "" : "disabled"} aria-label="选择接收人" />
      </td>
      ${cells}
    </tr>
  `;
}

function sourceCountText() {
  if (smsState.sourceType === "activityStudent") {
    return `${smsState.activityGroups.length} 场 / ${smsState.rows.length} 人`;
  }
  return `${smsState.total || smsState.rows.length} 人`;
}

function renderActivitySidebar() {
  if (smsState.sourceType !== "activityStudent") {
    smsDom.activityList.innerHTML = "";
    smsDom.activityCount.textContent = "0 场";
    return;
  }

  const totalValid = smsState.rows.filter((row) => hasValidPhone(row, SOURCE_CONFIG.activityStudent)).length;
  const allSelected = smsState.activeActivityId === "all" ? "active" : "";
  const allCard = `
    <button class="activity-sms-item ${allSelected}" data-activity-id="all" type="button">
      <span class="activity-sms-name">全部活动</span>
      <span class="activity-sms-meta">${smsState.rows.length} 人，可发 ${totalValid} 人</span>
    </button>
  `;
  const cards = smsState.activityGroups
    .map((activity) => {
      const selected = activity.id === smsState.activeActivityId ? "active" : "";
      const code = activity.sourceCode ? `<span>${escapeHtml(activity.sourceCode)}</span>` : "";
      return `
        <button class="activity-sms-item ${selected}" data-activity-id="${escapeHtml(activity.id)}" type="button">
          <span class="activity-sms-name">${escapeHtml(activity.activityName || "未命名活动")}</span>
          <span class="activity-sms-meta">${escapeHtml(activity.total)} 人，可发 ${escapeHtml(activity.validPhoneCount)} 人</span>
          ${code}
        </button>
      `;
    })
    .join("");

  smsDom.activityCount.textContent = `${smsState.activityGroups.length} 场`;
  smsDom.activityList.innerHTML = allCard + cards;
}

function renderRecipientListHead(rows) {
  if (smsState.sourceType !== "activityStudent") {
    smsDom.listTitle.textContent = "潜在考生";
    smsDom.listMeta.textContent = "请选择潜在考生发送通知";
    return;
  }

  const activity = activeActivity();
  const title = activity ? activity.activityName || "未命名活动" : "全部活动学员";
  const validCount = rows.filter((row) => hasValidPhone(row, SOURCE_CONFIG.activityStudent)).length;
  smsDom.listTitle.textContent = smsState.activeActivityId === "all" ? "全部活动学员" : title;
  smsDom.listMeta.textContent = `当前列表 ${rows.length} 人，可发送 ${validCount} 人`;
}

function activeActivity() {
  return smsState.activityGroups.find((activity) => activity.id === smsState.activeActivityId);
}

function pagedRecipientRows(rows) {
  if (smsState.sourceType !== "activityStudent") {
    return rows;
  }
  const start = (smsState.page - 1) * smsState.limit;
  return rows.slice(start, start + smsState.limit);
}

function visibleRecipientRows() {
  const query = smsState.query.toLowerCase();
  const config = SOURCE_CONFIG[smsState.sourceType];
  return smsState.rows.filter((row) => {
    const matchesActivity =
      smsState.sourceType !== "activityStudent" ||
      smsState.activeActivityId === "all" ||
      activityIdForRow(row) === smsState.activeActivityId;
    const matchesQuery =
      !query ||
      config.columns.some((column) => displayValue(row, column.field).toLowerCase().includes(query));
    return matchesActivity && matchesQuery;
  });
}

function buildActivityGroups(rows) {
  const groups = new Map();
  for (const row of rows) {
    const activityName = displayValue(row, ACTIVITY_STUDENT_FIELD.activityName) || "未命名活动";
    const sourceCode = displayValue(row, ACTIVITY_STUDENT_FIELD.sourceCode);
    const id = activityIdForRow(row);
    if (!groups.has(id)) {
      groups.set(id, {
        id,
        activityName,
        sourceCode,
        total: 0,
        validPhoneCount: 0
      });
    }

    const group = groups.get(id);
    group.total += 1;
    if (hasValidPhone(row, SOURCE_CONFIG.activityStudent)) {
      group.validPhoneCount += 1;
    }
  }

  return Array.from(groups.values()).sort((left, right) => {
    if (right.total !== left.total) {
      return right.total - left.total;
    }
    return left.activityName.localeCompare(right.activityName, "zh-Hans-CN", {
      numeric: true,
      sensitivity: "base"
    });
  });
}

function activityIdForRow(row) {
  return (
    displayValue(row, ACTIVITY_STUDENT_FIELD.sourceCode) ||
    displayValue(row, ACTIVITY_STUDENT_FIELD.activityName) ||
    "未命名活动"
  );
}

function selectVisibleActivityRows() {
  if (smsState.sourceType !== "activityStudent") {
    return;
  }

  const rows = visibleRecipientRows();
  rows.forEach((row) => {
    if (hasValidPhone(row, SOURCE_CONFIG.activityStudent)) {
      smsState.selectedIds.add(rowId(row));
    }
  });
  renderRecipients();
}

function hasValidPhone(row, config) {
  return Boolean(normalizeSmsPhone(displayValue(row, config.phoneField)));
}

function setTemplate(text) {
  smsDom.content.value = text || "";
  renderComposer();
}

function insertVariable(variable) {
  const token = `{${variable}}`;
  const input = smsDom.content;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  input.value = `${input.value.slice(0, start)}${token}${input.value.slice(end)}`;
  input.focus();
  input.setSelectionRange(start + token.length, start + token.length);
  renderComposer();
}

function renderComposer() {
  const selected = selectedRecipientRows();
  const content = smsDom.content.value.trim();
  smsDom.charCount.textContent = `${content.length}/500`;
  smsDom.charCount.classList.toggle("danger-text", content.length > 500);
  smsDom.sendButton.disabled =
    selected.length === 0 ||
    !content ||
    content.length > 500 ||
    (smsState.sendMode === "scheduled" && !smsDom.scheduledAt.value);
  smsDom.sendButton.textContent = smsState.sendMode === "scheduled" ? "预约发送" : "发送";

  if (!selected.length) {
    smsDom.previewText.textContent = "请选择接收人并填写通知内容";
    smsDom.composerHint.textContent = "请选择接收人";
    return;
  }

  const preview = buildSmsRecipient(selected[0]);
  smsDom.previewText.textContent = content
    ? renderSmsContent(content, preview)
    : "请填写通知内容";
  smsDom.composerHint.textContent = `${smsState.sendMode === "scheduled" ? "预约" : "立即"}发送给 ${selected.length} 人`;
}

function selectedRecipientRows() {
  return smsState.rows.filter((row) => smsState.selectedIds.has(rowId(row)));
}

async function sendSms() {
  const selected = selectedRecipientRows();
  const content = smsDom.content.value.trim();
  if (!selected.length || !content) {
    renderComposer();
    return;
  }

  const message =
    smsState.sendMode === "scheduled"
      ? `确认预约发送给 ${selected.length} 人？`
      : `确认向 ${selected.length} 人发送短信？`;
  if (!confirm(message)) {
    return;
  }

  try {
    smsDom.sendButton.disabled = true;
    setStatus("正在提交短信任务");
    const payload = {
      sourceType: smsState.sourceType,
      sendMode: smsState.sendMode,
      scheduledAt: smsState.sendMode === "scheduled" ? smsDom.scheduledAt.value : "",
      content,
      recipients: selected.map(buildSmsRecipient)
    };
    const result = await postJson(apiUrl("/api/sms/send"), payload);
    showSendResult(result);
    smsState.selectedIds.clear();
    renderRecipients();
    await loadSmsLogs();
  } catch (error) {
    setStatus(`发送失败：${error.message}`);
    smsDom.composerHint.textContent = `发送失败：${error.message}`;
  } finally {
    renderComposer();
  }
}

function showSendResult(result) {
  if (result.scheduled) {
    const time = formatDateTime(result.job?.scheduledAt);
    setStatus(`已创建预约发送任务：${time}`);
    smsDom.composerHint.textContent = "预约任务已创建";
    return;
  }

  const modeText = result.mode === "mock" ? "模拟发送完成" : "发送任务完成";
  setStatus(`${modeText}：成功 ${result.successCount || 0} 人，失败 ${result.failCount || 0} 人`);
  smsDom.composerHint.textContent = `${modeText}，批次 ${result.batchId || "-"}`;
}

function buildSmsRecipient(row) {
  const config = SOURCE_CONFIG[smsState.sourceType];
  const fields = {};
  config.columns.forEach((column) => {
    fields[column.title] = displayValue(row, column.field);
    fields[column.key] = displayValue(row, column.field);
  });
  fields.name = displayValue(row, config.nameField);
  fields.phone = displayValue(row, config.phoneField);

  return {
    id: rowId(row),
    name: displayValue(row, config.nameField),
    phone: normalizeSmsPhone(displayValue(row, config.phoneField)),
    fields
  };
}

function renderSmsContent(content, recipient) {
  return String(content || "").replace(/\{([^}]+)\}/g, (match, rawKey) => {
    const key = rawKey.trim();
    const value = recipient.fields?.[key] || recipient[key] || "";
    return value || match;
  });
}

async function loadSmsLogs() {
  try {
    const result = await getJson(apiUrl("/api/sms/logs"));
    renderSmsLogs(result);
  } catch (error) {
    smsDom.logList.innerHTML = `<div class="sms-log-empty">发送记录加载失败：${escapeHtml(error.message)}</div>`;
  }
}

function renderSmsLogs(result) {
  const jobs = Array.isArray(result.jobs) ? result.jobs : [];
  const logs = Array.isArray(result.logs) ? result.logs : [];
  const items = [
    ...jobs.map((job) => ({ type: "job", item: job })),
    ...logs.map((log) => ({ type: "log", item: log }))
  ]
    .sort((a, b) => logTime(b) - logTime(a))
    .slice(0, 12);

  if (!items.length) {
    smsDom.logList.innerHTML = '<div class="sms-log-empty">暂无发送记录</div>';
    return;
  }

  smsDom.logList.innerHTML = items.map(renderSmsLogItem).join("");
}

function renderSmsLogItem(entry) {
  const item = entry.item;
  const isJob = entry.type === "job";
  const sourceLabel = SOURCE_CONFIG[item.sourceType]?.label || "接收人";
  const statusText = isJob ? jobStatusText(item.status) : "已发送";
  const statusClass = isJob && ["failed", "partial"].includes(item.status) ? "warning" : "success";
  const time = formatDateTime(item.createdAt || item.scheduledAt);
  const total = Number(item.total || 0);
  const success = Number(item.successCount || 0);
  const fail = Number(item.failCount || 0);

  return `
    <article class="sms-log-item">
      <div class="sms-log-main">
        <span class="tag ${statusClass}">${escapeHtml(statusText)}</span>
        <strong>${escapeHtml(sourceLabel)}</strong>
        <span>${escapeHtml(time || "-")}</span>
      </div>
      <div class="sms-log-meta">
        <span>共 ${total} 人</span>
        ${success || fail ? `<span>成功 ${success} / 失败 ${fail}</span>` : ""}
        ${isJob && item.scheduledAt ? `<span>预约 ${escapeHtml(formatDateTime(item.scheduledAt))}</span>` : ""}
      </div>
      <p>${escapeHtml(item.content || "")}</p>
    </article>
  `;
}

function logTime(entry) {
  const item = entry.item;
  return new Date(item.createdAt || item.scheduledAt || item.sentAt || 0).getTime();
}

function jobStatusText(status) {
  return (
    {
      scheduled: "待发送",
      sending: "发送中",
      sent: "已发送",
      partial: "部分失败",
      failed: "失败"
    }[status] || "任务"
  );
}

function setDefaultScheduleTime() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  smsDom.scheduledAt.value = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function rowId(row) {
  const config = SOURCE_CONFIG[smsState.sourceType];
  return String(
    row._id ||
      row.id ||
      row.data_id ||
      row.entry_id ||
      `${displayValue(row, config.phoneField)}-${displayValue(row, config.nameField)}`
  );
}

function displayValue(row, key) {
  const value = row?.[key];
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(readComplexValue).filter(Boolean).join(" / ");
  }
  return readComplexValue(value);
}

function readComplexValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value !== "object") {
    return String(value);
  }

  const direct =
    value.name ||
    value.label ||
    value.text ||
    value.value ||
    value.title ||
    value.full_address ||
    value.address;

  if (direct) {
    return String(direct);
  }

  return Object.values(value)
    .filter((item) => typeof item === "string" || typeof item === "number")
    .join(" / ");
}

function extractRows(result) {
  if (Array.isArray(result)) {
    return result;
  }
  if (Array.isArray(result?.data)) {
    return result.data;
  }
  if (Array.isArray(result?.data?.data)) {
    return result.data.data;
  }
  if (Array.isArray(result?.data?.list)) {
    return result.data.list;
  }
  if (Array.isArray(result?.list)) {
    return result.list;
  }
  if (Array.isArray(result?.rows)) {
    return result.rows;
  }
  return [];
}

function extractTotal(result, fallback) {
  return (
    Number(result?.data?.total) ||
    Number(result?.total) ||
    Number(result?.data?.count) ||
    Number(result?.count) ||
    fallback
  );
}

function recipientTotalPages() {
  if (smsState.sourceType === "activityStudent") {
    return Math.max(1, Math.ceil((visibleRecipientRows().length || 1) / smsState.limit));
  }
  return Math.max(1, Math.ceil((smsState.total || visibleRecipientRows().length || 1) / smsState.limit));
}

function normalizeSmsPhone(value) {
  const phone = String(value || "").replace(/\D/g, "");
  return /^\d{6,20}$/.test(phone) ? phone : "";
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return String(value).replace("T", " ").slice(0, 16);
  }

  const pad = (item) => String(item).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function setStatus(text) {
  smsDom.statusText.textContent = text;
}

function apiUrl(path) {
  return `${API_BASE_PATH}${path}`;
}

async function getJson(url) {
  const response = await fetch(url);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "请求失败");
  }
  return payload;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
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
