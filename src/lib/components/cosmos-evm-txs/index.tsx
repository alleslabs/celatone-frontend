import { Flex, Heading } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import { CosmosEvmTxsTab, useEvmTab } from "lib/hooks";

import type { CosmosTxsProps } from "./CosmosTxs";
import type { EvmTxsProps } from "./EvmTxs";

import { TypeSwitch } from "../TypeSwitch";
import { CosmosTxs } from "./CosmosTxs";
import { EvmTxs } from "./EvmTxs";

interface CosmosEvmTxsProps {
  cosmosData: CosmosTxsProps;
  evmData: EvmTxsProps;
  hideTitle?: boolean;
}

export const CosmosEvmTxs = ({
  cosmosData,
  evmData,
  hideTitle = false,
}: CosmosEvmTxsProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const { currentTab, setCurrentTab, tabs } = useEvmTab();

  return (
    <Flex direction="column" gap={evm.enabled ? 6 : 4}>
      {!hideTitle && (
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
      )}
      {currentTab === CosmosEvmTxsTab.Evm && evm.enabled ? (
        <EvmTxs {...evmData} />
      ) : (
        <CosmosTxs {...cosmosData} />
      )}
    </Flex>
  );
};
