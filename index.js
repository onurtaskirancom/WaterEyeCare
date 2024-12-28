const axios = require('axios');
const schedule = require('node-schedule');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

let notificationsActive = false; // Bildirim durumu
let lastUpdateId = 0; // İşlenmiş son mesajın ID'si

// Telegram API URL'si
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Mesaj Gönderme Fonksiyonu
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

// Mesajları Dinleme Fonksiyonu
async function getUpdates() {
  const url = `${TELEGRAM_API_URL}/getUpdates`;

  try {
    const response = await axios.get(url);
    const updates = response.data.result;

    updates.forEach((update) => {
      // Yalnızca yeni mesajları işleyin
      if (update.update_id > lastUpdateId) {
        lastUpdateId = update.update_id; // İşlenen son mesajın ID'sini güncelleyin
        const messageText = update.message?.text;

        if (messageText === '/start' || messageText === '/baslat') {
          if (!notificationsActive) {
            notificationsActive = true;
            sendTelegramMessage('Bildirimler başlatıldı! 💧');
          }
        } else if (messageText === '/stop' || messageText === '/durdur') {
          if (notificationsActive) {
            notificationsActive = false;
            sendTelegramMessage('Bildirimler durduruldu! 🚫');
          }
        }
      }
    });
  } catch (error) {
    console.error('Mesajlar alınamadı:', error.response?.data || error.message);
  }
}

// Bildirim Zamanlayıcıları
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

// Botu Çalıştır
setInterval(getUpdates, 3000); // Her 3 saniyede bir yeni mesajları kontrol et
console.log('Bot çalışıyor...');
