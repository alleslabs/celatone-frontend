import { Flex, Heading, Text } from "@chakra-ui/react";

import { useCelatoneApp, useMobile } from "lib/app-provider";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { Nullish } from "lib/types";
import { d0Formatter } from "lib/utils";

import { CardInfo } from "./CardInfo";
import { DevShortcuts } from "./DevShortcuts";

const txInfo = {
  title: "Total Transactions",
  tooltip:
    "Verified transactions track network activity and growth, indicating ecosystem health.",
};

const blockInfo = {
  title: "Latest Block Height",
  tooltip: "The latest block height indexed by the indexer.",
};

const blockTimeInfo = {
  title: "Block Time",
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
        mb={12}
        sx={{ "& > div": { zIndex: 1 } }}
        direction="column"
        overflow="hidden"
        position="relative"
      >
        <Flex
          alignItems="center"
          mb={5}
          zIndex={1}
          justifyContent="space-between"
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
            navigate={toTxs}
            title={txInfo.title}
            value={totalTxs ? d0Formatter(totalTxs, "0") : undefined}
            isLoading={isTotalTxsLoading}
            tooltip={txInfo.tooltip}
          />
          <CardInfo
            navigate={toBlocks}
            title={blockInfo.title}
            value={latestBlock ? d0Formatter(latestBlock, "0") : undefined}
            isLoading={isLatestBlockLoading}
            tooltip={blockInfo.tooltip}
          />
          <CardInfo
            navigate={toBlocks}
            title={blockTimeInfo.title}
            value={blockTime?.toFixed(3).concat("s")}
            isLoading={isBlockTimeLoading}
            tooltip={blockTimeInfo.tooltip}
          />
        </Flex>
      </Flex>
      {!isMobile && <DevShortcuts />}
    </>
  );
};
