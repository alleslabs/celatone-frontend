import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";

import { RecentBlocksTableFull } from "./components/RecentBlocksTableFull";
import { RecentBlocksTableSequencer } from "./components/RecentBlocksTableSequencer";

const BlocksPage = () => {
  useTierConfig({ minTier: "mesa" });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_BLOCKS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Blocks" />
      <PageHeader
        subtitle="This page displays all blocks on this network sorted by recency"
        title="Blocks"
        docHref="introduction/overview#recent-blocks"
      />
      <TierSwitcher
        full={<RecentBlocksTableFull />}
        sequencer={<RecentBlocksTableSequencer />}
      />
    </PageContainer>
  );
};

export default BlocksPage;
