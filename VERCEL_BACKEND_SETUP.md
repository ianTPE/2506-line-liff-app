# 🚀 Vercel 後端設定指南

## 📋 概述

已將茶語時光應用從 Bubble.io 遷移至 **Vercel 全家桶**，包括：
- **前端**: Next.js + React (原有架構保持不變)
- **後端**: Vercel API Routes + Vercel Postgres
- **部署**: 統一在 Vercel 平台

## 🛠️ 本地開發設定

### 1. 安裝依賴
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```

### 3. 初始化資料庫 (首次執行)
訪問：`http://localhost:3000/api/init`
- 建立所有資料表
- 插入初始門市和商品資料

## 🌐 部署到 Vercel

### 1. 推送代碼到 GitHub
```bash
git add .
git commit -m "Switch to Vercel backend"
git push origin main
```

### 2. 在 Vercel 中設定 Postgres 資料庫

#### 方法一：Vercel Dashboard
1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇你的專案
3. 點擊 **Storage** → **Create Database**
4. 選擇 **Postgres**
5. 填入資料庫名稱 (如: `tea-app-db`)
6. 點擊 **Create**

#### 方法二：Vercel CLI
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入 Vercel
vercel login

# 在專案目錄中執行
vercel

# 建立 Postgres 資料庫
vercel postgres create tea-app-db
```

### 3. 初始化生產環境資料庫
部署完成後，訪問：`https://your-app.vercel.app/api/init`

## 🗂️ API 端點說明

### 商品相關
- `GET /api/products` - 取得所有商品
- `GET /api/products?category=tea` - 取得特定分類商品

### 用戶相關
- `POST /api/users` - 註冊/更新用戶
- `GET /api/users?user_id=xxx` - 取得用戶資料

### 訂單相關
- `POST /api/orders` - 建立訂單
- `GET /api/orders?user_id=xxx` - 取得用戶訂單

### 門市相關
- `GET /api/stores` - 取得所有門市
- `PATCH /api/stores` - 更新門市排隊狀況

### 資料庫管理
- `POST /api/init` - 初始化資料庫結構和基本資料

## 📊 資料庫結構

### users (用戶)
```sql
- id (VARCHAR) - 用戶ID
- line_user_id (VARCHAR) - LINE用戶ID
- display_name (VARCHAR) - 顯示名稱
- membership_level (VARCHAR) - 會員等級
- points_balance (INTEGER) - 點數餘額
- wallet_balance (DECIMAL) - 錢包餘額
```

### products (商品)
```sql
- id (VARCHAR) - 商品ID
- name (VARCHAR) - 商品名稱
- price (DECIMAL) - 價格
- category (VARCHAR) - 分類
- description (TEXT) - 描述
- availability_status (BOOLEAN) - 供應狀態
```

### orders (訂單)
```sql
- id (VARCHAR) - 訂單ID
- user_id (VARCHAR) - 用戶ID
- store_id (VARCHAR) - 門市ID
- total_amount (DECIMAL) - 總金額
- order_status (VARCHAR) - 訂單狀態
- order_type (VARCHAR) - 訂單類型
```

### stores (門市)
```sql
- id (VARCHAR) - 門市ID
- name (VARCHAR) - 門市名稱
- address (TEXT) - 地址
- current_queue_count (INTEGER) - 目前排隊人數
- average_wait_time (INTEGER) - 平均等候時間
```

## 🔧 開發工具

### 檢查資料庫連線
```bash
# 在 Vercel CLI 中
vercel env pull .env.local
```

### 本地測試 API
```bash
# 測試商品 API
curl http://localhost:3000/api/products

# 測試門市 API  
curl http://localhost:3000/api/stores
```

## 🚨 故障排除

### 1. 資料庫連線失敗
- 確認 Vercel Postgres 已建立
- 檢查環境變數是否正確設定
- 嘗試重新部署專案

### 2. API 回應 500 錯誤
- 查看 Vercel Functions 日誌
- 確認資料庫表格已建立 (執行 `/api/init`)

### 3. 前端顯示模擬資料
- 代表 API 連線失敗，但有 fallback 機制
- 檢查 `/api/products` 是否正常回應

## 📈 效能監控

### Vercel Analytics
- 自動啟用，可在 Vercel Dashboard 查看
- 監控 API 回應時間和錯誤率

### 資料庫監控
- 在 Vercel Storage 頁面查看資料庫使用狀況
- 監控查詢效能和連線數

## 🔄 後續改進

### 可考慮的優化：
1. **快取策略**: 為商品和門市資料添加快取
2. **資料庫索引**: 為常用查詢欄位建立索引
3. **錯誤處理**: 完善 API 錯誤回應格式
4. **資料驗證**: 添加輸入資料驗證中間件
5. **測試**: 建立 API 端點的單元測試

### 擴展功能：
1. **推播通知**: 整合 LINE Notify
2. **分析報表**: 銷售和用戶行為分析
3. **庫存管理**: 商品庫存追蹤
4. **優惠券系統**: 折扣和促銷功能

---

## 💡 小提示

- **成本控制**: Vercel 有免費額度，小型應用完全夠用
- **擴展性**: 如需更多功能，可輕鬆添加新的 API Routes
- **維護性**: 所有代碼都在同個 repo，版本控制更簡單
- **效能**: API Routes 與前端在同個 edge network，延遲更低
