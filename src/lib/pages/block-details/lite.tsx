import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useLatestBlockLcd } from "lib/services/block";

import { BlockDetailsTop, BlockInfo, BlockTxsTableLite } from "./components";
import { InvalidBlock } from "./components/InvalidBlock";
import { useBlockDataWithValidatorLcd } from "./data";

export const BlockDetailsLite = ({ height }: { height: number }) => {
  const { data, isLoading } = useBlockDataWithValidatorLcd(height);
  const { data: latestHeight, isLoading: isLatestHeightLoading } =
    useLatestBlockLcd();

  if (isLoading || isLatestHeightLoading) return <Loading withBorder />;
  if (latestHeight && latestHeight > height && !data)
    return (
      <EmptyState
        heading={`Block ${height} is too old and has been pruned from LCD`}
        imageVariant="not-found"
        message="Due to the LCD pruning the old blocks, this block's information cannot be retrieved."
        textVariant="body2"
        withBorder
      />
    );
  if (!data) return <InvalidBlock />;
  return (
    <>
      <Breadcrumb
        items={[
          { href: "/blocks", text: "Blocks" },
          { text: data.height.toString() },
        ]}
      />
      <BlockDetailsTop blockData={data} />
      <BlockInfo blockData={data} />
      <BlockTxsTableLite height={height} />
      <UserDocsLink
        cta="Read more about Block"
        title="What is a block?"
        href="general/blocks/detail-page"
      />
    </>
  );
};
