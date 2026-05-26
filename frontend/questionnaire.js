const SURVEY_FIELD = {
  activityName: "_widget_1778461489814",
  personName: "_widget_1778461488874",
  phone: "_widget_1778461488911",
  email: "_widget_1778461488930",
  company: "_widget_1778461489057",
  position: "_widget_1778461489076",
  gender: "_widget_1778462532692",
  education: "_widget_1778461489095",
  managerYears: "_widget_1778461489128",
  wechat: "_widget_1778461489149",
  idCard: "_widget_1778461489168",
  signupSource: "_widget_1778461489248",
  remark: "_widget_1778463910229",
  referrer: "_widget_1778652079634",
  intention: "_widget_1778461489280",
  projectType: "_widget_1779757330297",
  direction: "_widget_1778652681060",
  concern: "_widget_1778461489343",
  sourceCode: "_widget_1778461489795"
};

const PROGRAM_DIRECTION_OPTIONS = {
  学历项目: [
    "非全日制科创EMBA",
    "非全日制MBA综合管理方向",
    "非全日制MBA科技金融方向",
    "非全日制MBA科技创业方向",
    "非全日制MBA人工智能商业应用方向",
    "全日制MBA"
  ],
  非学历项目: [
    "创新企业家学者（DBA直通车）项目",
    "科技企业家学者（DBA直通车）项目",
    "科技投资人",
    "科技创新班",
    "AI时代管理思维",
    "科创企业家全球资产配置班",
    "AI商业架构师认证"
  ]
};

const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";
const SURVEY_TEMPLATE_PARAM = "_widget_1779761373894";
const QUESTIONNAIRE_TEMPLATE = {
  lecture: "活动讲座模版",
  promo: "展架等宣传品通用模版"
};

if (window.location.protocol === "file:") {
  window.location.replace(`http://127.0.0.1:3000/questionnaire.html${window.location.search}`);
  throw new Error("请通过后端服务地址打开问卷页面");
}

const surveyDom = {
  form: document.querySelector("#surveyForm"),
  status: document.querySelector("#surveyStatus"),
  subTitle: document.querySelector("#surveySubTitle"),
  activityName: document.querySelector("#surveyActivityName"),
  sourceCode: document.querySelector("#sourceCode"),
  questionnaireTemplate: document.querySelector("#questionnaireTemplate"),
  education: document.querySelector("#education"),
  managerYearsField: document.querySelector("#managerYearsField"),
  managerYears: document.querySelector("#managerYears"),
  signupSource: document.querySelector("#signupSource"),
  signupSourceField: document.querySelector("#signupSourceField"),
  phone: document.querySelector("#phone"),
  phoneHint: document.querySelector("#phoneHint"),
  idCardField: document.querySelector("#idCardField"),
  idCard: document.querySelector("#idCard"),
  idCardHint: document.querySelector("#idCardHint"),
  intentionField: document.querySelector("#intentionField"),
  intentionInputs: document.querySelectorAll('input[name="intention"]'),
  projectTypeField: document.querySelector("#projectTypeField"),
  projectTypeInputs: document.querySelectorAll('input[name="projectType"]'),
  directionField: document.querySelector("#directionField"),
  directionLabel: document.querySelector("#directionLabel"),
  directionSelect: document.querySelector("#direction"),
  submitButton: document.querySelector("#submitSurveyButton"),
  confirmMask: document.querySelector("#surveyConfirm"),
  confirmCancelButton: document.querySelector("#cancelSurveyConfirmButton"),
  confirmSubmitButton: document.querySelector("#confirmSurveySubmitButton")
};

let surveyApiReady = false;
let submitConfirmResolve = null;
const surveySelectPickers = new Map();
let currentQuestionnaireTemplate = QUESTIONNAIRE_TEMPLATE.lecture;

initSurvey();

async function initSurvey() {
  const params = new URLSearchParams(window.location.search);
  const sourceCode = params.get(SURVEY_FIELD.sourceCode) || params.get("sourceCode") || "";
  const activityName = params.get(SURVEY_FIELD.activityName) || params.get("activityName") || "";
  currentQuestionnaireTemplate =
    params.get(SURVEY_TEMPLATE_PARAM) ||
    params.get("questionnaireTemplate") ||
    params.get("template") ||
    QUESTIONNAIRE_TEMPLATE.lecture;

  surveyDom.activityName.value = activityName;
  surveyDom.sourceCode.value = sourceCode;
  surveyDom.questionnaireTemplate.value = currentQuestionnaireTemplate;
  if (surveyDom.subTitle) {
    surveyDom.subTitle.textContent = activityName || "报名信息采集";
  }

  try {
    const config = await fetchJson(apiUrl("/api/config"));
    surveyApiReady = Boolean(config.hasToken);
    setSurveyStatus(surveyApiReady ? "" : "后端已启动，但未配置百数云 API Token", surveyApiReady ? "" : "error");
  } catch {
    surveyApiReady = false;
    setSurveyStatus("后端未连接，无法提交", "error");
  }

  applyQuestionnaireTemplate();
  bindValidation();
  bindProgramSelection();
  bindSubmitConfirmation();
  updateProgramFields();
  enhanceSurveySelects();
  surveyDom.form.addEventListener("submit", submitSurvey);
}

