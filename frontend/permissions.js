const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";

const GROUP_FIELD = {
  code: "_widget_1779845603057",
  oldCode: "_widget_1779795340500",
  name: "_widget_1779795340481",
  status: "_widget_1779795340558"
};

const MEMBER_FIELD = {
  groupCode: "_widget_1779795662942",
  objectType: "_widget_1779795663070",
  member: "_widget_1779795663099",
  department: "_widget_1779795663118",
  status: "_widget_1779795340558"
};

const MODULE_FIELD = {
  groupCode: "_widget_1779795662942",
  moduleCode: "_widget_1779795663070",
  moduleName: "_widget_1779795980532",
  operations: "_widget_1779795980551",
  dataScope: "_widget_1779795980607",
  defaultVisible: "_widget_1779795980762",
  defaultEditable: "_widget_1779795980783",
  status: "_widget_1779795340558"
};

const FIELD_PERMISSION_FIELD = {
  groupCode: "_widget_1779795662942",
  moduleCode: "_widget_1779795663070",
  fieldName: "_widget_1779795980532",
  fieldAlias: "_widget_1779796546984",
  visible: "_widget_1779795980762",
  editable: "_widget_1779795980783",
  status: "_widget_1779795340558"
};

const OPERATIONS = ["查看", "新增", "编辑", "删除", "导入", "导出", "分配", "确认入学", "归档"];
const DATA_SCOPES = ["本人数据", "本部门", "本部门及下级", "全部数据"];
const OPERATION_GROUPS = [
  { title: "常用操作", values: ["查看", "新增", "编辑", "删除"] },
  { title: "业务流转", values: ["分配", "确认入学", "归档"] },
  { title: "批量操作", values: ["导入", "导出"] }
];
const DATA_SCOPE_OPTIONS = [
  { label: "本人提交", value: "本人数据" },
  { label: "本部门提交", value: "本部门" },
  { label: "本部门及下级", value: "本部门及下级" },
  { label: "全部数据", value: "全部数据" }
];

const MODULES = [
  {
    code: "activity",
    name: "活动管理",
    fields: [
      ["活动编号", "_widget_1771903125126"],
      ["活动名称", "_widget_1771903125107"],
      ["活动类型", "_widget_1771903125403"],
      ["活动开始日期", "_widget_1771903125195"],
      ["活动结束日期", "_widget_1771903125609"],
      ["活动所属部门", "_widget_1771903125451"],
      ["活动人数", "_widget_1772249483639"],
      ["问卷模版", "_widget_1779761373894"],
      ["问卷二维码", "_widget_1771904304705"]
    ]
  },
  {
    code: "activityStudent",
    name: "活动学员信息管理",
    fields: [
      ["活动名称", "_widget_1778462323391"],
      ["姓名", "_widget_1778462323439"],
      ["手机号", "_widget_1778462323458"],
      ["邮箱", "_widget_1778462323477"],
      ["企业名称", "_widget_1778462323496"],
      ["职位", "_widget_1778462323515"],
      ["性别", "_widget_1778462323579"],
      ["最高学历", "_widget_1778462323612"],
      ["高层管理年限", "_widget_1778462323643"],
      ["微信号", "_widget_1778462323664"],
      ["身份证号", "_widget_1778462323685"],
      ["报名来源", "_widget_1778462323706"],
      ["意愿情况", "_widget_1778655214142"],
      ["报考方向", "_widget_1778655214041"],
      ["重复次数", "_widget_1778673212735"],
      ["关注问题", "_widget_1778462323738"]
    ]
  },
  {
    code: "lead",
    name: "潜在考生信息管理",
    fields: [
      ["线索编号", "_widget_1771903380071"],
      ["姓名", "_widget_1771903284177"],
      ["手机号", "_widget_1771903284178"],
      ["性别", "_widget_1771904316578"],
      ["年龄", "_widget_1771903284180"],
      ["报考方向", "_widget_1771903284181"],
      ["信息提交时间", "_widget_1771903284182"],
      ["最高学历", "_widget_1771903284184"],
      ["工作单位", "_widget_1771903284185"],
      ["职务", "_widget_1771903284186"],
      ["行业", "_widget_1771903284187"],
      ["来源渠道", "_widget_1771903284189"],
      ["对接人", "_widget_1771912523513"],
      ["推荐人", "_widget_1771903284191"],
      ["意愿情况", "_widget_1771903284192"],
      ["电子邮箱", "_widget_1771903284193"],
      ["所在城市", "_widget_1771912523597"],
      ["线索状态", "_widget_1771912718738"]
    ]
  },
  {
    code: "admitted",
    name: "达线学员信息管理",
    fields: [
      ["客户编号", "_widget_1771903380071"],
      ["姓名", "_widget_1771903284177"],
      ["手机号", "_widget_1771903284178"],
      ["报考方向", "_widget_1771903284181"],
      ["最高学历", "_widget_1771903284184"],
      ["工作单位", "_widget_1771903284185"],
      ["对接人", "_widget_1771912523513"],
      ["线索编号", "_widget_1778143487652"],
      ["状态", "_widget_1771912718738"]
    ]
  },
  {
    code: "archive",
    name: "归档学员信息管理",
    fields: [
      ["线索编号", "_widget_1771903380071"],
      ["姓名", "_widget_1771903284177"],
      ["手机号", "_widget_1771903284178"],
      ["报考方向", "_widget_1771903284181"],
      ["最高学历", "_widget_1771903284184"],
      ["工作单位", "_widget_1771903284185"],
      ["对接人", "_widget_1771912523513"],
      ["线索状态", "_widget_1771912718738"]
    ]
  },
  {
    code: "followUp",
    name: "跟进记录",
    fields: [
      ["姓名", "_widget_1771904507105"],
      ["跟进方式", "_widget_1771904506884"],
      ["沟通时间", "_widget_1771904506860"],
      ["下次跟进时间", "_widget_1778720501084"],
      ["跟进内容", "_widget_1771913349956"],
      ["线索编号", "_widget_1771904507023"],
      ["客户编号", "_widget_1771912879095"],
      ["对接人", "_widget_1778720501177"]
    ]
  },
  {
    code: "permissions",
    name: "权限配置中心",
    fields: [
      ["权限组", "permission_group"],
      ["授权成员", "permission_member"],
      ["模块权限", "permission_module"],
      ["字段权限", "permission_field"]
    ]
  }
];

