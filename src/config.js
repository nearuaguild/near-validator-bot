const dotenv = require("dotenv");

dotenv.config()

const config = {
  botToken: process.env.BOT_TOKEN,
  channelId: process.env.CHANNEL_ID,
  poolId: process.env.POOL_ID,
  accountId: process.env.ACCOUNT_ID
}

// export default config;

module.exports = {
  config
};