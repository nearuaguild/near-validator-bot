import axios from "axios";
import type { ValidatorContract } from "../utils/validatorContract";
// @ts-ignore
import parsePrometheusTextFormat from "parse-prometheus-text-format";
import config from "../utils/config";
import { getNetworkInfo } from "./rpcAPI";

const denom: number = 1000000000000000000000000;

const nodeMetricsURL = `${config.nodeUrl}/metrics`;

interface MetricsState {
  delegatorsCount: number,
  totalStake: number,
  poolEarnings: string,
  chunksProduced: number,
  chunksExpected: number,
  uptime: string,
  peers: number,
  isActive: boolean,
}

class Metrics {
  state: MetricsState = {
    delegatorsCount: 0,
    totalStake: 0,
    poolEarnings: '0',
    chunksProduced: 0,
    chunksExpected: 0,
    uptime: '0%',
    peers: 0,
    isActive: false,
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

  getDelegatorsLink() {
    return `https://nearscope.net/validator/${config.poolId}/tab/delegators`
  }

  async getPoolEarnings(): Promise<string> {
    const delegators = await this.contract.getAccounts();
    const poolDelegation = delegators.find((delegator => delegator.account_id === config.accountId));

    if (poolDelegation) {
      const poolEarnings = (+poolDelegation.staked_balance / denom).toFixed(2);
      const textPoolEarninngs = poolEarnings.toString().replace('.', '\\.');

      if (this.state.poolEarnings !== textPoolEarninngs) {
        this.state.poolEarnings = textPoolEarninngs;
        this.updatedData.poolEarnings = textPoolEarninngs;
      }

      return poolEarnings;
    }

    return '0';
  }

  async getAll(): Promise<string> {
    const [totalStake, delegatorsCount, poolEarnings] = await Promise.all([this.getTotalStake(), this.getDelegatorsCount(), this.getPoolEarnings(), this.getNodeMetrics()]);

    return `
<b>Pool metrics:</b>
1. Total Stake: ${totalStake} Near
2. Delegators Count: ${delegatorsCount}
3. Pool earnings: ${poolEarnings} Near

<b>Node metrics:</b>
1. Uptime: ${this.state.uptime}
2. Chunks produced: ${this.state.chunksProduced}
3. Chunks expected: ${this.state.chunksExpected}
4. Peers: ${this.state.peers}
5. Is node active: ${this.state.isActive}
    `;
  }

  async getPeers(): Promise<number> {
    const networkInfo = await getNetworkInfo();

    if (networkInfo) {
      const peers = networkInfo.result.num_active_peers;

      if (this.state.peers !== peers) {
        this.state.peers = peers;
        this.updatedData.peers = peers;
      }
    }

    return this.state.peers;
  }

  async getMetrics(): Promise<Partial<MetricsState>> {
    await Promise.all([this.getTotalStake(), this.getDelegatorsCount(), this.getPoolEarnings(), this.getNodeMetrics()]);

    const newData = this.updatedData;
    this.updatedData = {};
    return newData;
  }

  async getNodeMetrics() {
    const { data } = await axios.get(nodeMetricsURL);
    const parsed = parsePrometheusTextFormat(data);

    const isActive = !!parsed.find((obj: any) => obj.name === 'near_is_validator').metrics[0].value;

    if (this.state.isActive !== isActive) {
      this.state.isActive = isActive;
      this.updatedData.isActive = isActive;
    }

    const chunksProduced = parsed
      .find((obj: any) => obj.name === 'near_validators_chunks_produced')
      .metrics
      .find((obj: any) => obj.labels.account_id === 'nearuaguild.poolv1.near').value;

    if (this.state.chunksProduced !== chunksProduced) {
      this.state.chunksProduced = chunksProduced;
      this.updatedData.chunksProduced = chunksProduced;
    }

    const chunksExpected = parsed
      .find((obj: any) => obj.name === 'near_validators_chunks_expected')
      .metrics
      .find((obj: any) => obj.labels.account_id === 'nearuaguild.poolv1.near').value;

    if (this.state.chunksExpected !== chunksExpected) {
      this.state.chunksExpected = chunksExpected;
      this.updatedData.chunksExpected = chunksExpected;
    }

    const uptime = this.state.chunksExpected === 0 ? this.state.uptime : chunksProduced / chunksExpected * 100 + '%';

    if (this.state.uptime !== uptime && chunksExpected > 0) {
      this.state.uptime = uptime;
      this.updatedData.uptime = uptime;
    }

    await this.getPeers();
  }
}

export default Metrics;

