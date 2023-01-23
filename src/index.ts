// const cron = require("node-cron");
// const { getStatistics } = require("./statistics");
// const { initializeBot } = require("./bot");

import Bot from "./bot";
import Statistics from "./statistics";
import cron from "node-cron";

(async () => {
  await Bot.initializeBot();
  cron.schedule("* * * * *", async () => {
    await Statistics.getStatistics();
  });
  console.log('Everything is Fine!')
})()
