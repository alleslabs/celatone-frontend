import { Flex, Text, Box } from "@chakra-ui/react";

import { PoolLogo } from "lib/pages/pools/components/PoolLogo";
import type { TokenWithValue } from "lib/types";
import { getTokenLabel } from "lib/utils";

interface PoolAssetsProps {
  poolId: number;
  tokens: TokenWithValue[];
  outAsset: string;
}

export const PoolAssets = ({ poolId, tokens, outAsset }: PoolAssetsProps) => (
  <Flex justifyContent="space-between" w="full" my={2}>
    <Flex alignItems="center">
      <PoolLogo
        tokens={tokens}
        logoSize={5}
        marginLeft={-4}
        textVariant="small"
      />
      <Box>
        <Flex gap={1}>
          <Flex
            gap={1}
            css={{
              "p:last-child": {
                display: "none",
              },
            }}
          >
            {tokens.map((token) => (
              <>
                <Text
                  variant="body2"
                  fontWeight={token.denom === outAsset ? 700 : undefined}
                  color={token.denom === outAsset ? "honeydew.main" : undefined}
                >
                  {token.symbol || getTokenLabel(token.denom)}
                </Text>
                <Text as="p" variant="body2" color="honeydew.main">
                  /
                </Text>
              </>
            ))}
          </Flex>
        </Flex>
        <Text variant="body2" color="lilac.main">
          {poolId}
        </Text>
      </Box>
    </Flex>
  </Flex>
);
