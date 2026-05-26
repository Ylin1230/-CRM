const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FRONTEND_ROOT = path.join(ROOT, "frontend");

loadEnv();

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);
const API_TOKEN =
  process.env.BS_API_KEY ||
  process.env.BES_API_KEY ||
  process.env.BAISHUYUN_TOKEN ||
  process.env.BAISU_API_KEY ||
  "";
const SMS_WEBHOOK_URL = process.env.SMS_WEBHOOK_URL || "";
const SMS_WEBHOOK_TOKEN = process.env.SMS_WEBHOOK_TOKEN || "";
const SMS_PROVIDER_NAME = process.env.SMS_PROVIDER_NAME || (SMS_WEBHOOK_URL ? "webhook" : "mock");
const SMS_STORE_PATH = path.join(__dirname, "data", "sms-store.json");
const SMS_SCHEDULE_INTERVAL_MS = Number(process.env.SMS_SCHEDULE_INTERVAL_MS || 30000);
const SMS_STATE = loadSmsStore();
let smsSchedulerBusy = false;

const SURVEY_BASE_URL =
  process.env.SURVEY_BASE_URL ||
  "https://ahyg.online-office.net/f/bcb94724bf17b511adc1a348";

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

const QUESTIONNAIRE_TEMPLATE = {
  lecture: "活动讲座模版",
  promo: "展架等宣传品通用模版"
};

const STUDENT_FIELD = {
  activityName: "_widget_1778462323391",
  personName: "_widget_1778462323439",
  phone: "_widget_1778462323458",
  email: "_widget_1778462323477",
  company: "_widget_1778462323496",
  position: "_widget_1778462323515",
  gender: "_widget_1778462323579",
  education: "_widget_1778462323612",
  managerYears: "_widget_1778462323643",
  wechat: "_widget_1778462323664",
  idCard: "_widget_1778462323685",
  signupSource: "_widget_1778462323706",
  intention: "_widget_1778655214142",
  direction: "_widget_1778655214041",
  sourceCode: "_widget_1778654034413",
  repeatCount: "_widget_1778673212735",
  concern: "_widget_1778462323738"
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
  assignTime: "_widget_1779672124526",
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

const ADMITTED_FIELD = {
  customerCode: "_widget_1771903380071",
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
  ownerText: "_widget_1778221359507",
  referrer: "_widget_1771903284191",
  intention: "_widget_1771903284192",
  email: "_widget_1771903284193",
  city: "_widget_1771912523597",
  firstContact: "_widget_1771903284194",
  latestContact: "_widget_1771913317568",
  contactReport: "_widget_1771903284195",
  sourceCode: "_widget_1771903380373",
  leadCode: "_widget_1778143487652",
  status: "_widget_1771912718738"
};

const ARCHIVE_FIELD = {
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
  assignTime: "_widget_1779672124526",
  contactReport: "_widget_1771903284195",
  sourceCode: "_widget_1771903380373",
  status: "_widget_1771912718738"
};

const ENDPOINTS = {
  activity: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/61b0413eb5b04baac8533296/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/61b0413eb5b04baac8533296/data",
    update:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/61b0413eb5b04baac8533296/data_update",
    delete:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/61b0413eb5b04baac8533296/data_delete",
    count:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/61b0413eb5b04baac8533296/data_count"
  },
  survey: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/8d724bd6ba980d867fe62267/data_create",
    info:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/8d724bd6ba980d867fe62267/info"
  },
  activityStudent: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/1aa84e9da941d20beccc68e0/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/1aa84e9da941d20beccc68e0/data",
    update:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/1aa84e9da941d20beccc68e0/data_update",
    count:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/1aa84e9da941d20beccc68e0/data_count"
  },
  lead: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/0dca468980276779b9b846ff/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/0dca468980276779b9b846ff/data",
    update:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/0dca468980276779b9b846ff/data_update",
    delete:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/0dca468980276779b9b846ff/data_delete",
    count:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/0dca468980276779b9b846ff/data_count",
    uniqueCreate:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/0dca468980276779b9b846ff/unique_create"
  },
  followUp: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/7f5b4d8a80993f1a5cbcca67/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/7f5b4d8a80993f1a5cbcca67/data"
  },
  admitted: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/4e044da09fb3078e76a4d766/data_create"
  },
  archive: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/4bb546e5bdb647fffb75ac15/data_create"
  },
  user: {
    list: "https://ahyg.online-office.net/openapi/v1/user/user_list",
    info: "https://ahyg.online-office.net/openapi/v1/user/user_info"
  },
  department: {
    list: "https://ahyg.online-office.net/openapi/v1/department/department_list"
  }
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(requestUrl.pathname);

    if (pathname === "/api/config" && req.method === "GET") {
      return sendJson(res, 200, {
        ok: true,
        hasToken: Boolean(API_TOKEN),
        surveyBaseUrl: SURVEY_BASE_URL,
        sms: {
          provider: SMS_PROVIDER_NAME,
          mode: SMS_WEBHOOK_URL ? "webhook" : "mock",
          canSend: Boolean(SMS_WEBHOOK_URL),
          hasWebhook: Boolean(SMS_WEBHOOK_URL)
        }
      });
    }

    if (pathname === "/api/sms/logs" && req.method === "GET") {
      return sendJson(res, 200, {
        ok: true,
        provider: SMS_PROVIDER_NAME,
        mode: SMS_WEBHOOK_URL ? "webhook" : "mock",
        jobs: SMS_STATE.jobs.slice(-50).reverse(),
        logs: SMS_STATE.logs.slice(0, 50)
      });
    }

    if (pathname === "/api/sms/send" && req.method === "POST") {
      const body = await readJson(req);
      const result = await handleSmsSend(body);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/activity-student/grouped" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await getActivityStudentGrouped(body);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/users/list" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const result = await getUserList();
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/departments/list" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await getDepartmentList(body);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/follow-up/by-lead" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await getFollowUpsByLeadCode(body.leadCode || body.code || "");
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/lead/confirm-admission" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await confirmLeadAdmission(body);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/lead/archive" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await archiveLead(body);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/lead/batch-assign" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await batchAssignLeads(body);
      return sendJson(res, 200, result);
    }

    const apiRoute = resolveApiRoute(pathname);
    if (apiRoute) {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = req.method === "GET" ? {} : await readJson(req);
      if (pathname === "/api/survey/submit" && req.method === "POST") {
        const result = await submitSurveyCascade(body.data || {}, {
          template: body.template || body.questionnaireTemplate || ""
        });
        return sendJson(res, 200, result);
      }

      const method = apiRoute.method || "POST";
      const upstream = await callBaishuyun(apiRoute.url, body, method);
      return sendJson(res, upstream.status, upstream.payload);
    }

    if (pathname === "/health") {
      return sendJson(res, 200, { ok: true });
    }

    return serveStatic(pathname, res);
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error.message || "服务异常"
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Activity management page: http://${HOST}:${PORT}`);
});
startSmsScheduler();

