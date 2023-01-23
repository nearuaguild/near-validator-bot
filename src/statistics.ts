import { execSync } from "child_process";
import config from "./config";
import Bot from "./bot";
// const { execSync } = require("child_process");
// const { config } = require("./config.js");
// const { sendMessage } = require("./botUtils.js");

const POOL_ID = config.poolId;
const ACCOUNT_ID = config.accountId;

const DELEGATORS_COUNT = `cd .. & near view ${ POOL_ID } get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ ACCOUNT_ID } | grep -e "${ ACCOUNT_ID }" | wc -l`;
const TOTAL_STAKE = `cd .. & near view ${ POOL_ID } get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ ACCOUNT_ID } | grep -e "staked_balance" | grep -v "unstaked_balance" | xargs`

interface StatisticsState {
  delegatorsCount: number,
  totalStake: number,
}

class Statistics {
  state: StatisticsState = {
    delegatorsCount: 0,
    totalStake: 0,
  }

  async getStatistics(): Promise<void> {
    const delegatorsCount = execSync(DELEGATORS_COUNT);
    const totalStake = execSync(TOTAL_STAKE);

    const delegatorsCountData = delegatorsCount.toString();
    const totalStakeData = totalStake.toString();

    if (this.state.delegatorsCount !== +delegatorsCountData) {
      await Bot.sendMessage('Updated delegators count: ' + delegatorsCountData);
      this.state.delegatorsCount = +delegatorsCountData;
    }

    if (this.state.totalStake !== +totalStakeData) {
      await Bot.sendMessage('Updated total stake: ' + totalStakeData);
      console.log('totalStakeData', totalStakeData)
      console.log(totalStakeData.split('staked_balance: ').reduce((acc: number, current: string) => {
        acc += +current;
        return acc;
      }, 0));
      this.state.delegatorsCount = +totalStakeData;
    }

    // console.error('error', child.error);
    // console.log('stdout ', child.stdout);
    // console.error('stderr ', child.stderr);
  }
}

export default new Statistics();