const state = {
  groups: [],
  members: [],
  modules: [],
  fields: [],
  users: [],
  departments: [],
  activeGroupCode: "",
  activeModuleCode: MODULES[0]?.code || "",
  activeTab: "members",
  groupQuery: "",
  moduleQuery: ""
};

const dom = {
  moduleSearchInput: document.querySelector("#moduleSearchInput"),
  moduleList: document.querySelector("#moduleList"),
  groupList: document.querySelector("#groupList"),
  groupCountText: document.querySelector("#groupCountText"),
  groupSearchInput: document.querySelector("#groupSearchInput"),
  newGroupButton: document.querySelector("#newGroupButton"),
  refreshButton: document.querySelector("#refreshButton"),
  deleteGroupButton: document.querySelector("#deleteGroupButton"),
  saveGroupButton: document.querySelector("#saveGroupButton"),
  activeGroupTitle: document.querySelector("#activeGroupTitle"),
  activeGroupMeta: document.querySelector("#activeGroupMeta"),
  groupRecordId: document.querySelector("#groupRecordId"),
  groupCodeInput: document.querySelector("#groupCodeInput"),
  groupNameInput: document.querySelector("#groupNameInput"),
  groupStatusInput: document.querySelector("#groupStatusInput"),
  tabs: Array.from(document.querySelectorAll(".permission-tabs button")),
  panels: {
    members: document.querySelector("#membersPanel"),
    modules: document.querySelector("#modulesPanel"),
    fields: document.querySelector("#fieldsPanel"),
    preview: document.querySelector("#previewPanel")
  },
  memberTypeInput: document.querySelector("#memberTypeInput"),
  memberUserField: document.querySelector("#memberUserField"),
  memberDeptField: document.querySelector("#memberDeptField"),
  memberUserInput: document.querySelector("#memberUserInput"),
  memberDeptInput: document.querySelector("#memberDeptInput"),
  memberStatusInput: document.querySelector("#memberStatusInput"),
  addMemberButton: document.querySelector("#addMemberButton"),
  memberRows: document.querySelector("#memberRows"),
  memberEmptyState: document.querySelector("#memberEmptyState"),
  permissionModuleInput: document.querySelector("#permissionModuleInput"),
  moduleRows: document.querySelector("#moduleRows"),
  saveModulesButton: document.querySelector("#saveModulesButton"),
  fieldModuleInput: document.querySelector("#fieldModuleInput"),
  fieldRows: document.querySelector("#fieldRows"),
  saveFieldsButton: document.querySelector("#saveFieldsButton"),
  loadPreviewButton: document.querySelector("#loadPreviewButton"),
  previewBox: document.querySelector("#previewBox"),
  statusText: document.querySelector("#statusText")
};

init();

async function init() {
  bindEvents();
  hydrateStaticOptions();
  await loadAll();
}

function bindEvents() {
  dom.newGroupButton.addEventListener("click", startNewGroup);
  dom.refreshButton.addEventListener("click", loadAll);
  dom.saveGroupButton.addEventListener("click", saveGroup);
  dom.deleteGroupButton.addEventListener("click", deleteActiveGroup);
  dom.groupSearchInput.addEventListener("input", () => {
    state.groupQuery = dom.groupSearchInput.value.trim();
    renderGroups();
  });
  dom.moduleSearchInput?.addEventListener("input", () => {
    state.moduleQuery = dom.moduleSearchInput.value.trim();
    renderModuleList();
  });
  dom.tabs.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      renderTabs();
    });
  });
  dom.memberTypeInput.addEventListener("change", renderMemberTargetFields);
  dom.addMemberButton.addEventListener("click", addMember);
  dom.saveModulesButton.addEventListener("click", saveModules);
  dom.permissionModuleInput?.addEventListener("change", () => {
    state.activeModuleCode = dom.permissionModuleInput.value || state.activeModuleCode;
    if (dom.fieldModuleInput) {
      dom.fieldModuleInput.value = dom.permissionModuleInput.value;
    }
    renderModuleList();
    renderModuleRows();
    renderFieldRows();
  });
  dom.fieldModuleInput.addEventListener("change", () => {
    state.activeModuleCode = dom.fieldModuleInput.value || state.activeModuleCode;
    if (dom.permissionModuleInput) {
      dom.permissionModuleInput.value = state.activeModuleCode;
    }
    renderModuleList();
    renderModuleRows();
    renderFieldRows();
  });
  dom.saveFieldsButton.addEventListener("click", saveFields);
  dom.loadPreviewButton.addEventListener("click", loadPreview);
}

