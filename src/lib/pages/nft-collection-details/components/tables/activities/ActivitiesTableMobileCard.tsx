import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import type { Activity } from "lib/services/types";
import type { HexAddr32 } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { getEventMessage } from "./ActivitiesTableRow";

export const ActivitiesTableMobileCard = ({
  activity,
  collectionAddress,
}: {
  activity: Activity;
  collectionAddress: HexAddr32;
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

  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: txhash.toUpperCase() },
        })
      }
      topContent={
        <ExplorerLink
          value={txhash.toUpperCase()}
          type="tx_hash"
          showCopyOnHover
          ampCopierSection="nft-collection-activities-table"
        />
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
            <Text variant="body2">
              {getEventMessage(
                isNftBurn,
                isNftMint,
                isNftTransfer,
                isCollectionCreate
              )}
            </Text>
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