async function submitSurvey(event) {
  event.preventDefault();
  if (surveyDom.submitButton.disabled) {
    return;
  }
  if (!validateSurveyForm()) {
    return;
  }
  if (!surveyApiReady) {
    setSurveyStatus("请先启动后端并配置百数云 API Token", "error");
    return;
  }
  if (!(await requestSubmitConfirmation())) {
    return;
  }

  const formData = new FormData(surveyDom.form);
  const wechat = formData.get("wechat")?.trim() || "";
  const data = {
    [SURVEY_FIELD.activityName]: formData.get("activityName")?.trim() || "",
    [SURVEY_FIELD.personName]: formData.get("personName")?.trim() || "",
    [SURVEY_FIELD.phone]: formData.get("phone")?.trim() || "",
    [SURVEY_FIELD.email]: formData.get("email")?.trim() || "",
    [SURVEY_FIELD.company]: formData.get("company")?.trim() || "",
    [SURVEY_FIELD.position]: formData.get("position")?.trim() || "",
    [SURVEY_FIELD.gender]: formData.get("gender") || "",
    [SURVEY_FIELD.education]: formData.get("education") || "",
    [SURVEY_FIELD.remark]: formData.get("remark")?.trim() || "",
    [SURVEY_FIELD.referrer]: formData.get("referrer")?.trim() || "",
    [SURVEY_FIELD.projectType]: formData.get("projectType") || "",
    [SURVEY_FIELD.direction]: formData.get("direction") || "",
    [SURVEY_FIELD.concern]: formData.get("concern")?.trim() || "",
    [SURVEY_FIELD.sourceCode]: formData.get("sourceCode")?.trim() || ""
  };
  if (!isPromoTemplate()) {
    data[SURVEY_FIELD.managerYears] = Number(formData.get("managerYears") || 0);
    data[SURVEY_FIELD.idCard] = formData.get("idCard")?.trim() || "";
    data[SURVEY_FIELD.signupSource] = formData.get("signupSource") || "";
    data[SURVEY_FIELD.intention] = formData.get("intention") || "";
  }
  if (/^\d+$/.test(wechat)) {
    data[SURVEY_FIELD.wechat] = wechat;
  }

  try {
    surveyDom.submitButton.disabled = true;
    setSurveyStatus("正在提交", "");

    await postJson(apiUrl("/api/survey/submit"), {
      data,
      template: currentQuestionnaireTemplate
    });
    renderSubmitSuccess();
  } catch (error) {
    surveyDom.submitButton.disabled = false;
    setSurveyStatus(`提交失败：${formatSubmitError(error.message)}`, "error");
  }
}

function bindValidation() {
  validationFields().forEach((field) => {
    const input = field.input;
    const showWeakValidation = () => updateValidationField(field, { showWeak: true, trim: true });
    input.addEventListener("input", () => {
      input.setCustomValidity("");
      updateValidationField(field, {
        showWeak: input.classList.contains("is-soft-invalid"),
        trim: false
      });
      if (surveyDom.status.classList.contains("error")) {
        setSurveyStatus("", "");
      }
    });
    input.addEventListener("blur", showWeakValidation);
    input.addEventListener("change", showWeakValidation);
    input.addEventListener("focusout", showWeakValidation);
  });
}

function bindProgramSelection() {
  surveyDom.intentionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateProgramFields({ clearProjectType: !isProgramInterested(), clearDirection: true });
      clearSurveyErrorStatus();
    });
  });

  surveyDom.projectTypeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateProgramFields({ clearDirection: true });
      clearSurveyErrorStatus();
    });
  });

  surveyDom.directionSelect?.addEventListener("change", clearSurveyErrorStatus);
}

function applyQuestionnaireTemplate() {
  const promo = isPromoTemplate();
  toggleConditionalField(surveyDom.managerYearsField, [surveyDom.managerYears], !promo, true);
  toggleConditionalField(surveyDom.idCardField, [surveyDom.idCard], !promo, true);
  toggleConditionalField(surveyDom.signupSourceField, [surveyDom.signupSource], !promo, true);
  toggleConditionalField(surveyDom.intentionField, Array.from(surveyDom.intentionInputs), !promo, true);
  if (promo) {
    clearRadioGroup("intention");
  }
  if (surveyDom.directionLabel) {
    surveyDom.directionLabel.textContent = promo ? "意向报名项目" : "报考方向";
  }
}

