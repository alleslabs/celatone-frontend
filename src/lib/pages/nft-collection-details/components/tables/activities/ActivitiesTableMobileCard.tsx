import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import type { Activity } from "lib/services/nft/collection";
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
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Token ID" />
            <AppLink
              href={`/nft-collections/${collectionAddress}/nft/${nftAddress}`}
            >
              <Text variant="body2" color="primary.dark">
                {tokenId}
              </Text>
            </AppLink>
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Event" />
            <Text variant="body2">{getEventMessage()}</Text>
          </Flex>
        </Flex>
      }
      bottomContent={
        <Flex direction="column" gap={1}>
          <Text variant="body3">{formatUTC(timestamp)}</Text>
          <Text variant="body3" color="text.dark">
            {`(${dateFromNow(timestamp)})`}
          </Text>
        </Flex>
      }
    />
  );
};
