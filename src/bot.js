import TelegramBot from "node-telegram-bot-api";
import config from "./config.js";

export async function startBot() {
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