function toggleConditionalField(field, controls, active, requiredWhenActive) {
  if (field) {
    field.hidden = !active;
  }

  controls.filter(Boolean).forEach((control) => {
    control.disabled = !active;
    control.required = active && requiredWhenActive;
    if (!active) {
      if (control.type === "radio" || control.type === "checkbox") {
        control.checked = false;
      } else {
        control.value = "";
      }
      control.setCustomValidity("");
      control.classList.remove("is-soft-invalid");
    }
  });
}

function updateProgramFields(options = {}) {
  if (!surveyDom.projectTypeField || !surveyDom.directionField || !surveyDom.directionSelect) {
    return;
  }

  const interested = isPromoTemplate() || isProgramInterested();
  if (!interested || options.clearProjectType) {
    clearRadioGroup("projectType");
  }

  const projectType = interested ? selectedRadioValue("projectType") : "";
  const currentDirection = options.clearDirection ? "" : surveyDom.directionSelect.value;
  renderDirectionOptions(projectType, currentDirection);

  surveyDom.projectTypeField.hidden = !interested;
  surveyDom.directionField.hidden = !interested || !projectType;

  surveyDom.projectTypeInputs.forEach((input) => {
    input.disabled = !interested;
    input.required = interested;
  });
  surveyDom.directionSelect.disabled = !interested || !projectType;
  surveyDom.directionSelect.required = interested && Boolean(projectType);
  refreshCustomSelect(surveyDom.directionSelect);
}

function renderDirectionOptions(projectType, selectedValue = "") {
  const options = PROGRAM_DIRECTION_OPTIONS[projectType] || [];
  const placeholder = isPromoTemplate() ? "请选择意向报名项目" : "请选择报考方向";
  surveyDom.directionSelect.replaceChildren(createSelectOption("", options.length ? placeholder : "请先选择项目类型"));
  options.forEach((option) => {
    surveyDom.directionSelect.appendChild(createSelectOption(option, option));
  });
  surveyDom.directionSelect.value = options.includes(selectedValue) ? selectedValue : "";
}

function createSelectOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function enhanceSurveySelects() {
  [surveyDom.education, surveyDom.signupSource, surveyDom.directionSelect].forEach(enhanceCustomSelect);

  document.addEventListener("click", (event) => {
    if (![...surveySelectPickers.values()].some(({ picker }) => picker.contains(event.target))) {
      closeCustomSelects();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCustomSelects();
    }
  });
}

function enhanceCustomSelect(select) {
  if (!select || surveySelectPickers.has(select)) {
    refreshCustomSelect(select);
    return;
  }

  const picker = document.createElement("div");
  picker.className = "select-picker survey-select-picker";

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

  surveySelectPickers.set(select, { picker, trigger, menu, optionsWrap });
  trigger.addEventListener("click", () => {
    if (select.disabled) {
      return;
    }
    const opening = menu.hidden;
    closeCustomSelects(select);
    refreshCustomSelect(select);
    menu.hidden = !opening;
    trigger.setAttribute("aria-expanded", opening ? "true" : "false");
  });
  select.addEventListener("change", () => refreshCustomSelect(select));
  refreshCustomSelect(select);
}

function refreshCustomSelect(select) {
  const controls = surveySelectPickers.get(select);
  if (!select || !controls) {
    return;
  }

  const { trigger, menu, optionsWrap } = controls;
  const selectedOption = select.selectedOptions?.[0] || select.options[select.selectedIndex];
  trigger.textContent = selectedOption?.textContent || "请选择";
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

function dispatchSelectEvent(select, type) {
  if (typeof Event === "function") {
    select.dispatchEvent(new Event(type, { bubbles: true }));
    return;
  }
  const event = document.createEvent("HTMLEvents");
  event.initEvent(type, true, false);
  select.dispatchEvent(event);
}

function closeCustomSelects(exceptSelect = null) {
  surveySelectPickers.forEach(({ menu, trigger }, select) => {
    if (select === exceptSelect) {
      return;
    }
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  });
}

function isProgramInterested() {
  if (isPromoTemplate()) {
    return true;
  }
  const intention = selectedRadioValue("intention");
  return intention.includes("是") || intention.includes("想了解");
}

function isPromoTemplate() {
  return currentQuestionnaireTemplate === QUESTIONNAIRE_TEMPLATE.promo ||
    currentQuestionnaireTemplate.includes("展架");
}

function selectedRadioValue(name) {
  return surveyDom.form.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function clearRadioGroup(name) {
  surveyDom.form.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = false;
  });
}

