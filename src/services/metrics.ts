import { execSync } from "child_process";
import config from "../utils/config";

const POOL_ID = config.poolId;
const ACCOUNT_ID = config.accountId;
const denom: number = 1000000000000000000000000;

// near view nearuaguild.poolv1.near get_accounts '{"from_index": 0, "limit": 500}' --accountId nearukraineguild.near

const DELEGATORS_COUNT = `near view ${POOL_ID} get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ACCOUNT_ID} | grep -e "account_id" | wc -l`;
const TOTAL_STAKE = `near view ${POOL_ID} get_accounts '{"from_index": 0, "limit": 500}' --accountId ${ACCOUNT_ID} | grep -e "staked_balance" | grep -v "unstaked_balance" | xargs`;
// const CHUNKS_PRODUCED = `curl -s http://127.0.0.1:3030/metrics | grep near_validators_chunks_produced | grep ${POOL_ID}`;
// const CHUNKS_EXPECTED = `curl -s http://127.0.0.1:3030/metrics | grep near_validators_chunks_expected | grep ${POOL_ID}`;
// const DAEMON_STATUS = `systemctl status $DAEMON |grep Active`
// const PEERS = `curl -s http://127.0.0.1:3030/metrics | grep near_peer_connections_total | tail -n 1`

interface MetricsState {
  delegatorsCount: number,
  totalStake: number,
}

class Metrics {
  state: MetricsState = {
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
      this.state.delegatorsCount = delegatorsCountData;
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

  async getMetrics(): Promise<Partial<MetricsState>> {
    const updatedData: Partial<MetricsState> = {};

    // const chunksExpected = execSync(TOTAL_STAKE);
    // const chunksProduced = execSync(TOTAL_STAKE);

    // const chunk = CHUNKS_EXPECTED;

    const delegatorsCount = this.getDelegatorsCount();
    if (this.state.delegatorsCount !== delegatorsCount) {
      updatedData.delegatorsCount = delegatorsCount;
    }

    const totalStake = this.getTotalStake();
    if (this.state.totalStake !== totalStake) {
      updatedData.totalStake = totalStake;
    }

    return updatedData;
  }
}

export default Metrics;

