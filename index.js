const axios = require('axios');
const schedule = require('node-schedule');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

let notificationsActive = false; // Notification status

// Telegram API URL
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

//Message Sending Function
async function sendTelegramMessage(message) {
  const url = `${TELEGRAM_API_URL}/sendMessage`;
  const params = {
    chat_id: CHAT_ID,
    text: message,
  };

  try {
    const response = await axios.post(url, params);
    console.log('Mesaj gönderildi:', response.data);
  } catch (error) {
    console.error('Mesaj gönderilemedi:', error.response?.data || error.message);
  }
}

// Listening to Messages Function
async function getUpdates() {
  const url = `${TELEGRAM_API_URL}/getUpdates`;

  try {
    const response = await axios.get(url);
    const updates = response.data.result;

    updates.forEach((update) => {
      const messageText = update.message?.text;

      if (messageText === '/start' || messageText === '/baslat') {
        notificationsActive = true;
        sendTelegramMessage('Bildirimler başlatıldı! 💧');
      } else if (messageText === '/stop' || messageText === '/durdur') {
        notificationsActive = false;
        sendTelegramMessage('Bildirimler durduruldu! 🚫');
      }
    });
  } catch (error) {
    console.error('Mesajlar alınamadı:', error.response?.data || error.message);
  }
}

// Notification Timers
schedule.scheduleJob('0 * * * *', () => {
  if (notificationsActive) {
    sendTelegramMessage('Saat başı hatırlatma: Kendine dikkat et ve su iç! 💧');
  }
});

schedule.scheduleJob('*/30 * * * *', () => {
  if (notificationsActive) {
    sendTelegramMessage('Gözlerinizi dinlendirin! Uzağa bakın ve 20 saniye mola verin. 👀');
  }
});

// Run Bot
setInterval(getUpdates, 3000); // Check for new messages every 3 seconds
console.log('Bot çalışıyor...');
