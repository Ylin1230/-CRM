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
  owner: "_widget_1771912523513",
  ownerText: "_widget_1778221025783",
  referrer: "_widget_1771903284191",
  intention: "_widget_1771903284192",
  email: "_widget_1771903284193",
  city: "_widget_1771912523597",
  meetup: "_widget_1778720174752",
  signup: "_widget_1778486902855",
  confirmed: "_widget_1778720174840",
  exam: "_widget_1778486902872",
  firstContact: "_widget_1771903284194",
  latestContact: "_widget_1771913317568",
  contactReport: "_widget_1771903284195",
  sourceCode: "_widget_1771903380373",
  status: "_widget_1771912718738"
};

const FOLLOWUP_FIELD = {
  personName: "_widget_1771904507105",
  method: "_widget_1771904506884",
  contactTime: "_widget_1771904506860",
  nextTime: "_widget_1778720501084",
  content: "_widget_1771913349956",
  leadCode: "_widget_1771904507023",
  customerCode: "_widget_1771912879095",
  owner: "_widget_1778720501177"
};

if (window.location.protocol === "file:") {
  window.location.replace("http://127.0.0.1:3000/leads.html");
  throw new Error("请通过后端服务地址打开页面");
}

const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";

const OPTIONS = {
  direction: [
    "",
    "非全日制科创EMBA",
    "非全日制MBA综合管理方向",
    "非全日制MBA科技金融方向",
    "非全日制MBA科技创业方向",
    "非全日制MBA人工智能商业应用方向",
    "全日制MBA",
    "创新企业家学者（DBA直通车）项目",
    "科技企业家学者（DBA直通车）项目",
    "科技投资人",
    "科技创新班",
    "AI时代管理思维",
    "科创企业家全球资产配置班",
    "AI商业架构师认证"
  ],
  education: ["", "大专", "本科", "硕士", "博士"],
  industry: ["", "制造业", "金融业", "信息技术", "教育培训", "医疗健康", "政府/事业单位", "贸易/服务业", "其他"],
  signupSource: [
    "",
    "推广链接",
    "朋友圈推广",
    "微信公众号",
    "招生老师邀约",
    "校友/在校生",
    "公众号等新媒体",
    "校友推荐",
    "EMBA 伯乐推荐",
    "小红书",
    "其他"
  ],
  intention: ["", "A", "B有意向", "C需跟进", "D无效"],
  status: ["", "新线索", "已分配", "已报考", "无效"],
  followMethod: ["线上沟通", "电话沟通", "微信沟通", "面谈", "短信", "其他"]
};

const state = {
  rows: [],
  users: [],
  followRows: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedIds: new Set(),
  detailId: "",
  lastSelectedId: "",
  query: "",
  apiReady: false,
  emptyMessage: "暂无潜在考生数据"
};

