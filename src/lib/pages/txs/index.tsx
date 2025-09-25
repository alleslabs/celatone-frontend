import { Flex, Heading } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { CosmosEvmTxsTab } from "lib/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { TxsTableFull } from "./components/TxsTableFull";
import { TxsTableSequencer } from "./components/TxsTableSequencer";

const Txs = () => {
  const router = useRouter();
  useTierConfig({ minTier: "sequencer" });
  const evm = useEvmConfig({ shouldRedirect: false });
  const [currentTab, setCurrentTab] = useState(CosmosEvmTxsTab.Evm);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_TXS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Transactions" />
      {evm.enabled ? (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb={8}
          w="full"
        >
          <Heading as="h5" color="text.main" minH="36px" variant="h5">
            Transactions
          </Heading>
          <TypeSwitch
            currentTab={currentTab}
            disabledScrollToTop
            tabs={Object.values(CosmosEvmTxsTab)}
            onTabChange={setCurrentTab}
          />
        </Flex>
      ) : (
        <PageHeader
          docHref="introduction/overview#recent-transactions"
          subtitle={`This page displays all transactions on this network sorted by recency`}
          title="Transactions"
        />
      )}
      <TierSwitcher
        full={<TxsTableFull isViewMore={false} />}
        sequencer={
          <TxsTableSequencer isViewMore={false} showEvmOrCosmos={currentTab} />
        }
      />
    </PageContainer>
  );
};

export default Txs;
