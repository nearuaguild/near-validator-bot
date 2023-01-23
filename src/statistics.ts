import { execSync } from "child_process";
import config from "./config";
import Bot from "./bot";

const POOL_ID = config.poolId;
const ACCOUNT_ID = config.accountId;
const denom: number = 1000000000000000000000000;

const DELEGATORS_COUNT = `near view ${POOL_ID} get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ACCOUNT_ID} | grep -e "${ACCOUNT_ID}" | wc -l`;
const TOTAL_STAKE = `near view ${POOL_ID} get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ACCOUNT_ID} | grep -e "staked_balance" | grep -v "unstaked_balance" | xargs`;
// const CHUNKS_PRODUCED = `curl -s http://127.0.0.1:3030/metrics | grep near_validators_chunks_produced | grep ${POOL_ID}`;
// const CHUNKS_EXPECTED = `curl -s http://127.0.0.1:3030/metrics | grep near_validators_chunks_expected | grep ${POOL_ID}`;
// const DAEMON_STATUS = `systemctl status $DAEMON |grep Active`
// const PEERS = `curl -s http://127.0.0.1:3030/metrics | grep near_peer_connections_total | tail -n 1`

interface StatisticsState {
  delegatorsCount: number,
  totalStake: number,
}

class Statistics {
  state: StatisticsState = {
    delegatorsCount: 0,
    totalStake: 0,
  };

  getTotalStake(): number {
    const totalStake = execSync(TOTAL_STAKE);
    const totalStakeData = totalStake.toString();
    const calcTotalStake = Math.floor(totalStakeData.split('staked_balance: ').reduce((acc: number, cur: string) => {
      const replacedNumber: number = +cur.replace(/[\s,]/g, '');
      acc += replacedNumber;
      return acc;
    }, 0) / denom);

    if (this.state.totalStake !== calcTotalStake) {
      this.state.delegatorsCount = calcTotalStake;
    }

    return calcTotalStake;
  }

  getDelegatorsCount(): number {
    const delegatorsCount = execSync(DELEGATORS_COUNT);
    const delegatorsCountData = +delegatorsCount.toString().replace(/[\s,]/g, '');

    if (this.state.delegatorsCount !== delegatorsCountData) {
      this.state.delegatorsCount = +delegatorsCountData;
    }

    return delegatorsCountData;
  }

  getAll(): string {
    const totalStake = this.getTotalStake();
    const delegatorsCount = this.getDelegatorsCount();

    return `
Total Stake: ${totalStake}
Delegators Count: ${delegatorsCount}
    `;
  }

  async getStatistics(): Promise<void> {
    const updatedData: Partial<StatisticsState> = {};

    // const chunksExpected = execSync(TOTAL_STAKE);
    // const chunksProduced = execSync(TOTAL_STAKE);

    // const chunk = CHUNKS_EXPECTED;

    const delegatorsCount = this.getDelegatorsCount();
    if (this.state.delegatorsCount !== delegatorsCount) {
      updatedData.delegatorsCount = +delegatorsCount;
    }

    const totalStake = this.getTotalStake();
    if (this.state.totalStake !== totalStake) {
      updatedData.totalStake = totalStake;
    }

    if (updatedData.totalStake && updatedData.delegatorsCount) {
      await Bot.sendMessage(`*Updated Fields:* 
\\- Total stake: ${updatedData.totalStake} Near
\\- Delegators count: ${updatedData.delegatorsCount}
      `);
    } else if (updatedData.totalStake || updatedData.delegatorsCount) {
      if (updatedData.totalStake) {
        await Bot.sendMessage('Updated total stake: ' + updatedData.totalStake);
      }

      if (updatedData.delegatorsCount) {
        await Bot.sendMessage('Updated delegators count: ' + updatedData.delegatorsCount);
      }
    }
  }
}

export default new Statistics();

