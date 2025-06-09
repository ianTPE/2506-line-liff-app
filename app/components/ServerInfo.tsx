// 這是一個 Server Component（預設）
async function getServerData() {
  // 模擬從伺服器取得資料
  const data = {
    serverTime: new Date().toISOString(),
    version: '1.0.0',
  };
  return data;
}

export default async function ServerInfo() {
  const data = await getServerData();
  
  return (
    <div className="bg-blue-50 p-4 rounded-md">
      <h3 className="font-semibold mb-2">伺服器資訊</h3>
      <p className="text-sm">時間：{data.serverTime}</p>
      <p className="text-sm">版本：{data.version}</p>
    </div>
  );
}
