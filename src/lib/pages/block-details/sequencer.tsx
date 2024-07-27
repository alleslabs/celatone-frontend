import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useBlockDataSequencer } from "lib/services/block";

import {
  BlockDetailsTop,
  BlockInfo,
  BlockTxsTableSequencer,
} from "./components";
import { InvalidBlock } from "./components/InvalidBlock";

export const BlockDetailsSequencer = ({ height }: { height: number }) => {
  const { data: blockData, isLoading } = useBlockDataSequencer(height);

  if (isLoading) return <Loading withBorder />;
  if (!blockData) return <InvalidBlock />;
  return (
    <>
      <Breadcrumb
        items={[
          { text: "Blocks", href: "/blocks" },
          { text: blockData.height.toString() },
        ]}
      />
      <BlockDetailsTop blockData={blockData} />
      <BlockInfo blockData={blockData} />
      <BlockTxsTableSequencer height={height} />
      <UserDocsLink
        title="What is a block?"
        cta="Read more about Block"
        href="general/blocks/detail-page"
      />
    </>
  );
};
