import cron from "node-cron";
import { getStatistics } from "./src/getStatistic";
import { startBot } from "./src/bot";

(async () => {
  await startBot();

  cron.schedule("* * * * *", async () => {
    await getStatistics();
  });
})()
