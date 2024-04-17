import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";

import { BlocksTable } from "./components/BlocksTable";

const BlocksPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_BLOCKS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <PageHeader
        title="Blocks"
        subtitle="This page displays all blocks on this network sorted by recency"
        docHref="introduction/overview#recent-blocks"
      />
      <BlocksTable />
    </PageContainer>
  );
};

export default BlocksPage;
