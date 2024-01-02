import { Badge, Flex, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxsTableMobileCardProps {
  hash: string;
  timestamp: string;
  isNFTBurn: boolean;
  isNFTMint: boolean;
  isNFTTransfer: boolean;
}

export const TxsTableMobileCard = ({
  timestamp,
  hash,
  isNFTBurn,
  isNFTMint,
  isNFTTransfer,
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
        <Flex gap="8px" align="center">
          <Text fontSize="14px">Event</Text>
          <Flex gap="8px">
            {isNFTBurn && <Badge textTransform="capitalize">Burn</Badge>}
            {isNFTMint && <Badge textTransform="capitalize">Mint</Badge>}
            {isNFTTransfer && (
              <Badge textTransform="capitalize">Transfer</Badge>
            )}
          </Flex>
        </Flex>
      }
      bottomContent={
        <Flex direction="column" gap={0}>
          <Text fontSize="12px" color="gray.400">
            {formatUTC(new Date(timestamp))}
          </Text>
          <Text fontSize="12px" color="gray.500">
            ({dateFromNow(new Date(timestamp))})
          </Text>
        </Flex>
      }
    />
  );
};
