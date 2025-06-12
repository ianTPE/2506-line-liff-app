# 茶語時光 - LIFF 茶飲預約系統

這是一個基於 Next.js 15、React 19 和 LINE LIFF 的完整茶飲預約應用系統。

## 🌟 功能特色

### 核心功能
- **🏠 商品瀏覽** - 分類展示、搜尋篩選、商品詳情
- **🛒 購物車系統** - 即時計算、客製化選項、數量調整
- **📅 預約系統** - 即時/預約取餐、門市選擇、排隊狀況
- **👤 會員中心** - 等級制度、點數累積、錢包儲值

### 技術特色
- **🔐 LINE 登入** - 無縫 LIFF 整合，自動用戶識別
- **💾 本地儲存** - 購物車持久化，離線體驗
- **📱 響應式設計** - 完美適配手機端使用
- **🎨 現代化 UI** - Tailwind CSS，流暢動畫效果

## 🚀 快速開始

### 環境要求
- Node.js 18+
- npm 或 yarn
- LINE Developer 帳號

### 安裝步驟

1. **安裝依賴**
```bash
npm install
```

2. **環境變數設定**
複製 `.env.local` 並設定以下變數：
```bash
# LINE LIFF ID
NEXT_PUBLIC_LIFF_ID=your-liff-id-here

# Bubble API 端點
NEXT_PUBLIC_BUBBLE_API_BASE=https://your-bubble-app.bubbleapps.io/api/1.1/wf

# 開發模式
NEXT_PUBLIC_DEV_MODE=true
```

3. **啟動開發伺服器**
```bash
npm run dev
```

4. **訪問應用**
- 主頁：http://localhost:3000
- 茶飲應用：http://localhost:3000/tea-app

## 📁 專案結構

```
app/
├── tea-app/                    # 茶飲應用主目錄
│   ├── components/            # React 組件
│   │   ├── pages/            # 頁面組件
│   │   │   ├── HomePage.tsx      # 首頁 - 商品展示
│   │   │   ├── CartPage.tsx      # 購物車頁面
│   │   │   ├── BookingPage.tsx   # 預約頁面
│   │   │   └── MemberPage.tsx    # 會員中心
│   │   ├── AppHeader.tsx         # 應用標題列
│   │   ├── NavigationTabs.tsx    # 底部導航
│   │   ├── ProductModal.tsx      # 商品詳情彈窗
│   │   ├── LoadingSpinner.tsx    # 載入動畫
│   │   └── TeaAppMain.tsx        # 主要容器組件
│   ├── providers/             # Context Providers
│   │   └── TeaAppProvider.tsx    # 主要狀態管理
│   ├── utils/                 # 工具函數
│   │   └── index.ts              # 通用工具函數
│   └── page.tsx               # 路由入口
├── components/                # 共用組件
├── providers/                 # 全域 Providers
└── types/                     # TypeScript 類型定義
    └── tea-app.ts             # 茶飲應用類型定義
```

## 🛠️ 技術架構

### 前端技術棧
- **Next.js 15** - React 全端框架
- **React 19** - UI 函式庫
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式框架
- **LINE LIFF SDK** - LINE 平台整合

### 狀態管理
- **React Context** - 全域狀態管理
- **Local Storage** - 本地數據持久化
- **Custom Hooks** - 邏輯復用

### API 整合
- **Bubble.io** - 後端服務
- **RESTful API** - 數據交換
- **LINE Messaging API** - 推播通知

## 📝 API 端點

### 用戶相關
- `POST /register-user` - 註冊/更新用戶
- `GET /get-user-data` - 取得用戶資料

### 商品相關
- `GET /get-products` - 取得商品列表
- `GET /get-products?category={category}` - 分類商品

### 訂單相關
- `POST /create-order` - 創建訂單
- `GET /get-store-availability` - 門市可用性

### 門市相關
- `GET /get-stores` - 取得門市列表
- `GET /get-queue-status` - 排隊狀況

## 🎨 自定義配置

### 主題色彩
```css
/* 主要漸層色 */
.primary-gradient {
  background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
}

/* 次要漸層色 */
.secondary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 會員等級配置
```typescript
const membershipLevels = {
  bronze: { pointsRate: 1, benefits: ['點數回饋 1%'] },
  silver: { pointsRate: 1.5, benefits: ['點數回饋 1.5%', '預約免排隊'] },
  gold: { pointsRate: 2, benefits: ['點數回饋 2%', '每週免費飲品'] },
};
```

## 🔧 開發指南

### 新增商品分類
1. 更新 `types/tea-app.ts` 中的 `Product['category']` 類型
2. 在 `HomePage.tsx` 中添加新的分類標籤
3. 更新 `utils/index.ts` 中的 `getCategoryIcon` 函數

### 新增客製化選項
1. 更新 `ProductCustomizations` 介面
2. 在 `ProductModal.tsx` 中添加新的選項組件
3. 更新 `getCustomizationLabel` 函數

### 新增付款方式
1. 更新 `Order['payment_method']` 類型
2. 在 `CartPage.tsx` 中添加新的付款選項
3. 更新 `createOrder` API 邏輯

## 📱 部署指南

### Vercel 部署
1. 連接 GitHub 倉庫到 Vercel
2. 設定環境變數
3. 部署完成後更新 LIFF 端點 URL

### 環境變數設定
```bash
# Vercel 環境變數
NEXT_PUBLIC_LIFF_ID=your-production-liff-id
NEXT_PUBLIC_BUBBLE_API_BASE=your-production-api-base
NEXT_PUBLIC_DEV_MODE=false
```

## 🐛 常見問題

### LIFF 初始化失敗
- 檢查 LIFF ID 是否正確
- 確認域名已加入 LIFF 端點設定
- 檢查瀏覽器控制台錯誤訊息

### API 請求失敗
- 檢查 Bubble API 端點 URL
- 確認 CORS 設定正確
- 檢查 API 工作流程是否啟用

### 購物車資料遺失
- 檢查瀏覽器是否支援 Local Storage
- 確認隱私模式下的儲存限制
- 檢查 JSON 序列化/反序列化邏輯

## 🤝 貢獻指南

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案

## 📞 聯絡資訊

- 專案連結：https://github.com/your-username/liff-tea-app
- 問題回報：https://github.com/your-username/liff-tea-app/issues
- 功能建議：https://github.com/your-username/liff-tea-app/discussions

---

## 🎯 開發路線圖

### v1.1 計劃功能
- [ ] AI 智慧推薦系統
- [ ] 社群分享功能
- [ ] 群組訂購功能
- [ ] AR 商品預覽

### v1.2 計劃功能
- [ ] 多語言支援
- [ ] PWA 離線功能
- [ ] 推播通知系統
- [ ] 數據分析儀表板

---

感謝使用茶語時光 LIFF 茶飲預約系統！🍵✨
