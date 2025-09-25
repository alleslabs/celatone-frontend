import { Flex, Heading } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { CosmosEvmTxsTab, useEvmTab } from "lib/hooks";

import type { CosmosTxsProps } from "./cosmos-txs";
import type { EvmTxsProps } from "./evm-txs";

import { TypeSwitch } from "../TypeSwitch";
import { CosmosTxs } from "./cosmos-txs";
import { EvmTxs } from "./evm-txs";

interface CosmosEvmTxsProps {
  cosmosData: CosmosTxsProps;
  evmData: EvmTxsProps;
}

export const CosmosEvmTxs = ({ cosmosData, evmData }: CosmosEvmTxsProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const { currentTab, setCurrentTab, tabs } = useEvmTab();

  return (
    <Flex direction="column" gap={evm.enabled ? 6 : 4}>
      <Flex
        align="center"
        gap={6}
        justify={{
          base: "space-between",
          md: "flex-start",
        }}
      >
        <Heading as="h6" variant="h6">
          Transactions
        </Heading>
        {evm.enabled && (
          <TypeSwitch
            currentTab={currentTab}
            disabledScrollToTop
            tabs={tabs}
            onTabChange={setCurrentTab}
          />
        )}
      </Flex>
      {currentTab === CosmosEvmTxsTab.Evm && evm.enabled ? (
        <EvmTxs {...evmData} />
      ) : (
        <CosmosTxs {...cosmosData} />
      )}
    </Flex>
  );
};