function resolveApiRoute(pathname) {
  const routes = {
    "/api/activity/create": { url: ENDPOINTS.activity.create },
    "/api/activity/list": { url: ENDPOINTS.activity.list },
    "/api/activity/update": { url: ENDPOINTS.activity.update },
    "/api/activity/delete": { url: ENDPOINTS.activity.delete },
    "/api/activity/count": { url: ENDPOINTS.activity.count },
    "/api/survey/create": { url: ENDPOINTS.survey.create },
    "/api/survey/info": { url: ENDPOINTS.survey.info, method: "GET" },
    "/api/survey/submit": { url: ENDPOINTS.survey.create },
    "/api/activity-student/create": { url: ENDPOINTS.activityStudent.create },
    "/api/activity-student/list": { url: ENDPOINTS.activityStudent.list },
    "/api/activity-student/update": { url: ENDPOINTS.activityStudent.update },
    "/api/activity-student/count": { url: ENDPOINTS.activityStudent.count },
    "/api/lead/list": { url: ENDPOINTS.lead.list },
    "/api/lead/create": { url: ENDPOINTS.lead.create },
    "/api/lead/update": { url: ENDPOINTS.lead.update },
    "/api/lead/delete": { url: ENDPOINTS.lead.delete },
    "/api/lead/count": { url: ENDPOINTS.lead.count },
    "/api/lead/unique-create": { url: ENDPOINTS.lead.uniqueCreate },
    "/api/follow-up/create": { url: ENDPOINTS.followUp.create },
    "/api/follow-up/list": { url: ENDPOINTS.followUp.list }
  };

  return routes[pathname];
}

async function submitSurveyCascade(surveyData, options = {}) {
  const phone = normalizePhone(valueOf(surveyData, SURVEY_FIELD.phone));
  const name = valueOf(surveyData, SURVEY_FIELD.personName);
  if (!name || !phone) {
    throw new Error("请填写姓名和手机号");
  }

  const [surveyResult, priorRows] = await Promise.all([
    callBaishuyunOrThrow(ENDPOINTS.survey.create, {
      data: surveyData
    }),
    findActivityStudentsByPhone(phone)
  ]);
  const priorCount = priorRows.length;
  const repeatCount = priorCount + 1;
  const studentData = buildActivityStudentData(surveyData, repeatCount);
  const activityStudentResult = await callBaishuyunOrThrow(ENDPOINTS.activityStudent.create, {
    data: studentData
  });

  const defaultLeadResult = {
    required: false,
    created: false,
    duplicate: false,
    payload: null
  };
  const leadResultPromise = shouldCreatePotentialLead(surveyData, options)
    ? callBaishuyunOrThrow(ENDPOINTS.lead.uniqueCreate, {
        data: buildLeadData(surveyData, options),
        unique: [LEAD_FIELD.phone]
      }).then(parseUniqueCreateResult)
    : Promise.resolve(defaultLeadResult);
  const [repeatSyncResult, leadResult] = await Promise.all([
    syncHistoricalActivityStudentRepeatCounts(priorRows, repeatCount),
    leadResultPromise
  ]);

  return {
    ok: true,
    survey: {
      created: true,
      payload: surveyResult
    },
    activityStudent: {
      created: true,
      duplicate: priorCount > 0,
      priorCount,
      repeatCount,
      repeatSync: repeatSyncResult,
      payload: activityStudentResult
    },
    potentialLead: leadResult
  };
}

