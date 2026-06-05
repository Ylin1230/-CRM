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

const FALLBACK_DIRECTION_OPTIONS = [
  "非全日制科创EMBA",
  "非全日制MBA综合管理方向",
  "非全日制MBA科技金融方向",
  "非全日制MBA科技创业方向",
  "非全日制MBA人工智能商业应用方向",
  "全日制MBA",
  "创新企业家学者 （DBA直通车）项目",
  "科技企业家学者 （DBA直通车）项目",
  "科技投资人",
  "科技创新班",
  "AI时代管理思维",
  "科创企业家全球资产配置班",
  "AI商业架构师认证"
];

const API_BASE_PATH = window.location.pathname.startsWith("/zgkd-crm/") ? "/zgkd-crm" : "";
const SURVEY_TEMPLATE_PARAM = "_widget_1779761373894";
const ACTIVITY_DIRECTION_PRESET_PARAM = "_widget_1779860682092";
const QUESTIONNAIRE_TEMPLATE = {
  lecture: "活动讲座模版",
  promo: "展架等宣传品通用模版",
  experience: "MBA-EMBA报考咨询表(体验营用)",
  suzhouExperienceDay: "苏州-EMBA/MBA 体验日",
  hefeiExperienceDay: "合肥-EMBA/MBA 体验日",
  shanghaiExperienceDay: "上海-EMBA/MBA体验日"
};

const EXPERIENCE_DECLARATION =
  "我已充分了解并接受中国科大EMBA/MBA体验营日程安排，保证所提交的所有申请资料均真实可靠，并愿对因虚假信息导致的申请失败或资格取消承担全部责任。我同意中国科大专业学位中心保留所有申请资料。";

