import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useBlockData } from "lib/services/block";

import { BlockDetailsTop, BlockInfo, BlockTxsTable } from "./components";
import { zBlockDetailQueryParams } from "./types";

const InvalidBlock = () => <InvalidState title="Block does not exist" />;

interface BlockDetailsBodyProps {
  height: number;
}

const BlockDetailsBody = ({ height }: BlockDetailsBodyProps) => {
  const { data: blockData, isLoading } = useBlockData(height);

  if (isLoading) return <Loading withBorder />;
  if (!blockData) return <InvalidBlock />;
  return (
    <>
      <CelatoneSeo pageName={`Block #${blockData.height.toString()}`} />
      <Breadcrumb
        items={[
          { text: "Blocks", href: "/blocks" },
          { text: blockData.height.toString() },
        ]}
      />
      <BlockDetailsTop blockData={blockData} />
      <BlockInfo blockData={blockData} />
      <BlockTxsTable height={height} />
      <UserDocsLink
        title="What is a block?"
        cta="Read more about Block"
        href="general/blocks/detail-page"
      />
    </>
  );
};

const BlockDetails = () => {
  const router = useRouter();
  const validated = zBlockDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_BLOCK_DETAILS);
  }, [router.isReady]);

  return (
    <PageContainer>
      {!validated.success ? (
        <InvalidBlock />
      ) : (
        <BlockDetailsBody height={validated.data.height} />
      )}
    </PageContainer>
  );
};

export default BlockDetails;
