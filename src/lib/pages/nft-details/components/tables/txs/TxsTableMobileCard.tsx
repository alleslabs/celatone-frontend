import { Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

import { getEventMessage } from "./TxsTableRow";

interface TxsTableMobileCardProps {
  hash: string;
  isNftBurn: boolean;
  isNftMint: boolean;
  isNftTransfer: boolean;
  timestamp: Date;
}

export const TxsTableMobileCard = ({
  hash,
  isNftBurn,
  isNftMint,
  isNftTransfer,
  timestamp,
}: TxsTableMobileCardProps) => {
  const navigate = useInternalNavigate();

  return (
    <MobileCardTemplate
      middleContent={
        <Flex direction="column">
          <MobileLabel label="Event" />
          <Text variant="body2">
            {getEventMessage(isNftBurn, isNftMint, isNftTransfer)}
          </Text>
        </Flex>
      }
      bottomContent={
        <Flex gap={0} direction="column">
          <Text color="gray.400" fontSize="12px">
            {formatUTC(timestamp)}
          </Text>
          <Text color="gray.500" fontSize="12px">
            ({dateFromNow(timestamp)})
          </Text>
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: hash.toLocaleUpperCase() },
        })
      }
      topContent={
        <Flex align="center" gap={2}>
          <ExplorerLink
            type="tx_hash"
            value={hash.toLocaleUpperCase()}
            showCopyOnHover
          />
        </Flex>
      }
    />
  );
};
