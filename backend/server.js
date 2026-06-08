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
const SURVEY_SUBMIT_QUEUE_PATH =
  process.env.SURVEY_SUBMIT_QUEUE_PATH || path.join(__dirname, "data", "survey-submit-queue.json");
const SURVEY_SUBMIT_WORKER_INTERVAL_MS = Number(process.env.SURVEY_SUBMIT_WORKER_INTERVAL_MS || 15000);
const SURVEY_SUBMIT_MAX_ATTEMPTS = Number(process.env.SURVEY_SUBMIT_MAX_ATTEMPTS || 5);
const SMS_SCHEDULE_INTERVAL_MS = Number(process.env.SMS_SCHEDULE_INTERVAL_MS || 30000);
const SMS_STATE = loadSmsStore();
const SURVEY_SUBMIT_STATE = loadSurveySubmitStore();
let smsSchedulerBusy = false;
let surveySubmitWorkerBusy = false;
let surveySubmitStoreSaveChain = Promise.resolve();

const SURVEY_BASE_URL =
  process.env.SURVEY_BASE_URL ||
  "https://ahyg.online-office.net/f/bcb94724bf17b511adc1a348";

const ACTIVITY_FIELD = {
  code: "_widget_1771903125126",
  name: "_widget_1771903125107",
  template: "_widget_1779761373894",
  directionPreset: "_widget_1779860682092",
  idCardFieldStatus: "_widget_1780717506143",
  phoneFieldStatus: "_widget_1780717506170",
  submitter: "_widget_1779937943910",
  qrStatus: "_widget_1779946717564"
};

const QR_STATUS = {
  enabled: "启用",
  disabled: "停用"
};

const DIRECTION_PRESET_FIELD = {
  projectType: "_widget_1779853660697",
  direction: "_widget_1779852433252",
  sort: "_widget_1780469479044"
};

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
  referrer: "_widget_1778652079634",
  intention: "_widget_1778461489280",
  projectType: "_widget_1779757330297",
  direction: "_widget_1778652681060",
  highestDegree: "_widget_1780286044479",
  degreeTime: "_widget_1780286044498",
  classLocation: "_widget_1780286044570",
  workYears: "_widget_1780291905950",
  companyNature: "_widget_1780291906054",
  industry: "_widget_1780291906073",
  companyAssets: "_widget_1780291906092",
  companyScale: "_widget_1780291906167",
  employeeCount: "_widget_1780291906212",
  listed: "_widget_1780291906233",
  stockCode: "_widget_1780291906405",
  jobTitle: "_widget_1780291906442",
  responsibility: "_widget_1780291906461",
  subordinateCount: "_widget_1780291906498",
  origin: "_widget_1780286044617",
  concern: "_widget_1778461489343",
  managementIssue: "_widget_1780291906576",
  applicationGoal: "_widget_1780291906609",
  supplement: "_widget_1780291906626",
  declaration: "_widget_1779159082213",
  meetup: "_widget_1780452817169",
  visitLab: "_widget_1780452817190",
  visitHistory: "_widget_1780452817237",
  visitQuantum: "_widget_1780643491263",
  sourceCode: "_widget_1778461489795"
};

const QUESTIONNAIRE_TEMPLATE = {
  lecture: "活动讲座模版",
  promo: "展架等宣传品通用模版",
  experience: "MBA-EMBA报考咨询表(体验营用)",
  suzhouExperienceDay: "苏州-EMBA/MBA 体验日",
  hefeiExperienceDay: "合肥-EMBA/MBA 体验日",
  shanghaiExperienceDay: "上海-EMBA/MBA体验日"
};

const QUESTIONNAIRE_FIELD_STATUS = {
  hidden: "隐藏",
  optional: "显示（选填）",
  required: "显示（必填）"
};

const QUESTIONNAIRE_FIELD_STATUS_OPTIONS = Object.values(QUESTIONNAIRE_FIELD_STATUS);

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

const PERMISSION_FIELD = {
  group: {
    code: "_widget_1779845603057",
    name: "_widget_1779795340481",
    status: "_widget_1779795340558"
  },
  member: {
    groupCode: "_widget_1779795662942",
    objectType: "_widget_1779795663070",
    member: "_widget_1779795663099",
    department: "_widget_1779795663118",
    status: "_widget_1779795340558"
  },
  module: {
    groupCode: "_widget_1779795662942",
    moduleCode: "_widget_1779795663070",
    moduleName: "_widget_1779795980532",
    operations: "_widget_1779795980551",
    dataScope: "_widget_1779795980607",
    defaultVisible: "_widget_1779795980762",
    defaultEditable: "_widget_1779795980783",
    status: "_widget_1779795340558"
  },
  field: {
    groupCode: "_widget_1779795662942",
    moduleCode: "_widget_1779795663070",
    fieldName: "_widget_1779795980532",
    fieldAlias: "_widget_1779796546984",
    visible: "_widget_1779795980762",
    editable: "_widget_1779795980783",
    status: "_widget_1779795340558"
  }
};

const DATA_SCOPE_RANK = {
  "无权限": 0,
  "本人数据": 1,
  "自己数据": 1,
  "仅本人": 1,
  "本部门": 2,
  "所在部门": 2,
  "本部门及下级": 3,
  "本部门及下级部门": 3,
  "全部数据": 4,
  "全部": 4
};

const AI_DATA_LIMIT = Number(process.env.AI_DATA_LIMIT || 1500);

const AI_FIELD = {
  activity: {
    code: "_widget_1771903125126",
    name: "_widget_1771903125107",
    type: "_widget_1771903125403",
    start: "_widget_1771903125195",
    end: "_widget_1771903125609",
    dept: "_widget_1771903125451",
    count: "_widget_1772249483639",
    template: "_widget_1779761373894",
    submitter: "_widget_1779937943910",
    qrStatus: "_widget_1779946717564"
  },
  student: STUDENT_FIELD,
  lead: LEAD_FIELD,
  followUp: FOLLOWUP_FIELD
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
  },
  directionPreset: {
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/6b3b474c90bd9129f0994e99/data"
  },
  activityType: {
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/e8b74db4ad8a059af07b2d17/data"
  },
  permissionGroup: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/b0be4d3f9b6f7054f6ad1986/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/b0be4d3f9b6f7054f6ad1986/data",
    update:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/b0be4d3f9b6f7054f6ad1986/data_update",
    delete:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/b0be4d3f9b6f7054f6ad1986/data_delete",
    count:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/b0be4d3f9b6f7054f6ad1986/data_count"
  },
  permissionMember: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/403e4c529584d3c67b4a8d55/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/403e4c529584d3c67b4a8d55/data",
    update:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/403e4c529584d3c67b4a8d55/data_update",
    delete:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/403e4c529584d3c67b4a8d55/data_delete",
    count:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/403e4c529584d3c67b4a8d55/data_count"
  },
  modulePermission: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/dc0a4652ae9f07e4f25144a0/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/dc0a4652ae9f07e4f25144a0/data",
    update:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/dc0a4652ae9f07e4f25144a0/data_update",
    delete:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/dc0a4652ae9f07e4f25144a0/data_delete",
    count:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/dc0a4652ae9f07e4f25144a0/data_count"
  },
  fieldPermission: {
    create:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/31ee4bb3a58e1ab39f37331c/data_create",
    list:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/31ee4bb3a58e1ab39f37331c/data",
    update:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/31ee4bb3a58e1ab39f37331c/data_update",
    delete:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/31ee4bb3a58e1ab39f37331c/data_delete",
    count:
      "https://ahyg.online-office.net/openapi/v1/app/565b30c4d788e66f3404ea50/entry/31ee4bb3a58e1ab39f37331c/data_count"
  }
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

    if (pathname === "/api/current-member" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await resolveCurrentMember(body);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/permissions/me" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await getCurrentPermissionProfile(body);
      return sendJson(res, 200, result);
    }

    if (pathname === "/api/ai/chat" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await handleAiChat(body);
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

    if (pathname === "/api/activity/survey-config" && req.method === "POST") {
      if (!API_TOKEN) {
        return sendJson(res, 401, {
          ok: false,
          message: "后端已启动，但未配置 BS_API_KEY"
        });
      }

      const body = await readJson(req);
      const result = await getActivitySurveyConfig(body);
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
        const result = await acceptSurveySubmit(body);
        return sendJson(res, 200, result);
      }
      if ((pathname === "/api/activity/create" || pathname === "/api/activity/update") && req.method === "POST") {
        normalizeActivityPayload(body, {
          defaultQrStatus: pathname === "/api/activity/create"
        });
        if (pathname === "/api/activity/create") {
          await attachActivitySubmitter(body);
        }
        stripActivityPayloadMeta(body);
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
startSurveySubmitWorker();
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
    "/api/follow-up/list": { url: ENDPOINTS.followUp.list },
    "/api/direction-presets/list": { url: ENDPOINTS.directionPreset.list },
    "/api/activity-types/list": { url: ENDPOINTS.activityType.list },
    "/api/permission-groups/create": { url: ENDPOINTS.permissionGroup.create },
    "/api/permission-groups/list": { url: ENDPOINTS.permissionGroup.list },
    "/api/permission-groups/update": { url: ENDPOINTS.permissionGroup.update },
    "/api/permission-groups/delete": { url: ENDPOINTS.permissionGroup.delete },
    "/api/permission-groups/count": { url: ENDPOINTS.permissionGroup.count },
    "/api/permission-members/create": { url: ENDPOINTS.permissionMember.create },
    "/api/permission-members/list": { url: ENDPOINTS.permissionMember.list },
    "/api/permission-members/update": { url: ENDPOINTS.permissionMember.update },
    "/api/permission-members/delete": { url: ENDPOINTS.permissionMember.delete },
    "/api/permission-members/count": { url: ENDPOINTS.permissionMember.count },
    "/api/module-permissions/create": { url: ENDPOINTS.modulePermission.create },
    "/api/module-permissions/list": { url: ENDPOINTS.modulePermission.list },
    "/api/module-permissions/update": { url: ENDPOINTS.modulePermission.update },
    "/api/module-permissions/delete": { url: ENDPOINTS.modulePermission.delete },
    "/api/module-permissions/count": { url: ENDPOINTS.modulePermission.count },
    "/api/field-permissions/create": { url: ENDPOINTS.fieldPermission.create },
    "/api/field-permissions/list": { url: ENDPOINTS.fieldPermission.list },
    "/api/field-permissions/update": { url: ENDPOINTS.fieldPermission.update },
    "/api/field-permissions/delete": { url: ENDPOINTS.fieldPermission.delete },
    "/api/field-permissions/count": { url: ENDPOINTS.fieldPermission.count }
  };

  return routes[pathname];
}

