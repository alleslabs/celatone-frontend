import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";

import { InvalidBlock } from "./components/InvalidBlock";
import { BlockDetailsFull } from "./full";
import { BlockDetailsLite } from "./lite";
import { BlockDetailsSequencer } from "./sequencer";
import { zBlockDetailQueryParams } from "./types";

interface BlockDetailsBodyProps {
  height: number;
}

const BlockDetailsBody = ({ height }: BlockDetailsBodyProps) => (
  <>
    <CelatoneSeo pageName={`Block #${height.toString()}`} />
    <TierSwitcher
      full={<BlockDetailsFull height={height} />}
      sequencer={<BlockDetailsSequencer height={height} />}
      lite={<BlockDetailsLite height={height} />}
    />
  </>
);

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