async function handleSmsSend(body) {
  const request = normalizeSmsRequest(body);

  if (request.sendMode === "scheduled") {
    const scheduledAt = new Date(request.scheduledAt);
    if (!Number.isFinite(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
      throw new Error("请选择晚于当前时间的预约发送时间");
    }

    const job = {
      id: createId("smsjob"),
      status: "scheduled",
      sourceType: request.sourceType,
      content: request.content,
      recipients: request.recipients,
      total: request.recipients.length,
      scheduledAt: scheduledAt.toISOString(),
      createdAt: new Date().toISOString(),
      provider: SMS_PROVIDER_NAME,
      mode: SMS_WEBHOOK_URL ? "webhook" : "mock"
    };

    SMS_STATE.jobs.push(job);
    SMS_STATE.jobs = SMS_STATE.jobs.slice(-200);
    await saveSmsStore();

    return {
      ok: true,
      scheduled: true,
      job
    };
  }

  const batch = await sendSmsBatch({
    sourceType: request.sourceType,
    content: request.content,
    recipients: request.recipients,
    triggerType: "manual"
  });

  return {
    ok: true,
    scheduled: false,
    ...batch
  };
}

async function getActivityStudentGrouped(body = {}) {
  const pageSize = Math.min(Math.max(Number(body.limit || 300), 1), 300);
  const maxPages = Math.min(Math.max(Number(body.maxPages || 80), 1), 200);
  const rows = [];
  let page = 1;
  let seen = 0;
  let total = 0;

  while (page <= maxPages) {
    const payload = await callBaishuyunOrThrow(ENDPOINTS.activityStudent.list, {
      page,
      limit: pageSize,
      skip: (page - 1) * pageSize
    });
    const pageRows = extractRows(payload);
    total = total || extractTotal(payload, 0);
    rows.push(...pageRows);
    seen += pageRows.length;

    if (pageRows.length < pageSize || (total && seen >= total)) {
      break;
    }
    page += 1;
  }

  const groupMap = new Map();
  for (const row of rows) {
    const activityName = readField(row, STUDENT_FIELD.activityName) || "未命名活动";
    const sourceCode = readField(row, STUDENT_FIELD.sourceCode);
    const id = sourceCode || activityName;
    const phone = normalizePhone(readField(row, STUDENT_FIELD.phone));

    if (!groupMap.has(id)) {
      groupMap.set(id, {
        id,
        activityName,
        sourceCode,
        total: 0,
        validPhoneCount: 0
      });
    }

    const group = groupMap.get(id);
    group.total += 1;
    if (/^\d{6,20}$/.test(phone)) {
      group.validPhoneCount += 1;
    }
  }

  const activities = Array.from(groupMap.values()).sort((left, right) => {
    if (right.total !== left.total) {
      return right.total - left.total;
    }
    return left.activityName.localeCompare(right.activityName, "zh-Hans-CN", {
      numeric: true,
      sensitivity: "base"
    });
  });

  return {
    ok: true,
    total: total || rows.length,
    loaded: rows.length,
    activities,
    rows
  };
}

async function getUserList() {
  const payload = await callBaishuyunOrThrow(ENDPOINTS.user.list, {});
  const rows = extractObjectArrayByKeys(payload, ["users"]);
  const users = rows
    .map(normalizeUser)
    .filter((user) => user.userId || user.name)
    .sort((left, right) => left.name.localeCompare(right.name, "zh-Hans-CN", {
      numeric: true,
      sensitivity: "base"
    }));

  return {
    ok: true,
    users,
    total: users.length,
    payload
  };
}

async function getDepartmentList(body = {}) {
  const deptId = String(body.dept_id ?? body.deptId ?? "").trim();
  const payload = await callBaishuyunOrThrow(ENDPOINTS.department.list, {
    dept_id: deptId,
    has_child: body.has_child !== false
  });
  const rows = extractObjectArrayByKeys(payload, ["departments"]);
  const departments = rows
    .map(normalizeDepartment)
    .filter((dept) => dept.deptId || dept.name)
    .sort((left, right) => {
      const leftNo = Number(left.deptNo);
      const rightNo = Number(right.deptNo);
      if (Number.isFinite(leftNo) && Number.isFinite(rightNo) && leftNo !== rightNo) {
        return leftNo - rightNo;
      }
      return left.name.localeCompare(right.name, "zh-Hans-CN", {
        numeric: true,
        sensitivity: "base"
      });
    });

  return {
    ok: true,
    departments,
    total: departments.length,
    payload
  };
}

async function getFollowUpsByLeadCode(leadCode) {
  const normalizedCode = String(leadCode || "").trim();
  if (!normalizedCode) {
    return {
      ok: true,
      rows: [],
      total: 0
    };
  }

  const rows = [];
  const pageSize = 100;
  let page = 1;
  let seen = 0;
  let total = 0;

  while (page <= 50) {
    const payload = await callBaishuyunOrThrow(ENDPOINTS.followUp.list, {
      page,
      limit: pageSize
    });
    const pageRows = extractRows(payload);
    total = total || extractTotal(payload, 0);
    rows.push(
      ...pageRows.filter((row) => String(readField(row, FOLLOWUP_FIELD.leadCode)).trim() === normalizedCode)
    );
    seen += pageRows.length;

    if (pageRows.length < pageSize || (total && seen >= total)) {
      break;
    }
    page += 1;
  }

  rows.sort((left, right) => {
    const leftTime = new Date(readField(left, FOLLOWUP_FIELD.contactTime)).getTime() || 0;
    const rightTime = new Date(readField(right, FOLLOWUP_FIELD.contactTime)).getTime() || 0;
    return rightTime - leftTime;
  });

  return {
    ok: true,
    rows,
    total: rows.length
  };
}

async function confirmLeadAdmission(body = {}) {
  const row = body.row || body.data || {};
  const dataId = String(body.data_id || body.dataId || dataIdOf(row)).trim();
  if (!dataId) {
    throw new Error("缺少潜在考生数据ID");
  }

  const updatePayload = await callBaishuyunOrThrow(ENDPOINTS.lead.update, {
    data_id: dataId,
    _id: dataId,
    data: {
      [LEAD_FIELD.status]: "已报考"
    }
  });
  const admittedPayload = await callBaishuyunOrThrow(ENDPOINTS.admitted.create, {
    data: buildAdmittedData(row)
  });

  return {
    ok: true,
    status: "已报考",
    updated: updatePayload,
    created: admittedPayload
  };
}

async function archiveLead(body = {}) {
  const row = body.row || body.data || {};
  const dataId = String(body.data_id || body.dataId || dataIdOf(row)).trim();
  if (!dataId) {
    throw new Error("缺少潜在考生数据ID");
  }

  const updatePayload = await callBaishuyunOrThrow(ENDPOINTS.lead.update, {
    data_id: dataId,
    _id: dataId,
    data: {
      [LEAD_FIELD.status]: "无效"
    }
  });
  const archivePayload = await callBaishuyunOrThrow(ENDPOINTS.archive.create, {
    data: buildArchiveData(row)
  });

  return {
    ok: true,
    status: "无效",
    updated: updatePayload,
    created: archivePayload
  };
}

async function batchAssignLeads(body = {}) {
  const dataIds = Array.isArray(body.data_ids)
    ? body.data_ids.map((id) => String(id || "").trim()).filter(Boolean)
    : [];
  const ownerId = String(body.ownerId || body.owner_id || "").trim();
  const ownerName = String(body.ownerName || body.owner_name || "").trim();

  if (!dataIds.length) {
    throw new Error("请选择需要分配的潜在考生");
  }
  if (!ownerId && !ownerName) {
    throw new Error("请选择对接人");
  }

  const data = compactData({
    [LEAD_FIELD.owner]: ownerId || null,
    [LEAD_FIELD.ownerText]: ownerName || ownerId,
    [LEAD_FIELD.assignTime]: formatDateTime(new Date()),
    [LEAD_FIELD.status]: "已分配"
  });
  const results = [];

  for (const dataId of dataIds) {
    try {
      const payload = await callBaishuyunOrThrow(ENDPOINTS.lead.update, {
        data_id: dataId,
        _id: dataId,
        data
      });
      results.push({ dataId, ok: true, payload });
    } catch (error) {
      results.push({ dataId, ok: false, message: error.message || "分配失败" });
    }
  }

  const successCount = results.filter((item) => item.ok).length;
  return {
    ok: successCount > 0,
    total: results.length,
    successCount,
    failCount: results.length - successCount,
    results
  };
}

function normalizeSmsRequest(body) {
  const sourceType = ["activityStudent", "lead"].includes(body?.sourceType)
    ? body.sourceType
    : "";
  if (!sourceType) {
    throw new Error("请选择接收人类型");
  }

  const content = String(body?.content || "").trim();
  if (!content) {
    throw new Error("请填写短信内容");
  }
  if (content.length > 500) {
    throw new Error("短信内容不能超过 500 个字");
  }

  const recipients = normalizeSmsRecipients(body?.recipients);
  if (!recipients.length) {
    throw new Error("请选择至少 1 个带手机号的接收人");
  }

  return {
    sourceType,
    sendMode: body?.sendMode === "scheduled" ? "scheduled" : "immediate",
    scheduledAt: body?.scheduledAt || "",
    content,
    recipients
  };
}

function normalizeSmsRecipients(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  const seenPhones = new Set();
  const recipients = [];

  for (const item of input) {
    const fields = sanitizeRecipientFields(item?.fields);
    const phone = normalizeSmsPhone(item?.phone || fields.phone || fields["手机号"]);
    if (!phone || seenPhones.has(phone)) {
      continue;
    }

    seenPhones.add(phone);
    recipients.push({
      id: String(item?.id || phone),
      name: String(item?.name || fields.name || fields["姓名"] || "").trim(),
      phone,
      fields
    });
  }

  return recipients;
}

function sanitizeRecipientFields(fields) {
  if (!fields || typeof fields !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(fields)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [String(key), String(value).trim()])
      .filter(([, value]) => value)
  );
}

