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
      bottomContent={
        <Flex direction="column" gap={0}>
          <Text color="gray.400" fontSize="12px">
            {formatUTC(timestamp)}
          </Text>
          <Text color="gray.500" fontSize="12px">
            ({dateFromNow(timestamp)})
          </Text>
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
      topContent={
        <Flex align="center" gap={2}>
          <ExplorerLink
            showCopyOnHover
            type="tx_hash"
            value={hash.toLocaleUpperCase()}
          />
        </Flex>
      }
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: hash.toLocaleUpperCase() },
        })
      }
    />
  );
};
