const TelegramBot = require('node-telegram-bot-api');
const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('AFK Bot is Online 24/7'));
app.listen(3000, () => console.log('Web server ready'));

const token = '8873774008:AAHFyMGf5kVc8HlTQhXwyV4VZpPAUmHJPkk';
const bot = new TelegramBot(token, { polling: true });

let mcBot = null;

bot.onText(/\/on/, (msg) => {
    const chatId = msg.chat.id;
    if (mcBot) {
        bot.sendMessage(chatId, '⚠️ البوت داخل السيرفر حالياً!');
        return;
    }

    bot.sendMessage(chatId, '⏳ جاري إدخال البوت إلى سيرفر أترنوس...');
    
    mcBot = mineflayer.createBot({
        host: 'Me204.aternos.me',
        port: 25565,
        username: 'AFK_Telegram_Bot'
    });

    mcBot.on('spawn', () => {
        bot.sendMessage(chatId, '✅ تم دخول البوت بنجاح! السيرفر لن يغلق الآن.');
        
        setInterval(() => {
            if (mcBot) {
                mcBot.setControlState('jump', true);
                setTimeout(() => mcBot.setControlState('jump', false), 500);
            }
        }, 40000);
    });

    mcBot.on('end', () => {
        bot.sendMessage(chatId, '🔴 تم فصل البوت عن السيرفر.');
        mcBot = null;
    });

    mcBot.on('error', (err) => {
        bot.sendMessage(chatId, '❌ حدث خطأ أثناء الاتصال بالسيرفر.');
    });
});

bot.onText(/\/off/, (msg) => {
    const chatId = msg.chat.id;
    if (mcBot) {
        mcBot.quit();
        mcBot = null;
        bot.sendMessage(chatId, '🛑 تم إخراج البوت من السيرفر.');
    } else {
        bot.sendMessage(chatId, 'ℹ️ البوت غير متصل بالسيرفر.');
    }
});