const ORIGIN_ADDRESS_OPTIONS = [
  { province: "北京市", cities: ["北京市"] },
  { province: "天津市", cities: ["天津市"] },
  { province: "河北省", cities: ["石家庄市", "唐山市", "秦皇岛市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "沧州市", "廊坊市", "衡水市"] },
  { province: "山西省", cities: ["太原市", "大同市", "阳泉市", "长治市", "晋城市", "朔州市", "晋中市", "运城市", "忻州市", "临汾市", "吕梁市"] },
  { province: "内蒙古自治区", cities: ["呼和浩特市", "包头市", "乌海市", "赤峰市", "通辽市", "鄂尔多斯市", "呼伦贝尔市", "巴彦淖尔市", "乌兰察布市", "兴安盟", "锡林郭勒盟", "阿拉善盟"] },
  { province: "辽宁省", cities: ["沈阳市", "大连市", "鞍山市", "抚顺市", "本溪市", "丹东市", "锦州市", "营口市", "阜新市", "辽阳市", "盘锦市", "铁岭市", "朝阳市", "葫芦岛市"] },
  { province: "吉林省", cities: ["长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"] },
  { province: "黑龙江省", cities: ["哈尔滨市", "齐齐哈尔市", "鸡西市", "鹤岗市", "双鸭山市", "大庆市", "伊春市", "佳木斯市", "七台河市", "牡丹江市", "黑河市", "绥化市", "大兴安岭地区"] },
  { province: "上海市", cities: ["上海市"] },
  { province: "江苏省", cities: ["南京市", "无锡市", "徐州市", "常州市", "苏州市", "南通市", "连云港市", "淮安市", "盐城市", "扬州市", "镇江市", "泰州市", "宿迁市"] },
  { province: "浙江省", cities: ["杭州市", "宁波市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "衢州市", "舟山市", "台州市", "丽水市"] },
  { province: "安徽省", cities: ["合肥市", "芜湖市", "蚌埠市", "淮南市", "马鞍山市", "淮北市", "铜陵市", "安庆市", "黄山市", "滁州市", "阜阳市", "宿州市", "六安市", "亳州市", "池州市", "宣城市"] },
  { province: "福建省", cities: ["福州市", "厦门市", "莆田市", "三明市", "泉州市", "漳州市", "南平市", "龙岩市", "宁德市"] },
  { province: "江西省", cities: ["南昌市", "景德镇市", "萍乡市", "九江市", "新余市", "鹰潭市", "赣州市", "吉安市", "宜春市", "抚州市", "上饶市"] },
  { province: "山东省", cities: ["济南市", "青岛市", "淄博市", "枣庄市", "东营市", "烟台市", "潍坊市", "济宁市", "泰安市", "威海市", "日照市", "临沂市", "德州市", "聊城市", "滨州市", "菏泽市"] },
  { province: "河南省", cities: ["郑州市", "开封市", "洛阳市", "平顶山市", "安阳市", "鹤壁市", "新乡市", "焦作市", "濮阳市", "许昌市", "漯河市", "三门峡市", "南阳市", "商丘市", "信阳市", "周口市", "驻马店市", "济源市"] },
  { province: "湖北省", cities: ["武汉市", "黄石市", "十堰市", "宜昌市", "襄阳市", "鄂州市", "荆门市", "孝感市", "荆州市", "黄冈市", "咸宁市", "随州市", "恩施土家族苗族自治州", "仙桃市", "潜江市", "天门市", "神农架林区"] },
  { province: "湖南省", cities: ["长沙市", "株洲市", "湘潭市", "衡阳市", "邵阳市", "岳阳市", "常德市", "张家界市", "益阳市", "郴州市", "永州市", "怀化市", "娄底市", "湘西土家族苗族自治州"] },
  { province: "广东省", cities: ["广州市", "韶关市", "深圳市", "珠海市", "汕头市", "佛山市", "江门市", "湛江市", "茂名市", "肇庆市", "惠州市", "梅州市", "汕尾市", "河源市", "阳江市", "清远市", "东莞市", "中山市", "潮州市", "揭阳市", "云浮市"] },
  { province: "广西壮族自治区", cities: ["南宁市", "柳州市", "桂林市", "梧州市", "北海市", "防城港市", "钦州市", "贵港市", "玉林市", "百色市", "贺州市", "河池市", "来宾市", "崇左市"] },
  { province: "海南省", cities: ["海口市", "三亚市", "三沙市", "儋州市", "五指山市", "琼海市", "文昌市", "万宁市", "东方市", "定安县", "屯昌县", "澄迈县", "临高县", "白沙黎族自治县", "昌江黎族自治县", "乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县"] },
  { province: "重庆市", cities: ["重庆市"] },
  { province: "四川省", cities: ["成都市", "自贡市", "攀枝花市", "泸州市", "德阳市", "绵阳市", "广元市", "遂宁市", "内江市", "乐山市", "南充市", "眉山市", "宜宾市", "广安市", "达州市", "雅安市", "巴中市", "资阳市", "阿坝藏族羌族自治州", "甘孜藏族自治州", "凉山彝族自治州"] },
  { province: "贵州省", cities: ["贵阳市", "六盘水市", "遵义市", "安顺市", "毕节市", "铜仁市", "黔西南布依族苗族自治州", "黔东南苗族侗族自治州", "黔南布依族苗族自治州"] },
  { province: "云南省", cities: ["昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "普洱市", "临沧市", "楚雄彝族自治州", "红河哈尼族彝族自治州", "文山壮族苗族自治州", "西双版纳傣族自治州", "大理白族自治州", "德宏傣族景颇族自治州", "怒江傈僳族自治州", "迪庆藏族自治州"] },
  { province: "西藏自治区", cities: ["拉萨市", "日喀则市", "昌都市", "林芝市", "山南市", "那曲市", "阿里地区"] },
  { province: "陕西省", cities: ["西安市", "铜川市", "宝鸡市", "咸阳市", "渭南市", "延安市", "汉中市", "榆林市", "安康市", "商洛市"] },
  { province: "甘肃省", cities: ["兰州市", "嘉峪关市", "金昌市", "白银市", "天水市", "武威市", "张掖市", "平凉市", "酒泉市", "庆阳市", "定西市", "陇南市", "临夏回族自治州", "甘南藏族自治州"] },
  { province: "青海省", cities: ["西宁市", "海东市", "海北藏族自治州", "黄南藏族自治州", "海南藏族自治州", "果洛藏族自治州", "玉树藏族自治州", "海西蒙古族藏族自治州"] },
  { province: "宁夏回族自治区", cities: ["银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"] },
  { province: "新疆维吾尔自治区", cities: ["乌鲁木齐市", "克拉玛依市", "吐鲁番市", "哈密市", "昌吉回族自治州", "博尔塔拉蒙古自治州", "巴音郭楞蒙古自治州", "阿克苏地区", "克孜勒苏柯尔克孜自治州", "喀什地区", "和田地区", "伊犁哈萨克自治州", "塔城地区", "阿勒泰地区", "石河子市", "阿拉尔市", "图木舒克市", "五家渠市", "北屯市", "铁门关市", "双河市", "可克达拉市", "昆玉市", "胡杨河市", "新星市", "白杨市"] },
  { province: "台湾省", cities: ["台北市", "新北市", "桃园市", "台中市", "台南市", "高雄市", "基隆市", "新竹市", "嘉义市"] },
  { province: "香港特别行政区", cities: ["香港特别行政区"] },
  { province: "澳门特别行政区", cities: ["澳门特别行政区"] }
];

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
  emailField: document.querySelector("#emailField"),
  phoneLabel: document.querySelector("#phoneLabel"),
  companyField: document.querySelector("#companyField"),
  companyLabel: document.querySelector("#companyLabel"),
  positionField: document.querySelector("#positionField"),
  position: document.querySelector("#position"),
  genderField: document.querySelector("#genderField"),
  educationField: document.querySelector("#educationField"),
  educationLabel: document.querySelector("#educationLabel"),
  education: document.querySelector("#education"),
  managerYearsField: document.querySelector("#managerYearsField"),
  managerYearsLabel: document.querySelector("#managerYearsLabel"),
  managerYears: document.querySelector("#managerYears"),
  wechatField: document.querySelector("#wechatField"),
  signupSource: document.querySelector("#signupSource"),
  signupSourceField: document.querySelector("#signupSourceField"),
  phone: document.querySelector("#phone"),
  phoneHint: document.querySelector("#phoneHint"),
  idCardField: document.querySelector("#idCardField"),
  idCardLabel: document.querySelector("#idCardLabel"),
  idCard: document.querySelector("#idCard"),
  idCardHint: document.querySelector("#idCardHint"),
  referrerField: document.querySelector("#referrerField"),
  referrer: document.querySelector("#referrer"),
  intentionField: document.querySelector("#intentionField"),
  intentionInputs: document.querySelectorAll('input[name="intention"]'),
  projectTypeField: document.querySelector("#projectTypeField"),
  projectTypeSelect: document.querySelector("#projectType"),
  directionField: document.querySelector("#directionField"),
  directionLabel: document.querySelector("#directionLabel"),
  directionSelect: document.querySelector("#direction"),
  concernField: document.querySelector("#concernField"),
  experienceFields: document.querySelectorAll(".experience-field"),
  experienceDirectionField: document.querySelector("#experienceDirectionField"),
  experienceDirectionInputs: document.querySelectorAll('input[name="experienceDirection"]'),
  classLocationInputs: document.querySelectorAll('input[name="classLocation"]'),
  listedInputs: document.querySelectorAll('input[name="listed"]'),
  highestDegree: document.querySelector("#highestDegree"),
  degreeTime: document.querySelector("#degreeTime"),
  originAddressPicker: document.querySelector("#originAddressPicker"),
  originAddressInput: document.querySelector("#originAddressInput"),
  originAddressPanel: document.querySelector("#originAddressPanel"),
  originAddressSearch: document.querySelector("#originAddressSearch"),
  originProvinceList: document.querySelector("#originProvinceList"),
  originCityList: document.querySelector("#originCityList"),
  originProvince: document.querySelector("#originProvince"),
  originCity: document.querySelector("#originCity"),
  workYears: document.querySelector("#workYears"),
  companyNature: document.querySelector("#companyNature"),
  industry: document.querySelector("#industry"),
  companyAssets: document.querySelector("#companyAssets"),
  companyScale: document.querySelector("#companyScale"),
  employeeCount: document.querySelector("#employeeCount"),
  stockCode: document.querySelector("#stockCode"),
  jobTitleField: document.querySelector("#jobTitleField"),
  jobTitleLabel: document.querySelector("#jobTitleLabel"),
  jobTitle: document.querySelector("#jobTitle"),
  responsibility: document.querySelector("#responsibility"),
  subordinateCount: document.querySelector("#subordinateCount"),
  managementIssue: document.querySelector("#managementIssue"),
  applicationGoal: document.querySelector("#applicationGoal"),
  supplement: document.querySelector("#supplement"),
  experienceDayFields: document.querySelectorAll(".experience-day-field"),
  suzhouVisitField: document.querySelector("#suzhouVisitField"),
  hefeiVisitField: document.querySelector("#hefeiVisitField"),
  shanghaiVisitField: document.querySelector("#shanghaiVisitField"),
  applicationDownloadField: document.querySelector("#applicationDownloadField"),
  meetupInputs: document.querySelectorAll('input[name="meetup"]'),
  visitLabInputs: document.querySelectorAll('input[name="visitLab"]'),
  visitHistoryInputs: document.querySelectorAll('input[name="visitHistory"]'),
  visitQuantumInputs: document.querySelectorAll('input[name="visitQuantum"]'),
  submitButton: document.querySelector("#submitSurveyButton"),
  confirmMask: document.querySelector("#surveyConfirm"),
  confirmCancelButton: document.querySelector("#cancelSurveyConfirmButton"),
  confirmSubmitButton: document.querySelector("#confirmSurveySubmitButton")
};

const jobTitleOriginalPlacement = {
  parent: surveyDom.jobTitleField?.parentElement || null,
  nextSibling: surveyDom.jobTitleField?.nextElementSibling || null
};

const referrerOriginalPlacement = {
  parent: surveyDom.referrerField?.parentElement || null,
  nextSibling: surveyDom.referrerField?.nextElementSibling || null
};

let surveyApiReady = false;
let submitConfirmResolve = null;
const surveySelectPickers = new Map();
let currentQuestionnaireTemplate = QUESTIONNAIRE_TEMPLATE.lecture;
let currentDirectionOptions = [];
let currentDirectionItems = [];
let selectRepositionFrame = 0;
let originActiveProvince = "";

initSurvey();

async function initSurvey() {
  const params = new URLSearchParams(window.location.search);
  const sourceCode = params.get(SURVEY_FIELD.sourceCode) || params.get("sourceCode") || "";
  let activityName = params.get(SURVEY_FIELD.activityName) || params.get("activityName") || "";
  currentQuestionnaireTemplate =
    params.get(SURVEY_TEMPLATE_PARAM) ||
    params.get("questionnaireTemplate") ||
    params.get("template") ||
    QUESTIONNAIRE_TEMPLATE.lecture;
  const directionPresetText =
    params.get(ACTIVITY_DIRECTION_PRESET_PARAM) ||
    params.get("directionPreset") ||
    "";
  currentDirectionOptions = parseDirectionPresetOptions(
    directionPresetText
  );
  currentDirectionItems = directionItemsFromNames(currentDirectionOptions);

  try {
    const config = await fetchJson(apiUrl("/api/config"));
    surveyApiReady = Boolean(config.hasToken);
    setSurveyStatus(surveyApiReady ? "" : "后端已启动，但未配置百数云 API Token", surveyApiReady ? "" : "error");
  } catch {
    surveyApiReady = false;
    setSurveyStatus("后端未连接，无法提交", "error");
  }

  if (surveyApiReady && sourceCode) {
    try {
      const activityConfig = await loadActivitySurveyConfig(sourceCode);
      const activity = activityConfig.activity || {};
      activityName = activity.activityName || activityName;
      if (activity.qrEnabled === false) {
        renderSurveyInvalid(activity.invalidMessage || "该活动二维码已停用");
        return;
      }
      currentQuestionnaireTemplate = activity.template || currentQuestionnaireTemplate;
      if (Array.isArray(activity.directionPresetItems) && activity.directionPresetItems.length) {
        currentDirectionItems = normalizeDirectionItems(activity.directionPresetItems);
        currentDirectionOptions = currentDirectionItems.map((item) => item.name);
      } else if (Array.isArray(activity.directionPreset) && activity.directionPreset.length) {
        currentDirectionOptions = uniqueTextValues(activity.directionPreset);
        currentDirectionItems = directionItemsFromNames(currentDirectionOptions);
      }
    } catch (error) {
      if (!currentDirectionOptions.length) {
        setSurveyStatus(`活动配置加载失败：${error.message}`, "error");
      }
    }
  }

  if (!currentDirectionOptions.length) {
    currentDirectionOptions = FALLBACK_DIRECTION_OPTIONS;
    currentDirectionItems = directionItemsFromNames(currentDirectionOptions);
  }

  surveyDom.activityName.value = activityName;
  surveyDom.sourceCode.value = sourceCode;
  surveyDom.questionnaireTemplate.value = currentQuestionnaireTemplate;
  if (surveyDom.subTitle) {
    surveyDom.subTitle.textContent = activityName || "报名信息采集";
  }

  initOriginAddressPicker();
  applyQuestionnaireTemplate();
  bindValidation();
  bindProgramSelection();
  bindOriginAddressPicker();
  bindSubmitConfirmation();
  updateProgramFields();
  enhanceSurveySelects();
  surveyDom.form.addEventListener("submit", submitSurvey);
}

async function loadActivitySurveyConfig(sourceCode) {
  return postJson(apiUrl("/api/activity/survey-config"), { sourceCode });
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
  const promoTemplate = isPromoTemplate();
  const experienceTemplate = isExperienceTemplate();
  const experienceDayTemplate = isExperienceDayTemplate();
  const experienceDirections = formData.getAll("experienceDirection").map((item) => String(item || "").trim()).filter(Boolean);
  const jobTitle = formData.get("jobTitle")?.trim() || "";
  const directionValue = experienceTemplate
    ? experienceDirections.join("、")
    : formData.get("direction") || "";
  const data = {
    [SURVEY_FIELD.activityName]: formData.get("activityName")?.trim() || "",
    [SURVEY_FIELD.personName]: formData.get("personName")?.trim() || "",
    [SURVEY_FIELD.phone]: formData.get("phone")?.trim() || "",
    [SURVEY_FIELD.email]: formData.get("email")?.trim() || "",
    [SURVEY_FIELD.company]: formData.get("company")?.trim() || "",
    [SURVEY_FIELD.position]: experienceTemplate || experienceDayTemplate ? "" : formData.get("position")?.trim() || "",
    [SURVEY_FIELD.gender]: formData.get("gender") || "",
    [SURVEY_FIELD.education]: formData.get("education") || "",
    [SURVEY_FIELD.referrer]: formData.get("referrer")?.trim() || "",
    [SURVEY_FIELD.projectType]: formData.get("projectType") || projectTypeForDirection(directionValue),
    [SURVEY_FIELD.direction]: directionValue,
    [SURVEY_FIELD.concern]: formData.get("concern")?.trim() || "",
    [SURVEY_FIELD.sourceCode]: formData.get("sourceCode")?.trim() || ""
  };
  if (!promoTemplate) {
    if (!experienceDayTemplate) {
      data[SURVEY_FIELD.managerYears] = Number(formData.get("managerYears") || 0);
    }
    data[SURVEY_FIELD.idCard] = formData.get("idCard")?.trim() || "";
    if (!experienceTemplate && !experienceDayTemplate) {
      data[SURVEY_FIELD.signupSource] = formData.get("signupSource") || "";
      data[SURVEY_FIELD.intention] = formData.get("intention") || "";
    }
  }
  if (experienceTemplate) {
    Object.assign(data, {
      [SURVEY_FIELD.projectType]: "学历项目",
      [SURVEY_FIELD.intention]: "是，我想了解",
      [SURVEY_FIELD.highestDegree]: formData.get("highestDegree")?.trim() || "",
      [SURVEY_FIELD.degreeTime]: dateInputToDateTime(formData.get("degreeTime")),
      [SURVEY_FIELD.classLocation]: formData.get("classLocation") || "",
      [SURVEY_FIELD.workYears]: optionalNumber(formData.get("workYears")),
      [SURVEY_FIELD.companyNature]: formData.get("companyNature")?.trim() || "",
      [SURVEY_FIELD.industry]: formData.get("industry")?.trim() || "",
      [SURVEY_FIELD.companyAssets]: formData.get("companyAssets")?.trim() || "",
      [SURVEY_FIELD.companyScale]: optionalNumber(formData.get("companyScale")),
      [SURVEY_FIELD.employeeCount]: optionalNumber(formData.get("employeeCount")),
      [SURVEY_FIELD.listed]: formData.get("listed") || "",
      [SURVEY_FIELD.stockCode]: formData.get("stockCode")?.trim() || "",
      [SURVEY_FIELD.jobTitle]: jobTitle,
      [SURVEY_FIELD.responsibility]: formData.get("responsibility")?.trim() || "",
      [SURVEY_FIELD.subordinateCount]: formData.get("subordinateCount")?.trim() || "",
      [SURVEY_FIELD.origin]: addressValue(formData.get("originProvince"), formData.get("originCity")),
      [SURVEY_FIELD.managementIssue]: formData.get("managementIssue")?.trim() || "",
      [SURVEY_FIELD.applicationGoal]: formData.get("applicationGoal")?.trim() || "",
      [SURVEY_FIELD.supplement]: formData.get("supplement")?.trim() || "",
      [SURVEY_FIELD.declaration]: EXPERIENCE_DECLARATION
    });
  }
  if (experienceDayTemplate) {
    Object.assign(data, {
      [SURVEY_FIELD.intention]: "是，我想了解",
      [SURVEY_FIELD.projectType]: projectTypeForDirection(directionValue),
      [SURVEY_FIELD.jobTitle]: jobTitle,
      [SURVEY_FIELD.meetup]: formData.get("meetup") || "",
      [SURVEY_FIELD.visitLab]: formData.get("visitLab") || "",
      [SURVEY_FIELD.visitHistory]: formData.get("visitHistory") || "",
      [SURVEY_FIELD.visitQuantum]: formData.get("visitQuantum") || ""
    });
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
      updateProgramFields({ clearProjectType: true, clearDirection: true });
      clearSurveyErrorStatus();
    });
  });

  surveyDom.projectTypeSelect?.addEventListener("change", () => {
    updateProgramFields({ clearDirection: true });
    clearSurveyErrorStatus();
  });
  surveyDom.directionSelect?.addEventListener("change", clearSurveyErrorStatus);
  surveyDom.experienceDirectionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      clearExperienceDirectionValidity();
      clearSurveyErrorStatus();
    });
  });
}

