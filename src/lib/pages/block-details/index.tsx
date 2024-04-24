import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useBlockData } from "lib/services/blockService";

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
      <PageHeaderContainer bgColor="overlay.block">
        <Breadcrumb
          items={[
            { text: "Blocks", href: "/blocks" },
            { text: blockData.height.toString() },
          ]}
        />
        <BlockDetailsTop blockData={blockData} />
      </PageHeaderContainer>
      <PageContainer hasPaddingTop={false}>
        <BlockInfo blockData={blockData} />
        <BlockTxsTable height={height} />
        <UserDocsLink
          title="What is a block?"
          cta="Read more about Block"
          href="general/blocks/detail-page"
        />
      </PageContainer>
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
    <>
      {!validated.success ? (
        <PageContainer>
          <InvalidBlock />
        </PageContainer>
      ) : (
        <BlockDetailsBody height={validated.data.height} />
      )}
    </>
  );
};

export default BlockDetails;
