const ACTIVITY_FIELD = {
  code: "_widget_1771903125126",
  name: "_widget_1771903125107",
  type: "_widget_1771903125403",
  start: "_widget_1771903125195",
  end: "_widget_1771903125609",
  dept: "_widget_1771903125451",
  count: "_widget_1772249483639",
  template: "_widget_1779761373894",
  directionPreset: "_widget_1779860682092",
  submitter: "_widget_1779937943910",
  qrStatus: "_widget_1779946717564",
  qr: "_widget_1771904304705"
};

const QR_STATUS = {
  enabled: "启用",
  disabled: "停用"
};

const DIRECTION_PRESET_FIELD = {
  code: "_widget_1779852433271",
  projectType: "_widget_1779853660697",
  direction: "_widget_1779852433252",
  sort: "_widget_1780469479044"
};

const ACTIVITY_TYPE_FIELD = {
  code: "_widget_1779852433271",
  type: "_widget_1779853660697"
};

if (window.location.protocol === "file:") {
  window.location.replace("http://127.0.0.1:3000/");
  throw new Error("请通过后端服务地址打开页面");
}

const SURVEY_PARAM = {
  sourceCode: "_widget_1778461489795",
  activityName: "_widget_1778461489814",
  template: "_widget_1779761373894",
  directionPreset: "_widget_1779860682092"
};

const DIRECTION_PRESET_SEPARATOR = "；";

const QUESTIONNAIRE_TEMPLATE = {
  lecture: "活动讲座模版",
  promo: "展架等宣传品通用模版",
  experience: "MBA-EMBA报考咨询表(体验营用)",
  suzhouExperienceDay: "苏州-EMBA/MBA 体验日",
  hefeiExperienceDay: "合肥-EMBA/MBA 体验日",
  shanghaiExperienceDay: "上海-EMBA/MBA体验日"
};

const QUESTIONNAIRE_TEMPLATE_OPTIONS = Object.values(QUESTIONNAIRE_TEMPLATE);

const EXPERIENCE_DEFAULT_DIRECTION_NAMES = [
  "非全日制科创EMBA",
  "非全日制MBA综合管理方向",
  "非全日制MBA科技金融方向",
  "非全日制MBA科技创业方向",
  "非全日制MBA人工智能商业应用方向",
  "全日制MBA"
];

const EXPERIENCE_DEFAULT_DIRECTION_CODES = [
  "BKFX-0001",
  "BKFX-0002",
  "BKFX-0003",
  "BKFX-0004",
  "BKFX-0005",
  "BKFX-0006"
];

const ACTIVITY_TYPE_OPTIONS = ["体验营", "直播", "讲座", "走访", "沙龙"];

const ACTIVITY_FILTER_FIELDS = [
  { key: "code", label: "活动编号", type: "text" },
  { key: "name", label: "活动名称", type: "text" },
  { key: "type", label: "活动类型", type: "select", options: ACTIVITY_TYPE_OPTIONS },
  { key: "directionPreset", label: "报考方向预设", type: "text" },
  { key: "start", label: "活动开始日期", type: "date" },
  { key: "end", label: "活动结束日期", type: "date" },
  { key: "dept", label: "活动所属部门", type: "text" },
  { key: "count", label: "活动人数", type: "number" },
  { key: "template", label: "问卷模版", type: "select", options: Object.values(QUESTIONNAIRE_TEMPLATE) },
  { key: "qrStatus", label: "二维码状态", type: "select", options: Object.values(QR_STATUS) },
  { key: "creator", label: "提交人", type: "text" },
  { key: "createTime", label: "提交时间", type: "date" },
  { key: "updateTime", label: "更新时间", type: "date" },
  { key: "dataId", label: "数据ID", type: "text" }
];

const SORT_FIELD_TYPE = {
  code: "text",
  name: "text",
  type: "text",
  start: "date",
  end: "date",
  dept: "text",
  count: "number",
  qrStatus: "text",
  creator: "text",
  createTime: "date"
};

const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";
const activityDatePickerState = {
  input: null,
  year: 0,
  month: 0,
  day: 0
};

const state = {
  rows: [],
  departments: [],
  directionOptions: [],
  editorDirectionSelected: new Set(),
  total: 0,
  page: 1,
  limit: 20,
  selectedIds: new Set(),
  detailId: "",
  detailEditing: false,
  filterRelation: "all",
  filterConditions: [],
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
  filterRelation: document.querySelector("#filterRelation"),
  addFilterConditionButton: document.querySelector("#addFilterConditionButton"),
  filterFieldPicker: document.querySelector("#filterFieldPicker"),
  filterFieldSearch: document.querySelector("#filterFieldSearch"),
  filterFieldList: document.querySelector("#filterFieldList"),
  filterConditions: document.querySelector("#filterConditions"),
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
  pageJumpInput: document.querySelector("#pageJumpInput"),
  totalPageLabel: document.querySelector("#totalPageLabel"),
  firstPageButton: document.querySelector("#firstPageButton"),
  prevPageButton: document.querySelector("#prevPageButton"),
  nextPageButton: document.querySelector("#nextPageButton"),
  lastPageButton: document.querySelector("#lastPageButton"),
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
  directionPresetGroups: document.querySelector("#directionPresetGroups"),
  directionPresetField: document.querySelector(".direction-preset-field"),
  directionPresetSummary: document.querySelector("#directionPresetSummary"),
  directionPresetCount: document.querySelector("#directionPresetCount"),
  selectAllDirectionsButton: document.querySelector("#selectAllDirectionsButton"),
  clearDirectionsButton: document.querySelector("#clearDirectionsButton"),
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
  detailQrStatus: document.querySelector("#detailQrStatus"),
  detailDirectionPreset: document.querySelector("#detailDirectionPreset"),
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
  await loadActivityTypes();
  await loadDepartments();
  await loadDirectionOptions();
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
  dom.addFilterConditionButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFilterFieldPicker();
  });
  dom.filterFieldSearch.addEventListener("input", renderFilterFieldOptions);
  dom.filterFieldList.addEventListener("click", addFilterFieldFromPicker);
  dom.filterConditions.addEventListener("change", updateDraftFilterCondition);
  dom.filterConditions.addEventListener("click", removeDraftFilterCondition);
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
  dom.firstPageButton.addEventListener("click", () => goToPage(1));
  dom.prevPageButton.addEventListener("click", () => goToPage(state.page - 1));
  dom.nextPageButton.addEventListener("click", () => goToPage(state.page + 1));
  dom.lastPageButton.addEventListener("click", () => goToPage(totalPages()));
  dom.pageJumpInput.addEventListener("change", () => goToPage(dom.pageJumpInput.value));
  dom.pageJumpInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      goToPage(dom.pageJumpInput.value);
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
  dom.selectAllDirectionsButton?.addEventListener("click", () => {
    state.editorDirectionSelected = new Set(state.directionOptions.map((option) => option.name));
    renderDirectionPresetPicker();
    refreshEditorQr();
  });
  dom.clearDirectionsButton?.addEventListener("click", () => {
    state.editorDirectionSelected.clear();
    renderDirectionPresetPicker();
    refreshEditorQr();
  });
  dom.questionnaireTemplate.addEventListener("change", updateEditorTemplateState);
  [dom.activityCode, dom.activityName, dom.questionnaireTemplate].forEach((input) => {
    input.addEventListener("input", refreshEditorQr);
    input.addEventListener("change", refreshEditorQr);
  });
  document.addEventListener("pointerdown", openActivityDatePickerFromEvent, true);
  document.addEventListener("keydown", openActivityDatePickerFromKeyboard, true);
  document.addEventListener("focusin", openActivityDatePickerFromFocus, true);
}