function bindOriginAddressPicker() {
  surveyDom.originAddressPicker?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  surveyDom.originAddressInput?.addEventListener("click", openOriginAddressPanel);
  surveyDom.originAddressInput?.addEventListener("focus", openOriginAddressPanel);
  surveyDom.originAddressSearch?.addEventListener("input", () => {
    renderOriginAddressPanel();
  });
  surveyDom.originAddressSearch?.addEventListener("focus", () => {
    positionOriginAddressPanel();
  });
  surveyDom.originProvinceList?.addEventListener("click", (event) => {
    const option = event.target.closest(".address-cascader-option");
    if (!option) {
      return;
    }
    setOriginProvince(option.dataset.province || "");
  });
  surveyDom.originCityList?.addEventListener("click", (event) => {
    const option = event.target.closest(".address-cascader-option");
    if (!option || !originActiveProvince) {
      return;
    }
    setOriginCity(option.dataset.city || "");
  });
  document.addEventListener("click", (event) => {
    if (!surveyDom.originAddressPicker?.contains(event.target)) {
      closeOriginAddressPanel();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOriginAddressPanel();
    }
  });
  window.addEventListener("resize", positionOriginAddressPanel);
  window.addEventListener("scroll", positionOriginAddressPanel, true);
  window.visualViewport?.addEventListener("resize", positionOriginAddressPanel);
  window.visualViewport?.addEventListener("scroll", positionOriginAddressPanel);
}