function normalizeActivityPayload(body, options = {}) {
  const data = body?.data;
  if (!data || typeof data !== "object") {
    return;
  }
  if (Object.prototype.hasOwnProperty.call(data, ACTIVITY_FIELD.directionPreset)) {
    data[ACTIVITY_FIELD.directionPreset] = normalizeDirectionPresetValue(data[ACTIVITY_FIELD.directionPreset]);
  }
  const template = readComplexValue(data[ACTIVITY_FIELD.template]) || QUESTIONNAIRE_TEMPLATE.lecture;
  const defaults = defaultQuestionnaireFieldStatuses(template);
  if (Object.prototype.hasOwnProperty.call(data, ACTIVITY_FIELD.phoneFieldStatus)) {
    data[ACTIVITY_FIELD.phoneFieldStatus] = normalizeQuestionnaireFieldStatus(data[ACTIVITY_FIELD.phoneFieldStatus], defaults.phone);
  }
  if (Object.prototype.hasOwnProperty.call(data, ACTIVITY_FIELD.idCardFieldStatus)) {
    data[ACTIVITY_FIELD.idCardFieldStatus] = normalizeQuestionnaireFieldStatus(data[ACTIVITY_FIELD.idCardFieldStatus], defaults.idCard);
  }
  if (options.defaultQrStatus && !readComplexValue(data[ACTIVITY_FIELD.qrStatus]).trim()) {
    data[ACTIVITY_FIELD.qrStatus] = QR_STATUS.enabled;
  }
}

async function attachActivitySubmitter(body = {}) {
  const data = body?.data;
  if (!data || typeof data !== "object" || data[ACTIVITY_FIELD.submitter]) {
    return;
  }

  const currentPayload = {
    ...(body.current || {}),
    ...(body.context || {}),
    ...(body.currentMember || {}),
    url: body.url || body.href || body.pageUrl || body.current?.url || body.current?.href || body.current?.pageUrl || ""
  };
  const source = normalizeCurrentMemberSource(currentPayload);
  const hasSource = Object.values(source).some((value) => String(value || "").trim());
  if (!hasSource) {
    return;
  }

  try {
    const current = await resolveCurrentMember(currentPayload);
    const member = current.member || {};
    const userId = String(member.userId || member.uniqueId || member.corpUserId || "").trim();
    if (userId) {
      data[ACTIVITY_FIELD.submitter] = userId;
    }
  } catch (error) {
    console.warn("Resolve activity submitter failed:", error.message);
  }
}

function stripActivityPayloadMeta(body = {}) {
  delete body.current;
  delete body.context;
  delete body.currentMember;
  delete body.query;
  delete body.params;
  delete body.url;
  delete body.href;
  delete body.location;
  delete body.pageUrl;
}