function normalizeSmsPhone(value) {
  const phone = normalizePhone(value);
  return /^\d{6,20}$/.test(phone) ? phone : "";
}

async function sendSmsBatch({ sourceType, content, recipients, triggerType, jobId }) {
  const batchId = createId("smsbatch");
  const createdAt = new Date().toISOString();
  const results = [];

  for (const recipient of recipients) {
    try {
      const renderedContent = renderSmsContent(content, recipient);
      const result = await deliverSms({
        batchId,
        jobId,
        sourceType,
        recipient,
        content: renderedContent
      });
      results.push({
        id: recipient.id,
        name: recipient.name,
        phone: recipient.phone,
        ok: result.ok,
        provider: result.provider,
        content: renderedContent,
        message: result.message || ""
      });
    } catch (error) {
      results.push({
        id: recipient.id,
        name: recipient.name,
        phone: recipient.phone,
        ok: false,
        provider: SMS_PROVIDER_NAME,
        content: renderSmsContent(content, recipient),
        message: error.message || "发送失败"
      });
    }
  }

  const successCount = results.filter((item) => item.ok).length;
  const failCount = results.length - successCount;
  const log = {
    id: batchId,
    jobId: jobId || "",
    sourceType,
    triggerType,
    provider: SMS_PROVIDER_NAME,
    mode: SMS_WEBHOOK_URL ? "webhook" : "mock",
    content,
    total: results.length,
    successCount,
    failCount,
    createdAt,
    results
  };

  SMS_STATE.logs.unshift(log);
  SMS_STATE.logs = SMS_STATE.logs.slice(0, 200);
  await saveSmsStore();

  return {
    batchId,
    provider: SMS_PROVIDER_NAME,
    mode: SMS_WEBHOOK_URL ? "webhook" : "mock",
    total: results.length,
    successCount,
    failCount,
    results
  };
}