function openActivityDatePickerFromEvent(event) {
  const input = event.target instanceof Element
    ? event.target.closest("input.activity-date-input")
    : null;
  if (!input) {
    return;
  }
  if (event.cancelable) {
    event.preventDefault();
  }
  openActivityDatePicker(input);
}

function openActivityDatePickerFromKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  const input = event.target instanceof Element
    ? event.target.closest("input.activity-date-input")
    : null;
  if (!input) {
    return;
  }
  event.preventDefault();
  openActivityDatePicker(input);
}

function openActivityDatePickerFromFocus(event) {
  const input = event.target instanceof Element
    ? event.target.closest("input.activity-date-input")
    : null;
  if (!input || input.disabled) {
    return;
  }
  input.blur();
  openActivityDatePicker(input);
}

function openActivityDatePicker(input) {
  if (!input || input.disabled) {
    return;
  }

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  const picker = ensureActivityDatePicker();
  mountActivityDatePicker(input, picker.mask);
  const selected = parseActivityDate(input.value) || new Date();
  activityDatePickerState.input = input;
  activityDatePickerState.year = selected.getFullYear();
  activityDatePickerState.month = selected.getMonth() + 1;
  activityDatePickerState.day = selected.getDate();
  renderActivityDatePicker();
  picker.mask.hidden = false;
}

function ensureActivityDatePicker() {
  let mask = document.querySelector("#activityDatePickerMask");
  if (!mask) {
    mask = document.createElement("div");
    mask.className = "activity-date-picker-mask";
    mask.id = "activityDatePickerMask";
    mask.hidden = true;
    mask.innerHTML = `
      <div class="activity-date-picker" role="dialog" aria-modal="true" aria-label="选择日期">
        <div class="activity-date-picker-head">
          <button type="button" data-date-action="cancel">取消</button>
          <strong>选择日期</strong>
          <button type="button" data-date-action="today">今天</button>
        </div>
        <div class="activity-date-calendar">
          <div class="activity-date-calendar-nav">
            <button type="button" data-date-action="prev-month" aria-label="上个月">‹</button>
            <span id="activityDateMonthTitle"></span>
            <button type="button" data-date-action="next-month" aria-label="下个月">›</button>
          </div>
          <div class="activity-date-weekdays" aria-hidden="true">
            <span>日</span>
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
          </div>
          <div class="activity-date-calendar-grid" id="activityDateDays"></div>
        </div>
        <div class="activity-date-picker-shortcuts">
          <button type="button" data-date-action="clear">清空</button>
        </div>
      </div>
    `;
    document.body.appendChild(mask);
    mask.addEventListener("pointerdown", (event) => {
      if (event.target === mask) {
        closeActivityDatePicker();
      }
    });
    mask.addEventListener("click", handleActivityDatePickerClick);
  }

  return {
    mask,
    monthTitle: mask.querySelector("#activityDateMonthTitle"),
    days: mask.querySelector("#activityDateDays")
  };
}

function mountActivityDatePicker(input, mask) {
  if (!mask) {
    return;
  }
  const container = activityDatePickerContainer(input);
  if (mask.parentElement !== container) {
    container.appendChild(mask);
  }
  mask.classList.toggle("is-contained", container !== document.body);
}

function activityDatePickerContainer(input) {
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  if (viewportWidth <= 760) {
    return document.body;
  }
  return input?.closest(".editor-drawer.open, .detail-page:not([hidden])") || document.body;
}

function renderActivityDatePicker() {
  const picker = ensureActivityDatePicker();
  const today = new Date();
  const year = Number(activityDatePickerState.year || today.getFullYear());
  const month = Number(activityDatePickerState.month || today.getMonth() + 1);
  const maxDay = daysInActivityMonth(year, month);
  const selectedDay = Math.min(Math.max(Number(activityDatePickerState.day || today.getDate()), 1), maxDay);
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  activityDatePickerState.year = year;
  activityDatePickerState.month = month;
  activityDatePickerState.day = selectedDay;
  picker.monthTitle.textContent = `${year}年${month}月`;

  const cells = [];
  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push('<span class="activity-date-day-placeholder"></span>');
  }
  for (let day = 1; day <= maxDay; day += 1) {
    const classes = ["activity-date-day"];
    if (day === selectedDay) {
      classes.push("is-selected");
    }
    if (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      day === today.getDate()
    ) {
      classes.push("is-today");
    }
    cells.push(`
      <button type="button" class="${classes.join(" ")}" data-date-day="${day}" aria-label="${year}年${month}月${day}日">
        ${day}
      </button>
    `);
  }
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let index = 0; index < trailing; index += 1) {
    cells.push('<span class="activity-date-day-placeholder"></span>');
  }
  picker.days.innerHTML = cells.join("");
}

function handleActivityDatePickerClick(event) {
  const dayButton = event.target instanceof Element
    ? event.target.closest("[data-date-day]")
    : null;
  if (dayButton) {
    activityDatePickerState.day = Number(dayButton.dataset.dateDay);
    setActivityDateInputValue(formatActivityPickerDate(
      activityDatePickerState.year,
      activityDatePickerState.month,
      activityDatePickerState.day
    ));
    closeActivityDatePicker();
    return;
  }

  const action = event.target instanceof Element
    ? event.target.closest("[data-date-action]")?.dataset.dateAction
    : "";
  if (!action) {
    return;
  }
  if (action === "cancel") {
    closeActivityDatePicker();
    return;
  }
  if (action === "prev-month" || action === "next-month") {
    moveActivityDatePickerMonth(action === "prev-month" ? -1 : 1);
    return;
  }
  if (action === "today") {
    const today = new Date();
    activityDatePickerState.year = today.getFullYear();
    activityDatePickerState.month = today.getMonth() + 1;
    activityDatePickerState.day = today.getDate();
    setActivityDateInputValue(formatActivityPickerDate(
      activityDatePickerState.year,
      activityDatePickerState.month,
      activityDatePickerState.day
    ));
    closeActivityDatePicker();
    return;
  }
  if (action === "clear") {
    setActivityDateInputValue("");
    closeActivityDatePicker();
    return;
  }
}

