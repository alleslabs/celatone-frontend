import type { PoolData } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";

interface PoolLogoLinkProps {
  pool: PoolData;
  ampCopierSection?: string;
}

export const PoolLogoLink = ({ ampCopierSection, pool }: PoolLogoLinkProps) => (
  <Flex gap={1}>
    <PoolLogo logoSize={5} marginLeft={-4} minW={0} tokens={pool.liquidity} />
    <ExplorerLink
      ampCopierSection={ampCopierSection}
      showCopyOnHover
      type="pool_id"
      value={pool.id.toString()}
    />
  </Flex>
);
