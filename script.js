const titles = {
  pm: "研究速览",
  researcher: "研究员工作台",
  company: "公司视图",
  archive: "成果中心",
  governance: "事项管理"
};

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setScreen(name) {
  const next = titles[name] ? name : "pm";
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === `screen-${next}`);
  });
  document.querySelectorAll(".nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === next);
  });
  document.getElementById("pageTitle").textContent = titles[next];
  const url = new URL(window.location.href);
  url.searchParams.set("screen", next);
  window.history.replaceState({}, "", url);
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-screen]").forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.screen));
});

document.querySelectorAll("[data-screen-link]").forEach((button) => {
  button.addEventListener("click", () => setScreen(button.dataset.screenLink));
});

document.querySelectorAll("[data-action='sync']").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "已同步";
    button.disabled = true;
    showToast("已更新研究成果");
  });
});

document.querySelectorAll("[data-action='open-company']").forEach((button) => {
  button.addEventListener("click", () => setScreen("company"));
});

document.querySelectorAll("[data-action='open-archive']").forEach((button) => {
  button.addEventListener("click", () => setScreen("archive"));
});

document.querySelectorAll("[data-action='contact']").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("已复制联系人信息；即时沟通继续使用公司既有沟通渠道");
  });
});

document.querySelectorAll("[data-action='favorite']").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "已收藏";
    button.disabled = true;
    showToast("已收藏该正式研究成果");
  });
});

document.querySelectorAll("[data-action='ask-ai']").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = document.getElementById("pmAiAnswer");
    if (answer) answer.classList.remove("hidden");
    showToast("已生成材料摘要");
  });
});

document.querySelectorAll("[data-action='publish-dynamic']").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "已发布";
    button.disabled = true;
    const count = document.getElementById("publishedCount");
    if (count) count.textContent = "3";
    showToast("研究更新已发布");
  });
});

document.querySelectorAll("[data-action='keep-channel']").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("草稿已保存");
  });
});

document.querySelectorAll("[data-action='confirm-permission']").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "权限已核验";
    button.disabled = true;
    showToast("访问范围已确认");
  });
});

document.querySelectorAll(".filter-row button").forEach((button) => {
  button.addEventListener("click", () => {
    button.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    showToast(`已筛选：${button.textContent}`);
  });
});

const archiveSearch = document.querySelector(".knowledge-search");
if (archiveSearch) {
  archiveSearch.querySelector("button").addEventListener("click", () => {
    const keyword = archiveSearch.querySelector("input").value.trim();
    showToast(keyword ? `正在检索正式成果：${keyword}` : "请输入公司、行业或关键词");
  });
}

document.querySelectorAll("[data-action='export-audit']").forEach((button) => {
  button.addEventListener("click", () => showToast("审计记录导出任务已创建"));
});

document.querySelectorAll("[data-action='export-tasks']").forEach((button) => {
  button.addEventListener("click", () => showToast("制度性事项清单已生成"));
});

document.querySelectorAll("[data-action='export-pilot']").forEach((button) => {
  button.addEventListener("click", () => showToast("试点复盘数据已生成"));
});

const initial = new URLSearchParams(window.location.search).get("screen");
setScreen(initial || document.body.dataset.defaultScreen || "pm");
