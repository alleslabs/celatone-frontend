import { Flex } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";

interface ActivitiesTableMobileCardProps {
  hash: string;
  timestamp: string;
}

export const ActivitiesTableMobileCard = ({
  timestamp,
  hash,
}: ActivitiesTableMobileCardProps) => {
  const navigate = useInternalNavigate();
  return (
    <MobileCardTemplate
      onClick={() =>
        navigate({
          pathname: "/txs/[txHash]",
          query: { txHash: hash },
        })
      }
      topContent={
        <Flex align="center" gap={2}>
          <ExplorerLink value={hash} type="tx_hash" showCopyOnHover />
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
