#!/usr/bin/env node

/**
 * 茶飲應用開發助手腳本
 * 使用方法: node scripts/dev-helper.js [command]
 */

const fs = require('fs');
const path = require('path');

const commands = {
  help: () => {
    console.log(`
🍵 茶語時光開發助手

可用命令：
  help              顯示此幫助信息
  check-env         檢查環境變數配置
  mock-data         生成模擬數據文件
  clear-cache       清除開發緩存
  component [name]  快速創建新組件
  page [name]       快速創建新頁面
  api-test          測試 API 連接
  build-info        顯示建置信息
  
示例：
  node scripts/dev-helper.js check-env
  node scripts/dev-helper.js component MyComponent
  node scripts/dev-helper.js page SettingsPage
    `);
  },

  'check-env': () => {
    console.log('🔍 檢查環境變數...\n');
    
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env.local 文件不存在');
      console.log('💡 請創建 .env.local 文件並添加以下變數：');
      console.log(`
NEXT_PUBLIC_LIFF_ID=your-liff-id
NEXT_PUBLIC_BUBBLE_API_BASE=https://your-bubble-app.bubbleapps.io/api/1.1/wf
NEXT_PUBLIC_DEV_MODE=true
      `);
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'NEXT_PUBLIC_LIFF_ID',
      'NEXT_PUBLIC_BUBBLE_API_BASE',
      'NEXT_PUBLIC_DEV_MODE'
    ];

    let allGood = true;
    
    requiredVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`✅ ${varName} - 已設定`);
      } else {
        console.log(`❌ ${varName} - 未設定`);
        allGood = false;
      }
    });

    if (allGood) {
      console.log('\n🎉 所有環境變數都已正確設定！');
    } else {
      console.log('\n⚠️ 請補充缺失的環境變數');
    }
  },

  'clear-cache': () => {
    console.log('🧹 清除開發緩存...\n');
    
    const cachePaths = [
      '.next',
      'node_modules/.cache',
      '.vercel'
    ];

    cachePaths.forEach(cachePath => {
      const fullPath = path.join(process.cwd(), cachePath);
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ 已清除 ${cachePath}`);
      } else {
        console.log(`⚪ ${cachePath} 不存在`);
      }
    });

    console.log('\n🎉 緩存清除完成！');
  },

  'build-info': () => {
    console.log('📊 建置信息\n');

    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      console.log(`應用名稱: ${pkg.name}`);
      console.log(`版本: ${pkg.version}`);
      console.log(`Next.js: ${pkg.dependencies?.next || 'unknown'}`);
      console.log(`React: ${pkg.dependencies?.react || 'unknown'}`);
      console.log(`TypeScript: ${pkg.devDependencies?.typescript || 'unknown'}`);
      console.log(`Tailwind CSS: ${pkg.devDependencies?.tailwindcss || 'unknown'}`);
      
      console.log('\n📁 專案結構:');
      const appPath = path.join(process.cwd(), 'app/tea-app');
      if (fs.existsSync(appPath)) {
        const dirs = fs.readdirSync(appPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => `   - ${dirent.name}/`);
        console.log(dirs.join('\n'));
      }
    }

    console.log(`\n⏰ 建置時間: ${new Date().toLocaleString('zh-TW')}`);
  }
};

// 主執行邏輯
const [,, command, ...args] = process.argv;

if (!command || command === 'help') {
  commands.help();
} else if (commands[command]) {
  commands[command](...args);
} else {
  console.error(`❌ 未知命令: ${command}`);
  console.log('💡 使用 "help" 查看可用命令');
}
