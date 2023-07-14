import { Flex } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import type { PoolDetail } from "lib/types";

interface PoolLogoLinkProps {
  pool: PoolDetail;
  ampCopierSection?: string;
}

export const PoolLogoLink = ({ pool, ampCopierSection }: PoolLogoLinkProps) => (
  <Flex gap={1}>
    <PoolLogo
      tokens={pool.poolLiquidity}
      logoSize={5}
      marginLeft={-4}
      minW={0}
    />
    <ExplorerLink
      type="pool_id"
      value={pool.id.toString()}
      showCopyOnHover
      ampCopierSection={ampCopierSection}
    />
  </Flex>
);
