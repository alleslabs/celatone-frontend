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
    isCollectionCreate,
    isNftBurn,
    isNftMint,
    isNftTransfer,
    nftAddress,
    timestamp,
    tokenId,
    txhash,
  } = activity;

  return (
    <MobileCardTemplate
      middleContent={
        <Flex gap={3} direction="column">
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
        <Flex gap={1} direction="column">
          <Text variant="body3">{formatUTC(timestamp)}</Text>
          <Text variant="body3" color="text.dark">
            {`(${dateFromNow(timestamp)})`}
          </Text>
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: txhash.toUpperCase() },
        })
      }
      topContent={
        <ExplorerLink
          type="tx_hash"
          value={txhash.toUpperCase()}
          ampCopierSection="nft-collection-activities-table"
          showCopyOnHover
        />
      }
    />
  );
};
