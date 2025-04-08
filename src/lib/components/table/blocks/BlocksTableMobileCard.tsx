import type { Block } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
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
      bottomContent={
        <Flex align="start" gap={4} w="full">
          <Flex direction="column" flex={1}>
            <MobileLabel label="Transactions" />
            <Flex align="end" h={6}>
              <Text
                color={blockData.txCount === 0 ? "text.dark" : "text.main"}
                variant="body2"
              >
                {blockData.txCount}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" flex={{ base: 2, sm: 3 }} gap={0}>
            <Text variant="body3">{formatUTC(blockData.timestamp)}</Text>
            <Text color="text.dark" mt="3px" variant="body3">
              {`(${dateFromNow(blockData.timestamp)})`}
            </Text>
          </Flex>
        </Flex>
      }
      middleContent={
        showProposer && <ValidatorBadge validator={blockData.proposer} />
      }
      middleContent={
        showProposer && <ValidatorBadge validator={blockData.proposer} />
      }
      topContent={
        <Flex align="center" gap={4} w="full">
          <Flex direction="column" flex={1}>
            <MobileLabel label="Block height" />
            <ExplorerLink
              showCopyOnHover
              type="block_height"
              value={blockData.height.toString()}
            >
              {blockData.height}
            </ExplorerLink>
          </Flex>
          <Flex direction="column" flex={{ base: 2, sm: 3 }}>
            <MobileLabel label="Block hash" />
            <Flex align="end" h={6}>
              <Text color="text.main" fontFamily="mono" variant="body2">
                {truncate(blockData.hash.toUpperCase())}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      }
      topContent={
        <Flex align="center" gap={4} w="full">
          <Flex direction="column" flex={1}>
            <MobileLabel label="Block Height" />
            <ExplorerLink
              showCopyOnHover
              type="block_height"
              value={blockData.height.toString()}
            >
              {blockData.height}
            </ExplorerLink>
          </Flex>
          <Flex direction="column" flex={{ base: 2, sm: 3 }}>
            <MobileLabel label="Block Hash" />
            <Flex align="end" h={6}>
              <Text color="text.main" fontFamily="mono" variant="body2">
                {truncate(blockData.hash.toUpperCase())}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/blocks/[blockHeight]",
          query: { blockHeight: blockData.height },
        })
      }
      onClick={() =>
        navigate({
          pathname: "/blocks/[blockHeight]",
          query: { blockHeight: blockData.height },
        })
      }
    />
  );
};