function hydrateStaticOptions() {
  const options = MODULES
    .map((module) => `<option value="${escapeHtml(module.code)}">${escapeHtml(module.name)}</option>`)
    .join("");
  if (dom.permissionModuleInput) {
    dom.permissionModuleInput.innerHTML = options;
    dom.permissionModuleInput.value = state.activeModuleCode;
  }
  dom.fieldModuleInput.innerHTML = options;
  dom.fieldModuleInput.value = state.activeModuleCode;
}

async function loadAll() {
  try {
    setStatus("正在加载权限配置");
    const [groups, members, modules, fields, users, departments] = await Promise.all([
      postJson(apiUrl("/api/permission-groups/list"), { page: 1, limit: 300 }),
      postJson(apiUrl("/api/permission-members/list"), { page: 1, limit: 500 }),
      postJson(apiUrl("/api/module-permissions/list"), { page: 1, limit: 500 }),
      postJson(apiUrl("/api/field-permissions/list"), { page: 1, limit: 1000 }),
      postJson(apiUrl("/api/users/list"), {}),
      postJson(apiUrl("/api/departments/list"), { dept_id: "", has_child: true })
    ]);

    state.groups = extractRows(groups).map(normalizeGroup).filter((item) => item.code || item.name);
    state.members = extractRows(members);
    state.modules = extractRows(modules);
    state.fields = extractRows(fields);
    state.users = normalizeUsers(users);
    state.departments = normalizeDepartments(departments);

    if (!state.activeGroupCode && state.groups.length) {
      state.activeGroupCode = state.groups[0].code;
    }
    if (state.activeGroupCode && !state.groups.some((group) => group.code === state.activeGroupCode)) {
      state.activeGroupCode = state.groups[0]?.code || "";
    }

    hydrateUserAndDepartmentOptions();
    render();
    setStatus("加载完成");
  } catch (error) {
    setStatus(`加载失败：${error.message}`);
  }
}

function hydrateUserAndDepartmentOptions() {
  dom.memberUserInput.innerHTML = [
    `<option value="">请选择成员</option>`,
    ...state.users.map((user) => {
      const label = [user.name, user.account, user.mobile].filter(Boolean).join(" / ");
      return `<option value="${escapeHtml(user.userId)}">${escapeHtml(label || user.userId)}</option>`;
    })
  ].join("");

  dom.memberDeptInput.innerHTML = [
    `<option value="">请选择部门</option>`,
    ...state.departments.map((dept) =>
      `<option value="${escapeHtml(dept.deptId)}">${escapeHtml(dept.pathName || dept.name || dept.deptId)}</option>`
    )
  ].join("");
}

function render() {
  renderModuleList();
  renderGroups();
  renderActiveGroup();
  renderTabs();
}

function renderModuleList() {
  if (!dom.moduleList) {
    return;
  }
  const query = state.moduleQuery.toLowerCase();
  const modules = MODULES.filter((module) => {
    const text = `${module.code} ${module.name}`.toLowerCase();
    return !query || text.includes(query);
  });
  dom.moduleList.innerHTML = modules.length
    ? modules.map((module) => {
      const total = state.modules.filter((row) => readText(row, MODULE_FIELD.moduleCode) === module.code).length;
      return `
        <button class="permission-module-item ${module.code === state.activeModuleCode ? "active" : ""}" type="button" data-module-code="${escapeHtml(module.code)}">
          <span>${escapeHtml(module.name)}</span>
          <em>${total ? `${total} 条规则` : "未配置"}</em>
        </button>
      `;
    }).join("")
    : `<div class="permission-list-empty">暂无业务模块</div>`;

  dom.moduleList.querySelectorAll("[data-module-code]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeModuleCode = button.dataset.moduleCode || MODULES[0].code;
      if (dom.permissionModuleInput) {
        dom.permissionModuleInput.value = state.activeModuleCode;
      }
      if (dom.fieldModuleInput) {
        dom.fieldModuleInput.value = state.activeModuleCode;
      }
      renderModuleList();
      renderModuleRows();
      renderFieldRows();
    });
  });
}