function clearSurveyErrorStatus() {
  if (surveyDom.status.classList.contains("error")) {
    setSurveyStatus("", "");
  }
}

function bindSubmitConfirmation() {
  surveyDom.confirmCancelButton?.addEventListener("click", () => resolveSubmitConfirmation(false));
  surveyDom.confirmSubmitButton?.addEventListener("click", () => resolveSubmitConfirmation(true));
  surveyDom.confirmMask?.addEventListener("click", (event) => {
    if (event.target === surveyDom.confirmMask) {
      resolveSubmitConfirmation(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !surveyDom.confirmMask?.hidden) {
      resolveSubmitConfirmation(false);
    }
  });
}

function requestSubmitConfirmation() {
  if (isPromoTemplate()) {
    return Promise.resolve(true);
  }
  if (!surveyDom.confirmMask) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    submitConfirmResolve = resolve;
    surveyDom.confirmMask.hidden = false;
    requestAnimationFrame(() => surveyDom.confirmSubmitButton?.focus());
  });
}

function resolveSubmitConfirmation(confirmed) {
  if (!submitConfirmResolve) {
    return;
  }

  const resolve = submitConfirmResolve;
  submitConfirmResolve = null;
  surveyDom.confirmMask.hidden = true;
  if (!confirmed) {
    surveyDom.submitButton.focus();
  }
  resolve(confirmed);
}

function validateSurveyForm() {
  validateSurveyFormFields({ showWeak: true, setNative: true });
  if (!surveyDom.form.reportValidity()) {
    setSurveyStatus("请检查必填项和格式", "error");
    return false;
  }
  return true;
}

function validateSurveyFormFields(options = {}) {
  validationFields().forEach((field) => updateValidationField(field, options));
}

function validationFields() {
  return [
    {
      input: surveyDom.phone,
      hint: surveyDom.phoneHint,
      message: "请输入有效的11位手机号",
      normalize: (value) => value.trim(),
      validate: isValidMainlandPhone
    },
    {
      input: surveyDom.idCard,
      hint: surveyDom.idCardHint,
      message: "请输入有效的18位身份证号",
      normalize: (value) => value.trim().toUpperCase(),
      validate: isValidChineseIdCard
    }
  ].filter((field) => field.input && !field.input.disabled);
}

function updateValidationField(field, options = {}) {
  const { input, hint, message, normalize, validate } = field;
  const value = normalize(input.value);
  if (options.trim) {
    input.value = value;
  }

  const invalid = Boolean(value && !validate(value));
  if (options.setNative) {
    input.setCustomValidity(invalid ? message : "");
  }
  if (options.showWeak || input.classList.contains("is-soft-invalid")) {
    input.classList.toggle("is-soft-invalid", invalid);
    if (hint) {
      hint.textContent = invalid ? message : "";
    }
  }
}

function clearSurveyValidation() {
  validationFields().forEach(({ input, hint }) => {
    input.setCustomValidity("");
    input.classList.remove("is-soft-invalid");
    if (hint) {
      hint.textContent = "";
    }
  });
}

function renderSubmitSuccess() {
  document.title = "提交成功";
  document.body.innerHTML = `
    <main class="survey-success-page">
      <section class="survey-success-card" role="status" aria-live="polite">
        <div class="survey-success-icon" aria-hidden="true">✓</div>
        <h1>提交成功</h1>
      </section>
    </main>
  `;
}

function isValidMainlandPhone(value) {
  return /^1[3-9]\d{9}$/.test(value);
}

function isValidChineseIdCard(value) {
  if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/.test(value)) {
    return false;
  }

  const birth = value.slice(6, 14);
  const year = Number(birth.slice(0, 4));
  const month = Number(birth.slice(4, 6));
  const day = Number(birth.slice(6, 8));
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checks = "10X98765432";
  const sum = weights.reduce((total, weight, index) => total + Number(value[index]) * weight, 0);
  return checks[sum % 11] === value[17];
}

function setSurveyStatus(text, type) {
  surveyDom.status.textContent = text;
  surveyDom.status.className = type ? `status-text ${type}` : "status-text";
}

function formatSubmitError(message) {
  const text = String(message || "").replace(/<br\s*\/?>/gi, "，").replace(/\s+/g, " ").trim();
  if (text.includes("字段的数据不符合格式要求") || text.includes("字段类型")) {
    return "请检查填写内容格式后重试";
  }
  return text || "请求失败";
}

function apiUrl(path) {
  return `${API_BASE_PATH}${path}`;
}

async function fetchJson(url) {
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
