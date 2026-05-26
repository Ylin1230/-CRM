const ACTIVITY_FIELD = {
  code: "_widget_1771903125126",
  name: "_widget_1771903125107",
  type: "_widget_1771903125403",
  start: "_widget_1771903125195",
  end: "_widget_1771903125609",
  dept: "_widget_1771903125451",
  count: "_widget_1772249483639",
  template: "_widget_1779761373894",
  qr: "_widget_1771904304705"
};

if (window.location.protocol === "file:") {
  window.location.replace("http://127.0.0.1:3000/");
  throw new Error("请通过后端服务地址打开页面");
}

const SURVEY_PARAM = {
  sourceCode: "_widget_1778461489795",
  activityName: "_widget_1778461489814",
  template: "_widget_1779761373894"
};

const QUESTIONNAIRE_TEMPLATE = {
  lecture: "活动讲座模版",
  promo: "展架等宣传品通用模版"
};

const SORT_FIELD_TYPE = {
  code: "text",
  name: "text",
  type: "text",
  start: "date",
  end: "date",
  dept: "text",
  count: "number",
  creator: "text",
  createTime: "date"
};

const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";

const state = {
  rows: [],
  departments: [],
  total: 0,
  page: 1,
  limit: 20,
  selectedIds: new Set(),
  detailId: "",
  detailEditing: false,
  deptFilter: "",
  typeFilter: "",
  filterRelation: "all",
  query: "",
  sortField: "createTime",
  sortDirection: "desc",
  backendReady: false,
  apiReady: false,
  emptyMessage: "暂无活动数据",
  lastSelectedId: "",
  surveyBaseUrl: "https://ahyg.online-office.net/f/bcb94724bf17b511adc1a348"
};

const dom = {
  cloudState: document.querySelector("#cloudState"),
  reloadButton: document.querySelector("#reloadButton"),
  newButton: document.querySelector("#newButton"),
  printQrButton: document.querySelector("#printQrButton"),
  deleteButton: document.querySelector("#deleteButton"),
  typeFilter: document.querySelector("#typeFilter"),
  deptFilter: document.querySelector("#deptFilter"),
  filterRelation: document.querySelector("#filterRelation"),
  filterButton: document.querySelector("#filterButton"),
  filterPopover: document.querySelector("#filterPopover"),
  applyFilterButton: document.querySelector("#applyFilterButton"),
  clearFilterButton: document.querySelector("#clearFilterButton"),
  sortButton: document.querySelector("#sortButton"),
  sortPopover: document.querySelector("#sortPopover"),
  sortField: document.querySelector("#sortField"),
  sortAscButton: document.querySelector("#sortAscButton"),
  sortDescButton: document.querySelector("#sortDescButton"),
  applySortButton: document.querySelector("#applySortButton"),
  clearSortButton: document.querySelector("#clearSortButton"),
  resetSortButton: document.querySelector("#resetSortButton"),
  searchInput: document.querySelector("#searchInput"),
  checkAll: document.querySelector("#checkAll"),
  rows: document.querySelector("#activityRows"),
  emptyState: document.querySelector("#emptyState"),
  recordSummary: document.querySelector("#recordSummary"),
  pageLabel: document.querySelector("#pageLabel"),
  prevPageButton: document.querySelector("#prevPageButton"),
  nextPageButton: document.querySelector("#nextPageButton"),
  pageSizeSelect: document.querySelector("#pageSizeSelect"),
  statusText: document.querySelector("#statusText"),
  drawerMask: document.querySelector("#drawerMask"),
  editorDrawer: document.querySelector("#editorDrawer"),
  drawerTitle: document.querySelector("#drawerTitle"),
  closeDrawerButton: document.querySelector("#closeDrawerButton"),
  activityForm: document.querySelector("#activityForm"),
  recordId: document.querySelector("#recordId"),
  activityCode: document.querySelector("#activityCode"),
  activityName: document.querySelector("#activityName"),
  activityType: document.querySelector("#activityType"),
  startDate: document.querySelector("#startDate"),
  endDate: document.querySelector("#endDate"),
  department: document.querySelector("#department"),
  activityCount: document.querySelector("#activityCount"),
  questionnaireTemplate: document.querySelector("#questionnaireTemplate"),
  generatedQrField: document.querySelector("#generatedQrField"),
  generatedQr: document.querySelector("#generatedQr"),
  formHint: document.querySelector("#formHint")
};

const activitySelectPickers = new Map();

Object.assign(dom, {
  dataPanel: document.querySelector(".data-panel"),
  detailMask: document.querySelector("#detailMask"),
  detailPage: document.querySelector("#detailPage"),
  backToListButton: document.querySelector("#backToListButton"),
  detailEditButton: document.querySelector("#detailEditButton"),
  detailDeleteButton: document.querySelector("#detailDeleteButton"),
  detailPrintButton: document.querySelector("#detailPrintButton"),
  detailEditFooter: document.querySelector("#detailEditFooter"),
  detailSaveButton: document.querySelector("#detailSaveButton"),
  prevDetailButton: document.querySelector("#prevDetailButton"),
  nextDetailButton: document.querySelector("#nextDetailButton"),
  cancelDetailEditButton: document.querySelector("#cancelDetailEditButton"),
  detailPosition: document.querySelector("#detailPosition"),
  detailCode: document.querySelector("#detailCode"),
  detailName: document.querySelector("#detailName"),
  detailType: document.querySelector("#detailType"),
  detailStart: document.querySelector("#detailStart"),
  detailEnd: document.querySelector("#detailEnd"),
  detailDept: document.querySelector("#detailDept"),
  detailCount: document.querySelector("#detailCount"),
  detailTemplate: document.querySelector("#detailTemplate"),
  detailCreator: document.querySelector("#detailCreator"),
  detailCreateTime: document.querySelector("#detailCreateTime"),
  detailUpdateTime: document.querySelector("#detailUpdateTime"),
  detailDataId: document.querySelector("#detailDataId"),
  detailQr: document.querySelector("#detailQr")
});