function renderGroups() {
  const query = state.groupQuery.toLowerCase();
  const groups = state.groups.filter((group) => {
    const summary = groupSummary(group);
    const text = `${group.code} ${group.name} ${group.status} ${summary.description} ${summary.memberText} ${summary.scopeText}`.toLowerCase();
    return !query || text.includes(query);
  });

  dom.groupCountText.textContent = `共 ${state.groups.length} 组`;
  dom.groupList.innerHTML = groups.length
    ? groups.map((group) => {
      const summary = groupSummary(group);
      return `
      <article class="permission-group-item ${group.code === state.activeGroupCode ? "active" : ""}" data-code="${escapeHtml(group.code)}">
        <div class="permission-group-title">
          <strong>${escapeHtml(group.name || group.code)}</strong>
          <span class="permission-card-actions">
            <button class="button compact" type="button" data-edit-group="${escapeHtml(group.code)}">编辑</button>
          </span>
        </div>
        <div class="permission-summary-grid">
          <span>权限成员：</span><strong>${escapeHtml(summary.memberText)}</strong>
          <span>数据范围：</span><strong>${escapeHtml(summary.scopeText)}</strong>
          <span>操作权限：</span><strong>${escapeHtml(summary.operationText)}</strong>
          <span>字段权限：</span><strong>${escapeHtml(summary.fieldText)}</strong>
        </div>
      </article>
    `;
    }).join("")
    : `<div class="permission-list-empty">暂无权限组</div>`;

  dom.groupList.querySelectorAll(".permission-group-item").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target.closest("button")) {
        return;
      }
      state.activeGroupCode = button.dataset.code || "";
      render();
    });
  });
  dom.groupList.querySelectorAll("[data-edit-group]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeGroupCode = button.dataset.editGroup || "";
      render();
      document.querySelector("#groupForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderActiveGroup() {
  const group = activeGroup();
  dom.deleteGroupButton.disabled = !group?.id;
  dom.groupRecordId.value = group?.id || "";
  dom.groupCodeInput.value = group?.code || "";
  dom.groupCodeInput.disabled = Boolean(group?.id);
  dom.groupNameInput.value = group?.name || "";
  dom.groupStatusInput.value = group?.status || "启用";
  dom.activeGroupTitle.textContent = group?.name || "权限规则";
  dom.activeGroupMeta.textContent = group?.code
    ? `权限编号：${group.code}，配置后会按成员范围自动生效`
    : "先保存基础信息，再配置成员、操作、数据和字段";

  const hasCode = Boolean(group?.id);
  [dom.addMemberButton, dom.saveModulesButton, dom.saveFieldsButton].forEach((button) => {
    button.disabled = !hasCode;
  });

  renderMembers();
  renderModuleRows();
  renderFieldRows();
}

function renderTabs() {
  if (!dom.tabs.length) {
    Object.values(dom.panels).forEach((panel) => {
      if (panel) {
        panel.hidden = false;
      }
    });
    return;
  }
  dom.tabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
  Object.entries(dom.panels).forEach(([tab, panel]) => {
    if (panel) {
      panel.hidden = tab !== state.activeTab;
    }
  });
}

function renderMemberTargetFields() {
  const type = dom.memberTypeInput.value;
  dom.memberUserField.hidden = type !== "成员";
  dom.memberDeptField.hidden = type !== "部门";
}

function renderMembers() {
  renderMemberTargetFields();
  const rows = state.members.filter((row) => readText(row, MEMBER_FIELD.groupCode) === activeGroupCode());
  dom.memberEmptyState.hidden = rows.length > 0;
  dom.memberRows.innerHTML = rows.map((row) => {
    const id = rowId(row);
    const type = readText(row, MEMBER_FIELD.objectType) || "成员";
    const userText = readText(row, MEMBER_FIELD.member);
    const deptText = readText(row, MEMBER_FIELD.department);
    const status = readText(row, MEMBER_FIELD.status) || "启用";
    const target = type === "全部成员" ? "全部人员" : (userText || deptText || "-");
    return `
      <div class="permission-member-card">
        <div>
          <strong>${escapeHtml(target)}</strong>
          <span>${escapeHtml(type)}</span>
        </div>
        <span class="status-pill ${status === "停用" ? "danger" : "success"}">${escapeHtml(status)}</span>
        <button class="button compact danger" type="button" data-delete-member="${escapeHtml(id)}">删除</button>
      </div>
    `;
  }).join("");
  dom.memberRows.querySelectorAll("[data-delete-member]").forEach((button) => {
    button.addEventListener("click", () => deletePermissionRow("/api/permission-members/delete", button.dataset.deleteMember, "授权对象"));
  });
}

function renderModuleRows() {
  const groupCode = activeGroupCode();
  const rowsByModule = new Map(
    state.modules
      .filter((row) => readText(row, MODULE_FIELD.groupCode) === groupCode)
      .map((row) => [readText(row, MODULE_FIELD.moduleCode), row])
  );
  const selectedCode = state.activeModuleCode || dom.permissionModuleInput?.value || MODULES[0].code;
  const module = MODULES.find((item) => item.code === selectedCode) || MODULES[0];
  if (dom.permissionModuleInput) {
    dom.permissionModuleInput.value = module.code;
  }
  const row = rowsByModule.get(module.code);
  const operations = readMulti(row, MODULE_FIELD.operations);
  const scopes = readMulti(row, MODULE_FIELD.dataScope);
  const visible = readText(row, MODULE_FIELD.defaultVisible) || "是";
  const editable = readText(row, MODULE_FIELD.defaultEditable) || "否";
  const status = readText(row, MODULE_FIELD.status) || "启用";

  dom.moduleRows.innerHTML = `
    <div class="permission-rule-card" data-module-code="${escapeHtml(module.code)}" data-row-id="${escapeHtml(rowId(row))}">
      <div class="permission-rule-heading">
        <div>
          <strong>${escapeHtml(module.name)}</strong>
          <span>当前正在配置的业务模块</span>
        </div>
        ${statusSelect(`status-${module.code}`, status)}
      </div>
      <div class="permission-rule-section">
        <div class="permission-rule-section-title">
          <strong>操作权限</strong>
          <span>勾选后，成员能在该模块中执行对应动作。</span>
        </div>
        ${OPERATION_GROUPS.map((group) => `
          <div class="permission-check-row">
            <span>${escapeHtml(group.title)}</span>
            ${checkboxGroup(`operation-${module.code}`, group.values, operations)}
          </div>
        `).join("")}
      </div>
      <div class="permission-rule-section">
        <div class="permission-rule-section-title">
          <strong>数据范围</strong>
          <span>如果一个成员命中多个权限组，系统会取更大的数据范围。</span>
        </div>
        ${checkboxGroup(`scope-${module.code}`, DATA_SCOPE_OPTIONS, scopes)}
      </div>
      <div class="permission-default-grid">
        <label>
          <span>默认字段可见</span>
          ${yesNoSelect(`visible-${module.code}`, visible)}
        </label>
        <label>
          <span>默认字段可编辑</span>
          ${yesNoSelect(`editable-${module.code}`, editable)}
        </label>
      </div>
    </div>
  `;
}

function renderFieldRows() {
  const moduleCode = state.activeModuleCode || dom.fieldModuleInput.value || dom.permissionModuleInput?.value || MODULES[0].code;
  const module = MODULES.find((item) => item.code === moduleCode) || MODULES[0];
  if (dom.fieldModuleInput) {
    dom.fieldModuleInput.value = module.code;
  }
  const groupCode = activeGroupCode();
  const moduleConfig = state.modules.find((row) =>
    readText(row, MODULE_FIELD.groupCode) === groupCode &&
    readText(row, MODULE_FIELD.moduleCode) === module.code
  );
  const defaultVisible = (readText(moduleConfig, MODULE_FIELD.defaultVisible) || "是") === "是";
  const defaultEditable = (readText(moduleConfig, MODULE_FIELD.defaultEditable) || "否") === "是";
  const rowsByAlias = new Map(
    state.fields
      .filter((row) =>
        readText(row, FIELD_PERMISSION_FIELD.groupCode) === groupCode &&
        readText(row, FIELD_PERMISSION_FIELD.moduleCode) === module.code
      )
      .map((row) => [readText(row, FIELD_PERMISSION_FIELD.fieldAlias), row])
  );

  dom.fieldRows.innerHTML = module.fields.map(([name, alias]) => {
    const row = rowsByAlias.get(alias);
    const visible = row ? readText(row, FIELD_PERMISSION_FIELD.visible) === "是" : defaultVisible;
    const editable = row ? readText(row, FIELD_PERMISSION_FIELD.editable) === "是" : defaultEditable;
    const status = readText(row, FIELD_PERMISSION_FIELD.status) || "启用";
    return `
      <div class="permission-field-row" data-field-alias="${escapeHtml(alias)}" data-field-name="${escapeHtml(name)}" data-row-id="${escapeHtml(rowId(row))}">
        <div class="permission-field-name">
          <strong>${escapeHtml(name)}</strong>
        </div>
        <label><input type="checkbox" data-field-visible ${visible ? "checked" : ""} /><span>可见</span></label>
        <label><input type="checkbox" data-field-editable ${editable ? "checked" : ""} /><span>可编辑</span></label>
        ${statusSelect("field-status", status)}
      </div>
    `;
  }).join("");
}

function startNewGroup() {
  const code = `QX${formatCompactDate(new Date())}${Math.floor(Math.random() * 90 + 10)}`;
  state.activeGroupCode = "";
  dom.groupRecordId.value = "";
  dom.groupCodeInput.value = code;
  dom.groupCodeInput.disabled = false;
  dom.groupNameInput.value = "";
  dom.groupStatusInput.value = "启用";
  dom.activeGroupTitle.textContent = "新建权限组";
  dom.activeGroupMeta.textContent = "填写基础信息后保存";
  dom.deleteGroupButton.disabled = true;
  [dom.addMemberButton, dom.saveModulesButton, dom.saveFieldsButton].forEach((button) => {
    button.disabled = true;
  });
  dom.groupNameInput.focus();
  renderMembers();
  renderModuleRows();
  renderFieldRows();
}

async function saveGroup() {
  const id = dom.groupRecordId.value.trim();
  const code = dom.groupCodeInput.value.trim();
  const name = dom.groupNameInput.value.trim();
  const status = dom.groupStatusInput.value || "启用";

  if (!code || !name) {
    setStatus("请填写权限组编码和名称");
    return;
  }

  const duplicate = state.groups.find((group) => group.code === code && group.id !== id);
  if (duplicate) {
    setStatus("权限组编码已存在");
    return;
  }

  const data = {
    [GROUP_FIELD.code]: code,
    [GROUP_FIELD.name]: name,
    [GROUP_FIELD.status]: status
  };

  try {
    setStatus("正在保存权限组");
    if (id) {
      await postJson(apiUrl("/api/permission-groups/update"), { data_id: id, _id: id, data });
    } else {
      await postJson(apiUrl("/api/permission-groups/create"), { data });
    }
    state.activeGroupCode = code;
    await loadAll();
    setStatus("权限组已保存");
  } catch (error) {
    setStatus(`权限组保存失败：${error.message}`);
  }
}

async function deleteActiveGroup() {
  const group = activeGroup();
  if (!group?.id) {
    return;
  }
  if (!confirm(`确认删除权限组「${group.name || group.code}」？关联的成员、模块、字段权限不会自动删除。`)) {
    return;
  }

  try {
    await postJson(apiUrl("/api/permission-groups/delete"), {
      data_id: group.id,
      _id: group.id,
      data_ids: [group.id]
    });
    state.activeGroupCode = "";
    await loadAll();
    setStatus("权限组已删除");
  } catch (error) {
    setStatus(`删除失败：${error.message}`);
  }
}

async function addMember() {
  const groupCode = activeGroupCode();
  if (!groupCode || !activeGroup()?.id) {
    setStatus("请先保存基础信息");
    return;
  }

  const type = dom.memberTypeInput.value;
  const data = {
    [MEMBER_FIELD.groupCode]: groupCode,
    [MEMBER_FIELD.objectType]: type,
    [MEMBER_FIELD.status]: dom.memberStatusInput.value || "启用"
  };

  if (type === "成员") {
    if (!dom.memberUserInput.value) {
      setStatus("请选择成员");
      return;
    }
    data[MEMBER_FIELD.member] = dom.memberUserInput.value;
  }
  if (type === "部门") {
    if (!dom.memberDeptInput.value) {
      setStatus("请选择部门");
      return;
    }
    data[MEMBER_FIELD.department] = dom.memberDeptInput.value;
  }

  try {
    setStatus("正在添加授权对象");
    await postJson(apiUrl("/api/permission-members/create"), { data });
    await loadAll();
    setStatus("授权对象已添加");
  } catch (error) {
    setStatus(`添加失败：${error.message}`);
  }
}

async function saveModules() {
  const groupCode = activeGroupCode();
  if (!groupCode || !activeGroup()?.id) {
    setStatus("请先保存基础信息");
    return;
  }

  try {
    setStatus("正在保存模块权限");
    const rows = Array.from(dom.moduleRows.querySelectorAll("[data-module-code]"));
    for (const tr of rows) {
      const moduleCode = tr.dataset.moduleCode;
      const module = MODULES.find((item) => item.code === moduleCode);
      if (!module) {
        continue;
      }
      const id = tr.dataset.rowId || "";
      const data = {
        [MODULE_FIELD.groupCode]: groupCode,
        [MODULE_FIELD.moduleCode]: module.code,
        [MODULE_FIELD.moduleName]: module.name,
        [MODULE_FIELD.operations]: checkedValues(tr, "data-check-name", `operation-${module.code}`),
        [MODULE_FIELD.dataScope]: checkedValues(tr, "data-check-name", `scope-${module.code}`),
        [MODULE_FIELD.defaultVisible]: selectValue(tr, `visible-${module.code}`),
        [MODULE_FIELD.defaultEditable]: selectValue(tr, `editable-${module.code}`),
        [MODULE_FIELD.status]: selectValue(tr, `status-${module.code}`)
      };

      if (id) {
        await postJson(apiUrl("/api/module-permissions/update"), { data_id: id, _id: id, data });
      } else {
        await postJson(apiUrl("/api/module-permissions/create"), { data });
      }
    }
    await loadAll();
    renderModuleList();
    setStatus("模块权限已保存");
  } catch (error) {
    setStatus(`模块权限保存失败：${error.message}`);
  }
}

async function saveFields() {
  const groupCode = activeGroupCode();
  const moduleCode = dom.fieldModuleInput.value;
  const module = MODULES.find((item) => item.code === moduleCode);
  if (!groupCode || !module || !activeGroup()?.id) {
    setStatus("请先保存基础信息");
    return;
  }

  try {
    setStatus("正在保存字段权限");
    const rows = Array.from(dom.fieldRows.querySelectorAll("[data-field-alias]"));
    for (const tr of rows) {
      const id = tr.dataset.rowId || "";
      const editable = tr.querySelector("[data-field-editable]")?.checked || false;
      const visible = editable || (tr.querySelector("[data-field-visible]")?.checked || false);
      const data = {
        [FIELD_PERMISSION_FIELD.groupCode]: groupCode,
        [FIELD_PERMISSION_FIELD.moduleCode]: module.code,
        [FIELD_PERMISSION_FIELD.fieldName]: tr.dataset.fieldName || "",
        [FIELD_PERMISSION_FIELD.fieldAlias]: tr.dataset.fieldAlias || "",
        [FIELD_PERMISSION_FIELD.visible]: visible ? "是" : "否",
        [FIELD_PERMISSION_FIELD.editable]: editable ? "是" : "否",
        [FIELD_PERMISSION_FIELD.status]: tr.querySelector("select")?.value || "启用"
      };

      if (id) {
        await postJson(apiUrl("/api/field-permissions/update"), { data_id: id, _id: id, data });
      } else {
        await postJson(apiUrl("/api/field-permissions/create"), { data });
      }
    }
    await loadAll();
    state.activeTab = "fields";
    renderTabs();
    setStatus("字段权限已保存");
  } catch (error) {
    setStatus(`字段权限保存失败：${error.message}`);
  }
}

async function deletePermissionRow(path, id, label) {
  if (!id || !confirm(`确认删除该${label}？`)) {
    return;
  }

  try {
    setStatus(`正在删除${label}`);
    await postJson(apiUrl(path), { data_id: id, _id: id, data_ids: [id] });
    await loadAll();
    setStatus(`${label}已删除`);
  } catch (error) {
    setStatus(`删除失败：${error.message}`);
  }
}

async function loadPreview() {
  try {
    setStatus("正在加载权限预览");
    const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    const payload = await postJson(apiUrl("/api/permissions/me"), {
      url: window.location.href,
      ...params
    });
    renderPreview(payload);
    setStatus("权限预览已刷新");
  } catch (error) {
    dom.previewBox.innerHTML = `<div class="empty-state">加载失败：${escapeHtml(error.message)}</div>`;
    setStatus(`权限预览失败：${error.message}`);
  }
}

function renderPreview(payload) {
  const member = payload.member || {};
  const modules = Object.values(payload.modules || {});
  dom.previewBox.innerHTML = `
    <div class="permission-preview-grid">
      <div><span>当前成员</span><strong>${escapeHtml(member.name || "-")}</strong></div>
      <div><span>匹配方式</span><strong>${escapeHtml(payload.matchedBy || (payload.matched ? "已匹配" : "未匹配"))}</strong></div>
      <div><span>所属部门</span><strong>${escapeHtml(member.mainDeptName || "-")}</strong></div>
      <div><span>权限组</span><strong>${escapeHtml((payload.groups || []).map((group) => group.name || group.code).join(" / ") || "-")}</strong></div>
    </div>
    <div class="permission-preview-list">
      ${modules.length ? modules.map((module) => `
        <div class="permission-preview-row">
          <strong>${escapeHtml(module.moduleName || module.moduleCode)}</strong>
          <span>操作：${escapeHtml((module.operations || []).join("、") || "无")}</span>
          <span>范围：${escapeHtml(module.dataScope || "无权限")}</span>
        </div>
      `).join("") : `<div class="empty-state">暂无模块权限</div>`}
    </div>
  `;
}

function groupSummary(group) {
  const code = group.code || "";
  const memberRows = state.members.filter((row) => readText(row, MEMBER_FIELD.groupCode) === code);
  const moduleRows = state.modules.filter((row) => readText(row, MODULE_FIELD.groupCode) === code);
  const enabledModules = moduleRows.filter((row) => readText(row, MODULE_FIELD.status) !== "停用");
  const currentModuleRows = enabledModules.filter((row) => readText(row, MODULE_FIELD.moduleCode) === state.activeModuleCode);
  const summaryRows = currentModuleRows.length ? currentModuleRows : enabledModules;
  const operations = uniqueValues(summaryRows.flatMap((row) => readMulti(row, MODULE_FIELD.operations)));
  const scopes = uniqueValues(summaryRows.flatMap((row) => readMulti(row, MODULE_FIELD.dataScope)));
  const fieldRows = state.fields.filter((row) =>
    readText(row, FIELD_PERMISSION_FIELD.groupCode) === code &&
    (!state.activeModuleCode || readText(row, FIELD_PERMISSION_FIELD.moduleCode) === state.activeModuleCode) &&
    readText(row, FIELD_PERMISSION_FIELD.status) !== "停用"
  );
  const scopeText = bestScopeText(scopes);
  const description = operations.length
    ? `可执行：${operations.slice(0, 4).join("、")}${operations.length > 4 ? "等" : ""}`
    : "尚未配置操作权限";
  const memberText = summarizeMembers(memberRows);
  const operationText = operations.length ? operations.join(" | ") : "未设置";
  const fieldText = fieldRows.length ? `已单独设置 ${fieldRows.length} 个字段` : "继承模块默认字段权限";

  return {
    description,
    memberText,
    scopeText: scopeText || "未设置数据范围",
    operationText,
    fieldText
  };
}

function summarizeMembers(memberRows) {
  if (!memberRows.length) {
    return "未设置成员";
  }
  const labels = memberRows.slice(0, 4).map((row) => {
    const type = readText(row, MEMBER_FIELD.objectType) || "成员";
    const member = readText(row, MEMBER_FIELD.member);
    const dept = readText(row, MEMBER_FIELD.department);
    if (/全|所有/.test(type)) {
      return "全部人员";
    }
    return member || dept || type;
  });
  return `${labels.join("、")}${memberRows.length > labels.length ? ` 等 ${memberRows.length} 个对象` : ""}`;
}

function bestScopeText(scopes) {
  const ranked = [...scopes].sort((left, right) => DATA_SCOPES.indexOf(right) - DATA_SCOPES.indexOf(left));
  const scope = ranked.find((item) => DATA_SCOPES.includes(item)) || ranked[0] || "";
  return DATA_SCOPE_OPTIONS.find((item) => item.value === scope)?.label || scope;
}

function uniqueValues(values) {
  return Array.from(new Set(values.map((item) => String(item || "").trim()).filter(Boolean)));
}

function activeGroup() {
  return state.groups.find((group) => group.code === state.activeGroupCode) || null;
}

function activeGroupCode() {
  return (dom.groupCodeInput.value || state.activeGroupCode || "").trim();
}

function normalizeGroup(row) {
  return {
    id: rowId(row),
    code: readText(row, GROUP_FIELD.code) || readText(row, GROUP_FIELD.oldCode),
    name: readText(row, GROUP_FIELD.name),
    status: readText(row, GROUP_FIELD.status) || "启用",
    raw: row
  };
}

function normalizeUsers(payload) {
  const rows = Array.isArray(payload?.users) ? payload.users : extractRows(payload);
  return rows
    .map((row) => ({
      userId: String(row.userId || row.user_id || row.id || row._id || row.uniqueId || row.uniqueid || "").trim(),
      name: String(row.name || row.user_name || row.userName || row.account || "").trim(),
      account: String(row.account || "").trim(),
      mobile: String(row.mobile || row.phone || "").trim()
    }))
    .filter((user) => user.userId || user.name)
    .sort((left, right) => (left.name || left.userId).localeCompare(right.name || right.userId, "zh-Hans-CN", {
      numeric: true,
      sensitivity: "base"
    }));
}

function normalizeDepartments(payload) {
  const rows = Array.isArray(payload?.departments) ? payload.departments : extractRows(payload);
  const deptMap = new Map();
  const departments = rows.map((row) => {
    const dept = {
      deptId: String(row.deptId || row.dept_id || row.id || row._id || "").trim(),
      name: String(row.name || row.deptName || row.dept_name || "").trim(),
      parentId: String(row.parentId || row.parent_id || "").trim(),
      deptNo: row.deptNo ?? row.dept_no ?? ""
    };
    deptMap.set(dept.deptId, dept);
    return dept;
  }).filter((dept) => dept.deptId || dept.name);

  departments.forEach((dept) => {
    dept.pathName = buildDepartmentPath(dept, deptMap);
  });
  return departments;
}

function buildDepartmentPath(dept, deptMap) {
  const names = [];
  const seen = new Set();
  let current = dept;
  while (current && !seen.has(current.deptId)) {
    seen.add(current.deptId);
    if (current.name) {
      names.unshift(current.name);
    }
    current = current.parentId ? deptMap.get(current.parentId) : null;
  }
  return names.join(" / ") || dept.name || dept.deptId;
}

function checkboxGroup(name, values, selected) {
  const selectedSet = new Set(selected);
  return `<div class="permission-check-grid">
    ${values.map((option) => {
      const value = typeof option === "object" ? option.value : option;
      const label = typeof option === "object" ? option.label : option;
      return `
      <label>
        <input type="checkbox" data-check-name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${selectedSet.has(value) ? "checked" : ""} />
        <span>${escapeHtml(label)}</span>
      </label>
    `;
    }).join("")}
  </div>`;
}

function yesNoSelect(name, value) {
  const normalized = value === "否" ? "否" : "是";
  return `
    <select class="permission-cell-select" data-select-name="${escapeHtml(name)}">
      <option ${normalized === "是" ? "selected" : ""}>是</option>
      <option ${normalized === "否" ? "selected" : ""}>否</option>
    </select>
  `;
}

function statusSelect(name, value) {
  const normalized = value === "停用" ? "停用" : "启用";
  return `
    <select class="permission-cell-select" data-select-name="${escapeHtml(name)}">
      <option ${normalized === "启用" ? "selected" : ""}>启用</option>
      <option ${normalized === "停用" ? "selected" : ""}>停用</option>
    </select>
  `;
}

function checkedValues(root, attr, name) {
  return Array.from(root.querySelectorAll(`input[${attr}="${CSS.escape(name)}"]:checked`)).map((input) => input.value);
}

function selectValue(root, name) {
  return root.querySelector(`select[data-select-name="${CSS.escape(name)}"]`)?.value || "";
}

function readText(row, key) {
  return readComplexValue(row?.[key]).trim();
}

function readMulti(row, key) {
  const value = row?.[key];
  if (Array.isArray(value)) {
    return value.map(readComplexValue).filter(Boolean);
  }
  const text = readComplexValue(value).trim();
  return text ? text.split(/[、,，/；;]+/).map((item) => item.trim()).filter(Boolean) : [];
}

function readComplexValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.map(readComplexValue).filter(Boolean).join(" / ");
  }
  if (typeof value !== "object") {
    return String(value);
  }
  return String(
    value.name ||
    value.user_name ||
    value.userName ||
    value.label ||
    value.text ||
    value.value ||
    value.title ||
    value._id ||
    value.id ||
    ""
  );
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
  if (Array.isArray(result?.rows)) {
    return result.rows;
  }
  if (Array.isArray(result?.list)) {
    return result.list;
  }
  return [];
}

function rowId(row) {
  return String(row?._id || row?.id || row?.data_id || row?.dataId || row?.entry_id || row?.entryId || "");
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

function formatCompactDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join("");
}

function setStatus(text) {
  dom.statusText.textContent = text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
