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
    let updatedString = ``;

    if (updatedData.totalStake) {
      updatedString = `${updatedString}
\\- Updated total stake: ${updatedData.totalStake} Near`
    }

    if (updatedData.delegatorsCount) {
      updatedString = `${updatedString}
\\- Updated delegators count: ${updatedData.delegatorsCount}`
    }

    if (updatedData.uptime) {
      updatedString = `${updatedString}
\\- Uptime: ${updatedData.uptime}
\\- Chunks produced: ${updatedData.chunksProduced} / Chunks expected: ${updatedData.chunksExpected}
\\- Updated peers: ${updatedData.peers}`
    }

    if (updatedData.isActive) {
      updatedString = `${updatedString}
\\- Is node active: ${updatedData.isActive}`
    }

    if (updatedString.length > 0) {
      updatedString = `*Updated Fields:*
\\- Pool earnings: ${updatedData.poolEarnings} Near${updatedString}`

      await this.bot.sendMessageChannel(updatedString);
    }
  }
}