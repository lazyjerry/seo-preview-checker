# SEO 與社群媒體預覽檢查工具

⚡️ 一個前端純靜態的工具，可即時分析任意網頁的 SEO 設定，並模擬 Facebook、Twitter、LinkedIn 等社群平台的分享預覽。

## 功能特色

- **即時抓取並解析**：使用 `fetch` 取得目標網頁 HTML，通過 `DOMParser` 解析 `<title>`、`<meta>`、Open Graph 與 Twitter 卡片等標籤。
- **分數評估**：根據重要 SEO 項目（標題、描述、OG 標籤、Twitter 卡片、行動裝置友善、canonical）進行檢查並計算總分。
- **動態渲染結果**：以圓環進度條顯示 SEO 分數，並列出各項檢查結果、建議與狀態圖示。
- **社群預覽模擬**：模擬 Facebook、Twitter、LinkedIn 的分享卡片外觀，方便預覽內容、標題、圖片等。

## 專案結構

```bash
├── index.html       # 主頁面結構，引用 style.css 與 script.js
├── style.css        # 全站樣式，包含 loading spinner、卡片懸停動畫、進度條動畫
└── script.js        # 主程式邏輯，包括網頁抓取、解析、計算與渲染
```

## 使用說明

1. 將此專案 clone 或下載到本地：
   ```bash
   git clone https://github.com/lazyjerry/seo-preview-checker.git
   cd seo-social-preview-tool
   ```
2. 打開 `index.html`：
   - 直接在瀏覽器中開啟（Chrome、Firefox 等）。
   - 若遇到 CORS 限制，可透過本機靜態伺服器(如 `http-server`)執行：
     ```bash
     npm install -g http-server
     http-server . -c-1
     ```

```

3. 在輸入框填入欲分析的網址，按下「分析」按鈕，即可看到 SEO 分數與社群預覽效果。

## 注意事項

- **CORS 問題**：瀏覽器預設限制跨域請求。若目標網站未開啟 CORS，將無法抓取 HTML。可選擇：
  1. 在後端部署代理 (proxy) 接口。
  2. 使用 CORS Proxy 服務，例如 Cloudflare CORS Anywhere（https://github.com/Zibri/cloudflare-cors-anywhere）。
  3. 於 local server 模式下測試。

## 客製化 & 擴充

- 可自行新增更多 SEO 檢查項目（如 `robots.txt` 檢測、圖片壓縮建議等）。
- 若要部署到 Serverless（如 Cloudflare Workers），可將 `simulateSEOAnalysis` 移至後端執行以避免 CORS。

## 開源授權

本專案採用 [MIT License](LICENSE)。歡迎自由使用、修改、分享。

---

> 若有問題或建議，請在 [Issues](https://github.com/lazyjerry/seo-preview-checker/issues) 提交或聯絡作者：[lazyjerry@example.com](mailto\:lazyjerry@example.com)。
```
