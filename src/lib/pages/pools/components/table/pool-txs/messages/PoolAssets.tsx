import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import type { TokenWithValue } from "lib/types";
import { getTokenLabel } from "lib/utils";

interface PoolAssetsProps {
  poolId: number;
  tokens: TokenWithValue[];
  outAsset: string;
}

export const PoolAssets = ({ poolId, tokens, outAsset }: PoolAssetsProps) => (
  <Flex alignItems="center" w="full" my={2}>
    <PoolLogo
      tokens={tokens}
      logoSize={5}
      marginLeft={-4}
      textVariant="small"
    />
    <div>
      <Flex
        gap={1}
        css={{
          "p:last-of-type > span": {
            display: "none",
          },
        }}
      >
        {tokens.map((token) => (
          <Text
            key={token.denom}
            variant="body2"
            fontWeight={token.denom === outAsset ? 700 : 400}
            color={token.denom === outAsset ? "honeydew.main" : "text.main"}
          >
            {token.symbol || getTokenLabel(token.denom)}
            <Text as="span" fontWeight={400} color="honeydew.main">
              {" "}
              /
            </Text>
          </Text>
        ))}
      </Flex>
      <ExplorerLink type="pool_id" value={poolId.toString()} showCopyOnHover />
    </div>
  </Flex>
);
