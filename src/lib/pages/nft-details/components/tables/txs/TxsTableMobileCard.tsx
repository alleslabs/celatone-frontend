import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

import { getEventMessage } from "./TxsTableRow";

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
        <Flex direction="column">
          <MobileLabel label="Event" />
          <Text variant="body2">
            {getEventMessage(isNftBurn, isNftMint, isNftTransfer)}
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
