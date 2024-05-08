import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";

import { TxsTable } from "./components/TxsTable";

const Txs = () => {
  useTierConfig({ minTier: "full" });

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_TXS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        subtitle="This page displays all transactions on this network sorted by
        recency"
        docHref="introduction/overview#recent-transactions"
      />
      <TxsTable isViewMore={false} />
    </PageContainer>
  );
};

export default Txs;