async function deliverSms({ batchId, jobId, sourceType, recipient, content }) {
  if (!SMS_WEBHOOK_URL) {
    return {
      ok: true,
      provider: "mock",
      message: "模拟发送，未调用短信服务商"
    };
  }

  const headers = {
    "Content-Type": "application/json"
  };
  if (SMS_WEBHOOK_TOKEN) {
    headers.Authorization = SMS_WEBHOOK_TOKEN.startsWith("Bearer ")
      ? SMS_WEBHOOK_TOKEN
      : `Bearer ${SMS_WEBHOOK_TOKEN}`;
  }

  const response = await fetch(SMS_WEBHOOK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      batchId,
      jobId: jobId || "",
      sourceType,
      phone: recipient.phone,
      name: recipient.name,
      content,
      recipient
    })
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }

  const ok =
    response.ok &&
    payload?.ok !== false &&
    !payload?.errcode &&
    !(Number(payload?.code) >= 400);

  return {
    ok,
    provider: SMS_PROVIDER_NAME,
    message: payload?.msg || payload?.message || (ok ? "发送成功" : "发送失败"),
    payload
  };
}

function renderSmsContent(content, recipient) {
  return String(content || "").replace(/\{([^}]+)\}/g, (match, rawKey) => {
    const value = recipientVariableValue(recipient, rawKey.trim());
    return value || match;
  });
}

function recipientVariableValue(recipient, key) {
  const fields = recipient?.fields || {};
  const aliases = {
    姓名: ["name", "姓名", "personName"],
    手机号: ["phone", "手机号"],
    活动名称: ["activityName", "活动名称"],
    报考方向: ["direction", "报考方向"],
    企业名称: ["company", "企业名称", "工作单位"],
    工作单位: ["company", "工作单位", "企业名称"],
    职位: ["position", "职位", "职务"],
    职务: ["position", "职务", "职位"],
    来源渠道: ["signupSource", "来源渠道", "报名来源"],
    报名来源: ["signupSource", "报名来源", "来源渠道"]
  };

  const candidates = aliases[key] || [key];
  for (const candidate of candidates) {
    const value = recipient?.[candidate] || fields[candidate];
    if (value) {
      return String(value);
    }
  }
  return "";
}

function startSmsScheduler() {
  if (!SMS_SCHEDULE_INTERVAL_MS || SMS_SCHEDULE_INTERVAL_MS < 1000) {
    return;
  }

  const timer = setInterval(() => {
    processDueSmsJobs().catch((error) => {
      console.error("SMS scheduler failed:", error);
    });
  }, SMS_SCHEDULE_INTERVAL_MS);
  timer.unref?.();
  processDueSmsJobs().catch((error) => {
    console.error("SMS scheduler failed:", error);
  });
}

async function processDueSmsJobs() {
  if (smsSchedulerBusy) {
    return;
  }

  smsSchedulerBusy = true;
  try {
    const now = Date.now();
    const jobs = SMS_STATE.jobs.filter(
      (job) => job.status === "scheduled" && new Date(job.scheduledAt).getTime() <= now
    );

    for (const job of jobs) {
      job.status = "sending";
      job.startedAt = new Date().toISOString();
      await saveSmsStore();

      try {
        const batch = await sendSmsBatch({
          sourceType: job.sourceType,
          content: job.content,
          recipients: job.recipients,
          triggerType: "scheduled",
          jobId: job.id
        });
        job.status = batch.failCount ? "partial" : "sent";
        job.sentAt = new Date().toISOString();
        job.batchId = batch.batchId;
        job.successCount = batch.successCount;
        job.failCount = batch.failCount;
      } catch (error) {
        job.status = "failed";
        job.failedAt = new Date().toISOString();
        job.message = error.message || "预约发送失败";
      }

      await saveSmsStore();
    }
  } finally {
    smsSchedulerBusy = false;
  }
}

function loadSmsStore() {
  try {
    if (!fs.existsSync(SMS_STORE_PATH)) {
      return { jobs: [], logs: [] };
    }

    const parsed = JSON.parse(fs.readFileSync(SMS_STORE_PATH, "utf8"));
    return {
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : []
    };
  } catch {
    return { jobs: [], logs: [] };
  }
}

