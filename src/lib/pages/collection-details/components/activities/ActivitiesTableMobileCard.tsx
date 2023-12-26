import { Flex, Text, Box, Stack } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";
import type { Activity } from "lib/services/collection";
import { dateFromNow, formatUTC } from "lib/utils";

export const ActivitiesTableMobileCard = ({
  activity,
}: {
  activity: Activity;
}) => {
  const navigate = useInternalNavigate();
  const { txhash, timestamp, isNFTBurn, isNFTMint, isNFTTransfer, tokenId } =
    activity;

  const getEventMessage = () => {
    if (isNFTBurn) return "Burned";
    if (isNFTMint) return "Minted";
    if (isNFTTransfer) return "Transferred";
    return "-";
  };

  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: txhash },
        })
      }
      topContent={
        <Flex align="center" gap={2}>
          <ExplorerLink value={txhash} type="tx_hash" showCopyOnHover />
        </Flex>
      }
      middleContent={
        <Stack spacing="12px">
          <Box>
            <Text fontSize="12px" fontWeight={600} color="gray.400">
              Token Id
            </Text>
            <Text fontSize="14px" fontWeight={400}>
              {tokenId}
            </Text>
          </Box>
          <Box>
            <Text fontSize="12px" fontWeight={600} color="gray.400">
              Event
            </Text>
            <Text fontSize="14px" fontWeight={400}>
              {getEventMessage()}
            </Text>
          </Box>
        </Stack>
      }
      bottomContent={
        <Box fontSize="12px" fontWeight={400}>
          <Text color="gray.400">{formatUTC(new Date(timestamp))}</Text>
          <Text color="gray.400">({dateFromNow(new Date(timestamp))})</Text>
        </Box>
      }
    />
  );
};
