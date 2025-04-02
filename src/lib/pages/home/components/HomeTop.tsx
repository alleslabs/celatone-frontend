import type { Nullish } from "lib/types";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { UserDocsLink } from "lib/components/UserDocsLink";
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
          <UserDocsLink href="introduction/overview" isButton />
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
