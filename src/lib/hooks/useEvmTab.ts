import { useState } from "react";

export enum CosmosEvmTxsTab {
  Evm = "EVM",
  Cosmos = "Cosmos",
}

export const useEvmTab = () => {
  const [currentTab, setCurrentTab] = useState(CosmosEvmTxsTab.Evm);

  return {
    currentTab,
    setCurrentTab,
    tabs: Object.values(CosmosEvmTxsTab),
  };
};
