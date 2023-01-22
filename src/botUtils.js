import config from "./config";
import { bot } from "./bot";

export async function sendMessage(text) {
  await bot.sendMessage(config.channelId, text)
}
