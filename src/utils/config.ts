import dotenv from "dotenv"

dotenv.config()

interface ConfigFields {
  botToken: string,
  channelId: string,
  poolId: string,
  nodeUrl: string,
  cronTime: string,
}

const config = validateConfig();

function validateConfig(): ConfigFields {
  if (!process.env["BOT_TOKEN"] || !process.env["CHANNEL_ID"] || !process.env["POOL_ID"] || !process.env["NODE_URL"]) {
    throw Error("Invalid .env file, please check fields");
  } else {
    return {
      botToken: process.env["BOT_TOKEN"],
      channelId: process.env["CHANNEL_ID"],
      poolId: process.env["POOL_ID"],
      nodeUrl: process.env["NODE_URL"],
      cronTime: process.env["CRON_TIME"] ? process.env["CRON_TIME"] : "*/10 * * * *",
    }
  }
}

export default config;
