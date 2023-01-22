import config from "./config.js";
import startBot from "./bot.js";

const bot = await startBot();

async function sendMessage(text) {
  await bot.sendMessage(config.channelId, text)
}

export default {
  sendMessage
}
