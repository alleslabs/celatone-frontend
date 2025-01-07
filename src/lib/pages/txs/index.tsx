import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";

import { TxsTableFull } from "./components/TxsTableFull";
import { TxsTableSequencer } from "./components/TxsTableSequencer";

const Txs = () => {
  const router = useRouter();
  useTierConfig({ minTier: "sequencer" });
  const evm = useEvmConfig({ shouldRedirect: false });

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_TXS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Transactions" />
      <PageHeader
        subtitle={`This page displays all ${evm.enabled ? "cosmos" : ""} transactions on this network sorted by recency`}
        title="Transactions"
        docHref="introduction/overview#recent-transactions"
      />
      <TierSwitcher
        full={<TxsTableFull isViewMore={false} />}
        sequencer={<TxsTableSequencer isViewMore={false} />}
      />
    </PageContainer>
  );
};

export default Txs;
