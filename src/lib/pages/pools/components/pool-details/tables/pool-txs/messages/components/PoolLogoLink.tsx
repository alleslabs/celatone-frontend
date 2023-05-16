import { Flex } from "@chakra-ui/react";
import type Big from "big.js";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import type { PoolDetail, TokenWithValue } from "lib/types";

interface PoolLogoLinkProps {
  pool: PoolDetail<Big, TokenWithValue>;
}

export const PoolLogoLink = ({ pool }: PoolLogoLinkProps) => (
  <Flex gap={1}>
    <PoolLogo
      tokens={pool.poolLiquidity}
      logoSize={5}
      marginLeft={-4}
      minW={0}
      textVariant="small"
    />
    <ExplorerLink type="pool_id" value={pool.id.toString()} showCopyOnHover />
  </Flex>
);
