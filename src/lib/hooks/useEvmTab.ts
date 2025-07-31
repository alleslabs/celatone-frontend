import { useState } from "react";

export enum CosmosEvmTxsTab {
  Evm = "evm",
  Cosmos = "cosmos",
}

export const useEvmTab = () => {
  const [currentTab, setCurrentTab] = useState(CosmosEvmTxsTab.Evm);

  return {
    currentTab,
    setCurrentTab,
    tabs: Object.values(CosmosEvmTxsTab),
  };
};
