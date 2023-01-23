import Bot from "./bot";
import Statistics from "./statistics";
import cron from "node-cron";

(async () => {
  await Bot.initializeBot();
  cron.schedule("0 * * * *", async () => {
    await Statistics.getStatistics();
  });
  console.log('Everything is Fine!')
})()
