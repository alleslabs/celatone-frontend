import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { Block } from "lib/types";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

interface BlocksTableMobileCardProps {
  blockData: Block;
  hideProposer?: boolean;
}
export const BlocksTableMobileCard = ({
  blockData,
  hideProposer = false,
}: BlocksTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/blocks/[blockHeight]",
          query: { blockHeight: blockData.height },
        })
      }
      topContent={
        <Flex align="center" gap={4} w="full">
          <Flex direction="column">
            <MobileLabel label="Block Height" />
            <ExplorerLink
              type="block_height"
              value={blockData.height.toString()}
              showCopyOnHover
            >
              {blockData.height}
            </ExplorerLink>
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Block Hash" />
            <Flex h={6} align="end">
              <Text variant="body2" color="text.main" fontFamily="mono">
                {truncate(blockData.hash.toUpperCase())}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      }
      middleContent={
        !hideProposer && <ValidatorBadge validator={blockData.proposer} />
      }
      bottomContent={
        <Flex gap={8}>
          <Flex direction="column">
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
