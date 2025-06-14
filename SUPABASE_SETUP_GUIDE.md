# 🎯 Supabase 資料庫設置指南

## 📋 **Step 1: 在 Supabase Dashboard 執行 SQL**

1. **前往 Supabase Dashboard**
   - 打開 https://supabase.com/dashboard
   - 選擇你的專案

2. **執行表格創建 SQL**
   - 點擊左側導航欄的 **"SQL Editor"**
   - 點擊 **"New Query"** 
   - 複製 `supabase-setup.sql` 文件的所有內容
   - 貼上到查詢編輯器中
   - 點擊 **"Run"** 執行

3. **確認執行結果**
   - 應該會看到 "Success" 訊息
   - 檢查左側 "Database" → "Tables" 是否有以下表格：
     - `users`
     - `stores` 
     - `products`
     - `orders`
     - `order_items`

## 🔧 **Step 2: 設置 Vercel 環境變數**

1. **前往 Vercel Dashboard**
   - 打開 https://vercel.com/dashboard
   - 選擇專案 `2506-line-liff-app`

2. **添加 Supabase 環境變數**
   - 點擊 **Settings** → **Environment Variables**
   - 添加以下環境變數：

### 必要環境變數：

**變數 1: NEXT_PUBLIC_SUPABASE_URL**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environment: Production, Preview, Development (全選)
```

**變數 2: SUPABASE_SERVICE_ROLE_KEY**
```
Key: SUPABASE_SERVICE_ROLE_KEY  
Value: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Environment: Production, Preview, Development (全選)
```

### 如何取得這些值：

1. **SUPABASE_URL** - 在 Supabase Dashboard：
   - 前往 **Settings** → **API**
   - 複製 **Project URL**

2. **SUPABASE_SERVICE_ROLE_KEY** - 在 Supabase Dashboard：
   - 前往 **Settings** → **API**  
   - 複製 **service_role** secret (不是 anon public)
   - ⚠️ **注意**：這是敏感資料，不要公開

## 🚀 **Step 3: 部署和測試**

### 自動重新部署
添加環境變數後，Vercel 會自動重新部署應用（約 3-5 分鐘）

### 測試連接
重新部署完成後，訪問：
```
https://www.aipowered.top/api/init
```

**預期成功結果：**
```json
{
  "status": "success",
  "message": "資料庫連線正常",
  "database_type": "Supabase",
  "connection_type": "Native Client",
  "supabase_url": "https://your-project-id.supabase.co"
}
```

### 初始化資料庫
連接成功後，發送 POST 請求：
```bash
curl -X POST https://www.aipowered.top/api/init
```

或在瀏覽器 Console 中執行：
```javascript
fetch('https://www.aipowered.top/api/init', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

**預期初始化結果：**
```json
{
  "message": "資料庫初始化成功！",
  "status": "success", 
  "database_type": "Supabase",
  "connection_type": "Native Client",
  "tables_initialized": [
    "stores (門市資訊) - 3 筆資料",
    "products (商品資料) - 8 筆資料"
  ]
}
```

### 測試 API 端點
初始化成功後，測試以下端點：
```
https://www.aipowered.top/api/products
https://www.aipowered.top/api/stores
https://www.aipowered.top/tea-app
```

## ❗ **常見問題解決**

### 1. 連接失敗：缺少環境變數
**錯誤訊息：**
```json
{
  "status": "error",
  "error": "缺少 Supabase 環境變數"
}
```

**解決方法：**
- 確認已正確添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`
- 確認環境變數值沒有多餘的空格
- 等待 Vercel 重新部署完成

### 2. 連接失敗：Supabase 專案問題
**錯誤訊息：**
```json
{
  "status": "error",
  "message": "Supabase 資料庫連線失敗"
}
```

**解決方法：**
- 確認 Supabase 專案狀態為 "Active"
- 檢查 SUPABASE_URL 格式：`https://xxx.supabase.co`
- 確認 Service Role Key 正確且未過期
- 檢查專案是否有計費問題

### 3. 表格不存在錯誤
**錯誤訊息：**
```
relation "products" does not exist
```

**解決方法：**
- 確認已在 Supabase SQL Editor 中執行 `supabase-setup.sql`
- 檢查表格是否在 Database → Tables 中可見
- 重新執行 SQL 創建腳本

### 4. 權限錯誤
**錯誤訊息：**
```
permission denied for table products
```

**解決方法：**
- 確認使用的是 `service_role` key 而不是 `anon` key
- 檢查 Supabase 專案的 RLS (Row Level Security) 設定
- 如果啟用了 RLS，可能需要創建相應的政策

## 🎉 **成功指標**

當一切設置正確時，你應該能看到：

1. ✅ `/api/init` 回傳連接成功
2. ✅ `/api/products` 回傳 8 個商品
3. ✅ `/api/stores` 回傳 3 個門市
4. ✅ `/tea-app` 頁面正常載入並顯示資料

## 📝 **後續開發**

設置完成後，你可以：
- 在前端使用這些 API 端點
- 在 Supabase Dashboard 中查看和編輯資料
- 添加更多商品和門市
- 擴展功能和新的 API 端點

## 🔗 **相關文件**

- `supabase-setup.sql` - 資料庫表格創建腳本
- `app/api/init/route.ts` - 初始化 API
- `app/api/products/route.ts` - 商品 API
- `app/api/stores/route.ts` - 門市 API

---

**如果遇到問題，請提供錯誤訊息和相關設置截圖以便進一步診斷。**