function moveActivityDatePickerMonth(offset) {
  const date = new Date(
    Number(activityDatePickerState.year),
    Number(activityDatePickerState.month) - 1 + offset,
    1
  );
  activityDatePickerState.year = date.getFullYear();
  activityDatePickerState.month = date.getMonth() + 1;
  activityDatePickerState.day = Math.min(
    Number(activityDatePickerState.day || 1),
    daysInActivityMonth(activityDatePickerState.year, activityDatePickerState.month)
  );
  renderActivityDatePicker();
}

function setActivityDateInputValue(value) {
  const input = activityDatePickerState.input;
  if (!input) {
    return;
  }
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function closeActivityDatePicker() {
  const picker = ensureActivityDatePicker();
  picker.mask.hidden = true;
  activityDatePickerState.input = null;
}

function parseActivityDate(value) {
  const match = String(value || "").trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) {
    return null;
  }
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (!Number.isFinite(date.getTime())) {
    return null;
  }
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() + 1 !== Number(month) ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return date;
}

function daysInActivityMonth(year, month) {
  return new Date(Number(year), Number(month), 0).getDate();
}

function formatActivityPickerDate(year, month, day) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}`;
}

function isActivityDateValue(value) {
  const normalized = String(value || "").trim();
  return /^(\d{4})-(\d{2})-(\d{2})$/.test(normalized) && Boolean(parseActivityDate(normalized));
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
  dom.filterFieldPicker.hidden = true;
}

function syncFilterControls() {
  dom.filterRelation.value = state.filterRelation;
  dom.filterFieldSearch.value = "";
  renderFilterFieldOptions();
  renderFilterConditionRows(state.filterConditions);
}

function applyFilters() {
  state.filterConditions = activeFilterConditions(readFilterConditionRows());
  state.filterRelation = dom.filterRelation.value === "any" ? "any" : "all";
  state.page = 1;
  closeToolbarPopovers();
  render();
}

function clearFilters() {
  state.filterRelation = "all";
  state.filterConditions = [];
  syncFilterControls();
  closeToolbarPopovers();
  render();
}

function toggleFilterFieldPicker() {
  dom.filterFieldPicker.hidden = !dom.filterFieldPicker.hidden;
  if (!dom.filterFieldPicker.hidden) {
    dom.filterFieldSearch.value = "";
    renderFilterFieldOptions();
    dom.filterFieldSearch.focus();
  }
}

function renderFilterFieldOptions() {
  const keyword = dom.filterFieldSearch.value.trim().toLowerCase();
  const fields = ACTIVITY_FILTER_FIELDS.filter((field) => field.label.toLowerCase().includes(keyword));
  dom.filterFieldList.innerHTML = fields.length
    ? fields
      .map((field) => `
        <button class="filter-field-option" type="button" data-field="${escapeHtml(field.key)}" role="option">
          ${escapeHtml(field.label)}
        </button>
      `)
      .join("")
    : `<div class="filter-field-empty">未找到字段</div>`;
}

function addFilterFieldFromPicker(event) {
  const option = event.target.closest(".filter-field-option");
  if (!option) {
    return;
  }

  const field = filterFieldByKey(option.dataset.field);
  if (!field) {
    return;
  }

  const conditions = readFilterConditionRows();
  conditions.push({ field: field.key, value: "" });
  renderFilterConditionRows(conditions);
  dom.filterFieldPicker.hidden = true;
}

function renderFilterConditionRows(conditions = []) {
  const rows = conditions.length
    ? conditions
    : [];
  dom.filterConditions.innerHTML = rows.length
    ? rows.map((condition, index) => filterConditionRowHtml(condition, index)).join("")
    : `<div class="filter-empty">暂无筛选条件，可点击上方添加</div>`;
}

function filterConditionRowHtml(condition, index) {
  const field = filterFieldByKey(condition.field) || ACTIVITY_FILTER_FIELDS[0];
  return `
    <div class="filter-rule" data-index="${index}">
      <select class="filter-field-select" aria-label="筛选字段">
        ${ACTIVITY_FILTER_FIELDS.map((item) => `
          <option value="${escapeHtml(item.key)}" ${item.key === field.key ? "selected" : ""}>${escapeHtml(item.label)}</option>
        `).join("")}
      </select>
      ${filterValueControlHtml(field, condition.value)}
      <button class="filter-remove-button" type="button" title="删除条件" aria-label="删除条件">×</button>
    </div>
  `;
}

function filterValueControlHtml(field, value = "") {
  const escapedValue = escapeHtml(value);
  if (field.type === "select") {
    return `
      <select class="filter-value-input" aria-label="筛选值">
        <option value="">全部${escapeHtml(field.label)}</option>
        ${(field.options || []).map((option) => `
          <option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>
        `).join("")}
      </select>
    `;
  }

  const inputType = field.type === "date" ? "date" : field.type === "number" ? "number" : "search";
  const placeholder = field.type === "date" ? "选择日期" : `输入${field.label}关键词`;
  return `
    <input
      class="filter-value-input"
      type="${inputType}"
      value="${escapedValue}"
      placeholder="${escapeHtml(placeholder)}"
      aria-label="筛选值"
    />
  `;
}

function updateDraftFilterCondition(event) {
  const row = event.target.closest(".filter-rule");
  if (!row || !event.target.classList.contains("filter-field-select")) {
    return;
  }

  const index = Number(row.dataset.index);
  const conditions = readFilterConditionRows();
  if (conditions[index]) {
    conditions[index] = { field: event.target.value, value: "" };
    renderFilterConditionRows(conditions);
  }
}

function removeDraftFilterCondition(event) {
  const button = event.target.closest(".filter-remove-button");
  if (!button) {
    return;
  }

  const row = button.closest(".filter-rule");
  const index = Number(row?.dataset.index);
  const conditions = readFilterConditionRows();
  conditions.splice(index, 1);
  renderFilterConditionRows(conditions);
}

function readFilterConditionRows() {
  return Array.from(dom.filterConditions.querySelectorAll(".filter-rule")).map((row) => ({
    field: row.querySelector(".filter-field-select")?.value || "",
    value: row.querySelector(".filter-value-input")?.value.trim() || ""
  }));
}

function activeFilterConditions(conditions = []) {
  return conditions.filter((condition) => filterFieldByKey(condition.field) && condition.value);
}

function filterFieldByKey(key) {
  return ACTIVITY_FILTER_FIELDS.find((field) => field.key === key);
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

async function loadActivityTypes() {
  hydrateActivityTypeSelect();

  if (!state.apiReady) {
    return;
  }

  try {
    const result = await postJson(apiUrl("/api/activity-types/list"), {
      page: 1,
      limit: 300
    });
    const types = normalizeActivityTypes(extractRows(result));
    if (types.length) {
      setActivityTypeOptions(types);
    }
    hydrateActivityTypeSelect();
  } catch (error) {
    hydrateActivityTypeSelect();
    setStatus(`活动类型加载失败：${error.message}`);
  }
}

function normalizeActivityTypes(rows) {
  return uniqueTextValues(
    rows
      .map((row) => displayValue(row, ACTIVITY_TYPE_FIELD.type))
      .filter(Boolean)
  );
}

function setActivityTypeOptions(types) {
  ACTIVITY_TYPE_OPTIONS.splice(0, ACTIVITY_TYPE_OPTIONS.length, ...uniqueTextValues(types));
}

function hydrateActivityTypeSelect(selectedValue = "") {
  if (!dom.activityType) {
    return;
  }

  const value = String(selectedValue || dom.activityType.value || "").trim();
  dom.activityType.innerHTML = activityTypeOptionsHtml(value);
  refreshActivitySelect(dom.activityType);
}

function activityTypeOptionsHtml(selectedValue = "") {
  const value = String(selectedValue || "").trim();
  const hasSelectedType = ACTIVITY_TYPE_OPTIONS.includes(value);
  const options = [
    `<option value="">请选择</option>`,
    value && !hasSelectedType
      ? `<option value="${escapeHtml(value)}" selected>${escapeHtml(value)}</option>`
      : "",
    ...ACTIVITY_TYPE_OPTIONS.map((type) => {
      const selected = type === value ? "selected" : "";
      return `<option value="${escapeHtml(type)}" ${selected}>${escapeHtml(type)}</option>`;
    })
  ].filter(Boolean);
  return options.join("");
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

async function loadDirectionOptions() {
  state.directionOptions = [];
  renderDirectionPresetPicker();

  if (!state.apiReady) {
    return;
  }

  try {
    const result = await postJson(apiUrl("/api/direction-presets/list"), {
      page: 1,
      limit: 300
    });
    state.directionOptions = normalizeDirectionOptions(extractRows(result));
    renderDirectionPresetPicker();
  } catch (error) {
    state.directionOptions = [];
    renderDirectionPresetPicker();
    setStatus(`报考方向预设加载失败：${error.message}`);
  }
}

function normalizeDirectionOptions(rows) {
  const seen = new Set();
  const options = rows
    .map((row, index) => ({
      code: displayValue(row, DIRECTION_PRESET_FIELD.code),
      projectType: displayValue(row, DIRECTION_PRESET_FIELD.projectType) || "未分组",
      name: displayValue(row, DIRECTION_PRESET_FIELD.direction),
      sort: sortableNumber(displayValue(row, DIRECTION_PRESET_FIELD.sort)),
      index
    }))
    .filter((option) => option.name)
    .filter((option) => {
      const key = `${option.projectType}::${option.name}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

  const groupOrder = ["学历项目", "非学历项目", "未分组"];
  return options.sort((left, right) => {
    const leftGroup = groupOrder.indexOf(left.projectType);
    const rightGroup = groupOrder.indexOf(right.projectType);
    if (leftGroup !== rightGroup) {
      return (leftGroup < 0 ? groupOrder.length : leftGroup) - (rightGroup < 0 ? groupOrder.length : rightGroup);
    }
    if (left.sort !== right.sort) {
      return left.sort - right.sort;
    }
    return left.index - right.index;
  });
}

