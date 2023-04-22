import { useRouter } from "next/router";

import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import { useBlockDetailsQuery } from "lib/services/blockService";
import { getFirstQueryParam } from "lib/utils";

import {
  BlockDetailsTop,
  BlockInfo,
  BlockTransactionTable,
} from "./components";

const BlockDetail = () => {
  const router = useRouter();
  const heightParam = getFirstQueryParam(router.query.height);
  const { data: blockData, isLoading } = useBlockDetailsQuery(
    Number(heightParam)
  );

  if (isLoading) return <Loading />;

  return (
    <PageContainer>
      <BackButton />
      {blockData ? (
        <>
          <BlockDetailsTop blockData={blockData} />
          <BlockInfo blockData={blockData} />
          <BlockTransactionTable height={Number(heightParam)} />
        </>
      ) : (
        <EmptyState
          imageVariant="not-found"
          heading="Block does not exist"
          message="Please check your input or make sure you have selected the correct network."
          withBorder
        />
      )}
    </PageContainer>
  );
};

export default BlockDetail;
