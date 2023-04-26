import { Flex, Text, Box } from "@chakra-ui/react";

import { PoolLogo } from "lib/pages/pool/components/PoolLogo";
import type { AssetInfosOpt } from "lib/services/assetService";
import { getTokenLabel } from "lib/utils";

interface PoolAssetsProps {
  poolId: number;
  assets: string[];
  outAsset: string;
  assetInfos: AssetInfosOpt;
}

export const PoolAssets = ({
  poolId,
  assets,
  outAsset,
  assetInfos,
}: PoolAssetsProps) => (
  <Flex justifyContent="space-between" w="full" my={2}>
    <Flex alignItems="center">
      <PoolLogo
        assets={assets}
        assetInfos={assetInfos}
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
            {assets.map((denom) => (
              <>
                <Text
                  variant="body2"
                  fontWeight={denom === outAsset ? 700 : undefined}
                  color={denom === outAsset ? "honeydew.main" : undefined}
                >
                  {assetInfos?.[denom]?.symbol || getTokenLabel(denom)}
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
