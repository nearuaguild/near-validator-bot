import dotenv from "dotenv"

dotenv.config()

interface ConfigFields {
  botToken: string,
  channelId: string,
  poolId: string,
}

const config = validateConfig();

function validateConfig(): ConfigFields {
  if (!process.env["BOT_TOKEN"] || !process.env["CHANNEL_ID"] || !process.env["POOL_ID"]) {
    throw Error("Invalid .env file, please check fields");
  } else {
    return {
      botToken: process.env["BOT_TOKEN"],
      channelId: process.env["CHANNEL_ID"],
      poolId: process.env["POOL_ID"],
    }
  }
}

export default config;
