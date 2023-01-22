const TelegramBot = require("node-telegram-bot-api");
const { config } = require("./config.js");

async function startBot() {
  const bot = await new TelegramBot(config.botToken, { polling: true })

  bot.onText(/\/echo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    await bot.sendMessage(chatId, resp);
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, "Received your message");
  });

  return bot
}

module.exports = {
  startBot
}