function applyQuestionnaireTemplate() {
  const promo = isPromoTemplate();
  const experience = isExperienceTemplate();
  const experienceDay = isExperienceDayTemplate();
  const suzhouExperienceDay = isSuzhouExperienceDayTemplate();
  const shanghaiExperienceDay = isShanghaiExperienceDayTemplate();
  const namedExperienceDay = suzhouExperienceDay || isHefeiExperienceDayTemplate() || shanghaiExperienceDay;
  const showReferrer = namedExperienceDay || (!experience && !experienceDay);
  const standardLecture = !promo && !experience && !experienceDay;

  setFieldLabel(
    surveyDom.phoneLabel,
    experienceDay ? (suzhouExperienceDay || shanghaiExperienceDay ? "电话" : "电话（请准确填写电话号码以接收入校二维码）") : "手机号"
  );
  setFieldLabel(surveyDom.companyLabel, experience || experienceDay ? "单位" : "企业名称");
  setFieldLabel(surveyDom.educationLabel, experience ? "最后学历" : "最高学历");
  setFieldLabel(surveyDom.managerYearsLabel, experience ? "管理工作年限" : "担任高层管理工作年限");
  setFieldLabel(surveyDom.idCardLabel, experienceDay ? "身份证号（学校封闭管理，身份证号码仅用于入校报名）" : (experience ? "身份证号" : "身份证号（仅用于活动入校使用）"));
  setFieldLabel(surveyDom.jobTitleLabel, experienceDay ? "职务" : "职务名称");

  toggleConditionalField(surveyDom.emailField, [document.querySelector("#email")], !experience && !experienceDay, false);
  toggleConditionalField(surveyDom.positionField, [surveyDom.position], !experience && !experienceDay, true);
  toggleConditionalField(surveyDom.genderField, Array.from(surveyDom.form.querySelectorAll('input[name="gender"]')), !experience && !experienceDay, false);
  toggleConditionalField(surveyDom.educationField, [surveyDom.education], !experienceDay, true);
  toggleConditionalField(surveyDom.wechatField, [document.querySelector("#wechat")], !experience && !experienceDay, false);
  toggleConditionalField(surveyDom.managerYearsField, [surveyDom.managerYears], !promo && !experienceDay, true);
  toggleConditionalField(surveyDom.idCardField, [surveyDom.idCard], !promo && !suzhouExperienceDay && !shanghaiExperienceDay, true);
  toggleConditionalField(surveyDom.signupSourceField, [surveyDom.signupSource], standardLecture, true);
  toggleConditionalField(surveyDom.referrerField, [surveyDom.referrer], showReferrer, true);
  toggleConditionalField(surveyDom.intentionField, Array.from(surveyDom.intentionInputs), standardLecture, true);
  toggleConditionalField(surveyDom.concernField, [document.querySelector("#concern")], !experience && !experienceDay, false);
  toggleExperienceFields(experience);
  toggleConditionalField(surveyDom.jobTitleField, [surveyDom.jobTitle], experience || experienceDay, true);
  toggleExperienceDayFields(experienceDay);
  syncJobTitleFieldPlacement(namedExperienceDay);
  syncReferrerFieldPlacement(namedExperienceDay);
  syncOriginAddressPickerState();
  if (promo || experience || experienceDay) {
    clearRadioGroup("intention");
  }
  if (surveyDom.directionLabel) {
    surveyDom.directionLabel.textContent = promo || experienceDay ? "意向的项目" : "报考方向";
  }
}

