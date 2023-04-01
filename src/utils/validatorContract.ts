import type BN from "bn.js";
import { Account, Contract } from "near-api-js";

interface ChangeMethodOptions {
  gas?: BN;
  attachedDeposit?: BN;
  walletMeta?: string;
  walletCallbackUrl?: string;
}

interface Delegator {
  account_id: string;
  unstaked_balance: string;
  staked_balance: string;
  can_withdraw: boolean;
}

export class ValidatorContract extends Contract {
  constructor(account: Account, contractId: string) {
    super(account, contractId, {
      changeMethods: [],
      viewMethods: ["get_accounts"],
    });
  }

  public async getAccounts (
    options?: ChangeMethodOptions
  ): Promise<Delegator[]> {
    return this.account.viewFunction({
      contractId: this.contractId,
      methodName: "get_accounts",
      args: { "from_index": 0, "limit": 500 },
      ...options,
    });
  };
}