const dom = {
  newLeadButton: document.querySelector("#newLeadButton"),
  batchAssignButton: document.querySelector("#batchAssignButton"),
  confirmAdmissionButton: document.querySelector("#confirmAdmissionButton"),
  archiveLeadButton: document.querySelector("#archiveLeadButton"),
  deleteLeadButton: document.querySelector("#deleteLeadButton"),
  reloadLeadsButton: document.querySelector("#reloadLeadsButton"),
  leadSearchInput: document.querySelector("#leadSearchInput"),
  leadCheckAll: document.querySelector("#leadCheckAll"),
  leadRows: document.querySelector("#leadRows"),
  leadEmptyState: document.querySelector("#leadEmptyState"),
  leadRecordSummary: document.querySelector("#leadRecordSummary"),
  leadPrevPageButton: document.querySelector("#leadPrevPageButton"),
  leadNextPageButton: document.querySelector("#leadNextPageButton"),
  leadPageLabel: document.querySelector("#leadPageLabel"),
  leadPageSizeSelect: document.querySelector("#leadPageSizeSelect"),
  leadDetailMask: document.querySelector("#leadDetailMask"),
  leadDetailPage: document.querySelector("#leadDetailPage"),
  closeLeadDetailButton: document.querySelector("#closeLeadDetailButton"),
  editLeadDetailButton: document.querySelector("#editLeadDetailButton"),
  detailConfirmAdmissionButton: document.querySelector("#detailConfirmAdmissionButton"),
  detailArchiveButton: document.querySelector("#detailArchiveButton"),
  prevLeadDetailButton: document.querySelector("#prevLeadDetailButton"),
  nextLeadDetailButton: document.querySelector("#nextLeadDetailButton"),
  leadDetailPosition: document.querySelector("#leadDetailPosition"),
  leadDetailTitle: document.querySelector("#leadDetailTitle"),
  followRows: document.querySelector("#followRows"),
  followEmpty: document.querySelector("#followEmpty"),
  newFollowButton: document.querySelector("#newFollowButton"),
  leadDrawerMask: document.querySelector("#leadDrawerMask"),
  leadDrawer: document.querySelector("#leadDrawer"),
  leadDrawerTitle: document.querySelector("#leadDrawerTitle"),
  closeLeadDrawerButton: document.querySelector("#closeLeadDrawerButton"),
  leadForm: document.querySelector("#leadForm"),
  leadRecordId: document.querySelector("#leadRecordId"),
  leadCodeInput: document.querySelector("#leadCodeInput"),
  leadNameInput: document.querySelector("#leadNameInput"),
  leadPhoneInput: document.querySelector("#leadPhoneInput"),
  leadGenderInput: document.querySelector("#leadGenderInput"),
  leadAgeInput: document.querySelector("#leadAgeInput"),
  leadDirectionInput: document.querySelector("#leadDirectionInput"),
  leadSubmitTimeInput: document.querySelector("#leadSubmitTimeInput"),
  leadEducationInput: document.querySelector("#leadEducationInput"),
  leadCompanyInput: document.querySelector("#leadCompanyInput"),
  leadPositionInput: document.querySelector("#leadPositionInput"),
  leadIndustryInput: document.querySelector("#leadIndustryInput"),
  leadSourceInput: document.querySelector("#leadSourceInput"),
  leadOwnerInput: document.querySelector("#leadOwnerInput"),
  leadReferrerInput: document.querySelector("#leadReferrerInput"),
  leadIntentionInput: document.querySelector("#leadIntentionInput"),
  leadEmailInput: document.querySelector("#leadEmailInput"),
  leadCityInput: document.querySelector("#leadCityInput"),
  leadMeetupInput: document.querySelector("#leadMeetupInput"),
  leadSignupInput: document.querySelector("#leadSignupInput"),
  leadConfirmedInput: document.querySelector("#leadConfirmedInput"),
  leadExamInput: document.querySelector("#leadExamInput"),
  leadFirstContactInput: document.querySelector("#leadFirstContactInput"),
  leadLatestContactInput: document.querySelector("#leadLatestContactInput"),
  leadStatusInput: document.querySelector("#leadStatusInput"),
  leadReportInput: document.querySelector("#leadReportInput"),
  leadFormHint: document.querySelector("#leadFormHint"),
  cancelLeadButton: document.querySelector("#cancelLeadButton"),
  followDrawerMask: document.querySelector("#followDrawerMask"),
  followDrawer: document.querySelector("#followDrawer"),
  closeFollowDrawerButton: document.querySelector("#closeFollowDrawerButton"),
  followForm: document.querySelector("#followForm"),
  followNameInput: document.querySelector("#followNameInput"),
  followMethodInput: document.querySelector("#followMethodInput"),
  followContactTimeInput: document.querySelector("#followContactTimeInput"),
  followNextTimeInput: document.querySelector("#followNextTimeInput"),
  followContentInput: document.querySelector("#followContentInput"),
  followFormHint: document.querySelector("#followFormHint"),
  cancelFollowButton: document.querySelector("#cancelFollowButton"),
  assignModal: document.querySelector("#assignModal"),
  closeAssignModalButton: document.querySelector("#closeAssignModalButton"),
  cancelAssignButton: document.querySelector("#cancelAssignButton"),
  saveAssignButton: document.querySelector("#saveAssignButton"),
  assignOwnerInput: document.querySelector("#assignOwnerInput"),
  assignHint: document.querySelector("#assignHint")
};

const detailFieldMap = [
  ["#detailLeadCode", LEAD_FIELD.code],
  ["#detailLeadName", LEAD_FIELD.personName],
  ["#detailLeadPhone", LEAD_FIELD.phone],
  ["#detailLeadGender", LEAD_FIELD.gender, genderTag],
  ["#detailLeadAge", LEAD_FIELD.age],
  ["#detailLeadDirection", LEAD_FIELD.direction, directionTag],
  ["#detailLeadSubmitTime", LEAD_FIELD.submitTime, normalizeDateTimeText],
  ["#detailLeadEducation", LEAD_FIELD.education, educationTag],
  ["#detailLeadCompany", LEAD_FIELD.company],
  ["#detailLeadPosition", LEAD_FIELD.position],
  ["#detailLeadIndustry", LEAD_FIELD.industry],
  ["#detailLeadSource", LEAD_FIELD.signupSource],
  ["#detailLeadOwner", LEAD_FIELD.ownerText, (_, row) => escapeHtml(ownerName(row) || "-")],
  ["#detailLeadReferrer", LEAD_FIELD.referrer],
  ["#detailLeadIntention", LEAD_FIELD.intention, intentionTag],
  ["#detailLeadEmail", LEAD_FIELD.email],
  ["#detailLeadCity", LEAD_FIELD.city],
  ["#detailLeadMeetup", LEAD_FIELD.meetup],
  ["#detailLeadSignup", LEAD_FIELD.signup],
  ["#detailLeadConfirmed", LEAD_FIELD.confirmed],
  ["#detailLeadExam", LEAD_FIELD.exam],
  ["#detailLeadFirstContact", LEAD_FIELD.firstContact, normalizeDateTimeText],
  ["#detailLeadLatestContact", LEAD_FIELD.latestContact, normalizeDateTimeText],
  ["#detailLeadReport", LEAD_FIELD.contactReport],
  ["#detailLeadStatus", LEAD_FIELD.status, statusTag]
];

init();

async function init() {
  hydrateStaticOptions();
  bindEvents();
  await loadConfig();
  await loadUsers();
  await loadRows();
}

function hydrateStaticOptions() {
  populateOptions(dom.leadDirectionInput, OPTIONS.direction, "请选择");
  populateOptions(dom.leadEducationInput, OPTIONS.education, "请选择");
  populateOptions(dom.leadIndustryInput, OPTIONS.industry, "请选择");
  populateOptions(dom.leadSourceInput, OPTIONS.signupSource, "请选择");
  populateOptions(dom.leadIntentionInput, OPTIONS.intention, "请选择");
  populateOptions(dom.leadStatusInput, OPTIONS.status, "请选择");
  populateOptions(dom.followMethodInput, OPTIONS.followMethod, "");
  hydrateOwnerOptions();
}