function syncJobTitleFieldPlacement(experienceDay) {
  if (!surveyDom.jobTitleField || !surveyDom.companyField || !surveyDom.idCardField) {
    return;
  }
  if (experienceDay) {
    surveyDom.idCardField.parentElement?.insertBefore(surveyDom.jobTitleField, surveyDom.idCardField);
    return;
  }
  const { parent, nextSibling } = jobTitleOriginalPlacement;
  if (parent && surveyDom.jobTitleField.parentElement !== parent) {
    parent.insertBefore(surveyDom.jobTitleField, nextSibling);
  } else if (parent && nextSibling && surveyDom.jobTitleField.nextElementSibling !== nextSibling) {
    parent.insertBefore(surveyDom.jobTitleField, nextSibling);
  }
}

function syncReferrerFieldPlacement(experienceDay) {
  if (!surveyDom.referrerField || !surveyDom.applicationDownloadField) {
    return;
  }
  if (experienceDay) {
    surveyDom.applicationDownloadField.parentElement?.insertBefore(
      surveyDom.referrerField,
      surveyDom.applicationDownloadField
    );
    return;
  }
  const { parent, nextSibling } = referrerOriginalPlacement;
  if (parent && surveyDom.referrerField.parentElement !== parent) {
    parent.insertBefore(surveyDom.referrerField, nextSibling);
  } else if (parent && nextSibling && surveyDom.referrerField.nextElementSibling !== nextSibling) {
    parent.insertBefore(surveyDom.referrerField, nextSibling);
  }
}

function setFieldLabel(label, text) {
  if (label) {
    label.textContent = text;
  }
}

function toggleExperienceFields(active) {
  surveyDom.experienceFields.forEach((field) => {
    field.hidden = !active;
    field.querySelectorAll("input, select, textarea").forEach((control) => {
      control.disabled = !active;
      const skipRequired = control.type === "checkbox" ||
        control.type === "hidden" ||
        control.id === "originAddressSearch";
      control.required = active && field.classList.contains("required") && !skipRequired;
      if (!active) {
        if (control.type === "radio" || control.type === "checkbox") {
          control.checked = false;
        } else {
          control.value = "";
        }
        control.setCustomValidity("");
      }
    });
  });
  surveyDom.experienceDirectionInputs.forEach((input) => {
    input.required = false;
  });
}

function toggleExperienceDayFields(active) {
  const suzhou = active && isSuzhouExperienceDayTemplate();
  const hefei = active && isHefeiExperienceDayTemplate();
  const shanghai = active && isShanghaiExperienceDayTemplate();
  surveyDom.experienceDayFields.forEach((field) => {
    if (field === surveyDom.suzhouVisitField) {
      toggleFieldWithControls(field, suzhou);
      return;
    }
    if (field === surveyDom.hefeiVisitField) {
      toggleFieldWithControls(field, hefei);
      return;
    }
    if (field === surveyDom.shanghaiVisitField) {
      toggleFieldWithControls(field, shanghai);
      return;
    }
    toggleFieldWithControls(field, active);
  });
}

function toggleFieldWithControls(field, active) {
  if (!field) {
    return;
  }
  const controls = Array.from(field.querySelectorAll("input, select, textarea"));
  toggleConditionalField(field, controls, active, field.classList.contains("required"));
}

function initOriginAddressPicker() {
  if (!surveyDom.originAddressPicker || !surveyDom.originProvince || !surveyDom.originCity) {
    return;
  }

  originActiveProvince = surveyDom.originProvince.value || ORIGIN_ADDRESS_OPTIONS[0]?.province || "";
  renderOriginAddressPanel();
  syncOriginAddressDisplay();
}

function syncOriginAddressPickerState() {
  const active = isExperienceTemplate();
  syncOriginAddressDisplay();
  renderOriginAddressPanel();
  if (!active) {
    closeOriginAddressPanel();
    return;
  }
  clearOriginAddressValidity();
}

