import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";

import { RecentBlocksTable } from "./components/RecentBlocksTable";

const BlocksPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_BLOCKS);
  }, [router.isReady]);

  return (
    <>
      <PageHeaderContainer bgColor="overlay.block">
        <PageHeader
          title="Blocks"
          subtitle="This page displays all blocks on this network sorted by recency"
          docHref="introduction/overview#recent-blocks"
        />
      </PageHeaderContainer>
      <PageContainer>
        <RecentBlocksTable />
      </PageContainer>
    </>
  );
};

export default BlocksPage;
