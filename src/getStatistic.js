import { execSync } from "child_process";
import config from "./config.js";
import { sendMessage } from "./botUtils";

const POOL_ID = config.poolId;
const ACCOUNT_ID = config.accountId;

const DELEGATORS_COUNT = `near view ${ POOL_ID } get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ ACCOUNT_ID } | grep -e "${ ACCOUNT_ID }" | wc -l`;
const TOTAL_STAKE = `near view ${ POOL_ID } get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ ACCOUNT_ID } | grep -e "staked_balance" | grep -v "unstaked_balance" | awk '{print $2}' | xargs | tr -d "," | tr -t " " "+" | bc -l`

const state = {
  delegatorsCount: 0,
  totalStake: 0,
}

export async function getStatistics() {
  const delegatorsCount = execSync(DELEGATORS_COUNT);
  const totalStake = execSync(TOTAL_STAKE);

  const delegatorsCountData = delegatorsCount.toString();
  const totalStakeData = totalStake.toString();

  if (state.delegatorsCount !== delegatorsCountData) {
    await sendMessage(delegatorsCountData);
    state.delegatorsCount = delegatorsCountData;
  }

  if (state.totalStake !== totalStakeData) {
    await sendMessage(totalStakeData);
    state.delegatorsCount = totalStakeData;
  }

  // console.error('error', child.error);
  // console.log('stdout ', child.stdout);
  // console.error('stderr ', child.stderr);
}
