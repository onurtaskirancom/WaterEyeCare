const axios = require('axios');
const schedule = require('node-schedule');

require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
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

schedule.scheduleJob('0 * * * *', () => {
  sendTelegramMessage('Saat başı hatırlatma: Kendine dikkat et ve su iç! 💧');
});

schedule.scheduleJob('*/30 * * * *', () => {
  sendTelegramMessage('Gözlerinizi dinlendirin! Uzağa bakın ve 20 saniye mola verin. 👀');
});
