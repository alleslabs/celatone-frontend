import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import { InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useLatestBlockLcd } from "lib/services/block";

import { BlockDetailsTop, BlockInfo, BlockTxsTableLite } from "./components";
import { InvalidBlock } from "./components/InvalidBlock";
import { useBlockDataWithValidatorLcd } from "./data";

export const BlockDetailsLite = ({ height }: { height: number }) => {
  const { data, isLoading } = useBlockDataWithValidatorLcd(height);
  const { data: latestHeight } = useLatestBlockLcd();

  if (isLoading) return <Loading withBorder />;
  if (latestHeight && latestHeight > height && !data)
    return <InvalidState title="This block is too old and pruned from LCD" />;
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