init();

async function init() {
  bindEvents();
  enhanceActivitySelects();
  await loadConfig();
  await loadDepartments();
  await loadRows();
}

function bindEvents() {
  dom.reloadButton?.addEventListener("click", loadRows);
  dom.newButton.addEventListener("click", () => openEditor());
  dom.printQrButton.addEventListener("click", printSelectedQrs);
  dom.deleteButton?.addEventListener("click", deleteSelectedRows);
  dom.backToListButton.addEventListener("click", showListView);
  dom.detailMask.addEventListener("click", showListView);
  dom.detailEditButton.addEventListener("click", toggleDetailEdit);
  dom.detailDeleteButton.addEventListener("click", deleteDetailRow);
  dom.detailPrintButton.addEventListener("click", printDetailQr);
  dom.detailSaveButton.addEventListener("click", saveDetailEdit);
  dom.prevDetailButton.addEventListener("click", () => stepDetail(-1));
  dom.nextDetailButton.addEventListener("click", () => stepDetail(1));
  dom.cancelDetailEditButton.addEventListener("click", cancelDetailEdit);
  dom.filterButton.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePopover("filter");
  });
  dom.sortButton.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePopover("sort");
  });
  dom.applyFilterButton.addEventListener("click", applyFilters);
  dom.clearFilterButton.addEventListener("click", clearFilters);
  dom.applySortButton.addEventListener("click", applySort);
  dom.clearSortButton.addEventListener("click", clearSort);
  dom.resetSortButton.addEventListener("click", clearSort);
  [dom.sortAscButton, dom.sortDescButton].forEach((button) => {
    button.addEventListener("click", () => setSortDirection(button.dataset.direction));
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (!target.closest(".toolbar-popover") && !target.closest(".tool-icon-button")) {
      closeToolbarPopovers();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeToolbarPopovers();
    }
  });
  dom.searchInput.addEventListener("input", () => {
    state.query = dom.searchInput.value.trim();
    render();
  });
  dom.checkAll.addEventListener("change", () => {
    visibleRows().forEach((row) => {
      const id = rowId(row);
      if (dom.checkAll.checked) {
        state.selectedIds.add(id);
      } else {
        state.selectedIds.delete(id);
      }
    });
    render();
  });
  dom.prevPageButton.addEventListener("click", () => {
    if (state.page > 1) {
      state.page -= 1;
      loadRows();
    }
  });
  dom.nextPageButton.addEventListener("click", () => {
    if (state.page < totalPages()) {
      state.page += 1;
      loadRows();
    }
  });
  dom.pageSizeSelect.addEventListener("change", () => {
    state.limit = Number(dom.pageSizeSelect.value);
    state.page = 1;
    loadRows();
  });
  dom.drawerMask.addEventListener("click", closeEditor);
  dom.closeDrawerButton.addEventListener("click", closeEditor);
  document.querySelector("#cancelButton").addEventListener("click", closeEditor);
  dom.activityForm.addEventListener("submit", saveActivity);
  [dom.activityCode, dom.activityName, dom.questionnaireTemplate].forEach((input) => {
    input.addEventListener("input", refreshEditorQr);
    input.addEventListener("change", refreshEditorQr);
  });
  document.addEventListener("pointerdown", (event) => {
    const input = event.target instanceof Element
      ? event.target.closest('input[type="date"].activity-date-input')
      : null;
    if (input && typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        input.focus();
      }
    }
  });
}

function togglePopover(type) {
  const isFilter = type === "filter";
  const target = isFilter ? dom.filterPopover : dom.sortPopover;
  const other = isFilter ? dom.sortPopover : dom.filterPopover;
  const willOpen = target.hidden;

  other.hidden = true;
  if (willOpen) {
    if (isFilter) {
      syncFilterControls();
    } else {
      syncSortControls();
    }
  }
  target.hidden = !willOpen;
}

function closeToolbarPopovers() {
  dom.filterPopover.hidden = true;
  dom.sortPopover.hidden = true;
}

function syncFilterControls() {
  dom.typeFilter.value = state.typeFilter;
  dom.deptFilter.value = state.deptFilter;
  dom.filterRelation.value = state.filterRelation;
}

function applyFilters() {
  state.typeFilter = dom.typeFilter.value;
  state.deptFilter = dom.deptFilter.value.trim();
  state.filterRelation = dom.filterRelation.value === "any" ? "any" : "all";
  closeToolbarPopovers();
  render();
}

function clearFilters() {
  state.typeFilter = "";
  state.deptFilter = "";
  state.filterRelation = "all";
  syncFilterControls();
  closeToolbarPopovers();
  render();
}

function syncSortControls() {
  dom.sortField.value = state.sortField;
  setSortDirection(state.sortDirection);
}

function setSortDirection(direction) {
  const normalized = direction === "desc" ? "desc" : "asc";
  dom.sortAscButton.classList.toggle("active", normalized === "asc");
  dom.sortDescButton.classList.toggle("active", normalized === "desc");
}

function enhanceActivitySelects() {
  [dom.activityType, dom.department, dom.questionnaireTemplate].forEach(enhanceActivitySelect);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (![...activitySelectPickers.values()].some(({ picker }) => picker.contains(target))) {
      closeActivitySelects();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeActivitySelects();
    }
  });
}

function enhanceActivitySelect(select) {
  if (!select || activitySelectPickers.has(select)) {
    refreshActivitySelect(select);
    return;
  }

  const picker = document.createElement("div");
  picker.className = "select-picker survey-select-picker activity-select-picker";

  const trigger = document.createElement("button");
  trigger.className = "select-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  const menu = document.createElement("div");
  menu.className = "select-menu";
  menu.hidden = true;

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "select-options";
  optionsWrap.setAttribute("role", "listbox");
  menu.appendChild(optionsWrap);

  select.parentNode.insertBefore(picker, select);
  picker.append(select, trigger, menu);
  select.classList.add("native-select-hidden");
  select.tabIndex = -1;

  activitySelectPickers.set(select, { picker, trigger, menu, optionsWrap });
  trigger.addEventListener("click", () => {
    if (select.disabled) {
      return;
    }
    const opening = menu.hidden;
    closeActivitySelects(select);
    refreshActivitySelect(select);
    menu.hidden = !opening;
    trigger.setAttribute("aria-expanded", opening ? "true" : "false");
  });
  select.addEventListener("change", () => refreshActivitySelect(select));
  refreshActivitySelect(select);
}

