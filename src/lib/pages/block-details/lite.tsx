import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useLatestBlockRest } from "lib/services/block";

import { BlockDetailsTop, BlockInfo, BlockTxsTableLite } from "./components";
import { InvalidBlock } from "./components/InvalidBlock";
import { useBlockDataWithValidatorRest } from "./data";

export const BlockDetailsLite = ({ height }: { height: number }) => {
  const { data, isLoading } = useBlockDataWithValidatorRest(height);
  const { data: latestHeight, isLoading: isLatestHeightLoading } =
    useLatestBlockRest();

  if (isLoading || isLatestHeightLoading) return <Loading withBorder />;
  if (latestHeight && latestHeight > height && !data)
    return (
      <EmptyState
        heading={`Block ${height} is too old and has been pruned from REST`}
        message="Due to the REST pruning the old blocks, this block's information cannot be retrieved."
        imageVariant="not-found"
        textVariant="body2"
        withBorder
      />
    );
  if (!data) return <InvalidBlock />;
  return (
    <>
      <Breadcrumb
        items={[
          { text: "Blocks", href: "/blocks" },
          { text: data.height.toString() },
        ]}
      />
      <BlockDetailsTop blockData={data} />
      <BlockInfo blockData={data} />
      <BlockTxsTableLite height={height} />
      <UserDocsLink
        title="What is a block?"
        cta="Read more about Block"
        href="general/blocks/detail-page"
      />
    </>
  );
};
