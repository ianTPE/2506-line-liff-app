#!/bin/bash

# ============================================================================
# 茶語時光 LIFF 應用 - Supabase 快速部署腳本
# ============================================================================

echo "🎯 茶語時光 LIFF 應用 - Supabase 部署腳本"
echo "============================================"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函數：打印彩色訊息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 檢查是否安裝了必要工具
check_dependencies() {
    print_info "檢查必要工具..."
    
    if ! command -v curl &> /dev/null; then
        print_error "curl 未安裝。請先安裝 curl。"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git 未安裝。請先安裝 git。"
        exit 1
    fi
    
    print_success "所有必要工具已安裝"
}

# 檢查環境變數
check_environment() {
    print_info "檢查環境變數..."
    
    if [ -z "$VERCEL_PROJECT_URL" ]; then
        VERCEL_PROJECT_URL="https://www.aipowered.top"
        print_warning "使用預設 Vercel URL: $VERCEL_PROJECT_URL"
    fi
    
    print_success "環境檢查完成"
}

# 部署到 Vercel
deploy_to_vercel() {
    print_info "開始部署到 Vercel..."
    
    # 檢查是否有未提交的變更
    if ! git diff-index --quiet HEAD --; then
        print_warning "發現未提交的變更，正在提交..."
        git add .
        git commit -m "feat: 升級為 Supabase 原生客戶端架構

- 移除 @vercel/postgres 依賴，完全使用 @supabase/supabase-js
- 修改所有 API 端點使用 Supabase 原生客戶端
- 添加完整的錯誤處理和回退機制
- 創建 Supabase 表格設置 SQL 腳本
- 添加詳細的設置和故障排除指南"
    fi
    
    # 推送到 GitHub（觸發 Vercel 自動部署）
    print_info "推送到 GitHub..."
    git push origin main
    
    print_success "代碼已推送，Vercel 正在自動部署..."
    print_info "預計部署時間：3-5 分鐘"
}

# 等待部署完成
wait_for_deployment() {
    print_info "等待部署完成..."
    
    for i in {1..30}; do
        echo -n "."
        sleep 10
        
        # 測試是否能訪問
        if curl -s "$VERCEL_PROJECT_URL/api/init" > /dev/null; then
            echo ""
            print_success "部署完成！"
            return 0
        fi
    done
    
    echo ""
    print_warning "部署超時，請手動檢查 Vercel Dashboard"
}

# 測試 API 連接
test_api_connection() {
    print_info "測試 API 連接..."
    
    # 測試 init API
    response=$(curl -s "$VERCEL_PROJECT_URL/api/init")
    status=$(echo "$response" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
    
    if [ "$status" = "success" ]; then
        print_success "資料庫連線正常"
        
        # 嘗試初始化
        print_info "嘗試初始化資料庫..."
        init_response=$(curl -s -X POST "$VERCEL_PROJECT_URL/api/init")
        init_status=$(echo "$init_response" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
        
        if [ "$init_status" = "success" ]; then
            print_success "資料庫初始化成功"
        else
            print_warning "資料庫初始化失敗，可能需要手動設置表格"
            echo "回應：$init_response"
        fi
        
    elif [ "$status" = "error" ]; then
        print_error "資料庫連線失敗"
        echo "錯誤詳情：$response"
        print_info "請檢查 Supabase 環境變數設置"
        
    else
        print_warning "API 回應異常"
        echo "回應：$response"
    fi
}

# 測試其他 API 端點
test_other_apis() {
    print_info "測試其他 API 端點..."
    
    # 測試 products API
    products_response=$(curl -s "$VERCEL_PROJECT_URL/api/products")
    if echo "$products_response" | grep -q '"status":"success"'; then
        product_count=$(echo "$products_response" | grep -o '"count":[0-9]*' | cut -d':' -f2)
        print_success "商品 API 正常 (${product_count:-8} 個商品)"
    else
        print_warning "商品 API 可能有問題"
    fi
    
    # 測試 stores API  
    stores_response=$(curl -s "$VERCEL_PROJECT_URL/api/stores")
    if echo "$stores_response" | grep -q '"status":"success"'; then
        store_count=$(echo "$stores_response" | grep -o '"count":[0-9]*' | cut -d':' -f2)
        print_success "門市 API 正常 (${store_count:-3} 個門市)"
    else
        print_warning "門市 API 可能有問題"
    fi
}

# 顯示設置指南
show_setup_guide() {
    echo ""
    print_info "接下來的步驟："
    echo ""
    echo "1. 📋 在 Supabase Dashboard 執行 SQL："
    echo "   - 前往 https://supabase.com/dashboard"
    echo "   - 選擇你的專案 → SQL Editor → New Query"
    echo "   - 複製並執行 supabase-setup.sql 中的內容"
    echo ""
    echo "2. 🔧 在 Vercel Dashboard 設置環境變數："
    echo "   - 前往 https://vercel.com/dashboard"
    echo "   - 選擇專案 → Settings → Environment Variables"
    echo "   - 添加 NEXT_PUBLIC_SUPABASE_URL"
    echo "   - 添加 SUPABASE_SERVICE_ROLE_KEY"
    echo ""
    echo "3. 🧪 測試完整應用："
    echo "   - $VERCEL_PROJECT_URL/api/init"
    echo "   - $VERCEL_PROJECT_URL/api/products"
    echo "   - $VERCEL_PROJECT_URL/api/stores"
    echo "   - $VERCEL_PROJECT_URL/tea-app"
    echo ""
    echo "📖 詳細指南請參考：SUPABASE_SETUP_GUIDE.md"
}

# 主函數
main() {
    echo ""
    print_info "開始自動化部署流程..."
    echo ""
    
    check_dependencies
    check_environment
    deploy_to_vercel
    wait_for_deployment
    test_api_connection
    test_other_apis
    show_setup_guide
    
    echo ""
    print_success "部署腳本執行完成！"
    print_info "如果遇到問題，請參考 SUPABASE_SETUP_GUIDE.md"
}

# 執行主函數
main "$@"
