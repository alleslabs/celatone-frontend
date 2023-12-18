import { z } from "zod";

import type { ContractCw2Info, ContractResponse } from "lib/services/contract";
import type { ContractDetail } from "lib/services/contractService";
import type { CodeLocalInfo } from "lib/stores/code";
import type { ContractLocalInfo } from "lib/stores/contract";
import {
  zContractAddr,
  type Nullable,
  type Option,
  type PublicDetail,
  type PublicInfo,
  type TokenWithValue,
} from "lib/types";

export interface ContractData {
  chainId: string;
  codeLocalInfo: Option<CodeLocalInfo>;
  contractLocalInfo: Option<ContractLocalInfo>;
  contractDetail: Option<ContractDetail>;
  isContractDetailLoading: boolean;
  publicProject: {
    publicInfo: Option<PublicInfo>;
    publicDetail: Option<PublicDetail>;
  };
  balances: Option<TokenWithValue[]>;
  isBalancesLoading: boolean;
  contractCw2Info: Option<ContractCw2Info>;
  isContractCw2InfoLoading: boolean;
  initMsg: Option<Nullable<string>>;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
  createdHeight: Option<number>;
  createdTime: Option<Date>;
  isInstantiateDetailLoading: boolean;
  rawContractResponse: Option<ContractResponse>;
  isRawContractResponseLoading: boolean;
}

export enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  TxsHistories = "txs-histories",
  States = "states",
}

export const zContractDetailQueryParams = z.object({
  contractAddress: zContractAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