function renderDirectionPresetPicker() {
  renderDirectionPresetControl({
    groupsEl: dom.directionPresetGroups,
    countEl: dom.directionPresetCount,
    summaryEl: dom.directionPresetSummary,
    selectAllButton: dom.selectAllDirectionsButton,
    clearButton: dom.clearDirectionsButton,
    onChange: refreshEditorQr
  });
}

function renderDirectionPresetControl(target) {
  const { groupsEl, countEl, summaryEl, selectAllButton, clearButton, onChange } = target;
  if (!groupsEl) {
    return;
  }

  const selectedNames = selectedDirectionPresetNames();
  const optionNames = new Set(state.directionOptions.map((option) => option.name));
  const groups = groupDirectionOptions();
  const missingSelected = selectedNames
    .filter((name) => !optionNames.has(name))
    .map((name) => ({ code: "", projectType: "已保存选项", name }));
  if (missingSelected.length) {
    groups.set("已保存选项", missingSelected);
  }

  if (!groups.size) {
    groupsEl.innerHTML = `<div class="direction-preset-empty">暂无可选报考方向</div>`;
  } else {
    groupsEl.innerHTML = Array.from(groups.entries())
      .map(([groupName, options]) => {
        const selectedInGroup = options.filter((option) => state.editorDirectionSelected.has(option.name)).length;
        const allSelected = options.length > 0 && selectedInGroup === options.length;
        const partialSelected = selectedInGroup > 0 && !allSelected;
        return `
        <section class="direction-preset-group">
          <div class="direction-preset-group-head">
            <div>
              <strong>${escapeHtml(groupName)}</strong>
              <span>${options.length} 项</span>
            </div>
            <label class="direction-group-select">
              <input
                name="directionGroupPreset"
                type="checkbox"
                value="${escapeHtml(groupName)}"
                data-group="${escapeHtml(groupName)}"
                aria-label="${escapeHtml(`选择全部${groupName}`)}"
                ${allSelected ? "checked" : ""}
                ${partialSelected ? 'data-partial="true"' : ""}
              />
              <span class="direction-preset-check" aria-hidden="true"></span>
            </label>
          </div>
          <div class="direction-preset-options">
            ${options.map((option) => directionOptionHtml(option, state.editorDirectionSelected.has(option.name))).join("")}
          </div>
        </section>
      `;
      })
      .join("");
  }

  groupsEl.querySelectorAll('input[name="directionGroupPreset"]').forEach((input) => {
    input.indeterminate = input.dataset.partial === "true";
    input.addEventListener("change", () => {
      const groupName = input.dataset.group || "";
      const groupOptions = groups.get(groupName) || [];
      groupOptions.forEach((option) => {
        if (input.checked) {
          state.editorDirectionSelected.add(option.name);
        } else {
          state.editorDirectionSelected.delete(option.name);
        }
      });
      renderDirectionPresetControl(target);
      onChange?.();
    });
  });

  groupsEl.querySelectorAll('input[name="directionPreset"]').forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.editorDirectionSelected.add(input.value);
      } else {
        state.editorDirectionSelected.delete(input.value);
      }
      renderDirectionPresetControl(target);
      onChange?.();
    });
  });
  renderDirectionPresetSummary({ countEl, summaryEl, selectAllButton, clearButton });
}

