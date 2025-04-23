document.addEventListener("DOMContentLoaded", function () {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const urlInput = document.getElementById("urlInput");
  const resultsContainer = document.getElementById("resultsContainer");
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

  function analyzeSEO() {
    const url = urlInput.value.trim();

    if (!url) {
      showError("請輸入網址", "網址欄位不能為空。");
      return;
    }

    // 驗證網址格式
    try {
      new URL(url);
    } catch (e) {
      showError("無效的網址", "請輸入包含 http:// 或 https:// 的有效網址");
      return;
    }

    // 顯示載入狀態
    loadingSpinner.classList.remove("hidden");
    btnText.textContent = "分析中...";
    analyzeBtn.disabled = true;
    resultsContainer.classList.add("hidden");
    errorContainer.classList.add("hidden");

    // 在實際應用中，這裡會進行 API 呼叫
    // 在此演示中，我們將在延遲後模擬 API 回應
    setTimeout(() => {
      try {
        // 模擬 API 回應
        const seoData = simulateSEOAnalysis(url);
        displayResults(seoData);
      } catch (error) {
        showError("分析錯誤", error.message);
      } finally {
        loadingSpinner.classList.add("hidden");
        btnText.textContent = "分析";
        analyzeBtn.disabled = false;
      }
    }, 1500);
  }

  function simulateSEOAnalysis(url) {
    // 這是模擬 - 在實際應用中，您會從 API 獲取這些數據
    // 該 API 會抓取網址並分析其 SEO

    // 為演示目的隨機生成分數 (30-100)
    const score = Math.floor(Math.random() * 70) + 30;

    // 模擬的 meta 標籤
    const metaTags = {
      title: "範例頁面標題 - 您的網站名稱",
      description: "這是一個可能出現在搜尋結果中的範例 meta 描述。長度應在 50-160 個字元之間。",
      keywords: "範例, 關鍵字, seo, 測試",
      viewport: "width=device-width, initial-scale=1.0",
      "og:title": "範例 Open Graph 標題",
      "og:description": "這是用於社群分享的 Open Graph 描述範例。",
      "og:image": "https://via.placeholder.com/1200x630",
      "og:url": url,
      "og:type": "website",
      "twitter:card": "summary_large_image",
      "twitter:title": "範例 Twitter 卡片標題",
      "twitter:description": "這是 Twitter 卡片的描述範例。",
      "twitter:image": "https://via.placeholder.com/1200x630",
      canonical: url,
      robots: "index, follow",
    };

    // 模擬的 SEO 分析
    const analysis = [
      {
        title: "標題標籤",
        status: metaTags.title ? "good" : "bad",
        value: metaTags.title || "缺少",
        recommendation: metaTags.title
          ? metaTags.title.length > 60
            ? "考慮縮短 (最佳長度: 50-60 字元)"
            : "長度適當"
          : "添加描述性標題 (50-60 字元)",
        icon: metaTags.title ? "check-circle" : "times-circle",
        color: metaTags.title ? "green" : "red",
      },
      {
        title: "Meta 描述",
        status: metaTags.description ? "good" : "bad",
        value: metaTags.description || "缺少",
        recommendation: metaTags.description
          ? metaTags.description.length > 160
            ? "考慮縮短 (最佳長度: 50-160 字元)"
            : "長度適當"
          : "添加引人注目的描述 (50-160 字元)",
        icon: metaTags.description ? "check-circle" : "times-circle",
        color: metaTags.description ? "green" : "red",
      },
      {
        title: "Open Graph 標籤",
        status: metaTags["og:title"] && metaTags["og:description"] && metaTags["og:image"] ? "good" : "bad",
        value: metaTags["og:title"] ? "存在" : "缺少",
        recommendation: "社群分享必備",
        icon:
          metaTags["og:title"] && metaTags["og:description"] && metaTags["og:image"]
            ? "check-circle"
            : "times-circle",
        color: metaTags["og:title"] && metaTags["og:description"] && metaTags["og:image"] ? "green" : "red",
      },
      {
        title: "Twitter 卡片標籤",
        status:
          metaTags["twitter:card"] && metaTags["twitter:title"] && metaTags["twitter:image"] ? "good" : "bad",
        value: metaTags["twitter:title"] ? "存在" : "缺少",
        recommendation: "Twitter 分享重要標籤",
        icon:
          metaTags["twitter:card"] && metaTags["twitter:title"] && metaTags["twitter:image"]
            ? "check-circle"
            : "times-circle",
        color:
          metaTags["twitter:card"] && metaTags["twitter:title"] && metaTags["twitter:image"] ? "green" : "red",
      },
      {
        title: "行動裝置友善",
        status: metaTags.viewport ? "good" : "bad",
        value: metaTags.viewport ? "響應式" : "未知",
        recommendation: "確保設置 viewport meta 標籤",
        icon: metaTags.viewport ? "check-circle" : "times-circle",
        color: metaTags.viewport ? "green" : "red",
      },
      {
        title: "標準網址",
        status: metaTags.canonical ? "good" : "bad",
        value: metaTags.canonical ? "存在" : "缺少",
        recommendation: "有助於防止重複內容問題",
        icon: metaTags.canonical ? "check-circle" : "times-circle",
        color: metaTags.canonical ? "green" : "red",
      },
    ];

    return {
      score,
      analysis,
      metaTags,
      url,
    };
  }

  function displayResults(data) {
    // 更新分數
    scoreValue.textContent = data.score;
    const circumference = 251.2; // 2 * π * r (r=40)
    const offset = circumference - (circumference * data.score) / 100;
    scoreCircle.style.strokeDashoffset = offset;

    // 更新分析細節
    seoDetails.innerHTML = "";
    data.analysis.forEach((item) => {
      const itemHTML = `
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
                  </div>
              `;
      seoDetails.insertAdjacentHTML("beforeend", itemHTML);
    });

    // 更新社群預覽
    updateSocialPreview(facebookPreview, {
      title: data.metaTags["og:title"] || data.metaTags.title,
      description: data.metaTags["og:description"] || data.metaTags.description,
      image: data.metaTags["og:image"],
      site: new URL(data.url).hostname,
    });

    updateSocialPreview(twitterPreview, {
      title: data.metaTags["twitter:title"] || data.metaTags["og:title"] || data.metaTags.title,
      description:
        data.metaTags["twitter:description"] || data.metaTags["og:description"] || data.metaTags.description,
      image: data.metaTags["twitter:image"] || data.metaTags["og:image"],
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

    // 顯示結果
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

    // 滾動到錯誤訊息
    errorContainer.scrollIntoView({ behavior: "smooth" });
  }
});