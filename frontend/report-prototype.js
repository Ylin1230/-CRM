const palette = ["#2f6fe4", "#a9bfdc", "#d8f278", "#b7df39", "#69a817", "#f0bd2f", "#2aa8c8", "#d86b73"];

const reportData = {
  admission: {
    title: "招生管理驾驶舱",
    strip: [
      ["报表口径", "招生全局"],
      ["汇报重点", "人群画像 / 来源 / 转化"],
      ["建议场景", "管理层月度复盘"]
    ],
    filters: [
      { label: "最高学历", kind: "select", options: ["等于任意一个", "本科", "硕士", "专科", "其他"] },
      { label: "报考方向", kind: "select", options: ["等于任意一个", "非全日制MBA综合管理方向", "科创EMBA", "科技金融方向"] },
      { label: "对接人", kind: "select", options: ["等于任意一个", "李婷婷", "鞠洪云", "张文君", "王海龙"] },
      { label: "年龄", kind: "range", values: ["16", "50"] }
    ],
    kpis: [
      { label: "意向报考数", value: 1314, unit: "个", delta: "+8.7%", trend: [13, 18, 16, 24, 30, 33, 39] },
      { label: "生源数", value: 426, unit: "个", delta: "+6.2%", trend: [8, 11, 13, 12, 18, 21, 23] },
      { label: "确认报名", value: 168, unit: "人", delta: "+4.9%", trend: [4, 6, 8, 7, 10, 13, 16] },
      { label: "转化率", value: "12.8", unit: "%", delta: "+1.5%", trend: [6, 7, 8, 8, 10, 11, 13] },
      { label: "平均年龄", value: "28.6", unit: "岁", delta: "+0.6", trend: [26, 27, 27, 28, 28, 29, 29] }
    ],
    sections: [
      { type: "profileCards", span: 4, title: "招生画像摘要", subtitle: "学历、行业、年龄核心特征", cards: [["主力学历", "本科", "76.8%"], ["高频行业", "制造业 / 技术创新", "各 27.3%"], ["年龄集中", "16周岁以下", "1,314人"]] },
      { type: "intentionBands", span: 4, title: "报考意向分层", subtitle: "意向等级分布", data: [["A", 50], ["B", 54], ["C", 189], ["D", 303], ["E", 232], ["待更新", 1]] },
      { type: "donut", span: 4, title: "生源学历", subtitle: "学历结构占比", data: [["本科", 162], ["专科及以下", 10], ["硕士", 21], ["博士及以上", 2], ["其他", 16]] },
      { type: "map", span: 7, title: "生源区域分布", subtitle: "重点城市报名热力", badge: "华东 64%", map: { max: 600, min: 200, markers: [["北京市", 220, 404, 142], ["南京", 260, 432, 202], ["合肥", 600, 412, 218, true], ["上海", 380, 462, 224]] } },
      { type: "rank", span: 5, title: "生源对接情况", subtitle: "对接人确认报名排名", data: [["李婷婷", 190], ["鞠洪云", 180], ["孔祥", 174], ["张文君", 164], ["王海龙", 163], ["武敬萍", 142], ["谢光源", 139], ["朱燕嘉", 57]] }
    ]
  },
  qualified: {
    title: "达线学员统计看板",
    strip: [
      ["报表口径", "达线学员"],
      ["汇报重点", "达线画像 / 确认报考 / 对接效率"],
      ["建议场景", "招生推进会"]
    ],
    filters: [],
    kpis: [
      { label: "达线人数", value: 6, unit: "人", delta: "+2", trend: [1, 1, 2, 2, 4, 5, 6] },
      { label: "确认报考人数", value: 0, unit: "人", delta: "0", trend: [0, 0, 0, 0, 0, 0, 0] },
      { label: "待确认人数", value: 6, unit: "人", delta: "+2", trend: [1, 1, 2, 2, 4, 5, 6] },
      { label: "平均年龄", value: "12.5", unit: "岁", delta: "+0.4", trend: [10, 11, 12, 12, 12, 13, 13] }
    ],
    sections: [
      { type: "qualifiedFlow", span: 3, title: "达线推进漏斗", subtitle: "达线后确认报考推进", data: [["达线学员", 6], ["已完成联系", 6], ["A类意愿", 3], ["确认报考", 0]] },
      { type: "donut", span: 3, title: "达线学历", subtitle: "达线学员学历结构", data: [["本科", 6]] },
      { type: "donut", span: 3, title: "所在行业", subtitle: "达线学员行业来源", data: [["互联网与大数据", 3], ["科技与创新", 2], ["生物医药与健康", 1]] },
      { type: "donut", span: 3, title: "意愿情况", subtitle: "确认报考意愿", data: [["A", 3], ["B有意向", 3]] },
      { type: "map", span: 6, title: "生源区域分布", subtitle: "达线生源省份分布", badge: "河北 3", map: { max: 3, min: 1, markers: [["北京市", 3, 404, 142, true], ["河北省", 3, 392, 166, true], ["安徽省", 1, 412, 218], ["上海", 1, 462, 224]] } },
      { type: "rank", span: 3, title: "生源对接情况", subtitle: "达线学员归属对接", data: [["小A", 1], ["张文君", 1], ["王海龙", 1], ["李婷婷", 1], ["孔祥", 1], ["鞠洪云", 1]] },
      { type: "qualifiedList", span: 3, title: "达线名单快照", subtitle: "待推进学员清单", rows: [["小A", "A", "北京", "待确认"], ["张文君", "B", "河北", "已联系"], ["王海龙", "A", "安徽", "待确认"], ["李婷婷", "B", "上海", "已联系"], ["孔祥", "A", "河北", "待确认"], ["鞠洪云", "B", "北京", "已联系"]] }
    ]
  },
  traffic: {
    title: "引流效果分析",
    strip: [
      ["报表口径", "渠道投放"],
      ["汇报重点", "访问量 / 留资 / 投放转化"],
      ["建议场景", "市场渠道复盘"]
    ],
    filters: [
      { label: "渠道名称", kind: "select", options: ["等于任意一个", "中国科大科技创新班", "小红书", "抖音"] },
      { label: "活动开始日期", kind: "dateRange", values: ["2026-05-01", "2026-05-31"] },
      { label: "活动结束日期", kind: "dateRange", values: ["2026-05-01", "2026-05-31"] }
    ],
    kpis: [
      { label: "渠道访问量", value: 18200, unit: "次", delta: "+15.8%", trend: [30, 36, 41, 47, 50, 55, 63] },
      { label: "意向提交数", value: 884, unit: "个", delta: "+9.1%", trend: [10, 12, 19, 22, 21, 30, 35] },
      { label: "生源数", value: 266, unit: "个", delta: "+5.4%", trend: [6, 7, 8, 11, 14, 15, 17] },
      { label: "确认报考转化", value: 72, unit: "人", delta: "+3.0%", trend: [2, 3, 5, 6, 7, 8, 10] }
    ],
    sections: [
      { type: "channelCards", span: 6, title: "渠道质量分层", subtitle: "按访问、意向、生源综合判断", cards: [["官网", "稳定转化", "146", "68"], ["小红书", "待激活", "0", "0"], ["抖音", "待激活", "0", "0"], ["朋友圈", "高意愿", "88", "32"]] },
      { type: "conversionTable", span: 6, title: "广告投放转化分析", subtitle: "渠道提交与生源转化", rows: [["中国科大科技创新班", 0, 0, "0 个"], ["小红书", 0, 0, "0 个"], ["抖音", 0, 0, "0 个"], ["官网", 146, 68, "24 个"], ["朋友圈", 88, 32, "18 个"]] },
      { type: "timeline", span: 6, title: "活动甘特图", subtitle: "渠道活动投放排期" },
      { type: "trafficFunnel", span: 3, title: "投放转化漏斗", subtitle: "访问到确认报考", data: [["访问", 18200], ["意向", 884], ["生源", 266], ["确认", 72]] },
      { type: "map", span: 3, title: "所属区域", subtitle: "渠道来源区域", badge: "合肥 600", map: { max: 600, min: 80, markers: [["合肥", 600, 412, 218, true], ["南京", 260, 432, 202], ["上海", 380, 462, 224]] } }
    ]
  },
  activity: {
    title: "活动分析报表",
    strip: [
      ["报表口径", "活动效果"],
      ["汇报重点", "活动画像 / 招生贡献 / 明细追踪"],
      ["建议场景", "单场活动复盘"]
    ],
    filters: [
      { label: "活动名称", kind: "select", options: ["等于任意一个", "中国科大2027MBA/EMBA项目发布会", "科创EMBA项目", "专业学位项目"] },
      { label: "活动开始日期", kind: "dateRange", values: ["2026-05-01", "2026-05-31"] },
      { label: "活动结束日期", kind: "dateRange", values: ["2026-05-01", "2026-05-31"] },
      { label: "活动类型", kind: "select", options: ["等于任意一个", "发布会", "直播", "讲座", "沙龙"] }
    ],
    kpis: [
      { label: "活动人数", value: 24610, unit: "人", delta: "+12.4%", trend: [20, 22, 28, 33, 37, 45, 52] },
      { label: "报考意向总数", value: 1314, unit: "个", delta: "+8.7%", trend: [13, 18, 16, 24, 30, 33, 39] },
      { label: "生源数", value: 426, unit: "个", delta: "+6.2%", trend: [8, 11, 13, 12, 18, 21, 23] },
      { label: "扫码转化率", value: "0.52", unit: "%", delta: "+0.10%", trend: [0.25, 0.27, 0.31, 0.34, 0.4, 0.46, 0.52] }
    ],
    sections: [
      { type: "activityMatrix", span: 6, title: "活动画像矩阵", subtitle: "人群、学历、方向、渠道摘要", rows: [["性别", "男", "16,610", "67.5%"], ["最高学历", "本科", "21,010", "79.5%"], ["报考方向", "综合管理", "10,000", "37.9%"], ["来源渠道", "项目发布会", "24,600", "99.9%"]] },
      { type: "activityCompare", span: 3, title: "活动贡献排行", subtitle: "活动人数与生源贡献", data: [["发布会", 3200, 92], ["科创项目", 2400, 68], ["专业学位", 100, 0], ["直播专场", 1800, 36]] },
      { type: "map", span: 3, title: "区域分布", subtitle: "活动生源区域", badge: "安徽 600", map: { max: 600, min: 200, markers: [["安徽省", 600, 412, 218, true], ["北京市", 220, 404, 142], ["上海", 380, 462, 224]] } },
      { type: "bars", span: 6, title: "职务分布", subtitle: "活动人群职位", unit: "人", data: [["理财顾问", 4010], ["企业管理", 1200], ["市场运营", 800], ["产品经理", 600], ["销售管理", 400]] },
      { type: "bars", span: 6, title: "工作单位", subtitle: "单位来源分布", unit: "人", data: [["111", 600], ["零学教育", 400], ["科创企业", 400], ["金融机构", 300]] },
      { type: "activityTable", span: 12, title: "活动分析", subtitle: "活动效果明细", rows: [["专业学位项目", 100, 0, 0, "0", "0"], ["中国科大2027MBA/EMBA项目发布会", 200, 1, 0, "0", "0.005"], ["中国科大科创EMBA项目", 200, 1, 0, "0", "0.005"], ["抖音直播招生专场", 3200, 303, 92, "36", "0.095"]] }
    ]
  }
};

