import type { Activity } from "lib/services/types";
import type { HexAddr32 } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
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
      bottomContent={
        <Flex direction="column" gap={1}>
          <Text variant="body3">{formatUTC(timestamp)}</Text>
          <Text color="text.dark" variant="body3">
            {`(${dateFromNow(timestamp)})`}
          </Text>
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Token ID" />
            <AppLink
              href={`/nft-collections/${collectionAddress}/nft/${nftAddress}`}
            >
              <Text color="primary.dark" variant="body2">
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
      topContent={
        <ExplorerLink
          ampCopierSection="nft-collection-activities-table"
          showCopyOnHover
          type="tx_hash"
          value={txhash.toUpperCase()}
        />
      }
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: txhash.toUpperCase() },
        })
      }
    />
  );
};
