import Bot from "./services/bot";
import Metrics from "./services/metrics";
import cron from "node-cron";
import Notification from "./services/notification";

(async () => {
  const metrics = new Metrics();
  const myBot = new Bot(metrics);
  await myBot.initializeBot();
  const notification = new Notification(myBot, metrics);

  await notification.handleChanges();
  cron.schedule("*/15 * * * *", async () => {
    await notification.handleChanges();
  });
  console.log('Everything is Fine!')
})()