let currentReport = "admission";

initPrototype();

function initPrototype() {
  bindActions();
  renderReport();
}

function bindActions() {
  document.querySelectorAll(".board-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      currentReport = button.dataset.view;
      document.querySelectorAll(".board-tabs button").forEach((item) => item.classList.toggle("active", item === button));
      renderReport();
    });
  });

  document.querySelector('[data-action="refresh"]')?.addEventListener("click", () => {
    document.body.classList.add("refreshing");
    window.setTimeout(() => document.body.classList.remove("refreshing"), 520);
  });

  document.querySelector('[data-action="presentation"]')?.addEventListener("click", () => {
    document.body.classList.toggle("presentation-mode");
  });

  document.querySelector('[data-action="fullscreen"]')?.addEventListener("click", async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await document.documentElement.requestFullscreen();
  });
}

function renderReport() {
  const report = reportData[currentReport];
  document.body.dataset.report = currentReport;
  document.querySelector("[data-report-title]").textContent = report.title;
  renderFilters(report.filters);
  renderKpis(report.kpis);
  document.querySelector("[data-dashboard-grid]").innerHTML = report.sections.map(renderSection).join("");
}

function renderFilters(filters) {
  const target = document.querySelector("[data-filter-band]");
  if (!filters.length) {
    target.hidden = true;
    target.innerHTML = "";
    target.classList.add("is-empty");
    return;
  }

  target.hidden = false;
  target.classList.remove("is-empty");
  target.innerHTML = filters.map(renderFilter).join("");
}

