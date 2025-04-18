import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig, useWasmConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { RecentContractsTable } from "./components/RecentContractsTable";

const RecentContracts = () => {
  useTierConfig({ minTier: "full" });
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CONTRACTS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Contracts" />
      <PageHeader
        docHref="introduction/overview#recent-contracts"
        subtitle="This page displays all contracts on this network sorted by recency"
        title="Contracts"
      />
      <RecentContractsTable />
    </PageContainer>
  );
};

export default RecentContracts;
