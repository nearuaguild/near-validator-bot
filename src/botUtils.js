const { startBot } = require("./bot");
const { config } = require("./config.js");

let bot;

async function initializeBot() {
  bot = await startBot()
}

async function sendMessage(text) {
  await bot.sendMessage(config.channelId, text);
}

// export default {
//   sendMessage
// }

module.exports = {
  initializeBot,
  sendMessage
}