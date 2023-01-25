import type { ValidatorContract } from "../utils/validatorContract";

const denom: number = 1000000000000000000000000;

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
  updatedData: Partial<MetricsState> = {};
  contract: ValidatorContract;

  constructor(contract: ValidatorContract) {
    this.contract = contract;
  }

  async getTotalStake(): Promise<number> {
    const delegators = await this.contract.getAccounts();
    const calcTotalStake = Math.floor(delegators.reduce((acc, delegator) => {
      const tokens: number = +delegator.staked_balance;
      acc += tokens;
      return acc;
    }, 0) / denom);

    if (this.state.totalStake !== calcTotalStake) {
      this.state.totalStake = calcTotalStake;
      this.updatedData.totalStake = calcTotalStake;
    }

    return calcTotalStake;
  }

  async getDelegatorsCount(): Promise<number> {
    const delegators = await this.contract.getAccounts();
    const delegatorsCount = delegators.length;

    if (this.state.delegatorsCount !== delegatorsCount) {
      this.state.delegatorsCount = delegatorsCount;
      this.updatedData.delegatorsCount = delegatorsCount;
    }

    return delegatorsCount;
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
    // const chunksExpected = execSync(TOTAL_STAKE);
    // const chunksProduced = execSync(TOTAL_STAKE);

    // const chunk = CHUNKS_EXPECTED;

    await this.getDelegatorsCount();
    await this.getTotalStake();

    const newData = this.updatedData
    this.updatedData = {};
    return newData;
  }
}

export default Metrics;