function groupDirectionOptions() {
  const groups = new Map();
  for (const option of state.directionOptions) {
    const groupName = option.projectType || "未分组";
    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName).push(option);
  }
  return groups;
}

function directionOptionHtml(option, selected) {
  const label = option.code ? `${option.name}（${option.code}）` : option.name;
  return `
    <label class="direction-preset-option">
      <input name="directionPreset" type="checkbox" value="${escapeHtml(option.name)}" ${selected ? "checked" : ""} />
      <span class="direction-preset-check" aria-hidden="true"></span>
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

function renderDirectionPresetSummary(target = {}) {
  const selectedNames = selectedDirectionPresetNames();
  const countEl = target.countEl || dom.directionPresetCount;
  const summaryEl = target.summaryEl || dom.directionPresetSummary;
  const selectAllButton = target.selectAllButton || dom.selectAllDirectionsButton;
  const clearButton = target.clearButton || dom.clearDirectionsButton;
  if (countEl) {
    countEl.textContent = `已选 ${selectedNames.length} 项`;
  }
  if (summaryEl) {
    summaryEl.innerHTML = selectedNames.length
      ? selectedNames.map((name) => `<span class="direction-preset-tag">${escapeHtml(name)}</span>`).join("")
      : `<span class="direction-preset-muted">请选择本活动问卷可用的报考方向</span>`;
  }
  if (selectAllButton) {
    selectAllButton.disabled = state.directionOptions.length === 0;
  }
  if (clearButton) {
    clearButton.disabled = selectedNames.length === 0;
  }
}

function selectedDirectionPresetNames() {
  const selectedSet = state.editorDirectionSelected;
  return uniqueTextValues([
    ...state.directionOptions.map((option) => option.name).filter((name) => selectedSet.has(name)),
    ...selectedSet
  ]);
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
    const countResult = await postJson(apiUrl("/api/activity/count"), {});
    const total = extractTotal(countResult, 0);
    const listRows = await fetchActivityRowsForDisplay(total);
    state.rows = ensureQr(listRows);
    state.total = total || state.rows.length;
    state.page = Math.min(state.page, totalPages());
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

async function fetchActivityRowsForDisplay(total) {
  const totalRows = Number(total || 0);
  const pageSize = 300;
  const firstLimit = totalRows > 0 ? Math.min(Math.max(totalRows, state.limit), pageSize) : Math.max(state.limit, 50);
  const firstResult = await postJson(apiUrl("/api/activity/list"), {
    page: 1,
    limit: firstLimit
  });
  const rows = extractRows(firstResult);

  if (!totalRows || rows.length >= totalRows || rows.length < firstLimit) {
    return rows;
  }

  let page = 2;
  while (rows.length < totalRows) {
    const result = await postJson(apiUrl("/api/activity/list"), {
      page,
      limit: pageSize
    });
    const pageRows = extractRows(result);
    if (!pageRows.length) {
      break;
    }
    rows.push(...pageRows);
    page += 1;
  }
  return rows.slice(0, totalRows);
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
  const filters = activeFilterConditions(state.filterConditions);
  const rows = state.rows.filter((row) => {
    const text = [
      displayValue(row, ACTIVITY_FIELD.code),
      displayValue(row, ACTIVITY_FIELD.name),
      displayValue(row, ACTIVITY_FIELD.type),
      directionPresetSummary(row),
      formatDate(displayValue(row, ACTIVITY_FIELD.start)),
      formatDate(displayValue(row, ACTIVITY_FIELD.end)),
      activityDeptName(row),
      displayValue(row, ACTIVITY_FIELD.count),
      questionnaireTemplate(row),
      qrStatus(row),
      creatorName(row),
      formatDateTime(systemCreateTime(row)),
      formatDateTime(systemUpdateTime(row)),
      rowId(row)
    ]
      .join(" ")
      .toLowerCase();
    const filterResults = filters.map((condition) => rowMatchesFilter(row, condition));
    const passesFilters = !filterResults.length
      ? true
      : state.filterRelation === "any"
        ? filterResults.some(Boolean)
        : filterResults.every(Boolean);

    return (
      passesFilters &&
      (!query || text.includes(query))
    );
  });

  return sortRows(rows);
}

function rowMatchesFilter(row, condition) {
  const field = filterFieldByKey(condition.field);
  if (!field) {
    return true;
  }

  const expected = String(condition.value || "").trim();
  if (!expected) {
    return true;
  }

  const actual = String(filterRowValue(row, field.key) || "").trim();
  if (field.type === "select" || field.type === "date") {
    return actual === expected;
  }
  if (field.type === "number") {
    return Number(actual) === Number(expected);
  }
  return actual.toLowerCase().includes(expected.toLowerCase());
}

function filterRowValue(row, key) {
  if (key === "qrStatus") {
    return qrStatus(row);
  }
  const fieldMap = {
    code: ACTIVITY_FIELD.code,
    name: ACTIVITY_FIELD.name,
    type: ACTIVITY_FIELD.type,
    count: ACTIVITY_FIELD.count,
    qrStatus: ACTIVITY_FIELD.qrStatus
  };
  if (fieldMap[key]) {
    return displayValue(row, fieldMap[key]);
  }
  if (key === "directionPreset") {
    return directionPresetSummary(row);
  }
  if (key === "start") {
    return formatDate(displayValue(row, ACTIVITY_FIELD.start));
  }
  if (key === "end") {
    return formatDate(displayValue(row, ACTIVITY_FIELD.end));
  }
  if (key === "dept") {
    return activityDeptName(row);
  }
  if (key === "template") {
    return questionnaireTemplate(row);
  }
  if (key === "creator") {
    return creatorName(row);
  }
  if (key === "createTime") {
    return formatDate(systemCreateTime(row));
  }
  if (key === "updateTime") {
    return formatDate(systemUpdateTime(row));
  }
  if (key === "dataId") {
    return rowId(row);
  }
  return "";
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
    qrStatus: ACTIVITY_FIELD.qrStatus,
    creator: "",
    createTime: ""
  };
  const value =
    key === "creator"
      ? creatorName(row)
      : key === "createTime"
        ? systemCreateTime(row)
        : key === "qrStatus"
          ? qrStatus(row)
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
  const allRows = visibleRows();
  const pages = totalPagesForRows(allRows);
  state.page = Math.min(Math.max(state.page, 1), pages);
  const rows = paginatedRows(allRows);
  dom.rows.innerHTML = rows.map(renderRow).join("");
  dom.emptyState.textContent = state.emptyMessage;
  dom.emptyState.hidden = rows.length > 0;
  dom.recordSummary.textContent = `共 ${allRows.length} 条数据`;
  dom.pageJumpInput.value = state.page;
  dom.pageJumpInput.max = pages;
  dom.totalPageLabel.textContent = pages;
  dom.newButton.disabled = !state.apiReady;
  dom.firstPageButton.disabled = state.page <= 1;
  dom.prevPageButton.disabled = state.page <= 1;
  dom.nextPageButton.disabled = state.page >= pages;
  dom.lastPageButton.disabled = state.page >= pages;
  dom.printQrButton.disabled = state.selectedIds.size === 0;
  if (dom.deleteButton) {
    dom.deleteButton.disabled = state.selectedIds.size === 0 || !state.apiReady;
  }
  dom.filterButton.classList.toggle("active", activeFilterConditions(state.filterConditions).length > 0);
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
  const presetNames = directionPresetNamesFromRow(row);
  const status = qrStatus(row);
  const disabled = status === QR_STATUS.disabled;
  const qrLink = qr
    ? `<img class="qr-thumb" src="${escapeHtml(qrImageUrl(qr, 72))}" alt="问卷二维码" title="扫码打开问卷" />`
    : "";
  const presetCell = presetNames.length
    ? `<span class="tag info">已选 ${presetNames.length} 项</span>`
    : `<span class="table-muted">-</span>`;

  return `
    <tr class="${selectedClass}" data-id="${escapeHtml(id)}">
      <td class="check-col"><input class="row-check" type="checkbox" ${checked} aria-label="选择记录" /></td>
      <td>${escapeHtml(displayValue(row, ACTIVITY_FIELD.code))}</td>
      <td>${escapeHtml(displayValue(row, ACTIVITY_FIELD.name))}</td>
      <td>${escapeHtml(displayValue(row, ACTIVITY_FIELD.type))}</td>
      <td class="direction-preset-col" title="${escapeHtml(presetNames.join("、"))}">
        ${presetCell}
      </td>
      <td>${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.start)))}</td>
      <td>${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.end)))}</td>
      <td><span class="link-text">${escapeHtml(activityDeptName(row))}</span></td>
      <td class="number-col">${escapeHtml(displayValue(row, ACTIVITY_FIELD.count))}</td>
      <td>${qrStatusTag(status)}</td>
      <td class="qr-cell">${qrLink}</td>
      <td><span class="link-text">${escapeHtml(creatorName(row) || "-")}</span></td>
      <td>${escapeHtml(formatDateTime(systemCreateTime(row)) || "-")}</td>
      <td class="action-col">
        <button class="table-action-button ${disabled ? "enable" : "disable"}" type="button" data-qr-status-action="${escapeHtml(id)}" ${state.apiReady ? "" : "disabled"}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v9"></path>
            <path d="M7.8 5.6A8 8 0 1 0 16.2 5.6"></path>
          </svg>
          <span>${disabled ? "启用" : "停用"}</span>
        </button>
      </td>
    </tr>
  `;
}

function bindRowEvents() {
  dom.rows.querySelectorAll("tr").forEach((tr) => {
    tr.addEventListener("click", (event) => {
      const id = tr.dataset.id;
      const actionButton = event.target instanceof Element
        ? event.target.closest("[data-qr-status-action]")
        : null;
      if (actionButton) {
        event.stopPropagation();
        const row = state.rows.find((item) => rowId(item) === actionButton.dataset.qrStatusAction);
        if (row) {
          toggleActivityQrStatus(row);
        }
        return;
      }
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
  const selectedType = editing ? displayValue(row, ACTIVITY_FIELD.type) : "";
  const selectedDept = editing ? activityDeptSelectedValue(row) : "";
  dom.drawerTitle.textContent = editing ? "编辑活动" : "新增活动";
  dom.recordId.value = editing ? rowId(row) : "";
  dom.activityCode.value = editing ? displayValue(row, ACTIVITY_FIELD.code) : "";
  dom.activityName.value = editing ? displayValue(row, ACTIVITY_FIELD.name) : "";
  hydrateActivityTypeSelect(selectedType);
  dom.activityType.value = selectedType;
  dom.startDate.value = editing ? formatDate(displayValue(row, ACTIVITY_FIELD.start)) : "";
  dom.endDate.value = editing ? formatDate(displayValue(row, ACTIVITY_FIELD.end)) : "";
  hydrateDepartmentSelect(selectedDept);
  dom.department.value = selectedDept;
  dom.activityCount.value = editing ? displayValue(row, ACTIVITY_FIELD.count) : "";
  dom.questionnaireTemplate.value = questionnaireTemplate(row);
  state.editorDirectionSelected = new Set(editing ? directionPresetNamesFromRow(row) : []);
  updateEditorTemplateState();
  renderDirectionPresetPicker();
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
  state.editorDirectionSelected.clear();
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
  if (dom.detailQrStatus) {
    dom.detailQrStatus.innerHTML = qrStatusTag(qrStatus(row));
  }
  if (dom.detailDirectionPreset) {
    dom.detailDirectionPreset.innerHTML = directionPresetDetailHtml(row);
  }
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
      ${activityTypeOptionsHtml(type)}
    </select>
  `;
  dom.detailStart.innerHTML = `
    <div class="activity-date-field">
      <input class="detail-input activity-date-input" id="detailEditStart" type="text" inputmode="none" autocomplete="off" value="${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.start)))}" />
    </div>
  `;
  dom.detailEnd.innerHTML = `
    <div class="activity-date-field">
      <input class="detail-input activity-date-input" id="detailEditEnd" type="text" inputmode="none" autocomplete="off" value="${escapeHtml(formatDate(displayValue(row, ACTIVITY_FIELD.end)))}" />
    </div>
  `;
  dom.detailDept.innerHTML = `<select class="detail-input" id="detailEditDept">${departmentOptionsHtml(selectedDept)}</select>`;
  dom.detailCount.innerHTML = `<input class="detail-input" id="detailEditCount" type="number" min="0" value="${escapeHtml(displayValue(row, ACTIVITY_FIELD.count))}" />`;
  dom.detailTemplate.innerHTML = `
    <select class="detail-input" id="detailEditTemplate">
      ${QUESTIONNAIRE_TEMPLATE_OPTIONS
        .map((item) => `<option value="${escapeHtml(item)}" ${item === template ? "selected" : ""}>${escapeHtml(item)}</option>`)
        .join("")}
    </select>
  `;
  if (dom.detailQrStatus) {
    dom.detailQrStatus.innerHTML = qrStatusTag(qrStatus(row));
  }
  if (dom.detailDirectionPreset) {
    renderDetailDirectionPresetEdit();
  }
  document.querySelector("#detailEditTemplate")?.addEventListener("change", updateDetailTemplateState);
  renderDetailMeta(row);
  dom.detailQr.innerHTML = qr
    ? `<img class="detail-qr-img" src="${escapeHtml(qrImageUrl(qr, 156))}" alt="问卷二维码" />`
    : "保存后生成";
  setTimeout(() => document.querySelector("#detailEditName")?.focus(), 0);
}