async function saveSmsStore() {
  await fsp.mkdir(path.dirname(SMS_STORE_PATH), { recursive: true });
  await fsp.writeFile(SMS_STORE_PATH, JSON.stringify(SMS_STATE, null, 2));
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}

async function callBaishuyunOrThrow(url, body, method = "POST") {
  const result = await callBaishuyun(url, body, method);
  const payload = result.payload;
  if (
    result.status < 200 ||
    result.status >= 300 ||
    payload?.errcode ||
    payload?.code >= 400 ||
    payload?.ok === false
  ) {
    throw new Error(payload?.msg || payload?.message || "百数云接口请求失败");
  }
  return payload;
}

async function findActivityStudentsByPhone(phone) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return [];
  }

  const pageSize = 100;
  let page = 1;
  const matches = [];
  let seen = 0;
  let total = 0;

  while (page <= 50) {
    const payload = await callBaishuyunOrThrow(ENDPOINTS.activityStudent.list, {
      page,
      limit: pageSize
    });
    const rows = extractRows(payload);
    total = total || extractTotal(payload, 0);
    seen += rows.length;
    matches.push(
      ...rows.filter((row) => normalizePhone(readField(row, STUDENT_FIELD.phone)) === normalizedPhone)
    );

    if (rows.length < pageSize || (total && seen >= total)) {
      break;
    }
    page += 1;
  }

  return matches;
}

