import { Flex } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import type { PoolData } from "lib/types";

interface PoolLogoLinkProps {
  ampCopierSection?: string;
  pool: PoolData;
}

export const PoolLogoLink = ({ ampCopierSection, pool }: PoolLogoLinkProps) => (
  <Flex gap={1}>
    <PoolLogo marginLeft={-4} minW={0} logoSize={5} tokens={pool.liquidity} />
    <ExplorerLink
      type="pool_id"
      value={pool.id.toString()}
      ampCopierSection={ampCopierSection}
      showCopyOnHover
    />
  </Flex>
);
