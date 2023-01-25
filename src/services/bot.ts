import TelegramBot, { Message } from "node-telegram-bot-api";
import config from "../utils/config";
import type Metrics from "./metrics";

class Bot {
  public bot: TelegramBot | undefined;
  public metrics: Metrics;

  constructor(metrics: Metrics) {
    this.metrics = metrics;
  }

  async initializeBot(): Promise<void> {
    this.bot = await new TelegramBot(config.botToken, { polling: true });

    if (this.bot) {
      // Get delegators
      this.bot.onText(/\/delegators/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = await this.metrics.getDelegatorsCount()

          if (resp && this.bot) {
            await this.bot.sendMessage(chatId, `Your delegators count is: ${resp}`);
          }
        }
      });

      // Get total stake
      this.bot.onText(/\/stake/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = await this.metrics.getTotalStake()

          if (resp && this.bot) {
            await this.bot.sendMessage(chatId, `Your total stake is: ${resp}`);
          }
        }
      });

      // Get all metrics
      this.bot.onText(/\/all/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = await this.metrics.getAll()

          if (resp && this.bot) {
            await this.bot.sendMessage(chatId, resp);
          }
        }
      });
    }
  }

  async sendMessage(text: string): Promise<void> {
    if (this.bot) {
      await this.bot.sendMessage(config.channelId, text, {
        parse_mode: "MarkdownV2"
      });
    }
  }
}

export default Bot;