function renderFilter(filter) {
  if (filter.kind === "range") {
    return `
      <label>
        <span>${filter.label}</span>
        <div class="date-range">
          <input type="number" value="${filter.values[0]}" />
          <b>至</b>
          <input type="number" value="${filter.values[1]}" />
        </div>
      </label>
    `;
  }

  if (filter.kind === "dateRange") {
    return `
      <label>
        <span>${filter.label}</span>
        <div class="date-range">
          <input type="date" value="${filter.values[0]}" />
          <b>至</b>
          <input type="date" value="${filter.values[1]}" />
        </div>
      </label>
    `;
  }

  return `
    <label>
      <span>${filter.label}</span>
      <select>
        ${filter.options.map((option) => `<option>${option}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderKpis(kpis) {
  document.querySelector("[data-kpi-grid]").innerHTML = kpis
    .map((item, index) => {
      const tone = ["blue", "cyan", "green", "amber", "slate"][index % 5];
      return `
        <article class="kpi-card tone-${tone}">
          <div class="kpi-topline">
            <strong>${item.label}</strong>
          </div>
          <div class="kpi-value"><b>${formatValue(item.value)}</b><span>${item.unit}</span></div>
        </article>
      `;
    })
    .join("");
}

function renderSection(section) {
  const badge = section.badge ? `<strong>${section.badge}</strong>` : "";
  return `
    <article class="panel span-${section.span || 3} type-${section.type}">
      <header class="panel-head compact-head">
        <div>
          <h2>${section.title}</h2>
          <span>${section.subtitle}</span>
        </div>
        ${badge}
      </header>
      ${renderSectionBody(section)}
    </article>
  `;
}

function renderSectionBody(section) {
  if (section.type === "donut") {
    return renderDonut(section.data);
  }
  if (section.type === "bars") {
    return renderBars(section.data, section.unit);
  }
  if (section.type === "rank") {
    return renderRank(section.data);
  }
  if (section.type === "map") {
    return renderMap(section);
  }
  if (section.type === "timeline") {
    return renderTimeline();
  }
  if (section.type === "trend") {
    return renderTrend(section);
  }
  if (section.type === "conversionTable") {
    return renderConversionTable(section.rows);
  }
  if (section.type === "activityTable") {
    return renderActivityTable(section.rows);
  }
  if (section.type === "qualifiedFlow") {
    return renderQualifiedFlow(section.data);
  }
  if (section.type === "qualifiedList") {
    return renderQualifiedList(section.rows);
  }
  if (section.type === "profileCards") {
    return renderProfileCards(section.cards);
  }
  if (section.type === "intentionBands") {
    return renderIntentionBands(section.data);
  }
  if (section.type === "channelCards") {
    return renderChannelCards(section.cards);
  }
  if (section.type === "trafficFunnel") {
    return renderTrafficFunnel(section.data);
  }
  if (section.type === "activityMatrix") {
    return renderActivityMatrix(section.rows);
  }
  if (section.type === "activityCompare") {
    return renderActivityCompare(section.data);
  }
  return "";
}

function renderDonut(data) {
  const total = data.reduce((sum, [, value]) => sum + value, 0);
  let offset = 0;
  const circles = data
    .map(([, value], index) => {
      const pct = total ? (value / total) * 100 : 0;
      const circle = `
        <circle
          cx="90"
          cy="90"
          r="58"
          fill="none"
          stroke="${palette[index % palette.length]}"
          stroke-width="28"
          stroke-dasharray="${pct} ${100 - pct}"
          stroke-dashoffset="${-offset}"
          pathLength="100"
          transform="rotate(-90 90 90)"
        ></circle>
      `;
      offset += pct;
      return circle;
    })
    .join("");
  const legend = data
    .map(([label, value], index) => {
      const pct = total ? ((value / total) * 100).toFixed(1) : "0.0";
      return `
        <div class="metric-item">
          <i style="background:${palette[index % palette.length]}"></i>
          <span title="${label}">${label}</span>
          <strong>${pct}%</strong>
        </div>
      `;
    })
    .join("");

  return `
    <div class="donut-layout">
      <div class="donut-chart">
        <svg viewBox="0 0 180 180" aria-label="占比图">
          <circle cx="90" cy="90" r="58" fill="none" stroke="#eef3f9" stroke-width="28"></circle>
          ${circles}
          <circle cx="90" cy="90" r="42" fill="#ffffff"></circle>
          <text class="donut-center" x="90" y="86" text-anchor="middle">${formatValue(total)}</text>
          <text class="donut-label" x="90" y="107" text-anchor="middle">总量</text>
        </svg>
      </div>
      <div class="metric-list">${legend}</div>
    </div>
  `;
}

function renderBars(data, unit = "") {
  const max = Math.max(...data.map(([, value]) => value), 1);
  const rows = data
    .map(([label, value], index) => {
      const width = Math.max(2, (value / max) * 100);
      return `
        <div class="rank-row">
          <span title="${label}">${label}</span>
          <div class="rank-track"><div class="rank-bar" style="width:${width}%; background:${palette[index % palette.length]}"></div></div>
          <strong>${formatValue(value)}${unit}</strong>
        </div>
      `;
    })
    .join("");
  return `<div class="rank-list">${rows}</div>`;
}

function renderRank(data) {
  return renderBars(data, "");
}

function renderMap(section) {
  const map = section.map || {};
  const markers = map.markers || [["安徽省", 600, 412, 218, true], ["北京市", 220, 404, 142], ["上海", 380, 462, 224]];
  const markerNodes = markers
    .map(([name, value, x, y, primary]) => {
      const labelX = x + (primary ? 9 : 7);
      const labelY = y - (primary ? 11 : 7);
      return `
        <g class="china-marker ${primary ? "is-primary" : ""}">
          <circle cx="${x}" cy="${y}" r="${primary ? 7 : 5}"></circle>
          <text x="${labelX}" y="${labelY}">${name}</text>
          <text x="${labelX}" y="${labelY + 16}">${value}</text>
        </g>
      `;
    })
    .join("");

  return `
    <div class="map-wrap">
      <svg class="map-svg china-map" viewBox="0 0 640 420" aria-label="生源区域分布图">
        <defs>
          <linearGradient id="mapScaleBlue" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#2f6fe4"></stop>
            <stop offset="100%" stop-color="#a6ddeb"></stop>
          </linearGradient>
        </defs>
        <g class="china-shape">
          <path class="china-land" d="M74 230 104 188 148 176 168 147 205 159 241 126 283 137 314 105 353 118 385 85 427 96 451 64 491 72 516 106 560 111 596 146 577 181 604 225 561 251 530 286 480 279 440 315 383 300 329 335 277 308 216 312 180 279 122 286 88 256Z"></path>
          <path class="china-land" d="M449 64 470 35 510 48 516 106 491 72Z"></path>
          <path class="china-land" d="M88 256 50 265 24 242 49 213 74 230Z"></path>
          <path class="china-land" d="M566 297 586 322 574 354 552 329Z"></path>
          <path class="province-line" d="M104 188 143 213 186 202 241 126M143 213 168 268 216 312M205 159 228 209 277 222 314 105M283 137 311 186 353 118M311 186 351 209 385 85M351 209 392 190 427 96M392 190 440 218 491 72M440 218 480 279M351 209 329 335M277 222 277 308M480 279 530 286 561 251M440 218 501 233 560 111M501 233 530 286M383 300 440 315M180 279 216 250 277 222"></path>
          <path class="china-highlight-soft" d="M384 170 421 151 453 168 446 203 413 220 382 201Z"></path>
          <path class="china-highlight" d="M411 190 443 180 470 201 459 231 421 239 392 218Z"></path>
          <path class="china-highlight-soft" d="M459 231 492 222 515 243 493 267 459 259Z"></path>
        </g>
        ${markerNodes}
        <g class="map-scale">
          <rect x="42" y="250" width="14" height="112" rx="7" fill="url(#mapScaleBlue)"></rect>
          <text x="66" y="260">${map.max || 600}</text>
          <text x="66" y="363">${map.min || 200}</text>
        </g>
      </svg>
    </div>
  `;
}

function renderTimeline() {
  const items = [
    { name: "MBA/EMBA发布会", start: 9, end: 11, color: "blue" },
    { name: "科创EMBA项目", start: 10, end: 13, color: "cyan" },
    { name: "柏森教学", start: 12, end: 13, color: "amber" },
    { name: "抖音直播", start: 14, end: 15, color: "green" },
    { name: "小红书种草", start: 14, end: 17, color: "" },
    { name: "专业学位项目", start: 23, end: 24, color: "green" }
  ];
  const days = Array.from({ length: 16 }, (_, index) => index + 9);
  const header = `<div class="timeline-label">活动名称</div>${days.map((day) => `<div class="timeline-day">${day}</div>`).join("")}`;
  const rows = items
    .map((item) => {
      const cells = days
        .map((day) => {
          const active = day >= item.start && day <= item.end;
          return `<div class="timeline-cell">${active ? `<span class="timeline-bar ${item.color}"></span>` : ""}</div>`;
        })
        .join("");
      return `<div class="timeline-label">${item.name}</div>${cells}`;
    })
    .join("");
  return `<div class="timeline"><div class="timeline-grid">${header}${rows}</div></div>`;
}

function renderTrend(section) {
  const values = section.series[0].values;
  const width = 820;
  const height = 248;
  const pad = { top: 16, right: 22, bottom: 34, left: 44 };
  const max = Math.max(...values, 1);
  const x = (index) => pad.left + (index / (values.length - 1)) * (width - pad.left - pad.right);
  const y = (value) => pad.top + (1 - value / max) * (height - pad.top - pad.bottom);
  const grid = [0, 0.25, 0.5, 0.75, 1]
    .map((ratio) => {
      const yy = pad.top + (1 - ratio) * (height - pad.top - pad.bottom);
      return `<line class="grid-line" x1="${pad.left}" y1="${yy}" x2="${width - pad.right}" y2="${yy}"></line><text x="10" y="${yy + 4}">${Math.round(max * ratio)}</text>`;
    })
    .join("");
  const labels = section.labels.map((label, index) => `<text x="${x(index)}" y="${height - 8}" text-anchor="middle">${label}</text>`).join("");
  const dots = values.map((value, index) => `<circle class="chart-dot" cx="${x(index)}" cy="${y(value)}" r="4" fill="${section.series[0].color}"></circle>`).join("");

  return `
    <div class="chart-area">
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="${section.title}">
        ${grid}
        <line class="axis-line" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line>
        <path class="line-blue" d="${makeLinePath(values, x, y)}"></path>
        ${dots}
        ${labels}
      </svg>
    </div>
  `;
}

function renderConversionTable(rows) {
  return `
    <div class="data-table-wrap">
      <table class="prototype-table">
        <thead>
          <tr>
            <th>渠道名称</th>
            <th>报考意向提交数</th>
            <th>生源数</th>
            <th>确认报考转化</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr><td>${row[0]}</td><td class="num">${row[1]}</td><td class="num">${row[2]}</td><td class="num">${row[3]}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderActivityTable(rows) {
  return `
    <div class="data-table-wrap">
      <table class="prototype-table">
        <thead>
          <tr>
            <th>活动名称</th>
            <th>活动人数</th>
            <th>报考意向总数</th>
            <th>生源数</th>
            <th>确认报考转化</th>
            <th>活动扫码转化</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr><td>${row[0]}</td><td class="num">${row[1]}</td><td class="num">${row[2]}</td><td class="num">${row[3]}</td><td class="num">${row[4]}</td><td class="num">${row[5]}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderQualifiedFlow(data) {
  const max = Math.max(...data.map(([, value]) => value), 1);
  return `
    <div class="qualified-flow">
      ${data
        .map(([label, value], index) => {
          const width = Math.max(4, (value / max) * 100);
          return `
            <div class="flow-step">
              <div class="flow-step-head">
                <span>${label}</span>
                <strong>${value}人</strong>
              </div>
              <div class="flow-track"><i style="width:${width}%; background:${palette[index % palette.length]}"></i></div>
            </div>
          `;
        })
        .join("")}
      <div class="flow-note">
        <strong>重点</strong>
        <span>当前确认报名为 0，建议优先推进 A 类意愿学员。</span>
      </div>
    </div>
  `;
}

function renderQualifiedList(rows) {
  return `
    <div class="qualified-list">
      ${rows
        .map(([name, intention, area, status]) => {
          const statusClass = status === "待确认" ? "warning" : "info";
          return `
            <div class="qualified-person">
              <strong>${name}</strong>
              <span>${area}</span>
              <b>${intention}</b>
              <em class="${statusClass}">${status}</em>
            </div>
          `;
        })
        .join("")}
    </div>
      `;
}

function renderProfileCards(cards) {
  return `
    <div class="profile-card-grid">
      ${cards
        .map(([label, value, detail], index) => `
          <div class="profile-card-item">
            <i style="background:${palette[index % palette.length]}"></i>
            <span>${label}</span>
            <strong>${value}</strong>
            <em>${detail}</em>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderIntentionBands(data) {
  const max = Math.max(...data.map(([, value]) => value), 1);
  return `
    <div class="intention-board">
      ${data
        .map(([label, value], index) => {
          const height = Math.max(20, (value / max) * 140);
          return `
            <div class="intention-column">
              <div class="intention-bar" style="height:${height}px; background:${palette[index % palette.length]}"></div>
              <strong>${value}</strong>
              <span>${label}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderChannelCards(cards) {
  return `
    <div class="channel-card-grid">
      ${cards
        .map(([name, status, intent, source], index) => `
          <div class="channel-card">
            <div>
              <strong>${name}</strong>
              <span>${status}</span>
            </div>
            <i style="background:${palette[index % palette.length]}"></i>
            <dl>
              <dt>意向</dt><dd>${intent}</dd>
              <dt>生源</dt><dd>${source}</dd>
            </dl>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderTrafficFunnel(data) {
  const max = Math.max(...data.map(([, value]) => value), 1);
  return `
    <div class="traffic-funnel">
      ${data
        .map(([label, value], index) => {
          const width = Math.max(14, (value / max) * 100);
          return `
            <div class="traffic-funnel-row">
              <span>${label}</span>
              <strong>${formatValue(value)}</strong>
              <i style="width:${width}%; background:${palette[index % palette.length]}"></i>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderActivityMatrix(rows) {
  return `
    <div class="activity-matrix">
      ${rows
        .map(([topic, main, value, pct], index) => `
          <div class="activity-matrix-cell">
            <span>${topic}</span>
            <strong>${main}</strong>
            <div>
              <b>${value}</b>
              <em style="color:${palette[index % palette.length]}">${pct}</em>
            </div>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderActivityCompare(data) {
  const maxPeople = Math.max(...data.map(([, people]) => people), 1);
  const maxSource = Math.max(...data.map(([, , source]) => source), 1);
  return `
    <div class="activity-compare">
      ${data
        .map(([name, people, source]) => `
          <div class="activity-compare-row">
            <span>${name}</span>
            <div class="compare-bars">
              <i style="width:${Math.max(3, (people / maxPeople) * 100)}%"></i>
              <b style="width:${Math.max(3, (source / maxSource) * 100)}%"></b>
            </div>
            <strong>${source}</strong>
          </div>
        `)
        .join("")}
      <div class="compare-legend"><span><i></i>活动人数</span><span><b></b>生源数</span></div>
    </div>
  `;
}

function makeLinePath(values, x, y) {
  return values.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`).join(" ");
}

function formatValue(value) {
  if (typeof value === "string") {
    return value;
  }
  return new Intl.NumberFormat("zh-CN").format(value);
}
