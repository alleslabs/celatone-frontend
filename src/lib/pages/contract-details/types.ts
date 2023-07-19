import type { ContractCw2Info, ContractResponse } from "lib/services/contract";
import type { ContractDetail } from "lib/services/contractService";
import type { CodeLocalInfo } from "lib/stores/code";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  BalanceWithAssetInfo,
  Option,
  PublicDetail,
  PublicInfo,
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
  balances: Option<BalanceWithAssetInfo[]>;
  isBalancesLoading: boolean;
  contractCw2Info: Option<ContractCw2Info>;
  isContractCw2InfoLoading: boolean;
  initMsg: Option<string | null>;
  initTxHash: Option<string>;
  initProposalId: Option<number>;
  initProposalTitle: Option<string>;
  createdHeight: Option<number>;
  createdTime: Option<Date>;
  isInstantiateDetailLoading: boolean;
  rawContractResponse: Option<ContractResponse>;
  isRawContractResponseLoading: boolean;
}