function toggleDetailEdit() {
  const row = getDetailRow();
  state.editorDirectionSelected = new Set(directionPresetNamesFromRow(row));
  state.detailEditing = true;
  renderDetailView();
}

function cancelDetailEdit() {
  state.detailEditing = false;
  state.editorDirectionSelected.clear();
  renderDetailView();
}

function renderDetailDirectionPresetEdit() {
  if (!dom.detailDirectionPreset) {
    return;
  }

  dom.detailDirectionPreset.innerHTML = `
    <div class="direction-preset-panel detail-direction-preset-panel">
      <div class="direction-preset-head">
        <span>调整后会影响后续扫码问卷的可选报考方向</span>
        <div class="direction-preset-actions">
          <button class="button compact" id="detailSelectAllDirectionsButton" type="button">全选</button>
          <button class="button compact" id="detailClearDirectionsButton" type="button">清空</button>
        </div>
      </div>
      <div class="direction-preset-groups" id="detailDirectionPresetGroups"></div>
      <div class="direction-preset-summary">
        <strong id="detailDirectionPresetCount">已选 0 项</strong>
        <div id="detailDirectionPresetSummary"></div>
      </div>
    </div>
  `;

  const target = {
    groupsEl: document.querySelector("#detailDirectionPresetGroups"),
    countEl: document.querySelector("#detailDirectionPresetCount"),
    summaryEl: document.querySelector("#detailDirectionPresetSummary"),
    selectAllButton: document.querySelector("#detailSelectAllDirectionsButton"),
    clearButton: document.querySelector("#detailClearDirectionsButton")
  };
  target.selectAllButton?.addEventListener("click", () => {
    state.editorDirectionSelected = new Set(state.directionOptions.map((option) => option.name));
    renderDirectionPresetControl(target);
  });
  target.clearButton?.addEventListener("click", () => {
    state.editorDirectionSelected.clear();
    renderDirectionPresetControl(target);
  });
  renderDirectionPresetControl(target);
}

