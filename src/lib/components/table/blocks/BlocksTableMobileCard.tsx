import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { Block } from "lib/types";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

interface BlocksTableMobileCardProps {
  blockData: Block;
  showProposer: boolean;
}
export const BlocksTableMobileCard = ({
  blockData,
  showProposer,
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
          <Flex direction="column" flex={1}>
            <MobileLabel label="Block height" />
            <ExplorerLink
              type="block_height"
              value={blockData.height.toString()}
              showCopyOnHover
            >
              {blockData.height}
            </ExplorerLink>
          </Flex>
          <Flex direction="column" flex={{ base: 2, sm: 3 }}>
            <MobileLabel label="Block hash" />
            <Flex h={6} align="end">
              <Text variant="body2" color="text.main" fontFamily="mono">
                {truncate(blockData.hash.toUpperCase())}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      }
      middleContent={
        showProposer && <ValidatorBadge validator={blockData.proposer} />
      }
      bottomContent={
        <Flex align="start" gap={4} w="full">
          <Flex direction="column" flex={1}>
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
          <Flex direction="column" flex={{ base: 2, sm: 3 }} gap={0}>
            <Text variant="body3">{formatUTC(blockData.timestamp)}</Text>
            <Text variant="body3" color="text.dark" mt="3px">
              {`(${dateFromNow(blockData.timestamp)})`}
            </Text>
          </Flex>
        </Flex>
      }
    />
  );
};
