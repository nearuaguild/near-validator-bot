import type Metrics from "./metrics";
import type Bot from "./bot";

export default class Notification {
  bot: Bot;
  metrics: Metrics;

  constructor(bot: Bot, metrics: Metrics) {
    this.bot = bot;
    this.metrics = metrics;
  }

  handleChanges = async () => {
    const updatedData = await this.metrics.getMetrics();

    if (updatedData.totalStake && updatedData.delegatorsCount) {
      await this.bot.sendMessageChannel(`*Updated Fields:* 
\\- Total stake: ${updatedData.totalStake} Near
\\- Delegators count: ${updatedData.delegatorsCount}
    `);
    } else if (updatedData.totalStake || updatedData.delegatorsCount) {
      if (updatedData.totalStake) {
        await this.bot.sendMessageChannel('Updated total stake: ' + updatedData.totalStake);
      }

      if (updatedData.delegatorsCount) {
        await this.bot.sendMessageChannel('Updated delegators count: ' + updatedData.delegatorsCount);
      }
    }
  }
}