function openOriginAddressPanel() {
  if (!isExperienceTemplate() || surveyDom.originAddressInput?.disabled || !surveyDom.originAddressPanel) {
    return;
  }
  renderOriginAddressPanel();
  surveyDom.originAddressPanel.hidden = false;
  positionOriginAddressPanel();
}

function closeOriginAddressPanel() {
  if (surveyDom.originAddressPanel) {
    surveyDom.originAddressPanel.hidden = true;
    resetOriginAddressPanelPosition();
  }
}

function setOriginProvince(province) {
  const item = ORIGIN_ADDRESS_OPTIONS.find((option) => option.province === province);
  if (!item) {
    return;
  }

  originActiveProvince = province;
  surveyDom.originProvince.value = province;
  surveyDom.originCity.value = "";
  syncOriginAddressDisplay();
  clearOriginAddressValidity();
  clearSurveyErrorStatus();
  renderOriginAddressPanel();
}

function setOriginCity(city) {
  const item = ORIGIN_ADDRESS_OPTIONS.find((option) => option.province === originActiveProvince);
  if (!item?.cities.includes(city)) {
    return;
  }

  surveyDom.originProvince.value = item.province;
  surveyDom.originCity.value = city;
  syncOriginAddressDisplay();
  clearOriginAddressValidity();
  clearSurveyErrorStatus();
  closeOriginAddressPanel();
}

function originAddressSelected() {
  return Boolean(surveyDom.originProvince?.value && surveyDom.originCity?.value);
}

function setOriginAddressValidity(message) {
  surveyDom.originAddressInput?.setCustomValidity(message);
}

function clearOriginAddressValidity() {
  surveyDom.originAddressInput?.setCustomValidity("");
}

function syncOriginAddressDisplay() {
  if (!surveyDom.originAddressInput || !surveyDom.originProvince || !surveyDom.originCity) {
    return;
  }

  const province = surveyDom.originProvince.value;
  const city = surveyDom.originCity.value;
  originActiveProvince = province || originActiveProvince || ORIGIN_ADDRESS_OPTIONS[0]?.province || "";
  surveyDom.originAddressInput.value = province && city
    ? (province === city ? city : `${province} / ${city}`)
    : province;
}

function renderOriginAddressPanel() {
  if (!surveyDom.originProvinceList || !surveyDom.originCityList) {
    return;
  }

  const keyword = String(surveyDom.originAddressSearch?.value || "").trim().toLowerCase();
  const groups = filteredOriginAddressGroups(keyword);
  const selectedProvince = surveyDom.originProvince?.value || "";
  if (!groups.some((group) => group.province === originActiveProvince)) {
    originActiveProvince = groups.find((group) => group.province === selectedProvince)?.province ||
      groups[0]?.province ||
      "";
  }

  surveyDom.originProvinceList.innerHTML = groups.length
    ? groups.map((group) => originProvinceOptionHtml(group.province)).join("")
    : `<div class="address-cascader-empty">未找到数据</div>`;

  const activeGroup = groups.find((group) => group.province === originActiveProvince) ||
    ORIGIN_ADDRESS_OPTIONS.find((group) => group.province === originActiveProvince);
  const cities = activeGroup?.cities || [];
  surveyDom.originCityList.innerHTML = cities.length
    ? cities.map((city) => originCityOptionHtml(city)).join("")
    : `<div class="address-cascader-empty">请选择省份</div>`;
}

function positionOriginAddressPanel() {
  if (!surveyDom.originAddressPanel || surveyDom.originAddressPanel.hidden || !surveyDom.originAddressInput) {
    return;
  }
  resetOriginAddressPanelPosition();
}

function resetOriginAddressPanelPosition() {
  if (!surveyDom.originAddressPanel) {
    return;
  }

  ["position", "left", "right", "top", "bottom", "width", "maxHeight"].forEach((property) => {
    surveyDom.originAddressPanel.style[property] = "";
  });
  const columns = surveyDom.originAddressPanel.querySelector(".address-cascader-columns");
  if (columns) {
    columns.style.removeProperty("height");
    columns.style.removeProperty("max-height");
  }
}

function filteredOriginAddressGroups(keyword) {
  if (!keyword) {
    return ORIGIN_ADDRESS_OPTIONS;
  }

  return ORIGIN_ADDRESS_OPTIONS
    .map((item) => {
      const provinceMatched = item.province.toLowerCase().includes(keyword);
      const cities = provinceMatched
        ? item.cities
        : item.cities.filter((city) => city.toLowerCase().includes(keyword));
      return cities.length ? { province: item.province, cities } : null;
    })
    .filter(Boolean);
}

function originProvinceOptionHtml(province) {
  const active = province === originActiveProvince ? " active" : "";
  return `
    <button class="address-cascader-option${active}" type="button" data-province="${escapeHtml(province)}" role="option">
      <span>${escapeHtml(province)}</span>
    </button>
  `;
}

function originCityOptionHtml(city) {
  const active = city === surveyDom.originCity?.value ? " active" : "";
  return `
    <button class="address-cascader-option${active}" type="button" data-city="${escapeHtml(city)}" role="option">
      <span>${escapeHtml(city)}</span>
    </button>
  `;
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
  if (!surveyDom.directionField || !surveyDom.directionSelect) {
    return;
  }

  const experienceDay = isExperienceDayTemplate();
  if (isExperienceTemplate()) {
    if (surveyDom.projectTypeField && surveyDom.projectTypeSelect) {
      surveyDom.projectTypeField.hidden = true;
      surveyDom.projectTypeSelect.disabled = true;
      surveyDom.projectTypeSelect.required = false;
      surveyDom.projectTypeSelect.value = "";
      refreshCustomSelect(surveyDom.projectTypeSelect);
    }
    surveyDom.directionField.hidden = true;
    surveyDom.directionSelect.disabled = true;
    surveyDom.directionSelect.required = false;
    surveyDom.directionSelect.value = "";
    refreshCustomSelect(surveyDom.directionSelect);
    return;
  }

  const interested = experienceDay || isPromoTemplate() || isProgramInterested();
  const projectTypes = directionProjectTypes();
  const needsProjectType = interested && projectTypes.length > 1;
  renderProjectTypeOptions(options.clearProjectType ? "" : surveyDom.projectTypeSelect?.value || "");
  if (!interested || !needsProjectType) {
    if (surveyDom.projectTypeSelect) {
      surveyDom.projectTypeSelect.value = "";
    }
  }

  const currentDirection = options.clearDirection ? "" : surveyDom.directionSelect.value;
  renderDirectionOptions(currentDirection);
  const directionOptions = activeDirectionOptions();
  const directionReady = interested && (!needsProjectType || Boolean(surveyDom.projectTypeSelect?.value));

  if (surveyDom.projectTypeField && surveyDom.projectTypeSelect) {
    surveyDom.projectTypeField.hidden = !needsProjectType;
    surveyDom.projectTypeSelect.disabled = !needsProjectType;
    surveyDom.projectTypeSelect.required = needsProjectType;
    refreshCustomSelect(surveyDom.projectTypeSelect);
  }
  surveyDom.directionField.hidden = !directionReady;
  surveyDom.directionSelect.disabled = !directionReady || directionOptions.length === 0;
  surveyDom.directionSelect.required = directionReady && directionOptions.length > 0;
  refreshCustomSelect(surveyDom.directionSelect);
}