function hydrateOwnerOptions() {
  const options = [
    `<option value="" data-name="">请选择</option>`,
    ...state.users.map((user) => {
      const label = user.name || user.account || user.mobile || user.userId;
      return `<option value="${escapeHtml(user.userId)}" data-name="${escapeHtml(label)}">${escapeHtml(label)}</option>`;
    })
  ].join("");
  dom.leadOwnerInput.innerHTML = options;
  dom.assignOwnerInput.innerHTML = options;
}

function populateOptions(select, values, placeholder) {
  select.innerHTML = values
    .map((value, index) => {
      const text = value || placeholder || "";
      return `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`;
    })
    .join("");
}

function bindEvents() {
  dom.reloadLeadsButton.addEventListener("click", loadRows);
  dom.newLeadButton.addEventListener("click", () => openLeadEditor());
  dom.batchAssignButton.addEventListener("click", openAssignModal);
  dom.confirmAdmissionButton.addEventListener("click", confirmSelectedAdmission);
  dom.archiveLeadButton.addEventListener("click", archiveSelectedLead);
  dom.deleteLeadButton.addEventListener("click", deleteSelectedRows);
  dom.leadSearchInput.addEventListener("input", () => {
    state.query = dom.leadSearchInput.value.trim();
    render();
  });
  dom.leadCheckAll.addEventListener("change", () => {
    visibleRows().forEach((row) => {
      const id = rowId(row);
      if (dom.leadCheckAll.checked) {
        state.selectedIds.add(id);
      } else {
        state.selectedIds.delete(id);
      }
    });
    state.lastSelectedId = Array.from(state.selectedIds)[0] || "";
    render();
  });
  dom.leadPrevPageButton.addEventListener("click", () => {
    if (state.page > 1) {
      state.page -= 1;
      loadRows();
    }
  });
  dom.leadNextPageButton.addEventListener("click", () => {
    if (state.page < totalPages()) {
      state.page += 1;
      loadRows();
    }
  });
  dom.leadPageSizeSelect.addEventListener("change", () => {
    state.limit = Number(dom.leadPageSizeSelect.value);
    state.page = 1;
    loadRows();
  });

  dom.leadDetailMask.addEventListener("click", closeLeadDetail);
  dom.closeLeadDetailButton.addEventListener("click", closeLeadDetail);
  dom.editLeadDetailButton.addEventListener("click", () => {
    const row = getDetailRow();
    if (row) {
      openLeadEditor(row);
    }
  });
  dom.detailConfirmAdmissionButton.addEventListener("click", () => {
    const row = getDetailRow();
    if (row) {
      confirmAdmission(row);
    }
  });
  dom.detailArchiveButton.addEventListener("click", () => {
    const row = getDetailRow();
    if (row) {
      archiveLead(row);
    }
  });
  dom.prevLeadDetailButton.addEventListener("click", () => stepLeadDetail(-1));
  dom.nextLeadDetailButton.addEventListener("click", () => stepLeadDetail(1));
  dom.newFollowButton.addEventListener("click", openFollowEditor);

  dom.leadDrawerMask.addEventListener("click", closeLeadEditor);
  dom.closeLeadDrawerButton.addEventListener("click", closeLeadEditor);
  dom.cancelLeadButton.addEventListener("click", closeLeadEditor);
  dom.leadForm.addEventListener("submit", saveLead);
  dom.leadOwnerInput.addEventListener("change", () => {
    const selected = selectedOption(dom.leadOwnerInput);
    if (selected?.dataset.name) {
      dom.leadFormHint.textContent = `当前对接人：${selected.dataset.name}`;
    }
  });

  dom.followDrawerMask.addEventListener("click", closeFollowEditor);
  dom.closeFollowDrawerButton.addEventListener("click", closeFollowEditor);
  dom.cancelFollowButton.addEventListener("click", closeFollowEditor);
  dom.followForm.addEventListener("submit", saveFollow);

  dom.closeAssignModalButton.addEventListener("click", closeAssignModal);
  dom.cancelAssignButton.addEventListener("click", closeAssignModal);
  dom.saveAssignButton.addEventListener("click", saveBatchAssign);
  dom.assignModal.addEventListener("click", (event) => {
    if (event.target === dom.assignModal) {
      closeAssignModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    if (dom.assignModal && !dom.assignModal.hidden) {
      closeAssignModal();
      return;
    }
    if (dom.followDrawer.classList.contains("open")) {
      closeFollowEditor();
      return;
    }
    if (dom.leadDrawer.classList.contains("open")) {
      closeLeadEditor();
      return;
    }
    if (!dom.leadDetailPage.hidden) {
      closeLeadDetail();
    }
  });
}

async function loadConfig() {
  try {
    const config = await getJson(apiUrl("/api/config"));
    state.apiReady = Boolean(config.hasToken);
    state.emptyMessage = state.apiReady ? "暂无潜在考生数据" : "后端已启动，但未配置百数云 API Token";
  } catch {
    state.apiReady = false;
    state.emptyMessage = "未连接后端，请先启动 backend 服务并通过 127.0.0.1:3000 打开";
  }
}

async function loadUsers() {
  if (!state.apiReady) {
    state.users = [];
    hydrateOwnerOptions();
    return;
  }

  try {
    const payload = await postJson(apiUrl("/api/users/list"), {});
    state.users = extractUsers(payload);
    hydrateOwnerOptions();
  } catch {
    state.users = [];
    hydrateOwnerOptions();
  }
}

async function loadRows() {
  state.selectedIds.clear();
  state.lastSelectedId = "";

  if (!state.apiReady) {
    state.rows = [];
    state.total = 0;
    render();
    renderDetailView();
    return;
  }

  try {
    const [listResult, countResult] = await Promise.all([
      postJson(apiUrl("/api/lead/list"), {
        page: state.page,
        limit: state.limit
      }),
      postJson(apiUrl("/api/lead/count"), {})
    ]);

    state.rows = extractRows(listResult);
    state.total = extractTotal(countResult, state.rows.length);
    state.emptyMessage = "暂无潜在考生数据";
    render();
    renderDetailView();
  } catch (error) {
    state.rows = [];
    state.total = 0;
    state.emptyMessage = `接口加载失败：${error.message}`;
    render();
    renderDetailView();
  }
}

function visibleRows() {
  const query = state.query.toLowerCase();
  return state.rows.filter((row) => {
    if (!query) {
      return true;
    }

    const text = [
      displayValue(row, LEAD_FIELD.code),
      displayValue(row, LEAD_FIELD.personName),
      displayValue(row, LEAD_FIELD.phone),
      displayValue(row, LEAD_FIELD.gender),
      displayValue(row, LEAD_FIELD.age),
      displayValue(row, LEAD_FIELD.direction),
      displayValue(row, LEAD_FIELD.education),
      displayValue(row, LEAD_FIELD.company),
      displayValue(row, LEAD_FIELD.position),
      displayValue(row, LEAD_FIELD.signupSource),
      displayValue(row, LEAD_FIELD.referrer),
      displayValue(row, LEAD_FIELD.intention),
      displayValue(row, LEAD_FIELD.status),
      ownerName(row)
    ]
      .join(" ")
      .toLowerCase();
    return text.includes(query);
  });
}

function render() {
  const rows = visibleRows();
  dom.leadRows.innerHTML = rows.map(renderLeadRow).join("");
  dom.leadEmptyState.textContent = state.emptyMessage;
  dom.leadEmptyState.hidden = rows.length > 0;
  dom.leadRecordSummary.textContent = `共 ${state.total || rows.length} 条，当前显示 ${rows.length} 条`;
  dom.leadPageLabel.textContent = `第 ${state.page} 页`;
  dom.newLeadButton.disabled = !state.apiReady;
  dom.leadPrevPageButton.disabled = state.page <= 1;
  dom.leadNextPageButton.disabled = state.page >= totalPages();
  dom.batchAssignButton.disabled = state.selectedIds.size === 0 || !state.apiReady;
  dom.deleteLeadButton.disabled = state.selectedIds.size === 0 || !state.apiReady;
  dom.confirmAdmissionButton.disabled = state.selectedIds.size !== 1 || !state.apiReady;
  dom.archiveLeadButton.disabled = state.selectedIds.size !== 1 || !state.apiReady;
  dom.leadCheckAll.checked = rows.length > 0 && rows.every((row) => state.selectedIds.has(rowId(row)));
  dom.leadCheckAll.indeterminate =
    rows.some((row) => state.selectedIds.has(rowId(row))) && !dom.leadCheckAll.checked;
  bindLeadRowEvents();
}

function renderLeadRow(row) {
  const id = rowId(row);
  const selectedClass = state.selectedIds.has(id) ? "selected" : "";
  const checked = state.selectedIds.has(id) ? "checked" : "";

  return `
    <tr class="${selectedClass}" data-id="${escapeHtml(id)}">
      <td class="check-col"><input class="row-check" type="checkbox" ${checked} aria-label="选择记录" /></td>
      <td>${escapeHtml(displayValue(row, LEAD_FIELD.personName))}</td>
      <td>${escapeHtml(displayValue(row, LEAD_FIELD.phone))}</td>
      <td>${genderTag(displayValue(row, LEAD_FIELD.gender))}</td>
      <td class="number-col">${escapeHtml(displayValue(row, LEAD_FIELD.age))}</td>
      <td>${directionTag(displayValue(row, LEAD_FIELD.direction))}</td>
      <td>${educationTag(displayValue(row, LEAD_FIELD.education))}</td>
      <td>${escapeHtml(displayValue(row, LEAD_FIELD.company))}</td>
      <td>${escapeHtml(displayValue(row, LEAD_FIELD.position))}</td>
      <td>${escapeHtml(displayValue(row, LEAD_FIELD.signupSource))}</td>
      <td>${escapeHtml(displayValue(row, LEAD_FIELD.referrer))}</td>
      <td>${intentionTag(displayValue(row, LEAD_FIELD.intention))}</td>
      <td>${statusTag(displayValue(row, LEAD_FIELD.status))}</td>
      <td>${escapeHtml(ownerName(row))}</td>
    </tr>
  `;
}

function bindLeadRowEvents() {
  dom.leadRows.querySelectorAll("tr").forEach((tr) => {
    tr.addEventListener("click", (event) => {
      const id = tr.dataset.id;
      if (!id) {
        return;
      }
      if (event.target.classList.contains("row-check")) {
        toggleRow(id, event.target.checked);
        return;
      }
      state.selectedIds.clear();
      state.selectedIds.add(id);
      state.lastSelectedId = id;
      showLeadDetail(id);
    });
  });
}

function toggleRow(id, checked) {
  if (checked) {
    state.selectedIds.add(id);
    state.lastSelectedId = id;
  } else {
    state.selectedIds.delete(id);
    if (state.lastSelectedId === id) {
      state.lastSelectedId = Array.from(state.selectedIds)[0] || "";
    }
  }
  render();
}

function showLeadDetail(id) {
  state.detailId = id;
  dom.leadDetailMask.hidden = false;
  dom.leadDetailPage.hidden = false;
  renderDetailView();
  loadFollowRows();
}

function closeLeadDetail() {
  state.detailId = "";
  state.followRows = [];
  dom.leadDetailMask.hidden = true;
  dom.leadDetailPage.hidden = true;
  render();
}

function renderDetailView() {
  const row = getDetailRow();
  if (!row || dom.leadDetailPage.hidden) {
    return;
  }

  const rows = visibleRows();
  const index = rows.findIndex((item) => rowId(item) === state.detailId);
  dom.leadDetailPosition.textContent = index >= 0 ? `${index + 1} / ${rows.length}` : "- / -";
  dom.prevLeadDetailButton.disabled = index <= 0;
  dom.nextLeadDetailButton.disabled = index < 0 || index >= rows.length - 1;
  dom.leadDetailTitle.textContent =
    displayValue(row, LEAD_FIELD.code) ||
    displayValue(row, LEAD_FIELD.personName) ||
    "潜在考生详情";

  detailFieldMap.forEach(([selector, key, formatter]) => {
    const element = document.querySelector(selector);
    if (!element) {
      return;
    }
    const value = displayValue(row, key);
    element.innerHTML = formatter ? formatter(value, row) : escapeHtml(value || "-");
  });

  renderFollowRows();
}

function stepLeadDetail(delta) {
  const rows = visibleRows();
  const index = rows.findIndex((item) => rowId(item) === state.detailId);
  const next = rows[index + delta];
  if (next) {
    showLeadDetail(rowId(next));
  }
}

async function loadFollowRows() {
  const row = getDetailRow();
  const leadCode = row ? displayValue(row, LEAD_FIELD.code) : "";
  state.followRows = [];
  renderFollowRows("正在加载跟进记录");

  if (!leadCode || !state.apiReady) {
    renderFollowRows();
    return;
  }

  try {
    const payload = await postJson(apiUrl("/api/follow-up/by-lead"), { leadCode });
    state.followRows = extractRows(payload);
    renderFollowRows();
  } catch (error) {
    state.followRows = [];
    renderFollowRows(`跟进记录加载失败：${error.message}`);
  }
}

function renderFollowRows(message) {
  if (!dom.followRows || !dom.followEmpty) {
    return;
  }
  dom.followRows.innerHTML = state.followRows.map(renderFollowRow).join("");
  dom.followEmpty.textContent = message || "暂无跟进记录";
  dom.followEmpty.hidden = state.followRows.length > 0;
}

function renderFollowRow(row) {
  return `
    <tr>
      <td>${methodTag(displayValue(row, FOLLOWUP_FIELD.method))}</td>
      <td>${escapeHtml(normalizeDateTimeText(displayValue(row, FOLLOWUP_FIELD.contactTime)))}</td>
      <td>${escapeHtml(normalizeDateTimeText(displayValue(row, FOLLOWUP_FIELD.nextTime)))}</td>
      <td class="wrap-cell">${escapeHtml(displayValue(row, FOLLOWUP_FIELD.content))}</td>
      <td>${escapeHtml(displayValue(row, FOLLOWUP_FIELD.owner))}</td>
    </tr>
  `;
}

function openLeadEditor(row) {
  const editing = Boolean(row);
  const source = row || {};
  dom.leadDrawerTitle.textContent = editing ? "编辑潜在考生" : "新增潜在考生";
  dom.leadRecordId.value = editing ? rowId(source) : "";
  dom.leadCodeInput.value = editing ? displayValue(source, LEAD_FIELD.code) : "";
  dom.leadNameInput.value = editing ? displayValue(source, LEAD_FIELD.personName) : "";
  dom.leadPhoneInput.value = editing ? displayValue(source, LEAD_FIELD.phone) : "";
  dom.leadGenderInput.value = editing ? displayValue(source, LEAD_FIELD.gender) : "";
  dom.leadAgeInput.value = editing ? displayValue(source, LEAD_FIELD.age) : "";
  dom.leadDirectionInput.value = editing ? displayValue(source, LEAD_FIELD.direction) : "";
  dom.leadSubmitTimeInput.value = editing ? formatDateTimeInput(displayValue(source, LEAD_FIELD.submitTime)) : formatDateTimeInput(new Date());
  dom.leadEducationInput.value = editing ? displayValue(source, LEAD_FIELD.education) : "";
  dom.leadCompanyInput.value = editing ? displayValue(source, LEAD_FIELD.company) : "";
  dom.leadPositionInput.value = editing ? displayValue(source, LEAD_FIELD.position) : "";
  dom.leadIndustryInput.value = editing ? displayValue(source, LEAD_FIELD.industry) : "";
  dom.leadSourceInput.value = editing ? displayValue(source, LEAD_FIELD.signupSource) : "";
  dom.leadOwnerInput.value = editing ? ownerId(source) : "";
  dom.leadReferrerInput.value = editing ? displayValue(source, LEAD_FIELD.referrer) : "";
  dom.leadIntentionInput.value = editing ? displayValue(source, LEAD_FIELD.intention) : "";
  dom.leadEmailInput.value = editing ? displayValue(source, LEAD_FIELD.email) : "";
  dom.leadCityInput.value = editing ? displayValue(source, LEAD_FIELD.city) : "";
  dom.leadMeetupInput.value = editing ? displayValue(source, LEAD_FIELD.meetup) : "";
  dom.leadSignupInput.value = editing ? displayValue(source, LEAD_FIELD.signup) : "";
  dom.leadConfirmedInput.value = editing ? displayValue(source, LEAD_FIELD.confirmed) : "";
  dom.leadExamInput.value = editing ? displayValue(source, LEAD_FIELD.exam) : "";
  dom.leadFirstContactInput.value = editing ? formatDateTimeInput(displayValue(source, LEAD_FIELD.firstContact)) : "";
  dom.leadLatestContactInput.value = editing ? formatDateTimeInput(displayValue(source, LEAD_FIELD.latestContact)) : "";
  dom.leadStatusInput.value = editing ? displayValue(source, LEAD_FIELD.status) : "新线索";
  dom.leadReportInput.value = editing ? displayValue(source, LEAD_FIELD.contactReport) : "";
  dom.leadFormHint.textContent = editing ? "编辑当前潜在考生记录" : "线索编号由底表自动生成";
  dom.leadDrawerMask.hidden = false;
  dom.leadDrawer.classList.add("open");
  dom.leadDrawer.setAttribute("aria-hidden", "false");
  setTimeout(() => dom.leadNameInput.focus(), 0);
}

function closeLeadEditor() {
  dom.leadDrawer.classList.remove("open");
  dom.leadDrawer.setAttribute("aria-hidden", "true");
  dom.leadDrawerMask.hidden = true;
}

async function saveLead(event) {
  event.preventDefault();
  if (!state.apiReady) {
    dom.leadFormHint.textContent = "请先启动后端并配置百数云 API Token";
    return;
  }

  const data = buildLeadPayload();
  const id = dom.leadRecordId.value;
  if (!data[LEAD_FIELD.personName]) {
    dom.leadFormHint.textContent = "请填写姓名";
    dom.leadNameInput.focus();
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(data[LEAD_FIELD.phone])) {
    dom.leadFormHint.textContent = "请填写正确的手机号";
    dom.leadPhoneInput.focus();
    return;
  }

  try {
    dom.leadFormHint.textContent = "正在保存";
    if (id) {
      await postJson(apiUrl("/api/lead/update"), {
        data_id: id,
        _id: id,
        data
      });
    } else {
      await postJson(apiUrl("/api/lead/create"), { data });
    }

    closeLeadEditor();
    await loadRows();
    if (!dom.leadDetailPage.hidden && id) {
      state.detailId = id;
      renderDetailView();
    }
  } catch (error) {
    dom.leadFormHint.textContent = `保存失败：${error.message}`;
  }
}

function buildLeadPayload() {
  const ownerOption = selectedOption(dom.leadOwnerInput);
  const ownerIdValue = dom.leadOwnerInput.value.trim();
  const ownerTextValue = ownerOption?.dataset.name || ownerOption?.textContent?.trim() || "";

  return {
    [LEAD_FIELD.personName]: dom.leadNameInput.value.trim(),
    [LEAD_FIELD.phone]: dom.leadPhoneInput.value.trim(),
    [LEAD_FIELD.gender]: dom.leadGenderInput.value,
    [LEAD_FIELD.age]: numberOrEmpty(dom.leadAgeInput.value),
    [LEAD_FIELD.direction]: dom.leadDirectionInput.value,
    [LEAD_FIELD.submitTime]: toApiDateTime(dom.leadSubmitTimeInput.value),
    [LEAD_FIELD.education]: dom.leadEducationInput.value,
    [LEAD_FIELD.company]: dom.leadCompanyInput.value.trim(),
    [LEAD_FIELD.position]: dom.leadPositionInput.value.trim(),
    [LEAD_FIELD.industry]: dom.leadIndustryInput.value,
    [LEAD_FIELD.signupSource]: dom.leadSourceInput.value,
    [LEAD_FIELD.owner]: ownerIdValue,
    [LEAD_FIELD.ownerText]: ownerIdValue ? ownerTextValue : "",
    [LEAD_FIELD.referrer]: dom.leadReferrerInput.value.trim(),
    [LEAD_FIELD.intention]: dom.leadIntentionInput.value,
    [LEAD_FIELD.email]: dom.leadEmailInput.value.trim(),
    [LEAD_FIELD.city]: dom.leadCityInput.value.trim(),
    [LEAD_FIELD.meetup]: dom.leadMeetupInput.value,
    [LEAD_FIELD.signup]: dom.leadSignupInput.value,
    [LEAD_FIELD.confirmed]: dom.leadConfirmedInput.value,
    [LEAD_FIELD.exam]: dom.leadExamInput.value,
    [LEAD_FIELD.firstContact]: toApiDateTime(dom.leadFirstContactInput.value),
    [LEAD_FIELD.latestContact]: toApiDateTime(dom.leadLatestContactInput.value),
    [LEAD_FIELD.contactReport]: dom.leadReportInput.value.trim(),
    [LEAD_FIELD.status]: dom.leadStatusInput.value || "新线索"
  };
}

function openFollowEditor() {
  const row = getDetailRow();
  if (!row) {
    return;
  }

  dom.followNameInput.value = displayValue(row, LEAD_FIELD.personName);
  dom.followMethodInput.value = OPTIONS.followMethod[0];
  dom.followContactTimeInput.value = formatDateTimeInput(new Date());
  dom.followNextTimeInput.value = "";
  dom.followContentInput.value = "";
  dom.followFormHint.textContent = `自动关联线索：${displayValue(row, LEAD_FIELD.code) || "-"}`;
  dom.followDrawerMask.hidden = false;
  dom.followDrawer.classList.add("open");
  dom.followDrawer.setAttribute("aria-hidden", "false");
  setTimeout(() => dom.followMethodInput.focus(), 0);
}

function closeFollowEditor() {
  dom.followDrawer.classList.remove("open");
  dom.followDrawer.setAttribute("aria-hidden", "true");
  dom.followDrawerMask.hidden = true;
}

async function saveFollow(event) {
  event.preventDefault();
  const row = getDetailRow();
  if (!row) {
    dom.followFormHint.textContent = "请先选择潜在考生";
    return;
  }

  const leadCode = displayValue(row, LEAD_FIELD.code);
  if (!leadCode) {
    dom.followFormHint.textContent = "当前潜在考生缺少线索编号";
    return;
  }

  const contactTime = toApiDateTime(dom.followContactTimeInput.value);
  if (!dom.followNameInput.value.trim() || !contactTime) {
    dom.followFormHint.textContent = "请填写姓名和沟通时间";
    return;
  }

  const data = {
    [FOLLOWUP_FIELD.personName]: dom.followNameInput.value.trim(),
    [FOLLOWUP_FIELD.method]: dom.followMethodInput.value,
    [FOLLOWUP_FIELD.contactTime]: contactTime,
    [FOLLOWUP_FIELD.nextTime]: toApiDateTime(dom.followNextTimeInput.value),
    [FOLLOWUP_FIELD.content]: dom.followContentInput.value.trim(),
    [FOLLOWUP_FIELD.leadCode]: leadCode,
    [FOLLOWUP_FIELD.customerCode]: leadCode,
    [FOLLOWUP_FIELD.owner]: ownerId(row) || ownerName(row)
  };

  try {
    dom.followFormHint.textContent = "正在保存";
    await postJson(apiUrl("/api/follow-up/create"), { data });
    closeFollowEditor();
    await loadFollowRows();
  } catch (error) {
    dom.followFormHint.textContent = `保存失败：${error.message}`;
  }
}

async function confirmSelectedAdmission() {
  const row = getPrimarySelectedRow();
  if (row) {
    await confirmAdmission(row);
  }
}

async function confirmAdmission(row) {
  const label = displayValue(row, LEAD_FIELD.personName) || displayValue(row, LEAD_FIELD.code);
  if (!confirm(`确认将「${label}」置为已报考，并新增到达线学员信息管理？`)) {
    return;
  }

  try {
    await postJson(apiUrl("/api/lead/confirm-admission"), {
      data_id: rowId(row),
      _id: rowId(row),
      row
    });
    await loadRows();
    closeLeadDetail();
  } catch (error) {
    alert(`确认入学失败：${error.message}`);
  }
}

async function archiveSelectedLead() {
  const row = getPrimarySelectedRow();
  if (row) {
    await archiveLead(row);
  }
}

async function archiveLead(row) {
  const label = displayValue(row, LEAD_FIELD.personName) || displayValue(row, LEAD_FIELD.code);
  if (!confirm(`确认归档「${label}」？线索状态将变更为无效，并新增到归档学员信息管理。`)) {
    return;
  }

  try {
    await postJson(apiUrl("/api/lead/archive"), {
      data_id: rowId(row),
      _id: rowId(row),
      row
    });
    await loadRows();
    closeLeadDetail();
  } catch (error) {
    alert(`归档失败：${error.message}`);
  }
}

async function deleteSelectedRows() {
  const ids = Array.from(state.selectedIds);
  if (!ids.length) {
    return;
  }
  if (!confirm(`确认删除已选择的 ${ids.length} 条潜在考生数据？`)) {
    return;
  }

  try {
    for (const id of ids) {
      await postJson(apiUrl("/api/lead/delete"), {
        data_id: id,
        _id: id,
        data_ids: [id]
      });
    }
    state.selectedIds.clear();
    state.detailId = "";
    await loadRows();
    closeLeadDetail();
  } catch (error) {
    alert(`删除失败：${error.message}`);
  }
}

function openAssignModal() {
  if (!state.selectedIds.size) {
    return;
  }
  dom.assignHint.textContent = `已选择 ${state.selectedIds.size} 条数据，提交后线索状态将置为已分配。`;
  dom.assignOwnerInput.value = "";
  dom.assignModal.hidden = false;
  setTimeout(() => dom.assignOwnerInput.focus(), 0);
}

function closeAssignModal() {
  dom.assignModal.hidden = true;
}

async function saveBatchAssign() {
  const owner = selectedOption(dom.assignOwnerInput);
  const ownerIdValue = dom.assignOwnerInput.value.trim();
  const ownerNameValue = owner?.dataset.name || owner?.textContent?.trim() || "";
  if (!ownerIdValue) {
    dom.assignHint.textContent = "请选择对接人";
    return;
  }

  try {
    dom.saveAssignButton.disabled = true;
    dom.assignHint.textContent = "正在分配";
    await postJson(apiUrl("/api/lead/batch-assign"), {
      data_ids: Array.from(state.selectedIds),
      ownerId: ownerIdValue,
      ownerName: ownerNameValue
    });
    closeAssignModal();
    await loadRows();
  } catch (error) {
    dom.assignHint.textContent = `分配失败：${error.message}`;
  } finally {
    dom.saveAssignButton.disabled = false;
  }
}

function apiUrl(path) {
  return `${API_BASE_PATH}${path}`;
}

function getPrimarySelectedRow() {
  const id = state.lastSelectedId || Array.from(state.selectedIds)[0];
  return state.rows.find((row) => rowId(row) === id);
}

function getDetailRow() {
  return state.rows.find((row) => rowId(row) === state.detailId);
}

function rowId(row) {
  return String(row?._id || row?.id || row?.data_id || row?.dataId || row?.entry_id || displayValue(row, LEAD_FIELD.code));
}

function ownerName(row) {
  return displayValue(row, LEAD_FIELD.ownerText) || displayValue(row, LEAD_FIELD.owner);
}

function ownerId(row) {
  const id = extractComplexId(row?.[LEAD_FIELD.owner]);
  if (id) {
    return id;
  }
  const text = displayValue(row, LEAD_FIELD.owner);
  const matched = state.users.find((user) => user.userId === text || user.name === text || user.account === text);
  return matched?.userId || text;
}

function selectedOption(select) {
  return select.options[select.selectedIndex] || null;
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
    value.user_name ||
    value.userName ||
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

function extractComplexId(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(extractComplexId).find(Boolean) || "";
  }
  if (typeof value !== "object") {
    return String(value || "").trim();
  }
  const direct =
    value.user_id ||
    value.userId ||
    value.id ||
    value._id ||
    value.uniqueid ||
    value.uniqueId ||
    value.value;
  return direct ? String(direct).trim() : "";
}

function extractRows(result) {
  if (Array.isArray(result)) {
    return result;
  }
  if (Array.isArray(result?.rows)) {
    return result.rows;
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

function extractUsers(payload) {
  const rows = Array.isArray(payload?.users)
    ? payload.users
    : Array.isArray(payload?.data?.users)
      ? payload.data.users
      : extractRows(payload);
  return rows
    .map((row) => ({
      userId: String(row.userId || row.user_id || row.id || row._id || row.uniqueid || row.uniqueId || "").trim(),
      name: String(row.name || row.user_name || row.userName || row.account || "").trim(),
      account: String(row.account || "").trim(),
      mobile: String(row.mobile || "").trim(),
      email: String(row.email || "").trim()
    }))
    .filter((user) => user.userId || user.name)
    .sort((left, right) => (left.name || left.userId).localeCompare(right.name || right.userId, "zh-Hans-CN", {
      numeric: true,
      sensitivity: "base"
    }));
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

function totalPages() {
  return Math.max(1, Math.ceil((state.total || state.rows.length || 1) / state.limit));
}

function numberOrEmpty(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : "";
}

function formatDateTimeInput(value) {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : new Date(String(value).replace(/-/g, "/"));
  if (Number.isNaN(date.getTime())) {
    const text = String(value).replace(" ", "T");
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(text) ? text.slice(0, 16) : "";
  }
  const pad = (number) => String(number).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toApiDateTime(value) {
  if (!value) {
    return "";
  }
  return `${value.replace("T", " ")}:00`;
}

function normalizeDateTimeText(value) {
  if (!value) {
    return "-";
  }
  const text = String(value).replace("T", " ");
  return text.length >= 16 ? text.slice(0, 19) : text;
}

function tag(label, tone = "muted") {
  const text = String(label || "").trim();
  if (!text) {
    return "-";
  }
  return `<span class="tag ${tone}">${escapeHtml(text)}</span>`;
}

function genderTag(value) {
  if (value === "男") {
    return tag(value, "info");
  }
  if (value === "女") {
    return tag(value, "danger");
  }
  return escapeHtml(value || "-");
}

function educationTag(value) {
  return value ? tag(value, "info") : "-";
}

function directionTag(value) {
  return value ? tag(value, value.includes("EMBA") ? "warning" : "success") : "-";
}

function intentionTag(value) {
  const text = String(value || "");
  if (!text) {
    return "-";
  }
  if (text.startsWith("A")) {
    return tag(text, "success");
  }
  if (text.startsWith("B")) {
    return tag(text, "info");
  }
  if (text.startsWith("D") || text.includes("无效")) {
    return tag(text, "danger");
  }
  return tag(text, "warning");
}

function statusTag(value) {
  const text = String(value || "");
  if (text === "已报考") {
    return tag(text, "success");
  }
  if (text === "已分配") {
    return tag(text, "info");
  }
  if (text === "无效") {
    return tag(text, "danger");
  }
  return text ? tag(text, "muted") : "-";
}

function methodTag(value) {
  return value ? tag(value, "warning") : "-";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
