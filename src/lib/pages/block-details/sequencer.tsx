import { useEvmConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useBlockDataSequencer } from "lib/services/block";

import {
  BlockDetailsTop,
  BlockInfo,
  BlockTxsTableSequencer,
} from "./components";
import { BlockEvmTxsTablesSequencer } from "./components/BlockEvmTxsTablesSequencer";
import { InvalidBlock } from "./components/InvalidBlock";

export const BlockDetailsSequencer = ({ height }: { height: number }) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const { data: blockData, isLoading } = useBlockDataSequencer(height);

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
      {evm.enabled ? (
        <BlockEvmTxsTablesSequencer height={height} />
      ) : (
        <BlockTxsTableSequencer height={height} />
      )}
      <UserDocsLink
        cta="Read more about Block"
        title="What is a block?"
        href="general/blocks/detail-page"
      />
    </>
  );
};
