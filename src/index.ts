import Bot from "./services/bot";
import Metrics from "./services/metrics";
import cron from "node-cron";
import Notification from "./services/notification";
import { ValidatorContract } from "./utils/validatorContract";
import * as naj from "near-api-js";
import { getNearConfig } from "./utils/nearConfig";

async function initContract(): Promise<ValidatorContract> {
  const nearConfig = getNearConfig();

  const near = await naj.connect(nearConfig);

  const account = await near.account("");
  return new ValidatorContract(account, "nearuaguild.poolv1.near");
}

(async () => {
  const contract = await initContract();
  const metrics = new Metrics(contract);
  const myBot = new Bot(metrics);
  await myBot.initializeBot();
  const notification = new Notification(myBot, metrics);

  await notification.handleChanges();
  cron.schedule("*/15 * * * *", async () => {
    await notification.handleChanges();
  });
  console.log('Everything is Fine!');
})();