async function syncHistoricalActivityStudentRepeatCounts(rows, repeatCount) {
  const result = {
    attempted: rows.length,
    updated: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  for (const row of rows) {
    const dataId = dataIdOf(row);
    if (!dataId) {
      result.skipped += 1;
      continue;
    }

    if (Number(readField(row, STUDENT_FIELD.repeatCount)) === repeatCount) {
      result.unchanged += 1;
      continue;
    }

    try {
      await callBaishuyunOrThrow(ENDPOINTS.activityStudent.update, {
        data_id: dataId,
        data: {
          [STUDENT_FIELD.repeatCount]: repeatCount
        }
      });
      result.updated += 1;
    } catch (error) {
      result.failed += 1;
      if (result.errors.length < 3) {
        result.errors.push({
          dataId,
          message: error.message || "活动学员重复次数更新失败"
        });
      }
    }
  }

  if (result.failed) {
    console.warn("Sync activity student repeat count failed:", result);
  }

  return result;
}

function buildActivityStudentData(surveyData, repeatCount) {
  return compactData({
    [STUDENT_FIELD.activityName]: valueOf(surveyData, SURVEY_FIELD.activityName),
    [STUDENT_FIELD.personName]: valueOf(surveyData, SURVEY_FIELD.personName),
    [STUDENT_FIELD.phone]: valueOf(surveyData, SURVEY_FIELD.phone),
    [STUDENT_FIELD.email]: valueOf(surveyData, SURVEY_FIELD.email),
    [STUDENT_FIELD.company]: valueOf(surveyData, SURVEY_FIELD.company),
    [STUDENT_FIELD.position]: valueOf(surveyData, SURVEY_FIELD.position),
    [STUDENT_FIELD.gender]: valueOf(surveyData, SURVEY_FIELD.gender),
    [STUDENT_FIELD.education]: valueOf(surveyData, SURVEY_FIELD.education),
    [STUDENT_FIELD.managerYears]: optionalNumberValue(surveyData, SURVEY_FIELD.managerYears),
    [STUDENT_FIELD.wechat]: valueOf(surveyData, SURVEY_FIELD.wechat),
    [STUDENT_FIELD.idCard]: valueOf(surveyData, SURVEY_FIELD.idCard),
    [STUDENT_FIELD.signupSource]: valueOf(surveyData, SURVEY_FIELD.signupSource),
    [STUDENT_FIELD.intention]: valueOf(surveyData, SURVEY_FIELD.intention),
    [STUDENT_FIELD.direction]: valueOf(surveyData, SURVEY_FIELD.direction),
    [STUDENT_FIELD.sourceCode]: valueOf(surveyData, SURVEY_FIELD.sourceCode),
    [STUDENT_FIELD.repeatCount]: repeatCount,
    [STUDENT_FIELD.concern]: valueOf(surveyData, SURVEY_FIELD.concern)
  });
}

function buildLeadData(surveyData, options = {}) {
  const intention = valueOf(surveyData, SURVEY_FIELD.intention) ||
    (isPromoTemplate(options.template) ? "是，我想了解" : "");

  return compactData({
    [LEAD_FIELD.personName]: valueOf(surveyData, SURVEY_FIELD.personName),
    [LEAD_FIELD.phone]: valueOf(surveyData, SURVEY_FIELD.phone),
    [LEAD_FIELD.gender]: valueOf(surveyData, SURVEY_FIELD.gender),
    [LEAD_FIELD.direction]: valueOf(surveyData, SURVEY_FIELD.direction),
    [LEAD_FIELD.submitTime]: formatDateTime(new Date()),
    [LEAD_FIELD.education]: valueOf(surveyData, SURVEY_FIELD.education),
    [LEAD_FIELD.company]: valueOf(surveyData, SURVEY_FIELD.company),
    [LEAD_FIELD.position]: valueOf(surveyData, SURVEY_FIELD.position),
    [LEAD_FIELD.signupSource]: valueOf(surveyData, SURVEY_FIELD.signupSource),
    [LEAD_FIELD.referrer]: valueOf(surveyData, SURVEY_FIELD.referrer),
    [LEAD_FIELD.intention]: intention,
    [LEAD_FIELD.email]: valueOf(surveyData, SURVEY_FIELD.email),
    [LEAD_FIELD.sourceCode]: valueOf(surveyData, SURVEY_FIELD.sourceCode),
    [LEAD_FIELD.status]: "新线索"
  });
}

function buildAdmittedData(row) {
  return compactData({
    [ADMITTED_FIELD.personName]: readField(row, LEAD_FIELD.personName),
    [ADMITTED_FIELD.phone]: readField(row, LEAD_FIELD.phone),
    [ADMITTED_FIELD.gender]: readField(row, LEAD_FIELD.gender),
    [ADMITTED_FIELD.age]: numberOrEmpty(readField(row, LEAD_FIELD.age)),
    [ADMITTED_FIELD.direction]: readField(row, LEAD_FIELD.direction),
    [ADMITTED_FIELD.submitTime]: readField(row, LEAD_FIELD.submitTime),
    [ADMITTED_FIELD.education]: readField(row, LEAD_FIELD.education),
    [ADMITTED_FIELD.company]: readField(row, LEAD_FIELD.company),
    [ADMITTED_FIELD.position]: readField(row, LEAD_FIELD.position),
    [ADMITTED_FIELD.industry]: readField(row, LEAD_FIELD.industry),
    [ADMITTED_FIELD.signupSource]: readField(row, LEAD_FIELD.signupSource),
    [ADMITTED_FIELD.owner]: memberIdValue(row, LEAD_FIELD.owner),
    [ADMITTED_FIELD.ownerText]: readField(row, LEAD_FIELD.ownerText) || readField(row, LEAD_FIELD.owner),
    [ADMITTED_FIELD.referrer]: readField(row, LEAD_FIELD.referrer),
    [ADMITTED_FIELD.intention]: readField(row, LEAD_FIELD.intention),
    [ADMITTED_FIELD.email]: readField(row, LEAD_FIELD.email),
    [ADMITTED_FIELD.city]: readField(row, LEAD_FIELD.city),
    [ADMITTED_FIELD.firstContact]: readField(row, LEAD_FIELD.firstContact),
    [ADMITTED_FIELD.latestContact]: readField(row, LEAD_FIELD.latestContact),
    [ADMITTED_FIELD.contactReport]: readField(row, LEAD_FIELD.contactReport),
    [ADMITTED_FIELD.sourceCode]: readField(row, LEAD_FIELD.sourceCode),
    [ADMITTED_FIELD.leadCode]: readField(row, LEAD_FIELD.code),
    [ADMITTED_FIELD.status]: "已报考"
  });
}

function buildArchiveData(row) {
  return compactData({
    [ARCHIVE_FIELD.personName]: readField(row, LEAD_FIELD.personName),
    [ARCHIVE_FIELD.phone]: readField(row, LEAD_FIELD.phone),
    [ARCHIVE_FIELD.gender]: readField(row, LEAD_FIELD.gender),
    [ARCHIVE_FIELD.age]: numberOrEmpty(readField(row, LEAD_FIELD.age)),
    [ARCHIVE_FIELD.direction]: readField(row, LEAD_FIELD.direction),
    [ARCHIVE_FIELD.submitTime]: readField(row, LEAD_FIELD.submitTime),
    [ARCHIVE_FIELD.education]: readField(row, LEAD_FIELD.education),
    [ARCHIVE_FIELD.company]: readField(row, LEAD_FIELD.company),
    [ARCHIVE_FIELD.position]: readField(row, LEAD_FIELD.position),
    [ARCHIVE_FIELD.industry]: readField(row, LEAD_FIELD.industry),
    [ARCHIVE_FIELD.signupSource]: readField(row, LEAD_FIELD.signupSource),
    [ARCHIVE_FIELD.owner]: memberIdValue(row, LEAD_FIELD.owner),
    [ARCHIVE_FIELD.ownerText]: readField(row, LEAD_FIELD.ownerText) || readField(row, LEAD_FIELD.owner),
    [ARCHIVE_FIELD.referrer]: readField(row, LEAD_FIELD.referrer),
    [ARCHIVE_FIELD.intention]: readField(row, LEAD_FIELD.intention),
    [ARCHIVE_FIELD.email]: readField(row, LEAD_FIELD.email),
    [ARCHIVE_FIELD.city]: readField(row, LEAD_FIELD.city),
    [ARCHIVE_FIELD.meetup]: readField(row, LEAD_FIELD.meetup),
    [ARCHIVE_FIELD.signup]: readField(row, LEAD_FIELD.signup),
    [ARCHIVE_FIELD.confirmed]: readField(row, LEAD_FIELD.confirmed),
    [ARCHIVE_FIELD.exam]: readField(row, LEAD_FIELD.exam),
    [ARCHIVE_FIELD.firstContact]: readField(row, LEAD_FIELD.firstContact),
    [ARCHIVE_FIELD.latestContact]: readField(row, LEAD_FIELD.latestContact),
    [ARCHIVE_FIELD.assignTime]: readField(row, LEAD_FIELD.assignTime),
    [ARCHIVE_FIELD.contactReport]: readField(row, LEAD_FIELD.contactReport),
    [ARCHIVE_FIELD.sourceCode]: readField(row, LEAD_FIELD.sourceCode) || readField(row, LEAD_FIELD.code),
    [ARCHIVE_FIELD.status]: "无效"
  });
}

function parseUniqueCreateResult(payload) {
  const data = payload?.data || payload;
  const status = Number(data?.status);
  const ids = data?.data_id || data?.dataId || data?.id;
  return {
    required: true,
    created: status === 1 || (Array.isArray(ids) && ids.length > 0 && status !== 0),
    duplicate: status === 0,
    payload
  };
}

function isInterested(value) {
  const text = String(value || "");
  return text.includes("是") || text.includes("想了解");
}

function isPromoTemplate(value) {
  const text = String(value || "");
  return text === QUESTIONNAIRE_TEMPLATE.promo || text.includes("展架");
}

function shouldCreatePotentialLead(surveyData, options = {}) {
  return isPromoTemplate(options.template) || isInterested(valueOf(surveyData, SURVEY_FIELD.intention));
}

function valueOf(data, key) {
  const value = data?.[key];
  if (value === null || value === undefined) {
    return "";
  }
  return typeof value === "string" ? value.trim() : value;
}

function numberValue(data, key) {
  const value = Number(valueOf(data, key));
  return Number.isFinite(value) ? value : 0;
}

function optionalNumberValue(data, key) {
  const raw = valueOf(data, key);
  if (raw === "" || raw === null || raw === undefined) {
    return "";
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : "";
}

function numberOrEmpty(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : "";
}

function compactData(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

function normalizePhone(value) {
  const text = String(value || "").trim();
  return text.replace(/\D/g, "") || text;
}

function dataIdOf(row) {
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

function memberIdValue(row, key) {
  const value = row?.[key];
  const id = extractComplexId(value);
  if (id) {
    return id;
  }
  const text = readComplexValue(value).trim();
  return text || null;
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

function readField(row, key) {
  return readComplexValue(row?.[key]);
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

function extractObjectArrayByKeys(result, keys) {
  const queue = [result];
  const seen = new Set();
  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || seen.has(current)) {
      continue;
    }
    seen.add(current);
    for (const key of keys) {
      if (Array.isArray(current[key])) {
        return current[key];
      }
    }
    for (const value of Object.values(current)) {
      if (value && typeof value === "object") {
        queue.push(value);
      }
    }
  }
  return [];
}

function normalizeUser(row) {
  const source = row && typeof row === "object" ? row : {};
  const departments = Array.isArray(source.departments)
    ? source.departments.map((dept) => ({
        deptId: String(dept?.dept_id || dept?.deptId || dept?.id || "").trim(),
        name: String(dept?.name || dept?.dept_name || dept?.deptName || "").trim()
      })).filter((dept) => dept.deptId || dept.name)
    : [];
  const userId = String(
    source.user_id ||
    source.userId ||
    source.id ||
    source._id ||
    source.uniqueid ||
    source.uniqueId ||
    ""
  ).trim();
  const name = String(
    source.name ||
    source.user_name ||
    source.userName ||
    source.nickname ||
    source.title ||
    source.account ||
    userId
  ).trim();

  return {
    userId,
    name,
    account: String(source.account || source.username || source.login_name || source.loginName || "").trim(),
    mobile: String(source.mobile || source.phone || source.tel || "").trim(),
    email: String(source.email || "").trim(),
    departments
  };
}

function normalizeDepartment(row) {
  const source = row && typeof row === "object" ? row : {};
  const deptId = String(
    source.dept_id ||
    source.deptId ||
    source.id ||
    source._id ||
    source.value ||
    ""
  ).trim();
  const name = String(
    source.name ||
    source.dept_name ||
    source.deptName ||
    source.label ||
    source.title ||
    deptId
  ).trim();

  return {
    deptId,
    name,
    deptNo: source.dept_no ?? source.deptNo ?? "",
    parentId: String(source.parent_id || source.parentId || "").trim(),
    parentNo: source.parent_no ?? source.parentNo ?? ""
  };
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

function formatDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("-") + " " + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join(":");
}

async function callBaishuyun(url, body, method) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (API_TOKEN) {
    headers.Authorization = API_TOKEN.startsWith("Bearer ")
      ? API_TOKEN
      : `Bearer ${API_TOKEN}`;
  }

  const options = { method, headers };
  if (method !== "GET") {
    options.body = JSON.stringify(body || {});
  }

  const response = await fetch(url, options);
  const text = await response.text();
  let payload;

  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { ok: response.ok, raw: text };
  }

  return {
    status: response.status,
    payload
  };
}

async function serveStatic(pathname, res) {
  const cleanPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.normalize(path.join(FRONTEND_ROOT, cleanPath));
  const relativePath = path.relative(FRONTEND_ROOT, filePath);

  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath) ||
    relativePath.split(path.sep).some((segment) => segment.startsWith("."))
  ) {
    return sendJson(res, 403, { ok: false, message: "禁止访问" });
  }

  try {
    const stat = await fsp.stat(filePath);
    if (!stat.isFile()) {
      return sendJson(res, 404, { ok: false, message: "文件不存在" });
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    fs.createReadStream(filePath).pipe(res);
  } catch {
    sendJson(res, 404, { ok: false, message: "文件不存在" });
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024 * 2) {
        reject(new Error("请求体过大"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("请求 JSON 格式错误"));
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function loadEnv() {
    const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed
      .slice(equalIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
