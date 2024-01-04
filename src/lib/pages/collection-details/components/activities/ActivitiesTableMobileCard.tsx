import { Flex, Text, Box, Stack } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";
import type { Activity } from "lib/services/collection";
import type { HexAddr } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

export const ActivitiesTableMobileCard = ({
  activity,
  collectionAddress,
}: {
  activity: Activity;
  collectionAddress: HexAddr;
}) => {
  const navigate = useInternalNavigate();
  const {
    txhash,
    timestamp,
    isNftBurn,
    isNftMint,
    isNftTransfer,
    isCollectionCreate,
    tokenId,
    nftAddress,
  } = activity;

  const getEventMessage = () => {
    if (isNftBurn) return "Burned";
    if (isNftMint) return "Minted";
    if (isNftTransfer) return "Transferred";
    if (isCollectionCreate) return "Collection created";
    return "-";
  };

  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: txhash.toUpperCase() },
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
            <AppLink
              href={`/nft-collections/${collectionAddress}/nft/${nftAddress}`}
            >
              <Text fontSize="14px" fontWeight={400} color="primary.dark">
                {tokenId}
              </Text>
            </AppLink>
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
          <Text color="gray.400">{formatUTC(timestamp)}</Text>
          <Text color="gray.400">({dateFromNow(timestamp)})</Text>
        </Box>
      }
    />
  );
};
