import type { Nullish } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { d0Formatter } from "lib/utils";

import { CardInfo } from "./CardInfo";
import { DevShortcuts } from "./DevShortcuts";
import { VisitSiteLink } from "./VisitSiteLink";

const txInfo = {
  title: "Total transactions",
  tooltip:
    "Verified transactions track network activity and growth, indicating ecosystem health.",
};

const blockInfo = {
  title: "Latest block height",
  tooltip: "The latest block height indexed by the indexer.",
};

const blockTimeInfo = {
  title: "Block time",
  tooltip: "Average time to finality of the last 100 indexed blocks.",
};

interface HomeTopProps {
  blockTime: Nullish<number>;
  isBlockTimeLoading: boolean;
  isLatestBlockLoading: boolean;
  isTotalTxsLoading: boolean;
  latestBlock: Nullish<number>;
  toBlocks: () => void;
  totalTxs: Nullish<number>;
  toTxs: () => void;
}

export const HomeTop = ({
  blockTime,
  isBlockTimeLoading,
  isLatestBlockLoading,
  isTotalTxsLoading,
  latestBlock,
  toBlocks,
  totalTxs,
  toTxs,
}: HomeTopProps) => {
  const isMobile = useMobile();
  const {
    chainConfig: { prettyName },
  } = useCelatoneApp();

  return (
    <>
      <Flex
        direction="column"
        mb={12}
        overflow="hidden"
        position="relative"
        sx={{ "& > div": { zIndex: 1 } }}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          zIndex={1}
        >
          <Heading as="h4" variant={{ base: "h5", md: "h4" }}>
            <Text as="span" color="primary.main">
              {prettyName}
            </Text>{" "}
            Overview
          </Heading>
          <VisitSiteLink />
        </Flex>
        <Flex direction={{ base: "column", md: "row" }} gap={4}>
          <CardInfo
            isLoading={isTotalTxsLoading}
            navigate={toTxs}
            title={txInfo.title}
            tooltip={txInfo.tooltip}
            value={totalTxs ? d0Formatter(totalTxs, "0") : undefined}
          />
          <CardInfo
            isLoading={isLatestBlockLoading}
            navigate={toBlocks}
            title={blockInfo.title}
            tooltip={blockInfo.tooltip}
            value={latestBlock ? d0Formatter(latestBlock, "0") : undefined}
          />
          <CardInfo
            isLoading={isBlockTimeLoading}
            navigate={toBlocks}
            title={blockTimeInfo.title}
            tooltip={blockTimeInfo.tooltip}
            value={blockTime?.toFixed(3).concat("s")}
          />
        </Flex>
      </Flex>
      {!isMobile && <DevShortcuts />}
    </>
  );
};