function renderProjectTypeOptions(selectedValue = "") {
  if (!surveyDom.projectTypeSelect) {
    return;
  }

  const projectTypes = directionProjectTypes();
  surveyDom.projectTypeSelect.replaceChildren(createSelectOption("", "请选择项目类型"));
  projectTypes.forEach((projectType) => {
    surveyDom.projectTypeSelect.appendChild(createSelectOption(projectType, projectType));
  });
  surveyDom.projectTypeSelect.value = projectTypes.includes(selectedValue) ? selectedValue : "";
}

function renderDirectionOptions(selectedValue = "") {
  const options = activeDirectionOptions();
  const placeholder = isPromoTemplate() || isExperienceDayTemplate() ? "请选择意向的项目" : "请选择报考方向";
  surveyDom.directionSelect.replaceChildren(createSelectOption("", options.length ? placeholder : "当前活动未设置可选报考方向"));
  options.forEach((option) => {
    surveyDom.directionSelect.appendChild(createSelectOption(option, option));
  });
  surveyDom.directionSelect.value = options.includes(selectedValue) ? selectedValue : "";
  surveyDom.directionSelect.disabled = !options.length || surveyDom.directionSelect.disabled;
}

function activeDirectionOptions() {
  const projectTypes = directionProjectTypes();
  if (projectTypes.length <= 1) {
    return currentDirectionItems.map((item) => item.name);
  }

  const selectedProjectType = surveyDom.projectTypeSelect?.value || "";
  if (!selectedProjectType) {
    return [];
  }
  return currentDirectionItems
    .filter((item) => item.projectType === selectedProjectType)
    .map((item) => item.name);
}

function projectTypeForDirection(direction) {
  const directionText = String(direction || "").trim();
  return currentDirectionItems.find((item) => item.name === directionText)?.projectType || "";
}

function directionProjectTypes() {
  const projectTypes = uniqueTextValues(currentDirectionItems.map((item) => item.projectType));
  const order = ["学历项目", "非学历项目"];
  return projectTypes.sort((left, right) => {
    const leftIndex = order.indexOf(left);
    const rightIndex = order.indexOf(right);
    if (leftIndex !== rightIndex) {
      return (leftIndex < 0 ? order.length : leftIndex) - (rightIndex < 0 ? order.length : rightIndex);
    }
    return left.localeCompare(right, "zh-Hans-CN");
  });
}

function compareDirectionItems(left, right) {
  const groupOrder = ["学历项目", "非学历项目", ""];
  const leftGroup = groupOrder.indexOf(left.projectType);
  const rightGroup = groupOrder.indexOf(right.projectType);
  if (leftGroup !== rightGroup) {
    return (leftGroup < 0 ? groupOrder.length : leftGroup) - (rightGroup < 0 ? groupOrder.length : rightGroup);
  }
  if (left.sort !== right.sort) {
    return left.sort - right.sort;
  }
  return left.name.localeCompare(right.name, "zh-Hans-CN", { numeric: true });
}

function directionItemsFromNames(names) {
  return uniqueTextValues(names).map((name, index) => ({
    name,
    projectType: "",
    sort: index
  }));
}

