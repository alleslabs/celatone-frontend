import type { Filters, HumanAddr, ContractAddr } from "lib/types";

/**
 * Generate action filter for where clause used in graphql. Only return action that is true
 *
 * @example
 * is_send: {_eq: true}, is_execute: {_eq: true}
 *
 */
export const actionsFilter = (filters: Filters) => {
  const actions = {
    isExecute: "is_execute",
    isInstantiate: "is_instantiate",
    isUpload: "is_store_code",
    isIbc: "is_ibc",
    isSend: "is_send",
    isMigrate: "is_migrate",
    isUpdateAdmin: "is_update_admin",
    isClearAdmin: "is_clear_admin",
  };

  return Object.keys(filters).reduce((acc: string, key: string) => {
    if (filters[key as keyof typeof filters]) {
      return `${acc} ${actions[key as keyof Filters]}: {_eq: true },`;
    }
    return acc;
  }, "");
};

interface GenerateWhereForContractTx {
  userAddress: HumanAddr;
  contractAddress: ContractAddr;
  filters: Filters;
}

/**
 * @remark
 * For contract_transactions table
 *
 */
export const generateWhereForContractTx = ({
  userAddress,
  contractAddress,
  filters,
}: GenerateWhereForContractTx) => {
  const actionFilter = actionsFilter(filters);
  return `{
    transaction: { 
      account: { address: { _eq: "${userAddress}" } },
      ${actionFilter !== "" ? `${actionFilter},` : ""}
    }
    ${
      contractAddress && `contract: { address: { _eq: "${contractAddress}" } },`
    }
  }`;
};

interface GenerateWhereForTx {
  userAddress: HumanAddr;
  txHash?: string;
  filters: Filters;
}

/**
 * @remark
 * For transactions table
 *
 */
export const generateWhereForTx = ({
  userAddress,
  txHash,
  filters,
}: GenerateWhereForTx) => {
  const actionFilter = actionsFilter(filters);
  return ` {
    account: { address: { _eq: "${userAddress}" } },
    ${actionFilter !== "" ? `${actionFilter},` : ""}
    ${txHash && `hash: {_eq: "\\\\x${txHash}"}, `}        
  }`;
};
