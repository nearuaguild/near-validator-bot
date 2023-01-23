import Bot from "./services/bot";
import Metrics from "./services/metrics";
import cron from "node-cron";
import Notification from "./services/notification";

(async () => {
  const metrics = new Metrics();
  const myBot = new Bot(metrics);
  await myBot.initializeBot();

  cron.schedule("0 * * * *", async () => {
    await new Notification(myBot, metrics).handleChanges();
  });
  console.log('Everything is Fine!')
})()
