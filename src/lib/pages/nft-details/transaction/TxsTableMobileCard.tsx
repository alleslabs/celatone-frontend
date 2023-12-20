import { Flex } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";

interface TxsTableMobileCardProps {
  hash: string;
  timestamp: string;
}

export const TxsTableMobileCard = ({
  timestamp,
  hash,
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
      middleContent={<Flex />}
      bottomContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">{timestamp}</Flex>
        </Flex>
      }
    />
  );
};