function normalizeDirectionItems(items) {
  const seen = new Set();
  return (Array.isArray(items) ? items : [])
    .map((item) => ({
      name: String(item?.name || item?.direction || item || "").trim(),
      projectType: String(item?.projectType || "").trim(),
      sort: sortableNumber(item?.sort)
    }))
    .filter((item) => item.name)
    .filter((item) => {
      const key = `${item.projectType}::${item.name}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort(compareDirectionItems);
}

function parseDirectionPresetOptions(value) {
  return uniqueTextValues(
    String(value || "")
      .split(/[；;,，、/\n]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  );
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

function createSelectOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function optionalNumber(value) {
  if (String(value || "").trim() === "") {
    return "";
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : "";
}

function dateInputToDateTime(value) {
  const text = String(value || "").trim();
  return text ? `${text} 00:00:00` : "";
}

function addressValue(province, city) {
  const provinceText = String(province || "").trim();
  const cityText = String(city || "").trim();
  if (!provinceText && !cityText) {
    return "";
  }
  return {
    province: provinceText,
    city: cityText,
    district: "",
    detail: ""
  };
}

function enhanceSurveySelects() {
  [
    surveyDom.education,
    surveyDom.signupSource,
    surveyDom.projectTypeSelect,
    surveyDom.directionSelect
  ].forEach(enhanceCustomSelect);

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
  window.addEventListener("resize", scheduleOpenSelectReposition);
  window.addEventListener("scroll", scheduleOpenSelectReposition, true);
  window.visualViewport?.addEventListener("resize", scheduleOpenSelectReposition);
  window.visualViewport?.addEventListener("scroll", scheduleOpenSelectReposition);
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
    if (opening) {
      positionCustomSelectMenu(select);
      scrollSelectedOptionIntoView(optionsWrap);
    } else {
      resetCustomSelectMenu(menu, optionsWrap);
    }
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
    if (!option.value) {
      return;
    }

    const button = document.createElement("button");
    button.className = "select-option";
    button.type = "button";
    button.textContent = option.textContent;
    button.disabled = option.disabled;
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", option.selected ? "true" : "false");
    button.classList.toggle("selected", option.selected && Boolean(option.value));
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

  if (!menu.hidden) {
    positionCustomSelectMenu(select);
  }
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
  surveySelectPickers.forEach(({ menu, trigger, optionsWrap }, select) => {
    if (select === exceptSelect) {
      return;
    }
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    resetCustomSelectMenu(menu, optionsWrap);
  });
}

function scheduleOpenSelectReposition() {
  if (selectRepositionFrame) {
    return;
  }
  selectRepositionFrame = requestAnimationFrame(() => {
    selectRepositionFrame = 0;
    surveySelectPickers.forEach((controls, select) => {
      if (!controls.menu.hidden) {
        positionCustomSelectMenu(select);
      }
    });
  });
}

function positionCustomSelectMenu(select) {
  const controls = surveySelectPickers.get(select);
  if (!controls || controls.menu.hidden) {
    return;
  }

  const { trigger, menu, optionsWrap } = controls;
  const rect = trigger.getBoundingClientRect();
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const isMobile = viewportWidth <= 760;
  const sideInset = isMobile ? 8 : 0;
  const topInset = 8;
  const footer = document.querySelector(".inline-foot");
  const footerRect = footer?.getBoundingClientRect();
  const footerTop = footerRect && footerRect.top > 0
    ? Math.min(footerRect.top, viewportHeight)
    : viewportHeight;
  const bottomLimit = isMobile
    ? Math.max(topInset + 120, footerTop - 8)
    : viewportHeight - 12;
  const spaceBelow = bottomLimit - rect.bottom - 4;
  const spaceAbove = rect.top - topInset - 4;
  const openAbove = isMobile && spaceBelow < 180 && spaceAbove > spaceBelow;
  const availableHeight = openAbove ? spaceAbove : spaceBelow;
  const maxHeight = Math.max(120, Math.min(isMobile ? 360 : 260, availableHeight));
  const menuLeft = isMobile ? sideInset : Math.max(8, rect.left);
  const menuWidth = isMobile
    ? Math.max(240, viewportWidth - sideInset * 2)
    : Math.max(180, Math.min(rect.width, viewportWidth - menuLeft - 8));

  menu.classList.add("is-floating");
  menu.classList.toggle("is-above", openAbove);
  menu.style.left = `${menuLeft}px`;
  menu.style.right = "auto";
  menu.style.width = `${menuWidth}px`;
  menu.style.maxHeight = `${maxHeight}px`;
  if (openAbove) {
    menu.style.top = "auto";
    menu.style.bottom = `${Math.max(8, viewportHeight - rect.top + 4)}px`;
  } else {
    menu.style.top = `${Math.max(topInset, rect.bottom + 4)}px`;
    menu.style.bottom = "auto";
  }
  optionsWrap.style.maxHeight = `${Math.max(96, maxHeight - 12)}px`;
}

function resetCustomSelectMenu(menu, optionsWrap) {
  menu.classList.remove("is-floating", "is-above");
  menu.style.left = "";
  menu.style.right = "";
  menu.style.top = "";
  menu.style.bottom = "";
  menu.style.width = "";
  menu.style.maxHeight = "";
  optionsWrap.style.maxHeight = "";
}

function scrollSelectedOptionIntoView(optionsWrap) {
  const selected = optionsWrap.querySelector(".select-option.selected");
  if (selected) {
    selected.scrollIntoView({ block: "nearest" });
  }
}

function isProgramInterested() {
  if (isPromoTemplate() || isExperienceTemplate() || isExperienceDayTemplate()) {
    return true;
  }
  const intention = selectedRadioValue("intention");
  return intention.includes("是") || intention.includes("想了解");
}

function isPromoTemplate() {
  return currentQuestionnaireTemplate === QUESTIONNAIRE_TEMPLATE.promo ||
    currentQuestionnaireTemplate.includes("展架");
}

function isExperienceTemplate() {
  return currentQuestionnaireTemplate === QUESTIONNAIRE_TEMPLATE.experience;
}

function isExperienceDayTemplate() {
  return isSuzhouExperienceDayTemplate() ||
    isHefeiExperienceDayTemplate() ||
    isShanghaiExperienceDayTemplate() ||
    currentQuestionnaireTemplate.includes("体验日");
}

function isSuzhouExperienceDayTemplate() {
  return currentQuestionnaireTemplate === QUESTIONNAIRE_TEMPLATE.suzhouExperienceDay ||
    (currentQuestionnaireTemplate.includes("苏州") && currentQuestionnaireTemplate.includes("体验日"));
}

function isHefeiExperienceDayTemplate() {
  return currentQuestionnaireTemplate === QUESTIONNAIRE_TEMPLATE.hefeiExperienceDay ||
    (currentQuestionnaireTemplate.includes("合肥") && currentQuestionnaireTemplate.includes("体验日"));
}

function isShanghaiExperienceDayTemplate() {
  return currentQuestionnaireTemplate === QUESTIONNAIRE_TEMPLATE.shanghaiExperienceDay ||
    (currentQuestionnaireTemplate.includes("上海") && currentQuestionnaireTemplate.includes("体验日"));
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
  if (isPromoTemplate() || isExperienceTemplate() || isExperienceDayTemplate()) {
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
  if (isExperienceTemplate() && !selectedExperienceDirections().length) {
    setExperienceDirectionValidity("请至少选择一个申请项目");
  } else {
    clearExperienceDirectionValidity();
  }
  if (isExperienceTemplate() && !originAddressSelected()) {
    setOriginAddressValidity("请选择生源地省市");
  } else {
    clearOriginAddressValidity();
  }
  if (!surveyDom.form.reportValidity()) {
    setSurveyStatus("请检查必填项和格式", "error");
    return false;
  }
  return true;
}

function selectedExperienceDirections() {
  return Array.from(surveyDom.experienceDirectionInputs)
    .filter((input) => input.checked)
    .map((input) => input.value)
    .filter(Boolean);
}

function setExperienceDirectionValidity(message) {
  const firstInput = surveyDom.experienceDirectionInputs[0];
  if (firstInput) {
    firstInput.setCustomValidity(message);
  }
}

function clearExperienceDirectionValidity() {
  surveyDom.experienceDirectionInputs.forEach((input) => input.setCustomValidity(""));
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

function renderSurveyInvalid(message) {
  document.title = "二维码已失效";
  document.body.innerHTML = `
    <main class="survey-success-page">
      <section class="survey-success-card survey-invalid-card" role="status" aria-live="polite">
        <div class="survey-success-icon survey-invalid-icon" aria-hidden="true">!</div>
        <h1>二维码已失效</h1>
        <p>${escapeHtml(message || "该活动二维码已停用")}</p>
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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