function refreshActivitySelect(select) {
  const controls = activitySelectPickers.get(select);
  if (!select || !controls) {
    return;
  }

  const { trigger, menu, optionsWrap } = controls;
  const selectedOption = select.selectedOptions?.[0] || select.options[select.selectedIndex];
  trigger.textContent = selectedOption?.textContent?.trim() || "请选择";
  trigger.classList.toggle("placeholder", !select.value);
  trigger.disabled = select.disabled;
  if (select.disabled) {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  optionsWrap.replaceChildren();
  Array.from(select.options).forEach((option) => {
    const button = document.createElement("button");
    button.className = "select-option";
    button.type = "button";
    button.textContent = option.textContent;
    button.disabled = option.disabled;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", option.selected ? "true" : "false");
    button.classList.toggle("selected", option.selected);
    button.addEventListener("click", () => {
      select.value = option.value;
      dispatchSelectEvent(select, "input");
      dispatchSelectEvent(select, "change");
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    });
    optionsWrap.appendChild(button);
  });
}

function refreshActivitySelects() {
  activitySelectPickers.forEach((_, select) => refreshActivitySelect(select));
}

function closeActivitySelects(exceptSelect = null) {
  activitySelectPickers.forEach(({ menu, trigger }, select) => {
    if (select === exceptSelect) {
      return;
    }
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  });
}

function dispatchSelectEvent(select, type) {
  if (typeof Event === "function") {
    select.dispatchEvent(new Event(type, { bubbles: true }));
    return;
  }
  const event = document.createEvent("HTMLEvents");
  event.initEvent(type, true, false);
  select.dispatchEvent(event);
}

function applySort() {
  state.sortField = dom.sortField.value;
  state.sortDirection = dom.sortDescButton.classList.contains("active") ? "desc" : "asc";
  closeToolbarPopovers();
  render();
}

function clearSort() {
  state.sortField = "";
  state.sortDirection = "asc";
  syncSortControls();
  closeToolbarPopovers();
  render();
}

async function loadConfig() {
  try {
    const config = await getJson(apiUrl("/api/config"));
    state.backendReady = true;
    state.apiReady = Boolean(config.hasToken);
    state.surveyBaseUrl = config.surveyBaseUrl || state.surveyBaseUrl;
    state.emptyMessage = state.apiReady
      ? "暂无活动数据"
      : "后端已启动，但未配置百数云 API Token";
    if (dom.cloudState) {
      dom.cloudState.textContent = state.apiReady
        ? "百数云接口已配置"
        : "后端已启动，未配置百数云 API Token";
    }
  } catch {
    state.backendReady = false;
    state.apiReady = false;
    state.emptyMessage = "未连接后端，请先启动 backend 服务并通过 127.0.0.1:3000 打开";
    if (dom.cloudState) {
      dom.cloudState.textContent = "后端未连接";
    }
  }
}

async function loadDepartments() {
  state.departments = [];
  hydrateDepartmentSelect();

  if (!state.apiReady) {
    return;
  }

  try {
    const result = await postJson(apiUrl("/api/departments/list"), {
      dept_id: "",
      has_child: true
    });
    state.departments = extractDepartments(result);
    hydrateDepartmentSelect();
  } catch (error) {
    state.departments = [];
    hydrateDepartmentSelect();
    setStatus(`组织架构加载失败：${error.message}`);
  }
}

function hydrateDepartmentSelect(selectedValue = "") {
  if (!dom.department) {
    return;
  }

  const value = selectedValue || dom.department.value;
  dom.department.innerHTML = departmentOptionsHtml(value);
  refreshActivitySelect(dom.department);
}

function departmentOptionsHtml(selectedValue = "") {
  const normalizedSelectedValue = String(selectedValue || "").trim();
  const selectedDeptId = departmentIdFromValue(normalizedSelectedValue) || normalizedSelectedValue;
  const hasSelectedDepartment = state.departments.some((dept) => dept.deptId === selectedDeptId);
  const options = [
    `<option value="">请选择部门</option>`,
    selectedDeptId && !hasSelectedDepartment
      ? `<option value="${escapeHtml(selectedDeptId)}" selected>${escapeHtml(normalizedSelectedValue)}</option>`
      : "",
    ...state.departments.map((dept) => {
      const label = dept.optionName || dept.pathName || dept.name || dept.deptId;
      const selected = dept.deptId === selectedDeptId ? "selected" : "";
      return `<option value="${escapeHtml(dept.deptId)}" ${selected}>${escapeHtml(label)}</option>`;
    })
  ].filter(Boolean);
  return options.join("");
}

function extractDepartments(result) {
  const rows = Array.isArray(result?.departments)
    ? result.departments
    : Array.isArray(result?.data?.departments)
      ? result.data.departments
      : Array.isArray(result?.data)
        ? result.data
        : [];
  const departments = rows
    .map(normalizeDepartment)
    .filter((dept) => dept.deptId || dept.name);
  const byId = new Map(departments.map((dept) => [dept.deptId, dept]));
  const byNo = new Map(departments.map((dept) => [String(dept.deptNo), dept]));

  const enrich = (dept, trail = []) => {
    if (dept._enriched || trail.includes(dept)) {
      return dept;
    }
    const parent = dept.parentId
      ? byId.get(dept.parentId)
      : dept.parentNo !== "" && dept.parentNo !== undefined
        ? byNo.get(String(dept.parentNo))
        : null;
    if (parent && parent !== dept) {
      enrich(parent, [...trail, dept]);
      dept.depth = (parent.depth || 0) + 1;
      dept.pathName = [parent.pathName || parent.name, dept.name].filter(Boolean).join(" / ");
    } else {
      dept.depth = 0;
      dept.pathName = dept.name;
    }
    dept.optionName = `${"　".repeat(Math.min(dept.depth || 0, 4))}${dept.name || dept.deptId}`;
    dept._enriched = true;
    return dept;
  };

  return departments.map((dept) => enrich(dept));
}

function normalizeDepartment(row) {
  const source = row && typeof row === "object" ? row : {};
  const deptId = String(
    source.deptId ||
    source.dept_id ||
    source.id ||
    source._id ||
    source.value ||
    ""
  ).trim();
  const name = String(
    source.name ||
    source.deptName ||
    source.dept_name ||
    source.label ||
    source.title ||
    deptId
  ).trim();

  return {
    deptId,
    name,
    deptNo: source.deptNo ?? source.dept_no ?? "",
    parentId: String(source.parentId || source.parent_id || "").trim(),
    parentNo: source.parentNo ?? source.parent_no ?? ""
  };
}

async function loadRows() {
  setStatus("正在加载活动数据");
  state.selectedIds.clear();

  if (!state.apiReady) {
    state.rows = [];
    state.total = 0;
    render();
    renderDetailView();
    setStatus(state.emptyMessage);
    return;
  }

  try {
    const [listResult, countResult] = await Promise.all([
      postJson(apiUrl("/api/activity/list"), {
        page: state.page,
        limit: state.limit
      }),
      postJson(apiUrl("/api/activity/count"), {})
    ]);

    state.rows = ensureQr(extractRows(listResult));
    state.total = extractTotal(countResult, state.rows.length);
    state.emptyMessage = "暂无活动数据";
    render();
    renderDetailView();
    setStatus("活动数据加载完成");
  } catch (error) {
    state.rows = [];
    state.total = 0;
    state.emptyMessage = `接口加载失败：${error.message}`;
    render();
    renderDetailView();
    setStatus(state.emptyMessage);
  }
}

function ensureQr(rows) {
  return rows.map((row) => {
    const next = { ...row };
    const generatedQr = buildSurveyUrl(next);
    if (generatedQr) {
      next[ACTIVITY_FIELD.qr] = generatedQr;
    } else if (!displayValue(next, ACTIVITY_FIELD.qr)) {
      next[ACTIVITY_FIELD.qr] = "";
    }
    return next;
  });
}

function visibleRows() {
  const query = state.query.toLowerCase();
  const rows = state.rows.filter((row) => {
    const dept = activityDeptName(row);
    const type = displayValue(row, ACTIVITY_FIELD.type);
    const text = [
      displayValue(row, ACTIVITY_FIELD.code),
      displayValue(row, ACTIVITY_FIELD.name),
      type,
      formatDate(displayValue(row, ACTIVITY_FIELD.start)),
      formatDate(displayValue(row, ACTIVITY_FIELD.end)),
      dept,
      displayValue(row, ACTIVITY_FIELD.count),
      creatorName(row),
      formatDateTime(systemCreateTime(row))
    ]
      .join(" ")
      .toLowerCase();
    const conditions = [];
    if (state.deptFilter) {
      conditions.push(dept.includes(state.deptFilter));
    }
    if (state.typeFilter) {
      conditions.push(type === state.typeFilter);
    }
    const passesFilters = !conditions.length
      ? true
      : state.filterRelation === "any"
        ? conditions.some(Boolean)
        : conditions.every(Boolean);

    return (
      passesFilters &&
      (!query || text.includes(query))
    );
  });

  return sortRows(rows);
}

function sortRows(rows) {
  if (!state.sortField) {
    return rows;
  }

  const direction = state.sortDirection === "desc" ? -1 : 1;
  const type = SORT_FIELD_TYPE[state.sortField] || "text";

  return [...rows].sort((left, right) => {
    const leftValue = sortValue(left, state.sortField, type);
    const rightValue = sortValue(right, state.sortField, type);
    if (type === "text") {
      return direction * String(leftValue).localeCompare(String(rightValue), "zh-Hans-CN", {
        numeric: true,
        sensitivity: "base"
      });
    }
    if (leftValue > rightValue) {
      return direction;
    }
    if (leftValue < rightValue) {
      return -direction;
    }
    return 0;
  });
}

function sortValue(row, key, type) {
  const fieldMap = {
    code: ACTIVITY_FIELD.code,
    name: ACTIVITY_FIELD.name,
    type: ACTIVITY_FIELD.type,
    start: ACTIVITY_FIELD.start,
    end: ACTIVITY_FIELD.end,
    dept: ACTIVITY_FIELD.dept,
    count: ACTIVITY_FIELD.count,
    creator: "",
    createTime: ""
  };
  const value =
    key === "creator"
      ? creatorName(row)
      : key === "createTime"
        ? systemCreateTime(row)
        : key === "dept"
          ? activityDeptName(row)
          : displayValue(row, fieldMap[key]);
  if (type === "number") {
    const number = Number(value);
    return Number.isFinite(number) ? number : -Infinity;
  }
  if (type === "date") {
    return dateSortValue(value);
  }
  return String(value);
}

function render() {
  const rows = visibleRows();
  dom.rows.innerHTML = rows.map(renderRow).join("");
  dom.emptyState.textContent = state.emptyMessage;
  dom.emptyState.hidden = rows.length > 0;
  dom.recordSummary.textContent = `共 ${state.total || rows.length} 条，当前显示 ${rows.length} 条`;
  dom.pageLabel.textContent = `第 ${state.page} 页`;
  dom.newButton.disabled = !state.apiReady;
  dom.prevPageButton.disabled = state.page <= 1;
  dom.nextPageButton.disabled = state.page >= totalPages();
  dom.printQrButton.disabled = state.selectedIds.size === 0;
  if (dom.deleteButton) {
    dom.deleteButton.disabled = state.selectedIds.size === 0 || !state.apiReady;
  }
  dom.filterButton.classList.toggle("active", Boolean(state.typeFilter || state.deptFilter));
  dom.sortButton.classList.toggle("active", Boolean(state.sortField));
  dom.checkAll.checked = rows.length > 0 && rows.every((row) => state.selectedIds.has(rowId(row)));
  dom.checkAll.indeterminate =
    rows.some((row) => state.selectedIds.has(rowId(row))) && !dom.checkAll.checked;

  bindRowEvents();
}

function renderRow(row) {
  const id = rowId(row);
  const checked = state.selectedIds.has(id) ? "checked" : "";
  const selectedClass = state.selectedIds.has(id) ? "selected" : "";
  const qr = displayValue(row, ACTIVITY_FIELD.qr);
  const qrLink = qr
    ? `<img class="qr-thumb" src="${escapeHtml(qrImageUrl(qr, 72))}" alt="问卷二维码" title="扫码打开问卷" />`
    : "";

  return `
    <tr class="${selectedClass}" data-id="${escapeHtml(id)}">
      <td class="check-col"><input class="row-check" type="checkbox" ${checked} aria-label="选择记录" /></td>
      <td>${escapeHtml(displayValue(row, ACTIVITY_FIELD.code))}</td>
      <td>${escapeHtml(displayValue(row, ACTIVITY_FIELD.name))}</td>
      <td>${escapeHtml(displayValue(row, ACTIVITY_FIELD.type))}</td>
      <td>${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.start)))}</td>
      <td>${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.end)))}</td>
      <td><span class="link-text">${escapeHtml(activityDeptName(row))}</span></td>
      <td class="number-col">${escapeHtml(displayValue(row, ACTIVITY_FIELD.count))}</td>
      <td class="qr-cell">${qrLink}</td>
      <td><span class="link-text">${escapeHtml(creatorName(row) || "-")}</span></td>
      <td>${escapeHtml(formatDateTime(systemCreateTime(row)) || "-")}</td>
    </tr>
  `;
}

function bindRowEvents() {
  dom.rows.querySelectorAll("tr").forEach((tr) => {
    tr.addEventListener("click", (event) => {
      const id = tr.dataset.id;
      if (event.target.classList.contains("row-check")) {
        toggleRow(id, event.target.checked);
        return;
      }
      state.selectedIds.clear();
      state.selectedIds.add(id);
      state.lastSelectedId = id;
      showDetailView(id);
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

function openEditor(row) {
  const editing = Boolean(row);
  const selectedDept = editing ? activityDeptSelectedValue(row) : "";
  dom.drawerTitle.textContent = editing ? "编辑活动" : "新增活动";
  dom.recordId.value = editing ? rowId(row) : "";
  dom.activityCode.value = editing ? displayValue(row, ACTIVITY_FIELD.code) : "";
  dom.activityName.value = editing ? displayValue(row, ACTIVITY_FIELD.name) : "";
  dom.activityType.value = editing ? displayValue(row, ACTIVITY_FIELD.type) : "";
  dom.startDate.value = editing ? formatDate(displayValue(row, ACTIVITY_FIELD.start)) : "";
  dom.endDate.value = editing ? formatDate(displayValue(row, ACTIVITY_FIELD.end)) : "";
  hydrateDepartmentSelect(selectedDept);
  dom.department.value = selectedDept;
  dom.activityCount.value = editing ? displayValue(row, ACTIVITY_FIELD.count) : "";
  dom.questionnaireTemplate.value = questionnaireTemplate(row);
  dom.generatedQr.value = editing ? displayValue(row, ACTIVITY_FIELD.qr) || buildSurveyUrl(row) : "";
  refreshActivitySelects();
  dom.formHint.textContent = editing ? "编辑当前活动记录" : "活动编号由底表自动生成";
  dom.drawerMask.hidden = false;
  dom.editorDrawer.classList.add("open");
  dom.editorDrawer.setAttribute("aria-hidden", "false");
  setTimeout(() => dom.activityName.focus(), 0);
}

function showDetailView(id) {
  state.detailId = id;
  state.detailEditing = false;
  state.selectedIds.clear();
  state.selectedIds.add(id);
  state.lastSelectedId = id;
  dom.detailMask.hidden = false;
  dom.detailPage.hidden = false;
  render();
  renderDetailView();
}

function showListView() {
  state.detailEditing = false;
  dom.detailPage.classList.remove("editing");
  dom.detailMask.hidden = true;
  dom.detailPage.hidden = true;
  render();
}

function renderDetailView() {
  if (dom.detailPage.hidden) {
    return;
  }

  const rows = visibleRows();
  const row = getDetailRow();
  if (!row) {
    showListView();
    return;
  }

  const index = rows.findIndex((item) => rowId(item) === rowId(row));
  const qr = displayValue(row, ACTIVITY_FIELD.qr) || buildSurveyUrl(row);

  dom.detailPage.classList.toggle("editing", state.detailEditing);
  dom.detailEditFooter.hidden = !state.detailEditing;
  dom.detailDeleteButton.disabled = state.detailEditing;
  dom.detailPrintButton.disabled = state.detailEditing;
  dom.cancelDetailEditButton.hidden = !state.detailEditing;
  dom.detailPosition.textContent = `${index + 1} / ${rows.length}`;
  dom.prevDetailButton.disabled = state.detailEditing || index <= 0;
  dom.nextDetailButton.disabled = state.detailEditing || index < 0 || index >= rows.length - 1;
  if (state.detailEditing) {
    renderDetailEdit(row, qr);
  } else {
    renderDetailRead(row, qr);
  }
}

function renderDetailRead(row, qr) {
  dom.detailCode.textContent = displayValue(row, ACTIVITY_FIELD.code) || "-";
  dom.detailName.textContent = displayValue(row, ACTIVITY_FIELD.name) || "-";
  dom.detailType.textContent = displayValue(row, ACTIVITY_FIELD.type) || "-";
  dom.detailStart.textContent = formatDate(displayValue(row, ACTIVITY_FIELD.start)) || "-";
  dom.detailEnd.textContent = formatDate(displayValue(row, ACTIVITY_FIELD.end)) || "-";
  dom.detailDept.textContent = activityDeptName(row) || "-";
  dom.detailCount.textContent = displayValue(row, ACTIVITY_FIELD.count) || "-";
  dom.detailTemplate.textContent = questionnaireTemplate(row);
  renderDetailMeta(row);
  dom.detailQr.innerHTML = qr
    ? `<img class="detail-qr-img" src="${escapeHtml(qrImageUrl(qr, 156))}" alt="问卷二维码" />`
    : "未生成";
}

function renderDetailEdit(row, qr) {
  const type = displayValue(row, ACTIVITY_FIELD.type);
  const template = questionnaireTemplate(row);
  const selectedDept = activityDeptSelectedValue(row);
  dom.detailCode.innerHTML = `<input class="detail-input" value="${escapeHtml(displayValue(row, ACTIVITY_FIELD.code))}" disabled />`;
  dom.detailName.innerHTML = `<input class="detail-input" id="detailEditName" value="${escapeHtml(displayValue(row, ACTIVITY_FIELD.name))}" />`;
  dom.detailType.innerHTML = `
    <select class="detail-input" id="detailEditType">
      ${["", "体验营", "直播", "讲座", "走访", "沙龙"]
        .map((item) => `<option value="${escapeHtml(item)}" ${item === type ? "selected" : ""}>${escapeHtml(item || "请选择")}</option>`)
        .join("")}
    </select>
  `;
  dom.detailStart.innerHTML = `<input class="detail-input activity-date-input" id="detailEditStart" type="date" value="${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.start)))}" />`;
  dom.detailEnd.innerHTML = `<input class="detail-input activity-date-input" id="detailEditEnd" type="date" value="${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.end)))}" />`;
  dom.detailDept.innerHTML = `<select class="detail-input" id="detailEditDept">${departmentOptionsHtml(selectedDept)}</select>`;
  dom.detailCount.innerHTML = `<input class="detail-input" id="detailEditCount" type="number" min="0" value="${escapeHtml(displayValue(row, ACTIVITY_FIELD.count))}" />`;
  dom.detailTemplate.innerHTML = `
    <select class="detail-input" id="detailEditTemplate">
      ${[QUESTIONNAIRE_TEMPLATE.lecture, QUESTIONNAIRE_TEMPLATE.promo]
        .map((item) => `<option value="${escapeHtml(item)}" ${item === template ? "selected" : ""}>${escapeHtml(item)}</option>`)
        .join("")}
    </select>
  `;
  renderDetailMeta(row);
  dom.detailQr.innerHTML = qr
    ? `<img class="detail-qr-img" src="${escapeHtml(qrImageUrl(qr, 156))}" alt="问卷二维码" />`
    : "保存后生成";
  setTimeout(() => document.querySelector("#detailEditName")?.focus(), 0);
}

function toggleDetailEdit() {
  state.detailEditing = true;
  renderDetailView();
}

function cancelDetailEdit() {
  state.detailEditing = false;
  renderDetailView();
}

async function saveDetailEdit() {
  const row = getDetailRow();
  if (!row) {
    return;
  }

  const id = rowId(row);
  const code = displayValue(row, ACTIVITY_FIELD.code);
  const name = document.querySelector("#detailEditName")?.value.trim() || "";
  if (!name) {
    setStatus("请填写活动名称");
    return;
  }

  const data = {
    [ACTIVITY_FIELD.name]: name,
    [ACTIVITY_FIELD.type]: document.querySelector("#detailEditType")?.value || "",
    [ACTIVITY_FIELD.start]: document.querySelector("#detailEditStart")?.value || "",
    [ACTIVITY_FIELD.end]: document.querySelector("#detailEditEnd")?.value || "",
    [ACTIVITY_FIELD.dept]: document.querySelector("#detailEditDept")?.value || "",
    [ACTIVITY_FIELD.count]: Number(document.querySelector("#detailEditCount")?.value || 0),
    [ACTIVITY_FIELD.template]: document.querySelector("#detailEditTemplate")?.value || QUESTIONNAIRE_TEMPLATE.lecture
  };

  if (!data[ACTIVITY_FIELD.dept]) {
    setStatus("请选择活动所属部门");
    return;
  }

  if (code) {
    data[ACTIVITY_FIELD.qr] = buildSurveyUrl({
      [ACTIVITY_FIELD.code]: code,
      [ACTIVITY_FIELD.name]: name,
      [ACTIVITY_FIELD.template]: data[ACTIVITY_FIELD.template]
    });
  }

  try {
    setStatus("正在保存详情");
    await postJson(apiUrl("/api/activity/update"), {
      data_id: id,
      _id: id,
      data
    });
    state.detailEditing = false;
    await loadRows();
    state.detailId = id;
    renderDetailView();
    setStatus("保存成功");
  } catch (error) {
    setStatus(`保存失败：${error.message}`);
  }
}

function stepDetail(offset) {
  const rows = visibleRows();
  const index = rows.findIndex((row) => rowId(row) === state.detailId);
  const next = rows[index + offset];
  if (next) {
    showDetailView(rowId(next));
  }
}

function closeEditor() {
  dom.editorDrawer.classList.remove("open");
  dom.editorDrawer.setAttribute("aria-hidden", "true");
  dom.drawerMask.hidden = true;
  dom.activityForm.reset();
  dom.recordId.value = "";
  hydrateDepartmentSelect();
  refreshActivitySelects();
}

function refreshEditorQr() {
  const code = dom.activityCode.value.trim();
  const name = dom.activityName.value.trim();
  dom.generatedQr.value = code && name
    ? buildSurveyUrl({
      [ACTIVITY_FIELD.code]: code,
      [ACTIVITY_FIELD.name]: name,
      [ACTIVITY_FIELD.template]: dom.questionnaireTemplate.value || QUESTIONNAIRE_TEMPLATE.lecture
    })
    : "";
}

async function saveActivity(event) {
  event.preventDefault();
  if (!state.apiReady) {
    dom.formHint.textContent = "请先启动后端并配置百数云 API Token";
    setStatus("未连接真实接口，无法保存");
    return;
  }

  const id = dom.recordId.value;
  const code = dom.activityCode.value.trim();
  const data = {
    [ACTIVITY_FIELD.name]: dom.activityName.value.trim(),
    [ACTIVITY_FIELD.type]: dom.activityType.value,
    [ACTIVITY_FIELD.start]: dom.startDate.value,
    [ACTIVITY_FIELD.end]: dom.endDate.value,
    [ACTIVITY_FIELD.dept]: dom.department.value,
    [ACTIVITY_FIELD.count]: Number(dom.activityCount.value || 0),
    [ACTIVITY_FIELD.template]: dom.questionnaireTemplate.value || QUESTIONNAIRE_TEMPLATE.lecture
  };

  if (code) {
    data[ACTIVITY_FIELD.qr] = buildSurveyUrl({
      [ACTIVITY_FIELD.code]: code,
      [ACTIVITY_FIELD.name]: data[ACTIVITY_FIELD.name],
      [ACTIVITY_FIELD.template]: data[ACTIVITY_FIELD.template]
    });
  }

  if (!data[ACTIVITY_FIELD.name]) {
    dom.formHint.textContent = "请填写活动名称";
    return;
  }

  if (!data[ACTIVITY_FIELD.dept]) {
    dom.formHint.textContent = "请选择活动所属部门";
    return;
  }

  try {
    dom.formHint.textContent = "正在保存";

    if (id) {
      await postJson(apiUrl("/api/activity/update"), {
        data_id: id,
        _id: id,
        data
      });
    } else {
      await postJson(apiUrl("/api/activity/create"), { data });
    }

    closeEditor();
    await loadRows();
    if (!dom.detailPage.hidden && id) {
      state.detailId = id;
      renderDetailView();
    }
    setStatus(id ? "活动编辑成功" : "活动新增成功，系统生成编号后会自动生成二维码链接");
  } catch (error) {
    dom.formHint.textContent = `保存失败：${error.message}`;
    setStatus(`保存失败：${error.message}`);
  }
}

async function deleteDetailRow() {
  const row = getDetailRow();
  if (!row) {
    return;
  }

  await deleteRow(row, true);
}

async function deleteSelectedRows() {
  const rows = state.rows.filter((row) => state.selectedIds.has(rowId(row)));
  if (!rows.length) {
    return;
  }

  const label = rows.length === 1
    ? `活动「${displayValue(rows[0], ACTIVITY_FIELD.name) || displayValue(rows[0], ACTIVITY_FIELD.code)}」`
    : `已选择的 ${rows.length} 条活动`;
  if (!confirm(`确认删除${label}？`)) {
    return;
  }

  try {
    for (const row of rows) {
      const id = rowId(row);
      await postJson(apiUrl("/api/activity/delete"), {
        data_id: id,
        _id: id,
        data_ids: [id]
      });
    }
    state.detailId = "";
    state.selectedIds.clear();
    showListView();
    await loadRows();
    setStatus("删除成功");
  } catch (error) {
    setStatus(`删除失败：${error.message}`);
  }
}

async function deleteRow(row, closeDetail = false) {
  const id = rowId(row);
  if (!confirm(`确认删除活动「${displayValue(row, ACTIVITY_FIELD.name) || displayValue(row, ACTIVITY_FIELD.code)}」？`)) {
    return;
  }

  try {
    await postJson(apiUrl("/api/activity/delete"), {
      data_id: id,
      _id: id,
      data_ids: [id]
    });
    state.detailId = "";
    state.selectedIds.clear();
    await loadRows();
    if (closeDetail) {
      showListView();
    }
    setStatus("删除成功");
  } catch (error) {
    setStatus(`删除失败：${error.message}`);
  }
}

async function syncSelectedQr() {
  const rows = state.rows.filter((row) => state.selectedIds.has(rowId(row)));
  if (!rows.length) {
    return;
  }

  try {
    await Promise.all(
      rows.map((row) => {
        const id = rowId(row);
        return postJson(apiUrl("/api/activity/update"), {
          data_id: id,
          _id: id,
          data: {
            [ACTIVITY_FIELD.qr]: buildSurveyUrl(row)
          }
        });
      })
    );

    await loadRows();
    setStatus("二维码已刷新");
  } catch (error) {
    setStatus(`二维码刷新失败：${error.message}`);
  }
}

function printSelectedQrs() {
  const rows = state.rows
    .filter((row) => state.selectedIds.has(rowId(row)))
    .map((row) => {
      const qr = displayValue(row, ACTIVITY_FIELD.qr) || buildSurveyUrl(row);
      return { row, qr };
    })
    .filter((item) => item.qr);

  if (!rows.length) {
    setStatus("请选择带有问卷链接的活动");
    return;
  }

  const printWindow = window.open("", "_blank", "width=960,height=720");
  if (!printWindow) {
    setStatus("浏览器拦截了打印窗口，请允许弹窗后重试");
    return;
  }

  const cards = rows
    .map(({ row, qr }) => {
      const code = displayValue(row, ACTIVITY_FIELD.code);
      const name = displayValue(row, ACTIVITY_FIELD.name);
      const type = displayValue(row, ACTIVITY_FIELD.type);
      const imageUrl = qrImageUrl(qr, 220);

      return `
        <section class="qr-card">
          <div class="qr-code"><img src="${escapeHtml(imageUrl)}" alt="问卷二维码" /></div>
          <div class="qr-info">
            <h2>${escapeHtml(name || "未命名活动")}</h2>
            <p><span>活动编号</span>${escapeHtml(code || "-")}</p>
            <p><span>活动类型</span>${escapeHtml(type || "-")}</p>
          </div>
        </section>
      `;
    })
    .join("");

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <title>活动问卷二维码打印</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 18px;
            color: #1f2a3a;
            font-family: Inter, "HarmonyOS Sans SC", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", Arial, sans-serif;
            background: #ffffff;
          }
          .qr-card {
            width: 100%;
            min-height: 280px;
            display: grid;
            grid-template-columns: 240px 1fr;
            gap: 20px;
            align-items: center;
            padding: 20px;
            border: 1px solid #d7deea;
            border-radius: 6px;
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 14px;
          }
          .qr-code {
            width: 232px;
            height: 232px;
            display: grid;
            place-items: center;
            border: 1px solid #d7deea;
          }
          .qr-code img {
            width: 220px;
            height: 220px;
          }
          h2 {
            margin: 0 0 18px;
            font-size: 22px;
          }
          p {
            margin: 8px 0;
            font-size: 14px;
            line-height: 1.6;
          }
          span {
            display: inline-block;
            width: 72px;
            color: #52627a;
          }
          @page { size: A4; margin: 14mm; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${cards}
        <script>
          window.addEventListener("load", () => {
            setTimeout(() => window.print(), 300);
          });
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
  setStatus(`已生成 ${rows.length} 个二维码打印页`);
}

function printDetailQr() {
  const row = getDetailRow();
  if (!row) {
    return;
  }

  state.selectedIds.clear();
  state.selectedIds.add(rowId(row));
  state.lastSelectedId = rowId(row);
  printSelectedQrs();
}

function buildSurveyUrl(row) {
  const code = displayValue(row, ACTIVITY_FIELD.code);
  const name = displayValue(row, ACTIVITY_FIELD.name);
  if (!code || !name) {
    return "";
  }

  const url = new URL(state.surveyBaseUrl, window.location.origin);
  url.searchParams.set(SURVEY_PARAM.sourceCode, code);
  url.searchParams.set(SURVEY_PARAM.activityName, name);
  if (questionnaireTemplate(row) === QUESTIONNAIRE_TEMPLATE.promo) {
    url.searchParams.set(SURVEY_PARAM.template, QUESTIONNAIRE_TEMPLATE.promo);
  }
  return url.toString();
}

function qrImageUrl(qr, size) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=1&data=${encodeURIComponent(qr)}`;
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
  return String(dataRecordId(row) || displayValue(row, ACTIVITY_FIELD.code));
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

function activityDeptSelectedValue(row) {
  const value = row?.[ACTIVITY_FIELD.dept];
  const deptId = departmentIdFromValue(value);
  if (deptId) {
    return deptId;
  }
  return readComplexValue(value).trim();
}

function activityDeptName(row) {
  const value = row?.[ACTIVITY_FIELD.dept];
  const deptId = departmentIdFromValue(value);
  const dept = state.departments.find((item) => item.deptId === deptId);
  if (dept) {
    return dept.name || dept.pathName || dept.deptId;
  }

  const text = readComplexValue(value).trim();
  const textMatch = state.departments.find((item) => item.deptId === text);
  return textMatch ? textMatch.name : text;
}

function departmentIdFromValue(value) {
  const directId = extractDepartmentId(value);
  if (directId && state.departments.some((dept) => dept.deptId === directId)) {
    return directId;
  }

  const text = readComplexValue(value).trim();
  if (!text) {
    return directId;
  }

  const match = state.departments.find((dept) =>
    dept.deptId === text ||
    dept.name === text ||
    dept.pathName === text ||
    dept.optionName?.trim() === text
  );
  return match?.deptId || directId || "";
}

function extractDepartmentId(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(extractDepartmentId).find(Boolean) || "";
  }
  if (typeof value !== "object") {
    const text = String(value || "").trim();
    return state.departments.some((dept) => dept.deptId === text) ? text : "";
  }

  const direct =
    value.dept_id ||
    value.deptId ||
    value.id ||
    value._id;
  if (direct) {
    return String(direct).trim();
  }

  const candidate = String(value.value || "").trim();
  return state.departments.some((dept) => dept.deptId === candidate) ? candidate : "";
}

function questionnaireTemplate(row) {
  return displayValue(row, ACTIVITY_FIELD.template) || QUESTIONNAIRE_TEMPLATE.lecture;
}

function renderDetailMeta(row) {
  dom.detailCreator.textContent = creatorName(row) || "-";
  dom.detailCreateTime.textContent = formatDateTime(systemCreateTime(row)) || "-";
  dom.detailUpdateTime.textContent = formatDateTime(systemUpdateTime(row)) || "-";
  dom.detailDataId.textContent = dataRecordId(row) || "-";
}

function creatorName(row) {
  return readComplexValue(
    row?.creator ||
    row?.createUser ||
    row?.createdBy ||
    row?.submitter ||
    row?.operator ||
    row?.data?.creator ||
    ""
  );
}

function systemCreateTime(row) {
  return (
    row?.createTime ||
    row?.create_time ||
    row?.createdAt ||
    row?.created_at ||
    row?.submitTime ||
    row?.data?.createTime ||
    ""
  );
}

function systemUpdateTime(row) {
  return (
    row?.updateTime ||
    row?.update_time ||
    row?.updatedAt ||
    row?.updated_at ||
    row?.data?.updateTime ||
    row?.data?.update_time ||
    ""
  );
}

function dataRecordId(row) {
  return String(
    row?._id ||
    row?.id ||
    row?.data_id ||
    row?.dataId ||
    row?.entry_id ||
    row?.entryId ||
    row?.data?._id ||
    row?.data?.id ||
    ""
  ).trim();
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

function formatDate(value) {
  if (!value) {
    return "";
  }
  return String(value).slice(0, 10);
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }
  const text = String(value).replace("T", " ");
  return text.length >= 19 ? text.slice(0, 19) : text;
}

function dateSortValue(value) {
  const text = formatDateTime(value);
  if (!text) {
    return -Infinity;
  }

  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}):(\d{2}))?/);
  if (match) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    ).getTime();
  }

  const time = new Date(text).getTime();
  return Number.isFinite(time) ? time : -Infinity;
}

function totalPages() {
  return Math.max(1, Math.ceil((state.total || visibleRows().length || 1) / state.limit));
}

function setStatus(text) {
  if (dom.statusText) {
    dom.statusText.textContent = text;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
