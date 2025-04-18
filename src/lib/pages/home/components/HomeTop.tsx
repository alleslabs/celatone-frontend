import { Flex, Heading, Text } from "@chakra-ui/react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { Nullish } from "lib/types";
import { d0Formatter } from "lib/utils";

import { CardInfo } from "./CardInfo";
import { DevShortcuts } from "./DevShortcuts";

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
  totalTxs: Nullish<number>;
  isTotalTxsLoading: boolean;
  latestBlock: Nullish<number>;
  isLatestBlockLoading: boolean;
  blockTime: Nullish<number>;
  isBlockTimeLoading: boolean;
  toTxs: () => void;
  toBlocks: () => void;
}

export const HomeTop = ({
  totalTxs,
  isTotalTxsLoading,
  latestBlock,
  isLatestBlockLoading,
  blockTime,
  isBlockTimeLoading,
  toTxs,
  toBlocks,
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
        position="relative"
        overflow="hidden"
        sx={{ "& > div": { zIndex: 1 } }}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={5}
          zIndex={1}
        >
          <Heading as="h4" variant={{ base: "h5", md: "h4" }}>
            <Text as="span" color="primary.main">
              {prettyName}
            </Text>{" "}
            Overview
          </Heading>
          <UserDocsLink isButton href="introduction/overview" />
        </Flex>
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <CardInfo
            title={txInfo.title}
            tooltip={txInfo.tooltip}
            value={totalTxs ? d0Formatter(totalTxs, "0") : undefined}
            isLoading={isTotalTxsLoading}
            navigate={toTxs}
          />
          <CardInfo
            title={blockInfo.title}
            tooltip={blockInfo.tooltip}
            value={latestBlock ? d0Formatter(latestBlock, "0") : undefined}
            isLoading={isLatestBlockLoading}
            navigate={toBlocks}
          />
          <CardInfo
            title={blockTimeInfo.title}
            tooltip={blockTimeInfo.tooltip}
            value={blockTime?.toFixed(3).concat("s")}
            isLoading={isBlockTimeLoading}
            navigate={toBlocks}
          />
        </Flex>
      </Flex>
      {!isMobile && <DevShortcuts />}
    </>
  );
};