function updateDetailTemplateState() {
  const template = document.querySelector("#detailEditTemplate")?.value || QUESTIONNAIRE_TEMPLATE.lecture;
  if (isExperienceTemplateValue(template)) {
    ensureExperienceDefaultDirections();
  }
  renderDetailDirectionPresetEdit();
}

async function toggleActivityQrStatus(row) {
  const id = rowId(row);
  const disabled = isQrDisabled(row);
  const nextStatus = disabled ? QR_STATUS.enabled : QR_STATUS.disabled;
  const actionText = disabled ? "启用" : "停用";
  if (!disabled && !confirm("停用后，该活动二维码再次扫码会显示无效，确认停用？")) {
    return;
  }

  try {
    setStatus(`正在${actionText}二维码`);
    await postJson(apiUrl("/api/activity/update"), {
      data_id: id,
      _id: id,
      data: {
        [ACTIVITY_FIELD.qrStatus]: nextStatus
      }
    });
    await loadRows();
    state.detailId = id;
    if (!dom.detailPage.hidden) {
      renderDetailView();
    }
    setStatus(`二维码已${actionText}`);
  } catch (error) {
    setStatus(`二维码${actionText}失败：${error.message}`);
  }
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

  const detailTemplateValue = document.querySelector("#detailEditTemplate")?.value || QUESTIONNAIRE_TEMPLATE.lecture;
  if (isExperienceTemplateValue(detailTemplateValue) && !state.editorDirectionSelected.size) {
    ensureExperienceDefaultDirections();
  }
  const detailDirectionNames = selectedDirectionPresetNames();
  const data = {
    [ACTIVITY_FIELD.name]: name,
    [ACTIVITY_FIELD.type]: document.querySelector("#detailEditType")?.value || "",
    [ACTIVITY_FIELD.start]: document.querySelector("#detailEditStart")?.value || "",
    [ACTIVITY_FIELD.end]: document.querySelector("#detailEditEnd")?.value || "",
    [ACTIVITY_FIELD.dept]: document.querySelector("#detailEditDept")?.value || "",
    [ACTIVITY_FIELD.count]: Number(document.querySelector("#detailEditCount")?.value || 0),
    [ACTIVITY_FIELD.template]: detailTemplateValue,
    [ACTIVITY_FIELD.directionPreset]: directionPresetFieldValue(detailDirectionNames)
  };

  if (!data[ACTIVITY_FIELD.dept]) {
    setStatus("请选择活动所属部门");
    return;
  }

  if (!detailDirectionNames.length) {
    setStatus("请选择问卷可用的报考方向");
    return;
  }

  if (!isActivityDateValue(data[ACTIVITY_FIELD.start]) || !isActivityDateValue(data[ACTIVITY_FIELD.end])) {
    setStatus("请选择活动开始日期和结束日期");
    return;
  }

  if (code) {
    data[ACTIVITY_FIELD.qr] = buildSurveyUrl({
      [ACTIVITY_FIELD.code]: code,
      [ACTIVITY_FIELD.name]: name,
      [ACTIVITY_FIELD.template]: data[ACTIVITY_FIELD.template],
      [ACTIVITY_FIELD.directionPreset]: data[ACTIVITY_FIELD.directionPreset]
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
    state.editorDirectionSelected.clear();
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
  state.editorDirectionSelected.clear();
  updateEditorTemplateState();
  hydrateActivityTypeSelect();
  hydrateDepartmentSelect();
  refreshActivitySelects();
}

function updateEditorTemplateState() {
  const experienceTemplate = isExperienceTemplateValue(dom.questionnaireTemplate.value);
  if (dom.directionPresetField) {
    dom.directionPresetField.hidden = false;
  }
  if (experienceTemplate) {
    ensureExperienceDefaultDirections();
  }
  renderDirectionPresetPicker();
}

function ensureExperienceDefaultDirections() {
  if (state.editorDirectionSelected.size) {
    return;
  }
  state.editorDirectionSelected = new Set(experienceDefaultDirectionNames());
}

function experienceDefaultDirectionNames(existingNames = []) {
  const existing = uniqueTextValues(existingNames);
  if (existing.length) {
    return existing;
  }

  const matchedOptions = state.directionOptions
    .filter(isExperienceDefaultDirectionOption)
    .map((option) => option.name);
  return matchedOptions.length
    ? uniqueTextValues(matchedOptions)
    : EXPERIENCE_DEFAULT_DIRECTION_NAMES;
}

function isExperienceDefaultDirectionOption(option) {
  const name = normalizeDirectionPresetKey(option?.name);
  const code = String(option?.code || "").trim().toUpperCase();
  const type = String(option?.projectType || "").trim();
  return EXPERIENCE_DEFAULT_DIRECTION_NAMES.some((item) => normalizeDirectionPresetKey(item) === name) ||
    EXPERIENCE_DEFAULT_DIRECTION_CODES.includes(code) ||
    type === "学历项目";
}

function refreshEditorQr() {
  const code = dom.activityCode.value.trim();
  dom.generatedQr.value = code
    ? buildSurveyUrl({
      [ACTIVITY_FIELD.code]: code
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
  const experienceTemplate = isExperienceTemplateValue(dom.questionnaireTemplate.value);
  if (experienceTemplate) {
    ensureExperienceDefaultDirections();
  }
  const directionPresetNames = selectedDirectionPresetNames();
  const data = {
    [ACTIVITY_FIELD.name]: dom.activityName.value.trim(),
    [ACTIVITY_FIELD.type]: dom.activityType.value,
    [ACTIVITY_FIELD.start]: dom.startDate.value,
    [ACTIVITY_FIELD.end]: dom.endDate.value,
    [ACTIVITY_FIELD.dept]: dom.department.value,
    [ACTIVITY_FIELD.count]: Number(dom.activityCount.value || 0),
    [ACTIVITY_FIELD.template]: dom.questionnaireTemplate.value || QUESTIONNAIRE_TEMPLATE.lecture,
    [ACTIVITY_FIELD.directionPreset]: directionPresetFieldValue(directionPresetNames)
  };
  if (!id) {
    data[ACTIVITY_FIELD.qrStatus] = QR_STATUS.enabled;
  }

  if (code) {
    data[ACTIVITY_FIELD.qr] = buildSurveyUrl({
      [ACTIVITY_FIELD.code]: code
    });
  }

  if (!data[ACTIVITY_FIELD.name]) {
    dom.formHint.textContent = "请填写活动名称";
    return;
  }

  if (!isActivityDateValue(data[ACTIVITY_FIELD.start]) || !isActivityDateValue(data[ACTIVITY_FIELD.end])) {
    dom.formHint.textContent = "请选择活动开始日期和结束日期";
    return;
  }

  if (!data[ACTIVITY_FIELD.dept]) {
    dom.formHint.textContent = "请选择活动所属部门";
    return;
  }

  if (!directionPresetNames.length) {
    dom.formHint.textContent = "请选择问卷可用的报考方向";
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
      await postJson(apiUrl("/api/activity/create"), {
        data,
        current: currentLoginContext()
      });
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
  if (!code) {
    return "";
  }

  const url = new URL(state.surveyBaseUrl, window.location.origin);
  url.searchParams.set(SURVEY_PARAM.sourceCode, code);
  return url.toString();
}

function qrImageUrl(qr, size) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=4&qzone=4&data=${encodeURIComponent(qr)}`;
}

function apiUrl(path) {
  return `${API_BASE_PATH}${path}`;
}

function currentLoginContext() {
  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  return {
    ...params,
    url: window.location.href,
    href: window.location.href,
    pageUrl: window.location.href
  };
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

function isExperienceTemplateValue(value) {
  return String(value || "").trim() === QUESTIONNAIRE_TEMPLATE.experience;
}

function qrStatus(row) {
  const status = displayValue(row, ACTIVITY_FIELD.qrStatus).trim();
  return isDisabledQrStatusText(status) ? QR_STATUS.disabled : QR_STATUS.enabled;
}

function isQrDisabled(row) {
  return qrStatus(row) === QR_STATUS.disabled;
}

function isDisabledQrStatusText(text) {
  return ["停用", "已停用", "禁用", "关闭", "disabled", "disable", "off"].includes(String(text || "").trim().toLowerCase());
}

function qrStatusTag(status) {
  const normalized = status === QR_STATUS.disabled ? QR_STATUS.disabled : QR_STATUS.enabled;
  const className = normalized === QR_STATUS.disabled ? "danger" : "success";
  return `<span class="tag ${className}">${escapeHtml(normalized)}</span>`;
}

function directionPresetNamesFromRow(row) {
  if (!row) {
    return [];
  }
  const rawValue = row[ACTIVITY_FIELD.directionPreset];
  if (Array.isArray(rawValue)) {
    return uniqueTextValues(rawValue.flatMap(parseDirectionPresetValue));
  }
  return uniqueTextValues(parseDirectionPresetValue(rawValue));
}

function parseDirectionPresetValue(value) {
  if (value === null || value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.flatMap(parseDirectionPresetValue);
  }
  if (typeof value === "object") {
    return parseDirectionPresetValue(readComplexValue(value));
  }
  return String(value)
    .split(/[；;,，、/\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeDirectionPreset(names) {
  return uniqueTextValues(names).join(DIRECTION_PRESET_SEPARATOR);
}

function directionPresetFieldValue(names) {
  return uniqueTextValues(names);
}

function directionPresetSummary(row) {
  const names = directionPresetNamesFromRow(row);
  return names.length ? names.join("、") : "";
}

function directionPresetDetailHtml(row) {
  const names = directionPresetNamesFromRow(row);
  return names.length
    ? names.map((name) => `<span class="direction-preset-tag">${escapeHtml(name)}</span>`).join("")
    : "-";
}

function uniqueTextValues(values) {
  return Array.from(new Set(values.map((item) => String(item || "").trim()).filter(Boolean)));
}

function sortableNumber(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return Number.POSITIVE_INFINITY;
  }
  const number = Number(text);
  return Number.isFinite(number) ? number : Number.POSITIVE_INFINITY;
}

function normalizeDirectionPresetKey(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

function renderDetailMeta(row) {
  dom.detailCreator.textContent = creatorName(row) || "-";
  dom.detailCreateTime.textContent = formatDateTime(systemCreateTime(row)) || "-";
  dom.detailUpdateTime.textContent = formatDateTime(systemUpdateTime(row)) || "-";
  dom.detailDataId.textContent = dataRecordId(row) || "-";
}

function creatorName(row) {
  return readComplexValue(
    row?.[ACTIVITY_FIELD.submitter] ||
    row?.data?.[ACTIVITY_FIELD.submitter] ||
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
  return totalPagesForRows(visibleRows());
}

function totalPagesForRows(rows) {
  return Math.max(1, Math.ceil((rows.length || 0) / state.limit));
}

function paginatedRows(rows) {
  const start = (state.page - 1) * state.limit;
  return rows.slice(start, start + state.limit);
}

function goToPage(value) {
  const page = clampPage(value);
  if (page === state.page) {
    render();
    return;
  }
  state.page = page;
  render();
}

function clampPage(value) {
  const page = Number.parseInt(value, 10);
  if (!Number.isFinite(page)) {
    return state.page;
  }
  return Math.min(Math.max(page, 1), totalPages());
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
