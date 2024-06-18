import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";

import { InvalidBlock } from "./components/InvalidBlock";
import { BlockDetailsFull } from "./full";
import { BlockDetailsLite } from "./lite";
import { zBlockDetailQueryParams } from "./types";

interface BlockDetailsBodyProps {
  height: number;
}

const BlockDetailsBody = ({ height }: BlockDetailsBodyProps) => {
  const isFullTier = useTierConfig() === "full";

  return (
    <>
      <CelatoneSeo pageName={`Block #${height.toString()}`} />
      {isFullTier ? (
        <BlockDetailsFull height={height} />
      ) : (
        <BlockDetailsLite height={height} />
      )}
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
