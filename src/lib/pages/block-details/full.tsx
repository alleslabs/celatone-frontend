import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useBlockData } from "lib/services/block";

import { BlockDetailsTop, BlockInfo, BlockTxsTableFull } from "./components";
import { InvalidBlock } from "./components/InvalidBlock";

export const BlockDetailsFull = ({ height }: { height: number }) => {
  const { data: blockData, isLoading } = useBlockData(height);

  if (isLoading) return <Loading withBorder />;
  if (!blockData) return <InvalidBlock />;
  return (
    <>
      <Breadcrumb
        items={[
          { href: "/blocks", text: "Blocks" },
          { text: blockData.height.toString() },
        ]}
      />
      <BlockDetailsTop blockData={blockData} />
      <BlockInfo blockData={blockData} />
      <BlockTxsTableFull height={height} />
      <UserDocsLink
        cta="Read more about Block"
        title="What is a block?"
        href="general/blocks/detail-page"
      />
    </>
  );
};
