import TelegramBot, { Message, ParseMode } from "node-telegram-bot-api";
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

          if (resp) {
            await this.sendMessageChat(chatId, `Your delegators count is: ${resp}`);
          }
        }
      });

      // Get total stake
      this.bot.onText(/\/stake/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = await this.metrics.getTotalStake()

          if (resp) {
            await this.sendMessageChat(chatId, `Your total stake is: ${resp} Near`);
          }
        }
      });

      // Get all metrics
      this.bot.onText(/\/all/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = await this.metrics.getAll()

          if (resp) {
            await this.sendMessageChat(chatId, resp);
          }
        }
      });

      // Get who and how much delegated
      this.bot.onText(/\/whoandhowmuch/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = await this.metrics.getDelegators()

          if (resp) {
            await this.sendMessageChat(chatId, resp);
          }
        }
      });

      // Get pool earnings
      this.bot.onText(/\/poolearnings/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = await this.metrics.getPoolEarnings()

          if (resp) {
            await this.sendMessageChat(chatId, resp + 'Near');
          }
        }
      });
    }
  }

  async sendMessageChannel(text: string, parseMode: ParseMode = "MarkdownV2"): Promise<void> {
    if (this.bot) {
      await this.bot.sendMessage(config.channelId, text, {
        parse_mode: parseMode
      });
    }
  }

  async sendMessageChat(chatId: number, text: string): Promise<void> {
    if (this.bot) {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: "HTML"
      });
    }
  }
}

export default Bot;
