import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { ValidatorBadge } from "../ValidatorBadge";
import { useInternalNavigate } from "lib/app-provider";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { BlockInfo } from "lib/types/block";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface BlockCardProps {
  blockData: BlockInfo;
}
export const BlockCard = ({ blockData }: BlockCardProps) => {
  const navigate = useInternalNavigate();
  return (
    <DefaultMobileCard
      onClick={() =>
        navigate({
          pathname: "/blocks/[blockHeight]",
          query: { blockHeight: blockData.height },
        })
      }
      topContent={
        <Flex align="center" justify="center" gap={2} w="full">
          <Flex direction="column" flex="1">
            <MobileLabel label="Block Height" />
            <ExplorerLink
              type="block_height"
              value={blockData.height.toString()}
              showCopyOnHover
            >
              {blockData.height}
            </ExplorerLink>
          </Flex>
          <Flex direction="column" flex="1">
            <MobileLabel label="Block Hash" />
            <Flex h={6} align="end">
              <Text variant="body2" color="text.main">
                {truncate(blockData.hash.toUpperCase())}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" flex="1">
            <MobileLabel label="Transactions" />
            <Flex h={6} align="end">
              <Text
                variant="body2"
                color={blockData.txCount === 0 ? "text.dark" : "text.main"}
              >
                {blockData.txCount}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      }
      middleContent={
        <Flex>
          <ValidatorBadge validator={blockData.proposer} />
        </Flex>
      }
      bottomContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column" gap={0}>
            <Text variant="body3">{formatUTC(blockData.timestamp)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(blockData.timestamp)})`}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
