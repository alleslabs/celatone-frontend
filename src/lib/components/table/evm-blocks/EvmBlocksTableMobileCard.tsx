import type { Block } from "lib/types";

import { Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { dateFromNow, formatUTC, truncate } from "lib/utils";

interface EvmBlocksTableMobileCardProps {
  blockData: Block;
}
export const EvmBlocksTableMobileCard = ({
  blockData,
}: EvmBlocksTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  return (
    <MobileCardTemplate
      bottomContent={
        <Stack gap={3}>
          <Grid gap={3} gridTemplateColumns="1fr 1fr">
            <Flex direction="column" flex={1}>
              <MobileLabel label="EVM Txs" />
              <Flex align="end" h={6}>
                <Text
                  color={blockData.txCount === 0 ? "text.dark" : "text.main"}
                  fontWeight={600}
                  variant="body2"
                >
                  {blockData.txCount}
                </Text>
              </Flex>
            </Flex>
            <Flex direction="column" flex={1}>
              <MobileLabel label="Cosmos Txs" />
              <Flex align="end" h={6}>
                <Text
                  color={blockData.txCount === 0 ? "text.dark" : "text.main"}
                  fontWeight={600}
                  variant="body2"
                >
                  {blockData.txCount}
                </Text>
              </Flex>
            </Flex>
          </Grid>
          <Flex direction="column" flex={{ base: 2, sm: 3 }} gap={0}>
            <Text variant="body3">{formatUTC(blockData.timestamp)}</Text>
            <Text color="text.dark" mt="3px" variant="body3">
              {`(${dateFromNow(blockData.timestamp)})`}
            </Text>
          </Flex>
        </Stack>
      }
      middleContent={<ValidatorBadge validator={blockData.proposer} />}
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
      onClick={() =>
        navigate({
          pathname: "/blocks/[blockHeight]",
          query: { blockHeight: blockData.height },
        })
      }
    />
  );
};
