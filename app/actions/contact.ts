'use server';

export async function sendMessage(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const message = formData.get('message') as string;
  
  // 這裡可以整合 LINE Notify 或其他通知服務
  console.log('收到聯絡訊息:', { name, message });
  
  // 模擬 API 呼叫
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: '訊息已成功送出！',
    error: '',
  };
}
