// import { execSync } from "child_process";
// import config from "./config.js";
// import botUtils from "./botUtils.js";
const { execSync } = require("child_process");
const { config } = require("./config.js");
const { sendMessage } = require("./botUtils.js");

const POOL_ID = config.poolId;
const ACCOUNT_ID = config.accountId;

const DELEGATORS_COUNT = `near view ${ POOL_ID } get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ ACCOUNT_ID } | grep -e "${ ACCOUNT_ID }" | wc -l`;
const TOTAL_STAKE = `near view ${ POOL_ID } get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ ACCOUNT_ID } | grep -e "staked_balance" | grep -v "unstaked_balance" | xargs`

const state = {
  delegatorsCount: 0,
  totalStake: 0,
}

async function getStatistics() {
  const delegatorsCount = execSync(DELEGATORS_COUNT);
  const totalStake = execSync(TOTAL_STAKE);

  const delegatorsCountData = delegatorsCount.toString();
  const totalStakeData = totalStake.toString();

  if (state.delegatorsCount !== delegatorsCountData) {
    await sendMessage('Updated delegators count: ' + delegatorsCountData);
    state.delegatorsCount = delegatorsCountData;
  }

  if (state.totalStake !== totalStakeData) {
    await sendMessage('Updated total stake: ', totalStakeData);
    console.log('totalStakeData', totalStakeData)
    console.log(totalStakeData.split('staked_balance: ').reduce((acc, current) => {
      acc += +current;
      return acc;
    }, 0));
    state.delegatorsCount = totalStakeData;
  }

  // console.error('error', child.error);
  // console.log('stdout ', child.stdout);
  // console.error('stderr ', child.stderr);
}

module.exports = {
  getStatistics
}