function normalizeDirectionPresetValue(value) {
  if (value === null || value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return uniqueTextValues(value.flatMap(normalizeDirectionPresetValue));
  }
  if (typeof value === "object") {
    return normalizeDirectionPresetValue(readComplexValue(value));
  }
  return uniqueTextValues(
    String(value)
      .split(/[；;,，、\n]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

async function acceptSurveySubmit(body = {}) {
  const surveyData = body?.data && typeof body.data === "object" ? body.data : {};
  const activityRow = await ensureSurveyQrEnabled(surveyData);
  const template = body.template || body.questionnaireTemplate || readField(activityRow, ACTIVITY_FIELD.template) || "";
  const phoneFieldStatus = questionnairePhoneStatus(activityRow, template);
  const idCardFieldStatus = questionnaireIdCardStatus(activityRow, template);
  validateSurveySubmitData(surveyData, {
    template,
    activityRow,
    phoneFieldStatus,
    idCardFieldStatus
  });

  const createdAt = new Date().toISOString();
  const job = {
    id: createId("surveyjob"),
    status: "pending",
    attempts: 0,
    data: surveyData,
    options: {
      template,
      phoneFieldStatus,
      idCardFieldStatus
    },
    createdAt,
    updatedAt: createdAt,
    lastError: ""
  };

  SURVEY_SUBMIT_STATE.jobs.push(job);
  pruneSurveySubmitStore();
  await saveSurveySubmitStore();
  scheduleSurveySubmitWorker();

  return {
    ok: true,
    accepted: true,
    jobId: job.id,
    message: "提交成功"
  };
}

function validateSurveySubmitData(surveyData, options = {}) {
  const phone = normalizePhone(valueOf(surveyData, SURVEY_FIELD.phone));
  const idCard = valueOf(surveyData, SURVEY_FIELD.idCard);
  const name = valueOf(surveyData, SURVEY_FIELD.personName);
  const template = options.template || readField(options.activityRow, ACTIVITY_FIELD.template) || QUESTIONNAIRE_TEMPLATE.lecture;
  const phoneStatus = normalizeQuestionnaireFieldStatus(options.phoneFieldStatus, questionnairePhoneStatus(options.activityRow, template));
  const idCardStatus = normalizeQuestionnaireFieldStatus(options.idCardFieldStatus, questionnaireIdCardStatus(options.activityRow, template));
  if (!name) {
    throw new Error("请填写姓名");
  }
  if (phoneStatus === QUESTIONNAIRE_FIELD_STATUS.required && !phone) {
    throw new Error("请填写手机号");
  }
  if (idCardStatus === QUESTIONNAIRE_FIELD_STATUS.required && !idCard) {
    throw new Error("请填写身份证号");
  }
}

async function getActivitySurveyConfig(body = {}) {
  const sourceCode = firstText(body, [
    ACTIVITY_FIELD.code,
    SURVEY_FIELD.sourceCode,
    "sourceCode",
    "activityCode",
    "code"
  ]);
  if (!sourceCode) {
    throw new Error("缺少活动编号");
  }

  const row = await findActivityByCode(sourceCode);
  if (!row) {
    throw new Error("未找到对应活动");
  }
  const qrStatus = activityQrStatus(row);
  const qrEnabled = qrStatus !== QR_STATUS.disabled;
  if (!qrEnabled) {
    return {
      ok: true,
      activity: {
        sourceCode,
        activityName: readField(row, ACTIVITY_FIELD.name),
        qrStatus,
        qrEnabled: false,
        invalidMessage: "该活动二维码已停用"
      }
    };
  }

  const directionPreset = normalizeDirectionPresetValue(row[ACTIVITY_FIELD.directionPreset]);
  const directionPresetItems = await activityDirectionPresetItems(directionPreset);

  return {
    ok: true,
    activity: {
      sourceCode,
      activityName: readField(row, ACTIVITY_FIELD.name),
      template: readField(row, ACTIVITY_FIELD.template) || QUESTIONNAIRE_TEMPLATE.lecture,
      directionPreset,
      directionPresetItems,
      phoneFieldStatus: questionnairePhoneStatus(row),
      idCardFieldStatus: questionnaireIdCardStatus(row),
      qrStatus,
      qrEnabled: true
    }
  };
}

async function ensureSurveyQrEnabled(surveyData = {}) {
  const sourceCode = firstText(surveyData, [
    SURVEY_FIELD.sourceCode,
    ACTIVITY_FIELD.code,
    "sourceCode",
    "activityCode",
    "code"
  ]);
  if (!sourceCode) {
    return;
  }

  const row = await findActivityByCode(sourceCode);
  if (!row) {
    throw new Error("二维码无效或活动不存在");
  }
  if (activityQrStatus(row) === QR_STATUS.disabled) {
    throw new Error("二维码已停用");
  }
  return row;
}

function activityQrStatus(row = {}) {
  const text = readField(row, ACTIVITY_FIELD.qrStatus).trim();
  if (!text) {
    return QR_STATUS.enabled;
  }
  return isDisabledQrStatusText(text) ? QR_STATUS.disabled : QR_STATUS.enabled;
}

function isDisabledQrStatusText(text) {
  return ["停用", "已停用", "禁用", "关闭", "disabled", "disable", "off"].includes(String(text || "").trim().toLowerCase());
}

async function activityDirectionPresetItems(directionNames = []) {
  const names = uniqueTextValues(directionNames);
  if (!names.length) {
    return [];
  }

  try {
    const rows = await fetchAllBaishuyunRows(ENDPOINTS.directionPreset.list, {
      limit: 300,
      maxPages: 20
    });
    const directionMap = new Map();
    rows.forEach((row) => {
      const direction = readField(row, DIRECTION_PRESET_FIELD.direction);
      if (!direction || directionMap.has(direction)) {
        return;
      }
      directionMap.set(direction, {
        projectType: readField(row, DIRECTION_PRESET_FIELD.projectType),
        sort: readField(row, DIRECTION_PRESET_FIELD.sort)
      });
    });
    return names.map((name) => ({
      name,
      projectType: directionMap.get(name)?.projectType || "",
      sort: directionMap.get(name)?.sort || ""
    }));
  } catch {
    return names.map((name) => ({
      name,
      projectType: "",
      sort: ""
    }));
  }
}

async function findActivityByCode(sourceCode) {
  const normalizedCode = String(sourceCode || "").trim();
  const pageSize = 100;
  let page = 1;
  let seen = 0;
  let total = 0;
  const pageSignatures = new Set();

  while (page <= 50) {
    const payload = await callBaishuyunOrThrow(ENDPOINTS.activity.list, {
      page,
      limit: pageSize,
      skip: (page - 1) * pageSize
    });
    const rows = extractRows(payload);
    const signature = rows.map(dataIdOf).filter(Boolean).join("|");
    if (signature && pageSignatures.has(signature)) {
      break;
    }
    if (signature) {
      pageSignatures.add(signature);
    }
    const matched = rows.find((row) => readField(row, ACTIVITY_FIELD.code) === normalizedCode);
    if (matched) {
      return matched;
    }

    total = total || extractTotal(payload, 0);
    seen += rows.length;
    if (rows.length < pageSize || (total && seen >= total)) {
      break;
    }
    page += 1;
  }

  return null;
}

async function submitSurveyCascade(surveyData, options = {}) {
  const phone = normalizePhone(valueOf(surveyData, SURVEY_FIELD.phone));
  const name = valueOf(surveyData, SURVEY_FIELD.personName);
  const phoneStatus = normalizeQuestionnaireFieldStatus(options.phoneFieldStatus, QUESTIONNAIRE_FIELD_STATUS.required);
  if (!name) {
    throw new Error("请填写姓名");
  }
  if (phoneStatus === QUESTIONNAIRE_FIELD_STATUS.required && !phone) {
    throw new Error("请填写手机号");
  }

  const [surveyResult, priorRows] = await Promise.all([
    callBaishuyunOrThrow(ENDPOINTS.survey.create, {
      data: surveyData
    }),
    phone ? findActivityStudentsByPhone(phone) : Promise.resolve([])
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
  const leadResultPromise = phone && shouldCreatePotentialLead(surveyData, options)
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

async function resolveCurrentMember(body = {}) {
  const source = normalizeCurrentMemberSource(body);
  const result = await getUserList();
  const match = findCurrentMember(result.users, source);
  const fallback = buildCurrentMemberFallback(source);
  const member = match.user || fallback;

  return {
    ok: Boolean(match.user || fallback.userId || fallback.name || fallback.account || fallback.mobile || fallback.email),
    matched: Boolean(match.user),
    matchedBy: match.matchedBy || "",
    source,
    member
  };
}

async function getCurrentPermissionProfile(body = {}) {
  const current = await resolveCurrentMember(body);
  if (!current.member?.userId && !current.member?.name && !current.member?.account) {
    return {
      ok: false,
      matched: false,
      message: "未获取到当前登录人参数",
      source: current.source,
      member: current.member,
      groups: [],
      modules: {},
      fields: {}
    };
  }

  const [groupRows, memberRows, moduleRows, fieldRows] = await Promise.all([
    fetchAllBaishuyunRows(ENDPOINTS.permissionGroup.list),
    fetchAllBaishuyunRows(ENDPOINTS.permissionMember.list),
    fetchAllBaishuyunRows(ENDPOINTS.modulePermission.list),
    fetchAllBaishuyunRows(ENDPOINTS.fieldPermission.list)
  ]);
  const activeGroups = normalizePermissionGroups(groupRows);
  const groupCodes = resolveMemberGroupCodes(memberRows, activeGroups, current.member);
  const modules = buildModulePermissionProfile(moduleRows, groupCodes);
  const fields = buildFieldPermissionProfile(fieldRows, groupCodes, modules);

  return {
    ok: true,
    matched: current.matched,
    matchedBy: current.matchedBy,
    source: current.source,
    member: current.member,
    groups: groupCodes.map((code) => activeGroups.get(code) || { code, name: code }),
    modules,
    fields,
    totals: {
      groups: groupRows.length,
      members: memberRows.length,
      modules: moduleRows.length,
      fields: fieldRows.length
    }
  };
}

async function handleAiChat(body = {}) {
  const question = String(body.message || body.question || "").trim();
  if (!question) {
    throw new Error("请输入需要询问的问题");
  }
  if (question.length > 1000) {
    throw new Error("问题内容不能超过 1000 个字");
  }

  const currentPayload = {
    ...(body.current || {}),
    ...(body.context || {}),
    ...(body.query || {}),
    url: body.url || body.href || body.pageUrl || body.current?.url || ""
  };
  const current = await resolveCurrentMember(currentPayload);
  const intent = resolveAiQuestionIntent(question);
  const data = await loadAiDataForIntent(intent);
  const answer = buildAiAnswer(question, intent, data, current.member);

  return {
    ok: true,
    mode: "read_only_mvp",
    engine: "crm-insight-tools",
    question,
    currentMember: current.member,
    matchedBy: current.matchedBy,
    intent,
    answer: answer.text,
    cards: answer.cards,
    tables: answer.tables,
    suggestions: answer.suggestions,
    warnings: answer.warnings,
    dataLoaded: Object.fromEntries(
      Object.entries(data.rawCounts).map(([key, value]) => [key, value])
    ),
    note: "当前版本为只读问数助手，不会新增、修改或删除任何百数云数据。"
  };
}

function resolveAiQuestionIntent(question) {
  const text = String(question || "");
  const wantsOverview = /概览|总览|整体|汇总|大盘|看板|全部/.test(text);
  const wantsActivity = wantsOverview || /活动|讲座|直播|沙龙|体验营|二维码/.test(text);
  const wantsStudent = wantsOverview || /报名|学员|问卷|扫码|重复|来源|学历/.test(text);
  const wantsLead = wantsOverview || /潜在|考生|线索|客户|分配|对接|入学|归档|状态|转化/.test(text);
  const wantsFollowUp = wantsOverview || /跟进|联系|沟通|回访|超期|逾期|下次/.test(text);

  return {
    overview: wantsOverview || (!wantsActivity && !wantsStudent && !wantsLead && !wantsFollowUp),
    activity: wantsActivity,
    student: wantsStudent,
    lead: wantsLead,
    followUp: wantsFollowUp,
    timeRange: resolveQuestionTimeRange(text),
    filters: resolveAiQuestionFilters(text),
    asksTop: /最多|最高|排名|排行|TOP|top|第一/.test(text),
    asksCount: /多少|几个|几条|数量|总数|人数|数\b|count/i.test(text),
    asksTrend: /趋势|增长|下降|变化|同比|环比|最近|近/.test(text),
    asksRisk: /风险|异常|预警|提醒|超期|逾期|重复/.test(text)
  };
}

function resolveAiQuestionFilters(text) {
  return {
    ownerName: extractAiOwnerName(text),
    status: extractAiLeadStatus(text),
    unassigned: /未分配|没有分配|无对接人|未设置对接人|对接人为空/.test(text),
    selfOwner: /我负责|我的线索|我的潜在|我对接|分给我|我名下/.test(text)
  };
}

function extractAiOwnerName(text) {
  const patterns = [
    /对接人(?:为|是|=|：|:)?\s*([\u4e00-\u9fa5A-Za-z0-9_.-]{2,20})/,
    /负责人(?:为|是|=|：|:)?\s*([\u4e00-\u9fa5A-Za-z0-9_.-]{2,20})/,
    /([\u4e00-\u9fa5A-Za-z0-9_.-]{2,20})负责的(?:潜在考生|线索|客户|考生)/,
    /([\u4e00-\u9fa5A-Za-z0-9_.-]{2,20})(?:名下|对接)的(?:潜在考生|线索|客户|考生)/
  ];
  for (const pattern of patterns) {
    const match = String(text || "").match(pattern);
    if (match?.[1]) {
      return cleanAiFilterText(match[1]);
    }
  }
  return "";
}

function extractAiLeadStatus(text) {
  const statuses = ["新线索", "已分配", "跟进中", "已报考", "无效", "未填写"];
  return statuses.find((status) => String(text || "").includes(status)) || "";
}

function cleanAiFilterText(value) {
  return String(value || "")
    .replace(/的?(?:潜在考生|线索|客户|考生|数量|总数|人数|数|有多少|多少|几个|几条).*$/, "")
    .replace(/[，。！？、\s]+$/g, "")
    .trim();
}

function resolveQuestionTimeRange(text) {
  const now = new Date();
  const today = startOfLocalDay(now);
  if (/今天|今日/.test(text)) {
    return { label: "今天", start: today, end: addDays(today, 1) };
  }
  if (/昨天|昨日/.test(text)) {
    return { label: "昨天", start: addDays(today, -1), end: today };
  }
  if (/本周|这周|本星期/.test(text)) {
    const day = today.getDay() || 7;
    const start = addDays(today, 1 - day);
    return { label: "本周", start, end: addDays(start, 7) };
  }
  if (/上周|上星期/.test(text)) {
    const day = today.getDay() || 7;
    const start = addDays(today, 1 - day - 7);
    return { label: "上周", start, end: addDays(start, 7) };
  }
  if (/本月|这个月/.test(text)) {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { label: "本月", start, end: new Date(today.getFullYear(), today.getMonth() + 1, 1) };
  }
  if (/上月|上个月/.test(text)) {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return { label: "上月", start, end: new Date(today.getFullYear(), today.getMonth(), 1) };
  }

  const recentMatch = text.match(/近\s*(\d+)\s*(天|日|周|月)/);
  if (recentMatch) {
    const amount = Math.min(Math.max(Number(recentMatch[1] || 7), 1), 180);
    const unit = recentMatch[2];
    const days = unit === "月" ? amount * 30 : unit === "周" ? amount * 7 : amount;
    return { label: `近${amount}${unit}`, start: addDays(today, -days + 1), end: addDays(today, 1) };
  }

  return { label: "全部数据", start: null, end: null };
}

async function loadAiDataForIntent(intent) {
  const tasks = {};
  if (intent.activity || intent.overview) {
    tasks.activities = fetchAllBaishuyunRows(ENDPOINTS.activity.list, {
      limit: 100,
      maxPages: Math.ceil(AI_DATA_LIMIT / 100)
    });
  }
  if (intent.student || intent.overview) {
    tasks.students = fetchAllBaishuyunRows(ENDPOINTS.activityStudent.list, {
      limit: 100,
      maxPages: Math.ceil(AI_DATA_LIMIT / 100)
    });
  }
  if (intent.lead || intent.overview) {
    tasks.leads = fetchAllBaishuyunRows(ENDPOINTS.lead.list, {
      limit: 100,
      maxPages: Math.ceil(AI_DATA_LIMIT / 100)
    });
  }
  if (intent.followUp || intent.overview) {
    tasks.followUps = fetchAllBaishuyunRows(ENDPOINTS.followUp.list, {
      limit: 100,
      maxPages: Math.ceil(AI_DATA_LIMIT / 100)
    });
  }

  const entries = await Promise.all(
    Object.entries(tasks).map(async ([key, promise]) => [key, await promise])
  );
  const raw = Object.fromEntries(entries);

  const activities = (raw.activities || []).map(normalizeAiActivity);
  const students = (raw.students || []).map(normalizeAiStudent);
  const leads = (raw.leads || []).map(normalizeAiLead);
  const followUps = (raw.followUps || []).map(normalizeAiFollowUp);

  return {
    activities,
    students,
    leads,
    followUps,
    rawCounts: {
      activities: activities.length,
      students: students.length,
      leads: leads.length,
      followUps: followUps.length
    }
  };
}

function buildAiAnswer(question, intent, data, currentMember = {}) {
  const range = intent.timeRange;
  const activities = filterAiByDateRange(data.activities, range, (item) => item.createTime || item.startDate);
  const students = filterAiByDateRange(data.students, range, (item) => item.createTime);
  const leads = filterAiByDateRange(data.leads, range, (item) => item.submitTime || item.createTime);
  const followUps = filterAiByDateRange(data.followUps, range, (item) => item.contactTime || item.createTime);
  const activityNameByCode = new Map(
    data.activities
      .filter((item) => item.code && item.name)
      .map((item) => [item.code, item.name])
  );
  const cards = [];
  const tables = [];
  const suggestions = [];
  const warnings = [];
  const parts = [];

  if (intent.overview || intent.activity) {
    const activeActivities = activities.filter((item) => item.qrStatus !== QR_STATUS.disabled);
    cards.push(
      createAiCard("活动数", activities.length, `${range.label}内活动记录`),
      createAiCard("启用二维码", activeActivities.length, "二维码未停用的活动")
    );
    const activityRows = topEntries(groupCount(students, (item) => {
      if (item.sourceCode && activityNameByCode.has(item.sourceCode)) {
        return `${activityNameByCode.get(item.sourceCode)}（${item.sourceCode}）`;
      }
      return item.activityName || item.sourceCode || "未关联活动";
    }), 8);
    if (activityRows.length) {
      tables.push({
        title: "活动报名排行",
        columns: ["活动/来源", "报名人数"],
        rows: activityRows.map((item) => [item.label, item.count])
      });
    }
    parts.push(`${range.label}活动记录 ${activities.length} 条，活动学员记录 ${students.length} 条。`);
    if (activityRows[0]) {
      parts.push(`报名量最高的是「${activityRows[0].label}」，共 ${activityRows[0].count} 人。`);
    }
  }

  if (intent.overview || intent.student) {
    const duplicateStudents = students.filter((item) => Number(item.repeatCount) > 1);
    cards.push(
      createAiCard("报名/问卷", students.length, `${range.label}内学员提交`),
      createAiCard("重复报名", duplicateStudents.length, "重复次数大于 1")
    );
    const sourceRows = topEntries(groupCount(students, (item) => item.signupSource || "未填写"), 6);
    if (sourceRows.length) {
      tables.push({
        title: "报名来源分布",
        columns: ["来源", "人数"],
        rows: sourceRows.map((item) => [item.label, item.count])
      });
    }
    if (duplicateStudents.length) {
      warnings.push(`发现 ${duplicateStudents.length} 条重复报名记录，建议重点核对手机号和来源活动。`);
    }
  }

  if (intent.overview || intent.lead) {
    const leadAnalysis = analyzeAiLeads(leads, intent, currentMember);
    const scopedLeads = leadAnalysis.rows;
    const statusRows = topEntries(groupCount(scopedLeads, (item) => item.status || "未填写"), 10);
    const unassignedCount = scopedLeads.filter(isAiLeadUnassigned).length;
    cards.push(
      createAiCard("潜在考生", scopedLeads.length, leadAnalysis.scopeLabel || `${range.label}内线索记录`),
      createAiCard("未分配线索", unassignedCount, "对接人为空")
    );
    if (leadAnalysis.hasSpecificFilter || intent.asksCount) {
      parts.push(`${leadAnalysis.scopeLabel || range.label}潜在考生/线索共 ${scopedLeads.length} 条。`);
    }
    if (statusRows.length) {
      tables.push({
        title: leadAnalysis.hasSpecificFilter ? "筛选后线索状态分布" : "线索状态分布",
        columns: ["状态", "数量"],
        rows: statusRows.map((item) => [item.label, item.count])
      });
    }
    if (leadAnalysis.hasSpecificFilter && scopedLeads.length) {
      tables.push({
        title: "匹配线索示例",
        columns: ["线索编号", "姓名", "对接人", "状态", "提交时间"],
        rows: scopedLeads.slice(0, 8).map((item) => [
          item.code || "-",
          item.personName || "-",
          displayAiLeadOwner(item) || "-",
          item.status || "未填写",
          item.submitTime || item.createTime || "-"
        ])
      });
    }
    if (unassignedCount > 0) {
      warnings.push(`当前范围内有 ${unassignedCount} 条潜在考生未分配对接人。`);
      suggestions.push("可在潜在考生管理中批量分配对接人，并将线索状态置为已分配。");
    }
  }

  if (intent.overview || intent.followUp) {
    const todayStart = startOfLocalDay(new Date());
    const overdue = data.followUps.filter((item) => {
      const nextTime = parseAiDate(item.nextTime);
      return nextTime && nextTime < todayStart;
    });
    const methodRows = topEntries(groupCount(followUps, (item) => item.method || "未填写"), 6);
    cards.push(
      createAiCard("跟进记录", followUps.length, `${range.label}内沟通记录`),
      createAiCard("跟进超期", overdue.length, "下次跟进时间早于今天")
    );
    if (methodRows.length) {
      tables.push({
        title: "跟进方式分布",
        columns: ["跟进方式", "次数"],
        rows: methodRows.map((item) => [item.label, item.count])
      });
    }
    if (overdue.length) {
      warnings.push(`共有 ${overdue.length} 条跟进记录已超过下次跟进时间，建议优先处理。`);
    }
  }

  if (intent.asksTrend) {
    const weeklyStudents = buildRecentDailySeries(data.students, (item) => item.createTime, 14);
    const recentTotal = weeklyStudents.slice(-7).reduce((sum, item) => sum + item.count, 0);
    const priorTotal = weeklyStudents.slice(0, 7).reduce((sum, item) => sum + item.count, 0);
    const delta = priorTotal ? Math.round(((recentTotal - priorTotal) / priorTotal) * 100) : null;
    parts.push(delta === null
      ? `近 7 天报名 ${recentTotal} 条，上一周期暂无可比数据。`
      : `近 7 天报名 ${recentTotal} 条，较前 7 天${delta >= 0 ? "增长" : "下降"} ${Math.abs(delta)}%。`);
    tables.push({
      title: "近 14 天报名趋势",
      columns: ["日期", "报名数"],
      rows: weeklyStudents.map((item) => [item.date, item.count])
    });
  }

  if (!parts.length) {
    parts.push("我已读取当前 CRM 数据，可以继续追问活动报名、潜在考生、线索分配、跟进超期、重复报名等问题。");
  }

  if (!suggestions.length) {
    suggestions.push("可以继续问：本周哪个活动报名最多？有哪些线索未分配？哪些跟进已经超期？");
  }

  return {
    text: parts.join("\n"),
    cards: dedupeAiCards(cards).slice(0, 8),
    tables: tables.slice(0, 4),
    suggestions: uniqueTextValues(suggestions).slice(0, 5),
    warnings: uniqueTextValues(warnings).slice(0, 5)
  };
}

function analyzeAiLeads(leads, intent, currentMember = {}) {
  const filters = intent.filters || {};
  const ownerName = filters.selfOwner
    ? String(currentMember?.name || "").trim()
    : String(filters.ownerName || "").trim();
  let rows = leads;
  const scopeParts = [];

  if (ownerName) {
    rows = rows.filter((item) => aiLeadMatchesOwner(item, ownerName, currentMember));
    scopeParts.push(`对接人「${ownerName}」`);
  }
  if (filters.unassigned) {
    rows = rows.filter(isAiLeadUnassigned);
    scopeParts.push("未分配");
  }
  if (filters.status) {
    rows = rows.filter((item) => normalizeAiText(item.status || "未填写") === normalizeAiText(filters.status));
    scopeParts.push(`状态「${filters.status}」`);
  }

  return {
    rows,
    ownerName,
    hasSpecificFilter: Boolean(ownerName || filters.unassigned || filters.status),
    scopeLabel: scopeParts.length ? `${scopeParts.join("、")}的` : ""
  };
}

function aiLeadMatchesOwner(item, ownerName, currentMember = {}) {
  const target = normalizeAiText(ownerName);
  if (!target) {
    return true;
  }
  const ownerText = normalizeAiText(item.ownerText);
  if (ownerText) {
    return ownerText.includes(target) || target.includes(ownerText);
  }
  const ownerId = normalizeAiText(item.owner);
  if (!ownerId) {
    return false;
  }
  if (ownerId.includes(target) || target.includes(ownerId)) {
    return true;
  }
  if (normalizeAiText(currentMember?.name) !== target) {
    return false;
  }
  const currentIds = [
    currentMember?.userId,
    currentMember?.uniqueId,
    currentMember?.corpUserId,
    currentMember?.account
  ]
    .map(normalizeAiText)
    .filter(Boolean);
  return currentIds.includes(ownerId);
}

function isAiLeadUnassigned(item) {
  return !normalizeAiText(item.owner) && !normalizeAiText(item.ownerText);
}

function displayAiLeadOwner(item) {
  return item.ownerText || item.owner || "";
}

function normalizeAiText(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
}

function normalizeAiActivity(row) {
  return {
    id: dataIdOf(row),
    code: readField(row, AI_FIELD.activity.code),
    name: readField(row, AI_FIELD.activity.name),
    type: readField(row, AI_FIELD.activity.type),
    startDate: readField(row, AI_FIELD.activity.start),
    endDate: readField(row, AI_FIELD.activity.end),
    department: readField(row, AI_FIELD.activity.dept),
    count: numberOrEmpty(readField(row, AI_FIELD.activity.count)) || 0,
    template: readField(row, AI_FIELD.activity.template),
    submitter: readField(row, AI_FIELD.activity.submitter),
    qrStatus: readField(row, AI_FIELD.activity.qrStatus) || QR_STATUS.enabled,
    createTime: row?.createTime || row?.data?.createTime || ""
  };
}

function normalizeAiStudent(row) {
  return {
    id: dataIdOf(row),
    activityName: readField(row, AI_FIELD.student.activityName),
    personName: readField(row, AI_FIELD.student.personName),
    phone: normalizePhone(readField(row, AI_FIELD.student.phone)),
    education: readField(row, AI_FIELD.student.education),
    signupSource: readField(row, AI_FIELD.student.signupSource),
    direction: readField(row, AI_FIELD.student.direction),
    sourceCode: readField(row, AI_FIELD.student.sourceCode),
    repeatCount: numberOrEmpty(readField(row, AI_FIELD.student.repeatCount)) || 1,
    createTime: row?.createTime || row?.data?.createTime || ""
  };
}

function normalizeAiLead(row) {
  return {
    id: dataIdOf(row),
    code: readField(row, AI_FIELD.lead.code),
    personName: readField(row, AI_FIELD.lead.personName),
    phone: normalizePhone(readField(row, AI_FIELD.lead.phone)),
    direction: readField(row, AI_FIELD.lead.direction),
    submitTime: readField(row, AI_FIELD.lead.submitTime),
    education: readField(row, AI_FIELD.lead.education),
    signupSource: readField(row, AI_FIELD.lead.signupSource),
    owner: readField(row, AI_FIELD.lead.owner),
    ownerText: readField(row, AI_FIELD.lead.ownerText),
    status: readField(row, AI_FIELD.lead.status),
    createTime: row?.createTime || row?.data?.createTime || ""
  };
}

function normalizeAiFollowUp(row) {
  return {
    id: dataIdOf(row),
    personName: readField(row, AI_FIELD.followUp.personName),
    method: readField(row, AI_FIELD.followUp.method),
    contactTime: readField(row, AI_FIELD.followUp.contactTime),
    nextTime: readField(row, AI_FIELD.followUp.nextTime),
    content: readField(row, AI_FIELD.followUp.content),
    leadCode: readField(row, AI_FIELD.followUp.leadCode),
    owner: readField(row, AI_FIELD.followUp.owner),
    createTime: row?.createTime || row?.data?.createTime || ""
  };
}

function filterAiByDateRange(rows, range, pickDate) {
  if (!range?.start || !range?.end) {
    return rows;
  }
  return rows.filter((row) => {
    const date = parseAiDate(pickDate(row));
    return date && date >= range.start && date < range.end;
  });
}

function groupCount(rows, pickLabel) {
  const map = new Map();
  for (const row of rows) {
    const label = String(pickLabel(row) || "未填写").trim() || "未填写";
    map.set(label, (map.get(label) || 0) + 1);
  }
  return map;
}

function topEntries(map, limit = 5) {
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }
      return left.label.localeCompare(right.label, "zh-Hans-CN", {
        numeric: true,
        sensitivity: "base"
      });
    })
    .slice(0, limit);
}

function buildRecentDailySeries(rows, pickDate, days) {
  const today = startOfLocalDay(new Date());
  const start = addDays(today, -days + 1);
  const map = new Map();
  for (let index = 0; index < days; index += 1) {
    const date = addDays(start, index);
    map.set(formatLocalDate(date), 0);
  }
  for (const row of rows) {
    const date = parseAiDate(pickDate(row));
    if (!date || date < start || date >= addDays(today, 1)) {
      continue;
    }
    const key = formatLocalDate(date);
    if (map.has(key)) {
      map.set(key, map.get(key) + 1);
    }
  }
  return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}

function createAiCard(label, value, hint) {
  return { label, value, hint };
}

function dedupeAiCards(cards) {
  const seen = new Set();
  return cards.filter((card) => {
    const key = card.label;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function parseAiDate(value) {
  if (!value) {
    return null;
  }
  const text = String(value).trim().replace("T", " ");
  const match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/);
  if (match) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] = match;
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
    return Number.isFinite(date.getTime()) ? date : null;
  }
  const date = new Date(text);
  return Number.isFinite(date.getTime()) ? date : null;
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatLocalDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

async function fetchAllBaishuyunRows(url, options = {}) {
  const pageSize = Math.min(Math.max(Number(options.limit || 100), 1), 300);
  const maxPages = Math.min(Math.max(Number(options.maxPages || 50), 1), 200);
  const rows = [];
  let page = 1;
  let seen = 0;
  let total = 0;

  while (page <= maxPages) {
    const payload = await callBaishuyunOrThrow(url, {
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

  return rows;
}

function normalizeCurrentMemberSource(body = {}) {
  const input = {
    ...(body.query || {}),
    ...(body.params || {}),
    ...(body.current || {}),
    ...body
  };

  for (const urlKey of ["url", "href", "location", "pageUrl"]) {
    if (!input[urlKey]) {
      continue;
    }
    try {
      const parsed = new URL(String(input[urlKey]), "https://www.mjmas.cn");
      for (const [key, value] of parsed.searchParams.entries()) {
        if (input[key] === undefined) {
          input[key] = value;
        }
      }
    } catch {
      // URL 参数只是兜底来源，解析失败时继续使用显式字段。
    }
  }

  return {
    cropId: firstText(input, ["webpage_crop_id", "crop_id", "cropId"]),
    userId: firstText(input, ["webpage_user_id", "user_id", "userId", "uid"]),
    userName: firstText(input, ["webpage_user_name", "user_name", "userName", "name"]),
    account: firstText(input, ["webpage_account", "account", "username", "loginName"]),
    mobile: normalizePhone(firstText(input, ["webpage_phone", "phone", "mobile", "tel"])),
    email: firstText(input, ["webpage_email", "email"]).toLowerCase(),
    corpUserId: firstText(input, ["webpage_corp_user_id", "corp_user_id", "corpUserId", "uniqueid", "uniqueId"])
  };
}

function findCurrentMember(users = [], source = {}) {
  const idSet = new Set([source.userId, source.corpUserId].map((item) => String(item || "").trim()).filter(Boolean));
  if (idSet.size) {
    const matched = users.find((user) => [user.userId, user.uniqueId, user.corpUserId].some((item) => idSet.has(String(item || "").trim())));
    if (matched) {
      return { user: withMainDepartment(matched), matchedBy: "user_id" };
    }
  }

  if (source.mobile) {
    const matched = users.find((user) => normalizePhone(user.mobile) === source.mobile);
    if (matched) {
      return { user: withMainDepartment(matched), matchedBy: "mobile" };
    }
  }

  if (source.email) {
    const matched = users.find((user) => String(user.email || "").trim().toLowerCase() === source.email);
    if (matched) {
      return { user: withMainDepartment(matched), matchedBy: "email" };
    }
  }

  if (source.account) {
    const normalizedAccount = source.account.toLowerCase();
    const matched = users.find((user) => String(user.account || "").trim().toLowerCase() === normalizedAccount);
    if (matched) {
      return { user: withMainDepartment(matched), matchedBy: "account" };
    }
  }

  if (source.userName) {
    const sameName = users.filter((user) => user.name === source.userName);
    if (sameName.length === 1) {
      return { user: withMainDepartment(sameName[0]), matchedBy: "name" };
    }
  }

  return { user: null, matchedBy: "" };
}

function buildCurrentMemberFallback(source = {}) {
  const departments = [];
  return withMainDepartment({
    userId: source.userId || source.corpUserId || "",
    uniqueId: source.userId || "",
    corpUserId: source.corpUserId || "",
    name: source.userName || source.account || source.mobile || source.email || "",
    account: source.account || "",
    mobile: source.mobile || "",
    email: source.email || "",
    departments
  });
}

function withMainDepartment(user = {}) {
  const departments = Array.isArray(user.departments) ? user.departments : [];
  const mainDepartment = departments[0] || {};
  return {
    ...user,
    departments,
    mainDeptId: mainDepartment.deptId || "",
    mainDeptName: mainDepartment.name || ""
  };
}

function normalizePermissionGroups(rows = []) {
  const groups = new Map();
  for (const row of rows) {
    if (!isActiveStatus(readField(row, PERMISSION_FIELD.group.status))) {
      continue;
    }
    const code = String(readField(row, PERMISSION_FIELD.group.code)).trim();
    if (!code) {
      continue;
    }
    groups.set(code, {
      id: dataIdOf(row),
      code,
      name: readField(row, PERMISSION_FIELD.group.name) || code
    });
  }
  return groups;
}

function resolveMemberGroupCodes(rows = [], activeGroups = new Map(), member = {}) {
  const codes = new Set();
  for (const row of rows) {
    if (!isActiveStatus(readField(row, PERMISSION_FIELD.member.status))) {
      continue;
    }
    const groupCode = String(readField(row, PERMISSION_FIELD.member.groupCode)).trim();
    if (!groupCode || (activeGroups.size && !activeGroups.has(groupCode))) {
      continue;
    }
    if (isPermissionMemberMatch(row, member)) {
      codes.add(groupCode);
    }
  }
  return Array.from(codes);
}

function isPermissionMemberMatch(row, member = {}) {
  const objectType = readField(row, PERMISSION_FIELD.member.objectType);
  const memberValue = row?.[PERMISSION_FIELD.member.member];
  const departmentValue = row?.[PERMISSION_FIELD.member.department];
  const memberId = extractComplexId(memberValue);
  const memberText = readComplexValue(memberValue).trim();
  const departmentId = extractComplexId(departmentValue);
  const departmentText = readComplexValue(departmentValue).trim();

  if (/全|所有/.test(objectType)) {
    return true;
  }
  if ((!objectType || /成员|用户|人员|个人/.test(objectType)) && isSameUserReference(member, memberId, memberText)) {
    return true;
  }
  if ((!objectType || /部门|组织/.test(objectType)) && isSameDepartmentReference(member, departmentId, departmentText)) {
    return true;
  }
  return false;
}

function buildModulePermissionProfile(rows = [], groupCodes = []) {
  const groupSet = new Set(groupCodes);
  const modules = {};
  for (const row of rows) {
    if (!isActiveStatus(readField(row, PERMISSION_FIELD.module.status))) {
      continue;
    }
    const groupCode = String(readField(row, PERMISSION_FIELD.module.groupCode)).trim();
    if (!groupSet.has(groupCode)) {
      continue;
    }
    const moduleCode = String(readField(row, PERMISSION_FIELD.module.moduleCode)).trim();
    if (!moduleCode) {
      continue;
    }
    if (!modules[moduleCode]) {
      modules[moduleCode] = {
        moduleCode,
        moduleName: readField(row, PERMISSION_FIELD.module.moduleName) || moduleCode,
        operations: [],
        dataScope: "无权限",
        defaultVisible: false,
        defaultEditable: false
      };
    }
    const module = modules[moduleCode];
    module.moduleName = module.moduleName || readField(row, PERMISSION_FIELD.module.moduleName) || moduleCode;
    module.operations = uniqueTextValues([...module.operations, ...readMultiField(row, PERMISSION_FIELD.module.operations)]);
    module.dataScope = pickMaxDataScope([module.dataScope, ...readMultiField(row, PERMISSION_FIELD.module.dataScope)]);
    module.defaultVisible = module.defaultVisible || isTruthyPermission(readField(row, PERMISSION_FIELD.module.defaultVisible));
    module.defaultEditable = module.defaultEditable || isTruthyPermission(readField(row, PERMISSION_FIELD.module.defaultEditable));
  }
  return modules;
}

function buildFieldPermissionProfile(rows = [], groupCodes = [], modules = {}) {
  const groupSet = new Set(groupCodes);
  const fields = {};
  for (const row of rows) {
    if (!isActiveStatus(readField(row, PERMISSION_FIELD.field.status))) {
      continue;
    }
    const groupCode = String(readField(row, PERMISSION_FIELD.field.groupCode)).trim();
    if (!groupSet.has(groupCode)) {
      continue;
    }
    const moduleCode = String(readField(row, PERMISSION_FIELD.field.moduleCode)).trim();
    const fieldAlias = String(readField(row, PERMISSION_FIELD.field.fieldAlias)).trim();
    if (!moduleCode || !fieldAlias) {
      continue;
    }
    if (!fields[moduleCode]) {
      fields[moduleCode] = {};
    }
    const current = fields[moduleCode][fieldAlias] || {
      fieldAlias,
      fieldName: readField(row, PERMISSION_FIELD.field.fieldName) || fieldAlias,
      visible: Boolean(modules[moduleCode]?.defaultVisible),
      editable: Boolean(modules[moduleCode]?.defaultEditable)
    };
    current.fieldName = current.fieldName || readField(row, PERMISSION_FIELD.field.fieldName) || fieldAlias;
    current.visible = current.visible || isTruthyPermission(readField(row, PERMISSION_FIELD.field.visible));
    current.editable = current.editable || isTruthyPermission(readField(row, PERMISSION_FIELD.field.editable));
    fields[moduleCode][fieldAlias] = current;
  }
  return fields;
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

function startSurveySubmitWorker() {
  if (SURVEY_SUBMIT_WORKER_INTERVAL_MS && SURVEY_SUBMIT_WORKER_INTERVAL_MS >= 1000) {
    const timer = setInterval(() => {
      scheduleSurveySubmitWorker();
    }, SURVEY_SUBMIT_WORKER_INTERVAL_MS);
    timer.unref?.();
  }
  scheduleSurveySubmitWorker();
}

function scheduleSurveySubmitWorker() {
  const timer = setTimeout(() => {
    processPendingSurveySubmitJobs().catch((error) => {
      console.error("Survey submit worker failed:", error);
    });
  }, 0);
  timer.unref?.();
}

async function processPendingSurveySubmitJobs() {
  if (surveySubmitWorkerBusy) {
    return;
  }

  surveySubmitWorkerBusy = true;
  try {
    const now = Date.now();
    const jobs = SURVEY_SUBMIT_STATE.jobs.filter((job) => isRunnableSurveySubmitJob(job, now));

    for (const job of jobs) {
      const startedAt = new Date().toISOString();
      job.status = "processing";
      job.startedAt = startedAt;
      job.updatedAt = startedAt;
      job.attempts = Number(job.attempts || 0) + 1;
      await saveSurveySubmitStore();

      try {
        const result = await submitSurveyCascade(job.data, job.options);
        const finishedAt = new Date().toISOString();
        job.status = "done";
        job.finishedAt = finishedAt;
        job.updatedAt = finishedAt;
        job.lastError = "";
        job.result = summarizeSurveySubmitResult(result);
      } catch (error) {
        const failedAt = new Date().toISOString();
        const message = error.message || "后台提交失败";
        job.status = job.attempts >= SURVEY_SUBMIT_MAX_ATTEMPTS ? "failed" : "retry";
        job.failedAt = failedAt;
        job.updatedAt = failedAt;
        job.lastError = message;
        job.nextRunAt = job.status === "retry"
          ? new Date(Date.now() + Math.min(job.attempts * 15000, 120000)).toISOString()
          : "";
        console.error(`Survey background submit failed (${job.id}): ${message}`);
      }

      pruneSurveySubmitStore();
      await saveSurveySubmitStore();
    }
  } finally {
    surveySubmitWorkerBusy = false;
  }
}

function isRunnableSurveySubmitJob(job, now = Date.now()) {
  if (!job || typeof job !== "object") {
    return false;
  }
  if (!["pending", "retry", "processing"].includes(job.status)) {
    return false;
  }
  if (Number(job.attempts || 0) >= SURVEY_SUBMIT_MAX_ATTEMPTS && job.status !== "processing") {
    return false;
  }
  const nextRunAt = job.nextRunAt ? new Date(job.nextRunAt).getTime() : 0;
  return !Number.isFinite(nextRunAt) || nextRunAt <= now;
}

function summarizeSurveySubmitResult(result = {}) {
  return {
    surveyCreated: Boolean(result.survey?.created),
    activityStudentCreated: Boolean(result.activityStudent?.created),
    repeatCount: Number(result.activityStudent?.repeatCount || 0),
    leadRequired: Boolean(result.potentialLead?.required),
    leadCreated: Boolean(result.potentialLead?.created),
    leadDuplicate: Boolean(result.potentialLead?.duplicate)
  };
}

function loadSurveySubmitStore() {
  try {
    if (!fs.existsSync(SURVEY_SUBMIT_QUEUE_PATH)) {
      return { jobs: [] };
    }

    const parsed = JSON.parse(fs.readFileSync(SURVEY_SUBMIT_QUEUE_PATH, "utf8"));
    return {
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : []
    };
  } catch {
    return { jobs: [] };
  }
}

function saveSurveySubmitStore() {
  surveySubmitStoreSaveChain = surveySubmitStoreSaveChain
    .catch(() => {})
    .then(saveSurveySubmitStoreNow);
  return surveySubmitStoreSaveChain;
}

async function saveSurveySubmitStoreNow() {
  await fsp.mkdir(path.dirname(SURVEY_SUBMIT_QUEUE_PATH), { recursive: true });
  await fsp.writeFile(SURVEY_SUBMIT_QUEUE_PATH, JSON.stringify(SURVEY_SUBMIT_STATE, null, 2));
}

function pruneSurveySubmitStore() {
  const activeJobs = SURVEY_SUBMIT_STATE.jobs.filter((job) =>
    !["done", "failed"].includes(job.status)
  );
  const closedJobs = SURVEY_SUBMIT_STATE.jobs
    .filter((job) => ["done", "failed"].includes(job.status))
    .slice(-300);
  SURVEY_SUBMIT_STATE.jobs = [...activeJobs, ...closedJobs].slice(-500);
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
  const normalizedPhone = comparablePhone(phone);
  if (!normalizedPhone) {
    return [];
  }

  const pageSize = 100;
  let page = 1;
  const matches = [];
  const matchedIds = new Set();
  const pageSignatures = new Set();
  let seen = 0;
  let total = 0;

  while (page <= 50) {
    const payload = await callBaishuyunOrThrow(ENDPOINTS.activityStudent.list, {
      page,
      limit: pageSize,
      skip: (page - 1) * pageSize
    });
    const rows = extractRows(payload);
    const signature = rows.map(dataIdOf).filter(Boolean).join("|");
    if (signature && pageSignatures.has(signature)) {
      break;
    }
    if (signature) {
      pageSignatures.add(signature);
    }
    total = total || extractTotal(payload, 0);
    seen += rows.length;
    rows.forEach((row) => {
      if (comparablePhone(readField(row, STUDENT_FIELD.phone)) !== normalizedPhone) {
        return;
      }
      const id = dataIdOf(row);
      if (id && matchedIds.has(id)) {
        return;
      }
      if (id) {
        matchedIds.add(id);
      }
      matches.push(row);
    });

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
  const position = valueOf(surveyData, SURVEY_FIELD.position) || valueOf(surveyData, SURVEY_FIELD.jobTitle);
  return compactData({
    [STUDENT_FIELD.activityName]: valueOf(surveyData, SURVEY_FIELD.activityName),
    [STUDENT_FIELD.personName]: valueOf(surveyData, SURVEY_FIELD.personName),
    [STUDENT_FIELD.phone]: valueOf(surveyData, SURVEY_FIELD.phone),
    [STUDENT_FIELD.email]: valueOf(surveyData, SURVEY_FIELD.email),
    [STUDENT_FIELD.company]: valueOf(surveyData, SURVEY_FIELD.company),
    [STUDENT_FIELD.position]: position,
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
    (isPromoTemplate(options.template) || isExperienceTemplate(options.template) || isExperienceDayTemplate(options.template) ? "是，我想了解" : "");
  const position = valueOf(surveyData, SURVEY_FIELD.position) || valueOf(surveyData, SURVEY_FIELD.jobTitle);

  return compactData({
    [LEAD_FIELD.personName]: valueOf(surveyData, SURVEY_FIELD.personName),
    [LEAD_FIELD.phone]: valueOf(surveyData, SURVEY_FIELD.phone),
    [LEAD_FIELD.gender]: valueOf(surveyData, SURVEY_FIELD.gender),
    [LEAD_FIELD.direction]: valueOf(surveyData, SURVEY_FIELD.direction),
    [LEAD_FIELD.submitTime]: formatDateTime(new Date()),
    [LEAD_FIELD.education]: valueOf(surveyData, SURVEY_FIELD.education),
    [LEAD_FIELD.company]: valueOf(surveyData, SURVEY_FIELD.company),
    [LEAD_FIELD.position]: position,
    [LEAD_FIELD.signupSource]: valueOf(surveyData, SURVEY_FIELD.activityName),
    [LEAD_FIELD.referrer]: valueOf(surveyData, SURVEY_FIELD.referrer),
    [LEAD_FIELD.intention]: intention,
    [LEAD_FIELD.email]: valueOf(surveyData, SURVEY_FIELD.email),
    [LEAD_FIELD.meetup]: valueOf(surveyData, SURVEY_FIELD.meetup),
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

function isExperienceTemplate(value) {
  const text = String(value || "");
  return text === QUESTIONNAIRE_TEMPLATE.experience;
}

function isExperienceDayTemplate(value) {
  const text = String(value || "");
  return text === QUESTIONNAIRE_TEMPLATE.suzhouExperienceDay ||
    text === QUESTIONNAIRE_TEMPLATE.hefeiExperienceDay ||
    text === QUESTIONNAIRE_TEMPLATE.shanghaiExperienceDay ||
    text.includes("体验日");
}

function defaultQuestionnaireFieldStatuses(templateValue) {
  const template = String(templateValue || "").trim();
  const defaults = {
    phone: QUESTIONNAIRE_FIELD_STATUS.required,
    idCard: QUESTIONNAIRE_FIELD_STATUS.required
  };

  if (template === QUESTIONNAIRE_TEMPLATE.promo || template.includes("展架")) {
    defaults.idCard = QUESTIONNAIRE_FIELD_STATUS.hidden;
  }
  if (template === QUESTIONNAIRE_TEMPLATE.suzhouExperienceDay || (template.includes("苏州") && template.includes("体验日"))) {
    defaults.idCard = QUESTIONNAIRE_FIELD_STATUS.hidden;
  }
  if (template === QUESTIONNAIRE_TEMPLATE.shanghaiExperienceDay || (template.includes("上海") && template.includes("体验日"))) {
    defaults.idCard = QUESTIONNAIRE_FIELD_STATUS.hidden;
  }

  return defaults;
}

function normalizeQuestionnaireFieldStatus(value, fallback = QUESTIONNAIRE_FIELD_STATUS.required) {
  const text = String(readComplexValue(value) || "").trim();
  if (QUESTIONNAIRE_FIELD_STATUS_OPTIONS.includes(text)) {
    return text;
  }
  if (["隐藏", "不显示", "hidden", "hide", "none"].includes(text.toLowerCase())) {
    return QUESTIONNAIRE_FIELD_STATUS.hidden;
  }
  if (["显示选填", "选填", "optional"].includes(text.toLowerCase())) {
    return QUESTIONNAIRE_FIELD_STATUS.optional;
  }
  if (["显示必填", "必填", "required"].includes(text.toLowerCase())) {
    return QUESTIONNAIRE_FIELD_STATUS.required;
  }
  return fallback;
}

function questionnairePhoneStatus(row = {}, templateValue = "") {
  const template = templateValue || readField(row, ACTIVITY_FIELD.template) || QUESTIONNAIRE_TEMPLATE.lecture;
  const fallback = defaultQuestionnaireFieldStatuses(template).phone;
  return normalizeQuestionnaireFieldStatus(row?.[ACTIVITY_FIELD.phoneFieldStatus], fallback);
}

function questionnaireIdCardStatus(row = {}, templateValue = "") {
  const template = templateValue || readField(row, ACTIVITY_FIELD.template) || QUESTIONNAIRE_TEMPLATE.lecture;
  const fallback = defaultQuestionnaireFieldStatuses(template).idCard;
  return normalizeQuestionnaireFieldStatus(row?.[ACTIVITY_FIELD.idCardFieldStatus], fallback);
}

function shouldCreatePotentialLead(surveyData, options = {}) {
  return isPromoTemplate(options.template) ||
    isExperienceTemplate(options.template) ||
    isExperienceDayTemplate(options.template) ||
    isInterested(valueOf(surveyData, SURVEY_FIELD.intention));
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

function comparablePhone(value) {
  const phone = normalizePhone(value);
  return /^1\d{10}$/.test(phone) ? phone : "";
}

function firstText(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
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

function isSameUserReference(member = {}, id = "", text = "") {
  const normalizedId = String(id || "").trim();
  const normalizedText = String(text || "").trim();
  const idCandidates = [member.userId, member.uniqueId, member.corpUserId]
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  if (normalizedId && idCandidates.includes(normalizedId)) {
    return true;
  }

  const textCandidates = [member.name, member.account, member.mobile, member.email]
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return Boolean(normalizedText && textCandidates.includes(normalizedText));
}

function isSameDepartmentReference(member = {}, id = "", text = "") {
  const normalizedId = String(id || "").trim();
  const normalizedText = String(text || "").trim();
  const departments = Array.isArray(member.departments) ? member.departments : [];
  return departments.some((dept) => {
    const deptId = String(dept.deptId || "").trim();
    const deptName = String(dept.name || "").trim();
    return (normalizedId && deptId === normalizedId) || (normalizedText && deptName === normalizedText);
  });
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

function readMultiField(row, key) {
  return readMultiValue(row?.[key]);
}

function readMultiValue(value) {
  if (value === null || value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    return uniqueTextValues(value.flatMap(readMultiValue));
  }
  if (typeof value === "object") {
    const text = readComplexValue(value).trim();
    return text ? [text] : [];
  }
  return uniqueTextValues(
    String(value)
      .split(/[、,，/；;]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

function uniqueTextValues(values) {
  return Array.from(new Set(values.map((item) => String(item || "").trim()).filter(Boolean)));
}

function isActiveStatus(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) {
    return true;
  }
  return !/(停用|禁用|无效|否|false|^0$)/.test(text);
}

function isTruthyPermission(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) {
    return false;
  }
  if (/(否|不可|隐藏|禁用|停用|无|false|^0$)/.test(text)) {
    return false;
  }
  return /(是|可|允许|启用|true|^1$)/.test(text);
}

function pickMaxDataScope(values) {
  let best = "无权限";
  let bestRank = 0;
  for (const value of uniqueTextValues(values)) {
    const text = String(value || "").trim();
    const rank = dataScopeRank(text);
    if (rank > bestRank) {
      best = text;
      bestRank = rank;
    }
  }
  return best;
}

function dataScopeRank(value) {
  const text = String(value || "").trim();
  if (DATA_SCOPE_RANK[text] !== undefined) {
    return DATA_SCOPE_RANK[text];
  }
  if (/全部|所有/.test(text)) {
    return 4;
  }
  if (/下级|下属/.test(text)) {
    return 3;
  }
  if (/部门/.test(text)) {
    return 2;
  }
  if (/本人|自己|个人/.test(text)) {
    return 1;
  }
  return 0;
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
        name: String(dept?.name || dept?.dept_name || dept?.deptName || "").trim(),
        deptNo: dept?.dept_no ?? dept?.deptNo ?? "",
        parentId: String(dept?.parent_id || dept?.parentId || "").trim()
      })).filter((dept) => dept.deptId || dept.name)
    : [];
  const uniqueId = String(source.uniqueid || source.uniqueId || source.unique_id || "").trim();
  const corpUserId = String(source.corp_user_id || source.corpUserId || source.corpUserID || "").trim();
  const userId = String(
    source.user_id ||
    source.userId ||
    source.id ||
    source._id ||
    uniqueId ||
    corpUserId ||
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
    uniqueId,
    corpUserId,
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
