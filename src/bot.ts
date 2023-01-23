import TelegramBot, { Message } from "node-telegram-bot-api";
import config from "./config";

class Bot {
  public bot: TelegramBot | undefined;

  async initializeBot(): Promise<void> {
    this.bot = await new TelegramBot(config.botToken, { polling: true });

    if (this.bot) {
      this.bot.onText(/\/echo (.+)/, async (msg: Message, match: RegExpExecArray | null) => {
        const chatId = msg.chat.id;
        if (match) {
          const resp = match[1];

          if (resp && this.bot) {
            await this.bot.sendMessage(chatId, resp);
          }
        }
      });

      this.bot.on("message", async (msg: Message) => {
        const chatId = msg.chat.id;

        if (this.bot) {
          await this.bot.sendMessage(chatId, "Received your message");
        }
      });
    }
  }

  async sendMessage(text: string): Promise<void> {
    if (this.bot) {
      await this.bot.sendMessage(config.channelId, text);
    }
  }
}

export default new Bot();
