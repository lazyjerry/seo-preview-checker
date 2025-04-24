document.addEventListener("DOMContentLoaded", function () {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const urlInput = document.getElementById("urlInput");
  const resultsContainer = document.getElementById("resultsContainer");
  const description = document.getElementById("description");
  const errorContainer = document.getElementById("errorContainer");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const btnText = document.getElementById("btnText");
  const scoreValue = document.getElementById("scoreValue");
  const scoreCircle = document.getElementById("scoreCircle");
  const seoDetails = document.getElementById("seoDetails");
  const metaTags = document.getElementById("metaTags");

  // 社群預覽元素
  const facebookPreview = {
    image: document.getElementById("facebookImage"),
    site: document.getElementById("facebookSite"),
    title: document.getElementById("facebookTitle"),
    description: document.getElementById("facebookDescription"),
  };
  const twitterPreview = {
    image: document.getElementById("twitterImage"),
    site: document.getElementById("twitterSite"),
    title: document.getElementById("twitterTitle"),
    description: document.getElementById("twitterDescription"),
  };
  const linkedinPreview = {
    image: document.getElementById("linkedinImage"),
    site: document.getElementById("linkedinSite"),
    title: document.getElementById("linkedinTitle"),
    description: document.getElementById("linkedinDescription"),
  };

  analyzeBtn.addEventListener("click", analyzeSEO);
  urlInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") analyzeSEO();
  });

  async function analyzeSEO() {
    const url = urlInput.value.trim();
    if (!url) {
      showError("請輸入網址", "網址欄位不能為空。");
      return;
    }
    try {
      new URL(url);
    } catch {
      showError("無效的網址", "請輸入包含 http:// 或 https:// 的有效網址");
      return;
    }

    loadingSpinner.classList.remove("hidden");
    btnText.textContent = "分析中...";
    analyzeBtn.disabled = true;
    resultsContainer.classList.add("hidden");
    description.classList.remove("hidden");
    errorContainer.classList.add("hidden");

    try {
      const seoData = await simulateSEOAnalysis(url);
      displayResults(seoData);
    } catch (err) {
      showError("分析錯誤", err.message);
    } finally {
      loadingSpinner.classList.add("hidden");
      btnText.textContent = "分析";
      analyzeBtn.disabled = false;
    }
  }

  async function simulateSEOAnalysis(url) {
    // 1. 抓取目標網頁
    const resp = await fetch('https://seo-cors.jlib-cf.workers.dev?'+url);
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // 2. 取 Meta 功能
    const getMeta = (sel, attr = "content") => {
      const el = doc.querySelector(sel);
      return el ? (el.getAttribute(attr) || "").trim() : "";
    };

    // 3. 擷取標籤
    const meta = {
      title: (doc.querySelector("title")?.innerText || "").trim(),
      description: getMeta('meta[name="description"]'),
      keywords: getMeta('meta[name="keywords"]'),
      viewport: getMeta('meta[name="viewport"]'),
      canonical: doc.querySelector('link[rel="canonical"]')?.href || "",
      robots: getMeta('meta[name="robots"]'),
      "og:title": getMeta('meta[property="og:title"]'),
      "og:description": getMeta('meta[property="og:description"]'),
      "og:image": getMeta('meta[property="og:image"]'),
      "og:url": getMeta('meta[property="og:url"]'),
      "og:type": getMeta('meta[property="og:type"]'),
      "twitter:card": getMeta('meta[name="twitter:card"]'),
      "twitter:title": getMeta('meta[name="twitter:title"]'),
      "twitter:description": getMeta('meta[name="twitter:description"]'),
      "twitter:image": getMeta('meta[name="twitter:image"]'),
    };

    // 4. 檢查項目
    const checks = [
      {
        title: "標題標籤 title",
        value: meta.title,
        valid: !!meta.title,
        recommendation: !meta.title
          ? "添加描述性標題 (50-60 字元)"
          : meta.title.length < 50
          ? "長度過短 (建議 50-60 字元)"
          : meta.title.length > 60
          ? "長度過長 (建議 50-60 字元)"
          : "長度適當",
      },
      {
        title: "Meta 描述 description",
        value: meta.description,
        valid: !!meta.description,
        recommendation: !meta.description
          ? "添加引人注目的描述 (50-160 字元)"
          : meta.description.length < 50
          ? "長度過短 (建議 50-160 字元)"
          : meta.description.length > 160
          ? "長度過長 (建議 50-160 字元)"
          : "長度適當",
      },
      {
        title: "Open Graph 標籤 og:title / description / image",
        value: meta["og:title"] ? "存在" : ( (meta["og:title"] && meta["og:description"] && meta["og:image"]) ? "部分缺少": "缺少"),
        valid: meta["og:title"] && meta["og:description"] && meta["og:image"],
        recommendation: "社群分享必備",
      },
      {
        title: "Twitter 卡片標籤 twitter:title / description / image",
        value: meta["twitter:card"] ? "存在" : "缺少",
        valid:
          meta["twitter:card"] &&
          meta["twitter:title"] &&
          meta["twitter:image"],
        recommendation: "Twitter 分享重要標籤",
      },
      {
        title: "行動裝置友善 viewport",
        value: meta.viewport ? "響應式" : "缺少",
        valid: !!meta.viewport,
        recommendation: "確保設置 viewport meta 標籤",
      },
      {
        title: "標準網址 canonical",
        value: meta.canonical ? "存在" : "缺少",
        valid: !!meta.canonical,
        recommendation: "有助於防止重複內容問題",
      },
    ];

    // 5. 計算分數
    const validCount = checks.filter((c) => c.valid).length;
    const score = Math.round((validCount / checks.length) * 100);

    // 6. 格式化分析結果
    const analysis = checks.map((item) => ({
      title: item.title,
      status: item.valid ? "good" : "bad",
      value: item.value || "缺少",
      recommendation: item.recommendation,
      icon: item.valid ? "check-circle" : "times-circle",
      color: item.valid ? "green" : "red",
    }));

    return { score, analysis, metaTags: meta, url };
  }

  function displayResults(data) {
    // 更新分數
    scoreValue.textContent = data.score;
    const circumference = 251.2;
    const offset = circumference - (data.score / 100) * circumference;
    scoreCircle.style.strokeDashoffset = offset;

    // 更新分析細節
    seoDetails.innerHTML = "";
    data.analysis.forEach((item) => {
      const html = `
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <i class="fas fa-${item.icon} text-${item.color}-500 mr-3"></i>
            </div>
            <div>
              <h3 class="font-bold text-gray-800">${item.title}</h3>
              <p class="text-sm text-gray-600 mt-1">${item.value}</p>
              <p class="text-xs mt-2 text-${item.color}-600">${item.recommendation}</p>
            </div>
          </div>
        </div>`;
      seoDetails.insertAdjacentHTML("beforeend", html);
    });

    // 更新社群預覽
    updateSocialPreview(facebookPreview, {
      title: data.metaTags["og:title"] || data.metaTags.title,
      description: data.metaTags["og:description"] || data.metaTags.description,
      image: data.metaTags["og:image"],
      site: new URL(data.url).hostname,
    });
    updateSocialPreview(twitterPreview, {
      title:
        data.metaTags["twitter:title"] ||
        data.metaTags["og:title"] ||
        data.metaTags.title,
      description:
        data.metaTags["twitter:description"] ||
        data.metaTags["og:description"] ||
        data.metaTags.description,
      image:
        data.metaTags["twitter:image"] || data.metaTags["og:image"],
      site: new URL(data.url).hostname,
    });
    updateSocialPreview(linkedinPreview, {
      title: data.metaTags["og:title"] || data.metaTags.title,
      description: data.metaTags["og:description"] || data.metaTags.description,
      image: data.metaTags["og:image"],
      site: new URL(data.url).hostname,
    });

    // 顯示原始 meta 標籤
    metaTags.textContent = JSON.stringify(data.metaTags, null, 2);
    description.classList.add("hidden");
    resultsContainer.classList.remove("hidden");

  }

  function updateSocialPreview(preview, data) {
    if (data.title) preview.title.textContent = data.title;
    if (data.description) preview.description.textContent = data.description;
    if (data.site) preview.site.textContent = data.site;
    if (data.image) {
      preview.image.innerHTML = "";
      const img = document.createElement("img");
      img.src = data.image;
      img.alt = "";
      img.className = "w-full h-full object-cover";
      preview.image.appendChild(img);
    }
  }

  function showError(title, message) {
    errorContainer.classList.remove("hidden");
    document.getElementById("errorTitle").textContent = title;
    document.getElementById("errorMessage").innerHTML = `<p>${message}</p>`;
    errorContainer.scrollIntoView({ behavior: "smooth" });
  }
});