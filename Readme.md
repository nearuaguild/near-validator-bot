<!-- PROJECT LOGO -->
<br />
<div style="text-align: center;">
  <h2 style="text-align: center;">Near Protocol Validator Bot</h2>

  <p style="text-align: center;">
    A working example of NodeJS telegram bot integration with Near Protocol api to get your validator statistic in notification like delegators count, total delegation, uptime and alerts
    <br />
    <br />
    <a href="https://nearuaguild.github.io/near-validator-bot/#/">All bot commands</a>
    .
    <a href="https://github.com/nearuaguild"> Explore other examples</a>
    ·
    <a href="https://github.com/nearuaguild/near-validator-bot/issues">Report Bug</a>
  </p>
</div>

## Developed by

![Near Ukrainians Guild cover](./images/validator.png)

**Near Ukrainians Guild** is a fast-growing guild aimed at providing high-quality educational content and assistance to grow a strong community of Ukrainian developers/entrepreneurs in the Near Protocol ecosystem

[![Twitter][twitter]][twitter-url]
[![Youtube][youtube]][youtube-url]
[![Telegram Chat][telegram-chat]][telegram-chat-url]
[![Telegram Channel][telegram-channel]][telegram-channel-url]
[![Medium][medium]][medium-url]
[![Github][github]][github-url]

---

<!-- ABOUT THE PROJECT -->

## About The Project


### Built With

- [![NodeJS][node.js]](https://nodejs.org/en/)
- [near-api-js (v1.1.0)](https://github.com/near/near-api-js)

---

<!-- GETTING STARTED -->

## Getting Started

💡 _Before you begin, make sure you have the following installed_

- [Node.js v18 or above](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)

### Installation

Follow these simple instructions to set up a local development environment

1. Clone the repo
   ```sh
   git clone https://github.com/nearuaguild/near-validator-bot.git
   ```
2. Install NPM packages
   ```sh
   yarn
   ```
3. Create bot via [bot-father](https://telegram.me/BotFather) in telegram, add to your channel to get updates
4. Copy the example env file to `.env` and change values for yours, like your channel id and bot id
   ```sh
   cp .env.example .env
   ```
5. Build server
   ```sh
   yarn build
   ```
6. Launch application
   ```sh
   yarn start
   or
   pm2 start dist/index.js
   ```
7. Get updated about your bot

---

### State check every 10 mins by default, but you can modify it in .env file

If everything is updated you will see next message:
```
Updated Fields:
- Pool earnings: 0.43 Near
- Updated total stake: 47314 Near
- Updated delegators count: 8
- Uptime: 100%
- Chunks produced: 0 / Chunks expected: 0
- Updated peers: 33
- Is node active: true
```
But in general case you will receive updates only things that have changed, like:
```
Updated Fields:
- Pool earnings: 7.19 Near
- Updated total stake: 47350 Near
```


### Available telegram bot commands

Check [here](https://nearuaguild.github.io/near-validator-bot/#/)

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!-- Built with -->

[node.js]: https://img.shields.io/badge/nodejs-000000?style=for-the-badge&logo=nodedotjs&logoColor=white

<!-- Socials -->

[twitter]: https://img.shields.io/badge/news-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white
[youtube]: https://img.shields.io/badge/broadcasting-282828?style=for-the-badge&logo=youtube&logoColor=ff0000
[medium]: https://img.shields.io/badge/articles-202020?style=for-the-badge&logo=medium&logoColor=ffffff
[telegram-chat]: https://img.shields.io/badge/chat-229ED9?style=for-the-badge&logo=telegram&logoColor=white
[telegram-channel]: https://img.shields.io/badge/channel-229ED9?style=for-the-badge&logo=telegram&logoColor=white
[github]: https://img.shields.io/badge/code-000000?style=for-the-badge&logo=github&logoColor=ffffff
[twitter-url]: https://twitter.com/nearuaguild
[youtube-url]: https://www.youtube.com/@nearprotocolukraineguild4064
[medium-url]: https://medium.com/near-protocol-ua
[telegram-chat-url]: https://t.me/nearprotocolua
[telegram-channel-url]: https://t.me/nearprotocoluachannel
[github-url]: https://github.com/nearuaguild