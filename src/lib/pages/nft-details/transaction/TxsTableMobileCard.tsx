import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxsTableMobileCardProps {
  hash: string;
  timestamp: Date;
  isNftBurn: boolean;
  isNftMint: boolean;
  isNftTransfer: boolean;
}

export const TxsTableMobileCard = ({
  timestamp,
  hash,
  isNftBurn,
  isNftMint,
  isNftTransfer,
}: TxsTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  let eventType;
  if (isNftBurn) {
    eventType = "Burned";
  }
  if (isNftMint) {
    eventType = "Minted";
  }
  if (isNftTransfer) {
    eventType = "Transferred";
  }
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: hash.toLocaleUpperCase() },
        })
      }
      topContent={
        <Flex align="center" gap={2}>
          <ExplorerLink
            value={hash.toLocaleUpperCase()}
            type="tx_hash"
            showCopyOnHover
          />
        </Flex>
      }
      middleContent={
        <Flex gap="8px" align="center">
          <Text variant="body2" color="text.main">
            {eventType}
          </Text>
        </Flex>
      }
      bottomContent={
        <Flex direction="column" gap={0}>
          <Text fontSize="12px" color="gray.400">
            {formatUTC(timestamp)}
          </Text>
          <Text fontSize="12px" color="gray.500">
            ({dateFromNow(timestamp)})
          </Text>
        </Flex>
      }
    />
  );
};
