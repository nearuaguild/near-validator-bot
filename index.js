const cron = require("node-cron");
const { getStatistics } = require("./src/getStatistic");
const { initializeBot } = require("./src/botUtils");

(async () => {
  await initializeBot();
  cron.schedule("* * * * *", async () => {
    await getStatistics();
  });
})()
