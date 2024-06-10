import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import { UserDocsLink } from "lib/components/UserDocsLink";

import { BlockDetailsTop, BlockInfo, BlockTxsTableLite } from "./components";
import { InvalidBlock } from "./components/InvalidBlock";
import { useBlockDataWithValidatorLcd } from "./data";

export const BlockDetailsLite = ({ height }: { height: number }) => {
  const { data, isLoading } = useBlockDataWithValidatorLcd(height);

  if (isLoading) return <Loading withBorder />;
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
