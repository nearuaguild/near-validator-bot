import Bot from "./services/bot";
import Metrics from "./services/metrics";
import cron from "node-cron";
import Notification from "./services/notification";
import { ValidatorContract } from "./utils/validatorContract";
import * as naj from "near-api-js";
import { getNearConfig } from "./utils/nearConfig";
import config from "./utils/config";

async function initContract(): Promise<ValidatorContract> {
  const nearConfig = getNearConfig();

  const near = await naj.connect(nearConfig);

  const account = await near.account("");
  return new ValidatorContract(account, config.poolId);
}

(async () => {
  const contract = await initContract();
  const metrics = new Metrics(contract);
  const myBot = new Bot(metrics);
  await myBot.initializeBot();
  const notification = new Notification(myBot, metrics);

  cron.schedule("*/10 * * * *", async () => {
    await notification.handleChanges();
  });
  console.log('Everything is Fine!');
})();
