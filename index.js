import cron from "node-cron";
import getStatistic from "./src/getStatistic.js";

(async () => {
  cron.schedule("* * * * *", async () => {
    await getStatistic.getStatistics();
  });
})()
